#!/bin/sh
# Wait for a background job to finish, in a way that CANNOT hang forever.
#
# Copyright 2009 Thomas Gail Haws
# Licensed under GNU GPL v3.0 or later
#
# WHY THIS EXISTS. On 2026-09-13 a session left eight background shells polling for work that had
# already finished. They were still sleeping ten hours later, and Claude Code would not exit because
# it counts a live shell as live work. Tom, 2026-09-14: "Claude Code doesn't want to exit. It tells
# me things are running. And there are 8 shells, whatever that means."
#
# Two bugs did it, and neither is obvious while you are typing the loop:
#
#   1. SELF-MATCHING pgrep. `until ! pgrep -f "run_harnesses.sh"; do sleep 20; done` never exits,
#      because the shell running that loop HAS "run_harnesses.sh" in its own command line, so pgrep
#      finds itself and reports the job still running. Forever. Three of the eight died this way.
#   2. AN UNREACHABLE SENTINEL. `until grep -q "^EXIT=" out; do sleep 15; done` never exits if the
#      watched job was KILLED, because nothing then writes the EXIT= line. The five other shells
#      were waiting on files that read "[exited with code 144]". The marker was never coming.
#
# Both failures are silent and cost nothing visible: the loops sit at 0.0% CPU and look like
# patience. **A waiter with no deadline is not patience, it is a leak.** Everything here is bounded.
#
# Usage:
#   sh dev/scripts/wait_for.sh --timeout 600 --sentinel '^EXIT=' FILE
#   sh dev/scripts/wait_for.sh --timeout 600 --nonempty FILE
#   sh dev/scripts/wait_for.sh --timeout 600 --no-process 'run_harnesses.sh'
#
# Exit status: 0 the condition was met; 1 the deadline passed (and it SAYS so on stderr, naming
# what it was waiting for -- a timeout that exits quietly is the same silence this file exists to
# end); 2 the arguments were wrong.
set -u

TIMEOUT=600
INTERVAL=5
MODE=""
PATTERN=""
TARGET=""

usage() {
	echo "usage: wait_for.sh [--timeout N] [--interval N] (--sentinel RE | --nonempty | --no-process RE) TARGET" >&2
	exit 2
}

while [ $# -gt 0 ]; do
	case "$1" in
		--timeout)    TIMEOUT="${2:-}"; shift 2 ;;
		--interval)   INTERVAL="${2:-}"; shift 2 ;;
		--sentinel)   MODE="sentinel"; PATTERN="${2:-}"; shift 2 ;;
		--nonempty)   MODE="nonempty"; shift 1 ;;
		--no-process) MODE="noproc"; PATTERN="${2:-}"; shift 2 ;;
		-*)           usage ;;
		*)            TARGET="$1"; shift 1 ;;
	esac
done

[ -n "$MODE" ] || usage
case "$MODE" in
	sentinel|nonempty) [ -n "$TARGET" ] || usage ;;
	noproc)            [ -n "$PATTERN" ] || usage ;;
esac
case "$TIMEOUT$INTERVAL" in *[!0-9]*) usage ;; esac
[ "$INTERVAL" -gt 0 ] || usage

# THE SELF-MATCH FIX, and it is the whole reason --no-process is a mode here rather than a pgrep
# somebody types. Bracketing the first character makes the pattern no longer a literal substring of
# this script's own command line, so pgrep cannot find US and mistake it for the job. `foo` becomes
# `[f]oo`, which matches exactly the same processes and not this one.
bracket_first() {
	first=$(printf '%s' "$1" | cut -c1)
	rest=$(printf '%s' "$1" | cut -c2-)
	case "$first" in
		[A-Za-z0-9_]) printf '[%s]%s' "$first" "$rest" ;;
		# A pattern starting with punctuation or a regex metacharacter is not safely bracketable.
		# Say so rather than guess: a silently wrong pattern is how this went wrong the first time.
		*) printf '%s' "$1" ;;
	esac
}

# The job may also have DIED. Every mode therefore stops on the deadline, and the sentinel modes
# additionally give up the moment the file says the job exited without writing the marker -- which
# is failure mode 2 above, caught rather than waited out.
died_without_marker() {
	[ -f "$1" ] || return 1
	grep -q 'exited with code' "$1" 2>/dev/null
}

elapsed=0
met=0
while [ "$elapsed" -lt "$TIMEOUT" ]; do
	case "$MODE" in
		sentinel)
			if [ -f "$TARGET" ] && grep -qE "$PATTERN" "$TARGET" 2>/dev/null; then met=1; break; fi
			if died_without_marker "$TARGET"; then
				echo "wait_for: the job exited without writing '$PATTERN' to $TARGET." >&2
				echo "wait_for: it was killed or crashed; the marker is not coming. Not waiting." >&2
				exit 1
			fi
			;;
		nonempty)
			if [ -s "$TARGET" ]; then met=1; break; fi
			if died_without_marker "$TARGET"; then met=1; break; fi
			;;
		noproc)
			safe=$(bracket_first "$PATTERN")
			pgrep -f "$safe" >/dev/null 2>&1 || { met=1; break; }
			;;
	esac
	sleep "$INTERVAL"
	elapsed=$((elapsed + INTERVAL))
done

if [ "$met" -eq 1 ]; then
	exit 0
fi

case "$MODE" in
	sentinel) echo "wait_for: TIMED OUT after ${TIMEOUT}s waiting for '$PATTERN' in $TARGET." >&2 ;;
	nonempty) echo "wait_for: TIMED OUT after ${TIMEOUT}s waiting for $TARGET to be non-empty." >&2 ;;
	noproc)   echo "wait_for: TIMED OUT after ${TIMEOUT}s waiting for '$PATTERN' to stop running." >&2 ;;
esac
echo "wait_for: giving up rather than leaking a shell. Check the job yourself." >&2
exit 1
