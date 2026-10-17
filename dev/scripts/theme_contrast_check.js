// EVERY THEME'S TEXT AND SURFACES MEET WCAG (Task 714; every theme, Task 811; dev/themes-plan.md). Run with:
//   node dev/scripts/theme_contrast_check.js          check (exit 1 on a failure)
//   node dev/scripts/theme_contrast_check.js --all    also print every ratio
//
// Reads css/engcalcs.css only, and evaluates the token block the way a browser does: the first rule's seeds
// and color-mix() derivations, then a theme's own block on top, var() substituted and color-mix(in srgb)
// computed with premultiplied alpha (CSS Color 5). For every theme it proves:
//   1. every text token reads on every surface token it can sit on: 4.5:1 (WCAG 1.4.3, AA), and 7:1 for
//      High contrast in both its palettes (1.4.6, AAA);
//   2. every border or line a control is found by is 3:1 against its surface (1.4.11), and disabled text
//      is still seen at 3:1 (1.4.3 exempts it from the text ratio);
//   3. every theme block states only tokens the first rule declares, carries its gallery card's selector,
//      and every theme the page head can write has a block.
// A pair is listed here, not inferred: when a rule puts a token on a new surface, add the pair. The light
// set shipped before this check and is reported for information only. theme-contrast-browser-harness.js
// requires this file for the same pairs and measures them again in a real Chromium.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const path = require('path');

// Every theme the head script can write on <html data-theme>, and its text ratio.
const THEMES = { light: 4.5, dark: 4.5, hc: 7, 'hc-dark': 7, amber: 4.5, green: 4.5, platinum: 4.5 };
// Light shipped before this check; its weak pairs are reported, not failed.
const INFO_ONLY = { light: true };

// 1. Text on surface. Every text token on every surface a page puts it on.
const TEXT = ['ink', 'ink-strong', 'ink-muted', 'ink-subtle', 'accent', 'accent-hover', 'brand', 'warn-ink', 'ok-ink',
	'bad-ink', 'error-ink', 'neutral-ink', 'gray-444', 'gray-777', 'hue-17406b', 'hue-5a6570', 'hue-5f6368', 'hue-667',
	'hue-b00020', 'hue-0b0080', 'hue-12211f', 'help-ink'].map((t) => 'ec-' + t);
const SURFACE = ['bg', 'chrome-bg', 'form-bg', 'gray-fafafa', 'gray-f7f7f7', 'gray-f6f6f6', 'gray-f2f2f2', 'gray-f0f0f0', 'hover-bg',
	'select-bg', 'warn-bg', 'error-bg', 'error-bg-soft', 'hue-eef1f4', 'hue-eef3fd', 'hue-eef4ff',
	'accent-hover-bg', 'hue-fdd', 'hue-fff3cd', 'hue-fff4e5'].map((t) => 'ec-' + t);
// Text that sits only on the quiet surfaces (a hovered close button, a selected row) is checked on those.
const STRONG_ON = [
	['ec-ink-black', ['ec-gray-eee', 'ec-bg', 'ec-gray-f2f2f2', 'ec-chrome-bg']],
	['ec-ink', ['ec-gray-eee', 'ec-gray-ececec', 'ec-gray-e8e8e8', 'ec-select-bg-strong', 'ec-pressed-bg', 'ec-accent-open-bg', 'ec-hue-f4d4d4']],
	['ec-ink-strong', ['ec-gray-eee', 'ec-pressed-bg']],
	['ec-accent-open', ['ec-accent-open-bg', 'ec-bg']],
	['ec-accent-hover', ['ec-accent-hover-bg']],
	['ec-accent', ['ec-accent-hover-bg', 'ec-accent-open-bg', 'ec-gray-f2f2f2']]
];
// A filled control prints the page colour on the fill (a selected header, a consent button, an open menu badge).
const ON_FILL = [['ec-bg', ['ec-select', 'ec-hue-05a', 'ec-accent-open', 'ec-brand', 'ec-brand-hover', 'ec-accent']],
	['ec-select-bg-strong', ['ec-select']], ['ec-tip-ink', ['ec-tip-bg']]];
// Disabled text is exempt from the text ratio by WCAG 1.4.3; it must still be seen (3:1).
const DISABLED = [['ec-gray-999', ['ec-bg']], ['ec-gray-bbb', ['ec-bg']]];
// 2. UI borders and lines a control is found by, 3:1.
const BORDERS = [['ec-border-strong', 'ec-bg'], ['ec-form-border', 'ec-form-bg'], ['ec-debug-grid', 'ec-form-bg'], ['ec-debug-grid', 'ec-bg'],
	['ec-warn-border', 'ec-warn-bg'], ['ec-gray-999', 'ec-bg'], ['ec-gray-888', 'ec-bg'], ['ec-gray-bbb', 'ec-bg'],
	['ec-hover-border', 'ec-hover-bg'], ['ec-pressed-border', 'ec-pressed-bg'], ['ec-accent', 'ec-bg'], ['ec-select', 'ec-bg'],
	['ec-hue-2a6ebb', 'ec-bg'], ['ec-ink-subtle', 'ec-bg'], ['ec-point', 'ec-bg'], ['ec-tip-edge', 'ec-bg'],
	['ec-control-border', 'ec-bg'], ['ec-accent', 'ec-chrome-bg'], ['ec-gray-999', 'ec-chrome-bg'],
	// The override marker is a shape (Task 790), on the page and on a held row
	['ec-held-ink', 'ec-bg'], ['ec-held-ink', 'ec-held-bg']];

// Every pair as [fg, bg, need, why] for one theme, for this check and the browser harness alike.
function pairs(theme) {
	const text = THEMES[theme] || 4.5, out = [];
	TEXT.forEach((t) => SURFACE.forEach((s) => out.push([t, s, text, 'text'])));
	STRONG_ON.forEach(([t, ss]) => ss.forEach((s) => out.push([t, s, text, 'text'])));
	ON_FILL.forEach(([t, ss]) => ss.forEach((s) => out.push([t, s, text, 'text on a filled control'])));
	DISABLED.forEach(([t, ss]) => ss.forEach((s) => out.push([t, s, 3, 'disabled text'])));
	BORDERS.forEach(([b, s]) => out.push([b, s, 3, 'UI border']));
	return out;
}

// ---- WCAG arithmetic, on [r, g, b, a] with channels 0-255 ----
function over(fg, bg) { return [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat([1]); }
function lum(c) {
	const f = c.slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
	return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
}
// A translucent surface is laid on the page colour, and a translucent ink on that.
function contrast(fg, bg, page) {
	const b = over(bg, page || [255, 255, 255, 1]);
	const f = over(fg, b);
	const x = lum(f), y = lum(b);
	return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// ---- the token block, evaluated ----
const NAMED = { white: [255, 255, 255, 1], black: [0, 0, 0, 1], gray: [128, 128, 128, 1], grey: [128, 128, 128, 1],
	steelblue: [70, 130, 180, 1], blue: [0, 0, 255, 1], transparent: [0, 0, 0, 0] };
function splitTop(s) {
	const out = []; let depth = 0, cur = '';
	for (const ch of s) {
		if (ch === '(') { depth++; } else if (ch === ')') { depth--; }
		if (ch === ',' && !depth) { out.push(cur.trim()); cur = ''; } else { cur += ch; }
	}
	out.push(cur.trim());
	return out;
}
function colour(v) {
	v = v.trim();
	let m;
	if ((m = /^#([0-9a-f]{3})$/i.exec(v))) { return m[1].split('').map((h) => parseInt(h + h, 16)).concat([1]); }
	if ((m = /^#([0-9a-f]{6})$/i.exec(v))) { return [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16)).concat([1]); }
	if ((m = /^rgba?\(([^)]*)\)$/i.exec(v))) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
	if (NAMED[v.toLowerCase()]) { return NAMED[v.toLowerCase()].slice(); }
	if ((m = /^color-mix\(\s*in srgb\s*,([\s\S]*)\)$/i.exec(v))) {
		const parts = splitTop(m[1]).map((p) => {
			const q = /^([\s\S]*?)(?:\s+(-?[\d.]+)%)?$/.exec(p.trim());
			return { c: colour(q[1]), p: q[2] === undefined ? null : parseFloat(q[2]) };
		});
		if (parts.length !== 2) { throw new Error('color-mix needs two colours: ' + v); }
		const [a, b] = parts;
		let p1 = a.p, p2 = b.p;
		if (p1 === null && p2 === null) { p1 = p2 = 50; } else if (p1 === null) { p1 = 100 - p2; } else if (p2 === null) { p2 = 100 - p1; }
		const sum = p1 + p2, mult = Math.min(1, sum / 100), w1 = p1 / sum, w2 = p2 / sum;
		const alpha = a.c[3] * w1 + b.c[3] * w2;
		const ch = [0, 1, 2].map((i) => (alpha ? (a.c[i] * a.c[3] * w1 + b.c[i] * b.c[3] * w2) / alpha : 0));
		return ch.concat([alpha * mult]);
	}
	throw new Error('theme_contrast_check: cannot read colour ' + v);
}
function readBlock(css) {
	const a = css.indexOf('/* ec-colour-tokens:begin */'), b = css.indexOf('/* ec-colour-tokens:end */');
	if (a < 0 || b < a) { throw new Error('theme_contrast_check: the token block markers are missing'); }
	const text = css.slice(a, b).replace(/\/\*[\s\S]*?\*\//g, '');
	const rules = [];
	text.replace(/([^{}]+)\{([^{}]*)\}/g, (m, sel, body) => {
		const decls = {};
		body.replace(/--(ec-[\w-]+)\s*:\s*([^;]+);/g, (x, k, v) => { decls[k] = v.trim(); });
		rules.push({ sel: sel.trim().replace(/\s+/g, ' '), decls });
	});
	return rules;
}
function baseRule(rules) {
	const base = rules.find((r) => /^:root\s*(,|$)/.test(r.sel));
	if (!base) { throw new Error('theme_contrast_check: no first :root rule'); }
	return base;
}
// The declarations in force on <html data-theme="theme">, in cascade order.
function tokensFor(rules, theme) {
	const base = baseRule(rules), set = Object.assign({}, base.decls);
	rules.forEach((r) => {
		if (r !== base && r.sel.split(',').map((s) => s.trim()).indexOf(':root[data-theme="' + theme + '"]') >= 0) { Object.assign(set, r.decls); }
	});
	return set;
}
function evaluate(set) {
	const memo = {};
	function sub(v, depth) {
		if (depth > 20) { throw new Error('theme_contrast_check: var() nested too deep'); }
		return v.replace(/var\(\s*--(ec-[\w-]+)\s*\)/g, (m, k) => {
			if (set[k] === undefined) { throw new Error('theme_contrast_check: undeclared --' + k); }
			return sub(set[k], depth + 1);
		});
	}
	return (name) => {
		if (!(name in memo)) {
			if (set[name] === undefined) { throw new Error('theme_contrast_check: no token --' + name); }
			memo[name] = colour(sub(set[name], 0));
		}
		return memo[name];
	};
}

// The browser harness asks for one theme's tokens by name, evaluated here, to prove this file and Chromium agree.
function themeTokens(theme, css) {
	const rules = readBlock(css || fs.readFileSync(path.join(__dirname, '..', '..', 'css', 'engcalcs.css'), 'utf8'));
	return evaluate(tokensFor(rules, theme));
}
module.exports = { THEMES, pairs, contrast, colour, themeTokens };

if (require.main === module) {
	const css = fs.readFileSync(path.join(__dirname, '..', '..', 'css', 'engcalcs.css'), 'utf8');
	const rules = readBlock(css);
	let fails = 0, checks = 0;
	const printAll = process.argv.indexOf('--all') >= 0;
	const ok = (label, cond, detail) => {
		checks++;
		if (!cond) { fails++; }
		if (!cond || printAll) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : '')); }
	};
	const base = baseRule(rules);
	ok('the first rule is shared with the gallery card (:root, .ec-theme-card)', /\.ec-theme-card/.test(base.sel), base.sel);
	rules.forEach((r) => {
		const extra = Object.keys(r.decls).filter((k) => !(k in base.decls));
		ok('"' + r.sel.slice(0, 60) + '" states only tokens the first rule declares', !extra.length, extra.join(', '));
		const m = /:root\[data-theme="([\w-]+)"\]/.exec(r.sel);
		if (m) { ok('theme ' + m[1] + ': its gallery card has the same block', r.sel.indexOf('.ec-theme-card[data-theme="' + m[1] + '"]') >= 0, r.sel); }
	});
	const summary = [];
	Object.keys(THEMES).forEach((theme) => {
		const strict = !INFO_ONLY[theme];
		if (theme !== 'light') { ok('theme ' + theme + ' has a block', rules.some((r) => r.sel.indexOf(':root[data-theme="' + theme + '"]') >= 0)); }
		const get = evaluate(tokensFor(rules, theme));
		const page = get('ec-bg');
		let worst = 99, worstLabel = '', weak = 0;
		pairs(theme).forEach(([fg, bg, need, why]) => {
			const r = contrast(get(fg), get(bg), page);
			if (r < worst) { worst = r; worstLabel = fg + ' on ' + bg; }
			if (r < need) { weak++; }
			ok(theme + ': ' + fg + ' on ' + bg + ' >= ' + need + ' (' + r.toFixed(2) + ':1) ' + why, !strict || r >= need);
		});
		summary.push(theme + ' worst ' + worst.toFixed(2) + ':1 (' + worstLabel + ')' + (strict ? '' : ', ' + weak + ' weak pair(s), information only'));
	});
	console.log('theme contrast check: ' + checks + ' checks over ' + Object.keys(THEMES).length + ' themes; ' + summary.join('; '));
	if (fails) { console.log(fails + ' FAILED'); process.exit(1); }
	console.log('all ok');
}
