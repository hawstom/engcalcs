// HIS ORDER OF PREFERENCE, HELD END TO END (ROADMAP Task 539). Run with:
//
//   node dev/lpn-spike/label-drop-order-harness.js
//
// **TOM, 2026-09-22:** *"I am seeing dropping when I would have preferred to see longer leaders."*
// And, on one label of his own screenshot showing `P=55.70` alone at the end of a long leader with
// open ground beside it: *"a strange example where (a) we could have had all requested properties
// and (b) we could have had a shorter leader."*
//
// So the rungs, best first, are: the whole label near its node; the whole label on a LONGER LEADER;
// the label with a value given up; the label gone. Two of those were the wrong way round -- the
// value shed was triggered by the first-fit dropping a label, so it ran before the search was ever
// allowed to look further out, and the crossing shed at the bottom of the pass had no rung below it
// at all and could only hide. This drives the whole page -- a real document, a real EPANET solve so
// the demand and pressure rows exist, the real content pass -- FOUR times, as shipped and with each
// of the two new rungs mutated away through the stub's own source hook, and asserts that the
// shipped drawing beats both.
//
// **THE NUMBER THIS IS ABOUT IS HOW MANY LABELS GIVE A VALUE UP**, which no harness here counted
// against a comparison before. `hidden` rides beside it because the two trade against each other
// and a fix that spends labels to save lines is not what he asked for.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const FILE = 'Net3-Novato-CA-World.lwn';
// HIS OWN THREE, from the Symbology panel in the screenshot: ID, Demand, Pressure.
const FIELDS = (process.env.LPN_FIELDS || 'id,demand,pressure').split(',');
const ZOOMS = [2, 3];
// THE RATCHETS, measured 2026-09-22 on the shipped pass. Both MAY FALL and MAY NOT RISE; lower them
// when they fall. `shed` is how many drawn node labels are showing fewer values than the user asked
// for; `hidden` is how many are not drawn at all.
const CEILING = { 2: { shed: 18, hidden: 5 }, 3: { shed: 3, hidden: 1 } };

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// THE TWO MUTATIONS, each removing exactly one rung.
const MUTATE = {
	// The search never looks further out, so a label that does not fit is dropped and the value shed
	// is what rescues it -- the pass as it stood before his ruling.
	nowiden: function (src) {
		const from = 'var labelWidenSearch = true;';
		if (src.indexOf(from) < 0) { throw new Error('label-drop-order-harness: re-aim nowiden'); }
		return src.replace(from, 'var labelWidenSearch = false;');
	},
	// The crossing shed has no rung below it again: a label it would hide is simply hidden.
	nocross: function (src) {
		const from = '|| !shedNodeLabelsForCrossing(lastCrossingShed.hidden, nodeLabels, fsNow)) {';
		if (src.indexOf(from) < 0) { throw new Error('label-drop-order-harness: re-aim nocross'); }
		return src.replace(from, '|| !(false && shedNodeLabelsForCrossing(lastCrossingShed.hidden, nodeLabels, fsNow))) {');
	}
};

async function runChild(mode) {
	const stub = require('./lpn-dom-stub.js');
	stub.setUnitSet('us');
	const L = stub.loadLoopedNetwork(
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tmodelLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); },\n" +
		"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
		"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
		"\t\tsetView: function (v) { return applyView(v); },\n" +
		"\t\tzoomExtent: function () { return zoomExtent(true); },\n" +
		"\t\tscale: function () { return state.s; },\n" +
		"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tnodeEls: function () { return nodeEls; },\n" +
		"\t\tnodeAt: nodeAt, nodeLabelPos: nodeLabelPos, nodeLabelKey: nodeLabelKey",
		null, MUTATE[mode]);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples', FILE), 'utf8')));
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = FIELDS.indexOf(k) >= 0; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	await stub.warmEpanet();
	L.settings().engine = 'epanet';
	L.runSolve();
	await stub.settleEpanet();
	L.zoomExtent();
	const sFit = L.scale(), doc = L.getDoc(), nodeEls = L.nodeEls();
	// The southwest of the drawing, which is the ground his screenshot is of.
	let x0 = Infinity, y0 = -Infinity;
	doc.nodes.forEach(function (n) { const p = L.nodeAt(n); x0 = Math.min(x0, p.x); y0 = Math.max(y0, p.y); });
	const sw = doc.nodes.map(function (n) {
		const p = L.nodeAt(n);
		return { p: p, d: Math.hypot(p.x - x0, p.y - y0) };
	}).sort(function (a, b) { return a.d - b.d; }).slice(0, 20);
	let cx = 0, cy = 0;
	sw.forEach(function (s) { cx += s.p.x; cy += s.p.y; });
	cx /= sw.length; cy /= sw.length;

	const out = [];
	ZOOMS.forEach(function (z) {
		if (!L.setView({ cx: cx, cy: cy, s: sFit * z })) { return; }
		const t0 = process.hrtime.bigint();
		L.refreshLabelText();
		const ms = Number(process.hrtime.bigint() - t0) / 1e6;
		let total = 0, hidden = 0, shed = 0, lines = 0, wanted = 0, maxLead = 0;
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id];
			if (!ne || ne.empty || !ne.allLines) { return; }
			total++;
			wanted += ne.allLines.length;
			if (ne.hiddenDropped || ne.hiddenCrossed) { hidden++; return; }
			const kept = ne.lines ? ne.lines.length : 0;
			lines += kept;
			if (kept < ne.allLines.length) { shed++; }
			const a = L.nodeAt(n), e = L.nodeLabelPos(n);
			maxLead = Math.max(maxLead, Math.hypot(e.x - a.x, e.y - a.y));
		});
		out.push({ zoom: z, total: total, hidden: hidden, shed: shed, lines: lines,
			wanted: wanted, maxLead: maxLead, ms: ms });
	});
	return out;
}

function child(mode) {
	const r = spawnSync(process.execPath, [__filename, '--child', mode || 'ship'],
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 900000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

function main() {
	if (process.argv[2] === '--child') {
		runChild(process.argv[3] === 'ship' ? null : process.argv[3]).then(function (out) {
			process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		}, function (e) { console.error(e); process.exit(1); });
		return;
	}
	console.log('--- the order of preference: ' + FILE + ', node fields ' + FIELDS.join('+')
		+ ', southwest of the drawing ---');
	const ship = child('ship'), nowiden = child('nowiden'), nocross = child('nocross');
	if (ship.error || nowiden.error || nocross.error) {
		report(false, 'all three runs', ship.error || nowiden.error || nocross.error);
	} else {
		ship.forEach(function (a, i) {
			const b = nowiden[i], c = nocross[i];
			console.log('    x' + a.zoom + '  of ' + a.total + ' node labels -- giving a value up: '
				+ b.shed + ' (no longer leader) / ' + c.shed + ' (no shed before a hide) / '
				+ a.shed + ' AS SHIPPED;  hidden: ' + b.hidden + ' / ' + c.hidden + ' / ' + a.hidden
				+ ';  values shown ' + a.lines + ' of ' + a.wanted + ' asked for; pass '
				+ Math.round(a.ms) + ' ms');
			report(a.shed <= CEILING[a.zoom].shed, 'x' + a.zoom + ': labels giving a value up, against the ratchet',
				a.shed + ' (ceiling ' + CEILING[a.zoom].shed + ')');
			report(a.hidden <= CEILING[a.zoom].hidden, 'x' + a.zoom + ': labels not drawn at all, against the ratchet',
				a.hidden + ' (ceiling ' + CEILING[a.zoom].hidden + ')');
			// THE RULING ITSELF: a longer leader instead of a dropped property.
			report(a.shed < b.shed, 'x' + a.zoom + ': a longer leader spares properties the old pass dropped',
				b.shed + ' labels shed without it -> ' + a.shed + ' with it');
			report(a.hidden <= b.hidden, 'x' + a.zoom + ': and it costs no label its place on the drawing',
				b.hidden + ' -> ' + a.hidden + ' hidden');
			// THE RUNG BELOW: shedding rather than hiding.
			report(a.hidden <= c.hidden, 'x' + a.zoom + ': a label about to be hidden gives a value up instead',
				c.hidden + ' hidden without that rung -> ' + a.hidden + ' with it');
		});
		// The whole point in one number: more of what the user asked for reaches the screen.
		const shown = ship.reduce(function (m, a) { return m + a.lines; }, 0),
			was = nowiden.reduce(function (m, a) { return m + a.lines; }, 0);
		report(shown > was, 'over both zooms, more of the asked-for values are on the screen',
			was + ' -> ' + shown + ' value rows drawn');
	}
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main();
