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
exec("git -C $q checkout -qb feat/thing 2>/dev/null");
file_put_contents($tmp . '/seed.txt', "work\n");
exec("git -C $q commit -qam work 2>/dev/null");
$featureSha = trim(shell_exec("git -C $q rev-parse feat/thing"));
exec("git -C $q checkout -qb ordinary master 2>/dev/null");
file_put_contents($tmp . '/other.txt', "x\n");
exec("git -C $q add -A && git -C $q commit -qm other 2>/dev/null");
$ordinarySha = trim(shell_exec("git -C $q rev-parse ordinary"));
exec("git -C $q checkout -q master 2>/dev/null");

function writePolicy($tmp, $freeze, $featureFreeze = null) {
    $doc = array('freeze' => $freeze);
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
function run($gate, $sha, $subject, $tmp) {
    $cmd = 'php ' . escapeshellarg($gate) . ' ' . escapeshellarg($sha) . ' ' .
           escapeshellarg($subject) . ' ' . escapeshellarg($tmp) . ' 2>/dev/null';
    exec($cmd, $o, $rc);
    return $rc;
}

$noFreeze = array('active' => false, 'until' => null, 'why' => null);

echo "--- 1. with nothing switched on, a feature and an ordinary branch both merge ---\n";
writePolicy($tmp, $noFreeze);
writeBlockers($tmp, array());
ok('a feature branch merges', run($gate, $featureSha, 'Merge feat/thing', $tmp) === 0);
ok('an ordinary branch merges', run($gate, $ordinarySha, 'Merge ordinary', $tmp) === 0);

echo "--- 2. A FREEZE STOPS EVERY BRANCH BUT A HOTFIX ---\n";
writePolicy($tmp, array('active' => true, 'until' => '2026-09-17', 'why' => 'EWB'));
ok('the ordinary branch is refused', run($gate, $ordinarySha, 'Merge ordinary: a defect fix', $tmp) === 1);
ok('...and a hotfix still passes, because a freeze must not trap a fix',
    run($gate, $ordinarySha, 'hotfix: the map will not draw', $tmp) === 0);

echo "--- 3. AN OPEN DEPLOY BLOCKER REFUSES ITS BRANCH ---\n";
writePolicy($tmp, $noFreeze);
writeBlockers($tmp, array(array('id' => 'utm-only', 'branch' => 'feat/thing', 'open' => true,
    'words' => "We won't deploy with UTM only.")));
ok('refused', run($gate, $featureSha, 'Merge feat/thing', $tmp) === 1);
writeBlockers($tmp, array(array('id' => 'utm-only', 'branch' => 'feat/thing', 'open' => false,
    'closed_by' => 'Tom: ship it')));
ok('...and a CLOSED blocker lets the same merge through', run($gate, $featureSha, 'Merge feat/thing', $tmp) === 0);
writeBlockers($tmp, array(array('id' => 'other', 'branch' => 'somewhere-else', 'open' => true)));
ok('a blocker on a DIFFERENT branch does not stop this one', run($gate, $featureSha, 'Merge feat/thing', $tmp) === 0);
writeBlockers($tmp, array());

echo "--- 4. THE FEATURE FREEZE STOPS feat/ BRANCHES AND NOTHING ELSE ---\n";
writePolicy($tmp, $noFreeze, array('active' => true, 'since' => '2026-09-10', 'why' => 'EWB'));
list($rc, $out) = runOut($gate, $featureSha, 'Merge feat/thing', $tmp);
ok('a feature is refused, naming the feature freeze', $rc === 1 && strpos($out, 'feature freeze') !== false, $out);
ok('an ordinary branch still merges: a gate that stops bug fixes gets switched off',
    run($gate, $ordinarySha, 'Merge ordinary', $tmp) === 0);
writePolicy($tmp, $noFreeze, array('active' => false));
ok('lifted, the feature merges', run($gate, $featureSha, 'Merge feat/thing', $tmp) === 0);

echo "--- 5. no policy file at all means this gate says nothing ---\n";
unlink($tmp . '/dev/branch-policy.json');
ok('silent', run($gate, $featureSha, 'Merge feat/thing', $tmp) === 0);

exec('rm -rf ' . escapeshellarg($tmp));

// THE HOOKS THEMSELVES, against real merges in a real repository: a gate driven only directly once
// passed while the hook calling it exited 0 on every merge (2026-09-13). Both doors: a clean merge
// fires pre-merge-commit; a conflicted one is committed by hand and fires pre-commit.
echo "--- 6. THE HOOKS THEMSELVES, against real merges ---\n";
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
file_put_contents($e2e . '/dev/branch-policy.json', '{"freeze":{"active":false},"feature_freeze":{"active":true}}');
file_put_contents($e2e . '/dev/deploy-blockers.json', '{"blockers":[]}');
file_put_contents($e2e . '/f.txt', "seed\n");
exec("git -C $e add -A && git -C $e commit -qm seed --no-verify && git -C $e branch -M master");
exec("git -C $e checkout -qb feat/thing");
file_put_contents($e2e . '/f2.txt', "work\n");
exec("git -C $e add -A && git -C $e commit -qm work --no-verify");
exec("git -C $e checkout -q master");
$before = trim(shell_exec("git -C $e rev-parse HEAD"));
exec("git -C $e merge --no-ff feat/thing -m 'Merge feat/thing: x' > /dev/null 2>&1", $o1, $rc1);
$after = trim(shell_exec("git -C $e rev-parse HEAD"));
ok('A CLEAN MERGE of a feature under the feature freeze is refused by the hook, and master did not move',
    $rc1 !== 0 && $after === $before, 'rc=' . $rc1);
exec("git -C $e merge --abort > /dev/null 2>&1");

// the conflicted path, which takes pre-commit rather than pre-merge-commit
file_put_contents($e2e . '/f.txt', "mine\n");
exec("git -C $e commit -qam mine --no-verify");
exec("git -C $e checkout -q feat/thing");
file_put_contents($e2e . '/f.txt', "theirs\n");
exec("git -C $e commit -qam theirs --no-verify");
exec("git -C $e checkout -q master");
$before2 = trim(shell_exec("git -C $e rev-parse HEAD"));
exec("git -C $e merge --no-ff feat/thing -m 'Merge feat/thing: y' > /dev/null 2>&1");
file_put_contents($e2e . '/f.txt', "resolved\n");
exec("git -C $e add f.txt");
exec("git -C $e commit -qm 'Merge feat/thing: y' > /dev/null 2>&1", $o2, $rc2);
$after2 = trim(shell_exec("git -C $e rev-parse HEAD"));
ok('A CONFLICTED MERGE is refused too, through pre-commit, and master did not move',
    $rc2 !== 0 && $after2 === $before2, 'rc=' . $rc2);
exec("git -C $e merge --abort > /dev/null 2>&1");
exec('rm -rf ' . escapeshellarg($e2e));

echo "\n" . ($fails === 0 ? "All branch-policy checks passed.\n" : "$fails FAILURE(S)\n");
exit($fails === 0 ? 0 : 1);
