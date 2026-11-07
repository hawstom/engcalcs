// A NODE LABEL WITH OPEN GROUND TO ONE SIDE TAKES ITS WHOLE LINE THERE (ROADMAP Task 812; Tom,
// 2026-11-06, on Novato). Run with:
//   node dev/lpn-spike/label-open-side-harness.js        (OPEN_SIDE_TABLE=1 prints every notch)
//
// Tom's sequence: open Novato, node labels ID, Qb, Z, H, P, then the wheel from Zoom to fit, a notch
// being the page's own 1.1 step, round N163. At 11 to 14 notches N163 showed only P, or H and P, or
// nothing, "though there is room for its entire label as one line", and N265 stacked at 14 "though
// eastward space is unlimited". The east WAS open. N163 was refused it because its neighbours' labels
// (N164, N166) were still standing on it as stacks, and they were tried after N163 in the drop order. A
// label that takes its line now gives its stack's ground back at once, and the labels that found
// nothing are tried once more (insertInlineNodeLabels()). A candidate run reaching 12 text heights
// out, east and west, was built first and added nothing on any view; it is not in the code.
//
// Laid out on the DOM stub at 1300 x 750 and 1400 x 900, each notch about N163, twice: as shipped
// and with LPN_OPEN_SIDE off (master's layout). ASSERTED:
//   * at notches 11, 12, 13 and 14, N163 shows all five fields on ONE line (it showed fewer, or nothing,
//     without the far side), on both canvases;
//   * at notch 13, N265 shows all five fields on one line too (it stands in the open at 11 and 13; at
//     12 and 14 a pipe label, L321, stands on its east side and every far position's leader would cross
//     it, so the stack stays: printed, not asserted);
//   * no notch, 0 to 14, shows fewer node labels or fewer values than without the far side (overprints
//     are held by the harnesses that lay out the same labels (pipe-label-level-harness.js));
//   * the layout time of the whole sequence does not double (measured alone: about +4%).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const V = require('./label-views-lib.js');

const OFF_FROM = 'var LPN_OPEN_SIDE = true;';
function openOff(src) {
	if (src.split(OFF_FROM).length !== 2) { throw new Error('LPN_OPEN_SIDE not found exactly once'); }
	return src.replace(OFF_FROM, 'var LPN_OPEN_SIDE = false;');
}
const TABLE = process.env.OPEN_SIDE_TABLE === '1';
const EX = path.join(__dirname, '..', 'water-network-examples');
const SC = { name: 'Novato', file: path.join(EX, 'Net3-Novato-CA-World.lwn'), fields: ['id', 'demand', 'elev', 'head', 'pressure'] };
const CANVASES = [[1300, 750], [1400, 900]];
const NOTCHES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const NAMED = ['161', '163', '164', '166', '265'];

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
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obs, opts) {
		const out = realFF.call(this, labels, obs, opts);
		if (opts && opts.strict && labels.length && labels[0].id.charAt(0) === 'n') { cap.inline = true; }
		return out;
	};
	stub.setUnitSet('us');
	await stub.warmEpanet();

	async function runCanvas(w, h, open) {
		const o = await V.openScene(stub, SC, open ? undefined : openOff), L = o.L, rows = [];
		L.setCanvas(w, h); L.noteMapSized();
		const ls = L.labelSettings();
		Object.keys(ls.node).forEach((k) => { ls.node[k] = SC.fields.indexOf(k) >= 0; });
		L.zoomExtent();
		const s1 = L.state().s, p = L.nodeAt(L.getDoc().nodes.find((n) => n.id === '163'));
		let ms = 0;
		for (const k of NOTCHES) {
			cap = {};
			L.setView({ cx: p.x, cy: p.y, s: s1 * Math.pow(1.1, k) });
			const t0 = process.hrtime.bigint();
			L.refreshLabelText();
			ms += Number(process.hrtime.bigint() - t0) / 1e6;
			const c = V.countShown(L), ne = L.nodeEls(), named = {};
			NAMED.forEach((id) => {
				const e = ne[id];
				named[id] = !e ? '-' : (!V.shown(e) ? 'hid' : ((e.inline ? 'line ' : 'stack ') + (e.lines || []).map((l) => l.field.charAt(0)).join('')));
			});
			rows.push({ k: k, c: c, named: named, full: Object.keys(named).filter((id) => named[id] === 'line idehp') });
		}
		return { rows: rows, ms: ms };
	}

	let sumOn = 0, sumOff = 0;
	for (const [w, h] of CANVASES) {
		await runCanvas(w, h, true); await runCanvas(w, h, false);   // warm-up
		const on = await runCanvas(w, h, true), off = await runCanvas(w, h, false), tag = w + 'x' + h;
		sumOn += on.ms; sumOff += off.ms;
		on.rows.forEach((r, i) => {
			const b = off.rows[i];
			if (TABLE) {
				console.log(`        ${tag} ${String(r.k).padStart(2)} notches: ` + NAMED.map((id) => `N${id} ${b.named[id]} -> ${r.named[id]}`).join('; ') +
					`; nodes ${b.c.nodesShown} -> ${r.c.nodesShown}, values ${b.c.nodeRows} -> ${r.c.nodeRows}`);
			}
			ok(`${tag} ${r.k} notches: no fewer node labels or values`, r.c.nodesShown >= b.c.nodesShown && r.c.nodeRows >= b.c.nodeRows,
				`${b.c.nodesShown} -> ${r.c.nodesShown} labels, ${b.c.nodeRows} -> ${r.c.nodeRows} values`);
		});
		[11, 12, 13, 14].forEach((k) => {
			const r = on.rows.find((x) => x.k === k), b = off.rows.find((x) => x.k === k);
			ok(`${tag} ${k} notches: N163 shows all five fields on one line`, r.named['163'] === 'line idehp', `${b.named['163']} -> ${r.named['163']}`);
		});
		const r13 = on.rows.find((x) => x.k === 13);
		ok(`${tag} 13 notches: N265 shows all five fields on one line`, r13.named['265'] === 'line idehp', r13.named['265']);
	}
	const pct = 100 * (sumOn / sumOff - 1);
	console.log(`        layout time of both sequences: ${sumOff.toFixed(0)} -> ${sumOn.toFixed(0)} ms (${pct.toFixed(1)}%)`);
	// Wall time on a shared machine swings by tens of percent; only a doubling is a finding here.
	ok('layout time does not double', pct < 100, pct.toFixed(1) + '%');
	console.log('\nlabel-open-side-harness: ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
