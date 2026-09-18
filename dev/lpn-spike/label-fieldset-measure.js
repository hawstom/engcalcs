// WHAT ONE FIELD COSTS A DRAWING: the same view, measured once per LABEL FIELD SET. Run with:
//   node dev/lpn-spike/label-fieldset-measure.js [example.lwn] [set ...]
//   node dev/lpn-spike/label-fieldset-measure.js Net3-Novato-CA-World.lwn id iddemand demand
//
// **WRITTEN TO ANSWER ONE QUESTION AND IT IS TOM'S** (2026-09-18). He compared three screenshots --
// node ID only, ID plus Demand, Demand only -- and said: *"I can't account for the drastic change.
// Can you? Here's what I would expect that didn't happen: (1) if the Demand and ID can't both fit,
// we would drop one. (2) Demand only and ID only would look very similar; but I find that all
// properties other than ID don't stack as well, which makes no geometric sense."*
//
// Every figure in dev/label-placement-algorithms.md before this was taken with EVERY FIELD ON,
// which is the crowded end of what a user can ask for and cannot compare two field sets at all.
// label-crossing-measure.js gained an `opts.fields` input for this, so there is still one
// measurement of a drawing and not two.
//
// **THE NUMBER THAT SETTLES IT IS THE LABEL'S FOOTPRINT, NOT THE COUNT.** A node label STACKS, so
// its boxes are a staircase of rows; the geometry reported here is the union of them, because
// reading the first row alone reports the ID's width for a label whose demand row is three times
// wider -- which is the misreading the question is about.
//
// `valueShed` is the other half and is the answer to his (1): how many node labels gave up a value
// instead of going whole. The cascade refuses to drop the LAST ranked value, and a node's ID
// carries no rank at all, so a drawing showing ID + one number has nothing to give and the only
// move left is to hide the whole label. That is what the zero in the `iddemand` row means.
//
// **ONE EXAMPLE AND ONE FIELD SET PER PROCESS**, for label-crossing-measure.js's own reason: a
// second document loaded into a page that already holds one inherits its elements' measured widths
// and its label state. So the top-level run SPAWNS A CHILD per set, exactly as the two crossing
// harnesses spawn one per (example, mode) pair, and the child prints its own rows.

'use strict';

const { measure } = require('./label-crossing-measure.js');
const { spawnSync } = require('child_process');

// Named sets rather than an ad-hoc field list, so a figure quoted in a report can be re-taken by
// name. `id` is every node's name and nothing else; `demand` is the resolved demand alone.
const SETS = {
	id:         { node: ['id'], link: [] },
	iddemand:   { node: ['id', 'demand'], link: [] },
	demand:     { node: ['demand'], link: [] },
	idpressdem: { node: ['id', 'pressure', 'demand'], link: [] },
	all:        null   // every field on -- the state every other recorded figure was taken in
};

// The child: one set, its rows on stdout.
async function one(file, name) {
	if (!(name in SETS)) { throw new Error('unknown field set: ' + name); }
	const r = await measure(file, 'all+shed', { fields: SETS[name] });
	r.rows.forEach(function (row) {
		const p = row.passes[0], g = p.geom;
		console.log([name, row.zoom + 'x', g.width.n, p.hidden, p.labels, p.valueShed,
			g.width.med.toPrecision(4), g.height.med.toPrecision(4),
			g.area.med.toPrecision(4), g.rows.med].join('\t'));
	});
}

function main() {
	const file = process.argv[2] || 'Net3-Novato-CA-World.lwn';
	if (process.argv[3] === '--one') { return one(file, process.argv[4]); }
	const want = process.argv.slice(3);
	const sets = want.length ? want : ['id', 'iddemand', 'demand'];
	console.log(file + ', 1400x900, solved through EPANET, repair route all+shed');
	console.log(['set', 'zoom', 'shown', 'hidden', 'of', 'valueShed', 'w(med)', 'h(med)',
		'area(med)', 'rows'].join('\t'));
	sets.forEach(function (name) {
		const out = spawnSync(process.execPath, [__filename, file, '--one', name],
			{ encoding: 'utf8' });
		if (out.status !== 0) { console.error(out.stderr); process.exit(1); }
		process.stdout.write(out.stdout);
	});
	return Promise.resolve();
}

main().catch(function (e) { console.error(e); process.exit(1); });
