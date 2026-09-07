// lpn-fittings.js -- what a pipe's minor loss is MADE OF: named fittings, quantities, and the sum.
//
// ROADMAP Task 590, and dev/pipe-library-design.md §3. A `lpn_` pipe had one bare minor-loss `k`
// field and nothing else, so the number was guessed. The model here is the market's own and not an
// invention: **k = sum(quantity_i x k_i)**, the additive-K method of Crane Technical Paper 410,
// which is the shape Bentley's *Minor Loss Collection* dialog offers (Quantity, a picker into a
// library, and the coefficient) and the shape KYPipe's SigmaM offers. There is no alternative in
// active commercial use.
//
// **THE DEFAULT IS ZERO AND STAYS ZERO.** EPANET 0, epanet-js 0 (`DEFAULT_MINOR_LOSS = 0` in their
// source), WaterGEMS and KYPipe both zero absent a pick. A pipe with no fittings list has whatever
// `k` the user typed, exactly as before this file existed.
//
// **EVERY COEFFICIENT BELOW IS EPANET'S OWN PUBLISHED TABLE AND NOTHING ELSE IS SEEDED.** Source:
// *EPANET 2.2 User Manual*, Rossman, Woo, Tryby, Shang, Elliott, Zhang and Rossman, US EPA
// EPA/600/R-20/133, section 3.1, **Table 3.3 "Minor Loss Coefficients for Selected Fittings"** --
// thirteen rows, reproduced here verbatim, in the manual's own order and with the manual's own
// names. Public domain, citable, and already the reference a person modelling in this page has
// open. An UNSOURCED coefficient is worse than an absent one, because it looks authoritative: a
// fitting we cannot source is left out of this list rather than given a number nobody can check.
//
// **A COEFFICIENT IS DIMENSIONLESS, WHICH IS WHY NO UNIT APPEARS ANYWHERE IN THIS FILE.** k is a
// multiple of the velocity head, so CLAUDE.md's "changing a unit reinterprets the typed number"
// rule has nothing to bite on here: there is no unit selector for a k, no conversion at the solver,
// and the sum crosses to the engine and into an `.inp` unchanged. Said out loud because the absence
// of conversion code is otherwise indistinguishable from conversion code somebody forgot.
//
// PURE, like js/lpn-geom.js and js/lpn-rules.js: numbers and plain objects in, numbers out. No DOM,
// no `doc`, no settings, and **no English** -- a fitting's NAME is a language key the page resolves,
// so this file carries the key and never the words.
(function (root) {
	'use strict';

	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	/**
	 * EPANET 2.2 User Manual Table 3.3, verbatim. `key` is the stored token -- never the name, which
	 * is translated in 27 languages and would re-point every reference the day a wording changed.
	 * `lang` is the language key the page reads the displayed name from.
	 */
	var CATALOG = [
		{ key: 'globe', k: 10.0, lang: 'lpn_fitting_globe' },
		{ key: 'angle', k: 5.0, lang: 'lpn_fitting_angle' },
		{ key: 'swingcheck', k: 2.5, lang: 'lpn_fitting_swingcheck' },
		{ key: 'gate', k: 0.2, lang: 'lpn_fitting_gate' },
		{ key: 'elbow_short', k: 0.9, lang: 'lpn_fitting_elbow_short' },
		{ key: 'elbow_medium', k: 0.8, lang: 'lpn_fitting_elbow_medium' },
		{ key: 'elbow_long', k: 0.6, lang: 'lpn_fitting_elbow_long' },
		{ key: 'elbow_45', k: 0.4, lang: 'lpn_fitting_elbow_45' },
		{ key: 'return_bend', k: 2.2, lang: 'lpn_fitting_return_bend' },
		{ key: 'tee_run', k: 0.6, lang: 'lpn_fitting_tee_run' },
		{ key: 'tee_branch', k: 1.8, lang: 'lpn_fitting_tee_branch' },
		{ key: 'entrance', k: 0.5, lang: 'lpn_fitting_entrance' },
		{ key: 'exit', k: 1.0, lang: 'lpn_fitting_exit' }
	];

	/**
	 * **AN ITEM CARRIES ITS OWN COEFFICIENT AND THAT IS DELIBERATE.** Picking a fitting SEEDS `k`
	 * from the table above; the document then holds the number, so a later revision of this file
	 * cannot silently move an answer somebody has already reported. It is the same rule the rest of
	 * this suite is under: a number in a document is the user's, and nothing of ours rewrites one.
	 *
	 * An item whose `fit` names nothing in the table is the "other fitting" row, where the user
	 * states the coefficient themselves. Its `k` is read exactly the same way, which is why there is
	 * no branch here.
	 */
	function itemK(it) {
		var k = it && it.k;
		return (typeof k === 'number' && isFinite(k)) ? k : 0;
	}
	function itemQty(it) {
		var q = it && it.qty;
		return (typeof q === 'number' && isFinite(q)) ? q : 0;
	}

	EngCalcs.lpnFittingCatalog = CATALOG;
	/** The catalogue entry for a stored token, or null for the "other fitting" row. */
	EngCalcs.lpnFittingCatalogEntry = function (key) {
		var i;
		for (i = 0; i < CATALOG.length; i++) { if (CATALOG[i].key === key) { return CATALOG[i]; } }
		return null;
	};
	/**
	 * **THE WHOLE ARITHMETIC, IN ONE PLACE:** k = sum(quantity x coefficient). A set with no items
	 * sums to 0, which is the same answer as no set at all and is correct -- an empty list is a
	 * statement that this pipe has no fittings, not a missing number.
	 */
	EngCalcs.lpnFittingsSum = function (set) {
		var items = (set && set.items) || [], total = 0, i;
		for (i = 0; i < items.length; i++) { total += itemQty(items[i]) * itemK(items[i]); }
		return total;
	};
	/** A set by id out of a document's list. Bound by ID, never by name: dev/pipe-library-design.md §4. */
	EngCalcs.lpnFittingsSetById = function (list, id) {
		var i;
		if (id === undefined || id === null || id === '') { return null; }
		for (i = 0; i < (list || []).length; i++) {
			if (list[i] && list[i].id === id) { return list[i]; }
		}
		return null;
	};
}(typeof globalThis !== 'undefined' ? globalThis : this));

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
