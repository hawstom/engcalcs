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
// Only explicit user selections (?lang=XX) are logged; browser auto-detection is not.
// Each line: ISO-8601 UTC timestamp TAB lang-code TAB page-basename
// Run log/lang-log-stats.sh to analyze.
define('LANG_LOG', dirname(__DIR__) . '/log/engcalcs-lang.log');
