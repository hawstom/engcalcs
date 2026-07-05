<?php
/**
 * Quality-score updater.
 *
 * Updates the QUALITY value for a language in lib/Language.Settings.php
 * (the actual home of the QUALITY constant — not the lang.ec.??.php files).
 * Removes the friction of opening the file manually to bump a translation
 * quality weight after a review.
 *
 * Usage:
 *   php scripts/update_quality_score.php <lang> <quality>
 *   php scripts/update_quality_score.php es 0.95
 */

const SETTINGS_FILE = __DIR__ . '/../../lib/Language.Settings.php';

function fail(string $message): void {
    fwrite(STDERR, "Error: $message\n");
    exit(1);
}

$lang = $argv[1] ?? null;
$quality = $argv[2] ?? null;

if ($lang === null || $quality === null) {
    fail("usage: php update_quality_score.php <lang> <quality>");
}

if (!preg_match('/^[a-z]{2}$/', $lang)) {
    fail("lang code must be a 2-letter code, got '$lang'");
}

if (!is_numeric($quality) || $quality < 0 || $quality > 1) {
    fail("quality must be a number between 0 and 1, got '$quality'");
}

$source = file_get_contents(SETTINGS_FILE);
if ($source === false) {
    fail("could not read " . SETTINGS_FILE);
}

$pattern = "/(\\\$all_language_settings\\['" . preg_quote($lang, '/') . "'\\]\\s*=\\s*array\\(\\s*\n\\s*'QUALITY'\\s*=>\\s*)'[^']*'/";

$count = 0;
$updated = preg_replace($pattern, "\${1}'" . $quality . "'", $source, 1, $count);

if ($count === 0) {
    fail("no QUALITY entry found for lang '$lang' — check the lang code exists in Language.Settings.php");
}

file_put_contents(SETTINGS_FILE, $updated);

echo "Updated QUALITY for '$lang' to $quality in " . SETTINGS_FILE . "\n";
