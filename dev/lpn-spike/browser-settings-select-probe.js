// ONE PROBE FOR dev/lpn-spike/browser-drive.js: what does changing a Settings select cost in a REAL
// Chrome, and does the select survive its own change? (ROADMAP Task 653.)
//
//   SCRIPT=dev/lpn-spike/browser-settings-select-probe.js \
//     PAGE=http://127.0.0.1:8197/engcalcs/Looped-Network.php \
//     PROJ=dev/water-network-examples/Net3-Novato-CA-World.lwn \
//     flock /tmp/engcalcs-browser.lock node dev/lpn-spike/browser-drive.js
//
// Tom, 2026-09-13: *"the Settings Quality selector is very sluggish and doesn't work (change) once
// it responds. All selectors are the same that way."* Three selects are driven -- Quality, a unit
// select and a colouring select -- each twice, and for each change it prints:
//   sync   the change handler itself (what the hand waits for before the page can paint)
//   busy   every long task in the 3 s after it, summed (the solve and anything it sets off)
//   same   whether the element changed is still the one in the document, and still focused
// plus the self-time leaders of a CPU profile taken around it.
//
// A PROBE: it asserts nothing. Absolute milliseconds are this machine's; the SHAPE travels.

const fs = require('fs');
module.exports = async function ({ send, evaluate, logs, sleep }) {
  const URL_ = process.env.PAGE;
  const PROJ = process.env.PROJ || 'dev/water-network-examples/Net3.lwn';
  await send('Page.navigate', { url: URL_ });
  await sleep(4000);
  await evaluate(`(function(){
    localStorage.setItem('lpn_project_selProbe', ${JSON.stringify(fs.readFileSync(PROJ, 'utf8'))});
    localStorage.removeItem('lpn_index');
    return 'ok';
  })()`);
  await send('Page.navigate', { url: URL_ });
  await sleep(9000);
  await evaluate(`(function(){
    var t = Array.from(document.querySelectorAll('button.lpn-tab-name'))
      .filter(function (e) { return e.textContent.replace('*', '').trim() !== 'Project1'; })[0];
    if (t) { t.click(); }
    return t ? 'switched' : 'no tab';
  })()`);
  await sleep(9000);
  // Open Settings through its own toolbar button, as a person does.
  const opened = await evaluate(`(function(){
    var b = Array.from(document.querySelectorAll('button')).filter(function (x) {
      return (x.getAttribute('aria-label') || x.textContent || '').trim() === 'Settings'; })[0];
    if (b) { b.click(); }
    var box = document.getElementById('lpn_settings_box');
    return (b ? 'button' : 'no button') + ' / box ' + (box ? box.style.display : 'none');
  })()`);
  console.log('  settings: ' + opened);
  await sleep(1500);
  await evaluate(`(function(){
    window.__lt = [];
    try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { window.__lt.push([e.startTime, e.duration]); }); })
      .observe({ type: 'longtask', buffered: false }); } catch (e) {}
    return 'ok';
  })()`);

  const probes = [
    ['Quality', "document.querySelector('#lpn_set_quality_fields select')", ['age', 'none']],
    ['Unit (pressure)', "document.querySelector('select[name=lpn_u_pressure]')", null],
    // Task 653, LEFT half: flow and length join pressure so the unit-select fix is measured on
    // more than one quantity -- flow is a RESULT unit (LPN_RESULT_UNIT), length is a stored-value
    // unit that is never a coordinate (see afterUnitChange()'s comment), so between the three every
    // kind of thing a unit can decide is exercised.
    ['Unit (flow)', "document.querySelector('select[name=lpn_u_flow]')", null],
    ['Unit (length)', "document.querySelector('select[name=lpn_u_length]')", null],
    ['Colour nodes by', "document.getElementById('lpn_set_color_node')", null]
  ];
  // COUNT=1 counts label passes with a conditional breakpoint that never stops (the condition
  // increments a counter and answers false), so the page's code is unchanged. Off by default:
  // an enabled debugger costs time, and the timings are the point of the default run.
  if (process.env.COUNT) {
    const src = fs.readFileSync('js/looped-network.js', 'utf8').split('\n');
    const ln = src.findIndex(l => /^\s*function refreshLabelTextPass\(\) \{/.test(l));
    await send('Debugger.enable');
    const bp = await send('Debugger.setBreakpointByUrl', { urlRegex: 'looped-network\\.js', lineNumber: ln + 1,
      condition: '(window.__lp = (window.__lp || 0) + 1, ' +
        (process.env.STACKS ? '(window.__lps = window.__lps || []).push(Math.round(performance.now() - (window.__t0 || 0)) + "ms " + new Error().stack.split("\\n").slice(2, 16).map(function (l) { return l.trim().split(" ")[1]; }).join(" < ")), ' : '') + 'false)' });
    console.log('  counting label passes at line ' + (ln + 2) + ': ' + (bp.result && bp.result.locations ? bp.result.locations.length : 'n/a') + ' location(s)');
    // And every rebuild of the Settings box: a rebuild AFTER the change is one that lands under
    // whatever the hand does next, which is the "doesn't work once it responds" half.
    const rb = src.findIndex(l => /^\s*function rebuildSettingsFields\(\) \{/.test(l));
    await send('Debugger.setBreakpointByUrl', { urlRegex: 'looped-network\\.js', lineNumber: rb + 1,
      condition: '(window.__rb = (window.__rb || 0) + 1, (window.__rbs = window.__rbs || []).push(' +
        'String(window.event && window.event.type) + ":" + new Error().stack.split("\\n").slice(3, 6).map(function (l) { return l.trim().split(" ")[1]; }).join(" < ")), false)' });
  }
  await send('Profiler.enable');
  await send('Profiler.setSamplingInterval', { interval: 200 });
  for (const [name, find, vals] of probes) {
    for (let round = 0; round < 2; round++) {
      await send('Profiler.start');
      const r = await evaluate(`(function(){
        var s = ${find};
        if (!s) { return JSON.stringify({ err: 'no select' }); }
        var vals = ${JSON.stringify(vals)}, v;
        if (vals) { v = vals[${round}]; }
        else {
          var opts = Array.from(s.options).filter(function (o) { return !o.disabled; }).map(function (o) { return o.value; });
          v = opts[(opts.indexOf(s.value) + 1) % opts.length];
          if (${JSON.stringify(name)} === 'Colour nodes by' && ${round} === 1) { v = ''; }
        }
        s.focus();
        window.__sel = s; window.__t0 = performance.now(); window.__lt = []; window.__lp = 0; window.__rb = 0; window.__rbs = [];
        s.value = v;
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('change', { bubbles: true }));
        var t1 = performance.now(), dialogged = false;
        // A UNIT SELECT SERVING A FIELD THIS PROJECT HAS VALUES IN opens the Non-destructive /
        // Destructive question (onUnitChange()) instead of acting at once -- the select is put
        // BACK to its old value until it is answered, so the real cost this probe wants is not in
        // the dispatch above but in the button click below. Non-destructive (the first button, and
        // the suite's standing default) is what a hand reaches for, so that is what is timed.
        var dlg = document.getElementById('lpn_dialog');
        if (dlg && dlg.style.display !== 'none') {
          dialogged = true;
          var btn = document.querySelector('#lpn_dialog_buttons button');
          window.__t0 = performance.now();
          if (btn) { btn.click(); }
          t1 = performance.now();
        }
        return JSON.stringify({ to: v, dialogged: dialogged, sync: Math.round(t1 - window.__t0), passesSync: window.__lp || 0 });
      })()`);
      await sleep(3000);
      const prof = await send('Profiler.stop');
      const after = await evaluate(`(function(){
        var s = window.__sel, busy = 0, last = 0;
        window.__lt.forEach(function (e) { if (e[0] + e[1] > window.__t0) { busy += e[1]; last = Math.max(last, e[0] + e[1] - window.__t0); } });
        return JSON.stringify({ busy: Math.round(busy), settled: Math.round(last),
          passes: window.__lp || 0, stacks: (window.__lps || []).splice(0), rebuilds: window.__rbs || [], same: document.contains(s), focused: document.activeElement === s, value: s.value });
      })()`);
      let top = '';
      try {
        const nodes = prof.result.profile.nodes, byId = new Map(nodes.map(n => [n.id, n]));
        const self = new Map(), dt = prof.result.profile.timeDeltas, samples = prof.result.profile.samples;
        for (let k = 0; k < samples.length; k++) {
          const n = byId.get(samples[k]);
          if (!n) continue;
          const f = n.callFrame.functionName || '(anonymous)';
          if (f === '(idle)' || f === '(program)') continue;
          self.set(f, (self.get(f) || 0) + (dt[k] || 0) / 1000);
        }
        top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([k, v]) => k + ' ' + v.toFixed(0) + 'ms').join('; ');
      } catch (e) { top = 'no profile'; }
      console.log('  ' + name.padEnd(16) + ' ' + r + ' ' + after + '\n      ' + top);
    }
  }
  const errs = logs.filter(l => l.indexOf('EXCEPTION') === 0);
  if (errs.length) { console.log('  EXCEPTIONS: ' + errs.slice(0, 3).join(' | ')); }
};
