// WHERE THE SATELLITE TILES GO -- a MEASUREMENT, not a theory (Tom's R-019, 2026-09-19).
//
//   SCRIPT=dev/lpn-spike/basemap-tile-load-probe.js PAGE=http://127.0.0.1:8094/engcalcs/Looped-Network.php \
//     node dev/lpn-spike/browser-drive.js
//
// His report: *"I am getting huge hesitance to load tiles I need. I see tiles around the edges of
// my map... Frustratingly, it's the area I care about most that disappears when I zoom in, while
// peripheral tiles keep showing."*
//
// This is a PROBE and not a harness: it reports numbers and asserts nothing, and it needs a
// running branch preview and a working Mapbox token, so `run_harnesses.sh` does not pick it up (the
// glob is *harness*.js). dev/lpn-spike/basemap-tile-order-harness.js is what holds the findings.
//
// WHAT IT MEASURED, 2026-09-19, on port 8094 against real Mapbox tiles:
//
//   * On a fast link every tile arrives and there is nothing to see -- which is why the report had
//     to be reproduced rather than reasoned about.
//   * **ARRIVAL ORDER TRACKED THE ELEMENT'S POSITION IN THE LAYER EXACTLY**, dom#0 through dom#71
//     in one run and dom#0 through dom#35 in another, and had NO relation to where the tile sat on
//     the screen. The first twelve tiles to arrive were 1,021 to 1,497 px from the middle of the
//     screen: corners. basemapTileList() looped x outer, so the list came out from the west edge,
//     and a browser fetches images in append order.
//   * After the fix the first twelve to arrive are 130 to 630 px from the middle and the last
//     twelve are 803 to 1,435 px out.
//   * The token is NOT the problem and was ruled out: a tile fetched with a localhost Referer
//     returns 200, CORS is `*`, and the rate limit header reads 100,000 per minute.
module.exports = async ({ send, evaluate, logs, sleep }) => {
	const PAGE = process.env.PAGE || 'http://127.0.0.1:8094/engcalcs/Looped-Network.php';

	// ---- the fixture: a grid drawing in feet, built by the page's own serializer ----------------
	const stub = require('./lpn-dom-stub.js');
	const path = require('path');
	const ROOT = path.join(__dirname, '..', '..') + path.sep;
	require(ROOT + 'js/lpn-georef.js');
	const FX = (function () {
		const L = stub.loadLoopedNetwork(
			"\t\taddNode: addNode, addLink: addLink, serialize: serializeProject,\n" +
			"\t\tgetProject: function () { return project; },\n");
		stub.setUnitSet('us');
		const R = L.addNode('reservoir', 0, 0);
		const A = L.addNode('junction', 1234.5, -200.25);
		const B = L.addNode('junction', 2000, -800);
		R._head = 250; A._demand = 120; B._demand = 80;
		L.addLink('pipe', R.id, A.id);
		L.addLink('pipe', A.id, B.id);
		// **THE ATTACHMENT, WRITTEN THE WAY THE WIZARD WRITES IT.** Novato, CA -- the same ground
		// dev/water-network-examples/Net3-Novato-CA-World.lwn sits on, so the satellite tiles
		// exist at every zoom this probe asks for. One foot per drawing unit, no rotation.
		const P = L.getProject();
		P.coords = 'xy';
		P.basemap = 'satellite';
		P.georef = {
			origin: { lon: -122.5697, lat: 38.1074 },
			anchor: { x: 1000, y: -400 },
			metersPerUnit: 0.3048,
			rotDeg: 0
		};
		return JSON.stringify(L.serialize());
	})();
	const PROJ = FX;

	// ---- what the wire actually did ------------------------------------------------------------
	// Network.enable so the CDP side is recording, but the numbers below are read out of the PAGE's
	// own Resource Timing rather than out of protocol events: browser-drive.js routes only Runtime.*
	// messages off its socket, and Resource Timing is the same fact with no plumbing to add.
	await send('Network.enable', {});

	// Resource Timing is the honest source here: it records EVERY image fetch the page made, with
	// start and end, and it is what the browser itself believes. A request that never finished has
	// responseEnd 0, which is how an abort/cancel shows up.
	const timingExpr = `(function () {
		var out = [];
		performance.getEntriesByType('resource').forEach(function (e) {
			if (e.name.indexOf('api.mapbox.com') < 0 && e.name.indexOf('tile.openstreetmap.org') < 0) { return; }
			var m = e.name.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.(?:jpg90|png)/);
			out.push({
				key: m ? (m[1] + '/' + m[2] + '/' + m[3]) : e.name.slice(-40),
				start: Math.round(e.startTime),
				end: Math.round(e.responseEnd),
				dur: Math.round(e.duration),
				size: e.transferSize,
				enc: e.encodedBodySize
			});
		});
		return out;
	})()`;

	async function nav() {
		await send('Page.navigate', { url: PAGE });
		await sleep(1200);
		await evaluate(`(function(){ try {
			localStorage.clear();
			localStorage.setItem('lpn_project_p1', ${JSON.stringify(PROJ)});
			localStorage.setItem('lpn_index', JSON.stringify({v:1, openId:'p1', projects:[{id:'p1', name:'Tile probe'}]}));
			localStorage.setItem('ec_terrain','1');
		} catch (e) {} return 1; })()`);
		await send('Page.navigate', { url: PAGE });
		await sleep(3000);
	}

	// What the PAGE thinks it has drawn, keyed the way basemapEls is.
	const domExpr = `(function () {
		var els = document.querySelectorAll('.lpn-basemap-tile'), out = [];
		for (var i = 0; i < els.length; i++) {
			var h = els[i].getAttribute('href') || els[i].getAttributeNS('http://www.w3.org/1999/xlink','href') || '';
			var m = h.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.(?:jpg90|png)/);
			out.push(m ? (m[1] + '/' + m[2] + '/' + m[3]) : h.slice(-30));
		}
		return out;
	})()`;

	function report(title, timings, dom) {
		console.log('\n==== ' + title + ' ====');
		console.log('  tiles in DOM: ' + dom.length);
		const done = timings.filter(t => t.end > 0 && t.enc > 0);
		const unfinished = timings.filter(t => !(t.end > 0) || !(t.enc > 0));
		console.log('  network requests seen: ' + timings.length +
			'   finished with bytes: ' + done.length +
			'   NO BYTES / unfinished: ' + unfinished.length);
		if (done.length) {
			const ds = done.map(t => t.dur).sort((a, b) => a - b);
			console.log('  duration ms  min ' + ds[0] + '  median ' + ds[Math.floor(ds.length / 2)] +
				'  p90 ' + ds[Math.floor(ds.length * 0.9)] + '  max ' + ds[ds.length - 1]);
		}
		const reqKeys = new Set(timings.map(t => t.key));
		const missing = dom.filter(k => !reqKeys.has(k));
		console.log('  IN DOM BUT NEVER REQUESTED: ' + missing.length +
			(missing.length ? '  ' + missing.slice(0, 12).join(' ') : ''));
		const blank = dom.filter(k => {
			const t = timings.filter(x => x.key === k);
			return t.length > 0 && !t.some(x => x.enc > 0);
		});
		console.log('  IN DOM, REQUESTED, NO BYTES BACK: ' + blank.length +
			(blank.length ? '  ' + blank.slice(0, 12).join(' ') : ''));
		return { dom, timings, missing, blank };
	}

	await nav();

	// Confirm the fixture took, and that we are on satellite.
	const state0 = await evaluate(`(function(){ try {
		return JSON.stringify({ tiles: document.querySelectorAll('.lpn-basemap-tile').length,
			cred: (document.getElementById('lpn_basemap_credit')||{}).textContent ? 1 : 0 });
	} catch (e) { return 'ERR ' + e; } })()`);
	console.log('after load: ' + state0);

	let t = await evaluate(timingExpr);
	let d = await evaluate(domExpr);
	report('STEP 0 -- freshly opened, fitted', t || [], d || []);

	// ---- the gesture he describes: zoom IN on the centre, a burst of notches ---------------------
	// Driven through the page's own wheel handler at the canvas centre, which is what a hand does.
	async function wheelBurst(notches, dyPer, pause) {
		const r = await evaluate(`(function(){ var c = document.getElementById('lpn_canvas');
			var b = c.getBoundingClientRect(); return JSON.stringify({x: Math.round(b.left+b.width/2), y: Math.round(b.top+b.height/2)}); })()`);
		const p = JSON.parse(r);
		for (let i = 0; i < notches; i++) {
			await send('Input.dispatchMouseEvent', {
				type: 'mouseWheel', x: p.x, y: p.y, deltaX: 0, deltaY: dyPer, modifiers: 0
			});
			await sleep(pause);
		}
	}

	// ---- the journey he describes: out to a wide view, then IN one notch at a time ---------------
	// Each settle is reported on its own: which zoom level the page asked for, how many tiles it
	// wants, how many it asked the network for since the last settle, and how many of those had
	// bytes back by the time the settle ended. A "slow and uncertain slog" has to show up as
	// requests that are issued and do not finish, or as tiles wanted and never asked for.
	function snapshotExpr(sinceMs) {
		return `(function () {
			var mine = [], pend = 0, got = 0;
			performance.getEntriesByType('resource').forEach(function (e) {
				if (e.name.indexOf('api.mapbox.com') < 0 && e.name.indexOf('tile.openstreetmap.org') < 0) { return; }
				if (e.startTime < ${sinceMs}) { return; }
				mine.push(e);
				if (e.encodedBodySize > 0) { got++; } else { pend++; }
			});
			var els = document.querySelectorAll('.lpn-basemap-tile'), zs = {};
			for (var i = 0; i < els.length; i++) {
				var h = els[i].getAttribute('href') || '';
				var m = h.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.(?:jpg90|png)/);
				if (m) { zs[m[1]] = (zs[m[1]] || 0) + 1; }
			}
			return JSON.stringify({ now: performance.now(), dom: els.length, zs: zs,
				newReq: mine.length, newGot: got, newPend: pend });
		})()`;
	}

	let clock = 0;
	async function settle(label, ms) {
		const before = clock;
		await sleep(ms);
		const snap = JSON.parse(await evaluate(snapshotExpr(before)));
		clock = snap.now;
		const zs = Object.keys(snap.zs).map(z => 'z' + z + ':' + snap.zs[z]).join(' ');
		console.log('  ' + label.padEnd(34) +
			' tiles in DOM ' + String(snap.dom).padStart(4) + ' [' + (zs || '-') + ']' +
			'   asked ' + String(snap.newReq).padStart(4) +
			'   came back ' + String(snap.newGot).padStart(4) +
			'   STILL NOTHING ' + String(snap.newPend).padStart(4));
		return snap;
	}

	console.log('\n==== ZOOM OUT TO A WIDE VIEW, THEN IN ONE NOTCH AT A TIME ====');
	await wheelBurst(14, 120, 80);
	await settle('after zooming right out', 6000);

	for (let i = 1; i <= 14; i++) {
		await wheelBurst(1, -120, 30);
		await settle('zoom-in notch ' + i, 2500);
	}
	console.log('  -- now sit still for 10 s, the "coaxing" he has to do --');
	await settle('idle', 10000);

	// =============================================================================================
	// PART 2 -- THE SAME JOURNEY ON A SLOW LINK, WHICH IS THE CONDITION HE IS DESCRIBING
	// =============================================================================================
	// On a fast wired link every tile arrives and there is nothing to see. The report is about a
	// link that cannot deliver 200 photographs in the time between two wheel notches, so the link
	// is throttled here and the browser cache is turned off -- the cache is what made part 1 look
	// healthy, since a tile already on the disk needs no queue position at all.
	//
	// WHAT IS BEING TESTED: the ORDER tiles are asked for in. basemapTileList() loops x outer and
	// y inner from the west edge to the east, so the elements are appended -- and therefore
	// fetched -- from one CORNER of the view. If that is what decides which tiles a reader sees
	// first, then the middle of the screen is served last, every time, by construction.
	console.log('\n==== PART 2: SLOW LINK, NO CACHE ====');
	// The throttle has to be applied AFTER the navigation, or the page's own boot sets it up and
	// the first tile burst goes out before it takes effect -- measured: 72 tiles in 1.2 s at a
	// nominal 700 kbps, which is not 700 kbps.
	await nav();
	await sleep(500);
	await send('Network.setCacheDisabled', { cacheDisabled: true });
	await send('Network.emulateNetworkConditions', {
		offline: false, latency: 300, downloadThroughput: 600 * 1024 / 8, uploadThroughput: 200 * 1024 / 8
	});
	// A zoom level change, so every tile on the screen is a fresh request in the page's own order.
	// OUTWARD, because this fixture opens pinned at the provider's own ceiling of zoom 19 and
	// zooming further in cannot change a single tile key -- the first attempt at this measured
	// nothing for that reason.
	await evaluate('performance.clearResourceTimings()');
	await wheelBurst(4, 120, 60);

	// Which tiles are on the screen, how far each is from the middle of it, and when its bytes
	// finished arriving. `dom#` is the element's position in the layer, which IS the order
	// basemapTileList() built it in and therefore the order the browser was asked to fetch.
	const fillExpr = `(function () {
		var c = document.getElementById('lpn_canvas'), cb = c.getBoundingClientRect();
		var cx = cb.left + cb.width / 2, cy = cb.top + cb.height / 2;
		var got = {}, asked = {};
		performance.getEntriesByType('resource').forEach(function (e) {
			if (e.name.indexOf('api.mapbox.com') < 0 && e.name.indexOf('tile.openstreetmap.org') < 0) { return; }
			var m = e.name.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.(?:jpg90|png)/);
			if (!m) { return; }
			var k = m[1] + '/' + m[2] + '/' + m[3];
			asked[k] = 1;
			if (e.encodedBodySize > 0) { got[k] = Math.round(e.responseEnd); }
		});
		var els = document.querySelectorAll('.lpn-basemap-tile'), rows = [];
		for (var i = 0; i < els.length; i++) {
			var h = els[i].getAttribute('href') || '';
			var m2 = h.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.(?:jpg90|png)/);
			if (!m2) { continue; }
			var k2 = m2[1] + '/' + m2[2] + '/' + m2[3];
			var b = els[i].getBoundingClientRect();
			var bx = b.left + b.width / 2, by = b.top + b.height / 2;
			var onscreen = b.right > cb.left && b.left < cb.right && b.bottom > cb.top && b.top < cb.bottom;
			rows.push({ i: i, key: k2, dist: Math.round(Math.hypot(bx - cx, by - cy)),
				on: onscreen ? 1 : 0, got: got[k2] || 0, asked: asked[k2] ? 1 : 0 });
		}
		return JSON.stringify(rows);
	})()`;

	let last = null;
	for (let s2 = 0; s2 < 10; s2++) {
		await sleep(3000);
		const rows = JSON.parse(await evaluate(fillExpr));
		last = rows;
		const on = rows.filter(r => r.on);
		const done = on.filter(r => r.got > 0);
		console.log('  t+' + String((s2 + 1) * 3).padStart(2) + 's  on-screen tiles ' +
			String(on.length).padStart(3) + '   with bytes ' + String(done.length).padStart(3) +
			'   asked-not-arrived ' + String(on.filter(r => r.asked && !r.got).length).padStart(3) +
			'   never asked ' + String(on.filter(r => !r.asked).length).padStart(3));
	}

	if (last) {
		const on = last.filter(r => r.on).sort((a, b) => a.dist - b.dist);
		const third = Math.max(1, Math.ceil(on.length / 3));
		const near = on.slice(0, third), far = on.slice(-third);
		const pct = a => Math.round(100 * a.filter(r => r.got > 0).length / a.length);
		console.log('\n  ON-SCREEN TILES BY DISTANCE FROM THE MIDDLE OF THE SCREEN');
		console.log('    middle third  ' + near.length + ' tiles, ' + pct(near) + '% arrived');
		console.log('    outer third   ' + far.length + ' tiles, ' + pct(far) + '% arrived');
		// And the order question stated directly: does arrival time follow the DOM order (which is
		// the order basemapTileList built them in) rather than distance from the middle?
		const arrived = last.filter(r => r.got > 0).sort((a, b) => a.got - b.got);
		console.log('\n  THE FIRST TWELVE TILES TO ARRIVE, in arrival order');
		arrived.slice(0, 12).forEach(r => console.log('    ' + String(r.got).padStart(6) + ' ms   dom#' +
			String(r.i).padStart(3) + '   ' + String(r.dist).padStart(5) + ' px from the middle   ' + r.key));
		console.log('\n  THE LAST TWELVE TO ARRIVE');
		arrived.slice(-12).forEach(r => console.log('    ' + String(r.got).padStart(6) + ' ms   dom#' +
			String(r.i).padStart(3) + '   ' + String(r.dist).padStart(5) + ' px from the middle   ' + r.key));
	}

	console.log('\n---- page console ----');
	logs.slice(-15).forEach(l => console.log('   ' + l));
};
