// A NODE LABEL TAKES THE FORM ITS NEIGHBOURS TAKE (ROADMAP Task 812; Tom, 2026-10-20, on N163 of
// Novato: "Is looking like your neighbors not a value?"). Run with:
//   node dev/lpn-spike/label-neighbours-harness.js        (NEIGHBOURS_TABLE=1 prints every view)
//
// Each view is laid out twice in the same run: with conformNodeLabels() switched off on the way in
// (master's layout) and as shipped. Node fields ID, P, Qb, Z (label-views-lib.js) on Net1, Net3,
// Novato and the 600-junction downtown network; Novato is also run with ID, Demand, Elevation, Head and
// Pressure, the values Tom's screenshot showed (his N163 shows two of them, H and P). Measured per view: node labels shown, values shown, one-line
// labels, the DISAGREEMENTS (a label showing two values or more whose four nearest such neighbours
// within 250 px, at least three, mostly take the other form), overprints (a shown label's rows
// over a node symbol, a pump or valve symbol, or another label, deeper than 1.5 px), and the
// layout time.
//
// ASSERTED: N163 on Novato, stacked as H / P among one-line neighbours without the step, is one
// line with it; no view shows fewer labels or values; no overprint is added; the disagreements
// do not rise and fall in total; the step costs under 5% of the layout time.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const V = require('./label-views-lib.js');

const OFF_FROM = 'var LPN_CONFORM = true,';
function conformOff(src) {
	if (src.split(OFF_FROM).length !== 2) { throw new Error('LPN_CONFORM not found exactly once'); }
	return src.replace(OFF_FROM, 'var LPN_CONFORM = false,');
}
const EPS_PX = 1.5, RADIUS_PX = 250, K = 4;
const TABLE = process.env.NEIGHBOURS_TABLE === '1';
const EX = path.join(__dirname, '..', 'water-network-examples');
const SCENES = [
	{ name: 'Net1', file: path.join(EX, 'Net1.lwn'), view: 'fit', mults: [1, 2, 4, 8] }
].concat(V.SCENES, [
	{ name: 'Novato-HP', file: path.join(EX, 'Net3-Novato-CA-World.lwn'), view: 'fit', mults: [2.5, 3, 3.2, 3.5, 3.7, 4.1, 4.4, 5, 6], fields: ['id', 'demand', 'elev', 'head', 'pressure'] }
]);

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

(async function () {
	const stub = require('./lpn-dom-stub.js');
	const Collide = require(stub.ROOT + 'js/lpn-collide.js').lpnCollide;
	let cap = {};
	const realFF = Collide.placeLabelsFirstFit, realRepair = Collide.repairCrossingGangs, realRing = Collide.placeLabels;
	Collide.placeLabelsFirstFit = function (labels, obs, opts) {
		const out = realFF.call(this, labels, obs, opts);
		if (opts && opts.strict) {
			if (labels.length && labels[0].id.charAt(0) === 'n') { (cap.inline = cap.inline || []).push(out); } else { cap.level = out; }
		}
		return out;
	};
	Collide.repairCrossingGangs = function (labels, placed, obs, opts) {
		const out = realRepair.call(this, labels, placed, obs, opts);
		cap.node = out.results;
		return out;
	};
	Collide.placeLabels = function (labels, obs, opts) {
		const out = realRing.call(this, labels, obs, opts);
		cap.ring = out; cap.obs = obs;
		return out;
	};
	stub.setUnitSet('us');
	await stub.warmEpanet();

	// Overprints, read off what is drawn (the level harness's measure, N1 only).
	function overprints(L) {
		const doc = L.getDoc(), nodeEls = L.nodeEls(), linkEls = L.linkEls(), eps = EPS_PX / L.state().s;
		const holderOf = (id) => id.charAt(0) === 'n' ? nodeEls[id.slice(2)] : linkEls[id.slice(2)];
		if (cap.inline && cap.node) {
			const took = {};
			cap.inline.forEach((out) => out.forEach((r) => { if (!r.dropped) { took[r.id] = r; } }));
			cap.node = cap.node.map((r) => took[r.id] || r);
		}
		const drawn = [];
		[cap.node, cap.ring, cap.level].forEach((set) => (set || []).forEach((r) => {
			if (r.dropped) { return; }
			const h = holderOf(r.id);
			if (!V.shown(h)) { return; }
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
		const nsym = [];
		doc.nodes.forEach((n) => {
			const ne = nodeEls[n.id]; if (!ne || !ne.circle) { return; }
			const r = +ne.circle.getAttribute('r'), cx = +ne.circle.getAttribute('cx'), cy = +ne.circle.getAttribute('cy');
			nsym.push({ id: n.id, box: Collide.box(cx, cy, 2 * r, 2 * r, 0) });
		});
		const lsym = [];
		doc.links.forEach((l) => {
			const le = linkEls[l.id];
			if (!le || !le.symbolG || !le.symbolBox) { return; }
			const g = /translate\(([-0-9.e]+),([-0-9.e]+)\) rotate\(([-0-9.e]+)\)/.exec(le.symbolG.getAttribute('transform') || ''),
				k = /scale\(([-0-9.e]+),/.exec(le.symbolBox.getAttribute('transform') || '');
			if (g && k) { lsym.push(Collide.box(+g[1], +g[2], +k[1] * 24, +k[1] * 24, +g[3])); }
		});
		const br = [];
		drawn.forEach((d, i) => d.boxes.forEach((b) => {
			nsym.forEach((q) => { if (Collide.boxOverlapDepth(b, q.box) > eps) { br.push(d.id + ' on node ' + q.id); } });
			lsym.forEach((q) => { if (Collide.boxOverlapDepth(b, q) > eps) { br.push(d.id + ' on a valve or pump'); } });
			for (let j = i + 1; j < drawn.length; j++) {
				if (drawn[j].id === d.id) { continue; }
				drawn[j].boxes.forEach((c) => { if (Collide.boxOverlapDepth(b, c) > eps) { br.push(d.id + ' on ' + drawn[j].id); } });
			}
		}));
		return br;
	}

	// Labels that show two values or more have a form worth copying; one that shows one is one line
	// either way. A disagreement is a label whose near neighbours (nearest K within RADIUS_PX, at
	// least three) mostly take the other form.
	function forms(L) {
		const st = L.state(), ne = L.nodeEls(), items = [];
		L.getDoc().nodes.forEach((n) => {
			const e = ne[n.id];
			if (!e || e.empty || !V.shown(e) || !((e.lines || []).length >= 2)) { return; }
			const p = L.nodeAt(n);
			items.push({ id: n.id, x: p.x * st.s, y: p.y * st.s, inline: !!e.inline });
		});
		const out = { stackAmongLine: [], lineAmongStack: [] };
		items.forEach((a) => {
			const nb = items.filter((b) => b !== a).map((b) => ({ d: Math.hypot(a.x - b.x, a.y - b.y), inline: b.inline }))
				.filter((q) => q.d <= RADIUS_PX).sort((p, q) => p.d - q.d).slice(0, K);
			if (nb.length < 3) { return; }
			const ni = nb.filter((q) => q.inline).length;
			if (!a.inline && ni * 2 > nb.length) { out.stackAmongLine.push(a.id); }
			if (a.inline && (nb.length - ni) * 2 > nb.length) { out.lineAmongStack.push(a.id); }
		});
		return out;
	}

	async function run(sc, mutate) {
		const o = await V.openScene(stub, sc, mutate), L = o.L, views = [];
		if (sc.fields) {
			const ls = L.labelSettings();
			Object.keys(ls.node).forEach((k) => { ls.node[k] = sc.fields.indexOf(k) >= 0; });
		}
		for (const m of sc.mults) {
			cap = {};
			L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m });
			const t0 = process.hrtime.bigint();
			L.refreshLabelText();
			const ms = Number(process.hrtime.bigint() - t0) / 1e6;
			const c = V.countShown(L), f = forms(L), op = overprints(L), e163 = L.nodeEls()['163'];
			views.push({ m: m, c: c, f: f, op: op, ms: ms,
				n163: e163 ? { shown: V.shown(e163), rows: (e163.lines || []).length, inline: !!e163.inline } : null });
		}
		return views;
	}

	const tot = { before: { shown: 0, rows: 0, line: 0, dis: 0, ms: 0, op: 0 }, after: { shown: 0, rows: 0, line: 0, dis: 0, ms: 0, op: 0 } };
	let n163Seen = 0;
	for (const sc of SCENES) {
		// Two rounds each, the first a warm-up: the second round's times are the ones compared.
		await run(sc, conformOff); await run(sc, undefined);
		const before = await run(sc, conformOff), after = await run(sc, undefined);
		after.forEach((a, i) => {
			const b = before[i], tag = sc.name + ' ' + a.m + 'x';
			[['before', b], ['after', a]].forEach(([k, v]) => {
				tot[k].shown += v.c.nodesShown; tot[k].rows += v.c.nodeRows; tot[k].line += v.c.nodeInline;
				tot[k].dis += v.f.stackAmongLine.length + v.f.lineAmongStack.length; tot[k].ms += v.ms; tot[k].op += v.op.length;
			});
			if (TABLE) {
				console.log(`        ${tag}: nodes ${b.c.nodesShown} -> ${a.c.nodesShown}, values ${b.c.nodeRows} -> ${a.c.nodeRows}, one line ${b.c.nodeInline} -> ${a.c.nodeInline}, ` +
					`disagree (stack among lines / line among stacks) ${b.f.stackAmongLine.length}/${b.f.lineAmongStack.length} -> ${a.f.stackAmongLine.length}/${a.f.lineAmongStack.length}, ` +
					`overprints ${b.op.length} -> ${a.op.length}, ${b.ms.toFixed(0)} -> ${a.ms.toFixed(0)} ms`);
			}
			const was = new Set(b.op), added = a.op.filter((x) => !was.has(x));
			ok(tag + ': no overprint added', added.length === 0, `${b.op.length} -> ${a.op.length}` + (added.length ? '; e.g. ' + added.slice(0, 3).join('; ') : ''));
			ok(tag + ': no fewer labels or values', a.c.nodesShown >= b.c.nodesShown && a.c.nodeRows >= b.c.nodeRows,
				`${b.c.nodesShown} -> ${a.c.nodesShown} labels, ${b.c.nodeRows} -> ${a.c.nodeRows} values`);
			ok(tag + ': stacks among one-line neighbours do not rise', a.f.stackAmongLine.length <= b.f.stackAmongLine.length,
				`${b.f.stackAmongLine.length} -> ${a.f.stackAmongLine.length}`);
			if (sc.name === 'Novato-HP' && a.m === 3.5 && b.n163 && b.n163.shown && b.n163.rows >= 2 && !b.n163.inline && b.f.stackAmongLine.indexOf('163') >= 0) {
				n163Seen++;
				ok(tag + ': N163, stacked among one-line neighbours on master, is one line', a.n163 && a.n163.shown && a.n163.inline && a.n163.rows === b.n163.rows,
					JSON.stringify(b.n163) + ' -> ' + JSON.stringify(a.n163));
			}
		});
	}
	ok('N163 is stacked among one-line neighbours on master in the Novato view at 3.5x', n163Seen === 1, n163Seen + ' views');
	const pct = (x) => x.toFixed(1);
	console.log(`        all views: nodes shown ${tot.before.shown} -> ${tot.after.shown}, values ${tot.before.rows} -> ${tot.after.rows}, one line ${tot.before.line} -> ${tot.after.line}, ` +
		`disagreements ${tot.before.dis} -> ${tot.after.dis}, overprints ${tot.before.op} -> ${tot.after.op}, layout ${pct(tot.before.ms)} -> ${pct(tot.after.ms)} ms (${pct(100 * (tot.after.ms / tot.before.ms - 1))}%)`);
	ok('disagreements fall in total', tot.after.dis < tot.before.dis, tot.before.dis + ' -> ' + tot.after.dis);
	ok('layout time rises under 5% (all views)', tot.after.ms <= tot.before.ms * 1.05, pct(tot.before.ms) + ' -> ' + pct(tot.after.ms) + ' ms');
	console.log('\nlabel-neighbours-harness: ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
