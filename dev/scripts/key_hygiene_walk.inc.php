<?php
/**
 * key_hygiene_walk.inc.php — THE REACHABILITY WALK (survey row 3c).
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * A DEAD READER HIDES A DEAD KEY.
 *
 * `key_hygiene_check.php`'s first finding asks "does anything REFERENCE this key". That is not the
 * honest question, and Task 542 produced the counter-example: it deleted the terrain menu ROW but
 * left `EC.lpnTerrainMenuLabel()` and `EC.lpnTerrainMenuTip()` behind, each reading a string, each
 * called by nobody. A reference from an UNCALLED function is still a reference, so both strings
 * stayed out of the orphan list while living in 27 language files and reaching no screen.
 *
 * The honest question is whether a READER of the key is itself reached, and that is a walk from
 * the page's own entry points rather than a count.
 *
 * IT IS ADVISORY AND MUST STAY ADVISORY. Reachability through a dynamic dispatch is undecidable in
 * general: one `EngCalcs[name]()` and every member of that namespace is live for reasons no static
 * tool can see. So this lists CANDIDATES, and prints what it turned away and why.
 *
 * AND IT IS DELIBERATELY CONSERVATIVE, for this repo's own measured reason: the orphan list went
 * 35 -> 21 -> 16 as false shapes were taught away, because a check that is 40% noise is a check
 * people learn to skip. Every rule here gives up coverage to buy silence, and each is pinned in
 * `key_hygiene_selftest.php` so that loosening one fails loudly rather than producing a false
 * positive on a Tuesday:
 *   - a name that appears in ANY string literal is a root — it may be dispatched by name;
 *   - a namespace indexed by a computed name makes every member of it a root;
 *   - a key named anywhere in PHP is never a candidate;
 *   - a key named only in a JS comment has no reading site at all and is left to finding 1;
 *   - a function whose braces will not balance is not analysed at all;
 *   - a name shorter than four characters is a root, being too easy to collide with a local.
 */

/**
 * Blank out comments, string bodies and regex literals, preserving byte offsets and newlines, so
 * an identifier scan sees CODE only. With $keepStringBodies the string bodies survive — that is the
 * mask a LANGUAGE KEY is looked for in, since a key only ever appears inside a quoted literal.
 *
 * The regex-literal skip is not optional: `/['"]/` would otherwise open a string that never closes
 * and swallow the rest of the file.
 */
function ecJsCodeMask($src, $keepStringBodies = false)
{
    $n = strlen($src);
    $out = $src;
    $blank = function ($from, $to) use (&$out, $n) {
        for ($k = max(0, $from); $k < $to && $k < $n; $k++) {
            if ($out[$k] !== "\n") { $out[$k] = ' '; }
        }
    };
    $prev = '';
    for ($i = 0; $i < $n;) {
        $c = $src[$i];
        if ($c === '/' && $i + 1 < $n && $src[$i + 1] === '/') {
            $j = strpos($src, "\n", $i); $j = ($j === false) ? $n : $j;
            $blank($i, $j); $i = $j; continue;
        }
        if ($c === '/' && $i + 1 < $n && $src[$i + 1] === '*') {
            $j = strpos($src, '*/', $i); $j = ($j === false) ? $n : $j + 2;
            $blank($i, $j); $i = $j; continue;
        }
        if ($c === '"' || $c === "'" || $c === '`') {
            $j = $i + 1;
            while ($j < $n) {
                if ($src[$j] === '\\') { $j += 2; continue; }
                if ($src[$j] === $c) { break; }
                $j++;
            }
            $j = min($j + 1, $n);
            if (!$keepStringBodies) { $blank($i + 1, $j - 1); }   // keep the quotes, blank the body
            $prev = $c; $i = $j; continue;
        }
        if ($c === '/' && $prev !== '' && strpos('(,=:[!&|?{};+', $prev) !== false) {
            $j = $i + 1; $inClass = false;
            while ($j < $n && $src[$j] !== "\n") {
                if ($src[$j] === '\\') { $j += 2; continue; }
                if ($src[$j] === '[') { $inClass = true; }
                elseif ($src[$j] === ']') { $inClass = false; }
                elseif ($src[$j] === '/' && !$inClass) { break; }
                $j++;
            }
            if ($j < $n && $src[$j] === '/') { $blank($i, $j + 1); $prev = 'x'; $i = $j + 1; continue; }
        }
        if (!ctype_space($c)) { $prev = $c; }
        $i++;
    }
    return $out;
}

/**
 * Locate every named function in one JS source — the three shapes this suite writes.
 *
 * Returns [units, unparsed]; a unit is ['name','owner','kind','start','end'] with `end` one past
 * the closing brace. A function whose braces do not balance is REPORTED as unparsed and dropped,
 * never guessed at.
 */
function ecJsFunctionUnits($src)
{
    $mask = ecJsCodeMask($src);
    $n = strlen($mask);
    $units = [];
    $unparsed = 0;
    $pats = [
        '/(?:^|[^\w.$])(EngCalcs|EC)\.([A-Za-z_$][\w$]*)\s*=\s*function\s*\(/m'      => 'member',
        '/(?:^|[^\w.$])function\s+([A-Za-z_$][\w$]*)\s*\(/m'                         => 'local',
        '/(?:^|[^\w.$])(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*function\s*\(/m' => 'local',
    ];
    foreach ($pats as $re => $kind) {
        if (!preg_match_all($re, $mask, $m, PREG_OFFSET_CAPTURE)) { continue; }
        $names  = ($kind === 'member') ? $m[2] : $m[1];
        $owners = ($kind === 'member') ? $m[1] : null;
        foreach ($names as $idx => $hit) {
            $open = strpos($mask, '{', $m[0][$idx][1] + strlen($m[0][$idx][0]) - 1);
            if ($open === false) { $unparsed++; continue; }
            $depth = 0; $end = null;
            for ($k = $open; $k < $n; $k++) {
                if ($mask[$k] === '{') { $depth++; }
                elseif ($mask[$k] === '}') { $depth--; if ($depth === 0) { $end = $k + 1; break; } }
            }
            if ($end === null) { $unparsed++; continue; }
            $units[] = [
                'name'  => $hit[0],
                'owner' => $owners ? $owners[$idx][0] : null,
                'kind'  => $kind,
                'start' => $m[0][$idx][1],
                'end'   => $end,
            ];
        }
    }
    return [$units, $unparsed];
}

/**
 * The walk.
 *
 * @param array $jsSources        file => source
 * @param array $phpSources       file => source. Not analysed for functions — scanned only as a
 *                                root context, so the DEV HARNESSES belong here too: a function a
 *                                harness calls is a test seam rather than a corpse, and listing it
 *                                as dead is the noise this walk exists to avoid.
 * @param array $langKeys         every defined English key
 * @param array $dynamicPrefixes  families the runtime assembles by prefix (finding 1's list)
 * @return array ['candidates' => [[key, readers]], 'dead' => [id => unit], 'turned' => [why => n]]
 */
function ecReachabilityCandidates(array $jsSources, array $phpSources, array $langKeys, array $dynamicPrefixes)
{
    $turned = [];
    $bump = function ($why, $n = 1) use (&$turned) { $turned[$why] = ($turned[$why] ?? 0) + $n; };

    $masks = [];
    $keyMasks = [];
    $units = [];
    foreach ($jsSources as $f => $src) {
        $masks[$f] = ecJsCodeMask($src);
        $keyMasks[$f] = ecJsCodeMask($src, true);
        list($u, $unparsed) = ecJsFunctionUnits($src);
        if ($unparsed) { $bump('function whose braces would not balance - not analysed', $unparsed); }
        $units[$f] = $u;
    }

    // A namespace ever indexed by a computed name can dispatch any member, so no member of it is
    // decidable and all of them become roots.
    $opaqueOwners = [];
    foreach ($masks as $m) {
        if (preg_match_all('/\b(EngCalcs|EC)\s*\[/', $m, $mm)) {
            foreach ($mm[1] as $o) { $opaqueOwners[$o] = true; }
        }
    }

    // The INNERMOST unit containing an offset owns it; an offset inside no unit is top-level, which
    // is a root context.
    $enclosing = function ($file, $pos) use ($units) {
        $best = null; $bestLen = PHP_INT_MAX;
        foreach ($units[$file] as $i => $u) {
            if ($pos >= $u['start'] && $pos < $u['end'] && ($u['end'] - $u['start']) < $bestLen) {
                $best = $i; $bestLen = $u['end'] - $u['start'];
            }
        }
        return $best;
    };

    $allSrc = implode("\n", $jsSources) . "\n" . implode("\n", $phpSources);
    $literals = [];
    if (preg_match_all('/[\'"`]([A-Za-z_$][\w$]*)[\'"`]/', $allSrc, $lm)) {
        foreach ($lm[1] as $s) { $literals[$s] = true; }
    }

    $ids = [];
    foreach ($units as $f => $us) {
        foreach ($us as $i => $u) { $ids["$f#$i"] = $u + ['file' => $f]; }
    }

    // A unit is REACHED when its name appears in a reached context: top-level JS, any PHP, a string
    // literal, or the body of an already-reached unit. Iterate to a fixed point.
    $reached  = [];
    $refsInto = [];
    foreach ($ids as $id => $u) {
        $name = $u['name'];
        if (strlen($name) < 4) {
            $reached[$id] = true; $bump('name shorter than four characters - assumed reachable'); continue;
        }
        if ($u['owner'] !== null && isset($opaqueOwners[$u['owner']])) {
            $reached[$id] = true; $bump('namespace indexed by a computed name - every member assumed reachable'); continue;
        }
        if (isset($literals[$name])) {
            $reached[$id] = true; $bump('name appears in a string literal - may be dispatched by name'); continue;
        }
        $re = '/(?<![\w$])' . preg_quote($name, '/') . '(?![\w$])/';
        $holders = [];
        foreach ($phpSources as $ps) {
            if (preg_match($re, $ps)) { $holders[] = null; break; }
        }
        if (!$holders) {
            foreach ($masks as $f => $m) {
                if (!preg_match_all($re, $m, $om, PREG_OFFSET_CAPTURE)) { continue; }
                foreach ($om[0] as $hit) {
                    $pos = $hit[1];
                    $h = $enclosing($f, $pos);
                    // the definition site, and the body's own recursion, are not callers
                    if ($h !== null && "$f#$h" === $id) { continue; }
                    if ($f === $u['file'] && $pos >= $u['start'] && $pos < $u['end'] && $h === null) { continue; }
                    $holders[] = ($h === null) ? null : "$f#$h";
                }
            }
        }
        $refsInto[$id] = $holders;
        foreach ($holders as $h) { if ($h === null) { $reached[$id] = true; break; } }
    }
    do {
        $grew = false;
        foreach ($refsInto as $id => $holders) {
            if (isset($reached[$id])) { continue; }
            foreach ($holders as $h) {
                if ($h !== null && isset($reached[$h])) { $reached[$id] = true; $grew = true; break; }
            }
        }
    } while ($grew);

    $dead = [];
    foreach ($ids as $id => $u) { if (!isset($reached[$id])) { $dead[$id] = $u; } }

    // A key whose every naming site sits inside a dead unit reaches no screen.
    $candidates = [];
    foreach ($langKeys as $k) {
        foreach ($dynamicPrefixes as $d) {
            if (strpos($k, $d) === 0) { $bump('key in a family the runtime assembles by prefix'); continue 2; }
        }
        $re = '/(?<![\w])' . preg_quote($k, '/') . '(?![\w])/';
        // The MASKED source, so a comment does not count as a reading site. This one is measured:
        // js/lpn-terrain.js carries a top-level comment naming `lpn_terrain_menu` as a key that was
        // deleted, and against the raw source that comment sat outside every function, counted as a
        // live context, and suppressed the very candidate this walk was written to find. A key that
        // no code names at all has no site here and is left to finding 1, which owns it.
        $sites = [];
        foreach ($keyMasks as $f => $m) {
            if (!preg_match_all($re, $m, $om, PREG_OFFSET_CAPTURE)) { continue; }
            foreach ($om[0] as $hit) { $sites[] = [$f, $enclosing($f, $hit[1])]; }
        }
        if (!$sites) { continue; }                            // finding 1 already owns an unnamed key
        $readers = [];
        foreach ($sites as [$f, $h]) {
            if ($h === null || !isset($dead["$f#$h"])) { continue 2; }   // a live context names it
            $readers[$ids["$f#$h"]['name'] . '() in ' . basename($f)] = true;
        }
        // Only now is the PHP sweep worth its cost, and it is the last word: whatever the JS reader
        // is doing, a page that renders the key puts it on a screen.
        foreach ($phpSources as $ps) {
            if (preg_match($re, $ps)) { $bump('key read only by unreachable JS but also named in PHP'); continue 2; }
        }
        $candidates[] = [$k, implode(', ', array_keys($readers))];
    }

    return ['candidates' => $candidates, 'dead' => $dead, 'turned' => $turned];
}
