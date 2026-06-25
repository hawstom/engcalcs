<?php
/**
 * Zero-API translation workflow runner (default path).
 *
 * This script avoids paid API calls and orchestrates deterministic steps:
 * - payload generation
 * - parity reporting
 * - syntax validation
 * - completion matrix report
 *
 * Usage:
 *   php scripts/translate_zero_api.php
 *   php scripts/translate_zero_api.php --lang=fr,uk --prefix=dw
 *   php scripts/translate_zero_api.php --phase=validate --lang=fr,uk --prefix=dw
 */

main($argv);

function main(array $argv): void
{
    $opts = parseArgs($argv);

    $base = escapeshellarg(__DIR__);
    $langOpt = (count($opts['languages']) > 0) ? ' --lang=' . implode(',', $opts['languages']) : '';
    $prefixOpt = (count($opts['prefixes']) > 0) ? ' --prefix=' . implode(',', $opts['prefixes']) : '';

    if ($opts['phase'] === 'scan') {
        runOrFail('Generate delta payloads', "php {$base}/generate_translation_payloads.php{$langOpt}{$prefixOpt}");
        runOrFail('Parity report (non-strict)', "php {$base}/lang_parity_check.php{$langOpt}{$prefixOpt}");
        runOrFail('Completion matrix', "php {$base}/translation_completion_matrix.php{$langOpt}{$prefixOpt}");

        echo "\nZero-API scan complete.\n";
        echo "Next: apply translations directly to lib/lang.ec.??.php, then run --phase=validate.\n";
        return;
    }

    runOrFail('Language syntax validation', "php {$base}/lang_syntax_validate.php{$langOpt}");
    runOrFail('Parity validation (strict)', "php {$base}/lang_parity_check.php{$langOpt}{$prefixOpt} --strict");
    runOrFail('Completion matrix', "php {$base}/translation_completion_matrix.php{$langOpt}{$prefixOpt}");

    echo "\nZero-API validation complete: no syntax or parity mismatches in selected scope.\n";
}

function parseArgs(array $argv): array
{
    $opts = [
        'languages' => [],
        'prefixes' => [],
        'phase' => 'scan',
    ];

    for ($i = 1; $i < count($argv); $i++) {
        $arg = $argv[$i];

        if (strpos($arg, '--lang=') === 0) {
            $opts['languages'] = splitCsv(substr($arg, strlen('--lang=')));
            continue;
        }

        if (strpos($arg, '--prefix=') === 0) {
            $opts['prefixes'] = splitCsv(substr($arg, strlen('--prefix=')));
            continue;
        }

        if (strpos($arg, '--phase=') === 0) {
            $phase = trim(substr($arg, strlen('--phase=')));
            if (!in_array($phase, ['scan', 'validate'], true)) {
                fail('Unsupported phase: ' . $phase);
            }
            $opts['phase'] = $phase;
            continue;
        }

        if ($arg === '--help' || $arg === '-h') {
            printHelpAndExit();
        }

        fail('Unknown option: ' . $arg);
    }

    return $opts;
}

function printHelpAndExit(): void
{
    echo "Usage: php scripts/translate_zero_api.php [options]\n";
    echo "\nOptions:\n";
    echo "  --phase=scan|validate  Workflow phase (default: scan)\n";
    echo "  --lang=fr,uk           Limit to specific languages\n";
    echo "  --prefix=dw,rc         Limit to specific key prefixes\n";
    echo "  -h, --help             Show help\n";
    exit(0);
}

function splitCsv(string $value): array
{
    $parts = array_filter(array_map('trim', explode(',', $value)), static function ($v) {
        return $v !== '';
    });
    return array_values(array_unique($parts));
}

function runOrFail(string $label, string $command): void
{
    echo "\n== {$label} ==\n";
    passthru($command, $code);
    if ($code !== 0) {
        fail("{$label} failed with exit code {$code}.");
    }
}

function fail(string $message): void
{
    fwrite(STDERR, 'ERROR: ' . $message . "\n");
    exit(1);
}
