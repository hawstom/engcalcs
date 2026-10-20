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
		fit: function () { zoomExtent(); },
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
				out[id] = { shown: !!le.text.textContent && le.text.checkVisibility({ visibilityProperty: true }),
					level: !!le.levelBeside, leader: !!(le.leader && le.leader.style.display !== 'none' && le.leader.style.visibility !== 'hidden'),
					stacked: !!(f && f.stacked), values: f ? f.lines.length : (le.lines || []).length, text: le.text.textContent };
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
					levelInline: 0, levelStacked: 0, levelGrown: 0, N1: [], N1mine: [], N1mine0: [], struck: [], offView: [], node: {}, levelNear: {}, leaderNearOther: 0, pipeShown: {}, ex: { nodeInline: [], levelStacked: [], levelInline: [] }, N3: [], N3node: 0, astray: [], sig: [] },
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
					circles.forEach(function (c) { if (ptSeg(c.x, c.y, g) < c.r - tol) { v.N3.push('L' + l.id + ' leader through ' + c.id); } });
					// a pipe label's leader starts on its pipe, never inside an end node's symbol
					return;
				}
				// No leader: its own pipe must be the nearest, by `amb`.
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
			return v;
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
			var shown = !h.text || (!!h.text.textContent && h.text.checkVisibility({ visibilityProperty: true }));
			a = sc(+e.getAttribute('x1'), +e.getAttribute('y1')); b = sc(+e.getAttribute('x2'), +e.getAttribute('y2'));
			r = h.text ? h.text.getBoundingClientRect() : null; c = svg.getBoundingClientRect();
			dx = (r && shown) ? Math.max(r.left - c.left - b.x, 0, b.x - (r.right - c.left)) : 0;
			dy = (r && shown) ? Math.max(r.top - c.top - b.y, 0, b.y - (r.bottom - c.top)) : 0;
			out.push({ key: key, ext: !!h.external, orphan: !shown, len: Math.hypot(b.x - a.x, b.y - a.y),
				off: [a, b].some(function (p) { return p.x < -2 || p.y < -2 || p.x > W + 2 || p.y > H + 2; }),
				gap: Math.hypot(dx, dy), a: a, b: b, W: W, H: H, rect: r ? { l: r.left - c.left, t: r.top - c.top, r: r.right - c.left, b: r.bottom - c.top } : null });
		}
		doc.nodes.forEach(function (n) { one('N' + n.id, nodeEls[n.id]); });
		doc.links.forEach(function (l) { one('L' + l.id, linkEls[l.id]); });
		return out;
	};
	// **WHOLE-BOX AUDIT** (Perry, 2026-10-20): each drawn label as ONE box, the rectangle round all its
	// rows, not the staircase of rows read() tests. In screen pixels: pairs of labels whose boxes
	// overlap by more than `tolPx`; leaders that run through, or within `clearPx` of, a label box not
	// their own; leaders and external labels that leave the map view.
	window.__lpnForm.audit = function (tolPx, clearPx) {
		var s = state.s, W = svg.clientWidth, H = svg.clientHeight, boxes = [], segs = [], out = { overlaps: [], hits: [], offLeaders: [], offLabels: [] };
		function vis(t) { return !!t && !!t.textContent && t.checkVisibility({ visibilityProperty: true, opacityProperty: true }); }
		function sc(x, y) { return { x: x * s + state.tx, y: y * s + state.ty }; }
		function boxOf(key, t) {
			var b, m, a = 0, ox = 0, oy = 0, cx, cy, dx, dy, rad, p;
			try { b = t.getBBox(); } catch (e) { return; }
			if (!(b.width > 0)) { return; }
			m = /rotate\(([-0-9.e]+)[ ,]+([-0-9.e]+)[ ,]+([-0-9.e]+)\)/.exec(t.getAttribute('transform') || '');
			if (m) { a = +m[1]; ox = +m[2]; oy = +m[3]; }
			rad = a * Math.PI / 180; cx = b.x + b.width / 2; cy = b.y + b.height / 2; dx = cx - ox; dy = cy - oy;
			if (a) { cx = ox + dx * Math.cos(rad) - dy * Math.sin(rad); cy = oy + dx * Math.sin(rad) + dy * Math.cos(rad); }
			p = sc(cx, cy);
			boxes.push({ key: key, cx: p.x, cy: p.y, w: b.width * s, h: b.height * s, a: rad });
		}
		function leaderOf(key, h) {
			var e = h && h.leader;
			if (!e || e.style.display === 'none' || e.style.visibility === 'hidden' || e.getAttribute('x1') == null || !vis(h.text)) { return; }
			var p = sc(+e.getAttribute('x1'), +e.getAttribute('y1')), q = sc(+e.getAttribute('x2'), +e.getAttribute('y2'));
			segs.push({ key: key, ax: p.x, ay: p.y, bx: q.x, by: q.y, ext: !!h.external });
		}
		doc.nodes.forEach(function (n) { var h = nodeEls[n.id]; if (h && !h.empty && vis(h.text)) { boxOf('n' + n.id, h.text); leaderOf('n' + n.id, h); } });
		doc.links.forEach(function (l) {
			var h = linkEls[l.id];
			if (!h || h.empty || !vis(h.text)) { return; }
			boxOf('l' + l.id, h.text); leaderOf('l' + l.id, h);
			(h.repeats || []).forEach(function (r) { if (vis(r.text)) { boxOf('l' + l.id, r.text); } });
		});
		doc.labels.forEach(function (lb) { var te = labelEls[lb.id]; if (te && vis(te.text)) { boxOf('t' + lb.id, te.text); } });
		function onView(b) { return b.cx + b.w / 2 > 0 && b.cx - b.w / 2 < W && b.cy + b.h / 2 > 0 && b.cy - b.h / 2 < H; }
		boxes = boxes.filter(onView);
		function proj(b, ax) {
			var c = b.cx * ax[0] + b.cy * ax[1], e = Math.abs(b.w / 2 * (Math.cos(b.a) * ax[0] + Math.sin(b.a) * ax[1])) +
				Math.abs(b.h / 2 * (-Math.sin(b.a) * ax[0] + Math.cos(b.a) * ax[1]));
			return [c - e, c + e];
		}
		function depth(p, q) {
			var d = Infinity;
			[p, q].forEach(function (b) {
				[[Math.cos(b.a), Math.sin(b.a)], [-Math.sin(b.a), Math.cos(b.a)]].forEach(function (ax) {
					var u = proj(p, ax), w = proj(q, ax); d = Math.min(d, Math.min(u[1], w[1]) - Math.max(u[0], w[0]));
				});
			});
			return d;
		}
		function local(b, x, y) { var dx = x - b.cx, dy = y - b.cy; return { x: dx * Math.cos(-b.a) - dy * Math.sin(-b.a), y: dx * Math.sin(-b.a) + dy * Math.cos(-b.a) }; }
		function segInBox(g, b, c) {
			var p = local(b, g.ax, g.ay), q = local(b, g.bx, g.by), hw = b.w / 2 + c, hh = b.h / 2 + c, dx = q.x - p.x, dy = q.y - p.y, t0 = 0, t1 = 1,
				P = [-dx, dx, -dy, dy], Q = [p.x + hw, hw - p.x, p.y + hh, hh - p.y], i, r;
			for (i = 0; i < 4; i++) {
				if (P[i] === 0) { if (Q[i] < 0) { return false; } continue; }
				r = Q[i] / P[i];
				if (P[i] < 0) { if (r > t1) { return false; } if (r > t0) { t0 = r; } } else { if (r < t0) { return false; } if (r < t1) { t1 = r; } }
			}
			return t1 - t0 > 1e-6;
		}
		var i, j;
		for (i = 0; i < boxes.length; i++) {
			for (j = i + 1; j < boxes.length; j++) {
				if (boxes[i].key === boxes[j].key) { continue; }
				var d = depth(boxes[i], boxes[j]);
				if (d > tolPx) { out.overlaps.push(boxes[i].key + '~' + boxes[j].key + ' ' + d.toFixed(1)); }
			}
		}
		segs.forEach(function (g) {
			if ([[g.ax, g.ay], [g.bx, g.by]].some(function (p) { return p[0] < -2 || p[1] < -2 || p[0] > W + 2 || p[1] > H + 2; })) { out.offLeaders.push(g.key + (g.ext ? ' ext' : '')); }
			boxes.forEach(function (b) {
				if (b.key === g.key) { return; }
				var p = local(b, g.ax, g.ay);
				// a leader that starts inside a box is that box's overlap with the label's point, not a leader through it
				if (Math.abs(p.x) <= b.w / 2 && Math.abs(p.y) <= b.h / 2) { return; }
				if (segInBox(g, b, clearPx)) { out.hits.push(g.key + '>' + b.key + (g.ext ? ' ext' : '')); }
			});
		});
		function offMap(key, h) {
			if (!h || !h.external || !vis(h.text)) { return; }
			var r = h.text.getBoundingClientRect(), c = svg.getBoundingClientRect();
			if (r.left < c.left - 1 || r.right > c.right + 1 || r.top < c.top - 1 || r.bottom > c.bottom + 1) { out.offLabels.push(key); }
		}
		doc.nodes.forEach(function (n) { offMap('n' + n.id, nodeEls[n.id]); });
		doc.links.forEach(function (l) { offMap('l' + l.id, linkEls[l.id]); });
		return out;
	};
	// eslint-disable-next-line no-eval
	window.__lpnForm.ev = function (src) { return eval(src); };
