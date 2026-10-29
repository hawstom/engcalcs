// SHARED HELPER FOR THE BROWSER HARNESSES: start a scenario the way a visitor does.
//   Perry's wish (pre-reviewer): scenario harnesses mostly build scenario JSON by hand, so the shape
//   Basic mode really stores (overrides, never alternatives) is never exercised. This drives the real
//   Water > Scenarios menu, the real name dialog, the real Properties box, and reads the project back
//   from localStorage exactly as autosave wrote it.
//
//   const U = require('./scenario-ui-helper.js');
//   U.takeBrowserLock('my-harness', 'EC_MY_HARNESS_LOCKED');     // before anything else; re-execs under flock
//   const ctx = await U.openNet1(browser, 'my-harness');         // { a, P } on a clean Net1, dialogs real
//   await U.setBasicMode(ctx, true|false);                       // Water > Scenarios > Basic mode row
//   const r = await U.newScenarioAndEdit(ctx, { kind:'link', id:'10', labelKey:'lpn_field_roughness', value:'77' });
//   r.doc  -> the project JSON as stored; r.scenario -> the new child; r.said -> the name dialog's text
//
// Basic mode is a BROWSER setting (localStorage lpn_scnbasic), not a project one, so both modes must
// store the same bytes: overrides on the scenario, no alternatives key anywhere (dev/scenario-alternatives.md).
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';

// Same lock protocol as every *-browser-harness.js: re-exec under flock, wait 280 s, never nest.
function takeBrowserLock(name, lockEnv) {
	if (process.env[lockEnv] === '1') { return; }
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (!hasFlock) {
		console.error(name + ': no `flock` binary found -- running WITHOUT the browser lock.');
		return;
	}
	const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, process.argv[1]], {
		stdio: 'inherit', env: Object.assign({}, process.env, { [lockEnv]: '1' })
	});
	if (r.error) { console.error(name + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
	if (r.status === 75) {
		console.error(name + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
		process.exit(1);
	}
	process.exit(r.status === null ? 1 : r.status);
}

// Loads Looped-Network.php with the Net1 example open and the consent bar and Tom's dialog answerer
// out of the way, so OK in a dialog is a pressed button.
async function openNet1(browser, name) {
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const a = await Session.open(browser, name, { viewport: { width: 1400, height: 900 } });
	const P = a.page;
	await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	const clearSeams = () => P.evaluate(() => {
		const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
		let e = document.querySelector('.ec-consent-actions');
		while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
		if (e) { e.style.display = 'none'; }
		delete window.lpnDialogAnswerer;
	});
	await clearSeams();
	await a.openNet1Plain(await a.lang('lpn_ex_net1_title'));
	await a.settle(1500);
	await clearSeams();
	return { a, P, strings: {} };
}

const lang = async (ctx, k) => { if (!(k in ctx.strings)) { ctx.strings[k] = await ctx.a.lang(k); } return ctx.strings[k]; };
const wait = (ctx) => ctx.a.settle(900);   // past the solve/autosave debounce

// The open project exactly as autosave stored it.
const storedProject = (ctx) => ctx.P.evaluate(() => {
	const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId;
	return JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null');
});

// Tick or clear the Basic mode row (it carries a check mark in its label when on).
async function setBasicMode(ctx, wantOn) {
	const { a, P } = ctx;
	const SCN = await lang(ctx, 'lpn_scenario_menu'), BASIC = await lang(ctx, 'lpn_scenario_basic');
	const isOn = () => P.evaluate(() => localStorage.getItem('lpn_scnbasic') !== 'off');
	if ((await isOn()) === !!wantOn) { return; }
	await a.openMenu('project');
	await a._clickRow('#lpn_menu_list', SCN);
	await P.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	const row = await P.$$eval('#lpn_menu_list2 button.lpn-menu-row', (es, b) => {
		const e = es.find((x) => x.textContent.replace(/^[✓\s]+/, '') === b);
		return e ? e.textContent.trim() : null;
	}, BASIC);
	await a.closeMenu();
	await a.menuClickSub(SCN, row, 'project');
	await wait(ctx);
	if ((await isOn()) !== !!wantOn) { throw new Error('Basic mode did not become ' + (wantOn ? 'on' : 'off')); }
}

// Water > Scenarios > New scenario... then OK on the name dialog (the suggested name is kept).
// The new scenario becomes current. Returns { said, doc, scenario }.
async function createScenarioViaMenu(ctx) {
	const { a, P } = ctx;
	await a.menuClickSub(await lang(ctx, 'lpn_scenario_menu'), await lang(ctx, 'lpn_scenario_new'), 'project');
	const d = await a.waitDialog(3000);
	const said = d ? d.text : null;
	const okLabel = await lang(ctx, 'lpn_dialog_ok');
	await P.evaluate((label) => {
		const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === label);
		b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, okLabel);
	await a.settle(500);
	await wait(ctx);
	const doc = await storedProject(ctx);
	const scenario = doc.scenarios.filter((s) => !s.isBase).pop();
	return { said, doc, scenario };
}

// Click an element's symbol on the map so the Properties box opens on it.
async function openProperties(ctx, kind, id) {
	const sel = '#lpn_canvas [data-' + (kind === 'link' ? 'link' : 'node') + '="' + id + '"]';
	const at = await ctx.P.evaluate((s) => {
		const e = Array.from(document.querySelectorAll(s)).filter((x) => x.getBoundingClientRect().width > 0)[0];
		if (!e) { return null; }
		const r = e.getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	}, sel);
	if (!at) { throw new Error('no ' + kind + ' ' + id + ' drawn'); }
	await ctx.P.mouse.click(at.x, at.y);
	await ctx.a.settle(900);
}

// Type a value into one Properties field (by its visible label) and commit it as a change.
async function typeProperty(ctx, label, value) {
	const found = await ctx.P.evaluate(([t, val]) => {
		const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
			.filter((x) => x.textContent.replace(/­/g, '').trim().indexOf(t) === 0)[0];
		const i = l && l.querySelector('input');
		if (!i) { return false; }
		i.focus(); i.value = val;
		i.dispatchEvent(new Event('input', { bubbles: true }));
		i.dispatchEvent(new Event('change', { bubbles: true }));
		i.blur();
		return true;
	}, [label, String(value)]);
	if (!found) { throw new Error('Properties has no field "' + label + '"'); }
	await wait(ctx);
}

// Whichever scenario is current, edit one property of one element through the Properties box,
// close the box, and return the stored project.
async function editPropertyViaUI(ctx, spec) {
	await openProperties(ctx, spec.kind, spec.id);
	await typeProperty(ctx, await lang(ctx, spec.labelKey), spec.value);
	await ctx.P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
	await ctx.a.settle(300);
	return storedProject(ctx);
}

// The whole visitor sequence: new child scenario (menu + dialog), it is current, edit one property.
async function newScenarioAndEdit(ctx, spec) {
	const made = await createScenarioViaMenu(ctx);
	const doc = await editPropertyViaUI(ctx, spec);
	const scenario = doc.scenarios.find((s) => s.id === made.scenario.id);
	return { said: made.said, afterCreate: made.doc, doc, scenario, activeId: doc.project && doc.project.activeScenario };
}

module.exports = { REPO, takeBrowserLock, openNet1, lang, wait, storedProject, setBasicMode,
	createScenarioViaMenu, openProperties, typeProperty, editPropertyViaUI, newScenarioAndEdit };
