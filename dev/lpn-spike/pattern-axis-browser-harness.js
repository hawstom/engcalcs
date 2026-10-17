// THE LIBRARY PATTERN GRAPH'S TICK LABELS NEVER OVERLAP, AT ANY WIDTH. Real Chromium, the real page.
//   node dev/lpn-spike/pattern-axis-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-16: "Good, but can the number of steps labeled be sensitive to the available width?
// They are overlapping each other when narrow." and, on the word: "How about 'Step'?"
// The Libraries box is resized from very narrow to wide with a 24-step, a 168-step and a 48-step
// (30-minute) pattern; at each width no two labels on either row (Time, Step) may touch, the first
// step is labelled, the row titles are shown, and the title is the word "Step".
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PATAXIS_BROWSER_LOCKED';
const NAME = 'pattern-axis-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const WIDTHS = [150, 200, 260, 340, 450, 600, 760, 900];

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		const P = (fn, arg) => a.page.evaluate(fn, arg);
		const dismiss = () => P(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const closeDialogs = async () => {
			for (let k = 0; k < 6; k++) {
				const shown = await P(() => { const bd = document.getElementById('lpn_dialog_backdrop'); return !!bd && getComputedStyle(bd).display !== 'none'; });
				if (!shown) { return; }
				await a.page.click('#lpn_dialog_buttons button:visible');
				await a.settle(300);
			}
		};
		const openPatterns = async () => {
			const open = await P(() => { const b = document.getElementById('lpn_library_box'); return !!b && getComputedStyle(b).display !== 'none'; });
			if (!open) {
				await a.menuClick(await a.lang('lpn_library_menu'), 'project');
				await a.page.waitForSelector('#lpn_library_box', { state: 'visible' });
			}
			await P(() => {
				document.getElementById('lpn_libbox_link_patterns')
					.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			});
			await a.settle(300);
		};
		const setValues = async (n) => {
			const text = Array.from({ length: n }, (_, i) => (0.5 + (i % 24) / 24).toFixed(2)).join(' ');
			await P((t) => {
				const v = document.querySelector('#lpn_libbox_content .lpn-lib-values');
				v.value = t;
				v.dispatchEvent(new Event('input', { bubbles: true }));
			}, text);
			await a.settle(200);
		};
		// Every label on each row: its text and box. Overlap = two boxes on one row that touch.
		const measure = (w) => P((width) => {
			document.getElementById('lpn_library_box').style.width = width + 'px';
			return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => {
				const plot = document.querySelector('#lpn_libbox_content .lpn-lib-plot');
				const rows = Array.from(plot.querySelectorAll('.lpn-lib-xrow')).map((row) => {
					const rr = row.getBoundingClientRect();
					return { rowW: Math.round(rr.width), left: rr.left, right: rr.right, labels: Array.from(row.children).map((c) => {
						const r = c.getBoundingClientRect();
						return { t: c.textContent, cls: c.className, l: r.left, r: r.right };
					}) };
				});
				res(rows);
			})));
		}, w);
		const check = async (tag, expectFirst) => {
			for (const w of WIDTHS) {
				const rows = await measure(w);
				let bad = [], count = [];
				rows.forEach((row, ri) => {
					const ls = row.labels.slice().sort((p, q) => p.l - q.l);
					for (let i = 1; i < ls.length; i++) { if (ls[i].l < ls[i - 1].r + 1) { bad.push(ri + ':' + ls[i - 1].t + '|' + ls[i].t); } }
					ls.forEach((l) => { if (l.l < row.left - 1 || l.r > row.right + 1) { bad.push(ri + ':outside ' + l.t); } });
					count.push(row.labels.filter((l) => !/xtitle/.test(l.cls)).length);
				});
				const first = rows.map((row) => row.labels[0] && row.labels[0].t);
				ok(tag + ' @' + w + 'px (axis ' + rows[0].rowW + 'px): no labels touch, ' + count.join('/') + ' ticks per row',
					bad.length === 0 && count[0] === count[1] && count[0] >= 1, bad.join(' '));
				ok(tag + ' @' + w + 'px: first step labelled (' + expectFirst + ', 1)',
					rows[0].labels.some((l) => l.t === expectFirst) && rows[1].labels.some((l) => l.t === '1'));
			}
		};
		const titles = () => P(() => Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-plot .lpn-lib-xtitle')).map((e) => e.textContent));

		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await dismiss();
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		const word = await a.lang('lpn_library_pattern_axis_step');
		const timeWord = await a.lang('lpn_time_menu');

		const NET1 = fs.readFileSync(path.join(__dirname, 'reference', 'Net1.inp'), 'utf8');
		for (const step of ['2:00', '1:00', '0:30']) {
			const inp = NET1.replace(/Pattern Timestep\s+\d+:\d+/i, 'Pattern Timestep \t' + step);
			await a.page.setInputFiles('#lpn_inp_file', { name: 'axis-' + step.replace(':', '') + '.inp', mimeType: 'text/plain', buffer: Buffer.from(inp) });
			await a.settle(1500);
			await closeDialogs();
			await openPatterns();
			const first = '0:00';
			const sizes = step === '0:30' ? [48] : step === '1:00' ? [24, 168] : [12, 24];
			for (const n of sizes) {
				console.log('\n--- pattern step ' + step + ', ' + n + ' steps ---');
				await setValues(n);
				await check('step ' + step + ' n=' + n, first);
				const t = await titles();
				ok('row titles are "' + timeWord + '" and "' + word + '"', t.join() === timeWord + ',' + word, t.join());
				ok('the word is Step', word === 'Step', word);
			}
		}

		console.log('\n--- a phone-width window (360 px) ---');
		await a.page.setViewportSize({ width: 360, height: 700 });
		await a.settle(600);
		await setValues(168);
		await check('phone n=168', '0:00');
		await setValues(24);
		await check('phone n=24', '0:00');
	} catch (err) {
		console.log('  FAIL harness error: ' + (err && err.stack || err));
		fails++;
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\n' + NAME + ': all passed');
	process.exit(fails ? 1 : 0);
}
main();
