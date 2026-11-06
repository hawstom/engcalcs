// The energy price of the WaterGEMS export (Task 749). Where WaterGEMS keeps a constant price was learned from Tom's save
// energy-price.wtg.sqlite of 2026-11-04 (dev/wtg-export.md, "Energy price"):
//   node dev/lpn-spike/wtg-energy-price-harness.js
// Checks the rows written for [ENERGY] Global Price and a pump's own PRICE against that save's rows, that a price pattern and a
// demand charge stay on the not-written list, and prints EPANET's energy and cost for the pump over 24 hours.
// Tom's save is optional: set WTG_ENERGY_PRICE_SAVE to its path (default ~/tom-files/2026-11-04/wtg-saves-redo/energy-price.wtg.sqlite).
// Licence line: nobody decompiles or probes Bentley software; the save is a file Tom saved as an ordinary user.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ft = require('./wtg-feature-tests.js');
const se = require('./wtg-saves-epanet.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAILED: ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

// The hydraulics-only chlorine network of Tom's save, with an [ENERGY] section.
function net(energyLines) {
	const t = ft.cyclingNet({ title: 'Energy price test: PU1 pays for power' });
	return t.replace(/\[ENERGY\][\s\S]*?(\n\n|\n\[)/, (m, tail) => '[ENERGY]\n' + energyLines.join('\n') + '\n' + (tail === '\n\n' ? '\n' : '[')).replace(/ Quality Timestep.*\n/, '');
}

// EPANET's energy for pump PU1 over the run: kWh as the sum of kW x step, and the cost at a constant price.
async function energy(inp, priceNow) {
	const epanet = await import('file://' + path.join(__dirname, '..', '..', 'js', 'vendor', 'epanet-js.js'));
	const ws = new epanet.Workspace();
	await ws.loadModule();
	const p = new epanet.Project(ws);
	ws.writeFile('r.inp', inp);
	p.open('r.inp', 'r.rpt', 'r.out');
	const EN_ENERGY = 13;
	let kwh = 0, cost = 0;
	try {
		const li = p.getLinkIndex('PU1');
		p.openH(); p.initH(0);
		for (let guard = 0; guard < 100000; guard++) {
			p.runH();
			const ts = p.nextH();
			// The kW of this step, held for the step that follows (the step to the next event).
			const kw = p.getLinkValue(li, EN_ENERGY);
			if (ts > 0) { kwh += kw * ts / 3600; cost += kw * ts / 3600 * priceNow; }
			if (!(ts > 0)) { break; }
		}
		p.closeH();
	} finally { try { p.close(); } catch (e) { /* closed */ } }
	return { kwh: kwh, cost: cost };
}

(async function () {
	try { require('./wtg-sqljs.js').sqlJsPath(); } catch (e) { console.log('NOT RUN: sql.js not found (' + e.message + ').'); process.exit(0); }
	const env = await ft.setup(), SQL = env.SQL, EC = env.EngCalcs, lib = env.lib;
	const rows = (db, sql, params) => { const st = db.prepare(sql), o = []; if (params) { st.bind(params); } while (st.step()) { o.push(st.getAsObject()); } st.free(); return o; };
	const write = (inp) => {
		const out = lib.writeWtg(SQL, env.tplSqlite, EC.lpnInpParse(se.withPumpPipes(inp)), { initial: {}, changes: [] }, { name: 'energy', efficiency: 75 });
		return { db: new SQL.Database(new Uint8Array(out.bytes)), report: out.report };
	};
	const pumpId = (db) => rows(db, "SELECT ElementID AS id FROM HMIModelingElement WHERE Label = 'PU1'")[0].id;

	console.log('\nGlobal price 0.10');
	const g = write(net([' Global Efficiency  \t75', ' Global Price       \t0.10']));
	const ep = rows(g.db, 'SELECT * FROM EnergyPricing');
	ok('one EnergyPricing row', ep.length === 1, String(ep.length));
	ok('both price fields hold 0.1', ep[0].EnergyPricing_EnergyPrice === 0.1 && ep[0].EnergyPricing_StartEnergyPrice === 0.1);
	ok('the pump points at it', rows(g.db, 'SELECT * FROM BasePump_EnergyCost_Data WHERE DomainElementID = ?', [pumpId(g.db)]).every((r) => r.EnergyCost_EnergyPricingID === ep[0].SupportElementID && r.EnergyCost_InlcudeInEnergyCalculation === 1));
	ok('a support element of type 61 labelled "Energy Pricing - 1"', rows(g.db, 'SELECT m.Label AS l, m.SmartLabel AS s, m.ElementType AS t, s.SupportElementTypeID AS ty FROM HMIModelingElement m JOIN HMISupportElement s ON s.SupportElementID = m.ElementID WHERE m.ElementID = ?', [ep[0].SupportElementID])
		.every((r) => r.l === 'Energy Pricing - 1' && r.s === 'Energy Pricing - 0000001' && r.t === 4 && r.ty === 61));
	ok('the type count says 1', rows(g.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 4 AND ElementTypeID = 61')[0].c === 1);
	ok('integrity ok, no foreign key violations', g.report.integrity === 'ok' && g.report.foreignKeyViolations === 0);

	console.log('\nThe same row as Tom\'s save');
	const savePath = process.env.WTG_ENERGY_PRICE_SAVE || path.join(os.homedir(), 'tom-files', '2026-11-04', 'wtg-saves-redo', 'energy-price.wtg.sqlite');
	if (fs.existsSync(savePath)) {
		const sv = new SQL.Database(new Uint8Array(fs.readFileSync(savePath)));
		const sp = rows(sv, 'SELECT * FROM EnergyPricing');
		const strip = (r) => { const o = Object.assign({}, r); delete o.SupportElementID; return JSON.stringify(o); };
		ok('his EnergyPricing row (all columns but the id) equals ours', sp.length === 1 && strip(sp[0]) === strip(ep[0]), strip(sp[0] || {}));
		const sl = rows(sv, 'SELECT m.Label AS l, m.SmartLabel AS s, m.ElementType AS t FROM HMIModelingElement m WHERE m.ElementID = ?', [sp[0].SupportElementID])[0];
		ok('his label and kind equal ours', sl.l === 'Energy Pricing - 1' && sl.s === 'Energy Pricing - 0000001' && sl.t === 4, JSON.stringify(sl));
		const sc = rows(sv, 'SELECT * FROM BasePump_EnergyCost_Data WHERE EnergyCost_EnergyPricingID = ?', [sp[0].SupportElementID]);
		ok('his pump row: included 1, carbon 0, carbon id empty', sc.length === 1 && sc[0].EnergyCost_InlcudeInEnergyCalculation === 1 && sc[0].EnergyCost_IncludeInCarbonEmissionsCalculation === 0 && sc[0].EnergyCost_CarbonEmissionID === null);
		sv.close();
	} else { console.log('  (Tom\'s save not found at ' + savePath + '; skipped)'); }

	console.log('\nGlobal price and a pump\'s own price');
	const o = write(net([' Global Efficiency  \t75', ' Global Price       \t0.10', ' Pump PU1 Price     \t0.25']));
	const op = rows(o.db, 'SELECT * FROM EnergyPricing');
	ok('one element, at the pump\'s own price', op.length === 1 && op[0].EnergyPricing_EnergyPrice === 0.25, JSON.stringify(op.map((r) => r.EnergyPricing_EnergyPrice)));
	ok('the pump points at it', rows(o.db, 'SELECT * FROM BasePump_EnergyCost_Data WHERE DomainElementID = ?', [pumpId(o.db)]).every((r) => r.EnergyCost_EnergyPricingID === op[0].SupportElementID));

	console.log('\nNo price');
	const z = write(net([' Global Efficiency  \t75', ' Global Price       \t0']));
	ok('no EnergyPricing row and no pump pointing anywhere', rows(z.db, 'SELECT * FROM EnergyPricing').length === 0
		&& rows(z.db, 'SELECT * FROM BasePump_EnergyCost_Data WHERE EnergyCost_EnergyPricingID IS NOT NULL').length === 0);
	ok('integrity ok', z.report.integrity === 'ok' && z.report.foreignKeyViolations === 0);

	console.log('\nNot written: price pattern and demand charge');
	const nw = (extra) => lib.energyNotWritten(EC.lpnInpParse(net([' Global Efficiency  \t75', ' Global Price       \t0.10'].concat(extra))).inpSections.ENERGY);
	ok('a constant price, global or a pump\'s own, is not on the list', nw([]).length === 0 && nw([' Pump PU1 Price     \t0.25']).length === 0);
	ok('a global price pattern is', nw([' Global Pattern     \tSP']).length === 1);
	ok('a pump\'s price pattern is', nw([' Pump PU1 Pattern   \tSP']).length === 1);
	ok('a demand charge other than zero is', nw([' Demand Charge      \t5']).length === 1);
	ok('a demand charge of zero is not', nw([' Demand Charge      \t0']).length === 0);
	const pg = write(net([' Global Efficiency  \t75', ' Global Price       \t0.10', ' Global Pattern     \tSP']));
	ok('the price is still written beside a pattern', rows(pg.db, 'SELECT * FROM EnergyPricing').length === 1);

	console.log('\nEPANET, PU1 over 24 hours (the figures for Tom\'s test)');
	const e = await energy(se.withStep(se.withPumpPipes(net([' Global Efficiency  \t75', ' Global Price       \t0.10'])), '0:06'), 0.10);
	console.log('  energy ' + e.kwh.toFixed(1) + ' kWh, cost ' + e.cost.toFixed(2));
	ok('energy near Tom\'s WaterGEMS reading of 222.1 kWh', near(e.kwh, 222.1, 3), e.kwh.toFixed(2));
	ok('cost near 22.21', near(e.cost, 22.21, 0.3), e.cost.toFixed(2));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
