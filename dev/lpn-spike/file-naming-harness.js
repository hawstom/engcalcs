// Tasks 315 and 246 — headless check of the project FILE NAME round trip, and of the `.lwn`
// identity that replaced the `-lpn` suffix.
//
//   node dev/lpn-spike/file-naming-harness.js
//
// The file is `.lwn` outside and JSON inside (Task 246). What that costs is a compatibility
// obligation this harness is the guard for: EVERY name this page has ever written must still come
// back as the project it names — `-lpn-hawsedc-engcalcs.json`, `-lpn.json`, and now bare `.lwn` —
// because stranding somebody's saved documents to tidy up an extension is the worst trade
// available here.
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
const EXT = constant('LPN_FILE_EXT');
const EXT_LEGACY = constant('LPN_FILE_EXT_LEGACY');

const LPN_FILE_SUFFIX = SUFFIX, LPN_FILE_SUFFIX_LEGACY = LEGACY;
const LPN_FILE_EXT = EXT, LPN_FILE_EXT_LEGACY = EXT_LEGACY;
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

console.log('\n-- the file identity: `.lwn`, and nothing else in the name (Task 246) --');
eq(projectFileName('Elm Street Center'), 'Elm-Street-Center' + EXT, 'a spaced name becomes a dashed filename');
eq(EXT, '.lwn', 'the extension is the one Tom bought the domain for');
// The `-lpn` suffix existed only because a generic `.json` could not say what the file was. It has
// an extension to say that now, so a new file must not wear BOTH -- that is the same fact twice.
report(projectFileName('X').indexOf(SUFFIX) < 0, 'a NEW filename carries no -lpn suffix any more', projectFileName('X'));
report(projectFileName('X').slice(-EXT.length) === EXT, 'and does carry the extension');

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

console.log('\n-- everything ever written still opens (Task 246 strands nobody) --');
eq(projectNameFromFileName('Elm-Street-Center' + LEGACY + EXT_LEGACY), 'Elm-Street-Center', 'a file saved before 2026-08-14 still opens with its name intact');
eq(projectNameFromFileName('Elm-Street-Center' + LEGACY + '.JSON'), 'Elm-Street-Center', 'and the extension match is case-insensitive');
eq(projectNameFromFileName('Elm-Street-Center' + SUFFIX + EXT_LEGACY), 'Elm-Street-Center', 'and so does a `-lpn.json` file, which is what most of them are');
eq(projectNameFromFileName('Elm-Street-Center' + EXT), 'Elm-Street-Center', 'while a new `.lwn` gives its name back plainly');
eq(projectNameFromFileName('Elm-Street-Center' + EXT.toUpperCase()), 'Elm-Street-Center', '...case-insensitively too');
// An unescaped `.` in the extension pattern would eat the last letter of a name ending in `alwn`.
// Silent, and it renames the user's project on the next save, which is what this whole function's
// comment block is about.
eq(projectNameFromFileName('Shoalwn'), 'Shoalwn', 'a name that merely ENDS in the extension letters is left alone');

console.log('\n-- the suffixes overlap, so an UNANCHORED strip mangles --');
// `-lpn` really is a prefix of `-lpn-hawsedc-engcalcs`. Task 315 read that as "strip longest
// first"; measured, that is only true if the strips lose their end-anchors, because `/-lpn$/`
// cannot match a string ending in `engcalcs` at all. The overlap is still worth asserting — it is
// what makes an unanchored implementation silently wrong — but the ordering itself is not the bug.
report(LEGACY.indexOf(SUFFIX) === 0, 'the short suffix is a prefix of the long one');
const mangled = 'Elm-Street-Center' + LEGACY.slice(SUFFIX.length);
report(projectNameFromFileName('Elm-Street-Center' + LEGACY + EXT_LEGACY) !== mangled,
	'a legacy file does not come back wearing the long suffix’s tail', `must not be ${JSON.stringify(mangled)}`);

console.log('\n-- EXACTLY ONE suffix is stripped, never both --');
// A user's project genuinely called `Z-lpn` was written by the old code as
// `Z-lpn-lpn-hawsedc-engcalcs.json`. Chaining two replaces re-opens it as `Z`, silently losing
// four characters the user typed.
eq(projectNameFromFileName('Z' + SUFFIX + LEGACY + EXT_LEGACY), 'Z' + SUFFIX, 'a legacy file whose project name ends in the short suffix keeps it');
eq(projectNameFromFileName('Z' + LEGACY + SUFFIX + EXT_LEGACY), 'Z' + LEGACY, 'and a new file whose project name ends in the long suffix keeps that');

console.log('\n-- a name that is nothing but punctuation still yields a filename --');
eq(projectFileName('///'), 'project' + EXT, 'safeFileName’s fallback survives the extension change');
report(projectNameFromFileName(EXT) === EXT, 'a filename that strips to empty returns itself rather than an empty project name');

console.log('\n-- the format marker, which is what makes the short name safe --');
// The whole argument for cutting 26 characters off every filename is that the document now says
// what it is from the inside. If serializeProject() ever stops writing these, the short name
// becomes the cryptic one the old suffix existed to avoid — so assert it at the source.
const ser = extract('serializeProject');
report(ser.indexOf('format: LPN_FILE_FORMAT') >= 0, 'serializeProject() writes the format key');
report(ser.indexOf('app: LPN_FILE_APP') >= 0, 'serializeProject() writes the app key');
report(FORMAT.length > 0 && !/\s/.test(FORMAT), 'the format value is a single token', JSON.stringify(FORMAT));
report(/^https:\/\//.test(APP), 'the app value is an https URL', APP);
// Not `www.` — no origin in lib/config.inc.php's whitelist has one, and a marker pointing at a
// hostname that redirects is a marker that will one day point at nothing.
//
// CANONICAL_ORIGIN became a host -> origin lookup when the suite gained a second domain (Task 479),
// so the origin to compare against is CANONICAL_ORIGIN_DEFAULT: the marker is baked into a saved
// FILE, which outlives the request that wrote it and has no Host header of its own. It must name the
// indexed address, not whichever domain the author happened to be on.
const config = fs.readFileSync(path.join(__dirname, '../../lib/config.inc.php'), 'utf8');
const origin = (config.match(/define\('CANONICAL_ORIGIN_DEFAULT',\s*'([^']+)'\)/) || [])[1];
report(!!origin && APP.indexOf(origin + '/') === 0, 'the app URL is under CANONICAL_ORIGIN_DEFAULT', `${APP} vs ${origin}`);

console.log('\n-- the pickers: write one extension, read both --');
{
	const save = extract('fileTypes');
	const open = extract('fileTypesOpen');
	report(save.indexOf('LPN_FILE_EXT_LEGACY') < 0 && save.indexOf('LPN_FILE_EXT') >= 0,
		'Save as offers `.lwn` and only `.lwn`');
	report(open.indexOf('LPN_FILE_EXT') >= 0 && open.indexOf('LPN_FILE_EXT_LEGACY') >= 0,
		'Open accepts both, so an existing `.json` project is never stranded');
	// The picker for OPEN must not be handed the save list, which is the one-character mistake that
	// would hide every pre-Task-246 file behind a filter.
	report(/showOpenFilePicker\(\{ multiple: false, types: fileTypesOpen\(\) \}\)/.test(src),
		'and the Open picker is the one that gets the wider list');
	report(/showSaveFilePicker\(\{ suggestedName: suggested, types: fileTypes\(\) \}\)/.test(src),
		'while Save as gets the narrow one');
	// The no-File-System-Access-API fallback is an <input type=file>, and its accept list is in the
	// PHP. Same rule, different file, and it has been forgotten before.
	const php = fs.readFileSync(path.join(__dirname, '../../Looped-Network.php'), 'utf8');
	const inp = (php.match(/id="lpn_project_file"[^>]*/) || [''])[0];
	report(inp.indexOf(EXT) >= 0 && inp.indexOf(EXT_LEGACY) >= 0,
		'and the upload fallback accepts both too', inp);
}

console.log('\n-- open / save / save as, in that order, on the toolbar (Task 246) --');
{
	const bar = extract('wireToolbar');
	// Where each button is NAMED, which is where it is built -- the icon name is the second
	// argument to setIconLabel(), so a quoted `, 'open',` is that button and nothing else.
	const order = ['open', 'save', 'saveas'].map(function (icon) {
		return { icon: icon, at: bar.indexOf(", '" + icon + "',") };
	});
	order.forEach(function (o) { report(o.at >= 0, `the toolbar has a ${o.icon} button`); });
	report(order.every(function (o, i) { return i === 0 || o.at > order[i - 1].at; }),
		'and they are in the order every document program puts them in',
		order.map(function (o) { return `${o.icon}@${o.at}`; }).join(' '));
	// **NEW PROJECT IS THE ONE OF THE FOUR THAT IS NOT HERE**, and it is not an oversight. Task 246
	// asks for all four; Tom removed New from the strip by name afterwards, on 2026-08-15, and
	// dev/lpn-spike/toolbar-harness.js holds that instruction and asserts the absence. Both files
	// would have to change together to put it back, which is the point of asserting it twice.
	report(bar.indexOf(", 'new',") < 0, 'and New project is still off it, as Tom asked on 2026-08-15');
	// Every icon has to be in the shared PHP set, or a button ships with no glyph at all.
	const icons = fs.readFileSync(path.join(__dirname, '../../lib/Icons.lib.php'), 'utf8');
	['new', 'open', 'save', 'saveas'].forEach(function (name) {
		report(new RegExp("'" + name + "'\\s*=>").test(icons), `${name} is drawn in lib/Icons.lib.php`);
	});
	report(/openFromFile\(\)/.test(bar), 'and Open is the same command as File > Open…');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
