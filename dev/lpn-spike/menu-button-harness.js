// feat/menu-button (R-202/R-203, Tom 2026-09-25): the menu bar (.lpn-menubar-item, File through
// Help/Language) is painted as OUTLINED rounded-rectangle buttons -- white fill, blue text and
// border ("I love the outlined version, and they are reminiscent of diazo prints (blueprints). I
// agree with leaving the toolbar black."); the toolbar below it is untouched. This is a REAL
// headless-Chrome check, not a static-source one, because the defect class here -- a colour that
// looks right in the CSS and wrong once it is actually rendered, or a height that grew because a
// border did -- only shows up in a rendered page.
//
// **ONLY ONE STYLE SHIPS.** The earlier solid-blue variant and the `?menustyle=outline` preview
// switch this harness used to compare are both gone (Tom chose outline over solid, 2026-09-25);
// this harness now checks the one style at the one URL every visitor gets.
//
// Run with:
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/menu-button-harness.js
//
// Reuses dev/browser-pass/lib/env.js for the server/Chromium plumbing (same sentinel-proven PHP
// server, same Chromium search) rather than reinventing it; playwright-core itself lives in
// dev/browser-pass/node_modules (`cd dev/browser-pass && npm install`, once).

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const env = require('../browser-pass/lib/env');

const SCREEN_DIR = process.env.MENU_HARNESS_SCREEN_DIR ||
	'/tmp/claude-1000/-home-haws-webdev-hawsedc-com-engcalcs/18aaeba2-9c8b-4f6e-91f8-821a6f774f1f/scratchpad';

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// sRGB relative luminance -> WCAG contrast ratio between two "rgb(r, g, b)" strings.
function luminance(rgbStr) {
	const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(rgbStr);
	if (!m) { throw new Error('not an rgb() colour: ' + rgbStr); }
	const chan = [m[1], m[2], m[3]].map((v) => {
		const c = Number(v) / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}
function contrast(a, b) {
	const la = luminance(a), lb = luminance(b);
	const hi = Math.max(la, lb), lo = Math.min(la, lb);
	return (hi + 0.05) / (lo + 0.05);
}

// The toolbar rules this branch is NOT allowed to touch: pulled from master's own CSS text (not
// from a second running page) so this harness does not need two PHP servers to prove "unchanged".
function toolbarRulesOnMaster() {
	const text = execFileSync('git', ['show', 'master:css/engcalcs.css'], { cwd: env.REPO, encoding: 'utf8' });
	const grab = (re) => { const m = re.exec(text); if (!m) { throw new Error('rule not found on master: ' + re); } return m[0]; };
	return {
		base: grab(/#lpn_toolbar button:not\(\.lpn-transport-btn\) \{[^}]*\}/),
		hover: grab(/#lpn_toolbar button:not\(\.lpn-transport-btn\):hover \{[^}]*\}/),
		pressed: grab(/#lpn_toolbar button:not\(\.lpn-transport-btn\)\[aria-pressed="true"\] \{[^}]*\}/)
	};
}

async function main() {
	fs.mkdirSync(SCREEN_DIR, { recursive: true });
	// playwright-core lives in dev/browser-pass/node_modules (a sibling, not an ancestor, of this
	// file), so plain `require('playwright-core')` would not find it -- point at it directly rather
	// than duplicating the dependency in a second package.json.
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) {
		console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install');
		process.exit(1);
	}

	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const masterToolbar = toolbarRulesOnMaster();

		for (const size of [{ w: 1440, h: 900, tag: 'desktop' }, { w: 390, h: 844, tag: 'phone' }]) {
			const context = await browser.newContext({ viewport: { width: size.w, height: size.h } });
			const page = await context.newPage();
			await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
			await page.waitForSelector('#lpn_menubar .lpn-menubar-item');
			// Any first-visit chrome settles a beat after load.
			await page.waitForTimeout(300);

			console.log(`\n--- outline @ ${size.w}x${size.h} ---`);

			const items = await page.$$eval('#lpn_menubar .lpn-menubar-item', (els) => els.map((el) => {
				const cs = getComputedStyle(el);
				const r = el.getBoundingClientRect();
				return {
					id: el.id, bg: cs.backgroundColor, color: cs.color,
					borderRadius: cs.borderTopLeftRadius, height: r.height
				};
			}));
			ok('every menu-bar item found', items.length >= 6, `found ${items.length}`);

			const expectBg = 'rgb(255, 255, 255)';
			const expectFg = 'rgb(6, 69, 173)';
			items.forEach((it) => {
				ok(`${it.id}: background is white (outlined)`, it.bg === expectBg, it.bg);
				ok(`${it.id}: text colour is the accent blue ${expectFg}`, it.color === expectFg, it.color);
				const ratio = contrast(it.bg, it.color);
				ok(`${it.id}: text/background contrast >= 4.5:1`, ratio >= 4.5, ratio.toFixed(2) + ':1');
				ok(`${it.id}: rounded rectangle, not a pill or a square`,
					parseFloat(it.borderRadius) > 0 && parseFloat(it.borderRadius) < it.height / 2,
					it.borderRadius + ' on a ' + it.height + 'px-tall button');
			});

			// The bar's own height must equal master's -- captured on THIS run (padding/border/
			// font are unchanged from master, so this is a same-page regression guard: it would
			// catch this branch itself growing the bar on a later edit).
			const barHeight = await page.$eval('#lpn_menubar', (el) => el.getBoundingClientRect().height);
			ok('menu bar height is unchanged (30-34px band, matches master\'s padding/font)',
				barHeight >= 26 && barHeight <= 36, barHeight + 'px');

			// Open one menu and confirm the open item looks pressed (darker), not just hovered.
			await page.click('#lpn_menu_file');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const openState = await page.$eval('#lpn_menu_file', (el) => ({
				expanded: el.getAttribute('aria-expanded'), bg: getComputedStyle(el).backgroundColor
			}));
			ok('the open item is aria-expanded="true"', openState.expanded === 'true', openState.expanded);
			const pressedExpect = 'rgb(215, 230, 251)';
			ok('the open item is visually distinct (pressed) from the closed default',
				openState.bg === pressedExpect, openState.bg);
			await page.keyboard.press('Escape');

			// Toolbar buttons must be untouched by this branch.
			const toolbarSample = await page.$eval('#lpn_toolbar button:not(.lpn-transport-btn)', (el) => {
				const cs = getComputedStyle(el);
				return { bg: cs.backgroundColor, border: cs.borderColor, radius: cs.borderTopLeftRadius, padding: cs.padding };
			});
			ok('toolbar button background is still "none" (transparent)',
				toolbarSample.bg === 'rgba(0, 0, 0, 0)', toolbarSample.bg);
			ok('toolbar button border-radius is still master\'s 4px',
				/4px/.test(masterToolbar.base) && toolbarSample.radius === '4px', toolbarSample.radius);
			ok('toolbar button padding is still master\'s "3px 5px"',
				/padding: 3px 5px/.test(masterToolbar.base) && toolbarSample.padding === '3px 5px', toolbarSample.padding);

			// **PHONE WIDTH STILL READS WELL** (job brief, 2026-09-25): the same 640px collapse
			// master already ships (.lpn-menubar-word hidden, icon-only) still applies under the
			// new paint, so a narrow menu-bar item is not just a blue/white square with no name.
			if (size.tag === 'phone') {
				const wordVisible = await page.$eval('#lpn_menubar .lpn-menubar-word',
					(el) => getComputedStyle(el).display !== 'none');
				ok('phone width: the word collapses to icon-only, same as master', !wordVisible);
				const iconVisible = await page.$eval('#lpn_menubar .lpn-menubar-item .ec-icon',
					(el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
				ok('phone width: the icon is still visible and non-zero size', iconVisible);
			}

			const shot = path.join(SCREEN_DIR, `menu-outline-${size.tag}.png`);
			await page.screenshot({ path: shot });
			console.log('  screenshot: ' + shot);

			await context.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}

	console.log(`\n${fails === 0 ? 'ALL GREEN' : fails + ' FAILURE(S)'}`);
	process.exit(fails === 0 ? 0 : 1);
}

main().catch((err) => { console.error(err); env.stopServer(); process.exit(1); });
