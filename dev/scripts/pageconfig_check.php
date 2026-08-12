<?php
/**
 * Every EngCalcs.pageConfig.<key> a JS file reads must be supplied by the page that loads it.
 *
 * WHY THIS EXISTS. The PHP->JS handoff for translated strings is a hand-maintained bridge: 14
 * pages each type out a literal object listing the lang keys their calculator's JS will read by
 * name. Nothing connects the two ends. Miss a key and JS reads `undefined`, which does not throw
 * and does not warn -- it renders the word "undefined" into a results cell, or silently blanks a
 * verdict string, in whichever of 27 languages the visitor happens to be using. That is the worst
 * shape a defect can have here: invisible in English, invisible in testing, visible only to the
 * visitor who least expected it.
 *
 * The bridge was intact when this check was written (2026-08-12). The check's job is to keep it
 * that way, because "intact" was being maintained by care alone, and care does not survive a
 * hurried edit. Adding a pageConfig key is the easiest thing in the world to forget: you write
 * the JS that reads it, the page still renders, and nothing tells you.
 *
 * Exit 0 clean, 1 on any unsupplied read. Blocking on purpose -- unlike key hygiene, there is no
 * judgement call here. A key is either supplied or it is not.
 */

$root = dirname(__DIR__, 2);
$problems = [];
$pagesChecked = 0;
$keysChecked = 0;

foreach (glob($root . '/*.php') as $page) {
    $src = file_get_contents($page);
    if (strpos($src, 'EngCalcs.pageConfig') === false) continue;

    // The supplied side: the literal object. A page that builds pageConfig some other way is
    // reported rather than skipped silently -- an unparseable form is exactly where a gap hides.
    if (!preg_match('/EngCalcs\.pageConfig\s*=\s*\{(.*?)\n\s*\};/s', $src, $m)) {
        $problems[] = basename($page) . ': assigns EngCalcs.pageConfig in a form this check cannot read';
        continue;
    }
    preg_match_all('/^\s*([A-Za-z0-9_]+)\s*:/m', $m[1], $km);
    $supplied = $km[1];
    $pagesChecked++;

    // The demand side: every pageConfig.<key> in every JS file this page loads.
    preg_match_all('#/engcalcs/js/([A-Za-z0-9._-]+\.js)#', $src, $jm);
    $used = [];
    foreach (array_unique($jm[1]) as $js) {
        $jsPath = $root . '/js/' . $js;
        if (!is_file($jsPath)) {
            $problems[] = basename($page) . ": loads js/$js, which does not exist";
            continue;
        }
        preg_match_all('/pageConfig\.([A-Za-z0-9_]+)/', file_get_contents($jsPath), $um);
        foreach ($um[1] as $u) {
            if (!isset($used[$u])) $used[$u] = $js;
        }
    }
    $keysChecked += count($used);

    foreach (array_diff(array_keys($used), $supplied) as $k) {
        $problems[] = sprintf('%s: js/%s reads pageConfig.%s, which the page does not supply',
                              basename($page), $used[$k], $k);
    }
}

if ($problems) {
    echo "pageConfig bridge: " . count($problems) . " problem(s)\n\n";
    foreach ($problems as $p) echo "  $p\n";
    echo "\nEach one renders as `undefined` in the browser with no error. Add the key to the\n";
    echo "page's EngCalcs.pageConfig block, or stop reading it in the JS.\n";
    exit(1);
}

echo "pageConfig bridge OK -- $keysChecked reads across $pagesChecked pages, all supplied.\n";
exit(0);
