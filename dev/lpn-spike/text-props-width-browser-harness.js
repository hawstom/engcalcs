// **A TEXT'S PROPERTIES: THE WORDS FILL THE BOX, THE SIZE MULTIPLIER IS SHORT** (R-394; Tom,
// 2026-10-15: *"The Properties text editor box is initially too narrow, and it won't drag wider. It
// drags taller (more rows). And I think it should always adjust for its width to fill the properties
// box width."* and *"The Text Properties Size multiplier, on the other hand, is 5 times longer than it
// ever needs to be."*). In real Chromium:
//   1. the words box opens as wide as the Properties box's fields;
//   2. dragging the Properties box wider (an inline width, which is what the corner drag writes)
//      widens the words box with it, and narrower again narrows it;
//   3. the words box drags taller only;
//   4. the Size multiplier box is short: under a third of the Description box beside it, and
//      under 80 px;
//   5. on a phone (412 px, touch), Properties opened by a tap on the Text: the words box fills the
//      box there too, and the Size box is still short.
//
//   node dev/lpn-spike/text-props-width-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TEXTPROPSWIDTH_LOCKED';
const NAME = 'text-props-width-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(800);
		await a.newProject('us');
		await a.dismissGallery();
		await a.settle(600);
		await a.toolbarClick(await a.lang('lpn_tool_add_text'));
		await a.settle(300);
		const spot = await P.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x + b.width * 0.4, y: b.y + b.height * 0.4 }; });
		await P.mouse.click(spot.x, spot.y);
		await a.settle(300);
		await P.keyboard.type('Pump station');
		await P.keyboard.press('Control+Enter');
		await a.settle(300);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(150);
		await P.keyboard.press('0');
		await a.settle(200);
		await P.mouse.click(spot.x, spot.y);
		await a.settle(700);
		const DESC = await a.lang('lpn_field_desc'), SIZE = await a.lang('lpn_field_text_size');
		const m = () => P.evaluate(([d, z]) => {
			const f = document.getElementById('lpn_popup_fields'), ta = f.querySelector('textarea');
			const cs = getComputedStyle(f), inner = f.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
			const byLabel = (t) => Array.from(f.querySelectorAll('label')).filter((l) => l.textContent.trim().indexOf(t) === 0).map((l) => l.querySelector('input'))[0];
			const di = byLabel(d), si = byLabel(z);
			return { open: !!ta && document.getElementById('lpn_popup').style.display !== 'none', inner: Math.round(inner),
				ta: ta ? Math.round(ta.getBoundingClientRect().width) : null, resize: ta ? getComputedStyle(ta).resize : null,
				desc: di ? Math.round(di.getBoundingClientRect().width) : null, size: si ? Math.round(si.getBoundingClientRect().width) : null };
		}, [DESC, SIZE]);
		let r = await m();
		ok('Properties is open on the Text', r.open, JSON.stringify(r));
		ok('1. the words box is as wide as the fields', r.ta !== null && Math.abs(r.ta - r.inner) <= 2, JSON.stringify(r));
		await P.evaluate(() => { document.getElementById('lpn_popup').style.width = '640px'; });
		await a.settle(300);
		const wide = await m();
		ok('2. dragged wider, the words box follows', wide.ta > r.ta + 200 && Math.abs(wide.ta - wide.inner) <= 2, JSON.stringify(wide));
		await P.evaluate(() => { document.getElementById('lpn_popup').style.width = '420px'; });
		await a.settle(300);
		const mid = await m();
		ok('...and narrower again, it follows back', mid.ta < wide.ta && Math.abs(mid.ta - mid.inner) <= 2, JSON.stringify(mid));
		ok('3. the words box drags taller only', r.resize === 'vertical', r.resize);
		ok('4. the Size multiplier box is short, under a third of the Description box and under 80 px',
			r.size > 0 && r.size * 3 < r.desc && r.size >= 40 && r.size < 80, JSON.stringify(r));
		ok('no page error', a.errors.length === 0, a.errors.join(' | '));
		await a.close();

		console.log('\n5. On a phone');
		const ph = await Session.open(browser, NAME + '-phone', { viewport: { width: 1200, height: 800 }, hasTouch: true, isMobile: true });
		const Q = ph.page;
		await Q.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await ph.goto('Looped-Network.php');
		await ph.answerTrainingPanel().catch(() => {});
		await Q.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await ph.settle(800);
		await ph.newProject('us');
		await ph.dismissGallery();
		await ph.settle(600);
		// Placed while the window is wide enough to show the Text tool, then narrowed to a phone.
		await ph.toolbarClick(await ph.lang('lpn_tool_add_text'));
		await ph.settle(300);
		const ps = await Q.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x + b.width * 0.5, y: b.y + b.height * 0.3 }; });
		await Q.touchscreen.tap(ps.x, ps.y);
		await ph.settle(300);
		await Q.keyboard.type('Pump station');
		await Q.keyboard.press('Control+Enter');
		await ph.settle(300);
		await Q.keyboard.press('Escape'); await Q.keyboard.press('Escape'); await ph.settle(150);
		await Q.keyboard.press('0');
		await Q.setViewportSize({ width: 412, height: 800 });
		await ph.settle(1000);
		const tc = await Q.evaluate(() => { const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl]'); const b = t.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
		await Q.touchscreen.tap(tc.x, tc.y);
		await ph.settle(900);
		const pm = () => Q.evaluate(([d, z]) => {
			const f = document.getElementById('lpn_popup_fields'), ta = f.querySelector('textarea');
			const cs = getComputedStyle(f), inner = f.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
			const byLabel = (t) => Array.from(f.querySelectorAll('label')).filter((l) => l.textContent.trim().indexOf(t) === 0).map((l) => l.querySelector('input'))[0];
			const si = byLabel(z);
			return { open: !!ta && document.getElementById('lpn_popup').style.display !== 'none', inner: Math.round(inner),
				box: Math.round(document.getElementById('lpn_popup').getBoundingClientRect().width),
				ta: ta ? Math.round(ta.getBoundingClientRect().width) : null, size: si ? Math.round(si.getBoundingClientRect().width) : null };
		}, [DESC, SIZE]);
		const p1 = await pm();
		ok('Properties is open on the Text on the phone', p1.open, JSON.stringify(p1));
		ok('...the words box is as wide as the fields there', p1.ta !== null && Math.abs(p1.ta - p1.inner) <= 2, JSON.stringify(p1));
		ok('...and the Size box is short (under 80 px)', p1.size > 0 && p1.size < 80, JSON.stringify(p1));
		await Q.evaluate(() => { document.getElementById('lpn_popup').style.width = '380px'; });
		await ph.settle(300);
		const p2 = await pm();
		ok('...dragged wider on the phone, the words box follows', p2.ta > p1.ta + 50 && Math.abs(p2.ta - p2.inner) <= 2, JSON.stringify(p2));
		ok('no page error on the phone', ph.errors.length === 0, ph.errors.join(' | '));
		await ph.close();
	} catch (e) {
		ok('harness ran to the end', false, e && e.stack);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + checks + ' checks, ' + (failures ? failures + ' FAILED' : 'all passed'));
	process.exit(failures ? 1 : 0);
}
main();
