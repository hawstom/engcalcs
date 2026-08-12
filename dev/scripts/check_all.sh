#!/bin/sh
# Every automated check this project has, in one command.
#
# Copyright 2009 Thomas Gail Haws
# Licensed under GNU GPL v3.0 or later
#
# WHY THIS EXISTS. Tom, 2026-08-12: *"I would like to be a better leader when it comes to budgeting
# and staffing the code review office."* The first thing a leader needs is to know what the office
# already does without being asked, and until this file there was no way to find out: the checks
# existed, but the list of them lived only in CLAUDE.md prose and in whoever happened to remember.
# A check nobody runs is indistinguishable from a check that does not exist -- which is the same
# failure that let six Rock Chute notes go unrendered for months, and the same one that let lpn and
# bpn miss the glossary map. **Run this before every commit.**
#
# FREE TIER. Everything here costs seconds and no money. It is the whole of what can be verified
# without a human or a paid agent, and it is deliberately the first thing to reach for.
#
# WHAT IT DOES NOT COVER, stated because a checklist that hides its own gaps is worse than none:
#   - The 19 non-lpn calculators have no behavioural test. Their math is verified by reading and by
#     Tom driving a browser. run_harnesses.sh covers the lpn solver thoroughly and nothing else.
#   - Nothing here reads code for design, duplication, or a subtle logic error. That is what
#     /code-review is for, and it is billed and user-triggered -- an AI cannot launch it.
#
# Usage:
#   sh dev/scripts/check_all.sh          # all checks; exit 1 if any blocking check fails
#   sh dev/scripts/check_all.sh --quiet  # only failures and the summary
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
QUIET=0
[ "${1:-}" = "--quiet" ] && QUIET=1

FAILED=""
ADVISORY=""

# $1 = label, $2 = blocking|advisory, rest = command
run_check() {
	label="$1"; kind="$2"; shift 2
	out=$("$@" 2>&1); status=$?
	if [ $status -eq 0 ]; then
		[ $QUIET -eq 1 ] || printf '  PASS  %s\n' "$label"
	elif [ "$kind" = "advisory" ]; then
		printf '  NOTE  %s\n' "$label"
		echo "$out" | sed 's/^/        /'
		ADVISORY="$ADVISORY $label"
	else
		printf '  FAIL  %s\n' "$label"
		echo "$out" | sed 's/^/        /'
		FAILED="$FAILED $label"
	fi
}

cd "$ROOT" || exit 2
echo "Automated checks — $(date '+%Y-%m-%d %H:%M')"
echo ""

# --- Does it parse at all -------------------------------------------------------------------
run_check "php syntax (all .php)"        blocking sh -c 'find . -name "*.php" -not -path "./dev/lpn-spike/*" -print0 | xargs -0 -n1 php -l >/dev/null'
run_check "js syntax (js/*.js)"          blocking sh -c 'for f in js/*.js; do node --check "$f" >/dev/null || exit 1; done'

# --- Does every page still produce well-formed HTML ------------------------------------------
run_check "html balance (every page)"    blocking php dev/scripts/html_balance_check.php

# --- Language integrity: the part of this suite that costs 27x --------------------------------
run_check "lang syntax rules A-D"        blocking php dev/scripts/lang_syntax_validate.php
run_check "gloss pointers resolve"       blocking php dev/scripts/gloss_ref_check.php
run_check "coverage declaration"         blocking php dev/scripts/coverage_selftest.php
run_check "payload freshness"            blocking php dev/scripts/generate_translation_payloads.php --check

# --- lpn solver and editor --------------------------------------------------------------------
run_check "lpn harnesses (11)"           blocking sh dev/scripts/run_harnesses.sh

# --- Advisory: real findings, but judgement calls that must not block a commit ------------------
run_check "key hygiene"                  advisory php dev/scripts/key_hygiene_check.php --strict
run_check "english drift"                advisory sh -c 'php dev/scripts/detect_english_drift.php | grep -q "^CHANGED" && exit 1 || exit 0'

echo ""
if [ -n "$FAILED" ]; then
	echo "BLOCKING FAILURES:$FAILED"
	echo "Do not commit until these pass."
	exit 1
fi
if [ -n "$ADVISORY" ]; then
	echo "Advisory findings above:$ADVISORY"
	echo "Not blocking. Worth a look when convenient; see CLAUDE.md for what each one means."
fi
echo "All blocking checks pass."
echo ""
echo "Not covered here, and worth knowing: the 19 non-lpn calculators have no behavioural test,"
echo "and nothing above reads code for design or logic errors. /code-review covers that, is billed,"
echo "and only a human can start it."
exit 0
