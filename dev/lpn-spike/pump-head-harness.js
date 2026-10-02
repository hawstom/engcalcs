// A PUMP READS "HEAD", POSITIVE, EVERYWHERE; a pipe still reads "Head loss". Run with:
//   node dev/lpn-spike/pump-head-harness.js
//
// Tom, 2026-10-01 (refusing to merge feat/property-graph until the display agreed with itself):
// the property graph already showed a pump's head as Head gain, but the Tables, Properties, map
// labels and the Full report still said signed "Head loss". EPANET's manual and WaterGEMS both say
// head gain. Tom, 2026-10-02: "the industry term is pump 'Head', not 'Head gain'... 'Hg' can be
// just 'H'". DISPLAY ONLY: the solver's result keeps its negative sign, and so does every .inp.
// Net3 is run through the engine (extended period) so the Time series graph has frames too.
//   1. The solver's own pump head loss is still negative (nothing it computes changed).
//   2. Tables: the Pumps table's column is headed Head, its cells are positive and equal
//      minus the solver's number; the Pipes table's column is still Head loss.
//   3. Properties: a pump's row says Head, positive; a pipe's says Head loss.
//   4. A map label: a pump's line is the positive value under the "H=" prefix, a pipe's under "Hl=".
//   5. Time series graph: axis and every plotted value positive.
//   6. Full report (CSV, one row per link): a mixed column cannot be loss and gain at once, so a
//      pump fills a separate Pump head column and is blank under Head loss, and vice versa. That
//      column is "Pump head", not "Head", because the same table carries a node's hydraulic Head.

const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-profile.js');


let failures = 0;
function check(ok, msg) { console.log((ok ? '  ok   ' : '  FAIL ') + msg); if (!ok) { failures++; } }
function headp(t) { console.log('\n' + t); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, getDoc: function () { return doc; },\n" +
	"\t\tsetDoc: function (d) { doc = d; }, setSettings: function (s) { settings = s; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trunSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
	"\t\topenPopup: openPopup, openLinkPopup: openLinkPopup, closePopup: closePopup,\n" +
	"\t\topenMultiProperties: openMultiProperties, refreshPopupIfOpen: refreshPopupIfOpen,\n" +
	"\t\tsetSelectionList: setSelectionList, setProp: setProp, serialize: serializeProject,\n" +
	"\t\tcolorFieldLabel: colorFieldLabel, colorFieldUnitText: colorFieldUnitText,\n" +
	"\t\tpgFieldLabel: pgFieldLabel, colorLinkValue: colorLinkValue,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tlinkLabel: function (id) { return (linkEls[id] && linkEls[id].allLines || []).map(function (l) { return l.text; }); },\n" +
	"\t\tfullReportRows: fullReportRows, fullReportCsvText: fullReportCsvText,\n" +
	"\t\topenPane: openPane, paneTableById: paneTableById, paneCellText: paneCellText,\n" +
	"\t\tpaneHeadingLabelOnly: paneHeadingLabelOnly, buildDom: buildDom,\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;
const box = byId.lpn_popup_graph;

// Walk the stub tree under the graph box.
function walk(root, fn) {
	(function go(e) {
		if (!e) { return; }
		fn(e);
		(e.children || []).forEach(go);
	}(root));
}
function find(pred) { const out = []; walk(box, (e) => { if (pred(e)) { out.push(e); } }); return out; }
function byCls(cls) { return find((e) => String(e['class'] || e.className || '').split(/\s+/).indexOf(cls) >= 0); }
function sel() { return find((e) => e.id === 'lpn_pgraph_field')[0] || null; }
function options() { const s = sel(); return s ? (s.children || []).map((o) => o.value) : []; }
function optionTexts() { const s = sel(); return s ? (s.children || []).map((o) => o.textContent) : []; }
function shown() { return box.style.display !== 'none' && (box.children || []).length > 0; }
function lineSig() { return byCls('lpn-ts-line').map((p) => p.points).join('|'); }
function chartText() {
	const parts = [];
	walk(box, (e) => { if (e.nodeType === 3) { parts.push(String(e.textContent)); } });
	return parts.join(' | ');
}
function nowX() { const l = byCls('lpn-ts-now')[0]; return l ? String(l.x1) : null; }
function fire(el, type) {
	((el && el._listeners && el._listeners[type]) || []).forEach((f) => f({ type: type, target: el }));
}
function choose(field) { const s = sel(); s.value = field; fire(s, 'change'); }
async function until(pred, ms) {
	const t0 = Date.now();
	while (!pred() && Date.now() - t0 < ms) { await wait(25); }
	return pred();
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net3.inp', 'utf8'));
	const d = L.docFromInp(parsed, 'net3');
	L.setDoc(d);
	L.setSettings(d.settings);
	L.applyUnitSelections(d.units);
	d.settings.autoRun = false;
	const pipe = d.links.filter((l) => l.type === 'pipe')[0];
	const pumps = d.links.filter((l) => l.type === 'pump');
	L.buildDom();

	await warmEpanet();
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const ok = await until(() => EngCalcs.lpnTimeRunState().frames > 0, 90000);
	check(ok, `the engine ran Net3: ${EngCalcs.lpnTimeRunState().frames} frames`);
	if (!ok) { process.exit(1); }
	const frames = EngCalcs.lpnTimeRunFrames();
	// Park the clock where a pump is running, so its head is not the zero of a shut pump.
	let pump = pumps[0], at = frames[0];
	pumps.forEach((p) => frames.forEach((f) => { if (f.headlosses[p.id] < at.headlosses[pump.id]) { pump = p; at = f; } }));
	EngCalcs.lpnTimeGoTo(at.t);
	const ftPerM = 3.28084;
	const lastNum = (t) => parseFloat(String(t).trim().split(/\s+/).pop());

	headp('1. THE SOLVER IS UNTOUCHED');
	check(frames.some((f) => f.headlosses[pump.id] < 0), 'the engine still reports the pump\'s head loss as negative');

	headp('2. TABLES');
	L.openPane('pumps');
	const pumpCol = L.paneTableById('pumps').cols.filter((c) => c.key === 'headloss')[0];
	const pipeCol = L.paneTableById('pipes').cols.filter((c) => c.key === 'headloss')[0];
	check(L.paneHeadingLabelOnly(pumpCol) === 'Head', `the Pumps table heading: "${L.paneHeadingLabelOnly(pumpCol)}"`);
	check(L.paneHeadingLabelOnly(pipeCol) === 'Head loss', `the Pipes table heading: "${L.paneHeadingLabelOnly(pipeCol)}"`);
	const gain = pumpCol.get(pump);
	check(typeof gain === 'number' && gain > 0, `the pump's cell is positive: ${gain}`);
	check(Math.abs(gain - (-at.headlosses[pump.id] * ftPerM)) < 1e-3, 'and equals minus the solver\'s head loss, in feet');
	check(pipeCol.get(pipe) >= 0, 'a pipe\'s cell is a magnitude');

	headp('3. PROPERTIES');
	const popupText = () => { const out = []; (function go(e) { if (!e) { return; } if (e.tagName === 'LABEL') { out.push(String(e.textContent || '')); } else if (e.nodeType === 3 || !(e.children || []).length) { out.push(String(e.textContent || '')); } (e.children || []).forEach(go); }(byId.lpn_popup_fields)); return out.join(' | '); };
	L.openLinkPopup(pump.id, 100, 100);
	let t = popupText();
	check(/(^|\| )Head \(/.test(t) && t.indexOf('Head loss') < 0 && t.indexOf('Head gain') < 0, `the pump's Properties row says Head: ${(/(^|\| )Head \([^|]*\|[^|]*/.exec(t) || [''])[0]}`);
	const m = /(?:^|\| )Head \([^)]*\)\s*\|?\s*(-?[\d.]+)/.exec(t);
	const inputs = []; (function go(e) { if (!e) { return; } if (e.tagName === 'INPUT' || e.value !== undefined) { inputs.push(e); } (e.children || []).forEach(go); }(byId.lpn_popup_fields));
	check(t.indexOf('-' + gain.toFixed(2)) < 0 && (t.indexOf(gain.toFixed(2)) >= 0 || (m && Math.abs(+m[1] - gain) < 0.01)), `with the positive number ${gain.toFixed(2)}`);
	L.openLinkPopup(pipe.id, 100, 100);
	t = popupText();
	check(t.indexOf('Head loss (') >= 0 && !/(^|\| )Head \(/.test(t), 'a pipe\'s row still says Head loss');
	L.closePopup();

	headp('4. A MAP LABEL');
	const ls = L.labelSettings();
	ls.link.headloss = true;
	L.refreshLabelText();
	const pl = L.linkLabel(pump.id).filter((s) => /^H=/.test(s));
	check(pl.length === 1 && lastNum(pl[0].replace('H=', '')) > 0, `the pump's label line: ${L.linkLabel(pump.id).join(' | ')}`);
	check(L.linkLabel(pump.id).every((s) => !/^Hl=/.test(s)), 'and no "Hl=" on a pump');
	check(L.linkLabel(pipe.id).some((s) => /^Hl=/.test(s)), `a pipe keeps "Hl=": ${L.linkLabel(pipe.id).join(' | ')}`);

	headp('5. TIME SERIES');
	L.openLinkPopup(pump.id, 100, 100);
	choose('headloss');
	check(/(^|\| )Head \(/.test(chartText()) && chartText().indexOf('Head gain') < 0, 'the axis reads Head');
	const titles = byCls('lpn-ts-dot').map((c) => (c.children || []).map((x) =>
		(x.children || []).map((y) => String(y.textContent)).join('')).join('')).filter(Boolean).map(lastNum);
	check(titles.length > 0 && titles.every((v) => v >= 0) && titles.some((v) => v > 0), `every plotted value is positive (max ${Math.max.apply(null, titles)})`);
	L.closePopup();

	headp('6. FULL REPORT');
	const rows = L.fullReportRows();
	const pr = rows.filter((r) => r.group === 'link' && String(r.id) === String(pump.id));
	const qr = rows.filter((r) => r.group === 'link' && String(r.id) === String(pipe.id));
	check(pr.length > 0 && pr.every((r) => r.headloss === undefined && typeof r.pumphead === 'number' && r.pumphead >= 0), 'pump rows fill Pump head (>= 0) and leave Head loss blank');
	check(qr.length > 0 && qr.every((r) => r.pumphead === undefined && typeof r.headloss === 'number'), 'pipe rows fill Head loss and leave Pump head blank');
	const header = L.fullReportCsvText(rows).split('\r\n')[0];
	check(/Head loss \(/.test(header) && /Pump head \(/.test(header), `the CSV header has both columns: ${header}`);
	const names = header.split(',').map((h) => h.replace(/\s*\(.*$/, ''));
	check(names.length === new Set(names).size, `and no two columns share a name: ${names.join(' | ')}`);

	console.log(failures ? '\n' + failures + ' FAILED' : '\nall passed');
	process.exit(failures ? 1 : 0);
}());
