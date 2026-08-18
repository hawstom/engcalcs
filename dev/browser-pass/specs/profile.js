// §16 — the profile view (ROADMAP Task 409).
//
// WHAT IS HERE AND WHY IT IS NOT IN THE HARNESS. `dev/lpn-spike/profile-harness.js` owns the route,
// the stations and the axis bounds — every part with an exact answer. Three things are left, and
// all three are facts about a real page:
//
//   1. **The pane is on the screen and the page still does not scroll.** Since Task 434 the profile
//      is a tab in the bottom pane, which is in normal flow under the map -- so the thing that can
//      go wrong is no longer a panel at a static position, it is the map and the pane together
//      being taller than the window. Only a real layout can answer that.
//   2. **The two heads are read in DIFFERENT UNITS** (Task 422). A node's elevation is a typed
//      number in the INPUT head unit; a solved head comes back in the RESULT head unit, and since
//      that task they can be set differently. They share one axis. Nothing headless crosses that
//      boundary — the stub has no unit strip — so this is where it gets checked: set the two
//      selects to feet and metres and the drawing must still be one consistent picture.
//   3. **It updates LIVE.** The redraw is supposed to hang off the solve and off the path controls,
//      not off a button. Changing a stop, clicking a waypoint on the map, and switching a unit all
//      have to move the drawing without anything else being touched.

const { Session } = require('../lib/session');

exports.title = '16. Profile';

// Every tick label on the y axis, as numbers. They are what the reader actually sees, and the
// truncation claim is a claim about the smallest of them.
async function yTicks(page) {
	return page.evaluate(() => {
		const svg = document.querySelector('#lpn_profile_chart svg');
		if (!svg) { return null; }
		// The y labels are the ones anchored at the END (right-aligned against the axis); the x
		// labels are anchored in the middle.
		return [...svg.querySelectorAll('text.lpn-profile-tick')]
			.filter(t => t.getAttribute('text-anchor') === 'end')
			.map(t => parseFloat(t.textContent));
	});
}
async function chartShape(page) {
	return page.evaluate(() => {
		const svg = document.querySelector('#lpn_profile_chart svg');
		if (!svg) { return null; }
		return {
			ground: [...svg.querySelectorAll('polyline.lpn-profile-ground')].map(p => p.getAttribute('points')).join('|'),
			hgl: [...svg.querySelectorAll('polyline.lpn-profile-hgl')].map(p => p.getAttribute('points')).join('|'),
			bands: svg.querySelectorAll('polygon.lpn-profile-band').length,
			nodes: [...svg.querySelectorAll('text.lpn-profile-nodeid')].map(t => t.textContent),
			note: (document.getElementById('lpn_profile_note') || {}).textContent || ''
		};
	});
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();

		// A real network with real elevations. Net1 sits ~700 ft above its datum, which is what
		// makes the truncation check below mean something.
		const opened = await a.page.evaluate(async () => {
			const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
			const card = cards.find(c => /Net1/.test(c.textContent));
			if (!card) { return false; }
			card.click();
			return true;
		});
		report.ok(opened, 'the examples gallery offers Net1');
		await a.settle(900);

		const rows = await a.menuRows('view');
		report.ok(rows.some(r => r.label === 'Profile'), 'View carries a Profile row',
			rows.map(r => r.label).join(' | '));
		await a.menuClick('Profile', 'view');
		await a.settle(400);

		// **1. THE PANE IS ON THE SCREEN, AND THE PAGE STILL FITS THE WINDOW.** The pane takes its
		// room from the canvas by MEASUREMENT (applyMapHeight reads body.bottom - svg.bottom), so
		// the way this feature breaks is the map failing to give the room back: the pane lands below
		// the fold, or the page grows a scrollbar it is not allowed to have (Task 432).
		const box = await a.page.evaluate(() => {
			const p = document.getElementById('lpn_pane');
			if (!p) { return null; }
			const r = p.getBoundingClientRect(), c = document.getElementById('lpn_canvas').getBoundingClientRect();
			return { shown: p.style.display === 'flex', x: r.x, y: r.y, w: r.width, h: r.height,
				top: r.top, bottom: r.bottom, canvasBottom: c.bottom, canvasH: c.height,
				scrollH: document.documentElement.scrollHeight,
				vw: window.innerWidth, vh: window.innerHeight };
		});
		report.ok(box && box.shown, 'the pane opens');
		report.ok(box && box.bottom <= box.vh + 1 && box.top < box.vh,
			'...fully inside the window, below the map', box && JSON.stringify(box));
		report.ok(box && box.w > 200 && box.h > 150, 'and it has real size', box && (box.w + 'x' + box.h));
		report.ok(box && box.canvasBottom <= box.top + 1, 'the map ends where the pane begins',
			box && (box.canvasBottom + ' / ' + box.top));
		report.ok(box && box.canvasH > 150, 'and the map keeps a canvas worth looking at', box && box.canvasH);
		report.ok(box && box.scrollH <= box.vh + 1, 'the page does not scroll', box && (box.scrollH + ' of ' + box.vh));

		// **THE GRIP RESIZES, AND THE MAP GIVES AND TAKES THE ROOM.** The one property no harness
		// can hold: two measured heights moving in opposite directions by the same amount.
		const dragged = await (async () => {
			const g = await a.page.evaluate(() => {
				const r = document.getElementById('lpn_pane_grip').getBoundingClientRect();
				const c = document.getElementById('lpn_canvas').getBoundingClientRect();
				const b = document.getElementById('lpn_pane_body').getBoundingClientRect();
				return { x: r.x + r.width / 2, y: r.y + r.height / 2, canvas: c.height, pane: b.height };
			});
			await a.page.mouse.move(g.x, g.y);
			await a.page.mouse.down();
			await a.page.mouse.move(g.x, g.y - 80, { steps: 8 });
			await a.page.mouse.up();
			await a.settle(300);
			const after = await a.page.evaluate(() => ({
				canvas: document.getElementById('lpn_canvas').getBoundingClientRect().height,
				pane: document.getElementById('lpn_pane_body').getBoundingClientRect().height,
				scrollH: document.documentElement.scrollHeight, vh: window.innerHeight
			}));
			return { before: g, after: after };
		})();
		report.ok(dragged.after.pane > dragged.before.pane + 40,
			'dragging the grip up makes the pane taller',
			dragged.before.pane + ' → ' + dragged.after.pane);
		report.ok(dragged.after.canvas < dragged.before.canvas - 40,
			'...and the map gives up exactly that room',
			dragged.before.canvas + ' → ' + dragged.after.canvas);
		report.ok(dragged.after.scrollH <= dragged.after.vh + 1, '...with the page still not scrolling',
			dragged.after.scrollH + ' of ' + dragged.after.vh);

		// It opens on a real drawing rather than on two empty pull-downs.
		const first = await chartShape(a.page);
		report.ok(!!first, 'a chart is drawn without the user choosing anything');
		report.ok(first && first.ground.length > 0, 'the ground line is drawn');
		report.ok(first && first.hgl.length > 0, 'the hydraulic grade line is drawn');
		report.ok(first && first.bands > 0, 'the pressure is shaded between them');
		report.ok(first && first.nodes.length >= 3, 'every node on the route is named',
			first && first.nodes.join(' '));

		// **THE TRUNCATION, AS THE READER SEES IT.** Net1's ground starts at 690 ft; an axis whose
		// bottom label is 0 has thrown away two thirds of the drawing. This is the one thing Tom
		// named as the reason epanet-js's profile "chokes at the last steps".
		const ticks = await yTicks(a.page);
		report.ok(ticks && ticks.length >= 3, 'the axis is labelled', ticks && ticks.join(', '));
		report.ok(ticks && Math.min(...ticks) > 100,
			'the axis bottom is TRUNCATED, not anchored at zero', ticks && ('bottom ' + Math.min(...ticks)));

		// **2. TWO HEADS, TWO UNITS (Task 422).** Elevations stay typed in feet; results move to
		// metres. Both are drawn on one axis, so the axis must now be in metres — about 1/3.281 of
		// what it was. A profile that read the elevation as though it were already in the result
		// unit would leave the ground line at ~700 while the grade line dropped to ~300, which is
		// the silent failure this check exists for: it still draws, and it is nonsense.
		await a.page.evaluate(() => {
			const s = document.querySelector('select[name="lpn_u_r_elevhead"]');
			s.value = 'mh2o';
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(900);
		const metric = await yTicks(a.page);
		const shapeM = await chartShape(a.page);
		report.ok(metric && Math.max(...metric) < 500 && Math.max(...metric) > 200,
			'switching the RESULT head unit to metres redraws the whole axis in metres',
			metric && metric.join(', '));
		report.ok(shapeM && shapeM.ground.length > 0 && shapeM.hgl.length > 0,
			'...with BOTH lines still drawn — the ground crossed units with the grade line');
		// The ground is below the grade line everywhere on this network, and that survives the unit
		// change only if both crossed. Read off the drawing: a shaded band still exists.
		report.ok(shapeM && shapeM.bands > 0, '...and the pressure band is still between them');
		await a.page.evaluate(() => {
			const s = document.querySelector('select[name="lpn_u_r_elevhead"]');
			s.value = 'fth2o';
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(900);

		// **3. LIVE, part one: the path controls.** Changing the far end redraws immediately, with
		// no button pressed.
		const before = await chartShape(a.page);
		const changed = await a.page.evaluate(() => {
			const sels = document.querySelectorAll('#lpn_profile_form select');
			const to = sels[1];
			const other = [...to.options].map(o => o.value).filter(v => v !== to.value)[3];
			if (!other) { return null; }
			to.value = other;
			to.dispatchEvent(new Event('change', { bubbles: true }));
			return other;
		});
		await a.settle(300);
		const after = await chartShape(a.page);
		report.ok(!!changed, 'the To pull-down offers the network\'s nodes');
		report.ok(after && before && after.nodes.join() !== before.nodes.join(),
			'changing the end node redraws the profile at once — no Refresh button',
			changed && ('now ends at ' + changed));

		// **3. LIVE, part two: the waypoint gesture.** One checkbox, then a click on the map, and
		// the route bends through that node. This is the whole of the path editing there is, and it
		// exists only in a browser: it is a click on an SVG symbol.
		await a.page.evaluate(() => {
			const cb = document.querySelector('#lpn_profile_form input[type=checkbox]');
			cb.checked = true;
			cb.dispatchEvent(new Event('change', { bubbles: true }));
		});
		// **THE TARGET MUST NOT ALREADY BE ON THE ROUTE**, or the check passes for the wrong
		// reason: adding a waypoint the route already visits correctly changes nothing, and an
		// assertion that the drawing moved would then be asserting an accident of which node was
		// nearest the corner of the window.
		const pre = await chartShape(a.page);
		const target = await a.page.evaluate((onRoute) => {
			const panel = document.getElementById('lpn_pane').getBoundingClientRect();
			const els = [...document.querySelectorAll('[data-node]')];
			for (const e of els) {
				if (onRoute.indexOf(e.dataset.node) >= 0) { continue; }
				const r = e.getBoundingClientRect();
				const x = r.x + r.width / 2, y = r.y + r.height / 2;
				if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) { continue; }
				// Not under the panel, or the click lands on the panel instead of the map.
				if (x > panel.x - 8 && x < panel.x + panel.width + 8 &&
					y > panel.y - 8 && y < panel.y + panel.height + 8) { continue; }
				return { id: e.dataset.node, x: x, y: y };
			}
			return null;
		}, pre.nodes);
		if (!target) {
			report.skip('a waypoint click bends the route',
				'every node off the route is under the panel in this window');
		} else {
			await a.page.mouse.click(target.x, target.y);
			await a.settle(400);
			const post = await chartShape(a.page);
			const chips = await a.page.evaluate(() => [...document.querySelectorAll('#lpn_profile_form button')]
				.map(b => b.textContent));
			report.ok(chips.some(t => t.indexOf(target.id) === 0),
				'clicking a node on the map adds it to the route as a waypoint',
				target.id + ' → ' + chips.join(' '));
			report.ok(post.nodes.indexOf(target.id) >= 0,
				'...and the redrawn profile really passes through it', post.nodes.join(' '));
			report.ok(post.nodes.join() !== pre.nodes.join(),
				'...so the drawing changed, live, from one click on the map',
				pre.nodes.join(' ') + '  →  ' + post.nodes.join(' '));
		}

		// **3. LIVE, part three: an EDIT to the network, not to the path.** This is the check that
		// holds refreshProfileIfOpen()'s call inside applySolveResult(): change a node's elevation
		// in its own popup, and 300 ms later the solve lands and the drawing has to move. Removing
		// that one call leaves the path controls still working and the profile silently stale, which
		// is the failure a person would report as "it was right a minute ago".
		{
			await a.page.evaluate(() => {
				const cb = document.querySelector('#lpn_profile_form input[type=checkbox]');
				cb.checked = false;
				cb.dispatchEvent(new Event('change', { bubbles: true }));
			});
			const beforeEdit = await chartShape(a.page);
			const onRoute = beforeEdit.nodes;
			const spot = await a.page.evaluate((ids) => {
				const panel = document.getElementById('lpn_pane').getBoundingClientRect();
				for (const id of ids) {
					const e = document.querySelector('[data-node="' + id + '"]');
					if (!e) { continue; }
					const r = e.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
					if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) { continue; }
					if (x > panel.x - 8 && x < panel.x + panel.width + 8 &&
						y > panel.y - 8 && y < panel.y + panel.height + 8) { continue; }
					return { id: id, x: x, y: y };
				}
				return null;
			}, onRoute);
			if (!spot) {
				report.skip('an elevation edit redraws the profile', 'every node on the route is under the panel');
			} else {
				await a.page.mouse.click(spot.x, spot.y);
				await a.settle(400);
				const typed = await a.page.evaluate(() => {
					const labels = [...document.querySelectorAll('#lpn_popup label')];
					const lab = labels.find(l => /Elevation/.test(l.textContent));
					const input = lab && lab.querySelector('input[type=number]');
					if (!input) { return null; }
					const was = input.value;
					input.value = String((parseFloat(was) || 0) + 40);
					input.dispatchEvent(new Event('change', { bubbles: true }));
					return { was: was, now: input.value };
				});
				// The solve is debounced 300 ms; wait past it.
				await a.settle(900);
				const afterEdit = await chartShape(a.page);
				report.ok(!!typed, 'the node popup offers its elevation', typed && JSON.stringify(typed));
				report.ok(typed && afterEdit.ground !== beforeEdit.ground,
					'editing an elevation redraws the profile after the solve, with the panel untouched',
					spot.id + ' ' + (typed ? typed.was + ' → ' + typed.now : ''));
			}
		}

		// The pane is modeless: the map is edited underneath it throughout, and closing it leaves
		// nothing behind -- neither the panel nor the route highlight it painted on the map, and the
		// map takes its room back.
		await a.page.click('#lpn_pane_close');
		await a.settle(300);
		const closed = await a.page.evaluate(() => ({
			hidden: document.getElementById('lpn_pane').style.display === 'none',
			route: document.querySelectorAll('#lpn_canvas .lpn-profile-path').length,
			canvas: document.getElementById('lpn_canvas').getBoundingClientRect().height,
			scrollH: document.documentElement.scrollHeight, vh: window.innerHeight
		}));
		report.ok(closed.hidden, 'the X closes the pane');
		report.ok(closed.route === 0, '...and takes the route highlight off the map with it');
		report.ok(closed.canvas > dragged.after.canvas, '...and the map gets its room back',
			dragged.after.canvas + ' → ' + closed.canvas);
		report.ok(closed.scrollH <= closed.vh + 1, '...with the page still not scrolling');

		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.join('\n'));
	} finally {
		await a.context.close();
	}
};
