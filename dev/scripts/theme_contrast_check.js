// THE DARK THEME'S TEXT AND SURFACES MEET WCAG AA (Task 714, Phase 2; dev/theming-plan.md). Run with:
//   node dev/scripts/theme_contrast_check.js          check (exit 1 on a failure)
//   node dev/scripts/theme_contrast_check.js --all    also print every ratio
//
// Reads css/engcalcs.css only. It proves three things:
//   1. The two dark blocks (the explicit <html data-theme="dark"> one and the data-theme="system" one under prefers-color-scheme)
//      are the SAME declarations. CSS cannot share them, so a hand edit of one is the defect.
//   2. Every text token reads on every surface token it can sit on at 4.5:1 (body text).
//   3. Every border or line a control is found by is 3:1 against its surface (UI components).
// A pair is listed here, not inferred: when a rule puts a token on a new surface, add the pair. The
// light set is checked too, for information only (it shipped before this check and is not changed here).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', '..', 'css', 'engcalcs.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

function decls(body) {
	const out = {};
	body.replace(/--(ec-[\w-]+)\s*:\s*([^;]+);/g, (m, k, v) => { out[k] = v.trim(); });
	return out;
}
function block(re) {
	const m = re.exec(css);
	if (!m) { throw new Error('theme_contrast_check: cannot find ' + re); }
	let i = m.index + m[0].length, depth = 1, j = i;
	while (depth && j < css.length) { const c = css[j++]; if (c === '{') { depth++; } else if (c === '}') { depth--; } }
	return css.slice(i, j - 1);
}
const light = decls(block(/:root\s*\{/));
const explicitDark = decls(block(/:root\[data-theme="dark"\]\s*\{/));
const mediaDark = decls(block(/@media \(prefers-color-scheme: dark\)\s*\{\s*:root\[data-theme="system"\]\s*\{/));
const dark = Object.assign({}, light, explicitDark);

let fails = 0, checks = 0;
const printAll = process.argv.indexOf('--all') >= 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	if (!cond || printAll) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : '')); }
}

// 1. The two dark blocks are one set.
const names = Object.keys(explicitDark);
ok('dark blocks: the explicit and the media-query block declare the same ' + names.length + ' tokens',
	names.length === Object.keys(mediaDark).length && names.every((k) => mediaDark[k] === explicitDark[k]),
	'they differ: ' + names.filter((k) => mediaDark[k] !== explicitDark[k]).join(', '));
ok('dark block: only --ec-* colour tokens that the light set declares', names.every((k) => k in light),
	names.filter((k) => !(k in light)).join(', '));

function rgba(v) {
	let m;
	if ((m = /^#([0-9a-f]{3})$/i.exec(v))) { return m[1].split('').map((h) => parseInt(h + h, 16)).concat([1]); }
	if ((m = /^#([0-9a-f]{6})$/i.exec(v))) { return [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16)).concat([1]); }
	if ((m = /^rgba?\(([^)]*)\)$/.exec(v))) { const p = m[1].split(',').map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
	if (v === 'gray') { return [128, 128, 128, 1]; }
	if (v === 'steelblue') { return [70, 130, 180, 1]; }
	if (v === 'blue') { return [0, 0, 255, 1]; }
	throw new Error('theme_contrast_check: cannot read colour ' + v);
}
function over(fg, bg) { return [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat([1]); }
function lum(c) {
	const f = c.slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
	return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
}
function ratio(set, fgTok, bgTok, under) {
	const bg = over(rgba(set[bgTok]), under ? rgba(set[under]) : [255, 255, 255, 1]);
	const fg = over(rgba(set[fgTok]), bg);
	const a = lum(fg), b = lum(bg);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// 2. Text on surface, 4.5:1. Every text token on every surface a page puts it on.
const TEXT = ['ink', 'ink-strong', 'ink-muted', 'ink-subtle', 'accent', 'accent-hover', 'brand', 'warn-ink', 'ok-ink',
	'bad-ink', 'error-ink', 'neutral-ink', 'gray-444', 'gray-777', 'hue-17406b', 'hue-5a6570', 'hue-5f6368', 'hue-667',
	'hue-b00020', 'hue-0b0080', 'hue-12211f', 'help-ink'].map((t) => 'ec-' + t);
const SURFACE = ['bg', 'form-bg', 'gray-fafafa', 'gray-f7f7f7', 'gray-f6f6f6', 'gray-f2f2f2', 'gray-f0f0f0', 'hover-bg',
	'select-bg', 'warn-bg', 'error-bg', 'error-bg-soft', 'hue-eef1f4', 'hue-eef3fd', 'hue-eef4ff', 'hue-eae7e0',
	'accent-hover-bg', 'hue-fdd', 'hue-fff3cd', 'hue-fff4e5'].map((t) => 'ec-' + t);
// Text that sits only on the quiet surfaces (a hovered close button, a selected row) is checked on those.
const STRONG_ON = [
	['ec-ink-black', ['ec-gray-eee', 'ec-bg', 'ec-gray-f2f2f2']],
	['ec-ink', ['ec-gray-eee', 'ec-gray-ececec', 'ec-gray-e8e8e8', 'ec-select-bg-strong', 'ec-pressed-bg', 'ec-accent-open-bg', 'ec-hue-f4d4d4']],
	['ec-ink-strong', ['ec-gray-eee', 'ec-pressed-bg']],
	['ec-accent-open', ['ec-accent-open-bg', 'ec-bg']],
	['ec-accent-hover', ['ec-accent-hover-bg']],
	['ec-accent', ['ec-accent-hover-bg', 'ec-accent-open-bg', 'ec-gray-f2f2f2']]
];
// A filled control prints the page colour on the fill (a selected header, a consent button, an open menu badge).
const ON_FILL = [['ec-bg', ['ec-select', 'ec-hue-05a', 'ec-accent-open', 'ec-brand', 'ec-brand-hover', 'ec-accent']],
	['ec-select-bg-strong', ['ec-select']], ['ec-tip-ink', ['ec-tip-bg']]];
// Disabled text is exempt from 4.5:1 by WCAG 1.4.3; it must still be seen (3:1).
const DISABLED = [['ec-gray-999', ['ec-bg']], ['ec-gray-bbb', ['ec-bg']]];

function runSet(name, set, strict) {
	let worst = 99, worstLabel = '';
	function pair(fg, bg, need, why) {
		const r = ratio(set, fg, bg);
		if (r < worst) { worst = r; worstLabel = fg + ' on ' + bg; }
		ok(name + ': ' + fg + ' on ' + bg + ' >= ' + need + ' (' + r.toFixed(2) + ':1) ' + why, !strict || r >= need);
	}
	TEXT.forEach((t) => SURFACE.forEach((s) => pair(t, s, 4.5, 'text')));
	STRONG_ON.forEach(([t, ss]) => ss.forEach((s) => pair(t, s, 4.5, 'text')));
	ON_FILL.forEach(([t, ss]) => ss.forEach((s) => pair(t, s, 4.5, 'text on a filled control')));
	DISABLED.forEach(([t, ss]) => ss.forEach((s) => pair(t, s, 3, 'disabled text')));
	// 3. UI borders and lines a control is found by, 3:1.
	[['ec-border-strong', 'ec-bg'], ['ec-form-border', 'ec-form-bg'], ['ec-debug-grid', 'ec-form-bg'], ['ec-debug-grid', 'ec-bg'],
		['ec-warn-border', 'ec-warn-bg'], ['ec-gray-999', 'ec-bg'], ['ec-gray-888', 'ec-bg'], ['ec-gray-bbb', 'ec-bg'],
		['ec-hover-border', 'ec-hover-bg'], ['ec-pressed-border', 'ec-pressed-bg'], ['ec-accent', 'ec-bg'], ['ec-select', 'ec-bg'],
		['ec-hue-2a6ebb', 'ec-bg'], ['ec-ink-subtle', 'ec-bg'], ['ec-point', 'ec-bg'], ['ec-tip-edge', 'ec-bg']
	].forEach(([b, s]) => pair(b, s, 3, 'UI border'));
	return { worst, worstLabel };
}
const d = runSet('dark', dark, true);
const l = runSet('light (information only)', light, false);
console.log('theme contrast check: ' + checks + ' pairs; dark worst ' + d.worst.toFixed(2) + ':1 (' + d.worstLabel + '); light worst ' +
	l.worst.toFixed(2) + ':1 (' + l.worstLabel + ')');
if (fails) { console.log(fails + ' FAILED'); process.exit(1); }
console.log('all ok');
