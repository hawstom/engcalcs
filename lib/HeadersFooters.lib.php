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
EngCalcs.iconOpenTag = <?=json_encode(EC_ICON_OPEN_TAG)?>;</script>
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
function echoFooter($type, $nav = true, $legal = true) {
?>
<div class="left d-print-none">
<?php
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
<?php if (DEBUG_MODE === TRUE) : ?>
	<p>
		<a href="http://validator.w3.org/check/referer">
			<img
				src="/valid-xhtml11.gif"
				alt="Valid XHTML 1.1!"
				width="88"
				height="31"
				style="border:0;width:88px;height:31px"
			/>
		</a>
		<a href="http://jigsaw.w3.org/css-validator/validator?uri=http://www.hawsedc.com/hawsedc.css">
			<img
				src="/valid-css.gif"
				alt="Valid CSS!"
				width="88"
				height="31"
				style="border:0;width:88px;height:31px"
			/>
		</a>
		Click image buttons to check this page now with the
		World Wide Web Consortium, source of the HTML standard.
	</p>
<?php endif; ?>
</div>
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
