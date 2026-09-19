// WHY A FEW CUSTOMER LABELS GO BEYOND THE METER AND MOST DO NOT -- ROADMAP Task 247. Run with:
//   node dev/lpn-spike/customer-label-cause-harness.js
//
// Tom, 2026-09-19, looking at a reservoir feeding a horizontal main with eight services on it:
// *"Like most of the label placement, I see a mystery. I see a row of labels along the service
// lines with a few beyond the meter. I see that these would conflict with a link label, but if so,
// maybe we should calculate the standard location for all to accomodate a link label."*
//
// **HE IS ASKING WHY, AND A RESTATEMENT IS NOT AN ANSWER.** This project has twice answered a
// label question with "it did not fit", which is the finding written back as though it were a
// cause, and twice withdrawn it. So this harness does what
// dev/lpn-spike/label-width-cause-harness.js does for node labels: it rebuilds his own picture,
// runs the REAL placement pass, and prints, per customer, which of the two spots it tried, what
// rejected the first one BY NAME, and where it ended up. The naming is `customerSpotBlocker()` in
// js/looped-network.js, which records the rejecting obstacle on the element as the pass runs.
//
// A customer label has exactly two candidate positions -- Tom's own specification -- so "the
// mystery" has only three possible outcomes and every one of them is printed here: the spot beside
// the service line, the spot beyond the customer, or dropped.
//
// **AND THIS HARNESS'S FIRST VERSION GOT IT WRONG, WHICH IS WHY IT SAYS SO AT THE TOP.** It stood
// its customers at round numbers on a main whose label repeats somewhere else entirely, never put
// one of them near a link label, and then reported that a link label never blocks anything -- the
// opposite of what Tom had said, and he was right. The blocker positions are DERIVED from the page
// now (`mainLabelXs()`), and the case it missed is a permanent assertion. A harness that concludes
// "X never happens" from a drawing that cannot produce X is worse than no harness.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-net.js');

global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\taddCustomer: addCustomer, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\trefreshLabelText: refreshLabelText, relayoutLabels: relayoutLabels,\n" +
	"\t\tcustLblEls: function () { return custLblEls; },\n" +
	"\t\teffectiveFontSize: effectiveFontSize,\n" +
	"\t\tcustomerPoint: customerPoint, customerAttachPoint: customerAttachPoint,\n" +
	"\t\tdeleteCustomer: deleteCustomerById,\n" +
	"\t\tlinkLabelStations: linkLabelStations,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setCanvas(1200, 700);

// ---- HIS PICTURE: a reservoir, one horizontal main, eight services hanging off it --------------
//
// Run TWICE, at two spacings, because one view cannot show a mechanism. The roomy one is his
// picture; the crowded one is the same drawing with the services close enough that the labels
// meet. Nothing else differs -- same main, same eight customers, same settings.
//
// The view-width courtesy is a SETTING and this is a long main, so it is opened out rather than
// left to refuse every label: what is under test is the placement, not the threshold.
L.labelSettings().customerMaxWidth = 1e6;

const r = L.addNode('reservoir', 0, 0);
const j = L.addNode('junction', 900, 0);
const main = L.addLink('pipe', r.id, j.id);

// **WHERE THE MAIN'S OWN LABEL ACTUALLY IS, DERIVED AND NEVER ASSUMED.** A long pipe does not
// carry one label at its midpoint: it REPEATS its label along its length, and
// `linkLabelStations()` is the rule. This harness's first version placed customers at round
// numbers -- 100, 200, ... 800 -- on a 900-unit main whose label repeats at 225 and 675, so not
// one of its eight customers was ever near a link label, and it then reported that a link label
// never blocks anything. **A harness that concludes "X never happens" from a drawing that cannot
// produce X is worse than no harness**, because it reads as evidence. The positions are read out
// of the page now.
function mainLabelXs() {
	return L.linkLabelStations(L.getDoc().links.filter(l => l.id === main.id)[0])
		.map(t => t * 900);
}

function scenario(name, spacing, x0, side, xsOverride) {
	// A fresh set of eight each time, so one run cannot inherit the other's positions.
	(L.getDoc().customers || []).slice().forEach(function (c) { L.deleteCustomer(c.id); });
	const cust = [];
	const xs = xsOverride || [];
	const n = xsOverride ? xsOverride.length : 8;
	for (let i = 0; i < n; i++) {
		cust.push(L.addCustomer(xsOverride ? xs[i] : x0 + i * spacing, 70 * (side || 1),
			{ link: main.id }));
	}
	L.refreshLabelText();
	L.relayoutLabels();
	console.log('--- ' + name + ': services ' + spacing + ' units apart ---');
	const rows = cust.map(function (c) {
		const ce = L.custLblEls()[c.id], t = ce.trials || [];
		const where = ce.spot ? (ce.spot.atLink ? 'beside the line' : 'beyond the customer') : 'DROPPED';
		const by = t[0] && t[0].by;
		const firstBlock = (t[0] && t[0].taken) ? '(nothing -- first choice was free)'
			: by ? (by.kind + (by.linkOwner ? ' of ' + by.linkOwner : '') +
				(by.custOwner ? ' of ' + by.custOwner : ''))
			: '(rejected, blocker unnamed)';
		console.log('       ' + String(c.id).padEnd(5) + ' landed ' + where.padEnd(20) +
			' first choice blocked by ' + firstBlock);
		return { id: c.id, where: where, firstBlock: firstBlock, tries: t.length, trials: t };
	});
	const beside = rows.filter(q => q.where === 'beside the line').length;
	const beyond = rows.filter(q => q.where === 'beyond the customer').length;
	const dropped = rows.filter(q => q.where === 'DROPPED').length;
	console.log('       --- ' + beside + ' beside the line, ' + beyond + ' beyond the customer, ' +
		dropped + ' dropped, of ' + rows.length);
	return rows;
}

const roomy = scenario('his picture', 100, 100);
const crowded = scenario('the same drawing, crowded', 14, 300);
// **AND THE CASE TOM GUESSED AT**, which is a different side of the same main: the pipe's own
// aligned label lies ABOVE the main, so services hanging upward have to share that ground and the
// rejector is the link label rather than a neighbour. It is a real case; it is simply not the one
// his row of services was showing him.
const above = scenario('services on the link label\'s own side', 100, 100, -1);

// **AND THE CASE THE FIRST VERSION OF THIS HARNESS MISSED ENTIRELY.** One service standing exactly
// where the main's own label is drawn, on the label's own side of the pipe. Tom's reading was that
// a customer label would conflict with a link label, and it does.
const onLabel = scenario('a service standing on the main\'s own label', 0, 0, -1,
	mainLabelXs().concat(mainLabelXs().map(x => x + 5)));

// ---- WHAT THE EVIDENCE HAS TO SUPPORT ----------------------------------------------------------
//
// NOT a count of movers: which customers go beyond depends on the drawing, and pinning that would
// make an ordinary layout change read as a defect. These assert the things that must be TRUE OF
// THE MECHANISM whatever the drawing is -- and between them they are the answer to the mystery.
console.log('--- what the mechanism must be, whatever the drawing ---');
const all = roomy.concat(crowded).concat(above).concat(onLabel);
ok('1 every customer tried the spot beside its service line FIRST',
	all.every(q => (q.trials[0] || {}).atLink === true));
// **A LABEL THAT WENT BEYOND WAS PUSHED, AND NEVER DREW A PREFERENCE.** This is the whole of the
// answer to "why do a few go beyond": nothing sends one there. The first spot was taken and the
// second was free -- so the question "why these and not those" is a question about what was
// already standing on the ground beside THAT service, and the blocker is now named.
ok('2 a label beyond the customer was rejected at the first spot, by a named obstacle',
	all.filter(q => q.where === 'beyond the customer')
		.every(q => q.firstBlock.indexOf('unnamed') < 0 && q.firstBlock.indexOf('nothing') < 0),
	all.filter(q => q.where === 'beyond the customer').map(q => q.id + ': ' + q.firstBlock).join(' | ') || 'none went beyond');
ok('3 ...and a label beside the line was never rejected at all',
	all.filter(q => q.where === 'beside the line').every(q => q.tries === 1));
// **IN THE ROOMY VIEW NOBODY IS PUSHED**, which is the other half of the same statement: the two
// spots are not a preference to be tuned, they are a first choice and a fallback -- and it is the
// measured half of the answer to "should every customer label take ONE standard position": where
// there is room they already all take the same one, and the movers are exactly the labels whose
// first choice was refused, which the trial record names one by one.
ok('4 with room, every one of the eight takes the spot beside its line',
	roomy.every(q => q.where === 'beside the line'),
	roomy.map(q => q.where).join(','));
ok('5 crowded, at least one is pushed off its first choice',
	crowded.some(q => q.where !== 'beside the line'),
	crowded.map(q => q.where).join(','));
// **TOM WAS RIGHT: A LINK LABEL BLOCKS A CUSTOMER LABEL.** This is the assertion the first version
// of this harness could not make, because none of its customers was ever near one. It is permanent
// now, and it is derived -- the customers are placed AT `linkLabelStations()`'s own answer, so a
// change to where a pipe repeats its label moves the fixture with it instead of blinding it.
ok('6 a customer standing on the main\'s own label is blocked BY that link label',
	onLabel.some(q => q.firstBlock === 'label of ' + main.id),
	onLabel.map(q => q.id + ': ' + q.firstBlock).join(' | '));
// **AND THE OUTCOME IS A DROP, NOT A SHUFFLE.** Both standard positions can be refused at once, and
// the label then leaves the drawing with nothing to say it has -- which the first write-up of this
// question did not know was possible.
ok('7 ...and where both positions are refused the label is DROPPED, silently',
	onLabel.some(q => q.where === 'DROPPED'),
	onLabel.map(q => q.where).join(','));

// ---- THE FINDING, PRINTED RATHER THAN ASSERTED ------------------------------------------------
//
// Tom's own reading was *"I see that these would conflict with a link label"*, and **HE WAS
// RIGHT**. An earlier version of this harness reported the opposite, and the reason is recorded
// above `mainLabelXs()`: its customers stood at round numbers on a main whose label repeats
// somewhere else entirely, so the case was never on the drawing at all.
//
// What the four views show TOGETHER, which is not the same as what any one of them shows:
//   * a NEIGHBOURING customer's label is the commonest blocker wherever services are close, and
//     that outcome is a shuffle -- the label steps past the customer and is still readable;
//   * a LINK label blocks whenever a service lands near one of the pipe label's repeat positions,
//     and that outcome is the bad one -- both standard positions can go at once and the label
//     LEAVES THE DRAWING.
//
// WHICH customers are hit is printed and not asserted: that is a fact about a drawing, and pinning
// it would turn an ordinary layout change into a red build. The MECHANISM is asserted, because it
// does not depend on the drawing.
console.log('--- every named blocker seen, across all four views ---');
const named = all.filter(q => q.firstBlock.indexOf('(') !== 0);
if (!named.length) { console.log('       none: every label took its first choice'); }
named.forEach(function (q) { console.log('       ' + q.id + '  <-  ' + q.firstBlock); });
console.log('       ' + named.filter(q => q.firstBlock.indexOf('custlabel') === 0).length +
	' of ' + named.length + ' were a neighbouring customer\'s own label, ' +
	named.filter(q => q.firstBlock.indexOf('label of ') === 0).length + ' were a link label');
console.log('       dropped outright across all four views: ' +
	all.filter(q => q.where === 'DROPPED').length + ' of ' + all.length);

// ---- HOW OFTEN THE SILENT DROP HAPPENS, ON A STREET RATHER THAN ON A FIXTURE -------------------
//
// The four views above are built to make things collide. This one is built to be ordinary: a long
// main and twenty-five services at random stations along it, which is what a street is -- houses
// are where they are. Run both ways round, because the side a service hangs on decides whether it
// competes with the pipe's own label at all.
//
// **PRINTED, NEVER ASSERTED.** A rate is a fact about these fixtures; asserting one would pin a
// number nobody can act on. What it is for is the size of the decision in front of Tom.
console.log('--- how often a customer label disappears on an ordinary street ---');
{
	const LEN = 3000;
	const a2 = L.addNode('reservoir', 0, 900), b2 = L.addNode('junction', LEN, 900);
	const street = L.addLink('pipe', a2.id, b2.id);
	let seed = 12345;
	function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
	[-1, 1].forEach(function (side) {
		let dropped = 0, total = 0, beyond = 0;
		for (let trial = 0; trial < 10; trial++) {
			(L.getDoc().customers || []).slice().forEach(function (c) { L.deleteCustomer(c.id); });
			const xs = [];
			for (let i = 0; i < 25; i++) { xs.push(rnd() * LEN); }
			xs.sort(function (p, q) { return p - q; });
			const cs = xs.map(function (x) { return L.addCustomer(x, 900 + 70 * side, { link: street.id }); });
			L.refreshLabelText();
			L.relayoutLabels();
			cs.forEach(function (c) {
				const ce = L.custLblEls()[c.id];
				total++;
				if (!ce.spot) { dropped++; } else if (!ce.spot.atLink) { beyond++; }
			});
		}
		console.log('       services ' + (side < 0 ? 'on the pipe label\'s own side' : 'on the far side      ') +
			': ' + dropped + ' of ' + total + ' disappeared (' + (100 * dropped / total).toFixed(1) +
			'%), ' + beyond + ' stepped beyond');
	});
}

console.log(fails ? ('FAILED: ' + fails) : 'Customer label cause harness complete.');
process.exit(fails ? 1 : 0);
