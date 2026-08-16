<?php
/**
 * dump_calc_form.php -- renders one calculator page and dumps its FORM as JSON, so a Node
 * harness can drive the page's real calculator without a browser (ROADMAP Task 292).
 *
 * WHY THIS EXISTS. The 19 non-lpn calculators had no behavioural test at all: nothing anywhere
 * confirmed that Manning Pipe Flow still computes Manning pipe flow. The obstacle was never the
 * math -- each calculator's `pageCalculator` is a pure function of its form -- it was that the
 * form lives in rendered PHP, so a harness either had to restate the field names, the defaults
 * and the unit factors (a copy that drifts, testing itself instead of the app) or drive a real
 * browser (slow, and Tom's manual passes are exactly what the lpn harnesses exist to spare).
 *
 * This is the third option: render the page in-process, exactly as html_balance_check.php does,
 * and hand the harness the form it actually shipped -- every input name, every page default,
 * every unit select with its options and its data-family, the two unit presets, the page's
 * pageConfig strings and its script list. NOTHING IS RESTATED IN THE HARNESS. Change a default
 * in the .php and the harness sees the new default on the next run; there is no fixture to
 * regenerate and therefore none to go stale.
 *
 * Usage:
 *   php dev/scripts/dump_calc_form.php Manning-Pipe-Flow.php            # JSON on stdout
 *   php dev/scripts/dump_calc_form.php Manning-Pipe-Flow.php --pretty
 *   php dev/scripts/dump_calc_form.php Manning-Pipe-Flow.php --lang=es   # the SI defaults
 *
 * Exit 0 on success, 1 if the page could not be rendered or has no calculator form.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

$root = dirname(__DIR__, 2);

$args = array_slice($argv, 1);
$pretty = in_array('--pretty', $args, true);
$lang = '';
foreach ($args as $a) {
    if (preg_match('/^--lang=([a-z]{2})$/i', $a, $m)) { $lang = strtolower($m[1]); }
}
$files = array_values(array_filter($args, function ($a) { return substr($a, 0, 1) !== '-'; }));
if (count($files) !== 1) {
    fwrite(STDERR, "usage: php dev/scripts/dump_calc_form.php <Page.php> [--pretty]\n");
    exit(1);
}
$page = basename($files[0]);
$path = $root . '/' . $page;
if (!is_file($path)) {
    fwrite(STDERR, "dump_calc_form.php: no such page: $page\n");
    exit(1);
}

$html = render_page($path, $lang);
if ($html === null) {
    fwrite(STDERR, "dump_calc_form.php: $page threw while rendering\n");
    exit(1);
}

$out = array(
    'page'           => $page,
    'lang'           => $lang === '' ? 'en' : $lang,
    'scripts'        => extract_scripts($html),
    'unitSets'       => extract_json_assign($html, 'EngCalcs.unitSets'),
    // Task 390: a unit select's option value is the unit's NAME, so a harness that wants the
    // conversion factor needs this table -- the same one echoHTMLHead() emits for the browser.
    'unitFactors'    => extract_json_assign($html, 'EngCalcs.unitFactors'),
    'defaultUnitSet' => extract_string_assign($html, 'EngCalcs.defaultUnitSet'),
    'pageConfig'     => extract_page_config($html),
    'fields'         => extract_fields($html),
    'ids'            => extract_ids($html),
);

if ($out['fields'] === array()) {
    fwrite(STDERR, "dump_calc_form.php: $page rendered no form fields -- is it a calculator?\n");
    exit(1);
}

echo json_encode($out, $pretty ? JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES : JSON_UNESCAPED_UNICODE), "\n";
exit(0);

// ---------------------------------------------------------------------------------------------

/**
 * Renders a page and returns its HTML, or null if it could not be rendered.
 * Delegated to dev/scripts/render_page.php in a SUBPROCESS -- see the long note in that file for
 * why a page must be included at global scope and one page per process. Rendering it here would
 * quietly produce a page missing its unit selects, which is precisely what this dump needs.
 */
function render_page($path, $lang = '')
{
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg(basename($path))
         . ($lang === '' ? '' : ' ' . escapeshellarg('--lang=' . $lang)) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    return ($html === null || trim($html) === '') ? null : $html;
}

/** The page's own <script src> list, in load order, as repo-relative paths. */
function extract_scripts($html)
{
    preg_match_all('#<script[^>]+src="/engcalcs/(js/[^"?]+)#i', $html, $m);
    $seen = array();
    foreach ($m[1] as $src) {
        if (!in_array($src, $seen, true)) { $seen[] = $src; }
    }
    return $seen;
}

/** `EngCalcs.<name> = {...json...};` on one line (how echoCalculatorForm emits the presets). */
function extract_json_assign($html, $name)
{
    if (!preg_match('/' . preg_quote($name, '/') . '\s*=\s*(\{.*\});/', $html, $m)) {
        return null;
    }
    return json_decode($m[1], true);
}

/** `EngCalcs.<name> = 'value';` */
function extract_string_assign($html, $name)
{
    if (!preg_match('/' . preg_quote($name, '/') . "\s*=\s*'([^']*)'/", $html, $m)) {
        return null;
    }
    return $m[1];
}

/**
 * The page's `EngCalcs.pageConfig = { key: <json>, ... };` block. Keys are unquoted JS
 * identifiers and every value is json_encode()d by the page, so it is parsed line by line
 * rather than fed to json_decode whole.
 */
function extract_page_config($html)
{
    // BRACE-MATCHED, not pattern-matched to some assumed closing line. Two regexes were tried
    // first and both were wrong on a real page: `\n};` misses Manning-Pipe-Flow, where PHP eats
    // the newline after the last value's closing tag so `};` shares its line; `};\s*</script>`
    // misses Orifice-Drain-Time, where echoCookieScript() emits more JS between the two. A miss
    // is silent -- the harness just sees an empty pageConfig and the page's verdict strings come
    // out as "undefined", which reads exactly like a missing language key.
    $start = strpos($html, 'EngCalcs.pageConfig');
    if ($start === false) { return new stdClass(); }
    $open = strpos($html, '{', $start);
    if ($open === false) { return new stdClass(); }
    $depth = 0; $inStr = false; $end = null;
    for ($i = $open, $n = strlen($html); $i < $n; $i++) {
        $ch = $html[$i];
        if ($inStr) {
            if ($ch === '\\') { $i++; }
            elseif ($ch === '"') { $inStr = false; }
            continue;
        }
        if ($ch === '"') { $inStr = true; }
        elseif ($ch === '{') { $depth++; }
        elseif ($ch === '}') { $depth--; if ($depth === 0) { $end = $i; break; } }
    }
    if ($end === null) { return new stdClass(); }
    $m = array(1 => substr($html, $open + 1, $end - $open - 1));

    $cfg = array();
    foreach (preg_split('/\r?\n/', $m[1]) as $line) {
        if (preg_match('/^\s*(\w+)\s*:\s*(.+?),?\s*$/', $line, $kv)) {
            $val = json_decode($kv[2], true);
            $cfg[$kv[1]] = ($val === null && strtolower(trim($kv[2])) !== 'null') ? trim($kv[2]) : $val;
        }
    }
    return $cfg;
}

/**
 * Every named form control on the page: inputs (with their page default), selects (with every
 * option's value, unit key and which one the preset selected), and radios grouped by name --
 * a radio GROUP reports the checked member's value, or '' when none is checked, because that is
 * what `objForm.n_radio.value` gives a calculator in a real browser.
 */
function extract_fields($html)
{
    $fields = array();

    // --- <input> ---
    preg_match_all('/<input\b([^>]*)>/i', $html, $m);
    foreach ($m[1] as $attrs) {
        $a = parse_attrs($attrs);
        $name = isset($a['name']) ? $a['name'] : (isset($a['id']) ? $a['id'] : null);
        if ($name === null) { continue; }
        $type = isset($a['type']) ? strtolower($a['type']) : 'text';
        if ($type === 'radio') {
            if (!isset($fields[$name])) {
                $fields[$name] = array('tag' => 'radio', 'value' => '', 'options' => array());
            }
            $fields[$name]['options'][] = isset($a['value']) ? $a['value'] : '';
            if (isset($a['checked'])) { $fields[$name]['value'] = isset($a['value']) ? $a['value'] : ''; }
            continue;
        }
        if ($type === 'checkbox') {
            $fields[$name] = array('tag' => 'checkbox', 'checked' => isset($a['checked']),
                'value' => isset($a['value']) ? $a['value'] : '');
            continue;
        }
        $fields[$name] = array('tag' => 'input', 'type' => $type,
            'value' => isset($a['value']) ? $a['value'] : '');
    }

    // --- <select> ---
    preg_match_all('/<select\b([^>]*)>(.*?)<\/select>/is', $html, $m, PREG_SET_ORDER);
    foreach ($m as $sel) {
        $a = parse_attrs($sel[1]);
        $name = isset($a['name']) ? $a['name'] : (isset($a['id']) ? $a['id'] : null);
        if ($name === null) { continue; }
        $options = array();   // option value => option value; since Task 390 a unit select's
                              // value IS the unit key, so this map is the identity for one.
        $order = array();
        $selected = null;
        preg_match_all('/<option\b([^>]*)>/i', $sel[2], $om);
        foreach ($om[1] as $oattrs) {
            $oa = parse_attrs($oattrs);
            $val = isset($oa['value']) ? $oa['value'] : '';
            $options[$val] = $val;
            $order[] = $val;
            if (isset($oa['selected'])) { $selected = $val; }
        }
        if ($selected === null && $order) { $selected = $options[$order[0]]; }
        $fields[$name] = array(
            'tag'      => 'select',
            'family'   => isset($a['data-family']) ? $a['data-family'] : null,
            'value'    => $selected,
            'options'  => $options,
            'order'    => $order,
        );
    }

    return $fields;
}

/** Every id the rendered page defines, so the harness can refuse to invent one. */
function extract_ids($html)
{
    preg_match_all('/\bid="([^"]+)"/', $html, $m);
    return array_values(array_unique($m[1]));
}

/** Attribute string -> assoc array. Valueless attributes (checked, selected) map to ''. */
function parse_attrs($attrs)
{
    $out = array();
    preg_match_all('/([-\w]+)(?:\s*=\s*"([^"]*)"|\s*=\s*\'([^\']*)\')?/', $attrs, $m, PREG_SET_ORDER);
    foreach ($m as $one) {
        $k = strtolower($one[1]);
        if (isset($one[2]) && $one[2] !== '') { $v = $one[2]; }
        elseif (isset($one[3]) && $one[3] !== '') { $v = $one[3]; }
        else { $v = isset($one[2]) ? $one[2] : ''; }
        $out[$k] = html_entity_decode($v, ENT_QUOTES, 'UTF-8');
    }
    return $out;
}
