<?php
error_reporting(E_ALL & ~E_NOTICE);
require_once ('lib/base.inc.php');
echoHeader("EngCalcs", "Compare languages", "", false);
// Task 295: a bare visit used to hand two undefined $_GET keys to compare_langs(), which ends in
// require('lib/lang.ec..php') -- an uncaught Error, so the page 500'd. The page is excluded from
// the sitemap but there is no robots.txt, so it stays reachable and has to answer for itself.
// Anything not a real language code now falls through to the picker rather than to a fatal.
$lang1 = ec_compare_lang_or_null(isset($_GET['lang1']) ? $_GET['lang1'] : null);
$lang2 = ec_compare_lang_or_null(isset($_GET['lang2']) ? $_GET['lang2'] : null);
if ($lang1 !== null && $lang2 !== null) {
    compare_langs($lang1, $lang2);
} else {
    ec_compare_lang_picker($lang1, $lang2);
}
echoFooter("EngCalcs");
// Omit last closing tag is good practice
