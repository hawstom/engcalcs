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
//   3. no name is ellipsised (scrollWidth > clientWidth, or text-overflow: ellipsis in force) and none
//      is wrapped (taller than one line) in English;
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
	// Every control a person can put a hand on.
	const ctrls = Array.from(root.querySelectorAll('input, select, textarea, button')).filter(vis).filter((e) => {
		if (e.type === 'hidden') { return false; }
		if (e.closest('.lpn-gunit, .lpn-gsplit, table, .lpn-box-tools, .lpn-popover-x, .lpn-ovm, .lpn-corner-btn, .lpn-setbox-title, .lpn-pgraph-chart, canvas, svg')) { return false; }
		if (skip && e.closest(skip)) { return false; }
		return true;
	});
	// A run of buttons or ticks is ONE thing in the value column: its group starts there, and its
	// later members follow the first.
	const GROUPS = '.lpn-ff-buttons, .lpn-gbtns, .lpn-find-filter, .lpn-new-actions, .lpn-new-presets, .lpn-scnres-controls';
	const groups = Array.from(root.querySelectorAll(GROUPS)).filter(vis).filter((g) => !(skip && g.closest(skip)));
	const lead = (e) => { const g = e.closest(GROUPS); return g && Array.from(g.querySelectorAll('input, select, textarea, button')).filter(vis)[0] !== e; };
	// A control that SPANS the grid (a Text's words, which fills the box on Tom's word of 2026-10-15) starts
	// at the name column instead; it is checked there.
	const spans = (e) => !!e.closest('.lpn-gspan, .lpn-gspan2') || e.classList.contains('lpn-gspan2');
	const offSpan = ctrls.filter((e) => spans(e) && Math.abs(R(e).left - nameX) > 2).map((e) => 'span ' + (e.className || e.nodeName) + '@' + Math.round(R(e).left - nameX));
	const offGrid = offSpan.concat(ctrls.filter((e) => !spans(e) && !lead(e) && Math.abs(R(e).left - valX) > 2).map((e) =>
		(e.id || e.getAttribute('aria-label') || e.className || e.nodeName) + '@' + Math.round(R(e).left - valX)))
		.concat(groups.filter((g) => Math.abs(R(g).left - valX) > 2).map((g) => 'group ' + g.className + '@' + Math.round(R(g).left - valX)));
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
	ok(tag + ': no name is wrapped', m.wrapped.length === 0, JSON.stringify(m.wrapped));
	ok(tag + ': like number boxes share a width', m.unlike.length === 0, JSON.stringify(m.unlike));
	ok(tag + ': the value stands beside its name, not under it', m.beside >= 20, String(m.beside));
	ok(tag + ': does not scroll sideways', m.scroll <= 1, String(m.scroll));
	return m;
}

module.exports = { auditInPage, auditBox };
