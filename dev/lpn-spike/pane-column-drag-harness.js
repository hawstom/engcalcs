// A COLUMN CAN BE RESIZED AND MOVED, AND NEITHER GOES IN THE FILE. Run with:
//   node dev/lpn-spike/pane-column-drag-harness.js
//
// Tom's spreadsheet specification, 2026-09-18, points (d) and (e): *"Each column's width can be
// adjusted by clicking on the divider line between column headings"* and *"Columns can be dragged
// left and right using their headings."*
//
// **THE ASSERTION THAT IS NOT ABOUT SPREADSHEETS AT ALL IS THE IMPORTANT ONE**: neither the width
// nor the order may reach `serializeProject()`. Both are window furniture under the Task 584 rule --
// a fact about the screen somebody is sitting at -- and a leak is invisible to whoever caused it,
// because on their own machine it restores the layout they already had. It shows up only for the
// colleague who opens the file on a laptop. `lpn_furniture_check.php` holds the same line from the
// other side, by reading the page's localStorage writes; this holds it by driving the real gesture
// and then reading the real serializer.
//
// **WHAT THIS CANNOT SEE, SAID PLAINLY:** whether the result LOOKS right. A <colgroup> width and a
// CSS grip are pixels, and there are none here. What is asserted is the state -- the stored em, the
// <col> that carries it, the column order the renderer then produces -- which is everything except
// the picture. The picture needs his browser.

'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tcolKeys: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\twidthEm: function (id, key) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneColWidthEm(s.id, paneColByKey(s, key)); },\n" +
	"\t\tuserWidth: function (id, key) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneColUserWidth(s.id, paneColByKey(s, key)); },\n" +
	"\t\tfloorEm: function (id, key) { return paneColFloorEm(paneColByKey(paneTableById(id), key)); },\n" +
	"\t\tresetWidth: function (id, key) { paneResetColOnDouble(paneTableById(id), key, null); },\n" +
	"\t\tcolGroup: function (id) { return paneTableById(id).colGroup; },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\tserialize: serializeProject, prefsKey: LPN_PANECOLS_KEY,\n" +
	"\t\thide: function (id, key, on) { paneSetColHidden(paneTableById(id), key, on); },\n" +
	"\t\tholdMs: PANE_COL_DRAG_HOLD_MS,\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0)].map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
L.openPane('junctions');
L.renderTable('junctions');

const host = byId.lpn_pane_junctions;
function table() { return host.children.filter((c) => c._tag === 'table')[0]; }
function thead() { return table().children.filter((c) => c._tag === 'thead')[0]; }
function ths() { return thead().children[0].children; }
function thFor(key) { return ths().filter((t) => t._lpnColKey === key)[0]; }
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function docFire(type, ev) {
	((global.document._listeners && global.document._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
// The grip and the heading button, as the browser hands them over.
// **A HEADING IS DRAWN AT ITS COLUMN'S WIDTH**, which is the one physical relationship a drag now
// reads (R-110: the drag starts from the width on screen). The stub's default rect is 1000 px wide
// for everything, which would make every column start a drag 62 em wide. `drawn` overrides the
// modelled width for one heading, to stand for a browser that laid it out wider or narrower than
// the column declares -- which is exactly the case the blind spot was about.
const drawn = {};
function modelHeadingWidths() {
	ths().forEach((th) => {
		th.getBoundingClientRect = () => {
			const em = drawn[th._lpnColKey] || L.widthEm('junctions', th._lpnColKey) || 7;
			return { left: 0, top: 0, right: em * 16, bottom: 20, width: em * 16, height: 20 };
		};
	});
}
function gripOf(key) {
	modelHeadingWidths();
	return thFor(key).children.filter((c) => c.className === 'lpn-pane-colgrip')[0];
}
function sortBtnOf(key) { return thFor(key).children.filter((c) => String(c.className || '').indexOf('lpn-pane-sort') === 0)[0]; }
// **REAL LEFT-TO-RIGHT POSITIONS, FOR THE MOVE-DRAG TESTS BELOW** (2026-09-26, fourth pass:
// paneStartColDrag() now finds "the heading under the pointer" by comparing `clientX` against each
// heading's OWN cached `getBoundingClientRect()`, not by walking up from `event.target` -- ghost
// and insertion-marker positioning need real coordinates, and reading a fresh rect on every
// `mousemove` would force a layout the real page never does during a drag (see that function's own
// comment). `modelHeadingWidths()` above gives every heading the SAME `left: 0`, which is enough
// for the resize tests (they only ever ask about one heading's own width) but not for "which
// heading is nearest this x" -- so this lays every heading out left-to-right by its modelled width
// instead, cumulative, the way a real table row does.
function modelHeadingPositions() {
	var x = 0;
	L.colKeys('junctions').forEach(function (k) {
		var th = thFor(k), em = drawn[k] || L.widthEm('junctions', k) || 7, width = em * 16, left = x;
		th.getBoundingClientRect = function () { return { left: left, top: 0, right: left + width, bottom: 20, width: width, height: 20 }; };
		x += width;
	});
}
function centerXOf(key) {
	var r = thFor(key).getBoundingClientRect();
	return r.left + r.width / 2;
}

console.log('\n--- the heading carries both handles ---');
{
	report(!!thFor('elev'), 'a heading knows which column it is', thFor('elev') && thFor('elev')._lpnColKey);
	report(!!gripOf('elev'), 'and carries a divider grip of its own (point d)');
	report(gripOf('elev').getAttribute('aria-hidden') === 'true',
		'...hidden from a screen reader, being a pointer gesture with no word that would help');
	report(!!sortBtnOf('elev'), 'and the heading itself is the drag handle (point e)');
	const cg = L.colGroup('junctions');
	report(!!cg && cg.children.length === L.colKeys('junctions').length,
		'a <colgroup> gives one <col> per column, which is what a width hangs on',
		cg && cg.children.length + ' / ' + L.colKeys('junctions').length);
}

console.log('\n--- (d) dragging the divider resizes the column ---');
{
	const before = L.widthEm('junctions', 'elev');
	report(before > 0, 'the column starts at the width its spec declares', before);
	// 16 px to the em in the stub, so +32 px is +2 em. Driven through the real handlers.
	fire(gripOf('elev'), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 132 });
	docFire('mouseup', { clientX: 132 });
	const after = L.widthEm('junctions', 'elev');
	report(Math.abs(after - (before + 2)) < 0.01, 'a drag of two ems widens the column by two ems',
		before + ' -> ' + after);
	report(L.widthEm('junctions', 'demand') === 1 || L.widthEm('junctions', 'demand') !== after,
		'...and moves no other column', L.widthEm('junctions', 'demand'));
	// It is drawn live, not only on the next render: the <col> carries it already.
	const i = L.colKeys('junctions').indexOf('elev');
	report(L.colGroup('junctions').children[i].style.width === after + 'em',
		'the <col> carries the new width without waiting for a rebuild',
		L.colGroup('junctions').children[i].style.width);
	// **THE FLOOR IS ONE EM.** A column dragged to nothing is a column nobody can find again.
	fire(gripOf('elev'), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mouseup', { clientX: -900 });
	// **THE FLOOR IS A THIRD OF THE HEADING'S LONGEST WORD** (Tom, 2026-09-21: *"I see words
	// broken into five pieces of one or two characters each"*), which superseded one em.
	report(L.widthEm('junctions', 'elev') === L.floorEm('junctions', 'elev') && L.floorEm('junctions', 'elev') > 1,
		'a drag past nothing stops at the floor that breaks no heading word into more than three pieces',
		L.widthEm('junctions', 'elev'));
	// And it survives a rebuild, which is what "remembered" means.
	L.renderTable('junctions');
	report(L.widthEm('junctions', 'elev') === L.floorEm('junctions', 'elev'), '...and the width survives a rebuild of the table');
}

// **A PRESS THAT NEVER TRAVELS IS NOT A DRAG**, which is the whole of Tom's *"Some of the columns
// are now sized too narrow by default. I believe that Description was a single character long."*
// (2026-09-19). Nothing had leaked into the default rule; what leaked was the definition of
// "dragged". `up()` stored a width unconditionally, so a press and release on the divider -- seven
// pixels of the heading's own trailing padding, exactly where a hand aiming at a heading to sort it
// lands -- committed the column: pinned at the 7em fallback if it declared no em, and marked as the
// reader's for ever, which is what turns the heading's character-level wrapping on. One stray click
// and an untouched column opened narrow and stayed narrow across every later visit.
console.log('\n--- A PRESS THAT NEVER TRAVELS IS NOT A DRAG ---');
{
	// Start from a column nobody has touched. The section above left `elev` at one em, so forget
	// that first -- which is also the gesture the next section drives.
	L.resetWidth('junctions', 'elev');
	L.renderTable('junctions');
	const declared = L.widthEm('junctions', 'elev');
	report(L.userWidth('junctions', 'elev') === 0, 'the column is back to having no stored width');
	report(declared > 1, '...and is drawn at the width its spec declares', declared);
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') < 0,
		'...so its heading may NOT break mid-word', thFor('elev').className);
	// HIS OWN INSTANCE, BY NAME. Description is the column he found at a character, and it is the
	// one to assert because it declares the widest box in the pane (8em, a street-corner sentence):
	// a rule that narrowed it would narrow anything.
	report(L.userWidth('junctions', 'desc') === 0, 'a freshly opened table has no width stored for Description');
	report(L.widthEm('junctions', 'desc') === 8, '...so Description opens at its declared 8em',
		L.widthEm('junctions', 'desc'));
	report(String(thFor('desc').className).indexOf('lpn-pane-tight') < 0,
		'...and its heading is held open by its own longest word', thFor('desc').className);
	fire(gripOf('elev'), 'mousedown', { clientX: 400, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mouseup', { clientX: 400 });
	report(L.userWidth('junctions', 'elev') === 0,
		'a press and release on the divider stores nothing', L.userWidth('junctions', 'elev'));
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') < 0,
		'...and the heading still may not break mid-word');
	// One pixel of hand tremor is not a drag either.
	fire(gripOf('elev'), 'mousedown', { clientX: 400, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 401 });
	docFire('mouseup', { clientX: 401 });
	report(L.userWidth('junctions', 'elev') === 0, 'nor is one pixel of tremor', L.userWidth('junctions', 'elev'));
	report(L.widthEm('junctions', 'elev') === declared, '...the column has not moved at all',
		L.widthEm('junctions', 'elev'));
	// ...but a real drag still does everything it did, right down to the one-em floor.
	fire(gripOf('elev'), 'mousedown', { clientX: 400, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 300 });
	docFire('mouseup', { clientX: 300 });
	report(L.widthEm('junctions', 'elev') === L.floorEm('junctions', 'elev'), 'a real drag still reaches the narrow extreme',
		L.widthEm('junctions', 'elev'));
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') >= 0,
		'...and THAT column\'s heading breaks at the character, which is what he asked for');
}

// **AND THERE IS A WAY BACK.** A stored width outlives the session that made it, so before this a
// column squeezed to a character was a character for good -- and read, correctly from where he was
// sitting, as the table's own default.
console.log('\n--- double-clicking the divider gives the column its default back ---');
{
	report(L.userWidth('junctions', 'elev') === L.floorEm('junctions', 'elev'), 'the column starts at the narrow extreme',
		L.userWidth('junctions', 'elev'));
	fire(gripOf('elev'), 'dblclick', { stopPropagation: function () {}, preventDefault: function () {} });
	report(L.userWidth('junctions', 'elev') === 0, 'a double-click on the divider forgets the stored width');
	report(L.widthEm('junctions', 'elev') > 1, '...so the column is back at its declared default',
		L.widthEm('junctions', 'elev'));
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') < 0,
		'...and its heading stops breaking mid-word');
	L.renderTable('junctions');
	report(L.userWidth('junctions', 'elev') === 0, '...and it stays forgotten across a rebuild');
}

// **THE BLIND SPOT, AND IT WAS THE COLUMNS HE NAMED** (Tom, 2026-09-21, R-110: *"Pumps.Date
// installed, width = 1em; Pumps.Pump head curve, width = 2 em (due to selector?); Pump.Price
// pattern, width = 3em (due to selector?)"*). A pull-down and a custom property declare no width,
// so the drag assumed 7em; a column whose heading has outgrown its declared em was assumed to be
// the declared em. Either way the first pixel of travel snapped the column to a width the reader
// had never seen. It must start from what is drawn.
console.log('\n--- R-110: a drag starts from the width on screen ---');
{
	L.resetWidth('junctions', 'elev');
	L.renderTable('junctions');
	const declared = L.widthEm('junctions', 'elev');
	drawn.elev = declared + 1.5;   // the heading holds the column open 1.5 em past what it declares
	fire(gripOf('elev'), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 116 });
	docFire('mouseup', { clientX: 116 });
	report(Math.abs(L.widthEm('junctions', 'elev') - (declared + 2.5)) < 0.01,
		'a column drawn wider than it declares widens from where it is drawn, not from its declaration',
		declared + ' declared, ' + drawn.elev + ' drawn, +1 em -> ' + L.widthEm('junctions', 'elev'));
	delete drawn.elev;
	L.resetWidth('junctions', 'elev');
	L.renderTable('junctions');
	// A column declaring NO width -- the pull-down and custom-property case -- was assumed to be
	// 7em. Drawn at 5.9em (a pattern pull-down, measured in Chromium), a one-em narrowing is 4.9.
	const noEm = L.colKeys('junctions').filter((k) => !L.widthEm('junctions', k))[0];
	report(!!noEm, 'the junction table has a column that declares no width to test with', noEm);
	if (noEm) {
		drawn[noEm] = 5.9;
		fire(gripOf(noEm), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
		docFire('mousemove', { clientX: 84 });
		docFire('mouseup', { clientX: 84 });
		report(Math.abs(L.widthEm('junctions', noEm) - 4.9) < 0.01,
			'a column that declares no width narrows from its drawn 5.9 em, not from a 7 em guess',
			'-1 em -> ' + L.widthEm('junctions', noEm));
		delete drawn[noEm];
		L.resetWidth('junctions', noEm);
		L.renderTable('junctions');
	}
}

// **THE FIFTH PASS'S DRAG, RULE BY RULE** (Tom, 2026-09-26): *"Sometimes mere clicking (tiny
// drag?) drags a column... we need to wait for a 'long click' for a drag or a move of at least 1/2
// column width"*; *"you can't drag a column to its own left or right edge; that is a do-nothing
// case"*; *"a wide black or dark gray destination line on entire column (not heading) divider when
// middle of drag rectangle (not cursor) is between middle of two columns"*. Driven through the real
// <th> mousedown and the real document listeners, over headings laid out left to right.
// dev/browser-pass/specs/colselect.js holds the same rules in real Chromium, with real pixels.
function bodyEl(cls) { return (global.document.body.children || []).filter((c) => c.className === cls)[0] || null; }
function ghostEl() { return bodyEl('lpn-pane-col-ghost'); }
function markerEl() { return bodyEl('lpn-pane-col-marker'); }
function markerShown() { const m = markerEl(); return !!m && m.style.display !== 'none'; }
function rectOf(key) { return thFor(key).getBoundingClientRect(); }
function spec() { return L.paneTableById('junctions'); }
// A browser dispatches the click that follows a drag's mouseup in the same task; the stub runs
// synchronously, so the drag's own zero-delay reset of that flag has not run yet. Clear it the way
// the click would have consumed it, so the next section's clicks are real clicks.
function afterDrop() { spec().headDragged = false; }
function press(key, x) { fire(thFor(key), 'mousedown', { button: 0, clientX: x, clientY: 10 }); }
function moveTo(x) { docFire('mousemove', { clientX: x, clientY: 10 }); }
function release() { docFire('mouseup', {}); afterDrop(); }

console.log('\n--- a press is a click until it travels half its own column ---');
{
	L.renderTable('junctions');
	modelHeadingPositions();
	const before = L.colKeys('junctions'), from = before[3], r = rectOf(from), cx = r.left + r.width / 2;
	press(from, cx);
	moveTo(cx + r.width / 2 - 1);
	report(!ghostEl() && !markerEl(), 'a travel just short of half the column draws nothing -- still a click',
		'moved ' + (r.width / 2 - 1) + ' of ' + r.width + ' px');
	report(!global.document.body.classList.contains('lpn-pane-col-dragging'), '...and the page is not in a drag');
	moveTo(cx + 40);
	release();
	report(L.colKeys('junctions').join() === before.join(),
		'...and releasing it (even having crossed into the next heading by pixels) moves nothing',
		'moved 40 px of a ' + r.width + ' px column');
	press(from, cx);
	moveTo(cx - r.width / 2);
	report(!!ghostEl() && global.document.body.classList.contains('lpn-pane-col-dragging'),
		'half the column\'s width is the moment it becomes a drag: the ghost is drawn');
	release();
	report(L.colKeys('junctions').join() === before.join(), '...and dropped there, at its own edge, nothing moved');
	report(!ghostEl() && !markerEl(), '...and the ghost and marker are gone on release');
}

console.log('\n--- no marker at a column\'s own edges; the ghost\'s MIDDLE decides ---');
{
	L.renderTable('junctions');
	modelHeadingPositions();
	const before = L.colKeys('junctions'), i = 3, from = before[i], right = before[i + 1], left = before[i - 1];
	const r = rectOf(from), rr = rectOf(right), rl = rectOf(left);
	// Picked up near its RIGHT edge, so the ghost's middle trails the pointer by nearly half a column.
	const grabX = r.right - 2, trail = (r.width / 2) - 2;
	press(from, grabX);
	moveTo(grabX + r.width / 2 + 1);    // a drag now, ghost still over its own slot
	report(!!ghostEl(), 'the drag has begun');
	report(!markerShown(), 'with the ghost over its own slot there is no marker (its own right edge is a do-nothing)');
	const ptrPast = rr.left + rr.width / 2 + 4;   // the POINTER is past the neighbour's middle...
	moveTo(ptrPast);
	report(ptrPast - trail < rr.left + rr.width / 2, '(the ghost\'s middle, ' + (ptrPast - trail) + ', is still short of the neighbour\'s, ' + (rr.left + rr.width / 2) + ')');
	report(!markerShown(), '...so there is still no marker: the pointer passing the middle is not enough');
	moveTo(rr.left + rr.width / 2 + trail + 1);   // ...and now the GHOST's middle is past it
	report(markerShown(), 'once the ghost\'s middle passes the right neighbour\'s middle, the marker appears');
	const m = markerEl(), g = ghostEl();
	report(Math.abs(parseFloat(m.style.left) + 2 - rr.right) < 0.01,
		'...on the divider after that neighbour -- where the column will land', m.style.left + ' vs ' + rr.right);
	report(m.style.top === g.style.top && m.style.height === g.style.height && parseFloat(m.style.height) >= r.height,
		'...and it spans the column\'s full height, the same as the ghost, not only the heading',
		m.style.top + ' ' + m.style.height + ' / ghost ' + g.style.top + ' ' + g.style.height);
	report(parseFloat(g.style.width) === r.width, 'the ghost is the whole column\'s width', g.style.width);
	moveTo(ptrPast);
	report(!markerShown(), 'drawn back before that middle, the marker goes again');
	release();
	report(L.colKeys('junctions').join() === before.join(), '...and dropped there, nothing moved');
	// Leftward, the same rule, and then a real drop.
	press(from, r.left + 2);
	moveTo(rl.left + rl.width / 2 - (r.width / 2 - 2) - 1);   // ghost middle just past the left neighbour's middle
	report(markerShown(), 'leftward, the marker appears once the ghost\'s middle passes the left neighbour\'s');
	report(Math.abs(parseFloat(markerEl().style.left) + 2 - rl.left) < 0.01, '...on that neighbour\'s left divider',
		markerEl().style.left + ' vs ' + rl.left);
	release();
	const after = L.colKeys('junctions');
	report(after.indexOf(from) === i - 1 && after[i] === left, 'and the drop puts the column there, one place left',
		before.indexOf(from) + ' -> ' + after.indexOf(from));
	report(after.slice().sort().join() === before.slice().sort().join(), '...the same set of columns, reordered');
	L.renderTable('junctions');
	report(L.colKeys('junctions').join() === after.join(), 'the order survives a rebuild');
}

console.log('\n--- (e) dragging ANY heading, selected or not, moves it; a group moves together ---');
{
	L.renderTable('junctions');
	modelHeadingPositions();
	const before = L.colKeys('junctions');
	const from = 'elev', to = before[before.length - 1], r = rectOf(from), rt = rectOf(to);
	press(from, r.left + r.width / 2);
	moveTo(rt.left + rt.width / 2 + 1);   // grabbed at its middle, so the ghost's middle is the pointer
	release();
	const after = L.colKeys('junctions');
	report(after.indexOf(from) === before.length - 1,
		'dragging an UNSELECTED heading past the last column\'s middle moves it to the end, in one motion',
		before.indexOf(from) + ' -> ' + after.indexOf(from));
	report(after.length === before.length && after.slice().sort().join() === before.slice().sort().join(),
		'...and no column is lost or duplicated');
	L.renderTable('junctions');
	modelHeadingPositions();
	const b2 = L.colKeys('junctions'), a1 = b2[1], a2 = b2[2], dest = b2[b2.length - 1];
	fire(thFor(a1), 'click', { ctrlKey: true });
	fire(thFor(a2), 'click', { ctrlKey: true });
	const r1 = rectOf(a1), rd = rectOf(dest), w = rectOf(a1).width + rectOf(a2).width;
	press(a1, r1.left);                         // picked up at the group's left edge
	moveTo(rd.left + rd.width / 2 - w / 2 + 1);  // the group's ghost middle just past dest's middle
	report(!!ghostEl() && Math.abs(parseFloat(ghostEl().style.width) - w) < 0.01,
		'a selected group\'s ghost is the width of the whole group', ghostEl() && ghostEl().style.width);
	release();
	const a = L.colKeys('junctions');
	report(a.indexOf(a2) === a.indexOf(a1) + 1, '...the group lands side by side, in its own order', a.indexOf(a1) + ',' + a.indexOf(a2));
	report(a.indexOf(a2) === a.length - 1, '...as a block, after the destination', a.indexOf(a2) + ' of ' + (a.length - 1));
}

console.log('\n--- a hidden column keeps its place through a drag ---');
{
	spec().headSel = [];   // the group above is still selected; this is a single-column drag
	L.renderTable('junctions');
	const full = L.colKeys('junctions'), hid = full[2];
	L.hide('junctions', hid, true);
	L.renderTable('junctions');
	modelHeadingPositions();
	const vis = L.colKeys('junctions'), from = vis[vis.length - 1], r = rectOf(from), r0 = rectOf(vis[0]);
	press(from, r.left + r.width / 2);
	moveTo(r0.left + r0.width / 2 - 1);
	release();
	L.hide('junctions', hid, false);
	L.renderTable('junctions');
	const after = L.colKeys('junctions');
	report(after[0] === from, 'the dragged column went to the front', after[0]);
	report(after.indexOf(hid) === full.indexOf(hid) + 1 && after[after.indexOf(hid) - 1] === full[full.indexOf(hid) - 1],
		'...and the column that was hidden meanwhile comes back beside the neighbour it had, not at the end',
		full.indexOf(hid) + ' -> ' + after.indexOf(hid));
}

console.log('\n--- NEITHER OF THEM IS PROJECT DATA (Task 584) ---');
{
	const text = JSON.stringify(L.serialize());
	report(text.indexOf(L.prefsKey) < 0, 'serializeProject() has never heard of the preferences key',
		L.prefsKey);
	report(text.indexOf('colWidth') < 0 && text.indexOf('colOrder') < 0 && text.indexOf('"w":') < 0,
		'...and carries no column width or order under any other name');
	report(text.indexOf('lpn_panecols') < 0, '...so a colleague on a laptop inherits neither');
}

// **A LONG PRESS IS A DRAG TOO**, without any travel -- the other door Tom named. Real time, so it
// runs last, after everything synchronous above.
(async function () {
	console.log('\n--- a hold of ' + L.holdMs + ' ms, with no travel, becomes a drag ---');
	L.renderTable('junctions');
	modelHeadingPositions();
	const k = L.colKeys('junctions')[3], r = rectOf(k);
	report(L.holdMs >= 400 && L.holdMs <= 500, 'the hold is between 400 and 500 ms', L.holdMs);
	press(k, r.left + r.width / 2);
	await new Promise((res) => setTimeout(res, L.holdMs - 150));
	report(!ghostEl(), 'short of the hold, still nothing is drawn');
	await new Promise((res) => setTimeout(res, 250));
	report(!!ghostEl() && global.document.body.classList.contains('lpn-pane-col-dragging'),
		'past the hold, the ghost is drawn with the pointer not having moved');
	release();
	report(!ghostEl(), '...and released in place it is gone again, having moved nothing');
	console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
	process.exit(failures ? 1 : 0);
}());
