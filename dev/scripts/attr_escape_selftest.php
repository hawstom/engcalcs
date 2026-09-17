<?php
/**
 * attr_escape_selftest.php -- attr_escape_check.php still sees a language string going raw into an
 * HTML attribute, and still turns away the shapes that only look like one. BLOCKING.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * WHY THIS IS BLOCKING WHEN THE CHECK IT GUARDS FINDS NOTHING. A ratchet at zero that has gone
 * blind and one that is holding print the same line, and the blind one prints a SMALLER escaped
 * count, which reads as tidying. The count is therefore asserted against the real tree, and the
 * reach is proved by a LIVE MUTATION: a page with one raw attribute interpolation, written for the
 * length of one exec, which the real check must name by filename.
 *
 * The load-bearing fixtures are the NEGATIVE ones, and the decisive one is CONTENT. Shipped PHP
 * echoes a language string as element content 1,749 times against 69 into an attribute; a scanner
 * that could not tell the two apart would open on 1,749 findings against correct code, which is
 * the fastest known way to have a check switched off.
 *
 *   php dev/scripts/attr_escape_selftest.php
 */

define('ATTR_ESCAPE_LIB_ONLY', true);
require __DIR__ . '/attr_escape_check.php';

$fails = array();
$n = 0;

function ecAeCase(string $name, string $php, bool $want): void
{
    global $fails, $n;
    $n++;
    $got = ecAttrEscapeFindings(array('x.php' => $php), array())['findings'];
    $hit = $got !== array();
    if ($hit !== $want) {
        $fails[] = $name . "\n      wanted " . ($want ? 'a finding' : 'no finding')
            . ', got ' . ($hit ? count($got) . ': ' . $got[0] : 'none');
    }
}

$O = '<' . '?';   // built rather than typed, so this file's own fixtures cannot close PHP mode
$C = '?' . '>';

// ---- what it MUST find -------------------------------------------------------------------------
ecAeCase('THE DEFECT: the shape the calculator menu shipped sixteen times',
    "<a href=\"/x.php\" title=\"{$O}=\$ec_lang['mpf_main_desc']{$C}\">x</a>", true);
ecAeCase('a placeholder, which is the same attribute problem in a form',
    "<input placeholder=\"{$O}=\$ec_lang['template_printable_title']{$C}\" />", true);
ecAeCase('the LONG echo form, which contact.php used',
    "<input value=\"{$O}php echo \$ec_lang['contactSubmitButton']; {$C}\" />", true);
ecAeCase('addslashes(), which escapes for a JavaScript string and leaves the quote in the markup',
    "<button onclick=\"f('{$O}=addslashes(\$ec_lang['calc_defaults_confirm']){$C}')\">x</button>", true);
ecAeCase('an attribute LATER in the same tag, after one that was escaped correctly',
    "<a href=\"{$O}=htmlspecialchars(\$u){$C}\" title=\"{$O}=\$ec_lang['k']{$C}\">x</a>", true);

// ---- what it must NOT report -------------------------------------------------------------------
ecAeCase('the idiom this suite writes 49 times',
    "<a title=\"{$O}=htmlspecialchars(\$ec_lang['k']){$C}\">x</a>", false);
ecAeCase('htmlspecialchars with the flags some call sites pass, which is still htmlspecialchars',
    "<a title=\"{$O}=htmlspecialchars(\$ec_lang['k'], ENT_QUOTES, 'UTF-8'){$C}\">x</a>", false);
ecAeCase('ELEMENT CONTENT, which is 1,749 of the 1,818 reads in this tree and where a quotation '
    . 'mark is just a quotation mark',
    "<p>{$O}=\$ec_lang['k']{$C}</p>", false);
ecAeCase('content immediately after a closed attribute, which is the shape that would trip a '
    . 'scanner reading only for a nearby quote',
    "<a class=\"x\" href=\"/y\">{$O}=\$ec_lang['k']{$C}</a>", false);
ecAeCase('two attributes closed, then content -- the same trap one tag further along',
    "<a class=\"x\" title=\"{$O}=htmlspecialchars(\$ec_lang['a']){$C}\">{$O}=\$ec_lang['b']{$C}</a>", false);
ecAeCase('an attribute carrying something that is NOT a language string -- constants and language '
    . 'codes are ours, and out of scope by declaration',
    "<a href=\"{$O}=EC_SW_BASE{$C}Manning-Pipe-Flow.php\">x</a>", false);
ecAeCase('a page with no interpolation at all',
    '<p>hello</p>', false);
ecAeCase('a language string handed to a HELPER rather than echoed, which escapes at its own door',
    "{$O}=ecTipLabel(\$ec_lang['k'], \$ec_lang['k_tip']){$C}", false);

// ---- the corpus, and the live mutation ---------------------------------------------------------
$out = array();
$code = 0;
exec('php ' . escapeshellarg(__DIR__ . '/attr_escape_check.php') . ' 2>&1', $out, $code);
$line = implode("\n", $out);
$n++;
if ($code !== 0) {
    $fails[] = "corpus: the check exits $code on the tree it is guarding:\n      $line";
}
$n++;
if (!preg_match('/OK -- (\d+) language string/', $line, $m)) {
    $fails[] = "corpus: could not read the escaped count out of:\n      $line";
} elseif ((int) $m[1] < 55) {
    $fails[] = sprintf('corpus: only %d escaped attribute interpolation(s). 69 shipped on '
        . '2026-09-17, and a collapse this large means the scan stopped recognising an attribute '
        . 'rather than that the attributes went away -- which on a ratchet reads as progress.',
        (int) $m[1]);
}
$n++;
if (!preg_match('/counted: (\d+) language string\(s\) echoed as element CONTENT/', $line, $m2)) {
    $fails[] = "corpus: could not read the turned-away content count out of:\n      $line";
} elseif ((int) $m2[1] < 1000) {
    $fails[] = sprintf('corpus: only %d content read(s) turned away. 1,749 shipped, and that count '
        . 'is the evidence the scan is still telling content from an attribute at all.', (int) $m2[1]);
}

// The live mutation. A page nothing links and no menu names, removed inline AND on shutdown.
$probe = dirname(__DIR__, 2) . '/ec-selftest-attr.php';
register_shutdown_function(function () use ($probe) { @unlink($probe); });
file_put_contents(
    $probe,
    "<?php // TEMPORARY: written by dev/scripts/attr_escape_selftest.php.\n?" . ">\n"
    . "<a href=\"/x\" title=\"<?" . "=\$ec_lang['ec_selftest_probe_key']?" . ">\">x</a>\n"
);
$out2 = array();
$code2 = 0;
exec('php ' . escapeshellarg(__DIR__ . '/attr_escape_check.php') . ' 2>&1', $out2, $code2);
@unlink($probe);
$probeLine = implode("\n", $out2);
$n++;
if (strpos($probeLine, 'ec-selftest-attr.php') === false || $code2 === 0) {
    $fails[] = "corpus mutation: a page with one unescaped language string in a title attribute was "
        . "written into the document root and the check did not fail on it. The scan is not "
        . "reaching the files it claims to guard. Its output was:\n      " . $probeLine;
}

if ($fails) {
    echo 'attr_escape selftest: ' . count($fails) . " failure(s) of $n\n\n";
    foreach ($fails as $f) { echo "  FAIL $f\n\n"; }
    exit(1);
}
echo "Attribute escaping selftest OK -- $n cases, both directions, plus a live mutation.\n";
exit(0);
