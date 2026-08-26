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
#   - EVERY calculator now has a worked-example test of its math except rc, whose Robinson
#     coefficients are unverified (the paper is paywalled and the free copy is a page scan). The
#     last five were anchored 2026-08-21 and TWO OF THEM WERE WRONG -- Canal Seepage's currency
#     inputs converted backwards (Task 473) and Manning Irregular's region Froude number mixed a
#     region area with a segment top width (Task 474). That is what a worked example buys, and it
#     is why adding one is the first thing to spend on a page being edited.
#   - Calculators whose results live in DYNAMIC ROWS (Branched-Network, Irrigation-Pressure,
#     Manning-Irregular, Weir-Flow-Irregular) build their rows in their OWN per-page harness now;
#     the SMOKE harness still does not, and names them
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
# Shell was the one language here that nothing parsed, and the gap had teeth: log/lang-log-stats.sh
# is 600 lines of bash whose only reader is a human running it by hand, and this file is another.
# A typo in either surfaces as a broken run at the moment somebody wanted an answer, not before.
run_check "shell syntax (all .sh)"       blocking sh -c 'find . -name "*.sh" -not -path "./node_modules/*" -not -path "./dev/browser-pass/node_modules/*" -print0 | xargs -0 -n1 bash -n || { echo "A script above failed bash -n; the parser message names the file and the line."; exit 1; }'

# --- Does every page still produce well-formed HTML ------------------------------------------
run_check "html balance (every page)"    blocking php dev/scripts/html_balance_check.php

# --- Structural conventions that fail SILENTLY when broken ------------------------------------
# Both of these guard a defect that renders without erroring: an unsupplied pageConfig key shows
# the visitor "undefined", and the wrong .ec-help nesting gives touch users a one-character tap
# target. Neither is visible to the person who introduced it.
run_check "pageConfig php->js bridge"    blocking php dev/scripts/pageconfig_check.php
run_check "tip markup via helpers"       blocking php dev/scripts/tip_markup_check.php
# Task 478. Tabbing down a calculator walked sideways through thirty one-character "X" links --
# 35-43% of every keyboard stop on the worst pages, with no keyboard way to bring a line back. This
# renders each page and asserts, blocking, that the per-line hide control costs at most ONE stop;
# it prints the per-page stop table as advisory so the number is measured rather than guessed.
run_check "form keyboard stops"          blocking php dev/scripts/focus_order_check.php
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
run_check "canonical origin whitelist"   blocking php dev/scripts/canonical_origin_check.php
# Task 534. A share card fails where nobody on this side ever looks: you do not paste links to your
# own site into Facebook, so a relative og:image (which every network drops silently) or a card file
# renamed out from under the tag stays broken until a stranger mentions it. This renders every page
# and checks the URL is absolute, on an origin we serve, and backed by a real file of the pixel size
# the tags declare.
run_check "social card image"            blocking php dev/scripts/social_card_check.php
# The vendored third-party files are what the manifest says they are, nothing ships undeclared, and
# package.json agrees with what is committed. js/vendor/README.md documented all this in prose and
# nothing checked it, so the record and the bytes were free to drift apart in silence (Task 413).
run_check "vendored code integrity"      blocking php dev/scripts/vendor_integrity_check.php
# Task 184 x Task 248. setProp() is the ONE write seam for an overridable property; a call site that
# writes el._diameter directly edits BASE from inside a scenario, silently, under every other
# scenario at once. That is not hypothetical -- the valve popup did it on five fields, and the two
# worktrees that produced it had DISJOINT FILE TERRITORY exactly as required. The file rule protects
# files; this protects the seam, which is what they actually shared.
run_check "scenario write seam"          blocking php dev/scripts/scenario_seam_check.php
# Unit conversion factors, re-derived from the exact international definitions. The suite once held
# FOUR different feet at once (ft, ft2, ft3 and ft3ps each implying a different one, up to 47 ppm
# apart) because each factor was typed independently at 3-5 significant figures. A round trip in ONE
# unit hides that completely, so nothing else here could see it. Also checks that the pressure
# factors and EngCalcs.G use the same gravity.
run_check "unit conversion factors"      blocking php dev/scripts/unit_factor_check.php
run_check "coordinate order"             blocking php dev/scripts/coord_order_check.php

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
# Task 504. dev/features.md is generated from the hand-written dev/features-source.md, and this
# also proves every ID a feature cites is genuinely closed -- so the list cannot claim something
# that never shipped, and cannot go quietly stale after somebody edits the source.
run_check "features list fresh"          blocking php dev/scripts/generate_features.php --check

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
run_check "example folder"               advisory php dev/scripts/example_folder_check.php
# One project mode, ONE name inside each language. Advisory because the 14 findings it opens
# with are pre-existing translation work, not a regression anybody just caused.
run_check "mode names"                   advisory php dev/scripts/mode_name_check.php
run_check "key hygiene"                  advisory php dev/scripts/key_hygiene_check.php --strict
run_check "size budget"                  advisory php dev/scripts/size_budget_check.php --strict
# Task 481. Three false "not built yet" claims shipped in one day, two found by Tom and none by any
# check. This cites-a-closed-task scan is the mechanical half of that shape; the ranking is what
# keeps it short. Advisory by construction -- citing a closed task as a RECORD is legitimate, so
# only a human can tell a stale claim from a correct citation.
run_check "stale claim worklist"        advisory php dev/scripts/stale_claim_check.php
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
echo "Not covered here, and worth knowing: rc's Robinson coefficients are still unverified (the"
echo "paper is paywalled), and nothing above reads code for design or logic errors."
echo "/code-review covers that, is billed, and only a human can start it."
exit 0
