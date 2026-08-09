<?php
/**
 * English-friction gate (ROADMAP Task 239).
 *
 * Reads dev/english-friction/<sprint>.json and fails while any entry is still unanswered.
 * Wave 0 findings block a sprint LAUNCH; translator findings block a sprint CLOSE. Same file,
 * same gate, because the question is identical: has anybody actually answered the translator?
 *
 * Exit 0 = every entry has a disposition and a resolution.
 * Exit 1 = something is open, or referred to the human and not yet ruled on.
 * Exit 2 = the log itself is malformed.
 *
 * Usage:
 *   php dev/scripts/friction_check.php
 *   php dev/scripts/friction_check.php --sprint=146.06-lpn
 *   php dev/scripts/friction_check.php --json
 */

const FRICTION_DIR = __DIR__ . '/../english-friction';

// Dispositions that count as answered. 'refer-to-human' is deliberately NOT here: escalating is
// not resolving, and an escalation that silently closed would be the exact failure this replaces.
const CLOSED_DISPOSITIONS = ['english', 'intent', 'glossary', 'dismissed'];
const OPEN_DISPOSITIONS   = ['open', 'refer-to-human'];
const VALID_SOURCES       = ['wave0', 'translator'];

exit(main($argv));

function main(array $argv): int
{
    $opts = ['sprint' => null, 'json' => false];
    foreach (array_slice($argv, 1) as $arg) {
        if ($arg === '--json') {
            $opts['json'] = true;
        } elseif (strpos($arg, '--sprint=') === 0) {
            $opts['sprint'] = substr($arg, strlen('--sprint='));
        } else {
            fwrite(STDERR, "Unknown argument: {$arg}\n");
            return 2;
        }
    }

    if (!is_dir(FRICTION_DIR)) {
        fwrite(STDERR, 'Friction directory not found: ' . FRICTION_DIR . "\n");
        return 2;
    }

    $files = glob(FRICTION_DIR . '/*.json') ?: [];
    if ($opts['sprint'] !== null) {
        $want = FRICTION_DIR . '/' . $opts['sprint'] . '.json';
        if (!in_array($want, $files, true)) {
            fwrite(STDERR, "No friction log for sprint: {$opts['sprint']}\n");
            return 2;
        }
        $files = [$want];
    }

    $sprints = [];
    $malformed = 0;
    foreach ($files as $file) {
        $sprint = basename($file, '.json');
        $entries = readEntries($file, $sprint, $malformed);
        if ($entries === null) {
            continue;
        }
        $sprints[$sprint] = $entries;
    }

    if ($malformed > 0) {
        return 2;
    }

    $openTotal = 0;
    $report = [];
    foreach ($sprints as $sprint => $entries) {
        $open = array_values(array_filter($entries, static function ($e) {
            return in_array($e['disposition'], OPEN_DISPOSITIONS, true);
        }));
        $openTotal += count($open);
        $report[$sprint] = [
            'total' => count($entries),
            'open' => $open,
            'by_disposition' => countBy($entries, 'disposition'),
            'by_source' => countBy($entries, 'source'),
        ];
    }

    if ($opts['json']) {
        echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
        return $openTotal === 0 ? 0 : 1;
    }

    if (count($report) === 0) {
        echo "No friction logs found.\n";
        return 0;
    }

    foreach ($report as $sprint => $r) {
        echo "[{$sprint}] {$r['total']} entr" . ($r['total'] === 1 ? 'y' : 'ies');
        echo ' — ' . summarize($r['by_disposition']);
        echo ' | by source: ' . summarize($r['by_source']) . "\n";
        foreach ($r['open'] as $e) {
            $who = $e['source'] === 'translator'
                ? 'translator' . ($e['lang'] !== null ? " ({$e['lang']})" : '')
                : 'wave 0';
            $mark = $e['disposition'] === 'refer-to-human' ? 'AWAITING HUMAN' : 'OPEN';
            echo "  {$mark}: {$e['key']} [{$who}] — {$e['complaint']}\n";
        }
    }

    echo "\n";
    if ($openTotal === 0) {
        echo "PASS: every entry has been answered.\n";
        return 0;
    }
    echo "FAIL: {$openTotal} unanswered entr" . ($openTotal === 1 ? 'y' : 'ies') . ".\n";
    echo "A sprint does not launch on open wave-0 findings, and does not close on open translator findings.\n";
    return 1;
}

function readEntries(string $file, string $sprint, int &$malformed): ?array
{
    $raw = json_decode((string)file_get_contents($file), true);
    if (!is_array($raw) || !isset($raw['entries']) || !is_array($raw['entries'])) {
        fwrite(STDERR, "MALFORMED [{$sprint}]: expected an object with an 'entries' array.\n");
        $malformed++;
        return null;
    }

    $out = [];
    foreach ($raw['entries'] as $i => $e) {
        $where = "{$sprint} entry #{$i}";
        foreach (['key', 'source', 'complaint', 'disposition'] as $required) {
            if (!isset($e[$required]) || !is_string($e[$required]) || $e[$required] === '') {
                fwrite(STDERR, "MALFORMED [{$where}]: missing or empty '{$required}'.\n");
                $malformed++;
                continue 2;
            }
        }
        if (!in_array($e['source'], VALID_SOURCES, true)) {
            fwrite(STDERR, "MALFORMED [{$where}]: source must be one of " . implode('|', VALID_SOURCES) . ".\n");
            $malformed++;
            continue;
        }
        $known = array_merge(CLOSED_DISPOSITIONS, OPEN_DISPOSITIONS);
        if (!in_array($e['disposition'], $known, true)) {
            fwrite(STDERR, "MALFORMED [{$where}]: disposition must be one of " . implode('|', $known) . ".\n");
            $malformed++;
            continue;
        }
        // A closed entry must say what was done -- "closed with no reason" is how a queue rots.
        if (in_array($e['disposition'], CLOSED_DISPOSITIONS, true)
            && (!isset($e['resolution']) || trim((string)$e['resolution']) === '')) {
            fwrite(STDERR, "MALFORMED [{$where}]: disposition '{$e['disposition']}' needs a 'resolution'.\n");
            $malformed++;
            continue;
        }

        $out[] = [
            'key' => $e['key'],
            'source' => $e['source'],
            'lang' => isset($e['lang']) && $e['lang'] !== '' ? $e['lang'] : null,
            'complaint' => $e['complaint'],
            'disposition' => $e['disposition'],
            'resolution' => $e['resolution'] ?? '',
        ];
    }

    return $out;
}

function countBy(array $entries, string $field): array
{
    $out = [];
    foreach ($entries as $e) {
        $k = $e[$field] ?? '?';
        $out[$k] = ($out[$k] ?? 0) + 1;
    }
    ksort($out);
    return $out;
}

function summarize(array $counts): string
{
    $parts = [];
    foreach ($counts as $k => $n) {
        $parts[] = "{$k}: {$n}";
    }
    return implode(', ', $parts);
}
