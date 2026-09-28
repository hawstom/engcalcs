#!/usr/bin/env node
/*
 * The LARGER water tower, as a comparison for Tom to choose from -- ROADMAP Tasks 679, 648 and 645,
 * which he tied into one piece of work on 2026-09-21 ("the beauty of the larger versions of the
 * water tower icon ... 'My home town water tower', with realistic legs, catwalk, and maybe even
 * seams and rivets for the installed app splash screen").
 *
 * NOTHING HERE SHIPS. icons/favicon.svg is read, never written, and neither are the three app icons.
 * The output is a page and a set of PNGs:
 *
 *   dev/icon-preview/larger-tower-2026-09-27.html   -- self-contained, inline SVG, no requests
 *   dev/icon-preview/render/larger-tower/*.png      -- every option at every size, plus the page
 *
 * THE FOUR OPTIONS, each at the size it would really be used:
 *   1  current   -- what ships today (favicon.svg at About and 192; the split-transform 512)
 *   2  thin      -- the SAME drawing with the outline narrowed for the size. Nothing else moves.
 *   3  real      -- thin outline, plus legs and riser drawn as columns of a believable thickness
 *                   and shaded as the cylinders they are, and the catwalk as a robust deck with a
 *                   handrail above it (Tom, 2026-09-17: "a robust deck plus a handrail above it").
 *   4  riveted   -- option 3 plus plate seams and rivets. 512 (the splash) only.
 *
 * THE GEOMETRY IS THE FAVICON'S. Every centerline below is a favicon.svg coordinate: roof apex
 * (12,2.2), shoulders (7.95|16.05, 3.7), springline 14.15, bowl pole 18.15, catwalk 13.55, legs on
 * the wall lines, riser on the centerline, descenders to y=24. What changes with size is how each
 * part is DRAWN -- stroke weight, and whether a leg is a line or a column -- never where it is.
 *
 * THE SHADING RULE (ship-notes.md): one light above, three surfaces, shading follows the SOLID. So
 * a leg, the riser and the catwalk fascia are cylinders and take the wall's left-right ramp; the
 * deck's underside is a downward face and is dark; seams are lap joints whose lower edge faces down.
 *
 * STROKE WEIGHT BY SIZE, anchored on Tom's own sketch: his outline was 5 px on a 193 px tank, which
 * maps to 0.6 of a unit (README.md, "What had to change from his sketch"). About renders at 48 CSS
 * px (h2 is 2rem in Bootstrap at >=1200px; the mark is 1.5em, css/engcalcs.css .lpn-about-mark), so
 * 0.6 unit is 1.2 CSS px there. At 192 and 512 the same idea -- a hairline of a few device pixels --
 * gives 0.3 and 0.18 of a unit.
 *
 *   node dev/icon-preview/gen-larger-tower.js
 *   (take `flock /tmp/engcalcs-browser.lock` around it; it launches headless Chromium)
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
'use strict';
var fs = require('fs');
var path = require('path');

var here = __dirname;
var ROOT = path.join(here, '..', '..');
var OUT = path.join(here, 'render', 'larger-tower');
var PAGE = path.join(here, 'larger-tower-2026-09-27.html');
fs.mkdirSync(OUT, { recursive: true });

var FAVICON = fs.readFileSync(path.join(ROOT, 'icons', 'favicon.svg'), 'utf8');

// ---- the favicon's own coordinates -------------------------------------------------------------
var G = {
	apex: [12, 2.2], shL: 7.95, shR: 16.05, shY: 3.7, spring: 14.15, pole: 18.15,
	walkY: 13.55, walkL: 7.1, walkR: 16.9, edge: 24, cx: 12
};
var R = (G.shR - G.shL) / 2; // tank radius, 4.05
var SAFE_R = 9.6;
var BODY_SCALE = 0.85; // the shipped maskable body scale (gen-app-icons.js)
// Task 645: the thin outline frees room in the safe circle, so the body can grow back toward the
// favicon's own proportion. 0.93 keeps about the margin the shipped heavy outline really has (4.2% against 4.4%)
// (its round apex join is the tightest point, which gen-app-icons.js did not count).
var EXTRA_SCALE = 0.93;

// ---- per-size drawing parameters ----------------------------------------------------------------
// stroke: outline width in favicon units. leg/riser: column widths for option 3/4.
var SIZES = {
	about: { px: 48, stroke: 0.6, leg: 1.0, riser: 1.35, posts: 0, midrail: false, deckH: 0.7, railGap: 1.05 },
	s192: { px: 192, stroke: 0.3, leg: 0.72, riser: 1.05, posts: 30, midrail: true, deckH: 0.62, railGap: 1.0 },
	s512: { px: 512, stroke: 0.18, leg: 0.66, riser: 0.98, posts: 18, midrail: true, deckH: 0.62, railGap: 1.0 }
};
var INK = '#232a30';

function f(n) { return (Math.round(n * 1000) / 1000).toString(); }

// ---- 1: current ---------------------------------------------------------------------------------
function prefixIds(svg, p) {
	return svg.replace(/id="wtfav-/g, 'id="' + p + '-').replace(/url\(#wtfav-/g, 'url(#' + p + '-');
}
function splitFavicon(svg) {
	var m = svg.match(/<g filter="url\(#wtfav-blur\)"[\s\S]*?<\/g>/);
	var a = svg.indexOf(m[0]) + m[0].length;
	return { head: svg.slice(0, a), tower: svg.slice(a, svg.lastIndexOf('</svg>')) };
}
/** The shipped icon-512 / icon.svg drawing, rebuilt exactly as gen-app-icons.js builds it. */
function currentSplit(svg) {
	var parts = splitFavicon(svg);
	var S = BODY_SCALE;
	var body = parts.tower.replace('<path d="M7.95 3.7V24M16.05 3.7V24"/>', '<path d="M7.95 3.7V14.15M16.05 3.7V14.15"/>')
		.replace('<path d="M12 18.15V24"/>', '');
	var d = '<g fill="none" stroke="' + INK + '" stroke-width="' + 2 * S + '" stroke-linecap="round" stroke-linejoin="round">'
		+ '<path d="M' + f(nx(7.95, S)) + ' ' + f(ny(14.15, S)) + 'V24"/>'
		+ '<path d="M' + f(nx(16.05, S)) + ' ' + f(ny(14.15, S)) + 'V24"/>'
		+ '<path d="M12 ' + f(ny(18.15, S)) + 'V24"/></g>';
	return parts.head + '<g transform="translate(12 12) scale(' + S + ') translate(-12 -12)">' + body + '</g>' + d + '</svg>';
}
function nx(x, S) { return 12 + S * (x - 12); }
function ny(y, S) { return 12 + S * (y - 12); }

// ---- 2/3/4: the drawn options -------------------------------------------------------------------
function defs(p, withLeg) {
	var ramp = '<stop offset="0" stop-color="#6f767d"/><stop offset="0.18" stop-color="#9aa2a9"/><stop offset="0.36" stop-color="#eef1f3"/><stop offset="0.54" stop-color="#c2c8cd"/><stop offset="0.78" stop-color="#8b9299"/><stop offset="1" stop-color="#666d74"/>';
	// A leg is a cylinder under the tank: the same ramp, a step darker, because it stands in the
	// tank's own shade from a light above.
	var legRamp = '<stop offset="0" stop-color="#555c63"/><stop offset="0.25" stop-color="#7d858c"/><stop offset="0.4" stop-color="#b9c0c6"/><stop offset="0.6" stop-color="#8f979e"/><stop offset="1" stop-color="#4a5157"/>';
	return '<defs>'
		+ '<linearGradient id="' + p + '-wall" x1="0" y1="0" x2="1" y2="0">' + ramp + '</linearGradient>'
		+ '<radialGradient id="' + p + '-roof" gradientUnits="userSpaceOnUse" cx="10.9" cy="2.9" r="5.2"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#f4f6f8"/><stop offset="0.85" stop-color="#dfe4e8"/><stop offset="1" stop-color="#c9d0d6"/></radialGradient>'
		+ '<radialGradient id="' + p + '-bowl" gradientUnits="userSpaceOnUse" cx="12" cy="14.15" r="5.4"><stop offset="0" stop-color="#9aa2a9"/><stop offset="0.45" stop-color="#767d84"/><stop offset="0.8" stop-color="#5b6167"/><stop offset="1" stop-color="#454a50"/></radialGradient>'
		+ '<linearGradient id="' + p + '-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ecbe8"/><stop offset="1" stop-color="#dbe9f2"/></linearGradient>'
		+ '<filter id="' + p + '-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>'
		+ (withLeg
			? '<linearGradient id="' + p + '-leg" x1="0" y1="0" x2="1" y2="0">' + legRamp + '</linearGradient>'
			// The fascia is the catwalk's own curved face: the wall's ramp, darkened a step, across
			// the catwalk's full width, so its highlight falls on the same limb as the wall's.
			+ '<linearGradient id="' + p + '-fascia" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4e555b"/><stop offset="0.2" stop-color="#7a8188"/><stop offset="0.37" stop-color="#c3c9ce"/><stop offset="0.55" stop-color="#99a0a6"/><stop offset="0.8" stop-color="#6c737a"/><stop offset="1" stop-color="#4a5056"/></linearGradient>'
			+ '<linearGradient id="' + p + '-strut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cfd4"/><stop offset="0.45" stop-color="#8b9299"/><stop offset="1" stop-color="#454b51"/></linearGradient>'
			+ '<clipPath id="' + p + '-wallclip"><rect x="' + G.shL + '" y="' + G.shY + '" width="' + (G.shR - G.shL) + '" height="' + (G.spring - G.shY) + '"/></clipPath>'
			+ '<clipPath id="' + p + '-bowlclip"><path d="' + bowlD() + 'Z"/></clipPath>'
			+ '<clipPath id="' + p + '-roofclip"><path d="M7.95 3.7L12 2.2L16.05 3.7Z"/></clipPath>'
			: '')
		+ '</defs>';
}
function bowlD() { return 'M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15'; }
function sky(p) {
	return '<rect x="0" y="0" width="24" height="24" fill="url(#' + p + '-sky)"/>'
		+ '<g filter="url(#' + p + '-blur)" fill="#ffffff" opacity="0.72"><ellipse cx="6" cy="5.5" rx="6" ry="1.7"/><ellipse cx="18.5" cy="9" rx="5.5" ry="1.5"/><ellipse cx="11" cy="19.5" rx="8" ry="1.9"/></g>';
}
function fills(p) {
	return '<path d="M7.95 3.7L12 2.2L16.05 3.7V14.15C16.05 16.36 14.24 18.15 12 18.15C9.76 18.15 7.95 16.36 7.95 14.15Z" fill="url(#' + p + '-wall)"/>'
		+ '<path d="M7.95 3.7L12 2.2L16.05 3.7Z" fill="url(#' + p + '-roof)"/>'
		+ '<path d="' + bowlD() + 'Z" fill="url(#' + p + '-bowl)"/>';
}
function outlineOpen(w) {
	return '<g fill="none" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round">';
}

/** x of a point at azimuth th (radians, 0 = facing us) on a circle of radius r about the axis. */
function az(th, r) { return G.cx + r * Math.sin(th); }

/** Plate seams and rivets (option 4). Everything is a translucent overlay, so it takes the shade of
 *  whatever surface it sits on -- the seam follows the solid instead of carrying a colour of its own. */
function seams(p, s) {
	var out = '';
	var dark = 'rgba(20,26,32,0.42)', lite = 'rgba(255,255,255,0.45)';
	var sw = 0.055;
	var rv = 0.055; // rivet radius, in units (1.2 px at 512)
	function rivet(x, y, k) {
		// k (0..1) squashes the rivet toward the limb, where the shell turns away from us
		return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rv * k) + '" ry="' + f(rv) + '" fill="rgba(20,26,32,0.38)"/>'
			+ '<ellipse cx="' + f(x) + '" cy="' + f(y - rv * 0.45) + '" rx="' + f(rv * 0.55 * k) + '" ry="' + f(rv * 0.45) + '" fill="rgba(255,255,255,0.55)"/>';
	}
	// WALL: five courses between the shoulder and the springline; the catwalk hides the last seam.
	var courses = 5, h = (G.spring - G.shY) / courses;
	var wall = '';
	for (var i = 1; i < courses; i++) {
		var y = G.shY + i * h;
		// lap joint: the upper plate's edge faces down, so a dark line with a lit line just above it
		wall += '<path d="M' + G.shL + ' ' + f(y) + 'H' + G.shR + '" stroke="' + dark + '" stroke-width="' + sw + '"/>'
			+ '<path d="M' + G.shL + ' ' + f(y - sw) + 'H' + G.shR + '" stroke="' + lite + '" stroke-width="' + (sw * 0.6) + '"/>';
		for (var a = -84; a <= 84; a += 7) {
			var th = a * Math.PI / 180;
			wall += rivet(az(th, R), y + 0.14, Math.cos(th));
		}
	}
	// vertical seams, staggered course by course, foreshortened toward the limbs
	for (var c = 0; c < courses; c++) {
		var y0 = G.shY + c * h, y1 = y0 + h;
		var off = (c % 2) ? 22.5 : 0;
		for (var a2 = -90 + off; a2 < 90; a2 += 45) {
			if (Math.abs(a2) > 80) { continue; }
			var th2 = a2 * Math.PI / 180, x = az(th2, R), k = Math.cos(th2);
			wall += '<path d="M' + f(x) + ' ' + f(y0) + 'V' + f(y1) + '" stroke="' + dark + '" stroke-width="' + f(sw * Math.max(k, 0.4)) + '"/>';
			for (var yy = y0 + 0.28; yy < y1 - 0.12; yy += 0.3) {
				wall += rivet(x + 0.13 * k, yy, k);
			}
		}
	}
	out += '<g clip-path="url(#' + p + '-wallclip)" fill="none">' + wall + '</g>';

	// ROOF: radial seams on the cone, apex to eave, foreshortened like the wall's.
	var roof = '';
	for (var a3 = -60; a3 <= 60; a3 += 30) {
		var x3 = az(a3 * Math.PI / 180, R);
		roof += '<path d="M12 2.2L' + f(x3) + ' 3.7" stroke="rgba(20,26,32,0.22)" stroke-width="' + sw + '"/>';
	}
	out += '<g clip-path="url(#' + p + '-roofclip)" fill="none">' + roof + '</g>';

	// BOWL: one latitude seam and meridian gores; a meridian of a hemisphere seen side-on is a
	// quarter ellipse from the springline to the pole.
	var bowl = '';
	var latT = 40 * Math.PI / 180, ly = G.spring + R * Math.sin(latT) * (4 / 4.05);
	bowl += '<path d="M7 ' + f(ly) + 'H17" stroke="rgba(10,14,18,0.5)" stroke-width="' + sw + '"/>'
		+ '<path d="M7 ' + f(ly - sw) + 'H17" stroke="rgba(255,255,255,0.22)" stroke-width="' + (sw * 0.6) + '"/>';
	for (var a4 = -60; a4 <= 60; a4 += 30) {
		var th4 = a4 * Math.PI / 180, rx = R * Math.sin(th4);
		if (Math.abs(rx) < 0.01) {
			bowl += '<path d="M12 ' + G.spring + 'V' + G.pole + '" stroke="rgba(10,14,18,0.45)" stroke-width="' + sw + '"/>';
		} else {
			bowl += '<path d="M' + f(12 + rx) + ' ' + G.spring + 'C' + f(12 + rx) + ' ' + f(G.spring + 2.2) + ' ' + f(12 + rx * 0.55) + ' ' + f(G.pole) + ' 12 ' + G.pole
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

/** Catwalk as a robust deck plus a handrail above it (option 3/4). */
function catwalk(p, s) {
	var w = s.stroke;
	var L = 6.75, Rr = 17.25; // deck span: the favicon catwalk's own reach (its round cap ran to 6.1)
	var top = G.walkY - s.deckH * 0.45, bot = top + s.deckH;
	var railY = top - s.railGap;
	var rw = Math.max(w * 0.9, 0.16); // top rail
	var out = '';
	// posts first, so the rail caps them
	var posts = [L + 0.12, Rr - 0.12];
	if (s.posts) {
		var rc = (Rr - L) / 2;
		for (var a = -90 + s.posts; a < 90; a += s.posts) { posts.push(az(a * Math.PI / 180, rc)); }
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
	// the deck: fascia (a curved face, the wall's ramp) with its dark underside below it
	var under = Math.max(s.deckH * 0.28, w);
	out += '<rect x="' + L + '" y="' + f(top) + '" width="' + f(Rr - L) + '" height="' + f(s.deckH - under) + '" fill="url(#' + p + '-fascia)"/>'
		+ '<rect x="' + L + '" y="' + f(bot - under) + '" width="' + f(Rr - L) + '" height="' + f(under) + '" fill="#2c3238"/>'
		+ '<rect x="' + L + '" y="' + f(top) + '" width="' + f(Rr - L) + '" height="' + f(s.deckH) + '" fill="none" stroke="' + INK + '" stroke-width="' + f(w * 0.8) + '" stroke-linejoin="round"/>';
	return { svg: out, railY: railY, rw: rw, L: L, Rr: Rr, top: top, bot: bot };
}

/** Sway bracing (extra, not asked for): a strut between the legs and a tie-rod X in each panel,
 *  the thing that makes a row of stilts read as a small-town tower. Drawn in final-frame units. */
function bracing(p, xl, xr, yTop, w) {
	var y1 = (yTop + 24) / 2, rod = 0.1, out = '';
	out += '<g stroke="' + INK + '" stroke-width="' + rod + '" stroke-linecap="round" fill="none">'
		+ '<path d="M' + f(xl) + ' ' + f(yTop) + 'L' + f(xr) + ' ' + f(y1) + 'M' + f(xr) + ' ' + f(yTop) + 'L' + f(xl) + ' ' + f(y1) + '"/>'
		+ '<path d="M' + f(xl) + ' ' + f(y1) + 'L' + f(xr) + ' 24M' + f(xr) + ' ' + f(y1) + 'L' + f(xl) + ' 24"/></g>';
	// the strut is a horizontal tube: lit on top, dark beneath
	out += '<rect x="' + f(xl) + '" y="' + f(y1 - 0.16) + '" width="' + f(xr - xl) + '" height="0.32" fill="url(#' + p + '-strut)" stroke="' + INK + '" stroke-width="' + f(w * 0.7) + '"/>';
	return out;
}

/** One column (leg or riser), centered on x, from y0 to y1, shaded as a cylinder. */
function column(p, x, y0, y1, width, w) {
	return '<rect x="' + f(x - width / 2) + '" y="' + f(y0) + '" width="' + f(width) + '" height="' + f(y1 - y0) + '" fill="url(#' + p + '-leg)"'
		+ (w ? ' stroke="' + INK + '" stroke-width="' + f(w) + '"' : '') + '/>';
}

/**
 * Build an option. opt: 'thin' | 'real' | 'riveted'. size: key of SIZES. split: the maskable
 * body/descender split (512 only), exactly the shipped transform with this drawing inside it.
 */
function build(opt, sizeKey, split, p, extra) {
	extra = extra || {};
	var s = SIZES[sizeKey];
	var w = s.stroke;
	var S = split ? (extra.scale || BODY_SCALE) : 1;
	function body(inner) { return split ? '<g transform="translate(12 12) scale(' + S + ') translate(-12 -12)">' + inner + '</g>' : inner; }
	var real = opt !== 'thin';
	var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="LibreWaterNet">' + defs(p, real) + sky(p);

	if (!real) {
		// option 2: the favicon, stroke narrowed, nothing else
		var outline = outlineOpen(w)
			+ '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
			+ '<path d="M7.95 3.7V' + (split ? G.spring : 24) + 'M16.05 3.7V' + (split ? G.spring : 24) + '"/>'
			+ '<path d="' + bowlD() + '"/>'
			+ '<path d="M7.1 13.55H16.9"/>'
			+ (split ? '' : '<path d="M12 18.15V24"/>') + '</g>';
		svg += body(fills(p) + outline);
		if (split) {
			svg += outlineOpen(w * S)
				+ '<path d="M' + f(nx(7.95, S)) + ' ' + f(ny(14.15, S)) + 'V24"/>'
				+ '<path d="M' + f(nx(16.05, S)) + ' ' + f(ny(14.15, S)) + 'V24"/>'
				+ '<path d="M12 ' + f(ny(18.15, S)) + 'V24"/></g>';
		}
		return svg + '</svg>';
	}

	// options 3 and 4
	var legOutline = s.leg > 3 * w ? w * 0.7 : 0;
	var cw = catwalk(p, s);
	var legTop = cw.top + 0.1;
	function descenders(riserOnly) {
		// in the split, columns are placed on the scaled body's attachment points and run to y=24
		var xl = nx(G.shL, S), xr = nx(G.shR, S);
		var lt = ny(legTop, S), rt = ny(G.pole - 0.4, S);
		if (riserOnly) { return column(p, 12, rt, 24.5, s.riser * S, legOutline * S); }
		return column(p, xl, lt, 24.5, s.leg * S, legOutline * S) + column(p, xr, lt, 24.5, s.leg * S, legOutline * S);
	}
	var tank = fills(p)
		+ (opt === 'riveted' ? seams(p, s) : '')
		+ outlineOpen(w)
		+ '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
		+ '<path d="M7.95 3.7V14.15M16.05 3.7V14.15"/>'
		+ '<path d="' + bowlD() + '"/></g>';
	// riser behind the bowl; legs in front of the bowl (they stand outside the shell); deck on top.
	svg += (split ? descenders(true) : column(p, 12, G.pole - 0.4, 24.5, s.riser, legOutline));
	svg += body(tank);
	if (extra.brace) { svg += bracing(p, nx(G.shL, S), nx(G.shR, S), ny(cw.bot, S), w * S); }
	svg += (split ? descenders(false)
		: column(p, G.shL, legTop, 24.5, s.leg, legOutline) + column(p, G.shR, legTop, 24.5, s.leg, legOutline));
	svg += body(cw.svg);
	return svg + '</svg>';
}

// ---- the 80% safe circle, for every 512 candidate ------------------------------------------------
function dist(x, y) { return Math.sqrt((x - 12) * (x - 12) + (y - 12) * (y - 12)); }
function safeReport(label, pts, scale) {
	scale = scale || BODY_SCALE;
	// pts: [name, x, y, inkRadius] in UNSCALED units; the body is scaled by BODY_SCALE about center
	var worst = null;
	pts.forEach(function (q) {
		var d = scale * (dist(q[1], q[2]) + q[3]);
		if (!worst || d > worst.d) { worst = { name: q[0], d: d }; }
	});
	var margin = SAFE_R - worst.d;
	var line = label + ': worst body ink ' + worst.name + ' at ' + worst.d.toFixed(3) + ' of 9.6 -- '
		+ (margin >= 0 ? 'inside, margin ' + margin.toFixed(3) + ' (' + (100 * margin / SAFE_R).toFixed(1) + '%)' : 'OUTSIDE by ' + (-margin).toFixed(3));
	console.log('  ' + line);
	return { worst: worst, margin: margin, line: line };
}
function safeFor(opt, scale) {
	if (opt === 'current') {
		return safeReport('1 current', [['roof shoulder (round cap)', 7.95, 3.7, 1], ['roof apex (round join)', 12, 2.2, 1], ['catwalk cap', 7.1, 13.55, 1]]);
	}
	var s = SIZES.s512, w = s.stroke;
	if (opt === 'thin') {
		return safeReport('2 thin', [['roof shoulder (round cap)', 7.95, 3.7, w / 2], ['roof apex (round join)', 12, 2.2, w / 2], ['catwalk cap', 7.1, 13.55, w / 2]]);
	}
	var cw = catwalk('x', s);
	return safeReport(scale ? 'body at ' + scale : opt === 'real' ? '3 real' : '4 riveted', [['roof shoulder (round cap)', 7.95, 3.7, w / 2], ['roof apex (round join)', 12, 2.2, w / 2],
		['handrail end', cw.L + 0.12, cw.railY, cw.rw / 2], ['deck corner, top', cw.L, cw.top, w * 0.4], ['deck corner, bottom', cw.L, cw.bot, w * 0.4]], scale);
}

// ---- build every candidate ---------------------------------------------------------------------
var favAt = function (p) { return prefixIds(FAVICON, p).replace(/width="24"\s*height="24"/, ''); };
var C = {
	about: {
		current: favAt('a1'),
		thin: build('thin', 'about', false, 'a2'),
		real: build('real', 'about', false, 'a3')
	},
	s192: {
		current: favAt('b1'),
		thin: build('thin', 's192', false, 'b2'),
		real: build('real', 's192', false, 'b3')
	},
	s512: {
		current: prefixIds(currentSplit(FAVICON), 'c1').replace(/width="24"\s*height="24"/, ''),
		thin: build('thin', 's512', true, 'c2'),
		real: build('real', 's512', true, 'c3'),
		riveted: build('riveted', 's512', true, 'c4')
	},
	// NOT ASKED FOR: two things the thin outline makes possible, each against option 4 alone.
	extra: {
		scaled: build('riveted', 's512', true, 'd1', { scale: EXTRA_SCALE }),
		braced: build('riveted', 's512', true, 'd2', { brace: true }),
		both: build('riveted', 's512', true, 'd3', { scale: EXTRA_SCALE, brace: true })
	}
};

console.log('=== the 80% safe circle, 512 maskable, body scale ' + BODY_SCALE + ' (descenders run to y=24 by design) ===');
var SAFE = { current: safeFor('current'), thin: safeFor('thin'), real: safeFor('real'), riveted: safeFor('riveted'), scaled: safeFor('riveted', EXTRA_SCALE) };
function legRatio(S) { var wall = ny(G.spring, S) - ny(G.shY, S), leg = 24 - ny(G.spring, S); return leg / wall; }
var RATIO = { fav: legRatio(1), shipped: legRatio(BODY_SCALE), scaled: legRatio(EXTRA_SCALE) };
console.log('  leg-to-wall ratio: favicon ' + RATIO.fav.toFixed(3) + ', shipped 0.85 ' + RATIO.shipped.toFixed(3) + ', ' + EXTRA_SCALE + ' ' + RATIO.scaled.toFixed(3));

// ---- the page --------------------------------------------------------------------------------------
var NAMES = {
	current: '1 &middot; Current (ships today)',
	thin: '2 &middot; Narrower strokes only',
	real: '3 &middot; Narrower strokes, real legs, deck + handrail',
	riveted: '4 &middot; Option 3 plus seams and rivets'
};
// Each placement gets its own ids: the same drawing appears twice on the page (at 1x and 2x, and
// cropped), and a duplicate id resolves to whichever copy comes first.
var placed = 0;
function sized(svg, px) {
	placed++;
	return svg.replace(/(id="|url\(#)([a-z0-9]+)-/g, '$1$2u' + placed + '-').replace('<svg ', '<svg width="' + px + '" height="' + px + '" ');
}
function aboutBox(svg, label) {
	return '<figure><figcaption>' + label + '</figcaption><div class="about"><div class="title">About</div>'
		+ '<h2 class="name">' + sized(svg, 48) + '<span>LibreWaterNet.org</span></h2>'
		+ '<p class="ded">You are loved and cherished forever, you have nothing to fear, and you are not ruining everything.</p>'
		+ '<p class="legal">Licensed under the GNU General Public License v3.0 or later.<br>Copyright &copy; 2009&ndash;2026 Thomas Gail Haws</p></div></figure>';
}
function tile(svg, px, label, note) {
	return '<figure class="tile"><figcaption>' + label + '</figcaption>' + sized(svg, px) + (note ? '<p class="note">' + note + '</p>' : '') + '</figure>';
}
function masked(svg, px, label) {
	return '<figure class="tile"><figcaption>' + label + '</figcaption><div class="ringwrap" style="width:' + px + 'px;height:' + px + 'px">'
		+ '<div class="crop">' + sized(svg, px) + '</div></div></figure>';
}

var W = { about: SIZES.about.stroke, s192: SIZES.s192.stroke, s512: SIZES.s512.stroke };
var html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
	+ '<title>Larger Water Tower</title>\n<style>'
	+ ':root{--bg:#f4f4f2;--fg:#15201f;--muted:#555;--card:#fff;--line:#c9c9c4}'
	+ 'body{margin:0;padding:24px 16px 48px;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}'
	+ 'main{max-width:1180px;margin:0 auto}h1{font-size:22px;margin:0 0 6px}h2.sec{font-size:17px;margin:34px 0 4px;border-top:1px solid var(--line);padding-top:18px}'
	+ 'p.lead{margin:0 0 10px;max-width:74ch}.row{display:flex;flex-wrap:wrap;gap:22px;align-items:flex-start}'
	+ 'figure{margin:0}figcaption{font-size:13px;font-weight:600;margin-bottom:6px;max-width:30rem}.note{font-size:12.5px;color:var(--muted);max-width:' + 512 + 'px;margin:6px 0 0}'
	+ '.tile svg{display:block;box-shadow:0 1px 3px rgba(0,0,0,.25)}'
	+ '.about{width:30rem;max-width:calc(100vw - 32px);box-sizing:border-box;background:#fff;border:1px solid #333;padding:40px 12px 12px;box-shadow:2px 2px 6px rgba(0,0,0,.3);position:relative;font-size:16px}'
	+ '.about .title{position:absolute;top:0;left:0;right:0;padding:6px 12px;font-weight:600;border-bottom:1px solid #ccc;background:#f3f3f3}'
	+ '.about .name{display:flex;align-items:center;gap:.45em;font-size:2rem;margin:0 0 .5em;font-weight:500}.about .name svg{flex:none}'
	+ '.about .ded{font-style:italic;margin:0 0 .8em}.about .legal{margin:0}'
	+ '.ringwrap{position:relative;background:#d9d9d6}.crop{width:100%;height:100%;clip-path:circle(40% at center);line-height:0}'
	+ '.ringwrap::after{content:"";position:absolute;inset:10%;border-radius:50%;box-shadow:0 0 0 2px rgba(200,0,0,.7)}'
	+ 'table{border-collapse:collapse;font-size:13.5px;margin-top:8px}td,th{border:1px solid var(--line);padding:4px 8px;text-align:left;vertical-align:top}th{background:#ecece8}'
	+ '.zoom svg{image-rendering:auto}'
	+ '@media (max-width:600px){.tile svg{max-width:calc(100vw - 32px);height:auto}}'
	+ '</style></head><body><main>'
	+ '<h1>The larger water tower: four ways to draw it</h1>'
	+ '<p class="lead">Tasks 679, 648 and 645, one piece of work. The favicon is not touched and is not on this page; every drawing here uses its coordinates. '
	+ 'Each option is shown at the size it would really be used. Pick one per size, or one for all.</p>'
	+ '<table><tr><th>Option</th><th>What changes</th></tr>'
	+ '<tr><td>1</td><td>Nothing. What ships today.</td></tr>'
	+ '<tr><td>2</td><td>Only the outline, narrowed to suit the size: ' + W.about + ' of a unit at About (the weight of your own sketch), ' + W.s192 + ' at 192, ' + W.s512 + ' at 512, against the favicon&rsquo;s 2. Same drawing otherwise, so legs and catwalk thin down with it.</td></tr>'
	+ '<tr><td>3</td><td>Option 2&rsquo;s outline, plus: legs and riser drawn as round steel columns (riser the heavier) and shaded like the tank; the catwalk as a solid deck with its dark underside, and a handrail above it on posts (a mid-rail too at 192 and 512).</td></tr>'
	+ '<tr><td>4</td><td>Option 3 plus riveted plate seams on the tank, the roof and the bowl. For the 512 splash only.</td></tr></table>'

	+ '<h2 class="sec">Help, About: 48 px, the size it really is</h2>'
	+ '<p class="lead">The mark is 1.5em of a 2rem heading, 48 CSS px. The row below it is the same three marks at twice that, only so the difference is easy to see.</p>'
	+ '<div class="row">' + aboutBox(C.about.current, NAMES.current) + aboutBox(C.about.thin, NAMES.thin) + aboutBox(C.about.real, NAMES.real) + '</div>'
	+ '<div class="row zoom" style="margin-top:18px">' + tile(C.about.current, 96, '1 at 2&times;') + tile(C.about.thin, 96, '2 at 2&times;') + tile(C.about.real, 96, '3 at 2&times;') + '</div>'

	+ '<h2 class="sec">App shortcut icon: 192 px</h2>'
	+ '<p class="lead">icon-192 is declared &ldquo;any&rdquo;: never cropped, so it keeps the favicon&rsquo;s full-bleed framing and the 80% circle does not apply to it.</p>'
	+ '<div class="row">' + tile(C.s192.current, 192, NAMES.current) + tile(C.s192.thin, 192, NAMES.thin) + tile(C.s192.real, 192, NAMES.real) + '</div>'

	+ '<h2 class="sec">Splash screen and installed icon: 512 px</h2>'
	+ '<p class="lead">icon-512 and icon.svg are &ldquo;maskable&rdquo;, so a phone may crop them to any shape; only the middle 80% circle is promised. Every option keeps the shipped framing: the body scaled 0.85 inside that circle, the legs and riser run to the true bottom edge.</p>'
	+ '<div class="row">' + tile(C.s512.current, 512, NAMES.current, SAFE.current.line) + tile(C.s512.thin, 512, NAMES.thin, SAFE.thin.line) + '</div>'
	+ '<div class="row" style="margin-top:22px">' + tile(C.s512.real, 512, NAMES.real, SAFE.real.line) + tile(C.s512.riveted, 512, NAMES.riveted, SAFE.riveted.line) + '</div>'
	+ '<h2 class="sec">512, cropped to the 80% circle (the worst a phone may do), shown at 256</h2>'
	+ '<div class="row">' + masked(C.s512.current, 256, '1') + masked(C.s512.thin, 256, '2') + masked(C.s512.real, 256, '3') + masked(C.s512.riveted, 256, '4') + '</div>'
	+ '<p class="lead" style="margin-top:14px">The red ring is the 80% circle. The legs crossing it is by design (they reach the ground uncropped); the body stays inside it in every option.</p>'
	+ '<h2 class="sec">Not asked for: two things the thin outline makes possible, each against option 4</h2>'
	+ '<p class="lead"><b>A &middot; Task 645, shorter legs.</b> The heavy outline is what forced the body down to 0.85, and that is why the app icon&rsquo;s legs are leggier than the favicon&rsquo;s. '
	+ 'With the thin outline the body can grow to ' + EXTRA_SCALE + ' and keep the same margin the shipped icon really has. Leg-to-tank ratio: favicon ' + RATIO.fav.toFixed(2) + ', shipped ' + RATIO.shipped.toFixed(2) + ', this ' + RATIO.scaled.toFixed(2) + '.</p>'
	+ '<p class="lead"><b>B &middot; Sway bracing.</b> A strut and tie-rod crosses between the legs, which is most of what makes a hometown tower look like one.</p>'
	+ '<div class="row">' + tile(C.s512.riveted, 512, NAMES.riveted + ' (for reference)') + tile(C.extra.scaled, 512, 'A &middot; Option 4, body ' + EXTRA_SCALE + ' (645)', SAFE.scaled.line) + '</div>'
	+ '<div class="row" style="margin-top:22px">' + tile(C.extra.braced, 512, 'B &middot; Option 4 plus sway bracing', SAFE.riveted.line) + tile(C.extra.both, 512, 'A + B &middot; both together', SAFE.scaled.line) + '</div>'
	+ '<div class="row" style="margin-top:22px">' + masked(C.extra.scaled, 256, 'A cropped') + masked(C.extra.braced, 256, 'B cropped') + masked(C.extra.both, 256, 'A + B cropped') + '</div>'
	+ '</main></body></html>\n';

fs.writeFileSync(PAGE, html);
console.log('wrote ' + PAGE);

// ---- rasters -------------------------------------------------------------------------------------
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
	// A worktree has no node_modules of its own; fall back to the main checkout's (read only).
	var tries = [path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'),
		'/home/haws/webdev/hawsedc.com/engcalcs/dev/browser-pass/node_modules/playwright-core'];
	for (var i = 0; i < tries.length; i++) { if (fs.existsSync(tries[i])) { return require(tries[i]); } }
	throw new Error('playwright-core not found; npm install in dev/browser-pass');
}

(async function main() {
	var pw = playwright();
	var browser = await pw.chromium.launch({ executablePath: findChromium() || undefined });
	async function shot(svg, px, dpr, file) {
		var page = await browser.newPage({ viewport: { width: px, height: px }, deviceScaleFactor: dpr });
		await page.setContent('<!doctype html><style>html,body{margin:0}#t{width:' + px + 'px;height:' + px + 'px;line-height:0}</style><div id="t">' + sized(svg, px) + '</div>');
		await (await page.$('#t')).screenshot({ path: path.join(OUT, file) });
		await page.close();
	}
	var opts = ['current', 'thin', 'real'];
	var num = { current: 1, thin: 2, real: 3, riveted: 4 };
	for (var i = 0; i < opts.length; i++) {
		var o = opts[i];
		await shot(C.about[o], 48, 1, 'about-48-' + num[o] + '-' + o + '.png');
		await shot(C.about[o], 48, 2, 'about-48@2x-' + num[o] + '-' + o + '.png');
		await shot(C.s192[o], 192, 1, 'icon-192-' + num[o] + '-' + o + '.png');
	}
	var o512 = ['current', 'thin', 'real', 'riveted'];
	for (var j = 0; j < o512.length; j++) {
		await shot(C.s512[o512[j]], 512, 1, 'icon-512-' + num[o512[j]] + '-' + o512[j] + '.png');
	}
	await shot(C.extra.scaled, 512, 1, 'icon-512-A-body-' + EXTRA_SCALE + '.png');
	await shot(C.extra.braced, 512, 1, 'icon-512-B-braced.png');
	await shot(C.extra.both, 512, 1, 'icon-512-AB-body-' + EXTRA_SCALE + '-braced.png');
	var pg = await browser.newPage({ viewport: { width: 1240, height: 900 }, deviceScaleFactor: 1 });
	await pg.goto('file://' + PAGE);
	await pg.screenshot({ path: path.join(OUT, 'page.png'), fullPage: true });
	await pg.close();
	await browser.close();
	console.log('wrote ' + OUT + '/*.png');
})().catch(function (e) { console.error(e); process.exit(1); });
