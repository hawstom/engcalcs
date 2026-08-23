// A stylesheet reader small enough to be read at a glance, for the question "would this rule fire
// on this element?" -- the one dev/testing-notes.md says a harness must ask instead of asserting
// that some class name was applied.
//
// It is deliberately NOT a CSS engine. It understands what css/engcalcs.css uses where the bottom
// pane's tables are styled: one level of @media nesting, descendant combinators, tag names,
// classes, and the `html:has(#lpn_canvas)` prefix every map-editor-only rule carries. Anything else
// in a selector makes the rule UNREADABLE, and the reader says so out loud rather than answering
// from a rule it only half understood -- a reader that silently stopped understanding its target
// would report ALL PASS forever.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');

// Every rule in the file, in source order, with the media conditions it is wrapped in.
function parse(src) {
	const text = src.replace(/\/\*[\s\S]*?\*\//g, '');
	const out = [], unreadable = [];
	(function walk(body, media) {
		let i = 0;
		while (i < body.length) {
			const open = body.indexOf('{', i);
			if (open < 0) { break; }
			const prelude = body.slice(i, open).trim();
			let depth = 0, end = open;
			for (; end < body.length; end++) {
				if (body[end] === '{') { depth++; }
				else if (body[end] === '}') { depth--; if (depth === 0) { break; } }
			}
			const inner = body.slice(open + 1, end);
			if (prelude.startsWith('@media') || prelude.startsWith('@supports')) {
				walk(inner, media.concat([prelude]));
			} else if (prelude.startsWith('@')) {
				/* @keyframes and friends: nothing here asks about them */
			} else {
				prelude.split(',').forEach((sel) => {
					out.push({ sel: sel.trim(), decls: inner, media: media });
				});
			}
			i = end + 1;
		}
	}(text, []));
	return { rules: out, unreadable: unreadable };
}

// Only what this file's rules use: a max-width in px or rem.
function mediaApplies(media, widthPx) {
	return media.every((q) => {
		let m = /max-width:\s*([0-9.]+)px/.exec(q);
		if (m && !(widthPx <= parseFloat(m[1]))) { return false; }
		m = /max-width:\s*([0-9.]+)rem/.exec(q);
		if (m && !(widthPx <= parseFloat(m[1]) * 16)) { return false; }
		m = /min-width:\s*([0-9.]+)px/.exec(q);
		if (m && !(widthPx >= parseFloat(m[1]))) { return false; }
		return true;
	});
}

// A node in the chain a harness hands over: { tag, cls: [...], canvasHost: true } for <html> on the
// map editor page. `unreadable` collects the compounds this reader cannot answer, so a caller can
// fail rather than trust a silent "no".
function matchesCompound(node, part, unreadable) {
	let rest = part;
	if (rest.startsWith('html:has(#lpn_canvas)')) {
		rest = rest.slice('html:has(#lpn_canvas)'.length);
		if (node.tag !== 'html' || !node.canvasHost) { return false; }
	}
	const m = /^([a-zA-Z][\w-]*)?((?:\.[\w-]+)*)$/.exec(rest);
	if (!m) { unreadable.push(part); return false; }
	if (m[1] && node.tag !== m[1]) { return false; }
	const classes = (m[2] || '').split('.').filter(Boolean);
	return classes.every((c) => (node.cls || []).indexOf(c) >= 0);
}

// `chain` is outermost-first; the last entry is the element being asked about.
function matches(chain, sel, unreadable) {
	if (/[>+~[]|::/.test(sel)) { unreadable.push(sel); return false; }
	const parts = sel.split(/\s+/).filter(Boolean);
	let at = chain.length - 1;
	if (!matchesCompound(chain[at], parts[parts.length - 1], unreadable)) { return false; }
	at--;
	for (let p = parts.length - 2; p >= 0; p--) {
		let found = false;
		for (; at >= 0; at--) {
			if (matchesCompound(chain[at], parts[p], unreadable)) { found = true; at--; break; }
		}
		if (!found) { return false; }
	}
	return true;
}

// The LAST declaration of `prop` in one rule body, or null. A leading `;` is prepended so a
// declaration written on the line after the brace is still preceded by a delimiter -- without it a
// multi-line rule reads as having no declarations at all, and every question about it answers
// "no rule", which is a green harness over a broken page.
function declValue(decls, prop) {
	const re = new RegExp('[;{]\\s*' + prop + '\\s*:\\s*([^;}]+)', 'g');
	let m, last = null;
	while ((m = re.exec(';' + decls))) { last = m[1].trim(); }
	return last;
}

// What the page would compute for `prop` on the last node of `chain` at this viewport width.
// **LAST match in source order wins**, which is what a browser does for equal specificity and is
// how this file is written: the plain rule first, the narrow-screen override later.
function winning(rules, chain, widthPx, prop, unreadable) {
	let value = null;
	rules.forEach((r) => {
		if (!mediaApplies(r.media, widthPx)) { return; }
		if (!matches(chain, r.sel, unreadable)) { return; }
		const v = declValue(r.decls, prop);
		if (v !== null) { value = v; }
	});
	return value;
}

module.exports = {
	// The parsed sheet, with the readers attached to it -- one object, so a caller cannot ask the
	// wrong sheet a question.
	load(path) { return Object.assign(parse(fs.readFileSync(path, 'utf8')), { winning, matches, mediaApplies }); },
	parse, winning, matches, mediaApplies
};
