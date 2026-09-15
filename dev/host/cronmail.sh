#!/bin/sh
# cronmail.sh -- mail a cron job's output so that it can actually be delivered.
#
# WHY THIS EXISTS. Cron's own MAILTO sends as jconstru@minter.nocdirect.com, and
# that host publishes no SPF record at all, so Gmail rejects every one of them:
#     550-5.7.26 ... Gmail requires all senders to authenticate with either SPF or DKIM.
# 2,198 bounces had accumulated in ~/mail/new before anybody noticed. Pointing
# MAILTO at the tom@hawsedc.com forwarder does NOT fix it -- measured 2026-09-08 --
# because forwarding preserves the original envelope sender and the second hop is
# rejected for the same reason.
#
# The fix is the envelope sender, which MAILTO gives no way to set. hawsedc.com
# publishes SPF covering this IP, so -f tom@hawsedc.com passes.
#
# SILENT WHEN THERE IS NOTHING TO SAY: reads stdin, sends nothing on empty input.
# A daily mail that says "fine" trains you to delete it unread.
#
# Usage:  <command> 2>&1 | ~/cronmail.sh "subject"
TO=tom@hawsedc.com
FROM=tom@hawsedc.com
SUBJECT=${1:-"cron output"}
BODY=$(cat)
[ -z "$BODY" ] && exit 0
{
  echo "From: hawsedc.com cron <$FROM>"
  echo "To: $TO"
  echo "Subject: $SUBJECT"
  echo "Content-Type: text/plain; charset=UTF-8"
  echo
  echo "$BODY"
} | /usr/sbin/sendmail -t -f "$FROM"
