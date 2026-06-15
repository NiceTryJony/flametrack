/**
 * FlameTrack — Terminal Tracker.
 * Hooks shell execution events to detect successful builds/tests/deploys.
 * Uses onDidEndTerminalShellExecution (VS Code 1.93+).
 */
import * as vscode from "vscode";
import type { FlameStorage } from "./storage";
import type { SuccessEvent } from "./types";

const PRODUCTIVE_PATTERNS: RegExp[] = [
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
  /\bpytest\b/, /\buvicorn\b/, /\bflask\b/, /\bdjango.*runserver\b/,
  // C/C++
  /\bcmake\s+--build\b/, /\bmake\b(?!\s*install)/,
  // Java/Kotlin
  /\bmvn\s+(test|package|install|compile)\b/,
  /\bgradle\s+(test|build|assemble)\b/,
  // .NET
  /\bdotnet\s+(build|test|run|publish)\b/,
  // Docker
  /\bdocker\s+build\b/, /\bdocker\s+compose\s+up\b/,
  // Git
  /\bgit\s+push\b/, /\bgit\s+commit\b/,
  // Deploy
  /\bnpm\s+publish\b/, /\bvercel\b/, /\bfly\s+deploy\b/,
  /\bgcloud\s+deploy\b/, /\baws\b.*deploy/,
  // Test runners
  /\bjest\b/, /\bvitest\b/, /\bmocha\b/, /\bcypress\b.*run\b/,
  /\bplaywright\s+test\b/,
  // Ruby
  /\bbundle\s+exec\b/, /\brspec\b/, /\brails\s+(test|server)\b/,
  // PHP
  /\bphp\s+artisan\b/, /\bcomposer\b/,
  // Swift / Xcode
  /\bswift\s+(build|test|run)\b/,
  /\bxcodebuild\b/,
];

function isProductive(cmd: string): boolean {
  return PRODUCTIVE_PATTERNS.some(re => re.test(cmd));
}

function detectTech(cmd: string): string | undefined {
  if (/\bcargo\b/.test(cmd)) return "rust";
  if (/\bgo\s/.test(cmd)) return "go";
  if (/\bpython|pytest|uvicorn|flask|django\b/.test(cmd)) return "python";
  if (/\bnpm|pnpm|yarn|bun\b/.test(cmd)) return "node";
  if (/\bdocker\b/.test(cmd)) return "docker";
  if (/\bcmake|make\b/.test(cmd)) return "c/cpp";
  if (/\bdotnet\b/.test(cmd)) return "dotnet";
  if (/\bmvn|gradle\b/.test(cmd)) return "java";
  if (/\brspec|rails|ruby\b/.test(cmd)) return "ruby";
  if (/\bswift|xcodebuild\b/.test(cmd)) return "swift";
  if (/\bgit\b/.test(cmd)) return "git";
  return undefined;
}

function workspaceName(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.name;
}

export class FlameTracker {
  private disposables: vscode.Disposable[] = [];
  private successCallbacks: Array<(e: SuccessEvent) => void> = [];

  constructor(private readonly storage: FlameStorage) {}

  activate(): void {
    if ("onDidEndTerminalShellExecution" in vscode.window) {
      const h = (vscode.window as any).onDidEndTerminalShellExecution((e: any) => {
        try { this.handle(e); } catch (err) {
          console.error("[FlameTrack] shell handler error:", err);
        }
      });
      this.disposables.push(h);
    } else {
      // VS Code < 1.93 — show one-time notice
      vscode.window.showInformationMessage(
        "FlameTrack: Upgrade to VS Code 1.93+ for automatic tracking. Use ✋ Mark Today for now."
      );
    }
  }

  onSuccess(cb: (e: SuccessEvent) => void): void {
    this.successCallbacks.push(cb);
  }

  markTodayManual(): void {
    const event: SuccessEvent = {
      ts: Date.now(), label: "Manual check-in",
      kind: "manual", workspace: workspaceName(),
    };
    const isFirst = this.storage.recordSuccess(event);
    this.successCallbacks.forEach(cb => cb(event));
    const streak = this.storage.getData().currentStreak;
    vscode.window.showInformationMessage(
      isFirst
        ? `✋ Day marked! Streak: ${streak} 🔥`
        : `Today already logged. Streak: ${streak} 🔥`
    );
  }

  dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }

  private handle(e: { exitCode: number | undefined; execution: { commandLine: { value: string } } }): void {
    if (e.exitCode !== 0) return;
    const cmd = e.execution?.commandLine?.value ?? "";
    if (!isProductive(cmd)) return;

    const event: SuccessEvent = {
      ts: Date.now(),
      label: cmd.trim().slice(0, 120),
      kind: /\bgit\s+push\b/.test(cmd) ? "git" : "terminal",
      workspace: workspaceName(),
      tech: detectTech(cmd),
    };

    const isFirst = this.storage.recordSuccess(event);
    this.successCallbacks.forEach(cb => cb(event));

    if (isFirst) {
      const streak = this.storage.getData().currentStreak;
      const msg = streak >= 30 ? `🔥 ${streak} days — absolute legend!`
        : streak >= 14 ? `🔥 ${streak}-day streak! On fire!`
        : streak >= 7  ? `🔥 Week streak! Keep going!`
        : streak >= 3  ? `🔥 ${streak} days in a row!`
        : `🔥 Day logged! Streak: ${streak}`;
      vscode.window.showInformationMessage(msg);
    }
  }
}