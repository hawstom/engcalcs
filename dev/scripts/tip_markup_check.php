<?php
/**
 * No page may hand-assemble .ec-help / .ec-tip markup. Use ecTipLabel() or ecLinkTipLabel().
 *
 * WHY THIS EXISTS. The link+tip and tip-only conventions have two different nestings, and which
 * one is correct depends on whether the label has a link:
 *
 *   - with a link, the <a> is the big click target, so .ec-help wraps the "?" glyph alone;
 *   - without one, .ec-help must wrap the label text AND the glyph, or the tap target is a single
 *     character, which fails on touch.
 *
 * Getting that backwards still renders. It produces no error, no warning, and no visible defect
 * on a desktop with a mouse -- it just quietly breaks the tooltip for phone users, who are most
 * of the visitors. CLAUDE.md described the rule in ~40 lines, and two pages were still caught
 * getting it wrong and retrofitted by hand in July 2026.
 *
 * That is the signature of a rule that wants to be a function rather than a paragraph. The two
 * helpers in lib/Calculators.lib.php now encode both nestings, plus the strip_tags()/
 * htmlspecialchars() pair that a title="" attribute requires. This check keeps the old pattern
 * from creeping back, which is the only thing that makes the helpers worth having: a convention
 * you can still bypass is a convention you will bypass.
 *
 * Blocking. There is no judgement call -- the helpers cover every shape currently in the suite,
 * and a genuinely new shape should extend them rather than be written out by hand.
 */

$root = dirname(__DIR__, 2);
$hits = [];

foreach (glob($root . '/*.php') as $page) {
    foreach (file($page) as $i => $line) {
        if (strpos($line, 'ec-help') === false && strpos($line, 'ec-tip') === false) continue;
        $hits[] = [basename($page), $i + 1, trim($line)];
    }
}

if ($hits) {
    echo "Hand-written tip markup: " . count($hits) . " site(s)\n\n";
    foreach ($hits as [$f, $n, $line]) {
        printf("  %s:%d\n      %s\n", $f, $n, mb_strimwidth($line, 0, 120, '...'));
    }
    echo "\nReplace with the helpers in lib/Calculators.lib.php, which encode the correct nesting\n";
    echo "and the title=\" \" escaping for you:\n\n";
    echo "    ecTipLabel(\$ec_lang['x'], \$ec_lang['x_tip'])\n";
    echo "    ecLinkTipLabel('https://...', \$ec_lang['x'], \$ec_lang['x_tip'])\n";
    exit(1);
}

echo "Tip markup OK -- every .ec-help/.ec-tip label goes through the helpers.\n";
exit(0);
