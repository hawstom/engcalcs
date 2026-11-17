// THE BOLD LABELS IN THE CONTROLS ENTRY ARE THE LABELS' OWN STRINGS (Task 859, Perry's review 2026-11-16).
//   node dev/lpn-spike/guide-bold-labels-harness.js
// In every language file, each <strong> span of lpn_guide_lib_ctl_def equals, character for character, the value of the key the
// label comes from: lpn_library_control_add and lpn_time_duration, from the same file.
// Named exceptions: ar, bg and cs have a button string that is itself mistranslated ("Add a rule"), so their span keeps the
// word for "control" and does not equal the button string. They are translation defects for the next sprint.
'use strict';
const fs = require('fs');
const path = require('path');
const LIB = path.join(__dirname, '..', '..', 'lib');
const EXCEPT = { 'ar:0': 'the button string says "Add a rule"', 'bg:0': 'the button string says "Add a rule"', 'cs:0': 'the button string says "Add a rule"' };
const val = (s, k) => { const m = s.match(new RegExp("^\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)';", 'm')); return m ? m[1] : null; };
let fails = 0, checks = 0;
fs.readdirSync(LIB).filter((f) => /^lang\.ec\.[a-z]{2}\.php$/.test(f)).sort().forEach((f) => {
	const l = f.slice(8, 10), s = fs.readFileSync(path.join(LIB, f), 'utf8');
	const spans = (val(s, 'lpn_guide_lib_ctl_def') || '').match(/<strong>.*?<\/strong>/g) || [];
	const want = [val(s, 'lpn_library_control_add'), val(s, 'lpn_time_duration')];
	checks++;
	if (spans.length !== 2) { fails++; console.log('  FAIL ' + l + ': ' + spans.length + ' bold spans, want 2'); return; }
	[0, 1].forEach((i) => {
		const got = spans[i].replace(/<\/?strong>/g, ''), eq = got === want[i], why = EXCEPT[l + ':' + i];
		checks++;
		if (why) { console.log('  ok   ' + l + ' span ' + i + ' is a named exception: ' + why + (eq ? ' (and it now matches: remove the exception)' : '')); if (eq) { fails++; } return; }
		if (!eq) { fails++; console.log('  FAIL ' + l + ' span ' + i + ': ' + JSON.stringify(got) + ' vs ' + JSON.stringify(want[i])); }
	});
});
console.log(fails ? '\n' + fails + ' FAILED' : '\nall ' + checks + ' checks passed');
process.exit(fails ? 1 : 0);
