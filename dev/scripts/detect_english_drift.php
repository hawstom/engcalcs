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
 * NOT EVERY ENGLISH EDIT NEEDS A TRANSLATOR (--update=<key>, ROADMAP Task 227 follow-up).
 * A hash is blind to WHY a string changed. Fixing a dead hyperlink inside a value —
 * `or_notes_3_def`'s engineeringtoolbox URL on 2026-08-08 — flags exactly like a rewritten
 * sentence, and left alone it would send 26 agents off to re-translate a note whose prose never
 * moved. So a single key can be re-baselined on its own:
 *
 *   php detect_english_drift.php --update=or_notes_3_def --reason="URL typo fix, prose unchanged"
 *
 * This is deliberately NOT a way to make an inconvenient flag go away. A URL-only edit still has
 * to be applied to all 27 files — the href lives inside each language's own string — it just
 * needs no translator. So before it will silence anything, the tool checks that every language
 * file's value for that key already carries the same URLs as English, and refuses if any language
 * is still on the old link. That check is the point: "no translator needed" and "nothing left to
 * do" are different claims, and only the first one is being made here.
 *
 * Scope: $ec_lang display strings only (not $ec_lang_syn — intent is
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

/** Whatever partial re-baselines have been recorded, so the history survives a full --update. */
function load_notes(): array
{
    if (!is_file(MANIFEST)) {
        return [];
    }
    $data = json_decode(file_get_contents(MANIFEST), true);
    return is_array($data['partial_updates'] ?? null) ? $data['partial_updates'] : [];
}

/**
 * @param string $updated The date this manifest represents. A PARTIAL re-baseline must pass the
 *   existing date through: 'updated' means "English as of the last FULL sync", and the human
 *   report prints it as such, so stamping today onto a one-key update would claim a sync that
 *   never happened -- the report would read "last synced: today" over 500 keys nobody looked at.
 */
function write_manifest(array $hashes, array $notes = [], string $updated = ''): void
{
    ksort($hashes);
    $payload = [
        'description' => 'sha1 of each lang.ec.en.php $ec_lang value as of the last full translation sync. '
            . 'Maintained by detect_english_drift.php --update. A current-vs-manifest hash mismatch means '
            . 'that key\'s English changed and translations may be stale. Do not hand-edit.',
        'updated' => $updated !== '' ? $updated : date('Y-m-d'),
        'count' => count($hashes),
    ];
    // Kept because a single-key re-baseline is precisely the kind of act that later looks like a
    // mistake -- a key sitting un-flagged with no explanation is indistinguishable from a bug in
    // the tripwire. The reason travels with the manifest.
    if ($notes) {
        $payload['partial_updates'] = $notes;
    }
    $payload['hashes'] = $hashes;
    file_put_contents(MANIFEST, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
}

/** Every URL inside a value, sorted — the part of a string a translator never authors. */
function urls_in(string $value): array
{
    preg_match_all('#https?://[^\s"\'<>]+|(?<=href=")[^"]+#i', $value, $m);
    $urls = array_values(array_unique($m[0]));
    sort($urls);
    return $urls;
}

/**
 * Which languages do NOT yet carry the same URLs as English for this key.
 * A URL-only English edit is still an edit to all 27 files; this is what tells the difference
 * between "already applied everywhere" and "applied in English and forgotten in nine languages".
 * @return array<string,string[]> lang code => the URLs that file actually has
 */
function languages_out_of_step(string $key, string $englishValue): array
{
    require_once __DIR__ . '/lang_parse.inc.php';
    $want = urls_in($englishValue);
    $out = [];
    foreach (glob(LANG_DIR . '/lang.ec.*.php') as $file) {
        $code = substr(basename($file), strlen('lang.ec.'), -strlen('.php'));
        if ($code === 'en') {
            continue;
        }
        $values = ecLangValues(file_get_contents($file));
        // A key absent from a language file is the payload-delta's business, not this check's.
        if (!array_key_exists($key, $values)) {
            continue;
        }
        if (urls_in($values[$key]) !== $want) {
            $out[$code] = urls_in($values[$key]);
        }
    }
    return $out;
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

// --update=<key>[,<key>...] : re-baseline just these, leaving every other drift signal standing.
$partialKeys = [];
$reason = '';
foreach (array_slice($argv, 1) as $arg) {
    if (strpos($arg, '--update=') === 0) {
        $mode = '--update-partial';
        $partialKeys = array_values(array_filter(array_map('trim', explode(',', substr($arg, strlen('--update='))))));
    } elseif (strpos($arg, '--reason=') === 0) {
        $reason = trim(substr($arg, strlen('--reason=')));
    }
}

if ($mode === '--update-partial') {
    if (!$manifest) {
        fwrite(STDERR, "No manifest to update. Run --update first to baseline it.\n");
        exit(2);
    }
    if (!$partialKeys) {
        fwrite(STDERR, "--update= needs at least one key.\n");
        exit(2);
    }
    $english = load_ec_lang(EN_FILE);
    $d = diff($current, $manifest);
    $blocked = false;

    foreach ($partialKeys as $key) {
        if (!array_key_exists($key, $current)) {
            fwrite(STDERR, "REFUSED $key: not a key in lang.ec.en.php.\n");
            $blocked = true;
            continue;
        }
        // Re-baselining a key that is not drifting is always a mistake -- a typo in the key name,
        // or a second run of a command that already succeeded. Either way, say so rather than
        // writing a no-op and reporting success.
        if (!in_array($key, $d['changed'], true)) {
            fwrite(STDERR, "REFUSED $key: not currently CHANGED, so there is nothing to re-baseline.\n");
            $blocked = true;
            continue;
        }
        $stragglers = languages_out_of_step($key, (string)$english[$key]);
        if ($stragglers) {
            fwrite(STDERR, "REFUSED $key: " . count($stragglers) . " language file(s) still carry different URLs.\n");
            fwrite(STDERR, "  English has: " . implode(' ', urls_in((string)$english[$key])) . "\n");
            foreach ($stragglers as $code => $have) {
                fwrite(STDERR, "  $code has: " . ($have ? implode(' ', $have) : '(none)') . "\n");
            }
            fwrite(STDERR, "  Apply the same edit to those files first. 'No translator needed' is not 'nothing left to do'.\n");
            $blocked = true;
        }
    }
    if ($blocked) {
        exit(2);
    }

    $notes = load_notes();
    foreach ($partialKeys as $key) {
        $manifest[$key] = $current[$key];
        echo "re-baselined $key\n";
        echo "  English now: " . preg_replace('/\s+/', ' ', mb_substr((string)$english[$key], 0, 120)) . "\n";
        // State what was actually CHECKED, not what it implies. This path serves two different
        // claims -- "a URL-only edit needs no translator" and "the resync for this key is finished"
        // -- and the earlier wording asserted the first one in both cases, which was false the
        // second time it was used (Task 205(d), where 26 translators had just done the work).
        // The URL check is the only thing the tool verified; the reason is where the human says why.
        echo "  checked: every language file carries the same URLs as English.\n";
    }
    $notes[] = [
        'date' => date('Y-m-d'),
        'keys' => $partialKeys,
        'reason' => $reason !== '' ? $reason : '(none given)',
    ];
    // Carry the last FULL sync date forward -- see write_manifest().
    $syncDate = json_decode(file_get_contents(MANIFEST), true)['updated'] ?? '';
    write_manifest($manifest, $notes, $syncDate);
    $after = diff($current, load_manifest());
    echo "\nStill CHANGED and awaiting a real resync: " . count($after['changed'])
        . ($after['changed'] ? ' (' . implode(', ', $after['changed']) . ')' : '') . "\n";
    if ($reason === '') {
        echo "NOTE: no --reason given. Pass one next time; a silenced key with no explanation is\n";
        echo "      indistinguishable from a bug in the tripwire six months from now.\n";
    }
    exit(0);
}

if ($mode === '--update') {
    $existed = is_file(MANIFEST);
    write_manifest($current, load_notes());
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
