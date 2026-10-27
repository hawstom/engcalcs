// THE AUDIT EVERY CONVERTED BOX MUST PASS (ROADMAP Task 828, Tom 2026-10-25: "this went seriously
// wrong"). Shared by properties-rows-browser-harness.js and box-grid-browser-harness.js.
//
// The first harness inspected only the `.lpn-gname` children of one box and never looked at what stood
// beside them, so a box with an ID row, a Text's words, a row of buttons and two headings outside the
// grid passed. This one starts from the CONTROLS: it walks every visible control in the box and asks
// where it sits. Per box it states, in a real Chromium at 1366 x 768:
//   1. every visible control stands in the value column (the left edge of the grid's value track,
//      +-2 px), except a control in a unit cell, a table's own, the report buttons another branch owns,
//      and a control named in `skip`;
//   2. every name starts at the one name x (+-2 px);
//   3. no name is ellipsised (scrollWidth > clientWidth, or text-overflow: ellipsis in force). A name
//      may wrap (Tom, 2026-10-26: "wrap, even mid-word, is fine"); it is never cut;
//   4. number boxes that hold the same number of digits share one width (+-1 px);
//   5. the box does not scroll sideways.
'use strict';

// Runs in the page. `spec` = { root, skip, wrapOk } -- `wrapOk` names the one name a box of fixed width
// is allowed to wrap at a space, as a last resort (Contour's "Buffer (x median pipe length)").
function auditInPage(spec) {
	const root = document.querySelector(spec.root);
	if (!root) { return { missing: true }; }
	const R = (e) => e.getBoundingClientRect();
	const vis = (e) => {
		const r = R(e), cs = getComputedStyle(e);
		return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden]') &&
			!(e.closest('.lpn-gsr, .lpn-gtitle-sr'));
	};
	const mode = (xs) => {
		const c = {};
		xs.forEach((x) => { const k = Math.round(x); c[k] = (c[k] || 0) + 1; });
		let best = null;
		Object.keys(c).forEach((k) => { if (best === null || c[k] > c[best]) { best = k; } });
		return best === null ? null : +best;
	};
	const skip = (spec.skip || []).join(',');
	const names = Array.from(root.querySelectorAll('.lpn-gname')).filter(vis).filter((e) => !(skip && e.closest(skip)));
	const vals = Array.from(root.querySelectorAll('.lpn-gval')).filter(vis).filter((e) => !(skip && e.closest(skip)));
	const nameX = mode(names.map((e) => R(e).left)), valX = mode(vals.map((e) => R(e).left));
	// The Value cell's left edge is the right edge of the Label cell; a control stands inside it, up to its own
	// margin (8 px) from that edge, and a run of buttons at it.
	const cellX = mode(names.map((e) => R(e).right));
	// Every control a person can put a hand on.
	const ctrls = Array.from(root.querySelectorAll('input, select, textarea, button')).filter(vis).filter((e) => {
		if (e.type === 'hidden') { return false; }
		if (e.closest('.lpn-gsplit, table, .lpn-box-tools, .lpn-popover-x, .lpn-ovm, .lpn-corner-btn, .lpn-setbox-title, .lpn-pgraph-chart, canvas, svg')) { return false; }
		if (skip && e.closest(skip)) { return false; }
		return true;
	});
	// A run of buttons or ticks is ONE thing in the value column: its group starts there, and its
	// later members follow the first.
	const GROUPS = '.lpn-gwrap, .lpn-ff-buttons, .lpn-gbtns, .lpn-find-filter, .lpn-new-actions, .lpn-new-presets, .lpn-scnres-controls';
	const groups = Array.from(root.querySelectorAll(GROUPS)).filter(vis).filter((g) => !(skip && g.closest(skip)));
	const lead = (e) => { const g = e.closest(GROUPS); return g && Array.from(g.querySelectorAll('input, select, textarea, button')).filter(vis)[0] !== e; };
	// A control that SPANS the grid (a Text's words, which fills the box on Tom's word of 2026-10-15) starts
	// at the name column instead; it is checked there.
	const spans = (e) => !!e.closest('.lpn-gspan, .lpn-gspan2') || e.classList.contains('lpn-gspan2');
	const offSpan = ctrls.filter((e) => spans(e) && Math.abs(R(e).left - nameX) > 2).map((e) => 'span ' + (e.className || e.nodeName) + '@' + Math.round(R(e).left - nameX));
	const offGrid = offSpan.concat(ctrls.filter((e) => !spans(e) && !lead(e) && (R(e).left - cellX < -2 || R(e).left - cellX > 8)).map((e) =>
		(e.id || e.getAttribute('aria-label') || e.className || e.nodeName) + '@' + Math.round(R(e).left - cellX)))
		.concat(groups.filter((g) => (R(g).left - cellX < -2 || R(g).left - cellX > 8)).map((g) => 'group ' + g.className + '@' + Math.round(R(g).left - cellX)));
	const offName = names.filter((e) => Math.abs(R(e).left - nameX) > 2).map((e) => e.textContent.trim().slice(0, 24) + '@' + Math.round(R(e).left - nameX));
	const ellipsis = [], wrapped = [];
	names.forEach((e) => {
		const cs = getComputedStyle(e), t = e.textContent.trim().slice(0, 40);
		const inner = e.querySelector('.lpn-gtext');
		const clipped = (x) => x.scrollWidth > x.clientWidth + 1 || getComputedStyle(x).textOverflow === 'ellipsis' && x.scrollWidth > x.clientWidth;
		if (clipped(e) || (inner && clipped(inner))) { ellipsis.push(t); }
		const fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) || fs * 1.25;
		if (R(e).height > lh * 1.45 + 1 && !(spec.wrapOk || []).some((w) => t.indexOf(w) === 0)) { wrapped.push(t + ' h' + Math.round(R(e).height)); }
	});
	// Like boxes: the number boxes holding the same digit count are one width.
	const byD = {};
	Array.from(root.querySelectorAll('input.lpn-gw-num')).filter(vis).forEach((e) => {
		const d = e.style.getPropertyValue('--d') || '?';
		(byD[d] = byD[d] || []).push(Math.round(R(e).width * 10) / 10);
	});
	const unlike = Object.keys(byD).filter((d) => Math.max.apply(null, byD[d]) - Math.min.apply(null, byD[d]) > 1).map((d) => d + ':' + byD[d].join('/'));
	return {
		nameX, valX, names: names.length, vals: vals.length, ctrls: ctrls.length, offGrid, offName, ellipsis, wrapped, unlike, byD,
		scroll: root.scrollWidth - root.clientWidth, beside: valX - nameX
	};
}

// `ok(label, cond, detail)` is the caller's recorder. Returns the measurements.
async function auditBox(page, spec, ok, tag) {
	const m = await page.evaluate(auditInPage, spec);
	ok(tag + ' shows rows and controls', !m.missing && m.vals > 0 && (m.ctrls > 0 || spec.noControls), m.missing ? 'no ' + spec.root : (m.vals + ' values, ' + m.ctrls + ' controls'));
	if (m.missing || !m.vals) { return m; }
	ok(tag + ': every visible control stands in the value column', m.offGrid.length === 0, JSON.stringify(m.offGrid));
	ok(tag + ': every name starts at one x', m.offName.length === 0, JSON.stringify(m.offName));
	ok(tag + ': no name is ellipsised', m.ellipsis.length === 0, JSON.stringify(m.ellipsis));
	ok(tag + ': like number boxes share a width', m.unlike.length === 0, JSON.stringify(m.unlike));
	ok(tag + ': the value stands beside its name, not under it', m.beside >= 20, String(m.beside));
	ok(tag + ': does not scroll sideways', m.scroll <= 1, String(m.scroll));
	return m;
}

// THE PHONE (390 x 844). Tom 2026-10-25, of the first pass: a box that does not scroll sideways can still be
// unusable: a Description 30 px wide, a pull-down showing one letter, a name
// one character a line. Here every visible control is a usable width, none is cut by the box's right edge,
// and no name wraps to one character a line.
function phoneInPage(spec) {
	const root = document.querySelector(spec.root);
	if (!root) { return { missing: true }; }
	const R = (e) => e.getBoundingClientRect();
	const vis = (e) => { const r = R(e), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
	const box = root.closest('.lpn-popover, .lpn-dialog, #lpn_dialog') || root, edge = R(box).right;
	const skip = (spec.skip || []).join(',');
	const ctrls = Array.from(root.querySelectorAll('input, select, textarea, button')).filter(vis).filter((e) =>
		e.type !== 'hidden' && !e.closest('table, .lpn-popover-x, .lpn-ovm, .lpn-gsplit, .lpn-corner-btn, .lpn-box-tools, .lpn-pgraph-chart, canvas, svg') && !(skip && e.closest(skip)));
	const em = (e) => parseFloat(getComputedStyle(e).fontSize);
	const tooNarrow = ctrls.filter((e) => {
		const w = R(e).width, t = e.type;
		if (t === 'checkbox' || t === 'radio' || e.tagName === 'BUTTON') { return false; }
		// A box sized to its digits (3 digits for a percentage) is as narrow as its design; it still holds them.
		return e.tagName === 'SELECT' ? w < 6 * em(e) : w < (e.classList.contains('lpn-gw-num') ? 2.8 : 4) * em(e);
	}).map((e) => (e.id || e.className || e.tagName) + ':' + Math.round(R(e).width));
	const clipped = ctrls.filter((e) => R(e).right > edge - 1).map((e) => (e.id || e.className || e.tagName) + ':' + Math.round(R(e).right - edge));
	const oneChar = Array.from(root.querySelectorAll('.lpn-gname, .lpn-gspan, .lpn-ff-note, p')).filter(vis).filter((e) => {
		const t = e.textContent.trim(); if (t.length < 4) { return false; }
		const lh = (parseFloat(getComputedStyle(e).lineHeight) || em(e) * 1.25);
		const lines = R(e).height / lh;
		return (lines >= 3 && lines > t.length * 0.5) || (R(e).width < 1.2 * em(e) && lines >= 2);
	}).map((e) => e.textContent.trim().slice(0, 16));
	return { tooNarrow, clipped, oneChar, n: ctrls.length, scroll: root.scrollWidth - root.clientWidth };
}
async function auditPhone(page, spec, ok, tag) {
	const m = await page.evaluate(phoneInPage, spec);
	ok(tag + ' (phone): has controls', !m.missing && m.n > 0, m.missing ? 'no ' + spec.root : String(m.n));
	if (m.missing) { return m; }
	ok(tag + ' (phone): every control is a usable width', m.tooNarrow.length === 0, JSON.stringify(m.tooNarrow));
	ok(tag + ' (phone): nothing is cut by the right edge', m.clipped.length === 0, JSON.stringify(m.clipped));
	ok(tag + ' (phone): no name or unit wraps to a character a line', m.oneChar.length === 0, JSON.stringify(m.oneChar));
	ok(tag + ' (phone): no sideways scroll', m.scroll <= 1, String(m.scroll));
	return m;
}

module.exports = { auditInPage, auditBox, phoneInPage, auditPhone };
