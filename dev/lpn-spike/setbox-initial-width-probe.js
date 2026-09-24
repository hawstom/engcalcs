// R-204: real-Chromium measurement behind dev/lpn-spike/setbox-initial-width-harness.js. NOT part
// of check_all.sh (no "harness" in the name) -- it spawns a real headless Chrome and a throwaway
// PHP server, which that suite does not do. Run it by hand to re-measure after a further change to
// the Settings box's dimensions:
//
//   php -S 127.0.0.1:8395 -t <the directory ABOVE this checkout>       # serves /engcalcs/
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/setbox-initial-width-probe.js
//   PHONE=1 flock /tmp/engcalcs-browser.lock node dev/lpn-spike/setbox-initial-width-probe.js
//
// WHY A REAL BROWSER AND NOT ARITHMETIC. The Settings box's own comments record that its box model
// "is not addable by hand" -- dev/browser-pass/specs/visibility.js once caught a 3px hand-arithmetic
// error here. This prints the box's, the index's and the content pane's real getBoundingClientRect()
// widths -- at the shipped width, and again with the box squeezed to its own min-width -- which is
// what setbox-initial-width-harness.js's literal expectations were taken from.
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PORT = Number(process.env.CDP_PORT || 9512);
const PAGE = process.env.PAGE || 'http://127.0.0.1:8395/engcalcs/Looped-Network.php';
const PROFILE = '/tmp/setbox-initial-width-probe-profile';

(async () => {
	fs.rmSync(PROFILE, { recursive: true, force: true });
	const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--no-sandbox',
		'--window-size=1600,1000', '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE, 'about:blank'],
		{ stdio: 'ignore' });
	let info = null;
	for (let i = 0; i < 80 && !info; i++) {
		await sleep(250);
		try { info = await (await fetch('http://127.0.0.1:' + PORT + '/json/version')).json(); } catch (e) { /* not up yet */ }
	}
	if (!info) { console.error('chrome did not come up'); process.exit(1); }

	const bws = new WebSocket(info.webSocketDebuggerUrl);
	await new Promise(r => bws.addEventListener('open', r));
	let bid = 0; const bpend = new Map();
	bws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && bpend.has(m.id)) { bpend.get(m.id)(m); bpend.delete(m.id); } });
	const bsend = (method, params) => new Promise(res => { const id = ++bid; bpend.set(id, res); bws.send(JSON.stringify({ id, method, params })); });

	const ctx = await bsend('Target.createBrowserContext', {});
	const t = await bsend('Target.createTarget', { url: 'about:blank', browserContextId: ctx.result.browserContextId });
	const list = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json();
	const page = list.find(p => p.id === t.result.targetId);
	const ws = new WebSocket(page.webSocketDebuggerUrl);
	await new Promise(r => ws.addEventListener('open', r));
	let id = 0; const pend = new Map();
	ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
	const send = (method, params) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
	await send('Runtime.enable'); await send('Page.enable');
	async function ev(expr) {
		const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
		if (r.result && r.result.exceptionDetails) { return 'ERR ' + r.result.exceptionDetails.text; }
		return r.result && r.result.result ? r.result.result.value : null;
	}

	if (process.env.PHONE) {
		await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
	}
	await send('Page.navigate', { url: PAGE });
	await sleep(4000);
	// Open the Settings box the way a reader does -- Project > Settings, a real click on the real
	// menu item, not a synthetic call into the box's own open function.
	const openResult = await ev(`
		(function(){
			document.getElementById('lpn_menu_project').dispatchEvent(new MouseEvent('click', {bubbles:true}));
			var hit = null;
			document.querySelectorAll('#lpn_menu_list *').forEach(function(el){
				if (!hit && (el.textContent||'').trim() === ((EngCalcs.pageConfig||{}).lpn_menu_settings||'Settings')) hit = el;
			});
			if (!hit) { return 'NOT FOUND settings menu item'; }
			hit.dispatchEvent(new MouseEvent('click', {bubbles:true}));
			return 'clicked';
		})()
	`);
	console.log('open:', openResult);
	await sleep(500);
	const geom = await ev(`
		(function(){
			var box = document.getElementById('lpn_settings_box');
			var idx = document.getElementById('lpn_setbox_index');
			var content = document.getElementById('lpn_setbox_content');
			var cs = getComputedStyle(box);
			function r(el){ var b = el.getBoundingClientRect(); return { w: b.width, h: b.height }; }
			return JSON.stringify({
				box: r(box), idx: r(idx), content: r(content),
				boxMinWidth: cs.minWidth, idxFlexBasis: getComputedStyle(idx).flexBasis
			});
		})()
	`);
	console.log('geometry at initial width:', geom);

	const geomMin = await ev(`
		(function(){
			var box = document.getElementById('lpn_settings_box');
			box.style.width = box.style.minWidth || getComputedStyle(box).minWidth;
			var idx = document.getElementById('lpn_setbox_index');
			var content = document.getElementById('lpn_setbox_content');
			function r(el){ var b = el.getBoundingClientRect(); return { w: b.width, h: b.height }; }
			return JSON.stringify({ box: r(box), idx: r(idx), content: r(content) });
		})()
	`);
	console.log('geometry at box min-width:', geomMin);

	chrome.kill();
})().catch(e => { console.error(e); process.exit(1); });
