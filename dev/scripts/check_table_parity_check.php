<?php
/**
 * check_table_parity_check.php — CLAUDE.md's "Automated checks" table and check_all.sh name the
 * same set of checks. BLOCKING (pass --advisory to demote it).
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. check_all.sh is what RUNS; the table in CLAUDE.md is what everybody READS, and
 * nothing has ever tied the two together. Both drift, in both directions, and each direction fails
 * differently:
 *
 *   - **A check that runs and is not in the table** is invisible. Nobody knows the guard exists, so
 *     somebody eventually writes the rule again as prose, or -- worse -- proposes building the
 *     check that is already there. This is the common direction: a check is added under pressure,
 *     the run_check line goes in, and CLAUDE.md is a separate file nobody has open.
 *   - **A table row for a check nothing runs** is the more expensive one, because it reads as a
 *     guarantee. It is the same shape as the four false claims public_claim_check.php exists for:
 *     a sentence that was true when it was written and is a lie now, with nothing to notice.
 *
 * The survey (dev/enforceable-rules-survey.md, row 5) rated this "no false positives possible, once
 * the table is brought level", and that qualifier is the whole cost of the row.
 *
 * IT MATCHES ON SCRIPT FILENAMES, NOT ON LABELS, and that is a deliberate choice rather than a
 * convenience. The two files describe the same check in different registers: check_all.sh's label
 * is an imperative fragment for a terminal ("lang keys resolve"), the table's cell is the script
 * with the rule beside it. Requiring those strings to match would mean rewriting both files to
 * satisfy the check, and the first person who wanted a clearer label would have to edit CLAUDE.md
 * to get it. A filename is the one thing both files genuinely agree about.
 *
 * THE THREE CHECKS THAT RUN NO SCRIPT are the syntax ones -- php, js and shell, each an inline
 * `sh -c` in check_all.sh with no file of its own. They cannot be matched by filename, so they are
 * DECLARED below against a phrase their table row must contain. A declaration that matches no row
 * is itself a finding, so the mapping cannot rot into a claim about a row that was deleted.
 *
 * Usage:
 *   php dev/scripts/check_table_parity_check.php
 *   php dev/scripts/check_table_parity_check.php --advisory   # report, always exit 0
 *
 * Exit 0 = the two files name the same checks. Exit 1 = they do not, naming each gap and the
 * exact line or row that closes it.
 */

/**
 * check_all.sh's run_check lines. Pure, for the selftest.
 *
 * @param string $sh Shell source.
 * @return array<int,array{label:string,kind:string,scripts:array<int,string>}>
 */
function ecRunChecks(string $sh): array
{
    $out = [];
    foreach (explode("\n", $sh) as $line) {
        $trimmed = ltrim($line);
        // A commented-out run_check is not a check that runs -- and a check parked behind a `#`
        // is exactly the kind of quiet removal this pair of files should disagree about loudly.
        if (strpos($trimmed, 'run_check') !== 0) {
            continue;
        }
        if (!preg_match('/^run_check\s+"([^"]*)"\s+(blocking|advisory)\s+(.*)$/', $trimmed, $m)) {
            continue;
        }
        preg_match_all('#dev/scripts/([A-Za-z0-9_.-]+\.(?:php|sh))#', $m[3], $s);
        $out[] = ['label' => $m[1], 'kind' => $m[2], 'scripts' => array_values(array_unique($s[1]))];
    }
    return $out;
}

/**
 * The script names the CLAUDE.md check table claims, and the raw first cell of every row.
 *
 * The table's own idiom is `foo_check.php` + selftest, written that way because the selftest is not
 * a separate rule and a row of its own would say nothing. So the derived name counts as claimed --
 * which is also why a `+ selftest` on a row whose script is not `*_check.php` is reported rather
 * than guessed at.
 *
 * @param string $md CLAUDE.md source.
 * @return array{scripts:array<int,string>,cells:array<int,string>,derived:array<int,string>,undeducible:array<int,string>}
 */
function ecCheckTableClaims(string $md): array
{
    $lines = explode("\n", $md);
    $inSection = false;
    $started = false;
    $cells = [];
    foreach ($lines as $line) {
        if (preg_match('/^#{1,6}\s+Automated checks/i', $line)) {
            $inSection = true;
            continue;
        }
        if (!$inSection) {
            continue;
        }
        if ($started && (strlen(trim($line)) === 0 || $line[0] !== '|')) {
            break;                       // the table ended; anything after it is prose
        }
        if (strlen($line) === 0 || $line[0] !== '|') {
            continue;                    // the paragraph between the heading and the table
        }
        $started = true;
        if (preg_match('/^\|[\s:|-]+\|$/', $line)) {
            continue;                    // the |---|---| separator
        }
        $parts = explode('|', $line);
        $cell = isset($parts[1]) ? trim($parts[1]) : '';
        if ($cell === '' || strcasecmp($cell, 'Check') === 0) {
            continue;                    // the header row
        }
        $cells[] = $cell;
    }

    $scripts = [];
    $derived = [];
    $undeducible = [];
    foreach ($cells as $cell) {
        preg_match_all('#`([^`]*)`#', $cell, $m);
        $named = [];
        foreach ($m[1] as $tick) {
            if (preg_match_all('#\b([A-Za-z0-9_.-]+\.(?:php|sh))\b#', $tick, $f)) {
                foreach ($f[1] as $file) { $named[] = $file; $scripts[] = $file; }
            }
        }
        if (stripos($cell, 'selftest') !== false) {
            foreach ($named as $file) {
                if (substr($file, -10) === '_check.php') {
                    $derived[] = substr($file, 0, -10) . '_selftest.php';
                    $scripts[] = substr($file, 0, -10) . '_selftest.php';
                } elseif (substr($file, -13) !== '_selftest.php') {
                    $undeducible[] = $file;
                }
            }
        }
    }

    return ['scripts' => array_values(array_unique($scripts)), 'cells' => $cells,
            'derived' => array_values(array_unique($derived)), 'undeducible' => $undeducible];
}

/**
 * The three inline syntax checks, which own no script file. Each maps a check_all.sh label to a
 * phrase that must appear in some row of the table. Keep the phrase short: it is here to survive
 * a rewording of the row, not to pin its wording.
 */
const EC_SCRIPTLESS_CHECKS = [
    'php syntax (all .php)'      => 'php',
    'js syntax (all shipped js)' => 'js',
    // Named separately rather than folded into one 'syntax' phrase, because the row started life
    // as "php + js syntax" and the shell pass was added under it without the title moving. A
    // phrase of 'syntax' would have matched that row and reported the table as level while it
    // named two of the three languages actually checked.
    'shell syntax (all .sh)'     => 'shell',
];

if (defined('CHECK_TABLE_PARITY_LIB_ONLY')) {
    return;
}

$advisory = in_array('--advisory', array_slice($_SERVER['argv'], 1), true);
$root = dirname(__DIR__, 2);
$sh = (string) file_get_contents($root . '/dev/scripts/check_all.sh');
$md = (string) file_get_contents($root . '/CLAUDE.md');

$runs = ecRunChecks($sh);
$claims = ecCheckTableClaims($md);

if (!$runs) {
    fwrite(STDERR, "Could not read a single run_check line out of dev/scripts/check_all.sh.\n");
    exit(2);
}
if (!$claims['cells']) {
    fwrite(STDERR, "Could not find the Automated checks table in CLAUDE.md. It is the table whose\n"
        . "first column names each check; this reads it under the '## Automated checks' heading.\n");
    exit(2);
}

$runScripts = [];
$scriptless = [];
foreach ($runs as $r) {
    if ($r['scripts']) {
        foreach ($r['scripts'] as $s) { $runScripts[$s] = $r['label']; }
    } else {
        $scriptless[] = $r['label'];
    }
}
$claimed = array_flip($claims['scripts']);

// 1. Runs, and the table does not say so.
$missingFromTable = [];
foreach ($runScripts as $script => $label) {
    if (!isset($claimed[$script])) { $missingFromTable[$script] = $label; }
}

// 2. The table says so, and nothing runs it.
$missingFromRunner = [];
foreach ($claims['scripts'] as $script) {
    if (!isset($runScripts[$script])) { $missingFromRunner[] = $script; }
}

// 3. The table names a file that is not there at all.
$absent = [];
foreach ($claims['scripts'] as $script) {
    if (!file_exists($root . '/dev/scripts/' . $script)) { $absent[] = $script; }
}

// 4. A check that runs no script and has no declaration, and a declaration matching no row.
$undeclared = [];
foreach ($scriptless as $label) {
    if (!isset(EC_SCRIPTLESS_CHECKS[$label])) { $undeclared[] = $label; }
}
$deadDeclarations = [];
foreach (EC_SCRIPTLESS_CHECKS as $label => $phrase) {
    $found = false;
    foreach ($claims['cells'] as $cell) {
        if (stripos($cell, $phrase) !== false) { $found = true; break; }
    }
    if (!$found) { $deadDeclarations[$label] = $phrase; }
}

$problems = count($missingFromTable) + count($missingFromRunner) + count($absent)
    + count($undeclared) + count($deadDeclarations) + count($claims['undeducible']);

if ($missingFromTable) {
    echo 'Checks that RUN and are not in the CLAUDE.md table: ' . count($missingFromTable) . "\n\n";
    foreach ($missingFromTable as $script => $label) {
        echo "  $script   (run as \"$label\")\n";
    }
    echo "\nA guard nobody knows about gets written a second time as prose, or proposed as new work.\n";
    echo "Add a row to the table under '## Automated checks': the script in backticks in the first\n";
    echo "column, and in the second the RULE it guards -- not what it does, which the name already\n";
    echo "says. A row whose script has a selftest beside it is written `x_check.php` + selftest.\n\n";
}

if ($missingFromRunner) {
    echo 'Rows in the CLAUDE.md table that nothing in check_all.sh runs: '
        . count($missingFromRunner) . "\n\n";
    foreach ($missingFromRunner as $script) { echo "  $script\n"; }
    echo "\nThis is the expensive direction: the table reads as a guarantee, so a row for a check\n";
    echo "nobody runs is a sentence that was true when it was written and is not now. Either add\n";
    echo "the run_check line to dev/scripts/check_all.sh, or delete the row.\n\n";
}

if ($absent) {
    echo "The table names a script that does not exist in dev/scripts/: " . implode(', ', $absent) . "\n";
    echo "Fix the name, or remove the row.\n\n";
}

if ($undeclared) {
    echo "check_all.sh runs a check with no script file and no declaration here:\n";
    foreach ($undeclared as $label) { echo "  \"$label\"\n"; }
    echo "\nNothing can match it to a table row by filename. Add it to EC_SCRIPTLESS_CHECKS at the\n";
    echo "top of this file with a phrase its table row contains -- or give the check a script.\n\n";
}

if ($deadDeclarations) {
    echo "A declaration in EC_SCRIPTLESS_CHECKS matches no row of the table:\n";
    foreach ($deadDeclarations as $label => $phrase) { echo "  \"$label\" wants a row saying \"$phrase\"\n"; }
    echo "\nEither the row was deleted, or it was reworded past the phrase. Restore the row, or\n";
    echo "update the phrase here.\n\n";
}

if ($claims['undeducible']) {
    echo "A table row says '+ selftest' beside a script this cannot derive a selftest name from: "
        . implode(', ', $claims['undeducible']) . "\n";
    echo "The idiom works on `<name>_check.php`. Name the selftest file in the row instead.\n\n";
}

if ($problems) {
    echo "check_all.sh is what runs; the CLAUDE.md table is what everybody reads. They are allowed\n";
    echo "to word a check differently -- this matches on FILENAMES, not labels -- but they must\n";
    echo "name the same set.\n";
    if ($advisory) {
        echo "\n(--advisory: reporting only, exit 0.)\n";
        exit(0);
    }
    exit(1);
}

echo 'Check table parity OK -- ' . count($runs) . ' run_check lines, '
    . count($runScripts) . ' scripts, ' . count($claims['cells']) . " table rows.\n";
echo '(' . count($scriptless) . " declared checks run no script of their own: the syntax passes.)\n";
exit(0);
