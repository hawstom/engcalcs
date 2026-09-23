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

# **THEY RUN SEVERAL AT A TIME NOW, AND THE ACCOUNTING DID NOT MOVE** (2026-09-23). 241 harnesses
# ran strictly one after another on a four-core box, so three cores sat idle through the longest
# phase of check_all.sh -- and because every check_all in this project goes through one flock, that
# serial phase is what a second worker waits behind. Measured here on 24 pure-node harnesses, on a
# machine ALREADY running three other suites: 80 s serial against 50 s at three at a time. The gain
# on an idle machine is larger; 1.6x is the loaded, conservative number and is the one to quote.
#
# **THE ELEVEN THAT DRIVE A REAL BROWSER STILL RUN ONE AT A TIME**, and which those are is DERIVED
# from the source rather than typed -- a harness naming puppeteer, playwright or chromium is
# exclusive. A typed list would go stale the first time somebody wrote a twelfth, and the failure
# would be three Chromiums on a 7 GB box, which looks like a slow machine rather than a mistake.
# That is the same reasoning lpn_furniture_check.php's derived key list already rests on.
#
# **OUTPUT STAYS IN GLOB ORDER AND STAYS WHOLE.** Each harness writes to its own file and the files
# are printed in order afterwards, so a parallel run reads exactly like a serial one and two
# harnesses cannot interleave mid-line. The `=== file ===` banner, the 300 s timeout, the 124
# timeout note, the N/N last line and the FAILED list are all unchanged -- this script's whole
# reason for existing is that it counts what it was ASKED for and not what it reached, and that
# property is not something a speed change may weaken.
#
# ENGCALCS_HARNESS_JOBS overrides the pool size; 1 restores the old strictly-serial behaviour
# exactly, which is the first thing to try if a harness starts failing only in company.
JOBS="${ENGCALCS_HARNESS_JOBS:-}"
if [ -z "$JOBS" ]; then
	CORES="$(nproc 2>/dev/null || echo 2)"
	JOBS=$((CORES - 1))
	[ "$JOBS" -lt 1 ] && JOBS=1
	[ "$JOBS" -gt 3 ] && JOBS=3
fi

OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT INT TERM

echo "$ASKED harness file(s) to run, $JOBS at a time (browser harnesses one at a time)."

# One harness, into its own output file. Writes an empty marker file beside it when it FAILED, so
# the parent can tell a failure from a pass without a shared variable a subshell cannot write to.
run_one() {
	_f="$1"; _o="$2"
	{
		echo "=== $_f ==="
		if $RUN_ONE node "$_f" 2>&1; then
			:
		else
			_s=$?
			# 124 is timeout(1)'s own code for "the command was still running".
			if [ "$_s" -eq 124 ]; then
				echo "TIMED OUT after 300 s -- this harness did not exit. See the note at the head of"
				echo "run_harnesses.sh: the usual cause is an async main() that returns instead of"
				echo "calling process.exit(), while the EPANET engine holds the event loop open."
			fi
			: > "$_o.failed"
		fi
	} > "$_o" 2>&1
}

N=0
PENDING=0
for f in "$DIR"/*harness*.js "$DIR"/validate*.js; do
	[ -f "$f" ] || continue
	N=$((N + 1))
	if grep -qE 'puppeteer|playwright|chromium' "$f" 2>/dev/null; then
		# Exclusive: let the pool drain first, then run it alone.
		[ "$PENDING" -gt 0 ] && wait
		PENDING=0
		run_one "$f" "$OUT/$N"
	else
		run_one "$f" "$OUT/$N" &
		PENDING=$((PENDING + 1))
		if [ "$PENDING" -ge "$JOBS" ]; then wait; PENDING=0; fi
	fi
done
wait

RAN=0
FAILED=""
N=0
for f in "$DIR"/*harness*.js "$DIR"/validate*.js; do
	[ -f "$f" ] || continue
	N=$((N + 1))
	[ -f "$OUT/$N" ] && cat "$OUT/$N"
	if [ -f "$OUT/$N.failed" ]; then
		FAILED="$FAILED $(basename "$f")"
	else
		RAN=$((RAN + 1))
	fi
done

echo ""
echo "$RAN/$ASKED lpn harnesses passed."
if [ -n "$FAILED" ]; then
	echo "FAILED:$FAILED"
	echo "A harness that exits non-zero on its first line is usually calling something that MOVED."
	echo "If it passes alone but fails in company, the pool is the suspect: re-run with"
	echo "ENGCALCS_HARNESS_JOBS=1 to get the old strictly-serial behaviour and compare."
	exit 1
fi
exit 0
