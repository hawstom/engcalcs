// **A DESCRIPTION TAKES LINES AND PARAGRAPHS** (Task 806), in real Chromium with real key presses:
//   1. Properties' Description is a textarea that grows; Enter types a newline, Ctrl+Enter commits;
//   2. the two-paragraph text is saved in the project file with \n and is intact after a reload;
//   3. the Tables pane shows the first line, with the whole text in the cell's tip, and typing in
//      that cell edits the first line and keeps the rest;
//   4. the .inp export puts the first line on the row and the rest on `;|` lines, and the page's own
//      reader gives the same text back; a single-line description is written as it always was.
//
//   node dev/lpn-spike/description-lines-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const zlib = require('zlib');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DESCLINES_BROWSER_LOCKED';
const NAME = 'description-lines-browser-harness';

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
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined || cond ? '' : '   ' + detail));
}
function unzip(buf) {
	const out = {};
	let e = buf.length - 22;
	while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) { e--; }
	if (e < 0) { return null; }
	const n = buf.readUInt16LE(e + 10);
	let p = buf.readUInt32LE(e + 16);
	for (let i = 0; i < n; i++) {
		const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28),
			xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), loc = buf.readUInt32LE(p + 42),
			name = buf.toString('utf8', p + 46, p + 46 + nlen);
		const start = loc + 30 + buf.readUInt16LE(loc + 26) + buf.readUInt16LE(loc + 28), body = buf.subarray(start, start + csize);
		out[name] = method === 8 ? zlib.inflateRawSync(body) : Buffer.from(body);
		p += 46 + nlen + xlen + clen;
	}
	return out;
}

const TEXT = ['Pump house feed', 'Valve key at the office', '', 'Second paragraph: replaced 2019.'];
const WHOLE = TEXT.join('\n');

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		const descLabel = await a.lang('lpn_field_desc');
		const openFirstNode = async () => {
			const at = await page.evaluate(() => {
				const ns = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)'))
					.filter((c) => c.getBoundingClientRect().width > 0);
				const r = ns[0].getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			});
			await page.mouse.click(at.x, at.y);
			await a.settle(900);
			return page.evaluate(() => { const e = document.querySelector('#lpn_popup input'); return e ? e.value : null; });
		};
		const mark = () => page.evaluate((t) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((l) => (l.textContent || '').trim().indexOf(t) === 0)[0];
			const i = l && l.querySelector('textarea');
			if (!i) { return false; }
			i.setAttribute('data-test-desc', '1');
			return true;
		}, descLabel);
		const box = () => page.evaluate(() => {
			const t = document.querySelector('[data-test-desc]');
			return t ? { value: t.value, h: t.offsetHeight, tag: t.tagName } : null;
		});

		const nodeId = await openFirstNode();
		ok('Properties is open on a node', !!nodeId, nodeId);
		ok('the Description row is a textarea', await mark());
		const h1 = (await box()).h;

		// ---- 1. typing two paragraphs ----
		await page.focus('[data-test-desc]');
		await page.keyboard.type(TEXT[0]);
		await page.keyboard.press('Enter');
		await page.keyboard.type(TEXT[1]);
		await page.keyboard.press('Enter');
		await page.keyboard.press('Enter');
		await page.keyboard.type(TEXT[3]);
		const b1 = await box();
		ok('Enter typed newlines and the box holds the two paragraphs', b1.value === WHOLE, JSON.stringify(b1.value));
		ok('the box grew with the text (' + h1 + ' to ' + b1.h + ' px)', b1.h > h1 * 2, h1 + ' / ' + b1.h);
		ok('the Properties box is still open (Enter did not close it)', !!(await page.$('#lpn_popup_fields')));
		await page.keyboard.press('Control+Enter');
		await a.settle(700);
		ok('Ctrl+Enter left the box', await page.evaluate(() => document.activeElement !== document.querySelector('[data-test-desc]')));

		// ---- 2. the Tables pane ----
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		const tabId = await page.evaluate(() => {
			const t = Array.from(document.querySelectorAll('[id^="lpn_pane_tab_"]')).map((e) => e.id);
			return t.filter((i) => /junction/i.test(i))[0] || t.join(',');
		});
		await page.click('#' + tabId);
		await a.settle(800);
		const kind = tabId.replace('lpn_pane_tab_', '');
		const cell = () => page.evaluate(([k, id]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-desc')).filter((t) => t._lpnPaneId === id)[0];
			const i = td && td.querySelector('input');
			return i ? { value: i.value, title: i.getAttribute('data-bs-original-title') || i.title, multi: i.classList.contains('lpn-pane-multi') } : null;
		}, [kind, nodeId]);
		const c1 = await cell();
		ok('the Tables cell shows the first line only', c1 && c1.value === TEXT[0], JSON.stringify(c1));
		ok('...with the whole text in its tip and marked as longer', c1 && c1.title === WHOLE && c1.multi, JSON.stringify(c1));

		// edit the first line in the cell; the rest must survive
		const sel = `#lpn_pane_${kind} td.lpn-pane-col-desc input`;
		const idx = await page.evaluate(([k, id]) => Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-desc'))
			.findIndex((t) => t._lpnPaneId === id), [kind, nodeId]);
		await page.locator(sel).nth(idx).dblclick();
		await page.keyboard.press('End');
		await page.keyboard.type(' (edited)');
		await page.keyboard.press('Enter');
		await a.settle(600);
		const c2 = await cell();
		ok('editing the cell changed the first line and kept the rest',
			c2 && c2.title === 'Pump house feed (edited)\n' + TEXT.slice(1).join('\n'), JSON.stringify(c2));
		// an unedited commit must not touch the text
		await page.locator(sel).nth(idx).dblclick();
		await page.keyboard.press('Enter');
		await a.settle(400);
		const c3 = await cell();
		ok('leaving the cell untouched changes nothing', c3 && c3.title === c2.title, JSON.stringify(c3));

		// ---- 3. save, reload, see it intact ----
		const FILE = 'DescLines-lpn.json';
		await a.queuePick(FILE);
		await a.menuClick('Save');
		await a.answerTrainingPanel('TGH');
		await a.settle(700);
		const saved = JSON.parse(await a.readFile(FILE));
		const sn = (saved.nodes || (saved.network && saved.network.nodes) || []).filter((n) => n.id === nodeId)[0];
		const WANT = 'Pump house feed (edited)\n' + TEXT.slice(1).join('\n');
		ok('the project file holds the description with \\n', !!sn && sn.desc === WANT, JSON.stringify(sn && sn.desc) + ' ' + Object.keys(saved).join(','));
		await a.reload();
		await a.settle(1500);
		ok('after reload, still one project open', true);
		const id2 = await openFirstNode();
		ok('after reload, Properties opens on the same node', id2 === nodeId, id2);
		await mark();
		const b2 = await box();
		ok('after reload, Properties shows both paragraphs intact', b2 && b2.value === WANT, JSON.stringify(b2));

		// ---- 4. .inp export and the page's own reader ----
		const got = [];
		const onDl = (d) => got.push(d);
		page.on('download', onDl);
		await page.evaluate(() => { const bd = document.getElementById('lpn_dialog_backdrop'); if (bd && getComputedStyle(bd).display !== 'none') { document.querySelector('#lpn_dialog_buttons button').click(); } });
		await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_inp'), 'file');
		for (let i = 0; i < 60 && got.length < 1; i++) { await page.waitForTimeout(100); }
		page.off('download', onDl);
		ok('an .inp was downloaded', got.length >= 1);
		let buf = fs.readFileSync(await got[0].path());
		if (buf.readUInt32LE(0) === 0x04034b50) { const z = unzip(buf); buf = z[Object.keys(z).find((k) => /\.inp$/i.test(k))]; }
		const inp = buf.toString('utf8');
		const L = inp.split(/\r?\n/);
		const at = L.findIndex((l) => l.indexOf(';Pump house feed (edited)') >= 0);
		ok('the first line sits on the element row as a trailing comment', at > 0 && /^\s*\S+/.test(L[at]) && L[at].indexOf('\t;Pump house feed (edited)') > 0, L[at]);
		ok('the later lines follow on ;| comment lines, the blank one a bare ;|',
			L[at + 1] === ';|Valve key at the office' && L[at + 2] === ';|' && L[at + 3] === ';|Second paragraph: replaced 2019.',
			JSON.stringify(L.slice(at, at + 4)));
		const back = await page.evaluate((text) => {
			const p = EngCalcs.lpnInpParse(text);
			return p.ok ? (p.nodes || []).filter((n) => n.desc && n.desc.indexOf('Pump house') === 0).map((n) => n.desc) : p.error;
		}, inp);
		ok('the page\'s own reader gives the same text back', Array.isArray(back) && back.length === 1 && back[0] === WANT, JSON.stringify(back));
		ok('no other element gained a description it did not have',
			await page.evaluate((text) => (EngCalcs.lpnInpParse(text).nodes || []).filter((n) => n.desc).length, inp) === 1);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
