/**
 * FlameTrack — Code Tracker.
 * Tracks lines added/removed, saves, and active editing time.
 * Pure event-driven — no polling, minimal memory footprint.
 */
import * as vscode from "vscode";
import * as path from "path";
import type { FlameStorage } from "./storage";

const IDLE_MS = 2 * 60 * 1000;  // 2 min gap = idle, don't count
const BATCH_MS = 1000;           // batch rapid keystrokes before writing

export class CodeTracker {
  private disposables: vscode.Disposable[] = [];
  private flushCallbacks: Array<() => void> = [];

  // Batch accumulator
  private pending = { added: 0, removed: 0, chars: 0, lang: "", file: "", ws: "" };
  private batchTimer: ReturnType<typeof setTimeout> | null = null;

  // Active time tracking
  private lastEditTs = 0;
  private pendingMinutes = 0; // fractional minutes not yet flushed

  constructor(private readonly storage: FlameStorage) {}

  /** Register a callback fired after each batch flush to storage */
  onFlush(cb: () => void): void { this.flushCallbacks.push(cb); }

  activate(): void {
    // ── Lines added / removed ──────────────────────────────────────────────
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(e => {
        if (e.contentChanges.length === 0) return;
        if (e.document.uri.scheme !== "file") return;
        // Skip undo/redo — they're not "new" code
        if (e.reason === vscode.TextDocumentChangeReason.Undo ||
            e.reason === vscode.TextDocumentChangeReason.Redo) return;

        let added = 0, removed = 0, chars = 0;
        for (const ch of e.contentChanges) {
          added   += ch.text.split("\n").length - 1;
          removed += ch.range.end.line - ch.range.start.line;
          chars   += ch.text.length;
        }

        // Active-time: count gap since last edit only if < IDLE_MS
        const now = Date.now();
        if (this.lastEditTs > 0) {
          const gap = now - this.lastEditTs;
          if (gap < IDLE_MS) this.pendingMinutes += gap / 60_000;
        }
        this.lastEditTs = now;

        const p = this.pending;
        p.added   += added;
        p.removed += removed;
        p.chars   += chars;
        p.lang     = e.document.languageId;
        p.file     = e.document.fileName;
        p.ws       = workspaceName(e.document.uri);

        this.scheduleBatch();
      })
    );

    // ── File saves ─────────────────────────────────────────────────────────
    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.uri.scheme !== "file") return;
        this.storage.recordSave();
        // no flush callback here — save events are frequent, status bar
        // will pick it up on the next batch flush
      })
    );
  }

  private scheduleBatch(): void {
    if (this.batchTimer) return;
    this.batchTimer = setTimeout(() => {
      this.batchTimer = null;
      this.flushBatch();
    }, BATCH_MS);
  }

  private flushBatch(): void {
    const p = this.pending;
    if (p.added === 0 && p.removed === 0 && p.chars === 0) return;

    // Only pass whole minutes to storage (keep fractional remainder)
    const wholeMinutes = Math.floor(this.pendingMinutes);
    this.pendingMinutes -= wholeMinutes;

    this.storage.recordEdit({
      linesAdded:        p.added,
      linesRemoved:      p.removed,
      chars:             p.chars,
      lang:              p.lang || "plaintext",
      fileName:          path.basename(p.file),
      workspace:         p.ws || "unknown",
      activeMinutesDelta: wholeMinutes,
    });

    // Reset accumulator
    this.pending = { added: 0, removed: 0, chars: 0, lang: "", file: "", ws: "" };

    this.flushCallbacks.forEach(cb => cb());
  }

  dispose(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
      this.flushBatch(); // flush any remaining before dispose
    }
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
  }
}

function workspaceName(uri: vscode.Uri): string {
  return vscode.workspace.getWorkspaceFolder(uri)?.name
    ?? vscode.workspace.workspaceFolders?.[0]?.name
    ?? "unknown";
}