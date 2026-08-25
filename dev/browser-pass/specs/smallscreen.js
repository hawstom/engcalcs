// §36 — what a phone actually paints (ROADMAP Task 527).
//
// Tom's first real phone session, 2026-08-25, produced three defects that are all about INK rather
// than about structure, and none of them is reachable from the stylesheet alone:
//
//   1. The Settings category index broke EVERY label mid-word — "Visualiz/ation", "Node symbo/logy",
//      "Map appear/ance". Measured here before the fix: 8 of 14 rows split a word in a 65px pane.
//   2. The label symbology headings read "BeforeAfter 0.000 Drop", touching each other. Their BOXES
//      were already exact to a tenth of a pixel (specs/labelcols.js proves that at desktop width);
//      what was wrong is that "Before" is a 40px unbreakable word painting out of a 33px box.
//   3. The Pipes table heading read "Roughnes/s, C" — 94.4px of word in 66px of column.
//
// **WHY THIS CANNOT BE dev/lpn-spike/small-screen-harness.js.** That harness reads the stylesheet
// and answers "does this rule fire on this element at this width", which is the right question for
// a rule and the wrong one for every defect above: all three are a rule that fires correctly and a
// GLYPH that does not fit. The measurement needed is where the ink lands, so it needs a real
// browser at a real 360px. The harness asserts the rules; this asserts the result.
//
// THE MID-WORD TEST IS A RANGE, NOT A GUESS. For each word of a label, a DOM Range over exactly
// that word is asked for its client rects: more than one distinct top edge means the browser broke
// the word across lines. That is the defect Tom photographed, stated as a number.
//
// Elm Street Center is the fixture, as in specs/pane.js — it is the example that carries five of
// the six asset types, so the Pipes table has rows to size its columns against.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { Session } = require('../lib/session');

exports.title = '36. A phone: the ink, not the rules';

// A phone held upright, which is the only orientation the public claim is made for.
const PHONE = { width: 360, height: 740 };

// Every word of every element the selector reaches, and whether the browser split any of them.
// `el.textContent` is not enough: the range has to be over the TEXT NODE, because a heading may
// carry a sort arrow or an icon beside its words.
async function words(page, sel) {
	return page.evaluate((s) => [...document.querySelectorAll(s)].map((el) => {
		const node = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
		if (!node) { return null; }
		const text = node.textContent, broken = [];
		const re = /\S+/g;
		let m;
		while ((m = re.exec(text))) {
			const r = document.createRange();
			r.setStart(node, m.index);
			r.setEnd(node, m.index + m[0].length);
			if (new Set([...r.getClientRects()].map(x => Math.round(x.top))).size > 1) { broken.push(m[0]); }
		}
		const box = el.getBoundingClientRect();
		return { text: text.trim(), broken: broken, top: Math.round(box.top), width: +box.width.toFixed(1) };
	}).filter(Boolean), sel);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		// **THE CONSENT BANNER IS ANSWERED, NOT HIDDEN.** It is `position: fixed; bottom: 0` and a
		// fresh profile has never answered it; in a 360x740 window it lies across the menu bar and
		// swallows the clicks below. Declining is the answer that stores least.
		await a.page.evaluate(() => {
			const b = document.querySelector('#ec-consent button[value="0"]');
			if (b) { b.click(); }
		});
		await a.settle(1500);
		const opened = await a.page.evaluate(() => {
			const card = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')]
				.find(c => /Elm Street/i.test(c.textContent));
			if (!card) { return false; }
			card.click();
			return true;
		});
		report.ok(opened, 'the examples gallery offers Elm Street Center');
		await a.settle(1200);
		await a.page.setViewportSize(PHONE);
		await a.settle(700);

		// ---- 1. THE SETTINGS CATEGORY INDEX ----------------------------------------------------
		await a.menuClick('Settings', 'project');
		await a.settle(700);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'the Settings box opens at 360px');

		const idx = await words(a.page, '#lpn_setbox_index .lpn-setbox-link');
		report.ok(idx.length > 8, 'the category index has its rows', idx.length + ' rows');
		const split = idx.filter(r => r.broken.length);
		report.ok(split.length === 0, 'no category name is broken mid-word',
			split.map(r => r.text + ' (' + r.broken.join(',') + ')').join(', '));
		// **ONE LINE IS THE WHOLE DESIGN.** The names fit because the index stopped being a column;
		// if it ever becomes a column again these rows land on different rows and this fails before
		// anybody reads a word of it.
		report.ok(new Set(idx.map(r => r.top)).size === 1,
			'...because the index is one horizontal strip, not a narrow column',
			new Set(idx.map(r => r.top)).size + ' row(s)');

		const pane = await a.page.evaluate(() => {
			const c = document.getElementById('lpn_setbox_content'),
				i = document.getElementById('lpn_setbox_index'),
				box = document.getElementById('lpn_settings_box');
			return {
				content: +c.getBoundingClientRect().width.toFixed(1),
				index: +i.getBoundingClientRect().width.toFixed(1),
				boxW: +box.getBoundingClientRect().width.toFixed(1),
				// The strip carries its own overflow. If it did not, it would widen the box instead.
				indexScrolls: i.scrollWidth > i.clientWidth + 1,
				contentSideways: c.scrollWidth > c.clientWidth + 1,
				docSideways: document.documentElement.scrollWidth > window.innerWidth + 1
			};
		});
		// As a 4.5rem column the content pane measured 238px against the 230 the node symbology list
		// needs — eight pixels of headroom. The strip hands it the whole box.
		report.ok(pane.content > 290, 'the content pane gets the box\'s full width, not 238px of it',
			pane.content + 'px of a ' + pane.boxW + 'px box');
		report.ok(!pane.contentSideways,
			'...and still has no sideways scrollbar, which is what the pane was narrowed twice to avoid');
		report.ok(!pane.docSideways, 'the page itself has gained no horizontal scrollbar');

		// ---- 2. THE SYMBOLOGY COLUMN HEADINGS --------------------------------------------------
		// Where the INK is, against where the BOX is. specs/labelcols.js already proves the boxes
		// line up on their controls; the phone defect is entirely a glyph painting past its edge.
		for (const list of ['lpn_labels_node_fields', 'lpn_labels_link_fields']) {
			const cells = await a.page.evaluate((id) => {
				const rows = [...document.getElementById(id).children];
				const head = rows[0];
				const field = rows.slice(1).find(r => [...r.children].every((c, i) => i === 0 || c.tagName === 'INPUT'));
				const read = (c) => {
					const box = c.getBoundingClientRect();
					const r = document.createRange();
					r.selectNodeContents(c);
					const rects = [...r.getClientRects()];
					return {
						text: (c.textContent || '').trim(),
						left: +box.left.toFixed(1), right: +box.right.toFixed(1), width: +box.width.toFixed(1),
						ink: rects.length ? +Math.max(...rects.map(x => x.right)).toFixed(1) : box.right,
						hidden: getComputedStyle(c).display === 'none'
					};
				};
				return {
					head: [...head.children].map(read),
					field: field ? [...field.children].map(read) : null
				};
			}, list);
			const shown = cells.head.filter(c => !c.hidden);
			report.ok(shown.length === 4, `${list}: four headings are painted`, shown.map(c => c.text).join('|'));
			// The defect, stated: no heading's ink may reach past its own box, so no heading can
			// touch the next one. Half a pixel is sub-pixel rounding.
			const spill = shown.filter(c => c.ink > c.right + 0.5);
			report.ok(spill.length === 0, `${list}: no heading paints outside its own column`,
				spill.map(c => `"${c.text}" ink ${c.ink} past ${c.right}`).join(', '));
			// And therefore none of them overlaps its neighbour, which is what "BeforeAfter" was.
			const touch = shown.filter((c, i) => i > 0 && c.left < shown[i - 1].ink - 0.5);
			report.ok(touch.length === 0, `${list}: ...so no heading runs into the next one`,
				touch.map(c => '"' + c.text + '"').join(', '));
			// The headings still sit on the boxes they name, at this width as well as the desktop's.
			if (cells.field) {
				const off = shown.map((c, i) => Math.abs(c.left - cells.field[i + 1].left))
					.reduce((x, y) => Math.max(x, y), 0);
				report.ok(off < 0.75, `${list}: every heading still starts where its box starts`,
					'worst ' + off.toFixed(2) + 'px');
			}
		}

		// ---- 3. THE PIPES TABLE HEADINGS -------------------------------------------------------
		await a.page.click('#lpn_setbox_close');
		await a.settle(300);
		await a.menuClick('Tables', 'project');
		await a.settle(700);
		await a.page.click('#lpn_pane_tab_pipes');
		await a.settle(500);
		const th = await words(a.page, '#lpn_pane_pipes thead th .lpn-pane-sort');
		report.ok(th.length === 10, 'the Pipes table has its ten headings', th.map(t => t.text).join('|'));
		const thSplit = th.filter(t => t.broken.length);
		report.ok(thSplit.length === 0, 'no Pipes heading is broken mid-word',
			thSplit.map(t => t.text + ' (' + t.broken.join(',') + ')').join(', '));
		const rough = th.find(t => /Rough/.test(t.text));
		report.ok(!!rough && rough.broken.length === 0,
			'...Roughness in particular, which is the one Tom read as "Roughnes/s, C"',
			rough ? rough.text + ' in ' + rough.width + 'px' : 'no such heading');

		// ---- 4. THE DESKTOP IS UNTOUCHED, which is the regression all three could cause ---------
		await a.page.setViewportSize(Session.VIEWPORT);
		await a.settle(700);
		await a.menuClick('Settings', 'project');
		await a.settle(700);
		const wide = await a.page.evaluate(() => {
			const links = [...document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')];
			const i = document.getElementById('lpn_setbox_index');
			return {
				rows: new Set(links.map(b => Math.round(b.getBoundingClientRect().top))).size,
				count: links.length,
				indexW: +i.getBoundingClientRect().width.toFixed(1)
			};
		});
		report.ok(wide.rows === wide.count,
			'on the desktop the index is still a column, one row per name',
			wide.rows + ' rows for ' + wide.count + ' names');
		report.ok(wide.indexW > 90, '...at the 6.6rem Tom settled on', wide.indexW + 'px');

		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.slice(0, 1).join(''));
	} finally {
		await a.context.close();
	}
};
