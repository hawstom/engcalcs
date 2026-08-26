<?php
/**
 * social_card_check.php -- the share-card image is ABSOLUTE, real, and the size the tags claim.
 *
 * WHY THIS EXISTS (ROADMAP Task 534). A share card fails in a way nobody on this side ever sees:
 * you do not paste links to your own site into Facebook, so a card that has silently gone to a
 * grey placeholder stays broken until a stranger mentions it, and strangers do not. Every other
 * head tag in this suite is visible to somebody who opens the page. This one is visible only to
 * whoever shared it.
 *
 * The two failures are both silent and both cheap to check:
 *
 *   1. **A RELATIVE og:image.** The commonest mistake in the whole Open Graph vocabulary. Networks
 *      do not resolve it against the page URL and do not report it -- they simply render a card
 *      with no picture. `content="/engcalcs/icons/social-card.png"` looks completely right in the
 *      rendered head and is completely dead.
 *   2. **A 404 BEHIND A CORRECT URL.** Rename the file, move it, drop it from a deploy, and the
 *      tag still validates as a URL. Every network then caches the failure hard, keyed by URL, so
 *      the broken card outlives the fix.
 *
 * WHAT IS ASSERTED, over every page the suite actually renders:
 *   1. Every page with a <head> emits og:image. A refactor that drops the block from one branch of
 *      echoHTMLHead() is a regression, not a style change.
 *   2. Every og:image (and any twitter:image) is an absolute http(s) URL whose origin is one this
 *      suite owns -- CANONICAL_ORIGIN's own whitelist, read from lib/config.inc.php rather than
 *      retyped, so adding a domain there does not fail this check.
 *   3. The URL's path resolves to a file that EXISTS on disk in this checkout, and is non-empty.
 *   4. The file is a PNG or JPEG whose real pixel dimensions match the declared og:image:width /
 *      og:image:height. A card resized without its tags being updated lays out wrong on every
 *      network that trusts the declaration.
 *   5. The card URL carries NO ?v= cache-buster. Every other asset here does, deliberately; this
 *      one must not. Networks key their cache on the URL and `git pull` does not preserve mtimes,
 *      so a busted card URL would change on every deploy and orphan every card already scraped.
 *   6. The file is under 5 MB, which is the smallest of the networks' published limits (X's; media
 *      Facebook accepts to 8 MB). Over it, some networks show no picture at all.
 *   7. **EVERY FILE IN icons/cards/ IS A REAL 1200x630 PNG THAT ITS OWN PAGE ACTUALLY DECLARES**
 *      (the per-page half of Task 534). The per-calculator cards are wired by FILENAME alone -- echoHTMLHead() tries
 *      icons/cards/<Page>-<lang>.png, then icons/cards/<Page>.png, then the suite card -- so a name
 *      that is wrong by one character is simply never served, and there is no list anywhere that
 *      would disagree with it. The loop over pages cannot see this on its own: it renders in
 *      English, so a card for the Burmese URL is invisible to it. Each card is therefore rendered
 *      in the language its own name claims and the og:image it produces is compared back.
 *
 * Blocking. Every finding here is a card that is already broken or about to be.
 *
 * Usage:
 *   php dev/scripts/social_card_check.php            # every page
 *   php dev/scripts/social_card_check.php -v         # and print what each page declared
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 */

$root = dirname(__DIR__, 2);
$verbose = in_array('-v', $argv, true) || in_array('--verbose', $argv, true);

$fail = 0;
function bad($msg) { global $fail; $fail++; echo "  FAIL  $msg\n"; }

// The origins this suite serves, read out of the whitelist rather than retyped. canonical_origin_check.php
// already guarantees the shape of that array; here we only need the values, so that adding a domain
// in one place does not make this check start rejecting it.
$config = (string)file_get_contents($root . '/lib/config.inc.php');
$origins = array();
if (preg_match('/\$ec_canonical_origins\s*=\s*Array\s*\((.*?)\);/s', $config, $m)
    && preg_match_all("/=>\s*'([^']+)'/", $m[1], $om)) {
    $origins = array_values(array_unique($om[1]));
}
if (!$origins) {
    bad("could not read \$ec_canonical_origins out of lib/config.inc.php; canonical_origin_check.php\n"
      . "        will have more to say about that. Fix it there first.");
    echo "\nFAIL: social card\n";
    exit(1);
}

/** Real pixel size of a PNG or JPEG, without an image library. array(w, h, 'image/png') or null. */
function image_size($path)
{
    $fh = fopen($path, 'rb');
    if (!$fh) { return null; }
    $sig = fread($fh, 8);
    if ($sig === "\x89PNG\r\n\x1a\n") {
        // IHDR is required to be the first chunk: 4 length, 4 type, then width and height.
        $ihdr = fread($fh, 16);
        fclose($fh);
        if (strlen($ihdr) < 16 || substr($ihdr, 4, 4) !== 'IHDR') { return null; }
        $d = unpack('Nw/Nh', substr($ihdr, 8, 8));
        return array($d['w'], $d['h'], 'image/png');
    }
    if (substr($sig, 0, 2) === "\xFF\xD8") {
        // Walk the JPEG marker chain to the first SOFn, which carries the frame dimensions.
        fseek($fh, 2);
        while (!feof($fh)) {
            $b = fread($fh, 1);
            if ($b !== "\xFF") { continue; }
            do { $marker = fread($fh, 1); } while ($marker === "\xFF");
            $mk = ord($marker);
            // SOF0..SOF15, skipping the four that are not frame headers (DHT, JPG, DAC, RSTn).
            if ($mk >= 0xC0 && $mk <= 0xCF && !in_array($mk, array(0xC4, 0xC8, 0xCC), true)) {
                fread($fh, 3); // segment length (2) + sample precision (1)
                $d = unpack('nh/nw', (string)fread($fh, 4));
                fclose($fh);
                return array($d['w'], $d['h'], 'image/jpeg');
            }
            $len = unpack('n', (string)fread($fh, 2));
            if (!$len || $len[1] < 2) { break; }
            fseek($fh, $len[1] - 2, SEEK_CUR);
        }
        fclose($fh);
        return null;
    }
    fclose($fh);
    return null;
}

/** One subprocess per page -- the only correct way to render outside a web request. */
function render_page($path, $lang = null)
{
    $cmd = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__DIR__ . '/render_page.php')
         . ' ' . escapeshellarg(basename($path))
         . ($lang === null ? '' : ' ' . escapeshellarg('--lang=' . $lang)) . ' 2>/dev/null';
    $html = shell_exec($cmd);
    return ($html === null || trim($html) === '') ? null : $html;
}

/** Every value of <meta property="X" content="Y"> (or name=), in document order. */
function meta_values($html, $key)
{
    $out = array();
    $re = '/<meta\s+(?:property|name)\s*=\s*"' . preg_quote($key, '/') . '"\s+content\s*=\s*"([^"]*)"/i';
    if (preg_match_all($re, $html, $m)) { $out = $m[1]; }
    return $out;
}

$pages = array_filter(glob($root . '/*.php'), function ($p) {
    // Endpoints and includes render no page of their own; sw.php emits JavaScript.
    $skip = array('lpn-lock.php', 'log-calc-event.php', 'log-human-view.php', 'log-signal-event.php',
                  'log-title-event.php', 'formmail.php', 'sw.php');
    return !in_array(basename($p), $skip, true);
});

$checkedFiles = array();
$pagesWithCard = 0;

foreach ($pages as $page) {
    $name = basename($page);
    $html = render_page($page);
    if ($html === null || stripos($html, '<head') === false) { continue; }

    $images = array_merge(meta_values($html, 'og:image'), meta_values($html, 'twitter:image'));
    if (!$images) {
        bad("$name: renders a <head> but declares no og:image, so a link to it shows a bare URL.\n"
          . "        The tag block lives in echoHTMLHead() (lib/HeadersFooters.lib.php) precisely so\n"
          . "        every page gets it; if this page is deliberately not shareable, skip it by name\n"
          . "        in this script and say why.");
        continue;
    }
    $pagesWithCard++;

    $declaredW = meta_values($html, 'og:image:width');
    $declaredH = meta_values($html, 'og:image:height');
    $declaredT = meta_values($html, 'og:image:type');

    foreach ($images as $url) {
        if ($verbose) { echo "  $name -> $url\n"; }

        if (!preg_match('#^https?://#i', $url)) {
            bad("$name: og:image is RELATIVE -- '$url'.\n"
              . "        Every network drops a relative og:image silently: the card renders with no\n"
              . "        picture and nothing reports it. Build it from CANONICAL_ORIGIN.");
            continue;
        }
        if (strpos($url, '?') !== false) {
            bad("$name: the card URL carries a query string -- '$url'.\n"
              . "        No ?v=filemtime here, unlike every other asset in that head. Networks cache a\n"
              . "        card image hard and key it by URL, and `git pull` does not preserve mtimes, so\n"
              . "        a busted URL changes on every deploy and orphans every card already scraped.");
            continue;
        }

        $origin = null;
        foreach ($origins as $o) {
            if (strpos($url, $o . '/') === 0) { $origin = $o; break; }
        }
        if ($origin === null) {
            bad("$name: og:image origin is not one this suite serves -- '$url'.\n"
              . "        Allowed: " . implode(', ', $origins) . " (from \$ec_canonical_origins in\n"
              . "        lib/config.inc.php). Add a domain there, not here.");
            continue;
        }

        // The suite is served at <origin>/engcalcs/, and this checkout IS that directory.
        $path = substr($url, strlen($origin));
        if (strpos($path, '/engcalcs/') !== 0) {
            bad("$name: og:image path '$path' is outside /engcalcs/, so it names a file this\n"
              . "        repository does not contain and cannot keep true.");
            continue;
        }
        $file = $root . substr($path, strlen('/engcalcs'));
        if (!is_file($file)) {
            bad("$name: og:image 404s -- '$url' resolves to " . str_replace($root . '/', '', $file)
              . ",\n        which does not exist. Nobody looks at a share card for their own site, so this\n"
              . "        would have stayed broken. Restore the file, or point the tag at the real one.");
            continue;
        }
        $bytes = filesize($file);
        $rel = str_replace($root . '/', '', $file);
        if ($bytes < 1) {
            bad("$name: the card file $rel is empty.");
            continue;
        }
        if ($bytes > 5 * 1024 * 1024) {
            bad("$name: the card file $rel is " . round($bytes / 1048576, 1) . " MB.\n"
              . "        5 MB is the smallest published limit among the networks (X's); over it some\n"
              . "        show no picture at all. Shrink it -- dev/scripts/png_redact.js scale.");
            continue;
        }

        if (isset($checkedFiles[$file])) { continue; }
        $checkedFiles[$file] = true;

        $size = image_size($file);
        if ($size === null) {
            bad("$name: $rel is not a PNG or JPEG this script can read a size out of.\n"
              . "        Networks accept PNG, JPEG, GIF and WebP; this check knows the first two, so\n"
              . "        either ship one of those or teach image_size() the format you chose.");
            continue;
        }
        list($w, $h, $mime) = $size;
        if ($declaredW && (int)$declaredW[0] !== $w) {
            bad("$name: og:image:width says {$declaredW[0]} but $rel is {$w}px wide.\n"
              . "        A network that trusts the declaration lays the card out at the wrong size.");
        }
        if ($declaredH && (int)$declaredH[0] !== $h) {
            bad("$name: og:image:height says {$declaredH[0]} but $rel is {$h}px tall.");
        }
        if ($declaredT && strtolower($declaredT[0]) !== $mime) {
            bad("$name: og:image:type says {$declaredT[0]} but $rel is $mime.");
        }
        if ($w < 200 || $h < 200) {
            bad("$name: $rel is {$w}x{$h}. Under 200px on a side, Facebook refuses the image\n"
              . "        outright; 1200 wide is the size every network is documented against.");
        }
        if ($verbose) {
            echo "        $rel: {$w}x{$h} $mime, " . round($bytes / 1024) . " KB\n";
        }
    }
}

// ---------------------------------------------------------------------------------------------
// THE PER-CALCULATOR CARDS (the per-page half of Task 534). The loop above sees only what an ENGLISH render
// declares, so it can never reach icons/cards/<Page>-<lang>.png -- and a language card is exactly
// the kind of file that would sit there for a year being wrong, because nobody browses in Burmese
// and then pastes the link into Facebook. So every file in the directory is checked on its own
// terms, and then PROVEN TO BE REACHED by rendering the page in the language it names.
//
// The name is the whole wiring: there is no list, so a card is used iff its filename resolves.
// That makes a typo silent by construction -- `Manning-Trap-idd.png` simply never appears -- which
// is why a card naming no page of this suite is a failure here rather than a shrug.
$cardDir = $root . '/icons/cards';
$knownLangs = array();
foreach (glob($root . '/lib/lang.ec.??.php') as $lf) {
    if (preg_match('/lang\.ec\.([a-z]{2})\.php$/', $lf, $lm)) { $knownLangs[] = $lm[1]; }
}
$cards = is_dir($cardDir) ? glob($cardDir . '/*') : array();
foreach ($cards as $card) {
    $base = basename($card);
    $rel  = 'icons/cards/' . $base;
    if (substr($base, -4) !== '.png') {
        bad("$rel is not a .png. echoHTMLHead() declares og:image:type image/png for everything in\n"
          . "        this directory, so a file of another type would be advertised as a lie. Convert it\n"
          . "        or move it out.");
        continue;
    }
    $stem = substr($base, 0, -4);
    $lang = null;
    $page = $stem;
    if (preg_match('/^(.*)-([a-z]{2})$/', $stem, $sm) && in_array($sm[2], $knownLangs, true)) {
        $page = $sm[1];
        $lang = $sm[2];
    }
    if (!is_file($root . '/' . $page . '.php')) {
        bad("$rel names no page of this suite -- there is no $page.php.\n"
          . "        Nothing reads a list; echoHTMLHead() looks the filename up, so a card whose name is\n"
          . "        wrong by one character is never served and nothing else would ever say so.");
        continue;
    }

    $bytes = filesize($card);
    if ($bytes < 1) { bad("$rel is empty."); continue; }
    if ($bytes > 5 * 1024 * 1024) {
        bad("$rel is " . round($bytes / 1048576, 1) . " MB; 5 MB is the smallest published limit\n"
          . "        among the networks. Shrink it -- dev/scripts/png_redact.js scale.");
        continue;
    }
    $size = image_size($card);
    if ($size === null) { bad("$rel is not a PNG this script can read a size out of."); continue; }
    list($cw, $ch, $cmime) = $size;
    if ($cmime !== 'image/png' || $cw !== 1200 || $ch !== 630) {
        bad("$rel is {$cw}x{$ch} $cmime, but echoHTMLHead() declares every card in this directory\n"
          . "        as 1200x630 image/png -- the 1.91:1 every network documents. It does not measure the\n"
          . "        file, so a card of another size lays out wrong wherever the declaration is trusted.\n"
          . "        Rebuild it: png_redact.js crop to a 40:21 box, then scale 1200 630.");
        continue;
    }

    // Proven reached, in the language the name claims. This is the only assertion that exercises the
    // lookup's ORDER -- a -<lang> card must beat the page's default card, and the page's default card
    // must beat the suite card.
    $html = render_page($root . '/' . $page . '.php', $lang);
    $got = $html === null ? array() : meta_values($html, 'og:image');
    if (!$got || substr($got[0], -strlen('/' . $rel)) !== '/' . $rel) {
        bad("$rel exists but $page.php" . ($lang === null ? '' : " in $lang") . " does not declare it.\n"
          . "        og:image came back as '" . ($got ? $got[0] : '(none)') . "'. The lookup in\n"
          . "        echoHTMLHead() prefers icons/cards/<Page>-<lang>.png, then icons/cards/<Page>.png,\n"
          . "        then the suite card; a card that is never reached is a card nobody will ever see.");
        continue;
    }
    if ($verbose) { echo "  $rel: reached by $page.php" . ($lang === null ? '' : " --lang=$lang") . ", {$cw}x{$ch}\n"; }
}

if ($pagesWithCard === 0) {
    bad("no page declared a share card at all. Either every page failed to render -- run\n"
      . "        html_balance_check.php, which would also be failing -- or the tag block has been\n"
      . "        removed from echoHTMLHead().");
}

if ($fail) {
    echo "\nFAIL: social card ($fail finding" . ($fail === 1 ? '' : 's') . ")\n";
    exit(1);
}
echo "ok: $pagesWithCard pages declare a share card; " . count($checkedFiles) . " image file(s) checked and real;\n"
   . "    " . count($cards) . " per-calculator card(s) in icons/cards/, each 1200x630 and each reached by its own page.\n";
exit(0);
