// LABEL BENCH SELF-TEST: THE SCORER STILL CATCHES WHAT IT MUST. Run with:
//
//   node dev/lpn-spike/label-bench/selftest-harness.js
//
// Wired into dev/scripts/check_all.sh so the bench cannot rot silently. Two halves:
//   1. A hand-built scene of three nodes, two pipes, one Text object and one hand-placed label,
//      with one layout per rule that breaks exactly that rule, and one that breaks nothing. Each
//      must be caught, and caught as itself, and the clean one must score zero. A leader crossing
//      another leader (N2, removed) must NOT fail the run; it must raise the weighted cost. A
//      label over a Text object is N5, not N1; a label over another label is N1, not N5.
//   2. The trivial placer on the committed Net1 scene: it hangs every label whole at its node's
//      upper right, so it must break N1 (its pipe labels run over the next node) and must not
//      break N4 (it hangs a hand-placed label at the user's point); master's recorded layout of the
//      same scene must break N4 three times (it pushes Net1's three hand-placed node labels out
//      along their rays, which rule N4 of dev/label-placement-rules.md forbids).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { scoreView, stability, WEIGHTS } = require('./score.js');
const { runBench, loadSets } = require('./run.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- 1. the hand-built scene ----------------------------------------------------------------
// Nodes A (100,100), B (300,100), C (200,300); pipes A-B and A-C; a Text object at (400,300);
// label n:A requested with two rows; n:B with one; n:C hand-placed at (260,300).
function row(t) { return { field: 'id', text: t, w: 20, h: 10 }; }
const scene = {
	id: 'selftest@0', set: 'selftest', step: 0, viewport: { x: 0, y: 0, w: 600, h: 500 },
	view: { s: 1, tx: 0, ty: 0 },
	text: { sizePx: 10, rowHeightPx: 10, separator: ' ', separatorW: 5, hookMaxPx: 10 },
	dropOrder: { node: [], link: [], customer: [] },
	nodes: [
		{ id: 'A', type: 'junction', x: 100, y: 100, symbol: { x: 95, y: 95, w: 10, h: 10 } },
		{ id: 'B', type: 'junction', x: 300, y: 100, symbol: { x: 295, y: 95, w: 10, h: 10 } },
		{ id: 'C', type: 'junction', x: 200, y: 300, symbol: { x: 195, y: 295, w: 10, h: 10 } }
	],
	links: [
		{ id: 'AB', type: 'pipe', from: 'A', to: 'B', points: [[100, 100], [300, 100]], symbols: [], arrows: [] },
		{ id: 'AC', type: 'pipe', from: 'A', to: 'C', points: [[100, 100], [200, 300]], symbols: [], arrows: [] }
	],
	texts: [{ id: 'T', text: 'note', box: { cx: 400, cy: 300, w: 40, h: 12, angle: 0 } }],
	customers: [],
	labels: [
		{ id: 'n:A', owner: 'A', kind: 'node', anchor: { x: 100, y: 100 }, rows: [row('A'), row('A2')], layout: 'stack', hand: null },
		{ id: 'n:B', owner: 'B', kind: 'node', anchor: { x: 300, y: 100 }, rows: [row('B')], layout: 'stack', hand: null },
		{ id: 'n:C', owner: 'C', kind: 'node', anchor: { x: 200, y: 300 }, rows: [row('C')], layout: 'stack', hand: { x: 260, y: 300 } }
	]
};
// Clean ground: A above-left of its node, B above-right, C hung at the user's point.
function clean() {
	return { labels: {
		'n:A': { shown: true, rows: [0, 1], x: 60, y: 60, align: 'right', leader: null },
		'n:B': { shown: true, rows: [0], x: 310, y: 80, leader: null },
		'n:C': { shown: true, rows: [0], x: 260, y: 295, leader: [[200, 300], [260, 300]] }
	} };
}
function withLabel(id, pl) { const o = clean(); o.labels[id] = pl; return o; }
function count(sc) { return ['N1', 'N3', 'N4', 'N5', 'invalid'].map(function (k) { return k + '=' + sc.breaks[k].length; }).join(' '); }
function only(sc, key, n) {
	return ['N1', 'N3', 'N4', 'N5', 'invalid'].every(function (k) { return sc.breaks[k].length === (k === key ? n : 0); });
}

const base = scoreView(scene, clean());
report(only(base, null, 0) && base.cost === 0, 'a clean layout breaks nothing and costs nothing', count(base) + ' cost ' + base.cost);

const onLabel = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 70, y: 65, leader: [[300, 100], [90, 75]] }));
report(only(onLabel, 'N1', 1) && onLabel.counts.labelOnLabel === 1, 'N1: a label on another label is caught', count(onLabel));

const onSymbol = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 290, y: 95, leader: null }));
report(only(onSymbol, 'N1', 1) && onSymbol.counts.labelOnSymbol === 1, 'N1: a label on a node symbol (its own) is caught', count(onSymbol));

const onText = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 390, y: 296, leader: [[300, 100], [390, 296]] }));
report(only(onText, 'N5', 1) && onText.counts.labelOnText === 1, 'N5: a label on a Text object is caught (not N1)', count(onText));

// Two leaders crossing: A's runs east-south-east, B's west-south-west, an X between the nodes.
// N2 is removed (Tom, 2026-09-28): this no longer fails the run, but it does raise the cost.
const crossed = clean();
crossed.labels['n:A'] = { shown: true, rows: [0, 1], x: 250, y: 140, leader: [[100, 100], [250, 145]] };
crossed.labels['n:B'] = { shown: true, rows: [0], x: 120, y: 145, align: 'left', leader: [[300, 100], [140, 150]] };
const x2 = scoreView(scene, crossed);
report(only(x2, null, 0) && x2.counts.leaderOnLeader === 1 && x2.crossings.leaderOnLeader.length === 1
	&& x2.cost >= WEIGHTS.leaderOnLeader,
	'leader on leader crosses clean (no break) but raises the cost', count(x2) + ' cost ' + x2.cost);

const through = scoreView(scene, withLabel('n:A', { shown: true, rows: [0, 1], x: 330, y: 95, leader: [[100, 100], [330, 102]] }));
report(through.breaks.N3.length === 1 && /through node B/.test(through.breaks.N3[0]), 'N3: a leader through another node\'s symbol is caught', count(through));

const moved = scoreView(scene, withLabel('n:C', { shown: true, rows: [0], x: 280, y: 295, leader: [[200, 300], [280, 300]] }));
report(only(moved, 'N4', 1), 'N4: a hand-placed label moved off the user\'s point is caught', count(moved));
const hidden = scoreView(scene, withLabel('n:C', { shown: false }));
report(only(hidden, 'N4', 1), 'N4: a hand-placed label hidden is caught', count(hidden));

const badHook = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 360, y: 40,
	leader: [[300, 100], [330, 45], [360, 45]] }));
report(only(badHook, 'invalid', 1), 'a hook longer than hookMaxPx is refused as invalid', count(badHook));
const goodHook = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 345, y: 40,
	leader: [[300, 100], [337, 45], [345, 45]] }));
report(only(goodHook, null, 0), 'the one standard hook (short, horizontal last leg) is legal', count(goodHook));

// Weighted costs, one crossing at a time: a label on a pipe, a leader over a pipe, a label on a
// leader. Each must cost exactly its §3.1 weight.
const onLink = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 190, y: 95, leader: [[300, 100], [210, 100]] }));
report(onLink.counts.labelOnLink === 1 && Math.abs(onLink.cost - WEIGHTS.labelOnLink) < 1e-9,
	'a label on a pipe costs ' + WEIGHTS.labelOnLink, 'cost ' + onLink.cost + ' ' + count(onLink));
const leaderLink = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 150, y: 240, leader: [[300, 100], [170, 240]] }));
report(leaderLink.counts.leaderOnLink === 0 && leaderLink.cost === 0, 'a leader that does not reach a pipe costs nothing', 'cost ' + leaderLink.cost);
const leaderLink2 = scoreView(scene, withLabel('n:B', { shown: true, rows: [0], x: 100, y: 240, leader: [[300, 100], [120, 240]] }));
report(leaderLink2.counts.leaderOnLink === 1 && Math.abs(leaderLink2.cost - WEIGHTS.leaderOnLink) < 1e-9,
	'a leader across a pipe costs ' + WEIGHTS.leaderOnLink, 'cost ' + leaderLink2.cost + ' ' + count(leaderLink2));
const onLeader = clean();
onLeader.labels['n:B'] = { shown: true, rows: [0], x: 225, y: 293, leader: [[300, 100], [235, 293]] };
const ol = scoreView(scene, onLeader);
report(ol.counts.labelOnLeader === 1 && only(ol, null, 0), 'a label on a leader is counted, and is not a break', 'labelOnLeader ' + ol.counts.labelOnLeader + ' ' + count(ol));

// Stability: the same offsets one view later are no move; a label shifted into open ground is
// an UNFORCED move; one shifted because its old spot is now under the Text object is forced.
const scene2 = JSON.parse(JSON.stringify(scene));
scene2.id = 'selftest@1'; scene2.step = 1;
const still = stability(scene, clean(), scene2, clean());
report(still.moved === 0 && still.compared === 3, 'a layout that holds still moves nothing', JSON.stringify(still));
const shifted = stability(scene, clean(), scene2, withLabel('n:B', { shown: true, rows: [0], x: 330, y: 60, leader: [[300, 100], [330, 65]] }));
report(shifted.unforced === 1 && shifted.unforcedIds[0] === 'n:B', 'a label moved into open ground is an unforced move', JSON.stringify(shifted));
const scene3 = JSON.parse(JSON.stringify(scene2));
scene3.texts[0].box = { cx: 320, cy: 85, w: 40, h: 12, angle: 0 };
const forced = stability(scene, clean(), scene3, withLabel('n:B', { shown: true, rows: [0], x: 310, y: 110, leader: null }));
report(forced.moved === 1 && forced.unforced === 0, 'a label moved off a Text object that now covers its spot was forced', JSON.stringify(forced));

// ---- 2. the committed Net1 scene ----------------------------------------------------------------
const sets = loadSets(path.join(__dirname, 'scenes'), ['net1']);
report(sets.length === 1 && sets[0].steps[0].labels.length === 24, 'the Net1 scene is committed and has its 24 labels',
	sets.length ? sets[0].steps[0].labels.length + ' labels' : 'missing');
if (sets.length) {
	const triv = runBench(path.join(__dirname, 'placers/trivial.js'), sets)[0].steps[0].score;
	report(triv.breaks.N1.length === 11 && triv.breaks.N4.length === 0 && triv.breaks.invalid.length === 0,
		'the trivial placer on Net1: 11 N1 breaks (pipe labels over the next node and under node labels), no N4',
		count(triv));
	const hands = sets[0].steps[0].labels.filter(function (l) { return l.hand; }).map(function (l) { return l.id; }).sort();
	const mast = runBench(path.join(__dirname, 'placers/master-replay.js'), sets)[0].steps[0].score;
	report(mast.breaks.N4.length === 3 && mast.breaks.N1.length === 0,
		'master\'s recorded Net1: three hand-placed node labels pushed out along their rays (N4)',
		count(mast) + '; hand-placed: ' + hands.join(' '));
}

console.log(`\n${checks - failures}/${checks} checks passed.`);
process.exit(failures ? 1 : 0);
