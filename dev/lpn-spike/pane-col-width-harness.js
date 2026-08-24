// THE PANE-TABLE COLUMN WIDTHS ARE A DECLARED LIST, AND THIS IS THE THING THAT KEEPS THEM ONE.
//
// Tom first gave the widths as multiples of the 7em every box used to be (2026-08-23), then scaled
// four of them again, per column and per platform, over the next two rounds of review. THE MULTIPLE
// HAS STOPPED BEING THE INTENT: after "for k, scale it again 1.25 to 1.5... for Roughness, about
// 2.5... for D, 1.5 on PC" plus "round the final widths to nice numbers always", what he is choosing
// is a width, and 3em and 6em are the nice numbers, not 0.4286 and 0.857 of a 7em that no box has.
// So the list below is in EM, the unit the stylesheet and the descriptors both speak.
//
// **TWO PLACES HOLDING ONE INTENT IS THE WHOLE PROBLEM.** By the time this harness was written the
// code had already drifted from the declared list in two columns -- Diameter sat at 2.8em and Minor
// loss at 2.1em -- and nothing said so. One of those was a deliberate, documented override and the
// other was simply missed, and from the outside they looked identical. So the list below is the
// AUTHORITY, and a deliberate override has to be written here, where the next person reads the
// intent, rather than only in the file that departs from it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_EM = 7;           // what a column that declares nothing still gets
const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

// key -> the width in em, and the round of review that set it. A key absent here is a column that
// names no width and therefore keeps the 7em default; that is legitimate and is asserted below.
const DECLARED = {
	// Round 1 set these from Tom's multiples of 7em. Round 3 (2026-08-23, "I confess I am being
	// too stingy; forgive me. Round the final widths to nice numbers always") scaled three of
	// them again and rounded each to a whole or half em.
	km:           3,     // 1.4 -> 2.1 (x1.5) -> 3 (x1.43 of that; he asked 1.25-1.5)
	roughness:    6,     // 2.1 -> 2.31 (+10%) -> 6, to hold a Darcy-Weisbach e like 0.0015 mm
	diameter:     3,     // 2.1 -> 3 (x1.5 on PC, as asked)
	length:       4.2,
	elev:         3.5,   // junction, reservoir and tank all reach this through paneColElev()
	demand:       3.5,
	head:         3.5,
	level:        3.5,
	minLevel:     3.5,
	maxLevel:     3.5,
	tankDiameter: 3.5
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

console.log('-- every declared column is at its declared width --');
Object.keys(DECLARED).forEach(function (key) {
	const want = DECLARED[key];
	const got = found[key];
	report(got === want, key + ' is ' + want + 'em',
		got === undefined ? 'no such column key in buildPaneTables()' : 'got ' + got + 'em');
});

console.log('\n-- the text columns name no width, so they keep the 7em default --');
NO_WIDTH.forEach(function (key) {
	report(found[key] === null || found[key] === undefined,
		key + ' declares no em, so it keeps ' + DEFAULT_EM + 'em', 'got ' + found[key] + 'em');
});

console.log('\n-- the declared list is stated in the stylesheet too, and still says this --');
const css = fs.readFileSync(path.join(__dirname, '../../css/engcalcs.css'), 'utf8');
// Whitespace-normalised: the note wraps mid-phrase, so "Diameter 0.3" is split across two lines
// in the source and a literal search for it would fail on formatting rather than on meaning.
const noteRaw = /THE BOX WIDTH BELONGS TO THE COLUMN[\s\S]*?\*\//.exec(css);
const note = noteRaw ? [noteRaw[0].replace(/\s+/g, ' ')] : null;
report(!!note, 'css/engcalcs.css carries the declared list beside --lpn-pane-col-w');
if (note) {
	// A BOUNDARY, NOT indexOf: '3em' is a prefix of '3.5em', so a substring search reports a
	// stale note as fresh on exactly the edit most likely to make it stale.
	[['Minor loss', 3], ['Roughness', 6], ['Length', 4.2], ['Diameter', 3]].forEach(function (p) {
		report(new RegExp(p[0] + ' ' + String(p[1]).replace('.', '\\.') + 'em(?![0-9.])').test(note[0]),
			'the stylesheet note still says ' + p[0] + ' ' + p[1] + 'em');
	});
	report(/3\.5em for the tank, reservoir and junction/.test(note[0]),
		'the stylesheet note still says 3.5em for tank, reservoir and junction');
}

console.log('\n' + pass + '/' + (pass + fail) + ' checks passed');
if (fail) {
	console.log('\nA width and its declaration disagree. The declared list in this file is the\n'
		+ 'authority: change it here first, with the reason, then change js/looped-network.js.');
	process.exit(1);
}
