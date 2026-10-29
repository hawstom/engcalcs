<?php
/**
 * Ad hoc inline styling ratchet: no new literal sizes or colours written in JS or PHP markup.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY (Tom, 2026-10-29): "If we use global styles instead of hidden ad hoc hacks, this can work.
 * Maybe the main test in this regard should be for hidden hacks." Pixel-measurement harnesses are
 * on demand (dev/scripts/on_demand_harnesses.txt). What keeps the layout honest in their place is
 * that sizes and colours live in css/engcalcs.css as classes, where one edit fixes every page,
 * and not as literals scattered through js/*.js and lib/*.php where nobody can find them.
 *
 * WHAT COUNTS (one per source line): a line in js/*.js (not js/vendor/) or lib/*.php that sets a
 * style AND writes a LITERAL number with a length unit or a literal colour in it. "Sets a style"
 * means one of: `.style.x =`, `.style[...] =`, `.style.cssText`, `.style.setProperty(`,
 * `setAttribute('style'`, or a `style="..."` / `style='...'` attribute in built markup.
 * A "literal" is a quoted piece of text with digits straight in front of px, em, rem, %, vh, vw,
 * pt, ch or ex (`'120px'`, `"width:12em"`), or a colour (`#fff`, `#1a2b3c`, `rgb(`, `rgba(`,
 * `hsl(`, `hsla(`).
 *
 * WHAT DOES NOT COUNT, on purpose:
 *   - Computed geometry. `el.style.left = x + 'px'`, `style.width = w + 'px'`, a dragged width
 *     taken from a measurement, a map or canvas position: the number is not written in the
 *     source, only the unit is, so there are no digits in front of it. These cannot be a class.
 *   - Map and SVG drawing. `setAttribute('x', ...)`, `fill`, `stroke` and the like are not style
 *     settings; map ink is already listed in chrome_colour_allow.json.
 *   - Zero and unit-less values (`'0'`, `'0px'`, `'none'`, `'auto'`, `'100%'` is counted, `'0px'` is not).
 *   - Comment lines (`//`, `*`, `/*`, `#`).
 *   - A line that carries the marker `adhoc-style-ok` in a comment, for the rare case a literal
 *     must stay (say why next to it).
 *
 * A RATCHET: dev/scripts/adhoc_style_baseline.json holds, per file, how many lines count and a short
 * fingerprint of each. A file whose count RISES fails, and the lines not in the baseline are
 * printed. A count that falls is good: run `php dev/scripts/adhoc_style_check.php --write` to
 * lock the lower number in. The fix for a failure is a class in css/engcalcs.css, with the
 * colours as --ec-* tokens, and the code adds or removes the class.
 *
 *   php dev/scripts/adhoc_style_check.php            check against the baseline
 *   php dev/scripts/adhoc_style_check.php --write    rewrite the baseline from the tree
 *   php dev/scripts/adhoc_style_check.php --top      also print the ten worst files
 */

$root = realpath(__DIR__ . '/../..');
$baselineFile = __DIR__ . '/adhoc_style_baseline.json';
$write = in_array('--write', $argv, true);
$top = in_array('--top', $argv, true);

function adhocCountFile($path) {
	$hits = array();
	$lines = @file($path, FILE_IGNORE_NEW_LINES);
	if ($lines === false) { return $hits; }
	$literalLen = '/[\'"`:\s(,]-?\d*\.?\d*[1-9]\d*\s*(px|em|rem|%|vh|vw|pt|ch|ex)\b/';
	$literalColour = '/#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(/';
	$setsStyle = '/\.style\.[A-Za-z]+\s*=[^=]|\.style\[[^\]]+\]\s*=[^=]|\.style\.cssText|\.style\.setProperty\(|setAttribute\(\s*[\'"]style[\'"]|\bstyle\s*=\s*\\\\?["\']/';
	foreach ($lines as $i => $line) {
		$t = ltrim($line);
		if ($t === '' || strpos($t, '//') === 0 || strpos($t, '*') === 0 || strpos($t, '/*') === 0 || strpos($t, '#') === 0) { continue; }
		if (strpos($line, 'adhoc-style-ok') !== false) { continue; }
		if (!preg_match($setsStyle, $line)) { continue; }
		// Strip the part of the line after a trailing // comment only when it is clearly one.
		$code = preg_replace('~\s//\s.*$~', '', $line);
		if (preg_match($literalLen, $code) || preg_match($literalColour, $code)) {
			$hits[] = array('n' => $i + 1, 'text' => trim($line), 'fp' => substr(md5(trim($line)), 0, 8));
		}
	}
	return $hits;
}

$files = array();
foreach (glob($root . '/js/*.js') as $f) { $files[] = $f; }
foreach (glob($root . '/lib/*.php') as $f) { $files[] = $f; }
sort($files);

$now = array();
foreach ($files as $f) {
	$rel = substr($f, strlen($root) + 1);
	$hits = adhocCountFile($f);
	if ($hits) { $now[$rel] = $hits; }
}

if ($write) {
	$out = array(
		'_about' => 'Lines setting a style with a literal size or colour, per file. A ratchet: may fall, may not rise. See adhoc_style_check.php.',
		'files' => array(),
	);
	foreach ($now as $rel => $hits) {
		$out['files'][$rel] = array('count' => count($hits), 'fp' => array_map(function ($h) { return $h['fp']; }, $hits));
	}
	file_put_contents($baselineFile, json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
	$total = 0; foreach ($now as $h) { $total += count($h); }
	echo "adhoc_style baseline written: $total lines in " . count($now) . " files.\n";
	exit(0);
}

$base = @json_decode(@file_get_contents($baselineFile), true);
if (!is_array($base) || !isset($base['files'])) {
	echo "adhoc_style_baseline.json is missing or unreadable. Run: php dev/scripts/adhoc_style_check.php --write\n";
	exit(1);
}
$base = $base['files'];

$bad = 0; $total = 0; $baseTotal = 0; $fell = 0;
foreach ($base as $b) { $baseTotal += $b['count']; }
foreach ($now as $rel => $hits) {
	$total += count($hits);
	$was = isset($base[$rel]) ? $base[$rel]['count'] : 0;
	if (count($hits) > $was) {
		$known = isset($base[$rel]) ? array_count_values($base[$rel]['fp']) : array();
		echo "FAIL  $rel: $was -> " . count($hits) . " lines with a literal size or colour in a style.\n";
		foreach ($hits as $h) {
			if (!empty($known[$h['fp']])) { $known[$h['fp']]--; continue; }
			echo "      line {$h['n']}: " . substr($h['text'], 0, 160) . "\n";
		}
		$bad++;
	} elseif (count($hits) < $was) {
		$fell++;
	}
}
if ($bad) {
	echo "Use a class in css/engcalcs.css (colours as --ec-* tokens) and add or remove the class from the code.\n";
	echo "A size computed at run time (x + 'px') is fine. See the header of dev/scripts/adhoc_style_check.php.\n";
	exit(1);
}
echo "adhoc style: $total lines with a literal size or colour (baseline $baseTotal)";
echo $fell || $total < $baseTotal ? "; it fell, run --write to lock it in.\n" : ".\n";

if ($top) {
	uasort($now, function ($a, $b) { return count($b) - count($a); });
	$i = 0;
	foreach ($now as $rel => $hits) { if ($i++ >= 10) { break; } printf("  %4d  %s\n", count($hits), $rel); }
}
exit(0);
