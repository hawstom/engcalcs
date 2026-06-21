<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['odt_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="orifice drain time pond basin tank detention hydraulics calculator" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['odt_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'h1_elev', 'type' => 'number', 'default' => '3',    'units' => Array('m','mm','ft','in'),         'label' => $ec_lang['odt_h1_elev']),
		Array('name' => 'a1',      'type' => 'number', 'default' => '1000', 'units' => Array('m2','mm2','ft2','in2'),      'label' => $ec_lang['odt_a1']),
		Array('name' => 'h2_elev',   'type' => 'number', 'default' => '0',   'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['odt_h2_elev']),
		Array('name' => 'h_orifice', 'type' => 'number', 'default' => '0',   'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['odt_h_orifice']),
		Array('name' => 'a0',        'type' => 'number', 'default' => '100',  'units' => Array('m2','mm2','ft2','in2'), 'label' => $ec_lang['odt_a0']),
		Array('name' => 'd',       'type' => 'number', 'default' => '0.1',  'units' => Array('m','mm','ft','in'),         'label' => $ec_lang['odt_d'] . '<br /><input type="radio" name="shape" id="shape_circ" value="circular" checked onchange="EngCalcs.submitForm()"> <label for="shape_circ">' . $ec_lang['or_shape_circular'] . '</label> <input type="radio" name="shape" id="shape_rect" value="rectangular" onchange="EngCalcs.submitForm()"> <label for="shape_rect">' . $ec_lang['or_shape_rectangular'] . '</label>'),
		Array('name' => 'w',       'type' => 'number', 'default' => '0.3',  'units' => Array('m','mm','ft','in'),         'label' => $ec_lang['odt_w']),
		Array('name' => 'cd',      'type' => 'number', 'default' => '0.61', 'units' => NULL,                              'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">'.$ec_lang['or_cd'].'</a>'),
	),
	//Results
	Array(
		Array('name' => 'h1',      'units' => Array('m','mm','ft','in'),                         'label' => $ec_lang['odt_h1']),
		Array('name' => 'q_max',   'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'),      'label' => $ec_lang['odt_q_max']),
		Array('name' => 'a_ending','units' => Array('m2','mm2','ft2','in2'),                      'label' => $ec_lang['odt_a_ending']),
		Array('name' => 'h2_check','units' => NULL,                                               'label' => $ec_lang['odt_h2_check']),
		Array('name' => 'vol',     'units' => Array('m3','ft3','acft'),                           'label' => $ec_lang['odt_vol']),
		Array('name' => 't_sec',   'units' => NULL,                                               'label' => $ec_lang['odt_t_sec']),
		Array('name' => 't_min',   'units' => NULL,                                               'label' => $ec_lang['odt_t_min']),
		Array('name' => 't_hr',    'units' => NULL,                                               'label' => $ec_lang['odt_t_hr']),
		Array('name' => 't_day',   'units' => NULL,                                               'label' => $ec_lang['odt_t_day']),
	)
);
?>

<div id="sketch" style="margin-top:1em; max-width:540px;"></div>

<dl>
	<dt><?=$ec_lang['odt_notes_1_term']?></dt><dd><?=$ec_lang['odt_notes_1_def']?></dd>
	<dt><?=$ec_lang['odt_notes_2_term']?></dt><dd><?=$ec_lang['odt_notes_2_def']?></dd>
	<dt>Derivation</dt><dd><a href="Orifice-Drain-Time-Ref.php">Equation derivation</a></dd>
</dl>

<?php echoFeedback(); ?>
<script src="/engcalcs/js/orifice-drain-time.js?v=<?=filemtime(__DIR__.'/js/orifice-drain-time.js')?>"></script>
<script>
EngCalcs.pageConfig = {
	h2_ok:        '<?=htmlspecialchars($ec_lang['odt_h2_ok'],        ENT_QUOTES, 'UTF-8')?>',
	h2_warn:      '<?=htmlspecialchars($ec_lang['odt_h2_warn'],      ENT_QUOTES, 'UTF-8')?>',
	sketch_start: '<?=htmlspecialchars($ec_lang['odt_sketch_start'], ENT_QUOTES, 'UTF-8')?>',
	sketch_end:   '<?=htmlspecialchars($ec_lang['odt_sketch_end'],   ENT_QUOTES, 'UTF-8')?>'
};
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
