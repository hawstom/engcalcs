#!/usr/bin/env bash
#
# lang-log-stats.sh — Summarize the EngCalcs language-demand and calculator-usage logs.
#
# HOW TO RUN:
#   bash log/lang-log-stats.sh          (from the project root)
#   ./lang-log-stats.sh                 (from inside the log/ directory)
#
# WHAT IT READS — two logs answering two different questions:
#
#   1. engcalcs-lang.log — RAW language demand/preference signal (includes bots,
#      bounced visits, and unsupported languages). Written by logLanguageSelection()
#      in lib/Language.lib.php. Tab-separated, one line per session/selection:
#        timestamp   lang   source   page
#        2026-06-17T21:04:33Z   es      get      Manning-Pipe-Flow
#        2026-06-17T21:05:11Z   es-MX   browser  Orifice
#        2026-06-18T09:12:44Z   es      cookie   Hazen-Williams
#      Sources:
#        get     — user explicitly selected a language via ?lang=XX (every occurrence)
#        cookie  — returning user whose prior selection was saved in a cookie (once per session)
#        browser — raw first Accept-Language tag from the browser (e.g. es-MX, zh-TW), logged once
#                  ever per browser via the ec_blang cookie; may not be a language we support
#      SUB-LANGUAGE NOTE: browser entries may contain subtags (es-MX, zh-TW, pt-BR, en-US, etc.).
#      get/cookie entries are always plain 2-letter codes. Most sections aggregate subtags to
#      their primary code (es-MX → es) so all sources are comparable; the raw browser breakdown
#      is also shown separately.
#      WHY THREE SOURCES: 'get' = which languages do users actively seek out? 'browser' = what
#      languages do visitors actually want (raw, unsupported langs visible too, incl. bounces
#      that never used a calculator)? 'cookie' = which languages retain users across sessions?
#
#   2. engcalcs-calc-usage.log — CONFIRMED HUMAN usage signal (bots essentially never reach this;
#      it only fires after a real, user-triggered calculation at least 10s after page load).
#      Written by log-calc-event.php via a navigator.sendBeacon call from
#      EngCalcs.maybeLogCalcUsage() in js/Calculators.lib.js. Deduped once per (session, page).
#      Tab-separated, one line per confirmed calculator use:
#        timestamp   page   lang   browser_lang
#        2026-07-15T14:02:11Z   Manning-Pipe-Flow   es   es-MX
#      This answers: what calculators are humans actually using, and in what served language —
#      i.e. "AWStats with the robots pruned" — plus a raw browser_lang column for cross-checking
#      against engcalcs-lang.log's browser source among only-confirmed-human visits.
#
# WHY BOTH LOGS: engcalcs-lang.log can't tell you which visits were bots vs. bounces vs. real
# usage; engcalcs-calc-usage.log can't tell you about visitors who left before calculating
# (including demand for languages we don't even support yet). Combined, they also let you
# estimate an engagement/bot-noise ratio per calculator — see the last section below.

LOG="$(dirname "$0")/engcalcs-lang.log"
USAGE_LOG="$(dirname "$0")/engcalcs-calc-usage.log"

if [ ! -f "$LOG" ]; then
    echo "Log file not found: $LOG"
    echo "(No language selections have been recorded yet.)"
    exit 1
fi

TOTAL=$(wc -l < "$LOG")
FIRST_DATE=$(head -1 "$LOG" | awk -F'\t' '{print $1}')
echo "========================================="
echo " EngCalcs language selection log stats"
echo " $LOG"
echo " Logging began: $FIRST_DATE"
echo " $TOTAL total log entries"
echo "========================================="

echo ""
echo "--- Entries by source ---"
awk -F'\t' '{print $3}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand: explicit selections only (source=get) ---"
awk -F'\t' '$3=="get" {print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand: browser first-preference, aggregated (source=browser) ---"
awk -F'\t' '$3=="browser" {split($2,a,"-"); print a[1]}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand: browser first-preference, raw subtags (source=browser) ---"
awk -F'\t' '$3=="browser" {print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand: returning users with saved preference (source=cookie) ---"
awk -F'\t' '$3=="cookie" {print $2}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Overall language demand: all sources combined, aggregated ---"
awk -F'\t' '{split($2,a,"-"); print a[1]}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Non-English demand by page, aggregated (all sources) ---"
awk -F'\t' '{split($2,a,"-"); if (a[1]!="en") print a[1]"\t"$4}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Entries per day ---"
awk -F'\t' '{print substr($1,1,10)}' "$LOG" | sort | uniq -c

echo ""
echo "--- Most recent 10 entries ---"
tail -10 "$LOG"

if [ ! -f "$USAGE_LOG" ]; then
    echo ""
    echo "========================================="
    echo " No confirmed-human calculator-usage log yet: $USAGE_LOG"
    echo " (No one has confirmed a calculation since this feature shipped.)"
    echo "========================================="
    exit 0
fi

USAGE_TOTAL=$(wc -l < "$USAGE_LOG")
echo ""
echo "========================================="
echo " EngCalcs confirmed-human calculator-usage stats"
echo " $USAGE_LOG"
echo " $USAGE_TOTAL total confirmed-human usage entries"
echo "========================================="

echo ""
echo "--- Calculator demand (confirmed human use, i.e. AWStats with robots pruned) ---"
awk -F'\t' '{print $2}' "$USAGE_LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Language demand (confirmed human use, served language) ---"
awk -F'\t' '{print $3}' "$USAGE_LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Browser raw-preference among confirmed-human users, aggregated ---"
awk -F'\t' '{split($4,a,"-"); if (a[1]!="") print a[1]}' "$USAGE_LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Confirmed-human entries per day ---"
awk -F'\t' '{print substr($1,1,10)}' "$USAGE_LOG" | sort | uniq -c

echo ""
echo "--- Most recent 10 confirmed-human entries ---"
tail -10 "$USAGE_LOG"

echo ""
echo "--- Engagement rate by calculator (lang-log reach vs. confirmed-human use) ---"
echo "    (rough bot/bounce-noise estimate: low ratio = mostly bots/bounces on that page)"
{
    awk -F'\t' '{print $4}' "$LOG" | sort | uniq -c | awk '{print $2"\treach\t"$1}'
    awk -F'\t' '{print $2}' "$USAGE_LOG" | sort | uniq -c | awk '{print $2"\tused\t"$1}'
} | awk -F'\t' '
    {
        if ($2=="reach") reach[$1]=$3
        else used[$1]=$3
        pages[$1]=1
    }
    END {
        for (p in pages) {
            r = (p in reach) ? reach[p] : 0
            u = (p in used) ? used[p] : 0
            rate = (r > 0) ? (u/r)*100 : -1
            printf "%.4f\t%s\t%d\t%d\t%s\n", rate, p, r, u, (rate >= 0 ? sprintf("%.0f%%", rate) : "n/a")
        }
    }' | sort -t$'\t' -k1 -rn | awk -F'\t' 'BEGIN {printf "%-28s %10s %10s %10s\n", "page", "reach", "used", "rate"} {printf "%-28s %10d %10d %10s\n", $2, $3, $4, $5}'
