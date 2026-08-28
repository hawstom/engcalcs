<?php
/**
 * page_meta_selftest.php — assert that page_meta_check.php still sees each of its three defects,
 * and still ignores the shapes that are not one. BLOCKING.
 *
 * WHY THIS EXISTS. The check finds nothing today, and a check that finds nothing looks identical
 * whether it is working or has gone blind. This one has a specific way to go blind that is worth
 * naming: **its whole reach depends on one string, `echoHeader(`.** Rename that helper, or add a
 * page that reaches the head some other way, and the check quietly stops applying to it while still
 * printing OK with a smaller page count nobody reads.
 *
 * The MISSED shapes matter as much as the found ones, because this check BLOCKS: `?v=<?php ... ?>`
 * is the CORRECT cache buster and reporting it would stop every commit until somebody deleted the
 * check.
 *
 *   php dev/scripts/page_meta_selftest.php
 */

define('PAGE_META_LIB_ONLY', true);
require __DIR__ . '/page_meta_check.php';

// A page, minus the thing under test. `Nope.php` is not in EC_NO_DESC_PAGES.
$page = "<?php require_once('lib/base.inc.php');\n";
$foot = "echoHeader();\necho 'hi';\n";

$cases = [
    // ---- what it MUST find -------------------------------------------------------------------
    [
        'a page with no description at all',
        'Nope.php', $page . $foot,
        ['no-desc'], [],
    ],
    [
        'a description pointing at $html_title',
        'Nope.php', $page . "\$html_desc = \$html_title;\n" . $foot,
        ['desc-is-title'], ['no-desc'],
    ],
    [
        'a description pointing at a *_main_title key',
        'Nope.php', $page . "\$html_desc = \$ec_lang['mpf_main_title'];\n" . $foot,
        ['desc-is-title'], ['no-desc'],
    ],
    [
        'a hardcoded cache buster',
        'Nope.php', $page . "\$html_desc = \$ec_lang['x_main_desc'];\n"
            . "echo '<script src=\"/engcalcs/js/x.js?v=7\"></script>';\n" . $foot,
        ['hardcoded-v'], ['no-desc'],
    ],
    [
        'an exempt page that has GAINED a description -- the list and the code disagreeing',
        'privacy.php', $page . "\$html_desc = \$ec_lang['x_main_desc'];\n" . $foot,
        ['exempt-but-sets'], [],
    ],

    // ---- what it must NOT report --------------------------------------------------------------
    [
        'the CORRECT cache buster, whose next character is a `<`',
        'Nope.php', $page . "\$html_desc = \$ec_lang['x_main_desc'];\n"
            . "echo '<script src=\"/engcalcs/js/x.js?v=' . filemtime('x') . '\"></script>';\n" . $foot,
        [], ['hardcoded-v'],
    ],
    [
        'an ENDPOINT: no echoHeader(), so none of the three rules apply to it',
        'sw.php', "<?php header('Content-Type: text/javascript');\necho 'x?v=3';\n",
        [], ['no-desc', 'hardcoded-v'],
    ],
    [
        'an exempt page with no description, which is the state the list exists to allow',
        'privacy.php', $page . $foot,
        [], ['no-desc', 'exempt-but-sets'],
    ],
    [
        'an ordinary page doing everything right',
        'Nope.php', $page . "\$html_desc = \$ec_lang['mpf_main_desc'];\n" . $foot,
        [], ['no-desc', 'desc-is-title', 'hardcoded-v', 'exempt-but-sets'],
    ],
    [
        'a *_main_desc key whose name merely CONTAINS the word title is not a title',
        'Nope.php', $page . "\$html_desc = \$ec_lang['lpn_titlebar_main_desc'];\n" . $foot,
        [], ['desc-is-title'],
    ],
];

$fails = 0;
foreach ($cases as [$name, $file, $src, $must, $mustNot]) {
    $codes = array_column(ecPageMetaFindings($file, $src), 0);
    $missing = array_diff($must, $codes);
    $extra   = array_intersect($mustNot, $codes);
    if ($missing || $extra) {
        $fails++;
        echo "  FAIL $name\n";
        if ($missing) { echo "        did not report: " . implode(', ', $missing) . "\n"; }
        if ($extra)   { echo "        wrongly reported: " . implode(', ', $extra) . "\n"; }
        echo "        got: " . (count($codes) ? implode(', ', $codes) : '(nothing)') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. page_meta_check.php's reach has moved.\n";
    echo "If that was deliberate, change the fixture and say in its label what the check now does.\n";
    exit(1);
}
echo "\nPage meta selftest OK -- " . count($cases) . " fixtures, both directions.\n";
exit(0);
