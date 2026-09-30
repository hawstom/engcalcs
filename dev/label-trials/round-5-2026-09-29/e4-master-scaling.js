// ROUND 5, E4: MASTER'S LAYOUT TIME AGAINST NETWORK SIZE, AT A FIXED VIEW DENSITY. One grid
// network per size (seed 1, 70 px), extracted with master, one at a time (nothing else of ours
// running). Records master's recorded pass time per view and the labels requested, to raw/e4.json.
//
//   node dev/label-trials/round-5-2026-09-29/e4-master-scaling.js <work dir> [150,500,1000,2000]
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Gen = require('../../lpn-spike/label-bench/generator.js');

const work = process.argv[2], sizes = (process.argv[3] || '150,500,1000,2000').split(',').map(Number);
const EXTRACT = path.join(__dirname, '../../lpn-spike/label-bench/extract.js');
const out = [];
sizes.forEach(function (n) {
	const spec = { family: 'grid', n: n, seed: 1, spacingPx: 70 }, id = Gen.specKey(spec);
	const t0 = Date.now();
	const r = spawnSync(process.execPath, ['--max-old-space-size=3000', EXTRACT, '--gen', JSON.stringify(spec), path.join(work, 'e4-scenes'), path.join(work, 'e4-master')],
		{ encoding: 'utf8', timeout: 60 * 60 * 1000 });
	const wall = Date.now() - t0;
	const sc = JSON.parse(fs.readFileSync(path.join(work, 'e4-scenes', id + '.json'), 'utf8'));
	const ms = JSON.parse(fs.readFileSync(path.join(work, 'e4-master', id + '.json'), 'utf8'));
	const rec = { n: n, set: id, wallMs: wall, exit: r.status, views: sc.steps.map(function (s, k) { return { view: s.id, labelsReq: s.labels.length, masterMs: ms.steps[k].ms }; }) };
	out.push(rec);
	console.log(JSON.stringify(rec));
});
fs.mkdirSync(path.join(__dirname, 'raw'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'raw', 'e4.json'), JSON.stringify(out, null, 1) + '\n');
