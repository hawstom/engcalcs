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
        $baseurl = 'http://hawsedc';
        $debugmode=TRUE;
        break;
    case 'cnm' :
        $baseurl = 'http://cnm/public_html/hawsedc';
        $debugmode=TRUE;
        break;
    case 'hawsedcm' :
        $baseurl = 'http://hawsedcm';
        $debugmode=TRUE;
        break;
    case 'cnmm' :
        $baseurl = 'http://cnmm';
        $debugmode=TRUE;
        break;
    case 'dev.hawsedc.com':
        $baseurl = 'http://dev.hawsedc.com';
        $debugmode=TRUE;
        break;
    case 'localhost' :
        $baseurl = 'http://localhost/constructionnotesmanager.com/public_html/hawsedc';
        $debugmode=TRUE;
        break;    
    default :
        $baseurl = 'http://www.hawsedc.com';
        $debugmode=FALSE;
        break;
}

define('BASE_DIRECTORY', $basedirectory);
define('DEBUG_MODE', $debugmode);
define('BASE_URL', $baseurl);

