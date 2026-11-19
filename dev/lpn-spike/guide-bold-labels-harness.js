// EVERY INTERFACE LABEL THE USER MANUAL NAMES IS BOLD, OR IS LISTED AS A DELIBERATE PLAIN USE (Task 859, rounds 5 to 7).
//   node dev/lpn-spike/guide-bold-labels-harness.js        (EC_LIB_DIR=<dir> reads the lang files from another folder)
// The rule (Tom): bold every word or phrase that names something the visitor sees on screen in those words. Plain is for a word used as
// an ordinary noun, a cross-reference to the manual's own headings, query text or a quoted line, an example's own name or id, or a key.
//
// The LABELS are read from lib/lang.ec.<lang>.php: every lpn_ value (plus the keys the spec lists as extra) that is a short capitalised
// string, a trailing "…" also allowed to be left off, minus the manual's own texts and the sentence-like strings. Nothing is typed here in
// English. guide-bold-labels-spec.json lists, for each manual definition (lpn_guide_*_def, lpn_notes_*_def, lpn_hotkeys_*_def), each label
// it quotes by KEY, how many times it is bold, and how many times it stands plain, by reason.
//   1. English: for every label occurrence in every definition (longest label first, the manual's own heading phrases set aside), the bold
//      and plain counts equal the spec's. A plain occurrence the spec does not list FAILS: a skipped label cannot pass.
//   2. English: every <strong> span is a label (or a label with a unit, as in "Pressure (psi)"). No stray bold.
//   3. Every other language: the definition carries as many <strong> spans as English, and no span holds another tag. The words are not
//      compared with the label: a translation may bold an inflected or reworded form of it.
//   4. Every language: every cell dev/scripts/guide_bold_mechanical.php covers is bold (its --check mode), so a later edit cannot drop one.
// Strings that cannot carry bold (the entry's opening paragraphs, which are the `?` tips, plain text) are not here.
'use strict';
const fs = require('fs');
const path = require('path');
const LIB = process.env.EC_LIB_DIR || path.join(__dirname, '..', '..', 'lib');
const SPECFILE = JSON.parse(fs.readFileSync(path.join(__dirname, 'guide-bold-labels-spec.json'), 'utf8'));
const SPEC = SPECFILE.entries;
const REASONS = ['noun', 'xref', 'syntax', 'data', 'key'];
const MANUAL = /^lpn_(guide_|notes_|hotkeys_).*_def$/;
const unesc = (s) => s.replace(/\\(['\\])/g, '$1');
function load(f) {
	const out = {}, unread = [];
	fs.readFileSync(path.join(LIB, f), 'utf8').split('\n').forEach((line) => {
		const m = line.match(/^\$ec_lang\['([^']+)'\]='((?:[^'\\]|\\.)*)';\s*$/);
		if (m) { out[m[1]] = unesc(m[2]); return; }
		const k = line.match(/^\$ec_lang\['([^']+)'\]/);
		if (k && MANUAL.test(k[1])) { unread.push(k[1]); }
	});
	if (unread.length) { console.log('  FAIL ' + f + ': manual definitions this harness cannot read: ' + unread.join(', ')); process.exit(1); }
	return out;
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LETTER = '\\p{L}\\p{N}_';
let fails = 0, checks = 0;
const fail = (m) => { fails++; console.log('  FAIL ' + m); };
const en = load('lang.ec.en.php');

// The universe of labels, as strings, from the English file.
function universe(t) {
	const U = {};
	Object.keys(t).forEach((k) => {
		const v = t[k];
		if (!(/^lpn_/.test(k) || SPECFILE.extraLabelKeys.indexOf(k) >= 0)) { return; }
		if (/^lpn_(guide_|notes_|hotkeys_)/.test(k)) { return; }   // the manual's own texts, headings included, are not interface labels
		if (k !== 'lpn_menu_help' && /_(tip|help|intro|body|msg|note|hint|warn|text)$|^lpn_msg/.test(k)) { return; }
		if (/[<>{}]|\.$|:$|\?$/u.test(v) && !/…$/u.test(v)) { return; }
		if (v !== v.trim()) { return; }
		const n = Array.from(v).length;
		if (n < 2 || n > 45 || /^[\p{Ll}\d(]/u.test(v)) { return; }
		(U[v] = U[v] || []).push(k);
		if (/…$/u.test(v)) { (U[v.replace(/…$/u, '')] = U[v.replace(/…$/u, '')] || []).push(k); }
	});
	return U;
}
const U = universe(en);
const TOK = Object.keys(U).sort((a, b) => Buffer.byteLength(b) - Buffer.byteLength(a));
const XREF = SPECFILE.xrefPhrases;
const labelOf = (e, t) => e.stripEllipsis ? t[e.key].replace(/…$/u, '') : t[e.key];

// What a definition says: bold spans, and the plain occurrences of each label string.
function scan(v) {
	const bold = (v.match(/<strong>.*?<\/strong>/gsu) || []).map((s) => s.replace(/<\/?strong>/g, ''));
	const plain = {};
	v.replace(/<strong>.*?<\/strong>/gsu, '\u0001').split(/<[^>]+>/).forEach((seg) => {
		const marks = [];
		const mark = (s, l, lab) => { if (marks.some((m) => s < m[0] + m[1] && s + l > m[0])) { return; } marks.push([s, l, lab]); };
		XREF.forEach((x) => { let p = -1; while ((p = seg.indexOf(x, p + 1)) >= 0) { mark(p, x.length, x); } });
		TOK.forEach((l) => {
			const re = new RegExp('(?<![' + LETTER + '])' + esc(l) + '(?![' + LETTER + '])', 'gu');
			let m;
			while ((m = re.exec(seg))) { mark(m.index, m[0].length, l); }
		});
		marks.forEach((m) => { if (U[m[2]]) { plain[m[2]] = (plain[m[2]] || 0) + 1; } });
	});
	return { bold, plain };
}

// 1 and 2: English.
const manualKeys = Object.keys(en).filter((k) => MANUAL.test(k) && k.indexOf('lpn_guide_text_') !== 0);
manualKeys.forEach((mk) => {
	const got = scan(en[mk]), entries = SPEC[mk] || [], want = {};
	entries.forEach((e) => {
		const lab = labelOf(e, en);
		checks++;
		if (!en[e.key]) { fail(mk + ': label key ' + e.key + ' has no English value'); return; }
		const nPlain = Object.keys(e.plain || {}).reduce((n, r) => { if (REASONS.indexOf(r) < 0) { fail(mk + ': "' + lab + '" has an unknown reason ' + r); } return n + e.plain[r]; }, 0);
		want[lab] = { bold: e.bold | 0, boldUnit: e.boldUnit | 0, plain: nPlain };
	});
	const spans = {}, unitSpans = {};
	got.bold.forEach((b) => {
		checks++;
		if (U[b]) { spans[b] = (spans[b] || 0) + 1; return; }
		const m = b.match(/^(.+) \([^)]*\)$/u);
		if (m && U[m[1]]) { unitSpans[m[1]] = (unitSpans[m[1]] || 0) + 1; return; }
		fail(mk + ': bold span "' + b + '" is not a label');
	});
	Object.keys(want).concat(Object.keys(got.plain), Object.keys(spans), Object.keys(unitSpans)).filter((x, i, a) => a.indexOf(x) === i).forEach((lab) => {
		const w = want[lab], nb = spans[lab] | 0, nu = unitSpans[lab] | 0, np = got.plain[lab] | 0;
		checks++;
		if (!w) {
			if (np) { fail(mk + ': "' + lab + '" stands plain ' + np + ' time(s) and is not listed (bold it, or list it with a reason)'); }
			if (nb || nu) { fail(mk + ': "' + lab + '" is bold and not listed'); }
			return;
		}
		if (nb !== w.bold) { fail(mk + ': "' + lab + '" is bold ' + nb + ' times, spec ' + w.bold); }
		if (nu !== w.boldUnit) { fail(mk + ': "' + lab + '" is bold with a unit ' + nu + ' times, spec ' + w.boldUnit); }
		if (np !== w.plain) { fail(mk + ': "' + lab + '" stands plain ' + np + ' times, spec ' + w.plain); }
	});
});
Object.keys(SPEC).filter((k) => manualKeys.indexOf(k) < 0).forEach((k) => fail('spec names ' + k + ', which is not a manual definition'));

// 3: the other languages.
let langs = 0, spans = 0;
fs.readdirSync(LIB).filter((f) => /^lang\.ec\.[a-z]{2}\.php$/.test(f) && f !== 'lang.ec.en.php').sort().forEach((f) => {
	const l = f.slice(8, 10), t = load(f);
	langs++;
	Object.keys(SPEC).forEach((mk) => {
		const v = t[mk];
		if (v === undefined) { return; }
		// A translation may bold an inflected or reworded form of the label, so the words are not compared: the number of
		// spans must equal English's, and no span may hold another tag.
		const gotB = v.match(/<strong>.*?<\/strong>/gsu) || [], enB = (en[mk] || '').match(/<strong>.*?<\/strong>/gsu) || [];
		spans += gotB.length; checks += 2;
		if (gotB.length !== enB.length) { fail(l + ' ' + mk + ': ' + gotB.length + ' bold spans, English has ' + enB.length); }
		gotB.forEach((g, i) => { if (/<(?!\/?strong>)[^>]*>/.test(g)) { fail(l + ' ' + mk + ' span ' + i + ': another tag inside the bold'); } });
	});
});
// 4: every cell the mechanical rule covers (dev/scripts/guide_bold_mechanical.php) is bold in every language.
{
	const r = require('child_process').spawnSync('php', [path.join(__dirname, '..', 'scripts', 'guide_bold_mechanical.php'), '--check'], { encoding: 'utf8' });
	checks++;
	if (r.status !== 0) { fail('a cell the mechanical rule covers is not bold (run php dev/scripts/guide_bold_mechanical.php --apply):\n' + (r.stdout || r.stderr).split('\n').filter((x) => /NOT BOLD|REFUSED/.test(x)).slice(0, 15).join('\n')); }
}
const nb = Object.keys(SPEC).reduce((n, k) => n + SPEC[k].reduce((m, e) => m + (e.bold | 0) + (e.boldUnit | 0), 0), 0);
const np = Object.keys(SPEC).reduce((n, k) => n + SPEC[k].reduce((m, e) => m + Object.keys(e.plain || {}).reduce((q, r) => q + e.plain[r], 0), 0), 0);
console.log('English: ' + Object.keys(SPEC).length + ' definitions with labels, ' + nb + ' bold spans, ' + np + ' deliberate plain uses; other languages: ' + langs + ' files, ' + spans + ' spans');
console.log(fails ? '\n' + fails + ' FAILED' : '\nall ' + checks + ' checks passed');
process.exit(fails ? 1 : 0);
