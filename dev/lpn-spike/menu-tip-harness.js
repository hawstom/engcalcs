// A MENU'S OWN TIP MUST NOT COVER THE MENU. Run with:
//   node dev/lpn-spike/menu-tip-harness.js
//
// Tom, 2026-09-12, exploring the app on librewaternet.org: *"When I am exploring LWN/app and I click
// the Water menu, its tip opens and obscures my view of the menu items. I don't know what we should
// do about this, but it's embarrassing and annoying. I note that it's the only menu that has a tip.
// But it's an important tip. Maybe it can disable while the menu is open."*
//
// **WHY IT IS INVISIBLE FROM IN HERE, which is why it needed a harness rather than a rule.** The
// tip is a native `title` attribute and the browser draws the tooltip ITSELF, above the page, near
// the pointer, after a hover delay nothing in our code controls. The markup is correct, the menu is
// correct, no CSS can reach the tooltip, and every harness in this directory reads a DOM that has
// no such layer. So the only way to see it is to be a person hovering a real button -- and the only
// way to keep it fixed is to assert the mechanism instead: while a menu is open, its anchor carries
// no title.
//
// **THE TIP IS PARKED, NOT DELETED**, and that distinction is the whole of Task 499.02: Water is
// this page's own invention rather than a word every application uses, so the tip is the answer to
// "what is in here" -- a question somebody has BEFORE they open it and never after.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { loadLoopedNetwork } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// The stub models a removed attribute as undefined where a browser gives the empty string. Either
// is "no tooltip"; asserting on truthiness is what both have in common.
function hasTip(el) { return !!el.title; }

const L = loadLoopedNetwork(
	"\t\topenMenu: openMenu, closeMenu: closeMenu, closeSubMenu: closeSubMenu,\n"
);

function anchor(tip) {
	const b = document.createElement('button');
	if (tip) { b.title = tip; b.className = 'ec-help'; }
	return b;
}
const ROWS = [{ label: 'Row', fn: function () {} }];
const WATER = 'Everything unique about this application is here in one place.';

// ================================================================================================
// 1. THE PULL-DOWN
// ================================================================================================
console.log('\n--- a tip is away while its own menu stands over it ---');
{
	const bar = anchor(WATER);
	ok('the button starts with its tip', hasTip(bar), JSON.stringify(bar.title));
	L.openMenu(bar, ROWS);
	ok('...which is gone while the menu is open', !hasTip(bar), JSON.stringify(bar.title));
	L.closeMenu();
	ok('...and back, unchanged, the moment it closes', bar.title === WATER, JSON.stringify(bar.title));
}

console.log('\n--- every way a menu closes gives the tip back ---');
{
	// Clicking the same button again is openMenu()'s own toggle branch, which returns through
	// closeMenu() before it ever reaches the parking. A tip left parked here would never come back.
	const bar = anchor(WATER);
	L.openMenu(bar, ROWS);
	L.openMenu(bar, ROWS);   // the second click: toggle shut
	ok('the toggle-shut path restores it', bar.title === WATER, JSON.stringify(bar.title));
}
{
	// Moving to a NEIGHBOURING menu does not go through closeMenu() at all -- openMenu() simply
	// re-anchors. Without unparking first, File would take the pull-down and Water would keep a
	// tooltip it no longer has a menu for.
	const water = anchor(WATER), file = anchor('');
	L.openMenu(water, ROWS);
	L.openMenu(file, ROWS);
	ok('opening a different menu restores the one left behind',
		water.title === WATER, JSON.stringify(water.title));
	ok('...and the newly opened one is parked if it has a tip to park', !hasTip(file));
	L.closeMenu();
}

// ================================================================================================
// 2. THE FLY-OUT IS ITS OWN LEVEL
// ================================================================================================
// A submenu closes on its own, while the pull-down that spawned it stays open. One shared slot
// would hand the menu-bar button its tooltip back over its own still-open menu, which is the exact
// defect being fixed, one level up.
console.log('\n--- a fly-out parks and restores independently of its pull-down ---');
{
	const bar = anchor(WATER);
	const row = anchor('What this submenu holds');
	L.openMenu(bar, ROWS);
	L.openMenu(row, ROWS, 1);
	ok('both are parked while both are open', !hasTip(bar) && !hasTip(row));
	L.closeSubMenu();
	ok('closing the fly-out restores the ROW', row.title === 'What this submenu holds');
	ok('...and leaves the bar button parked, its menu still being open', !hasTip(bar));
	L.closeMenu();
	ok('and closing the pull-down finally restores that too', bar.title === WATER);
}

// ================================================================================================
// 3. THE CASES THAT MUST NOT THROW OR INVENT A TOOLTIP
// ================================================================================================
console.log('\n--- and nothing is invented ---');
{
	// Five of the six menu-bar items have no tip at all, so this is the common path.
	const plain = anchor('');
	L.openMenu(plain, ROWS);
	ok('a menu with no tip opens with nothing parked', !hasTip(plain));
	L.closeMenu();
	ok('...and closes without acquiring one', !hasTip(plain));

	// A menu row is rebuilt on every open, so the element parked a moment ago can be one nothing is
	// looking at any more -- and something else may have given it a title in between.
	const reused = anchor('first');
	L.openMenu(reused, ROWS);
	reused.title = 'something else set this';
	L.closeMenu();
	ok('a title set by somebody else while parked is not overwritten',
		reused.title === 'something else set this', JSON.stringify(reused.title));
}

// ================================================================================================
// 4. THE SOURCE SIDE: ONE DOOR, AND THE BAR STILL GOES THROUGH IT
// ================================================================================================
console.log('\n--- one door ---');
{
	const js = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	ok('the menu bar still puts its tip on the button as a title',
		/if \(m\.tip\) \{ b\.title = m\.tip; b\.className \+= ' ec-help'; \}/.test(js));
	ok('parking is per level, two slots', /var tipParked = \[null, null\];/.test(js));
	// openMenu parks and the two closers unpark. A third place doing either is a second opinion
	// about when a tooltip is allowed, which is how this comes back.
	// CALLS only -- the lookbehind drops the `function` that defines each, which is what made the
	// first version of these two assertions off by one in opposite directions.
	// The second lookbehind is not redundant: "unparkAnchorTip(" CONTAINS "parkAnchorTip(", so
	// without it every unpark counts as a park and this reads 5.
	const parkCalls = (js.match(/(?<!un)(?<!function )parkAnchorTip\(/g) || []).length;
	const unparkCalls = (js.match(/(?<!function )unparkAnchorTip\(/g) || []).length;
	ok('parkAnchorTip is called once, from openMenu', parkCalls === 1, String(parkCalls));
	ok('unparkAnchorTip is called three times: the two closers, and parkAnchorTip itself',
		unparkCalls === 3, String(unparkCalls));
	// The tip itself must still exist: "delete the tip" was never the fix.
	const en = fs.readFileSync(path.join(ROOT, 'lib/lang.ec.en.php'), 'utf8');
	ok('and lpn_menu_project_tip is still a defined string',
		/\$ec_lang\['lpn_menu_project_tip'\]='.+';/.test(en));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
