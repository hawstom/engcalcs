<?php
/**
 * Glossary compliance audit.
 *
 * For the high-drift terms named in ROADMAP.md priority-85 (flow, head loss,
 * weir, conveyance efficiency), prints each non-English lang file's current
 * string next to the glossary's preferred translation so a reviewer can spot
 * drift. This is a reporting tool, not a pass/fail gate — natural synonym
 * variation is expected and is not itself a defect.
 *
 * Usage:
 *   php dev/scripts/glossary_compliance_audit.php
 *   php dev/scripts/glossary_compliance_audit.php --lang=es,fr
 */

const LIB_DIR = __DIR__ . '/../../lib';
const GLOSSARY_FILE = __DIR__ . '/glossary.json';

// Keys that carry each high-drift term as their primary meaning (compound
// keys like mpf_flow_area or dw_flow_regime were excluded as distinct concepts).
const TERM_KEYS = [
    'flow' => ['mpf_flow'],
    'head loss' => [
        'dw_main_menu', 'dw_main_title', 'dw_main_desc',
        'hw_main_menu', 'hw_main_title', 'hw_main_desc',
        'mphl_main_menu', 'mphl_main_title', 'mphl_main_desc',
        'mhp_hl_check', 'mhp_notes_1_term', 'mhp_notes_3_term',
    ],
    // The irr_ landing-page keys that used to anchor 'weir' and 'conveyance efficiency' went
    // with Irrigation.php (Task 232, 2026-08-08). 'weir' now has no sampled key: the weir
    // calculators' own identity strings are ws_/wi_, which this audit already covers elsewhere.
    'weir' => ['ws_main_title', 'ws_main_desc', 'wi_main_title'],
    'conveyance efficiency' => [
        'cs_main_title', 'cs_main_desc', 'cs_Ec', 'cs_Ec_target', 'cs_notes_1_def',
    ],
    'rock chute' => ['rc_main_menu', 'rc_main_title', 'rc_main_desc'],
    'riprap' => ['rc_np', 'rc_d'],
    'emitter' => ['ip_q_design', 'ip_h_design', 'ip_h_far'],
    'distribution uniformity' => ['ip_main_title'],
    'ponding' => ['rc_ponding_check', 'rc_notes_7_term'],
    'outlet apron' => ['rc_apron_length', 'rc_sketch_outlet_apron'],
];

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    $glossary = json_decode((string)file_get_contents(GLOSSARY_FILE), true);
    if ($glossary === null) {
        fail('Could not parse glossary.json');
    }

    $termsByName = [];
    foreach ($glossary['terms'] as $t) {
        $termsByName[$t['term']] = $t;
    }

    $langFiles = glob(LIB_DIR . '/lang.ec.*.php');
    sort($langFiles);

    $langData = [];
    foreach ($langFiles as $file) {
        if (!preg_match('/lang\.ec\.([a-z]{2})\.php$/', $file, $m)) {
            continue;
        }
        $lang = $m[1];
        if ($lang === 'en') {
            continue;
        }
        if (count($opts['languages']) > 0 && !in_array($lang, $opts['languages'], true)) {
            continue;
        }
        $langData[$lang] = parseLangAssignments((string)file_get_contents($file));
    }
    ksort($langData);

    foreach (TERM_KEYS as $term => $keys) {
        if (!isset($termsByName[$term])) {
            echo "WARNING: term '$term' not found in glossary.json\n";
            continue;
        }
        $preferred = $termsByName[$term]['translations'];

        echo "\n=== $term ===\n";
        if (!empty($termsByName[$term]['translation_notes'])) {
            echo 'notes: ' . $termsByName[$term]['translation_notes'] . "\n";
        }

        foreach ($keys as $key) {
            echo "\n-- $key --\n";
            foreach ($langData as $lang => $values) {
                if (!isset($values[$key])) {
                    continue;
                }
                $glossaryTerm = $preferred[$lang] ?? '';
                $value = $values[$key];
                $match = ($glossaryTerm !== '') && containsCaseInsensitive($value, $glossaryTerm);
                $flag = $match ? '  ' : '? ';
                echo "  {$flag}[{$lang}] glossary='{$glossaryTerm}' value='{$value}'\n";
            }
        }
    }
}

function containsCaseInsensitive(string $haystack, string $needle): bool
{
    if (function_exists('mb_stripos')) {
        return mb_stripos($haystack, $needle) !== false;
    }
    return stripos($haystack, $needle) !== false;
}

function parseArgs(array $argv): array
{
    $opts = ['languages' => []];
    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];
        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = array_values(array_filter(array_map('trim', explode(',', substr($arg, strlen('--lang='))))));
            continue;
        }
        fail('Unknown option: ' . $arg);
    }
    return $opts;
}

function parseLangAssignments(string $content): array
{
    $pattern = '/\$ec_lang\[\'([^\']+)\'\]\s*=\s*(\'((?:[^\'\\\\]|\\\\.)*)\'|"((?:[^"\\\\]|\\\\.)*)"|([^;]*));/m';
    preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

    $values = [];
    foreach ($matches as $m) {
        $key = $m[1];
        if (isset($m[3]) && $m[3] !== '') {
            $values[$key] = stripcslashes($m[3]);
        } elseif (isset($m[4]) && $m[4] !== '') {
            $values[$key] = stripcslashes($m[4]);
        } else {
            $values[$key] = trim($m[5] ?? '');
        }
    }

    return $values;
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
