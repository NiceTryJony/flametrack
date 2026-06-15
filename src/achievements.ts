/**
 * FlameTrack — Achievements System.
 *
 * All achievement definitions live here. Each achievement is either:
 *   - binary (just `check`), or
 *   - metric-based (`check` + `progress`), giving a Steam-style
 *     "current / target" readout for a progress bar.
 *
 * Call `checkAchievements(data)` after any state mutation to unlock new ones.
 * Call `getAchievementProgressList(data)` to get the full, ready-to-render
 * list (including progress bars) for the webview — no formula duplication
 * needed on the frontend.
 */

import type { FlameData, AchievementDef, AchievementUnlock, AchievementProgress, DateString } from "./types";

// ── Metric helpers ────────────────────────────────────────────────────────────

function totalLinesAdded(d: FlameData): number { return d.totalLinesAdded; }
function totalLinesRemoved(d: FlameData): number { return d.totalLinesRemoved; }
function totalActiveMinutes(d: FlameData): number { return d.totalActiveMinutes; }
function totalSaves(d: FlameData): number { return d.totalSaves; }
function totalXp(d: FlameData): number { return d.totalXp; }
function bestStreak(d: FlameData): number { return d.bestStreak; }

function totalDays(d: FlameData): number {
  return Object.keys(d.activity).length;
}

function totalEvents(d: FlameData): number {
  return Object.values(d.activity).reduce((s, day) => s + (day.events?.length ?? 0), 0);
}

function gitPushCount(d: FlameData): number {
  return Object.values(d.activity).reduce((s, day) =>
    s + (day.events?.filter(e => e.kind === "git").length ?? 0), 0);
}

function totalFilesEdited(d: FlameData): number {
  const files = new Set<string>();
  Object.values(d.activity).forEach(day => (day.filesEdited ?? []).forEach(f => files.add(f)));
  return files.size;
}

function maxDayLines(d: FlameData): number {
  return Math.max(0, ...Object.values(d.activity).map(day => day.linesAdded));
}

function maxDayActiveMinutes(d: FlameData): number {
  return Math.max(0, ...Object.values(d.activity).map(day => day.activeMinutes));
}

function maxLateNightLines(d: FlameData): number {
  return Math.max(0, ...Object.values(d.activity).map(day => {
    const h = day.hourlyActivity ?? [];
    return (h[22] ?? 0) + (h[23] ?? 0) + (h[0] ?? 0) + (h[1] ?? 0) + (h[2] ?? 0) + (h[3] ?? 0);
  }));
}

function maxEarlyMorningLines(d: FlameData): number {
  return Math.max(0, ...Object.values(d.activity).map(day => {
    const h = day.hourlyActivity ?? [];
    return (h[5] ?? 0) + (h[6] ?? 0) + (h[7] ?? 0);
  }));
}

function maxLunchLines(d: FlameData): number {
  return Math.max(0, ...Object.values(d.activity).map(day => {
    const h = day.hourlyActivity ?? [];
    return (h[12] ?? 0) + (h[13] ?? 0);
  }));
}

function isWeekendDate(dateStr: DateString): boolean {
  const dow = new Date(dateStr + "T00:00:00Z").getUTCDay();
  return dow === 0 || dow === 6;
}

function weekendActiveDays(d: FlameData): number {
  return Object.entries(d.activity).filter(([date, day]) =>
    isWeekendDate(date) && (day.linesAdded > 0 || day.activeMinutes > 0 || (day.events?.length ?? 0) > 0)
  ).length;
}

function refactorDays(d: FlameData): number {
  return Object.values(d.activity).filter(day =>
    day.linesRemoved > 0 && day.linesRemoved > day.linesAdded
  ).length;
}

function maxDayFiles(d: FlameData): number {
  return Math.max(0, ...Object.values(d.activity).map(day => (day.filesEdited ?? []).length));
}

function maxLinesInOneLang(d: FlameData): number {
  const map: Record<string, number> = {};
  Object.values(d.activity).forEach(day => {
    Object.entries(day.byLang ?? {}).forEach(([lang, s]) => {
      map[lang] = (map[lang] ?? 0) + s.linesAdded;
    });
  });
  return Math.max(0, ...Object.values(map));
}

function polyglotLangs(d: FlameData): number {
  const map: Record<string, number> = {};
  Object.values(d.activity).forEach(day => {
    Object.entries(day.byLang ?? {}).forEach(([lang, s]) => {
      map[lang] = (map[lang] ?? 0) + s.linesAdded;
    });
  });
  return Object.values(map).filter(v => v >= 100).length;
}

function activeWeeks(d: FlameData): number {
  const days = Object.keys(d.activity);
  if (days.length === 0) return 0;
  const sorted = [...days].sort((a, b) => a.localeCompare(b));
  let weeks = 0;
  let weekStart = new Date(sorted[0] + "T00:00:00Z");
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  const today = new Date();
  while (weekStart <= today) {
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    const hasActivity = sorted.some(ds => {
      const dd = new Date(ds + "T00:00:00Z");
      return dd >= weekStart && dd <= weekEnd;
    });
    if (hasActivity) weeks++;
    weekStart.setUTCDate(weekStart.getUTCDate() + 7);
  }
  return weeks;
}

// ── Achievement factory ──────────────────────────────────────────────────────

function metricAchievement(opts: {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementDef["category"];
  xpReward: number;
  metric: (d: FlameData) => number;
  target: number;
}): AchievementDef {
  return {
    id: opts.id,
    name: opts.name,
    description: opts.description,
    icon: opts.icon,
    category: opts.category,
    xpReward: opts.xpReward,
    check: d => opts.metric(d) >= opts.target,
    progress: d => ({ current: Math.min(opts.metric(d), opts.target), target: opts.target }),
  };
}

// ── Achievement catalogue ─────────────────────────────────────────────────────

export const ACHIEVEMENTS: AchievementDef[] = [

  // ── Streak ────────────────────────────────────────────────────────────────
  metricAchievement({ id: "streak_3",   name: "Hat Trick",       description: "3-day coding streak",               icon: "🎩", category: "streak", xpReward: 30,    metric: bestStreak, target: 3 }),
  metricAchievement({ id: "streak_7",   name: "Week Warrior",    description: "7-day coding streak",               icon: "🔥", category: "streak", xpReward: 100,   metric: bestStreak, target: 7 }),
  metricAchievement({ id: "streak_14",  name: "Two Weeks",       description: "14-day coding streak",              icon: "💪", category: "streak", xpReward: 250,   metric: bestStreak, target: 14 }),
  metricAchievement({ id: "streak_30",  name: "Monthly Grind",   description: "30-day coding streak",              icon: "📅", category: "streak", xpReward: 600,   metric: bestStreak, target: 30 }),
  metricAchievement({ id: "streak_60",  name: "Iron Coder",      description: "60-day coding streak",              icon: "⚙️", category: "streak", xpReward: 1200,  metric: bestStreak, target: 60 }),
  metricAchievement({ id: "streak_100", name: "Century",         description: "100-day coding streak",             icon: "💯", category: "streak", xpReward: 2500,  metric: bestStreak, target: 100 }),
  metricAchievement({ id: "streak_200", name: "Unstoppable",     description: "200-day coding streak",             icon: "🌊", category: "streak", xpReward: 5000,  metric: bestStreak, target: 200 }),
  metricAchievement({ id: "streak_365", name: "Full Revolution", description: "365-day coding streak. Legendary.", icon: "🌍", category: "streak", xpReward: 10000, metric: bestStreak, target: 365 }),

  // ── Code: lines added ─────────────────────────────────────────────────────
  metricAchievement({ id: "lines_100",  name: "First Steps",     description: "Write 100 lines of code",           icon: "👶", category: "code", xpReward: 10,    metric: totalLinesAdded, target: 100 }),
  metricAchievement({ id: "lines_1k",   name: "Getting There",   description: "Write 1,000 lines of code",         icon: "🚶", category: "code", xpReward: 50,    metric: totalLinesAdded, target: 1_000 }),
  metricAchievement({ id: "lines_5k",   name: "Codesmith",       description: "Write 5,000 lines of code",         icon: "🔨", category: "code", xpReward: 150,   metric: totalLinesAdded, target: 5_000 }),
  metricAchievement({ id: "lines_10k",  name: "Ten Thousand",    description: "Write 10,000 lines of code",        icon: "📝", category: "code", xpReward: 300,   metric: totalLinesAdded, target: 10_000 }),
  metricAchievement({ id: "lines_25k",  name: "Quarter Million", description: "Write 25,000 lines of code",        icon: "📚", category: "code", xpReward: 600,   metric: totalLinesAdded, target: 25_000 }),
  metricAchievement({ id: "lines_50k",  name: "Half Centurion",  description: "Write 50,000 lines of code",        icon: "⚔️", category: "code", xpReward: 1200,  metric: totalLinesAdded, target: 50_000 }),
  metricAchievement({ id: "lines_100k", name: "Six Figures",     description: "Write 100,000 lines of code",       icon: "💰", category: "code", xpReward: 2500,  metric: totalLinesAdded, target: 100_000 }),
  metricAchievement({ id: "lines_500k", name: "Half a Million",  description: "Write 500,000 lines of code",       icon: "🏛️", category: "code", xpReward: 7500,  metric: totalLinesAdded, target: 500_000 }),
  metricAchievement({ id: "lines_1m",   name: "The Million",     description: "Write 1,000,000 lines of code",     icon: "🌋", category: "code", xpReward: 20000, metric: totalLinesAdded, target: 1_000_000 }),

  // ── Code: deletion & refactoring ─────────────────────────────────────────
  metricAchievement({ id: "rm_500",         name: "Cleanup Crew",    description: "Delete 500 lines",               icon: "🧹", category: "code", xpReward: 50,   metric: totalLinesRemoved, target: 500 }),
  metricAchievement({ id: "rm_5k",          name: "The Eraser",      description: "Delete 5,000 lines",             icon: "🗑️", category: "code", xpReward: 200,  metric: totalLinesRemoved, target: 5_000 }),
  metricAchievement({ id: "rm_25k",         name: "Great Purge",     description: "Delete 25,000 lines",            icon: "🔥", category: "code", xpReward: 600,  metric: totalLinesRemoved, target: 25_000 }),
  metricAchievement({ id: "rm_100k",        name: "Nuclear Option",  description: "Delete 100,000 lines",           icon: "💥", category: "code", xpReward: 2000, metric: totalLinesRemoved, target: 100_000 }),
  metricAchievement({ id: "refactor_days_5",  name: "Refactor Fan",  description: "5 days where you deleted more than you wrote",  icon: "♻️", category: "code", xpReward: 150, metric: refactorDays, target: 5 }),
  metricAchievement({ id: "refactor_days_20", name: "Less Is More",  description: "20 refactor-heavy days",         icon: "✂️", category: "code", xpReward: 500,  metric: refactorDays, target: 20 }),

  // ── Code: files ───────────────────────────────────────────────────────────
  metricAchievement({ id: "files_10",   name: "Multi-Tasker",        description: "Edit 10 different files",        icon: "📁", category: "code", xpReward: 20,   metric: totalFilesEdited, target: 10 }),
  metricAchievement({ id: "files_50",   name: "File Juggler",        description: "Edit 50 different files",        icon: "🤹", category: "code", xpReward: 80,   metric: totalFilesEdited, target: 50 }),
  metricAchievement({ id: "files_200",  name: "File Collector",      description: "Edit 200 different files",       icon: "🗂️", category: "code", xpReward: 250,  metric: totalFilesEdited, target: 200 }),
  metricAchievement({ id: "files_1000", name: "Repository Overlord", description: "Edit 1,000 different files",    icon: "🏰", category: "code", xpReward: 1500, metric: totalFilesEdited, target: 1_000 }),

  // ── Code: max single-day lines ────────────────────────────────────────────
  metricAchievement({ id: "big_day_100",  name: "Productive Day",  description: "Write 100+ lines in a single day",    icon: "⚡", category: "code", xpReward: 40,   metric: maxDayLines, target: 100 }),
  metricAchievement({ id: "big_day_500",  name: "Code Tsunami",    description: "Write 500+ lines in a single day",    icon: "🌊", category: "code", xpReward: 200,  metric: maxDayLines, target: 500 }),
  metricAchievement({ id: "big_day_1000", name: "Code Tornado",    description: "Write 1,000+ lines in a single day",  icon: "🌀", category: "code", xpReward: 500,  metric: maxDayLines, target: 1_000 }),
  metricAchievement({ id: "big_day_2000", name: "Volcanic Output", description: "Write 2,000+ lines in a single day",  icon: "🌋", category: "code", xpReward: 1200, metric: maxDayLines, target: 2_000 }),

  // ── Code: language mastery ────────────────────────────────────────────────
  metricAchievement({ id: "one_lang_1k",  name: "Language Focus",  description: "Write 1,000 lines in a single language",  icon: "🎯", category: "code", xpReward: 100,  metric: maxLinesInOneLang, target: 1_000 }),
  metricAchievement({ id: "one_lang_10k", name: "Language Expert", description: "Write 10,000 lines in a single language", icon: "🎓", category: "code", xpReward: 400,  metric: maxLinesInOneLang, target: 10_000 }),
  metricAchievement({ id: "one_lang_50k", name: "Language Master", description: "Write 50,000 lines in one language",      icon: "🏅", category: "code", xpReward: 1500, metric: maxLinesInOneLang, target: 50_000 }),
  metricAchievement({ id: "polyglot_2",   name: "Bilingual",       description: "Write 100+ lines in 2 languages",         icon: "🗣️", category: "code", xpReward: 80,   metric: polyglotLangs, target: 2 }),
  metricAchievement({ id: "polyglot_4",   name: "Polyglot",        description: "Write 100+ lines in 4 languages",         icon: "🌐", category: "code", xpReward: 250,  metric: polyglotLangs, target: 4 }),
  metricAchievement({ id: "polyglot_7",   name: "Linguistic God",  description: "Write 100+ lines in 7 languages",         icon: "🧠", category: "code", xpReward: 800,  metric: polyglotLangs, target: 7 }),

  // ── Time ──────────────────────────────────────────────────────────────────
  metricAchievement({ id: "time_1h",    name: "In the Zone",    description: "Accumulate 1 hour of active coding",    icon: "⏱️", category: "time", xpReward: 30,    metric: totalActiveMinutes, target: 60 }),
  metricAchievement({ id: "time_10h",   name: "Dedicated",      description: "10 hours of active coding",             icon: "🕐", category: "time", xpReward: 150,   metric: totalActiveMinutes, target: 600 }),
  metricAchievement({ id: "time_50h",   name: "Committed",      description: "50 hours of active coding",             icon: "📌", category: "time", xpReward: 400,   metric: totalActiveMinutes, target: 3_000 }),
  metricAchievement({ id: "time_100h",  name: "Century Hours",  description: "100 hours of active coding",            icon: "⌛", category: "time", xpReward: 800,   metric: totalActiveMinutes, target: 6_000 }),
  metricAchievement({ id: "time_300h",  name: "Marathon Coder", description: "300 hours of active coding",            icon: "🏃", category: "time", xpReward: 2000,  metric: totalActiveMinutes, target: 18_000 }),
  metricAchievement({ id: "time_1000h", name: "Thousand Hours", description: "1,000 hours. Gladwell approves.",       icon: "🏅", category: "time", xpReward: 5000,  metric: totalActiveMinutes, target: 60_000 }),
  metricAchievement({ id: "time_5000h", name: "Five Thousand",  description: "5,000 hours — this is your life now.", icon: "🌌", category: "time", xpReward: 15000, metric: totalActiveMinutes, target: 300_000 }),

  // ── Habit: focus sessions ─────────────────────────────────────────────────
  metricAchievement({ id: "focus_1h",  name: "Focused Hour", description: "1 hour of active coding in a single day",   icon: "🎯", category: "habit", xpReward: 30,  metric: maxDayActiveMinutes, target: 60 }),
  metricAchievement({ id: "focus_4h",  name: "Deep Work",    description: "4 hours of active coding in a single day",  icon: "🧠", category: "habit", xpReward: 150, metric: maxDayActiveMinutes, target: 240 }),
  metricAchievement({ id: "focus_6h",  name: "Flow State",   description: "6 hours of active coding in a single day",  icon: "🔮", category: "habit", xpReward: 280, metric: maxDayActiveMinutes, target: 360 }),
  metricAchievement({ id: "focus_8h",  name: "Crunch Mode",  description: "8 hours of active coding in a single day",  icon: "💀", category: "habit", xpReward: 400, metric: maxDayActiveMinutes, target: 480 }),
  metricAchievement({ id: "focus_12h", name: "No Life",      description: "12+ hours in a single day. Please sleep.",  icon: "☠️", category: "habit", xpReward: 800, metric: maxDayActiveMinutes, target: 720 }),

  // ── Habit: many files in one day ──────────────────────────────────────────
  metricAchievement({ id: "files_day_10", name: "Spread Thin",            description: "Edit 10+ files in a single day",  icon: "🗃️", category: "habit", xpReward: 60,  metric: maxDayFiles, target: 10 }),
  metricAchievement({ id: "files_day_25", name: "Multithreaded",          description: "Edit 25+ files in a single day",  icon: "🔀", category: "habit", xpReward: 180, metric: maxDayFiles, target: 25 }),
  metricAchievement({ id: "files_day_50", name: "Context Switch Champion",description: "Edit 50+ files in a single day",  icon: "⚡", category: "habit", xpReward: 400, metric: maxDayFiles, target: 50 }),

  // ── Habit: time of day ────────────────────────────────────────────────────
  metricAchievement({ id: "night_owl",      name: "Night Owl",        description: "30+ lines between 22:00–04:00 in a day",  icon: "🦉", category: "habit", xpReward: 80,  metric: maxLateNightLines,    target: 30 }),
  metricAchievement({ id: "night_owl_pro",  name: "Vampire Coder",    description: "150+ lines between 22:00–04:00 in a day", icon: "🧛", category: "habit", xpReward: 300, metric: maxLateNightLines,    target: 150 }),
  metricAchievement({ id: "night_owl_god",  name: "Insomniac Dev",    description: "500+ lines between 22:00–04:00 in a day", icon: "🌑", category: "habit", xpReward: 800, metric: maxLateNightLines,    target: 500 }),
  metricAchievement({ id: "early_bird",     name: "Early Bird",       description: "30+ lines between 05:00–08:00 in a day",  icon: "🐦", category: "habit", xpReward: 80,  metric: maxEarlyMorningLines, target: 30 }),
  metricAchievement({ id: "early_bird_pro", name: "Sunrise Sprinter", description: "150+ lines between 05:00–08:00 in a day", icon: "🌅", category: "habit", xpReward: 300, metric: maxEarlyMorningLines, target: 150 }),
  metricAchievement({ id: "lunch_coder",    name: "Lunch Break Hero", description: "100+ lines between 12:00–14:00 in a day", icon: "🥪", category: "habit", xpReward: 100, metric: maxLunchLines,        target: 100 }),

  // ── Habit: weekends ───────────────────────────────────────────────────────
  metricAchievement({ id: "weekend_1",  name: "Weekend Hobbyist", description: "Code on a Saturday or Sunday",      icon: "🎮", category: "habit", xpReward: 30,   metric: weekendActiveDays, target: 1 }),
  metricAchievement({ id: "weekend_5",  name: "Weekend Regular",  description: "Code on 5 different weekend days",  icon: "🎲", category: "habit", xpReward: 120,  metric: weekendActiveDays, target: 5 }),
  metricAchievement({ id: "weekend_10", name: "Weekend Warrior",  description: "Code on 10 different weekend days", icon: "⚔️", category: "habit", xpReward: 250,  metric: weekendActiveDays, target: 10 }),
  metricAchievement({ id: "weekend_30", name: "What Is Rest",     description: "Code on 30 different weekend days", icon: "😤", category: "habit", xpReward: 600,  metric: weekendActiveDays, target: 30 }),
  metricAchievement({ id: "weekend_50", name: "No Days Off",      description: "Code on 50 different weekend days", icon: "🚫", category: "habit", xpReward: 1000, metric: weekendActiveDays, target: 50 }),

  // ── Habit: active weeks ───────────────────────────────────────────────────
  metricAchievement({ id: "weeks_4",  name: "Monthly Habit",   description: "Code in 4 different calendar weeks",  icon: "🗓️", category: "habit", xpReward: 120,  metric: activeWeeks, target: 4 }),
  metricAchievement({ id: "weeks_12", name: "Quarterly Grind", description: "Code in 12 different calendar weeks", icon: "📆", category: "habit", xpReward: 400,  metric: activeWeeks, target: 12 }),
  metricAchievement({ id: "weeks_26", name: "Half Year",       description: "Code in 26 different calendar weeks", icon: "🌓", category: "habit", xpReward: 1000, metric: activeWeeks, target: 26 }),
  metricAchievement({ id: "weeks_52", name: "Full Year Habit", description: "Code in 52 different calendar weeks", icon: "🌕", category: "habit", xpReward: 3000, metric: activeWeeks, target: 52 }),

  // ── Build / deploy / git ──────────────────────────────────────────────────
  metricAchievement({ id: "first_build", name: "First Blood",   description: "Log your first successful build or test", icon: "🚀", category: "build", xpReward: 25,    metric: totalEvents, target: 1 }),
  metricAchievement({ id: "builds_10",   name: "Ship It",       description: "Log 10 successful terminal events",       icon: "📦", category: "build", xpReward: 100,   metric: totalEvents, target: 10 }),
  metricAchievement({ id: "builds_50",   name: "Build Bunny",   description: "50 successful builds/tests",              icon: "🐇", category: "build", xpReward: 300,   metric: totalEvents, target: 50 }),
  metricAchievement({ id: "builds_100",  name: "CI Machine",    description: "100 successful builds/tests",             icon: "🤖", category: "build", xpReward: 500,   metric: totalEvents, target: 100 }),
  metricAchievement({ id: "builds_500",  name: "Pipeline Pro",  description: "500 successful builds/tests",             icon: "🏭", category: "build", xpReward: 1500,  metric: totalEvents, target: 500 }),
  metricAchievement({ id: "builds_1000", name: "CI/CD Deity",   description: "1,000 successful builds/tests",           icon: "👑", category: "build", xpReward: 4000,  metric: totalEvents, target: 1_000 }),
  metricAchievement({ id: "builds_5000", name: "Infinite Loop", description: "5,000 successful builds/tests",           icon: "♾️", category: "build", xpReward: 10000, metric: totalEvents, target: 5_000 }),

  metricAchievement({ id: "git_push",  name: "Shipped to Prod", description: "Do your first git push",  icon: "📤", category: "build", xpReward: 50,    metric: gitPushCount, target: 1 }),
  metricAchievement({ id: "git_10",    name: "Git Wizard",      description: "10 git pushes",           icon: "🧙", category: "build", xpReward: 200,   metric: gitPushCount, target: 10 }),
  metricAchievement({ id: "git_50",    name: "Commit Machine",  description: "50 git pushes",           icon: "⚙️", category: "build", xpReward: 600,   metric: gitPushCount, target: 50 }),
  metricAchievement({ id: "git_100",   name: "Push Master",     description: "100 git pushes",          icon: "🎓", category: "build", xpReward: 1500,  metric: gitPushCount, target: 100 }),
  metricAchievement({ id: "git_365",   name: "Push Every Day",  description: "365 git pushes",          icon: "🌍", category: "build", xpReward: 5000,  metric: gitPushCount, target: 365 }),
  metricAchievement({ id: "git_1000",  name: "Git Legend",      description: "1,000 git pushes",        icon: "💎", category: "build", xpReward: 12000, metric: gitPushCount, target: 1_000 }),

  // ── Special: active days ─────────────────────────────────────────────────
  metricAchievement({ id: "active_days_1",   name: "Day One",          description: "Your first recorded day",    icon: "🌱", category: "special", xpReward: 10,   metric: totalDays, target: 1 }),
  metricAchievement({ id: "active_days_7",   name: "Week Regular",     description: "Code on 7 different days",   icon: "🗓️", category: "special", xpReward: 100,  metric: totalDays, target: 7 }),
  metricAchievement({ id: "active_days_30",  name: "Monthly Regular",  description: "Code on 30 different days",  icon: "📆", category: "special", xpReward: 400,  metric: totalDays, target: 30 }),
  metricAchievement({ id: "active_days_60",  name: "Two Months Strong",description: "Code on 60 different days",  icon: "💪", category: "special", xpReward: 800,  metric: totalDays, target: 60 }),
  metricAchievement({ id: "active_days_100", name: "Triple Digits",    description: "Code on 100 different days", icon: "🔢", category: "special", xpReward: 1500, metric: totalDays, target: 100 }),
  metricAchievement({ id: "active_days_200", name: "Bicentennial",     description: "Code on 200 different days", icon: "🏛️", category: "special", xpReward: 3000, metric: totalDays, target: 200 }),
  metricAchievement({ id: "active_days_365", name: "Full Year",        description: "Code on 365 different days", icon: "🎆", category: "special", xpReward: 6000, metric: totalDays, target: 365 }),

  // ── Special: saves ────────────────────────────────────────────────────────
  metricAchievement({ id: "saves_10",     name: "First Saves",   description: "Save 10 times",                              icon: "💾", category: "special", xpReward: 10,   metric: totalSaves, target: 10 }),
  metricAchievement({ id: "saves_100",    name: "Ctrl+S Addict", description: "Save 100 times — we see you",                icon: "💾", category: "special", xpReward: 60,   metric: totalSaves, target: 100 }),
  metricAchievement({ id: "saves_1000",   name: "Panic Saver",   description: "1,000 saves. Your Ctrl key needs a rest.",   icon: "😱", category: "special", xpReward: 200,  metric: totalSaves, target: 1_000 }),
  metricAchievement({ id: "saves_10000",  name: "Save Legend",   description: "10,000 saves. Truly one with the keyboard.", icon: "🏆", category: "special", xpReward: 800,  metric: totalSaves, target: 10_000 }),
  metricAchievement({ id: "saves_100000", name: "The Ctrl+S God",description: "100,000 saves. Seeking medical help is ok.", icon: "⌨️", category: "special", xpReward: 3000, metric: totalSaves, target: 100_000 }),

  // ── Special: XP milestones ────────────────────────────────────────────────
  metricAchievement({ id: "xp_500",    name: "Getting Warmed Up", description: "Earn 500 total XP",     icon: "🔥", category: "special", xpReward: 50,   metric: totalXp, target: 500 }),
  metricAchievement({ id: "xp_5000",   name: "XP Hoarder",        description: "Earn 5,000 total XP",   icon: "💰", category: "special", xpReward: 250,  metric: totalXp, target: 5_000 }),
  metricAchievement({ id: "xp_25000",  name: "XP Tycoon",         description: "Earn 25,000 total XP",  icon: "💎", category: "special", xpReward: 1000, metric: totalXp, target: 25_000 }),
  metricAchievement({ id: "xp_100000", name: "XP Millionaire",    description: "Earn 100,000 total XP", icon: "👑", category: "special", xpReward: 5000, metric: totalXp, target: 100_000 }),
];

// Fast lookup map
const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map(a => [a.id, a]));

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENT_MAP.get(id);
}

/**
 * Check which achievements are newly unlocked.
 * Mutates data.unlockedAchievements + data.achievementDates + data.totalXp.
 * Returns the list of newly unlocked achievements (for notifications).
 *
 * Note: XP-milestone achievements (xp_*) read `data.totalXp` as their metric.
 * Their own xpReward is added AFTER the check, so a single mutation won't
 * cascade-unlock the next XP tier in the same pass — that happens on the
 * next mutation, avoiding weird "chain unlock" notification spam.
 */
export function checkAchievements(data: FlameData): AchievementUnlock[] {
  const unlocked = new Set(data.unlockedAchievements);
  const newUnlocks: AchievementUnlock[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (unlocked.has(ach.id)) continue;
    if (ach.check(data)) {
      data.unlockedAchievements.push(ach.id);
      data.achievementDates[ach.id] = new Date().toISOString().slice(0, 10);
      data.totalXp += ach.xpReward;
      unlocked.add(ach.id);
      newUnlocks.push({ id: ach.id, name: ach.name, icon: ach.icon, xpReward: ach.xpReward });
    }
  }

  return newUnlocks;
}

/**
 * Fully-resolved list of all achievements with current progress, ready to
 * send to the webview as-is (JSON-serializable, no functions).
 */
export function getAchievementProgressList(data: FlameData): AchievementProgress[] {
  const unlocked = new Set(data.unlockedAchievements);

  return ACHIEVEMENTS.map(ach => {
    const isUnlocked = unlocked.has(ach.id);
    const raw = ach.progress
      ? ach.progress(data)
      : { current: isUnlocked ? 1 : 0, target: 1 };

    const target = Math.max(raw.target, 1);
    const pct = isUnlocked
      ? 100
      : Math.min(100, Math.max(0, Math.round((raw.current / target) * 100)));

    return {
      id: ach.id,
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      category: ach.category,
      xpReward: ach.xpReward,
      unlocked: isUnlocked,
      unlockedDate: data.achievementDates[ach.id],
      current: raw.current,
      target: raw.target,
      pct,
    };
  });
}