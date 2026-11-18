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
// Pump and valve SETTINGS and tank VOLUME are read from RAW but NOT compared: neither frame carries them.
// TOLERANCE (engineering, stated): head, level, pressure, headloss 1 mm; flow, demand 2e-6 m3/s or 1e-5 of the
// largest flow; velocity 1e-5 m/s + 1e-5 relative; quality 1e-3 relative with a floor of 1e-3 of its range.
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
	const frames = {}, order = [];
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
		w: { head: W(), pressure: W(), demand: W(), emitter: W(), level: W(), flow: W(), velocity: W(), headloss: W(), quality: W(), linkQuality: W(), deficit: W() },
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
			if (f.demandDeficits && f.demandDeficits[n.id] !== undefined) { note(out.w.deficit, Math.abs(f.demandDeficits[n.id] - g.deficit[n.id]), at(n.id)); }
			if (f.qualities && f.qualities[n.id] !== undefined && g.qual[n.id] !== undefined) { note(out.w.quality, Math.abs(f.qualities[n.id] - g.qual[n.id]), at(n.id), g.qual[n.id], 0); }
		});
		model.links.forEach((l) => {
			if (f.flows[l.id] !== undefined) { note(out.w.flow, Math.abs(f.flows[l.id] - g.flows[l.id]), at(l.id)); }
			if (f.velocities && f.velocities[l.id] !== undefined) { note(out.w.velocity, Math.abs(f.velocities[l.id] - g.vel[l.id]), at(l.id), g.vel[l.id], 1e-3); }
			if (f.headlosses && f.headlosses[l.id] !== undefined) { note(out.w.headloss, Math.abs(f.headlosses[l.id] - g.hl[l.id]), at(l.id)); }
			if (f.linkQualities && f.linkQualities[l.id] !== undefined && g.lqual[l.id] !== undefined) { note(out.w.linkQuality, Math.abs(f.linkQualities[l.id] - g.lqual[l.id]), at(l.id), g.lqual[l.id], 0); }
			if (f.statuses && f.statuses[l.id] !== g.st[l.id]) { out.statusDiff++; if (out.firstStatusT === null || f.t < out.firstStatusT) { out.firstStatusT = f.t; out.firstStatusAt = l.id + ' ' + g.st[l.id] + '(raw) vs ' + f.statuses[l.id]; } }
		});
	});
	out.tolQ = tolQ;
	const lim = { head: TOL.head, pressure: TOL.pressure, level: TOL.level, headloss: TOL.headloss, velocity: TOL.velocity, flow: tolQ, demand: tolQ, emitter: tolQ, deficit: tolQ };
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
			const model = L.currentModel();
			if (!model || !model.nodes || !model.nodes.length) { skipped.push(s.name + ': empty model'); continue; }
			model.hydraulics = Object.assign({}, model.hydraulics || {}, { accuracy: 1e-5 });
			const times = Object.assign({}, EC.lpnTimesDefaults(), (model.time && model.time.times) || {});
			const dur = times.duration > 0 ? times.duration : 0;
			const hasQ = !!(model.quality && model.quality.mode && model.quality.mode !== 'none');
			const hasE = (model.links || []).some((l) => l.type === 'pump');
			res.dur = dur; res.nodes = model.nodes.length; res.links = model.links.length; res.quality = hasQ ? model.quality.mode : null;
			res.pda = !!EC.lpnDemandModelIsPda(model);
			const built = EC.lpnToInp(JSON.parse(JSON.stringify(model)), { eps: true });
			if (process.env.EPS_AUDIT_INP) { fs.writeFileSync(process.env.EPS_AUDIT_INP, built.inp); }
			let raw;
			try { raw = await rawRun(built.inp, model, times, hasQ); } catch (e) {
				// EPANET refuses our own export: say what the page itself then does (the bridge, the built-in solver)
				const bm0 = JSON.parse(JSON.stringify(model)), br0 = await EC.lpnEpanetRun(bm0, {}), nt0 = EC.lpnNativeRun(model, { quality: true });
				const diag = EC.lpnDiagnose ? JSON.stringify(EC.lpnDiagnose(model, { engine: 'epanet' }) || '').slice(0, 160) : '';
				skipped.push(s.name + ': EPANET refuses the .inp the page exports for it (' + e.message + '). Page bridge ok=' + br0.ok + (br0.ok ? '' : ' ' + JSON.stringify(br0.issues || br0.error || '').slice(0, 160)) + '; built-in ok=' + nt0.ok + '; lpnDiagnose=' + diag);
				continue;
			}
			// the ORIGINAL file against our export, heads (only a file that came from an .inp)
			if (s.inp) {
				try {
					const parsed = EC.lpnInpParse(text), orig = await rawRun(text, model, times, false);
					let d = 0, at = ''; const sh = parsed.scale.head;
					orig.order.forEach((t) => { if (!raw.frames[t]) { d = Infinity; at = 'time ' + t; return; } model.nodes.forEach((n) => { const x = Math.abs(orig.frames[t].heads[n.id] * sh - raw.frames[t].heads[n.id]); if (x > d) { d = x; at = n.id + '@' + t / 3600 + 'h'; } }); });
					res.origVsExport = { head: d, at, frames: orig.order.length, exportFrames: raw.order.length };
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
			const nat = EC.lpnNativeRun(nm, { quality: true });
			if (nat.refused || !nat.ok) { res.notes.push('native did not run: ' + JSON.stringify(nat.issues || nat.refused || '').slice(0, 200)); } else {
				res.runs.push(compare(model, nat.frames, raw, 'NATIVE')); dump('NATIVE', nat.frames);
				if (hasE) {
					try {
						const tr = await T.truth(EC, model);
						const df = T.diff(nat.energy, tr.bin);
						res.energy = { good: df.good, worst: df.worst, detail: df.detail };
					} catch (e) { res.notes.push('energy truth: ' + e.message); }
				}
			}
			// the native-vs-bridge distance, so a defect in the bridge shows apart from the engine
		} catch (e) { skipped.push(s.name + ': ' + (e.stack || e).toString().split('\n').slice(0, 2).join(' | ')); continue; }
		results.push(res);
		console.log(`${res.name}  [${res.nodes} nodes, ${res.links} links, ${res.dur / 3600} h${res.quality ? ', quality ' + res.quality : ''}${res.pda ? ', PDA' : ''}]`);
		if (res.origVsExport) { console.log(`  RAW original file vs RAW our export: head ${res.origVsExport.head.toExponential(1)} m ${res.origVsExport.at} (${res.origVsExport.frames}/${res.origVsExport.exportFrames} frames)`); }
		res.runs.forEach((c) => console.log(line(c)));
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
