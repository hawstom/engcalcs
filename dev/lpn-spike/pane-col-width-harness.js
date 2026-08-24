// THE PANE-TABLE COLUMN WIDTHS ARE A DECLARED LIST, AND THIS IS THE THING THAT KEEPS THEM ONE.
//
// Tom gave the widths as multiples of the 7em every box used to be (2026-08-23): Minor loss 0.2,
// Roughness 0.3, Length 0.6, Diameter 0.3, and 0.5 for the tank, reservoir and junction figures.
// That list is written into the comment above `.lpn-pane-table input` in css/engcalcs.css, and the
// numbers themselves live on the column descriptors in js/looped-network.js as `em:`.
//
// **TWO PLACES HOLDING ONE INTENT IS THE WHOLE PROBLEM.** By the time this harness was written the
// code had already drifted from the declared list in two columns -- Diameter sat at 2.8em (0.4, not
// the declared 0.3) and Minor loss at 2.1em -- and nothing said so. One of those two was a
// deliberate, documented override and the other was simply missed, and from the outside they looked
// identical. So the list below is the AUTHORITY, and a deliberate override has to be written here,
// where the next person reads the intent, rather than only in the file that departs from it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const BASE_EM = 7;              // the width every box used to be
const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

// key -> the multiple of 7em Tom declared. A key absent here is a column that names no width and
// therefore keeps the 7em default; that is legitimate and is asserted separately below.
const DECLARED = {
	// 0.3, not the declared 0.2: Tom asked for the Minor loss box 1.5x wider on PC
	// (2026-08-23), which is 1.4em x 1.5 = 2.1em = 0.3 x 7em. The phone box is scaled
	// separately, 1.25x, and lives in the max-width:640px block in css/engcalcs.css.
	km:           0.3,
	// 0.33, not the declared 0.3: Tom asked for the Roughness box 10% wider on PC
	// (2026-08-23). 0.3 x 1.1 = 0.33 x 7em = 2.31em. The phone box is untouched -- below
	// the breakpoint every box in these tables is a flat 3.5em.
	roughness:    0.33,
	length:       0.6,
	diameter:     0.3,
	elev:         0.5,   // junction, reservoir and tank all reach this through paneColElev()
	demand:       0.5,
	head:         0.5,
	level:        0.5,
	minLevel:     0.5,
	maxLevel:     0.5,
	tankDiameter: 0.5
};

// Columns that carry no width on purpose. id and the two link ends are text, not boxes; a valve's
// setting is a different quantity per row, so no one width fits it.
const NO_WIDTH = ['id', 'setting', 'valveType'];

let pass = 0, fail = 0;
function report(ok, what, detail) {
	if (ok) { pass++; console.log('  ok   ' + what); }
	else { fail++; console.log('  FAIL ' + what + (detail ? '   ' + detail : '')); }
}

// Every `{ key: 'x', ... em: N ... }` descriptor, however the two are ordered within it. The body
// is taken by BALANCING BRACES rather than by a character cap: several descriptors carry an inline
// `unit: function () { ... }`, and a non-greedy `}` stops at that inner brace and reports the
// column as having no width at all. A reader that silently misreads its target is worse than none.
const found = {};
function bodyAt(open) {
	let depth = 0;
	for (let i = open; i < src.length; i++) {
		if (src[i] === '{') { depth++; }
		else if (src[i] === '}') { depth--; if (depth === 0) { return src.slice(open, i + 1); } }
	}
	return null;
}
const re = /\{\s*key:\s*'([A-Za-z]+)'/g;
let m;
while ((m = re.exec(src)) !== null) {
	const body = bodyAt(m.index);
	if (body === null) { continue; }
	// Only this object's own `em:`, not one belonging to a descriptor nested inside it.
	const flat = body.replace(/\{[^{}]*\}/g, '');
	const em = /(?:^|[,\s])em:\s*([0-9.]+)/.exec(flat);
	if (em) { found[m[1]] = parseFloat(em[1]); }
	else if (found[m[1]] === undefined) { found[m[1]] = null; }
}

console.log('-- every declared column is at its declared multiple of ' + BASE_EM + 'em --');
Object.keys(DECLARED).forEach(function (key) {
	const want = +(DECLARED[key] * BASE_EM).toFixed(2);
	const got = found[key];
	report(got === want, key + ' is ' + DECLARED[key] + ' x ' + BASE_EM + 'em = ' + want + 'em',
		got === undefined ? 'no such column key in buildPaneTables()' : 'got ' + got + 'em');
});

console.log('\n-- the text columns name no width, so they keep the 7em default --');
NO_WIDTH.forEach(function (key) {
	report(found[key] === null || found[key] === undefined,
		key + ' declares no em', 'got ' + found[key] + 'em');
});

console.log('\n-- the declared list is stated in the stylesheet too, and still says this --');
const css = fs.readFileSync(path.join(__dirname, '../../css/engcalcs.css'), 'utf8');
// Whitespace-normalised: the note wraps mid-phrase, so "Diameter 0.3" is split across two lines
// in the source and a literal search for it would fail on formatting rather than on meaning.
const noteRaw = /multiples of the 7em every box used to be[\s\S]*?\*\//.exec(css);
const note = noteRaw ? [noteRaw[0].replace(/\s+/g, ' ')] : null;
report(!!note, 'css/engcalcs.css carries the declared list beside --lpn-pane-col-w');
if (note) {
	// A BOUNDARY, NOT indexOf: 'Roughness 0.3' is a prefix of 'Roughness 0.33', so a substring
	// search reports a stale note as fresh on exactly the edit most likely to make it stale.
	[['Minor loss', 0.3], ['Roughness', 0.33], ['Length', 0.6], ['Diameter', 0.3]].forEach(function (p) {
		report(new RegExp(p[0] + ' ' + String(p[1]).replace('.', '\\.') + '(?![0-9])').test(note[0]),
			'the stylesheet note still says ' + p[0] + ' ' + p[1]);
	});
	report(/0\.5 for the tank, reservoir and junction/.test(note[0]),
		'the stylesheet note still says 0.5 for tank, reservoir and junction');
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
if (fail) {
	console.log('\nA width and its declaration disagree. The declared list in this file is the\n'
		+ 'authority: change it here first, with the reason, then change js/looped-network.js.');
	process.exit(1);
}
