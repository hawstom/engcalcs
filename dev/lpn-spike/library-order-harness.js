// THE ORDER OF A LIBRARY'S ITEMS (ROADMAP Task 859). Run:
//   node dev/lpn-spike/library-order-harness.js
//
// Tom, 2026-11-13: *"the Curves don't seem to sort alphabetically ... we don't provide a way to change
// the order ... buttons to 'Move up', 'Move Down', 'Move to Top', 'Move to bottom'"*. The buttons act on the
// selected item and move it in the stored array, so the order is the project's own: saved with it, the
// order every list reads and the order the `.inp` export writes.
//
// Sections:
//   1. the four moves, on all six sections: the right order, an end is a no-op, ONE undo step each
//   2. one undo puts the order back, and the item stays selected where the id still says so
//   3. the order is the SAVED order (serializeProject) and survives a save and open
//   4. the `.inp` export writes patterns, curves and controls in the stored order, and an unmoved project
//      still exports exactly what it did (a move and its reverse leave the export byte for byte as it was)
//   5. rules: a rule moves as its block (its description and its lines), nothing between the blocks changes,
//      and a leading block that is not a rule cannot be moved or moved above
//   7. WHETHER A MOVE CHANGES A RUN, measured in EPANET: two controls acting on one link at one time (the later
//      wins) and two rules of equal priority (the earlier wins) answer differently when their order changes
//   6. what is selected: nothing, then an item; an item in another project is not the same item

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, setDoc: function (d) { doc = d; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, docFromInp: docFromInp,\n" +
	"\t\tinpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tlibOrderSelect: libOrderSelect, libOrderSelIndex: libOrderSelIndex, libOrderMove: libOrderMove,\n" +
	"\t\tlibRulesMoved: libRulesMoved, libRuleEntries: libRuleEntries, libReadControl: libReadControl,\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo, redo: redo, clearUndo: clearUndo,\n" +
	"\t\tsetLibSection: function (s) { libSection = s; }, rebuildLibraryBox: rebuildLibraryBox,\n" +
	"\t\tsetOpenId: function (v) { library.openId = v; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;
global.alert = global.window.alert = function () { };
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined || cond ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function importNet(file) {
	const text = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', file), 'utf8');
	const parsed = EngCalcs.lpnInpParse(text);
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const d = L.docFromInp(parsed, file);
	L.setDoc(d);
	L.clearUndo();
	return d;
}
const ids = (arr) => arr.map((x) => String(x.id));

// ---- the six lists as a document holds them ---------------------------------------------------
// Net3 brings real patterns, curves and controls; the pipe types and fittings lists are added, because an
// .inp states neither.
function freshDoc() {
	const d = importNet('Net3.inp');
	d.pipeTypes = [{ id: 'T1', props: {} }, { id: 'T2', props: {} }, { id: 'T3', props: {} }, { id: 'T4', props: {} }];
	d.fittingSets = [{ id: 'F1', items: [] }, { id: 'F2', items: [] }, { id: 'F3', items: [] }];
	// Net3 has two curves; the moves need a middle one.
	while (d.curves.length < 3) { d.curves.push(Object.assign(JSON.parse(JSON.stringify(d.curves[0])), { id: 'X' + d.curves.length })); }
	return d;
}
const SECTIONS = {
	patterns: (d) => d.patterns,
	curves: (d) => d.curves,
	pipetypes: (d) => d.pipeTypes,
	fittings: (d) => d.fittingSets,
	controls: (d) => d.controls
};
const label = (sec, x) => sec === 'controls' ? x.raw : String(x.id);

head('1. the four moves, on every section that lists items');
Object.keys(SECTIONS).forEach((sec) => {
	const d = freshDoc(), arr = () => SECTIONS[sec](d), n = arr().length, start = arr().map((x) => label(sec, x));
	ok(sec + ': has at least three items to move among (' + n + ')', n >= 3);
	const model = start.slice();
	function expect(how, i) {
		const to = how === 'top' ? 0 : how === 'bottom' ? n - 1 : how === 'up' ? Math.max(0, i - 1) : Math.min(n - 1, i + 1);
		model.splice(to, 0, model.splice(i, 1)[0]);
		return to;
	}
	function pick(i) { L.libOrderSelect(sec, i); }
	// every move from the middle item, one after another, each from where the last left it
	let at = 1;
	['top', 'down', 'bottom', 'up'].forEach((how) => {
		pick(at);
		const depth = L.undoDepth(), moved = L.libOrderMove(sec, how), to = expect(how, at);
		ok(sec + ': ' + how + ' from ' + at + ' moves it to ' + to, moved === (to !== at));
		ok(sec + ': ...and the order is the expected one', same(arr().map((x) => label(sec, x)), model),
			JSON.stringify(arr().map((x) => label(sec, x))));
		ok(sec + ': ...as ONE undo step', L.undoDepth() === depth + (to !== at ? 1 : 0));
		at = to;
	});
	// an end is a no-op: nothing moves and no undo step is spent
	pick(0);
	let depth = L.undoDepth(), before = arr().map((x) => label(sec, x));
	ok(sec + ': up from the top does nothing', L.libOrderMove(sec, 'up') === false && L.libOrderMove(sec, 'top') === false
		&& same(arr().map((x) => label(sec, x)), before) && L.undoDepth() === depth);
	pick(n - 1);
	before = arr().map((x) => label(sec, x));
	depth = L.undoDepth();
	ok(sec + ': down from the bottom does nothing', L.libOrderMove(sec, 'down') === false && L.libOrderMove(sec, 'bottom') === false
		&& same(arr().map((x) => label(sec, x)), before) && L.undoDepth() === depth);
	// no selection, no move
	L.setOpenId('other-project');
	before = arr().map((x) => label(sec, x));
	ok(sec + ': with nothing selected, nothing moves', L.libOrderMove(sec, 'top') === false && same(arr().map((x) => label(sec, x)), before));
	L.setOpenId('');
});

head('2. one undo puts the order back; redo puts the move back');
Object.keys(SECTIONS).forEach((sec) => {
	const d = freshDoc(), n = SECTIONS[sec](d).length, before = JSON.stringify(SECTIONS[sec](d));
	L.libOrderSelect(sec, n - 1);
	L.libOrderMove(sec, 'top');
	const moved = JSON.stringify(SECTIONS[sec](L.getDoc()));
	ok(sec + ': the move changed the list', moved !== before);
	L.undo();
	ok(sec + ': one undo restores the order exactly', JSON.stringify(SECTIONS[sec](L.getDoc())) === before);
	L.redo();
	ok(sec + ': redo puts the move back', JSON.stringify(SECTIONS[sec](L.getDoc())) === moved);
	if (sec !== 'controls') {
		const arr = SECTIONS[sec](L.getDoc()), id = String(arr[0].id);
		L.undo();
		ok(sec + ': an item with an id stays selected through undo', L.libOrderSelIndex(sec) === ids(SECTIONS[sec](L.getDoc())).indexOf(id));
	}
});

head('3. the order is the saved order');
{
	const d = freshDoc();
	L.libOrderSelect('patterns', d.patterns.length - 1);
	L.libOrderMove('patterns', 'top');
	L.libOrderSelect('curves', 0);
	L.libOrderMove('curves', 'bottom');
	L.libOrderSelect('pipetypes', 3);
	L.libOrderMove('pipetypes', 'top');
	L.libOrderSelect('fittings', 0);
	L.libOrderMove('fittings', 'bottom');
	L.libOrderSelect('controls', 2);
	L.libOrderMove('controls', 'top');
	const saved = JSON.parse(JSON.stringify(L.serialize(true)));
	ok('a saved project holds the patterns in the moved order', same(ids(saved.patterns), ids(d.patterns)));
	ok('...the curves', same(ids(saved.curves), ids(d.curves)));
	ok('...the pipe types', same(ids(saved.pipeTypes), ids(d.pipeTypes)) && saved.pipeTypes[0].id === 'T4');
	ok('...the fittings lists', same(ids(saved.fittingSets), ids(d.fittingSets)) && saved.fittingSets[2].id === 'F1');
	ok('...and the controls', same(saved.controls.map((c) => c.raw), d.controls.map((c) => c.raw)));
	L.applySaved(L.migrateSaved(saved));
	const back = L.getDoc();
	ok('opening it again lists them in that order',
		same(ids(back.patterns), ids(d.patterns)) && same(ids(back.curves), ids(d.curves))
		&& same(ids(back.pipeTypes), ['T4', 'T1', 'T2', 'T3']) && same(ids(back.fittingSets), ['F2', 'F3', 'F1'])
		&& same(back.controls.map((c) => c.raw), d.controls.map((c) => c.raw)));
}

head('4. the .inp export writes the stored order, and an unmoved project exports as it did');
{
	function sectionIds(inp, name) {
		const out = [];
		let on = false;
		inp.split(/\r?\n/).forEach((raw) => {
			const line = raw.replace(/;.*$/, '').trim(), m = /^\[(\w+)\]/.exec(line);
			if (m) { on = m[1].toUpperCase() === name; return; }
			if (on && line) { const id = line.split(/\s+/)[0]; if (out[out.length - 1] !== id) { out.push(id); } }
		});
		return out;
	}
	['Net1.inp', 'Net2.inp', 'Net3.inp'].forEach((f) => {
		const d = importNet(f), plain = EngCalcs.lpnExportInp(d).inp;
		let touched = 0;
		['patterns', 'curves', 'controls'].forEach((sec) => {
			const n = SECTIONS[sec](d).length;
			if (n < 2) { return; }
			touched++;
			L.libOrderSelect(sec, 0);
			L.libOrderMove(sec, 'bottom');
			L.libOrderMove(sec, 'top');
		});
		ok(f + ': a move to the bottom and back to the top exports byte for byte what the import did', EngCalcs.lpnExportInp(d).inp === plain);
		ok(f + ': (' + touched + ' lists were moved)', touched > 0 || f === 'Net1.inp' || f === 'Net2.inp');
	});
	{
		const d = importNet('Net3.inp'), before = EngCalcs.lpnExportInp(d).inp;
		const pat0 = sectionIds(before, 'PATTERNS'), cur0 = sectionIds(before, 'CURVES');
		L.libOrderSelect('patterns', 0);
		L.libOrderMove('patterns', 'bottom');
		L.libOrderSelect('curves', 0);
		L.libOrderMove('curves', 'bottom');
		const after = EngCalcs.lpnExportInp(d).inp;
		ok('Net3: [PATTERNS] now lists the first pattern last', same(sectionIds(after, 'PATTERNS'), pat0.slice(1).concat(pat0[0])),
			JSON.stringify(sectionIds(after, 'PATTERNS')));
		ok('Net3: [CURVES] now lists the first curve last', same(sectionIds(after, 'CURVES'), cur0.slice(1).concat(cur0[0])),
			JSON.stringify(sectionIds(after, 'CURVES')));
		const ctl = (inp) => inp.split(/\r?\n/).slice(inp.split(/\r?\n/).findIndex((l) => /^\[CONTROLS\]/i.test(l)) + 1)
			.filter((l) => l.trim() && !/^;/.test(l.trim())).slice(0, 3);
		const c0 = ctl(after);
		L.libOrderSelect('controls', 0);
		L.libOrderMove('controls', 'bottom');
		const c1 = ctl(EngCalcs.lpnExportInp(d).inp);
		ok('Net3: [CONTROLS] follows the stored order', c1[0] === c0[1] && c1[1] === c0[2], JSON.stringify([c0, c1]));
	}
}

head('5. rules move as blocks');
{
	const RULES = [
		'; heading for the whole section', '',
		';Opens the booster at night.', 'RULE A', 'IF SYSTEM CLOCKTIME >= 10 PM', 'THEN PUMP 9 STATUS IS OPEN', 'PRIORITY 1', '',
		'RULE B', 'IF TANK 2 LEVEL BELOW 120', 'THEN PUMP 9 STATUS IS OPEN', '',
		';Shuts it again.', ';(two lines)', 'RULE C', 'IF TANK 2 LEVEL ABOVE 133', 'THEN PUMP 9 STATUS IS CLOSED', '',
		'; end of rules'
	];
	const names = (lines) => L.libRuleEntries(lines).map((e) => e.name);
	ok('the fixture reads as three rules, A B C', same(names(RULES), ['A', 'B', 'C']), JSON.stringify(names(RULES)));
	const sortedLines = (a) => a.slice().sort().join('\n');
	const moves = [[0, 2], [2, 0], [0, 1], [1, 0], [1, 2], [2, 1], [0, 0]];
	moves.forEach(([from, to]) => {
		const out = L.libRulesMoved(RULES, from, to), order = ['A', 'B', 'C'];
		order.splice(to, 0, order.splice(from, 1)[0]);
		ok('move ' + from + ' to ' + to + ': the rules read in the new order', same(names(out), order), JSON.stringify(names(out)));
		ok('...no line added, dropped or changed', out.length === RULES.length && sortedLines(out) === sortedLines(RULES));
		// the gaps (blank lines and headings between rules) stay at the same places
		const gapAt = (lines) => lines.filter((l) => !l.trim() || /^;(?!(Opens|Shuts|\(two))/.test(l));
		ok('...and the blank lines and headings between the rules are the same, in the same order', same(gapAt(out), gapAt(RULES)));
	});
	{
		const out = L.libRulesMoved(RULES, 2, 0), at = out.indexOf('RULE C');
		ok('a rule takes its own description with it', out[at - 1] === ';(two lines)' && out[at - 2] === ';Shuts it again.');
		ok('...and its own lines', out[at + 1] === 'IF TANK 2 LEVEL ABOVE 133' && out[at + 2] === 'THEN PUMP 9 STATUS IS CLOSED');
		const back = L.libRulesMoved(out, 0, 2);
		ok('moving it back restores the text exactly', same(back, RULES));
	}
	// a block of lines that is not a rule, at the head of the text, stays first and cannot move
	{
		const odd = ['IF SYSTEM CLOCKTIME >= 1 AM', 'THEN PUMP 9 STATUS IS OPEN', '', 'RULE X', 'IF TANK 2 LEVEL BELOW 1', 'THEN PUMP 9 STATUS IS OPEN', '',
			'RULE Y', 'IF TANK 2 LEVEL BELOW 2', 'THEN PUMP 9 STATUS IS OPEN'];
		const e = L.libRuleEntries(odd);
		ok('a leading block with no RULE line is an entry with no name', e.length === 3 && !e[0].name, JSON.stringify(e.map((x) => x.name)));
		const d = importNet('Net1.inp');
		d.rules = odd.slice();
		L.libOrderSelect('rules', 0);
		ok('...and it cannot be moved', L.libOrderMove('rules', 'down') === false && same(d.rules, odd));
		L.libOrderSelect('rules', 2);
		ok('...and a rule cannot be moved above it', L.libOrderMove('rules', 'top') === true && same(d.rules.slice(0, 3), odd.slice(0, 3)) && d.rules.indexOf('RULE Y') < d.rules.indexOf('RULE X'),
			JSON.stringify(d.rules));
	}
	// through the page: one undo step, saved, exported in the moved order
	{
		const d = importNet('Net1.inp');
		d.rules = RULES.slice();
		L.libOrderSelect('rules', 2);
		const depth = L.undoDepth();
		ok('Move to top on a rule moves it', L.libOrderMove('rules', 'top') === true && same(names(d.rules), ['C', 'A', 'B']));
		ok('...as one undo step', L.undoDepth() === depth + 1);
		ok('...and the selection follows it', L.libOrderSelIndex('rules') === 0);
		ok('...and the project file holds the new order', same(L.serialize(true).rules, d.rules));
		const inp = EngCalcs.lpnExportInp(d).inp, order = [...inp.matchAll(/^RULE (\w+)/gm)].map((m) => m[1]);
		ok('...and the .inp writes [RULES] in that order', same(order, ['C', 'A', 'B']), JSON.stringify(order));
		L.undo();
		ok('one undo gives the text back exactly', same(L.getDoc().rules, RULES));
		ok('an unmoved rule list exports as it came', same(L.getDoc().rules, RULES) && EngCalcs.lpnExportInp(L.getDoc()).inp.indexOf('RULE A') < EngCalcs.lpnExportInp(L.getDoc()).inp.indexOf('RULE B'));
	}
}

head('6. what is selected');
{
	const d = freshDoc();
	L.setOpenId('proj-1');
	ok('nothing is selected to begin with', L.libOrderSelIndex('curves') === -1);
	L.libOrderSelect('curves', 1);
	ok('selecting an entry selects that item', L.libOrderSelIndex('curves') === 1);
	L.setOpenId('proj-2');
	ok('an item of another project with the same id is not selected', L.libOrderSelIndex('curves') === -1);
	L.setOpenId('proj-1');
	ok('and it is again in its own', L.libOrderSelIndex('curves') === 1);
	// a control is selected by position, so adding one drops the selection rather than leaving it on a different control
	L.libOrderSelect('controls', 0);
	d.controls.push(d.controls[0]);
	ok('a position selection is dropped when the list changes length', L.libOrderSelIndex('controls') === -1);
	L.setOpenId('');
}

(async function () {
	head('7. whether a move changes a run (EPANET, Net1 with two conflicting controls and then two conflicting rules)');
	await warmEpanet();
	const NET1 = path.join(ROOT, 'dev', 'water-network-examples', 'Net1.lwn');
	function open(mutate) {
		byId.lpn_dialog_body.children.length = 0;
		const saved = JSON.parse(fs.readFileSync(NET1, 'utf8'));
		mutate(saved);
		L.applySaved(L.migrateSaved(saved));
		return L.getDoc();
	}
	const pumpFlow = (run) => (run.frames || []).map((f) => f.flows['9']);
	const runIt = async () => pumpFlow(await EngCalcs.lpnEpanetRun(L.assembleModel(), {}));
	const differs = (a, b) => a.some((q, i) => Math.abs(q - b[i]) > 1e-6);
	// Controls: the same link, the same moment, opposite actions. The later in the list wins.
	{
		const d = open((s) => {
			s.rules = [];
			s.controls = [L.libReadControl('LINK 9 CLOSED AT TIME 5').rec, L.libReadControl('LINK 9 OPEN AT TIME 5').rec];
		});
		const first = await runIt();
		L.libOrderSelect('controls', 0);
		L.libOrderMove('controls', 'bottom');
		const second = await runIt();
		ok('controls: the order of two controls that act on one link at one time changes the run', first.length === 25 && differs(first, second),
			JSON.stringify([first.slice(4, 8), second.slice(4, 8)]));
		L.libOrderMove('controls', 'top');
		ok('...and moving it back restores the run', !differs(first, await runIt()));
		void d;
	}
	// Rules: equal priority, opposite actions. The earlier in the list wins.
	{
		const lines = ['RULE A', 'IF SYSTEM CLOCKTIME >= 5 AM', 'THEN PUMP 9 STATUS IS CLOSED', 'PRIORITY 1', '',
			'RULE B', 'IF SYSTEM CLOCKTIME >= 5 AM', 'THEN PUMP 9 STATUS IS OPEN', 'PRIORITY 1'];
		open((s) => { s.controls = []; s.rules = lines; });
		const first = await runIt();
		L.libOrderSelect('rules', 0);
		L.libOrderMove('rules', 'bottom');
		const second = await runIt();
		ok('rules: the order of two equal-priority rules that call for opposite actions changes the run', first.length === 25 && differs(first, second),
			JSON.stringify([first.slice(4, 8), second.slice(4, 8)]));
		// and a higher priority makes the order irrelevant
		const hi = lines.slice();
		hi[3] = 'PRIORITY 5';
		open((s) => { s.controls = []; s.rules = hi; });
		const a = await runIt();
		L.libOrderSelect('rules', 0);
		L.libOrderMove('rules', 'bottom');
		ok('...but not when one of them has the higher priority', !differs(a, await runIt()));
	}
	// Patterns: looked up by id, so their order is no part of a run.
	{
		open((s) => { s.rules = []; });
		const a = await runIt();
		const d = L.getDoc();
		d.patterns.push({ id: 'ZZ', multipliers: [1] });
		L.libOrderSelect('patterns', d.patterns.length - 1);
		L.libOrderMove('patterns', 'top');
		ok('patterns: moving one changes nothing in the run', !differs(a, await runIt()));
	}
	console.log('\n' + checks + ' checks, ' + fails + ' failed');
	console.log(fails === 0 ? 'library order harness: all checks passed' : 'library order harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}());
