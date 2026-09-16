#!/bin/sh
# daily_report.sh -- the derived status report. Task 676 phase 2.
#
# WHY IT EXISTS, and the design constraint that follows from it. Tom, 2026-09-15:
#
#     "A weekly report is exactly the superpower of the entire failure monitoring plan. It's Tom
#      saying every Friday night at 8:00 or whatever, 'Yep. There's my report. Cron is still up and
#      working.'"
#
# So THE REPORT ARRIVING IS THE HEARTBEAT, and that is not a nicety -- it is the hole the existing
# alarm cannot close. ~/check.sh is deliberately SILENT on success, which is right for an alarm and
# means a healthy site and a dead cron look identical from the inbox. One of them had in fact been
# dead for years. A report that arrives every day, even saying nothing is wrong, is the only thing
# that distinguishes them, and it is why this runs UNCONDITIONALLY and mails on every run.
#
# EVERY NUMBER IS DERIVED BY A SCRIPT OR BY git. NOTHING IS NARRATED.
# dev/reputation-and-practice.md §5: "A weekly report written in prose by the same system that made
# the mistakes is not evidence; it is a second opportunity to be confidently wrong." So there is no
# summary line, no judgement, no adjectives. Boring, numeric, and IDENTICAL IN SHAPE every day, so
# that a changed number is visible without reading.
#
# A SECTION THAT CANNOT BE MEASURED SAYS SO IN CAPITALS AND DOES NOT FAIL THE REPORT. A report that
# dies because one number was unavailable is a report that stops arriving, which is the failure this
# whole task exists to end. Every section is bounded and every section degrades.
#
# WHERE IT RUNS. On the host, out of a checkout of current origin/master that its wrapper refreshes
# -- NOT out of the production checkout, which it only ever reads with `git rev-parse HEAD`. See
# dev/host/README.md for why a `git fetch` in production would move the About box's build date.
#
# Usage:  sh dev/scripts/daily_report.sh
#   EC_PROD      production checkout to read HEAD from   (default: the cPanel path)
#   EC_MIRROR    mirror clone for branch comparisons     (default: ~/tgh/engcalcs-mirror.git)
#   EC_CHECKLOG  ~/check.log from the page check         (default: ~/check.log)
#   EC_CHECKLAST ~/check.last, the last run's failures   (default: ~/check.last)
#   EC_PHP       a PHP 7+ binary                         (default: ea-php83, then `php`)
# Exit 0 always, unless the report itself could not be written.

set -u

PROD=${EC_PROD:-/home/jconstru/addon_html/hawsedc.com/engcalcs}
MIRROR=${EC_MIRROR:-$HOME/tgh/engcalcs-mirror.git}
CHECKLOG=${EC_CHECKLOG:-$HOME/check.log}
CHECKLAST=${EC_CHECKLAST:-$HOME/check.last}
MAILDIR=${EC_MAILDIR:-$HOME/mail/new}
HERE=$(cd "$(dirname "$0")/../.." && pwd)

if [ -n "${EC_PHP:-}" ]; then PHP=$EC_PHP
elif [ -x /opt/cpanel/ea-php83/root/usr/bin/php ]; then PHP=/opt/cpanel/ea-php83/root/usr/bin/php
else PHP=php; fi

# Every external command is time-bounded. An unbounded wait in a cron job is the shape that left
# eight shells sleeping for ten hours on 2026-09-13; see wait_guard_selftest.php.
run() { timeout "$1" sh -c "$2" 2>&1; }

hr()  { echo; echo "-- $1 ---------------------------------------------------------------" \
        | cut -c1-72; }
miss(){ echo "   NOT MEASURED: $1"; }

echo "EngCalcs status -- $(date '+%Y-%m-%d %H:%M %Z')"
echo "host $(hostname)   report from $(git -C "$HERE" rev-parse --short HEAD 2>/dev/null || echo '?')"
echo
echo "This message arriving is the heartbeat. If it stops, cron stopped -- the page"
echo "check is silent on success, so silence proves nothing on its own."

# ---------------------------------------------------------------------------
# 1. UPTIME. ~/check.sh writes one row per run whether it passed or failed, which is what makes
#    "did it run?" answerable at all. failed=0 is a pass; the failures themselves are in check.last.
# ---------------------------------------------------------------------------
hr "PAGE CHECK, last 7 runs"
if [ -r "$CHECKLOG" ]; then
    tail -7 "$CHECKLOG" | sed 's/^/   /'
    last=$(tail -1 "$CHECKLOG" | sed -n 's/.*failed=\([0-9]*\).*/\1/p')
    lastday=$(tail -1 "$CHECKLOG" | cut -f1 | cut -d' ' -f1)
    today=$(date '+%Y-%m-%d')
    if [ "$lastday" != "$today" ]; then
        echo "   STALE: newest row is $lastday, not $today. The 04:20 job did not run."
    fi
    if [ "${last:-0}" != "0" ] && [ -r "$CHECKLAST" ]; then
        echo; sed 's/^/   /' "$CHECKLAST"
    fi
else
    miss "$CHECKLOG is not readable"
fi

# ---------------------------------------------------------------------------
# 2. DEPLOY. PRODUCTION IS NOT master -- production is the SHA somebody last pulled, and master can
#    advance for days and ship nothing. So this reports both and the distance between them, and it
#    reads production with rev-parse ONLY. See dev/host/README.md.
# ---------------------------------------------------------------------------
hr "DEPLOY"
prodsha=$(run 10 "git -C '$PROD' rev-parse HEAD" | head -1)
case "$prodsha" in
    [0-9a-f][0-9a-f]*) : ;;
    *) prodsha=; ;;
esac
if [ -n "$prodsha" ]; then
    echo "   production  $(echo "$prodsha" | cut -c1-8)  $(run 10 "git -C '$PROD' log -1 --format='%cs %s' $prodsha" | head -1 | cut -c1-58)"
else
    miss "cannot read HEAD in $PROD"
fi
if [ -d "$MIRROR" ]; then
    mhead=$(run 10 "git -C '$MIRROR' rev-parse master" | head -1)
    echo "   master      $(echo "$mhead" | cut -c1-8)  $(run 10 "git -C '$MIRROR' log -1 --format='%cs %s' master" | head -1 | cut -c1-58)"
    if [ -n "$prodsha" ]; then
        if run 5 "git -C '$MIRROR' cat-file -e ${prodsha}^{commit}" >/dev/null 2>&1; then
            n=$(run 10 "git -C '$MIRROR' rev-list --count ${prodsha}..master" | head -1)
            echo "   awaiting deploy: ${n:-?} commit(s) on master that production does not have"
            [ "${n:-0}" != "0" ] && run 10 "git -C '$MIRROR' log --oneline ${prodsha}..master" \
                | head -12 | sed 's/^/     /'
        else
            echo "   awaiting deploy: UNKNOWN -- production's SHA is not in the mirror."
            echo "     That means production is on a commit that was never pushed, or the"
            echo "     mirror has not been fetched. Neither is normal; look at it."
        fi
    fi
else
    miss "no mirror clone at $MIRROR (see dev/host/install.sh)"
fi

# ---------------------------------------------------------------------------
# 3. WHAT LANDED. --first-parent --merges is how a merge-per-capability history reads back.
# ---------------------------------------------------------------------------
hr "MERGED TO master, last 7 days"
if [ -d "$MIRROR" ]; then
    out=$(run 15 "git -C '$MIRROR' log --first-parent --merges --since=7.days --format='%cs %s' master")
    if [ -n "$out" ]; then echo "$out" | head -20 | sed 's/^/   /'; else echo "   none"; fi
else
    miss "no mirror clone"
fi

# ---------------------------------------------------------------------------
# 4. BRANCHES. branch_hygiene_check.php is the declared source for this, and it is ADVISORY on
#    purpose -- when a branch should die is judgement. What it buys is that an abandoned branch is
#    REPORTED rather than discovered a year later.
# ---------------------------------------------------------------------------
hr "BRANCHES"
if [ -x "$PHP" ] || command -v "$PHP" >/dev/null 2>&1; then
    # POINTED AT THE MIRROR, because the checkout this runs from is single-branch by design and the
    # script read its own tree: the first real run reported "only 'master' exists; nothing to
    # report" about a repository with six branches, which is worse than printing nothing. The
    # mirror is bare and that is fine -- every line of that check is a git command over refs.
    target=$HERE
    [ -d "$MIRROR" ] && target=$MIRROR
    out=$(cd "$HERE" && run 30 "'$PHP' dev/scripts/branch_hygiene_check.php --root='$target'")
    if [ -n "$out" ]; then echo "$out" | head -40 | sed 's/^/   /'
    else miss "branch_hygiene_check.php printed nothing"; fi
    [ "$target" = "$HERE" ] && echo "   (read from this checkout, not the mirror: it may see only one branch)"
else
    miss "no PHP 7+ binary at $PHP"
fi

# ---------------------------------------------------------------------------
# 5. GATES. Read out of the JSON, never restated. A freeze or an open blocker that the report does
#    not carry is a constraint living in a transcript, which dev/deploy-blockers.json exists to end.
# ---------------------------------------------------------------------------
hr "GATES"
# PHP rather than jq: jq is on the host and is NOT in the development checkout, so a jq-only
# reading prints real numbers on one machine and a bare "?" on the other -- and "?" is the shape
# that reads as measured when it is not. PHP is already required by every other section.
"$PHP" -r '
$root = $argv[1];
$g = function ($f) use ($root) {
    $p = "$root/dev/$f";
    if (!is_readable($p)) { return null; }
    $j = json_decode(file_get_contents($p), true);
    return is_array($j) ? $j : null;
};
$p = $g("branch-policy.json");
$c = $g("branch-all-clears.json");
$b = $g("deploy-blockers.json");
if ($p === null) { echo "   NOT MEASURED: dev/branch-policy.json unreadable\n"; }
else {
    $a = isset($p["freeze"]["active"]) ? $p["freeze"]["active"] : null;
    printf("   freeze active: %s%s\n", $a ? "TRUE" : "false",
        $a && !empty($p["freeze"]["until"]) ? "  until " . $p["freeze"]["until"] : "");
    printf("   protected:     %s\n", empty($p["protected"]) ? "none" : implode(", ", $p["protected"]));
}
if ($c === null) { echo "   NOT MEASURED: dev/branch-all-clears.json unreadable\n"; }
else {
    $k = isset($c["cleared"]) && is_array($c["cleared"]) ? array_keys($c["cleared"]) : array();
    printf("   all-clears:    %s\n", $k ? implode(", ", $k) : "none");
}
if ($b === null) { echo "   NOT MEASURED: dev/deploy-blockers.json unreadable\n"; }
else {
    $l = array();
    foreach ((isset($b["blockers"]) && is_array($b["blockers"])) ? $b["blockers"] : array() as $one) {
        $l[] = isset($one["id"]) ? $one["id"] : "(unnamed)";
    }
    printf("   open blockers: %s\n", $l ? strtoupper(implode(", ", $l)) : "none");
}
' "$HERE"

# ---------------------------------------------------------------------------
# 6. THE ENGLISH QUEUE. Tom's reading is the critical path, not the building -- dev/session-handoff
#    §1. new_english_keys.php prints the unread count FIRST, deliberately, because this repository
#    once reported the untranslated count as the unread one and he caught it.
# ---------------------------------------------------------------------------
hr "ENGLISH AND TRANSLATION"
if cd "$HERE" 2>/dev/null; then
    out=$(run 60 "'$PHP' dev/scripts/new_english_keys.php --check")
    echo "$out" | grep -iE 'still to read|untranslated|FRESH|STALE' | head -4 | sed 's/^/   /' \
        || miss "new_english_keys.php said nothing recognisable"
    out=$(run 60 "'$PHP' dev/scripts/friction_check.php")
    echo "$out" | grep -iE 'finding|unanswered|refer-to-human|PASS|FAIL' | head -4 | sed 's/^/   /' \
        || miss "friction_check.php said nothing recognisable"
else
    miss "cannot enter $HERE"
fi

# ---------------------------------------------------------------------------
# 7. ROADMAP. One number, and it is the one that caught a scripted edit nearly deleting nine task
#    blocks: the open-task count fell from 54 to 45 and that is the only reason anybody noticed.
# ---------------------------------------------------------------------------
hr "ROADMAP"
out=$(cd "$HERE" && run 30 "'$PHP' dev/scripts/roadmap_id_check.php")
# Anchored on the script's own verdict lines. A looser grep for "open" swept in a sentence of prose
# explaining what a roadmap TITLE is, which read as a status line and was not one.
line=$(echo "$out" | grep -E '^(PASS|FAIL)' | head -2)
if [ -n "$line" ]; then echo "$line" | sed 's/^/   /'
else miss "roadmap_id_check.php printed no PASS/FAIL line"; fi
echo "$out" | grep -oE '[0-9]+ of [0-9]+ open tasks have a conforming[^.]*' | head -1 | sed 's/^/   /'


# ---------------------------------------------------------------------------
# 8. USAGE. From the PRODUCTION logs, which is the only place the live ones are.
# ---------------------------------------------------------------------------
hr "USAGE, from the production logs"
if [ -x "$PROD/log/lang-log-stats.sh" ] || [ -r "$PROD/log/lang-log-stats.sh" ]; then
    out=$(cd "$PROD" && run 120 "sh log/lang-log-stats.sh")
    if [ -n "$out" ]; then
        # A `head -24` HERE PRINTED TWENTY-FOUR LINES OF DEFINITIONS AND NOT ONE NUMBER, which is
        # the failure a report is most likely to keep making: it looked full. So the sections are
        # named. The WINDOW and FINGERPRINT lines come first and are not decoration -- that script
        # says to quote them with any number taken from it, because two snapshots with different
        # fingerprints describe different populations, and dev/usage-data-log.md records a 40x
        # scale break that happened when a window went unstated.
        picked=$(
            # `awk '!seen'` because lang-log-stats.sh prints WINDOW and FINGERPRINT twice, once in
            # its header and once beside the consent share. Two identical lines in a report that is
            # meant to be identical in shape every day is a thing a reader stops to check.
            printf '%s\n' "$out" | grep -E '^ +(WINDOW|DURATION|FINGERPRINT) ' | awk '!seen[$0]++'
            printf '%s\n' "$out" | awk '
                /RANK BY SHOPPING/         {r=1; print ""; print " rank by shopping:"; next}
                r && /^ *[0-9]+ +[A-Za-z]/ {if (++k<=6) print; next}
                r && k>0 && /^ *$/         {r=0}
                /reach rows:/              {print}
            '
        )
        # AN EXTRACTION THAT MATCHES NOTHING MUST SAY SO. The first version of this section printed
        # a heading and then nothing at all, on a checkout with no logs -- which is the one shape
        # this report may never have, because an empty section reads as "no news" and it means "I
        # did not look". If the shape of lang-log-stats.sh changes, this is what will tell you.
        if [ -n "$(printf '%s' "$picked" | tr -d '[:space:]')" ]; then
            printf '%s\n' "$picked" | sed 's/^/   /'
        else
            miss "lang-log-stats.sh ran and printed $(printf '%s\n' "$out" | wc -l | tr -d ' ') lines, but none matched the WINDOW, rank or reach-row shapes this section reads. Read it by hand: cd $PROD && sh log/lang-log-stats.sh"
        fi
    else
        miss "lang-log-stats.sh printed nothing"
    fi
else
    miss "$PROD/log/lang-log-stats.sh not found"
fi

# ---------------------------------------------------------------------------
# 9. THE MAIL PATH ITSELF. A bounce count is the one number that says whether this report can still
#    be delivered. 22,907 of them accumulated unread over years while every alarm silently failed.
# ---------------------------------------------------------------------------
hr "MAIL PATH"
if [ -d "$MAILDIR" ]; then
    tot=$(ls "$MAILDIR" 2>/dev/null | wc -l | tr -d ' ')
    new=$(find "$MAILDIR" -type f -mtime -1 2>/dev/null | wc -l | tr -d ' ')
    echo "   bounces in $MAILDIR: $tot total, $new in the last day"
    [ "${new:-0}" != "0" ] && echo "   A FRESH BOUNCE MEANS AN ALARM MAY NOT BE REACHING ANYBODY. Read one."
else
    miss "$MAILDIR not readable"
fi
df -hP "$HOME" 2>/dev/null | tail -1 | awk '{print "   disk " $5 " used, " $4 " free on " $6}'

# ---------------------------------------------------------------------------
# 10. WHAT THIS REPORT CANNOT SEE. Stated every single day, because a report whose limits are
#     written down once in a README is a report whose limits nobody knows.
# ---------------------------------------------------------------------------
hr "NOT COVERED HERE"
echo "   check_all.sh does not run on this host: there is no node, so no harness"
echo "   under dev/lpn-spike or dev/calc-spike can execute. The suite's green/red"
echo "   is what dev/hooks/pre-push stamped on the commit that was pushed."
echo "   Nothing here reads code for design or logic errors."
echo
echo "Report generated by dev/scripts/daily_report.sh. Every number above comes from"
echo "a script or from git. Nothing in it is written by an AI at run time."
exit 0
