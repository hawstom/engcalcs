<?php
/**
 * lang_key_resolve_selftest.php — assert that lang_key_resolve_check.php still sees the defect,
 * and still ignores the four shapes that are not one. BLOCKING.
 *
 * WHY THIS EXISTS. The check finds nothing today, and a check that finds nothing looks exactly the
 * same whether it is working or has gone blind — a mistyped variable name, a tokenizer constant
 * that moved, a `continue` one level too high, and it silently passes forever. That is the failure
 * `stale_claim_selftest.php` was written for, and it applies with more force here: this one BLOCKS
 * commits, so a blind version is not merely useless, it is a green light nobody can question.
 *
 * The fixtures are the contract in both directions. The MISSED shapes matter as much as the found
 * one: every exclusion in the check buys a shorter list by giving up coverage, and each is pinned
 * here so that widening one (say, falling back to a regex) fails loudly instead of producing false
 * positives on a Tuesday.
 *
 *   php dev/scripts/lang_key_resolve_selftest.php
 */

define('LANG_KEY_RESOLVE_LIB_ONLY', true);
require __DIR__ . '/lang_key_resolve_check.php';

$defined = ['mpf_flow' => 'Flow', 'u_ft' => 'ft', 'u_m' => 'm'];

// [expected missing keys, source, what shape this is]
$fixtures = [
    [['mpf_flowz'], '<?php echo $ec_lang[\'mpf_flowz\'];',
        'THE DEFECT: a misspelled key, which renders as nothing in all 27 languages'],
    [['mpf_flowz'], '<?php echo $ec_lang["mpf_flowz"];',
        'the same defect written with double quotes'],
    [['lpn_gone'], '<?php $s = "head: {$ec_lang[\'lpn_gone\']} end";',
        'interpolated inside a double-quoted string — a real read, and it must still be seen'],
    [[], '<?php echo $ec_lang[\'mpf_flow\'];',
        'a key that exists'],
    [[], '<?php echo $ec_lang[\'u_\' . $unit];',
        'a CONCATENATED key: the family is assembled at runtime and no static answer exists'],
    [[], '<?php foreach ($keys as $k) { echo $ec_lang[$k]; }',
        'a VARIABLE key: same reason'],
    [[], '<?php // $ec_lang[\'lpn_retired_key\'] used to live here' . "\n",
        'a key named in a COMMENT — the shape a grep reports and a token stream does not'],
    [[], '<?php $doc = \'call $ec_lang[\\\'lpn_retired_key\\\'] to read it\';',
        'a key named inside a single-quoted string, i.e. prose, not code'],
    [['a_missing', 'b_missing'], '<?php echo $ec_lang[\'a_missing\'] . $ec_lang[\'b_missing\'];',
        'two on one line: the scan must not stop at the first'],
];

$fail = 0;
foreach ($fixtures as [$want, $src, $shape]) {
    $got = array_column(ecMissingKeyReads($src, $defined), 0);
    if ($got === $want) {
        continue;
    }
    $fail++;
    printf("FAIL  expected [%s] got [%s]  (%s)\n      %s\n\n",
        implode(',', $want), implode(',', $got), $shape, str_replace("\n", ' ', $src));
}

// The "did you mean" is part of the message a person acts on, so it is pinned too: a suggestion
// that fires on anything is worse than none, because it sends the reader to the wrong key.
$near = [
    ['mpf_flowz', 'mpf_flow', 'one character off — suggest it'],
    ['zzzzzzzzzz', '', 'nothing like any key — suggest nothing'],
];
foreach ($near as [$typo, $want, $shape]) {
    $got = ecNearestKey($typo, array_keys($defined));
    if ($got === $want) {
        continue;
    }
    $fail++;
    printf("FAIL  nearest('%s') expected '%s' got '%s'  (%s)\n\n", $typo, $want, $got, $shape);
}

printf("%s: %d fixtures, %d mismatched.\n", $fail ? 'FAIL' : 'PASS', count($fixtures) + count($near), $fail);
if ($fail) {
    echo "lang_key_resolve_check.php no longer sees what it claims to see. Fix the check, not the\n";
    echo "fixture — a fixture edited to match a broken check is how a blocking check goes blind.\n";
}
exit($fail ? 1 : 0);
