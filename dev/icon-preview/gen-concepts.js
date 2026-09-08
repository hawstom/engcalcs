#!/usr/bin/env node
/*
 * Water-tower brand-mark candidates, 2026-09-08. Riffs on Tom's three sketches in
 * tgh-icon-concepts.png: a skinny house on stilts (given a belly), a domed tank on truncated,
 * less-splayed legs (with and without a centre riser), and an L for Libre on each.
 *
 * Writes one standalone .svg per candidate (24x24 viewBox, stroke currentColor, the same open tag
 * lib/Icons.lib.php uses) and concepts-2026-09-08.html, which shows every candidate at 16, 24, 32
 * and 64 px on light and dark, beside the current `water` icon, plus a nearest-neighbour blow-up
 * of the 16 px raster so the favicon question can be answered without squinting.
 *
 * Cubics, never `A` arcs, so dev/scripts/icon_ascii_preview.php can read a candidate if one is
 * promoted into lib/Icons.lib.php. Kappa = 0.5523.
 *
 *   node dev/icon-preview/gen-concepts.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var here = __dirname;

// The open tag lib/Icons.lib.php uses, minus the class, plus xmlns so the file stands alone.
var OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
	+ ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';

// ---- Shared parts --------------------------------------------------------------------------
// Skinny house: walls at x = 7.5 and 16.5 (9 units centre to centre), roof peak (12, 2.5), eaves at
// y = 6 with NO overhang (Tom, 2026-09-04), straight wall to y = 13, belly below. Legs continue
// the walls to the ground at a 4 degree splay; a riser between them leaves 2.5 units of daylight
// at the belly, which is the clear-gap floor Icons.lib.php measures at 17 px.
var ROOF = 'M7.5 6L12 2.5L16.5 6';
var WALLS = 'M7.5 6V13M16.5 6V13';
var LEGS_H = 'M7.5 13L6.9 22M16.5 13L17.1 22';               // 4 degrees off plumb
var RISER_H = '<path stroke-width="2.6" stroke-linecap="butt" d="M12 17.3V22.6"/>';
var BELLY = {
	// hemispherical underside, r = 4.5 about (12, 13): the belly of a wooden tank
	round:  'M7.5 13C7.5 15.49 9.51 17.5 12 17.5C14.49 17.5 16.5 15.49 16.5 13',
	// conical hopper bottom
	cone:   'M7.5 13L12 17.5L16.5 13',
	// shallow dish, ry = 3
	dish:   'M7.5 13C7.5 14.66 9.51 16 12 16C14.49 16 16.5 14.66 16.5 13',
};
function house(belly, opts) {
	opts = opts || {};
	var s = '<path d="' + ROOF + '"/><path d="' + WALLS + '"/><path d="' + BELLY[belly] + '"/>';
	if (opts.legs !== false) { s += '<path d="' + LEGS_H + '"/>'; }
	if (opts.riser) { s += RISER_H; }
	return s;
}
// Barrel: the belly is in the walls themselves, so the house is drawn as one outline.
function barrel(opts) {
	opts = opts || {};
	var s = '<path d="' + ROOF + '"/>'
		+ '<path d="M7.5 6C6.2 9 6.2 13 7.5 16H16.5C17.8 13 17.8 9 16.5 6"/>';
	if (opts.legs !== false) { s += '<path d="M7.5 16L6.9 22M16.5 16L17.1 22"/>'; }
	if (opts.riser) { s += '<path stroke-width="2.6" stroke-linecap="butt" d="M12 16V22.6"/>'; }
	return s;
}

// Domed tank: dome is the upper half of an ellipse about (12, 9), rx 7.5, ry 6 (top at y = 3);
// belly is the lower half with ry 4 (bottom at y = 13). Catwalk chord at y = 9 overhangs the bulb
// by 1.1 a side (Tom, 2026-09-05: it wraps around the OUTSIDE). Control offsets: 4.14 x, 3.31 y
// (dome), 2.21 y (belly).
var DOME  = 'M4.5 9C4.5 5.69 7.86 3 12 3C16.14 3 19.5 5.69 19.5 9';
var BELLY_D = 'M4.5 9C4.5 11.21 7.86 13 12 13C16.14 13 19.5 11.21 19.5 9';
var CATWALK = 'M3.4 9H20.6';
var RISER_D = '<path stroke-width="3.2" stroke-linecap="butt" d="M12 13V21.6"/>';
function dome(opts) {
	opts = opts || {};
	var s = '<path d="' + DOME + '"/>';
	if (opts.catwalk !== false) { s += '<path d="' + CATWALK + '"/>'; }
	s += '<path d="' + BELLY_D + '"/>';
	if (opts.legs === 'rim') {
		// legs hang from the catwalk ends: 4 degrees, stopping short of the riser's foot
		s += '<path d="M4.2 10.2L5 20"/><path d="M19.8 10.2L19 20"/>';
	} else if (opts.legs === 'bulb') {
		// legs from the bulb underside, truncated and nearly plumb (3 degrees)
		s += '<path d="M7.5 12.2L7.1 20"/><path d="M16.5 12.2L16.9 20"/>';
	}
	if (opts.riser) { s += RISER_D; }
	if (opts.pedestal) {
		s += '<path stroke-width="3.2" stroke-linecap="butt" d="M12 13V20.5"/>'
			+ '<path d="M8 21.5H16"/>';
	}
	return s;
}

// ---- Candidates ----------------------------------------------------------------------------
var C = [];
function add(id, title, fixes, body) { C.push({ id: id, title: title, fixes: fixes, body: body }); }
// A cull keeps its row (in a folded section at the foot of the page) and its reason, but gets no .svg.
function cull(id, why) { C.filter(function (c) { return c.id === id; })[0].cull = why; }

// (a) Skinny house on stilts, with a belly
add('house-round', 'Skinny house, round belly',
	'Sketch 2 with the belly he asked for: a hemispherical underside between plumb-ish stilts. Legs continue the walls, so nothing reads as a tripod.',
	house('round'));
add('house-round-riser', 'Skinny house, round belly, riser',
	'The same with a centre riser 2.6 wide against 2-wide legs; 2.5 units of daylight either side at the belly.',
	house('round', { riser: true }));
add('house-cone', 'Skinny house, cone belly',
	'Hopper bottom: three straight strokes instead of a curve, so the belly survives 16 px where a curve might smear.',
	house('cone'));
add('house-cone-riser', 'Skinny house, cone belly, riser',
	'Cone belly feeding a riser: the pipe visibly comes out of the point, which is what a pipe under a hopper does.',
	house('cone', { riser: true }));
add('house-dish', 'Skinny house, dish belly',
	'A shallower belly (ry 3) for a taller-looking house; less bulge, more stilt.',
	house('dish'));
add('house-barrel', 'Skinny house, barrel walls',
	'The belly is in the walls: a barrel-sided tank under a peak, flat floor, stilts under the corners. One outline, fewest strokes.',
	barrel());
add('house-barrel-riser', 'Skinny house, barrel walls, riser',
	'Barrel with a centre riser.',
	barrel({ riser: true }));

// (b) Domed tank, truncated and less-splayed legs
add('dome-rim-riser', 'Domed tank, rim legs, riser',
	'Sketch 1 redrawn: legs hang from the catwalk ENDS at 4 degrees and stop at y = 20; the riser is 3.2 wide and goes 1.6 lower. 5.4 units between leg and riser, so the pipe cannot be read as a leg.',
	dome({ legs: 'rim', riser: true }));
add('dome-rim', 'Domed tank, rim legs, no riser',
	'The same on two legs alone: two thin lines under a bulb, no third stroke to mistake.',
	dome({ legs: 'rim' }));
add('dome-bulb-riser', 'Domed tank, bulb legs, riser',
	'The current icon\'s leg attachment (from the underside) but truncated to y = 20 and 3 degrees off plumb instead of 10.',
	dome({ legs: 'bulb', riser: true }));
add('dome-bulb', 'Domed tank, bulb legs, no riser',
	'Truncated near-plumb legs from the underside, no riser.',
	dome({ legs: 'bulb' }));
add('dome-pedestal', 'Domed tank on a footed pedestal',
	'Monolithic, but with a foot: the bar at the ground is what keeps it from being the shape he named.',
	dome({ pedestal: true }));

// (c) An L for Libre
// L badge inside the skinny house: stroke 1.7 between walls 9 apart. Clear gap wall-to-L is 1.0
// unit, which is below the 2.5 floor, so this is expected to fail at 16 px and hold at 32.
var L_HOUSE = '<path stroke-width="1.7" d="M10.4 7.8V11.4H13.8"/>';
add('house-round-L', 'Skinny house, round belly, L badge',
	'An L painted on the house wall. Expected to hold at 24 and 32 px and close up at 16.',
	house('round') + L_HOUSE);
add('house-cone-riser-L', 'Skinny house, cone belly, riser, L badge',
	'L on the cone-and-riser house.',
	house('cone', { riser: true }) + L_HOUSE);
add('house-barrel-L', 'Skinny house, barrel walls, L badge',
	'L on the barrel house; the barrel is the widest house interior so the L has the most room.',
	barrel() + '<path stroke-width="1.7" d="M10.2 8V12.2H13.8"/>');
// L badge inside the dome bulb: the catwalk would cut through it, so the badge version drops
// the catwalk and keeps the bulb as the badge field.
var L_DOME = '<path stroke-width="1.9" d="M9.8 6V10.6H14.4"/>';
add('dome-rim-riser-L', 'Domed tank, rim legs, riser, L badge',
	'L in the bulb, catwalk dropped because the chord would strike the L through.',
	dome({ legs: 'rim', riser: true, catwalk: false }) + L_DOME);
add('dome-rim-L', 'Domed tank, rim legs, L badge',
	'L in the bulb on two legs.',
	dome({ legs: 'rim', catwalk: false }) + L_DOME);
// The L as the STAND: the riser is the stem of the L and its foot runs to the right. Reads at 16
// because it adds no interior detail; the L is the silhouette.
add('house-round-Lstand', 'Skinny house on an L stand',
	'The L is the structure, not a badge: the riser is its stem and a foot runs right along the ground. Nothing interior, so it holds at 16 px.',
	'<path d="' + ROOF + '"/><path d="' + WALLS + '"/><path d="' + BELLY.round + '"/>'
	+ '<path stroke-width="2.6" stroke-linecap="butt" d="M8.9 15.5V22.3"/>'
	+ '<path stroke-width="2.6" stroke-linecap="butt" d="M7.6 21H17"/>');
add('dome-Lstand', 'Domed tank on an L stand',
	'The same idea under the dome: bulb, catwalk, and an L-shaped stand.',
	dome({ catwalk: true })
	+ '<path stroke-width="3.2" stroke-linecap="butt" d="M8.6 12V22"/>'
	+ '<path stroke-width="3.2" stroke-linecap="butt" d="M7 20.4H18"/>');

// ---- Round 2, after the 16 px render of the above -----------------------------------------
// At 16 px every house above collapsed into an "A": the belly sat INSIDE the wall line, so the
// walls and legs read as one arch and the belly never showed. A belly has to be wider than the
// house. Walls at x = 8 and 16 (8 apart: very skinny), belly out to 5.5 and 18.5, stilts INSET
// under the belly at 9.5 and 14.5 (5 units of clear between them), plumb.
var POT_ROOF = 'M8 6.5L12 3L16 6.5';
var POT_WALLS = 'M8 6.5V11M16 6.5V11';
var POT_BELLY = 'M8 11C6.5 11 5.5 12.6 5.5 14.3C5.5 16.4 8.2 17.8 12 17.8C15.8 17.8 18.5 16.4 18.5 14.3C18.5 12.6 17.5 11 16 11';
var POT_LEGS = 'M9.5 17.8V22M14.5 17.8V22';
function pot(opts) {
	opts = opts || {};
	var s = '<path d="' + POT_ROOF + '"/><path d="' + POT_WALLS + '"/><path d="' + POT_BELLY + '"/>';
	if (opts.legs !== false) { s += '<path d="' + POT_LEGS + '"/>'; }
	if (opts.riser) { s += '<path stroke-width="2.6" stroke-linecap="butt" d="M12 17.8V22.6"/>'; }
	return s;
}
add('house-pot', 'Skinny house, pot belly, inset stilts',
	'Round 2. The belly is WIDER than the house and the stilts tuck under it, so at 16 px the silhouette is house / bulge / legs instead of one arch.',
	pot());
add('house-pot-riser', 'Skinny house, pot belly, riser only',
	'Pot belly on a single pipe. The belly is what keeps it from being the monolithic shape he named; no legs to compete with the pipe.',
	pot({ legs: false, riser: true }));
// The dome with rim legs read as a TABLE at 16 px: legs and riser ended within 1.6 units of each
// other. Legs now stop at y = 17.5 and the riser runs to 22, a 4.5-unit difference (3 px at 16).
add('dome-rim-riser-short', 'Domed tank, short rim legs, long riser',
	'Round 2. Rim legs cut off at y = 17.5, riser to 22: the pipe is the thing that reaches the ground, the legs visibly do not, so they cannot be read as the same kind of stroke.',
	dome({ catwalk: true }) + '<path d="M4.2 10.2L4.8 17.5"/><path d="M19.8 10.2L19.2 17.5"/>' + '<path stroke-width="3.2" stroke-linecap="butt" d="M12 13V22.4"/>');
// Deep belly under the dome, inset plumb legs, no riser: the dome-tank cousin of house-pot.
var BELLY_DEEP = 'M4.5 9C4.5 12.04 7.86 14.5 12 14.5C16.14 14.5 19.5 12.04 19.5 9';
add('dome-pot', 'Domed tank, deep belly, inset stilts',
	'Round 2. Belly ry 5.5 (bottom at 14.5) and two plumb stilts inset at 8.5 and 15.5 from the belly to y = 21. A bulb on two short legs; no riser.',
	'<path d="' + DOME + '"/><path d="' + CATWALK + '"/><path d="' + BELLY_DEEP + '"/>'
	+ '<path d="M8.5 13.5V21M15.5 13.5V21"/>');
// A SOLID bulb with the L knocked out through a mask. Everything above is a stroke; at 16 px a
// stroked outline with an L inside has no room, but a filled shape does, because the L is
// carved out of ink rather than drawn beside more ink. Still one colour: the mask is black and
// white and only decides where currentColor paints.
function knockout(id, shape, L, lw) {
	return '<mask id="' + id + '"><rect width="24" height="24" fill="#fff"/><path d="' + L + '" stroke="#000" stroke-width="' + lw + '" stroke-linecap="butt" stroke-linejoin="miter"/></mask>'
		+ '<path d="' + shape + '" fill="currentColor" mask="url(#' + id + ')"/>';
}
var BULB_CLOSED = DOME + 'C19.5 11.21 16.14 13 12 13C7.86 13 4.5 11.21 4.5 9Z';
add('dome-solid-L', 'Solid domed tank, L knocked out, riser and short legs',
	'Round 2. The bulb is filled and the L is carved out of it, which is the only way an L survives 16 px: a stroked L needs gaps on both sides, a knocked-out L needs only itself.',
	knockout('kL1', BULB_CLOSED, 'M9.6 5V11H14.8', 2.2)
	+ '<path d="' + CATWALK + '"/>'
	+ '<path d="M4.2 10.2L4.8 17.5"/><path d="M19.8 10.2L19.2 17.5"/>'
	+ '<path stroke-width="3.2" stroke-linecap="butt" d="M12 13V22.4"/>');
var POT_CLOSED = 'M8 6.5L12 3L16 6.5V11C17.5 11 18.5 12.6 18.5 14.3C18.5 16.4 15.8 17.8 12 17.8C8.2 17.8 5.5 16.4 5.5 14.3C5.5 12.6 6.5 11 8 11Z';
add('house-pot-solid-L', 'Solid pot-belly house, L knocked out, inset stilts',
	'Round 2. The pot-belly house filled, with the L carved out of the belly where the ink is widest.',
	knockout('kL2', POT_CLOSED, 'M9.9 9.2V15H14.4', 2)
	+ '<path d="' + POT_LEGS + '"/>');

// L in the pot belly, which is the widest interior of any candidate (11 clear units at y = 14.3).
var L_POT = '<path stroke-width="1.8" stroke-linecap="butt" stroke-linejoin="miter" d="M9.9 12.2V15.2H14.2"/>';
add('house-pot-L', 'Skinny house, pot belly, L badge',
	'Round 2. The L sits in the belly, the widest field any candidate has; 2.4 units clear to the belly wall.',
	pot() + L_POT);
add('house-pot-riser-L', 'Skinny house, pot belly, riser only, L badge',
	'Round 2. The same L on the single-pipe version.',
	pot({ legs: false, riser: true }) + L_POT);

// ---- Culled after the 16 px render (render/blowup-16.png) ---------------------------------
cull('house-dish', 'Reads as the letter A at 16 px; the shallow belly never shows.');
cull('house-cone', 'Reads as the letter A at 16 px; without a riser the cone is one more chevron.');
cull('house-round-riser', 'Reads as a rocket at 16 px: three parallel strokes under a pointed body.');
cull('house-cone-riser-L', 'The L and the cone merge into one smudge at 16 px.');
cull('dome-pedestal', 'Reads as a martini glass at every size.');
cull('house-round-Lstand', 'Reads as a padlock at 16 and 32 px; the L foot becomes a shackle.');
cull('dome-Lstand', 'Reads as a bell on a bracket; the L is a foot, not a letter.');
cull('dome-solid-L', 'A filled bulb loses the catwalk and the L is a notch at 16 px and barely a letter at 32.');
cull('house-pot-solid-L', 'A filled belly reads as a bell with a hole at 16 px.');

// ---- The current icons, for the side-by-side ----------------------------------------------
var iconsPhp = fs.readFileSync(path.join(here, '..', '..', 'lib', 'Icons.lib.php'), 'utf8');
function phpIcon(name) {
	// Concatenated single-quoted PHP string; join the pieces.
	var re = new RegExp("'" + name + "'\\s*=>\\s*((?:'(?:[^'\\\\]|\\\\.)*'\\s*\\.?\\s*)+),");
	var m = re.exec(iconsPhp);
	if (!m) { throw new Error('icon not found: ' + name); }
	var out = '';
	m[1].replace(/'((?:[^'\\]|\\.)*)'/g, function (_, s) { out += s.replace(/\\'/g, "'"); return ''; });
	return out;
}
var current = phpIcon('water');
var symbols = ['junction', 'reservoir', 'tank', 'pipe', 'pump', 'valve'].map(function (n) {
	return { id: n, body: phpIcon(n) };
});

// ---- Write the SVG files -------------------------------------------------------------------
fs.readdirSync(here).forEach(function (f) { if (/\.svg$/.test(f)) { fs.unlinkSync(path.join(here, f)); } });
C.forEach(function (c) {
	if (c.cull) { return; }
	fs.writeFileSync(path.join(here, c.id + '.svg'), OPEN + c.body + '</svg>\n');
});

// ---- The preview page ----------------------------------------------------------------------
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function svgAt(body, px, extra) {
	return '<svg viewBox="0 0 24 24" width="' + px + '" height="' + px + '" fill="none" stroke="currentColor"'
		+ ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + body + '</svg>';
}
var SIZES = [16, 24, 32, 64];
function row(c, isCurrent) {
	var h = '<tr' + (isCurrent ? ' class="cur"' : '') + '><th><code>' + c.id + '</code><br><span class="t">' + esc(c.title) + '</span>'
		+ (c.fixes ? '<br><span class="f">' + esc(c.fixes) + '</span>' : '') + '</th>';
	['light', 'dark'].forEach(function (bg) {
		h += '<td class="' + bg + '">';
		SIZES.forEach(function (px) { h += '<span class="cell">' + svgAt(c.body, px) + '</span>'; });
		h += '</td>';
	});
	h += '<td class="light mag" data-body="' + esc(c.body).replace(/"/g, '&quot;') + '"><canvas width="16" height="16"></canvas></td>';
	h += '</tr>';
	return h;
}
var html = '<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8">'
	+ '<title>Water tower concepts, 2026-09-08</title>\n<style>\n'
	+ 'body{font:14px/1.4 system-ui,sans-serif;margin:16px;color:#222;background:#fafafa}\n'
	+ 'h1{font-size:18px}h2{font-size:15px;margin-top:28px}\n'
	+ 'table{border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px 8px;vertical-align:middle;text-align:left}\n'
	+ 'th{width:300px;font-weight:normal}th code{font-weight:bold}\n'
	+ '.t{font-weight:600}.f{color:#555;font-size:12px}\n'
	+ 'td.light{background:#fff;color:#1a1a1a}td.dark{background:#1e1e1e;color:#f2f2f2}\n'
	+ '.cell{display:inline-block;vertical-align:bottom;margin-right:14px}\n'
	+ 'td.mag canvas{width:128px;height:128px;image-rendering:pixelated;image-rendering:crisp-edges;background:#fff}\n'
	+ 'tr.cur th{background:#fff4d6}\n'
	+ '.sym svg{color:#1b3fd6}.sym .cell{margin-right:22px}\n'
	+ 'p.note{max-width:900px}\n'
	+ '</style></head><body>\n'
	+ '<h1>Water tower brand-mark candidates, 2026-09-08</h1>\n'
	+ '<p class="note">Riffs on <code>tgh-icon-concepts.png</code>. Each row: 16 / 24 / 32 / 64 px on light and on dark, '
	+ 'and a nearest-neighbour blow-up of the 16 px raster (the favicon question, answered by pixels rather than by hope). '
	+ 'The highlighted first row is the icon that ships today (<code>water</code> in <code>lib/Icons.lib.php</code>). '
	+ 'Every candidate is a single <code>currentColor</code> stroke in the suite\'s own 24-unit frame, so a winner is a copy-paste into that file.</p>\n'
	+ '<table><thead><tr><th>Candidate</th><th>Light: 16 24 32 64</th><th>Dark: 16 24 32 64</th><th>16 px, x8</th></tr></thead><tbody>\n'
	+ row({ id: 'water (current)', title: 'Elliptical bulb, catwalk, riser, splayed legs to the ground', fixes: '', body: current }, true)
	+ C.filter(function (c) { return !c.cull; }).map(function (c) { return row(c); }).join('\n')
	+ '</tbody></table>\n'
	+ '<details><summary><b>Culled at 16 px</b> (' + C.filter(function (c) { return c.cull; }).length + '): kept here with the reason, no .svg written</summary>'
	+ '<table><tbody>' + C.filter(function (c) { return c.cull; }).map(function (c) {
		return row({ id: c.id, title: c.title, fixes: 'CULLED: ' + c.cull, body: c.body });
	}).join('\n') + '</tbody></table></details>\n'
	+ '<h2>Map symbols (his SYMBOL row)</h2>\n'
	+ '<p class="note">The map already draws its symbols from the same table as the menu, so these ARE the current map symbols, '
	+ 'shown here in blue with a light fill the way the sketch has them. They match the sketch\'s six shapes already: circle, triangle, '
	+ 'rectangle, line, volute, bowtie. The only difference is the pipe: the menu glyph carries end bars, the map draws a bare line, which is what a pipe on a map is.</p>\n'
	+ '<div class="sym">' + symbols.map(function (s) {
		return '<span class="cell" title="' + s.id + '">' + svgAt(s.body, 48, ' fill="rgba(27,63,214,.10)"') + '</span>';
	}).join('') + '</div>\n'
	+ '<script>\n'
	+ 'document.querySelectorAll("td.mag").forEach(function(td){var body=td.getAttribute("data-body");'
	+ 'var svg=\'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\'+body+"</svg>";'
	+ 'var img=new Image();img.onload=function(){var c=td.querySelector("canvas").getContext("2d");c.drawImage(img,0,0,16,16);};'
	+ 'img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);});\n'
	+ '</script>\n</body></html>\n';
fs.writeFileSync(path.join(here, 'concepts-2026-09-08.html'), html);

// A compact 16 px contact sheet, for the headless render: every candidate at 16 px on white and
// on black, no blow-up, so the PNG shows exactly what a tab strip would.
var sheet = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:8px;background:#888;font:10px sans-serif}'
	+ '.r{display:flex;align-items:center;margin:2px 0}.l{width:150px;color:#000}'
	+ '.w{background:#fff;color:#111;padding:2px;margin-right:4px;line-height:0}.b{background:#1e1e1e;color:#eee;padding:2px;margin-right:4px;line-height:0}'
	+ '</style></head><body>'
	+ [{ id: 'water (current)', body: current }].concat(C).map(function (c) {
		return '<div class="r"><span class="l">' + c.id + '</span>'
			+ '<span class="w">' + svgAt(c.body, 16) + '</span><span class="b">' + svgAt(c.body, 16) + '</span>'
			+ '<span class="w">' + svgAt(c.body, 32) + '</span><span class="b">' + svgAt(c.body, 32) + '</span></div>';
	}).join('') + '</body></html>';
fs.writeFileSync(path.join(here, 'render', 'sheet-16.html'), sheet);

// Nearest-neighbour blow-up sheet of the 16 px raster, 4 candidates per row, for the headless
// render. This is the picture the cull was judged on.
var blow = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:8px;background:#ddd;font:11px sans-serif}'
	+ '.g{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.c{background:#fff;padding:4px;text-align:center}'
	+ 'canvas{width:96px;height:96px;image-rendering:pixelated;background:#fff;margin:2px}.c .d{background:#1e1e1e}'
	+ '</style></head><body><div class="g">'
	+ [{ id: 'water (current)', body: current }].concat(C).map(function (c) {
		return '<div class="c" data-body="' + esc(c.body).replace(/"/g, '&quot;') + '"><canvas width="16" height="16"></canvas>'
			+ '<canvas class="d" width="16" height="16"></canvas><br>' + c.id + '</div>';
	}).join('') + '</div><script>'
	+ 'document.querySelectorAll(".c").forEach(function(d){var body=d.getAttribute("data-body");'
	+ '[["#111","#fff"],["#eee","#1e1e1e"]].forEach(function(p,i){'
	+ 'var svg=\'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="\'+p[0]+\'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\'+body+"</svg>";'
	+ 'var img=new Image();img.onload=function(){var c=d.querySelectorAll("canvas")[i].getContext("2d");c.fillStyle=p[1];c.fillRect(0,0,16,16);c.drawImage(img,0,0,16,16);};'
	+ 'img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);});});'
	+ '</script></body></html>';
fs.writeFileSync(path.join(here, 'render', 'blowup-16.html'), blow);
console.log(C.filter(function (c) { return !c.cull; }).length + ' candidates written, ' + C.filter(function (c) { return c.cull; }).length + ' culled; concepts-2026-09-08.html and render/sheet-16.html regenerated');
