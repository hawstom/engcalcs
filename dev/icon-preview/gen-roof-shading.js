#!/usr/bin/env node
/*
 * Tom's roof-shading ruling on the larger-tower comparison (2026-09-27):
 *   Option 3, About + 192: "I agree. My only question is about the roof shading. Is it right to
 *   be plain white?"
 *   Option 4 + both extras (bracing, rivets), 512: same question, "Nice work."
 *   Then, new: "Also, it shouldn't be bright under the catwalk. That should be in shadow."
 *
 * THE ANSWER, WORKED FROM THE DRAWING'S OWN LIGHT: the wall's gradient (wtfav-wall / p-wall, same
 * stops reused here) puts its highlight left-of-centre (offset 0.36) and its darkest tone at the
 * RIGHT edge (offset 1, #666d74) -- the light is upper-left, and the wall already reads as a lit
 * limb and a shaded limb. A cone roof under that same light must show the same split: a lit face
 * and a shaded face. The BEFORE roof (a near-white radial highlight, #ffffff fading to only
 * #c9d0d6 at its darkest) never gets dark enough to read as a shaded face at any size -- so no,
 * plain white was not right. The AFTER roof reuses the wall's own gradient, unchanged, on the
 * roof's own bounding box (same x-span as the wall, 7.95-16.05), so the same colours fall on the
 * same side, continuous with the wall below.
 *
 * Separately: the bowl's own gradient (p-bowl) is brightest at its centre (12,14.15), which is
 * directly under the catwalk deck -- the one place a real deck would cast a shadow, not a
 * highlight. AFTER adds a dark-to-transparent wash over the top of the bowl, clipped to the bowl's
 * own outline, so the area right under the deck goes into shadow instead of being the brightest
 * point on the tank.
 *
 * NOTHING ELSE CHANGES: same geometry, same stroke weights, same catwalk deck, same colours
 * everywhere but the roof fill and the new bowl-top wash.
 *
 * Writes:
 *   dev/icon-preview/roof-shading-2026-09-28.html   -- BEFORE/AFTER, at real size and enlarged
 *   dev/icon-preview/render/roof-shading/*.png       -- every raster this script produced
 *   icons/favicon.svg     -- the About mark (option 3, About size), AFTER shading
 *   icons/icon-192.png    -- option 3, 192 size, AFTER shading
 *   icons/icon-512.png    -- option 4 + bracing (Tom's "both extras"), 512, AFTER shading
 *   icons/icon.svg        -- same drawing as icon-512.png, as vector (manifest's "any" icon)
 *
 *   flock /tmp/engcalcs-browser.lock node dev/icon-preview/gen-roof-shading.js
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */
'use strict';
var fs = require('fs');
var path = require('path');

var here = __dirname;
var ROOT = path.join(here, '..', '..');
var OUT = path.join(here, 'render', 'roof-shading');
var PAGE = path.join(here, 'roof-shading-2026-09-28.html');
fs.mkdirSync(OUT, { recursive: true });

var ICONS = path.join(ROOT, 'icons');
var FAVICON_OUT = path.join(ICONS, 'favicon.svg');
var ICON192_OUT = path.join(ICONS, 'icon-192.png');
var ICON512_OUT = path.join(ICONS, 'icon-512.png');
var ICONSVG_OUT = path.join(ICONS, 'icon.svg');

// ---- the favicon's own coordinates (identical to gen-larger-tower.js) --------------------------
var G = {
	apex: [12, 2.2], shL: 7.95, shR: 16.05, shY: 3.7, spring: 14.15, pole: 18.15,
	walkY: 13.55, walkL: 7.1, walkR: 16.9, edge: 24, cx: 12
};
var R = (G.shR - G.shL) / 2;
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
function az(th, r) { return G.cx + r * Math.sin(th); }

// ---- defs / fills, with a BEFORE/AFTER variant on the roof and a new bowl-top shadow ------------
function defs(p, variant) {
	var ramp = '<stop offset="0" stop-color="#6f767d"/><stop offset="0.18" stop-color="#9aa2a9"/><stop offset="0.36" stop-color="#eef1f3"/><stop offset="0.54" stop-color="#c2c8cd"/><stop offset="0.78" stop-color="#8b9299"/><stop offset="1" stop-color="#666d74"/>';
	var legRamp = '<stop offset="0" stop-color="#555c63"/><stop offset="0.25" stop-color="#7d858c"/><stop offset="0.4" stop-color="#b9c0c6"/><stop offset="0.6" stop-color="#8f979e"/><stop offset="1" stop-color="#4a5157"/>';
	var d = '<defs>'
		+ '<linearGradient id="' + p + '-wall" x1="0" y1="0" x2="1" y2="0">' + ramp + '</linearGradient>'
		+ '<radialGradient id="' + p + '-bowl" gradientUnits="userSpaceOnUse" cx="12" cy="14.15" r="5.4"><stop offset="0" stop-color="#9aa2a9"/><stop offset="0.45" stop-color="#767d84"/><stop offset="0.8" stop-color="#5b6167"/><stop offset="1" stop-color="#454a50"/></radialGradient>'
		+ '<linearGradient id="' + p + '-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ecbe8"/><stop offset="1" stop-color="#dbe9f2"/></linearGradient>'
		+ '<filter id="' + p + '-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>'
		+ '<linearGradient id="' + p + '-leg" x1="0" y1="0" x2="1" y2="0">' + legRamp + '</linearGradient>'
		+ '<linearGradient id="' + p + '-fascia" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4e555b"/><stop offset="0.2" stop-color="#7a8188"/><stop offset="0.37" stop-color="#c3c9ce"/><stop offset="0.55" stop-color="#99a0a6"/><stop offset="0.8" stop-color="#6c737a"/><stop offset="1" stop-color="#4a5056"/></linearGradient>'
		+ '<linearGradient id="' + p + '-strut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cfd4"/><stop offset="0.45" stop-color="#8b9299"/><stop offset="1" stop-color="#454b51"/></linearGradient>'
		+ '<clipPath id="' + p + '-wallclip"><rect x="' + G.shL + '" y="' + G.shY + '" width="' + (G.shR - G.shL) + '" height="' + (G.spring - G.shY) + '"/></clipPath>'
		+ '<clipPath id="' + p + '-bowlclip"><path d="' + bowlD() + 'Z"/></clipPath>'
		+ '<clipPath id="' + p + '-roofclip"><path d="M7.95 3.7L12 2.2L16.05 3.7Z"/></clipPath>';
	if (variant === 'before') {
		// BEFORE: the plain-white radial roof this comparison answers Tom's question about.
		d += '<radialGradient id="' + p + '-roof" gradientUnits="userSpaceOnUse" cx="10.9" cy="2.9" r="5.2"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#f4f6f8"/><stop offset="0.85" stop-color="#dfe4e8"/><stop offset="1" stop-color="#c9d0d6"/></radialGradient>';
	} else {
		// AFTER: the shadow that falls on the tank directly under the catwalk deck.
		d += '<linearGradient id="' + p + '-bowlshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(15,20,26,0.55)"/><stop offset="1" stop-color="rgba(15,20,26,0)"/></linearGradient>';
	}
	return d + '</defs>';
}
function sky(p) {
	return '<rect x="0" y="0" width="24" height="24" fill="url(#' + p + '-sky)"/>'
		+ '<g filter="url(#' + p + '-blur)" fill="#ffffff" opacity="0.72"><ellipse cx="6" cy="5.5" rx="6" ry="1.7"/><ellipse cx="18.5" cy="9" rx="5.5" ry="1.5"/><ellipse cx="11" cy="19.5" rx="8" ry="1.9"/></g>';
}
function fills(p, variant) {
	// ROOF: BEFORE keeps the old near-white radial fill; AFTER reuses the WALL's own gradient,
	// unchanged, over the roof's own bounding box (the same 7.95-16.05 x-span as the wall), so the
	// same light-from-upper-left colours land on the same side, continuous with the wall below.
	var roofFill = variant === 'before' ? (p + '-roof') : (p + '-wall');
	var out = '<path d="M7.95 3.7L12 2.2L16.05 3.7V14.15C16.05 16.36 14.24 18.15 12 18.15C9.76 18.15 7.95 16.36 7.95 14.15Z" fill="url(#' + p + '-wall)"/>'
		+ '<path d="M7.95 3.7L12 2.2L16.05 3.7Z" fill="url(#' + roofFill + ')"/>'
		+ '<path d="' + bowlD() + 'Z" fill="url(#' + p + '-bowl)"/>';
	if (variant === 'after') {
		// The catwalk deck sits right at the springline; its own shadow falls on the bowl top just
		// below it, which the bowl's gradient (brightest at its own centre) otherwise lights up.
		out += '<rect x="' + G.shL + '" y="' + G.spring + '" width="' + (G.shR - G.shL) + '" height="1.7" fill="url(#' + p + '-bowlshade)" clip-path="url(#' + p + '-bowlclip)"/>';
	}
	return out;
}
function outlineOpen(w) {
	return '<g fill="none" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round">';
}

/** Plate seams and rivets (option 4), byte-identical to gen-larger-tower.js's. */
function seams(p, s) {
	var out = '';
	var dark = 'rgba(20,26,32,0.42)', lite = 'rgba(255,255,255,0.45)';
	var sw = 0.055;
	var rv = 0.055;
	function rivet(x, y, k) {
		return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rv * k) + '" ry="' + f(rv) + '" fill="rgba(20,26,32,0.38)"/>'
			+ '<ellipse cx="' + f(x) + '" cy="' + f(y - rv * 0.45) + '" rx="' + f(rv * 0.55 * k) + '" ry="' + f(rv * 0.45) + '" fill="rgba(255,255,255,0.55)"/>';
	}
	var courses = 5, h = (G.spring - G.shY) / courses;
	var wall = '';
	for (var i = 1; i < courses; i++) {
		var y = G.shY + i * h;
		wall += '<path d="M' + G.shL + ' ' + f(y) + 'H' + G.shR + '" stroke="' + dark + '" stroke-width="' + sw + '"/>'
			+ '<path d="M' + G.shL + ' ' + f(y - sw) + 'H' + G.shR + '" stroke="' + lite + '" stroke-width="' + (sw * 0.6) + '"/>';
		for (var a = -84; a <= 84; a += 7) {
			var th = a * Math.PI / 180;
			wall += rivet(az(th, R), y + 0.14, Math.cos(th));
		}
	}
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

	var roof = '';
	for (var a3 = -60; a3 <= 60; a3 += 30) {
		var x3 = az(a3 * Math.PI / 180, R);
		roof += '<path d="M12 2.2L' + f(x3) + ' 3.7" stroke="rgba(20,26,32,0.22)" stroke-width="' + sw + '"/>';
	}
	out += '<g clip-path="url(#' + p + '-roofclip)" fill="none">' + roof + '</g>';

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

/** Catwalk as a robust deck plus a handrail above it, byte-identical to gen-larger-tower.js's. */
function catwalk(p, s) {
	var w = s.stroke;
	var L = 6.75, Rr = 17.25;
	var top = G.walkY - s.deckH * 0.45, bot = top + s.deckH;
	var railY = top - s.railGap;
	var rw = Math.max(w * 0.9, 0.16);
	var out = '';
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
	var under = Math.max(s.deckH * 0.28, w);
	out += '<rect x="' + L + '" y="' + f(top) + '" width="' + f(Rr - L) + '" height="' + f(s.deckH - under) + '" fill="url(#' + p + '-fascia)"/>'
		+ '<rect x="' + L + '" y="' + f(bot - under) + '" width="' + f(Rr - L) + '" height="' + f(under) + '" fill="#2c3238"/>'
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
 * split: true for the 512 maskable treatment (body scaled, descenders run to the true edge).
 * variant: 'before' | 'after'.
 */
function build(opt, sizeKey, split, p, extra, variant) {
	extra = extra || {};
	var s = SIZES[sizeKey];
	var w = s.stroke;
	var S = split ? (extra.scale || BODY_SCALE) : 1;
	function body(inner) { return split ? '<g transform="translate(12 12) scale(' + S + ') translate(-12 -12)">' + inner + '</g>' : inner; }
	var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="LibreWaterNet"><title>LibreWaterNet</title>' + defs(p, variant) + sky(p);

	var legOutline = s.leg > 3 * w ? w * 0.7 : 0;
	var cw = catwalk(p, s);
	var legTop = cw.top + 0.1;
	function descenders(riserOnly) {
		var xl = nx(G.shL, S), xr = nx(G.shR, S);
		var lt = ny(legTop, S), rt = ny(G.pole - 0.4, S);
		if (riserOnly) { return column(p, 12, rt, 24.5, s.riser * S, legOutline * S); }
		return column(p, xl, lt, 24.5, s.leg * S, legOutline * S) + column(p, xr, lt, 24.5, s.leg * S, legOutline * S);
	}
	var tank = fills(p, variant)
		+ (opt === 'riveted' ? seams(p, s) : '')
		+ outlineOpen(w)
		+ '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
		+ '<path d="M7.95 3.7V14.15M16.05 3.7V14.15"/>'
		+ '<path d="' + bowlD() + '"/></g>';
	svg += (split ? descenders(true) : column(p, 12, G.pole - 0.4, 24.5, s.riser, legOutline));
	svg += body(tank);
	if (extra.brace) { svg += bracing(p, nx(G.shL, S), nx(G.shR, S), ny(cw.bot, S), w * S); }
	svg += (split ? descenders(false)
		: column(p, G.shL, legTop, 24.5, s.leg, legOutline) + column(p, G.shR, legTop, 24.5, s.leg, legOutline));
	svg += body(cw.svg);
	return svg + '</svg>';
}

// ---- Tom's three picks -------------------------------------------------------------------------
// About + 192: option 3. 512 splash: option 4 with "both extras (the bracing and the rivets)" --
// i.e. riveted (option 4's own seams) plus the sway-bracing extra, WITHOUT the shorter-legs/body-
// scale extra he did not mention.
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
function aboutBox(svg, label) {
	return '<figure><figcaption>' + label + '</figcaption><div class="about"><div class="title">About</div>'
		+ '<h2 class="name">' + sized(svg, 48) + '<span>LibreWaterNet.org</span></h2>'
		+ '<p class="ded">You are loved and cherished forever, you have nothing to fear, and you are not ruining everything.</p>'
		+ '<p class="legal">Licensed under the GNU General Public License v3.0 or later.<br>Copyright &copy; 2009&ndash;2026 Thomas Gail Haws</p></div></figure>';
}

var beforeAbout = build(PICKS.about.opt, PICKS.about.sizeKey, PICKS.about.split, 'ba1', PICKS.about.extra, 'before');
var afterAbout = build(PICKS.about.opt, PICKS.about.sizeKey, PICKS.about.split, 'aa1', PICKS.about.extra, 'after');
var beforeS192 = build(PICKS.s192.opt, PICKS.s192.sizeKey, PICKS.s192.split, 'bi1', PICKS.s192.extra, 'before');
var afterS192 = build(PICKS.s192.opt, PICKS.s192.sizeKey, PICKS.s192.split, 'ai1', PICKS.s192.extra, 'after');
var beforeS512 = build(PICKS.s512.opt, PICKS.s512.sizeKey, PICKS.s512.split, 'bs1', PICKS.s512.extra, 'before');
var afterS512 = build(PICKS.s512.opt, PICKS.s512.sizeKey, PICKS.s512.split, 'as1', PICKS.s512.extra, 'after');

var html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
	+ '<title>Roof Shading, Before and After</title>\n<style>'
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
	+ '<h1>Roof shading, before and after (2026-09-28)</h1>'
	+ '<p class="lead">Tom on the larger-tower comparison: option 3 for the About box and 192, option 4 with the '
	+ 'bracing and the rivets for the 512 splash &mdash; &ldquo;I agree. My only question is about the roof shading. '
	+ 'Is it right to be plain white?&rdquo; and, new, &ldquo;it shouldn&rsquo;t be bright under the catwalk. '
	+ 'That should be in shadow.&rdquo;</p>'
	+ '<p class="lead"><b>The wall&rsquo;s own gradient says the light is upper-left</b> (bright at 0.36 of the way '
	+ 'across, darkest at the right edge). BEFORE, the roof ignored that and used a near-white radial fill that '
	+ 'never gets darker than a pale grey &mdash; a flat cone under a directional light. AFTER, the roof reuses the '
	+ 'wall&rsquo;s own gradient, unchanged, over its own outline, so the same lit-left/shaded-right split continues '
	+ 'up through the roof. Separately, the bowl&rsquo;s own gradient is brightest at its centre, which sits directly '
	+ 'under the catwalk deck; AFTER adds a cast shadow there instead.</p>'

	+ '<h2 class="sec">About box mark, 48 px (option 3)</h2>'
	+ '<div class="row">' + aboutBox(beforeAbout, 'BEFORE') + aboutBox(afterAbout, 'AFTER') + '</div>'
	+ '<div class="row">' + tile(beforeAbout, 144, 'BEFORE at 3&times; (144 px)') + tile(afterAbout, 144, 'AFTER at 3&times; (144 px)') + '</div>'
	+ pairLabel('why-about', 'Changed: the roof fill and a shadow wash on the bowl top. Why: at 48 px the mark is tiny, so the About box is exactly where a flat-white roof and a bright deck underside would be least noticed and most wrong &mdash; this is the size Tom is judging.')

	+ '<h2 class="sec">App icon, 192 px (option 3)</h2>'
	+ '<div class="row">' + tile(beforeS192, 192, 'BEFORE, real size') + tile(afterS192, 192, 'AFTER, real size') + '</div>'
	+ '<div class="row">' + tile(beforeS192, 48, 'BEFORE at 48 px') + tile(afterS192, 48, 'AFTER at 48 px') + '</div>'
	+ pairLabel('why-192', 'Changed: same roof and bowl-top fix as the About mark, scaled to 192&rsquo;s own stroke weights. Why: shown again at 48 to check the shading still reads once the icon is shrunk to home-screen size, not just at its native 192.')

	+ '<h2 class="sec">Splash screen / icon-512 (option 4 + bracing)</h2>'
	+ '<div class="row">' + tile(beforeS512, 512, 'BEFORE, real size') + tile(afterS512, 512, 'AFTER, real size') + '</div>'
	+ '<div class="row">' + tile(beforeS512, 32, 'BEFORE at 32 px') + tile(afterS512, 32, 'AFTER at 32 px') + '</div>'
	+ pairLabel('why-512', 'Changed: the same roof-and-bowl fix, plus the riveted seams keep their own shading unchanged. Why shown at 32: shading built for a 512 px splash can turn to mud once shrunk this far, and the roof/bowl fix has to still read as shading, not noise, at that size.')

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

	await shot(beforeAbout, 48, 'about-48-before.png');
	await shot(afterAbout, 48, 'about-48-after.png');
	await shot(beforeS192, 192, 'icon-192-before.png');
	await shot(afterS192, 192, 'icon-192-after.png');
	await shot(beforeS512, 512, 'icon-512-before.png');
	await shot(afterS512, 512, 'icon-512-after.png');

	var pg = await browser.newPage({ viewport: { width: 1160, height: 900 }, deviceScaleFactor: 1 });
	await pg.goto('file://' + PAGE);
	await pg.screenshot({ path: path.join(OUT, 'page.png'), fullPage: true });
	await pg.close();

	// ---- the shipped files, AFTER shading, Tom's three picks ----
	var favSvg = build(PICKS.about.opt, PICKS.about.sizeKey, PICKS.about.split, 'wtfav', PICKS.about.extra, 'after');
	fs.writeFileSync(FAVICON_OUT, favSvg + '\n');

	var icon192Svg = build(PICKS.s192.opt, PICKS.s192.sizeKey, PICKS.s192.split, 'ic192', PICKS.s192.extra, 'after');
	await shot(icon192Svg, 192, 'shipped-icon-192.png');
	fs.copyFileSync(path.join(OUT, 'shipped-icon-192.png'), ICON192_OUT);

	var icon512Svg = build(PICKS.s512.opt, PICKS.s512.sizeKey, PICKS.s512.split, 'ic512', PICKS.s512.extra, 'after');
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
