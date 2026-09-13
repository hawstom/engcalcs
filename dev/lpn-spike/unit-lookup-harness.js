// **THE UNIT SELECT IS LOOKED UP ONCE, NOT ON EVERY READ** (Task 651). Run with:
//   node dev/lpn-spike/unit-lookup-harness.js
//
// Tom, 2026-09-13: *"In Ubuntu Firefox, the Settings Quality selector is very sluggish and doesn't
// work (change) once it responds. All selectors are the same that way."*
//
// unitEl() answered every unit read on this page with a fresh `document.querySelector`, and every
// unit read means every readout, every popup field and -- the one that hurt -- every quantity on
// every map label. MEASURED with the CPU profiler on the shipped Net3 lat/lon example, changing one
// select in the Settings box: **2.85 s of an 18.9 s run inside querySelector, 15% of the pass**,
// finding the same nine elements over and over. It is now remembered, and querySelector does not
// appear in that profile at all.
//
// **A STALE CACHE HERE WOULD BE A WRONG UNIT, WHICH IS WORSE THAN A SLOW ONE**, so this file is
// about the invalidation and not about the speed. The cached element is believed only while it is
// still what the query would return -- attached, and still carrying the name asked for -- and every
// other case re-queries. There is nothing for a call site to remember, which is the same shape of
// invariant unprojectStoredGeo() holds its `_ysrc` on.
//
// What this canNOT see, said plainly: nothing here measures time. The speed claim above is a
// profile of the served page and belongs in the comment, not in an assertion -- a timing threshold
// in a harness is a machine-load detector.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { setUnitSet, loadLoopedNetwork, unitSelects } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const L = loadLoopedNetwork(
	"\t\tunitEl: unitEl, unitKey: unitKey, unitFactor: unitFactor,\n" +
	"\t\tINPUTS: LPN_UNIT_SELECTS,\n"
);

setUnitSet('us');

console.log('--- 1. the cache answers with the LIVE element, so a value change is seen ---');
{
	const name = L.INPUTS[0];
	const el = L.unitEl(name);
	check(!!el, 'the select is found at all', name);
	check(L.unitEl(name) === el, '...and a second lookup answers the same element');
	// The whole risk of remembering an ELEMENT rather than a VALUE is that it is the live node, so
	// the user changing the select is visible with no invalidation at all. Assert it, because a
	// cache that stored the VALUE instead would pass every other check in this file.
	const before = L.unitKey(name);
	const other = el.options.map((o) => o.value).filter((v) => v !== before)[0];
	el.selectedIndex = el.options.map((o) => o.value).indexOf(other);
	check(L.unitKey(name) === other,
		'A CHANGE ON THE SELECT IS READ BACK IMMEDIATELY', before + ' -> ' + L.unitKey(name));
	check(L.unitFactor(name) === global.EngCalcs.unitFactor(el),
		'...and the factor follows the same element', String(L.unitFactor(name)));
}

console.log('\n--- 2. a REBUILT select is found, not the one that was cached ---');
{
	// The units block is server-rendered once and MOVED rather than rebuilt, so this does not
	// happen today. It is exactly what a future rebuild would do, and it is the case a cache with
	// no invalidation gets silently wrong: the old element is left behind holding the old unit, and
	// every number on the page is then converted with a factor nobody chose.
	//
	// **A REBUILD DETACHES WHAT IT REPLACES, AND THAT IS WHY DETACHMENT IS THE WHOLE TEST.**
	// replaceChild(), remove() and innerHTML = '' all leave the old node parentless. The only other
	// shape -- a second select carrying the same name while the first is still in the document --
	// is two controls answering to one name, which is a defect on its own terms; and
	// document.querySelector would hand back the FIRST of them, which is what the cache already
	// holds. So there is no reachable state in which the cache and the query disagree.
	const name = L.INPUTS[1];
	const old = L.unitEl(name);
	check(!!old && L.unitEl(name) === old, 'the original is cached', name);
	const replacement = { name: name, parentNode: {}, isConnected: true,
		options: [{ value: 'mm', textContent: 'mm' }], selectedIndex: 0,
		getAttribute: function (a) { return a === 'name' ? name : null; } };
	Object.defineProperty(replacement, 'value', { get() { return this.options[this.selectedIndex].value; } });
	const parent = old.parentNode;
	old.parentNode = null;                      // what replaceChild() does to what it replaces
	unitSelects[name] = replacement;
	check(L.unitEl(name) === replacement,
		'A REBUILT SELECT IS FOUND, not the cached node',
		L.unitEl(name) === old ? 'still the old one' : 'the new one');
	check(L.unitKey(name) === 'mm', '...so the unit read is the new one', L.unitKey(name));
	unitSelects[name] = old; old.parentNode = parent;
}

console.log('\n--- 3. a DETACHED select is not handed back ---');
{
	const name = L.INPUTS[2];
	const el = L.unitEl(name);
	check(L.unitEl(name) === el, 'cached while it is attached', name);
	const parent = el.parentNode;
	el.parentNode = null;                       // what removing it from the document looks like
	unitSelects[name] = null;                   // ...and the query then finds nothing
	check(L.unitEl(name) === null,
		'a detached element is dropped rather than served', String(L.unitEl(name)));
	unitSelects[name] = el; el.parentNode = parent;
	check(L.unitEl(name) === el, '...and putting it back is seen too');
}

console.log('\n--- 4. and a name nothing answers to is still null, not a neighbour ---');
{
	check(L.unitEl('lpn_u_not_a_unit') === null, 'an unknown name answers null',
		String(L.unitEl('lpn_u_not_a_unit')));
}

console.log('\n' + (checks - failures) + '/' + checks + ' checks passed.');
process.exit(failures ? 1 : 0);
