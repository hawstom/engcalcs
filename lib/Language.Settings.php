<?php
/**
 * Standard file of Language.Settings.php
 *
 *
 * phpGedView: Genealogy Viewer
 * Copyright (C) 2002 to 2007  John Finlay and Others
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License;or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not;write to the Free Software
 * Foundation;Inc.;59 Temple Place;Suite 330;Boston;MA  02111-1307  USA
 *
 * $Id: lang_settings_std.php 2356 2007-12-02 22:30:39Z fisharebest $
 *
 * @package PhpGedView
 * @subpackage Languages
 */

if (stristr($_SERVER["SCRIPT_NAME"], basename(__FILE__))!==false) {
    print "You cannot access an include file directly.";
    exit;
}

// Array definition of language_settings
$all_language_settings = array();
// You have to add each language to Language.Settings.php, and config.inc.php VALID_LANGUAGES constant.
//
// QUALITY is this app's own preference weight for a language, multiplied against the browser's q-value
// when choosing the best language match from Accept-Language. 1.0 = fully translated, well-maintained.
// Lower values (e.g. 0.3) indicate partial or aging translations — they will only win if the browser
// strongly prefers that language and no better-quality match exists.
//
// Languages are ordered alphabetically by English name, matching the EU/UN convention.

//-- settings for bulgarian
$all_language_settings['bg']=array(
'QUALITY'=>'0.95',
'LANGNAME'=>'български',
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array(),
);

//-- settings for arabic
$all_language_settings['ar']=array(
'QUALITY'=>'0.9',
'LANGNAME'=>'العربية',
'TITLE_WORDS'=>array(),
);

//-- settings for bengali
$all_language_settings['bn']=array(
'QUALITY'=>'0.85',
'LANGNAME'=>'বাংলা',
'TITLE_WORDS'=>array(),
);

//-- settings for chinese
$all_language_settings['cn']=array(
'QUALITY'=>'0.7',
'LANGNAME'=>'中文',
// Browser Accept-Language sends 'zh' but our internal code is 'cn'.
'BROWSER_TAG'=>'zh',
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array(),
);

//-- settings for croatian
$all_language_settings['hr']=array(
'QUALITY'=>'0.3',
'LANGNAME'=>'Hrvatski',
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array(),
);

//-- settings for czech
$all_language_settings['cs']=array(
'QUALITY'=>'0.9',
'LANGNAME'=>'Čeština',
'TITLE_WORDS'=>array(),
);

//-- settings for english
$all_language_settings['en']=array(
'QUALITY'=>'1',
'LANGNAME'=>'English',
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array('of','a','the','and','an','or','nor','but','is','if','then','else', 'when', 'at', 'from', 'by','on','off','for','in','out','over','to','into','with'),
);

//-- settings for french
$all_language_settings['fr']=array(
'QUALITY'=>'0.9',
'LANGNAME'=>'Francais',
'TITLE_WORDS'=>array(),
);

//-- settings for german
$all_language_settings['de']=array(
'QUALITY'=>'0.9',
'LANGNAME'=>'Deutsch',
'TITLE_WORDS'=>array(),
);

//-- settings for hebrew
$all_language_settings['he']=array(
'QUALITY'=>'0.6',
'LANGNAME'=>'עברית',
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array(),
);

//-- settings for indonesian
$all_language_settings['id']=array(
'QUALITY'=>'0.85',
'LANGNAME'=>'Bahasa Indonesia',
'TITLE_WORDS'=>array(),
);

//-- settings for italian
$all_language_settings['it']=array(
'QUALITY'=>'0.9',
'LANGNAME'=>'Italiano',
'TITLE_WORDS'=>array(),
);

//-- settings for portuguese
$all_language_settings['pt']=array(
'QUALITY'=>'0.3',
'LANGNAME'=>'Portugues',
'LANG_USE'=>true,
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array(),
);

//-- settings for romanian
$all_language_settings['ro']=array(
'QUALITY'=>'0.3',
'LANGNAME'=>'Română',
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array(),
);

//-- settings for russian
$all_language_settings['ru']=array(
'QUALITY'=>'0.9',
'LANGNAME'=>'Русский',
'TITLE_WORDS'=>array(),
);

//-- settings for serbian
$all_language_settings['sr']=array(
'QUALITY'=>'0.3',
'LANGNAME'=>'Srpski',
// Title words is a list of words that are not capitalized in titles.
'TITLE_WORDS'=>array(),
);

//-- settings for spanish
$all_language_settings['es']=array(
'QUALITY'=>'0.95',
'LANGNAME'=>'Español',
'TITLE_WORDS'=>array(),
);

//-- settings for turkish
$all_language_settings['tr']=array(
'QUALITY'=>'0.9',
'LANGNAME'=>'Türkçe',
'TITLE_WORDS'=>array(),
);
