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
// (2) From one press (armed) and from two (Zoom Window), a zoom by the real wheel, a trackpad pinch,
// the +/- chip or the keyboard puts the button back to Zoom to fit, and the next press fits.
// (3) A press before the first results land is finished when they do. (4) A press from the view a
// fit already settled on costs one measurement, not a relayout.

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

	// (2) A zoom by any other means puts the button back to a first press. Read off the BUTTON --
	// its aria-label and aria-pressed, which are what a person sees -- from BOTH states it can be
	// left in: armed after one press, and showing Zoom Window after two. The first version of this
	// spec tried only the armed state, where a click or key press already disarmed the button
	// through the page's pointerdown/keydown listeners, so the + chip and the keyboard passed here
	// while a user who had pressed twice was left in Zoom Window (pre-review, 2026-09-24).
	const a = await Session.open(browser, 'zoomreset-' + Date.now());
	try {
		await a.goto();
		await a.answerTrainingPanel().catch(() => {});
		await a.openExampleCard(await lang(a, 'lpn_ex_net1_title'));
		const c = await centre(a);
		const fitLbl = await lang(a, 'lpn_tool_zoom_extent');
		const face = () => a.page.evaluate(() => {
			const b = document.querySelector('button[data-tool="zoom-window"]');
			return (b.getAttribute('aria-label') || '') + '|' + b.getAttribute('aria-pressed');
		});
		const neutral = async () => { await a.page.mouse.click(c.x * 2 - 60, c.y * 2 - 160); await a.settle(100); };
		// Control: two presses in a row DO open Zoom Window (R-181), or the rest proves nothing.
		await neutral(); await press(a); await press(a);
		report.ok(await inZoomWindow(a), 'control: two presses in a row open Zoom Window');
		const ways = [
			['the wheel in', async () => { await a.page.mouse.move(c.x, c.y); for (let i = 0; i < 3; i++) { await a.page.mouse.wheel(0, -240); await a.settle(30); } }],
			['the wheel out', async () => { await a.page.mouse.move(c.x, c.y); for (let i = 0; i < 3; i++) { await a.page.mouse.wheel(0, 240); await a.settle(30); } }],
			// A trackpad pinch reaches the page as a wheel event with ctrlKey set.
			['a trackpad pinch', async () => { await a.page.mouse.move(c.x, c.y); await a.page.keyboard.down('Control'); for (let i = 0; i < 3; i++) { await a.page.mouse.wheel(0, -30); await a.settle(30); } await a.page.keyboard.up('Control'); }],
			['the + chip', async () => { await a.page.click('#lpn_zoom_in'); await a.settle(100); }],
			['the - chip', async () => { await a.page.click('#lpn_zoom_out'); await a.settle(100); }],
			['the keyboard +', async () => { await a.page.keyboard.press('+'); await a.settle(100); }],
			['the keyboard -', async () => { await a.page.keyboard.press('-'); await a.settle(100); }]
		];
		for (const [what, zoom] of ways) {
			for (const presses of [1, 2]) {
				await a.page.keyboard.press('Escape'); await neutral();
				for (let i = 0; i < presses; i++) { await press(a); }
				const s0 = (await measure(a)).s, f0 = await face(a);
				await zoom();
				const s1 = (await measure(a)).s, f1 = await face(a);
				report.ok(s1 !== s0, what + ' after ' + presses + ' press(es) really zoomed', s0.toFixed(3) + ' -> ' + s1.toFixed(3));
				report.ok(f1 === fitLbl + '|false', '...and the button is back to Zoom to fit, not pressed', f0 + ' -> ' + f1);
				await press(a);
				const s2 = (await measure(a)).s;
				report.ok(!(await inZoomWindow(a)) && s2 !== s1, '...so the next press fits rather than opening Zoom Window',
					'scale ' + s1.toFixed(3) + ' -> ' + s2.toFixed(3));
			}
		}
		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.join(' | ').slice(0, 400));
	} finally {
		await a.close();
	}

	// (3) Pressed before the first results land. Net2's EPS answer takes about a second; a press in
	// that second fitted node 1's label at three lines and the P= line then grew it 3 px into the
	// coordinate readout (pre-review, 2026-09-24). The press finishes when the results do.
	for (const vp of [{ width: 1280, height: 800 }, { width: 1366, height: 768 }]) {
		const b = await Session.open(browser, 'zoomearly-' + Date.now());
		try {
			await b.page.setViewportSize(vp);
			await b.goto();
			await b.answerTrainingPanel().catch(() => {});
			await b.openExampleCard(await lang(b, 'lpn_ex_net2_title'));
			await press(b);
			await b.settle(3000);
			const m = await measure(b);
			report.ok(m.hits.length === 0, 'Net2 at ' + vp.width + 'x' + vp.height + ', pressed before the results: nothing under the furniture once they land',
				m.hits.slice(0, 5).join('; '));
		} finally {
			await b.close();
		}
	}

	// (4) A press from the view a fit already settled on is a measurement, not a relayout. On the
	// geographic Net3 the full fit lays the labels out twice (~0.5 s each here); the repeat must not.
	const n = await Session.open(browser, 'zoomrepeat-' + Date.now());
	try {
		await n.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await n.goto();
		await n.answerTrainingPanel().catch(() => {});
		await n.openExampleCard(await lang(n, 'lpn_ex_net3_world_title'));
		await n.settle(3000);
		const c = await centre(n);
		const timed = async () => {
			await n.page.mouse.click(c.x * 2 - 60, c.y * 2 - 160); await n.settle(100);
			const h = await fitButton(n), bb = await h.boundingBox(), t = Date.now();
			await n.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
			const ms = Date.now() - t;
			await n.settle(400);
			return ms;
		};
		const first = await timed(), s1 = (await measure(n)).s;
		const again = [await timed(), await timed(), await timed()], s2 = (await measure(n)).s;
		report.note('geographic Net3: first press ' + first + ' ms, repeats ' + again.join('/') + ' ms');
		report.ok(Math.max.apply(null, again) < 200 && s1 === s2, 'geographic Net3: a press from the fitted view is cheap and changes nothing',
			again.join('/') + ' ms');
	} finally {
		await n.close();
	}
};
