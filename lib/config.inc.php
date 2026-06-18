<?php
/**
 *
 *
 * Global variables:
 * NAME                        WHERE DEFINED         DESCRIPTION
 * $debugmode                  This file             TRUE or FALSE to show validator links
 * $basedirectory              This file             Server directory of application root
 * $baseurl                    This file             URL of application root
 * $clanguage                  Session.lib.php       User language
 * $_SESSION["CLANGUAGE"]      Session.lib.php       User language persistent for this session
 * $all_language_settings      Language.Settings.php Standards/settings for all languages
 * $language_settings          Language.Settings.php Standards/settings for current language, reduced early from all languages
 * $ec-lang                    lang.ec.??.php        Text for current language
 *
 * Copyright 2009 Thomas Gail Haws
 *
 * LICENSE: GNU GPL v3 or later
 *
 */

$basedirectory = realpath(__DIR__.'/../..');

// Set some global variables
define('DEBUG_MODE', getenv('APP_ENV') === 'development');

define('BASE_DIRECTORY', $basedirectory);

// Language demand log — outside public_html, not HTTP-accessible.
// Only explicit user selections (?lang=XX) are logged; browser auto-detection is not.
// Each line: ISO-8601 UTC timestamp TAB lang-code TAB page-basename
// Example:   2026-06-17T21:04:33Z    es    Manning-Pipe-Flow
//
// Useful shell commands:
//   View raw log:
//     cat /var/www/cnm/logs/engcalcs-lang.log
//
//   Count selections by language (most popular first):
//     awk -F'\t' '{print $2}' /var/www/cnm/logs/engcalcs-lang.log | sort | uniq -c | sort -rn
//
//   Count selections by page:
//     awk -F'\t' '{print $3}' /var/www/cnm/logs/engcalcs-lang.log | sort | uniq -c | sort -rn
//
//   Count selections by language and page together:
//     awk -F'\t' '{print $2"\t"$3}' /var/www/cnm/logs/engcalcs-lang.log | sort | uniq -c | sort -rn
//
//   Show selections for a specific language (e.g. es):
//     grep $'\tes\t' /var/www/cnm/logs/engcalcs-lang.log
//
//   Count selections per day:
//     awk -F'\t' '{print substr($1,1,10)}' /var/www/cnm/logs/engcalcs-lang.log | sort | uniq -c
define('LANG_LOG', realpath(dirname(BASE_DIRECTORY) . '/..') . '/logs/engcalcs-lang.log');
