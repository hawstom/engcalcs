// THE VALVES EXAMPLE, OPENED THE WAY A VISITOR OPENS IT, IN BOTH ENGINES.
//   node dev/lpn-spike/valve-example-browser-harness.js   (takes the browser lock itself)
//
// Real Chromium, the real page. The gallery card "Valve types" is clicked; the page solves the file
// with the engine the file states (EPANET), then the "Use the built-in solver when possible" box in
// Settings is ticked and the page solves it again. In each solve, from the page's own result:
//   PBV1 drop = 60 psi; PRV1 downstream J4 = 45 psi; PSV1 upstream J3 = 55 psi; FCV1 flow = 300 gpm;
//   TCV1 loss = K v^2/2g (K 150); GPV1 loss = the STRAINER curve at its flow;
// and the two engines agree to 0.5 psi at every node. The same numbers are held headless, with the
// settings made harmless to show they do the holding, by valve-example-harness.js.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_VALVEEX_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_VALVEEX_LOCKED: '1' }) });
		if (r.status === 75) { console.error('valve-example-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const PSI_PER_M = 0.4333 / 0.3048, GPM = 15850.32, FT = 3.28084;
// The STRAINER curve as the file states it (gpm, ft).
const STRAINER = [[0, 0], [100, 1.2], [200, 4.5], [300, 10], [400, 17.5], [500, 28]];

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const a = await Session.open(browser, 'T');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		a.__url = 'Looped-Network.php';
		await page.setViewportSize({ width: 1400, height: 900 });
		await a.goto(a.__url);
		const title = await a.lang('lpn_ex_valves_title');
		await a.openExampleCard(title);
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		ok('1. the card "' + title + '" opened the example', (await a.nodeCount()) > 0, String(await a.nodeCount()));

		const solved = async (prev) => {
			await a.waitFor(() => page.evaluate((p) => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r.pressures && r.heads && (!p || r !== window.__prev)); }, prev), 'a solve', 60000).catch(() => null);
			await a.settle(800);
			return page.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return r && r.pressures ? JSON.parse(JSON.stringify({ converged: r.converged, engine: r.engine || 'native', p: r.pressures, h: r.heads, q: r.flows, vs: r.valveStatus || null })) : null; });
		};
		const R = {};
		R.epanet = await solved(false);
		ok('2. the page solved it with EPANET (the engine the file states)', !!R.epanet && R.epanet.converged === true && R.epanet.engine === 'epanet', R.epanet && R.epanet.engine);

		await page.evaluate(() => { window.__prev = EngCalcs.lpnSolveProbe(); });
		const label = await a.lang('lpn_settings_engine_native');
		const flipped = await page.evaluate((t) => {
			const rows = Array.from(document.querySelectorAll('label, .lpn-setrow, tr, div')).filter((e) => e.textContent.trim().indexOf(t) === 0 && e.querySelector('input[type=checkbox]'));
			const box = rows.length ? rows[rows.length - 1].querySelector('input[type=checkbox]') : null;
			if (!box) { return 'no checkbox'; }
			box.checked = true;
			box.dispatchEvent(new Event('change', { bubbles: true }));
			return 'ok';
		}, label);
		ok('3. the built-in solver box ("' + label + '") was ticked', flipped === 'ok', flipped);
		R.native = await solved(true);
		ok('4. the page solved it again with the built-in solver', !!R.native && R.native.converged === true && R.native.engine === 'native', R.native && R.native.engine);
		ok('   ...and it reports PBV1, PRV1, PSV1 and FCV1 active', !!R.native && !!R.native.vs && ['PBV1', 'PRV1', 'PSV1', 'FCV1'].every((v) => R.native.vs[v] === 'active'), JSON.stringify(R.native && R.native.vs));

		if (R.epanet && R.native) {
			let wp = 0;
			Object.keys(R.native.p).forEach((id) => { if (/^J|^T/.test(id)) { wp = Math.max(wp, Math.abs(R.native.p[id] - R.epanet.p[id]) * PSI_PER_M); } });
			ok('5. the two engines agree to 0.5 psi at every node', wp < 0.5, wp.toFixed(4) + ' psi');
			for (const eng of ['epanet', 'native']) {
				const r = R[eng], psi = (id) => r.p[id] * PSI_PER_M, gpm = (id) => r.q[id] * GPM;
				ok('6. ' + eng + ': PBV1 drop = 60 psi', Math.abs((r.h.J1 - r.h.J2) * PSI_PER_M - 60) < 0.05, ((r.h.J1 - r.h.J2) * PSI_PER_M).toFixed(3));
				ok('   ' + eng + ': PRV1 downstream J4 = 45 psi', Math.abs(psi('J4') - 45) < 0.05, psi('J4').toFixed(3));
				ok('   ' + eng + ': PSV1 upstream J3 = 55 psi', Math.abs(psi('J3') - 55) < 0.05, psi('J3').toFixed(3));
				ok('   ' + eng + ': FCV1 flow = 300 gpm', Math.abs(gpm('FCV1') - 300) < 0.05, gpm('FCV1').toFixed(3));
				const v = r.q.TCV1 / (Math.PI * 0.1016 * 0.1016 / 4), loss = 150 * v * v / (2 * 9.80665), got = r.h.J3 - r.h.J8;
				ok('   ' + eng + ': TCV1 loss = K v^2/2g', Math.abs(got - loss) / loss < 0.01, (got * FT).toFixed(2) + ' ft vs ' + (loss * FT).toFixed(2));
				const g = gpm('GPV1');
				let want = null;
				for (let i = 1; i < STRAINER.length; i++) { if (g <= STRAINER[i][0]) { want = STRAINER[i - 1][1] + (STRAINER[i][1] - STRAINER[i - 1][1]) * (g - STRAINER[i - 1][0]) / (STRAINER[i][0] - STRAINER[i - 1][0]); break; } }
				ok('   ' + eng + ': GPV1 loss = the STRAINER curve at ' + g.toFixed(1) + ' gpm', want !== null && Math.abs((r.h.J3 - r.h.J10) * FT - want) < 0.02, ((r.h.J3 - r.h.J10) * FT).toFixed(3) + ' ft vs ' + (want && want.toFixed(3)));
			}
		}
		ok('7. no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
