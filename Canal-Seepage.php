<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['cs_main_title'];
$html_desc = $ec_lang['cs_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['cs_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'cs_Q_in',       'type' => 'number', 'default' => Array('us' => '20', 'si' => '0.6'), 'units' => 'flow_canal',  'label' => $ec_lang['cs_Q_in']),
		Array('name' => 'cs_Q_out',      'type' => 'number', 'default' => Array('us' => '18', 'si' => '0.54'), 'units' => 'flow_canal',  'label' => $ec_lang['cs_Q_out']),
		Array('name' => 'cs_L',          'type' => 'number', 'default' => Array('us' => '5000', 'si' => '1500'),  'units' => 'distance_site',              'label' => $ec_lang['cs_L']),
		Array('name' => 'cs_wp',         'type' => 'number', 'default' => '',      'units' => 'distance_site',              'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'cs_water_value','type' => 'number', 'default' => '',      'units' => 'volume',     'label' => $ec_lang['cs_water_value'], 'separator' => '/'),
		Array('name' => 'cs_lining_cost','type' => 'number', 'default' => '',      'units' => 'land_area',            'label' => $ec_lang['cs_lining_cost'],  'separator' => '/'),
		Array('name' => 'cs_Ec_target',  'type' => 'number', 'default' => '',      'units' => NULL,                         'label' => $ec_lang['cs_Ec_target']),
	),
	// Results
	Array(
		Array('name' => 'cs_Q_loss',              'units' => 'flow_canal',   'label' => $ec_lang['cs_Q_loss']),
		Array('name' => 'cs_loss_check',          'units' => NULL,                           'label' => $ec_lang['cs_loss_check']),
		Array('name' => 'cs_pct_loss',            'units' => 'percentage', 'label' => $ec_lang['cs_pct_loss']),
		Array('name' => 'cs_Ec',                  'units' => 'percentage', 'label' => $ec_lang['cs_Ec']),
		Array('name' => 'cs_Ec_check',            'units' => NULL,                           'label' => $ec_lang['cs_Ec_check']),
		Array('name' => 'cs_Vol_day',             'units' => 'volume',       'label' => $ec_lang['cs_Vol_day']),
		Array('name' => 'cs_Vol_year',            'units' => 'volume',       'label' => $ec_lang['cs_Vol_year']),
		Array('name' => 'cs_Q_loss_per_L',        'units' => 'unit_discharge',          'label' => $ec_lang['cs_Q_loss_per_L']),
		Array('name' => 'cs_lining_area',         'units' => 'land_area',              'label' => $ec_lang['cs_lining_area']),
		Array('name' => 'cs_annual_value_lost',   'units' => NULL,                           'label' => $ec_lang['cs_annual_value_lost']),
		Array('name' => 'cs_annual_value_recovered','units' => NULL,                         'label' => $ec_lang['cs_annual_value_recovered']),
		Array('name' => 'cs_lining_total_cost',   'units' => NULL,                           'label' => $ec_lang['cs_lining_total_cost']),
		Array('name' => 'cs_payback_years',       'units' => NULL,                           'label' => $ec_lang['cs_payback_years']),
	)
);
?>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['odt_notes_2_term']?></dt><dd><?=$ec_lang['cs_notes_1_def']?></dd>
	<dt><?=$ec_lang['cs_notes_2_term']?></dt><dd><?=$ec_lang['cs_notes_2_def']?></dd>
	<dt><?=$ec_lang['cs_notes_3_term']?></dt><dd><?=$ec_lang['cs_notes_3_def']?></dd>
	<dt><?=$ec_lang['rc_notes_4_term']?></dt><dd><?=$ec_lang['cs_notes_4_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	loss_positive: <?=json_encode($ec_lang['cs_loss_positive'])?>,
	loss_zero:     <?=json_encode($ec_lang['cs_loss_zero'])?>,
	loss_negative: <?=json_encode($ec_lang['cs_loss_negative'])?>,
	Ec_good:       <?=json_encode($ec_lang['cs_Ec_good'])?>,
	Ec_fair:       <?=json_encode($ec_lang['cs_Ec_fair'])?>,
	Ec_poor:       <?=json_encode($ec_lang['cs_Ec_poor'])?>
};
</script>
<script src="/engcalcs/js/canal-seepage.js?v=<?=filemtime(__DIR__.'/js/canal-seepage.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
