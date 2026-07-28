<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['or_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['or_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'hwe',    'type' => 'number', 'default' => '102',    'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['or_hwe']),
		Array('name' => 'twe',    'type' => 'number', 'default' => '100',    'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['or_twe']),
		Array('name' => 'zinv',   'type' => 'number', 'default' => '100.5',    'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['or_invert']),
		Array('name' => 'd',      'type' => 'number', 'default' => '1',    'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['or_diameter'] . '<br /><input type="radio" name="shape" id="shape_circ" value="circular" checked onchange="EngCalcs.submitForm()"> <label for="shape_circ">' . $ec_lang['or_shape_circular'] . '</label> <input type="radio" name="shape" id="shape_rect" value="rectangular" onchange="EngCalcs.submitForm()"> <label for="shape_rect">' . $ec_lang['or_shape_rectangular'] . '</label>'),
		Array('name' => 'w',      'type' => 'number', 'default' => '1',    'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['or_width']),
		Array('name' => 'cd',     'type' => 'number', 'default' => '0.61', 'units' => NULL,                     'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">'.$ec_lang['or_cd'].'</a>'),
	),
	//Results
	Array(
		Array('name' => 'centroid', 'units' => Array('m','mm','ft','in'),                    'label' => $ec_lang['or_centroid_elev']),
		Array('name' => 'h',        'units' => Array('m','mm','ft','in'),                    'label' => $ec_lang['or_head']),
		Array('name' => 'area',     'units' => Array('m2','mm2','ft2','in2'),                'label' => $ec_lang['or_area']),
		Array('name' => 'q',        'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'),'label' => $ec_lang['mpf_flow']),
		Array('name' => 'regime',   'units' => NULL,                                         'label' => $ec_lang['or_regime']),
	)
);
?>

<div id="sketch" style="margin-top:1em; max-width:540px;"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['or_notes_1_term']?></dt><dd><?=$ec_lang['or_notes_1_def']?></dd>
	<dt><?=$ec_lang['or_notes_2_term']?></dt><dd><?=$ec_lang['or_notes_2_def']?></dd>
	<dt><?=$ec_lang['or_notes_3_term']?></dt><dd><?=$ec_lang['or_notes_3_def']?></dd>
	<dt><?=$ec_lang['or_notes_4_term']?></dt><dd><?=$ec_lang['or_notes_4_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	regime_valid:        <?=json_encode($ec_lang['or_regime_valid'])?>,
	regime_submerged:    <?=json_encode($ec_lang['or_regime_submerged'])?>,
	regime_submerged_tip:<?=json_encode($ec_lang['or_regime_submerged_tip'])?>,
	regime_warn:         <?=json_encode($ec_lang['or_regime_warn'])?>,
	regime_warn_tip:     <?=json_encode($ec_lang['or_regime_warn_tip'])?>,
	regime_twe_above_hwe:<?=json_encode($ec_lang['or_regime_twe_above_hwe'])?>,
	regime_twe_above_hwe_tip:<?=json_encode($ec_lang['or_regime_twe_above_hwe_tip'])?>
};
</script>
<script src="/engcalcs/js/orifice.js?v=<?=filemtime(__DIR__.'/js/orifice.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
