// AUDIT: THE EXTENDED-PERIOD RESULT OF THE BUILT-IN SOLVER AND OF THE PAGE'S EPANET BRIDGE, AGAINST THE
// VENDORED EPANET ENGINE DRIVEN DIRECTLY (2026-11-18, independent audit; findings in dev/audits/).
//
//   node dev/lpn-spike/eps-audit-vs-epanet.js [name-fragment ...]      (--json=path writes the numbers)
//
// Every shipped example (examples/*.lwn) and every .inp under dev/ that opens, through the page's own
// document and assembleModel(), then THREE answers over the whole duration, compared at EVERY reporting time:
//   RAW     the vendored EPANET 2.3.5 on the model's own .inp (lpnToInp), runH()/nextH() then runQ()/nextQ(),
//           read with getNodeValue()/getLinkValue() and nothing of ours between the engine and the number.
//   BRIDGE  EngCalcs.lpnEpanetRun, what the page shows when the setting says EPANET.
//   NATIVE  EngCalcs.lpnNativeRun(model, {quality:true}), the built-in solver. A model it refuses by name is
//           run with the refusing section taken off (the refusal is reported, the rest still compared).
// Compared: head, pressure, demand (and emitter flow, deficit under PDA), tank level, link flow, velocity,
// headloss, status, water quality, and pump energy (native vs the engine's own binary energy block).
// For a file that came from an .inp, RAW on the ORIGINAL file is also compared with RAW on our export (heads).
// Second pass (eps-settings-tanks audit): the native frame also carries tank VOLUME, pump SPEED (EN_SETTING), valve SETTING and
// EMITTER flow (EN_EMITTERFLOW); all four are compared at every reporting time, beside the link status. fixtures in
// dev/lpn-spike/fixtures/eps-audit/*.inp are picked up with the other .inp files under dev/.
// TOLERANCE (engineering, stated): head, level, pressure, headloss 1 mm; flow, demand 2e-6 m3/s or 1e-5 of the
// largest flow; velocity judged as the FLOW it implies (v x pipe area) against the same flow tolerance (2nd audit: a fixed 1e-5 m/s
// flagged 40 mm pipes whose flow agreed to 1e-7 m3/s); quality 1e-3 relative with a floor of 1e-3 of its range.
// Tank volume 1 mm of level times the tank's plan area (its curve's mean area for a volume curve); emitter flow as flow; pump speed
// and valve setting 1e-6 absolute (they are copied from a pattern or a control, never solved: any real difference is a logic
// difference). EPANET's own convergence tolerances are Htol 0.0005 ft (0.15 mm) and Qtol 0.0001 cfs; 1 mm is 6.6 Htol and the
// solver is run at accuracy 1e-5, so a difference above it is not solver noise.
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
const T = require('./native-eps-energy-truth.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-msx.js');
require(ROOT + 'js/lpn-native-run.js');
global.alert = global.window.alert = function () { };
require(ROOT + 'js/lpn-net.js');
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
const L = loadLoopedNetwork(EXAMPLE_EXPORTS + "\t\tcurrentModel: function () { return assembleModel(); },\n" +
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tcreateScenario: createScenario, setProp: setProp, activeScenario: activeScenario,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n");
L.buildLayers();
const EC = global.EngCalcs;

const TOL = { head: 1e-3, level: 1e-3, pressure: 1e-3, headloss: 1e-3, velocity: 1e-5 };
const FLOW_ABS = 2e-6, FLOW_REL = 1e-5;
// epanet-js constants (types.h): node 9 demand, 10 head, 11 pressure, 12 quality, 24 tankvolume, 27 deficit, 29 emitterflow;
// link 8 flow, 9 velocity, 10 headloss, 11 status, 12 setting, 14 linkqual.
const N_DEMAND = 9, N_HEAD = 10, N_PRESS = 11, N_QUAL = 12, N_TANKVOL = 24, N_DEFICIT = 27, N_EMITQ = 29;
const L_FLOW = 8, L_VEL = 9, L_HL = 10, L_STATUS = 11, L_SETTING = 12, L_QUAL = 14;

let MOD = null;
function dirs(d, out) {
	fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
		const p = path.join(d, e.name);
		if (e.isDirectory()) { dirs(p, out); } else if (/\.inp$/i.test(e.name)) { out.push(p); }
	});
	return out;
}
function sources() {
	const s = fs.readdirSync(ROOT + 'examples').filter((f) => /\.lwn$/.test(f)).map((f) => ({ name: 'examples/' + f, file: ROOT + 'examples/' + f, inp: false }));
	dirs(ROOT + 'dev', []).sort().forEach((f) => {
		if (/msx-example|net3-world|\.net\.inp$/.test(f)) { return; }
		s.push({ name: path.relative(ROOT, f), file: f, inp: true });
	});
	return s;
}

function isReport(t, times) {
	const rep = times.reportStep > 0 ? times.reportStep : 3600, dur = times.duration > 0 ? times.duration : 0;
	return t >= (times.reportStart || 0) && ((t - (times.reportStart || 0)) % rep) === 0 && t <= dur;
}

// RAW: the engine alone on `inp`. Returns frames keyed by time, quantities in the engine's own (LPS/m) units.
async function rawRun(inp, model, times, withQuality) {
	const ws = new MOD.Workspace();
	await ws.loadModule();
	ws.writeFile('a.inp', inp);
	const p = new MOD.Project(ws);
	try { p.open('a.inp', 'a.rpt', 'a.out'); } catch (e) {
		let rpt = ''; try { rpt = ws.readFile('a.rpt').split('\n').filter((x) => /Error|ERROR/.test(x)).slice(0, 3).join(' / '); } catch (x) { }
		throw new Error(e.message + (rpt ? ' [' + rpt + ']' : ''));
	}
	const ids = model.nodes.map((n) => n.id), lids = model.links.map((l) => l.id);
	const ni = {}, li = {};
	ids.forEach((id) => { ni[id] = p.getNodeIndex(id); });
	lids.forEach((id) => { li[id] = p.getLinkIndex(id); });
	const frames = {}, order = [], setScale = {};
	model.links.forEach((l) => { if (l.type === 'valve' && String(l.valveType).toUpperCase() === 'FCV') { setScale[l.id] = 1 / 1000; } });
	const get = (f, key, f2) => f2;
	p.openH(); p.initH(1);
	for (;;) {
		const t = p.runH();
		if (isReport(t, times)) {
			const f = { t, heads: {}, pressures: {}, demands: {}, emit: {}, deficit: {}, vol: {}, levels: {}, flows: {}, vel: {}, hl: {}, st: {}, set: {}, qual: {}, lqual: {} };
			ids.forEach((id) => {
				f.heads[id] = p.getNodeValue(ni[id], N_HEAD); f.pressures[id] = p.getNodeValue(ni[id], N_PRESS);
				f.demands[id] = p.getNodeValue(ni[id], N_DEMAND) / 1000;
				try { f.emit[id] = p.getNodeValue(ni[id], N_EMITQ) / 1000; } catch (e) { f.emit[id] = 0; }
				try { f.deficit[id] = p.getNodeValue(ni[id], N_DEFICIT) / 1000; } catch (e) { f.deficit[id] = 0; }
			});
			model.nodes.forEach((n) => { if (n.type === 'tank') { try { f.vol[n.id] = p.getNodeValue(ni[n.id], N_TANKVOL); } catch (e) { } f.levels[n.id] = f.heads[n.id] - (n.elev || 0); } });
			lids.forEach((id) => {
				f.flows[id] = p.getLinkValue(li[id], L_FLOW) / 1000; f.vel[id] = p.getLinkValue(li[id], L_VEL);
				f.hl[id] = p.getLinkValue(li[id], L_HL); f.st[id] = p.getLinkValue(li[id], L_STATUS) > 0 ? 'open' : 'closed';
				f.set[id] = p.getLinkValue(li[id], L_SETTING);
				if (setScale[id]) { f.set[id] *= setScale[id]; }
			});
			frames[t] = f; order.push(t);
		}
		if (p.nextH() <= 0) { break; }
	}
	p.closeH();
	if (withQuality) {
		p.openQ(); p.initQ(0);
		for (;;) {
			const t = p.runQ();
			if (frames[t] && !frames[t].qDone) {
				ids.forEach((id) => { frames[t].qual[id] = p.getNodeValue(ni[id], N_QUAL); });
				lids.forEach((id) => { frames[t].lqual[id] = p.getLinkValue(li[id], L_QUAL); });
				frames[t].qDone = true;
			}
			if (p.nextQ() <= 0) { break; }
		}
		p.closeQ();
	}
	p.close();
	return { frames, order };
}

const W = () => ({ v: 0, at: '', rel: 0 });
function note(w, d, at, ref, floor) { if (d > w.v) { w.v = d; w.at = at; w.rel = ref ? d / Math.max(Math.abs(ref), floor || 0) : 0; } }

// Compare engine frames `a` (frame array with SI maps) with RAW `r`; returns worst per quantity.
function compare(model, a, r, label) {
	const out = { label, frames: a.length, rawFrames: r.order.length, sameTimes: a.length === r.order.length && a.every((f, i) => f.t === r.order[i]),
		w: { head: W(), pressure: W(), demand: W(), emitter: W(), level: W(), flow: W(), velocity: W(), headloss: W(), quality: W(), linkQuality: W(), deficit: W(), volume: W(), pumpSetting: W(), valveSetting: W() },
		statusDiff: 0, firstStatusT: null, firstStatusAt: '', exceed: [] };
	let qMax = 0, qlMax = 0, qlMin = Infinity;
	r.order.forEach((t) => { model.links.forEach((l) => { qMax = Math.max(qMax, Math.abs(r.frames[t].flows[l.id])); }); });
	const tolQ = Math.max(FLOW_ABS, FLOW_REL * qMax);
	a.forEach((f) => {
		const g = r.frames[f.t]; if (!g) { return; }
		const at = (id) => id + '@' + (f.t / 3600) + 'h';
		model.nodes.forEach((n) => {
			if (f.heads && f.heads[n.id] !== undefined) { note(out.w.head, Math.abs(f.heads[n.id] - g.heads[n.id]), at(n.id)); }
			if (f.pressures && f.pressures[n.id] !== undefined) { note(out.w.pressure, Math.abs(f.pressures[n.id] - g.pressures[n.id]), at(n.id)); }
			if (f.demands && f.demands[n.id] !== undefined) { note(out.w.demand, Math.abs(f.demands[n.id] - g.demands[n.id]), at(n.id), g.demands[n.id], 1e-6); }
			if (n.type === 'tank' && f.levels && f.levels[n.id] !== undefined) { note(out.w.level, Math.abs(f.levels[n.id] - g.levels[n.id]), at(n.id)); }
			if (f.emitterFlows && f.emitterFlows[n.id] !== undefined && n.type === 'junction') { note(out.w.emitter, Math.abs(f.emitterFlows[n.id] - g.emit[n.id]), at(n.id)); }
			if (f.volumes && f.volumes[n.id] !== undefined && g.vol[n.id] !== undefined) { note(out.w.volume, Math.abs(f.volumes[n.id] - g.vol[n.id]), at(n.id)); }
			if (f.demandDeficits && f.demandDeficits[n.id] !== undefined) { note(out.w.deficit, Math.abs(f.demandDeficits[n.id] - g.deficit[n.id]), at(n.id)); }
			if (f.qualities && f.qualities[n.id] !== undefined && g.qual[n.id] !== undefined) { note(out.w.quality, Math.abs(f.qualities[n.id] - g.qual[n.id]), at(n.id), g.qual[n.id], 0); }
		});
		model.links.forEach((l) => {
			if (f.flows[l.id] !== undefined) { note(out.w.flow, Math.abs(f.flows[l.id] - g.flows[l.id]), at(l.id)); }
			if (f.velocities && f.velocities[l.id] !== undefined) { note(out.w.velocity, Math.abs(f.velocities[l.id] - g.vel[l.id]) * Math.PI * l.diameter * l.diameter / 4, at(l.id)); }
			if (f.headlosses && f.headlosses[l.id] !== undefined) { note(out.w.headloss, Math.abs(f.headlosses[l.id] - g.hl[l.id]), at(l.id)); }
			if (f.linkQualities && f.linkQualities[l.id] !== undefined && g.lqual[l.id] !== undefined) { note(out.w.linkQuality, Math.abs(f.linkQualities[l.id] - g.lqual[l.id]), at(l.id), g.lqual[l.id], 0); }
			if (f.pumpSettings && f.pumpSettings[l.id] !== undefined) { note(out.w.pumpSetting, Math.abs(f.pumpSettings[l.id] - g.set[l.id]), at(l.id)); }
			if (f.valveSettings && f.valveSettings[l.id] !== undefined) { note(out.w.valveSetting, Math.abs(f.valveSettings[l.id] - g.set[l.id]), at(l.id)); }
			if (f.statuses && f.statuses[l.id] !== g.st[l.id]) { out.statusDiff++; if (out.firstStatusT === null || f.t < out.firstStatusT) { out.firstStatusT = f.t; out.firstStatusAt = l.id + ' ' + g.st[l.id] + '(raw) vs ' + f.statuses[l.id]; } }
		});
	});
	out.tolQ = tolQ;
	const lim = { head: TOL.head, pressure: TOL.pressure, level: TOL.level, headloss: TOL.headloss, velocity: tolQ, flow: tolQ, demand: tolQ, emitter: tolQ, deficit: tolQ, pumpSetting: 1e-6, valveSetting: 1e-6 };
	let tolVol = 0; model.nodes.forEach((n) => { if (n.type === 'tank') { tolVol = Math.max(tolVol, 1e-3 * (Array.isArray(n.volCurveSI) && n.volCurveSI.length > 1 ? (n.volCurveSI[n.volCurveSI.length - 1][1] - n.volCurveSI[0][1]) / Math.max(n.volCurveSI[n.volCurveSI.length - 1][0] - n.volCurveSI[0][0], 1e-9) : Math.PI * n.diameter * n.diameter / 4)); } });
	out.tolVol = tolVol; lim.volume = tolVol;
	Object.keys(lim).forEach((k) => { if (out.w[k].v > lim[k]) { out.exceed.push(k); } });
	['quality', 'linkQuality'].forEach((k) => {
		let rng = 0; r.order.forEach((t) => { const m = k === 'quality' ? r.frames[t].qual : r.frames[t].lqual; Object.keys(m).forEach((id) => { rng = Math.max(rng, Math.abs(m[id])); }); });
		out.w[k].range = rng;
		if (out.w[k].v > Math.max(1e-3 * rng, 1e-9) && out.w[k].v > 0) { out.exceed.push(k); }
	});
	if (out.statusDiff) { out.exceed.push('status'); }
	if (!out.sameTimes) { out.exceed.push('times'); }
	return out;
}

const fmt = (w) => w.v === 0 ? '0' : w.v.toExponential(1) + '@' + w.at;
function line(c) {
	return `  ${c.label.padEnd(7)} frames ${c.frames}/${c.rawFrames}${c.sameTimes ? '' : ' TIMES DIFFER'} head ${fmt(c.w.head)} press ${fmt(c.w.pressure)} dem ${fmt(c.w.demand)} lvl ${fmt(c.w.level)} flow ${fmt(c.w.flow)} (tol ${c.tolQ.toExponential(0)}) vel ${fmt(c.w.velocity)} hl ${fmt(c.w.headloss)}` +
		(c.w.quality.range !== undefined && c.w.quality.range > 0 ? ` qual ${fmt(c.w.quality)} lqual ${fmt(c.w.linkQuality)} (range ${c.w.quality.range.toPrecision(3)})` : '') +
		(c.w.deficit.v ? ` deficit ${fmt(c.w.deficit)}` : '') +
		(c.w.volume.v ? ` vol ${fmt(c.w.volume)} (tol ${c.tolVol.toExponential(0)})` : '') + (c.w.emitter.v ? ` emit ${fmt(c.w.emitter)}` : '') + (c.w.pumpSetting.v ? ` speed ${fmt(c.w.pumpSetting)}` : '') + (c.w.valveSetting.v ? ` vset ${fmt(c.w.valveSetting)}` : '') +
		` status diffs ${c.statusDiff}${c.firstStatusT !== null ? ' first t=' + c.firstStatusT / 3600 + 'h ' + c.firstStatusAt : ''}` +
		(c.exceed.length ? '  >>> EXCEEDS: ' + c.exceed.join(',') : '');
}

(async function () {
	setUnitSet('us');
	await warmEpanet();
	MOD = await EC.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const argv = process.argv.slice(2), jsonOut = (argv.find((a) => /^--json=/.test(a)) || '').slice(7), only = argv.filter((a) => !/^--/.test(a));
	const results = [], skipped = [];
	const oneArg = (argv.find((a) => /^--one=/.test(a)) || '').slice(6);
	const msxArg = (argv.find((a) => /^--msx=/.test(a)) || '').slice(6);
	const scnArg = (argv.find((a) => /^--scenario=/.test(a)) || '').slice(11);
	let list = sources();
	if (oneArg) { list = list.filter((s) => s.name === oneArg); }
	else if (!argv.some((a) => /^--examples/.test(a))) {
		// each .inp in a process of its own, results gathered through a json file
		const cp = require('child_process'), tmp = require('os').tmpdir();
		const inps = list.filter((s) => s.inp && (!only.length || only.some((o) => s.name.indexOf(o) >= 0)));
		list = list.filter((s) => !s.inp);
		for (const s of inps) {
			const jf = path.join(tmp, 'epsaudit-' + process.pid + '.json');
			const r = cp.spawnSync(process.execPath, [__filename, '--one=' + s.name, '--json=' + jf], { encoding: 'utf8', maxBuffer: 1 << 26 });
			process.stdout.write(r.stdout || ''); if (r.status !== 0) { skipped.push(s.name + ': child exit ' + r.status + ' ' + (r.stderr || '').slice(0, 200)); }
			try { const j = JSON.parse(fs.readFileSync(jf, 'utf8')); j.results.forEach((x) => results.push(x)); j.skipped.forEach((x) => skipped.push(x)); fs.unlinkSync(jf); } catch (e) { }
		}
	}
	for (const s of list) {
		if (only.length && !only.some((o) => s.name.indexOf(o) >= 0)) { continue; }
		const res = { name: s.name, runs: [], notes: [] };
		try {
			const text = fs.readFileSync(s.file, 'utf8');
			if (s.inp) {
				// one .inp per process: a project with assets asks where a second file goes
				L.importInp({ name: path.basename(s.file), _text: text });
			} else {
				const saved = L.acceptImportedText(text);
				if (!saved) { skipped.push(s.name + ': not accepted by the page'); continue; }
				L.applySaved(saved);
			}
			EC.lpnTimeArrived();
			// Third pass (scenario overrides): --scenario=<json> makes a scenario of the imported Base, writes the override(s)
			// through the page's own setProp(), and the REFERENCE is the ORIGINAL file text with the same change made by hand
			// (the json's `edits`: [regex, replacement] pairs), never our export of the scenario.
			let refText = null;
			if (scnArg) {
				const spec = JSON.parse(fs.readFileSync(path.resolve(ROOT, scnArg), 'utf8'));
				L.createScenario(spec.name || 'Override');
				const dd = L.getDoc();
				spec.props.forEach((o) => {
					const el = (o[0] === 'link' ? dd.links : dd.nodes).filter((x) => String(x.id) === o[1])[0];
					if (!el) { throw new Error('scenario: no ' + o[0] + ' ' + o[1]); }
					L.setProp(el, o[2], o[3]);
				});
				refText = text;
				spec.edits.forEach((e) => { const t2 = refText.replace(new RegExp(e[0], 'm'), e[1]); if (t2 === refText) { throw new Error('scenario edit matched nothing: ' + e[0]); } refText = t2; });
			}
			const model = L.currentModel(); if (process.env.EPS_AUDIT_LINK) { console.log(JSON.stringify(model.links.filter((l) => l.id === process.env.EPS_AUDIT_LINK))); }
			if (!model || !model.nodes || !model.nodes.length) { skipped.push(s.name + ': empty model'); continue; }
			// Third pass (MSX over changing settings): --msx=<file.msx> makes the run a multi-species one; the page's EPANET bridge (the engine's own MSX)
			// and the built-in loop are then compared on every species at every node and link at every reporting time (RAW has no MSX).
			if (msxArg) { model.quality = { mode: 'msx' }; model.msx = { text: fs.readFileSync(path.resolve(ROOT, msxArg), 'utf8') }; }
			model.hydraulics = Object.assign({}, model.hydraulics || {}, { accuracy: 1e-5 });
			const times = Object.assign({}, EC.lpnTimesDefaults(), (model.time && model.time.times) || {});
			const dur = times.duration > 0 ? times.duration : 0;
			const hasQ = !!(model.quality && model.quality.mode && model.quality.mode !== 'none');
			const hasE = (model.links || []).some((l) => l.type === 'pump');
			res.dur = dur; res.nodes = model.nodes.length; res.links = model.links.length; res.quality = hasQ ? model.quality.mode : null;
			res.pda = !!EC.lpnDemandModelIsPda(model);
			const built = EC.lpnToInp(JSON.parse(JSON.stringify(model)), { eps: true });
			if (refText !== null) { res.scenarioExportVsReference = true; }
			if (process.env.EPS_AUDIT_INP) { fs.writeFileSync(process.env.EPS_AUDIT_INP, built.inp); }
			let raw;
			try { raw = await rawRun(refText !== null ? refText : built.inp, model, times, hasQ); } catch (e) {
				// EPANET refuses our own export: say what the page itself then does (the bridge, the built-in solver)
				const bm0 = JSON.parse(JSON.stringify(model)), br0 = await EC.lpnEpanetRun(bm0, {}), nt0 = EC.lpnNativeRun(model, { quality: true });
				const diag = EC.lpnDiagnose ? JSON.stringify(EC.lpnDiagnose(model, { engine: 'epanet' }) || '').slice(0, 160) : '';
				skipped.push(s.name + ': EPANET refuses the .inp the page exports for it (' + e.message + '). Page bridge ok=' + br0.ok + (br0.ok ? '' : ' ' + JSON.stringify(br0.issues || br0.error || '').slice(0, 160)) + '; built-in ok=' + nt0.ok + '; lpnDiagnose=' + diag);
				continue;
			}
			// what the run exercised, so a fixture that stops exercising its feature is seen (dev/lpn-spike/eps-audit-fixtures-harness.js)
			res.cover = (function () {
				const c = { minEmit: 0, maxEmit: 0, tankVolSpan: 0, pumpSettings: 0, valveSettings: 0, statusChanges: 0, pumpStops: 0 };
				const sets = {}, vsets = {}, last = {};
				raw.order.forEach((t) => {
					const g = raw.frames[t];
					model.nodes.forEach((n) => { if (n.type === 'junction') { c.minEmit = Math.min(c.minEmit, g.emit[n.id]); c.maxEmit = Math.max(c.maxEmit, g.emit[n.id]); } });
					model.links.forEach((l) => {
						if (l.type === 'pump') { sets[l.id + ':' + g.set[l.id].toFixed(6)] = 1; if (g.st[l.id] === 'closed') { c.pumpStops++; } }
						if (l.type === 'valve') { vsets[l.id + ':' + g.set[l.id].toFixed(6)] = 1; }
						if (last[l.id] !== undefined && last[l.id] !== g.st[l.id]) { c.statusChanges++; }
						last[l.id] = g.st[l.id];
					});
				});
				model.nodes.forEach((n) => {
					if (n.type !== 'tank') { return; }
					const v = raw.order.map((t) => raw.frames[t].vol[n.id]).filter((x) => x !== undefined);
					if (v.length) { c.tankVolSpan = Math.max(c.tankVolSpan, Math.max.apply(null, v) - Math.min.apply(null, v)); }
				});
				c.pumpSettings = Object.keys(sets).length; c.valveSettings = Object.keys(vsets).length;
				return c;
			})();
			// scenario mode: how far the override moved the answer, on the engine alone (the unedited file against the edited one), so
			// a scenario that changes nothing cannot go on passing
			if (refText !== null) {
				const b0 = await rawRun(text, model, times, false); let mv = 0;
				raw.order.forEach((t) => { if (b0.frames[t]) { model.nodes.forEach((n) => { mv = Math.max(mv, Math.abs(b0.frames[t].heads[n.id] - raw.frames[t].heads[n.id])); mv = Math.max(mv, Math.abs((b0.frames[t].vol[n.id] || 0) - (raw.frames[t].vol[n.id] || 0)) / 1000); }); } });
				res.cover.scenarioMoved = mv;
			}
			// the ORIGINAL file against our export, heads (only a file that came from an .inp)
			if (s.inp) {
				try {
					const parsed = EC.lpnInpParse(text), orig = await rawRun(text, model, times, false);
					// scenario mode: `raw` is the hand-edited reference, so the page's EXPORT of the scenario is the one compared with it (heads, file in metres)
					const expRun = refText !== null ? await rawRun(built.inp, model, times, false) : null;
					let d = 0, at = ''; const sh = refText !== null ? 1 : parsed.scale.head;
					const cmp = expRun || orig, ref0 = expRun ? raw : raw;
					cmp.order.forEach((t) => { if (!ref0.frames[t]) { d = Infinity; at = 'time ' + t; return; } model.nodes.forEach((n) => { const x = Math.abs(cmp.frames[t].heads[n.id] * sh - ref0.frames[t].heads[n.id]); if (x > d) { d = x; at = n.id + '@' + t / 3600 + 'h'; } if (process.env.EPS_AUDIT_ORIG && x > 1e-4) { console.log('  orig-vs-export ' + n.id + '@' + t / 3600 + 'h ' + x.toExponential(2)); } }); });
					res.origVsExport = { head: d, at, frames: cmp.order.length, exportFrames: raw.order.length };
				} catch (e) { res.notes.push('original-file raw run: ' + e.message); }
			}
			const dumpArg = (argv.find((a) => /^--dump=/.test(a)) || '').slice(7);
			const dump = (label, frames) => {
				if (!dumpArg) { return; }
				const [kind, id] = dumpArg.split(':'), key = { head: ['heads', 'heads'], pressure: ['pressures', 'pressures'], demand: ['demands', 'demands'], level: ['levels', 'levels'], flow: ['flows', 'flows'], vel: ['velocities', 'vel'], hl: ['headlosses', 'hl'], qual: ['qualities', 'qual'], lqual: ['linkQualities', 'lqual'], deficit: ['demandDeficits', 'deficit'], emit: [null, 'emit'], vol: [null, 'vol'], set: [null, 'set'] }[kind];
				frames.forEach((f) => { const g = raw.frames[f.t]; console.log(`  dump ${label} ${kind} ${id} t=${f.t / 3600}h raw=${g && g[key[1]][id]} ours=${key[0] && f[key[0]] ? f[key[0]][id] : '-'}`); });
			};
			if (dumpArg) { const [k] = dumpArg.split(':'); if (k === 'emit' || k === 'vol' || k === 'set') { dump('RAW', raw.order.map((t) => raw.frames[t])); } }
			// BRIDGE
			const bm = JSON.parse(JSON.stringify(model));
			const br = await EC.lpnEpanetRun(bm, {});
			if (!br.ok) { res.notes.push('bridge not ok: ' + JSON.stringify(br.issues || br).slice(0, 200)); } else { res.runs.push(compare(model, br.frames, raw, 'BRIDGE')); dump('BRIDGE', br.frames); }
			// NATIVE
			const refused = EC.lpnNativeRunRefusals(model, { quality: true });
			let nm = model, stripped = [];
			if (refused.length) {
				res.notes.push('native refuses: ' + refused.map((r) => r.code + (r.ids && r.ids.length ? '(' + r.ids.slice(0, 4).join(',') + ')' : '')).join('; '));
			}
			if (process.env.EPS_AUDIT_RECS) { const o0 = EC.lpnMsxPassSteps; EC.lpnMsxPassSteps = function* (ctx) { console.log('  native hydraulic records at s: ' + ctx.recs.map((r) => r.t).join(',')); return yield* o0(ctx); }; }
			const nat = EC.lpnNativeRun(nm, { quality: true });
			if (nat.refused || !nat.ok) { res.notes.push('native did not run: ' + JSON.stringify(nat.issues || nat.refused || '').slice(0, 200)); } else {
				res.runs.push(compare(model, nat.frames, raw, 'NATIVE')); dump('NATIVE', nat.frames);
				if (msxArg && br.ok) {
					let worst = 0, at = '', cnt = 0, moved = 0, tmax = 0;
					br.frames.forEach((fe, i) => {
						const fn = nat.frames[i]; if (!fn || !fe.msxNodes) { return; }
						['msxNodes', 'msxLinks'].forEach((key) => Object.keys(fe[key] || {}).forEach((id) => fe[key][id].forEach((v, sp) => {
							if (v === null) { return; }
							const d = Math.abs(v - fn[key][id][sp]); cnt++; if (process.env.EPS_AUDIT_MSXLIST && d > +process.env.EPS_AUDIT_MSXLIST) { console.log('  msx diff ' + fe.t / 3600 + 'h ' + key + ' ' + id + ' sp' + (sp + 1) + ' ' + v.toPrecision(5) + ' / ' + fn[key][id][sp].toPrecision(5)); } tmax = Math.max(tmax, Math.abs(v));
							if (i && Math.abs(v - br.frames[i - 1][key][id][sp]) > 1e-3) { moved++; }
							if (d > worst) { worst = d; at = (key === 'msxNodes' ? 'node ' : 'link ') + id + ' species ' + (sp + 1) + ' at ' + fe.t / 3600 + ' h (' + v.toPrecision(5) + ' / ' + fn[key][id][sp].toPrecision(5) + ')'; }
						})));
					});
					if (process.env.EPS_AUDIT_MSXAT) { const [tt, ...ii] = process.env.EPS_AUDIT_MSXAT.split(','); const i0 = br.frames.findIndex((f) => f.t === tt * 3600); ii.forEach((id) => console.log('  msx at ' + tt + 'h ' + id + ' engine ' + JSON.stringify((br.frames[i0].msxNodes[id] || br.frames[i0].msxLinks[id])) + ' built-in ' + JSON.stringify((nat.frames[i0].msxNodes[id] || nat.frames[i0].msxLinks[id])))); }
					res.msx = { worst, at, count: cnt, moved, largest: tmax };
				}
				if (hasE) {
					try {
						const tr = await T.truth(EC, model);
						const df = T.diff(nat.energy, tr.bin);
						res.energy = { good: df.good, worst: df.worst, detail: df.detail };
						// Third pass (energy with prices): the ORIGINAL file's own energy block and the engine's printed report, against the built-in
						// summary and the bridge's. The report is read beside the binary because EPANET 2.2's report.c prints the demand charge
						// through Emax that output.c saveenergy() has already multiplied by it (see the audit record).
						if (s.inp) {
							const to = await T.truthOfInp(EC, model, refText !== null ? refText : text, true), dfo = T.diff(nat.energy, to.bin);
							const sumCpd = to.bin.pumps.reduce((a, r) => a + r.costPerDay, 0);
							res.energyOrig = { good: dfo.good, worst: dfo.worst, detail: dfo.detail, demandCharge: to.bin.demandCharge, reportDemandCharge: to.report && to.report.demandCharge,
								reportTotal: to.report && to.report.totalCost, binTotal: sumCpd + to.bin.demandCharge, pumpCost: to.bin.pumps.map((r) => r.id + ':' + r.costPerDay.toFixed(2)).join(' ') };
							if (br.ok && br.energy) {
								const hd = nat.energy.duration / 3600, e = br.energy; let bw = 0;
								to.bin.pumps.forEach((r) => { const b = e.pumps.filter((x) => x.id === r.id)[0], ref = r.costPerDay * hd / 24; if (b) { bw = Math.max(bw, Math.abs(b.cost - ref) / Math.max(Math.abs(ref), 1e-9)); } });
								const dcB = Math.abs(e.demandCharge - to.bin.demandCharge) / Math.max(Math.abs(to.bin.demandCharge), 1e-9);
								res.energyOrig.bridge = { pumpCostRel: bw, demandChargeRel: dcB, good: bw < 1e-3 && dcB < 1e-3 };
							}
						}
					} catch (e) { res.notes.push('energy truth: ' + e.message); }
				}
			}
			// the native-vs-bridge distance, so a defect in the bridge shows apart from the engine
		} catch (e) { skipped.push(s.name + ': ' + (e.stack || e).toString().split('\n').slice(0, 2).join(' | ')); continue; }
		results.push(res);
		console.log(`${res.name}  [${res.nodes} nodes, ${res.links} links, ${res.dur / 3600} h${res.quality ? ', quality ' + res.quality : ''}${res.pda ? ', PDA' : ''}]`);
		if (res.origVsExport) { console.log(`  RAW original file vs RAW our export: head ${res.origVsExport.head.toExponential(1)} m ${res.origVsExport.at} (${res.origVsExport.frames}/${res.origVsExport.exportFrames} frames)`); }
		res.runs.forEach((c) => console.log(line(c)));
		if (res.msx) { console.log('  MSX engine vs built-in: ' + res.msx.count + ' values, worst ' + res.msx.worst.toExponential(2) + ' ' + res.msx.at + ' (largest value ' + res.msx.largest.toPrecision(3) + ', ' + res.msx.moved + ' changes)'); }
		if (res.energyOrig) { console.log('  ENERGY original file (engine binary: ' + res.energyOrig.pumpCost + ' per day; demand charge ' + res.energyOrig.demandCharge.toFixed(2) + '; binary total ' + res.energyOrig.binTotal.toFixed(2) + ') vs built-in: ' + (res.energyOrig.good ? 'within tolerance' : 'DIFFERS ' + res.energyOrig.detail) + (res.energyOrig.bridge ? '; vs bridge pump cost ' + res.energyOrig.bridge.pumpCostRel.toExponential(1) + ' demand charge ' + res.energyOrig.bridge.demandChargeRel.toExponential(1) : '') + '; engine REPORT prints demand charge ' + res.energyOrig.reportDemandCharge + ' total ' + res.energyOrig.reportTotal); }
		if (res.energy) { console.log('  NATIVE energy vs engine: ' + (res.energy.good ? 'within tolerance' : 'DIFFERS ' + res.energy.detail) + ' ' + JSON.stringify(res.energy.worst)); }
		res.notes.forEach((n) => console.log('  note: ' + n));
		delete res.bridge;
	}
	skipped.forEach((s) => console.log('SKIPPED ' + s));
	if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify({ results, skipped }, null, 1)); }
	const bad = results.filter((r) => r.runs.some((c) => c.exceed.length));
	if (!oneArg) console.log(`\n${results.length} networks, ${bad.length} with a difference above tolerance, ${skipped.length} skipped`);
	process.exit(0);
})().catch((e) => { console.error(e); process.exit(2); });
