// Did the input form MOVE? -- a real-browser A/B of every calculator's field area.
//
// WHY THIS EXISTS. ROADMAP Task 478 replaced the <table> that built each calculator's input lines
// with a CSS grid whose DOM is column-major, so that Tab walks the input column instead of crossing
// each line sideways. The whole risk of that change is that it is invisible to every other check in
// the suite: `focus_order_check.php` can prove the tab order is right and `html_balance_check.php`
// can prove the markup closes, and neither can see that a control is four pixels to the left or
// that a blue rule broke into four pieces. Reading the markup cannot answer it either. A browser
// can, so this asks one.
//
// WHAT IT DOES. It serves the repo TWICE -- once from `git archive <ref>` and once from the working
// tree -- opens every calculator page in both, and compares the position and size of every control
// in the form, measured from the form's own top-left corner. Same numbers, same layout.
//
//   cd dev/browser-pass
//   npm install                       # once
//   node fieldgrid-layout.js          # working tree vs HEAD
//   node fieldgrid-layout.js --ref=HEAD~1 --lang=ar     # ... and the RTL mirror
//
// A `--` line is a page one side could not render; it is never counted as a pass.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const arg = (name, fallback) => {
	const hit = args.find(a => a.startsWith('--' + name + '='));
	return hit ? hit.slice(name.length + 3) : fallback;
};
const REF = arg('ref', 'HEAD');
// One language, or a comma-separated sweep. The sweep is the point: a unit select is as wide as
// its widest option, and how wide THAT is depends entirely on the language.
const LANGS = arg('langs', arg('lang', '')).split(',');
// A control that lands within this of where it was is the same control in the same place. Half a
// pixel is sub-device-pixel at any zoom; anything a person could see is far larger.
const TOL = parseFloat(arg('tol', '0.5'));
// A viewport, because a table's auto layout shrinks its columns when the page is narrow and the
// grid's auto tracks have to shrink the same way; the wide default never exercises that.
const WIDTH = parseInt(arg('width', '1400'), 10);
const SHOW = parseInt(arg('show', '6'), 10);

/** The page list is DERIVED, exactly as focus_order_check.php derives it -- never typed. */
function calculatorPages() {
	return fs.readdirSync(ROOT)
		.filter(f => f.endsWith('.php'))
		.filter(f => {
			const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
			return src.includes('echoCalculatorForm');
		})
		.sort();
}

/**
 * A document root with the suite at `/engcalcs/`, because every asset in the pages is anchored
 * there ("the suite only works when its URL path is /engcalcs/", ROADMAP Task 487). The BEFORE
 * side is a `git archive` export so nothing in the working tree is touched, disturbed or stashed.
 */
function makeRoots(tmp) {
	const beforeRoot = path.join(tmp, 'before');
	const afterRoot = path.join(tmp, 'after');
	fs.mkdirSync(path.join(beforeRoot, 'engcalcs'), { recursive: true });
	fs.mkdirSync(afterRoot, { recursive: true });
	execFileSync('sh', ['-c',
		`git -C ${JSON.stringify(ROOT)} archive ${JSON.stringify(REF)} | tar -x -C ${JSON.stringify(path.join(beforeRoot, 'engcalcs'))}`
	], { stdio: ['ignore', 'ignore', 'inherit'] });
	fs.symlinkSync(ROOT, path.join(afterRoot, 'engcalcs'));
	return { beforeRoot, afterRoot };
}

function serve(docRoot, port) {
	const child = spawn('php', ['-S', '127.0.0.1:' + port, '-t', docRoot], {
		stdio: ['ignore', 'ignore', 'ignore'], cwd: docRoot
	});
	return child;
}

async function waitForServer(page, url, tries = 40) {
	for (let i = 0; i < tries; i++) {
		try {
			const r = await page.goto(url, { waitUntil: 'domcontentloaded' });
			if (r && r.status() < 500) { return true; }
		} catch (e) { /* not up yet */ }
		await page.waitForTimeout(250);
	}
	return false;
}

/**
 * Every control in the input form, keyed by something STABLE across the change, with its box
 * measured from the form's own origin.
 *
 * The key cannot be a DOM path -- the whole point of Task 478 is that the DOM path changed. It is
 * the control's `name` for an input or a select, and for the per-line "X" it is the line id that
 * link controls, which is the one thing about it that did not move.
 */
const MEASURE = () => {
	const form = document.getElementById('formInput');
	if (!form) { return null; }
	const o = form.getBoundingClientRect();
	const box = el => {
		const r = el.getBoundingClientRect();
		return [
			Math.round((r.left - o.left) * 100) / 100,
			Math.round((r.top - o.top) * 100) / 100,
			Math.round(r.width * 100) / 100,
			Math.round(r.height * 100) / 100
		];
	};
	const out = {};
	form.querySelectorAll('input, select, textarea, button').forEach(el => {
		if (el.type === 'hidden' || !el.name && !el.id) { return; }
		out['ctl:' + (el.name || el.id)] = box(el);
	});
	form.querySelectorAll('a[data-bs-toggle="collapse"]').forEach(el => {
		// href, not aria-controls: the "X" now controls four cells and names all four, but its
		// href still points at the one line id, which is what did not change.
		const target = (el.getAttribute('href') || el.getAttribute('aria-controls') || '').split(/\s+/)[0].replace(/^#/, '');
		if (target) { out['x:' + target] = box(el); }
	});
	// The two panels themselves: if the Inputs block or the Results block changed width or moved,
	// every individual control could still match and the PAGE would still look different.
	const grid = form.querySelector('.ec-fieldgrid') || form.querySelector('table.bare td > table');
	if (grid) { out['panel:inputs'] = box(grid); }
	const bare = form.querySelector('table.bare');
	if (bare) { out['panel:form'] = box(bare); }
	return out;
};

(async () => {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fieldgrid-'));
	const { beforeRoot, afterRoot } = makeRoots(tmp);
	const servers = [serve(beforeRoot, 8731), serve(afterRoot, 8732)];
	const browser = await chromium.launch();
	let failures = 0, unanswered = 0, passes = 0;

	try {
		const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 1000 } });
		const page = await ctx.newPage();

		if (!await waitForServer(page, 'http://127.0.0.1:8731/engcalcs/index.php')
			|| !await waitForServer(page, 'http://127.0.0.1:8732/engcalcs/index.php')) {
			console.log('--  neither side could be served; nothing was measured');
			process.exit(1);
		}

		console.log(`comparing the working tree against ${REF}, language(s) `
			+ `${LANGS.map(l => l || 'default').join(' ')}, viewport ${WIDTH}px, tolerance ${TOL}px\n`);

		for (const lang of LANGS) {
			const q = lang ? '?lang=' + lang : '';
			const tag = lang ? `[${lang}] ` : '';
			for (const name of calculatorPages()) {
				const seen = [];
				for (const port of [8731, 8732]) {
					await page.goto(`http://127.0.0.1:${port}/engcalcs/${name}${q}`, { waitUntil: 'load' });
					// Half a second, not a tick: the page calculates on load and writes its results,
					// and a select measured before the language's own font has settled reports an
					// intrinsic width ~15px short. That produced a "moved" line that wandered from
					// page to page between runs -- measurement noise, not layout.
					await page.waitForTimeout(500);
					seen.push(await page.evaluate(MEASURE));
				}
				const [before, after] = seen;
				if (!before || !after) {
					console.log(`--  ${tag}${name}: no #formInput on ${!before ? 'the ' + REF : 'the working-tree'} side`);
					unanswered++;
					continue;
				}
				const diffs = [];
				for (const key of Object.keys(before)) {
					if (!(key in after)) { diffs.push(`${key} is gone`); continue; }
					const a = before[key], b = after[key];
					const worst = Math.max(...a.map((v, i) => Math.abs(v - b[i])));
					if (worst > TOL) {
						diffs.push(`${key} moved ${worst.toFixed(2)}px  [${a.join(', ')}] -> [${b.join(', ')}]`);
					}
				}
				for (const key of Object.keys(after)) {
					if (!(key in before)) { diffs.push(`${key} is new`); }
				}
				if (diffs.length) {
					failures++;
					console.log(`FAIL  ${tag}${name}: ${diffs.length} of ${Object.keys(before).length} controls moved`);
					diffs.slice(0, SHOW).forEach(d => console.log(`        ${d}`));
					if (diffs.length > SHOW) { console.log(`        ... and ${diffs.length - SHOW} more`); }
				} else {
					passes++;
					console.log(`ok    ${tag}${name}: ${Object.keys(before).length} controls, none moved`);
				}
			}
		}
	} finally {
		await browser.close();
		servers.forEach(s => s.kill());
		fs.rmSync(tmp, { recursive: true, force: true });
	}

	console.log(`\n${passes} page(s) unchanged, ${failures} moved, ${unanswered} unanswered`);
	process.exit(failures || unanswered ? 1 : 0);
})();
