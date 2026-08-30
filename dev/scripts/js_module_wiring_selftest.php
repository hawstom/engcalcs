<?php
/**
 * js_module_wiring_selftest.php — assert js_module_wiring_check.php still catches a module wired in
 * one place and not the others, and still lets the legitimate exceptions through. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. This check is a set of list comparisons, and every one of its inputs is scraped
 * out of somebody else's file with a regular expression. That is the failure mode worth pinning:
 * if `ecJsModuleLoads()` stops matching `require(path.join(ROOT, 'js', 'lpn-net.js'))`, the stub's
 * load list goes empty, and an empty list makes leg 6 silent and leg 4 catastrophic — or, if the
 * declarations happen to cover everything, silent in both directions. So the fixtures pin the
 * SCRAPERS as well as the judgements, in every spelling this repo actually uses.
 *
 * The load-bearing pair is the two ways a module can be half-wired: on the page and not in the
 * stub (the harnesses pass on a page that does not ship) and in the stub and on no page (the
 * harnesses exercise a page that does not ship). They are opposite defects with the same symptom,
 * which is nothing at all.
 *
 *   php dev/scripts/js_module_wiring_selftest.php
 */

define('JS_MODULE_WIRING_LIB_ONLY', true);
require __DIR__ . '/js_module_wiring_check.php';

// ---- the scrapers -----------------------------------------------------------------------------

$fails = 0;

$tagFixture = [
    'Looped-Network.php' => "<script src=\"/engcalcs/js/lpn-geom.js?v=<?=filemtime(__DIR__.'/js/lpn-geom.js')?>\"></script>\n"
        . "<script src=\"/engcalcs/js/looped-network.js?v=1\"></script>\n",
    'lib/HeadersFooters.lib.php' => "<script src=\"/engcalcs/js/Calculators.lib.js?v=1\"></script>\n",
    'Orifice.php' => "<!-- <script src=\"/engcalcs/js/orifice-old.js\"></script> -->\n"
        . "<script src=\"/engcalcs/js/orifice.js?v=1\"></script>\n",
];
$tagged = ecPageScriptTags($tagFixture);
if (!isset($tagged['lpn-geom.js'], $tagged['looped-network.js'], $tagged['Calculators.lib.js'],
        $tagged['orifice.js'])) {
    $fails++;
    echo "  FAIL the <script src> scraper missed a tag it must see: " . implode(', ', array_keys($tagged)) . "\n";
} else {
    echo "  ok   the <script src> scraper reads a filemtime-busted tag and finds every page\n";
}

$order = ecPageScriptOrder($tagFixture['Looped-Network.php']);
if ($order !== ['lpn-geom.js', 'looped-network.js']) {
    $fails++;
    echo "  FAIL the script ORDER scraper returned " . implode(', ', $order)
        . "; order is what decides which modules must precede the editor\n";
} else {
    echo "  ok   the script order scraper preserves order\n";
}

// Every spelling of a module load this repo really contains, plus the prose that must NOT count.
$loadFixture = <<<'JS'
// This comment names js/lpn-inp.js and js/Icons.lib.js at length and loads neither.
/* Nor does this block comment, which mentions js/lpn-time.js. */
require('./bootstrap.js');
var EngCalcs = Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-solver.js'));
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-geom.js'), require(ROOT + 'js/lpn-collide.js'));
require(path.join(ROOT, 'js', 'lpn-net.js'));
const Geom = require('../../js/lpn-profile.js').lpnGeom;
const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
JS;
$loads = ecJsModuleLoads(ecBlankJsComments($loadFixture));
$wantLoads = ['lpn-solver.js', 'lpn-geom.js', 'lpn-collide.js', 'lpn-net.js', 'lpn-profile.js',
    'looped-network.js'];
foreach ($wantLoads as $w) {
    if (!in_array($w, $loads, true)) {
        $fails++;
        echo "  FAIL the module-load scraper missed js/$w -- it reads " . implode(', ', $loads) . "\n";
    }
}
foreach (['lpn-inp.js', 'Icons.lib.js', 'lpn-time.js'] as $prose) {
    if (in_array($prose, $loads, true)) {
        $fails++;
        echo "  FAIL the module-load scraper counted js/$prose, which appears only in a COMMENT\n";
    }
}
if (!$fails) {
    echo "  ok   the module-load scraper reads every require spelling and no comment\n";
}

// ---- the judgements ---------------------------------------------------------------------------

$modules = ['looped-network.js', 'lpn-geom.js', 'lpn-collide.js', 'lpn-inp.js', 'orifice.js'];
$base = [
    'tagged'    => ['looped-network.js' => ['Looped-Network.php'], 'lpn-geom.js' => ['Looped-Network.php'],
                    'lpn-collide.js' => ['Looped-Network.php'], 'lpn-inp.js' => ['Looped-Network.php'],
                    'orifice.js' => ['Orifice.php']],
    'order'     => ['lpn-geom.js', 'lpn-collide.js', 'lpn-inp.js', 'looped-network.js'],
    'stub'      => ['lpn-geom.js', 'lpn-collide.js'],
    'harness'   => ['lpn-inp.js'],
    'unref'     => [],
    'lazy'      => ['lpn-inp.js' => 'loaded by the import harnesses'],
];

function ecJmwCase(array $modules, array $b, array $over = []): array
{
    $b = array_merge($b, $over);
    return ecJsWiringFindings($modules, $b['tagged'], $b['order'], $b['stub'], $b['harness'],
        $b['unref'], $b['lazy']);
}

$cases = [
    ['the wired tree: page tags, stub, and one declared per-harness module', [], false],

    // ---- what it MUST find -----------------------------------------------------------------------
    ['A NEW MODULE ON THE PAGE AND NOT IN THE STUB -- the harnesses pass on a page that does not ship',
        ['order' => ['lpn-geom.js', 'lpn-collide.js', 'lpn-inp.js', 'lpn-ramps.js', 'looped-network.js'],
         'tagged' => $base['tagged'] + ['lpn-ramps.js' => ['Looped-Network.php']]], true],
    ['A MODULE IN THE STUB AND ON NO PAGE -- the harnesses exercise a page that does not ship',
        ['stub' => ['lpn-geom.js', 'lpn-collide.js', 'lpn-ghost.js']], true],
    ['a module on disk that no page loads: shipped, precached, and running nowhere',
        ['tagged' => ['looped-network.js' => ['Looped-Network.php'], 'lpn-geom.js' => ['Looped-Network.php'],
                      'lpn-collide.js' => ['Looped-Network.php'], 'lpn-inp.js' => ['Looped-Network.php']]], true],
    ['a <script> tag naming a file that is not on disk -- half of a rename',
        ['tagged' => $base['tagged'] + ['lpn-gone.js' => ['Looped-Network.php']]], true],
    ['A PER-HARNESS DECLARATION NO HARNESS BACKS. The module is then loaded nowhere under test at all',
        ['harness' => []], true],
    ['a per-harness declaration for a module the page no longer loads before the editor',
        ['lazy' => ['lpn-inp.js' => 'x', 'lpn-vanished.js' => 'x']], true],
    ['a per-harness declaration for a module the stub loads anyway -- two decisions, one of them wrong',
        ['stub' => ['lpn-geom.js', 'lpn-collide.js', 'lpn-inp.js']], true],
    ['an unreferenced-module declaration that the page contradicts',
        ['unref' => ['orifice.js' => 'x']], true],
    ['an unreferenced-module declaration for a file that is gone',
        ['unref' => ['lpn-old.js' => 'x']], true],
    ['THE EDITOR ITSELF MISSING FROM THE PAGE. Everything downstream is unanswerable, and silence would be the wrong answer',
        ['order' => ['lpn-geom.js', 'lpn-collide.js']], true],

    // ---- what it must NOT report -------------------------------------------------------------------
    ['a module loaded by ONE page only, which is how a per-page feature is meant to look',
        [], false],
    ['a module loaded AFTER the editor, which the stub need not have in place first',
        ['order' => ['lpn-geom.js', 'lpn-collide.js', 'lpn-inp.js', 'looped-network.js', 'lpn-late.js'],
         'tagged' => $base['tagged'] + ['lpn-late.js' => ['Looped-Network.php']],
         'modules' => null], false],
];

foreach ($cases as [$name, $over, $want]) {
    $mods = $modules;
    if (isset($over['tagged'])) {
        // Keep the on-disk list in step with any page tag a fixture adds, except where the fixture
        // is specifically about a tag with no file.
        foreach (array_keys($over['tagged']) as $m) {
            if ($m !== 'lpn-gone.js' && !in_array($m, $mods, true)) { $mods[] = $m; }
        }
    }
    unset($over['modules']);
    $got = ecJmwCase($mods, $base, $over);
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

if ($fails) {
    echo "\n$fails fixture(s) failed. js_module_wiring_check.php's reach has moved.\n";
    echo "A false negative here is a module that ships and runs nowhere, or a harness suite that\n";
    echo "goes green against a page the browser never assembles.\n";
    exit(1);
}
echo "\nJS module wiring selftest OK -- " . (count($cases) + 3) . " fixtures, both directions.\n";
exit(0);
