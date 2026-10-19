<?php
/**
 * User-Manual.php -- one address per chapter of the User Guide, per language (ROADMAP Task 816).
 *
 * The Guide lives inside the map application, one address per language, so a search for one topic
 * ("how do scenarios work") had no page to land on. This page answers `?lang=xx&chapter=<slug>` with
 * that one chapter as plain, server-rendered HTML, and with no chapter it answers an index of them.
 *
 * THE WORDS ARE THE GUIDE'S, NOT A COPY. The terms and definitions come from lib/GuideChapters.lib.php,
 * the same function Looped-Network.php renders its Guide from, so the two cannot differ. The language
 * is chosen the way every page of the suite chooses it (`?lang=`), and the canonical, the 27 hreflang
 * alternates and og:url follow the declaration in lib/Canonical.lib.php through ec_canonical_url().
 * The chapter joins the address through ecPageQuery(); the slug is matched against the list first.
 *
 * Copyright 2009 Thomas Gail Haws
 * LICENSE: GNU GPL v3 or later
 */
require_once('lib/base.inc.php');

$ec_chapters = ecGuideChapters();
$ec_slug = isset($_GET['chapter']) && is_string($_GET['chapter']) ? $_GET['chapter'] : '';
$ec_known = ecGuideIsChapter($ec_slug);
if ($ec_slug !== '' && !$ec_known) { http_response_code(404); }
$ec_brand = ecAppBrandName();
$ec_manual = $ec_lang['lpn_help_manual'];

if ($ec_known) {
	$ec_page_query = 'chapter=' . $ec_slug;
	$ec_heading = $ec_lang[$ec_chapters[$ec_slug]['title']];
	$html_title = $ec_heading . ' - ' . $ec_manual . ' - ' . $ec_brand;
	$html_desc = ecGuideSummary($ec_slug);
} else {
	$html_title = $ec_manual . ' - ' . $ec_brand;
	$html_desc = $ec_lang['lpn_guide_page_desc'];
}
echoHeader("EngCalcsApp", $html_title, "", false);

$ec_h = function ($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); };
$ec_app = ecCanonicalOrigin('Looped-Network.php', CANONICAL_ORIGIN, EC_CANONICAL_HOST)
	. ecCanonicalPath('Looped-Network.php') . '?lang=' . $clanguage;
$ec_chapter_href = function ($slug, $lang) {
	return 'User-Manual.php?lang=' . $lang . ($slug !== '' ? '&chapter=' . $slug : '');
};
?>
<div class="ec-guide-page">
<nav class="ec-guide-top d-print-none">
	<a href="<?=$ec_h($ec_app)?>"><?=$ec_h($ec_lang['lpn_guide_page_open'])?></a>
<?php if ($ec_known) : ?>
	<a href="<?=$ec_h($ec_chapter_href('', $clanguage))?>"><?=$ec_h($ec_manual)?></a>
<?php endif; ?>
</nav>
<main>
<?php if ($ec_known) : ?>
<h1><?=$ec_heading?></h1>
<?php foreach (ecGuideIntro($ec_slug) as $ec_para) : ?>
<p><?=$ec_h($ec_para)?></p>
<?php endforeach; ?>
<?=ecGuideDl($ec_slug)?>
<?php else : ?>
<h1><?=$ec_h($ec_manual)?></h1>
<p><?=$ec_h($ec_lang['lpn_guide_page_desc'])?></p>
<?php endif; ?>
</main>
<nav class="ec-guide-chapters" aria-label="<?=$ec_h($ec_lang['lpn_guide_contents'])?>">
<h2><?=$ec_h($ec_lang['lpn_guide_contents'])?></h2>
<ul>
<?php foreach ($ec_chapters as $ec_s => $ec_c) : ?>
	<li><?php if ($ec_s === $ec_slug && $ec_known) : ?><strong><?=$ec_lang[$ec_c['title']]?></strong><?php else : ?><a href="<?=$ec_h($ec_chapter_href($ec_s, $clanguage))?>"><?=$ec_lang[$ec_c['title']]?></a><?php endif; ?></li>
<?php endforeach; ?>
</ul>
</nav>
<nav class="ec-guide-langs d-print-none" aria-label="Languages">
<?php foreach ($all_language_settings as $ec_l => $ec_ls) : ?>
	<a href="<?=$ec_h($ec_chapter_href($ec_known ? $ec_slug : '', $ec_l))?>" lang="<?=$ec_h($ec_l)?>" hreflang="<?=$ec_h($ec_l)?>"><?=$ec_ls['LANGNAME']?></a>
<?php endforeach; ?>
</nav>
</div>
<?php
echoFooter("EngCalcs", false, true, false);
