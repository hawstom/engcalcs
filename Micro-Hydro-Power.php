<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mhp_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="micro hydro power calculator run of river hydropower turbine flow head efficiency kW kilowatt" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['mhp_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q',      'type' => 'number', 'default' => '10',   'units' => Array('lps','m3ps','ft3ps','gpm'), 'label' => $ec_lang['mhp_flow']),
		Array('name' => 'hgross', 'type' => 'number', 'default' => '50',   'units' => Array('m','mm','ft','in'),          'label' => $ec_lang['mhp_gross_head']),
		Array('name' => 'hloss',  'type' => 'number', 'default' => '2.5',  'units' => Array('m','mm','ft','in'),          'label' => $ec_lang['mhp_head_loss'].' '.$ec_lang['mpf_see_notes']),
		Array('name' => 'eta',    'type' => 'number', 'default' => '0.75', 'units' => NULL,                               'label' => $ec_lang['mhp_efficiency'].' '.$ec_lang['mpf_see_notes']),
	),
	//Results
	Array(
		Array('name' => 'hnet',       'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mhp_net_head']),
		Array('name' => 'power',      'units' => Array('kw','mw','hp'),     'label' => $ec_lang['mhp_power']),
		Array('name' => 'annual_kwh', 'units' => Array('kwh_yr','mwh_yr'),   'label' => $ec_lang['mhp_annual_kwh'].' '.$ec_lang['mpf_see_notes']),
	)
);
?>

<div id="sketch" style="margin-top:1em; max-width:380px;"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['mhp_notes_1_term']?></dt><dd><?=$ec_lang['mhp_notes_1_def']?></dd>
	<dt><?=$ec_lang['mhp_notes_2_term']?></dt><dd><?=$ec_lang['mhp_notes_2_def']?></dd>
	<dt><?=$ec_lang['mhp_notes_3_term']?></dt><dd><?=$ec_lang['mhp_notes_3_def']?></dd>
	<dt><?=$ec_lang['mhp_notes_4_term']?></dt><dd><?=$ec_lang['mhp_notes_4_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script src="/engcalcs/js/micro-hydro-power.js?v=<?=filemtime(__DIR__.'/js/micro-hydro-power.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
