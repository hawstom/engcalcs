// A LEGEND DOES NOT COVER THE NETWORK ON A PHONE, THE MOMENT AN EXAMPLE OPENS (Task 851). Perry, the
// pre-reviewer, 2026-10-30, every theme at 390 x 844: on the Net1 example the Labels legend lay over
// the "Tank" label and the top of its pipe.
//
// Two causes, both measured:
//   1. A gallery example carries the view its author framed on a desktop (a centre and a scale in
//      pixels per drawing unit). On a map a quarter as wide that view crops the network (Net1's
//      east and west ends ran off the map) and leaves the legend over lettering. openExample() now
//      drops the saved view on a small screen, so the opening view is the same fit Zoom to fit gives.
//   2. That fit's phone cap (R-403, LPN_FIT_NETWORK_SHARE) gave up the room the settle had reserved
//      for the legend on every axis. It now keeps the reserved edge on an axis where the network
//      still fits inside it at the cap's scale (Net1 has 8% to spare in height).
//
// Measured in real Chrome, with no Zoom to fit press, on the opening view:
//   1. Net1 (both unit twins) and Elm Street, at 360 x 800, 390 x 844 and 412 x 915 (touch): no
//      lettering and no node lies under a visible legend.
//   2. Every example, at the same sizes: every node is on the map and the network fills at least
//      65% of it on its binding side (the saved desktop view cropped it).
//   3. At 1440 x 900 nothing changes: Net1 opens at the scale its file stores.
//
//   node dev/lpn-spike/phone-legend-clear-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PHONELEGEND_BROWSER_LOCKED';
const NAME = 'phone-legend-clear-browser-harness';

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

// The opening view, with no press: what a visitor sees the moment the card is clicked.
async function measure(a) {
	return a.page.evaluate(() => {
		const R = (e) => e.getBoundingClientRect();
		const legends = ['lpn_labels_legend', 'lpn_color_legend'].map((id) => document.getElementById(id))
			.filter((e) => e && getComputedStyle(e).display !== 'none').map(R).filter((b) => b.width && b.height);
		const under = (b) => legends.some((l) => Math.min(b.right, l.right) - Math.max(b.left, l.left) > 1 &&
			Math.min(b.bottom, l.bottom) - Math.max(b.top, l.top) > 1);
		const svg = document.getElementById('lpn_canvas'), r = R(svg);
		const covered = [];
		svg.querySelectorAll('text').forEach((t) => {
			if (!t.textContent.trim()) { return; }
			const cs = getComputedStyle(t);
			if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { return; }
			const b = R(t);
			if ((b.width || b.height) && under(b)) { covered.push(t.textContent.trim().slice(0, 14)); }
		});
		const centres = [...svg.querySelectorAll('.lpn-symbols .lpn-node')].map(R).filter((b) => b.width || b.height)
			.map((b) => ({ x: b.left + b.width / 2, y: b.top + b.height / 2 }));
		const xs = centres.map((p) => p.x), ys = centres.map((p) => p.y);
		const m = /scale\(([^)]+)\)/.exec(svg.querySelector('g').getAttribute('transform') || '');
		return {
			legends: legends.length, covered,
			nodesUnder: centres.filter((p) => under({ left: p.x, right: p.x, top: p.y, bottom: p.y })).length,
			nodes: centres.length,
			off: centres.filter((p) => p.x < r.left || p.x > r.right || p.y < r.top || p.y > r.bottom).length,
			fill: Math.max((Math.max(...xs) - Math.min(...xs)) / r.width, (Math.max(...ys) - Math.min(...ys)) / r.height),
			s: m ? +m[1] : null
		};
	});
}

async function one(Session, browser, extra, key) {
	const a = await Session.open(browser, NAME, extra);
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang(key));
		await a.settle(1500);
		const m = await measure(a);
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
	const ALL = ['lpn_ex_net3_si_title', 'lpn_ex_net3_title', 'lpn_ex_net2_si_title', 'lpn_ex_net2_title',
		'lpn_ex_elm_street_title', 'lpn_ex_net1_si_title', 'lpn_ex_net1_title'];
	const CLEAR = ['lpn_ex_net1_si_title', 'lpn_ex_net1_title', 'lpn_ex_elm_street_title'];
	const short = (k) => k.replace(/^lpn_ex_|_title$/g, '');
	try {
		for (const [w, h] of [[360, 800], [390, 844], [412, 915]]) {
			console.log('\n--- ' + w + ' x ' + h + ' phone ---');
			for (const key of ALL) {
				const m = await one(Session, browser, phone(w, h), key);
				const k = w + ', ' + short(key);
				if (CLEAR.includes(key)) {
					ok(k + ': a legend is showing (the test means something)', m.legends > 0);
					ok(k + ': no lettering under a legend', m.covered.length === 0, m.covered.join(' | '));
					ok(k + ': no node under a legend', m.nodesUnder === 0, m.nodesUnder + ' of ' + m.nodes);
				}
				ok(k + ': every node is on the map', m.nodes > 0 && m.off === 0, m.off + ' of ' + m.nodes + ' off');
				ok(k + ': the network fills most of the map', m.fill >= 0.65, m.fill.toFixed(3));
				ok(k + ': no uncaught page errors', m.errors === 0);
			}
		}
		console.log('\n--- 1440 desktop: Net1 opens at the view its file stores ---');
		for (const [key, file] of [['lpn_ex_net1_title', 'Net1-Scenarios.lwn'], ['lpn_ex_net1_si_title', 'Net1-Scenarios-SI.lwn']]) {
			const want = JSON.parse(fs.readFileSync(path.join(REPO, 'examples', file), 'utf8')).view.s;
			const m = await one(Session, browser, { viewport: { width: 1440, height: 900 } }, key);
			ok('1440, ' + short(key) + ': the stored view is kept', Math.abs(m.s / want - 1) < 1e-6, m.s + ' vs ' + want);
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
