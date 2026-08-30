#!/bin/sh
# Runs every dev/lpn-spike/*harness*.js plus validate*.js.
#
# Copyright 2009 Thomas Gail Haws
# Licensed under GNU GPL v3.0 or later
#
# Exists because popup-tips-harness.js was dead (MODULE_NOT_FOUND) for weeks with nobody the
# wiser -- its ~60 assertions ran zero times while every OTHER harness stayed green (ROADMAP
# Task 256). Nothing else runs these; this is the one command that does.
#
# IT COUNTS WHAT IT WAS ASKED FOR, NOT WHAT IT REACHED (Task 322). This used to be `set -e` around
# a glob: the first failing harness ended the run, and the ones after it were never mentioned
# again. That is the same shape that let twelve of dev/browser-pass/run.js's thirty-eight sections
# sit dead for two days behind a cheerful "849/864 checks passed" -- a headline that is a fraction
# of what RAN goes UP as coverage falls. So: the ask is counted from the glob before anything runs,
# every harness runs whatever its neighbours did, and the last line is N/N, always.
#
# AN EMPTY GLOB IS A FAILURE, not a clean run. A renamed directory or a changed naming convention
# would otherwise produce "0 harnesses, none failing" and exit 0, which is the loudest possible
# silence.
DIR="$(cd "$(dirname "$0")/../lpn-spike" && pwd)"

ASKED=0
for f in "$DIR"/*harness*.js "$DIR"/validate*.js; do
	[ -f "$f" ] || continue
	ASKED=$((ASKED + 1))
done

if [ "$ASKED" -eq 0 ]; then
	echo "NO HARNESSES FOUND in $DIR"
	echo "The glob (*harness*.js, validate*.js) matched nothing. Either the directory moved or the"
	echo "naming convention changed; an empty run is not a passing one."
	exit 1
fi

echo "$ASKED harness file(s) to run."
RAN=0
FAILED=""
for f in "$DIR"/*harness*.js "$DIR"/validate*.js; do
	[ -f "$f" ] || continue
	echo "=== $f ==="
	if node "$f"; then
		RAN=$((RAN + 1))
	else
		FAILED="$FAILED $(basename "$f")"
	fi
done

echo ""
echo "$RAN/$ASKED lpn harnesses passed."
if [ -n "$FAILED" ]; then
	echo "FAILED:$FAILED"
	echo "A harness that exits non-zero on its first line is usually calling something that MOVED."
	exit 1
fi
exit 0
