#!/usr/bin/env bash
#
# lang-log-stats.sh — Summarize the EngCalcs language-demand log.
#
# HOW TO RUN:
#   bash log/lang-log-stats.sh          (from the project root)
#   ./lang-log-stats.sh                 (from inside the log/ directory)
#
# WHAT IT READS:
#   engcalcs-lang.log in the same directory as this script (log/engcalcs-lang.log).
#   Written by logLanguageSelection() in lib/Language.lib.php.
#
# LOG FORMAT (tab-separated, one line per session/selection):
#   timestamp   lang   source   page
#   2026-06-17T21:04:33Z   es   get      Manning-Pipe-Flow
#   2026-06-17T21:05:11Z   fr   browser  Orifice
#   2026-06-18T09:12:44Z   es   cookie   Hazen-Williams
#
# SOURCES:
#   get     — user explicitly selected a language via ?lang=XX (every occurrence)
#   cookie  — returning user whose prior selection was saved in a cookie (once per session)
#   browser — raw first Accept-Language tag from the browser (e.g. es-MX, zh-TW), logged once ever
#             per browser via the ec_blang cookie; may not be a language we support
#
# WHY THREE SOURCES:
#   'get' answers: which languages do users actively seek out?
#   'browser' answers: what languages do visitors actually want? (raw, unsupported langs visible too)
#   'cookie' answers: which languages retain users across sessions?
#   Combining all three answers: what languages are in real demand overall?

LOG="$(dirname "$0")/engcalcs-lang.log"

if [ ! -f "$LOG" ]; then
    echo "Log file not found: $LOG"
    echo "(No language selections have been recorded yet.)"
    exit 1
fi

TOTAL=$(wc -l < "$LOG")
echo "========================================="
echo " EngCalcs language selection log stats"
echo " $LOG"
echo " $TOTAL total log entries"
echo "========================================="

echo ""
echo "--- Entries by source ---"
awk -F'\t' '{print $3}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand: explicit selections only (source=get) ---"
awk -F'\t' '$3=="get" {print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand: browser auto-detection (source=browser) ---"
awk -F'\t' '$3=="browser" {print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand: returning users with saved preference (source=cookie) ---"
awk -F'\t' '$3=="cookie" {print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Overall language demand: all sources combined ---"
awk -F'\t' '{print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Non-English demand by page (all sources) ---"
awk -F'\t' '$2!="en" {print $2"\t"$4}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Entries per day ---"
awk -F'\t' '{print substr($1,1,10)}' "$LOG" | sort | uniq -c

echo ""
echo "--- Most recent 10 entries ---"
tail -10 "$LOG"
