// WHY A FEW TILES NEVER FILL IN -- a MEASUREMENT, not a theory (Tom's R-056, 2026-09-19).
//
//   CDP_PORT=9334 SCRIPT=dev/lpn-spike/basemap-blank-tile-probe.js \
//     PAGE=http://127.0.0.1:8094/engcalcs/Looped-Network.php node dev/lpn-spike/browser-drive.js
//
// His report: *"There are still a few blank tiles that never fill in when I stop zooming. It's as
// if we decided not to draw these tiles."* His screenshot shows completely white rectangles
// interleaved among loaded imagery -- not blurry, not half-drawn, absent -- and they stay absent
// after the zoom has settled.
//
// **THE ONLY HONEST QUESTION IS WHERE IN THE CHAIN THE TILE IS LOST**, so this asks the chain one
// link at a time for a SETTLED view, and reports the gaps between the links:
//
//   REQUIRED  the ground the canvas covers                 (every sample point of the canvas)
//   DRAWN     an <image> element covering that point       (the page decided to draw it)
//   REQUESTED that element's URL in Resource Timing        (the browser asked for it)
//   ARRIVED   that entry came back with bytes              (the picture exists)
//
// A white rectangle is therefore exactly one of: no element there at all (the tile list did not
// include it -- a bounds or off-by-one fault), an element whose URL was never requested (a
// de-duplication fault), or an element whose request died and was never retried (an abort fault).
// The three are distinguishable and this prints which one it is.
//
// It is a PROBE and not a harness: it asserts nothing, and it needs a running branch preview and a
// working Mapbox token, so run_harnesses.sh does not pick it up (that glob is *harness*.js).
module.exports = async ({ send, evaluate, logs, sleep }) => {
	const PAGE = process.env.PAGE || 'http://127.0.0.1:8094/engcalcs/Looped-Network.php';

	// ---- the fixture: the same Novato, CA attachment basemap-tile-load-probe.js uses, so the
	// satellite photographs exist at every zoom this asks for ---------------------------------
	const stub = require('./lpn-dom-stub.js');
	const path = require('path');
	const ROOT = path.join(__dirname, '..', '..') + path.sep;
	require(ROOT + 'js/lpn-georef.js');
	const PROJ = (function () {
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
		const P = L.getProject();
		P.coords = 'xy';
		// **THE STREET MAP, NOT SATELLITE, AND THAT IS FORCED.** Tom's Mapbox token is restricted to
		// hawsedc.com and librewaternet.org, so EVERY satellite tile fetched from a branch preview
		// port comes back `HTTP 403 {"message":"Forbidden"}` -- 23 bytes, which is a non-zero body
		// and therefore reads as a delivered tile to anything counting bytes. The first run of this
		// probe reported 100% coverage on a map that was showing nothing at all. OSM needs no token
		// and no referer, and the code path is identical: basemapStyle() picks a URL and nothing
		// else differs. Set PROBE_SAT=1 to use satellite anyway, from a host the token allows.
		P.basemap = process.env.PROBE_SAT ? 'satellite' : 'osm';
		P.georef = {
			origin: { lon: -122.5697, lat: 38.1074 },
			anchor: { x: 1000, y: -400 },
			metersPerUnit: 0.3048,
			rotDeg: 0
		};
		return JSON.stringify(L.serialize());
	})();

	await send('Network.enable', {});

	async function nav() {
		await send('Page.navigate', { url: PAGE });
		await sleep(1200);
		await evaluate(`(function(){ try {
			localStorage.clear();
			localStorage.setItem('lpn_project_p1', ${JSON.stringify(PROJ)});
			localStorage.setItem('lpn_index', JSON.stringify({v:1, openId:'p1', projects:[{id:'p1', name:'Blank tile probe'}]}));
			localStorage.setItem('ec_terrain','1');
		} catch (e) {} return 1; })()`);
		await send('Page.navigate', { url: PAGE });
		await sleep(3000);
		// **THE DEFAULT RESOURCE TIMING BUFFER IS 250 ENTRIES AND IT DROPS THE REST IN SILENCE.**
		// The first run of this probe reported six tiles "never requested" for exactly that reason,
		// with 249 tile entries recorded -- a finding about the instrument, not about the page.
		await evaluate('performance.setResourceTimingBufferSize(20000); 1');
	}

	// **THE WHOLE CHAIN, READ OFF ONE SETTLED FRAME.** Element geometry comes from the live layout,
	// so a tile that is drawn somewhere other than where the arithmetic thinks it is still counts
	// as covering what it actually covers. Resource Timing is keyed on the FULL url, because that
	// is what the element carries and what the browser recorded.
	const chainExpr = `(function () {
		var c = document.getElementById('lpn_canvas');
		if (!c) { return JSON.stringify({ err: 'no canvas' }); }
		var cb = c.getBoundingClientRect();
		var timing = {};
		performance.getEntriesByType('resource').forEach(function (e) {
			if (e.name.indexOf('api.mapbox.com') < 0 && e.name.indexOf('tile.openstreetmap.org') < 0) { return; }
			var t = timing[e.name] || (timing[e.name] = { n: 0, bytes: 0, ended: 0, st: [] });
			t.n++;
			// **WHETHER A PICTURE CAME BACK, ASKED THE ONLY WAY THAT WORKS FOR BOTH SOURCES.**
			// Mapbox sends Timing-Allow-Origin, so its body sizes are readable -- and a 403 from it
			// is 23 bytes, which counts as a body and would otherwise read as a delivered tile.
			// OpenStreetMap does NOT send that header, so every size it reports is 0 and only the
			// status is visible. So: a status of 200 or 304, or a body too big to be an error page.
			if (e.responseStatus === 200 || e.responseStatus === 304 ||
					Math.max(e.decodedBodySize, e.encodedBodySize) > 1000) { t.bytes++; }
			if (e.responseEnd > 0) { t.ended++; }
			// responseStatus names a 404 over the provider's ceiling or a 429 rate limit, which
			// is the difference between "the network lost it" and "the provider said no".
			if (typeof e.responseStatus === 'number') { t.st.push(e.responseStatus); }
		});
		var els = document.querySelectorAll('.lpn-basemap-tile'), rows = [];
		for (var i = 0; i < els.length; i++) {
			var h = els[i].getAttribute('href') ||
				els[i].getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
			var m = h.match(/\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.(?:jpg90|png)/);
			var b = els[i].getBoundingClientRect();
			var t = timing[h] || null;
			rows.push({
				i: i, key: m ? (m[1] + '/' + m[2] + '/' + m[3]) : h.slice(-28),
				settled: !!els[i]._lpnSettled,
				reqs: t ? t.n : 0, bytes: t ? t.bytes : 0, ended: t ? t.ended : 0,
				st: t ? t.st.join(',') : '',
				l: b.left, t: b.top, r: b.right, b: b.bottom
			});
		}
		var all = [];
		performance.getEntriesByType('resource').forEach(function (e) {
			if (e.name.indexOf('api.mapbox.com') < 0 && e.name.indexOf('tile.openstreetmap.org') < 0) { return; }
			all.push((typeof e.responseStatus === 'number' ? e.responseStatus : -1) +
				'/' + ((e.responseStatus === 200 || e.responseStatus === 304 ||
					Math.max(e.decodedBodySize, e.encodedBodySize) > 1000) ? 'picture' : 'empty'));
		});
		var tally = {};
		all.forEach(function (k) { tally[k] = (tally[k] || 0) + 1; });
		return JSON.stringify({
			canvas: { l: cb.left, t: cb.top, r: cb.right, b: cb.bottom },
			rows: rows, tally: tally
		});
	})()`;

	// Sample the canvas on a grid and classify each point by the BEST thing covering it. A white
	// rectangle in a screenshot is a run of points whose best cover is not a picture.
	function coverage(state, nx, ny) {
		const cv = state.canvas, rows = state.rows;
		const out = { ok: 0, noBytes: 0, neverAsked: 0, noElement: 0, blame: {} };
		for (let iy = 0; iy < ny; iy++) {
			for (let ix = 0; ix < nx; ix++) {
				const x = cv.l + (cv.r - cv.l) * (ix + 0.5) / nx;
				const y = cv.t + (cv.b - cv.t) * (iy + 0.5) / ny;
				let best = 0, who = null;   // 0 none, 1 element-never-asked, 2 element-no-bytes, 3 picture
				for (const r of rows) {
					if (x < r.l || x >= r.r || y < r.t || y >= r.b) { continue; }
					const rank = r.bytes > 0 ? 3 : (r.reqs > 0 ? 2 : 1);
					if (rank > best) { best = rank; who = r; }
				}
				if (best === 3) { out.ok++; }
				else if (best === 2) { out.noBytes++; out.blame[who.key] = 'asked ' + who.reqs + 'x, no bytes, settled=' + who.settled; }
				else if (best === 1) { out.neverAsked++; out.blame[who.key] = 'element present, URL never requested, settled=' + who.settled; }
				else { out.noElement++; }
			}
		}
		return out;
	}

	async function report(label, state) {
		const rows = state.rows;
		const onCanvas = rows.filter(r => r.r > state.canvas.l && r.l < state.canvas.r &&
			r.b > state.canvas.t && r.t < state.canvas.b);
		const cov = coverage(state, 64, 36);
		const total = cov.ok + cov.noBytes + cov.neverAsked + cov.noElement;
		console.log('\n==== ' + label + ' ====');
		console.log('  every tile request so far, by http status / body: ' +
			Object.keys(state.tally || {}).map(function (k) { return k + ' x' + state.tally[k]; }).join('   '));
		console.log('  tile elements in the layer ' + rows.length + ', of them on the canvas ' + onCanvas.length);
		console.log('    with bytes back   ' + onCanvas.filter(r => r.bytes > 0).length);
		console.log('    asked, no bytes   ' + onCanvas.filter(r => r.reqs > 0 && !r.bytes).length);
		console.log('    NEVER ASKED FOR   ' + onCanvas.filter(r => !r.reqs).length);
		console.log('    not settled yet   ' + onCanvas.filter(r => !r.settled).length);
		console.log('  canvas coverage, ' + total + ' sample points');
		console.log('    a picture                      ' + String(cov.ok).padStart(5) +
			'  ' + (100 * cov.ok / total).toFixed(1) + '%');
		console.log('    WHITE: element, no bytes       ' + String(cov.noBytes).padStart(5));
		console.log('    WHITE: element, never asked    ' + String(cov.neverAsked).padStart(5));
		console.log('    WHITE: no element at all       ' + String(cov.noElement).padStart(5));
		const blame = Object.keys(cov.blame);
		if (blame.length) {
			console.log('  the tiles under the white:');
			blame.slice(0, 20).forEach(k => console.log('    ' + k.padEnd(14) + cov.blame[k]));
		}
		// Every element that is not a picture, whether or not it is on the canvas -- a carried
		// generation shows up here and not above.
		const bad = rows.filter(r => !r.bytes);
		if (bad.length) {
			console.log('  ALL elements with no picture (' + bad.length + '):');
			bad.slice(0, 24).forEach(r => console.log('    dom#' + String(r.i).padStart(3) +
				'  ' + r.key.padEnd(14) + ' asked ' + r.reqs + '  ended ' + r.ended +
				'  settled ' + r.settled + '  status ' + (r.st || '-')));
		}
		// ---- the pixels, CALIBRATED against the bookkeeping rather than against a guess ----
		// A flat rectangle compresses small and a map does not, but WHERE the line falls depends on
		// the map: a street map is mostly flat colour. So this does not pick a threshold -- it
		// prints the two populations side by side, and the reader sees whether they separate.
		const shots = [];
		for (const r of onCanvas) { shots.push({ r: r, px: await tileIsBlank(r) }); }
		const med = a => a.length ? a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)] : 0;
		const got = shots.filter(s2 => s2.r.bytes > 0).map(s2 => s2.px.bytes);
		const lost = shots.filter(s2 => !s2.r.bytes).map(s2 => s2.px.bytes);
		console.log('  PIXELS, middle of each tile as a jpeg: tiles WITH a picture, median ' +
			med(got) + ' b (n=' + got.length + ');  tiles with NO picture, median ' +
			med(lost) + ' b (n=' + lost.length + ')');
		return { cov, onCanvas, shots };
	}

	// **WHAT TOM ACTUALLY SEES IS WHITE, so the last word has to be pixels and not bookkeeping.**
	// A screenshot clipped to the middle of one tile is either a photograph or a flat rectangle,
	// and a JPEG says which in its own length: a flat patch compresses to a few hundred bytes and
	// an aerial photograph does not. No PNG decoder and no dependency, and it cannot be fooled by
	// a page that thinks it drew something.
	async function tileIsBlank(r) {
		const w = Math.min(64, Math.max(8, (r.r - r.l) * 0.5));
		const h = Math.min(64, Math.max(8, (r.b - r.t) * 0.5));
		const shot = await send('Page.captureScreenshot', {
			format: 'jpeg', quality: 80,
			clip: { x: (r.l + r.r) / 2 - w / 2, y: (r.t + r.b) / 2 - h / 2, width: w, height: h, scale: 1 }
		});
		const n = shot && shot.result && shot.result.data ? shot.result.data.length : 0;
		return { bytes: n };
	}

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

	await nav();
	console.log('after load: ' + await evaluate(`(function(){ return JSON.stringify({
		tiles: document.querySelectorAll('.lpn-basemap-tile').length }); })()`));

	// =============================================================================================
	// PART 1 -- THE GESTURE HE DESCRIBES, ON A LINK THAT CANNOT KEEP UP
	// =============================================================================================
	// On a fast wired link every tile arrives and there is nothing to see: that is measured, and is
	// why the R-019 report had to be reproduced rather than reasoned about. A burst of wheel
	// notches on a throttled link is the condition -- several repaints in flight at once, each
	// cancelling the last -- and then a long settle, which is the part of his report that matters:
	// *"never fill in WHEN I STOP ZOOMING."*
	await send('Network.setCacheDisabled', { cacheDisabled: true });
	await send('Network.emulateNetworkConditions', {
		offline: false, latency: Number(process.env.LAT || 300),
		downloadThroughput: Number(process.env.KBPS || 600) * 1024 / 8,
		uploadThroughput: 200 * 1024 / 8
	});

	// **SEVERAL GESTURES, BECAUSE THE FIRST ONE REPRODUCED NOTHING.** A burst that ends back at the
	// provider's ceiling changes no tile key at all, so it cannot leave a hole; what has to be
	// driven is a burst where EVERY notch changes the zoom level, with the next notch arriving
	// before the last repaint's photographs have come down the wire.
	const GESTURES = [
		{ name: 'out 12, settle, then IN 12 notches at 150 ms', out: 12, inN: 12, pause: 150 },
		{ name: 'out 12, settle, then IN 12 notches at 60 ms', out: 12, inN: 12, pause: 60 },
		{ name: 'out 12, settle, then IN 6 notches at 400 ms', out: 12, inN: 6, pause: 400 },
		{ name: 'out 8, settle, then OUT 8 more at 150 ms', out: 8, inN: -8, pause: 150 }
	];
	for (const g of (process.env.PART === '2' ? [] : GESTURES)) {
		await nav();
		await send('Network.setCacheDisabled', { cacheDisabled: true });
		await evaluate('performance.clearResourceTimings()');
		await wheelBurst(g.out, 120, 200);
		await sleep(6000);
		await wheelBurst(Math.abs(g.inN), g.inN > 0 ? -120 : 120, g.pause);
		await sleep(8000);
		let st = JSON.parse(await evaluate(chainExpr));
		await report(g.name + '  [8 s after]', st);
		await sleep(22000);
		st = JSON.parse(await evaluate(chainExpr));
		await report(g.name + '  [30 s after -- he has STOPPED]', st);
	}

	// =============================================================================================
	// PART 2 -- WHAT HAPPENS TO A TILE WHOSE REQUEST FAILS
	// =============================================================================================
	// Part 1 drove four burst-zoom gestures on a throttled link and found ZERO blank tiles: on a
	// link that never fails, every tile arrives. So the question is the other one -- what does this
	// page do about a tile that DOES fail? A handful of tile URLs are blocked outright, the view is
	// moved so they are asked for and fail, the block is lifted, and then the page is given every
	// chance to notice: repaints, a zoom away and back, and a long sit.
	//
	// This is the condition a real link produces at random on a few tiles out of a hundred.
	async function part2() {
		await nav();
		await send('Network.setCacheDisabled', { cacheDisabled: true });
		await send('Network.emulateNetworkConditions', {
			offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1
		});
		console.log('\n==== PART 2: a view whose tiles fail, and then a network that is perfect ====');
		// EVERY tile request fails while the new view is being asked for. That is a heavy hand for
		// what a real link does to two tiles in a hundred, and it is the same event: a request that
		// went out and brought nothing back.
		await send('Network.setBlockedURLs', { urls: ['*api.mapbox.com*', '*tile.openstreetmap.org*'] });
		await wheelBurst(3, 120, 250);
		await sleep(5000);
		let st = JSON.parse(await evaluate(chainExpr));
		await report('the new view, asked for while every request fails', st);

		// And now nothing is wrong. The page is left alone, exactly as he leaves it alone when he
		// stops zooming.
		await send('Network.setBlockedURLs', { urls: [] });
		console.log('\n  -- block lifted; the network is perfect from here, and the view is not touched --');
		for (const w of [5, 15, 30]) {
			await sleep(w === 5 ? 5000 : 10000);
			st = JSON.parse(await evaluate(chainExpr));
			await report(w + ' s after the network came back, sitting still', st);
		}

		// The only thing that has ever repaired this: a gesture that changes which tiles are wanted.
		await wheelBurst(1, 120, 250);
		await sleep(1500);
		await wheelBurst(1, -120, 250);
		await sleep(6000);
		st = JSON.parse(await evaluate(chainExpr));
		await report('after one wheel notch out and back -- a NEW set of keys', st);
	}
	await part2();

	console.log('\n---- page console ----');
	logs.slice(-15).forEach(l => console.log('   ' + l));
};
