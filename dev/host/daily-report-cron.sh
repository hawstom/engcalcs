#!/bin/sh
# daily-report-cron.sh -- the 20:00 wrapper for dev/scripts/daily_report.sh. Installs as ~/.
#
# THREE THINGS IT DOES, AND ONLY ONE OF THEM IS "RUN THE REPORT".
#
# 1. REFRESH THE MIRROR, NOT PRODUCTION. Deployment is a `git pull` Tom runs by hand, and this must
#    never do it -- nor even a `git fetch` in the production checkout, because ecDeployIdentity()
#    dates the About box from filemtime() on the ref HEAD resolves through, packed-refs included,
#    and a fetch can rewrite packed-refs. That would advance the displayed build date with nothing
#    deployed: the stale-date defect deploy_identity_selftest.php exists for, arriving backwards.
#    So the mirror is a SEPARATE clone outside the document root, and production is only ever read
#    with `git rev-parse HEAD`.
#
# 2. RUN THE REPORT OUT OF A CURRENT CHECKOUT, not out of production, which is deliberately behind.
#    The report describes master; running it from a month-old tree would describe a month-old master
#    in language that reads as current.
#
# 3. MAIL IT UNCONDITIONALLY. ~/cronmail.sh is silent on empty input, which is right for an alarm
#    and wrong for a heartbeat: a healthy site and a dead cron are the same silence. This report
#    always has content, so it always sends, and its arrival is the signal. Tom, 2026-09-15:
#    "Yep. There's my report. Cron is still up and working."
#
# A FAILURE HERE MUST STILL MAIL SOMETHING. If the mirror cannot be fetched or the checkout cannot
# be updated, the report still runs and says NOT MEASURED in the affected section. What must never
# happen is a silent exit -- that is indistinguishable from the cron job being gone, which is the
# exact failure this whole task is about.

set -u
PATH=/usr/local/bin:/usr/bin:/bin:$PATH
export PATH

MIRROR=$HOME/tgh/engcalcs-mirror.git
WORK=$HOME/tgh/engcalcs-report
PROD=$HOME/addon_html/hawsedc.com/engcalcs
PHP=/opt/cpanel/ea-php83/root/usr/bin/php
LOG=$HOME/daily-report.last
PREFLIGHT=

note() { PREFLIGHT="$PREFLIGHT
$1"; }

# Bounded, because an unbounded wait in a cron job is how eight shells came to be asleep for ten
# hours on 2026-09-13. `timeout` gives up loudly; the report then says NOT MEASURED.
if [ -d "$MIRROR" ]; then
    timeout 120 git -C "$MIRROR" fetch --prune origin '+refs/heads/*:refs/heads/*' >/dev/null 2>&1 \
        || note "PREFLIGHT: mirror fetch failed or timed out -- branch and deploy numbers may be stale."
else
    note "PREFLIGHT: no mirror at $MIRROR. Run: sh dev/host/install.sh"
fi

# NO `reset --hard`, AND THE REASON IS TOM'S QUESTION: "What good could possibly come of this?"
# None. It was here to guarantee the checkout matched origin/master, and it bought that by being
# willing to DESTROY anything anybody had put in that directory, silently, at 22:00, every night.
# This repository already has that exact scar written down: the copy-aside-and-restore dance
# destroyed another session's uncommitted language keys on 2026-09-06, and the lesson recorded from
# it is that a technique is safe only while nobody else is writing -- which is precisely the
# condition under which you do not need it.
#
# SO: FAST-FORWARD ONLY, AND REFUSE TO TOUCH A DIRTY TREE. If somebody has edited or left something
# there, the report says so and describes the older master rather than tidying a human's work away.
# A stale number that announces itself is worth more than a fresh one bought this way.
if [ -d "$WORK/.git" ]; then
    dirty=$(timeout 30 git -C "$WORK" status --porcelain 2>/dev/null)
    if [ -n "$dirty" ]; then
        note "PREFLIGHT: $WORK has uncommitted changes, so it was LEFT ALONE and the numbers below
may describe an older master. Nothing was discarded. Someone's work is sitting in
that directory:
$(printf '%s\n' "$dirty" | head -10 | sed 's/^/    /')"
    else
        timeout 120 git -C "$WORK" fetch origin master >/dev/null 2>&1 \
            || note "PREFLIGHT: could not fetch in $WORK. Numbers may describe an older master."
        # --ff-only: it cannot rewrite history and cannot discard a commit. If it refuses, that
        # means the checkout has diverged, which is a thing to look at rather than to bulldoze.
        timeout 60 git -C "$WORK" merge --ff-only origin/master >/dev/null 2>&1 \
            || note "PREFLIGHT: $WORK has DIVERGED from origin/master and was not fast-forwarded.
It holds a commit master does not. Look at it:  git -C $WORK log --oneline origin/master..HEAD"
    fi
else
    note "PREFLIGHT: no report checkout at $WORK. Run: sh dev/host/install.sh"
fi

REPORT=${TMPDIR:-/tmp}/daily-report.$$
{
    if [ -n "$PREFLIGHT" ]; then
        echo "*** THE REPORT'S OWN PLUMBING REPORTED A PROBLEM ***"
        echo "$PREFLIGHT"
        echo
    fi
    if [ -r "$WORK/dev/scripts/daily_report.sh" ]; then
        EC_PROD=$PROD EC_MIRROR=$MIRROR EC_PHP=$PHP \
            timeout 600 sh "$WORK/dev/scripts/daily_report.sh" 2>&1
        rc=$?
        [ "$rc" -ne 0 ] && echo "
*** daily_report.sh exited $rc. The sections above may be incomplete. ***"
    else
        echo "daily_report.sh is not present at $WORK. Nothing could be measured."
        echo "This message is still being sent, because a silent night is the one"
        echo "outcome that cannot be told apart from cron having stopped."
    fi
} > "$REPORT" 2>&1

# THE SUBJECT LINE IS TOM'S OWN SPECIFICATION, 2026-09-15, in his order: the cPanel account name,
# because that is how he thinks about this machine; "daily status"; the date; and then the top
# folder the report is about, so that a second one on another folder is distinguishable at a glance
# in a mailbox. Derived from $PROD rather than typed, or it would go stale the day the path moves.
SCOPE=$(printf '%s' "$PROD" | sed "s|^$HOME/||")
cp "$REPORT" "$LOG" 2>/dev/null
"$HOME/cronmail.sh" "jconstru daily status $(date '+%Y-%m-%d') for $SCOPE" < "$REPORT"
rm -f "$REPORT"
exit 0
