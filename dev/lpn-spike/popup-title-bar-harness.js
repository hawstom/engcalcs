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
	// **THE LINE MOVED FROM ONE BOX TO THE CLASS, 2026-09-09.** It was `#lpn_popup::before`, so
	// exactly one of the ten non-hogging boxes had a bar you could see, and Tom asked for all of
	// them: *"standard styling needs to be applied to all non-hogging windows/boxes."* The divider
	// belongs to `.lpn-setbox-title` now -- every box is `padding: 40px ...` with that element in
	// it, so there is no per-box rule and no list of boxes to keep in step. The full contract
	// across every box is dev/lpn-spike/map-cursor-harness.js §3; this section holds the Properties
	// popup's own half, which is what Tom asked for first.
	const rule = (css.match(/\.lpn-setbox-title \{[^}]*\}/) || [''])[0];
	ok('the title bar draws a rule at its foot', !!rule, rule.replace(/\s+/g, ' '));
	ok('...it is a border, not a background, so every band stays white',
		/border-bottom:\s*1px solid/.test(rule));
	ok('...it spans the full width, so it reads as the bottom of a bar and not an underline',
		/left:\s*0/.test(rule) && /right:\s*0/.test(rule));
	ok('...it is the height of the 40px band the popup pads out',
		/height:\s*39px/.test(rule) && /padding:40px 8px 8px/.test(html));
	ok('...and it cannot take the pointer from the drag surface',
		/pointer-events:\s*none/.test(rule));
	ok('...and no per-box rule survives to draw a second one',
		!/#lpn_popup::before/.test(css));
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

// ================================================================================================
// 4. AND IT RESIZES (Tom, 2026-09-14)
// ================================================================================================
// *"Element properties and group properties no longer resizeable."* Both render into #lpn_popup,
// so this is one box and one fix -- and it is Task 665's standard ("draggable and resizable is the
// standard for a standing box") reaching the box a person opens most often.
//
// **CHECKED IN FOUR PLACES BECAUSE resize: both IS FOUR THINGS.** The declaration alone does
// nothing: the browser draws no grabber without a non-visible overflow, the body must be free to
// take the dragged height or the content spills instead of scrolling, the box must be laid out as
// a column for that to mean anything, and the one door that opens it must stop resetting the
// height it was given. Any one of the four missing is a box that looks resizable and is not.
console.log('\n--- resizing ---');
{
	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8')
		.replace(/\/\*[\s\S]*?\*\//g, '');
	const js = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	const rule = /\.lpn-propbox \{([^}]*)\}/.exec(css);
	ok('the properties box has a shell of its own', !!rule, rule && rule[1].trim());
	ok('...declaring resize: both', !!rule && /resize:\s*both/.test(rule[1]));
	ok('...with the non-visible overflow the grabber needs',
		!!rule && /overflow:\s*hidden/.test(rule[1]));
	ok('...laid out as a column, so the body can take the height',
		!!rule && /flex-direction:\s*column/.test(rule[1]));
	ok('...and a width floor, because the property rows stop fitting first',
		!!rule && /min-width:/.test(rule[1]));
	ok('the body gives up its own cap and scrolls inside the box instead',
		/\.lpn-propbox \.lpn-popover-body \{[^}]*max-height:\s*none/.test(css));
	// **NO `width`, DELIBERATELY.** .lpn-findbox needed one because an inline max-width cannot be
	// dragged past; this box's only cap is .lpn-popover's viewport bound, so it goes on sizing
	// itself to the element's own properties -- a valve and a tank open at different widths.
	ok('...and no fixed width, so it still sizes itself to the element',
		!!rule && !/[^-]width:\s*(min|\d)/.test(rule[1].replace(/min-width:[^;]*;/, '')));

	ok('the markup wears the class', /id="lpn_popup" class="[^"]*lpn-propbox/.test(html));
	ok('the one door opens it as a flex column, not a block',
		/function openPopupAt[\s\S]{0,900}?popup\.style\.display = 'flex'/.test(js));
	// The trap: fitPanelToViewport() RESETS the height before measuring, which is right for a box
	// sizing itself to its content and is exactly what would undo a drag on the next open.
	ok('...and stops re-fitting the height once the user has chosen one',
		/popupUserSize \? popup\.getBoundingClientRect\(\)\.height : fitPanelToViewport\(popup\)/.test(js));
	ok('...re-applying the size a drag left behind', /popupUserSize\.w \+ 'px'/.test(js));
	// CSS resize fires no event, so the size has to be observed.
	ok('the dragged size is observed rather than listened for',
		/ResizeObserver[\s\S]{0,400}?popupUserSize = \{/.test(js));
	ok('...and never recorded from a phone-width fill',
		/ResizeObserver[\s\S]{0,300}?smallScreen\(\)/.test(js));
	// One gesture means "put it back how it opens", so it has to clear both.
	ok('the double-click reset clears the size as well as the corner',
		/popupUserPos = null;\s*popupUserSize = null;/.test(js));
	// **SESSION ONLY, like the position beside it.** No new localStorage key, so no new row in
	// dev/cookie-storage-inventory.md and nothing for lpn_furniture_check.php to place.
	ok('...and nothing about it reaches storage',
		!/lpn_propbox|LPN_PROPBOX/.test(js));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
