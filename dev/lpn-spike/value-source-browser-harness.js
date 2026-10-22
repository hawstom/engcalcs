// WHERE-FROM ON EVERY VALUE: Properties names the source of an inherited value. Real Chromium, Net1.
//   node dev/lpn-spike/value-source-browser-harness.js   (takes the browser lock itself)
// Sue's wish (2026-10-05, item 1): "Where-from on every value (inherited from Base / local here)."
// Base > Peak > Fire. Peak states junction 10's elevation and demand; Fire states its elevation.
//   V1  Fire open: elevation wears the solid dot ("Override in Fire."); demand is hollow and its tip
//       says "Inherited from Peak"; every other overridable row is hollow and says "Inherited from Base".
//   V2  every marker's source equals an independent walk of the stored project (Fire, Peak, Base).
//   V3  the solid dot's click is the reset: elevation turns hollow and now says "Inherited from Peak".
//   V4  Base shows no dot and no hollow dot.
//   V5  a phone-width page keeps the marker on screen and the box without sideways scroll.
// THE FILLED DOT'S TIP (Tom, 2026-10-22), scenarios built through the real menus (scenario-ui-helper.js):
//   V6  Basic mode: "Click to clear override and restore 710, the value in Base." and nothing about an
//       alternative; no note line (.lpn-ov-note) under any row.
//   V7  Basic mode off, an alternative nobody else names: the second sentence, on its own line.
//   V8  Basic mode off, another scenario names the same alternative: the sentence lists it.
//   V9  a child whose parent is not Base: names the parent and the parent's value.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_VALSRC_LOCKED';
const NAME = 'value-source-browser-harness';
const U = require('./scenario-ui-helper.js');
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
		const open = async (active, w, h) => {
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
			d.scenarios.push({ id: 'peak', name: 'Peak', overrides: { 'n:10': { elev: 701, demand: 150 } } },
				{ id: 'fire', name: 'Fire', parent: 'peak', overrides: { 'n:10': { elev: 702 } } });
			d.project = Object.assign({}, d.project, { activeScenario: active });
			if (a) { await a.context.close(); }
			a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
			page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await page.evaluate(([txt]) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, [JSON.stringify(d)]);
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
		ok('V1 Fire: elevation is the one solid dot, and its tip restores Peak\'s 701', dots.length === 1 && dots[0].tip === (await a.lang('lpn_ovm_dot_clear_to')).replace('{value}', '701').replace('{parent}', 'Peak'), JSON.stringify(dots));
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

		console.log('--- V6-V9. the filled dot\'s tip, scenarios built through the menus ---');
		{
			const ctx = await U.openNet1(browser, NAME + '-tip');
			const P = ctx.P;
			const dotTip = () => P.evaluate(() => {
				const d = document.querySelector('#lpn_popup_fields .lpn-ovm-dot');
				return d ? { tip: d.getAttribute('aria-label'), lines: !!d.dataset.ecTipLines, notes: document.querySelectorAll('#lpn_popup_fields .lpn-ov-note, #lpn_popup_fields .lpn-ov-base').length } : null;
			});
			const reopen = async () => {
				await P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
				await ctx.a.settle(300);
				await U.openProperties(ctx, 'node', '10');
			};
			const ELEV = await U.lang(ctx, 'lpn_field_elev');
			const BASEN = await U.lang(ctx, 'lpn_scenario_base');
			const first = (k, vals) => k.replace('{value}', vals.v).replace('{parent}', vals.p);
			const CLEAR = await U.lang(ctx, 'lpn_ovm_dot_clear_to'), ALT = await U.lang(ctx, 'lpn_ovm_dot_alt'), ALTS = await U.lang(ctx, 'lpn_ovm_dot_alt_shared');
			const baseElev = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8')).nodes.find((n) => n.id === '10').elev;
			const s1 = await U.createScenarioViaMenu(ctx);
			await U.openProperties(ctx, 'node', '10');
			await U.typeProperty(ctx, ELEV, '730');
			let t = await dotTip();
			ok('V6 Basic mode: the tip says what Clear restores and from where, and nothing else', !!t && t.tip === first(CLEAR, { v: String(baseElev), p: BASEN }), JSON.stringify(t));
			ok('V6 ...no note line is drawn under any row', !!t && t.notes === 0, JSON.stringify(t));
			ok('V6 ...and the tip keeps line breaks for the second sentence', !!t && t.lines);

			await U.setBasicMode(ctx, false);
			await reopen();
			const doc1 = await U.storedProject(ctx);
			const sc1 = doc1.scenarios.find((x) => x.id === s1.scenario.id);
			const alt1 = doc1.alternatives.find((x) => x.id === sc1.alternatives.physical);
			t = await dotTip();
			ok('V7 Basic mode off, nobody else names the alternative: the sentence without a list, on its own line',
				!!t && t.tip === first(CLEAR, { v: String(baseElev), p: BASEN }) + '\n' + ALT.replace('{alternative}', alt1.name), JSON.stringify(t));
			ok('V7 ...still no note line', !!t && t.notes === 0);

			// Another scenario names the same alternative (the Share edits setup), then the project is read back.
			await P.evaluate(([altId]) => {
				const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId, k = 'lpn_project_' + i, d = JSON.parse(localStorage.getItem(k));
				d.scenarios.push({ id: 'sharer', name: 'Shares it', overrides: {}, alternatives: { physical: altId } });
				localStorage.setItem(k, JSON.stringify(d));
			}, [alt1.id]);
			await ctx.a.reload();
			await ctx.a.settle(2500);
			await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await U.openProperties(ctx, 'node', '10');
			t = await dotTip();
			ok('V8 Basic mode off, another scenario names the alternative: Tom\'s sentence with the list',
				!!t && t.tip === first(CLEAR, { v: String(baseElev), p: BASEN }) + '\n' + ALTS.replace('{alternative}', alt1.name).replace('{list}', 'Shares it'), JSON.stringify(t));

			// A child of the scenario that holds the override: its own override restores the parent's value.
			// (New scenario makes a child of Base; the parent is then pointed at the first scenario.)
			const s2 = await U.createScenarioViaMenu(ctx);
			await P.evaluate(([sid, pid]) => {
				const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId, k = 'lpn_project_' + i, d = JSON.parse(localStorage.getItem(k));
				d.scenarios.find((x) => x.id === sid).parent = pid;
				localStorage.setItem(k, JSON.stringify(d));
			}, [s2.scenario.id, sc1.id]);
			await ctx.a.reload();
			await ctx.a.settle(2500);
			await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await U.openProperties(ctx, 'node', '10');
			await U.typeProperty(ctx, ELEV, '745');
			t = await dotTip();
			ok('V9 a child of a scenario: names that scenario and its value (730), not Base\'s', !!t && t.tip.split('\n')[0] === first(CLEAR, { v: '730', p: sc1.name }), JSON.stringify(t));
			ok('V9 ...and no note line', !!t && t.notes === 0);
			ok('V6-V9 no page error', ctx.a.errors.length === 0, ctx.a.errors.slice(0, 2).join(' | '));
			await ctx.a.close();
		}

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
