// THE SETTINGS CONTENT PANE NEVER SCROLLS SIDEWAYS ON A PHONE (ROADMAP Task 760). Since R-326/R-346
// the three label lists (Settings > Labels: node, link, text fields) carry six columns, and at 360 px
// they overran the 201.6 px pane by about 22 px. Measured here in a real Chrome, Elm Street open:
//
//   1. At 360 and 320 px the Settings content pane has scrollWidth <= clientWidth, nothing inside
//      it paints past its right edge, and the page gains no horizontal scrollbar.
//   2. At 1440 px the label lists keep their desktop layout: six columns in a row, the pane not
//      scrolling, every heading inside its own cell.
//
//   node dev/lpn-spike/settings-phone-width-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SETPHONE_BROWSER_LOCKED';
const NAME = 'settings-phone-width-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const LISTS = ['lpn_labels_node_fields', 'lpn_labels_link_fields', 'lpn_labels_customer_fields'];

async function measure(Session, browser, viewport) {
	const a = await Session.open(browser, NAME, { viewport });
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1200);
		await a.menuClick('Settings', 'project');
		await a.settle(700);
		return await a.page.evaluate((lists) => {
			const c = document.getElementById('lpn_setbox_content'), cr = c.getBoundingClientRect();
			const out = {
				client: c.clientWidth, scroll: c.scrollWidth,
				doc: document.documentElement.scrollWidth > window.innerWidth + 1,
				past: [...c.querySelectorAll('*')].filter((e) => e.offsetParent && e.getBoundingClientRect().right > cr.right + 1)
					.slice(0, 5).map((e) => e.tagName + '#' + e.id + '.' + String(e.className).slice(0, 24)),
				lists: {}
			};
			lists.forEach((id) => {
				const el = document.getElementById(id);
				if (!el) { out.lists[id] = null; return; }
				const head = el.children[0];
				const cells = [...head.children].filter((x) => getComputedStyle(x).display !== 'none');
				out.lists[id] = {
					cols: cells.length,
					widths: cells.map((x) => Math.round(x.getBoundingClientRect().width)),
					tops: new Set(cells.map((x) => Math.round(x.getBoundingClientRect().top))).size,
					spill: cells.filter((x) => {
						const r = document.createRange(); r.selectNodeContents(x);
						const rs = [...r.getClientRects()];
						return rs.length && Math.max(...rs.map((q) => q.right)) > x.getBoundingClientRect().right + 0.5;
					}).length
				};
			});
			return out;
		}, LISTS);
	} finally {
		await a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		for (const w of [360, 320, 1440]) {
			console.log('\n--- ' + w + ' px ---');
			const m = await measure(Session, browser, { width: w, height: w < 600 ? 740 : 900 });
			console.log('  pane ' + m.client + ' px, content ' + m.scroll + ' px');
			ok(w + ': the Settings content pane does not scroll sideways', m.scroll <= m.client, m.scroll + ' vs ' + m.client + ' ' + m.past.join('; '));
			ok(w + ': the page has no horizontal scrollbar', !m.doc);
			LISTS.forEach((id) => {
				const l = m.lists[id];
				if (!l) { ok(w + ': ' + id + ' exists', false); return; }
				console.log('  ' + id + ' widths ' + l.widths.join(','));
				ok(w + ': ' + id + ' has six columns', l.cols === 6, String(l.cols));
				ok(w + ': ' + id + ' headings paint inside their cells', l.spill === 0, l.spill + ' spill');
				if (w === 1440) { ok('1440: ' + id + ' columns are sensible (each 20 px or wider)', l.widths.every((x) => x >= 20), l.widths.join(',')); }
			});
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
