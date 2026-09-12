#!/usr/bin/env node
/*
 * Task 625 follow-up (Tom, 2026-09-11: "Our Mac-style app icon is now the same as our Map menu."
 * He means the Water menu -- `lpn_menu_home` and `lpn_menu_project` both draw icon 'water').
 *
 * Renders the WHOLE menu bar, shipped vs proposed, at native 1x (16px body font, so the 1.05em
 * icon is ~16.8px -- the 17px Icons.lib.php's own comments measure against), light and dark, and
 * again at the 640px icon-only collapse where the word disappears and only the glyph is left to
 * tell the mark from the Water menu.
 *
 * Proposed change: ONE glyph moves. lpn_menu_home (the brand mark, far left) keeps 'water'.
 * lpn_menu_project (labelled "Water", Task 523) goes back to 'plan' -- the rolled-plan-set icon
 * that was the Project menu's own icon before the Task 523 rename, still fully drawn in
 * lib/Icons.lib.php (kept, though nothing draws it today), never touched, six rounds of work.
 * Nothing else in the bar changes.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var here = process.cwd();
var OUT = path.join(here, 'render', 'menubar-collision');
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

var OPEN = 'viewBox="0 0 24 24" fill="none" stroke="ICOLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

var ICONS = {
	water: '<path d="M7.95 3.7L12 2.2L16.05 3.7"/>'
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
		+ '<path stroke-width="0.7" stroke-linecap="butt" d="M14.9 14.5V15.7"/>',
	file: '<path d="M3 19V5h6l2 2h10v12z"/>',
	edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',
	pin: '<path d="M1.5 8.6V21.5L8 18.6L15.5 21.5L22.5 18.6V5.7L15.5 8.6L8 5.7Z"/>'
		+ '<path d="M8 5.7V18.6"/><path d="M15.5 8.6V21.5"/>'
		+ '<path fill="#fff" stroke="none" d="M12 2.2A4.6 4.6 0 0 1 16.6 6.8C16.6 10 12 15 12 15S7.4 10 7.4 6.8A4.6 4.6 0 0 1 12 2.2Z"/>'
		+ '<path d="M12 15S7.4 10 7.4 6.8A4.6 4.6 0 1 1 16.6 6.8C16.6 10 12 15 12 15Z"/>'
		+ '<circle cx="12" cy="6.8" r="1.7"/>',
	help: '<circle cx="12" cy="12" r="7" stroke-width="6" stroke-linecap="butt"/>',
	globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18z"/>',
	// 'plan' -- the retired Project-menu icon, verbatim from lib/Icons.lib.php, untouched.
	plan: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M7.4 21.6C7.4 22.622 5.833 23.45 3.9 23.45C1.967 23.45 0.4 22.622 0.4 21.6C0.4 20.578 1.967 19.75 3.9 19.75C5.833 19.75 7.4 20.578 7.4 21.6ZM5.5 21.6C5.5 22.014 4.784 22.35 3.9 22.35C3.016 22.35 2.3 22.014 2.3 21.6C2.3 21.186 3.016 20.85 3.9 20.85C4.784 20.85 5.5 21.186 5.5 21.6Z"/>'
		+ '<rect x="21.9" y="3.9" width="1.7" height="19.4" fill="currentColor" stroke="none"/>'
		+ '<path fill="currentColor" stroke="none" d="M5.097 19.862C7.454 20.315 7.6 23.3 11.4 23.3H23.6V23.75H11.4C7.6 23.75 7.454 20.765 5.097 20.312Z"/>'
		+ '<path stroke-width="0.525" d="M0.4 2.2V21.6"/>'
		+ '<path stroke-width="0.525" d="M0.4 2.2C0.4 1.802 0.643 1.415 1.093 1.095C1.542 0.776 2.175 0.542 2.896 0.428C3.618 0.314 4.389 0.325 5.097 0.462"/>'
		+ '<path stroke-width="0.525" d="M5.097 0.462C7.454 0.915 7.6 3.9 11.4 3.9H23.6"/>'
		+ '<path stroke-width="0.525" d="M0.4 11.9C0.4 11.502 0.643 11.115 1.093 10.795C1.542 10.476 2.175 10.242 2.896 10.128C3.618 10.014 4.389 10.025 5.097 10.162"/>'
		+ '<path stroke-width="0.525" d="M5.097 10.162C7.454 10.615 7.6 13.6 11.4 13.6H19.1"/>'
		+ '<path stroke-width="0.525" d="M7.4 21.6C7.4 22.622 5.833 23.45 3.9 23.45C1.967 23.45 0.4 22.622 0.4 21.6C0.4 20.578 1.967 19.75 3.9 19.75C5.833 19.75 7.4 20.578 7.4 21.6Z"/>'
		+ '<path stroke-width="0.525" d="M5.5 21.6C5.5 22.014 4.784 22.35 3.9 22.35C3.016 22.35 2.3 22.014 2.3 21.6C2.3 21.186 3.016 20.85 3.9 20.85C4.784 20.85 5.5 21.186 5.5 21.6Z"/>'
		+ '<path stroke-width="0.525" d="M5.097 19.862C7.454 20.315 7.6 23.3 11.4 23.3H23.6"/>'
		+ '<path stroke-width="0.525" d="M21.9 3.9V23.3"/>'
		+ '<path stroke-width="0.525" d="M23.6 3.9V23.75"/>'
		+ '<path stroke-width="0.525" d="M19.1 3.9V23.3"/>'
		+ '<path stroke-width="0.525" d="M20 10.2V15.6"/>'
		+ '<path stroke-width="0.525" d="M20.9 11.6V14.1"/>'
		+ '<rect x="14.3" y="5.2" width="3" height="2.7" stroke-width="0.525"/>'
		+ '<path stroke-width="0.525" d="M13.2 19.4H17.6"/>'
		+ '<path stroke-width="0.525" d="M13.2 20.8H17.6"/>'
};

function svg(name, ink, cls) {
	return '<svg class="' + (cls || '') + '" width="1.05em" height="1.05em" ' + OPEN.replace('ICOLOR', ink)
		+ '>' + ICONS[name].replace(/ICOLOR/g, ink) + '</svg>';
}

// The bar's own item list, buildMenuBar() order, with a `home` and `water` slot whose icon the
// two variants disagree about.
function bar(waterIcon, ink, wordsOn) {
	var items = [
		{ icon: 'water', word: '', mark: true, aria: 'LibreWaterNet.org' },
		{ icon: 'file', word: 'File' },
		{ icon: 'edit', word: 'Edit' },
		{ icon: 'pin', word: 'Map' },
		{ icon: waterIcon, word: 'Water' },
		{ icon: 'help', word: 'Help' },
		{ icon: 'globe', word: 'English' }
	];
	return '<div class="bar">' + items.map(function (it) {
		return '<span class="item' + (it.mark ? ' mark' : '') + '" title="' + (it.aria || it.word) + '">'
			+ svg(it.icon, ink) + (wordsOn && it.word ? '<span class="w">' + it.word + '</span>' : '') + '</span>';
	}).join('') + '</div>';
}

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

	function section(title, waterIcon, ink, bg, wordsOn) {
		return '<div class="section" style="background:' + bg + ';color:' + ink + '">'
			+ '<div class="cap">' + title + '</div>' + bar(waterIcon, ink, wordsOn) + '</div>';
	}

	var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>'
		+ 'body{background:#f4f4f4;margin:20px;font:16px/1.4 sans-serif}'
		+ 'h1{font-size:16px;margin:0 0 4px}'
		+ 'h2{font-size:13px;margin:22px 0 4px;color:#555}'
		+ '.section{display:inline-block;border:1px solid #999;margin:6px 10px 6px 0;padding:2px 6px;border-radius:3px}'
		+ '.cap{font:11px monospace;opacity:.65;padding:2px 4px 4px}'
		+ '.bar{display:flex;align-items:center}'
		+ '.item{display:flex;align-items:center;gap:.3em;padding:3px 10px;border:1px solid transparent}'
		+ '.item.mark{margin-right:6px}'
		+ '.item svg{flex:none;vertical-align:-0.16em}'
		+ '.w{font-size:1em}'
		+ '</style></head><body>'
		+ '<h1>Home mark vs Water menu -- same glyph today, one proposed change</h1>'
		+ '<h2>Full width (words on), native 16px body / ~17px icon</h2>'
		+ section('SHIPPED -- both water', 'water', '#222', '#fff', true)
		+ section('SHIPPED -- both water (dark)', 'water', '#eee', '#1e1e1e', true)
		+ '<br>'
		+ section('PROPOSED -- Water menu takes \'plan\'', 'plan', '#222', '#fff', true)
		+ section('PROPOSED -- Water menu takes \'plan\' (dark)', 'plan', '#eee', '#1e1e1e', true)
		+ '<h2>&le;640px collapse -- words removed, icon is the ONLY identity left (css/engcalcs.css '
		+ 'html:has(#lpn_canvas) .lpn-menubar-word { display:none })</h2>'
		+ section('SHIPPED -- both water, icon only', 'water', '#222', '#fff', false)
		+ section('SHIPPED -- both water, icon only (dark)', 'water', '#eee', '#1e1e1e', false)
		+ '<br>'
		+ section('PROPOSED -- \'plan\', icon only', 'plan', '#222', '#fff', false)
		+ section('PROPOSED -- \'plan\', icon only (dark)', 'plan', '#eee', '#1e1e1e', false)
		+ '</body></html>';
	fs.writeFileSync(path.join(OUT, 'water-menu-collision.html'), html);

	var pg = await browser.newPage({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 3 });
	await pg.goto('file://' + path.join(OUT, 'water-menu-collision.html'));
	await pg.screenshot({ path: path.join(OUT, 'water-menu-collision.png'), fullPage: true });
	await browser.close();
	console.log('wrote ' + path.join(OUT, 'water-menu-collision.png'));
})();
