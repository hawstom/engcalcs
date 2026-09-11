#!/usr/bin/env node
/*
 * Companion to gen-arms-review.js: the SAME four candidates, but embedded at native 1x pixel size
 * inside a mock-up of the real `.lpn-menu-row` (font: inherit, icon column 1.6em wide, icon itself
 * 1.05em -- both read out of css/engcalcs.css) so Tom sees exactly what the menu will show him,
 * not a magnified diagnostic view. Companion sheet only; nothing here is shipped.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var here = process.cwd();
var OUT = path.join(here, 'render', 'arms-review');

var OPEN = 'viewBox="0 0 24 24" fill="none" stroke="ICOLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
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
var CLOUDS_SHIPPED = '<path stroke-width="0.6" d="M1 5.5C1.92 4.95 2.38 4.95 3.3 5.5C4.22 4.95 4.68 4.95 5.6 5.5"/>'
	+ '<path stroke-width="0.6" d="M18.4 9C19.32 8.5 19.78 8.5 20.7 9C21.62 8.5 22.08 8.5 23 9"/>';
var CLOUDS_AREA = '<path fill="ICOLOR" stroke="none" d="M1 5.5C1.92 5.05 2.38 5.05 3.3 5.5C4.22 5.05 4.68 5.05 5.6 5.5C4.68 5.85 4.22 5.85 3.3 5.5C2.38 5.85 1.92 5.85 1 5.5Z"/>'
	+ '<path fill="ICOLOR" stroke="none" d="M18.4 9C19.32 8.6 19.78 8.6 20.7 9C21.62 8.6 22.08 8.6 23 9C22.08 9.35 21.62 9.35 20.7 9C19.78 9.35 19.32 9.35 18.4 9Z"/>';
var CLOUDS_RAISED = '<path stroke-width="0.6" d="M1.6 2.6C2.3 2.15 2.65 2.15 3.35 2.6C4.05 2.15 4.4 2.15 5.1 2.6"/>'
	+ '<path stroke-width="0.6" d="M18.9 2.6C19.6 2.15 19.95 2.15 20.65 2.6C21.35 2.15 21.7 2.15 22.4 2.6"/>';

var CANDS = [
	{ id: 'shipped', label: 'Shipped today', clouds: CLOUDS_SHIPPED },
	{ id: 'no-clouds', label: 'Proposal 1 -- remove', clouds: '' },
	{ id: 'area-clouds', label: 'Proposal 2 -- area not line', clouds: CLOUDS_AREA },
	{ id: 'raised-clouds', label: 'Option 3 -- off the shoulder axis', clouds: CLOUDS_RAISED }
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

(async function main() {
	var exe = findChromium();
	if (!exe) { throw new Error('No Chromium found'); }
	var pw = require(path.join(here, '..', 'browser-pass', 'node_modules', 'playwright-core'));
	var browser = await pw.chromium.launch({ executablePath: exe });

	// Real menu-row markup, font-size 14px (this suite's body size), icon 1.05em -> ~14.7px,
	// rounded up by the browser same as production. Two grounds, light and dark, side by side,
	// one row per candidate, exactly as `.lpn-menubar-item` / `.lpn-menu-row` render.
	var rows = CANDS.map(function (c) {
		var mk = function (ink) { return '<svg xmlns="http://www.w3.org/2000/svg" width="1.05em" height="1.05em" '
			+ OPEN.replace('ICOLOR', ink) + '>' + BODY.replace(/ICOLOR/g, ink) + c.clouds.replace(/ICOLOR/g, ink) + '</svg>'; };
		return '<div class="row"><span class="lbl">' + c.label + '</span>'
			+ '<div class="menurow lt">' + mk('#333333') + '<span>Water</span></div>'
			+ '<div class="menurow dk">' + mk('#cccccc') + '<span>Water</span></div>'
			+ '</div>';
	}).join('');

	var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
		+ 'body{background:#fff;margin:20px;font:13px/1.4 sans-serif}'
		+ 'h1{font-size:15px}'
		+ '.row{display:flex;align-items:center;gap:16px;margin:14px 0}'
		+ '.lbl{width:220px;font:12px monospace;color:#333}'
		+ '.menurow{display:flex;align-items:center;gap:6px;padding:4px 12px 4px 8px;font:14px/1.4 sans-serif;border:1px solid #ccc}'
		+ '.menurow.lt{background:#fff;color:#222}'
		+ '.menurow.dk{background:#1e1e1e;color:#eee;border-color:#444}'
		+ '.menurow svg{flex:none}'
		+ '</style></head><body>'
		+ '<h1>Native 1x, as a real `.lpn-menu-row` would show it (14px text, 1.05em icon = ~14.7px). No zoom.</h1>'
		+ rows + '</body></html>';
	fs.writeFileSync(path.join(OUT, 'arms-incontext.html'), html);

	var pg = await browser.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 3 });
	await pg.goto('file://' + path.join(OUT, 'arms-incontext.html'));
	await pg.screenshot({ path: path.join(OUT, 'arms-incontext.png'), fullPage: true });
	await browser.close();
	console.log('wrote ' + path.join(OUT, 'arms-incontext.png'));
})();
