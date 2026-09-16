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
    echo ($cond ? "  ok   " : "  FAIL ") . $name . "\n";
    if (!$cond && $extra !== null) { echo "         " . str_replace("\n", "\n         ", trim($extra)) . "\n"; }
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

function writePolicy($tmp, $protected, $freeze, $featureFreeze = null) {
    $doc = array('protected' => $protected, 'freeze' => $freeze);
    // ABSENT BY DEFAULT, deliberately: every case written before the feature freeze existed keeps
    // passing untouched, which is itself the proof that an undeclared freeze cannot refuse anything.
    if ($featureFreeze !== null) { $doc['feature_freeze'] = $featureFreeze; }
    file_put_contents($tmp . '/dev/branch-policy.json', json_encode($doc, JSON_PRETTY_PRINT));
}
function runOut($gate, $sha, $subject, $tmp) {
    $cmd = 'php ' . escapeshellarg($gate) . ' ' . escapeshellarg($sha) . ' ' .
           escapeshellarg($subject) . ' ' . escapeshellarg($tmp) . ' 2>&1';
    exec($cmd, $o, $rc);
    return array($rc, implode("\n", $o));
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

// ---------------------------------------------------------------------------
// THE FEATURE FREEZE. Tom's arrangement of 2026-09-15: a feature needs BOTH his all-clear AND the
// freeze to be off, because he asked "even if I were to approve a merge, the scripts must block it
// until the freeze is removed. Right?" and the answer, as built, was no.
//
// **IT USES $movedSha AND NOT $featureSha, AND THAT IS THE TRAP THIS SECTION FELL INTO FIRST.** The
// gate resolves the branch NAME from the commit -- it asks which branches contain it -- so a sha
// that is no longer any branch's tip reads as an ORDINARY TRACK and is waved through. Section 4
// advances `feature` past $featureSha, so four of these cases were silently testing the wrong thing
// and one of them PASSED while doing it. A case that passes for the wrong reason is worse than a
// failing one, which is the argument the whole file is built on.
//
// FIVE CASES, AND 8c IS THE ONE THAT MATTERS MOST: a gate that also stopped defect work is the
// 2026-09-13 failure that cost a day of bug fixes Tom was waiting for. The case proving an ORDINARY
// branch still merges under a feature freeze is not completeness, it is the point.
// ---------------------------------------------------------------------------
$ffOn  = array('active' => true,  'since' => '2026-09-10', 'until' => null, 'why' => 'EWB');
$ffOff = array('active' => false, 'since' => null, 'until' => null, 'why' => null);
writeBlockers($tmp, array());          // section 7 left one; this section is not about blockers

echo "--- 8. the feature freeze is a SECOND lock that an all-clear does not open ---\n";

// 8a. A valid, correctly pinned all-clear -- refused anyway. This is Tom's question answered.
writePolicy($tmp, array('feature'), $noFreeze, $ffOn);
writeClears($tmp, array('feature' => array('head' => $movedSha, 'words' => 'Looks good.', 'cleared' => '2026-09-15')));
list($rc, $out) = runOut($gate, $movedSha, 'Merge feature: something', $tmp);
ok('a CLEARED feature is still refused while the feature freeze is on', $rc === 1, $out);
ok('and the reason given is the FREEZE, naming the all-clear as already on file',
   strpos($out, 'all-clear for this exact commit IS on file') !== false, $out);

// 8b. Same commit, freeze lifted. It must go through, or his approval means nothing.
writePolicy($tmp, array('feature'), $noFreeze, $ffOff);
ok('the same commit merges the moment the freeze is lifted',
   run($gate, $movedSha, 'Merge feature: something', $tmp) === 0);

// 8c. AN ORDINARY BRANCH UNDER A FEATURE FREEZE. If this ever fails, the feature freeze has become
//     the emergency stop by accident and a day of bug fixes is about to be lost again.
writePolicy($tmp, array('feature'), $noFreeze, $ffOn);
ok('a DEFECT track still merges under a feature freeze -- the whole separation',
   run($gate, $ordinarySha, 'Merge fix: a defect', $tmp) === 0);

// 8d. No all-clear and the freeze on. Refused, and it must not claim an approval exists.
writeClears($tmp, array());
list($rc, $out) = runOut($gate, $movedSha, 'Merge feature: something', $tmp);
ok('uncleared AND frozen is refused', $rc === 1, $out);
ok('and it does not claim an all-clear is on file when none is',
   strpos($out, 'all-clear for this exact commit IS on file') === false, $out);

// 8e. A LAPSED all-clear under a freeze -- pinned to the commit before the branch moved. Both
//     reasons are true and the message must not hide the lapse behind the freeze.
writeClears($tmp, array('feature' => array('head' => $featureSha, 'words' => 'Yes.', 'cleared' => '2026-09-14')));
list($rc, $out) = runOut($gate, $movedSha, 'Merge feature: something', $tmp);
ok('a LAPSED all-clear under a freeze is refused', $rc === 1, $out);
ok('and says the branch MOVED, not merely that it is frozen',
   strpos($out, 'the branch moved after he cleared it') !== false, $out);

// 8f. Declared but INACTIVE, with no all-clear: the original message must survive intact, or the
//     new leg has swallowed the argument the gate was built for.
writePolicy($tmp, array('feature'), $noFreeze, $ffOff);
writeClears($tmp, array());
list($rc, $out) = runOut($gate, $movedSha, 'Merge feature: something', $tmp);
ok('with the freeze off, an uncleared feature still hears about the all-clear', $rc === 1, $out);
ok('and still hears GREEN IS NOT DONE, the original argument',
   strpos($out, 'GREEN IS NOT DONE') !== false, $out);

echo "--- 9. no policy file at all means this gate says nothing ---\n";
unlink($tmp . '/dev/branch-policy.json');
ok('silent, rather than refusing everything in a tree that never opted in',
    run($gate, $featureSha, 'Merge feature: something', $tmp) === 0);

exec('rm -rf ' . escapeshellarg($tmp));

// ============================================================================================
// **THE SECTION THAT WOULD HAVE CAUGHT THE HOOK BEING DEAD.** Everything above drives
// branch_gate.php directly, and on 2026-09-13 all of it passed while the hook that calls the gate
// exited 0 on every real merge -- it read .git/MERGE_HEAD, which git has not written when
// pre-merge-commit runs. A stub that removes the coupling makes a harness pass for the wrong
// reason; dev/testing-notes.md says exactly that, and this is what it looks like when it happens to
// a guard rather than to a calculator. So these cases run REAL git merges, in a real repository,
// with the REAL hooks installed, and ask git whether master moved.
// BOTH DOORS, because they are different code paths: a clean merge fires pre-merge-commit, and a
// CONFLICTED merge never reaches it -- git stops, a human runs `git commit`, and pre-commit fires.
// That second door was open for the whole of 2026-09-13.
echo "--- 10. THE HOOKS THEMSELVES, against real merges ---\n";
$e2e = sys_get_temp_dir() . '/branch-gate-e2e-' . getmypid();
exec('rm -rf ' . escapeshellarg($e2e));
mkdir($e2e . '/dev/scripts', 0777, true);
mkdir($e2e . '/dev/hooks', 0777, true);
$e = escapeshellarg($e2e);
copy($root . '/dev/scripts/branch_gate.php', $e2e . '/dev/scripts/branch_gate.php');
foreach (array('pre-commit', 'pre-merge-commit') as $h) {
    copy($root . '/dev/hooks/' . $h, $e2e . '/dev/hooks/' . $h);
}
exec("git -C $e init -q . && git -C $e config user.email t@e.com && git -C $e config user.name T");
@mkdir($e2e . '/.git/hooks', 0777, true);
foreach (array('pre-commit', 'pre-merge-commit') as $h) {
    copy($e2e . '/dev/hooks/' . $h, $e2e . '/.git/hooks/' . $h);
    chmod($e2e . '/.git/hooks/' . $h, 0755);
}
file_put_contents($e2e . '/dev/branch-policy.json', '{"protected":["feature"],"freeze":{"active":false}}');
file_put_contents($e2e . '/dev/branch-all-clears.json', '{"cleared":{}}');
file_put_contents($e2e . '/dev/deploy-blockers.json', '{"blockers":[]}');
file_put_contents($e2e . '/f.txt', "seed\n");
exec("git -C $e add -A && git -C $e commit -qm seed --no-verify && git -C $e branch -M master");
exec("git -C $e checkout -qb feature");
file_put_contents($e2e . '/f2.txt', "work\n");
exec("git -C $e add -A && git -C $e commit -qm work --no-verify");
exec("git -C $e checkout -q master");
$before = trim(shell_exec("git -C $e rev-parse HEAD"));
exec("git -C $e merge --no-ff feature -m 'Merge feature: x' > /dev/null 2>&1", $o1, $rc1);
$after = trim(shell_exec("git -C $e rev-parse HEAD"));
ok('A CLEAN MERGE of a protected branch is refused by the hook, and master did not move',
    $rc1 !== 0 && $after === $before, 'rc=' . $rc1);
exec("git -C $e merge --abort > /dev/null 2>&1");

// the conflicted path, which takes pre-commit rather than pre-merge-commit
file_put_contents($e2e . '/f.txt', "mine\n");
exec("git -C $e commit -qam mine --no-verify");
exec("git -C $e checkout -q feature");
file_put_contents($e2e . '/f.txt', "theirs\n");
exec("git -C $e commit -qam theirs --no-verify");
exec("git -C $e checkout -q master");
$before2 = trim(shell_exec("git -C $e rev-parse HEAD"));
exec("git -C $e merge --no-ff feature -m 'Merge feature: y' > /dev/null 2>&1");
file_put_contents($e2e . '/f.txt', "resolved\n");
exec("git -C $e add f.txt");
exec("git -C $e commit -qm 'Merge feature: y' > /dev/null 2>&1", $o2, $rc2);
$after2 = trim(shell_exec("git -C $e rev-parse HEAD"));
ok('A CONFLICTED MERGE is refused too, through pre-commit, and master did not move',
    $rc2 !== 0 && $after2 === $before2, 'rc=' . $rc2);
exec("git -C $e merge --abort > /dev/null 2>&1");
exec('rm -rf ' . escapeshellarg($e2e));

echo "\n" . ($fails === 0 ? "All branch-policy checks passed.\n" : "$fails FAILURE(S)\n");
exit($fails === 0 ? 0 : 1);
