// A LABEL HIDDEN FOR A CROSSING MUST STILL CROSS SOMETHING IN THE DRAWING THE READER SEES (ROADMAP Task 812,
// Tom, 2026-11-09: N161 on Novato had no label, "this one would not cross other labels"). Run with:
//   node dev/lpn-spike/label-crossing-final-browser-harness.js
// The crossing hide used to be decided on the stacked placements, and the one-line trial then moved the
// label it had crossed to a line: N161 stayed hidden for a crossing that no longer existed. Novato at the
// wheel's notches 0 to 16 (three scales each, as label-open-side-browser-harness.js does). ASSERTED: every
// node or pipe label hidden for a crossing is in a flagged pair in the final drawing, and N161 shows at
// 9 notches; N163 and N164 draw a short leader at 5 to 14 notches (ambiguousShortLeaders()). OPEN_SIDE_NOTCHES=9 narrows it.
// ALSO: no drawn leader runs through a row of another label (dropStruckLeaders()), counted on the glyph rows
// as drawn, over Novato at every notch asked and Net3 at 3 to 12 notches from its fit (master: none).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CROSS_FINAL_BROWSER_LOCKED';
const NAME = 'label-crossing-final-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
		stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
	});
	if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
	if (r.status === 75) { console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s.'); process.exit(1); }
	process.exit(r.status === null ? 1 : r.status);
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');
const FILE = 'dev/water-network-examples/Net3-Novato-CA-World.lwn';
const NOTCHES = (process.env.OPEN_SIDE_NOTCHES || '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16').split(',').map(Number);
const JITTER = [1, 1.011, 0.989];
const FIT_SCALE = 0.03228277098338891;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: { width: 1920, height: 1000 } });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.page.route(/\/js\/looped-network\.js/, async (route) => {
			const resp = await route.fetch();
			let body = await resp.text();
			if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
			await route.fulfill({ response: resp, body: body });
		});
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		const proj = JSON.parse(fs.readFileSync(path.join(REPO, FILE), 'utf8'));
		proj.settings = Object.assign({}, proj.settings, { labelMaxWidth: null });
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); }, JSON.stringify(proj));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
		await a.page.evaluate(() => window.__lpnForm.fields(['id', 'demand', 'elev', 'head', 'pressure'], ['id', 'flow', 'velocity']));
		await a.settle(2000);
		await a.page.evaluate(() => { window.__lpnForm.fit(); window.__lpnForm.centerOn('163'); });
		await a.settle(2000);
		let bad = [], hid = 0, n161 = null, views = 0, noLead = [], strikes = [];
		for (const k of NOTCHES) {
			for (const j of JITTER) {
				await a.page.evaluate(([f, z]) => { window.__lpnForm.viewAt('163', f * Math.pow(1.1, z)); window.__lpnForm.content(); }, [FIT_SCALE * j, k]);
				await a.settle(1200);
				const r = await a.page.evaluate(() => window.__lpnForm.hiddenCrossedAudit());
				views++; hid += r.hidden.length;
				(await a.page.evaluate(() => window.__lpnForm.leaderStrikes())).forEach((t) => strikes.push('Novato@' + k + 'x' + j + ' ' + t));
				r.unjustified.forEach((id) => bad.push(id + '@' + k + 'x' + j));
				if (k === 9 && j === 1) { n161 = r.forms['161']; }
				if (k >= 5 && k <= 14 && j === 1) {
					const ld = await a.page.evaluate(() => window.__lpnForm.nodeLeaders(['163', '164']));
					['163', '164'].forEach((id) => { if (!ld[id]) { noLead.push('N' + id + '@' + k); } });
				}
			}
		}
		ok('no page errors', !a.errors.length, (a.errors[0] || '').slice(0, 200));
		ok('every label hidden for a crossing crosses something in the final drawing (' + hid + ' hides over ' + views + ' views)', bad.length === 0, bad.join(' '));
		ok('N163 and N164 draw a short leader (another node stands as near their rows) at 5 to 14 notches', noLead.length === 0, noLead.join(' '));
		ok('no leader runs through another label on Novato (' + views + ' views)', strikes.length === 0, strikes.join('; '));
		if (NOTCHES.indexOf(9) >= 0) { ok('9 notches: N161 shows', /^(line|stack)/.test(n161), String(n161)); }
		// Net3, desktop: the same count, 3 to 12 notches out from its fit.
		{
			const net = JSON.parse(fs.readFileSync(path.join(REPO, 'dev/water-network-examples/Net3.lwn'), 'utf8'));
			net.settings = Object.assign({}, net.settings, { labelMaxWidth: null });
			await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); }, JSON.stringify(net));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
			await a.page.evaluate(() => window.__lpnForm.fields(['id', 'demand', 'elev', 'head', 'pressure'], ['id', 'flow', 'velocity']));
			await a.settle(1500);
			await a.page.evaluate(() => window.__lpnForm.fit());
			await a.settle(1500);
			const fitS = await a.page.evaluate(() => window.__lpnForm.scale());
			const centre = await a.page.evaluate(() => window.__lpnForm.ev("(function(){var r=svg.getBoundingClientRect(),c=screenToWorld(r.left+r.width/2,r.top+r.height/2),b=null,bd=1e99;doc.nodes.forEach(function(n){var p=nodeAt(n),d=Math.hypot(p.x-c.x,p.y-c.y);if(d<bd){bd=d;b=n.id;}});return b;}())"));
			const netStrikes = [];
			for (let k = 3; k <= 12; k++) {
				await a.page.evaluate(([id, z]) => { window.__lpnForm.viewAt(id, z); window.__lpnForm.content(); }, [centre, fitS * Math.pow(1.1, k)]);
				await a.settle(1000);
				(await a.page.evaluate(() => window.__lpnForm.leaderStrikes())).forEach((t) => netStrikes.push('Net3@' + k + ' ' + t));
			}
			ok('no leader runs through another label on Net3 at 3 to 12 notches', netStrikes.length === 0, netStrikes.join('; '));
		}
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
