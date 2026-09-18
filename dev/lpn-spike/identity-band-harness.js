// THE IDENTITY BAND: ID | X | Y | Description | Tag -- ROADMAP Task 674. Run with:
//   node dev/lpn-spike/identity-band-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-15, reading the property popup: *"Description: Isn't this new to
// us? I don't see it in our current UI. And Tag is at the bottom like we really don't care about
// it, which is true. Also Tag is not in Tables. All that is a bit embarrassing. We need a
// consistent approach."* His ruling is the full band on BOTH surfaces in EPANET's Property Editor
// order, which is what sections 3 and 4 below drive through the real DOM and the real column specs.
//
// **BUT THE LARGER HALF WAS A SILENT DATA LOSS, AND THAT IS SECTIONS 1 AND 2.** EPANET carries a
// description as the TRAILING COMMENT on each element's own row. js/lpn-inp.js split that comment
// into a local at its main read loop and no node or link reader ever touched it, so:
//
//     fixture:      J1  100  50  ;Corner of Elm and Main
//     imported J1:  { id, type, x, y, elev, demand, emitter, demandPattern }
//     res.dropped:  []
//
// The description was gone and NOTHING WAS REPORTED -- the one contract js/lpn-inp.js has, broken
// in the one module whose own comment about unreferenced curves calls this exact failure "silent
// loss in the one module whose contract is that there is none". Measured through the page's own
// parser before the fix, on all six sections that carry one.
//
// **THE MACHINERY WAS ONE SECTION OVER THE WHOLE TIME.** [DEMANDS] reads its trailing comment as
// the demand CATEGORY, deliberately, and its own note records that stripping comments and stopping
// there is what threw the categories away before Task 468.
//
// **THE THING THAT MAKES THIS DELICATE IS THAT A COMMENT MEANS DIFFERENT THINGS PER SECTION**, so
// section 2 asserts the negative as well as the positive: [DEMANDS] must still mean a category by
// its comment and [CURVES] must still type a curve by its `;PUMP:` line. A reader that applied the
// description reading from the main loop instead of at the six element sections would pass every
// assertion in section 1 and quietly give a control, a pattern and an option a description.
//
// **AND EPA'S OWN Net1/2/3 CARRY NO DESCRIPTIONS -- they carry a BARE TRAILING `;` on every data
// row**, which is EPANET's writer emitting the empty slot. So an empty comment must read as no
// description at all, or every element of every EPA sample file would arrive carrying `''` and the
// export byte-identity harness would go red. Section 1 asserts that directly.
//
// Every user-facing string is asserted against EngCalcs.pageConfig, never against an English
// literal -- harness_wording_check.php is a ratchet and a reworded key must not redden this file.

const fs = require('fs');
const { ROOT, byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tnodeById: nodeById, linkById: linkById,\n" +
	"\t\tdescField: descField, tagField: tagField,\n" +
	"\t\trenderNodeFields: renderNodeFields, renderLinkFields: renderLinkFields,\n" +
	"\t\tpaneTables: paneTables, paneCols: paneCols, paneCellText: paneCellText,\n" +
	"\t\tpaneCellIsPlain: paneCellIsPlain, paneHeadingText: paneHeadingText,\n" +
	"\t\tpaneWriteCellText: paneWriteCellText,\n" +
	"\t\tfindPropDefs: findPropDefs, findPropIsText: findPropIsText,\n" +
	"\t\treplaceExtraSpecs: replaceExtraSpecs, replaceSpecGroupOk: replaceSpecGroupOk,\n" +
	"\t\tOVERRIDABLE: LPN_OVERRIDABLE,\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections,\n" +
	"\t\tsetDoc: function (d) { doc = d; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' };\n" +
	"\t\t\tscenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

const PC = global.EngCalcs.pageConfig;
ensure('lpn_popup_fields');
ensure('lpn_map_notice');
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('si');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// ---- 1. every element section's trailing comment is read as a description ----------------------
{
	console.log('\n--- the six sections whose comment EPANET means as a description ---');

	const txt = [
		'[JUNCTIONS]',
		' J1  100  50  ;Corner of Elm and Main',
		' J2  90   10  ;',                       // EPANET's own empty slot -- see the header
		'[RESERVOIRS]',
		' R1  200  ;City plant discharge',
		'[TANKS]',
		' T1  100  10  0  20  15  0  ;Hilltop standpipe',
		'[PIPES]',
		' P1  J1  T1  1000  8  100  0  Open  ;1962 cast iron main',
		' P2  J1  J2  500   6  100  0  Open',   // no comment at all
		'[PUMPS]',
		' PU1  R1  J1  HEAD  C1  ;Booster No 2',
		'[VALVES]',
		' V1  J2  T1  6  TCV  2  0  ;Vault 14, north side',
		'[CURVES]',
		';PUMP: Pump Curve for Pump PU1',
		' C1  1000  200',
		'[COORDINATES]',
		' J1 0 0', ' J2 1 1', ' R1 1 0', ' T1 2 0',
		'[END]'
	].join('\n');

	const res = EngCalcs.lpnInpParse(txt);
	ok('the file imports', res.ok === true);
	const node = (id) => res.nodes.filter((n) => n.id === id)[0];
	const link = (id) => res.links.filter((l) => l.id === id)[0];

	ok('a junction description is read', node('J1').desc === 'Corner of Elm and Main');
	ok('a reservoir description is read', node('R1').desc === 'City plant discharge');
	ok('a tank description is read', node('T1').desc === 'Hilltop standpipe');
	ok('a pipe description is read', link('P1').desc === '1962 cast iron main');
	ok('a pump description is read', link('PU1').desc === 'Booster No 2');
	// A comma inside a description, because the [TAGS] reader next door stops at whitespace and a
	// description must not learn that habit.
	ok('a valve description keeps its whole sentence', link('V1').desc === 'Vault 14, north side');

	// **THE EMPTY SLOT.** Net1, Net2 and Net3 end every data row with a bare `;`. If that read as a
	// description, every element of every EPA sample file would arrive carrying one and the export
	// would start writing a `;` this writer does not write.
	ok("EPANET's own empty trailing `;` is NOT a description", !('desc' in node('J2')), JSON.stringify(node('J2').desc));
	ok('no comment at all is not a description', !('desc' in link('P2')));

	// Nothing about reading a description may change what was already read off the same row.
	ok('the row it sits on is unchanged', node('J1').elev === 100 && node('J1').demand === 50);
	ok('a pipe row is unchanged', link('P1').length === 1000 && link('P1').diameter === 8);
}

// ---- 2. the sections whose comment means something ELSE are untouched -------------------------
{
	console.log('\n--- a comment does not mean the same thing in every section ---');

	const txt = [
		'[JUNCTIONS]',
		' J1  100  0',
		'[RESERVOIRS]',
		' R1  200',
		'[PIPES]',
		' P1  J1  R1  100  8  100  0  Open',
		'[DEMANDS]',
		' J1  50  ;Elm Acres',
		'[CURVES]',
		';EFFICIENCY: how good is it',
		' E1  500  70',
		'[COORDINATES]',
		' J1 0 0', ' R1 1 0',
		'[END]'
	].join('\n');
	const res = EngCalcs.lpnInpParse(txt);
	const j = res.nodes.filter((n) => n.id === 'J1')[0];

	// [DEMANDS] means a CATEGORY by its comment, and has since Task 468.
	ok('[DEMANDS] still reads its comment as a demand category',
		j.demandCategory === 'Elm Acres' || (j.extraDemands || []).some((d) => d.category === 'Elm Acres'),
		JSON.stringify({ c: j.demandCategory, e: j.extraDemands }));
	// And the junction itself gains NO description from a [DEMANDS] row: the row is the demand's,
	// not the junction's, and the junction's own [JUNCTIONS] row carried no comment.
	ok('a [DEMANDS] category is not promoted to the junction description', !('desc' in j));

	// [CURVES] types a curve by a `;KIND:` line, and that is what makes a curve nothing references
	// typeable at all (Task 586).
	const e1 = (res.curves || []).filter((c) => c.id === 'E1')[0];
	// 'effic' is INP_CURVE_TYPE's own word for EPANET's EFFICIENCY, read out of the table rather
	// than spelled here, so a rename of the internal word cannot redden this file for nothing.
	ok('[CURVES] still types a curve by its own comment line',
		!!e1 && e1.kind === 'effic', JSON.stringify(e1 && e1.kind));
	ok('a curve gains no description', !e1 || !('desc' in e1));
}

// ---- 3. export writes it back, and a round trip is byte-identical -----------------------------
{
	console.log('\n--- the description comes back out on the end of its own row ---');

	const src = [
		'[JUNCTIONS]',
		' J1\t100\t50\t;Corner of Elm and Main',
		'[RESERVOIRS]',
		' R1\t200\t;City plant discharge',
		'[TANKS]',
		' T1\t100\t10\t0\t20\t15\t0\t;Hilltop standpipe',
		'[PIPES]',
		' P1\tJ1\tT1\t1000\t8\t100\t0\tOpen\t;1962 cast iron main',
		'[VALVES]',
		' V1\tJ1\tT1\t6\tTCV\t2\t0\t;Vault 14, north side',
		'[OPTIONS]',
		' UNITS\tLPS',
		' HEADLOSS\tH-W',
		'[COORDINATES]',
		' J1\t0\t0', ' R1\t1\t0', ' T1\t2\t0',
		'[END]'
	].join('\n') + '\n';

	const parsed = EngCalcs.lpnInpParse(src);
	L.reset();
	// The import path in full, as inp-export-harness.js does it: the units strip moves to the
	// file's units FIRST, because docFromInp() is written against the selector state.
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const out = EngCalcs.lpnExportInp(L.docFromInp(parsed, 'T'));
	ok('the document exports', out.ok === true, JSON.stringify(out.error));
	const text = out.inp;

	// Row for row, through a deliberately dumber reader than the one that wrote it: find the line
	// whose first token is the id and read everything after its first `;`.
	function descIn(sectionText, id) {
		const lines = sectionText.split(/\n/);
		for (const raw of lines) {
			const body = raw.split(';')[0];
			const toks = body.trim().split(/\s+/);
			if (toks[0] !== id) { continue; }
			const i = raw.indexOf(';');
			return i < 0 ? null : raw.slice(i + 1);
		}
		return undefined;
	}
	ok('a junction description is written', descIn(text, 'J1') === 'Corner of Elm and Main', JSON.stringify(descIn(text, 'J1')));
	ok('a reservoir description is written', descIn(text, 'R1') === 'City plant discharge');
	ok('a tank description is written', descIn(text, 'T1') === 'Hilltop standpipe');
	ok('a pipe description is written', descIn(text, 'P1') === '1962 cast iron main');
	ok('a valve description is written', descIn(text, 'V1') === 'Vault 14, north side');

	// **THE ACCEPTANCE CRITERION: reading the export back gives the same descriptions.** Not "within
	// tolerance" -- identical, on strings. This is the whole of what makes a description the user's
	// rather than ours.
	const again = EngCalcs.lpnInpParse(text);
	const pairs = [['J1', 'Corner of Elm and Main'], ['R1', 'City plant discharge'], ['T1', 'Hilltop standpipe']];
	pairs.forEach(function (p) {
		const n = again.nodes.filter((x) => x.id === p[0])[0];
		ok('round trip keeps ' + p[0] + "'s description", !!n && n.desc === p[1], n && n.desc);
	});
	['P1', 'V1'].forEach(function (id) {
		const a = parsed.links.filter((x) => x.id === id)[0];
		const b = again.links.filter((x) => x.id === id)[0];
		ok('round trip keeps ' + id + "'s description", !!b && b.desc === a.desc, b && b.desc);
	});

	// A `;` INSIDE a description round-trips, because a trailing comment runs to the end of its
	// line and everything after the FIRST `;` is the description -- the second one included. This is
	// why lpnDescText() refuses the line break and nothing else.
	const semi = EngCalcs.lpnInpParse(src.replace('Corner of Elm and Main', 'Elm; and Main'));
	ok('a `;` inside a description is READ whole',
		semi.nodes.filter((n) => n.id === 'J1')[0].desc === 'Elm; and Main');
}

// ---- 4. EPA's own reference files gain nothing ------------------------------------------------
{
	console.log('\n--- Net1, Net2 and Net3 carry no descriptions, and still do not ---');
	['Net1', 'Net2', 'Net3'].forEach(function (name) {
		const res = EngCalcs.lpnInpParse(fs.readFileSync(ROOT + 'dev/lpn-spike/reference/' + name + '.inp', 'utf8'));
		const withDesc = res.nodes.concat(res.links).filter((e) => e.desc !== undefined);
		ok(name + ' gains no description from its bare trailing `;`', withDesc.length === 0,
			withDesc.map((e) => e.id + '=' + JSON.stringify(e.desc)).join(','));
	});
}

// ---- 5. lpnDescText: what is refused, and what is carried ------------------------------------
{
	console.log('\n--- only the line break is refused ---');
	const d = EngCalcs.lpnDescText;
	ok('a sentence is carried whole', d('Corner of Elm and Main') === 'Corner of Elm and Main');
	ok('a `;` is carried', d('Elm; and Main') === 'Elm; and Main');
	// A tab round-trips in a trailing comment too, so it is the user's text and is left alone.
	ok('a tab is carried', d('Elm\tMain') === 'Elm\tMain');
	// A newline CANNOT be written as a trailing comment, so it becomes one space -- the one thing
	// this function refuses, and the reason it is called at the field, the cell, Find and the writer.
	ok('a newline becomes one space', d('Elm\nMain') === 'Elm Main');
	ok('a CRLF becomes one space', d('Elm\r\nMain') === 'Elm Main');
	ok('trimmed, because the reader trims', d('  Elm  ') === 'Elm');
	ok('whitespace only is no description', d(' \n ') === '');
	ok('absent is no description', d(undefined) === '' && d(null) === '');
}

// ---- 6. the popup's band, in Tom's order, driven through the real DOM -------------------------
{
	console.log('\n--- ID | X | Y | Description | Tag | Elevation, on the popup ---');

	function labelsOf() {
		const out = [];
		(function walk(e) {
			(e.children || []).forEach(function (c) {
				if (c._tag === 'label') {
					// setFieldLabel writes the words into the label's own first text node.
					out.push(String(c.textContent || '').trim() ||
						String((c.children || []).filter((k) => k._tag !== 'input' && k._tag !== 'select')
							.map((k) => k.textContent || '').join('')).trim());
				}
				walk(c);
			});
		}(byId.lpn_popup_fields));
		return out;
	}
	function firstIndexOf(list, text) {
		for (let i = 0; i < list.length; i++) { if (list[i].indexOf(text) === 0) { return i; } }
		return -1;
	}

	L.reset();
	const n = L.addNode('junction', 10, -20);
	L.buildDom();
	L.renderNodeFields(n.id);
	let labs = labelsOf();
	let iDesc = firstIndexOf(labs, PC.lpn_field_desc), iTag = firstIndexOf(labs, PC.lpn_field_tag),
		iElev = firstIndexOf(labs, PC.lpn_field_elev);
	ok('a node popup has a Description row', iDesc >= 0, labs.join(' | '));
	ok('a node popup has a Tag row', iTag >= 0);
	ok('Description comes before Tag', iDesc >= 0 && iTag > iDesc);
	// **THE HALF THAT WAS EMBARRASSING**: Tag used to be at the bottom, below the solved results.
	ok('Tag comes before Elevation', iTag >= 0 && iElev > iTag, labs.join(' | '));
	// The coordinates keep slots 2-3, which is the previous ruling this one extends.
	ok('the coordinate rows still come first', iDesc >= 2, 'desc at ' + iDesc);

	// **THE TYPED VALUE REACHES THE DOCUMENT, THROUGH THE REAL FIELD'S OWN LISTENER.** A harness
	// that assigned n.desc directly would pass with the field unwired.
	function inputsIn() {
		const out = [];
		(function walk(e) {
			(e.children || []).forEach(function (c) { if (c._tag === 'input') { out.push(c); } walk(c); });
		}(byId.lpn_popup_fields));
		return out;
	}
	const box = inputsIn()[iDesc];
	box.value = 'Corner of Elm and Main';
	((box._listeners && box._listeners.input) || []).forEach((f) => f({}));
	ok('typing a description writes it to the node', n.desc === 'Corner of Elm and Main', n.desc);
	// The refusal is applied AS YOU TYPE, the way the tag's space rule is -- so a pasted paragraph
	// shows its own rule rather than losing half of itself after the field is left.
	box.value = 'Elm\nMain';
	((box._listeners && box._listeners.input) || []).forEach((f) => f({}));
	ok('a pasted newline is refused in the box itself', box.value === 'Elm Main', box.value);
	ok('and the document holds the same thing the box shows', n.desc === 'Elm Main', n.desc);
	box.value = '';
	((box._listeners && box._listeners.input) || []).forEach((f) => f({}));
	ok('clearing the box removes the key rather than storing an empty string', !('desc' in n));

	// A LINK has no coordinates, so the band is ID, Description, Tag, then everything else.
	const m = L.addNode('junction', 40, -20);
	L.buildDom();
	const lk = L.addLink('pipe', n.id, m.id);
	L.buildDom();
	L.renderLinkFields(lk.id);
	labs = labelsOf();
	iDesc = firstIndexOf(labs, PC.lpn_field_desc); iTag = firstIndexOf(labs, PC.lpn_field_tag);
	ok('a link popup has a Description row', iDesc >= 0, labs.join(' | '));
	ok('a link popup puts Description first, with no coordinates before it', iDesc === 0, 'desc at ' + iDesc);
	ok('a link popup puts Tag second', iTag === 1);
	ok('a link popup has exactly one Description row', labs.filter((t) => t.indexOf(PC.lpn_field_desc) === 0).length === 1);
	ok('a link popup has exactly one Tag row', labs.filter((t) => t.indexOf(PC.lpn_field_tag) === 0).length === 1);
}

// ---- 7. the columns, in all six asset tables -------------------------------------------------
{
	console.log('\n--- Description and Tag as columns, which Tag had never been ---');

	L.reset();
	const j = L.addNode('junction', 10, -20);
	const r = L.addNode('reservoir', 40, -20);
	const t = L.addNode('tank', 70, -20);
	L.buildDom();
	const pipe = L.addLink('pipe', j.id, r.id);
	L.buildDom();

	const specs = L.paneTables();
	const assetTabs = ['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves'];
	assetTabs.forEach(function (id) {
		const spec = specs.filter((s) => s.id === id)[0];
		const keys = L.paneCols(spec).map((c) => c.key);
		const iId = keys.indexOf('id'), iDesc = keys.indexOf('desc'), iTag = keys.indexOf('tag');
		ok(id + ' has a Description column', iDesc >= 0, keys.join(','));
		ok(id + ' has a Tag column', iTag >= 0, keys.join(','));
		ok(id + ': Description then Tag', iDesc >= 0 && iTag === iDesc + 1);
		if (spec.group === 'node') {
			// Slots 4 and 5: id, axis1, axis2, desc, tag -- Tom's one rule for both surfaces.
			ok(id + ': the band follows the two coordinate columns',
				keys.slice(0, 5).join(',') === 'id,axis1,axis2,desc,tag', keys.slice(0, 6).join(','));
		} else {
			ok(id + ': the band follows the id', keys.slice(0, 3).join(',') === 'id,desc,tag', keys.slice(0, 4).join(','));
		}
		// The heading is the popup's own whole label, reused rather than re-keyed.
		const cols = L.paneCols(spec);
		ok(id + ': the heading is the popup label',
			L.paneHeadingText(cols[iDesc]) === PC.lpn_field_desc &&
			L.paneHeadingText(cols[iTag]) === PC.lpn_field_tag);
		// Both are TYPEABLE: they are the two properties a reader most wants to paste a column of.
		ok(id + ': both cells are editable rather than plain',
			!L.paneCellIsPlain(cols[iDesc], j) && !L.paneCellIsPlain(cols[iTag], j));
	});

	// **THE CELL WRITES THROUGH THE SAME ONE-PLACE RULES THE POPUP USES**, which is what a paste
	// exercises and a popup field cannot: a spreadsheet cell really can carry a newline.
	const jSpec = specs.filter((s) => s.id === 'junctions')[0];
	const jCols = L.paneCols(jSpec);
	const dCol = jCols[jCols.map((c) => c.key).indexOf('desc')];
	const tCol = jCols[jCols.map((c) => c.key).indexOf('tag')];
	dCol.set(j, 'Elm\nMain');
	ok('a pasted newline is collapsed at the cell too', j.desc === 'Elm Main', j.desc);
	ok('the cell reads back what it stored', L.paneCellText(dCol, j) === 'Elm Main');
	dCol.set(j, '   ');
	ok('a whitespace-only paste clears the key', !('desc' in j));
	tCol.set(j, 'MAIN 1962 south');
	ok("the tag cell keeps EPANET's one word", j.tag === 'MAIN', j.tag);
	tCol.set(j, '');
	ok('an empty tag cell clears the key', !('tag' in j));

	// A pipe is a link and carries both on the same terms.
	const pSpec = specs.filter((s) => s.id === 'pipes')[0];
	const pCols = L.paneCols(pSpec);
	pCols[pCols.map((c) => c.key).indexOf('desc')].set(pipe, '1962 cast iron main');
	ok('a link cell writes a description', pipe.desc === '1962 cast iron main');
}

// ---- 8. Find and replace ---------------------------------------------------------------------
{
	console.log('\n--- Description is searchable and writable in bulk ---');

	L.reset();
	const j = L.addNode('junction', 10, -20);
	const r = L.addNode('reservoir', 40, -20);
	L.buildDom();
	const pipe = L.addLink('pipe', j.id, r.id);
	L.buildDom();

	const defs = L.findPropDefs({ key: 'junction', group: 'node', type: 'junction' });
	const keys = defs.map((d) => d[0]);
	ok('Find offers Description', keys.indexOf('desc') >= 0, keys.join(','));
	ok('Find offers it ahead of Tag', keys.indexOf('desc') >= 0 && keys.indexOf('tag') > keys.indexOf('desc'));
	const row = defs.filter((d) => d[0] === 'desc')[0];
	ok("Find's label is the popup's own", row[1] === PC.lpn_field_desc, row[1]);
	// The third slot is the English spelling the typed-query parser matches on, which is why it is a
	// literal and not a pageConfig read -- see js_fallback_string_check.php's triple shape.
	ok('Find names it in English for the query parser', row[2] === 'Description');
	// **THE CONDITIONS MUST BE THE TEXT ONES.** A description on the numeric conditions offers
	// greater-than on a sentence, which is a control that can only mislead.
	ok('Description takes the text conditions', L.findPropIsText('desc') === true);

	// It is offered under a LINK scope and under "Everything" too, because both groups carry one.
	['pipe', 'all'].forEach(function (k) {
		const g = k === 'all' ? undefined : 'link';
		const ks = L.findPropDefs({ key: k, group: g, type: g ? 'pipe' : undefined }).map((d) => d[0]);
		ok('Find offers Description under scope ' + k, ks.indexOf('desc') >= 0, ks.join(','));
	});

	const spec = L.replaceExtraSpecs().filter((s) => s.field === 'desc')[0];
	ok('Replace can write a description', !!spec);
	ok('it is carried by nodes and links alike', spec.group === 'any' &&
		L.replaceSpecGroupOk(spec, 'node') && L.replaceSpecGroupOk(spec, 'link'));
	// A Text object is not an asset and carries neither, which is the tag's standing already.
	ok('a Text object carries none of it', !L.replaceSpecGroupOk(spec, 'label'));
	// **`str`, NOT `text`, AND THAT IS THE ONE DIFFERENCE FROM THE TAG.** `text` puts the value
	// through lpnTagText() and would keep one word of a sentence.
	ok('a bulk description is free text, not one word', spec.str === true && !spec.text);
	spec.set(j, 'Corner of Elm and Main');
	spec.set(pipe, 'Elm\nMain');
	ok('a bulk write reaches a node', j.desc === 'Corner of Elm and Main');
	ok('a bulk write collapses a newline as well', pipe.desc === 'Elm Main', pipe.desc);
	ok('and reads back through its own getter', spec.get(j) === 'Corner of Elm and Main');
}

// ---- 9. base-owned, on Tom's own consistency ruling ------------------------------------------
{
	console.log('\n--- identity is Base-owned, as the tag beside it is ---');
	// Both halves of the band, and the assertion is deliberately symmetrical: whichever way this is
	// ruled, Description and Tag must be ruled the SAME way. One overridable and the other not is
	// exactly the inconsistency Tom called embarrassing, and it would be invisible on screen --
	// a scenario would simply keep its own description and Base's tag with nothing to say so.
	const nodeOv = L.OVERRIDABLE.node || {}, linkOv = L.OVERRIDABLE.link || {};
	ok('Description and Tag agree on a node',
		!!nodeOv.desc === !!nodeOv.tag, JSON.stringify({ desc: nodeOv.desc, tag: nodeOv.tag }));
	ok('Description and Tag agree on a link',
		!!linkOv.desc === !!linkOv.tag, JSON.stringify({ desc: linkOv.desc, tag: linkOv.tag }));
	// And as ruled today, neither is -- so setProp() is never reached and no `_desc` is invented.
	ok('Description is Base-owned on a node', !nodeOv.desc);
	ok('Description is Base-owned on a link', !linkOv.desc);
}

// ---- 10. the project file carries it, because a description is modelling data ------------------
{
	console.log('\n--- a saved project reopens with its descriptions ---');
	// `serializeProject()` writes `doc.nodes` and `doc.links` whole, so this rides along the way the
	// tag does -- there is no key list to forget. What is asserted is that it actually DOES, because
	// the alternative failure is silent: a description typed, saved, reopened and gone, with nothing
	// on screen to say the file never held it. It is MODELLING data and belongs to the project, not
	// window furniture that belongs to the browser (lpn_furniture_check.php's question).
	L.reset();
	const n = L.addNode('junction', 10, -20);
	const m = L.addNode('junction', 40, -20);
	L.buildDom();
	const lk = L.addLink('pipe', n.id, m.id);
	L.buildDom();
	n.desc = 'Corner of Elm and Main';
	n.tag = 'METER-4417';
	lk.desc = '1962 cast iron main';
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	L.reset();
	L.applySaved(saved);
	const back = L.nodeById(n.id), backLink = L.linkById(lk.id);
	ok('a node description survives save and reopen', !!back && back.desc === 'Corner of Elm and Main', back && back.desc);
	ok('the tag beside it still does too', !!back && back.tag === 'METER-4417');
	ok('a link description survives save and reopen', !!backLink && backLink.desc === '1962 cast iron main', backLink && backLink.desc);
}

console.log('\n' + (fails ? fails + ' FAILURES' : 'all identity-band checks passed'));
process.exit(fails ? 1 : 0);
