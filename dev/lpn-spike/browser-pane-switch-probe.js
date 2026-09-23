// ONE PROBE FOR dev/lpn-spike/browser-drive.js: how long does switching the BOTTOM PANE to the
// Junctions table cost in a REAL Chrome, and where does that time go?
//
//   SCRIPT=dev/lpn-spike/browser-pane-switch-probe.js \
//     PAGE=http://127.0.0.1:8096/engcalcs/Looped-Network.php \
//     PROJ=dev/water-network-examples/Net3.lwn node dev/lpn-spike/browser-drive.js
//
// Tom, 2026-09-21: *"Switching to Junctions the first time and some subsequent times delayed about
// 3 seconds or more. This is the worst issue I found."* A headless stub cannot answer it -- style,
// layout and raster are work node does not do -- so this takes a real CPU PROFILE around the click
// and prints the self-time leaders, rather than guessing which call is the expensive one.
//
// It is a PROBE: it asserts nothing. Absolute milliseconds are this machine's, not his; the SHAPE
// is what travels.

const fs = require('fs');
module.exports = async function ({ send, evaluate, logs, sleep }) {
  const URL_ = process.env.PAGE;
  const PROJ = process.env.PROJ || 'dev/water-network-examples/Net3.lwn';
  await send('Page.navigate', { url: URL_ });
  await sleep(4000);
  await evaluate(`(function(){
    localStorage.setItem('lpn_project_paneProbe', ${JSON.stringify(fs.readFileSync(PROJ, 'utf8'))});
    localStorage.removeItem('lpn_index');
    try { localStorage.setItem('lpn_pane', JSON.stringify({open:true, tab:'profile', h:260})); } catch (e) {}
    return 'ok';
  })()`);
  await send('Page.navigate', { url: URL_ });
  await sleep(9000);

  // **THE ADOPTED PROJECT IS A SECOND TAB, NOT THE CURRENT ONE.** adoptOrphans() takes the key in,
  // and the page stays on whatever it was showing; a probe that skips this measures an EMPTY table
  // and reports three milliseconds, which is exactly the wrong answer to the question asked.
  await evaluate(`(function(){
    var t = Array.from(document.querySelectorAll('button.lpn-tab-name'))
      .filter(function (e) { return e.textContent.replace('*', '').trim() !== 'Project1'; })[0];
    if (t) { t.click(); }
    return t ? 'switched' : 'no tab';
  })()`);
  await sleep(9000);
  const counts = await evaluate(`(function(){
    var d = EngCalcs.lpnDoc ? EngCalcs.lpnDoc() : null;
    return document.querySelectorAll('#lpn_canvas circle, #lpn_canvas rect').length + ' shapes';
  })()`);
  console.log('  drawn: ' + counts);

  async function clickTab(id) {
    return evaluate(`(function(){
      var b = document.getElementById('lpn_pane_tab_' + ${JSON.stringify(id)});
      if (!b) { return 'no tab'; }
      var t0 = performance.now(); b.click(); var t1 = performance.now();
      var host = document.getElementById('lpn_pane_' + ${JSON.stringify(id)});
      var rows = host ? host.querySelectorAll('tbody tr').length : -1;
      return JSON.stringify({ ms: Math.round((t1 - t0) * 10) / 10, rows: rows });
    })()`);
  }
  // A forced reflow AFTER the click is what a person actually waits for: the click itself can
  // return before style and layout have run. Reading offsetHeight makes that cost land here.
  async function clickTabWithLayout(id) {
    return evaluate(`(function(){
      var b = document.getElementById('lpn_pane_tab_' + ${JSON.stringify(id)});
      if (!b) { return 'no tab'; }
      var t0 = performance.now(); b.click();
      var host = document.getElementById('lpn_pane_' + ${JSON.stringify(id)});
      if (host) { void host.offsetHeight; }
      var t1 = performance.now();
      var rows = host ? host.querySelectorAll('tbody tr').length : -1;
      return JSON.stringify({ ms: Math.round((t1 - t0) * 10) / 10, rows: rows });
    })()`);
  }

  await send('Profiler.enable');
  await send('Profiler.setSamplingInterval', { interval: 100 });

  const order = ['junctions', 'pipes', 'junctions', 'junctions', 'pipes', 'junctions'];
  for (let i = 0; i < order.length; i++) {
    const id = order[i];
    await send('Profiler.start');
    const r = i % 2 === 0 ? await clickTabWithLayout(id) : await clickTab(id);
    const prof = await send('Profiler.stop');
    let top = '';
    try {
      const nodes = prof.result.profile.nodes, byId = new Map(nodes.map(n => [n.id, n]));
      const self = new Map();
      const dt = prof.result.profile.timeDeltas, samples = prof.result.profile.samples;
      for (let k = 0; k < samples.length; k++) {
        const n = byId.get(samples[k]);
        if (!n) continue;
        const f = n.callFrame.functionName || '(anonymous)';
        const key = f + ' @' + (n.callFrame.lineNumber + 1);
        self.set(key, (self.get(key) || 0) + (dt[k] || 0) / 1000);
      }
      top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([k, v]) => k + ' ' + v.toFixed(1) + 'ms').join('; ');
    } catch (e) { top = 'no profile'; }
    console.log('  ' + (i + 1) + '. -> ' + id + '  ' + r + (i % 2 === 0 ? ' [+layout]' : '') + '\n      ' + top);
    await sleep(1200);
  }
  const errs = logs.filter(l => l.indexOf('EXCEPTION') === 0);
  if (errs.length) { console.log('  EXCEPTIONS: ' + errs.slice(0, 3).join(' | ')); }
};
