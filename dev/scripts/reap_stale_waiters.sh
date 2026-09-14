#!/bin/sh
# Find -- and optionally kill -- background shells that are waiting for something that will never
# come.
#
# Copyright 2009 Thomas Gail Haws
# Licensed under GNU GPL v3.0 or later
#
# WHY THIS EXISTS. The guard in .claude/hooks/guard-wait-loops.php stops these being CREATED, but it
# cannot help with two cases: a shell started before the guard existed, and a shell started by a
# session running somewhere the hook is not installed. On 2026-09-14 there were eight of the first
# kind, ten hours old, and the symptom Tom saw was only that Claude Code would not exit.
#
# Usage:
#   sh dev/scripts/reap_stale_waiters.sh           # report only
#   sh dev/scripts/reap_stale_waiters.sh --kill    # report, then terminate what it found
#
# REPORT BY DEFAULT. Killing somebody's running job is not a thing to do on a heuristic without
# being asked, and a session legitimately waiting on a real ten-minute build looks identical from
# outside to one waiting on a job that died. The age threshold is what separates them, and it is
# deliberately generous.
set -u

KILL=0
MINAGE=1800   # 30 minutes. Nothing this suite runs legitimately takes that long to wait on:
              # check_all is seconds and the full harness set is minutes.
while [ $# -gt 0 ]; do
	case "$1" in
		--kill)    KILL=1; shift ;;
		--min-age) MINAGE="${2:-1800}"; shift 2 ;;
		*) echo "usage: reap_stale_waiters.sh [--kill] [--min-age SECONDS]" >&2; exit 2 ;;
	esac
done

# Self-exclusion matters here more than anywhere: this script's own command line contains every
# pattern it searches for, which is the very bug it is cleaning up after. $$ is compared numerically
# rather than by pattern for exactly that reason.
ME=$$
PARENT=$(ps -o ppid= -p $ME 2>/dev/null | tr -d ' ')

found=0
list=""

# A candidate is a shell whose command line holds a wait loop AND a sleep. `[s]leep`-style
# bracketing is not available through ps, so the self-match is excluded by PID instead.
for pid in $(ps -eo pid= 2>/dev/null); do
	[ "$pid" = "$ME" ] && continue
	[ "$pid" = "${PARENT:-0}" ] && continue
	args=$(ps -o args= -p "$pid" 2>/dev/null) || continue
	case "$args" in
		*until*do*sleep*|*while*do*sleep*) ;;
		*) continue ;;
	esac
	# Age in seconds, from ps etimes where available.
	age=$(ps -o etimes= -p "$pid" 2>/dev/null | tr -d ' ')
	case "${age:-x}" in *[!0-9]*|'') continue ;; esac
	[ "$age" -lt "$MINAGE" ] && continue
	found=$((found + 1))
	list="$list $pid"
	mins=$((age / 60))
	echo "  PID $pid  idle ${mins}m"
	echo "      $(printf '%s' "$args" | sed 's/.*eval //' | cut -c1-120)"
done

if [ "$found" -eq 0 ]; then
	echo "No stale waiters (nothing looping on a sleep for more than $((MINAGE / 60)) minutes)."
	exit 0
fi

echo ""
echo "$found stale waiter(s). Each is a shell that will not exit on its own, and each one stops"
echo "Claude Code from exiting."
if [ "$KILL" -eq 1 ]; then
	# shellcheck disable=SC2086
	kill $list 2>/dev/null
	sleep 2
	still=""
	for pid in $list; do kill -0 "$pid" 2>/dev/null && still="$still $pid"; done
	if [ -n "$still" ]; then
		# shellcheck disable=SC2086
		kill -9 $still 2>/dev/null
	fi
	echo "Terminated."
else
	echo "Re-run with --kill to terminate them."
fi
exit 0
