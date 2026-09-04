<?php
/**
 * Screenshot publication check (ROADMAP Task 508). ADVISORY — never blocks a commit.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Tom's own words for the failure: a re-shoot is not published by being taken.
 * `dev/screenshots/INDEX.md` had recorded re-shoots on 2026-08-27 and 2026-08-28 that were never
 * carried across, and the plates on librewaternet.org sat at their 25 August versions for a week
 * while three separate blocks of prose in this repository described them as stale. **The gap was
 * never Tom's camera. It was that copying a file into the sibling repository is a separate act of
 * memory**, and a claim that it happened is a sentence nobody re-reads.
 *
 * WHAT IT CHECKS, and it is one thing: every INDEX row that claims a plate is PUBLISHED names an
 * md5, and that md5 must be the md5 the file in `~/webdev/librewaternet.org` actually has. The
 * claim format is fixed and is part of the row:
 *
 *     **PUBLISHED 2026-09-01** — `img/0028.png`, md5 `ac5e67fa…`, commit `10eda9e`.
 *
 * The md5 may be truncated with an ellipsis, which is how the file has always written them; a
 * prefix is compared as a prefix. Anything shorter than 8 hex digits is refused as a claim rather
 * than compared, because a four-character prefix collides by accident.
 *
 * WHY ADVISORY, AND WHY IT MUST STAY SO. The sibling repository is OUTSIDE this tree. It is absent
 * on a fresh clone, in a worktree, and on any machine that has only ever wanted the calculators, so
 * a blocking version would fail for a reason that has nothing to do with the commit in hand. When
 * it is absent this prints why and checks nothing — silence would be indistinguishable from a pass.
 *
 * IT CANNOT SEE THE OTHER HALF, and says so rather than implying otherwise: whether the published
 * plate is the frame somebody should WANT is a judgement about pixels, which is what the INDEX row
 * itself is for. This only answers whether the file that is there is the file we said we put there.
 *
 * Usage:
 *   php dev/scripts/screenshot_publish_check.php
 */

$root = dirname(__DIR__, 1);                       // dev/
$indexPath = $root . '/screenshots/INDEX.md';
$sibling = getenv('HOME') . '/webdev/librewaternet.org';

if (!is_file($indexPath)) {
	echo "No dev/screenshots/INDEX.md — nothing to check.\n";
	exit(0);
}
$text = file_get_contents($indexPath);

// One claim per match: the plate path and the md5 that row says it has. Anchored on the word
// PUBLISHED so a row DISCUSSING a plate's md5 ("the sibling repo is still the 25 August file")
// is not read as a claim that it was published.
$claims = array();
foreach (explode("\n", $text) as $lineNo => $line) {
	if (strpos($line, 'PUBLISHED') === false) { continue; }
	if (!preg_match_all('/PUBLISHED[^|]*?`(img\/[A-Za-z0-9._\/-]+)`[^|]*?md5 `([0-9a-f]+)/u', $line, $m, PREG_SET_ORDER)) {
		continue;
	}
	foreach ($m as $hit) {
		$claims[] = array('line' => $lineNo + 1, 'file' => $hit[1], 'md5' => $hit[2]);
	}
}

if (!$claims) {
	echo "No PUBLISHED plate claims in dev/screenshots/INDEX.md — nothing to check.\n";
	exit(0);
}

if (!is_dir($sibling)) {
	echo "Screenshot publication: " . count($claims) . " published plate(s) claimed, NONE checked.\n";
	echo "  The sibling repository is not at $sibling, so there is nothing to compare against.\n";
	echo "  Advisory, and this is the expected result anywhere but Tom's own machine.\n";
	exit(0);
}

$bad = array();
$short = array();
$missing = array();
$okCount = 0;
foreach ($claims as $c) {
	if (strlen($c['md5']) < 8) { $short[] = $c; continue; }
	$path = $sibling . '/' . $c['file'];
	if (!is_file($path)) { $missing[] = $c; continue; }
	$have = md5_file($path);
	if (strncmp($have, $c['md5'], strlen($c['md5'])) === 0) { $okCount++; continue; }
	$c['have'] = $have;
	$bad[] = $c;
}

echo "Screenshot publication: " . count($claims) . " published plate(s) claimed against $sibling\n";
if ($okCount) { echo "  $okCount match the file that is actually published.\n"; }
foreach ($short as $c) {
	echo "  INDEX.md:{$c['line']}  {$c['file']}: md5 `{$c['md5']}` is too short to compare (want 8+ hex digits).\n";
}
foreach ($missing as $c) {
	echo "  INDEX.md:{$c['line']}  {$c['file']}: claimed published, but no such file in the sibling repository.\n";
}
foreach ($bad as $c) {
	echo "  INDEX.md:{$c['line']}  {$c['file']}: claimed md5 `{$c['md5']}`, published file is `" . substr($c['have'], 0, 8) . "…`.\n";
	echo "      Either the plate was never swapped, or it moved on and the row did not.\n";
}
if (!$bad && !$missing && !$short) { echo "  Every published claim matches. \n"; }
echo "Advisory. It answers one question only: is the file that is published the file we said we published.\n";
exit(0);
