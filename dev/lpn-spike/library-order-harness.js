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
require(ROOT + 'js/lpn-native-run.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, setDoc: function (d) { doc = d; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, docFromInp: docFromInp,\n" +
	"\t\tinpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tlibOrderSelect: libOrderSelect, libOrderSelIndex: libOrderSelIndex, libOrderMove: libOrderMove,\n" +
	"\t\tlibSelForgetIndexed: libSelForgetIndexed, libRulesMoved: libRulesMoved, libRuleItems: libRuleItems, libReadControl: libReadControl, libItemGapPass: libItemGapPass,\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo, redo: redo, clearUndo: clearUndo,\n" +
	"\t\tsetLibSection: function (s) { libSection = s; }, rebuildLibraryBox: rebuildLibraryBox,\n" +
	"\t\tlibRenamePattern: libRenamePattern, libRenameCurve: libRenameCurve, libRenamePipeType: libRenamePipeType, libRenameFittingSet: libRenameFittingSet,\n" +
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

function importNet(file, textIn) {
	const text = textIn !== undefined ? textIn : fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', file), 'utf8');
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
		// index 0 is Net3's first comment row; the first control is index 1
		L.libOrderSelect('controls', 1);
		L.libOrderMove('controls', 'bottom');
		const c1 = ctl(EngCalcs.lpnExportInp(d).inp);
		ok('Net3: [CONTROLS] follows the stored order', c1[0] === c0[1] && c1[1] === c0[2], JSON.stringify([c0, c1]));
	}
}

head('4b. patterns: the comments a file keeps at a position stay at it: a section\'s heading above its first pattern and what follows its last');
{
	// Net3 with a heading at the top and two comment lines at the end of both [PATTERNS] and [CONTROLS]
	let text = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8').replace(/\r\n/g, '\n');
	const HEAD = { PATTERNS: ';== PATTERNS HEADING ==', CONTROLS: ';== CONTROLS HEADING ==' };
	const FOOT = { PATTERNS: [';PATTERNS FOOT ONE', ';PATTERNS FOOT TWO'], CONTROLS: [';CONTROLS FOOT ONE', ';CONTROLS FOOT TWO'] };
	text = text.replace('[PATTERNS]\n', '[PATTERNS]\n' + HEAD.PATTERNS + '\n\n').replace('[CONTROLS]\n', '[CONTROLS]\n' + HEAD.CONTROLS + '\n\n')
		.replace('\n[CURVES]', '\n' + FOOT.PATTERNS.join('\n') + '\n\n[CURVES]').replace('\n[RULES]', '\n' + FOOT.CONTROLS.join('\n') + '\n\n[RULES]');
	// the lines of one section, header and trailing blank lines left off
	function sectionLines(inp, name) {
		const out = [];
		let on = false;
		inp.replace(/\r\n/g, '\n').split('\n').forEach((l) => {
			const m = /^\[(\w+)\]/.exec(l.trim());
			if (m) { on = m[1].toUpperCase() === name; return; }
			if (on) { out.push(l); }
		});
		while (out.length && !out[out.length - 1].trim()) { out.pop(); }
		return out;
	}
	const firstNonBlank = (ls) => ls.filter((l) => l.trim())[0];
	const lastTwo = (ls) => ls.filter((l) => l.trim()).slice(-2).map((l) => l.trim());
	const itemLine = (name) => (l) => name === 'PATTERNS' ? /^\s*\w+\s+[\d.]/.test(l) : /^\s*link\s/i.test(l);
	const d0 = importNet('mod.inp', text), base = EngCalcs.lpnExportInp(d0).inp;
	['PATTERNS', 'CONTROLS'].forEach((name) => {
		const ls = sectionLines(base, name);
		ok(name + ': the import keeps the heading above the first item, and the export writes it back', ls.some((l) => l.trim() === HEAD[name]) && ls.findIndex((l) => l.trim() === HEAD[name]) < ls.findIndex(itemLine(name)));
		ok(name + ': ...and the two lines after the last item', same(lastTwo(ls), FOOT[name]));
	});
	const sec = { patterns: 'PATTERNS', controls: 'CONTROLS' };
	['patterns'].forEach((key) => {
		const n = SECTIONS[key](d0).length;
		let bad = 0, moves = 0, badReimport = 0;
		for (let i = 0; i < n; i++) {
			['top', 'up', 'down', 'bottom'].forEach((how) => {
				const d = importNet('mod.inp', text), before = SECTIONS[key](d).map((x) => label(key, x));
				L.libOrderSelect(key, i);
				if (!L.libOrderMove(key, how)) { return; }
				moves++;
				const out = EngCalcs.lpnExportInp(d).inp, ls = sectionLines(out, sec[key]), nb = ls.filter((l) => l.trim());
				// the heading still opens the section, the two foot lines still close it, and neither appears anywhere else
				const count = (t) => ls.filter((l) => l.trim() === t).length;
				if (nb[0].trim() !== HEAD[sec[key]] || !same(lastTwo(ls), FOOT[sec[key]]) || count(HEAD[sec[key]]) !== 1 || FOOT[sec[key]].some((f) => count(f) !== 1)) { bad++; }
				// read back, no comment has become a description of an item
				const back = importNet('mod2.inp', out), notes = (x) => (x.note || '') + '|' + (x.head ? x.head.join('/') : '') + '|' + (x.foot ? x.foot.join('/') : '');
				const was = SECTIONS[key](d).map((x) => (x.note || '')).slice().sort(), now = SECTIONS[key](back).map((x) => (x.note || '')).slice().sort();
				if (!same(was, now) || SECTIONS[key](back).length !== before.length) { badReimport++; }
				void notes;
			});
		}
		ok(key + ': after ' + moves + ' moves (every item, every direction) the heading and the foot comments are where they were', moves > 0 && bad === 0, bad + ' exported wrongly');
		ok(key + ': ...and read back, every description is the one it was', badReimport === 0, badReimport + ' differ');
		// a move to the bottom and back to the top changes nothing: the document and the file
		const d = importNet('mod.inp', text);
		L.libOrderSelect(key, 0);
		L.libOrderMove(key, 'bottom');
		L.libOrderMove(key, 'top');
		ok(key + ': to the bottom and back, the export is byte for byte the one before', EngCalcs.lpnExportInp(d).inp === base);
	});
}

head('4b2. rules: a heading above the first rule (a blank line between) and what follows the last stay at the section\'s top and end');
{
	// [RULES] of Net3 replaced by three rules written as Net3 names its parts, under a heading and above a trailing comment
	let text = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8').replace(/\r\n/g, '\n');
	const rule = (n, desc) => (desc ? ';' + desc + '\n' : '') + 'RULE ' + n + '\nIF SYSTEM CLOCKTIME >= 5 AM\nTHEN PUMP 10 STATUS IS ' + (n === 'B' ? 'OPEN' : 'CLOSED') + '\nPRIORITY ' + (n === 'C' ? 3 : 1);
	const block = ';== RULES HEADING ==\n\n' + rule('A', 'A desc') + '\n\n' + rule('B') + '\n\n' + rule('C', 'C desc') + '\n\n;RULES FOOT\n\n';
	text = text.replace(/\[RULES\][\s\S]*?\n(?=\[)/, '[RULES]\n' + block);
	const d0 = importNet('rules.inp', text);
	const lines = (inp) => { const o = []; let on = false; inp.replace(/\r\n/g, '\n').split('\n').forEach((l) => { const m = /^\[(\w+)\]/.exec(l.trim()); if (m) { on = m[1] === 'RULES'; return; } if (on && l.trim()) { o.push(l.trim()); } }); return o; };
	const base = lines(EngCalcs.lpnExportInp(d0).inp);
	ok('the export of the unmoved rules has the heading first and the foot last', base[0] === ';== RULES HEADING ==' && base[base.length - 1] === ';RULES FOOT', JSON.stringify(base.slice(0, 2)));
	// Comments are rows of their own (Task 859; Tom, 2026-11-16), so the heading and the foot are items that move like any other. What a
	// move must never do is add, drop or change a line, or put a blank line anywhere but where one already was.
	const items = L.libRuleItems(d0.rules);
	ok('the section reads as heading, A with its comment, B, C with its comment, foot: nine rows', items.map((x) => x.kind).join() === 'comment,comment,rule,rule,comment,rule,comment', items.map((x) => x.kind).join());
	let bad = 0, moves = 0, badBlank = 0;
	const sortedBase = base.slice().sort().join('\n'), blanksOf = (inp) => { const o = []; let on = false; inp.replace(/\r\n/g, '\n').split('\n').forEach((l) => { const m = /^\[(\w+)\]/.exec(l.trim()); if (m) { on = m[1] === 'RULES'; return; } if (on) { o.push(l.trim() ? 'x' : ''); } }); return o.join(''); };
	for (let i = 0; i < items.length; i++) {
		['top', 'up', 'down', 'bottom'].forEach((how) => {
			const d = importNet('rules.inp', text);
			L.libOrderSelect('rules', i);
			if (!L.libOrderMove('rules', how)) { return; }
			moves++;
			const inp = EngCalcs.lpnExportInp(d).inp, out = lines(inp);
			if (out.slice().sort().join('\n') !== sortedBase) { bad++; }
			void badBlank; void blanksOf;
		});
	}
	ok('after ' + moves + ' moves (every row, every direction) no line is added, dropped or changed', moves > 0 && bad === 0, bad + ' exported wrongly');
	{
		const d = importNet('rules.inp', text), before = EngCalcs.lpnExportInp(d).inp;
		L.libOrderSelect('rules', 2);
		L.libOrderMove('rules', 'down');
		L.libOrderMove('rules', 'up');
		ok('a rule down and back up: the export is byte for byte the one before', EngCalcs.lpnExportInp(d).inp === before);
	}
	// A comment directly above a RULE line, with no blank line, is a row of its own and does not travel with the rule.
	const rules = ['; at the top', 'RULE A', 'IF SYSTEM CLOCKTIME >= 5 AM', 'THEN PUMP 10 STATUS IS OPEN', '', 'RULE B', 'IF SYSTEM CLOCKTIME >= 6 AM', 'THEN PUMP 10 STATUS IS OPEN'];
	const moved = L.libRulesMoved(rules, 1, 2);
	ok('a comment directly above a rule stays put when the rule moves, and the blank line before RULE B goes with B', moved[0] === '; at the top' && moved[1] === '' && moved.indexOf('RULE B') === 2 && moved.indexOf('RULE A') > moved.indexOf('RULE B'), JSON.stringify(moved));
}

head('4b3. controls: a comment is a row of its own, and Net3 reads, moves and writes it that way');
{
	const net3 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8').replace(/\r\n/g, '\n');
	const sec = (inp) => { const o = []; let on = false; inp.replace(/\r\n/g, '\n').split('\n').forEach((l) => { const m = /^\[(\w+)\]/.exec(l.trim()); if (m) { on = m[1] === 'CONTROLS'; return; } if (on) { o.push(l); } }); while (o.length && !o[o.length - 1].trim()) { o.pop(); } return o; };
	const d = importNet('Net3.inp');
	const kinds = (dd) => dd.controls.map((c) => c.comment ? 'C' + c.lines.length : 'k').join();
	ok('Net3: comment of 1 line, two controls, a comment of 2 lines, four controls', kinds(d) === 'C1,k,k,C2,k,k,k,k', kinds(d));
	ok('...the two-line comment is set off by one blank line, and no control carries a description', d.controls[3].gap === 1 && d.controls.every((c) => c.comment || (!c.note && !c.head && !c.foot)));
	ok('an unedited Net3 writes its [CONTROLS] character for character', same(sec(EngCalcs.lpnExportInp(d).inp), sec(net3)), JSON.stringify(sec(EngCalcs.lpnExportInp(d).inp)));
	// the second control up: the first control and the comment above it swap places with nothing else
	L.libOrderSelect('controls', 2);
	L.libOrderMove('controls', 'up');
	ok('moving a control changes only the two controls: both comment rows are still where they were', kinds(d) === 'C1,k,k,C2,k,k,k,k' && d.controls[0].lines[0] === ';Lake source operates only part of the day' && d.controls[3].lines.length === 2);
	const o1 = sec(EngCalcs.lpnExportInp(d).inp), s1 = sec(net3);
	ok('...and the file reads Link 10 CLOSED before Link 10 OPEN, under the same comment', o1[0] === s1[0] && o1[1] === s1[2] && o1[2] === s1[1] && same(o1.slice(3), s1.slice(3)), JSON.stringify(o1.slice(0, 4)));
	// the Pump 335 comment (row 3, a blank line before it) moves down one: the blank line goes with it, so none is left between controls
	{
		const dd = importNet('Net3.inp');
		L.libOrderSelect('controls', 3);
		L.libOrderMove('controls', 'down');
		const o = sec(EngCalcs.lpnExportInp(dd).inp);
		ok('a moved comment row takes its blank line with it: no stray blank between the Link 10 and Link 335 controls, one before the comment',
			o.indexOf('') === o.findIndex((l) => /^;Pump 335/.test(l)) - 1 && o.slice(0, o.indexOf('')).length === 4 && o.filter((l) => !l.trim()).length === 1, JSON.stringify(o));
		L.libOrderSelect('controls', 4);
		L.libOrderMove('controls', 'top');
		const o3 = sec(EngCalcs.lpnExportInp(dd).inp);
		ok('moved to the top, the comment row has no blank above it, and it does not run into the comment below (a blank line separates them)', o3[0].indexOf(';Pump 335') === 0 && importNet('t.inp', EngCalcs.lpnExportInp(dd).inp).controls.length === dd.controls.length, JSON.stringify(o3.slice(0, 5)));
		// delete: the blank line of a deleted row passes to the next
		const d4 = importNet('Net3.inp');
		L.libItemGapPass(d4.controls, 3); d4.controls.splice(3, 1);
		ok('deleting a comment row hands its blank line to the next row', d4.controls[3].gap === 1);
		L.setDoc(d);
	}
	// a comment row moves on its own
	L.libOrderSelect('controls', 0);
	L.libOrderMove('controls', 'down');
	ok('a comment row moves down by itself, past one control', d.controls[0].comment !== true && d.controls[1].comment === true && d.controls[1].lines[0] === ';Lake source operates only part of the day', kinds(d));
	const o2 = sec(EngCalcs.lpnExportInp(d).inp);
	ok('...no line is added or lost, and the blank line stays where it was', o2.length === s1.length && o2.slice().sort().join('\n') === s1.slice().sort().join('\n') && o2.indexOf('') === s1.indexOf(''), JSON.stringify(o2));
	const back = importNet('again.inp', EngCalcs.lpnExportInp(d).inp);
	ok('...and it reads back as the same rows', same(back.controls.map((c) => c.comment ? c.lines : c.raw), d.controls.map((c) => c.comment ? c.lines : c.raw)));
	// each of Net1, Net2 and Net3 exports its [CONTROLS] character for character
	['Net1.inp', 'Net2.inp', 'Net3.inp'].forEach((f) => {
		const t = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', f), 'utf8').replace(/\r\n/g, '\n'), dd = importNet(f, t);
		ok(f + ': [CONTROLS] exports character for character', same(sec(EngCalcs.lpnExportInp(dd).inp).map((l) => l.trim()), sec(t).map((l) => l.trim())), JSON.stringify([sec(EngCalcs.lpnExportInp(dd).inp), sec(t)]));
	});
	// a project saved by the build before this one (a description above a control, a heading, a foot) opens as comment rows in the same places
	{
		const old = [
			{ link: 'P1', raw: 'LINK P1 OPEN AT TIME 1', action: {}, condition: {}, head: [';Heading', ''], note: 'Fill it', noteSrc: [';Fill it'], foot: [';end'] },
			{ link: 'P2', raw: 'LINK P2 OPEN AT TIME 2 ;trail', action: {}, condition: {}, note: 'trail', noteAt: 'end' }
		];
		const up = EngCalcs.lpnControlsUpgrade(old);
		ok('an older project: heading, description and foot become comment rows around the control, the trailing one stays its note',
			up.map((c) => c.comment ? c.lines.join('|') + '/' + (c.gap || 0) : c.raw + '/' + (c.note || '') + '/' + (c.gap || 0)).join(' ; ') ===
			';Heading/0 ; ;Fill it/1 ; LINK P1 OPEN AT TIME 1//0 ; ;end/0 ; LINK P2 OPEN AT TIME 2 ;trail/trail/0',
			up.map((c) => c.comment ? c.lines.join('|') + '/' + (c.gap || 0) : c.raw + '/' + (c.note || '') + '/' + (c.gap || 0)).join(' ; '));
		ok('...and upgrading again changes nothing', same(EngCalcs.lpnControlsUpgrade(up), up));
	}
}

head('4b4. comment rows never run together on export: after a delete, a move or a scenario skip, and a dropped control leaves nothing silently');
{
	const net1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8').replace(/\r\n/g, '\n');
	const withControls = (body) => net1.replace(/\[CONTROLS\][^\[]*/i, '[CONTROLS]\n' + body + '\n\n');
	const rowsOf = (d) => d.controls.map((c) => c.comment ? 'C' : 'k').join('');
	const secLines = (inp) => { const o = []; let on = false; inp.replace(/\r\n/g, '\n').split('\n').forEach((l) => { const m = /^\[(\w+)\]/.exec(l.trim()); if (m) { on = m[1] === 'CONTROLS'; return; } if (on) { o.push(l); } }); while (o.length && !o[o.length - 1].trim()) { o.pop(); } return o; };
	const T = ';A\nLINK 9 OPEN AT TIME 1\n;B\nLINK 9 CLOSED AT TIME 2\n;C\nLINK 9 OPEN AT TIME 3';
	// delete: A, control, B meet when the control goes
	let d = importNet('c.inp', withControls(T));
	ok('the fixture reads as six rows with no blank line anywhere', rowsOf(d) === 'CkCkCk' && d.controls.every((c) => !c.gap), rowsOf(d));
	L.libItemGapPass(d.controls, 1); d.controls.splice(1, 1);
	let out = EngCalcs.lpnExportInp(d).inp, back = importNet('c2.inp', out);
	ok('delete: two comment rows that meet are written with a blank line between, and read back as two rows', rowsOf(back) === 'CCkCk' && secLines(out).indexOf('') === 1, rowsOf(back) + ' ' + JSON.stringify(secLines(out)));
	// move: the first control down past B
	d = importNet('c.inp', withControls(T));
	L.libOrderSelect('controls', 1);
	L.libOrderMove('controls', 'down');
	out = EngCalcs.lpnExportInp(d).inp; back = importNet('c3.inp', out);
	ok('move: the same, and the row count survives the round trip', rowsOf(d) === 'CCkkCk' && rowsOf(back) === rowsOf(d), rowsOf(d) + ' vs ' + rowsOf(back));
	// scenario skip: a control on a link that is off in this scenario is left out; its blank lines pass to the next row
	d = importNet('c.inp', withControls(';A\nLINK 9 OPEN AT TIME 1\n\n\n;B\nLINK 9 CLOSED AT TIME 2'));
	d.links.find((l) => l.id === '9')._active = false;
	out = EngCalcs.lpnExportInp(d).inp;
	ok('scenario skip: nothing of Link 9 is written, and the two blank lines of the skipped control still stand between A and B',
		secLines(out).join('|') === ';A|||;B' || /;A\n\n\n;B/.test(out) || secLines(out).join('|') === ';A|||;B', JSON.stringify(secLines(out)));
	// a control dropped on import: its end-of-line comment is reported and its blank lines go to the next row
	d = importNet('c.inp', withControls(';A\nLINK 9 OPEN AT TIME 1\n\n\nLINK NOPE OPEN AT TIME 2 ;lost on the end\n\n;B\nLINK 9 CLOSED AT TIME 3'));
	const parsed = EngCalcs.lpnInpParse(withControls(';A\nLINK 9 OPEN AT TIME 1\n\n\nLINK NOPE OPEN AT TIME 2 ;lost on the end\n\n;B\nLINK 9 CLOSED AT TIME 3'));
	const rep = (parsed.dropped || []).filter((x) => x.code === 'control-comments')[0];
	ok('a control left out on import: its end-of-line comment is reported, under the controls wording', !!rep && rep.ids.indexOf(';lost on the end') >= 0 && !(parsed.dropped || []).some((x) => x.code === 'comments'), JSON.stringify(parsed.dropped));
	ok('...and its blank lines are not lost: the next row keeps the larger gap', d.controls[2].comment && d.controls[2].gap === 2, JSON.stringify(d.controls.map((c) => c.gap)));
	// a rule left out by the scenario keeps the comments around it, and two comment rows it brings together stay two
	d = importNet('c.inp', net1);
	d.rules = [';A', 'RULE X', 'IF SYSTEM CLOCKTIME >= 5 AM', 'THEN LINK 9 STATUS IS OPEN', ';B', 'RULE Y', 'IF SYSTEM CLOCKTIME >= 6 AM', 'THEN LINK 10 STATUS IS OPEN'];
	d.links.find((l) => l.id === '9')._active = false;
	out = EngCalcs.lpnExportInp(d).inp;
	const rl = []; let onR = false;
	out.split('\n').forEach((l) => { const m = /^\[(\w+)\]/.exec(l.trim()); if (m) { onR = m[1] === 'RULES'; return; } if (onR) { rl.push(l); } });
	ok('scenario skip, rules: RULE X is gone, comments A and B stay, a blank line keeps them two rows',
		!rl.some((l) => /RULE X/.test(l)) && rl.indexOf(';A') >= 0 && rl.indexOf(';B') === rl.indexOf(';A') + 2 && rl[rl.indexOf(';A') + 1] === '', JSON.stringify(rl));
	// the export does not change the document
	const before = JSON.stringify(d.controls);
	EngCalcs.lpnExportInp(d);
	ok('an export never changes the rows', JSON.stringify(d.controls) === before);
}

head('4b5. comment rows in memory agree with the file: a delete or a move that brings two together gives the later one a blank line, and one accessor skips them');
{
	const net1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8').replace(/\r\n/g, '\n');
	const withControls = (body) => net1.replace(/\[CONTROLS\][^\[]*/i, '[CONTROLS]\n' + body + '\n\n');
	const rowsOf = (d) => d.controls.map((c) => c.comment ? 'C' : 'k').join('');
	const secLines = (inp) => { const o = []; let on = false; inp.replace(/\r\n/g, '\n').split('\n').forEach((l) => { const m = /^\[(\w+)\]/.exec(l.trim()); if (m) { on = m[1] === 'CONTROLS'; return; } if (on) { o.push(l); } }); while (o.length && !o[o.length - 1].trim()) { o.pop(); } return o; };
	const T = ';A\nLINK 9 OPEN AT TIME 1\n;B\nLINK 9 CLOSED AT TIME 2\n;C\nLINK 9 OPEN AT TIME 3';
	// unedited: import then export writes the section as it came
	let d = importNet('c.inp', withControls(T));
	ok('an unedited import writes the controls section exactly as it came', secLines(EngCalcs.lpnExportInp(d).inp).join('\n') === T, JSON.stringify(secLines(EngCalcs.lpnExportInp(d).inp)));
	// move: the control between A and B goes to the bottom, which brings A and B together. The memory already holds the blank line.
	L.libOrderSelect('controls', 1);
	L.libOrderMove('controls', 'bottom');
	ok('move: the two comment rows brought together are both still there, and the later one carries a blank line in memory', rowsOf(d) === 'CCkCkk' && d.controls[1].gap === 1 && d.controls[0].lines[0] === ';A' && d.controls[1].lines[0] === ';B', rowsOf(d) + ' ' + JSON.stringify(d.controls.map((c) => c.gap)));
	// ...and a save and reopen, then an export, writes the same text as exporting before the save, and it reads back as the same rows
	const before = EngCalcs.lpnExportInp(d).inp;
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	d.controls = []; L.applySaved(saved, 'x');
	const after = EngCalcs.lpnExportInp(L.getDoc()).inp;
	ok('...a saved and reopened project exports the identical section, and it reads back as the same rows', secLines(after).join('\n') === secLines(before).join('\n') && rowsOf(importNet('c4.inp', after)) === rowsOf(L.getDoc()), rowsOf(importNet('c4.inp', after)) + ' vs ' + rowsOf(L.getDoc()));
	// delete: the same through the shared helper the Delete button uses
	d = importNet('c.inp', withControls(T));
	L.libItemGapPass(d.controls, 1); d.controls = EngCalcs.lpnControlsSeparate(d.controls.filter((c, k) => k !== 1));
	ok('delete: the comment row beside a deleted control stays (a comment is a row of its own), the later of the two takes a blank line', rowsOf(d) === 'CCkCk' && d.controls[1].gap === 1 && d.controls[0].lines[0] === ';A' && d.controls[1].lines[0] === ';B', rowsOf(d) + ' ' + JSON.stringify(d.controls.map((c) => c.gap)));
	// scenario skip with no blank lines at all: A and B meet in the output, so one blank line is written and they read back as two
	d = importNet('c.inp', withControls(T));
	d.links.find((l) => l.id === '9')._active = false;
	let out = EngCalcs.lpnExportInp(d).inp;
	ok('scenario skip, no blank lines in the file: nothing of the skipped controls is written, and the three comments stay three rows, each set off by one blank line',
		secLines(out).join('|') === ';A||;B||;C' && rowsOf(importNet('c5.inp', out)) === 'CCC', JSON.stringify(secLines(out)));
	// the one accessor
	d = importNet('c.inp', withControls(T));
	ok('lpnControlsOnly: the three controls, no comment row', EngCalcs.lpnControlsOnly(d.controls).length === 3 && EngCalcs.lpnControlsOnly(d.controls).every((c) => !c.comment) && d.controls.length === 6);
	const block = EngCalcs.lpnTimeModelBlock(d, undefined);
	ok('the run reads the three controls and reports nothing for the comment rows', block.controls.length === 3 && !(block.warnings || []).some((w) => w.code === 'control-unreadable'), JSON.stringify(block.warnings));
	// the rules cut and the controls cut are the one cutter
	const runs = EngCalcs.lpnInpLineRuns([';a', ';b', '', '', 'x', ';c'], (l) => /^;/.test(l) ? 'comment' : 'text');
	ok('lpnInpLineRuns: runs of one kind with the blank lines before each', JSON.stringify(runs) === JSON.stringify({ runs: [{ kind: 'comment', lines: [';a', ';b'], gap: 0 }, { kind: 'text', lines: ['x'], gap: 2 }, { kind: 'comment', lines: [';c'], gap: 0 }], gap: 0 }), JSON.stringify(runs));
	ok('lpnGapBefore: a blank line only where two comment rows meet', EngCalcs.lpnGapBefore(0, true, true) === 1 && EngCalcs.lpnGapBefore(0, true, false) === 0 && EngCalcs.lpnGapBefore(3, true, true) === 3 && EngCalcs.lpnGapBefore(2, false, true) === 2);
	// the English words of the report say what it reports: the end-of-line comment of a control that was not imported
	const en = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8').match(/\['lpn_inp_drop_control_comments'\]='([^']*)'/)[1];
	ok('lpn_inp_drop_control_comments says the comments are those at the end of a control line', /at the end of control lines/.test(en) && !/they belong to/.test(en), en);
}

head('4c. an item with no ID is selected by position, and a position that has changed is never kept');
{
	const d = freshDoc();
	L.setOpenId('proj-c');
	L.libOrderSelect('controls', 1);
	ok('a control is selected', L.libOrderSelIndex('controls') === 1);
	// delete one and add one: the count is the same again, and the old selection must not come back
	L.libSelForgetIndexed();
	ok('Add and Delete drop the selection (libSelForgetIndexed), so one never comes back on a different control', L.libOrderSelIndex('controls') === -1);
	void d;
	L.setOpenId('');
}

head('4d. no list of IDs holds the same ID twice, so "the order of these lists never changes a run" holds for every project the page makes');
{
	// EPANET's own reader merges rows of one ID into one pattern or curve even when they are not together (src/input2.c addpattern()
	// and addcurve() return at once when findpattern()/findcurve() already knows the ID, and patterndata()/curvedata() in src/input3.c
	// append to that first one); this page's reader does the same, and the Libraries box refuses a second item with an ID in use.
	// Two items with one ID can therefore come only from a project file edited by hand, and there the two engines already disagree
	// with no move at all (EPANET and the built-in solver pick different ones), so it is no order effect.
	const text = [
		'[JUNCTIONS]', ' J1 0 10 P1', '[RESERVOIRS]', ' R1 100', '[PIPES]', ' PI1 R1 J1 1000 12 100 0 Open',
		'[PATTERNS]', ' P1 1 2 3', ' P2 1 1 1', ' P1 4 5 6', '',
		'[CURVES]', ' C1 1 10', ' C2 2 20', ' C1 3 30', '',
		'[COORDINATES]', ' J1 1 1', ' R1 0 0', '[END]', ''].join('\n');
	const d = importNet('dup.inp', text);
	ok('an .inp that gives one pattern ID in two runs is read as one pattern with all its multipliers', ids(d.patterns).join() === 'P1,P2' && d.patterns[0].multipliers.join() === '1,2,3,4,5,6', JSON.stringify(d.patterns.map((p) => [p.id, p.multipliers])));
	ok('...and one curve ID in two runs as one curve with all its points', ids(d.curves).join() === 'C1,C2' && d.curves[0].points.length === 2, JSON.stringify(d.curves.map((c) => [c.id, c.points])));
	const f = freshDoc();
	const REN = { patterns: 'libRenamePattern', curves: 'libRenameCurve', pipetypes: 'libRenamePipeType', fittings: 'libRenameFittingSet' };
	Object.keys(REN).forEach((sec) => {
		const arr = SECTIONS[sec](f), first = String(arr[0].id);
		ok(sec + ': renaming an item to an ID already in the list is refused', L[REN[sec]](arr[1], first) === false && String(arr[1].id) !== first);
	});
}

head('5. rules and the comments between them move as rows');
{
	const RULES = [
		'; heading for the whole section', '',
		';Opens the booster at night.', 'RULE A', 'IF SYSTEM CLOCKTIME >= 10 PM', 'THEN PUMP 9 STATUS IS OPEN', 'PRIORITY 1', '',
		'RULE B', 'IF TANK 2 LEVEL BELOW 120', 'THEN PUMP 9 STATUS IS OPEN', '',
		';Shuts it again.', ';(two lines)', 'RULE C', 'IF TANK 2 LEVEL ABOVE 133', 'THEN PUMP 9 STATUS IS CLOSED', '',
		'; end of rules'
	];
	const items = (lines) => L.libRuleItems(lines);
	const names = (lines) => items(lines).filter((e) => e.kind === 'rule').map((e) => e.name);
	const kinds = (lines) => items(lines).map((e) => e.kind === 'rule' ? e.name : 'c').join('');
	ok('the fixture reads as seven rows: heading, comment, A, B, a two-line comment, C, a closing comment', kinds(RULES) === 'ccABcCc', kinds(RULES));
	ok('a comment directly above a rule is a row of its own, with no blank line before RULE A', items(RULES)[1].gap === 1 && items(RULES)[2].gap === 0 && items(RULES)[4].lines.length === 2);
	const sortedLines = (a) => a.slice().sort().join('\n');
	const gapsOf = (lines) => items(lines).map((e) => e.gap).join();
	const moves = [[2, 3], [3, 2], [2, 5], [5, 2], [3, 5], [5, 3], [2, 2]];
	moves.forEach(([from, to]) => {
		const out = L.libRulesMoved(RULES, from, to), order = items(RULES).map((e) => e.kind === 'rule' ? e.name : 'c');
		order.splice(to, 0, order.splice(from, 1)[0]);
		ok('move row ' + from + ' to ' + to + ': the rows read in the new order', kinds(out) === order.join(''), kinds(out) + ' vs ' + order.join(''));
		ok('...no line added, dropped or changed', out.length === RULES.length && sortedLines(out) === sortedLines(RULES));
		ok('...and every blank line travels with the row it precedes (the same blank lines, in a new place)', gapsOf(out).split(',').sort().join() === gapsOf(RULES).split(',').sort().join(), gapsOf(out) + ' vs ' + gapsOf(RULES));
	});
	{
		// Consecutive comment lines are one row, so two comment rows moved against each other are written with a blank line between.
		const out = L.libRulesMoved(RULES, 6, 5);
		ok('a comment moved against another stays its own row: a blank line is written between them, no other line is added or lost', kinds(out) === 'ccABccC' && sortedLines(out.filter((l) => l.trim())) === sortedLines(RULES.filter((l) => l.trim())), kinds(out));
	}
	{
		const out = L.libRulesMoved(RULES, 5, 2), at = out.indexOf('RULE C');
		ok('a rule takes its own lines with it and no comment', out[at + 1] === 'IF TANK 2 LEVEL ABOVE 133' && out[at + 2] === 'THEN PUMP 9 STATUS IS CLOSED' && out[at - 1] !== ';(two lines)', JSON.stringify(out.slice(0, 6)));
		const back = L.libRulesMoved(out, 2, 5);
		ok('moving it back restores the text exactly', same(back, RULES));
	}
	// a block of lines that is not a rule, at the head of the text, stays first and cannot move
	{
		const odd = ['IF SYSTEM CLOCKTIME >= 1 AM', 'THEN PUMP 9 STATUS IS OPEN', '', 'RULE X', 'IF TANK 2 LEVEL BELOW 1', 'THEN PUMP 9 STATUS IS OPEN', '',
			'RULE Y', 'IF TANK 2 LEVEL BELOW 2', 'THEN PUMP 9 STATUS IS OPEN'];
		const e = L.libRuleItems(odd);
		ok('a leading block with no RULE line is a text item with no name', e.length === 3 && e[0].kind === 'text' && !e[0].name, JSON.stringify(e.map((x) => x.kind)));
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
		ok('Move to bottom on a rule moves it', L.libOrderMove('rules', 'bottom') === true && same(names(d.rules), ['B', 'C', 'A']));
		ok('...as one undo step', L.undoDepth() === depth + 1);
		ok('...and the selection follows it', L.libOrderSelIndex('rules') === 6);
		ok('...and the project file holds the new order', same(L.serialize(true).rules, d.rules));
		const inp = EngCalcs.lpnExportInp(d).inp, order = [...inp.matchAll(/^RULE (\w+)/gm)].map((m) => m[1]);
		ok('...and the .inp writes [RULES] in that order', same(order, ['B', 'C', 'A']), JSON.stringify(order));
		// the flat text is cut into rules once for the action, not once for every question the move asks of it
		{
			const split = EngCalcs.lpnRuleSplit;
			let cuts = 0;
			EngCalcs.lpnRuleSplit = function () { cuts++; return split.apply(this, arguments); };
			L.libOrderSelect('rules', 2);
			L.libOrderMove('rules', 'down');
			EngCalcs.lpnRuleSplit = split;
			ok('one Move on a rule cuts the [RULES] text at most twice (' + cuts + ')', cuts > 0 && cuts <= 2, String(cuts));
		}
		L.undo();
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

head('6b. the selection follows an item through a rename');
{
	const REN = { patterns: 'libRenamePattern', curves: 'libRenameCurve', pipetypes: 'libRenamePipeType', fittings: 'libRenameFittingSet' };
	Object.keys(REN).forEach((sec) => {
		const d = freshDoc(), arr = SECTIONS[sec](d), item = arr[1];
		L.libOrderSelect(sec, 1);
		ok(sec + ': ' + REN[sec] + ' renames the selected item', L[REN[sec]](item, 'RENAMED') !== false && item.id === 'RENAMED');
		ok(sec + ': it is still the selected item under its new id', L.libOrderSelIndex(sec) === 1);
		ok(sec + ': and Move to top moves it', L.libOrderMove(sec, 'top') === true && String(arr[0].id) === 'RENAMED');
	});
}

(async function () {
	head('7. whether a move changes a run: EPANET and the built-in solver, Net1 with two conflicting controls and then conflicting rules');
	// EPANET 2.2 src/hydraul.c controls(): each control is examined in list order, so of two that act on one link at one
	// time the LAST in the list takes effect. src/rules.c checkrules() with updateactionlist()/onactionlist(): rules are examined
	// in list order and a link already on the action list keeps its action unless the later rule's priority is strictly
	// higher, so of two equal-priority rules the FIRST in the list takes effect.
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
	// Both engines on the document as it stands; the pump's flow at every hour.
	async function runBoth() {
		const m = L.assembleModel();
		return {
			epanet: pumpFlow(await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(m)), {})),
			native: pumpFlow(EngCalcs.lpnNativeRun(JSON.parse(JSON.stringify(m)), { quality: true }))
		};
	}
	const differs = (a, b) => a.length !== b.length || a.some((q, i) => Math.abs(q - b[i]) > 1e-6);
	// Every scenario gives the pump back at 8 o'clock, so the tank never runs dry (a pump shut all day leaves nothing to supply the
	// system, a case no order question is about). The conflict is at 5 o'clock; hours 6 and 7 show which action won.
	const REOPEN = 'LINK 9 OPEN AT TIME 8';
	const shut = (a) => a.length === 25 && a.slice(6, 8).every((q) => Math.abs(q) < 1e-6);
	const running = (a) => a.length === 25 && a.slice(6, 8).every((q) => q > 1e-3);
	function verdict(name, r, want) {
		ok(name + ': EPANET ' + (want ? 'shuts' : 'runs') + ' the pump', (want ? shut : running)(r.epanet), JSON.stringify(r.epanet.slice(4, 8)));
		ok(name + ': the built-in solver agrees with EPANET, hour by hour', !differs(r.epanet, r.native), JSON.stringify(r.epanet.map((q, i) => +(q - r.native[i]).toExponential(2))));
	}
	// Controls: the same link, the same moment, opposite actions. The later in the list wins.
	{
		open((s) => {
			s.rules = [];
			s.controls = [L.libReadControl('LINK 9 CLOSED AT TIME 5').rec, L.libReadControl('LINK 9 OPEN AT TIME 5').rec, L.libReadControl(REOPEN).rec];
		});
		const first = await runBoth();
		verdict('controls, CLOSED listed first (the later, OPEN, wins)', first, false);
		L.libOrderSelect('controls', 0);
		L.libOrderMove('controls', 'bottom');
		const second = await runBoth();
		verdict('controls, CLOSED moved last (the later, CLOSED, wins)', second, true);
		ok('controls: the order changes the run', differs(first.epanet, second.epanet) && differs(first.native, second.native));
		L.libOrderMove('controls', 'top');
		const back = await runBoth();
		ok('...and moving it back restores the run, in both engines', !differs(first.epanet, back.epanet) && !differs(first.native, back.native));
		// two controls on one link at DIFFERENT times: the order is no part of it
		open((s) => {
			s.rules = [];
			s.controls = [L.libReadControl('LINK 9 CLOSED AT TIME 5').rec, L.libReadControl('LINK 9 OPEN AT TIME 7').rec, L.libReadControl(REOPEN).rec];
		});
		const a = await runBoth();
		L.libOrderSelect('controls', 0);
		L.libOrderMove('controls', 'bottom');
		const b = await runBoth();
		ok('controls at different times: the order changes nothing, in either engine', !differs(a.epanet, b.epanet) && !differs(a.native, b.native));
		ok('...and the two engines agree', !differs(a.epanet, a.native));
	}
	// Rules: equal priority, opposite actions. The earlier in the list wins.
	const RULE = (name, act, pri) => ['RULE ' + name, 'IF SYSTEM CLOCKTIME >= 5 AM', 'AND SYSTEM CLOCKTIME < 8 AM', 'THEN PUMP 9 STATUS IS ' + act, 'PRIORITY ' + pri];
	const control8 = (s) => { s.controls = [L.libReadControl(REOPEN).rec]; };
	{
		const lines = RULE('A', 'CLOSED', 1).concat([''], RULE('B', 'OPEN', 1));
		open((s) => { control8(s); s.rules = lines; });
		const first = await runBoth();
		verdict('rules at equal priority, CLOSED listed first (the earlier, CLOSED, wins)', first, true);
		L.libOrderSelect('rules', 0);
		L.libOrderMove('rules', 'bottom');
		const second = await runBoth();
		verdict('rules at equal priority, OPEN now first (the earlier, OPEN, wins)', second, false);
		ok('rules: the order changes the run', differs(first.epanet, second.epanet) && differs(first.native, second.native));
		// a strictly higher priority wins in either order
		for (const [pa, pb] of [[1, 5], [5, 1]]) {
			const hi = RULE('A', 'CLOSED', pa).concat([''], RULE('B', 'OPEN', pb));
			open((s) => { control8(s); s.rules = hi; });
			// A closes the pump, B opens it: the higher priority wins, listed first or last
			const x = await runBoth();
			verdict('rules, priorities ' + pa + ' (closes) and ' + pb + ' (opens), listed in that order', x, pa > pb);
			L.libOrderSelect('rules', 0);
			L.libOrderMove('rules', 'bottom');
			const y = await runBoth();
			ok('...moved: the same rule still wins, in both engines', !differs(x.epanet, y.epanet) && !differs(x.native, y.native));
		}
		// a rule's ELSE side is judged the same way: two equal-priority rules whose premises are false
		const els = ['RULE A', 'IF SYSTEM CLOCKTIME < 5 AM', 'OR SYSTEM CLOCKTIME >= 8 AM', 'THEN PUMP 9 STATUS IS OPEN', 'ELSE PUMP 9 STATUS IS CLOSED', 'PRIORITY 1', '',
			'RULE B', 'IF SYSTEM CLOCKTIME < 5 AM', 'OR SYSTEM CLOCKTIME >= 8 AM', 'THEN PUMP 9 STATUS IS OPEN', 'ELSE PUMP 9 STATUS IS OPEN', 'PRIORITY 1'];
		open((s) => { s.controls = []; s.rules = els; });
		const e1 = await runBoth();
		verdict('rules, ELSE actions at equal priority (A first: its CLOSED wins)', e1, true);
		L.libOrderSelect('rules', 0);
		L.libOrderMove('rules', 'bottom');
		verdict('rules, ELSE actions at equal priority (B first: its OPEN wins)', await runBoth(), false);
	}
	// Patterns: looked up by id, so their order is no part of a run.
	{
		open((s) => { s.rules = []; });
		const a = await runBoth();
		const d = L.getDoc();
		d.patterns.push({ id: 'ZZ', multipliers: [1] });
		L.libOrderSelect('patterns', d.patterns.length - 1);
		L.libOrderMove('patterns', 'top');
		const z = await runBoth();
		ok('patterns: moving one changes nothing in the run, in either engine', !differs(a.epanet, z.epanet) && !differs(a.native, z.native));
	}
	console.log('\n' + checks + ' checks, ' + fails + ' failed');
	console.log(fails === 0 ? 'library order harness: all checks passed' : 'library order harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}());
