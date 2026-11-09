// THE 17-VIEW BENCH for the node label placement flags (ROADMAP Task 812): the 13 views of
// label-views-lib.js (Net3, Novato, the 600-junction network) and Novato's notches 11 to 14 about N163
// with Tom's fields, on the DOM stub. Prints labels shown, values and layout time per flag set.
//   node dev/lpn-spike/label-open-side-bench.js [flag ...]     e.g.  LPN_TIE_LINE LPN_LATE_RETRY
// A flag named is switched ON, every other `var LPN_<flag> = ...` listed in FLAGS is switched OFF; the
// first column is always BASE (LPN_OPEN_SIDE alone), the second the flags named (`none` for none). Time is the best of three passes per view.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const V = require('./label-views-lib.js');
const FLAGS = ['LPN_OPEN_SIDE', 'LPN_YIELD', 'LPN_TIE_LINE'];

const COLLIDE_FLAGS = { LPN_OWN_SYMBOL: 'ownSymbol' };   // switches on lpnCollide.config
const BASE = process.env.BENCH_BASE !== undefined ? process.env.BENCH_BASE.split('+').filter(Boolean) : ['LPN_OPEN_SIDE'];   // the branch before the flags that follow it
const EX = path.join(__dirname, '..', 'water-network-examples');
const NOVATO = { name: 'Novato', file: path.join(EX, 'Net3-Novato-CA-World.lwn') };

function mutator(on) {
	return (src) => {
		FLAGS.forEach((f) => {
			const re = new RegExp('var ' + f + ' = (true|false);');
			if (re.test(src)) { src = src.replace(re, 'var ' + f + ' = ' + (on.indexOf(f) >= 0) + ';'); }
		});
		if (process.env.BENCH_LEADER) { src = src.replace(/var LABEL_LEADER_THRESHOLD = [0-9.]+;/, 'var LABEL_LEADER_THRESHOLD = ' + process.env.BENCH_LEADER + ';'); }
		if (process.env.BENCH_PIPE_AMBIG) { src = src.replace(/LPN_AMBIG_PIPE_RATIO = [0-9.]+/, 'LPN_AMBIG_PIPE_RATIO = ' + process.env.BENCH_PIPE_AMBIG); }
		if (process.env.BENCH_AMBIG) { src = src.replace(/LPN_AMBIG_RATIO = [0-9.]+/, 'LPN_AMBIG_RATIO = ' + process.env.BENCH_AMBIG); }
		if (process.env.BENCH_SHORT) { src = src.replace(/LPN_SHORT_LEADER_TEXT = [0-9.]+/, 'LPN_SHORT_LEADER_TEXT = ' + process.env.BENCH_SHORT); }
		// a mutation that changes nothing is an error in the loader; touch the file's first line
		return src + '\n//bench ' + on.join(',') + '\n';
	};
}

// **ONE SCALE FOR EVERY BUILD**: Zoom to fit lands a build's own fraction of a percent to two percent apart
// from another's, and where labels tie on exact widths that moves a label. The origins are taken once,
// from the layout before the flags, and every flag set is laid out at them.
const ORIGINS = {};
async function originOf(stub, sc, key, canvas) {
	if (!ORIGINS[key]) {
		const cfg = require(stub.ROOT + 'js/lpn-collide.js').lpnCollide.config, was = cfg.ownSymbol;
		cfg.ownSymbol = false;
		const o = await V.openScene(stub, sc, mutator([]));
		if (canvas) {
			o.L.setCanvas(canvas[0], canvas[1]); o.L.noteMapSized();
			const ls = o.L.labelSettings();
			Object.keys(ls.node).forEach((k) => { ls.node[k] = ['id', 'demand', 'elev', 'head', 'pressure'].indexOf(k) >= 0; });
			o.L.zoomExtent();
		}
		cfg.ownSymbol = was;
		ORIGINS[key] = canvas ? { s1: o.L.state().s } : { cx: o.cx, cy: o.cy, s1: o.s1 };
	}
	return ORIGINS[key];
}
// PIPES ALONE (Tom, 2026-11-09): every node label off, Novato at the wheel's 17 notches about N163 and
// Net3 at its fit view and closer, to see how pipe labels perform by themselves.
async function pipesAlone(stub, on) {
	const cfg = require(stub.ROOT + 'js/lpn-collide.js').lpnCollide.config;
	Object.keys(COLLIDE_FLAGS).forEach((f) => { cfg[COLLIDE_FLAGS[f]] = on.indexOf(f) >= 0; });
	const rows = [];
	const o = await V.openScene(stub, NOVATO, mutator(on)), L = o.L;
	L.setCanvas(1920, 1000); L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach((k) => { ls.node[k] = false; });
	L.zoomExtent();
	const s1 = L.state().s, p = L.nodeAt(L.getDoc().nodes.find((n) => n.id === '163'));
	for (let k = 0; k <= 16; k++) {
		L.setView({ cx: p.x, cy: p.y, s: s1 * Math.pow(1.1, k) });
		let best = Infinity;
		for (let i = 0; i < 3; i++) { const t0 = process.hrtime.bigint(); L.refreshLabelText(); best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6); }
		const c = V.countShown(L);
		rows.push({ v: 'Novato pipes-alone ' + k, shown: c.pipesShown, values: c.pipeRows, nodes: 0, nodeRows: 0, leaders: c.leaders, ms: best, asked: c.pipes, askedRows: c.pipeRowsAsked });
	}
	return rows;
}
async function bench(stub, on) {
	if (process.env.BENCH_PIPES) { return pipesAlone(stub, on); }
	const cfg = require(stub.ROOT + 'js/lpn-collide.js').lpnCollide.config;
	Object.keys(COLLIDE_FLAGS).forEach((f) => { cfg[COLLIDE_FLAGS[f]] = on.indexOf(f) >= 0; });
	const rows = [];
	for (const sc of V.SCENES) {
		const o0 = await V.openScene(stub, sc, mutator(on)), L = o0.L, o = Object.assign({}, o0, await originOf(stub, sc, sc.name));
		for (const m of sc.mults) {
			if (process.env.BENCH_HIST) { L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m * 1.07 }); L.refreshLabelText(); }
			L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m });
			let best = Infinity;
			for (let i = 0; i < 3; i++) { const t0 = process.hrtime.bigint(); L.refreshLabelText(); best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6); }
			const c = V.countShown(L);
			rows.push({ v: sc.name + ' ' + m + 'x', shown: c.pipesShown + c.nodesShown, values: c.pipeRows + c.nodeRows, nodes: c.nodesShown, nodeRows: c.nodeRows, leaders: c.leaders, ms: best });
		}
	}
	const canvases = process.env.BENCH_WIDE ? [[1300, 750], [1400, 900], [1920, 1000]] : [[1300, 750]];
	for (const [cw, ch] of canvases) {
	const o = await V.openScene(stub, NOVATO, mutator(on)), L = o.L;
	L.setCanvas(cw, ch); L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach((k) => { ls.node[k] = ['id', 'demand', 'elev', 'head', 'pressure'].indexOf(k) >= 0; });
	L.zoomExtent();
	const s1 = (await originOf(stub, NOVATO, 'N163-' + cw + 'x' + ch, [cw, ch])).s1, p = L.nodeAt(L.getDoc().nodes.find((n) => n.id === '163'));
	for (const k of (process.env.BENCH_WIDE ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] : [11, 12, 13, 14])) {
		if (process.env.BENCH_HIST) { L.setView({ cx: p.x, cy: p.y, s: s1 * Math.pow(1.1, k) * 1.07 }); L.refreshLabelText(); }
		L.setView({ cx: p.x, cy: p.y, s: s1 * Math.pow(1.1, k) });
		let best = Infinity;
		for (let i = 0; i < 3; i++) { const t0 = process.hrtime.bigint(); L.refreshLabelText(); best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6); }
		const c = V.countShown(L);
		rows.push({ pipes: c.pipesShown, level: c.level, v: 'Novato N163 ' + cw + ' ' + k, shown: c.pipesShown + c.nodesShown, values: c.pipeRows + c.nodeRows, nodes: c.nodesShown, nodeRows: c.nodeRows, leaders: c.leaders, ms: best });
	}
	}
	return rows;
}

(async function () {
	const stub = require('./lpn-dom-stub.js');
	stub.setUnitSet('us');
	await stub.warmEpanet();
	// variants are separated by commas on the command line, flags within a variant by plus: A+B,C
const sets = process.argv.slice(2).length ? process.argv[2].split(',').map((v) => v.split('+').filter((a) => a !== 'none')) : [[]];
	const base = await bench(stub, BASE);
	const out = [{ on: BASE, rows: base }];
	for (const s of sets) { if (process.argv.length > 2) { out.push({ on: s, rows: await bench(stub, s) }); } }
	const detail = process.env.BENCH_DETAIL ? out.length - 1 : 1;
	const sum = (r, k) => r.reduce((t, x) => t + x[k], 0);
	out.forEach((o) => {
		console.log(`flags [${o.on.join(' ')}]: ${o.rows.length} views, labels ${sum(o.rows, 'shown')}, values ${sum(o.rows, 'values')}, leaders ${sum(o.rows, 'leaders')}, time ${sum(o.rows, 'ms').toFixed(0)} ms`);
	});
	if (process.env.BENCH_ROWS) { base.forEach((r) => console.log('ROW ' + r.v + ' labels ' + r.shown + ' values ' + r.values + ' leaders ' + r.leaders + ' ms ' + r.ms.toFixed(0))); }
	if (out.length > 1 && process.env.BENCH_DETAIL) {
		out[detail].rows.forEach((r, i) => {
			const b = out[0].rows[i];
			console.log(`   ${r.v.padEnd(16)} labels ${b.shown} -> ${r.shown}  values ${b.values} -> ${r.values}  ms ${b.ms.toFixed(0)} -> ${r.ms.toFixed(0)}` + (r.pipes !== undefined ? `  nodes ${b.nodes} -> ${r.nodes}, pipes ${b.pipes} -> ${r.pipes}, level ${b.level} -> ${r.level}` : ''));
		});
	}
	process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
