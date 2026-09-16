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
# THE SENDER IS TWO THINGS AND ONLY ONE OF THEM IS FREE TO CHOOSE.
#
# ENVELOPE (`-f`, what SPF is checked against) must be a domain publishing SPF that covers this
# server. tom@hawsedc.com is PROVEN: a message went out by this exact path on 2026-09-15 and landed
# in the inbox, flagged important, not in spam. Do not change it for a domain nobody has tested --
# `sendmail` exited 0 during all 22,907 of the bounces this script exists because of, so an exit
# code is not evidence. Test, read the far end, then change it.
#
# HEADER From: Tom asked for `jconstru cron <jconstru@constructionnotesmanager.com>` on 2026-09-15,
# because `jconstru` is the cPanel user and that is how he thinks about this machine. **He gets the
# DISPLAY NAME he asked for and NOT that address, and the reason is measured rather than cautious.**
#
# Two test messages were sent on 2026-09-15 -- one with both envelope and header on
# constructionnotesmanager.com, one with the header there and the proven envelope -- and NEITHER
# ARRIVED AND NEITHER BOUNCED. They vanished. The account cannot read /var/log/exim_mainlog, so why
# is not knowable from here. What is knowable is that the address is unproven and that a silent
# disappearance is the exact failure this script exists because of: 22,907 bounces, every `sendmail`
# exiting 0.
#
# So the address stays on the PROVEN one, which is what check.sh has used to reach him all week and
# what carried the 04:21 alarm he actually received. The display name carries his intent, costs
# nothing and risks nothing -- a reader sees "jconstru cron" either way.
#
# TO CHANGE IT PROPERLY: send one message from the new address, confirm ARRIVAL at the far end (not
# an exit code), and only then move ENVELOPE_FROM and HEADER_FROM together so the two stay aligned.
# A header on one domain with an envelope on another fails DMARC alignment, which is one candidate
# for where the second test went.
TO=tom.haws@gmail.com
ENVELOPE_FROM=${CRONMAIL_ENVELOPE:-tom@hawsedc.com}
HEADER_FROM=${CRONMAIL_FROM:-"jconstru cron <$ENVELOPE_FROM>"}
SUBJECT=${1:-"cron output"}
BODY=$(cat)
[ -z "$BODY" ] && exit 0
{
  echo "From: $HEADER_FROM"
  echo "To: $TO"
  echo "Subject: $SUBJECT"
  echo "Content-Type: text/plain; charset=UTF-8"
  echo
  echo "$BODY"
} | /usr/sbin/sendmail -t -f "$ENVELOPE_FROM"
