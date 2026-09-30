// THE FREQUENCY CHART FOLLOWS THE PANE'S HEIGHT. Run with:
//   node dev/lpn-spike/frequency-pane-height-harness.js
//
// Tom, on the Frequency tab's preview: *"It needs to adjust to the height of the pane like the
// other graphs."* The defect was one selector short in css/engcalcs.css: `#lpn_profile_chart,
// #lpn_ts_chart { flex: 1 1 auto; min-width: 0; min-height: 0; }` never named `#lpn_freq_chart`,
// so the frequency host kept its flex item's default minimum -- its own content -- and never grew
// or shrank with `.lpn-profile-panel`, even though `renderFrequency()` measures its host with
// `tsLayout()` exactly as `renderTimeSeries()` does and even though `freqResizeWatch()` observes
// that host exactly as `tsResizeWatch()` observes `#lpn_ts_chart`. The JS side was already right;
// only the CSS left the box unable to be measured smaller (or bigger) than what was drawn in it.
//
// dev/browser-pass/specs/profile.js proves the same property for the Profile tab by dragging the
// pane grip and re-measuring; this harness is that proof for Frequency, kept in dev/lpn-spike (a
// stub cannot see this class of bug at all -- flex sizing is real layout -- see
// dev/testing-notes.md), and self-locking like table-divider-align-harness.js so it is safe to run
// from run_harnesses.sh or alone.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_FREQ_HEIGHT_LOCKED';

// ---- self-locking re-exec, as table-divider-align-harness.js does ------------------------------
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock binary */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit',
			env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('frequency-pane-height-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('frequency-pane-height-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. This is lock contention, not a height defect; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('frequency-pane-height-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('frequency-pane-height-harness: no Chromium found (set CHROME_PATH, or `npx playwright install chromium`). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });

	try {
		const a = await Session.open(browser, 'A');
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(500);
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) c.remove(); });

		await a.toolbarClick('Bottom panel');
		await a.page.click('#lpn_pane_tab_frequency');
		await a.settle(300);
		// Elevation is an INPUT and draws with no solve (frequency-plot-harness.js section 1), so
		// this harness needs no run and no wait on the EPANET engine -- it is testing layout, not
		// hydraulics.
		await a.page.selectOption('#lpn_freq_quantity', 'elev');
		await a.settle(300);

		// The chart as the reader sees it: the host's own box, and the plot frame drawn inside it.
		const measure = () => a.page.evaluate(() => {
			const host = document.getElementById('lpn_freq_chart');
			const svg = host && host.querySelector('svg');
			const frame = svg && svg.querySelector('rect.lpn-profile-frame');
			const body = document.getElementById('lpn_pane_body');
			if (!host || !svg || !frame || !body) { return null; }
			const h = host.getBoundingClientRect(), f = frame.getBoundingClientRect();
			return {
				paneH: body.getBoundingClientRect().height,
				hostH: h.height, svgH: svg.getBoundingClientRect().height, frameH: f.height
			};
		});
		const drag = async (dy) => {
			await a.page.evaluate((dy) => {
				const grip = document.getElementById('lpn_pane_grip');
				const r = grip.getBoundingClientRect();
				const opts = (y) => ({ bubbles: true, clientX: r.left + 40, clientY: y, pointerId: 1 });
				grip.dispatchEvent(new PointerEvent('pointerdown', opts(r.top + 4)));
				grip.dispatchEvent(new PointerEvent('pointermove', opts(r.top + 4 - dy)));
				grip.dispatchEvent(new PointerEvent('pointerup', opts(r.top + 4 - dy)));
			}, dy);
			await a.settle(500);
		};

		// ---- Position 1: the pane as it opened ------------------------------------------------
		const m1 = await measure();
		ok('the chart is drawn with a plot frame to measure', !!m1, JSON.stringify(m1));
		if (m1) {
			ok('the SVG exactly fills its host', Math.abs(m1.svgH - m1.hostH) <= 2,
				`${Math.round(m1.svgH)} in ${Math.round(m1.hostH)}`);
			ok('the plot frame uses most of the host height, the axis labels aside',
				m1.frameH > m1.hostH * 0.45, `${Math.round(m1.frameH)} of ${Math.round(m1.hostH)}`);
		}

		// ---- Position 2: dragged substantially TALLER -----------------------------------------
		await drag(150);
		const m2 = await measure();
		if (m1 && m2) {
			ok('dragging the grip up makes the pane taller', m2.paneH > m1.paneH + 40,
				`${Math.round(m1.paneH)} -> ${Math.round(m2.paneH)}`);
			ok('...and the chart host grows with it', m2.hostH > m1.hostH + 40,
				`${Math.round(m1.hostH)} -> ${Math.round(m2.hostH)}`);
			ok('...still exactly filling its host', Math.abs(m2.svgH - m2.hostH) <= 2,
				`${Math.round(m2.svgH)} in ${Math.round(m2.hostH)}`);
			ok('...and the drawn frame is really bigger, not just the empty host',
				m2.frameH > m1.frameH + 20, `${Math.round(m1.frameH)} -> ${Math.round(m2.frameH)}`);
		}

		// ---- Position 3: dragged well SHORTER than position 1, a second distinct position -----
		await drag(-260);
		const m3 = await measure();
		if (m2 && m3) {
			ok('dragging the grip down makes the pane shorter', m3.paneH < m2.paneH - 100,
				`${Math.round(m2.paneH)} -> ${Math.round(m3.paneH)}`);
			ok('...and the chart host shrinks with it', m3.hostH < m2.hostH - 100,
				`${Math.round(m2.hostH)} -> ${Math.round(m3.hostH)}`);
			ok('...still exactly filling its host, smaller as well as bigger',
				Math.abs(m3.svgH - m3.hostH) <= 2, `${Math.round(m3.svgH)} in ${Math.round(m3.hostH)}`);
		}
		ok('three distinct divider positions were actually measured',
			!!(m1 && m2 && m3) && m1.paneH !== m2.paneH && m2.paneH !== m3.paneH,
			[m1, m2, m3].map((m) => m && Math.round(m.paneH)).join(', '));

		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}

	console.log('');
	console.log(fails ? `${fails}/${checks} FAILED` : `frequency-pane-height: ALL ${checks} PASS`);
	if (fails > 0) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
