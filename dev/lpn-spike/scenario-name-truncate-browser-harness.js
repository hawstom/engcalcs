// SCENARIO MANAGER: THE SCENARIO COLUMN IS AS WIDE AS THE READER DRAGS IT, AND A NAME TOO LONG FOR IT IS
// CUT WITH AN ELLIPSIS, ITS FULL TEXT IN THE TIP (Tom, round 11: "I am limited on sizing that column...
// truncating the contents per the global style convention"). A "no wrap" rule that only held the cell open
// at its text's width made the column undraggable. Real Chromium, the shipped Net1 scenarios, one name made long.
// Drag the Scenario column's divider far left: the column ends narrower than 5em, no name wraps, the cell
// clips with an ellipsis, the cell's title is the full name.
//   node dev/lpn-spike/scenario-name-truncate-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const REPO = path.resolve(__dirname, '..', '..');
const U = require('./scenario-ui-helper.js');
const { openBox } = require('./dock-boxes.js');
U.takeBrowserLock('scenario-name-truncate-browser-harness', 'EC_SNT_LOCKED');
let fails = 0, checks = 0;
function ok(name, cond, extra) { checks++; if (!cond) { fails++; } console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); }
(async () => {
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		const { a, P } = await U.openNet1(browser, 'snt', { shipped: true });
		await openBox(a, 'lpn_sm_box'); await a.settle(600);
		const long = 'Peak hour with the north pump station out of service';
		await P.evaluate((long) => { const td = document.querySelector('#lpn_sm_table tbody td.lpn-pane-col-sc_name'); td.textContent = long; td.title = long; }, long);
		const m = () => P.evaluate(() => {
			const t = document.getElementById('lpn_sm_table'), th = t.querySelector('thead th.lpn-pane-col-sc_name'), em = parseFloat(getComputedStyle(t).fontSize);
			const tds = Array.from(t.querySelectorAll('tbody td.lpn-pane-col-sc_name'));
			const grip = th.querySelector('.lpn-pane-colgrip'), g = grip.getBoundingClientRect();
			// The grip is a sliver at the heading's end edge; find an x where it is what a press lands on.
			let gx = g.left + g.width / 2; const gy = g.top + g.height / 2;
			for (let x = g.right + 3; x > g.left - 6; x -= 1) { if (document.elementFromPoint(x, gy) === grip) { gx = x; break; } }
			return { thEm: th.getBoundingClientRect().width / em, tw: t.getBoundingClientRect().width, ws: tds.map((x) => getComputedStyle(x).whiteSpace), hs: tds.map((x) => Math.round(x.getBoundingClientRect().height)),
				ell: getComputedStyle(tds[0]).textOverflow, clipped: tds[0].scrollWidth > tds[0].clientWidth + 1, title: tds[0].title, gx, gy };
		});
		const b = await m();
		ok("opens at its longest name's width", b.thEm > 8, b.thEm.toFixed(1) + 'em');
		await P.mouse.move(b.gx, b.gy); await P.mouse.down(); await P.mouse.move(b.gx - 250, b.gy, { steps: 6 }); await P.mouse.up(); await a.settle(300);
		const d = await m();
		ok('the column drags narrower than its longest name (' + b.thEm.toFixed(1) + 'em to ' + d.thEm.toFixed(1) + 'em)', d.thEm < 5, d.thEm.toFixed(1) + 'em');
		ok('no name wraps: every row keeps one height', d.ws.every((w) => w === 'nowrap') && d.hs.every((h) => h === d.hs[0]), JSON.stringify(d.hs));
		ok('the cut name ends in an ellipsis', d.ell === 'ellipsis' && d.clipped, d.ell + ' ' + d.clipped);
		ok('the full name is in the tip', d.title === long, d.title);
				console.log('scenario-name-truncate-browser-harness: ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
})().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });
