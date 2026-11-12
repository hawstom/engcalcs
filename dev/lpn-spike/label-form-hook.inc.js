	// label-form-wheel-browser-harness.js's handles, injected into js/looped-network.js on its way to
	// the browser. Reads the drawing, in world units, from the glyphs.
	window.__lpnForm = {
		fields: function (nodeF, linkF) {
			Object.keys(labelSettings.node).concat(nodeF).forEach(function (k) { labelSettings.node[k] = nodeF.indexOf(k) >= 0; });
			Object.keys(labelSettings.link).concat(linkF).forEach(function (k) { labelSettings.link[k] = linkF.indexOf(k) >= 0; });
			settings.alignPipeLabels = true;
			saveToStorage(); requestLabelRefresh();
		},
		solved: function () { return !!lastSolveResult; },
		inlineTrial: function () { return lastInlineTrial; },
		crossShed: function () { return lastCrossingShed; },
		nodeLeaders: function (ids) {
			var o = {};
			ids.forEach(function (id) { var ne = nodeEls[id]; o[id] = !!(ne && ne.leader && ne.leader.style.display !== 'none' && ne.leader.style.visibility !== 'hidden' && ne.leader.getAttribute('x1') != null); });
			return o;
		},
		shedEntries: function () { return lastShedEntries; },
		// Why a hidden node label found no one-line place: the final ground, the label set in once with each
		// constraint of the one-line trial taken off in turn. Returns which variants find a side.
		whyNode: function (id) {
			var g = lastFinalGround, n = nodeById(id), ne = nodeEls[id], fs = effectiveFontSize(), pad = fs * LPN_ALIGNED_PAD_FRAC, s0 = state.s || 1, out = {}, min = leaderThreshold(), reqs, m, base, key = nodeLabelKey(id);
			reqs = measureLevelForms([{ lines: ne.allLines, stacked: false }], fs); m = reqs[0].m;
			base = Object.assign({}, g.nodeLabels.filter(function (q) { return q.id === key; })[0] || { id: key, anchor: nodeAt(n), home: nodeLabelBase(n), priority: 1, dragged: false }, inlineNodeSpec(n, fs, m.wPx / s0), { takeYield: true });
			function ground() {
				var gr = { boxes: g.obs.boxes.slice().concat(viewFrameBoxes()), segments: g.obs.segments.slice() };
				ringForeigners(g.placed).forEach(function (f) { f.boxes.forEach(function (b) { gr.boxes.push(b); }); if (f.leader) { gr.segments.push(f.leader); } });
				g.nodePlaced.forEach(function (r) { var sp = g.nodeLabels.filter(function (q) { return q.id === r.id; })[0]; if (r.dropped || !sp || r.id === key) { return; } (r.boxes || (r.box ? [r.box] : [])).forEach(function (b) { gr.boxes.push(Object.assign({}, b)); }); if (Math.hypot(r.x - sp.anchor.x, r.y - sp.anchor.y) > min) { gr.segments.push(Collide.segment(sp.anchor.x, sp.anchor.y, r.x, r.y, 'leader', r.id)); } });
				return gr;
			}
			function tryIt(name, mod, opts) {
				var spec = Object.assign({}, base, mod || {}), r = Collide.placeLabelsFirstFit([spec], ground(), Object.assign({ pad: pad, lastPad: pad, strict: true, leaderMin: min }, opts || {}))[0];
				out[name] = r && !r.dropped ? { x: Math.round((r.x - spec.anchor.x) * s0), y: Math.round((r.y - spec.anchor.y) * s0) } : null;
			}
			tryIt('asTried');
			tryIt('noLinkMargin', { linkMargin: 0 });
			tryIt('onLinks', { offLinks: false, linkMargin: 0 });
			tryIt('noLeaderClean', { leaderClean: false });
			tryIt('nonStrict', { linkMargin: 0, offLinks: false }, { strict: false });
			(function () {
				var a = nodeAt(n), d = defaultLabelOffset(), home = Math.hypot(d.x, d.y), far = [], k;
				[12, 16, 20, 28].forEach(function (reachTH) {
					var sides = Collide.polarCandidates(a, { start: 0, end: 359.99 }, home, fs * reachTH, { rings: 8, tol: 0, max: 600, angleStep: 10 });
					tryIt('anyAngle' + reachTH + 'TH', { sides: sides, linkMargin: 2 / s0 });
					tryIt('far' + reachTH + 'permissive', { sides: sides, offLinks: false, linkMargin: 0 }, { strict: false });
					tryIt('far' + reachTH + 'noLeaderClean', { sides: sides, leaderClean: false, linkMargin: 0 });
					tryIt('anyAngle' + reachTH + 'THstack', { sides: sides, linkMargin: 2 / s0, w: (ne.rowWPx ? Math.max.apply(null, ne.rowWPx) : 100) / s0 * 0 + base.w * 0.35, h: dataLabelBoxHeight(5) });
				});
			}());
			(function () {
				var a = nodeAt(n), d = defaultLabelOffset(), home = Math.hypot(d.x, d.y), gr = ground(), sides = Collide.polarCandidates(a, { start: 0, end: 359.99 }, home, fs * 8, { rings: 8, tol: 0, max: 600, angleStep: 10 }), tally = {}, free = 0;
				var spec = Object.assign({}, base, { sides: sides });
				sides.forEach(function (c) {
					var bs = Collide.labelLineBoxes(spec, c), hit = null;
					bs.forEach(function (b) { gr.boxes.forEach(function (o) { if (!hit && o.w > 0 && Collide.boxOverlapDepth(Collide.box(b.cx, b.cy, b.w + 2 * pad, b.h + 2 * pad, b.a), o) > 0) { hit = (o.kind || '?') + (o.owner ? ':' + o.owner : o.linkOwner ? ':l' + o.linkOwner : ''); } }); });
					if (!hit) { free++; var g2 = Collide.segment(a.x, a.y, c.x, c.y, 'leader', key), why = null; gr.boxes.forEach(function (o) { if (!why && o.w > 0 && o.owner !== key && Collide.segmentInBoxFraction(g2, o) > 0) { why = 'leaderThru ' + (o.kind || '?') + (o.owner ? ':' + o.owner : o.linkOwner ? ':l' + o.linkOwner : ''); } }); gr.segments.forEach(function (o) { if (!why && o.kind === 'leader' && o.owner !== key && Collide.segmentsCross(g2, o)) { why = 'leaderCross ' + o.owner; } }); hit = why ? why : 'FREE'; }
					tally[hit] = (tally[hit] || 0) + 1;
				});
				out.tally8TH = { n: sides.length, free: free, why: tally };
			}());
			out.stackCands = (g.nodeLabels.filter(function (q) { return q.id === key; })[0] || {}).sides ? g.nodeLabels.filter(function (q) { return q.id === key; })[0].sides.length : null;
			return out;
		},
		// Every drawn leader that runs through a row of another label (Task 812). A row is the tspan that carries an x
		// and the ones after it; a leader is tested as the segment it is, against the rows as the glyphs fill them,
		// not against the box round a ragged stack. Labels set along a pipe (rotated) are left out, as the bbox audit did.
		leaderStrikes: function () {
			var c = svg.getBoundingClientRect(), L = [], R = [], out = [];
			function vis(t) { return !!t && !!t.textContent && t.checkVisibility({ visibilityProperty: true, opacityProperty: true }); }
			function rows(t) {
				var res = [], cur = null, ts = t.querySelectorAll('tspan'), i, r;
				for (i = 0; i < ts.length; i++) {
					r = ts[i].getBoundingClientRect();
					if (!(r.width > 0)) { continue; }
					if (ts[i].hasAttribute('x') || !cur) { cur = { l: r.left, t: r.top, r: r.right, b: r.bottom }; res.push(cur); }
					else { cur.l = Math.min(cur.l, r.left); cur.t = Math.min(cur.t, r.top); cur.r = Math.max(cur.r, r.right); cur.b = Math.max(cur.b, r.bottom); }
				}
				if (!res.length) { r = t.getBoundingClientRect(); res.push({ l: r.left, t: r.top, r: r.right, b: r.bottom }); }
				return res;
			}
			function add(k, h) {
				if (!h) { return; }
				var e = h.leader;
				if (e && e.style.display !== 'none' && e.style.visibility !== 'hidden' && e.getAttribute('x1') != null && (!h.text || vis(h.text))) {
					L.push({ k: k, ax: +e.getAttribute('x1') * state.s + state.tx, ay: +e.getAttribute('y1') * state.s + state.ty, bx: +e.getAttribute('x2') * state.s + state.tx, by: +e.getAttribute('y2') * state.s + state.ty });
				}
				if (h.text && vis(h.text) && !/rotate/.test(h.text.getAttribute('transform') || '')) {
					rows(h.text).forEach(function (r) { R.push({ k: k, l: r.l - c.left, t: r.t - c.top, r: r.r - c.left, b: r.b - c.top }); });
				}
			}
			function hit(g, r) {
				var t0 = 0, t1 = 1, dx = g.bx - g.ax, dy = g.by - g.ay, p = [-dx, dx, -dy, dy], q = [g.ax - r.l - 1, r.r - 1 - g.ax, g.ay - r.t - 1, r.b - 1 - g.ay], k, u;
				for (k = 0; k < 4; k++) {
					if (p[k] === 0) { if (q[k] < 0) { return false; } continue; }
					u = q[k] / p[k];
					if (p[k] < 0) { if (u > t1) { return false; } if (u > t0) { t0 = u; } } else { if (u < t0) { return false; } if (u < t1) { t1 = u; } }
				}
				return t0 < t1;
			}
			doc.nodes.forEach(function (n) { add('N' + n.id, nodeEls[n.id]); });
			doc.links.forEach(function (l) { add('L' + l.id, linkEls[l.id]); });
			L.forEach(function (g) { var seen = {}; R.forEach(function (r) { if (r.k !== g.k && !seen[r.k] && hit(g, r)) { seen[r.k] = true; out.push(g.k + ' through ' + r.k); } }); });
			return out;
		},
		// Every label the last crossing hide hid, and which of them cross nothing in the entries it measured.
		hiddenCrossedAudit: function () {
			var g = lastFinalGround, E = g ? crossingEntries(g.nodeLabels, g.nodePlaced, g.labels, g.placed, g.obs) : [], pairs = EngCalcs.lpnCollide.labelCrossings(E).pairs, inPair = {}, out = { hidden: [], unjustified: [], forms: window.__lpnForm.nodeForms(['161']) };
			pairs.forEach(function (p) { inPair[p[0]] = true; inPair[p[1]] = true; });
			E.forEach(function (e) {
				var h = e.id.charAt(0) === 'n' ? nodeEls[e.id.slice(2)] : linkEls[e.id.slice(2)];
				if (h && h.hiddenCrossed) { out.hidden.push(e.id); if (!inPair[e.id]) { out.unjustified.push(e.id); } }
			});
			return out;
		},
		fit: function () { zoomExtent(); },
		// Pipe labels in the view, counted as drawn: shown, fields shown of fields asked, shed (shown with
		// fewer fields than asked), hidden, level, leaders. (Task 812, round 5.)
		pipeFields: function () {
			var c = svg.getBoundingClientRect(), o = { pipes: 0, shown: 0, rows: 0, asked: 0, shed: 0, hidden: 0, level: 0, leaders: 0 }, byId = {};
			doc.nodes.forEach(function (n) { byId[n.id] = n; });
			function inV(p) { var x = p.x * state.s + state.tx, y = p.y * state.s + state.ty; return x >= 0 && x <= c.width && y >= 0 && y <= c.height; }
			doc.links.forEach(function (l) {
				var le = linkEls[l.id], a, b, f, n;
				if (!le || le.empty) { return; }
				a = nodeAt(byId[l.from]); b = nodeAt(byId[l.to]);
				if (!a || !b || !(inV(a) || inV(b))) { return; }
				o.pipes++; o.asked += (le.allLines || le.lines || []).length;
				if (le.text && le.text.textContent && le.text.checkVisibility({ visibilityProperty: true, opacityProperty: true })) {
					f = le.levelBeside && le.levelForm; n = f ? f.lines.length : (le.lines || []).length;
					o.shown++; o.rows += n; if (n < (le.allLines || le.lines || []).length) { o.shed++; }
					if (le.levelBeside) { o.level++; }
					if (le.leader && le.leader.style.display !== 'none' && le.leader.style.visibility !== 'hidden') { o.leaders++; }
				} else { o.hidden++; }
			});
			return o;
		},
		// Every pipe label in the view as drawn: id -> {shown, values, asked, level, leader}. (Task 812, round 6.)
		pipeStates: function () {
			var c = svg.getBoundingClientRect(), o = {}, byId = {};
			doc.nodes.forEach(function (n) { byId[n.id] = n; });
			function inV(p) { var x = p.x * state.s + state.tx, y = p.y * state.s + state.ty; return x >= 0 && x <= c.width && y >= 0 && y <= c.height; }
			doc.links.forEach(function (l) {
				var le = linkEls[l.id], a, b, f, vis;
				if (!le || le.empty) { return; }
				a = nodeAt(byId[l.from]); b = nodeAt(byId[l.to]);
				if (!a || !b || !(inV(a) || inV(b))) { return; }
				vis = !!(le.text && le.text.textContent && le.text.checkVisibility({ visibilityProperty: true, opacityProperty: true }));
				f = le.levelBeside && le.levelForm;
				o[l.id] = { shown: vis, values: vis ? (f ? f.lines.length : (le.lines || []).length) : 0, asked: (le.allLines || le.lines || []).length, level: !!le.levelBeside,
					leader: !!(vis && le.leader && le.leader.style.display !== 'none' && le.leader.style.visibility !== 'hidden'),
					why: vis ? '' : ['hiddenCrowded', 'hiddenBlocked', 'hiddenYielded', 'hiddenCrossed', 'hiddenDropped', 'hiddenShort'].filter(function (k) { return le[k]; }).join('+') || 'other' };
			});
			return o;
		},
		// What holds the ground round a pipe label's middle, for the label with ALL its fields in its one-line and stacked forms:
		// each of the sides (any angle, out to 8 text heights) tried against the final ground, the first blocker tallied. (Task 812, round 6.)
		whyPipe: function (id) {
			var g = lastFinalGround, l = linkById(id), le = linkEls[id], fs = effectiveFontSize(), pts = linkPointList(l), mid = linkLabelMid(l, undefined, pts),
				d = defaultLabelOffset(), home = Math.hypot(d.x, d.y), pad = fs * LPN_LEVEL_PAD_FRAC, key = linkLabelKey(id), out = { forms: [] }, gr, reqs, forms, all;
			gr = { boxes: g.obs.boxes.slice().concat(viewFrameBoxes()), segments: g.obs.segments.slice() };
			g.nodePlaced.forEach(function (r) {
				var sp = g.nodeLabels.filter(function (q) { return q.id === r.id; })[0];
				if (r.dropped || !sp) { return; }
				(r.boxes || (r.box ? [r.box] : [])).forEach(function (b) { var c = Object.assign({}, b); c.tag = r.id; gr.boxes.push(c); });
			});
			g.placed.forEach(function (r) { if (r.dropped || r.id === key) { return; } (r.boxes || (r.box ? [r.box] : [])).forEach(function (b) { var c = Object.assign({}, b); c.tag = r.id; gr.boxes.push(c); }); });
			reqs = levelFormRequests(le); measureLevelForms(reqs, fs + 'px'); forms = levelFormsFrom(reqs);
			all = (le.allLines || le.lines || []).length;
			forms.filter(function (q) { return q.nVal === all; }).forEach(function (f) {
				var sides = Collide.polarCandidates(mid, { start: 0, end: 359.99 }, home, fs * 8, { rings: 8, tol: 0, max: 600, angleStep: 10 }), tally = {}, free = 0,
					spec = { id: key, anchor: mid, home: mid, w: f.w, h: f.h, lines: f.lines, yOff: -fs * 0.85, sides: sides };
				sides.forEach(function (c) {
					var bs = Collide.labelLineBoxes(spec, c), hit = null;
					bs.forEach(function (b) { gr.boxes.forEach(function (o) {
						if (!hit && o.w > 0 && o.kind !== 'link' && Collide.boxOverlapDepth(Collide.box(b.cx, b.cy, b.w + 2 * pad, b.h + 2 * pad, b.a), o) > 0) { hit = (o.kind || '?') + ':' + (o.tag || o.owner || (o.linkOwner !== undefined ? 'L' + o.linkOwner : '') || o.levelOwner || ''); }
					}); });
					if (!hit) {
						var g2 = Collide.segment(mid.x, mid.y, c.x, c.y, 'leader', key), why = null;
						gr.boxes.forEach(function (o) { if (!why && o.w > 0 && (o.kind === 'label' || o.kind === 'levellabel' || o.kind === 'symbol') && Collide.segmentInBoxFraction(g2, o) > 0) { why = 'leaderThru ' + o.kind + ':' + (o.tag || o.owner || o.levelOwner || ''); } });
						gr.segments.forEach(function (o) { if (!why && o.kind === 'leader' && o.owner !== key && Collide.segmentsCross(g2, o)) { why = 'leaderCross ' + o.owner; } });
						if (!why) { free++; }
						hit = why || 'FREE';
					}
					tally[hit] = (tally[hit] || 0) + 1;
				});
				out.forms.push({ values: f.nVal, stacked: !!f.stacked, w: Math.round(f.w * state.s), h: Math.round(f.h * state.s), n: sides.length, free: free, tally: tally });
			});
			return out;
		},
		// The map at Zoom to fit, then `k` wheel notches (1.1 each) in about its middle.
		fitNotch: function (k, around) {
			var p;
			zoomExtent();
			p = around ? nodeAt(nodeById(around)) : window.__lpnForm.centre();
			applyView({ cx: p.x, cy: p.y, s: state.s * Math.pow(1.1, k) });
		},
		// One wheel notch in about `around` (or the middle): the scale times 1.1, nothing else.
		zoomStep: function (around) { var p = around ? nodeAt(nodeById(around)) : window.__lpnForm.centre(); applyView({ cx: p.x, cy: p.y, s: state.s * 1.1 }); },
		zoomOutStep: function (around) { var p = around ? nodeAt(nodeById(around)) : window.__lpnForm.centre(); applyView({ cx: p.x, cy: p.y, s: state.s / 1.1 }); },
		// The zoom bank (Task 812, round 7): buckets held, their size as JSON, hits so far, and a switch for the bank.
		bankStats: function () { var n = Object.keys(labelCache.entries).length, b = 0; Object.keys(labelCache.entries).forEach(function (k) { b += JSON.stringify(labelCache.entries[k]).length; }); return { buckets: n, jsonBytes: b, hits: labelCacheHits }; },
		bankSwitch: function (on) { labelCacheEnabled = !!on; },
		scale: function () { return state.s; },
		linksShown: function () { var o = {}; doc.links.forEach(function (l) { var le = linkEls[l.id]; if (le && le.text && le.text.textContent && le.text.checkVisibility({ visibilityProperty: true, opacityProperty: true })) { o[l.id] = (le.levelBeside ? 'level ' : 'along ') + (le.lines || []).length; } }); return o; },
		rescale: function (s, c) { state.s = s; state.tx = c.tx; state.ty = c.ty; setTransform(); if (state.s !== lastLayoutScale) { onZoomChanged(); } refreshLabelText(); },
		centre: function () { var r = svg.getBoundingClientRect(); return screenToWorld(r.left + r.width / 2, r.top + r.height / 2); },
		allForms: function () { var ids = doc.nodes.map(function (n) { return n.id; }); return window.__lpnForm.nodeForms(ids); },
		viewAt: function (id, s) { var p = nodeAt(nodeById(id)); applyView({ cx: p.x, cy: p.y, s: s }); },
		centerOn: function (id) { var p = nodeAt(nodeById(id)); applyView({ cx: p.x, cy: p.y, s: state.s }); },
		content: function () { refreshLabelText(); },
		timeContent: function (n) {
			var t = [], i, t0;
			for (i = 0; i < n; i++) { t0 = performance.now(); refreshLabelText(); t.push(performance.now() - t0); }
			t.sort(function (a, b) { return a - b; });
			return Math.round(t[t.length >> 1]);
		},
		pipePx: function (id) {
			var l = linkById(id), p = linkPointList(l), d = 0, i;
			for (i = 1; i < p.length; i++) { d += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y); }
			return d * state.s;
		},
		named: function (ids) {
			var out = {};
			ids.forEach(function (id) {
				var le = linkEls[id], f = le && le.levelBeside && le.levelForm;
				if (!le) { out[id] = null; return; }
				out[id] = { shown: !!le.text.textContent && le.text.checkVisibility({ visibilityProperty: true, opacityProperty: true }),
					level: !!le.levelBeside, leader: !!(le.leader && le.leader.style.display !== 'none' && le.leader.style.visibility !== 'hidden'),
					stacked: !!(f && f.stacked), values: f ? f.lines.length : (le.lines || []).length, text: le.text.textContent };
			});
			return out;
		},
		// Node labels' forms, for the open-side browser harness: 'line idehp', 'stack hp', 'hid'.
		nodeForms: function (ids) {
			var out = {};
			ids.forEach(function (id) {
				var ne = nodeEls[id];
				out[id] = !ne ? '-' : (!(ne.text && ne.text.textContent && ne.text.checkVisibility({ visibilityProperty: true, opacityProperty: true })) ? ('hid' + (ne.hiddenDropped ? ' dropped' : '') + (ne.hiddenCrossed ? ' crossed' : '') + (ne.crowdHidden ? ' crowd' : '') + (ne.hiddenBlocked ? ' blocked' : '')) :
					((ne.inline ? 'line ' : 'stack ') + (ne.lines || []).map(function (l) { return l.field.charAt(0); }).join('')));
			});
			return out;
		},
		clipOf: function (key) {
			var h = key.charAt(0) === 'n' ? nodeEls[key.slice(2)] : linkEls[key.slice(2)], r, c = svg.getBoundingClientRect(), x0, y0, x1, y1;
			if (!h || !h.text) { return null; }
			r = h.text.getBoundingClientRect();
			x0 = Math.max(c.left, r.left - 170); y0 = Math.max(c.top, r.top - 110);
			x1 = Math.min(c.right, r.right + 170); y1 = Math.min(c.bottom, r.bottom + 110);
			return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
		},
		read: function (tolPx, ambPx) {
			var s = state.s, W = svg.clientWidth, H = svg.clientHeight, tol = tolPx / s, amb = ambPx / s,
				v = { labels: 0, values: 0, nodes: 0, nodeInline: 0, nodeStacked: 0, pipes: 0, along: 0, level: 0, levelLeader: 0,
					levelInline: 0, levelStacked: 0, levelGrown: 0, N1: [], N1mine: [], N1mine0: [], struck: [], offView: [], node: {}, levelNear: {}, leaderNearOther: 0, pipeShown: {}, ex: { nodeInline: [], levelStacked: [], levelInline: [] }, N3: [], N3node: 0, astray: [], strandedLevel: [], sig: [] },
				items = [], circles = [], texts = [];
			// To a quarter of a screen pixel: a label measured at another zoom differs from one measured
			// at this one in the hundredths of a pixel (the font's hinting), which no reader can see.
			function q(x) { var n = parseFloat(x); return isFinite(n) ? (Math.round(n * s * 4) / 4).toFixed(2) : String(x); }
			function geo(e, names) { return names.map(function (a) { return q(e.getAttribute(a)); }).join(',') + ' ' + (e.getAttribute('text-anchor') || ''); }
			function inView(p) { var x = p.x * s + state.tx, y = p.y * s + state.ty; return x >= 0 && x <= W && y >= 0 && y <= H; }
			function vis(t) { return !!t && !!t.textContent && t.checkVisibility({ visibilityProperty: true, opacityProperty: true }); }
			function leaderOf(h) {
				var e = h.leader;
				if (!e || e.style.display === 'none' || e.style.visibility === 'hidden' || e.getAttribute('x1') == null) { return null; }
				return { ax: +e.getAttribute('x1'), ay: +e.getAttribute('y1'), bx: +e.getAttribute('x2'), by: +e.getAttribute('y2') };
			}
			// The rows of a <text> as drawn: each row's tspans' own boxes, turned by the text's rotation.
			function rowsOf(t) {
				var m = /rotate\(([-0-9.e]+)[ ,]+([-0-9.e]+)[ ,]+([-0-9.e]+)\)/.exec(t.getAttribute('transform') || ''),
					a = m ? +m[1] : 0, ox = m ? +m[2] : 0, oy = m ? +m[3] : 0, rows = [], cur = null, i, c, b, rad = a * Math.PI / 180;
				for (i = 0; i < t.childNodes.length; i++) {
					c = t.childNodes[i];
					if (c.nodeType !== 1) { continue; }
					try { b = c.getBBox(); } catch (e) { continue; }
					if (!(b.width > 0)) { continue; }
					if (c.getAttribute('x') != null || !cur) { cur = { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height }; rows.push(cur); }
					else { cur.x0 = Math.min(cur.x0, b.x); cur.y0 = Math.min(cur.y0, b.y); cur.x1 = Math.max(cur.x1, b.x + b.width); cur.y1 = Math.max(cur.y1, b.y + b.height); }
				}
				return rows.map(function (r) {
					var cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2, dx = cx - ox, dy = cy - oy;
					if (a) { cx = ox + dx * Math.cos(rad) - dy * Math.sin(rad); cy = oy + dx * Math.sin(rad) + dy * Math.cos(rad); }
					return { cx: cx, cy: cy, w: r.x1 - r.x0, h: r.y1 - r.y0, a: rad };
				});
			}
			function axes(b) { return [[Math.cos(b.a), Math.sin(b.a)], [-Math.sin(b.a), Math.cos(b.a)]]; }
			function proj(b, ax) {
				var c = b.cx * ax[0] + b.cy * ax[1], e = Math.abs(b.w / 2 * (Math.cos(b.a) * ax[0] + Math.sin(b.a) * ax[1])) +
					Math.abs(b.h / 2 * (-Math.sin(b.a) * ax[0] + Math.cos(b.a) * ax[1]));
				return [c - e, c + e];
			}
			function depth(p, q) {
				var d = Infinity;
				axes(p).concat(axes(q)).forEach(function (ax) {
					var u = proj(p, ax), w = proj(q, ax);
					d = Math.min(d, Math.min(u[1], w[1]) - Math.max(u[0], w[0]));
				});
				return d;
			}
			// A point's distance into a box, in the box's frame: >0 outside.
			function ptBox(px, py, b) {
				var dx = px - b.cx, dy = py - b.cy, x = dx * Math.cos(-b.a) - dy * Math.sin(-b.a), y = dx * Math.sin(-b.a) + dy * Math.cos(-b.a);
				return Math.hypot(Math.max(Math.abs(x) - b.w / 2, 0), Math.max(Math.abs(y) - b.h / 2, 0));
			}
			function ptSeg(px, py, g) {
				var vx = g.bx - g.ax, vy = g.by - g.ay, L = vx * vx + vy * vy, u = L ? ((px - g.ax) * vx + (py - g.ay) * vy) / L : 0;
				u = Math.max(0, Math.min(1, u));
				return Math.hypot(g.ax + vx * u - px, g.ay + vy * u - py);
			}
			function segBox(g, b) {
				// distance from a segment to an unrotated box (level labels are level)
				var x0 = b.cx - b.w / 2, x1 = b.cx + b.w / 2, y0 = b.cy - b.h / 2, y1 = b.cy + b.h / 2, i, d = Infinity, n = 24, x, y;
				for (i = 0; i <= n; i++) {
					x = g.ax + (g.bx - g.ax) * i / n; y = g.ay + (g.by - g.ay) * i / n;
					d = Math.min(d, Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1)));
				}
				[[x0, y0], [x0, y1], [x1, y0], [x1, y1]].forEach(function (p) { d = Math.min(d, ptSeg(p[0], p[1], g)); });
				return d;
			}
			// Does a segment enter an unrotated box (Liang-Barsky)?
			function segHits(g, b) {
				var x0 = b.cx - b.w / 2, x1 = b.cx + b.w / 2, y0 = b.cy - b.h / 2, y1 = b.cy + b.h / 2,
					dx = g.bx - g.ax, dy = g.by - g.ay, t0 = 0, t1 = 1, p = [-dx, dx, -dy, dy], qq = [g.ax - x0, x1 - g.ax, g.ay - y0, y1 - g.ay], i, r;
				for (i = 0; i < 4; i++) {
					if (p[i] === 0) { if (qq[i] < 0) { return false; } continue; }
					r = qq[i] / p[i];
					if (p[i] < 0) { if (r > t1) { return false; } if (r > t0) { t0 = r; } } else { if (r < t0) { return false; } if (r < t1) { t1 = r; } }
				}
				return t0 <= t1;
			}
			doc.nodes.forEach(function (n) {
				var ne = nodeEls[n.id];
				if (ne && ne.circle) { circles.push({ id: n.id, x: +ne.circle.getAttribute('cx'), y: +ne.circle.getAttribute('cy'), r: +ne.circle.getAttribute('r') }); }
			});
			doc.labels.forEach(function (lb) {
				var te = labelEls[lb.id];
				if (te && te.text && vis(te.text)) { rowsOf(te.text).forEach(function (b) { texts.push({ id: lb.id, b: b }); }); }
			});
			doc.nodes.forEach(function (n) {
				var ne = nodeEls[n.id], k = (ne && ne.lines) ? ne.lines.length : 0, g;
				if (!ne || ne.empty || !ne.text || !inView(nodeAt(n))) { return; }
				if (!vis(ne.text)) { v.sig.push('n' + n.id + ' hidden'); v.node[n.id] = { n: 0, id: false }; return; }
				v.node[n.id] = { n: k, id: (ne.lines || []).some(function (ln) { return ln.field === 'id'; }) };
				v.sig.push('n' + n.id + ' ' + geo(ne.text, ['x', 'y']) + ' ' + ne.text.textContent + ' ' +
					(leaderOf(ne) ? geo(ne.leader, ['x1', 'y1', 'x2', 'y2']) : ''));
				v.nodes++; v.values += k;
				if (k > 1) { if (ne.inline) { v.nodeInline++; v.ex.nodeInline.push(n.id); } else { v.nodeStacked++; } }
				var nrows = rowsOf(ne.text);
				items.push({ key: 'N' + n.id, rows: nrows, mine: !!ne.inline });
				if (ne.inline) {
					// A pipe through a one-line label strikes it through; and the label lies on the map,
					// clear of the map's furniture (its legends, the strips and the chip).
					doc.links.forEach(function (m) {
						var p = linkPointList(m), i2;
						for (i2 = 1; i2 < p.length; i2++) {
							if (nrows.some(function (b) { return segHits({ ax: p[i2 - 1].x, ay: p[i2 - 1].y, bx: p[i2].x, by: p[i2].y }, b); })) {
								v.struck.push('N' + n.id + ' crossed by ' + m.id); return;
							}
						}
					});
					var br = ne.text.getBoundingClientRect(), cr = svg.getBoundingClientRect(), fr = mapFurnitureRects(cr);
					if (br.left < cr.left - 1 || br.right > cr.right + 1 || br.top < cr.top - 1 || br.bottom > cr.bottom + 1) { v.offView.push('N' + n.id + ' off the map'); }
					fr.forEach(function (f) {
						if (br.right - cr.left > f.l && br.left - cr.left < f.r && br.bottom - cr.top > f.t && br.top - cr.top < f.b) { v.offView.push('N' + n.id + ' under map furniture'); }
					});
				}
				g = leaderOf(ne);
				if (g) {
					circles.forEach(function (c) {
						// A symbol over the leader's own start is the placement's own exemption (two nodes
						// drawn on one another, leaderThroughSymbol()): not a crossing.
						if (c.id === n.id || ptSeg(c.x, c.y, g) >= c.r - tol || (Math.abs(c.x - g.ax) <= c.r && Math.abs(c.y - g.ay) <= c.r)) { return; }
						if (ne.inline) { v.N3.push('N' + n.id + ' leader through ' + c.id); } else { v.N3node++; }
					});
				}
			});
			doc.links.forEach(function (l) {
				var le = linkEls[l.id], f, g, rows;
				if (!le || le.empty || !le.text || !inView(linkLabelMid(l))) { return; }
				f = le.levelBeside && le.levelForm;
				if (!vis(le.text)) { v.sig.push('l' + l.id + ' hidden'); return; }
				v.pipeShown[l.id] = true;
				v.sig.push('l' + l.id + ' ' + geo(le.text, ['x', 'y']) + ' ' + (le.text.getAttribute('transform') || '').replace(/[-0-9.e]+/g, q) + ' ' +
					le.text.textContent + ' ' + (leaderOf(le) ? geo(le.leader, ['x1', 'y1', 'x2', 'y2']) : ''));
				v.pipes++; v.values += f ? f.lines.length : (le.lines || []).length;
				rows = rowsOf(le.text);
				(le.repeats || []).forEach(function (r) { if (vis(r.text)) { rows = rows.concat(rowsOf(r.text)); } });
				items.push({ key: 'L' + l.id, rows: rows, mine: !!le.levelBeside });
				if (!le.levelBeside) { v.along++; return; }
				v.level++;
				if (f && f.stacked) { v.levelStacked++; v.ex.levelStacked.push(l.id); } else { v.levelInline++; if (leaderOf(le)) { v.ex.levelInline.push(l.id); } }
				if (f && f.lines.length > (le.lines || []).length) { v.levelGrown++; }
				g = leaderOf(le);
				var own = Infinity, other = Infinity, who = '';
				doc.links.forEach(function (m) {
					var p = linkPointList(m), d = Infinity, i;
					for (i = 1; i < p.length; i++) {
						rows.forEach(function (b) { d = Math.min(d, segBox({ ax: p[i - 1].x, ay: p[i - 1].y, bx: p[i].x, by: p[i].y }, b)); });
					}
					if (m.id === l.id) { own = d; } else if (d < other) { other = d; who = m.id; }
				});
				// Whose pipe is nearest its rows, leader or not (a label nearer another pipe than its own
				// reads as that pipe's even with a leader): counted, and named labels are asserted.
				v.levelNear[l.id] = { own: +(own * s).toFixed(1), other: +(other * s).toFixed(1), who: who, leader: !!g };
				if (g) {
					v.levelLeader++;
					if (other < own) { v.leaderNearOther++; }
					// The symbol a leader starts in is not in its way: a pipe shorter than its end symbols has its middle inside them (round 5).
					circles.forEach(function (c) { if (Math.hypot(c.x - g.ax, c.y - g.ay) < c.r) { return; } if (ptSeg(c.x, c.y, g) < c.r - tol) { v.N3.push('L' + l.id + ' leader through ' + c.id); } });
					return;
				}
				// No leader: its own pipe must be the nearest, by `amb`. Except a label whose leader would have run
				// through another label (dropStruckLeaders()): it keeps its place and goes without, counted in `strandedLevel`.
				if (linkEls[l.id].leaderStruck) { if (other <= own + amb) { v.strandedLevel.push(l.id); } return; }
				if (other <= own + amb) { v.astray.push(l.id + '(' + (own * s).toFixed(1) + ' px vs ' + who + ' ' + (other * s).toFixed(1) + ')'); }
			});
			// N1: rows of two labels, a row on a node symbol, a row on a Text item.
			items.forEach(function (it, i) {
				it.rows.forEach(function (b) {
					var j;
					for (j = i + 1; j < items.length; j++) {
						items[j].rows.forEach(function (c) {
							var d = depth(b, c);
							if (d > tol) { v.N1.push(it.key + ' on ' + items[j].key + ' ' + (d * s).toFixed(1) + ' px'); if (it.mine || items[j].mine) { v.N1mine.push(v.N1[v.N1.length - 1]); } }
							// Ours against any label, held to a quarter pixel: glyph boxes that touch.
							if ((it.mine || items[j].mine) && d > 0.25 / s) { v.N1mine0.push(it.key + ' on ' + items[j].key + ' ' + (d * s).toFixed(2) + ' px'); }
						});
					}
					circles.forEach(function (c) { if (ptBox(c.x, c.y, b) < c.r - tol) { v.N1.push(it.key + ' on node ' + c.id); if (it.mine) { v.N1mine.push(v.N1[v.N1.length - 1]); } } });
					texts.forEach(function (t) { var d = depth(b, t.b); if (d > tol) { v.N1.push(it.key + ' on Text ' + t.id + ' ' + (d * s).toFixed(1) + ' px'); if (it.mine) { v.N1mine.push(v.N1[v.N1.length - 1]); } } });
				});
			});
			v.labels = v.nodes + v.pipes;
			v.sig = v.sig.join('\n');
			v.scale = s; v.centre = { tx: state.tx, ty: state.ty }; v.nodesAll = window.__lpnForm.allForms(); v.linksAll = window.__lpnForm.linksShown(); return v;
		}
	};
	window.__lpnForm.perf = function () {
		perfDebugSums = {}; var t0 = performance.now(); refreshLabelText(); var o = perfDebugSums || {}; o.total = performance.now() - t0; perfDebugSums = null;
		var r = {}; Object.keys(o).forEach(function (k) { r[k.trim()] = Math.round(o[k]); }); return r;
	};
	// Every leader drawn, in screen pixels: its two ends, its length, whether an end is off the map
	// view, and how far its label's words are from its far end. For label-leader-bound-browser-harness.js.
	window.__lpnForm.leaders = function () {
		var W = svg.clientWidth, H = svg.clientHeight, out = [];
		function sc(x, y) { return { x: x * state.s + state.tx, y: y * state.s + state.ty }; }
		function one(key, h) {
			var e = h && h.leader, a, b, r, c, dx, dy;
			if (!e || e.style.display === 'none' || e.style.visibility === 'hidden' || e.getAttribute('x1') == null) { return; }
			var shown = !h.text || (!!h.text.textContent && h.text.checkVisibility({ visibilityProperty: true, opacityProperty: true }));
			a = sc(+e.getAttribute('x1'), +e.getAttribute('y1')); b = sc(+e.getAttribute('x2'), +e.getAttribute('y2'));
			r = h.text ? h.text.getBoundingClientRect() : null; c = svg.getBoundingClientRect();
			dx = (r && shown) ? Math.max(r.left - c.left - b.x, 0, b.x - (r.right - c.left)) : 0;
			dy = (r && shown) ? Math.max(r.top - c.top - b.y, 0, b.y - (r.bottom - c.top)) : 0;
			out.push({ key: key, orphan: !shown, len: Math.hypot(b.x - a.x, b.y - a.y),
				off: [a, b].some(function (p) { return p.x < -2 || p.y < -2 || p.x > W + 2 || p.y > H + 2; }),
				gap: Math.hypot(dx, dy), a: a, b: b, W: W, H: H, rect: r ? { l: r.left - c.left, t: r.top - c.top, r: r.right - c.left, b: r.bottom - c.top } : null });
		}
		doc.nodes.forEach(function (n) { one('N' + n.id, nodeEls[n.id]); });
		doc.links.forEach(function (l) { one('L' + l.id, linkEls[l.id]); });
		return out;
	};
	// eslint-disable-next-line no-eval
	window.__lpnForm.ev = function (src) { return eval(src); };
