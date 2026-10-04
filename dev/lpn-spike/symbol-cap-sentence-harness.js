// THE NODE-SIZE CAP IS ONE SENTENCE (ROADMAP Task 740). Run with:
//   node dev/lpn-spike/symbol-cap-sentence-harness.js
//
// The Settings row used to be three keys around two boxes, which five languages could not order.
// It is now one key, lpn_settings_symbol_cap_sentence, with {n} and {p} where the boxes go. This
// renders the real Settings box in English and in Italian and checks that (1) both boxes sit in the
// row, (2) the text around them reads exactly as the three fragments did, (3) a sentence that puts
// {p} before {n} puts the boxes in that order, and (4) typing in a box still writes the setting.
'use strict';
const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
global.fetch = () => Promise.reject(new Error('no network'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

let fails = 0;
function check(ok, label, detail) { if (!ok) { fails++; } console.log((ok ? '  ok   ' : '  FAIL ') + label + (ok || !detail ? '' : '   ' + detail)); }
function fire(el, type) { (el._listeners[type] || []).forEach(f => f({ preventDefault() {} })); }

function langKey(code, key) {
	const src = fs.readFileSync(path.join(__dirname, '../../lib/lang.ec.' + code + '.php'), 'utf8');
	const m = src.match(new RegExp("^\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)';", 'm'));
	return m ? m[1].replace(/\\'/g, "'") : null;
}
const INJECT = "\t\trebuildSettings: function () { rebuildSettingsBox(); },\n\t\tbuildDom: buildDom,\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); linkSymbolLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

function render(sentence, tip) {
	stub.setUnitSet('us');
	global.EngCalcs.pageConfig = global.EngCalcs.pageConfig || {};
	global.EngCalcs.pageConfig.lpn_settings_symbol_cap_sentence = sentence;
	global.EngCalcs.pageConfig.lpn_settings_symbol_cap_tip = tip;
	const L = stub.loadLoopedNetwork(INJECT, null, null);
	L.buildLayers(); L.buildDom(); L.rebuildSettings();
	const all = [];
	(function walk(e) { if (e) { all.push(e); (e.children || []).forEach(walk); } })(global.document.getElementById('lpn_set_map_fields'));
	const byId = id => all.filter(e => e.id === id)[0];
	return { L, byId };
}
// The row's visible text, in document order, with an input shown as [n] or [p].
function rowText(byId) {
	const mult = byId('lpn_set_symbol_cap_mult'), row = mult && mult.parentNode && mult.parentNode.parentNode;
	if (!row) { return null; }
	const out = [];
	(function walk(e) {
		if (e.id === 'lpn_set_symbol_cap_mult') { out.push('[n]'); return; }
		if (e.id === 'lpn_set_symbol_cap_pct') { out.push('[p]'); return; }
		if (e.tagName === 'INPUT') { return; }
		if (typeof e.textContent === 'string' && e.textContent && !(e.children || []).length) { out.push(e.textContent); }
		(e.children || []).forEach(walk);
	})(row);
	return out.map(s => s.trim()).filter(s => s && s !== '?').join(' ');
}

// What the three fragments rendered as: label, [n], mid, [p], %, post (each trimmed, blanks dropped).
const OLD = {
	en: 'Prevent nodes from scaling larger than [n] times the length of the [p] % percentile pipe',
	it: 'Impedisci ai nodi di ingrandirsi oltre [n] volte la lunghezza della tubazione al [p] % percentile',
	he: 'מניעת גדילת צמתים לגודל גדול מ- [n] פעמים מהאורך באחוזון ה- [p] % של הצינורות'
};
for (const code of ['en', 'it', 'he']) {
	console.log('--- ' + code + ' ---');
	const sentence = langKey(code, 'lpn_settings_symbol_cap_sentence');
	check(!!sentence && sentence.indexOf('{n}') >= 0 && sentence.indexOf('{p}') >= 0, code + ': the key exists and has both placeholders', String(sentence));
	check(langKey(code, 'lpn_settings_symbol_cap_mid') === null && langKey(code, 'lpn_settings_symbol_cap_post') === null && langKey(code, 'lpn_settings_symbol_cap') === null,
		code + ': the three old keys are gone');
	const r = render(sentence, 'tip text');
	const mult = r.byId('lpn_set_symbol_cap_mult'), pct = r.byId('lpn_set_symbol_cap_pct');
	check(!!mult && !!pct && mult.parentNode === pct.parentNode, code + ': both boxes sit in the one row control');
	check(rowText(r.byId) === OLD[code], code + ': the text around the boxes is what it was', rowText(r.byId));
	if (mult && pct) {
		mult.value = '2'; fire(mult, 'change');
		pct.value = '40'; fire(pct, 'change');
		const s = r.L.getSettings();
		check(s.symbolCapMultiple === 2 && s.symbolCapPercentile === 40, code + ': typing in the boxes still writes the settings', s.symbolCapMultiple + ', ' + s.symbolCapPercentile);
	}
}
console.log('--- a translator who puts {p} first ---');
const rr = render('Cap at the {p} percentile pipe, {n} times its length', 'tip');
const t = rowText(rr.byId);
check(t === 'Cap at the [p] % percentile pipe, [n] times its length' || t === 'Cap at the [p] % percentile pipe, [n] times its length'.replace(/ %/, ' %'),
	'boxes follow the sentence order', t);
const mb = rr.byId('lpn_set_symbol_cap_mult'), pb = rr.byId('lpn_set_symbol_cap_pct');
check(mb.parentNode.children.indexOf(pb) < mb.parentNode.children.indexOf(mb), 'the percentile box precedes the multiple box in the DOM');
console.log(fails ? fails + ' FAILED' : 'all ok');
process.exit(fails ? 1 : 0);
