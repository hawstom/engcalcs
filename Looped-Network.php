<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['lpn_main_title'];
$html_desc = $ec_lang['lpn_main_desc'];
// **NO "Save this calculation" BOX ON THIS PAGE** (Tom, 2026-08-18). The fourth argument hides it.
// That box names a calculation and puts the name in the URL, which is exactly right for a
// form-and-an-answer page and meaningless here: an lpn project is saved to a FILE or to the browser
// library, and File > Save is the control that does it.
echoHeader("EngCalcs", $html_title, "", false);
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
	<?php // **TWO GROUPS, AND THE HEADINGS ARE THE POINT** (ROADMAP Task 422, Tom 2026-08-18). The
	      // top row decides what the numbers in the DOCUMENT mean -- changing one is a model change,
	      // and js/looped-network.js asks before it happens. The bottom row is pure display: the
	      // solve is untouched, so it changes with no fanfare.
	      //
	      // Three quantities appear in BOTH rows because they genuinely serve both sides. That is a
	      // duplication on purpose, not one to be tidied away: a demand and a solved flow are two
	      // different numbers that happen to share a dimension. ?>
	<?php // **EACH SELECTOR IS TWO LINES: THE NAME ABOVE, THE CONTROL BELOW** (ROADMAP Task 424, Tom
	      // 2026-08-18, twice). Side by side, eleven name+select pairs make the widest thing in the
	      // Settings box by a distance, and the box then has to be as wide as the strip. Stacked, a
	      // pair is as wide as the longer of its two halves instead of their sum, so the whole strip
	      // wraps into a couple of tidy rows inside a sensible box.
	      //
	      // A <span> per pair, not a <label>: echoUnitSelect() emits a `name=` and no `id=`, so a
	      // <label for> has nothing to point at and a wrapping <label> would make the name text a
	      // second click target for the select -- which on a narrow box means a stray tap opens a
	      // dropdown the user was only reading. ?>
	<div class="d-print-none" id="lpn_units_strip">
		<div id="lpn_units_inputs" class="lpn-units-group">
		<span class="lpn-units-head"><?=$ec_lang['lpn_units_group_inputs']?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_units_length']?></span><?php echoUnitSelect('lpn_u_length', 'distance_site', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_field_diameter']?></span><?php echoUnitSelect('lpn_u_diameter', 'distance_small', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_units_elevhead']?></span><?php echoUnitSelect('lpn_u_elevhead', 'total_head', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_units_pressure']?></span><?php echoUnitSelect('lpn_u_pressure', 'partial_head', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_units_flow']?></span><?php echoUnitSelect('lpn_u_flow', 'flow_epanet', ''); ?></span>
		<span class="lpn-units-item" id="lpn_u_roughness_row"><span class="lpn-units-name"><?=$ec_lang['lpn_field_roughness']?></span><?php echoUnitSelect('lpn_u_roughness', 'roughness', ''); ?></span>
		</div>
		<div id="lpn_units_results" class="lpn-units-group">
		<span class="lpn-units-head"><?=$ec_lang['lpn_units_group_results']?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_result_head']?></span><?php echoUnitSelect('lpn_u_r_elevhead', 'total_head', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_result_pressure']?></span><?php echoUnitSelect('lpn_u_r_pressure', 'partial_head', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_result_flow']?></span><?php echoUnitSelect('lpn_u_r_flow', 'flow_epanet', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_units_velocity']?></span><?php echoUnitSelect('lpn_u_velocity', 'velocity', ''); ?></span>
		<span class="lpn-units-item"><span class="lpn-units-name"><?=$ec_lang['lpn_result_gradient']?></span><?php echoUnitSelect('lpn_u_gradient', 'gradient', ''); ?></span>
		</div>
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
	<input type="file" id="lpn_project_file" accept=".lwn,.json,application/json" style="display:none">
	<?php // EPANET import (Task 196). A SECOND picker rather than another accept type on the one
	      // above: the two feed different readers, and one input serving both would have to guess
	      // which from the extension -- a guess whose wrong answer is silent.
	      // BOTH of EPANET's formats: .inp is its documented text interchange format, .net is what
	      // its Windows UI saves when you press Save. The accept list only filters the PICKER; which
	      // format a chosen file really is gets decided from its first bytes, not its name. ?>
	<input type="file" id="lpn_inp_file" accept=".inp,.net,text/plain" style="display:none">
	<?php // File > Open as lat/lon… (Task 447). THE ONE PICKER THAT TAKES BOTH KINDS, because the row
	      // it serves is the recovery path for a lon/lat network in either kind of file. Which reader
	      // a chosen file goes to is decided from its first character -- a project file is JSON --
	      // never from its name, so the accept list only tidies the picker. ?>
	<input type="file" id="lpn_geo_file" accept=".lwn,.json,.inp,.net,application/json,text/plain" style="display:none">
	<?php // Floating "choose target mode" step of the Position sequence (Task 146 Phase 2) --
	      // mirrors #lpn_settings_box's static-PHP-plus-JS-clamped-position pattern (position:fixed,
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
		<div id="lpn_map_overlay_tl" class="d-print-none" style="position:absolute;top:4px;left:4px;right:calc(4px + var(--lpn-overlay-right, 0px));display:flex;flex-direction:column;align-items:flex-start;gap:4px;pointer-events:none">
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
		<?php // THE PLACEMENT BAR (ROADMAP Task 145). Top-CENTRE of the map, not the top-left stack:
		      // it is a modal-for-the-duration control rather than a readout, and it must not cover
		      // the mode hint or the solver's diagnostic. pointer-events on -- unlike every other
		      // overlay here, this one is buttons.
		      //
		      // STATIC MARKUP, filled and shown by georefRefreshBar() in looped-network.js, for the
		      // same reason #lpn_backdrop_target_panel is static: the strings are language keys and
		      // PHP is where those live. ?>
		<div id="lpn_georef_bar" class="d-print-none" style="display:none;position:absolute;top:4px;left:50%;transform:translateX(-50%);z-index:6;max-width:92%;font-size:12px;background:#fff;border:1px solid #05a;padding:6px 10px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
			<?php // WHICH STEP YOU ARE IN, SAID OUT LOUD (Tom, 2026-08-18: "there is an uncomfortable
			      // gray area between the described modes"). Filled by georefRefreshBar(); its text
			      // and the Detach button's are English literals in looped-network.js until their
			      // language keys exist, because a translation sprint owns lib/lang.ec.en.php. ?>
			<div id="lpn_georef_step" style="margin-bottom:2px;font-weight:bold"></div>
			<div id="lpn_georef_hint" style="margin-bottom:4px"></div>
			<span id="lpn_georef_numbers" style="display:none">
				<label><?=ecTipLabel($ec_lang['lpn_georef_scale'], $ec_lang['lpn_georef_scale_tip'])?>
					<input type="number" id="lpn_georef_scale_in" step="any" style="width:7em">
					<span id="lpn_georef_unit"></span></label>
				<label><?=ecTipLabel($ec_lang['lpn_georef_rotation'], $ec_lang['lpn_georef_rotation_tip'])?>
					<input type="number" id="lpn_georef_rot_in" step="any" style="width:5em"></label>
			</span>
			<button type="button" id="lpn_georef_goto"><?=$ec_lang['lpn_georef_goto']?></button>
			<?php // Shown in step 1 only, and only when every coordinate could also be a lon/lat pair
			      // (georefRefreshBar). It is the reinterpret case, which used to be a range test
			      // deciding for the user -- and deciding wrong for any drawing on a small grid. ?>
			<button type="button" id="lpn_georef_asdeg" style="display:none"><?=ecTipLabel($ec_lang['lpn_georef_asdeg_btn'], $ec_lang['lpn_georef_asdeg_tip'])?></button>
			<button type="button" id="lpn_georef_drop"><?=$ec_lang['lpn_georef_drop']?></button>
			<button type="button" id="lpn_georef_detach"></button>
			<button type="button" id="lpn_georef_finish"><?=$ec_lang['lpn_georef_finish']?></button>
			<button type="button" id="lpn_georef_cancel"><?=$ec_lang['lpn_georef_cancel']?></button>
		</div>
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
		<div id="lpn_map_footer" class="d-print-none" style="position:absolute;bottom:4px;left:4px;right:calc(4px + var(--lpn-overlay-right, 0px));display:flex;flex-wrap:wrap;gap:4px 8px;align-items:flex-end;pointer-events:none;font-size:11px">
			<?php // What the numbers on the map ARE. Map labels are bare numbers by design, so without
			      // this a first-time visitor cannot tell gpm from l/s -- they get US on an English
			      // page and SI on every other, and nothing said which. Filled by refreshMapStatus(). ?>
			<?php // WHICH SCENARIO the drawing is showing and solving, and how many values that
			      // scenario holds of its own (ROADMAP Task 184). A readout you can click: the same
			      // control answers "what am I working on right now" and switches, creates, renames
			      // and deletes. pointer-events:auto because the strip itself is inert -- it is an
			      // overlay over the map, and this is the one thing in it that is not just a
			      // readout. Filled and wired by refreshScenarioStatus()/wireScenarioButton(). ?>
			<?php // THE SATELLITE TEASER (ROADMAP Task 452). Tom, 2026-08-22: *"It's live, but the
			      // interface has no way to activate it. Should there be a little 'satellite' teaser
			      // tile/button in the corner of the map like at Google Maps?"* There WAS a way --
			      // View > Show satellite images -- but the row carries `hidden: !isGeoProject() ||
			      // !satelliteAvailable()`, so on a grid project it does not exist at all, and on a
			      // geographic one it is four rows down a menu.
			      //
			      // A CELL OF THIS STRIP, NOT A SEVENTH CORNER. The two legends can each be parked in
			      // any of six corners and the tile attribution owns the seventh, so a teaser in a
			      // corner of its own has nowhere it cannot collide. This strip is already the
			      // bottom-left band, is already what zoomExtent() reserves against
			      // (overlayReserve('lpn_map_footer')), already wraps on a narrow window and is
			      // already d-print-none -- which is the whole list of things a teaser needs.
			      //
			      // THE THUMBNAIL IS DRAWN, NOT FETCHED. A real satellite tile behind this button
			      // would be a third-party request made before the user asked for one, which is
			      // precisely what the basemap is opt-in to avoid. It is CSS, in css/engcalcs.css.
			      // Shown, labelled and wired by refreshBasemapTeaser() in looped-network.js. ?>
			<button type="button" id="lpn_basemap_teaser" class="lpn-basemap-teaser" style="display:none"></button>
			<button type="button" id="lpn_scenario_btn" style="pointer-events:auto;font-size:11px;background:rgba(255,255,255,.8);padding:2px 6px;border:1px solid #bbb"></button>
			<div id="lpn_map_status" style="background:rgba(255,255,255,.8);padding:2px 6px"></div>
			<?php // Monospace, and only this one: the X/Y digits change on every pointer move, and a
			      // proportional font makes the whole readout jitter as they do. ?>
			<div id="lpn_coords" style="font-family:monospace;background:rgba(255,255,255,.8);padding:2px 6px">X: --  Y: --</div>
		</div>
		<?php // THE OPENSTREETMAP ATTRIBUTION (ROADMAP Task 145). Required by the OSM tile usage
		      // policy whenever a tile is on screen, and therefore NOT dismissible: the only thing
		      // that removes it is View > Hide street map, which also removes the tiles.
		      //
		      // Deliberately NOT d-print-none, unlike every other overlay on this map: the tiles are
		      // drawn inside the SVG and therefore DO print, so a printed sheet needs the credit on
		      // it as much as the screen does.
		      //
		      // The credit text is NOT a language key. It is the wording the licence asks for, it
		      // names a project rather than describing a control, and it must read the same on all
		      // 27 languages of this page -- a translated legal credit is a different credit.
		      //
		      // Its own corner, not a cell of #lpn_map_footer: the footer is left-packed and hidden
		      // on print, and this has to survive both. Shown and hidden by refreshBasemapCredit(). ?>
		<div id="lpn_basemap_credit" style="display:none;position:absolute;bottom:4px;right:calc(4px + var(--lpn-overlay-right, 0px));z-index:4;font-size:10px;line-height:1.4;background:rgba(255,255,255,.85);padding:1px 5px"><!-- Required attribution, one set per tile source; js/looped-network.js shows the set whose tiles are on screen. Mapbox's terms name Mapbox and its imagery supplier as well as OpenStreetMap, so the satellite set is not a superset of the street one. --><span data-basemap-credit="osm"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a></span><span data-basemap-credit="satellite" style="display:none"><!-- Mapbox's required attribution is the WORDMARK plus three links with their exact labels and URLs (ROADMAP Task 489, docs.mapbox.com/help/getting-started/attribution/). The mark is a CSS data: URI (.lpn-mapbox-logo), never an image fetched from Mapbox: no request may reach them before the visitor turns satellite on. Maxar is the imagery supplier and is credited beside them. --><a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener" title="Mapbox"><span class="lpn-mapbox-logo" role="img" aria-label="Mapbox"></span></a> <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a> <a href="https://www.maxar.com/" target="_blank" rel="noopener">© Maxar</a> <a href="https://apps.mapbox.com/feedback/" target="_blank" rel="noopener">Improve this map</a></span></div>
	</div>
</form>
<?php // ---- THE BOTTOM PANE (ROADMAP Task 434) ----------------------------------------------------
      //
      // One resizable panel docked under the map, carrying a TAB for each thing that is read while
      // the map is edited -- the profile now, the tabular editors (Junctions, Pipes, Pumps, Valves)
      // next. Tom, 2026-08-18, naming the frame every one of Tasks 284, 427, 433 and 146.04 kept
      // reaching for separately: decide the container once, or each of them invents a different one.
      //
      // **IN NORMAL FLOW, AND THAT IS THE WHOLE MECHANISM.** applyMapHeight() sizes the canvas from
      // `body.bottom - svg.bottom`, so a block that really sits below the map is already subtracted
      // from the map's height by measurement. Nothing here tells the canvas how tall to be; opening,
      // closing or dragging the pane is an ENVIRONMENT event that asks it to measure again.
      // A `position: fixed` overlay would have needed its height sent to the canvas by hand, which
      // is a second source of truth for the one number Task 432 just finished making measured.
      //
      // OUTSIDE #formInput, unlike the map: the tab bodies hold ordinary inputs, and a stray Enter
      // in one of them must not submit the calculator form.
      //
      // Settings and Labels are NOT tabs here. Both live in the Settings box (Task 441); neither is
      // something you read beside the drawing. ?>
<?php // ---- THE RIGHT PANEL: EMPTY, AND KEPT ON PURPOSE (ROADMAP Tasks 427, 434 and 441) ----
      //
      // Tom, 2026-08-18, superseding the panel that shipped the same day: "I think we can make this
      // a better application ... by abandoning the right pane altogether and focusing instead on a
      // single grand two-paned, indexed, draggable, and closeable settings box that includes even
      // labels ... For now we can keep the right pane, but empty it."
      //
      // So Labels and Color by value moved OUT, into #lpn_settings_box below, and this is the frame
      // with nothing in it: the toggle still works, the grip still drags, and the next thing that is
      // genuinely READ BESIDE THE DRAWING can dock here without any of that being rebuilt. It is not
      // a dead panel to delete -- it is the empty half of a decision Tom has explicitly deferred.
      //
      // **IT MUST NOT COVER THE LABEL LEGEND** (Tom, same day: "the right pane covers the map,
      // including the labels legend"). Being open pushes the map's overlay stack in from the right
      // by the panel's width -- see applyMapOverlayInset() in js/looped-network.js -- so a
      // right-positioned legend sits beside the panel rather than under it.
      //
      // AN OVERLAY ON THE MAP, not a column beside it: the canvas height is MEASURED (Task 432) and
      // a docked column would make its WIDTH a second measured number in the same layout.
      //
      // position:fixed and OUTSIDE #formInput, for the same reason the bottom pane is outside it:
      // a stray Enter in an input must not submit the calculator form. Being fixed, it is placed
      // from the canvas's own rect by positionRightPane(). ?>
<div id="lpn_rpane" class="d-print-none lpn-rpane" style="display:none" role="region" aria-labelledby="lpn_rpane_title">
	<?php // The grip is the panel's left EDGE, matching the bottom pane's top edge. ?>
	<div id="lpn_rpane_grip" class="lpn-rpane-grip" role="separator" aria-orientation="vertical"
		title="<?=htmlspecialchars($ec_lang['lpn_pane_resize'])?>"
		aria-label="<?=htmlspecialchars($ec_lang['lpn_pane_resize'])?>"></div>
	<div class="lpn-rpane-inner">
	<div class="lpn-rpane-head">
		<div id="lpn_rpane_title" class="lpn-rpane-title"><?=$ec_lang['lpn_pane_right_toggle']?></div>
		<button type="button" id="lpn_rpane_close" class="lpn-pane-x" title="<?=htmlspecialchars($ec_lang['lpn_close'])?>" aria-label="<?=htmlspecialchars($ec_lang['lpn_close'])?>">&times;</button>
	</div>
	<div class="lpn-rpane-body">
		<?php // An empty panel SAYS it is empty and says where its contents went. A blank white
		      // rectangle over the map reads as a panel that failed to load. ?>
		<p id="lpn_rpane_empty" class="lpn-rpane-empty"><?=$ec_lang['lpn_rpane_empty']?></p>
	</div>
	</div>
</div>
<div id="lpn_pane" class="d-print-none lpn-pane" style="display:none">
	<?php // The drag handle is the pane's top EDGE, which is where a person aims. role="separator"
	      // with an aria-label rather than a tip glyph: it is a grip, not a labelled control, and a
	      // help glyph on it would put a character to miss in the middle of the drag target. ?>
	<div id="lpn_pane_grip" class="lpn-pane-grip" role="separator" aria-orientation="horizontal"
		title="<?=htmlspecialchars($ec_lang['lpn_pane_resize'])?>"
		aria-label="<?=htmlspecialchars($ec_lang['lpn_pane_resize'])?>"></div>
	<div id="lpn_pane_head" class="lpn-pane-head">
		<div id="lpn_pane_tabs" class="lpn-pane-tabs" role="tablist"></div>
		<button type="button" id="lpn_pane_close" class="lpn-pane-x" title="<?=htmlspecialchars($ec_lang['lpn_close'])?>" aria-label="<?=htmlspecialchars($ec_lang['lpn_close'])?>">&times;</button>
	</div>
	<div id="lpn_pane_body" class="lpn-pane-body">
		<?php // ---- Tab: Profile (Task 409, moved here by Task 433) ----
		      // The ground and the hydraulic grade line along one route. It lives here rather than in
		      // a floating box because it is READ WHILE THE MAP IS EDITED and it redraws on every
		      // solve -- and because as a popup it was, in Tom's words, too small: a proof of
		      // concept. Everything inside #lpn_profile_form and #lpn_profile_chart is built in JS,
		      // since the node lists and the chart both depend on the document. ?>
		<div id="lpn_pane_profile" class="lpn-pane-panel lpn-profile-panel" role="tabpanel" aria-labelledby="lpn_pane_tab_profile">
			<div class="lpn-profile-controls">
				<?php // The tab says "Profile"; this says WHICH profile -- a route through the
				      // network, not a section of one pipe. It is the panel's own title and stays
				      // even when the tab strip grows. ?>
				<div class="lpn-profile-heading"><?=$ec_lang['lpn_profile_title']?></div>
				<div id="lpn_profile_form"></div>
				<?php // The key is STATIC HTML, not JS: these three names never change with the
				      // document, and a swatch beside each is the whole of what a legend has to be. ?>
				<div class="lpn-profile-key">
					<span><i class="lpn-profile-key-ground"></i><?=$ec_lang['lpn_profile_ground']?></span>
					<span><i class="lpn-profile-key-hgl"></i><?=$ec_lang['lpn_profile_hgl']?></span>
					<span><i class="lpn-profile-key-band"></i><?=$ec_lang['lpn_result_pressure']?></span>
				</div>
				<div id="lpn_profile_note"></div>
			</div>
			<div id="lpn_profile_chart"></div>
		</div>
		<?php // ---- Tabs: one ASSET TABLE per type (Task 434, all six since Task 455) ----
		      // The document as a spreadsheet, built entirely in JS: the rows are the network and
		      // the headings carry the current units. Every write goes through the same seam the
		      // property popup uses -- setProp() for an overridable property -- see
		      // renderPaneTable() and PANE_TABLES, which is the ONE renderer all six share.
		      //
		      // ONE HOST DIV PER TYPE, and that is what gives each type its own SCROLL POSITION for
		      // free: a scroll offset belongs to the element that scrolls, so six elements keep six
		      // offsets and nothing has to remember them. A single host reused by six tabs would
		      // have one, and sorting Pipes would land the reader halfway down Junctions.
		      //
		      // Text is NOT here and is not coming: nothing about a text label solves, so a table
		      // of them would have no column worth reading (Task 455). ?>
		<div id="lpn_pane_junctions" class="lpn-pane-panel lpn-pane-scroll" role="tabpanel" aria-labelledby="lpn_pane_tab_junctions"></div>
		<div id="lpn_pane_reservoirs" class="lpn-pane-panel lpn-pane-scroll" role="tabpanel" aria-labelledby="lpn_pane_tab_reservoirs"></div>
		<div id="lpn_pane_tanks" class="lpn-pane-panel lpn-pane-scroll" role="tabpanel" aria-labelledby="lpn_pane_tab_tanks"></div>
		<div id="lpn_pane_pipes" class="lpn-pane-panel lpn-pane-scroll" role="tabpanel" aria-labelledby="lpn_pane_tab_pipes"></div>
		<div id="lpn_pane_pumps" class="lpn-pane-panel lpn-pane-scroll" role="tabpanel" aria-labelledby="lpn_pane_tab_pumps"></div>
		<div id="lpn_pane_valves" class="lpn-pane-panel lpn-pane-scroll" role="tabpanel" aria-labelledby="lpn_pane_tab_valves"></div>
	</div>
</div>
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
<?php // Find panel (Tasks 420 and 353). A PULL-DOWN, not a modal dialog: EPANET's Map Finder is
      // modeless for a reason -- you find something, look at the map, and search again without the
      // panel ever taking the map away. Everything inside is built in JS (wireFindPopup()), because
      // the property and condition lists depend on which kind of element you chose. ?>
<div id="lpn_find_popup" class="d-print-none lpn-popover" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:40px 8px 8px;box-shadow:2px 2px 6px rgba(0,0,0,.3);max-width:22rem">
	<?php // The padded band at the top is the DRAG SURFACE, exactly as on #lpn_popup: `e.target` is
	      // the panel itself there and a child everywhere else, so a drag can never start on a
	      // control. That is why the padding is 40px on top and 8px elsewhere. ?>
	<button type="button" id="lpn_find_close" class="lpn-popover-x" title="<?=htmlspecialchars($ec_lang['lpn_close'])?>" aria-label="<?=htmlspecialchars($ec_lang['lpn_close'])?>">&times;</button>
	<div class="lpn-popover-body">
	<div style="font-weight:bold"><?=$ec_lang['lpn_find_title']?></div>
	<div id="lpn_find_form"></div>
	<div id="lpn_find_results"></div>
	</div>
</div>
<?php // ---- THE SETTINGS BOX (ROADMAP Task 441, absorbing 284) ----
      //
      // Tom, 2026-08-18: "a single grand two-paned, indexed, draggable, and closeable settings box
      // that includes even labels ... Combine Labels settings, present design Settings, Time
      // settings (from the bottom pane), and Coloring into the Settings box with a simple rule:
      // 'If it's for the entire project, it's in Settings.'"
      //
      // **THE MEMBERSHIP RULE IS HIS, AND IT IS THE WHOLE DESIGN.** Anything that applies to the
      // entire project belongs here; anything that applies to ONE element stays in the property
      // popup, which Tom calls good. That is why Labels is in (which fields the whole map prints)
      // and a Text element's own words are not.
      //
      // A BOX, NOT A PULL-DOWN. It has a close X and it drags by its chrome, exactly like the
      // property popup and Find -- which is what Tom asked for, and which reverses the 2026-08-13
      // "these are pull-downs, an X is not idiomatic" ruling for THIS panel only. That ruling was
      // about small anchored menus; this is a two-pane box you work in while looking at the map,
      // and a box you can neither move nor close would be in the way of the drawing it configures.
      //
      // TWO PANES, NO COLLAPSING (Tom, 2026-08-11, from epanet-js, raised to the governing paradigm
      // 2026-08-18): "the Settings box has a left 'index' pane and a right 'content' pane ... And
      // the right pane never collapses. This is a very conventional web paradigm." Both panes are
      // built in JS, because the index is DERIVED from the content -- a hand-written index is a
      // second list that silently loses a heading.
      //
      // NOT DOCKED, and deliberately not designed against docking. Tom: "I wonder if it can
      // eventually even be smart enough to dock left or right or to anchor and flyout ... like an
      // AutoCAD palette." Nothing here assumes a floating box: the whole thing is one element with
      // one placement function, so a future dock changes where it is put and nothing about what is
      // in it. ?>
<div id="lpn_settings_box" class="d-print-none lpn-popover lpn-setbox" style="display:none;position:fixed;z-index:22;background:#fff;border:1px solid #333;padding:40px 8px 8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)" role="dialog" aria-labelledby="lpn_setbox_title">
	<?php // The padded band at the top is the DRAG SURFACE, exactly as on #lpn_popup and #lpn_find_popup:
	      // `e.target` is the box itself there and a child everywhere else, so a drag can never start
	      // on a control. That is why the padding is 40px on top and 8px elsewhere. ?>
	<div id="lpn_setbox_title" class="lpn-setbox-title"><?=$ec_lang['lpn_menu_settings']?></div>
	<button type="button" id="lpn_setbox_close" class="lpn-popover-x" title="<?=htmlspecialchars($ec_lang['lpn_close'])?>" aria-label="<?=htmlspecialchars($ec_lang['lpn_close'])?>">&times;</button>
	<div class="lpn-popover-body lpn-setbox-body">
		<?php // **THE SEARCH BOX MATCHES TIPS AS WELL AS TITLES** (Tom, same ruling). It is cheap
		      // because every row here already carries a tip, and it is what makes an index this long
		      // usable: the user knows the WORD ("roughness", "opacity", "pattern") long before they
		      // know which of four sections it is filed under. type=search, so the browser's own
		      // clear button comes free. ?>
		<div class="lpn-setbox-search">
			<?php // The help class that makes this title reachable on touch is added in JS
			      // (wireSettingsBox), not here: the tip helpers build a LABEL plus a "?" glyph, and
			      // this is a bare control carrying its own tip -- the toolbar-button treatment,
			      // which every other control on this page also gets from the JS side. ?>
			<input type="search" id="lpn_setbox_filter"
				placeholder="<?=htmlspecialchars($ec_lang['lpn_settings_search'])?>"
				aria-label="<?=htmlspecialchars($ec_lang['lpn_settings_search'])?>"
				title="<?=htmlspecialchars($ec_lang['lpn_settings_search_tip'])?>">
		</div>
		<div class="lpn-setbox-panes">
			<?php // Built by buildSettingsIndex(), from the content pane's own headings. ?>
			<nav id="lpn_setbox_index" class="lpn-setbox-index" aria-label="<?=htmlspecialchars($ec_lang['lpn_menu_settings'])?>"></nav>
			<div id="lpn_setbox_content" class="lpn-setbox-content">
				<?php // ---- THE CATEGORIES ----------------------------------------------------------
				      //
				      // Tom, 2026-08-18, after using the box: the sections it opened with were the four
				      // panels it had absorbed -- Labels, Settings, Time, Coloring -- which is a record of
				      // where the controls came from, not a place a stranger can find one. Visualization,
				      // Map and page, New elements and Calculation are his own grouping, and Quality is
				      // still to come: it is a sibling of Hydraulics under Calculation and needs nothing
				      // here changed to arrive.
				      //
				      // **THERE IS NO SECTION CALLED "SETTINGS" ANY MORE.** The BOX is Settings; a section
				      // inside it repeating the word is the Settings-inside-Settings that made Tom ask
				      // "Settings is a bad heading. Can you advise?"
				      //
				      // **THE SUB-HEADINGS ARE MARKUP AND THE ROWS UNDER THEM ARE JS.** A sub-heading is a
				      // place in the box -- an index row, a jump target, a heading a translator reads --
				      // and none of that depends on the document. What is inside one does: the labels
				      // lists follow the friction method, the range editors exist only for a field being
				      // coloured by. So the skeleton is here, once, and the builders fill named hosts.
				      //
				      // A host carrying `lpn-set-part` is TRANSPARENT TO THE SEARCH: the filter recurses
				      // into it and hides row by row, so two builders can share one sub-heading without a
				      // search for "opacity" turning up everything either of them wrote. ?>
				<?php // ---- Section: VISUALIZATION ----
				      // Tom, 2026-08-19: "Group the three Node and Link headings under a new Visualization
				      // main heading -- the first main heading ... to be honest, I really like Visualization.
				      // Leave the sub-heading Node and link as is." He named and rejected his own
				      // alternatives (Analysis View, Labels and colors, Seeing numbers), and Visualization is
				      // also the word GIS uses for exactly this -- what is drawn and what is printed beside
				      // it -- so no better term was found to offer against it.
				      //
				      // FIRST, which is a claim about what this page is for: you draw a network and you look
				      // at it, and the index now opens on the controls that decide what you see. Map and page
				      // keeps what is true of the whole SHEET rather than of one kind of element. ?>
				<section id="lpn_set_sec_visual" class="lpn-set-sec" data-set-sec="visual">
					<h3 class="lpn-set-head"><?=$ec_lang['lpn_settings_sec_visualization']?></h3>
					<div class="lpn-set-secbody">
						<?php // Node symbology, then link symbology: how each kind of element is DRAWN and
						      // what is PRINTED beside it, which is one question and was two panels. Tom:
						      // "Dissolve Color by value and put its items in Node symbology and Link
						      // symbology." ?>
						<?php // **WHAT IS PRINTED FIRST, THEN WHAT DECIDES THE COLOUR** (Tom, 2026-08-19:
						      // move the "Color nodes by" control to sit after the label columns, and
						      // "put a colour-ramp picker at the bottom of this group"). Each group is
						      // now one complete answer to "how is this kind of element drawn", scheme
						      // included -- which is why the ramp is stored per group; see
						      // defaultSettings() in js/looped-network.js. ?>
						<div class="lpn-set-sub" id="lpn_set_sub_nodeSym"><?=$ec_lang['lpn_settings_node_symbology']?></div>
						<div class="lpn-set-subbody">
							<div id="lpn_labels_node_fields"></div>
							<div id="lpn_set_colors_node" class="lpn-set-part"></div>
						</div>
						<div class="lpn-set-sub" id="lpn_set_sub_linkSym"><?=$ec_lang['lpn_settings_link_symbology']?></div>
						<div class="lpn-set-subbody">
							<div id="lpn_labels_link_fields"></div>
							<div id="lpn_set_colors_link" class="lpn-set-part"></div>
						</div>
						<?php // **THE TWO CONTROLS THAT ARE ABOUT BOTH KINDS AT ONCE** (Tom, 2026-08-19).
						      // The high/low mark and the text between values apply to a node label and a
						      // link label alike, so they belong to neither group and were being read as
						      // part of whichever one they were filed under. rebuildLabelsFields() fills
						      // this host. ?>
						<div class="lpn-set-sub" id="lpn_set_sub_nodeLink"><?=$ec_lang['lpn_settings_node_link']?></div>
						<div class="lpn-set-subbody">
							<div id="lpn_labels_options" class="lpn-set-part"></div>
							<?php // Thematic map (Tom, 2026-08-19: "Move Thematic map to the Node and link
							      // section"), filled by buildColoringSection(). ITS OWN HOST rather than
							      // a third row inside #lpn_labels_options: that node is cleared wholesale
							      // by rebuildLabelsFields(), and buildColoringSection() is also called on
							      // its own (syncColorControls), so two builders sharing one node would
							      // each wipe the other depending on which ran last. ?>
							<div id="lpn_set_colors_nodelink" class="lpn-set-part"></div>
						</div>
					</div>
				</section>
				<section id="lpn_set_sec_map" class="lpn-set-sec" data-set-sec="map">
					<h3 class="lpn-set-head"><?=$ec_lang['lpn_settings_sec_map']?></h3>
					<div class="lpn-set-secbody">
						<?php // Map appearance holds what is true of the WHOLE SHEET: the sizes, the two
						      // legend positions, the thematic mode. Its heading sits immediately before
						      // Text size, which is Tom's own placement.
						      //
						      // The colour-scheme acknowledgements are rendered into the shared host by
						      // buildColoringSection(), VERBATIM out of EngCalcs.lpnRamps.CREDITS -- one
						      // licence fixes its own wording, so it is never retyped here where it could
						      // drift. Untranslated on purpose, exactly like the OpenStreetMap credit on
						      // the map. ?>
						<div class="lpn-set-sub" id="lpn_set_sub_mapDisplay"><?=$ec_lang['lpn_settings_map_display']?></div>
						<div class="lpn-set-subbody">
							<div id="lpn_set_map_fields" class="lpn-set-part"></div>
							<div id="lpn_set_colors_shared" class="lpn-set-part"></div>
						</div>
						<?php // Tom: "Change Calculator to Page and make it a heading." The one group in the
						      // box that is NOT carried in the project file, which its note says out loud. ?>
						<div class="lpn-set-sub" id="lpn_set_sub_page"><?=$ec_lang['lpn_settings_page']?></div>
						<div class="lpn-set-subbody"><div id="lpn_set_page_fields" class="lpn-set-part"></div></div>
					</div>
				</section>
				<?php // ---- Section: NEW ELEMENTS ----
				      // "Element" is this app's own word (CLAUDE.md, the scope doc, every function name)
				      // and "Insert" is already the menu verb, so the category needed no new vocabulary.
				      // Everything here decides what the NEXT element you draw looks like and is called;
				      // nothing here changes anything already drawn. ?>
				<section id="lpn_set_sec_elements" class="lpn-set-sec" data-set-sec="elements">
					<h3 class="lpn-set-head"><?=$ec_lang['lpn_settings_sec_assets']?></h3>
					<div class="lpn-set-secbody">
						<div class="lpn-set-sub" id="lpn_set_sub_idPrefixes"><?=$ec_lang['lpn_settings_id_prefixes']?></div>
						<div class="lpn-set-subbody"><div id="lpn_set_id_fields" class="lpn-set-part"></div></div>
						<div class="lpn-set-sub" id="lpn_set_sub_defaults"><?=$ec_lang['lpn_settings_defaults']?></div>
						<div class="lpn-set-subbody"><div id="lpn_set_default_fields" class="lpn-set-part"></div></div>
					</div>
				</section>
				<?php // ---- Section: CALCULATION ----
				      // Units, Time, Hydraulics -- what the numbers MEAN, WHEN they are asked for, and HOW
				      // they are solved. "Hydraulics" is EPANET's own name for the third group (its
				      // Analysis Options are Hydraulics, Quality, Reactions, Times, Energy), so Tom's
				      // future Quality category is a sibling of it rather than a new idea.
				      //
				      // The time fields are built by js/lpn-time.js, which owns every string in them;
				      // absent that file the sub-heading stands over an empty body rather than breaking.
				      // The bottom pane's Time tab keeps the TRANSPORT -- play, step, slider -- because
				      // that changes which moment you are looking at and never touches the document. ?>
				<section id="lpn_set_sec_calc" class="lpn-set-sec" data-set-sec="calc">
					<h3 class="lpn-set-head"><?=$ec_lang['lpn_settings_sec_calculation']?></h3>
					<div class="lpn-set-secbody">
						<div class="lpn-set-sub" id="lpn_set_sub_units"><?=$ec_lang['lpn_view_units']?></div>
						<div class="lpn-set-subbody"><div id="lpn_set_units_fields" class="lpn-set-part"></div></div>
						<div class="lpn-set-sub" id="lpn_set_sub_time"><?=$ec_lang['lpn_time_menu']?></div>
						<div class="lpn-set-subbody"><div id="lpn_set_time_fields" class="lpn-set-part"></div></div>
						<div class="lpn-set-sub" id="lpn_set_sub_hydraulics"><?=$ec_lang['lpn_settings_hydraulics']?></div>
						<div class="lpn-set-subbody"><div id="lpn_set_hydraulics_fields" class="lpn-set-part"></div></div>
					</div>
				</section>
				<?php // **THE COLOUR-SCHEME ACKNOWLEDGEMENTS ARE A FOOTER, NOT A SETTING** (Tom, 2026-08-19:
				      // "Did we intend to leave the full credits right before the Page section? It's a bit
				      // long for this place"). Three sentences of licence text stood between Map appearance
				      // and Page, in the middle of the reading path, looking like something to act on. They
				      // are now the last thing in the content pane, below every section -- which is where a
				      // reader expects fine print and where nothing has to be read past.
				      //
				      // **NOT COLLAPSED, and not filtered away.** Apache-2.0 clause 2 says the
				      // acknowledgement must appear in the software, so it is on screen whenever the box is
				      // open -- including while a search matches nothing, since it sits outside the sections
				      // applySetboxFilter() hides. Filled by buildColoringSection() from
				      // EngCalcs.lpnRamps.CREDITS, verbatim and untranslated. ?>
				<div id="lpn_set_ramp_credits" class="lpn-rp-credit"></div>
			</div>
		</div>
		<?php // Shown only while the filter matches nothing, so an empty box is never mistaken for a
		      // box that failed to build. ?>
		<p id="lpn_setbox_none" class="lpn-setbox-none" style="display:none"></p>
	</div>
</div>
<?php // ---- THE LIBRARIES BOX (ROADMAP Tasks 462 and 460) -----------------------------------------
      //
      // Tom, 2026-08-20: "for Water Networks, I think we also need the following in a group:
      // Libraries (Patterns, Curves, Controls, Pumps, Pipes, Custom), Settings, Simulate,
      // Transport, Time selectors."
      //
      // **WHY A BOX OF ITS OWN, AND NOT THE TWO PLACES THAT ALREADY EXIST.**
      //
      //   * NOT the Settings box. The membership rule would let it in -- a pattern is a
      //     whole-project thing -- but the SHAPE would not survive: every row in that box is one
      //     name and one control in a measured column (dev/browser-pass/specs/setbox.js measures
      //     the control column's x and caps a number box at 80 px), and a pattern is a series with
      //     a chart beside it, a curve is a table, and a control is a sentence. Three exemptions to
      //     the one design that box exists to hold is not a section, it is a second box wearing the
      //     first one's chrome. Tom also names Libraries BESIDE Settings in the toolbar group, so
      //     he is already holding them apart.
      //   * NOT the bottom pane. That pane is for what is READ WHILE THE MAP IS EDITED, and its
      //     seven tabs are one generic row-per-element table (renderPaneTable). None of these three
      //     is row-per-element -- a pattern's rows are its own multipliers -- and authoring a
      //     control is not reading. Three more tabs would also be ten, and the tab strip wraps at a
      //     narrow window, which costs the map height.
      //
      // So: a standing box, dragged by its chrome, closed by its X, by Escape, and by the button
      // that opened it -- the same three the Settings box and the property popup have. Its
      // structure is the Settings box's, borrowed WHOLESALE (.lpn-setbox-* panes, index and
      // content), because a second box on this page must look like the first one.
      //
      // **THE INDEX IS A CHOOSER, NOT A SCROLL INDEX.** Settings derives its index from headings
      // and scrolls to them; these three are disjoint editors rather than sections of one document,
      // so a click SHOWS one and hides the others. Built in JS (buildLibraryBox), because what is
      // in each depends entirely on the document. ?>
<div id="lpn_library_box" class="d-print-none lpn-popover lpn-setbox lpn-libbox" style="display:none;position:fixed;z-index:22;background:#fff;border:1px solid #333;padding:40px 8px 8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)" role="dialog" aria-labelledby="lpn_libbox_title">
	<div id="lpn_libbox_title" class="lpn-setbox-title"><?=$ec_lang['lpn_library_menu']?></div>
	<button type="button" id="lpn_libbox_close" class="lpn-popover-x" title="<?=htmlspecialchars($ec_lang['lpn_close'])?>" aria-label="<?=htmlspecialchars($ec_lang['lpn_close'])?>">&times;</button>
	<div class="lpn-popover-body lpn-setbox-body">
		<div class="lpn-setbox-panes">
			<nav id="lpn_libbox_index" class="lpn-setbox-index" aria-label="<?=htmlspecialchars($ec_lang['lpn_library_menu'])?>"></nav>
			<div id="lpn_libbox_content" class="lpn-setbox-content"></div>
		</div>
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
	<dt><?=$ec_lang['lpn_notes_color_term']?></dt><dd><?=$ec_lang['lpn_notes_color_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_epanet_term']?></dt><dd><?=$ec_lang['lpn_notes_epanet_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_engine_term']?></dt><dd><?=$ec_lang['lpn_notes_engine_def']?></dd>
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
	lpn_examples_welcome: <?=json_encode($ec_lang['lpn_examples_welcome'])?>,
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
	lpn_field_text_align: <?=json_encode($ec_lang['lpn_field_text_align'])?>,
	lpn_field_text_align_left: <?=json_encode($ec_lang['lpn_field_text_align_left'])?>,
	lpn_field_text_align_center: <?=json_encode($ec_lang['lpn_field_text_align_center'])?>,
	lpn_field_text_align_right: <?=json_encode($ec_lang['lpn_field_text_align_right'])?>,
	lpn_field_text_valign: <?=json_encode($ec_lang['lpn_field_text_valign'])?>,
	lpn_field_text_valign_top: <?=json_encode($ec_lang['lpn_field_text_valign_top'])?>,
	lpn_field_text_valign_bottom: <?=json_encode($ec_lang['lpn_field_text_valign_bottom'])?>,
	lpn_field_text_valign_middle: <?=json_encode($ec_lang['lpn_field_text_valign_middle'])?>,
	lpn_field_lon: <?=json_encode($ec_lang['lpn_field_lon'])?>,
	lpn_field_lat: <?=json_encode($ec_lang['lpn_field_lat'])?>,
	lpn_new_geo_us: <?=json_encode($ec_lang['lpn_new_geo_us'])?>,
	lpn_new_geo_si: <?=json_encode($ec_lang['lpn_new_geo_si'])?>,
	lpn_valve_type_pbv: <?=json_encode($ec_lang['lpn_valve_type_pbv'])?>,
	lpn_valve_type_gpv: <?=json_encode($ec_lang['lpn_valve_type_gpv'])?>,
	lpn_field_valve_setting_drop: <?=json_encode($ec_lang['lpn_field_valve_setting_drop'])?>,
	lpn_field_valve_setting_drop_tip: <?=json_encode($ec_lang['lpn_field_valve_setting_drop_tip'])?>,
	lpn_inp_drop_gpv_curve: <?=json_encode($ec_lang['lpn_inp_drop_gpv_curve'])?>,
	lpn_gpv_curve_note: <?=json_encode($ec_lang['lpn_gpv_curve_note'])?>,
	lpn_tool_color_tip: <?=json_encode($ec_lang["lpn_tool_color_tip"])?>,
	lpn_units_group_inputs: <?=json_encode($ec_lang['lpn_units_group_inputs'])?>,
	lpn_units_group_results: <?=json_encode($ec_lang['lpn_units_group_results'])?>,
	lpn_units_warn_title: <?=json_encode($ec_lang['lpn_units_warn_title'])?>,
	lpn_units_warn_body: <?=json_encode($ec_lang['lpn_units_warn_body'])?>,
	lpn_units_reinterpret: <?=json_encode($ec_lang['lpn_units_reinterpret'])?>,
	lpn_units_convert: <?=json_encode($ec_lang['lpn_units_convert'])?>,
	lpn_status_reinterpreted: <?=json_encode($ec_lang['lpn_status_reinterpreted'])?>,
	lpn_status_converted: <?=json_encode($ec_lang['lpn_status_converted'])?>,
	lpn_file_export_inp: <?=json_encode($ec_lang['lpn_file_export_inp'])?>,
	lpn_file_export_inp_tip: <?=json_encode($ec_lang['lpn_file_export_inp_tip'])?>,
	lpn_status_inp_exported: <?=json_encode($ec_lang['lpn_status_inp_exported'])?>,
	lpn_inp_export_differences: <?=json_encode($ec_lang['lpn_inp_export_differences'])?>,
	lpn_inp_export_refused: <?=json_encode($ec_lang['lpn_inp_export_refused'])?>,
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
	lpn_find_op_top: <?=json_encode($ec_lang['lpn_find_op_top'])?>,
	lpn_find_op_bottom: <?=json_encode($ec_lang['lpn_find_op_bottom'])?>,
	lpn_find_none: <?=json_encode($ec_lang['lpn_find_none'])?>,
	lpn_find_adjacent: <?=json_encode($ec_lang['lpn_find_adjacent'])?>,
	lpn_find_no_value: <?=json_encode($ec_lang['lpn_find_no_value'])?>,
	lpn_profile_menu: <?=json_encode($ec_lang['lpn_profile_menu'])?>,
	lpn_profile_tip: <?=json_encode($ec_lang['lpn_profile_tip'])?>,
	lpn_profile_from: <?=json_encode($ec_lang['lpn_profile_from'])?>,
	lpn_profile_to: <?=json_encode($ec_lang['lpn_profile_to'])?>,
	lpn_profile_pick: <?=json_encode($ec_lang['lpn_profile_pick'])?>,
	lpn_profile_through: <?=json_encode($ec_lang['lpn_profile_through'])?>,
	lpn_profile_clear: <?=json_encode($ec_lang['lpn_profile_clear'])?>,
	lpn_profile_choose: <?=json_encode($ec_lang['lpn_profile_choose'])?>,
	lpn_profile_no_path: <?=json_encode($ec_lang['lpn_profile_no_path'])?>,
	lpn_profile_no_solve: <?=json_encode($ec_lang['lpn_profile_no_solve'])?>,
	lpn_profile_summary: <?=json_encode($ec_lang['lpn_profile_summary'])?>,
	lpn_profile_axis_station: <?=json_encode($ec_lang['lpn_profile_axis_station'])?>,
	lpn_profile_axis_elev: <?=json_encode($ec_lang['lpn_profile_axis_elev'])?>,
	lpn_pane_toggle: <?=json_encode($ec_lang['lpn_pane_toggle'])?>,
	lpn_pane_toggle_tip: <?=json_encode($ec_lang['lpn_pane_toggle_tip'])?>,
	lpn_pane_tab_junctions: <?=json_encode($ec_lang['lpn_pane_tab_junctions'])?>,
	lpn_pane_tab_reservoirs: <?=json_encode($ec_lang['lpn_pane_tab_reservoirs'])?>,
	lpn_pane_tab_tanks: <?=json_encode($ec_lang['lpn_pane_tab_tanks'])?>,
	lpn_pane_tab_pipes: <?=json_encode($ec_lang['lpn_pane_tab_pipes'])?>,
	lpn_pane_tab_pumps: <?=json_encode($ec_lang['lpn_pane_tab_pumps'])?>,
	lpn_pane_tab_valves: <?=json_encode($ec_lang['lpn_pane_tab_valves'])?>,
	lpn_pane_tab_tip: <?=json_encode($ec_lang['lpn_pane_tab_tip'])?>,
	lpn_pane_none: <?=json_encode($ec_lang['lpn_pane_none'])?>,
	lpn_pane_sort_tip: <?=json_encode($ec_lang['lpn_pane_sort_tip'])?>,
	lpn_pane_print: <?=json_encode($ec_lang['lpn_pane_print'])?>,
	lpn_pane_print_tip: <?=json_encode($ec_lang['lpn_pane_print_tip'])?>,
	lpn_time_menu: <?=json_encode($ec_lang['lpn_time_menu'])?>,
	lpn_time_menu_tip: <?=json_encode($ec_lang['lpn_time_menu_tip'])?>,
	lpn_time_duration: <?=json_encode($ec_lang['lpn_time_duration'])?>,
	lpn_time_hyd_step: <?=json_encode($ec_lang['lpn_time_hyd_step'])?>,
	lpn_time_pattern_step: <?=json_encode($ec_lang['lpn_time_pattern_step'])?>,
	lpn_time_pattern_start: <?=json_encode($ec_lang['lpn_time_pattern_start'])?>,
	lpn_time_report_step: <?=json_encode($ec_lang['lpn_time_report_step'])?>,
	lpn_time_report_start: <?=json_encode($ec_lang['lpn_time_report_start'])?>,
	lpn_time_clock_start: <?=json_encode($ec_lang['lpn_time_clock_start'])?>,
	lpn_time_format_tip: <?=json_encode($ec_lang['lpn_time_format_tip'])?>,
	lpn_time_running: <?=json_encode($ec_lang['lpn_time_running'])?>,
	lpn_time_no_engine: <?=json_encode($ec_lang['lpn_time_no_engine'])?>,
	lpn_time_slider: <?=json_encode($ec_lang['lpn_time_slider'])?>,
	lpn_time_no_period: <?=json_encode($ec_lang['lpn_time_no_period'])?>,
	lpn_time_first: <?=json_encode($ec_lang['lpn_time_first'])?>,
	lpn_time_prev: <?=json_encode($ec_lang['lpn_time_prev'])?>,
	lpn_time_play: <?=json_encode($ec_lang['lpn_time_play'])?>,
	lpn_time_pause: <?=json_encode($ec_lang['lpn_time_pause'])?>,
	lpn_time_next: <?=json_encode($ec_lang['lpn_time_next'])?>,
	lpn_time_last: <?=json_encode($ec_lang['lpn_time_last'])?>,
	lpn_time_tank: <?=json_encode($ec_lang['lpn_time_tank'])?>,
	lpn_time_level: <?=json_encode($ec_lang['lpn_time_level'])?>,
	lpn_time_run: <?=json_encode($ec_lang['lpn_time_run'])?>,
	lpn_time_run_tip: <?=json_encode($ec_lang['lpn_time_run_tip'])?>,
	lpn_time_run_note: <?=json_encode($ec_lang['lpn_time_run_note'])?>,
<?php   // The run box (Task 450). Three new strings; `lpn_time_running` above says what it says
        // while it works, and `lpn_close` is the word already on every other dismiss control here. ?>
	lpn_time_run_done: <?=json_encode($ec_lang['lpn_time_run_done'])?>,
	lpn_time_run_failed: <?=json_encode($ec_lang['lpn_time_run_failed'])?>,
	lpn_time_run_fell_back: <?=json_encode($ec_lang['lpn_time_run_fell_back'])?>,
	lpn_time_run_report: <?=json_encode($ec_lang['lpn_time_run_report'])?>,
	lpn_time_run_report_tip: <?=json_encode($ec_lang['lpn_time_run_report_tip'])?>,
	lpn_time_no_report: <?=json_encode($ec_lang['lpn_time_no_report'])?>,
	lpn_close: <?=json_encode($ec_lang['lpn_close'])?>,
	lpn_time_speed: <?=json_encode($ec_lang['lpn_time_speed'])?>,
	lpn_time_speed_tip: <?=json_encode($ec_lang['lpn_time_speed_tip'])?>,
<?php   // The Settings box (Task 441). Four of its five strings are borrowed from controls that
        // already existed and are supplied elsewhere in this block; these are the ones it added. ?>
	lpn_settings_search: <?=json_encode($ec_lang['lpn_settings_search'])?>,
	lpn_settings_search_tip: <?=json_encode($ec_lang['lpn_settings_search_tip'])?>,
	lpn_settings_no_match: <?=json_encode($ec_lang['lpn_settings_no_match'])?>,
	lpn_rpane_empty: <?=json_encode($ec_lang['lpn_rpane_empty'])?>,
	lpn_time_settings_open: <?=json_encode($ec_lang['lpn_time_settings_open'])?>,
<?php // Libraries (Tasks 462/460). ?>
	lpn_library_menu: <?=json_encode($ec_lang['lpn_library_menu'])?>,
	lpn_library_menu_tip: <?=json_encode($ec_lang['lpn_library_menu_tip'])?>,
	lpn_library_patterns: <?=json_encode($ec_lang['lpn_library_patterns'])?>,
	lpn_library_patterns_tip: <?=json_encode($ec_lang['lpn_library_patterns_tip'])?>,
	lpn_library_curves: <?=json_encode($ec_lang['lpn_library_curves'])?>,
	lpn_library_curves_tip: <?=json_encode($ec_lang['lpn_library_curves_tip'])?>,
	lpn_library_curves_note: <?=json_encode($ec_lang['lpn_library_curves_note'])?>,
	lpn_library_controls: <?=json_encode($ec_lang['lpn_library_controls'])?>,
	lpn_library_controls_tip: <?=json_encode($ec_lang['lpn_library_controls_tip'])?>,
	lpn_library_pattern_add: <?=json_encode($ec_lang['lpn_library_pattern_add'])?>,
	lpn_library_pattern_values: <?=json_encode($ec_lang['lpn_library_pattern_values'])?>,
	lpn_library_pattern_values_tip: <?=json_encode($ec_lang['lpn_library_pattern_values_tip'])?>,
	lpn_library_pattern_span: <?=json_encode($ec_lang['lpn_library_pattern_span'])?>,
	lpn_library_pattern_none: <?=json_encode($ec_lang['lpn_library_pattern_none'])?>,
	lpn_library_default_pattern: <?=json_encode($ec_lang['lpn_library_default_pattern'])?>,
	lpn_library_default_pattern_tip: <?=json_encode($ec_lang['lpn_library_default_pattern_tip'])?>,
	lpn_library_control_add: <?=json_encode($ec_lang['lpn_library_control_add'])?>,
	lpn_library_control_tip: <?=json_encode($ec_lang['lpn_library_control_tip'])?>,
	lpn_library_control_ok: <?=json_encode($ec_lang['lpn_library_control_ok'])?>,
	lpn_library_control_bad: <?=json_encode($ec_lang['lpn_library_control_bad'])?>,
	lpn_library_control_missing: <?=json_encode($ec_lang['lpn_library_control_missing'])?>,
	lpn_field_demand_pattern: <?=json_encode($ec_lang['lpn_field_demand_pattern'])?>,
	lpn_field_demand_pattern_tip: <?=json_encode($ec_lang['lpn_field_demand_pattern_tip'])?>,
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
	lpn_field_valve_setting: <?=json_encode($ec_lang['lpn_field_valve_setting'])?>,
	lpn_field_valve_setting_loss: <?=json_encode($ec_lang['lpn_field_valve_setting_loss'])?>,
	lpn_field_valve_setting_loss_tip: <?=json_encode($ec_lang['lpn_field_valve_setting_loss_tip'])?>,
	lpn_field_valve_diameter_tip: <?=json_encode($ec_lang['lpn_field_valve_diameter_tip'])?>,
	lpn_field_valve_km_tip: <?=json_encode($ec_lang['lpn_field_valve_km_tip'])?>,
	lpn_demand_tip: <?=json_encode($ec_lang['lpn_demand_tip'])?>,
	lpn_field_roughness: <?=json_encode($ec_lang['lpn_field_roughness'])?>,
	lpn_field_roughness_tip: <?=json_encode($ec_lang['lpn_field_roughness_tip'])?>,
	lpn_field_length: <?=json_encode($ec_lang['lpn_field_length'])?>,
	lpn_field_from: <?=json_encode($ec_lang['lpn_field_from'])?>,
	lpn_field_to: <?=json_encode($ec_lang['lpn_field_to'])?>,
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
	lpn_tool_labels: <?=json_encode($ec_lang['lpn_tool_labels'])?>,
	lpn_labels_heading_node: <?=json_encode($ec_lang['lpn_labels_heading_node'])?>,
	lpn_labels_heading_link: <?=json_encode($ec_lang['lpn_labels_heading_link'])?>,
	lpn_labels_decimals_tip: <?=json_encode($ec_lang['lpn_labels_decimals_tip'])?>,
	lpn_labels_mark_extrema: <?=json_encode($ec_lang['lpn_labels_mark_extrema'])?>,
	lpn_labels_mark_extrema_tip: <?=json_encode($ec_lang['lpn_labels_mark_extrema_tip'])?>,
	lpn_settings_apply_to_all: <?=json_encode($ec_lang['lpn_settings_apply_to_all'])?>,
	lpn_settings_apply_to_all_tip: <?=json_encode($ec_lang['lpn_settings_apply_to_all_tip'])?>,
	lpn_confirm_apply_prefix: <?=json_encode($ec_lang['lpn_confirm_apply_prefix'])?>,
	lpn_prefix_applied: <?=json_encode($ec_lang['lpn_prefix_applied'])?>,
	lpn_labels_prefix_tip: <?=json_encode($ec_lang['lpn_labels_prefix_tip'])?>,
	lpn_labels_suffix_tip: <?=json_encode($ec_lang['lpn_labels_suffix_tip'])?>,
	lpn_labels_suffix_gradient_tip: <?=json_encode($ec_lang['lpn_labels_suffix_gradient_tip'])?>,
	lpn_labels_separator: <?=json_encode($ec_lang['lpn_labels_separator'])?>,
	lpn_labels_separator_tip: <?=json_encode($ec_lang['lpn_labels_separator_tip'])?>,
	lpn_labels_priority: <?=json_encode($ec_lang['lpn_labels_priority'])?>,
	lpn_labels_col_before: <?=json_encode($ec_lang['lpn_labels_col_before'])?>,
	lpn_labels_col_after: <?=json_encode($ec_lang['lpn_labels_col_after'])?>,
	lpn_labels_col_decimals: <?=json_encode($ec_lang['lpn_labels_col_decimals'])?>,
	lpn_labels_col_decimals_example: <?=json_encode($ec_lang['lpn_labels_col_decimals_example'])?>,
	lpn_labels_col_rank: <?=json_encode($ec_lang['lpn_labels_col_rank'])?>,
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
	lpn_basemap_show: <?=json_encode($ec_lang['lpn_basemap_show'])?>,
	lpn_basemap_hide: <?=json_encode($ec_lang['lpn_basemap_hide'])?>,
	lpn_basemap_tip: <?=json_encode($ec_lang['lpn_basemap_tip'])?>,
	lpn_basemap_satellite_tip: <?=json_encode($ec_lang['lpn_basemap_satellite_tip'])?>,
	lpn_basemap_satellite_hide: <?=json_encode($ec_lang['lpn_basemap_satellite_hide'])?>,
	lpn_basemap_satellite_show: <?=json_encode($ec_lang['lpn_basemap_satellite_show'])?>,
	lpn_clean_map: <?=json_encode($ec_lang['lpn_clean_map'])?>,
	lpn_clean_map_off: <?=json_encode($ec_lang['lpn_clean_map_off'])?>,
	lpn_clean_map_tip: <?=json_encode($ec_lang['lpn_clean_map_tip'])?>,
	lpn_file_import_geo: <?=json_encode($ec_lang['lpn_file_import_geo'])?>,
	lpn_file_import_geo_tip: <?=json_encode($ec_lang['lpn_file_import_geo_tip'])?>,
	lpn_georef_intro: <?=json_encode($ec_lang['lpn_georef_intro'])?>,
	lpn_georef_step1: <?=json_encode($ec_lang['lpn_georef_step1'])?>,
	lpn_georef_step2: <?=json_encode($ec_lang['lpn_georef_step2'])?>,
	lpn_georef_step1_hint: <?=json_encode($ec_lang['lpn_georef_step1_hint'])?>,
	lpn_georef_detach: <?=json_encode($ec_lang['lpn_georef_detach'])?>,
	lpn_georef_size_prompt: <?=json_encode($ec_lang['lpn_georef_size_prompt'])?>,
	lpn_tip_join: <?=json_encode($ec_lang['lpn_tip_join'])?>,
	lpn_tool_add_junction_tip: <?=json_encode($ec_lang['lpn_tool_add_junction_tip'])?>,
	lpn_tool_add_reservoir_tip: <?=json_encode($ec_lang['lpn_tool_add_reservoir_tip'])?>,
	lpn_tool_add_tank_tip: <?=json_encode($ec_lang['lpn_tool_add_tank_tip'])?>,
	lpn_tool_add_pipe_tip: <?=json_encode($ec_lang['lpn_tool_add_pipe_tip'])?>,
	lpn_tool_add_pump_tip: <?=json_encode($ec_lang['lpn_tool_add_pump_tip'])?>,
	lpn_tool_add_valve_tip: <?=json_encode($ec_lang['lpn_tool_add_valve_tip'])?>,
	lpn_tool_add_text_tip: <?=json_encode($ec_lang['lpn_tool_add_text_tip'])?>,
	lpn_tool_delete_tip: <?=json_encode($ec_lang['lpn_tool_delete_tip'])?>,
	lpn_tool_undo_tip: <?=json_encode($ec_lang['lpn_tool_undo_tip'])?>,
	lpn_tool_zoom_extent_tip: <?=json_encode($ec_lang['lpn_tool_zoom_extent_tip'])?>,
	lpn_tool_settings_tip: <?=json_encode($ec_lang['lpn_tool_settings_tip'])?>,
	lpn_find_menu_tip: <?=json_encode($ec_lang['lpn_find_menu_tip'])?>,
	lpn_help_icons: <?=json_encode($ec_lang['lpn_help_icons'])?>,
	lpn_pane_right_toggle: <?=json_encode($ec_lang['lpn_pane_right_toggle'])?>,
	lpn_pane_right_toggle_tip: <?=json_encode($ec_lang['lpn_pane_right_toggle_tip'])?>,
	lpn_color_legend_open_tip: <?=json_encode($ec_lang['lpn_color_legend_open_tip'])?>,
	lpn_color_node_field: <?=json_encode($ec_lang['lpn_color_node_field'])?>,
	lpn_color_link_field: <?=json_encode($ec_lang['lpn_color_link_field'])?>,
	lpn_color_ramp_sequential: <?=json_encode($ec_lang['lpn_color_ramp_sequential'])?>,
	lpn_color_ramp_diverging: <?=json_encode($ec_lang['lpn_color_ramp_diverging'])?>,
	lpn_settings_color_classes: <?=json_encode($ec_lang['lpn_settings_color_classes'])?>,
	lpn_color_mode: <?=json_encode($ec_lang['lpn_color_mode'])?>,
	lpn_color_mode_equal: <?=json_encode($ec_lang['lpn_color_mode_equal'])?>,
	lpn_color_mode_quantile: <?=json_encode($ec_lang['lpn_color_mode_quantile'])?>,
	lpn_color_mode_jenks: <?=json_encode($ec_lang['lpn_color_mode_jenks'])?>,
	lpn_color_mode_stddev: <?=json_encode($ec_lang['lpn_color_mode_stddev'])?>,
	lpn_color_mode_pretty: <?=json_encode($ec_lang['lpn_color_mode_pretty'])?>,
	lpn_color_mode_log: <?=json_encode($ec_lang['lpn_color_mode_log'])?>,
	lpn_color_mode_pressure: <?=json_encode($ec_lang['lpn_color_mode_pressure'])?>,
	lpn_color_mode_manual: <?=json_encode($ec_lang['lpn_color_mode_manual'])?>,
	lpn_color_ranges_note: <?=json_encode($ec_lang['lpn_color_ranges_note'])?>,
	lpn_color_criterion_note: <?=json_encode($ec_lang['lpn_color_criterion_note'])?>,
	lpn_color_break_number: <?=json_encode($ec_lang['lpn_color_break_number'])?>,
	lpn_color_break_order: <?=json_encode($ec_lang['lpn_color_break_order'])?>,
	lpn_color_break_count: <?=json_encode($ec_lang['lpn_color_break_count'])?>,
	lpn_color_ramp_qualitative: <?=json_encode($ec_lang['lpn_color_ramp_qualitative'])?>,
	lpn_color_ramp_rainbow: <?=json_encode($ec_lang['lpn_color_ramp_rainbow'])?>,
	lpn_color_ramp_rainbow_eg: <?=json_encode($ec_lang['lpn_color_ramp_rainbow_eg'])?>,
	lpn_color_example_status: <?=json_encode($ec_lang['lpn_color_example_status'])?>,
	lpn_color_example_material: <?=json_encode($ec_lang['lpn_color_example_material'])?>,
	lpn_color_ramp_ylgnbu: <?=json_encode($ec_lang['lpn_color_ramp_ylgnbu'])?>,
	lpn_color_ramp_rdylbu: <?=json_encode($ec_lang['lpn_color_ramp_rdylbu'])?>,
	lpn_georef_adjust: <?=json_encode($ec_lang['lpn_georef_adjust'])?>,
	lpn_georef_asdegrees: <?=json_encode($ec_lang['lpn_georef_asdegrees'])?>,
	lpn_georef_confirm: <?=json_encode($ec_lang['lpn_georef_confirm'])?>,
	lpn_georef_done: <?=json_encode($ec_lang['lpn_georef_done'])?>,
	lpn_georef_on_map: <?=json_encode($ec_lang['lpn_georef_on_map'])?>,
	lpn_georef_empty: <?=json_encode($ec_lang['lpn_georef_empty'])?>,
	lpn_georef_unavailable: <?=json_encode($ec_lang['lpn_georef_unavailable'])?>,
	lpn_goto_menu: <?=json_encode($ec_lang['lpn_goto_menu'])?>,
	lpn_goto_tip: <?=json_encode($ec_lang['lpn_goto_tip'])?>,
	lpn_goto_prompt: <?=json_encode($ec_lang['lpn_goto_prompt'])?>,
	lpn_goto_bad: <?=json_encode($ec_lang['lpn_goto_bad'])?>,
	<?php // THE PLACE-NAME SEARCH'S CONSENT RECORD (Task 437). NOT language keys -- these three are
	      // the name, the version and the lifetime of the cookie js/lpn-search.js writes when a
	      // visitor says yes, handed over so lib/Consent.lib.php stays the one place they are
	      // decided. Every visitor-FACING string that search shows is an English literal inside
	      // js/lpn-search.js until lib/lang.ec.en.php gains its keys, exactly as the placement
	      // bar's step strings are. ?>
	lpn_mapbox_token: <?=json_encode(EC_MAPBOX_TOKEN)?>,
	lpn_geosearch_cookie: <?=json_encode(EC_GEOSEARCH_COOKIE)?>,
	lpn_geosearch_version: <?=json_encode(EC_GEOSEARCH_VERSION)?>,
	lpn_geosearch_days: <?=json_encode(EC_GEOSEARCH_DAYS)?>,
	lpn_menu_settings: <?=json_encode($ec_lang['lpn_menu_settings'])?>,
	lpn_menu_project: <?=json_encode($ec_lang['lpn_menu_project'])?>,
	lpn_tables_menu: <?=json_encode($ec_lang['lpn_tables_menu'])?>,
	lpn_tables_menu_tip: <?=json_encode($ec_lang['lpn_tables_menu_tip'])?>,
	lpn_run_menu_tip: <?=json_encode($ec_lang['lpn_run_menu_tip'])?>,
	lpn_settings_auto_run: <?=json_encode($ec_lang['lpn_settings_auto_run'])?>,
	lpn_settings_auto_run_tip: <?=json_encode($ec_lang['lpn_settings_auto_run_tip'])?>,
	lpn_time_run_slow: <?=json_encode($ec_lang['lpn_time_run_slow'])?>,
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
	lpn_inp_drop_demand_pattern: <?=json_encode($ec_lang['lpn_inp_drop_demand_pattern'])?>,
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
<?php   // The Open button on the toolbar (Task 246). It is icon-only there and carries a tip for
        // the same reason Save and Save as do. ?>
	lpn_file_open_tip: <?=json_encode($ec_lang['lpn_file_open_tip'])?>,
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
	lpn_settings_id_prefixes: <?=json_encode($ec_lang['lpn_settings_id_prefixes'])?>,
	lpn_settings_defaults: <?=json_encode($ec_lang['lpn_settings_defaults'])?>,
	lpn_settings_defaults_note: <?=json_encode($ec_lang['lpn_settings_defaults_note'])?>,
	lpn_settings_push_note: <?=json_encode($ec_lang['lpn_settings_push_note'])?>,
	lpn_settings_push_btn: <?=json_encode($ec_lang['lpn_settings_push_btn'])?>,
	lpn_push_confirm: <?=json_encode($ec_lang['lpn_push_confirm'])?>,
	lpn_push_properties: <?=json_encode($ec_lang['lpn_push_properties'])?>,
	lpn_push_assets: <?=json_encode($ec_lang['lpn_push_assets'])?>,
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

	lpn_settings_page_note: <?=json_encode($ec_lang['lpn_settings_page_note'])?>,
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
<?php   // EPANET said no (Task 471), and the controls it would have said no over (Task 466). ?>
	lpn_engine_refused: <?=json_encode($ec_lang['lpn_engine_refused'])?>,
	lpn_engine_refused_why: <?=json_encode($ec_lang['lpn_engine_refused_why'])?>,
	lpn_engine_refused_fallback: <?=json_encode($ec_lang['lpn_engine_refused_fallback'])?>,
	lpn_control_dangling_note: <?=json_encode($ec_lang['lpn_control_dangling_note'])?>,
	lpn_control_unreadable_note: <?=json_encode($ec_lang['lpn_control_unreadable_note'])?>,
	lpn_engine_minor_loss_note: <?=json_encode($ec_lang['lpn_engine_minor_loss_note'])?>,
	lpn_unit_unknown: <?=json_encode($ec_lang['lpn_unit_unknown'])?>,
	lpn_settings_text_size: <?=json_encode($ec_lang['lpn_settings_text_size'])?>,
	lpn_settings_symbol_size: <?=json_encode($ec_lang['lpn_settings_symbol_size'])?>,
	lpn_settings_link_width: <?=json_encode($ec_lang['lpn_settings_link_width'])?>,
	lpn_settings_align_labels: <?=json_encode($ec_lang['lpn_settings_align_labels'])?>,
	lpn_settings_readability_bias: <?=json_encode($ec_lang['lpn_settings_readability_bias'])?>,
	lpn_settings_readability_bias_tip: <?=json_encode($ec_lang['lpn_settings_readability_bias_tip'])?>,
	lpn_settings_mask_labels: <?=json_encode($ec_lang['lpn_settings_mask_labels'])?>,
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
	lpn_settings_color_node_field: <?=json_encode($ec_lang['lpn_settings_color_node_field'])?>,
	lpn_settings_color_link_field: <?=json_encode($ec_lang['lpn_settings_color_link_field'])?>,
	lpn_settings_color_ramp: <?=json_encode($ec_lang['lpn_settings_color_ramp'])?>,
	lpn_settings_color_credits: <?=json_encode($ec_lang['lpn_settings_color_credits'])?>,
	lpn_color_ramp_epanet: <?=json_encode($ec_lang['lpn_color_ramp_epanet'])?>,
	lpn_color_ramp_viridis: <?=json_encode($ec_lang['lpn_color_ramp_viridis'])?>,
	lpn_color_ramp_gray: <?=json_encode($ec_lang['lpn_color_ramp_gray'])?>,
	lpn_settings_color_reverse: <?=json_encode($ec_lang['lpn_settings_color_reverse'])?>,
	lpn_color_none: <?=json_encode($ec_lang['lpn_color_none'])?>,
	lpn_settings_color_thematic: <?=json_encode($ec_lang['lpn_settings_color_thematic'])?>,
	lpn_settings_color_thematic_tip: <?=json_encode($ec_lang['lpn_settings_color_thematic_tip'])?>,
	lpn_settings_color_key_position: <?=json_encode($ec_lang['lpn_settings_color_key_position'])?>,
	lpn_settings_color_breaks: <?=json_encode($ec_lang['lpn_settings_color_breaks'])?>,
	lpn_settings_color_equal_intervals: <?=json_encode($ec_lang['lpn_settings_color_equal_intervals'])?>,
	lpn_settings_color_equal_counts: <?=json_encode($ec_lang['lpn_settings_color_equal_counts'])?>,
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
<?php // THE CLOCK LOADS BEFORE THE READER (ROADMAP Task 423). js/lpn-inp.js tests for
      // EngCalcs.lpnPatternMake and degrades AUDIBLY when it is absent -- reporting
      // [PATTERNS], [CONTROLS] and [TIMES] as unread -- so the order of these two tags is
      // the difference between importing a pattern and reporting that one was dropped. ?>
<script src="/engcalcs/js/lpn-patterns.js?v=<?=filemtime(__DIR__.'/js/lpn-patterns.js')?>"></script>
<script src="/engcalcs/js/lpn-inp.js?v=<?=filemtime(__DIR__.'/js/lpn-inp.js')?>"></script>
<?php // The clock's RUN half (ROADMAP Task 248). AFTER lpn-patterns.js, which it reads for
      // lpnParseTime, lpnTimeText and lpnTimesDefaults; BEFORE looped-network.js, which calls
      // EngCalcs.lpnTimeInit() at script scope to register its own bottom-pane tab. Get this
      // order wrong and the Time tab simply never appears, silently. ?>
<script src="/engcalcs/js/lpn-time.js?v=<?=filemtime(__DIR__.'/js/lpn-time.js')?>"></script>
<script src="/engcalcs/js/lpn-net.js?v=<?=filemtime(__DIR__.'/js/lpn-net.js')?>"></script>
<?php // The pure geometry/collision halves of the map editor (ROADMAP Task 293) -- must precede
      // looped-network.js, which reads EngCalcs.lpnGeom/lpnCollide as it defines itself. ?>
<script src="/engcalcs/js/lpn-geom.js?v=<?=filemtime(__DIR__.'/js/lpn-geom.js')?>"></script>
<script src="/engcalcs/js/lpn-collide.js?v=<?=filemtime(__DIR__.'/js/lpn-collide.js')?>"></script>
<script src="/engcalcs/js/lpn-profile.js?v=<?=filemtime(__DIR__.'/js/lpn-profile.js')?>"></script>
<script src="/engcalcs/js/lpn-georef.js?v=<?=filemtime(__DIR__.'/js/lpn-georef.js')?>"></script>
<?php // The colour catalogue and the swatch GEOMETRY (js/lpn-ramps.js). Pure arithmetic, no DOM:
      // the strip in the Coloring controls asks it how wide each box is rather than counting on
      // flex, which is how the first swatch came to eat the whole strip. ?>
<script src="/engcalcs/js/lpn-ramps.js?v=<?=filemtime(__DIR__.'/js/lpn-ramps.js')?>"></script>
<?php // Place-name search and its own consent gate (ROADMAP Task 437). BEFORE looped-network.js,
      // which calls EngCalcs.lpnSearchInit() at script scope -- the same ordering rule lpn-time.js
      // is under, and with the same silent failure if it is broken: the View row simply never
      // appears. ?>
<script src="/engcalcs/js/lpn-search.js?v=<?=filemtime(__DIR__.'/js/lpn-search.js')?>"></script>
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
