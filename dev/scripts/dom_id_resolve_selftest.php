<?php
/**
 * dom_id_resolve_selftest.php -- dom_id_resolve_check.php still SEES a name nothing creates, and
 * still turns away what only looks like one. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. That is exactly the shape that has
 * already died here once: a check that passes by finding nothing looks identical whether it is
 * holding or blind, and a narrowed pattern reports a SMALLER reference count, which reads as
 * tidying. So the count is asserted against the real tree, and the reach is proved by a LIVE
 * MUTATION rather than by a corpus guard asserting that a defect still exists -- a guard of that
 * kind breaks on the day somebody fixes the defect, which is the wrong day to be interrupted.
 *
 * The load-bearing fixtures are the NEGATIVE ones. Anybody can write a scanner that finds things;
 * the reason this check is adoptable is that a computed id family, a non-literal lookup and a hex
 * colour in the stylesheet are all turned away without anybody declaring them.
 *
 *   php dev/scripts/dom_id_resolve_selftest.php
 */

define('DOM_ID_LIB_ONLY', true);
require __DIR__ . '/dom_id_resolve_check.php';

$fails = [];
$n = 0;

/**
 * @param array<string,string> $pages
 * @param array<string,string> $scripts
 * @param array<string,string> $styles
 */
function ecDomIdCase(string $name, array $pages, array $scripts, array $styles, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecDomIdResolve($pages, $scripts, $styles)['findings'];
    $hit = $got !== [];
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

// ---- what it MUST find -------------------------------------------------------------------------
ecDomIdCase('THE DEFECT: a getElementById() naming an id no page and no script creates',
    ['p.php' => '<div id="a"></div>'], ['js/x.js' => "document.getElementById('typo');"], [], true);
ecDomIdCase('a <label for> naming nothing -- the label still shows, and stops naming its field',
    ['p.php' => '<label for="q">Flow</label><input id="flow">'], [], [], true);
ecDomIdCase('an aria-controls naming nothing, invisible to everyone but the screen reader',
    ['p.php' => '<button aria-controls="panel_x">x</button><div id="panel"></div>'], [], [], true);
ecDomIdCase('ONE OF A LIST: aria-labelledby takes several ids and only the second is wrong',
    ['p.php' => '<div aria-labelledby="a b"></div><span id="a"></span>'], [], [], true);
ecDomIdCase('an in-page link to a fragment that is on no element',
    ['p.php' => '<a href="#nowhere">x</a>'], [], [], true);
ecDomIdCase('a stylesheet rule for an id nothing creates -- it styles nothing, silently, forever',
    ['p.php' => '<div id="a"></div>'], [], ['css/e.css' => '#ghost { color: red; }'], true);
ecDomIdCase('an SVG url(#...) with no matching marker, so the arrow head simply never paints',
    [], ['js/rock-chute.js' => "s += '<line marker-end=\"url(#ah)\">';"], [], true);
ecDomIdCase('querySelector leading with an id that nothing creates',
    ['p.php' => '<div id="a"></div>'], ['js/x.js' => "document.querySelectorAll('#dialog button');"], [], true);
ecDomIdCase('THE OTHER HALF: the same id twice on one page, where getElementById takes the first',
    ['p.php' => '<div id="dup"></div><span id="dup"></span>'], [], [], true);

// ---- what it must NOT report ---------------------------------------------------------------------
ecDomIdCase('a lookup for an id the RENDERED page really has',
    ['p.php' => '<div id="lpn_map"></div>'], ['js/x.js' => "document.getElementById('lpn_map');"], [], false);
ecDomIdCase('an id the SCRIPT itself creates, which is most of the map editor',
    [], ['js/x.js' => "var b = document.createElement('button'); b.id = 'lpn_tab'; "
        . "document.getElementById('lpn_tab');"], [], false);
ecDomIdCase('A COMPUTED ID FAMILY: the literal half becomes a prefix, so the seven real '
    . 'aria-labelledby values under lpn_pane_tab_ are turned away rather than failed',
    ['p.php' => '<div aria-labelledby="lpn_pane_tab_junctions"></div>'],
    ['js/x.js' => "b.id = 'lpn_pane_tab_' + t.id;"], [], false);
ecDomIdCase('a NON-LITERAL lookup, which has nothing to compare and must not invent a finding',
    [], ['js/x.js' => "document.getElementById(name); document.getElementById('a' + i);"], [], false);
ecDomIdCase('A HEX COLOUR IN A DECLARATION. 37 of them ship beside 27 real selectors, and telling '
    . 'them apart by pattern is guesswork -- the braces do it by construction',
    ['p.php' => '<div id="a"></div>'], [], ['css/e.css' => '.x { color: #1a6faf; border: 1px solid #eee; }'], false);
ecDomIdCase('an id inside a CSS comment, which selects nothing and asserts nothing',
    [], [], ['css/e.css' => "/* #old_box was here */\n.x { color: red; }"], false);
ecDomIdCase('a bare "#" href, which is a control and not a reference to anything',
    ['p.php' => '<a href="#">x</a>'], [], [], false);
ecDomIdCase('a DECLARED dead lookup, which is a decision somebody wrote down with its reason',
    [], ['js/x.js' => "document.getElementById('lpn_rpane_btn');"], [], false);
ecDomIdCase('markup a script assembles as a STRING, which is where the sketch ids come from',
    [], ['js/rock-chute.js' => "s += '<pattern id=\"rp\"></pattern>'; s += 'fill=\"url(#rp)\"';"], [], false);
ecDomIdCase('an id defined on one page and referenced on that page only -- pages are not pooled '
    . 'for DEFINITION either, so this must stay a pass rather than become one by accident',
    ['a.php' => '<div id="only_here"></div><label for="only_here">x</label>', 'b.php' => '<p>nothing</p>'],
    [], [], false);

// ---- the corpus, and the live mutation -----------------------------------------------------------
// The check is pure above this line and reads the real tree below it, so neither half proves the
// other. The count guards against a narrowed pattern reading as tidying; the mutation guards
// against the scan not reaching the directories at all.
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/dom_id_resolve_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/(\d+) reference\(s\)/', $line, $m)) {
    $fails[] = "corpus: could not read the check's own reference count out of:\n      $line";
} elseif ((int) $m[1] < 900) {
    $fails[] = sprintf('corpus: only %d id references found. 1,447 were reachable on 2026-09-06; '
        . 'a collapse this large means the scan went blind, not that the references were deleted.',
        (int) $m[1]);
}

// The live mutation. `ec_selftest_domid.js` is not a shipped module and no page loads it; it exists
// for the length of one exec and names an id nothing in the suite creates. Removed inline AND on
// shutdown, because a selftest that can leave a stray file in js/ has invented a failure mode of
// its own.
$probe = dirname(__DIR__, 2) . '/js/ec_selftest_domid.js';
register_shutdown_function(function () use ($probe) { @unlink($probe); });
file_put_contents($probe, "// TEMPORARY: written by dev/scripts/dom_id_resolve_selftest.php.\n"
    . "document.getElementById('ec_no_such_id_selftest');\n");
$out2 = [];
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/dom_id_resolve_check.php') . ' 2>&1', $out2, $code2);
@unlink($probe);
$probeLine = implode("\n", $out2);
$n++;
if (strpos($probeLine, 'ec_selftest_domid.js') === false || $code2 === 0) {
    $fails[] = "corpus mutation: a file naming an id nothing creates was written into js/ and the "
        . "check did not fail on it. The scan is not reaching the directory it claims to guard. "
        . "Its output was:\n      " . $probeLine;
}

if ($fails) {
    echo 'dom_id_resolve selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "DOM id selftest OK -- $n cases, both directions, plus a live mutation of the real tree.\n";
exit(0);
