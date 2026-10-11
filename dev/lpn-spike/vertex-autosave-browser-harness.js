// A BEND ADDED OR REMOVED IN VERTICES MODE IS AUTOSAVED AT ONCE. Real Chromium, real clicks.
//   Net1, Vertices mode, one press on a pipe adds a bend; reload with NO other edit and the bend is
//   still there. One press on that bend removes it; reload again and it is gone.
// Before the fix insertVertex() and removeVertex() never reached scheduleSolve(), whose debounce the
// autosave rides, so the reload lost the edit until some other edit came along.
//   node dev/lpn-spike/vertex-autosave-browser-harness.js        (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_VERTEX_AUTOSAVE_BROWSER_LOCKED';
const NAME = 'vertex-autosave-browser-harness';

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

async function dismiss(a) {
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
}
// Bends drawn on the map right now (handles exist only in Vertices mode).
function handleCount(a) {
	return a.page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-vhandle').length);
}
async function enterVertices(a) {
	await a.toolbarClick(await a.lang('lpn_tool_vertices'));
	await a.settle(500);
}
// Screen centre of a pipe's own line (a straight pipe's box centre lies on it).
function pipeCentre(a) {
	return a.page.evaluate(() => {
		const els = Array.from(document.querySelectorAll('#lpn_canvas [data-link]'))
			.filter((e) => !e.classList.contains('lpn-vhandle') && /^(line|polyline|path)$/i.test(e.tagName));
		let best = null;
		els.forEach((e) => {
			const r = e.getBoundingClientRect();
			if (r.width < 60 && r.height < 60) { return; }
			if (!best || Math.max(r.width, r.height) > best.len) {
				best = { x: r.left + r.width / 2, y: r.top + r.height / 2, len: Math.max(r.width, r.height) };
			}
		});
		return best;
	});
}
async function reload(a) {
	await a.settle(900);   // longer than the 300 ms debounce, shorter than any other edit would take
	await a.reload();
	await dismiss(a);
	await a.settle(1500);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await dismiss(a);
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		const nodes = await a.nodeCount();
		await enterVertices(a);
		const h0 = await handleCount(a);
		const p = await pipeCentre(a);
		ok('Net1 is open in Vertices mode and a pipe was found', !!p && nodes > 0, JSON.stringify({ nodes, h0, p }));

		console.log('\n--- add a bend, reload with no other edit ---');
		await a.page.mouse.click(p.x, p.y);
		await a.settle(300);
		const h1 = await handleCount(a);
		ok('one press on the pipe adds one bend', h1 === h0 + 1, h0 + ' -> ' + h1);
		await reload(a);
		const nAfter = await a.nodeCount(); ok('the project reopened', nAfter > 0, nAfter + ' vs ' + nodes);
		await enterVertices(a);
		const h2 = await handleCount(a);
		ok('after the reload the bend is still there', h2 === h1, h2 + ' vs ' + h1);

		console.log('\n--- remove it, reload with no other edit ---');
		const hp = await a.page.evaluate(() => {
			const hs = Array.from(document.querySelectorAll('#lpn_canvas .lpn-vhandle'));
			// the handles of a pipe with a bend are the only ones Net1 has
			const r = hs[0].getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await a.page.mouse.click(hp.x, hp.y);
		await a.settle(300);
		const h3 = await handleCount(a);
		ok('one press on the bend removes it', h3 === h2 - 1, h2 + ' -> ' + h3);
		await reload(a);
		await enterVertices(a);
		const h4 = await handleCount(a);
		ok('after the reload the bend is gone', h4 === h3, h4 + ' vs ' + h3);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
