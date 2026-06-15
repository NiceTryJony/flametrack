/**
 * FlameTrack — XP & Level System.
 *
 * XP sources:
 *   - Lines added:         1 XP per 10 lines
 *   - Lines removed:       1 XP per 20 lines (refactoring is work too)
 *   - Active minutes:      1 XP per minute
 *   - Saves:               1 XP per 5 saves
 *   - Terminal events:     10 XP each
 *   - Achievements:        xpReward per achievement (defined in achievements.ts)
 *
 * rehydrateXp() — полный пересчёт с нуля по всем активностям и ачивкам.
 * Используй после reset/restore/импорта данных.
 */

import type { FlameData, LevelInfo } from "./types";
import { ACHIEVEMENTS } from "./achievements";

// ── Level ladder ─────────────────────────────────────────────────────────────
// Each entry: [minXP, title, icon]
const LEVEL_TABLE: [number, string, string][] = [
  [0,       "Spark",           "✨"],
  [100,     "Kindler",         "🪵"],
  [300,     "Flame",           "🔥"],
  [700,     "Inferno",         "🌋"],
  [1_500,   "Blaze",           "💥"],
  [3_000,   "Code Arsonist",   "🧨"],
  [6_000,   "Senior Burner",   "⚡"],
  [12_000,  "Legendary Coder", "🏆"],
  [25_000,  "Mythic Dev",      "💎"],
  [50_000,  "Eternal Flame",   "☀️"],
];

export function getLevelInfo(totalXp: number): LevelInfo {
  let idx = 0;
  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_TABLE[i][0]) { idx = i; break; }
  }
  const [xpRequired, title, icon] = LEVEL_TABLE[idx];
  const next = LEVEL_TABLE[idx + 1];
  const xpToNext = next ? next[0] - xpRequired : 0;

  return {
    level: idx + 1,
    title,
    xpRequired,
    xpToNext,
    icon,
  };
}

export function getLevelProgress(totalXp: number): {
  current: LevelInfo;
  xpIntoLevel: number;
  progressPct: number;
  isMaxLevel: boolean;
} {
  const current = getLevelInfo(totalXp);
  const isMaxLevel = current.xpToNext === 0;
  const xpIntoLevel = totalXp - current.xpRequired;
  const progressPct = isMaxLevel ? 100 : Math.min(100, Math.round((xpIntoLevel / current.xpToNext) * 100));
  return { current, xpIntoLevel, progressPct, isMaxLevel };
}

// ── XP calculation from raw data ─────────────────────────────────────────────

/**
 * Full from-scratch recalculation of total XP, based on:
 *   - all activity records (lines, time, saves, events)
 *   - XP rewards of currently unlocked achievements
 *
 * This does NOT mutate data — it returns the value you should assign to
 * data.totalXp. Use this after reset/restore/import, when incremental
 * tracking (xpForEdit/xpForSaves/xpForEvent + achievement rewards added on
 * unlock) can't be trusted to reflect the current state.
 */
export function recalcTotalXp(data: FlameData): number {
  let xp = 0;

  for (const day of Object.values(data.activity)) {
    xp += Math.floor(day.linesAdded / 10);
    xp += Math.floor(day.linesRemoved / 20);
    xp += day.activeMinutes;
    xp += Math.floor(day.saves / 5);
    xp += day.events.length * 10;
  }

  // Achievement bonuses — sum xpReward for every unlocked achievement
  const rewardById = new Map(ACHIEVEMENTS.map(a => [a.id, a.xpReward]));
  for (const id of data.unlockedAchievements) {
    xp += rewardById.get(id) ?? 0;
  }

  return Math.max(0, xp);
}

/**
 * Recompute data.totalXp from scratch and write it back.
 * Call this after restoring/importing data, or after a manual reset,
 * to guarantee XP matches the actual recorded activity + achievements.
 *
 * Returns the new total (also assigned to data.totalXp).
 */
export function rehydrateXp(data: FlameData): number {
  const xp = recalcTotalXp(data);
  data.totalXp = xp;
  return xp;
}

/** XP delta for a single edit batch */
export function xpForEdit(opts: {
  linesAdded: number;
  linesRemoved: number;
  activeMinutesDelta: number;
}): number {
  return (
    Math.floor(opts.linesAdded / 10) +
    Math.floor(opts.linesRemoved / 20) +
    opts.activeMinutesDelta
  );
}

/** XP for a save batch */
export function xpForSaves(saveCount: number): number {
  return Math.floor(saveCount / 5);
}

/** XP for a successful terminal event */
export function xpForEvent(): number {
  return 10;
}

export { LEVEL_TABLE };