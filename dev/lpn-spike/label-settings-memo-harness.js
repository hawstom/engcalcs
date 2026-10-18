// The label pass reads each scenario-aware setting once (labelPassMemo in js/looped-network.js).
// Asserts (1) the layout fingerprint is IDENTICAL with the memo and without it, on Net3, Novato
// and the 600-junction downtown fixture at 1x/2x/4x, Base and a scenario holding a coordinate
// override and a label setting; (2) a setting changed between two passes is read fresh by the
// second. Without it = the same page with the memo's one arming line removed (loadLoopedNetwork's
// mutate hook), run in a child process so the two pages never share globals.
//   node dev/lpn-spike/label-settings-memo-harness.js            (assert)
//   N600_FILE=/path.lwn node ...                                  (extra downtown scene)
//   TIME=1 node ...                                               (also print median pass ms)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..', '..');
const OFF = process.env.MEMO_CHILD === 'off', CHILD = !!process.env.MEMO_CHILD;
const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const SCENES = [
	{ name: 'Net3', file: ROOT + '/dev/water-network-examples/Net3.lwn', view: 'fit', mults: [1, 2, 4] },
	{ name: 'Novato', file: ROOT + '/dev/water-network-examples/Net3-Novato-CA-World.lwn', view: 'fit', mults: [1, 2, 4] },
	{ name: 'n600', file: ROOT + '/dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn', view: 'density', mults: [1, 2, 4] }
];
if (process.env.N600_FILE) { SCENES.push({ name: 'n600b', file: process.env.N600_FILE, view: 'density', mults: [1, 2, 4] }); }

async function child() {
	const stub = require(ROOT + '/dev/lpn-spike/lpn-dom-stub.js');
	const { loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
	setUnitSet('us');
	await warmEpanet();
	const out = [];
	for (const sc of SCENES) {
		const L = loadLoopedNetwork(
			"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
			"\t\t\tworld = el('g', {}, svg);\n" +
			"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
			"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
			"\t\t\tmodelLayer = el('g', {}, world);\n" +
			"\t\t\tlinksLayer = el('g', {}, modelLayer); linkSymbolLayer = el('g', {}, modelLayer);\n" +
			"\t\t\tnodesLayer = el('g', {}, modelLayer);\n" +
			"\t\t\tlabelsLayer = el('g', {}, world);\n" +
			"\t\t\trubberBandEl = el('line', {}, world); },\n" +
			"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
			"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
			"\t\tsetView: function (v) { return applyView(v); },\n" +
			"\t\tzoomExtent: function () { return zoomExtent(true); },\n" +
			"\t\tstate: function () { return state; },\n" +
			"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
			"\t\trefreshLabelText: refreshLabelText,\n" +
			"\t\tlabelSettings: function () { return labelSettings; },\n" +
			"\t\tsettings: function () { return settings; },\n" +
			"\t\tnodeAt: nodeAt, setProp: setProp, coordOverridesOf: coordOverridesOf,\n" +
			"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
			"\t\tsetScenarioSetting: setScenarioSetting,\n" +
			"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; }",
			null, OFF ? (s) => s.replace('\t\tlabelPassMemo = {};\n', '') : undefined
		);
		L.buildLayers(); L.setCanvas(1400, 900);
		const saved = JSON.parse(fs.readFileSync(sc.file, 'utf8'));
		saved.settings = saved.settings || {}; saved.settings.labelMaxWidth = null;
		L.applySaved(saved); L.buildDom(); L.noteMapSized();
		const ls = L.labelSettings();
		Object.keys(ls.node).forEach(k => { ls.node[k] = NODE_FIELDS.indexOf(k) >= 0; });
		Object.keys(ls.link).forEach(k => { ls.link[k] = LINK_FIELDS.indexOf(k) >= 0; });
		L.settings().engine = 'epanet';
		L.runSolve(); await settleEpanet();
		const doc = L.getDoc();
		const pts = doc.nodes.filter(n => n.type !== 'reservoir').map(n => L.nodeAt(n));
		let cx = 0, cy = 0, s1;
		if (sc.view === 'fit') { L.zoomExtent(); s1 = L.state().s; pts.forEach(p => { cx += p.x; cy += p.y; }); cx /= pts.length; cy /= pts.length; }
		else {
			let gx = 0, gy = 0; pts.forEach(p => { gx += p.x; gy += p.y; }); gx /= pts.length; gy /= pts.length;
			let cen = pts[0]; pts.forEach(p => { if (Math.hypot(p.x - gx, p.y - gy) < Math.hypot(cen.x - gx, cen.y - gy)) { cen = p; } });
			const nn = pts.map((p, i) => { let b = Infinity; pts.forEach((q, j) => { if (j !== i) b = Math.min(b, Math.hypot(q.x - p.x, q.y - p.y)); }); return b; }).sort((a, b) => a - b);
			s1 = 28 / nn[Math.floor(nn.length / 2)]; cx = cen.x; cy = cen.y;
		}
		const shown = h => !!h && !!h.text && h.text.style.visibility !== 'hidden';
		const sig = () => {
			const parts = [], nodeEls = L.nodeEls(), linkEls = L.linkEls();
			doc.nodes.forEach(n => { const e = nodeEls[n.id]; if (!e) return; parts.push('n' + n.id + ':' + shown(e) + ':' + (e.nudge ? e.nudge.x.toFixed(6) + ',' + e.nudge.y.toFixed(6) : '') + ':' + (e.lines || []).join('/')); });
			doc.links.forEach(l => { const e = linkEls[l.id]; if (!e) return; parts.push('l' + l.id + ':' + shown(e) + ':' + (e.nudge ? e.nudge.x.toFixed(6) + ',' + e.nudge.y.toFixed(6) : '') + ':' + (e.lines || []).join('/')); });
			return crypto.createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 12);
		};
		const reps = Number(process.env.REPS || 5), rec = { scene: sc.name, base: [], scn: [], ms: [] };
		const pass = () => { const t0 = process.hrtime.bigint(); L.refreshLabelText(); return Number(process.hrtime.bigint() - t0) / 1e6; };
		for (const m of sc.mults) {
			L.setView({ cx: cx, cy: cy, s: s1 * m });
			const ts = []; for (let r = 0; r < (process.env.TIME ? reps : 1); r++) { ts.push(pass()); }
			ts.sort((a, b) => a - b); rec.ms.push(+ts[Math.floor(ts.length / 2)].toFixed(1));
			rec.base.push(sig());
		}
		// A non-Base scenario: a coordinate override on 15 nodes and a scenario label setting.
		const scn = L.createScenario('Memo');
		L.switchScenario(scn.id);
		const moved = doc.nodes.filter(n => n.type !== 'reservoir').slice(0, 15);
		moved.forEach(n => { L.setProp(n, 'x', n.x + 3 * (n.id.length + 1)); });
		rec.overrides = moved.filter(n => L.coordOverridesOf(n)).length;
		L.setScenarioSetting(scn, ['labelSettings', 'node', 'head'], true);
		for (const m of sc.mults) { L.setView({ cx: cx, cy: cy, s: s1 * m }); L.refreshLabelText(); rec.scn.push(sig()); }
		// Fresh read: change a scenario label setting between passes; the second must show it.
		L.setView({ cx: cx, cy: cy, s: s1 * 4 });
		L.refreshLabelText(); const before = sig();
		L.setScenarioSetting(scn, ['labelSettings', 'node', 'head'], false);
		L.refreshLabelText(); const after = sig();
		L.setScenarioSetting(scn, ['labelSettings', 'node', 'head'], true);
		L.refreshLabelText(); const again = sig();
		rec.fresh = { before, after, again };
		out.push(rec);
	}
	console.log('RESULT ' + JSON.stringify(out));
}

function run(mode) {
	const r = cp.spawnSync(process.execPath, [__filename], { env: Object.assign({}, process.env, { MEMO_CHILD: mode }), encoding: 'utf8', maxBuffer: 1 << 26 });
	const line = (r.stdout || '').split('\n').find(l => l.startsWith('RESULT '));
	if (!line) { console.error(r.stdout, r.stderr); process.exit(1); }
	return JSON.parse(line.slice(7));
}

if (CHILD) { child().catch(e => { console.error(e); process.exit(1); }); }
else {
	const on = run('on'), off = run('off');
	let bad = 0;
	const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) { bad++; } };
	on.forEach((a, i) => {
		const b = off[i];
		check(JSON.stringify(a.base) === JSON.stringify(b.base), a.scene + ' Base fingerprint identical at 1x/2x/4x ' + a.base.join(','));
		check(JSON.stringify(a.scn) === JSON.stringify(b.scn), a.scene + ' scenario (coord override + label setting) identical ' + a.scn.join(','));
		check(a.overrides > 0, a.scene + ' scenario really holds coordinate overrides (' + a.overrides + ')');
		check(a.fresh.before !== a.fresh.after && a.fresh.before === a.fresh.again && JSON.stringify(a.fresh) === JSON.stringify(b.fresh),
			a.scene + ' setting changed between passes is read fresh (off/on differs, restored matches)');
		if (process.env.TIME) { console.log('     ms memo ' + a.ms.join('/') + ' vs none ' + b.ms.join('/')); }
	});
	console.log(bad ? 'FAILED' : 'PASS');
	process.exit(bad ? 1 : 0);
}
