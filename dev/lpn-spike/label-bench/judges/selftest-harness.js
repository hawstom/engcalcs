// JUDGES ONLY. BUILDERS MUST NOT READ THIS DIRECTORY (dev/label-placement-rules.md §5, Tom's Q11).
//
//   node dev/lpn-spike/label-bench/judges/selftest-harness.js
//
// The judges' own tests still measure what they say (wired into dev/scripts/check_all.sh):
//   1. R-075 (rewritten 2026-09-28, Tom: "The test is faulty. Their behavior is gold."): a label the
//      long IDs MOVED but still show whole is not a failure; one they HID, or cut values from, is a
//      failure only where free ground within reach could have held it in that same layout.
//   2. R14: master's recorded layouts pass the judges' assertion on every public scene, and a layout
//      that draws every pipe label level fails it.
//   3. Tom's numeric crossing weights live here and nowhere a builder reads.
//   4. R1 (Tom, 2026-10-05: "Hide a label only because there is no room for it on screen. Never hide
//      it because of how many labels are already showing."): a placer that hides only where no
//      ground is free passes the count probe, and the same placer capped at a count fails it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { r075View, R14_MAX_MISSED, R1_MAX_REVIVED } = require('./judge.js');
const R1 = require('./r1.js');
const { roomWithinReach } = require('./room.js');
const { runBench, loadSets } = require('../run.js');
const TOM = require('./weights.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- 1. R-075 on a hand-built pair of views ------------------------------------------------------
// Node A at (100,100) with a pipe running east to B (300,100). The plain scene's ID is "A"; the
// long one's is "12345678A", three times as wide. A Text "wall" object can close the ground round A.
function row(t, f) { return { field: f || 'id', text: t, w: t.length * 6, h: 10 }; }
function mkScene(id, wall) {
	return {
		id: 'r075@' + id, set: 'r075', step: 0, viewport: { x: 0, y: 0, w: 400, h: 300 }, view: { s: 1, tx: 0, ty: 0 },
		text: { sizePx: 10, rowHeightPx: 10, separator: ' ', separatorW: 5, hookMaxPx: 10 },
		dropOrder: { node: ['elev'], link: [], customer: [] },
		nodes: [
			{ id: 'A', type: 'junction', x: 100, y: 100, symbol: { x: 96, y: 96, w: 8, h: 8 } },
			{ id: 'B', type: 'junction', x: 300, y: 100, symbol: { x: 296, y: 96, w: 8, h: 8 } }
		],
		links: [{ id: 'AB', type: 'pipe', from: 'A', to: 'B', points: [[100, 100], [300, 100]], symbols: [], arrows: [] }],
		texts: wall ? [{ id: 'W', text: 'wall', box: { cx: 100, cy: 100, w: 400, h: 300, angle: 0 } }] : [],
		customers: [],
		labels: [{ id: 'n:A', owner: 'A', kind: 'node', anchor: { x: 100, y: 100 },
			rows: [row(id === 'long' ? '12345678A' : 'A'), row('Z=5', 'elev')], layout: 'stack', hand: null }]
	};
}
const plain = mkScene('plain'), long = mkScene('long'), longWalled = mkScene('long', true);
const A = { 'n:A': { shown: true, rows: [0, 1], layout: 'stack', align: 'left', x: 106, y: 80, leader: null } };
// Moved: the longer block now hangs on its east edge, grown west, both rows still shown.
const moved = r075View(plain, A, long, { 'n:A': { shown: true, rows: [0, 1], layout: 'stack', align: 'right', x: 40, y: 80, leader: null } }, 3);
report(moved.moved.length === 1 && !moved.hidden.length && !moved.fewer.length && !moved.hiddenRoom.length && !moved.fewerRoom.length,
	'a label the long ID moved but still shows whole is reported moved, and is not a failure', JSON.stringify(moved));
const hid = r075View(plain, A, long, { 'n:A': { shown: false } }, 3);
report(hid.hiddenRoom.length === 1, 'a label the long ID hid with open ground beside its node is a failure (hid with room)', JSON.stringify(hid));
const cut = r075View(plain, A, long, { 'n:A': { shown: true, rows: [0], layout: 'stack', align: 'left', x: 106, y: 85, leader: null } }, 3);
report(cut.fewerRoom.length === 1, 'values the long ID cut with open ground beside the node are a failure (cut with room)', JSON.stringify(cut));
const walled = r075View(plain, A, longWalled, { 'n:A': { shown: false } }, 3);
report(walled.hidden.length === 1 && !walled.hiddenRoom.length, 'a label hidden where no free ground is within reach is not a failure', JSON.stringify(walled));

// ---- 2. R14 on the public scenes -----------------------------------------------------------------
const bench = path.join(__dirname, '..');
// The five straight-piped sets: on `bent-valves` (round 6) master's own layouts leave 41 of 534 pipe
// labels level with room to lie along their bent pipes, which is master's fault, not the judge's.
const sets = loadSets(path.join(bench, 'scenes'), ['net1', 'net2', 'net3', 'novato-zoom', 'novato-seq']);
function r14Total(res) {
	const t = { asked: 0, along: 0, missed: 0, closeLevel: 0, closeRoom: 0 };
	res.forEach(function (s) { s.steps.forEach(function (st) {
		const r = st.score.r14;
		t.asked += r.asked; t.along += r.along; t.missed += r.missedWithRoom;
		if (r.zoom >= 4) { t.closeLevel += r.asked - r.along; t.closeRoom += r.missedWithRoom; }
	}); });
	return t;
}
const mast = r14Total(runBench(path.join(bench, 'placers/master-replay.js'), sets));
report(mast.asked > 100 && mast.missed <= R14_MAX_MISSED * mast.asked, 'master\'s recorded layouts pass R14 on every straight-piped public scene', JSON.stringify(mast));
// Master's layouts with every pipe label turned level: the same positions, so there is room.
const level = {
	name: 'master-level',
	create: function () {
		const m = require(path.join(bench, 'placers/master-replay.js'));
		const p = typeof m.create === 'function' ? m.create() : m;
		return { name: 'master-level', place: function (scene, o) {
			const out = p.place(scene, o), labels = {};
			Object.keys(out.labels || {}).forEach(function (id) {
				labels[id] = id.charAt(0) === 'l' && out.labels[id].shown ? Object.assign({}, out.labels[id], { angle: 0, repeats: [] }) : out.labels[id];
			});
			return { labels: labels, recordedMs: out.recordedMs };
		} };
	}
};
const lev = r14Total(runBench(level, sets));
report(lev.missed > R14_MAX_MISSED * lev.asked, 'the same layouts with every pipe label turned level fail R14', JSON.stringify(lev));
report(lev.closeLevel > 0 && lev.closeRoom > 0.05 * lev.closeLevel, 'and fail R14 at close zoom (level labels with room to lie along their pipe)',
	lev.closeRoom + '/' + lev.closeLevel);

// ---- 3. Tom's numbers are the judges' alone ------------------------------------------------------
report(TOM.leaderOnLeader === 0.9 && TOM.labelOnLeader === 0.7 && TOM.labelOnLink === 0.3 && TOM.leaderOnLink === 0.2,
	'weights.js holds Tom\'s Q05 weights', JSON.stringify(TOM));
const PUBLIC = ['README.md', 'score.js', 'run.js', 'contract.js', 'extract.js', 'selftest-harness.js']
	.map(function (f) { return path.join(bench, f); })
	.concat(fs.readdirSync(path.join(bench, 'placers')).map(function (f) { return path.join(bench, 'placers', f); }));
const LEAK = /(labelOnText|labelOnSymbol|labelOnLabel|leaderOnLeader|labelOnLeader|labelOnLink|leaderOnLink|labelOnCustomer)\s*:\s*0?\.\d|leader on leader\W{0,4}0?\.9|label on leader\W{0,4}0?\.7|label on (link|pipe)\W{0,4}0?\.3|leader on (link|pipe)\W{0,4}0?\.2/i;
const leaks = PUBLIC.filter(function (f) { return LEAK.test(fs.readFileSync(f, 'utf8')); });
const rules = fs.readFileSync(path.join(bench, '../../label-placement-rules.md'), 'utf8');
const partA = rules.slice(rules.indexOf('## Part A'), rules.indexOf('## Part B'));
if (LEAK.test(partA)) { leaks.push('dev/label-placement-rules.md Part A'); }
report(!leaks.length, 'no file a builder reads states Tom\'s numeric crossing weights (they get the order only)', leaks.map(function (f) { return path.relative(bench, f); }).join(', '));

// ---- 4. R1: hidden for lack of room, never by count ----------------------------------------------
// A plain greedy placer, labels in id order, each at the first free ground room.js finds for its ID
// row, hidden only when there is none: it hides for lack of room and for nothing else. `cap` turns
// it into the placer R1 forbids: the same, but it stops showing labels once `cap` are up.
function greedy(cap) {
	return { create: function () { return { name: 'greedy' + (cap ? '-cap' + cap : ''), place: function (scene) {
		const out = {};
		let n = 0;
		scene.labels.slice().sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; }).forEach(function (req) {
			if (cap && n >= cap) { out[req.id] = { shown: false }; return; }
			const pl = roomWithinReach(scene, { labels: Object.assign({}, out) }, req, R1.smallestRows(req), { reachRows: 3 });
			if (pl) { pl.shown = true; out[req.id] = pl; n++; } else { out[req.id] = { shown: false }; }
		});
		return { labels: out };
	} }; } };
}
// Two scenes: Novato at fit, and a field of 240 nodes spread evenly over a 1400 x 900 screen, ids
// scattered so id order is no spatial order (so a count cap falls everywhere, far side included).
function field() {
	const nodes = [], labels = [];
	for (let i = 0; i < 20; i++) {
		for (let j = 0; j < 12; j++) {
			const k = i * 12 + j, id = String((k * 7919) % 1000 + 1000), x = 35 + i * 70, y = 37 + j * 75;
			nodes.push({ id: id, type: 'junction', x: x, y: y, symbol: { x: x - 4, y: y - 4, w: 8, h: 8 } });
			labels.push({ id: 'n:' + id, owner: id, kind: 'node', anchor: { x: x, y: y }, rows: [row(id), row('Z=5', 'elev')], layout: 'stack', hand: null });
		}
	}
	return { id: 'r1-field', set: 'r1', step: 0, viewport: { x: 0, y: 0, w: 1400, h: 900 }, view: { s: 1, tx: 0, ty: 0 },
		text: { sizePx: 10, rowHeightPx: 10, separator: ' ', separatorW: 5, hookMaxPx: 10 },
		dropOrder: { node: ['elev'], link: [], customer: [] }, nodes: nodes, links: [], texts: [], customers: [], labels: labels };
}
const r1Scenes = [loadSets(path.join(bench, 'scenes'), ['novato-zoom'])[0].steps[0], field()];
function probeAll(pl) {
	const t = { farHidden: 0, revived: 0, controlFlips: 0, withRoom: 0, hidden: 0 };
	r1Scenes.forEach(function (sc) {
		const c = R1.countProbe(pl, sc, { idleMs: 0 });
		t.farHidden += c.farHidden; t.revived += c.revived; t.controlFlips += c.controlFlips;
		const h = R1.hiddenWithRoom(sc, { labels: (typeof pl.create === 'function' ? pl.create() : pl).place(sc, { prev: null }).labels });
		t.withRoom += h.withRoom; t.hidden += h.hidden;
	});
	return t;
}
const honest = probeAll(greedy(0)), capped = probeAll(greedy(60));
report(honest.withRoom === 0 && honest.revived <= R1_MAX_REVIVED * honest.farHidden,
	'R1: a placer that hides only where no ground is free hides none with room and revives none far from the cut', JSON.stringify(honest));
report(capped.farHidden > 0 && capped.revived - capped.controlFlips > R1_MAX_REVIVED * capped.farHidden && capped.withRoom > 0,
	'R1: the same placer capped at 60 labels fails both halves (hid with room; far labels come back when half the screen asks for none)', JSON.stringify(capped));

console.log(`\n${checks - failures}/${checks} checks passed.`);
process.exit(failures ? 1 : 0);
