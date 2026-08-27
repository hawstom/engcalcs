// icon_png_preview.js -- render an icon from lib/Icons.lib.php to a real PNG, at several sizes.
//
//   node dev/scripts/icon_png_preview.js hydrant
//   node dev/scripts/icon_png_preview.js hydrant water tank      (several at once)
//
// **WHY THIS EXISTS, AND WHY THE ASCII TOOL IS NOT ENOUGH.** `icon_ascii_preview.php` models
// M/L/H/V/C/Z only, so **an arc renders as nonsense there** -- its own docblock says so -- and it
// cannot show a fill, an opacity or a round join. Every icon judgement in this project has been
// made from ASCII, and on 2026-08-26 Tom asked to see a drawing instead: *"I am concerned about
// your description, but I will look at a drawing if you give me one."*
//
// He then could not find the file, because the first render went to a session scratchpad that is
// not in the repository and does not survive. **The output therefore lands in `dev/icon-preview/`,
// which is tracked**, so a rendering can be looked at, compared against the next one, and cited.
//
// Uses the Chromium the browser pass already downloads -- no new dependency, and it is the same
// renderer a visitor's browser is.

const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..', '..');
const BP = path.join(ROOT, 'dev', 'browser-pass');
const env = require(path.join(BP, 'lib', 'env.js'));
const { chromium } = require(path.join(BP, 'node_modules', 'playwright-core'));
const { execFileSync } = require('child_process');

const names = process.argv.slice(2).filter(a => !a.startsWith('-'));
if (!names.length) {
	console.error('usage: node dev/scripts/icon_png_preview.js <icon-name> [more…]');
	process.exit(2);
}
const SIZES = [17, 24, 48, 96, 192];

// The geometry comes from the ONE place it lives. Never re-typed here: CLAUDE.md's rule is that a
// path redrawn outside lib/Icons.lib.php is a second icon pretending to be the first.
function geometry(name) {
	const php = 'require "' + path.join(ROOT, 'lib', 'Icons.lib.php') + '";' +
		'if (!isset($ec_icons[' + JSON.stringify(name) + '])) { fwrite(STDERR, "no such icon"); exit(3); }' +
		'echo $ec_icons[' + JSON.stringify(name) + '];';
	return execFileSync('php', ['-r', php], { encoding: 'utf8' });
}

(async () => {
	const outDir = path.join(ROOT, 'dev', 'icon-preview');
	fs.mkdirSync(outDir, { recursive: true });
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		for (const name of names) {
			const g = geometry(name);
			const cells = SIZES.map(px =>
				'<div style="text-align:center">' +
				`<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="#111" ` +
				'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + g + '</svg>' +
				`<div style="margin-top:8px;color:#666;font:12px sans-serif">${px}px</div></div>`).join('');
			const html = '<html><body style="margin:0;background:#fff;display:inline-flex;gap:30px;' +
				'align-items:flex-end;padding:26px">' + cells + '</body></html>';
			const file = path.join(outDir, name + '.html');
			fs.writeFileSync(file, html);
			// deviceScaleFactor 2 so the 17px cell is legible on screen without being upscaled --
			// what is being judged is the SHAPE at that size, not the pixel grid, which is what
			// the ASCII tool is for.
			const page = await browser.newPage({ deviceScaleFactor: 2 });
			await page.goto('file://' + file, { waitUntil: 'load' });
			await page.waitForTimeout(200);
			await (await page.$('body')).screenshot({ path: path.join(outDir, name + '.png') });
			await page.close();
			fs.unlinkSync(file);
			console.log('dev/icon-preview/' + name + '.png');
		}
	} finally { await browser.close(); }
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
