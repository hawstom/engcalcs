// The Scenario manager row of the Scenarios menu is greyed while Basic mode is on (Tom, 2026-10-13).
// A browser harness that needs the manager open calls ensure(page, label) first: when `label` is the
// manager's own, it unticks Basic mode through the menu's Basic mode row, as a person would. Language-free:
// Basic mode is the third row, after the two managers (the menu's order is Tom's, 2026-10-16).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
async function ensure(page, label) {
	const sm = await page.evaluate(() => (window.EngCalcs && EngCalcs.pageConfig || {}).lpn_sm_menu || '');
	if (!sm || String(label).trim() !== sm.trim()) { return; }
	await page.click('#lpn_scenario_btn');
	await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const rows = await page.$$('#lpn_menu_list button.lpn-menu-row');
	if (rows.length > 2 && await rows[0].isDisabled()) {
		await rows[2].click();
		await page.waitForTimeout(700);
	} else {
		await page.keyboard.press('Escape');
		await page.evaluate(() => { document.body.click(); });
		await page.waitForTimeout(200);
	}
}
module.exports = { ensure };
