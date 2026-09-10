// One-off measurement script for the interface-designer's chrome audit.
// Not part of the check_all.sh punch list; reuses dev/browser-pass/lib/env.js only to get a
// server + browser onto the real page. Screenshots and JSON go to dev/chrome-audit/render/.
//
// Usage: node measure.js
const path = require('path');
const fs = require('fs');
const playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core'));
const env = require(path.join(__dirname, '..', 'browser-pass', 'lib', 'env.js'));

const OUT = path.join(__dirname, 'render');
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
	{ name: '1919x1002', width: 1919, height: 1002 },  // Tom's supplied screenshot's actual window
	{ name: '1920x1080', width: 1920, height: 1080 },
	{ name: '1440x900', width: 1440, height: 900 },
	{ name: '1366x768', width: 1366, height: 768 },
];

// Chrome-row selectors on the lpn_ page, top to bottom as the markup emits them.
const LPN_ROWS = [
	{ key: 'navbar', sel: 'nav.navbar' },
	{ key: 'page_title', sel: '#ec-page-title' },
	{ key: 'page_welcome', sel: '#ec-page-welcome' },
	{ key: 'page_desc', sel: '#ec-page-desc' },
	{ key: 'menubar', sel: '#lpn_menubar' },
	{ key: 'toolbar', sel: '#lpn_toolbar' },
	{ key: 'tabs', sel: '#lpn_tabs' },
	{ key: 'canvas', sel: '#lpn_canvas' },
];

async function measureRows(page, rows) {
	return page.evaluate((rows) => {
		const out = [];
		for (const r of rows) {
			const el = document.querySelector(r.sel);
			if (!el) { out.push(Object.assign({}, r, { present: false })); continue; }
			const rect = el.getBoundingClientRect();
			const cs = getComputedStyle(el);
			out.push(Object.assign({}, r, {
				present: true,
				display: cs.display,
				visible: cs.display !== 'none' && rect.height > 0,
				top: rect.top, bottom: rect.bottom, height: rect.height,
				text: (el.textContent || '').trim().slice(0, 80)
			}));
		}
		return out;
	}, rows);
}

async function auditLpn(playwrightMod, host) {
	const results = {};
	for (const vp of VIEWPORTS) {
		for (const titlesShown of [true, false]) {
			const browser = await env.launchBrowser(playwrightMod);
			const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
			const page = await context.newPage();
			if (!titlesShown) {
				// Set the existing per-browser furniture key BEFORE the page's own script reads it,
				// exactly as a returning visitor who has already thrown the switch would arrive.
				await context.addInitScript(() => { try { localStorage.setItem('lpn_show_titles', '0'); } catch (e) {} });
			}
			await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
			await page.waitForTimeout(700);
			await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r())));
			// Dismiss the examples gallery if present, same as browser-pass sessions do, so the map
			// itself (not the gallery card wall) is what we are measuring underneath the chrome.
			try {
				const showing = await page.$eval('#lpn_empty_hint', (e) => e.style.display !== 'none');
				if (showing) {
					const btn = await page.$('#lpn_examples_pane button.lpn-examples-blank');
					if (btn) { await btn.click(); await page.waitForTimeout(300); }
				}
			} catch (e) { /* fine */ }

			const rows = await measureRows(page, LPN_ROWS);
			const consent = await page.evaluate(() => {
				const el = document.getElementById('ec-consent');
				if (!el) return null;
				const cs = getComputedStyle(el);
				if (cs.display === 'none') return null;
				const r = el.getBoundingClientRect();
				return { top: r.top, bottom: r.bottom, height: r.height, position: cs.position };
			});
			const key = vp.name + (titlesShown ? '' : '-titleshidden');
			const shotPath = path.join(OUT, `lpn-${key}.png`);
			await page.screenshot({ path: shotPath });
			results[key] = { viewport: vp, titlesShown, rows, consent, screenshot: shotPath };
			await context.close();
			await browser.close();
		}
	}
	return results;
}

async function auditLanding(playwrightMod) {
	const results = {};
	const filePath = 'file://' + path.join(process.env.HOME, 'webdev', 'librewaternet.org', 'index.html');
	for (const vp of VIEWPORTS) {
		const browser = await env.launchBrowser(playwrightMod, { secureContext: false });
		const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
		const page = await context.newPage();
		await page.goto(filePath, { waitUntil: 'load' });
		await page.waitForTimeout(300);

		// Generic top-of-fold measurement: find the elements that sit above the viewport fold,
		// and specifically locate the first CTA/download-shaped link and the hero heading.
		const data = await page.evaluate((vh) => {
			function rectOf(sel) {
				const el = document.querySelector(sel);
				if (!el) return null;
				const r = el.getBoundingClientRect();
				const cs = getComputedStyle(el);
				return { present: true, visible: cs.display !== 'none' && r.height > 0,
					top: r.top, bottom: r.bottom, height: r.height, text: (el.textContent || '').trim().slice(0, 100) };
			}
			// Walk the top-level visible block children of body/header/main to itemize the stack.
			const stackSels = ['header', 'nav', '.hero', '#hero', 'main > *', 'body > *'];
			const seen = new Set();
			const stack = [];
			document.querySelectorAll('body > *').forEach((el) => {
				const cs = getComputedStyle(el);
				if (cs.display === 'none') return;
				const r = el.getBoundingClientRect();
				if (r.height <= 0) return;
				stack.push({ tag: el.tagName.toLowerCase(), id: el.id || null, cls: (el.className || '').toString().slice(0,60),
					top: r.top, bottom: r.bottom, height: r.height, text: (el.textContent||'').trim().slice(0,80) });
			});
			// Find likely CTA / download links and the first heading.
			const links = Array.from(document.querySelectorAll('a')).map((a) => {
				const r = a.getBoundingClientRect();
				return { text: (a.textContent||'').trim(), href: a.getAttribute('href'), top: r.top, bottom: r.bottom, visible: r.height > 0 && r.top < vh };
			}).filter(x => x.visible && x.text);
			const h1 = rectOf('h1');
			const h2 = rectOf('h2');
			return { stack, links, h1, h2 };
		}, vp.height);

		const shotPath = path.join(OUT, `landing-${vp.name}.png`);
		await page.screenshot({ path: shotPath });
		results[vp.name] = { viewport: vp, data, screenshot: shotPath };
		await context.close();
		await browser.close();
	}
	return results;
}

(async () => {
	await env.startServer();
	try {
		console.log('Auditing Looped-Network.php ...');
		const lpn = await auditLpn(playwright);
		console.log('Auditing librewaternet.org/index.html ...');
		const landing = await auditLanding(playwright);
		fs.writeFileSync(path.join(OUT, 'measurements.json'), JSON.stringify({ lpn, landing }, null, 2));
		console.log('Wrote', path.join(OUT, 'measurements.json'));
	} finally {
		env.stopServer();
	}
})().catch((err) => { console.error(err); process.exitCode = 1; });
