// The energy price of the WaterGEMS export (Task 749). Where WaterGEMS keeps a constant price was learned from Tom's save
// energy-price.wtg.sqlite of 2026-11-04 (dev/wtg-export.md, "Energy price"):
//   node dev/lpn-spike/wtg-energy-price-harness.js
// Checks the rows written for [ENERGY] Global Price and a pump's own PRICE against that save's rows, then (2026-11-06) the price
// pattern and the demand charge against Tom's saves energy-price-pattern and energy-demand-charge, and prints EPANET's energy,
// cost and peak for the pump over 24 hours. His saves of 2026-11-06 are optional: WTG_ENERGY_MORE_DIR (default
// ~/tom-files/2026-11-06/wtg-energy-more).
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
async function energy(inp, priceAt) {
	const epanet = await import('file://' + path.join(__dirname, '..', '..', 'js', 'vendor', 'epanet-js.js'));
	const ws = new epanet.Workspace();
	await ws.loadModule();
	const p = new epanet.Project(ws);
	ws.writeFile('r.inp', inp);
	p.open('r.inp', 'r.rpt', 'r.out');
	const EN_ENERGY = 13;
	let kwh = 0, cost = 0, peak = 0, t0 = 0;
	try {
		const li = p.getLinkIndex('PU1');
		p.openH(); p.initH(0);
		for (let guard = 0; guard < 100000; guard++) {
			t0 = p.runH();
			const ts = p.nextH();
			// The kW of this step, held for the step that follows (the step to the next event).
			const kw = p.getLinkValue(li, EN_ENERGY);
			peak = Math.max(peak, kw);
			if (ts > 0) { kwh += kw * ts / 3600; cost += kw * ts / 3600 * (typeof priceAt === 'function' ? priceAt(t0) : priceAt); }
			if (!(ts > 0)) { break; }
		}
		p.closeH();
	} finally { try { p.close(); } catch (e) { /* closed */ } }
	return { kwh: kwh, cost: cost, peak: peak };
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

	console.log('\nNot written: only a price pattern the project does not define');
	const base = [' Global Efficiency  \t75', ' Global Price       \t0.10'];
	const nw = (extra) => lib.energyNotWritten(EC.lpnInpParse(net(base.concat(extra))).inpSections.ENERGY, ['EP']);
	ok('a constant price, global or a pump\'s own, is not on the list', nw([]).length === 0 && nw([' Pump PU1 Price     \t0.25']).length === 0);
	ok('a pattern the project does not define is', nw([' Global Pattern     \tNOPE']).length === 1);
	ok('a pattern it defines is not', nw([' Global Pattern     \tEP']).length === 0);
	ok('a demand charge is not', nw([' Demand Charge      \t5']).length === 0);

	console.log('\nPrice pattern (0.05, 0.10, 0.20, 0.10 by quarter of the day) and demand charge 12');
	// EP: price multipliers 0.5, 1, 2, 1 by six hours, on a 0.10 price.
	const EP = []; for (let h = 0; h < 24; h++) { EP.push(h < 6 ? 0.5 : h < 12 ? 1 : h < 18 ? 2 : 1); }
	const withEP = (t) => { let rows = ''; for (let i = 0; i < 24; i += 6) { rows += ' EP              \t' + EP.slice(i, i + 6).join('\t') + '\n'; } return t.replace('\n[CURVES]', '\n' + rows + '\n[CURVES]'); };
	const patNet = withEP(net(base.concat([' Global Pattern     \tEP'])));
	const dcNet = net(base.concat([' Demand Charge      \t12']));
	const wp = write(patNet), wd = write(dcNet);
	const pr = rows(wp.db, 'SELECT * FROM EnergyPricing')[0], pc = rows(wp.db, 'SELECT EnergyPriceCurve_TimeFromStart AS t, EnergyPriceCurve_EnergyPrice AS p FROM EnergyPricing_EnergyPriceCurve ORDER BY t');
	ok('pattern: start price 0.05, price 0.1, tariff 1, four curve points', pr.EnergyPricing_StartEnergyPrice === 0.05 && pr.EnergyPricing_EnergyPrice === 0.1 && pr.TariffType === 1 && pr.EnergyPriceCurveCount === 4 && pc.length === 4, JSON.stringify(pr));
	ok('pattern: points 6 h 0.1, 12 h 0.2, 18 h 0.1, 24 h 0.05', JSON.stringify(pc.map((r) => [r.t, r.p])) === JSON.stringify([[21600, 0.1], [43200, 0.2], [64800, 0.1], [86400, 0.05]]), JSON.stringify(pc));
	const dr = rows(wd.db, 'SELECT * FROM EnergyPricing')[0];
	ok('demand: charge 12 and included 1, price still 0.1 constant', dr.EnergyPricing_PeakDemandCharge === 12 && dr.EnergyPricing_IncludePeakDemandCharge === 1 && dr.EnergyPricing_EnergyPrice === 0.1 && dr.TariffType === 0 && dr.EnergyPriceCurveCount === 0, JSON.stringify(dr));
	ok('both: integrity ok', wp.report.integrity === 'ok' && wp.report.foreignKeyViolations === 0 && wd.report.integrity === 'ok' && wd.report.foreignKeyViolations === 0);
	ok('both: the pump points at its element', [[wp, pr], [wd, dr]].every((x) => rows(x[0].db, 'SELECT * FROM BasePump_EnergyCost_Data WHERE DomainElementID = ?', [pumpId(x[0].db)]).every((r) => r.EnergyCost_EnergyPricingID === x[1].SupportElementID)));
	ok('nothing is reported as not written', !(wp.report.notCarried || []).some((n) => /energy/i.test(JSON.stringify(n))) && !(wd.report.notCarried || []).some((n) => /energy/i.test(JSON.stringify(n))));

	const dir = process.env.WTG_ENERGY_MORE_DIR || path.join(os.homedir(), 'tom-files', '2026-11-06', 'wtg-energy-more');
	const same = (name, ours, theirs) => {
		const f = path.join(dir, name);
		if (!fs.existsSync(f)) { console.log('  (Tom\'s save ' + f + ' not found; skipped)'); return; }
		const sv = new SQL.Database(new Uint8Array(fs.readFileSync(f)));
		const strip = (r) => { const o = Object.assign({}, r); delete o.SupportElementID; delete o.ItemID; return JSON.stringify(o); };
		const q = (db, t) => rows(db, 'SELECT * FROM ' + t + ' ORDER BY ' + (t === 'EnergyPricing' ? 'SupportElementID' : 'ItemID')).map(strip);
		['EnergyPricing', 'EnergyPricing_EnergyPriceCurve'].forEach((t) => {
			ok(name + ': table ' + t + ' equals ours (ids aside)', JSON.stringify(q(sv, t)) === JSON.stringify(q(ours, t)), JSON.stringify(q(sv, t)));
		});
		sv.close();
	};
	same('energy-price-pattern.wtg.sqlite', wp.db, null);
	same('energy-demand-charge.wtg.sqlite', wd.db, null);

	console.log('\nEPANET, PU1 over 24 hours (the figures for Tom\'s test)');
	const e = await energy(se.withStep(se.withPumpPipes(net([' Global Efficiency  \t75', ' Global Price       \t0.10'])), '0:06'), 0.10);
	console.log('  energy ' + e.kwh.toFixed(1) + ' kWh, cost ' + e.cost.toFixed(2) + ', peak ' + e.peak.toFixed(3) + ' kW');
	ok('energy near Tom\'s WaterGEMS reading of 222.1 kWh', near(e.kwh, 222.1, 3), e.kwh.toFixed(2));
	ok('cost near 22.21', near(e.cost, 22.21, 0.3), e.cost.toFixed(2));

	const ePat = await energy(se.withStep(se.withPumpPipes(patNet), '0:06'), (t) => 0.10 * EP[Math.floor(t / 3600) % 24]);
	console.log('  with the price pattern: cost ' + ePat.cost.toFixed(2));
	ok('pattern cost near Tom\'s WaterGEMS reading of 25.01', near(ePat.cost, 25.01, 0.05), ePat.cost.toFixed(2));
	// WaterGEMS: demand charge = peak kW x charge x (days in the run / billing period of 30 days); Tom read 3.87.
	const dcWg = e.peak * 12 * 1 / 30;
	console.log('  demand charge, peak kW x 12 per kW = ' + (e.peak * 12).toFixed(2) + '; spread over the 30-day billing period = ' + dcWg.toFixed(2));
	ok('peak kW x 12 / 30 reproduces Tom\'s 3.87', near(dcWg, 3.87, 0.005), dcWg.toFixed(3));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
