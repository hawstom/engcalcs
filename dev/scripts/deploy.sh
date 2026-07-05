#!/usr/bin/env bash
# Release workflow: php syntax check on changed files, git add/commit prompt, push.
#
# Usage: dev/scripts/deploy.sh [branch]
#   branch defaults to the current branch.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"

echo "==> Checking working tree status"
git status --short

echo "==> Running php -l on changed PHP files"
mapfile -t CHANGED_PHP < <(git diff --name-only --diff-filter=ACMR HEAD -- '*.php'; git ls-files --others --exclude-standard '*.php')
CHANGED_PHP=($(printf '%s\n' "${CHANGED_PHP[@]}" | sort -u))

if [ "${#CHANGED_PHP[@]}" -eq 0 ]; then
    echo "    No changed PHP files."
else
    LINT_FAILED=0
    for f in "${CHANGED_PHP[@]}"; do
        [ -f "$f" ] || continue
        if ! php -l "$f" >/tmp/deploy_lint_out 2>&1; then
            echo "    LINT FAIL: $f"
            cat /tmp/deploy_lint_out
            LINT_FAILED=1
        fi
    done
    if [ "$LINT_FAILED" -ne 0 ]; then
        echo "==> Aborting: fix php syntax errors above before deploying."
        exit 1
    fi
    echo "    All ${#CHANGED_PHP[@]} changed PHP file(s) passed php -l."
fi

echo "==> Staging changes"
git add -A
git status --short

if git diff --cached --quiet; then
    echo "    Nothing staged; skipping commit."
else
    read -rp "Commit message: " COMMIT_MSG
    if [ -z "$COMMIT_MSG" ]; then
        echo "==> Aborting: empty commit message."
        exit 1
    fi
    git commit -m "$COMMIT_MSG"
fi

read -rp "Push branch '$BRANCH' to origin now? [y/N] " CONFIRM
if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "==> Pushing to origin/$BRANCH via altssh.bitbucket.org:443"
    git push origin "$BRANCH"
else
    echo "==> Skipped push. Run 'git push origin $BRANCH' manually when ready."
fi
