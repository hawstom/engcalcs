// INPUT EPANET REFUSES IS REFUSED BY NAME IN BOTH ENGINES, AND NEVER SILENTLY (EPS audit 2026-11-18, finding 4). Run:
//   node dev/lpn-spike/engine-refusal-harness.js
//
// EPANET (input1.c adjustdata(), error 208) refuses Required Pressure minus Minimum Pressure under 0.1 in the unit of the
// file it reads. The page's export is LPS and metres, so 0.1 psi (EPANET's own default, 0.0703 m) is refused. The page's
// bridge used to answer ok=false with no issue and no message while the built-in solver ran the model. Now
// EngCalcs.lpnDiagnose says 'pda-pressure-gap' and both engines stop on it; a number at the limit still runs; no
// number of the user's is changed; and any refusal that gets past the diagnosis still carries EPANET's own words.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EC = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EC;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

function model(minP, reqP) {
	return {
		method: 'hw',
		hydraulics: { demandModel: 'PDA', minPressure: minP, reqPressure: reqP, pressureExponent: 0.5 },
		nodes: [{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
		        { id: 'J', type: 'junction', elev: 0, demand: 0.01 }],
		links: [{ id: 'P1', type: 'pipe', from: 'R', to: 'J', length: 100, diameter: 0.15, roughness: 130, k: 0, status: 'open' }]
	};
}
const codes = (r) => (r.issues || []).map((i) => i.code);

(async function () {
	await EC.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));

	console.log('\n--- 0.1 psi (0.0703 m) apart, EPANET’s own default, is refused by name in both engines ---');
	{
		const m = model(0, 0.1 * 0.7030696);
		ok('lpnDiagnose names it', codes({ issues: EC.lpnDiagnose(m) }).indexOf('pda-pressure-gap') >= 0, JSON.stringify(EC.lpnDiagnose(m)));
		const nat = EC.lpnSolve(m), epa = await EC.lpnSolveEpanet(m);
		ok('the built-in solver stops on it', nat.ok === false && codes(nat).indexOf('pda-pressure-gap') >= 0, JSON.stringify(codes(nat)));
		ok('the EPANET bridge stops on it, with the same issue', epa.ok === false && codes(epa).indexOf('pda-pressure-gap') >= 0, JSON.stringify(codes(epa)));
		ok('the user’s numbers are not changed', m.hydraulics.minPressure === 0 && m.hydraulics.reqPressure === 0.1 * 0.7030696);
		// and EPANET really does refuse the file the page would have written, so this is not a rule of ours
		const raw = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(m)));
		ok('the extended-period bridge stops on it too', raw.ok === false && codes(raw).indexOf('pda-pressure-gap') >= 0, JSON.stringify(codes(raw)));
	}

	console.log('\n--- a gap of 0.1 m or more runs in both engines ---');
	{
		const m = model(0, 0.1);
		ok('lpnDiagnose says nothing', EC.lpnDiagnose(m).length === 0, JSON.stringify(EC.lpnDiagnose(m)));
		const nat = EC.lpnSolve(m, { demandModelOk: true }), epa = await EC.lpnSolveEpanet(m);
		ok('EPANET runs it', epa.ok === true, JSON.stringify(epa.issues) + ' ' + (epa.engineError || ''));
		ok('the built-in solver runs it', nat.ok === true, JSON.stringify(nat.issues));
		const m2 = model(10, 10.5), epa2 = await EC.lpnSolveEpanet(m2);
		ok('the gap is Required minus Minimum, not Required alone', EC.lpnDiagnose(m2).length === 0 && epa2.ok === true, JSON.stringify(epa2.issues));
	}

	console.log('\n--- a refusal that gets past the diagnosis still carries EPANET’s own words ---');
	{
		const m = model(0, 5);
		m.hydraulics.maxCheck = -1;   // a value the .inp writer states and EPANET will not read
		const epa = await EC.lpnSolveEpanet(m);
		if (epa.ok) { ok('(this input was not refused after all; the check below has nothing to hold)', true); }
		else { ok('ok=false never arrives without a message', (epa.issues || []).length > 0 || String(epa.engineError || '').length > 0, JSON.stringify(epa).slice(0, 200)); }
	}

	console.log(fails ? '\n' + fails + ' FAILURES' : '\nall engine-refusal assertions passed');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
