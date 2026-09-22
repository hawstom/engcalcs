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

# SCOPE, in folders rather than in a commit id. The header used to read "report from 3f504619" and
# Tom asked what that meant: it was the SHA of the script generating the report, which is a fact
# about this file and not about anything he is being told. Gone. What a reader needs is which
# directory the numbers describe, and the honest answer is that the PAGE CHECK covers the whole
# account while everything else covers one repository -- so both are named, and each section that
# differs says so again where it is read.
SCOPE=$(printf '%s' "$PROD" | sed "s|^$HOME/||")
echo "jconstru daily status $(date '+%Y-%m-%d') for $SCOPE"
echo "$(date '+%H:%M %Z') on $(hostname)"
echo
echo "This daily message is the heartbeat of cron."
echo
echo "It is sent whether or not anything is wrong, because the 04:20 page check is"
echo "SILENT when every page passes -- and that silence cannot be told apart from"
echo "cron having died, which on this account it really had, for years. So this"
echo "message arriving means the machinery ran. Its ABSENCE is the alarm."

# ---------------------------------------------------------------------------
# 1. UPTIME. ~/check.sh writes one row per run whether it passed or failed, which is what makes
#    "did it run?" answerable at all. failed=0 is a pass; the failures themselves are in check.last.
# ---------------------------------------------------------------------------
hr "PAGE CHECK, last 7 runs"
echo "   Every page on the WHOLE ACCOUNT -- all nine domains, not just $SCOPE."
echo "   checked=N is how many URLs were fetched. failed=N is how many answered"
echo "   BADLY: a status of 400 or worse, no answer at all, or a PHP error found in"
echo "   the body of a page that still returned 200. failed=0 is the healthy line;"
echo "   any other number means the URLs listed underneath were broken that morning."
echo
if [ -r "$CHECKLOG" ]; then
    tail -7 "$CHECKLOG" | sed 's/^/   /'
    last=$(tail -1 "$CHECKLOG" | sed -n 's/.*failed=\([0-9]*\).*/\1/p')
    lastday=$(tail -1 "$CHECKLOG" | cut -f1 | cut -d' ' -f1)
    today=$(date '+%Y-%m-%d')
    if [ "$lastday" != "$today" ]; then
        echo "   STALE: newest row is $lastday, not $today. The 04:20 job did not run."
    fi
    if [ "${last:-0}" != "0" ] && [ -r "$CHECKLAST" ]; then
        echo
        echo "   What failed in that run:"
        sed 's/^/   /' "$CHECKLAST"
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
# THE COUNT FIRST, AND ANY TRUNCATION NAMED. This section said "last 7 days" and showed two days'
# worth, because it was capped at `head -20` and there were more than twenty -- so the heading was a
# claim the body contradicted, and Tom read it, correctly, as a lie. A truncation that does not
# announce itself is worse than no list at all: it makes a busy week look like a quiet one.
if [ -d "$MIRROR" ]; then
    out=$(run 20 "git -C '$MIRROR' log --first-parent --merges --since=7.days --format='%cs %s' master")
    n=$(printf '%s\n' "$out" | grep -c . )
    if [ "${n:-0}" = "0" ]; then
        echo "   none in the last 7 days"
    else
        echo "   $n merge(s) in the last 7 days, by day:"
        printf '%s\n' "$out" | awk '{print $1}' | sort | uniq -c \
            | awk '{printf "     %s   %s merge(s)\n", $2, $1}'
        echo
        echo "   the 10 most recent:"
        printf '%s\n' "$out" | head -10 | sed 's/^/     /'
        if [ "$n" -gt 10 ]; then
            echo "     ... and $((n - 10)) more in the window, not listed."
        fi
    fi
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
hr "WHAT CANNOT MERGE TO master"
# REWRITTEN 2026-09-15. It printed four raw JSON values -- "freeze active: false", "protected:",
# "all-clears:", "open blockers:" -- and Tom, who is the only reader, did not know what three of
# them meant and called the fourth dangerous. He was right on both counts, and a line the reader
# cannot interpret is noise however true it is.
#
# THE DANGEROUS ONE WAS "freeze active: false" DURING A FEATURE FREEZE. Both statements are true
# and they are about different things, which is exactly why printing the boolean alone misleads:
# `freeze.active` is an EMERGENCY STOP that refuses every merge but a `hotfix:`, and it is off
# deliberately, because turning it on once blocked a day of bug fixes that Tom was waiting for. The
# FEATURE freeze is held branch by branch, by the list below. So the report now says what each
# mechanism actually does, and says out loud the gap between them -- a NEW feature branch is
# refused by nothing until somebody adds it to that list.
"$PHP" -r '$root = $argv[1];
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
    /* THE FEATURE FREEZE LEADS, because it is the one usually on and the one Tom means when he
       says "we are in a freeze". Printing the EMERGENCY flag first and alone is what produced
       "freeze active: false" during a huge freeze, which he called dangerous and was right to. */
    $ff = !empty($p["feature_freeze"]["active"]);
    printf("   FEATURE FREEZE -- %s\n", $ff ? "ON" : "off");
    if ($ff) {
        echo "     No feature merges, and YOUR OWN ALL-CLEAR DOES NOT OVERRIDE IT. An approval\n";
        echo "     you give now keeps standing and takes effect when the freeze is lifted.\n";
        foreach (array("since" => "frozen since", "until" => "until") as $k => $lbl) {
            if (!empty($p["feature_freeze"][$k])) {
                printf("     %s: %s\n", $lbl, $p["feature_freeze"][$k]);
            }
        }
        echo "     Defect and tooling work is UNAFFECTED and still merges on a green suite.\n";
    } else {
        echo "     Features may merge, with your written all-clear, one branch at a time.\n";
    }

    $a = !empty($p["freeze"]["active"]);
    printf("\n   Emergency stop, refusing EVERY merge but a 'hotfix:' one -- %s\n",
        $a ? "ON" : "off");
    if ($a) {
        printf("     NOTHING merges until this is turned off, bug fixes included.%s\n",
            !empty($p["freeze"]["until"]) ? " Set until: " . $p["freeze"]["until"] : "");
    } else {
        echo "     Off on purpose, and it is a DIFFERENT thing from the feature freeze above:\n";
        echo "     switching this one on stops the defect fixes you are waiting for too.\n";
    }

    $prot = empty($p["protected"]) ? array() : $p["protected"];
    echo "\n   Branches treated as FEATURES, each needing your written all-clear:\n";
    if (!$prot) { echo "     none listed\n"; }
    else { foreach ($prot as $one) { echo "     $one\n"; } }
    echo "     This is a POLICY, not an inventory: a name here may be a branch that no\n";
    echo "     longer exists, and BRANCHES above is the inventory. The two need not agree.\n";
    echo "     A branch NOT on this list counts as a defect or tooling track and merges on\n";
    echo "     a green suite alone -- so a NEW feature branch is refused by nothing until\n";
    echo "     somebody adds it here.\n";
}

if ($c === null) { echo "   NOT MEASURED: dev/branch-all-clears.json unreadable\n"; }
else {
    $k = isset($c["cleared"]) && is_array($c["cleared"]) ? array_keys($c["cleared"]) : array();
    echo "\n   All-clears you have given, still valid: " . ($k ? implode(", ", $k) : "none") . "\n";
    echo "     Your own words, pinned to the exact commit you cleared, so the permission\n";
    echo "     EXPIRES BY ITSELF the moment that branch moves.\n";
}

if ($b === null) { echo "   NOT MEASURED: dev/deploy-blockers.json unreadable\n"; }
else {
    $l = array();
    foreach ((isset($b["blockers"]) && is_array($b["blockers"])) ? $b["blockers"] : array() as $one) {
        $l[] = isset($one["id"]) ? $one["id"] : "(unnamed)";
    }
    echo "\n   Things you have said must not ship yet: " . ($l ? strtoupper(implode(", ", $l)) : "none") . "\n";
    echo "     Written down the moment you say one, because a constraint that lives only\n";
    echo "     in a conversation is one a later session cannot look up.\n";
}' "$HERE"


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
            # R-121/122/123: Tom read this table with no headings and could not tell what the
            # numbers were, then guessed "page loads" includes robots and "people" means
            # long-dwell. Neither guess is right -- checked against log/lang-log-stats.sh and
            # lib/UsageReport.lib.php: "people" is the CONSENTED bucket (one row per person per
            # page, by cookie, nothing to do with dwell time); "page loads" is everybody else, one
            # row per page view. This table is built from the >=10s-dwell "shopping" beacon for
            # BOTH columns, so it already excludes nearly all robots by behaviour -- there is no
            # user-agent or robot list anywhere in this codebase. So the headings say what is true
            # rather than what he guessed.
            printf '%s\n' "$out" | awk '
                /RANK BY SHOPPING/ {
                    r=1
                    print ""
                    print " rank by shopping (top pages; two counts, never summed):"
                    print "   people      visitors who accepted the consent banner, counted"
                    print "               once per person per page"
                    print "   page loads  everyone else, one row per page view"
                    print "   Both count only after 10+ seconds on the page, so robots are"
                    print "   nearly all excluded."
                    next
                }
                r && /^ *rank[[:space:]]/  {print; next}
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
# WHAT THE MAILBOX IS, because Tom asked and the answer is not obvious: ~/mail/new is the cPanel
# CATCH-ALL for constructionnotesmanager.com, whose default address is set to the system user
# `jconstru`, plus anything addressed to that Unix user locally -- which is where cron's own
# undeliverable mail piled up. Every other domain on the account is set to ":fail: No Such User
# Here" and catches nothing.
#
# IT IS NOT THE ACCOUNT'S DISK. The old line reported the SHARED filesystem at 96%, which is a fact
# about the hosting company's array and not about him; his own quota is unlimited. So it reports
# what he actually uses, and the shared figure only when it is tight enough to threaten the site.
if [ -d "$MAILDIR" ]; then
    tot=$(ls "$MAILDIR" 2>/dev/null | wc -l | tr -d ' ')
    new=$(find "$MAILDIR" -type f -mtime -1 2>/dev/null | wc -l | tr -d ' ')
    echo "   Catch-all mailbox ($MAILDIR): $tot message(s), $new in the last day."
    if [ "${new:-0}" != "0" ]; then
        echo "   A FRESH ONE MAY MEAN AN ALARM IS NOT REACHING ANYBODY. Read it:"
        echo "     ls -t $MAILDIR | head -1"
    fi
    if [ "${tot:-0}" -gt 2000 ]; then
        echo "   This is a catch-all, so most of it is spam and refused cron mail. Clearing it"
        echo "   is safe; setting the default address to \":fail:\" would stop it filling."
    fi
else
    miss "$MAILDIR not readable"
fi
echo "   Account space used: $(du -sh "$HOME" 2>/dev/null | cut -f1 | tr -d ' ') (quota: unlimited)."
sharepct=$(df -hP "$HOME" 2>/dev/null | tail -1 | awk '{gsub(/%/,"",$5); print $5}')
if [ -n "$sharepct" ] && [ "$sharepct" -ge 98 ] 2>/dev/null; then
    echo "   THE SHARED FILESYSTEM IS AT ${sharepct}%, which is everyone on this server and not"
    echo "   your quota -- but at this level it can break the site. Worth telling the host."
fi


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
