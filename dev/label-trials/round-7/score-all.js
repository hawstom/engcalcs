// ROUND 7: SCORE EVERY CELL OF THE DESIGN (score-one.js per cell, in a child process). JUDGES' SIDE.
//
//   node dev/label-trials/round-7/score-all.js <work dir> [--workers 1] [--placers A7,B7] [--exp E1]
//
// Cells: E0 (the public bench), E1, E2, E3, each with the entrants matrix.entrantsFor() names; the
// count probe on E1 and E2 builder cells. Appends one JSON line per view to <work dir>/raw/<entrant>.jsonl
// (copied into this folder's raw/ when the round is written up). A cell already there is skipped, so
// a run resumes. Cells run in a seeded shuffled order so machine load falls evenly on every entrant.
// One worker by default and at most three: check_all suites share the machine. Keep <work dir> on
// disk, never in the RAM-backed /tmp.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const M = require('./matrix.js');
const { setIds } = require('./extract-all.js');

const LIMIT_MS = 30 * 60 * 1000;

function shuffle(arr, seed) {
	let a = seed >>> 0;
	function r() { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
	for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = arr[i]; arr[i] = arr[j]; arr[j] = x; }
	return arr;
}

function cellsFor(work) {
	const cells = [];
	M.jobs().forEach(function (j) {
		setIds(j.spec).forEach(function (id) {
			const sf = path.join(work, 'scenes', id + '.json');
			M.entrantsFor(j.exp).forEach(function (p) {
				const builder = !M.PLACERS[p].repair;
				cells.push({ exp: j.exp, variant: j.variant, placer: p, set: id, scene: sf, probe: builder && (j.exp === 'E1' || j.exp === 'E2') ? 1 : 0 });
			});
		});
	});
	const BENCH = path.join(__dirname, '../../lpn-spike/label-bench');
	M.PUBLIC_SETS.forEach(function (id) {
		M.entrantsFor('E0').forEach(function (p) {
			cells.push({ exp: 'E0', variant: 'public', placer: p, set: id, scene: path.join(BENCH, 'scenes', id + '.json'), probe: 0 });
		});
	});
	return cells;
}

function main() {
	const a = process.argv.slice(2), work = a[0];
	if (!work) { console.error('usage: score-all.js <work dir> [--workers N] [--placers A7,B7] [--exp E1]'); process.exit(2); }
	const W = Math.min(3, a.indexOf('--workers') >= 0 ? +a[a.indexOf('--workers') + 1] : 1);
	const names = a.indexOf('--placers') >= 0 ? a[a.indexOf('--placers') + 1].split(',') : Object.keys(M.PLACERS);
	const exps = a.indexOf('--exp') >= 0 ? a[a.indexOf('--exp') + 1].split(',') : null;
	const RAW = path.join(work, 'raw');
	fs.mkdirSync(RAW, { recursive: true });
	const done = {};
	names.forEach(function (p) {
		const f = path.join(RAW, p + '.jsonl');
		if (!fs.existsSync(f)) { return; }
		fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(function (l) { const o = JSON.parse(l); done[p + '|' + o.set] = true; });
	});
	const missing = {};
	const cells = cellsFor(work).filter(function (c) {
		if (names.indexOf(c.placer) < 0 || (exps && exps.indexOf(c.exp) < 0) || done[c.placer + '|' + c.set]) { return false; }
		if (!fs.existsSync(c.scene)) { missing[c.set] = true; return false; }
		return true;
	});
	if (Object.keys(missing).length) { console.log(Object.keys(missing).length + ' scene sets not extracted yet (run extract-all.js first); their cells are skipped'); }
	shuffle(cells, 20261007);
	console.log(cells.length + ' cells to score, ' + W + ' at a time');
	let next = 0, running = 0, finished = 0;
	function launch() {
		while (running < W && next < cells.length) {
			const c = cells[next++], t0 = Date.now();
			running++;
			const big = /-n20000-/.test(c.set);
			const ch = spawn(process.execPath, ['--max-old-space-size=' + (big ? 12000 : 4000), path.join(__dirname, 'score-one.js'), c.placer, c.scene, String(c.probe)],
				{ stdio: ['ignore', 'pipe', 'pipe'] });
			let out = '', err = '', killed = false;
			ch.stdout.on('data', function (d) { out += d; });
			ch.stderr.on('data', function (d) { err += d; });
			const timer = setTimeout(function () { killed = true; ch.kill('SIGKILL'); }, LIMIT_MS);
			ch.on('close', function (code) {
				clearTimeout(timer);
				running--; finished++;
				const lines = out.split('\n').filter(function (l) { return l.charAt(0) === '{'; }).map(function (l) {
					const o = JSON.parse(l); o.exp = c.exp; o.variant = c.variant; return JSON.stringify(o);
				});
				if (code !== 0 || !lines.length) {
					lines.length = 0;
					lines.push(JSON.stringify({ set: c.set, placer: c.placer, exp: c.exp, variant: c.variant, status: killed ? 'timeout' : 'crash', code: code,
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

if (require.main === module) { main(); }
module.exports = { cellsFor };
