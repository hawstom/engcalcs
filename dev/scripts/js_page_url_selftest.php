<?php
/**
 * js_page_url_selftest.php -- js_page_url_check.php still sees a relative page URL, and still
 * turns away the shapes that only look like one. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY IT IS BLOCKING THOUGH THE TREE IS CLEAN. The check passes by finding nothing, which is the
 * shape that has already died of success in this repository once (js_fallback_string_check.php's
 * corpus guard). Its blanker is the whole of its judgement -- comments out, strings in, regex
 * literals neither -- and a blanker that quietly starts swallowing code reports zero findings and
 * reads as progress.
 *
 * So the last section is a LIVE MUTATION: a temporary file carrying one relative page URL is
 * written into `js/`, the real check must name it, and it is removed whatever happens.
 *
 * Usage:
 *   php dev/scripts/js_page_url_selftest.php
 */

require_once(__DIR__ . '/js_page_url_check.php');

$fails = 0;
function ok(string $label, bool $cond, string $extra = ''): void
{
    global $fails;
    if (!$cond) { $fails++; }
    echo ($cond ? '  ok   ' : '  FAIL ') . $label . ($extra === '' ? '' : '   ' . $extra) . "\n";
}

// ================================================================================================
// 1. THE FINDING ITSELF
// ================================================================================================
echo "\n--- a relative page URL is a finding ---\n";
$r = ecJsPageUrlFindings(['js/f.js' => "window.open('privacy.php', '_blank');\n"]);
ok('a bare page name is named, with its line', count($r['findings']) === 1 &&
    strpos($r['findings'][0], 'js/f.js:1') === 0, implode(' | ', $r['findings']));
ok('...and the message says what to write instead',
    strpos($r['findings'][0], "suiteUrl('privacy.php')") !== false);

$r = ecJsPageUrlFindings(['js/f.js' => "ext('contact.php?from=Looped-Network');\n"]);
ok('a query string does not hide it', count($r['findings']) === 1, implode(' | ', $r['findings']));

// ================================================================================================
// 2. WHAT IS CORRECT, AND MUST NOT BE REPORTED
// ================================================================================================
echo "\n--- and the three correct shapes are silent ---\n";
foreach ([
    'root-anchored'        => "fetch('/engcalcs/log-calc-event.php');\n",
    'a full URL'           => "var A = 'https://hawsedc.com/engcalcs/Looped-Network.php';\n",
    'through the one door' => "ext(suiteUrl('terms.php'));\n",
] as $label => $src) {
    $r = ecJsPageUrlFindings(['js/f.js' => $src]);
    ok($label . ' is not a finding', count($r['findings']) === 0, implode(' | ', $r['findings']));
}
$r = ecJsPageUrlFindings(['js/f.js' => "ext(suiteUrl('terms.php'));\nfetch('/x/y.php');\n"]);
ok('the counts are reported rather than merely the findings',
    $r['viaDoor'] === 1 && $r['absolute'] === 1, $r['viaDoor'] . ' door, ' . $r['absolute'] . ' absolute');

// ================================================================================================
// 3. THE BLANKER, WHICH IS THE WHOLE OF THE JUDGEMENT
// ================================================================================================
echo "\n--- comments out, strings in, regex literals neither ---\n";
$r = ecJsPageUrlFindings(['js/f.js' => "// a row that stores 'privacy.php' and addresses it elsewhere\n"]);
ok('a page name QUOTED IN PROSE is not a finding -- the comment above the real fix does this',
    count($r['findings']) === 0, implode(' | ', $r['findings']));
$r = ecJsPageUrlFindings(['js/f.js' => "/*\n * opened 'privacy.php' and 'terms.php' relatively\n */\n"]);
ok('...in a block comment too', count($r['findings']) === 0, implode(' | ', $r['findings']));

// THE ONE THAT BIT. Without a regex state the quote in /['"]/ opens a string and everything after
// it -- comments included -- arrives as one literal; the first run of the check reported fifteen
// lines of prose about the definition of a foot.
$src = "var q = str.replace(/['\"]/g, '');\n// and then 'privacy.php' is mentioned in prose\n";
$r = ecJsPageUrlFindings(['js/f.js' => $src]);
ok('a regex literal containing a quote does not swallow the comments after it',
    count($r['findings']) === 0, implode(' | ', $r['findings']));
// ...and the blanker must not go the other way and blank real code either.
$r = ecJsPageUrlFindings(['js/f.js' => "var q = s.replace(/['\"]/g, '');\nwindow.open('terms.php');\n"]);
ok('...and code AFTER a regex literal is still read',
    count($r['findings']) === 1 && strpos($r['findings'][0], 'js/f.js:2') === 0,
    implode(' | ', $r['findings']));
$r = ecJsPageUrlFindings(['js/f.js' => "var half = total / 2;\nwindow.open('terms.php');\n"]);
ok('a division is not read as a regex', count($r['findings']) === 1, implode(' | ', $r['findings']));

// Shape: a sentence that reached the matcher anyway must be turned away and counted, never judged.
$r = ecJsPageUrlFindings(['js/f.js' => "var s = 'a link to About.php -- Tom said so';\n"]);
ok('a .php literal with spaces in it is turned away, not judged',
    count($r['findings']) === 0 && $r['turnedAway'] === 1, 'turnedAway=' . $r['turnedAway']);

// ================================================================================================
// 4. LIVE MUTATION -- the real check, the real tree, one wrong line
// ================================================================================================
echo "\n--- the real check against a real file carrying one wrong URL ---\n";
$root = dirname(__DIR__, 2);
$tmp = $root . '/js/zz-js-page-url-selftest-tmp.js';
$clean = null;
try {
    file_put_contents($tmp, "// temporary fixture written by js_page_url_selftest.php\n" .
        "window.open('privacy.php', '_blank', 'noopener');\n");
    $out = [];
    exec('php ' . escapeshellarg(__DIR__ . '/js_page_url_check.php') . ' 2>&1', $out, $code);
    $text = implode("\n", $out);
    ok('the real check FAILS on it', $code === 1, 'exit ' . $code);
    ok('...and names the file and the URL',
        strpos($text, 'zz-js-page-url-selftest-tmp.js') !== false &&
        strpos($text, 'privacy.php') !== false, $text);
} finally {
    if (file_exists($tmp)) { unlink($tmp); }
}
// The tree must be clean again, or the mutation leaked.
exec('php ' . escapeshellarg(__DIR__ . '/js_page_url_check.php') . ' 2>&1', $after, $afterCode);
ok('the fixture is gone and the real tree still passes', $afterCode === 0, implode("\n", $after));

echo $fails ? "\n$fails FAILURE(S)\n" : "\nall checks passed\n";
exit($fails ? 1 : 0);
