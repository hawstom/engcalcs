// Reads css/engcalcs.css with every var(--ec-*) already replaced by the token's LIGHT value.
//
// Task 714: the chrome's colours are tokens, so a harness that asks "does this rule paint #fff?" of the
// stylesheet's TEXT would read `var(--ec-bg)` and fail for a reason that is not a defect. The harness
// still means "this rule paints white", so it is handed the stylesheet as the browser resolves it.
// chrome-tokens-harness.js asks the real browser the same question; this is for the harnesses that
// read the file instead. Only `--ec-*` tokens are expanded; everything else is left as written.
//
// Task 811: most tokens are now color-mix() of a few seeds, and light pins the rest in a rule of its own
// (dev/themes-plan.md). The light set is evaluated by dev/scripts/theme_contrast_check.js and written back
// in the spelling the light block always used: #rgb where it collapses, #rrggbb otherwise, rgba(r, g, b, .a)
// for a translucent colour, and `gray` for the one named grey.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const path = require('path');
const check = require(path.join(__dirname, '..', 'scripts', 'theme_contrast_check.js'));

function spell(c) {
	const [r, g, b] = c.slice(0, 3).map(Math.round), a = Math.round(c[3] * 1000) / 1000;
	if (a < 1) { return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + String(a).replace(/^0\./, '.') + ')'; }
	if (r === 128 && g === 128 && b === 128) { return 'gray'; }
	const h = [r, g, b].map((v) => v.toString(16).padStart(2, '0'));
	return h.every((x) => x[0] === x[1]) ? '#' + h.map((x) => x[0]).join('') : '#' + h.join('');
}

function expandTokens(css) {
	const decls = check.themeDecls('light', css), get = check.themeTokens('light', css), tokens = {};
	Object.keys(decls).forEach((name) => {
		const v = decls[name];
		if (!/var\(|color-mix\(/.test(v)) { tokens[name] = v; return; }
		try { tokens[name] = spell(get(name)); } catch (e) { tokens[name] = v; }
	});
	// A token that is not a colour (a radius tier, a frame, a shadow list) may itself name tokens, so the
	// substitution runs until nothing more changes (Task 811 round 2: --ec-radius-s is calc(3px * scale)).
	let out = css, prev = '';
	for (let i = 0; i < 6 && out !== prev; i++) {
		prev = out;
		out = out.replace(/var\(\s*--(ec-[\w-]+)\s*\)/g, (m, name) => (name in tokens ? tokens[name] : m));
	}
	return out;
}

function readCss(file) { return expandTokens(fs.readFileSync(file, 'utf8')); }

module.exports = { expandTokens, readCss };
