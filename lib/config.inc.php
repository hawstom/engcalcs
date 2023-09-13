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
switch ($_SERVER['SERVER_NAME'])
{
    case 'hawsedc' :
		define('DEBUG_MODE', true);
        break;
    case 'cnm' :
		define('DEBUG_MODE', true);
        break;
    case 'hawsedcm' :
		define('DEBUG_MODE', true);
        break;
    case 'cnmm' :
		define('DEBUG_MODE', true);
        break;
    case 'dev.hawsedc.com':
		define('DEBUG_MODE', true);
        break;
    case 'localhost' :
		define('DEBUG_MODE', true);
        break;    
    default :
		define('DEBUG_MODE', false);
        break;
}

define('BASE_DIRECTORY', $basedirectory);
