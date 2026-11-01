// LIBRARIES: A SECTION'S LONG EXPLANATION IS A TIP ON ITS HEADING, AND THE HEADING OPENS THE MANUAL (Tom, round 11).
// Curves, Pipe types and Fittings opened on two paragraphs of explanation. Real Chromium: in each of those
// sections no explanatory paragraph stands in the section above the Add button; the heading is plain text (not a
// link, the colour and decoration of another box heading) with one `?` button; the `?` tip is the two paragraphs' own words;
// a real click on the `?` opens the user manual at the Libraries entry.
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
		await P.click('#lpn_libbox_link_patterns'); await a.settle(400);
		const ref = await P.evaluate(() => { const h = document.querySelector('#lpn_libbox_content .lpn-lib-sec > h3'), cs = getComputedStyle(h); return { color: cs.color, deco: cs.textDecorationLine, weight: cs.fontWeight, link: h.querySelectorAll('a').length }; });
		ok('Patterns heading is not a link', ref.link === 0, JSON.stringify(ref));
		for (const id of Object.keys(KEYS)) {
			await P.click('#lpn_libbox_link_' + id); await a.settle(400);
			const want = (await Promise.all(KEYS[id].map((k) => a.lang(k)))).join(' ');
			const none = await a.lang('lpn_pane_none');
			const m = await P.evaluate((none) => {
				const sec = document.querySelector('#lpn_libbox_content .lpn-lib-sec'), h = sec.querySelector(':scope > h3');
				const btn = h.querySelector('button'), cs = getComputedStyle(h), cp = getComputedStyle(document.querySelector('#lpn_libbox_content .lpn-lib-sec > h3'));
				return { notes: Array.from(sec.querySelectorAll(':scope > p.lpn-lib-note')).filter((p) => p.textContent !== none).length, glyphs: h.querySelectorAll('button').length, tip: btn ? btn.title || btn.getAttribute('data-bs-original-title') : null, links: h.querySelectorAll('a').length, color: cs.color, deco: cs.textDecorationLine, weight: cs.fontWeight };
			}, none);
			ok(id + ': no explanatory paragraph above the list', m.notes === 0, String(m.notes));
			ok(id + ': the heading carries exactly one `?`', m.glyphs === 1, String(m.glyphs));
			ok(id + ': the tip is the two paragraphs\' own words', m.tip === want, String(m.tip).slice(0, 80));
			ok(id + ': the heading is NOT a link', m.links === 0, String(m.links));
			ok(id + ': the heading has the same colour and decoration as another box heading', m.color === ref.color && m.deco === ref.deco && m.weight === ref.weight && m.color !== 'rgb(13, 110, 253)', JSON.stringify([m.color, m.deco, ref.color, ref.deco]));
			await P.hover('#lpn_libbox_content .lpn-lib-sec > h3 button'); await a.settle(900);
			const shown = await P.evaluate(() => { const t = document.querySelector('.tooltip.show'); return t ? t.textContent : ''; });
			ok(id + ': hovering the `?` shows the explanation', shown.length > 40 && want.indexOf(shown.slice(0, 40)) === 0, shown.slice(0, 60));
			await P.click('#lpn_libbox_content .lpn-lib-sec > h3 button'); await a.settle(900);
			const g = await P.evaluate(() => { const b = document.getElementById('lpn_hotkeys_popup'), e = document.querySelector('#lpn_guide_content [data-guide-key="box-lpn_library_box"]'); return { open: !!b && getComputedStyle(b).display !== 'none', at: e ? Math.round(e.getBoundingClientRect().top - document.getElementById('lpn_guide_content').getBoundingClientRect().top) : null }; });
			ok(id + ': a real click on the `?` opens the manual at the Libraries entry', g.open && g.at !== null && g.at < 120, JSON.stringify(g));
			await P.evaluate(() => { const x = document.querySelector('#lpn_hotkeys_popup .lpn-popover-x'); if (x) { x.click(); } }); await a.settle(200);
		}
		console.log('library-intro-tip-browser-harness: ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
})().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });
