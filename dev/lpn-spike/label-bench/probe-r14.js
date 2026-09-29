// R14 probe (Perry round 4, room check fixed 2026-09-29). node probe-r14.js <worktree-engcalcs-abs-path> <url> <tag>
const fs = require('fs');
const W = process.argv[2].replace(/\/$/, '') + '/';
const URL0 = process.argv[3];
const tag = process.argv[4] || 'x';
const env = require(W + 'dev/browser-pass/lib/env.js');
const { Session } = require(W + 'dev/browser-pass/lib/session.js');
const { chromium } = require(W + 'dev/browser-pass/node_modules/playwright-core');
const C = require(W + 'dev/lpn-spike/label-bench/contract.js');
const Sc = require(W + 'dev/lpn-spike/label-bench/score.js');
const OUT = require('os').tmpdir() + '/label-probe-' + tag + '/';
fs.mkdirSync(OUT, { recursive: true });

function quadToOBox(q) {
	const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
	const w = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]), h = Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]);
	return { cx: cx, cy: cy, w: w, h: h, angle: Math.atan2(q[1][1] - q[0][1], q[1][0] - q[0][0]) * 180 / Math.PI };
}

// Drawn ink per row (oriented boxes) for every visible label text, plus symbol boxes (axis-aligned).
const DRAWN = `(() => {
	const cv = document.getElementById('lpn_canvas'), r = cv.getBoundingClientRect();
	const ox = r.left + (cv.clientLeft || 0), oy = r.top + (cv.clientTop || 0);
	const labels = {};
	document.querySelectorAll('#lpn_canvas text[data-nodelbl], #lpn_canvas text.lpn-lbl[data-linklbl]:not([data-repeat])').forEach((t) => {
		if (getComputedStyle(t).visibility === 'hidden' || !t.textContent) { return; }
		const id = t.getAttribute('data-nodelbl') !== null ? 'n:' + t.getAttribute('data-nodelbl') : 'l:' + t.getAttribute('data-linklbl');
		const M = t.getScreenCTM();
		const rows = [];
		const groups = [];
		Array.from(t.children).filter((k) => k.tagName === 'tspan').forEach((k) => {
			if (k.getAttribute('x') !== null || !groups.length) { groups.push([]); }
			groups[groups.length - 1].push(k);
		});
		groups.forEach((g) => {
			let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
			g.forEach((k) => { const b = k.getBBox(); if (!b.width && !b.height) { return; } x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); });
			if (!(x1 > x0)) { return; }
			const P = (x, y) => { const p = new DOMPoint(x, y).matrixTransform(M); return [p.x - ox, p.y - oy]; };
			rows.push([P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]);
		});
		if (!rows.length) {
			const b = t.getBBox(), P = (x, y) => { const p = new DOMPoint(x, y).matrixTransform(M); return [p.x - ox, p.y - oy]; };
			rows.push([P(b.x, b.y), P(b.x + b.width, b.y), P(b.x + b.width, b.y + b.height), P(b.x, b.y + b.height)]);
		}
		const bb = t.getBoundingClientRect();
		labels[id] = { rows: rows, aabb: [bb.left - ox, bb.top - oy, bb.width, bb.height], tr: t.getAttribute('transform') || '' };
	});
	const symbols = [];
	document.querySelectorAll('#lpn_canvas .lpn-node, #lpn_canvas .lpn-node-symbol-box, #lpn_canvas .lpn-link-symbol-box').forEach((s) => {
		const cs = getComputedStyle(s);
		if (cs.visibility === 'hidden' || cs.display === 'none') { return; }
		const b = s.getBoundingClientRect();
		if (!b.width || !b.height) { return; }
		symbols.push([b.left - ox, b.top - oy, b.width, b.height]);
	});
	return { labels, symbols };
})()`;

async function main() {
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	const a = await Session.open(browser, tag);
	const page = a.page;
	const consoleErrors = [];
	page.on('console', (m) => { if (m.type() === 'error') { consoleErrors.push(m.text()); } });
	await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
	await page.goto(URL0, { waitUntil: 'load' });
	await a.settle(400);
	await a.answerTrainingPanel().catch(() => {});
	await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(300);

	const results = {};

	async function alignSample() {
		return page.evaluate(() => {
			function norm(x) { x = ((x % 180) + 180) % 180; return x; }
			const svg = document.getElementById('lpn_canvas');
			const out = [];
			Array.from(svg.querySelectorAll('text[data-linklbl]')).forEach((el) => {
				const cs = getComputedStyle(el);
				if (cs.visibility === 'hidden' || cs.display === 'none') { return; }
				const id = el.getAttribute('data-linklbl');
				const tr = el.getAttribute('transform') || '';
				const m = /rotate\(([-\d.]+)/.exec(tr);
				const labelAngle = m ? parseFloat(m[1]) : 0;
				const line = svg.querySelector('polyline.lpn-link[data-link="' + id + '"]');
				let pipeAngle = null;
				if (line && line.points && line.points.numberOfItems >= 2) {
					try {
						const p0 = line.points.getItem(0), p1 = line.points.getItem(line.points.numberOfItems - 1);
						pipeAngle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
					} catch (e) { /* ignore */ }
				}
				const diff = pipeAngle !== null ? Math.min(Math.abs(norm(labelAngle) - norm(pipeAngle)), 180 - Math.abs(norm(labelAngle) - norm(pipeAngle))) : null;
				let pipeLenPx = null, labelWPx = null, hasLeader = false;
				if (line) { try { pipeLenPx = Math.round(line.getTotalLength()); } catch (e) { /* ignore */ } }
				const bb = el.getBoundingClientRect(); labelWPx = Math.round(bb.width);
				const leader = svg.querySelector('line.lpn-leader[data-linklbl="' + id + '"], line.lpn-leader[data-link="' + id + '"]');
				hasLeader = !!(leader && getComputedStyle(leader).display !== 'none');
				out.push({ id, labelAngle: Math.round(labelAngle * 10) / 10, pipeAngle: pipeAngle === null ? null : Math.round(pipeAngle * 10) / 10, diff: diff === null ? null : Math.round(diff * 10) / 10, pipeLenPx, labelWPx, hasLeader });
			});
			return out;
		});
	}

	// R14 judged the way the bench judges it (score.js alignedTo/alignedRoom), on the scene and
	// layout the page actually handed the placer (EngCalcs.lpnPlacerLast): a level pipe label is a
	// miss only when the same rows had an aligned spot beside the visible pipe, clear of the
	// neighbours actually placed, the furniture and the viewport edge. The old "within 8 deg" count
	// flagged every level label, room or none.
	async function r14Judge() {
		const last = await page.evaluate(() => { const L = EngCalcs.lpnPlacerLast; return L && L.scene && L.layout ? { scene: L.scene, layout: L.layout } : null; });
		if (!last) { return { note: 'no placer layout' }; }
		const sc = last.scene, dr = Sc.drawn(sc, last.layout);
		const out = { asked: 0, along: 0, levelNoRoom: [], levelWithRoom: [] };
		dr.items.forEach((it) => {
			if (it.req.kind !== 'link' || !it.req.along || !it.owner.link) { return; }
			out.asked++;
			if (Sc.alignedTo(sc, it.req, it.pl, it.owner.link)) { out.along++; return; }
			const bs = C.blockSize(it.req, { shown: true, rows: it.pl.rows, layout: 'line', align: 'center' }, sc.text);
			const rec = it.id + ' (needs ' + Math.round(bs.w) + ' px, pipe ' + Math.round(C.polylineLength(it.owner.link.points)) + ' px on canvas)';
			(Sc.alignedRoom(sc, dr.items, it.req, it.pl.rows, it.owner.link) ? out.levelWithRoom : out.levelNoRoom).push(rec);
		});
		return out;
	}
	function r14Line(j) { return j.note ? j.note : 'R14 asked ' + j.asked + ' along ' + j.along + ' level-no-room ' + j.levelNoRoom.length + (j.levelNoRoom.length ? ' ' + JSON.stringify(j.levelNoRoom) : '') + ' LEVEL-WITH-ROOM ' + j.levelWithRoom.length + (j.levelWithRoom.length ? ' ' + JSON.stringify(j.levelWithRoom) : ''); }

	async function overlapReport() {
		const drawn = await page.evaluate(DRAWN);
		const ids = Object.keys(drawn.labels);
		const ink = {};
		ids.forEach((id) => { ink[id] = drawn.labels[id].rows.map(quadToOBox).map((b) => ({ cx: b.cx, cy: b.cy, w: Math.max(0, b.w - 1), h: Math.max(0, b.h - 1), angle: b.angle })); });
		let letterLetter = [], letterSymbol = [];
		for (let i = 0; i < ids.length; i++) {
			for (let j = i + 1; j < ids.length; j++) {
				if (ink[ids[i]].some((p) => ink[ids[j]].some((q) => C.boxesOverlap(p, q)))) { letterLetter.push(ids[i] + '/' + ids[j]); }
			}
		}
		drawn.symbols.forEach((s, si) => {
			const sb = { cx: s[0] + s[2] / 2, cy: s[1] + s[3] / 2, w: Math.max(0, s[2] - 1), h: Math.max(0, s[3] - 1), angle: 0 };
			ids.forEach((id) => {
				if (ink[id].some((p) => C.boxesOverlap(p, sb))) { letterSymbol.push(id + '/sym' + si); }
			});
		});
		return { drawnCount: ids.length, symCount: drawn.symbols.length, letterLetter, letterSymbol };
	}

	async function shot(name) { await page.screenshot({ path: OUT + name + '.png' }); }

	async function wheelAt(fx, fy, n, dy) {
		const c = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
		await page.mouse.move(c.x + c.w * fx, c.y + c.h * fy);
		for (let k = 0; k < n; k++) { await page.mouse.wheel(0, dy); await page.waitForTimeout(35); }
	}

	// Per-frame sampling during and right after a zoom: label count, any label far outside canvas
	// bounds (a "wrong place" signal), first frame with any visible label (blank-time measure).
	async function sampleFrames(ms, stepMs) {
		const frames = [];
		const t0 = Date.now();
		while (Date.now() - t0 < ms) {
			const f = await page.evaluate(() => {
				const svg = document.getElementById('lpn_canvas');
				const r = svg.getBoundingClientRect();
				function vis(el) { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none'; }
				const boxes = Array.from(svg.querySelectorAll('text[data-nodelbl], text[data-linklbl]')).filter(vis)
					.map((el) => { const b = el.getBoundingClientRect(); return { x: b.x - r.x, y: b.y - r.y, w: b.width, h: b.height }; })
					.filter((b) => b.w > 0 && b.h > 0);
				const stray = boxes.filter((b) => b.x < -100 || b.y < -100 || b.x > r.width + 100 || b.y > r.height + 100).length;
				const bottomBand = r.height - 40;
				const atBottom = boxes.filter((b) => b.y > bottomBand).length;
				return { n: boxes.length, stray, atBottom };
			});
			frames.push({ t: Date.now() - t0, ...f });
			await page.waitForTimeout(stepMs);
		}
		const firstNonzero = frames.find((f) => f.n > 0);
		const blankMs = firstNonzero ? firstNonzero.t : (frames.length ? frames[frames.length - 1].t : 0);
		const strayFrames = frames.filter((f) => f.stray > 0).length;
		const bottomFrames = frames.filter((f) => f.atBottom > 0).length;
		return { blankMs, strayFrames, bottomFrames, sampleLen: frames.length };
	}

	let firstNetwork = true;
	async function testNetwork(title, tagName) {
		console.log('=== ' + title + ' (' + tagName + ') ===');
		if (!firstNetwork) {
			// File > Open example... brings the gallery back for a real click, without a fresh tab.
			await a.menuClick(await a.lang('lpn_examples_menu'), 'file');
			await a.settle(600);
		}
		firstNetwork = false;
		await a.openExampleCard(title);
		await a.settle(1500);
		await shot(tagName + '-01-open');
		const openOv = await overlapReport();
		console.log('  open: labels ' + openOv.drawnCount + ' letter-letter ' + openOv.letterLetter.length + ' letter-symbol ' + openOv.letterSymbol.length);

		console.log('  -- moderate zoom-in burst (10 notches) --');
		await wheelAt(0.5, 0.5, 10, -120);
		const midBlank = await sampleFrames(2000, 40);
		await a.settle(500);
		await shot(tagName + '-02-mid-zoom');
		const midOv = await overlapReport();
		const midAlign = await alignSample();
		console.log('  mid-zoom blank ' + midBlank.blankMs + 'ms strayFrames ' + midBlank.strayFrames + '/' + midBlank.sampleLen + ' bottomFrames ' + midBlank.bottomFrames);
		console.log('  mid-zoom: labels ' + midOv.drawnCount + ' letter-letter ' + midOv.letterLetter.length + ' letter-symbol ' + midOv.letterSymbol.length + (midOv.letterLetter.length ? ' e.g. ' + midOv.letterLetter.slice(0, 5).join(' ') : ''));

		console.log('  -- hard zoom-in burst to 4x+ (20 more notches) --');
		await wheelAt(0.5, 0.5, 20, -120);
		const hardBlank = await sampleFrames(2500, 40);
		await a.settle(500);
		await shot(tagName + '-03-hard-zoom');
		const hardOv = await overlapReport();
		const hardAlign = await alignSample();
		const hardOn = hardAlign.filter((r) => r.diff !== null && r.diff <= 8).length;
		console.log('  hard-zoom blank ' + hardBlank.blankMs + 'ms strayFrames ' + hardBlank.strayFrames + '/' + hardBlank.sampleLen + ' bottomFrames ' + hardBlank.bottomFrames);
		console.log('  hard-zoom: labels ' + hardOv.drawnCount + ' letter-letter ' + hardOv.letterLetter.length + ' letter-symbol ' + hardOv.letterSymbol.length + (hardOv.letterLetter.length ? ' e.g. ' + hardOv.letterLetter.slice(0, 5).join(' ') : ''));
		const hardR14 = await r14Judge();
		console.log('  hard-zoom align(default=on): n=' + hardAlign.length + ' within8deg=' + hardOn + ' | ' + r14Line(hardR14));

		console.log('  -- pan (must not blank labels) --');
		const beforePanN = hardOv.drawnCount;
		const c = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
		await page.mouse.move(c.x + c.w * 0.5, c.y + c.h * 0.5);
		await page.mouse.down();
		const panFrames = [];
		for (let i = 1; i <= 10; i++) {
			await page.mouse.move(c.x + c.w * 0.5 - i * 15, c.y + c.h * 0.5 - i * 8);
			const n = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl], #lpn_canvas text[data-linklbl]')).filter((e) => { const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none'; }).length);
			panFrames.push(n);
		}
		await page.mouse.up();
		await a.settle(600);
		const afterPanOv = await overlapReport();
		console.log('  pan: before ' + beforePanN + ' mid-pan frames ' + JSON.stringify(panFrames) + ' after-settle ' + afterPanOv.drawnCount);
		await shot(tagName + '-04-after-pan');

		console.log('  -- alignment checkbox: off then on, real clicks --');
		await page.evaluate(() => {
			const b = Array.from(document.querySelectorAll('button')).find((e) => (e.getAttribute('aria-label') || '') === 'Settings');
			if (b) { b.click(); }
		});
		await a.settle(400);
		const offClick = await page.evaluate(() => {
			const l = Array.from(document.querySelectorAll('label')).find((e) => /Draw link labels along the link line/i.test(e.textContent || ''));
			const cb = l && l.querySelector('input[type=checkbox]');
			if (!cb) { return 'no checkbox'; }
			if (cb.checked) { cb.click(); }
			return 'align=' + cb.checked;
		});
		await a.settle(1500);
		const offAlign = await alignSample();
		const offLevel = offAlign.filter((r) => Math.abs(r.labelAngle) < 1).length;
		console.log('  ' + offClick + ' -> level(<1deg)=' + offLevel + '/' + offAlign.length + (offLevel < offAlign.length ? ' NOT ALL LEVEL sample=' + JSON.stringify(offAlign.filter((r) => Math.abs(r.labelAngle) >= 1).slice(0, 6)) : ''));
		await shot(tagName + '-05-align-off');

		const onClick = await page.evaluate(() => {
			const l = Array.from(document.querySelectorAll('label')).find((e) => /Draw link labels along the link line/i.test(e.textContent || ''));
			const cb = l && l.querySelector('input[type=checkbox]');
			if (!cb) { return 'no checkbox'; }
			if (!cb.checked) { cb.click(); }
			return 'align=' + cb.checked;
		});
		await a.settle(1500);
		const onAlign = await alignSample();
		const onGood = onAlign.filter((r) => r.diff !== null && r.diff <= 8).length;
		const onR14 = await r14Judge();
		console.log('  ' + onClick + ' -> within8deg=' + onGood + '/' + onAlign.length + ' | ' + r14Line(onR14));
		await shot(tagName + '-06-align-on-again');
		await page.evaluate(() => {
			const b = Array.from(document.querySelectorAll('button')).find((e) => (e.getAttribute('aria-label') || '') === 'Settings');
			if (b) { b.click(); }
		});
		await a.settle(300);

		results[tagName] = { openOv, midBlank, midOv, hardBlank, hardOv, hardAlign: { n: hardAlign.length, within8: hardOn, r14: hardR14 }, panFrames, offAlign: { level: offLevel, n: offAlign.length }, onAlign: { within8: onGood, n: onAlign.length, r14: onR14 } };
	}

	await testNetwork('EPANET Net3, lat/lon', 'net3');
	await testNetwork('EPANET Net2', 'net2');

	console.log('CONSOLE ERRORS:', consoleErrors.length, consoleErrors.slice(0, 10));
	console.log('PAGE ERRORS:', a.errors.length, a.errors.slice(0, 5));
	fs.writeFileSync(OUT + 'summary.json', JSON.stringify(results, null, 2));
	await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
