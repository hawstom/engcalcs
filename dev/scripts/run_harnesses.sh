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

# --node-only: the quick pass to run on a merge result BEFORE check_all (2026-10-15). It skips the
# browser harnesses and gives the rest every core. It is a pre-check, never the gate: check_all
# runs all.
NODE_ONLY=""
[ "${1:-}" = "--node-only" ] && NODE_ONLY=1

# WHICH HARNESSES DRIVE A REAL BROWSER is DERIVED from the source rather than typed, so a new one
# cannot be forgotten: a harness that requires playwright or puppeteer, or calls launchBrowser( or
# chromium.launch(, or requires a sibling './x.js' that does. Code, not words: until 2026-10-15
# this matched any MENTION of chromium, and a node-only harness whose comment said "measured in a
# real headless Chromium" queued as a browser harness.
BROWSER_RE='require\([^)]*(playwright|puppeteer)|launchBrowser\(|chromium\.launch\('
is_browser() {
	grep -qE "$BROWSER_RE" "$1" 2>/dev/null && return 0
	for _dep in $(grep -oE "require\('\./[^']+'\)" "$1" 2>/dev/null | sed "s/^require('\.\///; s/')\$//"); do
		grep -qE "$BROWSER_RE" "$DIR/$_dep" 2>/dev/null && return 0
	done
	return 1
}
SKIPPED=0
# `timeout` is in GNU coreutils and is present everywhere this runs; if it ever is not, run without
# it rather than skipping the harnesses, because no net is better than no tests.
if command -v timeout >/dev/null 2>&1; then RUN_ONE="timeout 300"; else RUN_ONE=""; fi

OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT INT TERM

# The ask, counted and numbered in glob order before anything runs. Each harness keeps its number
# N for its output file, so the report below reads in glob order whatever order things ran in.
ASKED=0
: > "$OUT/node.list"; : > "$OUT/browser.list"; : > "$OUT/all.list"
for f in "$DIR"/*harness*.js "$DIR"/validate*.js; do
	[ -f "$f" ] || continue
	if is_browser "$f"; then
		if [ -n "$NODE_ONLY" ]; then SKIPPED=$((SKIPPED + 1)); continue; fi
		ASKED=$((ASKED + 1))
		echo "$ASKED $f" >> "$OUT/browser.list"
	else
		ASKED=$((ASKED + 1))
		echo "$ASKED $f" >> "$OUT/node.list"
	fi
	echo "$ASKED $f" >> "$OUT/all.list"
done

if [ "$ASKED" -eq 0 ]; then
	echo "NO HARNESSES FOUND in $DIR"
	echo "The glob (*harness*.js, validate*.js) matched nothing. Either the directory moved or the"
	echo "naming convention changed; an empty run is not a passing one."
	exit 1
fi

# **NODE HARNESSES RUN IN A ROLLING POOL; BROWSER HARNESSES RUN IN LANES BESIDE IT** (Task 797,
# 2026-10-15). Until then every browser harness ran alone, with the node pool drained before each,
# and those ~105 one-at-a-time runs were 92% of a 57-minute check_all, at a load average near 0.5:
# they mostly wait on fixed sleeps, not on the CPU. Nothing else stops them sharing a machine: each
# asks the OS for its own port, serves a mkdtemp docroot and launches a temporary Chromium profile.
# The one harness that counted rows in the checkout's own log/ (sw-precache-log) writes to
# EC_TEST_LOG_DIR now.
#
# EACH LANE HAS ITS OWN BROWSER LOCK, "$EC_BROWSER_LOCK.laneK". Most browser harnesses re-exec
# themselves under `flock -w 280 $EC_BROWSER_LOCK` and print NOT RUN (a failure) after 280 s, so
# lanes sharing one lock would only queue and then fail. check_all.sh gives each of its slots its own
# EC_BROWSER_LOCK, so lanes never meet another suite's either.
#
# LONGEST FIRST: lanes take browser harnesses in descending order of the seconds in
# browser_harness_times.tsv (a harness not listed counts as 60 s, so a new one starts early). Each
# lane claims its next harness when it is free (mkdir is the atomic claim), so a stale table costs a
# few minutes of packing, never a harness: every one is still run, once.
#
# **OUTPUT STAYS IN GLOB ORDER AND STAYS WHOLE.** Each harness writes to its own file and the files
# are printed in order afterwards, so a parallel run reads exactly like a serial one and two
# harnesses cannot interleave mid-line. The `=== file ===` banner, the 300 s timeout, the 124
# timeout note, the N/N last line and the FAILED list are unchanged -- this script's whole reason
# for existing is that it counts what it was ASKED for and not what it reached, and no speed change
# may weaken that. A harness with no output file at the end never ran, and counts as FAILED.
#
# ENGCALCS_HARNESS_JOBS sizes the node pool (default cores / EC_CHECK_SLOTS, at most 6);
# ENGCALCS_BROWSER_LANES the browser lanes (default 3). ENGCALCS_HARNESS_JOBS=1 runs everything
# strictly one at a time in glob order under the one EC_BROWSER_LOCK, the old behaviour exactly:
# the first thing to try if a harness starts failing only in company.
JOBS="${ENGCALCS_HARNESS_JOBS:-}"
if [ -z "$JOBS" ]; then
	CORES="$(nproc 2>/dev/null || echo 2)"
	# Share the cores among the suites check_all.sh lets run at once (its EC_CHECK_SLOTS).
	JOBS=$((CORES / ${EC_CHECK_SLOTS:-4}))
	[ "$JOBS" -lt 1 ] && JOBS=1
	[ "$JOBS" -gt 6 ] && JOBS=6
	[ -n "$NODE_ONLY" ] && JOBS="$CORES"
fi
LANES="${ENGCALCS_BROWSER_LANES:-3}"
case "$LANES" in ''|*[!0-9]*|0) LANES=1 ;; esac
SERIAL=""
[ "$JOBS" -eq 1 ] && [ -z "${ENGCALCS_BROWSER_LANES:-}" ] && SERIAL=1
BASE_LOCK="${EC_BROWSER_LOCK:-/tmp/engcalcs-browser.lock}"

if [ -n "$SERIAL" ]; then
	echo "$ASKED harness file(s) to run, strictly one at a time (ENGCALCS_HARNESS_JOBS=1)."
elif [ -n "$NODE_ONLY" ]; then
	echo "$ASKED harness file(s) to run, $JOBS at a time."
	echo "--node-only: $SKIPPED browser harness(es) skipped; check_all runs them."
else
	echo "$ASKED harness file(s) to run: node harnesses $JOBS at a time, browser harnesses in $LANES lane(s) beside them."
fi

# Longest first. The table's rows are "seconds<TAB>basename"; '#' lines are comments.
TIMES="$(dirname "$0")/browser_harness_times.tsv"
while read -r _n _f; do
	_b="$(basename "$_f")"
	_t="$(awk -F'\t' -v b="$_b" '$2 == b { print $1; exit }' "$TIMES" 2>/dev/null)"
	echo "${_t:-60} $_n $_f"
done < "$OUT/browser.list" | sort -k1,1nr | cut -d' ' -f2- > "$OUT/browser.sorted"

# One harness, into its own output file. Writes an empty marker file beside it when it FAILED, so
# the parent can tell a failure from a pass without a shared variable a subshell cannot write to.
run_one() {
	_f="$1"; _o="$2"
	{
		echo "=== $_f ==="
		if $RUN_ONE node "$_f" < /dev/null 2>&1; then
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
	} > "$_o.part" 2>&1
	mv "$_o.part" "$_o"
}

# A worker walks a list and runs every entry no other worker has claimed yet.
worker() {
	EC_BROWSER_LOCK="$2"; export EC_BROWSER_LOCK
	while read -r _n _f; do
		mkdir "$OUT/claim.$_n" 2>/dev/null || continue
		run_one "$_f" "$OUT/$_n"
	done < "$1"
}

if [ -n "$SERIAL" ]; then
	worker "$OUT/all.list" "$BASE_LOCK"
else
	i=1
	while [ "$i" -le "$JOBS" ]; do worker "$OUT/node.list" "$BASE_LOCK" & i=$((i + 1)); done
	if [ -s "$OUT/browser.sorted" ]; then
		k=1
		while [ "$k" -le "$LANES" ]; do worker "$OUT/browser.sorted" "$BASE_LOCK.lane$k" & k=$((k + 1)); done
	fi
	wait
fi

# A browser harness that SKIPPED did not test anything. Many print SKIPPING and exit 0 when
# Chromium or playwright-core is missing, which would turn a broken browser install into a green
# gate; here that is a failure unless somebody asked for it with EC_ALLOW_BROWSER_SKIP=1.
RAN=0
FAILED=""
while read -r _n _f; do
	if [ -f "$OUT/$_n" ]; then
		cat "$OUT/$_n"
	else
		echo "=== $_f ==="
		echo "NEVER RAN -- no worker reached this harness. That is a defect in run_harnesses.sh."
		: > "$OUT/$_n.failed"
	fi
	if [ "${EC_ALLOW_BROWSER_SKIP:-}" != "1" ] && [ ! -f "$OUT/$_n.failed" ] \
		&& grep -q "^$_n " "$OUT/browser.list" && grep -q 'SKIPPING' "$OUT/$_n"; then
		echo "SKIPPED IS NOT PASSED -- this browser harness printed SKIPPING (no Chromium or no"
		echo "playwright-core?). Fix the browser install, or set EC_ALLOW_BROWSER_SKIP=1 to skip on purpose."
		: > "$OUT/$_n.failed"
	fi
	if [ -f "$OUT/$_n.failed" ]; then
		FAILED="$FAILED $(basename "$_f")"
	else
		RAN=$((RAN + 1))
	fi
done < "$OUT/all.list"

echo ""
echo "$RAN/$ASKED lpn harnesses passed."
if [ -n "$FAILED" ]; then
	echo "FAILED:$FAILED"
	echo "A harness that exits non-zero on its first line is usually calling something that MOVED."
	echo "If it passes alone but fails in company, the lanes are the suspect: re-run with"
	echo "ENGCALCS_HARNESS_JOBS=1 to get the old strictly-serial behaviour and compare."
	exit 1
fi
exit 0
