#!/bin/sh
# install.sh -- put this directory's scripts where the host's cron expects them.
#
# Run it FROM A CHECKOUT ON THE HOST. It is idempotent and it prints what it changed.
# The copy in the repository is canonical; ~/ is a deployment. dev/host/README.md says why.

set -u
SRC=$(cd "$(dirname "$0")" && pwd)
MIRROR=$HOME/tgh/engcalcs-mirror.git
WORK=$HOME/tgh/engcalcs-report
ORIGIN=$(git -C "$SRC/../.." remote get-url origin 2>/dev/null)

for f in check.sh check.exclude cronmail.sh daily-report-cron.sh; do
    if [ -f "$HOME/$f" ] && cmp -s "$SRC/$f" "$HOME/$f"; then
        echo "same      ~/$f"
    else
        [ -f "$HOME/$f" ] && cp "$HOME/$f" "$HOME/$f.before-install" && echo "  (kept ~/$f.before-install)"
        cp "$SRC/$f" "$HOME/$f" && chmod 700 "$HOME/$f" && echo "installed ~/$f"
    fi
done

mkdir -p "$HOME/tgh"

# THE MIRROR IS WHY THIS SCRIPT EXISTS RATHER THAN A README PARAGRAPH. It must be a separate clone:
# fetching in the production checkout can rewrite packed-refs, and the About box dates its build
# line from that file's mtime -- so a nightly fetch there would advance the displayed deploy date
# with nothing deployed. Outside the document root, so nothing serves it.
if [ -d "$MIRROR" ]; then
    echo "same      $MIRROR"
elif [ -n "$ORIGIN" ]; then
    git clone --mirror "$ORIGIN" "$MIRROR" >/dev/null 2>&1 \
        && echo "cloned    $MIRROR" || echo "FAILED to clone the mirror from $ORIGIN"
else
    echo "FAILED: no origin remote found; cannot create the mirror."
fi

if [ -d "$WORK/.git" ]; then
    echo "same      $WORK"
elif [ -d "$MIRROR" ]; then
    git clone "$MIRROR" -b master "$WORK" >/dev/null 2>&1 \
        && git -C "$WORK" remote set-url origin "$MIRROR" \
        && echo "cloned    $WORK (report runs out of here, never out of production)" \
        || echo "FAILED to clone the report checkout"
fi

echo
echo "CRON LINE, to add by hand with \`crontab -e\`:"
echo "  0 22 * * *  sh \$HOME/daily-report-cron.sh > /dev/null 2>&1"
echo ""
echo "22:00 HERE IS 20:00 IN PHOENIX, where it is read. Spelled out rather than trusted to"
echo "CRON_TZ, because whether this cron honours that variable cannot be tested without"
echo "waiting an hour for the wrong answer. This server is US Central and observes DST;"
echo "Arizona does not, so it lands at 21:00 his time from 1 November until March."
echo
echo "The 04:20 page-check line should already be there. Both are deliberately outside"
echo "MAILTO: cron's own envelope sender is jconstru@<server>, which Gmail refuses"
echo "outright, and 22,000 bounces are what that looked like from the inside."
