#!/usr/bin/env node
/*
 * Water-tower brand mark IN COLOR, round 3 (2026-09-09). ROADMAP Task 615.
 *
 * Round 2 (gen-concepts-b.js) settled the GEOMETRY and left the color question open. Tom, on the
 * same day the three votes came in:
 *
 *   "it looks like we will be going with some color variation of wt-tall-3. Maybe wt-tall-3 with
 *   silver (galvanized steel) fill, possibly in some sort of lighting gradient for a cylinder, on a
 *   sky blue (possibly overcast or wispy or faded for light clouds) background."
 *
 *   "I am wondering how the favicon would look as solid blue with black LW on a light or
 *   cloudy/overcast sky blue background. Coloring tweak only, but its a lossy tweak in the raster
 *   respect because the catwalk loses its middle, I think."
 *
 *   (asked what ground a MASKABLE icon should carry) "Make it look like the sky, cloudy if that
 *   helps with contrast."
 *
 * So this sheet is his three asks drawn in color, plus flat-silver controls for the gradient, plus
 * the maskable pair, plus one row that speaks to MJH reading the shipped mark as a lavatory sink.
 *
 *   node dev/icon-preview/gen-concepts-color.js
 *
 * EVERY PATH HERE IS ROUND 2'S, unchanged. The only new geometry is (a) a CLOSED body path per
 * tower, made by joining round 2's own numbers so there is something to fill, and (b) the W in the
 * one LW row, which no scan of his sketch can supply and which is labelled as ours on the sheet.
 *
 * The script renders REAL PNGs through headless Chromium at 16/32/48/192/512 on a light and a dark
 * page ground, decodes them back in Node, and MEASURES the thing Tom predicted -- whether the
 * catwalk still has a middle where it crosses the tank. Nothing here ships; a winner is a hand copy
 * into lib/Icons.lib.php and icons/.
 *
 * ROUND 3b, 2026-09-10, after Tom read the sheet. Three things, and the first is a defect:
 *
 *   1. "One major bug is that all these descenders (leg and pipe) are truncated. They must hit the
 *      bottom. Obviously we can't have this thang flying in the air." They did, they do now, and
 *      the fix is in the drawing -- see the geometry block. Measured on the BOTTOM ROW of every
 *      raster by descenderFeet(), not in the vector.
 *   2. "You called wide tall." The three fitted-tower rows are ic-wide3fit-* now, and the maskable
 *      one that shares their geometry went with them. The ic-tall3-* rows keep their name: they are
 *      his own aspect, and they really are tall. ic-wide-* is WT-WIDE and is untouched.
 *   3. "It would be extra nice if the mono- menu icon could have a masterful pseudo-gradient touch
 *      for the cylinder." Five candidates at the foot of the sheet, at 16/17/24/32 in one ink on
 *      light and on dark. NOTHING IS DEPLOYED: wt-wide-L is still the shipped menu icon, and
 *      lib/Icons.lib.php, icons/ and both sibling repositories were not touched.
 *
 * ROUND 3c, 2026-09-10, and it is LIGHTING PHYSICS rather than taste. Tom, with two sketches:
 *
 *   "To be pedantic about the ic-tall variants with gradients, the gradient can't really continue
 *    to the top of the tank ... It may be pointless for our purposes, or we may want to make the
 *    entire 'roof' lighter (in the sun). Also, I suppose that the underside is darker."
 *
 * A tower has THREE surfaces and every row above shades them as ONE. A cylinder wall photographs as
 * a left-right band and that is what the wall has and keeps; a CONE does not, and it faces the sky,
 * so it is the brightest thing there; the bowl underneath faces the ground and is the darkest. Four
 * new rows, BESIDE the two he is choosing between rather than instead of them, because this is a
 * candidate and not a correction. surfaceTones() answers the question he asked himself -- whether it
 * survives -- and the answer has two halves at two different sizes; see the sheet.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var here = __dirname;
var OUT = path.join(here, 'render', 'color');
var SIZES = [16, 32, 48, 192, 512];
var GROUNDS = { lt: '#ffffff', dk: '#1e1e1e' };

// --------------------------------------------------------------------------------------------
// Round 2's geometry. Bodies are the same numbers closed into a fillable outline. probeX is the
// column the catwalk measurement samples on; foot is the radius of the leg foot as round 2 drew it,
// which is where the maskable scales below came from.
//
// THE DESCENDERS ARE A PARAMETER, and that is the round-3 fix. Round 2 drew every leg and riser to
// a hard-coded y of 21.4 or 22.4 inside a 24-unit frame, so the tower ENDED IN MID-AIR with 1.6 to
// 2.6 units of empty ground under it -- Tom, reading the sheet: "all these descenders (leg and pipe)
// are truncated. They must hit the bottom. Obviously we can't have this thang flying in the air."
// It was the DRAWING, not the viewBox and not the fit: nothing ever clipped these paths, they simply
// stopped short. So every leg and riser now takes its bottom y from the caller, and the caller
// passes the y that lands on the frame's bottom edge AFTER the concept's own scale -- 24 when the
// glyph is drawn 1:1, and 12 + 12/scale for the maskable rows, which is 27 at 0.80 and 28.2 at 0.74.
// A maskable icon is MEANT to bleed to the edge; only the tank has to stay inside the safe circle,
// and a leg tip cropped by Android's mask is the bleed working rather than content being lost.
var TALL3 = {
	body: 'M7.95 3.7L12 2.2L16.05 3.7V14.15C16.05 16.36 14.24 18.15 12 18.15C9.76 18.15 7.95 16.36 7.95 14.15Z',
	strokes: function (bot) {
		return '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
			+ '<path d="M7.95 3.7V' + bot + 'M16.05 3.7V' + bot + '"/>'
			+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"/>'
			+ '<path d="M7.1 13.55H16.9"/>'
			+ '<path d="M12 18.15V' + bot + '"/>';
	},
	tank: [7.95, 16.05, 3.7, 18.15], feet: [7.95, 12, 16.05],
	catwalk: 13.55, probeX: 12, foot: 11.96,
	// THE THREE SURFACES (round 3c). The body above is ONE closed outline and takes ONE fill, which
	// is what Tom's lighting note is about. Split at the two places the surface actually turns:
	// the springline (y 3.7) where the cone starts, and the bowl line (y 14.15) where the wall ends.
	roof: 'M7.95 3.7L12 2.2L16.05 3.7Z',
	cyl: 'M7.95 3.7H16.05V14.15H7.95Z',
	bowl: 'M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15Z',
	// The BANDS surfaceTones() reads, [x0, x1, y0, y1] in drawing units. All four are the same four
	// columns about the center, so the wall's own left-right ramp is at the same phase in every one
	// of them and the numbers are comparable. Each band spans its surface's FULL depth on those
	// columns, ink included: what fraction of it is fill rather than outline is half the answer.
	sample: { sky: [10, 14, 0.2, 1.2], roof: [10, 14, 2.4, 3.7], cyl: [10, 14, 5, 12], bowl: [10, 14, 14.9, 17.0] }
};
var TALL3FIT = {
	body: 'M4.6 4L12 2L19.4 4V14C19.4 16.32 16.09 18.2 12 18.2C7.91 18.2 4.6 16.32 4.6 14Z',
	strokes: function (bot) {
		return '<path d="M4.6 4L12 2L19.4 4"/>'
			+ '<path d="M4.6 4V' + bot + 'M19.4 4V' + bot + '"/>'
			+ '<path d="M4.6 14C4.6 16.32 7.91 18.2 12 18.2C16.09 18.2 19.4 16.32 19.4 14"/>'
			+ '<path d="M2.8 13.4H21.2"/>'
			+ '<path stroke-width="3.2" stroke-linecap="butt" d="M12 18.2V' + bot + '"/>';
	},
	tank: [4.6, 19.4, 4, 18.2], feet: [4.6, 12, 19.4],
	catwalk: 13.4, probeX: 12, foot: 11.96,
	roof: 'M4.6 4L12 2L19.4 4Z',
	cyl: 'M4.6 4H19.4V14H4.6Z',
	bowl: 'M4.6 14C4.6 16.32 7.91 18.2 12 18.2C16.09 18.2 19.4 16.32 19.4 14Z',
	sample: { sky: [10, 14, 0.2, 1.0], roof: [10, 14, 2.2, 4.0], cyl: [10, 14, 5, 12], bowl: [10, 14, 14.9, 17.0] }
};
// WT-WIDE's crown carries the black letter, which is exactly where the center column would look for
// a body baseline, so this one is sampled at x = 17: inside the tank at the catwalk and inside the
// bowl two units below it.
var WIDE = {
	body: 'M3.1 6.05C3.1 3.75 5.8 2.4 12 2.4C18.2 2.4 20.9 3.75 20.9 6.05V9.85'
		+ 'C20.9 12.58 16.92 14.8 12 14.8C7.08 14.8 3.1 12.58 3.1 9.85Z',
	strokes: function (bot) {
		return '<path d="M3.1 6.05C3.1 3.75 5.8 2.4 12 2.4C18.2 2.4 20.9 3.75 20.9 6.05"/>'
			+ '<path d="M3.1 6.05V' + bot + 'M20.9 6.05V' + bot + '"/>'
			+ '<path d="M3.1 9.85C3.1 12.58 7.08 14.8 12 14.8C16.92 14.8 20.9 12.58 20.9 9.85"/>'
			+ '<path d="M2.2 9.85H21.8"/>'
			+ '<path stroke-width="3.2" stroke-linecap="butt" d="M12 14.8V' + bot + '"/>';
	},
	tank: [3.1, 20.9, 2.4, 14.8], feet: [3.1, 12, 20.9],
	catwalk: 9.85, probeX: 17, foot: 12.94
};
var L_CROWN = '<path d="M9.4 3.9V8.1H13.6"/>';
// OURS, not his: no scan can supply a W. Drawn small enough to sit beside the L in the same crown.
var LW_CROWN = '<path d="M7.4 3.9V7.7H10.1"/><path d="M11.5 3.9L12.6 7.7L13.9 5.5L15.2 7.7L16.3 3.9"/>';

// --------------------------------------------------------------------------------------------
// Color. The steel ramp runs across x, which is how a cylinder photographs: a dark limb, a bright
// vertical band a third of the way in, and a second darker limb.
var STEEL = [['0', '#6f767d'], ['0.18', '#9aa2a9'], ['0.36', '#eef1f3'], ['0.54', '#c2c8cd'],
	['0.78', '#8b9299'], ['1', '#666d74']];
// ROUND 3c, and it is a lighting correction rather than a taste one. Tom, 2026-09-10, with two
// sketches: "the gradient can't really continue to the top of the tank ... we may want to make the
// entire 'roof' lighter (in the sun). Also, I suppose that the underside is darker."
//
// A cylinder wall and a cone are not the same surface and cannot take the same ramp. The wall's
// left-right band above is right for the wall and stays EXACTLY as it is; the cone faces the sky
// and is the brightest thing on the tower; the bowl underneath faces the ground and is the darkest.
// Both new ramps keep the wall's own stop positions, so the three surfaces are the same lighting
// read at three exposures rather than three unrelated gradients.
var ROOF = [['0', '#dfe4e8'], ['0.36', '#ffffff'], ['0.72', '#f2f5f7'], ['1', '#dbe1e6']];
var BOWL = [['0', '#525960'], ['0.36', '#868d94'], ['0.72', '#6b7278'], ['1', '#4b5157']];
var FLAT_SILVER = '#b3b9bf';
var INK = '#232a30';
var SKY_LIGHT = '#cfe6f7';
var BLUE = '#1c62b9';

function ramp(id, stops) {
	return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">'
		+ stops.map(function (p) { return '<stop offset="' + p[0] + '" stop-color="' + p[1] + '"/>'; }).join('')
		+ '</linearGradient>';
}
function defs(id, kind, ground, surfaces) {
	var s = '';
	if (kind === 'steel') {
		s += ramp('g' + id, STEEL);
		if (surfaces) { s += ramp('r' + id, ROOF) + ramp('b' + id, BOWL); }
		if (surfaces === 'lift') {
			// The measured cost of a dark underside, and its repair. The catwalk sits 0.6 units above
			// the bowl line, so a bowl at one dark tone puts a dark surface directly under a dark bar
			// and the bar loses its lower edge at 16 px. Lifting the TOP of the bowl is the same
			// top-lit scene, not a second light: an underside is darkest where it faces the ground.
			s += '<linearGradient id="l' + id + '" x1="0" y1="0" x2="0" y2="1">'
				+ '<stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/>'
				+ '<stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/></linearGradient>';
		}
	}
	if (ground === 'sky') {
		s += '<linearGradient id="s' + id + '" x1="0" y1="0" x2="0" y2="1">'
			+ '<stop offset="0" stop-color="#7bb8e0"/><stop offset="1" stop-color="#b9dcf2"/></linearGradient>';
	}
	if (ground === 'overcast') {
		s += '<linearGradient id="s' + id + '" x1="0" y1="0" x2="0" y2="1">'
			+ '<stop offset="0" stop-color="#9ecbe8"/><stop offset="1" stop-color="#dbe9f2"/></linearGradient>'
			+ '<filter id="f' + id + '" x="-40%" y="-40%" width="180%" height="180%">'
			+ '<feGaussianBlur stdDeviation="1.1"/></filter>';
	}
	return s ? '<defs>' + s + '</defs>' : '';
}
function groundEl(id, ground) {
	if (ground === 'sky' || ground === 'overcast') {
		var s = '<rect x="0" y="0" width="24" height="24" fill="url(#s' + id + ')"/>';
		if (ground === 'overcast') {
			// Wisps: three soft white ellipses, deliberately low contrast so they cannot be mistaken
			// for part of the mark at 16 px.
			s += '<g filter="url(#f' + id + ')" fill="#ffffff" opacity="0.72">'
				+ '<ellipse cx="6" cy="5.5" rx="6" ry="1.7"/><ellipse cx="18.5" cy="9" rx="5.5" ry="1.5"/>'
				+ '<ellipse cx="11" cy="19.5" rx="8" ry="1.9"/></g>';
		}
		return s;
	}
	return '<rect x="0" y="0" width="24" height="24" fill="' + ground + '"/>';
}

function round2(n) { return Math.round(n * 100) / 100; }

/**
 * One concept's SVG body (everything inside the <svg>), at the 24-unit frame.
 * o: {geo, fill:'steel'|flat color, stroke, ground, letter, scale, walkKnockout}
 */
function draw(id, o) {
	var g = o.geo;
	var fill = o.fill === 'steel' ? 'url(#g' + id + ')' : o.fill;
	// The y a descender must be drawn to so that it lands ON the frame's bottom edge after this
	// concept's own scale. See the geometry comment: 24 unscaled, 12 + 12/scale when scaled.
	var bot = round2(o.scale && o.scale !== 1 ? 12 + 12 / o.scale : 24);
	var inner = '<path d="' + g.body + '" fill="' + fill + '"/>';
	if (o.surfaces) {
		// The whole body is filled with the WALL ramp first and the other two surfaces are painted
		// OVER it, exactly on their own outlines. Three abutting fills would put an antialiased
		// hairline of page ground along each seam at 16 px; an overlay cannot, because whatever the
		// edge pixel blends with is the same tower underneath it.
		inner += '<path d="' + g.roof + '" fill="url(#r' + id + ')"/>'
			+ '<path d="' + g.bowl + '" fill="url(#b' + id + ')"/>';
		if (o.surfaces === 'lift') { inner += '<path d="' + g.bowl + '" fill="url(#l' + id + ')"/>'; }
	}
	inner += '<g fill="none" stroke="' + o.stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
		+ g.strokes(bot) + (o.letter || '') + '</g>';
	if (o.walkKnockout) {
		// OURS, offered as the repair for the very thing Tom predicted: the catwalk redrawn in the
		// ground color where it crosses the body, so the bar keeps a middle inside a solid fill.
		inner += '<g fill="none" stroke="' + o.walkKnockout + '" stroke-width="1.1" stroke-linecap="butt">'
			+ '<path d="M' + (o.walkIn[0]) + ' ' + g.catwalk + 'H' + (o.walkIn[1]) + '"/></g>';
	}
	if (o.scale && o.scale !== 1) {
		inner = '<g transform="translate(12 12) scale(' + o.scale + ') translate(-12 -12)">' + inner + '</g>';
	}
	return defs(id, o.fill === 'steel' ? 'steel' : '', o.ground, o.surfaces) + groundEl(id, o.ground) + inner;
}

// --------------------------------------------------------------------------------------------
// The concepts. `verdict` is set from the rendered PNGs, never from the 512.
var C = [];
function add(c) { c.svg = draw(c.id, c.o); c.geo = c.o.geo; C.push(c); }

add({ id: 'ic-wide3fit-steel-sky', title: 'wt-tall-3-fit (reads WIDE), galvanized gradient, plain sky',
	ask: 'His main ask: wt-tall-3 in silver with a cylinder lighting gradient on a sky-blue ground. Fitted aspect, which round 2 measured as the only tall variant that survives 16 px.',
	why: 'Holds at 16: tank, catwalk, two legs and the riser all still separate. The catwalk keeps its middle at every size (dL 59 at 16, 162 at 32), because the bar is ink and the body is silver, so nothing about it depends on resolution. The gradient survives too -- the bright band is still 2 pixel columns at 16.',
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: 'steel', stroke: INK, ground: 'sky' } });

add({ id: 'ic-wide3fit-steel-overcast', title: 'wt-tall-3-fit (reads WIDE), galvanized gradient, overcast sky',
	ask: 'The same with the wispy/overcast treatment he raised twice as a contrast aid. Three blurred white bands, deliberately low contrast.',
	why: "Same reading as the plain sky at every size. The wisps cost nothing at 16 (they are below the tank's own contrast) and are the row to prefer if the ground has to work as a maskable background as well.",
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: 'steel', stroke: INK, ground: 'overcast' } });

add({ id: 'ic-wide3fit-silver-flat', title: 'wt-tall-3-fit (reads WIDE), FLAT silver, plain sky (control)',
	ask: 'The control for the gradient. A gradient that survives 512 and dies at 32 is worth knowing about before anybody falls in love with it.',
	why: "Holds at 16, and this is the control's answer: the flat fill is not worse at 16 -- it is very slightly BETTER separated from the sky, because the gradient's dark left limb sits nearer the sky's own value. The gradient buys a real cylinder from 32 up and costs nothing below it, so it is a taste question rather than a legibility one.",
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: FLAT_SILVER, stroke: INK, ground: 'sky' } });

add({ id: 'ic-tall3-steel-sky', title: 'wt-tall-3 as he drew it, galvanized gradient, plain sky',
	ask: 'His own aspect, 9.8 units wide. Round 2 filed this RECORD ONLY in monochrome; color is the question of whether a filled body rescues it.',
	why: "RE-MEASURED AFTER THE DESCENDER FIX, AND THE VERDICT MOVED. Round 3 filed this MENU ONLY on the claim that at 16 px the two legs and the riser fall inside three pixel columns and fuse into a block. They do not, and now that the descenders run to the frame's edge there is a bottom row to read them on: at 16 px it holds THREE separate runs -- left leg, riser, right leg at columns 4-5, 7-8 and 10-11, with pure sky between them -- because the drawing puts them 4 units apart, not 3 pixels. Before the fix that row was sky from side to side, which is what the old reading was looking at. Catwalk dL 55 at 16, feet dL 63.",
	verdict: 'FAVICON',
	o: { geo: TALL3, fill: 'steel', stroke: INK, ground: 'sky' } });

add({ id: 'ic-tall3-steel-overcast', title: 'wt-tall-3 as he drew it, gradient, overcast sky',
	ask: 'His aspect with the cloud treatment.',
	why: 'THE FRONT RUNNER, and re-measured after the descender fix like the row above: FAVICON, not MENU ONLY. Its numbers are the best of his own aspect at 16 px -- catwalk dL 55, feet dL 69 at the weakest of the three, three separate descenders on the bottom row. The low cloud band sits BEHIND the legs and, being blurred and light, raises their contrast against the ground rather than competing with them.',
	verdict: 'FAVICON',
	o: { geo: TALL3, fill: 'steel', stroke: INK, ground: 'overcast' } });

add({ id: 'ic-tall3-silver-flat', title: 'wt-tall-3 as he drew it, FLAT silver (control)',
	ask: 'Control for the row above.',
	why: 'Control for the row above, and it says what the fitted tower\'s control said: the flat fill costs nothing at 16 px and buys no cylinder above it. The gradient is a taste question.',
	verdict: 'FAVICON',
	o: { geo: TALL3, fill: FLAT_SILVER, stroke: INK, ground: 'sky' } });

// ROUND 3c: the same two front-runner rows with the tower lit as THREE surfaces. They sit BESIDE
// their parents rather than replacing them -- Tom is choosing between the two-surface rows, and this
// is a candidate, not a correction.
add({ id: 'ic-tall3-3surf-overcast', title: 'FRONT RUNNER lit as three surfaces: sunlit roof, wall band, dark underside',
	ask: 'His lighting note, 2026-09-10: "the gradient can\'t really continue to the top of the tank ... we may want to make the entire roof lighter (in the sun). Also, I suppose that the underside is darker." The wall ramp is unchanged and now STOPS at the springline; the cone takes a near-white ramp and the bowl a dark one.',
	why: 'THE ROOF AND THE UNDERSIDE DIE AT DIFFERENT SIZES, and that is the whole answer. The UNDERSIDE works from 32 px up -- bowl against wall 68.8 / 66.5 / 72.2 / 72.8 at 32 / 48 / 192 / 512, against 10.1 / 9.9 / 1.9 / 1.4 for its two-surface parent, which is the parent having no underside at all. The ROOF shows only at 192 and up: on this aspect the cone is 1.5 units deep and the outline is 2 units wide, so at 16, 32 and 48 px the band holds NOT ONE pixel of roof fill that is not touching ink, and roof against wall is 26.4 at 192 and 42.2 at 512 against 9.7 and 8.5. Descenders and their three separate runs are the parent\'s exactly.',
	verdict: 'FAVICON',
	o: { geo: TALL3, fill: 'steel', stroke: INK, ground: 'overcast', surfaces: true } });

add({ id: 'ic-tall3-3surf-sky', title: 'Three surfaces, plain sky (the other half of the pair he is choosing between)',
	ask: 'The same treatment on the plain-sky twin, because the pair is what he is choosing between and a lighting change has to be judged on both grounds.',
	why: 'THE SILHOUETTE WORRY DID NOT HAPPEN, and it is this row that says so most clearly. A sunlit roof is LIGHTER than the sky rather than nearer it: roof against sky is 50.3 at 192 and 67.0 at 512, against 33.6 and 33.4 for the two-surface parent. On the overcast twin, whose sky is the lighter of the two, it is still 28.9 and 45.5 against 12.2 and 11.9. The lighter roof buys outline rather than spending it, and below 192 the ink outline is doing that job by itself anyway.',
	verdict: 'FAVICON',
	o: { geo: TALL3, fill: 'steel', stroke: INK, ground: 'sky', surfaces: true } });

add({ id: 'ic-wide3fit-3surf-overcast', title: 'Three surfaces on the fitted tower (the maskable geometry)',
	ask: 'The fitted aspect carries the maskable pair, and a maskable icon is 192 px and up -- the sizes where a three-surface reading has the most room. Its roof is 2 units tall at the center against 1.5 on his own aspect.',
	why: 'THE BEST ROW FOR THE TREATMENT, because the cone has somewhere to be: 2 units deep at the center against 1.5, so 19 to 37 per cent of the roof band is clean fill at every size and the roof reads from 32 px -- roof against wall 16.4 / 14.3 / 35.6 / 40.7 at 32 / 48 / 192 / 512 against 5.8 / 2.0 / 0.6 / 0.2 for its parent. Its underside works at every size, 16 included (50.1). If the three-surface treatment is taken anywhere, it is taken here first: this geometry carries the maskable pair and a maskable icon is never seen below 192.',
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: 'steel', stroke: INK, ground: 'overcast', surfaces: true } });

add({ id: 'ic-tall3-3surf-lift-overcast', title: 'Three surfaces, underside lifted at the bowl line',
	ask: "OURS, and it is the repair for the one thing the dark underside measurably costs: the catwalk runs 0.6 units above the bowl line, so a bowl at one dark tone takes the bar's lower edge with it. The bowl darkens DOWNWARD from the bowl line here, which is the same top-lit scene rather than a second light.",
	why: 'It does what it was drawn for and the effect is small: bowl against wall 52.4 / 49.7 / 58.3 / 60.1 where the unlifted row is 68.8 / 66.5 / 72.2 / 72.8, so the underside is still plainly an underside and the catwalk has a lighter surface to sit against. Read it beside its unlifted twin at 16 px and choose on taste; the measured difference at that size is one pixel of the bowl top.',
	verdict: 'FAVICON',
	o: { geo: TALL3, fill: 'steel', stroke: INK, ground: 'overcast', surfaces: 'lift' } });

add({ id: 'ic-wide-L-blue', title: 'wt-wide-L, solid blue, black L, light sky-blue ground',
	ask: 'His second ask, exactly: the shipped mark as solid blue with a black letter on a light sky-blue ground. THIS IS THE ROW HIS CATWALK PREDICTION IS ABOUT.',
	why: "HIS PREDICTION IS CORRECT, AND IT IS WORSE THAN HE THOUGHT: the catwalk's middle is gone at EVERY size, 512 included (dL 0.8 / 0.4 / 0.7 / 0.7 / 0.0). A bar the same color as the body it crosses has nothing to be seen against, so this is not a raster loss that a bigger icon fixes -- only the overhanging ends survive, and the mark reads as a tank with two stubs. The letter still needs 32 px, as round 2 measured.",
	verdict: 'MENU ONLY',
	o: { geo: WIDE, fill: BLUE, stroke: BLUE, ground: SKY_LIGHT, letter: L_CROWN.replace('<path', '<path stroke="#000"') } });

add({ id: 'ic-wide-LW-blue', title: 'wt-wide, solid blue, black LW, light sky-blue ground',
	ask: 'He wrote LW, not L. The W is OURS -- no scan of his sketch has one -- and is on the sheet so he can see the cost of the second letter rather than imagine it.',
	why: 'Two letters in a crown that struggles with one. At 16 the LW is a single smudge and at 32 the W is three strokes inside 5 pixels. Same catwalk loss as the row above.',
	verdict: 'RECORD ONLY',
	o: { geo: WIDE, fill: BLUE, stroke: BLUE, ground: SKY_LIGHT, letter: LW_CROWN.replace(/<path/g, '<path stroke="#000"') } });

add({ id: 'ic-wide-L-blue-knockout', title: 'wt-wide-L blue, catwalk knocked out in sky (OURS)',
	ask: 'OUR SUGGESTION, not his ask: the catwalk redrawn across the body in the ground color, which is the only way a same-color bar keeps a middle inside a solid fill.',
	why: 'The repair works and it is measurable: dL 47 at 16 and 137 from 48 up, against 0 for the same drawing without it. The catwalk is a light line rather than a dark one, which is what a walkway on a photographed tank usually is anyway. Still MENU ONLY, on the letter rather than the bar.',
	verdict: 'MENU ONLY',
	o: { geo: WIDE, fill: BLUE, stroke: BLUE, ground: SKY_LIGHT, letter: L_CROWN.replace('<path', '<path stroke="#000"'),
		walkKnockout: SKY_LIGHT, walkIn: [3.1, 20.9] } });

add({ id: 'ic-wide-steel-sky', title: 'wt-wide, no letter, galvanized gradient, sky',
	ask: 'The sink question. MJH read the shipped mark as a lavatory sink and liked it; a sink is not photographed against the sky, so this row asks whether the GROUND alone moves the reading without changing one path.',
	why: 'The strongest 16 px picture on the sheet, and the answer to the sink question is that the FILL does most of the work: a silver vessel on sky reads as a vessel outdoors, where the same outline in one flat color read as a fixture to one of three viewers. Catwalk middle holds at every size (dL 44 at 16).',
	verdict: 'FAVICON',
	o: { geo: WIDE, fill: 'steel', stroke: INK, ground: 'sky' } });

// The maskable pair. The safe zone is the inner 80% circle: radius 9.6 about (12,12) in this frame.
// The scale each needs is 9.6 divided by the radius of its own farthest drawn point, which is a leg
// foot in both cases -- 11.96 for the fitted tower, 12.94 for WT-WIDE.
add({ id: 'ic-mask-wide3fit-overcast', title: 'MASKABLE: wt-tall-3-fit (reads WIDE), gradient, overcast, 0.80 scale',
	ask: 'Opaque ground, glyph scaled 0.80 so its farthest point (a leg foot at radius 11.96) lands at 9.57, inside the 9.6 safe circle. Android crops anything outside it.',
	why: 'The maskable candidate. Only 192 and 512 matter here and both are clean; it is on the sheet at 16 as well so the same drawing can be judged as a favicon. At 0.80 the mark loses a fifth of its linear size, which is the price of the safe zone and is why the FITTED tower rather than his own aspect is the one to mask.',
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: 'steel', stroke: INK, ground: 'overcast', scale: 0.80 } });

add({ id: 'ic-mask-wide-L-blue', title: 'MASKABLE: wt-wide-L blue, light sky, 0.74 scale',
	ask: 'The shipped mark made maskable: WT-WIDE reaches radius 12.94 at a leg foot, so it needs 0.74 rather than 0.80.',
	why: 'Needs 0.74, so it loses a quarter of its size, and it carries the catwalk loss of its parent row into the one icon Android will crop as well. Both costs land on the same drawing. Its feet number is the one red descender on the sheet and it is NOT a truncation: at 0.74 a leg is 1.5 units wide and lands on half a pixel at 16 px, so the bottom row samples mostly sky. It is 106 at 32 and 137 from 48 up, and only 192 and 512 are what a maskable icon is for.',
	verdict: 'MENU ONLY',
	o: { geo: WIDE, fill: BLUE, stroke: BLUE, ground: SKY_LIGHT, letter: L_CROWN.replace('<path', '<path stroke="#000"'), scale: 0.74 } });

// What ships today, for the comparison row: one stroke, transparent ground.
var SHIPPED = { id: 'wt-wide-L (ships today)', title: 'Monochrome stroke, transparent ground',
	ask: 'The mark on both sibling sites right now, and the thing every color row is measured against.',
	why: 'Its interior is empty, so the catwalk has a middle at every size by construction; that is the baseline the filled rows lose.',
	verdict: 'MENU ONLY',
	svg: '<g fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
		+ WIDE.strokes(24) + L_CROWN + '</g>',
	// The shipped mark is a currentColor stroke on a transparent ground, so on a dark ground the
	// REAL one inverts. Drawing the dark strip in #111 would put a black mark on a black page and
	// invite a conclusion about a picture nobody will ever see.
	svgDk: '<g fill="none" stroke="#e8e8e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
		+ WIDE.strokes(24) + L_CROWN + '</g>',
	geo: WIDE, shipped: true };

// --------------------------------------------------------------------------------------------
// MONO MENU CANDIDATES (round 3b). Tom: "I would love to show that to PCW and MAH ... It would be
// extra nice if the mono- menu icon could have a masterful pseudo-gradient touch for the cylinder."
//
// A MENU ICON CANNOT CARRY A SKY. lib/Icons.lib.php draws every one through EC_ICON_OPEN_TAG --
// fill="none", stroke="currentColor", stroke-width 2, on no ground at all -- which is what lets the
// row's own color drive the glyph and greys it for free when the row is disabled. So there is no
// fill to put a gradient in, and no paper to make lighter than paper: in a stroke-only glyph the
// ONLY move available is to ADD ink on the shadow limb and leave the bright band bare. That is
// engraving, and it is what these five rows try at the size that decides it, about 17 px (1.05em).
//
// The tank of WT-TALL-3 -- the front runner's own aspect -- spans x 7.95 to 16.05 with 2-unit walls,
// so the CLEAR interior is 8.95 to 15.05: six units, which is 4.2 pixels at 17 px. Everything below
// has to happen inside those four pixels, and the measurement under each row says whether it did.
var MSIZES = [16, 17, 24, 32];
var MONO_INK = { lt: '#111111', dk: '#e8e8e8' };
var M = [];
function addMono(c) { M.push(c); }
function monoSVG(extra, ink, walls) {
	var w = walls || {};
	var g = '<g fill="none" stroke="' + ink + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
	// The tank walls are drawn separately from the rest when a row varies their weight.
	var rest = '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
		+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"' 
		+ (w.bowl ? ' stroke-width="' + w.bowl + '"' : '') + '/>'
		+ '<path d="M7.1 13.55H16.9"/>'
		+ '<path d="M12 18.15V24"/>'
		+ '<path' + (w.left ? ' stroke-width="' + w.left + '"' : '') + ' d="M7.95 3.7V24"/>'
		+ '<path' + (w.right ? ' stroke-width="' + w.right + '"' : '') + ' d="M16.05 3.7V24"/>';
	return g + rest + (extra || '') + '</g>';
}
function hatch(x, width, y0, y1, dash) {
	return '<path stroke-width="' + width + '" stroke-linecap="butt"'
		+ (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' d="M' + x + ' ' + y0 + 'V' + y1 + '"/>';
}

addMono({ id: 'ic-mono-plain', title: 'CONTROL: wt-tall-3 stroked, no shading',
	ask: 'The control. Round 2\'s wt-tall-3 as a menu icon would be drawn, with the descenders now reaching the bottom edge and nothing else added.',
	verdict: 'MENU OK',
	why: 'The control, and what every row below is read against: a bare tank already scores 2 grade columns at 16 and 17 px from antialiasing alone, which is why each row reports its NET. Nothing here suggests a cylinder; the tank is a rectangle with a dome on it.',
	extra: function () { return ''; } });

addMono({ id: 'ic-mono-hatch2', title: 'Two hatch lines on the shadow limb',
	ask: 'Engraving\'s own answer: two thin verticals inside the right third, leaving the bright band bare paper. 0.75 wide at x 13.5 and 14.6.',
	verdict: 'MENU OK',
	why: 'The hatch survives, but not as a hatch. By 24 and 32 px both lines have MERGED into the right wall, so what the reader gets is a heavier right limb with a mid-tone edge rather than two engraved lines: net +1 at 17 px, +2 at 32. One-sided, so the tank reads as lit from the left rather than as round.',
	extra: function () { return hatch(13.5, 0.75, 5.6, 15.4) + hatch(14.6, 0.75, 6.4, 14.6); } });

addMono({ id: 'ic-mono-hatch-lr', title: 'One line left limb, two right (full cylinder)',
	ask: 'The same with a lighter line on the far LEFT limb as well, so the bare band sits between two shaded edges rather than against one. This is the shape a cylinder actually photographs.',
	verdict: 'PICK',
	why: 'THE ONE TO SHOW. A light line on the left limb and two on the right leaves a bare band down the middle, which is the only place a highlight can come from in a stroke-only glyph -- there is no paper lighter than paper. Net +1 at 17 px and +3 at both 16 and 32, and the mid-tone lands on BOTH limbs, which is what makes the reading round rather than merely shaded. The same net on the dark ground, so a menu row of either colour gets the same drawing.',
	extra: function () { return hatch(9.5, 0.6, 6.2, 14.6) + hatch(13.5, 0.75, 5.6, 15.4) + hatch(14.6, 0.75, 6.4, 14.6); } });

addMono({ id: 'ic-mono-weight', title: 'No interior line: asymmetric wall weight',
	ask: 'Curvature by WEIGHT alone -- a 1.4 left wall against a 2.9 right wall and a heavier bowl. Nothing is added inside the tank, so nothing can fuse inside it.',
	verdict: 'MENU OK',
	why: 'Curvature by wall weight alone, and it is the row that fails AT THE SIZE THAT DECIDES: net 0 at 17 px. A 1.4-unit wall and a 2.9-unit wall are about one pixel apart at menu size, so the asymmetry only appears from 24 up (net +3 and +4). It is also the one row whose thin left wall costs descender contrast -- feet dL 30 at 17 against 50 for the others.',
	walls: { left: 1.4, right: 2.9, bowl: 2.6 },
	extra: function () { return ''; } });

addMono({ id: 'ic-mono-broken', title: 'Broken shadow line, plus a heavier right wall',
	ask: 'His "broken highlight line" read as a shadow: one dashed vertical at x 14.2, with the right wall thickened to 2.6 so the shading survives if the dashes do not.',
	verdict: 'RECORD ONLY',
	why: 'The highest net at 17 px (+2) and still the row to turn down: from 24 up the dashes separate cleanly enough to read as a BREAK in the tank wall rather than as shading, which is a defect the reader has to explain away. Kept because it is the literal reading of a broken highlight line and somebody will propose it again.',
	walls: { right: 2.6 },
	extra: function () { return hatch(14.2, 0.9, 5.8, 15.2, '2.4 1.6'); } });

M.forEach(function (c) {
	c.svg = monoSVG(c.extra(), MONO_INK.lt, c.walls);
	c.svgDk = monoSVG(c.extra(), MONO_INK.dk, c.walls);
});

// --------------------------------------------------------------------------------------------
function svgFile(body) {
	return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"'
		+ ' aria-hidden="true" focusable="false">' + body + '</svg>\n';
}
C.forEach(function (c) { fs.writeFileSync(path.join(here, c.id + '.svg'), svgFile(c.svg)); });
M.forEach(function (c) { fs.writeFileSync(path.join(here, c.id + '.svg'), svgFile(c.svg)); });

// --------------------------------------------------------------------------------------------
// A minimal PNG reader. The rasters are the evidence, so the measurement decodes the FILES that go
// on the sheet rather than re-rendering the SVG into a canvas and measuring that instead.
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

/**
 * Does the catwalk still have a MIDDLE at this size?
 *
 * Tom predicted it loses one. The catwalk is a horizontal bar crossing the tank, so its middle is
 * visible exactly when the pixels ON the bar differ from the body pixels just above and below it, on
 * a column that is INSIDE the tank -- geo.probeX, which is the center column for the two tall towers
 * and x = 17 for WT-WIDE, whose crown carries a black letter the center column would sample instead
 * of the body. Measured as a luminance difference on 0-255; the threshold is 26, a tenth of the
 * range, which is roughly where a difference stops being findable on a screen at arm's length.
 * Sampling takes the strongest row within half a stroke of the nominal one, because at 16 px a
 * 2-unit bar is 1.3 px wide and lands wherever the rasterizer puts it.
 */
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

/**
 * ARE THE THREE SURFACES DISTINGUISHABLE IN THE ACTUAL PIXELS?
 *
 * Round 3c's whole question, and Tom raised it himself -- "It may be pointless for our purposes."
 * Four points are read on the CENTER column, so the wall's own left-right ramp is at the same phase
 * in every one of them: sky just above the apex, the cone, the wall at mid height, the bowl. Each is
 * a mean over a box of about half a drawing unit, which is one pixel at 16 and 32 px and grows with
 * the raster; at the small sizes the sample is whatever the rasterizer put there, INCLUDING the ink
 * stroke, and that is the finding rather than a flaw in the method.
 *
 *   roofVsCyl -- the treatment's own payload: is the cone lighter than the wall below it?
 *   roofVsSky -- the silhouette risk, and the specific way this change could make the icon worse.
 *                A roof light enough to dissolve into the sky costs the tower its outline.
 *   bowlVsCyl -- the underside.
 *
 * Same luminance difference on 0-255 and the same threshold of 26 the catwalk measurement uses.
 */
function surfaceTones(file, geo, px, scale, inkL) {
	if (!geo.sample) { return null; }
	var img = readPNG(file), k = px / 24, sc = scale || 1, ink = inkL === undefined ? 41 : inkL;
	// AN ANTIALIASED EDGE PIXEL IS NOT THE SURFACE. The first version of this averaged every non-ink
	// pixel in the band and the fringe dragged the mean by 30 to 50 luminance -- enough to make the
	// three-surface row read DARKER than its two-surface parent at 192 px, which is the opposite of
	// what the drawing does. A pixel is counted only if neither it nor any of its eight neighbors is
	// ink, so what is averaged is surface that owns its whole pixel.
	function isInk(x, y) { var L = lum(img, x, y); return L !== null && Math.abs(L - ink) <= 30; }
	function touchesInk(x, y) {
		for (var dy = -1; dy <= 1; dy++) { for (var dx = -1; dx <= 1; dx++) { if (isInk(x + dx, y + dy)) { return true; } } }
		return false;
	}
	function band(b) {
		// Every pixel whose CENTER falls in the band, split into outline and fill. A pixel within 30
		// of the ink is outline; everything else is the surface showing through. `frac` is how much
		// of the surface is fill at this size, and it is the number that decides whether a lighting
		// treatment has anything to act on at all.
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
		roofFill: roof.frac, bowlFill: bowl.frac, roofPx: roof.n,
		roofVsCyl: d(roof, cyl), roofVsSky: d(roof, sky), bowlVsCyl: d(bowl, cyl)
	};
}

/**
 * Does the cylinder shading SURVIVE at this size, and what does it buy?
 *
 * Sampled on one raster row at the tank's mid height (y = 11 units), across the whole icon; ink is
 * |luminance - paper|, and every number below is read against the darkest pixel on that row.
 *
 * THE FIRST METRIC WRITTEN HERE MEASURED THE WRONG THING and is recorded so it is not re-tried: it
 * looked for ink strictly BETWEEN the two ink runs, on the assumption that a surviving hatch is a
 * third run. It is not. At 32 px the hatch at x = 13.5 renders at half ink and touches the right
 * wall, so it joins that run and the between-runs gap is bare paper -- the metric read 0 for a
 * shading that is plainly there in the pixels. What a stroke-only cylinder actually produces is a
 * TONAL STEP on the shadow limb, so that is what is counted now.
 *   grade -- columns whose ink is intermediate, 0.15 to 0.70 of the row's darkest. A bare tank has
 *            none: both walls saturate. Each one is a pixel of genuine mid-tone, which is the whole
 *            of what a pseudo-gradient can be in one ink. 1 or more at 17 px is the pass.
 *   mass  -- right ink run width minus left, in pixels. What a varied-weight row buys instead of a
 *            mid-tone: the limb is not shaded, it is heavier.
 *   runs  -- separate ink runs on the row. 2 is the normal reading; 3 means a hatch stayed clear of
 *            its wall, which needs more room than a menu icon has.
 */
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

// --------------------------------------------------------------------------------------------
/**
 * DO THE DESCENDERS REACH THE BOTTOM ROW OF THE RASTER?
 *
 * This is the round-3 fix measured in the PNGs rather than in the vector, which is what Tom asked
 * for. The bottom row of pixels is sampled at each of the three descender columns -- left leg,
 * riser, right leg -- and compared with the GROUND at the same row, read at x = 0 (sky on a color
 * row, paper on a mono one). A descender that stops short leaves ground at its own column, so its
 * delta is ~0; one that reaches the edge is drawn there and its delta is the stroke's own contrast.
 * `min` is the weakest of the three, and it is the number that decides.
 */
function descenderFeet(file, geo, px, scale) {
	var img = readPNG(file), sc = scale || 1, k = px / 24, y = px - 1;
	var ground = lum(img, 0, y), out = [];
	for (var i = 0; i < geo.feet.length; i++) {
		var col = Math.round((12 + (geo.feet[i] - 12) * sc) * k);
		col = Math.min(px - 1, Math.max(0, col));
		var L = lum(img, col, y);
		out.push(Math.round(Math.abs(L - ground) * 10) / 10);
	}
	// And on the same row, how many SEPARATE descenders are there? Round 2 filed his own WT-TALL-3
	// aspect MENU ONLY on the belief that its two legs and its riser fuse at 16 px. They are three
	// runs on the bottom row, so that belief is measured false; see the row's own note.
	var runs = 0, inRun = false;
	for (var x = 0; x < px; x++) {
		var d = Math.abs(lum(img, x, y) - ground);
		if (d >= 26) { if (!inRun) { runs++; inRun = true; } } else { inRun = false; }
	}
	return { at: out, min: Math.min.apply(null, out), runs: runs, ok: Math.min.apply(null, out) >= 26 };
}

// --------------------------------------------------------------------------------------------
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function sheet(meas, feet, mono, tones) {
	var CSS = 'body{margin:24px;font:14px/1.55 system-ui,sans-serif;color:#111;background:#fff;max-width:1440px}'
		+ 'h1{font-size:20px}h2{font-size:16px;margin-top:30px}code{font:12px ui-monospace,monospace;background:#f0f0f0;padding:1px 3px}'
		+ '.note{color:#333;max-width:78ch}table{border-collapse:collapse;width:100%;margin-top:10px}'
		+ 'th,td{border-top:1px solid #ddd;padding:10px 6px;vertical-align:top;text-align:left}'
		+ 'th{font-size:12px;color:#555;border-top:0}'
		+ 'td.n{width:190px}td.n b{display:block;font:12px ui-monospace,monospace}td.n span{color:#555;font-size:12px}'
		+ '.lt{background:#fff;padding:7px;border:1px solid #ddd;display:inline-block;line-height:0}'
		+ '.dk{background:#1e1e1e;padding:7px;border:1px solid #333;display:inline-block;line-height:0}'
		+ '.strip{display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap}.strip img{display:inline-block;margin-right:6px;vertical-align:bottom}'
		+ 'td.f{font-size:12.5px;color:#222;max-width:40ch}td.f i{color:#555}'
		+ '.v{font:11px ui-monospace,monospace;padding:1px 5px;border-radius:3px;white-space:nowrap}'
		+ '.v.favicon{background:#dff0d8;color:#2a5d1e}.v.menu{background:#fdf3d0;color:#6b5300}.v.record{background:#f3d9d9;color:#7a2020}.v.pick{background:#cfe8c6;color:#1e4a14;font-weight:700}'
		+ '.m{font:11.5px ui-monospace,monospace;border-collapse:collapse;margin-top:6px}'
		+ '.m td,.m th{border:1px solid #ddd;padding:2px 5px;text-align:right}.m th{color:#555}'
		+ '.no{color:#a11}.yes{color:#2a5d1e}tr.cur{background:#fffbe6}ul.note li{margin:5px 0}'
		+ '.big{margin:10px 0 0;display:flex;align-items:flex-start;gap:8px}'
		+ '.big em{font-size:11px;color:#666;font-style:normal;align-self:flex-end}'
		+ 'img.z{image-rendering:pixelated;margin-right:6px}'
		+ '.mine{background:#eef4ff;border-left:3px solid #6b8fd6;padding:2px 6px}';
	function png(c, px, g, shown) {
		return '<img src="render/color/' + c.id.replace(/[^a-z0-9-]/gi, '_') + '@' + px + '-' + g + '.png" width="'
			+ (shown || px) + '" height="' + (shown || px) + '" alt="' + px + ' px">';
	}
	function strip(c, g) {
		return '<span class="' + g + '">' + [16, 32, 48].map(function (p) { return png(c, p, g); }).join('') + '</span>';
	}
	function bigs(c) {
		return '<div class="big"><span class="lt">' + png(c, 192, 'lt') + '</span><span class="dk">' + png(c, 192, 'dk') + '</span>'
			+ '<span class="lt">' + png(c, 512, 'lt', 256) + '</span><em>512, shown at 256</em></div>';
	}
	function mtable(c) {
		var m = meas[c.id], f = feet[c.id];
		if (!m) { return ''; }
		return '<table class="m"><tr><th>px</th>' + SIZES.map(function (p) { return '<th>' + p + '</th>'; }).join('') + '</tr>'
			+ '<tr><th>catwalk &Delta;L</th>' + SIZES.map(function (p) {
				var r = m[p];
				return '<td class="' + (r && r.ok ? 'yes' : 'no') + '">' + (r ? r.delta : '-') + '</td>';
			}).join('') + '</tr>'
			+ '<tr><th>feet &Delta;L (min)</th>' + SIZES.map(function (p) {
				var r = f && f[p];
				return '<td class="' + (r && r.ok ? 'yes' : 'no') + '">' + (r ? r.min : '-') + '</td>';
			}).join('') + '</tr>'
			+ '<tr><th>descenders apart</th>' + SIZES.map(function (p) {
				var r = f && f[p];
				return '<td class="' + (r && r.runs >= 3 ? 'yes' : 'no') + '">' + (r ? r.runs : '-') + '</td>';
			}).join('') + '</tr></table>' + ttable(c);
	}
	// The three-surface measurement. Printed on every row that HAS a cone -- the two-surface parents
	// included, because the question this round answers is what the treatment buys OVER them, and a
	// column where the two rows print the same number is a size at which it buys nothing.
	function ttable(c) {
		var t = tones[c.id];
		if (!t || !SIZES.some(function (p) { return t[p]; })) { return ''; }
		function line(label, key, thr) {
			return '<tr><th>' + label + '</th>' + SIZES.map(function (p) {
				var r = t[p], v = r ? r[key] : null;
				// null is not a small number: it means the band held no fill pixel at all at this
				// size, which is the surface having been eaten by its own outline.
				return '<td class="' + (v !== null && v >= thr ? 'yes' : 'no') + '">' + (v === null ? 'none' : v) + '</td>';
			}).join('') + '</tr>';
		}
		return '<table class="m"><tr><th>px</th>' + SIZES.map(function (p) { return '<th>' + p + '</th>'; }).join('') + '</tr>'
			+ line('roof v wall &Delta;L', 'roofVsCyl', 26)
			+ line('roof v sky &Delta;L', 'roofVsSky', 26)
			+ line('bowl v wall &Delta;L', 'bowlVsCyl', 26)
			+ line('roof fill %', 'roofFill', 1)
			+ '</table>';
	}
	function monoTable(c) {
		var m = mono[c.id];
		if (!m) { return ''; }
		return '<table class="m"><tr><th>px</th>' + MSIZES.map(function (p) { return '<th>' + p + '</th>'; }).join('') + '</tr>'
			+ '<tr><th>ink runs</th>' + MSIZES.map(function (p) {
				var r = m[p] && m[p].lt;
				return '<td>' + (r ? r.runs : '-') + '</td>';
			}).join('') + '</tr>'
			+ '<tr><th>net grade (lt)</th>' + MSIZES.map(function (p) {
				var r = m[p] && m[p].lt;
				return '<td class="' + (r && r.net >= 1 ? 'yes' : 'no') + '">' + (r ? (r.net > 0 ? '+' : '') + r.net : '-') + '</td>';
			}).join('') + '</tr>'
			+ '<tr><th>net grade (dk)</th>' + MSIZES.map(function (p) {
				var r = m[p] && m[p].dk;
				return '<td class="' + (r && r.net >= 1 ? 'yes' : 'no') + '">' + (r ? (r.net > 0 ? '+' : '') + r.net : '-') + '</td>';
			}).join('') + '</tr>'
			+ '<tr><th>mass px</th>' + MSIZES.map(function (p) {
				var r = m[p] && m[p].lt;
				return '<td>' + (r ? r.mass : '-') + '</td>';
			}).join('') + '</tr>'
			+ '<tr><th>feet &Delta;L</th>' + MSIZES.map(function (p) {
				var r = m[p] && m[p].feet;
				return '<td class="' + (r && r.ok ? 'yes' : 'no') + '">' + (r ? r.min : '-') + '</td>';
			}).join('') + '</tr></table>';
	}
	function monoRow(c) {
		function mpng(px, g) {
			return '<img src="render/color/' + c.id + '@' + px + '-' + g + '.png" width="' + px + '" height="' + px + '" alt="' + px + ' px">';
		}
		function mstrip(g) {
			return '<span class="' + g + '">' + MSIZES.map(function (p) { return mpng(p, g); }).join('') + '</span>';
		}
		function zoom(g) {
			return '<span class="' + g + '">' + MSIZES.map(function (p) {
				return '<img class="z" src="render/color/' + c.id + '@' + p + '-' + g + '.png" width="' + (p * 6)
					+ '" height="' + (p * 6) + '" alt="' + p + ' px at 6x">';
			}).join('') + '</span>';
		}
		return '<tr><td class="n"><b>' + esc(c.id) + '</b><span>' + esc(c.title) + '</span></td>'
			+ '<td><div class="strip">' + mstrip('lt') + mstrip('dk') + '</div>'
			+ '<div class="big">' + zoom('lt') + '</div><div class="big">' + zoom('dk') + '</div></td>'
			+ '<td class="f"><b class="v ' + c.verdict.split(' ')[0].toLowerCase() + '">' + esc(c.verdict) + '</b> '
			+ esc(c.ask) + (c.why ? ' <i>' + esc(c.why) + '</i>' : '') + monoTable(c) + '</td></tr>';
	}
	function row(c, cur) {
		return '<tr' + (cur ? ' class="cur"' : '') + '><td class="n"><b>' + esc(c.id) + '</b><span>' + esc(c.title) + '</span></td>'
			+ '<td><div class="strip">' + strip(c, 'lt') + strip(c, 'dk') + '</div>' + bigs(c) + '</td>'
			+ '<td class="f"><b class="v ' + c.verdict.split(' ')[0].toLowerCase() + '">' + esc(c.verdict) + '</b> '
			+ esc(c.ask) + (c.why ? ' <i>' + esc(c.why) + '</i>' : '') + mtable(c) + '</td></tr>';
	}
	var ALL = [SHIPPED].concat(C);
	return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Water tower in color, round 3</title>'
		+ '<style>' + CSS + '</style></head><body>\n'
		+ '<h1>Water-tower brand mark in color, round 3 (2026-09-09, revised 2026-09-10)</h1>\n'
		+ '<p class="note"><b>What changed in round 3c.</b> Four new rows carrying <code>-3surf-</code> in their names light the tower as THREE surfaces instead of one, which is Tom\'s lighting note of 2026-09-10. '
		+ 'They sit BESIDE <code>ic-tall3-steel-overcast</code> and <code>ic-tall3-steel-sky</code>, which are unchanged: he is choosing between those two, and a three-surface tower is another candidate rather than a correction to them. See the section below.</p>\n'
		+ '<p class="note"><b>What changed on 2026-09-10.</b> The descenders were truncated on every row and now reach the bottom edge, which is the first bullet below and which moved two verdicts. '
		+ 'The three fitted-tower rows were renamed <code>ic-tall3fit-*</code> to <code>ic-wide3fit-*</code> on Tom\'s instruction, because a WT-TALL-3 fitted to a square frame reads WIDE; '
		+ '<code>ic-mask-tall3fit-overcast</code> went with them as <code>ic-mask-wide3fit-overcast</code>, being the same geometry. The <code>ic-tall3-*</code> rows keep their name: they are his own aspect and they really are tall. '
		+ 'And there is a new section at the foot of the page, five MONO menu candidates.</p>\n'
		+ '<p class="note">Round 2 settled the geometry; this sheet answers the color question and the maskable one. '
		+ 'Every path is round 2\'s, unchanged: the only new geometry is a closed body path per tower (round 2\'s own numbers, joined so there is '
		+ 'something to fill) and the W in the one LW row, which no scan of the sketch can supply and which is marked '
		+ '<span class="mine">OURS</span> where it appears. Two other rows are marked the same way, and nothing else on this sheet was invented.</p>\n'
		+ '<p class="note">The pictures are REAL PNGs, rendered through headless Chromium at 16 / 32 / 48 / 192 / 512 px on a white and on a dark page ground, '
		+ 'shown at 1:1 (only the 512 is scaled down, to 256, so a row fits on a screen). The &Delta;L table under each verdict is the measurement described below.</p>\n'
		+ '<h2>The catwalk\'s middle, measured</h2>\n'
		+ '<p class="note">Tom predicted the color tweak is <i>lossy in the raster respect because the catwalk loses its middle</i>. '
		+ 'The catwalk is a bar crossing the tank, so its middle exists exactly when the pixels ON the bar differ from the body pixels just above and below. '
		+ 'Each PNG is decoded and sampled on a column INSIDE the tank (the center for the tall towers; x = 17 for WT-WIDE, whose crown carries the letter): '
		+ '&Delta;L is the luminance difference (0-255) between the strongest row within half a stroke '
		+ 'of the bar and the mean of the body rows 2 units either side. <b>Green is &Delta;L &ge; 26</b>, a tenth of the range, which is about where a difference '
		+ 'stops being findable on a screen at arm\'s length. Red is a bar with no middle.</p>\n'
		+ '<h2>The three surfaces, measured (round 3c)</h2>\n'
		+ '<p class="note">Tom, 2026-09-10, with two sketches: <i>"the gradient can\'t really continue to the top of the tank ... we may want to make the entire roof lighter (in the sun). Also, I suppose that the underside is darker."</i> '
		+ 'He is right, and it is a fact about surfaces rather than a preference: a cylinder wall photographs as a left-right band, a CONE does not, and the bowl underneath faces the ground. '
		+ 'The four <code>-3surf-</code> rows stop the wall\'s ramp at the springline and give the cone and the bowl their own; <b>the wall\'s band is untouched</b>, and so is every row above them.</p>\n'
		+ '<p class="note">He also asked the right question about it -- <i>"It may be pointless for our purposes"</i> -- so each of those rows carries a second table. Four bands of pixels are read on the same four center columns, one per surface plus the sky above the apex, '
		+ 'and a pixel counts only if neither it nor any of its eight neighbours is ink: an antialiased edge pixel is not the surface, and averaging it in was enough to make the three-surface row read DARKER than its parent at 192 px. '
		+ '<b>roof fill %</b> is how much of the roof band is clean fill at that size, and <code>none</code> on a &Delta;L row means there was no such pixel at all.</p>\n'
		+ '<h2>What the rasters said</h2>\n'
		+ '<ul class="note"><li><b>The catwalk answer, and it is not the one he expected.</b> On the solid-blue rows the middle is gone at EVERY size, 512 included, '
		+ 'not just in the raster: a bar the same color as the body it crosses has nothing to be seen against. It is a color decision rather than a resolution one, '
		+ 'so a bigger icon does not fix it and only a second color does (the knockout row).</li>'
		+ '<li><b>On every silver-on-sky row the catwalk keeps its middle at all five sizes</b>, because the bar is ink and the body is silver. '
		+ 'The 16 px number is a third of the 32 px one, which is antialiasing thinning a 1.3 px bar, but it stays well over the threshold.</li>'
		+ '<li><b>The gradient is safe.</b> The flat-silver controls are not better at 16 px in any measurable way and not visibly better either; '
		+ 'the gradient starts paying from 32 up. Choose it on taste, not on legibility.</li>'
		+ '<li><b>THE DESCENDERS WERE TRUNCATED, AND THAT IS FIXED.</b> Every leg and riser stopped at y 21.4 or 22.4 inside a 24-unit frame, so the tower hung in mid-air with two units of empty ground beneath it. '
		+ 'It was the drawing, not the viewBox and not the fit. Measured in the PNGs at the three descender columns on the BOTTOM ROW of each raster, on <code>ic-tall3-steel-overcast</code>: '
		+ '&Delta;L against the sky was <b>0 / 0.7 / 0 / 0 / 0</b> at 16 / 32 / 48 / 192 / 512 before, and <b>69 / 177 / 190 / 190 / 190</b> after. Every row now carries that number.</li>'
		+ '<li><b>His own WT-TALL-3 aspect is FAVICON, and the earlier reading was wrong.</b> It was filed MENU ONLY because the two legs and the riser were said to fall inside three pixel columns and fuse. '
		+ 'They are 4 units apart, and the bottom row of the 16 px raster holds THREE separate runs with pure sky between them. What the old reading was looking at was a bottom row that was sky from side to side, '
		+ 'because the legs stopped short of it.</li>'
		+ '<li><b>On the sink reading, the ground and the fill do the work, not the outline.</b> The same WT-WIDE paths, silver on sky, read as a vessel outdoors; '
		+ 'nothing was redrawn.</li>'
		+ '<li><b>ROUND 3c: THE ROOF AND THE UNDERSIDE DIE AT DIFFERENT SIZES, and that is the finding.</b> '
		+ 'The <b>underside</b> works from 32 px up on both aspects and at 16 px on the fitted one: bowl against wall 68.8 / 66.5 / 72.2 / 72.8 at 32 / 48 / 192 / 512 on <code>ic-tall3-3surf-overcast</code>, against 10.1 / 9.9 / 1.9 / 1.4 for its two-surface parent, which is a parent with no underside at all. '
		+ 'The <b>roof</b> on his own aspect needs 192: the cone is 1.5 units deep and the outline stroke is 2 units wide, so at 16, 32 and 48 px there is not one pixel of roof fill clear of ink, and roof against wall is 26.4 at 192 and 42.2 at 512 against 9.7 and 8.5. '
		+ 'On the FITTED aspect the cone is 2 units deep and the roof reads from 32 (16.4 / 14.3 / 35.6 / 40.7 against 5.8 / 2.0 / 0.6 / 0.2).</li>'
		+ '<li><b>The silhouette worry did not happen: a sunlit roof is LIGHTER than the sky, not nearer it.</b> Roof against sky rises rather than falls -- 50.3 at 192 and 67.0 at 512 on the plain-sky row against 33.6 and 33.4 for its parent, and 28.9 / 45.5 against 12.2 / 11.9 on the overcast one, whose sky is the lighter of the two. '
		+ 'Below 192 the ink outline is holding the silhouette by itself in every row on this sheet anyway.</li>'
		+ '<li><b>The one thing a dark underside costs, and it is a probe artifact more than a loss.</b> The catwalk number falls on the 3surf rows (55.1 to 30.5 on his aspect at 16 px; 58.6 to 23.0 on the fitted one) because that measurement compares the bar with the MEAN of the body 2 units above and below it, and below it is now the dark bowl. '
		+ 'At 16 px those two samples are one pixel apart, so on the fitted row the "above" sample lands on the bar itself. Read directly, the bar is still 46 luminance from the bowl beneath it at 16 px. '
		+ 'The metric is left exactly as it was, because every other row\'s verdict was set with it; <code>ic-tall3-3surf-lift-overcast</code> is the drawing-side answer, darkening the bowl DOWNWARD from the bowl line, which is the same top-lit scene rather than a second light.</li>'
		+ '<li><b>For the maskable pair we would put forward <code>ic-mask-wide3fit-overcast</code>:</b> it needs only 0.80 rather than 0.74, '
		+ 'its ground is the cloudy sky he asked for, and it is the one candidate whose catwalk still has a middle after the crop.</li></ul>\n'
		+ '<table><thead><tr><th>Concept</th><th>16 / 32 / 48 at 1:1 on light then dark, then 192 at 1:1 on both and 512</th>'
		+ '<th>Verdict, and the catwalk measurement</th></tr></thead><tbody>\n'
		+ row(ALL[0], true) + '\n' + ALL.slice(1).map(function (c) { return row(c); }).join('\n')
		+ '</tbody></table>\n'
		+ '<h2>The mono menu candidates</h2>\n'
		+ '<p class="note">Tom: <i>"It would be extra nice if the mono- menu icon could have a masterful pseudo-gradient touch for the cylinder."</i> '
		+ 'A menu icon is drawn by <code>lib/Icons.lib.php</code> as <code>fill="none" stroke="currentColor"</code> on NO ground, which is what lets the row\'s color drive it and greys it for free when the row is disabled. '
		+ 'So there is no fill to hold a gradient and no way to make anything lighter than the paper: the only move is to ADD ink on the shadow limb and leave the bright band bare, which is engraving. '
		+ 'These five are rendered at <b>16 / 17 / 24 / 32</b> -- the menu bar draws at about 17 px (1.05em) -- in one ink, on a light page and on a dark one, because a menu row is either. '
		+ '<b>Nothing here is deployed.</b> <code>wt-wide-L</code> stays the shipped menu icon.</p>\n'
		+ '<p class="note">The tank of WT-TALL-3 has a clear interior of six units, which is <b>4.2 pixels at 17 px</b>, and everything a shading trick does has to happen inside them. '
		+ 'One raster row at the tank\'s mid height is decoded and read across: <b>runs</b> is the number of separate ink runs on it (2 is a bare tank, so 3 or more means something inside is still separate from both walls); '
		+ '<b>net grade</b> is the number of columns at an INTERMEDIATE ink, 0.15 to 0.70 of the row\'s darkest, MINUS the control\'s count at the same size -- a mid-tone pixel is the whole of what a pseudo-gradient can be in one ink, and the control is subtracted because a bare 2-unit wall on 1.4 pixels already makes two of them by antialiasing alone; '
		+ '<b>mass</b> is the right ink run\'s width minus the left\'s, in pixels, which is what a varied-weight row buys instead of a mid-tone. <b>feet &Delta;L</b> is the descender measurement again.</p>\n'
		+ '<table><thead><tr><th>Concept</th><th>16 / 17 / 24 / 32 at 1:1, light then dark</th><th>Verdict, and the cylinder measurement</th></tr></thead><tbody>\n'
		+ M.map(function (c) { return monoRow(c); }).join('\n')
		+ '</tbody></table>\n<p class="note">Verdicts read the same as round 2: <b>FAVICON</b> holds at 16 px, <b>MENU ONLY</b> is a real drawing that needs 32, '
		+ '<b>RECORD ONLY</b> is kept because it is on the record, not because anything would ship it. '
		+ 'The mono section uses its own two: <b>PICK</b> is the row to put in front of PCW and MAH, <b>MENU OK</b> is a drawing that works and buys less.</p>\n'
		+ '</body></html>\n';
}

// --------------------------------------------------------------------------------------------
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

(async function main() {
	if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }
	var exe = findChromium();
	if (!exe) { throw new Error('No Chromium found; set CHROME_PATH or npx playwright install chromium'); }
	var pw = require(path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'));
	var browser = await pw.chromium.launch({ executablePath: exe });
	var meas = {}, feet = {}, mono = {}, tones = {};
	var ALL = [SHIPPED].concat(C);
	var gks = Object.keys(GROUNDS);
	for (var i = 0; i < ALL.length; i++) {
		var c = ALL[i], safe = c.id.replace(/[^a-z0-9-]/gi, '_');
		meas[c.id] = {}; feet[c.id] = {}; tones[c.id] = {};
		for (var gi = 0; gi < gks.length; gi++) {
			var gk = gks[gi];
			var page = await browser.newPage({ viewport: { width: 700, height: 700 }, deviceScaleFactor: 1 });
			for (var si = 0; si < SIZES.length; si++) {
				var px = SIZES[si];
				await page.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
					+ 'html,body{margin:0;padding:0;background:' + GROUNDS[gk] + '}#t{width:' + px + 'px;height:' + px + 'px;line-height:0}'
					+ '</style></head><body><div id="t"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + px
					+ '" height="' + px + '">' + ((gk === 'dk' && c.svgDk) ? c.svgDk : c.svg) + '</svg></div></body></html>');
				var file = path.join(OUT, safe + '@' + px + '-' + gk + '.png');
				await (await page.$('#t')).screenshot({ path: file });
				if (gk === 'lt') {
					try { meas[c.id][px] = catwalkMiddle(file, c.geo, px, c.o && c.o.scale); }
					catch (e) { meas[c.id][px] = null; }
					try { feet[c.id][px] = descenderFeet(file, c.geo, px, c.o && c.o.scale); }
					catch (e2) { feet[c.id][px] = null; }
					try { tones[c.id][px] = surfaceTones(file, c.geo, px, c.o && c.o.scale); }
					catch (e5) { tones[c.id][px] = null; }
				}
			}
			await page.close();
		}
	}
	// The mono menu candidates, at the four sizes a menu row and a favicon actually use, on a light
	// page and on a dark one -- a menu row is either, and the glyph is currentColor, so the SAME
	// drawing has to work in both inks.
	for (var mi = 0; mi < M.length; mi++) {
		var mc = M[mi], msafe = mc.id;
		mono[mc.id] = {};
		for (var mg = 0; mg < gks.length; mg++) {
			var mgk = gks[mg];
			var mpage = await browser.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: 1 });
			for (var ms = 0; ms < MSIZES.length; ms++) {
				var mpx = MSIZES[ms];
				await mpage.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
					+ 'html,body{margin:0;padding:0;background:' + GROUNDS[mgk] + '}#t{width:' + mpx + 'px;height:' + mpx + 'px;line-height:0}'
					+ '</style></head><body><div id="t"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + mpx
					+ '" height="' + mpx + '">' + (mgk === 'dk' ? mc.svgDk : mc.svg) + '</svg></div></body></html>');
				var mfile = path.join(OUT, msafe + '@' + mpx + '-' + mgk + '.png');
				await (await mpage.$('#t')).screenshot({ path: mfile });
				if (!mono[mc.id][mpx]) { mono[mc.id][mpx] = {}; }
				try { mono[mc.id][mpx][mgk] = cylinderProfile(mfile, mgk); } catch (e3) { mono[mc.id][mpx][mgk] = null; }
				if (mgk === 'lt') {
					try { mono[mc.id][mpx].feet = descenderFeet(mfile, TALL3, mpx, 1); } catch (e4) { mono[mc.id][mpx].feet = null; }
				}
			}
			await mpage.close();
		}
	}

	// GRADE IS ONLY MEANINGFUL AGAINST THE CONTROL. A bare tank already produces intermediate
	// columns at 16 and 17 px, because a 2-unit wall lands on 1.4 pixels and the rasterizer puts the
	// remainder somewhere: ic-mono-plain scores 2 at both. So each row also carries `net`, its grade
	// minus the control's at the same size, which is the mid-tone the SHADING actually bought.
	var base = mono['ic-mono-plain'];
	for (var bi = 0; bi < M.length; bi++) {
		var bid = M[bi].id;
		for (var bs = 0; bs < MSIZES.length; bs++) {
			var bpx = MSIZES[bs];
			['lt', 'dk'].forEach(function (g) {
				var r = mono[bid][bpx][g], b0 = base[bpx][g];
				if (r && b0) { r.net = r.grade - b0.grade; }
			});
		}
	}

	// The two contact sheets, in round 2's shape: an overview at the sizes that matter, and a
	// nearest-neighbor blow-up of the 16 and 32 px rasters, which is where a verdict is decided.
	var ALLIDS = ALL.map(function (c) { return { id: c.id, safe: c.id.replace(/[^a-z0-9-]/gi, '_'), verdict: c.verdict }; });
	function contact(file, sizes, zoom, gk) {
		var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
			+ 'body{margin:10px;background:#999;font:11px ui-monospace,monospace;color:#000}'
			+ '.r{display:flex;align-items:center;margin:5px 0;gap:8px}.l{width:230px}'
			+ 'img{image-rendering:pixelated;background:' + GROUNDS[gk] + ';border:1px solid #555}'
			+ '</style></head><body>'
			+ ALLIDS.map(function (c) {
				return '<div class="r"><span class="l">' + esc(c.id) + '<br><i>' + esc(c.verdict) + '</i></span>'
					+ sizes.map(function (p) {
						return '<img src="' + c.safe + '@' + p + '-' + gk + '.png" width="' + (p * zoom) + '" height="' + (p * zoom) + '">';
					}).join('') + '</div>';
			}).join('') + '</body></html>';
		fs.writeFileSync(path.join(OUT, file + '.html'), html);
	}
	contact('sheet-color', [16, 32, 48], 1, 'lt');
	contact('blowup-color', [16, 32], 6, 'lt');
	contact('blowup-color-dk', [16, 32], 6, 'dk');
	var shot = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
	for (var ci = 0; ci < 3; ci++) {
		var nm = ['sheet-color', 'blowup-color', 'blowup-color-dk'][ci];
		await shot.goto('file://' + path.join(OUT, nm + '.html'));
		await shot.screenshot({ path: path.join(OUT, nm + '.png'), fullPage: true });
	}
	await shot.close();
	await browser.close();
	fs.writeFileSync(path.join(here, 'concepts-2026-09-09-color.html'), sheet(meas, feet, mono, tones));
	fs.writeFileSync(path.join(OUT, 'catwalk-measurements.json'),
		JSON.stringify({ catwalk: meas, descenders: feet, mono: mono, tones: tones }, null, '\t') + '\n');
	console.log(C.length + ' color concepts and ' + M.length + ' mono menu candidates written; ' + (ALL.length * SIZES.length * 2 + M.length * MSIZES.length * 2) + ' PNGs rendered;'
		+ ' concepts-2026-09-09-color.html regenerated');
	ALL.forEach(function (c) {
		console.log('  ' + c.id + '  ' + SIZES.map(function (p) {
			var r = meas[c.id][p]; return p + ':' + (r ? (r.delta + (r.ok ? '' : '*')) : '-');
		}).join('  '));
	});
})().catch(function (e) { console.error(e); process.exit(1); });
