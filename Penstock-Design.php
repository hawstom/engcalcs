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
		Array('name' => 'e',      'type' => 'number', 'default' => '0.05', 'units' => Array('mm','m','in','ft'),         'label' => '<a target="_blank" href="https://nepis.epa.gov/Exe/ZyNET.exe/P1007WWU.txt?ZyActionD=ZyDocument&Client=EPA&Index=2000%20Thru%202005&SearchMethod=1&TocRestrict=n&&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5CZYFILES%5CINDEX%20DATA%5C00THRU05%5CTXT%5C00000024%5CP1007WWU.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=31">'.$ec_lang['ps_roughness'].'</a>'),
		Array('name' => 'km',     'type' => 'number', 'default' => '1.5',  'units' => NULL,                             'label' => '<a target="_blank" href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html">'.$ec_lang['ps_km'].'</a>'),
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
		Array('name' => 'annual_kwh', 'units' => Array('kwh_yr','mwh_yr'),  'label' => $ec_lang['ps_annual_kwh']),
	)
);
?>

<div id="sketch" style="margin-top:1em; max-width:340px;"></div>

<h2><?=$ec_lang['ws_notes_heading']?></h2>
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
