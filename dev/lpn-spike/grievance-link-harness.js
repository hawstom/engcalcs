// "SOMETHING WRONG HERE?" -- ROADMAP Task 207 (Rung 0), made two clicks by Task 768. Run with:
//   node dev/lpn-spike/grievance-link-harness.js
//
// Since Task 768 the first click opens a box and posts nothing; Send with the box empty posts the
// row one press used to post, and that row is what sections 4 and 5 hold. What the box does with
// picks, an address and a comment is dev/lpn-spike/feedback-box-browser-harness.js, in a real
// browser, and the endpoint's guards are dev/lpn-spike/feedback-endpoint-harness.js.
//
// WHAT IS ACTUALLY AT RISK HERE, and none of it is visible from a browser pass:
//
//   1. **A CONTROL THAT POSTS ON ONE PRESS AND SENDS THE WRONG THING.** The whole design rests on
//      the payload being fixed and tiny -- page, served language, and a slug. Never a typed word,
//      never an address, and NEVER anything out of the user's drawing, because a node coordinate
//      says where their network is. Section 4 asserts the posted body key by key, so a future
//      "it would be so useful to also send the node count" cannot pass quietly.
//   2. **A SLUG THE ENDPOINT SILENTLY EATS.** log-signal-event.php strips the detail to a charset
//      and drops the row if the event is not in a closed set. Both are read OUT OF THAT FILE here
//      rather than retyped (section 2): a harness carrying its own copy of the rule would go on
//      passing after the rule changed, which is the exact failure it exists to prevent.
//   3. **A SECOND PRESS COUNTING TWICE.** The dedupe is EngCalcs.logSignal's own in-memory map,
//      and this harness runs THAT function -- lifted verbatim out of js/Calculators.lib.js -- with
//      only the network call replaced. Re-implementing the dedupe here would have tested nothing.
//   4. **setStatus() DELETING THE BUTTON.** The diagnostic box is written on a 300 ms debounce
//      after every keystroke, and it used to write the <p>'s own textContent. A sibling control in
//      that <p> would be deleted on the first solve and nobody would ever see it. Section 5 drives
//      the REAL solve on a network with no reservoir and asserts both that the text arrives and
//      that the button is still there.
//   5. **A THANK-YOU THAT PROMISES A REPLY.** The honesty boundary in dev/dilettante-path.md is
//      half the design. Section 6 reads the shipped English and asserts the tip says what is sent
//      and that neither string offers an answer that is not coming.
//
// AND THE CONSTRAINT THAT IS NOT ABOUT BEHAVIOUR AT ALL: **exactly two doors, and no third.**
// Task 542's elevation fill is the worked example of one capability growing three entry points;
// section 1 counts the doors in the rendered page.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');
const ROOT = path.join(__dirname, '..', '..');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// ================================================================================================
// 1. THE RENDERED PAGE -- both doors, and only those two
// ================================================================================================
// Rendered through dev/scripts/render_page.php, which is the only correct way to render a page
// outside a web request (CLAUDE.md, Testing). Reading Looped-Network.php as text would answer for
// the PHP source and not for what a visitor is served.
console.log('\n---- 1. the rendered page ----');
const html = execFileSync('php', [path.join(ROOT, 'dev/scripts/render_page.php'), 'Looped-Network.php'],
	{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const doors = (html.match(/class="lpn-wrong-btn/g) || []).length;
ok('exactly two grievance doors on the page, and no third', doors === 2, 'found ' + doors);
ok('the standing one is a cell of the map footer strip',
	html.indexOf('id="lpn_map_footer"') >= 0 &&
	html.indexOf('id="lpn_map_footer"') < html.indexOf('id="lpn_wrong_btn"'));
ok('...and it comes after the live readouts, so it never pushes one',
	html.indexOf('id="lpn_coords"') < html.indexOf('id="lpn_wrong_btn"'));
ok('the second one is inside the solver diagnostic box',
	html.indexOf('id="lpn_status"') < html.indexOf('id="lpn_wrong_status_btn"') &&
	html.indexOf('id="lpn_wrong_status_btn"') < html.indexOf('</p>', html.indexOf('id="lpn_status"')));
ok('the diagnostic box has its own text span, so a solve cannot delete the button',
	html.indexOf('id="lpn_status_text"') >= 0);
ok('the status door is hidden from a print, although the diagnostic around it is not',
	/id="lpn_wrong_status_btn"[^>]*class="[^"]*d-print-none/.test(html));

// Both are BUTTONS. Nothing navigates: an <a> here would be the five-step path this task exists
// to remove, and CLAUDE.md forbids parking a tip on a link's title in any case.
ok('both doors are buttons rather than links',
	/<button[^>]*id="lpn_wrong_btn"/.test(html) && /<button[^>]*id="lpn_wrong_status_btn"/.test(html));

// The tip is the helper's, which is what makes it reachable on a touch screen: initTips() wires
// long-press for a tip inside a control and hover for everything else, and it only ever looks at
// .ec-help[title].
// Scoped to the two buttons, not counted across the page: four other controls on this page end
// their label the same way, and a page-wide count would have said 4 and meant nothing.
function buttonInner(id) {
	const m = new RegExp('id="' + id + '"[^>]*>([\\s\\S]*?)</button>').exec(html);
	return m ? m[1] : '';
}
ok('each door carries a helper-built .ec-help tip, so touch can read it',
	['lpn_wrong_btn', 'lpn_wrong_status_btn'].every(function (id) {
		return (buttonInner(id).match(/<span class="ec-help" title="/g) || []).length === 1;
	}));
ok('...and exactly one "?" glyph inside each',
	['lpn_wrong_btn', 'lpn_wrong_status_btn'].every(function (id) {
		return (buttonInner(id).match(/<span class="ec-tip">/g) || []).length === 1;
	}));

ok('the thank-you reaches JS through the pageConfig bridge',
	/lpn_wrong_thanks:\s*"/.test(html));

// ================================================================================================
// 2. THE ENDPOINT'S OWN RULES, READ OUT OF THE ENDPOINT
// ================================================================================================
console.log('\n---- 2. log-signal-event.php accepts what we send ----');
const endpoint = fs.readFileSync(path.join(ROOT, 'log-signal-event.php'), 'utf8');
const allowMatch = /in_array\(\$event,\s*array\(([^)]*)\)/.exec(endpoint);
ok('the closed event set could be read out of the endpoint', !!allowMatch);
const allow = allowMatch ? allowMatch[1].match(/'([a-z]+)'/g).map((s) => s.replace(/'/g, '')) : [];
ok("'lpn' is already in the closed set, so no seventh event name was invented",
	allow.indexOf('lpn') >= 0, allow.join(','));

const detailMatch = /preg_replace\('#\[\^([^\]]*)\]#'/.exec(endpoint);
ok('the detail charset could be read out of the endpoint', !!detailMatch);
const keep = new RegExp('[^' + (detailMatch ? detailMatch[1] : 'A-Za-z0-9') + ']', 'g');
const capMatch = /strlen\(\$detail\) > (\d+)/.exec(endpoint);
const cap = capMatch ? parseInt(capMatch[1], 10) : 80;
['wrong:none', 'wrong:no-fixed-head', 'wrong:unreachable', 'wrong:valve-needs-epanet',
	'wrong:not-converged', 'wrong:unit-unknown', 'wrong:status'].forEach(function (slug) {
	ok('the endpoint keeps "' + slug + '" whole', slug.replace(keep, '') === slug && slug.length <= cap);
});

// ================================================================================================
// 3. THE REAL logSignal, WITH ONLY THE NETWORK REPLACED
// ================================================================================================
// Lifted verbatim from js/Calculators.lib.js -- the dedupe under test IS that function's, and a
// re-implementation here would pass forever after the shipped one changed.
console.log('\n---- 3. the transport ----');
const calcLib = fs.readFileSync(path.join(ROOT, 'js', 'Calculators.lib.js'), 'utf8');
const start = calcLib.indexOf('EngCalcs._signalSent = {};');
const end = calcLib.indexOf('\n};', start);
ok('EngCalcs.logSignal could be lifted out of js/Calculators.lib.js', start >= 0 && end > start);
const posts = [];
// The lpn event carries three kinds of row and only one of them is a person speaking. Task 200's
// 'first:' and 'diag:' rows are INSTRUMENTATION -- the page reporting on itself, written without
// anybody asking -- and a real solve emits one in section 5. Counting them here would have made
// this harness report a press that never happened, so the two are separated by name and section 5
// asserts that both are still written.
const wrongs = () => posts.filter((p) => String(p.params.detail).indexOf('wrong:') === 0);
global.EngCalcs = global.EngCalcs || {};
(0, eval)(calcLib.slice(start, end + 3));
global.EngCalcs.cookieName = 'Looped-Network';
global.EngCalcs._sendOrQueue = function (url, params) { posts.push({ url: url, params: params }); };
ok('...and it is the shipped one, posting to the shipped endpoint',
	typeof global.EngCalcs.logSignal === 'function');

// ================================================================================================
// 4. ONE PRESS, ONE ROW, AND NOTHING OUT OF THE DOCUMENT
// ================================================================================================
console.log('\n---- 4. the standing door ----');
const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\twireWrongButtons: wireWrongButtons, setStatus: setStatus, closeDialog: closeDialog,\n" +
	"\t\tstatusCode: function () { return statusWrongCode; },\n" +
	"\t\tstatusText: function () { return document.getElementById('lpn_status_text').textContent; },\n" +
	"\t\trunSolve: runSolve, getDoc: function () { return doc; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

// THE LABELS COME OUT OF THE RENDERED PAGE, not out of a literal here: the button's label is the
// helper-built tip markup, and the reset path in section 5 restores exactly that. Inventing a
// label here would be a stub removing the coupling it is meant to check.
byId.lpn_wrong_btn.innerHTML = buttonInner('lpn_wrong_btn');
byId.lpn_wrong_status_btn.innerHTML = buttonInner('lpn_wrong_status_btn');
ok('the page really ships a label for each door', !!byId.lpn_wrong_btn.innerHTML &&
	!!byId.lpn_wrong_status_btn.innerHTML);

// The thank-you the page hands JS, taken from the rendered pageConfig, so the string under test is
// the shipped one.
const thanks = JSON.parse(/lpn_wrong_thanks:\s*("(?:[^"\\]|\\.)*")/.exec(html)[1]);
global.EngCalcs.pageConfig = global.EngCalcs.pageConfig || {};
global.EngCalcs.pageConfig.lpn_wrong_thanks = thanks;

L.wireWrongButtons();
function press(id) {
	const btn = byId[id];
	(btn._listeners.click || []).forEach(function (fn) { fn({ type: 'click', target: btn }); });
}

ok('no other question is open before the click', byId.lpn_dialog.style.display !== 'block', byId.lpn_dialog.style.display + ' ' + (byId.lpn_dialog_body.children[0] || {}).textContent);
press('lpn_wrong_btn');
ok('the first click posts nothing: it opens the box (Task 768)', wrongs().length === 0, JSON.stringify(posts));
ok('...and the box is the page\'s own dialog', byId.lpn_dialog.style.display === 'block', byId.lpn_dialog.style.display);
ok('...and the button is still a control, not yet a thank-you', byId.lpn_wrong_btn.disabled !== true);
L.closeDialog();

// ================================================================================================
// 5. THE DIAGNOSTIC DOOR CARRIES THE CODE THAT WAS ON SCREEN
// ================================================================================================
// Driven through the REAL solve on a REAL network with its reservoir taken out, so the code under
// test is EngCalcs.lpnDiagnose's own and not a string typed here.
console.log('\n---- 5. the diagnostic door ----');
setUnitSet('us');
L.reset();
openExample(L);
const doc = L.getDoc();
doc.nodes = doc.nodes.filter(function (n) { return n.type !== 'reservoir' && n.type !== 'tank'; });
doc.links = doc.links.filter(function (l) {
	return doc.nodes.some(function (n) { return n.id === l.from; }) &&
		doc.nodes.some(function (n) { return n.id === l.to; });
});
L.runSolve();
ok('a network with no reservoir really does raise a diagnostic', !!L.statusText(), L.statusText());
ok('...and setStatus recorded the code the solver produced',
	L.statusCode() === 'no-fixed-head', L.statusCode());
ok('...and the diagnostic text did NOT delete the button beside it',
	byId.lpn_status.children.indexOf(byId.lpn_wrong_status_btn) >= 0);

ok('...and the solve wrote its OWN diag row, which is a different kind of row',
	posts.some((p) => p.params.detail === 'diag:no-fixed-head'),
	posts.map((p) => p.params.detail).join(' '));

// THE SECOND CLICK. Send with nothing picked or typed: the box's own Send button, pressed as a mouse
// would press it (detail 1). What it must post is exactly the row one press used to post.
function sendEmpty(id) {
	press(id);
	const send = byId.lpn_dialog_buttons.children[0];
	(send._listeners.click || []).forEach(function (fn) { fn({ type: 'click', target: send, detail: 1 }); });
}
// The standing door first: empty Send posts 'wrong:none' and thanks in place.
sendEmpty('lpn_wrong_btn');
ok('Send with nothing in the box posts one row, the standing slug', wrongs().length === 1 && wrongs()[0].params.detail === 'wrong:none',
	wrongs().map((p) => p.params.detail).join(' '));
ok('...and the body is page, lang, event and detail AND NOTHING ELSE',
	wrongs().length === 1 && Object.keys(wrongs()[0].params).sort().join(',') === 'detail,event,lang,page');
ok('...and the box closed', byId.lpn_dialog.style.display !== 'block');
ok('...and the label became the thank-you', byId.lpn_wrong_btn.textContent === thanks && byId.lpn_wrong_btn.disabled === true);
posts.splice(0, posts.length, ...posts.filter((p) => String(p.params.detail).indexOf('wrong:') !== 0));
global.EngCalcs._signalSent = {};

sendEmpty('lpn_wrong_status_btn');
ok('Send from the diagnostic box posts one grievance row', wrongs().length === 1, wrongs().length);
ok('...carrying the diagnostic code that was on screen',
	wrongs().length === 1 && wrongs()[0].params.detail === 'wrong:no-fixed-head',
	wrongs().length ? wrongs()[0].params.detail : '');
ok('...and still nothing else',
	wrongs().length === 1 && Object.keys(wrongs()[0].params).sort().join(',') === 'detail,event,lang,page');
press('lpn_wrong_status_btn');
ok('and pressing it again on the same message opens nothing: it is a thank-you now',
	wrongs().length === 1 && byId.lpn_dialog.style.display !== 'block', wrongs().length);

// A DIFFERENT MESSAGE IS A DIFFERENT THING TO REPORT. Refusing to hear about the second one would
// be the instrument measuring itself rather than the page.
L.setStatus('These nodes have no path to a reservoir: J5', 'unreachable');
ok('a new diagnostic offers the control again', byId.lpn_wrong_status_btn.disabled === false);
ok('...with its tip label restored, not left as the thank-you',
	byId.lpn_wrong_status_btn.innerHTML.indexOf('ec-help') >= 0);
sendEmpty('lpn_wrong_status_btn');
ok('...and it posts the new code',
	wrongs().length === 2 && wrongs()[1].params.detail === 'wrong:unreachable',
	wrongs().map((p) => p.params.detail).join(' '));

L.setStatus('These nodes have no path to a reservoir: J5', 'unreachable');
ok('the same message standing again does NOT re-offer it', byId.lpn_wrong_status_btn.disabled === true);

// A caller with no code says something that is not one of the diagnoses, and the slug says so.
L.setStatus('Loading the EPANET engine');
ok('a message that is not a diagnosis is reported as "status"', L.statusCode() === 'status', L.statusCode());
sendEmpty('lpn_wrong_status_btn');
ok('...and posts that slug',
	wrongs().length === 3 && wrongs()[2].params.detail === 'wrong:status',
	wrongs().map((p) => p.params.detail).join(' '));

L.setStatus('');
ok('clearing the box clears the text', L.statusText() === '');
ok('...and hides it', byId.lpn_status.style.display === 'none');
ok('...without taking the button away', byId.lpn_status.children.indexOf(byId.lpn_wrong_status_btn) >= 0);

// ================================================================================================
// 6. THE HONESTY BOUNDARY, IN THE SHIPPED ENGLISH
// ================================================================================================
// dev/dilettante-path.md: warmth and low cost are the entire technique. A thank-you that implies a
// reply is off the table, and a control that posts on one press must say what it posts.
console.log('\n---- 6. what the strings promise ----');
const en = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
function val(key) {
	const m = new RegExp("\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)';").exec(en);
	return m ? m[1].replace(/\\'/g, "'") : null;
}
const tip = val('lpn_wrong_tip');
const thanksEn = val('lpn_wrong_thanks');
const btnEn = val('lpn_wrong_btn');
const sendsEn = val('lpn_fb_sends');
const sendEn = val('lpn_fb_send');
ok('the button, tip and thank-you are defined in English', !!tip && !!thanksEn && !!btnEn);
// Task 768: the first click opens a box. The tip says so, says it is all optional, and says nothing
// goes until the box's own Send is pressed -- named by reading that button's label, not retyped.
ok('the tip says the click opens a box', /\bbox\b/i.test(tip), tip);
ok('...that everything in it is optional', /optional/i.test(tip), tip);
ok('...and that nothing goes until Send', !!sendEn && tip.indexOf(sendEn) >= 0, tip);
ok('the box says what it sends', !!sendsEn && /sends/i.test(sendsEn));
ok('...naming the page, the language, the site version, and the map message',
	/page/i.test(sendsEn) && /language/i.test(sendsEn) && /version/i.test(sendsEn) && /message/i.test(sendsEn), sendsEn);
ok('...and that the drawing is never sent', /never/i.test(sendsEn) && /drawing/i.test(sendsEn), sendsEn);
ok('...and that an address is used only to reply', /only/i.test(sendsEn) && /reply/i.test(sendsEn), sendsEn);
ok('the thank-you promises nothing', !/(reply|answer|respond|get back|soon|shortly)/i.test(thanksEn),
	thanksEn);
const fbKeys = ['lpn_fb_intro', 'lpn_fb_pick_numbers', 'lpn_fb_pick_broken', 'lpn_fb_pick_wording', 'lpn_fb_pick_confusing',
	'lpn_fb_comment', 'lpn_fb_email', 'lpn_fb_sends', 'lpn_fb_send', 'lpn_fb_sending', 'lpn_fb_failed', 'lpn_fb_bad_email', 'lpn_fb_busy'];
ok('every string the box shows is defined in English', fbKeys.every((k) => !!val(k)), fbKeys.filter((k) => !val(k)).join(','));
ok('...and reaches JS through the pageConfig bridge', fbKeys.every((k) => new RegExp(k + ':\\s*"').test(html)),
	fbKeys.filter((k) => !new RegExp(k + ':\\s*"').test(html)).join(','));
// The four canned phrases are the endpoint's closed set: the ids the page offers are the ids
// lib/FeedbackMail.lib.php accepts, read out of both files.
const lib = fs.readFileSync(path.join(ROOT, 'lib', 'FeedbackMail.lib.php'), 'utf8');
const libIds = (/function ecFeedbackPicks\(\)[\s\S]*?\);/.exec(lib) || [''])[0].match(/'([a-z]+)'\s*=>/g) || [];
const jsSrc = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const jsIds = (/var FEEDBACK_PICKS = \[([^\]]*)\]/.exec(jsSrc) || ['', ''])[1].match(/'([a-z]+)'/g) || [];
ok('the page offers exactly the picks the endpoint accepts',
	libIds.map((x) => x.replace(/'|\s*=>/g, '')).join(',') === jsIds.map((x) => x.replace(/'/g, '')).join(',') && jsIds.length === 4,
	libIds.join(' ') + ' / ' + jsIds.join(' '));
ok('...and each has its English label', jsIds.every((x) => !!val('lpn_fb_pick_' + x.replace(/'/g, ''))));
ok('no em dash in any of them, which is the one surviving advisory',
	[tip, thanksEn, btnEn].concat(fbKeys.map(val)).every(function (v) { return !v || v.indexOf('—') < 0; }));

// **AN ABSENT KEY IS THE CORRECT UNTRANSLATED STATE, AND A TRANSLATED ONE IS THE CORRECT TRANSLATED
// STATE.** This asserted the three keys were in `lang.ec.en.php` ALONE, which was true while they
// were new and stopped being true the moment sprint 584-wave1 translated them -- so it failed on the
// sprint doing its job, which is the worst kind of red. The comment above it always named the real
// rule and the assertion did not: what blocks the build is a byte-IDENTICAL copy in another
// language file, never a genuine translation. That is the rule now asserted.
const wrongKeys = ["lpn_wrong_tip", "lpn_wrong_thanks", "lpn_wrong_btn"].concat(fbKeys);
const enVals = {};
wrongKeys.forEach(function (k) {
	const m = new RegExp("\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)';").exec(en);
	if (m) { enVals[k] = m[1]; }
});
const strays = [];
fs.readdirSync(path.join(ROOT, 'lib'))
	.filter(function (f) { return /^lang\.ec\.[a-z]{2}\.php$/.test(f) && f !== 'lang.ec.en.php'; })
	.forEach(function (f) {
		const txt = fs.readFileSync(path.join(ROOT, 'lib', f), 'utf8');
		wrongKeys.forEach(function (k) {
			if (enVals[k] === undefined) { return; }
			const m = new RegExp("\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)';").exec(txt);
			if (m && m[1] === enVals[k]) { strays.push(f + ':' + k); }
		});
	});
ok('no language file carries a byte-identical copy of any of the three', strays.length === 0, strays.join(','));

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'ALL PASS'));
process.exit(fails ? 1 : 0);
