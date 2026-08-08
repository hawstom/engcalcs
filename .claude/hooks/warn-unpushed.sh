#!/usr/bin/env bash
# Stop hook: say so when the session ends with work that is not on origin.
#
# Why this exists (Tom, 2026-08-08): "I always have to ask whether you committed and pushed."
# On 2026-08-08 a fix was committed and never pushed, and he was told to pull -- he pulled, found
# nothing, and lost a round trip diagnosing code that existed only on one disk. A commit reads like
# a ship and is not one. This removes the question from human memory.
#
# Silent when there is nothing to say. Never blocks -- it prints a note and always exits 0, because
# a half-finished session is a normal thing to have and this is a reminder, not a gate.

# Be defensive about where the hook runs: exit quietly rather than noisily if this is not a repo.
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null) || exit 0

# Untracked files count too: a new file nobody has added is work that a fresh clone would not have.
dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

parts=""
add() { [ -n "$parts" ] && parts="$parts; $1" || parts="$1"; }

[ "${dirty:-0}" -gt 0 ] && add "$dirty uncommitted file(s)"

if git rev-parse --abbrev-ref '@{upstream}' >/dev/null 2>&1; then
  ahead=$(git rev-list --count '@{upstream}..HEAD' 2>/dev/null || echo 0)
  [ "${ahead:-0}" -gt 0 ] && add "$ahead commit(s) not pushed to origin/$branch"
else
  # No upstream at all: every commit here is local-only, which is the same failure wearing a
  # different hat.
  add "branch '$branch' has no upstream — nothing on it has ever been pushed"
fi

[ -z "$parts" ] && exit 0

# Hand-rolled JSON rather than jq, which is not installed on this box. Git refuses double quotes
# and backslashes in branch names, and every other field here is a number we generated, so the
# only interpolated text is already JSON-safe.
printf '{"systemMessage":"Not on origin yet — %s. A commit is not a push.","suppressOutput":true}\n' "$parts"
exit 0
