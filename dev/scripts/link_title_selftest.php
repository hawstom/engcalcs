<?php
/**
 * link_title_selftest.php — assert that link_title_check.php still sees a tip parked on a link,
 * and still passes the CORRECT nesting. BLOCKING.
 *
 * WHY THIS EXISTS, AND WHICH FIXTURE IS LOAD-BEARING. The check finds nothing today, so a working
 * one and a broken one print the same sentence. The fixture that matters most is not the
 * violation — it is `ecLinkTipLabel()`'s own output, the shape 40-odd labels in this suite already
 * have. The two correct nestings are OPPOSITE (with a link, `.ec-help` wraps the "?" glyph alone;
 * without one, it wraps the label text and the glyph together), and a check that could not tell the
 * link nesting from the defect would fail on every correctly written label in the suite. Nobody
 * would fix that; they would delete the check.
 *
 * The second load-bearing pair is the legitimate `title` on a link: the main menu's
 * `<prefix>_main_desc`, which describes the page being opened, and the language switcher's
 * `LANGNAME`. Both are titles on anchors, both are correct, and both are one careless generalization
 * away from being reported.
 *
 *   php dev/scripts/link_title_selftest.php
 */

define('LINK_TITLE_LIB_ONLY', true);
require __DIR__ . '/link_title_check.php';

// A miniature of the suite's shipped strings. Keyed the way the real ones are keyed, because the
// classification is by KEY SHAPE and the fixture must exercise that.
$TIPS = [
    'Roughness height of the pipe wall, in the same unit as the diameter.' => 'dw_roughness_tip',
    'Letters, digits, spaces.'                                            => 'ec_name_tip',
];
$NAMED = [
    'Hazen-Williams Pipe Head Loss at Given Diameter, Roughness, and Flow' => true, // hw_main_desc
    'Hide this line'                                                       => true, // view_hide_line
    'Türkçe'                                                               => true, // LANGNAME
];

$fails = 0;
$cases = [
    // ---- what it MUST find ---------------------------------------------------------------------
    ['a tip parked on a link',
     '<a href="ref.html" title="Roughness height of the pipe wall, in the same unit as the diameter.">Roughness</a>',
     ['tip-in-link']],
    // class="ec-help" on the ANCHOR wires initTips(), and the tap still navigates. Not a rescue.
    ['a tip on a link that also carries class="ec-help"',
     '<a class="ec-help" href="ref.html" title="Letters, digits, spaces.">Name</a>',
     ['tip-in-link']],
    ['a tip on a link with a single-quoted attribute',
     "<a href='ref.html' title='Letters, digits, spaces.'>Name</a>",
     ['tip-in-link']],
    ['a tip that reached the attribute HTML-escaped',
     '<a href="r" title="Roughness height of the pipe wall, in the same unit as the diameter.">R</a>',
     ['tip-in-link']],
    ['a hand-written sentence with no shipped-string provenance',
     '<a href="r" title="Use this table when the pipe material is unknown to you.">Table</a>',
     ['prose-in-link']],
    ['a hand-written explanation that is merely long',
     '<a href="r" title="pipe roughness values for concrete steel ductile iron and plastic">T</a>',
     ['prose-in-link']],

    // ---- what it must NOT report ---------------------------------------------------------------
    // THE SHAPE THE SUITE ACTUALLY CONTAINS, ~40 times. ecLinkTipLabel(): the anchor is the big
    // click target and carries NO title; the "?" beside it holds the tip.
    ['ecLinkTipLabel() output -- the correct link nesting',
     '<a target="_blank" href="https://x">Roughness</a><span class="ec-help" '
     . 'title="Roughness height of the pipe wall, in the same unit as the diameter."'
     . '><span class="ec-tip">?</span></span>',
     []],
    // ecTipLabel(): the OPPOSITE nesting -- the whole label is the tap target -- with a link inside.
    ['ecTipLabel() output wrapping a link, the opposite nesting',
     '<span class="ec-help" title="Letters, digits, spaces."><a href="x">Name</a> '
     . '<span class="ec-tip">?</span></span>',
     []],
    ['a tip on a span that is not a link at all',
     '<span class="ec-help" title="Letters, digits, spaces.">Name <span class="ec-tip">?</span></span>',
     []],
    ['the main menu, whose title DESCRIBES the page the link opens',
     '<a class="dropdown-item" href="Hazen-Williams.php" title="Hazen-Williams Pipe Head Loss at '
     . 'Given Diameter, Roughness, and Flow">Hazen-Williams</a>',
     []],
    ['the language switcher, whose title is the language\'s own name',
     '<a class="dropdown-item" lang="tr" href="?lang=tr" title="Türkçe">Türkçe</a>',
     []],
    ['the row-collapse X, whose title NAMES an unlabelled control',
     '<a data-bs-toggle="collapse" href="#q_row" title="Hide this line">X</a>',
     []],
    ['a link with no title at all, which is correct when there is no tip',
     '<a target="_blank" href="https://example.org">Reference</a>',
     []],
    ['an empty title',
     '<a href="x" title="">Reference</a>',
     []],
    // An unattributed SHORT title is a NOTE, never a failure: "Mapbox" on the attribution link.
    ['a short attribution title with no shipped-string provenance',
     '<a href="https://www.mapbox.com/about/maps/" title="Mapbox">Mapbox</a>',
     ['unattributed']],
    ['two anchors, one bad and one good',
     '<a href="a" title="Letters, digits, spaces.">A</a><a href="b" title="Türkçe">B</a>',
     ['tip-in-link']],
];

foreach ($cases as [$name, $html, $want]) {
    $got = array_values(array_map(fn($f) => $f[0],
        array_filter(ecLinkTitleFindings($html, $TIPS, $NAMED), fn($f) => $f[0] !== 'named')));
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo "        wanted [" . implode(', ', $want) . "], got [" . implode(', ', $got) . "]\n";
    } else {
        echo "  ok   $name\n";
    }
}

// ---- the key-shape test, against the real key names it will meet -------------------------------
echo "\n-- which key names are TIPS ------------------------------------------------------------\n";
$keyCases = [
    ['dw_roughness_tip', true,  'the ordinary tip key'],
    ['ec_name_tip',      true,  'the same, on a non-calculator control'],
    ['lpn_basemap_tip',  true,  'a map-page tip'],
    ['hw_main_desc',     false, 'a page DESCRIPTION -- it names the destination'],
    ['hw_main_title',    false, 'a page title'],
    ['view_hide_line',   false, 'a control name'],
    ['mpf_flow',         false, 'a label'],
    ['lpn_tip_select',   true,  'this suite also writes tips in the PREFIX position, lpn_tip_*'],
    ['lpn_tiptoe_mode',  false, 'a key that merely contains the letters, at no delimiter'],
];
foreach ($keyCases as [$key, $want, $why]) {
    $got = ecIsTipKey($key);
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $key -- wanted " . var_export($want, true) . ", got " . var_export($got, true)
            . "\n        ($why)\n";
    } else {
        echo "  ok   $key => " . ($want ? 'tip' : 'not a tip') . "\n";
    }
}

// ---- and that the real language file still has tips to find ------------------------------------
// A parser change that silently returned nothing would leave the check reporting success forever.
echo "\n-- the real language file --------------------------------------------------------------\n";
require_once __DIR__ . '/lang_parse.inc.php';
$realTips = 0;
foreach (ecLangValues(file_get_contents(dirname(__DIR__, 2) . '/lib/lang.ec.en.php')) as $k => $v) {
    if (ecIsTipKey($k) && trim($v) !== '') { $realTips++; }
}
if ($realTips < 50) {
    $fails++;
    echo "  FAIL lib/lang.ec.en.php yielded only $realTips tip values -- the check has gone blind\n";
} else {
    echo "  ok   lib/lang.ec.en.php yields $realTips tip values for the check to look for\n";
}

if ($fails) {
    echo "\n$fails fixture(s) failed. link_title_check.php's reach has moved.\n";
    echo "A false positive here fails every commit on ~40 correctly written labels and on the whole\n";
    echo "main menu; a false negative ships an explanation that a touch visitor cannot reach at all.\n";
    exit(1);
}
echo "\nLink-title selftest OK -- " . (count($cases) + count($keyCases) + 1)
    . " fixtures, both directions.\n";
exit(0);
