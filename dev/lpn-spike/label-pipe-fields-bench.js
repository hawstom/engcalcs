// PIPE LABELS' FIELDS, MEASURED (ROADMAP Task 812, round 5): per view, how many pipe labels are drawn,
// how many fields they show against the fields asked for, how many drew shed (fewer fields than asked),
// how many leaders are drawn and the layout time. Run it from a checkout; copy it into another
// checkout's dev/lpn-spike/ to measure that one (it reads only js/ and label-views-lib.js).
//   node dev/lpn-spike/label-pipe-fields-bench.js            (BENCH_ROWS=1 prints every view)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const V = require('./label-views-lib.js');
// FULL_FIRST=0 switches the full-fields-first level rule off (the branch before round 5's rule).
const MUT = process.env.FULL_FIRST === '0' ? (src) => src.replace('var LPN_LEVEL_FULL_FIRST = true', 'var LPN_LEVEL_FULL_FIRST = false') + '\n//off\n' : null;
const EX = path.join(__dirname, '..', 'water-network-examples');
const NOVATO = { name: 'Novato', file: path.join(EX, 'Net3-Novato-CA-World.lwn') };
const NET3 = { name: 'Net3', file: path.join(EX, 'Net3.lwn') };

function stats(L) {
	const c = V.countShown(L), doc = L.getDoc(), els = L.linkEls(), st = L.state(), byId = {};
	doc.nodes.forEach((n) => { byId[n.id] = n; });
	const inView = (p) => { const x = p.x * st.s + st.tx, y = p.y * st.s + st.ty; return x >= 0 && x <= V.W && y >= 0 && y <= V.H; };
	let shed = 0, hidden = 0;
	doc.links.forEach((l) => {
		const le = els[l.id]; if (!le || le.empty) { return; }
		const a = L.nodeAt(byId[l.from]), b = L.nodeAt(byId[l.to]);
		if (!a || !b || !(inView(a) || inView(b))) { return; }
		const asked = (le.allLines || le.lines || []).length;
		if (V.shown(le)) { const f = le.levelBeside && le.levelForm; if ((f ? f.lines.length : (le.lines || []).length) < asked) { shed++; } } else { hidden++; }
	});
	return { pipes: c.pipes, shown: c.pipesShown, rows: c.pipeRows, asked: c.pipeRowsAsked, shed: shed, hidden: hidden, level: c.level, leaders: c.leaders,
		nodeRows: c.nodeRows, nodes: c.nodesShown };
}
function timed(L) {
	let best = Infinity;
	for (let i = 0; i < 3; i++) { const t0 = process.hrtime.bigint(); L.refreshLabelText(); best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6); }
	return best;
}
async function views() {
	const stub = require('./lpn-dom-stub.js');
	const rows = [];
	for (const sc of V.SCENES) {
		const o = await V.openScene(stub, sc, MUT), L = o.L;
		for (const m of sc.mults) {
			L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m });
			const ms = timed(L);
			rows.push(Object.assign({ v: sc.name + ' ' + m + 'x', ms: ms }, stats(L)));
		}
	}
	// Novato about N163 at the wheel's notches, desktop and phone; Net3 on the phone.
	for (const [name, sc, cw, ch, notches] of [['Novato desk', NOVATO, 1920, 1000, [0, 3, 4, 6, 8, 9, 11, 13, 15]], ['Novato phone', NOVATO, 390, 760, [0, 3, 6, 9, 12]],
		['Net3 phone', NET3, 390, 760, [0, 3, 6, 9]], ['Net3 desk', NET3, 1920, 1000, [0, 3, 6, 9]]]) {
		const o = await V.openScene(stub, sc, MUT), L = o.L;
		L.setCanvas(cw, ch); L.noteMapSized();
		L.zoomExtent();
		const s1 = L.state().s, ctr = sc === NOVATO ? L.nodeAt(L.getDoc().nodes.find((n) => n.id === '163')) : { x: o.cx, y: o.cy };
		for (const k of notches) {
			L.setView({ cx: ctr.x, cy: ctr.y, s: s1 * Math.pow(1.1, k) });
			const ms = timed(L);
			rows.push(Object.assign({ v: name + ' ' + k, ms: ms }, stats(L)));
		}
	}
	return rows;
}
(async function () {
	const stub = require('./lpn-dom-stub.js');
	stub.setUnitSet('us');
	await stub.warmEpanet();
	const rows = await views();
	const sum = (k) => rows.reduce((t, r) => t + r[k], 0);
	if (process.env.BENCH_ROWS) { rows.forEach((r) => console.log(`ROW ${r.v.padEnd(18)} pipes ${r.pipes} shown ${r.shown} rows ${r.rows}/${r.asked} shed ${r.shed} hidden ${r.hidden} level ${r.level} leaders ${r.leaders} nodeRows ${r.nodeRows} ms ${r.ms.toFixed(0)}`)); }
	console.log(`TOTAL ${rows.length} views: pipes shown ${sum('shown')}, pipe fields ${sum('rows')} of ${sum('asked')}, shed ${sum('shed')}, hidden ${sum('hidden')}, level ${sum('level')}, leaders ${sum('leaders')}, node fields ${sum('nodeRows')}, ms ${sum('ms').toFixed(0)}`);
	process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
