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

// Language demand log — stored in log/ at the project root, blocked from HTTP by log/.htaccess.
// Each line: ISO-8601 UTC timestamp TAB lang-code TAB source TAB page-basename
//   source='get'     explicit ?lang=XX selection — logged every occurrence
//   source='cookie'  returning user with saved preference — logged once per session
//   source='browser' raw first Accept-Language tag (e.g. es-MX, zh-TW) — logged once ever per browser via ec_blang cookie
// Run log/lang-log-stats.sh to analyze.
define('LANG_LOG', dirname(__DIR__) . '/log/engcalcs-lang.log');
