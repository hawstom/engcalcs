// ROUND 6: EXTRACT EVERY SCENE SET IN THE DESIGN (matrix.js), a few child processes at a time.
//
//   node dev/label-trials/round-6-2026-10-05/extract-all.js <work dir> [--workers 3] [--only E1] [--min-n N] [--max-n N]
//
// Scenes (12 MB for a 5000-node set) go to <work dir>/scenes and master's layouts to
// <work dir>/master; neither is committed, since both reproduce exactly from the spec. A set whose
// file already exists is skipped, so an interrupted run resumes. A log line per job goes to
// <work dir>/extract.log.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const M = require('./matrix.js');
const Gen = require('../../lpn-spike/label-bench/generator.js');

const EXTRACT = path.join(__dirname, '../../lpn-spike/label-bench/extract.js');

function setIds(spec) {
	const sps = Array.isArray(spec.spacingPx) ? spec.spacingPx : [spec.spacingPx];
	return sps.map(function (sp) {
		if (spec.bench) { return ['bench', spec.bench, 's' + sp, spec.fields || 'novato', 'seed' + (spec.seed || 1)].join('-'); }
		return Gen.specKey(Object.assign({}, spec, { spacingPx: sp }));
	});
}

function main() {
	const a = process.argv.slice(2);
	const work = a[0];
	if (!work) { console.error('usage: extract-all.js <work dir> [--workers N] [--only E1,E2]'); process.exit(2); }
	const W = a.indexOf('--workers') >= 0 ? +a[a.indexOf('--workers') + 1] : 3;
	const only = a.indexOf('--only') >= 0 ? a[a.indexOf('--only') + 1].split(',') : null;
	// --min-n / --max-n: split the big networks (one at a time: three 5000-node pages at once
	// exhausted 12 GB and every job hit the time limit) from the rest.
	const minN = a.indexOf('--min-n') >= 0 ? +a[a.indexOf('--min-n') + 1] : 0;
	const maxN = a.indexOf('--max-n') >= 0 ? +a[a.indexOf('--max-n') + 1] : Infinity;
	const sceneDir = path.join(work, 'scenes'), masterDir = path.join(work, 'master');
	fs.mkdirSync(sceneDir, { recursive: true });
	fs.mkdirSync(masterDir, { recursive: true });
	const log = fs.createWriteStream(path.join(work, 'extract.log'), { flags: 'a' });
	const todo = M.jobs().filter(function (j) {
		if (only && only.indexOf(j.exp) < 0) { return false; }
		if ((j.spec.n || 800) < minN || (j.spec.n || 800) > maxN) { return false; }
		return setIds(j.spec).some(function (id) { return !fs.existsSync(path.join(sceneDir, id + '.json')); });
	});
	// Largest first, so the long jobs do not all land at the end.
	todo.sort(function (x, y) { return (y.spec.n || 800) - (x.spec.n || 800); });
	console.log(todo.length + ' jobs to run, ' + W + ' at a time');
	let next = 0, running = 0, done = 0, failed = 0;
	function launch() {
		while (running < W && next < todo.length) {
			const job = todo[next++], t0 = Date.now();
			running++;
			const ch = spawn(process.execPath, ['--max-old-space-size=' + ((job.spec.n || 800) > 5000 ? 16000 : 4000), EXTRACT, '--gen', JSON.stringify(job.spec), sceneDir, masterDir],
				{ stdio: ['ignore', 'pipe', 'pipe'] });
			let out = '', err = '';
			ch.stdout.on('data', function (d) { out += d; });
			ch.stderr.on('data', function (d) { err += d; });
			const timer = setTimeout(function () { ch.kill('SIGKILL'); }, 45 * 60 * 1000);
			ch.on('close', function (code) {
				clearTimeout(timer);
				running--; done++;
				if (code !== 0) { failed++; }
				const line = new Date().toISOString() + ' ' + job.exp + ' ' + JSON.stringify(job.spec) + ' exit ' + code + ' ' +
					((Date.now() - t0) / 1000).toFixed(0) + ' s ' + out.trim() + (code ? ' ERR ' + err.split('\n').filter(function (l) { return !/WARNING/.test(l); }).slice(0, 5).join(' | ') : '');
				log.write(line + '\n');
				console.log('[' + done + '/' + todo.length + '] ' + line);
				if (done === todo.length) { log.end(); console.log('done, ' + failed + ' failed'); process.exit(failed ? 1 : 0); }
				launch();
			});
		}
	}
	if (!todo.length) { console.log('nothing to do'); return; }
	launch();
}

module.exports = { setIds };
if (require.main === module) { main(); }
