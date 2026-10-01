// THE WATER MENU'S ANALYZE FLY-OUT (Task 754 groundwork, Tom 2026-09-30) and the Design check's
// own option keys (Tom, 2026-10-01: a control gets its own key whenever any language needs it).
//   node dev/lpn-spike/analyze-flyout-harness.js
// 1. Water > Analyze is one submenu row; Fire flow, Criticality and Demand scaling are its rows and
//    open their dialogs; none stands loose in the Water menu.
// 2. The Design check's None/All/Selected read lpn_ff_design_off/_all/_selected, not the junction
//    keys, in the source and in English.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;
const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');
const en = fs.readFileSync(path.join(__dirname, '../../lib/lang.ec.en.php'), 'utf8');

const L = loadLoopedNetwork(
	"\t\tanalyzeRows: analyzeMenuRows,\n" +
	"\t\tstub: function (o) { openFireFlowBox = o.ff; openCriticalityBox = o.crit; openDemandScaleBox = o.ds; closeMenu = o.close; }\n"
);
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const opened = [];
L.stub({
	ff: function () { opened.push('ff'); },
	crit: function () { opened.push('crit'); },
	ds: function () { opened.push('ds'); },
	close: function () { opened.push('close'); }
});
const rows = L.analyzeRows();
ok('Analyze holds three rows', rows.length === 3, rows.length);
ok('row 1 is Fire flow', rows[0].label === PC.lpn_ff_menu);
ok('row 2 is Criticality', rows[1].label === PC.lpn_crit_menu);
ok('row 3 is Demand scaling', rows[2].label === PC.lpn_ds_menu);
rows[0].fn();
ok('Fire flow row closes the menu and opens its dialog', opened.join() === 'close,ff', opened.join());
opened.length = 0;
rows[1].fn();
ok('Criticality row closes the menu and opens its dialog', opened.join() === 'close,crit', opened.join());
opened.length = 0;
rows[2].fn();
ok('Demand scaling row closes the menu and opens its dialog', opened.join() === 'close,ds', opened.join());

const wi = src.indexOf('submenu: analyzeMenuRows');
ok('the Water menu hangs Analyze as a fly-out', wi > 0 &&
	/lpn_analyze_menu/.test(src.slice(wi - 300, wi)));
const fnBody = src.slice(src.indexOf('function openWaterMenu') > 0 ? src.indexOf('function openWaterMenu') : 0);
const loose = (src.match(/fn: function \(\) \{ closeMenu\(\); open(FireFlow|Criticality|DemandScale)Box\(\); \}/g) || []).length;
ok('the three analyses are opened only from the fly-out rows', loose === 3, loose);
ok('Analyze and its tip are English keys',
	/\['lpn_analyze_menu'\]='Analyze'/.test(en) && /\['lpn_analyze_menu_tip'\]='/.test(en));

const d = src.slice(src.indexOf('boxes.design = ffSelect(['), src.indexOf('boxes.design = ffSelect([') + 400);
ok('Design check reads its own None/All/Selected keys',
	/lpn_ff_design_off/.test(d) && /lpn_ff_design_all/.test(d) && /lpn_ff_design_selected/.test(d));
ok('and no longer borrows the junction or Source type keys',
	!/lpn_ff_all|lpn_ff_selected|lpn_source_type_none/.test(d));
['off', 'all', 'selected'].forEach(function (k) {
	ok('lpn_ff_design_' + k + ' is in English', typeof PC['lpn_ff_design_' + k] === 'string' && PC['lpn_ff_design_' + k] !== '');
});
console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
