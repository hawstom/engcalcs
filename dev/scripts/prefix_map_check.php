<?php
/**
 * prefix_map_check.php — every calculator prefix is either WIRED to glossary terms or DECLARED to
 * own none. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. CLAUDE.md, "How to Add a New Calculator", step 11: a prefix missing from
 * prefixToTermNames() (dev/scripts/prefix_terms.inc.php) does not fail — it SILENTLY FALLS BACK to
 * three default terms, flow/velocity/slope. Payloads still generate, --check still says FRESH, the
 * sprint still runs, and every definition, every preferred translation and every `avoid` array
 * written for that calculator is simply never delivered to the agent that needed it. The avoid
 * arrays are the whole point of a trap term, and they are the part that goes missing.
 *
 * It has happened twice that anybody knows of: `lpn` and `bpn` were missing for months (the Task
 * 193 network concepts, every one carrying an avoid list, reached nobody), and `menu`/`about` were
 * missing until Task 244. Both were found by a human reading the map, not by any check. The rule
 * has been documented at length the entire time, which is the argument for a check rather than for
 * reading more carefully.
 *
 * WHY IT IS NOT gloss_ref_check.php. That check reads the `gloss:` pointers written in
 * $ec_lang_syn, and it catches an unwired prefix only where somebody already wrote a pointer for
 * it. A brand-new calculator has no pointers at all, so it is exactly the case gloss_ref_check.php
 * cannot see — and a brand-new calculator is precisely when step 11 is forgotten. This check reads
 * the KEYS instead: if a prefix exists in lib/lang.ec.en.php, somebody must have decided what
 * glossary terms it needs, even if the decision was "none".
 *
 * A PREFIX OWNING NO GLOSSARY TERM IS LEGITIMATE, which is why this is a two-list check rather
 * than a one-list one. `u_` is unit symbols; `view_`, `install_`, `contact_` are page chrome with
 * no hydraulic concept in them. Silence cannot distinguish those from an oversight, so they are
 * DECLARED below with a reason each. The declaration is the deliverable: a new prefix fails until
 * somebody writes down which of the two it is, and that is the whole mechanism.
 *
 * A declaration that no longer names a real prefix is itself a finding, the same way page_meta's
 * exempt list is: an entry nobody can reach describes a decision about something that is gone.
 *
 * WHAT IS ONLY A NOTE. A prefix wired in the map with no keys in English today (wfs, wfi, irr, ds,
 * pd, rrc) delivers nothing to nobody and costs nothing. Removing one is a judgement — CLAUDE.md
 * records `irr` as "probably a legacy alias of ip" and declines to guess — so these are listed and
 * do not fail.
 *
 * Usage:
 *   php dev/scripts/prefix_map_check.php
 *
 * Exit 0 = every prefix is accounted for. Exit 1 = one is not, naming it and both fixes.
 */

/**
 * Prefixes that legitimately own NO glossary term, with the reason each. Not an exemption from
 * translation — every one of these is translated like any other key; they simply carry no
 * technical concept a glossary entry could guard.
 */
const EC_NO_GLOSSARY_PREFIXES = [
    'u'        => 'unit symbols and abbreviations (ft, cfs, ft H2O). Identity strings; the glossary '
                . 'has nothing to say about them.',
    'ec'       => 'suite-wide form chrome: the save-this-calculation box and the related-calculators '
                . 'line. No hydraulic concept.',
    'view'     => 'view controls: hide this line, printable version. No hydraulic concept.',
    'points'   => 'the points data area on the irregular-section pages: a heading and two buttons.',
    'template' => 'page-template chrome: welcome, feedback, printable title, share link.',
    'index'    => 'the front page title and description.',
    'install'  => 'the PWA install instructions. The concepts are Android and Safari, not hydraulics.',
    'contact'  => 'the contact form: message, success.',
];

/**
 * Every finding, given the three inputs. Pure, so the selftest can drive it with fixtures.
 *
 * detectPrefixes() in generate_translation_payloads.php splits on the FIRST underscore and ignores
 * a key with none; this mirrors it exactly, because the set of prefixes the generator loops over is
 * the set that either gets a glossary or gets the fallback.
 *
 * @param array<string,string> $enKeys    English language array (values unused).
 * @param array<string,array>  $prefixMap prefixToTermNames().
 * @param array<string,string> $declared  prefix => why it owns no glossary term.
 * @return array{unwired:array<string,int>,contradictory:array<int,string>,stale:array<int,string>,unused:array<int,string>}
 */
function ecPrefixMapFindings(array $enKeys, array $prefixMap, array $declared): array
{
    $counts = [];
    foreach (array_keys($enKeys) as $key) {
        $parts = explode('_', (string) $key, 2);
        if (count($parts) === 2 && $parts[0] !== '') {
            $counts[$parts[0]] = ($counts[$parts[0]] ?? 0) + 1;
        }
    }
    ksort($counts);

    $unwired = [];
    foreach ($counts as $prefix => $n) {
        if (!isset($prefixMap[$prefix]) && !isset($declared[$prefix])) {
            $unwired[$prefix] = $n;
        }
    }

    // Both lists at once says two people disagreed, and the map WINS at runtime -- so the
    // declaration is a comment that reads as a decision and is not one.
    $contradictory = [];
    foreach ($declared as $prefix => $why) {
        if (isset($prefixMap[$prefix])) { $contradictory[] = $prefix; }
    }

    // A declaration for a prefix English no longer has.
    $stale = [];
    foreach ($declared as $prefix => $why) {
        if (!isset($counts[$prefix])) { $stale[] = $prefix; }
    }

    // Wired, but nothing to deliver it to. Harmless; listed, not failed.
    $unused = [];
    foreach (array_keys($prefixMap) as $prefix) {
        if (!isset($counts[$prefix])) { $unused[] = $prefix; }
    }
    sort($unused);

    return ['unwired' => $unwired, 'contradictory' => $contradictory,
            'stale' => $stale, 'unused' => $unused, 'counts' => $counts];
}

if (defined('PREFIX_MAP_LIB_ONLY')) {
    return;
}

require_once __DIR__ . '/prefix_terms.inc.php';
$root = dirname(__DIR__, 2);
$ec_lang = [];
$ec_lang_syn = [];
include $root . '/lib/lang.ec.en.php';

$prefixMap = prefixToTermNames();
$f = ecPrefixMapFindings($ec_lang, $prefixMap, EC_NO_GLOSSARY_PREFIXES);

$fatal = count($f['unwired']) + count($f['contradictory']) + count($f['stale']);

if ($f['unwired']) {
    echo 'Prefixes reaching a translation sprint with the DEFAULT three terms: '
        . count($f['unwired']) . "\n\n";
    foreach ($f['unwired'] as $prefix => $n) {
        echo "  '$prefix' owns $n English key(s) and is in neither list.\n";
    }
    echo "\nEach of these gets flow, velocity and slope and nothing else -- no definitions, no\n";
    echo "preferred translations, and no avoid arrays, which are the whole point of a trap term.\n";
    echo "Nothing warns: payloads generate, --check says FRESH, the sprint runs, the guards were\n";
    echo "never delivered.\n\n";
    echo "Two fixes, and one of them is always right:\n";
    echo "  1. Wire it. Add the prefix to prefixToTermNames() in dev/scripts/prefix_terms.inc.php,\n";
    echo "     listing the glossary.json terms the calculator uses. Verify by reading\n";
    echo "     glossary_terms_by_prefix.<prefix> out of a generated payload -- exactly three\n";
    echo "     entries means it is still falling back.\n";
    echo "  2. Declare it. If the prefix owns no technical concept (page chrome, unit symbols),\n";
    echo "     add it to EC_NO_GLOSSARY_PREFIXES at the top of this file WITH THE REASON.\n\n";
}

if ($f['contradictory']) {
    echo "In BOTH lists, which cannot both be true: " . implode(', ', $f['contradictory']) . "\n";
    echo "prefixToTermNames() wins at runtime, so the declaration here is a comment pretending to\n";
    echo "be a decision. Delete whichever one is wrong.\n\n";
}

if ($f['stale']) {
    echo "Declared as owning no glossary term, but English has no such prefix any more: "
        . implode(', ', $f['stale']) . "\n";
    echo "The decision it records is about something that is gone. Remove the entry from\n";
    echo "EC_NO_GLOSSARY_PREFIXES, or find out where the keys went.\n\n";
}

if ($fatal) {
    exit(1);
}

echo 'Prefix glossary map OK -- ' . count($f['counts']) . ' prefixes in lib/lang.ec.en.php: '
    . (count($f['counts']) - count(EC_NO_GLOSSARY_PREFIXES)) . ' wired to glossary terms, '
    . count(EC_NO_GLOSSARY_PREFIXES) . " declared to own none.\n";
if ($f['unused']) {
    echo 'NOTE: wired but owning no English key today: ' . implode(', ', $f['unused']) . ".\n";
    echo "      They deliver nothing to nobody and cost nothing. Whether one is legacy debt is a\n";
    echo "      judgement (CLAUDE.md records 'irr' as probably a legacy alias of ip), so this is\n";
    echo "      a note and not a failure.\n";
}
exit(0);
