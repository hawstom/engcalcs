<?php
/**
 * lpn_furniture_check.php still finds the furniture, still reads a whole function body, and still
 * turns away the project store.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING. The check finds nothing today. Its two failure modes both look exactly like
 * that: a key derivation that matches nothing reports "0 keys, all declared", and a function-body
 * reader that returns the empty string reports "none named by serializeProject()". Both would be
 * green forever and both would be guarding nothing. The corpus assertions at the bottom are the
 * floor; the fixtures are what pin the two pure functions to the shapes the page actually has.
 *
 * THE LOAD-BEARING NEGATIVE is `writeJSON(key, obj)`. That is the PROJECT store, and it must not be
 * derived as a key needing declaration: if it were, every project would have to be listed as
 * furniture, which is the rule inverted.
 */

define('LPN_FURNITURE_LIB_ONLY', 1);
require_once __DIR__ . '/lpn_furniture_check.php';

$fails = [];
$n = 0;

function ecFurnCase(string $name, $got, $want): void
{
    global $fails, $n;
    $n++;
    if ($got !== $want) {
        $fails[] = sprintf("%s\n      expected %s\n      got      %s", $name,
            json_encode($want), json_encode($got));
    }
}

// ---- 1. ecLpnDirectStorageKeys -----------------------------------------------------------------
ecFurnCase('a constant receiver is derived, value and all',
    ecLpnDirectStorageKeys("var LPN_PANE_KEY = 'lpn_pane';\n"
        . "try { localStorage.setItem(LPN_PANE_KEY, JSON.stringify(s)); } catch (e) {}"),
    ['LPN_PANE_KEY' => 'lpn_pane']);

ecFurnCase('the PROJECT STORE is not a furniture key -- writeJSON takes a computed key',
    ecLpnDirectStorageKeys("function writeJSON(key, obj) {\n"
        . "  try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}\n}"),
    []);

ecFurnCase('two keys, sorted, both derived',
    ecLpnDirectStorageKeys("var A_KEY = 'lpn_a';\nvar B_KEY = 'lpn_b';\n"
        . "localStorage.setItem(B_KEY, '1');\nlocalStorage.setItem(A_KEY, '2');"),
    ['A_KEY' => 'lpn_a', 'B_KEY' => 'lpn_b']);

ecFurnCase('a constant whose literal cannot be read is reported as empty, not dropped',
    ecLpnDirectStorageKeys("localStorage.setItem(MYSTERY_KEY, '1');"),
    ['MYSTERY_KEY' => '']);

// ---- 2. ecJsFunctionBody -----------------------------------------------------------------------
$src = "function other() { return 1; }\n"
     . "function serializeProject() {\n\tvar out = { a: 1 };\n\tif (x) { out.b = 2; }\n\treturn out;\n}\n"
     . "function after() { return 2; }";
ecFurnCase('reads to the MATCHING close brace, not the first one',
    ecJsFunctionBody($src, 'serializeProject'),
    "{\n\tvar out = { a: 1 };\n\tif (x) { out.b = 2; }\n\treturn out;\n}");

ecFurnCase('a function that is not there returns null, so the caller can say so',
    ecJsFunctionBody($src, 'noSuchFunction'), null);

ecFurnCase('an unterminated body returns null rather than the rest of the file',
    ecJsFunctionBody("function f() { if (x) {", 'f'), null);

// ---- 3. The corpus ------------------------------------------------------------------------------
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/lpn_furniture_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
} elseif (!preg_match('/(\d+) key\(s\) written straight to localStorage.*?\((\d+) bytes read\)/s', $line, $m)) {
    $fails[] = "corpus: could not read the check's own counts out of:\n      $line";
} else {
    if ((int) $m[1] < 4) {
        $fails[] = sprintf('corpus: only %d direct localStorage keys derived. Six shipped on '
            . '2026-09-06 and CLAUDE.md names four; a number below four means the derivation went '
            . 'blind.', (int) $m[1]);
    }
    if ((int) $m[2] < 1000) {
        $fails[] = sprintf('corpus: serializeProject() read as %d bytes. It is ~3,650; a short read '
            . 'means the brace counter stopped early and leg 1 is examining a fragment.', (int) $m[2]);
    }
}

// The check must actually FAIL when furniture reaches serializeProject(). Proved on a fixture,
// because the real function is in another agent's territory and must not be mutated to test this.
$n++;
$fixture = "var LPN_PANE_KEY = 'lpn_pane';\nlocalStorage.setItem(LPN_PANE_KEY, '1');\n"
    . "function serializeProject() {\n" . str_repeat("\t// padding to clear the length floor\n", 40)
    . "\tvar out = { nodes: doc.nodes, pane: readJSON(LPN_PANE_KEY) };\n\treturn out;\n}\n";
$body = ecJsFunctionBody($fixture, 'serializeProject');
if ($body === null || strpos($body, 'LPN_PANE_KEY') === false) {
    $fails[] = 'leak fixture: a serializeProject() that DOES name a furniture constant was not '
        . 'seen. Leg 1 cannot fire.';
}

if ($fails) {
    echo 'lpn_furniture selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  $f\n"; }
    exit(1);
}
echo "lpn_furniture selftest OK -- $n cases.\n";
