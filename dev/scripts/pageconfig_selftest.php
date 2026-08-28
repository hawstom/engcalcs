<?php
/**
 * pageconfig_selftest.php — assert that pageconfig_check.php still sees a read through an ALIAS,
 * and still ignores the shapes that are not one. BLOCKING.
 *
 * WHY THIS EXISTS, AND IT IS NOT THE USUAL ARGUMENT. The usual one — a check that finds nothing
 * looks the same whether it works or has gone blind — applies here too. But this one has a
 * documented instance: `pageconfig_check.php` reported OK for months while `lpn_labels_col_drop`
 * was translated into 26 languages and wired into nothing, because the check matched only the
 * literal `pageConfig.<key>` and `js/looped-network.js` reads every one of its 838 strings through
 * `var pc = EngCalcs.pageConfig || {}`. **The biggest page in the suite was the one page the check
 * could not see, and its report said OK.** Fixture 1 below is that defect, and it must keep failing.
 *
 * THE OTHER DIRECTION IS WHERE THE DANGER IS NOW. The check BLOCKS, so a false positive stops a
 * commit — and the alias rule is a heuristic over source text, which is exactly the sort of thing
 * that starts matching a DOM property on a Tuesday. Every shape the check must NOT take for a key
 * is pinned here, including the one a first draft got wrong: `el.textContent = EngCalcs.pageConfig
 * .dw_regime` is a READ of one key, and reading its left-hand side as an alias named `textContent`
 * would have made every `.textContent` in the file a missing lang key.
 *
 *   php dev/scripts/pageconfig_selftest.php
 *
 * Exit 0 = every fixture behaves. Exit 1 = the check's reach moved and somebody must say so.
 */

define('PAGECONFIG_LIB_ONLY', true);
require __DIR__ . '/pageconfig_check.php';

$cases = [
    // ---- what it MUST find -------------------------------------------------------------------
    [
        'the defect this check missed for months: a read through the `pc` alias',
        "var pc = EngCalcs.pageConfig || {};\nth.textContent = pc.lpn_labels_col_drop;\n",
        ['lpn_labels_col_drop'], [],
    ],
    [
        'the literal form, which it always found',
        "el.textContent = EngCalcs.pageConfig.mpf_flow;\n",
        ['mpf_flow'], [],
    ],
    [
        'an alias declared in a var LIST, ending in a comma',
        "var a = 1,\n\tcfg = EngCalcs.pageConfig,\n\tb = 2;\nx(cfg.ip_head);\n",
        ['ip_head'], [],
    ],
    [
        'an alias assigned with a plain semicolon',
        "var q;\nq = EngCalcs.pageConfig;\ny(q.cs_seepage_rate);\n",
        ['cs_seepage_rate'], [],
    ],
    [
        'several aliases in one file, each carrying its own reads',
        "var pc = EngCalcs.pageConfig || {};\nvar pcX = EngCalcs.pageConfig || {};\n" .
        "a(pc.lpn_file_new); b(pcX.lpn_file_open);\n",
        ['lpn_file_new', 'lpn_file_open'], [],
    ],

    // ---- what it must NOT take for a key ------------------------------------------------------
    [
        'a READ of one key is not an alias declaration -- the shape a first draft got wrong',
        "el.textContent = EngCalcs.pageConfig.dw_regime;\nother.textContent = 'x';\n",
        ['dw_regime'], ['textContent'],
    ],
    [
        'an alias\'s ordinary properties are invisible, because a key has an underscore',
        "var pc = EngCalcs.pageConfig || {};\nif (pc.length) { z(pc.foo); w(pc.someThing); }\n",
        [], ['length', 'foo', 'someThing'],
    ],
    [
        'a name that is NOT an alias carries nothing, however key-shaped its properties look',
        "var opts = { lpn_not_a_key: 1 };\nz(opts.lpn_not_a_key);\n",
        [], ['lpn_not_a_key'],
    ],
    [
        'a camelCase property on an alias is not a key: every declared key is lower_snake',
        "var pc = EngCalcs.pageConfig || {};\nz(pc.lpn_Field_Elev); z(pc.lpnFieldElev);\n",
        [], ['lpn_Field_Elev', 'lpnFieldElev'],
    ],
];

$fails = 0;
foreach ($cases as [$name, $src, $must, $mustNot]) {
    $got = ecPageConfigReads($src);
    $missing = array_diff($must, $got);
    $extra   = array_intersect($mustNot, $got);
    if ($missing || $extra) {
        $fails++;
        echo "  FAIL $name\n";
        if ($missing) echo "        did not find: " . implode(', ', $missing) . "\n";
        if ($extra)   echo "        wrongly found: " . implode(', ', $extra) . "\n";
        echo "        got: " . (count($got) ? implode(', ', $got) : '(nothing)') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. pageconfig_check.php's reach has moved.\n";
    echo "If that was deliberate, change the fixture and say in its label what the check now does.\n";
    echo "If it was not, the bridge is unguarded on the biggest page in the suite again.\n";
    exit(1);
}
echo "\npageConfig selftest OK -- " . count($cases) . " fixtures, both directions.\n";
exit(0);
