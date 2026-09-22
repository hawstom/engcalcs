// DRIVE A REAL CHROME FROM HERE, so a browser-only cost can be MEASURED rather than asked for.
//
//   SCRIPT=dev/lpn-spike/browser-switch-probe.js PAGE=http://127.0.0.1:8101/engcalcs/Looped-Network.php?debug=perf \
//     BIG=dev/water-network-examples/Net3-Novato-CA-World.lwn SMALL=dev/water-network-examples/Net1.lwn \
//     node dev/lpn-spike/browser-drive.js
//
// **WHY THIS EXISTS.** Task 672's instrument was built on the finding that THREE HEADLESS
// REPRODUCTIONS OF A SLOWDOWN FAILED: what costs the seconds in a browser -- forced synchronous
// layout, rasterising, style recalculation -- is work node does not do at all, so `lpn-dom-stub.js`
// reports a tenth of the truth and sometimes the opposite of it. Until 2026-09-16 the only way past
// that was to ask Tom to run something and paste the result, which costs a round trip per question
// and cannot be iterated on.
//
// **NO DEPENDENCY.** Node 22+ has a WebSocket client built in, so this speaks the DevTools protocol
// directly: no puppeteer, nothing vendored, nothing in package.json. It launches headless Chrome
// with a throwaway profile, so it touches no real browsing data.
//
// **WHAT IT CANNOT DO, and both were learned the hard way.** (1) It has NO EXTENSIONS and no
// DevTools frontend, and both of those change what a page costs -- switching on the DOM and CSS
// domains here (DEVTOOLS=1 in the probe) made one measurement 2-3x worse, which is what an open
// Elements panel does to the machine you are measuring. (2) It is a different machine from the
// user's: absolute milliseconds do not travel, only SHAPES and RATIOS do. Every conclusion drawn
// from it in this repository was stated as a proportion and then confirmed on his own readout.
//
// The page is driven through its own controls -- a click on the tab button that carries the
// handler, not a synthetic event on the strip around it, which silently does nothing.
// of asked for. Node 24 has a WebSocket client built in, so this needs no dependency.
const { spawn } = require('child_process');
const fs = require('fs');

// The debugging port is settable so two probes can run at once on one machine -- other agents
// share this box, and a second Chrome launched on a port already in use silently attaches to
// the first one's page instead of failing.
const PORT = Number(process.env.CDP_PORT) || 9333;
const URL_ = process.env.PAGE || 'http://hawsedc.local/engcalcs/Looped-Network.php?debug=perf';
const PROFILE = process.env.PROFILE || '/tmp/claude-1000/cdp-profile';

async function get(path) {
  const r = await fetch('http://127.0.0.1:' + PORT + path);
  return r.json();
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--window-size=2560,1400',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE, 'about:blank'
  ], { stdio: 'ignore' });
  let targets = null;
  for (let i = 0; i < 60 && !targets; i++) {
    await sleep(250);
    try { targets = await get('/json/list'); } catch (e) { /* not up yet */ }
  }
  if (!targets) { console.error('chrome did not come up'); process.exit(1); }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const logs = [];
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === 'Runtime.consoleAPICalled') {
      logs.push(m.params.args.map(a => (a.value !== undefined ? a.value : a.description)).join(' '));
    }
    if (m.method === 'Runtime.exceptionThrown') {
      logs.push('EXCEPTION ' + (m.params.exceptionDetails.exception || {}).description);
    }
  });
  function send(method, params) {
    const mid = ++id;
    return new Promise(res => { pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params })); });
  }
  async function evaluate(expr, awaitPromise) {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: !!awaitPromise });
    if (r.result && r.result.exceptionDetails) { return { error: r.result.exceptionDetails.text }; }
    return r.result && r.result.result ? r.result.result.value : null;
  }
  await send('Runtime.enable');
  await send('Page.enable');
  module.exports = { send, evaluate, logs, sleep, chrome, ws };
  await require(process.env.SCRIPT)({ send, evaluate, logs, sleep });
  ws.close();
  chrome.kill();
})();
