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
		if (prelude.startsWith('@media') || prelude.startsWith('@supports')) {
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
function mediaApplies(media, widthPx) {
	return media.every((q) => {
		if (q.startsWith('@supports')) { return true; }
		if (/\bprint\b/.test(q)) { return false; }
		if (/prefers-/.test(q)) { return false; }
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
	const toks = part.match(/(::?[a-z-]+\([^)]*\)|[#.][A-Za-z0-9_-]+|^[a-z][a-z0-9]*|\*)/g);
	if (!toks || toks.join('') !== part) { return null; }
	const spec = { tag: null, ids: [], cls: [], not: [], has: [] };
	for (const t of toks) {
		if (t === '*') { continue; }
		else if (t[0] === '#') { spec.ids.push(t.slice(1)); }
		else if (t[0] === '.') { spec.cls.push(t.slice(1)); }
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
function matchesCompound(node, spec, docIds) {
	if (!spec) { return false; }
	if (spec.tag && node.tag !== spec.tag) { return false; }
	if (spec.ids.some((id) => node.id !== id)) { return false; }
	if (spec.cls.some((c) => node.cls.indexOf(c) < 0)) { return false; }
	if (spec.not.some((n) => matchesCompound(node, n, docIds))) { return false; }
	if (spec.has.some((id) => docIds.indexOf(id) < 0)) { return false; }
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
function hiddenAt(RULES, node, widthPx, docIds) {
	for (let n = node; n; n = n.parent) {
		for (const r of RULES) {
			if (!/display:\s*none/.test(r.body)) { continue; }
			if (!mediaApplies(r.media, widthPx)) { continue; }
			if (matches(n, r.sel, docIds)) { return r; }
		}
	}
	return null;
}
// Any applying rule that matches this node and declares the property -- used for the navbar,
// which is COLLAPSED rather than hidden, so "is it display:none" is the wrong question.
function declaredAt(RULES, node, widthPx, docIds, prop) {
	const re = new RegExp(prop + ':\\s*([^;]+)');
	for (const r of RULES) {
		if (!mediaApplies(r.media, widthPx)) { continue; }
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
	// **THE MENUS, OPENED FOR REAL.** openMenu() is swapped for a collector rather than the row
	// arrays being read out of the source text: a source read would pass on a row that throws, and
	// would miss a row assembled conditionally (File's Save/Save as, View's basemap pair).
	"\t\tmenuRows: function (which) {\n" +
	"\t\t\tvar out = [], real = openMenu, opener = { file: openFileMenu, edit: openEditMenu, insert: openInsertMenu, view: openViewMenu, project: openProjectBarMenu, help: openHelpMenu }[which];\n" +
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
	path.join(ROOT, 'dev', 'water-network-examples', 'Net3-lpn.json'), 'utf8'));
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
	ok('the real menu bar was built', items.length === 6, items.length + ' menus');
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
	['file', 'edit', 'insert', 'view', 'project', 'help'].forEach((which) => {
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

console.log('\n--- what may never be hidden at any width ---');
[[credit, 'the basemap attribution']].forEach(([n, label]) => {
	ok(label + ' is visible on a small screen', !hiddenAt(RULES, n, SMALL, DOC_IDS));
	ok('...' + label + ' is visible on the desktop', !hiddenAt(RULES, n, WIDE, DOC_IDS));
});

// The reader's blind-spot report, scoped to selectors that could possibly reach what this file
// checks. A rule about print sheets or curve tables is none of this check's business.
{
	const blind = [...unreadable].filter((sel) =>
		/lpn-menubar|lpn-toolbar|lpn_toolbar|lpn_menubar|ec-page-|navbar|ec-nav-libre|lpn-transport/.test(sel));
	ok('every rule that mentions the chrome this pass touches was readable', blind.length === 0,
		blind.join(' | '));
}

console.log('');
console.log(fails === 0 ? 'small-screen: ALL PASS' : 'small-screen: ' + fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
