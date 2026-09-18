// THE TWO CUSTOMER GESTURES, DRIVEN IN A REAL CHROME -- ROADMAP Task 247. Run with:
//   SCRIPT=$PWD/dev/lpn-spike/browser-customer-grip-probe.js \
//     PAGE=http://127.0.0.1:8088/engcalcs/Looped-Network.php node dev/lpn-spike/browser-drive.js
//
// **WHY A BROWSER AND NOT THE STUB.** customer-grip-harness.js asserts the same two gestures
// headlessly and is the one that runs in check_all.sh. What it cannot see is the half of a gesture
// that lives in the browser: whether a press actually lands on the grip's own element rather than
// on the pipe's wide stroke underneath it, whether `visibility="hidden"` really takes the band off
// the screen, and whether the drag keeps following the grip once the pointer has left it. Every one
// of those is a hit test or a paint, and the stub has neither -- it is handed the target a harness
// chose. It was worth driving: the stack under the grip really is
// `lpn-custhandle | lpn-link | lpn-link-hit`, so the grip wins a press over the pipe it is drawn
// on, which is a fact about paint order that no headless assertion could have established.
//
// **IT DRAWS ITS OWN FIXTURE, AND THE PROFILE MUST BE FRESH.** A page remembers its project, so a
// second run against a browser left over from the first starts on the network the first one drew --
// which is how an early version of this probe read a service line belonging to a customer it had
// not placed and reported a drag that had moved nothing. browser-drive.js wipes the profile at
// launch, but if a Chrome is ALREADY listening on its port it attaches to that one instead, so kill
// strays before trusting a run.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

module.exports = async function ({ send, evaluate, logs, sleep }) {
	await send('Page.navigate', { url: process.env.PAGE });
	// **POLLED, NOT SLEPT.** A fresh profile has no cache, so the first load of this page is slow
	// and variable; a fixed wait made the probe report "no toolbar" about a page that came up half
	// a second later. Bounded, so a page that genuinely never comes up still ends the run.
	for (let i = 0; i < 40; i++) {
		if (await evaluate("!!document.querySelector('[data-tool=\"add-meter\"]')")) { break; }
		await sleep(500);
	}
	await sleep(500);

	let fails = 0;
	function ok(name, cond, extra) {
		console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
		if (!cond) { fails++; }
	}
	async function click(x, y) {
		await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1, buttons: 1 });
		await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1, buttons: 0 });
		await sleep(140);
	}
	// **A PLACEMENT OPENS THE NEW ELEMENT'S PROPERTY BOX, AND ESCAPE IS NOT THE WAY OUT OF IT
	// HERE**: Escape also leaves the tool, so a probe that pressed it placed one junction and then
	// clicked four times in Select. The tool button is pressed again before each placement instead,
	// which is what a person does when they notice the tool has dropped.
	// **EVERY PLACEMENT IS VERIFIED AND RETRIED**, which is what makes this probe repeatable. Two
	// things get in the way of a scripted press on this page and both are correct behaviour: a
	// placement opens the new element's property box, which can cover the next point the probe wants
	// to press, and Escape closes that box by ALSO leaving the tool. So each gesture closes the box
	// through its own X, checks that the drawing actually gained what it asked for, and tries again
	// if it did not.
	async function nodeCount() { return await evaluate("document.querySelectorAll('.lpn-node').length"); }
	async function linkCount() { return await evaluate("document.querySelectorAll('.lpn-link').length"); }
	async function shutPopup() {
		const at = await evaluate(`(function () {
			var b = document.getElementById('lpn_popup_close');
			if (!b || !b.offsetParent) { return null; }
			var q = b.getBoundingClientRect();
			return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
		})()`);
		if (at) { await click(at.x, at.y); }
	}
	async function placeJunction(x, y) {
		for (let i = 0; i < 4; i++) {
			const was = await nodeCount();
			await shutPopup();
			await tool('add-junction');
			await click(x, y);
			await shutPopup();
			if (await nodeCount() > was) { return true; }
		}
		return false;
	}
	// Escape first, because a retry's leftover half-drawn pipe would take this attempt's FIRST
	// click as its own second one -- which is how an earlier run of this probe ended up with a
	// diagonal main across its own "bare map" and a band that was correct about a pipe the probe
	// did not know it had drawn.
	async function esc() {
		await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
		await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
		await sleep(120);
	}
	async function drawPipe(ax, ay, bx, by) {
		for (let i = 0; i < 4; i++) {
			const was = await linkCount();
			await esc();
			await shutPopup();
			await tool('add-pipe');
			await click(ax, ay);
			await click(bx, by);
			await shutPopup();
			if (await linkCount() > was) { return true; }
		}
		return false;
	}
	async function moveTo(x, y, buttons) {
		await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: buttons || 0 });
		await sleep(110);
	}
	// A toolbar button by the MODE it sets, asked of the page rather than assumed from an order.
	async function tool(mode) {
		const r = await evaluate(`(function () {
			var b = document.querySelector('[data-tool="' + ${JSON.stringify(mode)} + '"]');
			if (!b) { return null; }
			var q = b.getBoundingClientRect();
			return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
		})()`);
		if (!r) { return false; }
		await click(r.x, r.y);
		return true;
	}
	function svcOf(id) {
		return `(function () {
			var s = document.querySelector('.lpn-service[data-cust="' + ${JSON.stringify(id)} + '"]');
			return s ? { x1: +s.getAttribute('x1'), y1: +s.getAttribute('y1'),
				x2: +s.getAttribute('x2'), y2: +s.getAttribute('y2') } : null;
		})()`;
	}

	// **A FIRST VISIT OPENS THE EXAMPLES BOX, AND IT IS OVER THE TOOLBAR.** With a wiped profile
	// every run is a first visit, so the probe's first four clicks were landing in that box and the
	// drawing stayed empty while every assertion below reported the symptom rather than the cause.
	// It is dismissed through its OWN control -- the "start with a blank map" button -- because
	// that is the door a first-time visitor uses, and Escape does not close it.
	for (let i = 0; i < 6; i++) {
		const at = await evaluate(`(function () {
			var b = document.querySelector('.lpn-examples-blank');
			if (b && !b.offsetParent) { return null; }
			if (!b || !b.getBoundingClientRect().width) { return null; }
			var q = b.getBoundingClientRect();
			return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
		})()`);
		if (!at) { break; }
		await click(at.x, at.y);
		await sleep(300);
	}
	ok('the welcome box is out of the way',
		!(await evaluate("(function () { var g = document.querySelector('.lpn-examples-grid'); return !!(g && g.offsetParent); })()")));

	const haveTools = await evaluate("!!document.querySelector('[data-tool=\"add-meter\"]')");
	ok('the page came up with a toolbar that names its modes', !!haveTools);
	if (!haveTools) { console.log('\nCannot drive this page; stopping.'); process.exitCode = 1; return; }
	// **IT DOES NOT REQUIRE A BLANK PROJECT.** The page remembers the last one, and a run that
	// attaches to a browser left over from an earlier run inherits that drawing -- so the fixture is
	// built in a region this probe first checks is bare map, and everything below is asked about
	// ITS OWN customer by id rather than about whatever else is on the screen.

	// Two parallel mains, drawn through the page's own tools.
	const TOPY = 420, BOTY = 740, LEFT = 400, RIGHT = 1000;
	const madeNodes = (await placeJunction(LEFT, TOPY)) && (await placeJunction(RIGHT, TOPY))
		&& (await placeJunction(LEFT, BOTY)) && (await placeJunction(RIGHT, BOTY));
	ok('four junctions went down where this probe asked for them', madeNodes);
	const madePipes = (await drawPipe(LEFT, TOPY, RIGHT, TOPY)) && (await drawPipe(LEFT, BOTY, RIGHT, BOTY));
	ok('...and two mains joined them', madePipes);
	await esc();
	await shutPopup();
	const nLinks = await linkCount();
	ok('...and exactly two, so the map between them really is bare', nLinks === 2, 'links: ' + nLinks);

	const MIDX = (LEFT + RIGHT) / 2;
	const mains = await evaluate('(function () {'
		+ 'function at(x, y) { var e = document.elementFromPoint(x, y); return e && e.getAttribute("class"); }'
		+ 'return { top: at(' + MIDX + ', ' + TOPY + '), bot: at(' + MIDX + ', ' + BOTY + ') }; })()');
	ok('two mains were drawn through the real toolbar',
		/lpn-link/.test(String(mains.top)) && /lpn-link/.test(String(mains.bot)), JSON.stringify(mains));

	// The house between the two mains, nearer the top one, and a point well clear of both.
	const HOUSE = { x: 700, y: TOPY + 90 };
	const EMPTY = { x: 700, y: (TOPY + BOTY) / 2 };

	// ---- 1. THE PLACEMENT BAND ----------------------------------------------------------------
	await tool('add-meter');
	await click(HOUSE.x, HOUSE.y);
	await moveTo(EMPTY.x, EMPTY.y);
	const bare = await evaluate('(function () { var e = document.elementFromPoint(' + EMPTY.x + ', ' + EMPTY.y + '); return e && e.id; })()');
	ok('the point between the mains is bare map', bare === 'lpn_canvas', String(bare));
	const overEmpty = await evaluate(`(function () {
		var b = document.querySelector('.lpn-meter-band');
		return !b ? 'none' : b.getAttribute('visibility'); })()`);
	ok('over bare map the placement band is not on the screen',
		overEmpty === 'hidden', String(overEmpty));

	await moveTo(RIGHT - 80, TOPY);
	const band = await evaluate(`(function () {
		var b = document.querySelector('.lpn-meter-band');
		if (!b || b.getAttribute('visibility') === 'hidden') { return null; }
		return { x2: +b.getAttribute('x2'), y2: +b.getAttribute('y2') }; })()`);
	ok('over the main a band appears', !!band, JSON.stringify(band));
	const houseX = await evaluate(`(function () {
		var m = document.querySelector('.lpn-meter-pending');
		return m ? +m.getAttribute('cx') : null; })()`);
	ok('...ending square to the main above the house, not under a pointer 80px away',
		!!band && houseX !== null && Math.abs(band.x2 - houseX) < 0.5,
		band ? band.x2 + ' vs house ' + houseX : 'no band');

	await click(RIGHT - 80, TOPY);
	const madeId = await evaluate(`(function () {
		var m = document.querySelector('.lpn-meter[data-cust]');
		return m ? m.dataset.cust : null; })()`);
	ok('the second press makes a customer', !!madeId, String(madeId));

	// ---- 2. THE CONNECTION GRIP ---------------------------------------------------------------
	await tool('select');
	await click(HOUSE.x, HOUSE.y);
	const grip = await evaluate(`(function () {
		var g = document.querySelector('.lpn-custhandle');
		if (!g) { return null; }
		var q = g.getBoundingClientRect();
		return { x: q.left + q.width / 2, y: q.top + q.height / 2,
			stroke: getComputedStyle(g).stroke, id: g.dataset.custhandle }; })()`);
	ok('selecting a customer draws a grip on its connection', !!grip, JSON.stringify(grip));
	if (!grip) { console.log('\nNo grip; stopping.'); process.exitCode = 1; return; }
	ok('...and it is the selection colour rather than a red warning',
		/25, 118, 210/.test(grip.stroke || ''), grip.stroke);
	const dotFill = await evaluate(`(function () {
		var d = document.querySelector('.lpn-meter.lpn-selected');
		return d ? getComputedStyle(d).fill : null; })()`);
	ok('...and the customer itself is a highlighted dot',
		/25, 118, 210/.test(String(dotFill)), String(dotFill));
	// The grip wins a press over the pipe it is drawn on top of. This is the one thing only a
	// browser can answer, and it is what makes the whole gesture reachable at all.
	const stack = await evaluate(`(function () {
		return document.elementsFromPoint(${Math.round(grip.x)}, ${Math.round(grip.y)})
			.slice(0, 3).map(function (e) { return e.getAttribute('class'); }).join(' | '); })()`);
	ok('...and the browser puts the grip ON TOP of the pipe under it',
		/^lpn-custhandle/.test(String(stack)), String(stack));

	// **WHICH END OF THE SERVICE IS WHICH IS ASKED, NOT ASSUMED.** The first version of this probe
	// read x1/y1 as the house end; it is the ATTACHMENT end, and the reversal made a correct drag
	// report that nothing had moved. The house end is the one at the meter's own symbol.
	async function ends() {
		const s = await evaluate(svcOf(grip.id));
		const dot = await evaluate(`(function () {
			var d = document.querySelector('.lpn-meter[data-cust="' + ${JSON.stringify(grip.id)} + '"]');
			return d ? { x: +d.getAttribute('cx'), y: +d.getAttribute('cy') } : null; })()`);
		if (!s || !dot) { return null; }
		const d1 = Math.hypot(s.x1 - dot.x, s.y1 - dot.y), d2 = Math.hypot(s.x2 - dot.x, s.y2 - dot.y);
		return d1 < d2
			? { house: { x: s.x1, y: s.y1 }, attach: { x: s.x2, y: s.y2 } }
			: { house: { x: s.x2, y: s.y2 }, attach: { x: s.x1, y: s.y1 } };
	}
	const before = await ends();
	await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: grip.x, y: grip.y, button: 'left', clickCount: 1, buttons: 1 });
	await moveTo(HOUSE.x, EMPTY.y, 1);
	const mid = await ends();
	ok('over open ground between the two mains the service has not moved',
		!!mid && JSON.stringify(mid) === JSON.stringify(before),
		JSON.stringify(before) + ' -> ' + JSON.stringify(mid));

	await moveTo(HOUSE.x, BOTY, 1);
	const onNew = await ends();
	ok('arriving at the second main re-serves the customer from it',
		!!onNew && !!before && onNew.attach.y !== before.attach.y,
		JSON.stringify(onNew) + '  was ' + JSON.stringify(before));
	ok('...square to that main, at the house own x rather than the pointer one',
		!!onNew && Math.abs(onNew.attach.x - onNew.house.x) < 0.5,
		onNew ? onNew.attach.x + ' vs ' + onNew.house.x : 'none');
	ok('...and the house itself has not moved at all',
		!!onNew && !!before && JSON.stringify(onNew.house) === JSON.stringify(before.house),
		onNew ? JSON.stringify(onNew.house) + ' was ' + JSON.stringify(before.house) : 'none');
	await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: HOUSE.x, y: BOTY, button: 'left', buttons: 0 });
	await sleep(250);
	const dropped = await ends();
	ok('the drop leaves it on the main it arrived at',
		!!dropped && JSON.stringify(dropped) === JSON.stringify(onNew), JSON.stringify(dropped));

	logs.filter(l => /EXCEPTION/.test(l)).forEach(l => { console.log('  ' + l); fails++; });
	console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nAll browser customer-grip checks passed.');
	if (fails) { process.exitCode = 1; }
};
