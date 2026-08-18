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
        array('http://tomsthird.blogspot.com/','Blog (new in 2009)'),
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
	<a class="navbar-brand" href="index.php"><?=$ec_lang['menu_brand']?></a>
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
					<a class="dropdown-item" href="Manning-Pipe-Flow.php" title="<?=$ec_lang['mpf_main_desc']?>"><?=$ec_lang['mpf_main_menu']?></a>
					<a class="dropdown-item" href="Manning-Pipe-Head-Loss.php" title="<?=$ec_lang['mphl_main_desc']?>"><?=$ec_lang['mphl_main_menu']?></a>
					<a class="dropdown-item" href="Hazen-Williams.php" title="<?=$ec_lang['hw_main_desc']?>"><?=$ec_lang['hw_main_menu']?></a>
					<a class="dropdown-item" href="Darcy-Weisbach.php" title="<?=$ec_lang['dw_main_desc']?>"><?=$ec_lang['dw_main_menu']?></a>
					<a class="dropdown-item" href="Branched-Network.php" title="<?=$ec_lang['bpn_main_desc']?>"><?=$ec_lang['bpn_main_menu']?></a>
					<a class="dropdown-item" href="Looped-Network.php" title="<?=$ec_lang['lpn_main_desc']?>"><?=$ec_lang['lpn_main_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Manning-Trap.php" title="<?=$ec_lang['mtc_main_desc']?>"><?=$ec_lang['mtc_menu']?></a>
					<a class="dropdown-item" href="Manning-Irregular.php" title="<?=$ec_lang['mi_main_desc']?>"><?=$ec_lang['mi_menu']?></a>
					<a class="dropdown-item" href="Rock-Chute.php" title="<?=$ec_lang['rc_main_desc']?>"><?=$ec_lang['rc_main_menu']?></a>
					<div class="dropdown-divider"></div>
										<a class="dropdown-item" href="Micro-Hydro-Power.php" title="<?=$ec_lang['mhp_main_desc']?>"><?=$ec_lang['mhp_main_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Orifice.php" title="<?=$ec_lang['or_main_desc']?>"><?=$ec_lang['or_main_menu']?></a>
					<a class="dropdown-item" href="Orifice-Drain-Time.php" title="<?=$ec_lang['odt_main_desc']?>"><?=$ec_lang['odt_main_menu']?></a>
					<a class="dropdown-item" href="Weir-Flow-Simple.php" title="<?=$ec_lang['ws_main_desc']?>"><?=$ec_lang['ws_main_menu']?></a>
					<a class="dropdown-item" href="Weir-Flow-Irregular.php" title="<?=$ec_lang['wi_main_desc']?>"><?=$ec_lang['wi_menu']?></a>
					<div class="dropdown-divider"></div>
					<?php // Irrigation.php is deliberately absent from this menu (Task 232, 2026-08-08).
					      // Every other item here is a calculator; that page is a card index pointing
					      // back at this very dropdown, so as a plain "Irrigation" entry it read as a
					      // calculator and wasn't one. The page still exists and is still in the
					      // sitemap -- only the menu entry is gone. ?>
					<a class="dropdown-item" href="Canal-Seepage.php" title="<?=$ec_lang['cs_main_desc']?>"><?=$ec_lang['cs_main_menu']?></a>
					<a class="dropdown-item" href="Irrigation-Pressure.php" title="<?=$ec_lang['ip_main_desc']?>"><?=$ec_lang['ip_main_menu']?></a>
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
			      // icon-plus-word. The key is still menu_more: the English value changed, which is a
			      // translation resync, not a new key. ?>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle active" id="dropdown-help" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<?=ecIcon('help')?><?=$ec_lang['menu_more']?>
				</a>
				<div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-help">
					<a class="dropdown-item" href="About.php"><?=$ec_lang['about_main_menu']?></a>
					<a class="dropdown-item" href="Install.php"><?=$ec_lang['install_main_menu']?></a>
					<a class="dropdown-item" href="contact.php"><?=$ec_lang['contact_main_menu']?></a>
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
<?php foreach ($GLOBALS['all_language_settings'] as $key => $lang) : ?>
					<a class="dropdown-item" href="<?=htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES, 'UTF-8')?>?lang=<?=$key?>" title="<?=$lang['LANGNAME']?>"><?=$lang['LANGNAME']?></a>
<?php endforeach; ?>
				</div>
			</li>
		</ul>
	</div>
</nav>
<?php
}
// Omit last closing tag is good practice.
