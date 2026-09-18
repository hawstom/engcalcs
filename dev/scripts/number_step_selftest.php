<?php
/**
 * number_step_selftest.php -- number_step_check.php still sees a number input with no step, and
 * still turns away the shapes that only look like one. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. A ratchet at zero that has gone
 * blind and one that is holding print the same line, and the blind one prints SMALLER counts,
 * which reads as tidying. So both counts are asserted against the real tree and the reach into
 * `js/` is proved by a LIVE MUTATION -- a module with one unstepped number input, written for the
 * length of one exec, which the real check must name.
 *
 * The load-bearing fixture is the BRACE one. `unitNumberField()` sets `.type` on its second line;
 * a line window would have to be tuned, and `demandRowInto()` elsewhere in this tree already puts
 * the two halves of a pair 35 lines apart. The block is found by brace matching, so the fixture
 * that matters is the one where the step is far away but still inside, and the one where it is
 * near but in a DIFFERENT function.
 *
 *   php dev/scripts/number_step_selftest.php
 */

define('NUMBER_STEP_LIB_ONLY', true);
require __DIR__ . '/number_step_check.php';

$fails = array();
$n = 0;

function ecNsJs(string $name, string $js, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecStepJsFindings(array('js/x.js' => $js))['findings'];
    $hit = $got !== array();
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

function ecNsHtml(string $name, string $html, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecStepMarkupFindings('x.php', $html)['findings'];
    $hit = $got !== array();
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

// ---- JavaScript: what it MUST find -------------------------------------------------------------
ecNsJs('THE DEFECT: the shape the map editor shipped five times',
    "function f() {\n\tvar input = document.createElement('input');\n\tinput.type = 'number';\n\tinput.value = v;\n}", true);
ecNsJs('a step set on a DIFFERENT element in the same block, which steps nothing',
    "function f() {\n\tvar a = mk(), b = mk();\n\ta.type = 'number';\n\tb.step = 'any';\n}", true);
ecNsJs('A STEP IN A NEIGHBOURING FUNCTION. Brace matching is the whole point: the line window '
    . 'that would pass this is the bug',
    "function a() {\n\tvar input = mk();\n\tinput.step = 'any';\n}\nfunction b() {\n\tvar input = mk();\n\tinput.type = 'number';\n}", true);
ecNsJs('one stepped and one not, in the same file',
    "function a() { var x = mk(); x.type = 'number'; x.step = 'any'; }\n"
    . "function b() { var y = mk(); y.type = 'number'; }", true);
ecNsJs('double quotes, which are the same assignment',
    "function f() { var x = mk(); x.type = \"number\"; }", true);

// ---- JavaScript: what it must NOT report -------------------------------------------------------
ecNsJs('the idiom this suite writes twenty times, on one line',
    "function f() { var x = mk(); x.type = 'number'; x.step = 'any'; }", false);
ecNsJs('A STEP SET FAR BELOW but still inside the same function -- what unitNumberField() does',
    "function f() {\n\tvar input = mk();\n\tinput.type = 'number';\n"
    . str_repeat("\t// a long argument about something else\n", 30)
    . "\tinput.step = 'any';\n}", false);
ecNsJs('a small bounded integer, which correctly declares step 1 and opts back into the spinner',
    "function f() { var s = mk(); s.type = 'number'; s.className = 'ec-spin';\n\ts.step = '1'; s.min = '1'; }", false);
ecNsJs('the step written with setAttribute, which is the same declaration',
    "function f() { var x = mk(); x.type = 'number'; x.setAttribute('step', 'any'); }", false);
ecNsJs('A TYPE SET FROM A VARIABLE -- no literal to follow, so it is turned away and counted rather '
    . 'than guessed at',
    "function f() { var i = mk(); i.type = column.inputType; }", false);
ecNsJs('a COMMENT discussing a number input and its step, which builds nothing',
    "// input.type = 'number' with no step snaps the arrow keys to whole numbers.\nvar x = 1;", false);
ecNsJs('a block comment doing the same, which is how this design is recorded',
    "/*\n * x.type = 'number';\n */\nvar x = 1;", false);
ecNsJs('a REGEX LITERAL carrying a quote, which must not swallow the comment after it',
    "var q = /['\"]/;\n// x.type = 'number';\nvar y = 2;", false);
ecNsJs('a different type entirely',
    "function f() { var x = mk(); x.type = 'text'; }", false);

// ---- rendered markup ---------------------------------------------------------------------------
ecNsHtml('THE DEFECT in markup: a number input with no step attribute',
    '<input type="number" name="d" value="6" />', true);
ecNsHtml('the attribute every PHP-rendered number input in this suite carries',
    '<input type="number" name="d" value="6" step="any" />', false);
ecNsHtml('a text input, which has no step to declare',
    '<input type="text" name="title" />', false);
ecNsHtml('a select, which is not an input at all',
    '<select name="du"><option value="in">in</option></select>', false);

// ---- the corpus, and the live mutation ---------------------------------------------------------
$out = array();
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/number_step_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/OK -- (\d+) rendered number input\(s\) on (\d+) page\(s\) and (\d+) built/', $line, $m)) {
    $fails[] = "corpus: could not read the counts out of:\n      $line";
} else {
    if ((int) $m[1] < 90) {
        $fails[] = sprintf('corpus: only %d rendered number input(s). 105 shipped on 2026-09-17, '
            . 'and a collapse this large means the scan stopped reaching the pages -- which on a '
            . 'ratchet reads as progress.', (int) $m[1]);
    }
    if ((int) $m[3] < 20) {
        $fails[] = sprintf('corpus: only %d number input(s) built in js/*.js. 25 shipped on '
            . '2026-09-17, and the JavaScript door is the one the five defects were found in.',
            (int) $m[3]);
    }
}

// The live mutation. Not a shipped module, no page loads it; removed inline AND on shutdown so a
// selftest cannot leave a stray file in js/.
$probe = dirname(__DIR__, 2) . '/js/ec_selftest_step.js';
register_shutdown_function(function () use ($probe) { @unlink($probe); });
file_put_contents($probe, "// TEMPORARY: written by dev/scripts/number_step_selftest.php.\n"
    . "function ecSelftestStepProbe() {\n\tvar input = document.createElement('input');\n"
    . "\tinput.type = 'number';\n\treturn input;\n}\n");
$out2 = array();
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/number_step_check.php') . ' 2>&1', $out2, $code2);
@unlink($probe);
$probeLine = implode("\n", $out2);
$n++;
if (strpos($probeLine, 'ec_selftest_step.js') === false || $code2 === 0) {
    $fails[] = "corpus mutation: a module with one unstepped number input was written into js/ and "
        . "the check did not fail on it. The scan is not reaching the directory it claims to "
        . "guard. Its output was:\n      " . $probeLine;
}

if ($fails) {
    echo 'number_step selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Number input step selftest OK -- $n cases across both doors, plus a live mutation.\n";
exit(0);
