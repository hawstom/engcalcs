<?php
/**
 * Trap-term watchlist — a DERIVED view of glossary.json.
 *
 * A term is on the watchlist exactly when its glossary entry carries a non-empty
 * "avoid" array (the wrong senses a translator must not produce). This script is the
 * one-command dump you hand a high-power agent for an on-demand, low-cost sweep of the
 * hard/polysemous/units-trap terms across all languages. It is a view, never a second
 * hand-maintained list, so it can never drift from the glossary.
 *
 * Usage:
 *   php dev/scripts/list_trap_terms.php              # human-readable, all languages
 *   php dev/scripts/list_trap_terms.php --lang=fr    # show only the fr established term
 *   php dev/scripts/list_trap_terms.php --json       # machine-readable JSON
 *
 * See CLAUDE.md "polysemy/units-trap protocol" and dev/translation-process.md
 * (term-centric sprint mode).
 */

const GLOSSARY_PATH = __DIR__ . '/glossary.json';

main($argv);

function main(array $argv): void
{
    $lang = null;
    $asJson = false;
    foreach (array_slice($argv, 1) as $arg) {
        if ($arg === '--json') {
            $asJson = true;
        } elseif (strpos($arg, '--lang=') === 0) {
            $lang = substr($arg, 7);
        } else {
            fwrite(STDERR, "Unknown argument: {$arg}\n");
            exit(1);
        }
    }

    $raw = @file_get_contents(GLOSSARY_PATH);
    if ($raw === false) {
        fwrite(STDERR, 'ERROR: cannot read ' . GLOSSARY_PATH . "\n");
        exit(1);
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['terms']) || !is_array($data['terms'])) {
        fwrite(STDERR, "ERROR: invalid glossary JSON structure\n");
        exit(1);
    }

    $traps = [];
    foreach ($data['terms'] as $term) {
        $avoid = $term['avoid'] ?? [];
        if (!is_array($avoid) || count($avoid) === 0) {
            continue;
        }
        $traps[] = $term;
    }

    if ($asJson) {
        $out = [];
        foreach ($traps as $term) {
            $entry = [
                'term' => $term['term'] ?? '',
                'symbol' => $term['symbol'] ?? '',
                'avoid' => array_values($term['avoid']),
            ];
            if ($lang !== null) {
                $entry['translation'] = $term['translations'][$lang] ?? '';
            } else {
                $entry['translations'] = $term['translations'] ?? [];
            }
            $out[] = $entry;
        }
        echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
        return;
    }

    echo 'Trap-term watchlist (' . count($traps) . " terms) — glossary v"
        . ($data['meta']['version'] ?? '?') . "\n";
    echo "Derived from glossary.json 'avoid' arrays; do not edit a separate list.\n\n";

    foreach ($traps as $term) {
        $name = $term['term'] ?? '';
        $symbol = ($term['symbol'] ?? '') !== '' ? ' (' . $term['symbol'] . ')' : '';
        echo '• ' . $name . $symbol . "\n";
        foreach ($term['avoid'] as $a) {
            echo '    ✗ ' . $a . "\n";
        }
        if ($lang !== null) {
            $t = $term['translations'][$lang] ?? '';
            echo '    ' . $lang . ': ' . ($t === '' ? '[needs translation]' : $t) . "\n";
        }
        echo "\n";
    }
}
