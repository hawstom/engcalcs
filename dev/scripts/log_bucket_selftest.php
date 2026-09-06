<?php
/**
 * log_bucket_selftest.php -- assert log_bucket_check.php still sees a log row written without its
 * consent bucket, and still lets the six real writers through. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. The check passes by finding nothing, which is the shape that has already died
 * of success in this repository once (js_fallback_string_selftest.php, the same week). It reads
 * SOURCE with regular expressions and resolves a variable back to its assignment, so it has two
 * specific ways to go quietly blind: a write shape it does not recognise, and a resolution that
 * fails open. Both are fixtures below, and the second is the dangerous one -- an unresolvable
 * expression must be a FINDING, never a pass.
 *
 * The defect it ultimately guards is invisible on every page: an unmarked row joins the
 * deduplicated bucket and inflates the count of PEOPLE by one writer's page loads, in a report
 * nobody re-derives.
 *
 *   php dev/scripts/log_bucket_selftest.php
 */

define('LOG_BUCKET_LIB_ONLY', true);
require __DIR__ . '/log_bucket_check.php';

$good = "<?php\n\$line = gmdate('c') . \"\\t\" . \$page . ecLogBucketSuffix() . \"\\n\";\n"
      . "@file_put_contents(CALC_USAGE_LOG, \$line, FILE_APPEND | LOCK_EX);\n";
$viaBucket = "<?php\n\$bucket = function_exists('ecLogBucketSuffix') ? ecLogBucketSuffix() : '';\n"
      . "\$line = gmdate('c') . \"\\t\" . \$page . \$bucket . \"\\n\";\n"
      . "@file_put_contents(CONTACT_SEND_LOG, \$line, FILE_APPEND | LOCK_EX);\n";
$noBucket = "<?php\n\$line = gmdate('c') . \"\\t\" . \$page . \"\\n\";\n"
      . "@file_put_contents(NEW_LOG, \$line, FILE_APPEND | LOCK_EX);\n";
$midLine = "<?php\n\$line = gmdate('c') . ecLogBucketSuffix() . \"\\t\" . \$page . \"\\n\";\n"
      . "@file_put_contents(NEW_LOG, \$line, FILE_APPEND | LOCK_EX);\n";
$rewrite = "<?php\n@file_put_contents(CACHE_FILE, json_encode(\$state));\n";
$unresolvable = "<?php\n@file_put_contents(NEW_LOG, \$rows[\$i], FILE_APPEND | LOCK_EX);\n";
$fwriteUndeclared = "<?php\n\$fh = fopen(\$p, 'c+');\nfwrite(\$fh, json_encode(\$write));\n";

$lock = ['lpn-lock.php::fwrite' => 'writes the lock JSON, not a log row'];

$cases = [
    // ---- what it MUST find ---------------------------------------------------------------------
    ['THE DEFECT: a new log writer with no bucket, whose rows then count as deduplicated people',
        [['new-log.php' => $noBucket], []], true],
    ['THE BUCKET IN THE MIDDLE. The logs are read positionally, so this shifts every column after it',
        [['new-log.php' => $midLine], []], true],
    ['a line expression that cannot be resolved to an assignment -- which must FAIL, not pass quietly',
        [['new-log.php' => $unresolvable], []], true],
    ['an undeclared fwrite(): could be a row, could be a lock file, and nobody has said which',
        [['lpn-lock.php' => $fwriteUndeclared], []], true],
    ['an exclusion naming a file that is no longer in the tree, so the next writer there inherits it',
        [['new-log.php' => $good], $lock], true],
    ['an exclusion with no reason: "not a log" is a claim, and the reason is the whole exemption',
        [['lpn-lock.php' => $fwriteUndeclared], ['lpn-lock.php::fwrite' => '  ']], true],

    // ---- what it must NOT report ----------------------------------------------------------------
    ['the ordinary writer: the suffix called inline, last, before the newline',
        [['log-calc-event.php' => $good], []], false],
    ['THE $bucket FORM. Two shipped writers guard the call on function_exists() and assign it first, so the call is a statement away from its row',
        [['formmail.php' => $viaBucket], []], false],
    ['a file_put_contents() with no FILE_APPEND -- a rewrite is not a log row',
        [['cache.php' => $rewrite], []], false],
    ['the declared lock file, which has no rows, no columns and no report',
        [['lpn-lock.php' => $fwriteUndeclared], $lock], false],
];

$fails = 0;
foreach ($cases as [$name, $args, $wantFinding]) {
    $got = ecLogBucketFindings(...$args);
    $hit = $got !== [];
    if ($hit !== $wantFinding) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . ($wantFinding ? 'a finding' : 'no finding') . ', got '
            . ($hit ? count($got) . ': ' . $got[0] : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. log_bucket_check.php's reach has moved.\n";
    echo "A false negative here puts unmarked rows into the deduplicated bucket, where they are\n";
    echo "counted as people. Nothing on any page shows it and no visitor can report it.\n";
    exit(1);
}
echo "\nLog bucket selftest OK -- " . count($cases) . " fixtures, both directions.\n";
