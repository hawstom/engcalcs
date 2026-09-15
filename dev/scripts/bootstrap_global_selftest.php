<?php
/**
 * bootstrap_global_selftest.php -- bootstrap_global_check.php still sees an undeclared reach, still
 * derives its name set from the tree, and still turns away the shapes that only look like one.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. A ratchet that is holding and one
 * that has gone blind print the same line, and the blind one prints SMALLER counts, which reads as
 * simplification rather than as a failure. So the pair count and the derived name count are both
 * asserted against the real tree, and the reach is proved by a LIVE MUTATION: a temporary library
 * file with one undeclared read, which the real check must name. A corpus guard that requires a
 * defect to still exist is the shape that has already died of success in this repository once.
 *
 * TWO FIXTURES ARE LOAD-BEARING AND BOTH ARE NEGATIVE. `chooseLanguage()` carries
 * `print_r($language_settings)` inside a commented-out debug block, so a scan that read comments
 * would open on a finding against correct code; and the same function takes
 * `$all_language_settings` as a PARAMETER, which shadows the global on purpose.
 *
 *   php dev/scripts/bootstrap_global_selftest.php
 */

define('BOOTSTRAP_GLOBAL_LIB_ONLY', true);
require __DIR__ . '/bootstrap_global_check.php';

$fails = [];
$n = 0;

/**
 * One fixture. `$ec_lang` is seeded as a derived name by a second function that declares it, which
 * is exactly how the real derivation works -- so a fixture cannot pass by having no name set.
 */
function ecBgCase(string $name, string $php, bool $want): void
{
    global $fails, $n;
    $n++;
    $seed = "<?php\nfunction ecSeedDeclares() { global \$ec_lang, \$ec_units, \$ec_icons, "
          . "\$language_settings, \$html_desc; return \$ec_lang['k']; }\n";
    $got = ecBootstrapGlobalFindings(['lib/Seed.lib.php' => $seed, 'lib/X.lib.php' => "<?php\n" . $php])['findings'];
    // The exception-still-reachable finding is about the real tree and is not what a fixture is
    // asking about, so it is filtered out here.
    $got = array_values(array_filter($got, fn($f) => strpos($f, 'ecBootstrapGlobalExceptions()') !== 0));
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . strtok($got[0], "\n") : 'none');
    }
}

// ---- what it MUST find -------------------------------------------------------------------------
ecBgCase('THE DEFECT: a function reading $ec_lang with no global, which sees NULL',
    "function ecLabel() { return '<b>' . \$ec_lang['mpf_flow'] . '</b>'; }", true);
ecBgCase('a function ASSIGNING one, which writes a local and leaves the page\'s own value alone',
    "function ecSetDesc() { \$html_desc = 'x'; }", true);
ecBgCase('declared in ONE function and read in the next, which is the copy-paste this catches',
    "function a() { global \$ec_lang; return \$ec_lang['x']; }\n"
    . "function b() { return \$ec_lang['y']; }", true);
ecBgCase('a DIFFERENT global declared, which is the near-miss a reader skims past',
    "function ecRow() { global \$ec_units; return \$ec_lang['x'] . \$ec_units['ft']; }", true);
ecBgCase('read inside a double-quoted string, where PHP interpolates it for real',
    "function ecEcho() { echo \"label: \$ec_lang[mpf_flow]\"; }", true);

// ---- what it must NOT report -------------------------------------------------------------------
ecBgCase('the suite idiom',
    "function ecLabel() { global \$ec_lang; return \$ec_lang['mpf_flow']; }", false);
ecBgCase('several names on one global statement, which is how lib/Menus.lib.php writes it',
    "function ecNav() { global \$ec_lang, \$language_settings; "
    . "return \$ec_lang['x'] . \$language_settings['LANGNAME']; }", false);
ecBgCase('$GLOBALS in place of the statement, which is the same reach spelled differently',
    "function ecLabel() { return \$GLOBALS['ec_lang']['x']; }", false);
ecBgCase('THE SHIPPED NEGATIVE: taken as a PARAMETER, which shadows the global by design',
    "function ecPick(\$ec_lang) { return \$ec_lang['x']; }", false);
ecBgCase('THE OTHER SHIPPED NEGATIVE: the name only inside a commented-out debug block, which is '
    . 'what chooseLanguage() carries',
    "function ecPick() {\n  /*\n  print_r(\$ec_lang);\n  */\n  return 1;\n}", false);
ecBgCase('the name in a line comment',
    "function ecPick() { // \$ec_lang is not read here\n  return 1;\n}", false);
ecBgCase('the name inside a SINGLE-quoted string, which PHP does not interpolate',
    "function ecPick() { return 'read \$ec_lang instead'; }", false);
ecBgCase('a longer name that merely starts the same way, which is a different variable',
    "function ecPick() { \$ec_langCode = 'en'; return \$ec_langCode; }", false);
ecBgCase('a global declared at the TOP of the file and read there, which is not in any function',
    "\$ec_lang = array();\necho \$ec_lang['x'];", false);
ecBgCase('a name nothing anywhere declares global, which the derivation cannot tell from a local',
    "function ecPick() { return \$ec_not_a_global['x']; }", false);
ecBgCase('the global declared after some code rather than on the first line, which still works',
    "function ecPick() { \$k = 'x'; global \$ec_lang; return \$ec_lang[\$k]; }", false);

// ---- the derivation itself ---------------------------------------------------------------------
$n++;
$derived = ecBgDerivedNames(['a.php' => "<?php\nfunction f() { global \$ec_lang, \$ec_units; }\n",
                             'b.php' => "<?php\n// global \$ec_fake;\nfunction g() { global \$ec_icons; }\n"]);
if ($derived !== ['ec_icons', 'ec_lang', 'ec_units']) {
    $fails[] = 'derivation: expected the three declared names and nothing from the comment, got: '
        . implode(', ', $derived);
}

// ---- the corpus, and the live mutation ---------------------------------------------------------
$root = dirname(__DIR__, 2);
$out = [];
$code = 0;
exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/bootstrap_global_check.php') . ' 2>&1',
    $out, $code);
$line = implode("\n", $out);

$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/OK -- (\d+) reach\(es\) into (\d+) derived/', $line, $m)) {
    $fails[] = "corpus: could not read the counts out of:\n      $line";
} else {
    if ((int) $m[1] < 24) {
        $fails[] = sprintf('corpus: only %d reach(es) found. 31 shipped on 2026-09-15, and a '
            . 'collapse this large means the function walk went blind rather than that the globals '
            . 'were refactored away -- which on a ratchet reads as progress.', (int) $m[1]);
    }
    if ((int) $m[2] < 8) {
        $fails[] = sprintf('corpus: only %d name(s) derived. 11 were derived on 2026-09-15; a '
            . 'shrinking name set silently shrinks everything this check can see.', (int) $m[2]);
    }
}

// The live mutation. A library file nothing requires, present for the length of one exec, removed
// inline and on shutdown so an interrupted selftest cannot leave a stray file in lib/.
$probe = $root . '/lib/EcSelftestGlobal.lib.php';
register_shutdown_function(function () use ($probe) { @unlink($probe); });
file_put_contents($probe, "<?php\n// TEMPORARY: written by dev/scripts/bootstrap_global_selftest.php.\n"
    . "function ecSelftestUndeclaredRead() { return \$ec_lang['mpf_flow']; }\n");
$out2 = [];
$code2 = 0;
exec(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/bootstrap_global_check.php') . ' 2>&1',
    $out2, $code2);
@unlink($probe);
$mut = implode("\n", $out2);
$n++;
if ($code2 === 0 || strpos($mut, 'EcSelftestGlobal.lib.php') === false) {
    $fails[] = "corpus mutation: a library file with one undeclared \$ec_lang read was written into "
        . "lib/ and the check did not fail on it. The scan is not reaching the directory it claims "
        . "to guard. Its output was:\n      " . $mut;
}

if ($fails) {
    echo 'bootstrap_global selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Bootstrap global selftest OK -- $n cases, both directions, the derivation, plus a live "
    . "mutation.\n";
exit(0);
