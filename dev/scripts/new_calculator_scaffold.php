<?php
/**
 * New calculator scaffold generator.
 *
 * Given a key prefix and key names, this script:
 * 1) Appends missing stub keys to all lib/lang.ec.*.php language files.
 * 2) Creates a calculator PHP page skeleton and matching JS file skeleton.
 *
 * Usage examples:
 *   php scripts/new_calculator_scaffold.php --prefix=rc_ --keys=main_menu,main_title,main_desc
 *   php scripts/new_calculator_scaffold.php --prefix=rc --keys=main_menu,main_title,main_desc,notes_1 --page=Rock-Chute.php --js=rock-chute.js
 */

const ROOT_DIR = __DIR__ . '/../..';
const LANG_GLOB = ROOT_DIR . '/lib/lang.ec.*.php';
const PAGE_DIR = ROOT_DIR;
const JS_DIR = ROOT_DIR . '/js';

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    if ($opts['help']) {
        printHelpAndExit();
    }

    $prefix = normalizePrefix($opts['prefix']);
    $keySuffixes = normalizeKeySuffixes($opts['keys'], $prefix);

    $required = ['main_menu', 'main_title', 'main_desc'];
    $keySuffixes = array_values(array_unique(array_merge($required, $keySuffixes)));

    $fullKeys = [];
    foreach ($keySuffixes as $suffix) {
        $fullKeys[] = $prefix . $suffix;
    }

    $pageFile = resolvePageFile($opts['page'], $prefix);
    $jsFile = resolveJsFile($opts['js'], $prefix);

    appendLanguageStubs($fullKeys);
    createPageSkeleton($pageFile, $prefix, $jsFile, $opts['force']);
    createJsSkeleton($jsFile, $opts['force']);

    echo "Scaffold complete.\n";
    echo "Prefix: {$prefix}\n";
    echo "Page: " . relativeFromRoot($pageFile) . "\n";
    echo "JS: " . relativeFromRoot($jsFile) . "\n";
    echo "Stub keys added/ensured: " . implode(', ', $fullKeys) . "\n";
}

function parseArgs(array $argv): array
{
    $opts = [
        'prefix' => '',
        'keys' => '',
        'page' => '',
        'js' => '',
        'force' => false,
        'help' => false,
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if ($arg === '--force') {
            $opts['force'] = true;
            continue;
        }

        if ($arg === '--help' || $arg === '-h') {
            $opts['help'] = true;
            continue;
        }

        if (strpos($arg, '--prefix=') === 0) {
            $opts['prefix'] = trim(substr($arg, strlen('--prefix=')));
            continue;
        }

        if (strpos($arg, '--keys=') === 0) {
            $opts['keys'] = trim(substr($arg, strlen('--keys=')));
            continue;
        }

        if (strpos($arg, '--page=') === 0) {
            $opts['page'] = trim(substr($arg, strlen('--page=')));
            continue;
        }

        if (strpos($arg, '--js=') === 0) {
            $opts['js'] = trim(substr($arg, strlen('--js=')));
            continue;
        }

        fail('Unknown option: ' . $arg);
    }

    if (!$opts['help']) {
        if ($opts['prefix'] === '') {
            fail('Missing required --prefix option.');
        }
        if ($opts['keys'] === '') {
            fail('Missing required --keys option.');
        }
    }

    return $opts;
}

function printHelpAndExit(): void
{
    echo "Usage: php scripts/new_calculator_scaffold.php --prefix=xx_ --keys=key1,key2 [options]\n";
    echo "\nRequired:\n";
    echo "  --prefix=xx_      Calculator key prefix (with or without trailing underscore)\n";
    echo "  --keys=a,b,c      Comma-separated key suffixes (or full keys with prefix)\n";
    echo "\nOptional:\n";
    echo "  --page=File.php   Calculator page filename (default from prefix)\n";
    echo "  --js=file.js      JS filename in js/ (default from prefix)\n";
    echo "  --force           Overwrite existing page/js skeleton files\n";
    echo "  -h, --help        Show this help\n";
    exit(0);
}

function normalizePrefix(string $prefix): string
{
    $prefix = strtolower(trim($prefix));
    if ($prefix === '') {
        fail('Prefix cannot be empty.');
    }

    $prefix = rtrim($prefix, '_') . '_';

    if (!preg_match('/^[a-z][a-z0-9_]*_$/', $prefix)) {
        fail('Prefix must match [a-z][a-z0-9_]* and may include a trailing underscore.');
    }

    return $prefix;
}

function normalizeKeySuffixes(string $keysRaw, string $prefix): array
{
    $parts = array_filter(array_map('trim', explode(',', $keysRaw)), static function ($v) {
        return $v !== '';
    });

    if (count($parts) === 0) {
        fail('At least one key is required in --keys.');
    }

    $suffixes = [];
    foreach ($parts as $part) {
        $key = strtolower($part);

        if (strpos($key, $prefix) === 0) {
            $key = substr($key, strlen($prefix));
        }

        if (!preg_match('/^[a-z0-9_]+$/', $key)) {
            fail('Invalid key name: ' . $part . '. Use letters, numbers, underscore.');
        }

        $suffixes[] = $key;
    }

    return array_values(array_unique($suffixes));
}

function resolvePageFile(string $pageOpt, string $prefix): string
{
    if ($pageOpt !== '') {
        $file = basename($pageOpt);
    } else {
        $stem = ucfirst(rtrim($prefix, '_'));
        $file = $stem . '.php';
    }

    if (!preg_match('/^[A-Za-z0-9\-]+\.php$/', $file)) {
        fail('Invalid --page filename: ' . $file);
    }

    return PAGE_DIR . '/' . $file;
}

function resolveJsFile(string $jsOpt, string $prefix): string
{
    if ($jsOpt !== '') {
        $file = basename($jsOpt);
    } else {
        $stem = str_replace('_', '-', rtrim($prefix, '_'));
        $file = $stem . '.js';
    }

    if (!preg_match('/^[a-z0-9\-]+\.js$/', $file)) {
        fail('Invalid --js filename: ' . $file);
    }

    return JS_DIR . '/' . $file;
}

function appendLanguageStubs(array $fullKeys): void
{
    $langFiles = glob(LANG_GLOB);
    if ($langFiles === false || count($langFiles) === 0) {
        fail('No language files found for pattern: ' . LANG_GLOB);
    }
    sort($langFiles);

    foreach ($langFiles as $langFile) {
        $content = (string)file_get_contents($langFile);
        $appendLines = [];

        foreach ($fullKeys as $fullKey) {
            if (preg_match('/\$ec_lang\[\'' . preg_quote($fullKey, '/') . '\'\]\s*=\s*/', $content)) {
                continue;
            }

            $appendLines[] = "\$ec_lang['{$fullKey}']='" . defaultStubText($fullKey) . "';";
        }

        if (count($appendLines) === 0) {
            continue;
        }

        $prefixLabel = explode('_', $fullKeys[0], 2)[0] . '_';
        $block = "\n// {$prefixLabel} scaffold stubs\n" . implode("\n", $appendLines) . "\n";

        $updated = insertBeforePhpCloseTag($content, $block);
        file_put_contents($langFile, $updated);
    }
}

function defaultStubText(string $fullKey): string
{
    $parts = explode('_', $fullKey, 2);
    $suffix = $parts[1] ?? $fullKey;
    $pretty = ucwords(str_replace('_', ' ', $suffix));

    return addslashes($pretty);
}

function insertBeforePhpCloseTag(string $content, string $insert): string
{
    if (preg_match('/\?>\s*$/', $content) === 1) {
        return preg_replace('/\?>\s*$/', $insert . "?>\n", $content) ?? ($content . $insert);
    }

    return rtrim($content, "\n") . $insert;
}

function createPageSkeleton(string $pageFile, string $prefix, string $jsFile, bool $force): void
{
    if (file_exists($pageFile) && !$force) {
        fail('Page file already exists (use --force to overwrite): ' . relativeFromRoot($pageFile));
    }

    $keyTitle = $prefix . 'main_title';
    $keyDesc = $prefix . 'main_desc';
    $keyNotes = $prefix . 'notes_1';
    $jsBase = basename($jsFile);

    $page = "<?php\n";
    $page .= "require_once ('lib/base.inc.php');\n";
    $page .= "\$html_title = \$ec_lang['{$keyTitle}'];\n";
    $page .= "\$html_head='\n";
    $page .= "\t<meta name=\"Description\" content=\"'. \$html_title .'\" />\n";
    $page .= "';\n";
    $page .= "echoHeader(\"EngCalcs\", \$html_title, \$html_head);\n";
    $page .= "\n?>\n";
    $page .= "<h2><?=\$ec_lang['{$keyDesc}']?></h2>\n";
    $page .= "<?php echoHelpWanted(); ?>\n\n";
    $page .= "<?php\n";
    $page .= "echoCalculatorForm(\n";
    $page .= "\t// Inputs\n";
    $page .= "\tArray(),\n";
    $page .= "\t// Results\n";
    $page .= "\tArray()\n";
    $page .= ");\n";
    $page .= "?>\n\n";
    $page .= "<div id=\"sketch\"></div>\n\n";
    $page .= "<h2><?=\$ec_lang['ws_notes_heading']?></h2>\n";
    $page .= "<?php if (isset(\$ec_lang['{$keyNotes}'])) { echo \$ec_lang['{$keyNotes}']; } ?>\n\n";
    $page .= "<?php echoFeedback(); ?>\n\n";
    $page .= "<script src=\"/engcalcs/js/{$jsBase}?v=<?=filemtime(__DIR__.'/js/{$jsBase}')?>\"></script>\n";
    $page .= "<script>\n";
    $page .= "<?php echoCookieScript(); ?>\n";
    $page .= "</script>\n";
    $page .= "<?php\n";
    $page .= "echoFooter(\"EngCalcs\");\n";
    $page .= "// Omit last closing tag is good practice\n";

    file_put_contents($pageFile, $page);
}

function createJsSkeleton(string $jsFile, bool $force): void
{
    if (file_exists($jsFile) && !$force) {
        fail('JS file already exists (use --force to overwrite): ' . relativeFromRoot($jsFile));
    }

    $js = "EngCalcs.pageCalculator = function(objForm) {\n";
    $js .= "\t'use strict';\n";
    $js .= "\tthis.var = {};\n";
    $js .= "\tvoid objForm;\n";
    $js .= "};\n\n";
    $js .= "EngCalcs.pageCalculatorInitialize = function(objForm) {\n";
    $js .= "\tvoid objForm;\n";
    $js .= "};\n";

    file_put_contents($jsFile, $js);
}

function relativeFromRoot(string $absolutePath): string
{
    return ltrim(str_replace(ROOT_DIR, '', $absolutePath), '/');
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
