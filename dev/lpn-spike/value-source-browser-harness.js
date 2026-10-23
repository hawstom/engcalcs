// WHERE-FROM ON EVERY VALUE: Properties names the source of an inherited value. Real Chromium, Net1.
//   node dev/lpn-spike/value-source-browser-harness.js   (takes the browser lock itself)
// Sue's wish (2026-10-05, item 1): "Where-from on every value (inherited from Base / local here)."
// Base > Peak > Fire. Peak states junction 10's elevation and demand; Fire states its elevation.
//   V1  Fire open: elevation wears the solid dot (lpn_ovm_dot_clear_one, short: the line carries the detail); demand is hollow and its tip
//       says "Inherited from Peak"; every other overridable row is hollow and says "Inherited from Base".
//   V2  every marker's source equals an independent walk of the stored project (Fire, Peak, Base).
//   V3  the solid dot's click is the reset: elevation turns hollow and now says "Inherited from Peak".
//   V4  Base shows no dot and no hollow dot.
//   V6  the line under an overridden row is back (what Clear restores); with Basic mode off and a stored
//       alternative it adds 'This override is stored in alternative "X".' or, when another scenario names
//       the same alternative, 'This override is stored in alternative "X", also used by Y, so clear or edits
//       change them too.'; with Basic mode on, no alternative is mentioned.
//   V7  the Properties pane does not jump: a typed edit that adds the note line, and Clear that takes it
//       away, leave the row at the same screen position (getBoundingClientRect().top), pane scrolled to
//       the bottom included. Fails without propsScrollKeep().
//   V8  three Clears in a row leave at most one line of blank, never the sum of them.
//   V5  a phone-width page keeps the marker on screen and the box without sideways scroll.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_VALSRC_LOCKED';
const NAME = 'value-source-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
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
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	let a = null, page = null;
	try {
		const open = async (active, w, h, mut, basicOff) => {
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
			d.scenarios.push({ id: 'peak', name: 'Peak', overrides: { 'n:10': { elev: 701, demand: 150 } } },
				{ id: 'fire', name: 'Fire', parent: 'peak', overrides: { 'n:10': { elev: 702 } } });
			d.project = Object.assign({}, d.project, { activeScenario: active });
			if (mut) { mut(d); }
			if (a) { await a.context.close(); }
			a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
			page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await page.evaluate(([txt, off]) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); if (off) { localStorage.setItem('lpn_scnbasic', 'off'); } }, [JSON.stringify(d), !!basicOff]);
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await page.setViewportSize({ width: w, height: h });
			await a.settle(2500);
			return d;
		};
		const openNode = async (id) => {
			const p = await page.evaluate((i) => {
				const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"]')).filter((x) => x.getBoundingClientRect().width > 0)[0];
				const r = e.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, id);
			await page.mouse.click(p.x, p.y);
			await a.settle(900);
		};
		const marks = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-ovm-dot, #lpn_popup_fields .lpn-ovm-hollow')).map((g) => ({
			kind: g.classList.contains('lpn-ovm-dot') ? 'dot' : 'hollow',
			row: ((g.parentNode.nextElementSibling || g.parentNode).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30),
			tip: g.title || g.getAttribute('aria-label') || '',
			rect: (() => { const r = g.getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width }; })() })));

		console.log('--- V1/V2. Fire open ---');
		const d = await open('fire', 1400, 900);
		await openNode('10');
		let m = await marks();
		const dots = m.filter((x) => x.kind === 'dot'), hol = m.filter((x) => x.kind === 'hollow');
		// The independent walk: nearest of Fire, Peak, Base that states the property.
		const chain = [['Fire', d.scenarios.find((s) => s.id === 'fire')], ['Peak', d.scenarios.find((s) => s.id === 'peak')]];
		const src = (prop) => { for (const [n, s] of chain) { if (s.overrides['n:10'] && prop in s.overrides['n:10']) { return n; } } return 'Base'; };
		ok('V1 Fire: elevation is the one solid dot', dots.length === 1 && dots[0].tip === (await page.evaluate(() => EngCalcs.pageConfig.lpn_ovm_dot_clear_one)), JSON.stringify(dots));
		ok('V1 ...and the rest are hollow dots', hol.length > 3, String(hol.length));
		const inh = (n) => hol.filter((x) => x.tip.indexOf('Inherited from ' + n + '.') === 0);
		ok('V2 exactly one row inherits from Peak (demand), matching the stored chain (' + src('demand') + ')', src('demand') === 'Peak' && inh('Peak').length === 1, JSON.stringify(inh('Peak')));
		ok('V2 every other hollow dot says Base, and none says anything else', inh('Base').length === hol.length - 1 && src('diameter') === 'Base', JSON.stringify(hol.map((x) => x.tip.slice(0, 22))));
		ok('V2 elevation, set in Fire, is not called inherited (' + src('elev') + ')', src('elev') === 'Fire' && !dots[0].tip.startsWith('Inherited'));

		console.log('--- V3. the solid dot resets ---');
		await page.click('#lpn_popup_fields .lpn-ovm-dot');
		await a.settle(900);
		m = await marks();
		ok('V3 no solid dot is left', m.filter((x) => x.kind === 'dot').length === 0, JSON.stringify(m.filter((x) => x.kind === 'dot')));
		ok('V3 two rows now inherit from Peak (elevation and demand)', m.filter((x) => x.tip.indexOf('Inherited from Peak.') === 0).length === 2, JSON.stringify(m.filter((x) => /Peak/.test(x.tip)).map((x) => x.row)));
		const sv = await page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover')));
		const fire = sv.scenarios.find((s) => s.id === 'fire');
		ok('V3 the stored Fire holds no elevation any more', !((fire.overrides || {})['n:10'] || {}).elev, JSON.stringify(fire.overrides));
		await page.screenshot({ path: path.join(process.env.HOME, 'webdev/worktrees/_panel/www/img/value-source.png'), clip: { x: 0, y: 0, width: 1400, height: 900 } });

		console.log('--- V4. Base ---');
		await open('base', 1400, 900);
		await openNode('10');
		m = await marks();
		ok('V4 Base shows no solid or hollow dot', m.length === 0, JSON.stringify(m));

		console.log('--- V5. phone width ---');
		await open('fire', 390, 800);
		await openNode('10');
		m = await marks();
		const fit = await page.evaluate(() => { const f = document.getElementById('lpn_popup_fields'); return { sw: f.scrollWidth, cw: f.clientWidth, vw: innerWidth }; });
		ok('V5 markers present and on screen', m.length > 3 && m.every((x) => x.rect.w > 0 && x.rect.l >= 0 && x.rect.r <= fit.vw), JSON.stringify({ n: m.length, fit }));
		ok('V5 no sideways scroll in the box', fit.sw <= fit.cw + 1, JSON.stringify(fit));
		ok('V5 the tip still names the source', m.some((x) => x.tip.indexOf('Inherited from Peak.') === 0), '');

		const noteTexts = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-ov-note')).map((n) => n.textContent.replace(/\s+/g, ' ').trim()));
		console.log('--- V6. the note line under the row ---');
		await open('fire', 1400, 900, null, true);
		await openNode('10');
		let notes = await noteTexts();
		ok('V6 Fire, no stored alternative: one note line, "Peak: 701", and no alternative sentence', notes.length === 1 && notes[0] === 'Peak: 701' && !/alternative/.test(notes[0]), JSON.stringify(notes));
		const altOf = (d) => { d.alternatives = [{ id: 'pa', category: 'physical', name: 'Peak elev', parent: null, values: { 'n:10': { elev: 701 } } }]; };
		await open('peak', 1400, 900, (d) => { altOf(d); const pk = d.scenarios.find((x) => x.id === 'peak'); pk.overrides = {}; pk.alternatives = { physical: 'pa' }; }, true);
		await openNode('10');
		notes = await noteTexts();
		const wantAlt = (await page.evaluate(() => EngCalcs.pageConfig.lpn_ovm_dot_alt)).replace('{alternative}', 'Peak elev');
		ok('V6 Peak, alternative used by Peak alone: the note ends with the alternative sentence', notes.length === 1 && notes[0].endsWith(wantAlt), JSON.stringify(notes));
		await open('peak', 1400, 900, (d) => { altOf(d); const pk = d.scenarios.find((x) => x.id === 'peak'); pk.overrides = {}; pk.alternatives = { physical: 'pa' }; d.scenarios.find((x) => x.id === 'fire').alternatives = { physical: 'pa' }; }, true);
		await openNode('10');
		notes = await noteTexts();
		const wantShared = (await page.evaluate(() => EngCalcs.pageConfig.lpn_ovm_dot_alt_shared)).replace('{alternative}', 'Peak elev').replace('{list}', 'Fire');
		ok('V6 Peak and Fire name it: "...also used by Fire, so clear or edits change them too."', notes.length === 1 && notes[0].endsWith(wantShared), JSON.stringify(notes));
		await open('fire', 1400, 900);
		await openNode('10');
		notes = await noteTexts();
		ok('V6 Basic mode on: the note never mentions an alternative', notes.length === 1 && !/alternative/.test(notes[0]), JSON.stringify(notes));

		console.log('--- V7. the pane does not jump ---');
		await open('peak', 1400, 600, (d) => { d.scenarios.find((x) => x.id === 'peak').overrides = {}; }, true);
		await openNode('10');
		const geom = (rowText) => page.evaluate((t) => {
			const sc = document.getElementById('lpn_popup_fields').parentElement;
			const g = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-ovm')).find((x) => x.nextElementSibling && x.nextElementSibling.textContent.indexOf(t) >= 0);
			return { top: g.getBoundingClientRect().top, st: sc.scrollTop, scrolls: sc.scrollHeight > sc.clientHeight };
		}, rowText);
		const ROW = 'Source quality';
		const field = page.locator('#lpn_popup_fields label', { hasText: ROW }).locator('input').first();
		await field.scrollIntoViewIfNeeded();
		await page.evaluate(() => { const sc = document.getElementById('lpn_popup_fields').parentElement; sc.scrollTop = sc.scrollHeight; });
		await field.fill('5');
		const before = await geom(ROW);
		ok('V7 the pane is scrolled down', before.scrolls && before.st > 100, JSON.stringify(before));
		await field.evaluate((e) => e.blur());
		await a.settle(700);
		const added = await geom(ROW);
		ok('V7 typing the value adds the note line and the row stays within 2 px (' + before.top.toFixed(1) + ' to ' + added.top.toFixed(1) + ')', Math.abs(added.top - before.top) <= 2 && (await noteTexts()).length === 1, JSON.stringify([before, added]));
		await page.evaluate(() => { const sc = document.getElementById('lpn_popup_fields').parentElement; sc.scrollTop = sc.scrollHeight; });
		const b2 = await geom(ROW);
		await page.evaluate((t) => { const g = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-ovm')).find((x) => x.nextElementSibling && x.nextElementSibling.textContent.indexOf(t) >= 0); g.querySelector('.lpn-ovm-dot').click(); }, ROW);
		await a.settle(700);
		const cleared = await geom(ROW);
		ok('V7 Clear takes the note line away and the row stays within 2 px, pane at the bottom (' + b2.top.toFixed(1) + ' to ' + cleared.top.toFixed(1) + ')', Math.abs(cleared.top - b2.top) <= 2 && (await noteTexts()).length === 0, JSON.stringify([b2, cleared]));
		await page.evaluate((t) => { const g = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-ovm')).find((x) => x.nextElementSibling && x.nextElementSibling.textContent.indexOf(t) >= 0); g.querySelector('.lpn-ovm-hollow').click(); }, ROW);
		await a.settle(700);
		const set2 = await geom(ROW);
		ok('V7 the hollow dot adds the line back and the row stays within 2 px (' + cleared.top.toFixed(1) + ' to ' + set2.top.toFixed(1) + ')', Math.abs(set2.top - cleared.top) <= 2, JSON.stringify([cleared, set2]));

		console.log('--- V8. the blank a Clear leaves does not pile up ---');
		await open('peak', 1400, 600, (d) => { d.scenarios.find((x) => x.id === 'peak').overrides = {}; }, true);
		await openNode('10');
		const slack = () => page.evaluate(() => { const f = document.getElementById('lpn_popup_fields'), pin = f.style.minHeight; f.style.minHeight = ''; const nat = f.offsetHeight; f.style.minHeight = pin; return { shown: f.offsetHeight, natural: nat }; });
		const dotsNow = () => page.evaluate(() => document.querySelectorAll('#lpn_popup_fields .lpn-ovm-hollow').length);
		const clickFirst = async (cls) => { await page.evaluate((c) => document.querySelector('#lpn_popup_fields .' + c).click(), cls); await a.settle(900); };
		await clickFirst('lpn-ovm-hollow'); await clickFirst('lpn-ovm-hollow'); await clickFirst('lpn-ovm-hollow');
		const mid = await slack();
		await clickFirst('lpn-ovm-dot'); await clickFirst('lpn-ovm-dot'); await clickFirst('lpn-ovm-dot');
		const end = await slack();
		ok('V8 three overrides added then three cleared: the kept blank is at most one line (' + (end.shown - end.natural) + ' px), and the box is no taller than before the first Clear (' + end.shown + ' vs ' + mid.shown + ')', end.shown - end.natural <= 26 && end.shown <= mid.shown, JSON.stringify({ mid, end }));

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
