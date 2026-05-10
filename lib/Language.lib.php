<?php
/**
  * Copyright 2009 John Findlay, Tom Haws, and others
  * Licensed under GNU GPL v3.0 or later
  *
  * Get the language to use for this session.
  * See HTTP/1.1 Spec:
  * A language-range matches a language-tag if it exactly equals the tag,
  * or if it exactly equals a prefix of the tag such that the first tag
  * character following the prefix is "-". The special range "*",
  * if present in the Accept-Language field, matches every tag not matched
  * by any other range present in the Accept-Language field.
  * The language quality factor assigned to a language-tag by the
  * Accept-Language field is the quality value of the longest language-
  * range in the field that matches the language-tag. If no language-
  * range in the field matches the tag, the language quality factor assigned
  * is 0. If no Accept-Language header is present in the request, the server
  * SHOULD assume that all languages are equally acceptable.
  * Get the string list of supported languages for this Browser's preferred page languages
  * "es,en-gb;q=0.9,en-us;q=0.8,en;q=0.6,pt;q=0.5,ie;q=0.4,it;q=0.3,fr;q=0.1"
  *
  */
function chooseLanguage($all_language_settings) {
    $browserDefaultQuality = 0;
    if (!empty($_GET["lang"])) {
        // If $_GET["lang"] is a valid language, set a session language override.
        if (ctype_alpha($_GET["lang"]) && strlen($_GET["lang"]) == 2 && $all_language_settings[$_GET["lang"]]) {
            $_SESSION["CLANGUAGE"] = $_GET["lang"];
            return $_GET["lang"];
        } else {
            return "en";
        }
    } elseif (!empty($_SESSION["CLANGUAGE"]) && !empty($all_language_settings[$_SESSION["CLANGUAGE"]])) {
        // Else if a valid language was already determined in this session, use it.
        return $_SESSION["CLANGUAGE"];
    } else {
        // Get and try to match user's acceptable languages.
        if (isset($HTTP_ACCEPT_LANGUAGE)) {
            $accept_langs = $HTTP_ACCEPT_LANGUAGE;
        } elseif (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            $accept_langs = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
        }
        // If there is a browser language list
        if (isset($accept_langs)) {
            // Explode the list by commas
            $accept_langs_array = explode(",", $accept_langs);
            // If there is an Accept-Language header, the default language quality is 0.
            $browserDefaultQuality = 0;
            // Split each language entry into range and quality.
            foreach ($accept_langs_array as $key => $browserLang) {
              // Get the name, quality, and prefix (prefix is a hack
              // for non-compliance) of the browser language preference.
              // Split language and quality
              $browserLang = explode(";", strtolower($browserLang));
              // Get the numeric part of the quality
              $browserLang[1] = (isset($browserLang[1])) ? substr($browserLang[1],2) : '';
              // Split the language parts
              $browserLang[2] = explode("-", $browserLang[0]);
              // Put the sub language into element 2 of the array
              $browserLang[2] = $browserLang[2][0];
              // If the range is "*", it gives the default language quality.
              if ($browserLang[0] == "*") $browserDefaultQuality = $browserLang[1];
              // If the range has no quality, the quality is 1.
              if ($browserLang[1] == "") $browserLang[1] = "1";
              $accept_langs_array[$key] = $browserLang;
            }
        }
    else {
        // If no header, all languages are reading quality 1.
        $browserDefaultQuality = 1;
    }
    $highestQuality=-1; // First accepted language with a zero quality will be the default winner.
    // Assign a combined quality * preference to each of our languages
    // print_r($all_language_settings);
    foreach ($all_language_settings as $tag => $language) {
      $tagarray = explode("-", $tag);
      $tagPrefix = $tagarray[0];
      $tagQuality = $language['QUALITY'];
      $longestMatch = 0;
      // Assign the default quality.
      $language['QUALITY'] = $browserDefaultQuality * $tagQuality;
      // If there is an Accept-Language header, adjust language quality according to it.
      if (isset($accept_langs)) {
        // Loop through the browser language preferences to get the browser's quality for tag
        foreach ($accept_langs_array as $browserLang) {
          // If the browser language range exactly equals our language tag or our prefix
          if ($browserLang[0] == $tagPrefix ||  $browserLang[0] == $tag) {
            // We get to use its quality if it's the longest range that matches.
            if (strlen($browserLang[0]) > $longestMatch) {
              $longestMatch = strlen($browserLang[0]);
              // Assign it in case this is the longest match.
              $language['QUALITY'] = $browserLang[1] * $tagQuality;
            }
          /**
           * NON-COMPLIANT hack for disinterested users that prefer
           * to accept prefix language without saying so.
           * (They say es-ar, but really, really also prefer es to en)
           * (But not, on the negative side, if they say they hate
           *  en-cockney, but really hate all forms of english.)
           * In real world usage, the negative non-acceptance case is
           * likely a sign of genuine user intent and attention.
           * An intentional user in such a situation would naturally
           * assume generic en would NOT be included in his non-acceptance
           * of en-cockney. So we make sure we count such pseudo-matches
           * only for range qualities over 0.5. Also, we call it a
           * pseudo-match with length of one since it's not
           * legitimate. We will be assigning its adjusted range quality
           * to our tag only if there is no legitimate match.
           *
           */
          } elseif (($browserLang[2] == $tagPrefix) && ($browserLang[1] > 0.5) && ($longestMatch < 1)) {
            // Call it a one character long match (a pseudo-match).
            $longestMatch = 1;
            // Assign it in case this is the longest match.
            $language['QUALITY'] = $browserLang[1]  * $tagQuality;
          }
          // echo "\n<br />For tag $tag, quality $tagQuality, browser range $browserLang[0], quality $browserLang[1], put tag quality at $language[QUALITY].";
        }
      }
      // If this tag has the highest quality so far, declare it the current winner.
      if ($language['QUALITY'] > $highestQuality) {
        $highestQuality = $language['QUALITY'];
        $winningLanguage=$tag;
      }
    }
    /*
    echo "Default browser quality: $browserDefaultQuality";
    print_r($accept_langs_array);
    print_r($language_settings);
    */
    return $winningLanguage;
    }
}


$clanguage=chooseLanguage($all_language_settings);

// Reduce language settings to the current language
// print_r($clanguage);
// print_r($all_language_settings);
$language_settings = $all_language_settings[$clanguage];

function ec_title($sentence) {
    global $language_settings;
    $words = explode(' ', $sentence);
    foreach ($words as $key => $word) {
        // echo "\n<br />Key $key, Word $word, in array? ";
        //print_r($language_settings);
        if (!$key or !in_array($word, $language_settings['TITLE_WORDS'])) $words[$key] = ucwords($word);
    }
    return implode($words, ' ');
}

function compare_langs ($baseLang, $secondLang) {
    global $basedirectory;
    echo "$basedirectory<br />";
    unset($ec_lang);
    require("{$basedirectory}lib/lang.ec.$baseLang.php");
    $baseLang=$ec_lang;
    unset($ec_lang);
    require("{$basedirectory}lib/lang.ec.$secondLang.php");
    $secondLang=$ec_lang;
    // print_r($baseLang);
    // print_r($secondLang);
    echo "\n<table>\n<tr><td>Lonely first language vars</td><td>Lonely second language vars</td><td>Identical (untranslated) vars</td></tr>";
    foreach ($baseLang as $key => $basestring) {
        if(!isset($secondLang[$key])) {
            echo "<tr><td>$key:$basestring</td><td></td><td></td></tr>";
        }
        if($baseLang[$key] == $secondLang[$key]) {
            echo "<tr><td></td><td></td><td>$key:$basestring</td></tr>";
        }
    }
    foreach ($secondLang as $key => $basestring) {
        if(!isset($baseLang[$key])) {
            echo "\n<tr><td></td><td>$key:$basestring</td><td></td></tr>";
        }
    }
    echo "\n</table>";
}
