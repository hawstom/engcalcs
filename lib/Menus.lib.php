<?php
/**
 *
 * echoMenu
 * This function is called from each page to display a site menu.
 *
**/
function echoMenu($type) {
    switch (strtolower($type)) {
        default:

        case "main":
            echoMainMenu();
            break;

        case "engcalcs":
            echoEngCalcsMenu();
            break;

    }
}
/**
 *
 * echoMainMenu
 * This function is called from echoMenu to display the main site menu.
 * Reads from a text file
 * and displays a one-line html menu.
 * The text file format is alternating lines of url, text, url, text.
 *
**/
function echoMainMenu() {
// Define the menu items.
  $menuarr =
    array(
        array('/index.php','Home'),
        array('/support.php','AutoCAD Tools'),
        array('/gnu/index.php','FreeSoftware'),
        array('/engserv.php','Engineering Services'),
        array('/engcalcs/index.php','Engineering Calculators'),
        array('/techdocs.php','Technical Documents'),
        array('https://tomsthird.blogspot.com/','Blog'),
        array('/thomas','Personal essays'),
        array('/famtree.php','Collaborative Family Trees'),
        array('/engcalcs/contact.php','Contact')
    );
    echo '<div class="d-print-none">';
// Step through the array
  for ($i = 0; $i < count($menuarr); $i += 1) {
// If the URL is absolute (starts with 'http'), display it always.
    if (substr ($menuarr[$i][0], 0, 4) == 'http') {
      echo '<a href="'.rtrim($menuarr[$i][0]).'">'.rtrim($menuarr[$i][1]).'</a>';
// Else if the URL is the current page, show the text as plain bold (not a link).
    } elseif (rtrim($menuarr[$i][0]) == $_SERVER['PHP_SELF']) {
      echo '<strong>'.rtrim($menuarr[$i][1]).'</strong>';
// Else show the URL and text as a link. The path is already root-relative, so emit it as-is
// (fixed 2026-08-08, ROADMAP Task 227). It used to be absolutized as
// 'http://' . $_SERVER['SERVER_NAME'] . $path, which was wrong three ways at once: it downgraded
// nine links per page to http for every https visitor (each one a 301 round trip, and a moment of
// plaintext on a site with no HSTS); it derived the host from a client-supplied header, the very
// thing config.inc.php refuses to do for CANONICAL_ORIGIN; and it emitted an undefined-index
// warning wherever SERVER_NAME is absent, such as CLI. A root-relative path is correct from any
// depth and on all four of http/https x www/non-www, which is what the site actually answers on.
    } else {
      echo '<a href="'.htmlspecialchars(rtrim($menuarr[$i][0]), ENT_QUOTES, 'UTF-8').'">'.rtrim($menuarr[$i][1]).'</a>';
    }
// If there are more menu items coming, add a vertical bar and spaces.
    if (isset($menuarr[$i + 1]))
      echo ' | ';

  }
    echo '</div>';}
/**
 *
 * echoMainMenu
 * This function is called from echoMenu to display the main site menu.
 * Reads from a text file
 * and displays a one-line html menu.
 * The text file format is alternating lines of url, text, url, text.
 *
**/
function echoEngCalcsMenu ($html_title = '', $show_name_field = false, $calc_name = '') {
    global $ec_lang, $language_settings;
?>

<?php // **EVERY LINK IN THIS BAR IS ABSOLUTE FROM THE ORIGIN, AND THAT IS NOT TIDINESS** (Tom,
      // 2026-09-09, looking at librewaternet.org: *"1st and 3rd items (Hawsedc Calculators and
      // Hydraulics) and Help don't even work at LibreWaterNet.org, which is embarrassment we forgot
      // to check."*). They were RELATIVE, which is correct at `hawsedc.com/engcalcs/Whatever.php`
      // and wrong everywhere else: `/app/` is a REWRITE onto Looped-Network.php, so a relative
      // `Manning-Pipe-Flow.php` resolves against `/app/` and 404s, and so does `index.php`. Nothing
      // could see it -- the markup is identical on both hosts and only the base differs.
      //
      // EC_SW_BASE is the declared canonical mount and its own comment already says every absolute
      // path in the source names it; the favicon link does the same. It stays a PATH rather than a
      // full URL so the bar never sends a reader to the other host, and it is the base mount rather
      // than the current one because `/app/` serves exactly one page and none of these live there. ?>
<nav class="navbar navbar-expand-lg navbar-light bg-light d-print-none">
	<?php // ONE flex item, not two (Tom, 2026-08-09, third pass): "I still see it floating
	      // rightward/center instead of leftward against 'HawsEDC Calculators' when the window is
	      // narrow. Why can't they be in the same div?" Right on both counts. Bootstrap's .navbar
	      // is display:flex with justify-content:space-between, so the brand, this link and the
	      // hamburger were three SIBLING flex items and the free space was dealt out BETWEEN them
	      // -- which is why the gap grew as the window narrowed, the opposite of what you want.
	      // Wrapping the two in one element makes them a single item that the space-between rule
	      // cannot split. ?>
	<span class="ec-brandgroup">
	<a class="navbar-brand" href="<?=EC_SW_BASE?>index.php"><?=$ec_lang['menu_brand']?></a>
	<?php // Task 244 (Tom, 2026-08-09), placed OUTSIDE .navbar-collapse deliberately.
	      // It first shipped as the top item of the collapsing nav list, and Tom's browser
	      // review rejected that: "I think it would be better for 'Libre Software' not to
	      // collapse into the upper right corner menu as its top item, but instead to appear
	      // as an extension of the HawsEDC Calculators {} Libre Software, almost as one
	      // string." So it is a sibling of the brand, not a nav item -- always visible, never
	      // behind the hamburger, reading as a continuation of the project's name rather than
	      // as one destination among many. Anything inside .collapse disappears under lg. ?>
	<?php // Points at the README's License section, not at the repository root (Tom, 2026-08-10).
	      // The label makes a claim -- "Libre Software" -- and the link should land on the sentence
	      // that backs it up (GPL v3 or later, plus what that grants you), rather than on a file
	      // listing the visitor then has to read a repo to verify. ?>
	<a class="ec-nav-libre" id="nav-libre" target="_blank" rel="noopener" href="https://github.com/hawstom/engcalcs/blob/master/README.md#license"><?=ecIcon('github')?><?=$ec_lang['menu_libre']?></a>
	</span>
	<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>

	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav me-auto">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle active" id="dropdown-calc" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<?=$ec_lang['menu_main_hydraulics']?>
				</a>
				<div class="dropdown-menu" aria-labelledby="dropdown-calc">
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Manning-Pipe-Flow.php" title="<?=$ec_lang['mpf_main_desc']?>"><?=$ec_lang['mpf_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Manning-Pipe-Head-Loss.php" title="<?=$ec_lang['mphl_main_desc']?>"><?=$ec_lang['mphl_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Hazen-Williams.php" title="<?=$ec_lang['hw_main_desc']?>"><?=$ec_lang['hw_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Darcy-Weisbach.php" title="<?=$ec_lang['dw_main_desc']?>"><?=$ec_lang['dw_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Branched-Network.php" title="<?=$ec_lang['bpn_main_desc']?>"><?=$ec_lang['bpn_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Looped-Network.php" title="<?=$ec_lang['lpn_main_desc']?>"><?=$ec_lang['lpn_main_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Manning-Trap.php" title="<?=$ec_lang['mtc_main_desc']?>"><?=$ec_lang['mtc_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Manning-Irregular.php" title="<?=$ec_lang['mi_main_desc']?>"><?=$ec_lang['mi_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Rock-Chute.php" title="<?=$ec_lang['rc_main_desc']?>"><?=$ec_lang['rc_main_menu']?></a>
					<div class="dropdown-divider"></div>
										<a class="dropdown-item" href="<?=EC_SW_BASE?>Micro-Hydro-Power.php" title="<?=$ec_lang['mhp_main_desc']?>"><?=$ec_lang['mhp_main_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Orifice.php" title="<?=$ec_lang['or_main_desc']?>"><?=$ec_lang['or_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Orifice-Drain-Time.php" title="<?=$ec_lang['odt_main_desc']?>"><?=$ec_lang['odt_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Weir-Flow-Simple.php" title="<?=$ec_lang['ws_main_desc']?>"><?=$ec_lang['ws_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Weir-Flow-Irregular.php" title="<?=$ec_lang['wi_main_desc']?>"><?=$ec_lang['wi_menu']?></a>
					<div class="dropdown-divider"></div>
					<?php // Irrigation.php is deliberately absent from this menu (Task 232, 2026-08-08).
					      // Every other item here is a calculator; that page is a card index pointing
					      // back at this very dropdown, so as a plain "Irrigation" entry it read as a
					      // calculator and wasn't one. The page still exists and is still in the
					      // sitemap -- only the menu entry is gone. ?>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Canal-Seepage.php" title="<?=$ec_lang['cs_main_desc']?>"><?=$ec_lang['cs_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Irrigation-Pressure.php" title="<?=$ec_lang['ip_main_desc']?>"><?=$ec_lang['ip_main_menu']?></a>
				</div>
			</li>
		</ul>
<?php if ($show_name_field) : ?>
		<button id="ec-install-btn" type="button" class="btn btn-sm btn-outline-primary ms-3" style="display:none" onclick="EngCalcs.installPWA()"><?=ecIcon('install')?><?=$ec_lang['install_main_menu']?></button>
		<form class="d-flex align-items-center ms-3" style="gap:0.4em" onsubmit="return false;">
			<?php // Task 291: this hand-rolled a .ec-tip glyph -- inline styles copying that class rule for
			      // rule, beside the label rather than wrapping it -- so the tap target was the one "?"
			      // character the whole-label convention exists to avoid. ecTipLabel() gives the
			      // no-link nesting: .ec-help wraps the label text AND the glyph. ?>
			<label for="ec_calc_name" class="small fw-semibold text-nowrap mb-0"><?=ecTipLabel($ec_lang['ec_name_label'] ?? 'Label:', $ec_lang['ec_name_tip'] ?? '')?></label>
			<input type="text" id="ec_calc_name"
				class="form-control form-control-sm"
				style="width:14em"
				placeholder="<?=htmlspecialchars($ec_lang['ec_name_placeholder'] ?? 'Label for bookmarking/sharing', ENT_QUOTES, 'UTF-8')?>"
				title="<?=htmlspecialchars($ec_lang['ec_name_tip'] ?? 'letters, digits, spaces, – _ .', ENT_QUOTES, 'UTF-8')?>"
				value="<?=htmlspecialchars($calc_name, ENT_QUOTES, 'UTF-8')?>"
				maxlength="50"
				autocomplete="off">
			<button type="button" id="ec-copy-link-btn" class="btn btn-sm btn-outline-secondary"
				<?php // Just the word: copyLink() swaps the icon to a tick for the 1.5s this shows,
				      // so the confirm state keeps an icon without one being baked into the text. ?>
				data-copied-text="<?=htmlspecialchars($ec_lang['calc_copy_link_done'], ENT_QUOTES, 'UTF-8')?>"
				data-manual-text="<?=htmlspecialchars($ec_lang['template_share_manual'], ENT_QUOTES, 'UTF-8')?>"
				onclick="EngCalcs.copyLink()"><?=ecIcon('link')?><?=$ec_lang['calc_copy_link']?></button>
			<?php // THE FALLBACK, for every browser that refuses the clipboard: no secure context, no
			      // permission, or a rejected promise. Hidden until it is needed, then filled, focused
			      // and selected so Ctrl-C alone is enough. Without it the button did nothing at all
			      // and said nothing about it, which is the one outcome worse than asking the user to
			      // copy the text themselves. ?>
			<input id="ec-copy-link-url" type="text" readonly hidden class="form-control form-control-sm" style="width:22em" aria-label="<?=htmlspecialchars($ec_lang['template_share_manual'], ENT_QUOTES, 'UTF-8')?>">
		</form>
<?php endif; ?>
		<ul class="navbar-nav ms-auto">
			<?php // HELP sits in the right-hand strip, ahead of the language picker (Task 298).
			      // The left list is the work -- one calculator menu; the right strip is the two things
			      // that are about using the site rather than doing a calculation, and both read as
			      // icon-plus-word. The key is still menu_help: the English value changed, which is a
			      // translation resync, not a new key. ?>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle active" id="dropdown-help" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<?=ecIcon('help')?><?=$ec_lang['menu_help']?>
				</a>
				<div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-help">
					<a class="dropdown-item" href="<?=EC_SW_BASE?>About.php"><?=$ec_lang['about_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>Install.php"><?=$ec_lang['install_main_menu']?></a>
					<a class="dropdown-item" href="<?=EC_SW_BASE?>contact.php"><?=$ec_lang['contact_main_menu']?></a>
					<?php // Walkthroughs USED TO BE HERE and was moved into the Looped Network page's own
					      // Help menu on 2026-08-13 (Tom: "the walkthrough is a little incongruous").
					      // The post covers that one calculator, so among these suite-wide items the
					      // plural promised guides to all of them; and this was the only entry here that
					      // left the site. It also carried a tip that no touch user could ever see -- a
					      // bare <a title>, which matches no selector in js/Calculators.lib.js. Do not
					      // re-add it: see lpn_menu_help / lpn_help_walkthroughs. ?>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle active" id="dropdown-lang" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<?=ecIcon('globe')?><?=$language_settings['LANGNAME']?>
				</a>
				<div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-lang">
<?php // **EACH ROW DECLARES ITS OWN LANGUAGE.** The row's text is that language's name written in
      // that language ("Deutsch", "العربية", "中文"), so it is the one place in the suite where the
      // page's own <html lang> is wrong about the text inside it. Without lang= a screen reader
      // pronounces every name with the current page's phonetics, and any language-sensitive
      // rendering -- hyphenation, font selection, quotation forms -- is asked the wrong question.
      // One attribute, no new string, and no visual change; `dir` is deliberately NOT set here,
      // because an RTL name inside an LTR menu row would re-align the whole row (see
      // dev/hyphenation-finding.md, which is where this came up). ?>
<?php // **THE ROW POINTS AT THE PAGE'S CANONICAL ADDRESS, NOT AT ITS SCRIPT** (Tom, 2026-09-10,
      // having switched language on the app and landed somewhere else: *"This from the language menu
      // works. But is it what we want?"*). It was `$_SERVER['PHP_SELF']`, and **under the `/app/`
      // rewrite that is the SCRIPT and not the address anybody typed** -- so switching language at
      // `librewaternet.org/app/` moved the reader to `/engcalcs/Looped-Network.php?lang=xx`, which
      // renders correctly and is not where they were. Every visit after that is off the canonical
      // address, and a language switch is the one control a reader uses on their FIRST visit.
      //
      // This is the same trap Task 479.01 already fixed for `<link rel="canonical">`, hreflang and
      // `og:url`, all of which read `ecCanonicalPath()`; the language menu was simply never brought
      // along. It is a DECLARATION and never an inference for the reason recorded there: a rewrite
      // is not invertible, and `REQUEST_URI` is client-supplied, so reversing one would let an
      // arbitrary URL nominate itself. A page with no declared pretty URL gets its own script path
      // back unchanged, which is what all 27 other pages want. ?>
<?php $ec_lang_switch_path = ecCanonicalPath(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : ''); ?>
<?php foreach ($GLOBALS['all_language_settings'] as $key => $lang) : ?>
					<a class="dropdown-item" lang="<?=htmlspecialchars($key, ENT_QUOTES, 'UTF-8')?>" href="<?=htmlspecialchars($ec_lang_switch_path, ENT_QUOTES, 'UTF-8')?>?lang=<?=$key?>" title="<?=$lang['LANGNAME']?>"><?=$lang['LANGNAME']?></a>
<?php endforeach; ?>
				</div>
			</li>
		</ul>
	</div>
</nav>
<?php
}
// Omit last closing tag is good practice.
