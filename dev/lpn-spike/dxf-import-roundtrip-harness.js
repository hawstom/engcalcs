// FILE > IMPORT > NETWORK > DXF FILE, THE ROUND TRIP (ROADMAP Task 772, import slice 1), in a real
// Chrome, through the real menu rows, the real file chooser and the real receipt.
//
//   node dev/lpn-spike/dxf-import-roundtrip-harness.js
//
// The builder's note (dev/dxf-interface.md): "the Interface Manager's import should read exactly
// what this export writes, and the round trip (export, import, byte-identical model) is its first
// harness". So, for Net1, Net2, Net3 (the gallery examples) and a project with a pump, a PRV, a
// tank and three customers: export the .inp from the open model, export the DXF with the page's own
// export, import that DXF as a new project, export the .inp of the imported project, and compare the
// two .inp files. Every node and link must be there with the same ID, ends, bends and coordinates,
// and every property the DXF carries must come back in the characters it was written in. What the
// DXF cannot carry (patterns, curves, controls, options, ...) must be LISTED by the receipt, never
// dropped in silence, and the harness asserts the receipt says so.
//
// Also: one foreign layer and one unknown attribute tag produce exactly those two lines (besides the
// receipt's standing "not held" line); an alternative other than BASE is reported and not read; a
// drawing exported in another language is read back in this one.
//
// The reader alone, with no browser: dxf-import-reader-harness.js.
'use strict';
const { serveLatLonNet3 } = require('./latlon-net3-route.js');

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DXF_IMPORT_RT_LOCKED';
const NAME = 'dxf-import-roundtrip-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   ' + detail));
}

// ---- the .inp, read by a reader written here ---------------------------------------------------
function parseInp(text) {
	const S = {};
	let cur = null;
	text.split(/\r?\n/).forEach((raw) => {
		const m = /^\s*\[([A-Z]+)\]/.exec(raw);
		if (m) { cur = m[1]; S[cur] = S[cur] || []; return; }
		const line = raw.replace(/;.*$/, '').trim();
		if (!cur || !line) { return; }
		S[cur].push(line.split(/\s+/));
	});
	return S;
}
const byId = (rows) => { const o = {}; (rows || []).forEach((r) => { o[r[0]] = r; }); return o; };
const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
// An element's total base demand: its row in [JUNCTIONS] and every row of [DEMANDS] (a customer's
// demand is written there), so a junction compares the same whichever way it was split.
function demandOf(S) {
	const out = {};
	(S.JUNCTIONS || []).forEach((r) => { out[r[0]] = +r[2] || 0; });
	(S.DEMANDS || []).forEach((r) => { if (r[0] in out) { out[r[0]] += +r[1] || 0; } });
	return out;
}
// Compare two .inp files on everything the DXF carries. Returns a list of differences.
function compareInp(A, B, opts) {
	opts = opts || {};
	const bad = [];
	// A pump with no curve is written by the page as a short pipe (a DXF file holds no pump curve), so a
	// pump of the original that is a pipe of the other file counts as the pump it is: same ID, same ends.
	B = Object.assign({}, B, { PIPES: (B.PIPES || []).slice(), PUMPS: (B.PUMPS || []).slice() });
	(A.PUMPS || []).forEach((r) => {
		const k = B.PIPES.findIndex((q) => q[0] === r[0] && !B.PUMPS.some((p) => p[0] === r[0]));
		if (k >= 0) { B.PUMPS.push(B.PIPES.splice(k, 1)[0].slice(0, 3)); }
	});
	const same = (name, cols) => {
		const a = byId(A[name]), b = byId(B[name]);
		Object.keys(a).forEach((id) => {
			if (!b[id]) { bad.push(name + ' ' + id + ' is missing from the imported model'); return; }
			cols.forEach((c) => { if (a[id][c] !== b[id][c]) { bad.push(name + ' ' + id + ' column ' + c + ': ' + a[id][c] + ' became ' + b[id][c]); } });
		});
		Object.keys(b).forEach((id) => { if (!a[id]) { bad.push(name + ' ' + id + ' is in the imported model and not in the original'); } });
	};
	same('RESERVOIRS', [1]);
	same('TANKS', [1, 2, 3, 4, 5]);
	same('PIPES', [1, 2, 3, 4, 5]);
	same('PUMPS', [1, 2]);
	same('VALVES', [1, 2, 3, 4, 5]);
	// Junctions: the elevation as typed; the demand as the total, as a number (a junction with several
	// categories, or a customer, is written as the sum).
	{
		const a = byId(A.JUNCTIONS), b = byId(B.JUNCTIONS), da = demandOf(A), db = demandOf(B);
		Object.keys(a).forEach((id) => {
			if (!b[id]) { bad.push('JUNCTIONS ' + id + ' is missing from the imported model'); return; }
			if (a[id][1] !== b[id][1]) { bad.push('JUNCTIONS ' + id + ' elevation: ' + a[id][1] + ' became ' + b[id][1]); }
			if (!near(da[id], db[id])) { bad.push('JUNCTIONS ' + id + ' demand: ' + da[id] + ' became ' + db[id]); }
		});
		Object.keys(b).forEach((id) => { if (!a[id]) { bad.push('JUNCTIONS ' + id + ' is in the imported model and not in the original'); } });
	}
	{
		const a = byId(A.COORDINATES), b = byId(B.COORDINATES);
		Object.keys(a).forEach((id) => {
			if (!b[id]) { bad.push('COORDINATES ' + id + ' missing'); return; }
			if (!near(+a[id][1], +b[id][1]) || !near(+a[id][2], +b[id][2])) { bad.push('COORDINATES ' + id + ': ' + a[id][1] + ' ' + a[id][2] + ' became ' + b[id][1] + ' ' + b[id][2]); }
		});
		const va = {}, vb = {};
		(A.VERTICES || []).forEach((r) => { (va[r[0]] = va[r[0]] || []).push(r); });
		(B.VERTICES || []).forEach((r) => { (vb[r[0]] = vb[r[0]] || []).push(r); });
		Object.keys(va).forEach((id) => {
			const x = va[id], y = vb[id] || [];
			if (x.length !== y.length || !x.every((r, i) => near(+r[1], +y[i][1]) && near(+r[2], +y[i][2]))) { bad.push('VERTICES of link ' + id + ' differ'); }
		});
		Object.keys(vb).forEach((id) => { if (!va[id]) { bad.push('VERTICES: the imported link ' + id + ' has bends the original does not'); } });
	}
	if (A.OPTIONS && B.OPTIONS) {
		const u = (S) => (S.OPTIONS.find((r) => /^Units$/i.test(r[0])) || [])[1];
		if (u(A) !== u(B)) { bad.push('Units: ' + u(A) + ' became ' + u(B)); }
	}
	return bad;
}

// ---- the page ----------------------------------------------------------------------------------
async function open(browser, lang, latlon) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, acceptDownloads: true, serviceWorkers: 'block' });
	if (latlon) { await serveLatLonNet3(a.page); }
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : ''));
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}
async function closeDialogs(a) {
	for (let i = 0; i < 4; i++) {
		const d = await a.dialog();
		if (!d) { return; }
		await a.dialogClick(d.buttons[d.buttons.length - 1]);
	}
}
// One export, as bytes: the File > Export row named by a language key.
async function exportVia(a, itemKey) {
	const downloads = [], onDl = (d) => downloads.push(d);
	a.page.on('download', onDl);
	await a.page.keyboard.press('Escape');
	await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang(itemKey), 'file');
	const t0 = Date.now();
	while (!downloads.length && Date.now() - t0 < 15000) { await a.page.waitForTimeout(200); }
	await a.page.waitForTimeout(500);
	a.page.off('download', onDl);
	await closeDialogs(a);
	if (!downloads.length) { return null; }
	const p = await downloads[0].path();
	return p ? fs.readFileSync(p) : null;
}
async function importDxf(a, name, buffer) {
	await a.page.keyboard.press('Escape');
	const [chooser] = await Promise.all([
		a.page.waitForEvent('filechooser', { timeout: 10000 }),
		a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_dxfnet'), 'file', 'lpn_calib_network')
	]);
	await chooser.setFiles({ name: name, mimeType: 'application/dxf', buffer: buffer });
	const d = await a.waitDialog(8000).catch(() => null);
	const items = d ? await a.page.$$eval('#lpn_dxfnet_report li', (ls) => ls.map((li) => ({ code: li.getAttribute('data-code'), text: li.textContent }))) : [];
	return { dialog: d, items: items };
}
const stored = (a) => a.page.evaluate(() => {
	const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
	return { id: idx.openId, count: (idx.projects || []).length, doc: JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null') };
});

// A project with a pump, a PRV, a tank and three customers: Net1, with pipe 122 made a PRV.
function everythingProject() {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	const lk = (id) => d.links.find((l) => l.id === id);
	Object.assign(lk('122'), { type: 'valve', valveType: 'PRV', _setting: 45, _status: 'open', _length: 0 });
	d.customers = [
		{ id: 'M1', demand: 12.5, count: 3, link: '111', t: 0.5, x: 3, y: 3, desc: 'Main Street school', tag: 'inst' },
		{ id: 'M2', demand: 4, count: 1, link: '10', t: 0, x: 2, y: -2 },
		{ id: 'M3', demand: 7.25, count: 2, link: null, x: 25, y: 60, desc: 'Loose farm' }
	];
	d.project.name = 'Everything';
	return JSON.stringify(d);
}

// The same list of things the receipt must always name: the page's own sentence.
async function notHeldText(a) { return a.page.evaluate(() => (window.EngCalcs.pageConfig || {}).lpn_dxfnet_note_not_held); }

async function roundTrip(browser, label, how) {
	console.log('\n--- ' + label + ' ---');
	const a = await open(browser);
	if (how.card) { await a.openExampleCard(await a.lang(how.card)); }
	else {
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_everything', txt); }, everythingProject());
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
	}
	const before = await stored(a);
	const inpA = (await exportVia(a, 'lpn_file_export_item_inp')).toString('utf8');
	const dxf = await exportVia(a, 'lpn_file_export_item_dxf');
	ok(label + ': the page exports an .inp and a DXF', !!inpA && inpA.length > 100 && !!dxf && dxf.length > 1000);
	const imp = await importDxf(a, 'roundtrip.dxf', dxf);
	ok(label + ': the receipt opens, headed with the file name', !!imp.dialog && imp.dialog.text.indexOf((await a.lang('lpn_inp_report_heading')).replace('{file}', 'roundtrip.dxf')) === 0, imp.dialog && imp.dialog.text.slice(0, 100));
	const held = await notHeldText(a);
	const codes = imp.items.map((i) => i.code);
	ok(label + ': the receipt lists what a DXF cannot carry (patterns, curves, controls, options), by the page\'s own sentence',
		imp.items.some((i) => i.code === 'not-in-dxf' && i.text === held) && /patterns, curves, controls, rules, time settings, EPANET options/.test(held), JSON.stringify(codes));
	const pumps = (before.doc.links || []).filter((l) => l.type === 'pump').map((l) => l.id);
	ok(label + ': and nothing else is reported for the page\'s own file, except the pumps, which have no curve in a DXF file',
		codes.every((c) => c === 'not-in-dxf' || c === 'pump-no-curve') && (codes.indexOf('pump-no-curve') >= 0) === (pumps.length > 0), JSON.stringify(imp.items.map((i) => i.text.slice(0, 120))));
	if (pumps.length) {
		const pc = imp.items.find((i) => i.code === 'pump-no-curve');
		ok(label + ': ...naming each pump (' + pumps.join(', ') + ')', !!pc && pumps.every((id) => pc.text.indexOf(id) > 0), pc && pc.text);
	}
	if (imp.dialog) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
	const after = await stored(a);
	ok(label + ': a NEW project, named after the file, is the open one', after.count === before.count + 1 && after.id !== before.id && after.doc.project.name === 'roundtrip', JSON.stringify(after.doc && after.doc.project));
	const tabs = await a.tabs();
	ok(label + ': its tab is the current one', tabs.some((t) => t.current && t.label.indexOf('roundtrip') >= 0), JSON.stringify(tabs.map((t) => t.label)));
	const inpB = (await exportVia(a, 'lpn_file_export_item_inp')).toString('utf8');
	const A = parseInp(inpA), B = parseInp(inpB);
	const bad = compareInp(A, B);
	const kindOf = (d) => { const o = {}; d.nodes.concat(d.links).forEach((e) => { o[(e.from ? 'L' : 'N') + e.id] = e.type + (e.from ? ' ' + e.from + '-' + e.to : ''); }); return o; };
	{
		const ka = kindOf(before.doc), kb = kindOf(after.doc), diff = Object.keys(ka).filter((k) => ka[k] !== kb[k]);
		ok(label + ': every element is the same kind, a pump still a pump, with the same ends (' + Object.keys(ka).length + ')', diff.length === 0 && Object.keys(kb).length === Object.keys(ka).length, diff.slice(0, 5).map((k) => k + ': ' + ka[k] + ' / ' + kb[k]).join('; '));
	}
	const nElem = ['JUNCTIONS', 'RESERVOIRS', 'TANKS', 'PIPES', 'PUMPS', 'VALVES'].reduce((n, s) => n + (A[s] || []).length, 0);
	ok(label + ': every node and link (' + nElem + ') is back with the same ID, ends, bends, coordinates and properties', bad.length === 0, '\n     ' + bad.slice(0, 8).join('\n     ') + (bad.length > 8 ? '\n     and ' + (bad.length - 8) + ' more' : ''));
	{
		const n = (S, k) => (S[k] || []).length, links = (S) => n(S, 'PIPES') + n(S, 'PUMPS') + n(S, 'VALVES');
		ok(label + ': the same count of nodes of each kind, and of links (a pump with no curve is written as a pipe)',
			['JUNCTIONS', 'RESERVOIRS', 'TANKS'].every((k) => n(A, k) === n(B, k)) && links(A) === links(B),
			['JUNCTIONS', 'RESERVOIRS', 'TANKS'].map((k) => k + ' ' + n(A, k) + '/' + n(B, k)).join(', ') + '; links ' + links(A) + '/' + links(B));
	}
	const u = await a.page.evaluate(() => { const o = {}; ['lpn_u_length', 'lpn_u_diameter', 'lpn_u_elevhead', 'lpn_u_flow', 'lpn_u_pressure'].forEach((n) => { o[n] = document.querySelector('select[name="' + n + '"]').value; }); return o; });
	ok(label + ': the units strip shows the file\'s units', JSON.stringify(u) === JSON.stringify({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o', lpn_u_flow: 'gpm', lpn_u_pressure: 'psi' }), JSON.stringify(u));
	if (how.customers) {
		const cs = (after.doc.customers || []).map((c) => c.id).sort().join();
		ok(label + ': the three customers are in the new project, M1 and M2 on their pipes and M3 loose', cs === 'M1,M2,M3' &&
			after.doc.customers.find((c) => c.id === 'M1').link === '111' && after.doc.customers.find((c) => c.id === 'M2').link === '10' && !after.doc.customers.find((c) => c.id === 'M3').link, JSON.stringify(after.doc.customers));
		const m1 = after.doc.customers.find((c) => c.id === 'M1');
		ok(label + ': M1 keeps its demand, count, tag and description as typed', m1.demand === 12.5 && m1.count === 3 && m1.tag === 'inst' && m1.desc === 'Main Street school', JSON.stringify(m1));
		ok(label + ': the junction demands in the .inp include the customers\' (compared above as totals)', (A.DEMANDS || []).length > 0 && (B.DEMANDS || []).length > 0, 'original ' + (A.DEMANDS || []).length + ', imported ' + (B.DEMANDS || []).length);
		// And the drawing again: a second export of the imported project has the same customers' blocks.
		const dxf2 = (await exportVia(a, 'lpn_file_export_item_dxf')).toString('latin1');
		const ids = (t) => (t.match(/\r?\n  1\r?\n(M[123])\r?\n/g) || []).length;
		ok(label + ': exported again, the customers\' blocks are written again', ids(dxf2) >= 3 && ids(dxf.toString('latin1')) >= 3, ids(dxf2) + ' / ' + ids(dxf.toString('latin1')));
	}
	ok(label + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
	return { dxf: dxf, inp: inpA };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	let net1;
	try {
		net1 = await roundTrip(browser, 'Net1', { card: 'lpn_ex_net1_title' });
		await roundTrip(browser, 'Net2', { card: 'lpn_ex_net2_title' });
		await roundTrip(browser, 'Net3', { card: 'lpn_ex_net3_title' });
		await roundTrip(browser, 'Net1 with a PRV and customers', { custom: true, customers: true });

		console.log('\n--- a latitude-and-longitude project: UTM metres, opened as a projected project ---');
		{
			const a = await open(browser, null, true);
			await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
			const inpA = (await exportVia(a, 'lpn_file_export_item_inp')).toString('utf8');
			const dxf = await exportVia(a, 'lpn_file_export_item_dxf');
			const code = (/EPSG:(\d+)/.exec(dxf.toString('latin1')) || [])[1];
			ok('the export states its coordinate system in the read-me (a WGS 84 UTM zone)', /^326\d\d$/.test(code || ''), String(code));
			const imp = await importDxf(a, 'utm.dxf', dxf);
			ok('the receipt does not mention a coordinate-unit mismatch or an unknown system', !imp.items.some((i) => i.code === 'coord-unit' || i.code === 'crs-unknown'), JSON.stringify(imp.items.map((i) => i.code)));
			if (imp.dialog) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
			const after = await stored(a);
			ok('every node and link is there (Net3: 97 nodes, 119 links)', after.doc.nodes.length === 97 && after.doc.links.length === 119, after.doc.nodes.length + ' / ' + after.doc.links.length);
			ok('it is a projected project in that system, not a grid and not on the Earth', after.doc.project.crs === 'EPSG:' + code && after.doc.project.coords !== 'geo', JSON.stringify(after.doc.project));
			const inpB = (await exportVia(a, 'lpn_file_export_item_inp')).toString('utf8');
			const A = parseInp(inpA), B = parseInp(inpB);
			const res = await a.page.evaluate(([code, ca, cb, va, vb, pa, pb]) => {
				const C = 'EPSG:' + code, E = window.EngCalcs, fwd = (r) => E.lpnCrsForward(C, { lon: +r[1], lat: +r[2] });
				const R = 6371008.8, rad = Math.PI / 180;
				const hav = (p, q) => { const dl = (q.lat - p.lat) * rad, dn = (q.lon - p.lon) * rad, h = Math.sin(dl / 2) ** 2 + Math.cos(p.lat * rad) * Math.cos(q.lat * rad) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
				return new Promise((resolve) => E.lpnCrsLoad(() => {
					const B = {}; cb.forEach((r) => { B[r[0]] = r; });
					let worst = 0, missing = 0;
					const LA = {}, LB = {};
					ca.forEach((r) => { const f = fwd(r), q = B[r[0]]; if (!q) { missing++; return; } worst = Math.max(worst, Math.hypot(f.x - +q[1], f.y - +q[2])); LA[r[0]] = { lon: +r[1], lat: +r[2] }; const ll = E.lpnCrsInverse(C, { x: +q[1], y: +q[2] }); LB[r[0]] = ll; });
					// geodesic length of each pipe along its end nodes and bends, from the original positions and from the imported ones
					const vertsA = {}, vertsB = {};
					va.forEach((r) => { (vertsA[r[0]] = vertsA[r[0]] || []).push({ lon: +r[1], lat: +r[2] }); });
					vb.forEach((r) => { (vertsB[r[0]] = vertsB[r[0]] || []).push(E.lpnCrsInverse(C, { x: +r[1], y: +r[2] })); });
					let worstLen = 0, n = 0;
					pa.forEach((p) => {
						const q = pb.find((x) => x[0] === p[0]); if (!q) { return; }
						const la = [LA[p[1]]].concat(vertsA[p[0]] || [], [LA[p[2]]]), lb = [LB[q[1]]].concat(vertsB[p[0]] || [], [LB[q[2]]]);
						let da = 0, db = 0; for (let i = 0; i + 1 < la.length; i++) { da += hav(la[i], la[i + 1]); db += hav(lb[i], lb[i + 1]); }
						worstLen = Math.max(worstLen, Math.abs(da - db)); n++;
					});
					resolve({ worst: worst, missing: missing, worstLen: worstLen, pipes: n });
				}));
			}, [code, A.COORDINATES, B.COORDINATES, A.VERTICES || [], B.VERTICES || [], A.PIPES, B.PIPES]);
			ok('every node lands within 0.01 m of its original position projected to the same UTM zone (worst ' + res.worst.toFixed(5) + ' m)', res.missing === 0 && res.worst < 0.01, JSON.stringify(res));
			ok('the geodesic length of every pipe matches the original (' + res.pipes + ' pipes, worst difference ' + res.worstLen.toFixed(5) + ' m)', res.pipes === 117 && res.worstLen < 0.01, JSON.stringify(res));
			const bad = compareInp(A, B).filter((x) => x.indexOf('COORDINATES') !== 0 && x.indexOf('VERTICES') !== 0);
			ok('everything else the DXF carries is the same too', bad.length === 0, bad.slice(0, 5).join('; '));
			ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
			await a.close();
		}

		console.log('\n--- a foreign layer and an unknown attribute tag ---');
		{
			const a = await open(browser);
			let t = net1.dxf.toString('latin1');
			// One LINE on a layer that is not ours, appended to the ENTITIES section.
			const endEnts = t.indexOf('ENDSEC', t.indexOf('\r\nENTITIES\r\n'));
			t = t.slice(0, endEnts - 3) + '  0\r\nLINE\r\n  5\r\nFFF0\r\n  8\r\nWALLS\r\n 10\r\n0.0\r\n 20\r\n0.0\r\n 11\r\n1.0\r\n 21\r\n1.0\r\n' + t.slice(endEnts - 3);
			// One further attribute, tagged FOO_BAR, on the first junction's block (before its SEQEND).
			const seq = t.indexOf('  0\r\nSEQEND', t.indexOf('\r\nENTITIES\r\n'));
			const layer = /C-WATR-MODL-[A-Z]{4}-BASE/.exec(t.slice(t.indexOf('\r\nENTITIES\r\n')))[0];
			t = t.slice(0, seq) + '  0\r\nATTRIB\r\n  5\r\nFFF1\r\n330\r\n20\r\n100\r\nAcDbEntity\r\n  8\r\n' + layer + '\r\n100\r\nAcDbText\r\n 10\r\n0.0\r\n 20\r\n0.0\r\n 30\r\n0.0\r\n 40\r\n1.0\r\n  1\r\nxyz\r\n100\r\nAcDbAttribute\r\n  2\r\nFOO_BAR\r\n 70\r\n0\r\n' + t.slice(seq);
			const imp = await importDxf(a, 'stranger.dxf', Buffer.from(t, 'latin1'));
			const codes = imp.items.map((i) => i.code).filter((c) => c !== 'not-in-dxf' && c !== 'pump-no-curve').sort();
			ok('exactly two lines besides the standing one: the foreign layer and the unknown tag', codes.join() === 'layer-foreign,tag-unknown', JSON.stringify(imp.items.map((i) => i.code + ': ' + i.text)));
			const lf = imp.items.find((i) => i.code === 'layer-foreign'), tu = imp.items.find((i) => i.code === 'tag-unknown');
			ok('the foreign layer line names the layer and its one LINE', !!lf && lf.text.indexOf('WALLS (1 LINE)') > 0, lf && lf.text);
			ok('the unknown tag line names the tag', !!tu && tu.text.indexOf('FOO_BAR (1)') > 0, tu && tu.text);
			ok('...and the layer line begins with the page\'s own sentence, naming the prefix', !!lf && lf.text.indexOf((await a.page.evaluate(() => EngCalcs.pageConfig.lpn_dxfnet_note_layer_foreign)).replace('{prefix}', 'C-WATR-MODL-')) === 0, lf && lf.text);
			if (imp.dialog) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
			const after = await stored(a);
			ok('the network still came in whole (Net1: 11 nodes, 13 links)', after.doc.nodes.length === 11 && after.doc.links.length === 13, after.doc.nodes.length + ' / ' + after.doc.links.length);
			ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
			await a.close();
		}

		console.log('\n--- an alternative other than BASE is reported and not read ---');
		{
			const a = await open(browser);
			const t = net1.dxf.toString('latin1').split('C-WATR-MODL-TANK-BASE').join('C-WATR-MODL-TANK-FIRE');
			const imp = await importDxf(a, 'fire.dxf', Buffer.from(t, 'latin1'));
			const al = imp.items.find((i) => i.code === 'alternative'), no = imp.items.find((i) => i.code === 'end-no-node');
			ok('the receipt names the layer that states another alternative, with what is on it', !!al && /C-WATR-MODL-TANK-FIRE \(\d+ INSERT\)/.test(al.text), al && al.text);
			ok('the links that ended at the unread tank are named, not dropped', !!no && /\(110\)/.test(no.text), no && no.text);
			if (imp.dialog) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
			const after = await stored(a);
			ok('the rest is imported (10 nodes; no tank)', after.doc.nodes.length === 10 && !after.doc.nodes.some((n) => n.type === 'tank'), String(after.doc.nodes.length));
			await a.close();
		}

		console.log('\n--- a drawing exported in German is read in English ---');
		{
			const g = await open(browser, 'de');
			await g.openExampleCard(await g.lang('lpn_ex_net1_title'));
			const deDxf = await exportVia(g, 'lpn_file_export_item_dxf');
			await g.close();
			const a = await open(browser);
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			const inpA = (await exportVia(a, 'lpn_file_export_item_inp')).toString('utf8');
			const imp = await importDxf(a, 'de.dxf', deDxf);
			const codes = imp.items.map((i) => i.code);
			ok('German tags are read: no attribute tag is reported unknown', codes.indexOf('tag-unknown') < 0 && codes.indexOf('layer-foreign') < 0, JSON.stringify(codes));
			// A unit is recorded as its symbol in the language of the page that exported, and this page
			// cannot know another language's symbols: it keeps its own units and SAYS which it did not know.
			const uu = imp.items.find((i) => i.code === 'unit-unknown');
			ok('...but the German unit symbols are not known here, and the receipt names them', !!uu && /GAL\/MIN/.test(uu.text), uu && uu.text);
			if (imp.dialog) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
			const inpB = (await exportVia(a, 'lpn_file_export_item_inp')).toString('utf8');
			const bad = compareInp(parseInp(inpA), parseInp(inpB));
			ok('...and the model comes back the same', bad.length === 0, '\n     ' + bad.slice(0, 6).join('\n     '));
			await a.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
