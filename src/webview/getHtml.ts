export function getWebviewHtml(): string { return HTML; }

const HTML = /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none';style-src 'unsafe-inline';script-src 'unsafe-inline';">
<title>FlameTrack</title>
<style>
/* ── Tokens ── */
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

/* ── Scrollbar ── */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* ── Layout ── */
.shell{display:grid;grid-template-rows:auto auto 1fr;min-height:100vh}

/* ── Top bar ── */
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

/* ── Nav tabs ── */
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

/* ── Page content ── */
.page{display:none;padding:24px}
.page.active{display:block}

/* ── Hero numbers ── */
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

/* ── Heatmap ── */
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

/* ── Hourly heatmap ── */
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

/* ── Section shared ── */
.sec-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
@media(max-width:600px){.sec-row{grid-template-columns:1fr}}
.sec{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px}
.sec-title{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.1px;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:6px}

/* ── Bar chart ── */
.bars{display:flex;align-items:flex-end;gap:3px;height:70px;margin-top:4px}
.b-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0}
.b-bar{width:100%;border-radius:3px 3px 0 0;min-height:2px;transition:height .7s cubic-bezier(.34,1.4,.64,1);cursor:default}
.b-bar.add-bar{background:rgba(34,217,122,.6)}
.b-bar.add-bar:hover{background:var(--green)}
.b-bar.today-bar{background:var(--f1)!important}
.b-lbl{font-size:8px;color:var(--dim);font-family:var(--mono);line-height:1;text-align:center}
.b-lbl.today-lbl{color:var(--f2);font-weight:700}

/* ── Lang chart ── */
.lang-list{display:flex;flex-direction:column;gap:8px}
.lang-row{display:flex;align-items:center;gap:8px}
.lang-name{font-family:var(--mono);font-size:11px;color:var(--text);width:70px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lang-bar-wrap{flex:1;height:6px;background:var(--dim);border-radius:3px;overflow:hidden}
.lang-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--f1),var(--f3));transition:width .8s cubic-bezier(.34,1.2,.64,1)}
.lang-stat{font-family:var(--mono);font-size:10px;color:var(--muted);text-align:right;width:56px;flex-shrink:0}

/* ── Activity feed ── */
.feed{display:flex;flex-direction:column;gap:0}
.feed-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
.feed-item:last-child{border-bottom:none}
.feed-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;background:var(--card2);border:1px solid var(--border2)}
.feed-main{flex:1;min-width:0}
.feed-cmd{font-family:var(--mono);font-size:11px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.feed-meta{font-size:10px;color:var(--muted);margin-top:2px;display:flex;gap:8px}
.feed-time{font-size:10px;color:var(--dim);font-family:var(--mono);flex-shrink:0;padding-top:1px}
.feed-empty{color:var(--muted);text-align:center;padding:32px 0;font-size:13px}

/* ── Stats page ── */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
.stat-box{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px}
.stat-box .v{font-size:26px;font-weight:700;font-family:var(--mono);color:var(--text)}
.stat-box .n{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-top:3px}

/* ── Level page ── */
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

/* ── Achievements page ── */
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

/* ── Tooltip ── */
.tip{
  position:fixed;background:#1a1a2e;color:var(--text);
  font-size:11px;padding:6px 10px;border-radius:6px;
  pointer-events:none;opacity:0;transition:opacity .12s;
  z-index:200;white-space:nowrap;border:1px solid var(--border2);
  font-family:var(--mono);box-shadow:0 4px 16px rgba(0,0,0,.4);
}

/* ── Action buttons ── */
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

/* ── Confetti ── */
.cel{position:fixed;inset:0;pointer-events:none;z-index:999}
.cp{position:absolute;width:7px;height:7px;border-radius:2px;animation:cfal linear forwards}
@keyframes cfal{from{opacity:1;transform:translateY(0) rotate(0)}to{opacity:0;transform:translateY(100vh) rotate(800deg)}}

/* ── Divider ── */
.sep{height:1px;background:var(--border);margin:16px 0}

/* ── Today strip ── */
.today-strip{
  display:flex;align-items:center;gap:12px;
  margin:0 24px;padding:10px 0;border-bottom:1px solid var(--border);
  flex-wrap:wrap;
}
.ts-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}
.ts-item strong{color:var(--text);font-family:var(--mono)}
.ts-sep{color:var(--dim)}

/* ── Streak compare ── */
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
    <div class="brand-icon">🔥</div>
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
  <div class="ts-item">⏱ Today: <strong id="ts-time">0 min</strong></div>
  <span class="ts-sep">·</span>
  <div class="ts-item">✅ <strong id="ts-add">+0</strong> lines</div>
  <span class="ts-sep">·</span>
  <div class="ts-item">🗑 <strong id="ts-rm">-0</strong> removed</div>
  <span class="ts-sep">·</span>
  <div class="ts-item">💾 <strong id="ts-saves">0</strong> saves</div>
  <span class="ts-sep">·</span>
  <div class="ts-item">📄 <strong id="ts-files">0</strong> files</div>
  <span class="ts-sep">·</span>
  <div class="ts-item">⚡ <strong id="ts-xp">0 XP</strong></div>
</div>

<!-- Nav -->
<div class="nav">
  <div class="tab active" data-tab="overview">Overview</div>
  <div class="tab" data-tab="code">Code</div>
  <div class="tab" data-tab="activity">Activity</div>
  <div class="tab" data-tab="achievements">🏅 Achievements</div>
  <div class="tab" data-tab="levels">⚡ Levels</div>
</div>

<!-- ── PAGE: Overview ── -->
<div class="page active" id="page-overview">

  <div class="hero-grid">
    <div class="hero-card streak">
      <div class="hc-label">🔥 Streak</div>
      <div class="hc-val streak-val" id="hc-streak">0</div>
      <div class="hc-sub">days in a row · best: <span id="hc-best">0</span></div>
      <div class="flame-strip" id="flameStrip"></div>
      <div class="streak-rule" id="streakRule"></div>
    </div>
    <div class="hero-card lines-add">
      <div class="hc-label">✅ Lines Added</div>
      <div class="hc-val add-val" id="hc-add">0</div>
      <div class="hc-sub">all time · today: <span id="hc-add-today">0</span></div>
    </div>
    <div class="hero-card lines-rm">
      <div class="hc-label">🗑 Lines Removed</div>
      <div class="hc-val rm-val" id="hc-rm">0</div>
      <div class="hc-sub">all time · today: <span id="hc-rm-today">0</span></div>
    </div>
    <div class="hero-card time">
      <div class="hc-label">⏱ Active Time</div>
      <div class="hc-val time-val" id="hc-time">0h</div>
      <div class="hc-sub">total · today: <span id="hc-time-today">0m</span></div>
    </div>
  </div>

  <!-- Heatmap 12 months -->
  <div class="heatmap-wrap">
    <div class="sec-title">Activity Heatmap — 12 months</div>
    <div class="heatmap-scroll"><div class="hm-inner" id="heatmapRoot"></div></div>
    <div class="hm-legend" id="hmLegend"></div>
  </div>

  <!-- Hourly heatmap -->
  <div class="hourly-wrap">
    <div class="sec-title">🕐 Hourly Activity — when do you code?</div>
    <div class="hourly-grid" id="hourlyRoot"></div>
    <div class="hourly-labels" id="hourlyLabels"></div>
  </div>

  <!-- 28-day bars + lang breakdown -->
  <div class="sec-row">
    <div class="sec">
      <div class="sec-title">Lines per Day — 4 weeks</div>
      <div class="bars" id="barsRoot"></div>
    </div>
    <div class="sec">
      <div class="sec-title">Top Languages</div>
      <div class="lang-list" id="langRoot"></div>
    </div>
  </div>

</div>

<!-- ── PAGE: Code ── -->
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

<!-- ── PAGE: Activity ── -->
<div class="page" id="page-activity">

  <div class="sec" style="margin-bottom:14px">
    <div class="sec-title">Recent Successful Actions</div>
    <div class="feed" id="feedRoot"></div>
  </div>

  <div class="actions">
    <button class="btn btn-primary" onclick="markToday()">✋ Mark Today</button>
    <button class="btn btn-ghost" onclick="exportMd()">📤 Export Markdown</button>
  </div>

</div>

<!-- ── PAGE: Achievements ── -->
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
    <div class="ach-pill" data-cat="streak">🔥 Streak</div>
    <div class="ach-pill" data-cat="code">📝 Code</div>
    <div class="ach-pill" data-cat="time">⏱ Time</div>
    <div class="ach-pill" data-cat="habit">🌙 Habits</div>
    <div class="ach-pill" data-cat="build">🚀 Build</div>
    <div class="ach-pill" data-cat="special">⭐ Special</div>
  </div>

  <div class="ach-grid" id="achGrid"></div>

</div>

<!-- ── PAGE: Levels ── -->
<div class="page" id="page-levels">

  <div class="level-hero">
    <div class="lh-icon" id="lv-icon">✨</div>
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
// Defaults mirror package.json — overwritten by streakSettings from extension
let STREAK_SETTINGS = { minActiveMinutes: 5, minLinesAdded: 10, weekendFreeze: true };
// Fully-resolved achievement list (name/desc/icon/category/xp/current/target/pct/unlocked)
// computed server-side by achievements.ts — no duplication needed here.
let ACH_PROGRESS = [];

// ── Level table (mirrors xp.ts) ───────────────────────────────────────────────
const LEVELS = [
  [0,     'Spark',           '✨'],
  [100,   'Kindler',         '🪵'],
  [300,   'Flame',           '🔥'],
  [700,   'Inferno',         '🌋'],
  [1500,  'Blaze',           '💥'],
  [3000,  'Code Arsonist',   '🧨'],
  [6000,  'Senior Burner',   '⚡'],
  [12000, 'Legendary Coder', '🏆'],
  [25000, 'Mythic Dev',      '💎'],
  [50000, 'Eternal Flame',   '☀️'],
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

// ── Streak capture helpers (mirrors storage.ts) ─────────────────────────────

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
    '✋ manual check-in',
    \`\\u2265\${s.minActiveMinutes} min active\`,
    \`\\u2265\${s.minLinesAdded} lines added\`,
  ];
  let txt = 'A day counts if: ' + parts.join(' · ');
  if (s.weekendFreeze) txt += '. Weekends are auto-frozen \\u2744\\ufe0f if you skip them.';
  return txt;
}

// ── Messaging ─────────────────────────────────────────────────────────────────
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

// ── Tab switching ─────────────────────────────────────────────────────────────
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

// ── Achievement filter ─────────────────────────────────────────────────────────
document.querySelectorAll('.ach-pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.ach-pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    achFilter = p.dataset.cat;
    if (D) renderAchievements(D);
  });
});

// ── Render all ────────────────────────────────────────────────────────────────
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
  if (ruleEl) ruleEl.innerHTML = '<span class="sr-ico">\u2139\ufe0f</span><span>' + esc(streakRuleText()) + '</span>';

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
    root.innerHTML = '<div class="feed-empty">No builds, tests or deploys logged yet.<br>Run some code to start your streak! 🚀</div>';
    return;
  }
  const icons = { git: '📤', manual: '✋', terminal: '⚡' };
  root.innerHTML = recent.map(ev => {
    const icon = icons[ev.kind] || '⚡';
    const meta = [ev.workspace, ev.tech].filter(Boolean).join(' · ');
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

// ── Achievements render ───────────────────────────────────────────────────────
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

  // Unlocked first, then locked — within each group keep catalogue order
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
        <span>✓ Done</span>
      </div>\` : '';

    return \`<div class="ach-card \${isUnlocked ? 'unlocked' : 'locked'}">
      \${!isUnlocked ? '<div class="ach-lock">🔒</div>' : ''}
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

// ── Levels render ─────────────────────────────────────────────────────────────
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
    set('lv-progress-text', 'MAX LEVEL — you absolute legend');
    set('lv-pct', '∞');
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
    else if (isDone) badge = '<span class="ll-badge done2">✓</span>';

    const next = LEVELS[i + 1];
    const xpNeeded = next ? next[0] : null;

    return \`<div class="\${cls}">
      <div class="ll-num">\${lvNum}</div>
      <div class="ll-icon">\${icon}</div>
      <div class="ll-name">\${esc(title)}</div>
      <div class="ll-xp">\${xpNeeded ? fmt(xpReq) + ' – ' + fmt(xpNeeded - 1) + ' XP' : fmt(xpReq) + '+ XP'}</div>
      \${badge}
    </div>\`;
  }).join('');
}

// ── Heatmap 12 months ─────────────────────────────────────────────────────────
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
        if (frozen) txt += ' \u2744\ufe0f streak protected (weekend)';
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
      legendHtml += '<div class="hm-legend-item"><div class="hm-legend-swatch frozen"></div><span>\u2744\ufe0f Weekend freeze (streak protected)</span></div>';
    }
    legend.innerHTML = legendHtml;
  }
}

// ── Hourly heatmap ────────────────────────────────────────────────────────────
function buildHourlyHeatmap(activity) {
  const root    = document.getElementById('hourlyRoot');
  const lblRoot = document.getElementById('hourlyLabels');
  const tip     = document.getElementById('tip');
  if (!root) return;

  // Aggregate all-time lines per hour (index 0–23)
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

// ── 28-day bars ───────────────────────────────────────────────────────────────
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
      <div class="b-lbl\${isT?' today-lbl':''}">\${isT?'▼':dlabels[d2.getDay()]}</div>
    </div>\`;
  }).join('');
}

// ── All-time bars ─────────────────────────────────────────────────────────────
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

// ── Language chart ────────────────────────────────────────────────────────────
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

// ── Files list ────────────────────────────────────────────────────────────────
function buildFilesList(day) {
  const root = document.getElementById('filesRoot');
  if (!root) return;
  const files = day?.filesEdited ?? [];
  if (!files.length) {
    root.innerHTML = '<div style="color:var(--muted);font-size:12px">No files edited today</div>'; return;
  }
  root.innerHTML = files.slice(0, 12).map(f => \`
    <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:14px">📄</span>
      <span style="font-family:var(--mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(f)}</span>
    </div>
  \`).join('');
}

// ── Actions ───────────────────────────────────────────────────────────────────
function markToday() {
  vscode.postMessage({ type: 'mark_today_manual' });
  celebrate();
  setTimeout(() => vscode.postMessage({ type: 'request_data' }), 200);
}
function exportMd() { vscode.postMessage({ type: 'export_markdown' }); }

// ── Confetti ──────────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
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
</html>`;