<?php
/**
 * harvest_english_rulings.php — take Tom's marks OFF `dev/new-english-keys.md` and INTO the files
 * that survive a regeneration.
 *
 * **WHY THIS EXISTS.** Tom, 2026-09-06: *"dev/new-english-keys.md: I edited it. I already ruled on
 * many of these. You are losing my rulings."* Third time. The generator already refuses to clobber a
 * hand-edited file (`--write` without `--force`) and already saves a copy when forced, so nothing
 * was being DESTROYED any more -- but a mark sitting in a working-tree file that no script reads is
 * lost in the only sense that matters: he writes it, and he is asked the same question again.
 *
 * The refusal guard answers "can a regeneration destroy his marks". This answers the other half:
 * **"is anything he wrote still sitting only in the markdown"** -- and `--check` is BLOCKING, so the
 * build stops until a mark has a permanent home. That is the ratchet the two earlier guards left off:
 * they made losing a ruling loud, this makes keeping one compulsory.
 *
 * TWO DESTINATIONS, because the file holds two kinds of question:
 *   - the "Questions from the translators" section is SHIPPED strings, and an answer belongs on that
 *     finding in `dev/english-friction/<sprint>.json` as `human_answer` -- verbatim, dated, and
 *     WITHOUT touching `disposition`, because deciding what to DO about an answer is judgement and
 *     this script has none.
 *   - every other section is a new English key, and an answer belongs in
 *     `dev/english-key-rulings.json` keyed on the exact English it was made on, exactly as an
 *     approval already is.
 *
 * **HIS WORDS ARE STORED VERBATIM, NOT REDUCED TO A BOOLEAN.** "OK." and "It's fine as is. Add a
 * _syn per 1." are both readings, and the second carries work. Storing only "approved" would throw
 * away the instruction and re-create the complaint in a new costume. `new_english_keys.php` prints
 * a non-trivial answer back on the key, so the next reader sees what he actually said.
 *
 * **AND AN ANSWER COUNTS AS READ EVEN WHEN IT IS A QUESTION BACK.** A key he has answered must not
 * be put in front of him again; if his answer changes the string, the ruling lapses by itself
 * because it is keyed on the text, and the key reappears -- correctly, as a new string nobody has
 * approved. Self-correcting, so nothing has to be remembered.
 *
 * Usage:
 *   php dev/scripts/harvest_english_rulings.php           # show what is unharvested (advisory)
 *   php dev/scripts/harvest_english_rulings.php --apply   # write it into the two homes
 *   php dev/scripts/harvest_english_rulings.php --check    # BLOCKING: nothing is left in the md
 */

$root = dirname(__DIR__, 2);
$md   = $root . '/dev/new-english-keys.md';
$apply = in_array('--apply', $argv, true);
$check = in_array('--check', $argv, true);

/* The committed copy is the "as generated" side. Outside a git checkout there is nothing to compare
 * against, so there is no such thing as an unharvested mark and the check passes rather than
 * guessing. check_all.sh always runs in one. */
$lines = array(); $rc = 1;
@exec('git -C ' . escapeshellarg($root) . ' show HEAD:dev/new-english-keys.md 2>/dev/null', $lines, $rc);
if ($rc !== 0) { echo "harvest: no committed dev/new-english-keys.md to compare against — nothing to do.\n"; exit(0); }
$committed = implode("\n", $lines);
if (!is_file($md)) { echo "harvest: dev/new-english-keys.md is absent — nothing to do.\n"; exit(0); }

/**
 * Parse the file into entries. An entry opens on `- **`key`**`, its English is the `  > ` block, and
 * everything after that block up to the next entry or heading is the MARK AREA -- the flag, or a
 * previous `_Ruled ..._` line, or whatever a human wrote over them. The friction section's
 * `*The finding:*` and numbered readings sit inside the mark area and are stripped by shape, because
 * they are generated and a human never writes them.
 */
function ecParseRulingsMd(string $text): array
{
    $out = array();
    $section = '';
    $key = null; $val = array(); $mark = array(); $inVal = false;
    /* **KEYED ON SECTION *AND* KEY, because a key can appear TWICE in this file** -- once as a
     * translators' question about the shipped string and once as a new key awaiting approval.
     * Keying on the name alone let the second occurrence overwrite the first, and three of Tom's
     * six answers to the translators vanished in the parse. */
    $flush = function () use (&$out, &$key, &$val, &$mark, &$section) {
        if ($key === null) { return; }
        $out[$section . '/' . $key] = array(
            'key'     => $key,
            'section' => $section,
            'value'   => implode("\n", $val),
            'mark'    => trim(implode("\n", $mark)),
        );
        $key = null; $val = array(); $mark = array();
    };
    foreach (preg_split('/\r\n|\n|\r/', $text) as $line) {
        if (preg_match('/^##+\s*(.*)$/', $line, $m)) {
            $flush();
            $section = (strpos($m[1], 'Questions from the translators') !== false
                || strpos($m[1], 'from sprint ') === 0) ? 'friction' : 'newkey';
            /* `### from sprint X` sits inside the translators' section and must not reset it. */
            if (strpos($m[1], 'from sprint ') === 0) { $section = 'friction'; }
            continue;
        }
        if (preg_match('/^- \*\*`([a-z0-9_]+)`\*\*\s*$/', $line, $m)) {
            $flush();
            $key = $m[1]; $inVal = true;
            continue;
        }
        if ($key === null) { continue; }
        if ($inVal && preg_match('/^  > ?(.*)$/', $line, $m)) { $val[] = $m[1]; continue; }
        $inVal = false;
        if (trim($line) === '') { continue; }
        /* **GENERATED FURNITURE INSIDE THE MARK AREA. EVERY LINE THE GENERATOR CAN EMIT HERE MUST
         * BE LISTED, or the harvester reads its own output as somebody's handwriting.** That is not
         * hypothetical: `**What this asks for:**` and `*The proposal:*` were added to
         * new_english_keys.php the same day this list was written and NOT added here, so the very
         * next run reported a generated paragraph as an unharvested ruling and failed the build.
         * A line added to ecAskLine() or ecFrictionSection() belongs in this list in the same edit. */
        if (preg_match('/^  \*The finding:\*/', $line)) { continue; }
        if (preg_match('/^  \*\*What this asks for:\*\*/', $line)) { continue; }
        if (preg_match('/^  \*The proposal:\*/', $line)) { continue; }
        if (preg_match('/^  \d+\. /', $line)) { continue; }
        $mark[] = trim($line);
    }
    $flush();
    return $out;
}

$now  = ecParseRulingsMd(file_get_contents($md));
$was  = ecParseRulingsMd($committed);

/* A mark is HUMAN when it is neither the flag nor a rendered ruling line. */
$isGenerated = function (string $mark): bool {
    if ($mark === '' || $mark === '@@ NEEDS RULING') { return true; }
    return (bool) preg_match('/^_Ruled\b.*_$/s', $mark);
};

$rulingsFile = $root . '/dev/english-key-rulings.json';
$doc = json_decode((string) file_get_contents($rulingsFile), true);
if (!is_array($doc) || !isset($doc['rulings'])) { fwrite(STDERR, "harvest: cannot read $rulingsFile\n"); exit(1); }

/* Every friction entry, indexed by key, so an answer finds its finding without a second list. */
$friction = array();
$frictionAll = array();
foreach (glob($root . '/dev/english-friction/*.json') as $f) {
    $j = json_decode((string) file_get_contents($f), true);
    if (!is_array($j) || empty($j['entries'])) { continue; }
    foreach ($j['entries'] as $i => $e) {
        /* **THE "IS IT STORED" INDEX IGNORES DISPOSITION AND THE "WHERE DO I WRITE IT" INDEX DOES
         * NOT.** An answer is written onto the finding that is still being asked; but once it is
         * written, somebody dispositions that finding, and asking only the open ones after that
         * would report the answer as unharvested for ever. Two questions, two indexes. */
        if (isset($e['key']) && isset($e['human_answer'])) {
            $frictionAll[$e['key']][] = trim((string) $e['human_answer']);
        }
        /* **ONLY THE FINDINGS STILL BEING ASKED.** A key can carry findings from four past sprints;
         * an answer given today is an answer to the one that is still open, and stamping it onto
         * three settled entries rewrites history that was decided for other reasons. */
        $d = isset($e['disposition']) ? (string) $e['disposition'] : 'open';
        if ($d !== 'open' && $d !== 'refer-to-human') { continue; }
        if (isset($e['key'])) { $friction[$e['key']][] = array($f, $i); }
    }
}

/** The English a key holds right now, or null. Read from source so a stale parse cannot hide an edit. */
function ecLiveEnglish(string $root, string $key): ?string
{
    static $lang = null;
    if ($lang === null) {
        $lang = array();
        $src = (string) file_get_contents($root . '/lib/lang.ec.en.php');
        if (preg_match_all("/\\\$ec_lang\\['([a-z0-9_]+)'\\]='((?:[^'\\\\]|\\\\.)*)';/", $src, $m, PREG_SET_ORDER)) {
            foreach ($m as $hit) { $lang[$hit[1]] = str_replace(array("\\'", '\\\\'), array("'", '\\'), $hit[2]); }
        }
    }
    return isset($lang[$key]) ? $lang[$key] : null;
}

/**
 * Is this mark already written into one of the two homes, verbatim?
 *
 * **BOTH HALVES MUST MATCH, and the first version got that wrong in a way its own selftest caught.**
 * It answered "yes" whenever the key carried ANY ruling, so a NEW mark written over an OLD approval
 * -- Tom changing his mind, which is the most valuable mark there is -- read as already harvested
 * and was dropped. A ruling counts only when its stored answer IS this mark and it was made on THIS
 * English.
 */
function ecMarkIsStored(string $key, array $e, array $rulings, array $frictionAll): bool
{
    if (isset($rulings[$key]['answer']) && trim((string)$rulings[$key]['answer']) === $e['mark']
        && isset($rulings[$key]['on']) && $rulings[$key]['on'] === $e['value']) { return true; }
    if (isset($frictionAll[$key]) && in_array($e['mark'], $frictionAll[$key], true)) { return true; }
    return false;
}

$pending = array(); $edits = array();
foreach ($now as $id => $e) {
    $k = $e['key'];
    $before = isset($was[$id]) ? $was[$id] : null;
    /* An English EDIT: he rewrote the quoted string itself. That is not a ruling and this script
     * must not apply it -- it is one wording change across lang.ec.en.php and its JS fallback, which
     * is a person's edit. Reported so it cannot be walked past.
     *
     * **OUTSTANDING IS MEASURED AGAINST lang.ec.en.php, NOT AGAINST THE COMMITTED MARKDOWN.** The
     * markdown is generated FROM the language file, so once his wording is applied the two agree by
     * construction and the edit clears itself. Comparing against HEAD instead kept reporting an
     * applied edit until somebody committed the regenerated list, which makes --check fail for
     * having done the work. */
    if ($before !== null && $before['value'] !== $e['value']) {
        $live = ecLiveEnglish($root, $k);
        if ($live === null || $live !== $e['value']) {
            $edits[$k] = array('was' => $before['value'], 'now' => $e['value']);
        }
    }
    if ($isGenerated($e['mark'])) { continue; }
    if ($before !== null && $before['mark'] === $e['mark']) { continue; }  // already there when generated
    /* **THE TEST IS "DOES A PERMANENT HOME ALREADY HOLD THIS MARK", NOT "HAS THE FILE CHANGED".**
     * The first version asked the second question, comparing disk against HEAD, and so went on
     * reporting fifty unharvested marks after harvesting all fifty -- which would have made
     * --check unpassable until the regenerated file was committed, i.e. exactly backwards. Asking
     * the destination makes this idempotent: run it twice and the second run has nothing to do. */
    if (ecMarkIsStored($k, $e, $doc['rulings'], $frictionAll)) { continue; }
    $pending[$id] = $e;
}

if (!$pending && !$edits) {
    echo "harvest: nothing unharvested in dev/new-english-keys.md.\n";
    exit(0);
}

if ($check) {
    fwrite(STDERR, "UNHARVESTED RULINGS: dev/new-english-keys.md carries " . count($pending) . " mark(s)\n");
    fwrite(STDERR, "and " . count($edits) . " English edit(s) that exist nowhere else.\n\n");
    foreach ($pending as $e) { fwrite(STDERR, "    " . $e['key'] . "  →  " . preg_replace('/\s+/', ' ', $e['mark']) . "\n"); }
    foreach ($edits as $k => $d) { fwrite(STDERR, "    $k  EDITED English (apply to lib/lang.ec.en.php by hand)\n"); }
    fwrite(STDERR, "\n    php dev/scripts/harvest_english_rulings.php --apply\n\n");
    fwrite(STDERR, "Regenerating the file would put every one of these questions back in front of Tom\n");
    fwrite(STDERR, "unanswered. That has now happened three times; this check is why it will not again.\n");
    exit(1);
}

$date = date('Y-m-d');
$touched = array();
foreach ($pending as $e) {
    $k = $e['key'];
    $answer = $e['mark'];
    if ($e['section'] === 'friction' && isset($friction[$k])) {
        foreach ($friction[$k] as $hit) {
            list($file, $i) = $hit;
            if (!$apply) { echo "friction  $k  ($file)  ←  $answer\n"; continue; }
            $j = json_decode((string) file_get_contents($file), true);
            $j['entries'][$i]['human_answer'] = $answer;
            $j['entries'][$i]['human_answered'] = $date;
            file_put_contents($file, json_encode($j, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
            $touched[$file] = true;
            echo "friction  $k  →  " . basename($file) . "\n";
        }
        continue;
    }
    if (!$apply) { echo "ruling    $k  ←  $answer\n"; continue; }
    $doc['rulings'][$k] = array('on' => $e['value'], 'ruled' => $date, 'answer' => $answer);
    echo "ruling    $k  →  english-key-rulings.json\n";
}
foreach ($edits as $k => $d) {
    echo "EDIT      $k  — Tom rewrote the English; apply it to lib/lang.ec.en.php by hand:\n";
    echo "            was: " . preg_replace('/\s+/', ' ', $d['was']) . "\n";
    echo "            now: " . preg_replace('/\s+/', ' ', $d['now']) . "\n";
}
if ($apply) {
    ksort($doc['rulings']);
    file_put_contents($rulingsFile, json_encode($doc, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
    echo "\nharvested " . count($pending) . " mark(s). " . count($edits) . " English edit(s) still need a hand.\n";
} else {
    echo "\n" . count($pending) . " mark(s) unharvested. Add --apply to write them.\n";
}
exit(0);
