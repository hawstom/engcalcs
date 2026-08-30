<?php
/**
 * check_table_parity_selftest.php — assert check_table_parity_check.php still reads both files the
 * way it claims to. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. This check's whole job is to compare two lists, so it fails silently in the one
 * way that matters: a parser that stops finding things reports two shorter lists that agree. If
 * ecRunChecks() stopped matching a run_check line, or ecCheckTableClaims() stopped finding the
 * table, the output would be "OK" -- the same word it prints when the files really are level.
 *
 * The fixtures therefore pin the SHAPES rather than the counts: a commented-out run_check is not a
 * check that runs; an inline `sh -c` check owns no script; the `+ selftest` idiom names a second
 * file; a markdown table under some other heading is not this table; and the prose paragraph
 * between the heading and the table is not a row.
 *
 *   php dev/scripts/check_table_parity_selftest.php
 */

define('CHECK_TABLE_PARITY_LIB_ONLY', true);
require __DIR__ . '/check_table_parity_check.php';

$fails = 0;
function pin(string $name, $got, $want): void
{
    global $fails;
    if ($got !== $want) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . json_encode($want) . "\n";
        echo '        got    ' . json_encode($got) . "\n";
        return;
    }
    echo "  ok   $name\n";
}

// ---- check_all.sh's side ---------------------------------------------------------------------
$sh = <<<'SH'
#!/bin/sh
run_check() { : ; }
# A comment that talks about run_check "not a real one" blocking php dev/scripts/nope.php
run_check "html balance (every page)"    blocking php dev/scripts/html_balance_check.php
run_check "lang markup matches English"  blocking php dev/scripts/lang_tag_parity_check.php --strict
run_check "php syntax (all .php)"        blocking sh -c 'find . -name "*.php" | xargs php -l'
run_check "lpn harnesses ($N)"           blocking sh dev/scripts/run_harnesses.sh
run_check "key hygiene"                  advisory php dev/scripts/key_hygiene_check.php --strict
#run_check "parked"                      blocking php dev/scripts/parked_check.php
SH;

$runs = ecRunChecks($sh);
pin('five run_check lines, and the commented-out one is not a check that runs', count($runs), 5);
pin('a label with a shell variable in it survives', $runs[3]['label'], 'lpn harnesses ($N)');
pin('a script argument does not become part of the name',
    $runs[1]['scripts'], ['lang_tag_parity_check.php']);
pin('an inline sh -c check owns no script, which is why the declaration list exists',
    $runs[2]['scripts'], []);
pin('a .sh runner is a script like any other', $runs[3]['scripts'], ['run_harnesses.sh']);
pin('advisory is carried, not flattened to blocking', $runs[4]['kind'], 'advisory');
// The function's guard is the LINE START, so a sentence naming run_check inside a comment cannot
// invent a check. This is the shape that would otherwise report a check nobody runs.
pin('run_check mentioned inside a comment is not a run_check line',
    array_values(array_filter($runs, fn($r) => in_array('nope.php', $r['scripts'], true))), []);

// ---- CLAUDE.md's side ------------------------------------------------------------------------
$md = <<<'MD'
# A file

## Some other section

| Prefix | Calculator |
|--------|-----------|
| `mpf_` | Manning Pipe Flow, and `not_a_check.php` is not in the checks table |

## Automated checks — `sh dev/scripts/check_all.sh`

Seconds, free, and the first thing to reach for. This paragraph is not a row.

| Check | Guards |
|---|---|
| php + js syntax | Every `.php` and every `js/*.js` |
| `html_balance_check.php` | Every page produces well-formed HTML |
| `page_meta_check.php` + selftest | Every page sets `$html_desc` |
| `lang_tag_parity_check.php --strict` | Markup matches English |
| *advisory:* `key_hygiene_check.php`, `size_budget_check.php` | Judgement calls |

**A paragraph after the table**, naming `never_run_check.php`, is not a row either.
MD;

$claims = ecCheckTableClaims($md);
pin('five rows, header and separator excluded', count($claims['cells']), 5);
pin('the scripts, plus the one the selftest idiom names', $claims['scripts'], [
    'html_balance_check.php', 'page_meta_check.php', 'page_meta_selftest.php',
    'lang_tag_parity_check.php', 'key_hygiene_check.php', 'size_budget_check.php',
]);
pin('`x_check.php` + selftest claims x_selftest.php', $claims['derived'], ['page_meta_selftest.php']);
pin('a table under another heading is not this table',
    in_array('not_a_check.php', $claims['scripts'], true), false);
pin('prose after the table is not a row',
    in_array('never_run_check.php', $claims['scripts'], true), false);
pin('a syntax row that names no script still counts as a row', $claims['cells'][0], 'php + js syntax');

// The idiom only works on `<name>_check.php`. Anything else is REPORTED rather than guessed at,
// because a guessed filename would be reported as missing from check_all.sh and send the reader
// looking for a file nobody ever meant to exist.
$odd = ecCheckTableClaims("## Automated checks\n\n| Check | Guards |\n|---|---|\n"
    . "| `run_harnesses.sh` + selftest | The harnesses |\n");
pin('a + selftest on a name it cannot derive from is reported, not guessed',
    $odd['undeducible'], ['run_harnesses.sh']);

// ---- and the ends must meet ------------------------------------------------------------------
// A parser that finds nothing reports two empty lists that agree perfectly, which is this check's
// one silent failure. The live files must keep yielding both.
$root = dirname(__DIR__, 2);
$liveRuns = ecRunChecks((string) file_get_contents($root . '/dev/scripts/check_all.sh'));
$liveClaims = ecCheckTableClaims((string) file_get_contents($root . '/CLAUDE.md'));
pin('the live check_all.sh still yields run_check lines (>20)', count($liveRuns) > 20, true);
pin('the live CLAUDE.md still yields table rows (>20)', count($liveClaims['cells']) > 20, true);

if ($fails) {
    echo "\n$fails fixture(s) failed. check_table_parity_check.php's reading of one of the two\n";
    echo "files has moved. A comparison of two lists fails SILENTLY when a parser goes blind:\n";
    echo "two shorter lists agree, and the check prints OK.\n";
    exit(1);
}
echo "\nCheck-table parity selftest OK -- 16 fixtures over both parsers and both live files.\n";
exit(0);
