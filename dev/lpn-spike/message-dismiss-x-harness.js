// THE HIDE x IS FINDABLE, in a real Chrome, at desktop and phone width.
//
//   node dev/lpn-spike/message-dismiss-x-harness.js     (takes the browser lock itself)
//
// Tom, 2026-10-08: "I can't find how to hide a message. There was a little x before." The x existed but
// was 18x15 px in muted ink. This clicks the real x on a standing message and checks it is a real target
// (at least 20 px square, the page's body ink rather than the muted ink, reachable by Tab, named by a
// tip), that clicking it sends the message to the top of the history marked Hidden with Show, and that
// at 390 px wide it is still on screen, not under the Something wrong button, and the box does not scroll.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_MESSAGE_DISMISS_X_LOCKED';
const NAME = 'message-dismiss-x-harness';

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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(1000);
		await a.newProject('us');
		const place = async (tool, fx, fy) => {
			await a.dismissGallery();
			await a.toolbarClick(tool);
			const r = await page.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
			await page.mouse.click(r.x + r.w * fx, r.y + r.h * fy);
			await a.settle(900);
			await a.toolbarClick('Select');
			await a.settle(500);
		};
		const metrics = () => page.evaluate(() => {
			const x = document.getElementById('lpn_status_dismiss'), w = document.getElementById('lpn_wrong_status_btn');
			const bx = x.getBoundingClientRect(), bw = w.getBoundingClientRect();
			const probe = document.createElement('i'); probe.style.color = 'var(--ec-ink)'; document.body.appendChild(probe);
			const ink = getComputedStyle(probe).color; probe.remove();
			const cs = getComputedStyle(x);
			return {
				w: bx.width, h: bx.height, color: cs.color, ink, tab: x.tabIndex, title: x.title, label: x.getAttribute('aria-label'),
				inView: bx.left >= 0 && bx.right <= innerWidth && bx.top >= 0 && bx.bottom <= innerHeight,
				rx: [bx.left,bx.top,bx.right,bx.bottom,bw.left,bw.top,bw.right,bw.bottom].map(Math.round).join(','), overlap: !(bx.right <= bw.left || bw.right <= bx.left || bx.bottom - 3 <= bw.top || bw.bottom <= bx.top + 3),
				scrollX: document.documentElement.scrollWidth > innerWidth
			};
		});
		await place('Junction', 0.3, 0.4);
		await place('Reservoir', 0.6, 0.6);
		await a.settle(1200);
		const unreach = await a.lang('lpn_diag_unreachable');
		const text = () => page.evaluate(() => document.getElementById('lpn_status_text').textContent);
		const first = await text();
		ok('a standing "no path to a reservoir" message is on screen', first.indexOf(unreach) === 0, first);

		console.log('\n--- desktop: the x is a real, findable target ---');
		let m = await metrics();
		ok('the x is at least 20 px square', m.w >= 20 && m.h >= 20, m.w + 'x' + m.h);
		ok('...in the page\'s body ink, not the muted ink', m.color === m.ink, m.color + ' vs ' + m.ink);
		ok('...reachable by Tab, and named by a tip and an accessible name', m.tab >= 0 && m.title && m.label, JSON.stringify([m.tab, m.title, m.label]));
		ok('...clear of the Something wrong button', !m.overlap);
		await page.screenshot({ path: '/tmp/' + NAME + '-desktop.png', clip: { x: 0, y: 100, width: 700, height: 90 } });
		await page.focus('#lpn_wrong_status_btn');
		await page.keyboard.press('Shift+Tab');
		const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
		ok('Shift+Tab from the Something wrong button lands on the x', focused === 'lpn_status_dismiss', String(focused));

		console.log('\n--- phone width ---');
		await page.setViewportSize({ width: 390, height: 800 });
		await a.settle(800);
		m = await metrics();
		ok('at 390 px the x is 20 px square or more, on screen, clear of Something wrong', m.w >= 20 && m.h >= 20 && m.inView && !m.overlap, JSON.stringify(m));
		ok('...and the page does not scroll sideways', !m.scrollX);
		await page.screenshot({ path: '/tmp/' + NAME + '-phone.png', clip: { x: 0, y: 100, width: 390, height: 140 } });
		await page.setViewportSize({ width: 1400, height: 900 });
		await a.settle(800);

		console.log('\n--- clicking it hides the message into the history ---');
		const c = await page.evaluate(() => { const r = document.getElementById('lpn_status_dismiss').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
		await page.mouse.click(c.x, c.y);
		await a.settle(500);
		const after = await page.evaluate(() => {
			const box = document.getElementById('lpn_status');
			return { text: document.getElementById('lpn_status_text').textContent, box: getComputedStyle(box).display !== 'none' && box.getBoundingClientRect().width > 0 };
		});
		ok('the message left the map', after.text === '' && !after.box, JSON.stringify(after));
		await page.click('#lpn_msglog_btn'); await a.settle(400);
		const log = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_msglog_panel .lpn-msglog-panel-row')).map((r) => ({
			hidden: r.classList.contains('lpn-msglog-panel-hidden'),
			mark: (r.querySelector('.lpn-msglog-panel-when') || {}).textContent,
			text: (r.querySelector('.lpn-msglog-panel-text') || {}).textContent,
			show: !!r.querySelector('button.lpn-msglog-unhide')
		})));
		const mark = (await a.lang('lpn_msglog_hidden')).trim();
		ok('it is the top row of the history, marked Hidden, with Show', log.length > 0 && log[0].hidden && log[0].text === first && log[0].mark === mark && log[0].show, JSON.stringify(log[0]));
		await page.click('#lpn_msglog_panel button.lpn-msglog-unhide'); await a.settle(400);
		ok('Show puts it back on the map', (await text()) === first);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + checks + ' checks, ' + failures + ' failed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(NAME + ': ' + (e && e.stack || e)); process.exit(1); });
