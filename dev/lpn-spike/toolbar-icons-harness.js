// The icon-only toolbar, as a SOURCE invariant — dev/toolbar-icons.md. Run with:
//   node dev/lpn-spike/toolbar-icons-harness.js
//
// dev/browser-pass/specs/toolbar.js measures the rendered strip and is the stronger check; this one
// exists because it is free, runs in check_all.sh, and catches the single mistake that would put a
// nameless button on the strip: building one with setLabel() instead of setIconLabel().
//
// **A BUTTON WHOSE ONLY CONTENT IS AN aria-hidden <svg> HAS NO ACCESSIBLE NAME AT ALL.** Before this
// change every toolbar button's name came from its text node; setIconLabel() is the one function
// that moves that name to `aria-label`, puts it at the head of `title`, and adds the `.ec-help` that
// EngCalcs.initTips() needs. A call site that does three of those four is the failure mode, so the
// rule is not "do these four things" but "go through the one function".

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const lib = fs.readFileSync(path.join(ROOT, 'js', 'Calculators.lib.js'), 'utf8');
const en = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
const icons = fs.readFileSync(path.join(ROOT, 'lib', 'Icons.lib.php'), 'utf8');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function fnBody(text, name) {
	// Matches both `function name(` and `X.name = function (`, which is how the two files declare
	// the same kind of thing.
	let at = text.indexOf('function ' + name + '(');
	if (at < 0) { at = text.indexOf(name + ' = function'); }
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = text.indexOf('{', at), depth = 0, end = i;
	for (; end < text.length; end++) {
		if (text[end] === '{') { depth++; }
		else if (text[end] === '}') { depth--; if (!depth) { break; } }
	}
	return text.slice(i, end + 1);
}
const strip = (s) => s.replace(/^[ \t]*\/\/.*$/gm, '');

console.log('\n-- the seam --');
{
	const seam = fnBody(lib, 'EngCalcs.setIconLabel');
	report(/aria-label/.test(seam), 'setIconLabel() sets an aria-label');
	report(/el\.title =/.test(seam), '...and a title');
	report(/ec-help/.test(seam), '...and .ec-help, which is the only selector initTips() wires');
	report(/textContent = ''/.test(seam) && /iconEl\(/.test(seam), '...and replaces the text with the icon');
	report(/lpn_tip_join/.test(seam), 'the name/tip separator is a translated string, not punctuation in the code');
	// setLabel() must NOT have learned to drop the word: it also builds the menu bar, the menu rows
	// and the map symbols, all of which keep their text.
	const plain = fnBody(lib, 'EngCalcs.setLabel');
	report(/createTextNode\(text\)/.test(plain) && !/aria-label/.test(plain),
		'setLabel() is untouched — the menus keep their words');
}

console.log('\n-- every toolbar button goes through it --');
{
	const bar = strip(fnBody(src, 'wireToolbar'));
	report(!/\bsetLabel\(/.test(bar), 'wireToolbar() never calls setLabel()',
		(bar.match(/setLabel\([^)]*\)/g) || []).join(' | '));
	const made = (bar.match(/document\.createElement\('button'\)/g) || []).length;
	const named = (bar.match(/setIconLabel\(/g) || []).length;
	// modeButton() names every mode button through one call, so the counts differ by the tools.
	report(named >= 1 && made >= 1, 'it builds buttons and names them', `${made} built, ${named} setIconLabel call sites`);
	const mb = strip(fnBody(src, 'modeButton'));
	report(/setIconLabel\(/.test(mb), 'the mode buttons are named through it too');
	// The time transport is built in js/lpn-time.js, and it must be named through THIS file's
	// wrapper rather than EngCalcs.setIconLabel: only the wrapper records a button in
	// toolbarIconIndex, and Help > "What the toolbar icons mean" is derived from that record.
	// **THE SECOND ARGUMENT IS THE ASSERTION; THE FIRST IS NOT.** This read `group(), setIconLabel`
	// until Task 462 put the transport into the shared water-network group beside Libraries and
	// Settings, at which point the container became a named variable and this failed on a change
	// that had nothing to do with what it guards. Which container it is handed is the toolbar's
	// business; which naming wrapper it is handed is this check's.
	report(/lpnTimeMountToolbar\([A-Za-z0-9_()]+, setIconLabel\)/.test(bar),
		'the time transport is mounted with this file\'s own setIconLabel, so it reaches the Help guide');
	// Profile is a toolbar button as well as a View menu row (Tom, 2026-08-18: "I like that the
	// command is under the View menu" -- two doors, one implementation).
	report(/setIconLabel\([^)]*'profile'/.test(bar), 'the profile has a button, drawn with the profile icon');
	// **THE LABELS BUTTON IS GONE** (Tom: "We can remove this button now ... all project settings
	// are in (tada!) Settings"). Asserted so it is not reflexively restored: every other route to
	// the label controls -- View > Labels, the colour legend, the Settings button -- still opens the
	// same box on the same section.
	report(!/'labels'/.test(bar), 'and no Labels button, whose box has its own button two icons away');
	// **NO DROPDOWN IS BUILT HERE.** Task 427 moved the colour fields off the strip because a
	// field-name dropdown was the one control it could not shrink. The transport's two are the
	// exception that names itself: a step selector and a speed, both width-capped below.
	report(!/createElement\('select'\)/.test(bar), 'and wireToolbar() builds no dropdown of its own');
}

console.log('\n-- the time transport on the strip --');
{
	const t = fs.readFileSync(path.join(ROOT, 'js', 'lpn-time.js'), 'utf8');
	const mount = strip(fnBody(t, 'EC.lpnTimeMountToolbar'));
	// Five controls, the set Tom named: play/pause, speed, step back, step forward, step selector.
	report(/ui\.prev =/.test(mount) && /ui\.play =/.test(mount) && /ui\.next =/.test(mount) &&
		/ui\.step =/.test(mount) && /ui\.speed =/.test(mount), 'all five controls are built');
	// **AND RUN, WHICH IS NOT ONE OF THEM** (Task 248, 2026-08-19). The other five change which
	// moment you are looking at; this one works the moments out. It goes through the same btn()
	// helper, so it reaches the Help guide through js/looped-network.js's own setIconLabel like
	// everything else on the strip -- and it carries a TIP, which no other button in this group
	// does, because "Run" alone does not say what is run or how far.
	report(/ui\.run = btn\('run'/.test(mount), 'the Run button is built through the same helper');
	report(/S\.runTip/.test(mount), '...and is the one control here that carries a tip');
	report(/'run'\s*=>/.test(icons), 'run is in lib/Icons.lib.php');
	['lpn_time_run', 'lpn_time_run_tip', 'lpn_time_run_note'].forEach(function (k) {
		report(en.indexOf("$ec_lang['" + k + "']") >= 0, k + ' is in lib/lang.ec.en.php');
	});
	// A select gets no .ec-help (a tip in front of a dropdown is a tip in the way of it), so its
	// accessible name has to come from an explicit aria-label -- a select named only by its title
	// has a weak, browser-dependent name and there is no visible label on an icon-only strip.
	const pick = strip(fnBody(t, 'picker'));
	report(/setAttribute\('aria-label'/.test(pick), 'each dropdown carries an explicit aria-label');
	report(/max-width:/.test(pick) && !/ec-help/.test(pick),
		'...and is width-capped, and not given .ec-help');
	// The transport is NOT hidden or disabled on a one-step network (Tom: "We can show the time play
	// controls at all times even if there is only one time step"). lpnReportTimes() never returns an
	// empty list, so the mount has nothing to test and must not grow a test.
	report(!/lpnTimeIsExtended/.test(mount), 'and nothing in the mount asks whether the network runs over time');
	// **THE TRANSPORT GLYPHS CAME HOME.** They were briefly registered from js/lpn-time.js, only
	// where lib/Icons.lib.php had nothing, because a toolbar button with no <svg> fails the browser
	// pass and the feature could not ship dark while they were being drawn. They landed the same day,
	// so the rule now is the plain one every other icon obeys: geometry lives in the PHP set and
	// nowhere else.
	report(!/PENDING_ICONS|registerPendingIcons/.test(t),
		'js/lpn-time.js registers no icon of its own — the PHP set is the only source');
	['play', 'pause', 'step-back', 'step-fwd'].forEach(function (name) {
		report(new RegExp("'" + name + "'\\s*=>").test(icons), name + ' is in lib/Icons.lib.php', '');
	});
}

console.log('\n-- the Help list is DERIVED from the strip --');
{
	report(/toolbarIconIndex\.push/.test(fnBody(src, 'setIconLabel')),
		'setIconLabel() records each button, so the list cannot drift from the strip');
	const guide = strip(fnBody(src, 'iconGuideRows'));
	report(/toolbarIconIndex\.map/.test(guide), 'the guide is built from that record, not from a second list');
	report(/lpn_help_icons/.test(src), 'and Help carries a row for it');
	// **AND THAT ROW MUST BE A SUBMENU, NOT AN ACTION** (Tom, 2026-08-18: it "does nothing"). As an
	// action it called openMenu() at level 0 on #lpn_menu_help -- the anchor the Help menu it was
	// clicked in was already open on -- so openMenu()'s same-anchor toggle branch closed the menu
	// instead of showing the guide. A `submenu` row is a fly-out and cannot hit that branch.
	report(/lpn_help_icons[^\n]*submenu: iconGuideRows/.test(src),
		'the Help row is a submenu, so it cannot re-open its own anchor and toggle itself shut');
}

console.log('\n-- the strings exist, in English only --');
{
	['lpn_tip_join', 'lpn_tool_add_junction_tip', 'lpn_tool_add_tank_tip', 'lpn_tool_add_valve_tip',
		'lpn_tool_delete_tip', 'lpn_tool_undo_tip', 'lpn_tool_zoom_extent_tip', 'lpn_tool_settings_tip',
		'lpn_find_menu_tip', 'lpn_help_icons', 'lpn_pane_right_toggle', 'lpn_pane_right_toggle_tip'
	].forEach((k) => {
		report(en.indexOf("$ec_lang['" + k + "']") >= 0, k);
	});
	// Rule B is blind on this path: these reach aria-label through pageConfig in JS, which
	// plainTextBoundKeys() cannot see. So no tag may appear in any of them, and this is the only
	// thing that would catch it.
	const tips = en.split('\n').filter(l => /^\$ec_lang\['lpn_(tool_.*_tip|tip_join|find_menu_tip|pane_right_toggle.*)'\]/.test(l));
	report(tips.length >= 10 && !tips.some(l => /<[a-z]/i.test(l)),
		'and none of them carries a tag — plainTextBoundKeys() cannot see this path');
}

// **THE MENU BAR IS NOT THE TOOLBAR, and the two rules are opposite** (ROADMAP Tasks 499.01, 499.02).
// A toolbar button is icon-ONLY and must therefore go through setIconLabel(); a menu-bar item keeps
// its word, so it goes through setLabel() and the icon is a prefix. What this section guards is the
// two places that convention was incomplete: the Scenario readout had no icon at all, and no
// menu-bar item could carry a tip because nothing wired one.
console.log('\n-- the scenario control carries the shared icon --');
{
	const st = strip(fnBody(src, 'refreshScenarioStatus'));
	report(/setLabel\(btn, 'scenarios'/.test(st),
		'refreshScenarioStatus() builds the readout through setLabel() with the scenarios icon');
	// The readout is rebuilt on every scenario switch and every override, so a bare textContent
	// assignment anywhere in here would wipe the icon on the first change.
	report(!/btn\.textContent =/.test(st),
		'...and never assigns textContent, which would drop the icon on the next refresh');
	report(/'scenarios'\s*=>/.test(icons), 'scenarios is in lib/Icons.lib.php, the one icon set');
	// Geometry in the PHP set and nowhere else -- the same rule the transport glyphs came home to.
	report(!/<rect x="16\.5"|M13\.5 5\.5/.test(src),
		'and js/looped-network.js draws no path of its own for it');
}

console.log('\n-- the Project menu carries a tip --');
{
	const bar = strip(fnBody(src, 'buildMenuBar'));
	report(/tip: pc\.lpn_menu_project_tip/.test(bar), 'the Project item declares a tip');
	report(/b\.title = m\.tip/.test(bar), '...and buildMenuBar() puts it on the button as a title');
	report(/ec-help/.test(bar), '...with .ec-help, the only selector initTips() wires');
	// initTipsIn(), not EngCalcs.initTips(): the seam gained an orphaned-tip sweep on 2026-09-02.
	report(/initTipsIn\(bar\)/.test(bar),
		'...and arms it, because the bar is built after page load and a tip built late is dead on touch');
	report(en.indexOf("$ec_lang['lpn_menu_project_tip']") >= 0,
		'lpn_menu_project_tip is in lib/lang.ec.en.php');
	const line = en.split('\n').find(l => l.indexOf("$ec_lang['lpn_menu_project_tip']") === 0);
	report(!!line && !/<[a-z]/i.test(line),
		'...and carries no tag -- it reaches a title= through pageConfig, where Rule B cannot see it');
	const page = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
	report(page.indexOf('lpn_menu_project_tip:') >= 0, '...and is bridged into pageConfig');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
