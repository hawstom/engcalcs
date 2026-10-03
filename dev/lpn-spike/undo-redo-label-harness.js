// UNDO AND REDO OF A TABLE EDIT AGREE EVERYWHERE THE PROPERTY SHOWS. Run with:
//   node dev/lpn-spike/undo-redo-label-harness.js
//
// Found 2026-10-02 on master by a script driving real Chrome: on Net1, a junction's Elevation
// typed 710 -> 810 in the Tables pane, then Ctrl+Z, then Ctrl+Y. *"The cell goes back to 710, but
// the map labels do NOT match their pre-edit text. Then Ctrl+Y: 810 does not come back."*
//
// **WHAT WAS MEASURED, before any change:**
//   - Ctrl+Y did nothing because the page HAD NO REDO, under any key. The only binding was Ctrl+Z.
//   - The labels were right. The finder had stepped the period run to 6:00 first; the edit drops
//     the run's frames and puts the transport back to the first reporting time (js/lpn-time.js,
//     EC.lpnTimeRun), so after the undo the labels showed 0:00 answers for the restored network --
//     different text from the 6:00 labels, and the same text as a fresh solve at 0:00. From 0:00,
//     as here, the labels after Ctrl+Z are character-for-character the ones before the edit.
//   - Undo also CLOSED the Properties box on every press, even when its element was still there.
//
// **THE INVARIANT:** after the edit, after Ctrl+Z and after each Redo chord (Ctrl+Y and
// Ctrl+Shift+Z), the Tables cell, the open Properties box and the element's own map label all
// show the value the document holds, and the whole label layer is the one that state had before.
// Run twice: Recalculate ON, and OFF (CLAUDE.md's snapshot rule: stale answers stay, so the
// labels must come back to exactly the stale text they had). Then a NEW edit after an undo must
// empty the redo stack, or Ctrl+Y would paste an abandoned change over it.
//
// **RUN IT DIRECTLY -- DO NOT PREFIX IT WITH `flock`.** It locks /tmp/engcalcs-browser.lock itself
// by re-executing under flock, like label-drag-fit-harness.js; an outer flock would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_UNDO_REDO_LABEL_LOCKED';
const NAME = 'undo-redo-label-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
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

const NODE = '11';   // Net1's first demand junction, elevation 710 ft

// Every label on the map, in drawing order, with whose it is.
function allLabels(page) {
	return page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text'))
		.map((t) => (t.getAttribute('data-nodelbl') || t.getAttribute('data-linklbl') || '') + ':' + t.textContent).join('\n'));
}
// What each of the three places shows for the node's elevation.
function shows(page) {
	return page.evaluate((id) => {
		const row = Array.from(document.querySelectorAll('#lpn_pane_junctions tbody tr')).find((tr) => {
			const c = tr.children[0], i = c && c.querySelector('input');
			return (i ? i.value : c.textContent).trim() === id;
		});
		const heads = Array.from(document.querySelectorAll('#lpn_pane_junctions thead th')).map((t) => t.textContent);
		const ci = heads.findIndex((t) => /elev/i.test(t));
		let cell = null;
		if (row && ci >= 0) { const td = row.children[ci], i = td.querySelector('input'); cell = (i ? i.value : td.textContent).trim(); }
		const pop = document.getElementById('lpn_popup');
		let props = null;
		if (pop && pop.style.display !== 'none') {
			const lab = Array.from(document.querySelectorAll('#lpn_popup_fields label')).find((l) => /^\s*elev/i.test(l.textContent));
			const i = lab && lab.querySelector('input');
			props = i ? String(+i.value) : 'no elevation row';
		}
		const t = document.querySelector('#lpn_canvas text[data-nodelbl="' + id + '"]');
		const m = t && /Z=([0-9.]+)/.exec(t.textContent);
		return { cell, props, label: m ? String(+m[1]) : null, ci };
	}, NODE);
}
function agree(s, v) { return s.cell === v && s.props === v && s.label === v; }
function fmt(s) { return 'cell ' + s.cell + ', Properties ' + s.props + ', label Z=' + s.label; }

async function setAutoRun(a, on) {
	await a.toolbarClick('Settings');
	await a.settle(400);
	const hit = await a.page.evaluate((want) => {
		const row = Array.from(document.querySelectorAll('#lpn_settings_box label.lpn-set-row'))
			.find((l) => /recalculate automatically/i.test(l.textContent));
		const cb = row && row.querySelector('input[type="checkbox"]');
		if (!cb) { return false; }
		if (cb.checked !== want) { cb.click(); }
		return true;
	}, on);
	await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
	await a.settle(400);
	return hit;
}

async function typeInCell(a, value) {
	await a.page.evaluate((id) => {
		const row = Array.from(document.querySelectorAll('#lpn_pane_junctions tbody tr')).find((tr) => {
			const c = tr.children[0], i = c && c.querySelector('input');
			return (i ? i.value : c.textContent).trim() === id;
		});
		const heads = Array.from(document.querySelectorAll('#lpn_pane_junctions thead th')).map((t) => t.textContent);
		const i = row.children[heads.findIndex((t) => /elev/i.test(t))].querySelector('input');
		i.focus(); i.select();
	}, NODE);
	await a.page.keyboard.type(value);
	await a.page.keyboard.press('Enter');
	await a.settle(3000);
	// Out of the table, as the finder did, so the chord reaches the map's handler from the page.
	await a.page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
	await a.settle(200);
}
async function chord(a, keys) {
	await a.page.keyboard.press(keys);
	await a.settle(3000);
}

async function section(Session, browser, recalc) {
	console.log('\n--- Recalculate ' + (recalc ? 'ON' : 'OFF') + ' ---');
	const a = await Session.open(browser, NAME);
	try {
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(2500);
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		if (!recalc) { ok('Recalculate automatically switched off in Settings', await setAutoRun(a, false)); }
		await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
		await a.settle(800);
		await page.evaluate(() => { const t = document.getElementById('lpn_pane_tab_junctions'); if (t) { t.click(); } });
		await a.settle(600);
		// Properties for the same junction, opened the way a person opens it: a click on the node.
		const at = await page.evaluate((id) => {
			const e = document.querySelector('#lpn_canvas .lpn-node-hit[data-node="' + id + '"]') ||
				document.querySelector('#lpn_canvas [data-node="' + id + '"]');
			const r = e.getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		}, NODE);
		await page.mouse.click(at.x, at.y);
		await a.settle(600);

		const s0 = await shows(page), L0 = await allLabels(page);
		ok('before: the three places agree on 710', agree(s0, '710'), fmt(s0));

		await typeInCell(a, '810');
		const s1 = await shows(page), L1 = await allLabels(page);
		ok('edit: cell, Properties and label all show 810', agree(s1, '810'), fmt(s1));

		await chord(a, 'Control+z');
		const s2 = await shows(page), L2 = await allLabels(page);
		ok('Ctrl+Z: cell, Properties and label all show 710 again (the Properties box stays open)', agree(s2, '710'), fmt(s2));
		ok('Ctrl+Z: every label on the map is the text it had before the edit', L2 === L0, firstDiff(L0, L2));

		await chord(a, 'Control+y');
		const s3 = await shows(page), L3 = await allLabels(page);
		ok('Ctrl+Y redoes: cell, Properties and label all show 810', agree(s3, '810'), fmt(s3));
		ok('Ctrl+Y: every label on the map is the text it had after the edit', L3 === L1, firstDiff(L1, L3));

		await chord(a, 'Control+z');
		await chord(a, 'Control+Shift+Z');
		const s4 = await shows(page), L4 = await allLabels(page);
		ok('Ctrl+Shift+Z redoes too', agree(s4, '810'), fmt(s4));
		ok('Ctrl+Shift+Z: every label is the post-edit text', L4 === L1, firstDiff(L1, L4));

		await chord(a, 'Control+z');
		await typeInCell(a, '750');
		await chord(a, 'Control+y');
		const s5 = await shows(page);
		ok('a new edit after an undo empties Redo: Ctrl+Y leaves 750 alone', agree(s5, '750'), fmt(s5));

		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 1).join(' | '));
	} finally {
		await a.close();
	}
}
function firstDiff(x, y) {
	if (x === y) { return undefined; }
	const A = x.split('\n'), B = y.split('\n');
	for (let i = 0; i < Math.max(A.length, B.length); i++) {
		if (A[i] !== B[i]) { return 'first difference: ' + JSON.stringify(A[i]) + ' -> ' + JSON.stringify(B[i]); }
	}
	return undefined;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		await section(Session, browser, true);
		await section(Session, browser, false);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
