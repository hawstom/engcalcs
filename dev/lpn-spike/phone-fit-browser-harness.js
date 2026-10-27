// ZOOM TO FIT FRAMES THE NETWORK ON A PHONE (R-399). Tom, 2026-10-15, Android, tall mode: *"Zoom to
// fit doesn't work for Basic example SI units on production or on feat/bentley-interop. It zooms out
// magnitudes wider than it should."*
//
// The cause: a Text is a fixed size on screen, and the Basic examples' title ("HawsEDC Calculators"
// at four times the text size) is wider than a phone's map. No scale fits it, so the fit answered
// the drawing-sized floor and drew the 1,400-unit network as a 4 px mark (scale 0.00286 against a
// desktop 0.83). Both Basic examples did it; the US one too. Now ink that cannot fit the window on
// an axis at any scale is left out of that axis and overhangs.
//
// R-403, the same day: *"All of the examples fail to Zoom to fit. Of them, Net1 is the closest to
// right, and Basic is magnitudes from right."* The second cause: lettering and map furniture (the
// legend, the scale bar, data labels) are a fixed size in PIXELS, so on a 360-412 px map the room the
// fit made for them shrank every network to 19-65% of the map. On a phone that room is now capped at
// a tenth of the network's own lettering-free fit (LPN_FIT_NETWORK_SHARE).
//
// "Right" (the coordinator's definition): the network's own extent -- node centres, not lettering --
// fills most of the map's binding side with a small margin.
//
// Measured in real Chrome, after a Zoom to fit press:
//   1. Every gallery example, at 360 x 800, 390 x 844 and 412 x 915 (touch, device ratio 2.625):
//      the network fills at least 65% of the map on its binding side (measured 70-79%; 1-60%
//      before), and every node is on the map.
//   2. At 1440 x 900 nothing changes: every example fits at the scale it did before.
//
//   node dev/lpn-spike/phone-fit-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PHONEFIT_BROWSER_LOCKED';
const NAME = 'phone-fit-browser-harness';

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

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function fitAndMeasure(a) {
	// The Zoom to fit button, found by its tool rather than by its face: on a phone the toolbar can
	// fold it out of sight, and the press is the same function either way.
	const hit = await a.page.evaluate(() => {
		const b = document.querySelector('#lpn_toolbar button[data-tool="zoom-window"]');
		if (b) { b.click(); }
		return !!b;
	});
	if (!hit) { throw new Error('no Zoom to fit button'); }
	await a.settle(1200);
	return a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas'), r = svg.getBoundingClientRect();
		const m = /scale\(([^)]+)\)/.exec(svg.querySelector('g').getAttribute('transform') || '');
		// Node centres only: the network's own extent, never its lettering.
		const c = [...svg.querySelectorAll('.lpn-symbols .lpn-node')].map((e) => e.getBoundingClientRect())
			.filter((b) => b.width || b.height).map((b) => [b.left + b.width / 2, b.top + b.height / 2]);
		const xs = c.map((p) => p[0]), ys = c.map((p) => p[1]);
		const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
		const off = c.filter((p) => p[0] < r.left || p[0] > r.right || p[1] < r.top || p[1] > r.bottom).length;
		return { w: r.width, h: r.height, s: m ? +m[1] : null, nodes: c.length, off,
			fill: Math.max(w / r.width, h / r.height) };
	});
}

async function one(Session, browser, extra, key, tag) {
	const a = await Session.open(browser, NAME, extra);
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang(key));
		await a.settle(1200);
		const m = await fitAndMeasure(a);
		const m2 = await fitAndMeasure(a);
		m.again = m2.s;
		m.errors = a.errors.length;
		return m;
	} finally {
		await a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	const phone = (w, h) => ({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.625 });
	const EXAMPLES = ['lpn_ex_net3_si_title', 'lpn_ex_net3_title', 'lpn_ex_net2_si_title', 'lpn_ex_net2_title',
		'lpn_ex_elm_street_title', 'lpn_ex_net1_si_title', 'lpn_ex_net1_title', 'lpn_ex_basic_si_title',
		'lpn_ex_basic_us_title'];
	// The 1440 x 900 fit of each example before R-403, which a desktop must keep. Elm Street's was
	// 1.265734716274574 until Task 807 (leader-keep) kept its 14 dragged labels on their own side,
	// nearer their nodes; less lettering to frame, so the fit closes in. Checked by screenshot.
	// Net3 (both twins) was 8110.764038908496 / 8181.520385005933, in degrees, until Task 826 put them on California zone 3; before that, in gpm, until Task 734/812
	// (feat/label-form): its one-line node labels at the network's edge are lettering to frame too,
	// and there the fit closes in a little.
	const DESK = {
		lpn_ex_net3_si_title: 0.09285952936161293, lpn_ex_net3_title: 0.02719966817844265,
		lpn_ex_net2_si_title: 0.1722048547892766, lpn_ex_net2_title: 0.052488039708116024,
		lpn_ex_elm_street_title: 1.4334291332773326, lpn_ex_net1_si_title: 26.1141072219296,
		lpn_ex_net1_title: 7.959579890262752, lpn_ex_basic_si_title: 0.8257611638584945,
		lpn_ex_basic_us_title: 0.825466326020089
	};
	try {
		for (const [w, h] of [[360, 800], [390, 844], [412, 915]]) {
			const tag = w + ' x ' + h + ' phone';
			console.log('\n--- ' + tag + ' ---');
			for (const key of EXAMPLES) {
				const m = await one(Session, browser, phone(w, h), key, tag);
				const k = w + ', ' + key.replace(/^lpn_ex_|_title$/g, '');
				ok(k + ': the network fills most of the map', m.fill >= 0.65, m.fill.toFixed(3));
				ok(k + ': every node is on the map', m.nodes > 0 && m.off === 0, m.off + ' of ' + m.nodes + ' off');
				ok(k + ': a second press lands at the same scale', Math.abs(m.again / m.s - 1) < 1e-6, m.s + ' / ' + m.again);
				ok(k + ': no uncaught page errors', m.errors === 0);
			}
		}
		console.log('\n--- 1440 desktop: unchanged ---');
		for (const key of EXAMPLES) {
			const m = await one(Session, browser, { viewport: { width: 1440, height: 900 } }, key, 'desk');
			ok('1440, ' + key.replace(/^lpn_ex_|_title$/g, '') + ': the fit is the one it was before',
				Math.abs(m.s / DESK[key] - 1) < 0.01, m.s + ' vs ' + DESK[key]);
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
