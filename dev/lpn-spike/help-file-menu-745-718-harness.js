// Task 745 (Help menu, three groups, and the Tables and Hotkeys box) and Task 718 (File menu:
// Recents just above Close, an Import submenu) -- one harness because both tasks edited the same
// two menu-definition files and the seam between them is worth checking in one place. Run with:
//   node dev/lpn-spike/help-file-menu-745-718-harness.js
//
// Static-source, like dev/lpn-spike/help-menu-harness.js and dev/lpn-spike/tool-keys-harness.js: no
// browser, no lock. What it asserts:
//
//   1. The Help menu is Tom's three groups, in his order, divided by exactly two separators
//      (dev/lpn-spike/help-menu-harness.js already owns the row-by-row order assertion; this file
//      owns the GROUP shape -- which rows fall in which group).
//   2. The Tables and Hotkeys box exists, is wired to open from Help, and its content carries every
//      row of both table-help tables (lpn_notes_6, lpn_notes_7, moved rather than duplicated out of
//      the Notes box) and the new Map shortcuts table -- one row for every tool digit key, Select's
//      Esc alternate, Delete, Undo and the two zoom keys, read out of the same source the toolbar's
//      own shortcuts are wired from (LPN_TOOL_KEYS, LPN_TOOL_ALT_KEYS, the Ctrl+Z and +/-/= keydown
//      handlers), so a key added there and never gathered here is a red build.
//   3. The File menu's Recent files rows sit directly above Close, with no row between them but
//      their own separators.
//   4. The File menu's three import rows (surveyed points, EPANET file, libraries) are gathered
//      into one Import submenu, and none of the three stands loose in the flat list any more.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const page = fs.readFileSync(path.join(root, 'Looped-Network.php'), 'utf8');
const src = fs.readFileSync(path.join(root, 'js/looped-network.js'), 'utf8');
const en = fs.readFileSync(path.join(root, 'lib/lang.ec.en.php'), 'utf8');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

function fnBody(source, fnSig, nextFnPrefix) {
	const at = source.indexOf(fnSig);
	if (at < 0) { return null; }
	const from = source.slice(at);
	const end = from.indexOf(nextFnPrefix, 10);
	return end < 0 ? from : from.slice(0, end);
}

console.log('\n-- Task 745: the Help menu is three groups, divided by two separators --');
{
	const body = fnBody(src, 'function openHelpMenu', '\n\tfunction ');
	report(!!body, 'openHelpMenu() is in the source');
	const rowsMatch = body && body.match(/openMenu\(anchor, \[([\s\S]*)\]\);/);
	const rows = rowsMatch ? rowsMatch[1] : '';
	const seps = (rows.match(/\{ separator: true \}/g) || []).length;
	report(seps === 2, 'exactly two separators -- three groups, not more and not fewer', `${seps}`);

	// Group 1, true help, Tom's own order.
	const group1 = ['lpn_help_walkthroughs', 'lpn_help_hotkeys', 'lpn_help_icons'];
	const sep1 = rows.indexOf('{ separator: true }');
	const group1At = group1.map(k => rows.indexOf('pc.' + k));
	report(group1At.every(i => i >= 0 && i < sep1), 'group 1 (Walkthroughs, Tables and Hotkeys, Toolbars) is entirely before the first separator');
	report(group1At.every((v, i) => i === 0 || v > group1At[i - 1]), 'group 1 stands in Tom\'s order');

	// Group 2, helpers.
	const sep2 = rows.indexOf('{ separator: true }', sep1 + 1);
	const group2 = ['lpn_help_fix', 'install_main_menu', 'consent_settings_link'];
	const group2At = group2.map(k => rows.indexOf('pc.' + k));
	report(group2At.every(i => i > sep1 && i < sep2), 'group 2 (Fix something, Install, Cookies) is entirely between the two separators');
	report(group2At.every((v, i) => i === 0 || v > group2At[i - 1]), 'group 2 stands in Tom\'s order');

	// Group 3, true about.
	const group3 = ['lpn_help_notes', 'lpn_help_welcome', 'lpn_help_screenshots', 'privacy_link',
		'terms_link', 'about_main_menu'];
	const group3At = group3.map(k => rows.indexOf('pc.' + k));
	report(group3At.every(i => i > sep2), 'group 3 (Notes, Welcome, Screenshot, Privacy, Terms, About) is entirely after the second separator');
	report(group3At.every((v, i) => i === 0 || v > group3At[i - 1]), 'group 3 stands in Tom\'s order');

	// Every row named by Tom is present; every row NOT named by him that Help used to carry (there
	// was none but Contact, and Contact already left in an earlier task) is not silently smuggled
	// back in under a different key.
	report(!/pc\.contact_main_menu/.test(rows), 'no stray Contact row reappeared');
}

console.log('\n-- Task 745: the Tables and Hotkeys box exists and opens from Help --');
{
	report(/toggleHotkeysBox/.test(src), 'toggleHotkeysBox() exists');
	report(/label: pc\.lpn_help_hotkeys[^,]*, fn: toggleHotkeysBox/.test(src),
		'the Help row opens it');
	report(page.indexOf('id="lpn_hotkeys_popup"') > 0, 'the box markup is on the page');
	report(page.indexOf('id="lpn_hotkeys_close"') > 0, 'and has a close button');
	const at = page.indexOf('id="lpn_hotkeys_popup"');
	const boxBlock = page.slice(at, at + 3000);
	report(/display:none/.test(boxBlock.slice(0, 300)), 'the box starts hidden');
	report(/wireBoxMemory\(box, LPN_HOTKEYSBOX_KEY/.test(src),
		'it is remembered as window furniture, the same pattern as Notes and the Library box');
	report(/'lpn_hotkeysbox'/.test(src) && /doomed *= *\[[\s\S]*'lpn_hotkeysbox'/.test(src),
		'lpn_hotkeysbox is in the Erase-everything list');

	console.log('\n-- Task 745: the box carries ALL table help --');
	report(boxBlock.indexOf("$ec_lang['lpn_notes_6_term']") > 0, 'table columns help is in the box');
	report(boxBlock.indexOf("$ec_lang['lpn_notes_7_term']") > 0, 'table keyboard shortcuts are in the box');
	// Moved, not duplicated: the Notes popover (which ends where this box begins) no longer shows
	// either. Sliced narrowly so a coincidental substring match elsewhere on the page cannot pass
	// this by accident.
	const notesAt = page.indexOf('id="lpn_notes_popup"');
	const notesBlock = page.slice(notesAt, at);
	report(notesBlock.indexOf("$ec_lang['lpn_notes_6_term']") < 0 &&
		notesBlock.indexOf("$ec_lang['lpn_notes_7_term']") < 0,
		'and the Notes popover no longer shows either -- moved, not duplicated');

	console.log('\n-- Task 745: the box carries ALL keyboard shortcuts, by context --');
	report(boxBlock.indexOf("$ec_lang['lpn_hotkeys_map_term']") > 0, 'a Map context is in the box');
	const mapDefMatch = en.match(/\$ec_lang\['lpn_hotkeys_map_def'\]='([^\n]*)';/);
	report(!!mapDefMatch, 'lpn_hotkeys_map_def exists in lib/lang.ec.en.php');
	const mapRows = mapDefMatch ? (mapDefMatch[1].match(/<tr>/g) || []).length : 0;
	// 1 row per tool digit (1-9, Select's Esc alternate riding on the same row as its digit) plus
	// Delete, Ctrl+Z, Zoom in and Zoom out -- 13 in all. THE HARNESS THAT COUNTS ROWS, the kind
	// Task 745 asked to find for the existing shortcuts table (lpn_notes_7, asserted at 12 rows in
	// help-menu-harness.js); this is that same discipline applied to the new table.
	report(mapRows === 14, 'the Map table has all fourteen rows', `${mapRows}`);
	report(!!mapDefMatch && mapDefMatch[1].indexOf('lpn-notes-table') > 0,
		'and it is a real <table class="lpn-notes-table">, the same shape as the Tables ones');

	// Every digit LPN_TOOL_KEYS actually binds is named in the table, read out of the SAME source
	// object the toolbar's own shortcuts come from -- so a digit rebound later and never re-gathered
	// here is a red build rather than a silently stale help box.
	const toolKeysMatch = src.match(/var LPN_TOOL_KEYS = \{([^}]*)\}/);
	const digits = toolKeysMatch ? (toolKeysMatch[1].match(/'(\d)':/g) || []).map(s => s[1]) : [];
	report(digits.length === 9, 'read all nine tool digits out of LPN_TOOL_KEYS', `${digits.length}`);
	const mapDef = mapDefMatch ? mapDefMatch[1] : '';
	digits.forEach(function (d) {
		report(new RegExp('<td>' + d + '(?: |<)').test(mapDef), 'digit ' + d + ' is in the Map table');
	});
	// The two named alternates (LPN_TOOL_ALT_KEYS: select -> Esc, delete -> Delete), Undo, and the
	// two zoom keys -- read out of the same handlers the toolbar and the keydown listeners use.
	report(/Esc/.test(mapDef), 'Select\'s Esc alternate is in the Map table (LPN_TOOL_ALT_KEYS)');
	report(/Delete/.test(mapDef), 'Delete is in the Map table');
	report(/Ctrl\+Z/.test(mapDef) && /if \(k === 'z'\) \{ e\.preventDefault\(\); undo\(\); \}/.test(src),
		'Ctrl+Z (undo) is in the Map table and still the key the page actually binds');
	report(/Ctrl\+Y or Ctrl\+Shift\+Z/.test(mapDef) &&
		/if \(k === 'z' && e\.shiftKey\) \{ e\.preventDefault\(\); redo\(\); return; \}/.test(src) &&
		/if \(k === 'y' && e\.ctrlKey[^\n]*redo\(\)/.test(src),
		'Ctrl+Y and Ctrl+Shift+Z (redo) are in the Map table and still the keys the page actually binds');
	report(/\+ or =/.test(mapDef) && /e\.key === '\+' \|\| e\.key === '='/.test(src),
		'the zoom-in keys (+ and =) are in the Map table and still the keys the page actually binds');
	report(/<td>-<\/td>/.test(mapDef) && /e\.key === '-'/.test(src),
		'zoom-out (-) is in the Map table and still the key the page actually binds');
}

console.log('\n-- Task 718: Recent files sits directly above Close --');
{
	const body = fnBody(src, 'function openFileMenu', '\n\tfunction ');
	report(!!body, 'openFileMenu() is in the source');
	report(/\], recentRows, \[/.test(body), 'recentRows is concatenated directly before the closing block');
	const tail = body.slice(body.indexOf('], recentRows, ['));
	report(/\{ separator: true \},\s*\n\s*\{ icon: 'close', label: pc\.lpn_close/.test(tail),
		'and the very next row after it is Close, with only its own separator between them');
	report(!/lpn_close[\s\S]*recentFiles\.forEach/.test(body),
		'Recent files no longer builds below Close (the pre-Task-718 order)');
}

console.log('\n-- Task 718: the three import rows are one Import submenu --');
{
	const fileBody = fnBody(src, 'function openFileMenu', '\n\tfunction ');
	const importRowsBody = fnBody(src, 'function importMenuRows', '\n\tfunction ');
	report(!!importRowsBody, 'importMenuRows() exists');
	['pickSurveyFile', 'pickInpFile', 'libImportPick'].forEach(function (fn) {
		report(importRowsBody.indexOf(fn) > 0, fn + ' is one of the submenu rows');
	});
	report(/label: pc\.lpn_file_import_menu[^,]*, submenu: importMenuRows/.test(fileBody),
		'the File menu opens them through one submenu row, the same idiom Help > Toolbar uses');
	// None of the three stands loose in the flat top-level list any more.
	const flatListMatch = fileBody.match(/openMenu\(anchor, \[([\s\S]*?)\]\.concat\(\[/);
	const flatList = flatListMatch ? flatListMatch[1] : '';
	report(flatList.indexOf('pickSurveyFile') < 0 && flatList.indexOf('pickInpFile') < 0 &&
		flatList.indexOf('libImportPick') < 0,
		'none of the three import handlers is called directly from the flat File menu list any more');
	// Export EPANET file stays where Import EPANET file used to be adjacent to it (2026-09-17 EWB
	// finding): the submenu row now sits directly above it instead.
	report(/submenu: importMenuRows[\s\S]{0,400}lpn_file_export_inp/.test(fileBody),
		'the Import submenu row sits directly above Export EPANET file');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
