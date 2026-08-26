// THE FIRE-FLOW BOX ON THE PAGE -- ROADMAP Task 530, the interface half. Run with:
//   node dev/lpn-spike/fireflow-wizard-harness.js
//
// dev/lpn-spike/fireflow-harness.js proves the ARITHMETIC. This one proves the PROMISE, which is
// the reason Tom put the task on the roadmap in the first place: *"we must either ask or disclose
// our assumptions about the diameter, roughness, k, and length of a hydrant and lateral
// assembly."* An engine that returns `{value, source}` for every knob keeps nobody's promise on
// its own -- an interface that ignores those fields would pass every assertion in the other file
// and still hand a user a number with four invented assumptions inside it.
//
// So everything below goes through the REAL listeners. The menu row is found by opening the real
// Project menu and clicking the real row; the boxes are the real inputs; Calculate is the real
// button, in the real dialog, and the answer is read out of the real rendered body. Nothing here
// calls the fire-flow engine directly.
//
// THE SIX CLAIMS, and what each failure looks like on the page:
//
//   1. **THE LATERAL LENGTH IS ASKED AND REFUSED WHEN ABSENT.** Five agency standards span
//      25-100 ft for that one pipe. A box that quietly opened on "50" would be the dishonest kind
//      of convenience, so the box opens EMPTY and pressing Calculate comes back with the engine's
//      own `lateral-length-required` in this project's words -- not a validation message this page
//      made up, and not a flow.
//   2. **THE OTHER ASSUMPTIONS ARE DISCLOSED, WITH THE NUMBER AND WHERE IT CAME FROM.** On the
//      page, in editable boxes, and restated in the answer with "assumed" or "you gave this".
//   3. **THE k STATES THE VELOCITY IT IS REFERENCED TO** (Tom: *"critical in the hydrant model"*).
//      It is read off the LATERAL DIAMETER BOX, so changing that box moves the stated reference --
//      which is the whole point, because that is what a person pasting a coefficient must know.
//   4. **THE ISO CAP IS A NOTE, NEVER A CLAMP.** The computed number is shown, the 1,500 gpm
//      credit limit is shown beside it, and the first is not cut down to the second.
//   5. **EVERY FAILURE CODE RENDERS ITS OWN MESSAGE**, and `below-residual-at-rest` renders as
//      "there is no such flow" rather than as an available fire flow of zero.
//   6. **THE DOCUMENT IS BYTE-IDENTICAL AFTERWARDS.** The assembly is ad-hoc: not the asset list,
//      not a saved file, not the .inp export. Snapshotted around the whole exchange.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { byId, setUnitSet, loadLoopedNetwork } = stub;

// The engine. The page loads it from its own <script> tag ahead of looped-network.js; here it is
// required after the stub has made global.EngCalcs, which is the same order. Object.assign for the
// same reason the stub uses it on lpn-solver.js: in Node the module attaches its exports to the
// SOLVER's object, and js/looped-network.js reads global.EngCalcs.
Object.assign(global.EngCalcs, require(path.join(stub.ROOT, 'js', 'lpn-fireflow.js')));

const L = loadLoopedNetwork([
	"\t\tgetDoc: function () { return doc; },",
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, buildDom: buildDom,",
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },",
	"\t\tapplyUnitSelections: applyUnitSelections, remember: rememberUnitSelections,",
	"\t\topenProjectBarMenu: openProjectBarMenu, setSelection: setSelection,",
	"\t\tshowFireFlowResult: showFireFlowResult,",
	"\t\tfireFlowDefaults: fireFlowDefaults,",
	"\t\tdocGuard: function () { return fireFlowDocGuard; },",
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };",
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};",
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };",
	"\t\t\tproject = { name: 'T', activeScenario: 'base' }; scenarios = defaultScenarios();",
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs(); undoStack.length = 0;",
	"\t\t\tfireFlowAsk = null;",
	"\t\t\tsvg = document.getElementById('lpn_canvas');",
	"\t\t\tworld = el('g', {}, svg);",
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);",
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);",
	"\t\t\tlabelsLayer = el('g', {}, world);",
	"\t\t\trubberBandEl = el('line', {}, world); }"
].join('\n'));

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

// ---- driving the page the way a hand does -------------------------------------------------------
// The dialog is built into #lpn_dialog_body and its buttons into #lpn_dialog_buttons, and
// openDialog() clears both -- so a harness reads them exactly where a browser paints them.
function walkText(el, out) {
	out = out || [];
	if (!el.children || !el.children.length) {
		const t = el.textContent || '';
		if (t !== '') { out.push(t); }
		return out;
	}
	el.children.forEach(c => walkText(c, out));
	return out;
}
function bodyLines() { return walkText(byId.lpn_dialog_body); }
function bodyText() { return bodyLines().join(' | '); }
function buttonLabels() { return byId.lpn_dialog_buttons.children.map(b => b.textContent); }
function press(label) {
	const b = byId.lpn_dialog_buttons.children.find(x => x.textContent === label);
	if (!b) { throw new Error('no button "' + label + '" -- have ' + JSON.stringify(buttonLabels())); }
	(b._listeners.click || []).forEach(f => f());
}
// The controls, found the way a user finds them: by the words beside them, not by an id this page
// does not give them. A row is [name, control, unit].
function rows() {
	const found = [];
	function walk(el) {
		if (el['class'] === 'lpn-ff-row') { found.push(el); return; }
		(el.children || []).forEach(walk);
	}
	walk(byId.lpn_dialog_body);
	return found;
}
function control(namePrefix) {
	const r = rows().find(x => (x.children[0].textContent || '').indexOf(namePrefix) === 0);
	if (!r) {
		throw new Error('no row starting "' + namePrefix + '" -- have ' +
			JSON.stringify(rows().map(x => x.children[0].textContent)));
	}
	return r.children[1];
}
function unitOn(namePrefix) {
	const r = rows().find(x => (x.children[0].textContent || '').indexOf(namePrefix) === 0);
	return r.children[2].textContent;
}
function tipOn(namePrefix) {
	const r = rows().find(x => (x.children[0].textContent || '').indexOf(namePrefix) === 0);
	return r.children[0].title || '';
}
function fire(el, type) { (el._listeners[type] || []).forEach(f => f({})); }
// The search is a promise chain of about sixteen solves, so the answer lands several microtask
// turns after the click. Nothing on this page tells a harness when; settling is how every other
// asynchronous harness here waits.
async function settle() {
	for (let i = 0; i < 60; i++) { await new Promise(r => setTimeout(r, 0)); }
}

// ---- the fixture ---------------------------------------------------------------------------------
// A reservoir, 600 ft of 8 in main, one junction with an ordinary demand -- the same shape as the
// engine harness's worked example, in US units because that is what every number in the research is
// stated in and what the disclosure has to read back correctly.
function buildNetwork(head) {
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({
		lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o',
		lpn_u_pressure: 'psi', lpn_u_flow: 'gpm'
	});
	L.remember();
	const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 200, 0);
	const pipe = L.addLink('pipe', r.id, j.id);
	r.elev = head === undefined ? 200 : head;
	L.setProp(j, 'demand', 300);
	L.setProp(pipe, 'length', 800);
	L.setProp(pipe, 'diameter', 12);
	L.buildDom();
	return { r, j, pipe };
}
const snapshot = () => JSON.stringify(L.getDoc());

// The Project menu, opened for real, and the row clicked for real.
function openFromMenu() {
	byId.lpn_menu_list.children.length = 0;
	L.openProjectBarMenu(byId.lpn_menu_project || byId.lpn_menubar);
	const row = byId.lpn_menu_list.children.find(
		b => (b.textContent || '').indexOf('Fire flow') === 0);
	if (!row) {
		throw new Error('no fire-flow row in the Project menu -- have ' +
			JSON.stringify(byId.lpn_menu_list.children.map(b => b.textContent)));
	}
	byId.lpn_dialog_body.children.length = 0;
	byId.lpn_dialog_buttons.children.length = 0;
	(row._listeners.click || []).forEach(f => f({ stopPropagation() {} }));
	return row;
}

(async function () {

	console.log('\n--- the row is in the Project menu, and it opens the box ---');
	const net = buildNetwork();
	const before = snapshot();
	{
		const row = openFromMenu();
		ok('the Project menu carries the fire-flow row', !!row, row.textContent);
		ok('...and it explains itself, because this page invented it',
			/hydrant/i.test(row.title || ''), (row.title || '').slice(0, 60) + '…');
		ok('the box opens with the two answers a question needs',
			JSON.stringify(buttonLabels()) === JSON.stringify(['Work out the fire flow', 'Cancel']),
			JSON.stringify(buttonLabels()));
		ok('and it says it will not change the project',
			/never enter|not changed/i.test(bodyText()));
	}

	console.log('\n--- 1. THE LENGTH IS ASKED, AND REFUSED WHEN IT IS ABSENT ---');
	{
		ok('the lateral length box opens EMPTY -- there is no honest default',
			control('Length of the hydrant lateral').value === '');
		ok('...and it is asked in this project\'s own length unit',
			unitOn('Length of the hydrant lateral') === 'ft', unitOn('Length of the hydrant lateral'));
		ok('...and the tip says WHY there is no default',
			/25 ft to 100 ft/.test(tipOn('Length of the hydrant lateral')),
			tipOn('Length of the hydrant lateral').slice(0, 50) + '…');

		press('Work out the fire flow');
		await settle();
		const t = bodyText();
		ok('pressing Calculate with no length comes back refused, by name',
			/How long is the hydrant lateral/.test(t));
		ok('...and the refusal is not a flow of any kind',
			!/Available fire flow: /.test(t), t.split(' | ')[1]);
		// Back to the questions, with everything still in the boxes: the commonest next action after
		// any answer here is to change one number and ask again.
		ok('the answer offers a way back to the questions',
			buttonLabels().indexOf('Change something') >= 0, JSON.stringify(buttonLabels()));
		press('Change something');
		ok('...and it reopens on the questions', !!control('Length of the hydrant lateral'));
	}

	console.log('\n--- 2. THE OTHER ASSUMPTIONS ARE DISCLOSED, ON THE PAGE, EDITABLE ---');
	{
		const d = L.fireFlowDefaults();
		ok('the lateral diameter is shown, as 6 in', control('Lateral diameter').value === '6' &&
			unitOn('Lateral diameter') === 'in', control('Lateral diameter').value);
		ok('the hydrant WATERWAY is shown, and it is the 4.5 in main valve, not the 6 in shoe',
			control('Hydrant waterway diameter').value === '4.5',
			control('Hydrant waterway diameter').value);
		ok('...and its tip says which of the two it is',
			/not the 6 in shoe/i.test(tipOn('Hydrant waterway diameter')));
		ok('the waterway length is shown, about 5 ft',
			control('Hydrant waterway length').value === '5' &&
			unitOn('Hydrant waterway length') === 'ft');
		ok('both roughnesses are shown', control('Lateral roughness').value === '130' &&
			control('Hydrant waterway roughness').value === '130');
		ok('the k is shown, and it is the research total of about 5',
			+control('Minor (local) loss coefficient').value > 4.9 &&
			+control('Minor (local) loss coefficient').value < 5,
			control('Minor (local) loss coefficient').value);
		ok('...and its tip refuses zero out loud',
			/Zero is not an option/i.test(tipOn('Minor (local) loss coefficient')));
		ok('the residual opens on the 20 psi convention',
			control('Residual pressure to hold').value === '20' &&
			unitOn('Residual pressure to hold') === 'psi');
		ok('every disclosed box is EDITABLE, not a readout',
			['Lateral diameter', 'Lateral roughness', 'Hydrant waterway diameter',
				'Hydrant waterway length', 'Hydrant waterway roughness',
				'Minor (local) loss coefficient'].every(n => control(n)._tag === 'input'));
		ok('the defaults the box opens on are the defaults the page computes',
			d.lateralDiameter === '6' && d.barrelDiameter === '4.5' && d.lateralLength === '');
	}

	console.log('\n--- 3. THE k STATES THE VELOCITY IT IS REFERENCED TO ---');
	{
		// A k is meaningless without its reference velocity; this assembly has two diameters; and
		// (6/4.5)^4 = 3.16 is the size of the mistake. The sentence is read off the LATERAL DIAMETER
		// BOX rather than off the module's derivation, so a user who widens the lateral is told
		// about the velocity actually in force.
		ok('the box states which velocity the k belongs to, and at which diameter',
			/belongs to the velocity in the lateral, at a lateral diameter of 6 in/.test(bodyText()));
		ok('...and it names the AWWA C502 half and the Crane half separately, never one number',
			/AWWA C502 test ceiling/.test(bodyText()) && /Crane TP-410/.test(bodyText()));
		const lat = control('Lateral diameter');
		lat.value = '8';
		press('Work out the fire flow');
		await settle();
		press('Change something');
		ok('widening the lateral moves the stated reference with it',
			/at a lateral diameter of 8 in/.test(bodyText()), '(6/4.5)^4 = 3.16x is the mistake it prevents');
		control('Lateral diameter').value = '6';
	}

	console.log('\n--- 4. AN ANSWER, WITH THE ISO CAP BESIDE IT AND NOT APPLIED TO IT ---');
	let answerText = '';
	{
		control('Length of the hydrant lateral').value = '50';
		press('Work out the fire flow');
		await settle();
		answerText = bodyText();
		const m = /Available fire flow: ([\d.]+) gpm/.exec(answerText);
		ok('it reports a flow, in this project\'s own flow unit', !!m, m && m[0]);
		const flow = m ? +m[1] : 0;
		ok('...and it is a hydrant-sized number', flow > 500 && flow < 5000, String(flow));
		ok('the ISO single-hydrant credit is stated beside it',
			/ISO credits a single hydrant with at most 1500 gpm/.test(answerText));
		ok('...and it says the credit limit was NOT applied',
			/has not been applied to the number above/.test(answerText));
		ok('**THE COMPUTED NUMBER IS NOT CLAMPED TO THE CAP**',
			flow > 1500 && /works out above that credit limit/.test(answerText),
			flow + ' gpm > 1500 gpm, and said so');
		ok('the residual it was held at is stated', /still holds 20 psi/.test(answerText));
		ok('the static pressure is reported too',
			/With the hydrant shut, .* holds [\d.]+ psi/.test(answerText));
		ok('the engine and the cost of the search are named',
			/built-in solver/.test(answerText) && /solved \d+ times/.test(answerText));
		ok('the critical point defaults to the hydrant outlet, not to the hydrant\'s junction',
			/~outlet/.test(answerText), (/(\S+~outlet)/.exec(answerText) || [])[1]);
	}

	console.log('\n--- 2b. THE ANSWER RESTATES WHAT IT ASSUMED, AND WHO SUPPLIED IT ---');
	{
		ok('the answer carries a "what was used" list', /What was used/.test(answerText));
		ok('the length the user gave is marked as theirs',
			/Length of the hydrant lateral: 50 ft \(you gave this\)/.test(answerText));
		ok('the diameters we assumed are marked assumed',
			/Lateral diameter: 6 in \(assumed\)/.test(answerText) &&
			/Hydrant waterway diameter: 4.5 in \(assumed\)/.test(answerText));
		ok('the k is restated with the velocity it was referenced to',
			/belongs to the velocity in the lateral, at a lateral diameter of 6 in/.test(answerText));
		// The engine hands the k over in TWO labelled pieces with different provenance, and the
		// answer keeps them apart -- a sum presented as one measured number is the thing that rule
		// exists to prevent.
		ok('...and the answer carries its two halves separately, never as one number',
			/AWWA C502 test ceiling/.test(answerText) && /Crane TP-410/.test(answerText));
		// And a k the user typed says so, in both places.
		press('Change something');
		control('Minor (local) loss coefficient').value = '3';
		press('Work out the fire flow');
		await settle();
		const t = bodyText();
		ok('a k the user typed is marked as theirs',
			/loss coefficient, k: 3 \(you gave this\)/.test(t));
		ok('...and it is told it will be used at the LATERAL velocity, whatever table it came from',
			/Your coefficient will be used at the velocity in the lateral/.test(t));
		ok('...and how to restate one that meant another velocity',
			/to the fourth power/.test(t));
		const lower = +(/Available fire flow: ([\d.]+) gpm/.exec(answerText) || [])[1];
		const higher = +(/Available fire flow: ([\d.]+) gpm/.exec(t) || [])[1];
		ok('a smaller k really does yield more flow -- the k is doing work', higher > lower,
			higher + ' gpm at k = 3 vs ' + lower + ' gpm at k = 4.96');
		press('Change something');
		control('Minor (local) loss coefficient').value = L.fireFlowDefaults().k;
		press('Work out the fire flow');
		await settle();
	}

	console.log('\n--- the hydrant\'s OWN junction is not offered as a critical point ---');
	{
		// A demand-driven solve: the assembly hangs downstream of the tee, so nothing in it can move
		// the pressure at the junction it starts from. Offering that node beside the outlet as
		// though it were the same question is the quietest way to hand somebody a bigger, meaningless
		// number, so it is not on the list at all -- and the tip says why.
		press('Change something');
		const hyd = control('Hydrant is on this junction'), crit = control('Point that must hold the residual');
		const ids = () => crit.children.map(o => o.value);
		ok('the critical point defaults to the hydrant outlet', crit.value === '' &&
			crit.children[0].textContent === 'The hydrant outlet');
		ok('**the hydrant\'s own junction is NOT on the list**', ids().indexOf(hyd.value) < 0,
			hyd.value + ' excluded; list is ' + JSON.stringify(ids()));
		ok('...and the tip says why, rather than leaving a silent gap',
			/cannot change the pressure there/.test(tipOn('Point that must hold the residual')));
		ok('another node in the network IS offered', ids().indexOf(net.r.id) >= 0,
			JSON.stringify(ids()));
		// Move the hydrant and the exclusion moves with it, or the old one stays hidden and the new
		// one is offered -- exactly the wrong way round.
		const other = L.addNode('junction', 400, 0);
		L.buildDom();
		press('Cancel');
		openFromMenu();
		const hyd2 = control('Hydrant is on this junction'), crit2 = control('Point that must hold the residual');
		hyd2.value = other.id;
		fire(hyd2, 'change');
		const ids2 = crit2.children.map(o => o.value);
		ok('moving the hydrant moves the exclusion',
			ids2.indexOf(other.id) < 0 && ids2.indexOf(net.j.id) >= 0, JSON.stringify(ids2));
		press('Cancel');
	}

	console.log('\n--- 6. THE DOCUMENT IS BYTE-IDENTICAL AFTERWARDS (the add-on is ad-hoc) ---');
	{
		// `other` was added by the block above on purpose, so this compares against a snapshot taken
		// after it -- the claim is that the fire-flow exchange changed nothing, not that nothing
		// else in the harness did.
		const mark = snapshot();
		openFromMenu();
		control('Length of the hydrant lateral').value = '50';
		press('Work out the fire flow');
		await settle();
		press('OK');
		ok('the document is byte-identical after a whole run', snapshot() === mark);
		ok('...and the page\'s own guard on that agrees', L.docGuard() === true);
		ok('nothing invented was added to the nodes', L.getDoc().nodes.length === 3,
			L.getDoc().nodes.map(n => n.id).join(' '));
		ok('nothing invented was added to the links', L.getDoc().links.length === 1);
		ok('and the very first snapshot still holds for the two elements it covered',
			JSON.parse(before).links.length === JSON.parse(mark).links.length);
	}

	console.log('\n--- 5. EVERY FAILURE CODE RENDERS ITS OWN MESSAGE, AND NONE IS A NUMBER ---');
	{
		// 5a. Already under the residual with the hydrant shut, driven for real: a reservoir low
		// enough that the junction cannot hold 20 psi at rest. THE QUESTION HAS NO ANSWER HERE, and
		// that is a different fact from an answer of zero.
		buildNetwork(10);
		openFromMenu();
		control('Length of the hydrant lateral').value = '50';
		press('Work out the fire flow');
		await settle();
		const dead = bodyText();
		ok('below the residual at rest is reported by name',
			/There is no available fire flow here/.test(dead));
		ok('**and it is NOT an available fire flow of zero**, and says so',
			/not the same as an answer of zero/.test(dead) && !/Available fire flow: /.test(dead));
		ok('...and it names the pressure that failed',
			/is already below it, at [\d.]+ psi/.test(dead), (/at [\d.]+ psi/.exec(dead) || [])[0]);
		press('OK');
	}
	{
		// 5b. The codes a drawn network cannot be made to produce on demand -- a ceiling reached, a
		// solve that will not converge, a node that is not there -- rendered through the SAME
		// renderer the buttons call, fed the record shape js/lpn-fireflow.js documents. A stub
		// engine is the wrong tool here (it would remove the coupling); a real record is not.
		const C = global.EngCalcs.lpnFireFlowCodes;
		const GPM = global.EngCalcs.lpnFireFlowGpmToSI;
		function render(result) {
			byId.lpn_dialog_body.children.length = 0;
			byId.lpn_dialog_buttons.children.length = 0;
			L.showFireFlowResult(result, { epanet: false });
			return bodyText();
		}
		let t = render({ ok: false, code: C.CEILING, ceiling: GPM(10000), solves: 2 });
		ok('search-ceiling-reached says the residual held past any real hydrant',
			/still held at 10000 gpm/.test(t) && !/Available fire flow: /.test(t), t.split(' | ')[1]);

		t = render({ ok: false, code: C.NO_CONVERGENCE, flowAtFailure: GPM(800), solves: 4 });
		ok('solve-did-not-converge names the flow it happened at, and gives no answer',
			/did not settle at 800 gpm/.test(t) && !/Available fire flow: /.test(t));

		t = render({ ok: false, code: C.SOLVE_FAILED, solves: 1,
			issues: [{ code: 'no-fixed-head', ids: [] }] });
		ok('solve-reported-issues carries the network\'s own diagnostic, in the page\'s words',
			/could not be worked out/.test(t) && /reservoir|tank/i.test(t), t.split(' | ')[1]);

		t = render({ ok: false, code: C.UNKNOWN_HYDRANT, id: 'J9', solves: 0 });
		ok('hydrant-node-not-found names the id', /no junction named J9/.test(t));

		t = render({ ok: false, code: C.UNKNOWN_CRITICAL, id: 'J9', solves: 0 });
		ok('critical-node-not-found names the id', /no point named J9/.test(t));

		t = render({ ok: false, code: C.NOT_A_JUNCTION, id: 'R1', type: 'reservoir', solves: 0 });
		ok('hydrant-node-not-a-junction says what R1 is and why it cannot answer',
			/R1 is a reservoir/.test(t) && /fixes the water level/.test(t));

		t = render({ ok: false, code: C.NO_LATERAL_LENGTH, solves: 0 });
		ok('lateral-length-required renders the same refusal the button produced',
			/How long is the hydrant lateral/.test(t));

		// And an unrecognised code still says something rather than nothing -- a blank box is the
		// one outcome that teaches a user nothing at all.
		t = render({ ok: false, code: 'something-new', solves: 0 });
		ok('an unknown code is still named rather than rendering an empty box',
			/something-new/.test(t), t.split(' | ')[1]);

		ok('every code js/lpn-fireflow.js can return has a message here',
			Object.keys(C).filter(k => k !== 'OK').every(k => {
				const s = render({ ok: false, code: C[k], solves: 0, issues: [] });
				return s.length > 40 && s.indexOf(C[k]) < 0;
			}), Object.keys(C).filter(k => k !== 'OK').join(' '));
	}

	console.log(fails === 0 ? '\nAll fire-flow box checks passed.\n' : '\n' + fails + ' FAILED\n');
	process.exit(fails === 0 ? 0 : 1);
}());
