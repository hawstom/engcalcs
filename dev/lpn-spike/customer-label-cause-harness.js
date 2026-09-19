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

function scenario(name, spacing, x0, side) {
	// A fresh set of eight each time, so one run cannot inherit the other's positions.
	(L.getDoc().customers || []).slice().forEach(function (c) { L.deleteCustomer(c.id); });
	const cust = [];
	for (let i = 0; i < 8; i++) { cust.push(L.addCustomer(x0 + i * spacing, 70 * (side || 1), { link: main.id })); }
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

// ---- WHAT THE EVIDENCE HAS TO SUPPORT ----------------------------------------------------------
//
// NOT a count of movers: which customers go beyond depends on the drawing, and pinning that would
// make an ordinary layout change read as a defect. These assert the things that must be TRUE OF
// THE MECHANISM whatever the drawing is -- and between them they are the answer to the mystery.
console.log('--- what the mechanism must be, whatever the drawing ---');
const all = roomy.concat(crowded).concat(above);
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
// spots are not a preference to be tuned, they are a first choice and a fallback.
ok('4 with room, every one of the eight takes the spot beside its line',
	roomy.every(q => q.where === 'beside the line'),
	roomy.map(q => q.where).join(','));
ok('5 crowded, at least one is pushed off its first choice',
	crowded.some(q => q.where !== 'beside the line'),
	crowded.map(q => q.where).join(','));

// ---- THE FINDING, PRINTED RATHER THAN ASSERTED ------------------------------------------------
//
// Tom's own reading was *"I see that these would conflict with a link label"*. Across all three
// views above that is NOT what rejected anything: every named blocker is the label of the previous
// customer on the same main, in document order. A link label CAN be the obstacle -- the third view
// puts eight services on the very side the pipe's own label lies -- and here it was not, because a
// pipe carries one label near its middle while a row of services is eight boxes in a line.
//
// This is printed and not asserted on purpose. WHICH customers are pushed is a fact about a
// drawing, and asserting it would turn an ordinary layout change into a red build; what is
// asserted above is the mechanism, which does not depend on the drawing.
console.log('--- every named blocker seen, across all three views ---');
const named = all.filter(q => q.firstBlock.indexOf('(') !== 0);
if (!named.length) { console.log('       none: every label took its first choice'); }
named.forEach(function (q) { console.log('       ' + q.id + '  <-  ' + q.firstBlock); });
console.log('       ' + named.filter(q => q.firstBlock.indexOf('custlabel') === 0).length +
	' of ' + named.length + ' were a neighbouring customer\'s own label');

console.log(fails ? ('FAILED: ' + fails) : 'Customer label cause harness complete.');
process.exit(fails ? 1 : 0);
