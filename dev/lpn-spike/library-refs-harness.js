// LIBRARIES BOX: A NOTE IN ITS OWN SECTION, AND A PUMP'S PRICE PATTERN FOLLOWS ITS PATTERN
//
//   node dev/lpn-spike/library-refs-harness.js
//
// 1. The "controls refer to an inactive asset" note belongs to the Controls section, not Patterns.
// 2. Renaming or deleting a pattern reaches a pump's price pattern (energyPattern), in Base and in
//    a scenario's override of it, as it reaches every other reference.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const { loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp,\n" +
	"\t\tapplyUnits: function (p) { applyUnitSelections(inpUnitSelections(p)); },\n" +
	"\t\tsetDoc: function (d) { doc = d; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\trenamePattern: libRenamePattern, deletePattern: libDeletePattern,\n" +
	"\t\tbuildPatterns: buildPatternSection, buildControls: buildControlSection,\n" +
	"\t\treadControl: libReadControl\n"
);
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-patterns.js'));

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail ? '   ' + detail : ''));
	if (!ok) { failures++; }
}
function texts(el, out) {
	out = out || [];
	if (el._text) { out.push(el._text); }
	(el.children || []).forEach((c) => texts(c, out));
	return out;
}
const MARK = EngCalcs.pageConfig.lpn_control_inactive_note.split('{ids}')[0];

const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8'));
setUnitSet('us');
L.applyUnits(parsed);
const doc = L.docFromInp(parsed, 'Net3');
L.setDoc(doc);

console.log('-- the inactive-controls note --');
const pump = doc.links.filter((l) => l.type === 'pump')[0];
const ctl = L.readControl('LINK ' + pump.id + ' CLOSED AT TIME 3');
doc.controls = (doc.controls || []).concat([ctl.rec]);
pump._active = false;
const pHost = document.createElement('div'), cHost = document.createElement('div');
L.buildPatterns(pHost);
L.buildControls(cHost);
check(texts(cHost).some((t) => t.indexOf(MARK) >= 0), 'the note appears in the Controls section');
check(!texts(pHost).some((t) => t.indexOf(MARK) >= 0), 'and not in the Patterns section');
pump._active = true;

console.log('\n-- a pump\'s price pattern --');
const pat = doc.patterns[0], was = pat.id;
const scn = { id: 'sX', name: 'Off-peak', parent: 'base', overrides: {} };
scn.overrides['l:' + pump.id] = { energyPattern: was };
L.getScenarios().push(scn);
pump._energyPattern = was;
check(L.renamePattern(pat, 'Tariff'), 'the pattern is renamed');
check(pump._energyPattern === 'Tariff', 'the pump\'s price pattern follows the rename', String(pump._energyPattern));
check(scn.overrides['l:' + pump.id].energyPattern === 'Tariff', 'and so does a scenario\'s override of it',
	String(scn.overrides['l:' + pump.id].energyPattern));
L.deletePattern(pat);
check(!pump._energyPattern, 'deleting the pattern clears the pump\'s price pattern', String(pump._energyPattern));
check(!scn.overrides['l:' + pump.id].energyPattern, 'and the scenario\'s override of it',
	String(scn.overrides['l:' + pump.id].energyPattern));

console.log(failures ? '\n' + failures + ' FAILED' : '\nall passed');
process.exit(failures ? 1 : 0);
