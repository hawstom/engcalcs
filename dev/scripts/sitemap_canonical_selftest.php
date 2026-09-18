<?php
/**
 * Selftest for sitemap_canonical_check.php.
 *
 * Usage:  php dev/scripts/sitemap_canonical_selftest.php
 *
 * **A CHECK THAT PASSES BY FINDING NOTHING IS INDISTINGUISHABLE FROM ONE THAT HAS GONE BLIND**,
 * and the real sitemap is clean as of 2026-09-17, so the check speaks only when it refuses. This
 * repository has already lost a guard to exactly that shape (dev/hooks, 2026-09-12: it failed OPEN
 * and SILENTLY), and a selftest built on a static corpus died of success here once before.
 *
 * So this is a LIVE MUTATION. It builds a throwaway root holding a stub generate_sitemap.php whose
 * output is chosen per case, runs the REAL check against it, and asserts what the check says. Every
 * defect fixture is one the tree actually produced or could produce; the healthy fixture is there
 * because a check that fails everything is as useless as one that passes everything.
 *
 * Copyright 2009 Thomas Gail Haws. LICENSE: GNU GPL v3 or later.
 */

$repoRoot = dirname(__DIR__, 2);
$check    = $repoRoot . '/dev/scripts/sitemap_canonical_check.php';
$fails    = 0;
$ran      = 0;

/** Build a disposable root the check can run against: the two libs it requires, plus a stub generator. */
function makeRoot($repoRoot, $sitemapXml) {
    $dir = sys_get_temp_dir() . '/sitemap_selftest_' . bin2hex(random_bytes(6));
    mkdir($dir . '/lib', 0777, true);
    mkdir($dir . '/dev/scripts', 0777, true);
    copy($repoRoot . '/lib/Language.Settings.php', $dir . '/lib/Language.Settings.php');
    copy($repoRoot . '/lib/Canonical.lib.php',     $dir . '/lib/Canonical.lib.php');
    // The check lifts the FALLBACK origin out of config.inc.php rather than retyping it, so the
    // throwaway root needs one. A stub, not a copy: config.inc.php is the real bootstrap and
    // requiring it here would drag in the whole suite, while the only line that matters is this.
    file_put_contents($dir . '/lib/config.inc.php',
        "<?php\ndefine('CANONICAL_ORIGIN_DEFAULT', 'https://hawsedc.com');\n");
    file_put_contents(
        $dir . '/dev/scripts/generate_sitemap.php',
        "<?php\necho " . var_export($sitemapXml, true) . ";\n"
    );
    return $dir;
}

function rmTree($dir) {
    if (!is_dir($dir)) { return; }
    foreach (scandir($dir) as $f) {
        if ($f === '.' || $f === '..') { continue; }
        $p = "$dir/$f";
        is_dir($p) ? rmTree($p) : unlink($p);
    }
    rmdir($dir);
}

function wrap($locs) {
    $x = '<?xml version="1.0" encoding="UTF-8"?>' . "\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    foreach ($locs as $l) { $x .= "  <url>\n    <loc>" . htmlspecialchars($l, ENT_XML1) . "</loc>\n  </url>\n"; }
    return $x . "</urlset>\n";
}

function assertCase($repoRoot, $check, $label, $xml, $wantExit, $wantText) {
    global $fails, $ran;
    $ran++;
    $root = makeRoot($repoRoot, $xml);
    $out = [];
    $rc  = 0;
    exec('php ' . escapeshellarg($check) . ' ' . escapeshellarg($root) . ' 2>&1', $out, $rc);
    rmTree($root);
    $text = implode("\n", $out);
    $ok = ($rc === $wantExit) && ($wantText === null || strpos($text, $wantText) !== false);
    if ($ok) {
        echo "  ok    $label\n";
    } else {
        $fails++;
        echo "  FAIL  $label (exit $rc, wanted $wantExit)\n";
        foreach (explode("\n", $text) as $l) { echo "          $l\n"; }
    }
}

echo "sitemap canonical selftest\n";

$LWN = 'https://librewaternet.org';
$HEC = 'https://hawsedc.com';

// 1. HEALTHY. Every URL self-canonical, on both origins: the calculators on hawsedc.com and the map
//    application at its declared librewaternet.org address. The check must pass, or it fails
//    everything and proves nothing.
assertCase($repoRoot, $check, 'a clean sitemap passes',
    wrap(["$HEC/engcalcs/About.php?lang=en", "$HEC/engcalcs/About.php?lang=es", "$LWN/app/?lang=en"]),
    0, 'PASS');

// 2. THE REAL DEFECT OF 2026-09-17, verbatim: an English-only page advertised at its bare path
//    while echoHTMLHead() canonicalises it to ?lang=en. This is the case the check exists for.
assertCase($repoRoot, $check, 'a bare path with no ?lang= is refused',
    wrap(["$HEC/engcalcs/About.php?lang=en", "$HEC/engcalcs/privacy.php"]),
    1, 'disowned');

// 3. A ?lang= naming no language file. The page renders in English and canonicalises to ?lang=en,
//    so it is the same exclusion by another door -- and a typo here is silent everywhere else.
assertCase($repoRoot, $check, 'a ?lang= naming no language file is refused',
    wrap(["$HEC/engcalcs/About.php?lang=zz"]),
    1, 'names no lib/lang.ec.zz.php');

// 4. A page served at a PRETTY URL advertised at its script address instead. This is Task 479.01's
//    defect -- the suite's own front door was the one URL that could not be indexed -- and the
//    check must catch it from the sitemap side too, not only from the page side.
assertCase($repoRoot, $check, 'a pretty-URL page advertised at its script path is refused',
    wrap(["$LWN/engcalcs/Looped-Network.php?lang=en"]),
    1, 'the page nominates the path');

// 5. PARENT-SITE URLs are DECLARED out of scope and must not fail. They emit no canonical tag at
//    all, so there is nothing to compare; counting them and saying so is the honest treatment.
assertCase($repoRoot, $check, 'parent-site URLs are out of scope, not findings',
    wrap(["$HEC/sewslope.php", "$HEC/engcalcs/About.php?lang=en"]),
    0, '1 parent-site URLs out of scope');

// 6. A SITEMAP WITH NO SUITE URLS AT ALL MUST FAIL. A scan that has gone blind reports zero
//    findings and reads as progress; this is the leg that stops that.
assertCase($repoRoot, $check, 'a sitemap with no suite URLs fails rather than passing',
    wrap(["$HEC/sewslope.php"]),
    1, 'gone blind');

// 7. MALFORMED XML must fail loudly. The generator writing nothing at all is a real outcome -- a
//    require that dies prints to stderr and leaves stdout empty -- and it must not read as clean.
assertCase($repoRoot, $check, 'malformed output fails rather than passing',
    'not xml at all',
    1, null);

// 8. **THE DEFECT OF 2026-09-06 TO 2026-09-17, verbatim: a calculator advertised on the OTHER
//    origin.** Both hosts serve this checkout, so the URL answers 200 and the XML is perfect; the
//    only symptom was hawsedc.com's 7,575 clicks a quarter being handed to a domain at position 34.
//    The path leg cannot see it -- the path is right -- so this is the leg that had to be added.
assertCase($repoRoot, $check, 'a calculator advertised on the other origin is refused',
    wrap(["$LWN/engcalcs/Manning-Pipe-Flow.php?lang=en"]),
    1, 'the page nominates the origin https://hawsedc.com');

// 9. AND THE OTHER DIRECTION: the map application advertised on hawsedc.com at its own pretty path.
//    /app/ is a rewrite librewaternet.org alone carries, so this URL does not even answer -- and
//    without this leg the check would be a one-way ratchet that only ever defends hawsedc.com.
assertCase($repoRoot, $check, 'the app advertised on the calculators\' origin is refused',
    wrap(["$HEC/app/?lang=en"]),
    1, 'the page nominates the origin https://librewaternet.org');

echo ($fails ? "\nFAIL: $fails of $ran selftest cases failed.\n" : "\nPASS: all $ran selftest cases.\n");
exit($fails ? 1 : 0);
