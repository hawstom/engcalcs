<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['wi_main_title'];
$html_head='
    <meta name="Description" content="'. $html_title .'" />
    <meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?php echo $ec_lang['wi_main_desc'] ?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
    //Inputs
    Array(
        Array('name' => 'hw', 'type' => 'number', 'default' => '1', 'units' => NULL, 'label' => $ec_lang['wi_headWaterelevation']),
        Array('name' => 'cw', 'type' => 'number', 'default' => '3', 'units' => NULL, 'label' => $ec_lang['ws_weirCoefficient'].' <a target="_blank" href="http://epg.modot.org/files/b/bc/749_Broad-Crested_Weir_Coefficients.pdf">?</a>'),
    ),
    //Results
    NULL,
    $flagFormAppend = true,
    $flagHideUnits = true   
);
function echoCalculatorFormAppend() {
        global $ec_units, $ec_lang;
        $indent_string = "\t\t\t\t\t";
?>
    <table id="CalcsTable" style='float: left;'>
        <thead>
            <tr>
                <th colspan="5"><?=$ec_lang['wi_weirPoints']?>
                    <a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a> <?=$ec_lang['points_data_help']?>
               </th>
            </tr>
            <tr>
                <th><?=$ec_lang['wi_station']?></th>
                <th><?=$ec_lang['wi_elevation']?></th>
                <th width="100pt"><?=$ec_lang['wi_pondingHeight']?></th>
                <th width="100pt"><?=$ec_lang['wi_incrementalFlow']?></th>
                <th width="100pt"><?=$ec_lang['wi_cumulativeFlow']?></th>
            </tr>
        </thead>
        <tbody id="CalcsBody">
        </tbody>
    </table>
	<div class='d-print-none' style='float:left;'>
		<p>
			<?=$ec_lang['points_data_title']?>
			<br />
			<button type="button" id="points_data_copy"><?=$ec_lang['points_data_copy']?></button>
			<button type="button" id="points_data_paste"><?=$ec_lang['points_data_paste']?></button>
		</p>
		<textarea id='points_data' cols='20'></textarea>
	</div>
	<div style='clear: both;'></div>
<?php
}
?>
<?php echoFeedback(); ?>
<h2><?=$ec_lang['mi_notes']?></h2>
<dl>
<dt><?=$ec_lang['wi_notes_we_term']?></dt><dd><?=$ec_lang['wi_notes_we_def']?></dd>
</dl>
<script src="/engcalcs/js/weir-flow-irregular.js?v=<?=filemtime(__DIR__.'/js/weir-flow-irregular.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
