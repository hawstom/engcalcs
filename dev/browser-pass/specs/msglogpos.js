// ROADMAP Task 704 -- the message log glyph must stay visible, and lit, beside the notice it
// recalls, never underneath it.
//
// Perry's review, 2026-09-22, on the first version of this move: the earlier harness
// (dev/lpn-spike/notice-log-harness.js §7c) checked only SOURCE ORDER in the rendered HTML -- that
// #lpn_msglog_btn appears before #lpn_mode_hint and #lpn_map_notice in the markup -- and passed
// while the LAYOUT was wrong: #lpn_map_notice was still a sibling of the whole overlay row,
// absolutely positioned at the MAP's own top-left corner with a physical `left:4px`, which is
// exactly where the glyph itself now sits. The notice covered the glyph -- and its highlight --
// for the entire time a message showed, in every language, and the DOM-stub harness has no layout
// at all (every rect there is zero, same reasoning as specs/phonemenu.js), so it could not have
// caught this. Only a real browser computing real boxes can.
//
// WHAT IS ASSERTED, at 1280px and at 390px, in English and in Arabic (`dir="rtl"`):
//   1. the glyph has a real, non-zero box on screen, both quiet and while a notice shows;
//   2. the notice's box does not INTERSECT the glyph's box while the notice is showing;
//   3. the glyph is highlighted (.lpn-msglog-active) exactly while the notice is showing;
//   4. at 390px, where #lpn_mode_hint is hidden by the small-screen rule, the glyph is unaffected
//      and stays on screen quiet, and stays visible and lit when a notice arrives.
//
// THE TRIGGER: a keyboard Delete with nothing selected, which setNotice()s
// `lpn_select_first` ("Nothing is selected..."). Chosen because it needs no file dialog, no
// network round trip and no example network -- three fewer ways for a probe of LAYOUT to fail for
// an unrelated reason.
//
// **ADDED 2026-09-22, SAME DAY, LIVE ON PORT 8099:** Tom retired the dialog the log opened into --
// "The alert paradigm is not a good UX for showing past messages ... fill the map below the Mode
// status line with old messages, oldest at the bottom" -- for an on-map panel. This file also
// drives it with REAL clicks and a REAL Escape key, which is the only way to prove an
// outside-click listener actually closes something: a real click(), not a synthetic dispatch, is
// what document-level capture listeners are written against.

const { Session } = require('../lib/session');

exports.title = '704. The message log glyph is never covered by the notice it recalls';

const SIZES = [
	{ label: '1280', viewport: { width: 1280, height: 900 } },
	{ label: '390', viewport: { width: 390, height: 844 } }
];
const LANGS = ['en', 'ar'];

function intersects(a, b) {
	return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}
function realBox(r) { return !!r && r.width > 0 && r.height > 0; }
// **THE HORIZONTAL GAP, AND WHY NON-INTERSECTION ALONE IS NOT ENOUGH.** The original RTL defect
// (Perry's review) never intersected the glyph at all: the notice was still pinned to the map's
// physical left edge while the glyph sat at the physical right, so the two boxes were nowhere near
// each other -- disconnected across most of the viewport width, not overlapping. A pass-mutant run
// against that exact regression confirmed it: en failed on intersection as expected, but ar passed
// every check including "does not cover the glyph" with a measured gap of 956px between them. A
// non-intersection assertion is therefore necessary but not sufficient; this measures the gap
// between the two boxes' nearest edges and requires it to be small, in either direction, which is
// what "the notice sits right beside the glyph, in the same column" actually means.
function hgap(a, b) {
	if (a.right <= b.left) { return b.left - a.right; }
	if (b.right <= a.left) { return a.left - b.right; }
	return 0;
}

async function boxes(page) {
	return page.evaluate(() => {
		function box(id) {
			const e = document.getElementById(id);
			if (!e) { return null; }
			const cs = getComputedStyle(e);
			if (cs.display === 'none' || cs.visibility === 'hidden') { return null; }
			const r = e.getBoundingClientRect();
			return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
		}
		const btn = document.getElementById('lpn_msglog_btn');
		return {
			glyph: box('lpn_msglog_btn'),
			notice: box('lpn_map_notice'),
			modeHint: box('lpn_mode_hint'),
			active: !!(btn && btn.classList.contains('lpn-msglog-active')),
			dir: document.documentElement.getAttribute('dir') || ''
		};
	});
}

exports.run = async function ({ browser, report }) {
	for (const size of SIZES) {
		for (const lang of LANGS) {
			const label = `${lang} @ ${size.label}px`;
			const a = await Session.open(browser, label, { viewport: size.viewport });
			try {
				await a.goto(`Looped-Network.php?ec_nolog=1&lang=${lang}`);
				await a.dismissGallery();
				if (lang === 'ar') {
					const dir = await a.page.evaluate(() => document.documentElement.getAttribute('dir'));
					report.eq(dir, 'rtl', `${label}: the page is actually RTL, or this run proves nothing`);
				}

				const quiet = await boxes(a.page);
				report.ok(realBox(quiet.glyph), `${label}: the glyph has a real box while quiet`, JSON.stringify(quiet.glyph));
				report.ok(!quiet.active, `${label}: the glyph is not highlighted while quiet`);

				// Nothing is selected on a freshly loaded page, and the canvas area is not a text
				// field, so Delete reaches the "nothing selected" branch and calls setNotice().
				await a.page.keyboard.press('Delete');
				await a.settle(150);

				const shown = await boxes(a.page);
				report.ok(realBox(shown.notice), `${label}: the notice has a real box while it shows`, JSON.stringify(shown.notice));
				report.ok(realBox(shown.glyph), `${label}: the glyph STILL has a real box while the notice shows`,
					JSON.stringify(shown.glyph));
				report.ok(shown.glyph && shown.notice && !intersects(shown.glyph, shown.notice),
					`${label}: the notice's box does not cover the glyph's box`,
					JSON.stringify({ glyph: shown.glyph, notice: shown.notice }));
				// Adjacency, not just non-overlap -- see the comment on hgap() above for the
				// disconnected-in-RTL failure a non-intersection check alone cannot see.
				const gap = shown.glyph && shown.notice ? hgap(shown.glyph, shown.notice) : Infinity;
				report.ok(gap < 20, `${label}: the notice sits right beside the glyph, not disconnected from it`,
					'gap=' + gap);
				report.ok(shown.active, `${label}: the glyph is highlighted while the notice shows`);

				if (size.label === '390') {
					report.ok(!realBox(shown.modeHint), `${label}: the mode hint is hidden at this width, as designed`);
				}

				// ---- The panel (Tom, 2026-09-22, live on the same port: "The alert paradigm is
				// not a good UX ... fill the map below the Mode status line with old messages,
				// oldest at the bottom") -- a real click, a real Escape, a real click elsewhere. ----
				await a.page.click('#lpn_msglog_btn');
				await a.settle(80);
				const opened = await a.page.evaluate(() => {
					const p = document.getElementById('lpn_msglog_panel'), btn = document.getElementById('lpn_msglog_btn');
					const r = p.getBoundingClientRect();
					return {
						shown: getComputedStyle(p).display !== 'none' && r.width > 0 && r.height > 0,
						expanded: btn.getAttribute('aria-expanded'),
						top: r.top, left: r.right, right: r.right, rowCount: p.querySelectorAll('.lpn-msglog-panel-row, .lpn-msglog-panel-empty').length
					};
				});
				report.ok(opened.shown, `${label}: pressing the glyph opens a real on-map panel, not an alert()`, JSON.stringify(opened));
				report.eq(opened.expanded, 'true', `${label}: the button says it is expanded`);
				report.ok(opened.rowCount > 0, `${label}: the panel has at least one row (the notice just shown, if nothing else)`);

				const glyphBox = (await boxes(a.page)).glyph;
				const panelBox = await a.page.evaluate(() => document.getElementById('lpn_msglog_panel').getBoundingClientRect());
				report.ok(panelBox.top >= glyphBox.bottom - 2,
					`${label}: the panel sits BELOW the glyph/mode-line row, not overlapping it`,
					JSON.stringify({ glyphBottom: glyphBox.bottom, panelTop: panelBox.top }));

				await a.page.keyboard.press('Escape');
				await a.settle(80);
				const afterEscape = await a.page.evaluate(() => ({
					shown: getComputedStyle(document.getElementById('lpn_msglog_panel')).display !== 'none',
					expanded: document.getElementById('lpn_msglog_btn').getAttribute('aria-expanded')
				}));
				report.ok(!afterEscape.shown, `${label}: Escape closes the panel`);
				report.eq(afterEscape.expanded, 'false', `${label}: and un-expands the button`);

				await a.page.click('#lpn_msglog_btn');
				await a.settle(80);
				// A real click well away from both the panel and the button -- the canvas itself.
				await a.page.mouse.click(Math.round(size.viewport.width / 2), Math.round(size.viewport.height / 2));
				await a.settle(80);
				const afterOutside = await a.page.evaluate(() =>
					getComputedStyle(document.getElementById('lpn_msglog_panel')).display !== 'none');
				report.ok(!afterOutside, `${label}: a click elsewhere on the map closes the panel too`);
			} finally {
				await a.context.close();
			}
		}
	}
};
