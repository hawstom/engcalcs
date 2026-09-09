<?php
/**
 * form_field_units_check.php -- A CALCULATOR'S `hasUnits` ARGUMENT AGREES WITH THE FORM.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHAT IT HOLDS. `js/Calculators.lib.js` has exactly three seams between a calculator's arithmetic
 * and the form a visitor typed into, and all three take a FIELD NAME and a BOOLEAN:
 *
 *     EngCalcs.readFormInput(objForm, 'd', hasUnits = true);         // this.var.d = objForm.d.value / factor
 *     EngCalcs.readFormInputPerUnit(objForm, 'price');               // always unit-bearing: it multiplies
 *     EngCalcs.writeFormResult(objForm, 'hf', 4, hasUnits = true);   // getElementById('hf') <- var * factor
 *
 * The boolean decides whether the number is multiplied or divided by `unitFactor(objForm[name+'u'])`
 * at all. **The page is the other half of that pair**: a field is unit-bearing exactly when the
 * rendered form carries a `<select name="<name>u">`, which `echoUnitSelect()` emits from the field's
 * declared unit FAMILY. Nobody had ever compared the two ends, in either direction.
 *
 * WHY IT NEEDS A CHECK AND NOT A PARAGRAPH -- the failure renders perfectly and is wrong by a
 * factor. Write `hasUnits = false` on a field that has a unit select and the value is taken raw:
 * the visitor types 6 into a box labelled `in`, the solver receives 6 metres, the page renders, the
 * select still shows `in`, an answer comes back, and it is wrong by 25.4. Write `hasUnits = true`
 * on a field that has none and `objForm[name + 'u']` is undefined, so `unitFactor()` is asked about
 * nothing. This is CLAUDE.md's per-preset-default defect (`unit_default_preset_check.php`, survey
 * row 30) one layer further in: same silence, same audience, and the author is right in whichever
 * preset they happen to be working in.
 *
 * It also holds the cheaper half of the same pair: **the NAME must resolve.** `objForm[name]` on a
 * field the form does not have throws inside `pageCalculator`, which aborts the whole calculation --
 * so the results table simply stops updating, with nothing on the page to say why.
 *
 * WHAT IT READS, AND WHY IT IS THE RENDERED PAGE. A field is a control the browser receives, and
 * `Manning-Trap.php` proves the declaration is not enough: `d50_safety` is a real input built by
 * hand with `inputHtml()` INSIDE another field's label, so it exists in every browser and appears
 * in no `'name' =>` declaration. Reading the render costs one subprocess per page (see
 * `render_page.php` on why one page per process) and removes the question entirely.
 *
 *   - an INPUT name is `name="x"` on an input, select or textarea inside the form;
 *   - a RESULT name is an `id="x"` in the page, because `writeFormResult()` writes through
 *     `document.getElementById()` rather than through the form;
 *   - a field is UNIT-BEARING iff a control named `xu` exists. That is `echoUnitSelect()`'s own
 *     naming and it is the same string `readFormInput()` builds at runtime.
 *
 * PAGE TO SCRIPT. A calculator's own module is found in the page's rendered `<script src>` tags, so
 * the pairing is read rather than typed. Thirteen of the sixteen calculators reach these seams; the
 * other three are NAMED in the passing output rather than left as a silence, because a page whose
 * arithmetic goes through some other route is not a page this check has examined.
 *
 * TURNED AWAY AND COUNTED, never silently skipped:
 *   - a call whose field name is not a literal (`'q_' + i` in a row table). There is no name to
 *     resolve and no declaration to compare it with.
 *   - a call whose `hasUnits` argument is not a literal `true`/`false`.
 * Both are printed. `readFormInputPerUnit()` takes no boolean and is unit-bearing by construction
 * (its whole reason for existing is that it multiplies where the other divides), so it is checked
 * for its name and for having a unit select, and its boolean leg does not apply.
 *
 * WHAT THIS IS NOT. `unit_family_check.php` holds the three unit arrays against each other;
 * `unit_select_family_check.php` holds that a select names a family; `unit_default_preset_check.php`
 * holds that a default is per preset. None of the three has ever read a line of calculator
 * JavaScript, and none of them can see whether the arithmetic asked for the conversion.
 *
 * Exit 0 clean, 1 on any finding. Blocking: there is no judgement anywhere in it.
 *
 * Usage:  php dev/scripts/form_field_units_check.php
 */

/**
 * Every literal call to the three form seams in one JavaScript source.
 *
 * Pure, so the selftest can put fixtures through it. Comments must already be blanked.
 *
 * @param string $code Comment-blanked JavaScript.
 * @return array<int,array{fn:string,name:?string,units:?bool,raw:string}>
 *         `name` is null when the field name is not a literal; `units` is null when the boolean is
 *         not a literal. Either null means the call is turned away and counted by the caller.
 */
function ecFormSeamCalls(string $code): array
{
    $out = [];
    $re = '/\.(readFormInput|readFormInputPerUnit|writeFormResult)\s*\(([^;]*?)\)\s*;/';
    if (!preg_match_all($re, $code, $m, PREG_SET_ORDER)) { return $out; }
    foreach ($m as $hit) {
        $fn   = $hit[1];
        $args = $hit[2];
        $parts = ecFormSeamArgs($args);
        // arg 0 is the form object; arg 1 is the field name.
        $name = null;
        if (isset($parts[1]) && preg_match("/^'([A-Za-z0-9_]+)'$/", trim($parts[1]), $nm)) {
            $name = $nm[1];
        }
        $units = null;
        if ($fn === 'readFormInputPerUnit') {
            $units = true;                       // by construction: it converts, always.
        } else {
            // readFormInput(form, name, hasUnits) | writeFormResult(form, name, precision, hasUnits)
            $idx  = ($fn === 'readFormInput') ? 2 : 3;
            $last = isset($parts[$idx]) ? trim($parts[$idx]) : '';
            // `hasUnits = true` is an assignment expression used as a self-documenting argument
            // throughout this suite, so the literal may be on either side of an `=`.
            if (preg_match('/(?:^|=\s*)(true|false)$/', $last, $bm)) { $units = ($bm[1] === 'true'); }
        }
        $out[] = ['fn' => $fn, 'name' => $name, 'units' => $units, 'raw' => trim($hit[0])];
    }
    return $out;
}

/**
 * Split one argument list on top-level commas (brackets and quotes respected).
 *
 * @return array<int,string>
 */
function ecFormSeamArgs(string $args): array
{
    $parts = [];
    $buf = '';
    $depth = 0;
    $quote = '';
    $n = strlen($args);
    for ($i = 0; $i < $n; $i++) {
        $c = $args[$i];
        if ($quote !== '') {
            $buf .= $c;
            if ($c === '\\') { if ($i + 1 < $n) { $buf .= $args[++$i]; } continue; }
            if ($c === $quote) { $quote = ''; }
            continue;
        }
        if ($c === '"' || $c === "'") { $quote = $c; $buf .= $c; continue; }
        if (strpos('([{', $c) !== false) { $depth++; $buf .= $c; continue; }
        if (strpos(')]}', $c) !== false) { $depth--; $buf .= $c; continue; }
        if ($c === ',' && $depth === 0) { $parts[] = $buf; $buf = ''; continue; }
        $buf .= $c;
    }
    $parts[] = $buf;
    return $parts;
}

/**
 * The control and id names a rendered page offers, as the browser sees them.
 *
 * @param string $html A rendered page.
 * @return array{controls:array<string,bool>,ids:array<string,bool>}
 */
function ecFormSeamPageNames(string $html): array
{
    $controls = [];
    $ids = [];
    if (preg_match_all('/<(?:input|select|textarea)\b[^>]*\bname="([A-Za-z0-9_]+)"/i', $html, $m)) {
        foreach ($m[1] as $n) { $controls[$n] = true; }
    }
    if (preg_match_all('/\bid="([A-Za-z0-9_]+)"/i', $html, $m)) {
        foreach ($m[1] as $n) { $ids[$n] = true; }
    }
    return ['controls' => $controls, 'ids' => $ids];
}

/**
 * Judge one page's calls against one page's rendered names.
 *
 * Pure. Returns ['findings' => string[], 'checked' => int, 'turned' => string[]].
 *
 * @param string $page   Page basename, for the message.
 * @param string $module Module basename, for the message.
 * @param array<int,array{fn:string,name:?string,units:?bool,raw:string}> $calls
 * @param array{controls:array<string,bool>,ids:array<string,bool>} $names
 */
function ecFormFieldUnitsFindings(string $page, string $module, array $calls, array $names): array
{
    $findings = [];
    $turned = [];
    $checked = 0;
    foreach ($calls as $c) {
        if ($c['name'] === null || $c['units'] === null) {
            $turned[] = "$module: " . $c['raw'];
            continue;
        }
        $checked++;
        $n = $c['name'];
        $exists = ($c['fn'] === 'writeFormResult')
            ? isset($names['ids'][$n])
            : isset($names['controls'][$n]);
        if (!$exists) {
            $where = ($c['fn'] === 'writeFormResult') ? 'no element with id="' . $n . '"' : 'no form control named "' . $n . '"';
            $findings[] = "$page / $module: {$c['fn']}('$n') names a field the rendered page does not have -- $where.\n"
                . "      FIX: correct the name, or declare the field on $page. `objForm['$n']` is undefined at\n"
                . "      runtime, so pageCalculator() throws and the whole results table silently stops updating.";
            continue;
        }
        $hasSelect = isset($names['controls'][$n . 'u']);
        if ($hasSelect === $c['units']) { continue; }
        if ($c['units']) {
            $findings[] = "$page / $module: {$c['fn']}('$n', ... hasUnits = true) but the page renders no\n"
                . "      unit select named \"{$n}u\".\n"
                . "      FIX: pass hasUnits = false, or give the field a unit family. unitFactor() is being\n"
                . "      asked about an undefined select.";
        } else {
            $findings[] = "$page / $module: {$c['fn']}('$n', ... hasUnits = false) but the page renders a\n"
                . "      unit select named \"{$n}u\", so the visitor chooses a unit that is never applied.\n"
                . "      FIX: pass hasUnits = true. The page renders, the select shows the right unit, and the\n"
                . "      answer is wrong by that unit's factor for everyone not working in the SI base unit.";
        }
    }
    return ['findings' => $findings, 'checked' => $checked, 'turned' => $turned];
}

if (defined('FORM_FIELD_UNITS_LIB_ONLY')) {
    return;
}

require_once __DIR__ . '/js_scan.inc.php';

$root = dirname(__DIR__, 2);

/** One subprocess per page -- see render_page.php's header for why it cannot be an include. */
function ecFormSeamRender(string $page): ?string
{
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg($page) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    return ($html === null || trim($html) === '') ? null : $html;
}

$findings = [];
$turned = [];
$checked = 0;
$pagesRead = 0;
$noSeam = [];

foreach (glob($root . '/*.php') ?: [] as $path) {
    $src = (string) file_get_contents($path);
    if (strpos($src, 'echoCalculatorForm') === false) { continue; }   // a calculator, by the same
                                                                      // test calculator_page_check.php uses
    $page = basename($path);
    $html = ecFormSeamRender($page);
    if ($html === null) {
        $findings[] = "$page: did not render. Run `php dev/scripts/render_page.php $page` and read the error.\n"
            . "      FIX: a page this check cannot render is a page it has not examined, which is why this is\n"
            . "      a finding and not a skip.";
        continue;
    }
    $pagesRead++;
    $names = ecFormSeamPageNames($html);

    // The page's own modules, read out of what it actually loads rather than from a typed list.
    $modules = [];
    if (preg_match_all('#<script[^>]+src="[^"]*?/js/([A-Za-z0-9._-]+)\.js#i', $html, $m)) {
        foreach (array_unique($m[1]) as $mod) { $modules[] = $mod; }
    }
    $seamsHere = 0;
    foreach ($modules as $mod) {
        $mp = $root . '/js/' . $mod . '.js';
        if (!is_file($mp)) { continue; }
        $code = ecReadJsCode($mp);
        $calls = ecFormSeamCalls($code);
        if (!$calls) { continue; }
        $seamsHere += count($calls);
        $r = ecFormFieldUnitsFindings($page, $mod . '.js', $calls, $names);
        $findings = array_merge($findings, $r['findings']);
        $turned = array_merge($turned, $r['turned']);
        $checked += $r['checked'];
    }
    if ($seamsHere === 0) { $noSeam[] = $page; }
}

if ($findings) {
    echo 'Form field units: ' . count($findings) . " finding(s)\n\n";
    foreach ($findings as $f) { echo "  ! $f\n\n"; }
    exit(1);
}

printf(
    "Form field units OK -- %d literal call(s) to readFormInput/readFormInputPerUnit/writeFormResult\n"
    . "across %d rendered calculator page(s): every field name resolves, and every hasUnits argument\n"
    . "agrees with whether the page renders a \"<name>u\" unit select. A ratchet at zero.\n",
    $checked, $pagesRead
);
if ($turned) {
    echo 'Turned away and counted (' . count($turned) . "), no literal to resolve:\n";
    foreach ($turned as $t) { echo "  - $t\n"; }
}
if ($noSeam) {
    echo "Calculator page(s) reaching none of the three seams, named so silence is not read as\n"
        . "coverage: " . implode(', ', $noSeam) . "\n";
}
exit(0);
