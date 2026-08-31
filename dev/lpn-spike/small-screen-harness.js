// THE SMALL-SCREEN PRESENTATION PASS (ROADMAP Task 486), asserted against Net3. Run with:
//   node dev/lpn-spike/small-screen-harness.js
//
// Tom, 2026-08-22, gave four concessions "for both crawlers and humans if they are on a
// mobile/small screen": hide page titles, hide or at least collapse the HawsEDC navbar, hide all
// the toolbar buttons except for the transport, and drop the menu bar to icons. This checks all
// four, and it checks the regression they could cause, which is the expensive one:
//
//   **A MEDIA QUERY THAT LEAKS UPWARD IS INVISIBLE TO WHOEVER WROTE IT AND OBVIOUS TO TOM.**
//   Every element named below is asserted VISIBLE at 1200px as well as hidden at 360px, and
//   asserted visible on a page that is not this one at BOTH widths -- css/engcalcs.css is
//   app-wide, and fifteen other calculators are a form and an answer whose titles must stay.
//
// WHY IT READS THE STYLESHEET RATHER THAN CHECKING FOR A CLASS NAME. Asserting that some class was
// applied proves nothing about whether anything is hidden; the question is whether a RULE FIRES on
// the element the code actually built. So this parses css/engcalcs.css into rules with their media
// conditions, builds the real menu bar and toolbar through js/looped-network.js, and asks the two
// together. Same shape as dev/lpn-spike/label-visibility-harness.js section 4, and the reader
// carries its own self-test for the same reason: a reader that has silently stopped understanding
// the rule it is aimed at would report ALL PASS forever.
//
// WHY Net3. Tom: "It would be nice to test on Net3, which is our most robust model, if possible."
// It is the fixture because it is the network that makes the concession MEAN something -- 97 nodes,
// 119 links and a 24-hour duration, so the transport this pass keeps is LIVE (25 reporting stops,
// three enabled player controls) rather than the inert three-button strip a duration-less toy would
// have kept. A harness that kept three disabled buttons would have proved nothing.
//
// AND THE CONSTRAINT THAT IS NOT ABOUT PIXELS: every button the toolbar hides must still be
// reachable from a menu. That is checked by opening all six menus for real and comparing the
// labels, not by reading the source -- see section 5.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const ROOT = stub.ROOT;

// js/lpn-time.js owns the transport, and js/looped-network.js mounts it through
// EngCalcs.lpnTimeMountToolbar -- absent, the run group would be built EMPTY and every assertion
// about the transport would pass on nothing at all.
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// ============================================================================================
// 1. THE STYLESHEET READER
// ============================================================================================
// Rules with the media conditions they are wrapped in. One level of nesting is all this file has.
const CSS_PATH = path.join(ROOT, 'css', 'engcalcs.css');
function cssRules(src) {
	const text = src.replace(/\/\*[\s\S]*?\*\//g, '');
	const out = [];
	let i = 0;
	while (i < text.length) {
		const open = text.indexOf('{', i);
		if (open < 0) { break; }
		const prelude = text.slice(i, open).trim();
		// **`@container` IS READ AS A WRAPPER TOO, and that is not a nicety** (2026-08-24): the
		// prelude of an unrecognised at-rule falls through to the ordinary-rule path, where it becomes
		// a SELECTOR and its inner rules leak out unconditional. One container query in this
		// stylesheet then read as an always-applying rule and broke four desktop assertions.
		if (prelude.startsWith('@media') || prelude.startsWith('@supports') || prelude.startsWith('@container')) {
			// Walk to the matching close brace and read the rules inside as a block.
			let depth = 0, end = open;
			for (; end < text.length; end++) {
				if (text[end] === '{') { depth++; }
				else if (text[end] === '}') { depth--; if (depth === 0) { break; } }
			}
			const inner = text.slice(open + 1, end);
			cssRules(inner).forEach((r) => {
				out.push({ sel: r.sel, body: r.body, media: [prelude].concat(r.media) });
			});
			i = end + 1;
			continue;
		}
		const close = text.indexOf('}', open);
		if (close < 0) { break; }
		prelude.split(',').forEach((s) => {
			if (s.trim()) { out.push({ sel: s.trim(), body: text.slice(open + 1, close), media: [] }); }
		});
		i = close + 1;
	}
	return out;
}

// Does a rule's media wrapper apply to an ordinary screen this many CSS pixels wide?
// `print`, `prefers-color-scheme` and `prefers-reduced-motion` are all declared NOT to apply --
// this harness is about the screen a person is looking at. @supports always applies: every
// condition in this file is one every current engine satisfies.
// **AND A POINTER DIMENSION, because a media query is a viewport test and a touch test is not one.**
// The spinner-removal half of Tom's item (8) is asked as `(hover: none) and (pointer: coarse)`,
// nested inside the width block; a reader that ignored those two conditions would answer "it
// applies" at every width and prove the opposite of what the nesting is for.
function mediaApplies(media, widthPx, touch) {
	return media.every((q) => {
		if (q.startsWith('@supports')) { return true; }
		// **A CONTAINER QUERY IS NOT A VIEWPORT TEST, so this harness declares it does not apply.**
		// It measures a PANEL the user can drag, and every question here is asked in viewport pixels;
		// answering it against `widthPx` would be answering a different question and calling it this
		// one. The Settings box's own container queries are measured where they can be measured
		// honestly, in a real browser: dev/browser-pass/specs/labelcols.js.
		if (q.startsWith('@container')) { return false; }
		if (/\bprint\b/.test(q)) { return false; }
		if (/prefers-/.test(q)) { return false; }
		if (/hover:\s*none/.test(q) && !touch) { return false; }
		if (/pointer:\s*coarse/.test(q) && !touch) { return false; }
		if (/hover:\s*hover/.test(q) && touch) { return false; }
		if (/pointer:\s*fine/.test(q) && touch) { return false; }
		let m = /max-width:\s*([0-9.]+)px/.exec(q);
		if (m && !(widthPx <= parseFloat(m[1]))) { return false; }
		m = /min-width:\s*([0-9.]+)px/.exec(q);
		if (m && !(widthPx >= parseFloat(m[1]))) { return false; }
		m = /max-width:\s*([0-9.]+)rem/.exec(q);
		if (m && !(widthPx <= parseFloat(m[1]) * 16)) { return false; }
		return true;
	});
}

// ---- selector matching, over the shapes this stylesheet actually uses ----------------------
// A node is { tag, id, cls: [], parent }. Supported: descendant and `>` combinators; compounds of
// a tag name, #id, .class, :not(<simple>) and :has(#id). Anything else is UNREADABLE and is
// reported rather than silently answered false, which is what would turn this file green forever.
const unreadable = new Set();
function compound(part) {
	const toks = part.match(/(::?[a-z-]+\([^)]*\)|::?[a-z-]+|[#.][A-Za-z0-9_-]+|^[a-z][a-z0-9]*|\*)/g);
	if (!toks || toks.join('') !== part) { return null; }
	const spec = { tag: null, ids: [], cls: [], not: [], has: [], nth: [], last: false, state: null };
	for (const t of toks) {
		if (t === '*') { continue; }
		else if (t[0] === '#') { spec.ids.push(t.slice(1)); }
		else if (t[0] === '.') { spec.cls.push(t.slice(1)); }
		// **:nth-child COUNTS ELEMENTS, NOT VISIBLE ONES**, which is why the labels heading row can
		// lose its lead cell to `display: none` and still have its four headings matched as children
		// 2-5. A reader that renumbered would report the columns lining up where they do not.
		else if (t.startsWith(':nth-child(')) {
			const n = t.slice(11, -1).trim();
			if (!/^[0-9]+$/.test(n)) { return null; }
			spec.nth.push(+n);
		} else if (t === ':first-child') { spec.nth.push(1); }
		else if (t === ':last-child') { spec.last = true; }
		// **A STATE THIS READER IS ENTITLED TO DECLARE FALSE.** Nothing here is hovered, focused,
		// pressed, disabled or checked -- these are rules about a moment, and every question this
		// file asks is about the resting page. Declaring it is what keeps such a selector out of the
		// blind-spot report, where it would read as a rule the reader could not understand.
		else if (/^:(hover|focus|focus-visible|active|disabled|enabled|checked|visited|target)$/.test(t)) {
			spec.state = false;
		}
		// A PSEUDO-ELEMENT IS NOT AN ELEMENT IN THIS TREE. `::-webkit-inner-spin-button` styles a
		// part the browser draws inside an <input>; no node here is it, and no question this file
		// asks is about one. Declared rather than left unreadable, for the same reason as above.
		else if (t.startsWith('::')) { spec.state = false; }
		else if (t.startsWith(':not(')) {
			const inner = compound(t.slice(5, -1));
			if (!inner) { return null; }
			spec.not.push(inner);
		} else if (t.startsWith(':has(')) {
			const inner = t.slice(5, -1);
			if (inner[0] !== '#') { return null; }
			spec.has.push(inner.slice(1));
		} else if (/^[a-z]/.test(t)) { spec.tag = t; }
		else { return null; }
	}
	return spec;
}
// 1-based position among the parent's element children. A node with no parent is an only child.
function childIndex(node) {
	if (!node.parent) { return 1; }
	return node.parent.children.indexOf(node) + 1;
}
function matchesCompound(node, spec, docIds) {
	if (!spec) { return false; }
	if (spec.tag && node.tag !== spec.tag) { return false; }
	if (spec.ids.some((id) => node.id !== id)) { return false; }
	if (spec.cls.some((c) => node.cls.indexOf(c) < 0)) { return false; }
	if (spec.not.some((n) => matchesCompound(node, n, docIds))) { return false; }
	if (spec.has.some((id) => docIds.indexOf(id) < 0)) { return false; }
	if (spec.nth.some((n) => childIndex(node) !== n)) { return false; }
	if (spec.last && node.parent && childIndex(node) !== node.parent.children.length) { return false; }
	if (spec.state === false) { return false; }
	return true;
}
function matches(node, sel, docIds) {
	const parts = sel.replace(/\s*>\s*/g, ' > ').split(/\s+/).filter(Boolean);
	const specs = [];
	for (const p of parts) {
		if (p === '>') { specs.push('>'); continue; }
		const c = compound(p);
		if (!c) { unreadable.add(sel); return false; }
		specs.push(c);
	}
	// Walk the selector from its right-hand end back up the ancestor chain.
	let idx = specs.length - 1, cur = node;
	if (!matchesCompound(cur, specs[idx], docIds)) { return false; }
	idx--;
	while (idx >= 0) {
		const child = specs[idx] === '>';
		if (child) { idx--; }
		const want = specs[idx];
		idx--;
		if (child) {
			cur = cur.parent;
			if (!cur || !matchesCompound(cur, want, docIds)) { return false; }
		} else {
			let a = cur.parent, found = null;
			while (a) { if (matchesCompound(a, want, docIds)) { found = a; break; } a = a.parent; }
			if (!found) { return false; }
			cur = found;
		}
	}
	return true;
}

// A node is hidden at this width if any applying rule matching it OR an ancestor says so.
function hiddenAt(RULES, node, widthPx, docIds, touch) {
	for (let n = node; n; n = n.parent) {
		for (const r of RULES) {
			if (!/display:\s*none/.test(r.body)) { continue; }
			if (!mediaApplies(r.media, widthPx, touch)) { continue; }
			if (matches(n, r.sel, docIds)) { return r; }
		}
	}
	return null;
}
// **WHICH DECLARATION ACTUALLY WINS**, which declaredAt() below does not ask: it answers with the
// FIRST match in the file, and every width in the labels lists is declared twice -- once near the
// top of the stylesheet for the desktop and once in the small-screen block. Asking the first would
// report the desktop width at 360 px, on a rule that never fires there.
//
// Order and importance only, not specificity. Every pair this is used on is `!important` against
// `!important` or bare against bare, and the small-screen selector carries the extra
// `html:has(#lpn_canvas)`, so it wins on specificity as well as on order and the two answers cannot
// disagree. An unreadable selector is reported by the blind-spot check at the foot of the file.
function winning(RULES, node, widthPx, docIds, touch, prop) {
	const re = new RegExp('(?:^|;)\\s*' + prop + ':\\s*([^;]+)');
	let best = null;
	for (const r of RULES) {
		if (!mediaApplies(r.media, widthPx, touch)) { continue; }
		const m = re.exec(r.body);
		if (!m) { continue; }
		if (!matches(node, r.sel, docIds)) { continue; }
		const val = m[1].trim(), imp = /!important/.test(val);
		if (best && best.imp && !imp) { continue; }
		best = { val: val.replace(/!important/, '').trim(), imp: imp };
	}
	return best ? best.val : null;
}
// Any applying rule that matches this node and declares the property -- used for the navbar,
// which is COLLAPSED rather than hidden, so "is it display:none" is the wrong question.
function declaredAt(RULES, node, widthPx, docIds, prop, touch) {
	const re = new RegExp(prop + ':\\s*([^;]+)');
	for (const r of RULES) {
		if (!mediaApplies(r.media, widthPx, touch)) { continue; }
		const m = re.exec(r.body);
		if (m && matches(node, r.sel, docIds)) { return m[1].trim(); }
	}
	return null;
}

// ============================================================================================
// 2. THE PAGE, half read from source and half built by the real code
// ============================================================================================
// The chrome PHP emits is modelled from the source that emits it -- never from a list typed here,
// which would drift the day somebody renames a class. Missing marker => a loud failure, not a
// silently absent element (the exact way dev/lpn-spike/page-titles-harness.js's bug hid).
function elFromSource(file, marker, label) {
	const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
	const re = new RegExp('<([a-z][a-z0-9]*)\\b([^>]*' + marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^>]*)>');
	const m = re.exec(src);
	ok('markup for ' + label + ' is still in ' + file, !!m, 'looked for ' + marker);
	if (!m) { return { tag: 'div', id: '', cls: [] }; }
	const attrs = m[2];
	const id = (/\sid="([^"]*)"/.exec(attrs) || [, ''])[1];
	const cls = (/\sclass="([^"]*)"/.exec(attrs) || [, ''])[1];
	return { tag: m[1], id: id, cls: cls.split(/\s+/).filter(Boolean) };
}

console.log('--- the chrome this pass touches is still where the pass thinks it is ---');
const SRC = {
	title: elFromSource('lib/HeadersFooters.lib.php', 'id="ec-page-title"', 'the page h1'),
	welcome: elFromSource('lib/HeadersFooters.lib.php', 'id="ec-page-welcome"', 'the welcome line'),
	desc: elFromSource('Looped-Network.php', 'id="ec-page-desc"', 'the page description'),
	navbar: elFromSource('lib/Menus.lib.php', 'class="navbar navbar-expand-lg', 'the HawsEDC navbar'),
	brand: elFromSource('lib/Menus.lib.php', 'class="navbar-brand"', 'the navbar brand'),
	libre: elFromSource('lib/Menus.lib.php', 'class="ec-nav-libre"', 'the Libre Software mark')
};

function node(tag, id, cls, parent) {
	const n = { tag: tag, id: id || '', cls: cls || [], parent: parent || null, children: [] };
	if (parent) { parent.children.push(n); }
	return n;
}
function fromSrc(s, parent) { return node(s.tag, s.id, s.cls, parent); }
// Adapt a stub element (and its subtree) into a model node.
function adopt(el, parent) {
	const n = node(String(el._tag || 'div').toLowerCase(), el.id || '',
		String(el.getAttribute('class') || '').split(/\s+/).filter(Boolean), parent);
	n.el = el;
	(el.children || []).forEach((c) => { if (c.nodeType === 1) { adopt(c, n); } });
	return n;
}
function idsIn(root) {
	const out = [];
	(function walk(n) { if (n.id) { out.push(n.id); } n.children.forEach(walk); }(root));
	return out;
}

// ---- the real menu bar and toolbar, over Net3 ----------------------------------------------
const L = stub.loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, setDoc: function (d) { doc = d; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
		"\t\tbuildMenuBar: buildMenuBar, wireToolbar: wireToolbar,\n" +
		// Section 7 drives the map's height arithmetic directly, and section 8 builds the two
		// symbology lists with the real builder rather than modelling their rows here -- a modelled
		// row would keep passing the day labelCheckbox() adds a column.
		"\t\teffectiveMapHeight: function () { return effectiveMapHeight(); },\n" +
		"\t\trebuildLabelsFields: rebuildLabelsFields,\n" +
	// **THE MENUS, OPENED FOR REAL.** openMenu() is swapped for a collector rather than the row
	// arrays being read out of the source text: a source read would pass on a row that throws, and
	// would miss a row assembled conditionally (File's Save/Save as, View's basemap pair).
	"\t\tmenuRows: function (which) {\n" +
	"\t\t\tvar out = [], real = openMenu, opener = { file: openFileMenu, edit: openEditMenu, map: openMapMenu, project: openProjectBarMenu, help: openHelpMenu }[which];\n" +
	"\t\t\topenMenu = function (a, rows) { out = rows; };\n" +
	"\t\t\ttry { opener(document.getElementById('lpn_menu_' + which)); } finally { openMenu = real; }\n" +
	"\t\t\treturn out; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
stub.setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

const NET3 = JSON.parse(fs.readFileSync(
	path.join(ROOT, 'dev', 'water-network-examples', 'Net3.lwn'), 'utf8'));
L.setDoc(NET3);
L.buildMenuBar();
L.wireToolbar();

console.log('\n--- Net3 is the fixture, and it is the one that makes the transport mean something ---');
ok('Net3 opened with its whole network', NET3.nodes.length === 97 && NET3.links.length === 119,
	NET3.nodes.length + ' nodes, ' + NET3.links.length + ' links');
const STOPS = global.EngCalcs.lpnReportTimes(NET3.times);
ok('...and its 24-hour clock, so this is an extended-period run', STOPS.length === 25,
	STOPS.length + ' reporting stops');

// The page as the browser assembles it.
const html = node('html');
const body = node('body', '', [], html);
const navbar = fromSrc(SRC.navbar, body);
const brandgroup = node('span', '', ['ec-brandgroup'], navbar);
const brand = fromSrc(SRC.brand, brandgroup);
const libre = fromSrc(SRC.libre, brandgroup);
const h1 = fromSrc(SRC.title, body);
const welcome = fromSrc(SRC.welcome, body);
const desc = fromSrc(SRC.desc, body);
const menubar = adopt(stub.byId.lpn_menubar, body);
const toolbar = adopt(stub.byId.lpn_toolbar, body);
node('svg', 'lpn_canvas', [], body);
// Attribution is a licence condition and is never chrome. Modelled so it can be ASSERTED visible.
const credit = node('div', 'lpn_basemap_credit', [], body);
const DOC_IDS = idsIn(html);

// The same chrome on a page that is NOT this one -- no #lpn_canvas anywhere in it.
const other = node('html');
const otherBody = node('body', '', [], other);
const otherNav = fromSrc(SRC.navbar, otherBody);
const otherLibre = fromSrc(SRC.libre, node('span', '', ['ec-brandgroup'], otherNav));
const otherH1 = fromSrc(SRC.title, otherBody);
const otherDesc = node('h2', 'ec-page-desc', [], otherBody);
const OTHER_IDS = idsIn(other);

const RULES = cssRules(fs.readFileSync(CSS_PATH, 'utf8'));

// ============================================================================================
// 3. THE READER'S OWN GUARD
// ============================================================================================
console.log('\n--- the stylesheet reader can evaluate the shapes this pass is written in ---');
ok('css/engcalcs.css parsed into rules at all', RULES.length > 200, RULES.length + ' rules');
{
	const probe = [{ sel: 'html:has(#lpn_canvas) .zzz', body: 'display: none;', media: ['@media (max-width: 640px)'] }];
	ok('a `:has()`-scoped descendant rule inside a media query fires below the breakpoint',
		!!hiddenAt(probe, node('i', '', ['zzz'], body), 360, DOC_IDS));
	ok('...and does NOT fire above it',
		!hiddenAt(probe, node('i', '', ['zzz'], body), 1200, DOC_IDS));
	ok('...and does NOT fire on a page with no #lpn_canvas',
		!hiddenAt(probe, node('i', '', ['zzz'], otherBody), 360, OTHER_IDS));
	const np = [{ sel: '#lpn_toolbar button:not(.keepme)', body: 'display: none;', media: [] }];
	const tb = node('div', 'lpn_toolbar', [], body);
	ok('a `:not(.class)` rule hides the button without the class',
		!!hiddenAt(np, node('button', '', [], tb), 360, DOC_IDS));
	ok('...and spares the one with it',
		!hiddenAt(np, node('button', '', ['keepme'], tb), 360, DOC_IDS));
	const cp = [{ sel: '#lpn_toolbar > .grp:not(#keep)', body: 'display: none;', media: [] }];
	ok('a `>` child rule reads the parent, not any ancestor',
		!!hiddenAt(cp, node('span', '', ['grp'], tb), 360, DOC_IDS) &&
		!hiddenAt(cp, node('span', '', ['grp'], node('div', '', [], tb)), 360, DOC_IDS));
}

// ============================================================================================
// 4. TOM'S FOUR ITEMS
// ============================================================================================
const SMALL = 360;   // a phone held upright
const WIDE = 1200;   // the desktop this page is designed for
function bothWays(label, n, ids) {
	const h = hiddenAt(RULES, n, SMALL, ids);
	ok(label + ' is hidden on a small screen', !!h, h ? '' : 'no display:none rule reaches it');
	ok('...' + label + ' is UNTOUCHED on the desktop', !hiddenAt(RULES, n, WIDE, ids));
}

console.log('\n--- 1. the page titles ---');
bothWays('the page h1', h1, DOC_IDS);
bothWays('the welcome line', welcome, DOC_IDS);
bothWays('the page description', desc, DOC_IDS);

console.log('\n--- 2. the navbar is COLLAPSED, not hidden (Tom: "hide or at least collapse") ---');
// Hiding it outright would take the language picker and the other fifteen calculators off the
// phone, which are the only routes to either. So the assertion is that its HEIGHT goes and it
// itself stays -- and that is a different question from display:none, asked differently.
ok('the navbar itself is still there on a small screen', !hiddenAt(RULES, navbar, SMALL, DOC_IDS));
ok('...with its vertical padding taken away',
	declaredAt(RULES, navbar, SMALL, DOC_IDS, 'padding-top') === '0' &&
	declaredAt(RULES, navbar, SMALL, DOC_IDS, 'padding-bottom') === '0');
ok('...and nothing of the sort on the desktop',
	declaredAt(RULES, navbar, WIDE, DOC_IDS, 'padding-top') === null);
ok('the brand is shrunk, not removed', !hiddenAt(RULES, brand, SMALL, DOC_IDS) &&
	declaredAt(RULES, brand, SMALL, DOC_IDS, 'font-size') !== null);
ok('...and is its full size on the desktop', declaredAt(RULES, brand, WIDE, DOC_IDS, 'font-size') === null);
bothWays('the Libre Software wordmark', libre, DOC_IDS);

console.log('\n--- 3. the toolbar keeps the transport and nothing else ---');
{
	const buttons = [];
	(function walk(n) { if (n.tag === 'button') { buttons.push(n); } n.children.forEach(walk); }(toolbar));
	ok('the real toolbar was built and has its whole strip', buttons.length >= 20, buttons.length + ' buttons');
	const transport = buttons.filter((b) => b.cls.indexOf('lpn-transport-btn') >= 0);
	ok('...including exactly the three player controls', transport.length === 3,
		transport.map((b) => b.el.getAttribute('aria-label')).join(', '));
	transport.forEach((b) => {
		const nm = b.el.getAttribute('aria-label');
		ok('the transport keeps ' + nm, !hiddenAt(RULES, b, SMALL, DOC_IDS));
		ok('...and ' + nm + ' is enabled on Net3, so it is a live control and not a stub', !b.el.disabled);
	});
	const gone = buttons.filter((b) => b.cls.indexOf('lpn-transport-btn') < 0);
	gone.forEach((b) => {
		const nm = b.el.getAttribute('aria-label') || b.id || '(unnamed)';
		ok('the toolbar drops ' + nm, !!hiddenAt(RULES, b, SMALL, DOC_IDS));
		ok('...and keeps ' + nm + ' on the desktop', !hiddenAt(RULES, b, WIDE, DOC_IDS));
	});
	// THE STEP SELECTOR IS THE ONLY CONTROL THAT SAYS WHICH MOMENT IS SHOWING. A transport you
	// cannot read is not a transport, so the two <select>s stay -- and they are not buttons, which
	// is the literal shape of what Tom asked to hide.
	const selects = [];
	(function walk(n) { if (n.tag === 'select') { selects.push(n); } n.children.forEach(walk); }(toolbar));
	ok('both time selectors survive', selects.length === 2 &&
		selects.every((s) => !hiddenAt(RULES, s, SMALL, DOC_IDS)),
		selects.map((s) => s.id).join(', '));
	ok('...and the step selector is live on Net3',
		selects.some((s) => s.id === 'lpn_time_step' && !s.el.disabled));
}

console.log('\n--- 4. the menu bar drops to icons ---');
{
	const items = menubar.children;
	// FIVE since 2026-08-27: File, Edit, Map, Water, Help. Insert was deleted and its asset rows are
	// a submenu of Water (Task 543).
	ok('the real menu bar was built', items.length === 5, items.length + ' menus');
	items.forEach((b) => {
		const name = b.el.getAttribute('aria-label');
		const word = b.children.filter((c) => c.cls.indexOf('lpn-menubar-word') >= 0)[0];
		const icon = b.children.filter((c) => c.tag === 'svg' || c.tag === 'g')[0];
		ok(b.id + ' carries its name as an aria-label', !!name && name.length > 0);
		ok('...' + b.id + ' has the word in an element a rule can reach', !!word);
		ok('...' + b.id + ' says the same thing in both', !!word && word.el.textContent === name);
		ok('...' + b.id + ' has an icon to survive on', !!icon);
		if (word) {
			ok('...' + b.id + '\'s word goes on a small screen', !!hiddenAt(RULES, word, SMALL, DOC_IDS));
			ok('...' + b.id + '\'s word stays on the desktop', !hiddenAt(RULES, word, WIDE, DOC_IDS));
		}
		ok('...' + b.id + ' itself is never hidden at either width',
			!hiddenAt(RULES, b, SMALL, DOC_IDS) && !hiddenAt(RULES, b, WIDE, DOC_IDS));
		if (icon) { ok('...' + b.id + '\'s icon is never hidden', !hiddenAt(RULES, icon, SMALL, DOC_IDS)); }
	});
}

// ============================================================================================
// 5. NOTHING THE TOOLBAR HIDES LEAVES THE APPLICATION
// ============================================================================================
console.log('\n--- every hidden toolbar command is still on a menu ---');
{
	const labels = new Set();
	// Five menus, not six: Insert was deleted 2026-08-27 and its rows are now a submenu of Water,
	// which this walk reaches through the fly-out branch below (Task 543).
	['file', 'edit', 'map', 'project', 'help'].forEach((which) => {
		const rows = L.menuRows(which);
		ok('the ' + which + ' menu opens and has rows', rows.length > 0);
		(function flat(rs) {
			rs.forEach((r) => {
				// **A ROW THAT DOES NOTHING IS NOT A ROUTE.** Help > "What the toolbar icons mean"
				// is derived from the strip itself and gives every toolbar button a row with an
				// empty `fn` -- so counting it would make this whole section a tautology: every
				// button would be "reachable from a menu" because the legend lists it. Found by
				// mutation: deleting Edit > Select left this section green.
				const inert = typeof r.fn === 'function' &&
					/^function\s*\w*\s*\(\s*\)\s*\{\s*\}$/.test(String(r.fn));
				if (r.label && !inert) { labels.add(String(r.label)); }
				// A fly-out is either its rows or a function that builds them on open (Task 264).
				const sub = typeof r.submenu === 'function' ? r.submenu() : r.submenu;
				if (Array.isArray(sub)) { flat(sub); }
			});
		}(rows));
	});
	const buttons = [];
	(function walk(n) { if (n.tag === 'button') { buttons.push(n); } n.children.forEach(walk); }(toolbar));
	// **THE ONE EXEMPTION, AND IT IS CHECKED RATHER THAN ASSERTED.** The bottom-pane button is a
	// pressed/unpressed TOGGLE and there is no menu row that toggles a pane; what a user needs is a
	// way to OPEN the pane and a way to close it, and both exist -- Project > Profile and
	// Project > Tables open it, the pane's own X closes it. So the exemption is spelled as the two
	// rows that carry it, and if either row ever leaves the menus this fails.
	const EXEMPT = { 'Bottom panel': ['Profile', 'Tables'] };
	buttons.filter((b) => b.cls.indexOf('lpn-transport-btn') < 0).forEach((b) => {
		const nm = b.el.getAttribute('aria-label');
		if (EXEMPT[nm]) {
			ok(nm + ' has no menu twin, and the rows that stand in for it are both there',
				EXEMPT[nm].every((alt) => labels.has(alt)), EXEMPT[nm].join(' / '));
			return;
		}
		ok(nm + ' is still reachable from a menu', labels.has(nm));
	});
}

// ============================================================================================
// 6. THE REGRESSION THIS TASK COULD CAUSE
// ============================================================================================
console.log('\n--- nothing leaks to the other fifteen calculators ---');
[[otherH1, 'the h1'], [otherDesc, 'the page description'], [otherNav, 'the navbar'],
	[otherLibre, 'the Libre Software mark']].forEach(([n, label]) => {
	// The Libre mark's own suite-wide 400px rule is real and predates this task, so the question
	// asked of a non-map page is the one this task could have broken: nothing new at 360-640px.
	const at640 = hiddenAt(RULES, n, 640, OTHER_IDS);
	ok('on a page that is not the map editor, ' + label + ' survives a 640px window',
		!at640, at640 ? at640.sel : '');
});
ok('...and the navbar there keeps its padding', declaredAt(RULES, otherNav, 360, OTHER_IDS, 'padding-top') === null);

// **THE SATELLITE TEASER SURVIVES THE PHONE, AND THAT IS A DECISION.** The small-screen pass takes
// the whole toolbar away and reduces the menu bar to icons, so a phone reader has strictly fewer
// routes to the satellite row than a desktop one -- taking the corner control off the device with
// the fewest routes is backwards. It costs one 40px square in a strip that is already on screen.
console.log('\n--- what may never be hidden at any width ---');
const teaser = node('button', 'lpn_basemap_teaser', ['lpn-basemap-teaser'],
	node('div', 'lpn_map_footer', ['d-print-none'], body));
[[credit, 'the basemap attribution'], [teaser, 'the satellite teaser']].forEach(([n, label]) => {
	ok(label + ' is visible on a small screen', !hiddenAt(RULES, n, SMALL, DOC_IDS));
	ok('...' + label + ' is visible on the desktop', !hiddenAt(RULES, n, WIDE, DOC_IDS));
});


// ============================================================================================
// 7. THE MAP HEIGHT AGREES WITH THE HEIGHT THE USER CAN SEE (Tom's item 11)
// ============================================================================================
// Tom, 2026-08-22: *"The legends think they have more room at the bottom than they do, and they are
// running off the bottom of the map. Only on small screen. This can't be scrolled."*
//
// **THE LEGENDS WERE NEVER WRONG.** Both are `bottom: 4px` inside the map wrapper, so a legend is at
// the map's bottom by construction and nothing about it can drift. What was wrong is the map's own
// height: effectiveMapHeight() measured `window.innerHeight`, and a mobile browser reports that for
// the LARGE viewport -- the page as it would be if the address bar and the bottom toolbar were out
// of the way. So the canvas was sized to include a strip of page that is behind the browser's own
// furniture, and everything anchored to its bottom went there with it, unreachable because the
// canvas swallows touches (`touch-action: none`) and the root does not scroll (Task 432).
//
// This section asks the arithmetic directly, with the layout MODELLED rather than measured -- the
// stub's rects are constants, and a constant rect is the stub failure dev/testing-notes.md names.
// The one physical relationship modelled here is the only one the formula reads: the canvas starts
// `above` pixels down and `below` pixels of page follow it, so body.bottom is canvas.bottom + below.
console.log('\n--- the map is never taller than the viewport the user can actually see ---');
{
	const canvas = stub.byId.lpn_canvas;
	const realCanvasRect = canvas.getBoundingClientRect;
	const realBodyRect = global.document.body.getBoundingClientRect;
	const ABOVE = 156, BELOW = 0, APPLIED = 600;
	const layout = function (layoutH, visibleH) {
		canvas.getBoundingClientRect = () => ({ left: 0, top: ABOVE, right: 360, bottom: ABOVE + APPLIED, width: 360, height: APPLIED });
		global.document.body.getBoundingClientRect = () => ({ left: 0, top: 0, right: 360, bottom: ABOVE + APPLIED + BELOW, width: 360, height: ABOVE + APPLIED + BELOW });
		global.window.innerHeight = layoutH;
		if (visibleH === null) { delete global.window.visualViewport; }
		else { global.window.visualViewport = { height: visibleH, scale: 1 }; }
		return L.effectiveMapHeight();
	};
	// A desktop, where the two viewports are the same number: the answer must not move at all.
	const plain = layout(900, null);
	ok('with no visualViewport the map still fills the window below the chrome', plain === 900 - ABOVE,
		plain + ' from a 900px window whose canvas starts at ' + ABOVE);
	ok('...and a visualViewport that agrees changes nothing', layout(900, 900) === plain);
	// A phone whose browser chrome covers 90px of the layout viewport.
	const phone = layout(740, 650);
	ok('a map on a phone is sized to the DYNAMIC viewport, not the large one', phone === 650 - ABOVE,
		phone + ', wanted ' + (650 - ABOVE));
	ok('...so the bottom of the map -- and every legend anchored to it -- is on screen',
		ABOVE + phone + BELOW <= 650, 'map ends at ' + (ABOVE + phone) + ' of 650 visible');
	// A pinch zoom shrinks the visual viewport and is NOT browser chrome, so it must not shrink the
	// map: vv.height * vv.scale takes the zoom back out.
	global.window.visualViewport = { height: 370, scale: 2 };
	ok('a pinch zoom does not shrink the map', L.effectiveMapHeight() === 740 - ABOVE,
		L.effectiveMapHeight() + ' at scale 2 in a 740px window');
	// And the floor still wins in a window too short to hold anything.
	ok('a window shorter than the chrome above the map still leaves a map', layout(200, 120) === 80);
	delete global.window.visualViewport;
	global.window.innerHeight = 900;
	canvas.getBoundingClientRect = realCanvasRect;
	global.document.body.getBoundingClientRect = realBodyRect;
}

// ============================================================================================
// 8. THE SYMBOLOGY ROWS GET NARROWER GRACEFULLY (Tom's items 6, 7 and 8)
// ============================================================================================
// The two lists are built by the REAL builder, so the row shape asserted below is the row shape the
// visitor gets -- a hand-modelled row would keep passing the day a column is added.
console.log('\n--- the Node and Link symbology rows wrap as a group below the breakpoint ---');
L.rebuildLabelsFields();
const TOUCH = true;
['node', 'link'].forEach((group) => {
	const list = adopt(stub.byId['lpn_labels_' + group + '_fields'], body);
	const rows = list.children;
	ok(group + ' symbology built its rows for real', rows.length > 3, rows.length + ' rows');
	const heading = rows[0], field = rows.filter((r) => r.children.some((c) => c.tag === 'input'))[0];
	ok('...the first row is the column headings', heading.children.every((c) => c.tag === 'span'));
	ok('...and a field row carries a label and its boxes', !!field && field.children[0].tag === 'label');

	// (7) IDEA B: the label takes a whole line, so the four boxes wrap together under it.
	ok(group + ': the name takes the whole line on a small screen',
		winning(RULES, field.children[0], SMALL, DOC_IDS, false, 'flex') === '1 1 100%');
	ok('...and the row is allowed to wrap at all',
		winning(RULES, field, SMALL, DOC_IDS, false, 'flex-wrap') === 'wrap');
	ok('...and the 11.5rem ceiling on the name is lifted with it',
		winning(RULES, field.children[0], SMALL, DOC_IDS, false, 'max-width') === 'none');
	ok('...while on the desktop the name keeps its ceiling and no flex of its own',
		winning(RULES, field.children[0], WIDE, DOC_IDS, false, 'flex') === null &&
		winning(RULES, field.children[0], WIDE, DOC_IDS, false, 'max-width') === '11.5rem');
	ok('...and the desktop row does not wrap',
		winning(RULES, field, WIDE, DOC_IDS, false, 'flex-wrap') === null);

	// **AND ONCE IT WRAPS, THE WHITE SPACE GOES ABOVE THE TOGGLE AND NOT BELOW IT** (Tom,
	// 2026-08-31, on a phone: "the toggles and labels ... have a little gap below them from the row
	// they belong with, but no gap above them from the row they don't belong with. This would be
	// good to reverse.").
	//
	// It is proximity, and the whole defect is a consequence of the line above. labelCheckbox()
	// writes ONE inline `gap`, which a nowrap row spends entirely between columns; the moment the
	// row wraps, the same number is also a ROW-gap and lands between the name and its own four
	// boxes. The rows themselves carry no margin, so every pixel of separation in the list was
	// inside a group and none of it between groups -- measured in Chromium at 360x740 before the
	// fix, 6.00px below a name and 0.00px above it.
	//
	// **THE ASSERTION IS THE COMPARISON, not either number**, because either one alone can be
	// right while the reading is wrong: 6px below and 6px above groups nothing, and that is the
	// state a later tidy-up would most plausibly drift back to.
	const inlineGap = /row\.style\.gap = '(\d+)px'/.exec(fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8'));
	ok(group + ': labelCheckbox() still writes one inline gap, which a wrapped row spends BOTH ways',
		!!inlineGap, inlineGap ? inlineGap[1] + 'px' : 'no inline gap found -- this check is vacuous');
	if (inlineGap) {
		const rg = winning(RULES, field, SMALL, DOC_IDS, false, 'row-gap');
		const mt = winning(RULES, field, SMALL, DOC_IDS, false, 'margin-top');
		// A stylesheet row-gap must be `!important` to beat the inline shorthand; with none, what a
		// phone actually paints below the name is the inline number.
		const below = rg === null ? parseFloat(inlineGap[1]) : parseFloat(rg);
		const above = mt === null ? 0 : parseFloat(mt);
		ok('...so on a phone the space ABOVE the toggles and labels exceeds the space below them',
			above > below, 'above ' + above + 'px, below ' + below + 'px');
		// And the desktop is not paying for it. The row does not wrap there, so there is no row-gap
		// to reverse and no margin is added -- the layout Tom did not ask to move does not move.
		ok('...while the desktop row, which never wraps, is left exactly as it was',
			winning(RULES, field, WIDE, DOC_IDS, false, 'row-gap') === null &&
			winning(RULES, field, WIDE, DOC_IDS, false, 'margin-top') === null,
			'row-gap ' + winning(RULES, field, WIDE, DOC_IDS, false, 'row-gap') +
			', margin-top ' + winning(RULES, field, WIDE, DOC_IDS, false, 'margin-top'));
		// The heading row is the one row that owns nothing below it, so it takes no margin of its
		// own -- it is `:first-child`, and that is what keeps the list from opening on a blank strip.
		ok('...and the heading row takes no margin, being the one row with nothing above it',
			winning(RULES, heading, SMALL, DOC_IDS, false, 'margin-top') === null);
	}
	// **AND THE NAME ON THAT LINE NEVER BREAKS MID-WORD** (Tom, 2026-08-23, drawing `Dem/and`,
	// `Hea/d`, `Pres/sure`, `Elev/ation` as the thing to stop). `overflow-wrap: anywhere` is what
	// does it, and it is correct on the desktop, where the name shares its line with four columns
	// and a too-wide name pushes every one of them off its heading (Task 435). Once the name owns
	// the whole line there is nothing to protect and the break is pure damage.
	ok('...and the name breaks between words only, never mid-word',
		winning(RULES, field.children[0], SMALL, DOC_IDS, false, 'overflow-wrap') === 'normal',
		'small screen says ' + winning(RULES, field.children[0], SMALL, DOC_IDS, false, 'overflow-wrap'));
	ok('...while the desktop keeps the break-anywhere its column alignment depends on',
		winning(RULES, field.children[0], WIDE, DOC_IDS, false, 'overflow-wrap') === 'anywhere');
	// **A HEADING MUST WRAP INSIDE ITS COLUMN, NOT PAINT PAST IT** (ROADMAP Task 527). Tom,
	// 2026-08-25, from a phone: "BeforeAfter 0.000 Drop", the four headings touching. The widths
	// below were right -- measured in a real browser, every heading box sits on its control's box to
	// a tenth of a pixel -- but "Before" is one 40px word in a 33px column and a span with no break
	// opportunity simply overflows. So the wrapping this list chose (Tom's option (c), against (b)
	// abbreviations) needed a property to make it reachable. THE HEADING ROW ONLY.
	ok(group + ': a heading that overflows its column breaks rather than spilling',
		winning(RULES, heading.children[1], SMALL, DOC_IDS, false, 'overflow-wrap') === 'anywhere',
		'got ' + winning(RULES, heading.children[1], SMALL, DOC_IDS, false, 'overflow-wrap'));
	ok('...on the phone only, where the columns are narrow enough to need it',
		winning(RULES, heading.children[1], WIDE, DOC_IDS, false, 'overflow-wrap') === null);
	ok('...and never on the boxes beneath it, which are sized and not text',
		winning(RULES, field.children[1], SMALL, DOC_IDS, false, 'overflow-wrap') === null);
	// The heading row's lead cell goes, so the headings start where the wrapped group starts.
	ok(group + ": the heading row's lead cell goes on a small screen",
		!!hiddenAt(RULES, heading.children[0], SMALL, DOC_IDS));
	ok('...and stays on the desktop', !hiddenAt(RULES, heading.children[0], WIDE, DOC_IDS));

	// (8) THE FOUR COLUMNS, HEADING AND BOX ALIKE. A heading that is not the same width as the box
	// under it is the defect this list has already been fixed for twice, so the assertion is that
	// the two agree -- at every width, and with and without a spinner.
	const want = { 2: '2.08rem', 3: '1.6rem', 4: '2.56rem', 5: '2.56rem' };
	const wantTouch = { 2: '2.08rem', 3: '1.6rem', 4: '1.6rem', 5: '1.6rem' };
	const wantWide = { 2: '2.6rem', 3: '2.6rem', 4: '3.2rem', 5: '3.2rem' };
	[2, 3, 4, 5].forEach((i) => {
		const h = heading.children[i - 1], b = field.children[i - 1];
		ok(group + ' column ' + i + ' is ' + want[i] + ' on a small screen',
			winning(RULES, h, SMALL, DOC_IDS, false, 'width') === want[i],
			'heading says ' + winning(RULES, h, SMALL, DOC_IDS, false, 'width'));
		ok('...and its box says the same thing',
			winning(RULES, b, SMALL, DOC_IDS, false, 'width') === want[i],
			'box says ' + winning(RULES, b, SMALL, DOC_IDS, false, 'width'));
		// **ON THE DESKTOP THE BOX'S WIDTH IS NOT IN THE STYLESHEET AT ALL** -- labelCheckbox()
		// writes it inline -- so the desktop question is asked of the two places it really lives:
		// the heading's CSS rule and the box's own inline style. That they are the same string is
		// the property the last two rounds of Task 435 were about.
		ok('...the desktop heading is unchanged at ' + wantWide[i],
			winning(RULES, h, WIDE, DOC_IDS, false, 'width') === wantWide[i],
			'got ' + winning(RULES, h, WIDE, DOC_IDS, false, 'width'));
		ok('...and the box it names still carries that width inline',
			(b.el.style.width || wantWide[i]) === wantWide[i], 'inline width ' + b.el.style.width);
		ok('...and on a TOUCH screen below the breakpoint it is ' + wantTouch[i],
			winning(RULES, h, SMALL, DOC_IDS, TOUCH, 'width') === wantTouch[i] &&
			winning(RULES, b, SMALL, DOC_IDS, TOUCH, 'width') === wantTouch[i]);
		// **THE TOUCH RULE MAY NOT REACH THE DESKTOP.** It is nested inside the width block for
		// exactly this reason, and a touchscreen laptop is the case that would prove it wrong.
		// **THE TOUCH RULE MAY NOT REACH THE DESKTOP**, and the question is asked as "does the
		// pointer type change the answer up here", which is the property, rather than as a width --
		// a spacer <span> and an <input> legitimately answer differently on the desktop.
		ok('...and a TOUCH screen ABOVE the breakpoint changes nothing',
			winning(RULES, h, WIDE, DOC_IDS, TOUCH, 'width') === winning(RULES, h, WIDE, DOC_IDS, false, 'width') &&
			winning(RULES, b, WIDE, DOC_IDS, TOUCH, 'width') === winning(RULES, b, WIDE, DOC_IDS, false, 'width'));
	});
	// The two numeric boxes give up their spinner on touch, and only there.
	// EVERY spinner in the list, not the first row's -- a node's ID row has neither, so a check
	// written against one row would have asserted nothing on half the lists.
	const spin = [];
	rows.forEach((r) => r.children.forEach((c) => { if (c.cls.indexOf('ec-spin') >= 0) { spin.push(c); } }));
	ok(group + ' has spinner boxes on its field rows', spin.length > 0, spin.length + ' found');
	spin.forEach((b) => {
		ok('...the spinner goes on a touch screen below the breakpoint',
			winning(RULES, b, SMALL, DOC_IDS, TOUCH, 'appearance') === 'textfield');
		ok('...and stays for a pointer at the same width',
			winning(RULES, b, SMALL, DOC_IDS, false, 'appearance') === null);
		ok('...and stays on a touch screen above it',
			winning(RULES, b, WIDE, DOC_IDS, TOUCH, 'appearance') === null);
	});
	// And the list's own floor comes down, or the box still refuses to narrow.
	ok(group + ' list floor is 11rem on a small screen',
		winning(RULES, list, SMALL, DOC_IDS, false, 'min-width') === '11rem');
	ok('...9rem when the spinners have gone too',
		winning(RULES, list, SMALL, DOC_IDS, TOUCH, 'min-width') === '9rem');
	ok('...and 13rem on the desktop, untouched',
		winning(RULES, list, WIDE, DOC_IDS, false, 'min-width') === '13rem' &&
		winning(RULES, list, WIDE, DOC_IDS, TOUCH, 'min-width') === '13rem');
});

console.log('\n--- the Settings index pane, a narrow COLUMN at both widths ---');
{
	const setboxHost = node('div', 'lpn_settings_box', ['lpn-popover', 'lpn-setbox'], body);
	const panes = node('div', '', ['lpn-setbox-panes'], setboxHost);
	const index = node('div', 'lpn_setbox_index', ['lpn-setbox-index'], panes);
	// 6.6rem: 0.8 x the 7.5rem it shipped at, then 1.1 x that once Tom had used it (2026-08-23).
	ok('the index pane is 6.6rem on the desktop',
		winning(RULES, index, WIDE, DOC_IDS, false, 'flex') === '0 0 6.6rem');
	// **AND STILL A SIDE COLUMN ON A PHONE** (restored 2026-08-29). Task 527 turned it into a
	// horizontal strip of whole names, on the argument that mid-word breaks in a navigation index
	// are worse than the height a strip costs. **Tom used it and reversed it**: *"It was good before
	// with the right pane index. It's bad with top tabs."* An index you scroll sideways is an index
	// you cannot see. The strip was built, shipped, used and rejected -- do not re-propose it.
	//
	// **AND ON A PHONE IT IS A TRANSFER, NOT A TARGET** (Tom, 2026-08-30: *"No. I meant for you to
	// rob 20% of the then-present width of the main pane and give that to the index pane."*). The
	// index does not REACH a fifth of anything -- it keeps 4.5rem and gains a fifth of the main pane
	// on top, and the main pane keeps four fifths of what it had. That distinction is the whole
	// assertion below: a flat `index = 0.2 x content` also produces a tidy calc, and is the reading
	// he rejected in those words, so the property checked here is the one that separates them.
	const gap = winning(RULES, panes, SMALL, DOC_IDS, false, 'gap');
	const basis = winning(RULES, index, SMALL, DOC_IDS, false, 'flex-basis');
	ok('...and on a phone it is a calc against the panes, not a fixed width',
		/^calc\(/.test(String(basis)), 'got ' + basis);
	// **THE PERCENTAGE RESOLVES AGAINST THE CONTAINER'S INNER WIDTH AND THE GAP IS NOT DEDUCTED FROM
	// IT** -- confirmed in Chromium at 360px, where the basis lands on 119.7px, which is what the
	// arithmetic here predicts. That is why the expression carries a `- 2px`: it is a fifth of the
	// gap, exact rather than a fudge. The gap is a constant in two places, so the one in the calc is
	// checked against the one the container actually sets.
	ok('...and the gap it accounts for is the gap the container actually sets',
		gap === '10px' && /- 2px/.test(String(basis)), 'gap ' + gap + ', basis ' + basis);
	// Resolved against the box the phone actually gets: 94vw less its 8px padding each side and its
	// 1px border each side.
	{
		const P = 0.94 * SMALL - 16 - 2, g = parseFloat(gap), REM = 16;
		const m = /^calc\(([\d.]+)rem \+ ([\d.]+)% - ([\d.]+)px\)$/.exec(String(basis));
		const idx = m ? parseFloat(m[1]) * REM + parseFloat(m[2]) / 100 * P - parseFloat(m[3]) : NaN;
		const wasIdx = 4.5 * REM, wasContent = P - g - wasIdx, content = P - g - idx;
		// THE TRANSFER, from both ends: the main pane keeps 80% of what it had, and every pixel it
		// gave up is a pixel the index gained. Either alone would pass on a coincidence.
		ok('...the main pane keeps 80% of the width it had at 360px',
			Math.abs(content / wasContent - 0.80) < 0.001,
			'was ' + wasContent.toFixed(1) + ', now ' + content.toFixed(1) +
			' (' + (content / wasContent).toFixed(4) + ')');
		// **AND THE ALGEBRA IS PINNED TO A REAL BROWSER, or this file is only checking itself.**
		// "The index gained what the main pane gave up" is an identity here -- it falls out of
		// `content = P - g - index` and can never fail -- so what is asserted instead is the number
		// Chromium actually resolved the basis to at 360x640, which is what proves the percentage
		// resolves against P with the gap NOT deducted from it. If a browser ever changed that, this
		// is the line that would say so.
		ok('...and the basis resolves to the 119.7px Chromium measured at 360x640',
			Math.abs(idx - 119.68) < 0.05, 'computes to ' + idx.toFixed(2) +
			' (index was ' + wasIdx.toFixed(1) + ')');
		// The reading NOT taken, named so a re-read of his sentence is a decision rather than a
		// rediscovery. `index = 0.2 x content` would have put the index at 51.7px -- NARROWER than
		// it was -- which is the opposite of what he asked for.
		ok('...and it is not the index REACHING 20%, which is the reading Tom rejected',
			Math.abs(idx - (P - g) / 6) > 1,
			'the target reading would give ' + ((P - g) / 6).toFixed(1) + 'px');
		// **THE ONE THING THE NARROWER MAIN PANE STOPPED FITTING**, measured in Chromium rather
		// than predicted: 17px of overflow, all of it the colour-ramp attribution footer, whose
		// credit lines end in a bare URL. A URL is one unbreakable token, so no pane width would
		// have fixed it -- it needs the same answer the index rows got. Asserted at the phone width
		// only; wider, the footer has always fitted on one line and reads best that way.
		const contentPane = node('div', '', ['lpn-setbox-content'], panes);
		const credit = node('div', 'lpn_set_ramp_credits', ['lpn-rp-credit'], contentPane);
		ok('...and the attribution footer may break its URL rather than scroll the pane sideways',
			winning(RULES, credit, SMALL, DOC_IDS, false, 'overflow-wrap') === 'anywhere',
			'got ' + winning(RULES, credit, SMALL, DOC_IDS, false, 'overflow-wrap'));
		ok('...at the phone width only -- on a desktop the credit is one line',
			winning(RULES, credit, WIDE, DOC_IDS, false, 'overflow-wrap') === null);
	}
	// The three facts that MADE it a strip, each asserted absent, so a revival is a deliberate act
	// rather than a rule creeping back in.
	ok('...the panes do not stack',
		winning(RULES, panes, SMALL, DOC_IDS, false, 'flex-direction') === null,
		'got ' + winning(RULES, panes, SMALL, DOC_IDS, false, 'flex-direction'));
	// `flex` still resolves to the desktop shorthand `0 0 6.6rem` here -- the phone rule sets
	// flex-basis alone, which overrides only the basis. What must NOT be true is the strip's own
	// `0 0 auto`, which is how it sized itself to its content instead of to a column.
	ok('...the index does not size itself to a row',
		winning(RULES, index, SMALL, DOC_IDS, false, 'flex') !== '0 0 auto',
		'got ' + winning(RULES, index, SMALL, DOC_IDS, false, 'flex'));
	ok('...and it does not scroll sideways inside itself',
		winning(RULES, index, SMALL, DOC_IDS, false, 'overflow-x') === null);
	// A <button> does not wrap its text by itself, so without this the narrow pane answers with a
	// sideways scrollbar instead of a second line -- measured at 94px of "Node symbology" in a 65px
	// box before the rule was added. **Eight of the fourteen names split mid-word at this width, and
	// that was ALREADY ACCEPTED** (Tom, 2026-08-29: *"We already accepted broken words."*) -- so it
	// is not a defect waiting for a layout answer, and re-deriving one from it is what produced the
	// tab strip he had never been shown.
	const link = node('button', '', ['lpn-setbox-link'], index);
	ok('an index row may wrap, and may break a long word, at BOTH widths',
		winning(RULES, link, WIDE, DOC_IDS, false, 'white-space') === 'normal' &&
		winning(RULES, link, WIDE, DOC_IDS, false, 'overflow-wrap') === 'anywhere' &&
		winning(RULES, link, SMALL, DOC_IDS, false, 'white-space') !== 'nowrap',
		'small: ' + winning(RULES, link, SMALL, DOC_IDS, false, 'white-space'));
	// The Libraries box borrows the whole Settings shell, so its own narrower index is an override
	// on the same class rather than a second pane design (Tom's item 9).
	const libpanes = node('div', '', ['lpn-setbox-panes'], node('div', 'lpn_library_box', ['lpn-popover', 'lpn-setbox', 'lpn-libbox'], body));
	const libindex = node('nav', 'lpn_libbox_index', ['lpn-setbox-index'], libpanes);
	ok('the Libraries index pane is 5.25rem -- 0.70 x the 7.5rem it shipped at',
		winning(RULES, libindex, WIDE, DOC_IDS, false, 'flex-basis') === '5.25rem');
	// One rule serves both boxes again, which is what it was before Task 527 split them -- and it
	// reaches this box's own `#lpn_library_box` override on specificity, `:has()` taking the
	// specificity of its argument. That is load-bearing rather than incidental: without it the
	// Libraries index would keep its desktop 5.25rem on a phone and the two boxes would be two
	// designs again.
	ok('...and it takes the same phone ratio, from the same rule',
		winning(RULES, libindex, SMALL, DOC_IDS, false, 'flex-basis') ===
		winning(RULES, index, SMALL, DOC_IDS, false, 'flex-basis'),
		'got ' + winning(RULES, libindex, SMALL, DOC_IDS, false, 'flex-basis'));
}

// ============================================================================================
// 9. THE NON-BLOCKERS: A SHORT SCREEN, AND THE TABLES IN THE BOTTOM PANE
// ============================================================================================
console.log('\n--- a box on a short screen, and the pane tables (Tom\'s items 5 and 10) ---');
{
	// **KEYED OFF THE VIEWPORT HEIGHT, NOT THE 640px WIDTH**, because a short window on a laptop is
	// the same problem and is not a phone. The reader treats @supports as always applying, so the
	// dvh rule is the one that must be found at BOTH widths -- which is the assertion, since a
	// height limit that only a phone gets would be the wrong shape for this item.
	const setbox = node('div', 'lpn_settings_box', ['lpn-popover', 'lpn-setbox'], body);
	[[WIDE, 'a wide window'], [SMALL, 'a phone']].forEach(([w, what]) => {
		ok('in ' + what + ' the Settings box is capped in dvh, not vh',
			winning(RULES, setbox, w, DOC_IDS, false, 'max-height') === '96dvh',
			'got ' + winning(RULES, setbox, w, DOC_IDS, false, 'max-height'));
		ok('...and its opening height is capped the same way',
			winning(RULES, setbox, w, DOC_IDS, false, 'height') === 'min(46rem, 92dvh)');
	});
	// **AND IT CAN BE RESIZED BY A FINGER** (Tom, 2026-08-23: "I can't figure out how to resize
	// Settings on a phone. Is that our fault?" -- it was: `resize: both` is the browser's own
	// widget, and no mobile engine lets a touch drag it). The grabber addPanelResizeGrip() builds
	// appears only where a coarse pointer exists, which is what leaves the desktop untouched --
	// asked at BOTH widths, because a tablet in landscape is a wide window with a finger on it.
	// `winning`, not `hiddenAt`: the grabber is declared display:none first and turned back on by
	// the coarse-pointer rule, and hiddenAt() answers on the FIRST display:none it finds.
	const grip = node('div', '', ['lpn-resize-grip'], setbox);
	[[WIDE, 'a desktop window'], [SMALL, 'a narrow window']].forEach(([w, what]) => {
		ok('the touch resize grabber is absent for a pointer in ' + what,
			winning(RULES, grip, w, DOC_IDS, false, 'display') === 'none',
			'got ' + winning(RULES, grip, w, DOC_IDS, false, 'display'));
	});
	[[SMALL, 'a phone'], [WIDE, 'a tablet in landscape']].forEach(([w, what]) => {
		ok('...and it appears on ' + what,
			winning(RULES, grip, w, DOC_IDS, TOUCH, 'display') === 'block',
			'got ' + winning(RULES, grip, w, DOC_IDS, TOUCH, 'display'));
	});
	ok('...owning its own touch gestures, or the browser claims the drag for scrolling',
		winning(RULES, grip, SMALL, DOC_IDS, TOUCH, 'touch-action') === 'none');

	// A cap alone would only move the overflow inside the box; the panes are what scroll.
	const panes2 = node('div', '', ['lpn-setbox-panes'], setbox);
	ok('...and the panes inside it scroll, so the capped box does not spill',
		winning(RULES, node('div', '', ['lpn-setbox-content'], panes2), SMALL, DOC_IDS, false, 'overflow') === 'auto');

	// Tom's (10). The one imposed width in those tables, halved below the breakpoint.
	const tbl = node('table', '', ['lpn-pane-table'], node('div', 'lpn_pane', [], body));
	const cell = node('input', '', [], node('td', '', [], node('tr', '', [], tbl)));
	ok('a pane table number box is 3.5em on a small screen -- half of what it was',
		winning(RULES, cell, SMALL, DOC_IDS, false, 'width') === '3.5em');
	// On the desktop the width now comes from the COLUMN, which declares it as a custom property
	// (Tom, 2026-08-23, gave a factor per column) -- and the 7em every box used to be survives as
	// the fallback for a column that names none. What matters here is only that the phone box is
	// still 3.5em: this rule is later and more specific, so no desktop column can reach it.
	ok('...and the desktop takes its column’s width, falling back to the 7em it always was',
		winning(RULES, cell, WIDE, DOC_IDS, false, 'width') === 'var(--lpn-pane-col-w, 7em)',
		'got ' + winning(RULES, cell, WIDE, DOC_IDS, false, 'width'));

	// **THE SAVED-PATHS ARROW IS A TOUCH TARGET, and this is the one place on this page where that
	// is a legitimate argument** (Task 510). Tom, 2026-08-25: *"It's too small and non-conforming
	// to be discoverable."* The drawing surface is designed for a pointer and a 44px rule has no
	// standing there; the tab strip is CHROME, and a phone user has to hit this. It grows SIDEWAYS
	// rather than downward, because the strip sits above a chart with the least height to spare.
	const paneCaret = node('button', 'lpn_pane_tab_menu_profile', ['lpn-pane-tab-menu'],
		node('div', 'lpn_pane_tabs', ['lpn-pane-tabs'], node('div', 'lpn_pane', [], body)));
	ok('the saved-paths arrow is at least 44px wide on a phone',
		winning(RULES, paneCaret, SMALL, DOC_IDS, false, 'min-width') === '2.75rem',
		'got ' + winning(RULES, paneCaret, SMALL, DOC_IDS, false, 'min-width'));
	ok('...and keeps a floor of its own on the desktop, rather than shrinking to the glyph',
		winning(RULES, paneCaret, WIDE, DOC_IDS, false, 'min-width') === '2rem',
		'got ' + winning(RULES, paneCaret, WIDE, DOC_IDS, false, 'min-width'));

	// **AND THE ROUGHNESS HEADING KEEPS ITS WORD** (ROADMAP Task 527). Tom, 2026-08-25, read
	// "Roughnes/s, C" on a phone. `overflow-wrap: anywhere` is what lets a column be narrower than
	// its own longest word, and "Roughness," measures 94.4px against the 66 that round 3's 5em
	// leaves it. `break-word` moves that floor to the longest word: the heading breaks at its comma
	// instead, and the column pays 28px for it. The km column is not paying anything -- its longest
	// word is "Minor" at ~34px in a 47px column -- so it keeps `anywhere`.
	const rough = node('th', '', ['lpn-pane-col-roughness', 'lpn-pane-num'], node('tr', '', [], tbl));
	const km = node('th', '', ['lpn-pane-col-km', 'lpn-pane-num'], node('tr', '', [], tbl));
	ok('the Roughness heading may not be split mid-word on a phone',
		winning(RULES, rough, SMALL, DOC_IDS, false, 'overflow-wrap') === 'break-word',
		'got ' + winning(RULES, rough, SMALL, DOC_IDS, false, 'overflow-wrap'));
	ok('...and the km column, which has never needed the split, keeps the bounded width',
		winning(RULES, km, SMALL, DOC_IDS, false, 'overflow-wrap') === 'anywhere');
	ok('...and neither is touched on the desktop',
		winning(RULES, rough, WIDE, DOC_IDS, false, 'overflow-wrap') === null &&
		winning(RULES, km, WIDE, DOC_IDS, false, 'overflow-wrap') === null);
}

// ---- THE MAP OVERLAYS DO NOT EAT THE DRAWING (ROADMAP Task 524) ---------------------------
// Tom, 2026-08-25, from his phone: the EPANET minor-loss note "is stuck open". It was not stuck --
// #lpn_status stands until the next solve replaces it, which is a corner on a desktop and a quarter
// of the canvas on a phone. The mode hint above it made it worse and is mouse-verb advice
// ("Double-click a pipe") on a device with no double-click.
{
	const hint = node('div', 'lpn_mode_hint', [], body);
	const status = node('p', 'lpn_status', ['ec-status-warn'], body);
	ok('the mode hint is gone on a phone -- it is pointer advice, and three lines of it',
		winning(RULES, hint, SMALL, DOC_IDS, false, 'display') === 'none');
	ok('...and is still there for a pointer, where it is the page telling you what mode you are in',
		winning(RULES, hint, WIDE, DOC_IDS, false, 'display') !== 'none');

	// THE STATUS LINE STAYS. It is where a refusal to solve is announced, and hiding it would be a
	// worse defect than the one being fixed. It is BOUNDED instead.
	ok('the status overlay survives on a phone, because it carries the refusals',
		winning(RULES, status, SMALL, DOC_IDS, false, 'display') !== 'none');
	ok('...capped in height so no note of any length can take the map',
		/^33svh$/.test(String(winning(RULES, status, SMALL, DOC_IDS, false, 'max-height'))),
		'got ' + winning(RULES, status, SMALL, DOC_IDS, false, 'max-height'));
	ok('...and it scrolls rather than clipping what it cannot show',
		winning(RULES, status, SMALL, DOC_IDS, false, 'overflow-y') === 'auto');
	// **WIDER, NOT NARROWER, and that is the counter-intuitive half.** The inline max-width is 60%,
	// tuned for a desktop where 60% is roomy. On a 400px phone it is 240px, and a narrow box makes a
	// long note TALLER. Going up to 92% is what actually shortens it.
	ok('...and it is WIDER on a phone than the inline 60%, because narrow means taller',
		winning(RULES, status, SMALL, DOC_IDS, false, 'max-width') === '92%',
		'got ' + winning(RULES, status, SMALL, DOC_IDS, false, 'max-width'));
}

// ============================================================================================
// 10. THE TWO LEGENDS' DEFAULT CORNERS DIFFER ON A PHONE (ROADMAP Task 527)
// ============================================================================================
// Tom, 2026-08-25: "527 on phone, color legend upper right and label legend upper left." Task 516
// is the same collision on the desktop and he was explicitly not worried about it there, so the
// desktop corners are asserted UNCHANGED beside every phone assertion -- a default that leaked
// upward would move two boxes on every existing user's map.
//
// **THIS IS A DEFAULT, AND THE EXPENSIVE FAILURE IS FOR IT TO ACT LIKE AN OVERRIDE.** A placement
// is stored in the project (settings is serialized whole), so a project saved on a desktop and
// opened on a phone must open in the corner it was saved in. That is the last assertion here, and
// it goes through the real applySaved() rather than through a modelled merge.
//
// Unlike everything above, this cannot be answered from the stylesheet: the corner is a settings
// value, not a rule. So the module is LOADED AGAIN at each width and asked what it decided. This is
// the last section in the file for that reason -- a second module instance reassigns the page-level
// globals, and nothing after it may depend on the first.
console.log('\n--- the corners a first-time visitor gets, and the corner a saved project keeps ---');
{
	// ONE BREAKPOINT, ASKED TWICE: the stylesheet asks it as a media query and defaultSettings()
	// asks it through matchMedia. This is the only place the two 640s could drift apart, so the
	// number is read out of the JS source and matched against the media condition of the rule that
	// starts the phone pass -- the page-title rule, Tom's item 1.
	const jsSrc = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
	const jsQuery = /matchMedia\('\(max-width:\s*(\d+)px\)'\)/.exec(jsSrc);
	ok('js/looped-network.js decides "small screen" with a max-width media query', !!jsQuery);
	const titleRule = RULES.find((r) => /#ec-page-title/.test(r.sel) && r.media.some((m) => /max-width/.test(m)));
	const cssPx = titleRule && /max-width:\s*(\d+)px/.exec(titleRule.media.join(' '));
	ok('...at the same breakpoint the phone pass itself lives at',
		!!(jsQuery && cssPx && jsQuery[1] === cssPx[1]),
		'js ' + (jsQuery && jsQuery[1]) + ' vs css ' + (cssPx && cssPx[1]));

	// defaultSettings() reads the viewport WHEN IT IS CALLED, so every question below is asked
	// inside the width it is about -- including the module load itself, whose `var settings =
	// defaultSettings()` runs at module scope.
	function atWidth(px, fn) {
		const prev = global.window.innerWidth;
		global.window.innerWidth = px;
		try {
			return fn(stub.loadLoopedNetwork(
				"\t\tdefaultSettings: defaultSettings, applySaved: applySaved,\n" +
				"\t\tapplyLegendPosition: applyLegendPosition,\n" +
				"\t\tapplyColorLegendPosition: applyColorLegendPosition,\n" +
				"\t\tlegendInsetFor: legendInsetFor,\n" +
				"\t\tsetLegendPos: function (a, b) { settings.legendPosition = a; settings.colorLegendPosition = b; },\n" +
				"\t\tmapWrap: function () { return svg && svg.parentNode; },\n" +
				"\t\tserializeProject: serializeProject,\n" +
				"\t\tgetSettings: function () { return settings; },\n" +
				"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
				"\t\t\tworld = el('g', {}, svg);\n" +
				"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
				"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
				"\t\t\tlabelsLayer = el('g', {}, world);\n" +
				"\t\t\trubberBandEl = el('line', {}, world); }\n"));
		} finally { global.window.innerWidth = prev; }
	}

	// The stub's own claim first. It answers a width query from innerWidth, and a stub that had gone
	// back to a flat `false` would make every phone assertion below pass as a desktop.
	ok('the stub answers a width query from the viewport it is pretending to be',
		atWidth(SMALL, () => global.window.matchMedia('(max-width: 640px)').matches) === true &&
		global.window.matchMedia('(max-width: 640px)').matches === false);

	const phone = atWidth(SMALL, (M) => M.defaultSettings());
	ok('a phone opens with the COLOUR key in the upper right',
		phone.colorLegendPosition === 'top-right', 'got ' + phone.colorLegendPosition);
	ok('...and the LABELS legend in the upper left, so the two do not stack',
		phone.legendPosition === 'top-left', 'got ' + phone.legendPosition);

	const desk = atWidth(WIDE, (M) => M.defaultSettings());
	ok('the desktop colour key is untouched, still bottom right',
		desk.colorLegendPosition === 'bottom-right', 'got ' + desk.colorLegendPosition);
	ok('...and the desktop labels legend is untouched, still top right',
		desk.legendPosition === 'top-right', 'got ' + desk.legendPosition);

	// **A STORED CHOICE SURVIVES.** A project serialized on a desktop, opened at 360px: both corners
	// must come back as they were saved, not as the phone's defaults. Serializing on the desktop
	// instance is what makes the fixture the page's own writing rather than two retyped strings.
	const savedOnPc = atWidth(WIDE, (M) => {
		M.buildLayers();
		return JSON.parse(JSON.stringify(M.serializeProject()));
	});
	ok('a project records the placement at all -- otherwise the case below is vacuous',
		!!(savedOnPc.settings && savedOnPc.settings.legendPosition === 'top-right' &&
			savedOnPc.settings.colorLegendPosition === 'bottom-right'));
	const reopened = atWidth(SMALL, (M) => {
		M.buildLayers();
		M.applySaved(savedOnPc);
		return M.getSettings();
	});
	ok('a project saved on a desktop keeps its colour-key corner when opened on a phone',
		reopened.colorLegendPosition === 'bottom-right', 'got ' + reopened.colorLegendPosition);
	ok('...and keeps its labels-legend corner too -- a default is not an override',
		reopened.legendPosition === 'top-right', 'got ' + reopened.legendPosition);

// ---- 11. THE LEGENDS GIVE WAY TO THE READOUTS, NOT THE OTHER WAY ROUND -------------------------
//
// Task 527's phone ruling put the labels legend upper left, where `#lpn_map_overlay_tl` -- the mode
// hint and the solver's standing diagnostic -- already was, and the two landed on each other.
//
// **THE FIRST FIX PUSHED THE STACK DOWN and Tom rejected it** (2026-08-27: *"Top left pushes the
// mode string down below the legend. This looks bad. Bottom left covers the Scenario status. The
// answer is for the legends to adjust their positioning so that they don't disturb these other
// denizens of the map."*). So the direction is now the assertion: a corner a user cannot change
// wins, and the legend -- whose corner IS a setting -- moves.
//
// **ASSERTED ON THE PURE FUNCTION**, because nothing in this stub rasterises: every element returns
// the same 1000x500 rect, so driving the placer would prove nothing about pixels. legendInsetFor()
// takes rects and returns a number, which is the whole rule, and it is fed hand-written boxes here.
{
	const M = atWidth(SMALL, (mod) => mod);
	const inset = M.legendInsetFor;
	// The map, and the two readouts that own its corners by right: the mode hint at the top left,
	// the scenario button at the bottom left. Both are SHORT here -- a wide map.
	const wrap = { top: 0, bottom: 500, left: 0, right: 1000 };
	const hint = { anchor: 'top', rect: { top: 4, bottom: 20, left: 4, right: 200 } };
	const foot = { anchor: 'bottom', rect: { top: 470, bottom: 490, left: 4, right: 300 } };
	const occ = [hint, foot];
	// A legend's rect: its column, and its HEIGHT. Both matter now -- the test is a real overlap on
	// both axes, so a short legend in a busy column may clear what a tall one does not.
	const box = (l, r, h) => ({ left: l, right: r, top: 0, bottom: h === undefined ? 60 : h });

	ok('a top-right legend on a wide map sits in the corner, undisturbed',
		inset('top', wrap, box(800, 996), occ) === 4, String(inset('top', wrap, box(800, 996), occ)));
	// 20 (the hint's bottom, in the map's frame) + 4 of air.
	ok('a top-LEFT legend clears the mode hint by dropping below it -- the hint does not move',
		inset('top', wrap, box(4, 200), occ) === 24, String(inset('top', wrap, box(4, 200), occ)));
	// 500 - 470 + 4.
	ok('a bottom-left legend clears the Scenario button by rising above it',
		inset('bottom', wrap, box(4, 200), occ) === 34, String(inset('bottom', wrap, box(4, 200), occ)));
	ok('a bottom-RIGHT legend on a wide map is left alone',
		inset('bottom', wrap, box(800, 996), occ) === 4);

	// **TOM'S NARROW-MAP CASE**: *"If the map were narrow, this observation would apply to the right
	// side like the left side."* Nothing about the corner changed -- the readout got wider.
	const wideHint = [{ anchor: 'top', rect: { top: 4, bottom: 20, left: 4, right: 900 } }, foot];
	ok('a mode hint long enough to reach the right side pushes a top-RIGHT legend down too',
		inset('top', wrap, box(800, 996), wideHint) === 24,
		String(inset('top', wrap, box(800, 996), wideHint)));
	ok('...and the same legend is untouched when the hint stops short of it',
		inset('top', wrap, box(800, 996), occ) === 4);
	// Abutting is not overlapping, or two boxes that merely touch would each shove the other.
	ok('a readout that stops exactly where the legend starts does not push it',
		inset('top', wrap, box(200, 400), occ) === 4, String(inset('top', wrap, box(200, 400), occ)));
	// A bottom readout is no reason to move a top legend -- and that now falls out of the geometry
	// rather than out of a band label, which is what lets the middle case below work at all.
	ok('a top legend ignores what is happening along the bottom edge',
		inset('top', wrap, box(4, 200), [foot]) === 4);
	// ...and a legend nearly as tall as the map, which really does overlap the footer, STAYS PUT.
	// Clearing it would mean pushing it off the bottom -- trading a readable overlap for a legend
	// nobody can see. Where nothing it can do will help, it does nothing.
	ok('...and one too tall to clear anything stays put rather than being pushed off the map',
		inset('top', wrap, box(4, 200, 480), [foot]) === 4,
		String(inset('top', wrap, box(4, 200, 480), [foot])));

	// **THE COLLISION IN SCREENSHOT 0028**, and the one the first version of this rule could not
	// see: the labels legend at top-right and the colour key at middle-right are in DIFFERENT bands
	// and the SAME column, so they printed through each other -- `H= Head` cut off mid-row,
	// `Elevation` showing through the pressure swatches. A middle position was exempt from dodging
	// on the argument that a centred box clears both bands, which is true of the READOUTS and says
	// nothing about the other legend.
	// A desktop-sized map, because this is the case where both boxes have to FIT after the move --
	// the 500px fixture above is a phone and the two legends 0028 shows would not both fit on one.
	const deskWrap = { top: 0, bottom: 900, left: 0, right: 1000 };
	const labels = { anchor: 'top', rect: { top: 4, bottom: 400, left: 800, right: 996 } };
	// The colour key, centred on a 900-tall map at 260 tall: its own centring puts it at 320.
	ok('a middle-right legend under a tall top-right one is pushed clear of it',
		inset('top', deskWrap, box(800, 996, 260), [labels], 320) === 404,
		String(inset('top', deskWrap, box(800, 996, 260), [labels], 320)));
	// And it must not move when there is nothing in the way: a centred box that drifted every time
	// the map was redrawn would be worse than one that overlapped once.
	const shortLabels = { anchor: 'top', rect: { top: 4, bottom: 60, left: 800, right: 996 } };
	ok('...and stays exactly where its own centring put it when nothing is in its way',
		inset('top', deskWrap, box(800, 996, 260), [shortLabels], 320) === 320,
		String(inset('top', deskWrap, box(800, 996, 260), [shortLabels], 320)));
	// The placer has to drop the centring transform when it writes an explicit top, or the box lands
	// half its own height above where it was put -- which would look like a fix and be a new bug.
	{
		const src2 = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
		const fn = src2.substring(src2.indexOf('function placeLegends'), src2.indexOf('function applyLegendPosition'));
		ok('...and moving a middle legend clears the centring transform that put it there',
			/b\.el\.style\.top = inset \+ 'px';[\s\S]{0,120}b\.el\.style\.transform = '';/.test(fn));
	}
	// The tallest wins, so a two-line stack is cleared rather than half-cleared.
	const twoLine = occ.concat([{ anchor: 'top', rect: { top: 24, bottom: 60, left: 4, right: 400 } }]);
	ok('a stack of two readouts is cleared by the LOWER of them',
		inset('top', wrap, box(4, 200), twoLine) === 64, String(inset('top', wrap, box(4, 200), twoLine)));

	// A middle position touches neither band, and the placer's guard for that is the corner table
	// itself: it dodges only a position anchored 4px from an edge.
	const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const table = src.match(/var LEGEND_POSITIONS = \{[\s\S]*?\n\t\};/)[0];
	ok('a middle position is anchored at 50%, so the placer leaves it alone',
		/'middle-left': \{ top: '50%'/.test(table) && /'middle-right': \{ top: '50%'/.test(table));

	// **THE WRONG DIRECTION MUST NOT COME BACK.** The rejected fix was a `--lpn-overlay-top` custom
	// property that the status stack read as extra `top`. Both halves of it are asserted gone: no
	// publisher in the code, no consumer in the markup.
	ok('nothing publishes --lpn-overlay-top any more', src.indexOf('--lpn-overlay-top') < 0);
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	ok('and the status stack is back at a plain top: 4px, not a calc() that a legend can push',
		/id="lpn_map_overlay_tl"[^>]*top:4px/.test(php) && php.indexOf('--lpn-overlay-top') < 0);
	// The wiring question the pure function cannot answer: both corner settings must arrive at the
	// one placer, or a user who moves the colour key by hand gets the collision back.
	ok('both legend placers go through placeLegends()',
		/function applyLegendPosition\(\) \{ placeLegends\(\); \}/.test(src) &&
		/function applyColorLegendPosition\(\) \{ placeLegends\(\); \}/.test(src));
	// And the readouts themselves must re-trigger it: each of these changes how wide or how tall a
	// denizen is, and a dodge computed against the previous text is stale.
	['function updateModeHint', 'function setStatus', 'function refreshMapStatus',
		'function refreshScenarioStatus', 'function applyMapOverlayInset'].forEach((fn) => {
		const at = src.indexOf(fn);
		const body = src.substring(at, src.indexOf('\n\t}', at));
		ok(fn + '() re-places the legends after changing what they dodge',
			at > 0 && body.indexOf('placeLegends()') > 0);
	});
}
}

// ---- 12. THE FIND BOX ON A PHONE (ROADMAP Task 549) --------------------------------------------
//
// Tom, 2026-08-27, four asks in one sentence: *"Maybe we could compact the find box somehow for
// phone. Maybe Property and Condition selectors can be on the same line. Maybe the draggable title
// area of the box can hold the title 'Find and replace'. Maybe the tip 'Choose one kind of asset
// above to change values on' can be made into a question mark tip. And of course the box needs to be
// scrollable to reach all possible found results."*
//
// **THREE OF THE FOUR ARE ASSERTED WHERE THEY LIVE, NOT HERE.** The "?" tip is behaviour and belongs
// with the Replace form (`dev/lpn-spike/replace-harness.js`); the pairing is exercised by the Find
// harness building the real form. What is left for this file is the part that is only true at 360px
// -- that the rules which make the pairing survive a narrow box are actually in the stylesheet, and
// that the title moved out of the body and into the band.
{
	console.log('\n--- the Find box, compacted for a phone ---');
	const css = fs.readFileSync(CSS_PATH, 'utf8');
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	// **`min-width: 0` IS THE LOAD-BEARING HALF AND IT IS INVISIBLE.** A flex item refuses by default
	// to shrink below its content, so without it a long condition -- "no open path to a source" --
	// pushes the pair wider than the phone and the box overflows instead of the select ellipsizing.
	// A pairing that looks right on a desktop and breaks the box on a phone is exactly the defect
	// this file exists for.
	ok('the Property/Condition pair is a flex row',
		/\.lpn-find-pair \{[^}]*display: flex/.test(css));
	ok('...whose items may shrink below their content, or a long condition widens the whole box',
		/\.lpn-find-pair > div \{[^}]*min-width: 0/.test(css));
	// The title is in the DRAG BAND now -- the 40px of padding at the top, which is the only part of
	// the box where `e.target` is the box itself and therefore the only part that drags. It reuses
	// the Settings box's own title class, whose `pointer-events: none` is what keeps that true.
	ok('the box carries its title in the drag band, not as a line of the body',
		/id="lpn_find_boxtitle" class="lpn-setbox-title"/.test(php));
	ok('...and the body no longer spends a line on the same word',
		!/lpn-popover-body">\s*<div style="font-weight:bold"><\?=\$ec_lang\['lpn_find_title'\]/.test(php));
	ok('...and the band it sits in cannot swallow the drag',
		/\.lpn-setbox-title \{[^}]*pointer-events: none/.test(css));
	// **SCROLLABLE MEANS CAPPED TO THE ROOM BELOW WHERE IT LANDS, not to the viewport.** The body
	// always scrolled; the box was taller than the screen because it was fitted to the window and
	// then pushed down past the chrome, so the missing part was below the fold rather than below a
	// scrollbar. Both branches that place it without an anchor now cap against their own top.
	const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const toggle = src.substring(src.indexOf('function toggleFindPopup'),
		src.indexOf('function wireFindPopup'));
	ok('the remembered-position branch caps the box to the room below it',
		(toggle.match(/capPanelToRoomBelow\(popup, /g) || []).length === 2,
		(toggle.match(/capPanelToRoomBelow/g) || []).length + ' call(s)');
	ok('...and the cap puts the overflow inside the scrolling body, not on the box',
		/function capPanelToRoomBelow[\s\S]*?capPanelHeight\(panel, body,/.test(src));
	ok('...which is the wrapper the stylesheet actually scrolls',
		/\.lpn-popover-body \{ overflow: auto/.test(css));
}

// ============================================================================================
// 12. THE SETTINGS BOX FITS THE PHONE, ITS OWN GRIP INCLUDED (Tom, 2026-08-29)
// ============================================================================================
// *"on a phone the index is narrower than before, the main pane is wider than it needs to be, and
//  the box runs off the screen, impossible to resize because the control is inaccessible."*
//
// **THE LAST TWO ARE ONE DEFECT AND IT IS THE DANGEROUS SHAPE: the escape hatch and the trap are
// the same corner.** .lpn-resize-grip sits at the box's bottom-right, so a box whose bottom is off
// the screen has taken its own way out with it. An off-screen box with a reachable grip is a
// nuisance; this is a box the reader cannot get back.
//
// WHAT WENT WRONG, in arithmetic rather than in prose. clampPanel() gained a `topMin` on
// 2026-08-24 (chromeFloor(), so no panel can hide under the menu bar) and its top became
// `max(floor, min(top, vh - h - EDGE))`. The moment the box is taller than the room UNDER that
// floor, the floor wins and every pixel past it hangs below the fold -- and the ResizeObserver in
// wireSettingsBox() cannot slide it back, because it re-runs the SAME clamp and gets the same
// answer. The box on a phone is `min(46rem, 92dvh)`, which is 92% of the screen, so the room below
// the chrome is never enough and the overflow is exactly the height of the chrome.
//
// The fix is the one this page already had for the same shape (the Find box, and the fire flow
// box): cap the box to the room below the floor BEFORE placing it, so the overflow lands inside
// `.lpn-popover-body`, which scrolls. Section 8 above asserts the other two symptoms -- the index
// is 4.5rem on a phone and 6.6rem on the desktop, which is what shipped 2026-08-23 and has not
// moved since.
//
// A BROWSER IS NOT AVAILABLE HERE, so the chrome's real height cannot be measured. The assertions
// are therefore made over a RANGE of floors rather than against an invented number: whatever the
// menu bar, toolbar and tab strip come to, the box must end up inside the screen.
{
	console.log('\n--- the Settings box, and the grip it must never put out of reach ---');
	const jsSrc = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const EDGE = +(/var POPUP_EDGE = (\d+);/.exec(jsSrc) || [])[1];
	ok('the viewport margin is read out of the page, not typed here', EDGE > 0, String(EDGE));
	function fn(name) {
		const at = jsSrc.search(new RegExp('(?:async )?function ' + name + '\\s*\\('));
		let i = jsSrc.indexOf('{', at), depth = 0, end = i;
		for (; end < jsSrc.length; end++) {
			if (jsSrc[end] === '{') { depth++; }
			else if (jsSrc[end] === '}') { depth--; if (depth === 0) { end++; break; } }
		}
		return jsSrc.slice(at, end);
	}
	// **THE SOURCE-SHAPE TESTS READ CODE, NOT PROSE.** These functions carry a paragraph explaining
	// the very call being asserted, and a plain search finds the word in the comment -- which is a
	// check that passes on its own documentation. Comments are blanked first.
	function code(name) { return fn(name).replace(/\/\/[^\n]*/g, ''); }
	// The REAL clampPanel, not a restatement of it: a copy here would pass while the page's own
	// arithmetic changed underneath.
	const clampPanel = new Function('POPUP_EDGE', fn('clampPanel') + '\nreturn clampPanel;')(EDGE);

	// The box's own geometry, read off the stylesheet at 360px rather than typed.
	const setbox = node('div', 'lpn_settings_box', ['lpn-popover', 'lpn-setbox'], body);
	const REM = 16, VH = 640, VW = SMALL;
	function css(prop, w) { return winning(RULES, setbox, w === undefined ? SMALL : w, DOC_IDS, false, prop); }
	function resolve(expr, vw, vh) {
		// Only the two shapes this stylesheet uses: `min(a, b)` and a bare length.
		const one = (t) => {
			t = t.trim();
			let m = /^([\d.]+)rem$/.exec(t); if (m) { return parseFloat(m[1]) * REM; }
			m = /^([\d.]+)(?:dvh|vh)$/.exec(t); if (m) { return parseFloat(m[1]) / 100 * vh; }
			m = /^([\d.]+)vw$/.exec(t); if (m) { return parseFloat(m[1]) / 100 * vw; }
			m = /^([\d.]+)px$/.exec(t); if (m) { return parseFloat(m[1]); }
			return NaN;
		};
		const mm = /^min\(([^,]+),([^)]+)\)$/.exec(String(expr).trim());
		return mm ? Math.min(one(mm[1]), one(mm[2])) : one(expr);
	}
	const boxW = Math.min(resolve(css('width'), VW, VH), resolve(css('max-width'), VW, VH));
	const boxH = Math.min(resolve(css('height'), VW, VH), resolve(css('max-height'), VW, VH));
	ok('the box’s opening size resolves at 360x640', isFinite(boxW) && isFinite(boxH),
		boxW + ' x ' + boxH);
	// Sideways it has always fitted, and that is worth holding: 94vw inside a 98vw cap.
	ok('the box fits the phone’s WIDTH with both margins', boxW + 2 * EDGE <= VW, String(boxW));

	// The floors a phone can plausibly produce: three stacked strips of chrome, none of them
	// measurable outside a browser. The assertion has to hold for every one of them.
	const FLOORS = [40, 60, 80, 100, 120, 160, 200];
	// **THE TRAP, STATED SO IT CANNOT BE FIXED BY ACCIDENT.** With no cap, the box is taller than
	// the room under the chrome at every one of these floors, and the clamp answers with the floor
	// -- so the bottom, and the grip on it, is off the screen. If this ever stops being true the
	// premise of the fix below has changed and somebody must look again.
	// The threshold is arithmetic, not a guess: past `vh - h - EDGE` of chrome there is no top left
	// that keeps the box on screen. It comes out at ~47px on this phone, and the menu bar alone is
	// most of that -- three stacked strips are far past it.
	const THRESH = VH - boxH - EDGE;
	const trapped = FLOORS.filter((f) => clampPanel(0, 0, boxW, boxH, VW, VH, f).top + boxH > VH - EDGE);
	ok('uncapped, the box hangs off the bottom for any chrome taller than the room it leaves',
		trapped.length === FLOORS.filter(f => f > THRESH).length && trapped.length > 0 &&
		trapped.every(f => f > THRESH),
		'threshold ' + THRESH.toFixed(1) + 'px; trapped at ' + trapped.join(', '));
	// **AND CAPPED, IT NEVER DOES.** `capPanelToRoomBelow(box, top)` caps to `vh - top - EDGE`,
	// which is what this repeats -- against the real clamp, at every floor.
	FLOORS.forEach((f) => {
		const h = Math.min(boxH, VH - f - EDGE);
		const at = clampPanel(0, 0, boxW, h, VW, VH, f);
		ok(`capped to the room under a ${f}px chrome, the whole box is on screen`,
			at.top >= f && at.top + h <= VH - EDGE,
			`top ${at.top}, bottom ${at.top + h}, viewport ${VH}`);
		// The grip is the last 28px of that bottom edge (the coarse-pointer rule above), so the
		// box fitting IS the grip being reachable -- said out loud because it is the assertion that
		// matters and it would otherwise be an inference from the line before it.
		ok(`...and its 28px grabber is below the chrome and above the fold`,
			at.top + h - 28 >= f, String(at.top + h - 28));
	});

	// The wiring, so the arithmetic above is actually reached. Both boxes that wear the
	// .lpn-setbox shell measure the floor ONCE and hand the same number to the cap and to the clamp
	// -- two calls to chromeFloor() around a style write are two layouts and two chances to differ.
	['openSettingsBox', 'openLibraryBox', 'openFireFlowBox'].forEach((name) => {
		const b = code(name);
		ok(`${name}() caps its box to the room below the chrome`, /capPanelToRoomBelow\(/.test(b));
	});
	['openSettingsBox', 'openLibraryBox'].forEach((name) => {
		const b = code(name);
		const capAt = b.indexOf('capPanelToRoomBelow(');
		// `at = clampPanel(`, not the bare name: the note above the cap explains the clamp's own
		// arithmetic, and a plain indexOf would find the word in that sentence.
		const clampAt = b.indexOf('at = clampPanel(');
		ok(`...${name}() caps BEFORE it measures and places`, capAt > 0 && clampAt > capAt);
		ok(`...and one measured floor serves both the cap and the clamp (${name})`,
			/floor = chromeFloor\(\)/.test(b) && /capPanelToRoomBelow\(box, floor\)/.test(b) &&
			/window\.innerHeight, floor\)/.test(b));
	});
	// **A HEIGHT THE CAP PRODUCED IS NOT A HEIGHT THE USER CHOSE.** The ResizeObserver stores every
	// size change, and the cap is one -- so without this guard, opening the box once on a phone
	// would shrink the remembered desktop height and never give it back.
	ok('a capped height is not stored as the user’s remembered box height',
		/capped = parseFloat\(box\.style\.maxHeight\)[\s\S]{0,240}setboxLayout\.h = Math\.round/.test(code('wireSettingsBox')));

	// **AND THE CAP MUST NOT PIN THE BODY SHORTER THAN THE BOX** (Tom, 2026-08-30: *"The phone
	// settings has a limit to the amount of box height it will use. This leaves a blank area at the
	// bottom if the box is expanded taller."*). The limit is correct -- it is the room under the
	// chrome, and Task 554 put it there. The blank was not: `capPanelHeight()` derives the panel's
	// furniture by subtracting the body's height from the panel's, and it wrote the panel's cap
	// BEFORE taking that measurement. The body is `flex: 1 1 auto`, so it had already shrunk with the
	// capped panel, and the difference then counted the overflow the cap had just removed as though
	// it were furniture. Measured in Chromium at 360x640: natural 588.8, avail 482.4, real chrome 50
	// -- the body was pinned to 326 instead of 432.4 and a 106.4px strip of the box was empty.
	//
	// **A STUB THAT DROPS THE COUPLING WOULD PASS EITHER WAY** (dev/testing-notes.md). The one
	// physical relationship this defect lives in is that the BODY'S HEIGHT DEPENDS ON THE PANEL'S
	// CAP, so the stub below models exactly that and nothing else. Assert it against the page's real
	// capPanelHeight; with the two statements swapped back it fails.
	{
		const capPanelHeight = new Function(fn('capPanelHeight') + '\nreturn capPanelHeight;')();
		const CHROME = 50, NATURAL = 588.8, AVAIL = 482.4;
		const panel = { style: {} };
		panel.getBoundingClientRect = function () {
			const cap = parseFloat(panel.style.maxHeight);
			return { height: isFinite(cap) ? Math.min(NATURAL, cap) : NATURAL };
		};
		const body = { style: {} };
		body.getBoundingClientRect = function () {
			return { height: panel.getBoundingClientRect().height - CHROME };
		};
		capPanelHeight(panel, body, AVAIL, NATURAL);
		const bodyMax = parseFloat(body.style.maxHeight);
		ok('the capped panel gives its body every pixel that is not the panel’s own furniture',
			Math.abs(bodyMax - (AVAIL - CHROME)) < 0.01,
			'body pinned to ' + bodyMax + ', room is ' + (AVAIL - CHROME));
		ok('...so a box dragged to the cap has no blank strip under its content',
			Math.abs(AVAIL - (CHROME + bodyMax)) < 0.01,
			(AVAIL - (CHROME + bodyMax)).toFixed(1) + 'px of blank');
		// The panel itself is still capped -- the fix must not have bought the body its room by
		// letting the box grow off the screen again, which is the whole of Task 554.
		ok('...and the panel is still capped to the room it was given',
			parseFloat(panel.style.maxHeight) === AVAIL, panel.style.maxHeight);
	}
}

// The reader's blind-spot report, scoped to selectors that could possibly reach what this file
// checks. A rule about print sheets or curve tables is none of this check's business.
{
	const blind = [...unreadable].filter((sel) =>
		/lpn-menubar|lpn-toolbar|lpn_toolbar|lpn_menubar|ec-page-|navbar|ec-nav-libre|lpn-transport|lpn_labels_|lpn-setbox/.test(sel));
	ok('every rule that mentions the chrome this pass touches was readable', blind.length === 0,
		blind.join(' | '));
}

console.log('');
console.log(fails === 0 ? 'small-screen: ALL PASS' : 'small-screen: ' + fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
