// DEMAND SCALING'S "Selected junctions", IN THE REAL PAGE (Task 754; Tom's browser pass, 2026-10-02:
// "It appears that Find doesn't respect "Selected junctions".").
//
// Run with:
//   node dev/lpn-spike/demand-scaling-scope-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net1, opened from the examples wall. Junctions are selected the way a person selects them -- a
// click and a Shift+click on the map -- then Water > Analyze > Demand scaling, "Selected junctions",
// and the box's own Find button. Then Find under "Selected junctions" with nothing selected, after an
// All answer: the refusal must be said in the box and the All answer must not stand as if it were
// the Selected one, which is what made Find look as if it ignored the scope. The stub harness (demand-scaling-harness.js) sets the selection
// through a back door, so it cannot see what a real click does.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DS_SCOPE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('demand-scaling-scope-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('demand-scaling-scope-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('demand-scaling-scope-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
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
		console.error('demand-scaling-scope-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'ds-scope');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(800);

		const selectedOnMap = () => a.page.$$eval('.lpn-node-hit.lpn-selected, .lpn-node.lpn-selected',
			(els) => [...new Set(els.map((e) => e.getAttribute('data-node')))].sort());
		const clickNode = async (id, shift) => {
			const hit = await a.page.$('.lpn-node-hit[data-node="' + id + '"]');
			const b = await hit.boundingBox();
			if (shift) { await a.page.keyboard.down('Shift'); }
			await a.page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
			if (shift) { await a.page.keyboard.up('Shift'); }
			await a.settle(300);
		};
		const openBox = async () => {
			await a.menuClickSub(await a.lang('lpn_analyze_menu'), await a.lang('lpn_ds_menu'), 'project');
			await a.page.waitForSelector('#lpn_ds_box', { state: 'visible' });
		};
		const setScope = async (v) => {
			await a.page.selectOption('#lpn_ds_controls select', v);
			await a.settle(100);
		};
		const setMin = async (t) => {
			const inp = (await a.page.$$('#lpn_ds_controls input'))[0];
			await inp.fill(t);
			await inp.dispatchEvent('change');
		};
		const pressFind = async () => {
			const findLabel = await a.lang('lpn_ds_find');
			const btns = await a.page.$$('#lpn_ds_controls button.lpn-ff-run');
			for (const b of btns) {
				if (((await b.textContent()) || '').trim() === findLabel) { await b.click(); break; }
			}
			await a.waitFor(() => a.page.evaluate(() => {
				const h = document.querySelector('#lpn_ds_controls [data-ds="search"]');
				const stop = document.querySelector('#lpn_ds_controls .lpn-ff-stopbtn');
				return !!h && h.textContent.length > 0 && stop && stop.disabled;
			}), 'search answer', 60000);
			return a.page.$eval('#lpn_ds_controls [data-ds="search"]', (h) => h.textContent);
		};

		const notice = () => a.page.evaluate(() => document.getElementById('lpn_map_notice').textContent);

		console.log('\n--- All junctions, the baseline ---');
		await openBox();
		await setMin('20');
		await setScope('all');
		const all = await pressFind();
		console.log('  ' + all.slice(0, 160));
		await a.page.click('#lpn_ds_close');
		await a.settle(200);

		console.log('\n--- Selected junctions, picked on the map, then the box ---');
		await clickNode('10', false);
		await clickNode('11', true);
		const sel = await selectedOnMap();
		ok('two junctions are selected on the map', sel.length === 2 && sel.indexOf('10') >= 0 && sel.indexOf('11') >= 0, JSON.stringify(sel));
		await openBox();
		ok('opening the box kept the selection', JSON.stringify(await selectedOnMap()) === JSON.stringify(sel), JSON.stringify(await selectedOnMap()));
		await setScope('selected');
		ok('choosing Selected kept the selection', JSON.stringify(await selectedOnMap()) === JSON.stringify(sel), JSON.stringify(await selectedOnMap()));
		const picked = await pressFind();
		console.log('  ' + picked.slice(0, 200) + '\n  notice: ' + await notice());
		ok('the selection survived pressing Find', JSON.stringify(await selectedOnMap()) === JSON.stringify(sel), JSON.stringify(await selectedOnMap()));
		ok('Selected gives a different answer from All', picked !== all);
		const scaledNote = (await a.lang('lpn_ds_scaled_selected')).split('{n}')[0];
		ok('the Find answer says only the selected junctions were scaled', picked.indexOf(scaledNote) >= 0, picked.slice(0, 200));

		await a.page.click('#lpn_ds_close');
		await a.settle(200);
		ok('closing the box keeps the selection', JSON.stringify(await selectedOnMap()) === JSON.stringify(sel), JSON.stringify(await selectedOnMap()));

		// The other reading of Tom's sentence: a selection built in Edit > Find and replace (Shift+click
		// on its result rows) must be the one the analysis scales.
		console.log('\n--- Selected junctions, picked in Find and replace ---');
		await a.page.keyboard.press('Escape');
		await a.settle(200);
		await a.menuClick(await a.lang('lpn_find_menu'), 'edit');
		await a.page.waitForSelector('#lpn_find_form', { state: 'visible' });
		await a.page.selectOption('#lpn_find_form select >> nth=0', 'junction');
		await a.settle(100);
		await a.page.fill('#lpn_find_form input[type="text"] >> nth=0', '2');
		await a.page.click('#lpn_find_go');
		await a.settle(300);
		const shiftRow = async (id) => {
			for (const r of await a.page.$$('#lpn_find_results .lpn-find-row')) {
				if (await r.evaluate((e, want) => !!e._lpnFindRef && e._lpnFindRef.id === want, id)) {
					await r.click({ modifiers: ['Shift'] });
					break;
				}
			}
			await a.settle(200);
		};
		await shiftRow('12');
		await shiftRow('22');
		const fsel = await selectedOnMap();
		ok('Shift+click on two Find rows selects those two junctions', JSON.stringify(fsel) === '["12","22"]', JSON.stringify(fsel));
		await a.page.click('#lpn_find_close');
		await a.settle(200);
		await openBox();
		await setScope('selected');
		const viaFind = await pressFind();
		ok('the analysis scales the selection made in Find and replace',
			viaFind.indexOf((await a.lang('lpn_ds_scaled_selected')).replace('{n}', '2')) >= 0 && viaFind !== all, viaFind.slice(0, 200));
		await a.page.click('#lpn_ds_close');
		await a.settle(200);

		console.log('\n--- Selected with nothing selected, after an All answer ---');
		await a.page.keyboard.press('Escape');
		await a.settle(200);
		ok('Escape clears it', (await selectedOnMap()).length === 0, JSON.stringify(await selectedOnMap()));
		await openBox();
		await setScope('all');
		await pressFind();
		await setScope('selected');
		const findLabel = await a.lang('lpn_ds_find');
		for (const bt of await a.page.$$('#lpn_ds_controls button.lpn-ff-run')) {
			if (((await bt.textContent()) || '').trim() === findLabel) { await bt.click(); break; }
		}
		await a.settle(800);
		const none = await a.page.$eval('#lpn_ds_controls [data-ds="search"]', (h) => h.textContent);
		console.log('  answer: ' + none.slice(0, 160) + '\n  notice: ' + await notice());
		ok('nothing selected: the All answer is not left standing as if it were the Selected one', none.indexOf(all.slice(0, 40)) < 0, none.slice(0, 120));
		ok('...and the refusal is said in the box, under Find', none === await a.lang('lpn_ds_no_selection'), none.slice(0, 120));

		await a.context.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
