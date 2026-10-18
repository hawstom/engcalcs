// Patch a copy of js/looped-network.js: settings and coordinate overrides read once per label pass.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs'); const f = process.argv[2]; let s = fs.readFileSync(f, 'utf8');
function rep(a, b) { if (s.split(a).length !== 2) throw new Error('not exactly once: ' + a.slice(0, 60)); s = s.replace(a, b); }
rep("\tfunction scnSetting(member) { return settingFor(activeScenario(), ['settings', member]); }\n\tfunction scnLabels(path) { return settingFor(activeScenario(), ['labelSettings'].concat(path || [])); }",
 "\tvar passMemo = null;\n" +
 "\tfunction scnSetting(member) { if (passMemo) { var k = 's|' + member; if (Object.prototype.hasOwnProperty.call(passMemo, k)) { return passMemo[k]; } return (passMemo[k] = settingFor(activeScenario(), ['settings', member])); } return settingFor(activeScenario(), ['settings', member]); }\n" +
 "\tfunction scnLabels(path) { if (passMemo) { var k = 'l|' + (path || []).join('\\u0001'); if (Object.prototype.hasOwnProperty.call(passMemo, k)) { return passMemo[k]; } return (passMemo[k] = settingFor(activeScenario(), ['labelSettings'].concat(path || []))); } return settingFor(activeScenario(), ['labelSettings'].concat(path || [])); }");
rep("\tfunction coordOverridesOf(n) { return (n && resolvedOverrides(activeScenario())[ovKey(n)]) || null; }",
 "\tfunction coordOverridesOf(n) { if (!n) { return null; } if (passMemo) { if (!passMemo.__ov) { passMemo.__ov = resolvedOverrides(activeScenario()); } return passMemo.__ov[ovKey(n)] || null; } return resolvedOverrides(activeScenario())[ovKey(n)] || null; }");
rep("\tfunction refreshLabelText() {\n", "\tfunction refreshLabelText() { var own = !passMemo; if (own) { passMemo = {}; } try { return refreshLabelTextInner(); } finally { if (own) { passMemo = null; } } }\n\tfunction refreshLabelTextInner() {\n");
fs.writeFileSync(f, s); console.log('patched');
