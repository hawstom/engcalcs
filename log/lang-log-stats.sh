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
#        view    — a later page in a session whose language was already pinned by get/cookie/
#                  browser above (once per session per page). Exists only so the page/lang
#                  breakdown covers every page a session visits, matching the per-page dedup in
#                  engcalcs-human-view.log below -- the "language demand" sections exclude it (it
#                  would just double-count the session's already-counted language); the funnel
#                  section at the bottom deliberately includes it, since that's what makes "reach"
#                  comparable to "human" there.
#      SUB-LANGUAGE NOTE: browser entries may contain subtags (es-MX, zh-TW, pt-BR, en-US, etc.).
#      get/cookie entries are always plain 2-letter codes. Most sections aggregate subtags to
#      their primary code (es-MX → es) so all sources are comparable; the raw browser breakdown
#      is also shown separately.
#      WHY THREE SOURCES: 'get' = which languages do users actively seek out? 'browser' = what
#      languages do visitors actually want (raw, unsupported langs visible too, incl. bounces
#      that never used a calculator)? 'cookie' = which languages retain users across sessions?
#
#   2. engcalcs-human-view.log — CONFIRMED HUMAN page-view signal, the "window shopping" tier
#      (bots essentially never reach this; it only fires once the visitor's SESSION -- not just
#      this page -- is at least 10s old, whether or not they ever calculate). Written by
#      log-human-view.php via navigator.sendBeacon from EngCalcs.maybeLogHumanView() in
#      js/Calculators.lib.js. Deduped once per (session, page, lang).
#      Tab-separated, one line per confirmed-human page view:
#        timestamp   page   lang   browser_lang
#        2026-07-15T14:01:05Z   Manning-Pipe-Flow   es   es-MX
#      This answers: how many real (non-bot) humans reached this page, regardless of whether
#      they went on to calculate.
#
#   3. engcalcs-calc-usage.log — CONFIRMED HUMAN usage signal (bots essentially never reach this;
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
# WHY ALL THREE LOGS: engcalcs-lang.log can't tell you which visits were bots vs. bounces vs.
# real usage; engcalcs-human-view.log can't tell you who actually got value out of the page vs.
# who just looked and left; engcalcs-calc-usage.log can't tell you about visitors who left before
# calculating (including demand for languages we don't even support yet). Combined, they form a
# funnel: raw reach -> confirmed-human view ("% human") -> confirmed-human calculation ("% used")
# — see the last section below.

LOG="$(dirname "$0")/engcalcs-lang.log"
VIEW_LOG="$(dirname "$0")/engcalcs-human-view.log"
USAGE_LOG="$(dirname "$0")/engcalcs-calc-usage.log"

if [ ! -f "$LOG" ]; then
    echo "Log file not found: $LOG"
    echo "(No page access has been recorded yet.)"
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
echo "--- Overall language demand: all sources combined, aggregated (excludes source=view -- see below) ---"
awk -F'\t' '$3!="view" {split($2,a,"-"); print a[1]}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Non-English demand by page, aggregated (excludes source=view -- see below) ---"
awk -F'\t' '$3!="view" {split($2,a,"-"); if (a[1]!="en") print a[1]"\t"$4}' "$LOG" | sort | uniq -c | sort -rn

echo ""
echo "--- Entries per day ---"
awk -F'\t' '{print substr($1,1,10)}' "$LOG" | sort | uniq -c

echo ""
echo "--- Most recent 10 entries ---"
tail -10 "$LOG"

if [ -f "$VIEW_LOG" ]; then
    VIEW_TOTAL=$(wc -l < "$VIEW_LOG")
    echo ""
    echo "========================================="
    echo " EngCalcs confirmed-human page-view stats (\"window shopping\")"
    echo " $VIEW_LOG"
    echo " $VIEW_TOTAL total confirmed-human page-view entries"
    echo "========================================="

    echo ""
    echo "--- Page reach (confirmed human, calculated or not) ---"
    awk -F'\t' '{print $2}' "$VIEW_LOG" | sort | uniq -c | sort -rn

    echo ""
    echo "--- Confirmed-human page views per day ---"
    awk -F'\t' '{print substr($1,1,10)}' "$VIEW_LOG" | sort | uniq -c

    echo ""
    echo "--- Most recent 10 confirmed-human page-view entries ---"
    tail -10 "$VIEW_LOG"
else
    echo ""
    echo "========================================="
    echo " No confirmed-human page-view log yet: $VIEW_LOG"
    echo " (No one has dwelt on a page since this feature shipped.)"
    echo "========================================="
fi

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
echo "--- Funnel by calculator: reach -> confirmed-human view (% human) -> confirmed-human use (% used) ---"
echo "    reach = raw engcalcs-lang.log page mentions (includes bots/bounces)"
echo "    humans shopping = confirmed-human page views -- a page view is only"
echo "            logged once the visitor's SESSION (not just this page) has been open >=10s,"
echo "            via navigator.sendBeacon from js/Calculators.lib.js; this filters out bots and"
echo "            instant bounces without requiring a calculation, so window shoppers who read the"
echo "            page and leave still count as human. Deduped once per (session, page, lang)."
echo "    humans using = confirmed-human calculations"
echo "    %shopping = shopping/reach -- a LOWER BOUND on true human reach, not an estimate of it: a real"
echo "             human who bounces inside the first 10s of a new session is indistinguishable"
echo "             from a bot and can't be confirmed, so they count against %human too. Low %human"
echo "             means 'mostly bots, or mostly fast bounces, or both' -- not 'mostly bots.'"
echo "    %using = using/shopping (of confirmed humans who reached the page, how many calculated)"
echo ""
echo "    READ WITH CARE (added 2026-08-03):"
echo "      * There is a BOT FLOOR around 900 reach -- nearly every page sits at 830-1200 no matter"
echo "        how many humans it gets. Only the top one or two pages rise above it. So for every"
echo "        other page %shopping is a signal-to-noise ratio, NOT a conversion rate, and driving"
echo "        it up is not a goal."
echo "      * Below roughly 40 humans shopping, %using is NOISE. A page with 1-9 humans cannot"
echo "        support a decision; reading its %using as failure is a mistake. What such a page"
echo "        needs is traffic, or an honest decision that it is niche -- not a metric."
{
    awk -F'\t' '{print $4}' "$LOG" | sort | uniq -c | awk '{print $2"\treach\t"$1}'
    [ -f "$VIEW_LOG" ] && awk -F'\t' '{print $2}' "$VIEW_LOG" | sort | uniq -c | awk '{print $2"\thuman\t"$1}'
    awk -F'\t' '{print $2}' "$USAGE_LOG" | sort | uniq -c | awk '{print $2"\tused\t"$1}'
} | awk -F'\t' '
    {
        if ($2=="reach") reach[$1]=$3
        else if ($2=="human") human[$1]=$3
        else used[$1]=$3
        pages[$1]=1
    }
    END {
        for (p in pages) {
            r = (p in reach) ? reach[p] : 0
            h = (p in human) ? human[p] : 0
            u = (p in used) ? used[p] : 0
            hrate = (r > 0) ? (h/r)*100 : -1
            urate = (h > 0) ? (u/h)*100 : -1
            printf "%.4f\t%s\t%d\t%d\t%d\t%s\t%s\n", hrate, p, r, h, u, \
                (hrate >= 0 ? sprintf("%.0f%%", hrate) : "n/a"), \
                (urate >= 0 ? sprintf("%.0f%%", urate) : "n/a")
        }
    }' | sort -t$'\t' -k1 -rn | awk -F'\t' 'BEGIN {printf "%-28s %10s %10s %10s %11s %11s\n", "page", "reach", "humans", "humans", "%shopping", "%using"; printf "%-28s %10s %10s %10s %11s %11s\n", "", "", "shopping", "using", "of reach", "of shopping"} {printf "%-28s %10d %10d %10d %11s %11s\n", $2, $3, $4, $5, $6, $7}'

echo ""
echo "--- Funnel by language: reach -> confirmed-human view (% human) -> confirmed-human use (% used) ---"
echo "    Same three tiers and same %human/%used caveats as the by-calculator funnel above, grouped"
echo "    by served language instead of page. reach aggregates engcalcs-lang.log subtags (es-MX -> es)"
echo "    to match human/used, which only ever log the plain 2-letter served language."
{
    awk -F'\t' '{split($2,a,"-"); print a[1]}' "$LOG" | sort | uniq -c | awk '{print $2"\treach\t"$1}'
    [ -f "$VIEW_LOG" ] && awk -F'\t' '{print $3}' "$VIEW_LOG" | sort | uniq -c | awk '{print $2"\thuman\t"$1}'
    awk -F'\t' '{print $3}' "$USAGE_LOG" | sort | uniq -c | awk '{print $2"\tused\t"$1}'
} | awk -F'\t' '
    {
        if ($2=="reach") reach[$1]=$3
        else if ($2=="human") human[$1]=$3
        else used[$1]=$3
        langs[$1]=1
    }
    END {
        for (l in langs) {
            r = (l in reach) ? reach[l] : 0
            h = (l in human) ? human[l] : 0
            u = (l in used) ? used[l] : 0
            hrate = (r > 0) ? (h/r)*100 : -1
            urate = (h > 0) ? (u/h)*100 : -1
            printf "%.4f\t%s\t%d\t%d\t%d\t%s\t%s\n", hrate, l, r, h, u, \
                (hrate >= 0 ? sprintf("%.0f%%", hrate) : "n/a"), \
                (urate >= 0 ? sprintf("%.0f%%", urate) : "n/a")
        }
    }' | sort -t$'\t' -k1 -rn | awk -F'\t' 'BEGIN {printf "%-28s %10s %10s %10s %11s %11s\n", "lang", "reach", "humans", "humans", "%shopping", "%using"; printf "%-28s %10s %10s %10s %11s %11s\n", "", "", "shopping", "using", "of reach", "of shopping"} {printf "%-28s %10d %10d %10d %11s %11s\n", $2, $3, $4, $5, $6, $7}'
