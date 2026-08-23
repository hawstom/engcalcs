#!/usr/bin/env bash
#
# lang-log-stats.sh — the EngCalcs usage report.
#
#   bash log/lang-log-stats.sh            from the project root
#   bash log/lang-log-stats.sh --days=30  restrict the window to the last N days
#
# WHAT THIS FILE IS FOR, beyond printing numbers. dev/usage-data-log.md records the same
# analytical mistakes being made repeatedly by people who had already written the rule down: a
# small-n ratio turned into a verdict; a trend read across two incomparable windows; a number read
# off an adjacent row. CLAUDE.md's answer applies here — "a rule a machine enforces is worth
# roughly ten a human must remember" — so every standing rule that CAN live in the output does:
#
#   * the window and the definitions print at the top of every run, never assumed;
#   * a fingerprint line makes two pasted reports show their mismatch, and the previous run's
#     window is printed beside this one's;
#   * every ratio carries a Wilson 95% interval and a small-n mark, computed, not remembered;
#   * the two consent buckets are printed in separate tables with their UNIT in every column
#     heading, and there is no total row anywhere in this file, on purpose.
#
# THE LOGS IT READS. All tab-separated, all beginning with an ISO-8601 UTC timestamp. See
# lib/config.inc.php for the authoritative field lists.
#
#   engcalcs-lang.log         reach     ts lang source page [served asked] [bucket]
#   engcalcs-human-view.log   shopping  ts page lang browser_lang [bucket]
#   engcalcs-calc-usage.log   using     ts page lang browser_lang [bucket]
#   engcalcs-title.log        naming    ts page lang browser_lang field [bucket]
#   engcalcs-signal.log       behaviour ts page lang browser_lang event detail [bucket]
#   engcalcs-contact-send.log sends     ts page lang browser_lang           (server-side, no bucket)
#
# THE BUCKET COLUMN IS THE LAST FIELD and holds 'visitor' or 'visit' (ecLogBucketSuffix()). Rows
# written before 2026-08-21 carry a 'visit' marker or no marker at all; a row whose last field is
# neither token is a legacy visitor row. So every split below tests the LAST field and never a
# fixed column index — the old per-log index table (5, 5, 5, 6, 7) was one edit away from silently
# mixing the buckets, which is the one error this report exists to prevent.

set -u

DIR="$(dirname "$0")"
RAW_LANG="$DIR/engcalcs-lang.log"
RAW_VIEW="$DIR/engcalcs-human-view.log"
RAW_CALC="$DIR/engcalcs-calc-usage.log"
RAW_TITLE="$DIR/engcalcs-title.log"
RAW_SIGNAL="$DIR/engcalcs-signal.log"
RAW_SEND="$DIR/engcalcs-contact-send.log"
STATE="$DIR/.last-report-window"

WINDOW_DAYS=""
for arg in "$@"; do
    case "$arg" in
        --days=*) WINDOW_DAYS="${arg#--days=}" ;;
        --help|-h) sed -n '2,6p' "$0"; exit 0 ;;
        *) echo "Unknown option: $arg" >&2; exit 1 ;;
    esac
done

if [ ! -f "$RAW_LANG" ]; then
    echo "Log file not found: $RAW_LANG"
    echo "(No page access has been recorded yet.)"
    exit 1
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT INT TERM

# ---- the small-n floor and the interval, in one place ----------------------------------------
# 40 is the floor dev/usage-data-log.md already uses for %using. Below it a ratio is not a verdict;
# below MIN_N it is not printed at all.
FLOOR_N=40
MIN_N=5

# Injected into every awk program that prints a ratio. wilson() returns "lo-hi" as whole percents;
# rate() returns the point estimate with a '~' when the denominator is under the floor and "-" when
# it is under MIN_N.
# BOTH FUNCTIONS ARE TOTAL, and they have to be: k CAN EXCEED n here. %using is using/shopping,
# and the two beacons are independently gated -- maybeLogHumanView fires once the browser has been
# around >=10s, maybeLogCalcUsage fires on a user-triggered recalculation >=10s after LOAD, and the
# two de-duplicate on different keys. So a person can be recorded calculating without ever being
# recorded shopping, and a k/n over 1 is a real reading of two real counts, not a corrupt log.
# The first version of this file computed sqrt() of a negative variance in exactly that case: awk
# printed a warning and the interval read "[-nan-100]%" on the production run of 2026-08-21.
# Neither count is clamped and no row is dropped -- the ratio is printed as ">100%" and its
# interval as "n/a", because a proportion interval on something that is not a proportion is noise.
AWK_LIB=$(cat <<'AWKLIB'
function wilson(k, n,   p, z, d, c, m, s, lo, hi) {
    if (n <= 0) return "n/a"
    if (k > n) return "n/a"
    p = k / n
    if (p < 0) p = 0
    if (p > 1) p = 1
    z = 1.96
    d = 1 + z*z/n
    c = (p + z*z/(2*n)) / d
    s = p*(1-p)/n + z*z/(4*n*n)
    if (s < 0) s = 0
    m = z * sqrt(s) / d
    lo = c - m; hi = c + m
    if (lo < 0) lo = 0
    if (hi > 1) hi = 1
    return sprintf("[%d-%d]%%", lo*100 + 0.5, hi*100 + 0.5)
}
function rate(k, n,   v) {
    if (n <= 0) return "n/a"
    if (n < EC_MIN_N) return "-"
    if (k > n) return ">100%"
    v = sprintf("%.0f%%", 100*k/n)
    return (n < EC_FLOOR_N) ? v "~" : v
}
AWKLIB
)
AWK_LIB="${AWK_LIB//EC_MIN_N/$MIN_N}"
AWK_LIB="${AWK_LIB//EC_FLOOR_N/$FLOOR_N}"

# ---- window ----------------------------------------------------------------------------------
# Every log is cut to the same window before anything is counted, so the report cannot silently
# compare a log that started in June against one that started last week. Row 1 of the widest log
# sets the start unless --days says otherwise.
if [ -n "$WINDOW_DAYS" ]; then
    WIN_FROM=$(date -u -d "$WINDOW_DAYS days ago" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null) || {
        echo "--days needs a number" >&2; exit 1; }
else
    WIN_FROM="0000-00-00T00:00:00Z"
fi

ec_window() {  # $1 = raw path, $2 = destination basename
    if [ -f "$1" ]; then
        awk -F'\t' -v from="$WIN_FROM" '$1 >= from' "$1" > "$TMP/$2"
    else
        : > "$TMP/$2"
    fi
}
ec_window "$RAW_LANG"   lang
ec_window "$RAW_VIEW"   view
ec_window "$RAW_CALC"   calc
ec_window "$RAW_TITLE"  title
ec_window "$RAW_SIGNAL" signal
ec_window "$RAW_SEND"   send

# ---- the two buckets, split on the LAST field, never on a column index -------------------------
for f in lang view calc title signal; do
    awk -F'\t' '$NF != "visit"' "$TMP/$f" > "$TMP/p-$f"   # people: consented, de-duplicated
    awk -F'\t' '$NF == "visit"' "$TMP/$f" > "$TMP/l-$f"   # loads:  everybody else, one row per load
done

n_of() { wc -l < "$1" | tr -d ' '; }
first_of() { head -1 "$1" 2>/dev/null | cut -f1; }
last_of()  { tail -1 "$1" 2>/dev/null | cut -f1; }

ALL_TS="$TMP/all-ts"
: > "$ALL_TS"
for f in lang view calc title signal send; do cut -f1 "$TMP/$f" >> "$ALL_TS" 2>/dev/null; done
sort -o "$ALL_TS" "$ALL_TS"
WIN_START=$(head -1 "$ALL_TS")
WIN_END=$(tail -1 "$ALL_TS")
[ -n "$WIN_START" ] || WIN_START="(no rows)"
[ -n "$WIN_END" ]   || WIN_END="(no rows)"
WIN_DAYS=$(awk -v a="$WIN_START" -v b="$WIN_END" 'BEGIN{
    gsub(/[-T:Z]/," ",a); gsub(/[-T:Z]/," ",b)
    d = (mktime(b) - mktime(a)) / 86400
    printf "%.1f", (d > 0 ? d : 0)
}')
FINGERPRINT="win=${WIN_START}..${WIN_END} days=${WIN_DAYS} rows=$(n_of "$TMP/lang")/$(n_of "$TMP/view")/$(n_of "$TMP/calc")/$(n_of "$TMP/title")/$(n_of "$TMP/signal")/$(n_of "$TMP/send")"
PREV_FINGERPRINT=""
[ -f "$STATE" ] && PREV_FINGERPRINT=$(cat "$STATE")

echo "==============================================================================="
echo " ENGCALCS USAGE REPORT"
echo "==============================================================================="
echo " WINDOW        $WIN_START  ..  $WIN_END"
echo " DURATION      $WIN_DAYS days"
echo " FINGERPRINT   $FINGERPRINT"
if [ -n "$PREV_FINGERPRINT" ]; then
    if [ "$PREV_FINGERPRINT" = "$FINGERPRINT" ]; then
        echo " PREVIOUS RUN  identical window — this run and the last are comparable."
    else
        echo " PREVIOUS RUN  $PREV_FINGERPRINT"
        echo "               DIFFERENT WINDOW. Nothing below may be read as a trend against"
        echo "               that run. Rank survives a window change; counts and ratios do not."
    fi
else
    echo " PREVIOUS RUN  (none recorded — this is the first run against this log directory)"
fi
printf '%s\n' "$FINGERPRINT" > "$STATE" 2>/dev/null || true
echo ""
echo " Paste the WINDOW and FINGERPRINT lines with any number taken from this report. Two"
echo " snapshots whose fingerprints differ describe different populations: dev/usage-data-log.md"
echo " records a 40x scale break that happened because the window was never stated."
echo ""
echo "-------------------------------------------------------------------------------"
echo " DEFINITIONS — the four tiers, narrowest last"
echo "-------------------------------------------------------------------------------"
echo "   reach     a page load recorded in engcalcs-lang.log. INCLUDES CRAWLERS. High reach with"
echo "             ~0% shopping is a bot signature, not an audience."
echo "   shopping  a confirmed-human page view: the beacon fires once this browser has been"
echo "             around >=10s, whether or not anybody calculates. Window shopping."
echo "   using     a confirmed calculation: a user-triggered recalculation >=10s after load. It"
echo "             means 'typed their own numbers', not 'looked at the default answer'."
echo "   naming    a Printable Title or Subtitle was typed — they mean to show it to somebody."
echo ""
echo "   %shopping = shopping/reach. A LOWER BOUND on human reach, never an estimate of it."
echo "   %using    = using/shopping. A RATIO OF TWO INDEPENDENTLY GATED BEACONS, and it can exceed"
echo "               100%. The shopping beacon needs the browser to have been around >=10s; the"
echo "               using beacon needs a user-triggered recalculation >=10s after LOAD, and the"
echo "               two de-duplicate on different keys — so somebody can be recorded calculating"
echo "               and never recorded shopping. Read it as a rough conversion indicator, NOT as"
echo "               a share of a population. Over 100% it prints '>100%' with no interval; both"
echo "               counts are printed beside it and neither is ever clamped or dropped."
echo "   ~         the denominator is under $FLOOR_N. The number is printed, but it is not a verdict."
echo "   -         the denominator is under $MIN_N. No ratio is printed at all."
echo "   [lo-hi]%  Wilson 95% interval. TWO ROWS DIFFER ONLY IF THEIR INTERVALS DO NOT OVERLAP."
echo ""
echo "-------------------------------------------------------------------------------"
echo " THE TWO BUCKETS — never summed, never in the same table"
echo "-------------------------------------------------------------------------------"
echo "   people      rows from visitors who agreed to being counted once instead of every time."
echo "               De-duplicated per (visit, page). ONE ROW IS ONE PERSON."
echo "   page loads  rows from everybody else — refused, or has not answered the banner. Nothing"
echo "               is stored on their device, so nothing tells their second load from their"
echo "               first. ONE ROW IS ONE PAGE LOAD."
echo ""
echo "   These are different UNITS. Adding them produces a number with no meaning, and a page"
echo "   whose non-consenting visitors reload a lot would simply look more popular. There is no"
echo "   total row anywhere in this report, on purpose."
echo ""
printf "   %-38s %10s %12s\n" "log" "people" "page loads"
for pair in "engcalcs-lang.log:lang" "engcalcs-human-view.log:view" "engcalcs-calc-usage.log:calc" "engcalcs-title.log:title" "engcalcs-signal.log:signal"; do
    printf "   %-38s %10s %12s\n" "${pair%%:*}" "$(n_of "$TMP/p-${pair##*:}")" "$(n_of "$TMP/l-${pair##*:}")"
done
printf "   %-38s %10s %12s\n" "engcalcs-contact-send.log" "$(n_of "$TMP/send")" "(server-side)"
echo ""
LANG_ALL=$(n_of "$TMP/lang")
if [ "$LANG_ALL" -gt 0 ]; then
    echo "   Consent share of reach rows: $(awk -v p="$(n_of "$TMP/p-lang")" -v t="$LANG_ALL" 'BEGIN{printf "%.1f%%", 100*p/t}')"
    echo "   THIS IS A RATE OF ROWS, NOT OF HUMANS, and it is the only bridge between the two"
    echo "   buckets. Rows written before the consent banner shipped (2026-08-11) are all people"
    echo "   rows by definition, so the share is understated while any of them remain in the"
    echo "   window. IF THIS SHARE IS SMALL, the people-bucket tables below describe a small"
    echo "   minority of the audience — that is the whole of the 2026-08-21 scale break."
fi

# ---- funnel, one bucket per call --------------------------------------------------------------
# $1 = bucket prefix (p|l), $2 = unit word for the column headings.
ec_funnel_pages() {
    local b="$1" unit="$2"
    {
        awk -F'\t' '{print $4"\treach\t1"}' "$TMP/$b-lang"
        awk -F'\t' '{print $2"\tshop\t1"}'  "$TMP/$b-view"
        awk -F'\t' '{print $2"\tuse\t1"}'   "$TMP/$b-calc"
    } | awk -F'\t' "$AWK_LIB"'
        $1 != "" { if ($2=="reach") r[$1]++; else if ($2=="shop") s[$1]++; else u[$1]++; seen[$1]=1 }
        END {
            for (p in seen) printf "%d\t%d\t%d\t%s\n", (p in s?s[p]:0), (p in u?u[p]:0), (p in r?r[p]:0), p
        }' | sort -t$'\t' -k1,1rn -k2,2rn -k3,3rn | awk -F'\t' "$AWK_LIB"'
        BEGIN { printf "   %-26s %9s %9s %9s %10s %-11s %9s %-11s\n", "page", "reach", "shopping", "using", "%shopping", "95% CI", "%using", "95% CI" }
        { printf "   %-26s %9d %9d %9d %10s %-11s %9s %-11s\n", $4, $3, $1, $2,
                 rate($1,$3), ($3>0?wilson($1,$3):""), rate($2,$1), ($1>0?wilson($2,$1):"") }'
    echo ""
    echo "   Units: every count in this table is ${unit}."
    echo "   A '>100%' in %using is not corruption: shopping and using are separately gated beacons"
    echo "   with different de-duplication keys, so a row can record a calculation with no view."
}

echo ""
echo "==============================================================================="
echo " RANK BY SHOPPING — the statistic that survives a window change"
echo "==============================================================================="
echo "   dev/usage-data-log.md establishes rank as the robust number here: counts move with the"
echo "   window and the consent share, ratios move with n, rank moves with the audience. Read"
echo "   this table first, and read the ratio tables below only for within-window comparisons."
echo ""
echo "   STANDING RULE: rank the complicated calculators against EACH OTHER — Looped-Network,"
echo "   Irrigation-Pressure, Branched-Network, Manning-Irregular, Weir-Flow-Irregular — never"
echo "   against Manning-Pipe-Flow or Manning-Trap. 'Using' fires after one keystroke on a"
echo "   three-field form and after drawing a network on the map, so the ratio is not portable"
echo "   across complexity classes."
echo ""
{
    awk -F'\t' '{print $2"\tp"}' "$TMP/p-view"
    awk -F'\t' '{print $2"\tl"}' "$TMP/l-view"
} | awk -F'\t' '
    $1 != "" { if ($2=="p") p[$1]++; else l[$1]++; seen[$1]=1 }
    END { for (k in seen) printf "%d\t%d\t%s\n", (k in p?p[k]:0), (k in l?l[k]:0), k }' \
| sort -t$'\t' -k1,1rn -k2,2rn | awk -F'\t' '
    BEGIN { printf "   %-6s %-28s %14s %16s\n", "rank", "page", "people", "page loads" }
    { n++; printf "   %-6d %-28s %14d %16d\n", n, $3, $1, $2 }'
echo ""
echo "   Rank is by the people bucket, with the page-load bucket printed beside it so a"
echo "   disagreement between the two is visible. They are different units; the ranks are"
echo "   comparable, the counts are not."

echo ""
echo "==============================================================================="
echo " FUNNEL BY PAGE — PEOPLE (consented, de-duplicated: one row = one person)"
echo "==============================================================================="
ec_funnel_pages p "PEOPLE"

echo ""
echo "==============================================================================="
echo " FUNNEL BY PAGE — PAGE LOADS (everybody else: one row = one page load)"
echo "==============================================================================="
echo "   Not a smaller or larger version of the table above. A different unit, and for most"
echo "   windows the larger population. Do not divide one table by the other."
echo ""
ec_funnel_pages l "PAGE LOADS"
echo ""
echo "   NEITHER FUNNEL TABLE CARRIES A RANK COLUMN. Rank is stated once, in its own section"
echo "   above. A row's position here moves with the sort, and a position read as a rank — or a"
echo "   number read off the row above the one meant — is the mistake dev/usage-data-log.md"
echo "   records for 2026-08-21."

# ---- the quiet pages --------------------------------------------------------------------------
echo ""
echo "==============================================================================="
echo " THE QUIET PAGES — a cost the project carries deliberately"
echo "==============================================================================="
echo "   Pages that returned almost nothing in this window, both buckets pooled purely to decide"
echo "   membership of this list (no count is printed, because a pooled count would be a sum)."
echo ""
echo "   THIS IS NOT AN ARGUMENT FOR CUTTING THEM. Zero reach is a discovery/SEO gap, not a"
echo "   value signal, and it never has been one here. It is stated once per run so that the"
echo "   choice to carry the suite's breadth stays deliberate rather than unnoticed."
echo ""
{
    cat "$TMP/p-lang" "$TMP/l-lang" | awk -F'\t' '$4 != "" {print $4"\tseen"}'
    cat "$TMP/p-view" "$TMP/l-view" | awk -F'\t' '$2 != "" {print $2"\tshop"}'
    cat "$TMP/p-calc" "$TMP/l-calc" | awk -F'\t' '$2 != "" {print $2"\tuse"}'
} | awk -F'\t' '
    { if ($2=="shop") s[$1]++; else if ($2=="use") u[$1]++; seen[$1]=1 }
    END {
        n = 0
        for (k in seen) if ((k in s ? s[k] : 0) < 5 && (k in u ? u[k] : 0) <= 1) { print "   " k; n++ }
        if (n == 0) print "   (none — every page seen in this window returned at least 5 shoppers)"
    }' | sort
echo ""
echo "   The page list comes from the REACH log, so a page with traffic and no shoppers appears"
echo "   here. A page absent from every log in this window does not — it has no rows to be"
echo "   counted by. Cross-check against the calculator list before concluding anything about a"
echo "   page you cannot see."

# ---- language -----------------------------------------------------------------------------
echo ""
echo "==============================================================================="
echo " LANGUAGE — does anybody use the 26 translations?"
echo "==============================================================================="
echo "   The suite's deepest recurring spend, and the number that should sequence a translation"
echo "   sprint. Two different questions live here and they must not be confused:"
echo "     SERVED    which language the page was actually rendered in (column 3 of the human"
echo "               logs). This is 'somebody used a translation'."
echo "     ASKED FOR the browser's first Accept-Language tag (column 4). This is 'somebody"
echo "               wanted one', and it is true even of visitors who were served English."
echo ""
for b in p l; do
    if [ "$b" = "p" ]; then label="PEOPLE"; else label="PAGE LOADS"; fi
    tot=$(n_of "$TMP/$b-view")
    if [ "$tot" -eq 0 ]; then
        echo "   $label — no confirmed-human page views in this window."
        echo ""
        continue
    fi
    nonen=$(awk -F'\t' '{split($3,a,"-"); if (a[1] != "en" && a[1] != "") n++} END{print n+0}' "$TMP/$b-view")
    wantnon=$(awk -F'\t' '{split($4,a,"-"); if (a[1] != "en" && a[1] != "") n++} END{print n+0}' "$TMP/$b-view")
    echo "   $label — confirmed-human page views: $tot"
    printf "     %-46s %6d  %s\n" "served a language other than en" "$nonen" \
        "$(awk "$AWK_LIB"'BEGIN{printf "%s %s", rate('"$nonen"','"$tot"'), wilson('"$nonen"','"$tot"')}')"
    printf "     %-46s %6d  %s\n" "browser asked for a language other than en" "$wantnon" \
        "$(awk "$AWK_LIB"'BEGIN{printf "%s %s", rate('"$wantnon"','"$tot"'), wilson('"$wantnon"','"$tot"')}')"
    echo ""
done
echo "   THE GAP BETWEEN THOSE TWO LINES IS THE FINDING. 'Asked for' well above 'served' means"
echo "   people who wanted a translation did not get one — a detection or discovery defect, not"
echo "   a translation-quality one, and a completely different fix."
echo ""
echo "--- Language x calculator, confirmed humans, non-English served (PEOPLE) ---"
echo "    Every row is a real person: bots essentially never reach either beacon. This is the"
echo "    sprint-sequencing view — is anyone showing up on a calculator in a language we"
echo "    translated, and do they get as far as computing?"
echo ""
{
    awk -F'\t' '{split($3,a,"-"); if (a[1]!="en" && a[1]!="") print a[1]"\t"$2"\tshop"}' "$TMP/p-view"
    awk -F'\t' '{split($3,a,"-"); if (a[1]!="en" && a[1]!="") print a[1]"\t"$2"\tuse"}'  "$TMP/p-calc"
} | awk -F'\t' '
    { k = $1 "\t" $2; seen[k]=1; if ($3=="shop") s[k]++; else u[k]++ }
    END {
        n = 0
        for (k in seen) { printf "%d\t%d\t%s\n", (k in s?s[k]:0), (k in u?u[k]:0), k; n++ }
        if (n == 0) print "NONE"
    }' | sort -rn | awk -F'\t' "$AWK_LIB"'
    /^NONE/ { print "    (no confirmed non-English person has reached any calculator in this window)"; next }
    !hdr { printf "    %-8s %-26s %10s %10s %9s %-11s\n", "lang", "calculator", "shopping", "using", "%using", "95% CI"; hdr=1 }
    { printf "    %-8s %-26s %10d %10d %9s %-11s\n", $3, $4, $1, $2, rate($2,$1), ($1>0?wilson($2,$1):"") }'
echo ""
echo "--- What the reach log SERVED, and what it was ASKED for (both buckets) ---"
echo "    Column 2 of engcalcs-lang.log means different things on different rows -- the served"
echo "    language on 'get'/'cookie'/'view' rows, the raw Accept-Language tag on 'browser'/'anon'"
echo "    ones -- so it could never answer 'what did we serve?' for the anon majority, which is"
echo "    most of the audience. Every row now also carries BOTH facts in their own columns,"
echo "    written as a pair before the bucket suffix. Rows written before that change carry"
echo "    neither and are counted as UNCLASSIFIED here rather than folded in."
echo ""
for b in p l; do
    if [ "$b" = "p" ]; then label="PEOPLE"; else label="PAGE LOADS"; fi
    tot=$(n_of "$TMP/$b-lang")
    if [ "$tot" -eq 0 ]; then
        echo "    $label — no reach rows in this window."
        echo ""
        continue
    fi
    # NF>=6 is exactly "this row has the served/asked pair": the old format was ts lang source page
    # [bucket], four or five fields, and the pair is written together or not at all.
    class=$(awk -F'\t' 'NF>=6' "$TMP/$b-lang" | wc -l | tr -d ' ')
    unclass=$((tot - class))
    echo "    $label — reach rows: $tot   classified: $class   unclassified (older format): $unclass"
    if [ "$class" -gt 0 ]; then
        awk -F'\t' "$AWK_LIB"'
            NF>=6 {
                split($5,a,"-"); split($6,q,"-")
                if (a[1] != "") { srv++; if (a[1] != "en") srvnon++ }
                if (q[1] != "") { ask++; if (q[1] != "en") asknon++ }
            }
            END {
                printf "      %-44s %6d  %s %s\n", "served a language other than en", srvnon+0,
                       rate(srvnon+0, srv+0), wilson(srvnon+0, srv+0)
                printf "      %-44s %6d  %s %s\n", "browser asked for a language other than en", asknon+0,
                       rate(asknon+0, ask+0), wilson(asknon+0, ask+0)
            }' "$TMP/$b-lang"
    fi
    echo ""
done
echo "    Read this beside the confirmed-human figures above: this one covers every page load,"
echo "    crawlers included, so it is the wider and the dirtier of the two measurements."
echo ""
echo "--- Language demand from the reach log (both buckets, kept apart) ---"
echo "    'get' rows are an explicit ?lang=XX choice; 'browser'/'anon' rows carry the raw"
echo "    Accept-Language tag; 'cookie' rows are a returning visitor on a saved preference."
echo "    'view' rows are excluded from demand — they would double-count the visit's language."
echo ""
printf "    %-10s %10s %12s\n" "language" "people" "page loads"
{
    awk -F'\t' '$3!="view" {split($2,a,"-"); if (a[1]!="") print a[1]"\tp"}' "$TMP/p-lang"
    awk -F'\t' '$3!="view" {split($2,a,"-"); if (a[1]!="") print a[1]"\tl"}' "$TMP/l-lang"
} | awk -F'\t' '
    { if ($2=="p") p[$1]++; else l[$1]++; seen[$1]=1 }
    END { for (k in seen) printf "%d\t%d\t%s\n", (k in p?p[k]:0), (k in l?l[k]:0), k }' \
| sort -t$'\t' -k1,1rn -k2,2rn | awk -F'\t' '{ printf "    %-10s %10d %12d\n", $3, $1, $2 }'
echo ""
echo "--- Arrival pattern for non-English humans (bot-dwell check) ---"
echo "    A crawler that dwells >=10s trips the shopping beacon and never calculates, which is"
echo "    exactly the signature of a language with high shopping and near-zero using. Humans"
echo "    spread out. 12 views on 1 day with a burst of 8 is a crawler; 12 over 9 days, burst 1,"
echo "    is 12 people."
echo ""
cat "$TMP/p-view" "$TMP/l-view" | awk -F'\t' '{split($3,a,"-"); if (a[1]!="en" && a[1]!="") print a[1]"\t"substr($1,1,10)"\t"substr($1,1,16)}' |
awk -F'\t' '
    { n[$1]++; day[$1"\t"$2]=1; min[$1"\t"$3]++ }
    END {
        for (k in day) { split(k,q,"\t"); days[q[1]]++ }
        for (k in min) { split(k,q,"\t"); if (min[k] > burst[q[1]]) burst[q[1]] = min[k] }
        for (l in n) printf "%d\t%s\t%d\t%d\n", n[l], l, days[l], burst[l]
    }' | sort -rn | awk -F'\t' '
    !hdr { printf "    %-10s %10s %10s %10s\n", "lang", "views", "days", "burst"; hdr=1 }
    { printf "    %-10s %10d %10d %10d\n", $2, $1, $3, $4 }'

# ---- repeat use ------------------------------------------------------------------------------
echo ""
echo "==============================================================================="
echo " REPEAT USE — the strongest value signal here, and it cost no new storage"
echo "==============================================================================="
echo "   A row means this browser had already left WORK behind on this page: its own input"
echo "   cookie on a calculator, a saved project DOCUMENT on Looped-Network. Both are EXEMPT"
echo "   storage that exists anyway, so measuring this stored nothing new and left"
echo "   consent_body true. It means USED, not opened — the Looped-Network project index will"
echo "   not do, because a first visit writes one before the visitor touches anything."
echo ""
echo "   ONE STRUCTURAL UNDERCOUNT, not a defect: CONSENTING VISITORS ONLY. Reading exempt"
echo "   storage for an analytics purpose is still an analytics access. Treat it as a sample,"
echo "   never as a total, and never divide it by a count that includes the page-load bucket."
echo ""
if [ -s "$TMP/p-signal" ]; then
    {
        awk -F'\t' '$5=="repeat" {print $2"\trepeat"}' "$TMP/p-signal"
        awk -F'\t' '{print $2"\tshop"}' "$TMP/p-view"
    } | awk -F'\t' "$AWK_LIB"'
        { if ($2=="repeat") r[$1]++; else s[$1]++; seen[$1]=1 }
        END { for (k in seen) if (k in r) printf "%d\t%s\t%d\n", (k in s?s[k]:0), k, r[k] }' \
    | sort -rn | awk -F'\t' "$AWK_LIB"'
        !hdr { printf "   %-28s %12s %10s %9s %-11s\n", "page", "people shop", "returned", "%repeat", "95% CI"; hdr=1 }
        { printf "   %-28s %12d %10d %9s %-11s\n", $2, $1, $3, rate($3,$1), ($1>0?wilson($3,$1):"") }
        END { if (!hdr) print "   (no repeat rows in this window)" }'
else
    echo "   (no signal log rows in this window)"
fi

# ---- naming ----------------------------------------------------------------------------------
echo ""
echo "==============================================================================="
echo " NAMED CALCULATIONS — they meant to show it to another person"
echo "==============================================================================="
echo "   The closest instrument this suite has to its own reason for existing. A view says they"
echo "   looked, a calculation says they got an answer, a typed title says they intend to put"
echo "   the result in front of somebody else. The text typed is never sent and never stored."
echo ""
for b in p l; do
    if [ "$b" = "p" ]; then label="PEOPLE"; else label="PAGE LOADS"; fi
    [ -s "$TMP/$b-title" ] || continue
    t=$(awk -F'\t' '$5=="title"' "$TMP/$b-title" | wc -l | tr -d ' ')
    s=$(awk -F'\t' '$5=="subtitle"' "$TMP/$b-title" | wc -l | tr -d ' ')
    printf "   %-12s titles %6d   subtitles %6d\n" "$label" "$t" "$s"
done
if [ -s "$TMP/p-title" ] || [ -s "$TMP/l-title" ]; then
    echo ""
    echo "--- Named per confirmed calculation, by page (PEOPLE) ---"
    {
        awk -F'\t' '$5=="title" {print $2"\tnamed"}' "$TMP/p-title"
        awk -F'\t' '{print $2"\tcalc"}' "$TMP/p-calc"
    } | awk -F'\t' "$AWK_LIB"'
        { if ($2=="named") n[$1]++; else c[$1]++; seen[$1]=1 }
        END { for (p in seen) printf "%d\t%s\t%d\n", (p in c?c[p]:0), p, (p in n?n[p]:0) }' \
    | sort -rn | awk -F'\t' "$AWK_LIB"'
        !hdr { printf "   %-28s %10s %10s %9s %-11s\n", "page", "calcs", "named", "%named", "95% CI"; hdr=1 }
        { printf "   %-28s %10d %10d %9s %-11s\n", $2, $1, $3, rate($3,$1), ($1>0?wilson($3,$1):"") }'
else
    echo "   (nobody has typed a Printable Title in this window)"
fi

# ---- contact funnel ---------------------------------------------------------------------------
echo ""
echo "==============================================================================="
echo " CONTACT FUNNEL — invitation clicks -> messages actually sent"
echo "==============================================================================="
echo "   clicks = confirmed-human views of contact.php. sends = messages formmail.php actually"
echo "   mailed, logged server-side in its success branch and NOT de-duplicated, because one"
echo "   person writing twice is two messages. The send log has no bucket column, so clicks are"
echo "   shown for both buckets and the reader picks the honest denominator."
echo ""
CLICKS_P=$(awk -F'\t' '$2=="contact"' "$TMP/p-view" | wc -l | tr -d ' ')
CLICKS_L=$(awk -F'\t' '$2=="contact"' "$TMP/l-view" | wc -l | tr -d ' ')
SENDS=$(n_of "$TMP/send")
printf "   %-32s %8d\n" "invitation clicks (people)" "$CLICKS_P"
printf "   %-32s %8d\n" "invitation clicks (page loads)" "$CLICKS_L"
printf "   %-32s %8d\n" "messages sent" "$SENDS"
echo ""
echo "   The two causes of a contact drought call for OPPOSITE fixes: few clicks means the"
echo "   invitation is invisible (wording and placement are the lever); many clicks and few"
echo "   sends means the invitation works and the FORM is the barrier. At these counts neither"
echo "   is established — read the pair of raw numbers, not a ratio."

# ---- behaviour signals ------------------------------------------------------------------------
echo ""
echo "==============================================================================="
echo " WHAT PEOPLE DID NEXT (Tasks 216 and 200)"
echo "==============================================================================="
echo "   Everything above counts how many. This counts what they then did, and it is never"
echo "   divided by anything but a view count."
echo ""
echo "   ONE CAUTION FOR THE WHOLE SECTION: these rows de-duplicate per PAGE LOAD, in the"
echo "   page's own memory, while views and calculations de-duplicate per VISIT against the"
echo "   ec_seen cookie — whose five bits are full, and whose sixth would make the consent"
echo "   banner's 'a single digit per page' untrue. So a signal count and a people-bucket view"
echo "   count are different units. The only place a rate is honest is the PAGE-LOAD bucket,"
echo "   where nothing is stored and therefore both sides are page loads. That is why the"
echo "   rates below come from that bucket and the people bucket shows raw counts."
echo ""
if [ ! -s "$TMP/signal" ]; then
    echo "   (no signal rows in this window)"
else
echo "--- Signal rows by event ---"
printf "    %-12s %10s %12s\n" "event" "people" "page loads"
{
    awk -F'\t' '$5!="" {print $5"\tp"}' "$TMP/p-signal"
    awk -F'\t' '$5!="" {print $5"\tl"}' "$TMP/l-signal"
} | awk -F'\t' '
    { if ($2=="p") p[$1]++; else l[$1]++; seen[$1]=1 }
    END { for (k in seen) printf "%d\t%d\t%s\n", (k in p?p[k]:0), (k in l?l[k]:0), k }' \
| sort -rn | awk -F'\t' '{ printf "    %-12s %10d %12d\n", $3, $1, $2 }'

echo ""
echo "=== Reference lookups (Task 216) ==="
echo "    A click OUT of /engcalcs/. THE ROW THAT MATTERS IS ANY ROW NOT 'en': everything we"
echo "    link to is English, so a visitor reading in Spanish who opens an English-only"
echo "    roughness table has told us everything a survey would. Feeds Task 217."
echo ""
awk -F'\t' '$5=="outbound" {print $6}' "$TMP/signal" | sort | uniq -c | sort -rn | head -20
echo ""
echo "--- Reference clicks by served language ---"
awk -F'\t' '$5=="outbound" {print ($3==""?"(none)":$3)}' "$TMP/signal" | sort | uniq -c | sort -rn

echo ""
echo "=== Did they touch anything? (Task 200) ==="
echo "    A view with no calculation splits two ways and the two call for opposite fixes:"
echo "    somebody who never touched an input could not understand the page; somebody who"
echo "    touched it and left tried it and did not want it. Rate from the page-load bucket."
echo ""
if [ -s "$TMP/l-view" ]; then
    {
        awk -F'\t' '$5=="touch" {print $2"\ttouch"}' "$TMP/l-signal"
        awk -F'\t' '{print $2"\tview"}' "$TMP/l-view"
    } | awk -F'\t' "$AWK_LIB"'
        { if ($2=="touch") t[$1]++; else v[$1]++; seen[$1]=1 }
        END { for (p in seen) printf "%d\t%s\t%d\n", (p in v?v[p]:0), p, (p in t?t[p]:0) }' \
    | sort -rn | awk -F'\t' "$AWK_LIB"'
        !hdr { printf "    %-26s %11s %10s %9s %-11s\n", "page", "page loads", "touched", "%touched", "95% CI"; hdr=1 }
        { printf "    %-26s %11d %10d %9s %-11s\n", $2, $1, $3, rate($3,$1), ($1>0?wilson($3,$1):"") }'
else
    echo "    (no page-load-bucket views, so no honest denominator; raw touch counts follow)"
    awk -F'\t' '$5=="touch" {print $2}' "$TMP/signal" | sort | uniq -c | sort -rn
fi

echo ""
echo "=== Units actually chosen (Task 200) ==="
echo "    Validates EC_DEFAULT_UNIT_SET-by-language and the per-family defaults of Task 162."
echo "    READ THIS TO REORDER OPTIONS, NEVER TO DELETE ONE. An unused option costs a user"
echo "    essentially nothing; a missing one costs them the whole calculator."
echo ""
echo "--- Preset button clicks ---"
awk -F'\t' '$5=="units" && $6 ~ /^preset:/ {print $6}' "$TMP/signal" | sort | uniq -c | sort -rn
echo ""
echo "--- Preset clicks by served language (a language always clicking US is one this gets wrong) ---"
awk -F'\t' '$5=="units" && $6 ~ /^preset:/ {print ($3==""?"(none)":$3)"\t"$6}' "$TMP/signal" | sort | uniq -c | sort -rn | head -30
echo ""
echo "--- Individual unit selections, by family ---"
awk -F'\t' '$5=="units" && $6 !~ /^preset:/ {print $6}' "$TMP/signal" | sort | uniq -c | sort -rn | head -40

echo ""
echo "=== Looped-Network: where the map interface loses people (Task 200) ==="
echo "    first:  which of the four ways INTO a network the visitor reached for first. This is"
echo "            the first evidence bearing on the empty-canvas decision closed 2026-07-29"
echo "            with no data: a large first:example share vindicates it, a large 'nothing'"
echo "            share overturns it."
echo "    diag:   which pre-solve complaint is actually met. The biggest one names the next"
echo "            thing to fix on that page."
echo ""
awk -F'\t' '$5=="lpn" && $6 ~ /^first:/ {print $6}' "$TMP/signal" | sort | uniq -c | sort -rn
LPN_VIEWS=$(awk -F'\t' '$2=="Looped-Network"' "$TMP/l-view" | wc -l | tr -d ' ')
LPN_FIRST=$(awk -F'\t' '$5=="lpn" && $6 ~ /^first:/' "$TMP/l-signal" | wc -l | tr -d ' ')
if [ "$LPN_VIEWS" -gt 0 ]; then
    echo ""
    printf "    %-30s %8d\n" "page loads (page-load bucket)" "$LPN_VIEWS"
    printf "    %-30s %8d\n" "  of those, did something" "$LPN_FIRST"
    printf "    %-30s %8d\n" "  of those, did NOTHING" "$((LPN_VIEWS - LPN_FIRST))"
    echo "    'Nothing' is a residual, not a logged event, so it also absorbs anyone who left"
    echo "    before the page finished loading."
fi
echo ""
echo "--- Diagnostics met ---"
awk -F'\t' '$5=="lpn" && $6 ~ /^diag:/ {print $6}' "$TMP/signal" | sort | uniq -c | sort -rn

echo ""
echo "=== Sharing a calculation (Task 228) ==="
echo "    'copy' means the clipboard took the link; 'manual' means the browser had none here"
echo "    and the link was shown to be copied by hand. A large manual share is a"
echo "    browser-support fact, not a failure. NOT MEASURED and not measurable from here:"
echo "    whether anybody ever OPENED a shared link — it arrives as an ordinary page view."
echo ""
awk -F'\t' '$5=="share" {print $6}' "$TMP/signal" | sort | uniq -c | sort -rn
fi

# ---- coverage footer --------------------------------------------------------------------------
echo ""
echo "==============================================================================="
echo " COVERAGE — each tier began logging on a DIFFERENT date"
echo "==============================================================================="
echo "   If the calculation log started after the page-view log, %using is understated for"
echo "   every row above: some counted shoppers arrived before a calculation could be recorded"
echo "   at all. Check these dates before treating any conversion rate as real."
echo ""
printf "   %-32s %8s  %-21s %-21s\n" "log" "rows" "first in window" "last in window"
for pair in "engcalcs-lang.log:lang" "engcalcs-human-view.log:view" "engcalcs-calc-usage.log:calc" "engcalcs-contact-send.log:send" "engcalcs-title.log:title" "engcalcs-signal.log:signal"; do
    f="$TMP/${pair##*:}"
    printf "   %-32s %8s  %-21s %-21s\n" "${pair%%:*}" "$(n_of "$f")" "$(first_of "$f")" "$(last_of "$f")"
done
echo ""
echo " WINDOW        $WIN_START  ..  $WIN_END   ($WIN_DAYS days)"
echo " FINGERPRINT   $FINGERPRINT"
echo ""
echo " Snapshotting into dev/usage-data-log.md: paste the WINDOW and FINGERPRINT lines with"
echo " whatever table you keep. A table pasted without them cannot be compared to anything."
echo ""
