// TASK 667(b) -- "ASK" DRIVEN THROUGH TWO REAL BROWSERS, because reading could not see this.
//
//   php -S 127.0.0.1:8177 -t <the directory ABOVE this checkout>      # serves /engcalcs/
//   PAGE=http://127.0.0.1:8177/engcalcs/Looped-Network.php node dev/lpn-spike/lock-ask-browser-drive.js
//   SLOW=1 ...                                                       # also waits out the real minute
//
// Tom, 2026-09-18, having tested the shipped feature with a colleague: *"Asking is a nice idea. But
// I don't know how it will work (tunnel?). B asked, but A didn't see anything."*
//
// **THIS IS THE INSTRUMENT THAT REPRODUCED IT.** Task 672's record is that three headless
// reproductions of a different problem failed because reading was substituted for driving, and the
// same trap is here: every PIECE of the Ask round trip had a passing test on the day Tom found it
// dead, because each half was tested against a fake of the other half. So this runs two ISOLATED
// browser contexts in one real Chrome -- separate storage, separate identity tokens, which is what
// two people are -- against the real lpn-lock.php over real HTTP, and clicks the real menus.
//
// **WHAT IS FAKED, AND IT IS ONE THING.** Headless Chrome refuses to show a file picker at all
// (`showSaveFilePicker` throws AbortError even with a user gesture), and a lock is only ever taken
// on a FILE project -- so the picker is replaced with a handle over an in-memory file. Nothing else
// is: the identity, the docId, the broker round trip, the 60 s timer, the visibility listener and
// the banner are the shipped code in a real DOM. Fake the picker and this measures the feature;
// fake anything more and it measures itself.
//
// **WHAT IT MEASURED, on the code as Tom tested it:** B presses Ask, the note lands on the record,
// A reloads, A's boot COLLECTS the note and CLEARS it from the record -- and paints the reconnect
// banner over it, so nothing whatever appears about the ask. The note is destroyed by being
// delivered to a screen that does not show it. That is his sentence, exactly.
//
// The blocking test of the same behaviour is dev/lpn-spike/lock-ask-both-sides-harness.js, which
// needs no browser and no server and runs in check_all.sh. This one exists for the questions that
// one cannot answer: whether the timer really fires, whether the bar really paints, and how many
// seconds a person actually waits.

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..') + '/';
const PORT = Number(process.env.CDP_PORT || 9412);
const PAGE = process.env.PAGE || 'http://127.0.0.1:8177/engcalcs/Looped-Network.php';
const PROFILE = process.env.PROFILE || '/tmp/lpn-ask-drive-profile';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log(' FAIL  ' + name + (extra === undefined ? '' : '   ' + extra));
}

const PRELUDE = `
(function(){
  var store = { name: 'drive.lwn', text: '', openText: null, mtime: Date.now() };
  window.__driveSaved = function(){ return store.text; };
  window.__driveSetOpen = function(t){ store.openText = t; };
  function mk(){
    return {
      kind: 'file', name: store.name,
      getFile: async function(){ var t = (store.openText != null ? store.openText : (store.text||'')); return new File([t], store.name, {type:'application/json', lastModified: store.mtime}); },
      createWritable: async function(){ return { write: async function(d){ store.text = (typeof d === 'string') ? d : (d && d.data !== undefined ? d.data : await new Response(d).text()); store.mtime = Date.now(); store.openText = null; }, close: async function(){} }; },
      queryPermission: async function(){ return 'granted'; },
      requestPermission: async function(){ return 'granted'; },
      isSameEntry: async function(o){ return o === this; }
    };
  }
  window.showSaveFilePicker = async function(){ return mk(); };
  window.showOpenFilePicker = async function(){ return [mk()]; };
  window.__ASKNAME = 'ZZZ';
  window.__ALERTS = [];
  window.prompt = function(){ return window.__ASKNAME; };
  window.alert = function(m){ window.__ALERTS.push(String(m)); };
  window.__driveMenu = function(menuId, label){
    document.getElementById(menuId).dispatchEvent(new MouseEvent('click',{bubbles:true}));
    var hit = null;
    Array.prototype.forEach.call(document.querySelectorAll('#lpn_menu_list *'), function(el){
      if (hit) { return; }
      if ((el.textContent||'').trim() === label) { hit = el; }
    });
    if (!hit) { return 'NOT FOUND: ' + label; }
    hit.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    return 'clicked ' + label;
  };
  window.__driveDialog = function(){
    var d = document.getElementById('lpn_dialog_buttons');
    if (!d) { return '(no dialog)'; }
    return Array.prototype.map.call(d.children, function(c){ return (c.textContent||'').trim(); }).join(' | ');
  };
  window.__driveDialogText = function(){
    var d = document.getElementById('lpn_dialog_body') || document.getElementById('lpn_dialog');
    return d ? (d.textContent||'').trim().slice(0,300) : '(no dialog)';
  };
  window.__drivePress = function(label){
    var d = document.getElementById('lpn_dialog_buttons');
    if (!d) { return '(no dialog)'; }
    var hit = null;
    Array.prototype.forEach.call(d.children, function(c){ if ((c.textContent||'').trim() === label) { hit = c; } });
    if (!hit) { return 'NOT FOUND: ' + label + ' in [' + window.__driveDialog() + ']'; }
    hit.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    return 'pressed ' + label;
  };
  window.__driveBanner = function(){
    var b = document.getElementById('lpn_lock_banner');
    if (!b) { return '(no banner element)'; }
    var vis = b.style.display !== 'none' && b.offsetParent !== null;
    return (vis ? 'VISIBLE: ' : 'hidden: ') + (b.textContent||'').trim();
  };
})();
`;


// ---------------------------------------------------------------------------
// THE SCENARIO. A saves a file and so holds it; B opens the same file, is told
// it is in use, and presses Ask; A has to find out.
// ---------------------------------------------------------------------------
function record(docId) {
	try { return JSON.parse(fs.readFileSync(ROOT + 'lpn-locks/' + docId + '.json', 'utf8')); }
	catch (e) { return null; }
}
async function scenario({ user, sleep }) {
	// A takes the file by SAVING it, which is the only route to a file project and therefore the
	// only route to a lock.
	const A = await user('A');
	await A.go();
	await A.ev("window.__driveMenu('lpn_menu_file','Save as\u2026')", true); await sleep(600);
	await A.ev("window.__drivePress('Continue')", true); await sleep(2500);
	const text = await A.ev('window.__driveSaved()');
	if (!text) { console.log(' FAIL  A could not save; nothing else can be measured'); process.exit(1); }
	const docId = JSON.parse(text).project.docId;
	ok('A holds the file, and the broker has a record of it', (record(docId) || {}).holder);

	// B is a SEPARATE browser context: its own storage, its own identity token.
	const B = await user('B');
	await B.go();
	await B.ev('window.__driveSetOpen(' + JSON.stringify(text) + "); window.__ASKNAME='MEH'; 'ok'");
	await B.ev("window.__driveMenu('lpn_menu_file','Open\u2026')", true); await sleep(700);
	await B.ev("window.__drivePress('Continue')", true); await sleep(2500);
	// **THE EXPECTED TEXT COMES OFF THE PAGE, never typed in here.** A harness that spells an
	// English string out turns a rewording into a red build in a file about hydraulics, and this
	// project treats rewording as free.
	const choices = await B.ev('window.__driveDialog()');
	const wanted = await B.ev("(function(){var p=EngCalcs.pageConfig||{};"
		+ "return [p.lpn_lock_ask, p.lpn_lock_open_readonly, p.lpn_cancel,"
		+ " '\u26a0 ' + p.lpn_lock_break].join(' | ');})()");
	ok('B is asked what to do, in the approved order', choices === wanted, choices + '  wanted ' + wanted);
	await B.ev("window.__drivePress('Ask')", true); await sleep(1500);
	const told = await B.ev("(function(){var n=((document.getElementById('lpn_map_notice')||{}).textContent||'').trim();"
		+ "var want=((EngCalcs.pageConfig||{}).lpn_lock_ask_sent||'').trim();"
		+ "return want !== '' && n === want ? 'yes' : 'no: [' + n + ']';})()");
	ok('B is told the message went', told === 'yes', told);
	ok('...and the note is on the record, addressed to A',
		(record(docId) || {}).requestedBy === 'MEH'
		&& (record(docId) || {}).requestedOf === (record(docId) || {}).holder,
		JSON.stringify(record(docId)));

	// **THE CASE TOM HIT.** A reloads in the gap. Before the fix the boot collected the note,
	// cleared it from the record and painted the reconnect banner over it, so nothing appeared.
	await A.send('Page.navigate', { url: PAGE });
	await sleep(9000);
	let bar = await A.ev('window.__driveBanner()');
	ok('A IS TOLD AT BOOT, HAVING RELOADED BETWEEN THE ASK AND THE ANSWER',
		bar.indexOf('VISIBLE') === 0 && bar.indexOf('MEH') >= 0, bar);
	ok('...and the note is not left on the record to be raised every minute afterwards',
		(record(docId) || {}).requestedBy === '', JSON.stringify(record(docId)));

	// The same thing again with nobody touching A's tab, which is what actually happens and is the
	// only way to measure the promise made to B. A minute of real time, so it is opt-in.
	if (process.env.SLOW) {
		await A.ev("window.__drivePress; document.getElementById('lpn_lock_banner').style.display='none'; 'ok'");
		await B.ev("window.__ASKNAME='JHB'; window.__driveSetOpen(" + JSON.stringify(text) + "); 'ok'");
		await B.ev("window.__driveMenu('lpn_menu_file','Open\u2026')", true); await sleep(700);
		await B.ev("window.__drivePress('Continue')", true); await sleep(2500);
		await B.ev("window.__drivePress('Ask')", true); await sleep(1500);
		const t0 = Date.now();
		let seen = '';
		for (let i = 0; i < 40; i++) {
			await sleep(3000);
			bar = await A.ev('window.__driveBanner()');
			if (bar.indexOf('VISIBLE') === 0 && bar.indexOf('JHB') >= 0) { seen = bar; break; }
		}
		const secs = Math.round((Date.now() - t0) / 1000);
		ok('A IS TOLD WITHIN THE MINUTE THE PAGE PROMISES B, WITHOUT TOUCHING A\'S TAB (' + secs + ' s)',
			!!seen && secs <= 65, seen || 'never, after ' + secs + ' s');
	}

	try { fs.unlinkSync(ROOT + 'lpn-locks/' + docId + '.json'); } catch (e) { /* already swept */ }
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exitCode = fails ? 1 : 0;
}

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const chrome = spawn('google-chrome', ['--headless=new','--disable-gpu','--no-sandbox',
    '--window-size=1600,1000','--remote-debugging-port='+PORT,'--user-data-dir='+PROFILE,'about:blank'],
    { stdio: 'ignore' });
  let info = null;
  for (let i = 0; i < 80 && !info; i++) { await sleep(250);
    try { info = await (await fetch('http://127.0.0.1:'+PORT+'/json/version')).json(); } catch (e) {} }
  if (!info) { console.error('chrome did not come up'); process.exit(1); }

  const bws = new WebSocket(info.webSocketDebuggerUrl);
  await new Promise(r => bws.addEventListener('open', r));
  let bid = 0; const bpend = new Map();
  bws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && bpend.has(m.id)) { bpend.get(m.id)(m); bpend.delete(m.id); } });
  const bsend = (method, params) => new Promise(res => { const id = ++bid; bpend.set(id, res); bws.send(JSON.stringify({ id, method, params })); });

  async function user(label) {
    const ctx = await bsend('Target.createBrowserContext', {});
    const t = await bsend('Target.createTarget', { url: 'about:blank', browserContextId: ctx.result.browserContextId });
    const list = await (await fetch('http://127.0.0.1:'+PORT+'/json/list')).json();
    const page = list.find(p => p.id === t.result.targetId);
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    let id = 0; const pend = new Map(); const logs = [];
    ws.addEventListener('message', ev => { const m = JSON.parse(ev.data);
      if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
      if (m.method === 'Runtime.exceptionThrown') { logs.push('EXCEPTION ' + (m.params.exceptionDetails.exception||{}).description); } });
    const send = (method, params) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Runtime.enable'); await send('Page.enable');
    await send('Page.addScriptToEvaluateOnNewDocument', { source: PRELUDE });
    async function ev(expr, gesture) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: !!gesture });
      if (r.result && r.result.exceptionDetails) { return 'ERR ' + r.result.exceptionDetails.text + ' ' + JSON.stringify((r.result.exceptionDetails.exception||{}).description||''); }
      return r.result && r.result.result ? r.result.result.value : null;
    }
    async function go() { await send('Page.navigate', { url: PAGE }); await sleep(5000); }
    return { label, ev, go, send, logs };
  }
  try { await scenario({ user, sleep }); } finally { chrome.kill(); }
})();
