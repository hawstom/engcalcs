<?php
/**
 * Stale-claim worklist (ROADMAP Task 481). ADVISORY — never blocks a commit.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. Three false claims shipped in one day, all the same shape: prose asserting
 * something was not built when it had been. CLAUDE.md and the LibreWaterNet landing draft both
 * said extended-period simulation was not built and the page solved a single instant; EPS had
 * shipped 2026-08-18. The same audit found CLAUDE.md saying the .inp exporter "does not write one
 * yet"; export shipped the same day. Tom found two of the three. No check could see any of them.
 *
 * THE ONE RULE THIS APPLIES, and it is deliberately dumb: extract every `Task N` citation from
 * CLAUDE.md and every dev/*.md, and surface the ones whose task is CLOSED (listed in
 * dev/roadmap-closed-ids.md). A closed task cited in prose is not automatically wrong — the ledger
 * exists so that "the closed Task 281 entry lists the five impossible round trips" still resolves —
 * so this produces a WORKLIST A HUMAN SKIMS, not a verdict.
 *
 * RANKING is what makes the worklist short. A citation sitting beside a negation or a future-tense
 * marker ("not yet", "does not", "is not built", "will be", "no ... yet") is far likelier to be a
 * stale claim than a bare "see Task 281". Marker on the citation's own line = HIGH; marker on an
 * adjacent line = MEDIUM; everything else = LOW. Only HIGH prints unless --all. Every surfaced line names
 * the marker that surfaced it.
 *
 * No natural-language understanding is attempted. A check that tries to be clever here would be
 * wrong and would then be ignored, which is worse than not existing.
 *
 * Usage:
 *   php dev/scripts/stale_claim_check.php          # high only
 *   php dev/scripts/stale_claim_check.php --all    # every citation of a closed task
 *   php dev/scripts/stale_claim_check.php --quiet   # summary line only
 *
 * MEASURED 2026-08-23: the two demotions below took HIGH from 11 lines to 7. **All 7 that remain
 * are still legitimate records**, and that is the expected steady state — there is no known stale
 * claim in the repo today, so a true positive would be a NEW defect, not a backlog item. What the
 * demotions bought is that the list no longer leads with a correction of a false claim, which is
 * the one finding a reader would most likely act on backwards.
 *
 * Exit 0 = nothing ranked high. Exit 1 = at least one high-ranked line to skim. Advisory either
 * way: check_all.sh runs it in the advisory group, where a non-zero exit prints and does not block.
 */

$root = dirname(__DIR__, 2);

// The ledger IS a list of closed IDs, and the roadmap index mirrors it; every line in either would
// match, so scanning them would bury the finding in 400 lines of noise.
const SKIP_FILES = ['roadmap-closed-ids.md', 'roadmap-index.md'];

// Kept tight on purpose. Each entry is a phrase that turns a citation into a CLAIM ABOUT STATE.
// "never", bare "no", and the IMPERATIVE "do not" are excluded: all three are everywhere in this
// repo as policy prose ("never rename a key by hand", "Do not promote Task 146 on that number"),
// which is an instruction about the future, not a claim that something is unbuilt. A marker that
// matches everything ranks nothing. "does not" and "did not" stay — those are state claims.
const MARKERS = [
    '/\bnot yet\b/i',
    '/\byet to\b/i',
    '/\bno\b[^.;]{0,60}\byet\b/i',
    '/\b(?:does|did) not\b/i',
    '/\bdoesn\'t\b/i',
    '/\b(?:is|are|was|were) not\b/i',
    '/\b(?:isn\'t|aren\'t|wasn\'t|weren\'t)\b/i',
    '/\bnot (?:built|implemented|written|shipped|supported|possible|done)\b/i',
    '/\bwill (?:be|not|need|have|get)\b/i',
    '/\bwon\'t\b/i',
    '/\bwould (?:be|need)\b/i',
    '/\b(?:cannot|can\'t|could not|couldn\'t)\b/i',
    '/\bunbuilt\b/i',
    '/\bstill (?:no|has no|lacks|missing|open|unbuilt|pending)\b/i',
    '/\blacks\b/i',
    '/\bplanned\b/i',
    '/\bpending\b/i',
    '/\bTODO\b/',
    '/\btoday it\b/i',
    '/\bonce (?:it|this|that) (?:ships|lands|exists)\b/i',
];

/* **HIGH IS FOR A PRESENT-TENSE CLAIM THAT A CAPABILITY DOES NOT EXIST.** Two kinds of line carry a
 * marker and are records rather than claims, and both were ranking HIGH — which mattered, because
 * on 2026-08-23 ALL ELEVEN high lines were legitimate records, and an advisory with no true
 * positives teaches its reader to skip it. That is the same failure this file was written to catch
 * in prose, arriving in the tool itself.
 *
 * PAST TENSE describes history. "Task 193 reviewed all 226 keys and it did not work" is the record
 * of a thing that happened, not an assertion about what the suite does today. Demoted to MEDIUM,
 * not dropped: a past-tense line can still be stale, it is just no longer worth reading first.
 *
 * A NEGATION THE LINE ITSELF MARKS FALSE is a correction, and corrections QUOTE the false claim —
 * `**"Does not write one yet" is FALSE.**` is this file's own warning shape, and it was the
 * top-ranked finding against `CLAUDE.md`. A checker that reports the fix as the defect makes the
 * fix look like something to undo. */
const PAST_TENSE = [
    '/\b(?:did|was|were) not\b/i',
    '/\b(?:didn\'t|wasn\'t|weren\'t)\b/i',
    '/\b(?:could not|couldn\'t)\b/i',
];
const CORRECTION = [
    '/\bis (?:FALSE|false|wrong|no longer true|stale)\b/',
    '/\bwas (?:FALSE|false|wrong)\b/',
    '/\bdo not restore\b/i',
    '/\bno longer (?:true|the case)\b/i',
    '/\bcorrected\b/i',
];

$opts = ['all' => false, 'quiet' => false];
foreach (array_slice($argv, 1) as $arg) {
    if ($arg === '--all') {
        $opts['all'] = true;
    } elseif ($arg === '--quiet') {
        $opts['quiet'] = true;
    } else {
        fwrite(STDERR, "Unknown argument: {$arg}\n");
        exit(2);
    }
}

$ledger = $root . '/dev/roadmap-closed-ids.md';
if (!is_file($ledger)) {
    fwrite(STDERR, "Closed-ID ledger not found: {$ledger}\n");
    exit(2);
}
$closed = [];
foreach (file($ledger) as $line) {
    if (preg_match('/^\s*-\s*0\|([0-9]+(?:\.[0-9]+)?)\|/', $line, $m)) {
        $closed[$m[1]] = true;
    }
}
if (!$closed) {
    fwrite(STDERR, "No closed IDs parsed out of the ledger; its format may have changed.\n");
    exit(2);
}

$files = [];
if (is_file($root . '/CLAUDE.md')) {
    $files[] = $root . '/CLAUDE.md';
}
foreach (glob($root . '/dev/*.md') ?: [] as $f) {
    if (!in_array(basename($f), SKIP_FILES, true)) {
        $files[] = $f;
    }
}

$findings = ['high' => [], 'medium' => [], 'low' => []];
$citations = 0;
$closedCitations = 0;

foreach ($files as $file) {
    $lines = file($file, FILE_IGNORE_NEW_LINES);
    $rel = ltrim(substr($file, strlen($root)), '/');
    foreach ($lines as $i => $line) {
        if (!preg_match_all('/\bTask\s+([0-9]+(?:\.[0-9]+)?)\b/', $line, $m)) {
            continue;
        }
        $ids = array_values(array_unique($m[1]));
        $citations += count($ids);
        $closedIds = array_values(array_filter($ids, static fn($id) => isset($closed[$id])));
        if (!$closedIds) {
            continue;
        }
        $closedCitations += count($closedIds);

        $own = markerIn($line);
        $near = $own ?? markerIn(($lines[$i - 1] ?? '') . ' ' . ($lines[$i + 1] ?? ''));
        $rank = $own !== null ? 'high' : ($near !== null ? 'medium' : 'low');
        $why = $own !== null
            ? 'negation/future marker "' . $own . '" on the same line'
            : ($near !== null ? 'negation/future marker "' . $near . '" on an adjacent line'
                              : 'closed task cited, no state-claim marker nearby');
        // The two demotions. Checked only when the marker is on the citation's OWN line: a
        // neighbouring line's tense says nothing about this one's.
        if ($rank === 'high') {
            $correction = matchIn(CORRECTION, $line);
            $past = matchIn(PAST_TENSE, $own);
            if ($correction !== null) {
                $rank = 'medium';
                $why = 'a correction, not a claim — the line marks it "' . $correction . '"';
            } elseif ($past !== null) {
                $rank = 'medium';
                $why = 'past tense "' . $past . '" — a record of what happened, not a claim about now';
            }
        }

        $findings[$rank][] = [
            'file' => $rel,
            'line' => $i + 1,
            'ids'  => $closedIds,
            'why'  => $why,
            'text' => trim($line),
        ];
    }
}

function matchIn(array $patterns, ?string $text): ?string
{
    if ($text === null) {
        return null;
    }
    foreach ($patterns as $re) {
        if (preg_match($re, $text, $m)) {
            return trim($m[0]);
        }
    }
    return null;
}

function markerIn(string $text): ?string
{
    foreach (MARKERS as $re) {
        if (preg_match($re, $text, $m)) {
            return trim($m[0]);
        }
    }
    return null;
}

$show = $opts['all'] ? ['high', 'medium', 'low'] : ['high'];
if (!$opts['quiet']) {
    foreach ($show as $rank) {
        if (!$findings[$rank]) {
            continue;
        }
        echo strtoupper($rank) . ' — ' . count($findings[$rank]) . " citation(s) of a CLOSED task:\n";
        $byFile = [];
        foreach ($findings[$rank] as $f) {
            $byFile[$f['file']][] = $f;
        }
        foreach ($byFile as $rel => $rows) {
            echo "  {$rel}\n";
            foreach ($rows as $f) {
                echo '    ' . $rel . ':' . $f['line'] . '  Task ' . implode(', Task ', $f['ids']) . "\n";
                echo '      surfaced: ' . $f['why'] . "\n";
                $snippet = $f['text'];
                if (mb_strlen($snippet) > 140) {
                    $snippet = mb_substr($snippet, 0, 137) . '...';
                }
                echo '      ' . $snippet . "\n";
            }
        }
        echo "\n";
    }
}

printf(
    "%d Task citations across %d files; %d cite a closed task (%d high, %d medium, %d low).%s\n",
    $citations,
    count($files),
    $closedCitations,
    count($findings['high']),
    count($findings['medium']),
    count($findings['low']),
    $opts['all'] ? '' : ' Only HIGH is printed; --all shows medium and low.'
);
if ($findings['high']) {
    echo "Advisory. A closed task cited beside a negation is often prose that never got updated;\n";
    echo "read each high line and decide. Citing a closed task as a RECORD is legitimate.\n";
}

exit($findings['high'] ? 1 : 0);
