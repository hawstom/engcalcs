<?php
/**
 * Selftest for .claude/hooks/guard-wait-loops.php.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * BLOCKING, and the reason is the one this repository has already paid for twice: a guard that only
 * speaks when it refuses is indistinguishable, when it has silently stopped working, from a guard
 * nobody has tripped. `dev/hooks/pre-merge-commit` was DEAD for a day in exactly that way on
 * 2026-09-12. This hook is worse placed than that one -- it lives in .claude/, which no other check
 * reads -- so nothing but this file stands between it and a silent zero.
 *
 * THE FIXTURES ARE THE REAL EIGHT. Every MUST-DENY case below is a verbatim condition from one of
 * the eight shells stranded on 2026-09-13, not an invented shape. The MUST-ALLOW cases are the
 * false positives that would make somebody switch the guard off, and they matter as much: a guard
 * that blocks ordinary work is a guard with a short life.
 *
 * Mutation-tested: neutering either detector fails this file (see --mutate).
 */

$root = dirname(dirname(__DIR__));
$hook = $root . '/.claude/hooks/guard-wait-loops.php';

if (!is_file($hook)) {
    fwrite(STDERR, "FAIL: the guard is missing entirely: $hook\n");
    fwrite(STDERR, "Without it a background wait loop can strand a shell and stop Claude Code exiting.\n");
    exit(1);
}

/** Run the hook the way Claude Code runs it, and say whether it denied. */
function ec_hook_denies($hook, $command, $background) {
    $payload = json_encode(array(
        'tool_name'  => 'Bash',
        'tool_input' => array('command' => $command, 'run_in_background' => (bool)$background),
    ));
    $desc = array(0 => array('pipe', 'r'), 1 => array('pipe', 'w'), 2 => array('pipe', 'w'));
    $p = proc_open('php ' . escapeshellarg($hook), $desc, $pipes);
    if (!is_resource($p)) { return array(false, 'could not run the hook'); }
    fwrite($pipes[0], $payload); fclose($pipes[0]);
    $out = stream_get_contents($pipes[1]); fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($p);
    $j = json_decode($out, true);
    $denied = is_array($j)
        && isset($j['hookSpecificOutput']['permissionDecision'])
        && $j['hookSpecificOutput']['permissionDecision'] === 'deny';
    $why = $denied ? $j['hookSpecificOutput']['permissionDecisionReason'] : '';
    return array($denied, $why);
}

// ---- MUST DENY: the eight, as they were actually written -----------------------------------
$deny = array(
  // THE ONLY FIXTURE SHAPE A CAN FAIL ALONE, and it is here because mutation testing caught its
  // absence: every self-matching shell among the real eight was ALSO unbounded, so shape B denied
  // all three and neutering shape A still passed this file. A detector with no fixture of its own
  // is a detector that can die in silence. This one is bounded, so only the self-match test sees it.
  'self-match that is otherwise bounded' => array(
    'i=0; until ! pgrep -f "run_harnesses.sh" || [ $i -gt 60 ]; do sleep 20; i=$((i + 1)); done', true),
  'self-match: run_harnesses (PID 215566)' => array(
    'until ! pgrep -f "worktrees/650-pan-regression.*run_harnesses" >/dev/null && ! pgrep -f "run_harnesses.sh" >/dev/null; do sleep 20; done; cat out', true),
  'self-match: run_harnesses (PID 199339)' => array(
    'until [ -s /tmp/x.output ] && ! pgrep -f "run_harnesses.sh" >/dev/null; do sleep 20; done; cat /tmp/x.output', true),
  'self-match: reaction-rate (PID 215854)' => array(
    'until ! pgrep -f "652-reaction-rate/engcalcs && sh dev/scripts/run_harnesses" >/dev/null 2>&1 && [ -s /tmp/y.output ]; do sleep 15; done; echo done', true),
  'unbounded sentinel (PID 172122)' => array(
    'until grep -q "^EXIT=" /tmp/a.output 2>/dev/null; do sleep 30; done; echo FINISHED', true),
  'unbounded sentinel (PID 150668)' => array(
    'until grep -q "^EXIT=" /tmp/b.output 2>/dev/null; do sleep 15; done; echo DONE', true),
  'unbounded sentinel (PID 145167)' => array(
    'until grep -q "^EXIT=" /tmp/c.output 2>/dev/null; do sleep 15; done; grep -E "FAIL|EXIT=" /tmp/ca.txt', true),
  'unbounded sentinel (PID 152384)' => array(
    'until grep -q "^EXIT=" /tmp/d.output 2>/dev/null; do sleep 20; done; sed -n \'148,230p\' /tmp/ca.txt', true),
  'bracketed but still unbounded' => array(
    'until ! pgrep -f "[r]un_harnesses.sh"; do sleep 20; done; echo ok', true),
  'unbounded condition (PID 266486)' => array(
    'f=/tmp/e.output; until [ -s "$f" ] && grep -qE "All blocking checks pass|BLOCKING FAILURES" "$f"; do sleep 15; done; head -4 "$f"', true),
);

// ---- MUST ALLOW: ordinary work the guard must never touch ----------------------------------
$allow = array(
  'the bounded waiter itself' => array(
    "sh dev/scripts/wait_for.sh --timeout 600 --no-process 'run_harnesses.sh'", true),
  'a bracketed poll WITH a deadline' => array(
    'i=0; until ! pgrep -f "[r]un_harnesses.sh" || [ $i -gt 60 ]; do sleep 20; i=$((i + 1)); done', true),
  'a loop with an explicit timeout' => array(
    'timeout 300 sh -c \'until grep -q DONE /tmp/f; do sleep 5; done\'', true),
  'a loop with a counter cap' => array(
    'i=0; until grep -q DONE /tmp/f || [ $i -gt 60 ]; do sleep 5; i=$((i + 1)); done', true),
  'an unbounded loop in the FOREGROUND' => array(
    'until grep -q "^EXIT=" /tmp/g.output; do sleep 5; done', false),
  'the check suite itself' => array('sh dev/scripts/check_all.sh', true),
  'a plain harness run' => array('sh dev/scripts/run_harnesses.sh', true),
  'a one-shot pgrep with no loop' => array('pgrep -af run_harnesses.sh', false),
  'an ordinary git command' => array('git log --oneline origin/master..master', false),
  'a grep that mentions sleep' => array("grep -rn 'sleep' dev/scripts/ | head -20", false),
);

$fail = 0; $n = 0;
foreach ($deny as $label => $c) {
    $n++;
    list($denied, $why) = ec_hook_denies($hook, $c[0], $c[1]);
    if (!$denied) {
        $fail++;
        fwrite(STDERR, "FAIL: the guard ALLOWED a command that stranded a real shell: $label\n");
        fwrite(STDERR, "      $c[0]\n");
    }
}
foreach ($allow as $label => $c) {
    $n++;
    list($denied, $why) = ec_hook_denies($hook, $c[0], $c[1]);
    if ($denied) {
        $fail++;
        fwrite(STDERR, "FAIL: the guard DENIED ordinary work: $label\n");
        fwrite(STDERR, "      $c[0]\n");
        fwrite(STDERR, "      It said: " . substr(str_replace("\n", ' ', $why), 0, 160) . "\n");
    }
}

// The waiter must exist and be bounded -- the guard points every denial at it, so a guard whose
// advice names a missing file is a guard that only obstructs.
$waiter = $root . '/dev/scripts/wait_for.sh';
$n++;
if (!is_file($waiter)) {
    $fail++;
    fwrite(STDERR, "FAIL: the guard's advice names dev/scripts/wait_for.sh, which does not exist.\n");
} elseif (strpos(file_get_contents($waiter), 'TIMED OUT') === false) {
    $fail++;
    fwrite(STDERR, "FAIL: dev/scripts/wait_for.sh no longer reports a timeout; it may have become unbounded.\n");
}

if ($fail > 0) {
    fwrite(STDERR, "\n$fail of $n wait-guard assertions failed.\n");
    exit(1);
}
echo "wait guard OK: $n assertions (8 real stranded shells denied, " . count($allow) . " ordinary commands allowed).\n";
exit(0);
