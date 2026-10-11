// SNAP / MAGNET TO ASSET (ROADMAP Task 782), in a real Chrome, through real pointer presses.
//
//   node dev/lpn-spike/snap-browser-harness.js
//
// Tom, 2026-10-10: *"Snap/magnet to asset"*. On Net1: a tank placed near junction 22 lands on 22's
// stored coordinates to the character and says the two are not connected; Undo takes it back; a pipe
// from it solves. A junction placed near pipe 10's line is put on the line and offered the split;
// the split network solves. A junction dragged near a pipe vertex lands on it exactly; the same drag
// with Alt held does not; Undo restores the first. A geographic project: a reservoir snapped onto a
// junction stores the junction's longitude and latitude exactly. Also: a junction near a junction
// still opens it (the fat-finger rule), an Alt press places at the bare pointer, a junction snapped
// onto a bend splits the pipe there and consumes the bend, and a Spanish page names the target in
// Spanish.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SNAP_BROWSER_LOCKED';
const NAME = 'snap-browser-harness';

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

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await open(browser);
		const P = a.page;
		const settle = (ms) => a.settle(ms || 300);
		// The saved document, as autosave wrote it (flushed first): the numbers a file would carry.
		const stored = async () => {
			await settle(450);
			return P.evaluate(() => {
				const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
				return JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null');
			});
		};
		const nodeOf = (d, id) => d.nodes.find((n) => n.id === id);
		const linkOf = (d, id) => d.links.find((l) => l.id === id);
		const centre = (sel) => P.evaluate((s) => {
			const e = document.querySelector(s);
			if (!e) { return null; }
			const r = e.getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		}, sel);
		const nodeAtScreen = (id) => centre('#lpn_canvas .lpn-node[data-node="' + id + '"]');
		const mark = () => P.evaluate(() => {
			const g = document.querySelector('#lpn_canvas .lpn-snap-mark');
			return g && g.style.display !== 'none'
				? { kind: g.getAttribute('data-snap-kind'), name: (g.querySelector('text') || {}).textContent } : null;
		});
		const tool = async (label) => { await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.toolbarClick(label); await settle(200); };
		// The real Calculate button; done when the page holds a NEW result object.
		const solve = async () => {
			await P.evaluate(() => { window.__snapPrev = EngCalcs.lpnSolveProbe(); });
			const run = P.locator('#lpn_toolbar_run button[data-icon="run"]:visible');
			if (await run.count()) { await run.first().click(); }
			else { await P.evaluate(() => EngCalcs.lpnTimeRunNow()); }   // Recalculate on: the button is hidden; the same call its menu row makes
			await a.waitFor(() => P.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r !== window.__snapPrev && r.heads); }), 'a solve', 60000);
			await settle(800);
			return P.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return r ? { heads: r.heads || null, flows: r.flows || null } : null; });
		};
		const allFinite = (o) => !!o && Object.keys(o).length > 0 && Object.keys(o).every((k) => isFinite(o[k]));
		const ids = (d) => new Set(d.nodes.map((n) => n.id));
		const dragTo = async (from, to, alt) => {
			await P.mouse.move(from.x, from.y);
			await P.mouse.down();
			if (alt) { await P.keyboard.down('Alt'); }
			const steps = 12;
			for (let i = 1; i <= steps; i++) {
				await P.mouse.move(from.x + (to.x - from.x) * i / steps, from.y + (to.y - from.y) * i / steps);
				await settle(30);
			}
			await settle(150);
			const m = await mark();
			await P.mouse.up();
			if (alt) { await P.keyboard.up('Alt'); }
			await settle(300);
			return m;
		};

		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await settle(800);
		const d0 = await stored();
		ok('Net1 is open with junction 22', !!(d0 && nodeOf(d0, '22')));

		console.log('\n--- 1. a tank placed near junction 22 lands exactly on it ---');
		const j22 = await nodeAtScreen('22');
		await tool(await a.lang('lpn_tool_add_tank'));
		const near22 = { x: j22.x + 6, y: j22.y - 5 };
		await P.mouse.move(near22.x - 30, near22.y - 30);
		await P.mouse.move(near22.x, near22.y, { steps: 4 });
		await settle(150);
		const m1 = await mark();
		ok('hovering shows the node glyph and names Junction 22', !!m1 && m1.kind === 'node' && m1.name === 'Junction 22', JSON.stringify(m1));
		await P.mouse.click(near22.x, near22.y);
		await settle(400);
		const d1 = await stored();
		const tankId = [...ids(d1)].find((id) => !ids(d0).has(id));
		const tk = tankId && nodeOf(d1, tankId), n22 = nodeOf(d1, '22');
		ok('a tank was placed', !!tk && tk.type === 'tank', tankId);
		ok('its stored x and y equal junction 22\'s exactly', !!tk && tk.x === n22.x && tk.y === n22.y,
			tk && JSON.stringify([tk.x, tk.y, n22.x, n22.y]));
		ok('...and any file characters of 22\'s coordinates came with them',
			!!tk && JSON.stringify((tk.tok || {}).x) === JSON.stringify((n22.tok || {}).x) && JSON.stringify((tk.tok || {}).y) === JSON.stringify((n22.tok || {}).y));
		ok('the notice says the two are not connected', /not connected/.test(await a.notice() || '') && /Junction 22/.test(await a.notice() || ''), await a.notice());
		ok('the glyph goes away after the press', (await mark()) === null);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		await P.keyboard.press('Control+z'); await settle(400);
		const dU = await stored();
		ok('Undo takes the snapped tank back in one step', !nodeOf(dU, tankId) && dU.nodes.length === d0.nodes.length);
		await P.keyboard.press('Control+y'); await settle(400);
		const dR = await stored();
		ok('Redo puts it back on 22', !!nodeOf(dR, tankId) && nodeOf(dR, tankId).x === n22.x);

		console.log('\n--- 1b. same type opens what is there; Alt places at the bare pointer ---');
		{
			await tool(await a.lang('lpn_tool_add_junction'));
			const before = (await stored()).nodes.length;
			await P.mouse.click(j22.x - 5, j22.y + 5); await settle(400);
			ok('a junction pressed near junction 22 opens it and places nothing (the fat-finger rule)',
				(await stored()).nodes.length === before && await P.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && p.style.display !== 'none'; }));
			await P.click('#lpn_popup_close'); await settle(200);
			await tool(await a.lang('lpn_tool_add_tank'));
			await P.keyboard.down('Alt');
			await P.mouse.move(j22.x + 8, j22.y + 8, { steps: 3 }); await settle(150);
			const mAlt = await mark();
			await P.mouse.click(j22.x + 8, j22.y + 8);
			await P.keyboard.up('Alt'); await settle(400);
			const dA = await stored(), tA = dA.nodes.find((n) => !ids(dR).has(n.id));
			ok('with Alt held there is no glyph while hovering', mAlt === null, JSON.stringify(mAlt));
			ok('...and the tank is placed off junction 22, at the pointer', !!tA && tA.type === 'tank' && (tA.x !== n22.x || tA.y !== n22.y),
				tA && JSON.stringify([tA.x, tA.y]));
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
			await P.keyboard.press('Control+z'); await settle(400);
			ok('Undo removes it', !nodeOf(await stored(), tA && tA.id));
		}

		console.log('\n--- 2. a pipe from the snapped tank, and the model solves ---');
		const j23 = await nodeAtScreen('23');
		await tool(await a.lang('lpn_tool_add_pipe'));
		await P.mouse.click(j22.x, j22.y); await settle(250);
		await P.mouse.click(j23.x, j23.y); await settle(400);
		const d2 = await stored();
		const newPipe = d2.links.find((l) => !d1.links.some((m) => m.id === l.id));
		ok('a pipe joins the tank to junction 23', !!newPipe && [newPipe.from, newPipe.to].sort().join() === [tankId, '23'].sort().join(),
			newPipe && newPipe.from + '-' + newPipe.to);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		const r2 = await solve();
		ok('it solves: every head is a number, the new tank\'s included', allFinite(r2 && r2.heads) && isFinite(r2.heads[tankId]),
			r2 && r2.heads && r2.heads[tankId]);
		ok('...and the new pipe carries a flow', !!newPipe && r2 && r2.flows && isFinite(r2.flows[newPipe.id]), r2 && r2.flows && r2.flows[newPipe && newPipe.id]);

		console.log('\n--- 3. a junction near pipe 10\'s line goes on the line and is offered the split ---');
		{
			const p10 = linkOf(d2, '10'), a10 = await nodeAtScreen(p10.from), b10 = await nodeAtScreen(p10.to);
			const len = Math.hypot(b10.x - a10.x, b10.y - a10.y), nx = -(b10.y - a10.y) / len, ny = (b10.x - a10.x) / len;
			const at = { x: (a10.x + b10.x) / 2 + nx * 9, y: (a10.y + b10.y) / 2 + ny * 9 };
			await tool(await a.lang('lpn_tool_add_junction'));
			await P.mouse.move(at.x + 20, at.y + 20);
			await P.mouse.move(at.x, at.y, { steps: 3 });
			await settle(150);
			const m3 = await mark();
			ok('hovering 9 px off the line shows the line glyph naming Pipe 10', !!m3 && m3.kind === 'line' && m3.name === 'Pipe 10', JSON.stringify(m3));
			await P.mouse.click(at.x, at.y);
			const dlg = await a.waitDialog(4000).catch(() => null);
			ok('the split question is asked', !!dlg && /Split pipe 10/.test(JSON.stringify(dlg)), JSON.stringify(dlg));
			await P.evaluate((yes) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === yes);
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			}, await a.lang('lpn_split_yes'));
			await settle(500);
			const d3 = await stored();
			const nj = d3.nodes.find((n) => !ids(d2).has(n.id));
			const q10 = linkOf(d3, '10'), A = nodeOf(d3, p10.from), B = nodeOf(d3, p10.to);
			const cross = nj ? ((B.x - A.x) * (nj.y - A.y) - (B.y - A.y) * (nj.x - A.x)) / Math.hypot(B.x - A.x, B.y - A.y) : NaN;
			ok('a junction was made and pipe 10 now ends at it', !!nj && q10.to === nj.id, nj && q10.to);
			ok('the junction is ON the old line (off it by under 1e-6 units)', Math.abs(cross) < 1e-6, cross);
			ok('the other half runs from it to pipe 10\'s old end', d3.links.some((l) => l.from === nj.id && l.to === p10.to));
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
			const r3 = await solve();
			ok('the split network solves, the new junction included', allFinite(r3 && r3.heads) && isFinite(r3.heads[nj.id]));
		}

		console.log('\n--- 4. a node dragged near a pipe vertex lands on it; with Alt it does not ---');
		{
			// A bend on pipe 21, made with the Vertices tool (pipe 22 now has the tank's pipe drawn over it).
			const p22 = linkOf(await stored(), '21'), a22 = await nodeAtScreen(p22.from), b22 = await nodeAtScreen(p22.to);
			await tool(await a.lang('lpn_tool_vertices'));
			await P.mouse.click((a22.x + b22.x) / 2, (a22.y + b22.y) / 2 + 0.5); await settle(400);
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await settle(200);
			await a.waitFor(async () => ((linkOf(await stored(), '21').verts) || []).length > 0, 'the vertex saved', 4000);
			const d4 = await stored();
			const v = (linkOf(d4, '21').verts || [])[0];
			ok('pipe 21 has a vertex to snap to', !!v);
			await a.toolbarClick('Select'); await settle(200);
			const vh = await centre('#lpn_canvas .lpn-vhandle[data-link="21"]');
			const j32 = await nodeAtScreen('32');
			const m4 = await dragTo(j32, { x: vh.x + 5, y: vh.y + 4 }, false);
			ok('during the drag the glyph names the vertex', !!m4 && m4.kind === 'vertex' && m4.name === 'Pipe 21, vertex 1', JSON.stringify(m4));
			const d5 = await stored();
			const n32 = nodeOf(d5, '32'), v5 = linkOf(d5, '21').verts[0];
			ok('junction 32 lands on the vertex exactly', n32.x === v5.x && n32.y === v5.y, JSON.stringify([n32.x, n32.y, v5.x, v5.y]));
			await P.keyboard.press('Control+z'); await settle(400);
			const d6 = await stored(), n32b = nodeOf(d6, '32'), n32o = nodeOf(d4, '32');
			ok('Undo puts junction 32 back where it was', n32b.x === n32o.x && n32b.y === n32o.y, JSON.stringify([n32b.x, n32b.y, n32o.x, n32o.y]));
			// A junction magneted onto the bend splits the pipe THERE, and the bend becomes the node.
			await tool(await a.lang('lpn_tool_add_junction'));
			await P.mouse.move(vh.x + 4, vh.y - 3, { steps: 3 }); await settle(150);
			const mv = await mark();
			ok('the junction tool shows the vertex glyph at the bend', !!mv && mv.kind === 'vertex', JSON.stringify(mv));
			await P.mouse.click(vh.x + 4, vh.y - 3);
			const dlg2 = await a.waitDialog(4000).catch(() => null);
			ok('the split question names pipe 21', !!dlg2 && /Split pipe 21/.test(dlg2.text), dlg2 && dlg2.text);
			await P.evaluate((yes) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === yes);
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			}, await a.lang('lpn_split_yes'));
			await settle(500);
			const dv = await stored(), nvj = dv.nodes.find((n) => !ids(d6).has(n.id)), p21 = linkOf(dv, '21');
			ok('the new junction stands exactly on the bend', !!nvj && nvj.x === v.x && nvj.y === v.y, nvj && JSON.stringify([nvj.x, nvj.y, v.x, v.y]));
			ok('...and the bend is gone from both halves (no zero-length leg)', p21.to === (nvj && nvj.id) && p21.verts.length === 0 &&
				dv.links.some((l) => l.from === (nvj && nvj.id) && l.verts.length === 0));
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
			await P.keyboard.press('Control+z'); await settle(400);
			ok('Undo restores pipe 21 with its bend', (linkOf(await stored(), '21').verts || []).length === 1);
			await a.toolbarClick('Select'); await settle(200);
			const j31 = await nodeAtScreen('31');
			const m5 = await dragTo(j31, { x: vh.x + 5, y: vh.y + 4 }, true);
			const d7 = await stored(), n31 = nodeOf(d7, '31'), v7 = linkOf(d7, '21').verts[0];
			ok('with Alt held there is no glyph', m5 === null, JSON.stringify(m5));
			ok('...and junction 31 does NOT land on the vertex', !(n31.x === v7.x && n31.y === v7.y) && n31.x !== nodeOf(d6, '31').x);
			const r7 = await solve();
			ok('the network still solves after the drags', allFinite(r7 && r7.heads));
		}

		console.log('\n--- 5. a geographic project: the snapped reservoir stores the junction\'s lon/lat ---');
		{
			await a.newGeoProject('us');
			await a.dismissGallery();
			await settle(600);
			const box = await P.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
			const at = { x: box.x + box.w * 0.45, y: box.y + box.h * 0.45 };
			await tool(await a.lang('lpn_tool_add_junction'));
			await P.mouse.click(at.x, at.y); await settle(400);
			// Measured AFTER the press: the first node of an empty geographic project can move the view.
			const jId = (await stored()).nodes[0].id, jAt = await nodeAtScreen(jId);
			await tool(await a.lang('lpn_tool_add_reservoir'));
			await P.mouse.move(jAt.x + 7, jAt.y + 6, { steps: 3 }); await settle(150);
			const mg = await mark();
			ok('the glyph names the junction', !!mg && mg.kind === 'node' && mg.name === 'Junction ' + jId, JSON.stringify(mg));
			await P.mouse.click(jAt.x + 7, jAt.y + 6); await settle(500);
			const g = await stored();
			const j = g.nodes.find((n) => n.type === 'junction'), r = g.nodes.find((n) => n.type === 'reservoir');
			ok('the project is geographic', g.project && g.project.coords === 'geo');
			ok('the reservoir\'s stored longitude and latitude equal the junction\'s exactly', !!j && !!r && r.x === j.x && r.y === j.y,
				JSON.stringify([j && j.x, j && j.y, r && r.x, r && r.y]));
			ok('...and they are longitudes and latitudes, not Web Mercator drawing numbers', !!j && Math.abs(j.y) <= 85.06 && Math.abs(j.x) <= 180);
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 6. a Spanish page names the target in Spanish ---');
		{
			const b = await Session.open(browser, NAME + '-es', { viewport: { width: 1400, height: 900 } });
			await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
			await b.goto('Looped-Network.php?lang=es');
			await b.answerTrainingPanel().catch(() => {});
			await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await b.settle(1000);
			await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
			await b.settle(800);
			const c22 = await b.page.evaluate(() => { const r = document.querySelector('#lpn_canvas .lpn-node[data-node="22"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
			await b.page.keyboard.press('Escape');
			await b.toolbarClick(await b.lang('lpn_tool_add_tank')); await b.settle(200);
			await b.page.mouse.move(c22.x + 6, c22.y - 5, { steps: 3 }); await b.settle(150);
			const name = await b.page.evaluate(() => { const g = document.querySelector('#lpn_canvas .lpn-snap-mark'); return g && g.style.display !== 'none' ? g.querySelector('text').textContent : null; });
			const want = (await b.lang('lpn_tool_add_junction')) + ' 22';
			ok('the glyph names "' + want + '"', name === want, name);
			await b.page.mouse.click(c22.x + 6, c22.y - 5); await b.settle(400);
			ok('the notice names the tank and the junction', (await b.notice()).indexOf(want) >= 0, await b.notice());
			ok('no uncaught page errors on the Spanish page', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
			await b.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
