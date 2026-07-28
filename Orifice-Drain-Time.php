<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['odt_main_title'];
$html_desc = $ec_lang['odt_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['odt_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'h1_elev', 'type' => 'number', 'default' => Array('us' => '10', 'si' => '3'),    'units' => 'distance_medium',         'label' => $ec_lang['odt_h1_elev']),
		Array('name' => 'a1',      'type' => 'number', 'default' => Array('us' => '40000', 'si' => '4000'), 'units' => 'flow_area',      'label' => $ec_lang['odt_a1']),
		Array('name' => 'h2_elev',   'type' => 'number', 'default' => Array('us' => '0.5', 'si' => '0.15'),   'units' => 'distance_medium', 'label' => $ec_lang['odt_h2_elev']),
		Array('name' => 'h_orifice', 'type' => 'number', 'default' => '0',   'units' => 'distance_medium', 'label' => $ec_lang['or_centroid_elev']),
		Array('name' => 'a0',        'type' => 'number', 'default' => Array('us' => '20000', 'si' => '2000'),  'units' => 'flow_area', 'label' => $ec_lang['odt_a0']),
		Array('name' => 'd',       'type' => 'number', 'default' => Array('us' => '6', 'si' => '150'),  'units' => 'distance_small',         'label' => $ec_lang['odt_d'] . '<br /><input type="radio" name="shape" id="shape_circ" value="circular" checked onchange="EngCalcs.submitForm()"> <label for="shape_circ">' . $ec_lang['or_shape_circular'] . '</label> <input type="radio" name="shape" id="shape_rect" value="rectangular" onchange="EngCalcs.submitForm()"> <label for="shape_rect">' . $ec_lang['or_shape_rectangular'] . '</label>'),
		Array('name' => 'w',       'type' => 'number', 'default' => Array('us' => '12', 'si' => '300'),  'units' => 'distance_small',         'label' => $ec_lang['odt_w']),
		Array('name' => 'cd',      'type' => 'number', 'default' => '0.61', 'units' => NULL,                              'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">'.$ec_lang['or_cd'].'</a>'),
	),
	//Results
	Array(
		Array('name' => 'h1',      'units' => 'distance_medium',                         'label' => $ec_lang['odt_h1']),
		Array('name' => 'q_max',   'units' => 'flow_channel',      'label' => $ec_lang['odt_q_max']),
		Array('name' => 'a_ending','units' => 'flow_area',                      'label' => $ec_lang['odt_a_ending']),
		Array('name' => 'h2_check','units' => NULL,                                               'label' => $ec_lang['odt_h2_check']),
		Array('name' => 'vol',     'units' => 'volume',                           'label' => $ec_lang['odt_vol']),
		Array('name' => 't_sec',   'units' => NULL,                                               'label' => $ec_lang['odt_t_sec']),
		Array('name' => 't_min',   'units' => NULL,                                               'label' => $ec_lang['odt_t_min']),
		Array('name' => 't_hr',    'units' => NULL,                                               'label' => $ec_lang['odt_t_hr']),
		Array('name' => 't_day',   'units' => NULL,                                               'label' => $ec_lang['odt_t_day']),
	)
);
?>

<div id="sketch" style="margin-top:1em; max-width:540px;"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['odt_notes_1_term']?></dt><dd><?=$ec_lang['odt_notes_1_def']?></dd>
	<dt><?=$ec_lang['odt_notes_2_term']?></dt><dd><?=$ec_lang['odt_notes_2_def']?></dd>
	<dt>Derivation</dt><dd><a href="Orifice-Drain-Time-Ref.php">Equation derivation</a></dd>
</dl>

<?php echoFeedback(); ?>
<script src="/engcalcs/js/orifice-drain-time.js?v=<?=filemtime(__DIR__.'/js/orifice-drain-time.js')?>"></script>
<script>
EngCalcs.pageConfig = {
	h2_ok:        <?=json_encode($ec_lang['odt_h2_ok'])?>,
	h2_warn:      <?=json_encode($ec_lang['odt_h2_warn'])?>,
	h2_warn_tip:  <?=json_encode($ec_lang['odt_h2_warn_tip'])?>,
	sketch_start: <?=json_encode($ec_lang['odt_sketch_start'])?>,
	sketch_end:   <?=json_encode($ec_lang['odt_sketch_end'])?>
};
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
