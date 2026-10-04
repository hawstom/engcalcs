// THE TITLE BAND OF EVERY DOCKABLE BOX, IN A REAL BROWSER. Tom, 2026-10-04: *"The Full Report has
// Download and Print buttons in its title bar that conflict with docking icons. Audit all dockable
// boxes for this."* The dock icons (Task 441) sit in the band just left of the X; a box that put its
// own buttons in the same band drew them on top of the dock icons.
//
//   For every dockable box, floating and docked left and docked right, at 1400 and at 1000 wide, and
//   in a right-to-left page: no control in the title band (a dock icon, the X, a `?`, a button the
//   box brought of its own) overlaps another, every one is on screen, and the title text does not
//   run under any of them.
//
//   node dev/lpn-spike/dock-title-band-harness.js     (takes the browser lock itself)
// DOCK_SHOT=<dir> also writes a screenshot of each box.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TITLEBAND_BROWSER_LOCKED';
const NAME = 'dock-title-band-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
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
const BOXES = ['lpn_popup', 'lpn_find_popup', 'lpn_settings_box', 'lpn_library_box', 'lpn_ff_box', 'lpn_crit_box',
	'lpn_ds_box', 'lpn_energy_box', 'lpn_contour_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_alt_box',
	'lpn_full_box', 'lpn_calib_box', 'lpn_notes_popup', 'lpn_hotkeys_popup'];

// Everything a person could press or read in the band: the box's direct children that sit in its top
// 40 px, the corner row's children, and the title text itself.
function measure(id) {
	const b = document.getElementById(id), br = b.getBoundingClientRect();
	const rect = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; };
	const out = [];
	const band = br.top + 40;
	const take = (e, name) => {
		const r = rect(e);
		if (r.r - r.l < 1 || r.b - r.t < 1) { return; }
		out.push(Object.assign({ name }, r));
	};
	Array.from(b.children).forEach((c) => {
		if (c.classList.contains('lpn-box-corner')) {
			Array.from(c.children).forEach((k) => take(k, 'dock:' + (k.getAttribute('data-dock') || 'help')));
		} else if (c.classList.contains('lpn-setbox-title')) {
			const rg = document.createRange(); rg.selectNodeContents(c);
			const tr = rg.getBoundingClientRect(), cr = c.getBoundingClientRect(), cs = getComputedStyle(c);
			const padL = parseFloat(cs.paddingLeft), padR = parseFloat(cs.paddingRight);
			const rtl = cs.direction === 'rtl';
			// the text actually painted: the content box clips it (overflow hidden, ellipsis)
			const l = Math.max(tr.left, cr.left + (rtl ? padL : padL)), r = Math.min(tr.right, cr.right - padR);
			if (r > l) { out.push({ name: 'title-text', l, r, t: tr.top, b: tr.bottom }); }
		} else if (c.classList.contains('lpn-popover-body') || c.classList.contains('lpn-resize-grip') || c.classList.contains('lpn-dock-grip')) {
			// body: only its sticky tools row (if any) counts, and that is below the band
		} else {
			const r = c.getBoundingClientRect();
			if (r.top < band - 1 && r.bottom > br.top && getComputedStyle(c).position !== 'static') {
				take(c, 'own:' + (c.id || c.className));
			}
		}
	});
	return { box: { l: br.left, r: br.right, t: br.top, b: br.bottom }, items: out, vw: innerWidth, vh: innerHeight };
}
function check(label, m) {
	const bad = [];
	m.items.forEach((a, i) => {
		if (a.l < -0.5 || a.r > m.vw + 0.5 || a.t < -0.5 || a.b > m.vh + 0.5) { bad.push(a.name + ' off screen'); }
		if (a.l < m.box.l - 0.5 || a.r > m.box.r + 0.5) { bad.push(a.name + ' outside its box'); }
		m.items.slice(i + 1).forEach((c) => {
			if (a.l < c.r - 0.5 && c.l < a.r - 0.5 && a.t < c.b - 0.5 && c.t < a.b - 0.5) { bad.push(a.name + ' x ' + c.name); }
		});
	});
	ok(label, bad.length === 0, bad.length ? bad.join('; ') : m.items.length + ' controls, no overlap');
}

async function run(Session, browser, width, lang) {
	console.log('\n--- ' + width + ' wide' + (lang ? ', lang=' + lang : '') + ' ---');
	const a = await Session.open(browser, NAME, { viewport: { width, height: 900 } });
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php' + (lang ? '?lang=' + lang : ''));
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1200);
		for (const id of BOXES) {
			const have = await a.page.evaluate((i) => !!document.getElementById(i), id);
			if (!have) { ok(id + ' exists', false); continue; }
			// Show it where it floats: the openers differ, the band does not.
			await a.page.evaluate((i) => {
				const b = document.getElementById(i);
				b.style.display = 'block'; b.style.left = '120px'; b.style.top = '120px'; b.style.width = '420px';
			}, id);
			await a.settle(150);
			for (const side of [null, 'left', 'right']) {
				if (side) {
					await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="' + side + '"]');
					await a.settle(350);
				}
				const m = await a.page.evaluate(measure, id);
				check(id + (side ? ' docked ' + side : ' floating'), m);
				if (process.env.DOCK_SHOT && (id === 'lpn_full_box' || id === 'lpn_rptbox')) {
					await a.page.screenshot({ path: path.join(process.env.DOCK_SHOT, id + '-' + width + (lang ? '-' + lang : '') + '-' + (side || 'float') + '.png') });
				}
				if (side) {
					await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="float"]');
					await a.settle(250);
				}
			}
			await a.page.evaluate((i) => { document.getElementById(i).style.display = 'none'; }, id);
			await a.settle(100);
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
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
		await run(Session, browser, 1400, null);
		await run(Session, browser, 1000, null);
		await run(Session, browser, 1400, 'he');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
