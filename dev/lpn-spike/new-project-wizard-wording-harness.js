// R-209: File > New project wizard, coordinate-system radios (Tom, 2026-09-24, exact words).
//
//   node dev/lpn-spike/new-project-wizard-wording-harness.js
//
// Renders the real page through render_page.php (global scope, one page per process -- see that
// script's own header) rather than reading the PHP source, so this catches the ecTipLabel() markup
// actually reaching the browser, not just the lang value. Asserted against the rendered HTML text
// rather than pinned as a literal search target for the OLD wording, so a further reword by Tom
// does not turn this red for the wrong reason (dev/scripts/harness_wording_check.php's rule).
//
// SEAM: `lpn_new_coordsys_geo` is also the Geographic projection box's own title
// (`lpn_crsbox_title` reuses it) -- feat/convert-as's new strings are all `lpn_convas_*` and do not
// touch this key, so this rename does not cross that branch's territory.

'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '../..');
let fails = 0;
function ok(label, cond, detail) {
	console.log((cond ? '  ok  ' : ' FAIL ') + label + (detail ? '   ' + JSON.stringify(detail) : ''));
	if (!cond) { fails++; }
}

const html = execFileSync('php', [path.join(root, 'dev/scripts/render_page.php'), 'Looped-Network.php'],
	{ encoding: 'utf8', maxBuffer: 1024 * 1024 * 32 });

console.log('\n--- New project wizard: coordinate-system radios ---');
{
	const geoRow = (html.match(/<label><input type="radio" name="lpn_new_coords" value="geo">[\s\S]*?<\/label>/) || [''])[0];
	const localRow = (html.match(/<label><input type="radio" name="lpn_new_coords" value="local"[^>]*>[\s\S]*?<\/label>/) || [''])[0];

	ok('radio 1 exists', !!geoRow);
	ok('radio 1 reads exactly "Coordinate system"', />Coordinate system <span class="ec-tip">\?<\/span>/.test(geoRow), geoRow);
	ok('radio 1 no longer says "Geographic projection"', !/Geographic projection/.test(geoRow), geoRow);

	ok('radio 2 exists', !!localRow);
	ok('radio 2 reads exactly "Local, schematic, or custom coordinate system"',
		/>Local, schematic, or custom coordinate system <span class="ec-tip">\?<\/span>/.test(localRow), localRow);
}

console.log(`\n${fails ? 'FAIL ' + fails : 'ok'}`);
process.exit(fails ? 1 : 0);
