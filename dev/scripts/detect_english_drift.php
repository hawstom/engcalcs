<?php
/**
 * detect_english_drift.php — English-source staleness tripwire.
 *
 * THE BLIND SPOT THIS CLOSES: the translation payload-delta
 * (generate_translation_payloads.php) only sees keys that are MISSING in a
 * language file. It is blind to a key whose English value was CHANGED after a
 * translation was already written — the translation is present, so it never
 * surfaces as a delta, yet it now faithfully translates an obsolete English
 * string. That exact "stale-but-present" pattern caused Task 129 (and forced
 * Tasks 129/130/131 to be driven off hand-built key lists). See
 * dev/translation-execution-log.md and CLAUDE.md § "Translation Sprints".
 *
 * HOW IT WORKS: a checked-in manifest (english_string_hashes.json) records the
 * sha1 of every $ec_lang value in lang.ec.en.php AS OF THE LAST FULL SYNC.
 * When an English value changes, its hash diverges from the manifest and the
 * key is flagged CHANGED — i.e. "translations of this key may now be stale,
 * feed it to a resync." NEW/REMOVED keys are reported for information only
 * (NEW keys are already caught by the payload-delta).
 *
 * WORKFLOW:
 *   1. php detect_english_drift.php            # human report of drift
 *   2. php detect_english_drift.php --check     # same, exits non-zero if any CHANGED (gate/CI)
 *   3. php detect_english_drift.php --json       # bare list of CHANGED keys, for a resync key-list
 *   4. ...run a resync sprint over the CHANGED keys across all 26 languages...
 *   5. php detect_english_drift.php --update     # re-baseline the manifest to current English
 *
 * The manifest represents "English as it stood when translations were last
 * brought into sync." Only run --update once a resync of the flagged keys is
 * actually complete, or you will silently baseline away real drift.
 *
 * Scope: $ec_lang display strings only (not $ec_lang_intent — intent is
 * translator metadata, not a shipped translated string).
 */

const LANG_DIR = __DIR__ . '/../../lib';
const EN_FILE = LANG_DIR . '/lang.ec.en.php';
const MANIFEST = __DIR__ . '/english_string_hashes.json';

/** Load $ec_lang from a lang file in an isolated scope. */
function load_ec_lang(string $file): array
{
    $ec_lang = [];
    include $file;
    if (!is_array($ec_lang)) {
        fwrite(STDERR, "ERROR: $file did not produce an \$ec_lang array\n");
        exit(2);
    }
    return $ec_lang;
}

/** key => sha1(value) for the current English source. */
function current_hashes(): array
{
    $out = [];
    foreach (load_ec_lang(EN_FILE) as $k => $v) {
        $out[$k] = sha1((string)$v);
    }
    return $out;
}

function load_manifest(): array
{
    if (!is_file(MANIFEST)) {
        return [];
    }
    $data = json_decode(file_get_contents(MANIFEST), true);
    return is_array($data['hashes'] ?? null) ? $data['hashes'] : [];
}

function write_manifest(array $hashes): void
{
    ksort($hashes);
    $payload = [
        'description' => 'sha1 of each lang.ec.en.php $ec_lang value as of the last full translation sync. '
            . 'Maintained by detect_english_drift.php --update. A current-vs-manifest hash mismatch means '
            . 'that key\'s English changed and translations may be stale. Do not hand-edit.',
        'updated' => date('Y-m-d'),
        'count' => count($hashes),
        'hashes' => $hashes,
    ];
    file_put_contents(MANIFEST, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
}

/** @return array{changed:string[],new:string[],removed:string[]} */
function diff(array $current, array $manifest): array
{
    $changed = $new = $removed = [];
    foreach ($current as $k => $h) {
        if (!array_key_exists($k, $manifest)) {
            $new[] = $k;
        } elseif ($manifest[$k] !== $h) {
            $changed[] = $k;
        }
    }
    foreach ($manifest as $k => $h) {
        if (!array_key_exists($k, $current)) {
            $removed[] = $k;
        }
    }
    sort($changed);
    sort($new);
    sort($removed);
    return ['changed' => $changed, 'new' => $new, 'removed' => $removed];
}

// ---- main ----
$mode = $argv[1] ?? '';
$current = current_hashes();
$manifest = load_manifest();

if ($mode === '--update') {
    $existed = is_file(MANIFEST);
    write_manifest($current);
    $d = diff($current, $manifest);
    if (!$existed) {
        echo "Manifest created: " . MANIFEST . " (" . count($current) . " English keys baselined).\n";
    } else {
        echo "Manifest re-baselined to current English.\n";
        echo "  re-synced (was CHANGED): " . count($d['changed'])
            . " | added (was NEW): " . count($d['new'])
            . " | dropped (was REMOVED): " . count($d['removed']) . "\n";
    }
    exit(0);
}

if (!$manifest) {
    fwrite(STDERR, "No manifest found. Run:  php " . basename(__FILE__) . " --update   to baseline it first.\n");
    exit(2);
}

$d = diff($current, $manifest);

if ($mode === '--json') {
    echo json_encode($d['changed'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    exit($d['changed'] ? 1 : 0);
}

// human report
$manifestDate = json_decode(file_get_contents(MANIFEST), true)['updated'] ?? 'unknown';
echo "English drift vs manifest (last synced: $manifestDate)\n";
echo str_repeat('-', 60) . "\n";

if ($d['changed']) {
    echo "CHANGED — English edited since last sync; translations may be STALE (" . count($d['changed']) . "):\n";
    foreach ($d['changed'] as $k) {
        echo "  ! $k\n";
    }
    echo "  → Feed these to a resync sprint (semantic per-language read vs current English),\n";
    echo "    then run --update once every language is brought into sync.\n";
} else {
    echo "CHANGED: none — every synced English string is unchanged.\n";
}

if ($d['new']) {
    echo "\nNEW — added since last sync (already caught by the payload-delta) (" . count($d['new']) . "):\n";
    foreach ($d['new'] as $k) {
        echo "  + $k\n";
    }
}
if ($d['removed']) {
    echo "\nREMOVED — no longer in English (" . count($d['removed']) . "):\n";
    foreach ($d['removed'] as $k) {
        echo "  - $k\n";
    }
}

echo "\n";
// --check gates on CHANGED only (the staleness signal); NEW/REMOVED are informational.
if ($mode === '--check') {
    exit($d['changed'] ? 1 : 0);
}
exit(0);
