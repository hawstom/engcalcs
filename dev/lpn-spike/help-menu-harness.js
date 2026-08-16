// The Help menu, and the two things that moved into it (ROADMAP Task 314 follow-on).
//
//   node dev/lpn-spike/help-menu-harness.js
//
// On 2026-08-14 the Notes and the feedback invitation both left the body of Looped-Network.php --
// Tom: "LPN has a Help menu now. Are we going to put the notes there and bump the bottom of the map
// against the bottom of the screen?" On a twenty-line calculator the Notes sit a scroll below the
// answer and cost nothing; on a full-window map editor they are why the canvas stops short of the
// fold, on the one page in the suite where vertical room IS the product.
//
// MOVED CONTENT IS THE KIND THAT ROTS SILENTLY, which is the whole reason for this file:
//
//   * The Notes are six translated definition pairs -- the only prose on the page saying what the
//     calculator assumes. The tempting implementation is a JS string, and it would quietly delete
//     them from the HTML a search engine reads, from print, and from Find-in-page. So the markup
//     must STAY IN THE PAGE, hidden, and the menu row must only reveal it. Nothing else in the repo
//     can tell the difference between the two implementations; both look right on screen.
//   * The invitation had to land somewhere real. Dropping echoFeedback() from one page is a
//     one-line edit that silently removes the suite's only ask; it is only legitimate because the
//     string now lives on contact.php, and that is a fact about a DIFFERENT file.
//   * Task 290's lesson, in the same shape: content a page lost is indistinguishable from content
//     nobody wanted, once the diff is old.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const page = fs.readFileSync(path.join(root, 'Looped-Network.php'), 'utf8');
const src = fs.readFileSync(path.join(root, 'js/looped-network.js'), 'utf8');
const contact = fs.readFileSync(path.join(root, 'contact.php'), 'utf8');
const en = fs.readFileSync(path.join(root, 'lib/lang.ec.en.php'), 'utf8');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

console.log('\n-- the Notes are still CONTENT, not a JS string --');
{
	report(page.indexOf('id="lpn_notes_popup"') > 0, 'the notes popover exists in the page');
	// Every note is still a real <dt>/<dd> pair emitted by PHP from a lang key. If these ever move
	// into JS they leave the indexable document, and no other check would notice.
	const dts = (page.match(/<dt><\?=\$ec_lang\['lpn_notes_/g) || []).length;
	report(dts >= 6, 'every note is still PHP-rendered markup in the page', `${dts} terms`);
	report(page.indexOf("$ec_lang['ws_notes_heading']") > 0, 'and it keeps the suite-wide Notes heading');
	// Inside the popover, not floating loose: the popover opens with display:none, so the content
	// is present but not occupying the page.
	const at = page.indexOf('id="lpn_notes_popup"');
	const block = page.slice(at, at + 4000);
	report(/display:none/.test(block.slice(0, 300)), 'the popover starts hidden');
	report(block.indexOf("$ec_lang['lpn_notes_1_term']") > 0, 'and the notes live inside it');
	report(!/lpn_notes_\w+ *:/.test(src), 'no note text was smuggled into pageConfig as a JS string');
}

console.log('\n-- the popover behaves like the others --');
{
	report(/VIEW_POPOVERS = \[[^\]]*'lpn_notes_popup'/.test(src),
		'it is in VIEW_POPOVERS, so another menu or a click away closes it');
	report(/function toggleNotesPopup/.test(src), 'it toggles rather than only opening');
	report(/wireNotesPopup\(\);/.test(src), 'its close button is wired at init');
	report(page.indexOf('id="lpn_notes_close"') > 0, 'and it has a close button');
	report(/lpn-popover-body/.test(page.slice(page.indexOf('id="lpn_notes_popup"'), page.indexOf('id="lpn_notes_popup"') + 1500)),
		'its body scrolls, since prose can be taller than the map it covers');
}

console.log('\n-- the invitation landed somewhere real before the page dropped it --');
{
	// The order of these two assertions is the argument: removing the call is only legitimate
	// BECAUSE the string exists on contact.php. Asserted together so neither half can be undone
	// alone.
	report(contact.indexOf("$ec_lang['template_feedback']") > 0,
		'contact.php carries the template_feedback prose');
	// Strip // comments first: the page EXPLAINS in prose why it does not call echoFeedback(), and
	// a naive substring search finds the explanation and calls it a call.
	const pageCode = page.replace(/^\s*\/\/.*$/gm, '');
	report(!/(^|[^\w>])echoFeedback\s*\(/.test(pageCode),
		'and only then is Looped-Network.php excused from calling echoFeedback()');
	// It must NOT be a link on contact.php -- every other appearance of this string links to
	// contact.php, which from contact.php is a link to here.
	const at = contact.indexOf("$ec_lang['template_feedback']");
	const around = contact.slice(Math.max(0, at - 200), at + 100);
	report(around.indexOf('<a ') < 0, 'and it is prose there, not a link back to the same page');
	// Every OTHER calculator still calls it. Dropping it suite-wide would be a different decision
	// from the one Tom made, and this is what tells the two apart.
	const others = fs.readdirSync(root)
		.filter(f => /\.php$/.test(f) && f !== 'Looped-Network.php')
		.filter(f => fs.readFileSync(path.join(root, f), 'utf8').indexOf('echoCalculatorForm') > 0);
	const withFeedback = others.filter(f => fs.readFileSync(path.join(root, f), 'utf8').indexOf('echoFeedback()') > 0);
	report(others.length > 0 && withFeedback.length === others.length,
		'every other calculator page still shows the invitation',
		`${withFeedback.length}/${others.length}`);
}

console.log('\n-- the Help menu rows --');
{
	const fn = src.slice(src.indexOf('function openHelpMenu'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction ', 10));
	report(/pc\.lpn_help_walkthroughs/.test(body), 'Walkthroughs');
	report(/pc\.lpn_help_notes/.test(body), 'Notes');
	report(/pc\.lpn_help_fix/.test(body), 'Fix something');
	report(/pc\.about_main_menu/.test(body), 'About');
	// "Fix something" REPLACED Contact rather than joining it. Both go to contact.php, and
	// lib/Calculators.lib.php records what two links to one destination do to each other: they
	// "halve each other's weight rather than doubling the invitation".
	report(!/pc\.contact_main_menu/.test(body),
		'and Contact is gone, so two rows do not compete for one destination');
	const dests = body.match(/ext\('contact\.php'\)/g) || [];
	report(dests.length === 1, 'exactly one row opens contact.php', `${dests.length}`);
	// About last, where every other Help menu in the world puts it.
	report(body.indexOf('about_main_menu') > body.indexOf('lpn_help_fix'), 'About is last');
	// Notes is the one row that does not leave the page, so it must NOT be an ext().
	report(/label: pc\.lpn_help_notes \|\| 'Notes', fn: toggleNotesPopup/.test(body),
		'Notes reveals in place rather than opening a tab');
}

console.log('\n-- the footer gives up its navigation and keeps its notice --');
{
	const hf = fs.readFileSync(path.join(root, 'lib/HeadersFooters.lib.php'), 'utf8');
	report(/function echoFooter\(\$type, \$nav = true, \$legal = true, \$devtools = true\)/.test(hf),
		'echoFooter takes $nav, $legal and $devtools, all defaulting to the old behaviour');
	report(/echoFooter\("EngCalcs", false, false, false\)/.test(page),
		'and Looped-Network.php declines all three');
	// **THE W3C VALIDATOR BADGES ARE GONE FROM EVERY PAGE** (Tom, 2026-08-15: "Delete the block").
	// They were gated on DEBUG_MODE, so only a dev host saw them, and they had stopped being either
	// true or usable: the badge claimed "Valid XHTML 1.1" on an HTML5 suite, and
	// validator.w3.org/check/referer asks the W3C to fetch the page it was linked from, which it
	// cannot do for a host that is not on the public internet.
	report(!/valid-xhtml11\.gif|jigsaw\.w3\.org/.test(hf),
		'and the stale W3C badges are gone from the footer entirely');
	// What is left in their place is worth naming, because deleting a check without saying what
	// replaced it is how a gap becomes invisible: html_balance_check.php renders every page and
	// verifies tag balance, blocking, in check_all.sh. Nothing checks the CSS.
	report(fs.existsSync(path.join(root, 'dev/scripts/html_balance_check.php')),
		'...with page markup still checked by html_balance_check.php');
	// **THE HALF THAT MUST NOT BE DROPPED.** Task 286 put the privacy/terms/cookie links and the
	// consent banner in every footer on every page because "a privacy notice nobody can find is not
	// notice", and Cookie settings must have something to reopen "wherever the visitor happens to
	// be standing". Those are NOT redundant with the calculators home: a visitor who arrived here
	// from a search has never seen that page. Only the ten-link site-nav row is.
	const guard = hf.slice(hf.indexOf('function echoFooter'));
	const navBlock = guard.slice(guard.indexOf('if ($nav)'), guard.indexOf('echoConsentFooterLinks'));
	report(navBlock.indexOf('engcalcsParentMenu') > 0, 'the nav row is inside the flag');
	// **THE LINE THAT IS NOT NEGOTIABLE.** $legal=false is allowed only because the links moved to
	// the Help menu and the gallery -- checked against epanet-js, whose arrival panel carries its
	// own Terms and Privacy in the sidebar rather than in a footer. But the BANNER and the service
	// worker are not furniture and must render on every page regardless of either flag.
	report(!/if \(\$nav\)[\s\S]{0,400}echoConsentBanner/.test(guard) &&
		!/\$legal[\s\S]{0,80}echoConsentBanner/.test(guard),
		'the consent banner is behind NEITHER flag');
	report(guard.indexOf('serviceWorker') > 0, 'the service worker registration also survives');
	report(/\$legal && function_exists\('echoConsentFooterLinks'\)/.test(guard),
		'the legal ROW is behind $legal');
	// Every other calculator keeps the full footer; this is one page's exemption, not a suite change.
	const others = fs.readdirSync(root)
		.filter(f => /\.php$/.test(f) && f !== 'Looped-Network.php')
		.filter(f => fs.readFileSync(path.join(root, f), 'utf8').indexOf('echoFooter(') > 0);
	const trimmed = others.filter(f => /echoFooter\([^)]*,\s*false/.test(fs.readFileSync(path.join(root, f), 'utf8')));
	report(trimmed.length === 0, 'no other page drops its footer', `${others.length} pages keep it`);
}

console.log('\n-- and the notice it dropped is reachable twice over --');
{
	// Task 286 required the notice to be FINDABLE and withdrawal to be as easy as consent. Dropping
	// the footer row is only legitimate while BOTH of these hold, so they are asserted together.
	const help = src.slice(src.indexOf('function openHelpMenu'));
	const menu = help.slice(0, help.indexOf('\n\tfunction ', 10));
	report(/pc\.privacy_link/.test(menu) && /pc\.terms_link/.test(menu) && /pc\.consent_settings_link/.test(menu),
		'the Help menu carries privacy, terms and cookie settings');
	const gal = src.slice(src.indexOf('function renderExamplesGallery'));
	const pane = gal.slice(0, gal.indexOf('\n\tfunction ', 10));
	report(/lpn-examples-legal/.test(pane) && /ec-consent-reopen/.test(pane),
		'and so does the gallery, which is what a first-time visitor sees');
	// Reopening must not be a second copy of the banner logic.
	report(/window\.ecReopenConsent/.test(src), 'the menu reopens the banner through the exported function');
	const consent = fs.readFileSync(path.join(root, 'lib/Consent.lib.php'), 'utf8');
	report(/window\.ecReopenConsent = reopen;/.test(consent), 'which lib/Consent.lib.php exports');
	report(/function reopen\(\)/.test(consent) && (consent.match(/banner\.scrollIntoView/g) || []).length === 1,
		'and there is exactly ONE copy of the unhide-and-scroll logic');
	// The gallery link keeps the class the delegated handler listens for, so it needs no wiring.
	report(/'class': 'ec-consent-reopen'/.test(pane),
		'the gallery link works through the same delegated handler as every other page');
	// Reused keys, never re-keyed: this wording must match the identical links elsewhere.
	['privacy_link', 'terms_link', 'consent_settings_link'].forEach(function (k) {
		report(page.indexOf(`$ec_lang['${k}']`) > 0, `${k} is bridged to pageConfig`);
	});
}

console.log('\n-- the map fits the window instead of guessing 72% of it --');
{
	const fn = src.slice(src.indexOf('function effectiveMapHeight'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction applyMapHeight'));
	report(!/0\.72/.test(body), 'the flat 0.72 hedge is gone');
	// Tom, 2026-08-14: "There's no need to scroll if the page is not scrollable." The rule is now
	// the actual invariant — leave nothing out of reach — rather than reserving a strip of viewport
	// in case something is.
	report(/flowBelowMap\(\)/.test(body), 'it subtracts what genuinely sits below the canvas');
	report(/rect\.top \+ \(window\.pageYOffset/.test(body), 'and what sits above it');
	report(/Math\.max\(LPN_MAP_MIN/.test(body), 'with a floor, so a short screen still gets a usable map');
	// The "Map height" setting was removed on 2026-08-14 once the map filled the window by itself
	// (Tom: "So Map height is now obsolete. Right?"). dev/lpn-spike/map-height-harness.js owns the
	// assertions about its absence; what matters here is that nothing caps the fit again, because a
	// stored 500 holding the map short of a 900px window reads as a layout bug, not a preference.
	report(!/settings\.mapHeight/.test(body), 'and no stored height caps the fit any more');
	// THE STRUCTURAL GUARANTEE. `above` is at least the header's height and is always > 0, so the
	// computed room is always strictly less than the viewport — the canvas can never be as tall as
	// the screen, which is the precondition of the touch trap. It is prevented by construction now
	// rather than by a chosen fraction.
	// The trailing slack term is gone entirely as of 2026-08-15 -- Tom saw it as "a wasted area below
	// the map", and it was a margin for rounding overshoot that Math.floor makes impossible.
	// map-height-harness.js owns that change; what this line cares about is only that the canvas is
	// still the window minus what is above and below it.
	report(/Math\.floor\(vh - above - flowBelowMap\(\)\)/.test(body),
		'room is viewport minus above minus below, so the canvas is never viewport-tall');
	// It passed only because the PROSE above it mentions scrollHeight — which is now the thing this
	// code must not do. Assert the measurement, not a word that appears near it.
	const flow = src.slice(src.indexOf('function flowBelowMap'));
	const flowBody = flow.slice(0, flow.indexOf('\n\tfunction ', 10)).replace(/^\s*\/\/.*$/gm, '');
	report(/document\.body\.getBoundingClientRect\(\)/.test(flowBody),
		'“below” is measured from the body’s content box');
	// documentElement.scrollHeight never reports less than the viewport, so once the page is
	// shorter than the window it measures the GAP rather than the content — and subtracting the gap
	// from the height that created it is circular. See map-height-harness.js, which reproduces the
	// 8px-per-pass shrink that produced Tom's photograph.
	report(!/scrollHeight/.test(flowBody), 'and never from scrollHeight, which is clamped to the viewport');
}

console.log('\n-- the strings exist --');
['lpn_help_fix', 'lpn_help_notes', 'lpn_examples_blank'].forEach(function (k) {
	report(en.indexOf(`$ec_lang['${k}']`) >= 0, `${k} is in lang.ec.en.php`);
});
{
	// Tom, 2026-08-14, choosing "map" over "drawing": the page calls itself a map everywhere else
	// (map height, map footer, map appearance), so a second word for the same thing was the odd
	// one out.
	const m = en.match(/\$ec_lang\['lpn_examples_blank'\]='([^']*)'/);
	report(!!m && /\bmap\b/.test(m[1]), 'the blank-canvas button says "map"', m && m[1]);
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
