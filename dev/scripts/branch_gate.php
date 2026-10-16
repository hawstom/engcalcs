<?php
/**
 * branch_gate.php <merge_sha> [<merge subject>]  -- the decision behind dev/hooks/pre-merge-commit.
 *
 * Exits 0 to allow the merge, 1 to refuse it. Kept in PHP rather than in the hook so it can be
 * TESTED: dev/scripts/branch_policy_selftest.php drives it directly, which a shell hook invoked only
 * by git cannot easily be.
 *
 * It holds two of Tom's instruments: the emergency freeze, and open deploy blockers. Whether a
 * feature is finished is his typed word in the conversation, which Claude Code's own permission
 * check already requires before any merge into master. A second, file-based copy of that word
 * (dev/branch-all-clears.json, pinned to a commit) was retired on his word, 2026-10-15: Claude
 * Code could not write it, so he hand-edited JSON, and bringing a cleared branch up to date
 * voided his clearance.
 */

// **THE ROOT IS AN ARGUMENT SO THIS CAN BE TESTED**, the same reversal `ecDeployIdentity()` made
// for the same reason: a function that can only read the real repository can only be tested by
// changing the real repository. The selftest builds a throwaway git repo with its own policy files
// and drives the real decision against it.
$root = dirname(__DIR__, 2);
$mergeSha = isset($argv[1]) ? trim($argv[1]) : '';
$subject  = isset($argv[2]) ? trim($argv[2]) : '';
if (isset($argv[3]) && $argv[3] !== '') { $root = rtrim($argv[3], '/'); }

function jload($path) {
    if (!is_file($path)) { return null; }
    $d = json_decode(file_get_contents($path), true);
    return is_array($d) ? $d : null;
}
$policy = jload($root . '/dev/branch-policy.json');
if ($policy === null) { exit(0); }   // no policy declared: this gate has nothing to say

// WHICH BRANCH IS COMING IN. Ask git which refs contain the merged sha rather than parsing the
// subject: a subject is prose somebody wrote and can say anything, where a ref is a fact.
$names = array();
$out = array();
exec('git -C ' . escapeshellarg($root) . ' for-each-ref --format="%(refname:short) %(objectname)" refs/heads 2>/dev/null', $out);
foreach ($out as $line) {
    $parts = preg_split('/\s+/', trim($line));
    if (count($parts) === 2 && $parts[1] === $mergeSha && $parts[0] !== 'master') { $names[] = $parts[0]; }
}

// A FREEZE STOPS EVERYTHING, and is the instrument for "keep developing, stop shipping".
$freeze = isset($policy['freeze']) ? $policy['freeze'] : array();
if (!empty($freeze['active'])) {
    if (stripos($subject, 'hotfix:') === 0 || stripos($subject, 'Merge hotfix') === 0) { exit(0); }
    fwrite(STDERR, "\n  REFUSED: master is FROZEN.\n\n");
    if (!empty($freeze['until'])) { fwrite(STDERR, "      until:  " . $freeze['until'] . "\n"); }
    if (!empty($freeze['why']))   { fwrite(STDERR, "      why:    " . $freeze['why'] . "\n"); }
    fwrite(STDERR, "\n  Development continues on branches; that is what a freeze is FOR. Only a merge\n");
    fwrite(STDERR, "  whose subject begins 'hotfix:' passes, and only Tom decides something is one.\n");
    fwrite(STDERR, "\n  Lift it in dev/branch-policy.json, on his word and not on a date.\n\n");
    exit(1);
}

// **AN OPEN DEPLOY BLOCKER REFUSES ITS BRANCH**, because a blocker is a thing Tom said must not ship. On 2026-09-13 `projection` merged carrying 183 of 5,346 projections while
// "We won't deploy with UTM only" was a standing instruction -- one that appeared NOWHERE in this
// repository, because it had only ever been said out loud. This leg is why that cannot recur.
$blockers = jload($root . '/dev/deploy-blockers.json');
$rows = ($blockers && isset($blockers['blockers']) && is_array($blockers['blockers'])) ? $blockers['blockers'] : array();
foreach ($rows as $b) {
    if (empty($b['open'])) { continue; }
    $bb = isset($b['branch']) ? $b['branch'] : '';
    if ($bb === '' || !in_array($bb, $names, true)) { continue; }
    fwrite(STDERR, "\n  REFUSED: '$bb' carries an OPEN deploy blocker.\n\n");
    fwrite(STDERR, "      id:     " . (isset($b['id']) ? $b['id'] : '?') . "\n");
    if (!empty($b['words']))  { fwrite(STDERR, "      Tom:    \"" . $b['words'] . "\"\n"); }
    if (!empty($b['raised'])) { fwrite(STDERR, "      raised: " . $b['raised'] . "\n"); }
    if (!empty($b['state']))  { fwrite(STDERR, "\n      where it stands: " . $b['state'] . "\n"); }
    fwrite(STDERR, "\n  Master is the production line, so anything merged here is a thing Tom gets\n");
    fwrite(STDERR, "  when he next pulls. A branch that cannot be DEPLOYED must not be merged --\n");
    fwrite(STDERR, "  that is the entire point of it being on a branch.\n\n");
    fwrite(STDERR, "  Finish it, or ask him to close the blocker and record his words in\n");
    fwrite(STDERR, "  dev/deploy-blockers.json under 'closed_by'. An AI never closes one.\n\n");
    exit(1);
}

// THE FEATURE FREEZE refuses a feature branch (named feat/...) and leaves every defect, tooling
// and documentation track alone: switching on the emergency freeze instead cost a day of bug fixes
// on 2026-09-13 ("what I am hearing from you blocks bug fixes, and that is unacceptable").
// ONLY TOM LIFTS IT, in a turn where he has said so.
$ff = isset($policy['feature_freeze']) ? $policy['feature_freeze'] : array();
if (empty($ff['active'])) { exit(0); }
$feat = array_values(array_filter($names, function ($n) { return strpos($n, 'feat/') === 0; }));
if (!$feat) { exit(0); }
$branch = $feat[0];
fwrite(STDERR, "\n  REFUSED: '$branch' is a FEATURE and the feature freeze is on.\n\n");
if (!empty($ff['since'])) { fwrite(STDERR, "      frozen since:  " . $ff['since'] . "\n"); }
if (!empty($ff['until'])) { fwrite(STDERR, "      until:         " . $ff['until'] . "\n"); }
if (!empty($ff['why']))   { fwrite(STDERR, "      why:           " . $ff['why'] . "\n"); }
fwrite(STDERR, "\n  A defect, tooling or documentation branch is not affected.\n");
fwrite(STDERR, "  Only Tom lifts it: feature_freeze.active in dev/branch-policy.json.\n");
fwrite(STDERR, "  Genuinely need to bypass?  git merge --no-verify\n\n");
exit(1);
