<?php
/**
 * public_claim_check.php — four sentences that have already shipped and already been struck must
 * not come back in a string a stranger reads. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS, AND WHY IT IS A DENYLIST RATHER THAN A RULE. Most of what CLAUDE.md says about
 * public claims is judgement and belongs in prose — what may be promised, how a comparison should
 * read, when to say nothing. **None of that is here.** What is here is the small set of exact
 * sentences that were WRITTEN, SHIPPED, and then struck by Tom personally, each of which a later
 * writer can reintroduce in good faith because it reads perfectly reasonably:
 *
 *   1. **"your phone"** — the claim is always *"a phone"*. Tom chose the indefinite article himself,
 *      *"to be scrupulously honest"*: **"a phone" is a claim about the SOFTWARE; "your phone" is a
 *      promise about a device we have never seen.** ("your PC" is fine and is in the sanctioned
 *      sentence, which is why this matches the noun and not the pronoun.)
 *   2. **"PC application"** — Tom, 2026-08-24: *"It is not a PC application; it is a web
 *      application."* The sentence *"And it is a PC application, the way EPANET is"* stood on the
 *      LibreWaterNet draft and he struck it. It is a ruling about IDENTITY and does not touch the
 *      pointer-first DESIGN rule, which is what makes it so easy to reintroduce by accident.
 *   3. **"the only third-party request"** — false since the geocoder shipped. There are FOUR, each
 *      opt-in, each with its own consent gate.
 *   4. **"no extended-period simulation yet"** — false since 2026-08-18. It stood in CLAUDE.md and
 *      on the landing draft for three days after the run shipped, and **Tom caught it, not a check**.
 *
 * WHAT IT READS, AND WHY THE SCOPE IS NARROW. `lib/lang.ec.en.php` only — the shipped English
 * strings. Widening it by one directory would break it immediately: every one of these phrases
 * appears in `dev/positioning.md` and in `CLAUDE.md`, inside the rule that FORBIDS it. A check that
 * reports the rule as a violation of itself gets deleted by the first person who hits it, so this
 * one is deliberately blind to the documents. English only, too: a translator's rendering of "a
 * phone" cannot be tested from here, and the claim originates in English.
 *
 * **THIS IS THEREFORE A FLOOR, NOT A GUARANTEE.** It cannot see the LibreWaterNet landing page,
 * which lives in `~/webdev/librewaternet.org` and is where three of these four actually shipped.
 * `dev/positioning.md` remains the authority; this only makes the four known mistakes unrepeatable
 * in the one place a script can watch.
 *
 * Usage:
 *   php dev/scripts/public_claim_check.php
 *
 * Exit 0 = clean. Exit 1 = a struck sentence is back, with the key that carries it.
 */

/**
 * The denylist. Each entry is [regex, what to say instead], and the regex is deliberately tight:
 * these are SENTENCES that shipped, not a grammar of bad claims.
 */
const EC_STRUCK_CLAIMS = [
    ['/\byour\s+phone\b/i',
     'Write "a phone". Tom chose the indefinite article "to be scrupulously honest": "a phone" is a '
     . 'claim about the software, "your phone" is a promise about a device we have never seen.'],
    ['/\bPC\s+application\b/i',
     'Tom, 2026-08-24: "It is not a PC application; it is a web application." It is a ruling about '
     . 'identity and does not touch the pointer-first design rule.'],
    ['/\bonly\s+third[-\s]?party\s+request\b/i',
     'There are FOUR third-party requests, all on the lpn_ page, all opt-in: OSM tiles, Mapbox '
     . 'satellite tiles, Nominatim search and Mapbox Terrain-RGB. This has been false since the '
     . 'geocoder shipped.'],
    ['/\bno\s+extended[-\s]?period\s+simulation\b|\bnot?\s+(?:have|do|support)\s+extended[-\s]?period\b/i',
     'Extended-period simulation shipped 2026-08-18 through the EPANET engine. It was checked '
     . 'against all 25 steps of EPA\'s own Net3.rpt over 2,425 head comparisons.',
     // **THE DEMOTION, AND IT IS ABOUT THE SUBJECT OF THE SENTENCE.** The struck claim is about
     // the SUITE -- "there is no extended-period simulation yet" -- and is false. A sentence whose
     // subject is THIS PROJECT is a fact about one document the user has open, and is true: a
     // project with no Total run time has no run to show. Tom ruled that exact sentence OK on
     // 2026-09-04 (`lpn_time_no_period`, dev/eps-terminology-audit.md §4), which is what earns the
     // demotion -- the same provenance a denial row needs. Anything else still blocks, including
     // "no extended period simulation configured": blocking is the safe direction and the message
     // names the fix.
     '/\bthis\s+project\s+has\s+no\s+extended[-\s]?period\s+simulation\s+set\b/i'],
];

/**
 * Findings in one set of language values. Pure, for the selftest.
 *
 * @param array<string,string> $strings key => English value.
 * @return array<int,array{0:string,1:string,2:string}> [key, matched text, what to do]
 */
function ecStruckClaims(array $strings): array
{
    $out = [];
    foreach ($strings as $key => $value) {
        foreach (EC_STRUCK_CLAIMS as $row) {
            [$re, $fix] = $row;
            $allow = $row[2] ?? null;
            // A DEMOTION IS DECLARED PER ROW AND IS NEVER A LOOSENED DENIAL. The denial pattern is
            // left exactly as it was, so every sentence it ever caught it still catches; a value is
            // only excused by matching a second, far narrower pattern that names the sanctioned
            // wording. public_claim_selftest.php asserts both legs of every one of these.
            if ($allow !== null && preg_match($allow, (string) $value)) {
                continue;
            }
            if (preg_match($re, (string) $value, $m)) {
                $out[] = [$key, $m[0], $fix];
            }
        }
    }
    return $out;
}

if (defined('PUBLIC_CLAIM_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$ec_lang = [];
$ec_lang_syn = [];
require $root . '/lib/lang.ec.en.php';

$problems = ecStruckClaims($ec_lang);

if ($problems) {
    echo 'Struck public claims: ' . count($problems) . " occurrence(s)\n\n";
    foreach ($problems as [$key, $hit, $fix]) {
        echo "  \$ec_lang['$key'] says \"$hit\"\n      $fix\n\n";
    }
    echo "Each of these was written, shipped, and struck by Tom personally. They read perfectly\n";
    echo "reasonably, which is why they come back. dev/positioning.md is the authority.\n";
    exit(1);
}

echo 'Public claims OK -- ' . count($ec_lang) . " English strings, none of the four struck\n";
echo "sentences. (This cannot see the LibreWaterNet landing page; dev/positioning.md is the\n";
echo "authority there.)\n";
exit(0);
