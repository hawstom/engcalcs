// A PIPE LABEL NEVER SHEDS A FIELD WHILE A CLEAN SPOT FOR ALL ITS FIELDS EXISTS (ROADMAP Task 812, round 5;
// Tom, 2026-11-09: *"It's bad that pipe leaders are so eager to get along the pipes that they shed
// properties when there is convenient open space to show everything on a leader."*). Run with:
//   node dev/lpn-spike/label-pipe-full-fields-harness.js
//
// **A CONSTRUCTED CASE**: a reservoir and three junctions on a line, the middle pipe short, in empty
// ground, with link fields ID, Q, V. Along its short pipe the middle label cannot show all three, and
// there is open ground all round it. Swept over scales; at every scale where the rule off (the
// build before round 5) leaves that label with fewer than three fields, the rule on shows it with all
// three, level beside the pipe. And the contrary: ringed by Text objects (an obstacle no label may
// overlap), the same label is NOT given a whole-label spot, since none is clean.
// ALSO: on Novato and the 600-junction network, no view shows fewer pipe fields with the rule than
// without it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const V = require('./label-views-lib.js');

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'pipe-full-'));
const OFF = (src) => src.replace('var LPN_LEVEL_FULL_FIRST = true', 'var LPN_LEVEL_FULL_FIRST = false') + '\n//off\n';

function scene(withText) {
	const d = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'water-network-examples', 'Net3.lwn'), 'utf8'));
	const j = (id, x, y) => ({ id: id, type: 'junction', x: x, y: y, elev: 100, _demand: 5 });
	d.nodes = [{ id: 'R', type: 'reservoir', x: 0, y: 0, _head: 300 }, j('A', 20, 0), j('B', 22.5, 0), j('C', 42.5, 0)];
	const p = (id, a, b, len) => ({ id: id, type: 'pipe', from: a, to: b, verts: [], _diameter: 99, _roughness: 120, _length: len, lenAuto: false, _status: 'open', _k: 0 });
	d.links = [p('P1', 'R', 'A', 2000), p('P2', 'A', 'B', 250), p('P3', 'B', 'C', 2000)];
	d.labels = [];
	if (withText) {
		// Text objects round the middle pipe, close enough to hold every spot within 5 text heights of it.
		for (let k = 0; k < 24; k++) {
			const a = k * Math.PI / 12, x = 21.25 + 1.6 * Math.cos(a), y = 1.6 * Math.sin(a);
			d.labels.push({ id: 'X' + (k + 1), text: 'WWWWWWWWWW', x: x, y: y, anchorNode: null, sizeMult: 1 });
		}
		d.nextId = Object.assign({}, d.nextId, { X: 25 });
	}
	d.nextId = Object.assign({}, d.nextId);
	d.scenarios = [{ id: 'base', name: 'Base', isBase: true, overrides: {} }];
	d.patterns = []; d.defaultPattern = '1'; d.controls = []; d.curves = [];
	const f = path.join(DIR, withText ? 'chain-ring.lwn' : 'chain-open.lwn');
	fs.writeFileSync(f, JSON.stringify(d));
	return f;
}
function state(L, id) {
	const le = L.linkEls()[id], sh = V.shown(le), f = le.levelBeside && le.levelForm;
	return { shown: sh, level: !!le.levelBeside, n: sh ? (f ? f.lines.length : (le.lines || []).length) : 0, asked: (le.allLines || []).length };
}

(async function () {
	const stub = require('./lpn-dom-stub.js');
	stub.setUnitSet('us');
	await stub.warmEpanet();
	for (const withText of [false, true]) {
		const file = scene(withText), sc = { name: 'chain', file: file, view: 'fit' };
		const on = await V.openScene(stub, sc, null), off = await V.openScene(stub, sc, OFF);
		// Pipes alone: no node label stands near the middle pipe.
		[on, off].forEach((o) => { const ls = o.L.labelSettings(); Object.keys(ls.node).forEach((k) => { ls.node[k] = false; }); });
		let shedOff = 0, wholeOn = 0, fewerOn = 0;
		for (let m = 1; m <= 12; m += 0.5) {
			for (const o of [on, off]) {
				o.L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m }); o.L.refreshLabelText();
			}
			const a = state(on.L, 'P2'), b = state(off.L, 'P2');
			if (b.n < b.asked) {
				shedOff++;
				if (a.n === a.asked) { wholeOn++; } else { fewerOn++; }
			}
			if (!withText) { ok('open ground, x' + m + ': rule on shows P2 at least as many fields as off', a.n >= b.n, `${b.n} -> ${a.n} of ${a.asked}`); }
		}
		if (!withText) {
			ok('open ground: there are scales where the rule off sheds P2', shedOff > 0, String(shedOff));
			ok('open ground: at every such scale the rule on shows P2 with all its fields', wholeOn === shedOff && fewerOn === 0, `${wholeOn} of ${shedOff}`);
		} else {
			ok('ringed by Text objects: P2 sheds at some scale (the ring leaves no clean spot)', shedOff > 0, String(shedOff));
			ok('ringed by Text objects: no whole-label spot is taken where none is clean', wholeOn === 0, `${wholeOn} of ${shedOff} scales took one`);
		}
	}
	// No view shows fewer pipe fields with the rule than without it (the whole-network check lives in the
	// browser harness, label-pipe-fields-browser-harness.js; this one is the headless sample).
	for (const sc of [V.SCENES[1], V.SCENES[2]]) {
		const on = await V.openScene(stub, sc, null), off = await V.openScene(stub, sc, OFF);
		let fewer = 0, more = 0;
		for (const m of sc.mults) {
			const r = [on, off].map((o) => { o.L.setView({ cx: o.cx, cy: o.cy, s: o.s1 * m }); o.L.refreshLabelText(); return V.countShown(o.L).pipeRows; });
			if (r[0] < r[1]) { fewer++; }
			if (r[0] > r[1]) { more++; }
		}
		ok(sc.name + ': no scale shows fewer pipe fields with the rule than without it', fewer === 0, `${fewer} scales fewer, ${more} more`);
		ok(sc.name + ': some scale shows more', more > 0);
	}
	fs.rmSync(DIR, { recursive: true, force: true });
	console.log('\nlabel-pipe-full-fields-harness: ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
