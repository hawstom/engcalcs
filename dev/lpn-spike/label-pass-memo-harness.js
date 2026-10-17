// EACH SETTING READ ONCE PER LABEL PASS DRAWS THE SAME LABELS (ROADMAP Task 812, port-plan Step 1).
// Run with:
//   node dev/lpn-spike/label-pass-memo-harness.js          (REPS=5 for a timing table)
//
// **WHAT CHANGED.** Inside one refreshLabelText() call, scnSetting(), scnLabels() and
// coordOverridesOf() answer from a memo that lives only for that call (labelPassMemo() in
// js/looped-network.js), where they used to walk the scenario layer thousands of times a pass.
//
// **WHAT MUST NOT CHANGE: A SINGLE LABEL.** Each scene is laid out twice, as shipped and with the
// memo's begin/end calls rewritten away on the way in (the reference: every read goes through the
// scenario layer, as before). Every element under the label layer -- tag, position attributes,
// visibility, text -- must match, on Net3 and Net3 near Novato at fit, 2x, 4x and 8x, and on the
// bench's 600-junction downtown network at its five zooms; and again in a non-Base scenario that
// holds a coordinate override (one node moved) and a scenario label setting (Head on), which is the
// seam the memo touches. A write part-way through a pass is read fresh: the memo drops itself when
// the tree epoch moves. The browser twin is label-pass-memo-browser-harness.js.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const V = require('./label-views-lib.js');

const MEMO_CALL = '\t\tbeginLabelPassMemo();\n\t\ttry { refreshLabelTextPass(); } finally { endLabelPassMemo(); ';
const NO_MEMO = '\t\ttry { refreshLabelTextPass(); } finally { ';
function noMemo(src) {
	if (src.split(MEMO_CALL).length !== 2) { throw new Error('memo call not found exactly once'); }
	return src.replace(MEMO_CALL, NO_MEMO);
}
const REPS = Number(process.env.REPS || 1);

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

function inScenario(L) {
	const scn = L.createScenario('Memo check');
	L.switchScenario(scn.id || scn);
	const act = L.activeScenario();
	L.setScenarioSetting(act, ['labelSettings', 'node', 'head'], true);
	const doc = L.getDoc(), n = doc.nodes[Math.floor(doc.nodes.length / 2)], p = L.nodeAt(n);
	L.setOverride(n, 'x', p.x + 40 / L.state().s);
	L.buildDom();
	return { scn: act, node: n };
}

async function layOut(stub, sc, mutate, scenario) {
	const o = await V.openScene(stub, sc, mutate);
	const L = o.L;
	let moved = null;
	if (scenario) { moved = inScenario(L); }
	const views = [], ms = [];
	for (const m of sc.mults) {
		L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m });
		const ts = [];
		for (let r = 0; r < REPS; r++) { const t0 = process.hrtime.bigint(); L.refreshLabelText(); ts.push(Number(process.hrtime.bigint() - t0) / 1e6); }
		ts.sort((a, b) => a - b); ms.push(ts[Math.floor(ts.length / 2)]);
		views.push(V.drawnLabels(L));
	}
	return { L: L, views: views, ms: ms, moved: moved };
}

(async function () {
	const stub = require('./lpn-dom-stub.js');
	stub.setUnitSet('us');
	await stub.warmEpanet();
	let lastShip = null;
	for (const scenario of [false, true]) {
		for (const sc of V.SCENES) {
			const tag = sc.name + (scenario ? ' in a scenario' : '');
			const ship = await layOut(stub, sc, undefined, scenario);
			const ref = await layOut(stub, sc, noMemo, scenario);
			sc.mults.forEach((m, i) => {
				const A = ship.views[i], B = ref.views[i];
				let first = -1;
				for (let k = 0; k < Math.max(A.length, B.length); k++) { if (A[k] !== B[k]) { first = k; break; } }
				const texts = A.filter((s) => / text /.test(s) && !/hidden/.test(s)).length;
				ok(tag + ' ' + m + 'x: every label drawn identically', first < 0 && A.length > 0,
					A.length + ' elements, ' + texts + ' texts' + (first < 0 ? '' : '; first difference at ' + first + ': ' + A[first] + '  vs  ' + B[first]));
			});
			if (scenario) {
				ok(tag + ': the scenario really moved its node and turned Head on',
					!!ship.moved && Math.abs(ship.L.nodeAt(ship.moved.node).x - ship.moved.node.x) > 1e-9 &&
					ship.L.labelSettings().node.head !== true);
			}
			if (REPS > 1) {
				console.log('        ms per pass, median of ' + REPS + ': memo ' + ship.ms.map((t) => t.toFixed(1)).join(' ') +
					' | reference ' + ref.ms.map((t) => t.toFixed(1)).join(' '));
			}
			lastShip = ship;
		}
	}
	// A setting written after a pass is read by the next one: the memo never outlives its pass.
	const L = lastShip.L, act = L.activeScenario();
	const rows = () => Object.keys(L.nodeEls()).reduce((t, id) => t + ((L.nodeEls()[id].allLines || []).length), 0);
	L.refreshLabelText();
	const before = rows();
	L.setScenarioSetting(act, ['labelSettings', 'node', 'head'], false);
	L.refreshLabelText();
	const after = rows();
	ok('a scenario label setting written between passes is read by the next pass', after < before, 'node rows asked ' + before + ' then ' + after);
	console.log('\nlabel-pass-memo-harness: ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
