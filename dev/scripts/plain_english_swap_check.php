<?php
/**
 * PLAIN ENGLISH IS FOR THE EXPLAINING, NEVER FOR THE NAMING.
 *
 * This is ROADMAP-adjacent to Task 322 and it exists because the rule it holds has now been
 * violated AFTER being written down, which is the exact case CLAUDE.md's own argument is about:
 * a rule a machine enforces is worth roughly ten a human must remember.
 *
 * THE HISTORY, because it is the whole justification. `dev/language-strings.md` tells a writer that
 * explanatory strings "prioritize Simple English", with riprap and chute as the examples -- a rule
 * about opaque LOANWORDS. It was read far more widely than that and produced strings a hydraulic
 * engineer does not recognise. Tom struck four in one reading on 2026-09-01: `Rest pressure` for
 * static pressure, `Pulled down` for drawdown, `settle` for converge, `Solves` for runs, asking
 * twice *"why are we inventing language that engineers will not recognize?"*
 *
 * The correction was then written into `CLAUDE.md` -- and NOT into `dev/language-strings.md`, which
 * is the file `CLAUDE.md` tells you to read before editing any string value. So the next writer did
 * as instructed and got the uncorrected rule, and shipped `The usual value is {n}.` where the word
 * is `default`. Tom, again: *"'Usual' is not a synonym of 'default'... Please search your memory for
 * the source of your avoidance of plain engineering terms to correct this tendency at its source."*
 * The source was that missing paragraph. It is there now, and this is the half that cannot be
 * forgotten.
 *
 * WHAT IT READS. English `$ec_lang` values only, exactly as `public_claim_check.php` does and for
 * the same reason: the other 26 files are a translator's business, and `dev/*.md` states these very
 * phrases inside the rule forbidding them.
 *
 * TWO FAILURE MODES SHARE THIS TABLE, AND THEY ARE NOT THE SAME MISTAKE.
 *   - **REGISTER**: a plain word put where the profession has one -- `settle` for converge. The
 *     idea is right and the word is not the one an engineer would look up, which makes the string
 *     harder to translate rather than easier.
 *   - **CONCEPT**: a word that means something else altogether -- `the usual value` for the
 *     default. Tom, 2026-09-01: *"'Usual' is a great word to indicate what's done in most cases by
 *     most people in most programs. But it doesn't mean 'What will be done internally if you leave
 *     this blank.' No amount of Simple English can make that right."* **The second kind cannot be
 *     fixed by choosing a better plain word**, because no plain word carries the promise; it is
 *     fixed only by using the term. That is why simplifying is not a defence here.
 *
 * WHY IT IS A DECLARED TABLE AND NOT A CLEVERNESS. "Is this word standing in for a term of art" is
 * undecidable in general. Every row here is a substitution that SHIPPED and was struck by name, so
 * the list grows by observation, never by somebody's idea of what an engineer says. An entry costs
 * one line. `usually` as an ordinary adverb ("the two that usually matter") is not on it and never
 * will be -- only the phrase that stands where a term belongs.
 *
 * Usage:
 *   php dev/scripts/plain_english_swap_check.php
 *
 * Exit 0 = no English string swaps a standard term for a plain-English near-miss.
 */

require_once __DIR__ . '/lang_parse.inc.php';

/**
 * Each row: the pattern, the term it displaces, and the ruling it comes from.
 * `exempt` lists keys where the same characters are legitimately NOT the swap.
 */
const EC_PLAIN_SWAPS = [
    [
        'pattern' => '/\bthe\s+usual\s+value\b/iu',
        'term'    => 'default',
        // **AND THIS ROW IS A WRONG-CONCEPT ROW, NOT A REGISTER ROW** -- Tom sharpened it after the
        // first version of this check was written, and the distinction is the useful part:
        // *"'Usual' is a great word to indicate what's done in most cases by most people in most
        // programs. But it doesn't mean 'What will be done internally if you leave this blank.'
        // No amount of Simple English can make that right."* So this is not a plainer word for the
        // same idea; it is a different idea wearing the right word's slot. A default is a promise
        // about what the software does with an empty box. What is usual is a fact about the world.
        'why'     => "Tom, 2026-09-01: \"'Usual' ... doesn't mean 'What will be done internally if you leave this blank.'\" A default is a promise about an empty box; what is usual is a fact about the world. Different concepts, not a plainer word for one.",
        'exempt'  => [],
    ],
    [
        'pattern' => '/\bsettl(e|es|ed|ing)\b/iu',
        'term'    => 'converge',
        'why'     => 'Tom, 2026-09-01, striking "settle" for converge. A solver converges; it does not settle.',
        // A settling basin, or a settlement, is a different word that happens to look the same.
        // None exists in this suite today; the limb is here so the first one is a one-line edit.
        'exempt'  => [],
    ],
    [
        'pattern' => '/\brest\s+pressure\b/iu',
        'term'    => 'static pressure',
        'why'     => 'Tom, 2026-09-01. "Static pressure" is the profession\'s term and is what a hydrant test reports.',
        'exempt'  => [],
    ],
    [
        'pattern' => '/\bpulled\s+down\b/iu',
        'term'    => 'drawdown',
        'why'     => 'Tom, 2026-09-01. "Drawdown" is the profession\'s term.',
        'exempt'  => [],
    ],
];

$root = dirname(__DIR__, 2);
$en = ecLangValues(file_get_contents($root . '/lib/lang.ec.en.php'));

$problems = [];
$scanned = 0;
foreach ($en as $key => $value) {
    $scanned++;
    foreach (EC_PLAIN_SWAPS as $swap) {
        if (in_array($key, $swap['exempt'], true)) { continue; }
        if (preg_match($swap['pattern'], $value, $m)) {
            $problems[] = [$key, $m[0], $swap['term'], $swap['why'], $value];
        }
    }
}

if ($problems) {
    echo 'Plain-English swaps: ' . count($problems) . " English string(s) use a plain word where the profession has one\n\n";
    foreach ($problems as [$key, $hit, $term, $why, $value]) {
        echo "  \$ec_lang['$key']\n";
        echo "      says \"$hit\" where the term is \"$term\"\n";
        echo "      $why\n";
        echo '      value: ' . (strlen($value) > 120 ? substr($value, 0, 117) . '...' : $value) . "\n\n";
    }
    echo "Simple English governs the EXPLAINING, never the NAMING. A plain-English substitute for a\n";
    echo "standard term is HARDER to translate, not easier, because the translator has no term to\n";
    echo "look up. Fix the English; do not add the word to this script's exempt list unless the\n";
    echo "characters genuinely mean something else in that string (a settling basin, say).\n";
    echo "Full rule: dev/language-strings.md, under \"Write English source strings in Simple English\".\n";
    exit(1);
}

echo 'Plain-English swaps OK -- ' . count(EC_PLAIN_SWAPS) . ' struck substitution(s) checked against '
    . $scanned . " English string(s).\n";
