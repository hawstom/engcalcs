// lpn-ramps.js -- COLOUR RAMPS and RANGE ALLOCATION, as pure data and pure arithmetic
// (ROADMAP Tasks 427, 429).
//
// Split from everything else by PURITY, the rule js/lpn-geom.js states: every function here takes
// values and returns values. No DOM, no `doc`, no `settings`, no closure state, no globals but
// EngCalcs. The picker, the legend and the map are somebody else's file; this one answers three
// questions and nothing more:
//
//   1. WHICH COLOURS -- a catalogue of 41 ramps in Cynthia Brewer's three families, each published
//      at 3, 4, 5, 6 and 7 classes.
//   2. WHERE THE CLASS BOUNDARIES GO -- the five allocation modes GIS names, as
//      (values[], classCount) -> breaks[], plus validation of breaks a user typed by hand.
//   3. HOW WIDE EACH SWATCH IS -- uniform-width box geometry, so no caller can get it wrong by
//      hand. (It was got wrong by hand; that is why this function exists.)
//
// NO UNITS, the same rule js/lpn-patterns.js states. A break value is a number in whatever unit
// the caller is holding its values in -- this file never converts and never guesses. Colouring is
// READ-ONLY with respect to the document, so setProp() is not involved anywhere below.
//
// ============================================================================================
// BREAKS AND CLASSES: the counting convention, stated once
// ============================================================================================
//
// **n classes are separated by n-1 interior break values.** 7 classes, 6 breaks. This matches what
// the page already does (five bands, four break boxes) and what every GIS means by the word.
// Breaks are ascending and strictly increasing. A value falls in class i where i is the number of
// breaks it is greater than or equal to -- so a value exactly ON a break belongs to the class
// ABOVE it, and the lowest class is unbounded below, the highest unbounded above. Those two
// unbounded ends are deliberate: a solve at another timestep, or a network the user then edits,
// must still get a colour.
//
// ============================================================================================
// LICENCE AND ATTRIBUTION -- read this before adding, removing or renaming a ramp
// ============================================================================================
//
// **ColorBrewer (35 of the 41 ramps).** Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
// Pennsylvania State University; licensed under the Apache License, Version 2.0, whose text is at
// https://colorbrewer2.org/export/LICENSE.txt. Apache-2.0 is one-way compatible with this suite's
// GPL v3, so the schemes may ship here. The licence imposes two obligations that are OUR job, not
// the library's:
//
//   * **Clause 2 -- the acknowledgement, verbatim.** "The end-user documentation included with the
//     redistribution, if any, must include the following acknowledgment: 'This product includes
//     color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).'
//     Alternately, this acknowledgment may appear in the software itself." It appears in the
//     software: CREDITS below carries that exact sentence, and the UI must render it wherever the
//     ramps are chosen. It is DELIBERATELY NOT A LANGUAGE KEY -- a licence-required acknowledgement
//     is a legal artifact whose wording is fixed by the licence, and translating it would change
//     the text the licence requires. Ship it untranslated, in English, as it stands.
//   * **Clauses 4 and 5 -- the name.** "ColorBrewer" must not be used to endorse or promote, and
//     products derived from the software may not be called ColorBrewer. So **no control, menu,
//     heading or product name here says "ColorBrewer".** The picker is a Ramp picker; the families
//     are sequential / diverging / qualitative. Naming the source in a credit line and in this
//     comment is attribution, which the licence requires, not promotion, which it forbids.
//
// **viridis, magma, inferno, plasma (4 ramps).** By Nathaniel J. Smith, Stefan van der Walt and (for
// viridis) Eric Firing, released CC0 / public domain, https://github.com/BIDS/colormap. CC0 imposes
// no legal condition; the authors ask for credit, and CREDITS gives it.
//
// **EPANET's rainbow (1 ramp).** The five map colours of EPANET 2.2, a US EPA work in the public
// domain. Kept unsoftened -- matching what a user already reads in EPANET is worth more here than a
// prettier ramp. It is our heritage default and must not be dropped.
//
// **Gray (1 ramp).** Ours, for a printed sheet and for photocopies.
//
// ============================================================================================
// PROVENANCE OF THE NUMBERS -- which hexes are published and which are computed
// ============================================================================================
//
// Not one hex below was typed by hand. Every value was generated from a fetched source; the
// generator, the source URLs and the checksums are recorded in dev/color-ramps.md.
//
//   * `source: 'brewer'`, `interpolated: false` -- Brewer PUBLISHES a separate, individually
//     designed set for each class count, and they are not samples of one another (her 5-class
//     YlGnBu is not her 7-class YlGnBu with two colours removed). Each count is taken verbatim from
//     her own table. **Never interpolate a Brewer ramp**; doing so throws away the design work that
//     is the entire reason to use them.
//   * `source: 'bids'`, `interpolated: true` -- viridis and friends are published as a continuous
//     256-entry table, not as class sets, so there is nothing to take verbatim. Each count is
//     sampled from that published table at evenly spaced positions with both endpoints included.
//   * `source: 'epa' | 'engcalcs'`, `interpolated: true` -- EPANET's rainbow and our Gray exist only
//     as five stops, so the other counts are piecewise-linear in sRGB between them. The 5-class set
//     reproduces the five shipped stops EXACTLY, which the generator asserts.
//
// A ramp we could not verify was DROPPED rather than guessed: `cividis` is in matplotlib but its
// CC0 dedication is not stated at a source we could fetch, so it is not here. Brewer's 8-, 9-,
// 10-, 11- and 12-class sets exist and are not here either, because the picker offers 3 to 7.

(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	var MIN_CLASSES = 3;
	var MAX_CLASSES = 7;

	// ============================================================================================
	// 1. THE CATALOGUE
	// ============================================================================================
	//
	// `name` is the scheme's own published identifier -- a proper noun, so it is not a language key
	// and is not translated. Tom's picker shows COLOUR, not names; `name` is for a title attribute,
	// a saved project file and a bug report.
	//
	// A ramp key, once shipped, is stored in saved projects. Renaming one silently breaks them.
	var RAMPS = {
		blues: { name: "Blues", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#deebf7', '#9ecae1', '#3182bd'],
			4: ['#eff3ff', '#bdd7e7', '#6baed6', '#2171b5'],
			5: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'],
			6: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
			7: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594']
		} },
		bugn: { name: "BuGn", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#e5f5f9', '#99d8c9', '#2ca25f'],
			4: ['#edf8fb', '#b2e2e2', '#66c2a4', '#238b45'],
			5: ['#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'],
			6: ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#2ca25f', '#006d2c'],
			7: ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824']
		} },
		bupu: { name: "BuPu", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#e0ecf4', '#9ebcda', '#8856a7'],
			4: ['#edf8fb', '#b3cde3', '#8c96c6', '#88419d'],
			5: ['#edf8fb', '#b3cde3', '#8c96c6', '#8856a7', '#810f7c'],
			6: ['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8856a7', '#810f7c'],
			7: ['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b']
		} },
		gnbu: { name: "GnBu", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#e0f3db', '#a8ddb5', '#43a2ca'],
			4: ['#f0f9e8', '#bae4bc', '#7bccc4', '#2b8cbe'],
			5: ['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac'],
			6: ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#43a2ca', '#0868ac'],
			7: ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e']
		} },
		greens: { name: "Greens", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#e5f5e0', '#a1d99b', '#31a354'],
			4: ['#edf8e9', '#bae4b3', '#74c476', '#238b45'],
			5: ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'],
			6: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'],
			7: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32']
		} },
		greys: { name: "Greys", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#f0f0f0', '#bdbdbd', '#636363'],
			4: ['#f7f7f7', '#cccccc', '#969696', '#525252'],
			5: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'],
			6: ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#636363', '#252525'],
			7: ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525']
		} },
		orrd: { name: "OrRd", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#fee8c8', '#fdbb84', '#e34a33'],
			4: ['#fef0d9', '#fdcc8a', '#fc8d59', '#d7301f'],
			5: ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'],
			6: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000'],
			7: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000']
		} },
		oranges: { name: "Oranges", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#fee6ce', '#fdae6b', '#e6550d'],
			4: ['#feedde', '#fdbe85', '#fd8d3c', '#d94701'],
			5: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
			6: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'],
			7: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04']
		} },
		pubu: { name: "PuBu", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#ece7f2', '#a6bddb', '#2b8cbe'],
			4: ['#f1eef6', '#bdc9e1', '#74a9cf', '#0570b0'],
			5: ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'],
			6: ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#2b8cbe', '#045a8d'],
			7: ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b']
		} },
		pubugn: { name: "PuBuGn", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#ece2f0', '#a6bddb', '#1c9099'],
			4: ['#f6eff7', '#bdc9e1', '#67a9cf', '#02818a'],
			5: ['#f6eff7', '#bdc9e1', '#67a9cf', '#1c9099', '#016c59'],
			6: ['#f6eff7', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099', '#016c59'],
			7: ['#f6eff7', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016450']
		} },
		purd: { name: "PuRd", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#e7e1ef', '#c994c7', '#dd1c77'],
			4: ['#f1eef6', '#d7b5d8', '#df65b0', '#ce1256'],
			5: ['#f1eef6', '#d7b5d8', '#df65b0', '#dd1c77', '#980043'],
			6: ['#f1eef6', '#d4b9da', '#c994c7', '#df65b0', '#dd1c77', '#980043'],
			7: ['#f1eef6', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#91003f']
		} },
		purples: { name: "Purples", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#efedf5', '#bcbddc', '#756bb1'],
			4: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#6a51a3'],
			5: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'],
			6: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'],
			7: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486']
		} },
		rdpu: { name: "RdPu", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#fde0dd', '#fa9fb5', '#c51b8a'],
			4: ['#feebe2', '#fbb4b9', '#f768a1', '#ae017e'],
			5: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'],
			6: ['#feebe2', '#fcc5c0', '#fa9fb5', '#f768a1', '#c51b8a', '#7a0177'],
			7: ['#feebe2', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177']
		} },
		reds: { name: "Reds", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#fee0d2', '#fc9272', '#de2d26'],
			4: ['#fee5d9', '#fcae91', '#fb6a4a', '#cb181d'],
			5: ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'],
			6: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'],
			7: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d']
		} },
		ylgn: { name: "YlGn", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#f7fcb9', '#addd8e', '#31a354'],
			4: ['#ffffcc', '#c2e699', '#78c679', '#238443'],
			5: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
			6: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
			7: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32']
		} },
		ylgnbu: { name: "YlGnBu", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#edf8b1', '#7fcdbb', '#2c7fb8'],
			4: ['#ffffcc', '#a1dab4', '#41b6c4', '#225ea8'],
			5: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
			6: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'],
			7: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84']
		} },
		ylorbr: { name: "YlOrBr", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#fff7bc', '#fec44f', '#d95f0e'],
			4: ['#ffffd4', '#fed98e', '#fe9929', '#cc4c02'],
			5: ['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404'],
			6: ['#ffffd4', '#fee391', '#fec44f', '#fe9929', '#d95f0e', '#993404'],
			7: ['#ffffd4', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#8c2d04']
		} },
		ylorrd: { name: "YlOrRd", family: "sequential", source: "brewer", interpolated: false, colors: {
			3: ['#ffeda0', '#feb24c', '#f03b20'],
			4: ['#ffffb2', '#fecc5c', '#fd8d3c', '#e31a1c'],
			5: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
			6: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'],
			7: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026']
		} },
		viridis: { name: "Viridis", family: "sequential", source: "bids", interpolated: true, colors: {
			3: ['#440154', '#21918c', '#fde725'],
			4: ['#440154', '#31688e', '#35b779', '#fde725'],
			5: ['#440154', '#3b528b', '#21918c', '#5cc863', '#fde725'],
			6: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'],
			7: ['#440154', '#443a83', '#31688e', '#21918c', '#35b779', '#90d743', '#fde725']
		} },
		magma: { name: "Magma", family: "sequential", source: "bids", interpolated: true, colors: {
			3: ['#000004', '#b73779', '#fcfdbf'],
			4: ['#000004', '#721f81', '#f1605d', '#fcfdbf'],
			5: ['#000004', '#51127c', '#b73779', '#fb8761', '#fcfdbf'],
			6: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf'],
			7: ['#000004', '#2d1161', '#721f81', '#b73779', '#f1605d', '#feb078', '#fcfdbf']
		} },
		inferno: { name: "Inferno", family: "sequential", source: "bids", interpolated: true, colors: {
			3: ['#000004', '#bc3754', '#fcffa4'],
			4: ['#000004', '#781c6d', '#ed6925', '#fcffa4'],
			5: ['#000004', '#57106e', '#bc3754', '#f98c0a', '#fcffa4'],
			6: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'],
			7: ['#000004', '#340a5f', '#781c6d', '#bc3754', '#ed6925', '#fbb61a', '#fcffa4']
		} },
		plasma: { name: "Plasma", family: "sequential", source: "bids", interpolated: true, colors: {
			3: ['#0d0887', '#cc4778', '#f0f921'],
			4: ['#0d0887', '#9c179e', '#ed7953', '#f0f921'],
			5: ['#0d0887', '#7e03a8', '#cc4778', '#f89441', '#f0f921'],
			6: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
			7: ['#0d0887', '#5e01a6', '#9c179e', '#cc4778', '#ed7953', '#fdb42f', '#f0f921']
		} },
		epanet: { name: "EPANET", family: "sequential", source: "epa", interpolated: true, colors: {
			3: ['#0000ff', '#00ff00', '#ff0000'],
			4: ['#0000ff', '#00ffaa', '#aaff00', '#ff0000'],
			5: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
			6: ['#0000ff', '#00ccff', '#00ff66', '#66ff00', '#ffcc00', '#ff0000'],
			7: ['#0000ff', '#00aaff', '#00ffaa', '#00ff00', '#aaff00', '#ffaa00', '#ff0000']
		} },
		gray: { name: "Gray", family: "sequential", source: "engcalcs", interpolated: true, colors: {
			3: ['#dddddd', '#777777', '#000000'],
			4: ['#dddddd', '#999999', '#555555', '#000000'],
			5: ['#dddddd', '#aaaaaa', '#777777', '#444444', '#000000'],
			6: ['#dddddd', '#b4b4b4', '#8b8b8b', '#636363', '#363636', '#000000'],
			7: ['#dddddd', '#bbbbbb', '#999999', '#777777', '#555555', '#2d2d2d', '#000000']
		} },
		brbg: { name: "BrBG", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#d8b365', '#f5f5f5', '#5ab4ac'],
			4: ['#a6611a', '#dfc27d', '#80cdc1', '#018571'],
			5: ['#a6611a', '#dfc27d', '#f5f5f5', '#80cdc1', '#018571'],
			6: ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e'],
			7: ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e']
		} },
		prgn: { name: "PRGn", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#af8dc3', '#f7f7f7', '#7fbf7b'],
			4: ['#7b3294', '#c2a5cf', '#a6dba0', '#008837'],
			5: ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837'],
			6: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
			7: ['#762a83', '#af8dc3', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#7fbf7b', '#1b7837']
		} },
		piyg: { name: "PiYG", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#e9a3c9', '#f7f7f7', '#a1d76a'],
			4: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
			5: ['#d01c8b', '#f1b6da', '#f7f7f7', '#b8e186', '#4dac26'],
			6: ['#c51b7d', '#e9a3c9', '#fde0ef', '#e6f5d0', '#a1d76a', '#4d9221'],
			7: ['#c51b7d', '#e9a3c9', '#fde0ef', '#f7f7f7', '#e6f5d0', '#a1d76a', '#4d9221']
		} },
		puor: { name: "PuOr", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#f1a340', '#f7f7f7', '#998ec3'],
			4: ['#e66101', '#fdb863', '#b2abd2', '#5e3c99'],
			5: ['#e66101', '#fdb863', '#f7f7f7', '#b2abd2', '#5e3c99'],
			6: ['#b35806', '#f1a340', '#fee0b6', '#d8daeb', '#998ec3', '#542788'],
			7: ['#b35806', '#f1a340', '#fee0b6', '#f7f7f7', '#d8daeb', '#998ec3', '#542788']
		} },
		rdbu: { name: "RdBu", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
			4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
			5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
			6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
			7: ['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac']
		} },
		rdgy: { name: "RdGy", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#ef8a62', '#ffffff', '#999999'],
			4: ['#ca0020', '#f4a582', '#bababa', '#404040'],
			5: ['#ca0020', '#f4a582', '#ffffff', '#bababa', '#404040'],
			6: ['#b2182b', '#ef8a62', '#fddbc7', '#e0e0e0', '#999999', '#4d4d4d'],
			7: ['#b2182b', '#ef8a62', '#fddbc7', '#ffffff', '#e0e0e0', '#999999', '#4d4d4d']
		} },
		rdylbu: { name: "RdYlBu", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#fc8d59', '#ffffbf', '#91bfdb'],
			4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
			5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
			6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
			7: ['#d73027', '#fc8d59', '#fee090', '#ffffbf', '#e0f3f8', '#91bfdb', '#4575b4']
		} },
		rdylgn: { name: "RdYlGn", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#fc8d59', '#ffffbf', '#91cf60'],
			4: ['#d7191c', '#fdae61', '#a6d96a', '#1a9641'],
			5: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'],
			6: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
			7: ['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850']
		} },
		spectral: { name: "Spectral", family: "diverging", source: "brewer", interpolated: false, colors: {
			3: ['#fc8d59', '#ffffbf', '#99d594'],
			4: ['#d7191c', '#fdae61', '#abdda4', '#2b83ba'],
			5: ['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'],
			6: ['#d53e4f', '#fc8d59', '#fee08b', '#e6f598', '#99d594', '#3288bd'],
			7: ['#d53e4f', '#fc8d59', '#fee08b', '#ffffbf', '#e6f598', '#99d594', '#3288bd']
		} },
		accent: { name: "Accent", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#7fc97f', '#beaed4', '#fdc086'],
			4: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99'],
			5: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0'],
			6: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f'],
			7: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17']
		} },
		dark2: { name: "Dark2", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#1b9e77', '#d95f02', '#7570b3'],
			4: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a'],
			5: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e'],
			6: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
			7: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d']
		} },
		paired: { name: "Paired", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#a6cee3', '#1f78b4', '#b2df8a'],
			4: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'],
			5: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
			6: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c'],
			7: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f']
		} },
		pastel1: { name: "Pastel1", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#fbb4ae', '#b3cde3', '#ccebc5'],
			4: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4'],
			5: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6'],
			6: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc'],
			7: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd']
		} },
		pastel2: { name: "Pastel2", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#b3e2cd', '#fdcdac', '#cbd5e8'],
			4: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4'],
			5: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9'],
			6: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'],
			7: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc']
		} },
		set1: { name: "Set1", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#e41a1c', '#377eb8', '#4daf4a'],
			4: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'],
			5: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
			6: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
			7: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628']
		} },
		set2: { name: "Set2", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#66c2a5', '#fc8d62', '#8da0cb'],
			4: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3'],
			5: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'],
			6: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f'],
			7: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494']
		} },
		set3: { name: "Set3", family: "qualitative", source: "brewer", interpolated: false, colors: {
			3: ['#8dd3c7', '#ffffb3', '#bebada'],
			4: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072'],
			5: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
			6: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462'],
			7: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69']
		} }
	};

	// The families, in the order the picker groups them, using Brewer's own vocabulary -- the words
	// matplotlib, d3, QGIS and ArcGIS all use. (epanet-js says "Continuous" for the first; that is
	// the non-standard word and this page does not use it.)
	//
	//   sequential  -- ordered low to high, one direction of lightness. The default for a measured
	//                  quantity, which is what a network is almost always coloured by.
	//   diverging   -- two ordered halves either side of a meaningful middle. Right for a signed
	//                  quantity or a departure from a target; WRONG for pressure unless the user has
	//                  put a break at the value that middle means.
	//   qualitative -- unordered, maximally distinguishable. Right for a CATEGORY (pipe material,
	//                  pressure zone, status) and WRONG for a measured quantity, because it asserts
	//                  its classes have no order. Offered because the page will grow category
	//                  fields; a picker must not silently make that choice unavailable.
	var FAMILIES = ['sequential', 'diverging', 'qualitative'];

	// Ramp keys per family, in catalogue order. Derived, never typed -- a hand-written second list
	// is the thing that goes stale when a ramp is added.
	function rampKeys(family) {
		var out = [], k;
		for (k in RAMPS) {
			if (Object.prototype.hasOwnProperty.call(RAMPS, k) && (!family || RAMPS[k].family === family)) {
				out.push(k);
			}
		}
		return out;
	}

	// The credit lines. Untranslated by design (see the licence note at the top). The UI renders
	// every entry whose ramps it can reach -- which, since the picker offers all of them, is all.
	var CREDITS = [
		{
			source: 'brewer',
			// VERBATIM from clause 2 of the licence. Do not reword, do not shorten, do not translate.
			text: 'This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).',
			url: 'https://colorbrewer2.org/',
			licence: 'Apache-2.0'
		},
		{
			source: 'bids',
			text: 'viridis, magma, inferno and plasma by Nathaniel J. Smith, Stefan van der Walt and Eric Firing, released CC0.',
			url: 'https://github.com/BIDS/colormap',
			licence: 'CC0'
		},
		{
			source: 'epa',
			text: 'The EPANET color scheme is from EPANET 2.2, US Environmental Protection Agency, public domain.',
			url: 'https://www.epa.gov/water-research/epanet',
			licence: 'public domain'
		}
	];

	/**
	 * The colours of one ramp at one class count.
	 *
	 * @param {string} key         a key of RAMPS. An unknown key falls back to 'epanet' rather than
	 *                             throwing -- a saved project naming a ramp we later dropped must
	 *                             still open, and a map with the wrong colours beats a blank page.
	 * @param {number} classCount  3..7. Outside that range it is CLAMPED, not rejected: the caller
	 *                             is often a stored setting, and a clamp is visible on screen while
	 *                             an exception is not.
	 * @param {object} [opts]      {reverse: true} to run the ramp high-to-low.
	 * @returns {string[]} a fresh array of `classCount` '#rrggbb' strings.
	 */
	function rampColors(key, classCount, opts) {
		var r = RAMPS[key] || RAMPS.epanet,
			n = clampClasses(classCount),
			cols = r.colors[n].slice();
		if (opts && opts.reverse) { cols.reverse(); }
		return cols;
	}

	function clampClasses(n) {
		n = Math.round(Number(n));
		if (!isFinite(n)) { return MAX_CLASSES; }
		return n < MIN_CLASSES ? MIN_CLASSES : n > MAX_CLASSES ? MAX_CLASSES : n;
	}

	/**
	 * Which class a value falls in. Returns 0..breaks.length. See the counting convention at the
	 * top: a value equal to a break belongs to the class ABOVE it.
	 *
	 * A value that is not a finite number returns null, NOT class 0. An undefined value must not be
	 * coloured "low" -- a pump has no velocity, and asserting "low velocity" about it is a lie the
	 * eye cannot detect. The caller draws such an element in its ordinary colour.
	 */
	function classIndex(value, breaks) {
		var v = Number(value), i;
		if (value === null || value === undefined || value === '' || !isFinite(v)) { return null; }
		for (i = 0; i < breaks.length; i++) {
			if (v < breaks[i]) { return i; }
		}
		return breaks.length;
	}

	// ============================================================================================
	// 2. THE FIVE RANGE ALLOCATION MODES
	// ============================================================================================
	//
	// Each is a pure (values[], classCount) -> breaks[] of length classCount-1, strictly increasing
	// and finite. **Every one of them has a failure mode, stated on the function**, because the
	// wrong mode does not look wrong: a map is equally colourful whichever one produced it, and the
	// only symptom of a bad allocation is that the map says something untrue quietly.
	//
	// Tom's framing (2026-08-18) is a "Ranges submenu (system)": a class count (3 to 7, dropdown),
	// one of these five modes, and the resulting breaks shown AT THE BOTTOM where the user can tweak
	// them. So the modes GENERATE and validateBreaks() ACCEPTS -- a hand-edited break list is a
	// first-class input here, not an afterthought.

	var MODES = [
		{ key: 'equal', name: 'Equal interval' },
		{ key: 'quantile', name: 'Quantile (equal count)' },
		{ key: 'jenks', name: 'Natural breaks (Jenks)' },
		{ key: 'stddev', name: 'Standard deviation' },
		{ key: 'pretty', name: 'Pretty (rounded)' }
	];

	// Finite numbers only, ascending. Every mode starts here, so every mode ignores an element with
	// no value for the field rather than treating it as zero.
	function cleanValues(values) {
		var out = [], i, v;
		for (i = 0; i < (values ? values.length : 0); i++) {
			v = Number(values[i]);
			if (values[i] !== null && values[i] !== undefined && values[i] !== '' && isFinite(v)) { out.push(v); }
		}
		out.sort(function (a, b) { return a - b; });
		return out;
	}

	// THE DEGENERATE CASES, answered in one place so five modes do not each answer them differently.
	//
	//   * NO values at all -- nothing has been solved yet, or the field is empty on every element.
	//     Breaks over 0..1, so the legend draws and the picker has numbers to show. Not an error:
	//     the panel opens before the first solve.
	//   * ONE value, or every value EQUAL (a network where every pipe carries 0 gpm). There is no
	//     range to divide, so a span is INVENTED around the value -- |v| or 1, whichever is larger.
	//     The map then colours every element the same, which is the truth.
	//
	// Both return usable, strictly increasing, finite breaks. Neither returns NaN, and neither
	// returns fewer breaks than asked for, because a caller that got 2 breaks for 7 classes would
	// index past the end of its colour array.
	function degenerateSpan(vals) {
		var lo, hi, v, r;
		if (!vals.length) { return { lo: 0, hi: 1 }; }
		lo = vals[0];
		hi = vals[vals.length - 1];
		if (hi > lo) { return { lo: lo, hi: hi }; }
		v = lo;
		r = Math.abs(v) || 1;
		return { lo: v - r / 2, hi: v + r / 2 };
	}

	/**
	 * EQUAL INTERVAL -- the range cut into equal-width slices.
	 *
	 * FAILURE MODE: one outlier owns the whole scale. A network with 200 pipes under 3 ft/s and one
	 * pump discharge at 40 ft/s puts 199 pipes in class 0, and the map reads as uniformly low when
	 * the real variation is entirely inside that first class. Equal interval describes the RANGE,
	 * not the DISTRIBUTION, and only equal interval makes two networks' legends directly comparable.
	 */
	function equalIntervalBreaks(values, classCount) {
		var n = clampClasses(classCount),
			s = degenerateSpan(cleanValues(values)),
			step = (s.hi - s.lo) / n,
			out = [], i;
		for (i = 1; i < n; i++) { out.push(s.lo + step * i); }
		return enforceStrict(out, s.lo, s.hi);
	}

	/**
	 * QUANTILE (equal count) -- each class holds the same number of elements.
	 *
	 * FAILURE MODE, and it is the one this network type hits constantly: TIES. On a network where 90
	 * of 120 pipes carry exactly 0 gpm, three quarters of the quantiles land on 0, and the breaks
	 * are degenerate -- several classes describing the same value. This function does not hide that.
	 * It nudges the duplicates apart by the smallest amount that keeps them strictly increasing, so
	 * the caller gets the class count it asked for, and the result is a legend with several
	 * near-empty classes stacked at 0. **That is the honest picture of a network with a lot of dead
	 * ends**, and the fix is for the user to pick another mode, not for this function to invent a
	 * spread that is not in the data.
	 *
	 * Second failure mode: quantile breaks depend on the population, so the legend changes whenever
	 * an element is added or a valve closes. Two timesteps are then not comparable by eye.
	 */
	function quantileBreaks(values, classCount) {
		var vals = cleanValues(values),
			n = clampClasses(classCount),
			s = degenerateSpan(vals),
			out = [], i, p, pos, lo, frac;
		if (vals.length < 2) { return equalIntervalBreaks(values, n); }
		for (i = 1; i < n; i++) {
			p = i / n;
			pos = p * (vals.length - 1);      // linear interpolation between order statistics
			lo = Math.floor(pos);
			frac = pos - lo;
			out.push(lo + 1 < vals.length ? vals[lo] + (vals[lo + 1] - vals[lo]) * frac : vals[lo]);
		}
		return enforceStrict(out, s.lo, s.hi);
	}

	// The maximum population Jenks is run on directly. Above it the values are STRIDE-SAMPLED down
	// to this many, deterministically (never randomly -- the same network must produce the same
	// legend twice), and the breaks are computed on the sample.
	//
	// WHY A CAP AT ALL: Fisher-Jenks is O(k * n^2) in time and memory. At n = 40,000 -- a real
	// distribution model, not a hypothetical -- that is 1.6 billion cell visits per class, which
	// locks the browser tab for minutes and may simply run out of memory. At n = 1,200 it is
	// milliseconds. Stride sampling preserves the shape of a sorted distribution well, and the
	// breaks it yields are within rounding of the exact ones for any distribution a network has.
	var JENKS_MAX = 1200;

	/**
	 * NATURAL BREAKS (Jenks) -- boundaries placed where the sorted data has its real gaps, by
	 * minimising the sum of squared deviation within classes. The Fisher-Jenks dynamic program.
	 *
	 * FAILURE MODE, two of them:
	 *   * COST. See JENKS_MAX above -- this is the one mode that is not free, and on a large model
	 *     it runs on a sample rather than the population. The breaks are then very close to, but not
	 *     identical to, the exact answer.
	 *   * IT IS NOT COMPARABLE OR REPRODUCIBLE ACROSS DATASETS. Natural breaks are a property of THIS
	 *     set of values; two timesteps, two scenarios or two networks get different, incommensurable
	 *     legends. It is the best mode for reading one map and the worst for comparing two.
	 */
	function jenksBreaks(values, classCount) {
		var vals = cleanValues(values),
			n = clampClasses(classCount),
			s = degenerateSpan(vals),
			sample, stride, i, j, k, m, sum, sumSq, w, v, i4, lower, out;
		if (vals.length < 2) { return equalIntervalBreaks(values, n); }
		if (vals.length <= n) { return equalIntervalBreaks(values, n); }

		sample = vals;
		if (vals.length > JENKS_MAX) {
			sample = [];
			stride = (vals.length - 1) / (JENKS_MAX - 1);
			for (i = 0; i < JENKS_MAX; i++) { sample.push(vals[Math.round(i * stride)]); }
		}
		m = sample.length;

		// mat1[i][j] = index of the first element of class j when the first i elements are split
		// into j classes; mat2[i][j] = the variance cost of that split.
		var mat1 = [], mat2 = [];
		for (i = 0; i <= m; i++) {
			mat1.push(new Array(n + 1).fill(0));
			mat2.push(new Array(n + 1).fill(Infinity));
		}
		for (j = 1; j <= n; j++) { mat1[1][j] = 1; mat2[1][j] = 0; }
		for (i = 2; i <= m; i++) {
			sum = 0; sumSq = 0; w = 0;
			for (j = i; j >= 1; j--) {
				v = sample[j - 1];
				w++;
				sum += v;
				sumSq += v * v;
				var variance = sumSq - (sum * sum) / w;
				i4 = j - 1;
				if (i4 !== 0) {
					for (k = 2; k <= n; k++) {
						if (mat2[i][k] >= variance + mat2[i4][k - 1]) {
							mat1[i][k] = j;
							mat2[i][k] = variance + mat2[i4][k - 1];
						}
					}
				}
			}
			mat1[i][1] = 1;
			mat2[i][1] = sumSq - (sum * sum) / w;
		}

		out = [];
		k = m;
		for (j = n; j >= 2; j--) {
			lower = mat1[k][j] - 1;
			out.unshift(sample[lower]);   // the first value of class j is its lower boundary
			k = mat1[k][j] - 1;
		}
		return enforceStrict(out, s.lo, s.hi);
	}

	/**
	 * STANDARD DEVIATION -- classes one standard deviation wide, arranged symmetrically about the
	 * mean. For an odd class count the mean sits in the middle of the middle class; for an even one
	 * the mean IS the middle break.
	 *
	 * FAILURE MODE: it is only meaningful on a roughly symmetric distribution, and network
	 * quantities usually are not. Velocity is strongly right-skewed (most pipes near zero, a few
	 * high), so the mean sits above the bulk of the data and the lower classes come out empty while
	 * the top class holds a long tail. Worse, the legend then reads as a statement about the data's
	 * shape -- "this is two sigma above average" -- which is exactly the claim a skewed distribution
	 * does not support. Right for a departure from a design target; wrong for a raw magnitude.
	 *
	 * Also: the breaks it computes can fall outside the data range entirely, which is legitimate
	 * (an empty class is information) and is NOT clamped away here.
	 */
	function stdDevBreaks(values, classCount) {
		var vals = cleanValues(values),
			n = clampClasses(classCount),
			s = degenerateSpan(vals),
			i, sum = 0, mean, varSum = 0, sd, out = [];
		if (vals.length < 2) { return equalIntervalBreaks(values, n); }
		for (i = 0; i < vals.length; i++) { sum += vals[i]; }
		mean = sum / vals.length;
		for (i = 0; i < vals.length; i++) { varSum += (vals[i] - mean) * (vals[i] - mean); }
		sd = Math.sqrt(varSum / vals.length);     // population sd: these ARE the population
		if (!(sd > 0)) { return equalIntervalBreaks(values, n); }
		// n-1 breaks at one sd spacing, centred on the mean.
		for (i = 0; i < n - 1; i++) { out.push(mean + (i - (n - 2) / 2) * sd); }
		return enforceStrict(out, s.lo, s.hi);
	}

	// The nice-number ladder pretty breaks may land on, per decade.
	var NICE = [1, 2, 2.5, 5, 10];

	/**
	 * PRETTY (rounded) -- equal-ish intervals snapped to round numbers, so the legend reads
	 * 10 / 20 / 30 rather than 9.7143 / 19.429 / 29.143. R calls this pretty(); ArcGIS and QGIS ship
	 * the same idea under "pretty breaks". It is what most users actually want on screen.
	 *
	 * HOW THE EXACT COUNT IS KEPT. A true pretty algorithm returns APPROXIMATELY the requested
	 * number of intervals, and a caller here cannot use approximately -- n colours need exactly
	 * n-1 breaks or the swatch and the map disagree. So: candidate round steps are tried from fine
	 * to coarse, and the first one that puts exactly n-1 round ticks strictly inside the data range
	 * wins. If none does, it falls back to equal-interval breaks rounded to the fewest decimal
	 * places that keeps them strictly increasing -- less pretty, still rounded, still exactly n-1.
	 *
	 * FAILURE MODE: rounding moves the boundaries, so the classes are no longer equal width and no
	 * longer align with anything in the data -- a break at a round 20 can sit in the middle of a
	 * dense cluster that a break at 19.4 would have missed. And on a very narrow range (every
	 * pressure between 52.10 and 52.14 psi) no round number is available, the fallback fires, and
	 * the result is equal interval wearing a hat.
	 */
	function prettyBreaks(values, classCount) {
		var vals = cleanValues(values),
			n = clampClasses(classCount),
			s = degenerateSpan(vals),
			raw = (s.hi - s.lo) / n,
			exps, e, ci, step, ticks, t, first, best = null, i;

		if (raw > 0 && isFinite(raw)) {
			exps = [];
			e = Math.floor(Math.log(raw) / Math.LN10);
			for (i = e - 1; i <= e + 1; i++) { exps.push(i); }
			for (i = 0; i < exps.length && !best; i++) {
				for (ci = 0; ci < NICE.length; ci++) {
					step = NICE[ci] * Math.pow(10, exps[i]);
					if (!(step > 0) || !isFinite(step)) { continue; }
					first = Math.ceil(s.lo / step) * step;
					ticks = [];
					for (t = first; t < s.hi && ticks.length <= n; t += step) {
						if (t > s.lo) { ticks.push(cleanFloat(t, step)); }
					}
					if (ticks.length === n - 1) { best = ticks; break; }
				}
			}
		}
		if (best) { return enforceStrict(best, s.lo, s.hi); }

		// Fallback: equal interval, rounded to the fewest decimals that stays strictly increasing.
		var eq = equalIntervalBreaks(values, n), d, rounded;
		for (d = 0; d <= 12; d++) {
			rounded = eq.map(function (v) { return roundTo(v, d); });
			if (isStrictlyIncreasing(rounded)) { return rounded; }
		}
		return eq;
	}

	// Kills the 0.30000000000000004 that walking a float step produces, without pretending to more
	// precision than the step has.
	function cleanFloat(v, step) {
		var d = Math.max(0, Math.ceil(-Math.log(step) / Math.LN10) + 2);
		return roundTo(v, Math.min(d, 12));
	}

	function roundTo(v, decimals) {
		var f = Math.pow(10, decimals);
		return Math.round(v * f) / f;
	}

	function isStrictlyIncreasing(a) {
		var i;
		for (i = 1; i < a.length; i++) { if (!(a[i] > a[i - 1])) { return false; } }
		return true;
	}

	// Guarantees the contract every mode promises: finite, strictly increasing, and exactly as many
	// breaks as were computed. Duplicates are nudged apart by the smallest step that survives double
	// precision at this magnitude. This is where quantile's tie degeneracy becomes visible-as-empty-
	// classes rather than invalid-as-NaN; it never invents a spread the data does not have.
	function enforceStrict(breaks, lo, hi) {
		var span = Math.abs(hi - lo) || Math.abs(hi) || 1,
			eps = span * 1e-9,
			out = [], i, v, prev = -Infinity;
		for (i = 0; i < breaks.length; i++) {
			v = Number(breaks[i]);
			if (!isFinite(v)) { v = prev === -Infinity ? lo : prev + eps; }
			if (v <= prev) { v = prev + eps; }
			// A nudge that double precision swallows is not a nudge; step up by one ULP instead.
			while (v <= prev) { v = v + Math.max(Math.abs(v) * 2.3e-16, Number.MIN_VALUE); }
			out.push(v);
			prev = v;
		}
		return out;
	}

	var MODE_FNS = {
		equal: equalIntervalBreaks,
		quantile: quantileBreaks,
		jenks: jenksBreaks,
		stddev: stdDevBreaks,
		pretty: prettyBreaks
	};

	/**
	 * The one entry point the UI needs: mode key + values + class count -> breaks.
	 * An unknown mode falls back to equal interval, for the same reason an unknown ramp falls back
	 * to epanet: a stored setting from a future or past version must still draw a map.
	 */
	function breaksFor(mode, values, classCount) {
		return (MODE_FNS[mode] || equalIntervalBreaks)(values, classCount);
	}

	/**
	 * Validate breaks a user typed into the boxes at the bottom of the Ranges submenu.
	 *
	 * Returns {ok, breaks, reason, index}. `reason` is a MACHINE key, not a sentence -- the wording
	 * of the message the user sees is a language key and belongs to the UI file, not here.
	 *   'count'      -- wrong number of breaks for the class count (index: how many were expected)
	 *   'not-number' -- a box that is empty or not a number (index: which box)
	 *   'not-finite' -- Infinity or NaN (index: which box)
	 *   'not-increasing' -- a box is not greater than the one before it (index: which box)
	 *
	 * It does NOT round, snap, clamp or reorder what the user typed. A user's number is the user's,
	 * the same rule the .inp importer follows; if it is wrong we say which box and why, and leave it
	 * on screen for them to fix.
	 */
	function validateBreaks(breaks, classCount) {
		var n = clampClasses(classCount), i, v, out = [];
		if (!breaks || breaks.length !== n - 1) {
			return { ok: false, reason: 'count', index: n - 1, breaks: null };
		}
		for (i = 0; i < breaks.length; i++) {
			if (breaks[i] === null || breaks[i] === undefined || breaks[i] === '') {
				return { ok: false, reason: 'not-number', index: i, breaks: null };
			}
			v = Number(breaks[i]);
			if (isNaN(v)) { return { ok: false, reason: 'not-number', index: i, breaks: null }; }
			if (!isFinite(v)) { return { ok: false, reason: 'not-finite', index: i, breaks: null }; }
			if (i > 0 && !(v > out[i - 1])) {
				return { ok: false, reason: 'not-increasing', index: i, breaks: null };
			}
			out.push(v);
		}
		return { ok: true, reason: null, index: -1, breaks: out };
	}

	// ============================================================================================
	// 3. SWATCH GEOMETRY
	// ============================================================================================

	/**
	 * n boxes of UNIFORM width across `width`.
	 *
	 * This function exists because the widths were got wrong by hand -- Tom, 2026-08-18: "the color
	 * boxes are not uniform widths". Every box gets the identical width `width / n`; none is widened
	 * to absorb a remainder, and none is positioned by accumulating (x += w), which is what makes
	 * the last box drift. `x` is computed from the index, so the boxes cannot creep.
	 *
	 * `total` is n * w, which may differ from `width` by one ULP. That residue is deliberately left
	 * in `total` rather than pushed into the last box: a sub-pixel gap at the right edge is
	 * invisible, and a last box a pixel wider than the rest is exactly the defect complained of.
	 *
	 * @param {number} width  the bar's width, in whatever unit the caller draws in (px, or SVG user
	 *                        units -- this file has none).
	 * @param {number} count  how many boxes.
	 * @param {object} [opts] {height, gap}. `gap` is subtracted BETWEEN boxes, never at the ends, so
	 *                        the bar still spans exactly `width`.
	 * @returns {{boxes: Array<{index,x,width,height}>, width: number, height: number, total: number}}
	 */
	function swatchBoxes(width, count, opts) {
		var w = Number(width), n = Math.round(Number(count)),
			o = opts || {},
			h = o.height === undefined ? 14 : Number(o.height),
			gap = o.gap === undefined ? 0 : Number(o.gap),
			slot, boxW, boxes = [], i;
		if (!isFinite(n) || n < 1) { n = 1; }
		if (!isFinite(w) || w <= 0) { w = 0; }
		if (!isFinite(h) || h < 0) { h = 0; }
		if (!isFinite(gap) || gap < 0) { gap = 0; }
		slot = w / n;
		boxW = slot - gap * (n - 1) / n;
		if (boxW < 0) { boxW = 0; }
		for (i = 0; i < n; i++) {
			boxes.push({ index: i, x: i * slot, width: boxW, height: h });
		}
		return { boxes: boxes, width: w, height: h, total: boxW * n + gap * (n - 1) };
	}

	/**
	 * The picker's closed state and its list rows are the same thing: a bar of colour, no names.
	 * One call gives the UI everything it needs to draw one row.
	 */
	function swatchBar(rampKey, classCount, width, opts) {
		var cols = rampColors(rampKey, classCount, opts),
			g = swatchBoxes(width, cols.length, opts), i;
		for (i = 0; i < g.boxes.length; i++) { g.boxes[i].color = cols[i]; }
		g.ramp = rampKey;
		g.name = (RAMPS[rampKey] || RAMPS.epanet).name;
		return g;
	}

	EC.lpnRamps = {
		MIN_CLASSES: MIN_CLASSES,
		MAX_CLASSES: MAX_CLASSES,
		RAMPS: RAMPS,
		FAMILIES: FAMILIES,
		CREDITS: CREDITS,
		MODES: MODES,
		JENKS_MAX: JENKS_MAX,
		rampKeys: rampKeys,
		rampColors: rampColors,
		clampClasses: clampClasses,
		classIndex: classIndex,
		breaksFor: breaksFor,
		equalIntervalBreaks: equalIntervalBreaks,
		quantileBreaks: quantileBreaks,
		jenksBreaks: jenksBreaks,
		stdDevBreaks: stdDevBreaks,
		prettyBreaks: prettyBreaks,
		validateBreaks: validateBreaks,
		swatchBoxes: swatchBoxes,
		swatchBar: swatchBar
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = EC; }

}(typeof globalThis !== 'undefined' ? globalThis : this));
