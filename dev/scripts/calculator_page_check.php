<?php
/**
 * calculator_page_check.php — a calculator page is in the menu and owns a documented prefix.
 * BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. CLAUDE.md § How to Add a New Calculator is a twelve-step list, and steps 2 and 7
 * are the two whose omission is INVISIBLE from the page itself:
 *
 *   - **Step 7, not in `lib/Menus.lib.php`.** The page works perfectly. It renders, it solves, it
 *     is indexed by the sitemap — and no visitor can reach it, because the only navigation this
 *     suite has is that menu. Nothing on the page can look wrong, because the defect is somewhere
 *     the page has never heard of. `Irrigation.php` sat outside the menu for a reason (Task 232);
 *     the ones that sit outside it for NO reason look exactly the same.
 *   - **Step 2, no documented prefix.** The prefix table in CLAUDE.md is not decoration: it is what
 *     the next author reads before choosing a prefix, and it is what `prefix_map_check.php` and the
 *     translation-coverage declaration are checked against. A calculator whose prefix is absent
 *     from the table can be given the SAME prefix by the next calculator, and two calculators
 *     sharing a prefix is a key collision that resolves as whichever file loaded last.
 *
 * WHAT A CALCULATOR IS, DERIVED RATHER THAN LISTED. A page is a file calling `echoHeader()`; a
 * CALCULATOR is a page that also calls `echoCalculatorForm()`. That is the whole distinction, and
 * it is the same trick `page_meta_check.php` uses to separate the pages from the endpoints beside
 * them without a second list to maintain. The one thing it cannot see is a calculator that renders
 * its form by hand, so every page that is NOT a calculator by that test is declared below with a
 * reason: a new page therefore fails until somebody writes down which of the two it is, and the
 * declaration is the only place a hand-rolled calculator could hide.
 *
 * HOW A PAGE'S PREFIX IS FOUND. From `$html_desc = $ec_lang['<prefix>_main_desc']`, which every
 * page sets and `page_meta_check.php` already guarantees. The MENU row names the same key in its
 * `title=`, so the two are cross-checked: a row pointing at the right page with another
 * calculator's description is a copy-paste defect that reads as correct in every language.
 *
 * THE THREE LEGACY MENU KEYS ARE DECLARED, NOT WIDENED AWAY. `mi`, `mtc` and `wi` predate the
 * `*_main_menu` convention and name their menu entry `<prefix>_menu`. They are listed by exact
 * prefix below, so a NEW calculator cannot quietly join them — renaming the three would touch 27
 * language files to buy nothing, and pretending both spellings are equally correct would let the
 * convention decay. `irr` is not here and is not a calculator: it owns no keys at all and survives
 * only in `translation_coverage.json`, probably as a legacy alias of `ip`.
 *
 * Usage:
 *   php dev/scripts/calculator_page_check.php
 *
 * Exit 0 = every calculator is reachable and documented. Exit 1 = at least one is not.
 */

/**
 * Pages that call echoHeader() but are NOT calculators, each with the reason it is not one.
 * A page absent from this list and from the calculator test is a finding, not a silence.
 */
const EC_NON_CALCULATOR_PAGES = [
    'index.php'                 => 'the suite home page: a menu of calculators, not one itself',
    'About.php'                 => 'prose about the suite',
    'Install.php'               => 'prose: how to install the suite on your own server',
    'contact.php'               => 'a contact form, handled by formmail.php',
    'formmailsuccess.php'       => 'the contact form\'s thank-you page',
    'privacy.php'               => 'the privacy statement',
    'terms.php'                 => 'the terms of use',
    'Compare-Languages.php'     => 'a translation-QA view of one key across languages',
    'Orifice-Drain-Time-Ref.php' => 'the derivation behind Orifice-Drain-Time.php: prose and algebra, no form',
];

/**
 * Calculator pages deliberately absent from the menu, each with the reason.
 * EMPTY TODAY, and it is a door rather than a formality: `Irrigation.php` was kept out of the menu
 * on purpose (Task 232) before it was retired, so the shape recurs. Keeping it out silently is the
 * defect; keeping it out with a sentence here is a decision.
 */
const EC_MENU_EXEMPT_CALCULATORS = [];

/** Prefixes whose menu entry is `<prefix>_menu` because they predate the `*_main_menu` convention. */
const EC_LEGACY_MENU_KEY_PREFIXES = ['mi', 'mtc', 'wi'];

/**
 * Findings for one world. Pure, so the selftest can hand it a broken one.
 *
 * @param array<string,array{calculator:bool,descKey:?string}> $pages   basename => facts.
 * @param array<string,array{descKey:?string,textKey:?string}> $menu    basename => the row's keys.
 * @param array<string,string> $prefixes   documented prefix => calculator name, from CLAUDE.md.
 * @param array<string,string> $nonCalc    declared non-calculator page => reason.
 * @param array<string,string> $menuExempt declared unmenued calculator => reason.
 * @param string[] $legacyMenuKey          prefixes allowed to use `<prefix>_menu`.
 * @return array<int,array{0:string,1:string}> [code, message] pairs.
 */
function ecCalculatorPageFindings(
    array $pages,
    array $menu,
    array $prefixes,
    array $nonCalc,
    array $menuExempt,
    array $legacyMenuKey
): array {
    $out = [];
    $prefixOfPage = [];

    foreach ($nonCalc as $page => $reason) {
        if (!isset($pages[$page])) {
            $out[] = ['stale-exclusion', "$page is declared a non-calculator page but no such page exists"];
        } elseif ($pages[$page]['calculator']) {
            $out[] = ['wrong-exclusion', "$page is declared a non-calculator page but it calls echoCalculatorForm()"];
        }
    }
    foreach ($menuExempt as $page => $reason) {
        if (!isset($pages[$page])) {
            $out[] = ['stale-exclusion', "$page is declared exempt from the menu but no such page exists"];
        }
    }
    foreach ($menu as $href => $row) {
        if (!isset($pages[$href])) {
            $out[] = ['menu-dead-link', "lib/Menus.lib.php links to $href, which is not a page here"];
        }
    }

    foreach ($pages as $page => $facts) {
        if (!$facts['calculator']) {
            if (!isset($nonCalc[$page])) {
                $out[] = ['undeclared-page', "$page renders a page but no calculator form, and is not declared a non-calculator page"];
            }
            continue;
        }

        // ---- step 2: the prefix ---------------------------------------------------------------
        $prefix = null;
        if ($facts['descKey'] === null) {
            $out[] = ['no-desc-key', "$page is a calculator but sets no \$html_desc = \$ec_lang['<prefix>_main_desc']"];
        } elseif (!preg_match('/^([a-z0-9]+)_main_desc$/', $facts['descKey'], $m)) {
            $out[] = ['desc-key-shape', "$page names \$html_desc = \$ec_lang['{$facts['descKey']}'], from which no prefix can be read"];
        } else {
            $prefix = $m[1];
            if (!isset($prefixes[$prefix])) {
                $out[] = ['undocumented-prefix', "$page owns the prefix '{$prefix}_', which is not in the prefix table in CLAUDE.md"];
            }
            if (isset($prefixOfPage[$prefix])) {
                $out[] = ['duplicate-prefix', "$page and {$prefixOfPage[$prefix]} both claim the prefix '{$prefix}_'"];
            }
            $prefixOfPage[$prefix] = $page;
        }

        // ---- step 7: the menu -----------------------------------------------------------------
        if (!isset($menu[$page])) {
            if (!isset($menuExempt[$page])) {
                $out[] = ['not-in-menu', "$page is a calculator and no row in lib/Menus.lib.php links to it"];
            }
            continue;
        }
        $row = $menu[$page];
        if ($row['descKey'] === null) {
            $out[] = ['menu-row-no-title', "the lib/Menus.lib.php row for $page carries no title=\$ec_lang[...] description"];
        } elseif ($prefix !== null && $row['descKey'] !== $facts['descKey']) {
            $out[] = ['menu-prefix-mismatch',
                "the lib/Menus.lib.php row for $page describes it with '{$row['descKey']}', but the page's own \$html_desc is '{$facts['descKey']}'"];
        }
        if ($prefix === null) { continue; }
        $wanted = in_array($prefix, $legacyMenuKey, true) ? $prefix . '_menu' : $prefix . '_main_menu';
        if ($row['textKey'] === null) {
            $out[] = ['menu-row-no-text', "the lib/Menus.lib.php row for $page has no \$ec_lang[...] link text"];
        } elseif ($row['textKey'] !== $wanted) {
            $out[] = ['menu-key-convention',
                "the lib/Menus.lib.php row for $page reads '{$row['textKey']}'; the convention for the prefix '{$prefix}_' is '$wanted'"];
        }
    }

    foreach ($prefixes as $prefix => $name) {
        if (!isset($prefixOfPage[$prefix])) {
            $out[] = ['unused-prefix', "the prefix '{$prefix}_' ($name) is documented in CLAUDE.md but no calculator page claims it"];
        }
    }
    return $out;
}

/** Facts about one root PHP file: is it a page, is it a calculator, what does $html_desc name. */
function ecPageFacts(string $php): array
{
    $isPage = (bool) preg_match('/\becho(?:HTML)?Header\s*\(/', $php);
    $isCalc = (bool) preg_match('/\bechoCalculatorForm\s*\(/', $php);
    $desc = null;
    if (preg_match('/\$html_desc\s*=\s*\$ec_lang\[\'([A-Za-z0-9_]+)\'\]/', $php, $m)) { $desc = $m[1]; }
    return ['page' => $isPage, 'calculator' => $isCalc, 'descKey' => $desc];
}

/**
 * The calculator rows of lib/Menus.lib.php: page basename => the row's description and text keys.
 * A row whose href carries a slash is somebody else's site and is not a page of ours.
 */
function ecMenuRows(string $php): array
{
    $out = [];
    /* AN ANCHOR IS MATCHED TO ITS CLOSING TAG, NOT TO THE FIRST '>'. A row's title carries a PHP
       short echo, and a closing PHP tag ends in a '>' — so the usual `<a[^>]*>` stops in the
       middle of the attribute and the description disappears. Take the whole element instead and
       pull the parts out of it. (This comment cannot spell that tag: inside a // comment it would
       close this file's own PHP block, which is a defect of exactly the shape being described.) */
    if (!preg_match_all('/<a\b(.*?)<\/a>/s', $php, $mm, PREG_SET_ORDER)) {
        return $out;
    }
    foreach ($mm as $m) {
        $el = $m[1];
        // A leading slash is an absolute path into the parent site, not a page of this suite.
        if (!preg_match('/href="([^"\/][^"]*\.php)"/', $el, $h)) { continue; }
        $descKey = null;
        $textKey = null;
        if (preg_match('/title="<\?=\$ec_lang\[\'([A-Za-z0-9_]+)\'\]\?>"/', $el, $t)) {
            $descKey = $t[1];
            $el = str_replace($t[0], '', $el);
        }
        if (preg_match('/\$ec_lang\[\'([A-Za-z0-9_]+)\'\]/', $el, $x)) { $textKey = $x[1]; }
        $out[$h[1]] = ['descKey' => $descKey, 'textKey' => $textKey];
    }
    return $out;
}

/** The prefix table in CLAUDE.md: prefix => calculator name. */
function ecDocumentedPrefixes(string $md): array
{
    $out = [];
    $start = strpos($md, '## Variable Prefix Convention');
    if ($start === false) { return $out; }
    $end = strpos($md, "\n## ", $start + 1);
    $section = substr($md, $start, $end === false ? null : $end - $start);
    if (preg_match_all('/^\|\s*`([a-z0-9]+)_`\s*\|\s*([^|]+?)\s*\|/m', $section, $mm, PREG_SET_ORDER)) {
        foreach ($mm as $m) { $out[$m[1]] = $m[2]; }
    }
    return $out;
}

if (defined('EC_CALCULATOR_PAGE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);

$pages = [];
foreach (glob($root . '/*.php') as $file) {
    $facts = ecPageFacts(file_get_contents($file));
    if (!$facts['page']) { continue; }                 // an endpoint, not a page
    $pages[basename($file)] = $facts;
}
$menu = ecMenuRows(file_get_contents($root . '/lib/Menus.lib.php'));
$prefixes = ecDocumentedPrefixes(file_get_contents($root . '/CLAUDE.md'));

if (!$prefixes) {
    echo "The prefix table under '## Variable Prefix Convention' in CLAUDE.md could not be read.\n";
    echo "That table is this check's only source for step 2; without it the check would pass by\n";
    echo "knowing nothing. Restore the table, or fix ecDocumentedPrefixes() to match its shape.\n";
    exit(1);
}

$findings = ecCalculatorPageFindings(
    $pages, $menu, $prefixes,
    EC_NON_CALCULATOR_PAGES, EC_MENU_EXEMPT_CALCULATORS, EC_LEGACY_MENU_KEY_PREFIXES
);

$calcCount = count(array_filter($pages, fn($p) => $p['calculator']));

if ($findings) {
    echo 'Calculator wiring: ' . count($findings) . " finding(s)\n\n";
    foreach ($findings as [$code, $msg]) { echo "  [$code] $msg\n"; }
    echo "\nCLAUDE.md 'How to Add a New Calculator' steps 2 and 7. Both failures are invisible from\n";
    echo "the page: an unmenued calculator renders perfectly and no visitor can reach it, and an\n";
    echo "undocumented prefix is free to be handed to the next calculator, whose keys then collide\n";
    echo "with these and resolve as whichever language file loaded last.\n";
    echo "\nFIX, by finding code:\n";
    echo "  not-in-menu           add a <a class=\"dropdown-item\" href=\"...\"> row to lib/Menus.lib.php,\n";
    echo "                        or declare the page in EC_MENU_EXEMPT_CALCULATORS with the reason\n";
    echo "  undocumented-prefix   add the prefix to the table in CLAUDE.md § Variable Prefix Convention\n";
    echo "  undeclared-page       add it to EC_NON_CALCULATOR_PAGES with a reason, or give it a form\n";
    echo "  menu-key-convention   name the menu entry <prefix>_main_menu (rename_lang_key.php renames it)\n";
    echo "  menu-prefix-mismatch  the menu row's title= and the page's own \$html_desc must be one key\n";
    echo "  unused-prefix         a documented prefix nothing claims: delete the row, or the page is missing\n";
    exit(1);
}

echo "Calculator wiring OK -- $calcCount calculator page(s), each in lib/Menus.lib.php and each\n";
echo 'owning one of the ' . count($prefixes) . " prefixes documented in CLAUDE.md.\n";
echo '      ' . count(EC_NON_CALCULATOR_PAGES) . " page(s) declared non-calculator; "
    . count(EC_MENU_EXEMPT_CALCULATORS) . " calculator(s) declared exempt from the menu.\n";
echo "NOTE: a calculator is a page calling echoCalculatorForm(). One that built its form by hand\n";
echo "      would read as a non-calculator here, which is what the declared list above is for.\n";
