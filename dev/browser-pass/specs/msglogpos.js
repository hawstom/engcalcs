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
				// No cleanup needed: each iteration below opens its own fresh browser context.
			} finally {
				await a.context.close();
			}
		}
	}
};
