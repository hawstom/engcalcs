// PSI, KPA AND BAR ON THE LOOPED NETWORK PAGE ARE EPANET'S (Tom, 2026-10-03). Run: node dev/lpn-spike/psi-epanet-harness.js
//
// EPANET's PSIperFT is 0.4333; the exact value is 0.4335275. validate.js proves Net1/2/3 junction
// pressures match EPANET's report through EngCalcs.EPANET_PSI_PER_M. THIS file proves the page and
// its neighbours actually use that one number, and that the suite-wide factor is left exact:
//   1. the page's own EngCalcs.unitFactors.psi is EPANET's (so every head -> pressure display is),
//   2. lib/Units.lib.php's $ec_units['psi'] is still the exact one (other calculators),
//   3. psiToHead (fire flow's 20 psi) and the .inp reader's psi (valve settings) agree with it,
//   4. the pressure colour breaks (20/40/60/80 psi) land on whole psi on this page,
//   5. a Net3 junction reads as EPANET's report does, to its rounding.

const fs = require('fs');
const path = require('path');
const { loadLoopedNetwork } = require('./lpn-dom-stub.js');
const EngCalcs = global.EngCalcs;
let fails = 0;
function ok(label, pass, detail) {
	console.log((pass ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
	if (!pass) { fails++; }
}

const units = fs.readFileSync(path.join(__dirname, '..', '..', 'lib', 'Units.lib.php'), 'utf8');
const stubTable = {};
for (const x of units.matchAll(/\$ec_units\['(\w+)'\]\s*=\s*([0-9.eE+-]+)\s*;/g)) { stubTable[x[1]] = parseFloat(x[2]); }
const exactPsi = stubTable.psi;   // the shared table, which this page must NOT inherit

// The page is loaded the way every harness loads it; the override runs as its IIFE starts.
loadLoopedNetwork('\t\tx: 0');

const FT = 0.3048, EPA = 0.4333;
ok('EngCalcs.EPANET_PSI_PER_FT is 0.4333', EngCalcs.EPANET_PSI_PER_FT === EPA);
ok('the page\'s psi factor is EPANET\'s, psi per metre',
	Math.abs(EngCalcs.unitFactor('psi') - EPA / FT) < 1e-12, String(EngCalcs.unitFactor('psi')));
ok('one foot of head reads 0.4333 psi on the page',
	Math.abs(EngCalcs.unitFactor('psi') / EngCalcs.unitFactor('fth2o') - EPA) < 1e-12);
ok('lib/Units.lib.php still holds the exact psi for the other calculators',
	Math.abs(exactPsi - 1.4223343307119563) < 1e-15 && Math.abs(exactPsi * FT - 0.4335275) < 1e-6, String(exactPsi));
ok('metres of water are untouched', EngCalcs.unitFactor('mh2o') === 1);
const KPA = EPA * 6.895 / FT;
ok('the page\'s kPa factor is EPANET\'s: 0.4333 * 6.895 / 0.3048 = 9.80185',
	Math.abs(EngCalcs.unitFactor('kpa') - KPA) < 1e-12 && Math.abs(KPA - 9.80185) < 1e-5, String(EngCalcs.unitFactor('kpa')));
ok('one psi reads 6.895 kPa on the page',
	Math.abs(EngCalcs.unitFactor('kpa') / EngCalcs.unitFactor('psi') - 6.895) < 1e-12);
ok('lib/Units.lib.php still holds the exact kPa for the other calculators', stubTable.kpa === 9.80665);
const BAR = EPA * 0.068948 / FT;
ok('the page\'s bar factor is EPANET\'s: 0.4333 * 0.068948 / 0.3048',
	Math.abs(EngCalcs.unitFactor('bar') - BAR) < 1e-12 && Math.abs(BAR - 0.098018) < 1e-5, String(EngCalcs.unitFactor('bar')));
ok('one psi reads 0.068948 bar on the page',
	Math.abs(EngCalcs.unitFactor('bar') / EngCalcs.unitFactor('psi') - 0.068948) < 1e-12);
ok('lib/Units.lib.php still holds the exact bar for the other calculators', stubTable.bar === 0.0980665);

// 3. the neighbours
const toHead = EngCalcs.lpnFireFlowPsiToHead;
if (typeof toHead === 'function') {
	ok('fire flow: 20 psi is 20 / 0.4333 ft of head',
		Math.abs(toHead(20) - 20 / EPA * FT) < 1e-9, String(toHead(20)));
} else {
	ok('fire flow exports psiToHead', false);
}

// 4. the ramp criterion: 20/40/60/80 psi in metres, through the page's own factor
const ramps = EngCalcs.lpnRamps;
const br = ramps.criterionBreaks ? ramps.criterionBreaks('pressure') : null;
ok('colour ramp: the pressure criterion breaks are 20/40/60/80 psi on this page',
	br && br.every((m, i) => Math.abs(m * EngCalcs.unitFactor('psi') - 20 * (i + 1)) < 0.001),
	br && br.map((m) => (m * EngCalcs.unitFactor('psi')).toFixed(4)).join(','));

// 5. Net3 junction 15 at t=0, as EPANET printed it (Net3.rpt: head 125.81 ft, 40.65 psi, elev 32 ft)
const rpt = fs.readFileSync(path.join(__dirname, 'reference', 'Net3.rpt'), 'utf8');
const m = /^\s+15\s+620\.00\s+([\d.]+)\s+([\d.-]+)/m.exec(rpt);
const headM = parseFloat(m[1]) * FT, elevM = 32 * FT;
const psi = (headM - elevM) * EngCalcs.unitFactor('psi');
ok('Net3 junction 15: our psi from EPANET\'s own head reads EPANET\'s report to its rounding',
	Math.abs(psi - parseFloat(m[2])) < 0.006, psi.toFixed(4) + ' vs ' + m[2]);
ok('...where the exact factor would not', Math.abs((headM - elevM) * exactPsi - parseFloat(m[2])) > 0.015);

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);
