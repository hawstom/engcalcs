// lpn-profile.js — the elevation / hydraulic-grade profile's pure half (ROADMAP Task 409).
//
// Split from js/looped-network.js by PURITY, exactly as js/lpn-geom.js is: everything here takes
// values and returns values — no DOM, no `doc`, no units, no closure variables. The caller in
// looped-network.js resolves the document into plain maps, converts into display units BEFORE
// calling, and turns the answer into SVG.
//
// THE THREE THINGS THIS FILE EXISTS TO GET RIGHT:
//
//   1. **Stations are LINK LENGTHS, never map distance.** Nothing here can even see a coordinate,
//      which is the point: a profile plotted on the distance between two symbols is a different
//      pipe from the one the solver solved, and every vertex and every hand-entered `len` moves
//      them apart. The caller passes the same length it hands the solver (`linkLengthSI`).
//   2. **The vertical axis is TRUNCATED** — see axisBounds() for how and for what it costs not to.
//   3. **It is cheap enough to run live.** Dijkstra with a binary heap and one pass over the path,
//      so re-running on every keystroke of a path change is not a decision anyone has to think
//      about.

var EngCalcs = EngCalcs || {};

EngCalcs.lpnProfile = (function () {
	'use strict';

	// ---- graph ------------------------------------------------------------
	//
	// `links` is [{id, from, to, length}]. A length that is missing, negative or not finite is
	// treated as 0: a zero-length link is a real thing on this page (a pump, a valve), and a
	// negative weight would silently break Dijkstra's correctness rather than its output.
	//
	// **The caller decides what is in the graph.** An inactive element is not in the network at all
	// (Task 184), and a CLOSED one still is — a closed pipe is on the ground, it is drawn, and its
	// profile shows a break in the grade line rather than no pipe. That distinction lives in
	// looped-network.js because only it knows about scenarios; this file routes over what it is given.
	function buildGraph(links) {
		var adj = {}, byId = {}, i, l, w;
		function touch(id) { if (!adj[id]) { adj[id] = []; } }
		for (i = 0; i < (links || []).length; i++) {
			l = links[i];
			if (!l || l.from === undefined || l.to === undefined) { continue; }
			w = (typeof l.length === 'number' && isFinite(l.length) && l.length > 0) ? l.length : 0;
			touch(l.from); touch(l.to);
			byId[l.id] = l;
			adj[l.from].push({ link: l.id, other: l.to, w: w });
			adj[l.to].push({ link: l.id, other: l.from, w: w });
		}
		return { adj: adj, links: byId };
	}

	// A minimal binary min-heap. Written out rather than sorting an array on every pop because this
	// runs on every path change and every solve, and a live redraw is the feature.
	function Heap() { this.a = []; }
	Heap.prototype.push = function (item) {
		var a = this.a, i = a.length, p;
		a.push(item);
		while (i > 0) {
			p = (i - 1) >> 1;
			if (a[p].d <= a[i].d) { break; }
			var t = a[p]; a[p] = a[i]; a[i] = t; i = p;
		}
	};
	Heap.prototype.pop = function () {
		var a = this.a, top = a[0], last = a.pop(), i = 0, n = a.length, l, r, m;
		if (!a.length) { return top; }
		a[0] = last;
		for (;;) {
			l = 2 * i + 1; r = l + 1; m = i;
			if (l < n && a[l].d < a[m].d) { m = l; }
			if (r < n && a[r].d < a[m].d) { m = r; }
			if (m === i) { break; }
			var t = a[m]; a[m] = a[i]; a[i] = t; i = m;
		}
		return top;
	};
	Heap.prototype.size = function () { return this.a.length; };

	// The SUGGESTED path: shortest by total link length, which is what "the route the water takes"
	// means to an engineer looking at a drawing. Returns {nodes, links, length} or null when the two
	// are not connected — null, not an empty path, because "no route" is a thing to say out loud.
	//
	// A tie between two equal-length routes is broken by whichever the heap reaches first, and that
	// is deliberate: presenting "alternatives" for a tie is noise, and the user forcing a waypoint
	// is the mechanism for choosing among them.
	function shortestPath(graph, fromId, toId) {
		if (!graph || !graph.adj[fromId] || !graph.adj[toId]) { return null; }
		if (fromId === toId) { return { nodes: [fromId], links: [], length: 0 }; }
		var dist = {}, prev = {}, done = {}, heap = new Heap(), cur, e, i, nd;
		dist[fromId] = 0;
		heap.push({ id: fromId, d: 0 });
		while (heap.size()) {
			cur = heap.pop();
			if (done[cur.id]) { continue; }
			done[cur.id] = true;
			if (cur.id === toId) { break; }
			for (i = 0; i < graph.adj[cur.id].length; i++) {
				e = graph.adj[cur.id][i];
				if (done[e.other]) { continue; }
				nd = cur.d + e.w;
				if (dist[e.other] === undefined || nd < dist[e.other]) {
					dist[e.other] = nd;
					prev[e.other] = { node: cur.id, link: e.link };
					heap.push({ id: e.other, d: nd });
				}
			}
		}
		if (dist[toId] === undefined) { return null; }
		var nodes = [toId], links = [], step = toId;
		while (step !== fromId) {
			nodes.unshift(prev[step].node);
			links.unshift(prev[step].link);
			step = prev[step].node;
		}
		return { nodes: nodes, links: links, length: dist[toId] };
	}

	// The whole of path EDITING: a list of stops, each leg the shortest path between consecutive
	// ones. That is Google Directions' own gesture — drop a waypoint and the route bends through it
	// — and it is deliberately not a path-editing language. Two stops is the suggested path; more
	// are the user's corrections to it.
	//
	// A leg may double back over a link the previous leg used; that is the honest answer to the
	// waypoints given, and hiding it would misreport the route. Consecutive duplicate stops collapse.
	function pathThrough(graph, stops) {
		var out = { nodes: [], links: [], length: 0 }, i, leg;
		stops = (stops || []).filter(function (s, k, all) { return s !== undefined && s !== null && s !== '' && s !== all[k - 1]; });
		if (stops.length === 0) { return null; }
		if (stops.length === 1) { return graph && graph.adj[stops[0]] ? { nodes: [stops[0]], links: [], length: 0 } : null; }
		for (i = 0; i + 1 < stops.length; i++) {
			leg = shortestPath(graph, stops[i], stops[i + 1]);
			if (!leg) { return null; }
			out.nodes = out.nodes.concat(i === 0 ? leg.nodes : leg.nodes.slice(1));
			out.links = out.links.concat(leg.links);
			out.length += leg.length;
		}
		return out;
	}

	// Where a newly clicked waypoint goes in the stop list: at the position that LENGTHENS the route
	// least. Appending blindly is what turns a second waypoint into a zigzag — Google Directions
	// inserts a dropped pin into the leg it is nearest to, and least-added-length is that rule stated
	// in the only distance this feature has. Returns a NEW array; the first and last stops never
	// move, because those are the two ends the user chose.
	function insertStop(graph, stops, id) {
		var best = null, bestLen = Infinity, i, trial, p;
		if (!stops || stops.length < 2) { return (stops || []).concat([id]); }
		for (i = 1; i < stops.length; i++) {
			trial = stops.slice(0, i).concat([id], stops.slice(i));
			p = pathThrough(graph, trial);
			if (!p) { continue; }
			if (p.length < bestLen) { bestLen = p.length; best = trial; }
		}
		if (!best) {
			// Unreachable from every position — keep it anyway, next to the end it was clicked
			// toward, so the panel can say "no route" rather than silently discarding the click.
			best = stops.slice(0, stops.length - 1).concat([id], [stops[stops.length - 1]]);
		}
		return best;
	}

	// ---- the series -------------------------------------------------------
	//
	// `data` is plain maps, all already in ONE consistent pair of display units (a length for the
	// station, a head for both ground and grade — see looped-network.js, where an elevation is typed
	// in the input head unit and a solved head comes back in the RESULT head unit, and the two can
	// now differ):
	//
	//   {elev: {nodeId: number}, head: {nodeId: number}, length: {linkId: number},
	//    type: {linkId: 'pipe'|'pump'|'valve'}, closed: {linkId: bool}}
	//
	// A missing elev or head is `undefined`, never 0 — a reservoir imported from an `.inp` genuinely
	// has no elevation, and drawing it at zero would put the ground line at the bottom of the world.
	//
	// Returns runs of points rather than one polyline each, because both lines legitimately BREAK:
	// the grade line at a closed link (the two ends' heads are unrelated) and at any node the solve
	// has no head for; the ground line wherever an elevation is missing.
	function profileSeries(path, data) {
		var d = data || {}, elev = d.elev || {}, head = d.head || {},
			len = d.length || {}, type = d.type || {}, closed = d.closed || {};
		var out = { nodes: [], ground: [], hgl: [], band: [], length: 0, breaks: [] };
		if (!path || !path.nodes || !path.nodes.length) { return out; }
		var station = 0, i, id, L, w;
		for (i = 0; i < path.nodes.length; i++) {
			id = path.nodes[i];
			if (i > 0) {
				L = path.links[i - 1];
				w = (typeof len[L] === 'number' && isFinite(len[L]) && len[L] > 0) ? len[L] : 0;
				station += w;
			}
			out.nodes.push({
				id: id, station: station,
				ground: elev[id], head: head[id],
				pressure: (typeof elev[id] === 'number' && typeof head[id] === 'number') ? head[id] - elev[id] : undefined,
				// The link ARRIVING at this node, so a renderer can mark the pump or the closed pipe
				// without re-walking the path.
				linkIn: i > 0 ? path.links[i - 1] : null,
				linkType: i > 0 ? (type[path.links[i - 1]] || 'pipe') : null
			});
		}
		out.length = station;

		// Ground: a run per contiguous stretch of known elevations.
		out.ground = runs(out.nodes, function (n) { return typeof n.ground === 'number'; },
			function (n) { return { x: n.station, y: n.ground }; });

		// Grade line: same, plus two things a ground line does not have.
		//
		// **A CLOSED LINK IS A BREAK, NOT A STEEP SEGMENT.** No flow passes it, so the head on one
		// side says nothing about the head on the other, and a line joining them would draw a head
		// loss that does not exist. Same for a link whose ends the solve could not reach.
		//
		// **A PUMP (and an active valve) IS A STEP.** Its head change happens at the device, not
		// spread along the ground, so the grade line runs level to the device and jumps there.
		// Drawn at the MIDPOINT of the link's station span, which is 0 wide for the usual
		// zero-length pump and reads as a plain vertical line then.
		var run = [], a, b, mid;
		for (i = 0; i < out.nodes.length; i++) {
			a = out.nodes[i];
			if (typeof a.head !== 'number') {
				if (run.length) { out.hgl.push(run); run = []; }
				continue;
			}
			if (i > 0 && closed[a.linkIn]) {
				out.breaks.push(a.linkIn);
				if (run.length) { out.hgl.push(run); run = []; }
			} else if (i > 0 && run.length && (a.linkType === 'pump' || a.linkType === 'valve')) {
				b = out.nodes[i - 1];
				mid = (b.station + a.station) / 2;
				run.push({ x: mid, y: b.head });
				run.push({ x: mid, y: a.head, step: true });
			}
			run.push({ x: a.station, y: a.head });
		}
		if (run.length) { out.hgl.push(run); }

		// The pressure band: where BOTH lines exist and the grade line is unbroken, the gap between
		// them IS the pressure, and shading it is the cheapest way to show that. Nothing is drawn
		// where either line is absent, because a band with one edge missing is a claim about a
		// number nobody has.
		var brk = {};
		out.breaks.forEach(function (id2) { brk[id2] = true; });
		run = [];
		for (i = 0; i < out.nodes.length; i++) {
			a = out.nodes[i];
			if (typeof a.head !== 'number' || typeof a.ground !== 'number' || (i > 0 && brk[a.linkIn])) {
				if (run.length > 1) { out.band.push(run); }
				run = [];
				if (typeof a.head === 'number' && typeof a.ground === 'number') {
					run.push({ x: a.station, ground: a.ground, head: a.head });
				}
				continue;
			}
			run.push({ x: a.station, ground: a.ground, head: a.head });
		}
		if (run.length > 1) { out.band.push(run); }
		return out;
	}
	function runs(list, keep, map) {
		var out = [], run = [], i;
		for (i = 0; i < list.length; i++) {
			if (keep(list[i])) { run.push(map(list[i])); }
			else if (run.length) { out.push(run); run = []; }
		}
		if (run.length) { out.push(run); }
		return out;
	}

	// ---- the vertical axis ------------------------------------------------
	//
	// **TRUNCATED. This is the single thing this drawing has to get right.** Tom, 2026-08-17, on
	// epanet-js: *"It chokes at the last steps because they don't truncate their profile
	// bottom/min_value."* A water network's relief is small against its elevations, and the further
	// the site is above sea level the worse a zero-anchored axis gets. Measured on EPA's Net1, node
	// 10 to node 23: ground and grade together run 690 to 1004 ft, and the truncated axis 650-1050
	// gives the data 79% of the frame. Anchored at zero the same data gets 30%, so two thirds of the
	// drawing is empty sky and every head loss it exists to show is squeezed into the top third.
	//
	// A zero anchor is not merely wasteful, it can CLIP: Net3 has ground at -5 ft, which an axis
	// starting at zero simply does not contain. (Net3 is also the case where truncation wins little
	// -- its datum is already near zero -- which is the honest shape of this: truncation costs
	// nothing and sometimes saves everything.)
	//
	// The rule, in order:
	//   * the data's own min and max over EVERY plotted value — ground and grade together, because
	//     they share one axis and clipping either is a lie;
	//   * rounded OUTWARD to a 1/2/2.5/5 × 10^k step chosen for about 5 gridlines, so the labels are
	//     numbers a person reads rather than 217.4;
	//   * and a floor on the span, for the network that really is flat: a perfectly level 100 ft
	//     grade line would otherwise be an axis of zero height and a divide by zero.
	//
	// Zero is never special. If the data straddles it, it is in range because the data put it there.
	function niceStep(raw) {
		if (!(raw > 0) || !isFinite(raw)) { return 1; }
		var pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / pow;
		if (f <= 1) { return pow; }
		if (f <= 2) { return 2 * pow; }
		if (f <= 2.5) { return 2.5 * pow; }
		if (f <= 5) { return 5 * pow; }
		return 10 * pow;
	}
	function axisBounds(values, opts) {
		var o = opts || {}, pad = o.pad || 0,
			want = o.ticks || 5, maxTicks = o.maxTicks || 8, minSpan = o.minSpan || 1,
			lo = Infinity, hi = -Infinity, i, span, raw, pow, cands, step, k, a, b, n;
		for (i = 0; i < (values || []).length; i++) {
			var v = values[i];
			if (typeof v === 'number' && isFinite(v)) {
				if (v < lo) { lo = v; }
				if (v > hi) { hi = v; }
			}
		}
		if (lo === Infinity) { return { min: 0, max: minSpan, step: niceStep(minSpan / want), empty: true }; }
		span = hi - lo;
		if (span < minSpan) {
			// A flat profile is a real answer, not an error: centre the data in a minimum window
			// rather than collapsing the axis.
			var mid = (hi + lo) / 2;
			lo = mid - minSpan / 2; hi = mid + minSpan / 2; span = minSpan;
		}
		// **NO PADDING BY DEFAULT.** Rounding the ends outward to the tick step already leaves a
		// margin in almost every real case, and a pad on top of it costs a whole step whenever the
		// padded end crosses one -- 58 ft of empty sky under a profile that starts at 8. A profile
		// line that touches its own frame is ordinary; a profile squeezed into two thirds of the
		// frame to avoid that is not. `pad` stays available for a caller that wants breathing room.
		lo -= span * pad; hi += span * pad;
		// **THE STEP IS THE SMALLEST NICE ONE THAT KEEPS THE GRIDLINES COUNTABLE**, not the one
		// nearest `span / want`. Rounding the ENDS outward to a step chosen that way is what quietly
		// un-truncates the axis: Net3's node 1 to node 101 spans 8 to 147 ft, `span / 5` rounds to a
		// step of 50, and flooring 8 to a multiple of 50 puts the axis floor at -50 -- 58 ft of empty
		// below a profile that starts at 8. Trying the candidates from small to large and taking the
		// first whose tick count fits gives a step of 20 and a floor of 0, and the data fills 87% of
		// the frame instead of 55%.
		raw = (hi - lo) / want;
		pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10) - 1);
		cands = [];
		for (k = 0; k < 3; k++) {
			[1, 2, 2.5, 5].forEach(function (m) { cands.push(m * pow * Math.pow(10, k)); });
		}
		cands.sort(function (x, y) { return x - y; });
		step = cands[cands.length - 1];
		for (i = 0; i < cands.length; i++) {
			a = Math.floor(lo / cands[i]) * cands[i];
			b = Math.ceil(hi / cands[i]) * cands[i];
			n = Math.round((b - a) / cands[i]);
			if (n <= maxTicks) { step = cands[i]; break; }
		}
		return {
			min: Math.floor(lo / step) * step,
			max: Math.ceil(hi / step) * step,
			step: step
		};
	}
	// Gridline values, inclusive of both ends. Generated by INDEX off `min` rather than by repeated
	// addition, so 0.1-sized steps do not accumulate a float error into the labels.
	function ticks(bounds) {
		var out = [], n, i;
		if (!bounds || !(bounds.step > 0)) { return out; }
		n = Math.round((bounds.max - bounds.min) / bounds.step);
		for (i = 0; i <= n; i++) { out.push(bounds.min + i * bounds.step); }
		return out;
	}
	// **HOW MANY GRIDLINES THE ROOM WILL CARRY** (ROADMAP Task 527). `px` is the plot's own height in
	// CSS pixels and `labelPx` is what one label needs to itself -- its own type plus enough white to
	// read it as a separate number. The answer feeds axisBounds() as `ticks`/`maxTicks`, so a short
	// chart gets FEWER numbers rather than smaller ones: 8 labels down a 34px axis is the phone
	// defect, and 6px type would be the same defect wearing a different hat.
	//
	// The ceiling of 8 and the target of 5 are axisBounds()'s own defaults, so a chart with room to
	// spare is labelled exactly as it always was.
	function fitTicks(px, labelPx) {
		var room = (px > 0 && labelPx > 0) ? Math.floor(px / labelPx) : 8,
			maxTicks = Math.max(1, Math.min(8, room));
		return { ticks: Math.max(2, Math.min(5, maxTicks)), maxTicks: maxTicks };
	}
	// **WHICH OF A ROW OF LABELS THERE IS ROOM FOR.** `positions` is their coordinates along the
	// axis, in order; `minGap` is the closest two may be drawn without touching. Returns the INDICES
	// to draw: greedily from the left, and the last one always, because the end of a path is the one
	// station a reader looks for by name. The tick mark and the gridline are the caller's business
	// and are drawn either way -- the axis keeps its structure and loses only ink nobody could read.
	function labelStride(positions, minGap) {
		var keep = [], p = positions || [], last, i;
		for (i = 0; i < p.length; i++) {
			if (!keep.length || p[i] - p[keep[keep.length - 1]] >= minGap) { keep.push(i); }
		}
		if (!p.length) { return keep; }
		last = p.length - 1;
		if (keep[keep.length - 1] !== last) {
			if (keep.length > 1 && p[last] - p[keep[keep.length - 1]] < minGap) { keep.pop(); }
			keep.push(last);
		}
		return keep;
	}
	// The horizontal axis needs no truncation — a profile starts at station 0 by definition — but it
	// does need a non-zero width for the one-node case.
	function stationBounds(total, opts) {
		var o = opts || {};
		return { min: 0, max: (total > 0 ? total : (o.minSpan || 1)), step: niceStep((total > 0 ? total : (o.minSpan || 1)) / (o.ticks || 5)) };
	}

	// Data space to pixel space. `box` is the PLOT rectangle in SVG user units (inside the axes),
	// y down. Here rather than in the renderer because an off-by-one in the flip is exactly the kind
	// of thing a harness can pin and an eye cannot.
	function plotX(station, xB, box) {
		var span = xB.max - xB.min || 1;
		return box.left + (station - xB.min) / span * box.width;
	}
	function plotY(value, yB, box) {
		var span = yB.max - yB.min || 1;
		return box.top + box.height - (value - yB.min) / span * box.height;
	}

	return {
		buildGraph: buildGraph,
		shortestPath: shortestPath,
		pathThrough: pathThrough,
		insertStop: insertStop,
		profileSeries: profileSeries,
		niceStep: niceStep,
		axisBounds: axisBounds,
		ticks: ticks,
		fitTicks: fitTicks,
		labelStride: labelStride,
		stationBounds: stationBounds,
		plotX: plotX,
		plotY: plotY
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
