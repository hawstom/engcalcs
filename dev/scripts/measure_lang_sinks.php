<?php
/**
 * Read-only measurement backing ROADMAP Task 140 (HTML in language strings).
 *
 * Classifies every $ec_lang key by (a) what it contains (markup / entities) and
 * (b) which destinations it actually reaches in the code:
 *
 *   raw-html      echoed straight into the page   -> markup OK, entities OK
 *   attr-escaped  htmlspecialchars(...) -> attr    -> markup stripped, entities BREAK
 *   attr-RAW      echoed into an attribute raw     -> markup breaks, entities OK
 *   js            referenced from a .js file
 *
 * Known limitation: pageConfig keys (json_encode -> JS) are counted as raw-html
 * here; audit those separately (see Task 140).
 *
 * No files are modified. Run: php dev/scripts/measure_lang_sinks.php
 */
$root = realpath(__DIR__ . '/../..');

/* ---------- 1. content class of each English key ---------- */
$en = file_get_contents("$root/lib/lang.ec.en.php");
preg_match_all("/\\\$ec_lang\['([a-z0-9_]+)'\]\s*=\s*('(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\")/i", $en, $m, PREG_SET_ORDER);
$content = [];
foreach ($m as $x) {
    $key = $x[1];
    $val = substr($x[2], 1, -1);
    $tags = [];
    if (preg_match('/<sub>/i', $val))            $tags[] = 'sub';
    if (preg_match('/<sup>/i', $val))            $tags[] = 'sup';
    if (preg_match('/<br\s*\/?>/i', $val))       $tags[] = 'br';
    if (preg_match('/<a\s/i', $val))             $tags[] = 'a';
    if (preg_match('/<span/i', $val))            $tags[] = 'span';
    $ents = [];
    if (preg_match_all('/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/', $val, $e)) $ents = $e[0];
    $content[$key] = ['tags' => $tags, 'ents' => $ents, 'val' => $val];
}

/* ---------- 2. sink class of every reference site ---------- */
$files = [];
foreach (array_merge(glob("$root/*.php"), glob("$root/lib/*.php"), glob("$root/js/*.js")) as $f) {
    if (preg_match('#/lang\.ec\.#', $f)) continue;
    $files[] = $f;
}

$sinks = [];   // key => [sinkclass => count]
$sites = [];   // key => list of [file, line, sink]
foreach ($files as $f) {
    $lines = file($f);
    foreach ($lines as $i => $line) {
        if (!preg_match_all("/ec_lang\['([a-z0-9_]+)'\]/", $line, $mm, PREG_OFFSET_CAPTURE | PREG_SET_ORDER)) continue;
        foreach ($mm as $hit) {
            $key = $hit[1][0];
            $off = $hit[0][1];
            $before = substr($line, 0, $off);

            if (substr($f, -3) === '.js') {
                $sink = 'js';
            } elseif (preg_match('/htmlspecialchars\s*\([^)]*$/', $before)) {
                $sink = 'attr-escaped';
            } elseif (preg_match('/title\s*=\s*["\'][^"\']*$/', $before)) {
                $sink = 'attr-RAW';
            } elseif (preg_match('/\$(html_title|page_title|title)\s*=\s*$/', $before)) {
                $sink = 'php-title-var';
            } else {
                $sink = 'raw-html';
            }
            $sinks[$key][$sink] = ($sinks[$key][$sink] ?? 0) + 1;
            $sites[$key][] = [str_replace("$root/", '', $f), $i + 1, $sink];
        }
    }
}

/* ---------- 3. report ---------- */
$multi = $markupToBadSink = $entAny = [];
foreach ($sinks as $key => $classes) {
    $cl = array_keys($classes);
    $isMarkup = !empty($content[$key]['tags']);
    if (count($cl) > 1) $multi[$key] = $cl;
    foreach ($cl as $c) {
        if ($isMarkup && $c !== 'raw-html') $markupToBadSink[$key][] = $c;
    }
}
foreach ($content as $k => $c) if ($c['ents']) $entAny[$k] = $c['ents'];

$referenced = array_keys($sinks);
$defined    = array_keys($content);

echo "KEYS defined in en: " . count($defined) . "\n";
echo "KEYS referenced statically: " . count($referenced) . "\n";
echo "KEYS defined but never statically referenced (dynamic/dead): " . count(array_diff($defined, $referenced)) . "\n";
echo "KEYS referenced but not defined in en (dynamic prefix): " . count(array_diff($referenced, $defined)) . "\n\n";

echo "--- SINK CLASS TOTALS (reference sites) ---\n";
$tot = [];
foreach ($sinks as $k => $classes) foreach ($classes as $c => $n) $tot[$c] = ($tot[$c] ?? 0) + $n;
arsort($tot);
foreach ($tot as $c => $n) printf("%-16s %d\n", $c, $n);

echo "\n--- MEASUREMENT 1: keys reaching MORE THAN ONE sink class ---\n";
echo "count: " . count($multi) . "\n";
foreach ($multi as $k => $cl) {
    $mk = $content[$k]['tags'] ? '[markup:' . implode(',', $content[$k]['tags']) . ']' : '[plain]';
    printf("  %-28s %-34s %s\n", $k, implode('+', $cl), $mk);
}

echo "\n--- MEASUREMENT 1b: markup-bearing key reaching a NON-raw-html sink (unsatisfiable) ---\n";
echo "count: " . count($markupToBadSink) . "\n";
foreach ($markupToBadSink as $k => $cl) {
    printf("  %-28s tags=%-18s bad sinks=%s\n", $k, implode(',', $content[$k]['tags']), implode(',', array_unique($cl)));
    foreach ($sites[$k] as $s) if ($s[2] !== 'raw-html') printf("      %s:%d (%s)\n", $s[0], $s[1], $s[2]);
}

echo "\n--- MEASUREMENT 2: markup composition of en keys ---\n";
$byTag = $onlyBr = $onlySpan = 0; $tagCount = [];
foreach ($content as $k => $c) {
    if (!$c['tags']) continue;
    $byTag++;
    sort($c['tags']);
    $sig = implode('+', $c['tags']);
    $tagCount[$sig] = ($tagCount[$sig] ?? 0) + 1;
}
echo "markup-bearing keys: $byTag\n";
arsort($tagCount);
foreach ($tagCount as $sig => $n) printf("  %-20s %d\n", $sig, $n);

echo "\n--- MEASUREMENT 3: entity-bearing en keys, by sink they reach ---\n";
echo "entity-bearing keys (en): " . count($entAny) . "\n";
$entBySink = [];
foreach ($entAny as $k => $ents) {
    $cl = isset($sinks[$k]) ? implode('+', array_keys($sinks[$k])) : 'UNREFERENCED';
    $entBySink[$cl] = ($entBySink[$cl] ?? 0) + 1;
}
arsort($entBySink);
foreach ($entBySink as $c => $n) printf("  %-30s %d\n", $c, $n);

echo "\n--- MEASUREMENT 3b: entity-bearing keys that reach an attribute/JS sink ---\n";
foreach ($entAny as $k => $ents) {
    if (!isset($sinks[$k])) continue;
    $cl = array_keys($sinks[$k]);
    if (array_diff($cl, ['raw-html'])) {
        printf("  %-28s %-24s ents=%s\n", $k, implode('+', $cl), implode(' ', array_unique($ents)));
    }
}
