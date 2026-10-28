// TWO PROPERTIES TIPS, WORD FOR WORD (Tom, 2026-10-27): the Auto length tip says "the slope length is
// calculated along the drawn line, and follows ..."; the fittings tip puts the option name in quotation marks.
// Also: a quoted option name in these tips matches no stray unquoted "Choose no fittings list".
//   node dev/lpn-spike/properties-tip-words-harness.js
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'lib', 'lang.ec.en.php'), 'utf8');
let fails = 0;
function val(k) { const m = src.match(new RegExp("\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)';")); return m ? m[1].replace(/\\'/g, "'") : null; }
function ok(n, c, e) { if (!c) { fails++; } console.log((c ? '  ok   ' : '  FAIL ') + n + (e ? '   ' + e : '')); }
ok('1 Auto length tip', val('lpn_field_auto_length_tip') === 'Auto length: when checked, the slope length is calculated along the drawn line, and follows the drawing when a node is moved or an end elevation changes. Clear the box to type a length of your own.', val('lpn_field_auto_length_tip'));
ok('2 fittings tip quotes the option', /Choose "No fittings list" to type a value\.$/.test(val('lpn_field_km_fittings_tip') || ''), val('lpn_field_km_fittings_tip'));
ok('3 the fittings option the tip names is the start of the real option', (val('lpn_fittings_none') || '').indexOf('No fittings list') === 0, val('lpn_fittings_none'));
ok('4 Asset type label exists for the morphed Properties row', val('lpn_survey_codes_col_type') === 'Asset type');
console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);
