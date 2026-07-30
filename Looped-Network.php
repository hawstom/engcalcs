<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['lpn_main_title'];
$html_desc = $ec_lang['lpn_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['lpn_main_desc']?></h2>
<p class="ec-status-warn" style="font-weight:bold;font-size:1.15em"><?=$ec_lang['lpn_preview_banner']?></p>

<script>
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('btn-printable').addEventListener('click', function() {
		document.querySelectorAll('.d-print-none').forEach(function(el) { el.style.display = 'none'; });
	});
});
</script>
<form id="formInput" action="javascript:EngCalcs.submitForm()" method="post">
	<?php // Restore Defaults' removal freed enough headroom to put the six selectors on the same
	      // line as the US/SI row instead of a line of their own (Tom, 2026-07-30). A flex wrapper,
	      // not a merge into one <div>: echoUnitsRow() keeps its own collapse toggle untouched, and
	      // flex-wrap lets the two pieces re-flow onto separate lines on a narrow screen without any
	      // extra markup -- the wrap-first-as-a-table/div behavior Tom asked for falls out of
	      // flex-wrap for free. ?>
	<div class="d-flex flex-wrap align-items-center d-print-none" style="gap:4px 12px">
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
	      // established now so results render in the right unit from the start. Roughness stays
	      // unitless (Hazen-Williams C-factor is dimensionless; Darcy-Weisbach's roughness height
	      // would need one -- see the numberFieldPlain() comment in looped-network.js). ?>
	<div class="d-print-none" id="lpn_units_strip">
		<?=$ec_lang['lpn_units_length']?> <?php echoUnitSelect('lpn_u_length', 'distance_site', ''); ?>
		<?=$ec_lang['lpn_units_elevhead']?> <?php echoUnitSelect('lpn_u_elevhead', 'total_head', ''); ?>
		<?=$ec_lang['lpn_units_pressure']?> <?php echoUnitSelect('lpn_u_pressure', 'partial_head', ''); ?>
		<?=$ec_lang['lpn_field_diameter']?> <?php echoUnitSelect('lpn_u_diameter', 'distance_small', ''); ?>
		<?=$ec_lang['lpn_units_flow']?> <?php echoUnitSelect('lpn_u_flow', 'flow_node', ''); ?>
		<?=$ec_lang['lpn_units_velocity']?> <?php echoUnitSelect('lpn_u_velocity', 'velocity', ''); ?>
		<?=$ec_lang['lpn_result_gradient']?> <?php echoUnitSelect('lpn_u_gradient', 'gradient', ''); ?>
	</div>
	</div>
	<div class="d-print-none" id="lpn_toolbar"></div>
	<input type="file" id="lpn_backdrop_file" accept="image/*" style="display:none">
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
	<p id="lpn_status" class="ec-status-warn"></p>
	<div style="overflow-x:auto;position:relative">
		<svg id="lpn_canvas" dir="ltr" width="100%" height="500" style="border:1px solid #ccc;background:#f7f7f2"></svg>
		<?php // Persistent mode signal, INSIDE the canvas (Tom, 2026-07-30, second look: "I envisioned
		      // the mode status in the canvas area since it's active like coordinates" -- moved from a
		      // <p> above the map to this overlay, matching #lpn_coords' own treatment below: an
		      // absolutely-positioned, small-font, translucent-background readout that lives where the
		      // "live" map state actually is). Top-left so it doesn't compete with the upper-right
		      // legend or the bottom-left coordinate tracker. Updated by setMode() in
		      // looped-network.js. ?>
		<div id="lpn_mode_hint" class="d-print-none" style="position:absolute;top:4px;left:4px;font-size:11px;background:rgba(255,255,255,.8);padding:2px 6px;pointer-events:none"></div>
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
		<div id="lpn_empty_hint" class="d-print-none" style="display:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#999;font-size:1.2em;pointer-events:none;text-align:center">
			<?=$ec_lang['lpn_empty_hint']?>
		</div>
		<div id="lpn_coords" class="d-print-none" style="position:absolute;bottom:4px;left:4px;font-size:11px;font-family:monospace;background:rgba(255,255,255,.8);padding:2px 6px;pointer-events:none">X: --  Y: --</div>
	</div>
</form>
<?php // position:fixed, not absolute: the popup is positioned from pointer-event clientX/clientY
      // (viewport-relative), but position:absolute is page-relative -- on a scrolled page those
      // are two different coordinate spaces, which was the actual cause of both the off-screen
      // popup and the "jarring pan on close" (the mismatch put the real Close button hitbox
      // somewhere other than where it visually appeared, so the tap fell through to the canvas
      // underneath and was read as a background pan). fixed is always viewport-relative, matching
      // clientX/clientY directly with no scroll math needed. ?>
<div id="lpn_popup" class="d-print-none" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div id="lpn_popup_title"></div>
	<div id="lpn_popup_fields"></div>
	<button type="button" id="lpn_popup_close"><?=$ec_lang['lpn_close']?></button>
</div>
<?php // A static settings panel, not a per-element property sheet -- deliberately its own popover
      // (not #lpn_popup/currentPopup) so this never interacts with the rename/undo/element-property
      // machinery. position:fixed and positioned from the Labels button's own screen rect (same
      // reasoning as #lpn_popup above: viewport-relative, clamped into view by JS on open). ?>
<div id="lpn_labels_popup" class="d-print-none" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div style="font-weight:bold"><?=$ec_lang['lpn_labels_heading_node']?></div>
	<div id="lpn_labels_node_fields"></div>
	<div style="font-weight:bold"><?=$ec_lang['lpn_labels_heading_link']?></div>
	<div id="lpn_labels_link_fields"></div>
	<button type="button" id="lpn_labels_popup_close"><?=$ec_lang['lpn_close']?></button>
</div>
<?php // Gear/settings panel (Task 146 Phase 2, 2026-07-30): ID prefixes, solver emitter exponent
      // and convergence tolerance, text size (+ map-vs-screen units), legend position -- same
      // static-panel, non-#lpn_popup pattern as #lpn_labels_popup directly above. Fields are built
      // entirely in JS (wireSettingsPopup() in looped-network.js), not PHP, so #lpn_settings_fields
      // starts empty here. ?>
<div id="lpn_settings_popup" class="d-print-none" style="display:none;position:fixed;z-index:20;background:#fff;border:1px solid #333;padding:8px;box-shadow:2px 2px 6px rgba(0,0,0,.3)">
	<div id="lpn_settings_fields"></div>
	<button type="button" id="lpn_settings_popup_close"><?=$ec_lang['lpn_close']?></button>
</div>

<?php echoFeedback(); ?>
<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['lpn_notes_1_term']?></dt><dd><?=$ec_lang['lpn_notes_1_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_2_term']?></dt><dd><?=$ec_lang['lpn_notes_2_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_3_term']?></dt><dd><?=$ec_lang['lpn_notes_3_def']?></dd>
	<dt><?=$ec_lang['lpn_notes_4_term']?></dt><dd><?=$ec_lang['lpn_notes_4_def']?></dd>
</dl>

<script>
EngCalcs.pageConfig = {
	lpn_tool_select: <?=json_encode($ec_lang['lpn_tool_select'])?>,
	lpn_tool_add_junction: <?=json_encode($ec_lang['lpn_tool_add_junction'])?>,
	lpn_tool_add_reservoir: <?=json_encode($ec_lang['lpn_tool_add_reservoir'])?>,
	lpn_tool_add_pipe: <?=json_encode($ec_lang['lpn_tool_add_pipe'])?>,
	lpn_tool_add_pump: <?=json_encode($ec_lang['lpn_tool_add_pump'])?>,
	lpn_tool_add_text: <?=json_encode($ec_lang['lpn_tool_add_text'])?>,
	lpn_tool_delete: <?=json_encode($ec_lang['lpn_tool_delete'])?>,
	lpn_tool_zoom_extent: <?=json_encode($ec_lang['lpn_tool_zoom_extent'])?>,
	lpn_tool_example: <?=json_encode($ec_lang['lpn_tool_example'])?>,
	lpn_tool_undo: <?=json_encode($ec_lang['lpn_tool_undo'])?>,
	lpn_confirm_example: <?=json_encode($ec_lang['lpn_confirm_example'])?>,
	lpn_new_text: <?=json_encode($ec_lang['lpn_new_text'])?>,
	lpn_field_elev: <?=json_encode($ec_lang['lpn_field_elev'])?>,
	lpn_field_head: <?=json_encode($ec_lang['lpn_field_head'])?>,
	lpn_field_diameter: <?=json_encode($ec_lang['lpn_field_diameter'])?>,
	lpn_field_roughness: <?=json_encode($ec_lang['lpn_field_roughness'])?>,
	lpn_field_length: <?=json_encode($ec_lang['lpn_field_length'])?>,
	lpn_field_km: <?=json_encode($ec_lang['lpn_field_km'])?>,
	lpn_field_auto: <?=json_encode($ec_lang['lpn_field_auto'])?>,
	lpn_field_x: <?=json_encode($ec_lang['lpn_field_x'])?>,
	lpn_field_y: <?=json_encode($ec_lang['lpn_field_y'])?>,
	lpn_field_text_size: <?=json_encode($ec_lang['lpn_field_text_size'])?>,
	lpn_tool_labels: <?=json_encode($ec_lang['lpn_tool_labels'])?>,
	lpn_labels_heading_node: <?=json_encode($ec_lang['lpn_labels_heading_node'])?>,
	lpn_labels_heading_link: <?=json_encode($ec_lang['lpn_labels_heading_link'])?>,
	lpn_field_id: <?=json_encode($ec_lang['lpn_field_id'])?>,
	lpn_pump_curve_source: <?=json_encode($ec_lang['lpn_pump_curve_source'])?>,
	lpn_pump_curve_own: <?=json_encode($ec_lang['lpn_pump_curve_own'])?>,
	lpn_pump_curve_ref_note: <?=json_encode($ec_lang['lpn_pump_curve_ref_note'])?>,
	lpn_pump_point1: <?=json_encode($ec_lang['lpn_pump_point1'])?>,
	lpn_pump_point2: <?=json_encode($ec_lang['lpn_pump_point2'])?>,
	lpn_pump_point3: <?=json_encode($ec_lang['lpn_pump_point3'])?>,
	lpn_mode_select: <?=json_encode($ec_lang['lpn_mode_select'])?>,
	lpn_mode_delete: <?=json_encode($ec_lang['lpn_mode_delete'])?>,
	lpn_mode_add_junction: <?=json_encode($ec_lang['lpn_mode_add_junction'])?>,
	lpn_mode_add_reservoir: <?=json_encode($ec_lang['lpn_mode_add_reservoir'])?>,
	lpn_mode_add_pipe: <?=json_encode($ec_lang['lpn_mode_add_pipe'])?>,
	lpn_mode_add_pump: <?=json_encode($ec_lang['lpn_mode_add_pump'])?>,
	lpn_mode_add_text: <?=json_encode($ec_lang['lpn_mode_add_text'])?>,
	lpn_tip_select: <?=json_encode($ec_lang['lpn_tip_select'])?>,
	lpn_tip_labels_draggable: <?=json_encode($ec_lang['lpn_tip_labels_draggable'])?>,
	bpn_demand: <?=json_encode($ec_lang['bpn_demand'])?>,
	lpn_id_invalid: <?=json_encode($ec_lang['lpn_id_invalid'])?>,
	lpn_id_taken: <?=json_encode($ec_lang['lpn_id_taken'])?>,
	lpn_diag_no_fixed_head: <?=json_encode($ec_lang['lpn_diag_no_fixed_head'])?>,
	lpn_diag_dangling_link: <?=json_encode($ec_lang['lpn_diag_dangling_link'])?>,
	lpn_diag_unreachable: <?=json_encode($ec_lang['lpn_diag_unreachable'])?>,
	lpn_diag_not_converged: <?=json_encode($ec_lang['lpn_diag_not_converged'])?>,
	lpn_result_head: <?=json_encode($ec_lang['lpn_result_head'])?>,
	lpn_result_pressure: <?=json_encode($ec_lang['lpn_result_pressure'])?>,
	lpn_result_flow: <?=json_encode($ec_lang['lpn_result_flow'])?>,
	lpn_result_velocity: <?=json_encode($ec_lang['lpn_result_velocity'])?>,
	lpn_result_headloss: <?=json_encode($ec_lang['lpn_result_headloss'])?>,
	lpn_result_gradient: <?=json_encode($ec_lang['lpn_result_gradient'])?>,
	lpn_result_headgain: <?=json_encode($ec_lang['lpn_result_headgain'])?>,
	lpn_tool_clear: <?=json_encode($ec_lang['lpn_tool_clear'])?>,
	lpn_confirm_clear: <?=json_encode($ec_lang['lpn_confirm_clear'])?>,
	lpn_storage_too_new: <?=json_encode($ec_lang['lpn_storage_too_new'])?>,
	lpn_backdrop_menu: <?=json_encode($ec_lang['lpn_backdrop_menu'])?>,
	lpn_backdrop_add: <?=json_encode($ec_lang['lpn_backdrop_add'])?>,
	lpn_backdrop_scale: <?=json_encode($ec_lang['lpn_backdrop_scale'])?>,
	lpn_backdrop_position: <?=json_encode($ec_lang['lpn_backdrop_position'])?>,
	lpn_backdrop_remove: <?=json_encode($ec_lang['lpn_backdrop_remove'])?>,
	lpn_backdrop_remove_confirm: <?=json_encode($ec_lang['lpn_backdrop_remove_confirm'])?>,
	lpn_backdrop_scale_prompt1: <?=json_encode($ec_lang['lpn_backdrop_scale_prompt1'])?>,
	lpn_backdrop_scale_prompt2: <?=json_encode($ec_lang['lpn_backdrop_scale_prompt2'])?>,
	lpn_backdrop_position_prompt1: <?=json_encode($ec_lang['lpn_backdrop_position_prompt1'])?>,
	lpn_backdrop_position_prompt2: <?=json_encode($ec_lang['lpn_backdrop_position_prompt2'])?>,
	lpn_backdrop_target_label: <?=json_encode($ec_lang['lpn_backdrop_target_label'])?>,
	lpn_backdrop_target_node: <?=json_encode($ec_lang['lpn_backdrop_target_node'])?>,
	lpn_backdrop_target_free: <?=json_encode($ec_lang['lpn_backdrop_target_free'])?>,
	lpn_backdrop_target_coords: <?=json_encode($ec_lang['lpn_backdrop_target_coords'])?>,
	lpn_backdrop_coords_prompt: <?=json_encode($ec_lang['lpn_backdrop_coords_prompt'])?>,
	lpn_backdrop_continue: <?=json_encode($ec_lang['lpn_backdrop_continue'])?>,
	lpn_tool_settings: <?=json_encode($ec_lang['lpn_tool_settings'])?>,
	lpn_settings_id_prefixes: <?=json_encode($ec_lang['lpn_settings_id_prefixes'])?>,
	lpn_settings_solver: <?=json_encode($ec_lang['lpn_settings_solver'])?>,
	lpn_settings_emitter_exponent: <?=json_encode($ec_lang['lpn_settings_emitter_exponent'])?>,
	lpn_settings_tolerance: <?=json_encode($ec_lang['lpn_settings_tolerance'])?>,
	lpn_settings_km_default: <?=json_encode($ec_lang['lpn_settings_km_default'])?>,
	lpn_settings_text_size: <?=json_encode($ec_lang['lpn_settings_text_size'])?>,
	lpn_settings_text_size_map: <?=json_encode($ec_lang['lpn_settings_text_size_map'])?>,
	lpn_settings_text_size_screen: <?=json_encode($ec_lang['lpn_settings_text_size_screen'])?>,
	lpn_settings_text_size_units: <?=json_encode($ec_lang['lpn_settings_text_size_units'])?>,
	lpn_settings_map_height: <?=json_encode($ec_lang['lpn_settings_map_height'])?>,
	lpn_settings_map_height_px: <?=json_encode($ec_lang['lpn_settings_map_height_px'])?>,
	lpn_settings_legend_position: <?=json_encode($ec_lang['lpn_settings_legend_position'])?>,
	lpn_settings_legend_top_left: <?=json_encode($ec_lang['lpn_settings_legend_top_left'])?>,
	lpn_settings_legend_top_right: <?=json_encode($ec_lang['lpn_settings_legend_top_right'])?>,
	lpn_settings_legend_middle_left: <?=json_encode($ec_lang['lpn_settings_legend_middle_left'])?>,
	lpn_settings_legend_middle_right: <?=json_encode($ec_lang['lpn_settings_legend_middle_right'])?>,
	lpn_settings_legend_bottom_left: <?=json_encode($ec_lang['lpn_settings_legend_bottom_left'])?>,
	lpn_settings_legend_bottom_right: <?=json_encode($ec_lang['lpn_settings_legend_bottom_right'])?>,
	lpn_settings_restore: <?=json_encode($ec_lang['lpn_settings_restore'])?>,
	lpn_settings_restore_btn: <?=json_encode($ec_lang['lpn_settings_restore_btn'])?>,
	lpn_confirm_restore_defaults: <?=json_encode($ec_lang['lpn_confirm_restore_defaults'])?>,
	lpn_settings_wipe_btn: <?=json_encode($ec_lang['lpn_settings_wipe_btn'])?>,
	lpn_confirm_wipe: <?=json_encode($ec_lang['lpn_confirm_wipe'])?>
};
</script>
<script src="/engcalcs/js/lpn-solver.js?v=<?=filemtime(__DIR__.'/js/lpn-solver.js')?>"></script>
<script src="/engcalcs/js/looped-network.js?v=<?=filemtime(__DIR__.'/js/looped-network.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
