// TOM'S SYMBOLOGY TABLE IS THE DEFAULTS, AND EVERY EXAMPLE OPENS ON IT. Run with:
//   node dev/lpn-spike/symbology-table-harness.js
//
// Tom, 2026-09-26 (dev/tom-review-queue.md R-326..R-334):
//   R-326 "Drop order is missing for Node ID and several Customer properties."
//   R-327 "Initial defaults and all examples need to be consistent."
//   R-328 "we need an internal way to guess decimals based on the units factor. And/or we need our
//          table of initial decimals to include at least the main US and SI units."
//   R-329 "I don't like that ID needs to display first, but also may need to drop first."
//   R-331 "We need a code or a toggle to 'Use units' for the After string. It should put space and
//          units in the After field and disable it."
//   R-333 "the Settings index pane Symbology section can be reworked to Node labels, Node colors,
//          Link labels, Link colors, Customer."
//   R-334 "See dev/settings-symbology-defaults.csv. Rename if needed."
//
// **THE DEFECT A VISITOR COULD HIT AND A PERSON WOULD MISS** is drift: the page's shipped table,
// Tom's CSV and seven gallery files are three copies of one answer, and a change to any one of them
// leaves a gallery example opening on labels no new project would have. So:
//
//   1. dev/symbology-defaults.csv == LPN_LABEL_TABLE == what a fresh US and a fresh SI project
//      actually print (prefix, suffix, decimals, show order, drop order, Show? tick).
//   2. Every published example, opened the way the gallery opens it, lands on that same table for
//      its own unit system (which properties it SHOWS is its own curation and is not compared).
//   3. Every row a Settings list offers has a Show order and a Drop order, in every quality mode.
//   4. "Use units": the tick fills After with the unit, disables the box, follows a unit change,
//      survives a save and reopen, and a project saved before the tick keeps its own typed After.
//   5. Decimals follow a unit change while they are still that unit's default, and not after the
//      user has chosen their own.
//   6. The Settings index names the five Symbology entries, and each one's host fills with rows.
//   7. Nothing new is stored on the visitor's device: the new maps ride in serializeProject().

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, unitSelects } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	"\t\ttable: function () { return LPN_LABEL_TABLE; },\n" +
	"\t\tunitDecimals: function () { return LPN_UNIT_DECIMALS; },\n" +
	"\t\tdecimalsForUnit: labelDecimalsForUnit,\n" +
	"\t\tls: function () { return labelSettings; },\n" +
	"\t\tresetLS: function () { labelSettings = defaultLabelSettings(); },\n" +
	"\t\tprefixFor: labelPrefixFor, suffixFor: labelSuffixFor, rank: labelRank,\n" +
	"\t\tqualityDecimals: function (g) { return qualityDecimals(labelSettings.decimals[g]); },\n" +
	"\t\tnodeDefs: function () { return nodeFieldDefs(EngCalcs.pageConfig || {}); },\n" +
	"\t\tlinkDefs: function () { return linkFieldDefs(EngCalcs.pageConfig || {}); },\n" +
	"\t\tcustDefs: function () { return customerFieldDefs(EngCalcs.pageConfig || {}); },\n" +
	"\t\tserializeProject: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\trebuildLabels: rebuildLabelsFields, applyOneUnit: applyOneUnit,\n" +
	"\t\tafterUnitChange: afterUnitChange, unitKey: unitKey,\n" +
	"\t\tbuildColoring: function () { if (typeof buildColoringSection === 'function') { buildColoringSection(); } },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const q = (v) => JSON.stringify(v);

setUnitSet('us');
L.buildLayers();

// ---- the CSV ---------------------------------------------------------------------------------
const CSV = path.join(ROOT, 'dev', 'symbology-defaults.csv');
const csvRows = fs.readFileSync(CSV, 'utf8').split('\n').map((l) => l.replace(/\r$/, ''));
const head = csvRows[0].split('\t');
const col = (name) => head.indexOf(name);
const C = { name: col('Property'), on: col('Show?'), before: col('Before'), afterUS: col('After US'),
	afterSI: col('After SI'), decUS: col('Dec. US'), decSI: col('Dec. SI'), show: col('Show order'),
	drop: col('Drop order'), key: col('Key') };
const rows = [];
csvRows.slice(1).forEach((l) => {
	const c = l.split('\t');
	if (!c[C.key] || c[0].startsWith('## ')) { return; }
	const k = c[C.key].split(':');
	rows.push({ name: c[C.name], key: c[C.key], group: k[0], field: k[1], mode: k[2] || null,
		on: c[C.on] === '1', before: c[C.before], after: { us: c[C.afterUS], si: c[C.afterSI] },
		dec: { us: c[C.decUS] === '' ? null : +c[C.decUS], si: c[C.decSI] === '' ? null : +c[C.decSI] },
		show: +c[C.show], drop: +c[C.drop] });
});

// **WHAT THIS HARNESS DECLINES TO HOLD THE PAGE TO, AND WHY -- each one is Tom's to rule on.**
// A row keyed '-' is a property the page does not have as a label at all.
const NOT_BUILT = rows.filter((r) => r.key === '-').map((r) => r.name);
// A count of services has no unit for its US and SI decimals to differ by; it prints whole.
const DEC_EXCEPTION = { 'customer:count': 'a count has no unit; printed whole (Tom\'s table: 0 US, 1 SI)' };

const MODES = { chemical: { mode: 'chemical', chemical: 'Chlorine mg/L', traceNode: '' },
	trace: { mode: 'trace', traceNode: '' }, age: { mode: 'age', traceNode: '' } };

console.log('== 0. the table itself ==');
ok('the CSV has every column the page needs', Object.values(C).every((i) => i >= 0), q(C));
ok('the CSV names at least one row in each group',
	['node', 'link', 'customer'].every((g) => rows.some((r) => r.group === g)));
ok('rows the page cannot label are declared, not silently skipped: ' + q(NOT_BUILT), NOT_BUILT.length <= 1);
{
	const T = L.table(), built = rows.filter((r) => r.key !== '-');
	const inCsv = new Set(built.map((r) => r.group + ':' + r.field));
	const missing = [];
	Object.keys(T).forEach((g) => Object.keys(T[g]).forEach((f) => { if (!inCsv.has(g + ':' + f)) { missing.push(g + ':' + f); } }));
	ok('every row of LPN_LABEL_TABLE is a row of the CSV', missing.length === 0, q(missing));
}

// ---- 1. a fresh project prints the table, in US and SI ---------------------------------------
function expectRow(r, sys, ctx) {
	const g = r.group, f = r.field, ls = L.ls();
	if (r.mode) { L.setQuality(MODES[r.mode]); } else { L.setQuality(MODES.age); }
	const pre = L.prefixFor(g, f), suf = L.suffixFor(g, f);
	const bad = [];
	if (pre !== r.before) { bad.push('Before ' + q(pre) + ' want ' + q(r.before)); }
	if (suf !== r.after[sys]) { bad.push('After ' + q(suf) + ' want ' + q(r.after[sys])); }
	if (L.rank('show', g, f) !== r.show) { bad.push('Show ' + L.rank('show', g, f) + ' want ' + r.show); }
	if (L.rank('priority', g, f) !== r.drop) { bad.push('Drop ' + L.rank('priority', g, f) + ' want ' + r.drop); }
	const dec = f === 'quality' ? L.qualityDecimals(g) : ls.decimals[g][f];
	const want = r.dec[sys];
	if (DEC_EXCEPTION[r.key]) {
		if (dec !== undefined) { bad.push('Decimals ' + dec + ' want none (' + DEC_EXCEPTION[r.key] + ')'); }
	} else if (want === null ? dec !== undefined : dec !== want) {
		bad.push('Decimals ' + dec + ' want ' + want);
	}
	if (ctx.checkOn && !!ls[g][f] !== r.on) { bad.push('Show? ' + !!ls[g][f] + ' want ' + r.on); }
	return bad;
}
['us', 'si'].forEach((sys) => {
	console.log('== 1. a new ' + sys.toUpperCase() + ' project opens on Tom\'s table ==');
	setUnitSet(sys);
	L.resetLS();
	rows.filter((r) => r.key !== '-').forEach((r) => {
		const bad = expectRow(r, sys, { checkOn: true });
		ok(r.key + ' (' + r.name + ')', bad.length === 0, bad.join('; '));
	});
});
L.setQuality(MODES.age);

// ---- 2. every published example opens on the table for its own units --------------------------
console.log('== 2. every gallery example opens on the same table ==');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'manifest.json'), 'utf8'));
manifest.examples.forEach((ex) => {
	const saved = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', ex.file), 'utf8'));
	setUnitSet(ex.system === 'si' ? 'si' : 'us');
	L.migrateSaved(saved);
	L.applySaved(saved);
	const bad = [];
	rows.filter((r) => r.key !== '-').forEach((r) => {
		const b = expectRow(r, ex.system === 'si' ? 'si' : 'us', { checkOn: false });
		if (b.length) { bad.push(r.key + ': ' + b.join('; ')); }
	});
	ok(ex.file + ' (' + ex.system + ')', bad.length === 0, bad.slice(0, 4).join(' | '));
	// The file itself states none of it, so the next change to the table reaches it for free.
	const lsFile = saved.labelSettings || {};
	ok(ex.file + ' stores no symbology of its own beyond what it shows',
		['decimals', 'prefix', 'suffix', 'priority', 'show', 'useUnits'].every((k) => !(k in lsFile)),
		q(Object.keys(lsFile)));
});
L.setQuality(MODES.age);

// ---- 3. every row that can be shown has a show and a drop order -------------------------------
console.log('== 3. every showable property has a Show order and a Drop order ==');
setUnitSet('us');
L.resetLS();
[['node', L.nodeDefs], ['link', L.linkDefs], ['customer', L.custDefs]].forEach(([g, defs]) => {
	Object.keys(MODES).forEach((m) => {
		L.setQuality(MODES[m]);
		const missing = defs().filter((f) => typeof L.rank('priority', g, f[0]) !== 'number' ||
			typeof L.rank('show', g, f[0]) !== 'number').map((f) => f[0]);
		ok(g + ' rows under ' + m + ' all carry both orders', missing.length === 0, q(missing));
	});
	const idDrop = L.rank('priority', g, 'id');
	ok(g + ' ID has a drop order of its own (R-326), and shows first (R-329)',
		typeof idDrop === 'number' && L.rank('show', g, 'id') === 1, 'drop ' + idDrop);
});
L.setQuality(MODES.age);

// ---- 4. Use units ------------------------------------------------------------------------------
// R-347 reordered the row (Before, After, Use units, ...) and changed the DEFAULT tick: a unit
// that draws its own mark (feet, inches) opens UNTICKED with that mark as ordinary After text --
// Tom's own words, "Length and Diameter for US projects should have ' and \", not 'Use units'
// ticked... for US, I provided suffixes" -- while a unit with no mark (metres, millimetres) opens
// TICKED, so it keeps following the unit selector, per his own "may have intended ... for SI".
console.log('== 4. "Use units" defaults to the mark, ticks, disables, follows and round-trips ==');
{
	setUnitSet('us');
	L.resetLS();
	L.rebuildLabels();
	const linkBox = byId['lpn_labels_link_fields'];
	// Row 0 is the headings; find a row by its label text.
	const rowOf = (box, text) => box.children.find((r) => r.children[0] && (r.children[0].textContent || '').indexOf(text) >= 0);
	const lenRow = rowOf(linkBox, 'Length'), diaRow = rowOf(linkBox, 'Diameter');
	ok('every field row has seven children: name, Before, After, Use units, Decimals, Show, Drop',
		linkBox.children.slice(1).every((r) => r.children.length === 7),
		q(linkBox.children.map((r) => r.children.length)));
	const tickOf = (row) => row && row.children[3].children[0], afterOf = (row) => row && row.children[2];
	let tick = tickOf(lenRow), after = afterOf(lenRow);
	ok('Length opens UNTICKED in a US project (R-347)', !!tick && tick.type === 'checkbox' && tick.checked === false);
	ok('its After box shows the foot mark, as ordinary editable text', after && after.value === "'" && after.disabled === false,
		after && q(after.value) + ' disabled=' + after.disabled);
	ok('the tick names itself "Use units"', tick && tick.getAttribute('aria-label') === 'Use units');
	const diaTick = tickOf(diaRow), diaAfter = afterOf(diaRow);
	ok('Diameter opens UNTICKED in a US project too (R-347), showing the inch mark',
		!!diaTick && diaTick.checked === false && diaAfter.value === '"' && diaAfter.disabled === false,
		diaAfter && q(diaAfter.value) + ' checked=' + diaTick.checked);
	// Ticking it on: the box disables and fills with the live unit text, and now follows a change.
	tick.checked = true; (tick._listeners.change || []).forEach((f) => f({ type: 'change', target: tick }));
	ok('ticking Length disables the After box and keeps the same foot mark',
		after.disabled === true && after.value === "'", q(after.value) + ' disabled=' + after.disabled);
	L.applyOneUnit('lpn_u_length', 'm');
	L.afterUnitChange({ lpn_u_length: 'ft' });
	ok('...and now a unit change moves the ticked After box to " m"', after.value === ' m', q(after.value));
	ok('...and the label suffix itself', L.suffixFor('link', 'length') === ' m', q(L.suffixFor('link', 'length')));
	// Untick again: the box opens, keeps the unit text as the user's own.
	tick.checked = false; (tick._listeners.change || []).forEach((f) => f({ type: 'change', target: tick }));
	ok('unticking enables the After box', after.disabled === false);
	ok('...and leaves the unit text in it as ordinary text', after.value === ' m' && L.suffixFor('link', 'length') === ' m');
	L.applyOneUnit('lpn_u_length', 'ft');
	L.afterUnitChange({ lpn_u_length: 'm' });
	ok('an unticked row does NOT follow the unit', L.suffixFor('link', 'length') === ' m', q(L.suffixFor('link', 'length')));
	// Round trip: Length untied by the user's own choice above, Diameter left at its US default.
	const out = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the tick rides in the project file (serializeProject().labelSettings.useUnits)',
		out.labelSettings && out.labelSettings.useUnits && out.labelSettings.useUnits.link.length === false &&
		out.labelSettings.useUnits.link.diameter === false, q(out.labelSettings && out.labelSettings.useUnits));
	ok('Show order rides in the project file too', out.labelSettings.show && out.labelSettings.show.node.id === 1);
	L.resetLS();
	L.migrateSaved(out); L.applySaved(out);
	ok('reopened: Length stays unticked with its own text', L.ls().useUnits.link.length === false &&
		L.suffixFor('link', 'length') === ' m');
	ok('reopened: Diameter stays unticked with the inch mark', L.ls().useUnits.link.diameter === false &&
		L.suffixFor('link', 'diameter') === '"', q(L.suffixFor('link', 'diameter')));
	// A project saved before the tick existed, with its own typed quality After text.
	const old = JSON.parse(JSON.stringify(out));
	delete old.labelSettings.useUnits;
	old.labelSettings.suffix = { node: { quality: ' ppm' }, link: {}, customer: {} };
	L.resetLS();
	L.migrateSaved(old); L.applySaved(old);
	L.setQuality(MODES.chemical);
	ok('an older project keeps the After text it typed, rather than the unit hiding it',
		L.suffixFor('node', 'quality') === ' ppm', q(L.suffixFor('node', 'quality')));
	ok('...while a row it never typed into takes the ticked default',
		L.ls().useUnits.node.initQuality === true && L.suffixFor('node', 'initQuality') === ' mg/L');
	L.setQuality(MODES.age);
	ok('a row with no unit has no tick (ID)', rowOf(linkBox, 'ID') && rowOf(linkBox, 'ID').children[3].children.length === 0);

	// **AND AN SI PROJECT TICKS BOTH BY DEFAULT** (R-347's "may have intended it for SI"): neither
	// metres nor millimetres draws a mark of its own, so there is nothing fixed to fall back to.
	setUnitSet('si');
	L.resetLS();
	L.rebuildLabels();
	const siBox = byId['lpn_labels_link_fields'];
	const siLen = rowOf(siBox, 'Length'), siDia = rowOf(siBox, 'Diameter');
	ok('Length opens TICKED in an SI project, After showing " m", disabled',
		tickOf(siLen).checked === true && afterOf(siLen).value === ' m' && afterOf(siLen).disabled === true,
		q(afterOf(siLen).value) + ' checked=' + tickOf(siLen).checked);
	ok('Diameter opens TICKED in an SI project, After showing " mm", disabled',
		tickOf(siDia).checked === true && afterOf(siDia).value === ' mm' && afterOf(siDia).disabled === true,
		q(afterOf(siDia).value) + ' checked=' + tickOf(siDia).checked);
	setUnitSet('us');
	L.resetLS();
}

// ---- 5. decimals follow a unit while they are still its default --------------------------------
console.log('== 5. decimals by unit (R-328) ==');
{
	setUnitSet('us');
	L.resetLS();
	// Tom, 2026-10-03: "I was wrong about the decimals for Qb and Q. ... 1 in US and 2 in SI for all
	// examples and the initial default."
	{
		const d = L.ls().decimals;
		ok('a US project opens Q (link flow), Qb (node demand), Q (resolved) and customer Qb at 1 place',
			d.link.flow === 1 && d.node.demand === 1 && d.node.demandActual === 1 && d.customer.demand === 1, q(d.link) + q(d.node));
		setUnitSet('si');
		L.resetLS();
		const e = L.ls().decimals;
		ok('an SI project opens Q, Qb, resolved Q and customer Qb at 2 places',
			e.link.flow === 2 && e.node.demand === 2 && e.node.demandActual === 2 && e.customer.demand === 2, q(e.link) + q(e.node));
		setUnitSet('us');
		L.resetLS();
		// Every shipped example: a stored count must follow its flow unit; none stored means it
		// follows the default above.
		const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'manifest.json'), 'utf8'));
		man.examples.forEach((ex) => {
			const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', ex.file), 'utf8'));
			const dec = (doc.labelSettings || {}).decimals || {};
			const want = ex.flow === 'gpm' ? 1 : ex.flow === 'lps' ? 2 : null;
			const got = [(dec.link || {}).flow, (dec.node || {}).demand, (dec.node || {}).demandActual, (dec.customer || {}).demand]
				.filter((v) => v !== undefined);
			ok('example ' + ex.file + ' (' + ex.flow + ') stores no Q/Qb decimals other than ' + want,
				want !== null && got.every((v) => v === want), q(got));
		});
	}
	ok('gpm opens at 1 place', L.ls().decimals.link.flow === 1);
	// WITH THE PANEL OPEN (pre-review, 2026-09-27: the stored count moved to 3 while the box on
	// screen still read 0). afterUnitChange() is the seam both the plain switch and the
	// reinterpretation dialog's Non-destructive and Destructive buttons end in.
	L.rebuildLabels();
	const flowBox = () => byId['lpn_labels_link_fields'].children
		.find((r) => (r.children[0].textContent || '').indexOf('Flow') >= 0).children[4];
	ok('the open panel shows Flow at 1 place', String(flowBox().value) === '1', flowBox().value);
	L.applyOneUnit('lpn_u_flow', 'mgd');
	L.afterUnitChange({ lpn_u_flow: 'gpm' });
	ok('switching to MGD moves an untouched flow to 3 places', L.ls().decimals.link.flow === 3, L.ls().decimals.link.flow);
	ok('...and the Decimals box already open on screen says 3 too', String(flowBox().value) === '3', flowBox().value);
	ok('...and the demands with it', L.ls().decimals.node.demand === 3 && L.ls().decimals.customer.demand === 3);
	L.ls().decimals.link.flow = 1;
	L.applyOneUnit('lpn_u_flow', 'lps');
	L.afterUnitChange({ lpn_u_flow: 'mgd' });
	ok('a count the user chose stays put', L.ls().decimals.link.flow === 1);
	ok('a unit the table does not list is guessed from its factor: m3/h -> 1 place',
		L.decimalsForUnit('lpn_u_flow', 'cmh') === 1, L.decimalsForUnit('lpn_u_flow', 'cmh'));
	ok('...and imperial MGD -> 3', L.decimalsForUnit('lpn_u_flow', 'imgd') === 3);
	ok('a gradient as plain rise/run gets 4, as a percent 2',
		L.decimalsForUnit('lpn_u_gradient', 'grade') === 4 && L.decimalsForUnit('lpn_u_gradient', 'gradePercent') === 2);
	// The table's preset units are Tom's CSV.
	const UD = L.unitDecimals();
	ok('every preset unit has a table entry', ['gpm', 'lps'].every((k) => typeof UD.lpn_u_flow[k] === 'number') &&
		['ft', 'm'].every((k) => typeof UD.lpn_u_length[k] === 'number'));
	setUnitSet('us');
}

// ---- 6. the Settings index: five Symbology entries (R-333) ------------------------------------
console.log('== 6. Settings > Symbology is Node labels, Node colors, Link labels, Link colors, Customer ==');
{
	const html = execFileSync('php', [path.join(ROOT, 'dev', 'scripts', 'render_page.php'), 'Looped-Network.php'],
		{ cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
	const sec = html.slice(html.indexOf('id="lpn_set_sec_visual"'), html.indexOf('id="lpn_set_sec_map"'));
	const subs = [...sec.matchAll(/<div class="lpn-set-sub" id="([^"]+)">([^<]*)<\/div>\s*<div class="lpn-set-subbody">([\s\S]*?)<\/div>\s*<\/div>/g)]
		.map((m) => ({ id: m[1], text: m[2].trim(), hosts: [...m[3].matchAll(/id="([^"]+)"/g)].map((h) => h[1]) }));
	const want = ['Node labels', 'Node colors', 'Link labels', 'Link colors', 'Customer'];
	ok('the first five Symbology entries are Tom\'s five, in his order',
		q(subs.slice(0, 5).map((s) => s.text)) === q(want), q(subs.map((s) => s.text)));
	const hostOf = {};
	subs.forEach((s) => { hostOf[s.text] = s.hosts; });
	ok('Node labels holds the node label list', q(hostOf['Node labels']) === q(['lpn_labels_node_fields']));
	ok('Node colors holds the node colour rows', q(hostOf['Node colors']) === q(['lpn_set_colors_node']));
	ok('Link labels holds the link label list', q(hostOf['Link labels']) === q(['lpn_labels_link_fields']));
	ok('Link colors holds the link colour rows', q(hostOf['Link colors']) === q(['lpn_set_colors_link']));
	ok('Customer holds the customer label list', q(hostOf.Customer) === q(['lpn_labels_customer_fields']));
	// And each host fills with rows when the box is built.
	L.resetLS();
	L.rebuildLabels();
	L.buildColoring();
	[['lpn_labels_node_fields', L.nodeDefs().length], ['lpn_labels_link_fields', L.linkDefs().length],
		['lpn_labels_customer_fields', L.custDefs().length]].forEach(([id, n]) => {
		const box = byId[id], fieldRows = box.children.filter((r) => r.children.length === 7);
		ok(id + ' shows a heading and ' + n + ' rows', fieldRows.length === n + 1, fieldRows.length);
	});
	ok('Node colors fills', byId['lpn_set_colors_node'].children.length > 0);
	ok('Link colors fills', byId['lpn_set_colors_link'].children.length > 0);
	const headings = byId['lpn_labels_node_fields'].children[0].children.map((c) => c.textContent);
	ok('the headings name all six columns', q(headings.slice(1)) === q(['Bef.', 'Aft.', 'Use units', '0.000', 'Show', 'Drop']),
		q(headings));
}

// ---- 6b. the number boxes on a phone (R-330) -------------------------------------------------------
console.log('== 6b. on a touch screen the Decimals, Show and Drop boxes select whole and bring up digits ==');
{
	// The real select-all rule, from the file that owns it, so this cannot pass on a copy of it.
	const EC = global.EngCalcs;
	const had = EC.selectAllCandidate;
	(0, eval)(fs.readFileSync(path.join(ROOT, 'js', 'Calculators.lib.js'), 'utf8')
		.match(/EngCalcs\.selectAllCandidate = function[\s\S]*?\n\};/)[0]);
	const realMM = global.window.matchMedia;
	global.window.matchMedia = (qq) => ({ matches: /hover:\s*none/.test(qq) && /pointer:\s*coarse/.test(qq) || realMM(qq).matches,
		media: qq, addEventListener: () => {}, removeEventListener: () => {} });
	L.resetLS();
	L.rebuildLabels();
	const row = byId['lpn_labels_node_fields'].children.find((r) => (r.children[0].textContent || '').indexOf('Pressure') >= 0);
	const nums = [4, 5, 6].map((k) => row.children[k]);
	ok('on touch they are text boxes with a digit keypad', nums.every((b) => b.type === 'text' &&
		b.getAttribute('inputmode') === 'numeric'), q(nums.map((b) => b.type + '/' + b.getAttribute('inputmode'))));
	ok('...which the page-wide select-on-focus rule covers', nums.every((b) => {
		b.closest = b.closest || (() => null);
		return EC.selectAllCandidate(b);
	}));
	global.window.matchMedia = realMM;
	L.rebuildLabels();
	const row2 = byId['lpn_labels_node_fields'].children.find((r) => (r.children[0].textContent || '').indexOf('Pressure') >= 0);
	ok('with a pointer they stay spinners', [4, 5, 6].every((k) => row2.children[k].type === 'number' &&
		row2.children[k].className === 'ec-spin'));
	if (had) { EC.selectAllCandidate = had; }
}

// ---- 7. stored state ---------------------------------------------------------------------------
console.log('== 7. nothing new is stored on the visitor\'s device ==');
{
	const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
	const a = src.indexOf('var LPN_LABEL_TABLE'), b = src.indexOf('function defaultLabelSettings()');
	ok('the table and its helpers touch no browser storage', a > 0 && b > a &&
		!/localStorage|sessionStorage|indexedDB|document\.cookie/.test(src.slice(a, b)));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);
