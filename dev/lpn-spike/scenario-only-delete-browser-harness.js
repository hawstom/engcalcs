// AN ASSET DRAWN INSIDE A SCENARIO CAN BE DELETED THERE. Real Chromium, real clicks and keys.
//   Tom, 2026-10-11: "I created a junction in a Scenario 1, and it doesn't exist in Base scenario. But
//   I can't delete it in Scenario 1. So I can't delete it at all."
// Before the fix, Delete in a scenario only set `active` false, so a junction born there (inactive in
// Base, active only in that scenario) stayed in the drawing, active nowhere. Now it is deleted for
// real, through the Delete key, the Delete tool and the Tables pane alike, with one Undo step; a
// scenario-only pipe on it goes with it; a link that also exists in Base refuses the delete and is
// named; a Base asset deleted in a scenario is still only excluded there, as before. Scenario 1 is
// SOLVED before the add and after the delete, and every row of the Junctions and Pipes tables,
// results included, must match.
//   node dev/lpn-spike/scenario-only-delete-browser-harness.js        (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCENARIO_ONLY_DELETE_BROWSER_LOCKED';
const NAME = 'scenario-only-delete-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
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

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
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
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		// The real dialog box, not the browser-pass answerer, so OK is a pressed button.
		const clearSeams = () => P.evaluate(() => {
			const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
			delete window.lpnDialogAnswerer;
		});
		await clearSeams();
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await clearSeams();

		const S = {};
		const L = async (k) => { if (!(k in S)) { S[k] = await a.lang(k); } return S[k]; };
		const SCN = await L('lpn_scenario_menu');
		const stored = () => P.evaluate(() => {
			const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId;
			return JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null');
		});
		const wait = () => a.settle(900);   // past the solve/autosave debounce
		const dialogOk = async () => {
			const d = await a.waitDialog(3000);
			const said = d ? d.text : null;
			await P.evaluate((label) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === label);
				b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			}, await L('lpn_dialog_ok'));
			await a.settle(500);
			return said;
		};
		const switchTo = async (row) => {
			await a.openMenu('project');
			await a._clickRow('#lpn_menu_list', SCN);
			await P.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
			const want = await P.$$eval('#lpn_menu_list2 button.lpn-menu-row', (es, r) => {
				const e = es.find((x) => x.textContent.replace(/^[✓\s]+/, '').indexOf(r) === 0);
				return e ? e.textContent.trim() : null;
			}, row);
			await a.closeMenu();
			await a.menuClickSub(SCN, want, 'project');
			await wait();
		};
		const canvas = await P.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
		const nodeAt = (id) => P.evaluate((i) => {
			const e = document.querySelector('#lpn_canvas [data-node="' + i + '"]');
			if (!e) { return null; }
			const r = e.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, id);
		const drawnClass = (id) => P.evaluate((i) => Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"]')).map((e) => e.getAttribute('class')).join(' '), id);
		const tool = async (k) => { await a.toolbarClick(await L(k)); await a.settle(250); };
		// Draw a junction on an empty spot with the Junction tool; returns its id.
		const addJunction = async (fx, fy) => {
			const before = (await stored()).nodes.map((n) => n.id);
			await tool('lpn_tool_add_junction');
			await P.mouse.click(canvas.x + canvas.w * fx, canvas.y + canvas.h * fy);
			await wait();
			await tool('lpn_tool_select');
			const after = (await stored()).nodes.map((n) => n.id);
			return after.filter((i) => before.indexOf(i) < 0)[0];
		};
		const selectNode = async (id) => {
			const p = await nodeAt(id);
			await P.mouse.click(p.x, p.y);
			await a.settle(250);
		};
		const undo = async () => { await P.keyboard.press('Control+z'); await wait(); };
		const hasNode = (doc, id) => doc.nodes.some((n) => n.id === id);
		const hasLink = (doc, id) => doc.links.some((l) => l.id === id);
		const scn1 = (doc) => doc.scenarios.filter((s) => !s.isBase)[0];
		const ovKeys = (doc) => doc.scenarios.reduce((acc, s) => acc.concat(Object.keys(s.overrides || {})), []);

		// Every row of the Junctions and Pipes tables, inputs AND results, by element id.
		await tool('lpn_pane_toggle');
		const tables = async (skip) => {
			const out = {};
			for (const tab of ['junctions', 'pipes']) {
				await P.click('#lpn_pane_tab_' + tab);
				await a.settle(500);
				out[tab] = await P.evaluate(([tab, skip]) => {
					const rows = {};
					document.querySelectorAll('#lpn_pane_' + tab + ' td').forEach((td) => {
						const id = td._lpnPaneId;
						if (id === undefined || skip.indexOf(id) >= 0) { return; }
						const inp = td.querySelector('input, select');
						(rows[id] = rows[id] || []).push(inp ? inp.value : td.textContent.trim());
					});
					return rows;
				}, [tab, skip || []]);
			}
			out.status = await a.status();
			return out;
		};

		// ---- Scenario 1, and its solve before anything is drawn ---------------------------------
		await a.menuClickSub(SCN, (await L('lpn_scenario_new')), 'project');
		const asked = await dialogOk();
		ok('Water, Scenarios, New scenario asks for a name', !!asked, asked);
		await wait();
		let doc = await stored();
		ok('Scenario 1 exists and is current', doc.scenarios.length === 2 && doc.project.activeScenario === scn1(doc).id, JSON.stringify(doc.project.activeScenario));
		const before = await tables();
		const pressureCol = Object.keys(before.junctions).length > 0 && Object.values(before.junctions)[0].some((v) => /\d/.test(v));
		ok('Scenario 1 solved: the Junctions and Pipes tables hold rows with numbers', pressureCol && Object.keys(before.pipes).length > 0,
			Object.keys(before.junctions).length + ' junctions, ' + Object.keys(before.pipes).length + ' pipes');

		// ---- 1. Delete key -----------------------------------------------------------------------
		console.log('\n--- a junction drawn in Scenario 1, Delete key ---');
		const j1 = await addJunction(0.12, 0.2);
		doc = await stored();
		const j1el = doc.nodes.find((n) => n.id === j1);
		ok('the Junction tool drew a junction in Scenario 1', !!j1, j1);
		ok('...inactive in Base and active only in Scenario 1', j1el && j1el._active === false
			&& (scn1(doc).overrides['n:' + j1] || {}).active === true, JSON.stringify(j1el));
		await selectNode(j1);
		await P.keyboard.press('Delete');
		await wait();
		doc = await stored();
		const sOnly = (await L('lpn_scenario_only_deleted')).replace('{id}', j1).replace('{scenario}', scn1(doc).name);
		ok('Delete removes it from the drawing', !hasNode(doc, j1) && !(await nodeAt(j1)), JSON.stringify(doc.nodes.length));
		ok('...and leaves no override behind', ovKeys(doc).indexOf('n:' + j1) < 0, JSON.stringify(ovKeys(doc)));
		ok('...and says so', (await a.notice()).indexOf(sOnly) >= 0, await a.notice());
		const afterDel = await tables();
		ok('Scenario 1 solves exactly as before the add (every table row, results included)',
			JSON.stringify(afterDel) === JSON.stringify(before), afterDel.status + ' | ' + before.status);

		console.log('\n--- Undo ---');
		await undo();
		doc = await stored();
		ok('one Undo brings the junction back, active in Scenario 1 only', hasNode(doc, j1)
			&& (scn1(doc).overrides['n:' + j1] || {}).active === true && !!(await nodeAt(j1)));

		// ---- 2. Delete tool ----------------------------------------------------------------------
		console.log('\n--- the same junction, Delete tool ---');
		await tool('lpn_tool_delete');
		const p1 = await nodeAt(j1);
		await P.mouse.click(p1.x, p1.y);
		await wait();
		await tool('lpn_tool_select');
		doc = await stored();
		ok('the Delete tool removes it from the drawing', !hasNode(doc, j1) && ovKeys(doc).indexOf('n:' + j1) < 0);
		ok('Scenario 1 solves exactly as before', JSON.stringify(await tables()) === JSON.stringify(before));

		// ---- 3. a scenario-only pipe on a scenario-only junction --------------------------------
		console.log('\n--- a pipe drawn in Scenario 1 from a new junction to Base junction 10 ---');
		const j2 = await addJunction(0.12, 0.35);
		const linksBefore = (await stored()).links.map((l) => l.id);
		await tool('lpn_tool_add_pipe');
		const pj = await nodeAt(j2), p10 = await nodeAt('10');
		await P.mouse.click(pj.x, pj.y); await a.settle(250);
		await P.mouse.click(p10.x, p10.y); await wait();
		await tool('lpn_tool_select');
		doc = await stored();
		const pipe = doc.links.map((l) => l.id).filter((i) => linksBefore.indexOf(i) < 0)[0];
		ok('the Pipe tool drew a pipe in Scenario 1 from the new junction to 10', !!pipe
			&& (scn1(doc).overrides['l:' + pipe] || {}).active === true, pipe);
		await selectNode(j2);
		await P.keyboard.press('Delete');
		await wait();
		doc = await stored();
		ok('Delete on the junction removes it AND its scenario-only pipe', !hasNode(doc, j2) && !hasLink(doc, pipe)
			&& ovKeys(doc).indexOf('l:' + pipe) < 0, JSON.stringify(ovKeys(doc)));
		ok('Scenario 1 solves exactly as before', JSON.stringify(await tables()) === JSON.stringify(before));
		await undo();
		doc = await stored();
		ok('one Undo brings back both the junction and the pipe', hasNode(doc, j2) && hasLink(doc, pipe));

		// ---- 4. the Tables pane door -------------------------------------------------------------
		console.log('\n--- the Tables pane: Delete element on the pipe row, then the junction row ---');
		const paneDelete = async (tab, id) => {
			await P.click('#lpn_pane_tab_' + tab);
			await a.settle(500);
			const box = await P.evaluate(([tab, id]) => {
				const td = Array.from(document.querySelectorAll('#lpn_pane_' + tab + ' td')).find((t) => t._lpnPaneId === id && /lpn-pane-col-id/.test(t.className));
				if (!td) { return null; }
				td.scrollIntoView({ block: 'center' });
				const r = td.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, [tab, id]);
			if (!box) { return false; }
			await P.mouse.click(box.x, box.y);
			await a.settle(200);
			await P.mouse.click(box.x, box.y, { button: 'right' });
			await a.settle(300);
			const label = await L('lpn_pane_delete_element');
			const hit = await P.evaluate((label) => {
				const b = Array.from(document.querySelectorAll('button')).find((x) => x.offsetParent !== null && x.textContent.trim() === label);
				if (!b) { return false; }
				b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
				return true;
			}, label);
			await wait();
			return hit;
		};
		ok('the Junctions table row menu offers Delete element', await paneDelete('junctions', j2));
		doc = await stored();
		ok('...and it removes the scenario-only junction and its pipe', !hasNode(doc, j2) && !hasLink(doc, pipe));
		ok('Scenario 1 solves exactly as before', JSON.stringify(await tables()) === JSON.stringify(before));
		await undo();

		// ---- 5. a link that also exists in Base keeps the junction -------------------------------
		console.log('\n--- a pipe drawn in BASE onto the Scenario 1 junction ---');
		await switchTo(await L('lpn_scenario_base'));
		doc = await stored();
		ok('in Base the Scenario 1 junction is drawn faded (inactive)', /lpn-inactive/.test(await drawnClass(j2)), await drawnClass(j2));
		const linksB = doc.links.map((l) => l.id);
		await tool('lpn_tool_add_pipe');
		const pj2 = await nodeAt(j2), p11 = await nodeAt('11');
		await P.mouse.click(pj2.x, pj2.y); await a.settle(250);
		await P.mouse.click(p11.x, p11.y); await wait();
		await tool('lpn_tool_select');
		doc = await stored();
		const basePipe = doc.links.map((l) => l.id).filter((i) => linksB.indexOf(i) < 0)[0];
		ok('a Base pipe now ends on the junction', !!basePipe && doc.links.find((l) => l.id === basePipe)._active !== false, basePipe);
		await switchTo(scn1(doc).name);
		await selectNode(j2);
		await P.keyboard.press('Delete');
		await wait();
		doc = await stored();
		const blocked = (await L('lpn_scenario_delete_blocked')).split('{id}').join(j2).split('{link}').join(basePipe)
			.split('{scenario}').join(scn1(doc).name).split('{base}').join(await L('lpn_scenario_base'));
		ok('Delete in Scenario 1 is refused, naming the Base pipe', hasNode(doc, j2) && hasLink(doc, basePipe)
			&& (await a.notice()).indexOf(blocked) >= 0, await a.notice());

		// ---- 6. Base side: the Scenario 1 junction is deletable there, nothing stranded ----------
		console.log('\n--- in Base, Delete on the faded junction ---');
		await switchTo(await L('lpn_scenario_base'));
		await selectNode(j2);
		await P.keyboard.press('Delete');
		const conf = await dialogOk();
		await wait();
		doc = await stored();
		ok('Base asks before dropping Scenario 1 values, then deletes the junction and every pipe on it',
			!!conf && !hasNode(doc, j2) && !hasLink(doc, pipe) && !hasLink(doc, basePipe), conf);
		ok('...leaving no override keyed to any of them', ovKeys(doc).every((k) => [ 'n:' + j2, 'l:' + pipe, 'l:' + basePipe ].indexOf(k) < 0), JSON.stringify(ovKeys(doc)));

		// ---- 7. a Base asset deleted in a scenario: excluded there, as before ---------------------
		console.log('\n--- Base junction 22, Delete key in Scenario 1 ---');
		await switchTo(scn1(doc).name);
		await selectNode('22');
		await P.keyboard.press('Delete');
		await wait();
		doc = await stored();
		const excl = (await L('lpn_scenario_deactivated')).replace('{id}', '22').replace('{scenario}', scn1(doc).name);
		const where = (await L('lpn_scenario_delete_in_base')).replace('{base}', await L('lpn_scenario_base'));
		ok('junction 22 stays in the drawing, excluded in Scenario 1 only', hasNode(doc, '22')
			&& (scn1(doc).overrides['n:22'] || {}).active === false && /lpn-inactive/.test(await drawnClass('22')));
		ok('...and the notice says where it can be deleted', (await a.notice()).indexOf(excl + ' ' + where) >= 0, await a.notice());
		const ex22 = await tables();
		// Rows OTHER than 22's must move: that proves the snapshot carries the solve's results, so
		// every "solves exactly as before" above compared hydraulics and not just inputs.
		const moved = Object.keys(before.junctions).filter((i) => i !== '22' && JSON.stringify(ex22.junctions[i]) !== JSON.stringify(before.junctions[i]))
			.concat(Object.keys(before.pipes).filter((i) => JSON.stringify(ex22.pipes[i]) !== JSON.stringify(before.pipes[i])));
		ok('...and Scenario 1 solves differently with 22 excluded (other rows\' results move)', moved.length > 0, moved.join(','));
		await undo();
		ok('Undo puts 22 back, and Scenario 1 solves exactly as at the start', JSON.stringify(await tables()) === JSON.stringify(before));

		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		// ---- 8. a non-English page carries the three strings -------------------------------------
		const b = await Session.open(browser, NAME + '-es', { viewport: { width: 1400, height: 900 } });
		await b.goto('Looped-Network.php?lang=es');
		const es = await b.page.evaluate(() => ['lpn_scenario_only_deleted', 'lpn_scenario_delete_blocked', 'lpn_scenario_delete_in_base']
			.map((k) => typeof (EngCalcs.pageConfig || {})[k] === 'string' && EngCalcs.pageConfig[k].length > 0));
		ok('?lang=es: the page carries all three new messages', es.every(Boolean), JSON.stringify(es));
		await b.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
