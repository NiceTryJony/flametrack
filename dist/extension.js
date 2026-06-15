"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode6 = __toESM(require("vscode"));

// src/storage.ts
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));

// src/types.ts
function emptyDay(date) {
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
    hourlyActivity: new Array(24).fill(0)
  };
}

// src/achievements.ts
function totalLinesAdded(d) {
  return d.totalLinesAdded;
}
function totalLinesRemoved(d) {
  return d.totalLinesRemoved;
}
function totalActiveMinutes(d) {
  return d.totalActiveMinutes;
}
function totalSaves(d) {
  return d.totalSaves;
}
function totalXp(d) {
  return d.totalXp;
}
function bestStreak(d) {
  return d.bestStreak;
}
function totalDays(d) {
  return Object.keys(d.activity).length;
}
function totalEvents(d) {
  return Object.values(d.activity).reduce((s, day) => s + (day.events?.length ?? 0), 0);
}
function gitPushCount(d) {
  return Object.values(d.activity).reduce((s, day) => s + (day.events?.filter((e) => e.kind === "git").length ?? 0), 0);
}
function totalFilesEdited(d) {
  const files = /* @__PURE__ */ new Set();
  Object.values(d.activity).forEach((day) => (day.filesEdited ?? []).forEach((f) => files.add(f)));
  return files.size;
}
function maxDayLines(d) {
  return Math.max(0, ...Object.values(d.activity).map((day) => day.linesAdded));
}
function maxDayActiveMinutes(d) {
  return Math.max(0, ...Object.values(d.activity).map((day) => day.activeMinutes));
}
function maxLateNightLines(d) {
  return Math.max(0, ...Object.values(d.activity).map((day) => {
    const h = day.hourlyActivity ?? [];
    return (h[22] ?? 0) + (h[23] ?? 0) + (h[0] ?? 0) + (h[1] ?? 0) + (h[2] ?? 0) + (h[3] ?? 0);
  }));
}
function maxEarlyMorningLines(d) {
  return Math.max(0, ...Object.values(d.activity).map((day) => {
    const h = day.hourlyActivity ?? [];
    return (h[5] ?? 0) + (h[6] ?? 0) + (h[7] ?? 0);
  }));
}
function maxLunchLines(d) {
  return Math.max(0, ...Object.values(d.activity).map((day) => {
    const h = day.hourlyActivity ?? [];
    return (h[12] ?? 0) + (h[13] ?? 0);
  }));
}
function isWeekendDate(dateStr) {
  const dow = (/* @__PURE__ */ new Date(dateStr + "T00:00:00Z")).getUTCDay();
  return dow === 0 || dow === 6;
}
function weekendActiveDays(d) {
  return Object.entries(d.activity).filter(
    ([date, day]) => isWeekendDate(date) && (day.linesAdded > 0 || day.activeMinutes > 0 || (day.events?.length ?? 0) > 0)
  ).length;
}
function refactorDays(d) {
  return Object.values(d.activity).filter(
    (day) => day.linesRemoved > 0 && day.linesRemoved > day.linesAdded
  ).length;
}
function maxDayFiles(d) {
  return Math.max(0, ...Object.values(d.activity).map((day) => (day.filesEdited ?? []).length));
}
function maxLinesInOneLang(d) {
  const map = {};
  Object.values(d.activity).forEach((day) => {
    Object.entries(day.byLang ?? {}).forEach(([lang, s]) => {
      map[lang] = (map[lang] ?? 0) + s.linesAdded;
    });
  });
  return Math.max(0, ...Object.values(map));
}
function polyglotLangs(d) {
  const map = {};
  Object.values(d.activity).forEach((day) => {
    Object.entries(day.byLang ?? {}).forEach(([lang, s]) => {
      map[lang] = (map[lang] ?? 0) + s.linesAdded;
    });
  });
  return Object.values(map).filter((v) => v >= 100).length;
}
function activeWeeks(d) {
  const days = Object.keys(d.activity);
  if (days.length === 0)
    return 0;
  const sorted = [...days].sort((a, b) => a.localeCompare(b));
  let weeks = 0;
  let weekStart = /* @__PURE__ */ new Date(sorted[0] + "T00:00:00Z");
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  const today = /* @__PURE__ */ new Date();
  while (weekStart <= today) {
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    const hasActivity = sorted.some((ds) => {
      const dd = /* @__PURE__ */ new Date(ds + "T00:00:00Z");
      return dd >= weekStart && dd <= weekEnd;
    });
    if (hasActivity)
      weeks++;
    weekStart.setUTCDate(weekStart.getUTCDate() + 7);
  }
  return weeks;
}
function metricAchievement(opts) {
  return {
    id: opts.id,
    name: opts.name,
    description: opts.description,
    icon: opts.icon,
    category: opts.category,
    xpReward: opts.xpReward,
    check: (d) => opts.metric(d) >= opts.target,
    progress: (d) => ({ current: Math.min(opts.metric(d), opts.target), target: opts.target })
  };
}
var ACHIEVEMENTS = [
  // ── Streak ────────────────────────────────────────────────────────────────
  metricAchievement({ id: "streak_3", name: "Hat Trick", description: "3-day coding streak", icon: "\u{1F3A9}", category: "streak", xpReward: 30, metric: bestStreak, target: 3 }),
  metricAchievement({ id: "streak_7", name: "Week Warrior", description: "7-day coding streak", icon: "\u{1F525}", category: "streak", xpReward: 100, metric: bestStreak, target: 7 }),
  metricAchievement({ id: "streak_14", name: "Two Weeks", description: "14-day coding streak", icon: "\u{1F4AA}", category: "streak", xpReward: 250, metric: bestStreak, target: 14 }),
  metricAchievement({ id: "streak_30", name: "Monthly Grind", description: "30-day coding streak", icon: "\u{1F4C5}", category: "streak", xpReward: 600, metric: bestStreak, target: 30 }),
  metricAchievement({ id: "streak_60", name: "Iron Coder", description: "60-day coding streak", icon: "\u2699\uFE0F", category: "streak", xpReward: 1200, metric: bestStreak, target: 60 }),
  metricAchievement({ id: "streak_100", name: "Century", description: "100-day coding streak", icon: "\u{1F4AF}", category: "streak", xpReward: 2500, metric: bestStreak, target: 100 }),
  metricAchievement({ id: "streak_200", name: "Unstoppable", description: "200-day coding streak", icon: "\u{1F30A}", category: "streak", xpReward: 5e3, metric: bestStreak, target: 200 }),
  metricAchievement({ id: "streak_365", name: "Full Revolution", description: "365-day coding streak. Legendary.", icon: "\u{1F30D}", category: "streak", xpReward: 1e4, metric: bestStreak, target: 365 }),
  // ── Code: lines added ─────────────────────────────────────────────────────
  metricAchievement({ id: "lines_100", name: "First Steps", description: "Write 100 lines of code", icon: "\u{1F476}", category: "code", xpReward: 10, metric: totalLinesAdded, target: 100 }),
  metricAchievement({ id: "lines_1k", name: "Getting There", description: "Write 1,000 lines of code", icon: "\u{1F6B6}", category: "code", xpReward: 50, metric: totalLinesAdded, target: 1e3 }),
  metricAchievement({ id: "lines_5k", name: "Codesmith", description: "Write 5,000 lines of code", icon: "\u{1F528}", category: "code", xpReward: 150, metric: totalLinesAdded, target: 5e3 }),
  metricAchievement({ id: "lines_10k", name: "Ten Thousand", description: "Write 10,000 lines of code", icon: "\u{1F4DD}", category: "code", xpReward: 300, metric: totalLinesAdded, target: 1e4 }),
  metricAchievement({ id: "lines_25k", name: "Quarter Million", description: "Write 25,000 lines of code", icon: "\u{1F4DA}", category: "code", xpReward: 600, metric: totalLinesAdded, target: 25e3 }),
  metricAchievement({ id: "lines_50k", name: "Half Centurion", description: "Write 50,000 lines of code", icon: "\u2694\uFE0F", category: "code", xpReward: 1200, metric: totalLinesAdded, target: 5e4 }),
  metricAchievement({ id: "lines_100k", name: "Six Figures", description: "Write 100,000 lines of code", icon: "\u{1F4B0}", category: "code", xpReward: 2500, metric: totalLinesAdded, target: 1e5 }),
  metricAchievement({ id: "lines_500k", name: "Half a Million", description: "Write 500,000 lines of code", icon: "\u{1F3DB}\uFE0F", category: "code", xpReward: 7500, metric: totalLinesAdded, target: 5e5 }),
  metricAchievement({ id: "lines_1m", name: "The Million", description: "Write 1,000,000 lines of code", icon: "\u{1F30B}", category: "code", xpReward: 2e4, metric: totalLinesAdded, target: 1e6 }),
  // ── Code: deletion & refactoring ─────────────────────────────────────────
  metricAchievement({ id: "rm_500", name: "Cleanup Crew", description: "Delete 500 lines", icon: "\u{1F9F9}", category: "code", xpReward: 50, metric: totalLinesRemoved, target: 500 }),
  metricAchievement({ id: "rm_5k", name: "The Eraser", description: "Delete 5,000 lines", icon: "\u{1F5D1}\uFE0F", category: "code", xpReward: 200, metric: totalLinesRemoved, target: 5e3 }),
  metricAchievement({ id: "rm_25k", name: "Great Purge", description: "Delete 25,000 lines", icon: "\u{1F525}", category: "code", xpReward: 600, metric: totalLinesRemoved, target: 25e3 }),
  metricAchievement({ id: "rm_100k", name: "Nuclear Option", description: "Delete 100,000 lines", icon: "\u{1F4A5}", category: "code", xpReward: 2e3, metric: totalLinesRemoved, target: 1e5 }),
  metricAchievement({ id: "refactor_days_5", name: "Refactor Fan", description: "5 days where you deleted more than you wrote", icon: "\u267B\uFE0F", category: "code", xpReward: 150, metric: refactorDays, target: 5 }),
  metricAchievement({ id: "refactor_days_20", name: "Less Is More", description: "20 refactor-heavy days", icon: "\u2702\uFE0F", category: "code", xpReward: 500, metric: refactorDays, target: 20 }),
  // ── Code: files ───────────────────────────────────────────────────────────
  metricAchievement({ id: "files_10", name: "Multi-Tasker", description: "Edit 10 different files", icon: "\u{1F4C1}", category: "code", xpReward: 20, metric: totalFilesEdited, target: 10 }),
  metricAchievement({ id: "files_50", name: "File Juggler", description: "Edit 50 different files", icon: "\u{1F939}", category: "code", xpReward: 80, metric: totalFilesEdited, target: 50 }),
  metricAchievement({ id: "files_200", name: "File Collector", description: "Edit 200 different files", icon: "\u{1F5C2}\uFE0F", category: "code", xpReward: 250, metric: totalFilesEdited, target: 200 }),
  metricAchievement({ id: "files_1000", name: "Repository Overlord", description: "Edit 1,000 different files", icon: "\u{1F3F0}", category: "code", xpReward: 1500, metric: totalFilesEdited, target: 1e3 }),
  // ── Code: max single-day lines ────────────────────────────────────────────
  metricAchievement({ id: "big_day_100", name: "Productive Day", description: "Write 100+ lines in a single day", icon: "\u26A1", category: "code", xpReward: 40, metric: maxDayLines, target: 100 }),
  metricAchievement({ id: "big_day_500", name: "Code Tsunami", description: "Write 500+ lines in a single day", icon: "\u{1F30A}", category: "code", xpReward: 200, metric: maxDayLines, target: 500 }),
  metricAchievement({ id: "big_day_1000", name: "Code Tornado", description: "Write 1,000+ lines in a single day", icon: "\u{1F300}", category: "code", xpReward: 500, metric: maxDayLines, target: 1e3 }),
  metricAchievement({ id: "big_day_2000", name: "Volcanic Output", description: "Write 2,000+ lines in a single day", icon: "\u{1F30B}", category: "code", xpReward: 1200, metric: maxDayLines, target: 2e3 }),
  // ── Code: language mastery ────────────────────────────────────────────────
  metricAchievement({ id: "one_lang_1k", name: "Language Focus", description: "Write 1,000 lines in a single language", icon: "\u{1F3AF}", category: "code", xpReward: 100, metric: maxLinesInOneLang, target: 1e3 }),
  metricAchievement({ id: "one_lang_10k", name: "Language Expert", description: "Write 10,000 lines in a single language", icon: "\u{1F393}", category: "code", xpReward: 400, metric: maxLinesInOneLang, target: 1e4 }),
  metricAchievement({ id: "one_lang_50k", name: "Language Master", description: "Write 50,000 lines in one language", icon: "\u{1F3C5}", category: "code", xpReward: 1500, metric: maxLinesInOneLang, target: 5e4 }),
  metricAchievement({ id: "polyglot_2", name: "Bilingual", description: "Write 100+ lines in 2 languages", icon: "\u{1F5E3}\uFE0F", category: "code", xpReward: 80, metric: polyglotLangs, target: 2 }),
  metricAchievement({ id: "polyglot_4", name: "Polyglot", description: "Write 100+ lines in 4 languages", icon: "\u{1F310}", category: "code", xpReward: 250, metric: polyglotLangs, target: 4 }),
  metricAchievement({ id: "polyglot_7", name: "Linguistic God", description: "Write 100+ lines in 7 languages", icon: "\u{1F9E0}", category: "code", xpReward: 800, metric: polyglotLangs, target: 7 }),
  // ── Time ──────────────────────────────────────────────────────────────────
  metricAchievement({ id: "time_1h", name: "In the Zone", description: "Accumulate 1 hour of active coding", icon: "\u23F1\uFE0F", category: "time", xpReward: 30, metric: totalActiveMinutes, target: 60 }),
  metricAchievement({ id: "time_10h", name: "Dedicated", description: "10 hours of active coding", icon: "\u{1F550}", category: "time", xpReward: 150, metric: totalActiveMinutes, target: 600 }),
  metricAchievement({ id: "time_50h", name: "Committed", description: "50 hours of active coding", icon: "\u{1F4CC}", category: "time", xpReward: 400, metric: totalActiveMinutes, target: 3e3 }),
  metricAchievement({ id: "time_100h", name: "Century Hours", description: "100 hours of active coding", icon: "\u231B", category: "time", xpReward: 800, metric: totalActiveMinutes, target: 6e3 }),
  metricAchievement({ id: "time_300h", name: "Marathon Coder", description: "300 hours of active coding", icon: "\u{1F3C3}", category: "time", xpReward: 2e3, metric: totalActiveMinutes, target: 18e3 }),
  metricAchievement({ id: "time_1000h", name: "Thousand Hours", description: "1,000 hours. Gladwell approves.", icon: "\u{1F3C5}", category: "time", xpReward: 5e3, metric: totalActiveMinutes, target: 6e4 }),
  metricAchievement({ id: "time_5000h", name: "Five Thousand", description: "5,000 hours \u2014 this is your life now.", icon: "\u{1F30C}", category: "time", xpReward: 15e3, metric: totalActiveMinutes, target: 3e5 }),
  // ── Habit: focus sessions ─────────────────────────────────────────────────
  metricAchievement({ id: "focus_1h", name: "Focused Hour", description: "1 hour of active coding in a single day", icon: "\u{1F3AF}", category: "habit", xpReward: 30, metric: maxDayActiveMinutes, target: 60 }),
  metricAchievement({ id: "focus_4h", name: "Deep Work", description: "4 hours of active coding in a single day", icon: "\u{1F9E0}", category: "habit", xpReward: 150, metric: maxDayActiveMinutes, target: 240 }),
  metricAchievement({ id: "focus_6h", name: "Flow State", description: "6 hours of active coding in a single day", icon: "\u{1F52E}", category: "habit", xpReward: 280, metric: maxDayActiveMinutes, target: 360 }),
  metricAchievement({ id: "focus_8h", name: "Crunch Mode", description: "8 hours of active coding in a single day", icon: "\u{1F480}", category: "habit", xpReward: 400, metric: maxDayActiveMinutes, target: 480 }),
  metricAchievement({ id: "focus_12h", name: "No Life", description: "12+ hours in a single day. Please sleep.", icon: "\u2620\uFE0F", category: "habit", xpReward: 800, metric: maxDayActiveMinutes, target: 720 }),
  // ── Habit: many files in one day ──────────────────────────────────────────
  metricAchievement({ id: "files_day_10", name: "Spread Thin", description: "Edit 10+ files in a single day", icon: "\u{1F5C3}\uFE0F", category: "habit", xpReward: 60, metric: maxDayFiles, target: 10 }),
  metricAchievement({ id: "files_day_25", name: "Multithreaded", description: "Edit 25+ files in a single day", icon: "\u{1F500}", category: "habit", xpReward: 180, metric: maxDayFiles, target: 25 }),
  metricAchievement({ id: "files_day_50", name: "Context Switch Champion", description: "Edit 50+ files in a single day", icon: "\u26A1", category: "habit", xpReward: 400, metric: maxDayFiles, target: 50 }),
  // ── Habit: time of day ────────────────────────────────────────────────────
  metricAchievement({ id: "night_owl", name: "Night Owl", description: "30+ lines between 22:00\u201304:00 in a day", icon: "\u{1F989}", category: "habit", xpReward: 80, metric: maxLateNightLines, target: 30 }),
  metricAchievement({ id: "night_owl_pro", name: "Vampire Coder", description: "150+ lines between 22:00\u201304:00 in a day", icon: "\u{1F9DB}", category: "habit", xpReward: 300, metric: maxLateNightLines, target: 150 }),
  metricAchievement({ id: "night_owl_god", name: "Insomniac Dev", description: "500+ lines between 22:00\u201304:00 in a day", icon: "\u{1F311}", category: "habit", xpReward: 800, metric: maxLateNightLines, target: 500 }),
  metricAchievement({ id: "early_bird", name: "Early Bird", description: "30+ lines between 05:00\u201308:00 in a day", icon: "\u{1F426}", category: "habit", xpReward: 80, metric: maxEarlyMorningLines, target: 30 }),
  metricAchievement({ id: "early_bird_pro", name: "Sunrise Sprinter", description: "150+ lines between 05:00\u201308:00 in a day", icon: "\u{1F305}", category: "habit", xpReward: 300, metric: maxEarlyMorningLines, target: 150 }),
  metricAchievement({ id: "lunch_coder", name: "Lunch Break Hero", description: "100+ lines between 12:00\u201314:00 in a day", icon: "\u{1F96A}", category: "habit", xpReward: 100, metric: maxLunchLines, target: 100 }),
  // ── Habit: weekends ───────────────────────────────────────────────────────
  metricAchievement({ id: "weekend_1", name: "Weekend Hobbyist", description: "Code on a Saturday or Sunday", icon: "\u{1F3AE}", category: "habit", xpReward: 30, metric: weekendActiveDays, target: 1 }),
  metricAchievement({ id: "weekend_5", name: "Weekend Regular", description: "Code on 5 different weekend days", icon: "\u{1F3B2}", category: "habit", xpReward: 120, metric: weekendActiveDays, target: 5 }),
  metricAchievement({ id: "weekend_10", name: "Weekend Warrior", description: "Code on 10 different weekend days", icon: "\u2694\uFE0F", category: "habit", xpReward: 250, metric: weekendActiveDays, target: 10 }),
  metricAchievement({ id: "weekend_30", name: "What Is Rest", description: "Code on 30 different weekend days", icon: "\u{1F624}", category: "habit", xpReward: 600, metric: weekendActiveDays, target: 30 }),
  metricAchievement({ id: "weekend_50", name: "No Days Off", description: "Code on 50 different weekend days", icon: "\u{1F6AB}", category: "habit", xpReward: 1e3, metric: weekendActiveDays, target: 50 }),
  // ── Habit: active weeks ───────────────────────────────────────────────────
  metricAchievement({ id: "weeks_4", name: "Monthly Habit", description: "Code in 4 different calendar weeks", icon: "\u{1F5D3}\uFE0F", category: "habit", xpReward: 120, metric: activeWeeks, target: 4 }),
  metricAchievement({ id: "weeks_12", name: "Quarterly Grind", description: "Code in 12 different calendar weeks", icon: "\u{1F4C6}", category: "habit", xpReward: 400, metric: activeWeeks, target: 12 }),
  metricAchievement({ id: "weeks_26", name: "Half Year", description: "Code in 26 different calendar weeks", icon: "\u{1F313}", category: "habit", xpReward: 1e3, metric: activeWeeks, target: 26 }),
  metricAchievement({ id: "weeks_52", name: "Full Year Habit", description: "Code in 52 different calendar weeks", icon: "\u{1F315}", category: "habit", xpReward: 3e3, metric: activeWeeks, target: 52 }),
  // ── Build / deploy / git ──────────────────────────────────────────────────
  metricAchievement({ id: "first_build", name: "First Blood", description: "Log your first successful build or test", icon: "\u{1F680}", category: "build", xpReward: 25, metric: totalEvents, target: 1 }),
  metricAchievement({ id: "builds_10", name: "Ship It", description: "Log 10 successful terminal events", icon: "\u{1F4E6}", category: "build", xpReward: 100, metric: totalEvents, target: 10 }),
  metricAchievement({ id: "builds_50", name: "Build Bunny", description: "50 successful builds/tests", icon: "\u{1F407}", category: "build", xpReward: 300, metric: totalEvents, target: 50 }),
  metricAchievement({ id: "builds_100", name: "CI Machine", description: "100 successful builds/tests", icon: "\u{1F916}", category: "build", xpReward: 500, metric: totalEvents, target: 100 }),
  metricAchievement({ id: "builds_500", name: "Pipeline Pro", description: "500 successful builds/tests", icon: "\u{1F3ED}", category: "build", xpReward: 1500, metric: totalEvents, target: 500 }),
  metricAchievement({ id: "builds_1000", name: "CI/CD Deity", description: "1,000 successful builds/tests", icon: "\u{1F451}", category: "build", xpReward: 4e3, metric: totalEvents, target: 1e3 }),
  metricAchievement({ id: "builds_5000", name: "Infinite Loop", description: "5,000 successful builds/tests", icon: "\u267E\uFE0F", category: "build", xpReward: 1e4, metric: totalEvents, target: 5e3 }),
  metricAchievement({ id: "git_push", name: "Shipped to Prod", description: "Do your first git push", icon: "\u{1F4E4}", category: "build", xpReward: 50, metric: gitPushCount, target: 1 }),
  metricAchievement({ id: "git_10", name: "Git Wizard", description: "10 git pushes", icon: "\u{1F9D9}", category: "build", xpReward: 200, metric: gitPushCount, target: 10 }),
  metricAchievement({ id: "git_50", name: "Commit Machine", description: "50 git pushes", icon: "\u2699\uFE0F", category: "build", xpReward: 600, metric: gitPushCount, target: 50 }),
  metricAchievement({ id: "git_100", name: "Push Master", description: "100 git pushes", icon: "\u{1F393}", category: "build", xpReward: 1500, metric: gitPushCount, target: 100 }),
  metricAchievement({ id: "git_365", name: "Push Every Day", description: "365 git pushes", icon: "\u{1F30D}", category: "build", xpReward: 5e3, metric: gitPushCount, target: 365 }),
  metricAchievement({ id: "git_1000", name: "Git Legend", description: "1,000 git pushes", icon: "\u{1F48E}", category: "build", xpReward: 12e3, metric: gitPushCount, target: 1e3 }),
  // ── Special: active days ─────────────────────────────────────────────────
  metricAchievement({ id: "active_days_1", name: "Day One", description: "Your first recorded day", icon: "\u{1F331}", category: "special", xpReward: 10, metric: totalDays, target: 1 }),
  metricAchievement({ id: "active_days_7", name: "Week Regular", description: "Code on 7 different days", icon: "\u{1F5D3}\uFE0F", category: "special", xpReward: 100, metric: totalDays, target: 7 }),
  metricAchievement({ id: "active_days_30", name: "Monthly Regular", description: "Code on 30 different days", icon: "\u{1F4C6}", category: "special", xpReward: 400, metric: totalDays, target: 30 }),
  metricAchievement({ id: "active_days_60", name: "Two Months Strong", description: "Code on 60 different days", icon: "\u{1F4AA}", category: "special", xpReward: 800, metric: totalDays, target: 60 }),
  metricAchievement({ id: "active_days_100", name: "Triple Digits", description: "Code on 100 different days", icon: "\u{1F522}", category: "special", xpReward: 1500, metric: totalDays, target: 100 }),
  metricAchievement({ id: "active_days_200", name: "Bicentennial", description: "Code on 200 different days", icon: "\u{1F3DB}\uFE0F", category: "special", xpReward: 3e3, metric: totalDays, target: 200 }),
  metricAchievement({ id: "active_days_365", name: "Full Year", description: "Code on 365 different days", icon: "\u{1F386}", category: "special", xpReward: 6e3, metric: totalDays, target: 365 }),
  // ── Special: saves ────────────────────────────────────────────────────────
  metricAchievement({ id: "saves_10", name: "First Saves", description: "Save 10 times", icon: "\u{1F4BE}", category: "special", xpReward: 10, metric: totalSaves, target: 10 }),
  metricAchievement({ id: "saves_100", name: "Ctrl+S Addict", description: "Save 100 times \u2014 we see you", icon: "\u{1F4BE}", category: "special", xpReward: 60, metric: totalSaves, target: 100 }),
  metricAchievement({ id: "saves_1000", name: "Panic Saver", description: "1,000 saves. Your Ctrl key needs a rest.", icon: "\u{1F631}", category: "special", xpReward: 200, metric: totalSaves, target: 1e3 }),
  metricAchievement({ id: "saves_10000", name: "Save Legend", description: "10,000 saves. Truly one with the keyboard.", icon: "\u{1F3C6}", category: "special", xpReward: 800, metric: totalSaves, target: 1e4 }),
  metricAchievement({ id: "saves_100000", name: "The Ctrl+S God", description: "100,000 saves. Seeking medical help is ok.", icon: "\u2328\uFE0F", category: "special", xpReward: 3e3, metric: totalSaves, target: 1e5 }),
  // ── Special: XP milestones ────────────────────────────────────────────────
  metricAchievement({ id: "xp_500", name: "Getting Warmed Up", description: "Earn 500 total XP", icon: "\u{1F525}", category: "special", xpReward: 50, metric: totalXp, target: 500 }),
  metricAchievement({ id: "xp_5000", name: "XP Hoarder", description: "Earn 5,000 total XP", icon: "\u{1F4B0}", category: "special", xpReward: 250, metric: totalXp, target: 5e3 }),
  metricAchievement({ id: "xp_25000", name: "XP Tycoon", description: "Earn 25,000 total XP", icon: "\u{1F48E}", category: "special", xpReward: 1e3, metric: totalXp, target: 25e3 }),
  metricAchievement({ id: "xp_100000", name: "XP Millionaire", description: "Earn 100,000 total XP", icon: "\u{1F451}", category: "special", xpReward: 5e3, metric: totalXp, target: 1e5 })
];
var ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
function checkAchievements(data) {
  const unlocked = new Set(data.unlockedAchievements);
  const newUnlocks = [];
  for (const ach of ACHIEVEMENTS) {
    if (unlocked.has(ach.id))
      continue;
    if (ach.check(data)) {
      data.unlockedAchievements.push(ach.id);
      data.achievementDates[ach.id] = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      data.totalXp += ach.xpReward;
      unlocked.add(ach.id);
      newUnlocks.push({ id: ach.id, name: ach.name, icon: ach.icon, xpReward: ach.xpReward });
    }
  }
  return newUnlocks;
}
function getAchievementProgressList(data) {
  const unlocked = new Set(data.unlockedAchievements);
  return ACHIEVEMENTS.map((ach) => {
    const isUnlocked = unlocked.has(ach.id);
    const raw = ach.progress ? ach.progress(data) : { current: isUnlocked ? 1 : 0, target: 1 };
    const target = Math.max(raw.target, 1);
    const pct = isUnlocked ? 100 : Math.min(100, Math.max(0, Math.round(raw.current / target * 100)));
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
      pct
    };
  });
}

// src/xp.ts
function recalcTotalXp(data) {
  let xp = 0;
  for (const day of Object.values(data.activity)) {
    xp += Math.floor(day.linesAdded / 10);
    xp += Math.floor(day.linesRemoved / 20);
    xp += day.activeMinutes;
    xp += Math.floor(day.saves / 5);
    xp += day.events.length * 10;
  }
  const rewardById = new Map(ACHIEVEMENTS.map((a) => [a.id, a.xpReward]));
  for (const id of data.unlockedAchievements) {
    xp += rewardById.get(id) ?? 0;
  }
  return Math.max(0, xp);
}
function rehydrateXp(data) {
  const xp = recalcTotalXp(data);
  data.totalXp = xp;
  return xp;
}
function xpForEdit(opts) {
  return Math.floor(opts.linesAdded / 10) + Math.floor(opts.linesRemoved / 20) + opts.activeMinutesDelta;
}
function xpForEvent() {
  return 10;
}

// src/storage.ts
var STORAGE_KEY = "flametrack.data.v2";
var DEBOUNCE_MS = 3e3;
function toDateString(d = /* @__PURE__ */ new Date()) {
  return d.toISOString().slice(0, 10);
}
function emptyData() {
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
    achievementDates: {}
  };
}
function migrate(data) {
  const isPreXpData = data.totalXp === void 0;
  if (data.totalXp === void 0)
    data.totalXp = 0;
  if (!data.unlockedAchievements)
    data.unlockedAchievements = [];
  if (!data.achievementDates)
    data.achievementDates = {};
  for (const day of Object.values(data.activity)) {
    if (!day.hourlyActivity) {
      day.hourlyActivity = new Array(24).fill(0);
    }
  }
  if (isPreXpData) {
    checkAchievements(data);
    rehydrateXp(data);
  }
  return data;
}
var FlameStorage = class {
  constructor(ctx) {
    this.ctx = ctx;
    this.saveTimer = null;
    /** Callbacks fired when achievements unlock */
    this.achievementCallbacks = [];
    const dir = ctx.globalStorageUri.fsPath;
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true });
    this.jsonPath = path.join(dir, "flametrack-v2.json");
    this.data = this.load();
  }
  getData() {
    return this.data;
  }
  onAchievementUnlock(cb) {
    this.achievementCallbacks.push(cb);
  }
  // ── Day record helpers ───────────────────────────────────────────────────
  ensureDay(date) {
    if (!this.data.activity[date]) {
      this.data.activity[date] = emptyDay(date);
    }
    if (!this.data.activity[date].hourlyActivity) {
      this.data.activity[date].hourlyActivity = new Array(24).fill(0);
    }
    return this.data.activity[date];
  }
  // ── Code metrics ─────────────────────────────────────────────────────────
  recordEdit(opts) {
    const today = toDateString();
    const day = this.ensureDay(today);
    day.linesAdded += opts.linesAdded;
    day.linesRemoved += opts.linesRemoved;
    day.keystrokes += opts.chars;
    day.activeMinutes += opts.activeMinutesDelta;
    if (day.sessionStart === null)
      day.sessionStart = Date.now();
    const hour = (/* @__PURE__ */ new Date()).getHours();
    day.hourlyActivity[hour] = (day.hourlyActivity[hour] ?? 0) + opts.linesAdded;
    const base = path.basename(opts.fileName);
    if (!day.filesEdited.includes(base))
      day.filesEdited.push(base);
    if (!day.byLang[opts.lang]) {
      day.byLang[opts.lang] = { linesAdded: 0, linesRemoved: 0, filesEdited: 0 };
    }
    day.byLang[opts.lang].linesAdded += opts.linesAdded;
    day.byLang[opts.lang].linesRemoved += opts.linesRemoved;
    day.byLang[opts.lang].filesEdited++;
    if (!day.byProject[opts.workspace]) {
      day.byProject[opts.workspace] = { name: opts.workspace, linesAdded: 0, linesRemoved: 0, activeMinutes: 0 };
    }
    day.byProject[opts.workspace].linesAdded += opts.linesAdded;
    day.byProject[opts.workspace].linesRemoved += opts.linesRemoved;
    day.byProject[opts.workspace].activeMinutes += opts.activeMinutesDelta;
    this.data.totalLinesAdded += opts.linesAdded;
    this.data.totalLinesRemoved += opts.linesRemoved;
    this.data.totalActiveMinutes += opts.activeMinutesDelta;
    const xp = xpForEdit(opts);
    this.data.totalXp += xp;
    this.recalcStreak(today);
    this.fireAchievements();
    this.scheduleSave();
  }
  recordSave() {
    const today = toDateString();
    const day = this.ensureDay(today);
    day.saves++;
    this.data.totalSaves++;
    if (this.data.totalSaves % 5 === 0)
      this.data.totalXp += 1;
    this.scheduleSave();
  }
  // ── Terminal / streak ────────────────────────────────────────────────────
  recordSuccess(event) {
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
  recalcStreak(today = toDateString()) {
    const day = this.data.activity[today];
    const settings = this.getStreakSettings();
    if (!dayQualifiesForStreak(day, settings))
      return;
    if (this.data.lastActiveDate === today)
      return;
    if (!this.data.lastActiveDate) {
      this.data.currentStreak = 1;
    } else {
      const diff = dateDiffDays(this.data.lastActiveDate, today);
      if (diff === 1 || diff > 1 && allDatesFrozen(this.data.lastActiveDate, today, settings)) {
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
  checkStreakIntegrity() {
    if (!this.data.lastActiveDate)
      return;
    const today = toDateString();
    if (this.data.lastActiveDate === today)
      return;
    const diff = dateDiffDays(this.data.lastActiveDate, today);
    if (diff <= 1)
      return;
    const settings = this.getStreakSettings();
    if (!allDatesFrozen(this.data.lastActiveDate, today, settings)) {
      this.data.currentStreak = 0;
    }
  }
  /** Read streak capture settings from VS Code configuration (live, no caching). */
  getStreakSettings() {
    const cfg = vscode.workspace.getConfiguration("flametrack");
    return {
      minActiveMinutes: cfg.get("streak.minActiveMinutes", 5),
      minLinesAdded: cfg.get("streak.minLinesAdded", 10),
      weekendFreeze: cfg.get("streak.weekendFreeze", true)
    };
  }
  // ── Achievements ─────────────────────────────────────────────────────────
  fireAchievements() {
    const newUnlocks = checkAchievements(this.data);
    if (newUnlocks.length > 0) {
      this.achievementCallbacks.forEach((cb) => cb(newUnlocks));
    }
  }
  // ── Export ────────────────────────────────────────────────────────────────
  exportMarkdown() {
    const { currentStreak, bestStreak: bestStreak2, activity, totalLinesAdded: totalLinesAdded2, totalLinesRemoved: totalLinesRemoved2, totalActiveMinutes: totalActiveMinutes2, totalXp: totalXp2, unlockedAchievements } = this.data;
    const totalDays2 = Object.keys(activity).length;
    const hours = Math.round(totalActiveMinutes2 / 60);
    const lines = [
      "# \u{1F525} FlameTrack Stats",
      "",
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Current streak | ${currentStreak} days |`,
      `| Best streak | ${bestStreak2} days |`,
      `| Active days | ${totalDays2} |`,
      `| Lines added | ${fmt(totalLinesAdded2)} |`,
      `| Lines removed | ${fmt(totalLinesRemoved2)} |`,
      `| Active time | ${hours}h |`,
      `| Total XP | ${fmt(totalXp2)} |`,
      `| Achievements | ${unlockedAchievements.length} / ${ACHIEVEMENTS.length} |`,
      "",
      "## Activity Log",
      ""
    ];
    const sortedDates = Object.keys(activity).sort().reverse();
    for (const date of sortedDates.slice(0, 90)) {
      const day = activity[date];
      const langs = Object.keys(day.byLang).join(", ");
      lines.push(`### ${date}  +${fmt(day.linesAdded)} / -${fmt(day.linesRemoved)} lines  \u23F1 ${day.activeMinutes}min`);
      if (langs)
        lines.push(`> ${langs}`);
      for (const ev of day.events) {
        const icon = ev.kind === "git" ? "\u{1F4E4}" : ev.kind === "manual" ? "\u270B" : "\u2705";
        lines.push(`- ${icon} \`${ev.label}\``);
      }
      lines.push("");
    }
    return lines.join("\n");
  }
  // ── Persistence ───────────────────────────────────────────────────────────
  load() {
    try {
      if (fs.existsSync(this.jsonPath)) {
        const parsed = JSON.parse(fs.readFileSync(this.jsonPath, "utf8"));
        if (parsed?.version === 2)
          return migrate(parsed);
      }
    } catch {
    }
    const fromState = this.ctx.globalState.get(STORAGE_KEY);
    if (fromState?.version === 2)
      return migrate(fromState);
    return emptyData();
  }
  scheduleSave() {
    if (this.saveTimer)
      clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flush(), DEBOUNCE_MS);
  }
  flush() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    try {
      fs.writeFileSync(this.jsonPath, JSON.stringify(this.data), "utf8");
    } catch {
    }
    this.ctx.globalState.update(STORAGE_KEY, this.data);
  }
};
function dateDiffDays(from, to) {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 864e5);
}
function fmt(n) {
  return n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : String(n);
}
function dayQualifiesForStreak(day, settings) {
  if (!day)
    return false;
  if (day.events.length > 0)
    return true;
  if (day.activeMinutes >= settings.minActiveMinutes)
    return true;
  if (day.linesAdded >= settings.minLinesAdded)
    return true;
  return false;
}
function isWeekend(dateStr) {
  const dow = (/* @__PURE__ */ new Date(dateStr + "T00:00:00Z")).getUTCDay();
  return dow === 0 || dow === 6;
}
function datesBetweenExclusive(fromStr, toStr) {
  const result = [];
  const cursor = /* @__PURE__ */ new Date(fromStr + "T00:00:00Z");
  const end = /* @__PURE__ */ new Date(toStr + "T00:00:00Z");
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  while (cursor < end) {
    result.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}
function allDatesFrozen(fromStr, toStr, settings) {
  if (!settings.weekendFreeze)
    return false;
  const gap = datesBetweenExclusive(fromStr, toStr);
  return gap.length > 0 && gap.every(isWeekend);
}

// src/tracker.ts
var vscode2 = __toESM(require("vscode"));
var PRODUCTIVE_PATTERNS = [
  // JS/TS ecosystem
  /\bnpm\s+(run|start|test|build)\b/,
  /\bpnpm\s+(run|start|test|build)\b/,
  /\byarn\s+(start|test|build)\b/,
  /\bbun\s+(run|test|build)\b/,
  // Rust
  /\bcargo\s+(build|test|run|check|clippy)\b/,
  // Go
  /\bgo\s+(build|test|run|vet)\b/,
  // Python
  /\bpython\b.*\.py\b/,
  /\bpytest\b/,
  /\buvicorn\b/,
  /\bflask\b/,
  /\bdjango.*runserver\b/,
  // C/C++
  /\bcmake\s+--build\b/,
  /\bmake\b(?!\s*install)/,
  // Java/Kotlin
  /\bmvn\s+(test|package|install|compile)\b/,
  /\bgradle\s+(test|build|assemble)\b/,
  // .NET
  /\bdotnet\s+(build|test|run|publish)\b/,
  // Docker
  /\bdocker\s+build\b/,
  /\bdocker\s+compose\s+up\b/,
  // Git
  /\bgit\s+push\b/,
  /\bgit\s+commit\b/,
  // Deploy
  /\bnpm\s+publish\b/,
  /\bvercel\b/,
  /\bfly\s+deploy\b/,
  /\bgcloud\s+deploy\b/,
  /\baws\b.*deploy/,
  // Test runners
  /\bjest\b/,
  /\bvitest\b/,
  /\bmocha\b/,
  /\bcypress\b.*run\b/,
  /\bplaywright\s+test\b/,
  // Ruby
  /\bbundle\s+exec\b/,
  /\brspec\b/,
  /\brails\s+(test|server)\b/,
  // PHP
  /\bphp\s+artisan\b/,
  /\bcomposer\b/,
  // Swift / Xcode
  /\bswift\s+(build|test|run)\b/,
  /\bxcodebuild\b/
];
function isProductive(cmd) {
  return PRODUCTIVE_PATTERNS.some((re) => re.test(cmd));
}
function detectTech(cmd) {
  if (/\bcargo\b/.test(cmd))
    return "rust";
  if (/\bgo\s/.test(cmd))
    return "go";
  if (/\bpython|pytest|uvicorn|flask|django\b/.test(cmd))
    return "python";
  if (/\bnpm|pnpm|yarn|bun\b/.test(cmd))
    return "node";
  if (/\bdocker\b/.test(cmd))
    return "docker";
  if (/\bcmake|make\b/.test(cmd))
    return "c/cpp";
  if (/\bdotnet\b/.test(cmd))
    return "dotnet";
  if (/\bmvn|gradle\b/.test(cmd))
    return "java";
  if (/\brspec|rails|ruby\b/.test(cmd))
    return "ruby";
  if (/\bswift|xcodebuild\b/.test(cmd))
    return "swift";
  if (/\bgit\b/.test(cmd))
    return "git";
  return void 0;
}
function workspaceName() {
  return vscode2.workspace.workspaceFolders?.[0]?.name;
}
var FlameTracker = class {
  constructor(storage2) {
    this.storage = storage2;
    this.disposables = [];
    this.successCallbacks = [];
  }
  activate() {
    if ("onDidEndTerminalShellExecution" in vscode2.window) {
      const h = vscode2.window.onDidEndTerminalShellExecution((e) => {
        try {
          this.handle(e);
        } catch (err) {
          console.error("[FlameTrack] shell handler error:", err);
        }
      });
      this.disposables.push(h);
    } else {
      vscode2.window.showInformationMessage(
        "FlameTrack: Upgrade to VS Code 1.93+ for automatic tracking. Use \u270B Mark Today for now."
      );
    }
  }
  onSuccess(cb) {
    this.successCallbacks.push(cb);
  }
  markTodayManual() {
    const event = {
      ts: Date.now(),
      label: "Manual check-in",
      kind: "manual",
      workspace: workspaceName()
    };
    const isFirst = this.storage.recordSuccess(event);
    this.successCallbacks.forEach((cb) => cb(event));
    const streak = this.storage.getData().currentStreak;
    vscode2.window.showInformationMessage(
      isFirst ? `\u270B Day marked! Streak: ${streak} \u{1F525}` : `Today already logged. Streak: ${streak} \u{1F525}`
    );
  }
  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
  handle(e) {
    if (e.exitCode !== 0)
      return;
    const cmd = e.execution?.commandLine?.value ?? "";
    if (!isProductive(cmd))
      return;
    const event = {
      ts: Date.now(),
      label: cmd.trim().slice(0, 120),
      kind: /\bgit\s+push\b/.test(cmd) ? "git" : "terminal",
      workspace: workspaceName(),
      tech: detectTech(cmd)
    };
    const isFirst = this.storage.recordSuccess(event);
    this.successCallbacks.forEach((cb) => cb(event));
    if (isFirst) {
      const streak = this.storage.getData().currentStreak;
      const msg = streak >= 30 ? `\u{1F525} ${streak} days \u2014 absolute legend!` : streak >= 14 ? `\u{1F525} ${streak}-day streak! On fire!` : streak >= 7 ? `\u{1F525} Week streak! Keep going!` : streak >= 3 ? `\u{1F525} ${streak} days in a row!` : `\u{1F525} Day logged! Streak: ${streak}`;
      vscode2.window.showInformationMessage(msg);
    }
  }
};

// src/codeTracker.ts
var vscode3 = __toESM(require("vscode"));
var path2 = __toESM(require("path"));
var IDLE_MS = 2 * 60 * 1e3;
var BATCH_MS = 1e3;
var CodeTracker = class {
  // fractional minutes not yet flushed
  constructor(storage2) {
    this.storage = storage2;
    this.disposables = [];
    this.flushCallbacks = [];
    // Batch accumulator
    this.pending = { added: 0, removed: 0, chars: 0, lang: "", file: "", ws: "" };
    this.batchTimer = null;
    // Active time tracking
    this.lastEditTs = 0;
    this.pendingMinutes = 0;
  }
  /** Register a callback fired after each batch flush to storage */
  onFlush(cb) {
    this.flushCallbacks.push(cb);
  }
  activate() {
    this.disposables.push(
      vscode3.workspace.onDidChangeTextDocument((e) => {
        if (e.contentChanges.length === 0)
          return;
        if (e.document.uri.scheme !== "file")
          return;
        if (e.reason === vscode3.TextDocumentChangeReason.Undo || e.reason === vscode3.TextDocumentChangeReason.Redo)
          return;
        let added = 0, removed = 0, chars = 0;
        for (const ch of e.contentChanges) {
          added += ch.text.split("\n").length - 1;
          removed += ch.range.end.line - ch.range.start.line;
          chars += ch.text.length;
        }
        const now = Date.now();
        if (this.lastEditTs > 0) {
          const gap = now - this.lastEditTs;
          if (gap < IDLE_MS)
            this.pendingMinutes += gap / 6e4;
        }
        this.lastEditTs = now;
        const p = this.pending;
        p.added += added;
        p.removed += removed;
        p.chars += chars;
        p.lang = e.document.languageId;
        p.file = e.document.fileName;
        p.ws = workspaceName2(e.document.uri);
        this.scheduleBatch();
      })
    );
    this.disposables.push(
      vscode3.workspace.onDidSaveTextDocument((doc) => {
        if (doc.uri.scheme !== "file")
          return;
        this.storage.recordSave();
      })
    );
  }
  scheduleBatch() {
    if (this.batchTimer)
      return;
    this.batchTimer = setTimeout(() => {
      this.batchTimer = null;
      this.flushBatch();
    }, BATCH_MS);
  }
  flushBatch() {
    const p = this.pending;
    if (p.added === 0 && p.removed === 0 && p.chars === 0)
      return;
    const wholeMinutes = Math.floor(this.pendingMinutes);
    this.pendingMinutes -= wholeMinutes;
    this.storage.recordEdit({
      linesAdded: p.added,
      linesRemoved: p.removed,
      chars: p.chars,
      lang: p.lang || "plaintext",
      fileName: path2.basename(p.file),
      workspace: p.ws || "unknown",
      activeMinutesDelta: wholeMinutes
    });
    this.pending = { added: 0, removed: 0, chars: 0, lang: "", file: "", ws: "" };
    this.flushCallbacks.forEach((cb) => cb());
  }
  dispose() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
      this.flushBatch();
    }
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
};
function workspaceName2(uri) {
  return vscode3.workspace.getWorkspaceFolder(uri)?.name ?? vscode3.workspace.workspaceFolders?.[0]?.name ?? "unknown";
}

// src/statusBar.ts
var vscode4 = __toESM(require("vscode"));
var FlameStatusBar = class {
  constructor(storage2, onClickCommand) {
    this.storage = storage2;
    this.onClickCommand = onClickCommand;
    this.item = vscode4.window.createStatusBarItem(vscode4.StatusBarAlignment.Right, 100);
    this.item.command = onClickCommand;
    this.update();
    this.item.show();
  }
  update() {
    const { currentStreak, activity } = this.storage.getData();
    const today = toDateString();
    const day = activity[today];
    const settings = this.storage.getStreakSettings();
    const activatedToday = dayQualifiesForStreak(day, settings);
    const hasEvent = (day?.events?.length ?? 0) > 0;
    const todayLines = (day?.linesAdded ?? 0) + (day?.linesRemoved ?? 0);
    const streakPart = currentStreak > 0 ? `\u{1F525}${currentStreak}` : `\u{1F525}0`;
    const linesPart = todayLines > 0 ? `  $(diff-added)${fmtLines(day?.linesAdded ?? 0)}` : "";
    this.item.text = streakPart + linesPart;
    if (!activatedToday && currentStreak > 0) {
      this.item.backgroundColor = new vscode4.ThemeColor("statusBarItem.warningBackground");
      this.item.tooltip = `FlameTrack
Streak: ${currentStreak} \u{1F525}
\u26A0\uFE0F Today not logged yet`;
    } else {
      this.item.backgroundColor = void 0;
      const todayMin = day?.activeMinutes ?? 0;
      this.item.tooltip = [
        "FlameTrack",
        `Streak: ${currentStreak} day${currentStreak !== 1 ? "s" : ""}`,
        activatedToday ? hasEvent ? "\u2705 Today logged" : "\u2705 Today logged (coding activity)" : "\u2014",
        todayLines ? `Lines today: +${day?.linesAdded ?? 0} / -${day?.linesRemoved ?? 0}` : "",
        todayMin ? `Active: ${todayMin}m` : "",
        "",
        "Click to open stats"
      ].filter((x) => x !== void 0).join("\n");
    }
  }
  dispose() {
    this.item.dispose();
  }
};
function fmtLines(n) {
  if (n >= 1e3)
    return (n / 1e3).toFixed(1) + "k";
  return String(n);
}

// src/webview/panel.ts
var vscode5 = __toESM(require("vscode"));

// src/webview/getHtml.ts
function getWebviewHtml() {
  return HTML;
}
var HTML = (
  /* html */
  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none';style-src 'unsafe-inline';script-src 'unsafe-inline';">
<title>FlameTrack</title>
<style>
/* \u2500\u2500 Tokens \u2500\u2500 */
:root{
  --bg:#080810;--surface:#0f0f18;--card:#13131f;--card2:#171726;
  --border:#1e1e30;--border2:#252538;
  --text:#f0f0ff;--muted:#6b6b8a;--dim:#2e2e48;
  --f1:#ff5c1a;--f2:#ff8c00;--f3:#ffc107;
  --green:#22d97a;--blue:#4f9eff;--purple:#a855f7;--red:#ff4d6d;
  --gold:#f59e0b;--cyan:#06b6d4;
  --h0:#0f0f1a;--h1:#2d1408;--h2:#5c2810;--h3:#963d18;--h4:#d45a22;--h5:#ff8c42;
  --r:12px;--r2:8px;
  --mono:"SF Mono","Fira Code","Cascadia Code","Consolas",monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI","Inter",sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:13px;line-height:1.5;overflow-x:hidden;min-height:100vh}

/* \u2500\u2500 Scrollbar \u2500\u2500 */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* \u2500\u2500 Layout \u2500\u2500 */
.shell{display:grid;grid-template-rows:auto auto 1fr;min-height:100vh}

/* \u2500\u2500 Top bar \u2500\u2500 */
.topbar{
  display:flex;align-items:center;gap:12px;
  padding:16px 24px 0;
  position:sticky;top:0;z-index:50;
  background:linear-gradient(to bottom,var(--bg) 70%,transparent);
}
.brand{display:flex;align-items:center;gap:10px}
.brand-icon{font-size:26px;animation:breathe 4s ease-in-out infinite}
@keyframes breathe{0%,100%{filter:drop-shadow(0 0 8px rgba(255,92,26,.5))}50%{filter:drop-shadow(0 0 20px rgba(255,193,7,.8))}}
.brand-name{font-size:18px;font-weight:800;letter-spacing:-.3px;
  background:linear-gradient(120deg,var(--f1),var(--f3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.brand-sub{font-size:11px;color:var(--muted);margin-top:1px}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.badge-today{
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;
  transition:all .3s;
}
.badge-today.ok{background:rgba(34,217,122,.12);color:var(--green);border:1px solid rgba(34,217,122,.25)}
.badge-today.no{background:rgba(255,92,26,.1);color:var(--f1);border:1px solid rgba(255,92,26,.2)}
.dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:blink 1.5s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

/* \u2500\u2500 Nav tabs \u2500\u2500 */
.nav{
  display:flex;gap:2px;padding:14px 24px 0;
  border-bottom:1px solid var(--border);margin-bottom:0;
  overflow-x:auto;
}
.tab{
  padding:8px 16px;border-radius:var(--r2) var(--r2) 0 0;
  font-size:12px;font-weight:500;color:var(--muted);
  cursor:pointer;transition:all .2s;border:1px solid transparent;
  border-bottom:none;position:relative;bottom:-1px;
  background:transparent;user-select:none;white-space:nowrap;
}
.tab:hover{color:var(--text)}
.tab.active{
  color:var(--text);background:var(--card);
  border-color:var(--border);border-bottom-color:var(--card);
}

/* \u2500\u2500 Page content \u2500\u2500 */
.page{display:none;padding:24px}
.page.active{display:block}

/* \u2500\u2500 Hero numbers \u2500\u2500 */
.hero-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
@media(max-width:700px){.hero-grid{grid-template-columns:repeat(2,1fr)}}
.hero-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);padding:18px 20px;
  position:relative;overflow:hidden;cursor:default;
  transition:border-color .2s;
}
.hero-card:hover{border-color:var(--border2)}
.hero-card::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 20% 80%,var(--glow,rgba(255,92,26,.06)),transparent 60%);
  pointer-events:none;
}
.hero-card.streak{--glow:rgba(255,92,26,.1)}
.hero-card.lines-add{--glow:rgba(34,217,122,.08)}
.hero-card.lines-rm{--glow:rgba(255,77,109,.08)}
.hero-card.time{--glow:rgba(79,158,255,.08)}
.hc-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:var(--muted);margin-bottom:8px;display:flex;align-items:center;gap:5px}
.hc-val{font-size:40px;font-weight:800;line-height:1;font-family:var(--mono);letter-spacing:-1px}
.hc-val.streak-val{background:linear-gradient(135deg,var(--f1),var(--f3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hc-val.add-val{color:var(--green)}
.hc-val.rm-val{color:var(--red)}
.hc-val.time-val{color:var(--blue)}
.hc-sub{font-size:11px;color:var(--muted);margin-top:5px}
.flame-strip{display:flex;gap:4px;margin-top:10px}
.fs-dot{width:8px;height:8px;border-radius:50%;background:var(--dim);transition:all .3s;flex-shrink:0}
.fs-dot.lit{background:var(--f1);box-shadow:0 0 6px var(--f1);animation:fdot 2s ease-in-out infinite;animation-delay:calc(var(--i)*.12s)}
@keyframes fdot{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}

/* \u2500\u2500 Heatmap \u2500\u2500 */
.heatmap-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px;margin-bottom:16px}
.heatmap-scroll{overflow-x:auto;padding-bottom:6px}
.hm-inner{display:inline-flex;flex-direction:column;gap:3px}
.hm-months{display:flex;gap:0;margin-bottom:6px;padding-left:18px}
.hm-month{font-size:10px;color:var(--muted);font-family:var(--mono);pointer-events:none}
.hm-rows{display:flex;gap:0}
.hm-days{display:flex;flex-direction:column;gap:3px;margin-right:5px}
.hm-day{font-size:9px;color:var(--dim);height:12px;line-height:12px;font-family:var(--mono);text-align:right;width:14px}
.hm-grid{display:flex;gap:3px}
.hm-col{display:flex;flex-direction:column;gap:3px}
.hm-cell{width:12px;height:12px;border-radius:3px;background:var(--h0);flex-shrink:0;cursor:default;transition:transform .1s,box-shadow .1s}
.hm-cell:hover{transform:scale(1.4);z-index:5;box-shadow:0 0 8px currentColor}
.hm-cell[data-v="1"]{background:var(--h1);color:var(--h1)}
.hm-cell[data-v="2"]{background:var(--h2);color:var(--h2)}
.hm-cell[data-v="3"]{background:var(--h3);color:var(--h3)}
.hm-cell[data-v="4"]{background:var(--h4);color:var(--h4)}
.hm-cell[data-v="5"]{background:var(--h5);color:var(--h5)}
.hm-cell.today-cell{outline:1.5px solid var(--f2);outline-offset:1px}
.hm-cell.frozen-cell{border:1px dashed rgba(79,158,255,.45)}
.hm-cell.frozen-cell:not([data-v]){background:rgba(79,158,255,.10)}
.hm-cell.frozen-cell:hover{box-shadow:0 0 8px var(--blue)}
.hm-legend{display:flex;align-items:center;gap:16px;margin-top:10px;flex-wrap:wrap}
.hm-legend-item{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--muted)}
.hm-legend-swatch{width:11px;height:11px;border-radius:3px;flex-shrink:0}
.hm-legend-swatch.frozen{background:rgba(79,158,255,.10);border:1px dashed rgba(79,158,255,.4)}
.hm-legend-swatch.h0{background:var(--h0)}
.hm-legend-swatch.h3{background:var(--h3)}
.hm-legend-swatch.h5{background:var(--h5)}

.streak-rule{
  font-size:10px;color:var(--muted);margin-top:8px;line-height:1.5;
  display:flex;align-items:flex-start;gap:5px;
}
.streak-rule .sr-ico{flex-shrink:0}

/* \u2500\u2500 Hourly heatmap \u2500\u2500 */
.hourly-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px;margin-bottom:16px}
.hourly-grid{display:grid;grid-template-columns:repeat(24,1fr);gap:4px;margin-top:10px}
.hh-cell{
  aspect-ratio:1;border-radius:4px;background:var(--h0);
  cursor:default;transition:transform .1s,box-shadow .1s;position:relative;
}
.hh-cell:hover{transform:scale(1.3);z-index:5}
.hh-cell[data-v="1"]{background:var(--h1)}
.hh-cell[data-v="2"]{background:var(--h2)}
.hh-cell[data-v="3"]{background:var(--h3)}
.hh-cell[data-v="4"]{background:var(--h4)}
.hh-cell[data-v="5"]{background:var(--h5)}
.hourly-labels{display:grid;grid-template-columns:repeat(24,1fr);gap:4px;margin-top:4px}
.hh-label{font-size:8px;color:var(--dim);text-align:center;font-family:var(--mono)}

/* \u2500\u2500 Section shared \u2500\u2500 */
.sec-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
@media(max-width:600px){.sec-row{grid-template-columns:1fr}}
.sec{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px}
.sec-title{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.1px;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:6px}

/* \u2500\u2500 Bar chart \u2500\u2500 */
.bars{display:flex;align-items:flex-end;gap:3px;height:70px;margin-top:4px}
.b-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0}
.b-bar{width:100%;border-radius:3px 3px 0 0;min-height:2px;transition:height .7s cubic-bezier(.34,1.4,.64,1);cursor:default}
.b-bar.add-bar{background:rgba(34,217,122,.6)}
.b-bar.add-bar:hover{background:var(--green)}
.b-bar.today-bar{background:var(--f1)!important}
.b-lbl{font-size:8px;color:var(--dim);font-family:var(--mono);line-height:1;text-align:center}
.b-lbl.today-lbl{color:var(--f2);font-weight:700}

/* \u2500\u2500 Lang chart \u2500\u2500 */
.lang-list{display:flex;flex-direction:column;gap:8px}
.lang-row{display:flex;align-items:center;gap:8px}
.lang-name{font-family:var(--mono);font-size:11px;color:var(--text);width:70px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lang-bar-wrap{flex:1;height:6px;background:var(--dim);border-radius:3px;overflow:hidden}
.lang-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--f1),var(--f3));transition:width .8s cubic-bezier(.34,1.2,.64,1)}
.lang-stat{font-family:var(--mono);font-size:10px;color:var(--muted);text-align:right;width:56px;flex-shrink:0}

/* \u2500\u2500 Activity feed \u2500\u2500 */
.feed{display:flex;flex-direction:column;gap:0}
.feed-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
.feed-item:last-child{border-bottom:none}
.feed-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;background:var(--card2);border:1px solid var(--border2)}
.feed-main{flex:1;min-width:0}
.feed-cmd{font-family:var(--mono);font-size:11px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.feed-meta{font-size:10px;color:var(--muted);margin-top:2px;display:flex;gap:8px}
.feed-time{font-size:10px;color:var(--dim);font-family:var(--mono);flex-shrink:0;padding-top:1px}
.feed-empty{color:var(--muted);text-align:center;padding:32px 0;font-size:13px}

/* \u2500\u2500 Stats page \u2500\u2500 */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
.stat-box{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px}
.stat-box .v{font-size:26px;font-weight:700;font-family:var(--mono);color:var(--text)}
.stat-box .n{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-top:3px}

/* \u2500\u2500 Level page \u2500\u2500 */
.level-hero{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:28px;margin-bottom:16px;
  display:flex;align-items:center;gap:24px;
  position:relative;overflow:hidden;
}
.level-hero::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 80% 50%,rgba(168,85,247,.1),transparent 60%);
  pointer-events:none;
}
.lh-icon{font-size:56px;line-height:1;flex-shrink:0;filter:drop-shadow(0 0 20px rgba(168,85,247,.5))}
.lh-info{flex:1;min-width:0}
.lh-level{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:var(--purple);margin-bottom:4px}
.lh-title{font-size:32px;font-weight:800;letter-spacing:-.5px;
  background:linear-gradient(135deg,var(--purple),var(--blue));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.lh-xp{font-size:13px;color:var(--muted);margin-top:4px;font-family:var(--mono)}
.lh-bar-wrap{height:8px;background:var(--dim);border-radius:4px;margin-top:10px;overflow:hidden}
.lh-bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--purple),var(--blue));transition:width 1.2s cubic-bezier(.34,1.2,.64,1)}
.lh-next{font-size:10px;color:var(--muted);margin-top:5px;display:flex;justify-content:space-between}

.level-ladder{display:flex;flex-direction:column;gap:3px;margin-bottom:16px}
.ll-row{
  display:flex;align-items:center;gap:12px;
  padding:10px 14px;border-radius:var(--r2);
  border:1px solid transparent;transition:all .15s;
  background:var(--card);
}
.ll-row.current{border-color:var(--purple);background:rgba(168,85,247,.06)}
.ll-row.done{opacity:.55}
.ll-row.locked{opacity:.3}
.ll-num{font-size:10px;color:var(--muted);font-family:var(--mono);width:22px;flex-shrink:0;text-align:center}
.ll-icon{font-size:20px;width:28px;text-align:center;flex-shrink:0}
.ll-name{font-size:13px;font-weight:600;flex:1}
.ll-xp{font-size:11px;color:var(--muted);font-family:var(--mono)}
.ll-badge{font-size:9px;padding:2px 6px;border-radius:10px;font-weight:700;flex-shrink:0}
.ll-badge.cur{background:rgba(168,85,247,.2);color:var(--purple)}
.ll-badge.done2{background:rgba(34,217,122,.15);color:var(--green)}

/* \u2500\u2500 Achievements page \u2500\u2500 */
.ach-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap}
.ach-progress-text{font-size:13px;color:var(--muted)}
.ach-progress-text strong{color:var(--text)}
.ach-filter{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.ach-pill{
  padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;
  cursor:pointer;border:1px solid var(--border2);color:var(--muted);
  background:transparent;transition:all .15s;
}
.ach-pill:hover{color:var(--text)}
.ach-pill.active{background:rgba(255,92,26,.12);color:var(--f2);border-color:rgba(255,92,26,.3)}

.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.ach-card{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:16px;display:flex;flex-direction:column;gap:8px;
  position:relative;overflow:hidden;transition:border-color .2s;
}
.ach-card:hover{border-color:var(--border2)}
.ach-card.unlocked{border-color:rgba(245,158,11,.25)}
.ach-card.unlocked::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 20% 20%,rgba(245,158,11,.07),transparent 60%);
  pointer-events:none;
}
.ach-card.locked{opacity:.82}
.ach-top{display:flex;align-items:flex-start;gap:10px}
.ach-icon{font-size:28px;line-height:1;flex-shrink:0}
.ach-info{flex:1;min-width:0}
.ach-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px}
.ach-name.unlocked-name{color:var(--gold)}
.ach-desc{font-size:11px;color:var(--muted);line-height:1.4}
.ach-progress-wrap{height:5px;background:var(--dim);border-radius:3px;overflow:hidden;margin-top:2px}
.ach-progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--f1),var(--f3));transition:width .8s cubic-bezier(.34,1.2,.64,1)}
.ach-progress-fill.done{background:linear-gradient(90deg,var(--gold),var(--f2))}
.ach-progress-label{font-size:9px;color:var(--muted);font-family:var(--mono);margin-top:3px;display:flex;justify-content:space-between}
.ach-footer{display:flex;align-items:center;justify-content:space-between;margin-top:2px}
.ach-cat{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--dim);font-weight:600}
.ach-xp{font-size:11px;font-weight:700;color:var(--gold);font-family:var(--mono)}
.ach-date{font-size:9px;color:var(--muted);font-family:var(--mono)}
.ach-lock{position:absolute;top:10px;right:10px;font-size:14px;opacity:.3}
.ach-icon.locked-icon{filter:grayscale(1);opacity:.4}

/* \u2500\u2500 Tooltip \u2500\u2500 */
.tip{
  position:fixed;background:#1a1a2e;color:var(--text);
  font-size:11px;padding:6px 10px;border-radius:6px;
  pointer-events:none;opacity:0;transition:opacity .12s;
  z-index:200;white-space:nowrap;border:1px solid var(--border2);
  font-family:var(--mono);box-shadow:0 4px 16px rgba(0,0,0,.4);
}

/* \u2500\u2500 Action buttons \u2500\u2500 */
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}
.btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;
  cursor:pointer;border:1px solid transparent;font-family:var(--sans);
  transition:all .15s;letter-spacing:.2px;
}
.btn-primary{background:linear-gradient(135deg,var(--f1),var(--f2));color:#fff;border-color:var(--f2);box-shadow:0 2px 12px rgba(255,92,26,.3)}
.btn-primary:hover{filter:brightness(1.1);box-shadow:0 4px 20px rgba(255,92,26,.4)}
.btn-primary:active{transform:scale(.97)}
.btn-ghost{background:transparent;color:var(--muted);border-color:var(--border2)}
.btn-ghost:hover{color:var(--text);border-color:var(--muted);background:var(--card)}

/* \u2500\u2500 Confetti \u2500\u2500 */
.cel{position:fixed;inset:0;pointer-events:none;z-index:999}
.cp{position:absolute;width:7px;height:7px;border-radius:2px;animation:cfal linear forwards}
@keyframes cfal{from{opacity:1;transform:translateY(0) rotate(0)}to{opacity:0;transform:translateY(100vh) rotate(800deg)}}

/* \u2500\u2500 Divider \u2500\u2500 */
.sep{height:1px;background:var(--border);margin:16px 0}

/* \u2500\u2500 Today strip \u2500\u2500 */
.today-strip{
  display:flex;align-items:center;gap:12px;
  margin:0 24px;padding:10px 0;border-bottom:1px solid var(--border);
  flex-wrap:wrap;
}
.ts-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}
.ts-item strong{color:var(--text);font-family:var(--mono)}
.ts-sep{color:var(--dim)}

/* \u2500\u2500 Streak compare \u2500\u2500 */
.streak-compare{margin-top:10px}
.sc-bar{height:3px;background:var(--dim);border-radius:2px;overflow:hidden;margin-top:3px}
.sc-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--f1),var(--f3));transition:width 1s cubic-bezier(.34,1.2,.64,1)}
</style>
</head>
<body>
<div class="shell">

<!-- Top bar -->
<div class="topbar">
  <div class="brand">
    <div class="brand-icon">\u{1F525}</div>
    <div>
      <div class="brand-name">FlameTrack</div>
      <div class="brand-sub">real productivity, not screen time</div>
    </div>
  </div>
  <div class="topbar-right">
    <div class="badge-today no" id="todayBadge">
      <span class="dot"></span> <span id="todayLabel">Loading...</span>
    </div>
  </div>
</div>

<!-- Today quick stats strip -->
<div class="today-strip" id="todayStrip">
  <div class="ts-item">\u23F1 Today: <strong id="ts-time">0 min</strong></div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u2705 <strong id="ts-add">+0</strong> lines</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u{1F5D1} <strong id="ts-rm">-0</strong> removed</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u{1F4BE} <strong id="ts-saves">0</strong> saves</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u{1F4C4} <strong id="ts-files">0</strong> files</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u26A1 <strong id="ts-xp">0 XP</strong></div>
</div>

<!-- Nav -->
<div class="nav">
  <div class="tab active" data-tab="overview">Overview</div>
  <div class="tab" data-tab="code">Code</div>
  <div class="tab" data-tab="activity">Activity</div>
  <div class="tab" data-tab="achievements">\u{1F3C5} Achievements</div>
  <div class="tab" data-tab="levels">\u26A1 Levels</div>
</div>

<!-- \u2500\u2500 PAGE: Overview \u2500\u2500 -->
<div class="page active" id="page-overview">

  <div class="hero-grid">
    <div class="hero-card streak">
      <div class="hc-label">\u{1F525} Streak</div>
      <div class="hc-val streak-val" id="hc-streak">0</div>
      <div class="hc-sub">days in a row \xB7 best: <span id="hc-best">0</span></div>
      <div class="flame-strip" id="flameStrip"></div>
      <div class="streak-rule" id="streakRule"></div>
    </div>
    <div class="hero-card lines-add">
      <div class="hc-label">\u2705 Lines Added</div>
      <div class="hc-val add-val" id="hc-add">0</div>
      <div class="hc-sub">all time \xB7 today: <span id="hc-add-today">0</span></div>
    </div>
    <div class="hero-card lines-rm">
      <div class="hc-label">\u{1F5D1} Lines Removed</div>
      <div class="hc-val rm-val" id="hc-rm">0</div>
      <div class="hc-sub">all time \xB7 today: <span id="hc-rm-today">0</span></div>
    </div>
    <div class="hero-card time">
      <div class="hc-label">\u23F1 Active Time</div>
      <div class="hc-val time-val" id="hc-time">0h</div>
      <div class="hc-sub">total \xB7 today: <span id="hc-time-today">0m</span></div>
    </div>
  </div>

  <!-- Heatmap 12 months -->
  <div class="heatmap-wrap">
    <div class="sec-title">Activity Heatmap \u2014 12 months</div>
    <div class="heatmap-scroll"><div class="hm-inner" id="heatmapRoot"></div></div>
    <div class="hm-legend" id="hmLegend"></div>
  </div>

  <!-- Hourly heatmap -->
  <div class="hourly-wrap">
    <div class="sec-title">\u{1F550} Hourly Activity \u2014 when do you code?</div>
    <div class="hourly-grid" id="hourlyRoot"></div>
    <div class="hourly-labels" id="hourlyLabels"></div>
  </div>

  <!-- 28-day bars + lang breakdown -->
  <div class="sec-row">
    <div class="sec">
      <div class="sec-title">Lines per Day \u2014 4 weeks</div>
      <div class="bars" id="barsRoot"></div>
    </div>
    <div class="sec">
      <div class="sec-title">Top Languages</div>
      <div class="lang-list" id="langRoot"></div>
    </div>
  </div>

</div>

<!-- \u2500\u2500 PAGE: Code \u2500\u2500 -->
<div class="page" id="page-code">

  <div class="stats-grid">
    <div class="stat-box"><div class="v" id="c-totalAdd">0</div><div class="n">Lines Added</div></div>
    <div class="stat-box"><div class="v" id="c-totalRm">0</div><div class="n">Lines Removed</div></div>
    <div class="stat-box"><div class="v" id="c-net">0</div><div class="n">Net Lines</div></div>
    <div class="stat-box"><div class="v" id="c-saves">0</div><div class="n">Total Saves</div></div>
    <div class="stat-box"><div class="v" id="c-hours">0h</div><div class="n">Active Hours</div></div>
    <div class="stat-box"><div class="v" id="c-days">0</div><div class="n">Active Days</div></div>
  </div>

  <div class="sec" style="margin-bottom:14px">
    <div class="sec-title">Lines Written per Day (all time)</div>
    <div id="allTimeBars" style="display:flex;align-items:flex-end;gap:2px;height:80px;overflow-x:auto"></div>
  </div>

  <div class="sec-row">
    <div class="sec">
      <div class="sec-title">Languages Breakdown</div>
      <div class="lang-list" id="langFullRoot"></div>
    </div>
    <div class="sec">
      <div class="sec-title">Most Edited Files (today)</div>
      <div id="filesRoot" style="display:flex;flex-direction:column;gap:6px;margin-top:4px"></div>
    </div>
  </div>

</div>

<!-- \u2500\u2500 PAGE: Activity \u2500\u2500 -->
<div class="page" id="page-activity">

  <div class="sec" style="margin-bottom:14px">
    <div class="sec-title">Recent Successful Actions</div>
    <div class="feed" id="feedRoot"></div>
  </div>

  <div class="actions">
    <button class="btn btn-primary" onclick="markToday()">\u270B Mark Today</button>
    <button class="btn btn-ghost" onclick="exportMd()">\u{1F4E4} Export Markdown</button>
  </div>

</div>

<!-- \u2500\u2500 PAGE: Achievements \u2500\u2500 -->
<div class="page" id="page-achievements">

  <div class="ach-header">
    <div class="ach-progress-text"><strong id="ach-count">0</strong> / <span id="ach-total">0</span> unlocked</div>
    <div style="flex:1;height:6px;background:var(--dim);border-radius:3px;overflow:hidden;min-width:80px">
      <div id="ach-overall-bar" style="height:100%;border-radius:3px;background:linear-gradient(90deg,var(--gold),var(--f2));transition:width 1s cubic-bezier(.34,1.2,.64,1);width:0%"></div>
    </div>
    <div style="font-size:11px;color:var(--muted);font-family:var(--mono)" id="ach-xp-earned">+0 XP earned</div>
  </div>

  <div class="ach-filter" id="achFilter">
    <div class="ach-pill active" data-cat="all">All</div>
    <div class="ach-pill" data-cat="streak">\u{1F525} Streak</div>
    <div class="ach-pill" data-cat="code">\u{1F4DD} Code</div>
    <div class="ach-pill" data-cat="time">\u23F1 Time</div>
    <div class="ach-pill" data-cat="habit">\u{1F319} Habits</div>
    <div class="ach-pill" data-cat="build">\u{1F680} Build</div>
    <div class="ach-pill" data-cat="special">\u2B50 Special</div>
  </div>

  <div class="ach-grid" id="achGrid"></div>

</div>

<!-- \u2500\u2500 PAGE: Levels \u2500\u2500 -->
<div class="page" id="page-levels">

  <div class="level-hero">
    <div class="lh-icon" id="lv-icon">\u2728</div>
    <div class="lh-info">
      <div class="lh-level">Level <span id="lv-num">1</span></div>
      <div class="lh-title" id="lv-title">Spark</div>
      <div class="lh-xp"><span id="lv-xp-total">0</span> XP total</div>
      <div class="lh-bar-wrap"><div class="lh-bar-fill" id="lv-bar" style="width:0%"></div></div>
      <div class="lh-next">
        <span id="lv-progress-text">0 / 100 XP to next level</span>
        <span id="lv-pct">0%</span>
      </div>
    </div>
  </div>

  <div class="sec-title" style="padding:0 0 12px">Level Ladder</div>
  <div class="level-ladder" id="levelLadder"></div>

</div>

</div><!-- /shell -->

<div class="tip" id="tip"></div>
<div class="cel" id="cel"></div>

<script>
const vscode = acquireVsCodeApi();
let D = null;
let activeTab = 'overview';
let achFilter = 'all';
// Defaults mirror package.json \u2014 overwritten by streakSettings from extension
let STREAK_SETTINGS = { minActiveMinutes: 5, minLinesAdded: 10, weekendFreeze: true };
// Fully-resolved achievement list (name/desc/icon/category/xp/current/target/pct/unlocked)
// computed server-side by achievements.ts \u2014 no duplication needed here.
let ACH_PROGRESS = [];

// \u2500\u2500 Level table (mirrors xp.ts) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const LEVELS = [
  [0,     'Spark',           '\u2728'],
  [100,   'Kindler',         '\u{1FAB5}'],
  [300,   'Flame',           '\u{1F525}'],
  [700,   'Inferno',         '\u{1F30B}'],
  [1500,  'Blaze',           '\u{1F4A5}'],
  [3000,  'Code Arsonist',   '\u{1F9E8}'],
  [6000,  'Senior Burner',   '\u26A1'],
  [12000, 'Legendary Coder', '\u{1F3C6}'],
  [25000, 'Mythic Dev',      '\u{1F48E}'],
  [50000, 'Eternal Flame',   '\u2600\uFE0F'],
];

function getLevelInfo(xp) {
  let idx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i][0]) { idx = i; break; }
  }
  const [xpReq, title, icon] = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const xpToNext = next ? next[0] - xpReq : 0;
  const xpIntoLevel = xp - xpReq;
  const pct = xpToNext === 0 ? 100 : Math.min(100, Math.round(xpIntoLevel / xpToNext * 100));
  return { level: idx + 1, title, icon, xpReq, xpToNext, xpIntoLevel, pct, isMax: xpToNext === 0 };
}

// \u2500\u2500 Streak capture helpers (mirrors storage.ts) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

/** Does this day count toward the streak, per current settings? */
function dayQualifiesForStreak(day) {
  if (!day) return false;
  if ((day.events?.length ?? 0) > 0) return true;
  if ((day.activeMinutes ?? 0) >= STREAK_SETTINGS.minActiveMinutes) return true;
  if ((day.linesAdded ?? 0) >= STREAK_SETTINGS.minLinesAdded) return true;
  return false;
}

/** Saturday or Sunday, by UTC day-of-week (matches the date-string keys). */
function isWeekend(dateStr) {
  const dow = new Date(dateStr + 'T00:00:00Z').getUTCDay();
  return dow === 0 || dow === 6;
}

function streakRuleText() {
  const s = STREAK_SETTINGS;
  const parts = [
    'a successful build/test/git push',
    '\u270B manual check-in',
    \`\\u2265\${s.minActiveMinutes} min active\`,
    \`\\u2265\${s.minLinesAdded} lines added\`,
  ];
  let txt = 'A day counts if: ' + parts.join(' \xB7 ');
  if (s.weekendFreeze) txt += '. Weekends are auto-frozen \\u2744\\ufe0f if you skip them.';
  return txt;
}

// \u2500\u2500 Messaging \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.addEventListener('message', e => {
  const msg = e.data;
  if (msg.type === 'data') {
    D = msg.payload;
    if (msg.streakSettings) STREAK_SETTINGS = msg.streakSettings;
    // achievementProgress is computed server-side by getAchievementProgressList()
    // and sent alongside the payload. Fall back to empty array if missing.
    if (msg.achievementProgress) ACH_PROGRESS = msg.achievementProgress;
    else if (msg.payload?.achievementProgress) ACH_PROGRESS = msg.payload.achievementProgress;
    renderAll(D);
  }
  if (msg.type === 'switch_tab') { switchTab(msg.tab); }
});
vscode.postMessage({ type: 'request_data' });

// \u2500\u2500 Tab switching \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  const t = document.querySelector(\`.tab[data-tab="\${tab}"]\`);
  if (t) t.classList.add('active');
  const p = document.getElementById('page-' + tab);
  if (p) p.classList.add('active');
  activeTab = tab;
  if (D) renderAll(D);
}

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => switchTab(t.dataset.tab));
});

// \u2500\u2500 Achievement filter \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
document.querySelectorAll('.ach-pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.ach-pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    achFilter = p.dataset.cat;
    if (D) renderAchievements(D);
  });
});

// \u2500\u2500 Render all \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderAll(d) {
  const today = todayStr();
  const day = d.activity[today];
  const activatedToday = dayQualifiesForStreak(day);
  const todayAdd   = day?.linesAdded ?? 0;
  const todayRm    = day?.linesRemoved ?? 0;
  const todayMin   = day?.activeMinutes ?? 0;
  const todaySaves = day?.saves ?? 0;
  const todayFiles = day?.filesEdited?.length ?? 0;

  const badge = document.getElementById('todayBadge');
  const label = document.getElementById('todayLabel');
  badge.className = 'badge-today ' + (activatedToday ? 'ok' : 'no');
  label.textContent = activatedToday ? 'Today logged' : 'Not logged yet';

  set('ts-time',  todayMin >= 60 ? (todayMin/60).toFixed(1)+'h' : todayMin+'m');
  set('ts-add',   '+' + fmt(todayAdd));
  set('ts-rm',    '-' + fmt(todayRm));
  set('ts-saves', todaySaves);
  set('ts-files', todayFiles);
  set('ts-xp',    fmt(d.totalXp ?? 0) + ' XP');

  renderOverview(d, day);
  renderCode(d, day);
  renderActivity(d);
  renderAchievements(d);
  renderLevels(d);
}

function renderOverview(d, day) {
  const totalHours = Math.round(d.totalActiveMinutes / 60);
  animCount('hc-streak', d.currentStreak, 500);
  animCount('hc-best', d.bestStreak, 500);
  set('hc-add', fmt(d.totalLinesAdded));
  set('hc-add-today', '+' + fmt(day?.linesAdded ?? 0));
  set('hc-rm', fmt(d.totalLinesRemoved));
  set('hc-rm-today', '-' + fmt(day?.linesRemoved ?? 0));
  set('hc-time', totalHours + 'h');
  set('hc-time-today', (day?.activeMinutes ?? 0) + 'm');

  const fs = document.getElementById('flameStrip');
  fs.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const d2 = document.createElement('div');
    d2.className = 'fs-dot' + (i < Math.min(d.currentStreak, 10) ? ' lit' : '');
    d2.style.setProperty('--i', i);
    fs.appendChild(d2);
  }

  const ruleEl = document.getElementById('streakRule');
  if (ruleEl) ruleEl.innerHTML = '<span class="sr-ico">\u2139\uFE0F</span><span>' + esc(streakRuleText()) + '</span>';

  buildHeatmap(d.activity);
  buildHourlyHeatmap(d.activity);
  buildBars28(d.activity);
  buildLangChart(d.activity, 'langRoot', 6);
}

function renderCode(d, day) {
  const net = d.totalLinesAdded - d.totalLinesRemoved;
  const hours = Math.round(d.totalActiveMinutes / 60);
  const days = Object.keys(d.activity).length;
  set('c-totalAdd', fmt(d.totalLinesAdded));
  set('c-totalRm', fmt(d.totalLinesRemoved));
  set('c-net', (net >= 0 ? '+' : '') + fmt(net));
  set('c-saves', fmt(d.totalSaves));
  set('c-hours', hours + 'h');
  set('c-days', days);
  buildAllTimeBars(d.activity);
  buildLangChart(d.activity, 'langFullRoot', 12);
  buildFilesList(day);
}

function renderActivity(d) {
  const recent = Object.values(d.activity)
    .flatMap(x => x.events || [])
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 30);

  const root = document.getElementById('feedRoot');
  if (!recent.length) {
    root.innerHTML = '<div class="feed-empty">No builds, tests or deploys logged yet.<br>Run some code to start your streak! \u{1F680}</div>';
    return;
  }
  const icons = { git: '\u{1F4E4}', manual: '\u270B', terminal: '\u26A1' };
  root.innerHTML = recent.map(ev => {
    const icon = icons[ev.kind] || '\u26A1';
    const meta = [ev.workspace, ev.tech].filter(Boolean).join(' \xB7 ');
    return \`<div class="feed-item">
      <div class="feed-icon">\${icon}</div>
      <div class="feed-main">
        <div class="feed-cmd" title="\${esc(ev.label)}">\${esc(ev.label)}</div>
        \${meta ? \`<div class="feed-meta"><span>\${esc(meta)}</span></div>\` : ''}
      </div>
      <div class="feed-time">\${relTime(ev.ts)}</div>
    </div>\`;
  }).join('');
}

// \u2500\u2500 Achievements render \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderAchievements(d) {
  // ACH_PROGRESS is the server-computed list with progress bars baked in.
  // Fall back to empty array if not yet received.
  const list = ACH_PROGRESS;
  if (!list.length) return;

  const total = list.length;
  const count = list.filter(a => a.unlocked).length;

  set('ach-count', count);
  set('ach-total', total);

  const totalXpEarned = list
    .filter(a => a.unlocked)
    .reduce((s, a) => s + a.xpReward, 0);
  set('ach-xp-earned', '+' + fmt(totalXpEarned) + ' XP earned');

  const bar = document.getElementById('ach-overall-bar');
  if (bar) setTimeout(() => bar.style.width = Math.round(count / total * 100) + '%', 50);

  const filtered = achFilter === 'all'
    ? list
    : list.filter(a => a.category === achFilter);

  // Unlocked first, then locked \u2014 within each group keep catalogue order
  const sorted = [
    ...filtered.filter(a => a.unlocked),
    ...filtered.filter(a => !a.unlocked),
  ];

  const grid = document.getElementById('achGrid');
  grid.innerHTML = sorted.map(a => {
    const isUnlocked = a.unlocked;
    // Progress bar: only show for in-progress achievements (pct > 0 and not unlocked)
    const showProgress = !isUnlocked && a.target > 1;
    const pct = a.pct ?? 0;
    const progressHtml = showProgress ? \`
      <div class="ach-progress-wrap">
        <div class="ach-progress-fill\${isUnlocked ? ' done' : ''}" style="width:\${pct}%"></div>
      </div>
      <div class="ach-progress-label">
        <span>\${fmtProgress(a.current, a.target)}</span>
        <span>\${pct}%</span>
      </div>\` : isUnlocked ? \`
      <div class="ach-progress-wrap">
        <div class="ach-progress-fill done" style="width:100%"></div>
      </div>
      <div class="ach-progress-label">
        <span>\${fmtProgress(a.target, a.target)}</span>
        <span>\u2713 Done</span>
      </div>\` : '';

    return \`<div class="ach-card \${isUnlocked ? 'unlocked' : 'locked'}">
      \${!isUnlocked ? '<div class="ach-lock">\u{1F512}</div>' : ''}
      <div class="ach-top">
        <div class="ach-icon\${isUnlocked ? '' : ' locked-icon'}">\${a.icon}</div>
        <div class="ach-info">
          <div class="ach-name \${isUnlocked ? 'unlocked-name' : ''}">\${esc(a.name)}</div>
          <div class="ach-desc">\${esc(a.description)}</div>
        </div>
      </div>
      \${progressHtml}
      <div class="ach-footer">
        <div class="ach-cat">\${a.category}</div>
        \${a.unlockedDate ? \`<div class="ach-date">\${a.unlockedDate}</div>\` : ''}
        <div class="ach-xp">+\${a.xpReward} XP</div>
      </div>
    </div>\`;
  }).join('');
}

/** Format progress numbers nicely: 1,234 / 10,000 */
function fmtProgress(current, target) {
  const fmtN = n => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return n.toLocaleString();
    return String(n);
  };
  return fmtN(Math.min(current, target)) + ' / ' + fmtN(target);
}

// \u2500\u2500 Levels render \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderLevels(d) {
  const xp = d.totalXp ?? 0;
  const info = getLevelInfo(xp);

  set('lv-icon', info.icon);
  set('lv-num', info.level);
  set('lv-title', info.title);
  set('lv-xp-total', fmt(xp));

  const bar = document.getElementById('lv-bar');
  if (bar) setTimeout(() => bar.style.width = info.pct + '%', 50);

  if (info.isMax) {
    set('lv-progress-text', 'MAX LEVEL \u2014 you absolute legend');
    set('lv-pct', '\u221E');
  } else {
    set('lv-progress-text', fmt(info.xpIntoLevel) + ' / ' + fmt(info.xpToNext) + ' XP to next level');
    set('lv-pct', info.pct + '%');
  }

  // Ladder
  const ladder = document.getElementById('levelLadder');
  ladder.innerHTML = LEVELS.map(([xpReq, title, icon], i) => {
    const lvNum = i + 1;
    const isCurrent = info.level === lvNum;
    const isDone = xp >= xpReq && !isCurrent;
    const isLocked = xp < xpReq;
    let cls = 'll-row';
    if (isCurrent) cls += ' current';
    else if (isDone) cls += ' done';
    else cls += ' locked';

    let badge = '';
    if (isCurrent) badge = '<span class="ll-badge cur">CURRENT</span>';
    else if (isDone) badge = '<span class="ll-badge done2">\u2713</span>';

    const next = LEVELS[i + 1];
    const xpNeeded = next ? next[0] : null;

    return \`<div class="\${cls}">
      <div class="ll-num">\${lvNum}</div>
      <div class="ll-icon">\${icon}</div>
      <div class="ll-name">\${esc(title)}</div>
      <div class="ll-xp">\${xpNeeded ? fmt(xpReq) + ' \u2013 ' + fmt(xpNeeded - 1) + ' XP' : fmt(xpReq) + '+ XP'}</div>
      \${badge}
    </div>\`;
  }).join('');
}

// \u2500\u2500 Heatmap 12 months \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildHeatmap(activity) {
  const root = document.getElementById('heatmapRoot');
  if (!root) return;
  const tip = document.getElementById('tip');
  const todayD = new Date(); todayD.setHours(0,0,0,0);
  const start = new Date(todayD); start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let monthHtml = '<div class="hm-months">';
  let colIdx = 0, cur = new Date(start);
  const colsByMonth = {};
  while (cur <= todayD) {
    const mon = cur.getMonth();
    if (!colsByMonth[mon]) colsByMonth[mon] = colIdx;
    cur.setDate(cur.getDate() + 7); colIdx++;
  }
  let prevMon = -1;
  for (let i = 0; i < colIdx; i++) {
    const label = Object.entries(colsByMonth).find(([,v]) => v === i);
    if (label && Number(label[0]) !== prevMon) {
      monthHtml += \`<div class="hm-month" style="width:\${12+3}px">\${months[Number(label[0])]}</div>\`;
      prevMon = Number(label[0]);
    } else {
      monthHtml += \`<div class="hm-month" style="width:\${12+3}px"></div>\`;
    }
  }
  monthHtml += '</div>';

  const dayLabels = '<div class="hm-days"><div class="hm-day"></div><div class="hm-day">M</div><div class="hm-day"></div><div class="hm-day">W</div><div class="hm-day"></div><div class="hm-day">F</div><div class="hm-day"></div></div>';

  const grid = document.createElement('div'); grid.className = 'hm-grid';
  cur = new Date(start);
  while (cur <= todayD) {
    const col = document.createElement('div'); col.className = 'hm-col';
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div'); cell.className = 'hm-cell';
      const k = ds(cur);
      const rec = activity[k];
      const lines = (rec?.linesAdded ?? 0) + (rec?.linesRemoved ?? 0);
      const evts = rec?.events?.length ?? 0;
      const heat = lines === 0 && evts === 0 ? 0 : lines < 20 ? 1 : lines < 80 ? 2 : lines < 200 ? 3 : lines < 500 ? 4 : 5;
      if (heat > 0) cell.setAttribute('data-v', heat);
      if (k === ds(todayD)) cell.classList.add('today-cell');

      const qualifies = dayQualifiesForStreak(rec);
      const frozen = !qualifies && isWeekend(k) && STREAK_SETTINGS.weekendFreeze;
      if (frozen) cell.classList.add('frozen-cell');

      cell.addEventListener('mouseenter', e => {
        const parts = [];
        if (evts) parts.push(evts + ' event' + (evts !== 1 ? 's' : ''));
        if (rec?.linesAdded) parts.push('+' + rec.linesAdded + ' lines');
        if (rec?.activeMinutes) parts.push(rec.activeMinutes + 'min');
        let txt = k + (parts.length ? ': ' + parts.join(', ') : ': no activity');
        if (frozen) txt += ' \u2744\uFE0F streak protected (weekend)';
        else if (qualifies) txt += ' \u2713 counted';
        tip.textContent = txt;
        tip.style.opacity = '1';
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top  = (e.clientY - 32) + 'px';
      });
      cell.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
      col.appendChild(cell);
      cur.setDate(cur.getDate() + 1);
    }
    grid.appendChild(col);
  }
  root.innerHTML = monthHtml + '<div class="hm-rows">' + dayLabels + '</div>';
  root.querySelector('.hm-rows').appendChild(grid);

  const legend = document.getElementById('hmLegend');
  if (legend) {
    let legendHtml = \`
      <div class="hm-legend-item"><div class="hm-legend-swatch h0"></div><span>No activity</span></div>
      <div class="hm-legend-item"><div class="hm-legend-swatch h3"></div><span>Active day</span></div>
      <div class="hm-legend-item"><div class="hm-legend-swatch h5"></div><span>Heavy day</span></div>
    \`;
    if (STREAK_SETTINGS.weekendFreeze) {
      legendHtml += '<div class="hm-legend-item"><div class="hm-legend-swatch frozen"></div><span>\u2744\uFE0F Weekend freeze (streak protected)</span></div>';
    }
    legend.innerHTML = legendHtml;
  }
}

// \u2500\u2500 Hourly heatmap \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildHourlyHeatmap(activity) {
  const root    = document.getElementById('hourlyRoot');
  const lblRoot = document.getElementById('hourlyLabels');
  const tip     = document.getElementById('tip');
  if (!root) return;

  // Aggregate all-time lines per hour (index 0\u201323)
  const totals = new Array(24).fill(0);
  Object.values(activity).forEach(day => {
    const h = day.hourlyActivity;
    if (!h) return;
    for (let i = 0; i < 24; i++) totals[i] += h[i] ?? 0;
  });

  const max = Math.max(...totals, 1);

  root.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const v = totals[h];
    const heat = v === 0 ? 0 : v < max * .1 ? 1 : v < max * .3 ? 2 : v < max * .6 ? 3 : v < max * .85 ? 4 : 5;
    const cell = document.createElement('div');
    cell.className = 'hh-cell';
    if (heat > 0) cell.setAttribute('data-v', heat);
    const label = h === 0 ? '12a' : h < 12 ? h + 'a' : h === 12 ? '12p' : (h - 12) + 'p';
    cell.addEventListener('mouseenter', e => {
      tip.textContent = label + ': ' + fmt(v) + ' lines';
      tip.style.opacity = '1';
      tip.style.left = (e.clientX + 14) + 'px';
      tip.style.top  = (e.clientY - 32) + 'px';
    });
    cell.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    root.appendChild(cell);
  }

  // Labels: show every 3 hours
  lblRoot.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const el = document.createElement('div');
    el.className = 'hh-label';
    el.textContent = h % 3 === 0 ? (h === 0 ? '12a' : h < 12 ? h+'a' : h === 12 ? '12p' : (h-12)+'p') : '';
    lblRoot.appendChild(el);
  }
}

// \u2500\u2500 28-day bars \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildBars28(activity) {
  const root = document.getElementById('barsRoot');
  if (!root) return;
  const todayD = new Date(); todayD.setHours(0,0,0,0);
  const days = [];
  for (let i = 27; i >= 0; i--) { const d2 = new Date(todayD); d2.setDate(d2.getDate()-i); days.push(d2); }
  const max = Math.max(...days.map(d2 => activity[ds(d2)]?.linesAdded ?? 0), 1);
  const dlabels = ['S','M','T','W','T','F','S'];
  root.innerHTML = days.map((d2, i) => {
    const k = ds(d2); const add = activity[k]?.linesAdded ?? 0; const isT = i === 27;
    const h = Math.max(Math.round((add/max)*60), add > 0 ? 4 : 2);
    return \`<div class="b-col">
      <div class="b-bar add-bar\${isT?' today-bar':''}" style="height:\${h}px" title="\${k}: +\${add} lines"></div>
      <div class="b-lbl\${isT?' today-lbl':''}">\${isT?'\u25BC':dlabels[d2.getDay()]}</div>
    </div>\`;
  }).join('');
}

// \u2500\u2500 All-time bars \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildAllTimeBars(activity) {
  const root = document.getElementById('allTimeBars');
  if (!root) return;
  const sorted = Object.entries(activity).sort((a,b) => a[0].localeCompare(b[0]));
  if (!sorted.length) { root.textContent = 'No data yet'; return; }
  const max = Math.max(...sorted.map(([,d]) => d.linesAdded), 1);
  root.innerHTML = sorted.map(([date, d]) => {
    const h = Math.max(Math.round((d.linesAdded/max)*68), d.linesAdded > 0 ? 3 : 1);
    return \`<div style="flex:1;min-width:4px;display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="width:100%;min-width:4px;background:rgba(34,217,122,.5);border-radius:2px 2px 0 0;height:\${h}px;cursor:default" title="\${date}: +\${d.linesAdded} lines"></div>
    </div>\`;
  }).join('');
}

// \u2500\u2500 Language chart \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildLangChart(activity, rootId, limit) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const map = {};
  Object.values(activity).forEach(d => {
    Object.entries(d.byLang || {}).forEach(([lang, s]) => {
      if (!map[lang]) map[lang] = { added: 0, removed: 0 };
      map[lang].added += s.linesAdded;
      map[lang].removed += s.linesRemoved;
    });
  });
  const sorted = Object.entries(map).sort((a,b) => b[1].added - a[1].added).slice(0, limit);
  if (!sorted.length) { root.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:8px 0">No data yet</div>'; return; }
  const max = sorted[0][1].added || 1;
  root.innerHTML = sorted.map(([lang, s]) => \`
    <div class="lang-row">
      <div class="lang-name">\${esc(lang)}</div>
      <div class="lang-bar-wrap"><div class="lang-bar-fill" style="width:\${Math.round(s.added/max*100)}%"></div></div>
      <div class="lang-stat">+\${fmt(s.added)}</div>
    </div>
  \`).join('');
}

// \u2500\u2500 Files list \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildFilesList(day) {
  const root = document.getElementById('filesRoot');
  if (!root) return;
  const files = day?.filesEdited ?? [];
  if (!files.length) {
    root.innerHTML = '<div style="color:var(--muted);font-size:12px">No files edited today</div>'; return;
  }
  root.innerHTML = files.slice(0, 12).map(f => \`
    <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:14px">\u{1F4C4}</span>
      <span style="font-family:var(--mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(f)}</span>
    </div>
  \`).join('');
}

// \u2500\u2500 Actions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function markToday() {
  vscode.postMessage({ type: 'mark_today_manual' });
  celebrate();
  setTimeout(() => vscode.postMessage({ type: 'request_data' }), 200);
}
function exportMd() { vscode.postMessage({ type: 'export_markdown' }); }

// \u2500\u2500 Confetti \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function celebrate() {
  const cel = document.getElementById('cel');
  const cols = ['#ff5c1a','#ff8c00','#ffc107','#22d97a','#4f9eff','#a855f7'];
  cel.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div'); p.className = 'cp';
    p.style.cssText = \`left:\${Math.random()*100}vw;background:\${cols[i%6]};animation-duration:\${.8+Math.random()*1.5}s;animation-delay:\${Math.random()*.5}s\`;
    cel.appendChild(p);
  }
  setTimeout(() => { cel.innerHTML = ''; }, 3000);
}

// \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function animCount(id, to, ms) {
  const el = document.getElementById(id); if (!el || to === 0) { if(el) el.textContent = 0; return; }
  let n = 0; const steps = Math.min(30, to);
  const iv = setInterval(() => {
    n++; el.textContent = Math.round(to * n / steps);
    if (n >= steps) { el.textContent = to; clearInterval(iv); }
  }, ms / steps);
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function ds(d) { return d.toISOString().slice(0, 10); }
function fmt(n) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'k';
  return String(n);
}
function relTime(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return 'just now';
  if (d < 3600000) return Math.floor(d/60000) + 'm ago';
  if (d < 86400000) return Math.floor(d/3600000) + 'h ago';
  return Math.floor(d/86400000) + 'd ago';
}
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
</script>
</body>
</html>`
);

// src/webview/panel.ts
var FlamePanel = class _FlamePanel {
  constructor(context, storage2, onMarkManual) {
    this.context = context;
    this.storage = storage2;
    this.onMarkManual = onMarkManual;
    this.disposables = [];
    this.panel = vscode5.window.createWebviewPanel(
      "flametrack.stats",
      "\u{1F525} FlameTrack",
      vscode5.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );
    this.panel.webview.html = getWebviewHtml();
    this.sendData(storage2);
    this.panel.webview.onDidReceiveMessage(
      (msg) => {
        switch (msg.type) {
          case "request_data":
            this.sendData(storage2);
            break;
          case "mark_today_manual":
            onMarkManual();
            setTimeout(() => this.sendData(storage2), 100);
            break;
          case "export_markdown": {
            const md = storage2.exportMarkdown();
            vscode5.workspace.openTextDocument({ content: md, language: "markdown" }).then((doc) => vscode5.window.showTextDocument(doc));
            break;
          }
        }
      },
      null,
      this.disposables
    );
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    _FlamePanel.current = this;
  }
  static show(context, storage2, onMarkManual) {
    if (_FlamePanel.current) {
      _FlamePanel.current.panel.reveal(vscode5.ViewColumn.One);
      _FlamePanel.current.sendData(storage2);
      return;
    }
    new _FlamePanel(context, storage2, onMarkManual);
  }
  static refresh(storage2) {
    _FlamePanel.current?.sendData(storage2);
  }
  /** Tell the webview to switch to a specific tab */
  static sendTabSwitch(tab) {
    _FlamePanel.current?.panel.webview.postMessage({ type: "switch_tab", tab });
  }
  sendData(storage2) {
    const data = storage2.getData();
    this.panel.webview.postMessage({
      type: "data",
      payload: storage2.getData(),
      streakSettings: storage2.getStreakSettings(),
      achievementProgress: getAchievementProgressList(data)
    });
  }
  dispose() {
    _FlamePanel.current = void 0;
    this.panel.dispose();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
};

// src/extension.ts
var storage;
function activate(context) {
  storage = new FlameStorage(context);
  storage.checkStreakIntegrity();
  const statusBar = new FlameStatusBar(storage, "flametrack.openStats");
  context.subscriptions.push(statusBar);
  storage.onAchievementUnlock((unlocks) => {
    for (const ach of unlocks) {
      vscode6.window.showInformationMessage(
        `${ach.icon} Achievement unlocked: ${ach.name} (+${ach.xpReward} XP)`,
        "View Achievements"
      ).then((action) => {
        if (action === "View Achievements") {
          FlamePanel.show(context, storage, () => {
            tracker.markTodayManual();
            statusBar.update();
            FlamePanel.refresh(storage);
          });
          setTimeout(() => {
            FlamePanel.sendTabSwitch("achievements");
          }, 300);
        }
      });
    }
    statusBar.update();
    FlamePanel.refresh(storage);
  });
  const tracker = new FlameTracker(storage);
  tracker.onSuccess(() => {
    statusBar.update();
    FlamePanel.refresh(storage);
  });
  tracker.activate();
  context.subscriptions.push({ dispose: () => tracker.dispose() });
  const codeTracker = new CodeTracker(storage);
  codeTracker.onFlush(() => {
    statusBar.update();
    FlamePanel.refresh(storage);
  });
  codeTracker.activate();
  context.subscriptions.push({ dispose: () => codeTracker.dispose() });
  context.subscriptions.push(
    vscode6.commands.registerCommand("flametrack.openStats", () => {
      FlamePanel.show(context, storage, () => {
        tracker.markTodayManual();
        statusBar.update();
        FlamePanel.refresh(storage);
      });
    }),
    vscode6.commands.registerCommand("flametrack.markToday", () => {
      tracker.markTodayManual();
      statusBar.update();
      FlamePanel.refresh(storage);
    }),
    vscode6.commands.registerCommand("flametrack.exportMarkdown", () => {
      const md = storage.exportMarkdown();
      vscode6.workspace.openTextDocument({ content: md, language: "markdown" }).then((doc) => vscode6.window.showTextDocument(doc));
    })
  );
  const hourly = setInterval(() => {
    storage.checkStreakIntegrity();
    statusBar.update();
  }, 60 * 60 * 1e3);
  context.subscriptions.push({ dispose: () => clearInterval(hourly) });
}
function deactivate() {
  storage?.flush();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
