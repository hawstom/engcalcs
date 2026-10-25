// A box's NATURAL WIDTH, measured in the page: the narrowest width at which its content is drawn
// as it would be with all the room in the world. Used by dock-width-harness.js to hold each docked
// box's width (LPN_DOCK_OPTIMAL_REM in js/looped-network.js) to what that box actually holds.
//
// The box is set to every width from `lo` to `hi` in `step` px. At each width three things are
// read, with prose paragraphs, pictures and charts left out (a paragraph wraps at any width and a
// chart stretches to any width, so neither says how wide a box needs to be):
//   - sideways scrolling: any scroller inside the box wider than its own window;
//   - wrapped short text: line count of every short text (a label, a heading, a table cell, a button);
//   - height: the scroll height of the box and its scrollers, and of its innermost scrollers alone,
//     which catches a row of controls that has dropped onto two lines, where no single text wraps.
// The natural width is the first at which nothing scrolls sideways, short text wraps at most two
// lines more than at `hi`, and each height is at most 2% (plus 8 px) more than at `hi`.
//
// `hide` (a selector) leaves out what the box lets reflow or scroll inside its own container.
//
// Pass it to page.evaluate as a string: `(${naturalWidth.toString()})(${JSON.stringify({ id })})`.
'use strict';

function naturalWidth(arg) {
	const id = arg.id, lo = arg.lo || 240, hi = arg.hi || 1400, step = arg.step || 8;
	const box = document.getElementById(id);
	if (!box) { return { error: 'no #' + id }; }
	const saved = box.getAttribute('style') || '';
	const CELL = /^(TD|TH|LABEL|BUTTON|PRE)$/;
	const ownText = (e) => { let t = 0; e.childNodes.forEach((n) => { if (n.nodeType === 3) { t += n.textContent.trim().length; } }); return t; };
	const isProse = (e) => !CELL.test(e.tagName) && ownText(e) > 60;
	const texts = [];
	const walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
	let n;
	while ((n = walk.nextNode())) {
		const p = n.parentElement;
		if (!n.textContent.trim() || !p || p.closest('option, select, script, style, title, svg, .lpn-box-corner, .lpn-setbox-title')) { continue; }
		let prose = false;
		for (let e = p; e && e !== box; e = e.parentElement) {
			if (isProse(e)) { prose = true; break; }
			if (CELL.test(e.tagName)) { break; }
		}
		if (!prose) { texts.push(n); }
	}
	const st = document.createElement('style');
	const skip = arg.hide ? Array.from(box.querySelectorAll(arg.hide)) : [];
	st.textContent = '.ecw-measure-hide { display: none !important; }';
	document.head.appendChild(st);
	const hidden = [];
	box.querySelectorAll('*').forEach((e) => {
		if ((/^(svg|canvas|img)$/i.test(e.tagName) && !e.closest('.lpn-box-corner')) || isProse(e) || skip.indexOf(e) >= 0) { e.classList.add('ecw-measure-hide'); hidden.push(e); }
	});
	const notField = (e) => !/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName) && !e.closest('svg');
	const scrollersX = Array.from(box.querySelectorAll('*')).filter((e) => notField(e) && /auto|scroll|hidden/.test(getComputedStyle(e).overflowX));
	const scrollersY = Array.from(box.querySelectorAll('*')).filter((e) => notField(e) && /auto|scroll/.test(getComputedStyle(e).overflowY));
	const visible = (t) => { const r = t.parentElement.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
	const linesOf = (t) => {
		const rg = document.createRange(), tops = new Set();
		rg.selectNodeContents(t);
		Array.from(rg.getClientRects()).forEach((r) => { if (r.width > 0) { tops.add(Math.round(r.top)); } });
		return tops.size;
	};
	const lines = () => texts.reduce((c, t) => c + (visible(t) ? linesOf(t) : 0), 0);
	// A 1 px clipped element (a screen-reader-only copy) is not a box scrolling sideways.
	const over = () => scrollersX.filter((e) => e.clientWidth > 1 && e.scrollWidth > e.clientWidth + 1)
		.map((e) => e.tagName + (e.id ? '#' + e.id : '') + ' ' + e.scrollWidth + '>' + e.clientWidth);
	// Two heights, and the content must settle in both: the box's own plus every visible scroller's
	// (a row that drops a line anywhere), and the innermost scrollers' alone (the same row inside a
	// long pane, where the first sum is too large for one line to show against it).
	const height = () => {
		const live = scrollersY.filter((e) => e.clientHeight > 0);
		const inner = live.filter((e) => !live.some((o) => o !== e && e.contains(o)));
		return [live.reduce((s, e) => s + e.scrollHeight, box.scrollHeight),
			inner.length ? inner.reduce((s, e) => s + e.scrollHeight, 0) : box.scrollHeight];
	};
	const settled = (h, ref) => h.every((x, i) => x <= ref[i] * 1.02 + 8);
	const at = (W) => {
		box.style.setProperty('width', W + 'px', 'important');
		box.style.setProperty('min-width', '0', 'important');
		box.style.setProperty('max-width', 'none', 'important');
		return { l: lines(), o: over(), h: height() };
	};
	let natural = null, firstClean = null, why = [], ref = null;
	const curve = [];
	try {
		ref = at(hi);
		for (let W = lo; W <= hi; W += step) {
			const r = at(W);
			if (arg.curve) { curve.push([W, r.l, r.h, r.o.length]); if (natural !== null) { continue; } }
			if (r.o.length === 0 && firstClean === null) { firstClean = W; }
			if (natural === null && r.o.length === 0 && r.l <= ref.l + 2 && settled(r.h, ref.h)) { natural = W; if (!arg.curve) { break; } }
		}
		// What still wraps or scrolls one step narrower: the content that sets this width.
		if (natural !== null && natural > lo) {
			at(natural - step);
			texts.forEach((t) => { if (visible(t) && linesOf(t) > 1) { why.push(t.textContent.trim().slice(0, 32)); } });
			why = why.concat(over());
		}
	} finally {
		hidden.forEach((e) => e.classList.remove('ecw-measure-hide'));
		st.remove();
		box.setAttribute('style', saved);
	}
	return { natural: natural, firstClean: firstClean, why: why.slice(0, 4), ref: ref && [ref.l, ref.h], curve: arg.curve ? curve : undefined };
}

module.exports = { naturalWidth };
