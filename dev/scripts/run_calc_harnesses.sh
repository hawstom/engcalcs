#!/bin/sh
# Runs every dev/calc-spike/*harness*.js and fails on the first non-zero exit.
#
# The non-lpn twin of run_harnesses.sh (ROADMAP Task 292). Same reason for existing: a harness
# nothing runs is indistinguishable from a harness that does not exist -- popup-tips-harness.js
# was dead for weeks with nobody the wiser (Task 256), which is why the lpn suite got a runner and
# why this one has had a runner since its first file.
#
# These are SLOWER than the lpn harnesses (each loadCalculator() renders a real page through PHP),
# so the whole set is a few seconds rather than a few hundred milliseconds. Still free, still
# faster than opening one page in a browser.
set -e
DIR="$(cd "$(dirname "$0")/../calc-spike" && pwd)"
for f in "$DIR"/*harness*.js; do
	echo "=== $f ==="
	node "$f"
done
