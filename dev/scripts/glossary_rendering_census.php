<?php
/**
 * glossary_rendering_census.php — what each language ACTUALLY SHIPPED for each glossary term.
 *
 *   php dev/scripts/glossary_rendering_census.php                 # the worklist: split renderings
 *   php dev/scripts/glossary_rendering_census.php --lang=ps       # one language
 *   php dev/scripts/glossary_rendering_census.php --term=valve    # one term, every language
 *   php dev/scripts/glossary_rendering_census.php --term=valve --lang=ps --sites
 *   php dev/scripts/glossary_rendering_census.php --json          # machine-readable, everything
 *
 * WHY IT EXISTS. A translation sprint's glossary write-back has always depended on 26 agents
 * REPORTING what they chose, and that reasoning lives in a transcript nobody keeps. Sprint 459
 * closed without the write-back and the transcript is gone. But the choices themselves are not
 * gone: what each language shipped is on disk, in `lib/lang.ec.??.php`, and is countable.
 *
 * THE METHOD IS THE PASHTO AGENT'S OWN, generalized. During sprint 316 it noticed that its file
 * held two words for "valve" -- والو in every `lpn_` string and سوپاپ in the older `hw_`/`bpn_`/
 * `mphl_` ones -- COUNTED them, 46 to 7, kept the incumbent and reported the split instead of
 * silently harmonising. That is a measurement, not a memory, and it is repeatable:
 *
 *   1. The ENGLISH file says which keys are about a term: every key whose English value contains
 *      the term. Those are the term's SITES.
 *   2. A language's rendering of the term should appear at those sites. Counting how many it
 *      reaches is the term's COVERAGE in that language.
 *   3. Where it does not reach, something else is standing in its place. The words that recur
 *      across the MISSES, and that are not ordinary words of the language, are the COMPETING
 *      renderings -- and they come with their own counts.
 *
 * WHAT IT IS NOT. It is a census, not a judge. A count is evidence about usage; it is not evidence
 * about which word a water engineer would say. Two renderings at 46 and 7 is a finding; two at 4
 * and 3 is a coin toss with a nice table around it, and the report says so rather than picking.
 * Nothing here writes to glossary.json -- a human (or an agent that has read the strings) decides,
 * and records the decision in that term's `translation_notes`, which is where every other decision
 * already lives. There is no `preferred_translation` field and this script must not invent one.
 *
 * KNOWN APPROXIMATIONS, all deliberate and all reported rather than hidden:
 *   - INFLECTION. Russian's «широта» is «широты», «широтой», «широте» in the strings that use it.
 *     A substring test misses those, so the script also tries a STEM (the rendering minus its last
 *     couple of characters) and labels any hit it only gets that way. A stem hit is weaker
 *     evidence than an exact hit and is counted separately, never merged.
 *   - SCRIPTS WITHOUT SPACES. zh, km, my (and ja/th/lo, listed for the day they arrive) are
 *     tokenized as character n-grams rather than words, so their competitor lists are noisier.
 *   - MULTI-SENSE ENGLISH. "head" is in every hydraulics string and in "headwater" and in
 *     "heading"; "count", "draw" and "project" are ordinary English verbs. Such terms produce many
 *     sites and weak signal. The default view suppresses a term whose competitor evidence is thin.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

$root = dirname(__DIR__, 2);
require_once __DIR__ . '/lang_parse.inc.php';

$opt = array('lang' => null, 'term' => null, 'json' => false, 'sites' => false, 'all' => false, 'min' => 2);
foreach (array_slice($argv, 1) as $a) {
    if (preg_match('/^--lang=(.+)$/', $a, $m))      { $opt['lang'] = $m[1]; }
    elseif (preg_match('/^--term=(.+)$/', $a, $m))  { $opt['term'] = $m[1]; }
    elseif (preg_match('/^--min=(\d+)$/', $a, $m))  { $opt['min'] = (int)$m[1]; }
    elseif ($a === '--json')                        { $opt['json'] = true; }
    elseif ($a === '--sites')                       { $opt['sites'] = true; }
    elseif ($a === '--all')                         { $opt['all'] = true; }
    else {
        fwrite(STDERR, "unknown option: $a\n");
        exit(2);
    }
}

/* Scripts that do not put spaces between words. Their competitor candidates are character
 * n-grams; everything else is tokenized on Unicode word boundaries. */
$NO_SPACE = array('zh', 'ja', 'km', 'my', 'th', 'lo');

// ---------------------------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------------------------
$glossaryPath = __DIR__ . '/glossary.json';
$glossary = json_decode(file_get_contents($glossaryPath), true);
if (!is_array($glossary) || !isset($glossary['terms'])) {
    fwrite(STDERR, "glossary.json did not parse.\n");
    exit(1);
}

$langs = array();
foreach (glob($root . '/lib/lang.ec.*.php') as $path) {
    if (preg_match('/lang\.ec\.([a-z]{2})\.php$/', $path, $m)) { $langs[$m[1]] = $path; }
}
ksort($langs);
if (!isset($langs['en'])) {
    fwrite(STDERR, "lib/lang.ec.en.php is missing.\n");
    exit(1);
}

$values = array();
foreach ($langs as $lang => $path) { $values[$lang] = ecLangValues(file_get_contents($path)); }
$en = $values['en'];
unset($values['en']);
if ($opt['lang'] !== null) {
    if (!isset($values[$opt['lang']])) {
        fwrite(STDERR, "no such language file: {$opt['lang']}\n");
        exit(2);
    }
    $values = array($opt['lang'] => $values[$opt['lang']]);
}

// ---------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------
function ec_lc(string $s): string { return mb_strtolower($s, 'UTF-8'); }

/** str_pad() counts BYTES, and every rendering here is multi-byte. */
function ec_pad(string $s, int $w): string {
    $n = mb_strlen($s, 'UTF-8');
    return $s . ($n < $w ? str_repeat(' ', $w - $n) : '');
}

/** Case-insensitive substring test that also survives the escapes the parser already resolved. */
function ec_has(string $haystack, string $needle): bool {
    if ($needle === '') { return false; }
    return mb_strpos(ec_lc($haystack), ec_lc($needle), 0, 'UTF-8') !== false;
}

/** Occurrences, not just presence -- the Pashto count was 46, not "yes". */
function ec_count(string $haystack, string $needle): int {
    if ($needle === '') { return 0; }
    return mb_substr_count(ec_lc($haystack), ec_lc($needle), 'UTF-8');
}

/**
 * The stem an inflecting language is likely to keep. Two characters off the end of the rendering,
 * never applied to one that is already short. Crude on purpose: it exists to say "this may be the
 * same word declined", and the report always labels a hit it only got this way.
 */
function ec_stem(string $rendering): string {
    $rendering = trim($rendering);
    $len = mb_strlen($rendering, 'UTF-8');
    if ($len < 6) { return ''; }
    return mb_substr($rendering, 0, $len - 2, 'UTF-8');
}

/**
 * IS THIS CANDIDATE A RIVAL WORD, OR THE SAME WORD WEARING A CASE ENDING? Romanian ships "Vană"
 * in the glossary and `vane` in nine strings; Serbian's «шир.» and «ширина» are one word. Without
 * this test the census reports every inflecting language as split with itself, and the real
 * splits -- والو against سوپاپ, which share nothing -- drown in it. A candidate counts as a
 * VARIANT when it agrees with the rendering's last word over a long enough leading run.
 */
function ec_is_variant(string $candidate, string $rendering): bool {
    $words = preg_split('/[^\p{L}\p{N}\p{M}]+/u', ec_lc($rendering), -1, PREG_SPLIT_NO_EMPTY);
    if (!$words) { return false; }
    $candidate = ec_lc($candidate);
    foreach ($words as $w) {
        $wl = mb_strlen($w, 'UTF-8');
        if ($wl < 3) { continue; }
        $need = max(3, (int)ceil($wl * 0.6));
        $shared = 0;
        $max = min($wl, mb_strlen($candidate, 'UTF-8'));
        for ($i = 0; $i < $max; $i++) {
            if (mb_substr($w, $i, 1, 'UTF-8') !== mb_substr($candidate, $i, 1, 'UTF-8')) { break; }
            $shared++;
        }
        if ($shared >= $need) { return true; }
    }
    return false;
}

/** The English needles for a term: the term itself minus any parenthetical, plus a naive plural. */
function ec_needles(string $term): array {
    $base = trim(preg_replace('/\s*\([^)]*\)/', '', $term));
    if ($base === '') { return array(); }
    $out = array($base);
    if (!preg_match('/s$/i', $base)) { $out[] = $base . 's'; }
    if (preg_match('/y$/i', $base)) { $out[] = preg_replace('/y$/i', 'ies', $base); }
    return $out;
}

function ec_tokens(string $s, string $lang, array $noSpace): array {
    $s = ec_lc(strip_tags($s));
    if (in_array($lang, $noSpace, true)) {
        $chars = preg_split('//u', preg_replace('/[^\p{L}\p{N}]+/u', '', $s), -1, PREG_SPLIT_NO_EMPTY);
        $out = array();
        $n = count($chars);
        for ($size = 2; $size <= 4; $size++) {
            for ($i = 0; $i + $size <= $n; $i++) { $out[] = implode('', array_slice($chars, $i, $size)); }
        }
        return array_unique($out);
    }
    $parts = preg_split('/[^\p{L}\p{N}\p{M}]+/u', $s, -1, PREG_SPLIT_NO_EMPTY);
    $out = array();
    foreach ($parts as $p) { if (mb_strlen($p, 'UTF-8') >= 3) { $out[] = $p; } }
    return array_unique($out);
}

// ---------------------------------------------------------------------------------------------
// Per-language stopword floor: a token in a large share of a language's strings carries no signal.
// ---------------------------------------------------------------------------------------------
$docFreq = array();
$docCount = array();
foreach ($values as $lang => $vals) {
    $docFreq[$lang] = array();
    $docCount[$lang] = count($vals);
    foreach ($vals as $v) {
        foreach (ec_tokens($v, $lang, $NO_SPACE) as $t) {
            $docFreq[$lang][$t] = ($docFreq[$lang][$t] ?? 0) + 1;
        }
    }
}

// ---------------------------------------------------------------------------------------------
// The census
// ---------------------------------------------------------------------------------------------
$report = array();
$unmeasurable = array();
$cells = 0;
$cellsAbsent = 0;
$cellsSplit = 0;
$cellsClean = 0;
$noRendering = 0;

foreach ($glossary['terms'] as $tid => $term) {
    if (!isset($term['term'])) { continue; }
    $name = $term['term'];
    if ($opt['term'] !== null && stripos($name, $opt['term']) === false) { continue; }

    $needles = ec_needles($name);
    $siteKeys = array();
    foreach ($en as $k => $v) {
        if (!is_string($v)) { continue; }
        foreach ($needles as $n) {
            if (preg_match('/(?<![\p{L}])' . preg_quote($n, '/') . '(?![\p{L}])/iu', $v)) { $siteKeys[] = $k; break; }
        }
    }
    if (!$siteKeys) { $unmeasurable[] = $name; continue; }

    $entry = array('id' => $tid, 'term' => $name, 'sites' => count($siteKeys), 'langs' => array());

    foreach ($values as $lang => $vals) {
        $rendering = isset($term['translations'][$lang]) ? trim($term['translations'][$lang]) : '';
        $cells++;
        if ($rendering === '') { $noRendering++; }
        $stem = ec_stem($rendering);

        $exact = 0; $stemOnly = 0; $occ = 0; $missKeys = array();
        $byPrefix = array();
        foreach ($siteKeys as $k) {
            if (!isset($vals[$k]) || $vals[$k] === '') { continue; }   // absent = English fallback
            $prefix = (strpos($k, '_') !== false) ? substr($k, 0, strpos($k, '_') + 1) : '(none)';
            if ($rendering !== '' && ec_has($vals[$k], $rendering)) {
                $exact++;
                $occ += ec_count($vals[$k], $rendering);
                $byPrefix[$prefix]['hit'] = ($byPrefix[$prefix]['hit'] ?? 0) + 1;
            } elseif ($stem !== '' && ec_has($vals[$k], $stem)) {
                $stemOnly++;
                $byPrefix[$prefix]['stem'] = ($byPrefix[$prefix]['stem'] ?? 0) + 1;
            } else {
                $missKeys[] = $k;
                $byPrefix[$prefix]['miss'] = ($byPrefix[$prefix]['miss'] ?? 0) + 1;
            }
        }

        /* Occurrences anywhere in the file, including strings the English does not mark as sites.
         * This is the raw "46" number, and a big gap between it and $occ means the rendering is
         * doing work somewhere the English term does not appear. */
        $fileOcc = 0;
        if ($rendering !== '') {
            foreach ($vals as $v) { $fileOcc += ec_count($v, $rendering); }
        }

        /* Competing renderings: what recurs across the misses and is not an ordinary word. */
        $cand = array();
        foreach ($missKeys as $k) {
            foreach (ec_tokens($vals[$k], $lang, $NO_SPACE) as $t) {
                if ($rendering !== '' && ec_has($rendering, $t)) { continue; }
                $cand[$t] = ($cand[$t] ?? 0) + 1;
            }
        }
        $floor = max(3, (int)round($docCount[$lang] * 0.02));
        $competitors = array();
        foreach ($cand as $t => $c) {
            if ($c < 2) { continue; }
            $df = $docFreq[$lang][$t] ?? 0;
            if ($df > $floor && $df > $c * 3) { continue; }        // an ordinary word of the language
            $competitors[$t] = array(
                'at_misses' => $c,
                'in_file'   => $df,
                'kind'      => ($rendering !== '' && ec_is_variant($t, $rendering)) ? 'variant' : 'rival',
            );
        }
        uasort($competitors, function ($a, $b) { return $b['at_misses'] <=> $a['at_misses']; });
        /* A shorter n-gram wholly inside a longer, better-scoring one is the same evidence twice. */
        $kept = array();
        foreach ($competitors as $t => $c) {
            $sub = false;
            foreach ($kept as $k2 => $c2) { if ($c2['at_misses'] >= $c['at_misses'] && ec_has($k2, $t)) { $sub = true; break; } }
            if (!$sub) { $kept[$t] = $c; }
            if (count($kept) >= 3) { break; }
        }

        $rivals = array();
        foreach ($kept as $t => $c) { if ($c['kind'] === 'rival') { $rivals[$t] = $c; } }

        $measured = $exact + $stemOnly + count($missKeys);
        $status = 'clean';
        if ($rendering === '')                       { $status = 'no-rendering'; }
        elseif ($exact === 0 && $stemOnly === 0)     { $status = 'absent'; $cellsAbsent++; }
        elseif ($rivals)                             { $status = 'split'; $cellsSplit++; }
        else                                         { $cellsClean++; }

        $entry['langs'][$lang] = array(
            'rendering'   => $rendering,
            'measured'    => $measured,
            'exact'       => $exact,
            'stem_only'   => $stemOnly,
            'miss'        => count($missKeys),
            'occ_at_sites'=> $occ,
            'occ_in_file' => $fileOcc,
            'by_prefix'   => $byPrefix,
            'competitors' => $kept,
            'miss_keys'   => $missKeys,
            'status'      => $status,
        );
    }
    $report[$tid] = $entry;
}

// ---------------------------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------------------------
if ($opt['json']) {
    echo json_encode(array(
        'summary' => array(
            'terms_total'        => count($glossary['terms']),
            'terms_measurable'   => count($report),
            'terms_unmeasurable' => $unmeasurable,
            'cells'              => $cells,
            'cells_absent'       => $cellsAbsent,
            'cells_split'        => $cellsSplit,
            'cells_clean'        => $cellsClean,
            'cells_no_rendering' => $noRendering,
        ),
        'terms' => $report,
    ), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), "\n";
    exit(0);
}

$shown = 0;
foreach ($report as $entry) {
    $lines = array();
    foreach ($entry['langs'] as $lang => $c) {
        if (!$opt['all'] && !$opt['term']) {
            if ($c['status'] !== 'split') { continue; }
            $top = null;
            foreach ($c['competitors'] as $cc) { if ($cc['kind'] === 'rival') { $top = $cc; break; } }
            if (!$top || $top['at_misses'] < $opt['min']) { continue; }
        }
        if ($opt['term'] && !$opt['all'] && $c['measured'] === 0) { continue; }
        $bits = array();
        $bits[] = ec_pad($lang, 3);
        $bits[] = ec_pad($c['rendering'] === '' ? '(not in glossary)' : $c['rendering'], 22);
        $bits[] = 'sites ' . $c['measured'] . ': ' . $c['exact'] . ' use it'
                . ($c['stem_only'] ? ', ' . $c['stem_only'] . ' inflected' : '')
                . ($c['miss'] ? ', ' . $c['miss'] . ' do not' : '');
        $bits[] = $c['occ_in_file'] . 'x in file';
        $line = '  ' . implode('  |  ', $bits);
        if ($c['competitors']) {
            $cs = array();
            foreach ($c['competitors'] as $t => $n) {
                $cs[] = $t . ' (' . $n['at_misses'] . ' sites, ' . $n['in_file'] . 'x in file'
                      . ($n['kind'] === 'variant' ? ', same word inflected' : '') . ')';
            }
            $line .= "\n        competing: " . implode('; ', $cs);
        }
        if ($opt['sites'] && $c['miss_keys']) {
            $line .= "\n        misses: " . implode(', ', $c['miss_keys']);
        }
        $lines[] = $line;
    }
    if (!$lines) { continue; }
    $shown++;
    echo "\n" . $entry['term'] . '  [' . $entry['sites'] . " English sites]\n";
    echo implode("\n", $lines) . "\n";
}

echo "\n";
echo "GLOSSARY RENDERING CENSUS\n";
echo '  ' . count($glossary['terms']) . ' terms; ' . count($report) . ' measurable from the English strings, '
   . count($unmeasurable) . " with no English site\n";
echo '  ' . $cells . ' term x language cells: ' . $cellsClean . ' clean, ' . $cellsSplit . ' split, '
   . $cellsAbsent . ' rendering never appears, ' . $noRendering . " with no rendering in the glossary\n";
echo '  ' . $shown . " terms listed above\n";
echo "\nA count is evidence of USAGE, not a verdict on the right word. Where two renderings are\n";
echo "close, say so in that term's translation_notes rather than picking one. There is no\n";
echo "preferred_translation field; translation_notes is where the decisions live.\n";
exit(0);
