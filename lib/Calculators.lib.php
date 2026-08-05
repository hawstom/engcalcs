<?php

// One invitation line per page, placed after the results and before the Notes (ROADMAP Task 205).
// This absorbed the former echoHelpWanted()/template_translation_help line that used to sit above
// the form: both linked to contact.php, and once template_feedback was broadened they said the same
// thing. Two collapsible links to one destination halve each other's weight rather than doubling
// the invitation. The "better wording" ask survives inside template_feedback on purpose -- it is
// the one report only a non-English reader can file.
function echoFeedback(){
    global $ec_lang;
?>
<?php // No [Hide this line] control here, deliberately (Tom, 2026-08-03, ROADMAP Task 205). A dismiss
      // affordance is the visual grammar of a cookie banner or nag bar, and readers have long since
      // trained themselves to skip anything wearing it -- so it did not merely permit ignoring the
      // invitation, it marked it as chrome. It was also doing no real work: the collapse state has no
      // cookie or storage behind it, so a hidden line came back on the next page load. d-print-none
      // stays, which is what actually serves the "I want a clean page" need, along with the
      // Printable version button. Other collapsible lines (relatedCalcs, the units row) keep their
      // toggles -- those genuinely are chrome. ?>
<p class="d-print-none" id="feedback">
	<a href="../contact.php"><?=$ec_lang['template_feedback']?></a>
</p>
<?php
}

/**
 * Resolves a field's 'default' declaration to the number shown on first load.
 *
 * A default is expressed IN THE DISPLAYED UNIT, so a page that can open in either
 * US or SI needs one per preset -- otherwise flipping EC_DEFAULT_UNIT_SET silently
 * changes what every default means (6 in would become 6 mm). Two forms:
 *
 *   'default' => '1000'                          scalar: unit-independent, or the
 *                                                field has no unit select at all
 *   'default' => Array('us' => '36', 'si' => '900')   one round number per preset
 *
 * An array missing the active preset falls back to the other one rather than
 * rendering blank, so a half-filled declaration degrades visibly, not silently.
 */
function ecDefaultValue($default)
{
    if (!is_array($default)) {
        return $default;
    }
    if (isset($default[EC_DEFAULT_UNIT_SET])) {
        return $default[EC_DEFAULT_UNIT_SET];
    }
    return reset($default);
}

function inputHtml($name, $type, $default, $indent_string)
{
    $value = ecDefaultValue($default);
    return "\n" . $indent_string . '<input class="input" type="'.$type.'" step="any" name="'.$name.'" id="'.$name.'" value="'.$value.'" oninput="EngCalcs.submitForm();" />';

}

// Inline "solve this field from a target flow" control. Returned as HTML for an input
// array's 'control' key, so echoCalculatorForm() renders it in the label cell just after
// </label> -- the field being solved for and the control that solves it are one element.
// Reuses the solver_q / solver_qu / solver_msg ids the page's own solver JS already reads.
// The line reads "[Solve] for Flow, Q = __ [units]": the connective is ONE whole language
// key (mpf_solve_for_flow), never a preposition composed with a separate noun at render
// time, so word order and case agreement stay the translator's to decide.
function solverControlHtml($onclick, $units = 'flow_channel')
{
    global $ec_lang, $ec_units;
    $family = is_string($units) ? $units : '';
    $units = ecUnitOptions($units);
    $html = "\n" . '<span class="ec-solverline d-print-none">'
        . '<button type="button" onclick="' . $onclick . '">' . $ec_lang['mpf_solve_button'] . '</button> '
        . $ec_lang['mpf_solve_for_flow'] . ' '
        . '<input class="input" type="number" step="any" id="solver_q" value="1.0" />'
        . ' <select id="solver_qu" data-family="' . htmlspecialchars($family) . '" onchange="EngCalcs.submitForm()">';
    $default = ecDefaultUnit($family);
    foreach ($units as $unit) {
        $html .= '<option value="' . $ec_units[$unit] . '" data-unit="' . $unit . '"'
            . ($unit === $default ? ' selected="selected"' : '') . '>' . $ec_lang['u_' . $unit] . '</option>';
    }
    $html .= '</select> <span id="solver_msg" class="ec-status-bad"></span></span>';
    return $html;
}

/**
 * Resolves a field's 'units' declaration to its option list.
 *
 * Accepts a FAMILY NAME (the current form, defined in lib/Units.lib.php) or a raw
 * inline array (the pre-Task-162 form), so pages migrate one at a time instead of
 * in a flag-day change. An unknown family name is a typo that would otherwise render
 * an empty dropdown, so it fails loudly in development and degrades to no dropdown
 * in production rather than showing a broken control.
 */
function ecUnitOptions($units)
{
    global $ec_unit_families;

    if ($units === NULL) {
        return NULL;
    }
    if (is_array($units)) {
        return $units;
    }
    if (isset($ec_unit_families[$units])) {
        return $ec_unit_families[$units];
    }

    trigger_error('Unknown unit family: ' . $units, E_USER_WARNING);
    return NULL;
}

/**
 * The unit a first-time visitor sees for this family, from the default preset.
 * Returns '' for a legacy inline array (no family identity to look up), in which
 * case the browser falls back to the first option -- the pre-Task-162 behaviour.
 */
function ecDefaultUnit($family)
{
    global $ec_unit_sets;

    if ($family === '' || !isset($ec_unit_sets[EC_DEFAULT_UNIT_SET][$family])) {
        return '';
    }
    return $ec_unit_sets[EC_DEFAULT_UNIT_SET][$family];
}

function echoUnitSelect($name, $units, $indent_string)
{
    global $ec_units, $ec_lang;

    $family = is_string($units) ? $units : '';
    $options = ecUnitOptions($units);
    if ($options === NULL) {
        return;
    }

    // data-family lets a preset find this select; data-unit lets it pick an option
    // without matching translated label text (which is both fragile across languages
    // and the mechanism of the old overwrite bug).
    echo "\n" . $indent_string . '<select name="' . $name . '" data-family="' . htmlspecialchars($family) . '" onchange="EngCalcs.submitForm()">';
    $default = ecDefaultUnit($family);
    foreach ($options as $unit) {
        echo "\n" . $indent_string . "\t" . '<option value="' . $ec_units[$unit] . '" data-unit="' . $unit . '"'
            . ($unit === $default ? ' selected="selected"' : '') . '>' . $ec_lang['u_' . $unit] . '</option>';
    }
    echo "\n$indent_string</select>";
}

// Extracted (ROADMAP Task 174) so a page that can't use echoCalculatorForm()'s fixed two-column
// table — one whose inputs are a per-element property sheet, e.g. a map-editor page — can still get
// the Restore-defaults/US/SI row and working unit presets without copy-pasting suite chrome. Bundles
// everything the row needs: the EngCalcs.unitSets/defaultUnitSet globals EngCalcs.setUnits() reads,
// the button wiring, and the HTML itself — call this alone and unit presets just work.
function echoUnitsRow($flagHideUnits = false, $flagHideDefaults = false)
{
    global $ec_lang;
?>
<script>
// Presets are family => unit-key maps, not lists of translated labels (Task 162).
EngCalcs.unitSets = <?=json_encode($GLOBALS['ec_unit_sets'], JSON_UNESCAPED_UNICODE)?>;
// Which preset the page rendered in. Pages that seed sample rows from JS must pick
// their seed numbers to match, or a metric sample renders as a 100-inch pipe.
EngCalcs.defaultUnitSet = '<?=EC_DEFAULT_UNIT_SET?>';
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('set_units_us').addEventListener('click', function() { EngCalcs.setUnits('us'); });
	document.getElementById('set_units_si').addEventListener('click', function() { EngCalcs.setUnits('si'); });
});
</script>
<div class="collapse d-print-none<?php if ($flagHideUnits === false) : ?> show<?php endif; ?>" id="set_units_row">
	<?php // Defaults sits BEFORE the "Set units:" label, not after the unit buttons, so the
	      // label reads as introducing only the two buttons it actually controls. Grouped the
	      // old way, "Set units: [US][SI][Default values]" implied Defaults was a third unit
	      // choice (Tom, 2026-07-28).
	      // $flagHideDefaults (Task 146, 2026-07-30): the button calls EngCalcs.resetToDefaults(),
	      // which expires a cookie -- meaningless on a page like lpn_ that doesn't use cookie-based
	      // field persistence at all (it has its own localStorage document instead). Opt-in per
	      // page, not a suite-wide removal: every other calculator still relies on it. ?>
	<?php if ($flagHideDefaults === false) : ?>
	<button type="button" id="calc_defaults" onclick="EngCalcs.resetToDefaults('<?=addslashes($ec_lang['calc_defaults_confirm'])?>')"><?=$ec_lang['calc_defaults']?></button>
	&nbsp;
	<?php endif; ?>
	<?php // SI first, US second (Tom, 2026-07-30): the suite serves a worldwide audience, and the
	      // vast majority of it is metric -- leading with the one system that's a minority worldwide
	      // reads as US-centric. Button IDs/behavior are unchanged, only the visual order. ?>
	<?=$ec_lang['calc_set_units']?> <button type="button" id="set_units_si"><?=$ec_lang['calc_units_si']?></button><button type="button" id="set_units_us"><?=$ec_lang['calc_units_us']?></button> <a data-bs-toggle="collapse" href="#set_units_row" aria-expanded="true" aria-controls="set_units_row"><?=$ec_lang['view_hide_line']?></a>
</div>
<?php
}

function echoCalculatorForm($arrayInputs, $arrayResults, $flagFormAppend = false, $flagHideUnits = false)
{
    global $ec_lang;
?>
<script>
document.addEventListener('DOMContentLoaded', function() {
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
	<?php echoUnitsRow($flagHideUnits); ?>
	<div style="overflow-x:auto">
	<table class="bare">
		<tbody>
			<tr>
				<td>
					<?=$ec_lang['calc_inputs']?>
					<table>
						<tbody>
<?php
	foreach ($arrayInputs as $input) {
?>
							<tr class="collapse show" id="<?=$input['name']?>_row">
								<td><label for='<?=$input['name']?>'><?=$input['label']?></label><?php if (!empty($input['control'])) echo $input['control']; ?></td>
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
<?php endif; ?>
			</tr>
		</tbody>
	</table>
	</div>
<?php
// The endif above used to sit AFTER </table></div> (fixed 2026-08-04). A page with no $arrayResults
// therefore skipped not just the results cell -- which is the whole point of the condition -- but
// the four closing tags after it, shipping an unclosed <tr>, <td>, <table class="bare"> and
// <div style="overflow-x:auto">. Weir-Flow-Irregular.php is the one page with no results array, and
// it has been served that way for as long as the condition has existed. Found by
// dev/scripts/html_balance_check.php on the day that script was written, which is a fair argument
// for the script.
?>
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
	EngCalcs.sessionAgeMs = <?=json_encode($GLOBALS['ec_sessionAgeMs'] ?? 0)?>;
	EngCalcs.readCookieAndCalc(document.forms['formInput']);
<?php
}
// Omit last closing tag is good practice.
