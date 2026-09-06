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
#
# AND A HARNESS THAT HANGS IS A FAILURE TOO, WHICH IT WAS NOT UNTIL 2026-09-06 -- it was a suite
# that stopped. A harness that finishes its work and then does not EXIT holds the whole run for
# ever: `run_harnesses.sh` never reaches the next file, `check_all.sh` never returns, and there is
# no output at all to say why. Measured that day: five consecutive check_all runs never finished,
# and it read exactly like a slow machine, which is the worst thing a hang can look like.
#
# The cause is real and is fixed where it lives (a harness returning from an async main() when the
# vendored EPANET engine has left a handle open, so the event loop never drains). This is the net
# under it, because the two are different guarantees: fixing one harness stops one hang, and a
# timeout makes EVERY future one a red line naming the file instead of a suite that stalls.
#
# 300 s is far above the slowest honest harness on a loaded machine and far below the point where
# somebody kills the run by hand. A timed-out harness counts as FAILED, which is what it is.
DIR="$(cd "$(dirname "$0")/../lpn-spike" && pwd)"
# `timeout` is in GNU coreutils and is present everywhere this runs; if it ever is not, run without
# it rather than skipping the harnesses, because no net is better than no tests.
if command -v timeout >/dev/null 2>&1; then RUN_ONE="timeout 300"; else RUN_ONE=""; fi

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
	if $RUN_ONE node "$f"; then
		RAN=$((RAN + 1))
	else
		STATUS=$?
		# 124 is timeout(1)'s own code for "the command was still running".
		if [ "$STATUS" -eq 124 ]; then
			echo "TIMED OUT after 300 s -- this harness did not exit. See the note at the head of"
			echo "run_harnesses.sh: the usual cause is an async main() that returns instead of"
			echo "calling process.exit(), while the EPANET engine holds the event loop open."
		fi
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
