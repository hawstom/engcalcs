// A LABEL TAKES WHICHEVER FORM SHOWS MORE (ROADMAP Tasks 734 and 812), in a real Chromium, at real
// wheel notches, read off the drawing. Run with:
//   node dev/lpn-spike/label-form-wheel-browser-harness.js
//   LABEL_FORM_REF=master node dev/lpn-spike/label-form-wheel-browser-harness.js   (also lays out a
//       git ref's js/looped-network.js and js/lpn-collide.js, and prints its counts beside ours)
//   LABEL_FORM_SHOTS=<dir>  saves a screenshot of each named label (Tom's test steps)
//
// Tom, 2026-10-18: *"I am interested in Node labels that go inline instead of stacked and pipe labels
// that go out on a leader inline or stacked."* Asked which form when both fit: *"Whichever shows
// more."* So a node label may be one line east or west of its node (tryInlineNodeLabels()), and a
// pipe label that cannot lie along its pipe goes out level on a leader, from its pipe's middle or
// the nearest clear station, as one line or a stack, with as many of its values as fit
// (placeLevelPipeLabels()).
//
// THE SCENES, opened the way Tom opens them (the gallery card, or the 600-junction file and Zoom to
// fit), labels set as a Labels checkbox sets them, then wheel notches over the middle of the map:
//   * Net3 (gallery, gpm): node ID, P, Qb, Z; link ID, Q, V; 6 and 9 notches in (its labels show
//     from 6);
//   * the 600-junction downtown network: the same fields; fit, and 6 notches in;
//   * Net1 (gallery, US, N and L prefixes): node ID, Qb, Z, P; link Q; wheeled OUT until the short
//     pipe 113 on the east side is about 54 px long -- Tom's 2026-10-18 screenshot, where that
//     pipe showed no label with open ground east of it.
// Each is laid out as shipped and as the REFERENCE: the same file with the forms cut out on the way
// to the browser (no one-line node trial, no other forms or stations for a level label, a level
// label's leader at the ordinary threshold), which is feat/label-beside's placement.
//
// READ OFF THE DRAWING, IN WORLD UNITS, FROM THE GLYPHS: each row of each shown label is its tspans'
// own box (getBBox()), turned by the text's rotation; a node symbol is its circle. Asserted:
//   * N1 = 0: no two shown labels' rows overlap, and no row covers a node symbol or a Text item,
//     deeper than 1.5 screen px (on both axes of the pair);
//   * N3 = 0 for the leaders this work draws (a level pipe label's, a one-line node label's): none
//     passes within a node symbol, deeper than 1.5 px (master's own node-label leaders through a
//     symbol are counted and printed, not asserted);
//   * every level pipe label drawn with no leader is nearer its own pipe than any other by 3 px
//     (pre-review, 2026-10-18: "Q=422.6" between two pipes);
//   * the same view twice is the same drawing: a content pass at the final notch reproduces every
//     label (to a quarter pixel), and the per-notch bank puts a revisited notch back exactly;
//   * the forms are on the drawing: one-line node labels on Net3, level pipe labels on a leader as
//     one line and as stacks with more than one value, on Net3 and on the 600-junction network;
//     and the reference shows none of them, so the assertions fail on feat/label-beside and master;
//   * no fewer labels shown than the reference, and more values;
//   * Net1: pipe 113's label is shown, level, on a leader.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_FORM_WHEEL_LOCKED';
const NAME = 'label-form-wheel-browser-harness';

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

// The cuts that make the reference. Each must be found exactly once, or the harness says so.
const CUTS = [
	["placed = perfDebugAccum('  ns:inline', function () { return tryInlineNodeLabels(nodeLabels, placed, obs, pad, fsNow, byId, nodeOf); });", ''],
	['if (f.length) { sp.forms = f; }', ''],
	['LPN_LEVEL_STATIONS.forEach(function (a) {', '[].forEach(function (a) {'],
	['function levelLeaderMin() { return effectiveFontSize() * LPN_LEVEL_LEADER_FRAC; }', 'function levelLeaderMin() { return leaderThreshold(); }']
];
const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');

const NET3_NODE = ['id', 'pressure', 'demand', 'elev'], NET3_LINK = ['id', 'flow', 'velocity'];
const SCENES = [
	{ key: 'net3', name: 'Net3 (gallery, gpm)', cardKey: 'lpn_ex_net3_title', node: NET3_NODE, link: NET3_LINK, notches: [6, 9],
		named: [] },
	{ key: 'n600', name: '600-junction downtown', file: 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn', fit: true,
		node: NET3_NODE, link: NET3_LINK, notches: [0, 6], named: [] },
	// Net1 wheeled OUT one notch at a time from the card's view, settling at each (Perry's path, and
	// Tom's: his 2026-10-18 screenshot is 14 notches out, where pipe 113 showed no label with open
	// ground east of it). At 4 out, pipe 11's label is shown and pipe 10's does not sit nearer pipe
	// 111 than its own.
	{ key: 'net1', name: 'Net1 (gallery, US), wheeled out', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'],
		link: ['flow'], step: true, notches: [-4, -14], named: ['113'], shotAt: -14,
		at: { notch: -4, shown: ['11'], ownNearest: ['10'] } },
	{ key: 'phone', name: 'Net3 (gallery, gpm) on a 390 px phone', cardKey: 'lpn_ex_net3_title', node: NET3_NODE, link: NET3_LINK,
		notches: [3, 6], named: [], viewport: { width: 390, height: 844 } }
].filter((sc) => (process.env.LABEL_FORM_SCENES || 'net3,net1,phone').split(',').indexOf(sc.key) >= 0);
// The trial's call, made switchable in the page so the same view can be laid out stacked-only for
// the per-label node comparison without a second session.
const TRIAL = "placed = perfDebugAccum('  ns:inline', function () { return tryInlineNodeLabels(nodeLabels, placed, obs, pad, fsNow, byId, nodeOf); });";
const TOL_PX = 1.5, AMBIG_PX = 3;

async function wheel(page, n) {
	const step = n > 0 ? -100 : 100;
	for (let i = 0; i < Math.abs(n); i++) { await page.mouse.wheel(0, step); await page.waitForTimeout(40); }
}

function refSource(ref, file) {
	return execFileSync('git', ['-C', REPO, 'show', ref + ':js/' + file], { encoding: 'utf8', maxBuffer: 64 << 20 });
}

async function layOut(Session, browser, sc, mode, opts) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: sc.viewport || { width: 1920, height: 1000 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	let cut = 0, hooked = 0;
	await a.page.route(/\/js\/(looped-network|lpn-collide)\.js/, async (route) => {
		const resp = await route.fetch();
		const file = /lpn-collide\.js/.test(route.request().url()) ? 'lpn-collide.js' : 'looped-network.js';
		let body = mode.ref ? refSource(mode.ref, file) : await resp.text();
		if (file === 'looped-network.js') {
			if (mode.cut) {
				CUTS.forEach(([from, to]) => { if (body.split(from).length === 2) { body = body.replace(from, to); cut++; } });
			}
			if (!mode.cut && body.split(TRIAL).length === 2) { body = body.replace(TRIAL, 'if (!window.__lpnNoInline) { ' + TRIAL + ' }'); }
			if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); hooked++; }
		}
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		if (sc.cardKey) {
			await a.openExampleCard(await a.lang(sc.cardKey));
		} else {
			await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); },
				fs.readFileSync(path.join(REPO, sc.file), 'utf8'));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		}
		await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
		await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [sc.node, sc.link]);
		await a.settle(2000);
		if (sc.fit) { await a.page.evaluate(() => window.__lpnForm.fit()); await a.settle(2000); }
		const mid = await a.page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await a.page.mouse.move(mid.x, mid.y);
		let out = 0;
		if (sc.outToPipe) {
			// Wheeled out until the named pipe is about the stated length on screen, as in Tom's shot.
			const len = await a.page.evaluate((id) => window.__lpnForm.pipePx(id), sc.outToPipe.id);
			out = Math.max(0, Math.round(Math.log(len / sc.outToPipe.px) / Math.log(1.1)));
			await wheel(a.page, -out);
			await a.settle(1500);
		}
		const views = [], shotAt = sc.shotAt !== undefined ? sc.shotAt : sc.notches[sc.notches.length - 1];
		let at = 0, named = {};
		for (const k of sc.notches) {
			if (sc.step) {
				for (let i = 0; i < Math.abs(k - at); i++) { await wheel(a.page, k > at ? 1 : -1); await a.settle(900); }
			} else { await wheel(a.page, k - at); }
			at = k;
			await a.settle(1500);
			const v = await a.page.evaluate(([tol, amb]) => window.__lpnForm.read(tol, amb), [TOL_PX, AMBIG_PX]);
			v.notch = k;
			if (k === shotAt) {
				// The named labels and Tom's screenshots, as he meets them: laid out by the wheel's own pass.
				named = await a.page.evaluate((ids) => window.__lpnForm.named(ids), sc.named);
				if (opts && opts.shots && mode.shipped) {
					fs.mkdirSync(opts.shots, { recursive: true });
					await a.page.screenshot({ path: path.join(opts.shots, sc.key + '-' + (k < 0 ? -k + '-out' : k + '-in') + '.png') });
					for (const nm of (opts.clips && opts.clips[sc.key]) || []) {
						const r = await a.page.evaluate((id) => window.__lpnForm.clipOf(id), nm);
						if (r) { await a.page.screenshot({ path: path.join(opts.shots, sc.key + '-' + nm.replace(/[^A-Za-z0-9]+/g, '') + '.png'), clip: r }); }
					}
				}
			}
			// The same view with no one-line node form (a content pass with the trial switched off),
			// then the trial back on and the view laid out again as it was.
			if (mode.shipped) {
				v.stacked = await a.page.evaluate(([tol, amb]) => { window.__lpnNoInline = true; window.__lpnForm.content();
					const r = window.__lpnForm.read(tol, amb); window.__lpnNoInline = false; window.__lpnForm.content(); return r; }, [TOL_PX, AMBIG_PX]);
			}
			views.push(v);
		}
		if (!mode.shipped) {
			const ms0 = await a.page.evaluate(() => window.__lpnForm.timeContent(3));
			return { views, ms: ms0, named, out, cut, hooked, errors: a.errors.slice() };
		}
		// The same view twice: a content pass where we stand, then out two notches and back in two.
		const again = await a.page.evaluate(([tol, amb]) => { window.__lpnForm.content(); return window.__lpnForm.read(tol, amb); }, [TOL_PX, AMBIG_PX]);
		await wheel(a.page, -2); await a.settle(1200);
		await wheel(a.page, 2); await a.settle(1500);
		const back = await a.page.evaluate(([tol, amb]) => window.__lpnForm.read(tol, amb), [TOL_PX, AMBIG_PX]);
		// The content pass empties the bank, so the first revisit lays this notch out again at the
		// bank's own scale for the notch; the second revisit must put back exactly that.
		await wheel(a.page, -2); await a.settle(1200);
		await wheel(a.page, 2); await a.settle(1500);
		const back2 = await a.page.evaluate(([tol, amb]) => window.__lpnForm.read(tol, amb), [TOL_PX, AMBIG_PX]);
		// The content pass's own time at the last view, median of three, and the named labels.
		const ms = await a.page.evaluate(() => window.__lpnForm.timeContent(3));
		return { views, again, back, back2, ms, named, out, cut, hooked, errors: a.errors.slice() };
	} finally {
		await a.close();
	}
}

function firstDiff(a, b) {
	const x = a.split('\n'), y = b.split('\n');
	for (let i = 0; i < Math.max(x.length, y.length); i++) { if (x[i] !== y[i]) { return (x[i] || '-') + '  vs  ' + (y[i] || '-'); } }
	return '';
}
function row(v) {
	return `labels ${v.labels} (nodes ${v.nodes}: ${v.nodeInline} one line, ${v.nodeStacked} stacked; pipes ${v.pipes}: ${v.along} along, ` +
		`${v.level} level on a leader ${v.levelLeader}, ${v.levelInline} one line, ${v.levelStacked} stacked), values ${v.values}; ` +
		`N1 ${v.N1.length} (${v.N1mine.length} ours) N3 ${v.N3.length} (node-label leaders through a symbol ${v.N3node}) astray ${v.astray.length}, leadered nearer another pipe ${v.leaderNearOther}`;
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
	const shots = process.env.LABEL_FORM_SHOTS || '';
	const clips = process.env.LABEL_FORM_CLIPS ? JSON.parse(process.env.LABEL_FORM_CLIPS) : null;
	const refs = (process.env.LABEL_FORM_REF || '').split(',').filter(Boolean);
	try {
		const src = fs.readFileSync(path.join(REPO, 'js', 'looped-network.js'), 'utf8');
		ok('every cut the reference makes is found exactly once in the shipped file', CUTS.every(([f]) => src.split(f).length === 2));
		for (const sc of SCENES) {
			console.log('=== ' + sc.name + ' ===');
			const on = await layOut(Session, browser, sc, { shipped: true }, { shots, clips });
			const off = await layOut(Session, browser, sc, { cut: true });
			ok(sc.name + ': the hook reached the page both times, and the reference was served with every cut',
				on.hooked >= 1 && off.hooked >= 1 && off.cut > 0 && off.cut % CUTS.length === 0 && on.cut === 0, `cuts ${off.cut}`);
			ok(sc.name + ': no page errors', !on.errors.length && !off.errors.length, (on.errors.concat(off.errors)[0] || '').slice(0, 200));
			if (sc.outToPipe) { console.log(`        wheeled out ${on.out} notches from the card's opening view (pipe ${sc.outToPipe.id} about ${sc.outToPipe.px} px)`); }
			const extra = [];
			for (const ref of refs) { extra.push({ ref, r: await layOut(Session, browser, sc, { ref }) }); }
			on.views.forEach((v, i) => {
				const w = off.views[i];
				console.log(`        ${v.notch < 0 ? -v.notch + ' out' : v.notch + ' in'}: shipped   ${row(v)}`);
				console.log(`        ${' '.repeat(String(v.notch < 0 ? -v.notch + ' out' : v.notch + ' in').length)}  reference ${row(w)}`);
				extra.forEach((e) => console.log(`          ${e.ref.padEnd(9)} ${row(e.r.views[i])}`));
				console.log(`          e.g. one-line node labels ${v.ex.nodeInline.slice(0, 6).join(' ')}; leadered stacks ${v.ex.levelStacked.slice(0, 6).join(' ')}; leadered one-line ${v.ex.levelInline.slice(0, 6).join(' ')}`);
				const tag = sc.name + ', ' + (v.notch < 0 ? -v.notch + ' notches out' : v.notch + ' notches in');
				// N1 that the reference draws too is not this work's: hand-placed labels on Net1 (Tom's
				// screenshot: N10 and N11) and master's own node labels; it is printed in the row.
				ok(tag + ': N1 = 0 for level pipe labels and one-line node labels, and no more N1 than the reference', v.N1mine.length === 0 && v.N1.length <= w.N1.length,
					v.N1mine.slice(0, 3).join('; ') + (v.N1.length > w.N1.length ? ' all: ' + v.N1.slice(0, 3).join('; ') : ''));
				ok(tag + ': N3 = 0 for the leaders of level pipe labels and one-line node labels', v.N3.length === 0, v.N3.slice(0, 3).join('; '));
				// **NO NODE LABEL PAYS FOR A ONE-LINE FORM** (pre-review, 2026-10-18): against the same view
				// laid out with stacks only, every node label shown there is shown, with no fewer values,
				// and with its ID if it had it.
				const lossN = [];
				Object.keys(v.stacked.node).forEach((id) => {
					const x = v.stacked.node[id], y = v.node[id] || { n: 0, id: false };
					if (y.n < x.n || (x.id && !y.id)) { lossN.push('N' + id + ' ' + x.n + (x.id ? '+ID' : '') + ' -> ' + y.n + (y.id ? '+ID' : '')); }
				});
				ok(tag + ': no node label hidden, shortened or without its ID against the stacked layout of the same view', lossN.length === 0,
					lossN.length + (lossN.length ? ': ' + lossN.slice(0, 5).join('; ') : ''));
				ok(tag + ': no pipe runs through a one-line node label', v.struck.length === 0, v.struck.slice(0, 4).join('; '));
				ok(tag + ': no level label or one-line node label overlaps another label, by the rotated glyph boxes', v.N1mine0.length === 0, v.N1mine0.slice(0, 3).join('; '));
				ok(tag + ': every one-line node label lies within the map and off its legends', v.offView.length === 0, v.offView.slice(0, 4).join('; '));
				ok(tag + ': every level label with no leader is nearest its own pipe', v.astray.length === 0, v.astray.slice(0, 4).join(' '));
				ok(tag + ': no fewer labels than the reference, and no fewer values', v.labels >= w.labels && v.values >= w.values,
					`${w.labels} -> ${v.labels} labels, ${w.values} -> ${v.values} values`);
			});
			const A = on.views[on.views.length - 1];
			const sum = (vs, k) => vs.reduce((t, v) => t + v[k], 0);
			if (sc.at) {
				const va = on.views.find((v) => v.notch === sc.at.notch), tg = sc.name + ', ' + (-sc.at.notch) + ' notches out';
				sc.at.shown.forEach((id) => ok(tg + ': pipe ' + id + "'s label is shown", !!va.pipeShown[id]));
				sc.at.ownNearest.forEach((id) => ok(tg + ': pipe ' + id + "'s label, if level, is nearest its own pipe",
					!va.levelNear[id] || va.levelNear[id].own <= va.levelNear[id].other, JSON.stringify(va.levelNear[id] || 'along')));
			}
			ok(sc.name + ': the same view twice is the same drawing (a content pass where it stands)', on.again.sig === A.sig, firstDiff(A.sig, on.again.sig));
			ok(sc.name + ': ...and the per-notch bank puts the notch back exactly (out two and back in two, twice)', on.back2.sig === on.back.sig, firstDiff(on.back.sig, on.back2.sig));
			// Printed, not asserted: a label the wheel's pass did not re-measure is measured afresh by
			// the content pass, a tenth of a pixel different at this zoom, and the first-fit may then
			// settle a crowded corner another way (Net1 here: hand-placed N11 measured 53.0 against 53.1 px).
			console.log(`        first revisit against the first visit: ${on.back.sig === A.sig ? 'same' : 'differs: ' + firstDiff(A.sig, on.back.sig)}`);
			ok(sc.name + ': more values shown than the reference over its views', sum(on.views, 'values') > sum(off.views, 'values'),
				`${sum(off.views, 'values')} -> ${sum(on.views, 'values')}`);
			if (sc.key === 'net3') {
				ok(sc.name + ': one-line node labels are on the drawing, and the reference has none',
					sum(on.views, 'nodeInline') >= 5 && sum(off.views, 'nodeInline') === 0, `${sum(off.views, 'nodeInline')} -> ${sum(on.views, 'nodeInline')}`);
			}
			if (sc.key !== 'net1') {
				ok(sc.name + ': level pipe labels go out on a leader both as one line and as stacks, and the reference stacks none',
					sum(on.views, 'levelInline') >= 5 && sum(on.views, 'levelStacked') >= 5 && sum(off.views, 'levelStacked') === 0,
					`one line ${sum(on.views, 'levelInline')}, stacked ${sum(on.views, 'levelStacked')}; reference stacked ${sum(off.views, 'levelStacked')}`);
				ok(sc.name + ': a level label shows more values than the shed along its pipe left it, and the reference grows none',
					sum(on.views, 'levelGrown') >= 5 && sum(off.views, 'levelGrown') === 0, `${sum(off.views, 'levelGrown')} -> ${sum(on.views, 'levelGrown')}`);
			}
			sc.named.forEach((id) => {
				const n = on.named[id] || {};
				ok(sc.name + ': pipe ' + id + "'s label is shown, level beside its pipe, on a leader", !!(n.shown && n.level && n.leader),
					JSON.stringify(n) + '; reference ' + JSON.stringify(off.named[id] || {}));
			});
			console.log(`        content pass at the last view: shipped ${on.ms} ms, reference ${off.ms} ms` +
				extra.map((e) => `, ${e.ref} ${e.r.ms} ms`).join(''));
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
