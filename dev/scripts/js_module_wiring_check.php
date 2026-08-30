<?php
/**
 * js_module_wiring_check.php — a new JavaScript module is wired everywhere it has to be, or
 * declared as an exception with a reason. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. `dev/testing-notes.md` §"Making an untestable file testable": *"A new module must
 * be added in THREE places or the harnesses break confusingly."* Splitting `js/looped-network.js`
 * (ROADMAP Task 293) is a live and continuing piece of work — `lpn-geom`, `lpn-collide`,
 * `lpn-profile`, `lpn-ramps` and more have come out of it — and every split adds a file that four
 * different mechanisms have to learn about. Three of the failures are quiet in different ways:
 *
 *   - **Not in any page's `<script>` tags.** The module ships, is precached, is syntax-checked, and
 *     runs nowhere. Nothing errors, because nothing calls it.
 *   - **Not in the harness stub.** `js/looped-network.js` reads `EngCalcs.lpnGeom` the moment its
 *     IIFE runs, so a module missing from `dev/lpn-spike/lpn-dom-stub.js` leaves an undefined
 *     behind — and dev/testing-notes.md's other standing rule is that a stub which removes the
 *     coupling makes a harness pass for the WRONG REASON. The harnesses go green on a page the
 *     browser never has.
 *   - **A `<script>` tag naming a file that is not there.** A 404, once, on a real visitor's first
 *     load. `filemtime()` in the same tag turns it into a PHP warning instead, which is louder, but
 *     only where somebody looks.
 *
 * THE FOURTH PLACE IS ALREADY HELD, and this check deliberately does not duplicate it: the service
 * worker's precache manifest globs `js/*.js` and `sw_manifest_check.php` fails the build on any
 * shipped asset that is neither in the manifest nor in `ecSwAssetExclusions()`. That was the
 * undocumented registration point Task 293's split forgot; it is now the one leg of this rule
 * nobody has to remember, and re-reading it here would mean two checks arguing about one list.
 *
 * TWO DECLARED LISTS, BECAUSE BOTH EXCEPTIONS ARE REAL. A module loaded by one page only is normal
 * (`js/lpn-terrain.js` is a Looped-Network feature and nothing else). A module the SHARED harness
 * stub does not boot is also normal: seven of the fourteen the page loads are pulled in per-harness
 * instead, by the harnesses that need them, which keeps the shared stub from importing the whole
 * suite for every geometry assertion. Both are declared below WITH THE REASON, and a per-harness
 * declaration is not taken on trust — the check requires at least one harness in `dev/lpn-spike/`
 * to really load it, so a declaration cannot outlive the harnesses that justified it. A new module
 * fails until somebody writes down which case it is; that declaration is the deliverable.
 *
 * COMMENTS ARE BLANKED before anything is read (`js_scan.inc.php`). `dev/lpn-spike/lpn-dom-stub.js`
 * discusses `js/Icons.lib.js`, `js/lpn-inp.js` and `js/Calculators.lib.js` at length in prose while
 * loading none of them, and a grep cannot tell a paragraph about a module from a `require` of it.
 *
 * Usage:
 *   php dev/scripts/js_module_wiring_check.php
 *
 * Exit 0 = every module is wired or declared. Exit 1 = one is neither.
 */

require_once __DIR__ . '/js_scan.inc.php';

/** The page whose script order the harness stub reproduces. */
const EC_LPN_PAGE = 'Looped-Network.php';

/** The map editor, which every module before it in that page's tags must be in place for. */
const EC_LPN_EDITOR = 'looped-network.js';

/** The shared Node scaffolding that stands in for the browser. */
const EC_HARNESS_STUBS = ['dev/lpn-spike/lpn-dom-stub.js', 'dev/lpn-spike/bootstrap.js'];

/**
 * Modules no page loads with a `<script>` tag, and why that is right. Empty today: every
 * `js/*.js` in this repo is on at least one page.
 */
const EC_UNREFERENCED_MODULES = [];

/**
 * Modules `Looped-Network.php` loads before the editor that the SHARED stub deliberately does not
 * boot, with the reason. Each must still be loaded by at least one harness in `dev/lpn-spike/`;
 * the check proves that rather than believing it.
 */
const EC_HARNESS_LAZY_MODULES = [
    'lpn-inp.js' => 'the .inp reader and writer. Loaded by the import, export, round-trip, token '
                  . 'and pass-through harnesses that are about it; the editor reads it only when a '
                  . 'file is opened or saved, never at boot.',
    'lpn-net.js' => 'the network model helpers. Loaded by the harnesses that build a document '
                  . 'directly; the editor reaches them through its own document, not at IIFE time.',
    'lpn-time.js' => 'extended-period simulation. A whole engine dimension, and booting it for a '
                   . 'label-placement assertion would be the stub importing the suite.',
    'lpn-patterns.js' => 'demand and speed patterns, in the same position as lpn-time.js and '
                       . 'loaded by the pattern harnesses.',
    'lpn-georef.js' => 'the georeferencing transforms. Loaded by the georef harnesses; the editor '
                     . 'calls into it on a user action, not during boot.',
    'lpn-search.js' => 'place-name search. It reaches a third-party host behind its own consent '
                     . 'gate, so the shared stub is the last place it should be started; the '
                     . 'harnesses about it load it themselves.',
    'lpn-terrain.js' => 'the Mapbox elevation lookup, for exactly the same reason as lpn-search.js.',
];

/**
 * `js/<name>.js` referenced from a `<script src>` tag, per file.
 *
 * @param array<string,string> $php file => PHP source.
 * @return array<string,array<int,string>> module basename => files referencing it.
 */
function ecPageScriptTags(array $php): array
{
    $out = [];
    foreach ($php as $file => $src) {
        if (preg_match_all('#<script[^>]*\ssrc="[^"]*?/js/([A-Za-z0-9._-]+\.js)#', $src, $m)) {
            foreach ($m[1] as $mod) {
                $out[$mod][] = $file;
            }
        }
    }
    ksort($out);
    return $out;
}

/**
 * The modules one page's `<script>` tags load, in order.
 *
 * @return array<int,string> basenames.
 */
function ecPageScriptOrder(string $src): array
{
    preg_match_all('#<script[^>]*\ssrc="[^"]*?/js/([A-Za-z0-9._-]+\.js)#', $src, $m);
    return $m[1];
}

/**
 * `js/<name>.js` named in comment-blanked JavaScript — a require(), an fs.readFileSync(), any load.
 *
 * @return array<int,string> basenames, unique.
 */
function ecJsModuleLoads(string $code): array
{
    preg_match_all("#['\"/\\s,]js['\"/\\s,+.]{1,6}([A-Za-z0-9._-]+\\.js)#", $code, $m);
    return array_values(array_unique($m[1]));
}

/**
 * Every finding. Pure, for the selftest.
 *
 * @param array<int,string>    $modules     basenames of js/*.js on disk.
 * @param array<string,array>  $tagged      module => pages referencing it.
 * @param array<int,string>    $pageOrder   the lpn page's script order.
 * @param array<int,string>    $stubLoads   modules the shared stub loads.
 * @param array<int,string>    $harnessLoads modules some harness loads.
 * @param array<string,string> $unreferenced EC_UNREFERENCED_MODULES.
 * @param array<string,string> $lazy         EC_HARNESS_LAZY_MODULES.
 * @return array<int,string>
 */
function ecJsWiringFindings(array $modules, array $tagged, array $pageOrder, array $stubLoads,
        array $harnessLoads, array $unreferenced, array $lazy): array
{
    $out = [];

    // 1. Every module on disk reaches a page, or is declared not to.
    foreach ($modules as $mod) {
        if (isset($tagged[$mod]) || isset($unreferenced[$mod])) { continue; }
        $out[] = "js/$mod ships and is precached, and NO page loads it with a <script> tag. It "
            . 'is syntax-checked, it is in the offline manifest, and it runs nowhere -- which '
            . 'errors nothing, because nothing calls it. Add the tag (with filemtime() cache '
            . "busting, never a hardcoded ?v=N), or declare it in EC_UNREFERENCED_MODULES in this "
            . 'file with the reason it ships unreferenced.';
    }

    // 2. Every tag names a file that is there.
    $onDisk = array_flip($modules);
    foreach ($tagged as $mod => $pages) {
        if (isset($onDisk[$mod])) { continue; }
        $out[] = "js/$mod is loaded by " . implode(', ', $pages) . ' and does not exist. That tag '
            . "carries filemtime(), so this is a PHP warning on every render of those pages and a "
            . 'missing script for every visitor. A rename left one end behind.';
    }

    // 3. A declaration for a module that is gone.
    foreach ($unreferenced as $mod => $why) {
        if (!isset($onDisk[$mod])) {
            $out[] = "EC_UNREFERENCED_MODULES declares js/$mod, which is not on disk. The decision "
                . 'it records is about something that is gone.';
        } elseif (isset($tagged[$mod])) {
            $out[] = "js/$mod is declared as loaded by no page, and " . implode(', ', $tagged[$mod])
                . ' loads it. Delete the declaration: the page wins, and a declaration that reads '
                . 'as a decision and is not one is worse than none.';
        }
    }

    // 4. Everything the page puts BEFORE the editor is in place before the editor is evaluated.
    $editorAt = array_search(EC_LPN_EDITOR, $pageOrder, true);
    if ($editorAt === false) {
        $out[] = EC_LPN_PAGE . ' no longer loads js/' . EC_LPN_EDITOR . ' with a <script> tag, so '
            . 'this check cannot tell which modules precede it. Either the editor was renamed -- '
            . 'update EC_LPN_EDITOR -- or the page has changed shape enough to reread this check.';
        return $out;
    }
    $before = array_slice($pageOrder, 0, $editorAt);
    foreach ($before as $mod) {
        if (in_array($mod, $stubLoads, true) || isset($lazy[$mod])) { continue; }
        $out[] = "js/$mod is loaded by " . EC_LPN_PAGE . ' before js/' . EC_LPN_EDITOR
            . ', and dev/lpn-spike/lpn-dom-stub.js does not load it. The editor reads its modules '
            . 'off EngCalcs the moment its IIFE runs, so under the harnesses that member is '
            . 'undefined -- and the harnesses will very likely still pass, on a page the browser '
            . 'never has. Either add it to the stub in the same order the page uses, or declare it '
            . 'in EC_HARNESS_LAZY_MODULES in this file with the reason the shared stub can skip it.';
    }

    // 5. A lazy declaration must be backed by a harness that really loads it, and must describe a
    //    module the page really loads before the editor.
    foreach ($lazy as $mod => $why) {
        if (!in_array($mod, $before, true)) {
            $out[] = "EC_HARNESS_LAZY_MODULES declares js/$mod, which " . EC_LPN_PAGE . ' does not '
                . 'load before js/' . EC_LPN_EDITOR . ' any more. Delete the entry, or find out '
                . 'where the module went.';
            continue;
        }
        if (!in_array($mod, $harnessLoads, true)) {
            $out[] = "js/$mod is declared as loaded per-harness rather than by the shared stub, and "
                . 'NO harness in dev/lpn-spike/ loads it. So it is loaded nowhere under test at '
                . 'all, and the declaration is the reason nobody noticed. Either write the harness, '
                . 'or put the module in the stub.';
        }
        if (in_array($mod, $stubLoads, true)) {
            $out[] = "js/$mod is declared as skipped by the shared stub, and the stub loads it. "
                . 'Delete the declaration.';
        }
    }

    // 6. The stub must not boot something the page does not. A stub richer than the browser is the
    //    other half of the same defect: it holds constant a coupling the real page has to make.
    foreach ($stubLoads as $mod) {
        // Against every page's tags, not just Looped-Network.php's own: the suite-wide modules
        // (Calculators.lib.js, Cookies.lib.js) arrive through lib/HeadersFooters.lib.php, so they
        // are on that page without being written in it.
        if (!isset($tagged[$mod])) {
            $out[] = "dev/lpn-spike/lpn-dom-stub.js loads js/$mod and no shipped page does. "
                . "The stub is meant to reproduce the browser's script order; a module present "
                . 'only under test means the harnesses are exercising a page that does not ship.';
        }
    }

    return $out;
}

if (defined('JS_MODULE_WIRING_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

$modules = [];
foreach (glob($root . '/js/*.js') as $f) { $modules[] = basename($f); }
sort($modules);

$php = [];
foreach (array_merge(glob($root . '/*.php'), glob($root . '/lib/*.php')) as $f) {
    $php[substr($f, strlen($root) + 1)] = (string) file_get_contents($f);
}

$tagged = ecPageScriptTags($php);
$pageOrder = ecPageScriptOrder($php[EC_LPN_PAGE] ?? '');

$stubLoads = [];
foreach (EC_HARNESS_STUBS as $rel) {
    $stubLoads = array_merge($stubLoads, ecJsModuleLoads(ecReadJsCode($root . '/' . $rel)));
}
$stubLoads = array_values(array_unique($stubLoads));

$harnessLoads = [];
foreach (glob($root . '/dev/lpn-spike/*.js') as $f) {
    if (in_array('dev/lpn-spike/' . basename($f), EC_HARNESS_STUBS, true)) { continue; }
    $harnessLoads = array_merge($harnessLoads, ecJsModuleLoads(ecReadJsCode($f)));
}
$harnessLoads = array_values(array_unique($harnessLoads));

if (!$modules || !$pageOrder) {
    echo "js_module_wiring_check.php found no js/*.js, or no <script> tags on " . EC_LPN_PAGE . ".\n";
    echo "That is a broken check, not a clean tree: the globs or the page have moved.\n";
    exit(1);
}

$problems = ecJsWiringFindings($modules, $tagged, $pageOrder, $stubLoads, $harnessLoads,
    EC_UNREFERENCED_MODULES, EC_HARNESS_LAZY_MODULES);

if ($problems) {
    echo 'JS module wiring: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "A new module has to be added in three places (dev/testing-notes.md, \"Making an untestable\n";
    echo "file testable\"): the page's <script> tags, the harness stub, and any harness that evals\n";
    echo "js/looped-network.js. The fourth -- the service worker manifest -- globs js/*.js and is\n";
    echo "held by sw_manifest_check.php, so it is the one leg nobody has to remember.\n";
    exit(1);
}

$editorAt = array_search(EC_LPN_EDITOR, $pageOrder, true);
echo 'JS module wiring OK -- ' . count($modules) . ' modules, all on a page; ' . $editorAt
    . ' loaded before js/' . EC_LPN_EDITOR . ' (' . count(EC_HARNESS_LAZY_MODULES)
    . ' of them declared per-harness, each backed by a real harness), the rest booted by the '
    . "shared stub.\n";
exit(0);
