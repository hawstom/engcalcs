// The valve symbol is a BOWTIE AND NOTHING ELSE, and the flow arrows have an off switch.
//   node dev/lpn-spike/valve-arrow-harness.js
//
// Two rulings from 2026-09-01, guarded together because they are the same kind of thing -- what the
// map draws, and what it stops drawing when the user says so:
//
//   1. Tom, on the icon that shipped: *"our current valve icon is embarrassing and overly complex.
//      It should be a simple bowtie without other decoration (the little T)."* The little T was a
//      stem and a handwheel bar standing on the waist. Section 1 asserts the geometry itself, and
//      that no third mark has crept back onto it.
//   2. Tom: *"it would be nice to have a Settings option to turn off flow direction arrows."*
//      Sections 3-5 assert the DRAWN result -- every chevron's own `display` -- rather than the
//      boolean, and that the setting travels in a saved project.
//
// **WHY SECTION 1 READS THE PHP AND NOT THE RENDERED SYMBOL.** lib/Icons.lib.php holds the one copy
// of every icon's geometry; buildMapIconSvg() re-homes what iconEl() built without touching a path,
// so that string IS the drawn markup, on the toolbar button and on the map both. The headless stub
// cannot help here and would mislead if asked: its iconEl() returns an empty <g>, so a harness that
// inspected the map symbol's children in Node would pass on a valve drawn as nothing at all --
// dev/testing-notes.md's stub warning, exactly. What CAN be asserted structurally is the other half
// of the shared-path rule: the map backdrop in js/looped-network.js traces the SAME outline, and
// those two strings drifting apart is what leaves a pale patch beside the mark on screen.

const fs = require('fs');
const path = require('path');
const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const ROOT = path.resolve(__dirname, '..', '..');
const iconsSrc = fs.readFileSync(path.join(ROOT, 'lib', 'Icons.lib.php'), 'utf8');
const editorSrc = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// ---- 1. THE VALVE IS A BOWTIE ---------------------------------------------------------------
console.log('\n--- the valve symbol: two triangles meeting at a waist, and nothing else ---');
const valveGeom = (iconsSrc.match(/'valve'\s*=>\s*'([^']*)'/) || [])[1];
const valveDs = ((valveGeom || '').match(/\bd="([^"]*)"/g) || []).map(s => s.slice(3).replace(/"/g, ''));
{
	ok('lib/Icons.lib.php still defines a valve icon', !!valveGeom);
	const geom = valveGeom || '';
	// Every drawn element in the icon, whatever its tag: a stem, a handwheel, a circle around the
	// bowtie or a nut on top would all turn up here, and each is the decoration that was struck.
	const tags = (geom.match(/<([a-z]+)\b/g) || []).map(t => t.slice(1));
	ok('it is drawn from <path> elements only', tags.length > 0 && tags.every(t => t === 'path'),
		tags.join(','));
	// Four paths and no more: the two triangles, each drawn twice -- once as the pale fill that
	// gives the mark area against a pipe's stroke, once as the outline. A fifth is decoration.
	ok('exactly four paths -- two triangles, each a fill and an outline', tags.length === 4,
		tags.length + ' element(s)');
	const outlines = valveDs.slice(2);
	ok('the fills trace the same two outlines they sit under',
		valveDs.length === 4 && valveDs[0] === outlines[0] && valveDs[1] === outlines[1],
		valveDs.join(' | '));
	// THE GEOMETRY ITSELF. Each triangle is "move to a corner, run down the outer edge, cut back to
	// the apex, close" -- so its three points are recoverable without an SVG engine.
	function triangle(d) {
		// SVG lets a minus sign stand in for the separator, so "l9-8" is two numbers.
		const mm = d.match(/^M(-?[\d.]+)[ ,](-?[\d.]+)v(-?[\d.]+)l(-?[\d.]+)[ ,]?(-?[\d.]+)z$/);
		if (!mm) { return null; }
		const x = +mm[1], y = +mm[2], dy = +mm[3], lx = +mm[4], ly = +mm[5];
		return { pts: [[x, y], [x, y + dy], [x + lx, y + dy + ly]] };
	}
	const t1 = triangle(outlines[0] || ''), t2 = triangle(outlines[1] || '');
	ok('both outlines are closed triangles', !!t1 && !!t2, outlines.join(' | '));
	if (t1 && t2) {
		const apexA = t1.pts[2], apexB = t2.pts[2];
		// The waist. Not "near the middle" -- exactly one point, or the two halves are a hexagon
		// with a kink rather than a bowtie.
		ok('the two apexes meet at one point', apexA[0] === apexB[0] && apexA[1] === apexB[1],
			apexA + ' vs ' + apexB);
		ok('...and that point is the centre of the 24x24 box', apexA[0] === 12 && apexA[1] === 12,
			String(apexA));
		// Mirror symmetry about the waist, which is what makes it read at any rotation along a pipe.
		const backA = t1.pts[0][0], backB = t2.pts[0][0];
		ok('the two backs are equidistant from the waist',
			Math.abs(12 - backA) === Math.abs(backB - 12), backA + ' and ' + backB);
		ok('the backs are the same height, centred on the waist',
			t1.pts[0][1] === t2.pts[0][1] && t1.pts[1][1] === t2.pts[1][1] &&
			t1.pts[0][1] + t1.pts[1][1] === 24,
			t1.pts[0][1] + '..' + t1.pts[1][1]);
		// It has to survive `settings.symbolSize` = 7, where the whole 24-unit box is 14 screen
		// pixels (pumpSymbolSize() is 4 * symbolFactor(), and symbolFactor() is symbolSize/2 per
		// JUNCTION_R of 1). A bowtie that filled half the box would be a smudge there, so the mark
		// is required to reach most of it.
		const w = Math.abs(backB - backA), h = Math.abs(t1.pts[1][1] - t1.pts[0][1]);
		ok('the bowtie fills at least three quarters of the box in both directions',
			w >= 18 && h >= 16, w + ' wide by ' + h + ' tall of 24');
	}
	// The little T, by SHAPE rather than by name. Each triangle legitimately owns one `v`, so those
	// are consumed first and anything left over is a mark that is not part of the bowtie: a stem is
	// a vertical, a handwheel bar a horizontal, a nut or a surrounding circle another element.
	const leftover = geom.replace(/v(-?[\d.]+)l/g, 'l');
	ok('no stem and no handwheel bar', !/[Vv]-?[\d.]/.test(leftover) && !/[Hh]-?[\d.]/.test(leftover) &&
		!/<(circle|line|rect|ellipse|polyline|polygon)\b/.test(geom), geom);
}

// ---- 2. THE MAP SYMBOL AND ITS BACKDROP ARE ONE SHAPE ---------------------------------------
console.log('\n--- the map symbol and its backdrop are one shape ---');
{
	const outlines = valveDs.slice(2);
	// buildLinkEls() prepends ONE opaque path under a valve's icon so a pipe does not show through
	// the mark. It is written as the two triangles concatenated.
	const bd = editorSrc.match(/prependSymbolBackdrop\(symbolSvg, 'path', \{ d: '([^']*)' \}/);
	ok('the valve map symbol still gets a backdrop path', !!bd);
	ok('...tracing exactly the icon\'s own two triangles',
		!!bd && bd[1] === outlines.join(''), bd ? bd[1] : '(none)');
}

// ---- 3. THE FLOW ARROWS, ON THE DRAWING ------------------------------------------------------
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tsetProp: setProp, runSolve: runSolve, buildDom: buildDom,\n" +
	// runSolve() stores rather than returns -- the arrows are drawn from lastSolveResult.
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	// The SWITCH as the Settings box works it: write the setting, then call the one apply
	// function the checkbox's own listener calls. Nothing here reaches into updateArrow()
	// directly, so a listener wired to the wrong function would still fail this.
	"\t\tsetShowArrows: function (v) { settings.showArrows = v; applyShowArrows(); },\n" +
	// What is actually DRAWN: one entry per chevron element, its own display value.
	"\t\tarrowDisplays: function (id) { return (linkEls[id] ? linkEls[id].arrows : [])\n" +
	"\t\t\t.map(function (a) { return a.style.display; }); },\n" +
	"\t\tarrowTransforms: function (id) { return (linkEls[id] ? linkEls[id].arrows : [])\n" +
	"\t\t\t.map(function (a) { return a.getAttribute('transform') || ''; }); },\n" +
	"\t\tarrowSpacing: function (id) { return arrowAlongDistances(linkById(id)); },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

setUnitSet('us');
L.reset();

// A reservoir feeding two junctions: real geometry, a real solve, and therefore real arrows.
const src = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 300, 0);
const j2 = L.addNode('junction', 600, 0);
L.setProp(src, 'head', 100);
L.setProp(j1, 'elev', 0); L.setProp(j2, 'elev', 0);
L.setProp(j1, 'demand', 5); L.setProp(j2, 'demand', 5);
const p1 = L.addLink('pipe', src.id, j1.id);
const p2 = L.addLink('pipe', j1.id, j2.id);
L.runSolve();
ok('the network solves, so there are directions to draw',
	!!(L.lastResult() && L.lastResult().flows),
	JSON.stringify(L.lastResult()));

function drawn(id) { return L.arrowDisplays(id).filter(d => d !== 'none').length; }

console.log('\n--- arrows are on by default ---');
{
	ok('the shipped default is on', L.defaultSettings().showArrows === true,
		String(L.defaultSettings().showArrows));
	ok('pipe 1 draws a chevron', drawn(p1.id) > 0, L.arrowDisplays(p1.id).join(','));
	ok('pipe 2 draws a chevron', drawn(p2.id) > 0, L.arrowDisplays(p2.id).join(','));
	ok('a drawn chevron is positioned, not parked at the origin',
		/translate\(/.test(L.arrowTransforms(p1.id)[0] || ''), L.arrowTransforms(p1.id)[0]);
}

// ---- 4. THE SWITCH -----------------------------------------------------------------------------
console.log('\n--- turning them off takes them off the drawing, with no re-solve ---');
{
	L.setShowArrows(false);
	ok('pipe 1 draws none', drawn(p1.id) === 0, L.arrowDisplays(p1.id).join(','));
	ok('pipe 2 draws none', drawn(p2.id) === 0, L.arrowDisplays(p2.id).join(','));
	// The other half of the same rule, and the one a screenshot would not show: a chevron that is
	// not drawn must not go on reserving the space the labels dodge around it.
	ok('and they reserve no space along the pipe any more', L.arrowSpacing(p1.id).length === 0,
		JSON.stringify(L.arrowSpacing(p1.id)));
}

console.log('\n--- and back on again, still with no re-solve ---');
{
	// runSolve() has been called exactly once, at the top. Everything below is redrawing.
	L.setShowArrows(true);
	ok('pipe 1 has its chevron back', drawn(p1.id) > 0, L.arrowDisplays(p1.id).join(','));
	ok('pipe 2 has its chevron back', drawn(p2.id) > 0, L.arrowDisplays(p2.id).join(','));
	ok('...positioned, not left at the origin',
		/translate\(/.test(L.arrowTransforms(p1.id)[0] || ''), L.arrowTransforms(p1.id)[0]);
	ok('...and reserving their space again', L.arrowSpacing(p1.id).length > 0);
}

// ---- 5. IT TRAVELS WITH THE PROJECT ----------------------------------------------------------
// The state lives in `settings`, which serializeProject() writes whole -- the same place
// maskLabels and alignPipeLabels live, and the reason a template project is how this page carries
// a preference (there is no per-browser settings store here).
console.log('\n--- the switch is saved with the project ---');
{
	L.setShowArrows(false);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('serializeProject() writes it', saved.settings.showArrows === false,
		String(saved.settings.showArrows));
	L.reset();
	L.applySaved(saved);
	L.buildDom();
	L.runSolve();
	ok('a project saved with arrows off opens with them off',
		L.getSettings().showArrows === false && drawn(p1.id) === 0,
		L.arrowDisplays(p1.id).join(','));

	// A project written before the switch existed has no such key, and its arrows were on. This is
	// the leg `!== false` buys, and a truthiness test would fail it.
	const older = JSON.parse(JSON.stringify(saved));
	delete older.settings.showArrows;
	L.reset();
	L.applySaved(older);
	L.buildDom();
	L.runSolve();
	ok('a project from before the switch existed still draws its arrows',
		drawn(p1.id) > 0, L.arrowDisplays(p1.id).join(','));
}

console.log(fails ? `\n${fails} FAILURE(S)` : '\nall ok');
process.exit(fails ? 1 : 0);
