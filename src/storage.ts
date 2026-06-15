import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import type { FlameData, DayRecord, SuccessEvent, DateString, LangStat, StreakSettings } from "./types";
import { emptyDay } from "./types";
import { checkAchievements, ACHIEVEMENTS } from "./achievements";
import { xpForEdit, xpForSaves, xpForEvent, rehydrateXp } from "./xp";

const STORAGE_KEY = "flametrack.data.v2";
const DEBOUNCE_MS = 3000;

export function toDateString(d: Date = new Date()): DateString {
  return d.toISOString().slice(0, 10);
}

function emptyData(): FlameData {
  return {
    version: 2,
    activity: {},
    bestStreak: 0,
    currentStreak: 0,
    lastActiveDate: null,
    totalLinesAdded: 0,
    totalLinesRemoved: 0,
    totalSaves: 0,
    totalActiveMinutes: 0,
    totalXp: 0,
    unlockedAchievements: [],
    achievementDates: {},
  };
}

/**
 * Migrate old data that's missing new fields.
 *
 * For data that predates the XP/achievements system (no totalXp field),
 * we backfill unlocked achievements based on existing lifetime stats,
 * then rehydrate totalXp from scratch so old users don't start at 0/Level 1
 * despite having years of history.
 */
function migrate(data: FlameData): FlameData {
  const isPreXpData = data.totalXp === undefined;

  if (data.totalXp === undefined) data.totalXp = 0;
  if (!data.unlockedAchievements) data.unlockedAchievements = [];
  if (!data.achievementDates) data.achievementDates = {};

  // Ensure every DayRecord has hourlyActivity
  for (const day of Object.values(data.activity)) {
    if (!day.hourlyActivity) {
      day.hourlyActivity = new Array(24).fill(0);
    }
  }

  if (isPreXpData) {
    // Backfill achievements the user already qualifies for, then
    // recompute totalXp from scratch (activity + achievement rewards).
    checkAchievements(data);
    rehydrateXp(data);
  }

  return data;
}

export class FlameStorage {
  private data: FlameData;
  private jsonPath: string;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  /** Callbacks fired when achievements unlock */
  private achievementCallbacks: Array<(unlocks: { id: string; name: string; icon: string; xpReward: number }[]) => void> = [];

  constructor(private readonly ctx: vscode.ExtensionContext) {
    const dir = ctx.globalStorageUri.fsPath;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.jsonPath = path.join(dir, "flametrack-v2.json");
    this.data = this.load();
  }

  getData(): Readonly<FlameData> { return this.data; }

  onAchievementUnlock(cb: (unlocks: { id: string; name: string; icon: string; xpReward: number }[]) => void): void {
    this.achievementCallbacks.push(cb);
  }

  // ── Day record helpers ───────────────────────────────────────────────────

  private ensureDay(date: DateString): DayRecord {
    if (!this.data.activity[date]) {
      this.data.activity[date] = emptyDay(date);
    }
    // Guard: migrate existing day if missing hourlyActivity
    if (!this.data.activity[date].hourlyActivity) {
      this.data.activity[date].hourlyActivity = new Array(24).fill(0);
    }
    return this.data.activity[date];
  }

  // ── Code metrics ─────────────────────────────────────────────────────────

  recordEdit(opts: {
    linesAdded: number;
    linesRemoved: number;
    chars: number;
    lang: string;
    fileName: string;
    workspace: string;
    activeMinutesDelta: number;
  }): void {
    const today = toDateString();
    const day = this.ensureDay(today);

    day.linesAdded += opts.linesAdded;
    day.linesRemoved += opts.linesRemoved;
    day.keystrokes += opts.chars;
    day.activeMinutes += opts.activeMinutesDelta;
    if (day.sessionStart === null) day.sessionStart = Date.now();

    // Hourly bucket
    const hour = new Date().getHours();
    day.hourlyActivity[hour] = (day.hourlyActivity[hour] ?? 0) + opts.linesAdded;

    // Track unique files (basename only for privacy)
    const base = path.basename(opts.fileName);
    if (!day.filesEdited.includes(base)) day.filesEdited.push(base);

    // Per-language breakdown
    if (!day.byLang[opts.lang]) {
      day.byLang[opts.lang] = { linesAdded: 0, linesRemoved: 0, filesEdited: 0 };
    }
    day.byLang[opts.lang].linesAdded += opts.linesAdded;
    day.byLang[opts.lang].linesRemoved += opts.linesRemoved;
    day.byLang[opts.lang].filesEdited++;

    // Per-project breakdown
    if (!day.byProject[opts.workspace]) {
      day.byProject[opts.workspace] = { name: opts.workspace, linesAdded: 0, linesRemoved: 0, activeMinutes: 0 };
    }
    day.byProject[opts.workspace].linesAdded += opts.linesAdded;
    day.byProject[opts.workspace].linesRemoved += opts.linesRemoved;
    day.byProject[opts.workspace].activeMinutes += opts.activeMinutesDelta;

    // All-time totals
    this.data.totalLinesAdded += opts.linesAdded;
    this.data.totalLinesRemoved += opts.linesRemoved;
    this.data.totalActiveMinutes += opts.activeMinutesDelta;

    // XP
    const xp = xpForEdit(opts);
    this.data.totalXp += xp;

    // Editing might have just crossed the active-minutes or lines-added
    // streak threshold for today — re-evaluate.
    this.recalcStreak(today);

    this.fireAchievements();
    this.scheduleSave();
  }

  recordSave(): void {
    const today = toDateString();
    const day = this.ensureDay(today);
    day.saves++;
    this.data.totalSaves++;

    // XP: every 5th save = 1 XP (cheap — we track delta)
    if (this.data.totalSaves % 5 === 0) this.data.totalXp += 1;

    this.scheduleSave();
  }

  // ── Terminal / streak ────────────────────────────────────────────────────

  recordSuccess(event: SuccessEvent): boolean {
    const today = toDateString();
    const isFirst = !this.data.activity[today]?.events?.length;
    const day = this.ensureDay(today);
    day.events.push(event);
    this.data.totalXp += xpForEvent();
    this.recalcStreak(today);
    this.fireAchievements();
    this.scheduleSave();
    return isFirst;
  }

  /**
   * Incrementally update the streak based on whether `today` now qualifies
   * (see `dayQualifiesForStreak`). Safe to call repeatedly — it's a no-op
   * once today has already been counted.
   *
   * Capture rules (any one is enough for a day to count):
   *   - at least one event (build/test/git push success, or manual check-in)
   *   - active minutes >= flametrack.streak.minActiveMinutes
   *   - lines added    >= flametrack.streak.minLinesAdded
   *
   * If `flametrack.streak.weekendFreeze` is enabled, Saturdays and Sundays
   * that don't qualify don't break the chain — they're skipped over.
   */
  recalcStreak(today: string = toDateString()): void {
    const day = this.data.activity[today];
    const settings = this.getStreakSettings();
    if (!dayQualifiesForStreak(day, settings)) return; // today not yet "captured"
    if (this.data.lastActiveDate === today) return;     // already counted

    if (!this.data.lastActiveDate) {
      this.data.currentStreak = 1;
    } else {
      const diff = dateDiffDays(this.data.lastActiveDate, today);
      if (diff === 1 || (diff > 1 && allDatesFrozen(this.data.lastActiveDate, today, settings))) {
        this.data.currentStreak += 1;
      } else {
        this.data.currentStreak = 1;
      }
    }

    if (this.data.currentStreak > this.data.bestStreak) {
      this.data.bestStreak = this.data.currentStreak;
    }
    this.data.lastActiveDate = today;
  }

  /**
   * Run at startup and hourly. Detects a broken chain: if more than one day
   * has passed since `lastActiveDate` and the gap isn't fully covered by
   * weekend freeze days, the streak is reset to 0 (today can still start a
   * fresh streak via `recalcStreak` once it qualifies).
   */
  checkStreakIntegrity(): void {
    if (!this.data.lastActiveDate) return;
    const today = toDateString();
    if (this.data.lastActiveDate === today) return;

    const diff = dateDiffDays(this.data.lastActiveDate, today);
    if (diff <= 1) return; // yesterday — chain still alive, pending today

    const settings = this.getStreakSettings();
    if (!allDatesFrozen(this.data.lastActiveDate, today, settings)) {
      this.data.currentStreak = 0;
    }
  }

  /** Read streak capture settings from VS Code configuration (live, no caching). */
  getStreakSettings(): StreakSettings {
    const cfg = vscode.workspace.getConfiguration("flametrack");
    return {
      minActiveMinutes: cfg.get<number>("streak.minActiveMinutes", 5),
      minLinesAdded: cfg.get<number>("streak.minLinesAdded", 10),
      weekendFreeze: cfg.get<boolean>("streak.weekendFreeze", true),
    };
  }

  // ── Achievements ─────────────────────────────────────────────────────────

  private fireAchievements(): void {
    const newUnlocks = checkAchievements(this.data);
    if (newUnlocks.length > 0) {
      this.achievementCallbacks.forEach(cb => cb(newUnlocks));
    }
  }

  // ── Export ────────────────────────────────────────────────────────────────

  exportMarkdown(): string {
    const { currentStreak, bestStreak, activity, totalLinesAdded, totalLinesRemoved, totalActiveMinutes, totalXp, unlockedAchievements } = this.data;
    const totalDays = Object.keys(activity).length;
    const hours = Math.round(totalActiveMinutes / 60);

    const lines = [
      "# 🔥 FlameTrack Stats",
      "",
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Current streak | ${currentStreak} days |`,
      `| Best streak | ${bestStreak} days |`,
      `| Active days | ${totalDays} |`,
      `| Lines added | ${fmt(totalLinesAdded)} |`,
      `| Lines removed | ${fmt(totalLinesRemoved)} |`,
      `| Active time | ${hours}h |`,
      `| Total XP | ${fmt(totalXp)} |`,
      `| Achievements | ${unlockedAchievements.length} / ${ACHIEVEMENTS.length} |`,
      "",
      "## Activity Log",
      "",
    ];

    const sortedDates = Object.keys(activity).sort().reverse();
    for (const date of sortedDates.slice(0, 90)) {
      const day = activity[date];
      const langs = Object.keys(day.byLang).join(", ");
      lines.push(`### ${date}  +${fmt(day.linesAdded)} / -${fmt(day.linesRemoved)} lines  ⏱ ${day.activeMinutes}min`);
      if (langs) lines.push(`> ${langs}`);
      for (const ev of day.events) {
        const icon = ev.kind === "git" ? "📤" : ev.kind === "manual" ? "✋" : "✅";
        lines.push(`- ${icon} \`${ev.label}\``);
      }
      lines.push("");
    }

    return lines.join("\n");
  }

  // ── Persistence ───────────────────────────────────────────────────────────

  private load(): FlameData {
    try {
      if (fs.existsSync(this.jsonPath)) {
        const parsed = JSON.parse(fs.readFileSync(this.jsonPath, "utf8")) as FlameData;
        if (parsed?.version === 2) return migrate(parsed);
      }
    } catch { /* fall through */ }
    const fromState = this.ctx.globalState.get<FlameData>(STORAGE_KEY);
    if (fromState?.version === 2) return migrate(fromState);
    return emptyData();
  }

  private scheduleSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flush(), DEBOUNCE_MS);
  }

  flush(): void {
    if (this.saveTimer) { clearTimeout(this.saveTimer); this.saveTimer = null; }
    try { fs.writeFileSync(this.jsonPath, JSON.stringify(this.data), "utf8"); } catch { /* ignore */ }
    this.ctx.globalState.update(STORAGE_KEY, this.data);
  }
}

function dateDiffDays(from: DateString, to: DateString): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000);
}

function fmt(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}

// ── Streak capture helpers ──────────────────────────────────────────────────

/**
 * Does this day "count" toward the streak?
 * True if it has at least one event (build/test/git push/manual check-in),
 * or meets the configured active-minutes / lines-added thresholds.
 */
export function dayQualifiesForStreak(day: DayRecord | undefined, settings: StreakSettings): boolean {
  if (!day) return false;
  if (day.events.length > 0) return true;
  if (day.activeMinutes >= settings.minActiveMinutes) return true;
  if (day.linesAdded >= settings.minLinesAdded) return true;
  return false;
}

/** Saturday or Sunday, by UTC day-of-week (matches toDateString's UTC-based keys). */
function isWeekend(dateStr: DateString): boolean {
  const dow = new Date(dateStr + "T00:00:00Z").getUTCDay();
  return dow === 0 || dow === 6;
}

/** All date strings strictly between `fromStr` and `toStr` (both exclusive). */
function datesBetweenExclusive(fromStr: DateString, toStr: DateString): DateString[] {
  const result: DateString[] = [];
  const cursor = new Date(fromStr + "T00:00:00Z");
  const end = new Date(toStr + "T00:00:00Z");
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  while (cursor < end) {
    result.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}

/**
 * True if every day strictly between `fromStr` and `toStr` is a weekend day
 * AND weekend freeze is enabled — i.e. the gap is fully "absorbed" by
 * automatic weekend freezes and shouldn't break the streak.
 * Returns false for adjacent dates (no gap to check) since that case is
 * handled separately as a normal +1 day continuation.
 */
function allDatesFrozen(fromStr: DateString, toStr: DateString, settings: StreakSettings): boolean {
  if (!settings.weekendFreeze) return false;
  const gap = datesBetweenExclusive(fromStr, toStr);
  return gap.length > 0 && gap.every(isWeekend);
}