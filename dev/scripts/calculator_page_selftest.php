<?php
/**
 * calculator_page_selftest.php — assert calculator_page_check.php still sees an unmenued
 * calculator and an undocumented prefix, and still ignores the pages that are not calculators.
 * BLOCKING.
 *
 * WHY THIS EXISTS. The check finds nothing today, which is the state in which a working check and
 * a blind one print the same word. It has four specific ways to go blind, and each is a fixture:
 *
 *   - **the extractors.** The menu row's `title=` holds a PHP short echo whose closing tag ends in
 *     '>', so the obvious `<a[^>]*>` reads no description at all — and the check's own reaction to
 *     that is 16 findings, i.e. loud. The opposite failure is the dangerous one: an href regex that
 *     matches nothing reports every calculator as being in the menu, because the menu it is
 *     comparing against is empty. Both directions are pinned below;
 *   - **the calculator test.** `echoCalculatorForm()` is what separates a calculator from a page.
 *     If the pattern stops matching, every calculator becomes an undeclared page — loud — but if it
 *     matches a MENTION in a comment, a prose page silently acquires a prefix requirement;
 *   - **the legacy menu keys.** `mi`, `mtc` and `wi` are correct with `<prefix>_menu`. A check
 *     widened to accept `_menu` from anybody stops enforcing the convention at all;
 *   - **the prefix table.** If its rows stop parsing, every prefix is undocumented (loud) — but an
 *     empty table read as "nothing to check" would be silent, which is why the check refuses to run
 *     on an unreadable table rather than passing.
 *
 *   php dev/scripts/calculator_page_selftest.php
 */

define('EC_CALCULATOR_PAGE_LIB_ONLY', true);
require __DIR__ . '/calculator_page_check.php';

$fails = 0;
$ok = 0;

/** One findings case over a synthetic world. */
function ecSelftestCase(string $name, array $pages, array $menu, array $prefixes,
                        array $nonCalc, array $menuExempt, array $wantCodes): void
{
    global $fails, $ok;
    $got = array_map(fn($f) => $f[0], ecCalculatorPageFindings(
        $pages, $menu, $prefixes, $nonCalc, $menuExempt, EC_LEGACY_MENU_KEY_PREFIXES));
    sort($got);
    $want = $wantCodes;
    sort($want);
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted [' . implode(', ', $want) . '], got [' . implode(', ', $got) . "]\n";
    } else {
        $ok++;
        echo "  ok   $name\n";
    }
}

// A minimal healthy world, reused and then broken one way at a time.
$calc = ['page' => true, 'calculator' => true, 'descKey' => 'mpf_main_desc'];
$prose = ['page' => true, 'calculator' => false, 'descKey' => 'about_main_desc'];
$row = ['descKey' => 'mpf_main_desc', 'textKey' => 'mpf_main_menu'];
$prefixes = ['mpf' => 'Manning Pipe Flow'];
$nonCalc = ['About.php' => 'prose'];

ecSelftestCase('a healthy world',
    ['Manning-Pipe-Flow.php' => $calc, 'About.php' => $prose],
    ['Manning-Pipe-Flow.php' => $row], $prefixes, $nonCalc, [], []);

// ---- what it MUST find -------------------------------------------------------------------------
ecSelftestCase('STEP 7: a calculator no menu row links to',
    ['Manning-Pipe-Flow.php' => $calc],
    [], $prefixes, [], [], ['not-in-menu']);

ecSelftestCase('STEP 2: a calculator whose prefix is not in the table',
    ['Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => $row], [], [], [], ['undocumented-prefix']);

ecSelftestCase('a page that is neither a calculator nor declared',
    ['Compare-Languages.php' => $prose],
    [], $prefixes, [], [], ['undeclared-page', 'unused-prefix']);

ecSelftestCase('two calculators claiming one prefix',
    ['Manning-Pipe-Flow.php' => $calc, 'Copy-Of-It.php' => $calc],
    ['Manning-Pipe-Flow.php' => $row, 'Copy-Of-It.php' => $row], $prefixes, [], [],
    ['duplicate-prefix']);

ecSelftestCase('a menu row describing the page with another calculator\'s key',
    ['Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => ['descKey' => 'hw_main_desc', 'textKey' => 'mpf_main_menu']],
    $prefixes, [], [], ['menu-prefix-mismatch']);

ecSelftestCase('a NEW calculator using the legacy <prefix>_menu spelling',
    ['Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => ['descKey' => 'mpf_main_desc', 'textKey' => 'mpf_menu']],
    $prefixes, [], [], ['menu-key-convention']);

ecSelftestCase('a menu link to a page that does not exist',
    ['Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => $row, 'Deleted-Page.php' => $row], $prefixes, [], [],
    ['menu-dead-link']);

ecSelftestCase('an exclusion naming a page that is gone',
    ['Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => $row], $prefixes, ['Gone.php' => 'prose'], [],
    ['stale-exclusion']);

ecSelftestCase('an exclusion over a page that IS a calculator',
    ['Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => $row], $prefixes, ['Manning-Pipe-Flow.php' => 'prose'], [],
    ['wrong-exclusion']);

ecSelftestCase('a documented prefix no page claims',
    ['Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => $row], $prefixes + ['zzz' => 'Ghost Calculator'], [], [],
    ['unused-prefix']);

ecSelftestCase('a calculator setting no $html_desc',
    ['Manning-Pipe-Flow.php' => ['page' => true, 'calculator' => true, 'descKey' => null]],
    ['Manning-Pipe-Flow.php' => $row], $prefixes, [], [], ['no-desc-key', 'unused-prefix']);

ecSelftestCase('a $html_desc that names a key no prefix can be read from',
    ['Manning-Pipe-Flow.php' => ['page' => true, 'calculator' => true, 'descKey' => 'index_meta_desc_plain']],
    ['Manning-Pipe-Flow.php' => $row], $prefixes, [], [], ['desc-key-shape', 'unused-prefix']);

// ---- what it must NOT report ---------------------------------------------------------------------
ecSelftestCase('the three legacy prefixes keep their <prefix>_menu spelling',
    ['Manning-Trap.php' => ['page' => true, 'calculator' => true, 'descKey' => 'mtc_main_desc']],
    ['Manning-Trap.php' => ['descKey' => 'mtc_main_desc', 'textKey' => 'mtc_menu']],
    ['mtc' => 'Manning Trap Channel'], [], [], []);

ecSelftestCase('a calculator declared exempt from the menu is not a finding',
    ['Manning-Pipe-Flow.php' => $calc], [], $prefixes, [],
    ['Manning-Pipe-Flow.php' => 'kept out of the menu on purpose'], []);

ecSelftestCase('a declared non-calculator page needs no prefix and no menu row',
    ['About.php' => $prose, 'Manning-Pipe-Flow.php' => $calc],
    ['Manning-Pipe-Flow.php' => $row], $prefixes, $nonCalc, [], []);

// ---- the EXTRACTORS, against real markup ----------------------------------------------------------
$menuSrc = <<<'PHP'
<a class="dropdown-item" href="Manning-Pipe-Flow.php" title="<?=$ec_lang['mpf_main_desc']?>"><?=$ec_lang['mpf_main_menu']?></a>
<a class="dropdown-item" href="Manning-Trap.php" title="<?=$ec_lang['mtc_main_desc']?>"><?=$ec_lang['mtc_menu']?></a>
<a class="navbar-brand" href="index.php"><?=$ec_lang['menu_brand']?></a>
<a href="/engcalcs/contact.php">Contact</a>
PHP;
$rows = ecMenuRows($menuSrc);
$extract = [
    // THE ONE THAT BROKE FIRST: a title whose PHP short echo ends in '>' must still be read.
    ['the title key survives the closing PHP tag inside the attribute',
        $rows['Manning-Pipe-Flow.php']['descKey'] ?? null, 'mpf_main_desc'],
    ['the link text key is read, and is not the title key',
        $rows['Manning-Pipe-Flow.php']['textKey'] ?? null, 'mpf_main_menu'],
    ['the legacy row reads its own two keys',
        $rows['Manning-Trap.php']['textKey'] ?? null, 'mtc_menu'],
    ['a row with no title has a null description rather than borrowing the next row\'s',
        array_key_exists('index.php', $rows) ? $rows['index.php']['descKey'] : 'MISSING', null],
    ['an absolute href is the parent site, not a page of ours',
        isset($rows['contact.php']) ? 'present' : 'absent', 'absent'],
    ['and the extractor found rows at all, so an empty menu cannot pass by knowing nothing',
        count($rows), 3],

    ['a page calling echoCalculatorForm() is a calculator',
        ecPageFacts("<?php echoHeader(); echoCalculatorForm(\$a);")['calculator'], true],
    ['a page that only calls echoHeader() is not',
        ecPageFacts("<?php echoHeader();")['calculator'], false],
    ['an endpoint calling neither is not even a page',
        ecPageFacts("<?php header('Location: /');")['page'], false],
    ['$html_desc is read off the assignment',
        ecPageFacts("<?php \$html_desc = \$ec_lang['mpf_main_desc'];")['descKey'], 'mpf_main_desc'],
    ['a literal $html_desc yields no key rather than a wrong one',
        ecPageFacts("<?php \$html_desc = 'Derivation of the orifice drain time equation.';")['descKey'], null],

    ['the prefix table parses',
        ecDocumentedPrefixes("## Variable Prefix Convention\n\n| Prefix | Calculator |\n|---|---|\n| `dw_`  | Darcy-Weisbach |\n| `mphl_`| Manning Pipe Head Loss |\n\n## Next")['mphl'] ?? null,
        'Manning Pipe Head Loss'],
    ['a prefix named outside that section is not a table row',
        isset(ecDocumentedPrefixes("## Variable Prefix Convention\n| `dw_` | Darcy-Weisbach |\n## Other\n| `xx_` | Not a calculator |")['xx']),
        false],
];
foreach ($extract as [$name, $got, $want]) {
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . var_export($want, true) . ', got ' . var_export($got, true) . "\n";
    } else {
        $ok++;
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\ncalculator_page_selftest: $fails failing case(s) of " . ($fails + $ok) . ".\n";
    echo "calculator_page_check.php can no longer see the defect named above, and it reports\n";
    echo "'Calculator wiring OK' either way. Fix the check, not this file.\n";
    exit(1);
}
echo "\ncalculator page selftest OK -- $ok case(s), both directions.\n";
