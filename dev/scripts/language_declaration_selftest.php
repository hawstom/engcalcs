<?php
/**
 * language_declaration_selftest.php — assert that language_declaration_check.php still sees each
 * of the ways the registry and the language files can drift apart. BLOCKING.
 *
 * WHY THIS EXISTS. The check compares two lists that agree today and are meant to agree forever,
 * so it will print the same PASS line whether it is comparing them or comparing nothing. The
 * fixtures below re-introduce each drift shape deliberately, and — the part that matters — pin the
 * near misses that a check written slightly wrong would report: a two-letter code that is not a
 * language file, English at '1' rather than '1.0', a QUALITY given as a string (which is how every
 * real one is written).
 *
 *   php dev/scripts/language_declaration_selftest.php
 */

define('LANGUAGE_DECLARATION_LIB_ONLY', true);
require __DIR__ . '/language_declaration_check.php';

/** A complete, valid declaration. */
function ecLangFixture(string $name = 'Test', $quality = '0.85'): array
{
    return ['QUALITY' => $quality, 'LANGNAME' => $name, 'TITLE_WORDS' => []];
}

$en = ecLangFixture('English', '1');
$es = ecLangFixture('Español');

$cases = [
    // ---- what it MUST find ----------------------------------------------------------------------
    ['DECLARED WITH NO FILE -- a fatal for the one visitor whose browser asked for it',
        ['en' => $en, 'es' => $es, 'km' => ecLangFixture('ខ្មែរ', '0.65')], ['en', 'es'], true],
    ['A FILE NOBODY DECLARED -- a paid-for translation nothing can reach',
        ['en' => $en, 'es' => $es], ['en', 'es', 'pt'], true],
    ['both directions at once, which is what a hand rename of a code produces',
        ['en' => $en, 'pt' => ecLangFixture('Português')], ['en', 'es'], true],
    ['NO QUALITY WEIGHT -- reads as zero in the negotiation, so the language never wins',
        ['en' => $en, 'es' => ['LANGNAME' => 'Español', 'TITLE_WORDS' => []]], ['en', 'es'], true],
    ['a QUALITY of 0, which is a declaration that the language must never be chosen',
        ['en' => $en, 'es' => ecLangFixture('Español', '0')], ['en', 'es'], true],
    ['a QUALITY above 1, which outranks English by arithmetic',
        ['en' => $en, 'es' => ecLangFixture('Español', '1.2')], ['en', 'es'], true],
    ['a QUALITY that is not a number at all -- the shape a hand edit leaves',
        ['en' => $en, 'es' => ecLangFixture('Español', 'high')], ['en', 'es'], true],
    ['ENGLISH DEMOTED BELOW 1. It is the source language, so every other value is measured from it',
        ['en' => ecLangFixture('English', '0.95'), 'es' => $es], ['en', 'es'], true],
    ['a missing LANGNAME -- an unreadable row in the one menu a lost reader needs',
        ['en' => $en, 'es' => ['QUALITY' => '0.85', 'TITLE_WORDS' => []]], ['en', 'es'], true],
    ['an empty LANGNAME, which is the same defect wearing a key',
        ['en' => $en, 'es' => ecLangFixture('  ')], ['en', 'es'], true],

    // ---- what it must NOT report -----------------------------------------------------------------
    ['the tree as it stands: two lists that agree, every field present',
        ['en' => $en, 'es' => $es], ['es', 'en'], false],
    ["ENGLISH AT '1' RATHER THAN '1.0' -- how it is actually written, and numerically identical",
        ['en' => ecLangFixture('English', '1'), 'es' => $es], ['en', 'es'], false],
    ['QUALITY as a numeric STRING, which is how every real declaration writes it',
        ['en' => $en, 'es' => ecLangFixture('Español', '0.65')], ['en', 'es'], false],
    ['QUALITY as an actual float, in case one is ever written unquoted',
        ['en' => $en, 'es' => ecLangFixture('Español', 0.85)], ['en', 'es'], false],
    ['a non-Latin LANGNAME, which most of them are',
        ['en' => $en, 'am' => ecLangFixture('አማርኛ', '0.65')], ['en', 'am'], false],
    ['a duplicate in the file list, which is a glob artefact and not a second language',
        ['en' => $en, 'es' => $es], ['en', 'es', 'es'], false],
];

$fails = 0;
foreach ($cases as [$name, $declared, $files, $wantFinding]) {
    $got = ecLanguageDeclarationFindings($declared, $files);
    $hit = $got !== [];
    if ($hit !== $wantFinding) {
        $fails++;
        echo "  FAIL $name\n";
        echo '        wanted ' . ($wantFinding ? 'a finding' : 'no finding') . ', got '
            . ($hit ? count($got) . ': ' . $got[0] : 'none') . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

if ($fails) {
    echo "\n$fails fixture(s) failed. language_declaration_check.php's reach has moved.\n";
    echo "A false negative here ships either a fatal for a visitor whose language we advertise, or\n";
    echo "a finished translation that nothing in the suite can reach.\n";
    exit(1);
}
echo "\nLanguage-declaration selftest OK -- " . count($cases) . " fixtures, both directions.\n";
exit(0);
