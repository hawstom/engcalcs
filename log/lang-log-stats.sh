#!/usr/bin/env bash
#
# lang-log-stats.sh — Summarize the EngCalcs language-demand log.
#
# HOW TO RUN:
#   bash lang-log-stats.sh
#   ./lang-log-stats.sh        (if already executable: chmod +x lang-log-stats.sh)
#
# WHAT IT READS:
#   engcalcs-lang.log in the same directory as this script (log/engcalcs-lang.log).
#   Each line is written when a user explicitly selects a language via ?lang=XX.
#   Format: ISO-8601-UTC-timestamp <TAB> lang-code <TAB> page-basename
#   Example: 2026-06-17T21:04:33Z    es    Manning-Pipe-Flow
#
# HOW THE LOG GROWS:
#   logLanguageSelection() in lib/Language.lib.php appends one line per
#   explicit ?lang=XX request. Browser auto-detection is NOT logged.

LOG="$(dirname "$0")/engcalcs-lang.log"

if [ ! -f "$LOG" ]; then
    echo "Log file not found: $LOG"
    echo "(No explicit language selections have been recorded yet.)"
    exit 1
fi

TOTAL=$(wc -l < "$LOG")
echo "========================================="
echo " EngCalcs language selection log stats"
echo " $LOG"
echo " $TOTAL total explicit selections"
echo "========================================="

echo ""
echo "--- Selections by language (most popular first) ---"
awk -F'\t' '{print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Selections by page (most popular first) ---"
awk -F'\t' '{print $3}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Selections by language + page (most popular first) ---"
awk -F'\t' '{print $2"\t"$3}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Selections per day ---"
awk -F'\t' '{print substr($1,1,10)}' "$LOG" | sort | uniq -c

echo ""
echo "--- Most recent 10 selections ---"
tail -10 "$LOG"
