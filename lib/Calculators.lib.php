<?php

function echoHelpWanted(){
    global $ec_lang;
?>
<p class="collapse show d-print-none" id="helpWanted">
	<a href="../contact.php"><?=$ec_lang['template_translation_help']?></a> <a data-toggle="collapse" href="#helpWanted" aria-expanded="true" aria-controls="helpWanted"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
if (basename($_SERVER['PHP_SELF']) == "Manning-Pipe-Flow.php") {
?>
<p>   
	<?=$ec_lang['mpf_spreadheet_notice']?>
	&ensp;
	<a href="spreadsheet/<?=basename($_SERVER['PHP_SELF'], '.php') . '.xlsx';?>"><?=$ec_lang['mpf_spreadheet_link_download']?></a>
	&ensp;
	<a href="spreadsheet/<?=basename($_SERVER['PHP_SELF'], '.php') . '.php';?>"><?=$ec_lang['mpf_spreadheet_link_Google']?></a>
	&ensp;
	<a href="http://www.hawsedc.com/engcalcs/SpreadsheetLibrary.php"><?=$ec_lang['mpf_spreadheet_view_all']?></a>
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
	<a href="../contact.php"><?=$ec_lang['template_feedback']?></a> <a data-toggle="collapse" href="#feedback"  aria-expanded="true" aria-controls="feedback"><?=$ec_lang['view_hide_line']?></a>
</p>
<?php
}

function echoInput($name, $type, $default, $indent_string)
{
    echo "\n" . $indent_string . '<input class="input" type="'.$type.'" step="any" name="'.$name.'" id="'.$name.'" value="'.$default.'" oninput="EngCalcs.submitForm();" />';

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
EngCalcs.unitSets['<?=$key?>'] = ['<?=implode($set, "', '")?>'];
<?php endforeach ; ?>
$(document).ready(function() {
	$('#set_units_m').click(function() {EngCalcs.setUnits('m')});
	$('#set_units_mm').click(function() {EngCalcs.setUnits('mm')});
	$('#set_units_ft').click(function() {EngCalcs.setUnits('ft')});
	$('#set_units_in').click(function() {EngCalcs.setUnits('in')});
	$('#btn-printable').click(function() {$('.d-print-none').hide()});
});
</script>
<form id="formInput" action="javascript:EngCalcs.submitForm()" method="post">
	<input type="text" style="font-size: 2em; width: 98%" placeholder="<?=$ec_lang['template_printable_title']?>" /><br />
	<input type="text" style="font-size: 1.5em; width: 98%" placeholder="<?=$ec_lang['template_printable_subtitle']?>" />
	<table class="bare">
		<tbody>
			<tr class="collapse d-print-none<?php if ($flagHideUnits === false) : ?> show<?php endif; ?>" id="set_units_row">
				<td>
					<?=$ec_lang['calc_set_units']?> <button type="button" id="set_units_m"><?=$ec_lang['u_m']?></button><button type="button" id="set_units_mm"><?=$ec_lang['u_mm']?></button><button type="button" id="set_units_ft"><?=$ec_lang['u_ft']?></button><button type="button" id="set_units_in"><?=$ec_lang['u_in']?></button><a data-toggle="collapse" href="#set_units_row" aria-expanded="true" aria-controls="set_units_row"><?=$ec_lang['view_hide_line']?></a>
				<td>
			</tr>
			<tr>
				<td>
					Inputs
					<table>
						<tbody>
<?php
	foreach ($arrayInputs as $input) {
?>
							<tr class="collapse show" id="<?=$input['name']?>_row">
								<td><label for='<?=$input['name']?>'><?=$input['label']?></label></td>
								<td>
									<?php echoInput($input['name'], $input['type'], $input['default'], "\t\t\t\t\t\t\t\t\t");?><?php echoUnitSelect($input['name'].'u', $input['units'], "\t\t\t\t\t\t\t\t\t");?>
								</td>
								<td class="engcalcs-x d-print-none"><a data-toggle="collapse" href="#<?=$input['name']?>_row" aria-expanded="true" aria-controls="<?=$input['name']?>_row">X</a></td>
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
								<td class="engcalcs-x d-print-none"><a data-toggle="collapse" href="#<?=$result['name']?>_row" aria-expanded="true" aria-controls="<?=$input['name']?>_row">X</a></td>
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
	EngCalcs.cookieName='<?php $p=pathinfo($_SERVER['SCRIPT_NAME']); echo $p['filename']; ?>';
	EngCalcs.readAndCalc(EngCalcs.cookieName, document.forms['formInput']);
<?php
}
?>
