// THE SHIPPED PLACER, REPLAYED: the layouts production (9c71d54f) or master drew for each scene, as
// recorded by the bench's extract.js run inside a `git archive` of that commit. The directory is
// VSP_REPLAY_DIR. Like placers/master-replay.js, its time is the page's whole refreshLabelText() pass
// (label text AND layout, on the node DOM stub), so it overstates placement alone. JUDGES' SIDE.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

let byId = null;
function load() {
	if (byId) { return byId; }
	byId = {};
	const d = process.env.VSP_REPLAY_DIR;
	if (!d) { throw new Error('replay.js: set VSP_REPLAY_DIR'); }
	fs.readdirSync(d).filter(function (f) { return /\.json$/.test(f); }).forEach(function (f) {
		JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')).steps.forEach(function (s) { byId[s.id] = s; });
	});
	return byId;
}

module.exports = {
	name: 'shipped placer (replayed)',
	place: function (scene) {
		const rec = load()[scene.id];
		if (!rec) { throw new Error('replay: no recording for ' + scene.id); }
		return { labels: rec.labels, recordedMs: rec.ms };
	}
};
