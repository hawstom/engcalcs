#!/usr/bin/env bash
#
# publish_usage_report.sh — write the usage report to spock/, and serve ONE aggregate copy.
#
#   sh dev/scripts/publish_usage_report.sh
#   sh dev/scripts/publish_usage_report.sh --days=30
#   sh dev/scripts/publish_usage_report.sh --archive=spock/2026-08-14
#   sh dev/scripts/publish_usage_report.sh --archive=2026-08-14      # an archive IS its ending date
#
# **THE SERVED COPY IS NOT REACHABLE YET.** spock/public/.htaccess has its grant commented out
# pending one explicit yes from Tom (2026-08-23): a permanently readable, unauthenticated URL of
# visitor analytics is outward-facing and cannot be recalled once the link exists. Running this
# script is harmless meanwhile — it writes the file and Apache refuses to serve it.
#
# Every argument is handed straight to log/lang-log-stats.sh, which stays the only thing that
# computes anything. This script decides WHERE the output goes and WHAT is redacted, and nothing
# else. It is built on that script's existing --out rather than being a second writer.
#
# WHAT IS PUBLISHED, AND WHY IT IS ONLY THIS. Tom offered to publish the raw logs. The content is
# close to harmless -- verified writer by writer on 2026-08-23 across all six: no REMOTE_ADDR, no
# HTTP_USER_AGENT, no session id, and nothing the visitor typed. A row is a timestamp, a page, a
# language, a source and a bucket, every visitor-supplied column filtered by ecBrowserLangTag() or
# an explicit allowlist.
#
# But PUBLISHING IS A PROMISE QUESTION, NOT A CONTENT QUESTION. privacy.php tells visitors what
# happens to this data and does not say "published on the web". Publishing per-event rows would
# change that deal even though each row is benign, and CLAUDE.md prices that change exactly: a
# consent_body rewrite, 26 retranslations, and an EC_CONSENT_VERSION bump that re-asks everybody.
# It is also irreversible -- a crawler indexes it once and it is gone. An aggregate report carries
# none of that: it is counts, it discloses nothing about any individual, and publishing it changes
# no promise. So the aggregate is published and the rows are not. Do not "simplify" this by
# pointing the published path at spock/<date>/.
#
# ONE MORE REDACTION ON TOP OF THAT. The report's WINDOW, FINGERPRINT and COVERAGE lines quote the
# first and last row's timestamp to the second, which is a per-event timestamp however weak. The
# published copy truncates every timestamp to its DATE and says so at the top, so the window is
# still comparable and the second-resolution event times do not leave the server. Its FINGERPRINT
# is tagged redacted=date, so a published copy and a private one can never be pasted into
# dev/usage-data-log.md as if they were the same run.
#
# THE PUBLISHED FILENAME IS UNGUESSABLE AND DELIBERATELY NOT IN robots.txt: a Disallow line
# publishes the very name it is meant to protect. It carries <meta name="robots" content="noindex">
# in the page, and spock/public/.htaccess adds an X-Robots-Tag header IF the host has mod_headers,
# which COULD NOT BE CONFIRMED for production. The meta tag is the guarantee; the header is a bonus.
# Changing the name breaks whatever Tom has bookmarked, so change it only on purpose.
#
# .html, not .txt, and that is not cosmetic: the root .htaccess denies \.(md|txt)$ everywhere, so a
# published .txt would 403 no matter what spock/public/.htaccess said.
set -eu

ROOT="$(dirname "$0")/../.."
PUBLISHED_NAME="usage-6189c17caf18ab3682420140e466af5d.html"

REPORTS="$ROOT/spock/reports"
PUBLIC="$ROOT/spock/public"
mkdir -p "$REPORTS" "$PUBLIC"

# The dated private copy is named after the run, not just after today, so reporting an archive
# cannot overwrite the live run's file of the same date.
STAMP="$(date -u +%Y-%m-%d)"
SLUG=""
for arg in "$@"; do
    case "$arg" in
        --archive=*) SLUG="-archive-$(basename "${arg#--archive=}")" ;;
    esac
done
DATED="$REPORTS/usage${SLUG}-${STAMP}.txt"
LATEST="$REPORTS/usage-latest${SLUG}.txt"

bash "$ROOT/log/lang-log-stats.sh" "$@" --out="$DATED" > /dev/null
cp "$DATED" "$LATEST"

# ---- the published copy ------------------------------------------------------------------------
# Redaction and escaping happen in one awk pass, so nothing can reach the HTML unescaped by taking
# a different branch. Order matters: the timestamps go first, then & < > are escaped.
TARGET="$PUBLIC/$PUBLISHED_NAME"
{
    cat <<'HTMLHEAD'
<!doctype html>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EngCalcs usage report (aggregate)</title>
<style>body{font:13px/1.4 monospace;margin:1rem;background:#fff;color:#111}
pre{white-space:pre-wrap;overflow-x:auto}
.note{font-family:sans-serif;max-width:48rem;border-left:3px solid #999;padding:0 0 0 .8rem;margin-bottom:1.5rem}</style>
<div class="note">
<p><strong>Aggregate counts only.</strong> This is the whole of what EngCalcs publishes from its
usage logs. It contains no IP address, no user agent, no session identifier, no cookie value and
nothing any visitor typed &mdash; none of those is recorded anywhere in the first place.</p>
<p><strong>Every timestamp is truncated to a date.</strong> The private report quotes the first and
last logged event to the second; that resolution is removed here, and the fingerprint below is
tagged <code>redacted=date</code> so this copy cannot be mistaken for the private one.</p>
<p>The raw rows are not published. See the privacy notice for what is collected and for how long.</p>
</div>
<pre>
HTMLHEAD
    awk '{
        gsub(/T[0-9][0-9]:[0-9][0-9]:[0-9][0-9]Z/, "")
        if ($0 ~ /^ FINGERPRINT/) { $0 = $0 " redacted=date" }
        # The SOURCE line quotes whatever directory was passed on the command line, which can be an
        # absolute server path. Nobody outside needs the filesystem layout, so it is cut to its last
        # two components -- enough to say WHICH archive, which is the whole point of the line.
        if ($0 ~ /^ SOURCE/ && match($0, /\/[^ ]+/)) {
            p = substr($0, RSTART, RLENGTH); n = split(p, a, "/")
            $0 = substr($0, 1, RSTART - 1) (n >= 2 ? a[n-1] "/" a[n] : p) substr($0, RSTART + RLENGTH)
        }
        gsub(/&/, "\\&amp;"); gsub(/</, "\\&lt;"); gsub(/>/, "\\&gt;")
        print
    }' "$DATED"
    printf '</pre>\n'
} > "$TARGET"

echo "Private (denied over HTTP):"
echo "    $DATED"
echo "    $LATEST"
echo ""
echo "Published (aggregate only, timestamps redacted to date):"
echo "    $TARGET"
echo "    /engcalcs/spock/public/$PUBLISHED_NAME"
echo ""
echo "The raw logs stay private. spock/.htaccess denies the whole tree; spock/public/.htaccess"
echo "re-grants that one directory and nothing else."
