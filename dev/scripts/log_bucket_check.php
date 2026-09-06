<?php
/**
 * log_bucket_check.php -- every appended log row carries the consent bucket, last. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS (ROADMAP Task 322 half B, found by COUNTING rather than by re-reading).
 *
 * CLAUDE.md states the rule outright -- "a new log writer must call ecLogBucketSuffix() and append
 * it to the line" -- and nothing had ever held it. Six shipped files append log rows and all six
 * comply today, which is what makes this a ratchet rather than a repair; the seventh is the one
 * this is for.
 *
 * WHAT GOES WRONG, AND IT GOES WRONG IN A REPORT RATHER THAN ON A PAGE. Consented rows are
 * deduplicated and unmarked; everybody else's are marked `visit` and undeduplicated. The two
 * buckets count DIFFERENT THINGS -- one counts people, the other counts page loads -- and
 * CLAUDE.md's instruction is never to sum them. A row written without the suffix is therefore not
 * merely unlabelled: it silently joins the deduplicated people, so a new log writer inflates the
 * count of humans by its own traffic and nothing anywhere says so. `formmail.php` had exactly this
 * defect and its own comment records the symptom: a funnel with "a denominator in two units and a
 * numerator in neither".
 *
 * AND POSITION IS PART OF THE RULE, not tidiness. The logs are tab-separated and read positionally,
 * so a bucket written into the middle of a line shifts every column after it. `lib/config.inc.php`
 * says "always written, always last"; this asserts the last.
 *
 * WHAT IT READS. Shipped PHP only -- the root pages and `lib/` -- never `dev/scripts/`, which
 * writes files constantly and logs nothing. Two write shapes are in scope: `file_put_contents()`
 * with `FILE_APPEND`, which is what an append-only log row is, and `fwrite()`, which could be.
 * EXCLUSIONS ARE DECLARED WITH A REASON, never inferred, which is the same rule
 * `lib/ServiceWorker.lib.php` follows about its precache: a writer nobody has classified fails
 * until somebody says which kind it is, and that question is the whole point.
 *
 * Usage:
 *   php dev/scripts/log_bucket_check.php
 *
 * Exit 0 = every appended row carries the bucket last. Exit 1 = one does not, or a writer is
 * unclassified.
 */

/**
 * Writes that are NOT log rows, and why. A file here is still read for file_put_contents/
 * FILE_APPEND; only the named construct is exempt.
 */
function ecLogBucketExclusions(): array
{
    return [
        // A lock file, not a log: one JSON object, rewritten in place under an exclusive handle,
        // holding who currently has a project open. It has no rows, no columns and no report.
        'lpn-lock.php::fwrite' => 'writes the lock JSON, not a log row',
    ];
}

/**
 * Findings, pure so the selftest can drive it.
 *
 * @param array<string,string> $files  relative path => PHP source.
 * @param array<string,string> $declared  ecLogBucketExclusions().
 * @return array<int,string>
 */
function ecLogBucketFindings(array $files, array $declared): array
{
    $out = [];

    foreach ($files as $rel => $src) {
        // 1. Appending writes. The line argument is the second, and it is nearly always a
        //    variable, so it is resolved back to its assignment in the same file.
        if (preg_match_all('/file_put_contents\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]*)\)/', $src, $m, PREG_SET_ORDER)) {
            foreach ($m as $hit) {
                if (strpos($hit[3], 'FILE_APPEND') === false) continue;   // a rewrite, not a row
                $target = trim($hit[1]);
                $expr = ecLogBucketLineExpr($src, trim($hit[2]));
                if ($expr === null) {
                    $out[] = "$rel appends to $target from " . trim($hit[2]) . ', whose value this '
                        . 'check cannot resolve to an assignment in the same file. Build the line '
                        . 'in one statement so the bucket column is visible where the row is '
                        . 'written -- that visibility is the point, not the style.';
                    continue;
                }
                // One resolution hop for the variable form. Two writers assign the suffix to a
                // $bucket first, guarded on function_exists(), because they run where
                // lib/config.inc.php may not have been loaded -- so the call is a statement away
                // from the row it belongs to and a single-level scan reads them as bare.
                if (!ecLogBucketExprCarriesSuffix($src, $expr)) {
                    $out[] = "$rel appends a log row to $target without ecLogBucketSuffix(). An "
                        . 'unmarked row joins the CONSENTED bucket, which is deduplicated and '
                        . 'counts people; this writer\'s rows are page loads. The two must never '
                        . 'be summed, and without the suffix nothing downstream can tell them '
                        . 'apart. See lib/config.inc.php.';
                    continue;
                }
                if (!preg_match('/(ecLogBucketSuffix\s*\(\s*\)|\$\w*[Bb]ucket)\s*\.\s*[\'"]\\\\n[\'"]\s*$/', rtrim($expr))) {
                    $out[] = "$rel writes the bucket into $target somewhere other than the END of "
                        . 'the row. The logs are tab-separated and read positionally, so a column '
                        . 'inserted before the last one shifts every column after it. '
                        . 'lib/config.inc.php: always written, always last.';
                }
            }
        }

        // 2. fwrite() -- could be a row, could be anything. Classified, never guessed.
        if (preg_match('/\bfwrite\s*\(/', $src)) {
            $key = $rel . '::fwrite';
            if (!isset($declared[$key])) {
                $out[] = "$rel calls fwrite() and nothing says whether it writes a log row. "
                    . 'If it does, it needs ecLogBucketSuffix() last; if it does not, declare it '
                    . "in ecLogBucketExclusions() as '$key' with the reason. A writer nobody has "
                    . 'classified is the one that quietly starts counting page loads as people.';
            }
        }
    }

    // 3. A declaration that no longer describes anything is a guard aimed at nothing.
    foreach ($declared as $key => $why) {
        [$rel, $construct] = array_pad(explode('::', $key, 2), 2, '');
        if (!isset($files[$rel]) || !preg_match('/\b' . preg_quote($construct, '/') . '\s*\(/', $files[$rel])) {
            $out[] = "ecLogBucketExclusions() declares '$key', which is not in the tree any more. "
                . 'Remove it: a stale exemption is an exemption nobody re-reads, and the next '
                . 'writer added to that file inherits it.';
        }
        if (trim($why) === '') {
            $out[] = "the exclusion '$key' carries no reason. The reason is the whole exemption -- "
                . 'it is what the next reader checks against, and "not a log" is a claim.';
        }
    }

    return $out;
}

/**
 * Whether a line expression carries the bucket, following one hop through a local variable.
 */
function ecLogBucketExprCarriesSuffix(string $src, string $expr): bool
{
    if (strpos($expr, 'ecLogBucketSuffix') !== false) return true;
    if (preg_match_all('/\$\w+/', $expr, $vars)) {
        foreach (array_unique($vars[0]) as $var) {
            $inner = ecLogBucketLineExpr($src, $var);
            if ($inner !== null && strpos($inner, 'ecLogBucketSuffix') !== false) return true;
        }
    }
    return false;
}

/**
 * The expression a log line is built from: the argument itself when it is written inline, or the
 * right-hand side of the nearest preceding assignment to that variable.
 */
function ecLogBucketLineExpr(string $src, string $arg): ?string
{
    if (strpos($arg, '$') !== 0 || strpos($arg, '.') !== false) {
        return $arg;   // built inline at the call
    }
    $var = preg_quote($arg, '/');
    if (preg_match_all('/' . $var . '\s*=\s*(.*?);/s', $src, $m)) {
        return end($m[1]);   // the last assignment, which is the one that reaches the write
    }
    return null;
}

if (defined('LOG_BUCKET_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$files = [];
foreach (array_merge(glob($root . '/*.php') ?: [], glob($root . '/lib/*.php') ?: []) as $f) {
    $rel = basename(dirname($f)) === 'lib' ? 'lib/' . basename($f) : basename($f);
    $files[$rel] = (string) file_get_contents($f);
}

$problems = ecLogBucketFindings($files, ecLogBucketExclusions());

if ($problems) {
    echo 'Log bucket column: ' . count($problems) . " finding(s)\n\n";
    foreach ($problems as $p) { echo "  ! $p\n\n"; }
    echo "Consented rows are deduplicated and unmarked; everybody else's are marked and are page\n";
    echo "loads. They count different things and are never summed. ecLogBucketSuffix() in\n";
    echo "lib/config.inc.php is what keeps a report able to tell them apart.\n";
    exit(1);
}

$writers = 0;
foreach ($files as $src) {
    $writers += preg_match_all('/file_put_contents\s*\([^)]*FILE_APPEND/', $src);
}
echo "Log bucket column OK -- $writers appending writer(s) in shipped PHP, every one carrying\n";
echo 'ecLogBucketSuffix() last; ' . count(ecLogBucketExclusions()) . " declared non-log write(s).\n";
exit(0);
