// A PIPE LABEL THAT CANNOT LIE ALONG ITS PIPE IS TRIED LEVEL BESIDE IT BEFORE IT HIDES (ROADMAP
// Task 812, dev/label-trials/port-plan.md Step 3). Run with:
//   node dev/lpn-spike/pipe-label-level-harness.js        (LEVEL_TABLE=1 prints every view)
//
// **THE SCENES** are label-views-lib.js's: Net3 and Net3 near Novato at fit, 2x, 4x and 8x, and the
// bench's 600-junction downtown network at its five zooms, "along the pipe" on. Each is laid out
// twice: as shipped, and with placeLevelPipeLabels() switched off on the way in (the layout before
// Task 812). Measured per view: pipe and node labels shown, values (rows) shown, and the never-rule
// breaks of dev/label-placement-rules.md, read off what is drawn:
//   N1  a shown label's rows overlapping a node symbol, a pump or valve symbol, or another shown
//       label's rows, deeper than 1.5 screen px;
//   N3  a drawn leader passing within a node symbol (deeper than 1.5 px) other than its own node's;
//   N5  a shown label overlapping a Text object (Net3 carries two).
//   (N4, a hand-placed label: these scenes have none; label-leader-keep-harness.js holds it.)
//
// **ASSERTED:** the shipped layout adds no never-rule break to the layout before (master's own node
// labels already draw a few leaders through other nodes' symbols on these views, 1 to 4 a view,
// which this branch does not touch and the table prints); no view shows fewer labels or fewer
// values than before; every label drawn before is drawn identically after (the level pass runs last
// and only on labels that were hidden); every level label drawn without a leader is nearer its own
// pipe than any other pipe, measured to its rows; and the level pass shows labels on every network. R14 holds
// by construction: only a label that could not lie along its pipe is ever set level.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const V = require('./label-views-lib.js');

const CALL = "\t\tperfDebugAccum('  cl:level', function () {\n\t\t\tplaceLevelPipeLabels(obs, nodeObs, nodeLabels, nodePlaced, labels, placed, holders, fs);\n\t\t});\n";
function noLevel(src) {
	if (src.split(CALL).length !== 2) { throw new Error('level call not found exactly once'); }
	return src.replace(CALL, '');
}
const EPS_PX = 1.5;
const TABLE = process.env.LEVEL_TABLE === '1';

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

(async function () {
	const stub = require('./lpn-dom-stub.js');
	const Collide = require(stub.ROOT + 'js/lpn-collide.js').lpnCollide;
	// What the passes placed, captured as they return: the node labels (the gang repair's answer is
	// their last word), the free labels (the ring pass), its obstacle set (which carries the
	// stationed pipe labels) and the level labels (the strict first-fit).
	let cap = {};
	const realFF = Collide.placeLabelsFirstFit, realRepair = Collide.repairCrossingGangs, realRing = Collide.placeLabels;
	Collide.placeLabelsFirstFit = function (labels, obs, opts) {
		const out = realFF.call(this, labels, obs, opts);
		if (opts && opts.strict) { cap.level = out; }
		return out;
	};
	Collide.repairCrossingGangs = function (labels, placed, obs, opts) {
		const out = realRepair.call(this, labels, placed, obs, opts);
		cap.node = out.results; cap.nodeSpecs = labels;
		return out;
	};
	Collide.placeLabels = function (labels, obs, opts) {
		const out = realRing.call(this, labels, obs, opts);
		cap.ring = out; cap.ringSpecs = labels; cap.obs = obs;
		return out;
	};
	stub.setUnitSet('us');
	await stub.warmEpanet();

	function measure(L) {
		const doc = L.getDoc(), nodeEls = L.nodeEls(), linkEls = L.linkEls(), s = L.state().s, eps = EPS_PX / s;
		const holderOf = (id) => id.charAt(0) === 'n' ? nodeEls[id.slice(2)] : linkEls[id.slice(2)];
		const drawn = [];
		[cap.node, cap.ring, cap.level].forEach((set) => (set || []).forEach((r) => {
			if (r.dropped) { return; }
			const h = holderOf(r.id);
			if (!V.shown(h)) { return; }
			// A level label is in the level set; an aligned one under the same key is not drawn.
			if ((set === cap.level) !== !!(r.id.charAt(0) === 'l' && h.levelBeside)) { return; }
			drawn.push({ id: r.id, boxes: (r.boxes && r.boxes.length) ? r.boxes : [r.box] });
		}));
		const stat = {};
		((cap.obs && cap.obs.boxes) || []).forEach((b) => {
			if (b.kind !== 'label' || b.linkOwner === undefined) { return; }
			const h = linkEls[b.linkOwner];
			if (!V.shown(h) || h.levelBeside) { return; }
			(stat[b.linkOwner] = stat[b.linkOwner] || []).push(b);
		});
		Object.keys(stat).forEach((id) => drawn.push({ id: 'l:' + id, boxes: stat[id] }));
		const texts = ((cap.obs && cap.obs.boxes) || []).filter((b) => b.textOwner !== undefined);
		const nsym = [];
		doc.nodes.forEach((n) => {
			const ne = nodeEls[n.id]; if (!ne || !ne.circle) { return; }
			const r = +ne.circle.getAttribute('r');
			nsym.push({ id: n.id, x: +ne.circle.getAttribute('cx'), y: +ne.circle.getAttribute('cy'), r: r,
				box: Collide.box(+ne.circle.getAttribute('cx'), +ne.circle.getAttribute('cy'), 2 * r, 2 * r, 0) });
		});
		const lsym = [];
		doc.links.forEach((l) => {
			const le = linkEls[l.id];
			if (!le || !le.symbolG || !le.symbolBox) { return; }
			const g = /translate\(([-0-9.e]+),([-0-9.e]+)\) rotate\(([-0-9.e]+)\)/.exec(le.symbolG.getAttribute('transform') || ''),
				k = /scale\(([-0-9.e]+),/.exec(le.symbolBox.getAttribute('transform') || '');
			if (g && k) { lsym.push(Collide.box(+g[1], +g[2], +k[1] * 24, +k[1] * 24, +g[3])); }
		});
		const br = { N1: [], N3: [], N5: [] };
		drawn.forEach((d, i) => d.boxes.forEach((b) => {
			nsym.forEach((q) => { if (Collide.boxOverlapDepth(b, q.box) > eps) { br.N1.push(d.id + ' on node ' + q.id); } });
			lsym.forEach((q) => { if (Collide.boxOverlapDepth(b, q) > eps) { br.N1.push(d.id + ' on a valve or pump'); } });
			texts.forEach((q) => { if (Collide.boxOverlapDepth(b, q) > eps) { br.N5.push(d.id + ' on Text ' + q.textOwner); } });
			for (let j = i + 1; j < drawn.length; j++) {
				if (drawn[j].id === d.id) { continue; }
				drawn[j].boxes.forEach((c) => { if (Collide.boxOverlapDepth(b, c) > eps) { br.N1.push(d.id + ' on ' + drawn[j].id); } });
			}
		}));
		// N3 off the drawn leaders themselves.
		const leaders = [];
		doc.nodes.forEach((n) => { const h = nodeEls[n.id]; if (V.shown(h)) { leaders.push({ id: 'n:' + n.id, h: h, own: n.id }); } });
		doc.links.forEach((l) => { const h = linkEls[l.id]; if (V.shown(h)) { leaders.push({ id: 'l:' + l.id, h: h, own: null }); } });
		leaders.forEach((o) => {
			const e = o.h.leader;
			if (!e || e.style.display === 'none' || e.style.visibility === 'hidden' || e.getAttribute('x1') === undefined) { return; }
			const ax = +e.getAttribute('x1'), ay = +e.getAttribute('y1'), bx = +e.getAttribute('x2'), by = +e.getAttribute('y2');
			nsym.forEach((q) => {
				if (q.id === o.own) { return; }
				const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy;
				let t = L2 ? ((q.x - ax) * vx + (q.y - ay) * vy) / L2 : 0; t = Math.max(0, Math.min(1, t));
				if (Math.hypot(ax + vx * t - q.x, ay + vy * t - q.y) < q.r - eps) { br.N3.push(o.id + ' leader through node ' + q.id); }
			});
		});
		// WHICH PIPE IS IT FOR? A level label with no drawn leader must be nearer its own pipe than
		// any other, measured to its rows (pre-review, 2026-10-17).
		br.astray = [];
		const pipes = ((cap.obs && cap.obs.segments) || []).filter((g) => g.kind === 'link');
		(cap.level || []).forEach((r) => {
			const h = linkEls[r.id.slice(2)];
			if (r.dropped || !V.shown(h) || !h.levelBeside) { return; }
			if (h.leader && h.leader.style.display !== 'none') { return; }
			const bs = (r.boxes && r.boxes.length) ? r.boxes : [r.box];
			let own = Infinity, other = Infinity;
			pipes.forEach((g) => bs.forEach((b) => {
				const d = Collide.segmentBoxDistance(g, b);
				if (g.owner === r.id) { own = Math.min(own, d); } else { other = Math.min(other, d); }
			}));
			if (other < own) { br.astray.push(r.id); }
		});
		return br;
	}

	async function run(sc, mutate) {
		const o = await V.openScene(stub, sc, mutate), L = o.L, views = [];
		for (const m of sc.mults) {
			cap = {};
			L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m });
			L.refreshLabelText();
			const c = V.countShown(L), br = measure(L);
			const sig = {};
			L.getDoc().links.forEach((l) => { const h = L.linkEls()[l.id]; if (V.shown(h) && !h.levelBeside) { sig['l' + l.id] = h.text.getAttribute('x') + ',' + h.text.getAttribute('y') + ',' + (h.text.getAttribute('transform') || '') + ',' + (h.lines || []).length; } });
			L.getDoc().nodes.forEach((n) => { const h = L.nodeEls()[n.id]; if (V.shown(h)) { sig['n' + n.id] = h.text.getAttribute('x') + ',' + h.text.getAttribute('y') + ',' + (h.lines || []).length; } });
			views.push({ m: m, c: c, br: br, sig: sig });
		}
		return views;
	}

	const totals = { before: { shown: 0, asked: 0, rows: 0, rowsAsked: 0 }, after: { shown: 0, asked: 0, rows: 0, rowsAsked: 0 } };
	for (const sc of V.SCENES) {
		const before = await run(sc, noLevel), after = await run(sc, undefined);
		let levelSeen = 0;
		after.forEach((a, i) => {
			const b = before[i], tag = sc.name + ' ' + a.m + 'x';
			const shownA = a.c.pipesShown + a.c.nodesShown, shownB = b.c.pipesShown + b.c.nodesShown;
			const rowsA = a.c.pipeRows + a.c.nodeRows, rowsB = b.c.pipeRows + b.c.nodeRows;
			levelSeen += a.c.level;
			[['before', b], ['after', a]].forEach(([k, v]) => {
				totals[k].shown += v.c.pipesShown + v.c.nodesShown; totals[k].asked += v.c.pipes + v.c.nodes;
				totals[k].rows += v.c.pipeRows + v.c.nodeRows; totals[k].rowsAsked += v.c.pipeRowsAsked + v.c.nodeRowsAsked;
			});
			const line = `pipes ${b.c.pipesShown} -> ${a.c.pipesShown} of ${a.c.pipes} (${a.c.level} level: ${a.c.levelInline} one line, ${a.c.levelStacked} stacked, ${a.c.levelGrown} grown), nodes ${b.c.nodesShown} -> ${a.c.nodesShown} of ${a.c.nodes} (${a.c.nodeInline} one line), ` +
				`values ${rowsB} -> ${rowsA} of ${a.c.pipeRowsAsked + a.c.nodeRowsAsked}; breaks before N1 ${b.br.N1.length} N3 ${b.br.N3.length} N5 ${b.br.N5.length}`;
			if (TABLE) { console.log('        ' + tag + ': ' + line); }
			const was = new Set(b.br.N1.concat(b.br.N3, b.br.N5)), added = a.br.N1.concat(a.br.N3, a.br.N5).filter((x) => !was.has(x));
			ok(tag + ': no never-rule break added (N1, N3, N5)', added.length === 0,
				`after N1 ${a.br.N1.length} N3 ${a.br.N3.length} N5 ${a.br.N5.length}, ${added.length} new` + (added.length ? '; e.g. ' + added.slice(0, 3).join('; ') : ''));
			ok(tag + ': every level label without a leader is nearer its own pipe than any other', a.br.astray.length === 0,
				a.br.astray.length + ' of ' + a.c.level + (a.br.astray.length ? ': ' + a.br.astray.slice(0, 4).join(' ') : ''));
			ok(tag + ': no fewer labels or values than before', shownA >= shownB && rowsA >= rowsB, shownB + ' -> ' + shownA + ' labels, ' + rowsB + ' -> ' + rowsA + ' values');
			const moved = Object.keys(b.sig).filter((k) => a.sig[k] !== b.sig[k]);
			ok(tag + ': every label drawn before is drawn identically after', moved.length === 0,
				moved.length + ' changed' + (moved.length ? ': ' + moved.slice(0, 3).map((k) => k + ' ' + b.sig[k] + ' vs ' + a.sig[k]).join('; ') : ''));
		});
		ok(sc.name + ': the level pass shows pipe labels that were hidden', levelSeen > 0, levelSeen + ' level labels over ' + after.length + ' views');
	}
	const pct = (a, b) => (100 * a / Math.max(1, b)).toFixed(1);
	console.log(`        all views: labels shown ${pct(totals.before.shown, totals.before.asked)}% -> ${pct(totals.after.shown, totals.after.asked)}% of asked; values ${pct(totals.before.rows, totals.before.rowsAsked)}% -> ${pct(totals.after.rows, totals.after.rowsAsked)}%`);
	console.log('\npipe-label-level-harness: ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
