<?php
/**
 *
 * Engineering Calculators command and control central
 * 
 * A view (page) file accesses/joins the application with a require_once call to this file.
 * 
 * This file loads all the other required files.
 *
 * Global variables:
 * NAME                        WHERE DEFINED         DESCRIPTION
 * $debugmode                  This file             TRUE or FALSE to show validator links
 * $basedirectory              This file             Server directory of application root
 * $baseurl                    This file             URL of application root
 * $clanguage                  Session.lib.php       User language
 * $_SESSION["CLANGUAGE"]      Session.lib.php       User language persistent for this session
 * $all_language_settings      Language.Settings.php Standards/settings for all languages, reduced early from all languages
 * $language_settings          Language.Settings.php Standards/settings for current language, reduced early from all languages
 * $ec-lang                    lang.ec.??.php        Text for current language
 *
 * Copyright 2009 Thomas Gail Haws
 *
 * LICENSE: GNU GPL v3 or later
 *
 */
// Start the session here and here only.
session_start();
// Load the config.  It's in this directory.
require_once('config.inc.php');

// Load the language settings.
// They are needed for determining the session language in Session.lib.php below.
require_once(BASE_DIRECTORY.'/engcalcs/lib/Language.Settings.php');

// Load the language functions and set current language.
require_once(BASE_DIRECTORY.'/engcalcs/lib/Language.lib.php');

// Load the text for the current language
// Session.lib.php has to be loaded first above to determine current language.
// Load english first in case current language is incomplete.
require_once(BASE_DIRECTORY.'/engcalcs/lib/lang.ec.en.php');
require_once(BASE_DIRECTORY.'/engcalcs/lib/lang.ec.'.$clanguage.'.php');

// Load the headers and footers
require_once(BASE_DIRECTORY.'/engcalcs/lib/HeadersFooters.lib.php');

// Load the menus that are shown in the headers and footers
require_once(BASE_DIRECTORY.'/engcalcs/lib/Menus.lib.php');

// Load the units factors
require_once(BASE_DIRECTORY.'/engcalcs/lib/Units.lib.php');

// Load the calculator functions
require_once(BASE_DIRECTORY.'/engcalcs/lib/Calculators.lib.php');
?>
