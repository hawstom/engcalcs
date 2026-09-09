// THE PROPERTY POPUP'S TITLE BAR. Run with:
//   node dev/lpn-spike/popup-title-bar-harness.js
//
// Tom, 2026-09-08: *"There is no visual title bar depiction. For a non-hog box like this I would
// expect a title bar with a title in it; maybe the right title is 'Properties'. Or empty for now.
// But a nice line delineating the title/drag bar would be nice."*
//
// The band has been there since the popup was written -- 40 px of top padding, and `e.target` is
// the popup itself there and a child everywhere else, which is exactly what makes it a drag surface
// and nothing else a drag surface. It simply looked like nothing.
//
// **WHAT THIS FILE CANNOT SEE.** The rule is a `::before`, so nothing here can say what it looks
// like; there is no CSS engine in the stub and no screenshot in this repository. What is asserted
// is that the rule exists, that it is on the popup and spans it, that the title is inside the band
// and cannot swallow the pointer, and that the drag test the band depends on is still the one the
// page makes.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// ================================================================================================
// 1. THE RENDERED PAGE
// ================================================================================================
// Through render_page.php, which is the only correct way to render a page outside a web request.
console.log('\n--- the bar is in the page ---');
const html = execFileSync('php', [path.join(ROOT, 'dev/scripts/render_page.php'), 'Looped-Network.php'],
	{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const popupAt = html.indexOf('id="lpn_popup"');
const barAt = html.indexOf('id="lpn_popup_boxtitle"');
const bodyAt = html.indexOf('lpn-popover-body', popupAt);
const titleAt = html.indexOf('id="lpn_popup_title"');
ok('the property popup has a box title', barAt > 0);
ok('...inside the popup, above its scrolling body', barAt > popupAt && barAt < bodyAt,
	popupAt + ' < ' + barAt + ' < ' + bodyAt);
ok('...and above #lpn_popup_title, which names the ELEMENT rather than the box',
	barAt < titleAt, barAt + ' < ' + titleAt);

// **NEVER PINNED AS A LITERAL HERE.** The wording is Tom's to change; what this asserts is that the
// bar carries the shipped value of its own key.
const lang = fs.readFileSync(path.join(ROOT, 'lib/lang.ec.en.php'), 'utf8');
const want = (lang.match(/\$ec_lang\['lpn_popup_boxtitle'\]='([^']*)';/) || [])[1];
ok('lpn_popup_boxtitle is defined in English', !!want, want);
ok('...and it is what the bar says',
	!!want && html.slice(barAt, barAt + 200).indexOf('>' + want + '<') > 0,
	html.slice(barAt, barAt + 90));

// ================================================================================================
// 2. IT BORROWS THE OTHER BOXES' IDIOM RATHER THAN INVENTING A SECOND ONE
// ================================================================================================
console.log('\n--- one idiom, not two ---');
{
	const seg = html.slice(barAt, barAt + 160);
	ok('the title wears .lpn-setbox-title, the class Find and Settings already use',
		/class="lpn-setbox-title"/.test(seg), seg.slice(0, 90));
	// Three BOXES wear it in the page's own markup -- Find, Settings and now the property popup.
	// The count is of the ids, not of the class, because js/looped-network.js builds further
	// titles of the same shape for the report boxes.
	['lpn_find_boxtitle', 'lpn_setbox_title', 'lpn_popup_boxtitle'].forEach(function (id) {
		ok('...' + id + ' wears it in the markup',
			new RegExp('id="' + id + '" class="lpn-setbox-title"').test(html));
	});

	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8')
		.replace(/\/\*[\s\S]*?\*\//g, '');
	ok('the shared class is still pointer-events:none, so the band stays a drag surface',
		/\.lpn-setbox-title \{[^}]*pointer-events:\s*none/.test(css));
}

// ================================================================================================
// 3. THE DELINEATING LINE
// ================================================================================================
console.log('\n--- the line ---');
{
	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8')
		.replace(/\/\*[\s\S]*?\*\//g, '');
	const rule = (css.match(/#lpn_popup::before \{[^}]*\}/) || [''])[0];
	ok('#lpn_popup draws a rule at the foot of its band', !!rule, rule.replace(/\s+/g, ' '));
	ok('...it is a border, not a background, so the band stays white like the other two boxes\'',
		/border-top:\s*1px solid/.test(rule));
	ok('...it spans the full width, so it reads as the bottom of a bar and not an underline',
		/left:\s*0/.test(rule) && /right:\s*0/.test(rule));
	ok('...it sits at the foot of the 40px band the popup pads out',
		/top:\s*39px/.test(rule) && /padding:40px 8px 8px/.test(html));
	ok('...and it cannot take the pointer from the drag surface',
		/pointer-events:\s*none/.test(rule));
}

// ================================================================================================
// 4. THE BAND IS STILL THE HANDLE
// ================================================================================================
// The drag test is `e.target === panel` -- true in the padding, false on any child. A title with
// pointer-events would have made the one place this popup can be picked up by unpickable, which is
// the failure this section exists to catch.
console.log('\n--- the bar is still what drags the box ---');
{
	const js = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	ok('makePanelDraggable() still starts a drag only where the target IS the panel',
		/function makePanelDraggable\(popup[\s\S]{0,2500}?if \(e\.target !== popup\) \{ return; \}/.test(js));
	ok('...and the property popup is one of the panels it is called on',
		/popup\.classList\.add\('lpn-dragpanel'\)/.test(js));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
