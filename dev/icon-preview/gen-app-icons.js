#!/usr/bin/env node
/*
 * Renders icons/icon-192.png, icons/icon-512.png and icons/icon.svg from icons/favicon.svg (the
 * shipped tower, itself never touched) through headless Chromium -- same pipeline as gen-ship.js.
 * ROADMAP Task 615's last open item. All three used to be either blank (#1a6faf squares, no glyph)
 * or a stale "EC" wordmark unrelated to the shipped mark.
 *
 * REVISED TWICE, 2026-09-10, both times after the coordinator re-read this script's own proof:
 *
 *   1. icons/icon.svg is NOT dead (lib/WebManifest.lib.php:123, a THIRD manifest icon, sizes "any"
 *      -- often PREFERRED by an installer over a fixed-size PNG). Regenerated here from the same
 *      transform as icon-512.png, with its baked-in rx="80" corner rounding removed (a maskable
 *      icon must not pre-round its own corners -- the PLATFORM rounds it, so a pre-rounded square
 *      is rounded twice and shows the page background through the gap).
 *
 *   2. THE FIRST 512 HAD THE FEET OUTSIDE THE SAFE CIRCLE. The outline stroke carries
 *      stroke-linecap="round" at width 2, so an open path's ink extends 1 unit past its own
 *      coordinate -- invisible on the favicon only because the viewBox happens to clip it there.
 *      Fixed by accounting for the cap in every distance below.
 *
 *   3. THE SECOND 512 "FIXED" THE CIRCLE AND BROKE THE SQUARE. Scaling the WHOLE tower uniformly by
 *      0.85 about the frame center does clear the safe circle, but it also drags the descenders'
 *      endpoint from y=24 up to y=22.20 -- 1.80 units of visible sky under every foot even in the
 *      plain UNCROPPED square (7.5% of the icon's height, 38px at 512), which is Tom's struck
 *      "flying in the air" defect, smaller but present, and present on every platform that treats
 *      a maskable icon as "any" and shows it uncropped. The coordinator caught this by measuring the
 *      proof sheet's own numbers rather than trusting the caption.
 *
 * THE FIX IS TO STOP SCALING THE TOWER AS ONE OBJECT. The safe zone is a fact about the BODY (roof,
 * wall, catwalk, bowl) and Tom's "hits the bottom" ruling is a fact about the DESCENDERS (the two
 * legs and the riser, below the bowl) -- they are not in tension with each other once they are
 * treated as two different problems:
 *
 *   - the BODY is scaled by 0.85 about the frame center, exactly as before, keeping its stated
 *     10.2%-margin clearance inside the 9.6-unit safe circle;
 *   - the DESCENDERS are drawn OUTSIDE that scale, starting at the scaled body's own attachment
 *     point (so there is no visible seam) and running straight down to y=24, the frame's TRUE edge
 *     -- the exact coordinate the favicon itself draws to. Their stroke-width is set to match the
 *     body's own SCALED weight (2 * 0.85 = 1.7) so the leg reads as the same line as the wall above
 *     it, not a thicker or thinner one.
 *
 * That gets all three properties Tom's ruling and the safe-zone rule each ask for, at once:
 * uncropped, the legs reach the true bottom edge with NO gap, exactly as favicon.svg draws them;
 * cropped to the circle, the legs cross the ring and keep going (the clean grounded-and-cut read);
 * the body keeps its full margin inside the guaranteed zone regardless of what the legs do.
 *
 * THE COST, MEASURED RATHER THAN ASSUMED: the legs are now proportionally longer relative to the
 * tank than favicon.svg draws them (the body shrank 15% but the legs did not shrink at all), and
 * `render/app-icons/proof.png` puts this render directly beside the unmodified favicon at matching
 * scale so that can be judged by eye, not just by the number. See the "leg-to-wall ratio" figure
 * printed below and in ship-notes.md for the reading.
 *
 * ALGEBRAIC POINT THAT SURVIVES BOTH REVISIONS, kept because it explains why this could never be a
 * one-number fix: any point sitting on the frame's true edge (y=24 in a 24-unit frame) is, by
 * construction, at least 12 units from the frame's center, and the safe circle's radius is only 9.6
 * (40% of the frame). So "touches the true edge" and "is inside the guaranteed-safe zone" are
 * mutually exclusive for ANY maskable icon, not just this one -- which is exactly why the
 * descenders, and only the descenders, are the right thing to let bleed past the circle rather than
 * something to keep shrinking in step with the body.
 *
 * Writes:
 *   icons/icon-192.png, icons/icon-512.png, icons/icon.svg   -- the three shipped files, in place
 *   render/app-icons/*.png                                    -- every raster this script produced
 *   render/app-icons/proof.png                                -- 192; the rejected all-shrink (a);
 *                                                                 the shipped split-transform (b);
 *                                                                 and (b) beside the plain favicon
 */
'use strict';
var fs = require('fs');
var path = require('path');
var here = __dirname;
var OUT = path.join(here, 'render', 'app-icons');
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

var FAVICON_PATH = path.join(here, '..', '..', 'icons', 'favicon.svg');
var OUT_192 = path.join(here, '..', '..', 'icons', 'icon-192.png');
var OUT_512 = path.join(here, '..', '..', 'icons', 'icon-512.png');
var OUT_ICONSVG = path.join(here, '..', '..', 'icons', 'icon.svg');

// ---- geometry, independent of rendering ----
var CENTER = [12, 12];
var SAFE_R = 9.6; // 40% of the 24-unit frame -- the guaranteed-safe circle's radius.
var CAP = 1; // half the outline stroke-width (2), i.e. how far a round line cap extends beyond its coordinate on the UNSCALED body.
var FRAME_EDGE_Y = 24; // the favicon's own frame bottom -- where descenders are drawn to.

function dist(p) { return Math.sqrt((p[0] - CENTER[0]) * (p[0] - CENTER[0]) + (p[1] - CENTER[1]) * (p[1] - CENTER[1])); }
function nx(x, S) { return CENTER[0] + S * (x - CENTER[0]); }
function ny(y, S) { return CENTER[1] + S * (y - CENTER[1]); }

// Body points (scale with the tank): unchanged by this revision.
var BODY = {
	'roof apex (12,2.2)': [12, 2.2],
	'roof/wall shoulder L, fill vertex (7.95,3.7)': [7.95, 3.7],
	'roof/wall shoulder R, fill vertex (16.05,3.7)': [16.05, 3.7],
	'roof/wall shoulder L, stroke cap (7.95,2.7)': [7.95, 3.7 - CAP],
	'roof/wall shoulder R, stroke cap (16.05,2.7)': [16.05, 3.7 - CAP],
	'catwalk L cap (6.1,13.55)': [7.1 - CAP, 13.55],
	'catwalk R cap (17.9,13.55)': [16.9 + CAP, 13.55],
	'bowl low pole (12,18.15)': [12, 18.15]
};
// Where each descender ATTACHES to the (scaled) body -- the wall's bottom edge for the legs, the
// bowl's own low pole for the riser (so the riser has zero body length of its own).
var LEG_ATTACH_X = { left: 7.95, right: 16.05 };
var LEG_ATTACH_Y = 14.15; // wall bottom / bowl top
var RISER_ATTACH_X = 12;
var RISER_ATTACH_Y = 18.15; // bowl low pole

function worstIn(group, scale) {
	var worst = null;
	for (var k in group) {
		var d = dist(group[k]) * scale;
		if (!worst || d > worst.d) { worst = { label: k, d: d }; }
	}
	return worst;
}

/** Reports the fixed body-only scale, unchanged by whichever descender treatment is used. */
function reportBody(scale) {
	console.log('--- BODY at scale ' + scale + ' (roof, wall, catwalk, bowl -- descenders reported separately) ---');
	for (var k in BODY) {
		var d = dist(BODY[k]) * scale;
		console.log('  ' + k.padEnd(46) + ' ' + d.toFixed(3) + (d <= SAFE_R ? '  inside' : '  OUTSIDE by ' + (d - SAFE_R).toFixed(3)));
	}
	var w = worstIn(BODY, scale);
	console.log('  worst body point: ' + w.label + ' = ' + w.d.toFixed(3) + ' / ' + SAFE_R
		+ (w.d <= SAFE_R ? ' (margin ' + (SAFE_R - w.d).toFixed(3) + ', ' + (100 * (SAFE_R - w.d) / SAFE_R).toFixed(1) + '%)' : ' -- FAILS'));
	return w;
}

/** Reports descender geometry two ways: (A) whole-tower uniform scale, (B) split transform (attached to the scaled body, run to the TRUE frame edge). */
function reportDescenders(scale) {
	console.log('--- DESCENDERS (legs + riser) at scale ' + scale + ' ---');

	console.log('  (A) REJECTED -- whole tower scaled uniformly, legs end wherever that puts them:');
	var uniformLegEnd = ny(FRAME_EDGE_Y, scale);
	var uniformLegCap = ny(FRAME_EDGE_Y + CAP, scale);
	var skyGapUnscaled = FRAME_EDGE_Y - ny(FRAME_EDGE_Y, scale) === 0 ? 0 : (24 - uniformLegEnd);
	console.log('      leg endpoint lands at y=' + uniformLegEnd.toFixed(3) + ' instead of y=24 -- sky gap '
		+ skyGapUnscaled.toFixed(3) + ' units (' + (100 * skyGapUnscaled / 24).toFixed(1) + '% of icon height, '
		+ Math.round(skyGapUnscaled / 24 * 512) + 'px at 512)');

	console.log('  (B) SHIPPED -- body scaled, descenders attached to it and run to the true edge y=24:');
	var legAttachL = [nx(LEG_ATTACH_X.left, scale), ny(LEG_ATTACH_Y, scale)];
	var legAttachR = [nx(LEG_ATTACH_X.right, scale), ny(LEG_ATTACH_Y, scale)];
	var riserAttach = [nx(RISER_ATTACH_X, scale), ny(RISER_ATTACH_Y, scale)];
	var descStroke = 2 * scale; // matches the scaled body's own effective stroke weight
	var descCap = descStroke / 2;

	var points = {
		'left leg endpoint (attach.x, 24)': [legAttachL[0], FRAME_EDGE_Y],
		'right leg endpoint (attach.x, 24)': [legAttachR[0], FRAME_EDGE_Y],
		'left leg stroke cap': [legAttachL[0], FRAME_EDGE_Y + descCap],
		'right leg stroke cap': [legAttachR[0], FRAME_EDGE_Y + descCap],
		'riser endpoint (12, 24)': [riserAttach[0], FRAME_EDGE_Y],
		'riser stroke cap': [riserAttach[0], FRAME_EDGE_Y + descCap]
	};
	for (var k in points) {
		var d = dist(points[k]);
		console.log('      ' + k.padEnd(38) + ' ' + d.toFixed(3) + '  bleeds by ' + (d - SAFE_R).toFixed(3));
	}
	console.log('      leg attach point (top of descender, bottom of scaled wall): ('
		+ legAttachL[0].toFixed(4) + ', ' + legAttachL[1].toFixed(4) + ')');
	console.log('      descender stroke-width: ' + descStroke.toFixed(3) + ' (matches scaled body weight 2*' + scale + ')');
	console.log('      sky gap under a leg, uncropped square: 0.000 units (0px) -- reaches the true edge exactly');

	// Proportion check: leg length (attach to y=24) versus wall length (roof/wall shoulder to attach), SCALED frame, against the plain favicon's own ratio.
	var wallLenScaled = legAttachL[1] - ny(3.7, scale);
	var legLenScaled = FRAME_EDGE_Y - legAttachL[1];
	var wallLenFavicon = LEG_ATTACH_Y - 3.7;
	var legLenFavicon = FRAME_EDGE_Y - LEG_ATTACH_Y;
	console.log('  leg-to-wall length ratio: shipped ' + (legLenScaled / wallLenScaled).toFixed(3)
		+ ' vs favicon\'s own ' + (legLenFavicon / wallLenFavicon).toFixed(3)
		+ ' (leg is ' + (100 * (legLenScaled / wallLenScaled - legLenFavicon / wallLenFavicon) / (legLenFavicon / wallLenFavicon)).toFixed(1) + '% longer, relative to the wall, than the favicon draws it)');

	return { legAttachL: legAttachL, legAttachR: legAttachR, riserAttach: riserAttach, descStroke: descStroke };
}

var SCALE_SAFE = 0.65;     // (a) rejected: shrink the WHOLE tower until even leg tips clear the circle -- shown in the proof for comparison only.
var SCALE_GROUNDED = 0.85; // (b) shipped: body-only scale; descenders split out and run to the true edge.

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

/** Split the shipped favicon into (everything through the clouds group) + (the tower proper). */
function splitFavicon(svg) {
	var m = svg.match(/<g filter="url\(#wtfav-blur\)"[\s\S]*?<\/g>/);
	if (!m) { throw new Error('could not find the clouds group in icons/favicon.svg -- has it changed shape?'); }
	var afterClouds = svg.indexOf(m[0]) + m[0].length;
	var endSvg = svg.lastIndexOf('</svg>');
	return {
		head: svg.slice(0, afterClouds),  // <svg...><defs>...</defs><rect sky/><g clouds>...</g>
		tower: svg.slice(afterClouds, endSvg)  // the wall/roof/bowl paths + the black stroke group
	};
}

/** icon-192: the favicon's own framing, full bleed, untouched. purpose "any" -- never cropped. */
function svg192(svg) {
	return svg; // rendered at 192x192 via the viewport; viewBox does the scaling.
}

/**
 * (a), REJECTED: the tower scaled as ONE object about the viewBox center. Kept only to render for
 * the proof sheet's comparison; not shipped, because it leaves a sky gap under the descenders even
 * in the uncropped square.
 */
function svgUniformScale(svg, scale) {
	var parts = splitFavicon(svg);
	return parts.head
		+ '<g transform="translate(12 12) scale(' + scale + ') translate(-12 -12)">' + parts.tower + '</g>'
		+ '</svg>\n';
}

/**
 * (b), SHIPPED: the BODY (roof/wall/catwalk/bowl) scaled about the viewBox center; the DESCENDERS
 * (both legs, the riser) drawn separately, attached to the scaled body's own bottom edge, running
 * straight to y=24 -- the favicon's own frame edge -- at the body's scaled stroke weight.
 *
 * Achieved by exact string surgery on the tower's two combined wall/leg strokes and the riser
 * stroke, which is safe here because icons/favicon.svg's own path data is fixed and known (and
 * itself untouched) -- this function fails loudly if that text ever changes shape.
 */
function svgSplitTransform(svg, scale) {
	var parts = splitFavicon(svg);
	var tower = parts.tower;

	var WALL_LEG_COMBINED = '<path d="M7.95 3.7V24M16.05 3.7V24"/>';
	var RISER_FULL = '<path d="M12 18.15V24"/>';
	if (tower.indexOf(WALL_LEG_COMBINED) === -1 || tower.indexOf(RISER_FULL) === -1) {
		throw new Error('icons/favicon.svg\'s wall/leg or riser stroke path text has changed -- update svgSplitTransform() to match.');
	}

	// Body keeps only the wall portion of the combined stroke (roof/wall shoulder down to the wall's
	// own bottom edge) and drops the riser stroke entirely -- the riser has zero body length, since
	// it starts exactly at the bowl's own low pole, already drawn by the bowl's outline stroke.
	var bodyTower = tower
		.replace(WALL_LEG_COMBINED, '<path d="M7.95 3.7V' + LEG_ATTACH_Y + 'M16.05 3.7V' + LEG_ATTACH_Y + '"/>')
		.replace(RISER_FULL, '');

	var legAttachL = [nx(LEG_ATTACH_X.left, scale), ny(LEG_ATTACH_Y, scale)];
	var legAttachR = [nx(LEG_ATTACH_X.right, scale), ny(LEG_ATTACH_Y, scale)];
	var riserAttach = [nx(RISER_ATTACH_X, scale), ny(RISER_ATTACH_Y, scale)];
	var descStroke = 2 * scale;

	var descenders = '<g fill="none" stroke="#232a30" stroke-width="' + descStroke + '" stroke-linecap="round" stroke-linejoin="round">'
		+ '<path d="M' + legAttachL[0].toFixed(4) + ' ' + legAttachL[1].toFixed(4) + 'V' + FRAME_EDGE_Y + '"/>'
		+ '<path d="M' + legAttachR[0].toFixed(4) + ' ' + legAttachR[1].toFixed(4) + 'V' + FRAME_EDGE_Y + '"/>'
		+ '<path d="M' + riserAttach[0].toFixed(4) + ' ' + riserAttach[1].toFixed(4) + 'V' + FRAME_EDGE_Y + '"/>'
		+ '</g>';

	return parts.head
		+ '<g transform="translate(12 12) scale(' + scale + ') translate(-12 -12)">' + bodyTower + '</g>'
		+ descenders
		+ '</svg>\n';
}

(async function main() {
	console.log('=== geometry check, independent of rendering ===');
	reportBody(SCALE_GROUNDED);
	console.log('');
	reportDescenders(SCALE_GROUNDED);
	console.log('');

	var exe = findChromium();
	if (!exe) { throw new Error('No Chromium found; set CHROME_PATH or npx playwright install chromium'); }
	var pw = require(path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'));
	var browser = await pw.chromium.launch({ executablePath: exe });

	var favSVG = fs.readFileSync(FAVICON_PATH, 'utf8');
	var svg192Text = svg192(favSVG);
	var svgRejectedText = svgUniformScale(favSVG, SCALE_SAFE);
	var svgShippedText = svgSplitTransform(favSVG, SCALE_GROUNDED);

	async function renderSVGAt(svgText, px, outFile) {
		var page = await browser.newPage({ viewport: { width: px, height: px }, deviceScaleFactor: 1 });
		var sized = svgText.replace(/width="24" height="24"/, 'width="' + px + '" height="' + px + '"');
		await page.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
			+ 'html,body{margin:0;padding:0}#t{width:' + px + 'px;height:' + px + 'px;line-height:0}'
			+ '</style></head><body><div id="t">' + sized + '</div></body></html>');
		await (await page.$('#t')).screenshot({ path: outFile, omitBackground: false });
		await page.close();
	}

	await renderSVGAt(svg192Text, 192, OUT_192);
	var fileRejected = path.join(OUT, 'icon-512-rejected-uniform.png');
	var fileShipped = path.join(OUT, 'icon-512-shipped-split.png');
	var fileFaviconAt512 = path.join(OUT, 'favicon-at-512-for-comparison.png');
	await renderSVGAt(svgRejectedText, 512, fileRejected);
	await renderSVGAt(svgShippedText, 512, fileShipped);
	await renderSVGAt(favSVG, 512, fileFaviconAt512); // the plain favicon, scale 1.0, for the proportion judgement
	fs.copyFileSync(fileShipped, OUT_512);
	fs.copyFileSync(OUT_192, path.join(OUT, 'icon-192.png'));

	function dataURI(file) { return 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'); }
	var uri192 = dataURI(OUT_192);
	var uriRejected = dataURI(fileRejected);
	var uriShipped = dataURI(fileShipped);
	var uriFavicon512 = dataURI(fileFaviconAt512);

	var radiusPx = 0.4 * 512;

	async function cropAndRing(dataUri, label) {
		var cropPage = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
		await cropPage.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
			+ 'html,body{margin:0;padding:0;background:#e8e8e8}'
			+ '#c{width:512px;height:512px;clip-path:circle(' + radiusPx + 'px at center);line-height:0}'
			+ '</style></head><body><div id="c"><img src="' + dataUri + '" width="512" height="512"></div></body></html>');
		var croppedFile = path.join(OUT, 'icon-512-' + label + '-masked.png');
		await (await cropPage.$('#c')).screenshot({ path: croppedFile, omitBackground: false });
		await cropPage.close();

		var overlayPage = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
		await overlayPage.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
			+ 'html,body{margin:0;padding:0}#o{position:relative;width:512px;height:512px}'
			+ '#o img{position:absolute;top:0;left:0;width:512px;height:512px}'
			+ '#o .ring{position:absolute;top:' + (256 - radiusPx) + 'px;left:' + (256 - radiusPx) + 'px;'
			+ 'width:' + (radiusPx * 2) + 'px;height:' + (radiusPx * 2) + 'px;border-radius:50%;'
			+ 'box-shadow:0 0 0 2px rgba(255,0,0,0.85);pointer-events:none}'
			+ '</style></head><body><div id="o"><img src="' + dataUri + '"><div class="ring"></div></div></body></html>');
		var overlayFile = path.join(OUT, 'icon-512-' + label + '-safezone-overlay.png');
		await (await overlayPage.$('#o')).screenshot({ path: overlayFile, omitBackground: false });
		await overlayPage.close();

		return { uriCropped: dataURI(croppedFile), uriOverlay: dataURI(overlayFile) };
	}

	var rejectedProof = await cropAndRing(uriRejected, 'rejected-uniform');
	var shippedProof = await cropAndRing(uriShipped, 'shipped-split');

	function cell(uri, w, caption) {
		return '<figure class="cell"><img src="' + uri + '" width="' + w + '" height="' + w + '"><figcaption>' + caption + '</figcaption></figure>';
	}

	var sheetPage = await browser.newPage({ viewport: { width: 1500, height: 1550 }, deviceScaleFactor: 1 });
	await sheetPage.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
		+ 'html,body{margin:0;padding:20px;background:#f4f4f4;font-family:sans-serif}'
		+ '.row{display:flex;gap:28px;align-items:flex-end;margin-bottom:28px}'
		+ '.cell{text-align:center}'
		+ '.cell img{display:block;background:#ccc}'
		+ 'figcaption{font-size:12px;margin-top:8px;max-width:230px}'
		+ 'h2{font:bold 14px sans-serif;margin:0 0 10px}'
		+ '</style></head><body><div id="t">'
		+ '<h2>icon-192.png (unchanged) and the REJECTED all-shrink candidate</h2>'
		+ '<div class="row">'
		+ cell(uri192, 192, 'icon-192.png, real size. purpose "any", never cropped. Unchanged by this revision.')
		+ cell(uriRejected, 256, 'REJECTED (a): whole tower scaled 0.65. Descenders float well inside the circle even uncropped.')
		+ cell(rejectedProof.uriOverlay, 256, 'REJECTED (a) with the safe circle (red ring). Everything, tips included, sits inside -- floats.')
		+ cell(rejectedProof.uriCropped, 256, 'REJECTED (a) actually cropped. Floats mid-circle with visible sky all around the feet.')
		+ '</div>'
		+ '<h2>SHIPPED: body scaled 0.85, descenders split out and run to the true edge y=24</h2>'
		+ '<div class="row">'
		+ cell(uriShipped, 256, 'SHIPPED, real square. Legs reach the bottom edge with NO gap -- compare to the rejected row above.')
		+ cell(shippedProof.uriOverlay, 256, 'SHIPPED with the safe circle (red ring). Body clear inside; legs cross the ring and keep going.')
		+ cell(shippedProof.uriCropped, 256, 'SHIPPED actually cropped. Legs cut by the frame -- grounded and cut, not floating.')
		+ cell(uriFavicon512, 256, 'The plain favicon at 512 (scale 1.0, unmodified) -- for the proportion check at right.')
		+ '</div>'
		+ '<h2>Proportion check: SHIPPED beside the plain favicon, same frame, no crop</h2>'
		+ '<div class="row">'
		+ cell(uriFavicon512, 320, 'favicon.svg, scale 1.0 (unmodified). Wall-to-leg ratio is the favicon\'s own.')
		+ cell(uriShipped, 320, 'SHIPPED, scale 0.85 body / true-edge legs. Legs read ' + '(see console output and ship-notes.md for the exact ratio).')
		+ '</div>'
		+ '</div></body></html>');
	await (await sheetPage.$('#t')).screenshot({ path: path.join(OUT, 'proof.png') });
	await sheetPage.close();

	await browser.close();

	// ---- icons/icon.svg: the third manifest icon, same split transform, corners un-rounded ----
	var iconSvgContent = svgSplitTransform(favSVG, SCALE_GROUNDED);
	fs.writeFileSync(OUT_ICONSVG, iconSvgContent);

	console.log('');
	console.log('wrote ' + OUT_192);
	console.log('wrote ' + OUT_512 + ' (body scale ' + SCALE_GROUNDED + ', descenders run to true edge y=24)');
	console.log('wrote ' + OUT_ICONSVG + ' (same transform as icon-512.png, no baked corner rounding)');
	console.log('wrote ' + path.join(OUT, 'proof.png'));
})().catch(function (e) { console.error(e); process.exit(1); });
