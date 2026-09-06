<?php
/**
 * js_fallback_string_check.php still SEES a fallback, and still turns away what only looks like one.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN HALF THE CHECK IT GUARDS IS A RATCHET. A ratchet that has gone blind
 * looks exactly like a ratchet that is holding: both print a number at or under the baseline, and
 * the blind one prints a SMALLER number, which reads as progress. Narrow the receiver regex by one
 * character and this check would report "0 of 0 drifted, 199 below it, so lower the baseline" and
 * exit 0 forever. So the fixtures are the whole guarantee, and the load-bearing ones are the
 * negative cases -- anybody can make a scanner find things.
 *
 * The extraction is pure (ecJsFallbacks), so every fixture is a string, and the one thing that is
 * NOT pure -- the corpus count -- is asserted separately at the bottom against the real tree.
 */

define('EC_JS_FALLBACK_LIB_ONLY', 1);
require_once __DIR__ . '/js_fallback_string_check.php';

$fails = [];
$n = 0;

/**
 * @param string $js       fixture source
 * @param array  $reads    keys pageconfig_check.php would report for this source
 * @param array  $expect   list of [key, literal] expected, in order
 */
function ecFbCase(string $name, string $js, array $reads, array $expect): void
{
    global $fails, $n;
    $n++;
    $got = ecJsFallbacks($js, array_flip($reads));
    $flat = array_map(static function ($f) { return [$f['key'], $f['literal']]; }, $got);
    if ($flat !== $expect) {
        $fails[] = sprintf("%s\n      expected %s\n      got      %s",
            $name, json_encode($expect), json_encode($flat));
    }
}

// ---- 1. The ordinary shapes it must FIND -------------------------------------------------------
ecFbCase('literal pageConfig receiver',
    "var t = EngCalcs.pageConfig.lpn_time_run || 'Run';",
    ['lpn_time_run'], [['lpn_time_run', 'Run']]);

ecFbCase('alias receiver, the shape looped-network.js uses everywhere',
    "var pc = EngCalcs.pageConfig || {};\nvar t = pc.lpn_time_run || 'Run';",
    ['lpn_time_run'], [['lpn_time_run', 'Run']]);

ecFbCase('double-quoted literal',
    "var pc = EngCalcs.pageConfig;\nvar t = pc.mpf_flow || \"Flow\";",
    ['mpf_flow'], [['mpf_flow', 'Flow']]);

ecFbCase('EMPTY-STRING fallback is a fallback -- two of the real ones are exactly this',
    "var pc = EngCalcs.pageConfig;\nvar t = pc.lpn_engine_manning_note || '';",
    ['lpn_engine_manning_note'], [['lpn_engine_manning_note', '']]);

ecFbCase('escapes are resolved, or every apostrophe in the language file reads as drift',
    "var pc = EngCalcs.pageConfig;\nvar t = pc.mpf_flow || 'Haws\\'a';",
    ['mpf_flow'], [['mpf_flow', "Haws'a"]]);

ecFbCase('a literal containing || does not end the match early',
    "var pc = EngCalcs.pageConfig;\nvar t = pc.mpf_flow || 'a || b';",
    ['mpf_flow'], [['mpf_flow', 'a || b']]);

ecFbCase('several on one line, both found',
    "var pc = EngCalcs.pageConfig;\nf(pc.mpf_flow || 'Flow', pc.mpf_velocity || 'Velocity');",
    ['mpf_flow', 'mpf_velocity'], [['mpf_flow', 'Flow'], ['mpf_velocity', 'Velocity']]);

// ---- 2. What it must TURN AWAY -- the load-bearing half -----------------------------------------
ecFbCase('a receiver that is not a pageConfig alias (the lpn-search.js/lpn-terrain.js false hit)',
    "var hit = results[0];\nvar t = hit.place_name || 'unknown';",
    ['place_name'], []);

ecFbCase('an alias name that happens to match, but the key is not a bridge read',
    "var pc = EngCalcs.pageConfig;\nvar t = pc.some_prop || 'x';",
    [], []);

// pageconfig_check.php's own first draft took `el.textContent = EngCalcs.pageConfig.x` for an alias
// named `textContent`. If that discriminator were ever loosened, `textContent` would become a
// receiver here too and every `.<lang_key> || '...'` on an unrelated object would be reported.
ecFbCase('a READ of one key is not an alias declaration',
    "el.textContent = EngCalcs.pageConfig.mpf_flow;\nvar t = textContent.mpf_flow || 'Flow';",
    ['mpf_flow'], []);

ecFbCase('a bridge read with NO fallback is not a fallback',
    "var pc = EngCalcs.pageConfig;\nvar t = pc.mpf_flow;",
    ['mpf_flow'], []);

ecFbCase('a fallback that is an expression rather than a literal is out of reach, not a finding',
    "var pc = EngCalcs.pageConfig;\nvar t = pc.mpf_flow || other.thing;",
    ['mpf_flow'], []);

ecFbCase('a key with no underscore is not a lang key (pageConfig.length, pc.x)',
    "var pc = EngCalcs.pageConfig;\nvar n = pc.length || 'none';",
    ['length'], []);

// ---- 3. The corpus itself, so a silently-narrowed scan cannot pass ------------------------------
// A ratchet that finds nothing prints a number BELOW its baseline and reads as progress. These two
// assertions are the only thing standing between that and a green run forever.
$out = [];
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/js_fallback_string_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if (!preg_match('/(\d+) of (\d+) drifted/', $line, $m)) {
    $fails[] = "corpus: could not read the check's own count out of:\n      $line";
} else {
    if ((int) $m[2] < 800) {
        $fails[] = sprintf('corpus: only %d fallbacks found across js/*.js. 892 shipped on '
            . '2026-09-06; a collapse this large means the scan went blind, not that they were '
            . 'deleted.', (int) $m[2]);
    }
    if ((int) $m[1] < 1) {
        $fails[] = 'corpus: 0 drifted fallbacks. 199 were measured on 2026-09-06 and correcting '
            . 'them is 199 edits inside js/; if that genuinely happened, lower the baseline and '
            . 'relax this assertion deliberately.';
    }
}
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding.";
}

if ($fails) {
    echo 'js_fallback_string selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  $f\n"; }
    exit(1);
}
echo "js_fallback_string selftest OK -- $n cases.\n";
