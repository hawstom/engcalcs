#!/bin/sh
# Runs every dev/calc-spike/*harness*.js.
#
# Copyright 2009 Thomas Gail Haws
# Licensed under GNU GPL v3.0 or later
#
# The non-lpn twin of run_harnesses.sh (ROADMAP Task 292). Same reason for existing: a harness
# nothing runs is indistinguishable from a harness that does not exist -- popup-tips-harness.js
# was dead for weeks with nobody the wiser (Task 256), which is why the lpn suite got a runner and
# why this one has had a runner since its first file.
#
# These are SLOWER than the lpn harnesses (each loadCalculator() renders a real page through PHP),
# so the whole set is a few seconds rather than a few hundred milliseconds. Still free, still
# faster than opening one page in a browser.
#
# THE HEADLINE IS A FRACTION OF THE ASK, NOT OF THE REACH (Task 322) -- see run_harnesses.sh for
# the incident that rule comes from. The ask is counted from the glob before anything runs, every
# harness runs whatever its neighbours did, and an empty glob fails rather than reporting a clean
# run of nothing.
DIR="$(cd "$(dirname "$0")/../calc-spike" && pwd)"

ASKED=0
for f in "$DIR"/*harness*.js; do
	[ -f "$f" ] || continue
	ASKED=$((ASKED + 1))
done

if [ "$ASKED" -eq 0 ]; then
	echo "NO HARNESSES FOUND in $DIR"
	echo "The glob (*harness*.js) matched nothing. Either the directory moved or the naming"
	echo "convention changed; an empty run is not a passing one."
	exit 1
fi

echo "$ASKED harness file(s) to run."
RAN=0
FAILED=""
for f in "$DIR"/*harness*.js; do
	[ -f "$f" ] || continue
	echo "=== $f ==="
	if node "$f"; then
		RAN=$((RAN + 1))
	else
		FAILED="$FAILED $(basename "$f")"
	fi
done

echo ""
echo "$RAN/$ASKED calculator harnesses passed."
if [ -n "$FAILED" ]; then
	echo "FAILED:$FAILED"
	echo "A page's own pageCalculator is what these run; a harness failing at load is usually a"
	echo "renamed field or a page that no longer renders."
	exit 1
fi
exit 0
