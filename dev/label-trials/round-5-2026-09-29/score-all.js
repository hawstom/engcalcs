// ROUND 5: SCORE EVERY PLACER ON EVERY EXTRACTED SCENE SET (score-one.js per cell, in a child).
//
//   node dev/label-trials/round-5-2026-09-29/score-all.js <work dir> [--workers 2] [--placers A,B]
//
// Appends one JSON line per view to raw/<placer>.jsonl in this folder (committed: the raw
// results). A cell that fails or passes the time limit is recorded as a line with `status`. Cells
// already in the raw files are skipped, so a run resumes. Cells run in a seeded shuffled order, so
// machine load falls evenly on every placer.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const M = require('./matrix.js');
const { setIds } = require('./extract-all.js');

const RAW = path.join(__dirname, 'raw');
const LIMIT_MS = 20 * 60 * 1000;

function shuffle(arr, seed) {
	let a = seed >>> 0;
	function r() { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
	for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = arr[i]; arr[i] = arr[j]; arr[j] = x; }
	return arr;
}

function main() {
	const a = process.argv.slice(2), work = a[0];
	if (!work) { console.error('usage: score-all.js <work dir> [--workers N] [--placers A,B]'); process.exit(2); }
	const W = a.indexOf('--workers') >= 0 ? +a[a.indexOf('--workers') + 1] : 2;
	const names = a.indexOf('--placers') >= 0 ? a[a.indexOf('--placers') + 1].split(',') : Object.keys(M.PLACERS);
	fs.mkdirSync(RAW, { recursive: true });
	const done = {};
	names.forEach(function (p) {
		const f = path.join(RAW, p + '.jsonl');
		if (!fs.existsSync(f)) { return; }
		fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(function (l) { const o = JSON.parse(l); done[p + '|' + o.set] = true; });
	});
	const cells = [];
	M.jobs().forEach(function (j) {
		setIds(j.spec).forEach(function (id) {
			const sf = path.join(work, 'scenes', id + '.json'), mf = path.join(work, 'master', id + '.json');
			if (!fs.existsSync(sf)) { return; }
			names.forEach(function (p) {
				if (done[p + '|' + id]) { return; }
				if (p === 'master' && !fs.existsSync(mf)) { return; }
				cells.push({ exp: j.exp, placer: p, set: id, scene: sf, master: mf });
			});
		});
	});
	// E0, the reference: the public bench's own scene sets (Net1-3, Novato), the "all Net3" world.
	const BENCH = path.join(__dirname, '../../lpn-spike/label-bench');
	['net1', 'net2', 'net3', 'novato-zoom', 'novato-seq'].forEach(function (id) {
		names.forEach(function (p) {
			if (done[p + '|' + id]) { return; }
			cells.push({ exp: 'E0', placer: p, set: id, scene: path.join(BENCH, 'scenes', id + '.json'), master: path.join(BENCH, 'master', id + '.json') });
		});
	});
	shuffle(cells, 20260929);
	console.log(cells.length + ' cells to score, ' + W + ' at a time');
	let next = 0, running = 0, finished = 0;
	function launch() {
		while (running < W && next < cells.length) {
			const c = cells[next++], t0 = Date.now();
			running++;
			const ch = spawn(process.execPath, ['--max-old-space-size=3000', path.join(__dirname, 'score-one.js'), c.placer, c.scene, c.master],
				{ stdio: ['ignore', 'pipe', 'pipe'] });
			let out = '', err = '', killed = false;
			ch.stdout.on('data', function (d) { out += d; });
			ch.stderr.on('data', function (d) { err += d; });
			const timer = setTimeout(function () { killed = true; ch.kill('SIGKILL'); }, LIMIT_MS);
			ch.on('close', function (code) {
				clearTimeout(timer);
				running--; finished++;
				const lines = out.split('\n').filter(function (l) { return l.charAt(0) === '{'; }).map(function (l) {
					const o = JSON.parse(l); o.exp = c.exp; return JSON.stringify(o);
				});
				if (code !== 0 || !lines.length) {
					lines.length = 0;
					lines.push(JSON.stringify({ set: c.set, placer: c.placer, exp: c.exp, status: killed ? 'timeout' : 'crash', code: code,
						error: err.split('\n').filter(Boolean).slice(-4).join(' | ').slice(0, 600) }));
				}
				fs.appendFileSync(path.join(RAW, c.placer + '.jsonl'), lines.join('\n') + '\n');
				console.log('[' + finished + '/' + cells.length + '] ' + c.placer + ' ' + c.set + ' ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s' + (code ? ' EXIT ' + code : ''));
				if (finished === cells.length) { console.log('done'); process.exit(0); }
				launch();
			});
		}
	}
	if (!cells.length) { console.log('nothing to do'); return; }
	launch();
}

main();
