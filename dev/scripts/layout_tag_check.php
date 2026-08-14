<?php
/**
 * Commentary-tag check for $ec_lang_syn (ROADMAP Task 299).
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS EXISTS. A `layout:` tag is an instruction a translator obeys. CLAUDE.md spells out what
 * each value stands for -- `nav item` means "competing for width with every sibling; prefer the
 * shortest synonym you have" -- so a WRONG tag is worse than a missing one, because it is
 * confidently obeyed and the translator has no way to see it is false.
 *
 * That is not hypothetical. In the Task 297 sprint, `lpn_backdrop_scale_entry` carried
 * `layout: nav item` describing a <select> that Task 276 had already replaced with a menu button --
 * so the width pressure the tag described no longer existed. Four agents (bg, pt, uk, zh)
 * independently flagged the string as too long and compressed it, and pt went further and proposed
 * shortening the ENGLISH source so every language would inherit the cut. All four were reasoning
 * correctly from a constraint that had been false for weeks. Auditing the other 22 tags then found
 * `lpn_help_walkthroughs` carrying the same wrong tag, which is the argument for a check rather
 * than a second careful read: the first defect was known and the second still needed finding.
 *
 * The rule this enforces is CLAUDE.md's own: when you are about to write a rule, ask whether it can
 * be a check. A tag describes a WIDGET, and nothing else in the repo connects the two, so the tag
 * goes stale silently whenever the widget changes.
 *
 * Exit 0 = every tag is from the vocabulary and matches how its key is actually rendered.
 * Exit 1 = at least one blocking finding.
 *
 * Usage:
 *   php dev/scripts/layout_tag_check.php
 *   php dev/scripts/layout_tag_check.php --verbose    # also print what each tag was matched against
 */

require_once __DIR__ . '/lang_parse.inc.php';

const EN_LANG   = __DIR__ . '/../../lib/lang.ec.en.php';
// realpath() IS LOAD-BEARING. Spelled as __DIR__.'/../..' the constant expands to
// ".../engcalcs/dev/scripts/../..", so EVERY path built from it contains the literal substring
// "/dev/" -- and loadSources()'s filter, which skips tooling under dev/, then excluded the whole
// repository. The check reported 16 false "no <th> renders it" findings on keys that are plainly
// inside a <th>. Caught while writing it, and worth the comment: a path filter matching on a
// substring of an unnormalised path is a trap that looks like it works.
define('REPO_ROOT', realpath(__DIR__ . '/../..'));

// The vocabulary, straight from CLAUDE.md's tag table. A value outside this list is a finding all by
// itself: tags are shorthand that resolve to a full instruction defined in one place, so prose in
// the slot means the instruction was never written down and the translator is guessing at it.
const LAYOUT_VALUES = ['column heading', 'unit token', 'nav item', 'button'];
const KNOWN_TAGS    = ['layout', 'avoid', 'symbol', 'gloss', 'runtime'];

exit(main($argv));

function main(array $argv): int
{
    $verbose = in_array('--verbose', $argv, true);

    $syn = ecLangSynRawValues((string)file_get_contents(EN_LANG));
    if ($syn === []) {
        fwrite(STDERR, "No \$ec_lang_syn entries found in " . EN_LANG . "\n");
        return 1;
    }

    $sources = loadSources();
    $findings = [];
    $checked = 0;

    foreach ($syn as $key => $value) {
        $pipe = strpos($value, '|');
        if ($pipe === false) {
            continue; // no commentary side, nothing to check
        }
        foreach (splitTags(substr($value, $pipe + 1)) as [$tag, $tagValue]) {
            if (!in_array($tag, KNOWN_TAGS, true)) {
                // FREE-FORM COMMENTARY IS LEGAL AND THIS CHECK DOES NOT POLICE IT. CLAUDE.md asks
                // authors to prefer the tag vocabulary over prose, but that is a preference, and
                // five human-authored entries (cs_water_value, cs_lining_cost, rc_yn,
                // rc_apron_length, ws_main_menu) carry bare prose that is perfectly clear to a
                // translator. Failing the build on those would be this check inventing a rule
                // nobody agreed to, and $ec_lang_syn is human territory. A finding is raised only
                // for something SHAPED like a tag -- a short lowercase word then a colon -- because
                // that is a typo or an invented token, not a considered sentence.
                if (preg_match('/^[a-z][a-z-]{1,11}$/', $tag)) {
                    $findings[] = [$key, "'{$tag}:' looks like a tag but is not one — add it to CLAUDE.md's tag table first, or use one of: " . implode(', ', KNOWN_TAGS)];
                }
                continue;
            }
            if ($tag !== 'layout') {
                continue; // gloss is checked by gloss_ref_check.php; avoid/symbol/runtime are free text
            }
            $checked++;
            if (!in_array($tagValue, LAYOUT_VALUES, true)) {
                $findings[] = [$key, "layout value '{$tagValue}' is not in the vocabulary (" . implode(' / ', LAYOUT_VALUES) . "). Prose in a tag slot is an instruction nobody defined — define the token in CLAUDE.md, or use a different tag"];
                continue;
            }
            $problem = checkLayout($key, $tagValue, $sources, $verbose);
            if ($problem !== null) {
                $findings[] = [$key, $problem];
            }
        }
    }

    echo "layout: tags checked in lang.ec.en.php\n";
    if ($findings === []) {
        echo "  {$checked} tag(s), 0 error(s)\n\nPASS: every layout tag matches the widget it describes.\n";
        return 0;
    }

    echo "  {$checked} tag(s), " . count($findings) . " error(s)\n\n";
    foreach ($findings as [$key, $msg]) {
        echo "  ! {$key}\n      {$msg}\n";
    }
    echo "\nFAIL: a wrong layout tag is obeyed by 26 translators. Fix the tag or the widget.\n";
    return 1;
}

/**
 * Split a commentary string into [tag, value] pairs. Flags (e.g. `symbol`) come back with ''.
 *
 * A NAIVE explode(';') IS WRONG, and this is the whole subtlety of the parser. Tag values are prose
 * and prose contains semicolons -- menu_libre's real commentary is
 * `avoid: free of charge (gratis); transliterating "libre" as a brand name`, one avoid whose value
 * happens to have a semicolon in it. Splitting on every semicolon turned that tail into a phantom
 * tag named after its own text, and the first run of this check invented eight such tags across
 * seven keys. So a new tag begins ONLY at a known tag name; anything else is a continuation of the
 * value before it, which is also the forgiving reading for a human-authored field.
 */
function splitTags(string $commentary): array
{
    $names = implode('|', array_map(static fn($t) => preg_quote($t, '/'), KNOWN_TAGS));
    $parts = preg_split('/;\s*(?=(?:' . $names . ')\s*[:;]|(?:' . $names . ')\s*$)/', $commentary);
    $out = [];
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part === '') {
            continue;
        }
        // `symbol; <prose>` -- a flag followed by a sentence. Peel the flag off so it is recognised
        // and the sentence is treated as the free-form commentary it is (wi_notes_we_def).
        if (preg_match('/^(' . implode('|', KNOWN_TAGS) . ')\s*;\s*(.+)$/s', $part, $mm)) {
            $out[] = [$mm[1], ''];
            $part = $mm[2];
        }
        $colon = strpos($part, ':');
        if ($colon === false) {
            $out[] = [$part, ''];
        } else {
            $out[] = [trim(substr($part, 0, $colon)), trim(substr($part, $colon + 1))];
        }
    }
    return $out;
}

function checkLayout(string $key, string $value, array $sources, bool $verbose): ?string
{
    switch ($value) {
        case 'unit token':
            // Unit tokens reach an <option> only via $ec_lang['u_' . $unit] in Calculators.lib.php,
            // so the name IS the render path here — a non-u_ key cannot be one.
            return strncmp($key, 'u_', 2) === 0
                ? null
                : "tagged 'unit token' but the key is not named u_* — echoUnitSelect() builds option labels as \$ec_lang['u_' . \$unit], so only a u_* key can reach a units dropdown";

        case 'column heading':
            if (renderedInsideTh($key, $sources)) {
                return null;
            }
            // A key nothing renders cannot have a wrong WIDGET, because it has no widget. That is
            // real debt, but it belongs to key_hygiene_check.php, and CLAUDE.md is explicit that an
            // unreferenced key is a human judgement call (parked feature vs lost content) that no
            // tool should make. Two checks blocking on one defect just teaches people to mute both.
            //
            // The case that prompted this branch, mi_d50in, is GONE -- Tom ruled on 2026-08-13 that
            // "mi should no longer have any d50 keys" and it was deleted from all 27 files. The
            // branch stays because the next unreferenced tagged key will arrive the same way, and
            // because a guard removed once its first instance is fixed is a guard you write twice.
            if (!renderedAnywhere($key, $sources)) {
                return null;
            }
            return "tagged 'column heading' but the key is rendered outside any <th> — either it moved out of the table, or the tag was inherited from a sibling that is still in one";

        case 'nav item':
            // The defect this check was built for. A row inside openMenu(anchor, [...]) is a
            // pull-down entry: the popup sizes to its own widest row and competes with nothing, so
            // "prefer the shortest synonym" is a false constraint. A menu-BAR button competes for
            // real estate with every sibling and genuinely is one.
            if (isOnlyPulldownRow($key, $sources)) {
                return "tagged 'nav item' but the key is only ever a row inside a pull-down (openMenu). A pop-up menu sizes to its own widest row, so nothing competes for width — the tag tells 26 translators to compress a label that has room. Drop the tag, or move the key to a menu bar";
            }
            return null;

        case 'button':
            return null; // buttons are built too many ways (PHP, JS dialogs, menu rows) to assert

        default:
            return null;
    }
}

/** True if any page or script mentions the key at all. */
function renderedAnywhere(string $key, array $sources): bool
{
    foreach (['php', 'js'] as $kind) {
        foreach ($sources[$kind] as $src) {
            if (strpos($src, "'" . $key . "'") !== false) {
                return true;
            }
        }
    }
    return false;
}

/** True if any .php page renders $key inside a <th>…</th>. */
function renderedInsideTh(string $key, array $sources): bool
{
    foreach ($sources['php'] as $src) {
        if (strpos($src, $key) === false) {
            continue;
        }
        if (preg_match_all('/<th\b.*?<\/th>/s', $src, $m)) {
            foreach ($m[0] as $cell) {
                if (strpos($cell, "'" . $key . "'") !== false) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * True if every JS use of $key sits inside an openMenu(...) rows array and none is a menu-bar entry.
 * buildMenuBar() rows carry an `id:`, which is what separates a bar button from a pull-down row.
 */
function isOnlyPulldownRow(string $key, array $sources): bool
{
    $seenAnywhere = false;
    foreach ($sources['js'] as $src) {
        if (!preg_match_all('/^.*\b' . preg_quote($key, '/') . '\b.*$/m', $src, $m)) {
            continue;
        }
        foreach ($m[0] as $line) {
            $seenAnywhere = true;
            // A menu-bar item is `{ id: 'lpn_menu_x', ... label: pc.KEY ... }` — the id is the tell.
            if (preg_match('/\bid:\s*\'/', $line)) {
                return false;
            }
        }
    }
    // A real navbar render in PHP disqualifies the key -- menu_libre is one, an <a> in the site nav.
    //
    // BUT THE pageConfig BRIDGE IS NOT A RENDER, and missing that made the first version of this
    // check useless for the exact defect it was written for. Looped-Network.php ships every lpn_
    // key to JS as a bridge line of the shape `lpn_backdrop_scale_entry: <\?= json_encode(...) ?\>,`
    // (escaped here because a literal close-tag in a comment ends PHP mode -- which it duly did on
    // the first attempt at writing this very comment). So every single lpn_ key "appears in PHP",
    // and every one was silently exempted. The check
    // passed a deliberate re-introduction of the Task 299 defect and only a mutation test found it.
    // Bridge lines are `<key>: <?=` at the start of a line; nothing else in the suite looks like that.
    foreach ($sources['php'] as $src) {
        foreach (explode("\n", $src) as $line) {
            if (strpos($line, "'" . $key . "'") === false) {
                continue;
            }
            if (preg_match('/^\s*[A-Za-z0-9_]+\s*:\s*<\?=/', $line)) {
                continue; // pageConfig bridge, not a widget
            }
            return false;
        }
    }
    return $seenAnywhere;
}

function loadSources(): array
{
    $out = ['php' => [], 'js' => []];
    foreach (['php', 'js'] as $ext) {
        foreach (rglob(REPO_ROOT, $ext) as $file) {
            // Language files are data, not render sites; dev/ is tooling.
            if (strpos($file, '/lib/lang.ec.') !== false || strpos($file, '/dev/') !== false) {
                continue;
            }
            $out[$ext][] = (string)file_get_contents($file);
        }
    }
    return $out;
}

function rglob(string $dir, string $ext): array
{
    $found = [];
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($it as $f) {
        if ($f->isFile() && strtolower($f->getExtension()) === $ext) {
            $found[] = $f->getPathname();
        }
    }
    return $found;
}
