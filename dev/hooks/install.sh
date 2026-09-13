#!/bin/sh
# Install this repository's git hooks.  sh dev/hooks/install.sh
#
# **HOOKS ARE NOT VERSION CONTROLLED, which is the whole reason this file exists.** .git/hooks is
# local to a checkout and travels with no clone, so a hook committed to dev/hooks/ protects nobody
# until somebody runs this. `core.hooksPath` is set rather than the files being copied: a copy goes
# stale silently the day a hook is edited, and a stale guard is worse than none because it is
# trusted.
set -e
root=$(git rev-parse --show-toplevel)
cd "$root"
git config core.hooksPath dev/hooks
chmod +x dev/hooks/pre-commit dev/hooks/pre-push
echo "hooks installed: core.hooksPath = dev/hooks"
echo "  pre-commit  refuses a commit on master (a merge commit is allowed)"
echo "  pre-push    refuses a push of master that check_all.sh has not passed on"
echo ""
echo "Both are bypassable with --no-verify, deliberately. They stop drift, not you."
