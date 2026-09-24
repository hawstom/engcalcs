// §51 -- Zoom to fit keeps the drawing out from under the map's furniture, and any other zoom
// makes the next press a first press again (R-216).
//
// Tom, 2026-09-24, on feat/zoom-control: *"(1) Zooms almost to fit. Only the scale bar obscures a
// label. (2) Scrolling the map to zoom doesn't reset the Zoom to fit clicks, and this is
// startling."*
//
// (1) After Zoom to fit on each example, no node symbol, label or leader may lie under anything
// that sits over the map: the mode hint and notice strip, the bottom strip (scale bar, readouts,
// scenario button), the tile credit, the +/- chip and either legend.
// (2) Press Zoom to fit, turn the REAL WHEEL (and, separately, press the + chip, the keyboard's +,
// and pinch-free wheel out), then press again: the second press must fit, not open Zoom Window.

const { Session } = require('../lib/session');

exports.title = '51. Zoom to fit clears the map furniture; other zooms reset its second press';

async function lang(a, k) { return a.lang(k); }

// Everything that sits over the map, by its rendered box. Mirrors overlayOccupants() plus the two
// legends, read from the DOM rather than from the page's own list so a new overlay the page forgot
// to list still counts here.
async function measure(a) {
	return a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas'), r = svg.getBoundingClientRect();
		function shown(e) {
			for (let p = e; p && p !== document.body; p = p.parentElement) {
				const cs = getComputedStyle(p);
				if (cs.display === 'none' || cs.visibility === 'hidden') { return false; }
			}
			return true;
		}
		const furn = [];
		function add(e, name) {
			if (!e || !shown(e)) { return; }
			const b = e.getBoundingClientRect();
			if (!(b.width > 0 && b.height > 0)) { return; }
			// Only what really overlaps the canvas.
			if (b.right <= r.left || b.left >= r.right || b.bottom <= r.top || b.top >= r.bottom) { return; }
			furn.push({ name, l: b.left, t: b.top, r: b.right, b: b.bottom });
		}
		['lpn_map_overlay_tl', 'lpn_map_footer'].forEach((id) => {
			const host = document.getElementById(id);
			if (!host) { return; }
			Array.from(host.children).forEach((c) => {
				// A flex column host holds its own children; measure the leaves that draw a box.
				if (c.id === 'lpn_map_overlay_tl_col') {
					Array.from(c.children).forEach((cc) => add(cc, cc.id || cc.className));
				} else { add(c, c.id || c.className); }
			});
		});
		['lpn_basemap_credit', 'lpn_zoom_control', 'lpn_labels_legend'].forEach((id) => add(document.getElementById(id), id));
		document.querySelectorAll('.lpn-color-legend').forEach((e) => add(e, 'color legend'));
		function drawn(e) {
			for (let p = e; p && p !== svg; p = p.parentNode) {
				const cs = getComputedStyle(p);
				if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { return false; }
			}
			return true;
		}
		const hits = [];
		let total = 0;
		svg.querySelectorAll('text, line.lpn-leader, .lpn-node[data-node]').forEach((e) => {
			if (e.tagName === 'text' && !(e.textContent || '').trim()) { return; }
			if (!drawn(e)) { return; }
			const b = e.getBoundingClientRect();
			if (!b.width && !b.height) { return; }
			total++;
			const out = Math.max(r.left - b.left, b.right - r.right, r.top - b.top, b.bottom - r.bottom);
			if (out > 1) { hits.push((e.textContent || e.getAttribute('data-node') || 'leader').trim().slice(0, 20) + ' off the map'); return; }
			furn.forEach((f) => {
				const ox = Math.min(b.right, f.r) - Math.max(b.left, f.l), oy = Math.min(b.bottom, f.b) - Math.max(b.top, f.t);
				if (ox > 1 && oy > 1) {
					hits.push((e.textContent || e.getAttribute('data-node') || 'leader').trim().slice(0, 20) + ' under ' + f.name);
				}
			});
		});
		const m = /scale\(([^)]+)\)/.exec(svg.querySelector('g').getAttribute('transform') || '');
		return { hits, total, furn: furn.map((f) => f.name), s: m ? +m[1] : null };
	});
}
async function fitButton(a) {
	const fitLbl = await lang(a, 'lpn_tool_zoom_extent'), winLbl = await lang(a, 'lpn_tool_zoom_window');
	return a.page.evaluateHandle(([f, w]) => Array.from(document.querySelectorAll('button')).find((x) => x.offsetParent &&
		[f, w].includes((x.getAttribute('aria-label') || '').trim())), [fitLbl, winLbl]);
}
// A real mouse click on the button, so the page's own pointerdown listeners see it.
async function press(a) {
	const h = await fitButton(a);
	const b = await h.boundingBox();
	await a.page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
	await a.settle(600);
}
async function modeHint(a) {
	return a.page.evaluate(() => (document.getElementById('lpn_mode_hint') || {}).textContent || '');
}
async function inZoomWindow(a) {
	return a.page.evaluate(() => {
		const b = Array.from(document.querySelectorAll('button[data-tool="zoom-window"]'))[0];
		return !!b && b.getAttribute('aria-pressed') === 'true';
	});
}
async function centre(a) {
	return a.page.evaluate(() => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	});
}

exports.run = async function ({ browser, report }) {
	const list = ['lpn_ex_net1_title', 'lpn_ex_basic_us_title', 'lpn_ex_basic_si_title', 'lpn_ex_net2_title',
		'lpn_ex_elm_street_title', 'lpn_ex_net3_world_title'];
	for (const key of list) {
		for (const vp of [null, { width: 1000, height: 650 }, { width: 700, height: 800 }]) {
			const a = await Session.open(browser, 'zoomfurn-' + Date.now());
			try {
				await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
				if (vp) { await a.page.setViewportSize(vp); }
				await a.goto();
				await a.answerTrainingPanel().catch(() => {});
				await a.openExampleCard(await lang(a, key));
				const tag = key + (vp ? ' at ' + vp.width + 'x' + vp.height : '');
				// The solve that follows an open fills the status and engine lines in the top strip a
				// moment later; a fit cannot make room for an overlay that is not there yet, and a person
				// has not pressed anything within that moment.
				await a.settle(2500);
				const pre = await a.page.evaluate(() => ['lpn_status', 'lpn_engine_banner'].map((id) => {
					const e = document.getElementById(id); return id + '=' + (e && e.style.display !== 'none' ? 'shown' : 'hidden');
				}).join(' '));
				report.note(tag + ': before the press ' + pre);
				await press(a);
				const m = await measure(a);
				report.ok(m.hits.length === 0 && m.total > 0, tag + ': after Zoom to fit nothing is under the furniture or off the map',
					m.hits.length ? m.hits.slice(0, 5).join('; ') : m.total + ' drawn pieces clear of ' + m.furn.length + ' overlays');
				// ...and from a deep zoom.
				const c = await centre(a);
				await a.page.mouse.move(c.x, c.y);
				for (let i = 0; i < 30; i++) { await a.page.mouse.wheel(0, -240); await a.settle(15); }
				await press(a);
				const d = await measure(a);
				report.ok(d.hits.length === 0, tag + ': ...and from a deep zoom', d.hits.slice(0, 5).join('; '));
				report.eq(a.errors.length, 0, tag + ': no uncaught page errors');
			} finally {
				await a.close();
			}
		}
	}

	// (2) The second press, after a zoom by any other means.
	const a = await Session.open(browser, 'zoomreset-' + Date.now());
	try {
		await a.goto();
		await a.answerTrainingPanel().catch(() => {});
		await a.openExampleCard(await lang(a, 'lpn_ex_net1_title'));
		const c = await centre(a);
		// Control: two presses in a row DO open Zoom Window (R-181), or the rest proves nothing.
		await press(a); await press(a);
		report.ok(await inZoomWindow(a), 'control: two presses in a row open Zoom Window');
		await a.page.keyboard.press('Escape'); await a.settle(100);
		const ways = [
			['the wheel in', async () => { await a.page.mouse.move(c.x, c.y); for (let i = 0; i < 3; i++) { await a.page.mouse.wheel(0, -240); await a.settle(30); } }],
			['the wheel out', async () => { await a.page.mouse.move(c.x, c.y); for (let i = 0; i < 3; i++) { await a.page.mouse.wheel(0, 240); await a.settle(30); } }],
			['the + chip', async () => { await a.page.click('#lpn_zoom_in'); await a.settle(100); }],
			['the - chip', async () => { await a.page.click('#lpn_zoom_out'); await a.settle(100); }],
			['the keyboard +', async () => { await a.page.keyboard.press('+'); await a.settle(100); }]
		];
		for (const [what, zoom] of ways) {
			// A click on the map between rounds, so each round's first press is a first press. NOT a
			// key: a key press lands on the focused button itself, which R-181 counts as the button.
			await a.page.mouse.click(c.x * 2 - 60, c.y * 2 - 160); await a.settle(100);
			await press(a);
			const s0 = (await measure(a)).s;
			await zoom();
			const s1 = (await measure(a)).s;
			await press(a);
			const s2 = (await measure(a)).s;
			report.ok(!(await inZoomWindow(a)) && Math.abs(s2 / s0 - 1) < 0.02,
				'press, zoom by ' + what + ', press: the second press fits again, not Zoom Window',
				'scale ' + s0.toFixed(3) + ' -> ' + s1.toFixed(3) + ' -> ' + s2.toFixed(3) + (await inZoomWindow(a) ? ' (Zoom Window opened)' : ''));
			report.ok(s1 !== s0, '...and ' + what + ' really zoomed', s0.toFixed(3) + ' -> ' + s1.toFixed(3));
			if (await inZoomWindow(a)) { await a.page.keyboard.press('Escape'); await a.settle(100); }
		}
		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.join(' | ').slice(0, 400));
	} finally {
		await a.close();
	}
};
