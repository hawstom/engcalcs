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
// $source: 'get' = explicit ?lang=XX (every occurrence)
//          'cookie' = returning user with saved preference (once per session)
//          'browser' = Accept-Language auto-detection (once per session)
//          'view' = a later page in a session whose language was already pinned by one of the
//                   above (once per session per page). Exists purely so LANG_LOG's page/lang
//                   breakdown covers every page visited, not just the page that pinned the
//                   language -- excluded from the "language demand" sections in
//                   lang-log-stats.sh, since it would just double-count the session's language.
function logLanguageSelection($lang, $source) {
    $logFile = defined('LANG_LOG') ? LANG_LOG : null;
    if (!$logFile) return;
    // Task 210: a browser that opted out of being counted is not counted here either. All three log
    // writers check the same one flag, so an opt-out cannot half-apply.
    if (function_exists('ecLoggingOptedOut') && ecLoggingOptedOut()) return;
    $dir = dirname($logFile);
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $page = isset($_SERVER['SCRIPT_NAME']) ? basename($_SERVER['SCRIPT_NAME'], '.php') : '';
    $line = gmdate('Y-m-d\TH:i:s\Z') . "\t" . $lang . "\t" . $source . "\t" . $page . "\n";
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

// Map legacy/non-standard language codes to their correct ISO 639-1 equivalents.
$LEGACY_LANG_MAP = ['cn' => 'zh'];

function normalizeLang($lang) {
    global $LEGACY_LANG_MAP;
    return $LEGACY_LANG_MAP[$lang] ?? $lang;
}

function chooseLanguage($all_language_settings) {
    $browserDefaultQuality = 0;
    if (!empty($_GET["lang"])) {
        // If $_GET["lang"] is a valid language, set a session language override.
        $lang = normalizeLang($_GET["lang"]);
        if (ctype_alpha($lang) && strlen($lang) == 2 && $all_language_settings[$lang]) {
            $_SESSION["CLANGUAGE"] = $lang;
            setcookie("ec_language", $lang, [
                'expires'  => time() + 365 * 24 * 60 * 60,
                'path'     => '/',
                'samesite' => 'Strict',
                'secure'   => true,
                'httponly' => true,
            ]);
            logLanguageSelection($lang, 'get');
            return $lang;
        } else {
            return "en";
        }
    } elseif (!empty($_SESSION["CLANGUAGE"]) && !empty($all_language_settings[$_SESSION["CLANGUAGE"]])) {
        // Else if a valid language was already determined in this session, use it.
        // Still log a page-view hit (source='view'), once per session per page, so LANG_LOG's
        // page/lang breakdown reflects every page a session visits -- not just the entry page
        // where the language was first pinned. Without this, 'reach' undercounts every non-entry
        // page relative to engcalcs-human-view.log, which dedupes per (session, page, lang)
        // rather than per session -- producing >100% "%human" in the funnel report.
        $page = isset($_SERVER['SCRIPT_NAME']) ? basename($_SERVER['SCRIPT_NAME'], '.php') : '';
        if (empty($_SESSION['LANG_VIEW_LOGGED'][$page])) {
            $_SESSION['LANG_VIEW_LOGGED'][$page] = true;
            logLanguageSelection($_SESSION["CLANGUAGE"], 'view');
        }
        return $_SESSION["CLANGUAGE"];
    } elseif (!empty($_COOKIE["ec_language"]) && ctype_alpha($_COOKIE["ec_language"]) && strlen($_COOKIE["ec_language"]) == 2 && !empty($all_language_settings[$cookieLang = normalizeLang($_COOKIE["ec_language"])])) {
        // Else if a valid language cookie exists from a previous browser session, use it.
        $_SESSION["CLANGUAGE"] = $cookieLang;
        if (empty($_SESSION['CLANG_LOGGED'])) {
            logLanguageSelection($cookieLang, 'cookie');
            $_SESSION['CLANG_LOGGED'] = true;
        }
        return $cookieLang;
    } else {
        // Get and try to match user's acceptable languages.
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
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
              // If the range has no quality, the quality is 1.
              // **This has to come BEFORE the "*" line below** (fixed 2026-08-06). A bare
              // "Accept-Language: *" -- no q-value -- left $browserDefaultQuality as the empty
              // string, and PHP 8 makes '' * '0.85' a fatal TypeError rather than the 0 PHP 5 gave
              // us. Every page of the suite answered 500 to that one header. Found by the new
              // browser pass, whose HTTP client sends exactly that by default; a browser rarely
              // does, which is why it survived years of human testing.
              if ($browserLang[1] == "") $browserLang[1] = "1";
              // If the range is "*", it gives the default language quality. Cast, because this
              // value is multiplied: a header is user input, and no user input should be able to
              // choose between a number and a fatal error.
              if ($browserLang[0] == "*") $browserDefaultQuality = (float)$browserLang[1];
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
      $tagPrefix = isset($language['BROWSER_TAG']) ? $language['BROWSER_TAG'] : $tagarray[0];
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
    // Log the raw first Accept-Language tag (not the served language) once ever per browser.
    // ec_blang cookie prevents re-logging across sessions.
    if (!isset($_COOKIE['ec_blang']) && isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $rawLang = strtolower(trim(explode(';', explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])[0]));
        logLanguageSelection($rawLang, 'browser');
        setcookie('ec_blang', $rawLang, [
            'expires'  => time() + 365 * 24 * 60 * 60,
            'path'     => '/',
            'samesite' => 'Strict',
            'secure'   => true,
            'httponly' => true,
        ]);
    }
    $_SESSION['CLANG_LOGGED'] = true;
    return $winningLanguage;
    }
}


/**
 * Build the canonical URL of a page in one specific language (ROADMAP Task 149).
 *
 * One URL serves every language here, chosen at request time from cookie/Accept-Language, so
 * without an explicit ?lang=xx in the URL there is nothing for a search engine to index per
 * language -- Googlebot crawls from US IPs with Accept-Language: en and only ever sees the
 * English rendering. ?lang=xx is kept as the canonical URL form (decided 2026-07-27) rather than
 * moving to /es/... paths: cheaper, reversible, and needs no rewrite rules.
 *
 * Deliberate choices:
 *   - SCRIPT_NAME, not PHP_SELF or REQUEST_URI. PHP_SELF carries any trailing PATH_INFO a
 *     visitor appends, and REQUEST_URI carries the whole query string; either would let an
 *     arbitrary URL nominate itself as canonical.
 *   - Every query parameter except lang is dropped. ?name= in particular produces a
 *     user-labelled variant of the same calculator (see echoHTMLHead) -- those are for
 *     bookmarking and sharing, not for indexing as separate pages.
 *   - /index.php collapses to the directory URL, so the suite front page has one address.
 *
 * @param string|null $lang  language code; defaults to the language being served
 * @return string            absolute URL, unescaped (escape at the point of output)
 */
function ec_canonical_url($lang = null) {
    global $clanguage;
    if ($lang === null) $lang = isset($clanguage) ? $clanguage : 'en';
    $path = isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/engcalcs/index.php';
    if (substr($path, -10) === '/index.php') $path = substr($path, 0, -9);
    return CANONICAL_ORIGIN . $path . '?lang=' . $lang;
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
    return implode(' ', $words);
}

function compare_langs ($baseLang, $secondLang) {
    $langDir = __DIR__;
    echo "$langDir<br />";
    unset($ec_lang);
    require("$langDir/lang.ec.$baseLang.php");
    $baseLang=$ec_lang;
    unset($ec_lang);
    require("$langDir/lang.ec.$secondLang.php");
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
