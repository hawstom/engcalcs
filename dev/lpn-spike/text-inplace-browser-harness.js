// **A TEXT IS EDITED IN PLACE** (Tom, 2026-10-14: *"It would be really nice for Text to be editable
// in place instead of only in the properties box."*). In real Chromium, with real presses and keys:
//   1. the Text tool places a Text and opens the in-place editor on it, placeholder selected;
//      Esc keeps the placeholder;
//   2. a double-click on the Text in Select opens the editor, not Properties; Enter is a new line,
//      Ctrl+Enter commits, and the map and the saved project hold both lines; a digit and Delete
//      typed into it are words, not shortcuts;
//   3. Esc cancels; one Undo restores the previous words; a press on the map commits;
//   4. Properties, open on the Text, shows the new words at once;
//   5. a rotated Text opens a rotated editor over its words, with Recalculate off;
//   6. a new Text placed and typed in one go is ONE Undo step, and the press that finishes it
//      places nothing;
//   7. the same on the Spanish page.
//
//   node dev/lpn-spike/text-inplace-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TEXTINPLACE_BROWSER_LOCKED';
const NAME = 'text-inplace-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function open(Session, browser, url, name) {
	const a = await Session.open(browser, name, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto(url);
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(800);
	await a.newProject('us');
	await a.dismissGallery();
	await a.settle(600);
	return a;
}

function helpers(a) {
	const P = a.page;
	const settle = (ms) => a.settle(ms || 300);
	const stored = async () => {
		await settle(1200);
		return P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null');
		});
	};
	const storedTexts = async () => ((await stored()) || {}).labels || [];
	const mapTexts = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text.lpn-lbl[data-lbl]'))
		.map((t) => ({ id: t.getAttribute('data-lbl'), rows: t.querySelectorAll('tspan').length
			? Array.from(t.querySelectorAll('tspan')).map((s) => s.textContent) : [t.textContent],
		vis: t.style.visibility })));
	const textCentre = (id) => P.evaluate((i) => {
		const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl="' + i + '"]');
		if (!t) { return null; }
		const r = t.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	}, id);
	const editor = () => P.evaluate(() => {
		const t = document.querySelector('textarea.lpn-text-inplace');
		if (!t) { return null; }
		const r = t.getBoundingClientRect();
		return { value: t.value, focused: t === document.activeElement,
			allSelected: t.selectionStart === 0 && t.selectionEnd === t.value.length,
			transform: t.style.transform, cx: r.x + r.width / 2, cy: r.y + r.height / 2,
			font: parseFloat(t.style.fontSize) };
	});
	const canvasPoint = (fx, fy) => P.evaluate(([x, y]) => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x + r.width * x, y: r.y + r.height * y };
	}, [fx, fy]);
	const popupText = () => P.evaluate(() => {
		const p = document.getElementById('lpn_popup');
		if (!p || p.style.display === 'none') { return null; }
		const t = p.querySelector('#lpn_popup_fields textarea');
		return t ? t.value : null;
	});
	const select = async () => { await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await settle(150); await P.keyboard.press('0'); await settle(200); };
	return { P, settle, stored, storedTexts, mapTexts, textCentre, editor, canvasPoint, popupText, select };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		console.log('\n1. The Text tool places a Text and opens the editor on it');
		const a = await open(Session, browser, 'Looped-Network.php', NAME);
		const h = helpers(a), P = h.P;
		const placeholder = await a.lang('lpn_new_text');
		await a.toolbarClick(await a.lang('lpn_tool_add_text'));
		await h.settle(200);
		const spot = await h.canvasPoint(0.4, 0.4);
		await P.mouse.click(spot.x, spot.y);
		await h.settle(300);
		let ed = await h.editor();
		ok('the editor opens on the new Text', !!ed, JSON.stringify(ed));
		ok('...pre-filled with the placeholder, focused and fully selected',
			!!ed && ed.value === placeholder && ed.focused && ed.allSelected, JSON.stringify(ed));
		let texts = await h.mapTexts();
		ok('...and the map words are hidden under it', texts.length === 1 && texts[0].vis === 'hidden', JSON.stringify(texts));
		await P.keyboard.press('Escape');
		await h.settle(200);
		ok('Esc closes it and keeps the placeholder', !(await h.editor()) &&
			(await h.mapTexts())[0].rows.join('|') === placeholder, JSON.stringify(await h.mapTexts()));
		const id = (await h.mapTexts())[0].id;

		console.log('\n2. A double-click in Select edits it; Enter is a new line; Ctrl+Enter commits');
		await h.select();
		let c = await h.textCentre(id);
		await P.mouse.dblclick(c.x, c.y);
		await h.settle(500);
		ed = await h.editor();
		ok('a double-click opens the editor, words selected', !!ed && ed.value === placeholder && ed.allSelected, JSON.stringify(ed));
		ok('...and not the Properties box', (await h.popupText()) === null);
		await P.keyboard.type('Valve 19');
		await P.keyboard.press('Enter');
		await P.keyboard.type('Pump');
		await P.keyboard.press('Delete');
		await P.keyboard.press('Control+Enter');
		await h.settle(400);
		ok('Ctrl+Enter closes the editor', !(await h.editor()));
		texts = await h.mapTexts();
		ok('the map holds both lines, and the digits and Delete were words, not shortcuts',
			texts.length === 1 && texts[0].rows.join('|') === 'Valve 19|Pump' && texts[0].vis === '', JSON.stringify(texts));
		let st = await h.storedTexts();
		ok('the saved project holds both lines', st.length === 1 && st[0]._text === 'Valve 19\nPump', JSON.stringify(st));

		console.log('\n3. Esc cancels; Undo restores; a press on the map commits');
		c = await h.textCentre(id);
		await P.mouse.dblclick(c.x, c.y);
		await h.settle(400);
		await P.keyboard.type('nothing');
		await P.keyboard.press('Escape');
		await h.settle(300);
		ok('Esc cancels the edit', (await h.mapTexts())[0].rows.join('|') === 'Valve 19|Pump' &&
			(await h.storedTexts())[0]._text === 'Valve 19\nPump');
		await P.keyboard.press('Control+z');
		await h.settle(500);
		ok('one Undo restores the words before the edit', (await h.mapTexts())[0].rows.join('|') === placeholder &&
			(await h.storedTexts())[0]._text === placeholder, JSON.stringify(await h.mapTexts()));
		c = await h.textCentre(id);
		await P.mouse.dblclick(c.x, c.y);
		await h.settle(400);
		await P.keyboard.type('Clicked away');
		const away = await h.canvasPoint(0.8, 0.8);
		await P.mouse.click(away.x, away.y);
		await h.settle(400);
		ok('a press on the map commits', !(await h.editor()) &&
			(await h.storedTexts())[0]._text === 'Clicked away', JSON.stringify(await h.storedTexts()));

		console.log('\n4. Properties, open on the Text, follows at once');
		c = await h.textCentre(id);
		await P.mouse.click(c.x, c.y);
		await h.settle(700);
		ok('Properties is open on the Text', (await h.popupText()) === 'Clicked away', await h.popupText());
		c = await h.textCentre(id);
		// The box opens beside the selection and can cover the Text's middle on this viewport; a
		// person double-clicks the words they can see, so the box is moved off them first.
		await P.evaluate(() => { const p = document.getElementById('lpn_popup'); p.style.left = '1000px'; p.style.top = '80px'; });
		await P.mouse.dblclick(c.x, c.y);
		await h.settle(400);
		ok('a double-click with Properties open still opens the editor', !!(await h.editor()), JSON.stringify(await h.editor()));
		await P.keyboard.type('From the map');
		await P.keyboard.press('Control+Enter');
		await h.settle(400);
		ok('...and shows the new words with no reopen', (await h.popupText()) === 'From the map', await h.popupText());
		await P.keyboard.press('Escape');

		console.log('\n5. A rotated Text, with Recalculate off');
		await P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}'), k = 'lpn_project_' + idx.openId,
				p = JSON.parse(localStorage.getItem(k));
			p.labels[0].rot = 30;
			p.settings = p.settings || {};
			p.settings.autoRun = false;
			localStorage.setItem(k, JSON.stringify(p));
		});
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await h.settle(1000);
		const tr = await P.evaluate((i) => {
			const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl="' + i + '"]');
			return t ? t.getAttribute('transform') : null;
		}, id);
		ok('the Text is drawn turned', /rotate\(-30/.test(tr || ''), tr);
		c = await h.textCentre(id);
		await P.mouse.dblclick(c.x, c.y);
		await h.settle(400);
		ed = await h.editor();
		ok('the editor opens turned the same way', !!ed && /rotate\(-30/.test(ed.transform), JSON.stringify(ed));
		ok('...over the words (centres within 12 px)', !!ed && Math.hypot(ed.cx - c.x, ed.cy - c.y) < 12,
			ed && JSON.stringify({ ed: [ed.cx, ed.cy], text: [c.x, c.y] }));
		await P.keyboard.type('Turned');
		await P.keyboard.press('Control+Enter');
		await h.settle(400);
		st = await h.storedTexts();
		ok('the turned Text takes the edit with Recalculate off',
			st[0]._text === 'Turned' && (await h.stored()).settings.autoRun === false, JSON.stringify(st));

		console.log('\n6. A new Text typed in one go is one Undo step');
		await a.toolbarClick(await a.lang('lpn_tool_add_text'));
		await h.settle(200);
		const spot2 = await h.canvasPoint(0.6, 0.25);
		await P.mouse.click(spot2.x, spot2.y);
		await h.settle(300);
		await P.keyboard.type('Tank site');
		const away2 = await h.canvasPoint(0.25, 0.75);
		await P.mouse.click(away2.x, away2.y);
		await h.settle(400);
		st = await h.storedTexts();
		ok('the press that finishes it places nothing', st.length === 2 && st[1]._text === 'Tank site', JSON.stringify(st));
		await h.select();
		await P.keyboard.press('Control+z');
		await h.settle(500);
		st = await h.storedTexts();
		ok('one Undo takes the whole new Text away', st.length === 1 && st[0]._text === 'Turned', JSON.stringify(st));
		await a.close();

		console.log('\n7. ?lang=es');
		const b = await open(Session, browser, 'Looped-Network.php?lang=es', NAME + '-es');
		const g = helpers(b);
		await b.toolbarClick(await b.lang('lpn_tool_add_text'));
		await g.settle(200);
		const s3 = await g.canvasPoint(0.4, 0.4);
		await g.P.mouse.click(s3.x, s3.y);
		await g.settle(300);
		ed = await g.editor();
		ok('es: the editor opens with the Spanish placeholder', !!ed && ed.value === await b.lang('lpn_new_text'), JSON.stringify(ed));
		await g.P.keyboard.press('Escape');
		await g.select();
		const idEs = (await g.mapTexts())[0].id;
		c = await g.textCentre(idEs);
		await g.P.mouse.dblclick(c.x, c.y);
		await g.settle(400);
		await g.P.keyboard.type('Válvula');
		await g.P.keyboard.press('Enter');
		await g.P.keyboard.type('cerrada');
		await g.P.keyboard.press('Control+Enter');
		await g.settle(400);
		ok('es: both lines on the map and in the saved project',
			(await g.mapTexts())[0].rows.join('|') === 'Válvula|cerrada' && (await g.storedTexts())[0]._text === 'Válvula\ncerrada',
			JSON.stringify(await g.mapTexts()));
		await b.close();
	} catch (e) {
		ok('harness ran to the end', false, e && e.stack);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + checks + ' checks, ' + (failures ? failures + ' FAILED' : 'all passed'));
	process.exit(failures ? 1 : 0);
}
main();
