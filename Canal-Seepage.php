<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['cs_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="canal seepage loss conveyance efficiency inflow outflow irrigation water loss lining payback" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['cs_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	// Inputs
	Array(
		Array('name' => 'cs_Q_in',       'type' => 'number', 'default' => '1.000', 'units' => Array('m3ps','lps','ft3ps'),  'label' => $ec_lang['cs_Q_in']),
		Array('name' => 'cs_Q_out',      'type' => 'number', 'default' => '0.900', 'units' => Array('m3ps','lps','ft3ps'),  'label' => $ec_lang['cs_Q_out']),
		Array('name' => 'cs_L',          'type' => 'number', 'default' => '1000',  'units' => Array('m','ft'),              'label' => $ec_lang['cs_L']),
		Array('name' => 'cs_wp',         'type' => 'number', 'default' => '',      'units' => Array('m','ft'),              'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'cs_water_value','type' => 'number', 'default' => '',      'units' => Array('m3','ft3','acft'),     'label' => $ec_lang['cs_water_value'], 'separator' => '/'),
		Array('name' => 'cs_lining_cost','type' => 'number', 'default' => '',      'units' => Array('m2','ft2'),            'label' => $ec_lang['cs_lining_cost'],  'separator' => '/'),
		Array('name' => 'cs_Ec_target',  'type' => 'number', 'default' => '',      'units' => NULL,                         'label' => $ec_lang['cs_Ec_target']),
	),
	// Results
	Array(
		Array('name' => 'cs_Q_loss',              'units' => Array('m3ps','lps','ft3ps'),   'label' => $ec_lang['cs_Q_loss']),
		Array('name' => 'cs_loss_check',          'units' => NULL,                           'label' => $ec_lang['cs_loss_check']),
		Array('name' => 'cs_pct_loss',            'units' => Array('depthPercent','depthFrac'), 'label' => $ec_lang['cs_pct_loss']),
		Array('name' => 'cs_Ec',                  'units' => Array('depthPercent','depthFrac'), 'label' => $ec_lang['cs_Ec']),
		Array('name' => 'cs_Ec_check',            'units' => NULL,                           'label' => $ec_lang['cs_Ec_check']),
		Array('name' => 'cs_Vol_day',             'units' => Array('m3','ft3','acft'),       'label' => $ec_lang['cs_Vol_day']),
		Array('name' => 'cs_Vol_year',            'units' => Array('m3','ft3','acft'),       'label' => $ec_lang['cs_Vol_year']),
		Array('name' => 'cs_Q_loss_per_L',        'units' => Array('m2ps','ft2ps'),          'label' => $ec_lang['cs_Q_loss_per_L']),
		Array('name' => 'cs_lining_area',         'units' => Array('m2','ft2'),              'label' => $ec_lang['cs_lining_area']),
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
