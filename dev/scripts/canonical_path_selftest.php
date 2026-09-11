<?php
/**
 * canonical_path_selftest.php -- assert canonical_path_check.php still sees each way a pretty URL
 * and the address it nominates can silently disagree. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The check passes by finding nothing, which is the shape that has already died
 * of success in this tree once. Two of its six legs read SOURCE TEXT -- ec_canonical_url()'s and
 * the sitemap generator's -- so a rename takes them blind with no failure anywhere, and the defect
 * underneath has no symptom on any page: it is visible only in a search index, months later.
 *
 * FIXTURE 1 IS THE DEFECT VERBATIM: the mount exists, the page is served there, and nothing
 * declares that the page's canonical address is that mount. That is precisely the state the suite
 * shipped in between the /app rewrite going live and Task 479.01.
 *
 *   php dev/scripts/canonical_path_selftest.php
 */

define('CANONICAL_PATH_LIB_ONLY', true);
require __DIR__ . '/canonical_path_check.php';

$mounts = ['/engcalcs/' => 'the canonical mount', '/app/' => 'librewaternet.org/app'];
$base   = '/engcalcs/';
$pages  = ['Looped-Network.php', 'Manning-Pipe-Flow.php', 'index.php'];
$langOK = "\$path = ecCanonicalPath(isset(\$_SERVER['SCRIPT_NAME']) ? \$_SERVER['SCRIPT_NAME'] : '/engcalcs/index.php');\n"
        . "return CANONICAL_ORIGIN . \$path . '?lang=' . \$lang;\n";
$langOld = "\$path = isset(\$_SERVER['SCRIPT_NAME']) ? \$_SERVER['SCRIPT_NAME'] : '/engcalcs/index.php';\n"
        . "if (substr(\$path, -10) === '/index.php') \$path = substr(\$path, 0, -9);\n";
$mapOK  = "\$path = ecCanonicalPath('/engcalcs/' . \$file);\n";
$mapOld = "\$path = (\$file === 'index.php') ? '/engcalcs/' : '/engcalcs/' . \$file;\n";
$good   = ['Looped-Network.php' => '/app/'];

$cases = [
    // ---- what it MUST find -----------------------------------------------------------------
    ['THE DEFECT ITSELF: a mount serves a page and nothing declares that page canonical there',
        [[], $mounts, $base, $pages, $langOK, $mapOK], true],
    ['ec_canonical_url() back on SCRIPT_NAME, so the declaration is decoration',
        [$good, $mounts, $base, $pages, $langOld, $mapOK], true],
    ['the sitemap building the path itself, advertising a URL the page disowns',
        [$good, $mounts, $base, $pages, $langOK, $mapOld], true],
    ['a canonical path under no declared mount -- indexed, and uncontrollable by the worker',
        [['Looped-Network.php' => '/editor'], $mounts, $base, $pages, $langOK, $mapOK], true],
    ['TWO PAGES CLAIMING ONE URL, which is the split wearing a different hat',
        [['Looped-Network.php' => '/app/', 'Manning-Pipe-Flow.php' => '/app/'], $mounts, $base, $pages, $langOK, $mapOK], true],
    ['a "pretty" URL inside EC_SW_BASE, where the script already answers at its own address',
        [['Looped-Network.php' => '/engcalcs/app'], $mounts, $base, $pages, $langOK, $mapOK], true],
    // **THE SHIPPED DEFECT, VERBATIM, AND IT INVERTED THIS FIXTURE.** It read the other way round
    // until 2026-09-06 -- a trailing slash was the defect and '/app' was correct -- which is what
    // let the declaration disagree with ecSwMounts()'s own '/app/' from the first day. Once '/app'
    // was made to 301 to '/app/' for the manifest's scope, every page and all 545 sitemap URLs
    // nominated an address that redirects. Found by curling the live site; no check saw it.
    ['the slashless form of a declared mount, which is the address that redirects',
        [['Looped-Network.php' => '/app'], $mounts, $base, $pages, $langOK, $mapOK], true],
    // A slash that is NOT a mount is still an invented second address, so that half survives.
    ['a trailing slash on a path no mount declares',
        [['Looped-Network.php' => '/pipe/'], $mounts, $base, $pages, $langOK, $mapOK], true],
    ['a query string in the declaration, which would double the ?lang= the caller appends',
        [['Looped-Network.php' => '/app/?v=2'], $mounts, $base, $pages, $langOK, $mapOK], true],
    ['a path that is not root-anchored, so it would fuse onto the origin',
        [['Looped-Network.php' => 'app'], $mounts, $base, $pages, $langOK, $mapOK], true],
    ['a declared page that does not exist -- a rename of the script, silent on every screen',
        [['Looped-Net.php' => '/app/'], $mounts, $base, $pages, $langOK, $mapOK], true],

    // ---- what it must NOT find -------------------------------------------------------------
    ['the tree as it stands: one pretty URL, declared, mounted and read by both callers',
        [$good, $mounts, $base, $pages, $langOK, $mapOK], false],
    ['NO pretty URL and no mount but EC_SW_BASE -- the suite before /app, which was correct',
        [[], ['/engcalcs/' => 'the only mount'], $base, $pages, $langOK, $mapOK], false],
    ['a second pretty URL, properly declared and mounted alongside the first',
        [['Looped-Network.php' => '/app/', 'Manning-Pipe-Flow.php' => '/pipe/'],
         $mounts + ['/pipe/' => 'a second pretty URL'], $base, $pages, $langOK, $mapOK], false],
    // **A DEEPER PRETTY URL IS STILL LEGAL**, and this fixture is why the slash rule is written
    // as agreement-with-a-mount rather than as "must end in a slash": '/app/reports' is under the
    // '/app/' mount, is not a mount itself, and invents no second address.
    ['a deeper pretty URL under an existing mount, which is not a mount of its own',
        [['Looped-Network.php' => '/app/', 'Manning-Pipe-Flow.php' => '/app/reports'],
         $mounts, $base, $pages, $langOK, $mapOK], false],
];

$fails = 0;
foreach ($cases as [$name, $args, $want]) {
    $got = ecCanonicalPathFindings(...$args);
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

// ---- ecLanguageSwitchPath(): where a language link may actually GO -------------------------
//
// **THIS HAS NOW BEEN WRONG IN BOTH DIRECTIONS INSIDE ONE DAY, 2026-09-10.** It used PHP_SELF,
// which moved a reader off `librewaternet.org/app/` onto the other host's script path; the repair
// pointed it at ecCanonicalPath(), which is `/app/` on EVERY host and therefore a 404 on
// hawsedc.com, on dev.hawsedc.com and on a local checkout -- Tom hit that within the hour.
//
// A canonical address is what a page CLAIMS; a link is where a reader can GO. The behaviour below
// is the whole of that distinction, and the forged-path case is the reason the test may read
// REQUEST_URI while the output never does.
require_once __DIR__ . '/../../lib/Canonical.lib.php';
$switchCases = [
    ['the app page served at its script path keeps the script path',
        '/engcalcs/Looped-Network.php', '/engcalcs/Looped-Network.php?lang=es', '/engcalcs/Looped-Network.php'],
    ['the app page served at its pretty address keeps the pretty address',
        '/engcalcs/Looped-Network.php', '/app/', '/app/'],
    ['...including the bare form a visitor is handed, before the 301',
        '/engcalcs/Looped-Network.php', '/app', '/app/'],
    ['...and a query string on the request does not confuse it',
        '/engcalcs/Looped-Network.php', '/app/?lang=fr', '/app/'],
    ['a page with no pretty URL always gets its own script path',
        '/engcalcs/Manning-Pipe-Flow.php', '/engcalcs/Manning-Pipe-Flow.php', '/engcalcs/Manning-Pipe-Flow.php'],
    ['A FORGED REQUEST PATH CANNOT CHOOSE A THIRD ANSWER',
        '/engcalcs/Looped-Network.php', '/evil/../app/', '/engcalcs/Looped-Network.php'],
    ['...nor can an absolute URL in the request line',
        '/engcalcs/Looped-Network.php', 'https://elsewhere.example/app/', '/engcalcs/Looped-Network.php'],
];
foreach ($switchCases as [$name, $script, $req, $want]) {
    $got = ecLanguageSwitchPath($script, $req);
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n        wanted '$want', got '$got'\n";
    } else {
        echo "  ok   $name\n";
    }
}

// ---- ecCanonicalRedirectTarget(): one address for the app, and NO LOOP ---------------------
//
// **THE LOOP IS THE WHOLE REASON THIS IS IN PHP** (Tom, 2026-09-10: *"do we safely put a redirect
// on the page, or is that circular?"*). librewaternet.org carries
// `RewriteRule ^app/?$ /engcalcs/Looped-Network.php [L]`, an INTERNAL rewrite, so an .htaccess
// redirect on that script path fires on the rewritten request too and bounces `/app/` back to
// itself for ever. Fixture 3 below is that exact request and must always answer "serve the page".
//
// Fixture 5 is the other one that matters: an UNDECLARED host is dev.hawsedc.com or a local
// checkout, and moving a developer to production would be the worst kind of helpful.
$O = 'https://librewaternet.org';
$redirectCases = [
    ['the script path on a declared host moves to the pretty address',
        '/engcalcs/Looped-Network.php', '/engcalcs/Looped-Network.php', true, $O . '/app/'],
    ['...carrying its query string, because ?lang= is how this URL is held',
        '/engcalcs/Looped-Network.php', '/engcalcs/Looped-Network.php?lang=es', true, $O . '/app/?lang=es'],
    ['THE REWRITTEN REQUEST IS SERVED, NEVER REDIRECTED -- this is the loop guard',
        '/engcalcs/Looped-Network.php', '/app/', true, null],
    ['...and so is the bare form that 301s to it at the web server',
        '/engcalcs/Looped-Network.php', '/app', true, null],
    ['AN UNDECLARED HOST NEVER MOVES ANYBODY -- dev and localhost',
        '/engcalcs/Looped-Network.php', '/engcalcs/Looped-Network.php', false, null],
    ['a page with no pretty URL is never redirected',
        '/engcalcs/Manning-Pipe-Flow.php', '/engcalcs/Manning-Pipe-Flow.php', true, null],
];
foreach ($redirectCases as [$name, $script, $req, $declared, $want]) {
    $got = ecCanonicalRedirectTarget($script, $req, $declared, $O);
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n        wanted " . var_export($want, true)
            . ', got ' . var_export($got, true) . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. canonical_path_check.php's reach has moved.\n";
    echo "The defect it guards is invisible on every page and shows up only in a search index.\n";
    exit(1);
}
echo "\nCanonical-path selftest OK -- " . (count($cases) + count($switchCases) + count($redirectCases)) . " fixtures, both directions.\n";
