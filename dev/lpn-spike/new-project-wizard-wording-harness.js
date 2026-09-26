// R-209: File > New project wizard, coordinate-system radios (Tom, 2026-09-24, exact words).
//
//   node dev/lpn-spike/new-project-wizard-wording-harness.js
//
// Renders the real page through render_page.php (global scope, one page per process -- see that
// script's own header) rather than reading the PHP source, so this catches the ecTipLabel() markup
// actually reaching the browser, not just the lang value. Asserted against
// EngCalcs.pageConfig.<key>, harvested straight out of lib/lang.ec.en.php the way every other
// harness here does (lpn-dom-stub.js), never typed into this file as a literal -- so a further
// reword by Tom does not turn this red for the wrong reason
// (dev/scripts/harness_wording_check.php's rule against pinning English wording as a literal). Two
// keys used only server-side (`lpn_new_coordsys_geo`/`_local`) never reach the real page's own JS
// pageConfig, which is why this reads the lang FILE rather than the rendered page's script block.
//
// SEAM: `lpn_new_coordsys_geo` is also the Geographic projection box's own title
// (`lpn_crsbox_title` reuses it) -- feat/convert-as's new strings are all `lpn_convas_*` and do not
// touch this key, so this rename does not cross that branch's territory.

'use strict';

const { execFileSync } = require('child_process');
const path = require('path');
const root = path.join(__dirname, '../..');

// PC, not this file, is where the wanted English lives -- see lpn-dom-stub.js's own note.
// Requiring it harvests every $ec_lang key onto global.EngCalcs.pageConfig as a side effect; this
// file uses none of its DOM stubbing, only that harvest.
require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

let fails = 0;
function ok(label, cond, detail) {
	console.log((cond ? '  ok  ' : ' FAIL ') + label + (detail ? '   ' + JSON.stringify(detail) : ''));
	if (!cond) { fails++; }
}

const html = execFileSync('php', [path.join(root, 'dev/scripts/render_page.php'), 'Looped-Network.php'],
	{ encoding: 'utf8', maxBuffer: 1024 * 1024 * 32 });

const wantGeo = PC.lpn_new_coordsys_geo;
const wantLocal = PC.lpn_new_coordsys_local;
ok('lib/lang.ec.en.php states lpn_new_coordsys_geo', typeof wantGeo === 'string', wantGeo);
ok('lib/lang.ec.en.php states lpn_new_coordsys_local', typeof wantLocal === 'string', wantLocal);

console.log('\n--- New project wizard: coordinate-system radios ---');
{
	const geoRow = (html.match(/<label><input type="radio" name="lpn_new_coords" value="geo">[\s\S]*?<\/label>/) || [''])[0];
	const localRow = (html.match(/<label><input type="radio" name="lpn_new_coords" value="local"[^>]*>[\s\S]*?<\/label>/) || [''])[0];

	ok('radio 1 exists', !!geoRow);
	ok('radio 1 reads exactly what lpn_new_coordsys_geo says, today',
		typeof wantGeo === 'string' && geoRow.indexOf('>' + wantGeo + ' <span class="ec-tip">?</span>') >= 0,
		{ geoRow, wantGeo });

	ok('radio 2 exists', !!localRow);
	ok('radio 2 reads exactly what lpn_new_coordsys_local says, today',
		typeof wantLocal === 'string' && localRow.indexOf('>' + wantLocal + ' <span class="ec-tip">?</span>') >= 0,
		{ localRow, wantLocal });
}

console.log(`\n${fails ? 'FAIL ' + fails : 'ok'}`);
process.exit(fails ? 1 : 0);
