// LIBRARIES: A SECTION'S LONG EXPLANATION IS AN ENTRY IN THE USER MANUAL, AND THE HEADING'S `?` LANDS ON IT (Tom, round 12).
// Curves, Pipe types and Fittings opened on two paragraphs of explanation. Real Chromium: in each of those
// sections no explanatory paragraph stands in the section above the Add button; the heading is plain text (not a
// link) with one `?` button and NO title (a tap cannot hover); a real click AND a touch tap on the `?` open the user
// manual with that section's own entry (its term and its two paragraphs) scrolled into the pane, and the entry says
// the very words the box used to carry.
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
		const KEYS = { curves: ['lpn_library_curves_note', 'lpn_library_curve_values_tip'], pipetypes: ['lpn_library_pipetypes_note', 'lpn_library_pipetype_blank_tip'], fittings: ['lpn_library_fittings_note', 'lpn_library_fittings_source'] };
		const HEAD = { curves: 'lpn_library_curves', pipetypes: 'lpn_library_pipetypes', fittings: 'lpn_library_fittings' };
		for (const mode of ['click', 'tap']) {
			const { a, P } = await U.openNet1(browser, 'lit-' + mode, mode === 'tap' ? { context: { hasTouch: true } } : undefined);
			await openBox(a, 'lpn_library_box'); await a.settle(500);
			await P.click('#lpn_libbox_link_patterns'); await a.settle(400);
			const ref = await P.evaluate(() => { const h = document.querySelector('#lpn_libbox_content .lpn-lib-sec > h3'), cs = getComputedStyle(h); return { color: cs.color, deco: cs.textDecorationLine, weight: cs.fontWeight, link: h.querySelectorAll('a').length }; });
			ok(mode + ': Patterns heading is not a link', ref.link === 0, JSON.stringify(ref));
			for (const id of Object.keys(KEYS)) {
				await P.click('#lpn_libbox_link_' + id); await a.settle(400);
				const want = await Promise.all(KEYS[id].map((k) => a.lang(k)));
				const none = await a.lang('lpn_pane_none');
				const m = await P.evaluate((none) => {
					const sec = document.querySelector('#lpn_libbox_content .lpn-lib-sec'), h = sec.querySelector(':scope > h3');
					const btn = h.querySelector('button'), cs = getComputedStyle(h);
					return { notes: Array.from(sec.querySelectorAll(':scope > p.lpn-lib-note')).filter((p) => p.textContent !== none).length, glyphs: h.querySelectorAll('button').length, hasTitle: btn ? btn.hasAttribute('title') : null, aria: btn ? btn.getAttribute('aria-label') : null, links: h.querySelectorAll('a').length, color: cs.color, deco: cs.textDecorationLine, weight: cs.fontWeight };
				}, none);
				ok(mode + ' ' + id + ': no explanatory paragraph above the list', m.notes === 0, String(m.notes));
				ok(mode + ' ' + id + ': the heading carries exactly one `?`', m.glyphs === 1, String(m.glyphs));
				ok(mode + ' ' + id + ': the `?` has no title (no hover tip) and a name', m.hasTitle === false && !!m.aria && m.aria.indexOf(await a.lang(HEAD[id])) >= 0, JSON.stringify([m.hasTitle, m.aria]));
				ok(mode + ' ' + id + ': the heading is NOT a link, and looks like another box heading', m.links === 0 && m.color === ref.color && m.deco === ref.deco && m.weight === ref.weight && m.color !== 'rgb(13, 110, 253)', JSON.stringify([m.color, m.deco, ref.color, ref.deco]));
				if (mode === 'click') { await P.click('#lpn_libbox_content .lpn-lib-sec > h3 button'); } else { await P.tap('#lpn_libbox_content .lpn-lib-sec > h3 button'); }
				await a.settle(900);
				const g = await P.evaluate((stem) => {
					const b = document.getElementById('lpn_hotkeys_popup'), c = document.getElementById('lpn_guide_content'), dt = c.querySelector('#guide-term-lpn_guide_lib_' + stem);
					if (!dt || !b) { return { open: !!b && getComputedStyle(b).display !== 'none', found: false }; }
					const cr = c.getBoundingClientRect(), r = dt.getBoundingClientRect(), dd = dt.nextElementSibling;
					return { open: getComputedStyle(b).display !== 'none', found: true, top: Math.round(r.top - cr.top), paneH: Math.round(cr.height), term: dt.textContent.trim(), paras: Array.from(dd.querySelectorAll('p')).map((p) => p.textContent) };
				}, id);
				ok(mode + ' ' + id + ': the `?` opens the manual at that section\'s own entry, in view', g.open && g.found && g.top >= -2 && g.top < g.paneH, JSON.stringify([g.top, g.paneH]));
				ok(mode + ' ' + id + ': the entry\'s term is the section heading', g.term === (await a.lang(HEAD[id])).trim(), g.term);
				ok(mode + ' ' + id + ': the entry says the box\'s own two paragraphs, word for word', JSON.stringify(g.paras) === JSON.stringify(want), JSON.stringify(g.paras).slice(0, 90));
				await P.evaluate(() => { const x = document.querySelector('#lpn_hotkeys_popup .lpn-popover-x'); if (x) { x.click(); } }); await a.settle(300);
			}
			ok(mode + ': no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
			await a.context.close().catch(() => {});
		}
		console.log('library-intro-tip-browser-harness: ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
})().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });
