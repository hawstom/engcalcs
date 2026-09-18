<?php
/**
 * sibling_exposure_check.php -- ADVISORY. Are the two sibling websites still guarded against the
 * thing that has now happened twice?
 *
 * WHY. `docroot_exposure_check.php` holds THIS tree: every directory is declared web-served or
 * blocked, and the blocks are still there. It was written on 2026-09-16 because
 * https://hawsedc.com/engcalcs/.claude/settings.json answered 200 with the agent definitions and
 * the permission allow-list. Two days later the same shape turned up next door and worse:
 *
 *     https://librewaternet.org/tools/                   200, a full directory index
 *     https://librewaternet.org/tools/build-chrome.php   200, EXECUTED
 *     https://librewaternet.org/tools/build-features.php 500, EXECUTED and fatal
 *     https://librewaternet.org/tools/build_claims.py    200, source downloadable
 *
 * Remote execution of that site's own build scripts over HTTP. **BOTH TIMES A PERSON LOOKING FROM
 * OUTSIDE FOUND IT WHILE EVERY CHECK INSIDE THE REPOSITORY PASSED** -- the second time because Tom
 * noticed an untracked `tools/error_log` in `git status`. Tom, asked whether to extend the guard:
 * *"Extend check: Yes."*
 *
 * WHERE THE REAL CHECK LIVES, AND WHY NOT HERE. Each sibling carries its own
 * `tools/exposure-check.sh`, its own `tools/docroot-declarations.txt` and its own
 * `tools/exposure-selftest.sh`, and its own `check.sh` runs them -- because the declaration is a
 * statement about THAT site's document root, its pre-push hook is what stops a bad push, and its
 * contributors read that repository and not this one. A guard living only over here would be a
 * guard that does not run when it matters.
 *
 * SO WHAT IS THIS FOR. It notices when a sibling has gone UNGUARDED: the script deleted, the
 * declaration gone, `check.sh` no longer calling it, or the two copies drifted apart. That is a
 * failure mode the sibling's own green build cannot report, because a check that is not run reports
 * nothing at all.
 *
 * WHY IT IS ADVISORY, AND WHY IT PRINTS THAT IT CHECKED NOTHING. It reads repositories OUTSIDE this
 * tree, which a cold checkout, a CI runner and Tom's other machines may not have. A blocking check
 * that cannot run is a check somebody deletes. So it follows what `screenshot_publish_check.php`
 * and `host_script_parity_check.php` already do for the same reason: when it cannot reach a sibling
 * it SAYS SO, in words, rather than passing in silence. A silent pass from a check that ran nothing
 * is the exact shape that reads as coverage and is not.
 *
 * It reads DECLARATIONS, never the live site -- as its sibling script does, and for the same
 * reasons. What proves Apache obeys them is the account's own daily page check on the host.
 *
 * Usage:  php dev/scripts/sibling_exposure_check.php [--base=DIR]
 *         Always exits 0. It is advisory.
 */

$base = getenv('HOME') . '/webdev';
foreach ($argv as $a) { if (strpos($a, '--base=') === 0) { $base = substr($a, 7); } }

// The sibling sites this project pushes as part of finishing work (Tom, 2026-09-11).
$SIBLINGS = array(
    'librewaternet.org' => 'the landing site; shares this account and the /app mount',
    'not-epanet.org'    => 'retired, 301s to librewaternet.org -- but a redirect is not a denial',
);

echo "Sibling docroot exposure (advisory)\n";

$reached = 0; $findings = array(); $hashes = array();
foreach ($SIBLINGS as $name => $why) {
    $dir = rtrim($base, '/') . '/' . $name;
    if (!is_dir($dir)) {
        printf("  %-20s CHECKED NOTHING -- not present at %s\n", $name, $dir);
        continue;
    }
    $reached++;
    $script = $dir . '/tools/exposure-check.sh';
    $decl   = $dir . '/tools/docroot-declarations.txt';
    $checks = $dir . '/check.sh';

    if (!is_file($script) || !is_file($decl)) {
        printf("  %-20s UNGUARDED\n", $name);
        $findings[] = "$name has no tools/exposure-check.sh or no tools/docroot-declarations.txt.\n"
            . "    Its document root is that repository, so every tracked directory is reachable\n"
            . "    over HTTP and nothing says which are meant to be. That is the state that put\n"
            . "    librewaternet.org/tools/build-chrome.php on the open web, executable.\n"
            . "    FIX: copy tools/exposure-check.sh and tools/exposure-selftest.sh from the other\n"
            . "    sibling, write that site's own tools/docroot-declarations.txt, and call both from\n"
            . "    its check.sh.";
        continue;
    }
    $hashes[$name] = md5_file($script);

    // A guard nothing runs is a guard that does not exist. The sibling's check.sh is what its
    // pre-push hook runs, so this is the leg that decides whether a bad push is actually refused.
    $wired = is_file($checks) && strpos(file_get_contents($checks), 'tools/exposure-check.sh') !== false;
    if (!$wired) {
        $findings[] = "$name carries tools/exposure-check.sh but its check.sh never calls it.\n"
            . "    Its pre-push hook runs check.sh, so nothing refuses a push that exposes a\n"
            . "    directory. FIX: add `sh tools/exposure-check.sh || bad ...` to that check.sh.";
    }

    $out = array(); $rc = 0;
    exec('cd ' . escapeshellarg($dir) . ' && sh ' . escapeshellarg($script)
         . ' --root=' . escapeshellarg($dir) . ' 2>&1', $out, $rc);
    printf("  %-20s %s%s\n", $name, $rc === 0 ? 'guarded, and its own check passes' : 'ITS OWN CHECK FAILS',
           $wired ? '' : ' (but check.sh does not run it)');
    if ($rc !== 0) {
        $findings[] = "$name refuses its own tree. Run it there and read it:\n"
            . "    cd $dir && sh tools/exposure-check.sh\n"
            . "    " . implode("\n    ", array_slice($out, 0, 12));
    }
}

// The two copies are one script maintained in two repositories, which is the arrangement that
// drifts. Reported rather than failed: a sibling may legitimately be ahead for a day.
if (count($hashes) === 2 && count(array_unique($hashes)) === 2) {
    $findings[] = "the two copies of tools/exposure-check.sh have DRIFTED apart.\n"
        . "    One repository is being guarded by a script the other has moved past. Diff them and\n"
        . "    copy the newer over the older.";
}

printf("  %d of %d sibling(s) reachable from %s\n", $reached, count($SIBLINGS), $base);
echo "  This reads DECLARATIONS, never the live site. What proves Apache obeys them is the\n";
echo "  account's own daily page check on the host.\n";

if ($findings) {
    echo "\n" . count($findings) . " finding(s), advisory:\n\n";
    foreach ($findings as $f) { echo "  * $f\n\n"; }
}
exit(0);
