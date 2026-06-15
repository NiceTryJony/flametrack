/** ISO date string, e.g. "2025-06-13" */
export type DateString = string;

export interface SuccessEvent {
  ts: number;
  label: string;
  kind: EventKind;
  workspace?: string;
  tech?: string;
}

export type EventKind = "terminal" | "git" | "manual";

/** Per-language line stats */
export interface LangStat {
  linesAdded: number;
  linesRemoved: number;
  filesEdited: number;
}

/** Per-project (workspace) stats for a day */
export interface ProjectStat {
  name: string;
  linesAdded: number;
  linesRemoved: number;
  activeMinutes: number;
}

/** Rich per-day record */
export interface DayRecord {
  date: DateString;
  events: SuccessEvent[];

  // ── Code metrics ──────────────────────────────────────────
  linesAdded: number;
  linesRemoved: number;
  filesEdited: string[];      // unique file paths (basename only)
  saves: number;
  keystrokes: number;         // character-level proxy

  // ── Time metrics ──────────────────────────────────────────
  activeMinutes: number;      // idle-aware (idle = >2 min gap)
  sessionStart: number | null; // timestamp of first edit

  // ── Breakdowns ────────────────────────────────────────────
  byLang: Record<string, LangStat>;
  byProject: Record<string, ProjectStat>;

  // ── Hourly activity heatmap (24 buckets: index = hour 0–23) ──────────────
  hourlyActivity: number[];   // lines added per hour of the day
}

export function emptyDay(date: DateString): DayRecord {
  return {
    date,
    events: [],
    linesAdded: 0,
    linesRemoved: 0,
    filesEdited: [],
    saves: 0,
    keystrokes: 0,
    activeMinutes: 0,
    sessionStart: null,
    byLang: {},
    byProject: {},
    hourlyActivity: new Array(24).fill(0),
  };
}

export interface FlameData {
  version: 2;
  activity: Record<DateString, DayRecord>;
  bestStreak: number;
  currentStreak: number;
  lastActiveDate: DateString | null;
  // All-time totals (fast access for header cards)
  totalLinesAdded: number;
  totalLinesRemoved: number;
  totalSaves: number;
  totalActiveMinutes: number;
  // ── XP / Levels ────────────────────────────────────────────
  totalXp: number;
  // ── Achievements ───────────────────────────────────────────
  unlockedAchievements: string[];   // achievement IDs
  achievementDates: Record<string, DateString>; // id → date unlocked
}

export type WebviewMessage =
  | { type: "request_data" }
  | { type: "mark_today_manual" }
  | { type: "export_markdown" }
  | { type: "set_tab"; tab: string };

export type ExtensionMessage =
  | { type: "data"; payload: FlameData; streakSettings: StreakSettings; achievementProgress: AchievementProgress[] }
  | { type: "export_ready"; markdown: string };

// ── Streak capture settings ─────────────────────────────────────────────────

/**
 * Configurable criteria for what counts as a "captured" streak day.
 * A day qualifies if it has at least one event (build/test/git push/manual
 * check-in) OR meets the active-minutes threshold OR the lines-added threshold.
 * Weekend days can optionally be auto-frozen (don't break the chain even if
 * they don't qualify).
 */
export interface StreakSettings {
  minActiveMinutes: number;
  minLinesAdded: number;
  weekendFreeze: boolean;
}

// ── XP & Levels ───────────────────────────────────────────────────────────────

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;   // total XP to REACH this level
  xpToNext: number;     // XP required to reach next level from this level
  icon: string;
}

// ── Achievements ──────────────────────────────────────────────────────────────

export type AchievementCategory = "streak" | "code" | "time" | "habit" | "build" | "special";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  xpReward: number;
  /** Returns true when the achievement should unlock */
  check: (data: FlameData) => boolean;
  /**
   * Optional: returns current/target for a Steam-style progress bar.
   * If omitted the achievement is treated as binary (0 % or 100 %).
   */
  progress?: (data: FlameData) => { current: number; target: number };
}

export interface AchievementUnlock {
  id: string;
  name: string;
  icon: string;
  xpReward: number;
}

/**
 * Fully-resolved, JSON-serializable snapshot of one achievement,
 * ready to send to the webview. Produced by getAchievementProgressList().
 */
export interface AchievementProgress {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  xpReward: number;
  unlocked: boolean;
  unlockedDate?: string;
  current: number;
  target: number;
  pct: number;
}