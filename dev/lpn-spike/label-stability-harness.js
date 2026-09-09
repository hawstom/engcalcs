// DOES ONE UNTOUCHED VIEW LAY OUT THE SAME WAY EVERY TIME (ROADMAP Task 539). Run with:
//
//   node dev/lpn-spike/label-stability-harness.js
//   node dev/lpn-spike/label-stability-harness.js --full     (every example, the record)
//   node dev/lpn-spike/label-stability-harness.js --measure <file.lwn> <mode> <passes>
//
// **A FLICKER IS WORSE THAN THE CROSSING IT REPLACES.** The gang repair shipped with Task 539
// phase two oscillating in a two-cycle on Net3-World: five layouts of one view, nothing touched
// between them, alternated A B A B A with four labels trading places every content pass -- a zoom
// step, an edit, a label toggle. **The crossing count was 5 in BOTH states**, which is why every
// harness in the family reported the drawing fixed while the screen jumped.
//
// So this asserts the layout and never the count: the label SET, where every box sits, whether each
// one drew a leader (label-crossing-measure.js's signature()), AND which labels the final shed hid.
// Passes after the first must be byte-identical to the first on both.
//
// **THE SHED IS ASSERTED SEPARATELY EVEN THOUGH THE SIGNATURE COVERS IT.** A hidden label is not in
// the drawn set, so a shed that changed its mind already moves the signature -- but the diff would
// read as a label appearing rather than as a hide, and the two have different remedies. The shed
// hid `{10, 185, 187, 199}` and `{10, 184, 187, 205}` alternately when this was first measured, so
// the set is named.
//
// **ONE EXAMPLE PER PROCESS**, because a second document loaded into a page that already holds one
// inherits its elements' measured widths and its label state.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { measure, EXAMPLES } = require('./label-crossing-measure.js');

// **TWO DRAWINGS BY DEFAULT, AND THE SECOND IS NOT A LUXURY.** Net3-World is the geographic
// headline and the drawing Tom marked; Net2 is an XY one, and both were two-cycling on master --
// so a fix that settles one and not the other is caught by the suite rather than by a person. The
// rest are one command away (--full, about four minutes) and are on the record in
// dev/label-placement-algorithms.md section 11.
const HEADLINE = ['Net3-Novato-CA-World.lwn', 'Net2.lwn'];
const PASSES = 5;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

function runOne(file, mode) {
	const r = spawnSync(process.execPath, [__filename, '--measure', file, mode, String(PASSES)],
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-6).join(' ') }; }
	return JSON.parse(m[1]);
}

// **WHAT A DIFFERENCE LOOKS LIKE, in the terms the reader would see it in**: which labels moved,
// and how far. A signature diff of 900 characters says nothing; "n:J12 moved 41 units" is the
// screen.
function diff(a, b) {
	const parse = function (sig) {
		const out = {};
		sig.split(' ').filter(Boolean).forEach(function (t) {
			const i = t.indexOf('@');
			out[t.slice(0, i)] = t.slice(i + 1);
		});
		return out;
	};
	const A = parse(a), B = parse(b), moved = [];
	Object.keys(A).forEach(function (k) {
		if (!(k in B)) { moved.push(k + ' gone'); return; }
		if (A[k] !== B[k]) { moved.push(k + ' ' + A[k] + ' -> ' + B[k]); }
	});
	Object.keys(B).forEach(function (k) { if (!(k in A)) { moved.push(k + ' appeared'); } });
	return moved;
}

function check(file, mode) {
	const got = runOne(file, mode);
	if (got.error) { report(false, 'measured ' + file + ' (' + mode + ')', got.error); return; }
	got.rows.forEach(function (row) {
		const sigs = row.passes.map(function (p) { return p.sig; });
		const first = sigs[0];
		const bad = [];
		sigs.forEach(function (s, i) { if (i && s !== first) { bad.push(i + 1); } });
		// **WHICH PASS REPEATS WHICH IS THE DIAGNOSIS**, and it is one line: A B A B A is a
		// two-cycle the coupling will never leave, A B C C C is a settle that merely takes two
		// passes, and the remedies are not the same.
		const seq = [], letters = [];
		sigs.forEach(function (s) {
			let i = seq.indexOf(s);
			if (i < 0) { i = seq.push(s) - 1; }
			letters.push(String.fromCharCode(65 + i));
		});
		const p0 = row.passes[0];
		// The shed's own victims, held to the same standard as the layout under them.
		const sheds = row.passes.map(function (p) { return p.shed; });
		const shedBad = sheds.filter(function (h, i) { return i && h !== sheds[0]; }).length;
		const label = file + ' x' + row.zoom + ' (' + mode + ')';
		// The pass's own wall time, medianed over the passes after the first -- the first in a
		// process is the JIT and not the drawing. Node with the DOM stub, so indicative only.
		const ms = row.passes.slice(1).map(function (p) { return p.ms; }).sort(function (a, b) { return a - b; });
		const detail = p0.drawn + ' drawn, ' + p0.hidden + '/' + p0.labels + ' hidden, '
			+ row.passes.map(function (p) { return p.pairs; }).join('/') + ' pairs, '
			+ (ms.length ? ms[Math.floor(ms.length / 2)].toFixed(0) : '?') + ' ms/pass';
		if (shedBad) {
			report(false, label + ': the shed hides the same labels every pass',
				sheds.map(function (h) { return '{' + (h || '-') + '}'; }).join('  /  '));
		} else {
			report(true, label + ': the shed hides the same labels every pass',
				'{' + (sheds[0] || '-') + '}');
		}
		if (bad.length) {
			const d = diff(first, sigs[bad[0] - 1]);
			report(false, label + ': ' + PASSES + ' passes are NOT identical',
				letters.join('') + '; ' + d.length + ' label(s): '
				+ d.slice(0, 6).join('; ') + '   [' + detail + ']');
		} else {
			report(true, label + ': ' + PASSES + ' passes identical', letters.join('') + '   ' + detail);
		}
	});
}

async function main() {
	const arg = process.argv[2];
	if (arg === '--measure') {
		const out = await measure(process.argv[3], process.argv[4] || 'both+shed',
			{ passes: Number(process.argv[5]) || PASSES });
		// EXIT EXPLICITLY, with the callback -- the vendored EPANET engine leaves a handle open and
		// a child that merely returns never exits (see label-crossing-harness.js).
		process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		return;
	}
	const named = process.argv.slice(2).filter(function (a) { return /\.lwn$/.test(a); });
	const files = arg === '--full'
		? fs.readdirSync(EXAMPLES).filter(function (f) { return /\.lwn$/.test(f); }).sort()
		: (named.length ? named : HEADLINE);
	// The SHIPPED mode is the default, because the stability that matters is the one a reader meets:
	// the repair and the shed both on. The bare repair routes are one argument away, and section 11d
	// records why they are worth asking for separately -- the two-cycle that started this was in the
	// gang route and the shed merely carried it onto the screen.
	const modes = process.argv.slice(2).filter(function (a) {
		return /^(off|brute|gang|both|dry)(\+shed)?$/.test(a);
	});
	console.log('--- five passes over one untouched view; the layout must not move ---');
	files.forEach(function (f) { (modes.length ? modes : ['both+shed']).forEach(function (m) { check(f, m); }); });
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });
