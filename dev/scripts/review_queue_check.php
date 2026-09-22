<?php
/**
 * review_queue_check.php -- TOM'S BROWSER-PASS COMMENTS MUST NOT GO QUIET.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Tom, 2026-09-19: *"Always ensure that my review comments are not lost until they
 * are cleared/addressed. These reviews, while they are enjoyable, nay, even fun, cost me a lot of
 * time and focus."*
 *
 * A browser pass is the one input to this project that nothing here can produce and nobody else can
 * give. It is also the input most easily lost, because of its SHAPE: it arrives as prose in a single
 * message, a session acts on some of it, and the remainder exists only in that session's context --
 * which ends. Nothing in this tree had ever held one. The measured cost is his own words three times
 * over about a different list: *"I already ruled on many of these. You are losing my rulings."*
 *
 * WHAT IT HOLDS, and the split is deliberate:
 *   --format  BLOCKING. The ledger parses, every id is unique, the declared next-free id is really
 *             free, and no row uses a status marker nobody defined. A malformed row is the one
 *             failure a machine can decide, and it is exactly the failure that makes a row invisible
 *             to every later reader.
 *   --open    ADVISORY, and it FAILS WHILE ANYTHING IS OPEN ON PURPOSE, so `check_all.sh` prints the
 *             outstanding rows as a NOTE on every single run. That printing IS the feature. An
 *             advisory whose findings never reach the reader is not an advisory -- the same lesson
 *             `detect_english_drift.php`'s own line in check_all.sh records.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: decide anything. Whether an item is addressed, deferred or
 * wrong is judgement, and `[-]` DECLINED is Tom's marker alone. A script that could close his items
 * would be a script that could lose them.
 */

$root = dirname(__DIR__, 1);
$file = $root . '/tom-review-queue.md';
$mode = '--format';
// The fixture door. A selftest cannot mutate the real ledger -- it holds Tom's own words -- so it
// hands this script a throwaway copy instead, and the script under test is then the REAL one.
foreach (array_slice($argv, 1) as $arg) {
	if (strpos($arg, '--file=') === 0) { $file = substr($arg, 7); }
	else { $mode = $arg; }
}

if (!is_file($file)) {
	fwrite(STDERR, "review_queue_check: dev/tom-review-queue.md is MISSING.\n"
		. "That file is where Tom's browser-pass comments live between sessions. Without it they\n"
		. "live only in one session's context, which is the loss this check exists to prevent.\n");
	exit(1);
}

$lines = file($file, FILE_IGNORE_NEW_LINES);
$markers = array('[ ]' => 'open', '[x]' => 'done', '[?]' => 'answered-back', '[-]' => 'declined');

$rows = array();
$errors = array();
$declaredNext = null;
$fenced = false;

foreach ($lines as $n => $line) {
	$ln = $n + 1;
	// A fenced block is the FORMAT SAMPLE, not a row. It is skipped by fence rather than by
	// recognising its text, because a sample that drifts from the real format is the one thing
	// worse than no sample -- and the sample deliberately spells a real-looking id.
	if (strpos($line, '```') === 0) { $fenced = !$fenced; continue; }
	if ($fenced) { continue; }
	if (preg_match('/\*\*An ID is permanent and never reused\.\*\* Next free: R-(\d+)\./', $line, $m)) {
		$declaredNext = (int)$m[1];
		continue;
	}
	// A ledger row starts at column 0 with "- [" -- anything indented is prose about a row.
	if (strpos($line, '- [') !== 0) { continue; }
	if (!preg_match('/^- (\[[ x?\-]\]) (R-\d{3}) (\S+) \| (.+)$/', $line, $m)) {
		$errors[] = "line $ln: malformed row -- expected `- [ ] R-NNN branch-or-dash | his words`\n"
			. "         got: " . trim($line);
		continue;
	}
	list(, $marker, $id, $branch, $text) = $m;
	if (!isset($markers[$marker])) {
		$errors[] = "line $ln: unknown status marker $marker on $id";
		continue;
	}
	if (isset($rows[$id])) {
		$errors[] = "line $ln: duplicate id $id (first seen line {$rows[$id]['line']}). "
			. "An ID is permanent and never reused.";
		continue;
	}
	if (trim($text) === '') {
		$errors[] = "line $ln: $id has no text. A row with no words is a lost comment.";
		continue;
	}
	$rows[$id] = array(
		'line' => $ln, 'status' => $markers[$marker], 'branch' => $branch, 'text' => $text,
	);
}

if (!$rows) {
	$errors[] = 'the ledger holds NO rows at all. An empty scan must fail rather than read as '
		. 'progress -- that is how a blinded check looks exactly like a clean one.';
}

if ($declaredNext === null) {
	$errors[] = 'no "Next free: R-NNN." declaration found. Without it two sessions writing rows on '
		. 'two branches hand out the same id.';
} else {
	foreach ($rows as $id => $r) {
		if ((int)substr($id, 2) >= $declaredNext) {
			$errors[] = "line {$r['line']}: $id is at or past the declared next-free "
				. sprintf('R-%03d', $declaredNext) . '. Advance the declaration.';
		}
	}
}

if ($mode === '--format') {
	if ($errors) {
		fwrite(STDERR, "review_queue_check: dev/tom-review-queue.md does not parse.\n\n");
		foreach ($errors as $e) { fwrite(STDERR, "  $e\n"); }
		fwrite(STDERR, "\nA row a reader's eye skips is a comment of Tom's that has been lost.\n");
		exit(1);
	}
	$by = array_count_values(array_column($rows, 'status'));
	printf("review queue parses: %d rows (%d open, %d done, %d back to Tom, %d declined)\n",
		count($rows), $by['open'] ?? 0, $by['done'] ?? 0,
		$by['answered-back'] ?? 0, $by['declined'] ?? 0);
	exit(0);
}

if ($mode === '--open') {
	if ($errors) {
		fwrite(STDERR, "review queue does not parse; run --format for the detail.\n");
		exit(1);
	}
	$open = array_filter($rows, function ($r) {
		return $r['status'] === 'open' || $r['status'] === 'answered-back';
	});
	if (!$open) {
		echo "review queue: nothing outstanding.\n";
		exit(0);
	}
	echo count($open) . " of Tom's review comments are still outstanding:\n\n";
	$width = 0;
	foreach ($open as $r) { $width = max($width, strlen($r['branch'])); }
	foreach ($open as $id => $r) {
		$mark = $r['status'] === 'answered-back' ? 'ASK ' : '    ';
		$t = $r['text'];
		if (strlen($t) > 88) { $t = substr($t, 0, 85) . '...'; }
		printf("  %s%s  %-{$width}s  %s\n", $mark, $id, $r['branch'], $t);
	}
	echo "\nCleared one? Mark it in dev/tom-review-queue.md. ASK rows need Tom, not a fix.\n";
	exit(1);
}

fwrite(STDERR, "usage: php dev/scripts/review_queue_check.php [--format|--open]\n");
exit(2);
