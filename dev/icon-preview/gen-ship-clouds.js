#!/usr/bin/env node
/*
 * Reopened clouds question, 2026-09-10. Tom, after seeing both shipped drawings live:
 *
 *   "There is a lot of free/waste width on the menu icon. Can Ida figure out how to evoke clouds or
 *   a bird or two in the sky? This is not a cartoon. This looks real and out of a western movie. So
 *   we need to keep with that."
 *   "The same clouds as the favicon would be amazing if there is a way to give a nod to them."
 *
 * The first cloud trial (round 3d) tested the 2.2 units of HEADROOM above the cone's apex and found
 * nothing survives there. Tom is pointing at the FLANKS instead: WT-TALL-3's wall ink spans x
 * 6.95-8.95 (left) and 15.05-17.05 (right), the catwalk's round cap reaches x 6.1-17.9 at y=13.55
 * ONLY, and everything else in the 24-unit frame outside the tank is empty -- roughly 6.95 clear
 * units on each flank, full height. That is the space this file tests.
 *
 * THE TRAP: the glyph already has a strong horizontal at y=13.55 (the catwalk). A flank stroke at a
 * similar height, or shaped as a straight bar, reads as a second catwalk or a horizon line. Height
 * SEPARATION from y=13.55 and a shape that is not a straight bar are both tested for directly below.
 *
 * THE NOD: ship-favicon.svg's three sky ellipses are WIDE and FLAT (ry under 2 against rx of 5.5 to
 * 8) -- stratus bands, not cumulus puffs -- at cx=6/cy=5.5 (left, high) and cx=18.5/cy=9 (right,
 * lower). In one ink with no fill, a flat band becomes a shallow open wave (two gentle bumps),
 * never an outlined puff -- an outline is the cartoon Tom is warning off.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var here = process.cwd();
var OUT = path.join(here, 'render', 'ship');

// ---- probes (same as gen-ship.js) -------------------------------------------------------------
function readPNG(file) {
	var buf = fs.readFileSync(file);
	var pos = 8, w = 0, h = 0, depth = 0, ctype = 0, idat = [];
	while (pos < buf.length) {
		var len = buf.readUInt32BE(pos), type = buf.toString('ascii', pos + 4, pos + 8);
		var data = buf.slice(pos + 8, pos + 8 + len);
		if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; ctype = data[9]; }
		else if (type === 'IDAT') { idat.push(data); }
		pos += 12 + len;
	}
	if (depth !== 8 || (ctype !== 6 && ctype !== 2)) { throw new Error('unexpected PNG format ' + depth + '/' + ctype + ' in ' + file); }
	var bpp = ctype === 6 ? 4 : 3;
	var raw = zlib.inflateSync(Buffer.concat(idat));
	var stride = w * bpp, out = Buffer.alloc(h * stride), o = 0, p = 0;
	for (var y = 0; y < h; y++) {
		var filter = raw[p++];
		for (var x = 0; x < stride; x++) {
			var a = x >= bpp ? out[o + x - bpp] : 0;
			var b = y > 0 ? out[o - stride + x] : 0;
			var c = (x >= bpp && y > 0) ? out[o - stride + x - bpp] : 0;
			var v = raw[p + x], r;
			if (filter === 0) { r = v; }
			else if (filter === 1) { r = v + a; }
			else if (filter === 2) { r = v + b; }
			else if (filter === 3) { r = v + ((a + b) >> 1); }
			else {
				var pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
				r = v + (pa <= pb && pa <= pc ? a : (pb <= pc ? b : c));
			}
			out[o + x] = r & 255;
		}
		p += stride; o += stride;
	}
	return { w: w, h: h, bpp: bpp, data: out };
}
function lum(img, x, y) {
	if (x < 0 || y < 0 || x >= img.w || y >= img.h) { return null; }
	var i = (y * img.w + x) * img.bpp;
	return 0.2126 * img.data[i] + 0.7152 * img.data[i + 1] + 0.0722 * img.data[i + 2];
}
// Is there any ink in a flank BOX at all, and how many separate horizontal RUNS does it make on its
// own strongest row -- 1 run reading as a single stroke (bar-like, the catwalk risk), 2+ reading as
// a broken/wavy mark (cloud-like). Box is in drawing units, [x0,x1,y0,y1].
function flankInk(file, px, box, paper) {
	var img = readPNG(file), k = px / 24;
	var x0 = Math.round(box[0] * k), x1 = Math.round(box[1] * k);
	var y0 = Math.round(box[2] * k), y1 = Math.round(box[3] * k);
	var bestRow = null, bestCount = 0;
	for (var y = y0; y <= y1; y++) {
		var runs = 0, inRun = false, count = 0;
		for (var x = x0; x <= x1; x++) {
			var L = lum(img, x, y);
			var isInk = L !== null && Math.abs(L - paper) >= 26;
			if (isInk) { count++; if (!inRun) { runs++; inRun = true; } } else { inRun = false; }
		}
		if (count > bestCount) { bestCount = count; bestRow = { y: y, runs: runs, px: count }; }
	}
	return bestRow || { y: null, runs: 0, px: 0 };
}

// ---- geometry: TALL3 body/wall/catwalk unchanged, ship-water-menu.svg's belly ink unchanged -----
var BASE_G = '<g fill="none" stroke="ICOLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
	+ '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
	+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"/>'
	+ '<path d="M7.1 13.55H16.9"/>'
	+ '<path d="M12 18.15V24"/>'
	+ '<path d="M7.95 3.7V24"/>'
	+ '<path d="M16.05 3.7V24"/>'
	+ '</g>';
var HATCH_G = '<g fill="none" stroke="ICOLOR" stroke-linecap="butt">'
	+ '<path stroke-width="0.6" d="M9.5 6.2V14.6"/>'
	+ '<path stroke-width="0.75" d="M13.5 5.6V15.4"/>'
	+ '<path stroke-width="0.75" d="M14.6 6.4V14.6"/>'
	+ '</g>';
var BELLY_G = '<g fill="none" stroke="ICOLOR" stroke-linecap="butt">'
	+ '<path stroke-width="0.7" d="M9.1 14.5V15.7"/>'
	+ '<path stroke-width="0.8" d="M10.5 14.5V16.6"/>'
	+ '<path stroke-width="0.85" d="M12 14.5V17.1"/>'
	+ '<path stroke-width="0.8" d="M13.5 14.5V16.6"/>'
	+ '<path stroke-width="0.7" d="M14.9 14.5V15.7"/>'
	+ '</g>';

// Flank cloud shapes -- flattened open waves (2 shallow bumps), NOT closed puffs, NOT straight bars.
// Coordinates chosen to stay well inside each flank's clear x range (0-6.95 left, 17.05-24 right)
// and to be tested at several heights relative to the catwalk (y=13.55).
function cloudWave(x0, y, len, bump, sw) {
	var xm = x0 + len / 2, x1 = x0 + len;
	var yb = y - bump;
	return '<path stroke-width="' + sw + '" d="M' + x0 + ' ' + y + 'C' + (x0 + len * 0.2) + ' ' + yb + ' '
		+ (xm - len * 0.2) + ' ' + yb + ' ' + xm + ' ' + y + 'C' + (xm + len * 0.2) + ' ' + yb + ' '
		+ (x1 - len * 0.2) + ' ' + yb + ' ' + x1 + ' ' + y + '"/>';
}
// A nod to the favicon's own two heights: left cloud at y~5.5 (its cy=5.5), right at y~9 (its cy=9).
var CLOUDS_NOD = '<g fill="none" stroke="ICOLOR" stroke-linecap="round">'
	+ cloudWave(1.0, 5.5, 4.6, 0.55, 0.6)
	+ cloudWave(18.4, 9.0, 4.6, 0.5, 0.6)
	+ '</g>';
// More height separation from the catwalk than the nod row (both clouds pushed higher), to test
// whether the nod's right-side cloud (only 4.55 units above y=13.55) is close enough to risk reading
// as a second catwalk.
var CLOUDS_HIGH = '<g fill="none" stroke="ICOLOR" stroke-linecap="round">'
	+ cloudWave(1.0, 4.2, 4.6, 0.55, 0.6)
	+ cloudWave(18.4, 4.2, 4.6, 0.5, 0.6)
	+ '</g>';
// A bird: the classic two-stroke gull, one shallow cubic bump. Placed in the right flank, clear of
// both cloud heights, to be measured on its own -- Tom's other suggestion, "your call."
function gull(cx, cy, w, h, sw) {
	var x0 = cx - w / 2, xm = cx, x1 = cx + w / 2;
	return '<path stroke-width="' + sw + '" stroke-linecap="round" d="M' + x0 + ' ' + cy + 'C' + (x0 + w * 0.15) + ' ' + (cy - h) + ' '
		+ (xm - w * 0.15) + ' ' + (cy - h) + ' ' + xm + ' ' + cy + 'C' + (xm + w * 0.15) + ' ' + (cy - h) + ' '
		+ (x1 - w * 0.15) + ' ' + (cy - h) + ' ' + x1 + ' ' + cy + '"/>';
}
var BIRD = '<g fill="none" stroke="ICOLOR" stroke-linecap="round">' + gull(20.8, 2.6, 2.2, 0.55, 0.55) + '</g>';

function build(id, extras) {
	var body = extras.map(function (g) { return g; }).join('');
	return { id: id, mk: function (ink) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'
		+ BASE_G.replace(/ICOLOR/g, ink) + HATCH_G.replace(/ICOLOR/g, ink) + BELLY_G.replace(/ICOLOR/g, ink)
		+ body.replace(/ICOLOR/g, ink) + '</svg>\n'; } };
}
var CANDS = [
	build('cl-none', []),
	build('cl-nod', [CLOUDS_NOD]),
	build('cl-high', [CLOUDS_HIGH]),
	build('cl-nod-bird', [CLOUDS_NOD, BIRD]),
	build('cl-bird-only', [BIRD])
];

// ---- render + measure --------------------------------------------------------------------------
function findChromium() {
	if (process.env.CHROME_PATH) { return process.env.CHROME_PATH; }
	var cache = path.join(require('os').homedir(), '.cache', 'ms-playwright');
	if (!fs.existsSync(cache)) { return null; }
	var dirs = fs.readdirSync(cache).filter(function (d) { return /^chromium-/.test(d); });
	for (var i = 0; i < dirs.length; i++) {
		var e = path.join(cache, dirs[i], 'chrome-linux64/chrome');
		if (fs.existsSync(e)) { return e; }
	}
	return null;
}
var GROUNDS = { lt: '#ffffff', dk: '#1e1e1e' };
var INK = { lt: '#111111', dk: '#e8e8e8' };
var SIZES = [16, 17, 24, 32];
// Flank boxes to probe, in drawing units: left flank, right flank. Height split above/below the
// catwalk row (y=13.55) so a candidate's ink can be told apart from it explicitly.
var FLANK_L = [0.5, 6.5, 1, 12.5];
var FLANK_R = [17.5, 23.5, 1, 12.5];

(async function main() {
	var exe = findChromium();
	if (!exe) { throw new Error('No Chromium found'); }
	var pw = require(path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'));
	var browser = await pw.chromium.launch({ executablePath: exe });
	var results = {};
	for (var ci = 0; ci < CANDS.length; ci++) {
		var c = CANDS[ci];
		results[c.id] = {};
		for (var gk in GROUNDS) {
			var svg = c.mk(INK[gk]);
			var pg = await browser.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: 1 });
			for (var si = 0; si < SIZES.length; si++) {
				var px = SIZES[si];
				await pg.setContent('<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;background:'
					+ GROUNDS[gk] + '}#t{width:' + px + 'px;height:' + px + 'px;line-height:0}</style></head><body><div id="t">'
					+ svg.replace('width="24" height="24"', 'width="' + px + '" height="' + px + '"') + '</div></body></html>');
				var file = path.join(OUT, c.id + '@' + px + '-' + gk + '.png');
				await (await pg.$('#t')).screenshot({ path: file });
				var paper = gk === 'lt' ? 255 : 30;
				results[c.id][px] = results[c.id][px] || {};
				results[c.id][px][gk] = { L: flankInk(file, px, FLANK_L, paper), R: flankInk(file, px, FLANK_R, paper) };
			}
			await pg.close();
		}
	}
	await browser.close();
	fs.writeFileSync(path.join(OUT, 'clouds-measurements.json'), JSON.stringify(results, null, '\t') + '\n');
	CANDS.forEach(function (c) {
		console.log(c.id);
		SIZES.forEach(function (p) {
			var r = results[c.id][p];
			console.log('  ' + p + 'px  lt: L runs=' + r.lt.L.runs + ' px=' + r.lt.L.px + '  R runs=' + r.lt.R.runs + ' px=' + r.lt.R.px
				+ '   dk: L runs=' + r.dk.L.runs + ' px=' + r.dk.L.px + '  R runs=' + r.dk.R.runs + ' px=' + r.dk.R.px);
		});
	});

	// Zoomed proof sheet.
	var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
		+ 'body{background:#999;margin:16px;font:11px monospace}.r{display:flex;align-items:center;gap:10px;margin:8px 0}'
		+ '.l{width:170px;color:#111}img{image-rendering:pixelated;border:1px solid #555;margin-right:4px}'
		+ '.lt{background:#fff}.dk{background:#1e1e1e}</style></head><body>'
		+ CANDS.map(function (c) {
			return '<div class="r"><span class="l">' + c.id + '</span>'
				+ SIZES.map(function (p) { return '<img class="lt" src="' + c.id + '@' + p + '-lt.png" width=' + (p * 9) + ' height=' + (p * 9) + '>'; }).join('')
				+ SIZES.map(function (p) { return '<img class="dk" src="' + c.id + '@' + p + '-dk.png" width=' + (p * 9) + ' height=' + (p * 9) + '>'; }).join('')
				+ '</div>';
		}).join('')
		+ '</body></html>';
	fs.writeFileSync(path.join(OUT, 'clouds-sheet.html'), html);
	var browser2 = await pw.chromium.launch({ executablePath: exe });
	var shot = await browser2.newPage({ viewport: { width: 1500, height: 900 } });
	await shot.goto('file://' + path.join(OUT, 'clouds-sheet.html'));
	await shot.screenshot({ path: path.join(OUT, 'clouds-sheet.png'), fullPage: true });
	await browser2.close();

	// Write out finalist SVGs (24x24, standalone) for direct inspection.
	CANDS.forEach(function (c) {
		fs.writeFileSync(path.join(OUT, c.id + '.svg'), c.mk('currentColor'));
	});
})().catch(function (e) { console.error(e); process.exit(1); });
