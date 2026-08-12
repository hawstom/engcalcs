<?php
/**
 * Self-test for the coverage declaration (ROADMAP Task 204).
 *
 * Runs against the REAL translation_coverage.json rather than a fixture, because the
 * failures worth catching are edits to that file -- a core language dropped, a calculator
 * prefix renamed, the identity floor quietly narrowed. A fixture would keep passing
 * through every one of them.
 *
 * Usage: php dev/scripts/coverage_selftest.php   (exit 0 = pass, 1 = fail)
 */

require_once __DIR__ . '/coverage.inc.php';

$cov = ecLoadCoverage();
$failures = [];

function check(string $what, bool $got, bool $want, array &$failures): void
{
    if ($got !== $want) {
        $failures[] = $what . ': expected ' . ($want ? 'IN SCOPE' : 'OUT OF SCOPE')
            . ', got ' . ($got ? 'IN SCOPE' : 'OUT OF SCOPE');
    }
}

// --- THE CROSS. Three yeses and one no; the fourth is what makes it a cross and not an
// intersection. If an edit ever turns the OR into an AND, these four catch it.
check('core calc x core lang (mpf/es)',        ecCoverageCellInScope('mpf', 'es', $cov), true,  $failures);
check('core calc x non-core lang (mpf/zh)',    ecCoverageCellInScope('mpf', 'zh', $cov), true,  $failures);
// bpn, not lpn: lpn became a CORE calculator on 2026-08-11 (Task 251) and so no longer has an
// out-of-scope cell to point at. bpn is its closest sibling -- same map/network family, same
// complexity class -- which keeps this example meaning what it always meant.
check('non-core calc x core lang (bpn/es)',    ecCoverageCellInScope('bpn', 'es', $cov), true,  $failures);
check('non-core calc x non-core lang (bpn/zh)', ecCoverageCellInScope('bpn', 'zh', $cov), false, $failures);
check('lpn is core now, so every language is in scope (lpn/zh)',
    ecCoverageCellInScope('lpn', 'zh', $cov), true, $failures);

// --- THE FLOOR. Identity strings are in scope in the one cell that is otherwise out,
// including the three calculators that predate the *_main_menu convention.
check('identity: lpn_main_menu in zh',  ecCoverageKeyInScope('lpn_main_menu', 'zh', $cov),  true, $failures);
check('identity: lpn_main_title in zh', ecCoverageKeyInScope('lpn_main_title', 'zh', $cov), true, $failures);
check('identity: lpn_main_desc in zh',  ecCoverageKeyInScope('lpn_main_desc', 'zh', $cov),  true, $failures);
check('identity: mi_menu in zh',        ecCoverageKeyInScope('mi_menu', 'zh', $cov),        true, $failures);

// --- NOT THE FLOOR. A "_menu" suffix rule used to promote body labels to the never-out-of-scope
// floor by accident. These are ordinary UI strings, and the check has to run on a NON-core
// calculator to mean anything -- on a core one they are in scope for a different reason and the
// suffix bug would hide behind that.
check('body: bpn_demand in zh',   ecCoverageKeyInScope('bpn_demand', 'zh', $cov),   false, $failures);
check('body: mi_station in zh',   ecCoverageKeyInScope('mi_station', 'zh', $cov),   false, $failures);

// --- CHROME is always in scope, and an UNKNOWN prefix is treated as chrome on purpose:
// the safe direction for something unclassified is to translate it.
check('chrome: nav/menu key in zh',   ecCoverageKeyInScope('menu_calculators', 'zh', $cov), true, $failures);
check('chrome: install_ key in zh',   ecCoverageKeyInScope('install_desktop_heading', 'zh', $cov), true, $failures);
check('unknown prefix defaults in',   ecCoverageKeyInScope('zzz_something', 'zh', $cov), true, $failures);

// --- THE TWO CONCEPTS MUST NOT MERGE. Task 204's whole point: an out-of-scope key must
// never be parked in the exempt list, which means "identical to English forever".
require_once __DIR__ . '/exempt_keys.inc.php';
$exempt = ecLoadExemptMap();
$leaked = [];
foreach (array_keys($exempt) as $key) {
    $parts = explode('_', $key, 2);
    $prefix = count($parts) === 2 ? $parts[0] : '';
    // An exempt key whose prefix is a NON-CORE calculator is the shape of the forbidden
    // shortcut: someone quieting an out-of-scope body by declaring it permanently correct.
    if ($prefix !== '' && ecCoverageIsCalculatorPrefix($prefix, $cov)
        && !in_array($prefix, $cov['core_calculators'], true)) {
        $leaked[$prefix] = ($leaked[$prefix] ?? 0) + 1;
    }
}
// This is a REPORT, not a failure: a non-core calculator can legitimately own exempt
// symbols and eponyms. It prints so an unexplained jump is visible at review time.
echo "Exempt keys under non-core calculator prefixes (expected: symbols/eponyms only):\n";
if (count($leaked) === 0) {
    echo "  none\n";
} else {
    ksort($leaked);
    foreach ($leaked as $prefix => $n) {
        echo "  {$prefix}: {$n}\n";
    }
}

echo "\n" . ecCoverageSummary($cov) . "\n\n";

if (count($failures) > 0) {
    fwrite(STDERR, "FAIL: " . count($failures) . " coverage assertion(s) failed:\n");
    foreach ($failures as $f) {
        fwrite(STDERR, "  - {$f}\n");
    }
    exit(1);
}

echo "PASS: all coverage assertions hold.\n";
exit(0);
