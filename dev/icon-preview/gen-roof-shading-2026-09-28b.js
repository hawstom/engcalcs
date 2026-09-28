#!/usr/bin/env node
/*
 * Round 2 of the roof-shading ruling, answering Tom's review of round 1 (2026-09-28):
 *   "The roof is not shaded conically. This is apparent at all sizes. The largest size is most
 *   obvious." (marked with a red arrow at the 512's roof apex) -- round 1 pasted the WALL's own
 *   horizontal (x1/x2) gradient onto the roof's bounding box. That gives vertical iso-brightness
 *   lines, which is correct for a CYLINDER (brightness varies with azimuth, and on a cylinder every
 *   generator is a vertical line at constant azimuth) but wrong for a CONE, where every generator
 *   runs from the apex to the base rim -- iso-brightness lines must radiate from the apex, not run
 *   vertically. ROUND 2 replaces the pasted gradient with a fan of thin wedges, apex to base rim,
 *   each wedge one flat colour sampled from the WALL's own ramp at the x-position (~ azimuth) of
 *   its midpoint -- same colours as before, now converging correctly at the apex.
 *
 *   "The top of the cylinder needs a seam, I believe. Check references." -- real elevated tanks
 *   join the roof to the shell with a top angle / knuckle, which reads as a rim line or narrow band
 *   right at the shell's top course (references below). ROUND 2 adds a two-line seam (a dark line
 *   with a thin highlight above it, in the same idiom as the plate-course lines already used for
 *   the riveted option) at y = G.shY, the wall/roof junction, on EVERY build -- not just the riveted
 *   one -- since the joint exists whether or not the plate seams are drawn.
 *   References (WebSearch, 2026-09-28):
 *     - https://stispfa.org/resource/steel-water-storage-tanks-a-selection-guide/
 *     - https://www.tiwsteelplatework.ca/products/awwa-d100-water-tanks/
 *     - https://webstore.ansi.org/preview-pages/awwa/preview_d100-11.pdf (AWWA D100-11, cone-roof
 *       apex-angle and top-angle-area clauses)
 *   These describe a knuckle plate or top angle at the roof-to-shell joint, used on virtually every
 *   welded cone-roof tank; a plain butt joint with no rim reads as unfinished at any size.
 *
 *   "The underside of the catwalk should be in shadow. Maybe move the catwalk down a little bit to
 *   meet the belly." -- ROUND 2 moves the deck down (walkY 13.55 -> 13.75, about +0.2 units, closing
 *   most of the gap to the bowl's spring line at 14.15 without lapping the outline) and darkens both
 *   the underside band (the fascia's own shadow rect) and the cast-shadow wash already on the bowl
 *   top (opacity 0.55 -> 0.68, so it registers as an actual shadow, not a faint tint).
 *
 * NOTHING ELSE CHANGES: same geometry family, same stroke weights, same catwalk deck construction,
 * same colours everywhere but the roof fill, the new seam, and the two shadow tones.
 *
 * Writes:
 *   dev/icon-preview/roof-shading-2026-09-28b.html  -- ROUND 1/ROUND 2, at real size and enlarged
 *   dev/icon-preview/render/roof-shading-b/*.png     -- every raster this script produced
 *   icons/favicon.svg     -- the About mark (option 3, About size), ROUND 2 shading
 *   icons/icon-192.png    -- option 3, 192 size, ROUND 2 shading
 *   icons/icon-512.png    -- option 4 + bracing, 512, ROUND 2 shading
 *   icons/icon.svg        -- same drawing as icon-512.png, as vector (manifest's "any" icon)
 *
 *   flock /tmp/engcalcs-browser.lock node dev/icon-preview/gen-roof-shading-2026-09-28b.js
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
'use strict';
var fs = require('fs');
var path = require('path');

var here = __dirname;
var ROOT = path.join(here, '..', '..');
var OUT = path.join(here, 'render', 'roof-shading-b');
var PAGE = path.join(here, 'roof-shading-2026-09-28b.html');
fs.mkdirSync(OUT, { recursive: true });

var ICONS = path.join(ROOT, 'icons');
var FAVICON_OUT = path.join(ICONS, 'favicon.svg');
var ICON192_OUT = path.join(ICONS, 'icon-192.png');
var ICON512_OUT = path.join(ICONS, 'icon-512.png');
var ICONSVG_OUT = path.join(ICONS, 'icon.svg');

// ---- the favicon's own coordinates --------------------------------------------------------------
// G1 = round 1 (shipped) geometry; G2 = round 2, with the catwalk moved down toward the bowl's
// spring line per Tom's "meet the belly".
var G1 = {
	apex: [12, 2.2], shL: 7.95, shR: 16.05, shY: 3.7, spring: 14.15, pole: 18.15,
	walkY: 13.55, walkL: 7.1, walkR: 16.9, edge: 24, cx: 12
};
var G2 = Object.assign({}, G1, { walkY: 13.75 });
var R = (G1.shR - G1.shL) / 2;
var BODY_SCALE = 0.85; // the shipped maskable body scale
var INK = '#232a30';

var SIZES = {
	about: { px: 48, stroke: 0.6, leg: 1.0, riser: 1.35, posts: 0, midrail: false, deckH: 0.7, railGap: 1.05 },
	s192: { px: 192, stroke: 0.3, leg: 0.72, riser: 1.05, posts: 30, midrail: true, deckH: 0.62, railGap: 1.0 },
	s512: { px: 512, stroke: 0.18, leg: 0.66, riser: 0.98, posts: 18, midrail: true, deckH: 0.62, railGap: 1.0 }
};

function f(n) { return (Math.round(n * 1000) / 1000).toString(); }
function nx(x, S) { return 12 + S * (x - 12); }
function ny(y, S) { return 12 + S * (y - 12); }
function bowlD() { return 'M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15'; }
/** x of a point at azimuth th (radians, 0 = facing us) on a circle of radius r about the axis. */
function az(th, r, G) { return G.cx + r * Math.sin(th); }

// ---- colour-ramp interpolation, so the roof fan can sample the wall's own ramp -------------------
var WALL_RAMP = [
	[0, '#6f767d'], [0.18, '#9aa2a9'], [0.36, '#eef1f3'],
	[0.54, '#c2c8cd'], [0.78, '#8b9299'], [1, '#666d74']
];
function hexToRgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
function rgbToHex(r, g, b) { function h(n) { return ('0' + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2); } return '#' + h(r) + h(g) + h(b); }
function lerpHex(a, b, t) { var ca = hexToRgb(a), cb = hexToRgb(b); return rgbToHex(ca[0] + (cb[0] - ca[0]) * t, ca[1] + (cb[1] - ca[1]) * t, ca[2] + (cb[2] - ca[2]) * t); }
function rampColor(t) {
	t = Math.max(0, Math.min(1, t));
	for (var i = 0; i < WALL_RAMP.length - 1; i++) {
		if (t >= WALL_RAMP[i][0] && t <= WALL_RAMP[i + 1][0]) {
			var frac = (t - WALL_RAMP[i][0]) / (WALL_RAMP[i + 1][0] - WALL_RAMP[i][0]);
			return lerpHex(WALL_RAMP[i][1], WALL_RAMP[i + 1][1], frac);
		}
	}
	return WALL_RAMP[WALL_RAMP.length - 1][1];
}

// ---- defs / fills --------------------------------------------------------------------------------
function defs(p, round) {
	var ramp = '<stop offset="0" stop-color="#6f767d"/><stop offset="0.18" stop-color="#9aa2a9"/><stop offset="0.36" stop-color="#eef1f3"/><stop offset="0.54" stop-color="#c2c8cd"/><stop offset="0.78" stop-color="#8b9299"/><stop offset="1" stop-color="#666d74"/>';
	var legRamp = '<stop offset="0" stop-color="#555c63"/><stop offset="0.25" stop-color="#7d858c"/><stop offset="0.4" stop-color="#b9c0c6"/><stop offset="0.6" stop-color="#8f979e"/><stop offset="1" stop-color="#4a5157"/>';
	var bowlshadeTop = round === 'round2' ? 'rgba(15,20,26,0.68)' : 'rgba(15,20,26,0.55)';
	var d = '<defs>'
		+ '<linearGradient id="' + p + '-wall" x1="0" y1="0" x2="1" y2="0">' + ramp + '</linearGradient>'
		+ '<radialGradient id="' + p + '-bowl" gradientUnits="userSpaceOnUse" cx="12" cy="14.15" r="5.4"><stop offset="0" stop-color="#9aa2a9"/><stop offset="0.45" stop-color="#767d84"/><stop offset="0.8" stop-color="#5b6167"/><stop offset="1" stop-color="#454a50"/></radialGradient>'
		+ '<linearGradient id="' + p + '-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ecbe8"/><stop offset="1" stop-color="#dbe9f2"/></linearGradient>'
		+ '<filter id="' + p + '-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>'
		+ '<linearGradient id="' + p + '-leg" x1="0" y1="0" x2="1" y2="0">' + legRamp + '</linearGradient>'
		+ '<linearGradient id="' + p + '-fascia" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4e555b"/><stop offset="0.2" stop-color="#7a8188"/><stop offset="0.37" stop-color="#c3c9ce"/><stop offset="0.55" stop-color="#99a0a6"/><stop offset="0.8" stop-color="#6c737a"/><stop offset="1" stop-color="#4a5056"/></linearGradient>'
		+ '<linearGradient id="' + p + '-strut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cfd4"/><stop offset="0.45" stop-color="#8b9299"/><stop offset="1" stop-color="#454b51"/></linearGradient>'
		+ '<linearGradient id="' + p + '-bowlshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + bowlshadeTop + '"/><stop offset="1" stop-color="rgba(15,20,26,0)"/></linearGradient>'
		+ '<clipPath id="' + p + '-wallclip"><rect x="' + G1.shL + '" y="' + G1.shY + '" width="' + (G1.shR - G1.shL) + '" height="' + (G1.spring - G1.shY) + '"/></clipPath>'
		+ '<clipPath id="' + p + '-bowlclip"><path d="' + bowlD() + 'Z"/></clipPath>'
		+ '<clipPath id="' + p + '-roofclip"><path d="M7.95 3.7L12 2.2L16.05 3.7Z"/></clipPath>';
	return d + '</defs>';
}
function sky(p) {
	return '<rect x="0" y="0" width="24" height="24" fill="url(#' + p + '-sky)"/>'
		+ '<g filter="url(#' + p + '-blur)" fill="#ffffff" opacity="0.72"><ellipse cx="6" cy="5.5" rx="6" ry="1.7"/><ellipse cx="18.5" cy="9" rx="5.5" ry="1.5"/><ellipse cx="11" cy="19.5" rx="8" ry="1.9"/></g>';
}
/** Round 1's roof: the wall's own linear gradient pasted onto the roof triangle -- vertical
 *  iso-brightness lines, wrong for a cone. Kept only so round 1 can be rendered for the comparison. */
function roofRound1(p) {
	return '<path d="M7.95 3.7L12 2.2L16.05 3.7Z" fill="url(#' + p + '-wall)"/>';
}
/** Round 2's roof: a fan of thin wedges from the apex to the base rim, one flat colour per wedge,
 *  sampled from the wall's own ramp at the x-position (~ azimuth) of the wedge's midpoint -- so
 *  iso-brightness lines radiate from the apex, as they do on an actual lit cone. numWedges scales
 *  with the rendered size so no banding shows at 512 while smaller sizes stay cheap. */
function roofRound2(p, px) {
	var numWedges = Math.max(10, Math.min(64, Math.round(px / 9)));
	var half = 87; // degrees either side of centre, matching the rivet fan's own range
	var step = (2 * half) / numWedges;
	var out = '<g clip-path="url(#' + p + '-roofclip)">';
	for (var i = 0; i < numWedges; i++) {
		var th0 = (-half + i * step) * Math.PI / 180;
		var th1 = (-half + (i + 1) * step) * Math.PI / 180;
		var thMid = (th0 + th1) / 2;
		var x0 = az(th0, R, G1), x1 = az(th1, R, G1), xMid = az(thMid, R, G1);
		var t = (xMid - G1.shL) / (G1.shR - G1.shL);
		out += '<path d="M12 2.2L' + f(x0) + ' 3.7L' + f(x1) + ' 3.7Z" fill="' + rampColor(t) + '"/>';
	}
	out += '</g>';
	return out;
}
/** The roof-to-shell knuckle / top angle: real welded cone-roof tanks ring the shell top with a
 *  rolled angle or knuckle plate (references in the header comment) -- a small protruding band, lit
 *  on its top edge and casting a shadow under its bottom edge, not just a line. Round 2 draws it as
 *  a short band in the wall's own gradient (so it sits in the same light) with a highlight along its
 *  top and a shadow along its bottom, right at the wall/roof junction (y = shY), on every build. */
function seamRing(p, w) {
	var bandH = Math.max(w * 1.1, 0.1);
	var y0 = G1.shY, y1 = y0 + bandH;
	return '<rect x="' + G1.shL + '" y="' + f(y0) + '" width="' + (G1.shR - G1.shL) + '" height="' + f(bandH) + '" fill="url(#' + p + '-wall)"/>'
		+ '<path d="M' + G1.shL + ' ' + f(y0 + bandH * 0.12) + 'H' + G1.shR + '" stroke="rgba(255,255,255,0.6)" stroke-width="' + f(bandH * 0.32) + '"/>'
		+ '<path d="M' + G1.shL + ' ' + f(y1) + 'H' + G1.shR + '" stroke="rgba(12,16,20,0.62)" stroke-width="' + f(bandH * 0.42) + '"/>';
}
function fills(p, round, s) {
	var out = '<path d="M7.95 3.7L12 2.2L16.05 3.7V14.15C16.05 16.36 14.24 18.15 12 18.15C9.76 18.15 7.95 16.36 7.95 14.15Z" fill="url(#' + p + '-wall)"/>'
		+ (round === 'round2' ? roofRound2(p, s.px) : roofRound1(p));
	if (round === 'round2') { out += seamRing(p, s.stroke); }
	out += '<path d="' + bowlD() + 'Z" fill="url(#' + p + '-bowl)"/>';
	// The catwalk deck's own shadow falls on the bowl top just below it, which the bowl's gradient
	// (brightest at its own centre) would otherwise light up.
	var G = round === 'round2' ? G2 : G1;
	out += '<rect x="' + G1.shL + '" y="' + G.spring + '" width="' + (G1.shR - G1.shL) + '" height="1.7" fill="url(#' + p + '-bowlshade)" clip-path="url(#' + p + '-bowlclip)"/>';
	return out;
}
function outlineOpen(w) {
	return '<g fill="none" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round">';
}

/** Plate seams and rivets (option 4), byte-identical to gen-larger-tower.js's, except the roof's own
 *  diagonal comb lines now overlay the round-2 fan (they still read as panel seams on a cone). */
function seams(p, s) {
	var out = '';
	var dark = 'rgba(20,26,32,0.42)', lite = 'rgba(255,255,255,0.45)';
	var sw = 0.055;
	var rv = 0.055;
	function rivet(x, y, k) {
		return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rv * k) + '" ry="' + f(rv) + '" fill="rgba(20,26,32,0.38)"/>'
			+ '<ellipse cx="' + f(x) + '" cy="' + f(y - rv * 0.45) + '" rx="' + f(rv * 0.55 * k) + '" ry="' + f(rv * 0.45) + '" fill="rgba(255,255,255,0.55)"/>';
	}
	var courses = 5, h = (G1.spring - G1.shY) / courses;
	var wall = '';
	for (var i = 1; i < courses; i++) {
		var y = G1.shY + i * h;
		wall += '<path d="M' + G1.shL + ' ' + f(y) + 'H' + G1.shR + '" stroke="' + dark + '" stroke-width="' + sw + '"/>'
			+ '<path d="M' + G1.shL + ' ' + f(y - sw) + 'H' + G1.shR + '" stroke="' + lite + '" stroke-width="' + (sw * 0.6) + '"/>';
		for (var a = -84; a <= 84; a += 7) {
			var th = a * Math.PI / 180;
			wall += rivet(az(th, R, G1), y + 0.14, Math.cos(th));
		}
	}
	for (var c = 0; c < courses; c++) {
		var y0 = G1.shY + c * h, y1 = y0 + h;
		var off = (c % 2) ? 22.5 : 0;
		for (var a2 = -90 + off; a2 < 90; a2 += 45) {
			if (Math.abs(a2) > 80) { continue; }
			var th2 = a2 * Math.PI / 180, x = az(th2, R, G1), k = Math.cos(th2);
			wall += '<path d="M' + f(x) + ' ' + f(y0) + 'V' + f(y1) + '" stroke="' + dark + '" stroke-width="' + f(sw * Math.max(k, 0.4)) + '"/>';
			for (var yy = y0 + 0.28; yy < y1 - 0.12; yy += 0.3) {
				wall += rivet(x + 0.13 * k, yy, k);
			}
		}
	}
	out += '<g clip-path="url(#' + p + '-wallclip)" fill="none">' + wall + '</g>';

	var roof = '';
	for (var a3 = -60; a3 <= 60; a3 += 30) {
		var x3 = az(a3 * Math.PI / 180, R, G1);
		roof += '<path d="M12 2.2L' + f(x3) + ' 3.7" stroke="rgba(20,26,32,0.22)" stroke-width="' + sw + '"/>';
	}
	out += '<g clip-path="url(#' + p + '-roofclip)" fill="none">' + roof + '</g>';

	var bowl = '';
	var latT = 40 * Math.PI / 180, ly = G1.spring + R * Math.sin(latT) * (4 / 4.05);
	bowl += '<path d="M7 ' + f(ly) + 'H17" stroke="rgba(10,14,18,0.5)" stroke-width="' + sw + '"/>'
		+ '<path d="M7 ' + f(ly - sw) + 'H17" stroke="rgba(255,255,255,0.22)" stroke-width="' + (sw * 0.6) + '"/>';
	for (var a4 = -60; a4 <= 60; a4 += 30) {
		var th4 = a4 * Math.PI / 180, rx = R * Math.sin(th4);
		if (Math.abs(rx) < 0.01) {
			bowl += '<path d="M12 ' + G1.spring + 'V' + G1.pole + '" stroke="rgba(10,14,18,0.45)" stroke-width="' + sw + '"/>';
		} else {
			bowl += '<path d="M' + f(12 + rx) + ' ' + G1.spring + 'C' + f(12 + rx) + ' ' + f(G1.spring + 2.2) + ' ' + f(12 + rx * 0.55) + ' ' + f(G1.pole) + ' 12 ' + G1.pole
				+ '" stroke="rgba(10,14,18,0.45)" stroke-width="' + f(sw * Math.cos(th4) + 0.02) + '"/>';
		}
	}
	for (var a5 = -80; a5 <= 80; a5 += 8) {
		var th5 = a5 * Math.PI / 180;
		var xr = 12 + R * Math.sin(th5) * Math.cos(latT);
		bowl += rivet(xr, ly + 0.13, Math.cos(th5));
	}
	out += '<g clip-path="url(#' + p + '-bowlclip)" fill="none">' + bowl + '</g>';
	return out;
}

/** Catwalk as a robust deck plus a handrail above it. round param picks G1 (round 1's walkY) or
 *  G2 (round 2's, moved down toward the bowl's spring line) and darkens the underside band on
 *  round 2 so it reads as being in shadow, not just a darker material. */
function catwalk(p, s, round) {
	var G = round === 'round2' ? G2 : G1;
	var w = s.stroke;
	var L = 6.75, Rr = 17.25;
	var top = G.walkY - s.deckH * 0.45, bot = top + s.deckH;
	var railY = top - s.railGap;
	var rw = Math.max(w * 0.9, 0.16);
	var out = '';
	var posts = [L + 0.12, Rr - 0.12];
	if (s.posts) {
		var rc = (Rr - L) / 2;
		for (var a = -90 + s.posts; a < 90; a += s.posts) { posts.push(az(a * Math.PI / 180, rc, G)); }
	} else {
		posts.push(G.cx);
	}
	var pw = Math.max(w * 0.7, 0.12);
	out += '<g stroke="' + INK + '" stroke-width="' + f(pw) + '" stroke-linecap="butt">';
	posts.forEach(function (x) { out += '<path d="M' + f(x) + ' ' + f(railY) + 'V' + f(top) + '"/>'; });
	out += '</g>';
	if (s.midrail) {
		out += '<path d="M' + f(L + 0.12) + ' ' + f((railY + top) / 2) + 'H' + f(Rr - 0.12) + '" stroke="' + INK + '" stroke-width="' + f(pw * 0.8) + '"/>';
	}
	out += '<path d="M' + f(L + 0.12) + ' ' + f(railY) + 'H' + f(Rr - 0.12) + '" stroke="' + INK + '" stroke-width="' + f(rw) + '" stroke-linecap="round"/>';
	var under = Math.max(s.deckH * 0.28, w);
	var underColor = round === 'round2' ? '#171b1f' : '#2c3238';
	out += '<rect x="' + L + '" y="' + f(top) + '" width="' + f(Rr - L) + '" height="' + f(s.deckH - under) + '" fill="url(#' + p + '-fascia)"/>'
		+ '<rect x="' + L + '" y="' + f(bot - under) + '" width="' + f(Rr - L) + '" height="' + f(under) + '" fill="' + underColor + '"/>'
		+ '<rect x="' + L + '" y="' + f(top) + '" width="' + f(Rr - L) + '" height="' + f(s.deckH) + '" fill="none" stroke="' + INK + '" stroke-width="' + f(w * 0.8) + '" stroke-linejoin="round"/>';
	return { svg: out, railY: railY, rw: rw, L: L, Rr: Rr, top: top, bot: bot };
}

/** Sway bracing, byte-identical to gen-larger-tower.js's. */
function bracing(p, xl, xr, yTop, w) {
	var y1 = (yTop + 24) / 2, rod = 0.1, out = '';
	out += '<g stroke="' + INK + '" stroke-width="' + rod + '" stroke-linecap="round" fill="none">'
		+ '<path d="M' + f(xl) + ' ' + f(yTop) + 'L' + f(xr) + ' ' + f(y1) + 'M' + f(xr) + ' ' + f(yTop) + 'L' + f(xl) + ' ' + f(y1) + '"/>'
		+ '<path d="M' + f(xl) + ' ' + f(y1) + 'L' + f(xr) + ' 24M' + f(xr) + ' ' + f(y1) + 'L' + f(xl) + ' 24"/></g>';
	out += '<rect x="' + f(xl) + '" y="' + f(y1 - 0.16) + '" width="' + f(xr - xl) + '" height="0.32" fill="url(#' + p + '-strut)" stroke="' + INK + '" stroke-width="' + f(w * 0.7) + '"/>';
	return out;
}

/** One column (leg or riser), centered on x, from y0 to y1, shaded as a cylinder. */
function column(p, x, y0, y1, width, w) {
	return '<rect x="' + f(x - width / 2) + '" y="' + f(y0) + '" width="' + f(width) + '" height="' + f(y1 - y0) + '" fill="url(#' + p + '-leg)"'
		+ (w ? ' stroke="' + INK + '" stroke-width="' + f(w) + '"' : '') + '/>';
}

/**
 * Build one candidate. opt: 'real' (option 3) | 'riveted' (option 4). sizeKey: SIZES key.
 * split: true for the 512 maskable treatment. round: 'round1' | 'round2'.
 */
function build(opt, sizeKey, split, p, extra, round) {
	extra = extra || {};
	var s = SIZES[sizeKey];
	var w = s.stroke;
	var S = split ? (extra.scale || BODY_SCALE) : 1;
	function body(inner) { return split ? '<g transform="translate(12 12) scale(' + S + ') translate(-12 -12)">' + inner + '</g>' : inner; }
	var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="LibreWaterNet"><title>LibreWaterNet</title>' + defs(p, round) + sky(p);

	var legOutline = s.leg > 3 * w ? w * 0.7 : 0;
	var cw = catwalk(p, s, round);
	var legTop = cw.top + 0.1;
	function descenders(riserOnly) {
		var xl = nx(G1.shL, S), xr = nx(G1.shR, S);
		var lt = ny(legTop, S), rt = ny(G1.pole - 0.4, S);
		if (riserOnly) { return column(p, 12, rt, 24.5, s.riser * S, legOutline * S); }
		return column(p, xl, lt, 24.5, s.leg * S, legOutline * S) + column(p, xr, lt, 24.5, s.leg * S, legOutline * S);
	}
	var tank = fills(p, round, s)
		+ (opt === 'riveted' ? seams(p, s) : '')
		+ outlineOpen(w)
		+ '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
		+ '<path d="M7.95 3.7V14.15M16.05 3.7V14.15"/>'
		+ '<path d="' + bowlD() + '"/></g>';
	svg += (split ? descenders(true) : column(p, 12, G1.pole - 0.4, 24.5, s.riser, legOutline));
	svg += body(tank);
	if (extra.brace) { svg += bracing(p, nx(G1.shL, S), nx(G1.shR, S), ny(cw.bot, S), w * S); }
	svg += (split ? descenders(false)
		: column(p, G1.shL, legTop, 24.5, s.leg, legOutline) + column(p, G1.shR, legTop, 24.5, s.leg, legOutline));
	svg += body(cw.svg);
	return svg + '</svg>';
}

// ---- Tom's three picks -------------------------------------------------------------------------
var PICKS = {
	about: { opt: 'real', sizeKey: 'about', split: false, extra: {} },
	s192: { opt: 'real', sizeKey: 's192', split: false, extra: {} },
	s512: { opt: 'riveted', sizeKey: 's512', split: true, extra: { brace: true } }
};

// ---- the page -----------------------------------------------------------------------------------
var placed = 0;
function sized(svg, px) {
	placed++;
	return svg.replace(/(id="|url\(#)([a-z0-9]+)-/g, '$1$2u' + placed + '-').replace('<svg ', '<svg width="' + px + '" height="' + px + '" ');
}
function pairLabel(id, sentence) {
	return '<p class="why" id="' + id + '">' + sentence + '</p>';
}
function tile(svg, px, label) {
	return '<figure class="tile"><figcaption>' + label + '</figcaption>' + sized(svg, px) + '</figure>';
}
/** Like tile(), but for markup that is already sized (apexCrop() pre-sizes its own SVG). */
function tilePresized(sizedSvg, label) {
	return '<figure class="tile"><figcaption>' + label + '</figcaption>' + sizedSvg + '</figure>';
}
function aboutBox(svg, label) {
	return '<figure><figcaption>' + label + '</figcaption><div class="about"><div class="title">About</div>'
		+ '<h2 class="name">' + sized(svg, 48) + '<span>LibreWaterNet.org</span></h2>'
		+ '<p class="ded">You are loved and cherished forever, you have nothing to fear, and you are not ruining everything.</p>'
		+ '<p class="legal">Licensed under the GNU General Public License v3.0 or later.<br>Copyright &copy; 2009&ndash;2026 Thomas Gail Haws</p></div></figure>';
}
/** A crop of the SVG's own viewBox, zoomed on the roof apex, so the conical fan is unmistakable. */
function apexCrop(svg, px) {
	var cropped = svg.replace(/viewBox="0 0 24 24"/, 'viewBox="6 0 12 8"');
	return sized(cropped, px);
}

var r1About = build(PICKS.about.opt, PICKS.about.sizeKey, PICKS.about.split, 'r1a1', PICKS.about.extra, 'round1');
var r2About = build(PICKS.about.opt, PICKS.about.sizeKey, PICKS.about.split, 'r2a1', PICKS.about.extra, 'round2');
var r1S192 = build(PICKS.s192.opt, PICKS.s192.sizeKey, PICKS.s192.split, 'r1i1', PICKS.s192.extra, 'round1');
var r2S192 = build(PICKS.s192.opt, PICKS.s192.sizeKey, PICKS.s192.split, 'r2i1', PICKS.s192.extra, 'round2');
var r1S512 = build(PICKS.s512.opt, PICKS.s512.sizeKey, PICKS.s512.split, 'r1s1', PICKS.s512.extra, 'round1');
var r2S512 = build(PICKS.s512.opt, PICKS.s512.sizeKey, PICKS.s512.split, 'r2s1', PICKS.s512.extra, 'round2');

var html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
	+ '<title>Roof Shading, Round 2</title>\n<style>'
	+ ':root{--bg:#f4f4f2;--fg:#15201f;--muted:#555;--line:#c9c9c4}'
	+ 'body{margin:0;padding:24px 16px 48px;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}'
	+ 'main{max-width:1100px;margin:0 auto}h1{font-size:22px;margin:0 0 6px}h2.sec{font-size:17px;margin:34px 0 4px;border-top:1px solid var(--line);padding-top:18px}'
	+ 'p.lead{margin:0 0 10px;max-width:76ch}p.why{margin:10px 0 0;max-width:76ch;font-weight:600}'
	+ '.row{display:flex;flex-wrap:wrap;gap:22px;align-items:flex-end;margin-top:12px}'
	+ 'figure{margin:0}figcaption{font-size:13px;font-weight:600;margin-bottom:6px}'
	+ '.tile svg{display:block;box-shadow:0 1px 3px rgba(0,0,0,.25)}'
	+ '.about{width:26rem;max-width:calc(100vw - 32px);box-sizing:border-box;background:#fff;border:1px solid #333;padding:40px 12px 12px;box-shadow:2px 2px 6px rgba(0,0,0,.3);position:relative;font-size:16px}'
	+ '.about .title{position:absolute;top:0;left:0;right:0;padding:6px 12px;font-weight:600;border-bottom:1px solid #ccc;background:#f3f3f3}'
	+ '.about .name{display:flex;align-items:center;gap:.45em;font-size:2rem;margin:0 0 .5em;font-weight:500}.about .name svg{flex:none}'
	+ '.about .ded{font-style:italic;margin:0 0 .8em}.about .legal{margin:0}'
	+ '@media (max-width:600px){.tile svg{max-width:calc(100vw - 32px);height:auto}}'
	+ '</style></head><body><main>'
	+ '<h1>Roof shading, round 2 (2026-09-28)</h1>'
	+ '<p class="lead">Tom on round 1: &ldquo;The roof is not shaded conically. This is apparent at all sizes. The '
	+ 'largest size is most obvious&rdquo; (with a red arrow at the 512&rsquo;s apex); &ldquo;The top of the cylinder '
	+ 'needs a seam, I believe. Check references&rdquo;; and &ldquo;The underside of the catwalk should be in shadow. '
	+ 'Maybe move the catwalk down a little bit to meet the belly.&rdquo;</p>'
	+ '<p class="lead"><b>Conical shading:</b> round 1 pasted the wall&rsquo;s horizontal gradient onto the roof, which '
	+ 'gives vertical iso-brightness lines &mdash; correct for a cylinder, wrong for a cone. Round 2 replaces it with a '
	+ 'fan of wedges from the apex to the base rim, each one flat colour sampled from the wall&rsquo;s own ramp at its '
	+ 'azimuth, so the shading converges at the apex like a real lit cone. <b>Seam:</b> a rim line (dark line, thin '
	+ 'highlight above it) now runs at the wall/roof junction on every build, matching the top-angle/knuckle joint real '
	+ 'welded tanks use there (references in the generator script&rsquo;s header comment). <b>Catwalk shadow:</b> the '
	+ 'deck moved down toward the bowl&rsquo;s spring line, and both the underside band and the cast shadow on the bowl '
	+ 'top are darker.</p>'

	+ '<h2 class="sec">About box mark, 48 px (option 3)</h2>'
	+ '<div class="row">' + aboutBox(r1About, 'ROUND 1') + aboutBox(r2About, 'ROUND 2') + '</div>'
	+ '<div class="row">' + tile(r1About, 144, 'ROUND 1 at 3&times; (144 px)') + tile(r2About, 144, 'ROUND 2 at 3&times; (144 px)') + '</div>'
	+ pairLabel('why-about', 'Changed: roof fan, rim seam, darker catwalk shadow, deck moved down slightly. At 48 px the seam and fan read as a subtle tonal shift; the shadow under the deck is the most visible change here.')

	+ '<h2 class="sec">App icon, 192 px (option 3)</h2>'
	+ '<div class="row">' + tile(r1S192, 192, 'ROUND 1, real size') + tile(r2S192, 192, 'ROUND 2, real size') + '</div>'
	+ '<div class="row">' + tile(r1S192, 48, 'ROUND 1 at 48 px') + tile(r2S192, 48, 'ROUND 2 at 48 px') + '</div>'
	+ pairLabel('why-192', 'Same fan/seam/shadow fix at 192&rsquo;s own stroke weights, then shrunk to 48 to confirm the fan still reads as shading, not noise, once small.')

	+ '<h2 class="sec">Splash screen / icon-512 (option 4 + bracing)</h2>'
	+ '<div class="row">' + tile(r1S512, 512, 'ROUND 1, real size') + tile(r2S512, 512, 'ROUND 2, real size') + '</div>'
	+ '<div class="row">' + tile(r1S512, 32, 'ROUND 1 at 32 px') + tile(r2S512, 32, 'ROUND 2 at 32 px') + '</div>'
	+ '<div class="row">' + tilePresized(apexCrop(r1S512, 320), 'ROUND 1, apex crop') + tilePresized(apexCrop(r2S512, 320), 'ROUND 2, apex crop') + '</div>'
	+ pairLabel('why-512', 'This is where Tom marked the defect: the apex crop below makes the fan&rsquo;s convergence at the peak unmistakable, next to round 1&rsquo;s flat vertical banding. The seam ring and darker catwalk shadow are visible in the real-size and 32 px tiles above.')

	+ '</main></body></html>\n';

fs.writeFileSync(PAGE, html);
console.log('wrote ' + PAGE);

// ---- rasters + the shipped files -----------------------------------------------------------------
function findChromium() {
	if (process.env.CHROME_PATH) { return process.env.CHROME_PATH; }
	var cache = path.join(require('os').homedir(), '.cache', 'ms-playwright');
	var dirs = fs.existsSync(cache) ? fs.readdirSync(cache).filter(function (d) { return /^chromium-/.test(d); }) : [];
	for (var i = 0; i < dirs.length; i++) {
		var exe = path.join(cache, dirs[i], 'chrome-linux64', 'chrome');
		if (fs.existsSync(exe)) { return exe; }
		exe = path.join(cache, dirs[i], 'chrome-linux', 'chrome');
		if (fs.existsSync(exe)) { return exe; }
	}
	return null;
}
function playwright() {
	var tries = [path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'),
		'/home/haws/webdev/hawsedc.com/engcalcs/dev/browser-pass/node_modules/playwright-core'];
	for (var i = 0; i < tries.length; i++) { if (fs.existsSync(tries[i])) { return require(tries[i]); } }
	throw new Error('playwright-core not found; npm install in dev/browser-pass');
}

(async function main() {
	var pw = playwright();
	var browser = await pw.chromium.launch({ executablePath: findChromium() || undefined });
	async function shot(svg, px, file) {
		var page = await browser.newPage({ viewport: { width: px, height: px }, deviceScaleFactor: 1 });
		await page.setContent('<!doctype html><style>html,body{margin:0}#t{width:' + px + 'px;height:' + px + 'px;line-height:0}</style><div id="t">' + sized(svg, px) + '</div>');
		await (await page.$('#t')).screenshot({ path: path.join(OUT, file) });
		await page.close();
	}

	await shot(r1About, 48, 'about-48-round1.png');
	await shot(r2About, 48, 'about-48-round2.png');
	await shot(r1S192, 192, 'icon-192-round1.png');
	await shot(r2S192, 192, 'icon-192-round2.png');
	await shot(r1S512, 512, 'icon-512-round1.png');
	await shot(r2S512, 512, 'icon-512-round2.png');

	var pg = await browser.newPage({ viewport: { width: 1160, height: 1400 }, deviceScaleFactor: 1 });
	await pg.goto('file://' + PAGE);
	await pg.screenshot({ path: path.join(OUT, 'page.png'), fullPage: true });
	await pg.close();

	// ---- the shipped files, ROUND 2 shading, Tom's three picks ----
	var favSvg = build(PICKS.about.opt, PICKS.about.sizeKey, PICKS.about.split, 'wtfav', PICKS.about.extra, 'round2');
	fs.writeFileSync(FAVICON_OUT, favSvg + '\n');

	var icon192Svg = build(PICKS.s192.opt, PICKS.s192.sizeKey, PICKS.s192.split, 'ic192', PICKS.s192.extra, 'round2');
	await shot(icon192Svg, 192, 'shipped-icon-192.png');
	fs.copyFileSync(path.join(OUT, 'shipped-icon-192.png'), ICON192_OUT);

	var icon512Svg = build(PICKS.s512.opt, PICKS.s512.sizeKey, PICKS.s512.split, 'ic512', PICKS.s512.extra, 'round2');
	await shot(icon512Svg, 512, 'shipped-icon-512.png');
	fs.copyFileSync(path.join(OUT, 'shipped-icon-512.png'), ICON512_OUT);
	fs.writeFileSync(ICONSVG_OUT, icon512Svg + '\n');

	await browser.close();
	console.log('wrote ' + FAVICON_OUT);
	console.log('wrote ' + ICON192_OUT);
	console.log('wrote ' + ICON512_OUT);
	console.log('wrote ' + ICONSVG_OUT);
	console.log('wrote ' + OUT + '/*.png');
})().catch(function (e) { console.error(e); process.exit(1); });
