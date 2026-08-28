<?php
/**
 * no_session_check.php — this suite starts no PHP session, anywhere. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS, AND IT IS THE STRICTEST FORM OF THE RULE RATHER THAN THE ONE CLAUDE.md STATES.
 * The prose says *"Never call `session_start()`. Call `ecSessionStart()`, which starts one only for
 * a visitor who consented."* **`ecSessionStart()` does not exist** — Task 288 removed `PHPSESSID`
 * outright, and the helper went with it. So the rule as written sends a future contributor to a
 * function that is not there, and the honest number of sessions in this suite is not "one, gated"
 * but ZERO. That is what this checks, because that is what is true.
 *
 * WHAT A SESSION COSTS HERE. `session_start()` writes `PHPSESSID` to the visitor's device on the
 * response that runs it — before any banner has asked anything, and with no way for a banner to
 * take it back from outside. It is also a MIXED-PURPOSE cookie by construction, which is what makes
 * it unlawful under a per-purpose test: the moment one is started, whatever it is started for, it
 * carries an identifier. `dev/cookie-storage-inventory.md` records the whole argument.
 *
 * WHY IT BLOCKS. There is no reading of this repository in which starting a session is correct
 * today, and the failure is invisible from here: the page renders, nothing warns, and the only
 * evidence is a cookie on a stranger's machine. If sessions ever come back they come back with a
 * gate, a consent version bump and a rewritten banner — and with a deliberate edit to this file,
 * which is exactly the conversation that should happen first.
 *
 * IT READS CODE, NOT PROSE. `token_get_all()` means the two places `session_start()` appears in a
 * COMMENT -- both of them explaining that it used to be called and no longer is -- are invisible,
 * where a grep would report the history of the fix as a violation of it.
 *
 * Usage:
 *   php dev/scripts/no_session_check.php
 *
 * Exit 0 = no session is started. Exit 1 = one is, with the file and line.
 */

/**
 * Lines in one PHP source that CALL a session function. Pure, for the selftest.
 *
 * @param string $php Source text.
 * @return array<int,array{0:string,1:int}> [function name, line] pairs.
 */
function ecSessionCalls(string $php): array
{
    $banned = [
        'session_start' => 1, 'session_id' => 1, 'session_regenerate_id' => 1,
        'session_name' => 1, 'session_set_cookie_params' => 1,
    ];
    $tokens = @token_get_all($php);
    $out = [];
    $n = count($tokens);
    for ($i = 0; $i < $n; $i++) {
        $t = $tokens[$i];
        if (!is_array($t) || $t[0] !== T_STRING || !isset($banned[strtolower($t[1])])) {
            continue;
        }
        // A call, not a mention: the next significant token is an opening parenthesis. This is also
        // what keeps a string literal or a method named the same from counting.
        for ($j = $i + 1; $j < $n; $j++) {
            $nt = $tokens[$j];
            if (is_array($nt) && ($nt[0] === T_WHITESPACE || $nt[0] === T_COMMENT
                || $nt[0] === T_DOC_COMMENT)) {
                continue;
            }
            if ($nt === '(') { $out[] = [strtolower($t[1]), $t[2]]; }
            break;
        }
        // Not a property or a method: `$x->session_id(` is somebody else's object.
        if ($out && end($out)[1] === $t[2]) {
            for ($k = $i - 1; $k >= 0; $k--) {
                $pt = $tokens[$k];
                if (is_array($pt) && ($pt[0] === T_WHITESPACE || $pt[0] === T_COMMENT
                    || $pt[0] === T_DOC_COMMENT)) {
                    continue;
                }
                if (is_array($pt) && ($pt[0] === T_OBJECT_OPERATOR || $pt[0] === T_DOUBLE_COLON)) {
                    array_pop($out);
                }
                break;
            }
        }
    }
    return $out;
}

if (defined('NO_SESSION_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$problems = [];
$files = 0;

// Everything served. dev/ is not, and its scripts may legitimately do as they please.
$paths = array_merge(glob($root . '/*.php'), glob($root . '/lib/*.php'));
foreach ($paths as $file) {
    $files++;
    foreach (ecSessionCalls(file_get_contents($file)) as [$fn, $line]) {
        $problems[] = sprintf('%s:%d calls %s()', basename($file), $line, $fn);
    }
}

if ($problems) {
    echo 'PHP sessions: ' . count($problems) . " call(s)\n\n";
    foreach ($problems as $p) { echo "  $p\n"; }
    echo "\nThis suite starts no session. Task 288 removed PHPSESSID outright, because everything it\n";
    echo "held was \"have we already counted this\", which needs no identifier to answer. A session\n";
    echo "writes that identifier to a visitor's device on the response that starts it -- before any\n";
    echo "banner has asked, and with no way for one to take it back afterwards.\n";
    echo "\nIf sessions are coming back, that is a consent-version bump, a rewritten banner and 26\n";
    echo "retranslations. Have that conversation, then edit this check.\n";
    exit(1);
}

echo "No PHP sessions -- $files served file(s) scanned, none starts one.\n";
exit(0);
