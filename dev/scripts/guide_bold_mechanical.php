<?php
/**
 * Bolds, in every translated User Manual definition, the interface labels that can be wrapped
 * mechanically, and writes the list of cells a translator must still judge.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY. English bolds every interface label a manual definition tells the reader to look for
 * (dev/lpn-spike/guide-bold-labels-spec.json). A cell (one definition, one label key, one language)
 * is MECHANICAL when the language's own label string (the value of the label key in that file)
 * appears verbatim in the translated definition exactly as many times as English quotes it, and
 * English uses it bold only (no plain use, no unit-bearing bold). Every other cell is a translator's.
 *
 * Usage:
 *   php dev/scripts/guide_bold_mechanical.php            # dry run, counts per language
 *   php dev/scripts/guide_bold_mechanical.php --apply    # writes the lang files
 *   php dev/scripts/guide_bold_mechanical.php --list     # rewrites dev/guide-bold-translation-list.md
 *   php dev/scripts/guide_bold_mechanical.php --check    # exit 1 if any mechanical cell has an unbolded occurrence
 *   php dev/scripts/guide_bold_mechanical.php --lang=de  # one language
 *
 * Safety: wrapping is done outside tags only, longest label first, never inside an existing
 * <strong>. A language file is written only if, per key, the new value with its bold tags removed
 * equals the old value with its bold tags removed; otherwise the file is left untouched and reported.
 */
$libDir = __DIR__ . '/../../lib';
$spec = json_decode(file_get_contents(__DIR__ . '/../lpn-spike/guide-bold-labels-spec.json'), true);
$apply = in_array('--apply', $argv);
$list = in_array('--list', $argv);
$only = null; $check = in_array('--check', $argv); $missing = array();
foreach ($argv as $a) { if (strpos($a, '--lang=') === 0) { $only = substr($a, 7); } }
$noSpace = array('zh', 'km', 'my');   // scripts written without spaces: no word-boundary test

function gbm_load($file) {
	$vals = array(); $lines = file($file, FILE_IGNORE_NEW_LINES);
	foreach ($lines as $i => $line) {
		if (preg_match("/^\\\$ec_lang\\['([^']+)'\\]='((?:[^'\\\\]|\\\\.)*)';\\s*\$/", $line, $m)) {
			$vals[$m[1]] = array('v' => preg_replace("/\\\\(['\\\\])/", '$1', $m[2]), 'line' => $i);
		}
	}
	return array($lines, $vals);
}
function gbm_esc($s) { return str_replace(array('\\', "'"), array('\\\\', "\\'"), $s); }
function gbm_label($e, $t) {
	if (!isset($t[$e['key']]) || $t[$e['key']]['v'] === '') { return ''; }
	$l = $t[$e['key']]['v'];
	if (!empty($e['stripEllipsis'])) { $l = preg_replace('/…$/u', '', $l); }
	return $l;
}
/** Locates label occurrences in the text segments of $v. Returns array(label => array of [offset,len,bold]). */
function gbm_find($v, $labels, $boundary) {
	$found = array();
	foreach ($labels as $l) { $found[$l] = array(); }
	$parts = preg_split('/(<[^>]+>)/u', $v, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_OFFSET_CAPTURE);
	$inBold = false; $segs = array();
	foreach ($parts as $p) {
		if ($p[0] === '') { continue; }
		if ($p[0][0] === '<') {
			if (preg_match('/^<strong[\s>]/i', $p[0])) { $inBold = true; } elseif (strtolower($p[0]) === '</strong>') { $inBold = false; }
			continue;
		}
		$segs[] = array($p[0], $p[1], $inBold);
	}
	usort($labels, function ($a, $b) { return strlen($b) - strlen($a); });
	foreach ($segs as $s) {
		$taken = array();
		foreach ($labels as $l) {
			if ($l === '') { continue; }
			$off = 0;
			while (($pos = strpos($s[0], $l, $off)) !== false) {
				$off = $pos + 1; $end = $pos + strlen($l);
				$clash = false;
				foreach ($taken as $t) { if ($pos < $t[1] && $end > $t[0]) { $clash = true; break; } }
				if ($clash) { continue; }
				if ($boundary) {
					$before = $pos > 0 ? preg_match('/[\p{L}\p{M}\p{N}_]$/u', substr($s[0], 0, $pos)) : 0;
					$after = preg_match('/^[\p{L}\p{M}\p{N}_]/u', substr($s[0], $end));
					if ($before || $after) { continue; }
				}
				$taken[] = array($pos, $end);
				$found[$l][] = array($s[1] + $pos, strlen($l), $s[2]);
			}
		}
	}
	return $found;
}
function gbm_strip($v) { return preg_replace('#</?strong>#', '', $v); }

list(, $en) = gbm_load("$libDir/lang.ec.en.php");
$langs = array();
foreach (glob("$libDir/lang.ec.??.php") as $f) {
	$l = substr(basename($f), 8, 2);
	if ($l !== 'en' && ($only === null || $only === $l)) { $langs[] = $l; }
}
sort($langs);
$totW = 0; $totL = 0; $refused = array(); $sections = array();
foreach ($langs as $lg) {
	$file = "$libDir/lang.ec.$lg.php";
	list($lines, $t) = gbm_load($file);
	$wrapped = 0; $left = 0; $leftDefs = array(); $edits = array(); $bad = false;
	foreach ($spec['entries'] as $mk => $entries) {
		if (!isset($t[$mk])) { continue; }
		$v = $t[$mk]['v'];
		$labels = array();
		foreach ($entries as $e) { $lab = gbm_label($e, $t); if ($lab !== '') { $labels[] = $lab; } }
		$found = gbm_find($v, array_unique($labels), !in_array($lg, $noSpace));
		$ins = array(); $cells = array();
		foreach ($entries as $e) {
			$plain = 0; foreach (($e['plain'] ?? array()) as $n) { $plain += $n; }
			$eb = (int)($e['bold'] ?? 0); $eu = (int)($e['boldUnit'] ?? 0);
			$lab = gbm_label($e, $t);
			$n = $lab === '' ? 0 : count($found[$lab]);
			if ($lab !== '' && $plain === 0 && $eu === 0 && $n === $eb) {
				$wrapped++;
				foreach ($found[$lab] as $o) { if (!$o[2]) { $ins[$o[0]] = $o[1]; $missing[] = "$lg $mk " . $e['key']; } }
			} elseif ($eb === 0 && $eu === 0) {
				continue;   // English holds it plain only: nothing to bold
			} else {
				$left++;
				$k = preg_replace('/^lpn_/', '', $e['key']);
				$cells[] = "$k ($n verbatim, English $eb bold" . ($plain ? " + $plain plain" : '') . ($eu ? " + $eu bold with a unit" : '') . ')';
			}
		}
		if ($cells) { $leftDefs[preg_replace('/^lpn_guide_/', '', $mk)] = $cells; }
		if (!$ins) { continue; }
		krsort($ins);
		$nv = $v;
		foreach ($ins as $off => $len) { $nv = substr($nv, 0, $off) . '<strong>' . substr($nv, $off, $len) . '</strong>' . substr($nv, $off + $len); }
		if (gbm_strip($nv) !== gbm_strip($v) || $nv === $v) { $bad = true; $refused[] = "$lg $mk"; break; }
		$edits[$mk] = $nv;
	}
	$sections[$lg] = $leftDefs;
	if ($bad) { echo sprintf("%s: REFUSED, file untouched\n", $lg); continue; }
	echo sprintf("%s: %d cells wrapped in %d definitions, %d left for the translator\n", $lg, $wrapped, count($edits), $left);
	$totW += $wrapped; $totL += $left;
	if ($apply && $edits) {
		foreach ($edits as $mk => $nv) {
			$lines[$t[$mk]['line']] = "\$ec_lang['$mk']='" . gbm_esc($nv) . "';";
		}
		file_put_contents($file, implode("\n", $lines) . "\n");
	}
}
echo "TOTAL: $totW cells wrapped, $totL left for translators" . ($apply ? '' : ' (dry run)') . "\n";
if ($refused) { echo 'REFUSED: ' . implode(', ', $refused) . "\n"; }

if ($check) {
	foreach (array_unique($missing) as $m) { echo "NOT BOLD: $m\n"; }
	exit($missing || $refused ? 1 : 0);
}
if ($list) {
	$mdFile = __DIR__ . '/../guide-bold-translation-list.md';
	$md = file_get_contents($mdFile);
	$head = substr($md, 0, strpos($md, "\n## ") + 1);
	$head = preg_replace('/No translation has the bold yet, except Controls and rules \(`lpn_guide_lib_ctl_def`, round 5\)\./', 'The cells that match have been bolded mechanically by `dev/scripts/guide_bold_mechanical.php`; the lists below are what is left.', $head);
	$head = str_replace('Cells not listed match and can be wrapped mechanically.', 'Cells not listed match and are already bold.', $head);
	$out = $head;
	foreach ($sections as $lg => $defs) {
		$n = 0; foreach ($defs as $c) { $n += count($c); }
		$out .= "\n## $lg ($n cells in " . count($defs) . " definitions)\n";
		foreach ($defs as $d => $c) { $out .= "- $d: " . implode('; ', $c) . "\n"; }
	}
	file_put_contents($mdFile, $out);
	echo "list written\n";
}
