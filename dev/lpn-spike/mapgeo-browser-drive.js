// THE CUSTOM GEOREFERENCE WIZARD, DRIVEN IN A REAL CHROME -- ROADMAP Task 646.
//
//   SCRIPT=dev/lpn-spike/mapgeo-browser-drive.js PAGE=http://127.0.0.1:8094/engcalcs/Looped-Network.php \
//     node dev/lpn-spike/browser-drive.js
//
// **WHY IT IS NOT IN dev/lpn-spike/xy-world-map-harness.js, which already passes.** That harness
// asserts the two things the arithmetic can be wrong about -- not one stored byte moves, and the
// drawing's own coordinates do not change -- and it asserts them through `lpn-dom-stub.js`, where
// every element is an object with no box. **A control that is in the DOM, is display:block and is
// STILL not on the screen is invisible to it by construction**, and that is the defect Tom reported
// twice on 2026-09-18: *"I don't see a slider."*
//
// MEASURED HERE, 2026-09-18, against the branch preview on port 8094:
//   1366x768, no bottom pane   -- dial rect 1266,276 87x306, wholly inside its box. Correct.
//   1366x768, 300 px pane      -- canvas box 285 px tall, dial top y=51..105, top corner
//                                 elementFromPoint = `formInput`.
//   1280x700, 340 px pane      -- canvas box 177 px tall, elementFromPoint over the TURN KNOB
//                                 returned `lpn_toolbar`. The knob was behind the toolbar.
// The dial is 306 px tall and was placed with `top: 50%` on a box whose height is the CANVAS's,
// which the bottom pane cuts at will -- **the same defect the rectangle's own rotate handle has**,
// and that handle is the reason the dial was built. mapgeoPlaceDial() clamps it; these assertions
// are what stop it coming back.
//
// It also drives the rectangle's ROTATE HANDLE through real `Input.dispatchMouseEvent` presses and
// reports what is actually under it, because a handle nothing can reach is the one thing a
// transform-level harness can never see: the arithmetic behind it is correct and never runs.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..') + path.sep;

// The fixture project: an ordinary grid drawing in feet, built through the page's own addNode/
// addLink and serialized by the page's own serializeProject(), so what is seeded into localStorage
// is a document this page wrote rather than one this file invented.
function fixtureProject() {
	const stub = require('./lpn-dom-stub.js');
	require(ROOT + 'js/lpn-georef.js');
	const L = stub.loadLoopedNetwork(
		"\t\taddNode: addNode, addLink: addLink, serialize: serializeProject,\n");
	stub.setUnitSet('us');
	const R = L.addNode('reservoir', 0, 0);
	const A = L.addNode('junction', 1234.5, -200.25);
	const B = L.addNode('junction', 2000, -800);
	R._head = 250; A._demand = 120; B._demand = 80;
	L.addLink('pipe', R.id, A.id);
	L.addLink('pipe', A.id, B.id);
	return JSON.stringify(L.serialize());
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// The four layouts, and the short ones are the point: a 1366x768 laptop with the tables pane open
// is an ordinary way to use this page, not an edge case.
const LAYOUTS = [
	{ w: 1366, h: 768, pane: 0 },
	{ w: 1366, h: 768, pane: 300 },
	{ w: 1920, h: 1080, pane: 420 },
	{ w: 1280, h: 700, pane: 260 },
	// **THE DEGENERATE ONE, and it is NOT asserted strictly -- see the note where it is used.** A
	// 340 px pane on a 700 px window leaves the canvas about 144 px tall, and the dial's own
	// contents are about 190 px at the size bar's 56 px floor. Nothing can put a 190 px control
	// inside 144 px; what the clamp must still do is keep it INSIDE THE CANVAS with the knob at the
	// top, rather than sliding it up under the toolbar, which is the defect of 2026-09-18.
	{ w: 1280, h: 700, pane: 340, cramped: true }
];

module.exports = async ({ send, evaluate, logs, sleep }) => {
	const PROJ = fixtureProject();
	const PAGE = process.env.PAGE || 'http://127.0.0.1:8094/engcalcs/Looped-Network.php';
	const nav = async () => { await send('Page.navigate', { url: PAGE }); await sleep(2500); };

	async function openStep2(pane) {
		await nav();
		await evaluate(`(function(){ try { localStorage.clear();
			localStorage.setItem('lpn_project_p1', ${JSON.stringify(PROJ)});
			localStorage.setItem('lpn_index', JSON.stringify({v:1, openId:'p1', projects:[{id:'p1', name:'Probe'}]}));
			${'${PANE}'} } catch (e) {} return 1; })()`.replace('${PANE}',
			pane ? `localStorage.setItem('lpn_pane', JSON.stringify({open:true, h:${pane}, tab:'nodes'}));` : ''));
		await nav();
		await sleep(2500);
		const menuClick = (re) => evaluate(`(function(){
			var bs = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row'));
			var m = bs.filter(function(b){ return new RegExp(${JSON.stringify(re)},'i').test(b.textContent||''); });
			if (!m.length) { return 'NOT FOUND among: ' + bs.map(function(b){return (b.textContent||'').trim();}).join(' | '); }
			m[m.length-1].click(); return 'ok'; })()`);
		await evaluate(`document.getElementById('lpn_menu_map').click()`);
		await sleep(400);
		const a = await menuClick('World map');
		await sleep(400);
		const b = await menuClick('^Attach');
		await sleep(1500);
		await evaluate(`document.getElementById('lpn_mapgeo_place').click()`);
		await sleep(1800);
		return a === 'ok' && b === 'ok';
	}

	for (const L of LAYOUTS) {
		await send('Emulation.setDeviceMetricsOverride',
			{ width: L.w, height: L.h, deviceScaleFactor: 1, mobile: false });
		const name = L.w + 'x' + L.h + (L.pane ? ' with a ' + L.pane + 'px pane' : ' with no pane');
		const reached = await openStep2(L.pane);
		ok(name + ': step 2 opens', reached);
		if (!reached) { continue; }

		const m = JSON.parse(await evaluate(`(function(){
			var d = document.getElementById('lpn_mapgeo_dial');
			if (!d) { return JSON.stringify({ missing: true }); }
			var r = d.getBoundingClientRect(), p = d.offsetParent, pr = p && p.getBoundingClientRect();
			var hit = function (x, y) { var e = document.elementFromPoint(x, y); return e ? (e.id || e.className || e.tagName) : 'none'; };
			return JSON.stringify({
				display: getComputedStyle(d).display,
				rect: { l: r.left, t: r.top, w: r.width, h: r.height },
				box: (function () { var c = document.getElementById('lpn_canvas'),
					cr = c && c.getBoundingClientRect();
					return cr ? { t: cr.top, b: cr.bottom, h: cr.height } : (pr ? { t: pr.top, b: pr.bottom, h: pr.height } : null); })(),
				knob: (function () { var k = document.getElementById('lpn_mapgeo_turn'), kr = k && k.getBoundingClientRect();
					return kr ? hit(kr.left + kr.width / 2, kr.top + kr.height / 2) : 'no knob'; })(),
				bar: (function () { var b = document.getElementById('lpn_mapgeo_size'), br = b && b.getBoundingClientRect();
					return br ? hit(br.left + br.width / 2, br.top + br.height / 2) + '|' + Math.round(br.height) : 'no bar'; })()
			}); })()`));

		ok(name + ': the dial is drawn', !m.missing && m.display === 'block' && m.rect.w > 0 && m.rect.h > 0,
			m.missing ? 'MISSING' : m.display + ' ' + Math.round(m.rect.w) + 'x' + Math.round(m.rect.h));
		if (m.missing) { continue; }
		// **THE ASSERTION THE STUB CANNOT MAKE.** Not "is it in the DOM" and not "is display block",
		// but "is the whole of it inside the box it is positioned against".
		ok(name + ': ...WHOLLY INSIDE THE CANVAS',
			!!m.box && m.rect.t >= m.box.t - 0.5 && m.rect.t + m.rect.h <= m.box.b + 0.5,
			'dial ' + Math.round(m.rect.t) + '..' + Math.round(m.rect.t + m.rect.h) +
			' box ' + Math.round(m.box.t) + '..' + Math.round(m.box.b));
		// And that a hand can reach both halves of it. The knob is the half that went behind the
		// toolbar, so it is named rather than folded into a loop.
		ok(name + ': ...the TURN KNOB is the topmost thing at its own middle', m.knob === 'lpn_mapgeo_dial' ||
			m.knob === 'lpn_mapgeo_turn' || m.knob === 'lpn_mapgeo_turn_needle' || m.knob === 'lpn_mapgeo_turn_label', m.knob);
		// Each control hit-tested at ITS OWN middle, never at the dial's: the dial shrinks, so its
		// geometric centre wanders between the knob, the readout and the bar and would make the
		// assertion a statement about layout arithmetic rather than about reachability.
		if (L.cramped) {
			// Reported rather than asserted: the canvas is shorter than the control, so the bar is
			// below the fold of the dial's own scroll. The assertions that still bind are the two
			// above -- inside the canvas, and the knob reachable.
			console.log('NOTE  ' + name + ': the canvas is shorter than the dial, so the size bar is ' +
				'below its own scroll (' + m.bar + '). The knob is still reachable and nothing is ' +
				'under the toolbar, which is what the clamp is for.');
		} else {
			ok(name + ': ...and the SIZE BAR is', String(m.bar).split('|')[0] === 'lpn_mapgeo_size' &&
				+String(m.bar).split('|')[1] >= 56, m.bar);
		}

		if (L.pane) { continue; }

		// ---- and the whole point of the wizard, measured on the screen rather than on the numbers
		const snap = () => evaluate(`(function(){
			return JSON.stringify({
				nodes: Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map(function (e) {
					var r = e.getBoundingClientRect();
					return e.getAttribute('data-node') + '@' + r.left.toFixed(4) + ',' + r.top.toFixed(4); }),
				tiles: Array.from(document.querySelectorAll('.lpn-basemap-tile')).slice(0, 6).map(function (e) {
					return e.getAttribute('transform') || (e.getAttribute('x') + ',' + e.getAttribute('y')); })
			}); })()`);
		const before = JSON.parse(await snap());
		ok('the basemap draws tiles at all, or nothing below means anything', before.tiles.length > 0, before.tiles.length);
		await evaluate(`(function(){ var k = document.getElementById('lpn_mapgeo_turn');
			for (var i = 0; i < 20; i++) { k.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })); } })()`);
		await sleep(1200);
		const after = JSON.parse(await snap());
		ok('TURNING THE MAP DOES NOT MOVE THE DRAWING ONE PIXEL',
			JSON.stringify(before.nodes) === JSON.stringify(after.nodes),
			before.nodes.slice(0, 2).join(' ') + ' -> ' + after.nodes.slice(0, 2).join(' '));
		ok('...and every tile of ground on screen has moved',
			before.tiles.length === after.tiles.length &&
			!before.tiles.some(function (t, i) { return t === after.tiles[i]; }),
			before.tiles.length + ' tiles compared');

		// ---- the rectangle's own rotate handle, reached the way a hand reaches it
		const handle = JSON.parse(await evaluate(`(function(){
			var c = document.querySelector('.lpn-georef circle[data-mapgeo=rotate]');
			if (!c) { return JSON.stringify({ missing: true }); }
			var r = c.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
			var e = document.elementFromPoint(x, y);
			return JSON.stringify({ x: x, y: y, under: e ? (e.id || e.getAttribute('data-mapgeo') || e.tagName) : 'none' }); })()`));
		// **REPORTED, NOT FAILED, and that is a decision.** The handle stands off the NORTH edge of a
		// drawing just fitted to the window, so at a fitted zoom it lands above the canvas and under
		// the toolbar -- measured here, `elementFromPoint` returns `formInput`. It is why the dial
		// exists. Failing on it would fail the build over a control Tom may yet decide to delete.
		console.log('NOTE  the rectangle rotate handle at ' +
			(handle.missing ? 'MISSING' : Math.round(handle.x) + ',' + Math.round(handle.y) +
			' has ' + handle.under + ' on top of it' +
			(handle.under === 'rotate' ? ' (reachable)' : ' (NOT REACHABLE -- the dial is the way in)')));
	}

	const ex = logs.filter(function (l) { return /^EXCEPTION/.test(l); });
	ok('the page threw nothing while the wizard was driven', ex.length === 0, ex.slice(0, 3).join(' | '));
	console.log(fails ? '\n' + fails + ' FAILED' : '\nALL PASS');
	if (fails) { process.exitCode = 1; }
};
