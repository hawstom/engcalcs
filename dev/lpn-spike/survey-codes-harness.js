// SURVEY POINTS AS A SCRIPT -- ROADMAP Task 771. Run with:
//   node dev/lpn-spike/survey-codes-harness.js
//
// WHAT IT GUARDS. With "Read the description as field codes" ticked, a point list's Description is
// read as Carlson-style codes (dev/survey-codes.md): a code makes a node of the kind the table
// says, consecutive points with one line code join into one pipe through vertices, `+0`/`-0` start
// and end a line, and `JPN<point>` (Civil 3D: `CPN`) joins to a named point -- a tee. The quiet
// ways it can go wrong: a pipe with one end node (EPANET refuses it), a tee drawn as a crossing, a
// row dropped without a word, and the untick path changing under the existing import.
//
// So: the plan is tested on strings (sections 1-2), then the real page imports the shipped
// Carlson-style fixture and the network is SOLVED (sections 3-5), and the same file with the box
// left unticked must come in exactly as the junctions-only import always did (section 6).
//
// NOTHING HERE PINS ENGLISH WORDING (dev/scripts/harness_wording_check.php): a sentence is
// asserted against `EngCalcs.pageConfig.<key>`, which the stub fills from lib/lang.ec.en.php.

const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-survey.js');
const EC = global.EngCalcs;
const PC = EC.pageConfig;

let fails = 0;
function ok(label, cond, detail) {
	if (!cond) { fails++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}
function section(name) { console.log(`\n--- ${name} ---`); }

const CODED = fs.readFileSync(ROOT + 'dev/lpn-spike/fixtures/survey-coded-carlson.csv', 'utf8');
const TABLE = EC.LPN_SURVEY_CODE_DEFAULTS;
function planOf(text, extra) {
	const parsed = EC.lpnSurveyParse(text);
	return EC.lpnSurveyCodePlan(parsed, Object.assign({ table: TABLE, fallback: 'junction' }, extra || {}));
}
const codes = (plan) => plan.notes.map(n => n.code);
// A pipe as "from>to" in point NAMES (or the project id for an existing node), with its vertices.
function pipeNames(text, plan) {
	const pts = EC.lpnSurveyParse(text).points;
	const nm = (r) => typeof r === 'number' ? pts[r].id : r.existing;
	return plan.pipes.map(p => nm(p.from) + '>' + nm(p.to) + (p.verts.length ? '[' + p.verts.map(i => pts[i].id).join(',') + ']' : ''));
}

// ================================================================================================
section('1. the plan for the shipped fixture');
// ================================================================================================
{
	const plan = planOf(CODED);
	const nodeIds = (as) => plan.nodes.filter(n => n.as === as).map(n => EC.lpnSurveyParse(CODED).points[n.pt].id);
	ok('one reservoir, from the dot-coded WELL.WL1 shot', nodeIds('reservoir').join() === '1', nodeIds('reservoir').join());
	ok('one tank, from CIST', nodeIds('tank').join() === '20');
	ok('three junctions: the tee, the hydrant and the end of the branch',
		nodeIds('junction').sort().join() === '12,3,5', nodeIds('junction').join());
	ok('four pipes, each between two nodes, through their vertices',
		pipeNames(CODED, plan).join(' ') === '1>3[2] 3>5[4] 3>12[10,11] 12>20', pipeNames(CODED, plan).join(' '));
	ok('the TEE: point 3, a plain vertex of WL1, is a node because WL2 joins it by JPN3',
		plan.nodes.some(n => EC.lpnSurveyParse(CODED).points[n.pt].id === '3'));
	ok('four points became vertices, and a file-wide note says so',
		plan.vertices === 4 && codes(plan).indexOf('vertices') >= 0);
	ok('the counts the box will state', JSON.stringify(plan.counts) ===
		JSON.stringify({ junction: 3, reservoir: 1, tank: 1, pipe: 4 }), JSON.stringify(plan.counts));
	const byLine = {};
	plan.notes.forEach(n => { if (n.line) { byLine[n.line] = (byLine[n.line] || []).concat(n.code); } });
	ok('a JPN to a point nobody surveyed is reported on its own line (file line 15)',
		(byLine[15] || []).join() === 'join-missing', JSON.stringify(byLine));
	ok('words after the code on a vertex are reported: a vertex keeps no description (line 12)',
		(byLine[12] || []).join() === 'vertex-text');
	ok('words after the code on a node are reported as kept in the description (line 13)',
		(byLine[13] || []).join() === 'code-unread');
}

// ================================================================================================
section('2. each convention on its own');
// ================================================================================================
const P = (rows) => rows.map((r, i) => r).join('\n') + '\n';
{
	const t = P(['1,0,0,10,WL1', '2,0,100,10,WL2', '3,0,200,10,WL1', '4,0,300,10,WL2']);
	ok('Carlson same-code joining: WL1 and WL2 are two lines, joined in file order',
		pipeNames(t, planOf(t)).join(' ') === '1>3 2>4', pipeNames(t, planOf(t)).join(' '));
}
{
	const t = P(['1,0,0,10,WL', '2,0,100,10,WL -0', '3,0,200,10,WL', '4,0,300,10,WL']);
	ok('-0 ends a line, and the next WL starts a new one', pipeNames(t, planOf(t)).join(' ') === '1>2 3>4',
		pipeNames(t, planOf(t)).join(' '));
	const u = P(['1,0,0,10,WL', '2,0,100,10,WL', '3,0,200,10,WL +0', '4,0,300,10,WL']);
	ok('+0 starts a new line', pipeNames(u, planOf(u)).join(' ') === '1>2 3>4', pipeNames(u, planOf(u)).join(' '));
}
{
	const t = P(['1,0,0,10,WL1', '2,0,100,10,WL1', '3,0,200,10,WL1', '4,100,100,10,WL2 CPN2', '5,200,100,10,WL2']);
	ok('Civil 3D\'s CPN is read as JPN: point 2 becomes the tee, WL1 is cut there',
		pipeNames(t, planOf(t)).join(' ') === '1>2 2>3 2>5[4]', pipeNames(t, planOf(t)).join(' '));
}
{
	const t = P(['1,0,0,10,WL1', '2,0,100,10,WL1', '3,0,200,10,WL1', '9,100,100,10,WL2', '8,200,100,10,WL2 JPN2']);
	ok('a JPN on a line\'s LAST point extends it to the named point',
		pipeNames(t, planOf(t)).join(' ') === '1>2 2>3 9>2[8]', pipeNames(t, planOf(t)).join(' '));
}
{
	const t = P(['1,0,0,10,WL1', '2,0,100,10,WL1 JPN7', '3,0,200,10,WL1', '7,100,100,10,FH']);
	ok('a JPN on an INSIDE point is a branch of its own, and that point becomes a node',
		pipeNames(t, planOf(t)).join(' ') === '1>2 2>3 2>7', pipeNames(t, planOf(t)).join(' '));
}
{
	const t = P(['1,0,0,10,WL1 JPNJ4']);
	const pl = planOf(t, { hasNode: (id) => id === 'J4' });
	ok('a JPN can reach a node already in the project', pipeNames(t, pl).join() === 'J4>1', pipeNames(t, pl).join());
}
{
	const t = P(['1,0,0,10,WL1', '2,0,100,10,WL1', '3,100,100,10,WL1 CLO']);
	const pl = planOf(t);
	ok('a CLO ring with only one node is NOT lost: its last point becomes a junction, two pipes',
		pipeNames(t, pl).join(' ') === '1>3[2] 3>1' && codes(pl).indexOf('ring-junction') >= 0 &&
		pl.nodes.some(n => n.pt === 2 && n.as === 'junction'), pipeNames(t, pl).join(' '));
	ok('...and the vertex count is the vertices actually drawn', pl.vertices === 1, String(pl.vertices));
	const w = P(['30,0,0,10,WL3', '31,0,100,10,WL3', '32,100,100,10,WL3', '33,100,0,10,WL3 CLO']);
	const pw = planOf(w);
	ok('Perry\'s ring, 30..33 WL3 with CLO on 33: point 33 is the junction, the ring is two pipes',
		pipeNames(w, pw).join(' ') === '30>33[31,32] 33>30', pipeNames(w, pw).join(' '));
	const f = P(['1,0,-100,10,WL1', '2,0,0,10,WL1 -0', '30,0,0,10,WL3 JPN2', '31,0,100,10,WL3',
		'32,100,100,10,WL3', '33,100,0,10,WL3 CLO']);
	const pf = planOf(f);
	ok('a ring fed by a JPN tee closes too', pf.pipes.length >= 3 &&
		pipeNames(f, pf).join(' ').indexOf('33>') >= 0, pipeNames(f, pf).join(' '));
	const v = P(['1,0,0,10,WL1', '2,0,100,10,FH.WL1', '3,100,100,10,WL1 CLO']);
	ok('...and a ring with a second node on it closes into two pipes',
		pipeNames(v, planOf(v)).join(' ') === '1>2 2>1[3]', pipeNames(v, planOf(v)).join(' '));
}
{
	const t = P(['1,0,0,10,WL1', '2,0,100,10,TREE 12IN', '3,0,200,10,FH.WV', '4,0,300,10,FH JPN1', '5,0,400,10,WL9']);
	const pl = planOf(t, { fallback: 'tank' });
	const lineCodes = pl.notes.filter(n => n.line).map(n => n.line + ':' + n.code).join(' ');
	ok('an unknown code is a node of the kind chosen in the box, and is reported',
		pl.nodes.find(n => n.pt === 1).as === 'tank' && lineCodes.indexOf('2:code-unknown') >= 0, lineCodes);
	ok('two node codes on one shot: the first is used, and it is reported',
		pl.nodes.find(n => n.pt === 2).as === 'junction' && lineCodes.indexOf('3:code-two-nodes') >= 0);
	ok('a JPN on a point with no line code draws nothing and is reported',
		lineCodes.indexOf('4:join-no-line') >= 0 && pl.pipes.length === 0);
	ok('a line of one point is a junction with no pipe, reported',
		lineCodes.indexOf('1:line-one-point') >= 0 && lineCodes.indexOf('5:line-one-point') >= 0);
	ok('codes are matched regardless of case', planOf(P(['1,0,0,10,wl', '2,0,100,10,Wl'])).pipes.length === 1);
	ok('an empty description is a node of the chosen kind and says nothing',
		planOf(P(['1,0,0,10,']), { fallback: 'reservoir' }).nodes[0].as === 'reservoir' &&
		planOf(P(['1,0,0,10,'])).notes.length === 0);
	ok('a file with no description column says the codes could not be read',
		codes(EC.lpnSurveyCodePlan(EC.lpnSurveyParse('1,0,0,10\n', { format: 'PNEZ' }), { table: TABLE })).indexOf('no-desc-column') >= 0);
	ok('the code table is the reader\'s: WL mapped to a junction draws no pipe',
		planOf(P(['1,0,0,10,WL', '2,0,100,10,WL']), { table: [{ code: 'WL', as: 'junction' }] }).pipes.length === 0);
}
{
	const t = P(['1,0,0,10,FH.WL1', '2,0,0,10,FH.WL1', '3,0,100,10,WL1']);
	const pl = planOf(t);
	ok('two nodes at one spot: the pipe is still drawn, and its zero length is reported on the line',
		pipeNames(t, pl).join(' ') === '1>2 2>3' && pl.notes.some(n => n.code === 'pipe-zero-length' && n.line === 2),
		pipeNames(t, pl).join(' ') + ' ' + JSON.stringify(pl.notes.map(n => n.line + ':' + n.code)));
	const u = P(['1,0,0,10,WL1', '2,0,100,10,WL1', '3,0,200,10,WL1', '9,0,100,10,FH', '8,0,150,10,WV']);
	const pu = planOf(u);
	ok('a node shot exactly on another line\'s VERTEX, with no join, is reported, not merged',
		pu.notes.some(n => n.code === 'node-on-pipe' && n.line === 4) && pu.nodes.length === 4,
		JSON.stringify(pu.notes.map(n => n.line + ':' + n.code)));
	ok('...and one shot exactly on a SEGMENT', pu.notes.some(n => n.code === 'node-on-pipe' && n.line === 5));
	ok('a node near, but not on, a pipe says nothing',
		!planOf(P(['1,0,0,10,WL1', '2,0,200,10,WL1', '9,0.5,100,10,FH'])).notes.some(n => n.code === 'node-on-pipe'));
}
{
	// Every note this feature can raise has a sentence, in the standard line shape.
	const AX = { north: 'Northing', east: 'Easting' };
	['code-unknown', 'code-two-nodes', 'code-unread', 'vertex-text', 'join-missing', 'join-no-line',
		'pipe-one-node', 'line-one-point', 'ring-junction', 'pipe-zero-length', 'node-on-pipe'].forEach(c => {
		const t = EC.lpnSurveyNoteText({ code: c, line: 9, raw: 'x' }, AX).text;
		// Tom's shape, 2026-09-18: Line N: sev: code: text, the text a plain sentence.
		const parts = t.split(': ');
		ok('note ' + c + ' prints in the Line N: sev: code: text shape',
			parts.length >= 4 && parts[0].indexOf('9') >= 0 && parts[1] === PC.lpn_survey_sev_warning &&
			/^[a-z]+(-[a-z]+)*$/.test(parts[2]) && /\.$/.test(t), t);
	});
	ok('the vertices note fills its count', EC.lpnSurveyNoteText({ code: 'vertices', detail: '4' }, AX).text
		=== PC.lpn_survey_note_vertices.replace('{detail}', '4'));
}

// ================================================================================================
section('3. through the real page, with the box ticked');
// ================================================================================================
global.window.alert = global.alert = function () {};
function press(label) {
	const btn = (byId.lpn_dialog_buttons.children || []).find(b => b.textContent === label);
	if (!btn) { throw new Error('no button: ' + label); }
	(btn._listeners.click || []).forEach(f => f());
}
function boxFind(pred) {
	let found = null;
	const walk = (el) => { if (!found && pred(el)) { found = el; } (el.children || []).forEach(walk); };
	walk(byId.lpn_dialog_body);
	return found;
}
function boxText() {
	const walk = (el) => (!el.children || !el.children.length)
		? (el.textContent || '') : el.children.map(walk).join('\n');
	return walk(byId.lpn_dialog_body);
}
function clearBox() { byId.lpn_dialog_body.children.length = 0; byId.lpn_dialog_buttons.children.length = 0; }
function fire(el, ev) { (el._listeners[ev] || []).forEach(f => f({ target: el })); }

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tland: landSurveyText, undo: undo,\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tnode: function (id) { return nodeById(id); },\n" +
	"\t\toutX: function (v) { return outwardX(v); }, outY: function (v) { return outwardY(v); },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tGEO: LPN_COORDS_GEO,\n" +
	"\t\treset: function (coords) { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' };\n" +
	"\t\t\tif (coords) { project.coords = coords; }\n" +
	"\t\t\tscenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tsvg.clientWidth = 900; svg.clientHeight = 600;\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

function importFile(text, tick) {
	clearBox();
	L.land(text);
	const box = boxFind(e => e.id === 'lpn_survey_codes');
	if (tick) { box.checked = true; fire(box, 'change'); }
	const question = boxText();
	const label = (byId.lpn_dialog_buttons.children || [])[0].textContent;
	press(tick ? PC.lpn_new_create : PC.lpn_survey_create);
	return { box: box, question: question, report: boxText(), label: label };
}

L.reset();
const r = importFile(CODED, true);
{
	const d = L.getDoc();
	ok('the tick is in the existing import box, unticked until the reader ticks it',
		!!r.box && r.box.type === 'checkbox');
	ok('the box states every kind it is about to make, in one sentence',
		r.question.indexOf(PC.lpn_survey_confirm_coded.replace('{j}', 3).replace('{r}', 1).replace('{t}', 1).replace('{p}', 4)) >= 0);
	ok('ticked, the button says Create, not Create nodes', r.label === PC.lpn_new_create, r.label);
	ok('the File menu tip no longer says flatly that no pipes are drawn',
		PC.lpn_file_import_survey_tip.indexOf(PC.lpn_survey_codes_toggle) >= 0);
	ok('five nodes and four pipes arrived', d.nodes.length === 5 && d.links.length === 4,
		d.nodes.length + ' nodes, ' + d.links.length + ' links');
	ok('the kinds are the table\'s', L.node('1').type === 'reservoir' && L.node('20').type === 'tank' &&
		L.node('3').type === 'junction' && L.node('5').type === 'junction' && L.node('12').type === 'junction');
	ok('vertex-only points did not become nodes', !L.node('2') && !L.node('4') && !L.node('10') && !L.node('11'));
	const at = (a, b) => d.links.find(l => (l.from === a && l.to === b) || (l.from === b && l.to === a));
	ok('every pipe has two end nodes that exist', d.links.every(l => l.type === 'pipe' && L.node(l.from) && L.node(l.to) && l.from !== l.to));
	ok('the tee: three pipes meet at point 3', d.links.filter(l => l.from === '3' || l.to === '3').length === 3);
	const branch = at('3', '12');
	const out = (v) => [L.outX(v.x), L.outY(v.y)].join();
	ok('the branch runs through its two vertices, at the surveyed positions, in order',
		branch && branch.verts.length === 2 && out(branch.verts[0]) === '5200,4900' &&
		out(branch.verts[1]) === '5200,4800', branch && branch.verts.map(out).join(' '));
	ok('a pipe takes the New assets diameter and roughness, and an automatic length',
		d.links.every(l => l._diameter === L.settings().defaults.diameter && l._roughness === L.settings().defaults.roughness && l.lenAuto === true));
	ok('the automatic length follows the vertices (1>3 via 2 is 200 ft)',
		Math.abs(at('1', '3')._length - 200) < 1e-9, String(at('1', '3')._length));
	ok('the description is kept on the node, codes and all', L.node('5').desc === 'FH.WL1 -0 HYD-A');
	ok('ONE undo takes the whole file back', L.undoDepth() === 1);
}

section('4. the report');
{
	const counts = PC.lpn_survey_report_coded.replace('{j}', 3).replace('{r}', 1).replace('{t}', 1).replace('{p}', 4).replace('{m}', 5);
	ok('the report opens on every count', r.report.indexOf(counts) >= 0, r.report.split('\n')[0]);
	ok('the bad coordinate is reported with its line', r.report.indexOf('30,4600.00,X5000,99.00,WV') >= 0);
	ok('the missing JPN target is reported with its sentence and line',
		r.report.indexOf(PC.lpn_survey_note_join_missing) >= 0 && r.report.indexOf('11,4800.00,5200.00,99.40,WL2 JPN999') >= 0);
	ok('the vertex whose words were not read', r.report.indexOf(PC.lpn_survey_note_vertex_text) >= 0 &&
		r.report.indexOf('4,5050.00,5300.00,100.50,WL1 8IN') >= 0);
	ok('the node whose words are kept in its description', r.report.indexOf(PC.lpn_survey_note_code_unread) >= 0);
	ok('and the vertices, counted', r.report.indexOf(PC.lpn_survey_note_vertices.replace('{detail}', '4')) >= 0);
	// Line order, as for every other note: 12, 13, 15, 18.
	const at = (s) => r.report.indexOf(s);
	ok('per-line notes in line order', at('4,5050.00') < at('5,5100.00') && at('5,5100.00') < at('11,4800.00') &&
		at('11,4800.00') < at('30,4600.00'));
}

section('5. it SOLVES');
{
	L.runSolve();
	const model = L.assembleModel();
	const res = EC.lpnSolve(model, { tol: 1e-9 });
	const dem = (id) => (model.nodes.find(n => n.id === id) || {}).demand || 0;
	ok('the imported network converges', res && res.ok && res.converged === true, res && res.message);
	const d = L.getDoc();
	const q = (a, b) => { const l = d.links.find(x => x.from === a && x.to === b); return res.flows[l.id]; };
	ok('water leaves the well', q('1', '3') > 0, String(q('1', '3')));
	ok('the tee balances: in from the well = out down the main + out down the branch + its own demand',
		Math.abs(q('1', '3') - q('3', '5') - q('3', '12') - dem('3')) < 1e-8,
		[q('1', '3'), q('3', '5'), q('3', '12'), dem('3')].join(' '));
	ok('...and so does the branch end, where the tank pipe leaves it',
		Math.abs(q('3', '12') - q('12', '20') - dem('12')) < 1e-8);
	ok('the tank fills from the well (its surface is below the well head)', q('12', '20') > 0);
	ok('every pipe has a finite flow', d.links.every(l => isFinite(res.flows[l.id])));
}

section('5a. a ring main, coded with CLO and fed by a JPN tee, imports and SOLVES as a loop');
{
	L.reset();
	importFile('1,5000,5000,150,WELL.WL1\n2,5000,5100,100,WL1 -0\n30,5000,5200,100,WL3 JPN2\n' +
		'31,5000,5300,100,WL3\n32,4900,5300,100,WL3\n33,4900,5200,100,WL3 CLO\n', true);
	const d = L.getDoc();
	ok('three nodes on the ring side: the tee 30 and the promoted 33, plus 2', !!L.node('30') && !!L.node('33') && !!L.node('2'),
		d.nodes.map(n => n.id).join());
	ok('the ring is two pipes between 30 and 33', d.links.filter(l => (l.from === '30' && l.to === '33') || (l.from === '33' && l.to === '30')).length === 2,
		d.links.map(l => l.from + '>' + l.to).join(' '));
	L.runSolve();
	const model = L.assembleModel();
	const res = EC.lpnSolve(model, { tol: 1e-9 });
	ok('the looped network converges', res && res.ok && res.converged === true, res && res.message);
	const ring = d.links.filter(l => l.from === '30' || l.to === '30').filter(l => l.from === '33' || l.to === '33');
	const dem33 = (model.nodes.find(n => n.id === '33') || {}).demand || 0;
	ok('the promoted junction balances: what the two ring pipes bring it is its demand',
		Math.abs(ring.reduce((a, l) => a + (l.to === '33' ? 1 : -1) * res.flows[l.id], 0) - dem33) < 1e-8);
}

section('5b. on a georeferenced project, a vertex saves as the file\'s own latitude and longitude');
{
	L.reset(L.GEO);
	importFile('A,33.415300,-111.831400,1243.5,WL1\nB,33.415910,-111.831400,1244,WL1\nC,33.416520,-111.830780,1245,WL1\n', true);
	const saved = L.serialize();
	const v = saved.links[0] && saved.links[0].verts[0];
	ok('one pipe A>C through B', saved.links.length === 1 && saved.links[0].verts.length === 1);
	ok('the SAVED vertex is the file\'s own double, bit for bit', v && v.x === -111.8314 && v.y === 33.41591,
		v && (v.x + ',' + v.y));
}

// ================================================================================================
section('6. unticked, the same file imports exactly as the junctions-only import always did');
// ================================================================================================
{
	L.reset();
	const plain = importFile(CODED, false);
	const d = L.getDoc();
	const parsed = EC.lpnSurveyParse(CODED);
	ok('unticked, the button still says Create nodes', plain.label === PC.lpn_survey_create, plain.label);
	ok('one junction per readable point, and no pipe', d.nodes.length === parsed.points.length &&
		d.links.length === 0 && d.nodes.every(n => n.type === 'junction'), d.nodes.length + '/' + d.links.length);
	ok('each Description lands verbatim, codes unread', parsed.points.every(p => L.node(p.id).desc === p.desc));
	ok('the report is the junctions-only one', plain.report.indexOf(
		PC.lpn_survey_report_junction.replace('{n}', parsed.points.length).replace('{m}', parsed.points.length)) >= 0,
		plain.report.split('\n')[0]);
	ok('...and raises no field-code note', plain.report.indexOf(PC.lpn_survey_note_vertices.split('{')[0]) < 0 &&
		plain.report.indexOf(PC.lpn_survey_note_join_missing) < 0);
	// A plain PNEZD file with free-text descriptions, the shape Task 592 was built for.
	L.reset();
	importFile('P1,1000.00,2000.00,55.50,Fire hydrant at Elm\nP2,1010.00,2015.00,56.00,Valve box\n', false);
	ok('a plain PNEZD file: two junctions, their descriptions, no pipes',
		L.getDoc().nodes.length === 2 && L.getDoc().links.length === 0 && L.node('P1').desc === 'Fire hydrant at Elm');
}

console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);
