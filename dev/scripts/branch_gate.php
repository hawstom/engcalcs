<?php
/**
 * branch_gate.php <merge_sha> [<merge subject>]  -- the decision behind dev/hooks/pre-merge-commit.
 *
 * Exits 0 to allow the merge, 1 to refuse it. Kept in PHP rather than in the hook so it can be
 * TESTED: dev/scripts/branch_policy_selftest.php drives it directly, which a shell hook invoked only
 * by git cannot easily be.
 *
 * **THE QUESTION IT ASKS IS THE ONE NO OTHER GUARD ASKS: has Tom said this branch is finished?**
 * Every other gate here is about correctness -- the suite, the stamp, the harnesses -- and all of
 * them passed on 2026-09-13 while six capability merges went into master unasked. Correctness was
 * never the thing in doubt.
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

$clears = jload($root . '/dev/branch-all-clears.json');
$cleared = ($clears && isset($clears['cleared']) && is_array($clears['cleared'])) ? $clears['cleared'] : array();

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

// **AN OPEN DEPLOY BLOCKER REFUSES ITS BRANCH BEFORE ANY OTHER QUESTION IS ASKED**, including the
// all-clear, because a blocker is a thing Tom said must not ship and an all-clear could otherwise be
// read as overriding it. On 2026-09-13 `projection` merged carrying 183 of 5,346 projections while
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

$protected = isset($policy['protected']) && is_array($policy['protected']) ? $policy['protected'] : array();
$hit = array_values(array_intersect($names, $protected));
if (!$hit) { exit(0); }             // an ordinary track: the existing rules govern it
$branch = $hit[0];

$entry = isset($cleared[$branch]) ? $cleared[$branch] : null;
$why = '';
if ($entry === null) {
    $why = "no all-clear has ever been recorded for it";
} elseif (!isset($entry['head']) || $entry['head'] === '') {
    $why = "its all-clear names no commit, so nothing can be pinned to it";
} elseif (strpos($mergeSha, $entry['head']) !== 0 && strpos($entry['head'], $mergeSha) !== 0) {
    $why = "its all-clear was given at " . substr($entry['head'], 0, 8) .
           " and this merge is " . substr($mergeSha, 0, 8) . " -- the branch moved after he cleared it";
}
// ---------------------------------------------------------------------------
// THE SECOND LOCK, AND TOM'S APPROVAL DOES NOT OPEN IT. Chosen by him 2026-09-15, when he asked
// "even if I were to approve a merge, the scripts must block it until the freeze is removed.
// Right?" -- and the honest answer was NO, not as built: an all-clear was the only lock, so his
// approval and the freeze were the same key turned twice.
//
// WHY IT IS A SECOND FLAG AND NOT `freeze.active`. That one is an EMERGENCY STOP: it refuses every
// merge but a `hotfix:`, and switching it on cost a whole day of bug fixes he was waiting for on
// 2026-09-13 -- "what I am hearing from you blocks bug fixes, and that is unacceptable." So a
// feature freeze cannot be expressed with it. `feature_freeze` refuses only what the `protected`
// list already names, which is to say FEATURES, and a defect or tooling track is untouched.
//
// THE ORDER MATTERS: the all-clear is checked FIRST and this second. So a merge with no all-clear
// hears about the all-clear, and a merge that HAS one hears that the freeze is what is left. A
// gate that reports the wrong reason gets worked around rather than obeyed.
$ff = isset($policy['feature_freeze']) ? $policy['feature_freeze'] : array();
if (!empty($ff['active'])) {
    fwrite(STDERR, "\n  REFUSED: '$branch' is a FEATURE and the feature freeze is on.\n\n");
    if ($why === '') {
        fwrite(STDERR, "  Tom's all-clear for this exact commit IS on file, and it is not enough by\n");
        fwrite(STDERR, "  itself -- that is the arrangement he asked for on 2026-09-15. His approval\n");
        fwrite(STDERR, "  says the feature is finished; the freeze says this is not the week to ship\n");
        fwrite(STDERR, "  it. The approval keeps standing and this merge goes through the moment the\n");
        fwrite(STDERR, "  freeze is lifted, PROVIDED the branch has not moved since he cleared it.\n\n");
    } else {
        // "It also $why" reads as broken English, because $why is a clause written to follow
        // "is a protected branch and ...". Two reasons are both true here and the reader needs both.
        fwrite(STDERR, "  AND SEPARATELY, $why -- so it would be refused even with the freeze off.\n\n");
    }
    if (!empty($ff['since'])) { fwrite(STDERR, "      frozen since:  " . $ff['since'] . "\n"); }
    if (!empty($ff['until'])) { fwrite(STDERR, "      until:         " . $ff['until'] . "\n"); }
    if (!empty($ff['why']))   { fwrite(STDERR, "      why:           " . $ff['why'] . "\n"); }
    fwrite(STDERR, "\n  A DEFECT FIX IS NOT AFFECTED and must not be made to feel like it is: this\n");
    fwrite(STDERR, "  leg fires only for a branch named in 'protected'. Everything else merges on a\n");
    fwrite(STDERR, "  green suite, which is the whole reason this is not the emergency 'freeze'.\n\n");
    fwrite(STDERR, "  ONLY TOM LIFTS IT: set feature_freeze.active to false in dev/branch-policy.json,\n");
    fwrite(STDERR, "  in a turn where he has said so. An AI clearing its own freeze is the 09-13\n");
    fwrite(STDERR, "  failure wearing a different hat.\n");
    fwrite(STDERR, "  Genuinely need to bypass?  git merge --no-verify\n\n");
    exit(1);
}

if ($why === '') { exit(0); }

fwrite(STDERR, "\n  REFUSED: '$branch' is a protected branch and $why.\n\n");
fwrite(STDERR, "  GREEN IS NOT DONE. check_all.sh says the code works. It cannot say whether the\n");
fwrite(STDERR, "  FEATURE is finished, and on 2026-09-13 six capability merges went into master\n");
fwrite(STDERR, "  green and unfinished -- projection without the projection universe Tom had asked\n");
fwrite(STDERR, "  for twice, custom-property with a validator that does not validate.\n\n");
fwrite(STDERR, "  Ask him. Then record his exact words in dev/branch-all-clears.json:\n\n");
fwrite(STDERR, "      \"$branch\": {\n");
fwrite(STDERR, "          \"head\": \"" . substr($mergeSha, 0, 40) . "\",\n");
fwrite(STDERR, "          \"words\": \"<what he actually said>\",\n");
fwrite(STDERR, "          \"cleared\": \"" . date('Y-m-d') . "\"\n");
fwrite(STDERR, "      }\n\n");
fwrite(STDERR, "  The pin is the point: clear it, push more, and the all-clear lapses by itself.\n");
fwrite(STDERR, "  Genuinely need to bypass?  git merge --no-verify\n\n");
exit(1);
