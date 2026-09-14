<?php
/**
 * branch_policy_selftest.php -- BLOCKING. Drives the real dev/scripts/branch_gate.php against a
 * throwaway git repository it builds itself.
 *
 * **THE CHECK IT GUARDS CANNOT BE OBSERVED IN NORMAL USE.** dev/hooks/pre-merge-commit only speaks
 * when it refuses, and it refuses rarely; a gate that has silently stopped working looks exactly
 * like a gate nobody has tripped. That is the same shape as the hook that failed OPEN and SILENTLY
 * on 2026-09-12 (see dev/hooks/install.sh), and it is why this is blocking while the thing it tests
 * is a hook.
 *
 * Every case below is built from real refs in a real repository, because the gate resolves the
 * branch name by asking git which head points at the merged sha -- a subject line is prose and can
 * say anything, so it is deliberately not the authority.
 */

$root = dirname(__DIR__, 2);
$gate = $root . '/dev/scripts/branch_gate.php';
$fails = 0;
function ok($name, $cond, $extra = null) {
    global $fails;
    echo ($cond ? "  ok   " : "  FAIL ") . $name . ($extra === null ? '' : "   " . $extra) . "\n";
    if (!$cond) { $fails++; }
}

$tmp = sys_get_temp_dir() . '/branch-gate-' . getmypid();
exec('rm -rf ' . escapeshellarg($tmp));
mkdir($tmp . '/dev', 0777, true);
$q = escapeshellarg($tmp);
exec("git -C $q init -q 2>/dev/null");
exec("git -C $q config user.email t@example.com; git -C $q config user.name T");
file_put_contents($tmp . '/seed.txt', "seed\n");
exec("git -C $q add -A && git -C $q commit -qm seed 2>/dev/null");
exec("git -C $q branch -M master 2>/dev/null");
exec("git -C $q checkout -qb feature 2>/dev/null");
file_put_contents($tmp . '/seed.txt', "work\n");
exec("git -C $q commit -qam work 2>/dev/null");
$featureSha = trim(shell_exec("git -C $q rev-parse feature"));
exec("git -C $q checkout -qb ordinary master 2>/dev/null");
file_put_contents($tmp . '/other.txt', "x\n");
exec("git -C $q add -A && git -C $q commit -qm other 2>/dev/null");
$ordinarySha = trim(shell_exec("git -C $q rev-parse ordinary"));
exec("git -C $q checkout -q master 2>/dev/null");

function writePolicy($tmp, $protected, $freeze) {
    file_put_contents($tmp . '/dev/branch-policy.json',
        json_encode(array('protected' => $protected, 'freeze' => $freeze), JSON_PRETTY_PRINT));
}
function writeBlockers($tmp, $rows) {
    file_put_contents($tmp . '/dev/deploy-blockers.json',
        json_encode(array('blockers' => $rows), JSON_PRETTY_PRINT));
}
function writeClears($tmp, $cleared) {
    file_put_contents($tmp . '/dev/branch-all-clears.json',
        json_encode(array('cleared' => $cleared), JSON_PRETTY_PRINT));
}
function run($gate, $sha, $subject, $tmp) {
    $cmd = 'php ' . escapeshellarg($gate) . ' ' . escapeshellarg($sha) . ' ' .
           escapeshellarg($subject) . ' ' . escapeshellarg($tmp) . ' 2>/dev/null';
    exec($cmd, $o, $rc);
    return $rc;
}

$noFreeze = array('active' => false, 'until' => null, 'why' => null);

echo "--- 1. a protected branch with no all-clear is REFUSED ---\n";
writePolicy($tmp, array('feature'), $noFreeze);
writeClears($tmp, array());
ok('refused', run($gate, $featureSha, 'Merge feature: something', $tmp) === 1);

echo "--- 2. an ORDINARY branch is let through, which is what keeps the gate usable ---\n";
ok('allowed', run($gate, $ordinarySha, 'Merge ordinary: a defect fix', $tmp) === 0);

echo "--- 3. an all-clear PINNED TO THIS COMMIT lets it through ---\n";
writeClears($tmp, array('feature' => array(
    'head' => $featureSha, 'words' => 'Yes, ship it.', 'cleared' => '2026-09-13')));
ok('allowed', run($gate, $featureSha, 'Merge feature: something', $tmp) === 0);

echo "--- 4. THE ALL-CLEAR LAPSES WHEN THE BRANCH MOVES, which is the whole design ---\n";
exec("git -C $q checkout -q feature 2>/dev/null");
file_put_contents($tmp . '/seed.txt', "more work\n");
exec("git -C $q commit -qam more 2>/dev/null");
$movedSha = trim(shell_exec("git -C $q rev-parse feature"));
exec("git -C $q checkout -q master 2>/dev/null");
ok('the branch really moved', $movedSha !== $featureSha);
ok('REFUSED at the new head, with the old all-clear still on file',
    run($gate, $movedSha, 'Merge feature: something', $tmp) === 1);

echo "--- 5. an all-clear naming no commit is not an all-clear ---\n";
writeClears($tmp, array('feature' => array('words' => 'sure', 'cleared' => '2026-09-13')));
ok('refused', run($gate, $movedSha, 'Merge feature: something', $tmp) === 1);

echo "--- 6. A FREEZE STOPS AN ORDINARY BRANCH TOO ---\n";
writePolicy($tmp, array('feature'), array('active' => true, 'until' => '2026-09-17', 'why' => 'EWB'));
writeClears($tmp, array());
ok('the ordinary branch is now refused as well',
    run($gate, $ordinarySha, 'Merge ordinary: a defect fix', $tmp) === 1);
ok('...and a hotfix still passes, because a freeze must not trap a fix',
    run($gate, $ordinarySha, 'hotfix: the map will not draw', $tmp) === 0);

echo "--- 7. AN OPEN DEPLOY BLOCKER REFUSES ITS BRANCH, EVEN WITH AN ALL-CLEAR ON FILE ---\n";
// This is the projection failure in one assertion: the branch was green, the work looked finished,
// and a standing "we won't deploy with UTM only" made it unmergeable regardless.
writePolicy($tmp, array('feature'), $noFreeze);
writeClears($tmp, array('feature' => array(
    'head' => $movedSha, 'words' => 'Looks good.', 'cleared' => '2026-09-13')));
writeBlockers($tmp, array(array('id' => 'utm-only', 'branch' => 'feature', 'open' => true,
    'words' => "We won't deploy with UTM only.")));
ok('refused, and the all-clear does not override it',
    run($gate, $movedSha, 'Merge feature: something', $tmp) === 1);
writeBlockers($tmp, array(array('id' => 'utm-only', 'branch' => 'feature', 'open' => false,
    'words' => "We won't deploy with UTM only.", 'closed_by' => 'Tom: ship it')));
ok('...and a CLOSED blocker lets the same merge through',
    run($gate, $movedSha, 'Merge feature: something', $tmp) === 0);
writeBlockers($tmp, array(array('id' => 'other', 'branch' => 'somewhere-else', 'open' => true)));
ok('a blocker on a DIFFERENT branch does not stop this one',
    run($gate, $movedSha, 'Merge feature: something', $tmp) === 0);

echo "--- 8. no policy file at all means this gate says nothing ---\n";
unlink($tmp . '/dev/branch-policy.json');
ok('silent, rather than refusing everything in a tree that never opted in',
    run($gate, $featureSha, 'Merge feature: something', $tmp) === 0);

exec('rm -rf ' . escapeshellarg($tmp));
echo "\n" . ($fails === 0 ? "All branch-policy checks passed.\n" : "$fails FAILURE(S)\n");
exit($fails === 0 ? 0 : 1);
