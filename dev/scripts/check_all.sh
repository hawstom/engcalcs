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
#   - Only TWO calculators have a worked-example test of their math: Manning Pipe Flow and Manning
#     Trapezoidal Channel, the two core ones (Task 292). Every other calculator is checked only for
#     running, for not emitting NaN, and for opening on a passing design -- which is real coverage
#     of the catastrophic failures, and no coverage at all of a wrong coefficient. Adding a worked
#     example is a per-page cost; spend it on the page being edited.
#   - Calculators whose results live in DYNAMIC ROWS (Branched-Network, Irrigation-Pressure,
#     Manning-Irregular, Weir-Flow-Irregular) are run, but their row results are not: building the
#     rows needs a richer DOM than dev/calc-spike/calc-page.js has. The smoke harness names them
#     as it goes rather than passing them silently.
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
# js/vendor/ is in the glob deliberately (2026-08-14): the old pattern was js/*.js only, so the
# vendored EPANET engine we ship to every visitor who enables it was never syntax-checked. The
# service worker is no longer a file here -- Task 318 replaced sw.js with the generated sw.php --
# so its syntax is checked by parsing what sw.php actually emits, inside the manifest check below.
run_check "js syntax (all shipped js)"   blocking sh -c 'for f in js/*.js js/vendor/*.js; do [ -f "$f" ] || continue; node --check "$f" >/dev/null || { echo "FAILED: $f"; exit 1; }; done'

# --- Does every page still produce well-formed HTML ------------------------------------------
run_check "html balance (every page)"    blocking php dev/scripts/html_balance_check.php

# --- Structural conventions that fail SILENTLY when broken ------------------------------------
# Both of these guard a defect that renders without erroring: an unsupplied pageConfig key shows
# the visitor "undefined", and the wrong .ec-help nesting gives touch users a one-character tap
# target. Neither is visible to the person who introduced it.
run_check "pageConfig php->js bridge"    blocking php dev/scripts/pageconfig_check.php
run_check "tip markup via helpers"       blocking php dev/scripts/tip_markup_check.php
# Task 319. A log column is written by a machine and read by awk, so a stray tab in visitor-supplied
# text forges a row that looks exactly like a real one. The defect was DUPLICATION -- the same three
# unfiltered lines pasted into five writers -- so this checks the helper's behaviour AND that nobody
# has pasted the raw read back in.
run_check "log columns cannot be forged" blocking php dev/scripts/browser_lang_tag_check.php
# Task 318, third of the same kind and the worst of the three while it was missing: the service
# worker precached bare paths while every page requested '?v=<filemtime>', so 22 of 25 precache
# entries were unreachable and the offline promise on About.php was simply false. Nothing rendered
# wrong, nothing errored, and the only place the defect existed was the GAP between two files. This
# renders real pages and diffs their asset URLs against what the worker will really cache.
run_check "service worker precache"      blocking php dev/scripts/sw_manifest_check.php
# Can this suite stand up ALONE? dev.hawsedc.com's first deploy came up with no blue form
# backgrounds and no table borders, because /hawsedc.css lives in the PARENT site and is not in this
# repo -- present on every machine anyone looks at, absent exactly where nobody looks until a deploy.
# LibreEPANET.org (Task 306) is by definition a standalone deploy and would have hit the same wall.
run_check "suite ships its own assets"   blocking php dev/scripts/standalone_assets_check.php
# Task 184 x Task 248. setProp() is the ONE write seam for an overridable property; a call site that
# writes el._diameter directly edits BASE from inside a scenario, silently, under every other
# scenario at once. That is not hypothetical -- the valve popup did it on five fields, and the two
# worktrees that produced it had DISJOINT FILE TERRITORY exactly as required. The file rule protects
# files; this protects the seam, which is what they actually shared.
run_check "scenario write seam"          blocking php dev/scripts/scenario_seam_check.php

# --- Language integrity: the part of this suite that costs 27x --------------------------------
run_check "lang syntax rules A-D"        blocking php dev/scripts/lang_syntax_validate.php
run_check "lang markup matches English"  blocking php dev/scripts/lang_tag_parity_check.php --strict
run_check "gloss pointers resolve"       blocking php dev/scripts/gloss_ref_check.php
run_check "layout tags match widgets" blocking php dev/scripts/layout_tag_check.php
run_check "coverage declaration"         blocking php dev/scripts/coverage_selftest.php
run_check "payload freshness"            blocking php dev/scripts/generate_translation_payloads.php --check
# Task 314. The served examples/ directory is GENERATED from dev/water-network-examples/, so it can
# go stale exactly the way the translation payloads can: someone edits an example, and the gallery
# keeps serving the old one with no symptom until a visitor opens it. Also catches a whitelisted
# example with no description, which is a card with a blank subtitle.
run_check "examples library fresh"       blocking php dev/scripts/generate_examples.php --check

# --- The roadmap's own integrity ---------------------------------------------------------------
# A task ID is a permanent handle that prose cites by number; a duplicate makes every such
# reference ambiguous. And priority 0 is the file's only signal for "closed", so a blocked task
# parked at 0, or a done one never moved under `## Completed`, both read as finished from outside.
run_check "roadmap ids and closure"      blocking php dev/scripts/roadmap_id_check.php

# --- lpn solver and editor --------------------------------------------------------------------
# Count derived, not typed: the label said "(12)" while 15 scripts were running, because
# run_harnesses.sh globs and nothing tied the number to the glob. A stale count in a checklist is
# the same defect this file exists to remove.
LPN_HARNESS_N=$(ls dev/lpn-spike/*harness*.js dev/lpn-spike/validate*.js 2>/dev/null | wc -l | tr -d ' ')
run_check "lpn harnesses ($LPN_HARNESS_N)"  blocking sh dev/scripts/run_harnesses.sh

# --- the other 19 calculators ------------------------------------------------------------------
# Task 292. Runs every calculator page's own pageCalculator against its own rendered HTML: all of
# them on their factory defaults in both unit presets, plus worked examples for the two core
# calculators (mpf, mtc). Same derived count as above -- never typed.
CALC_HARNESS_N=$(ls dev/calc-spike/*harness*.js 2>/dev/null | wc -l | tr -d ' ')
run_check "calculator harnesses ($CALC_HARNESS_N)" blocking sh dev/scripts/run_calc_harnesses.sh

# --- Advisory: real findings, but judgement calls that must not block a commit ------------------
run_check "key hygiene"                  advisory php dev/scripts/key_hygiene_check.php --strict
run_check "size budget"                  advisory php dev/scripts/size_budget_check.php --strict
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
echo "Not covered here, and worth knowing: only mpf and mtc have a worked-example test of their"
echo "math -- the other calculators are checked for running, not for being right -- and nothing"
echo "above reads code for design or logic errors. /code-review covers that, is billed, and only a"
echo "human can start it."
exit 0
