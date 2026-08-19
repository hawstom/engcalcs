<?php
/**
 * Which glossary concepts reach which calculator prefix.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * EXTRACTED from generate_translation_payloads.php on 2026-08-12 so that
 * dev/scripts/gloss_ref_check.php can read the REAL map rather than a copy of it. A second copy
 * would defeat the point of that check: the failure it exists to catch is a glossary term that
 * never reaches an agent, and a stale duplicate of this map is one more way for that to happen
 * silently. CLAUDE.md's warning about this map applies unchanged -- a prefix missing here falls
 * back to three default terms, payloads still generate, --check still says FRESH, and every
 * avoid-array written for that calculator is simply never delivered.
 */

function prefixToTermNames(): array
{
    return [
        'dw' => ['flow', 'velocity', 'head loss', 'friction factor', 'slope', 'laminar', 'transitional', 'turbulent'],
        'hw' => ['flow', 'velocity', 'head loss', 'slope'],
        'mpf' => ['flow', 'velocity', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope', 'shear stress', 'head', 'velocity head'],
        'mphl' => ['flow', 'velocity', 'head loss', 'friction loss', 'minor loss', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope'],
        // 'specific gravity' and 'median rock size' added 2026-08-12: this page has mtc_sgrock and
        // mtc_d50_in, both rock-lining concepts, and both were pointing at glossary entries that
        // could not reach an agent from here. Found by gloss_ref_check.php.
        'mtc' => ['flow', 'velocity', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope', 'specific gravity', 'median rock size'],
        // 'median rock size' REMOVED 2026-08-13 with mi_d50in. Tom: "mtc needs and has D50 too.
        // Keep. But not mi." mi_ now has no rock-sizing key at all -- mi_notes_2_def sends the
        // reader to the Manning Trapezoidal calculator for rock lining -- so shipping the concept
        // to mi_ translators was context for a decision they no longer make. mtc and rc still
        // carry it, and the glossary entry itself is untouched.
        'mi' => ['flow', 'velocity', 'hydraulic radius', 'wetted perimeter', 'Manning roughness', 'slope', 'irregular channel'],
        'wfs' => ['flow', 'weir', 'headwater elevation', 'tailwater elevation', 'discharge coefficient'],
        'wfi' => ['flow', 'weir', 'headwater elevation', 'tailwater elevation', 'discharge coefficient'],
        'ws' => ['flow', 'weir', 'head', 'headwater elevation', 'tailwater elevation', 'discharge coefficient'],
        'wi' => ['flow', 'weir', 'headwater elevation', 'tailwater elevation', 'discharge coefficient', 'irregular channel'],
        'or' => ['flow', 'orifice', 'discharge coefficient', 'head', 'headwater elevation', 'tailwater elevation', 'crown'],
        'odt' => ['orifice', 'discharge coefficient', 'headwater elevation', 'tailwater elevation', 'crown'],
        'irr' => ['flow', 'weir', 'orifice', 'seepage', 'conveyance efficiency', 'check structure'],
        'ds' => ['flow', 'application rate', 'distribution uniformity', 'emitter'],
        'cs' => ['flow', 'conveyance efficiency', 'seepage'],
        'mhp' => ['flow', 'penstock', 'gross head', 'net head', 'plant efficiency', 'head loss', 'run-of-river', 'headworks', 'junction loss', 'minor loss'],
        'pd' => ['flow', 'penstock', 'gross head', 'net head', 'head loss', 'friction factor'],
        'rc' => ['flow', 'velocity', 'riprap', 'slope', 'rock chute', 'chute', 'unit discharge', 'median rock size', 'gradation', 'porosity', 'specific gravity', 'ponding', 'outlet apron', 'weir head', 'upstream', 'downstream', 'reach'],
        'rrc' => ['flow', 'velocity', 'riprap', 'slope', 'rock chute', 'chute', 'unit discharge', 'median rock size', 'gradation', 'porosity', 'specific gravity', 'ponding', 'outlet apron', 'weir head', 'upstream', 'downstream', 'reach'],
        // lpn/bpn were missing here until 2026-08-08, so both silently fell back to the
        // three default terms and the network-concept entries seeded in Task 193 — every one
        // of them carrying an 'avoid' array — never reached a translation agent.
        // Suite chrome, not a calculator -- but it owns the Restore-defaults button, so it needs
        // the concept too. Without an entry here it silently falls back to the default three.
        'calc' => ['default (setting)', 'flow', 'velocity', 'slope'],
        // 'menu' and 'about' were missing here until 2026-08-09 (Task 244), the same silent
        // fallback that bit lpn/bpn above: both own the 'libre software' concept -- the navbar
        // item and the About page license section -- and without an entry here the glossary
        // term, including its 'avoid' guards, would never have reached a translation agent.
        'menu' => ['libre software'],
        'about' => ['libre software'],
        // Suite chrome again, and the same silent-fallback trap: the Task 286 consent banner owns
        // 'count', whose wrong senses (mattering, relying, the noble title) would each turn a
        // request for permission into something else, and 'cookie', where the food is the literal
        // meaning of the English word. Without an entry here both fall back to flow/velocity/slope.
        'consent' => ['count (tally)', 'cookie (browser storage)', 'log (record)'],
        'privacy' => ['cookie (browser storage)', 'log (record)'],
        'terms' => ['cookie (browser storage)'],
        'lpn' => ['flow', 'velocity', 'head', 'head loss', 'friction loss', 'minor loss', 'pressure',
            'elevation', 'demand', 'static head', 'maximum allowable head', 'supply head',
            'supply curve', 'looped network', 'branched network', 'pipe line', 'pressure rating',
            'pressure reduction', 'energy grade line', 'Manning roughness', 'friction factor',
            'draw (a diagram)', 'junction', 'reservoir', 'node', 'link', 'vertex',
            // 'world file' added 2026-08-13 (Task 297): it appears in five of that sprint's nine new
            // keys, and its 'world' is a coordinate space, not the planet -- a false friend nothing
            // else would have guarded against.
            // Added 2026-08-17 (sprint 397-labels-colour-units). All four come out of the
            // colour-by-value block, and two of them carry traps this suite creates for itself:
            // 'gradient' is a HYDRAULIC quantity printed on every pipe, so a colour ramp must not
            // become a colour gradient, and a 'break' is something a water main does.
            'colour ramp', 'colour band limit', 'equal intervals / equal counts', 'fire flow',
            'background image', 'world file', 'pump curve', 'project (saved network)', 'scenario',
            'zoom to extents', 'default (setting)', 'upstream', 'downstream',
            // Added 2026-08-14 (Task 248 Wave 0). 'tank' and 'valve' are new ELEMENT TYPES, and
            // 'tank' is the sharper of the two: every language already has a reservoir word, and
            // reusing it for the tank makes two toolbar buttons indistinguishable. 'valve setting'
            // guards the one field whose physical quantity changes with the valve type, and
            // 'override (scenario value)' carries the eigenvalue trap behind "Own values".
            'tank', 'valve', 'valve setting', 'override (scenario value)', 'solver',
            // Added 2026-08-19 (Task 438 Wave 0). 'profile (long section)' guards the one word that
            // names the whole profile menu, whose dominant sense in web software is the user
            // account page; 'hydraulic grade line' keeps the chart legend and the prose beside it
            // from becoming two different phrases; 'demand pattern' is a named time series, not a
            // repeating design; 'imperial gallon' is what separates IMGD from MGD; 'pressure
            // breaker valve' has an electrical homonym; 'project mode name' says lat/lon and XY are
            // carried unchanged; 'alignment (text)' is not justification.
            'profile (long section)', 'hydraulic grade line', 'demand pattern', 'imperial gallon',
            'pressure breaker valve', 'project mode name', 'alignment (text)',
            // Added 2026-08-19 (Task 438 Wave 0, second pass over the resync set). 'drop (a label)'
            // guards a three-character column heading whose word is also a drop in head; 'run (a
            // simulation)' guards a one-word button whose word is also a run of pipe, and it is
            // quoted by name inside lpn_time_run_note; 'work out (compute)' is the suite's plain
            // verb for solving, opaque word by word to anyone parsing the two words separately.
            'drop (a label)', 'run (a simulation)', 'work out (compute)', 'decimal separator'],
        'bpn' => ['flow', 'velocity', 'head', 'head loss', 'friction loss', 'minor loss', 'pressure',
            'elevation', 'demand', 'static head', 'maximum allowable head', 'supply head',
            'supply curve', 'branched network', 'branch', 'pipe line', 'pressure rating',
            'pressure reduction', 'energy grade line', 'Manning roughness', 'friction factor',
            'junction', 'reservoir', 'node', 'link', 'default (setting)', 'upstream', 'downstream'],
        'ip' => ['flow', 'velocity', 'head loss', 'emitter', 'distribution uniformity', 'low-quarter distribution uniformity', 'application rate', 'lateral', 'mainline', 'reach', 'velocity head', 'friction loss', 'minor loss', 'energy grade line', 'upstream', 'downstream', 'bisection'],
    ];
}
