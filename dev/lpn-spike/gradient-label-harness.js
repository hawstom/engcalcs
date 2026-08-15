// The map label's one unit token: the head loss gradient's '%'. Run with:
//   node dev/lpn-spike/gradient-label-harness.js
//
// WHY THIS EXISTS. Every other field on the map is a bare number on purpose (Tom, 2026-07-30:
// "no units and no prefix"), and the gradient is the single exception (Tom, 2026-08-14: "we are
// omitting all other units as excessively redundant, I think that the % is crucial"). An exception
// is exactly the kind of rule that gets tidied away by someone reading the surrounding code, and
// nothing else in the repo says the '%' has to be there.
//
// The half that can be wrong quietly is the OTHER form. This family also offers plain rise/run,
// where the same suffix would be a lie rather than a redundancy -- and 0.43 is a plausible number
// in both forms, so a '%' printed over a ratio is invisible to inspection. So both directions are
// asserted, and so is the thing a suffix could break on its way past: the extrema badge compares
// NUMBERS, and a label whose text ends in '%' must still tie with one that does not.

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, effective: effective,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tlinkLabel: function (id) { return linkEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tlinkDecor: function (id) { return linkEls[id].lines.map(function (l) { return l.decoration || ''; }); },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

// Since Task 333 a label line is "<prefix><separator><number><unit suffix>", and the gradient's
// default prefix is 'S'. The number is still the thing under test here, so it is read past the
// prefix rather than by loosening the assertions -- a '%' still has to be the LAST thing on the
// line, and the digits still have to be the ratio form times 100.
function labelNumber(text) { return parseFloat(String(text).replace(/^[^0-9+-]*/, '')); }

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// The select is the source of truth the page reads (unitKey), so the test drives it the same way a
// user does rather than calling a helper that could agree with a page that had changed underneath.
function setGradientUnit(key) {
	const sel = document.querySelector('select[name="lpn_u_gradient"]');
	for (let i = 0; i < sel.options.length; i++) {
		if (sel.options[i].dataset.unit === key) { sel.selectedIndex = i; return true; }
	}
	return false;
}

console.log('=== head loss gradient: the label carries its % ===');

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.drawExample();
L.runSolve();

// Only the gradient, so a stray '%' anywhere in the stack is unmistakably this line.
const ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'gradient'); });

ok('the units strip offers the percent form at all', setGradientUnit('gradePercent'));
L.refreshLabelText();

const pipes = L.getDoc().links.filter(function (l) { return l.type === 'pipe'; });
ok('the example network has pipes to label', pipes.length > 0, 'got ' + pipes.length);

const pct = pipes.map(function (l) { return L.linkLabel(l.id)[0]; });
ok('every pipe prints exactly one gradient line', pipes.every(function (l) { return L.linkLabel(l.id).length === 1; }));
ok('...and it ends in %', pct.every(function (t) { return /%$/.test(t); }), JSON.stringify(pct));
// The suffix must be an ADDITION, not a reformat: the digits ahead of it are what the ratio form
// prints times 100, at the same per-field decimals.
const pctNums = pct.map(labelNumber);
ok('...on a real number, not an empty one', pctNums.every(function (v) { return isFinite(v); }), JSON.stringify(pct));

ok('the units strip offers the ratio form too', setGradientUnit('grade'));
L.refreshLabelText();
const raw = pipes.map(function (l) { return L.linkLabel(l.id)[0]; });
ok('the ratio form carries NO suffix -- a % there would be a lie',
	raw.every(function (t) { return !/%/.test(t); }), JSON.stringify(raw));
const rawNums = raw.map(labelNumber);
ok('...and is the same quantity, 100x smaller',
	rawNums.every(function (v, i) { return Math.abs(v * 100 - pctNums[i]) < 0.51 * Math.pow(10, -2); }),
	JSON.stringify(raw) + ' vs ' + JSON.stringify(pct));

// THE BADGE. It reads the rounded NUMBER, never the text, so the suffix must not change which
// pipes tie for the network max/min. Both forms are compared against each other rather than
// against a hardcoded expectation -- the example network is free to change.
setGradientUnit('grade');
L.refreshLabelText();
const decorRaw = pipes.map(function (l) { return L.linkDecor(l.id)[0]; });
setGradientUnit('gradePercent');
L.refreshLabelText();
const decorPct = pipes.map(function (l) { return L.linkDecor(l.id)[0]; });
ok('the extrema badge lands on the same pipes with the suffix as without',
	decorRaw.join(',') === decorPct.join(','), decorRaw.join(',') + ' vs ' + decorPct.join(','));
ok('...and it actually marks something, so the check above is not vacuous',
	decorPct.some(function (d) { return d; }), decorPct.join(','));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
