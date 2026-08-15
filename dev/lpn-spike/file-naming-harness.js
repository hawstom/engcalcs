// Task 315 — headless check of the project FILE NAME round trip.
//
//   node dev/lpn-spike/file-naming-harness.js
//
// Written 2026-08-14, the day the suffix went from `-lpn-hawsedc-engcalcs` to `-lpn`, because that
// change puts a silent project-renaming bug one typo away and nothing else in the repo could see
// it. The mechanism, stated once so it is not re-derived:
//
//   saveCurrent() treats a chosen filename differing from the SUGGESTED one as a deliberate rename
//   and writes it into project.name. Before this change a legacy file's name and its suggestion
//   were identical, so that branch stayed asleep. After it they differ BY CONSTRUCTION — the
//   suggestion carries `-lpn`, the file on disk carries the long form — so the branch fires on
//   every re-save of every pre-existing file, and whatever projectNameFromFileName() returns is
//   what the user's project gets called from then on.
//
// So the round trip is the thing under test, not the cosmetics: a name in, a filename out, the
// same name back. Both suffixes, in both directions, plus the two orderings that look right and
// are not.
//
// These are pure string functions with no closure dependencies, so they are lifted by text the
// same way the other spike harnesses do it. That is the weaker of the two patterns CLAUDE.md
// describes (it tests a copy, not the call site) and it is the right one here precisely BECAUSE
// they are pure — there is no closure for the copy to diverge from.

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

function extract(name) {
	const re = new RegExp('(?:async )?function ' + name + '\\s*\\(');
	const at = src.search(re);
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = src.indexOf('{', at), depth = 0, end = i;
	for (; end < src.length; end++) {
		if (src[end] === '{') { depth++; }
		else if (src[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return src.slice(at, end);
}

// Both suffixes are read OUT OF THE SOURCE, never typed here. A harness that hard-codes `-lpn`
// stops testing the convention the moment somebody changes it — which is the one moment it is
// worth testing.
function constant(name) {
	const m = src.match(new RegExp('var ' + name + " = '([^']*)';"));
	if (!m) { throw new Error('constant not found: ' + name); }
	return m[1];
}
const SUFFIX = constant('LPN_FILE_SUFFIX');
const LEGACY = constant('LPN_FILE_SUFFIX_LEGACY');
const FORMAT = constant('LPN_FILE_FORMAT');
const APP = constant('LPN_FILE_APP');

const LPN_FILE_SUFFIX = SUFFIX, LPN_FILE_SUFFIX_LEGACY = LEGACY;
eval(extract('safeFileName'));
eval(extract('projectFileName'));
eval(extract('projectNameFromFileName'));

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function eq(actual, expected, label) {
	report(actual === expected, label, actual === expected ? '' : `got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
}

console.log('\n-- the suffix is short, and it is the one the constant says --');
eq(projectFileName('Elm Street Center'), 'Elm-Street-Center' + SUFFIX + '.json', 'a spaced name becomes a dashed filename');
report(SUFFIX.length <= 8, 'the suffix is short', `${SUFFIX.length} chars, was ${LEGACY.length}`);
report(/\.json$/.test(projectFileName('X')), 'the extension is still .json — no generation-1 extension yet');

console.log('\n-- round trip: name -> filename -> name --');
[
	'Elm Street Center',
	'Net3',
	'Project 1',
	'Réseau d’eau',          // non-Latin-friendly: safeFileName must not strip to ASCII
	'水網絡',         // a project named in a script with no dashes or spaces at all
	'Main/Lateral: rev 2'         // filesystem-illegal characters, collapsed not dropped
].forEach(function (name) {
	const collapsed = safeFileName(name);
	eq(projectNameFromFileName(projectFileName(name)), collapsed, `round trip: ${JSON.stringify(name)}`);
});

console.log('\n-- the legacy suffix is read FOREVER --');
eq(projectNameFromFileName('Elm-Street-Center' + LEGACY + '.json'), 'Elm-Street-Center', 'a file saved before 2026-08-14 still opens with its name intact');
eq(projectNameFromFileName('Elm-Street-Center' + LEGACY + '.JSON'), 'Elm-Street-Center', 'and the extension match is case-insensitive');

console.log('\n-- the suffixes overlap, so an UNANCHORED strip mangles --');
// `-lpn` really is a prefix of `-lpn-hawsedc-engcalcs`. Task 315 read that as "strip longest
// first"; measured, that is only true if the strips lose their end-anchors, because `/-lpn$/`
// cannot match a string ending in `engcalcs` at all. The overlap is still worth asserting — it is
// what makes an unanchored implementation silently wrong — but the ordering itself is not the bug.
report(LEGACY.indexOf(SUFFIX) === 0, 'the short suffix is a prefix of the long one');
const mangled = 'Elm-Street-Center' + LEGACY.slice(SUFFIX.length);
report(projectNameFromFileName('Elm-Street-Center' + LEGACY + '.json') !== mangled,
	'a legacy file does not come back wearing the long suffix’s tail', `must not be ${JSON.stringify(mangled)}`);

console.log('\n-- EXACTLY ONE suffix is stripped, never both --');
// A user's project genuinely called `Z-lpn` was written by the old code as
// `Z-lpn-lpn-hawsedc-engcalcs.json`. Chaining two replaces re-opens it as `Z`, silently losing
// four characters the user typed.
eq(projectNameFromFileName('Z' + SUFFIX + LEGACY + '.json'), 'Z' + SUFFIX, 'a legacy file whose project name ends in the short suffix keeps it');
eq(projectNameFromFileName('Z' + LEGACY + SUFFIX + '.json'), 'Z' + LEGACY, 'and a new file whose project name ends in the long suffix keeps that');

console.log('\n-- a name that is nothing but punctuation still yields a filename --');
eq(projectFileName('///'), 'project' + SUFFIX + '.json', 'safeFileName’s fallback survives the suffix change');
report(projectNameFromFileName('.json') === '.json', 'a filename that strips to empty returns itself rather than an empty project name');

console.log('\n-- the format marker, which is what makes the short name safe --');
// The whole argument for cutting 26 characters off every filename is that the document now says
// what it is from the inside. If serializeProject() ever stops writing these, the short name
// becomes the cryptic one the old suffix existed to avoid — so assert it at the source.
const ser = extract('serializeProject');
report(ser.indexOf('format: LPN_FILE_FORMAT') >= 0, 'serializeProject() writes the format key');
report(ser.indexOf('app: LPN_FILE_APP') >= 0, 'serializeProject() writes the app key');
report(FORMAT.length > 0 && !/\s/.test(FORMAT), 'the format value is a single token', JSON.stringify(FORMAT));
report(/^https:\/\//.test(APP), 'the app value is an https URL', APP);
// Not `www.` — lib/config.inc.php's CANONICAL_ORIGIN has no www, and a marker pointing at a
// hostname that redirects is a marker that will one day point at nothing.
const origin = (fs.readFileSync(path.join(__dirname, '../../lib/config.inc.php'), 'utf8')
	.match(/define\('CANONICAL_ORIGIN',\s*'([^']+)'\)/) || [])[1];
report(!!origin && APP.indexOf(origin + '/') === 0, 'the app URL is under CANONICAL_ORIGIN', `${APP} vs ${origin}`);

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
