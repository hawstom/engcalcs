<?php
/**
 * Wave 0 key-set assembler and $ec_lang_syn pre-filter (ROADMAP Task 239).
 *
 * Wave 0 is the adversarial English pass a sprint runs before it launches: one agent, English
 * only, asking "list every plausible reading of this string; more than one means rewrite."
 * Until now the key set for that pass was assembled by hand, which meant nothing could pre-filter
 * it and nothing could measure it.
 *
 * THE PRE-FILTER: a key that already carries a non-empty $ec_lang_syn has already had this exact
 * question asked and answered -- the synonym channel exists precisely to say "the English is
 * right, here is the reading." Re-asking produces a re-flag, and a re-flag is a dismissal that
 * costs a human's attention. Measured on 239-wave0-calcs.json (35 entries over the fifteen
 * non-lpn calculators, against the syn state as it stood the day that pass ran): 9 of the 35
 * findings were on keys that already had a syn entry -- 7 of the 13 dismissals, 1 of the 16
 * refer-to-human and 1 of the 6 confirmed English rewrites. Dismissal rate 13/35 = 37% before,
 * 6/26 = 23% after.
 *
 * THE FILTER LOSES REAL CATCHES, so it never hides what it dropped. mtc_note_1 already had a syn
 * entry and was still rewritten. That is the cost of the filter stated in the one case we can
 * measure, and it is why --skipped exists and why the human-readable output always prints the
 * skipped count. A skipped key is a CHEAPER SECOND LOOK, not a key ruled correct: run the pass
 * over the reviewed set, then, if there is budget, read the skipped list against its syn entries.
 *
 * Usage:
 *   php dev/scripts/wave0_keyset.php --prefix=mpf,mtc      # the pass set for those calculators
 *   php dev/scripts/wave0_keyset.php --exclude-prefix=lpn  # everything but lpn_
 *   php dev/scripts/wave0_keyset.php --new-and-changed     # only keys new or edited since the
 *                                                          # last translation sync (the usual case)
 *   php dev/scripts/wave0_keyset.php --skipped             # list what the pre-filter dropped, with syn
 *   php dev/scripts/wave0_keyset.php --no-filter           # the unfiltered set (what Wave 0 used to be)
 *   php dev/scripts/wave0_keyset.php --json                # machine form, for pasting into an agent prompt
 *   php dev/scripts/wave0_keyset.php --measure=239-wave0-calcs
 *                                                          # replay a recorded friction log against the
 *                                                          # filter and report what it would have skipped
 *
 * Exit 0 always except on a usage or parse error (2). This assembles work; it gates nothing.
 */

const W0_EN_FILE   = __DIR__ . '/../../lib/lang.ec.en.php';
const W0_MANIFEST  = __DIR__ . '/english_string_hashes.json';
const W0_FRICTION  = __DIR__ . '/../english-friction';

exit(w0Main($argv));

function w0Main(array $argv): int
{
    $opts = [
        'prefix' => [], 'exclude' => [], 'new_and_changed' => false,
        'filter' => true, 'skipped' => false, 'json' => false, 'measure' => null,
    ];
    foreach (array_slice($argv, 1) as $arg) {
        if ($arg === '--json') {
            $opts['json'] = true;
        } elseif ($arg === '--skipped') {
            $opts['skipped'] = true;
        } elseif ($arg === '--no-filter') {
            $opts['filter'] = false;
        } elseif ($arg === '--new-and-changed') {
            $opts['new_and_changed'] = true;
        } elseif (strpos($arg, '--prefix=') === 0) {
            $opts['prefix'] = w0SplitCsv(substr($arg, strlen('--prefix=')));
        } elseif (strpos($arg, '--exclude-prefix=') === 0) {
            $opts['exclude'] = w0SplitCsv(substr($arg, strlen('--exclude-prefix=')));
        } elseif (strpos($arg, '--measure=') === 0) {
            $opts['measure'] = substr($arg, strlen('--measure='));
        } elseif ($arg === '--help' || $arg === '-h') {
            w0Help();
            return 0;
        } else {
            fwrite(STDERR, "Unknown argument: {$arg}\n");
            w0Help();
            return 2;
        }
    }

    [$en, $syn] = w0LoadEnglish();
    if (count($en) === 0) {
        fwrite(STDERR, 'No keys parsed from ' . W0_EN_FILE . "\n");
        return 2;
    }

    if ($opts['measure'] !== null) {
        return w0Measure($opts['measure'], $syn, $opts['json']);
    }

    $set = w0Scope($en, $opts);
    $reviewed = [];
    $skipped = [];
    foreach ($set as $key => $value) {
        if ($opts['filter'] && isset($syn[$key]) && trim((string)$syn[$key]) !== '') {
            $skipped[$key] = ['english' => (string)$value, 'syn' => trim((string)$syn[$key])];
        } else {
            $reviewed[$key] = (string)$value;
        }
    }

    if ($opts['json']) {
        echo json_encode([
            'scope' => [
                'prefix' => $opts['prefix'],
                'exclude_prefix' => $opts['exclude'],
                'new_and_changed' => $opts['new_and_changed'],
                'pre_filter' => $opts['filter'] ? 'skip keys with a non-empty $ec_lang_syn' : 'none',
            ],
            'counts' => [
                'in_scope' => count($set),
                'to_review' => count($reviewed),
                'skipped_has_syn' => count($skipped),
            ],
            'keys_to_review' => $reviewed,
            'skipped_has_syn' => $skipped,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
        return 0;
    }

    echo 'Wave 0 scope: ' . count($set) . ' key' . (count($set) === 1 ? '' : 's');
    if ($opts['prefix']) {
        echo ' [prefix ' . implode(',', $opts['prefix']) . ']';
    }
    if ($opts['exclude']) {
        echo ' [minus ' . implode(',', $opts['exclude']) . ']';
    }
    if ($opts['new_and_changed']) {
        echo ' [new or changed since last sync]';
    }
    echo "\n";

    if ($opts['filter']) {
        $pct = count($set) > 0 ? round(100 * count($skipped) / count($set), 1) : 0.0;
        echo 'Pre-filter: ' . count($skipped) . " skipped ({$pct}%) -- already carry a non-empty \$ec_lang_syn.\n";
        echo 'To review: ' . count($reviewed) . "\n";
        echo "A skipped key is a cheaper second look, not a key ruled correct. See it with --skipped.\n";
    } else {
        echo "Pre-filter: OFF (--no-filter).\n";
    }
    echo "\n";

    if ($opts['skipped']) {
        if (count($skipped) === 0) {
            echo "Nothing skipped.\n";
            return 0;
        }
        echo "SKIPPED (English -- syn already on file):\n";
        foreach ($skipped as $key => $r) {
            echo "  {$key}\n";
            echo '      en:  ' . w0Snip($r['english']) . "\n";
            echo '      syn: ' . w0Snip($r['syn']) . "\n";
        }
        return 0;
    }

    foreach ($reviewed as $key => $value) {
        echo "  {$key}: " . w0Snip($value) . "\n";
    }
    return 0;
}

/** English keys in scope, before the pre-filter. */
function w0Scope(array $en, array $opts): array
{
    $changed = $opts['new_and_changed'] ? w0NewAndChanged($en) : null;

    $out = [];
    foreach ($en as $key => $value) {
        $prefix = w0Prefix($key);
        if ($opts['prefix'] && !in_array($prefix, $opts['prefix'], true)) {
            continue;
        }
        if ($opts['exclude'] && in_array($prefix, $opts['exclude'], true)) {
            continue;
        }
        if ($changed !== null && !isset($changed[$key])) {
            continue;
        }
        $out[$key] = $value;
    }
    return $out;
}

/**
 * Keys with no recorded hash (new) or a hash that no longer matches (edited), per the same
 * manifest detect_english_drift.php maintains. Wave 0 reviews new and changed strings, so this
 * is the ordinary scope; with no manifest it degrades to "everything", which is the safe way to
 * be wrong.
 */
function w0NewAndChanged(array $en): array
{
    if (!is_file(W0_MANIFEST)) {
        return $en;
    }
    $data = json_decode((string)file_get_contents(W0_MANIFEST), true);
    $hashes = is_array($data['hashes'] ?? null) ? $data['hashes'] : [];
    if (count($hashes) === 0) {
        return $en;
    }
    $out = [];
    foreach ($en as $key => $value) {
        if (!isset($hashes[$key]) || $hashes[$key] !== sha1((string)$value)) {
            $out[$key] = $value;
        }
    }
    return $out;
}

/**
 * Replays a recorded friction log against the pre-filter: of the findings that pass actually
 * produced, which were on keys that already had a syn entry? Dismissals skipped are the saving;
 * every other skipped disposition is the cost, and both are printed.
 */
function w0Measure(string $sprint, array $syn, bool $json): int
{
    $file = W0_FRICTION . '/' . $sprint . '.json';
    if (!is_file($file)) {
        fwrite(STDERR, "No friction log for sprint: {$sprint}\n");
        return 2;
    }
    $raw = json_decode((string)file_get_contents($file), true);
    if (!is_array($raw['entries'] ?? null)) {
        fwrite(STDERR, "MALFORMED: expected an object with an 'entries' array.\n");
        return 2;
    }

    $buckets = [];
    $total = 0;
    $skippedTotal = 0;
    foreach ($raw['entries'] as $e) {
        if (($e['source'] ?? '') !== 'wave0') {
            continue; // The filter only ever applies to the Wave 0 pass.
        }
        $key = (string)($e['key'] ?? '');
        $disp = (string)($e['disposition'] ?? '?');
        $hit = isset($syn[$key]) && trim((string)$syn[$key]) !== '';
        $buckets[$disp]['total'] = ($buckets[$disp]['total'] ?? 0) + 1;
        $buckets[$disp]['skipped'] = $buckets[$disp]['skipped'] ?? [];
        if ($hit) {
            $buckets[$disp]['skipped'][] = $key;
            $skippedTotal++;
        }
        $total++;
    }
    ksort($buckets);

    $dismissedTotal = $buckets['dismissed']['total'] ?? 0;
    $dismissedSkipped = count($buckets['dismissed']['skipped'] ?? []);
    $rateBefore = $total > 0 ? round(100 * $dismissedTotal / $total, 1) : 0.0;
    $remaining = $total - $skippedTotal;
    $rateAfter = $remaining > 0 ? round(100 * ($dismissedTotal - $dismissedSkipped) / $remaining, 1) : 0.0;

    if ($json) {
        echo json_encode([
            'sprint' => $sprint,
            'wave0_findings' => $total,
            'skipped_by_prefilter' => $skippedTotal,
            'by_disposition' => $buckets,
            'dismissal_rate_before_pct' => $rateBefore,
            'dismissal_rate_after_pct' => $rateAfter,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
        return 0;
    }

    echo "[{$sprint}] {$total} wave-0 finding" . ($total === 1 ? '' : 's')
        . "; the pre-filter would have skipped {$skippedTotal}.\n";
    foreach ($buckets as $disp => $b) {
        $n = count($b['skipped']);
        echo "  {$disp}: {$b['total']} finding" . ($b['total'] === 1 ? '' : 's') . ", {$n} on a key with a syn entry";
        echo $n > 0 ? ' (' . implode(', ', $b['skipped']) . ")\n" : "\n";
    }
    echo "Dismissal rate {$rateBefore}% -> {$rateAfter}%.\n";
    $cost = $skippedTotal - $dismissedSkipped;
    if ($cost > 0) {
        echo "COST: {$cost} skipped finding" . ($cost === 1 ? ' was' : 's were')
            . " NOT a dismissal. The filter hides real work; --skipped lists it.\n";
    }
    echo "NOTE: this reads TODAY'S \$ec_lang_syn. A syn entry written as a RESULT of this pass\n";
    echo "      inflates the saving; check the syn state at the pass's own commit before quoting it.\n";
    return 0;
}

function w0LoadEnglish(): array
{
    $ec_lang = [];
    $ec_lang_syn = [];
    include W0_EN_FILE;
    return [is_array($ec_lang) ? $ec_lang : [], is_array($ec_lang_syn) ? $ec_lang_syn : []];
}

function w0Prefix(string $key): string
{
    $pos = strpos($key, '_');
    return $pos === false ? $key : substr($key, 0, $pos);
}

function w0SplitCsv(string $v): array
{
    return array_values(array_filter(array_map('trim', explode(',', $v)), static function ($s) {
        return $s !== '';
    }));
}

function w0Snip(string $v): string
{
    $v = trim((string)preg_replace('/\s+/u', ' ', $v));
    return mb_strlen($v) > 90 ? mb_substr($v, 0, 87) . '...' : $v;
}

function w0Help(): void
{
    echo "Wave 0 key-set assembler (ROADMAP Task 239).\n";
    echo "  --prefix=a,b           only these key prefixes\n";
    echo "  --exclude-prefix=lpn   drop these key prefixes\n";
    echo "  --new-and-changed      only keys new or edited since the last translation sync\n";
    echo "  --no-filter            do not skip keys that already carry a \$ec_lang_syn\n";
    echo "  --skipped              list what the pre-filter dropped, with its syn entry\n";
    echo "  --json                 machine form\n";
    echo "  --measure=<sprint>     replay a recorded friction log against the filter\n";
}
