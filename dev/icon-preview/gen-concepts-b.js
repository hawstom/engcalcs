#!/usr/bin/env node
/*
 * Water-tower brand-mark candidates, round 2 (2026-09-08b).
 *
 * Round 1 was rejected whole. Tom: *"(1) All house-pot variants are worthless. (2) They didn't even
 * try the wide concept 1 of 3 in my concepts. They did an ellipse, but that's not what I drew.
 * (3) They didn't even try to include the catwalk. Sketch 2 is the closest to a viable improvement
 * on the current, but it needs a catwalk as I drew. (4) I think that WT-WIDE has the best
 * proportions for an icon. But I think that WT-TALL-3 has promise and has been simplified slightly
 * from WT-TALL-1."*
 *
 * So this round draws HIS towers rather than riffing on them. The geometry below is not eyeballed:
 * `tgh-icon-concepts.png` was scanned pixel by pixel in a canvas and every number here is a
 * measured run from that scan, mapped once into the 24-unit frame. The measured pixel values are
 * carried in the comments beside each drawing so the next reader can check the mapping instead of
 * trusting it.
 *
 *   node dev/icon-preview/gen-concepts-b.js
 *
 * Writes one standalone .svg per candidate, concepts-2026-09-08b.html, and the two render pages
 * under render/ that the headless-Chrome sheets are taken from.
 *
 * Cubics, never `A` arcs, so dev/scripts/icon_ascii_preview.php can read a candidate if one is
 * promoted into lib/Icons.lib.php. Kappa = 0.5523.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var here = __dirname;

var OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
	+ ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';

// The icon that ships today, copied from lib/Icons.lib.php for the comparison row.
var CURRENT = '<path d="M4.5 8.5C4.5 6.01 7.86 4 12 4C16.14 4 19.5 6.01 19.5 8.5'
	+ 'C19.5 10.99 16.14 13 12 13C7.86 13 4.5 10.99 4.5 8.5Z"/>'
	+ '<path d="M3.4 9.5H20.6"/>'
	+ '<path stroke-width="3.2" stroke-linecap="butt" d="M12 13V21.4"/>'
	+ '<path d="M7.5 12.1L6 20.5"/><path d="M16.5 12.1L18 20.5"/>';

// ---------------------------------------------------------------------------------------------
// WT-WIDE, from the scan.
//
// Measured (image px, x relative to 2225, y absolute): flat-crowned dome from a top run of x 87-112
// at y 64 down to vertical walls at x 13 and 186 by y 100; those two verticals run UNBROKEN to the
// ground at y 251, so in his drawing the tank wall IS the leg -- there is no separate splayed leg
// and no joint. Catwalk is a solid bar y 133-142 spanning x 4-197, i.e. it overhangs each wall by
// 9 px and is drawn at twice the outline weight. A shallow bowl springs from the wall at the
// catwalk and bottoms at y 186. A very thick riser, x 85-115 (30 px against the 5 px outline),
// drops from the bowl's low point to the ground.
//
// Mapping: X = 2.2 + (x - 4) * 0.1015, Y = 2.4 + (y - 64) * 0.1015, then walls nudged to 3.1/20.9
// so the drawing is symmetric about x = 12.
var W = {
	wallL: 3.1, wallR: 20.9, walkL: 2.2, walkR: 21.8,
	top: 2.4, shoulder: 6.05, walk: 9.85, bowl: 14.8, ground: 21.4, riserEnd: 22.4
};
// Crown deliberately flatter than a true quarter ellipse (y handle 2.3 against kappa's 2.02),
// because his crown IS flat: the top run is 25 px of a 173 px tank.
var W_DOME = 'M3.1 6.05C3.1 3.75 5.8 2.4 12 2.4C18.2 2.4 20.9 3.75 20.9 6.05';
var W_BOWL = 'M3.1 9.85C3.1 12.58 7.08 14.8 12 14.8C16.92 14.8 20.9 12.58 20.9 9.85';
function wide(o) {
	o = o || {};
	var legEnd = o.legEnd || W.ground;
	var wl = o.walkL === undefined ? W.walkL : o.walkL;
	var wr = o.walkR === undefined ? W.walkR : o.walkR;
	var walkW = o.walkWeight ? ' stroke-width="' + o.walkWeight + '"' : '';
	var s = '<path d="' + W_DOME + '"/>'
		+ '<path d="M3.1 6.05V' + legEnd + 'M20.9 6.05V' + legEnd + '"/>'
		+ '<path d="' + W_BOWL + '"/>'
		+ '<path' + walkW + ' d="M' + wl + ' 9.85H' + wr + '"/>'
		+ '<path stroke-width="' + (o.riser || 3.2) + '" stroke-linecap="butt" d="M12 14.8V22.4"/>';
	if (o.L) { s += '<path d="M9.4 3.9V8.1H13.6"/>'; }
	return s;
}

// ---------------------------------------------------------------------------------------------
// WT-TALL-3, from the scan.
//
// Measured (x relative to 2771): straight gable, peak (69, 73), springing at the wall tops (34, 86)
// and (104, 86) -- the eave runs 4 px past each wall, which is under one stroke width once mapped
// and is therefore dropped rather than drawn (and CLAUDE.md's no-roof-overhang ruling says the same
// thing from the other side). Walls x 34 and 104, y 86 to the catwalk. Catwalk is an OUTLINED box,
// y 165-176, x 27-112: 7 px past each wall. A hemispherical bottom (half-width 35, depth 33)
// bottoms at y 210. Legs x 35 and 103 drift 2 px outward over 60 -- 2 degrees, drawn plumb. The
// riser is x 68-70, the SAME weight as a leg, from y 210 to the ground at y 238.
//
// Mapping: X = 12 + (x - 69) * 0.11636, Y = 2.2 + (y - 73) * 0.11636.
function tall3(o) {
	o = o || {};
	var s = '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
		+ '<path d="M7.95 3.7V' + (o.legEnd || 21.4) + 'M16.05 3.7V' + (o.legEnd || 21.4) + '"/>'
		+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"/>'
		+ '<path d="M7.1 13.55H16.9"/>';
	s += o.riser
		? '<path stroke-width="' + o.riser + '" stroke-linecap="butt" d="M12 18.15V22.4"/>'
		: '<path d="M12 18.15V21.4"/>';
	return s;
}

// The same tower with the x axis stretched 1.83x so the catwalk spans the frame. Nothing about the
// vertical layout moves; this is the one change his own note asks for, since he rates WT-WIDE's
// PROPORTIONS best and WT-TALL-3's shape most promising, and those are two different judgements.
function tall3fit(o) {
	o = o || {};
	var s = '<path d="M4.6 4L12 2L19.4 4"/>'
		+ '<path d="M4.6 4V' + (o.legEnd || 21.4) + 'M19.4 4V' + (o.legEnd || 21.4) + '"/>'
		+ '<path d="M4.6 14C4.6 16.32 7.91 18.2 12 18.2C16.09 18.2 19.4 16.32 19.4 14"/>'
		+ '<path' + (o.walkWeight ? ' stroke-width="' + o.walkWeight + '"' : '')
		+ ' d="M' + (o.walkL || 2.8) + ' 13.4H' + (o.walkR || 21.2) + '"/>'
		+ '<path stroke-width="' + (o.riser || 3.2) + '" stroke-linecap="butt" d="M12 18.2V22.4"/>';
	if (o.L) { s += '<path d="M9.4 6.2V11.2H14.6"/>'; }
	return s;
}

// ---------------------------------------------------------------------------------------------
// WT-TALL-1, for the comparison Tom's note implies: TALL-3 is "simplified slightly" from it, so the
// question is what the simplification bought. Measured (x relative to 2493): peak (61.5, 62), walls
// x 35 and 88 -- a 53 px tank against TALL-3's 70 -- a SHALLOWER bowl (depth 20 against half-width
// 26, not a hemisphere), catwalk box y 149-157 x 29-94, legs splaying 3 px over 60.
// Mapping: X = 12 + (x - 61.5) * 0.10787, Y = 2.2 + (y - 62) * 0.10787.
var TALL1 = '<path d="M9.15 3.4L12 2.2L14.85 3.4"/>'
	+ '<path d="M9.15 3.4V12M14.85 3.4V12"/>'
	+ '<path d="M9.15 12C9.15 13.63 10.42 14.95 12 14.95C13.58 14.95 14.85 13.63 14.85 12"/>'
	+ '<path d="M8.5 12H15.5"/>'
	+ '<path d="M9.15 12L8.8 21.4M14.85 12L15.2 21.4"/>'
	+ '<path d="M12 14.95V21.4"/>';

// ---------------------------------------------------------------------------------------------
// Three verdicts, not two. FAVICON survives 16 px; MENU ONLY is a real drawing that only works from
// 24 px up; RECORD ONLY is kept because it is HIS geometry and the file has to hold it, not because
// anything would ship it. The 2.5-unit figure every verdict cites is the clear-gap floor
// lib/Icons.lib.php measures: 17/24 of a unit is 0.71 px, a 2-unit stroke eats a unit either side,
// so a gap under about 2.5 units closes at icon size.
var C = [
	{ id: 'wt-wide', title: 'WT-WIDE, as drawn', verdict: 'FAVICON',
		fixes: 'His flat-crowned dome, his bar catwalk overhanging both walls, his shallow bowl, his thick riser, and the wall that runs on as the leg. No ellipse, no joint, no splay.',
		why: 'Reads at 16. Riser edges 10.4 and 13.6 against leg inner edges 4.1 and 19.9: 6.3 units of daylight, well over the 2.5-unit floor.',
		body: wide() },
	{ id: 'wt-wide-heavy-walk', title: 'WT-WIDE, catwalk at 2.6', verdict: 'FAVICON',
		fixes: 'He drew the catwalk at twice the outline weight, 10 px against 5. Two units is the set weight; 2.6 is as far as that emphasis carries before the bar eats the tank.',
		why: 'Reads at 16, and the bar is the first thing the eye finds. It costs 0.3 unit of the bowl cavity at each end, which is still open.',
		body: wide({ walkWeight: 2.6 }) },
	{ id: 'wt-wide-long-walk', title: 'WT-WIDE, catwalk out to the frame', verdict: 'FAVICON',
		fixes: 'Overhang is the whole point of a catwalk (Tom, 2026-09-05). 1.4 to 22.6 instead of 2.2 to 21.8: 0.8 more each side, spent on the one feature that says the tank is serviced.',
		why: 'Reads at 16, and the round cap ends land 0.4 unit inside the frame, so nothing clips. The bar now dominates the mark.',
		body: wide({ walkL: 1.4, walkR: 22.6 }) },
	{ id: 'wt-wide-short-legs', title: 'WT-WIDE, legs stopping short', verdict: 'FAVICON',
		fixes: 'Round 1 measured that legs reaching the same ground line as the riser turn the tower into a table. Legs to 19.2, riser to 22.4, so only the pipe touches the ground.',
		why: 'Reads at 16 and keeps the round-1 lesson. At 64 the tower looks slightly suspended.',
		body: wide({ legEnd: 19.2 }) },
	{ id: 'wt-wide-thin-riser', title: 'WT-WIDE, riser at 2.6', verdict: 'FAVICON',
		fixes: 'His riser is 6x the outline weight, which maps to 3.7 units. 3.2 is the set precedent; 2.6 asks whether the thinner pipe still reads as a pipe.',
		why: 'Reads at 16, but 0.6 unit of difference from a leg is not enough at that size and the pipe starts to read as a third leg, which is the shape a riser exists to avoid.',
		body: wide({ riser: 2.6 }) },
	{ id: 'wt-wide-L', title: 'WT-WIDE with an L', verdict: 'MENU ONLY',
		fixes: 'L for Libre in the tank crown, the widest clear field the drawing has.',
		why: 'Culled as a favicon. At 16 the L foot lands on the catwalk and the stem on the crown, so the tank fills with ink and reads as a scribble. It holds from 32 up.',
		body: wide({ L: true }) },
	{ id: 'wt-tall-3', title: 'WT-TALL-3, as drawn', verdict: 'RECORD ONLY',
		fixes: 'His aspect kept exactly: 85 px wide against 165 tall. Gable, plumb walls that run on as legs, box catwalk flattened to a bar, hemispherical bottom, riser at leg weight.',
		why: 'Culled as a favicon. At his aspect the mark is 9.8 units wide, so at 16 px it holds 6.5 pixel columns and the catwalk overhang, the bowl and the riser all fall inside three of them. Riser to leg is 1.95 units, under the floor.',
		body: tall3() },
	{ id: 'wt-tall-3-thick-riser', title: 'WT-TALL-3, riser at 3.2', verdict: 'RECORD ONLY',
		fixes: 'The one place his TALL-3 disagrees with his own WT-WIDE: there the riser is 6x a leg, here it is 1x. A riser at leg weight is a third leg.',
		why: 'Culled as a favicon. The heavier pipe is the right call, but at his width it leaves 1.45 units to each leg and the three verticals fuse into one block at 16.',
		body: tall3({ riser: 3.2 }) },
	{ id: 'wt-tall-3-fit', title: 'WT-TALL-3, fitted to the frame', verdict: 'FAVICON',
		fixes: 'The x axis stretched 1.83x so the catwalk spans 2.8 to 21.2. Same vertical layout, same features, 1.9x the drawn area at any pixel size.',
		why: 'Reads at 16 and is the best of the tall family: 4.8 units of riser-to-leg daylight, an open bowl, and a catwalk that clears both walls.',
		body: tall3fit() },
	{ id: 'wt-tall-3-fit-short-legs', title: 'WT-TALL-3 fitted, legs stopping short', verdict: 'FAVICON',
		fixes: 'The round-1 truncation lesson applied to the fitted tower.',
		why: 'Reads at 16. The truncation buys less here than on WT-WIDE, because the hemispherical bowl already separates the legs from the pipe.',
		body: tall3fit({ legEnd: 19.2 }) },
	{ id: 'wt-tall-3-fit-L', title: 'WT-TALL-3 fitted, with an L', verdict: 'MENU ONLY',
		fixes: 'L on the cylinder, which is a taller field than WT-WIDE offers.',
		why: 'Culled as a favicon for the same reason as wt-wide-L, though the taller field lets the letter survive 24 px rather than needing 32.',
		body: tall3fit({ L: true }) },
	{ id: 'wt-tall-1', title: 'WT-TALL-1, as drawn, for comparison', verdict: 'RECORD ONLY',
		fixes: 'What TALL-3 simplified away: a narrower tank, a shallow bowl instead of a hemisphere, and legs that leave the wall line and splay.',
		why: 'Culled as a favicon. Narrower than TALL-3 and carrying splayed legs as well, so it loses on both counts. Kept to show what the simplification bought.',
		body: TALL1 }
];

// ---------------------------------------------------------------------------------------------
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function svgAt(body, px, extra) {
	return '<svg viewBox="0 0 24 24" width="' + px + '" height="' + px + '" fill="none" stroke="currentColor"'
		+ ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + body + '</svg>';
}
C.forEach(function (c) {
	fs.writeFileSync(path.join(here, c.id + '.svg'), OPEN + '\n\t' + c.body.replace(/><\/path>/g, '/>').replace(/\/><path/g, '/>\n\t<path') + '\n</svg>\n');
});

var CSS = 'body{margin:24px;font:14px/1.5 system-ui,sans-serif;color:#111;background:#fff;max-width:1100px}'
	+ 'h1{font-size:20px}h2{font-size:16px;margin-top:28px}code{font:12px ui-monospace,monospace;background:#f0f0f0;padding:1px 3px}'
	+ '.note{color:#444;max-width:70ch}table{border-collapse:collapse;width:100%;margin-top:8px}'
	+ 'th,td{border-top:1px solid #ddd;padding:8px 6px;vertical-align:top;text-align:left}'
	+ 'th{font-size:12px;color:#555;border-top:0}'
	+ 'td.n{width:170px}td.n b{display:block;font:12px ui-monospace,monospace}td.n span{color:#555;font-size:12px}'
	+ '.set{display:flex;align-items:flex-end;gap:10px;line-height:0}'
	+ '.lt{background:#fff;color:#111;padding:6px;border:1px solid #ddd}'
	+ '.dk{background:#1e1e1e;color:#e8e8e8;padding:6px;border:1px solid #333}'
	+ 'tr.cur{background:#fffbe6}canvas{image-rendering:pixelated;width:96px;height:96px;border:1px solid #ddd}'
	+ 'td.f{font-size:12px;color:#333;max-width:36ch}td.f i{color:#555}'
	+ '.v{font:11px ui-monospace,monospace;padding:1px 4px;border-radius:3px;white-space:nowrap}'
	+ '.v.favicon{background:#dff0d8;color:#2a5d1e}.v.menu{background:#fdf3d0;color:#6b5300}.v.record{background:#f3d9d9;color:#7a2020}';

function row(c, cur) {
	return '<tr' + (cur ? ' class="cur"' : '') + '><td class="n"><b>' + esc(c.id) + '</b><span>' + esc(c.title) + '</span></td>'
		+ '<td><div class="set"><span class="lt">' + [16, 24, 32, 64].map(function (p) { return svgAt(c.body, p); }).join('') + '</span>'
		+ '<span class="dk">' + [16, 24, 32, 64].map(function (p) { return svgAt(c.body, p); }).join('') + '</span></div></td>'
		+ '<td class="mag" data-body="' + esc(c.body).replace(/"/g, '&quot;') + '"><canvas width="16" height="16"></canvas></td>'
		+ '<td class="f">' + (c.verdict ? '<b class="v ' + c.verdict.split(' ')[0].toLowerCase() + '">' + c.verdict + '</b> ' : '')
		+ esc(c.fixes || '') + (c.why ? ' <i>' + esc(c.why) + '</i>' : '') + '</td></tr>';
}

var ALL = [{ id: 'water (current)', title: 'Elliptical bulb, catwalk, riser, splayed legs', fixes: 'What ships today.', body: CURRENT }].concat(C);
var html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Water tower, round 2</title>'
	+ '<style>' + CSS + '</style></head><body>\n'
	+ '<h1>Water-tower candidates, round 2 (2026-09-08b)</h1>\n'
	+ '<p class="note">Round 1 was rejected whole. These are Tom\'s own towers, measured out of '
	+ '<code>tgh-icon-concepts.png</code> by a pixel scan rather than eyeballed, and mapped once into the suite\'s '
	+ '24-unit frame. Every candidate is a single <code>currentColor</code> stroke, so a winner is a copy-paste into '
	+ '<code>lib/Icons.lib.php</code>. Each row is 16 / 24 / 32 / 64 px on light and on dark, then a nearest-neighbor '
	+ 'blow-up of the 16 px raster, which is the favicon question answered by pixels.</p>\n'
	+ '<table><thead><tr><th>Candidate</th><th>16 24 32 64, light then dark</th><th>16 px, x6</th><th>What it is</th></tr></thead><tbody>\n'
	+ row(ALL[0], true) + ALL.slice(1).map(function (c) { return row(c); }).join('\n')
	+ '</tbody></table>\n'
	+ '<script>document.querySelectorAll("td.mag").forEach(function(td){var body=td.getAttribute("data-body");'
	+ 'var svg=\'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\'+body+"</svg>";'
	+ 'var img=new Image();img.onload=function(){var c=td.querySelector("canvas").getContext("2d");c.drawImage(img,0,0,16,16);};'
	+ 'img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);});</script>\n'
	+ '</body></html>\n';
fs.writeFileSync(path.join(here, 'concepts-2026-09-08b.html'), html);

// Contact sheet for the headless render: 16 and 32 px, light and dark, exactly what a tab strip
// and a menu row would show.
var sheet = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:8px;background:#999;font:11px sans-serif}'
	+ '.r{display:flex;align-items:center;margin:3px 0}.l{width:200px;color:#000;font-family:ui-monospace,monospace}'
	+ '.w{background:#fff;color:#111;padding:3px;margin-right:5px;line-height:0}'
	+ '.b{background:#1e1e1e;color:#eee;padding:3px;margin-right:5px;line-height:0}'
	+ '</style></head><body>'
	+ ALL.map(function (c) {
		return '<div class="r"><span class="l">' + esc(c.id) + '<br><i>' + esc(c.verdict || '') + '</i></span>'
			+ '<span class="w">' + svgAt(c.body, 16) + '</span><span class="b">' + svgAt(c.body, 16) + '</span>'
			+ '<span class="w">' + svgAt(c.body, 24) + '</span><span class="b">' + svgAt(c.body, 24) + '</span>'
			+ '<span class="w">' + svgAt(c.body, 32) + '</span><span class="b">' + svgAt(c.body, 32) + '</span>'
			+ '<span class="w">' + svgAt(c.body, 64) + '</span><span class="b">' + svgAt(c.body, 64) + '</span></div>';
	}).join('') + '</body></html>';
fs.writeFileSync(path.join(here, 'render', 'sheet-b.html'), sheet);

// Nearest-neighbor blow-up of the 16 px raster. This is the picture the cull is judged on.
var blow = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:8px;background:#ddd;font:11px ui-monospace,monospace}'
	+ '.g{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.c{background:#fff;padding:4px;text-align:center}'
	+ 'canvas{width:112px;height:112px;image-rendering:pixelated;margin:2px}'
	+ '</style></head><body><div class="g">'
	+ ALL.map(function (c) {
		return '<div class="c" data-body="' + esc(c.body).replace(/"/g, '&quot;') + '"><canvas width="16" height="16"></canvas>'
			+ '<canvas width="16" height="16"></canvas><br>' + esc(c.id) + '<br><i>' + esc(c.verdict || '') + '</i></div>';
	}).join('') + '</div><script>'
	+ 'document.querySelectorAll(".c").forEach(function(d){var body=d.getAttribute("data-body");'
	+ '[["#111","#fff"],["#eee","#1e1e1e"]].forEach(function(p,i){'
	+ 'var svg=\'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="\'+p[0]+\'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\'+body+"</svg>";'
	+ 'var img=new Image();img.onload=function(){var c=d.querySelectorAll("canvas")[i].getContext("2d");c.fillStyle=p[1];c.fillRect(0,0,16,16);c.drawImage(img,0,0,16,16);};'
	+ 'img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);});});'
	+ '</script></body></html>';
fs.writeFileSync(path.join(here, 'render', 'blowup-b.html'), blow);

console.log(C.length + ' candidates written; concepts-2026-09-08b.html, render/sheet-b.html, render/blowup-b.html regenerated');
