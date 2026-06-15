# Changelog

## [0.1.0] — Initial Release

### Added
- Streak tracking via shell execution events (`onDidEndTerminalShellExecution`)
- Automatic detection of productive commands: npm, cargo, go, pytest, docker, git push, and more
- Status bar flame display with streak count
- Stats webview with:
  - Current and best streak
  - GitHub-style activity heatmap (12 months)
  - 28-day bar chart
  - Recent activity feed
- Manual "Mark Today" button and command
- Markdown export of all stats
- `Ctrl+Alt+F` keyboard shortcut to open stats
- All data stored locally — nothing sent to the internet
