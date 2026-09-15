#!/bin/sh
# check.sh -- page-availability smoke test for this cPanel account.
#
# WHY THIS EXISTS: hawsedc.com served 12 pages as HTTP 500 for weeks and nobody
# noticed. A require_once pointed at a file that had moved. Fetching every page
# and reading the status code would have found all 12 on day one.
#
# WHAT IT DOES: derives the URL list from cPanel's own vhost table and from the
# files actually on disk -- never a hardcoded list, because a hardcoded list goes
# stale silently, which is the same class of bug this exists to catch. Then it
# fetches each URL and fails on:
#   * a status of 400 or worse, or no answer at all
#   * a PHP diagnostic in the BODY of an otherwise-200 page. PHP can emit a fatal
#     error halfway down a page after the 200 header has already gone out, so the
#     status code alone cannot see it. Several of the 12 did exactly that.
#
# It is SILENT when everything passes. A report that arrives every morning saying
# "all fine" trains the reader to delete it unread, and then the one that matters
# gets deleted too. Cron mails you only what a job prints, so printing nothing is
# how you get mail only when something is wrong.
#
# Exits 0 when every page passes, 1 when any page fails, 2 on a setup problem.
#
# Usage:  sh ~/check.sh              quiet; output only on failure
#         sh ~/check.sh -v           progress and a per-site summary
#         sh ~/check.sh -l           list the derived URLs and exit, fetching nothing
#         sh ~/check.sh -f hawsedc   only URLs whose host matches this string
#         sh ~/check.sh -m           also mail the failures (this is what cron uses)

PATH=/usr/local/bin:/usr/bin:/bin:$PATH
export PATH

USER_NAME=jconstru
UD=/var/cpanel/userdata/$USER_NAME          # cPanel's own vhost table
LOGFILE=$HOME/check.log
EXCLUDE=$HOME/check.exclude          # declared non-pages; see the file
STATEDIR=${TMPDIR:-/tmp}/check.$$
MAXTIME=25                                  # seconds per URL
PAUSE=0.15                                  # seconds between URLs -- see RATE below
UA='hawsedc-smoke-test/1 (+cron; tom.haws@gmail.com)'

# MAIL. Cron's own MAILTO cannot be used for this and it is worth knowing why:
# cron sends as jconstru@minter.nocdirect.com, the shared server's hostname, and
# Gmail refuses that outright --
#     550-5.7.26 Your email has been blocked because the sender is unauthenticated.
#     SPF [minter.nocdirect.com] with ip: [74.81.90.154] = did not pass
# The account's OWN domains do publish SPF covering that IP and a DKIM key, so a
# message sent with an envelope sender on one of them authenticates and is
# accepted. That is what -f below buys, and it is the whole reason this script
# posts its own mail instead of letting cron do it.
MAILTO_ADDR=tom.haws@gmail.com
MAILFROM=tom@hawsedc.com
SENDMAIL=/usr/sbin/sendmail
DOMAIL=0

VERBOSE=0; LISTONLY=0; FILTER=
while [ $# -gt 0 ]; do
  case "$1" in
    -v|--verbose) VERBOSE=1 ;;
    -m|--mail)    DOMAIL=1 ;;   # cron passes this; a hand-run should not
    -l|--list)    LISTONLY=1 ;;
    -f|--filter)  shift; FILTER=$1 ;;
    -h|--help)    sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "check.sh: unknown option $1" >&2; exit 2 ;;
  esac
  shift
done

[ -d "$UD" ] || { echo "check.sh: cannot read $UD -- cPanel layout changed?" >&2; exit 2; }
mkdir -p "$STATEDIR" || exit 2
trap 'rm -rf "$STATEDIR"' EXIT INT TERM

# ---------------------------------------------------------------------------
# 1. SKIP LIST.
#
# A directory whose name appears here is not walked, at any depth. These are
# library trees, not pages: MediaWiki's includes/ and extensions/, webtrees's
# app/ and vendor/, Composer vendor trees, test suites, caches. Fetching a class
# file directly proves nothing -- it is not a URL any visitor has.
#
# It is deliberately a NAME list rather than a path list so a new third-party app
# is covered the day it lands. The cost is that a real page directory that
# happened to be called "src" would be skipped; -l shows you the whole list, and
# the skip count is printed with -v so a sudden drop is visible.
# ---------------------------------------------------------------------------
#
# DOT-DIRECTORIES ARE SKIPPED AS A CLASS, and that replaces the three that were named one at a
# time. `\.git`, `\.svn` and `\.well-known` were listed individually, which is the same
# decided-three-times-separately shape the suite's own .htaccess had -- and it cost the same way:
# `.claude/hooks/guard-wait-loops.php` was walked, fetched, and reported HTTP 500 on 2026-09-15,
# because nobody had thought to add a fourth name. That report was USEFUL -- it is how anybody
# learned .claude/settings.json was served -- but the ONLY reason it reached a human is that the
# script happened not to skip the directory. Now that the suite blocks those paths, the same URLs
# answer 403, which is also a failure, so leaving them in the walk would alarm every single night
# about a fix working correctly. A directory whose name begins with a dot is not a page.
SKIPDIRS='vendor|node_modules|tests|test|includes|extensions|languages|maintenance|skins|templates_c|cache|caches|docs|resources|lib|libs|src|bin|app|jpgraph|dev|log|logs|tmp|temp|backup|backups|cgi-bin|wp-includes|wp-admin|data|spock|examples|icons|node|\.[^/]+|.*\.bak'

# Files that are includes, not pages. Fetching one directly can raise a fatal
# error that says nothing about whether the SITE is healthy.
SKIPFILES='.*\.lib\.php|.*\.inc\.php|.*\.class\.php|.*\.bak\..*|.*\.orig|.*\.save'

# ---------------------------------------------------------------------------
# 2. VHOST TABLE. Read documentroot and hostname out of cPanel's userdata.
#
# The public hostname is NOT the servername: cPanel names an addon domain's vhost
# "hawsedc.constructionnotesmanager.com" and the address people actually use,
# hawsedc.com, is only an alias. main's addon_domains block is the authoritative
# inverse, so we read it rather than guessing (guessing by "shortest alias" picks
# a parked domain -- notepanet.net is shorter than constructionnotesmanager.com).
# ---------------------------------------------------------------------------
ADDONMAP=$STATEDIR/addonmap
sed -n '/^addon_domains:/,/^[a-z_]*:/p' "$UD/main" \
  | sed -n 's/^  \([^ :]*\): \(.*\)$/\2 \1/p' > "$ADDONMAP"

VHOSTS=$STATEDIR/vhosts
: > "$VHOSTS"
for f in "$UD"/*; do
  [ -f "$f" ] || continue
  case "$f" in *.cache|*_SSL|*/main|*.json) continue ;; esac
  sn=$(sed -n 's/^servername: *//p'    "$f" | head -1)
  dr=$(sed -n 's/^documentroot: *//p'  "$f" | head -1)
  [ -n "$sn" ] && [ -n "$dr" ] && [ -d "$dr" ] || continue
  pub=$(awk -v s="$sn" '$1==s {print $2; exit}' "$ADDONMAP")
  [ -n "$pub" ] || pub=$sn
  echo "$dr	$pub"
done | sort -u > "$VHOSTS"

# The server answers for every one of these on its own public IP. Pinning curl to
# that IP keeps the traffic on this box and means a DNS outage cannot masquerade
# as 647 broken pages. 127.0.0.1 does NOT work here -- loopback hits a catch-all
# vhost that 404s everything.
SERVERIP=$(grep -h '^ip:' "$UD"/* 2>/dev/null | sed 's/^ip: *//' | sort -u | head -1)
[ -n "$SERVERIP" ] || { echo "check.sh: no vhost IP found in $UD" >&2; exit 2; }

# ---------------------------------------------------------------------------
# 3. ONE HOSTNAME PER DOCROOT.
#
# Several docroots are served under two names -- npsge.org's subsites are both an
# addon domain and a subdomain. Checking both would double the load to fetch
# identical bytes. Where there is a choice we keep the name that does NOT
# redirect, so the run tests pages rather than testing a redirect 200 times.
# ---------------------------------------------------------------------------
probe () {  # probe HOST -> prints status code for /
  curl -sS -o /dev/null -w '%{http_code}' --max-time "$MAXTIME" \
       --resolve "$1:443:$SERVERIP" -A "$UA" "https://$1/" 2>/dev/null
}

SITES=$STATEDIR/sites
: > "$SITES"
for dr in $(cut -f1 "$VHOSTS" | sort -u); do
  chosen=; first=
  for h in $(awk -F'\t' -v d="$dr" '$1==d {print $2}' "$VHOSTS" | sort); do
    [ -n "$first" ] || first=$h
    code=$(probe "$h")
    case "$code" in 3??) continue ;; esac
    chosen=$h; break
  done
  [ -n "$chosen" ] || chosen=$first
  echo "$dr	$chosen" >> "$SITES"
done

# ---------------------------------------------------------------------------
# 4. URL LIST. Walk each docroot for things a browser can ask for.
#
# A nested docroot belongs to its OWN site, not to its parent: files under
# npsge.org/aguafria are aguafria's, so they are excluded from npsge.org's walk
# and reached under their own hostname. Otherwise every one is checked twice.
# ---------------------------------------------------------------------------
URLS=$STATEDIR/urls
: > "$URLS"
SKIPPED=0
for dr in $(cut -f1 "$SITES"); do
  host=$(awk -F'\t' -v d="$dr" '$1==d {print $2}' "$SITES")
  # A sub-docroot's files belong to the sub-site. Build a regex of the relative
  # prefixes to drop, so npsge.org's walk does not also claim aguafria's pages.
  sub=
  for other in $(cut -f1 "$SITES"); do
    case "$other" in
      "$dr"/*) rel=$(printf '%s' "$other" | sed "s|^$dr/||")
               sub="$sub${sub:+|}$rel" ;;
    esac
  done
  all=$(find "$dr" -type f \( -name '*.php' -o -name '*.html' -o -name '*.htm' \) \
        2>/dev/null | sed "s|^$dr/||")
  keep=$(printf '%s\n' "$all" | grep -v '^$' \
        | grep -Ev "(^|/)($SKIPDIRS)/" \
        | grep -Ev "(^|/)($SKIPFILES)\$" | sort)
  [ -n "$sub" ] && keep=$(printf '%s\n' "$keep" | grep -Ev "^($sub)/")
  na=$(printf '%s\n' "$all"  | grep -c . )
  nk=$(printf '%s\n' "$keep" | grep -c . )
  SKIPPED=$((SKIPPED + na - nk))
  printf '%s\n' "$keep" | while read -r rel; do
    [ -n "$rel" ] || continue
    echo "https://$host/$rel"
  done >> "$URLS"
done

# Drop the URLs ~/check.exclude declares are not broken pages. Each line there
# carries its reason; the count is reported so the list cannot grow unnoticed.
EXCLUDED=0
if [ -s "$EXCLUDE" ]; then
  grep -Ev '^[[:space:]]*(#|$)' "$EXCLUDE" > "$STATEDIR/exre" 2>/dev/null
  if [ -s "$STATEDIR/exre" ]; then
    before=$(wc -l < "$URLS")
    grep -Evf "$STATEDIR/exre" "$URLS" > "$STATEDIR/kept"
    EXCLUDED=$(( before - $(wc -l < "$STATEDIR/kept") ))
    mv "$STATEDIR/kept" "$URLS"
  fi
fi

if [ -n "$FILTER" ]; then
  grep "$FILTER" "$URLS" > "$URLS.f" && mv "$URLS.f" "$URLS"
fi

TOTAL=$(wc -l < "$URLS" | tr -d ' ')

if [ "$LISTONLY" = 1 ]; then
  echo "# $TOTAL URLs from $(wc -l < "$SITES" | tr -d ' ') docroots; $SKIPPED skipped as non-pages; $EXCLUDED excused by check.exclude"
  cat "$URLS"
  exit 0
fi

[ "$TOTAL" -gt 0 ] || { echo "check.sh: derived ZERO urls -- the walk is broken" >&2; exit 2; }

# ---------------------------------------------------------------------------
# 5. FETCH.
#
# RATE: one request at a time with a short pause. This is a shared host and the
# account's own firewall counts connections; a few hundred parallel requests
# would look like an attack from the inside. The whole run costs a couple of
# minutes, which is nothing at 4am.
#
# PHP prints a diagnostic in a shape nothing else on these sites writes:
# a keyword, a colon, and "on line N". Matching that shape rather than the bare
# word "Warning" is what keeps ordinary page copy from reading as a failure.
# ---------------------------------------------------------------------------
PHPERR='(Fatal error|Parse error|Warning|Notice|Deprecated|Recoverable fatal error)(<\/b>)?: .*on line [0-9]+'

FAILFILE=$STATEDIR/failures
: > "$FAILFILE"
BODY=$STATEDIR/body
n=0; fails=0

while read -r url; do
  n=$((n + 1))
  hostpath=${url#https://}
  host=${hostpath%%/*}
  code=$(curl -sS -o "$BODY" -w '%{http_code}' -L --max-redirs 5 \
              --max-time "$MAXTIME" --resolve "$host:443:$SERVERIP" \
              -A "$UA" "$url" 2>/dev/null)
  [ -n "$code" ] || code=000
  why=
  case "$code" in
    000)         why="no answer (timeout or connection refused)" ;;
    401)         : ;;   # An auth challenge means Apache reached the page and the
                        # password protection is working. That is a pass, not a
                        # fault -- /lamp, /order and /tom/tghliv01 are htpasswd'd.
    [45]??)      why="HTTP $code" ;;
    *)           if LC_ALL=C grep -Eq "$PHPERR" "$BODY" 2>/dev/null; then
                   detail=$(LC_ALL=C grep -Eom1 "$PHPERR" "$BODY" \
                            | sed -e 's/<[^>]*>//g' | cut -c1-160)
                   why="HTTP $code but PHP error in body: $detail"
                 fi ;;
  esac
  if [ -n "$why" ]; then
    fails=$((fails + 1))
    printf '%s\n    %s\n' "$url" "$why" >> "$FAILFILE"
    [ "$VERBOSE" = 1 ] && echo "FAIL $code $url"
  else
    [ "$VERBOSE" = 1 ] && echo "ok   $code $url"
  fi
  sleep "$PAUSE"
done < "$URLS"

# ---------------------------------------------------------------------------
# 6. REPORT. Always a line in the log so "did it run?" has an answer; on stdout
# (and therefore in mail) only when something is wrong.
# ---------------------------------------------------------------------------
stamp=$(date '+%Y-%m-%d %H:%M:%S')
echo "$stamp	checked=$TOTAL	failed=$fails" >> "$LOGFILE" 2>/dev/null

if [ "$fails" -gt 0 ]; then
  REPORT=$STATEDIR/report
  {
    echo "$fails of $TOTAL pages FAILED  ($stamp)"
    echo
    cat "$FAILFILE"
    echo
    echo "Re-run by hand:  sh ~/check.sh -v"
    echo "One page:        sh ~/check.sh -v -f <text-in-url>"
    echo "Excuse one:      add a line, WITH ITS REASON, to ~/check.exclude"
  } > "$REPORT"
  cat "$REPORT"
  if [ "$DOMAIL" = 1 ] && [ -x "$SENDMAIL" ]; then
    {
      echo "From: hawsedc.com page check <$MAILFROM>"
      echo "To: $MAILTO_ADDR"
      echo "Subject: [site check] $fails of $TOTAL pages failing"
      echo
      cat "$REPORT"
    } | "$SENDMAIL" -t -f "$MAILFROM"
  fi
  exit 1
fi

if [ "$VERBOSE" = 1 ]; then
  echo
  echo "all $TOTAL pages passed  ($stamp)"
  echo "$SKIPPED files skipped as non-pages; $EXCLUDED URLs excused by ~/check.exclude"
fi
exit 0
