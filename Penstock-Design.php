<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['ps_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="penstock design calculator micro hydro pipe sizing head loss Darcy-Weisbach velocity" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['ps_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q',      'type' => 'number', 'default' => '10',   'units' => Array('lps','m3ps','ft3ps','gpm'), 'label' => $ec_lang['ps_flow']),
		Array('name' => 'hgross', 'type' => 'number', 'default' => '50',   'units' => Array('m','ft'),                  'label' => $ec_lang['ps_gross_head']),
		Array('name' => 'd',      'type' => 'number', 'default' => '100',  'units' => Array('mm','m','in','ft'),         'label' => $ec_lang['ps_diameter']),
		Array('name' => 'l',      'type' => 'number', 'default' => '200',  'units' => Array('m','ft'),                  'label' => $ec_lang['ps_length']),
		Array('name' => 'e',      'type' => 'number', 'default' => '0.05', 'units' => Array('mm','m','in','ft'),         'label' => $ec_lang['ps_roughness']),
		Array('name' => 'km',     'type' => 'number', 'default' => '1.5',  'units' => NULL,                             'label' => $ec_lang['ps_km']),
		Array('name' => 'nu',     'type' => 'number', 'default' => '1e-6', 'units' => NULL,                             'label' => $ec_lang['ps_nu']),
		Array('name' => 'eta',    'type' => 'number', 'default' => '0.75', 'units' => NULL,                             'label' => $ec_lang['ps_efficiency']),
	),
	//Results
	Array(
		Array('name' => 'vel',        'units' => Array('mps','ftps'),      'label' => $ec_lang['ps_velocity']),
		Array('name' => 'vel_check',  'units' => NULL,                     'label' => $ec_lang['ps_vel_check']),
		Array('name' => 'f',          'units' => NULL,                     'label' => $ec_lang['ps_f']),
		Array('name' => 'hf',         'units' => Array('m','mm','ft','in'),'label' => $ec_lang['ps_hf']),
		Array('name' => 'hm',         'units' => Array('m','mm','ft','in'),'label' => $ec_lang['ps_hm']),
		Array('name' => 'hl',         'units' => Array('m','mm','ft','in'),'label' => $ec_lang['ps_hl']),
		Array('name' => 'hl_check',   'units' => NULL,                     'label' => $ec_lang['ps_hl_check']),
		Array('name' => 'hnet',       'units' => Array('m','mm','ft','in'),'label' => $ec_lang['ps_hnet']),
		Array('name' => 'power',      'units' => Array('kw','mw','hp'),    'label' => $ec_lang['ps_power']),
		Array('name' => 'annual_kwh', 'units' => NULL,                     'label' => $ec_lang['ps_annual_kwh']),
	)
);
?>

<div id="sketch" style="margin-top:1em; max-width:340px;"></div>

<dl>
	<dt><?=$ec_lang['ps_notes_1_term']?></dt><dd><?=$ec_lang['ps_notes_1_def']?></dd>
	<dt><?=$ec_lang['ps_notes_2_term']?></dt><dd><?=$ec_lang['ps_notes_2_def']?></dd>
	<dt><?=$ec_lang['ps_notes_3_term']?></dt><dd><?=$ec_lang['ps_notes_3_def']?></dd>
	<dt><?=$ec_lang['ps_notes_4_term']?></dt><dd><?=$ec_lang['ps_notes_4_def']?></dd>
	<dt><?=$ec_lang['ps_notes_5_term']?></dt><dd><?=$ec_lang['ps_notes_5_def']?></dd>
</dl>

<?php echoFeedback(); ?>
<script>
EngCalcs.pageConfig = {
	vel_ok:   '<?=htmlspecialchars($ec_lang['ps_vel_ok'],   ENT_QUOTES, 'UTF-8')?>',
	vel_low:  '<?=htmlspecialchars($ec_lang['ps_vel_low'],  ENT_QUOTES, 'UTF-8')?>',
	vel_high: '<?=htmlspecialchars($ec_lang['ps_vel_high'], ENT_QUOTES, 'UTF-8')?>',
	hl_ok:    '<?=htmlspecialchars($ec_lang['ps_hl_ok'],    ENT_QUOTES, 'UTF-8')?>',
	hl_warn:  '<?=htmlspecialchars($ec_lang['ps_hl_warn'],  ENT_QUOTES, 'UTF-8')?>',
	hl_bad:   '<?=htmlspecialchars($ec_lang['ps_hl_bad'],   ENT_QUOTES, 'UTF-8')?>'
};
</script>
<script src="/engcalcs/js/penstock-design.js?v=<?=filemtime(__DIR__.'/js/penstock-design.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
