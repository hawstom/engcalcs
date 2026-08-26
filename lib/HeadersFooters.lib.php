<?php
function echoHeader($type="normal", $html_title = "", $html_head = "", $show_name_field = true) {
  switch (strtolower($type)) {
    case "normal":
            echoHTMLHead("Normal", $html_title, $html_head, false);
      break;
    case "engcalcs":
            echoHTMLHead("EngCalcs", $html_title, $html_head, $show_name_field);
      break;
  }
}
/****************************************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         Header HTML                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/****************************************************************************************************************/
/**
    * Header elements at top of page common to all header types
    **/
function echoHTMLHead($type, $html_title, $html_head, $show_name_field = true) {

global $ec_lang, $clanguage, $all_language_settings, $html_desc;
$html_lang = isset($clanguage) ? $clanguage : 'en';
$html_dir  = in_array($html_lang, ['ar', 'fa', 'he', 'ps', 'ur']) ? ' dir="rtl"' : '';
$calc_name = $show_name_field ? trim($_GET['name'] ?? '') : '';
$safe_name = htmlspecialchars($calc_name, ENT_QUOTES, 'UTF-8');
$page_title = $calc_name ? $safe_name . ' — ' . $html_title : $html_title;
?>
<!DOCTYPE html>
<html lang="<?=$html_lang?>"<?=$html_dir?>>
<head>
	<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
	<meta name="Generator" content="Notepad++"  />
	<meta name="Author" content="Thomas Gail Haws" />
	<meta name="Copyright" content="Copyright &copy; 2009&ndash;2026 Thomas Gail Haws. Licensed under the GNU GPL v3.0 or later." />
<?php
// Meta description (ROADMAP Task 150). Emitted here rather than in each page's $html_head for the
// same reason as the canonical/hreflang block below: one place, every page, and a new calculator
// gets it right for free. A page supplies it by setting the global $html_desc before calling
// echoHeader() -- normally from a *_meta_desc_plain language key, so it translates onto the
// ?lang=xx URLs Task 149 made indexable.
//
// Deliberately emitted only when non-empty. What this task replaced was a description that merely
// repeated the title on all 23 pages, which Google discards in favour of an auto-generated snippet
// scraped from a page whose above-the-fold content is a form. Repeating the title is worse than
// silence, so a page with nothing real to say gets no description tag at all.
if (isset($html_desc) && trim((string)$html_desc) !== '') :
?>
	<meta name="Description" content="<?=htmlspecialchars(trim((string)$html_desc), ENT_QUOTES, 'UTF-8')?>" />
<?php endif; ?>
	<?=$html_head?>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?=$calc_name ? $safe_name . ' — ' . $html_title : $html_title?></title>
<?php
// Canonical + hreflang (ROADMAP Task 149). Emitted here, in the one function every page's
// <head> passes through, so all 23 pages get it at once and a new calculator gets it for free.
//
// The canonical is self-referencing: this page in the language actually being served. That is
// what gives each ?lang=xx URL an identity of its own; the bare URL (no lang parameter) simply
// canonicalises to whichever language it negotiated, so it consolidates instead of competing.
// x-default points at the English URL rather than the bare one, precisely because the bare URL
// is not self-canonical -- an x-default aimed at a URL that canonicalises elsewhere is a signal
// Google is entitled to ignore. Naming ?lang=en for both en and x-default is explicitly allowed.
$ec_canonical = ec_canonical_url($html_lang);
?>
	<link rel="canonical" href="<?=htmlspecialchars($ec_canonical, ENT_QUOTES, 'UTF-8')?>" />
<?php foreach ($all_language_settings as $ec_alt_lang => $ec_alt_settings) : ?>
	<link rel="alternate" hreflang="<?=$ec_alt_lang?>" href="<?=htmlspecialchars(ec_canonical_url($ec_alt_lang), ENT_QUOTES, 'UTF-8')?>" />
<?php endforeach; ?>
	<link rel="alternate" hreflang="x-default" href="<?=htmlspecialchars(ec_canonical_url('en'), ENT_QUOTES, 'UTF-8')?>" />
<?php unset($ec_alt_lang, $ec_alt_settings); ?>
<?php
// SOCIAL SHARE CARDS -- Open Graph, plus the one X/Twitter tag that has no Open Graph equivalent
// (ROADMAP Task 534). Emitted here for the same reason the canonical block above is: one place,
// every page, and a new calculator gets it for free. **A person shares a CALCULATOR** -- that is
// the link that gets pasted -- so this was never a landing-page-only feature.
//
// ONE VOCABULARY, NOT ONE PER NETWORK. Facebook, LinkedIn, Slack, WhatsApp, Discord, Signal and
// iMessage all read og:*. X reads og:title, og:description and og:image too, and falls back to them
// whenever the twitter:* twin is absent -- so twitter:card is the ONLY twitter tag here, because
// the card TYPE is the one thing Open Graph cannot express. Duplicating the other three would be
// three more strings to keep in step with no behaviour to show for it.
//
// THREE OF THE FOUR REQUIRED PROPERTIES WERE ALREADY WRITTEN AND ALREADY TRANSLATED, which is why
// this is plumbing and not a writing project. ogp.me requires og:title, og:type, og:image and
// og:url. og:title is the <title> this function just built; og:description is the same $html_desc
// that <meta name="Description"> above uses -- the page's own *_main_desc, deliberately reused
// rather than given a meta key of its own (CLAUDE.md); og:url is $ec_canonical, so it inherits the
// host -> origin WHITELIST and is correct on every domain this one checkout serves.
//
// A PAGE WITH NO DESCRIPTION EMITS NO og:description, on purpose, and the same four pages are
// affected as above (index, contact, Compare-Languages, formmailsuccess). A card with a title, a
// picture and no subtitle is a normal card; a card reading "undefined" is a defect. The tag is
// simply absent rather than filled with the title, for exactly the Task 150 reason.
//
// og:image IS ABSOLUTE and that is not a style choice: a relative og:image is the commonest mistake
// in this whole vocabulary and every network drops it silently. It also carries NO ?v=filemtime,
// unlike every other asset in this head. Networks cache a card image hard and key it by URL; `git
// pull` does not preserve mtimes, so a busted URL would change on every deploy and orphan every
// card already scraped. The URL is meant to be STABLE. dev/scripts/social_card_check.php is what
// keeps the file behind it real -- a 404 here is invisible to us, because nobody looks at a share
// card for their own site.
//
// Width and height are declared so a network can lay the card out before it has fetched the picture,
// which is why they are carried in variables beside the file rather than typed into the tags: the
// suite card is 1200x576 (a 1200-wide card at that screenshot's own aspect) and a per-page card is
// 1200x630 (the 1.91:1 every network documents). A declaration that disagrees with the file lays
// out wrong on every network that trusts it, so social_card_check.php re-measures the real pixels.
// og:locale is deliberately absent: it wants a language_TERRITORY pair and this suite carries a
// bare language code, and the hreflang alternates above already say what languages exist.
//
// A CARD PER CALCULATOR -- the per-page half of ROADMAP Task 534, which shipped the suite card and
// recorded that per-page was blocked only for want of pictures. It is resolved by FILE PRESENCE and
// nothing else, so there is no list to keep in step and a card starts being used the moment somebody
// drops it in:
//
//     icons/cards/<Page>-<lang>.png   this page in this language
//     icons/cards/<Page>.png          this page, whatever language is being served
//     icons/social-card.png           the suite card
//
// **THE LANGUAGE STEP IS NOT A FLOURISH: the canonical URL carries ?lang=, so every language is a
// separate URL with its own hreflang alternates, and every network caches a card per URL.** A
// Spanish frame therefore has somewhere real to live, and English stays the default because one
// picture has to serve the other 25 URLs until a matching one exists -- a Chinese card on the
// English URL reads as a mistake rather than as a translation.
//
// The default cards are ENGLISH captures for that reason. Where the only frame we have is in
// another language it is filed under its -<lang> name alone, so it is right where it is used and
// absent everywhere else; dev/screenshots/INDEX.md names which calculators are still waiting for an
// English shot. Both parts of the name are constrained before they touch the filesystem: the page
// is basename()d and matched against [A-Za-z0-9-], the language against [a-z]{2}.
$og_title = trim(strip_tags((string)($calc_name !== '' ? $calc_name . ' — ' . $html_title : $html_title)));
$og_card   = 'icons/social-card.png';
$og_card_h = 576;
// English on purpose, both of these, and the only strings here that are not language keys. They
// describe pictures of an English interface, they are surfaced only by screen readers on X, and a
// key for either would be one more cell in a 27-language grid for a sentence nobody reads in either
// language. Named as a follow-up in Task 534 rather than left implicit.
$og_card_alt = 'A water distribution network drawn on a street map and coloured by pressure, with a hydraulic profile in the pane beneath it.';
$og_page = preg_replace('/\.php$/', '', basename((string)($_SERVER['SCRIPT_NAME'] ?? '')));
if (preg_match('/^[A-Za-z0-9-]+$/', $og_page)) {
	$og_tries = array();
	if (preg_match('/^[a-z]{2}$/', $html_lang)) { $og_tries[] = 'icons/cards/' . $og_page . '-' . $html_lang . '.png'; }
	$og_tries[] = 'icons/cards/' . $og_page . '.png';
	foreach ($og_tries as $og_try) {
		if (is_file(__DIR__ . '/../' . $og_try)) {
			$og_card   = $og_try;
			$og_card_h = 630;
			$og_card_alt = 'A screenshot of this calculator: its input form on the left and the computed results beside it.';
			break;
		}
	}
	unset($og_tries, $og_try);
}
$og_image = CANONICAL_ORIGIN . '/engcalcs/' . $og_card;
?>
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="<?=htmlspecialchars(strip_tags((string)$ec_lang['menu_brand']), ENT_QUOTES, 'UTF-8')?>" />
	<meta property="og:title" content="<?=htmlspecialchars($og_title, ENT_QUOTES, 'UTF-8')?>" />
	<meta property="og:url" content="<?=htmlspecialchars($ec_canonical, ENT_QUOTES, 'UTF-8')?>" />
<?php if (isset($html_desc) && trim((string)$html_desc) !== '') : ?>
	<meta property="og:description" content="<?=htmlspecialchars(trim((string)$html_desc), ENT_QUOTES, 'UTF-8')?>" />
<?php endif; ?>
	<meta property="og:image" content="<?=htmlspecialchars($og_image, ENT_QUOTES, 'UTF-8')?>" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="<?=(int)$og_card_h?>" />
	<meta property="og:image:alt" content="<?=htmlspecialchars($og_card_alt, ENT_QUOTES, 'UTF-8')?>" />
	<meta name="twitter:card" content="summary_large_image" />
<?php unset($og_title, $og_image, $og_card, $og_card_h, $og_card_alt, $og_page); ?>
	<link rel="manifest" href="/engcalcs/manifest.json">
	<meta name="theme-color" content="#1a6faf">
	<?php // Both spellings, deliberately. `mobile-web-app-capable` is the standard one and the only
	      // one Chrome still wants -- it logs a deprecation for the apple- prefix on every page load.
	      // The apple- one stays because iOS Safari has never supported the standard name, and
	      // dropping it would break add-to-home-screen on exactly the platform this feature exists
	      // for (found 2026-08-06 in Tom's console). ?>
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="default">
	<meta name="apple-mobile-web-app-title" content="EngCalcs">
	<link rel="apple-touch-icon" href="/engcalcs/icons/icon-192.png">
	<?php // Bootstrap 5.3.2, MIT, served from this site (ROADMAP Task 287). It used to come from
	      // jsDelivr, which meant every page load told a third party the visitor's IP address and
	      // user-agent -- no cookie and no tracking intent, but a transfer we could not honestly
	      // claim was not happening. The vendored copies are byte-identical to what the CDN served:
	      // their sha384 digests match the SRI hashes this tag used to carry. No integrity/crossorigin
	      // attributes now, because same-origin files have nothing to verify against a third party. ?>
	<link rel="stylesheet" href="/engcalcs/css/vendor/bootstrap.min.css?v=<?=filemtime(__DIR__.'/../css/vendor/bootstrap.min.css')?>">

<?php
if (substr($type, 0, 8) === "EngCalcs") {
?>
	<link rel="stylesheet" href="/engcalcs/css/engcalcs.css?v=<?=filemtime(__DIR__.'/../css/engcalcs.css')?>" type="text/css" />
<?php
}
?>

	<?php if (function_exists('engcalcsParentCSS')) engcalcsParentCSS(); ?>

</head>
<body>
<script src="/engcalcs/js/vendor/bootstrap.bundle.min.js?v=<?=filemtime(__DIR__.'/../js/vendor/bootstrap.bundle.min.js')?>"></script>

<?php if (substr($type, 0, 8) === "EngCalcs") : ?>
<script src="/engcalcs/js/Cookies.lib.js?v=<?=filemtime(__DIR__.'/../js/Cookies.lib.js')?>"></script>
<script src="/engcalcs/js/Calculators.lib.js?v=<?=filemtime(__DIR__.'/../js/Calculators.lib.js')?>"></script>
<?php
echoEngCalcsMenu($html_title, $show_name_field, $calc_name);
endif;
?>
<?php // The ids are what ROADMAP Task 289's "Show page titles" toggle hides on Looped-Network.
      // Given here rather than found by tag name so the toggle cannot start hiding some other
      // page's first heading if this markup ever moves. Harmless everywhere else. ?>
<h1 id="ec-page-title" class="d-print-none"><?=$html_title?></h1>
<p id="ec-page-welcome" class="d-print-none ec-welcome"><?=$ec_lang['template_welcome']?></p>
<script>EngCalcs.pageTitle = <?=json_encode($html_title)?>;
<?php // The single source of icon geometry, shared with PHP's ecIcon() (Task 231). JS-built
      // chrome builds its <svg> from these same strings; a path redrawn in JS would be a
      // second icon pretending to be the first. ?>
EngCalcs.icons = <?=json_encode($GLOBALS['ec_icons'], JSON_UNESCAPED_SLASHES)?>;
EngCalcs.iconOpenTag = <?=json_encode(EC_ICON_OPEN_TAG)?>;
<?php // Task 390: a unit's identity is its NAME, and the factor is a lookup from it. A unit
      // <select>'s option value is 'ft'; this table is the only thing that turns that into
      // 3.280839895013123. ONE source of truth -- lib/Units.lib.php -- shared by PHP and JS,
      // never a second set of constants retyped in a .js file. ?>
EngCalcs.unitFactors = <?=json_encode($GLOBALS['ec_units'])?>;</script>
<?php
}
/****************************************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         Normal Footer                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/****************************************************************************************************************/
// $nav = false drops the site-wide navigation row and its rule, and NOTHING else. Added 2026-08-14
// for Looped-Network.php (Tom: "lpn is very greedy for real estate. I think it's okay to remove all
// the footers. They are available at the HawsEDC Calculators home").
//
// **WHAT "ALL THE FOOTERS" CAN AND CANNOT MEAN, because the difference is legal rather than
// aesthetic.** Four things live down here, and only the first is navigation:
//
//   1. the ten-link parent-site row -- genuinely redundant, genuinely available on the calculators
//      home, and the whole of the real estate Tom is objecting to;
//   2. the privacy / terms / cookie-settings links;
//   3. the consent banner itself;
//   4. the service worker registration.
//
// ROADMAP Task 286 put 2 and 3 in every footer on every page for a stated reason -- "a privacy
// notice nobody can find is not notice", and "Cookie settings" must have something to reopen
// "wherever the visitor happens to be standing". Those are not available at the calculators home in
// any sense that matters: a visitor who arrived at this page from a search has never seen that
// page. So this parameter reclaims the row and leaves the notice, which is what the request was
// actually about. It costs one line of links -- and after Task 314 moved the Notes into Help, one
// line is very nearly all that is left below the map.
// $legal = false ALSO drops the privacy/terms/cookie-settings row -- and is legitimate ONLY where
// the page carries those links somewhere else that is always reachable. Looped-Network.php puts
// them in its Help menu and in the examples gallery, which is exactly where epanet-js puts its own
// Terms and Privacy: in the app's own chrome, not in a footer under the map (checked 2026-08-14 at
// Tom's suggestion -- their splash panel carries "Terms and conditions" and "Privacy policy" in its
// sidebar). Task 286's requirement is that the notice be FINDABLE and that withdrawal be as easy as
// consent; it never required a particular piece of furniture. What is not negotiable is that the
// banner itself and the service worker below still render, which they do either way.
// $devtools existed for one hour on 2026-08-15, to keep the W3C validator badges off the map page.
// Tom then deleted the badges outright, so the flag has nothing left to gate -- kept, unused and
// accepted by every caller, only because removing a parameter from a function twenty pages call is
// churn with no reader on the other side of it.
function echoFooter($type, $nav = true, $legal = true, $devtools = true) {
?>
<?php // **AN EMPTY FLOAT IS NOT NOTHING, AND THAT IS WHY THIS IS BUFFERED.** `.left` is
      // `float: left`, and a float is not in `document.body`'s content box -- so on a page that
      // calls this with `$nav = false, $legal = false` (Looped-Network.php does) the div rendered
      // empty, floated, and added ~15 px to `documentElement.scrollHeight` that
      // `flowBelowMap()` could not measure and no amount of map-height arithmetic could ever find.
      // ROADMAP Task 432's window scrollbar was this, and `html { overflow: hidden }` was hiding
      // the consequence rather than removing it. Proven by dev/browser-pass/specs/noscroll.js:
      // delete this one div on that page and the overflow goes to exactly zero.
      //
      // So the contents are built first and the wrapper is emitted only if there are any. Every
      // page that does have footer content is byte-identical to before.
      ob_start();
if ($nav) {
	if (function_exists('engcalcsParentMenu')) engcalcsParentMenu();
?>
<hr />
<?php
}
// ROADMAP Task 286. Both go in every footer on every page: the links because a privacy notice
// nobody can find is not notice, and the banner because "Cookie settings" has to have something
// to reopen wherever the visitor happens to be standing.
if ($legal && function_exists('echoConsentFooterLinks')) echoConsentFooterLinks();
?>
<?php // THE W3C VALIDATOR BADGES WERE HERE AND ARE DELETED (Tom, 2026-08-15: "Delete the block.
      // It would be nice to check the validity of our CSS and HTML, but I guess you probably do
      // that in other ways.").
      //
      // They were gated on DEBUG_MODE, so only a dev host ever saw them -- but they had stopped
      // being true and stopped being able to work. The badge claimed "Valid XHTML 1.1" on a suite
      // that is HTML5, and validator.w3.org/check/referer asks the W3C to fetch the page it was
      // linked from, which it cannot do for a host that is not on the public internet. A button
      // that makes a false claim and could not act on it either way is worse than no button.
      //
      // WHAT ACTUALLY CHECKS THIS NOW, so the loss is named: dev/scripts/html_balance_check.php
      // renders EVERY page and verifies its tag balance, blocking, on every run of check_all.sh.
      // That is not a validator -- it does not know a <p> may not contain a <div>, and NOTHING in
      // the repo checks the CSS at all. If either matters, the honest answer is a real validator in
      // check_all.sh (the W3C offers a local jar and an API), not a link. ?>
<?php
$ec_footer_left = trim(ob_get_clean());
if ($ec_footer_left !== '') { echo '<div class="left d-print-none">' . $ec_footer_left . '</div>' . "\n"; }
?>
<?php if (function_exists('echoConsentBanner')) echoConsentBanner(); ?>
<script>
// The worker is GENERATED (sw.php, ROADMAP Task 318) so its precached URLs carry the same
// filemtime the pages request; a static sw.js could not, because deployment is `git pull` and
// git does not preserve mtimes. sw.php sits in the suite root, so '/engcalcs/' is the widest
// scope it is allowed and no Service-Worker-Allowed header is needed. A registration is keyed by
// SCOPE, so this replaces a returning visitor's old '/engcalcs/sw.js' registration in place.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/engcalcs/sw.php', { scope: '/engcalcs/' });
}
</script>
</body>
</html>
<?php
}
// Omit last closing tag is good practice.
