// Reads css/engcalcs.css with every var(--ec-*) already replaced by the token's value.
//
// Task 714: the chrome's colours are tokens, so a harness that asks "does this rule paint #fff?" of the
// stylesheet's TEXT would read `var(--ec-bg)` and fail for a reason that is not a defect. The harness
// still means "this rule paints white", so it is handed the stylesheet as the browser resolves it.
// chrome-tokens-harness.js asks the real browser the same question; this is for the harnesses that
// read the file instead. Only `--ec-*` tokens are expanded; everything else is left as written.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');

function expandTokens(css) {
	const tokens = {};
	css.replace(/--(ec-[\w-]+)\s*:\s*([^;]+);/g, (m, name, value) => { if (!(name in tokens)) { tokens[name] = value.trim(); } return m; });
	return css.replace(/var\(\s*--(ec-[\w-]+)\s*\)/g, (m, name) => (name in tokens ? tokens[name] : m));
}

function readCss(file) { return expandTokens(fs.readFileSync(file, 'utf8')); }

module.exports = { expandTokens, readCss };
