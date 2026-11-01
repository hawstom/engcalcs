// The notice for a file kind with no scenarios, in the dialog of an export and of an import (Task 814;
// Tom, 2026-10-25). Headless: the English strings and the wording they build.
//   node dev/lpn-spike/noscn-wording-harness.js
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'lib', 'lang.ec.en.php'), 'utf8');
const get = (k) => { const m = new RegExp("\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)';").exec(src); return m ? m[1].replace(/\\'/g, "'") : null; };
let bad = 0;
const ok = (l, c, d) => { if (!c) { bad++; } console.log((c ? '  ok   ' : '  FAIL ') + l + (c ? '' : '   ' + d)); };
const lead = get('lpn_noscn_lead');
const say = (fmt, n) => lead.replace('{format}', get('lpn_noscn_fmt_' + fmt)).replace('{n}', n);
ok('.inp notice is Tom\'s sentence', say('inp', 5) === 'This project has 5 scenarios, but an EPANET file has no scenarios or alternatives.', say('inp', 5));
ok('GeoJSON notice', say('geojson', 3) === 'This project has 3 scenarios, but a GeoJSON file has no scenarios or alternatives.', say('geojson', 3));
ok('DXF notice', say('dxf', 3) === 'This project has 3 scenarios, but a DXF file has no scenarios or alternatives.', say('dxf', 3));
ok('the scenario sentence is Tom\'s', get('lpn_export_goes_scenario').replace('{scenario}', 'Max day with main break only') === 'Exporting the scenario "Max day with main break only" to a unique file name.');
ok('the import leads no longer carry the old "Note that ... don\'t include scenarios" sentence', !/include scenarios/.test(get('lpn_inpup_lead') + get('lpn_gjup_lead')));
const js = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8');
ok('both imports put the notice first', /noScenarioNotice\('inp'\)/.test(js) && /noScenarioNotice\('geojson'\)/.test(js));
console.log(bad ? bad + ' FAILED' : 'noscn-wording-harness: all passed');
process.exit(bad ? 1 : 0);
