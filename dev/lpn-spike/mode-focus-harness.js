// A toolbar mode button must not keep a heavy focus ring after Escape sends the tool home.
//
// Tom, 2026-09-27, testing Looped-Network.php: "Vertices mode with the toolbar then Esc leaves a
// heavy border/outline around the vertices button... I see it on all mode buttons now... it
// doesn't evoke for me any previous convention, so I perceive it as clutter or neglect."
//
// **THE CAUSE IS THE KEYSTROKE, NOT ANY NEW CSS.** Clicking a toolbar button focuses it with plain
// mouse focus -- no ring, because #lpn_toolbar button carries no :focus rule of its own and every
// modern browser's default :focus-visible heuristic does not fire for a pointer. Escape is a
// keydown, though, and a keydown that arrives while an element already holds focus is exactly what
// flips that same browser heuristic to visible -- so the default ring appears on whichever button
// was last clicked, on ANY Escape, which matches "I see it on all mode buttons now" exactly. This
// is a REAL headless-Chrome check, not a static-source one, because :focus-visible is a browser
// heuristic no static read of the CSS or JS can evaluate.
//
// THE FIX (js/looped-network.js, the document-level Escape handler that returns the tool to Select,
// Task 589's "Select is the 'home' mode" branch): when that branch fires, blur the toolbar mode
// button if it is the currently focused element. Select has no toolbar button of its own to hold
// focus, so nothing is lost; a reader who genuinely Tabbed to a button and is still moving through
// the toolbar with the keyboard is untouched, because the blur only runs on the way OUT of a tool.
//
// Two things must both be true for this fix to be right rather than a keyboard-accessibility
// regression:
//   1. Click Vertices, press Escape: the button shows NO outline.
//   2. Tab to a toolbar button (never click it): the button DOES show a visible focus indicator.
//      A fix that blurs on every mode change, rather than only on the Escape-home path, would make
//      this assertion fail -- so keeping it here is what would catch that overreach.
//
// Run with:
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/mode-focus-harness.js

const path = require('path');
const fs = require('fs');
const env = require('../browser-pass/lib/env');

const SCREEN_DIR = process.env.MODE_FOCUS_HARNESS_SCREEN_DIR ||
	path.join(require('os').tmpdir(), 'engcalcs-mode-focus-harness');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

function outlineOf(cs) {
	return { style: cs.outlineStyle, width: cs.outlineWidth };
}
function hasNoOutline(o) {
	return o.style === 'none' || parseFloat(o.width) === 0;
}

async function main() {
	fs.mkdirSync(SCREEN_DIR, { recursive: true });
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) {
		console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install');
		process.exit(1);
	}

	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		const page = await context.newPage();
		await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
		await page.waitForSelector('#lpn_toolbar button[data-tool="vertices"]');
		await page.waitForTimeout(300);

		// **A FIRST VISIT OPENS THE EXAMPLES WELCOME BOX, AND IT SITS OVER THE TOOLBAR** (the same
		// trap dev/lpn-spike/browser-customer-grip-probe.js names). Dismissed through its own
		// "start with a blank map" control, not Escape -- an early Escape in this test would be
		// consumed by the welcome box (Task 589's own hint check runs before the tool-exit branch)
		// rather than by the tool this harness means to test.
		for (let i = 0; i < 6; i++) {
			const blank = await page.$('.lpn-examples-blank');
			if (!blank || !(await blank.isVisible())) { break; }
			await blank.click();
			await page.waitForTimeout(200);
		}
		await page.waitForTimeout(200);

		console.log('\n=== mode-focus: Escape must not leave a keyboard-only ring on a mouse-clicked button ===');

		// ---- 1. Click Vertices (mouse), confirm the tool actually turns on -------------------
		await page.click('#lpn_toolbar button[data-tool="vertices"]');
		const pressed = await page.$eval('#lpn_toolbar button[data-tool="vertices"]',
			(el) => el.getAttribute('aria-pressed'));
		ok('clicking Vertices arms it (aria-pressed="true")', pressed === 'true', pressed);

		// A mouse click alone must not show a ring -- the browser's own baseline, asserted so a
		// later browser change or a stray CSS rule that DOES ring a mouse click is caught here
		// rather than blamed on the Escape fix below.
		const afterClick = await page.$eval('#lpn_toolbar button[data-tool="vertices"]',
			(el) => { const cs = getComputedStyle(el); return { style: cs.outlineStyle, width: cs.outlineWidth }; });
		ok('a plain mouse click alone shows no outline', hasNoOutline(afterClick), JSON.stringify(afterClick));

		// ---- 2. Escape: back to Select, and THE BUTTON SHOWS NO OUTLINE ----------------------
		await page.keyboard.press('Escape');
		const modeAfterEsc = await page.$eval('#lpn_toolbar button[data-tool="select"]',
			(el) => el.getAttribute('aria-pressed'));
		ok('Escape returns the tool to Select', modeAfterEsc === 'true', modeAfterEsc);

		const afterEscape = await page.$eval('#lpn_toolbar button[data-tool="vertices"]',
			(el) => { const cs = getComputedStyle(el); return { style: cs.outlineStyle, width: cs.outlineWidth }; });
		ok('Vertices shows NO outline after Escape (the reported defect)',
			hasNoOutline(afterEscape), JSON.stringify(afterEscape));

		const stillFocused = await page.evaluate(
			() => document.activeElement && document.activeElement.dataset && document.activeElement.dataset.tool);
		ok('...and it is not the focused element any more either', !stillFocused, String(stillFocused));

		// ---- 3. The same story for a second mode button, since Tom saw it "on all mode buttons" ----
		await page.click('#lpn_toolbar button[data-tool="add-pipe"]');
		await page.keyboard.press('Escape');
		const pipeAfterEsc = await page.$eval('#lpn_toolbar button[data-tool="add-pipe"]',
			(el) => { const cs = getComputedStyle(el); return { style: cs.outlineStyle, width: cs.outlineWidth }; });
		ok('the Pipe mode button also shows no outline after Escape',
			hasNoOutline(pipeAfterEsc), JSON.stringify(pipeAfterEsc));

		// ---- 4. Keyboard accessibility stays honest: a real Tab still shows a visible ring -------
		console.log('\n-- a reader who actually Tabs to a toolbar button must still see where focus is --');
		// Click empty canvas first so focus starts somewhere ordinary, then walk forward with Tab
		// only -- no click ever lands on a toolbar button in this section.
		await page.click('#lpn_canvas', { position: { x: 20, y: 20 } }).catch(() => {});
		await page.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
		await page.click('#lpn_toolbar button[data-tool="select"]');
		await page.keyboard.press('Escape'); // back to the same no-ring state Vertices was just in
		await page.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
		await page.keyboard.press('Tab');
		const tabbed = await page.evaluate(() => {
			const el = document.activeElement;
			const cs = getComputedStyle(el);
			return { tag: el && el.tagName, id: el && el.id, tool: el && el.dataset && el.dataset.tool,
				style: cs.outlineStyle, width: cs.outlineWidth };
		});
		ok('Tab lands on a real, focusable element', tabbed.tag === 'BUTTON' || tabbed.tag === 'A', JSON.stringify(tabbed));
		ok('...and a genuinely Tab-focused control still shows a visible focus indicator',
			!hasNoOutline(tabbed), JSON.stringify(tabbed));

		const shot = path.join(SCREEN_DIR, 'mode-focus-after-escape.png');
		await page.screenshot({ path: shot });
		console.log('  screenshot: ' + shot);

		await context.close();
	} finally {
		await browser.close();
		env.stopServer();
	}

	console.log(`\n${fails === 0 ? 'ALL GREEN' : fails + ' FAILURE(S)'}`);
	process.exit(fails === 0 ? 0 : 1);
}

main().catch((err) => { console.error(err); env.stopServer(); process.exit(1); });
