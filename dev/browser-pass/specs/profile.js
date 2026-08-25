// §16 — the profile view (ROADMAP Task 409).
//
// WHAT IS HERE AND WHY IT IS NOT IN THE HARNESS. `dev/lpn-spike/profile-harness.js` owns the route,
// the stations and the axis bounds — every part with an exact answer. Three things are left, and
// all three are facts about a real page:
//
//   1. **The pane is on the screen and the map and the pane together still end inside the window.**
//      Since Task 434 the profile is a tab in the bottom pane, which is in normal flow under the map
//      -- so the thing that can go wrong is no longer a panel at a static position, it is the two of
//      them summing past the window. Only a real layout can answer that.
//      The measurement is `document.body`'s own bottom, not `documentElement.scrollHeight`: the
//      scroll height is 15 px past the window on this page whatever the pane does, because of a
//      floated empty div in the footer that is not in body's box at all. That is Task 432 and it
//      belongs to **specs/noscroll.js**, which names it, measures it and proves its cause. Asserting
//      it here as well would put a second red line on a fault that is already recorded once.
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

		// **THE DOOR IS PROJECT > PROFILE** (Task 467 moved it out of View, which now holds only the
		// things that change how the map is DRAWN). Updated 2026-08-24, when this spec was found
		// throwing on a View row that no longer exists.
		const rows = await a.menuRows('project');
		report.ok(rows.some(r => r.label === 'Profile'), 'Project carries a Profile row',
			rows.map(r => r.label).join(' | '));
		await a.menuClick('Profile', 'project');
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
				bodyBottom: document.body.getBoundingClientRect().bottom,
				vw: window.innerWidth, vh: window.innerHeight };
		});
		report.ok(box && box.shown, 'the pane opens');
		report.ok(box && box.bottom <= box.vh + 1 && box.top < box.vh,
			'...fully inside the window, below the map', box && JSON.stringify(box));
		report.ok(box && box.w > 200 && box.h > 150, 'and it has real size', box && (box.w + 'x' + box.h));
		report.ok(box && box.canvasBottom <= box.top + 1, 'the map ends where the pane begins',
			box && (box.canvasBottom + ' / ' + box.top));
		report.ok(box && box.canvasH > 150, 'and the map keeps a canvas worth looking at', box && box.canvasH);
		report.ok(box && box.bodyBottom <= box.vh + 1, 'the page ends inside the window',
			box && (Math.round(box.bodyBottom) + ' of ' + box.vh));

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
				bodyBottom: document.body.getBoundingClientRect().bottom, vh: window.innerHeight
			}));
			return { before: g, after: after };
		})();
		report.ok(dragged.after.pane > dragged.before.pane + 40,
			'dragging the grip up makes the pane taller',
			dragged.before.pane + ' → ' + dragged.after.pane);
		report.ok(dragged.after.canvas < dragged.before.canvas - 40,
			'...and the map gives up exactly that room',
			dragged.before.canvas + ' → ' + dragged.after.canvas);
		report.ok(dragged.after.bodyBottom <= dragged.after.vh + 1, '...with the page still ending inside the window',
			Math.round(dragged.after.bodyBottom) + ' of ' + dragged.after.vh);

		// **THE CHART FILLS THE PANE, IN BOTH AXES** (ROADMAP Task 441). Tom, 2026-08-18: *"The
		// Profile still leaves vast empty space on both sides. It should use the entire bottom pane,
		// and its relative height and width should vary to fill the available height and width."*
		//
		// It was a FIXED 560x340 viewBox inside a `width:100%;height:100%` SVG, and
		// preserveAspectRatio's default letterboxes a fixed rectangle inside whatever box it is
		// given — so every pixel the pane was wider than 560/340 of its height became white space at
		// the sides, and it GREW with the pane. Measured as the drawn frame against the host box,
		// because that is the gap a reader actually sees; and measured AGAIN after the pane is
		// dragged, because a layout measured once is a fixed layout with extra steps.
		const fill = async () => a.page.evaluate(() => {
			const host = document.getElementById('lpn_profile_chart');
			const svg = host && host.querySelector('svg');
			const frame = svg && svg.querySelector('rect.lpn-profile-frame');
			if (!host || !svg || !frame) { return null; }
			const h = host.getBoundingClientRect(), f = frame.getBoundingClientRect();
			return {
				hostW: h.width, hostH: h.height,
				svgW: svg.getBoundingClientRect().width, svgH: svg.getBoundingClientRect().height,
				// The plot frame's own share of the host, which is what "vast empty space" is about.
				frameW: f.width, frameH: f.height,
				viewBox: svg.getAttribute('viewBox')
			};
		});
		const f1 = await fill();
		report.ok(!!f1, 'the chart is drawn with a plot frame to measure');
		if (f1) {
			report.ok(Math.abs(f1.svgW - f1.hostW) <= 2 && Math.abs(f1.svgH - f1.hostH) <= 2,
				'the SVG is exactly the size of its host', `${Math.round(f1.svgW)}x${Math.round(f1.svgH)} in ${Math.round(f1.hostW)}x${Math.round(f1.hostH)}`);
			// The viewBox is the MEASURED size, so nothing is letterboxed. A fixed "0 0 560 340" is
			// the defect this replaced, and is named here so a regression reads as itself.
			report.ok(f1.viewBox !== '0 0 560 340', 'the viewBox is measured, not the old fixed 560x340', f1.viewBox);
			report.ok(f1.frameW > f1.hostW * 0.75,
				'the plot frame uses most of the pane WIDTH — no lake of white at the sides',
				`${Math.round(f1.frameW)} of ${Math.round(f1.hostW)}`);
			report.ok(f1.frameH > f1.hostH * 0.45,
				'...and most of its HEIGHT, the axis labels aside',
				`${Math.round(f1.frameH)} of ${Math.round(f1.hostH)}`);
		}
		// **AND IT REFLOWS.** The pane was dragged taller a few lines above, so the chart must have
		// grown with it rather than staying the size it was first drawn at.
		await a.page.evaluate(() => {
			const grip = document.getElementById('lpn_pane_grip');
			const r = grip.getBoundingClientRect();
			const opts = (y) => ({ bubbles: true, clientX: r.left + 40, clientY: y, pointerId: 1 });
			grip.dispatchEvent(new PointerEvent('pointerdown', opts(r.top + 4)));
			grip.dispatchEvent(new PointerEvent('pointermove', opts(r.top - 120)));
			grip.dispatchEvent(new PointerEvent('pointerup', opts(r.top - 120)));
		});
		await a.settle(600);
		const f2 = await fill();
		if (f1 && f2) {
			report.ok(f2.hostH > f1.hostH + 40, 'dragging the pane taller gives the chart more room',
				`${Math.round(f1.hostH)} → ${Math.round(f2.hostH)}`);
			report.ok(f2.frameH > f1.frameH + 20, '...and the chart really is redrawn bigger for it',
				`${Math.round(f1.frameH)} → ${Math.round(f2.frameH)}`);
			report.ok(Math.abs(f2.svgH - f2.hostH) <= 2, '...still exactly filling its host afterwards');
		}

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

		// **2. TWO LINES, ONE UNIT.** Rewritten for Task 522, which merged the input and result
		// unit sets and so deleted the two-heads-two-units arrangement this section used to drive.
		// The failure it exists for is UNCHANGED, which is why it was rewritten rather than removed:
		// the ground line and the grade line are drawn on ONE axis, and if either crossed units alone
		// the chart would still draw and would be nonsense -- ground at ~700 while the grade dropped
		// to ~300. One selector now decides both, so the check is that both follow it together.
		//
		// CONVERT, not reinterpret. A reinterpretation leaves every typed number exactly where it was,
		// so the chart would come back identical and this would assert nothing. Converting rewrites the
		// elevations, which is the only answer that moves the ground line.
		async function setHeadUnit(unit) {
			await a.page.evaluate((u) => {
				const s = document.querySelector('select[name="lpn_u_elevhead"]');
				s.value = u;
				s.dispatchEvent(new Event('change', { bubbles: true }));
			}, unit);
			await a.settle(400);
			// The head unit decides typed elevations, so it asks before it acts. Answer Destructive,
			// which is the second of the three buttons (Non-destructive | Destructive | Cancel).
			const asked = await a.page.evaluate(() => ({
				dialog: document.getElementById('lpn_dialog').style.display,
				buttons: [...document.querySelectorAll('#lpn_dialog_buttons button')].map(b => b.textContent)
			}));
			if (asked.dialog === 'block') {
				await a.page.evaluate(() => {
					const b = [...document.querySelectorAll('#lpn_dialog_buttons button')];
					(b.find(x => /Destructive/.test(x.textContent)) || b[1]).click();
				});
			}
			await a.settle(900);
			return asked;
		}

		const askedHead = await setHeadUnit('mh2o');
		report.eq(askedHead.dialog, 'block',
			'the one head unit decides typed elevations, so it asks before it acts',
			askedHead.buttons.join(' | '));
		const metric = await yTicks(a.page);
		const shapeM = await chartShape(a.page);
		report.ok(metric && Math.max(...metric) < 500 && Math.max(...metric) > 200,
			'converting the head unit to metres redraws the whole axis in metres',
			metric && metric.join(', '));
		report.ok(shapeM && shapeM.ground.length > 0 && shapeM.hgl.length > 0,
			'...with BOTH lines still drawn -- the ground crossed units with the grade line');
		// The ground is below the grade line everywhere on this network, and that survives the unit
		// change only if both crossed. Read off the drawing: a shaded band still exists.
		report.ok(shapeM && shapeM.bands > 0, '...and the pressure band is still between them');
		await setHeadUnit('fth2o');

		// **PARTS ONE AND TWO OF THIS SECTION ARE GONE, AND THAT IS TASK 506.** They drove the
		// profile's From/To pull-downs and its "add a waypoint" checkbox; the profile has no side
		// interface any more -- the Profile button itself arms the chooser, and the gesture (press
		// cycle, long press, double tap) is guarded by dev/lpn-spike/profile-chooser-harness.js on a
		// fake clock, which can test both thresholds from both sides and this cannot.
		// Deleted rather than skipped: a check that cannot run is noise, and the coverage moved.

		// **3. LIVE, part three: an EDIT to the network, not to the path.** This is the check that
		// holds refreshProfileIfOpen()'s call inside applySolveResult(): change a node's elevation
		// in its own popup, and 300 ms later the solve lands and the drawing has to move. Removing
		// that one call leaves the path controls still working and the profile silently stale, which
		// is the failure a person would report as "it was right a minute ago".
		{
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
					// **AND THE NODE MUST ACTUALLY BE THE THING UNDER THE POINTER.** On screen is
					// not enough: a map label drawn over its own node takes the click, and the
					// popup that opens is the label's -- Size multiplier, Angle, Horizontal
					// alignment -- with no elevation in it. That is what this section then
					// reports, and it reads like the popup lost a field rather than like the
					// spec clicking the wrong object. Ask the page what is on top.
					const top = document.elementFromPoint(x, y);
					if (!top || !top.closest('[data-node="' + id + '"]')) { continue; }
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

		// ---- **THE EDIT DOOR AND THE SAVED-PATH ARROW** (Tasks 509, 510) ------------------------
		//
		// dev/lpn-spike/profile-saved-harness.js owns what these two DO -- one end moves and the
		// waypoints survive; a saved path round-trips through the file. What only a real page can
		// answer is whether the box is on the screen at all: it is `position: fixed` and placed from
		// the Edit button's own rect, over a map whose height is measured, and the failure is a box
		// hanging off the bottom of the window or behind the pane it was opened from.
		{
			const door = await a.page.evaluate(() => {
				const b = document.getElementById('lpn_profile_edit_btn');
				if (!b) { return null; }
				const r = b.getBoundingClientRect();
				return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: b.textContent };
			});
			report.ok(!!door, 'the profile panel carries an Edit door', door && door.text);
			if (door) {
				await a.page.mouse.click(door.x, door.y);
				await a.settle(300);
				const box = await a.page.evaluate(() => {
					const p = document.getElementById('lpn_profile_edit_popup');
					if (!p || p.style.display !== 'block') { return null; }
					const r = p.getBoundingClientRect();
					return { x: r.x, y: r.y, w: r.width, h: r.height,
						selects: p.querySelectorAll('select').length,
						vw: window.innerWidth, vh: window.innerHeight };
				});
				report.ok(!!box, 'pressing it opens the overlay box');
				report.ok(box && box.selects === 2, '...carrying the two ends, one pull-down each',
					box && (box.selects + ' selects'));
				report.ok(box && box.x >= 0 && box.y >= 0 &&
					box.x + box.w <= box.vw + 1 && box.y + box.h <= box.vh + 1,
					'...wholly inside the window', box && JSON.stringify(box));
				// And it closes, because it has to be got rid of: it sits over the drawing.
				await a.page.click('#lpn_profile_edit_close');
				await a.settle(200);
				const shut = await a.page.evaluate(() =>
					document.getElementById('lpn_profile_edit_popup').style.display === 'none');
				report.ok(shut, '...and the X shuts it again');
			}

			// THE ARROW ON THE TAB. Its one hazard is real and invisible in a harness that calls the
			// menu directly: the tab's second show() is the command that starts drawing a path, so
			// an arrow routed through the tab would arm the chooser every time.
			const arrow = await a.page.evaluate(() => {
				const b = document.getElementById('lpn_pane_tab_menu_profile');
				if (!b) { return null; }
				const r = b.getBoundingClientRect();
				return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
			});
			report.ok(!!arrow, 'the Profile tab carries a saved-path arrow');
			if (arrow) {
				await a.page.mouse.click(arrow.x, arrow.y);
				await a.settle(250);
				const menu = await a.page.evaluate(() => {
					const p = document.getElementById('lpn_menu_popup');
					return {
						open: p && p.style.display === 'block',
						rows: [...document.querySelectorAll('#lpn_menu_list .lpn-menu-row, #lpn_menu_list .lpn-menu-heading')]
							.map(r => r.textContent.trim()),
						say: (document.getElementById('lpn_profile_say') || {}).textContent || ''
					};
				});
				report.ok(menu.open, '...and it opens a menu');
				report.ok(menu.rows.some(r => /Saved paths/.test(r)) &&
					menu.rows.some(r => /New saved path/.test(r)),
					'...holding the saved paths and the New row', menu.rows.join(' | '));
				report.ok(!/[Cc]lick the node|[Tt]ap the node/.test(menu.say),
					'...WITHOUT arming the path chooser', JSON.stringify(menu.say));
				// Dismissed, or it stands over the map for the rest of this section.
				await a.page.mouse.click(5, 5);
				await a.settle(200);
			}
		}

		// ---- **THE ROUTE MARK IS HOVER-GATED** (Tom, 2026-08-24) --------------------------------
		// A permanent orange band over the route was on the map whenever the tab was open. It is now
		// an answer to a question the reader asks by looking: pointer over the profile, mark on.
		// Driven through real pointer events on the real panel, because that is the whole mechanism.
		const away = await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_canvas .lpn-profile-path polyline').length);
		report.ok(away === 0, 'with the pointer off the profile, the map carries no route mark', away);
		await a.page.hover('#lpn_pane_profile');
		await a.settle(200);
		const over = await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_canvas .lpn-profile-path polyline').length);
		report.ok(over > 0, '...and hovering the profile paints it', over + ' segment(s)');
		await a.page.mouse.move(5, 5);
		await a.settle(200);
		const left = await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_canvas .lpn-profile-path polyline').length);
		report.ok(left === 0, '...and moving away takes it off again', left);

		// The pane is modeless: the map is edited underneath it throughout, and closing it leaves
		// nothing behind -- neither the panel nor the route highlight it painted on the map, and the
		// map takes its room back.
		await a.page.click('#lpn_pane_close');
		await a.settle(300);
		const closed = await a.page.evaluate(() => ({
			hidden: document.getElementById('lpn_pane').style.display === 'none',
			route: document.querySelectorAll('#lpn_canvas .lpn-profile-path').length,
			canvas: document.getElementById('lpn_canvas').getBoundingClientRect().height,
			bodyBottom: document.body.getBoundingClientRect().bottom, vh: window.innerHeight
		}));
		report.ok(closed.hidden, 'the X closes the pane');
		report.ok(closed.route === 0, '...and takes the route highlight off the map with it');
		report.ok(closed.canvas > dragged.after.canvas, '...and the map gets its room back',
			dragged.after.canvas + ' → ' + closed.canvas);
		report.ok(closed.bodyBottom <= closed.vh + 1, '...with the page still ending inside the window',
			Math.round(closed.bodyBottom) + ' of ' + closed.vh);

		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.join('\n'));
	} finally {
		await a.context.close();
	}
};
