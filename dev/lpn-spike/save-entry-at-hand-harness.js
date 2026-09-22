// SAVE THE ENTRY AT HAND, NOT THE WHOLE PROJECT (ROADMAP Task 706). Run with:
//   node dev/lpn-spike/save-entry-at-hand-harness.js
//
// WHY THIS EXISTS. Declan, entering a network at volume on 2026-09-21, found that every committed
// cell in the Tables pane serialised and stored the ENTIRE project -- on every keystroke-
// equivalent, uncapped -- and that the same commit re-marked every element on the map for
// scenario overrides even when nothing about scenarios had changed.
//
// Tom ruled the same day: *"I am not sure what it means to save the whole project and why we would
// ever do that when we can just save the entry at hand. My intuition is that we would always just
// save the entry at hand and only save the whole project ... when there is a pause. See Off Means
// Off."*
//
// **NONE OF THIS IS VISIBLE IN A BROWSER, which is what a harness is for.** A page that writes the
// whole project on every cell and a page that writes it once at the pause look and behave
// identically -- same numbers, same map, same table -- and the only difference is time nobody can
// see a slice of. Worse, the failure mode of getting it WRONG is invisible too, and permanent: an
// edit typed into the last cell before a tab is closed, deferred and never written. So the
// assertions come in three groups:
//
//   1. **THE BURST COSTS ONE WRITE**, not one per cell, and the cell that was typed is in it.
//   2. **NOTHING CAN BE LOST.** Every door the page can leave by -- pagehide, the tab going
//      hidden, beforeunload, and every deliberate save already in the file -- discharges a
//      pending write, and the value typed a millisecond earlier is in what lands.
//   3. **ONE ELEMENT IS MARKED, NOT ALL OF THEM**, and the marks it gets are byte-for-byte what
//      the whole-drawing pass would have given it.
//
// AND EACH REPAIR IS A LIVE MUTATION. A harness that passes because the page happens to be quiet
// is worth nothing, so the shipped source is put back to its pre-repair shape in turn and the
// assertions that hold each repair are REQUIRED to fail. It also prints a before/after
// measurement on a 560-element drawing, taken through the same mutation, so the two numbers are
// the same machine, the same document and the same gestures.
//
// **WHAT THIS MEASUREMENT CANNOT SEE, stated rather than implied** (Declan said it first and was
// right to): `localStorage` here is a plain object in this process. It does the JSON.stringify --
// which is most of the cost and grows with the network -- and NOT the browser's actual write to
// disk, which is synchronous on the main thread in a real browser and is not modelled here at
// all. Every number below is therefore a FLOOR for the WRITE half.
//
// **AND THE MARKS HALF IS NOT EVEN A FLOOR -- it is a different machine.** The map here is a tree
// of plain JavaScript objects, so a classList toggle costs an object property where a browser's
// costs a style invalidation on a live SVG element. The whole-map scan's share of the numbers
// below could be either high or low against a real browser, and this harness cannot say which.
// What it CAN say, exactly, is how many elements each pass visits, which is what the live
// mutation in group 5 asserts and is the claim that does not depend on the stub at all.
//
// Five minutes of a real browser with the Performance tab open is still the only thing that can
// turn any of this into a real number.

'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function bad(name, cond, extra) {   // for a mutation: the assertion is REQUIRED to fail
	if (!cond) { console.log('  ok   (mutation) ' + name); return; }
	fails++;
	console.log('  FAIL (mutation) ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// ---- the two mutations, each one line of the shipped source ---------------------------------
//
// loadLoopedNetwork() throws if a mutation matches nothing, so a rewording of either repair cannot
// quietly turn its mutation into a no-op and leave this file green.

// THE SAVE. Back to a full serialize-and-store on every committed cell -- the page as Declan found
// it.
const UNDEFER = (src) => src.replace(
	"\t\tscheduleSave();\n\t\trefreshPaneIfOpen();",
	"\t\tsaveToStorage();\n\t\trefreshPaneIfOpen();");

// THE MARKS. Back to a walk of every node and every link on every committed cell.
const UNSCOPE = (src) => src.replace(
	"\t\tapplyScenarioMarks(el);\n\t\trefreshScenarioStatus();",
	"\t\trefreshScenarioMarks();\n\t\trefreshScenarioStatus();");

const BOTH = (src) => UNSCOPE(UNDEFER(src));

const INJECT =
	"\t\tinit: init,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tgetLibrary: function () { return library; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom, setProp: setProp,\n" +
	"\t\tcompleteEdit: completeEdit, saveToStorage: saveToStorage, flushSave: flushSave,\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tprojectKey: projectKey,\n" +
	"\t\trefreshScenarioMarks: refreshScenarioMarks,\n" +
	"\t\tnodeClasses: function (id) { return nodeEls[id] ? nodeEls[id].circle.getAttribute('class') : null; },\n" +
	"\t\tlinkClasses: function (id) { return linkEls[id] ? linkEls[id].line.getAttribute('class') : null; }\n";

setUnitSet('us');
// init() needs these, exactly as boot-clean-harness.js does. The 2 s map-sizing failsafe and the
// next-frame re-measure are real timers on a real page; here they would fire behind the test's
// back, so the frame callback is a no-op and the timers are the node ones.
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// A 14 x 14 grid: 196 nodes and 364 pipes, 560 elements -- comfortably past the 400 Declan
// measured on, and past the size Tom's own projects reach.
const SP = 100;
function buildPage(mutate) {
	const L = loadLoopedNetwork(INJECT, null, mutate);
	L.init();
	const ids = [];
	for (let r = 0; r < 14; r++) {
		ids[r] = [];
		for (let c = 0; c < 14; c++) {
			const nd = L.addNode(r === 0 && c === 0 ? 'reservoir' : 'junction', c * SP, r * SP);
			if (nd.elev !== undefined) { nd.elev = 100 + ((r * 8 + c) % 13) * 3; }
			if (nd.demand !== undefined) { nd.demand = 10 + ((r * 3 + c * 5) % 11); }
			ids[r][c] = nd.id;
		}
	}
	for (let r = 0; r < 14; r++) {
		for (let c = 0; c < 14; c++) {
			if (c + 1 < 14) { L.addLink('pipe', ids[r][c], ids[r][c + 1]); }
			if (r + 1 < 14) { L.addLink('pipe', ids[r][c], ids[r + 1][c]); }
		}
	}
	L.buildDom();

	// The write counter goes on the stub's own localStorage, so it counts the real call
	// writeJSON() makes. Only the OPEN PROJECT's key is counted: the index is a handful of bytes
	// and is not what Task 706 is about.
	const store = global.localStorage;
	const key = L.projectKey(L.getLibrary().openId);
	const realSet = store.setItem.bind(store);
	const counts = { writes: 0, bytes: 0 };
	store.setItem = function (k, v) {
		if (k === key) { counts.writes++; counts.bytes = String(v).length; }
		return realSet(k, v);
	};
	function stored() {
		const raw = store.getItem(key);
		return raw ? JSON.parse(raw) : null;
	}
	// **THE TABLES PANE'S OWN DOOR.** A typed cell reaches completeEdit({el, prop}) through
	// paneCommitCell(); going through it rather than calling afterPropertyEdit() by hand is what
	// makes this a test of the gesture and not of one function.
	function typeCell(el, prop, v) {
		L.setProp(el, prop, v);
		L.completeEdit({ el: el, prop: prop });
	}
	// The switch OFF, because that is the state Tom works in and the state in which a save is the
	// ONLY thing an edit costs. With it on, a solve would also be scheduled and would carry a save
	// of its own -- correct, and it would hide what is being measured here.
	L.settings().autoRun = false;
	counts.writes = 0;
	return { L, counts, stored, typeCell, key, doc: L.getDoc() };
}

(async function () {
	console.log('=== Task 706: save the entry at hand, not the whole project ===');
	const p = buildPage();
	console.log('    fixture: ' + p.doc.nodes.length + ' nodes, ' + p.doc.links.length + ' links');

	// ---- 1. THE BURST COSTS ONE WRITE ---------------------------------------------------------
	console.log('\n-- twenty cells typed down a column --');
	const pipes = p.doc.links.slice(0, 20);
	pipes.forEach(function (l, i) { p.typeCell(l, 'roughness', 120 + i); });
	ok('typing a cell writes NOTHING to storage there and then', p.counts.writes === 0,
		p.counts.writes + ' writes');
	await wait(450);
	ok('the pause writes the project ONCE for all twenty cells', p.counts.writes === 1,
		p.counts.writes + ' writes');
	const back = p.stored();
	const lastId = pipes[19].id;
	ok('and the last cell typed is in what landed',
		back.links.some(function (l) { return l.id === lastId && l._roughness === 139; }));
	ok('...as is the first', back.links.some(function (l) { return l.id === pipes[0].id && l._roughness === 120; }));

	// A second burst, to be sure the timer re-arms rather than firing once for the life of the page.
	p.counts.writes = 0;
	p.typeCell(pipes[0], 'roughness', 99);
	await wait(450);
	ok('a second burst is saved too', p.counts.writes === 1 &&
		p.stored().links.some(function (l) { return l.id === pipes[0].id && l._roughness === 99; }));

	// ---- 2. NOTHING CAN BE LOST ---------------------------------------------------------------
	//
	// The failure this repair has to be proved against: type a cell, and the page goes away before
	// the pause elapses. Each door is tried on a value typed a moment earlier and never otherwise
	// written.
	console.log('\n-- the page goes away before the pause elapses --');
	async function leaveBy(name, fire, value) {
		p.counts.writes = 0;
		p.typeCell(pipes[1], 'roughness', value);
		ok(name + ': nothing written yet', p.counts.writes === 0);
		fire();
		ok(name + ' writes the project', p.counts.writes === 1, p.counts.writes + ' writes');
		ok(name + ' carries the cell typed a moment ago',
			p.stored().links.some(function (l) { return l.id === pipes[1].id && l._roughness === value; }));
		// And the timer is spent: the flush must not be followed by a second write.
		await wait(450);
		ok(name + ' leaves no write owed afterwards', p.counts.writes === 1, p.counts.writes + ' writes');
	}
	await leaveBy('pagehide', function () {
		global.window.dispatchEvent({ type: 'pagehide' });
	}, 141);
	await leaveBy('the tab going hidden', function () {
		global.document.hidden = true;
		global.document.dispatchEvent({ type: 'visibilitychange' });
		global.document.hidden = false;
	}, 142);
	await leaveBy('beforeunload', function () {
		global.window.dispatchEvent({ type: 'beforeunload', preventDefault: function () {} });
	}, 143);
	await leaveBy('a deliberate save (Export, a tab switch, closing a project)', function () {
		p.L.saveToStorage();
	}, 144);

	// A glance away with nothing owed must cost nothing -- `visibilitychange -> hidden` fires on an
	// ordinary tab switch, which is the objection to hanging anything expensive off it.
	p.counts.writes = 0;
	global.document.hidden = true;
	global.document.dispatchEvent({ type: 'visibilitychange' });
	global.document.hidden = false;
	global.window.dispatchEvent({ type: 'pagehide' });
	ok('a glance away with nothing typed writes nothing at all', p.counts.writes === 0,
		p.counts.writes + ' writes');

	// ---- 3. ONE ELEMENT IS MARKED, NOT ALL OF THEM --------------------------------------------
	//
	// The marks themselves must not move: what makes the narrower pass safe to believe is that the
	// element it touches ends up in exactly the state the whole-drawing pass would have left it in,
	// and every other element ends up untouched.
	console.log('\n-- the scenario marks --');
	const target = p.doc.links[5];
	p.typeCell(target, 'roughness', 133);
	const afterEdit = p.doc.links.map(function (l) { return p.L.linkClasses(l.id); })
		.concat(p.doc.nodes.map(function (n) { return p.L.nodeClasses(n.id); }));
	p.L.refreshScenarioMarks();
	const afterFull = p.doc.links.map(function (l) { return p.L.linkClasses(l.id); })
		.concat(p.doc.nodes.map(function (n) { return p.L.nodeClasses(n.id); }));
	let differ = 0;
	for (let i = 0; i < afterFull.length; i++) { if (afterEdit[i] !== afterFull[i]) { differ++; } }
	ok('a committed cell leaves every element marked exactly as the whole-drawing pass would',
		differ === 0, differ + ' of ' + afterFull.length + ' differ');

	// That the marks are RIGHT is the assertion above; that the pass is NARROW is asserted by the
	// live mutation in group 5, which counts how many elements one committed cell marks.
	ok('the fixture is big enough for the difference to matter',
		p.doc.nodes.length + p.doc.links.length === 560,
		(p.doc.nodes.length + p.doc.links.length) + ' elements');

	// ---- 4. THE MEASUREMENT --------------------------------------------------------------------
	console.log('\n-- before and after, same machine, same document, same gestures --');
	// **MEDIAN, NOT MEAN, AND ONE UNTIMED PASS FIRST.** This process is sharing a machine with
	// whatever else is on it, and a single slow cell -- a garbage collection landing inside one --
	// moves a mean of forty by more than the whole effect being measured. The median says what a
	// typical cell costs, which is the question.
	function perCellMs(page, n) {
		const links = page.doc.links.slice(0, n);
		links.forEach(function (l) { page.typeCell(l, 'roughness', 111); });   // warm, untimed
		const ms = links.map(function (l, i) {
			const t0 = process.hrtime.bigint();
			page.typeCell(l, 'roughness', 150 + (i % 7));
			return Number(process.hrtime.bigint() - t0) / 1e6;
		}).sort(function (a, b) { return a - b; });
		return ms[Math.floor(ms.length / 2)];
	}
	// Three configurations, so the two repairs are attributed rather than lumped: the page as
	// Declan found it, the page with only the whole-map mark scan still in it, and the page as it
	// ships now.
	const before = buildPage(BOTH);
	before.L.settings().autoRun = false;
	const marksOnly = buildPage(UNSCOPE);
	marksOnly.L.settings().autoRun = false;
	const beforeMs = perCellMs(before, 40);
	const marksMs = perCellMs(marksOnly, 40);
	const afterMs = perCellMs(p, 40);
	console.log('    before  -- whole project written, whole map re-marked: ' + beforeMs.toFixed(3) + ' ms');
	console.log('    partway -- write deferred, whole map still re-marked:  ' + marksMs.toFixed(3) + ' ms');
	console.log('    after   -- nothing until the pause, one element marked:' + afterMs.toFixed(3) + ' ms');
	console.log('    (and the deferred write, once per pause, serialises ' + p.counts.bytes + ' characters)');
	ok('a committed cell costs less than it did', afterMs < beforeMs,
		afterMs.toFixed(3) + ' ms vs ' + beforeMs.toFixed(3) + ' ms');
	ok('...and deferring the write is most of that', marksMs < beforeMs,
		marksMs.toFixed(3) + ' ms vs ' + beforeMs.toFixed(3) + ' ms');

	// ---- 5. THE MUTATIONS -----------------------------------------------------------------------
	//
	// Each repair is removed from the shipped source in turn, and the assertions that hold it are
	// required to FAIL. Without this, deleting either one would leave this file green.
	console.log('\n-- live mutations: the page as Declan found it --');
	{
		const m = buildPage(UNDEFER);
		m.L.settings().autoRun = false;
		m.counts.writes = 0;
		m.doc.links.slice(0, 20).forEach(function (l, i) { m.typeCell(l, 'roughness', 120 + i); });
		bad('typing a cell writes nothing there and then', m.counts.writes === 0,
			m.counts.writes + ' whole-project writes for twenty cells');
		await wait(450);
		bad('twenty cells cost one write', m.counts.writes === 1, m.counts.writes + ' writes');
	}
	{
		// The marks mutation. With the whole-drawing scan back, the NUMBERS are identical -- that
		// is why it was invisible -- so what the mutation has to be caught by is the count of
		// elements visited, which is the cost. hasDisplayedOverride() is the per-element question
		// the scan asks, so counting its calls counts the scan.
		let calls = 0;
		const m = buildPage(function (src) {
			return BOTH(src).replace("\tfunction applyScenarioMarks(el) {",
				"\tfunction applyScenarioMarks(el) { if (global.__lpnMarkCount) { global.__lpnMarkCount(); }");
		});
		m.L.settings().autoRun = false;
		global.__lpnMarkCount = function () { calls++; };
		m.typeCell(m.doc.links[5], 'roughness', 133);
		bad('one committed cell marks ONE element', calls <= 1, calls + ' elements marked');
		global.__lpnMarkCount = null;
	}
	{
		let calls = 0;
		const m = buildPage(function (src) {
			return src.replace("\tfunction applyScenarioMarks(el) {",
				"\tfunction applyScenarioMarks(el) { if (global.__lpnMarkCount) { global.__lpnMarkCount(); }");
		});
		m.L.settings().autoRun = false;
		global.__lpnMarkCount = function () { calls++; };
		m.typeCell(m.doc.links[5], 'roughness', 133);
		global.__lpnMarkCount = null;
		ok('...and the shipped page marks exactly one', calls === 1, calls + ' elements marked');
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall assertions passed');
	process.exit(fails ? 1 : 0);
})();
