// A RUN NAMES THE PIPES THAT RUN FAST -- ROADMAP Task 864. Run with:
//
//   node dev/lpn-spike/velocity-warning-harness.js
//
// Tom, 2026-11-15, after a pipe carried 15 ft/s into a full tank: "add a warning like 'Pipe XX velocity is YY
// at time ZZ:ZZ.'" The page says it in the status line it already uses for run notes (applySolveResult()'s
// 'solve-notes'): ONE sentence, for the fastest pipe over the limit in any reporting step, giving its LARGEST
// velocity and when it occurs, then one line counting the other pipes over the limit (Tom, 2026-11-16: "List only
// the worst plus the count of others"). The limit is a project setting, `settings.velocityLimit`: blank is the
// default for the unit (10 ft/s, 3 m/s), zero is no warning.
//
// 1. EngCalcs.lpnVelocityPeaks, pure: the largest per pipe, its first time, valves and pumps left out, sorted.
// 2. The page's sentences (velocityNote(), the DOM stub): a steady solve has no "at time"; only the worst pipe is
//    named and the others counted; nothing is said when nothing passes the limit.
// 2c. The setting: saved and reopened, a changed limit changes the warning, zero is silent, SI units, and a
//    new project in a different velocity unit does not carry the old number.
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
	"\t\tvelocityNote: velocityNote, serialize: serializeProject, getSettings: function () { return settings; },\n\t\tvelocityLimitDefaultText: velocityLimitDefaultText, resetUnitBearingDefaultsFor: resetUnitBearingDefaultsFor,\n\t\tconvertUnitValues: convertUnitValues, assembleModel: assembleModel, getDoc: function () { return doc; },\n" +
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
	ok('steady: only the fastest pipe is named, "⚠ Pipe X velocity is N ft/sec.", with no time',
		text.indexOf('⚠ Pipe ' + first + ' velocity is ' + (11 + ids.length - 1) + ' ft/sec.') === 0 && !/ at \d/.test(text), text.slice(0, 80));
	ok('...exactly one pipe sentence, then one count line: "⚠ And more pipes (n) above 10 ft/sec." with n = the others',
		(text.match(/⚠ Pipe /g) || []).length === 1 && text.endsWith(' ⚠ And more pipes (' + (ids.length - 1) + ') above 10 ft/sec.'), text);
	const one = L.velocityNote({ velocities: { [ids[0]]: 12 * FT } });
	ok('a single pipe over the limit: its sentence and no count line', one === '⚠ Pipe ' + ids[0] + ' velocity is 12 ft/sec.', one);
	ok('nothing passes 10 ft/s: nothing is said', L.velocityNote({ velocities: { [ids[0]]: 9.9 * FT } }) === '');
	const valve = L.velocityNote({ velocities: { NOPE: 50 * FT } });
	ok('an id that is not a pipe is not named', valve === '');
}

// ---- 2c. the project setting -------------------------------------------------------------------------
{
	setUnitSet('us'); L.reset(); openExample(L);
	const ids = L.getDoc().links.filter((l) => l.type === 'pipe').map((l) => l.id);
	const v = { [ids[0]]: 12 * FT, [ids[1]]: 9 * FT, [ids[2]]: 11 * FT };
	const S = L.getSettings();
	ok('blank is the default for the unit: 10 ft/sec in US units', S.velocityLimit === undefined && L.velocityLimitDefaultText() === '10 ft/sec', L.velocityLimitDefaultText());
	ok('default limit: the 12 and 11 ft/s pipes are over, the worst named, one other counted',
		L.velocityNote({ velocities: v }) === '⚠ Pipe ' + ids[0] + ' velocity is 12 ft/sec. ⚠ And more pipes (1) above 10 ft/sec.', L.velocityNote({ velocities: v }));
	S.velocityLimit = 11.5;
	ok('a changed limit changes the warning: at 11.5 only the 12 ft/s pipe, and no count line',
		L.velocityNote({ velocities: v }) === '⚠ Pipe ' + ids[0] + ' velocity is 12 ft/sec.', L.velocityNote({ velocities: v }));
	S.velocityLimit = 8;
	ok('...and at 8 the 9 ft/s pipe joins the count, which names the limit as set',
		L.velocityNote({ velocities: v }) === '⚠ Pipe ' + ids[0] + ' velocity is 12 ft/sec. ⚠ And more pipes (2) above 8 ft/sec.', L.velocityNote({ velocities: v }));
	S.velocityLimit = 0;
	ok('zero means no warning', L.velocityNote({ velocities: { [ids[0]]: 99 * FT } }) === '');

	// saved and reopened
	S.velocityLimit = 11.5;
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	ok('the setting rides in the saved project, as typed', saved.settings.velocityLimit === 11.5);
	L.reset(); openExample(L);
	ok('a project without it opens on the default', L.getSettings().velocityLimit === undefined);
	const back = L.acceptImportedText(JSON.stringify(saved));
	L.applySaved(back); L.buildDom();
	ok('reopened, the limit is still 11.5', L.getSettings().velocityLimit === 11.5);
	ok('...and the warning uses it', L.velocityNote({ velocities: v }) === '⚠ Pipe ' + ids[0] + ' velocity is 12 ft/sec.', L.velocityNote({ velocities: v }));

	// SI: default 3 m/s, the number typed is read in m/s
	setUnitSet('si'); L.reset(); openExample(L, 'si');
	const sids = L.getDoc().links.filter((l) => l.type === 'pipe').map((l) => l.id);
	ok('SI default is 3 m/s', L.velocityLimitDefaultText() === '3 m/s', L.velocityLimitDefaultText());
	const sv = { [sids[0]]: 3.5, [sids[1]]: 2.9, [sids[2]]: 3.2 };
	const st = L.velocityNote({ velocities: sv });
	console.log('   ' + st);
	ok('SI: 3.5 m/s named, the 3.2 counted, the 2.9 not; the limit is stated in m/s',
		/^⚠ Pipe .* velocity is 3\.5 m\/s\. ⚠ And more pipes \(1\) above 3 m\/s\.$/.test(st), st);
	L.getSettings().velocityLimit = 3.3;
	ok('SI: a typed 3.3 means 3.3 m/s', /^⚠ Pipe \S+ velocity is 3\.5 m\/s\.$/.test(L.velocityNote({ velocities: sv })), L.velocityNote({ velocities: sv }));
	// a unit change reinterprets, never converts; the Destructive path rewrites it
	L.getSettings().velocityLimit = 3.3;
	L.convertUnitValues('lpn_u_velocity', 1 / 0.3048);
	ok('converting the unit (the Destructive choice) rewrites the typed limit: 3.3 m/s is 10.8268 ft/s', Math.abs(L.getSettings().velocityLimit - 3.3 / 0.3048) < 1e-4, L.getSettings().velocityLimit);
	// a new project in another velocity unit does not carry the old number
	L.getSettings().velocityLimit = 12;
	L.resetUnitBearingDefaultsFor(['lpn_u_velocity']);
	ok('a new project whose velocity unit differs falls back to the default', L.getSettings().velocityLimit === undefined);
	L.getSettings().velocityLimit = 12;
	L.resetUnitBearingDefaultsFor(['lpn_u_flow']);
	ok('...and one whose velocity unit is the same keeps the limit', L.getSettings().velocityLimit === 12);
	setUnitSet('us');
}

// ---- 2b. an id that looks like a replacement pattern, and the per-run cache ---------------------------------
{
	setUnitSet('us'); L.reset(); openExample(L);
	const pipeId = L.getDoc().links.filter((l) => l.type === 'pipe')[0].id;
	const doc = L.getDoc();
	const link = doc.links.find((l) => l.id === pipeId);
	doc.links.push(Object.assign({}, link, { id: 'A$&B{velocity}' }));
	const t = L.velocityNote({ velocities: { 'A$&B{velocity}': 12 * FT } });
	doc.links.pop();
	ok('a pipe id of "A$&B{velocity}" is written as it is', t === '⚠ Pipe A$&B{velocity} velocity is 12 ft/sec.', t);

	// The per-run cache: a run's answer is kept until the run (or the unit) changes; an edit with Recalculate off
	// does not touch it, and a new run replaces it.
	const keep = { tok: EC.lpnTimeRunToken, fr: EC.lpnTimeRunFrames };
	let tok = { run: 1 }, frames = [{ t: 0, velocities: { [pipeId]: 11 * FT } }, { t: 3600, velocities: { [pipeId]: 13 * FT } }];
	EC.lpnTimeRunToken = () => tok; EC.lpnTimeRunFrames = () => frames;
	const a = L.velocityNote({ velocities: {} });
	ok('an extended run names the pipe at its peak and its time', a === '⚠ Pipe ' + pipeId + ' velocity is 13 ft/sec at 1:00.', a);
	frames = [{ t: 0, velocities: { [pipeId]: 15 * FT } }];
	ok('the same run is not re-scanned (the snapshot stands)', L.velocityNote({ velocities: {} }) === a);
	tok = { run: 2 };
	const b = L.velocityNote({ velocities: {} });
	ok('a new run replaces it', b === '⚠ Pipe ' + pipeId + ' velocity is 15 ft/sec.', b);
	setUnitSet('si');
	const c = L.velocityNote({ velocities: {} });
	ok('a unit change re-words it in the new unit', /m\/s|m\/sec/.test(c) && c !== b, c);
	frames = []; tok = null;
	ok('with no run the single solve is read', L.velocityNote({ velocities: { [pipeId]: 12 * FT } }).indexOf('⚠ Pipe ' + pipeId) === 0);
	EC.lpnTimeRunToken = keep.tok; EC.lpnTimeRunFrames = keep.fr;
	setUnitSet('us');
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
