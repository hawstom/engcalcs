// LIBRARIES: A SECTION'S LONG EXPLANATION IS A TIP ON ITS HEADING, AND THE HEADING OPENS THE MANUAL (Tom, round 11).
// Curves, Pipe types and Fittings opened on two paragraphs of explanation. Real Chromium: in each of those
// sections no explanatory paragraph stands in the section above the Add button; the heading is a link plus the
// suite's `?`; the `?` tip is the two paragraphs' own words; the link opens the user manual at the Libraries entry.
//   node dev/lpn-spike/library-intro-tip-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const REPO = path.resolve(__dirname, '..', '..');
const U = require('./scenario-ui-helper.js');
const { openBox } = require('./dock-boxes.js');
U.takeBrowserLock('library-intro-tip-browser-harness', 'EC_LIT_LOCKED');
let fails = 0, checks = 0;
function ok(name, cond, extra) { checks++; if (!cond) { fails++; } console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); }
(async () => {
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		const { a, P } = await U.openNet1(browser, 'lit');
		await openBox(a, 'lpn_library_box'); await a.settle(500);
		const KEYS = { curves: ['lpn_library_curves_note', 'lpn_library_curve_values_tip'], pipetypes: ['lpn_library_pipetypes_note', 'lpn_library_pipetype_blank_tip'], fittings: ['lpn_library_fittings_note', 'lpn_library_fittings_source'] };
		for (const id of Object.keys(KEYS)) {
			await P.click('#lpn_libbox_link_' + id); await a.settle(400);
			const want = (await Promise.all(KEYS[id].map((k) => a.lang(k)))).join(' ');
			const none = await a.lang('lpn_pane_none');
			const m = await P.evaluate((none) => {
				const sec = document.querySelector('#lpn_libbox_content .lpn-lib-sec'), h = sec.querySelector(':scope > h3');
				const help = h.querySelector('.ec-help'), link = h.querySelector('a');
				return { notes: Array.from(sec.querySelectorAll(':scope > p.lpn-lib-note')).filter((p) => p.textContent !== none).length, glyphs: h.querySelectorAll('.ec-tip').length, tip: help ? help.title || help.getAttribute('data-bs-original-title') : null, link: link ? link.getAttribute('href') : null };
			}, none);
			ok(id + ': no explanatory paragraph above the list', m.notes === 0, String(m.notes));
			ok(id + ': the heading carries exactly one `?`', m.glyphs === 1, String(m.glyphs));
			ok(id + ': the tip is the two paragraphs\' own words', m.tip === want, String(m.tip).slice(0, 80));
			ok(id + ': the heading links to the user manual', m.link === '#guide/box-lpn_library_box', String(m.link));
			await P.evaluate(() => document.querySelector('#lpn_libbox_content .lpn-lib-sec > h3 a').click()); await a.settle(600);
			const g = await P.evaluate(() => { const b = document.getElementById('lpn_hotkeys_popup'), e = document.querySelector('#lpn_guide_content [data-guide-key="box-lpn_library_box"]'); return { open: !!b && getComputedStyle(b).display !== 'none', at: e ? Math.round(e.getBoundingClientRect().top - document.getElementById('lpn_guide_content').getBoundingClientRect().top) : null }; });
			ok(id + ': the link opens the manual at the Libraries entry', g.open && g.at !== null && g.at < 120, JSON.stringify(g));
			await P.evaluate(() => { const x = document.querySelector('#lpn_hotkeys_popup .lpn-popover-x'); if (x) { x.click(); } }); await a.settle(200);
		}
		console.log('library-intro-tip-browser-harness: ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
})().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });
