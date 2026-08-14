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

/**
 * A coarse fingerprint of what KIND of string this is, so a change of ROLE can be told apart from
 * a change of wording. Added 2026-08-13 after lpn_settings_scope_project shipped wrong in the four
 * highest-use languages: the key had been 'Saved with this project.' (a note) and became 'Project
 * settings' (a heading beside 'Calculator settings'). es/fr/pt/tr were translated from the note and
 * still read as a sentence where a heading belongs. A hash saw that as "some edit"; nothing said
 * "this string stopped being a sentence", which is the signal a translator needed.
 *
 * Deliberately crude -- word count and terminal punctuation. It is a smoke alarm, not a parser.
 */
function string_shape(string $v): array
{
    $plain = trim(strip_tags($v));
    return [
        'words' => $plain === '' ? 0 : count(preg_split('/\s+/u', $plain)),
        'ends_sentence' => (bool)preg_match('/[.!?:]$/u', $plain),
    ];
}

/** key => shape for the current English source. */
function current_shapes(): array
{
    $out = [];
    foreach (load_ec_lang(EN_FILE) as $k => $v) {
        $out[$k] = string_shape((string)$v);
    }
    return $out;
}

/** Whatever shapes the manifest recorded. Empty for a manifest written before this existed. */
function load_shapes(): array
{
    if (!is_file(MANIFEST)) {
        return [];
    }
    $data = json_decode(file_get_contents(MANIFEST), true);
    return is_array($data['shapes'] ?? null) ? $data['shapes'] : [];
}

/**
 * Did this key change ROLE, not merely wording? Two signals, either one is enough:
 *   - it gained or lost terminal sentence punctuation (note <-> label), or
 *   - its length changed by more than half (a heading rewritten as prose, or the reverse).
 * Returns '' when the shape is unchanged or unknowable.
 */
function role_change(array $was, array $now): string
{
    if (!$was) {
        return '';
    }
    if ($was['ends_sentence'] !== $now['ends_sentence']) {
        return $now['ends_sentence']
            ? 'became a sentence (gained terminal punctuation) — was it a label before?'
            : 'stopped being a sentence (lost terminal punctuation) — is it a heading or label now?';
    }
    $a = max(1, (int)$was['words']);
    $b = max(1, (int)$now['words']);
    if ($b >= $a * 2 || $a >= $b * 2) {
        return "length changed sharply ({$was['words']} → {$now['words']} words) — check it still plays the same role";
    }
    return '';
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
function write_manifest(array $hashes, array $notes = [], string $updated = '', array $shapes = null): void
{
    ksort($hashes);
    if ($shapes === null) {
        $shapes = load_shapes();
    }
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
    if ($shapes) {
        ksort($shapes);
        $payload['shapes'] = $shapes;
    }
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

// --baseline-new [--except=k1,k2] : fold NEW keys into the manifest after a sprint has translated
// them. Closes a deadlock that made the tripwire blind to its own successes: a key added and
// translated in a sprint stays NEW forever, because only --update baselines it and --update is
// refused while any drift is open. A later English edit to such a key is then invisible to BOTH
// tools -- the payload delta sees a translated key and says nothing, and the drift report files it
// under NEW rather than CHANGED. Found 2026-08-13, when 'EPANET engine' -> 'EPANET solver' across
// five keys produced a delta of zero and no CHANGED flag, despite 26 stale translations.
//
// --except is not optional politeness: it is how you exclude a key whose English you edited AFTER
// the sprint, which is stale and must stay visible.
if ($mode === '--baseline-new') {
    if (!$manifest) {
        fwrite(STDERR, "No manifest yet. Run --update first.\n");
        exit(2);
    }
    $except = [];
    foreach (array_slice($argv, 1) as $arg) {
        if (strpos($arg, '--except=') === 0) {
            $except = array_values(array_filter(array_map('trim', explode(',', substr($arg, strlen('--except='))))));
        }
    }
    $d = diff($current, $manifest);
    $shapes = load_shapes();
    $nowShapes = current_shapes();
    $added = [];
    foreach ($d['new'] as $k) {
        if (in_array($k, $except, true)) {
            continue;
        }
        $manifest[$k] = $current[$k];
        $shapes[$k] = $nowShapes[$k];
        $added[] = $k;
    }
    if (!$added) {
        echo "Nothing to baseline: no NEW keys" . ($except ? " outside the --except list" : "") . ".\n";
        exit(0);
    }
    $notes = load_notes();
    $notes[] = [
        'date' => date('Y-m-d'),
        'keys' => $added,
        'reason' => '[--baseline-new] translated by a completed sprint; folded into the manifest so a '
            . 'later English edit shows up as CHANGED'
            . ($except ? '. Held back as still-stale: ' . implode(', ', $except) : ''),
    ];
    $syncDate = json_decode(file_get_contents(MANIFEST), true)['updated'] ?? '';
    write_manifest($manifest, $notes, $syncDate, $shapes);
    echo "Baselined " . count($added) . " NEW key(s) as translated.\n";
    if ($except) {
        echo "Held back " . count($except) . " key(s) you named as still stale:\n";
        foreach ($except as $k) {
            echo "  ! $k\n";
        }
        echo "These stay in NEW until a resync translates them; baseline them then.\n";
    }
    exit(0);
}

// --record-shapes : back-fill the shape fingerprints WITHOUT re-baselining any hash.
// Safe by construction: it records shapes only for keys whose hash already matches the manifest,
// so what it writes is genuinely "the shape as of the last sync". A CHANGED key is skipped --
// its old shape is unrecoverable, and guessing it would be worse than admitting the gap.
if ($mode === '--record-shapes') {
    if (!$manifest) {
        fwrite(STDERR, "No manifest yet. Run --update first.\n");
        exit(2);
    }
    $d = diff($current, $manifest);
    $shapes = load_shapes();
    $nowShapes = current_shapes();
    $added = 0;
    $skipped = [];
    foreach ($manifest as $k => $h) {
        if (in_array($k, $d['changed'], true)) {
            $skipped[] = $k;
            continue;
        }
        if (!isset($shapes[$k]) && isset($nowShapes[$k])) {
            $shapes[$k] = $nowShapes[$k];
            $added++;
        }
    }
    $syncDate = json_decode(file_get_contents(MANIFEST), true)['updated'] ?? '';
    write_manifest($manifest, load_notes(), $syncDate, $shapes);
    echo "Recorded shapes for $added in-sync key(s). No hash was re-baselined.\n";
    if ($skipped) {
        echo "Skipped " . count($skipped) . " CHANGED key(s) — their pre-drift shape is unrecoverable:\n";
        foreach ($skipped as $k) {
            echo "  ! $k\n";
        }
        echo "Role-change detection starts working for those once they are resynced.\n";
    }
    exit(0);
}

if ($mode === '--update') {
    $existed = is_file(MANIFEST);
    $d = diff($current, $manifest);

    // A full re-baseline over keys that are still CHANGED erases the only record that a resync was
    // owed. That is not hypothetical: lpn_settings_scope_project changed role from a note to a
    // heading, four languages were never resynced, the manifest was re-baselined anyway, and the
    // tripwire forgot. Tom found it by eye months later. So the blanket --update now refuses, and
    // erasing the evidence has to be a deliberate, reasoned act.
    $force = in_array('--force', array_slice($argv, 1), true);
    if ($existed && $d['changed'] && !$force) {
        fwrite(STDERR, "REFUSED: " . count($d['changed']) . " key(s) are still CHANGED and would be silently re-baselined.\n\n");
        foreach ($d['changed'] as $k) {
            fwrite(STDERR, "  ! $k\n");
        }
        fwrite(STDERR, "\n--update means \"every flagged key has been resynced\". If that is true, say so per key:\n");
        fwrite(STDERR, "    php detect_english_drift.php --update=<key> --reason=\"...\"\n");
        fwrite(STDERR, "  which checks each one and records why. To re-baseline everything anyway and\n");
        fwrite(STDERR, "  discard these signals, pass --force --reason=\"...\".\n");
        exit(2);
    }
    if ($force && $reason === '') {
        fwrite(STDERR, "REFUSED: --force discards " . count($d['changed']) . " drift signal(s); it needs --reason=\"...\".\n");
        exit(2);
    }
    $notes = load_notes();
    if ($force && $d['changed']) {
        $notes[] = [
            'date' => date('Y-m-d'),
            'keys' => $d['changed'],
            'reason' => '[--force] ' . $reason,
        ];
    }
    write_manifest($current, $notes, '', current_shapes());
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
    $wasShapes = load_shapes();
    $nowShapes = current_shapes();
    $roleChanges = [];
    foreach ($d['changed'] as $k) {
        $why = role_change($wasShapes[$k] ?? [], $nowShapes[$k] ?? ['words' => 0, 'ends_sentence' => false]);
        echo "  ! $k" . ($why ? "   ← ROLE CHANGE" : "") . "\n";
        if ($why) {
            $roleChanges[$k] = $why;
        }
    }
    echo "  → Feed these to a resync sprint (semantic per-language read vs current English),\n";
    echo "    then run --update once every language is brought into sync.\n";
    if ($roleChanges) {
        echo "\n  ROLE CHANGES (" . count($roleChanges) . ") — these are the expensive kind. A key that stops\n";
        echo "  being a sentence, or doubles in length, has changed what it IS, and a translation\n";
        echo "  written against the old role reads wrong even when the words are right:\n";
        foreach ($roleChanges as $k => $why) {
            echo "    ! $k: $why\n";
        }
        echo "  Resync these first, and read the sibling keys beside them — a heading has siblings\n";
        echo "  it must stay parallel with.\n";
    }
    if (!$wasShapes) {
        echo "\n  (No shapes recorded in the manifest yet, so role changes cannot be detected for\n";
        echo "   these. The next --update will record them.)\n";
    }
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
