<?php
/**
 * A `lpn_` SETTING BELONGS TO THE PROJECT OR TO THE BROWSER, NEVER TO BOTH.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * THE RULE (Tom, 2026-09-04, closing ROADMAP Task 584, adopted verbatim into CLAUDE.md): modelling
 * data rides in `serializeProject()`; WINDOW FURNITURE follows the browser and
 * `serializeProject()` **must never learn about it**. Where a box sits and how wide a pane is is a
 * fact about the SCREEN somebody is sitting at, and *"a colleague opening the file on a laptop must
 * not inherit a 32-inch layout."*
 *
 * WHY IT IS SILENT, WHICH IS THE ONLY REASON THIS IS WORTH A SCRIPT. A furniture value that leaked
 * into the file is invisible to whoever added it: on their machine it restores the layout they
 * already had. It is visible only to the second person to open that project, on a different screen,
 * and what they see is not an error -- it is a pane in the wrong place, which reads as a bug in the
 * page rather than as something the file did. Nobody on this side of the save ever sees it.
 *
 * TWO LEGS, AND THE SECOND IS THE ONE THAT KEEPS THE FIRST HONEST.
 *
 *   1. **No furniture key inside `serializeProject()`.** Its body is read between its own `function`
 *      line and the matching close, and every furniture key -- by CONSTANT NAME and by string VALUE
 *      -- must be absent from it.
 *
 *   2. **Every browser-scoped key is DECLARED here, with the reason it is not project data.** This
 *      is where the check earns its keep, because leg 1 alone would be a list somebody has to
 *      remember to extend. CLAUDE.md names four furniture keys; the page writes SIX, and the two it
 *      does not name (`lpn_libbox`, `lpn_show_titles`) are exactly the ones a typed list would have
 *      missed. So the list is DERIVED from the source -- every `localStorage.setItem(<CONST>, ...)`
 *      in `js/looped-network.js` that is not the project store's own `writeJSON()` -- and an
 *      underived key fails until somebody writes down which side of the line it is on. That is the
 *      question Task 584 exists to force, asked at the moment the storage is added rather than
 *      after a colleague has opened the file.
 *
 * WHAT THIS IS NOT. `storage_inventory_check.php` asks whether a written key is DOCUMENTED in
 * `dev/cookie-storage-inventory.md` -- a question about disclosure, answered against a markdown
 * file, and it never opens `serializeProject()`. `scenario_seam_check.php` holds a different write
 * seam entirely (`setProp()`, base against scenario). This check asks the one question neither
 * does: which of the two homes does this value live in. A key can be perfectly documented, go
 * through every correct seam, and still be in the wrong one.
 *
 * OUT OF SCOPE, said plainly. The other half of the rule -- that MODELLING data must ride in
 * `serializeProject()` -- is not mechanisable: which value is modelling data is exactly the
 * judgement Tom made by hand. And *"NEVER a save-current-settings-as-default button"* is a design
 * decision about a control that does not exist; `openNewProjectBox()` states it where it would be
 * tempting, and a check for the absence of an unwritten button would be guarding nothing.
 *
 * Exit 0 clean, 1 on any finding. Blocking: both legs are mechanical.
 */

/**
 * Every localStorage key `js/looped-network.js` writes DIRECTLY, as constant => value.
 *
 * "Directly" means `localStorage.setItem(<CONST>, ...)` with a constant receiver. The project store
 * writes through `writeJSON(key, obj)` with a computed key, so it is excluded by construction
 * rather than by name -- which is what keeps a new project-store key from having to be declared.
 *
 * Pure, so lpn_furniture_selftest.php can put fixtures through it.
 *
 * @return array<string,string> CONST_NAME => 'literal value'
 */
function ecLpnDirectStorageKeys(string $js): array
{
    preg_match_all('/localStorage\.setItem\(\s*([A-Z][A-Z0-9_]*)\s*,/', $js, $sm);
    $out = [];
    foreach (array_unique($sm[1]) as $const) {
        if (preg_match('/\b' . preg_quote($const, '/') . '\s*=\s*\'([^\']*)\'/', $js, $vm)) {
            $out[$const] = $vm[1];
        } else {
            $out[$const] = '';
        }
    }
    ksort($out);
    return $out;
}

/**
 * The body of one named function, from its `function` line to the matching close brace.
 *
 * Brace counting is enough here and deliberately not more: this reads ONE known function whose
 * body contains no brace inside a string or a regex literal, and a full JS parser for a membership
 * test would be a second thing to keep correct. If the function ever grows one, the count goes
 * wrong and the returned body is short -- which is why the caller asserts the body's length.
 *
 * Pure.
 */
function ecJsFunctionBody(string $js, string $name): ?string
{
    $at = strpos($js, 'function ' . $name . '(');
    if ($at === false) { return null; }
    $open = strpos($js, '{', $at);
    if ($open === false) { return null; }
    $depth = 0;
    for ($i = $open, $n = strlen($js); $i < $n; $i++) {
        if ($js[$i] === '{') { $depth++; }
        elseif ($js[$i] === '}') {
            $depth--;
            if ($depth === 0) { return substr($js, $open, $i - $open + 1); }
        }
    }
    return null;
}

/**
 * BROWSER-SCOPED KEYS, each with the reason it is a fact about the screen rather than about the
 * network. A key written directly and not listed here fails: somebody has to say which side of
 * Task 584's line it is on.
 *
 * The four CLAUDE.md names, plus the two it does not.
 */
const EC_LPN_FURNITURE = [
    'lpn_pane'        => 'height and open tab of the bottom pane',
    'lpn_rpane'       => 'width of the right pane',
    'lpn_setbox'      => 'position and size of the Settings box',
    'lpn_findbox'     => 'position and size of the Find and replace box',
    'lpn_libbox'      => 'position and size of the Library box',
    // The four report boxes, on Tom's word (2026-09-08: *"only Settings and Libraries survive a
    // reload... Fix this."*). Same purpose and the same shape of record as the three boxes above.
    'lpn_ffbox'       => 'position, size and openness of the Fire flow box',
    'lpn_energybox'   => 'position, size and openness of the Pump energy report',
    'lpn_cmpbox'      => 'position, size and openness of the Scenario comparison box',
    'lpn_reportbox'   => 'position, size and openness of the EPANET run report box',
    'lpn_show_titles' => 'whether the page titles above the map are shown -- a reading preference '
                       . 'on this screen, and the four small-screen items of Task 486 turn it off',
];

if (defined('LPN_FURNITURE_LIB_ONLY')) {
    return;
}

$root = dirname(__DIR__, 2);
$path = $root . '/js/looped-network.js';
$js = file_get_contents($path);
$problems = [];

$written = ecLpnDirectStorageKeys($js);
if (!$written) {
    $problems[] = 'js/looped-network.js: no direct localStorage.setItem(<CONST>, ...) site found at '
        . 'all. The page writes six; this check has gone blind rather than the page having stopped '
        . 'writing.';
}

// ---- Leg 2: every directly-written key is classified ------------------------------------------
foreach ($written as $const => $value) {
    if ($value === '') {
        $problems[] = sprintf('js/looped-network.js: %s is written to localStorage but this check '
            . 'could not read its literal value.', $const);
        continue;
    }
    if (!array_key_exists($value, EC_LPN_FURNITURE)) {
        $problems[] = sprintf("js/looped-network.js writes '%s' (%s) straight to localStorage, and "
            . 'nothing here says which home it belongs to. A lpn_ setting belongs to the PROJECT or '
            . 'to the BROWSER, never to both (Task 584): if it is modelling data it rides in '
            . 'serializeProject(); if it is window furniture, add it to EC_LPN_FURNITURE in this '
            . 'script with the reason it is a fact about the screen.', $value, $const);
    }
}

// ---- Leg 1: serializeProject() has never heard of any of them ----------------------------------
$body = ecJsFunctionBody($js, 'serializeProject');
if ($body === null || strlen($body) < 500) {
    $problems[] = 'js/looped-network.js: could not read the body of serializeProject(). It was '
        . 'renamed or reshaped, and this check is reading nothing; fix it deliberately rather than '
        . 'leaving it green.';
} else {
    foreach ($written as $const => $value) {
        if (!array_key_exists($value, EC_LPN_FURNITURE)) { continue; }
        $hit = strpos($body, $const) !== false ? $const
             : (strpos($body, "'" . $value . "'") !== false ? "'$value'" : null);
        if ($hit !== null) {
            $problems[] = sprintf('serializeProject() names %s. Window furniture is not project '
                . 'data: %s. A colleague opening this file on a laptop must not inherit the layout '
                . 'of the screen it was saved from.', $hit, EC_LPN_FURNITURE[$value]);
        }
    }
}

if ($problems) {
    echo 'lpn_ project/browser boundary: ' . count($problems) . " problem(s)\n\n";
    foreach ($problems as $p) { echo "  $p\n\n"; }
    echo "Tom, 2026-09-04: \"A new project gets the hard-coded defaults, always. If you want\n";
    echo "otherwise, save a template or copy a project. Window furniture is not project data and\n";
    echo "follows the browser.\"\n";
    exit(1);
}

printf("lpn_ project/browser boundary OK -- %d key(s) written straight to localStorage, all %d "
    . "declared browser-scoped, none named by serializeProject() (%d bytes read).\n",
    count($written), count(EC_LPN_FURNITURE), strlen((string) $body));
