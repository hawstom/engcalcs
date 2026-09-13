<?php
/**
 * nested_repo_boundary_check.php -- ADVISORY.
 *
 * **THIS REPOSITORY IS NESTED INSIDE ANOTHER ONE, AND THE BOUNDARY IS ONE LINE.**
 * `~/webdev/hawsedc.com` is the hawsedc.com site's own repository and this suite sits inside it at
 * `engcalcs/`. The parent does not track a single file of ours because its `.gitignore` says
 * `engcalcs/`. Delete that line and the parent swallows 1,452 files that already have their own
 * history and their own origin on GitHub.
 *
 * **PROSE HAS ALREADY FAILED HERE ONCE, WHICH IS WHY THIS IS A SCRIPT.** The rule was originally
 * written `engcalcs*`, with no slash, and that over-matched `engcalcs-parent-hooks.php` -- a real
 * file of the PARENT site that no repository had ever tracked. The fix was the trailing slash. A
 * pattern that is one character from wrong, guarding a boundary between two GitHub repositories, is
 * exactly the shape this project turns into a check: every rule here that became a script stopped
 * being violated, and every rule that stayed prose kept being violated.
 *
 * **ADVISORY, AND FOR THE SAME REASON `screenshot_publish_check.php` IS**: it reads a repository
 * OUTSIDE this tree. A clone that has only `engcalcs` cannot see the parent at all, and a check
 * that cannot run must say it checked nothing rather than pass in silence -- a green line for work
 * that never happened is worse than a red one.
 *
 * Full reasoning, and the three options for retiring the nesting: dev/git-organization-recommendation.md
 */

// dev/scripts -> dev -> the repository root, the same two hops every script here makes to reach
// lib/. THEN one more, to the directory the repository SITS IN, which is the whole point.
$repo   = dirname(dirname(__DIR__));
$parent = dirname($repo);                      // the directory this repository sits in
$self   = basename($repo);                     // what the parent would call us

echo "NESTED REPO BOUNDARY (advisory)\n\n";

if (!is_dir($parent . '/.git')) {
    echo "    Nothing to check: " . $parent . " is not a git repository.\n";
    echo "    This suite is not nested inside another repository here, so the boundary\n";
    echo "    this check exists to hold does not exist either. That is a legitimate layout\n";
    echo "    (it is what dev/git-organization-recommendation.md calls Option C) and not a pass\n";
    echo "    earned by looking -- it is a statement that there was nothing to look at.\n";
    exit(0);
}

$cmd = 'git -C ' . escapeshellarg($parent) . ' ls-files -- ' . escapeshellarg($self) . ' 2>/dev/null';
exec($cmd, $tracked, $rc);
if ($rc !== 0) {
    echo "    Could not read the parent repository's index (git exited $rc).\n";
    echo "    CHECKED NOTHING. Not a pass.\n";
    exit(0);
}

$n = count($tracked);
if ($n === 0) {
    echo "    OK: the parent repository at\n        $parent\n";
    echo "    tracks 0 files under '$self/'. The boundary holds.\n\n";
    echo "    Kept advisory on purpose; see the docblock. If this ever reports a number,\n";
    echo "    the fix is NOT to commit them -- it is to restore the parent's ignore rule\n";
    echo "    ('$self/', WITH the trailing slash) and unstage, because those files already\n";
    echo "    have a history and an origin of their own.\n";
    exit(0);
}

echo "    FINDING: the parent repository at\n        $parent\n";
echo "    now tracks $n file(s) under '$self/'. This suite is being swallowed by the site\n";
echo "    repository it merely sits inside. First few:\n\n";
foreach (array_slice($tracked, 0, 8) as $f) { echo "        $f\n"; }
if ($n > 8) { echo "        ... and " . ($n - 8) . " more\n"; }
echo "\n    Restore the parent's ignore rule -- '$self/', WITH the trailing slash, because\n";
echo "    '$self*' over-matches '$self-parent-hooks.php', a real file of the parent site.\n";
echo "    Then `git -C " . $parent . " rm -r --cached $self`.\n";
echo "\n    ADVISORY: this does not fail the build, because the parent is outside this tree\n";
echo "    and may legitimately be absent. Read dev/git-organization-recommendation.md.\n";
exit(0);
