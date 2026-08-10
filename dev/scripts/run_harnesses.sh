#!/bin/sh
# Runs every dev/lpn-spike/*harness*.js plus validate*.js and fails on the first non-zero exit.
# Exists because popup-tips-harness.js was dead (MODULE_NOT_FOUND) for weeks with nobody the
# wiser -- its ~60 assertions ran zero times while every OTHER harness stayed green (ROADMAP
# Task 256). Nothing else runs these; this is the one command that does.
set -e
DIR="$(cd "$(dirname "$0")/../lpn-spike" && pwd)"
for f in "$DIR"/*harness*.js "$DIR"/validate*.js; do
	echo "=== $f ==="
	node "$f"
done
