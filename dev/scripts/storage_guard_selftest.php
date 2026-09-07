<?php
/**
 * storage_guard_selftest.php -- storage_guard_check.php still sees an unguarded access, and still
 * turns away the prose that only looks like one. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. A ratchet at zero that has gone
 * blind and a ratchet at zero that is holding print the same line, and the blind one prints a
 * SMALLER access count, which reads as tidying rather than as a failure. So the count is asserted
 * against the real tree and the reach is proved by a LIVE MUTATION -- never by a corpus guard
 * requiring a defect to still exist, which is the shape that died here the day it was fixed.
 *
 * The load-bearing fixtures are the NEGATIVE ones. `js/*.js` mentions web storage 28 times in
 * COMMENTS, explaining what is and is not kept on a visitor's device, and a scanner that counted
 * those would open on two dozen findings against correct code.
 *
 *   php dev/scripts/storage_guard_selftest.php
 */

define('STORAGE_GUARD_LIB_ONLY', true);
require __DIR__ . '/storage_guard_check.php';

$fails = [];
$n = 0;

function ecSgCase(string $name, string $js, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecStorageGuardFindings(['js/x.js' => $js])['findings'];
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

// ---- what it MUST find -----------------------------------------------------------------------
ecSgCase('THE DEFECT: a bare read, which throws outright when site data is blocked',
    "var v = localStorage.getItem('lpn_pane');", true);
ecSgCase('a bare write',
    "localStorage.setItem('k', '1');", true);
ecSgCase('sessionStorage, which throws in exactly the same browsers',
    "var v = sessionStorage.getItem('k');", true);
ecSgCase('AN ACCESS AFTER the try block has closed, which is the drift this guards against',
    "try { localStorage.getItem('a'); } catch (e) {}\nlocalStorage.setItem('b', '1');", true);
ecSgCase('an access inside the CATCH, where the guard has already failed',
    "try { f(); } catch (e) { localStorage.setItem('k', '1'); }", true);
ecSgCase('an access in a function DEFINED beside a guarded one -- the try does not reach it',
    "function a() { try { localStorage.getItem('x'); } catch (e) {} }\n"
    . "function b() { localStorage.getItem('y'); }", true);
ecSgCase('one guarded and one not, in the same file',
    "try { localStorage.setItem('a', '1'); } catch (e) {}\nfunction f() { return localStorage.length; }", true);

// ---- what it must NOT report -------------------------------------------------------------------
ecSgCase('the idiom this suite writes 26 times, on one line',
    "try { localStorage.setItem(K, JSON.stringify(v)); } catch (e) {}", false);
ecSgCase('the same idiom over several lines',
    "try {\n\traw = localStorage.getItem(K);\n} catch (e) {\n\treturn;\n}", false);
ecSgCase('an access nested several blocks deep inside a try, which is still inside it',
    "try {\n if (a) {\n  for (i = 0; i < localStorage.length; i++) { k = localStorage.key(i); }\n }\n} catch (e) {}", false);
ecSgCase('A COMMENT saying what is NOT stored. 28 of these ship, and they are the reason the '
    . 'source is stripped before it is scanned',
    "// **NOTHING IS CACHED ON THE DEVICE.** No tile store, no localStorage, no IndexedDB.\nvar x = 1;", false);
ecSgCase('a block comment mentioning it, which is how the storage design is recorded',
    "/*\n * persisted to localStorage as a sibling key, deliberately NOT undo-snapshotted\n */\nvar x = 1;", false);
ecSgCase('the WORD inside a string literal, which stores nothing',
    "var msg = 'localStorage is full';", false);
ecSgCase('a two-branch try where the second branch is the guarded write',
    "function s(v) { try { if (v) { localStorage.setItem(K, v); } else { localStorage.removeItem(K); } } catch (e) {} }", false);
ecSgCase('a name that merely BEGINS with the word, which is a different identifier',
    "var localStorageIsBlocked = true; if (localStorageIsBlocked) { return; }", false);

// ---- the corpus, and the live mutation ------------------------------------------------------------
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/storage_guard_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/(\d+) localStorage\/sessionStorage access/', $line, $m)) {
    $fails[] = "corpus: could not read the access count out of:\n      $line";
} elseif ((int) $m[1] < 20) {
    $fails[] = sprintf('corpus: only %d access(es) found. 26 shipped on 2026-09-06, and a collapse '
        . 'this large means the scan went blind rather than that the storage was removed -- which '
        . 'would read as progress on a ratchet.', (int) $m[1]);
}

// The live mutation. `ec_selftest_storage.js` is not a shipped module and no page loads it; it
// exists for the length of one exec, and is removed inline AND on shutdown so a selftest cannot
// leave a stray file in js/.
$probe = dirname(__DIR__, 2) . '/js/ec_selftest_storage.js';
register_shutdown_function(function () use ($probe) { @unlink($probe); });
file_put_contents($probe, "// TEMPORARY: written by dev/scripts/storage_guard_selftest.php.\n"
    . "var v = localStorage.getItem('ec_selftest_key');\n");
$out2 = [];
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/storage_guard_check.php') . ' 2>&1', $out2, $code2);
@unlink($probe);
$probeLine = implode("\n", $out2);
$n++;
if (strpos($probeLine, 'ec_selftest_storage.js') === false || $code2 === 0) {
    $fails[] = "corpus mutation: a file with one unguarded localStorage read was written into js/ "
        . "and the check did not fail on it. The scan is not reaching the directory it claims to "
        . "guard. Its output was:\n      " . $probeLine;
}

if ($fails) {
    echo 'storage_guard selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Web storage guard selftest OK -- $n cases, both directions, plus a live mutation.\n";
exit(0);
