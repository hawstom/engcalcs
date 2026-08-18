<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['lpn_main_title'];
$html_desc = $ec_lang['lpn_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2 id="ec-page-desc"><?=$ec_lang['lpn_main_desc']?></h2>
<script>
// ROADMAP Task 289. PLACEMENT IS LOAD-BEARING: this runs AFTER the three elements it hides, so
// getElementById can find them. It first ran before the <h2>, which parses below it, so the page
// description reappeared on every reload while the heading and welcome line hid correctly -- a
// null return from getElementById looks exactly like success. Fixed 2026-08-12; dev/lpn-spike/
// page-titles-harness.js now fails if this block is ever moved above an element it names.
//
// Inline and immediate rather than from js/looped-network.js at DOMContentLoaded, because the
// preference is paint-critical: reading it later means somebody who turned the titles off watches
// them flash on every load, on the page the setting exists to give room to. The DOMContentLoaded
// pass below is a BACKSTOP, not the mechanism -- it costs nothing when the first pass worked and
// it means a future reordering degrades to a flash instead of to silence.
(function () {
	function applyStoredTitleVisibility() {
		try {
			if (localStorage.getItem('lpn_show_titles') !== '0') { return; }
			['ec-page-title', 'ec-page-welcome', 'ec-page-desc'].forEach(function (id) {
				var el = document.getElementById(id);
				if (el) { el.style.display = 'none'; }
			});
		} catch (e) { /* storage blocked -- titles stay visible, which is the safe direction */ }
	}
	applyStoredTitleVisibility();
	document.addEventListener('DOMContentLoaded', applyStoredTitleVisibility);
}());
</script>

<?php
// The "View printable" wiring that used to sit here has been REMOVED (2026-08-06). It was copied
// from echoCalculatorForm() along with the rest of this page's hand-built form, but the BUTTON it
// binds to is emitted by that library function's tail, which this page does not call -- so
// getElementById('btn-printable') was null and the listener threw a TypeError on every single page
// load. Found by driving the real page in headless Chromium; it had been in the console since the
// page was written. Not replaced with a null guard: that would leave a listener for a button that
// does not exist. A printable view for this page would be a feature (§13: nobody prints these,
// everybody screenshots), not a stray listener.
?>
<form id="formInput" action="javascript:EngCalcs.submitForm()" method="post">
	<?php // Restore Defaults' removal freed enough headroom to put the six selectors on the same
	      // line as the US/SI row instead of a line of their own (Tom, 2026-07-30). A flex wrapper,
	      // not a merge into one <div>: echoUnitsRow() keeps its own collapse toggle untouched, and
	      // flex-wrap lets the two pieces re-flow onto separate lines on a narrow screen without any
	      // extra markup -- the wrap-first-as-a-table/div behavior Tom asked for falls out of
	      // flex-wrap for free. ?>
	<?php // The units block is a SECTION OF THE SETTINGS PANEL (Tom, 2026-08-08). It lived
	      // in a popover of its own from Task 211 until then, which cost Tom himself two failed
	      // attempts to find it three days after he chose the location -- "I can't see them at all".
	      // It is rendered here, hidden, and MOVED into the panel by rebuildSettingsFields(); the
	      // selects must be server-rendered (echoUnitSelect) to keep their unit families and option
	      // values, so the node is adopted rather than rebuilt. Task 211's reason for getting them
	      // off the page -- seven permanent dropdowns spending the scarcest thing this page has,
	      // vertical room above the map -- still holds and is still honoured; they are simply behind
	      // ONE door now instead of a second one nobody found. The US/SI preset row comes with them,
	      // because it is the same decision at a coarser grain.
	      // SETTINGS, not View: a unit system is a property of the calculation, not of the look at it
	      // (Tom, 2026-08-04, overruling the first version -- "View menu traditionally is about
	      // camera-related (or layer-related) stuff"). ?>
	<div id="lpn_units_holder" class="d-print-none" style="display:none">
	<div id="lpn_units_block">
	<div class="d-flex flex-wrap align-items-center" style="gap:4px 12px">
	<?php echoUnitsRow(false, true); // hide Restore Defaults -- this page has no cookie to restore (Tom, 2026-07-30) ?>
	<?php // Six selectors (Tom, 2026-07-30, +Velocity added answering "are there others?"):
	      // Length/Map is declarative-only (AutoCAD-style grid units, no SI conversion -- see the
	      // lengthField() comment in looped-network.js) and is deliberately its own selector, NOT
	      // shared with Elevation/Head, even though both happen to use family distance_site vs
	      // total_head -- conflating "this labels a grid unit" with "this converts a real
	      // quantity" under one control was confusing in practice. Elevation and (reservoir) Fixed
	      // Head share ONE selector on purpose: both are real vertical-datum quantities on the
	      // same energy scale, and letting them diverge would make elev+pressure-head arithmetic
	      // meaningless. Pressure and Velocity have no INPUT field (they're solve results,
	      // canonically shown in the property popups per Tom, 2026-07-30), but the selectors are
	      // established now so results render in the right unit from the start.
	      //
	      // ROUGHNESS NOW HAS A UNIT SELECTOR, and it is the one selector here that is conditional
	      // (ROADMAP Task 271). Manning n and Hazen-Williams C are dimensionless; Darcy-Weisbach
	      // roughness height e is a LENGTH. Rather than three roughness fields, there is one whose
	      // MEANING follows settings.method -- exactly what bpn_ does (bpnUpdateMethodUI()) -- and
	      // this select is shown only under Darcy-Weisbach. It is server-rendered like every other
	      // one so it keeps its unit family and is visible to the us/si preset buttons; hiding it
	      // is a display decision made later, in applyMethodUI(). ?>
	<div class="d-print-none" id="lpn_units_strip">
		<?=$ec_lang['lpn_units_length']?> <?php echoUnitSelect('lpn_u_length', 'distance_site', ''); ?>
		<?=$ec_lang['lpn_units_elevhead']?> <?php echoUnitSelect('lpn_u_elevhead', 'total_head', ''); ?>
		<?=$ec_lang['lpn_units_pressure']?> <?php echoUnitSelect('lpn_u_pressure', 'partial_head', ''); ?>
		<?=$ec_lang['lpn_field_diameter']?> <?php echoUnitSelect('lpn_u_diameter', 'distance_small', ''); ?>
		<?=$ec_lang['lpn_units_flow']?> <?php echoUnitSelect('lpn_u_flow', 'flow_epanet', ''); ?>
		<?=$ec_lang['lpn_units_velocity']?> <?php echoUnitSelect('lpn_u_velocity', 'velocity', ''); ?>
		<?=$ec_lang['lpn_result_gradient']?> <?php echoUnitSelect('lpn_u_gradient', 'gradient', ''); ?>
		<span id="lpn_u_roughness_row"><?=$ec_lang['lpn_field_roughness']?> <?php echoUnitSelect('lpn_u_roughness', 'roughness', ''); ?></span>
	</div><?php // #lpn_units_strip ?>
	</div><?php // the flex wrapper ?>
	</div><?php // #lpn_units_block -- the node rebuildSettingsFields() adopts into the panel ?>
	</div><?php // #lpn_units_holder -- parking spot; every div here is labelled because an unclosed
	            // one in this block once swallowed the whole page (Task 211, 2026-08-04) ?>
	<?php // Menu, toolbar, tabs, map -- top to bottom (ROADMAP Task 211, revised 2026-08-04 after Tom
	      // saw the first version rendered). The MENU holds everything; the TOOLBAR is the high-use
	      // subset of it, which is the conventional relationship between the two and the reason
	      // duplication between them is correct rather than sloppy. The TAB STRIP sits last, directly
	      // on top of the map, the way a PDF editor's document tabs and AutoCAD's layout tabs do:
	      // the tab is the document, and the document is what is under it. The first version put the
	      // strip above the toolbar on the argument that the toolbar is per-document state; with a
	      // real menu bar above it that argument stops paying for itself, because the strip then sits
	      // in the middle of the chrome instead of against the thing it names. ?>
	<div class="d-print-none" id="lpn_menubar"></div>
	<div class="d-print-none" id="lpn_toolbar"></div>
	<div class="d-print-none" id="lpn_tabs"></div>
	<?php // Lock banner (Task 195 Phase 2). Empty and hidden until either someone else holds the lock
	      // on the project file (read-only, red) or something needs warning about but not blocking --
	      // no server to lock against, or a linked file that has gone missing (amber). renderBanner()
	      // in js/looped-network.js fills it and sets the colors; read-only wins when both apply. ?>
	<div class="d-print-none" id="lpn_lock_banner" role="status" style="display:none;margin:4px 0;padding:6px 8px;border:1px solid #a80;background:#fffbe6"></div>
	<?php // `multiple` is the EXPERT shortcut for Task 276: pick the picture and its world file
	      // together and the registration happens with no further step. Picking only the picture is
	      // the ordinary path, and it now asks for NOTHING further (Task 297, Tom 2026-08-13: "We
	      // don't ask for world file... We ask for a paste of World File contents") -- scaling waits
	      // in the Background image menu until the user goes looking for it. The second hidden input
	      // that the deleted offer dialog opened is gone with it. The accept list still has to name
	      // the world-file extensions explicitly -- image/* alone would hide them from the picker.
	      //
	      // FOUR PICTURE FORMATS AND THEIR WORLD FILES, NOT image/* AND NOT *.* (Tom, 2026-08-14:
	      // "Why not just png, jpg, and gif and their world files?"). Correct, plus BMP, and the
	      // list must stay short enough to read in one line -- a filter nobody can read is one
	      // nobody can check.
	      //   png / jpg / gif -- what a plan sheet or an aerial actually arrives as.
	      //   bmp             -- Tom's colleague exports utility maps as Windows BMP (2026-08-11,
	      //                      the file that prompted the re-encode in downscaleImage()).
	      // WEBP, AVIF AND SVG WERE HERE AND ARE GONE. Browsers decode all three, which is not the
	      // test: nobody has ever handed this page one. image/* had the opposite problem -- it
	      // offered TIFF, which NO browser decodes, so a GeoTIFF site plan was picked and then
	      // failed silently.
	      // EXTENSIONS ONLY, NO MIME TYPES (Tom, 2026-08-14: "Do we really need pjp, jpe, jfif?").
	      // No -- and naming image/jpeg was how they got in. A browser expands a MIME type to every
	      // extension registered for it, so one tidy token puts .jfif, .pjp, .pjpeg and .jpe in the
	      // dialog's filter, which is the clutter he was looking at. An extension list shows exactly
	      // what it says. Extensions in accept= have been honoured by mobile pickers for years, so
	      // the MIME half bought nothing.
	      // Paired picture-then-world-file, in Tom's own order, so a missing sidecar is visible.
	      // A SHORT LIST IS CHEAP HERE, which is what settles the argument: accept= only filters the
	      // dialog, "All files" is always one click away, and since Task 300 a file we cannot decode
	      // says so (lpn_backdrop_unreadable) instead of doing nothing. So the cost of omitting a
	      // format is one extra click and a clear message -- not a dead end. Add one back when
	      // somebody actually turns up holding it. ?>
	<input type="file" id="lpn_backdrop_file" multiple accept=".png,.pgw,.jpg,.jpeg,.jgw,.gif,.gfw,.bmp,.bpw,.wld" style="display:none">
	<?php // Project import (Task 195). Lives here in the page, not inside any popover body, because
	      // those bodies get rebuilt wholesale and would take the input's wired change handler with
	      // them -- the same reason lpn_backdrop_file sits here. ?>
	<input type="file" id="lpn_project_file" accept=".json,application/json" style="display:none">
	<?php // EPANET import (Task 196). A SECOND picker rather than another accept type on the one
	      // above: the two feed different readers, and one input serving both would have to guess
	      // which from the extension -- a guess whose wrong answer is silent.
	      // BOTH of EPANET's formats: .inp is its documented text interchange format, .net is what
	      // its Windows UI saves when you press Save. The accept list only filters the PICKER; which
	      // format a chosen file really is gets decided from its first bytes, not its name. ?>
	<input type="file" id="lpn_inp_file" accept=".inp,.net,text/plain" style="display:none">
	<?php // Floating "choose target mode" step of the Position sequence (Task 146 Phase 2) --
	      // mirrors #lpn_labels_popup's static-PHP-plus-JS-clamped-position pattern (position:fixed,
	      // positioned/clamped by showBackdropTargetPanel() in looped-network.js), not the spike's
	      // fixed center-screen placement. ?>
	<div id="lpn_backdrop_target_panel" class="d-print-none" style="display:none;position:fixed;z-index:30;background:#fff;border:1px solid #333;padding:8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
		<?=$ec_lang['lpn_backdrop_target_label']?>
		<select id="lpn_backdrop_target_mode">
			<option value="node"><?=$ec_lang['lpn_backdrop_target_node']?></option>
			<option value="free"><?=$ec_lang['lpn_backdrop_target_free']?></option>
			<option value="coords"><?=$ec_lang['lpn_backdrop_target_coords']?></option>
		</select>
		<button type="button" id="lpn_backdrop_target_continue"><?=$ec_lang['lpn_backdrop_continue']?></button>
	</div>
	<?php // #lpn_status USED TO BE HERE, a <p> in the page flow directly above the canvas, and that is
	      // exactly what made the map move (Tom, 2026-08-17: "Does not have to be long to push the map
	      // down. Anything does it."). It now lives on the canvas with the other live readouts --
	      // see #lpn_map_overlay_tl below. Nothing between the tabs and the map. ?>
	<div style="overflow-x:auto;position:relative">
		<?php // **height="10000" IS A CURTAIN, NOT A GUESS, AND THE DIFFERENCE IS THE WHOLE POINT.**
		      //
		      // It used to say 500. That is a guess at the answer, and a guess drawn on screen is a
		      // stage the user WATCHES: the map appeared half-way up the window and then jumped once
		      // the page had finished assembling and applyMapHeight() could measure something true
		      // (Tom, 2026-08-15: *"Why set a map bottom at all when it can't be calculated?"*).
		      //
		      // Zero was tried first and is worse, which Tom caught immediately: *"I say that height
		      // 10000 is better so that we don't see the 'under construction' stuff."* A zero-height
		      // canvas does not show nothing -- it pulls the site footer, the nav and the legal row
		      // up into the viewport, so the first thing a visitor sees is the page's plumbing. A
		      // number far larger than any screen pushes all of that below the fold instead, and what
		      // shows while the page settles is an empty map area: the right shape, waiting.
		      //
		      // NOBODY CAN MISTAKE 10000 FOR AN ANSWER, which is what makes it safe. 500 was in the
		      // range of a real height, so it read as a decision and survived for months.
		      //
		      // The measurement is unaffected either way: flowBelowMap() is `body.bottom -
		      // svg.bottom`, and the canvas's own height appears in both terms, so it cancels. ?>
		<svg id="lpn_canvas" dir="ltr" width="100%" height="10000" style="border:1px solid #ccc;background:#fff"></svg>
		<?php // Persistent mode signal, INSIDE the canvas (Tom, 2026-07-30, second look: "I envisioned
		      // the mode status in the canvas area since it's active like coordinates" -- moved from a
		      // <p> above the map to this overlay, matching #lpn_coords' own treatment below: an
		      // absolutely-positioned, small-font, translucent-background readout that lives where the
		      // "live" map state actually is). Top-left so it doesn't compete with the upper-right
		      // legend or the bottom-left coordinate tracker. Updated by setMode() in
		      // looped-network.js. ?>
		<?php // THE TOP-LEFT STACK. A COLUMN, not a set of boxes at hand-computed offsets: the mode
		      // hint wraps to two lines in several languages, so any second overlay placed at a
		      // fixed `top` would sit on top of it there and nowhere else. Flex column, so each row
		      // is placed by the one above it having been measured.
		      // Only the mode hint is reserved against by zoomExtent() (overlayReserve). The
		      // diagnostic is deliberately NOT, because a diagnostic appears BECAUSE OF THE MODEL
		      // and the fit must not depend on the model -- the same rule that keeps
		      // applyMapHeight() off this path (dev/lpn-spike/map-height-harness.js). ?>
		<div id="lpn_map_overlay_tl" class="d-print-none" style="position:absolute;top:4px;left:4px;right:4px;display:flex;flex-direction:column;align-items:flex-start;gap:4px;pointer-events:none">
			<div id="lpn_mode_hint" style="font-size:11px;background:rgba(255,255,255,.8);padding:2px 6px"></div>
			<?php // The solver's standing diagnostic ("Add a reservoir"), true until the model
			      // changes. Deliberately NOT d-print-none: if the drawing on screen has no answers,
			      // a print of it should say why rather than look like a finished network. ?>
			<p id="lpn_status" class="ec-status-warn" style="display:none;max-width:60%;margin:0;font-size:11px;padding:2px 6px;background:#fffbe6;border:1px solid #a80"></p>
		</div>
		<?php // ONE-SHOT NOTICES SIT ON THE MAP, IN THE MODE HINT'S SLOT, AND EXPIRE (Tom, 2026-08-17:
		      // saving a project put a line of text above the canvas and "moves the map down past the
		      // bottom of the screen" -- then answered his own question, "maybe covering or replacing
		      // the mode status temporarily"). Same move the mode hint itself made, for the same
		      // reason: a readout that comes and goes must not be in the page's FLOW, because
		      // everything below it moves when it arrives.
		      // It COVERS the mode hint rather than writing into it, so nothing has to coordinate:
		      // updateModeHint() keeps the hint underneath correct and the notice's expiry simply
		      // uncovers it. Same top-left origin, higher z-index, opaque background. It is not
		      // measured by overlayReserve(), which is the point -- a transient must not change the
		      // fit, or every save would re-zoom the map. ?>
		<div id="lpn_map_notice" class="d-print-none" role="status" style="display:none;position:absolute;top:4px;left:4px;z-index:5;max-width:60%;font-size:11px;background:#fffbe6;border:1px solid #a80;padding:2px 6px;pointer-events:none"></div>
		<?php // Deliberately NOT d-print-none (Tom, 2026-07-30) -- the Labels popover itself is
		      // toolbar chrome and is hidden on print like the rest of #lpn_toolbar, so the color key
		      // for whichever fields are toggled on needs a separate, always-visible home to survive
		      // printing. Hidden by JS (display:none) whenever no field is toggled on, so it costs
		      // nothing when the map labels are off.
		      // Upper-right overlay, vertically stacked (Tom, 2026-07-30) -- the original above-canvas
		      // horizontal row read poorly. Fixed at upper-right for now; ROADMAP Task 146 notes a
		      // future gear-panel setting to choose among corners/edges (see the scope doc). ?>
		<?php // top/bottom/left/right deliberately absent -- applyLegendPosition() in
		      // looped-network.js sets those from settings.legendPosition (Task 146 gear panel,
		      // 2026-07-30; default 'top-right' reproduces this div's original hardcoded position). ?>
		<div id="lpn_labels_legend" style="display:none;position:absolute;font-size:0.9em;line-height:1.4;background:rgba(255,255,255,.85);padding:4px 8px;pointer-events:none"></div>
		<?php // No template_welcome here (Tom, 2026-07-30): it already shows at the top of every
		      // page via echoHeader(), and its link wasn't even clickable in this pointer-events:
		      // none overlay -- redundant, not just relocatable. ?>
		<?php // THE EMPTY CANVAS IS THE SHOP WINDOW (ROADMAP Task 314, Tom 2026-08-14: "I agree with
		      // the CC idea of using our first-visit map as an examples shop window").
		      //
		      // This replaces a placeholder sentence that had been on an empty canvas since
		      // 2026-07-29 -- "a blank canvas with a placeholder on it is the dominant failure of
		      // every map editor". Tom's own argument for why a picture beats the sentence: "'Add a
		      // background image' is not harnessing dilettantism. 'Open an example' is." A dabbler
		      // clicks a picture; they do not read a sentence about a menu path.
		      //
		      // POINTER EVENTS COME BACK ON here, unlike the placeholder that lived here before --
		      // these are real controls, not decoration. The wrapper stays pointer-events:none so
		      // the canvas behind the gallery is still pannable in the gaps between the cards; only
		      // the panel itself takes clicks. It is EMPTY in the markup and filled by
		      // renderExamplesGallery(): the manifest is fetched, so the server cannot know what
		      // goes here, and a PHP-rendered copy of the list would be a second index to keep in
		      // step with the generated one. ?>
		<div id="lpn_empty_hint" class="d-print-none" style="display:none;position:absolute;inset:0;pointer-events:none;overflow:auto">
			<div id="lpn_examples_pane" class="lpn-examples"></div>
		</div>
		<?php // THE BOTTOM STATUS STRIP. Both readouts in ONE flex row so their order is real rather
		      // than two absolute boxes that happen not to collide: settings first, then the
		      // coordinate tracker (Tom, 2026-08-10 -- "move to left before the coordinates to match
		      // EPANET more closely"). EPANET puts its unit/mode readouts at the left of the status
		      // bar and the cursor position after them, and this page is adopting that paradigm
		      // rather than inventing one.
		      //
		      // The WRAPPER is what zoomExtent() reserves against (overlayReserve('lpn_map_footer')),
		      // so a narrow window that wraps the strip onto two lines reserves two lines' worth --
		      // measuring only the coordinate box would have under-reserved the moment it wrapped. ?>
		<div id="lpn_map_footer" class="d-print-none" style="position:absolute;bottom:4px;left:4px;right:4px;display:flex;flex-wrap:wrap;gap:4px 8px;align-items:flex-end;pointer-events:none;font-size:11px">
			<?php // What the numbers on the map ARE. Map labels are bare numbers by design, so without
			      // this a first-time visitor cannot tell gpm from l/s -- they get US on an English
			      // page and SI on every other, and nothing said which. Filled by refreshMapStatus(). ?>
			<?php // WHICH SCENARIO the drawing is showing and solving, and how many values that
			      // scenario holds of its own (ROADMAP Task 184). A readout you can click: the same
			      // control answers "what am I working on right now" and switches, creates, renames
			      // and deletes. pointer-events:auto because the strip itself is inert -- it is an
			      // overlay over the map, and this is the one thing in it that is not just a
			      // readout. Filled and wired by refreshScenarioStatus()/wireScenarioButton(). ?>
			<button type="button" id="lpn_scenario_btn" style="pointer-events:auto;font-size:11px;background:rgba(255,255,255,.8);padding:2px 6px;border:1px solid #bbb"></button>
			<div id="lpn_map_status" style="background:rgba(255,255,255,.8);padding:2px 6px"></div>
			<?php // Monospace, and only this one: the X/Y digits change on every pointer move, and a
			      // proportional font makes the whole readout jitter as they do. ?>
			<div id="lpn_coords" style="font-family:monospace;background:rgba(255,255,255,.8);padding:2px 6px">X: --  Y: --</div>
		</div>
	</div>
</form>
<?php // position:fixed, not absolute: the popup is positioned from pointer-event clientX/clientY
      // (viewport-relative), but position:absolute is page-relative -- on a scrolled page those
      // are two different coordinate spaces, which was the actual cause of both the off-screen
      // popup and the "jarring pan on close" (the mismatch put the real Close button hitbox
      // somewhere other than where it visually appeared, so the tap fell through to the canvas
      // underneath and was read as a background pan). fixed is always viewport-relative, matching
      // clientX/clientY directly with no scroll math needed. ?>
<div id="lpn_popup" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:40px 8px 8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div class="lpn-popover-body">
	<div id="lpn_popup_title"></div>
	<div id="lpn_popup_fields"></div>
	</div>
	<button type="button" id="lpn_popup_close" class="lpn-popover-x" title="<?=htmlspecialchars($ec_lang['lpn_close'])?>" aria-label="<?=htmlspecialchars($ec_lang['lpn_close'])?>">×</button>
</div>
<?php // A static settings panel, not a per-element property sheet -- deliberately its own popover
      // (not #lpn_popup/currentPopup) so this never interacts with the rename/undo/element-property
      // machinery. position:fixed and positioned from the Labels button's own screen rect (same
      // reasoning as #lpn_popup above: viewport-relative, clamped into view by JS on open). ?>
<?php // NO CLOSE X, and none is coming back (Tom, 2026-08-13): "What are these boxes? ... Or are they
      // pull-down menus, which is what they appear to be? If pull-down menus, then an X to close is
      // not idiomatic or expected." They are pull-downs -- anchored under the button that opened
      // them, dismissed by clicking away, by Escape, by the button again, or by opening any other
      // menu or panel. So they close the way a pull-down closes and carry no chrome of their own.
      // #lpn_popup above keeps its X because it is NOT one of these: it opens at the point on the
      // map that was clicked, belongs to an element rather than to a button, and so reads as a
      // floating property sheet, where a corner X is exactly what is expected. ?>
<div id="lpn_labels_popup" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div class="lpn-popover-body">
	<div style="font-weight:bold"><?=$ec_lang['lpn_labels_heading_node']?></div>
	<div id="lpn_labels_node_fields"></div>
	<div style="font-weight:bold"><?=$ec_lang['lpn_labels_heading_link']?></div>
	<div id="lpn_labels_link_fields"></div>
	<?php // Label options that apply to every field at once (ROADMAP Task 190's high/low mark
	      // toggle), below both per-field lists. Built in JS by rebuildLabelsFields(). ?>
	<div id="lpn_labels_options"></div>
	</div>
</div>
<?php // Find panel (Tasks 420 and 353). A PULL-DOWN, not a modal dialog: EPANET's Map Finder is
      // modeless for a reason -- you find something, look at the map, and search again without the
      // panel ever taking the map away. Everything inside is built in JS (wireFindPopup()), because
      // the property and condition lists depend on which kind of element you chose. ?>
<div id="lpn_find_popup" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:8px;box-shadow:2px 2px 6px rgba(0,0,0,.3);max-width:22rem">
	<div class="lpn-popover-body">
	<div style="font-weight:bold"><?=$ec_lang['lpn_find_title']?></div>
	<div id="lpn_find_form"></div>
	<div id="lpn_find_results"></div>
	</div>
</div>
<?php // Gear/settings panel (Task 146 Phase 2, 2026-07-30): ID prefixes, solver emitter exponent
      // and convergence tolerance, text size (+ map-vs-screen units), legend position -- same
      // static-panel, non-#lpn_popup pattern as #lpn_labels_popup directly above. Fields are built
      // entirely in JS (wireSettingsPopup() in looped-network.js), not PHP, so #lpn_settings_fields
      // starts empty here. ?>
<?php // Pull-down, not a box -- no close X. See the note over #lpn_labels_popup. ?>
<div id="lpn_settings_popup" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div class="lpn-popover-body">
	<div id="lpn_settings_fields"></div>
	</div>
</div>
<?php // ONE menu popover, reused by all three menus (ROADMAP Task 211): the File menu, a tab's own
      // menu, and the tab-strip overflow list. They differ only in their rows, and openMenu() in
      // js/looped-network.js builds those, so three popovers would have been three copies of the
      // same positioning and dismissal code. Replaces the Projects panel of Task 146.08 -- the tab
      // strip now answers "which network am I looking at", permanently and without a click. ?>
<div id="lpn_menu_popup" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:4px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div id="lpn_menu_list"></div>
</div>
<?php // The SUBMENU layer (Task 264 rework, Tom 2026-08-10: "the universal convention is for that to
      // be a fly-out submenu of New rather than a visually disconnected replacement"). A second
      // element rather than a second use of the first, because a fly-out's whole point is that the
      // PARENT STAYS ON SCREEN -- replacing the list in one popup is what made New read as a menu
      // that had been navigated away from. z-index one above its parent so it paints over it where
      // the clamp has to overlap them on a narrow window. ?>
<div id="lpn_menu_popup2" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:21;background:#fff;border:1px solid #333;padding:4px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div id="lpn_menu_list2"></div>
</div>
<?php // ONE dialog, reused for every question that has to be answered before anything else happens:
      // the close prompt, the read-only choice when somebody else has the file, and the first-run
      // file training panel. Deliberately NOT window.confirm(): showSaveFilePicker() needs a live
      // user activation, and Chrome's transient activation expires after a few seconds, so a
      // blocking dialog would work for a fast reader and throw for a careful one. A button in here
      // is a fresh click, so it always has an activation of its own. ?>
<!-- Swallows every click that is not in the dialog, which is what makes aria-modal true.
     z-index sits one below the dialog's 40. -->
<div id="lpn_dialog_backdrop" class="d-print-none" style="display:none;position:fixed;z-index:39;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.25)"></div>
<div id="lpn_dialog" class="d-print-none" role="dialog" aria-modal="true" style="display:none;position:fixed;z-index:40;left:50%;top:20%;transform:translateX(-50%);max-width:34em;background:#fff;border:1px solid #333;padding:12px;box-shadow:2px 2px 12px rgba(0,0,0,.4)">
	<div id="lpn_dialog_body"></div>
	<div id="lpn_dialog_buttons" style="margin-top:10px;text-align:right"></div>
</div>

<?php // THE NOTES AND THE FEEDBACK LINE BOTH LEFT THE PAGE BODY (Tom, 2026-08-14: "LPN has a Help
      // menu now. Are we going to put the notes there and bump the bottom of the map against the
      // bottom of the screen?"). On a twenty-line calculator the Notes sit a scroll below the
      // answer and cost nothing; on a full-window map editor they are the reason the canvas stops
      // short of the fold, on the one page in the suite where vertical room IS the product.
      //
      // **THE MARKUP STAYS IN THE PAGE, hidden, rather than being built by JS.** These are six
      // translated definition pairs -- real content in 27 languages, and the only prose on this
      // page that says what the calculator assumes. Moving them into a JS string would take them
      // out of the HTML a search engine reads and out of the document a reader can print or
      // Find-in-page. So the popover below IS the notes: one copy, in the source, revealed by
      // Help > Notes.
      //
      // echoFeedback() is simply not called here, alone among the calculators. Its invitation now
      // lives as Help > Fix something (which opens contact.php in a new tab, like every other row
      // in that menu) and the template_feedback prose itself moved onto contact.php, where somebody
      // who followed the invitation actually reads it. ?>
<div id="lpn_notes_popup" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:40px 12px 12px;box-shadow:2px 2px 6px rgba(0,0,0,.3);max-width:44rem">
	<button type="button" id="lpn_notes_close" class="lpn-popover-x" title="<?=htmlspecialchars($ec_lang['lpn_close'])?>" aria-label="<?=htmlspecialchars($ec_lang['lpn_close'])?>">&times;</button>
	<div class="lpn-popover-body">
<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['lpn_notes_1_term']?></dt><dd><?=$ec_lang['lpn_notes_1_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_2_term']?></dt><dd><?=$ec_lang['lpn_notes_2_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_3_term']?></dt><dd><?=$ec_lang['lpn_notes_3_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_5_term']?></dt><dd><?=$ec_lang['lpn_notes_5_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_4_term']?></dt><dd><?=$ec_lang['lpn_notes_4_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_epanet_term']?></dt><dd><?=$ec_lang['lpn_notes_epanet_def']?></dd>
</dl>
	</div>
</div>

<script>
EngCalcs.pageConfig = {
	lpn_tool_select: <?=json_encode($ec_lang['lpn_tool_select'])?>,
	lpn_tool_add_junction: <?=json_encode($ec_lang['lpn_tool_add_junction'])?>,
	lpn_tool_add_reservoir: <?=json_encode($ec_lang['lpn_tool_add_reservoir'])?>,
	lpn_tool_add_tank: <?=json_encode($ec_lang['lpn_tool_add_tank'])?>,
	lpn_tool_add_pipe: <?=json_encode($ec_lang['lpn_tool_add_pipe'])?>,
	lpn_tool_add_pump: <?=json_encode($ec_lang['lpn_tool_add_pump'])?>,
	lpn_tool_add_valve: <?=json_encode($ec_lang['lpn_tool_add_valve'])?>,
	lpn_tool_add_text: <?=json_encode($ec_lang['lpn_tool_add_text'])?>,
	lpn_tool_delete: <?=json_encode($ec_lang['lpn_tool_delete'])?>,
	lpn_tool_zoom_extent: <?=json_encode($ec_lang['lpn_tool_zoom_extent'])?>,
	lpn_tool_undo: <?=json_encode($ec_lang['lpn_tool_undo'])?>,
	lpn_confirm_example: <?=json_encode($ec_lang['lpn_confirm_example'])?>,
	lpn_empty_hint: <?=json_encode($ec_lang['lpn_empty_hint'])?>,
	lpn_examples_heading: <?=json_encode($ec_lang['lpn_examples_heading'])?>,
	lpn_examples_sub: <?=json_encode($ec_lang['lpn_examples_sub'])?>,
	lpn_examples_open: <?=json_encode($ec_lang['lpn_examples_open'])?>,
	lpn_examples_menu: <?=json_encode($ec_lang['lpn_examples_menu'])?>,
	lpn_examples_blank: <?=json_encode($ec_lang['lpn_examples_blank'])?>,
	lpn_examples_close: <?=json_encode($ec_lang['lpn_examples_close'])?>,
	lpn_examples_size: <?=json_encode($ec_lang['lpn_examples_size'])?>,
	lpn_examples_failed: <?=json_encode($ec_lang['lpn_examples_failed'])?>,
	lpn_examples_loading: <?=json_encode($ec_lang['lpn_examples_loading'])?>,
	lpn_status_example_opened: <?=json_encode($ec_lang['lpn_status_example_opened'])?>,
	lpn_find_menu: <?=json_encode($ec_lang['lpn_find_menu'])?>,
	lpn_find_scope: <?=json_encode($ec_lang['lpn_find_scope'])?>,
	lpn_find_scope_all: <?=json_encode($ec_lang['lpn_find_scope_all'])?>,
	lpn_find_property: <?=json_encode($ec_lang['lpn_find_property'])?>,
	lpn_find_condition: <?=json_encode($ec_lang['lpn_find_condition'])?>,
	lpn_find_value: <?=json_encode($ec_lang['lpn_find_value'])?>,
	lpn_find_button: <?=json_encode($ec_lang['lpn_find_button'])?>,
	lpn_find_op_contains: <?=json_encode($ec_lang['lpn_find_op_contains'])?>,
	lpn_find_op_equals: <?=json_encode($ec_lang['lpn_find_op_equals'])?>,
	lpn_find_op_gt: <?=json_encode($ec_lang['lpn_find_op_gt'])?>,
	lpn_find_op_lt: <?=json_encode($ec_lang['lpn_find_op_lt'])?>,
	lpn_find_count: <?=json_encode($ec_lang['lpn_find_count'])?>,
	lpn_find_none: <?=json_encode($ec_lang['lpn_find_none'])?>,
	lpn_find_adjacent: <?=json_encode($ec_lang['lpn_find_adjacent'])?>,
	lpn_find_no_value: <?=json_encode($ec_lang['lpn_find_no_value'])?>,
	lpn_help_fix: <?=json_encode($ec_lang['lpn_help_fix'])?>,
	lpn_help_notes: <?=json_encode($ec_lang['lpn_help_notes'])?>,
<?php   // The suite's existing legal-link strings, needed here because this page's Help menu and
        // examples gallery carry them instead of a footer. Reused, never re-keyed: the wording must
        // match the identical links on every other page. ?>
	privacy_link: <?=json_encode($ec_lang['privacy_link'])?>,
	terms_link: <?=json_encode($ec_lang['terms_link'])?>,
	consent_settings_link: <?=json_encode($ec_lang['consent_settings_link'])?>,
<?php   // Every example card's title and description, emitted BY PATTERN rather than one line each.
        // The gallery reads them by the key name the manifest gives it, so the set is data, not a
        // fixed list -- adding an example means adding two lang keys and nothing here.
        //
        // The cost of that convenience is that dev/scripts/pageconfig_check.php cannot see these:
        // it matches literal `EngCalcs.pageConfig.<key>` reads, and a bracket lookup is invisible to
        // it. So the guarantee is bought back in the generator instead --
        // generate_examples.php --check fails when an example's lpn_ex_*_title/_desc is missing from
        // lang.ec.en.php, and it is blocking in check_all.sh. Same protection, different tool,
        // because this is the one place on the page where the key set is not known in advance.
        foreach ($ec_lang as $k => $v) {
            if (strpos($k, 'lpn_ex_') !== 0) { continue; }
            echo "\t" . $k . ': ' . json_encode($v) . ",\n";
        } ?>
	lpn_new_text: <?=json_encode($ec_lang['lpn_new_text'])?>,
	lpn_field_text_bold: <?=json_encode($ec_lang['lpn_field_text_bold'])?>,
	lpn_field_text_rotation: <?=json_encode($ec_lang['lpn_field_text_rotation'])?>,
	lpn_field_text_match_pipe: <?=json_encode($ec_lang['lpn_field_text_match_pipe'])?>,
	lpn_field_text_flip: <?=json_encode($ec_lang['lpn_field_text_flip'])?>,
	lpn_field_elev: <?=json_encode($ec_lang['lpn_field_elev'])?>,
	lpn_field_elev_tip: <?=json_encode($ec_lang['lpn_field_elev_tip'])?>,
	lpn_field_head: <?=json_encode($ec_lang['lpn_field_head'])?>,
	lpn_field_head_tip: <?=json_encode($ec_lang['lpn_field_head_tip'])?>,
	lpn_tank_elev_tip: <?=json_encode($ec_lang['lpn_tank_elev_tip'])?>,
	lpn_field_tank_level: <?=json_encode($ec_lang['lpn_field_tank_level'])?>,
	lpn_field_tank_level_tip: <?=json_encode($ec_lang['lpn_field_tank_level_tip'])?>,
	lpn_field_tank_minlevel: <?=json_encode($ec_lang['lpn_field_tank_minlevel'])?>,
	lpn_field_tank_minlevel_tip: <?=json_encode($ec_lang['lpn_field_tank_minlevel_tip'])?>,
	lpn_field_tank_maxlevel: <?=json_encode($ec_lang['lpn_field_tank_maxlevel'])?>,
	lpn_field_tank_maxlevel_tip: <?=json_encode($ec_lang['lpn_field_tank_maxlevel_tip'])?>,
	lpn_field_tank_diameter: <?=json_encode($ec_lang['lpn_field_tank_diameter'])?>,
	lpn_field_tank_diameter_tip: <?=json_encode($ec_lang['lpn_field_tank_diameter_tip'])?>,
	lpn_tank_head_tip: <?=json_encode($ec_lang['lpn_tank_head_tip'])?>,
	lpn_field_diameter: <?=json_encode($ec_lang['lpn_field_diameter'])?>,
	lpn_field_valve_type: <?=json_encode($ec_lang['lpn_field_valve_type'])?>,
	lpn_field_valve_type_tip: <?=json_encode($ec_lang['lpn_field_valve_type_tip'])?>,
	lpn_valve_type_tcv: <?=json_encode($ec_lang['lpn_valve_type_tcv'])?>,
	lpn_valve_type_prv: <?=json_encode($ec_lang['lpn_valve_type_prv'])?>,
	lpn_valve_type_psv: <?=json_encode($ec_lang['lpn_valve_type_psv'])?>,
	lpn_valve_type_fcv: <?=json_encode($ec_lang['lpn_valve_type_fcv'])?>,
	lpn_field_valve_setting_pressure: <?=json_encode($ec_lang['lpn_field_valve_setting_pressure'])?>,
	lpn_field_valve_setting_pressure_tip: <?=json_encode($ec_lang['lpn_field_valve_setting_pressure_tip'])?>,
	lpn_field_valve_setting_flow: <?=json_encode($ec_lang['lpn_field_valve_setting_flow'])?>,
	lpn_field_valve_setting_flow_tip: <?=json_encode($ec_lang['lpn_field_valve_setting_flow_tip'])?>,
	lpn_field_valve_setting_loss: <?=json_encode($ec_lang['lpn_field_valve_setting_loss'])?>,
	lpn_field_valve_setting_loss_tip: <?=json_encode($ec_lang['lpn_field_valve_setting_loss_tip'])?>,
	lpn_field_valve_diameter_tip: <?=json_encode($ec_lang['lpn_field_valve_diameter_tip'])?>,
	lpn_field_valve_km_tip: <?=json_encode($ec_lang['lpn_field_valve_km_tip'])?>,
	lpn_demand_tip: <?=json_encode($ec_lang['lpn_demand_tip'])?>,
	lpn_field_roughness: <?=json_encode($ec_lang['lpn_field_roughness'])?>,
	lpn_field_roughness_tip: <?=json_encode($ec_lang['lpn_field_roughness_tip'])?>,
	lpn_field_length: <?=json_encode($ec_lang['lpn_field_length'])?>,
	lpn_field_length_tip: <?=json_encode($ec_lang['lpn_field_length_tip'])?>,
	lpn_field_km: <?=json_encode($ec_lang['lpn_field_km'])?>,
	lpn_field_km_tip: <?=json_encode($ec_lang['lpn_field_km_tip'])?>,
	lpn_field_km_short: <?=json_encode($ec_lang['lpn_field_km_short'])?>,
	lpn_field_auto: <?=json_encode($ec_lang['lpn_field_auto'])?>,
	lpn_method_switch_confirm: <?=json_encode($ec_lang['lpn_method_switch_confirm'])?>,
	<?php // Borrowed for the roughness field, whose meaning follows the friction method (Task 271):
	      // bpn_roughness_tip names Manning n, Hazen-Williams C and Darcy-Weisbach e in one
	      // already-translated string, so the switchable field costs no new key. ?>
	bpn_roughness_tip: <?=json_encode($ec_lang['bpn_roughness_tip'])?>,
	lpn_field_closed: <?=json_encode($ec_lang['lpn_field_closed'])?>,
	lpn_field_closed_tip: <?=json_encode($ec_lang['lpn_field_closed_tip'])?>,
	lpn_field_x: <?=json_encode($ec_lang['lpn_field_x'])?>,
	lpn_field_y: <?=json_encode($ec_lang['lpn_field_y'])?>,
	lpn_field_text_size: <?=json_encode($ec_lang['lpn_field_text_size'])?>,
	lpn_field_show_always: <?=json_encode($ec_lang['lpn_field_show_always'])?>,
	lpn_tool_labels: <?=json_encode($ec_lang['lpn_tool_labels'])?>,
	lpn_labels_heading_node: <?=json_encode($ec_lang['lpn_labels_heading_node'])?>,
	lpn_labels_heading_link: <?=json_encode($ec_lang['lpn_labels_heading_link'])?>,
	lpn_labels_decimals_tip: <?=json_encode($ec_lang['lpn_labels_decimals_tip'])?>,
	lpn_labels_mark_extrema: <?=json_encode($ec_lang['lpn_labels_mark_extrema'])?>,
	lpn_settings_apply_to_all: <?=json_encode($ec_lang['lpn_settings_apply_to_all'])?>,
	lpn_settings_apply_to_all_tip: <?=json_encode($ec_lang['lpn_settings_apply_to_all_tip'])?>,
	lpn_confirm_apply_prefix: <?=json_encode($ec_lang['lpn_confirm_apply_prefix'])?>,
	lpn_prefix_applied: <?=json_encode($ec_lang['lpn_prefix_applied'])?>,
	lpn_labels_prefix_tip: <?=json_encode($ec_lang['lpn_labels_prefix_tip'])?>,
	lpn_labels_prefix_id_tip: <?=json_encode($ec_lang['lpn_labels_prefix_id_tip'])?>,
	lpn_labels_suffix_tip: <?=json_encode($ec_lang['lpn_labels_suffix_tip'])?>,
	lpn_labels_suffix_gradient_tip: <?=json_encode($ec_lang['lpn_labels_suffix_gradient_tip'])?>,
	lpn_labels_separator: <?=json_encode($ec_lang['lpn_labels_separator'])?>,
	lpn_labels_separator_tip: <?=json_encode($ec_lang['lpn_labels_separator_tip'])?>,
	lpn_labels_priority: <?=json_encode($ec_lang['lpn_labels_priority'])?>,
	lpn_labels_col_before: <?=json_encode($ec_lang['lpn_labels_col_before'])?>,
	lpn_labels_col_after: <?=json_encode($ec_lang['lpn_labels_col_after'])?>,
	lpn_labels_col_decimals: <?=json_encode($ec_lang['lpn_labels_col_decimals'])?>,
	lpn_labels_priority_link_tip: <?=json_encode($ec_lang['lpn_labels_priority_link_tip'])?>,
	lpn_labels_priority_node_tip: <?=json_encode($ec_lang['lpn_labels_priority_node_tip'])?>,
	lpn_field_id: <?=json_encode($ec_lang['lpn_field_id'])?>,
	lpn_pump_curve_source: <?=json_encode($ec_lang['lpn_pump_curve_source'])?>,
	lpn_pump_curve_own: <?=json_encode($ec_lang['lpn_pump_curve_own'])?>,
	lpn_pump_curve_ref_note: <?=json_encode($ec_lang['lpn_pump_curve_ref_note'])?>,
	lpn_pump_curve_note: <?=json_encode($ec_lang['lpn_pump_curve_note'])?>,
	lpn_pump_point1: <?=json_encode($ec_lang['lpn_pump_point1'])?>,
	lpn_pump_point2: <?=json_encode($ec_lang['lpn_pump_point2'])?>,
	lpn_pump_point3: <?=json_encode($ec_lang['lpn_pump_point3'])?>,
	lpn_mode_select: <?=json_encode($ec_lang['lpn_mode_select'])?>,
	lpn_mode_delete: <?=json_encode($ec_lang['lpn_mode_delete'])?>,
	lpn_select_first: <?=json_encode($ec_lang['lpn_select_first'])?>,
	lpn_mode_add_junction: <?=json_encode($ec_lang['lpn_mode_add_junction'])?>,
	lpn_mode_add_reservoir: <?=json_encode($ec_lang['lpn_mode_add_reservoir'])?>,
	lpn_mode_add_tank: <?=json_encode($ec_lang['lpn_mode_add_tank'])?>,
	lpn_mode_add_pipe: <?=json_encode($ec_lang['lpn_mode_add_pipe'])?>,
	lpn_mode_add_pump: <?=json_encode($ec_lang['lpn_mode_add_pump'])?>,
	lpn_mode_add_valve: <?=json_encode($ec_lang['lpn_mode_add_valve'])?>,
	lpn_mode_add_text: <?=json_encode($ec_lang['lpn_mode_add_text'])?>,
	lpn_tip_select: <?=json_encode($ec_lang['lpn_tip_select'])?>,
	lpn_tip_labels_draggable: <?=json_encode($ec_lang['lpn_tip_labels_draggable'])?>,
	bpn_demand: <?=json_encode($ec_lang['bpn_demand'])?>,
	lpn_units_flow: <?=json_encode($ec_lang['lpn_units_flow'])?>,
	lpn_units_pressure: <?=json_encode($ec_lang['lpn_units_pressure'])?>,
	bpn_method: <?=json_encode($ec_lang['bpn_method'])?>,
	bpn_method_hw: <?=json_encode($ec_lang['bpn_method_hw'])?>,
	bpn_method_dw: <?=json_encode($ec_lang['bpn_method_dw'])?>,
	bpn_method_manning: <?=json_encode($ec_lang['bpn_method_manning'])?>,
	<?php // Annotations on the example network (Task 254). Composed ENTIRELY from strings that
	      // already exist and are already translated, per Tom 2026-08-09 ("to minimize translation
	      // load, we can compose it from existing lang strings") -- menu_brand is suite chrome and
	      // so is translated in all 26 languages; bpn_p_min belongs to the sibling branched-network
	      // calculator and is translated wherever lpn_ is. Neither adds a single key to translate. ?>
	menu_brand: <?=json_encode($ec_lang['menu_brand'])?>,
	lpn_main_menu: <?=json_encode($ec_lang['lpn_main_menu'])?>,
	<?php // The browser-tab title's unit disclosure (ROADMAP Task 265). calc_units_us/si are suite
	      // chrome and already translated everywhere; lpn_title_units carries the {units} placeholder
	      // so a language decides its own word order rather than having "US" + "Units" concatenated
	      // for it at render time -- CLAUDE.md forbids composing a label from fragments. ?>
	calc_units_us: <?=json_encode($ec_lang['calc_units_us'])?>,
	calc_units_si: <?=json_encode($ec_lang['calc_units_si'])?>,
	lpn_title_units: <?=json_encode($ec_lang['lpn_title_units'])?>,
	bpn_p_min: <?=json_encode($ec_lang['bpn_p_min'])?>,
	lpn_id_invalid: <?=json_encode($ec_lang['lpn_id_invalid'])?>,
	lpn_id_taken: <?=json_encode($ec_lang['lpn_id_taken'])?>,
	lpn_diag_no_fixed_head: <?=json_encode($ec_lang['lpn_diag_no_fixed_head'])?>,
	lpn_diag_dangling_link: <?=json_encode($ec_lang['lpn_diag_dangling_link'])?>,
	lpn_diag_unreachable: <?=json_encode($ec_lang['lpn_diag_unreachable'])?>,
	lpn_engine_fetching: <?=json_encode($ec_lang['lpn_engine_fetching'])?>,
	lpn_engine_ready: <?=json_encode($ec_lang['lpn_engine_ready'])?>,
	lpn_engine_fetching_valve: <?=json_encode($ec_lang['lpn_engine_fetching_valve'])?>,
	lpn_engine_ready_valve: <?=json_encode($ec_lang['lpn_engine_ready_valve'])?>,
	lpn_engine_unavailable: <?=json_encode($ec_lang['lpn_engine_unavailable'])?>,
	lpn_diag_valve_needs_epanet: <?=json_encode($ec_lang['lpn_diag_valve_needs_epanet'])?>,
	lpn_diag_valve_on_fixed_head: <?=json_encode($ec_lang['lpn_diag_valve_on_fixed_head'])?>,
	lpn_diag_not_converged: <?=json_encode($ec_lang['lpn_diag_not_converged'])?>,
	lpn_result_head: <?=json_encode($ec_lang['lpn_result_head'])?>,
	lpn_result_head_tip: <?=json_encode($ec_lang['lpn_result_head_tip'])?>,
	lpn_result_pressure: <?=json_encode($ec_lang['lpn_result_pressure'])?>,
	lpn_result_flow: <?=json_encode($ec_lang['lpn_result_flow'])?>,
	lpn_result_velocity: <?=json_encode($ec_lang['lpn_result_velocity'])?>,
	lpn_result_headloss: <?=json_encode($ec_lang['lpn_result_headloss'])?>,
	lpn_result_gradient: <?=json_encode($ec_lang['lpn_result_gradient'])?>,
	lpn_result_gradient_tip: <?=json_encode($ec_lang['lpn_result_gradient_tip'])?>,
	lpn_settings_restore_tip: <?=json_encode($ec_lang['lpn_settings_restore_tip'])?>,
	lpn_reset_all_tip: <?=json_encode($ec_lang['lpn_reset_all_tip'])?>,
	lpn_storage_too_new: <?=json_encode($ec_lang['lpn_storage_too_new'])?>,
	lpn_v2_restore_confirm: <?=json_encode($ec_lang['lpn_v2_restore_confirm'])?>,
	lpn_v2_restore_yes: <?=json_encode($ec_lang['lpn_v2_restore_yes'])?>,
	lpn_v2_restore_never: <?=json_encode($ec_lang['lpn_v2_restore_never'])?>,
	lpn_v2_restore_no: <?=json_encode($ec_lang['lpn_v2_restore_no'])?>,
	lpn_tool_file: <?=json_encode($ec_lang['lpn_tool_file'])?>,
	lpn_menu_edit: <?=json_encode($ec_lang['lpn_menu_edit'])?>,
	lpn_menu_insert: <?=json_encode($ec_lang['lpn_menu_insert'])?>,
	lpn_menu_view: <?=json_encode($ec_lang['lpn_menu_view'])?>,
	lpn_menu_settings: <?=json_encode($ec_lang['lpn_menu_settings'])?>,
	lpn_menu_help: <?=json_encode($ec_lang['lpn_menu_help'])?>,
	lpn_help_walkthroughs: <?=json_encode($ec_lang['lpn_help_walkthroughs'])?>,
	<?php // Reused verbatim from the suite navbar, not re-keyed: same words, same two pages, already
	      // translated in all 27 languages. See the concept-level label reuse rule in CLAUDE.md. ?>
	about_main_menu: <?=json_encode($ec_lang['about_main_menu'])?>,
	contact_main_menu: <?=json_encode($ec_lang['contact_main_menu'])?>,
	lpn_edit_delete_network: <?=json_encode($ec_lang['lpn_edit_delete_network'])?>,
	lpn_confirm_delete_network: <?=json_encode($ec_lang['lpn_confirm_delete_network'])?>,
	lpn_view_units: <?=json_encode($ec_lang['lpn_view_units'])?>,
	lpn_file_saveall: <?=json_encode($ec_lang['lpn_file_saveall'])?>,
	lpn_project_numbered: <?=json_encode($ec_lang['lpn_project_numbered'])?>,
	lpn_project_copy_suffix: <?=json_encode($ec_lang['lpn_project_copy_suffix'])?>,
	lpn_project_rename: <?=json_encode($ec_lang['lpn_project_rename'])?>,
	lpn_file_new: <?=json_encode($ec_lang['lpn_file_new'])?>,
	lpn_new_blank_us: <?=json_encode($ec_lang['lpn_new_blank_us'])?>,
	lpn_new_blank_si: <?=json_encode($ec_lang['lpn_new_blank_si'])?>,
	lpn_file_open: <?=json_encode($ec_lang['lpn_file_open'])?>,
	lpn_file_save: <?=json_encode($ec_lang['lpn_file_save'])?>,
	lpn_file_saveas: <?=json_encode($ec_lang['lpn_file_saveas'])?>,
	lpn_file_revert: <?=json_encode($ec_lang['lpn_file_revert'])?>,
	lpn_file_close: <?=json_encode($ec_lang['lpn_file_close'])?>,
	lpn_file_recent: <?=json_encode($ec_lang['lpn_file_recent'])?>,
	lpn_recent_tip: <?=json_encode($ec_lang['lpn_recent_tip'])?>,
	lpn_recent_denied: <?=json_encode($ec_lang['lpn_recent_denied'])?>,
	lpn_recent_gone: <?=json_encode($ec_lang['lpn_recent_gone'])?>,
	lpn_tab_new: <?=json_encode($ec_lang['lpn_tab_new'])?>,
	lpn_tab_all: <?=json_encode($ec_lang['lpn_tab_all'])?>,
	lpn_tab_menu: <?=json_encode($ec_lang['lpn_tab_menu'])?>,
	lpn_tab_duplicate: <?=json_encode($ec_lang['lpn_tab_duplicate'])?>,
	lpn_tab_move_left: <?=json_encode($ec_lang['lpn_tab_move_left'])?>,
	lpn_tab_move_right: <?=json_encode($ec_lang['lpn_tab_move_right'])?>,
	lpn_tab_unsaved: <?=json_encode($ec_lang['lpn_tab_unsaved'])?>,
	lpn_import_bad_file: <?=json_encode($ec_lang['lpn_import_bad_file'])?>,
	lpn_dialog_ok: <?=json_encode($ec_lang['lpn_dialog_ok'])?>,
	lpn_file_import_inp: <?=json_encode($ec_lang['lpn_file_import_inp'])?>,
	lpn_file_import_inp_tip: <?=json_encode($ec_lang['lpn_file_import_inp_tip'])?>,
	lpn_inp_bad_file: <?=json_encode($ec_lang['lpn_inp_bad_file'])?>,
	lpn_net_bad_file: <?=json_encode($ec_lang['lpn_net_bad_file'])?>,
	lpn_inp_report_heading: <?=json_encode($ec_lang['lpn_inp_report_heading'])?>,
	lpn_inp_report_counts: <?=json_encode($ec_lang['lpn_inp_report_counts'])?>,
	lpn_inp_report_clean: <?=json_encode($ec_lang['lpn_inp_report_clean'])?>,
	lpn_inp_report_label_anchor: <?=json_encode($ec_lang['lpn_inp_report_label_anchor'])?>,
	lpn_inp_report_lead: <?=json_encode($ec_lang['lpn_inp_report_lead'])?>,
	lpn_inp_drop_headloss: <?=json_encode($ec_lang['lpn_inp_drop_headloss'])?>,
	lpn_inp_drop_tank_curve: <?=json_encode($ec_lang['lpn_inp_drop_tank_curve'])?>,
	lpn_inp_drop_tcv: <?=json_encode($ec_lang['lpn_inp_drop_tcv'])?>,
	lpn_inp_drop_valve: <?=json_encode($ec_lang['lpn_inp_drop_valve'])?>,
	lpn_inp_drop_valve_active: <?=json_encode($ec_lang['lpn_inp_drop_valve_active'])?>,
	lpn_inp_drop_cv: <?=json_encode($ec_lang['lpn_inp_drop_cv'])?>,
	lpn_inp_drop_demands: <?=json_encode($ec_lang['lpn_inp_drop_demands'])?>,
	lpn_inp_drop_patterns: <?=json_encode($ec_lang['lpn_inp_drop_patterns'])?>,
	lpn_inp_drop_emitters: <?=json_encode($ec_lang['lpn_inp_drop_emitters'])?>,
	lpn_inp_drop_curve_long: <?=json_encode($ec_lang['lpn_inp_drop_curve_long'])?>,
	lpn_inp_drop_curve_missing: <?=json_encode($ec_lang['lpn_inp_drop_curve_missing'])?>,
	lpn_inp_drop_pump_other: <?=json_encode($ec_lang['lpn_inp_drop_pump_other'])?>,
	lpn_inp_drop_setting: <?=json_encode($ec_lang['lpn_inp_drop_setting'])?>,
	lpn_inp_drop_controls: <?=json_encode($ec_lang['lpn_inp_drop_controls'])?>,
	lpn_inp_drop_eps: <?=json_encode($ec_lang['lpn_inp_drop_eps'])?>,
	lpn_inp_drop_quality: <?=json_encode($ec_lang['lpn_inp_drop_quality'])?>,
	lpn_inp_drop_backdrop: <?=json_encode($ec_lang['lpn_inp_drop_backdrop'])?>,
	lpn_inp_drop_dangling: <?=json_encode($ec_lang['lpn_inp_drop_dangling'])?>,
	lpn_inp_drop_units: <?=json_encode($ec_lang['lpn_inp_drop_units'])?>,
	lpn_import_no_room: <?=json_encode($ec_lang['lpn_import_no_room'])?>,
	lpn_status_imported: <?=json_encode($ec_lang['lpn_status_imported'])?>,
	lpn_file_type_desc: <?=json_encode($ec_lang['lpn_file_type_desc'])?>,
	lpn_status_file_opened: <?=json_encode($ec_lang['lpn_status_file_opened'])?>,
	lpn_status_already_open: <?=json_encode($ec_lang['lpn_status_already_open'])?>,
	lpn_status_already_open_dirty: <?=json_encode($ec_lang['lpn_status_already_open_dirty'])?>,
	lpn_status_saved: <?=json_encode($ec_lang['lpn_status_saved'])?>,
	lpn_status_reverted: <?=json_encode($ec_lang['lpn_status_reverted'])?>,
	lpn_close_save_confirm: <?=json_encode($ec_lang['lpn_close_save_confirm'])?>,
	lpn_close_browser_confirm: <?=json_encode($ec_lang['lpn_close_browser_confirm'])?>,
	lpn_close_discard: <?=json_encode($ec_lang['lpn_close_discard'])?>,
	lpn_cancel: <?=json_encode($ec_lang['lpn_cancel'])?>,
	lpn_revert_confirm: <?=json_encode($ec_lang['lpn_revert_confirm'])?>,
	lpn_file_needs_reopen: <?=json_encode($ec_lang['lpn_file_needs_reopen'])?>,
	lpn_file_write_failed: <?=json_encode($ec_lang['lpn_file_write_failed'])?>,
	lpn_file_changed_elsewhere: <?=json_encode($ec_lang['lpn_file_changed_elsewhere'])?>,
	lpn_lock_prompt_name: <?=json_encode($ec_lang['lpn_lock_prompt_name'])?>,
	lpn_lock_somebody: <?=json_encode($ec_lang['lpn_lock_somebody'])?>,
	lpn_lock_open_heading: <?=json_encode($ec_lang['lpn_lock_open_heading'])?>,
	lpn_lock_open_readonly: <?=json_encode($ec_lang['lpn_lock_open_readonly'])?>,
	lpn_lock_open_copy: <?=json_encode($ec_lang['lpn_lock_open_copy'])?>,
	lpn_lock_break: <?=json_encode($ec_lang['lpn_lock_break'])?>,
	lpn_lock_open_heading_times: <?=json_encode($ec_lang['lpn_lock_open_heading_times'])?>,
	lpn_lock_open_heading_unsaved: <?=json_encode($ec_lang['lpn_lock_open_heading_unsaved'])?>,
	lpn_lock_open_heading_saved: <?=json_encode($ec_lang['lpn_lock_open_heading_saved'])?>,
	lpn_lock_open_heading_seen: <?=json_encode($ec_lang['lpn_lock_open_heading_seen'])?>,
	lpn_lock_open_choices: <?=json_encode($ec_lang['lpn_lock_open_choices'])?>,
	lpn_ago_seconds: <?=json_encode($ec_lang['lpn_ago_seconds'])?>,
	lpn_ago_minutes: <?=json_encode($ec_lang['lpn_ago_minutes'])?>,
	lpn_ago_hours: <?=json_encode($ec_lang['lpn_ago_hours'])?>,
	lpn_ago_days: <?=json_encode($ec_lang['lpn_ago_days'])?>,
	lpn_ago_unknown: <?=json_encode($ec_lang['lpn_ago_unknown'])?>,
	lpn_lock_readonly_banner: <?=json_encode($ec_lang['lpn_lock_readonly_banner'])?>,
	lpn_lock_unavailable: <?=json_encode($ec_lang['lpn_lock_unavailable'])?>,
	lpn_lock_storage_error: <?=json_encode($ec_lang['lpn_lock_storage_error'])?>,
	lpn_lock_full_error: <?=json_encode($ec_lang['lpn_lock_full_error'])?>,
	lpn_lock_not_asked: <?=json_encode($ec_lang['lpn_lock_not_asked'])?>,
	lpn_lock_restored: <?=json_encode($ec_lang['lpn_lock_restored'])?>,
	lpn_lock_dismiss: <?=json_encode($ec_lang['lpn_lock_dismiss'])?>,
	lpn_file_relink: <?=json_encode($ec_lang['lpn_file_relink'])?>,
	lpn_file_reconnect: <?=json_encode($ec_lang['lpn_file_reconnect'])?>,
	lpn_file_reconnect_alert: <?=json_encode($ec_lang['lpn_file_reconnect_alert'])?>,
	lpn_saveas_same_file: <?=json_encode($ec_lang['lpn_saveas_same_file'])?>,
	lpn_saveas_overwrites_project: <?=json_encode($ec_lang['lpn_saveas_overwrites_project'])?>,
	lpn_saveas_overwrites_newer: <?=json_encode($ec_lang['lpn_saveas_overwrites_newer'])?>,
	lpn_file_save_tip: <?=json_encode($ec_lang['lpn_file_save_tip'])?>,
	lpn_file_saveas_tip: <?=json_encode($ec_lang['lpn_file_saveas_tip'])?>,
	lpn_file_saveas_tip_download: <?=json_encode($ec_lang['lpn_file_saveas_tip_download'])?>,
	lpn_file_upload_explain: <?=json_encode($ec_lang['lpn_file_upload_explain'])?>,
	lpn_status_uploaded: <?=json_encode($ec_lang['lpn_status_uploaded'])?>,
	lpn_status_downloaded: <?=json_encode($ec_lang['lpn_status_downloaded'])?>,
	lpn_file_training_1: <?=json_encode($ec_lang['lpn_file_training_1'])?>,
	lpn_file_training_2: <?=json_encode($ec_lang['lpn_file_training_2'])?>,
	lpn_file_training_3: <?=json_encode($ec_lang['lpn_file_training_3'])?>,
	lpn_file_training_permission: <?=json_encode($ec_lang['lpn_file_training_permission'])?>,
	lpn_file_training_name: <?=json_encode($ec_lang['lpn_file_training_name'])?>,
	lpn_file_training_continue: <?=json_encode($ec_lang['lpn_file_training_continue'])?>,
	lpn_prompt_project_name: <?=json_encode($ec_lang['lpn_prompt_project_name'])?>,
	lpn_status_closed_opened: <?=json_encode($ec_lang['lpn_status_closed_opened'])?>,
	lpn_status_closed_empty: <?=json_encode($ec_lang['lpn_status_closed_empty'])?>,
	lpn_storage_full: <?=json_encode($ec_lang['lpn_storage_full'])?>,
	lpn_backdrop_menu: <?=json_encode($ec_lang['lpn_backdrop_menu'])?>,
	lpn_backdrop_add: <?=json_encode($ec_lang['lpn_backdrop_add'])?>,
	lpn_backdrop_scale: <?=json_encode($ec_lang['lpn_backdrop_scale'])?>,
	lpn_backdrop_scale_entry: <?=json_encode($ec_lang['lpn_backdrop_scale_entry'])?>,
	lpn_backdrop_scale_from: <?=json_encode($ec_lang['lpn_backdrop_scale_from'])?>,
	lpn_backdrop_scale_from_prompt1: <?=json_encode($ec_lang['lpn_backdrop_scale_from_prompt1'])?>,
	lpn_backdrop_scale_from_prompt2: <?=json_encode($ec_lang['lpn_backdrop_scale_from_prompt2'])?>,
	lpn_backdrop_scale_entry_prompt: <?=json_encode($ec_lang['lpn_backdrop_scale_entry_prompt'])?>,
	lpn_backdrop_scale_entry_bad: <?=json_encode($ec_lang['lpn_backdrop_scale_entry_bad'])?>,
	lpn_backdrop_wld_bad: <?=json_encode($ec_lang['lpn_backdrop_wld_bad'])?>,
	lpn_backdrop_unreadable: <?=json_encode($ec_lang['lpn_backdrop_unreadable'])?>,
	lpn_backdrop_position: <?=json_encode($ec_lang['lpn_backdrop_position'])?>,
	lpn_backdrop_remove: <?=json_encode($ec_lang['lpn_backdrop_remove'])?>,
	lpn_backdrop_remove_confirm: <?=json_encode($ec_lang['lpn_backdrop_remove_confirm'])?>,
	lpn_backdrop_scale_prompt1: <?=json_encode($ec_lang['lpn_backdrop_scale_prompt1'])?>,
	lpn_backdrop_scale_prompt2: <?=json_encode($ec_lang['lpn_backdrop_scale_prompt2'])?>,
	lpn_backdrop_position_prompt1: <?=json_encode($ec_lang['lpn_backdrop_position_prompt1'])?>,
	lpn_backdrop_position_prompt2: <?=json_encode($ec_lang['lpn_backdrop_position_prompt2'])?>,
	lpn_backdrop_busy: <?=json_encode($ec_lang['lpn_backdrop_busy'])?>,
	lpn_backdrop_target_label: <?=json_encode($ec_lang['lpn_backdrop_target_label'])?>,
	lpn_backdrop_target_node: <?=json_encode($ec_lang['lpn_backdrop_target_node'])?>,
	lpn_backdrop_target_free: <?=json_encode($ec_lang['lpn_backdrop_target_free'])?>,
	lpn_backdrop_target_coords: <?=json_encode($ec_lang['lpn_backdrop_target_coords'])?>,
	lpn_backdrop_coords_prompt: <?=json_encode($ec_lang['lpn_backdrop_coords_prompt'])?>,
	lpn_backdrop_continue: <?=json_encode($ec_lang['lpn_backdrop_continue'])?>,
	lpn_tool_settings: <?=json_encode($ec_lang['lpn_tool_settings'])?>,
	lpn_settings_scope_project: <?=json_encode($ec_lang['lpn_settings_scope_project'])?>,
	lpn_settings_id_prefixes: <?=json_encode($ec_lang['lpn_settings_id_prefixes'])?>,
	lpn_settings_defaults: <?=json_encode($ec_lang['lpn_settings_defaults'])?>,
	lpn_settings_defaults_note: <?=json_encode($ec_lang['lpn_settings_defaults_note'])?>,
	lpn_settings_push_note: <?=json_encode($ec_lang['lpn_settings_push_note'])?>,
	lpn_settings_push_btn: <?=json_encode($ec_lang['lpn_settings_push_btn'])?>,
	lpn_push_confirm: <?=json_encode($ec_lang['lpn_push_confirm'])?>,
	lpn_push_properties: <?=json_encode($ec_lang['lpn_push_properties'])?>,
	lpn_push_elements: <?=json_encode($ec_lang['lpn_push_elements'])?>,
	lpn_push_none_displayed: <?=json_encode($ec_lang['lpn_push_none_displayed'])?>,
	lpn_push_nothing: <?=json_encode($ec_lang['lpn_push_nothing'])?>,
	lpn_push_no_change: <?=json_encode($ec_lang['lpn_push_no_change'])?>,
<?php // Scenarios (ROADMAP Task 184) -- the selector/readout in the map's status strip, the
      // override marker in every property row, and the two confirms that count what an action is
      // about to throw away. ?>
	lpn_scenario_label: <?=json_encode($ec_lang['lpn_scenario_label'])?>,
	lpn_scenario_base: <?=json_encode($ec_lang['lpn_scenario_base'])?>,
	lpn_scenario_overrides: <?=json_encode($ec_lang['lpn_scenario_overrides'])?>,
	lpn_scenario_tip: <?=json_encode($ec_lang['lpn_scenario_tip'])?>,
	lpn_scenario_new: <?=json_encode($ec_lang['lpn_scenario_new'])?>,
	lpn_scenario_new_name: <?=json_encode($ec_lang['lpn_scenario_new_name'])?>,
	lpn_scenario_prompt_name: <?=json_encode($ec_lang['lpn_scenario_prompt_name'])?>,
	lpn_scenario_rename: <?=json_encode($ec_lang['lpn_scenario_rename'])?>,
	lpn_scenario_delete: <?=json_encode($ec_lang['lpn_scenario_delete'])?>,
	lpn_scenario_delete_confirm: <?=json_encode($ec_lang['lpn_scenario_delete_confirm'])?>,
	lpn_scenario_override: <?=json_encode($ec_lang['lpn_scenario_override'])?>,
	lpn_scenario_override_tip: <?=json_encode($ec_lang['lpn_scenario_override_tip'])?>,
	lpn_scenario_base_value: <?=json_encode($ec_lang['lpn_scenario_base_value'])?>,
	lpn_scenario_deactivated: <?=json_encode($ec_lang['lpn_scenario_deactivated'])?>,
	lpn_scenario_push_btn: <?=json_encode($ec_lang['lpn_scenario_push_btn'])?>,
	lpn_scenario_push_tip: <?=json_encode($ec_lang['lpn_scenario_push_tip'])?>,
	lpn_scenario_push_confirm: <?=json_encode($ec_lang['lpn_scenario_push_confirm'])?>,
	lpn_scenario_push_scenarios: <?=json_encode($ec_lang['lpn_scenario_push_scenarios'])?>,
	lpn_scenario_push_values: <?=json_encode($ec_lang['lpn_scenario_push_values'])?>,
	lpn_scenario_push_none: <?=json_encode($ec_lang['lpn_scenario_push_none'])?>,
	lpn_delete_drops_overrides: <?=json_encode($ec_lang['lpn_delete_drops_overrides'])?>,
	lpn_push_base_only: <?=json_encode($ec_lang['lpn_push_base_only'])?>,
	lpn_field_active: <?=json_encode($ec_lang['lpn_field_active'])?>,
	lpn_field_active_tip: <?=json_encode($ec_lang['lpn_field_active_tip'])?>,
<?php // lpn_settings_emitter_exponent is deliberately NOT wired here: its Settings row was removed
      // 2026-07-30 because nothing can create an emitter yet (ROADMAP Task 191). The language key
      // stays in lib/lang.ec.en.php so restoring the control is one line here and one there. ?>

	lpn_settings_computation: <?=json_encode($ec_lang['lpn_settings_computation'])?>,
	lpn_settings_scope_calculator: <?=json_encode($ec_lang['lpn_settings_scope_calculator'])?>,
	lpn_settings_show_titles: <?=json_encode($ec_lang['lpn_settings_show_titles'])?>,
	lpn_settings_show_titles_tip: <?=json_encode($ec_lang['lpn_settings_show_titles_tip'])?>,
	lpn_settings_tolerance: <?=json_encode($ec_lang['lpn_settings_tolerance'])?>,
	lpn_settings_tolerance_tip: <?=json_encode($ec_lang['lpn_settings_tolerance_tip'])?>,
	lpn_settings_engine_epanet: <?=json_encode($ec_lang['lpn_settings_engine_epanet'])?>,
	lpn_settings_engine_epanet_tip: <?=json_encode($ec_lang['lpn_settings_engine_epanet_tip'])?>,
	lpn_engine_loading: <?=json_encode($ec_lang['lpn_engine_loading'])?>,
	lpn_engine_failed: <?=json_encode($ec_lang['lpn_engine_failed'])?>,
	lpn_engine_valve_route: <?=json_encode($ec_lang['lpn_engine_valve_route'])?>,
	lpn_engine_manning_note: <?=json_encode($ec_lang['lpn_engine_manning_note'])?>,
	lpn_engine_minor_loss_note: <?=json_encode($ec_lang['lpn_engine_minor_loss_note'])?>,
	lpn_unit_unknown: <?=json_encode($ec_lang['lpn_unit_unknown'])?>,
	lpn_settings_text_size: <?=json_encode($ec_lang['lpn_settings_text_size'])?>,
	lpn_settings_symbol_size: <?=json_encode($ec_lang['lpn_settings_symbol_size'])?>,
	lpn_settings_link_width: <?=json_encode($ec_lang['lpn_settings_link_width'])?>,
	lpn_settings_align_labels: <?=json_encode($ec_lang['lpn_settings_align_labels'])?>,
	lpn_settings_readability_bias: <?=json_encode($ec_lang['lpn_settings_readability_bias'])?>,
	lpn_settings_mask_labels: <?=json_encode($ec_lang['lpn_settings_mask_labels'])?>,
	lpn_settings_label_max_width: <?=json_encode($ec_lang['lpn_settings_label_max_width'])?>,
	lpn_settings_label_use_view: <?=json_encode($ec_lang['lpn_settings_label_use_view'])?>,
	lpn_settings_label_always: <?=json_encode($ec_lang['lpn_settings_label_always'])?>,
	lpn_settings_symbol_opacity: <?=json_encode($ec_lang['lpn_settings_symbol_opacity'])?>,
	lpn_settings_backdrop_opacity: <?=json_encode($ec_lang['lpn_settings_backdrop_opacity'])?>,
	lpn_settings_map_display: <?=json_encode($ec_lang['lpn_settings_map_display'])?>,
	lpn_settings_legend_position: <?=json_encode($ec_lang['lpn_settings_legend_position'])?>,
	lpn_settings_legend_top_left: <?=json_encode($ec_lang['lpn_settings_legend_top_left'])?>,
	lpn_settings_legend_top_right: <?=json_encode($ec_lang['lpn_settings_legend_top_right'])?>,
	lpn_settings_legend_middle_left: <?=json_encode($ec_lang['lpn_settings_legend_middle_left'])?>,
	lpn_settings_legend_middle_right: <?=json_encode($ec_lang['lpn_settings_legend_middle_right'])?>,
	lpn_settings_legend_bottom_left: <?=json_encode($ec_lang['lpn_settings_legend_bottom_left'])?>,
	lpn_settings_legend_bottom_right: <?=json_encode($ec_lang['lpn_settings_legend_bottom_right'])?>,
<?php // Colour by value (ROADMAP Task 384) and the thematic map (Task 327) -- the Settings panel's
      // "Color by value" section and the on-map colour key. ?>
	lpn_settings_colors: <?=json_encode($ec_lang['lpn_settings_colors'])?>,
	lpn_settings_color_node_field: <?=json_encode($ec_lang['lpn_settings_color_node_field'])?>,
	lpn_settings_color_link_field: <?=json_encode($ec_lang['lpn_settings_color_link_field'])?>,
	lpn_settings_color_ramp: <?=json_encode($ec_lang['lpn_settings_color_ramp'])?>,
	lpn_color_ramp_epanet: <?=json_encode($ec_lang['lpn_color_ramp_epanet'])?>,
	lpn_color_ramp_viridis: <?=json_encode($ec_lang['lpn_color_ramp_viridis'])?>,
	lpn_color_ramp_gray: <?=json_encode($ec_lang['lpn_color_ramp_gray'])?>,
	lpn_settings_color_reverse: <?=json_encode($ec_lang['lpn_settings_color_reverse'])?>,
	lpn_color_none: <?=json_encode($ec_lang['lpn_color_none'])?>,
	lpn_settings_color_thematic: <?=json_encode($ec_lang['lpn_settings_color_thematic'])?>,
	lpn_settings_color_thematic_tip: <?=json_encode($ec_lang['lpn_settings_color_thematic_tip'])?>,
	lpn_settings_color_key_position: <?=json_encode($ec_lang['lpn_settings_color_key_position'])?>,
	lpn_settings_color_breaks: <?=json_encode($ec_lang['lpn_settings_color_breaks'])?>,
	lpn_settings_color_breaks_note: <?=json_encode($ec_lang['lpn_settings_color_breaks_note'])?>,
	lpn_settings_color_equal_intervals: <?=json_encode($ec_lang['lpn_settings_color_equal_intervals'])?>,
	lpn_settings_color_equal_counts: <?=json_encode($ec_lang['lpn_settings_color_equal_counts'])?>,
	lpn_settings_color_auto: <?=json_encode($ec_lang['lpn_settings_color_auto'])?>,
	lpn_settings_color_no_values: <?=json_encode($ec_lang['lpn_settings_color_no_values'])?>,
	calc_defaults: <?=json_encode($ec_lang['calc_defaults'])?>,
	lpn_confirm_restore_defaults: <?=json_encode($ec_lang['lpn_confirm_restore_defaults'])?>,
	lpn_settings_wipe_btn: <?=json_encode($ec_lang['lpn_settings_wipe_btn'])?>,
	lpn_confirm_wipe: <?=json_encode($ec_lang['lpn_confirm_wipe'])?>
};
</script>
<script src="/engcalcs/js/PipeHydraulics.lib.js?v=<?=filemtime(__DIR__.'/js/PipeHydraulics.lib.js')?>"></script>
<script src="/engcalcs/js/lpn-solver.js?v=<?=filemtime(__DIR__.'/js/lpn-solver.js')?>"></script>
<script src="/engcalcs/js/lpn-epanet.js?v=<?=filemtime(__DIR__.'/js/lpn-epanet.js')?>"></script>
<script src="/engcalcs/js/lpn-inp.js?v=<?=filemtime(__DIR__.'/js/lpn-inp.js')?>"></script>
<script src="/engcalcs/js/lpn-net.js?v=<?=filemtime(__DIR__.'/js/lpn-net.js')?>"></script>
<?php // The pure geometry/collision halves of the map editor (ROADMAP Task 293) -- must precede
      // looped-network.js, which reads EngCalcs.lpnGeom/lpnCollide as it defines itself. ?>
<script src="/engcalcs/js/lpn-geom.js?v=<?=filemtime(__DIR__.'/js/lpn-geom.js')?>"></script>
<script src="/engcalcs/js/lpn-collide.js?v=<?=filemtime(__DIR__.'/js/lpn-collide.js')?>"></script>
<script src="/engcalcs/js/looped-network.js?v=<?=filemtime(__DIR__.'/js/looped-network.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs", false, false, false); // no site-nav row, no legal row (both live in the Help
// menu), and no W3C validator badges -- those only appear in DEBUG_MODE, but on a full-window map
// editor anything below the canvas is drawing room, and in dev they were a scrollable strip under
// the map (Tom, 2026-08-15).
// and the examples gallery instead (Task 314). The consent BANNER and the service worker still
// render -- those are not footer furniture, and echoFooter() emits them regardless.
// Omit last closing tag is good practice
