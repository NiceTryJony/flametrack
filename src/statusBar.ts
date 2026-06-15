import * as vscode from "vscode";
import type { FlameStorage } from "./storage";
import { toDateString, dayQualifiesForStreak } from "./storage";

export class FlameStatusBar {
  private item: vscode.StatusBarItem;

  constructor(
    private readonly storage: FlameStorage,
    private readonly onClickCommand: string
  ) {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = onClickCommand;
    this.update();
    this.item.show();
  }

  update(): void {
    const { currentStreak, activity } = this.storage.getData();
    const today = toDateString();
    const day = activity[today];
    const settings = this.storage.getStreakSettings();

    // Same criteria as the streak capture system: an event, OR enough
    // active minutes, OR enough lines added today.
    const activatedToday = dayQualifiesForStreak(day, settings);
    const hasEvent = (day?.events?.length ?? 0) > 0;
    const todayLines = (day?.linesAdded ?? 0) + (day?.linesRemoved ?? 0);

    // Build display: 🔥3  +142
    const streakPart = currentStreak > 0 ? `🔥${currentStreak}` : `🔥0`;
    const linesPart = todayLines > 0
      ? `  $(diff-added)${fmtLines(day?.linesAdded ?? 0)}`
      : "";

    this.item.text = streakPart + linesPart;

    if (!activatedToday && currentStreak > 0) {
      this.item.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
      this.item.tooltip = `FlameTrack\nStreak: ${currentStreak} 🔥\n⚠️ Today not logged yet`;
    } else {
      this.item.backgroundColor = undefined;
      const todayMin = day?.activeMinutes ?? 0;
      this.item.tooltip = [
        "FlameTrack",
        `Streak: ${currentStreak} day${currentStreak !== 1 ? "s" : ""}`,
        activatedToday
          ? (hasEvent ? "✅ Today logged" : "✅ Today logged (coding activity)")
          : "—",
        todayLines ? `Lines today: +${day?.linesAdded ?? 0} / -${day?.linesRemoved ?? 0}` : "",
        todayMin ? `Active: ${todayMin}m` : "",
        "",
        "Click to open stats",
      ].filter(x => x !== undefined).join("\n");
    }
  }

  dispose(): void { this.item.dispose(); }
}

function fmtLines(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}