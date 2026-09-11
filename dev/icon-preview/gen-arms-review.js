#!/usr/bin/env node
/*
 * Ida's review of Tom's "clouds read like arms" complaint on the shipped `water` menu glyph
 * (ROADMAP Task 615 / dev/icon-preview/ship-notes.md addendum). Renders the EXACT path data
 * currently in lib/Icons.lib.php (copied verbatim below, not re-derived) plus three candidate
 * fixes, at real menu sizes, blown up for inspection. Nothing here is shipped; this is a proof
 * sheet only, written to dev/icon-preview/render/arms-review/.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var here = process.cwd();
var OUT = path.join(here, 'render', 'arms-review');
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

var OPEN = 'width="ICSIZE" height="ICSIZE" viewBox="0 0 24 24" fill="none" stroke="ICOLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

// Exact body (roof/wall/bowl/catwalk/riser + wall hatch + belly hatch), copied verbatim from
// lib/Icons.lib.php's 'water' entry, MINUS the two cloud paths at the end -- so the body is
// identical across every candidate below and only the cloud treatment changes.
var BODY = ''
	+ '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
	+ '<path d="M7.95 3.7V24M16.05 3.7V24"/>'
	+ '<path d="M7.95 14.15C7.95 16.36 9.76 18.15 12 18.15C14.24 18.15 16.05 16.36 16.05 14.15"/>'
	+ '<path d="M7.1 13.55H16.9"/>'
	+ '<path d="M12 18.15V24"/>'
	+ '<path stroke-width="0.6" stroke-linecap="butt" d="M9.5 6.2V14.6"/>'
	+ '<path stroke-width="0.75" stroke-linecap="butt" d="M13.5 5.6V15.4"/>'
	+ '<path stroke-width="0.75" stroke-linecap="butt" d="M14.6 6.4V14.6"/>'
	+ '<path stroke-width="0.7" stroke-linecap="butt" d="M9.1 14.5V15.7"/>'
	+ '<path stroke-width="0.8" stroke-linecap="butt" d="M10.5 14.5V16.6"/>'
	+ '<path stroke-width="0.85" stroke-linecap="butt" d="M12 14.5V17.1"/>'
	+ '<path stroke-width="0.8" stroke-linecap="butt" d="M13.5 14.5V16.6"/>'
	+ '<path stroke-width="0.7" stroke-linecap="butt" d="M14.9 14.5V15.7"/>';

// Candidate cloud treatments.
var CLOUDS_SHIPPED = // exact strokes shipped today
	'<path stroke-width="0.6" d="M1 5.5C1.92 4.95 2.38 4.95 3.3 5.5C4.22 4.95 4.68 4.95 5.6 5.5"/>'
	+ '<path stroke-width="0.6" d="M18.4 9C19.32 8.5 19.78 8.5 20.7 9C21.62 8.5 22.08 8.5 23 9"/>';

var CLOUDS_NONE = '';

// Tom's proposal 2: AREA not LINE -- same footprint, drawn as a thin filled lens (a flattened
// almond) instead of an open stroke, so the mark reads as a soft patch of tone rather than a limb
// with a joint. Still one ink, no gradient (a menu icon has none available), but now a SHAPE with
// area rather than a stroke with a path.
var CLOUDS_AREA =
	'<path fill="ICOLOR" stroke="none" d="M1 5.5C1.92 5.05 2.38 5.05 3.3 5.5C4.22 5.05 4.68 5.05 5.6 5.5C4.68 5.85 4.22 5.85 3.3 5.5C2.38 5.85 1.92 5.85 1 5.5Z"/>'
	+ '<path fill="ICOLOR" stroke="none" d="M18.4 9C19.32 8.6 19.78 8.6 20.7 9C21.62 8.6 22.08 8.6 23 9C22.08 9.35 21.62 9.35 20.7 9C19.78 9.35 19.32 9.35 18.4 9Z"/>';

// Third option: raise both clouds to the SAME height, well clear of the roof/wall shoulder
// (y=3.7) and pulled away from the wall itself, shortened so they read as a mark ABOVE the tank
// rather than a horizontal projecting FROM its side at shoulder height -- the "arms" reading is a
// mark at shoulder height reaching sideways off the body; this tests moving it off that axis
// entirely rather than changing its ink value.
var CLOUDS_RAISED =
	'<path stroke-width="0.6" d="M1.6 2.6C2.3 2.15 2.65 2.15 3.35 2.6C4.05 2.15 4.4 2.15 5.1 2.6"/>'
	+ '<path stroke-width="0.6" d="M18.9 2.6C19.6 2.15 19.95 2.15 20.65 2.6C21.35 2.15 21.7 2.15 22.4 2.6"/>';

function svg(clouds, fill) {
	return '<svg xmlns="http://www.w3.org/2000/svg" ' + OPEN.replace(/ICOLOR/g, 'ICOLOR')
		+ '>' + BODY.replace(/ICOLOR/g, 'ICOLOR') + clouds + '</svg>';
}

var CANDS = [
	{ id: 'shipped-with-clouds', label: 'SHIPPED (line clouds, as in lib/Icons.lib.php today)', clouds: CLOUDS_SHIPPED },
	{ id: 'no-clouds', label: 'PROPOSAL 1: remove clouds entirely', clouds: CLOUDS_NONE },
	{ id: 'area-clouds', label: 'PROPOSAL 2: same position, filled AREA not stroked LINE', clouds: CLOUDS_AREA },
	{ id: 'raised-clouds', label: 'OPTION 3: same ink, moved off the shoulder axis (above roof, not beside wall)', clouds: CLOUDS_RAISED }
];

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
// Realistic menu-row ink: this suite's menu text is dark gray on light, light gray on dark --
// not pure black/white -- so INK matches what a visitor actually sees, not a lab extreme.
var INK = { lt: '#333333', dk: '#cccccc' };
var SIZES = [16, 17, 24, 32];
var ZOOM = 12; // blow-up factor for the proof sheet

(async function main() {
	var exe = findChromium();
	if (!exe) { throw new Error('No Chromium found'); }
	var pw = require(path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'));
	var browser = await pw.chromium.launch({ executablePath: exe });

	for (var ci = 0; ci < CANDS.length; ci++) {
		var c = CANDS[ci];
		for (var gk in GROUNDS) {
			var markup = svg(c.clouds, INK[gk]).replace(/ICOLOR/g, INK[gk]);
			var pg = await browser.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: 1 });
			for (var si = 0; si < SIZES.length; si++) {
				var px = SIZES[si];
				var m = markup.replace('ICSIZE', px).replace('ICSIZE', px);
				await pg.setContent('<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;background:'
					+ GROUNDS[gk] + '}#t{width:' + px + 'px;height:' + px + 'px;line-height:0}</style></head><body><div id="t">'
					+ m + '</div></body></html>');
				var file = path.join(OUT, c.id + '@' + px + '-' + gk + '.png');
				await (await pg.$('#t')).screenshot({ path: file });
			}
			await pg.close();
		}
	}
	await browser.close();

	// One HTML proof sheet: one row per candidate, one column per size, light and dark stacked,
	// each raster blown up 12x with nearest-neighbor (no smoothing) so the actual pixels are
	// what is being judged, exactly as every prior sheet in this directory did.
	var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Arms review</title><style>'
		+ 'body{background:#888;margin:16px;font:13px/1.4 sans-serif;color:#111}'
		+ 'h1{font-size:16px}h2{font-size:13px;margin:22px 0 4px}'
		+ '.row{display:flex;align-items:center;gap:14px;margin:10px 0;background:#f4f4f4;padding:8px;border-radius:4px}'
		+ '.lbl{width:230px;font:12px monospace}'
		+ '.cell{text-align:center;font:10px monospace;color:#555}'
		+ 'img{image-rendering:pixelated;border:1px solid #999;display:block;margin:0 auto 2px}'
		+ '</style></head><body>'
		+ '<h1>Ida — the "arms" complaint, 2026-09-10. Menu icon at real menu sizes, blown up ' + ZOOM + 'x, nearest-neighbor.</h1>'
		+ '<p>Ink ' + INK.lt + ' on white / ' + INK.dk + ' on #1e1e1e (this suite\'s actual menu-text tones, not pure black/white).</p>'
		+ CANDS.map(function (c) {
			return '<h2>' + c.label + '</h2><div class="row"><span class="lbl">' + c.id + '</span>'
				+ SIZES.map(function (p) {
					return '<div class="cell">' + p + 'px<br>'
						+ '<img src="' + c.id + '@' + p + '-lt.png" width=' + (p * ZOOM) + ' height=' + (p * ZOOM) + '>'
						+ '<img src="' + c.id + '@' + p + '-dk.png" width=' + (p * ZOOM) + ' height=' + (p * ZOOM) + '></div>';
				}).join('')
				+ '</div>';
		}).join('')
		+ '</body></html>';
	fs.writeFileSync(path.join(OUT, 'arms-review.html'), html);

	var browser2 = await pw.chromium.launch({ executablePath: exe });
	var shot = await browser2.newPage({ viewport: { width: 1900, height: 2000 } });
	await shot.goto('file://' + path.join(OUT, 'arms-review.html'));
	await shot.screenshot({ path: path.join(OUT, 'arms-review.png'), fullPage: true });
	await browser2.close();
	console.log('wrote ' + path.join(OUT, 'arms-review.png') + ' and .html');
})();
