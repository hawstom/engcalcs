// A PRESSURE TANK'S INPUTS ARE THE WELL'S, in a real Chrome. Run with:
//   node dev/lpn-spike/well-pressure-tank-lock-browser-harness.js
//
// Task 822, round 12 (Tom, round 11 pass: the tank's properties can be edited). Opens well-pressure-tank-fixture.lwn (written by
// `well-tank-three-point-harness.js --write-fixture`), selects the tank on the map and asserts: the seven owned rows (initial, minimum and
// maximum depth, volume curve, diameter, minimum volume, can overflow) are not form controls and typing over them changes nothing; the
// sentence "Associated with Well W1. Change volume and control properties there." shows once; Elevation is the tank's own, typeable, with the DEM row beside it (round 15), while Base elevation is read-only; the tank's label is drawn beside its vessel while the Well is joined;
// Explode gives the tank its inputs back (`well-tank-three-point-harness.js` holds the Tables and Find and replace halves).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PT_LOCK_BROWSER_LOCKED';
const NAME = 'well-pressure-tank-lock-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const PICS = process.env.EC_PICS || null;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	// The Well's Total tank volume is 1000 here, the number Tom asked about after Explode: nothing on the exploded tank's box may carry it.
	const fixture = (() => { const f = JSON.parse(require('fs').readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'well-pressure-tank-fixture.lwn'), 'utf8')); f.assemblies.forEach((g) => { if (g.pt) { g.pt.vol = 1000; } }); f.project = Object.assign({}, f.project, { basemap: 'osm', crs: 'EPSG:2234' }); return JSON.stringify(f); })();
	const OWNED = ['Initial depth', 'Minimum depth', 'Maximum depth', 'Tank volume'];
	const ABSENT = ['Tank diameter', 'Minimum volume', 'Can overflow'];
	const SENTENCE = 'Associated with Well W1. Change volume and control properties there.';
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 1000 }, serviceWorkers: 'block' });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, fixture);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		const centreOf = (id) => P.evaluate((i) => {
			const el = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"], #lpn_canvas [data-link="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, id);
		const rows = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => ({
			t: l.textContent.replace(/\s+/g, ' ').trim(), controls: l.querySelectorAll('input, select, textarea, [contenteditable="true"]').length })));
		const tankId = await P.evaluate(() => { const n = Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map((e) => e.getAttribute('data-node')); return n.indexOf('T1') >= 0 ? 'T1' : null; });
		ok('the fixture has its tank T1 on the map and its Well holds a pressure tank (`pt`); regenerate it with `well-tank-three-point-harness.js --write-fixture` if not', tankId === 'T1' && (JSON.parse(fixture).assemblies || []).some((g) => g.pt && g.tank === 'T1'));
		await P.keyboard.press('Escape');
		const c = await centreOf('T1');
		await P.mouse.click(c.x, c.y);
		await a.settle(900);
		let rs = await rows();
		const find = (name) => rs.filter((r) => r.t.indexOf(name) === 0)[0];
		ok('the box is the tank\'s own (Base elevation row present)', !!find('Base elevation'), rs.map((r) => r.t).join(' | '));
		ok('diameter, minimum volume and overflow have no row on a pressure tank', ABSENT.every((o) => !find(o)), rs.map((r) => r.t).join(' | '));
		ok('the four owned rows are listed and none holds a control', OWNED.every((o) => find(o) && find(o).controls === 0), OWNED.map((o) => o + ':' + (find(o) ? find(o).controls : 'missing')).join(' '));
		const geo = await P.evaluate(() => {
			const n = document.querySelector('#lpn_popup_fields .lpn-owned-note'), f = document.getElementById('lpn_popup_fields');
			if (!n) { return null; }
			const r = n.getBoundingClientRect(), fr = f.getBoundingClientRect(), labels = Array.from(f.querySelectorAll('label')), firstTop = Math.min.apply(null, labels.map((l) => l.getBoundingClientRect().top));
			const rng = document.createRange(); rng.selectNodeContents(n); const tr = rng.getBoundingClientRect();
			return { text: n.textContent.trim(), right: tr.right, boxRight: fr.right, left: tr.left, boxLeft: fr.left, top: r.bottom <= firstTop + 1, sw: n.scrollWidth, cw: n.clientWidth };
		});
		ok('the sentence shows once, whole, with its right edge inside the box', !!geo && geo.text === SENTENCE && geo.right <= geo.boxRight + 1 && geo.sw <= geo.cw + 1, JSON.stringify(geo));
		ok('and stands at the top of the box, above every row', !!geo && geo.top, JSON.stringify(geo));
		const order = rs.map((r) => r.t.replace(/ \(.*$/, '').replace(/\s*\?.*$/, ''));
		const at = ['Initial depth', 'Minimum depth', 'Maximum depth', 'Tank volume'].map((n) => order.findIndex((x) => x.indexOf(n) === 0));
		ok('the four locked rows stand together, in one run under the sentence', Math.max.apply(null, at) - Math.min.apply(null, at) === 3, JSON.stringify(at));
		const wellRows = await (async () => { await P.keyboard.press('Escape'); const w0 = await centreOf('W1'); await P.mouse.click(w0.x, w0.y); await a.settle(900); const r0 = await rows(); await P.keyboard.press('Escape'); return r0; })();
		ok('the Well\'s own volume row is "Total tank volume" (m^3 or ft^3), and the Well has no plain "Tank volume" row', wellRows.some((r) => /^Total tank volume/.test(r.t)) && !wellRows.some((r) => /^Tank volume/.test(r.t)), wellRows.map((r) => r.t).join(' | '));
		// The Well's tank volume is typed and shown in the Volume unit, and a Convert keeps the physical volume (fixture: no `vu`, i.e. a file from before, in m and m of head, so 1000 m^3).
		const ptNow = () => P.evaluate(() => { const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId, d = JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null'), g = ((d || {}).assemblies || []).filter((x) => x.pt)[0]; return { pt: g && g.pt, unit: document.getElementById('lpn_u_volume').value, units: d && d.units && d.units.lpn_u_volume }; });
		const volRow = async () => { await P.keyboard.press('Escape'); const w1 = await centreOf('W1'); await P.mouse.click(w1.x, w1.y); await a.settle(900); const r1 = await rows(); const row = r1.filter((r) => /^Total tank volume/.test(r.t))[0]; const v = await P.evaluate(() => { const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => /^Total tank volume/.test(x.textContent.replace(/\s+/g, ' ').trim()))[0], i = l && l.querySelector('input'); return i ? i.value : null; }); await P.keyboard.press('Escape'); return { t: row && row.t, v: v }; };
				let vr = await volRow(); const u0 = (await ptNow()).unit, u0text = await P.evaluate(() => { const s = document.getElementById('lpn_u_volume'); return s.options[s.selectedIndex].textContent.trim(); });
		ok('the Well\'s volume row is labelled in the current Volume unit (' + u0 + ': ' + u0text + ') and reads 1000', !!vr.t && vr.t.indexOf('(' + u0text + ')') >= 0 && +vr.v === 1000, JSON.stringify(vr));
		await P.evaluate(() => { const s = document.getElementById('lpn_u_volume'); s.value = 'l'; s.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(600);
		await P.evaluate(() => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === ((EngCalcs.pageConfig || {}).lpn_convas_ok || 'Convert')); if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); } });
		await a.settle(1500);
		const afterConv = await ptNow(); vr = await volRow();
		const lText = await P.evaluate(() => { const s = document.getElementById('lpn_u_volume'); return s.options[s.selectedIndex].textContent.trim(); });
		ok('Convert to litres: the stored volume is 1,000,000 L (the same 1000 m^3)', afterConv.unit === 'l' && afterConv.pt && Math.abs(afterConv.pt.vol - 1e6) < 1e-3, JSON.stringify(afterConv));
		ok('and the row is now labelled in litres (' + lText + ') and reads 1000000', !!vr.t && vr.t.indexOf('(' + lText + ')') >= 0 && +vr.v === 1e6, JSON.stringify(vr));
		const c1 = await centreOf('T1'); await P.mouse.click(c1.x, c1.y); await a.settle(900); rs = await rows();
		ok('Elevation is the tank\'s own (round 15; Tom: "Their elevation must be independent like their position."): a typeable row on the tank\'s box, and Base elevation is a read-only one', find('Elevation').controls > 0 && find('Base elevation').controls === 0);
		const demRows = await P.evaluate(() => document.querySelectorAll('#lpn_popup_fields .lpn-elev-dem').length);
		ok('and the standard DEM row (Read DEM, Use DEM) is beside it, once', demRows === 1, String(demRows));
		const lbl = await P.evaluate(() => {
			const t = document.querySelector('#lpn_canvas text[data-nodelbl="T1"]'), ves = document.querySelector('#lpn_canvas [data-node="T1"]'), cir = document.querySelector('#lpn_canvas [data-node="W1"]');
			if (!t || !ves || !cir) { return { missing: [!!t, !!ves, !!cir].join() }; }
			const hid = (e) => { for (let x = e; x && x.nodeType === 1; x = x.parentNode) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden' || (x.classList && (x.classList.contains('lpn-asm-hid') || x.classList.contains('lpn-lbl-hidden')))) { return true; } } return false; };
			const rng = document.createRange(); rng.selectNodeContents(t);
			const tr = rng.getBoundingClientRect(), vr = ves.getBoundingClientRect(), cw = cir.getBoundingClientRect(), cr = { left: cw.left, top: cw.top, right: Math.min(cw.right, vr.left), bottom: cw.bottom };   // the Well's grab shape holds the vessel too: its circle is the part left of the vessel
			const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
			const d = Math.hypot(tr.left + tr.width / 2 - (vr.left + vr.width / 2), tr.top + tr.height / 2 - (vr.top + vr.height / 2));
			return { text: t.textContent.replace(/\s+/g, ' ').trim(), hidden: hid(t), onVessel: hit(tr, vr), onCircle: hit(tr, cr), dist: Math.round(d), vw: Math.round(vr.width), r: [tr, vr, cr].map((q) => [q.left, q.top, q.right, q.bottom].map(Math.round).join(',')).join(' | ') };
		});
		ok('the tank\'s label is drawn while the Well is joined (round 15; Tom: "I agree. Proceed."): shown, reading T1, off the vessel and off the Well\'s circle, and beside the vessel', !!lbl && !lbl.missing && /^T1/.test(lbl.text) && !lbl.hidden && !lbl.onVessel && !lbl.onCircle && lbl.dist < 220, JSON.stringify(lbl));
		ok('the Well\'s box holds Base elevation, typeable, in the tank\'s section, and has only its own Elevation (one door for the tank\'s, its own box)', wellRows.filter((r) => /^Elevation/.test(r.t)).length === 1 && wellRows.filter((r) => /^Elevation/.test(r.t)).every((r) => r.controls > 0) && wellRows.some((r) => /^Base elevation/.test(r.t) && r.controls > 0), wellRows.map((r) => r.t + ':' + r.controls).join(' | '));
		const before = rs.map((r) => r.t).join('|');
		for (const o of OWNED) {
			const box = await P.evaluate((name) => { const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(name) === 0)[0]; const sp = l.querySelector('span') || l, r = sp.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, o);
			await P.mouse.dblclick(box.x, box.y);
			await P.keyboard.type('777');
			await P.keyboard.press('Enter');
		}
		await a.settle(500);
		rs = await rows();
		ok('clicking into and typing over each owned row changes nothing', rs.map((r) => r.t).join('|') === before && !rs.some((r) => /777/.test(r.t)));
		console.log('\n--- Explode gives the inputs back ---');
		await P.keyboard.press('Escape');
		const w = await centreOf('W1');
		await P.mouse.click(w.x, w.y);
		await a.settle(900);
		await P.evaluate(() => { const b = document.querySelector('[data-assembly-explode]'); if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await a.settle(700);
		await P.keyboard.press('Escape');
		// The exploded tank stands at its own point, which was off the screen while only its vessel was drawn: Zoom to fit brings it in.
		await P.evaluate(() => { const b = Array.from(document.querySelectorAll('button, [role="button"], [title]')).filter((e) => /zoom to fit/i.test((e.getAttribute('title') || '') + ' ' + (e.getAttribute('aria-label') || '') + ' ' + e.textContent))[0]; if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await a.settle(900);
		const c2 = await centreOf('T1');
		await P.mouse.click(c2.x, c2.y);
		await a.settle(900);
		rs = await rows();
		const boxValues = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => ({ t: l.textContent.replace(/\s+/g, ' ').trim(), v: Array.from(l.querySelectorAll('input, select')).map((i) => i.value).join('/') })));
		ok('after Explode the box shows the tank\'s volume curve as a chooser holding W1TV, and no Minimum volume or Tank diameter row (the tank did not show them before), and nothing carries the Well\'s 1000', boxValues.some((r) => /^Tank volume/.test(r.t) && r.v === 'W1TV') && !boxValues.some((r) => /^Minimum volume|^Tank diameter/.test(r.t)) && !boxValues.some((r) => r.v === '1000' || /\b1000\b/.test(r.t)), JSON.stringify(boxValues.filter((r) => /volume|diameter|1000/i.test(r.t + r.v))));
		ok('after Explode the inputs are typeable (depths, Can overflow, Elevation, Base elevation, and the volume curve chooser) and the sentence is gone', ['Initial depth', 'Minimum depth', 'Maximum depth', 'Can overflow', 'Elevation', 'Base elevation', 'Tank volume'].every((o) => find(o) && find(o).controls > 0) && !(await P.evaluate(() => !!document.querySelector('#lpn_popup_fields .lpn-owned-note'))), OWNED.map((o) => o + ':' + (find(o) ? find(o).controls : 'missing')).join(' '));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });
