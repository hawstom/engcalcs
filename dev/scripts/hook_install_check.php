<?php
/**
 * hook_install_check.php -- the installed git hooks are the ones this repository ships.
 *
 *     php dev/scripts/hook_install_check.php
 *
 * WHY A COPY NEEDS A CHECK. `dev/hooks/install.sh` COPIES the hooks into .git/hooks rather than
 * pointing `core.hooksPath` at the working tree, and that reversal was measured rather than
 * reasoned: core.hooksPath resolves INTO THE WORKING TREE, so the hooks disappear the moment you
 * check out a commit that does not carry them. On 2026-09-12 a commit straight onto master went
 * through unrefused for exactly that reason -- checking master out had deleted the hook meant to
 * stop it. **It failed OPEN and it failed SILENTLY.**
 *
 * A copy survives every checkout and buys one problem in exchange: it goes stale the day somebody
 * edits `dev/hooks/*`. That is this check. A guarded staleness beats a silent absence, and the
 * comparison is a byte comparison, because "near enough" in a guard is the same as absent.
 *
 * **BLOCKING, AND NOT INSTALLED IS A FAILURE TOO.** The whole argument for the hooks is that the
 * author of the master-is-sacred rule broke it three times in the hour after writing it. A checkout
 * where nobody ran the installer has no guard at all, which is the state this exists to make
 * visible -- so it fails, and names the one command that fixes it.
 */

$root = dirname(dirname(__DIR__));
chdir($root);

if (!is_dir('.git')) {
    echo "hook install: not a git checkout, nothing to compare\n";
    exit(0);
}

// Where git would actually look. If core.hooksPath is set we are back in the failure mode the
// installer exists to undo, so that is reported as its own finding rather than silently followed.
$path = trim(shell_exec('git config --get core.hooksPath 2>/dev/null'));
if ($path !== '') {
    echo "core.hooksPath is set to '$path'.\n\n";
    echo "That mechanism was SUPERSEDED on 2026-09-12 because it resolves into the working\n";
    echo "tree: checking out a commit without dev/hooks/ silently removes every guard. Undo it\n";
    echo "and install the copies:\n\n    sh dev/hooks/install.sh\n";
    exit(1);
}

$hooks = array('pre-commit', 'pre-push');
$bad = array();
foreach ($hooks as $h) {
    $src = 'dev/hooks/' . $h;
    $dst = '.git/hooks/' . $h;
    if (!is_file($src)) { $bad[] = array($h, 'missing from dev/hooks/ -- the source is gone'); continue; }
    if (!is_file($dst)) { $bad[] = array($h, 'NOT INSTALLED -- this checkout has no guard'); continue; }
    if (file_get_contents($src) !== file_get_contents($dst)) {
        $bad[] = array($h, 'installed copy differs from dev/hooks/ -- it is stale');
        continue;
    }
    if (!is_executable($dst)) { $bad[] = array($h, 'installed but not executable -- git will skip it'); }
}

if (!$bad) {
    echo "hook install OK -- " . count($hooks) . " hooks installed and byte-identical to dev/hooks/\n";
    exit(0);
}

echo "GIT HOOKS NOT AS SHIPPED (" . count($bad) . "):\n\n";
foreach ($bad as $b) { printf("    %-12s %s\n", $b[0], $b[1]); }
echo "\nFix, and it is one command:\n\n    sh dev/hooks/install.sh\n\n";
echo "These hooks keep master the production line: pre-commit refuses a commit on master\n";
echo "(a merge is allowed), pre-push refuses a master push the check suite has not passed\n";
echo "on. Both are bypassable with --no-verify by design -- they stop drift, not you.\n";
exit(1);
