<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['lpn_main_title'];
$html_desc = $ec_lang['lpn_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['lpn_main_desc']?></h2>

<script>
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('btn-printable').addEventListener('click', function() {
		document.querySelectorAll('.d-print-none').forEach(function(el) { el.style.display = 'none'; });
	});
});
</script>
<form id="formInput" action="javascript:EngCalcs.submitForm()" method="post">
	<?php echoUnitsRow(); ?>
	<?php // Five selectors (Tom, 2026-07-30): Length/Map is declarative-only (AutoCAD-style grid
	      // units, no SI conversion -- see the lengthField() comment in looped-network.js) and
	      // is deliberately its own selector, NOT shared with Elevation/Head, even though both
	      // happen to use family distance_site vs total_head -- conflating "this labels a grid
	      // unit" with "this converts a real quantity" under one control was confusing in
	      // practice. Elevation and (reservoir) Fixed Head share ONE selector on purpose: both
	      // are real vertical-datum quantities on the same energy scale, and letting them diverge
	      // would make elev+pressure-head arithmetic meaningless. Pressure has no input field yet
	      // in Phase 1 (it's a future result/diagnostic), but the selector is added now so it's
	      // established ahead of that. Roughness stays unitless (Hazen-Williams C-factor is
	      // dimensionless; Darcy-Weisbach's roughness height would need one -- see the
	      // numberFieldPlain() comment in looped-network.js). ?>
	<div class="d-print-none" id="lpn_units_strip">
		<?=$ec_lang['lpn_units_length']?> <?php echoUnitSelect('lpn_u_length', 'distance_site', ''); ?>
		<?=$ec_lang['lpn_units_elevhead']?> <?php echoUnitSelect('lpn_u_elevhead', 'total_head', ''); ?>
		<?=$ec_lang['lpn_units_pressure']?> <?php echoUnitSelect('lpn_u_pressure', 'partial_head', ''); ?>
		<?=$ec_lang['lpn_field_diameter']?> <?php echoUnitSelect('lpn_u_diameter', 'distance_small', ''); ?>
		<?=$ec_lang['lpn_units_flow']?> <?php echoUnitSelect('lpn_u_flow', 'flow_node', ''); ?>
	</div>
	<div class="d-print-none" id="lpn_toolbar"></div>
	<div style="overflow-x:auto;position:relative">
		<svg id="lpn_canvas" dir="ltr" width="100%" height="500" style="border:1px solid #ccc;background:#f7f7f2"></svg>
		<div id="lpn_empty_hint" class="d-print-none" style="display:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#999;font-size:1.2em;pointer-events:none;text-align:center">
			<span style="font-size:0.85em"><?=$ec_lang['template_welcome']?></span><br /><br />
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

<?php echoFeedback(); ?>

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
	lpn_field_auto: <?=json_encode($ec_lang['lpn_field_auto'])?>,
	lpn_field_x: <?=json_encode($ec_lang['lpn_field_x'])?>,
	lpn_field_y: <?=json_encode($ec_lang['lpn_field_y'])?>,
	lpn_pump_notice: <?=json_encode($ec_lang['lpn_pump_notice'])?>,
	bpn_demand: <?=json_encode($ec_lang['bpn_demand'])?>,
	lpn_id_invalid: <?=json_encode($ec_lang['lpn_id_invalid'])?>,
	lpn_id_taken: <?=json_encode($ec_lang['lpn_id_taken'])?>
};
</script>
<script src="/engcalcs/js/looped-network.js?v=<?=filemtime(__DIR__.'/js/looped-network.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
