// The dockable boxes of the looped-network page, and how a visitor opens and docks each one, shared by
// dock-memory-harness.js, dock-default-harness.js and workspace-browser-harness.js. Menu rows are named
// by language KEY, never by their English.
'use strict';

// Each box, with how a visitor opens it: [menu, flyout row key or null, row key] or 'node'.
const OPENERS = {
	lpn_energy_box: ['project', 'lpn_reports_menu', 'lpn_energy_menu'],
	lpn_scncmp_box: ['project', 'lpn_reports_menu', 'lpn_scncmp_title'],
	lpn_rptbox: ['project', 'lpn_reports_menu', 'lpn_reports_epanet'],
	lpn_status_box: ['project', 'lpn_reports_menu', 'lpn_reports_status'],
	lpn_calib_box: ['project', 'lpn_reports_menu', 'lpn_reports_calib'],
	lpn_full_box: ['project', 'lpn_reports_menu', 'lpn_reports_full'],
	lpn_alt_box: ['project', 'lpn_scenario_menu', 'lpn_alt_title'],
	lpn_settings_box: ['project', null, 'lpn_tool_settings'],
	lpn_popup: 'node',
	lpn_find_popup: ['edit', null, 'lpn_find_menu'],
	lpn_library_box: ['project', null, 'lpn_library_menu'],
	lpn_contour_box: ['project', 'lpn_graphs_menu', 'lpn_contour_menu'],
	lpn_ff_box: ['project', 'lpn_analyze_menu', 'lpn_ff_menu'],
	lpn_crit_box: ['project', 'lpn_analyze_menu', 'lpn_crit_menu'],
	lpn_ds_box: ['project', 'lpn_analyze_menu', 'lpn_ds_menu'],
	lpn_notes_popup: ['help', null, 'lpn_help_notes']
};

const strips = (page) => page.evaluate(() => ['left', 'right'].map((s) =>
	Array.from(document.querySelectorAll('#lpn_dock_strip_' + s + ' .lpn-dock-tab')).map((t) => t.getAttribute('aria-controls'))));

async function clickNode(a) {
	const at = await a.page.evaluate(() => {
		const ns = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)')).filter((c) => {
			const r = c.getBoundingClientRect();
			const e = r.width > 0 ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
			return !!e && !e.closest('.lpn-dock-strip, .lpn-popover');
		});
		const r = ns[Math.floor(ns.length / 2)].getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	});
	await a.page.mouse.click(at.x, at.y);
	await a.settle(600);
}
async function openBox(a, id) {
	const o = OPENERS[id];
	if (o === 'node') { await clickNode(a); return; }
	if (o[1]) { await a.menuClickSub(await a.lang(o[1]), await a.lang(o[2]), o[0]); }
	else { await a.menuClick(await a.lang(o[2]), o[0]); }
	await a.settle(500);
}
// Open the box, dock it on `side`, and turn on Auto-hide, by its own corner buttons.
async function dockHidden(a, id, side) {
	await openBox(a, id);
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="' + side + '"]', { timeout: 4000 });
	await a.settle(200);
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="autohide"]', { timeout: 4000 });
	await a.settle(300);
}

module.exports = { OPENERS, strips, clickNode, openBox, dockHidden };
