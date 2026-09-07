<?php
/**
 * web_manifest_selftest.php -- web_manifest_check.php still sees a manifest that has drifted from
 * the pages, and still lets a correct one through. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS IS CLEAN TODAY. Every one of that check's failures
 * is invisible from this side of the wire -- a blank home-screen icon, an install prompt that is
 * never offered, a manifest silently dropped for the document that linked it. If the check goes
 * blind, nothing else in the repository will ever notice, because before it was written nothing
 * read `manifest.json` at all.
 *
 * The MOUNT fixtures are the ones that matter. That leg is a ratchet, and a ratchet that has gone
 * blind and a ratchet that is holding print the same line.
 *
 *   php dev/scripts/web_manifest_selftest.php
 */

define('WEB_MANIFEST_LIB_ONLY', true);
require __DIR__ . '/web_manifest_check.php';

$fails = [];
$n = 0;

$good = json_encode([
    'name' => 'EngCalcs', 'short_name' => 'EngCalcs', 'start_url' => '/engcalcs/index.php',
    'scope' => '/engcalcs/', 'display' => 'standalone', 'theme_color' => '#1a6faf',
    'icons' => [['src' => 'icons/icon-192.png', 'sizes' => '192x192', 'type' => 'image/png']],
], JSON_UNESCAPED_SLASHES);
$goodFiles = ['icons/icon-192.png' => [192, 192], '@self:/engcalcs/manifest.json' => [], '@self:/engcalcs/icons/icon-192.png' => []];
$goodEmitted = [
    'manifest_href' => '/engcalcs/manifest.json',
    'theme_color' => '#1a6faf',
    'touch_icon' => '/engcalcs/icons/icon-192.png',
];
$oneMount = ['/engcalcs/' => 'the canonical mount'];
$twoMounts = ['/engcalcs/' => 'the canonical mount', '/app/' => 'the rewrite (Task 479)'];

/**
 * @param array<string,mixed>  $files
 * @param array<string,string> $emitted
 * @param array<string,string> $mounts
 */
function ecWmCase(string $name, string $json, array $files, array $emitted, array $mounts, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecWebManifestFindings($json, $files, $emitted, $mounts);
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

// ---- what it MUST find ---------------------------------------------------------------------------
ecWmCase('THE DEFECT SHAPE: a manifest that is not valid JSON, which a browser drops whole',
    '{ "name": "EngCalcs", }', $goodFiles, $goodEmitted, $oneMount, true);
ecWmCase('an icon src that is not a file -- a blank icon on a home screen nobody here sees',
    str_replace('icons/icon-192.png', 'icons/gone.png', $good), $goodFiles, $goodEmitted, $oneMount, true);
ecWmCase('an icon whose DECLARED size is not its real size, so the browser picks it and rescales',
    str_replace('192x192', '512x512', $good), $goodFiles, $goodEmitted, $oneMount, true);
ecWmCase('a start_url outside the scope, which invalidates the whole manifest and not just the URL',
    str_replace('/engcalcs/index.php', '/index.php', $good), $goodFiles, $goodEmitted, $oneMount, true);
ecWmCase('a theme_color that has drifted from the meta the pages emit',
    str_replace('#1a6faf', '#123456', $good), $goodFiles, $goodEmitted, $oneMount, true);
ecWmCase('a missing required member -- no install prompt is offered and nothing says why',
    str_replace('"display":"standalone",', '', str_replace(' ', '', $good)), $goodFiles, $goodEmitted, $oneMount, true);
ecWmCase('THE RATCHET: a THIRD mount, undeclared, which is the case this leg exists for',
    $good, $goodFiles, $goodEmitted,
    $twoMounts + ['/tools/' => 'a hypothetical third mount'], true);
ecWmCase('the pages linking a manifest that is not served',
    $good, $goodFiles, ['manifest_href' => '/engcalcs/nope.json'] + $goodEmitted, $oneMount, true);
ecWmCase('a touch icon the pages emit and nothing serves, where iOS screenshots the page instead',
    $good, $goodFiles, ['touch_icon' => '/engcalcs/icons/gone.png'] + $goodEmitted, $oneMount, true);

// ---- what it must NOT report -----------------------------------------------------------------------
ecWmCase('the manifest as it ships, against the single canonical mount',
    $good, $goodFiles, $goodEmitted, $oneMount, false);
ecWmCase('THE DECLARED MOUNT: /app/ is uncovered on purpose, with the reason written down, so it '
    . 'must pass -- a check that fails on the tree it guards is a check somebody mutes',
    $good, $goodFiles, $goodEmitted, $twoMounts, false);
ecWmCase('an SVG icon sized "any", which has no pixel size to compare and must not be measured',
    json_encode(['name' => 'E', 'short_name' => 'E', 'start_url' => '/engcalcs/index.php',
        'scope' => '/engcalcs/', 'display' => 'standalone', 'theme_color' => '#1a6faf',
        'icons' => [['src' => 'icons/icon.svg', 'sizes' => 'any', 'type' => 'image/svg+xml']]],
        JSON_UNESCAPED_SLASHES),
    ['icons/icon.svg' => []] + $goodFiles, $goodEmitted, $oneMount, false);
ecWmCase('a theme colour written in a different case, which is the same colour',
    str_replace('#1a6faf', '#1A6FAF', $good), $goodFiles, $goodEmitted, $oneMount, false);
ecWmCase('a manifest with no theme_color at all, which is legal and asserts nothing about the meta',
    str_replace('"theme_color":"#1a6faf",', '', str_replace(' ', '', $good)), $goodFiles, $goodEmitted, $oneMount, false);

// ---- the corpus ------------------------------------------------------------------------------------
// The fixtures above never touch the real manifest, so this is the only leg that proves the check
// reads the file it is named after and renders the pages it compares with.
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/web_manifest_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/(\d+) rendered page\(s\) agreeing/', $line, $m) || (int) $m[1] < 20) {
    $fails[] = "corpus: the check did not report reading at least 20 rendered pages. It compares "
        . "the manifest against what the pages EMIT, so a collapse here means it is comparing it "
        . "against nothing:\n      $line";
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
echo "Web app manifest selftest OK -- $n cases, both directions, plus the real file and pages.\n";
exit(0);
