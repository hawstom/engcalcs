<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mhp_main_title'];
$html_desc = $ec_lang['mhp_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['mhp_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q',      'type' => 'number', 'default' => Array('us' => '500', 'si' => '30'),   'units' => 'flow_turbine', 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'hgross', 'type' => 'number', 'default' => Array('us' => '160', 'si' => '50'),   'units' => 'distance_site',                  'label' => $ec_lang['mhp_gross_head']),
		Array('name' => 'd',      'type' => 'number', 'default' => Array('us' => '6', 'si' => '150'),  'units' => 'distance_small',         'label' => $ec_lang['mhp_diameter']),
		Array('name' => 'l',      'type' => 'number', 'default' => Array('us' => '600', 'si' => '200'),  'units' => 'distance_site',                  'label' => $ec_lang['mhp_length']),
		Array('name' => 'e',      'type' => 'number', 'default' => Array('us' => '0.00015', 'si' => '0.05'), 'units' => 'roughness',         'label' => '<a target="_blank" href="https://nepis.epa.gov/Exe/ZyNET.exe/P1007WWU.txt?ZyActionD=ZyDocument&Client=EPA&Index=2000%20Thru%202005&SearchMethod=1&TocRestrict=n&&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5CZYFILES%5CINDEX%20DATA%5C00THRU05%5CTXT%5C00000024%5CP1007WWU.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=31">'.$ec_lang['dw_roughness'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['dw_roughness_tip'])).'"><span class="ec-tip">?</span></span>'),
		Array('name' => 'km',     'type' => 'number', 'default' => '2.0',  'units' => NULL,                             'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html">'.$ec_lang['mphl_total_junction_k_short'].'</a><span class="ec-help" title="'.htmlspecialchars(strip_tags($ec_lang['mphl_total_junction_k_tip'])).'"><span class="ec-tip">?</span></span>'),
		Array('name' => 'nu',     'type' => 'number', 'default' => '1e-6', 'units' => NULL,                             'label' => $ec_lang['dw_kinematic_viscosity']),
		Array('name' => 'eta',    'type' => 'number', 'default' => '0.75', 'units' => NULL,                             'label' => $ec_lang['mhp_efficiency']),
	),
	//Results
	Array(
		Array('name' => 'vel',        'units' => 'velocity',      'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'vel_check',  'units' => NULL,                     'label' => $ec_lang['mhp_vel_check']),
		Array('name' => 'f',          'units' => NULL,                     'label' => $ec_lang['dw_friction_factor']),
		Array('name' => 'hf',         'units' => 'distance_medium','label' => $ec_lang['mphl_friction_loss']),
		Array('name' => 'hm',         'units' => 'distance_medium','label' => $ec_lang['mphl_junction_loss']),
		Array('name' => 'hl',         'units' => 'distance_medium','label' => $ec_lang['mphl_total_loss']),
		Array('name' => 'hl_check',   'units' => NULL,                     'label' => $ec_lang['mhp_hl_check']),
		Array('name' => 'hnet',       'units' => 'distance_medium','label' => $ec_lang['mhp_hnet']),
		Array('name' => 'power',      'units' => 'power',    'label' => $ec_lang['mhp_power']),
		Array('name' => 'annual_kwh', 'units' => 'energy',  'label' => $ec_lang['mhp_annual_kwh']),
	)
);
?>

<div id="sketch" style="margin-top:1em; max-width:340px;"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
<dl>
	<dt><?=$ec_lang['mhp_notes_1_term']?></dt><dd><?=$ec_lang['mhp_notes_1_def']?></dd>
	<dt><?=$ec_lang['mhp_notes_2_term']?></dt><dd><?=$ec_lang['mhp_notes_2_def']?></dd>
	<dt><?=$ec_lang['mhp_notes_3_term']?></dt><dd><?=$ec_lang['mhp_notes_3_def']?></dd>
	<dt><?=$ec_lang['mhp_notes_6_term']?></dt><dd><?=$ec_lang['mhp_notes_6_def']?></dd>
	<dt><?=$ec_lang['mhp_notes_7_term']?></dt><dd><?=$ec_lang['mhp_notes_7_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	mhp_vel_low:  <?=json_encode($ec_lang['mhp_vel_low'])?>,
	mhp_vel_high: <?=json_encode($ec_lang['mhp_vel_high'])?>,
	mhp_vel_ok_short:   <?=json_encode($ec_lang['mhp_vel_ok_short'])?>,
	mhp_vel_high_short: <?=json_encode($ec_lang['mhp_vel_high_short'])?>,
	mhp_vel_low_short:  <?=json_encode($ec_lang['mhp_vel_low_short'])?>,
	mhp_vel_ok_tip: <?=json_encode($ec_lang['mhp_vel_ok_tip'])?>,
	hl_ok_tip:   <?=json_encode($ec_lang['mhp_hl_ok_tip'])?>,
	hl_warn_tip: <?=json_encode($ec_lang['mhp_hl_warn_tip'])?>,
	hl_bad_tip:  <?=json_encode($ec_lang['mhp_hl_bad_tip'])?>
};
</script>
<script src="/engcalcs/js/micro-hydro-power.js?v=<?=filemtime(__DIR__.'/js/micro-hydro-power.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
