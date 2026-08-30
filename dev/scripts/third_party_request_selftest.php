<?php
/**
 * third_party_request_selftest.php — assert third_party_request_check.php still sees a fifth
 * third-party request arriving, and still lets a help link alone. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The check finds nothing today and should find nothing for years, which is the
 * state in which a working check and a blind one print the same line. It has three specific ways to
 * go blind, and each has a fixture below:
 *
 *   1. **The comment blanker.** Everything rests on it, and it is a state machine over other
 *      people's punctuation. If it swallowed a file, every host in that file would vanish and the
 *      check would report a clean tree with more conviction than ever. The regex-literal fixtures
 *      are the ones that matter: `/[^/]*` opens a line comment to a naive scanner.
 *   2. **The call-shape window.** Its whole job is to separate an `<a href>` from a `fetch()`, and
 *      the two live one character apart in the source.
 *   3. **The declarations going stale**, in both directions: a host that stops appearing, and a
 *      host that starts.
 *
 * The load-bearing pair is the last two fixtures: the SAME host, once as a link and once as a
 * fetch. A check that reports both is useless and a check that reports neither is worse.
 *
 *   php dev/scripts/third_party_request_selftest.php
 */

define('THIRD_PARTY_LIB_ONLY', true);
require __DIR__ . '/third_party_request_check.php';

$purposes = EC_REQUEST_PURPOSES;
$allowed  = EC_NON_REQUEST_HOSTS;

/** Run one fixture end to end: blank it, scan it, judge it. */
function ecTpFixture(string $js, array $purposes, array $allowed): array
{
    $scan = ecThirdPartyScan(['js/fixture.js' => ecBlankJsComments($js)]);
    return ecThirdPartyFindings($scan, $purposes, $allowed);
}

// A declaration set matching the fixtures below, so a fixture's finding is about the fixture and
// not about the eight real hosts being absent from it.
$fixPurposes = ['tiles' => ['host' => 'tile.openstreetmap.org', 'owner' => 'js/fixture.js',
    'gate' => 'x', 'privacy' => 'x', 'why' => 'fixture']];
$fixAllowed = ['en.wikipedia.org' => 'a help link', 'www.w3.org' => 'the SVG namespace'];

$cases = [
    // ---- what it MUST find ---------------------------------------------------------------------
    ['a fifth service arriving as a plain fetch',
        "function load() {\n  return fetch('https://api.weather.example.com/v1/rain');\n}\n", true],
    ['a fifth service as an <img> beacon, which is a request wearing a picture',
        "var img = new Image();\nimg.src = 'https://pixel.analytics.example.net/p.gif';\n", true],
    ['a CDN font stylesheet, the shape Task 287 removed once already',
        "el.innerHTML = '<link rel=stylesheet href=\"https://fonts.googleapis.com/css?family=X\">';\n", true],
    ['A DECLARED NON-REQUEST HOST AT A REQUEST SHAPE. Wikipedia is a fine link and not a fine fetch',
        "fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Weir')\n  .then(r => r.json());\n", true],
    ['a declared host that no longer appears anywhere -- a decision recorded about something gone',
        "var NS = 'http://www.w3.org/2000/svg';\n", true],
    ['A HOST HIDDEN BEHIND A REGEX LITERAL CONTAINING A SLASH-SLASH. The blanker must not read /[^/]*/ as a comment',
        "var re = /[^/]*/;\nvar url = 'https://tracker.example.org/t';\nfetch(url);\n", true],
    ['a host inside a template literal, which is still code',
        "fetch(`https://tiles.example.com/\${z}/\${x}.png`);\n", true],
    ['sendBeacon, which is the request shape that survives the tab closing',
        "navigator.sendBeacon('https://collect.example.com/e', body);\n", true],

    // ---- what it must NOT report -----------------------------------------------------------------
    ['the real shape: a help link in a result string, two lines from nothing request-shaped',
        "this.var.f_method = '<a href=\"https://en.wikipedia.org/wiki/Darcy\">Swamee Jain</a>';\n"
        . "return this.var.f_method;\n", false],
    ['the SVG namespace handed to createElementNS -- a string, never fetched',
        "var NS = 'http://www.w3.org/2000/svg';\nvar t = document.createElementNS(NS, 'title');\n", false],
    ['a DECLARED request host at a request shape, which is the whole point of declaring it',
        "fetch('https://tile.openstreetmap.org/10/163/395.png');\n", false],
    ['A HOST NAMED ONLY IN A COMMENT. Eight of eleven hosts in this tree are prose, and this is why',
        "// The Nominatim policy lives at https://operations.osmfoundation.org/policies/nominatim/\n"
        . "/* and api.mapbox.com is named again here, in a block comment, https://cdn.example.com */\n"
        . "var x = 1;\n", false],
    ['a commented-out fetch, which is a record of what we decided not to do',
        "// fetch('https://analytics.example.com/collect');\nvar x = 1;\n", false],
    ['a protocol-relative-looking string that is a path, not a host',
        "var p = '/engcalcs/js/lpn-geom.js';\nfetch(p);\n", false],
    ['division that looks like a regex opener, so the blanker must not eat the rest of the file',
        "var a = w / h / 2;\nvar NS = 'http://www.w3.org/2000/svg';\nvar u = 'https://en.wikipedia.org/x';\n", false],
];

$fails = 0;
foreach ($cases as [$name, $js, $want]) {
    $got = ecTpFixture($js, $fixPurposes, $fixAllowed);
    // The "declared host no longer appears" finding fires on almost every fixture, because a
    // fixture is one file and the declaration names two hosts. Filter it out except where it IS
    // the case under test.
    if (strpos($name, 'no longer appears') === false) {
        $got = array_values(array_filter($got, static fn($f) => strpos($f, 'no longer appears') === false));
    }
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . ($want ? 'a finding' : 'no finding') . ', got '
            . ($hit ? count($got) . ': ' . $got[0] : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

// The blanker keeps length and line numbers. A check that reports "js/looped-network.js:5328"
// against a text whose lines have shifted sends the reader to the wrong place, and a shortened
// text is a check quietly reading less than it was given.
$sample = "var a = 1; // trailing\n/* two\n   lines */\nvar b = '// not a comment';\nvar re = /a\\/b/;\n";
$blank = ecBlankJsComments($sample);
if (strlen($blank) !== strlen($sample)) {
    $fails++;
    echo "  FAIL the blanker changed the LENGTH of its input (" . strlen($sample) . ' -> '
        . strlen($blank) . "); line numbers and offsets no longer point at the file\n";
} elseif (substr_count($blank, "\n") !== substr_count($sample, "\n")) {
    $fails++;
    echo "  FAIL the blanker changed the LINE COUNT of its input\n";
} elseif (strpos($blank, 'not a comment') === false) {
    $fails++;
    echo "  FAIL the blanker ate a string containing '//' -- string bodies are code, not comments\n";
} elseif (strpos($blank, 'trailing') !== false || strpos($blank, 'lines') !== false) {
    $fails++;
    echo "  FAIL the blanker left comment text behind\n";
} else {
    echo "  ok   the blanker preserves length, line count and string bodies\n";
}

if ($fails) {
    echo "\n$fails fixture(s) failed. third_party_request_check.php's reach has moved.\n";
    echo "A false negative here lets a fifth third-party request ship with no paragraph in\n";
    echo "privacy.php and no consent question -- visible only in a network panel, to a visitor.\n";
    exit(1);
}
echo "\nThird-party request selftest OK -- " . (count($cases) + 1) . " fixtures, both directions.\n";
exit(0);
