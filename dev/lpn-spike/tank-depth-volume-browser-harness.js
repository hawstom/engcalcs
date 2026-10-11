// A TANK'S DEPTH AND USABLE VOLUME, in the Tables pane, the properties box and the time-series graph (Task 783).
//   node dev/lpn-spike/tank-depth-volume-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Tom, 2026-10-10: depth and volume columns for tanks, "with zero at minimum depth". Real Chromium:
//   1. Net3 (three tanks), its EPANET run finished. At several clock times the Tanks table's Depth is
//      the frame's head minus the tank bottom, and Usable volume is pi/4 D^2 (depth - lowest water
//      depth) in the LENGTH unit cubed. The depth MOVES across the run (a column that repeated the
//      first frame would be flat).
//   2. A tank that states a VOLUME curve: the usable volume is the curve at the depth minus the
//      curve at the lowest water depth, which is not the cylinder's number.
//   3. The time-series graph offers both quantities, and draws a line for a tank.
//   4. One non-English page (?lang=es) renders both columns, with the English fallback for the new keys.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TANKDV_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('tank-depth-volume-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('tank-depth-volume-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('tank-depth-volume-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const FT = 0.3048;

// A reservoir feeding a junction (50 gpm) and a tank with a VOLUME curve. Feet and cubic feet.
// Curve: 0 -> 0, 2 -> 20, 10 -> 420, 20 -> 1920. Lowest water depth 2.
const CURVE_INP = [
	'[JUNCTIONS]', ' J1  100  50', '',
	'[RESERVOIRS]', ' R  150', '',
	'[TANKS]', ';ID  Elev  InitLvl  MinLvl  MaxLvl  Diam  MinVol  VolCurve',
	' T  100  5  2  20  10  0  SHAPE', '',
	'[PIPES]', ' P1  R  J1  1000  12  130  0  Open', ' P2  J1  T  1000  12  130  0  Open', '',
	'[COORDINATES]', ' J1  10  0', ' R  0  0', ' T  20  0', '',
	'[CURVES]', ';VOLUME: the vessel', ' SHAPE  0  0', ' SHAPE  2  20', ' SHAPE  10  420', ' SHAPE  20  1920', '',
	'[TIMES]', ' Duration  6:00', ' Hydraulic Timestep  1:00', ' Report Timestep  1:00', '',
	'[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '', '[END]', ''
].join('\n');
const curveVol = (d) => {
	const P = [[0, 0], [2, 20], [10, 420], [20, 1920]];
	if (d <= 0) { return 0; }
	for (let i = 1; i < P.length; i++) {
		if (d <= P[i][0]) { return P[i - 1][1] + (P[i][1] - P[i - 1][1]) * (d - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); }
	}
	return 1920;
};

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('tank-depth-volume-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const runDone = (a) => a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
		const goTo = async (a, t) => { await a.page.evaluate((s) => EngCalcs.lpnTimeGoTo(s), t); await a.settle(500); };
		const openTanks = async (a) => {
			await a.toolbarClick(await a.lang('lpn_pane_toggle'));
			await a.settle(500);
			await a.page.click('#lpn_pane_tab_tanks');
			await a.settle(800);
		};
		// The Tanks table as rows of {heading: cell text}, soft hyphens stripped.
		const table = (a) => a.page.evaluate(() => {
			const tb = document.querySelector('#lpn_pane_tanks table');
			const heads = Array.from(tb.querySelectorAll('th')).map((h) => h.textContent.replace(/­/g, ''));
			return Array.from(tb.querySelectorAll('tbody tr')).map((r) => {
				const o = {};
				Array.from(r.children).forEach((c, i) => { const inp = c.querySelector('input'); o[heads[i]] = inp ? inp.value : c.textContent; });
				return o;
			});
		});
		const col = (row, prefix) => {
			const k = Object.keys(row).filter((h) => h.indexOf(prefix) === 0)[0];
			return k === undefined ? undefined : row[k];
		};
		const consent = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });

		// ---- 1. Net3 ----------------------------------------------------------------------------
		console.log('1. NET3, three tanks, EPANET run');
		const a = await Session.open(browser, 'tankdv', { viewport: { width: 1500, height: 950 } });
		await a.goto('Looped-Network.php');
		await consent(a);
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(800);
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await runDone(a);
		await openTanks(a);
		const depthName = await a.lang('lpn_result_depth');
		const volName = await a.lang('lpn_result_tank_volume');
		const headName = await a.lang('lpn_result_head');
		let depthAt = {};
		for (const t of [0, 3 * 3600, 9 * 3600, 17 * 3600, 24 * 3600]) {
			await goTo(a, t);
			const rows = await table(a);
			const frame = await a.page.evaluate((s) => {
				const f = EngCalcs.lpnTimeRunFrames().filter((x) => x.t === s)[0];
				return f ? { heads: f.heads, levels: f.levels } : null;
			}, t);
			ok('t=' + t + ': the run has a frame for this time', !!frame);
			if (!frame) { continue; }
			for (const r of rows) {
				const id = r.ID, elev = parseFloat(col(r, 'Elevation')), min = parseFloat(col(r, 'Lowest')), dia = parseFloat(col(r, 'Tank diameter'));
				const head = parseFloat(col(r, headName)), dep = parseFloat(col(r, depthName)), vol = parseFloat(col(r, volName));
				const depFrame = frame.levels[id] / FT;
				ok('t=' + t + ' tank ' + id + ': Depth is head minus the tank bottom (' + dep + ' vs ' + (head - elev).toFixed(2) + ')',
					near(dep, head - elev, 0.06));
				ok('t=' + t + ' tank ' + id + ': Depth is the engine\'s own level (' + depFrame.toFixed(2) + ')', near(dep, depFrame, 0.02));
				const expect = Math.PI / 4 * dia * dia * (dep - min);
				ok('t=' + t + ' tank ' + id + ': Usable volume = pi/4 D^2 (depth - lowest) = ' + expect.toFixed(0) + ' (shown ' + vol + ')',
					near(vol, expect, Math.max(1, expect * 2e-3)));
				depthAt[id] = depthAt[id] || [];
				depthAt[id].push(dep);
			}
		}
		ok('Depth moves across the run for at least one tank', Object.keys(depthAt).some((id) => Math.max(...depthAt[id]) - Math.min(...depthAt[id]) > 0.5),
			JSON.stringify(depthAt));
		// The column headings carry the units: depth in the Elevation/Head unit, volume in the length unit cubed.
		const heads = Object.keys((await table(a))[0]);
		const dh = heads.filter((h) => h.indexOf(depthName) === 0)[0], vh = heads.filter((h) => h.indexOf(volName) === 0)[0];
		ok('Depth heading states the head unit: ' + dh, /\(ft H2O\)/.test(dh || ''));
		ok('Usable volume heading states the length unit cubed: ' + vh, /\(ft\^3\)/.test(vh || ''));

		// ---- 3. the graph offers both (Net3 still open) ------------------------------------------
		console.log('\n3. THE TIME-SERIES GRAPH');
		await a.page.click('#lpn_pane_tab_timeseries');
		await a.settle(800);
		const opts = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_ts_quantity option')).map((o) => [o.value, o.textContent]));
		ok('the node quantities include Depth', opts.some((o) => o[0] === 'depth' && o[1] === depthName), JSON.stringify(opts.map((o) => o[1])));
		ok('the node quantities include Usable volume', opts.some((o) => o[0] === 'volume' && o[1] === volName));

		// ---- 2. a tank with a volume curve -------------------------------------------------------
		console.log('\n2. A TANK WITH A VOLUME CURVE');
		const b = await Session.open(browser, 'tankdv2', { viewport: { width: 1500, height: 950 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php');
		await b.answerTrainingPanel().catch(() => {});
		await consent(b);
		await b.settle(1200);
		await b.page.setInputFiles('#lpn_inp_file', { name: 'curve.inp', mimeType: 'text/plain', buffer: Buffer.from(CURVE_INP) });
		await b.settle(1500);
		// An import that reports differences stops on a dialog; press its first button the real way.
		const dlg = await b.dialog();
		if (dlg) {
			console.log('   (import dialog: ' + dlg.text.slice(0, 120).replace(/\s+/g, ' ') + ' / ' + dlg.buttons.join(' | ') + ')');
			await b.page.evaluate(() => {
				const btn = document.querySelector('#lpn_dialog_buttons button');
				btn.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			});
			await b.settle(800);
		}
		await b.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await runDone(b);
		await openTanks(b);
		let curveSeen = 0, differs = 0;
		for (const t of [0, 2 * 3600, 5 * 3600]) {
			await goTo(b, t);
			const r = (await table(b))[0];
			const dep = parseFloat(col(r, depthName)), vol = parseFloat(col(r, volName)), min = parseFloat(col(r, 'Lowest'));
			const want = curveVol(dep) - curveVol(min);
			const cyl = Math.PI / 4 * 100 * (dep - min);
			ok('curve tank t=' + t + ': depth ' + dep + ', usable volume ' + vol + ' = curve(depth) - curve(lowest) = ' + want.toFixed(1),
				near(vol, want, Math.max(0.6, want * 2e-3)));
			if (near(vol, want, Math.max(0.6, want * 2e-3))) { curveSeen++; }
			if (Math.abs(vol - cyl) > 1) { differs++; }
		}
		ok('the curve, not the cylinder, decided the volume', curveSeen === 3 && differs === 3);
		// ---- the graph draws a tank: the seeded picks of the curve project include its tank ------
		console.log('\n3b. THE GRAPH DRAWS THE TANK');
		await b.page.click('#lpn_pane_tab_timeseries');
		await b.settle(800);
		for (const q of ['depth', 'volume']) {
			await b.page.evaluate((qq) => {
				const sel = document.getElementById('lpn_ts_quantity');
				sel.value = qq; sel.dispatchEvent(new Event('change', { bubbles: true }));
			}, q);
			await b.settle(700);
			const chart = await b.page.evaluate(() => {
				const host = document.getElementById('lpn_ts_chart');
				return { lines: host.querySelectorAll('.lpn-ts-line').length, text: host.textContent,
					chips: Array.from(document.querySelectorAll('#lpn_ts_form .lpn-ts-chip')).length };
			});
			const nm = q === 'depth' ? depthName : volName, unit = q === 'depth' ? 'ft H2O' : 'ft^3';
			ok(nm + ' for a tank draws a line', chart.lines >= 1, 'lines=' + chart.lines);
			ok(nm + ': the axis names the quantity and its unit', chart.text.indexOf(nm) >= 0 && chart.text.indexOf(unit) >= 0, chart.text.slice(0, 140));
		}
		await b.close();

		// ---- 4. a non-English page ---------------------------------------------------------------
		console.log('\n4. ?lang=es');
		const c = await Session.open(browser, 'tankdv3', { viewport: { width: 1500, height: 950 } });
		await c.goto('Looped-Network.php?lang=es');
		await consent(c);
		await c.openExampleCard(await c.lang('lpn_ex_net3_title'));
		await c.settle(800);
		await c.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await runDone(c);
		await openTanks(c);
		const esDepth = await c.lang('lpn_result_depth'), esVol = await c.lang('lpn_result_tank_volume');
		const esHead = await c.lang('lpn_result_head');
		ok('the page really is Spanish (Head is not the English word)', esHead !== headName, esHead);
		const esRows = await table(c);
		const esHeads = Object.keys(esRows[0]);
		ok('Depth column is present: ' + esDepth, esHeads.some((h) => h.indexOf(esDepth) === 0));
		ok('Usable volume column is present: ' + esVol, esHeads.some((h) => h.indexOf(esVol) === 0));
		const ev = parseFloat(col(esRows[0], esVol)), ed = parseFloat(col(esRows[0], esDepth));
		ok('and carry numbers (' + ed + ', ' + ev + ')', isFinite(ed) && isFinite(ev) && ev > 0);
		ok('no heading reads "undefined"', esHeads.every((h) => h.indexOf('undefined') < 0));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall tank depth and volume checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
