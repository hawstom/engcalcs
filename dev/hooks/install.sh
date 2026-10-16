#!/bin/sh
# Install this repository's git hooks.  sh dev/hooks/install.sh
#
# **HOOKS ARE NOT VERSION CONTROLLED, which is why this file exists.** .git/hooks is local to a
# checkout and travels with no clone, so a hook committed to dev/hooks/ protects nobody until
# somebody runs this.
#
# **IT COPIES RATHER THAN SETTING core.hooksPath, and that reversal was MEASURED, not reasoned.**
# The first version set `core.hooksPath = dev/hooks`, which is the tidier mechanism and is wrong
# here: core.hooksPath points INTO THE WORKING TREE, so the hooks vanish the moment you check out a
# commit that does not carry them. Tested 2026-09-12 -- with the path set, a commit straight onto
# master went through unrefused, because checking out master had removed the very hook meant to stop
# it. **It fails OPEN and it fails SILENTLY**, which is the worst pair a guard can have: you keep
# believing you are protected.
#
# A copy in .git/ survives every checkout. The cost of a copy is that it goes stale when the source
# is edited, and that cost is paid by `hook_install_check.php`, which compares the two on every
# check_all run. A guarded staleness beats a silent absence.
set -e
root=$(git rev-parse --show-toplevel)
cd "$root"
# **UNSET FIRST, THEN ASK WHERE THE HOOKS GO.** `git rev-parse --git-path hooks` ANSWERS WITH
# core.hooksPath when it is set, so computing the destination before clearing the old setting
# returns dev/hooks itself and the copy below becomes `cp X X`. Caught on the first run.
git config --unset core.hooksPath 2>/dev/null || true
hooks_dir=$(git rev-parse --git-path hooks)

mkdir -p "$hooks_dir"
for h in pre-commit pre-push; do
	cp "dev/hooks/$h" "$hooks_dir/$h"
	chmod +x "$hooks_dir/$h"
	echo "installed $h"
done
echo ""
echo "  pre-commit  refuses a commit on master (a merge commit is allowed)"
echo "  pre-push    refuses a push of master that check_all.sh has not passed on"
echo ""
echo "Both are bypassable with --no-verify, deliberately. They stop drift, not you."
echo "Re-run this after editing dev/hooks/* -- check_all.sh fails until you do."
