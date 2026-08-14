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

printf("Scenario write seam — %d overridable propert(ies) parsed from LPN_OVERRIDABLE: %s\n",
    count($props), implode(', ', $props));
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
