// THE TABLES PANE WEARS THE PROPERTIES BOX'S OVERRIDE MARKS. Real Chromium.
//   node dev/lpn-spike/override-table-marks-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-11-06: *"Should we restyle the table override indicator to use the circle and arrow
// convention?"* A table cell that holds the open scenario's override wears the orange dot (click:
// clear that cell's override, one undo step) and the orange up arrow over it (click: the Properties
// question, "Push override upward to {target}?", then the value moves to the parent; one undo step).
//   T1  Base: the Pipes table has no mark. A scenario with two diameter overrides: exactly two
//       cells wear marks, each a dot and an arrow, inside the cell; no other cell has one.
//   T2  No column is wider than in Base (heading widths identical), at desktop and at phone width.
//   T3  Pressing a mark does not move focus out of the cell being typed in.
//   T4  Cancel on the push question changes nothing; OK pushes pipe 10 to Base (cleared in the
//       scenario, written in Base), the question names the destination; one Undo restores both.
//   T5  The dot clears pipe 11's override with no question; one Undo brings it back.
// Screenshots go to EC_OVR_TABLE_SHOTS when set.
'use strict';
const path = require('path');
const fs = require('fs');
const U = require('./scenario-ui-helper.js');
const NAME = 'override-table-marks-browser-harness';
U.takeBrowserLock(NAME, 'EC_OVR_TABLE_LOCKED');
const SHOTS = process.env.EC_OVR_TABLE_SHOTS || '';

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(U.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(U.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const L = (k) => U.lang(ctx, k);
		const settle = (ms) => a.settle(ms || 600);
		const click = (sel) => P.evaluate((s) => { const e = typeof s === 'string' ? document.querySelector(s) : s; e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, sel);
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await settle(500);
		await P.click('#lpn_pane_tab_pipes');
		await settle(800);
		const widths = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_pipes thead th')).map((t) => Math.round(t.getBoundingClientRect().width * 10) / 10));
		const marks = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_pipes td')).filter((td) => td.querySelector('.lpn-pane-ovm')).map((td) => {
			const m = td.querySelector('.lpn-pane-ovm'), r = td.getBoundingClientRect(), mr = m.getBoundingClientRect();
			return { id: String(td._lpnPaneId), key: td._lpnPaneKey, dot: !!m.querySelector('.lpn-ovm-dot'), up: !!m.querySelector('.lpn-ovm-up'),
				inside: mr.left >= r.left - 0.5 && mr.right <= r.right + 0.5 && mr.top >= r.top - 0.5 && mr.bottom <= r.bottom + 0.5 };
		}));
		const diam = () => P.evaluate(() => { const o = {}; for (const id of ['10', '11']) { const tr = Array.from(document.querySelectorAll('#lpn_pane_pipes tbody tr')).find((r) => r.querySelector('td')._lpnPaneId == id); const i = tr && tr.querySelector('td.lpn-pane-col-diameter input'); o[id] = i ? i.value : null; } return o; });
		const shot = async (n) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await P.screenshot({ path: path.join(SHOTS, n + '.png') }); } };
		const mark = (id, which) => P.evaluate(([id, which]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-diameter')).find((t) => t._lpnPaneId == id);
			const e = td && td.querySelector('.lpn-ovm-' + which);
			if (!e) { return null; }
			const r = e.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, [id, which]);
		const dlg = () => P.evaluate(() => { const d = document.getElementById('lpn_dialog'); return d && d.style.display === 'block' ? { text: document.getElementById('lpn_dialog_body').textContent.trim(), buttons: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent.trim()) } : null; });
		const press = (label) => P.evaluate((l) => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === l); b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }, label);

		// T1
		const baseW = await widths();
		ok('T1 Base: no mark anywhere', (await marks()).length === 0);
		const baseDiam = await diam();
		const baseStored = (await U.storedProject(ctx)).links.find((l) => String(l.id) === '10')._diameter;
		await U.createScenarioViaMenu(ctx);
		await U.editPropertyViaUI(ctx, { kind: 'link', id: '10', labelKey: 'lpn_field_diameter', value: '14' });
		await U.editPropertyViaUI(ctx, { kind: 'link', id: '11', labelKey: 'lpn_field_diameter', value: '15' });
		await settle(600);
		let m = await marks();
		ok('T1 two cells wear marks, both diameter, pipes 10 and 11', m.length === 2 && m.every((x) => x.key === 'diameter') && m.map((x) => x.id).sort().join() === '10,11', JSON.stringify(m));
		ok('T1 each has a dot and an arrow, inside its cell', m.every((x) => x.dot && x.up && x.inside));
		// T2
		const w = await widths();
		ok('T2 no column wider than in Base (desktop)', w.length === baseW.length && w.every((x, i) => x <= baseW[i] + 0.1), JSON.stringify(w.map((x, i) => x - baseW[i]).filter((d) => d !== 0)));
		await shot('desktop');

		// T3: focus stays in the cell being typed in
		const other = 'td.lpn-pane-col-roughness input';
		await P.evaluate((s) => { const i = document.querySelector('#lpn_pane_pipes ' + s); i.focus(); }, other);
		const up = await mark('10', 'up');
		await P.mouse.move(up.x, up.y);
		await P.mouse.down();
		const stillFocus = await P.evaluate(() => document.activeElement && document.activeElement.closest('td') && document.activeElement.closest('td').classList.contains('lpn-pane-col-roughness'));
		await P.keyboard.type('1');
		const typed = await P.evaluate(() => document.activeElement && document.activeElement.value);
		await P.evaluate(() => { const i = document.activeElement; i.value = i.value.slice(0, -1); i.blur(); });
		await P.mouse.up();
		await settle(300);
		const d0 = await dlg();
		ok('T3 pressing the arrow keeps focus in the cell being typed in, and typing goes on', !!stillFocus && /1$/.test(String(typed)), String(typed));
		ok('T3 the arrow asked the push question', !!d0 && /^Push override upward to /.test(d0.text), d0 && d0.text);
		console.log('       question: ' + (d0 && d0.text) + ' / buttons ' + (d0 && d0.buttons.join('|')));
		await shot('push-question');
		// T4 cancel
		await press(d0.buttons[d0.buttons.length - 1]);
		await settle(400);
		ok('T4 cancel changes nothing', (await marks()).length === 2 && JSON.stringify(await diam()) === JSON.stringify({ 10: '14', 11: '15' }), JSON.stringify(await diam()));
		// push for real
		const up2 = await mark('10', 'up');
		await P.mouse.click(up2.x, up2.y);
		await settle(300);
		const d1 = await dlg();
		ok('T4 the question names Base and the value it replaces', !!d1 && /to Base\?/.test(d1.text) && d1.text.indexOf(baseDiam['10'].replace(/[^\d.]/g, '')) >= 0, d1 && d1.text);
		await press(d1.buttons[0]);
		await settle(900);
		const after = await marks();
		const baseNow = await P.evaluate(() => { const l = EngCalcs.lpnDebug ? null : null; return l; });
		ok('T4 pipe 10 is cleared in the scenario, pipe 11 still marked', after.length === 1 && after[0].id === '11', JSON.stringify(after.map((x) => x.id)));
		const st = await U.storedProject(ctx);
		const base = st.links.find((l) => String(l.id) === '10');
		ok('T4 Base now holds the pushed value (14 in)', base && Math.abs(base._diameter - 14) < 0.01, base && String(base._diameter));
		await P.evaluate(() => document.activeElement && document.activeElement.blur());
		await P.keyboard.press('Control+z');
		await settle(900);
		const back = await marks();
		const st2 = await U.storedProject(ctx);
		const base2 = st2.links.find((l) => String(l.id) === '10');
		ok('T4 one Undo restores both sides', back.length === 2 && base2._diameter === baseStored, JSON.stringify(back.map((x) => x.id)) + ' base ' + base2._diameter);
		// T5 dot
		const dot = await mark('11', 'dot');
		await P.mouse.click(dot.x, dot.y);
		await settle(900);
		ok('T5 the dot clears pipe 11 with no question', !(await dlg()) && (await marks()).map((x) => x.id).join() === '10');
		await P.evaluate(() => document.activeElement && document.activeElement.blur());
		await P.keyboard.press('Control+z');
		await settle(900);
		ok('T5 one Undo brings it back', (await marks()).length === 2);

		// phone width
		await P.setViewportSize({ width: 390, height: 800 });
		await settle(900);
		m = await marks();
		ok('T2 phone width: marks present and inside their cells', m.length === 2 && m.every((x) => x.dot && x.up && x.inside), JSON.stringify(m));
		ok('T2 phone width: the marks sit out of the cell flow (take no width)', await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_pipes .lpn-pane-ovm')).every((e) => getComputedStyle(e).position === 'absolute')));
		await P.evaluate(() => { const t = document.querySelector('#lpn_pane_pipes td.lpn-pane-col-diameter .lpn-ovm'); if (t) { t.scrollIntoView({ block: 'nearest', inline: 'center' }); } });
		await settle(300);
		await shot('phone');
		await P.setViewportSize({ width: 1400, height: 900 });
		await settle(600);
		const baseP = await widths();
		ok('T2 widths unchanged after the round trip', baseP.every((x, i) => Math.abs(x - w[i]) < 0.6));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(`\n${checks - failures}/${checks} passed`);
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
