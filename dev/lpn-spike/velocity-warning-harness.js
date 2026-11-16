// A RUN NAMES THE PIPES THAT RUN FAST -- ROADMAP Task 864. Run with:
//
//   node dev/lpn-spike/velocity-warning-harness.js
//
// Tom, 2026-11-15, after a pipe carried 15 ft/s into a full tank: "add a warning like 'Pipe XX velocity is YY
// at time ZZ:ZZ.'" The page says it in the status line it already uses for run notes (applySolveResult()'s
// 'solve-notes'), one sentence per pipe whose velocity passes 10 ft/s in any reporting step, giving that pipe's
// LARGEST velocity and when it occurs; the fastest ten, then one line counting the rest.
//
// 1. EngCalcs.lpnVelocityPeaks, pure: the largest per pipe, its first time, valves and pumps left out, sorted.
// 2. The page's sentences (velocityNote(), the DOM stub): a steady solve has no "at time"; more than ten
//    pipes list ten and count the rest; nothing is said when nothing passes the limit.
// 3. Extended-period runs, in both engines: a full tank that CAN OVERFLOW keeps taking water through its 8 in.
//    feed (the 2026-11-15 repro, whose pipe ran at 15.7 ft/s), and both engines name that pipe at the same
//    velocity and the same time. Net3 over its day (EPANET) says what it says.
'use strict';
const path = require('path');
const R = __dirname + '/';
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require(R + 'lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require(R + 'example-fixture.js');
const fs = require('fs');

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tvelocityNote: velocityNote, assembleModel: assembleModel, getDoc: function () { return doc; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }");
const EC = global.EngCalcs;
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');
const { buildModel } = require(R + 'net3-model.js');

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const FT = 0.3048, H = 3600;

// ---- 1. the pure function -------------------------------------------------------------------------
{
	const frames = [
		{ t: 0, velocities: { A: 2 * FT, B: 11 * FT, V: 30 * FT, U: 0 } },
		{ t: 3600, velocities: { A: 4 * FT, B: 14 * FT, C: 10.5 * FT, V: 31 * FT } },
		{ t: 7200, velocities: { A: 3 * FT, B: 14 * FT, C: 9 * FT, V: 5 * FT } }
	];
	const types = { A: 'pipe', B: 'pipe', C: 'pipe', V: 'valve', U: 'pump' };
	const peaks = EC.lpnVelocityPeaks(frames, (id) => types[id] === 'pipe');
	ok('only pipes above 10 ft/s, fastest first: B then C', peaks.map((p) => p.id).join() === 'B,C', JSON.stringify(peaks.map((p) => p.id)));
	ok('each pipe\'s MAXIMUM, at the first time it is reached (B 14 ft/s at 1:00, not 2:00)', Math.abs(peaks[0].v - 14 * FT) < 1e-12 && peaks[0].t === 3600);
	ok('...C reaches 10.5 ft/s at 1:00', Math.abs(peaks[1].v - 10.5 * FT) < 1e-12 && peaks[1].t === 3600);
	ok('exactly 10 ft/s is not over the limit', EC.lpnVelocityPeaks([{ velocities: { A: 10 * FT } }], null).length === 0);
	ok('no frames, no warnings', EC.lpnVelocityPeaks([], null).length === 0);
}

// ---- 2. the page's sentences -----------------------------------------------------------------------
{
	setUnitSet('us'); L.reset(); openExample(L);
	const ids = L.getDoc().links.filter((l) => l.type === 'pipe').map((l) => l.id);
	const vel = {};
	ids.forEach((id, i) => { vel[id] = (11 + i) * FT; });
	const text = L.velocityNote({ velocities: vel });
	console.log('   ' + text);
	const first = ids[ids.length - 1];
	ok('steady: "⚠ Pipe X velocity is N ft/sec." with no time, fastest first',
		text.indexOf('⚠ Pipe ' + first + ' velocity is ' + (11 + ids.length - 1) + ' ft/sec.') === 0 && !/ at \d/.test(text), text.slice(0, 80));
	ok('...every pipe over the limit is named when there are not more than ten', (text.match(/⚠ Pipe /g) || []).length === ids.length && text.indexOf('more pipes') < 0);
	const was = EC.LPN_VELOCITY_WARN_LISTED;
	EC.LPN_VELOCITY_WARN_LISTED = 3;
	const flood = L.velocityNote({ velocities: vel });
	EC.LPN_VELOCITY_WARN_LISTED = was;
	ok('more pipes than the list holds: the fastest are named and the rest counted',
		(flood.match(/⚠ Pipe /g) || []).length === 3 && flood.indexOf('⚠ And more pipes (' + (ids.length - 3) + ') above 10 ft/sec.') >= 0, flood);
	ok('nothing passes 10 ft/s: nothing is said', L.velocityNote({ velocities: { [ids[0]]: 9.9 * FT } }) === '');
	const valve = L.velocityNote({ velocities: { NOPE: 50 * FT } });
	ok('an id that is not a pipe is not named', valve === '');
}

// ---- 3. extended-period runs in both engines ---------------------------------------------------------
const pipe = (id, from, to, len, d) => ({ id, type: 'pipe', from, to, length: len * FT, diameter: d * 0.0254, roughness: 130, k: 0, status: 'open' });
function repro() {
	return {
		method: 'hw', visc: EC.EPANET_VISCOS,
		nodes: [{ id: 'R', type: 'reservoir', elev: 710 * FT, head: 710 * FT, headBase: 710 * FT, headPattern: null },
			{ id: 'NJ1', type: 'junction', elev: 693 * FT, demand: 0, demandBase: 0, demandPattern: null },
			{ id: 'T', type: 'tank', elev: 0, ground: 0, head: 20 * FT, level: 20 * FT, minLevel: 0, maxLevel: 30 * FT, diameter: 40 * FT, overflow: true }],
		links: [pipe('L5', 'R', 'NJ1', 3000, 8), pipe('L3', 'NJ1', 'T', 4000, 8)],
		time: { times: Object.assign(EC.lpnTimesDefaults(), { duration: 24 * H, hydraulicStep: H, patternStep: H, reportStep: H }), patterns: [], defaultPattern: null, controls: [], warnings: [] },
		hydraulics: { accuracy: 1e-5 }
	};
}
(async () => {
	await EC.lpnEpanetLoad('file://' + ROOT + 'js/vendor/epanet-js.js');
	const m = repro(), types = {};
	m.links.forEach((l) => { types[l.id] = l.type; });
	const isPipe = (id) => types[id] === 'pipe';
	const epa = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(m)));
	const nat = EC.lpnNativeRun(m);
	ok('both engines ran the tank repro', epa.ok && nat.ok);
	const pe = EC.lpnVelocityPeaks(epa.frames, isPipe), pn = EC.lpnVelocityPeaks(nat.frames, isPipe);
	const say = (p) => 'Pipe ' + p.id + ' velocity is ' + (p.v / FT).toFixed(2) + ' ft/s at ' + EC.lpnFormatTime(p.t);
	console.log('   EPANET: ' + pe.map(say).join('; ') + '\n   built-in: ' + pn.map(say).join('; '));
	ok('both name the two 8 in. pipes (about 15 ft/s) and no other', pe.map((p) => p.id).sort().join() === 'L3,L5' && pn.map((p) => p.id).sort().join() === 'L3,L5');
	ok('...with the same velocity and the same time to a millimetre a second', pe.every((p, i) => {
		const q = pn.find((x) => x.id === p.id); return q && Math.abs(q.v - p.v) < 1e-3 * FT && q.t === p.t; }));
	ok('...a velocity above 10 ft/s', pe[0].v > 10 * FT);

	const net3 = buildModel(EC, EC.lpnInpParse(fs.readFileSync(R + 'reference/Net3.inp', 'utf8')));
	const t3 = {};
	net3.links.forEach((l) => { t3[l.id] = l.type; });
	const r3 = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(net3)));
	const p3 = EC.lpnVelocityPeaks(r3.frames, (id) => t3[id] === 'pipe');
	let top = 0, topId = '', topT = 0;
	r3.frames.forEach((f) => { Object.keys(f.velocities).forEach((id) => {
		if (t3[id] === 'pipe' && f.velocities[id] > top) { top = f.velocities[id]; topId = id; topT = f.t; } }); });
	console.log('   Net3 over its day: fastest pipe ' + topId + ' at ' + (top / FT).toFixed(2) + ' ft/s at ' + EC.lpnFormatTime(topT) + '; pipes over 10 ft/s: ' + p3.length);
	ok('Net3 ran its day', r3.ok && r3.frames.length === 25);
	ok('Net3 says nothing at 10 ft/s: its fastest pipe over the day stays under it', p3.length === 0 && top < 10 * FT);
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
