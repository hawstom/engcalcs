// THE BENTLEY .wtg.sqlite READER, js/lpn-wtg.js -- ROADMAP Task 749. Run with:
//
//   node dev/lpn-spike/wtg-import-harness.js
//
// TWO HALVES.
//
// 1. ALWAYS RUN: a Bentley-shaped database BUILT HERE by Python's sqlite3 (a different SQLite from
//    the one sql.js compiles), laid out as the public samples are (dev/sqlite-reader.md): soft-deleted
//    rows, a pump and a PRV that are nodes between two pipes, a design-point pump, a variable-area
//    tank, a stepwise pattern, a clock-time control, storage in feet and cubic feet per second, the
//    storage-unit codes in a schema blob, a child scenario whose child Physical alternative changes
//    one pipe, and an alternative no scenario uses. The child-scenario encoding is the patent's
//    reading, NOT OBSERVED: no public file has one.
//
// 2. RUN WHEN THE SAMPLES ARE ON DISK: the public WaterGEMS files (Zenodo 7162154, CC BY 4.0) are
//    NOT in the repository (Tom's open question on Bentley's licence). Point WTG_SAMPLES at the
//    folder that holds the extracted "WaterGems model" and "EPANET Model" folders; without it the
//    half prints NOT RUN and the harness still exits 0. With it, the EPS model is read and compared
//    with the `.inp` WaterGEMS itself exported from the same model: element counts, every attribute,
//    and an EPANET solve of both at time zero.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
require('./bootstrap.js');
const initSqlJs = require(path.join(ROOT, 'js', 'vendor', 'sql-wasm.js'));
require(path.join(ROOT, 'js', 'lpn-sqlite.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-wtg.js'));
const EC = globalThis.EngCalcs;
EC.lpnSqliteSetEngine(initSqlJs, fs.readFileSync(path.join(ROOT, 'js', 'vendor', 'sql-wasm.wasm')));

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }
function noteOf(r, code) { return r.notes.filter((n) => n.code === code)[0] || null; }
function section(inp, name) {
	const lines = inp.split(/\r?\n/), out = [];
	let on = false;
	for (const l of lines) {
		if (/^\[/.test(l)) { on = l === '[' + name + ']'; continue; }
		if (on && l.trim() && l.trim()[0] !== ';') { out.push(l.trim().split(/\s+/)); }
	}
	return out;
}

async function epanetSolve(inpText) {
	const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('h.inp', inpText);
	try { p.open('h.inp', 'h.rpt', 'h.out'); } catch (e) { throw new Error(e.message + '\n' + ws.readFile('h.rpt')); }
	p.openH(); p.initH(0); p.runH();
	const heads = {}, flows = {};
	const nn = p.getCount(0), nl = p.getCount(2);
	for (let i = 1; i <= nn; i++) { heads[p.getNodeId(i)] = p.getNodeValue(i, 10); }
	for (let i = 1; i <= nl; i++) { flows[p.getLinkId(i)] = p.getLinkValue(i, 8); }
	p.closeH(); p.close();
	return { heads, flows };
}

// ---------------------------------------------------------------------------------------------
// 1. The synthetic model
// ---------------------------------------------------------------------------------------------
const { buildSyntheticWtg } = require('./wtg-synthetic-fixture.js');

async function synthetic() {
	head('1. Synthetic Bentley-shaped model (always run)');
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-wtg-'));
	const file = buildSyntheticWtg(path.join(tmp, 'syn.wtg.sqlite'));
	const db = await EC.lpnSqliteOpen(fs.readFileSync(file));
	ok('recognised as a WaterGEMS model', EC.lpnWtgIsWtg(db));
	const r = EC.lpnWtgRead(db, { flowUnits: 'LPS' });
	ok('read succeeds', r.ok, r.message);
	const inp = r.inp;
	if (process.env.WTG_DUMP) { fs.writeFileSync(process.env.WTG_DUMP, inp); }
	const J = section(inp, 'JUNCTIONS'), P = section(inp, 'PIPES'), PU = section(inp, 'PUMPS'), V = section(inp, 'VALVES');
	const jById = Object.fromEntries(J.map((t) => [t[0], t])), pById = Object.fromEntries(P.map((t) => [t[0], t]));
	ok('deleted junction J2 and deleted pipe P6 are not imported', !jById.J2 && !pById.P6);
	ok('a label with a space gets an EPANET ID, and the report says so', !!jById.J_3 && (noteOf(r, 'wtg-id-changed') || { ids: [] }).ids.indexOf('J 3 (J_3)') >= 0);
	ok('elevation stored in feet comes back as the metres typed: 10', jById.J1 && jById.J1[1] === '10');
	ok('first demand 2.5 L/s on PAT1 in [JUNCTIONS]', jById.J1 && jById.J1[2] === '2.5' && jById.J1[3] === 'PAT1', JSON.stringify(jById.J1));
	const dem = section(inp, 'DEMANDS');
	ok('both demands of J1 in [DEMANDS]', dem.length === 2 && dem[1][1] === '1', JSON.stringify(dem));
	// Named as WaterGEMS's own export names them: the node's element ID, then -A (upstream) and -B (downstream).
	ok('pump and PRV become links between -A and -B junctions at their elevations',
		!!jById['110-A'] && jById['110-B'][1] === '30' && !!jById['111-A'] && jById['111-B'][1] === '20', JSON.stringify(J.map((t) => t[0])));
	ok('pump PMP1 runs 110-A to 110-B on its curve', PU.length === 1 && PU[0].slice(0, 5).join(' ') === 'PMP1 110-A 110-B HEAD CRV-1', JSON.stringify(PU));
	ok('the pipe upstream of the pump ends at 110-A, the one downstream starts at 110-B',
		pById.P1 && pById.P1[2] === '110-A' && pById.P2 && pById.P2[1] === '110-B');
	const XYof = Object.fromEntries(section(inp, 'COORDINATES').map((t) => [t[0], t.slice(1).join(' ')]));
	ok('both junctions are drawn at the pump node, on top of each other', XYof['110-A'] && XYof['110-A'] === XYof['110-B'] && XYof['111-A'] === XYof['111-B'], XYof['110-A'] + ' | ' + XYof['110-B']);
	ok('user-defined length 250 m is the pipe length; the pipe without one takes the scaled 160 m',
		pById.P2[3] === '250' && pById.P4[3] === '160', pById.P2[3] + ' ' + pById.P4[3]);
	ok('diameter 300 mm, roughness C 130', pById.P2[4] === '300' && pById.P2[5] === '130');
	ok('check valve on P1 is status CV; minor loss 0.5 on P3', pById.P1[7] === 'CV' && pById.P3[6] === '0.5');
	ok('PRV setting 22 m from Bentley psi, diameter 250', V.length === 1 && V[0][4] === 'PRV' && V[0][5] === '22' && V[0][3] === '250', JSON.stringify(V));
	const C = section(inp, 'CURVES');
	ok('design-point pump curve 30 L/s at 25 m', C.some((t) => t.join(' ') === 'CRV-1 30 25'), JSON.stringify(C));
	ok('constant 70 % efficiency as a one-point curve', C.some((t) => t.join(' ') === 'CRV-1E 30 70'));
	ok('variable-area tank: volume curve 0.5 m to 6 m, 0 to 500 m3', C.some((t) => t.join(' ') === 'T1 0.5 0') && C.some((t) => t.join(' ') === 'T1 6 500'), JSON.stringify(C));
	const TK = section(inp, 'TANKS');
	ok('tank: base 40, initial 3, min 0.5, max 6, curve T1', TK[0] && TK[0].slice(0, 5).join(' ') === 'T1 40 3 0.5 6' && TK[0][7] === 'T1', JSON.stringify(TK));
	const PT = section(inp, 'PATTERNS');
	ok('stepwise pattern 1, 1.5, 0.5, 1.2', PT.length === 1 && PT[0].slice(1).join(' ') === '1 1.5 0.5 1.2', JSON.stringify(PT));
	ok('the deleted pattern is not written', inp.indexOf('GONE') < 0);
	ok('clock-time control on P5', /LINK P5 CLOSED AT CLOCKTIME 6:00 AM/.test(inp));
	ok('EPS times: 24 h at 1 h', /Duration\s+24:00/.test(inp) && /Hydraulic Timestep\s+1:00/.test(inp));
	ok('relative viscosity 0.985218 as WaterGEMS exports it', /Viscosity\s+0\.9852181\b/.test(inp));
	ok('spot elevation reported, not imported', (noteOf(r, 'wtg-element-unread') || { ids: [] }).ids.indexOf('SPOT-1 (IdahoSpotElevation)') >= 0);
	ok('inactive J 3 reported and listed for the page', r.inactiveIds.nodes.indexOf('J_3') >= 0);
	ok('the pump and valve split is reported', (noteOf(r, 'wtg-directed-split') || { ids: [] }).ids.join() === 'PMP1 (110-A, 110-B),PRV1 (111-A, 111-B)');
	ok('transient (Hammer) data named as not read', (noteOf(r, 'wtg-tables-unread') || { ids: [] }).ids.indexOf('IdahoPipe_Hammer_Data') >= 0);
	ok('no .wtg given: the units are said to be assumed', !!noteOf(r, 'wtg-units-assumed'));
	ok('storage units from the schema blob: diameter is feet (63)', r.declaredUnits.Physical_PipeDiameter === 63);
	// Scenarios: Peak inherits everything (no overrides); Peak, small main names the child alternative.
	const peak = r.scenarios.filter((s) => s.name === 'Peak')[0], small = r.scenarios.filter((s) => s.name === 'Peak, small main')[0];
	ok('two scenarios beyond Base', r.scenarios.length === 2);
	ok('Peak overrides nothing', peak && Object.keys(peak.overrides).length === 0);
	ok('Peak, small main is a child of Peak', small && small.parentName === 'Peak');
	const smallAlt = small && r.alternatives.filter((a) => a.fileId === (small.alternatives || {}).physical)[0];
	ok('it names its child Physical alternative, which holds exactly P2 diameter 200 and hangs from Base', smallAlt && JSON.stringify(smallAlt.values) === '{"l:P2":{"diameter":200}}' && !smallAlt.parentFileId && !smallAlt.root,
		JSON.stringify(smallAlt));
	ok('it names nothing else, and Peak names nothing', Object.keys(small.alternatives).join() === 'physical' && Object.keys(peak.alternatives).length === 0, JSON.stringify([small.alternatives, peak.alternatives]));
	ok('nothing is left over as its own override, and its differences from Base are exactly P2 diameter 200', Object.keys(small.overrides).length === 0 && JSON.stringify(small.differences) === '{"l:P2":{"diameter":200}}', JSON.stringify([small.overrides, small.differences]));
	const alt = r.alternatives.filter((a) => a.name === 'Rehab')[0];
	ok('the unused root alternative is carried as a Base of its own', alt && alt.root === true && alt.category === 'physical');
	ok('holding only the elements it has rows for, with its own P3 diameter 350 and J1 elevation 11',
		alt && alt.values['l:P3'] && alt.values['l:P3'].diameter === 350 && alt.values['n:J1'].elev === 11 && !alt.values['l:P1'],
		JSON.stringify(alt && alt.values));
	const sol = await epanetSolve(inp);
	ok('EPANET solves the written file', Object.keys(sol.heads).length === J.length + 2 && isFinite(sol.heads.J1), 'J1 head ' + sol.heads.J1);
	ok('the PRV holds 22 m downstream (head 42 at its 20 m elevation)', Math.abs(sol.heads['111-B'] - 42) < 0.01 || sol.flows.PRV1 <= 1e-9, String(sol.heads['111-B']));
	db.close();
	fs.rmSync(tmp, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------------------------
// 2. The public samples, when present
// ---------------------------------------------------------------------------------------------
const SAMPLES = process.env.WTG_SAMPLES || '';
const EPS = 'EPS_Badapokharan_Operation as per design_base_model';

// WaterGEMS's own export renames and adds (dev/sqlite-reader.md, "The EPS model against its .inp"):
// the pump node U1 becomes junctions 4 and 3 with pipes 3 and 4 for U1-A and U1-B, and T01's top inlet
// becomes junctions 2 and 1, PSV 1 and a 0.001-long pipe 2. This reader names the pump's two junctions as
// WaterGEMS 2024's own export does (Tom's WTG-tgh-1, 2026-10-21), after the node's element ID (96-A, 96-B), and
// joins the inlet pipe to the tank, so those are the mapped and the expected extras.
const NODE_ALIAS = { 4: '96-A', 3: '96-B' };
const LINK_ALIAS = { 3: 'U1-A', 4: 'U1-B' };
const THEIRS_ONLY = { nodes: ['1', '2'], links: ['1', '2'] };

function close(a, b) { return Math.abs(a - b) <= 1e-9 + 1e-7 * Math.abs(b); }

async function samples() {
	head('2. The public WaterGEMS samples (Zenodo 7162154)');
	const dbFile = SAMPLES && path.join(SAMPLES, 'WaterGems model', EPS + '.wtg.sqlite');
	const inpFile = SAMPLES && path.join(SAMPLES, 'EPANET Model', EPS + '.inp');
	if (!SAMPLES || !fs.existsSync(dbFile) || !fs.existsSync(inpFile)) {
		console.log('  NOT RUN: set WTG_SAMPLES to the folder holding "WaterGems model" and "EPANET Model" (dev/sqlite-reader.md says where to get them).');
		return;
	}
	const bytes = fs.readFileSync(dbFile);
	const db = await EC.lpnSqliteOpen(bytes);
	const wtg = path.join(SAMPLES, 'WaterGems model', EPS + '.wtg');
	const display = fs.existsSync(wtg) ? EC.lpnWtgDisplayUnits(fs.readFileSync(wtg, 'utf8')) : null;
	const r = EC.lpnWtgRead(db, { display });
	ok('EPS model reads', r.ok);
	ok('flow units from the .wtg: LPS', r.flowUnits === 'LPS');
	const ours = EC.lpnInpParse(r.inp), theirs = EC.lpnInpParse(fs.readFileSync(inpFile, 'utf8'));
	ok('both parse', ours.ok && theirs.ok);
	const on = Object.fromEntries(ours.nodes.map((n) => [n.id, n])), ol = Object.fromEntries(ours.links.map((l) => [l.id, l]));
	const nAlias = (id) => NODE_ALIAS[id] || id, lAlias = (id) => LINK_ALIAS[id] || id;
	const tn = theirs.nodes.filter((n) => THEIRS_ONLY.nodes.indexOf(n.id) < 0), tl = theirs.links.filter((l) => THEIRS_ONLY.links.indexOf(l.id) < 0);
	const kinds = (list) => list.reduce((m, x) => { m[x.type] = (m[x.type] || 0) + 1; return m; }, {});
	console.log('       ours:   ' + JSON.stringify(kinds(ours.nodes)) + ' ' + JSON.stringify(kinds(ours.links)));
	console.log('       theirs: ' + JSON.stringify(kinds(theirs.nodes)) + ' ' + JSON.stringify(kinds(theirs.links)) + ' (4 of them the tank-inlet construction)');
	ok('same nodes once the inlet construction is set aside (20 junctions less 2, 14 reservoirs, 1 tank)',
		tn.length === ours.nodes.length && tn.every((n) => on[nAlias(n.id)]), tn.length + ' vs ' + ours.nodes.length);
	ok('same links likewise (31 pipes, 1 pump)', tl.length === ours.links.length && tl.every((l) => ol[lAlias(l.id)]), tl.length + ' vs ' + ours.links.length);
	// Every attribute.
	const diffs = [];
	const NODE_FIELDS = ['elev', 'demand', 'head', 'level', 'minLevel', 'maxLevel', 'diameter', 'minVol', 'x', 'y'];
	const LINK_FIELDS = ['length', 'diameter', 'roughness', 'k', 'status', 'setting', 'speed'];
	let compared = 0;
	tn.forEach((n) => {
		const o = on[nAlias(n.id)];
		if (!o) { return; }
		if (o.type !== n.type) { diffs.push(n.id + ' type ' + o.type + ' vs ' + n.type); }
		NODE_FIELDS.forEach((f) => {
			if (n[f] === undefined && o[f] === undefined) { return; }
			compared++;
			const a = o[f], b = n[f];
			// Coordinates: WaterGEMS's export prints two decimals; the database holds more.
			const tol = (f === 'x' || f === 'y') ? 0.006 : null;
			const same = (typeof a === 'number' && typeof b === 'number') ? (tol ? Math.abs(a - b) <= tol : close(a, b)) : a === b;
			if (!same) { diffs.push(n.id + ' ' + f + ' ' + a + ' vs ' + b); }
		});
	});
	tl.forEach((l) => {
		const o = ol[lAlias(l.id)];
		if (!o) { return; }
		if (o.type !== l.type) { diffs.push(l.id + ' type ' + o.type + ' vs ' + l.type); }
		if (nAlias(l.from) !== o.from) { diffs.push(l.id + ' from ' + o.from + ' vs ' + l.from); }
		if (nAlias(l.to) !== o.to) { diffs.push(l.id + ' to ' + o.to + ' vs ' + l.to); }
		LINK_FIELDS.forEach((f) => {
			if (l[f] === undefined && o[f] === undefined) { return; }
			compared++;
			let a = o[f], b = l[f];
			if (f === 'speed') { a = a === undefined ? 1 : a; b = b === undefined ? 1 : b; }
			const same = (typeof a === 'number' && typeof b === 'number') ? close(a, b) : String(a) === String(b);
			if (!same) { diffs.push(l.id + ' ' + f + ' ' + a + ' vs ' + b); }
		});
	});
	// The parser reads a check valve as an open pipe and reports it (this page has no check-valve
	// pipe), so the Status column is compared as written.
	const rawStatus = (text) => Object.fromEntries(section(text, 'PIPES').map((t) => [t[0], (t[7] || '').toUpperCase()]));
	const os = rawStatus(r.inp), ts = rawStatus(fs.readFileSync(inpFile, 'utf8'));
	Object.keys(ts).forEach((id) => {
		if (THEIRS_ONLY.links.indexOf(id) >= 0 || os[lAlias(id)] === undefined) { return; }
		compared++;
		if (os[lAlias(id)] !== ts[id]) { diffs.push(id + ' Status ' + os[lAlias(id)] + ' vs ' + ts[id]); }
	});
	console.log('       ' + compared + ' attribute values compared; differences:');
	diffs.forEach((d) => console.log('         ' + d));
	// The differences there are, each with its reason (dev/sqlite-reader.md):
	//   U1-B to T01: the export routes it to the inlet construction;
	//   U1-B Status CV vs Open: the database states a check valve on U1-B; the export drops it beside a pump;
	//   T01 diameter 3.048 vs 0.3048: a tank with a volume curve, where EPANET ignores the diameter; the
	//   database's circular diameter is 10 ft and the export writes 1 ft.
	//   3 and 4 x and y: this sample's export draws the pump's two junctions apart; Tom's WaterGEMS (WTG-tgh-1,
	//   2026-10-21) draws them on top of each other at the pump node, and so does the reader.
	const EXPECTED = ['4 to T01 vs 2', '4 Status CV vs OPEN', 'T01 diameter 3.048 vs 0.304800000001219'];
	const unexpected = diffs.filter((d) => EXPECTED.indexOf(d) < 0 && !/^[34] [xy] /.test(d));
	ok('no difference beyond the explained ones', unexpected.length === 0, unexpected.join('; '));
	ok('the pattern-free file has the clock-time control', /LINK P1 CLOSED AT CLOCKTIME 4:00 PM/.test(r.inp));
	// The solve: both files at time zero.
	const a = await epanetSolve(r.inp), b = await epanetSolve(fs.readFileSync(inpFile, 'utf8'));
	let worstH = 0, worstQ = 0, nh = 0, nq = 0, whereH = '', whereQ = '';
	Object.keys(b.heads).forEach((id) => {
		const o = a.heads[nAlias(id)];
		if (o === undefined || THEIRS_ONLY.nodes.indexOf(id) >= 0) { return; }
		nh++;
		if (Math.abs(o - b.heads[id]) > worstH) { worstH = Math.abs(o - b.heads[id]); whereH = id; }
	});
	Object.keys(b.flows).forEach((id) => {
		const o = a.flows[lAlias(id)];
		if (o === undefined || THEIRS_ONLY.links.indexOf(id) >= 0) { return; }
		nq++;
		if (Math.abs(o - b.flows[id]) > worstQ) { worstQ = Math.abs(o - b.flows[id]); whereQ = id; }
	});
	console.log('       heads compared ' + nh + ', largest difference ' + worstH.toExponential(2) + ' m (' + whereH + '); flows ' + nq + ', largest ' + worstQ.toExponential(2) + ' L/s (' + whereQ + ')');
	ok('heads within 1 mm and flows within 0.01 L/s at time zero', worstH <= 1e-3 && worstQ <= 0.01);
	ok('the database file is unchanged', Buffer.compare(bytes, fs.readFileSync(dbFile)) === 0);
	db.close();

	// The child-scenario model.
	const wd = path.join(SAMPLES, 'WaterGems model', 'Badapokharan_MBR_withdrwal capacity curve.wtg.sqlite');
	if (fs.existsSync(wd)) {
		const db2 = await EC.lpnSqliteOpen(fs.readFileSync(wd));
		const r2 = EC.lpnWtgRead(db2, { display });
		ok('withdrawal model reads; Base plus Scenario - 1 and Scenario - 2', r2.ok && r2.scenarios.map((s) => s.name).join() === 'Scenario - 1,Scenario - 2');
		ok('neither overrides anything (the sample\'s child inherits every alternative)', r2.scenarios.every((s) => !Object.keys(s.overrides).length));
		ok('Scenario - 2 has no parent in the file, and the report says so', (noteOf(r2, 'wtg-scenario-root') || { ids: [] }).ids.join() === 'Scenario - 2');
		const a1 = r2.alternatives.filter((x) => x.name === 'Alternative 1')[0];
		ok('the unused "Alternative 1" carries its own P1 length, 902 m (Base: 882)', a1 && a1.root && a1.values['l:P1'] && a1.values['l:P1'].length === 902, JSON.stringify(a1 && a1.values['l:P1']));
		ok('R-2 head pattern carried', /R-2\s+1\s+Reservoir_Pattern_-_1/.test(r2.inp));
		db2.close();
	}
}

(async function () {
	await synthetic();
	await samples();
	console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
