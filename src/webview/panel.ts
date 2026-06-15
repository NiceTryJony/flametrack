/**
 * FlameTrack — Webview Panel controller.
 */

import * as vscode from "vscode";
import { getWebviewHtml } from "./getHtml";
import type { FlameStorage } from "../storage";
import type { WebviewMessage } from "../types";
import { getAchievementProgressList } from "../achievements";

export class FlamePanel {
  private static current: FlamePanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];

  static show(
    context: vscode.ExtensionContext,
    storage: FlameStorage,
    onMarkManual: () => void
  ): void {
    if (FlamePanel.current) {
      FlamePanel.current.panel.reveal(vscode.ViewColumn.One);
      FlamePanel.current.sendData(storage);
      return;
    }
    new FlamePanel(context, storage, onMarkManual);
  }

  static refresh(storage: FlameStorage): void {
    FlamePanel.current?.sendData(storage);
  }

  /** Tell the webview to switch to a specific tab */
  static sendTabSwitch(tab: string): void {
    FlamePanel.current?.panel.webview.postMessage({ type: "switch_tab", tab });
  }

  private constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly storage: FlameStorage,
    private readonly onMarkManual: () => void
  ) {
    this.panel = vscode.window.createWebviewPanel(
      "flametrack.stats",
      "🔥 FlameTrack",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.panel.webview.html = getWebviewHtml();
    this.sendData(storage);

    this.panel.webview.onDidReceiveMessage(
      (msg: WebviewMessage) => {
        switch (msg.type) {
          case "request_data":
            this.sendData(storage);
            break;
          case "mark_today_manual":
            onMarkManual();
            setTimeout(() => this.sendData(storage), 100);
            break;
          case "export_markdown": {
            const md = storage.exportMarkdown();
            vscode.workspace
              .openTextDocument({ content: md, language: "markdown" })
              .then((doc) => vscode.window.showTextDocument(doc));
            break;
          }
        }
      },
      null,
      this.disposables
    );

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    FlamePanel.current = this;
  }

  

  private sendData(storage: FlameStorage): void {
    const data = storage.getData();
    this.panel.webview.postMessage({
      type: "data",
      payload: storage.getData(),
      streakSettings: storage.getStreakSettings(),
      achievementProgress: getAchievementProgressList(data),
    });
  }

  private dispose(): void {
    FlamePanel.current = undefined;
    this.panel.dispose();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}