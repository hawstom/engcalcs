// A FIRE FOR A STATED DURATION, IN THE REAL PAGE (Task 578).
//   node dev/lpn-spike/duration-fire-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net1 from the examples wall. Water > Analyze > Fire flow analysis: the choice "A fire for a
// stated duration", junction 22 selected on the map, 2,000 gpm from 8:00 for 4:00, Run. The rows the
// box prints must be the ones the run on screen implies; the numbers themselves are held against
// an independent hand-made file by duration-fire-harness.js.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DURFIRE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('duration-fire-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('duration-fire-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('duration-fire-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}


let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('duration-fire-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'duration-fire');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(800);
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'Net1 EPS frames', 120000);

		await a.menuClickSub(await a.lang('lpn_analyze_menu'), await a.lang('lpn_ff_menu'), 'project');
		await a.page.waitForSelector('#lpn_ff_box', { state: 'visible' });
		const whenSel = '#lpn_ff_controls select:has(option[value="dur"])';
		ok('the box offers "' + await a.lang('lpn_dur_option') + '" on a project with a clock', !!(await a.page.$(whenSel)));

		console.log('\n--- Junction 22, 2000 gpm, 8:00 for 4:00 ---');
		await a.page.selectOption(whenSel, 'dur');
		await a.settle(250);
		const ctl = '#lpn_ff_controls';
		ok('the junction-sweep rows are gone: no scope and no design check', !(await a.page.$(ctl + ' select:has(option[value="selected"])')));
		const rowText = () => a.page.$eval('#lpn_ff_firejunction', (e) => e.textContent);
		ok('the box is open before anything is selected, and its Fire junction row says so: "' + await rowText() + '"', (await rowText()) === await a.lang('lpn_dur_junction_none'));
		// The box sits over the map: move it aside, then select junction 22 with the box still open.
		await a.page.evaluate(() => { const b = document.getElementById('lpn_ff_box'); b.style.left = Math.max(0, window.innerWidth - b.getBoundingClientRect().width - 4) + 'px'; b.style.top = '820px'; });
		await a.settle(200);
		const pt = await a.page.evaluate(() => {
			const el = document.querySelector('#lpn_canvas [data-node="22"]'), r = el.getBoundingClientRect(),
				x = r.left + r.width / 2, y = r.top + r.height / 2, top = document.elementFromPoint(x, y);
			return { x, y, covered: !(top && top.closest && top.closest('#lpn_canvas')), by: top ? (top.id || top.className || top.tagName) + ' in ' + ((top.closest('[id]') || {}).id) : null, vw: innerWidth, vh: innerHeight };
		});
		ok('junction 22 is not under the box once it is moved', !pt.covered, JSON.stringify(pt));
		await a.page.mouse.click(pt.x, pt.y);
		await a.settle(600);
		ok('junction 22 is selected, and the row follows it live: "' + await rowText() + '"', /22$/.test(await rowText()));
		const startTexts = await a.page.$$eval(ctl + ' select:has(option[value="28800"]) option', (os) => os.map((o) => o.textContent));
		ok('the start list holds only 2:00 pattern periods inside the 24:00 run', startTexts.join(' ') === '0:00 2:00 4:00 6:00 8:00 10:00 12:00 14:00 16:00 18:00 20:00 22:00', startTexts.join(' '));
		const wide = await a.page.$eval(ctl + ' select:has(option[value="dur"])', (sel) => ({ w: sel.clientWidth, sw: sel.scrollWidth }));
		ok('the Reporting step tested select fits its longest choice', wide.w >= 150, JSON.stringify(wide));
		ok('there is no Clear rings button for a duration fire', await a.page.$$eval(ctl + ' button.lpn-ff-clearbtn', (bs) => bs.every((b) => getComputedStyle(b).display === 'none')));
		const labels = await a.page.$$eval(ctl + ' .lpn-ff-row', (rs) => rs.map((r) => r.textContent.trim()));
		const startLabel = await a.lang('lpn_dur_start'), lenLabel = await a.lang('lpn_dur_length');
		ok('the start and the duration are asked', labels.some((t) => t.indexOf(startLabel) === 0) && labels.some((t) => t.indexOf(lenLabel) === 0), JSON.stringify(labels));

		const lead = (await a.lang('lpn_dur_head')).split('{flow}')[0];
		const runBtn = async () => { const b = await a.page.$(ctl + ' button.lpn-ff-run'); await b.click(); };
		// The box as it opens: 1,000 gpm for 2:00 from the first reporting step, on the selected junction.
		await runBtn();
		const reportText = () => a.page.$eval('#lpn_ff_report', (e) => e.textContent);
		await a.waitFor(async () => (await reportText()).indexOf(lead + '1000 gpm') === 0, 'the answer on the opening values', 120000);
		ok('Run on the values the box opens with answers: 1000 gpm from 0:00 to 2:00', (await reportText()).indexOf(lead + '1000 gpm at junction') === 0 && /0:00/.test(await reportText()));

		await a.page.selectOption(ctl + ' select:has(option[value="28800"])', '28800');
		const inputs = await a.page.$$(ctl + ' .lpn-ff-row input');
		// the row order: Required fire flow, then Fire duration comes before it; find by label
		const setByLabel = async (label, text) => {
			const rows = await a.page.$$(ctl + ' .lpn-ff-row');
			for (const r of rows) {
				if (((await r.textContent()) || '').trim().indexOf(label) === 0) {
					const i = await r.$('input'); await i.click({ clickCount: 3 }); await a.page.keyboard.type(text); await a.page.keyboard.press('Tab'); return;
				}
			}
			throw new Error('no row ' + label);
		};
		ok('there are text inputs for the duration, the flow and the residual', inputs.length >= 3, String(inputs.length));
		await setByLabel(await a.lang('lpn_dur_length'), '4:00');
		await setByLabel(await a.lang('lpn_ff_required'), '2000');
		await runBtn();
		await a.waitFor(async () => (await reportText()).indexOf(lead + '2000 gpm') === 0, 'the duration fire answer', 120000);
		const report = await a.page.$eval('#lpn_ff_report', (e) => e.textContent);
		console.log('    ' + report.slice(0, 420).replace(/\s+/g, ' '));
		const holdsLead = (await a.lang('lpn_dur_holds')).split('{id}')[0], failsLead = (await a.lang('lpn_dur_fails')).split('{id}')[0];
		const noEmpty = await a.lang('lpn_dur_no_empty'), emptiesLead = (await a.lang('lpn_dur_empties')).split('{id}')[0];
		ok('the head line names junction 22, 2000 gpm, 8:00 and 12:00', /^.* 2000 gpm at junction .*22, .* 8:00 .* 12:00\./.test(report.slice(0, 80)), report.slice(0, 80));
		ok('the residual verdict leads with a check or a warning', report.indexOf(holdsLead) > 0 || report.indexOf(failsLead) > 0);
		ok('the tank verdict is there', report.indexOf(noEmpty) > 0 || report.indexOf(emptiesLead) > 0);
		const tables = await a.page.$$eval('#lpn_ff_report table', (ts) => ts.map((t) => [...t.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((c) => c.textContent.trim()))));
		ok('a tank table with 7 columns and a 25-step pressure table', tables.length === 2 && tables[0].length === 1 && tables[0][0].length === 7 && tables[1].length === 25, tables.map((t) => t.length).join(',') + ' / ' + (tables[0][0] || []).join(' | '));
		ok('the tank row gives its minimum (100, the unit is in the heading), margin, and drop from the start', /^100$/.test(tables[0][0][2]) && /^[\d.]+$/.test(tables[0][0][3]) && /^[\d.]+$/.test(tables[0][0][4]), tables[0][0].join(' | '));
		const backLead = (await a.lang('lpn_dur_not_back_tank')).split('{id}')[0].replace('{time}', '24:00');
		ok('the not-recovered verdict reads as information about the tank, with its tolerance', report.indexOf(backLead) > 0 && /tolerance of 0\.3/.test(report), report.slice(report.indexOf(backLead), report.indexOf(backLead) + 200));
		const series = tables[1];
		ok('the fire flow shows on 8:00 through 11:00 only', series.filter((r) => /^\d/.test(r[1])).map((r) => r[0]).join(' ') === '8:00 9:00 10:00 11:00', JSON.stringify(series.slice(7, 13)));
		// the "without the fire" column is the run on screen
		const want = await a.page.evaluate(() => EngCalcs.lpnTimeRunFrames().map((f) => f.pressures['22']));
		const psi = (m) => m / 0.70307;
		ok('the column "without the fire" is the run on screen (junction 22, all 25 steps)', series.every((r, i) => Math.abs(parseFloat(r[3]) - psi(want[i])) <= 0.005 * psi(want[i])), series.slice(0, 2).map((r) => r[3]).join(' / ') + ' vs ' + psi(want[0]).toFixed(2));
		ok('during the fire the pressure is lower than without it, and equal before it', series.every((r, i) => /gpm/.test(r[1]) ? parseFloat(r[2]) < parseFloat(r[3]) : (i > 5 ? true : Math.abs(parseFloat(r[2]) - parseFloat(r[3])) <= 0.005 * parseFloat(r[3]))));
		ok('the project is unchanged (no dirty mark)', !(await a.currentTabDirty()));

		console.log('\n--- A start off the pattern step is refused ---');
		await setByLabel(await a.lang('lpn_dur_length'), '3:00');
		await runBtn();
		const badLead = (await a.lang('lpn_dur_bad_time')).split('{step}')[0];
		await a.waitFor(async () => (await reportText()).indexOf(badLead) === 0, 'the pattern-step refusal');
		ok('3:00 on a 2:00 pattern step is refused by name', true);

		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n'));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' duration fire browser check(s) FAILED' : '\nduration fire browser harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
