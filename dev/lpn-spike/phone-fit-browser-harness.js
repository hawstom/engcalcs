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
// Measured in real Chrome, after a Zoom to fit press:
//   1. On a phone (412 x 915 and 360 x 740, touch) both Basic examples fill a fair share of the
//      map's width with the network, and every node is on the map.
//   2. At 1440 x 900 nothing changes: the fit is the one it was before (scale 0.8258 / 0.8255).
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

// Both Basic examples span 1,400 drawing units east-west (x 4300 to 5700).
const BASIC_SPAN_X = 1400;

async function fitAndMeasure(a) {
	// The Zoom to fit button, found by its tool rather than by its face: on a phone the toolbar can
	// fold it out of sight, and the press is the same function either way.
	const hit = await a.page.evaluate(() => {
		const b = document.querySelector('#lpn_toolbar button[data-tool="zoom-window"]');
		if (b) { b.click(); }
		return !!b;
	});
	if (!hit) { throw new Error('no Zoom to fit button'); }
	await a.settle(900);
	return a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas'), r = svg.getBoundingClientRect();
		const m = /scale\(([^)]+)\)/.exec(svg.querySelector('g').getAttribute('transform') || '');
		const syms = [...svg.querySelectorAll('.lpn-symbols > *:not(.lpn-node-hit)')].map((e) => e.getBoundingClientRect())
			.filter((b) => b.width || b.height);
		const off = syms.filter((b) => b.left + b.width / 2 < r.left || b.left + b.width / 2 > r.right ||
			b.top + b.height / 2 < r.top || b.top + b.height / 2 > r.bottom).length;
		return { w: r.width, h: r.height, s: m ? +m[1] : null, nodes: syms.length, off };
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
		m.share = m.s * BASIC_SPAN_X / m.w;
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
	const phone = (w, h) => ({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.6 });
	try {
		for (const [extra, tag] of [[phone(412, 915), '412 phone'], [phone(360, 740), '360 phone']]) {
			console.log('\n--- ' + tag + ' ---');
			for (const key of ['lpn_ex_basic_si_title', 'lpn_ex_basic_us_title']) {
				const m = await one(Session, browser, extra, key, tag);
				const k = tag + ', ' + key;
				console.log('  ' + JSON.stringify(m));
				// Measured after the fix: 0.42 / 0.55 at 412, 0.34 / 0.50 at 360. Broken, it was 0.003.
				// The rest of the width is lettering, which on a phone is a big share of a small map.
				ok(k + ': the network spans at least a quarter of the map', m.share >= 0.25, m.share.toFixed(3));
				ok(k + ': every node is on the map', m.nodes > 0 && m.off === 0, m.off + ' of ' + m.nodes + ' off');
				ok(k + ': a second press lands at the same scale', Math.abs(m.again / m.s - 1) < 1e-6, m.s + ' / ' + m.again);
				ok(k + ': no uncaught page errors', m.errors === 0);
			}
		}
		console.log('\n--- 1440 desktop: unchanged ---');
		for (const [key, was] of [['lpn_ex_basic_si_title', 0.8257611638584945], ['lpn_ex_basic_us_title', 0.825466326020089]]) {
			const m = await one(Session, browser, { viewport: { width: 1440, height: 900 } }, key, 'desk');
			console.log('  ' + JSON.stringify(m));
			ok('1440, ' + key + ': the fit is the one it was before this fix', Math.abs(m.s / was - 1) < 0.01,
				m.s + ' vs ' + was);
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
