<?php

function echoHelpWanted(){
    global $ec_lang;
?>
<p class="collapse show d-print-none" id="helpWanted">
	<a href="../contact.php"><?=$ec_lang['template_translation_help']?></a> <a data-bs-toggle="collapse" href="#helpWanted" aria-expanded="true" aria-controls="helpWanted"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
if (basename($_SERVER['PHP_SELF']) == "Manning-Pipe-Flow.php") {
?>
<p class="collapse show d-print-none" id="spreadsheetNotice">   
	<a href="spreadsheet/<?=basename($_SERVER['PHP_SELF'], '.php') . '.php';?>"><?=$ec_lang['mpf_spreadheet_notice']?></a> <a data-bs-toggle="collapse" href="#spreadsheetNotice" aria-expanded="true" aria-controls="spreadsheetNotice"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
}
?>
<br />



<?php
}

function echoFeedback(){
    global $ec_lang;
?>
<p class="collapse show d-print-none" id="feedback">
	<a href="../contact.php"><?=$ec_lang['template_feedback']?></a> <a data-bs-toggle="collapse" href="#feedback"  aria-expanded="true" aria-controls="feedback"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
}

function inputHtml($name, $type, $default, $indent_string)
{
    return "\n" . $indent_string . '<input class="input" type="'.$type.'" step="any" name="'.$name.'" id="'.$name.'" value="'.$default.'" oninput="EngCalcs.submitForm();" />';

}

function echoUnitSelect($name, $units, $indent_string)
{
    if ($units !== NULL) {
        global $ec_units, $ec_lang;
        echo "\n" . $indent_string . '<select name="'.$name.'" onchange="EngCalcs.submitForm()">';
        foreach ($units as $unit) {
            echo "\n" . $indent_string . "\t" . '<option value="' . $ec_units[$unit].'">'.$ec_lang['u_' . $unit].'</option>';
        }
        echo "\n$indent_string</select>";
    }
}

function echoCalculatorForm($arrayInputs, $arrayResults, $flagFormAppend = false, $flagHideUnits = false)
{
    global $ec_lang;
?>
<script>
EngCalcs.unitSets = {};
<?php foreach ($GLOBALS['ec_unit_sets'] as $key => $set) : ?>
EngCalcs.unitSets['<?=$key?>'] = ['<?=implode("', '", $set)?>'];
<?php endforeach ; ?>
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('set_units_m').addEventListener('click', function() { EngCalcs.setUnits('m'); });
	document.getElementById('set_units_mm').addEventListener('click', function() { EngCalcs.setUnits('mm'); });
	document.getElementById('set_units_ft').addEventListener('click', function() { EngCalcs.setUnits('ft'); });
	document.getElementById('set_units_in').addEventListener('click', function() { EngCalcs.setUnits('in'); });
	var pdc = document.getElementById('points_data_copy');
	if (pdc) pdc.addEventListener('click', function() { EngCalcs.pointsDataCopy(); });
	var pdp = document.getElementById('points_data_paste');
	if (pdp) pdp.addEventListener('click', function() { EngCalcs.pointsDataPaste(); });
	document.getElementById('btn-printable').addEventListener('click', function() {
		document.querySelectorAll('.d-print-none').forEach(function(el) { el.style.display = 'none'; });
	});
});
</script>
<form id="formInput" action="javascript:EngCalcs.submitForm()" method="post">
	<input id="printable_title" name="printable_title" type="text" style="font-size: 2em; width: 98%" placeholder="<?=$ec_lang['template_printable_title']?>" onchange="EngCalcs.submitForm();" /><br />
	<input id="printable_subtitle" name="printable_subtitle" type="text" style="font-size: 1.5em; width: 98%" placeholder="<?=$ec_lang['template_printable_subtitle']?>" onchange="EngCalcs.submitForm();" />
	<div style="overflow-x:auto">
	<table class="bare">
		<tbody>
			<tr class="collapse d-print-none<?php if ($flagHideUnits === false) : ?> show<?php endif; ?>" id="set_units_row">
				<td>
					<?=$ec_lang['calc_set_units']?> <button type="button" id="set_units_m"><?=$ec_lang['u_m']?></button><button type="button" id="set_units_mm"><?=$ec_lang['u_mm']?></button><button type="button" id="set_units_ft"><?=$ec_lang['u_ft']?></button><button type="button" id="set_units_in"><?=$ec_lang['u_in']?></button> <button type="button" id="calc_defaults" onclick="EngCalcs.resetToDefaults()"><?=$ec_lang['calc_defaults']?></button><a data-bs-toggle="collapse" href="#set_units_row" aria-expanded="true" aria-controls="set_units_row"><?=$ec_lang['view_hide_line']?></a>
				<td>
			</tr>
			<tr>
				<td>
					<?=$ec_lang['calc_inputs']?>
					<table>
						<tbody>
<?php
	foreach ($arrayInputs as $input) {
?>
							<tr class="collapse show" id="<?=$input['name']?>_row">
								<td><label for='<?=$input['name']?>'><?=$input['label']?></label></td>
								<td>
									<?php echo inputHtml($input['name'], $input['type'], $input['default'], "\t\t\t\t\t\t\t\t\t");?><?php if (!empty($input['separator'])) echo ' ' . $input['separator'] . ' '; ?><?php echoUnitSelect($input['name'].'u', $input['units'], "\t\t\t\t\t\t\t\t\t");?>
								</td>
								<td class="engcalcs-x d-print-none"><a data-bs-toggle="collapse" href="#<?=$input['name']?>_row" aria-expanded="true" aria-controls="<?=$input['name']?>_row">X</a></td>
							</tr>
<?php
	}
?>
						</tbody>
					</table>
				</td>
<?php if ($arrayResults) : ?>
				<td>
					<?php echo $ec_lang['calc_results'];?>
					<table>
						<tbody>
<?php
	foreach ($arrayResults as $result) {
?>
							<tr class="collapse show" id="<?=$result['name']?>_row">
								<td><?=$result['label']?></td>
								<td id="<?php echo $result['name'];?>"><?php echo $result['label'];?></td>
								<td>
									<?php echoUnitSelect($result['name'].'u',$result['units'], "\t\t\t\t\t\t\t\t\t");?>

								</td>
								<td class="engcalcs-x d-print-none"><a data-bs-toggle="collapse" href="#<?=$result['name']?>_row" aria-expanded="true" aria-controls="<?=$input['name']?>_row">X</a></td>
							</tr>
<?php
	}
?>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
<?php endif; ?>
<?php if ($flagFormAppend === true) {echoCalculatorFormAppend();} ?>
</form>
<p class="d-print-none"><button type="button" id="btn-printable"><?=$ec_lang['view_printable']?></button></p>
<?php
}
function echoCookieScript ()
{
?>
	// On load, read cookie and calc.
	EngCalcs.debugMode = <?=DEBUG_MODE ? 'true' : 'false' ?>;
	EngCalcs.cookieName='<?php $p=pathinfo($_SERVER['SCRIPT_NAME']); echo $p['filename']; ?>';
	EngCalcs.readCookieAndCalc(document.forms['formInput']);
<?php
}
// Omit last closing tag is good practice.
