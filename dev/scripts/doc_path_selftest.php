<?php
/**
 * doc_path_selftest.php — assert that doc_path_check.php still sees a dead pointer, and still
 * refuses to read a backticked run of code as one. BLOCKING.
 *
 * WHY THIS EXISTS. CLAUDE.md has 0 dead pointers today, so the check prints the same word whether
 * it is working or has quietly stopped classifying anything as a path at all. Nothing else would
 * notice: `102 cited path(s) resolve` and `0 cited path(s) resolve` both read as success to a
 * human skimming a build log, and the second is what a broken classifier produces.
 *
 * The fixtures pin the balance in both directions, because both failures are expensive and they
 * pull opposite ways:
 *
 *   - **Too generous** and the check fails every commit on `$ec_lang[]`, `setProp()`,
 *     `outwardY()/inwardY()`, `1/128°` and `ssh.github.com:443`. A check that cries wolf on the
 *     documentation's own vocabulary gets deleted within a week.
 *   - **Too timid** and it silently classifies nothing, which is the state it would drift into if
 *     somebody "fixed" a false positive by tightening the rules one more notch.
 *
 * `../sitemap.xml` and `~/webdev/librewaternet.org/CLAUDE.md` have their own fixtures because they
 * are the two citations in CLAUDE.md that are CORRECTLY absent from a checkout: the sitemap is
 * generated and deliberately untracked, and the sibling repository is a different repository.
 *
 *   php dev/scripts/doc_path_selftest.php
 */

define('DOC_PATH_LIB_ONLY', true);
require __DIR__ . '/doc_path_check.php';

$fails = 0;
$checks = 0;

/** One classification fixture. */
function ecExpectKind(string $text, string $want, string $why): void
{
    global $fails, $checks;
    $checks++;
    [$got] = ecClassifyCitation($text);
    if ($got !== $want) {
        $fails++;
        echo "  FAIL `$text` -- wanted $want, got $got\n        ($why)\n";
    } else {
        echo "  ok   `$text` => $want\n";
    }
}

echo "-- what must be read AS a path ---------------------------------------------------------\n";
ecExpectKind('dev/scripts/scenario_seam_check.php', 'path', 'the ordinary citation shape');
ecExpectKind('js/lpn-terrain.js', 'path', 'a source file');
ecExpectKind('dev/calc-spike/', 'path', 'a directory, marked by its trailing slash');
ecExpectKind('dev/scripts/glossary.json', 'path', 'data, not code');
ecExpectKind('dev/positioning.md,', 'path', 'a trailing comma belongs to the prose, not the path');
ecExpectKind('lib/lang.ec.??.php', 'glob', 'the 27 language files, cited as one glob');
ecExpectKind('dev/*.md', 'glob', 'a directory of documents');
ecExpectKind('js/vendor/*.js', 'glob', 'the vendored engine');

echo "\n-- what must NOT be read as a path ----------------------------------------------------\n";
ecExpectKind('$ec_lang[]', 'not-a-path', 'a variable');
ecExpectKind('setProp()', 'not-a-path', 'a function');
ecExpectKind('EngCalcs.lpnValveIsNative', 'not-a-path', 'a member, and no slash anywhere');
ecExpectKind('lpn_', 'not-a-path', 'a prefix');
ecExpectKind('ft = 0.3048 m', 'not-a-path', 'a definition -- it has spaces');
ecExpectKind('sh dev/scripts/check_all.sh', 'not-a-path', 'a COMMAND: it contains a path but is not one');
ecExpectKind('outwardY()/inwardY()', 'not-a-path', 'two functions with a slash between them');
ecExpectKind('1/128', 'not-a-path', 'an arithmetic ratio; no extension, no trailing slash');
ecExpectKind('check_all.sh', 'not-a-path', 'a bare filename could be anywhere; resolving it would be guessing');
ecExpectKind('ssh.github.com:443', 'not-a-path', 'a host and a port');
ecExpectKind('max-width: 640px', 'not-a-path', 'CSS');
ecExpectKind('Priority|ID|status Description', 'not-a-path', 'a file FORMAT, not a file');
ecExpectKind('https://fonts.googleapis.com', 'url', 'a URL is somebody else\'s filesystem');
ecExpectKind('~/webdev/librewaternet.org/CLAUDE.md', 'outside', 'the sibling repository is a different repository');
ecExpectKind('../sitemap.xml', 'outside', 'generated and deliberately untracked -- absent from every checkout');
ecExpectKind('/engcalcs/', 'outside', 'a URL path on the server, not a path in this tree');

echo "\n-- extraction --------------------------------------------------------------------------\n";
$checks++;
// A fenced block is a command to run or an example to copy, not a citation of a file.
$md = "See `dev/a.md`.\n\n```php\n\$x = `dev/never-cited.md`;\n```\n\nAnd `dev/b.md`.\n";
$got = array_map(fn($c) => $c[0], ecCitationsInMarkdown($md));
if ($got !== ['dev/a.md', 'dev/b.md']) {
    $fails++;
    echo "  FAIL fenced code blocks are skipped -- got " . implode(', ', $got) . "\n";
} else {
    echo "  ok   fenced code blocks are skipped\n";
}

echo "\n-- resolution against a real tree ------------------------------------------------------\n";
$tmp = sys_get_temp_dir() . '/ec-doc-path-selftest-' . getmypid();
@mkdir($tmp . '/dev/scripts', 0777, true);
file_put_contents($tmp . '/dev/scripts/live.php', "<?php\n");
@mkdir($tmp . '/dev/calc-spike', 0777, true);

$cases = [
    ['a citation of a file that exists',            "read `dev/scripts/live.php` first",  0],
    ['a citation of a directory that exists',       "harnesses live in `dev/calc-spike/`", 0],
    ['a glob with at least one match',              "every `dev/scripts/*.php`",           0],
    // THE DEFECT. A renamed or deleted file leaves prose that still reads perfectly.
    ['a citation of a file that was deleted',       "read `dev/scripts/gone.php` first",   1],
    ['a citation of a directory that was deleted',  "see `dev/librewaternet-landing/`",    1],
    ['a glob that matches nothing',                 "every `dev/scripts/*.rb`",            1],
    ['two dead pointers are two findings',          "`dev/x.md` and `dev/y.md`",           2],
    ['code beside a dead path still finds the path',
                                                    "`setProp()` writes `dev/gone.md`",    1],
];
foreach ($cases as [$name, $md, $want]) {
    $checks++;
    $dead = ecResolveCitations($md, $tmp)['dead'];
    if (count($dead) !== $want) {
        $fails++;
        echo "  FAIL $name -- wanted $want, got " . count($dead) . "\n";
    } else {
        echo "  ok   $name\n";
    }
}

// Fixture tree, gone.
@unlink($tmp . '/dev/scripts/live.php');
@rmdir($tmp . '/dev/scripts');
@rmdir($tmp . '/dev/calc-spike');
@rmdir($tmp . '/dev');
@rmdir($tmp);

if ($fails) {
    echo "\n$fails of $checks fixture(s) failed. doc_path_check.php's reach has moved.\n";
    echo "Too generous and it fails every commit on the documentation's own vocabulary; too timid\n";
    echo "and it classifies nothing while still printing success.\n";
    exit(1);
}
echo "\nDoc-path selftest OK -- $checks fixtures, both directions.\n";
exit(0);
