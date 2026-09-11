// Render the About box's leading mark two ways, side by side, at the size it actually appears.
//
// Tom, 2026-09-11: *"Thematically, is it important to keep it monochrome? The color version looks
// amazing at favicon size ... it may not be as impressive at the larger size, but that's just a
// maybe."* This answers it with real renders rather than an argument, which is the pattern that
// has worked here -- an orchestrator once carried a colour tile onto his glyph and described it to
// him instead of showing it, and he said *"You are hallucinating badly."*
//
// The MONO glyph is read out of lib/Icons.lib.php's `water` entry, so this cannot drift from what
// ships. The COLOUR one is icons/favicon.svg, the shipped favicon, verbatim.
//
//   node dev/icon-preview/gen-about-icon.js
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core'));

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(__dirname, 'render', 'about-icon');
fs.mkdirSync(OUT, { recursive: true });

// The mono glyph, straight out of the shipped icon table.
const icons = fs.readFileSync(path.join(ROOT, 'lib', 'Icons.lib.php'), 'utf8');
const at = icons.indexOf("'water'");
const chunk = icons.slice(at, icons.indexOf("\n\t// FIRE HYDRANT", at));
const paths = [...chunk.matchAll(/'(<path[^']*)'/g)].map((m) => m[1]).join('');
if (!paths) { throw new Error('could not read the water glyph out of lib/Icons.lib.php'); }
const MONO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
	stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const COLOUR = fs.readFileSync(path.join(ROOT, 'icons', 'favicon.svg'), 'utf8')
	.replace(/width="24"\s*height="24"/, '');

// The About box as it really is: 30rem max-width, an h2, the dedication, the legal lines.
function box(markIcon, label) {
	return `
	<figure>
		<figcaption>${label}</figcaption>
		<div class="about">
			<div class="title">About</div>
			<h2 class="name"><span class="ic">${markIcon}</span>LibreWaterNet.org</h2>
			<p class="ded">You are loved and cherished forever, you have nothing to fear, and you are
				not ruining everything.</p>
			<p class="legal">Licensed under the GNU General Public License v3.0 or later.<br>
				Copyright © 2009–2026 Thomas Gail Haws</p>
			<p class="build">2026-09-11 17:38 UTC · 5fa2b734</p>
		</div>
	</figure>`;
}

const page = `<!doctype html><meta charset="utf-8"><style>
 body { font: 14px/1.45 system-ui, sans-serif; margin: 0; padding: 22px; background: #f6f6f6; color: #12211f; }
 h1 { font-size: 15px; margin: 0 0 16px; }
 .row { display: flex; gap: 22px; align-items: flex-start; flex-wrap: wrap; }
 figure { margin: 0; }
 figcaption { font: 12px ui-monospace, monospace; margin-bottom: 6px; color: #444; }
 .about { width: 30rem; background: #fff; border: 1px solid #333; padding: 40px 12px 12px;
   box-shadow: 2px 2px 6px rgba(0,0,0,.3); position: relative; }
 .title { position: absolute; top: 0; left: 0; right: 0; padding: 6px 12px; font-weight: 600;
   border-bottom: 1px solid #ccc; background: #f3f3f3; }
 .name { display: flex; align-items: center; gap: .45em; font-size: 1.5rem; margin: 0 0 .5em; }
 .ic svg { width: 1.5em; height: 1.5em; display: block; }
 .ded { font-style: italic; margin: 0 0 .8em; }
 .legal { margin: 0 0 .5em; }
 .build { font: 12px ui-monospace, monospace; color: #555; margin: 0; }
</style>
<h1>The About box, at the size it really is. Mono is what ships today.</h1>
<div class="row">${box(MONO, 'a — monochrome (shipped)')}${box(COLOUR, 'b — the colour favicon')}</div>`;

(async () => {
	const browser = await chromium.launch();
	const p = await browser.newPage({ viewport: { width: 1180, height: 460 }, deviceScaleFactor: 2 });
	await p.setContent(page);
	await p.screenshot({ path: path.join(OUT, 'about-icon.png'), fullPage: true });
	await browser.close();
	console.log('wrote ' + path.join(OUT, 'about-icon.png'));
})();
