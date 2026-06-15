import * as vscode from "vscode";
import { FlameStorage } from "./storage";
import { FlameTracker } from "./tracker";
import { CodeTracker } from "./codeTracker";
import { FlameStatusBar } from "./statusBar";
import { FlamePanel } from "./webview/panel";

let storage: FlameStorage | undefined;

export function activate(context: vscode.ExtensionContext): void {
  storage = new FlameStorage(context);
  storage.checkStreakIntegrity();

  // ── Status bar ────────────────────────────────────────────────────────────
  const statusBar = new FlameStatusBar(storage, "flametrack.openStats");
  context.subscriptions.push(statusBar);

  // ── Achievement unlock notifications ──────────────────────────────────────
  storage.onAchievementUnlock(unlocks => {
    for (const ach of unlocks) {
      vscode.window.showInformationMessage(
        `${ach.icon} Achievement unlocked: ${ach.name} (+${ach.xpReward} XP)`,
        "View Achievements"
      ).then(action => {
        if (action === "View Achievements") {
          FlamePanel.show(context, storage!, () => {
            tracker.markTodayManual();
            statusBar.update();
            FlamePanel.refresh(storage!);
          });
          // Switch to achievements tab once panel opens
          setTimeout(() => {
            FlamePanel.sendTabSwitch("achievements");
          }, 300);
        }
      });
    }
    statusBar.update();
    FlamePanel.refresh(storage!);
  });

  // ── Terminal tracker (streak / builds / deploys) ──────────────────────────
  const tracker = new FlameTracker(storage);
  tracker.onSuccess(() => {
    statusBar.update();
    FlamePanel.refresh(storage!);
  });
  tracker.activate();
  context.subscriptions.push({ dispose: () => tracker.dispose() });

  // ── Code tracker (lines written, saves, active time) ──────────────────────
  const codeTracker = new CodeTracker(storage);
  codeTracker.onFlush(() => {
    statusBar.update();
    FlamePanel.refresh(storage!);
  });
  codeTracker.activate();
  context.subscriptions.push({ dispose: () => codeTracker.dispose() });

  // ── Commands ──────────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand("flametrack.openStats", () => {
      FlamePanel.show(context, storage!, () => {
        tracker.markTodayManual();
        statusBar.update();
        FlamePanel.refresh(storage!);
      });
    }),
    vscode.commands.registerCommand("flametrack.markToday", () => {
      tracker.markTodayManual();
      statusBar.update();
      FlamePanel.refresh(storage!);
    }),
    vscode.commands.registerCommand("flametrack.exportMarkdown", () => {
      const md = storage!.exportMarkdown();
      vscode.workspace
        .openTextDocument({ content: md, language: "markdown" })
        .then(doc => vscode.window.showTextDocument(doc));
    })
  );

  // ── Hourly checks (midnight streak reset, status bar refresh) ────────────
  const hourly = setInterval(() => {
    storage!.checkStreakIntegrity();
    statusBar.update();
  }, 60 * 60 * 1000);
  context.subscriptions.push({ dispose: () => clearInterval(hourly) });
}

export function deactivate(): void {
  storage?.flush();
}