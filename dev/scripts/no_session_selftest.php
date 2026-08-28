<?php
/**
 * no_session_selftest.php — assert that no_session_check.php still sees a session being started,
 * and still ignores the two shapes that are not one. BLOCKING.
 *
 * WHY THIS EXISTS. The check finds nothing today and must keep finding nothing, which is the exact
 * condition under which a broken check is indistinguishable from a working one. It also has a
 * specific way to go blind that a fixture can pin: it reads TOKENS, so that the two places
 * `session_start()` appears in this repository -- both in comments, both explaining that it used to
 * be called and no longer is -- are invisible to it. A regex would report the history of the fix as
 * a violation of it, and whoever hit that would most likely delete the check.
 *
 *   php dev/scripts/no_session_selftest.php
 */

define('NO_SESSION_LIB_ONLY', true);
require __DIR__ . '/no_session_check.php';

$cases = [
    // ---- what it MUST find -------------------------------------------------------------------
    ['a bare session_start()',            "<?php\nsession_start();\n",                    1],
    ['one guarded by a condition -- a gate is not an exemption',
                                          "<?php\nif (\$ok) { session_start(); }\n",      1],
    ['session_id(), which reads the same identifier',
                                          "<?php\n\$x = session_id();\n",                 1],
    ['session_set_cookie_params(), which configures the cookie before it is written',
                                          "<?php\nsession_set_cookie_params(0);\n",       1],
    ['two calls in one file are two findings',
                                          "<?php\nsession_start();\nsession_regenerate_id();\n", 2],

    // ---- what it must NOT report --------------------------------------------------------------
    // **THE SHAPE THIS REPOSITORY ACTUALLY CONTAINS.** lib/base.inc.php explains in a comment that
    // it *used to* call session_start(). Reporting that would make the check fail on the very fix
    // it exists to protect.
    ['the words in a line comment, which is what this repo has',
                                          "<?php\n// called session_start() at the top of every load\n\$a = 1;\n", 0],
    ['the words in a block comment',      "<?php\n/* session_start() was removed in Task 288 */\n\$a = 1;\n", 0],
    ['the words in a string, e.g. a message or a docs link',
                                          "<?php\n\$msg = 'do not call session_start() here';\n", 0],
    ['a METHOD of somebody else\'s object, which is not PHP\'s session',
                                          "<?php\n\$driver->session_start();\n",          0],
    ['a static method on another class',  "<?php\nRemote::session_id();\n",               0],
    ['a mention with no call parentheses',
                                          "<?php\n\$fn = 'session_start';\n\$names[] = session_start;\n", 0],
];

$fails = 0;
foreach ($cases as [$name, $src, $want]) {
    $got = ecSessionCalls($src);
    if (count($got) !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo "        wanted $want finding(s), got " . count($got) . ': '
            . (count($got) ? implode(', ', array_map(fn($g) => $g[0] . '@' . $g[1], $got)) : '(none)')
            . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. no_session_check.php's reach has moved.\n";
    echo "A false positive here fails every commit; a false negative lets PHPSESSID back onto a\n";
    echo "visitor's device before anybody asked them. Neither is a thing to leave for later.\n";
    exit(1);
}
echo "\nNo-session selftest OK -- " . count($cases) . " fixtures, both directions.\n";
exit(0);
