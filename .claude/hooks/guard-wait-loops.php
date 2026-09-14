<?php
/**
 * PreToolUse hook: refuse a background wait loop that can never finish.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. On 2026-09-13 a session left eight background shells polling for work that had
 * already completed. Ten hours later they were still sleeping, and Claude Code would not exit,
 * because a live shell counts as live work. Tom, 2026-09-14: "Claude Code doesn't want to exit. It
 * tells me things are running. And there are 8 shells, whatever that means." He should not have to
 * know what it means.
 *
 * THIS COULD NOT HAVE BEEN A dev/scripts CHECK, and that is the only reason it lives in .claude/.
 * The defect never reaches the repository -- it is a command an AI session types at runtime and
 * throws away. Nothing that reads committed files can ever see it. A PreToolUse hook is the one
 * place the command is visible before it runs, which is what makes this enforceable at all rather
 * than another sentence in CLAUDE.md that everybody reads and nobody applies.
 *
 * TWO SHAPES, both measured on the eight:
 *
 *   A. SELF-MATCHING pgrep (three of the eight). `until ! pgrep -f "run_harnesses.sh"; do sleep 20;
 *      done` cannot exit: the shell running the loop has "run_harnesses.sh" in its OWN command
 *      line, so pgrep finds itself and reports the job still alive. The test here is exact rather
 *      than a guess -- run the pattern as a regex against the command text, and if it matches, the
 *      loop will match itself. Bracketing the first character ([r]un_harnesses) matches the same
 *      processes and not this one, so a correctly written poll passes untouched.
 *
 *   B. AN UNBOUNDED BACKGROUND WAIT (the other five). `until grep -q "^EXIT=" out; do sleep 15;
 *      done` cannot exit if the watched job was KILLED, because nothing then writes the marker.
 *      Those five waited on files reading "[exited with code 144]".
 *
 * SCOPE IS DELIBERATELY NARROW, because a guard that cries wolf is a guard somebody switches off.
 * Shape B is judged ONLY on a backgrounded command: a foreground loop is visible, interruptible,
 * and cannot strand the session. Shape A is judged in loop context only: a one-shot `pgrep -f` also
 * matches itself, but it answers in a second and blocking it would be noise.
 *
 * Deny, never silently rewrite. The session is told which shape it hit and what to write instead.
 */

$raw = stream_get_contents(STDIN);
if ($raw === false || $raw === '') { exit(0); }
$in = json_decode($raw, true);
if (!is_array($in)) { exit(0); }

// Only Bash. Anything else is none of this hook's business.
$tool = isset($in['tool_name']) ? $in['tool_name'] : '';
if ($tool !== 'Bash') { exit(0); }

$ti = isset($in['tool_input']) && is_array($in['tool_input']) ? $in['tool_input'] : array();
$cmd = isset($ti['command']) ? (string)$ti['command'] : '';
if ($cmd === '') { exit(0); }
$bg = !empty($ti['run_in_background']);

/**
 * The correct waiter is exempt by name. It contains both shapes on purpose -- a bracketed pgrep and
 * a sleep loop -- because implementing a safe wait is exactly what it does.
 */
if (strpos($cmd, 'wait_for.sh') !== false) { exit(0); }

/** Does this command contain a shell loop at all? */
function ec_has_loop($cmd) {
    return (bool)preg_match('/(^|[\s;&|(])(until|while)\s/', $cmd)
        && (bool)preg_match('/(^|[\s;&|(])do(ne)?($|[\s;&|)])/', $cmd);
}

/** Every `-f` pattern handed to pgrep/pkill, quoted or bare. */
function ec_pgrep_patterns($cmd) {
    $out = array();
    // -f may be bundled (-af, -cf) and may precede the pattern by other flags.
    if (preg_match_all('/\bp(?:grep|kill)\b((?:\s+-[A-Za-z]+)*)\s+(?:(["\'])(.*?)\2|([^\s;|&)]+))/s',
                       $cmd, $m, PREG_SET_ORDER)) {
        foreach ($m as $hit) {
            $flags = $hit[1];
            if (strpos($flags, 'f') === false) { continue; }   // -f is what makes it read cmdlines
            $pat = ($hit[3] !== '') ? $hit[3] : (isset($hit[4]) ? $hit[4] : '');
            if ($pat !== '') { $out[] = $pat; }
        }
    }
    return $out;
}

/**
 * Is the loop bounded? Any of these is enough, and the list is deliberately generous: the cost of
 * accepting somebody's unusual-but-real deadline is nothing, and the cost of rejecting it is a
 * session fighting its own tooling.
 */
function ec_is_bounded($cmd) {
    $bounds = array(
        '/\btimeout\s+\d/',            // timeout 600 ...
        '/\bSECONDS\b/',               // bash's own elapsed counter
        '/date\s+\+%s/',               // deadline arithmetic
        '/\$\(\(\s*\w+\s*\+\s*1\s*\)\)/', // a counter being incremented
        '/\b\w+\+\+/',                 // ((i++))
        '/-lt\s+\d+/', '/-le\s+\d+/', '/-gt\s+\d+/', '/-ge\s+\d+/', // a cap being compared
    );
    // NOT a bound, and it was listed here for one draft: `head -N`. It limits how many LINES get
    // printed after the loop ends, and says nothing about when the loop ends. Counting it let the
    // eighth real stranded shell through this guard, and the selftest caught it.
    foreach ($bounds as $re) { if (preg_match($re, $cmd)) { return true; } }
    return false;
}

$deny = '';

// ---- Shape A: a poll that will find itself ------------------------------------------------
if (ec_has_loop($cmd)) {
    foreach (ec_pgrep_patterns($cmd) as $pat) {
        // Run the pattern as the regex pgrep -f would use, against this very command text.
        $re = '/' . str_replace('/', '\/', $pat) . '/';
        $hit = @preg_match($re, $cmd);
        if ($hit === 1) {
            $first = substr($pat, 0, 1);
            $fix = (preg_match('/[A-Za-z0-9_]/', $first))
                 ? '[' . $first . ']' . substr($pat, 1)
                 : '(bracket a literal character in the pattern)';
            $deny .= "SELF-MATCHING POLL. This loop waits for `$pat` to stop running, but the shell "
                  .  "running the loop has that text in its own command line, so pgrep will find "
                  .  "ITSELF and the loop can never exit. Three background shells were stranded "
                  .  "this way on 2026-09-13 and were still sleeping ten hours later.\n\n"
                  .  "Fix: bracket the first character so the pattern no longer matches this "
                  .  "command's own text -- `$fix` matches the same processes and not this one.\n\n"
                  .  "Or use the bounded waiter, which does it for you:\n"
                  .  "  sh dev/scripts/wait_for.sh --timeout 600 --no-process '$pat'\n";
            break;
        }
    }
}

// ---- Shape B: a background wait with no deadline -------------------------------------------
if ($deny === '' && $bg && ec_has_loop($cmd)
    && preg_match('/\bsleep\s+[\d.]/', $cmd) && !ec_is_bounded($cmd)) {
    $deny = "UNBOUNDED BACKGROUND WAIT. This loop sleeps until a condition is met and has no "
          . "deadline, so if the watched job is killed the condition never arrives and this shell "
          . "sleeps forever. Five shells were stranded exactly this way on 2026-09-13, polling for "
          . "an `EXIT=` marker in files that read `[exited with code 144]`; the marker was never "
          . "coming. A stranded shell also stops Claude Code from exiting, which is how Tom finds "
          . "out about it.\n\n"
          . "Fix: use the bounded waiter --\n"
          . "  sh dev/scripts/wait_for.sh --timeout 600 --sentinel '^EXIT=' FILE\n"
          . "  sh dev/scripts/wait_for.sh --timeout 600 --nonempty FILE\n\n"
          . "It gives up loudly instead of leaking, and it already knows that a job which died "
          . "without writing its marker is finished. If you genuinely need a bare loop, give it a "
          . "deadline (`timeout`, a `SECONDS` check, or a counter with a cap).";
}

if ($deny !== '') {
    echo json_encode(array('hookSpecificOutput' => array(
        'hookEventName'          => 'PreToolUse',
        'permissionDecision'     => 'deny',
        'permissionDecisionReason' => $deny,
    ))), "\n";
    exit(0);
}
exit(0);
