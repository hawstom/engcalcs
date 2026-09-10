#!/usr/bin/env node
/*
 * Ship candidates for the favicon and the Water menu glyph, per Tom's 2026-09-10 instruction.
 * Renders REAL PNGs through headless Chromium (same pipeline as gen-concepts-color.js) and
 * measures them with the SAME probes (catwalkMiddle, surfaceTones, descenderFeet, cylinderProfile),
 * copied verbatim rather than re-derived, so a verdict here is comparable to round 3's numbers.
 *
 * Writes:
 *   ship-favicon.svg, ship-water-menu.svg          -- the two finished drawings
 *   render/ship/*.png                              -- every raster measured
 *   render/ship/ship-sheet.html + .png              -- a proof sheet Tom can look at
 *
 * Nothing outside dev/icon-preview/ is touched.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var here = __dirname;
var OUT = path.join(here, 'render', 'ship');
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

// ---- probes, copied from gen-concepts-color.js (readPNG, lum, catwalkMiddle, surfaceTones,
// descenderFeet, cylinderProfile) so a number here means the same thing it meant on round 3's sheet.
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
function catwalkMiddle(file, geo, px, scale) {
	var img = readPNG(file);
	var k = px / 24, sc = scale || 1;
	var toY = function (u) { return (12 + (u - 12) * sc) * k; };
	var row = toY(geo.catwalk), col = Math.round((12 + (geo.probeX - 12) * sc) * k);
	var half = Math.max(1, Math.round(1.0 * k * sc));
	var gap = Math.max(1, Math.round(2.0 * k * sc));
	var above = lum(img, col, Math.round(row - gap)), below = lum(img, col, Math.round(row + gap));
	if (above === null || below === null) { return null; }
	var base = (above + below) / 2, best = 0, bestL = null;
	for (var dy = -half; dy <= half; dy++) {
		var L = lum(img, col, Math.round(row) + dy);
		if (L === null) { continue; }
		if (Math.abs(L - base) > best) { best = Math.abs(L - base); bestL = L; }
	}
	return { delta: Math.round(best * 10) / 10, bar: Math.round(bestL), body: Math.round(base), ok: best >= 26 };
}
function surfaceTones(file, geo, px, scale, inkL) {
	if (!geo.sample) { return null; }
	var img = readPNG(file), k = px / 24, sc = scale || 1, ink = inkL === undefined ? 41 : inkL;
	function isInk(x, y) { var L = lum(img, x, y); return L !== null && Math.abs(L - ink) <= 30; }
	function touchesInk(x, y) {
		for (var dy = -1; dy <= 1; dy++) { for (var dx = -1; dx <= 1; dx++) { if (isInk(x + dx, y + dy)) { return true; } } }
		return false;
	}
	function band(b) {
		var x0 = Math.round((12 + (b[0] - 12) * sc) * k), x1 = Math.round((12 + (b[1] - 12) * sc) * k);
		var y0 = Math.round((12 + (b[2] - 12) * sc) * k), y1 = Math.round((12 + (b[3] - 12) * sc) * k);
		var sum = 0, n = 0, tot = 0;
		for (var y = y0; y <= y1; y++) {
			for (var x = x0; x <= x1; x++) {
				var L = lum(img, x, y);
				if (L === null) { continue; }
				tot++;
				if (!isInk(x, y) && !touchesInk(x, y)) { sum += L; n++; }
			}
		}
		return { L: n ? sum / n : null, n: n, tot: tot, frac: tot ? Math.round(n / tot * 100) : 0 };
	}
	var s = geo.sample, sky = band(s.sky), roof = band(s.roof), cyl = band(s.cyl), bowl = band(s.bowl);
	function d(a, b) { return (a.L === null || b.L === null) ? null : Math.round(Math.abs(a.L - b.L) * 10) / 10; }
	return {
		sky: sky.L === null ? null : Math.round(sky.L), roof: roof.L === null ? null : Math.round(roof.L),
		cyl: cyl.L === null ? null : Math.round(cyl.L), bowl: bowl.L === null ? null : Math.round(bowl.L),
		roofFill: roof.frac, bowlFill: bowl.frac,
		roofVsCyl: d(roof, cyl), roofVsSky: d(roof, sky), bowlVsCyl: d(bowl, cyl)
	};
}
function descenderFeet(file, geo, px, scale) {
	var img = readPNG(file), sc = scale || 1, k = px / 24, y = px - 1;
	var ground = lum(img, 0, y), out = [];
	for (var i = 0; i < geo.feet.length; i++) {
		var col = Math.round((12 + (geo.feet[i] - 12) * sc) * k);
		col = Math.min(px - 1, Math.max(0, col));
		var L = lum(img, col, y);
		out.push(Math.round(Math.abs(L - ground) * 10) / 10);
	}
	var runs = 0, inRun = false;
	for (var x = 0; x < px; x++) {
		var d = Math.abs(lum(img, x, y) - ground);
		if (d >= 26) { if (!inRun) { runs++; inRun = true; } } else { inRun = false; }
	}
	return { at: out, min: Math.min.apply(null, out), runs: runs, ok: Math.min.apply(null, out) >= 26 };
}
function cylinderProfile(file, ink) {
	var img = readPNG(file), px = img.w;
	var y = Math.round(11 / 24 * px), paper = lum(img, 0, y), row = [];
	for (var x = 0; x < px; x++) { row.push(Math.abs(lum(img, x, y) - paper)); }
	var maxInk = Math.max.apply(null, row) || 1;
	var thr = 26, runs = [], cur = null, grade = 0;
	for (var i = 0; i < row.length; i++) {
		var f = row[i] / maxInk;
		if (f >= 0.15 && f <= 0.70) { grade++; }
		if (row[i] >= thr) { if (!cur) { cur = { a: i, b: i }; runs.push(cur); } cur.b = i; }
		else { cur = null; }
	}
	var mass = 0;
	if (runs.length >= 2) {
		var L = runs[0], R = runs[runs.length - 1];
		mass = (R.b - R.a + 1) - (L.b - L.a + 1);
	}
	return { runs: runs.length, grade: grade, mass: mass, ink: ink };
}
// A belly-specific probe: is the bowl reading as a mid/dark TONE at all, at this size? Mirrors
// cylinderProfile's grade idea but reads a COLUMN through the bowl instead of a row through the
// tank, because the bowl's shading runs top-to-bottom (darkest at the springline down), not
// left-to-right.
function bowlProfile(file, px) {
	var img = readPNG(file);
	var x = Math.round(12 / 24 * px), paper = lum(img, 0, 0), col = [];
	var y0 = Math.round(14.15 / 24 * px), y1 = Math.round(18 / 24 * px);
	for (var y = y0; y <= y1; y++) { col.push(Math.abs(lum(img, x, y) - paper)); }
	var maxInk = Math.max.apply(null, col) || 1;
	var grade = 0;
	for (var i = 0; i < col.length; i++) {
		var f = col[i] / maxInk;
		if (f >= 0.15 && f <= 0.70) { grade++; }
	}
	return { grade: grade };
}

// ---- geometry (TALL3, from round 2/3, unchanged) --------------------------------------------
var TALL3 = {
	body: 'M7.95 3.7L12 2.2L16.05 3.7V14.15C16.05 16.36 14.24 18.15 12 18.15C9.76 18.15 7.95 16.36 7.95 14.15Z',
	strokes: function (bot) {
		return '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
			+ '<path d="M7.95 3.7V' + bot + 'M16.05 3.7V' + bot + '"/>'
			+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"/>'
			+ '<path d="M7.1 13.55H16.9"/>'
			+ '<path d="M12 18.15V' + bot + '"/>';
	},
	feet: [7.95, 12, 16.05], catwalk: 13.55, probeX: 12,
	roof: 'M7.95 3.7L12 2.2L16.05 3.7Z',
	cyl: 'M7.95 3.7H16.05V14.15H7.95Z',
	bowl: 'M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15Z',
	sample: { sky: [10, 14, 0.2, 1.2], roof: [10, 14, 2.4, 3.7], cyl: [10, 14, 5, 12], bowl: [10, 14, 14.9, 17.0] }
};

var STEEL = [['0', '#6f767d'], ['0.18', '#9aa2a9'], ['0.36', '#eef1f3'], ['0.54', '#c2c8cd'],
	['0.78', '#8b9299'], ['1', '#666d74']];
// CORRECTION, mid-task, Tom's own words for the lost sketch: "just some radial lighting on the roof
// and some darkening of the belly." A cone is a surface of revolution facing the sky, so its
// highlight is a SPOT falling off outward from a point near the apex, not a left-right band --
// that band belongs to the wall alone. The center is placed up and toward the same limb the wall's
// own highlight favors (offset 0.36 from the left in STEEL above), so the roof reads as the SAME
// light rather than a second source.
// gradientUnits="userSpaceOnUse" and NOT objectBoundingBox on purpose: the roof triangle's own
// bounding box is 8.1 units wide by 1.5 tall, and the default box-relative unit circle would
// stretch into a squashed ellipse matching that aspect -- a shape with no physical reading at all.
// A cone's highlight is a circular spot, so the radius is stated in the same drawing units as the
// tower itself. Center sits just above the springline and toward the same limb the wall's own
// highlight favors (its offset 0.36 from the left, here x approx 10.9 against the tank's 7.95-16.05).
var ROOF_RADIAL = { cx: '10.9', cy: '2.9', r: '5.2', units: 'userSpaceOnUse',
	stops: [['0', '#ffffff'], ['0.5', '#f4f6f8'], ['0.85', '#dfe4e8'], ['1', '#c9d0d6']] };
var BOWL = [['0', '#525960'], ['0.36', '#868d94'], ['0.72', '#6b7278'], ['1', '#4b5157']];
// CORRECTION, mid-task, Tom's third message: "And of course the belly is a hemisphere." A
// hemisphere lit from above does not take one flat tone (that is how a DISC would shade) -- it is
// brightest just under the springline and darkens DOWNWARD toward the bottom pole, and because the
// surface is curved the terminator itself curves. userSpaceOnUse again, for the same reason as the
// roof: the bowl's own bounding box is wide and short and would squash a box-relative circle.
// Center sits on the springline itself (the brightest latitude of the underside) and the radius
// reaches the bottom pole at y 18.15, so the fall-off IS the curvature rather than an approximation
// of it.
var BOWL_RADIAL = { cx: '12', cy: '14.15', r: '5.4', units: 'userSpaceOnUse',
	stops: [['0', '#9aa2a9'], ['0.45', '#767d84'], ['0.8', '#5b6167'], ['1', '#454a50']] };
var INK = '#232a30';

function ramp(id, stops) {
	return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">'
		+ stops.map(function (p) { return '<stop offset="' + p[0] + '" stop-color="' + p[1] + '"/>'; }).join('')
		+ '</linearGradient>';
}
function radial(id, spec) {
	return '<radialGradient id="' + id + '" gradientUnits="' + (spec.units || 'objectBoundingBox') + '" cx="' + spec.cx + '" cy="' + spec.cy + '" r="' + spec.r + '">'
		+ spec.stops.map(function (p) { return '<stop offset="' + p[0] + '" stop-color="' + p[1] + '"/>'; }).join('')
		+ '</radialGradient>';
}

// ---- favicon candidates: plain three-surface vs the lift repair, both re-measured here ------
// roofKind: 'linear' (round 3c as shipped on the sheet) or 'radial' (the correction). Both are
// rendered so the gain is measured rather than assumed.
function faviconInner(id, bowlKind, roofKind) {
	var g = TALL3, bot = 24;
	var roofDef = roofKind === 'radial' ? radial('r' + id, ROOF_RADIAL)
		: ramp('r' + id, [['0', '#dfe4e8'], ['0.36', '#ffffff'], ['0.72', '#f2f5f7'], ['1', '#dbe1e6']]);
	var bowlDef = bowlKind === 'hemisphere' ? radial('b' + id, BOWL_RADIAL) : ramp('b' + id, BOWL);
	var defs = '<defs>' + ramp('g' + id, STEEL) + roofDef + bowlDef
		+ '<linearGradient id="s' + id + '" x1="0" y1="0" x2="0" y2="1">'
		+ '<stop offset="0" stop-color="#9ecbe8"/><stop offset="1" stop-color="#dbe9f2"/></linearGradient>'
		+ '<filter id="f' + id + '" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>'
		+ '</defs>';
	var ground = '<rect x="0" y="0" width="24" height="24" fill="url(#s' + id + ')"/>'
		+ '<g filter="url(#f' + id + ')" fill="#ffffff" opacity="0.72">'
		+ '<ellipse cx="6" cy="5.5" rx="6" ry="1.7"/><ellipse cx="18.5" cy="9" rx="5.5" ry="1.5"/>'
		+ '<ellipse cx="11" cy="19.5" rx="8" ry="1.9"/></g>';
	var inner = '<path d="' + g.body + '" fill="url(#g' + id + ')"/>'
		+ '<path d="' + g.roof + '" fill="url(#r' + id + ')"/>'
		+ '<path d="' + g.bowl + '" fill="url(#b' + id + ')"/>';
	inner += '<g fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
		+ g.strokes(bot) + '</g>';
	return defs + ground + inner;
}

var FAV_CANDIDATES = [
	{ id: 'ship-fav-linear-flat', bowlKind: 'flat', roofKind: 'linear', title: 'Round 3c as shipped on the sheet: linear roof, flat-tone bowl' },
	{ id: 'ship-fav-linear-hemisphere', bowlKind: 'hemisphere', roofKind: 'linear', title: 'Linear roof, hemisphere bowl' },
	{ id: 'ship-fav-radial-flat', bowlKind: 'flat', roofKind: 'radial', title: 'Radial roof (cone), flat-tone bowl' },
	{ id: 'ship-fav-radial-hemisphere', bowlKind: 'hemisphere', roofKind: 'radial', title: 'Radial roof (cone), hemisphere bowl -- the ship candidate' }
];
FAV_CANDIDATES.forEach(function (c) { c.svg = faviconInner(c.id, c.bowlKind, c.roofKind); });

// ---- water-menu candidates: hatch-lr (the round-3 PICK) plus a belly hatch and a clouds trial -
function menuSVG(id, ink, opts) {
	var o = opts || {};
	var g = '<g fill="none" stroke="' + ink + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
	var rest = '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
		+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"/>'
		+ '<path d="M7.1 13.55H16.9"/>'
		+ '<path d="M12 18.15V24"/>'
		+ '<path d="M7.95 3.7V24"/>'
		+ '<path d="M16.05 3.7V24"/>';
	g += rest + '</g>';
	// Wall hatch: round 3's PICK, ic-mono-hatch-lr, unchanged. One line on the sunlit left limb, two
	// on the shadow right limb, bare band between -- the cylinder reading.
	var hatch = '<g fill="none" stroke="' + ink + '" stroke-linecap="butt">'
		+ '<path stroke-width="0.6" d="M9.5 6.2V14.6"/>'
		+ '<path stroke-width="0.75" d="M13.5 5.6V15.4"/>'
		+ '<path stroke-width="0.75" d="M14.6 6.4V14.6"/>'
		+ '</g>';
	// Belly ink: the bowl is the darkest surface (round 3c), so it gets ink where the roof gets
	// none. Five short strokes fanning from the springline, DELIBERATELY packed closer than the
	// 2.5-unit gap floor -- they are not meant to stay separate, they are meant to fuse into a mass
	// the way a hatched shadow does in line engraving. Kept clear of the riser (x=12, y >= 18.15).
	var belly = o.belly ? ('<g fill="none" stroke="' + ink + '" stroke-linecap="butt">'
		+ '<path stroke-width="0.7" d="M9.1 14.5V15.7"/>'
		+ '<path stroke-width="0.8" d="M10.5 14.5V16.6"/>'
		+ '<path stroke-width="0.85" d="M12 14.5V17.1"/>'
		+ '<path stroke-width="0.8" d="M13.5 14.5V16.6"/>'
		+ '<path stroke-width="0.7" d="M14.9 14.5V15.7"/>'
		+ '</g>') : '';
	// Clouds: a trial only. Two shallow bumps to the upper left of the roof, drawn with cubic
	// beziers (no arcs). Tested at 17 px before any decision -- see ship-notes.md.
	var clouds = o.clouds ? ('<g fill="none" stroke="' + ink + '" stroke-width="1" stroke-linecap="round">'
		+ '<path d="M1.2 2.0C1.2 1.3 1.9 1 2.6 1.2C2.9 0.7 3.7 0.7 4.0 1.2C4.6 1.1 5.1 1.5 5.0 2.0"/>'
		+ '</g>') : '';
	return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'
		+ g + hatch + belly + clouds + '</svg>\n';
}

var MEN_CANDIDATES = [
	{ id: 'ship-menu-wall-only', o: { belly: false, clouds: false }, title: 'Wall hatch only (round 3 PICK, unchanged)' },
	{ id: 'ship-menu-belly', o: { belly: true, clouds: false }, title: 'Wall hatch + belly ink (this round\'s ship candidate)' },
	{ id: 'ship-menu-belly-clouds', o: { belly: true, clouds: true }, title: 'Belly ink + a cloud trial' }
];

// ---- render + measure ------------------------------------------------------------------------
function findChromium() {
	if (process.env.CHROME_PATH) { return process.env.CHROME_PATH; }
	var cache = path.join(require('os').homedir(), '.cache', 'ms-playwright');
	if (!fs.existsSync(cache)) { return null; }
	var dirs = fs.readdirSync(cache).filter(function (d) { return /^chromium-/.test(d); });
	for (var i = 0; i < dirs.length; i++) {
		var rels = ['chrome-linux64/chrome', 'chrome-linux/chrome'];
		for (var j = 0; j < rels.length; j++) {
			var exe = path.join(cache, dirs[i], rels[j]);
			if (fs.existsSync(exe)) { return exe; }
		}
	}
	return null;
}
var GROUNDS = { lt: '#ffffff', dk: '#1e1e1e' };
var FAV_SIZES = [16, 32, 48, 192, 512];
var MEN_SIZES = [16, 17, 24, 32];
var MONO_INK = { lt: '#111111', dk: '#e8e8e8' };

(async function main() {
	var exe = findChromium();
	if (!exe) { throw new Error('No Chromium found; set CHROME_PATH or npx playwright install chromium'); }
	var pw = require(path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'));
	var browser = await pw.chromium.launch({ executablePath: exe });
	var favResults = {}, menResults = {};

	for (var fi = 0; fi < FAV_CANDIDATES.length; fi++) {
		var fc = FAV_CANDIDATES[fi];
		favResults[fc.id] = {};
		for (var gk in GROUNDS) {
			var page = await browser.newPage({ viewport: { width: 700, height: 700 }, deviceScaleFactor: 1 });
			for (var si = 0; si < FAV_SIZES.length; si++) {
				var px = FAV_SIZES[si];
				await page.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
					+ 'html,body{margin:0;padding:0;background:' + GROUNDS[gk] + '}#t{width:' + px + 'px;height:' + px + 'px;line-height:0}'
					+ '</style></head><body><div id="t"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + px
					+ '" height="' + px + '">' + fc.svg + '</svg></div></body></html>');
				var file = path.join(OUT, fc.id + '@' + px + '-' + gk + '.png');
				await (await page.$('#t')).screenshot({ path: file });
				if (gk === 'lt') {
					favResults[fc.id][px] = {
						catwalk: catwalkMiddle(file, TALL3, px, 1),
						feet: descenderFeet(file, TALL3, px, 1),
						tones: surfaceTones(file, TALL3, px, 1)
					};
				}
			}
			await page.close();
		}
	}

	for (var mi = 0; mi < MEN_CANDIDATES.length; mi++) {
		var mc = MEN_CANDIDATES[mi];
		menResults[mc.id] = {};
		for (var mgk in GROUNDS) {
			var mpage = await browser.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: 1 });
			for (var msi = 0; msi < MEN_SIZES.length; msi++) {
				var mpx = MEN_SIZES[msi];
				var svg = menuSVG(mc.id, MONO_INK[mgk], mc.o);
				await mpage.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
					+ 'html,body{margin:0;padding:0;background:' + GROUNDS[mgk] + '}#t{width:' + mpx + 'px;height:' + mpx + 'px;line-height:0}'
					+ '</style></head><body><div id="t">' + svg.replace('width="24" height="24"', 'width="' + mpx + '" height="' + mpx + '"') + '</div></body></html>');
				var mfile = path.join(OUT, mc.id + '@' + mpx + '-' + mgk + '.png');
				await (await mpage.$('#t')).screenshot({ path: mfile });
				if (!menResults[mc.id][mpx]) { menResults[mc.id][mpx] = {}; }
				menResults[mc.id][mpx][mgk] = cylinderProfile(mfile, mgk);
				if (mgk === 'lt') {
					menResults[mc.id][mpx].bowl = bowlProfile(mfile, mpx);
					menResults[mc.id][mpx].feet = descenderFeet(mfile, TALL3, mpx, 1);
				}
			}
			await mpage.close();
		}
	}

	// net grade against the bare-tank control (ic-mono-plain's numbers: 2 at 16px, 2 at 17px per
	// round 3's own sheet) -- recomputed here directly rather than re-reading the other script.
	var plainSVG = menuSVG('ship-menu-control', MONO_INK.lt, {});
	var controlGrade = {};
	{
		var cpage = await browser.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: 1 });
		for (var csi = 0; csi < MEN_SIZES.length; csi++) {
			var cpx = MEN_SIZES[csi];
			await cpage.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
				+ 'html,body{margin:0;padding:0;background:#fff}#t{width:' + cpx + 'px;height:' + cpx + 'px;line-height:0}'
				+ '</style></head><body><div id="t">' + plainSVG.replace('width="24" height="24"', 'width="' + cpx + '" height="' + cpx + '"') + '</div></body></html>');
			var cfile = path.join(OUT, 'control@' + cpx + '.png');
			await (await cpage.$('#t')).screenshot({ path: cfile });
			controlGrade[cpx] = cylinderProfile(cfile, 'lt').grade;
		}
		await cpage.close();
	}

	await browser.close();

	fs.writeFileSync(path.join(OUT, 'measurements.json'), JSON.stringify({ fav: favResults, men: menResults, controlGrade: controlGrade }, null, '\t') + '\n');

	console.log('--- FAVICON ---');
	FAV_CANDIDATES.forEach(function (c) {
		console.log(c.id + '  ' + c.title);
		FAV_SIZES.forEach(function (p) {
			var r = favResults[c.id][p];
			console.log('  ' + p + 'px  catwalk dL=' + (r.catwalk ? r.catwalk.delta : '-')
				+ '  feet min=' + (r.feet ? r.feet.min : '-') + ' runs=' + (r.feet ? r.feet.runs : '-')
				+ '  roofVsCyl=' + (r.tones ? r.tones.roofVsCyl : '-') + ' roofVsSky=' + (r.tones ? r.tones.roofVsSky : '-')
				+ ' bowlVsCyl=' + (r.tones ? r.tones.bowlVsCyl : '-'));
		});
	});
	console.log('--- MENU ---  control grade: ' + JSON.stringify(controlGrade));
	MEN_CANDIDATES.forEach(function (c) {
		console.log(c.id + '  ' + c.title);
		MEN_SIZES.forEach(function (p) {
			var r = menResults[c.id][p];
			var lt = r.lt, net = lt ? lt.grade - controlGrade[p] : '-';
			console.log('  ' + p + 'px  grade(lt)=' + (lt ? lt.grade : '-') + ' net=' + net
				+ ' bowlGrade=' + (r.bowl ? r.bowl.grade : '-') + ' feetMin=' + (r.feet ? r.feet.min : '-')
				+ ' feetRuns=' + (r.feet ? r.feet.runs : '-'));
		});
	});
})().catch(function (e) { console.error(e); process.exit(1); });
