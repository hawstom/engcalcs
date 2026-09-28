// LABEL BENCH REFERENCE PLACER (b): MASTER, REPLAYED. The layout the shipped page drew for each
// scene, recorded by extract.js at the moment the scene was extracted (master/*.json, and
// judges/master/*.json for the judges' scenes).
//
// **WHY A REPLAY AND NOT A LIVE CALL.** Master's placer is not a function of a view: it is a chain
// of passes inside js/looped-network.js (placeStationedLabels, placeLabelsFirstFit, the property
// shed, the ring pass, repairCrossingGangs, the crossing shed, yieldStationedLabels) that rebuilds
// glyphs and re-measures the DOM between them. Driving it from bench input would mean
// re-implementing that orchestration, which is the thing being replaced. The replay is exact for
// the scenes it was recorded on; it cannot place a scene it has not seen, and its time is the
// page's own refreshLabelText() pass on the node DOM stub (content AND layout, so it overstates
// placement alone), reported in place of a measured place() time.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const DIRS = [path.join(__dirname, '../master'), path.join(__dirname, '../judges/master')];
let byId = null;
function load() {
	if (byId) { return byId; }
	byId = {};
	DIRS.forEach(function (d) {
		if (!fs.existsSync(d)) { return; }
		fs.readdirSync(d).filter(function (f) { return /\.json$/.test(f); }).forEach(function (f) {
			JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')).steps.forEach(function (s) { byId[s.id] = s; });
		});
	});
	return byId;
}

module.exports = {
	name: 'master (replayed from the page)',
	// The page's recorded pass time for the scene last placed; run.js reports it when present.
	recordedMs: null,
	place: function (scene) {
		const rec = load()[scene.id];
		if (!rec) { throw new Error('master-replay: no recording for ' + scene.id + '; run extract.js'); }
		module.exports.recordedMs = rec.ms;
		return { labels: rec.labels, recordedMs: rec.ms };
	}
};
