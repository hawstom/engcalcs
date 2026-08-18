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
#                  'anon' = a page load by somebody who has not consented to being counted once
#                  rather than every time (ROADMAP Task 286) -- undeduplicated by necessity, kept
#                  out of every section above and reported in the visits section of its own.
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
#   4. engcalcs-contact-send.log — CONFIRMED SENT contact message (ROADMAP Task 206). Written
#      server-side by formmail.php in its mail() success branch, not by a beacon: a beacon fired
#      from the submit handler races the navigation and cannot know whether the send succeeded,
#      so it would count attempts rather than sends. Same four columns as the two logs above,
#      with page fixed at 'contact' so these rows divide cleanly by the contact views in
#      engcalcs-human-view.log. Not deduped — a second message from the same person is a second
#      send. This answers the only question the suite's mission actually cares about: are people
#      not clicking the invitation, or clicking it and then not writing?
#
#   6. engcalcs-signal.log — BEHAVIOUR SIGNALS (ROADMAP Tasks 216 and 200). Written by
#      log-signal-event.php from EngCalcs.logSignal(). The four logs above count PEOPLE and divide
#      into each other as a funnel; this one counts what those people then DID and is never divided
#      by anything but the human-view count. Six columns: the usual four, then event, then detail.
#        outbound  a reference link out of /engcalcs/ was clicked; detail = host + path.
#        touch     they changed some input on the page; detail = 'input'.
#        units     a unit was chosen; detail = 'preset:us' | 'preset:si' | '<family>:<unit>'.
#        repeat    detail = 'return' — this browser had already left work behind on this page: its
#                  input cookie on a calculator, a saved project document on Looped-Network. Means
#                  USED, not opened. Stores nothing new; reads exempt storage. CONSENTING VISITORS
#                  ONLY (an analytics READ still needs consent), so the denominator for any repeat
#                  rate is the consented rows, never all of them.
#        lpn       detail = 'first:<example|element|backdrop|import>' or 'diag:<code>'.
#        share     the share control under the Printable Title was used; detail = 'copy' (the
#                  clipboard took the link) or 'manual' (no clipboard, so the link was shown to be
#                  copied by hand). Says the control was USED — never that anyone opened the link.
#      DEDUPED PER PAGE LOAD, IN THE PAGE'S OWN MEMORY — not per visit like the logs above, whose
#      ec_seen digit is full at five bits (the consent banner promises "a single digit per page").
#      So a visitor who reloads and clicks the same reference twice is two rows. Compare these
#      counts against each other, not against the deduplicated view counts, unless the section
#      below says otherwise.
#
#   5. engcalcs-title.log — NAMED CALCULATION (ROADMAP Task 215). Written by log-title-event.php
#      from EngCalcs.maybeLogTitleEvent() when a visitor types a Printable Title or Subtitle.
#      The four usual columns plus a fifth, 'title' or 'subtitle'. Deduped per (session, page,
#      field); the text typed is never sent or stored. No dwell gate, unlike the two beacons
#      above — typing into a text field is already the human proof their 10s timer stands in for.
#      This answers the question closest to the suite's reason for existing: how many people
#      intend to put a result in front of another human?
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
# The contact funnel (ROADMAP Task 206): views of contact.php live in VIEW_LOG under page
# 'contact', and successful sends are written server-side by formmail.php. Two numbers, reported
# together in their own section below, because the ratio between them is the whole point.
SEND_LOG="$(dirname "$0")/engcalcs-contact-send.log"
# Named calculations (ROADMAP Task 215): someone typed a Printable Title or Subtitle, i.e. told us
# they mean to show this to another person. Reported in its own section below.
TITLE_LOG="$(dirname "$0")/engcalcs-title.log"
# Behaviour signals (ROADMAP Tasks 216 and 200): what people did, as opposed to how many of them
# there were. Its own section below, deliberately after the funnel -- it explains the funnel's
# numbers rather than joining them.
SIGNAL_LOG="$(dirname "$0")/engcalcs-signal.log"

# ---- TWO BUCKETS, AND THEY ARE NEVER ADDED TOGETHER (ROADMAP Task 286) ----
#
# Since the consent banner shipped, every one of these logs carries two kinds of row:
#
#   visitors  Rows written for somebody who agreed to being counted once rather than every time.
#             A session cookie makes de-duplication possible, so one person visiting a page four
#             times is one row. These are the numbers this report has always shown, unchanged, and
#             they are the only ones a RATIO may be computed from.
#   visits    Rows written for everybody else -- refused, or has not answered yet. Nothing is
#             stored on their device, so there is nothing to de-duplicate against: one row per
#             page load. Marked by a trailing "visit" column, and by source=anon in the language
#             log.
#
# Tom, 2026-08-11, on what to do with the second group: *"do we report them in a separate bucket...
# I don't think that we want to completely ignore them."* Right on both halves, and the two halves
# are the whole design. Ignoring them would throw away real people. Adding them to the visitors
# would silently turn every de-duplicated count into a mixture of people and page loads, and every
# percentage below into a number with no meaning at all -- a page whose non-consenting visitors
# reload a lot would simply look more popular.
#
# So: every section below reads the VISITORS bucket only, by way of a filtered copy, and the visits
# bucket gets one section of its own. If you add a section, it reads $LOG/$VIEW_LOG/$USAGE_LOG/
# $TITLE_LOG like every other section and is filtered for free. Reach for a $RAW_ or $VISITS_ path
# only when you specifically mean the other bucket.
RAW_LOG="$LOG"
RAW_VIEW_LOG="$VIEW_LOG"
RAW_USAGE_LOG="$USAGE_LOG"
RAW_TITLE_LOG="$TITLE_LOG"
RAW_SIGNAL_LOG="$SIGNAL_LOG"

if [ ! -f "$RAW_LOG" ]; then
    echo "Log file not found: $RAW_LOG"
    echo "(No page access has been recorded yet.)"
    exit 1
fi

EC_BUCKET_TMP=$(mktemp -d)
trap 'rm -rf "$EC_BUCKET_TMP"' EXIT INT TERM

# $1 = log path, $2 = 1-based index of the trailing bucket column in THAT log. A row shorter than
# that column is a visitor row -- which is correct twice over: it is what every row written before
# this task was, and it is what a deduplicated row still is today, since the marker is emitted only
# for the visits bucket precisely so the existing history stays byte-identical.
ec_split_bucket() {
    [ -f "$1" ] || return 0
    awk -F'\t' -v c="$2" '$c != "visit"' "$1" > "$EC_BUCKET_TMP/$(basename "$1")"
    awk -F'\t' -v c="$2" '$c == "visit"' "$1" > "$EC_BUCKET_TMP/visits-$(basename "$1")"
}
ec_split_bucket "$RAW_LOG" 5
ec_split_bucket "$RAW_VIEW_LOG" 5
ec_split_bucket "$RAW_USAGE_LOG" 5
ec_split_bucket "$RAW_TITLE_LOG" 6   # the title log carries 'title'/'subtitle' in column 5
ec_split_bucket "$RAW_SIGNAL_LOG" 7  # the signal log carries event in column 5 and detail in 6

LOG="$EC_BUCKET_TMP/$(basename "$RAW_LOG")"
[ -f "$RAW_VIEW_LOG" ]  && VIEW_LOG="$EC_BUCKET_TMP/$(basename "$RAW_VIEW_LOG")"
[ -f "$RAW_USAGE_LOG" ] && USAGE_LOG="$EC_BUCKET_TMP/$(basename "$RAW_USAGE_LOG")"
[ -f "$RAW_TITLE_LOG" ] && TITLE_LOG="$EC_BUCKET_TMP/$(basename "$RAW_TITLE_LOG")"
[ -f "$RAW_SIGNAL_LOG" ] && SIGNAL_LOG="$EC_BUCKET_TMP/$(basename "$RAW_SIGNAL_LOG")"
VISITS_LOG="$EC_BUCKET_TMP/visits-$(basename "$RAW_LOG")"
VISITS_VIEW_LOG="$EC_BUCKET_TMP/visits-$(basename "$RAW_VIEW_LOG")"
VISITS_USAGE_LOG="$EC_BUCKET_TMP/visits-$(basename "$RAW_USAGE_LOG")"
VISITS_SIGNAL_LOG="$EC_BUCKET_TMP/visits-$(basename "$RAW_SIGNAL_LOG")"

# Counted from the raw file: "total log entries" means what it says, both buckets.
TOTAL=$(wc -l < "$RAW_LOG")
FIRST_DATE=$(head -1 "$RAW_LOG" | awk -F'\t' '{print $1}')
# Printed at the END of the report (Tom, 2026-08-03: the report is long, and the coverage dates
# belong at the bottom, not the top). A function, not a trailing block, because the script exits
# early when there is no usage log yet -- and the footer has to print on that path too.
print_footer() {
    echo ""
    echo "========================================="
    echo " Coverage — each tier began logging on a DIFFERENT date"
    echo "========================================="
    echo "    Compare tiers with this in mind: if the usage log started after the page-view log, then"
    echo "    %using is understated for every row above, because some counted shoppers arrived before"
    echo "    a calculation could be recorded at all. Check these three dates before treating any"
    echo "    conversion rate as real."
    echo ""
    printf "    %-34s %12s  %s\n" "log" "entries" "first entry"
    printf "    %-34s %12s  %s\n" "$(basename "$RAW_LOG")" "$TOTAL" "$FIRST_DATE"
    if [ -f "$RAW_VIEW_LOG" ]; then
        printf "    %-34s %12s  %s\n" "$(basename "$RAW_VIEW_LOG")" "$(wc -l < "$RAW_VIEW_LOG")" "$(head -1 "$RAW_VIEW_LOG" | awk -F'\t' '{print $1}')"
    fi
    if [ -f "$RAW_USAGE_LOG" ]; then
        printf "    %-34s %12s  %s\n" "$(basename "$RAW_USAGE_LOG")" "$(wc -l < "$RAW_USAGE_LOG")" "$(head -1 "$RAW_USAGE_LOG" | awk -F'\t' '{print $1}')"
    fi
    if [ -f "$SEND_LOG" ]; then
        printf "    %-34s %12s  %s\n" "$(basename "$SEND_LOG")" "$(wc -l < "$SEND_LOG")" "$(head -1 "$SEND_LOG" | awk -F'\t' '{print $1}')"
    fi
    if [ -f "$RAW_TITLE_LOG" ]; then
        printf "    %-34s %12s  %s\n" "$(basename "$RAW_TITLE_LOG")" "$(wc -l < "$RAW_TITLE_LOG")" "$(head -1 "$RAW_TITLE_LOG" | awk -F'\t' '{print $1}')"
    fi
    if [ -f "$RAW_SIGNAL_LOG" ]; then
        printf "    %-34s %12s  %s\n" "$(basename "$RAW_SIGNAL_LOG")" "$(wc -l < "$RAW_SIGNAL_LOG")" "$(head -1 "$RAW_SIGNAL_LOG" | awk -F'\t' '{print $1}')"
    fi
    echo ""
}

echo "========================================="
echo " EngCalcs language selection log stats"
echo " $RAW_LOG"
echo " $TOTAL total log entries"
echo " (coverage dates are in the footer at the end of this report)"
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

echo ""
echo "========================================="
echo " Visits by people we may not count twice (ROADMAP Task 286)"
echo "========================================="
echo "    Everybody above agreed to being counted once instead of once per visit. This section is"
echo "    everybody else -- refused, or has not answered the banner yet. Nothing is stored on their"
echo "    device, so nothing distinguishes their second page load from their first."
echo ""
echo "    READ THESE AS PAGE LOADS, NOT PEOPLE, and never add them to a number above. A count of"
echo "    events and a count of visitors are different units; the consent rate below is the only"
echo "    honest bridge between them, and even that is a rate of ROWS, not of humans."
echo ""
EC_VISITS=$(wc -l < "$VISITS_LOG")
EC_VISITORS=$(wc -l < "$LOG")
printf "    %-34s %12s\n" "deduplicated visitor rows" "$EC_VISITORS"
printf "    %-34s %12s\n" "undeduplicated visit rows" "$EC_VISITS"
if [ "$TOTAL" -gt 0 ]; then
    printf "    %-34s %11s%%\n" "share of rows that consented" "$(awk -v v="$EC_VISITORS" -v t="$TOTAL" 'BEGIN{printf "%.1f", 100*v/t}')"
fi
echo ""
echo "    Both counts only start from the day the banner shipped -- every row logged before then is"
echo "    a visitor row by definition, so the consent share is understated until the old rows age"
echo "    out of the window you care about. Check the coverage dates in the footer before reading it."
if [ "$EC_VISITS" -gt 0 ]; then
    echo ""
    echo "--- Visits by page ---"
    awk -F'\t' '{print $4}' "$VISITS_LOG" | sort | uniq -c | sort -rn
    echo ""
    echo "--- Visits by browser first-preference, aggregated ---"
    awk -F'\t' '{split($2,a,"-"); print a[1]}' "$VISITS_LOG" | sort | uniq -c | sort -rn
    echo ""
    echo "--- Visits per day ---"
    awk -F'\t' '{print substr($1,1,10)}' "$VISITS_LOG" | sort | uniq -c
fi
if [ -s "$VISITS_VIEW_LOG" ]; then
    echo ""
    echo "--- Confirmed-human page loads by page (visits bucket) ---"
    awk -F'\t' '{print $2}' "$VISITS_VIEW_LOG" | sort | uniq -c | sort -rn
fi
if [ -s "$VISITS_USAGE_LOG" ]; then
    echo ""
    echo "--- Confirmed calculations by page (visits bucket) ---"
    awk -F'\t' '{print $2}' "$VISITS_USAGE_LOG" | sort | uniq -c | sort -rn
fi

if [ -f "$VIEW_LOG" ]; then
    VIEW_TOTAL=$(wc -l < "$VIEW_LOG")
    echo ""
    echo "========================================="
    echo " EngCalcs confirmed-human page-view stats (\"window shopping\")"
    echo " $RAW_VIEW_LOG"
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

echo ""
echo "========================================="
echo " Contact funnel: invitation clicks -> messages actually sent"
echo "========================================="
echo "    clicks = confirmed-human views of contact.php (VIEW_LOG rows with page 'contact'),"
echo "            deduped once per (session, page, lang) like every other page view."
echo "    sends  = messages formmail.php actually mailed, logged server-side in its success"
echo "            branch. NOT deduped: one person writing twice is two sends, which is right."
echo "    The two causes of a contact drought call for OPPOSITE fixes, and only this ratio tells"
echo "    them apart: few clicks means the invitation is invisible or reads as chrome (wording and"
echo "    placement are the lever); many clicks and few sends means the invitation works and the"
echo "    FORM is the barrier (moving the invitation again is wasted motion)."
echo ""
CONTACT_CLICKS=0
[ -f "$VIEW_LOG" ] && CONTACT_CLICKS=$(awk -F'\t' '$2 == "contact"' "$VIEW_LOG" | wc -l)
CONTACT_SENDS=0
[ -f "$SEND_LOG" ] && CONTACT_SENDS=$(wc -l < "$SEND_LOG")
printf "    %-28s %10d\n" "invitation clicks" "$CONTACT_CLICKS"
printf "    %-28s %10d\n" "messages sent" "$CONTACT_SENDS"
if [ "$CONTACT_CLICKS" -gt 0 ]; then
    printf "    %-28s %9s%%\n" "sent per click" "$(awk -v s="$CONTACT_SENDS" -v c="$CONTACT_CLICKS" 'BEGIN{printf "%.1f", 100*s/c}')"
fi
echo ""
echo "    Read this ratio only once BOTH counts are out of single digits -- with a handful of"
echo "    contacts a year, one message either way moves it enormously. Until then the useful"
echo "    reading is the pair of raw counts, not the percentage."
if [ -f "$SEND_LOG" ]; then
    echo ""
    echo "--- Sends by served language ---"
    awk -F'\t' '{print ($3 == "" ? "(none chosen)" : $3)}' "$SEND_LOG" | sort | uniq -c | sort -rn
    echo ""
    echo "--- Most recent 10 sends ---"
    tail -10 "$SEND_LOG"
fi

echo ""
echo "========================================="
echo " Named calculations: somebody meant to show this to another person"
echo "========================================="
echo "    Written when a visitor types a Printable Title or Subtitle. Of everything counted in this"
echo "    report this is the strongest signal and the closest to why the suite exists: a page view"
echo "    says they looked, a calc event says they got an answer, and a typed title says they intend"
echo "    to put the result in front of somebody else."
echo "    title    = named a calculation at all."
echo "    subtitle = also added a subtitle, i.e. building a document rather than labelling a scratch"
echo "               calculation. Counted separately for exactly that reason."
echo "    Deduped once per (session, page, field). The text typed is never logged."
echo ""
if [ -f "$TITLE_LOG" ]; then
    TITLES=$(awk -F'\t' '$5 == "title"' "$TITLE_LOG" | wc -l)
    SUBTITLES=$(awk -F'\t' '$5 == "subtitle"' "$TITLE_LOG" | wc -l)
    printf "    %-28s %10d\n" "titles" "$TITLES"
    printf "    %-28s %10d\n" "subtitles" "$SUBTITLES"
    if [ -f "$USAGE_LOG" ] && [ "$(wc -l < "$USAGE_LOG")" -gt 0 ]; then
        echo ""
        echo "--- Named per confirmed calculation, by page ---"
        echo "    Of the people who got an answer on this page, how many cared enough to name it."
        echo "    Both counts are deduped per (session, page), so they are the same kind of number."
        echo "    Same small-sample caution as everywhere else here: under about 40 calculations the"
        echo "    ratio is noise, and a page with a handful of rows cannot support a decision."
        echo ""
        {
            awk -F'\t' '$5 == "title" {print $2"\tnamed"}' "$TITLE_LOG"
            awk -F'\t' '{print $2"\tcalc"}' "$USAGE_LOG"
        } | awk -F'\t' '
            { if ($2 == "named") n[$1]++; else c[$1]++; seen[$1] = 1 }
            END { for (p in seen) printf "%d\t%s\t%d\n", (p in c ? c[p] : 0), p, (p in n ? n[p] : 0) }
        ' | sort -rn | awk -F'\t' '
            !hdr { printf "    %-28s %10s %10s %10s\n", "page", "calcs", "named", "%named"; hdr = 1 }
            { printf "    %-28s %10d %10d %9s%%\n", $2, $1, $3, ($1 > 0 ? sprintf("%.1f", 100*$3/$1) : "-") }'
    fi
    echo ""
    echo "--- Named calculations by page ---"
    awk -F'\t' '{print $2}' "$TITLE_LOG" | sort | uniq -c | sort -rn
    echo ""
    echo "--- Named calculations by served language ---"
    awk -F'\t' '{print ($3 == "" ? "(none)" : $3)}' "$TITLE_LOG" | sort | uniq -c | sort -rn
    echo ""
    echo "--- Most recent 10 named calculations ---"
    tail -10 "$TITLE_LOG"
else
    echo "    (no named-calculation log yet: $TITLE_LOG)"
    echo "    Nobody has typed a Printable Title since this began logging -- or nobody has yet since"
    echo "    the feature shipped. Check the coverage dates in the footer before reading anything"
    echo "    into it."
fi

echo ""
echo "========================================="
echo " What people did next (ROADMAP Tasks 216 and 200)"
echo "========================================="
echo "    Everything above counts PEOPLE. This counts what those people then did — which reference"
echo "    they went looking for, whether they touched the form at all, which units they landed on,"
echo "    whether they had been here before, and where the map interface loses them."
echo ""
echo "    ONE CAUTION GOVERNS THE WHOLE SECTION, so read it once here rather than at every table."
echo "    These rows are deduplicated per PAGE LOAD, in the page's own memory; the view and calc"
echo "    rows above are deduplicated per VISIT, against the ec_seen cookie — whose five bits are"
echo "    full, and whose sixth would make the consent banner's \"a single digit per page\" untrue."
echo "    So a signal count and a view count are different units and dividing one by the other is"
echo "    meaningless — EXCEPT in the visits bucket, where nothing is stored and therefore BOTH"
echo "    are page loads. That is why the rates below are computed from the visits bucket and the"
echo "    visitor bucket is shown as raw counts. It is the one place in this report where the"
echo "    people who declined to be counted twice give the cleaner number."
echo ""
if [ ! -f "$RAW_SIGNAL_LOG" ]; then
    echo "    (no signal log yet: $RAW_SIGNAL_LOG)"
    echo "    Nothing has been recorded since this shipped. Check the coverage dates in the footer"
    echo "    before reading anything into that — an empty file and a feature that shipped"
    echo "    yesterday look identical from here."
else
echo "--- Signal rows by event (visitors bucket) ---"
awk -F'\t' '{print $5}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn

echo ""
echo "========== Reference lookups (Task 216) =========="
echo "    A click on a link OUT of /engcalcs/ — the roughness tables, the EPA document, and our own"
echo "    English-only frictionslope.php explainer. Tom, 2026-08-05: \"How often are non-English"
echo "    people asking for 'n' help?\" The click IS the complaint: a visitor reading the page in"
echo "    Spanish who opens an English-only roughness table has told us everything a survey would."
echo "    Feeds ROADMAP Task 217, so this number arrives with a decision already attached."
echo ""
echo "--- Reference destinations clicked ---"
awk -F'\t' '$5 == "outbound" {print $6}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn | head -20
echo ""
echo "--- Reference clicks by served language ---"
echo "    THE ROW THAT MATTERS IS ANY ROW THAT IS NOT 'en'. Everything we link to is English."
awk -F'\t' '$5 == "outbound" {print ($3 == "" ? "(none)" : $3)}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn
echo ""
echo "--- Reference clicks by page, non-English visitors only ---"
awk -F'\t' '$5 == "outbound" && $3 != "en" && $3 != "" {print $2}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn

echo ""
echo "========== Did they touch anything? (Task 200) =========="
echo "    A human view with no calculation splits two ways, and the two call for opposite fixes:"
echo "    somebody who never touched an input could not understand the page, and somebody who"
echo "    touched it and left tried it and did not want it. This is the cheapest diagnostic here."
echo "    Rate computed from the VISITS bucket only, where views and touches are both page loads."
echo ""
if [ -f "$VISITS_VIEW_LOG" ] && [ -s "$VISITS_VIEW_LOG" ]; then
    {
        awk -F'\t' '$5 == "touch" {print $2"\ttouch"}' "$VISITS_SIGNAL_LOG" 2>/dev/null
        awk -F'\t' '{print $2"\tview"}' "$VISITS_VIEW_LOG"
    } | awk -F'\t' '
        { if ($2 == "touch") t[$1]++; else v[$1]++; seen[$1] = 1 }
        END { for (p in seen) printf "%d\t%s\t%d\n", (p in v ? v[p] : 0), p, (p in t ? t[p] : 0) }
    ' | sort -rn | awk -F'\t' '
        !hdr { printf "    %-28s %10s %10s %10s\n", "page", "views", "touched", "%touched"; hdr = 1 }
        { printf "    %-28s %10d %10d %9s%%\n", $2, $1, $3, ($1 > 0 ? sprintf("%.1f", 100*$3/$1) : "-") }'
    echo ""
    echo "    Under about 40 views a row cannot support a decision — the same floor that applies to"
    echo "    %used everywhere else in this report."
else
    echo "    (no page-load-bucket views yet, so no honest denominator; raw touch counts follow)"
    awk -F'\t' '$5 == "touch" {print $2}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn
fi

echo ""
echo "========== Units actually chosen (Task 200) =========="
echo "    Validates EC_DEFAULT_UNIT_SET-by-language and the per-family defaults of Task 162."
echo "    READ THIS TO REORDER OPTIONS, NOT TO DELETE THEM. An unused option in a dropdown costs a"
echo "    user essentially nothing; a missing one costs them the whole calculator. With a few"
echo "    thousand humans in total, \"no hits in three months\" on a long-tail unit is deleting on"
echo "    absence of data from a small sample. Set a high bar for any actual removal."
echo ""
echo "--- Preset button clicks ---"
awk -F'\t' '$5 == "units" && $6 ~ /^preset:/ {print $6}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn
echo ""
echo "--- Preset clicks by served language ---"
echo "    A language whose visitors keep clicking US is a language EC_DEFAULT_UNIT_SET has wrong."
awk -F'\t' '$5 == "units" && $6 ~ /^preset:/ {print ($3 == "" ? "(none)" : $3)"\t"$6}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn | head -30
echo ""
echo "--- Individual unit selections, by family ---"
echo "    Somebody overriding one select is saying that family's default is wrong for their work."
awk -F'\t' '$5 == "units" && $6 !~ /^preset:/ {print $6}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn | head -40

echo ""
echo "========== Returning users (Task 200) =========="
echo "    A calculator a working engineer comes back to is worth more than a hundred one-off"
echo "    visits, and nothing else in this report can tell those two apart."
echo ""
echo "    A row means this browser had already left WORK behind on this page — its input cookie on a"
echo "    calculator, a saved project document on Looped-Network. Both are exempt storage that exists"
echo "    anyway, which is why this measurement stores nothing new; see dev/cookie-storage-inventory.md"
echo "    for why that mattered enough to design around."
echo ""
echo "    IT MEANS USED, NOT OPENED, and on the map page that distinction is the whole point: a"
echo "    Looped-Network row requires a SAVED PROJECT DOCUMENT, which exists only after a real edit."
echo "    The project index will not do — a first visit writes one before the visitor touches"
echo "    anything, so probing it would have counted reopening the page as using it."
echo ""
echo "    ONE UNDERCOUNT, structural, not a defect to fix: CONSENTING VISITORS ONLY. Reading that"
echo "    storage for an analytics purpose is still an analytics access, so the row is not written"
echo "    otherwise. Treat this as a sample, never as a total, and never divide it by a count that"
echo "    includes the visits bucket."
echo ""
awk -F'\t' '$5 == "repeat" {print $2}' "$RAW_SIGNAL_LOG" | sort | uniq -c | sort -rn
echo ""
echo "--- Returning users by served language ---"
awk -F'\t' '$5 == "repeat" {print ($3 == "" ? "(none)" : $3)}' "$RAW_SIGNAL_LOG" | sort | uniq -c | sort -rn

echo ""
echo "========== Looped-Network: where the map interface loses people (Task 200) =========="
echo "    first:  which of the four ways INTO a network the visitor reached for first, one row per"
echo "            page load. This is the first evidence bearing on the empty-canvas decision closed"
echo "            2026-07-29 (a new project opens on placeholder text rather than a worked example),"
echo "            which was made with no data at all: a large first:example share vindicates it, a"
echo "            large 'nothing' share overturns it."
echo "    diag:   which of the solver's complaints is actually met. The biggest one names the next"
echo "            thing to fix on that page."
echo ""
echo "--- First action on the map ---"
awk -F'\t' '$5 == "lpn" && $6 ~ /^first:/ {print $6}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn
if [ -f "$VISITS_VIEW_LOG" ]; then
    LPN_VIEWS=$(awk -F'\t' '$2 == "Looped-Network"' "$VISITS_VIEW_LOG" 2>/dev/null | wc -l)
    LPN_FIRST=$(awk -F'\t' '$5 == "lpn" && $6 ~ /^first:/' "$VISITS_SIGNAL_LOG" 2>/dev/null | wc -l)
    if [ "$LPN_VIEWS" -gt 0 ]; then
        echo ""
        printf "    %-28s %10d\n" "page loads (visits bucket)" "$LPN_VIEWS"
        printf "    %-28s %10d\n" "  of those, did something" "$LPN_FIRST"
        printf "    %-28s %10d\n" "  of those, did NOTHING" "$((LPN_VIEWS - LPN_FIRST))"
        echo "    'Nothing' is the row the empty-canvas decision turns on. It is a residual, not a"
        echo "    logged event, so it also absorbs anyone who left before the page finished loading."
    fi
fi
echo ""
echo "--- Diagnostics met ---"
awk -F'\t' '$5 == "lpn" && $6 ~ /^diag:/ {print $6}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn
echo ""
echo "=== Sharing a calculation (Task 228) ==="
echo "    The control sits under the Printable Title, so the honest denominator is the people who"
echo "    typed one -- naming a calculation is the declared intent this exists to serve. Both counts"
echo "    below come from the consented bucket, so they are comparable with each other."
echo "    'copy' means the clipboard took the link; 'manual' means the browser had no clipboard here"
echo "    and the link was shown to be copied by hand. A large manual share is a browser-support"
echo "    fact, not a failure -- but it is the number that says whether the fallback is load-bearing."
echo "    NOT MEASURED, and cannot be from here: whether anybody opened a shared link. A shared URL"
echo "    lands as an ordinary page view with a query string, and telling those apart would mean"
echo "    storing something new."
echo ""
echo "--- Share control used ---"
awk -F'\t' '$5 == "share" {print $6}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn
SHARES=$(awk -F'\t' '$5 == "share"' "$SIGNAL_LOG" | wc -l)
if [ -f "$TITLE_LOG" ]; then
    NAMED=$(awk -F'\t' '$5 == "title"' "$TITLE_LOG" | wc -l)
    if [ "$NAMED" -gt 0 ]; then
        echo ""
        printf "    %-32s %10d\n" "named a calculation" "$NAMED"
        printf "    %-32s %10d\n" "  of those, shared it" "$SHARES"
        echo "    The title rows are deduped per (visit, page, field) and these are deduped per page"
        echo "    load, so read this as an order of magnitude, not a rate."
    fi
fi
echo ""
echo "--- Share control, by page ---"
awk -F'\t' '$5 == "share" {print $2}' "$SIGNAL_LOG" | sort | uniq -c | sort -rn
echo ""
echo "--- Most recent 10 signal rows ---"
tail -10 "$RAW_SIGNAL_LOG"
fi

if [ ! -f "$USAGE_LOG" ]; then
    echo ""
    echo "========================================="
    echo " No confirmed-human calculator-usage log yet: $USAGE_LOG"
    echo " (No one has confirmed a calculation since this feature shipped.)"
    echo "========================================="
    print_footer
    exit 0
fi

USAGE_TOTAL=$(wc -l < "$USAGE_LOG")
echo ""
echo "========================================="
echo " EngCalcs confirmed-human calculator-usage stats"
echo " $RAW_USAGE_LOG"
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

echo ""
echo "--- Non-English HUMANS by calculator (language x calculator) ---"
echo "    THE SPRINT-SEQUENCING VIEW. There is already a 'Non-English demand by page' section far"
echo "    above, but it reads engcalcs-lang.log -- the RAW REACH tier, where a bot floor of roughly"
echo "    900 per page swamps the signal. This one is built from the two confirmed-human logs, which"
echo "    bots essentially never reach, so every row below is a real person."
echo ""
echo "    What it answers: for a language we have already translated, is anyone actually SHOWING UP"
echo "    on a calculator in that language, and do they get as far as computing? That is the"
echo "    question that should order translation sprints -- not how many strings a page has."
echo "    An empty table here is itself a finding, and an important one: it would mean 26 translated"
echo "    languages with no confirmed non-English human use yet, which bears directly on how much"
echo "    further translation work is worth before the pages themselves earn traffic."
echo ""
{
    [ -f "$VIEW_LOG" ]  && awk -F'\t' '{split($3,a,"-"); if (a[1]!="en" && a[1]!="") print a[1]"\t"$2"\tshop"}' "$VIEW_LOG"
    [ -f "$USAGE_LOG" ] && awk -F'\t' '{split($3,a,"-"); if (a[1]!="en" && a[1]!="") print a[1]"\t"$2"\tuse"}' "$USAGE_LOG"
} | awk -F'\t' '
    { k = $1 "\t" $2; seen[k] = 1; if ($3 == "shop") { s[k]++ } else { u[k]++ } }
    END {
        n = 0
        for (k in seen) {
            sh = (k in s) ? s[k] : 0
            us = (k in u) ? u[k] : 0
            printf "%d\t%d\t%s\n", sh, us, k
            n++
        }
        if (n == 0) { print "NONE" }
    }' | sort -rn | awk -F'\t' '
    /^NONE/ { print "    (no confirmed non-English human has reached any calculator yet)"; next }
    # Header on the first real row, not in BEGIN: otherwise the empty case prints column
    # headings above a "none" message, which reads as a broken table rather than a finding.
    !hdr { printf "%-10s %-28s %10s %10s\n", "lang", "calculator", "humans", "humans";
           printf "%-10s %-28s %10s %10s\n", "", "", "shopping", "using"; hdr = 1 }
    { printf "%-10s %-28s %10d %10d\n", $3, $4, $1, $2 }'

echo ""
echo "--- Arrival pattern for non-English humans (bot-dwell check) ---"
echo "    A JS-executing crawler that sits on a page for >=10s trips the confirmed-human beacon and"
echo "    then never calculates -- which is EXACTLY the signature of a language with high shopping"
echo "    and near-zero using. Before reading such a language as a translation defect, check here."
echo "    days   = distinct calendar days the views fall on"
echo "    burst  = most views in any single minute"
echo "    Humans spread out; a crawler arrives in bursts and often on very few days. A language with"
echo "    (say) 12 views on 1 day with a burst of 8 is a crawler. The same 12 over 9 days, burst 1,"
echo "    is 12 people."
echo ""
if [ -f "$VIEW_LOG" ]; then
    awk -F'\t' '{split($3,a,"-"); if (a[1]!="en" && a[1]!="") print a[1]"\t"substr($1,1,10)"\t"substr($1,1,16)}' "$VIEW_LOG" |
    awk -F'\t' '
        { n[$1]++; day[$1"\t"$2]=1; min[$1"\t"$3]++ }
        END {
            for (k in day) { split(k,p,"\t"); days[p[1]]++ }
            for (k in min) { split(k,p,"\t"); if (min[k] > burst[p[1]]) burst[p[1]] = min[k] }
            for (l in n) printf "%d\t%s\t%d\t%d\n", n[l], l, days[l], burst[l]
        }' | sort -rn | awk -F'\t' '
        !hdr { printf "%-10s %10s %10s %10s\n", "lang", "views", "days", "burst"; hdr = 1 }
        { printf "%-10s %10d %10d %10d\n", $2, $1, $3, $4 }'
else
    echo "    (no confirmed-human page-view log yet)"
fi

print_footer
