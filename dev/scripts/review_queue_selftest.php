<?php
/**
 * review_queue_selftest.php -- a LIVE MUTATION of the review ledger's guard.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY A SELFTEST AT ALL, when the check it guards is mostly advisory: `review_queue_check.php`
 * passes by finding a well-formed file, and a scan that has gone blind -- a regex that stopped
 * matching, a fence rule that swallowed the whole document -- looks EXACTLY like a clean ledger.
 * That is the shape that has already died of success in this repository once. So this does not
 * assert against a fixture the check might agree with by accident: it BREAKS a throwaway ledger
 * nine ways and requires the real script to name each break.
 *
 * Blocking, though most of what it guards is not, for the reason above.
 */

$root = dirname(__DIR__, 1);
$check = escapeshellarg(dirname(__FILE__) . '/review_queue_check.php');
$tmp = sys_get_temp_dir() . '/rq_selftest_' . getmypid() . '.md';
$fails = 0;
$ran = 0;

$header = "# Fixture\n\n**An ID is permanent and never reused.** Next free: R-005.\n\n";
$good = "- [ ] R-001 feat/thing | open one\n"
	. "- [x] R-002 -- | done one\n"
	. "- [?] R-003 feat/thing | a question for Tom\n"
	. "- [-] R-004 -- | he declined it\n";

function run($check, $tmp, $body, $mode = '--format') {
	file_put_contents($tmp, $body);
	$cmd = 'php ' . $check . ' ' . $mode . ' --file=' . escapeshellarg($tmp) . ' 2>&1';
	exec($cmd, $out, $rc);
	return array($rc, implode("\n", $out));
}

function expect($label, $cond, &$fails, &$ran, $detail = '') {
	$ran++;
	if ($cond) { printf("  ok   %s\n", $label); return; }
	$fails++;
	printf("  FAIL %s\n", $label);
	if ($detail !== '') { echo '       ' . str_replace("\n", "\n       ", $detail) . "\n"; }
}

// 1. The clean fixture must PASS, or every mutation below passes for the wrong reason.
list($rc, $out) = run($check, $tmp, $header . $good);
expect('a well-formed ledger parses', $rc === 0, $fails, $ran, $out);
expect('it counts the four statuses', strpos($out, '1 open') !== false
	&& strpos($out, '1 done') !== false && strpos($out, '1 back to Tom') !== false
	&& strpos($out, '1 declined') !== false, $fails, $ran, $out);

// 2. A DUPLICATE ID. Two sessions on two branches hand out the same number; the later row is then
//    invisible to anybody scanning by id, which is how a comment disappears while still on disk.
list($rc, $out) = run($check, $tmp, $header . $good . "- [ ] R-001 feat/thing | a second R-001\n");
expect('a duplicate id fails', $rc !== 0 && strpos($out, 'duplicate id R-001') !== false,
	$fails, $ran, $out);

// 3. A ROW WITH NO SEPARATOR. The commonest hand-edit slip, and it reads fine to the eye.
list($rc, $out) = run($check, $tmp, $header . $good . "- [ ] R-004b no pipe here\n");
expect('a row missing the | fails', $rc !== 0 && strpos($out, 'malformed row') !== false,
	$fails, $ran, $out);

// 4. AN UNDEFINED STATUS MARKER -- `[~]`, `[o]`, an invented half-state. The four markers mean
//    something; a fifth means whatever its writer was thinking that day.
list($rc, $out) = run($check, $tmp, $header . $good . "- [~] R-004c -- | half done?\n");
expect('an invented status marker fails', $rc !== 0, $fails, $ran, $out);

// 5. A ROW WITH NO WORDS. An id and a branch and nothing he said.
list($rc, $out) = run($check, $tmp, $header . "- [ ] R-001 feat/thing | \n");
expect('an empty row fails', $rc !== 0, $fails, $ran, $out);

// 6. THE NEXT-FREE DECLARATION GONE. Without it the next session guesses, and guessing is how
//    case 2 above happens.
list($rc, $out) = run($check, $tmp, "# Fixture\n\n" . $good);
expect('a missing next-free declaration fails', $rc !== 0
	&& strpos($out, 'Next free') !== false, $fails, $ran, $out);

// 7. THE DECLARATION LEFT BEHIND -- rows written past it, which is the same collision one move
//    later.
list($rc, $out) = run($check, $tmp, $header . $good . "- [ ] R-009 -- | written past the pointer\n");
expect('a row past the declared next-free fails', $rc !== 0
	&& strpos($out, 'next-free') !== false, $fails, $ran, $out);

// 8. AN EMPTY LEDGER. This is the blinding case: a scan reading nothing must not read as a clean
//    bill of health.
list($rc, $out) = run($check, $tmp, $header);
expect('an empty ledger fails rather than passing', $rc !== 0, $fails, $ran, $out);

// 9. THE FENCE RULE, IN BOTH DIRECTIONS. The format sample inside a fence must be ignored, and a
//    fence must not swallow the real rows after it -- which would blind the check completely while
//    it went on printing a pass.
$fence = $header . "```\n- [ ] R-001 branch/name | the sample\n```\n\n" . $good;
list($rc, $out) = run($check, $tmp, $fence);
expect('the fenced format sample is not read as a row', $rc === 0, $fails, $ran, $out);
expect('rows after the fence are still read', strpos($out, '4 rows') !== false, $fails, $ran, $out);

// 10. --open FAILS WHILE ANYTHING IS OUTSTANDING. That non-zero exit is what makes check_all.sh
//     print his outstanding comments on every run; a zero would make the list silent, which is
//     the entire defect this ledger exists to fix.
list($rc, $out) = run($check, $tmp, $header . $good, '--open');
expect('--open reports while items are open', $rc !== 0 && strpos($out, 'R-001') !== false,
	$fails, $ran, $out);
expect('--open lists a question back to Tom as ASK', strpos($out, 'ASK R-003') !== false,
	$fails, $ran, $out);
list($rc, $out) = run($check, $tmp, $header . "- [x] R-001 -- | all cleared\n", '--open');
expect('--open is quiet when nothing is outstanding', $rc === 0, $fails, $ran, $out);

@unlink($tmp);
echo "\n";
if ($fails) {
	echo "review_queue_selftest: $fails of $ran assertions FAILED.\n";
	exit(1);
}
echo "review_queue_selftest: $ran assertions pass.\n";
exit(0);
