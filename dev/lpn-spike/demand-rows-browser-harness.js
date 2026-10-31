// A JUNCTION'S DEMAND AS TWO ROWS, AND THE DEMAND CATEGORIES BOX BEHIND THEM, IN A REAL BROWSER. Run with:
//   node dev/lpn-spike/demand-rows-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-28: "The Demands area presented as a hole in our design." Properties shows Base demand (and, with one
// category, its pattern) and a Demand categories row: the count and a "..." button that opens the box holding the table,
// its "+" button and the customers lumped at the junction. At 1366 x 768, Net1 junction 11:
//   R1  Properties holds no demand table; Base demand is a box to type in, with the Demand pattern row, and the
//       Demand categories row reads 1 beside its button;
//   R2  the button opens the box, titled for the junction, holding one row and the "+" button;
//   R3  "+" makes it 2: the count follows, Base demand becomes the read-only total (no box, muted), no pattern row;
//   R4  removing the added row returns Base demand to a box;
//   R5  with one category, typing Base demand changes that category (the box's first row shows it) and Undo puts it back;
//   R6  in a scenario the same edit is an override and Base is untouched;
//   R7  a box left open follows another junction, and no page errors;
//   R8  the box opens at its own size (one row is not 618 x 615) and beside Properties, never over it;
//   R9  real mouse and keyboard: click the 2nd row's demand cell, type 75, press Tab, and focus moves on to that row's pattern;
//   R10 in a scenario the box carries the orange override dot; in Base it does not;
//   R11 a junction with Customers shows the customers line, muted, under Demand categories in Properties.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const U = require('./scenario-ui-helper.js');
const NAME = 'demand-rows-browser-harness';
U.takeBrowserLock(NAME, 'EC_DEMANDROWS_LOCKED');

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
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const errors = [];
		P.on('pageerror', (e) => errors.push(String(e && e.message)));
		await P.setViewportSize({ width: 1366, height: 768 });
		const lang = (k) => U.lang(ctx, k);
		const BASE = await lang('lpn_field_base_demand'), PAT = await lang('lpn_field_demand_pattern'), CATS = await lang('lpn_demand_cats');
		// What Properties shows for the demand, by the words on its rows.
		const rows = () => P.evaluate(([b, p, c]) => {
			const f = document.getElementById('lpn_popup_fields'), vis = (e) => e.getBoundingClientRect().width > 0;
			const row = (t) => Array.from(f.querySelectorAll('.lpn-grow')).filter((r) => r.querySelector('.lpn-gname') && r.querySelector('.lpn-gname').textContent.replace(/\s+/g, ' ').trim().indexOf(t) === 0)[0];
			const rb = row(b), rp = row(p), rc = row(c);
			const ed = rb && rb.querySelector('input.lpn-gval');
			const ro = rb && rb.querySelector('span.lpn-gval');
			return {
				table: !!f.querySelector('table.lpn-demand-table'), add: !!f.querySelector('.lpn-demand-add'),
				baseInput: !!ed, baseValue: ed ? ed.value : (ro ? ro.textContent.trim() : null), baseMuted: ro ? getComputedStyle(ro).color : null, baseInk: ed ? getComputedStyle(ed).color : null,
				pattern: !!rp && !!rp.querySelector('select'),
				count: rc && rc.querySelector('.lpn-demand-count') ? rc.querySelector('.lpn-demand-count').textContent.trim() : null,
				button: rc && rc.querySelector('button.lpn-demand-more') ? { text: rc.querySelector('button').textContent, vis: vis(rc.querySelector('button')), x: Math.round(rc.querySelector('button').getBoundingClientRect().left), baseX: rb ? Math.round((rb.querySelector('.lpn-gval') || rb).getBoundingClientRect().left) : null } : null
			};
		}, [BASE, PAT, CATS]);
		const box = () => P.evaluate(() => {
			const b = document.getElementById('lpn_demands_box'), body = document.getElementById('lpn_demands_body');
			const shown = !!b && b.style.display !== 'none' && b.getBoundingClientRect().width > 0;
			const t = body.querySelector('table.lpn-demand-table:not(.lpn-node-customers *)');
			const tb = t ? t.querySelectorAll('tbody tr') : [];
			return { shown: shown, title: document.getElementById('lpn_demands_title').textContent, rows: tb.length, add: !!body.querySelector('.lpn-demand-add'),
				first: tb[0] ? tb[0].querySelector('input[type=number]').value : null, dels: t ? t.querySelectorAll('.lpn-demand-del').length : 0 };
		});
		const stored = async () => (await U.storedProject(ctx));
		const node11 = async () => {
			const d = await stored();
			return { base: (d.nodes || []).find((n) => n.id === '11'), json: JSON.stringify(d.alternatives || []) };
		};

		console.log('\n--- the two rows (R1) ---');
		await U.openProperties(ctx, 'node', '11');
		let r = await rows();
		ok('R1 Properties draws no demand table and no "+" button', !r.table && !r.add);
		ok('R1 Base demand is a box to type in, holding 150', r.baseInput && r.baseValue === '150', JSON.stringify(r.baseValue));
		ok('R1 a Demand pattern row stands beside it (one category)', r.pattern);
		ok('R1 Demand categories reads 1 with a "..." at the right of its cell, which starts where Base demand does', r.count === '1' && !!r.button && r.button.vis && /^1\u2026$/.test(r.button.text) && r.button.x === r.button.baseX, JSON.stringify([r.count, r.button]));

		console.log('\n--- the box (R2, R3, R4) ---');
		ok('R2 the box is closed until asked', !(await box()).shown);
		await P.click('#lpn_demand_more');
		await a.settle(600);
		let b = await box();
		ok('R2 the button opens the box, titled for junction 11, with one row and the "+" button', b.shown && b.title.indexOf(CATS) === 0 && /\b11\b/.test(b.title) && b.rows === 1 && b.add, JSON.stringify(b));
		ok('R2 its first row shows 150', b.first === '150', b.first);
		const geo = await P.evaluate(() => { const R = (e) => e.getBoundingClientRect(), bx = R(document.getElementById('lpn_demands_box')), pr = R(document.getElementById('lpn_popup')); return { w: Math.round(bx.width), h: Math.round(bx.height), overlap: bx.left < pr.right && bx.right > pr.left && bx.top < pr.bottom && bx.bottom > pr.top, cue: !!document.querySelector('#lpn_demands_body .lpn-demands-ov'), inView: bx.left >= 0 && bx.right <= innerWidth }; });
		ok('R8 the box opens at its own size, not the 618 x 615 of a general box (one row)', geo.w >= 320 && geo.w <= 340 && geo.h <= 330, JSON.stringify(geo));
		ok('R8 floating, it stands beside Properties, not over it, and on the screen', !geo.overlap && geo.inView, JSON.stringify(geo));
		ok('R10 in Base the box shows no override dot', !geo.cue);
		await P.click('#lpn_demands_body .lpn-demand-add');
		await a.settle(600);
		b = await box(); r = await rows();
		ok('R3 "+" adds a row to the box (2)', b.rows === 2, String(b.rows));
		ok('R3 Properties counts 2', r.count === '2', r.count);
		ok('R3 Base demand is now the total, 150, in a muted read-out with no box', !r.baseInput && r.baseValue === '150' && !!r.baseMuted, JSON.stringify([r.baseInput, r.baseValue, r.baseMuted]));
		ok('R3 and the Demand pattern row is gone', !r.pattern);
		const was = await P.evaluate(() => document.querySelector('#lpn_demands_body tbody tr:nth-child(2) input[type=number]').value);
		// R9: a real mouse and keyboard. Click the cell, type 75, press Tab: the value is kept and focus goes on to the next cell.
		await P.click('#lpn_demands_body tbody tr:nth-child(2) input[type=number]');
		await P.keyboard.press('Control+a');
		await P.keyboard.type('75');
		await P.keyboard.press('Tab');
		await a.settle(500);
		r = await rows();
		const fo = await P.evaluate(() => { const e = document.activeElement; return { tag: e.tagName, inRow2: !!e.closest('#lpn_demands_body tbody tr:nth-child(2)'), inBody: !!e.closest('#lpn_demands_body') }; });
		ok('R9 typing 75 in the 2nd row and pressing Tab makes the total 225', r.baseValue === '225' && was === '0', JSON.stringify([was, r.baseValue]));
		ok('R9 ...and focus has moved on to the next cell of that row (the pattern), not to the page background', fo.tag === 'SELECT' && fo.inRow2, JSON.stringify(fo));
		await P.keyboard.press('Tab');
		await a.settle(300);
		const fo2 = await P.evaluate(() => { const e = document.activeElement; return { tag: e.tagName, inRow2: !!e.closest('#lpn_demands_body tbody tr:nth-child(2)') }; });
		ok('R9 ...and a second Tab reaches the Description cell', fo2.tag === 'INPUT' && fo2.inRow2, JSON.stringify(fo2));
		await P.evaluate(() => { document.querySelector('#lpn_demands_body tbody tr:nth-child(2) .lpn-demand-del').click(); });
		await a.settle(600);
		b = await box(); r = await rows();
		ok('R4 removing the added row returns to one row and a box to type in', b.rows === 1 && r.count === '1' && r.baseInput && r.baseValue === '150' && r.pattern, JSON.stringify([b.rows, r.count, r.baseInput, r.baseValue]));

		console.log('\n--- Base demand edits the one category (R5) ---');
		const setBase = (v) => P.evaluate((val) => {
			const f = document.getElementById('lpn_popup_fields');
			const row = Array.from(f.querySelectorAll('.lpn-grow')).filter((x) => /^Base demand/.test(x.querySelector('.lpn-gname').textContent.trim()))[0];
			const i = row.querySelector('input'); i.focus(); i.value = val; i.dispatchEvent(new Event('change', { bubbles: true })); i.blur();
		}, v);
		await setBase('200');
		await a.settle(900);
		b = await box();
		ok('R5 typing 200 in Properties changes the category in the box', b.first === '200', b.first);
		let st = await node11();
		ok('R5 ...and the stored junction holds 200 with no extra category', st.base && (st.base.demand === 200 || st.base._demand === 200) && !st.base.extraDemands, JSON.stringify(st.base));
		await P.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		await P.keyboard.press('Control+z');
		await a.settle(900);
		r = await rows(); b = await box();
		ok('R5 Undo puts 150 back in Properties and in the box', r.baseValue === '150' && b.first === '150', JSON.stringify([r.baseValue, b.first]));

		console.log('\n--- in a scenario (R6) ---');
		await U.createScenarioViaMenu(ctx);
		await a.settle(600);
		await U.openProperties(ctx, 'node', '11');
		await setBase('310');
		await a.settle(900);
		st = await node11();
		ok('R6 the edit is an override in the scenario', /310/.test(st.json), st.json.slice(0, 200));
		ok('R6 Base junction 11 still holds 150', st.base && (st.base.demand === 150 || st.base._demand === 150), JSON.stringify(st.base));
		r = await rows();
		ok('R6 Properties shows 310 in the scenario', r.baseValue === '310', r.baseValue);
		const cue = await P.evaluate(() => { const c = document.querySelector('#lpn_demands_body .lpn-demands-ov'); return c ? { dot: !!c.querySelector('.lpn-ovm-dot'), text: c.textContent.trim() } : null; });
		ok('R10 in the scenario the box carries the override dot and says which scenario', !!cue && cue.dot && /Scenario/.test(cue.text), JSON.stringify(cue));
		// Adding a category in the scenario keeps Base alone and the total adds up.
		// (the box is still open from above and stands over the button, so ask by the button's own click)
		await P.evaluate(() => { document.getElementById('lpn_demand_more').click(); });
		await a.settle(500);
		await P.click('#lpn_demands_body .lpn-demand-add');
		await a.settle(700);
		st = await node11();
		r = await rows();
		ok('R6 a category added in the scenario leaves Base at one', st.base && !st.base.extraDemands, JSON.stringify(st.base));
		ok('R6 ...and the scenario row count is 2 with Base demand the total, 310', r.count === '2' && r.baseValue === '310', JSON.stringify([r.count, r.baseValue]));

		console.log('\n--- an open box follows the junction (R7) ---');
		await P.evaluate(() => { const b = document.getElementById('lpn_demands_box'); b.style.left = '960px'; b.style.top = '180px'; });   // off the junctions to click
		await U.openProperties(ctx, 'node', '21');
		b = await box();
		ok('R7 selecting another junction retitles the open box', b.shown && /\b21\b/.test(b.title), b.title);
		await P.click('#lpn_demands_box .lpn-corner-btn[data-dock="right"]');
		await a.settle(600);
		const dw = await P.evaluate(() => { const bx = document.getElementById('lpn_demands_box'); return { w: Math.round(bx.getBoundingClientRect().width), floor: parseFloat(getComputedStyle(document.documentElement).fontSize) * 20.5 }; });
		ok('R8 docked, it takes its own optimal width (20.5 rem), not 618', Math.abs(dw.w - dw.floor) <= 3, JSON.stringify(dw));
		ok('R7 no page errors', errors.length === 0, errors.join(' | '));
		await a.close();

		console.log('\n--- a junction with Customers (R11) ---');
		const fs = require('fs');
		const { Session } = require(path.join(U.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const net1 = JSON.parse(fs.readFileSync(path.join(U.REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		net1.customers = [{ id: 'M1', demand: 5, count: 1, link: '10', t: 0.95, x: 0, y: 30 }];
		const c2 = await Session.open(browser, NAME + '-cust', { serviceWorkers: 'block' });
		await c2.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await c2.goto('Looped-Network.php?ec_nolog=1');
		await c2.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(net1));
		await c2.reload();
		await c2.answerTrainingPanel().catch(() => {});
		await c2.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await c2.page.setViewportSize({ width: 1366, height: 768 });
		await c2.settle(2500);
		await U.openProperties({ a: c2, P: c2.page }, 'node', '11');
		const cu = await c2.page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields'), R = (e) => e.getBoundingClientRect();
			const rs = Array.from(f.querySelectorAll('.lpn-grow')).filter((x) => x.querySelector('.lpn-gname') && R(x).height > 0);
			const at = (re) => rs.findIndex((x) => re.test(x.querySelector('.lpn-gname').textContent.trim()));
			const ic = at(/^Demand categories/), iu = at(/^Customer demands/), v = iu >= 0 ? rs[iu].querySelector('span.lpn-gval') : null;
			return { ic, iu, id: at(/^Demand \(/), text: v ? v.textContent.trim() : null, muted: v ? getComputedStyle(v).color : null, ink: getComputedStyle(f).color, demand: (rs.filter((x) => /^Demand \(/.test(x.querySelector('.lpn-gname').textContent.trim()))[0] || { querySelector: () => null }).querySelector('span.lpn-gval') && rs.filter((x) => /^Demand \(/.test(x.querySelector('.lpn-gname').textContent.trim()))[0].querySelector('span.lpn-gval').textContent.trim() };
		});
		// Row order since 99e9b4292 (Tom, 2026-10-29): Demand categories, the Demand total it adds to, then the customers line that explains it.
		ok('R11 Properties shows the customers line under Demand categories, with the Demand total between', cu.ic >= 0 && cu.id === cu.ic + 1 && cu.iu === cu.id + 1, JSON.stringify(cu));
		ok('R11 ...saying 5 gpm from Customers (1), in muted ink', /^5 gpm from Customers \(1\)$/.test(cu.text || '') && cu.muted !== cu.ink, JSON.stringify(cu));
		ok('R11 ...which explains the Demand of 155', /^155/.test(cu.demand || ''), JSON.stringify(cu.demand));
		await c2.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
