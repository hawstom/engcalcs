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
// column the catwalk measurement samples on; foot is the radius of the farthest drawn point from
// the frame center, which is what sets a maskable scale.
var TALL3 = {
	body: 'M7.95 3.7L12 2.2L16.05 3.7V14.15C16.05 16.36 14.24 18.15 12 18.15C9.76 18.15 7.95 16.36 7.95 14.15Z',
	strokes: '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
		+ '<path d="M7.95 3.7V21.4M16.05 3.7V21.4"/>'
		+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"/>'
		+ '<path d="M7.1 13.55H16.9"/>'
		+ '<path d="M12 18.15V21.4"/>',
	catwalk: 13.55, probeX: 12, foot: 11.96
};
var TALL3FIT = {
	body: 'M4.6 4L12 2L19.4 4V14C19.4 16.32 16.09 18.2 12 18.2C7.91 18.2 4.6 16.32 4.6 14Z',
	strokes: '<path d="M4.6 4L12 2L19.4 4"/>'
		+ '<path d="M4.6 4V21.4M19.4 4V21.4"/>'
		+ '<path d="M4.6 14C4.6 16.32 7.91 18.2 12 18.2C16.09 18.2 19.4 16.32 19.4 14"/>'
		+ '<path d="M2.8 13.4H21.2"/>'
		+ '<path stroke-width="3.2" stroke-linecap="butt" d="M12 18.2V22.4"/>',
	catwalk: 13.4, probeX: 12, foot: 11.96
};
// WT-WIDE's crown carries the black letter, which is exactly where the center column would look for
// a body baseline, so this one is sampled at x = 17: inside the tank at the catwalk and inside the
// bowl two units below it.
var WIDE = {
	body: 'M3.1 6.05C3.1 3.75 5.8 2.4 12 2.4C18.2 2.4 20.9 3.75 20.9 6.05V9.85'
		+ 'C20.9 12.58 16.92 14.8 12 14.8C7.08 14.8 3.1 12.58 3.1 9.85Z',
	strokes: '<path d="M3.1 6.05C3.1 3.75 5.8 2.4 12 2.4C18.2 2.4 20.9 3.75 20.9 6.05"/>'
		+ '<path d="M3.1 6.05V21.4M20.9 6.05V21.4"/>'
		+ '<path d="M3.1 9.85C3.1 12.58 7.08 14.8 12 14.8C16.92 14.8 20.9 12.58 20.9 9.85"/>'
		+ '<path d="M2.2 9.85H21.8"/>'
		+ '<path stroke-width="3.2" stroke-linecap="butt" d="M12 14.8V22.4"/>',
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
var FLAT_SILVER = '#b3b9bf';
var INK = '#232a30';
var SKY_LIGHT = '#cfe6f7';
var BLUE = '#1c62b9';

function defs(id, kind, ground) {
	var s = '';
	if (kind === 'steel') {
		s += '<linearGradient id="g' + id + '" x1="0" y1="0" x2="1" y2="0">'
			+ STEEL.map(function (p) { return '<stop offset="' + p[0] + '" stop-color="' + p[1] + '"/>'; }).join('')
			+ '</linearGradient>';
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

/**
 * One concept's SVG body (everything inside the <svg>), at the 24-unit frame.
 * o: {geo, fill:'steel'|flat color, stroke, ground, letter, scale, walkKnockout}
 */
function draw(id, o) {
	var g = o.geo;
	var fill = o.fill === 'steel' ? 'url(#g' + id + ')' : o.fill;
	var inner = '<path d="' + g.body + '" fill="' + fill + '"/>'
		+ '<g fill="none" stroke="' + o.stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
		+ g.strokes + (o.letter || '') + '</g>';
	if (o.walkKnockout) {
		// OURS, offered as the repair for the very thing Tom predicted: the catwalk redrawn in the
		// ground color where it crosses the body, so the bar keeps a middle inside a solid fill.
		inner += '<g fill="none" stroke="' + o.walkKnockout + '" stroke-width="1.1" stroke-linecap="butt">'
			+ '<path d="M' + (o.walkIn[0]) + ' ' + g.catwalk + 'H' + (o.walkIn[1]) + '"/></g>';
	}
	if (o.scale && o.scale !== 1) {
		inner = '<g transform="translate(12 12) scale(' + o.scale + ') translate(-12 -12)">' + inner + '</g>';
	}
	return defs(id, o.fill === 'steel' ? 'steel' : '', o.ground) + groundEl(id, o.ground) + inner;
}

// --------------------------------------------------------------------------------------------
// The concepts. `verdict` is set from the rendered PNGs, never from the 512.
var C = [];
function add(c) { c.svg = draw(c.id, c.o); c.geo = c.o.geo; C.push(c); }

add({ id: 'ic-tall3fit-steel-sky', title: 'wt-tall-3-fit, galvanized gradient, plain sky',
	ask: 'His main ask: wt-tall-3 in silver with a cylinder lighting gradient on a sky-blue ground. Fitted aspect, which round 2 measured as the only tall variant that survives 16 px.',
	why: 'Holds at 16: tank, catwalk, two legs and the riser all still separate. The catwalk keeps its middle at every size (dL 59 at 16, 162 at 32), because the bar is ink and the body is silver, so nothing about it depends on resolution. The gradient survives too -- the bright band is still 2 pixel columns at 16.',
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: 'steel', stroke: INK, ground: 'sky' } });

add({ id: 'ic-tall3fit-steel-overcast', title: 'wt-tall-3-fit, galvanized gradient, overcast sky',
	ask: 'The same with the wispy/overcast treatment he raised twice as a contrast aid. Three blurred white bands, deliberately low contrast.',
	why: "Same reading as the plain sky at every size. The wisps cost nothing at 16 (they are below the tank's own contrast) and are the row to prefer if the ground has to work as a maskable background as well.",
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: 'steel', stroke: INK, ground: 'overcast' } });

add({ id: 'ic-tall3fit-silver-flat', title: 'wt-tall-3-fit, FLAT silver, plain sky (control)',
	ask: 'The control for the gradient. A gradient that survives 512 and dies at 32 is worth knowing about before anybody falls in love with it.',
	why: "Holds at 16, and this is the control's answer: the flat fill is not worse at 16 -- it is very slightly BETTER separated from the sky, because the gradient's dark left limb sits nearer the sky's own value. The gradient buys a real cylinder from 32 up and costs nothing below it, so it is a taste question rather than a legibility one.",
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: FLAT_SILVER, stroke: INK, ground: 'sky' } });

add({ id: 'ic-tall3-steel-sky', title: 'wt-tall-3 as he drew it, galvanized gradient, plain sky',
	ask: 'His own aspect, 9.8 units wide. Round 2 filed this RECORD ONLY in monochrome; color is the question of whether a filled body rescues it.',
	why: "His aspect is 9.8 units wide, and color does not buy that back: at 16 px the two legs and the riser are inside 3 pixel columns and fuse into a block, exactly as round 2 measured in monochrome. The tank itself reads from 32. Better than round 2's RECORD ONLY, because the filled body gives the silhouette something to be.",
	verdict: 'MENU ONLY',
	o: { geo: TALL3, fill: 'steel', stroke: INK, ground: 'sky' } });

add({ id: 'ic-tall3-steel-overcast', title: 'wt-tall-3 as he drew it, gradient, overcast sky',
	ask: 'His aspect with the cloud treatment.',
	why: 'As above. The cloud band behind the legs makes the fused block slightly worse at 16, being the one place the ground has structure of its own.',
	verdict: 'MENU ONLY',
	o: { geo: TALL3, fill: 'steel', stroke: INK, ground: 'overcast' } });

add({ id: 'ic-tall3-silver-flat', title: 'wt-tall-3 as he drew it, FLAT silver (control)',
	ask: 'Control for the row above.',
	why: 'As above; the control shows the gradient is not what is costing this variant its 16 px.',
	verdict: 'MENU ONLY',
	o: { geo: TALL3, fill: FLAT_SILVER, stroke: INK, ground: 'sky' } });

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
add({ id: 'ic-mask-tall3fit-overcast', title: 'MASKABLE: wt-tall-3-fit, gradient, overcast, 0.80 scale',
	ask: 'Opaque ground, glyph scaled 0.80 so its farthest point (a leg foot at radius 11.96) lands at 9.57, inside the 9.6 safe circle. Android crops anything outside it.',
	why: 'The maskable candidate. Only 192 and 512 matter here and both are clean; it is on the sheet at 16 as well so the same drawing can be judged as a favicon. At 0.80 the mark loses a fifth of its linear size, which is the price of the safe zone and is why the FITTED tower rather than his own aspect is the one to mask.',
	verdict: 'FAVICON',
	o: { geo: TALL3FIT, fill: 'steel', stroke: INK, ground: 'overcast', scale: 0.80 } });

add({ id: 'ic-mask-wide-L-blue', title: 'MASKABLE: wt-wide-L blue, light sky, 0.74 scale',
	ask: 'The shipped mark made maskable: WT-WIDE reaches radius 12.94 at a leg foot, so it needs 0.74 rather than 0.80.',
	why: 'Needs 0.74, so it loses a quarter of its size, and it carries the catwalk loss of its parent row into the one icon Android will crop as well. Both costs land on the same drawing.',
	verdict: 'MENU ONLY',
	o: { geo: WIDE, fill: BLUE, stroke: BLUE, ground: SKY_LIGHT, letter: L_CROWN.replace('<path', '<path stroke="#000"'), scale: 0.74 } });

// What ships today, for the comparison row: one stroke, transparent ground.
var SHIPPED = { id: 'wt-wide-L (ships today)', title: 'Monochrome stroke, transparent ground',
	ask: 'The mark on both sibling sites right now, and the thing every color row is measured against.',
	why: 'Its interior is empty, so the catwalk has a middle at every size by construction; that is the baseline the filled rows lose.',
	verdict: 'MENU ONLY',
	svg: '<g fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
		+ WIDE.strokes + L_CROWN + '</g>',
	// The shipped mark is a currentColor stroke on a transparent ground, so on a dark ground the
	// REAL one inverts. Drawing the dark strip in #111 would put a black mark on a black page and
	// invite a conclusion about a picture nobody will ever see.
	svgDk: '<g fill="none" stroke="#e8e8e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
		+ WIDE.strokes + L_CROWN + '</g>',
	geo: WIDE, shipped: true };

// --------------------------------------------------------------------------------------------
function svgFile(body) {
	return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"'
		+ ' aria-hidden="true" focusable="false">' + body + '</svg>\n';
}
C.forEach(function (c) { fs.writeFileSync(path.join(here, c.id + '.svg'), svgFile(c.svg)); });

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

// --------------------------------------------------------------------------------------------
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function sheet(meas) {
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
		+ '.v.favicon{background:#dff0d8;color:#2a5d1e}.v.menu{background:#fdf3d0;color:#6b5300}.v.record{background:#f3d9d9;color:#7a2020}'
		+ '.m{font:11.5px ui-monospace,monospace;border-collapse:collapse;margin-top:6px}'
		+ '.m td,.m th{border:1px solid #ddd;padding:2px 5px;text-align:right}.m th{color:#555}'
		+ '.no{color:#a11}.yes{color:#2a5d1e}tr.cur{background:#fffbe6}ul.note li{margin:5px 0}'
		+ '.big{margin:10px 0 0;display:flex;align-items:flex-start;gap:8px}'
		+ '.big em{font-size:11px;color:#666;font-style:normal;align-self:flex-end}'
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
		var m = meas[c.id];
		if (!m) { return ''; }
		return '<table class="m"><tr><th>px</th>' + SIZES.map(function (p) { return '<th>' + p + '</th>'; }).join('') + '</tr>'
			+ '<tr><th>&Delta;L</th>' + SIZES.map(function (p) {
				var r = m[p];
				return '<td class="' + (r && r.ok ? 'yes' : 'no') + '">' + (r ? r.delta : '-') + '</td>';
			}).join('') + '</tr></table>';
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
		+ '<h1>Water-tower brand mark in color, round 3 (2026-09-09)</h1>\n'
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
		+ '<h2>What the rasters said</h2>\n'
		+ '<ul class="note"><li><b>The catwalk answer, and it is not the one he expected.</b> On the solid-blue rows the middle is gone at EVERY size, 512 included, '
		+ 'not just in the raster: a bar the same color as the body it crosses has nothing to be seen against. It is a color decision rather than a resolution one, '
		+ 'so a bigger icon does not fix it and only a second color does (the knockout row).</li>'
		+ '<li><b>On every silver-on-sky row the catwalk keeps its middle at all five sizes</b>, because the bar is ink and the body is silver. '
		+ 'The 16 px number is a third of the 32 px one, which is antialiasing thinning a 1.3 px bar, but it stays well over the threshold.</li>'
		+ '<li><b>The gradient is safe.</b> The flat-silver controls are not better at 16 px in any measurable way and not visibly better either; '
		+ 'the gradient starts paying from 32 up. Choose it on taste, not on legibility.</li>'
		+ '<li><b>His own WT-TALL-3 aspect still costs 16 px</b>, in color as in monochrome: the two legs and the riser fall inside three pixel columns and fuse. '
		+ 'The fitted tower is the one that holds.</li>'
		+ '<li><b>On the sink reading, the ground and the fill do the work, not the outline.</b> The same WT-WIDE paths, silver on sky, read as a vessel outdoors; '
		+ 'nothing was redrawn.</li>'
		+ '<li><b>For the maskable pair we would put forward <code>ic-mask-tall3fit-overcast</code>:</b> it needs only 0.80 rather than 0.74, '
		+ 'its ground is the cloudy sky he asked for, and it is the one candidate whose catwalk still has a middle after the crop.</li></ul>\n'
		+ '<table><thead><tr><th>Concept</th><th>16 / 32 / 48 at 1:1 on light then dark, then 192 at 1:1 on both and 512</th>'
		+ '<th>Verdict, and the catwalk measurement</th></tr></thead><tbody>\n'
		+ row(ALL[0], true) + '\n' + ALL.slice(1).map(function (c) { return row(c); }).join('\n')
		+ '</tbody></table>\n<p class="note">Verdicts read the same as round 2: <b>FAVICON</b> holds at 16 px, <b>MENU ONLY</b> is a real drawing that needs 32, '
		+ '<b>RECORD ONLY</b> is kept because it is on the record, not because anything would ship it.</p>\n'
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
	var meas = {};
	var ALL = [SHIPPED].concat(C);
	var gks = Object.keys(GROUNDS);
	for (var i = 0; i < ALL.length; i++) {
		var c = ALL[i], safe = c.id.replace(/[^a-z0-9-]/gi, '_');
		meas[c.id] = {};
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
				}
			}
			await page.close();
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
	fs.writeFileSync(path.join(here, 'concepts-2026-09-09-color.html'), sheet(meas));
	fs.writeFileSync(path.join(OUT, 'catwalk-measurements.json'), JSON.stringify(meas, null, '\t') + '\n');
	console.log(C.length + ' color concepts written; ' + (ALL.length * SIZES.length * 2) + ' PNGs rendered;'
		+ ' concepts-2026-09-09-color.html regenerated');
	ALL.forEach(function (c) {
		console.log('  ' + c.id + '  ' + SIZES.map(function (p) {
			var r = meas[c.id][p]; return p + ':' + (r ? (r.delta + (r.ok ? '' : '*')) : '-');
		}).join('  '));
	});
})().catch(function (e) { console.error(e); process.exit(1); });
