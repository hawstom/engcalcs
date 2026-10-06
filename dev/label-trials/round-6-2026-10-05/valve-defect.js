// ROUND 6: TODAY'S MASTER WRITES NODE LABELS OVER VALVE SYMBOLS. Scores master's recorded layouts of
// the public `bent-valves` scene (dev/lpn-spike/label-bench/scenes/bent-valves.json) and lists every
// N1 break on a valve symbol, view by view.
//
//   node dev/label-trials/round-6-2026-10-05/valve-defect.js [scene file] [master file]
//
// Default scene: scene-bent-valves-today.json, the same network as the public `bent-valves` scene
// as today's master composes its labels (its rows differ slightly from the branch's). Default master file: master-today-bent-valves.json in this folder, recorded 2026-10-05 from master
// 89248ed2 (`git archive master`, this branch's extract.js, generator.js and js/lpn-label-scene.js
// copied in, `extract.js --gen '{"family":"suburban","n":600,"seed":7,"bends":"many","valves":"many",
// "spacingPx":44}'`). The scene it asks for is the committed one, label for label.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { scoreView } = require('../../lpn-spike/label-bench/score.js');

const sf = process.argv[2] || path.join(__dirname, 'scene-bent-valves-today.json');
const mf = process.argv[3] || path.join(__dirname, 'master-today-bent-valves.json');
const set = JSON.parse(fs.readFileSync(sf, 'utf8'));
set.steps.forEach(function (sc) { sc.text.repeatSpacingPx = 0.75 * Math.min(sc.viewport.w, sc.viewport.h); });
const C = require('../../lpn-spike/label-bench/contract.js');
set.steps.forEach(function (sc) { const bad = C.sceneProblem(sc); if (bad) { throw new Error(bad); } });
const rec = JSON.parse(fs.readFileSync(mf, 'utf8'));
let total = 0, valve = 0;
set.steps.forEach(function (scene, k) {
	const r = scoreView(scene, { labels: rec.steps[k].labels });
	const onValve = r.breaks.N1.filter(function (b) { return /symbol/.test(b); });
	total += r.breaks.N1.length; valve += onValve.length;
	console.log(scene.id.padEnd(18) + ' N1 ' + String(r.breaks.N1.length).padStart(3) + ', on a valve symbol ' + String(onValve.length).padStart(3)
		+ ', labels shown ' + r.labelsShown + '/' + r.labelsReq + (onValve.length ? '   e.g. ' + onValve.slice(0, 2).join('; ') : ''));
});
console.log('TOTAL N1 ' + total + ', of which on valve symbols ' + valve);
process.exit(valve ? 1 : 0);
