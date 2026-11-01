// MORPH > VERTEX ASKS BEFORE IT CLEARS ANYTHING, IN A REAL CHROMIUM (Tom, 2026-10-26: "no confirmation box,
// only the messenger"). On Net1, through the real Water > Morph > Vertex menu row and the page's own
// dialog (no stub answerer):
//   (Net1: every junction has an initial quality of 0.5, so only 32, whose two pipes are the same size, reaches the box;
//   the others are refused by name: three or more pipes, a pump, or two different pipe sizes.)
//   1. A junction that joins two pipes and has an elevation and a demand: a confirm box opens that
//      names the elevation and demands and the ID, with OK and Cancel.
//   2. Cancel leaves everything untouched: the junction, both pipes, its elevation and demand.
//   3. OK morphs it: the junction is gone, one pipe remains; Undo restores junction, pipes, elevation, demand.
//   4. A junction the morph refuses (three pipes) shows the messenger line, never a box, and names why.
// The rule for a refusal is in vertexMorphProblem(); the headless detail is morph-vertex-harness.js.
//
//   node dev/lpn-spike/morph-vertex-confirm-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'morph-vertex-confirm-browser-harness';
if (process.env.EC_MVC_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_MVC_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1600, height: 1000 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		const L = (k) => a.lang(k);
		const clickNode = async (id) => {
			await page.keyboard.press('Escape');
			const r = await page.evaluate((id) => {
				const c = document.querySelector('.lpn-node-hit[data-node="' + id + '"]');
				if (!c) { return null; }
				const b = c.getBoundingClientRect();
				return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
			}, id);
			if (!r) { return false; }
			await page.mouse.click(r.x, r.y);
			await a.settle(500);
			return true;
		};
		const notice = () => page.evaluate(() => { const e = document.getElementById('lpn_map_notice'); return e && e.style.display !== 'none' ? e.textContent.trim() : ''; });
		const morphVertex = async () => a.menuClickSub(await L('lpn_morph_menu'), await L('lpn_morph_vertex'), 'project');
		const selNode = () => page.evaluate(() => { const c = document.querySelector('circle.lpn-node.lpn-selected'); return c ? c.getAttribute('data-node') : null; });
		const counts = () => page.evaluate(() => ({ nodes: document.querySelectorAll('circle.lpn-node').length, links: document.querySelectorAll('.lpn-link').length, has32: !!document.querySelector('circle.lpn-node[data-node="32"]') }));
		const clearNotice = () => page.evaluate(() => { const e = document.getElementById('lpn_map_notice'); if (e) { e.textContent = ''; e.style.display = 'none'; } });
		const select = async (id) => { for (let t = 0; t < 3 && (await selNode()) !== id; t++) { await clickNode(id); } return (await selNode()) === id; };
		const before = await counts();

		console.log('--- 1. Net1 junction 32: two pipes of one diameter, with an elevation, a demand and an initial quality ---');
		ok('1.0 junction 32 is selected by a click', await select('32'));
		await clearNotice();
		await morphVertex();
		await a.settle(500);
		const d = await a.dialog();
		ok('1.1 a confirm box opens (the suite\'s own dialog), not only a messenger line', !!d, d ? '' : 'notice: ' + await notice());
		const txt = d ? d.text.replace(/\s+/g, ' ') : '';
		ok('1.2 it names the junction, its elevation and its demands', /\b32\b/.test(txt) && /elevation 710 ft/i.test(txt) && /demands 100 gpm/i.test(txt), txt);
		ok('1.3 ...and the initial quality it will also clear', /initial quality 0\.5/i.test(txt), txt);
		ok('1.4 it has OK and Cancel', !!d && d.buttons.length === 2, d ? d.buttons.join('/') : '');
		ok('1.5 nothing has changed while the box is up', JSON.stringify(await counts()) === JSON.stringify(before));
		if (d) { await a.dialogClick(d.buttons[1]); }
		await a.settle(500);
		ok('2.1 Cancel: the box is gone, junction 32 and both pipes remain', !(await a.dialog()) && JSON.stringify(await counts()) === JSON.stringify(before));
		await select('32');
		await morphVertex();
		await a.settle(500);
		const d2 = await a.dialog();
		if (d2) { await a.dialogClick(d2.buttons[0]); }
		await a.settle(900);
		const after = await counts();
		ok('3.1 OK: junction 32 is gone and one pipe fewer', !after.has32 && after.nodes === before.nodes - 1 && after.links === before.links - 1, JSON.stringify(after));
		ok('3.2 the messenger says what was done', /Morphed 1/.test(await notice()), await notice());
		await page.mouse.click(5, 5);
		await page.keyboard.press('Control+z');
		await a.settle(900);
		ok('4.1 Undo restores junction 32 and the pipe', JSON.stringify(await counts()) === JSON.stringify(before), JSON.stringify(await counts()));

		console.log('\n--- 5. a junction the morph refuses shows the messenger and no box ---');
		ok('5.0 junction 11 (three pipes) is selected', await select('11'));
		await clearNotice();
		await morphVertex();
		await a.settle(500);
		ok('5.1 no box', !(await a.dialog()));
		ok('5.2 the messenger names why', /11 was not morphed into a vertex: it joins 3 pipes/.test(await notice()), await notice());
		await a.close();
	} finally { await browser.close(); env.stopServer(); }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));
