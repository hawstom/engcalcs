// THE CHEAPER LABEL PASS DRAWS THE SAME LABELS (ROADMAP Task 681(b)), in a real Chromium, with real
// fonts. Run with:
//   node dev/lpn-spike/label-pass-economy-browser-harness.js
//
// **WHAT CHANGED.** The link labels' length cascade (shedToSegmentBatch() in js/looped-network.js)
// used to draw and measure every rung, one forced layout of the whole drawing per rung; now a rung
// whose priced run is certain to be too long (shedRungsCertain()) is passed over and only the rungs
// that could stop the cascade are drawn. And the side test's nearest-pipe search
// (nearestSegmentDistance() in js/lpn-geom.js) cuts each ring to the grid before walking it.
//
// **WHAT MUST NOT CHANGE: A SINGLE LABEL.** The rung skip leans on a measured bound -- shedWidthFor()'s
// bearing error, 1.8% worst -- and that is a fact about a browser's fonts, which the node stub's
// six-pixels-a-character measure cannot test. So each drawing is laid out twice in Chromium: as
// shipped, and with the skip switched off by rewriting its threshold on the way to the browser (the
// served file is otherwise byte for byte the shipped one). Every label element on the canvas -- text,
// rows, leader, visibility -- must serialise identically, on Net1, Net3 and Net3 on the world map
// near Novato, every node and link label field on, at the opening view and after three wheel
// bursts. And the shipped run must take FEWER text measurements (getBBox) than the reference on the
// drawing whose pipes shed, or the skip is not doing anything and the comparison proves nothing.
// (The ring change is held exactly against a brute-force search by aligned-side-index-harness.js.)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_ECONOMY_BROWSER_LOCKED';
const NAME = 'label-pass-economy-browser-harness';

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

// The skip's threshold, as shipped; the reference run serves the same file with it set so that no
// rung is ever certain, which is the cascade as it was before.
const SKIP_SHIPPED = 'var SHED_SKIP_REL = 0.06,';
const SKIP_OFF = 'var SHED_SKIP_REL = Infinity,';

const NODE_FIELDS = ['id', 'desc', 'tag', 'demand', 'elev', 'initQuality', 'demandActual', 'level', 'head', 'pressure', 'quality'];
const LINK_FIELDS = ['id', 'desc', 'tag', 'length', 'diameter', 'roughness', 'km', 'initStatus', 'bulkCoeff', 'wallCoeff',
	'flow', 'velocity', 'headloss', 'gradient', 'friction', 'rate', 'quality', 'status'];
const NETWORKS = ['Net1.lwn', 'Net3.lwn', 'Net3-Novato-CA-World.lwn'];
// Wheel notches between snapshots: the opening view, three in, three more in, three back out.
const STEPS = [0, -3, -3, 3];

function projectText(file) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', file), 'utf8'));
	// The file's labeling threshold hides every label at these views (Novato's is 65000).
	d.settings = Object.assign({}, d.settings, { labelMaxWidth: null });
	d.labelSettings = d.labelSettings || {};
	d.labelSettings.node = {}; NODE_FIELDS.forEach((k) => { d.labelSettings.node[k] = true; });
	d.labelSettings.link = {}; LINK_FIELDS.forEach((k) => { d.labelSettings.link[k] = true; });
	return JSON.stringify(d);
}

// Every element in the layers that hold label text, as drawn: hidden ones as hidden and nothing more.
function drawn(page) {
	return page.evaluate(() => {
		const out = [], layers = new Set();
		document.querySelectorAll('#lpn_canvas text').forEach((t) => layers.add(t.parentNode));
		layers.forEach((g) => Array.from(g.children).forEach((e) => {
			if (e.tagName === 'image') { return; }
			const cs = getComputedStyle(e);
			out.push((cs.display === 'none' || cs.visibility === 'hidden') ? '<' + e.tagName + ' hidden>' : e.outerHTML);
		}));
		return out;
	});
}

async function layOut(Session, browser, file, skipOn) {
	// **SERVICE WORKERS BLOCKED**: a page served from the worker's cache never reaches page.route(),
	// so the reference run would quietly be the shipped one and every comparison would pass.
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	// Counts every text measurement the page takes, from before its first script runs.
	await a.context.addInitScript(() => {
		window.__bboxCalls = 0;
		const real = SVGGraphicsElement.prototype.getBBox;
		SVGGraphicsElement.prototype.getBBox = function () { window.__bboxCalls++; return real.apply(this, arguments); };
	});
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	let rewritten = 0, fetched = 0;
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		fetched++;
		const resp = await route.fetch();
		let body = await resp.text();
		if (!skipOn) {
			const n = body.split(SKIP_SHIPPED).length - 1;
			body = body.split(SKIP_SHIPPED).join(SKIP_OFF);
			rewritten += n;
		}
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_economy', txt); }, projectText(file));
		await a.reload();
		ok('  (' + (skipOn ? 'shipped' : 'reference') + ') the page script came through the rewrite on both loads', fetched === 2, 'fetched ' + fetched);
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		const r = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_canvas').getBoundingClientRect();
			return { x: b.left + b.width / 2 + 37, y: b.top + b.height / 2 - 23 };
		});
		const views = [];
		for (const n of STEPS) {
			await a.page.mouse.move(r.x, r.y);
			for (let k = 0; k < Math.abs(n); k++) { await a.page.mouse.wheel(0, n < 0 ? -100 : 100); await a.page.waitForTimeout(60); }
			await a.settle(2000);
			views.push(await drawn(a.page));
		}
		const bbox = await a.page.evaluate(() => window.__bboxCalls);
		return { views, bbox, rewritten, errors: a.errors.slice() };
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
	try {
		const src = fs.readFileSync(path.join(REPO, 'js', 'looped-network.js'), 'utf8');
		ok('the skip threshold is where the reference run expects it', src.split(SKIP_SHIPPED).length === 2);
		let fewer = false;
		for (const file of NETWORKS) {
			console.log('=== ' + file + ' ===');
			const ship = await layOut(Session, browser, file, true);
			const ref = await layOut(Session, browser, file, false);
			ok('the reference run really served the cascade without the skip', ref.rewritten === 2, 'rewritten ' + ref.rewritten);
			ok('no page errors', !ship.errors.length && !ref.errors.length, (ship.errors.concat(ref.errors)[0] || '').slice(0, 200));
			STEPS.forEach((n, i) => {
				const A = ship.views[i], B = ref.views[i];
				const shown = A.filter((s) => s.indexOf('<text') === 0).length;
				let firstDiff = -1;
				for (let k = 0; k < Math.max(A.length, B.length); k++) { if (A[k] !== B[k]) { firstDiff = k; break; } }
				ok('view ' + i + ' (' + (i ? (n < 0 ? n + ' notches in' : n + ' notches out') : 'opening') + '): every label drawn identically',
					firstDiff < 0 && A.length > 0, shown + ' texts shown of ' + A.length + ' elements' +
					(firstDiff < 0 ? '' : '; first difference at element ' + firstDiff + ': ' + String(A[firstDiff]).slice(0, 160) + '  vs  ' + String(B[firstDiff]).slice(0, 160)));
			});
			console.log('        text measurements (getBBox): shipped ' + ship.bbox + ', without the skip ' + ref.bbox);
			if (ship.bbox < ref.bbox) { fewer = true; }
			ok('the skip never measures MORE than the cascade without it', ship.bbox <= ref.bbox);
		}
		ok('on at least one drawing the skip took fewer measurements, so the comparison above tested something', fewer);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
