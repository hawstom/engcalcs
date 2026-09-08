<?php
/**
 * web_manifest_selftest.php -- web_manifest_check.php still sees a manifest that has drifted from
 * the pages, or from the mount it is served at, and still lets a correct one through. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS IS CLEAN TODAY. Every one of that check's failures
 * is invisible from this side of the wire -- a blank home-screen icon, an install prompt that is
 * never offered, a manifest silently dropped for the document that linked it. If the check goes
 * blind, nothing else in the repository will ever notice, because before it was written nothing
 * read the manifest at all.
 *
 * The MOUNT fixtures are the ones that matter. The manifest is generated per mount (Task 609),
 * so the failure shapes are: a scope that is another mount's, a scope of '/', a scope missing its
 * trailing slash, and a selector that answers a mount nobody declared. A check that has gone
 * blind to any of those and a check that is holding print the same line.
 *
 *   php dev/scripts/web_manifest_selftest.php
 */

define('WEB_MANIFEST_LIB_ONLY', true);
require __DIR__ . '/web_manifest_check.php';

$fails = [];
$n = 0;

$manifestFor = function (string $scope, string $start) {
    return json_encode([
        'id' => $scope, 'name' => 'EngCalcs', 'short_name' => 'EngCalcs', 'start_url' => $start,
        'scope' => $scope, 'display' => 'standalone', 'theme_color' => '#1a6faf',
        'icons' => [['src' => 'icons/icon-192.png', 'sizes' => '192x192', 'type' => 'image/png']],
    ], JSON_UNESCAPED_SLASHES);
};
$good = $manifestFor('/engcalcs/', '/engcalcs/index.php');
$goodApp = $manifestFor('/app/', '/app/');
$hrefBase = '/engcalcs/manifest.php';
$hrefApp = '/engcalcs/manifest.php?mount=/app/';
$goodFiles = ['icons/icon-192.png' => [192, 192], '@self:' . $hrefBase => [], '@self:' . $hrefApp => [],
              '@self:/engcalcs/icons/icon-192.png' => []];
$goodEmitted = ['manifest_href' => $hrefBase, 'theme_color' => '#1a6faf', 'touch_icon' => '/engcalcs/icons/icon-192.png'];
$goodEmittedApp = ['manifest_href' => $hrefApp] + $goodEmitted;

/**
 * @param array<string,mixed>  $files
 * @param array<string,string> $emitted
 */
function ecWmCase(string $name, string $mount, string $json, array $files, array $emitted, string $wantHref, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecWebManifestFindings($mount, $json, $files, $emitted, $wantHref);
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

// ---- what it MUST find ---------------------------------------------------------------------------
ecWmCase('THE DEFECT SHAPE: a manifest that is not valid JSON, which a browser drops whole',
    '/engcalcs/', '{ "name": "EngCalcs", }', $goodFiles, $goodEmitted, $hrefBase, true);
ecWmCase('an icon src that is not a file -- a blank icon on a home screen nobody here sees',
    '/engcalcs/', str_replace('icons/icon-192.png', 'icons/gone.png', $good), $goodFiles, $goodEmitted, $hrefBase, true);
ecWmCase('an icon whose DECLARED size is not its real size, so the browser picks it and rescales',
    '/engcalcs/', str_replace('192x192', '512x512', $good), $goodFiles, $goodEmitted, $hrefBase, true);
ecWmCase('a start_url outside the scope, which invalidates the whole manifest and not just the URL',
    '/engcalcs/', $manifestFor('/engcalcs/', '/index.php'), $goodFiles, $goodEmitted, $hrefBase, true);
ecWmCase('a theme_color that has drifted from the meta the pages emit',
    '/engcalcs/', str_replace('#1a6faf', '#123456', $good), $goodFiles, $goodEmitted, $hrefBase, true);
ecWmCase('a missing required member -- no install prompt is offered and nothing says why',
    '/engcalcs/', str_replace('"display":"standalone",', '', $good), $goodFiles, $goodEmitted, $hrefBase, true);
ecWmCase('TASK 609 AS IT WAS: the pages at /app/ handed the base manifest, whose scope does not '
    . 'contain them, so the mount is not installable and nothing says so',
    '/app/', $good, $goodFiles, $goodEmittedApp, $hrefApp, true);
ecWmCase('THE TRAP: a scope of "/", which contains every mount and the parent site with it',
    '/app/', $manifestFor('/', '/app/'), $goodFiles, $goodEmittedApp, $hrefApp, true);
ecWmCase('a scope missing its trailing slash, which also claims /apple-anything',
    '/app/', $manifestFor('/app', '/app/'), $goodFiles, $goodEmittedApp, $hrefApp, true);
ecWmCase('the pages at /app/ linking the base manifest URL, so the right manifest exists and is not used',
    '/app/', $goodApp, $goodFiles, $goodEmitted, $hrefApp, true);
ecWmCase('the pages emitting no manifest link at all',
    '/engcalcs/', $good, $goodFiles, ['theme_color' => '#1a6faf'], $hrefBase, true);
ecWmCase('the pages linking a manifest that is not served',
    '/engcalcs/', $good, $goodFiles, ['manifest_href' => '/engcalcs/nope.json'] + $goodEmitted, '/engcalcs/nope.json', true);
ecWmCase('a touch icon the pages emit and nothing serves, where iOS screenshots the page instead',
    '/engcalcs/', $good, $goodFiles, ['touch_icon' => '/engcalcs/icons/gone.png'] + $goodEmitted, $hrefBase, true);

// ---- what it must NOT report -----------------------------------------------------------------------
ecWmCase('the base manifest as it ships, under the base mount',
    '/engcalcs/', $good, $goodFiles, $goodEmitted, $hrefBase, false);
ecWmCase('THE FIX: the /app/ manifest under the /app/ mount, linked by the pages served there',
    '/app/', $goodApp, $goodFiles, $goodEmittedApp, $hrefApp, false);
ecWmCase('an SVG icon sized "any", which has no pixel size to compare and must not be measured',
    '/engcalcs/',
    json_encode(['name' => 'E', 'short_name' => 'E', 'start_url' => '/engcalcs/index.php',
        'scope' => '/engcalcs/', 'display' => 'standalone', 'theme_color' => '#1a6faf',
        'icons' => [['src' => 'icons/icon.svg', 'sizes' => 'any', 'type' => 'image/svg+xml']]],
        JSON_UNESCAPED_SLASHES),
    ['icons/icon.svg' => []] + $goodFiles, $goodEmitted, $hrefBase, false);
ecWmCase('a theme colour written in a different case, which is the same colour',
    '/engcalcs/', str_replace('#1a6faf', '#1A6FAF', $good), $goodFiles, $goodEmitted, $hrefBase, false);
ecWmCase('a manifest with no theme_color at all, which is legal and asserts nothing about the meta',
    '/engcalcs/', str_replace('"theme_color":"#1a6faf",', '', $good), $goodFiles, $goodEmitted, $hrefBase, false);

// ---- the selector leg --------------------------------------------------------------------------------
$mounts = ['/engcalcs/' => 'base', '/app/' => 'rewrite'];
$sel = function (string $name, array $answers, bool $want) use (&$fails, &$n, $mounts): void {
    $n++;
    $got = ecWebManifestSelectorFindings($answers, $mounts, '/engcalcs/');
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
};
$sel('THE HOLE: a selector that echoes an undeclared request path back as the mount',
    ['/evil/' => '/evil/'], true);
$sel('a selector that hands an undeclared path some mount other than the base',
    ['/evil/' => '/app/'], true);
$sel('a selector that answers the wrong declared mount for a path under another',
    ['/app/?lang=fr' => '/engcalcs/'], true);
$sel('a selector that treats the bare "/app" as under "/app/" -- the string-prefix trap in reverse',
    ['/app' => '/app/'], true);
$sel('the selector as it should answer',
    ['/app/' => '/app/', '/app/?lang=fr' => '/app/', '/engcalcs/index.php' => '/engcalcs/',
     '/app' => '/engcalcs/', '/apple/' => '/engcalcs/', '/evil/' => '/engcalcs/', '' => '/engcalcs/'], false);

// ---- the corpus ------------------------------------------------------------------------------------
// The fixtures above never touch the real generator, so this is the only leg that proves the check
// reads the manifest the endpoint serves and renders the pages it compares with.
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/web_manifest_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/(\d+) rendered page\(s\) agreeing/', $line, $m) || (int) $m[1] < 40) {
    $fails[] = "corpus: the check did not report reading at least 40 rendered pages (every page "
        . "under every mount). It compares the manifest against what the pages EMIT, so a collapse "
        . "here means it is comparing it against nothing:\n      $line";
}
$n++;
if (!preg_match('/(\d+) mount\(s\)/', $line, $m) || (int) $m[1] < 2) {
    $fails[] = "corpus: the check did not report at least two mounts, so the per-mount leg is not "
        . "exercised by the real tree:\n      $line";
}
$n++;
if (!preg_match('/(\d+) icon\(s\) measured/', $line, $m) || (int) $m[1] < 1) {
    $fails[] = "corpus: no icon was measured. The declared sizes are then unchecked:\n      $line";
}

if ($fails) {
    echo 'web_manifest selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Web app manifest selftest OK -- $n cases, both directions, plus the real generator and pages.\n";
exit(0);
