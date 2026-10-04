// PRESSURE-DRIVEN ANALYSIS THROUGH THE EPANET ENGINE -- ROADMAP Task 762. Run with:
//   node dev/lpn-spike/pda-harness.js
//
// Tom: *"Is this (PDA) an EPANET++ gap that we must fill urgently?"* EPANET 2.2 solves
// `[OPTIONS] Demand Model PDA` with a Minimum pressure, a Required pressure and a Pressure exponent.
// The page used to read and carry those lines and report that it solved demand-driven.
//
// THE OBSERVABLE IS PHYSICS. The reference below is worked by hand: a reservoir feeding one
// junction through one Hazen-Williams pipe, where the demand cannot be met at the required
// pressure. Delivered flow Q satisfies Q = D * ((p - pmin) / (preq - pmin))^n with p the pressure
// the pipe's own head loss leaves at that flow, and a bisection finds it. EPANET's answer must land
// on it, and the demand-driven answer must NOT (it delivers D whatever the pressure).
//
//   1. the .inp states PDA: it reaches Settings, is not reported as a loss, and round-trips with
//      the file's own characters (`Minimum Pressure 0.0`)
//   2. PDA routes to EPANET by itself and never rewrites `settings.engine`; the built-in solver
//      refuses PDA by name
//   3. the delivered flow is the hand-worked one and the deficit is the difference
//   4. demand driven is unchanged, and states no deficit
//   5. the pressures are typed in the project's pressure unit and cross to metres at the solver

'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, byId, unitSelects, setUnitSet, loadLoopedNetwork, settleEpanet, epanetSolves, warmEpanet } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () {};
global.confirm = global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, runSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\trebuildSettings: rebuildSettingsFields, convert: convertUnitValues,\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const statusEl = global.document.getElementById('lpn_status');

function optionLines(inp) {
	const out = []; let on = false;
	inp.split('\n').forEach((l) => {
		if (/^\s*\[/.test(l)) { on = /^\s*\[OPTIONS\]/i.test(l); return; }
		if (on && l.trim()) { out.push(l.trim().split(/\s+/).join(' ')); }
	});
	return out;
}

// ---- the hand-worked reference -------------------------------------------------------------
// Reservoir head 100 m, junction at 90 m, 1000 m of 100 mm pipe at C = 100, 10 L/s requested.
const H0 = 100, ELEV = 90, LEN = 1000, DIA = 0.1, C = 100, D = 0.010;
function pressureAt(q) { return H0 - ELEV - EngCalcs.hwSlope(q, DIA, C) * LEN; }
function reference(pmin, preq, n) {
	let lo = 0, hi = D;
	for (let i = 0; i < 200; i++) {
		const q = (lo + hi) / 2, p = pressureAt(q);
		const frac = Math.min(1, Math.max(0, (p - pmin) / (preq - pmin)));
		const want = D * Math.pow(frac, n);
		if (q > want) { hi = q; } else { lo = q; }
	}
	return (lo + hi) / 2;
}

async function main() {

console.log('=== 2. PDA routes to EPANET by itself ===');
setUnitSet('si');
L.buildLayers();
L.seedDefaultInputs();
await warmEpanet();
function network() {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: H0 });
	doc.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: ELEV, _demand: D * 1000 });
	doc.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
		_diameter: DIA * 1000, _roughness: C, _length: LEN, _k: 0, _status: 'open' });
}
async function solved() { L.runSolve(); await settleEpanet(); return L.lastResult(); }
{
	network();
	const s = L.settings();
	s.engine = 'native';
	s.hydraulics = { demandModel: 'PDA', minPressure: 0, reqPressure: 20, pressureExponent: 0.5 };
	const was = epanetSolves();
	const r = await solved();
	ok('the built-in solver was set, and EPANET was handed the network anyway', epanetSolves() === was + 1, epanetSolves() - was);
	ok('...and the answer is EPANET\'s', !!r && r.engine === 'epanet', r && r.engine);
	ok('the stored engine setting was NOT rewritten', s.engine === 'native', s.engine);
	ok('the status bar says why', /pressure driven/i.test(statusEl.textContent || ''), JSON.stringify(statusEl.textContent));
	const model = L.assembleModel();
	const nat = EngCalcs.lpnDiagnose(model, { engine: 'native' });
	ok('the built-in solver refuses PDA by name', nat.some((i) => i.code === 'pda-needs-epanet'), JSON.stringify(nat));
}

console.log('\n=== 3. the delivered flow is the hand-worked one ===');
{
	const expect = reference(0, 20, 0.5);
	ok('the reference itself is a real shortfall (under 10 L/s, over 0)', expect > 0.001 && expect < D * 0.97, (expect * 1000).toFixed(4) + ' L/s');
	network();
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 0, reqPressure: 20, pressureExponent: 0.5 };
	const r = await solved();
	ok('it converged', !!r && r.ok && r.converged === true, JSON.stringify(r && r.issues));
	const got = r.demands && r.demands.J1;
	ok('EPANET delivers the hand-worked flow within 0.5%', typeof got === 'number' && Math.abs(got - expect) / expect < 0.005,
		(got * 1000).toFixed(4) + ' vs ' + (expect * 1000).toFixed(4) + ' L/s');
	ok('the deficit is what was asked for less what arrived',
		Math.abs((r.demandDeficits.J1 + got) - D) < 1e-6, (r.demandDeficits.J1 * 1000).toFixed(4) + ' L/s');
	ok('...and the junction pressure sits between the minimum and the required',
		r.pressures.J1 > 0 && r.pressures.J1 < 20, r.pressures.J1);
	ok('the status bar counts the short junction', /less than their demand: 1/i.test(statusEl.textContent || ''), JSON.stringify(statusEl.textContent));
	L.renderNodeFields('J1');
	const text = global.JSON.stringify(Array.from((L.popupFields().children || [])).map((c) => c.textContent || ''));
	ok('the Properties box shows what it receives and what it was refused',
		/Delivered demand/.test(text) && /Demand deficit/.test(text), text.slice(0, 200));
	// A different exponent moves it, so the number is not a coincidence of the defaults.
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 0, reqPressure: 20, pressureExponent: 1 };
	const r2 = await solved();
	const exp2 = reference(0, 20, 1);
	ok('a different Pressure exponent gives its own hand-worked flow',
		Math.abs(r2.demands.J1 - exp2) / exp2 < 0.005 && Math.abs(exp2 - expect) / expect > 0.02,
		(r2.demands.J1 * 1000).toFixed(4) + ' vs ' + (exp2 * 1000).toFixed(4));
}

console.log('\n=== 4. demand driven is unchanged ===');
{
	network();
	L.settings().engine = 'epanet';
	L.settings().hydraulics = {};
	const r = await solved();
	ok('every demand is delivered in full', Math.abs(r.flows.L1 - D) < 1e-7, r.flows.L1);
	ok('...the junction pressure is the same low number, with no deficit stated', !r.demandDeficits && r.pressures.J1 < 20, JSON.stringify(r.demandDeficits));
	ok('...and the pressure is below what PDA would need, so section 3 was a real test', r.pressures.J1 < 20 && r.pressures.J1 > -50, r.pressures.J1);
}

console.log('\n=== 5. pressures are typed in the project unit and cross at the solver ===');
{
	// psi: type the metre numbers as psi, and the solver must see the metres they stand for.
	const sel = unitSelects.lpn_u_pressure;
	sel.selectedIndex = sel.options.findIndex((o) => o.value === 'psi');
	const f = EngCalcs.unitFactors.psi;
	network();
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 0, reqPressure: 20, pressureExponent: 0.5 };
	const m = L.assembleModel();
	ok('the model carries the pressure in metres, not in the typed number',
		f && Math.abs(m.hydraulics.reqPressure - 20 / f) < 1e-9, JSON.stringify(m.hydraulics) + ' factor ' + f);
	sel.selectedIndex = sel.options.findIndex((o) => o.value === 'mh2o');
}


console.log('\n=== 5b. Settings shows the three numbers only while PDA is chosen ===');
{
	const PC = EngCalcs.pageConfig;
	function labels() {
		const out = [];
		(function walk(n) {
			(n.children || []).forEach((c) => {
				if (c.tagName === 'LABEL' && /lpn-set-row/.test(c.className || '')) {
					const span = (c.children || []).filter((x) => x.tagName === 'SPAN')[0];
					out.push(span ? span.textContent.replace(/\s+/g, ' ').trim() : '');
				}
				walk(c);
			});
		}(byId.lpn_set_hydraulics_fields));
		return out;
	}
	L.settings().hydraulics = { demandModel: 'PDA' };
	L.rebuildSettings();
	let rows = labels();
	['lpn_settings_demand_model', 'lpn_settings_min_pressure', 'lpn_settings_req_pressure', 'lpn_settings_pressure_exponent'].forEach((k) => {
		ok(k + ' has a row under PDA', rows.some((t) => t.indexOf(PC[k]) === 0), rows.join(' | '));
	});
	L.settings().hydraulics = {};
	L.rebuildSettings();
	rows = labels();
	ok('Demand model is always offered', rows.some((t) => t.indexOf(PC.lpn_settings_demand_model) === 0), rows.join(' | '));
	ok('...but the three pressure rows are hidden under demand driven',
		!rows.some((t) => /^(Minimum pressure|Required pressure|Pressure exponent)/.test(t)), rows.join(' | '));
}

console.log('\n=== 5c. a Minimum pressure above zero, the order check, Convert as, and the default ===');
{
	network();
	L.settings().engine = 'epanet';
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 5, reqPressure: 20, pressureExponent: 0.5 };
	const r = await solved();
	const expect = reference(5, 20, 0.5), flat = reference(0, 20, 0.5);
	ok('a non-zero Minimum pressure gives its own hand-worked flow (and not the zero-minimum one)',
		Math.abs(r.demands.J1 - expect) / expect < 0.005 && Math.abs(expect - flat) / flat > 0.02,
		(r.demands.J1 * 1000).toFixed(4) + ' vs ' + (expect * 1000).toFixed(4) + ' (zero minimum ' + (flat * 1000).toFixed(4) + ')');
	const out = optionLines(EngCalcs.lpnToInp(L.assembleModel()).inp);
	ok('the engine file states the Minimum pressure line', out.indexOf('Minimum Pressure 5') >= 0, JSON.stringify(out));

	// Required <= Minimum: a plain message naming the settings, and no claim that the built-in solver answered.
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 20, reqPressure: 20 };
	const bad = await solved();
	const say = statusEl.textContent || '';
	ok('Required not above Minimum is refused with a plain message',
		say.indexOf(EngCalcs.pageConfig.lpn_diag_pda_pressures) >= 0, JSON.stringify(say));
	ok('...and nothing claims the built-in solver answered', !/built-in/i.test(say) && !bad, JSON.stringify(say));
	// Minimum set, Required blank: the default (0.1 m under SI) falls below it.
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 5 };
	await solved();
	ok('...and a Minimum above the blank Required default says the same',
		(statusEl.textContent || '').indexOf(EngCalcs.pageConfig.lpn_diag_pda_pressures) >= 0, JSON.stringify(statusEl.textContent));

	// The blank Required pressure is EPANET's 0.1 in the FILE's pressure unit: metres here.
	L.settings().hydraulics = { demandModel: 'PDA' };
	ok('blank Required pressure is 0.1 m for a metric project', Math.abs(L.assembleModel().hydraulics.reqPressure - 0.1) < 1e-12,
		JSON.stringify(L.assembleModel().hydraulics));

	// Convert as: the typed pressures move with the unit, and so do the two limits that carry units.
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 5, reqPressure: 20, headError: 0.5, flowChange: 2 };
	L.convert('lpn_u_pressure', 2);
	L.convert('lpn_u_elevhead', 3);
	L.convert('lpn_u_flow', 4);
	const hh = L.settings().hydraulics;
	ok('Convert as rewrites Minimum and Required pressure', hh.minPressure === 10 && hh.reqPressure === 40, JSON.stringify(hh));
	ok('...and Head error limit and Flow change limit', hh.headError === 1.5 && hh.flowChange === 8, JSON.stringify(hh));

	L.settings().hydraulics.minPressure = 20 * 1.4215879265;
	L.convert('lpn_u_pressure', 1 / 1.4215879265);
	ok('a converted number is held to six significant figures', L.settings().hydraulics.minPressure === 20, L.settings().hydraulics.minPressure);

	// A Minimum pressure typed in PSI crosses to metres at the solver (a mutant that drops the
	// Minimum conversion fails here).
	{
		const sel = unitSelects.lpn_u_pressure;
		sel.selectedIndex = sel.options.findIndex((o) => o.value === 'psi');
		L.settings().hydraulics = { demandModel: 'PDA', minPressure: 10, reqPressure: 30 };
		const mh = L.assembleModel().hydraulics, f = EngCalcs.unitFactors.psi;
		ok('Minimum pressure typed in psi reaches the solver in metres',
			Math.abs(mh.minPressure - 10 / f) < 1e-9 && Math.abs(mh.reqPressure - 30 / f) < 1e-9, JSON.stringify(mh));
		sel.selectedIndex = sel.options.findIndex((o) => o.value === 'mh2o');
	}

	// Back to demand driven: the numbers left behind are not exported, unless the file stated them.
	L.settings().hydraulics = { minPressure: 5, reqPressure: 20, pressureExponent: 0.5 };
	let got = optionLines(L.exportInp().inp);
	ok('demand driven after PDA exports none of the pressure lines',
		!got.some((l) => /^(Minimum|Required|Pressure Exponent|Demand Model)/.test(l)), JSON.stringify(got));
	L.settings().hydraulics = { demandModel: 'PDA', minPressure: 5, reqPressure: 20, pressureExponent: 0.5 };
	got = optionLines(L.exportInp().inp);
	ok('...and PDA exports all four', ['Demand Model PDA', 'Minimum Pressure 5', 'Required Pressure 20', 'Pressure Exponent 0.5'].every((l) => got.indexOf(l) >= 0), JSON.stringify(got));
}

console.log('=== 6. the file states PDA: Settings holds it, nothing is lost (run last: it imports files) ===');
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
{
	const inp = fs.readFileSync(path.join(ROOT, 'dev', 'pda-sample.inp'), 'utf8');
	L.importInp({ name: 'pda-sample.inp', _text: inp });
	const h = L.settings().hydraulics || {};
	ok('Demand model reached the document', h.demandModel === 'PDA', JSON.stringify(h));
	ok('...with the three numbers as the file wrote them',
		h.minPressure === 0 && h.reqPressure === 20 && h.pressureExponent === 0.5, JSON.stringify(h));
	const parsed = EngCalcs.lpnInpParse(inp);
	const codes = (parsed.dropped || []).map((d) => d.code);
	ok('it is no longer reported as solved demand-driven', codes.indexOf('demand-model') < 0, JSON.stringify(codes));
	ok('...and none of the four lines is counted as an unread option',
		(parsed.fileOptions.other || []).length === 0, JSON.stringify(parsed.fileOptions.other));
	const out = L.exportInp();
	ok('it exports', out.ok === true, JSON.stringify(out.error));
	const got = optionLines(out.inp);
	['Demand Model PDA', 'Minimum Pressure 0.0', 'Required Pressure 20', 'Pressure Exponent 0.5'].forEach((line) => {
		ok('written back as the file wrote it: ' + line, got.indexOf(line) >= 0, JSON.stringify(got));
	});
	ok('no line was invented', got.length === 6, JSON.stringify(got));
	// A file that says nothing about the demand model gains nothing.
	const dda = EngCalcs.lpnInpParse(inp.replace(/ Demand Model[^\n]*\n Minimum[^\n]*\n Required[^\n]*\n Pressure Exponent[^\n]*\n/, ''));
	ok('the fixture without them states none', !dda.hydraulics.demandModel && dda.hydraulics.minPressure === undefined);
}
{
	// EPANET's own export of Net3 with PDA on, via the .net converter's study files.
	const f = path.join(ROOT, 'dev', 'net-import-study', 'Net3-PDA-from-EPANET.inp');
	const inp = fs.readFileSync(f, 'utf8');
	L.importInp({ name: 'Net3-PDA.inp', _text: inp });
	const got = optionLines(L.exportInp().inp);
	['Demand Model PDA', 'Minimum Pressure 0', 'Required Pressure 0.1', 'Pressure Exponent 0.5'].forEach((line) => {
		ok('Net3 with PDA round-trips: ' + line, got.indexOf(line) >= 0, JSON.stringify(got.slice(0, 20)));
	});
}


{
	const inp = fs.readFileSync(path.join(ROOT, 'dev', 'pda-sample.inp'), 'utf8').replace(' Pressure Exponent  \t0.5', ' Pressure Exponent  \t0.5\n Pressure           \tKPA');
	const parsed = EngCalcs.lpnInpParse(inp);
	ok('a file\'s own Pressure KPA is reported as unread, not silently misread',
		(parsed.dropped || []).some((d) => d.code === 'pressure-unit'), JSON.stringify((parsed.dropped || []).map((d) => d.code)));
	ok('...and a file that states the default unit is told nothing',
		!(EngCalcs.lpnInpParse(inp.replace('KPA', 'PSI')).dropped || []).some((d) => d.code === 'pressure-unit'));
	// A US project with Required pressure blank: EPANET's 0.1 is psi.
	setUnitSet('us');
	L.importInp({ name: 'x.inp', _text: fs.readFileSync(path.join(ROOT, 'dev', 'pda-sample.inp'), 'utf8').replace(/ Required Pressure[^\n]*\n/, '') });
	ok('blank Required pressure is 0.1 psi for a US project',
		Math.abs(L.assembleModel().hydraulics.reqPressure - 0.1 / EngCalcs.unitFactors.psi) < 1e-9, JSON.stringify(L.assembleModel().hydraulics));
	// A source that stated the lines but is demand driven keeps them, character for character.
	L.importInp({ name: 'y.inp', _text: fs.readFileSync(path.join(ROOT, 'dev', 'pda-sample.inp'), 'utf8').replace('PDA', 'DDA') });
	const kept = optionLines(L.exportInp().inp);
	ok('a demand driven file that states the pressure lines gets them back', kept.indexOf('Minimum Pressure 0.0') >= 0 && kept.indexOf('Demand Model DDA') >= 0, JSON.stringify(kept));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall pda checks passed');
process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
