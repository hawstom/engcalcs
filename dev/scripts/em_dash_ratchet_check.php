<?php
/**
 * THE EM DASH MAY FALL AND MAY NOT RISE, IN WHAT THE PUBLIC READS.
 *
 * Tom, 2026-09-01: *"we do need an advisory against the lovely em dash; the public has turned
 * against it in the age of AI. That bias is thrust upon us."* And, drawing the line: *"I don't mind
 * the lovely em dash. We just need to keep it swept away from the public's view until further
 * notice. Use it all you want in private. It's lovely."*
 *
 * SO THIS IS NOT A BAN AND NOT A STYLE OPINION. The dash is fine; the reader is not. It has become a
 * machine-written tell, so a page that leans on it reads as generated whatever it says. Code
 * comments, dev/*.md, roadmap blocks and commit messages are deliberately OUT of scope -- this
 * repository is full of them on purpose and that is not a defect.
 *
 * WHY A RATCHET RATHER THAN A RULE. Measured when the advisory was restored: 69 em dashes across 60
 * shipped English strings. Rewriting them would mark all 60 CHANGED and buy 60 x 26 = 1,560
 * retranslations of text whose MEANING did not move -- a large bill for punctuation, and one nobody
 * has decided to pay. A ratchet costs nothing today and still stops the number growing: write a new
 * string without one, and drop one from any string you are editing anyway.
 *
 * WHEN YOU FIX SOME, LOWER THE BASELINE. It is a constant here and not a file this script rewrites,
 * deliberately: a check that moves its own goalposts records nothing. The failure text says so.
 *
 * WHAT IS OUT OF SCOPE AND WHY, because the distinction is the interesting part. A dash SEPARATING
 * two names is not a prose dash and carries none of the tell -- `Manning Pipe Flow — EngCalcs` in a
 * <title>, `en — English` in the language switcher. Those are typographic separators in a slot, and
 * they are not what a reader recognises as machine writing. The scan is therefore over $ec_lang
 * PROSE VALUES, which is where sentences live.
 *
 * Usage:
 *   php dev/scripts/em_dash_ratchet_check.php            # blocking: the count may not rise
 *   php dev/scripts/em_dash_ratchet_check.php --list      # name the strings that carry one
 *
 * Exit 0 = at or below the baseline. Exit 1 = the number went up.
 */

require_once __DIR__ . '/lang_parse.inc.php';

/**
 * The measured count on 2026-09-01, the day the advisory was restored. LOWER THIS when strings are
 * fixed; never raise it. Raising it is the one edit that makes this script pointless.
 */
const EC_EM_DASH_BASELINE = 69;

const EC_EM_DASH = "\u{2014}";

$root = dirname(__DIR__, 2);
$en = ecLangValues(file_get_contents($root . '/lib/lang.ec.en.php'));

$total = 0;
$carriers = [];
foreach ($en as $key => $value) {
    $n = substr_count($value, EC_EM_DASH);
    if ($n > 0) { $total += $n; $carriers[$key] = $n; }
}

if (in_array('--list', $argv, true)) {
    echo "Em dashes in shipped English \$ec_lang values: $total across " . count($carriers) . " string(s)\n\n";
    arsort($carriers);
    foreach ($carriers as $key => $n) {
        echo '  ' . str_pad((string)$n, 3, ' ', STR_PAD_LEFT) . "  \$ec_lang['$key']\n";
    }
    echo "\nScope note: a dash SEPARATING two names (a <title>, the language switcher) is not a prose\n";
    echo "dash and is deliberately not counted. See this script's docblock.\n";
    exit(0);
}

if ($total > EC_EM_DASH_BASELINE) {
    $up = $total - EC_EM_DASH_BASELINE;
    echo "Em dash ratchet: $total in shipped English strings, $up MORE than the baseline of "
        . EC_EM_DASH_BASELINE . "\n\n";
    echo "Tom, 2026-09-01: \"We just need to keep it swept away from the public's view until further\n";
    echo "notice.\" The dash is fine and this repository is full of them; what is not fine is one in\n";
    echo "a sentence a visitor reads, because it has become a machine-written tell.\n\n";
    echo "A semicolon or a comma usually does the job. To see which strings carry them:\n";
    echo "    php dev/scripts/em_dash_ratchet_check.php --list\n\n";
    echo "Code comments, dev/*.md and commit messages are OUT of scope -- use it there freely.\n";
    echo "If you have FIXED strings and the number is genuinely lower, lower EC_EM_DASH_BASELINE in\n";
    echo "this script to the new number. Never raise it.\n";
    exit(1);
}

$slack = EC_EM_DASH_BASELINE - $total;
echo "Em dash ratchet OK -- $total in shipped English strings, baseline " . EC_EM_DASH_BASELINE
    . ($slack > 0 ? "; $slack below it, so lower the baseline" : '') . ".\n";
