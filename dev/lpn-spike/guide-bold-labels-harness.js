// EVERY INTERFACE LABEL THE USER MANUAL QUOTES IS BOLD, AND THE BOLD WORDS ARE THE LABEL'S OWN STRING (Task 859, rounds 5 and 6).
//   node dev/lpn-spike/guide-bold-labels-harness.js
// guide-bold-labels-spec.json lists, for each manual definition key, the language KEYS of the labels it quotes (never English
// text) and how many times each is bold and how many times it stands plain on purpose. Read from lib/lang.ec.<lang>.php:
//   1. English: for every listed label, the value of its key appears bold exactly `bold` times and plain exactly `plain` times,
//      so a label added to a sentence, or a bold span lost, fails here.
//   2. English: every <strong> span in any manual definition (lpn_guide_*_def, lpn_notes_*_def, lpn_hotkeys_*_def) is the value of
//      a label key listed for that definition. No stray bold.
//   3. Every other language: a <strong> span, where one exists, equals the value of one of that entry's label keys in the same
//      file, character for character. Languages not yet bolded have no spans and pass; the sprint list is in
//      dev/guide-bold-translation-list.md. Named exceptions: ar, bg and cs have a button string that is itself mistranslated
//      ("Add a rule"), so their span keeps the word for "control".
// Strings that cannot carry bold (the entry's opening paragraphs, which are the `?` tips, rendered as plain text) are not here.
'use strict';
const fs = require('fs');
const path = require('path');
const LIB = path.join(__dirname, '..', '..', 'lib');
const SPEC = JSON.parse(fs.readFileSync(path.join(__dirname, 'guide-bold-labels-spec.json'), 'utf8'));
const EXCEPT = { 'ar:lpn_guide_lib_ctl_def:0': 1, 'bg:lpn_guide_lib_ctl_def:0': 1, 'cs:lpn_guide_lib_ctl_def:0': 1 };
const unesc = (s) => s.replace(/\\(['\\])/g, '$1');
function load(f) {
	const out = {};
	fs.readFileSync(path.join(LIB, f), 'utf8').split('\n').forEach((line) => {
		const m = line.match(/^\$ec_lang\['([^']+)'\]='((?:[^'\\]|\\.)*)';\s*$/);
		if (m) { out[m[1]] = unesc(m[2]); }
	});
	return out;
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LETTER = '\\p{L}\\p{N}_';
const MANUAL = /^lpn_(guide_|notes_|hotkeys_).*_def$/;
let fails = 0, checks = 0;
const fail = (m) => { fails++; console.log('  FAIL ' + m); };
const en = load('lang.ec.en.php');

// 1 and 2: English.
Object.keys(SPEC).forEach((mk) => {
	const v = en[mk];
	if (v === undefined) { fail(mk + ' is not a language key'); return; }
	const bolds = (v.match(/<strong>.*?<\/strong>/gsu) || []).map((s) => s.replace(/<\/?strong>/g, ''));
	const plainText = v.replace(/<strong>.*?<\/strong>/gsu, '\u0001').replace(/<[^>]+>/g, '\u0002');
	const listed = [];
	SPEC[mk].forEach((e) => {
		const label = en[e.key];
		checks++;
		if (!label) { fail(mk + ': label key ' + e.key + ' has no English value'); return; }
		listed.push(label);
		const nb = bolds.filter((b) => b === label).length;
		const np = (plainText.match(new RegExp('(?<![' + LETTER + '])' + esc(label) + '(?![' + LETTER + '])', 'gu')) || []).length;
		if (nb !== e.bold) { fail(mk + ': "' + label + '" is bold ' + nb + ' times, want ' + e.bold); }
		if (np !== e.plain) { fail(mk + ': "' + label + '" stands plain ' + np + ' times, want ' + e.plain); }
	});
	bolds.forEach((b) => { checks++; if (listed.indexOf(b) < 0) { fail(mk + ': bold span "' + b + '" is not a label listed for it'); } });
});
Object.keys(en).filter((k) => MANUAL.test(k) && !SPEC[k]).forEach((k) => {
	checks++;
	if (/<strong>/.test(en[k])) { fail(k + ' has bold spans and no entry in the spec'); }
});

// 3: the other languages.
let langs = 0, spans = 0;
fs.readdirSync(LIB).filter((f) => /^lang\.ec\.[a-z]{2}\.php$/.test(f) && f !== 'lang.ec.en.php').sort().forEach((f) => {
	const l = f.slice(8, 10), t = load(f);
	langs++;
	Object.keys(SPEC).forEach((mk) => {
		const v = t[mk];
		if (v === undefined) { return; }
		const got = (v.match(/<strong>.*?<\/strong>/gsu) || []).map((s) => s.replace(/<\/?strong>/g, ''));
		got.forEach((g, i) => {
			spans++; checks++;
			const ok = SPEC[mk].some((e) => [e.key].concat(e.also || []).some((k) => t[k] === g));
			if (!ok && !EXCEPT[l + ':' + mk + ':' + i]) { fail(l + ' ' + mk + ' span ' + i + ': ' + JSON.stringify(g) + ' is none of its labels'); }
			if (ok && EXCEPT[l + ':' + mk + ':' + i]) { fail(l + ' ' + mk + ' span ' + i + ' now matches: remove the exception'); }
		});
	});
});
console.log('English: ' + Object.keys(SPEC).length + ' entries, ' + Object.keys(SPEC).reduce((n, k) => n + SPEC[k].reduce((m, e) => m + e.bold, 0), 0) + ' bold spans; other languages: ' + langs + ' files, ' + spans + ' spans');
console.log(fails ? '\n' + fails + ' FAILED' : '\nall ' + checks + ' checks passed');
process.exit(fails ? 1 : 0);
