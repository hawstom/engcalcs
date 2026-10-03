// THE CHROME'S COLOURS COME FROM THE TOKENS, NOT FROM LITERALS. Run with:
//   node dev/lpn-spike/chrome-tokens-harness.js
//
// Task 714, Phase 1 (dev/theming-plan.md). A later dark token set is only "write the dark values
// once" if no piece of chrome kept its own literal. chrome_colour_check.php refuses a literal in the
// stylesheet; this proves the other half in a real browser, where a rule can lose a cascade fight or
// be overridden by an inline style the stylesheet never sees. For each key piece of chrome it asserts:
//   1. its computed colour EQUALS the token's value (so the rewrite changed nothing); and
//   2. with EVERY --ec-* token set to one sentinel colour, the same property turns into the sentinel
//      (so the property is wired to the token, and a dark set cannot silently miss it).
//
// A piece of chrome that is not in the list below is not covered. Add a row when you tokenise a new
// surface, in the same commit.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CHROME_TOKENS_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('chrome-tokens-harness: NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

// [selector, computed property, token]
const ROWS = [
	['#lpn_menu_help', 'color', 'ec-accent'],
	['#lpn_menu_help', 'border-top-color', 'ec-accent'],
	['#lpn_menu_help', 'background-color', 'ec-bg'],
	['#lpn_menu_file', 'color', 'ec-accent-open'],
	['#lpn_menu_file', 'border-top-color', 'ec-accent-open'],
	['#lpn_menu_file', 'background-color', 'ec-accent-open-bg'],
	['#lpn_toolbar', 'border-bottom-color', 'ec-gray-d6d6d6'],
	['#lpn_tabs', 'border-bottom-color', 'ec-gray-999'],
	['#lpn_tabs .lpn-tab', 'background-color', 'ec-gray-ececec'],
	['#lpn_tabs .lpn-tab', 'border-top-color', 'ec-gray-999'],
	['#lpn_tabs .lpn-tab-current', 'background-color', 'ec-bg'],
	['.lpn-pane', 'background-color', 'ec-bg'],
	['.lpn-pane', 'border-top-color', 'ec-border-strong'],
	['.lpn-pane-grip', 'background-color', 'ec-gray-f2f2f2'],
	['.lpn-pane-grip', 'border-bottom-color', 'ec-gray-e0e0e0'],
	['.lpn-pane-head', 'border-bottom-color', 'ec-border'],
	['.lpn-pane-tab:not([aria-selected="true"])', 'background-color', 'ec-gray-f0f0f0'],
	['#lpn_settings_box', 'background-color', 'ec-bg'],
	['.lpn-findbox', 'background-color', 'ec-bg'],
	['#lpn_map_notice', 'background-color', 'ec-warn-bg'],
	['#lpn_map_notice', 'border-top-color', 'ec-warn-border'],
	['#lpn_status', 'background-color', 'ec-warn-bg'],
	['#lpn_status', 'border-top-color', 'ec-warn-border'],
	['#lpn_lock_banner', 'background-color', 'ec-warn-bg'],
	['#lpn_lock_banner', 'border-top-color', 'ec-warn-border'],
	['#lpn_mode_hint', 'background-color', 'ec-map-overlay-bg'],
	['#lpn_menu_popup', 'background-color', 'ec-bg'],
	['.ec-consent', 'background-color', 'ec-bg'],
	['.ec-consent', 'border-top-color', 'ec-brand'],
	['.ec-consent-btn', 'background-color', 'ec-brand']
];

let fails = 0, checks = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (!cond && detail ? '   ' + detail : ''));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('chrome-tokens-harness: no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		// Open what the rows name: the bottom pane, Settings, Find, a menu.
		await a.menuClick(await a.lang('lpn_tables_menu'), 'project');
		await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
		await a.menuClick(await a.lang('lpn_find_menu'), 'edit');
		await a.page.click('#lpn_menu_file');
		await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await a.settle(300);

		const res = await a.page.evaluate((rows) => {
			const SENT = 'rgb(1, 2, 3)';
			const probe = document.createElement('i');
			document.body.appendChild(probe);
			const resolve = (tok) => {
				probe.style.backgroundColor = '';
				probe.style.backgroundColor = 'var(--' + tok + ')';
				return getComputedStyle(probe).backgroundColor;
			};
			const read = () => rows.map(([sel, prop]) => {
				const el = document.querySelector(sel);
				return el ? getComputedStyle(el).getPropertyValue(prop) : null;
			});
			const declared = [];
			for (const sheet of document.styleSheets) {
				let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
				for (const r of rules) {
					if (r.selectorText === ':root') {
						for (let i = 0; i < r.style.length; i++) { if (/^--ec-/.test(r.style[i])) { declared.push(r.style[i]); } }
					}
				}
			}
			const want = rows.map(([, , tok]) => resolve(tok));
			const before = read();
			declared.forEach((n) => document.documentElement.style.setProperty(n, SENT));
			const after = read();
			declared.forEach((n) => document.documentElement.style.removeProperty(n));
			return { want, before, after, SENT, declared: declared.length };
		}, ROWS);

		ok('the token block declares tokens (' + res.declared + ')', res.declared > 80);
		ROWS.forEach(([sel, prop, tok], i) => {
			const lbl = sel + ' ' + prop + ' <- --' + tok;
			ok(lbl + ' equals the token', res.before[i] !== null && res.before[i] === res.want[i], 'got ' + res.before[i] + ', token is ' + res.want[i]);
			ok(lbl + ' follows the token', res.after[i] === res.SENT, 'with every token set to ' + res.SENT + ' it is ' + res.after[i]);
		});
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
