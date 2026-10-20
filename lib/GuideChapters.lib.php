<?php
/**
 * GuideChapters.lib.php -- which language keys make up each chapter of the User Guide (Task 816).
 *
 * ONE LIST, TWO READERS. The map application (Looped-Network.php) renders a chapter's term and
 * definition list from ecGuideDl(), and the chapter page (User-Manual.php) renders the same list from
 * the same function, so a chapter's words are written once, in `$ec_lang`, and a page about one
 * chapter can never carry a copy that has drifted from the Guide in the application.
 *
 * What is NOT here: the Toolbar and Menus sections, which the application derives at run time from
 * the toolbar and the menu rows themselves, and each box's one-line entry, which comes from the box.
 * A chapter page carries the words a person reads, and those two have no words of their own.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

/**
 * The chapters, in reading order.
 *
 * `title`  the language key of the chapter's heading, the same one the Guide shows.
 * `intro`  language keys of the paragraphs above the list (a box's help text), '\n\n' separating
 *          paragraphs inside one value.
 * `terms`  stems: `<stem>_term` is the heading and `<stem>_def` the definition (trusted HTML).
 * The slug is the chapter's address, an ASCII word that is never translated.
 *
 * @return array<string,array{title:string,intro:array<int,string>,terms:array<int,string>}>
 */
function ecGuideChapters() {
    return array(
        'using' => array('title' => 'lpn_guide_using_heading', 'intro' => array(), 'terms' => array('lpn_guide_keys', 'lpn_guide_use')),
        'map' => array('title' => 'lpn_hotkeys_map_heading', 'intro' => array(), 'terms' => array('lpn_hotkeys_map', 'lpn_guide_map_undo', 'lpn_guide_map_del', 'lpn_guide_map_esc', 'lpn_guide_map_letters')),
        'snip' => array('page' => false, 'title' => 'lpn_hotkeys_snip_heading', 'intro' => array(), 'terms' => array('lpn_hotkeys_snip')),
        'tables' => array('title' => 'lpn_hotkeys_tables_heading', 'intro' => array(), 'terms' => array('lpn_notes_6', 'lpn_notes_7', 'lpn_guide_tbl_tabs', 'lpn_guide_tbl_cell', 'lpn_guide_tbl_fill')),
        'about' => array('title' => 'lpn_guide_about_heading', 'intro' => array(), 'terms' => array('lpn_notes_1', 'lpn_notes_2')),
        'notes' => array('page' => false, 'title' => 'lpn_help_notes', 'intro' => array(), 'terms' => array('lpn_notes_3', 'lpn_notes_5', 'lpn_notes_color', 'lpn_notes_engine', 'lpn_guide_nt_example')),
        'find' => array('title' => 'lpn_find_title', 'intro' => array('lpn_guide_text_find_popup'), 'terms' => array('lpn_guide_find_query', 'lpn_guide_find_examples', 'lpn_guide_find_results', 'lpn_guide_find_replace', 'lpn_guide_find_notes')),
        'scenarios' => array('title' => 'lpn_sm_title', 'intro' => array('lpn_sm_help'), 'terms' => array('lpn_guide_scn_use', 'lpn_guide_scn_open', 'lpn_guide_scn_marks', 'lpn_guide_scn_make', 'lpn_guide_scn_scope', 'lpn_guide_scn_example', 'lpn_guide_scn_notes')),
        'libraries' => array('title' => 'lpn_library_menu', 'intro' => array('lpn_guide_text_library_box'), 'terms' => array('lpn_guide_lib_kinds', 'lpn_guide_lib_refs', 'lpn_guide_lib_scn', 'lpn_guide_lib_ctl', 'lpn_guide_lib_import', 'lpn_guide_lib_example', 'lpn_guide_lib_notes')),
        'properties' => array('title' => 'lpn_popup_boxtitle', 'intro' => array('lpn_guide_text_popup'), 'terms' => array('lpn_guide_prop_open', 'lpn_guide_prop_edit', 'lpn_guide_prop_id', 'lpn_guide_prop_scn', 'lpn_guide_prop_multi', 'lpn_guide_prop_example')),
        'settings' => array('title' => 'lpn_tool_settings', 'intro' => array('lpn_guide_text_settings_box'), 'terms' => array('lpn_guide_set_where', 'lpn_guide_set_search', 'lpn_guide_set_scn', 'lpn_guide_set_units', 'lpn_guide_set_assets', 'lpn_guide_set_reset')),
        'fire-flow' => array('title' => 'lpn_ff_title', 'intro' => array('lpn_ff_intro'), 'terms' => array('lpn_guide_ff_asks', 'lpn_guide_ff_result', 'lpn_guide_ff_marks', 'lpn_guide_ff_example')),
        'criticality' => array('title' => 'lpn_crit_title', 'intro' => array('lpn_crit_intro', 'lpn_crit_scope_tip'), 'terms' => array('lpn_guide_cr_case', 'lpn_guide_cr_dead', 'lpn_guide_cr_example')),
        'demand-scaling' => array('title' => 'lpn_ds_title', 'intro' => array('lpn_ds_intro'), 'terms' => array('lpn_guide_ds_run', 'lpn_guide_ds_find', 'lpn_guide_ds_scope', 'lpn_guide_ds_example')),
        'pump-energy' => array('title' => 'lpn_energy_title', 'intro' => array('lpn_guide_text_energy_box'), 'terms' => array('lpn_guide_en_read', 'lpn_guide_en_set', 'lpn_guide_en_example')),
        'contour-plot' => array('title' => 'lpn_contour_plot', 'intro' => array('lpn_guide_text_contour_box'), 'terms' => array('lpn_guide_ct_what', 'lpn_guide_ct_box', 'lpn_guide_ct_example')),
        'run-report' => array('title' => 'lpn_time_run_report', 'intro' => array('lpn_guide_text_rptbox'), 'terms' => array('lpn_guide_rr_what', 'lpn_guide_rr_example')),
        'status-changes' => array('title' => 'lpn_status_title', 'intro' => array('lpn_guide_text_status_box'), 'terms' => array('lpn_guide_st_what', 'lpn_guide_st_example')),
        'full-report' => array('title' => 'lpn_full_title', 'intro' => array('lpn_guide_text_full_box'), 'terms' => array('lpn_guide_fr_what', 'lpn_guide_fr_example')),
        'user-manual' => array('page' => false, 'title' => 'lpn_help_manual', 'intro' => array('lpn_guide_text_hotkeys_popup'), 'terms' => array('lpn_guide_own_example')),
        'calibration' => array('title' => 'lpn_calib_title', 'intro' => array('lpn_guide_text_calib_box'), 'terms' => array('lpn_guide_cal_what', 'lpn_guide_cal_file', 'lpn_guide_cal_example')),
        'scenario-comparison' => array('title' => 'lpn_scncmp_title', 'intro' => array('lpn_guide_text_scncmp_box'), 'terms' => array('lpn_guide_cmp_cols', 'lpn_guide_cmp_run', 'lpn_guide_cmp_byasset', 'lpn_guide_cmp_notes')),
    );
}

/**
 * The chapters that get a page of their own. A chapter marked 'page' => false is drawn in the
 * application's Guide and has no page: its words make no sense alone (Screenshot is a table of
 * two keys, Notes on this page is about the page it sits on, and the User manual chapter is the
 * index's own title).
 *
 * @return array<string,array>
 */
function ecGuidePageChapters() {
    return array_filter(ecGuideChapters(), function ($c) { return !isset($c['page']) || $c['page']; });
}

/** True when $slug has a page. The only test a request value goes through. */
function ecGuideIsChapter($slug) {
    $c = ecGuidePageChapters();
    return is_string($slug) && isset($c[$slug]);
}

/**
 * The chapter's paragraphs above its list, as plain text.
 *
 * @param string $slug  a chapter slug.
 * @return array<int,string>
 */
function ecGuideIntro($slug) {
    global $ec_lang;
    $c = ecGuideChapters();
    $out = array();
    if (!isset($c[$slug])) { return $out; }
    foreach ($c[$slug]['intro'] as $key) {
        if (!isset($ec_lang[$key])) { continue; }
        $text = (string)$ec_lang[$key];
        // The Demand scaling help carries two numbers the application fills from its own limits.
        $text = str_replace(array('{max}', '{step}'), array('20', '0.01'), $text);
        foreach (preg_split('/\\\\n\\\\n|\n\n/', $text) as $para) {
            if (trim($para) !== '') { $out[] = trim($para); }
        }
    }
    return $out;
}

/**
 * The chapter's opening paragraphs as HTML, with a sub-heading and a list made real.
 *
 * A paragraph that is one line ending in a colon, with something after it, is a sub-heading (its
 * colon dropped); a paragraph that begins "- " is a list item, and neighbouring items share one list.
 * Everything else is a paragraph. The application's Guide applies the same two rules in
 * guideBoxEntryParas() (js/looped-network.js); the box's "?" tip still shows the raw text.
 *
 * @param string $slug  a chapter slug.
 * @param string $h     the heading element for a sub-heading (h2 on a chapter page).
 * @return string
 */
function ecGuideIntroHtml($slug, $h = 'h2') {
    $paras = ecGuideIntro($slug);
    $html = '';
    $inList = false;
    $n = count($paras);
    foreach ($paras as $i => $p) {
        $isLi = strncmp($p, '- ', 2) === 0;
        if ($inList && !$isLi) { $html .= "</ul>\n"; $inList = false; }
        if ($isLi) {
            if (!$inList) { $html .= "<ul>\n"; $inList = true; }
            $html .= '<li>' . htmlspecialchars(substr($p, 2)) . "</li>\n";
        } elseif ($i < $n - 1 && strpos($p, "\n") === false && preg_match('/[:：]$/u', $p)) {
            $html .= '<' . $h . ' class="lpn-guide-subhead">' . htmlspecialchars(preg_replace('/[:：]$/u', '', $p)) . '</' . $h . ">\n";
        } else {
            $html .= '<p>' . htmlspecialchars($p) . "</p>\n";
        }
    }
    return $html . ($inList ? "</ul>\n" : '');
}

/**
 * The definition of the Map chapter's first row: the keyboard table, with the three rows the
 * application adds from other keys. Moved here from Looped-Network.php unchanged.
 */
function ecGuideMapDef() {
    global $ec_lang;
    return str_replace('</tbody></table>', '<tr><td>W</td><td>' . $ec_lang['lpn_hotkeys_zoomwin_def'] . '</td></tr></tbody></table>',
        preg_replace('~</tr>~', '</tr><tr><td>1</td><td>' . $ec_lang['lpn_tool_add_chain'] . '</td></tr><tr><td>A</td><td>'
            . rtrim($ec_lang['lpn_tool_area_tip'], '.') . '</td></tr>', $ec_lang['lpn_hotkeys_map_def'], 1));
}

/**
 * The chapter's term and definition list, as HTML.
 *
 * @param string $slug  a chapter slug.
 * @return string       a <dl> element, or '' for an unknown slug.
 */
function ecGuideDl($slug) {
    global $ec_lang;
    $c = ecGuideChapters();
    if (!isset($c[$slug])) { return ''; }
    $html = "<dl>\n";
    foreach ($c[$slug]['terms'] as $stem) {
        $def = ($slug === 'map' && $stem === 'lpn_hotkeys_map') ? ecGuideMapDef() : $ec_lang[$stem . '_def'];
        // A term that only repeats its chapter's heading is marked, and the stylesheet hides it.
        $dup = ($stem === 'lpn_hotkeys_map' || $stem === 'lpn_hotkeys_snip') ? ' class="lpn-guide-dup"' : '';
        $html .= "\t<dt" . $dup . '>' . $ec_lang[$stem . '_term'] . '</dt><dd>' . $def . "</dd>\n";
    }
    return $html . "</dl>";
}

/**
 * A meta description for a chapter: whole sentences only, never cut, about $max characters.
 *
 * The sentences come from the chapter's opening paragraphs (a paragraph that ends in a colon only
 * introduces a list and is skipped, as is a bullet), or from the first definition when it has none.
 * Sentences are added while they fit; the first is used whole even when it is longer than $max.
 *
 * @param string $slug
 * @param int    $max  budget for the sentences (the caller adds its own prefix).
 * @return string
 */
function ecGuideSummary($slug, $max = 130) {
    global $ec_lang;
    $c = ecGuideChapters();
    if (!isset($c[$slug])) { return ''; }
    $paras = array();
    foreach (ecGuideIntro($slug) as $p) {
        if (preg_match('/[:：]$/u', $p) || $p[0] === '-') { continue; }
        $paras[] = $p;
    }
    if (!$paras) {
        $stem = $c[$slug]['terms'][0];
        $paras[] = $ec_lang[$stem . '_def'];
    }
    $out = '';
    foreach ($paras as $p) {
        $p = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags(preg_replace('~</(td|tr|p|li)>~', '. ', $p)), ENT_QUOTES, 'UTF-8')));
        foreach (preg_split('/(?<=[.!?。！？])\s+/u', $p) as $sentence) {
            $sentence = trim($sentence);
            if ($sentence === '' || $sentence === '.') { continue; }
            $try = $out === '' ? $sentence : $out . ' ' . $sentence;
            if ($out !== '' && mb_strlen($try, 'UTF-8') > $max) { return $out; }
            $out = $try;
        }
    }
    return $out;
}
