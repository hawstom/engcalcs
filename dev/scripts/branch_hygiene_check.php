<?php
/**
 * branch_hygiene_check.php -- every branch, its age, its distance from master, and whether it is
 * merged. ADVISORY: it never fails a build.
 *
 *     php dev/scripts/branch_hygiene_check.php
 *
 * WHY THIS EXISTS. On 2026-09-12 this project retooled from "work directly on master, no feature
 * branches" to "master is the production line and nobody works on it". The old rule was argued on
 * exactly one failure -- **per-task branches accumulated as stale refs** -- and that failure did not
 * stop being real when the rule fell. It stopped being PREVENTED, which is a different thing.
 *
 * A stale branch is invisible by construction: it costs nothing, breaks nothing, and shows up only
 * when somebody runs `git branch` and cannot remember what `fix-the-thing` was for. By then the
 * answer is in a diff nobody wants to read. So the paradigm change buys its own guard: the branch
 * list is PRINTED on every check run, with the three numbers that decide whether a branch is alive.
 *
 * **ADVISORY, DELIBERATELY.** When a branch should die is judgement -- `projection` may sit for
 * three weeks and be perfectly healthy, while a two-day-old branch nobody remembers is already
 * debt. A blocking check here would either be wrong constantly or be tuned until it never fired,
 * and CLAUDE.md's own argument is that a check nobody believes is worse than none. What this owes
 * the reader is the FACTS, ranked, so the judgement is cheap to make.
 *
 * The three numbers, and why each is here:
 *   * AGE of the last commit. A branch nobody has touched is the candidate.
 *   * AHEAD of master -- how much unmerged work would be lost by deleting it. 0 means deleting it
 *     costs nothing at all.
 *   * BEHIND master -- how far it has drifted, which is the merge conflict being saved up.
 *
 * **"AHEAD 0" DOES NOT MEAN "DELETE ME", and the first run of this script proved it.** It reported
 * all four capability branches as MERGED and told Tom to delete them -- they had been created
 * minutes earlier and had no commits at all. A branch whose work landed in master and a branch that
 * has not started are IDENTICAL by commit counts: both have nothing master lacks. Nothing in the
 * ref distinguishes them (a reflog is local, is pruned, and does not survive a fresh clone), so the
 * script does not guess. It reports "no unmerged work" and names both readings, which is the honest
 * answer and is still the one a person can act on in a second.
 */

function bh_git($args) {
    $out = array();
    exec('git ' . $args . ' 2>/dev/null', $out);
    return $out;
}

$root = dirname(dirname(__DIR__));
chdir($root);

if (!is_dir('.git')) {
    echo "branch hygiene: not a git checkout, nothing to report\n";
    exit(0);
}

// The trunk is named once. If this project ever renames it, this is the single line to change.
$TRUNK = 'master';

$verify = bh_git('rev-parse --verify --quiet ' . $TRUNK);
if (!$verify) {
    echo "branch hygiene: no '$TRUNK' branch, nothing to compare against\n";
    exit(0);
}

$now = time();
$rows = array();
// %(refname:short) and the committer date as a unix stamp, so no date parsing is needed.
foreach (bh_git("for-each-ref --format='%(refname:short)\t%(committerdate:unix)' refs/heads/") as $line) {
    $line = trim($line, "'");
    $parts = explode("\t", $line);
    if (count($parts) < 2) { continue; }
    $name = $parts[0];
    if ($name === $TRUNK) { continue; }
    $when = (int)$parts[1];

    $counts = bh_git('rev-list --left-right --count ' . escapeshellarg($TRUNK . '...' . $name));
    $ahead = 0; $behind = 0;
    if ($counts) {
        $c = preg_split('/\s+/', trim($counts[0]));
        // left  = commits on master not on the branch  -> the branch is BEHIND by this many
        // right = commits on the branch not on master  -> the branch is AHEAD by this many
        if (count($c) >= 2) { $behind = (int)$c[0]; $ahead = (int)$c[1]; }
    }
    $rows[] = array(
        'name'   => $name,
        'days'   => (int)floor(($now - $when) / 86400),
        'ahead'  => $ahead,
        'behind' => $behind,
        // Nothing on this branch that master lacks. NOT the same as "finished" -- see the
        // docblock: a branch that never started looks exactly like one whose work landed.
        'merged' => ($ahead === 0),
    );
}

if (!$rows) {
    echo "branch hygiene: only '$TRUNK' exists; nothing to report\n";
    exit(0);
}

// Merged first (the unambiguous residue), then oldest first inside each group.
usort($rows, function ($a, $b) {
    if ($a['merged'] !== $b['merged']) { return $a['merged'] ? -1 : 1; }
    return $b['days'] <=> $a['days'];
});

echo "BRANCH HYGIENE (advisory, " . count($rows) . " branch(es) beside $TRUNK):\n\n";
printf("    %-22s %6s %8s %8s  %s\n", 'branch', 'age', 'ahead', 'behind', 'state');
foreach ($rows as $r) {
    $state = $r['merged']
        ? 'no unmerged work -- finished, or not yet started'
        : ($r['behind'] > 0 ? 'live, drifting from ' . $TRUNK : 'live');
    printf("    %-22s %5dd %8d %8d  %s\n",
           $r['name'], $r['days'], $r['ahead'], $r['behind'], $state);
}

$merged = 0;
foreach ($rows as $r) { if ($r['merged']) { $merged++; } }
echo "\n";
if ($merged) {
    echo "$merged branch(es) hold nothing $TRUNK lacks. For each, ask which it is: work that\n";
    echo "LANDED (delete the ref -- `git branch -d <name>` and `git push origin :<name>`), or work\n";
    echo "that has not STARTED (leave it alone). The counts cannot tell you, and this script will\n";
    echo "not pretend they can.\n\n";
}
echo "MERGED OR KILLED, never left to rot. A stale ref is the one failure the old\n";
echo "no-branches rule existed to prevent, and it did not stop being real when that rule\n";
echo "fell on 2026-09-12 -- it stopped being prevented. Advisory because WHEN a branch\n";
echo "should die is judgement: a capability branch may sit for weeks and be healthy, while\n";
echo "a two-day-old branch nobody remembers is already debt.\n";
exit(0);
