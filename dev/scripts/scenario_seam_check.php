<?php
/**
 * scenario_seam_check.php — nothing may write an overridable property except through setProp().
 *
 * WHY THIS EXISTS, and it is a better story than the bug it guards.
 *
 * `setProp()` in js/looped-network.js is the ONE write seam for the delta scenario model: in Base it
 * writes the element (which IS the propagation), and in a scenario it records an override. Its own
 * comment states the failure mode in words:
 *
 *     "A call site that writes `el._diameter` directly is therefore not merely impolite: inside a
 *      scenario it silently edits Base under every other scenario at once."
 *
 * On 2026-08-14 the valve popup did exactly that, on five fields. Scenarios (Task 184) and valves
 * (Task 248 phase 2) were built the same day in parallel worktrees with DISJOINT FILE TERRITORY,
 * exactly as CLAUDE.md requires — and they still collided, because what they shared was not a file
 * but a SEAM. The file rule protects files. Nothing protected the seam.
 *
 * Both harnesses were blind to it by construction: scenario-harness.js never said "valve",
 * valve-harness.js never said "scenario". Two well-written, mutation-tested harnesses, and the
 * defect lived in the gap between their vocabularies.
 *
 * THE PROPERTY LIST IS PARSED FROM LPN_OVERRIDABLE, never restated here. A restated list goes stale
 * the day someone adds a property — silently, which is the same class of bug this check exists to
 * stop. If the parse fails, the check FAILS rather than passing on an empty list: a guard that
 * quietly checks nothing is worse than no guard, which this repo learned the hard way when
 * lang_tag_parity_check.php compared zero strings and printed PASS.
 *
 * APPROVED WRITES carry a trailing `// base-write: <reason>` marker. That is deliberately a comment
 * rather than a function allowlist: it survives line drift and renames, it puts the justification at
 * the site where the next reader needs it, and adding one is a conscious act rather than an
 * accident of which function you happen to be inside.
 *
 * Usage: php dev/scripts/scenario_seam_check.php [--verbose]
 */

$root = dirname(__DIR__, 2);
$file = $root . '/js/looped-network.js';
$verbose = in_array('--verbose', $argv, true);
$src = file_get_contents($file);
if ($src === false) { fwrite(STDERR, "cannot read $file\n"); exit(2); }

// ---- 1. Derive the overridable property names from the source of truth ------------------------
if (!preg_match('/var LPN_OVERRIDABLE = \{(.*?)\n\t\};/s', $src, $m)) {
    fwrite(STDERR, "FAIL: could not find LPN_OVERRIDABLE in js/looped-network.js.\n");
    fwrite(STDERR, "This check derives its property list from that declaration and must never fall\n");
    fwrite(STDERR, "back to a restated one. Fix the parse; do not hardcode the names.\n");
    exit(1);
}
preg_match_all('/(\w+)\s*:\s*true/', $m[1], $pm);
$props = array_values(array_unique($pm[1]));
if (count($props) < 3) {
    fwrite(STDERR, "FAIL: parsed only " . count($props) . " overridable propert(ies). That is not credible;\n");
    fwrite(STDERR, "the parse has drifted. A check that examines almost nothing passes for the wrong reason.\n");
    exit(1);
}

// ---- 1b. Every GROUP in the whitelist must be one elGroup() can actually return ----------------
//
// Added with the Text label group (Task 407), because the failure it guards is the one that had
// already happened once. elGroup() told a link from a node and called EVERYTHING ELSE a node, so a
// label keyed as 'n:<id>' and collided with a junction of the same id -- Task 324's bug, which
// measured 7 / 35 / 72 colliding ids in Net1 / Net2 / Net3. Widening LPN_OVERRIDABLE is one line
// and forgetting the classifier is free, and nothing downstream complains: the overrides are
// written, read back by the wrong element, and every screen looks right.
//
// So the two are checked against each other. The group names are parsed from the whitelist and
// each must appear as a returned string literal in elGroup(); the reverse is not required, since a
// group may legitimately be classified before it has any overridable property.
preg_match_all('/^\t\t(\w+)\s*:\s*\{/m', $m[1], $gm);
$groups = $gm[1];
if (count($groups) < 2) {
    fwrite(STDERR, "FAIL: parsed " . count($groups) . " group(s) from LPN_OVERRIDABLE. The parse has drifted;\n");
    fwrite(STDERR, "node and link have both been there since Task 184, so fewer than two cannot be right.\n");
    exit(1);
}
if (!preg_match('/function elGroup\(el\) \{(.*?)\n\t\}/s', $src, $eg)) {
    fwrite(STDERR, "FAIL: could not find elGroup() in js/looped-network.js. It is the one place an\n");
    fwrite(STDERR, "element's group is decided, and this check cannot verify the whitelist without it.\n");
    exit(1);
}
$missing = [];
foreach ($groups as $g) {
    if (strpos($eg[1], "'" . $g . "'") === false) { $missing[] = $g; }
}
if ($missing) {
    fwrite(STDERR, "FAIL: LPN_OVERRIDABLE names group(s) elGroup() never returns: " . implode(', ', $missing) . "\n\n");
    fwrite(STDERR, "Every element of such a group is therefore classified as something else -- in practice\n");
    fwrite(STDERR, "as a node -- so its overrides are keyed 'n:<id>' and collide with a node of the same id\n");
    fwrite(STDERR, "(Task 324). Teach elGroup() to recognise the group BY SOMETHING IT HAS, never by\n");
    fwrite(STDERR, "'neither of the others', and give ovKeyFor() its prefix.\n");
    exit(1);
}

// ---- 1c. The key format is spelled in ovKeyFor() and nowhere else ------------------------------
//
// ovKey()/ovKeyFor()'s own comment claims this ("every read, write, count, rename and purge goes
// through ovKey()/ovKeyFor() and none of them spells 'n:', 'l:' or 'x:' itself"). It is worth a
// line of check rather than a line of prose: a second copy of the format is free to agree with the
// current one and drift the day a group is added, which is exactly when it would be written.
//
// TWO LINES ARE EXEMPT AND NAMED, rather than the check being loosened until they pass:
// nodeLabelKey()/linkLabelKey() are the LABEL PLACEMENT pass's own identity strings (js/lpn-collide.js
// compares ownership by them) and merely happen to be spelled the same way. They index no override
// map and never meet one. Naming them here keeps the rule absolute everywhere else.
$exemptFns = ['function nodeLabelKey', 'function linkLabelKey', 'function ovKeyFor'];
$prefixLines = [];
foreach (explode("\n", $src) as $i => $line) {
    if (preg_match('/^\s*(\/\/|\*|\/\*)/', $line)) { continue; }
    $exempt = false;
    foreach ($exemptFns as $fn) { if (strpos($line, $fn) !== false) { $exempt = true; break; } }
    if ($exempt) { continue; }
    if (preg_match("/'(?:n|l|x):'/", $line)) { $prefixLines[] = ($i + 1) . ': ' . trim($line); }
}
if ($prefixLines) {
    fwrite(STDERR, "FAIL: the override key format is spelled outside ovKeyFor():\n");
    foreach ($prefixLines as $p) { fwrite(STDERR, "  js/looped-network.js:$p\n"); }
    fwrite(STDERR, "\nOne seam, one spelling. Call ovKey(el) or ovKeyFor(group, id) instead.\n");
    exit(1);
}

// ---- 2. Find every direct write to one of them -------------------------------------------------
$lines = explode("\n", $src);
$pattern = '/(?<![\w.])([A-Za-z_$][\w$]*)\._(' . implode('|', array_map('preg_quote', $props)) . ')\s*=(?!=)/';
$bad = [];
$approved = 0;
foreach ($lines as $i => $line) {
    $code = $line;
    if (preg_match('/^\s*(\/\/|\*|\/\*)/', $code)) { continue; }   // a comment quoting the pattern
    if (!preg_match_all($pattern, $code, $hits, PREG_SET_ORDER)) { continue; }
    if (strpos($code, '// base-write:') !== false) { $approved += count($hits); continue; }
    foreach ($hits as $h) {
        $bad[] = ['line' => $i + 1, 'expr' => $h[1] . '._' . $h[2], 'text' => trim($code)];
    }
}

printf("Scenario write seam — %d group(s) (%s) and %d overridable propert(ies) parsed from LPN_OVERRIDABLE: %s\n",
    count($groups), implode(', ', $groups), count($props), implode(', ', $props));
printf("  %d approved base-write(s), %d unmarked direct write(s)\n\n", $approved, count($bad));

if ($bad) {
    foreach ($bad as $b) {
        printf("  js/looped-network.js:%-5d %s\n", $b['line'], $b['expr']);
        if ($verbose) { printf("        %s\n", $b['text']); }
    }
    echo "\nEach of these writes an overridable property WITHOUT going through setProp(). Inside a\n";
    echo "scenario that edits Base under every other scenario at once, silently -- the exact failure\n";
    echo "setProp()'s own comment predicts, and exactly what the valve popup did for five fields.\n\n";
    echo "Either route it through setProp(el, prop, value), or -- if it genuinely must write Base\n";
    echo "(construction, import, the documented downstream push) -- mark it:\n\n";
    echo "    el._diameter = v;   // base-write: <why this one is Base and not an override>\n\n";
    echo "The marker is a comment on purpose: it survives line drift, and it puts the reason where\n";
    echo "the next reader will be standing.\n";
    exit(1);
}

echo "PASS: every write to an overridable property goes through setProp() or is a marked base-write.\n";
exit(0);
