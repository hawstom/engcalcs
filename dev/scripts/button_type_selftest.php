<?php
/**
 * button_type_selftest.php -- button_type_check.php still sees a typeless button in a form, still
 * sees one built untyped in JavaScript, and still turns away the shapes that only look like one.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. A ratchet at zero that is holding
 * and one that has gone blind print the same line, and the blind one prints a SMALLER count, which
 * reads as tidying up rather than as a failure. So both counts are asserted against the real tree,
 * and the reach of each leg is proved by a LIVE MUTATION -- a temporary page and a temporary
 * module, each carrying exactly one violation, which the real check must name by file. A corpus
 * guard that requires a defect to still exist is the shape that has already died of success in
 * this repository once.
 *
 * The load-bearing fixtures are the negative ones. The suite renders 78 buttons OUTSIDE every form
 * and every one is correct; `js/*.js` says the word "button" in prose constantly; and one module
 * builds its button 35 lines before it types it.
 *
 *   php dev/scripts/button_type_selftest.php
 */

define('BUTTON_TYPE_LIB_ONLY', true);
require __DIR__ . '/button_type_check.php';

$fails = [];
$n = 0;

function ecBtCase(string $name, string $html, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecButtonMarkupFindings('x.php', $html)['findings'];
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . strtok($got[0], "\n") : 'none');
    }
}

function ecBtJsCase(string $name, string $js, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecButtonJsFindings(['js/x.js' => $js])['findings'];
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . strtok($got[0], "\n") : 'none');
    }
}

// ---- markup: what it MUST find -----------------------------------------------------------------
ecBtCase('THE DEFECT: a typeless button inside the calculator form, which submits it',
    '<form id="ec_form"><input name="q"><button class="btn">Calculate</button></form>', true);
ecBtCase('a typeless button in a form that has an action, where submitting navigates away',
    '<form action="/x"><button>Go</button></form>', true);
ecBtCase('an UNCLOSED form, which a browser also treats as running to the end of the document',
    '<form id="ec_form"><p>rows<button>Add</button>', true);
ecBtCase('one typed and one not, in the same form',
    '<form><button type="button">A</button><button>B</button></form>', true);
ecBtCase('a typeless button in the SECOND of two forms',
    '<form><button type="button">A</button></form><form><button>B</button></form>', true);

// ---- markup: what it must NOT report -----------------------------------------------------------
ecBtCase('the suite idiom: type named first',
    '<form><button type="button" class="btn">Add row</button></form>', false);
ecBtCase('type named last, after several attributes',
    '<form><button class="btn" id="x" onclick="f()" type="submit">Send</button></form>', false);
ecBtCase('type spelled with spaces around the equals sign, which is still the attribute',
    '<form><button type = "button">A</button></form>', false);
ecBtCase('THE 78 SHIPPED NEGATIVES: a typeless button OUTSIDE every form, which submits nothing '
    . '-- Install.php ships one and it is correct',
    '<p><button class="btn" onclick="EngCalcs.installPWA()">Install</button></p>', false);
ecBtCase('a typeless button AFTER the form has closed',
    '<form><button type="button">A</button></form><button>B</button>', false);
ecBtCase('a word that merely begins the same way, which is not a button element',
    '<form><buttonish type="x">A</buttonish><span>button</span></form>', false);
ecBtCase('an input of type submit, which is a different element and already says what it is',
    '<form><input type="submit" value="Go"></form>', false);

// ---- JavaScript: what it MUST find -------------------------------------------------------------
ecBtJsCase('THE DEFECT: a created button that is never typed',
    "var b = document.createElement('button');\nb.textContent = 'Add';\nrow.appendChild(b);", true);
ecBtJsCase('typed on a DIFFERENT variable, which is the copy-paste this catches',
    "function f() {\n var b = document.createElement('button'), c = document.createElement('input');\n"
    . " c.type = 'button';\n b.textContent = 'x';\n}", true);
ecBtJsCase('typed only AFTER the enclosing function has closed, where it cannot be the same element',
    "function a() {\n var b = document.createElement('button');\n b.textContent = 'x';\n}\n"
    . "function c() {\n var b = document.createElement('button');\n b.type = 'button';\n}", true);

// ---- JavaScript: what it must NOT report -------------------------------------------------------
ecBtJsCase('the suite idiom, on the next line',
    "var b = document.createElement('button');\nb.type = 'button';", false);
ecBtJsCase('THE SHIPPED SHAPE: built in a multi-name var statement and typed 35 lines later, which '
    . 'is what js/looped-network.js demandRowInto() does',
    "function r() {\n var tr = document.createElement('tr'),\n  del = document.createElement('button');\n"
    . str_repeat(" var pad = 1;\n", 40) . " del.type = 'button';\n del.textContent = 'x';\n}", false);
ecBtJsCase('setAttribute rather than the property, which sets the same thing',
    "var b = document.createElement('button');\nb.setAttribute('type', 'button');", false);
ecBtJsCase('a COMMENT about buttons and their types, which creates nothing',
    "// Every button in the popup is type=button; a createElement('button') with no type submits.\nvar x = 1;", false);
ecBtJsCase('a block comment quoting the construct',
    "/*\n * document.createElement('button') without .type is a submit button.\n */\nvar x = 1;", false);
ecBtJsCase('a different element entirely',
    "var d = document.createElement('div');\nd.className = 'x';", false);
ecBtJsCase('a brace inside a STRING between the two halves, which must not end the block early',
    "function f() {\n var b = document.createElement('button');\n var s = '} not a brace {';\n"
    . " b.type = 'button';\n}", false);

// ---- the corpus, and two live mutations ---------------------------------------------------------
$root = dirname(__DIR__, 2);
$out = [];
$code = 0;
exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/button_type_check.php') . ' 2>&1',
    $out, $code);
$line = implode("\n", $out);

$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/(\d+) inside a <form>/', $line, $m)) {
    $fails[] = "corpus: could not read the in-form button count out of:\n      $line";
} elseif ((int) $m[1] < 120) {
    $fails[] = sprintf('corpus: only %d in-form button(s) found. 161 were rendered on 2026-09-15, '
        . 'and a collapse this large means the render or the form detection went blind rather than '
        . 'that the controls were removed -- which on a ratchet reads as progress.', (int) $m[1]);
}
$n++;
if (!preg_match('/(\d+) built in js\/\*\.js/', $line, $m2)) {
    $fails[] = "corpus: could not read the JS creation count out of:\n      $line";
} elseif ((int) $m2[1] < 40) {
    $fails[] = sprintf('corpus: only %d created button(s) found in js/*.js. 56 shipped on '
        . '2026-09-15, so the JS leg is not reaching what it claims to read.', (int) $m2[1]);
}

// Mutation 1: a page with one typeless button inside a form. It is removed inline and on shutdown,
// so an interrupted selftest cannot leave a stray page in the web root.
$page = $root . '/ec_selftest_button.php';
$mod  = $root . '/js/ec_selftest_button.js';
register_shutdown_function(function () use ($page, $mod) { @unlink($page); @unlink($mod); });
file_put_contents($page, "<?php\n// TEMPORARY: written by dev/scripts/button_type_selftest.php.\n"
    . "require_once('lib/base.inc.php');\n"
    . "echo \"<form id='ec_selftest_form'><button class='btn'>Calculate</button></form>\";\n");
$out2 = [];
$code2 = 0;
exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/button_type_check.php') . ' 2>&1',
    $out2, $code2);
@unlink($page);
$m1 = implode("\n", $out2);
$n++;
if ($code2 === 0 || strpos($m1, 'ec_selftest_button.php') === false) {
    $fails[] = "corpus mutation 1: a page with one typeless button inside a form was written into "
        . "the web root and the check did not fail on it. The markup leg is not reaching the pages "
        . "it claims to render. Its output was:\n      " . $m1;
}

// Mutation 2: a module that builds a button and never types it.
file_put_contents($mod, "// TEMPORARY: written by dev/scripts/button_type_selftest.php.\n"
    . "var ecSelftestBtn = document.createElement('button');\n"
    . "ecSelftestBtn.textContent = 'x';\n");
$out3 = [];
$code3 = 0;
exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/button_type_check.php') . ' 2>&1',
    $out3, $code3);
@unlink($mod);
$m2s = implode("\n", $out3);
$n++;
if ($code3 === 0 || strpos($m2s, 'ec_selftest_button.js') === false) {
    $fails[] = "corpus mutation 2: a module that builds a button and never sets .type was written "
        . "into js/ and the check did not fail on it. The JavaScript leg is not reaching the "
        . "directory it claims to guard. Its output was:\n      " . $m2s;
}

if ($fails) {
    echo 'button_type selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Button type selftest OK -- $n cases, both legs, both directions, plus two live mutations.\n";
exit(0);
