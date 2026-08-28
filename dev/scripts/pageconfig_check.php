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
 * **IT READS ALIASES TOO, SINCE 2026-08-28, AND UNTIL THEN IT DID NOT SEE THE BIGGEST PAGE AT ALL.**
 * The demand side matched the literal `pageConfig.<key>` and nothing else. But `js/looped-network.js`
 * -- 25,000 lines and 838 keys, more than every other page put together -- opens almost every
 * function with `var pc = EngCalcs.pageConfig || {}` and reads `pc.<key>` from there. So the one
 * page most able to hide a gap was the one page this check could not see, and it reported OK for
 * months while `lpn_labels_col_drop` sat translated into 26 languages and wired into nothing. That
 * key was found by diffing the two sides BY HAND. This is that diff, kept.
 *
 * **AN ALIAS IS AN ASSIGNMENT OF THE OBJECT, WHICH IS WHAT MAKES IT DETECTABLE WITHOUT GUESSING:**
 * `= EngCalcs.pageConfig` whose next non-space character is not a dot. `var x = EngCalcs.pageConfig
 * || {}`, `cfg = EngCalcs.pageConfig,` and `= EngCalcs.pageConfig;` are aliases; `var label =
 * EngCalcs.pageConfig.dw_regime` is a READ of one key and is already covered. Getting that
 * discriminator wrong is what a first draft did -- it took `el.textContent = EngCalcs.pageConfig.x`
 * for an alias named `textContent`.
 *
 * **AND A READ THROUGH AN ALIAS MUST LOOK LIKE A LANG KEY: `prefix_word`, lowercase, with at least
 * one underscore.** That is not decoration, it is the whole false-positive defence. An alias is a
 * short local name and this file cannot prove a given `pc.foo` is a string lookup rather than some
 * other property; requiring the suite's own key shape means `pc.length`, `cfg.x` and any DOM
 * property are invisible. Verified against the supplied side: **every one of the keys the 14 pages
 * declare has an underscore**, so the shape rule excludes nothing real. This check BLOCKS, so a
 * false positive stops a commit -- it is deliberately allowed to miss rather than to invent.
 *
 * Exit 0 clean, 1 on any unsupplied read. Blocking on purpose -- unlike key hygiene, there is no
 * judgement call here. A key is either supplied or it is not.
 */

/**
 * Every pageConfig key one JS source reads, by the literal object and through any alias of it.
 *
 * Pure, so `pageconfig_selftest.php` can put fixtures through it: everything it judges arrives as
 * the argument.
 *
 * @param string $js Source text of one JS file.
 * @return array<int,string> key names, deduplicated, in no particular order.
 */
function ecPageConfigReads(string $js): array
{
    $keys = [];
    preg_match_all('/pageConfig\.([A-Za-z0-9_]+)/', $js, $direct);
    foreach ($direct[1] as $k) { $keys[$k] = true; }

    // An alias is an assignment of the OBJECT: the next non-space character is not a dot.
    preg_match_all('/\b([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*EngCalcs\.pageConfig\s*(?![.\w])/', $js, $am);
    $aliases = array_values(array_unique($am[1]));
    foreach ($aliases as $alias) {
        // The key shape is the false-positive defence -- see the docblock.
        $re = '/\b' . preg_quote($alias, '/') . '\.([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b/';
        preg_match_all($re, $js, $um);
        foreach ($um[1] as $k) { $keys[$k] = true; }
    }
    return array_keys($keys);
}

if (defined('PAGECONFIG_LIB_ONLY')) {
    return;
}

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
        foreach (ecPageConfigReads(file_get_contents($jsPath)) as $u) {
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
