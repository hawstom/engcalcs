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
// Else show the URL and text as a link
    } else {
      echo '<a href="http://'.htmlspecialchars($_SERVER['SERVER_NAME'], ENT_QUOTES, 'UTF-8').rtrim($menuarr[$i][0]).'">'.rtrim($menuarr[$i][1]).'</a>';
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
	<a class="navbar-brand" href="index.php"><?=$ec_lang['menu_brand']?></a>
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
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Manning-Trap.php" title="<?=$ec_lang['mtc_main_desc']?>"><?=$ec_lang['mtc_menu']?></a>
					<a class="dropdown-item" href="Manning-Irregular.php" title="<?=$ec_lang['mi_main_desc']?>"><?=$ec_lang['mi_menu']?></a>
					<a class="dropdown-item" href="Rock-Chute.php" title="<?=$ec_lang['rrc_main_desc']?>"><?=$ec_lang['rrc_main_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Micro-Hydro-Power.php" title="<?=$ec_lang['mhp_main_desc']?>"><?=$ec_lang['mhp_main_menu']?></a>
					<a class="dropdown-item" href="Penstock-Design.php" title="<?=$ec_lang['ps_main_desc']?>"><?=$ec_lang['ps_main_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Orifice.php" title="<?=$ec_lang['or_main_desc']?>"><?=$ec_lang['or_main_menu']?></a>
					<a class="dropdown-item" href="Orifice-Drain-Time.php" title="<?=$ec_lang['odt_main_desc']?>"><?=$ec_lang['odt_main_menu']?></a>
					<a class="dropdown-item" href="Weir-Flow-Simple.php" title="<?=$ec_lang['ws_main_desc']?>"><?=$ec_lang['ws_main_menu']?></a>
					<a class="dropdown-item" href="Weir-Flow-Irregular.php" title="<?=$ec_lang['wi_main_desc']?>"><?=$ec_lang['wi_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Irrigation.php" title="<?=$ec_lang['irr_main_desc']?>"><?=$ec_lang['irr_main_menu']?></a>
						<a class="dropdown-item" href="Drip-Sprinkler.php" title="<?=$ec_lang['ds_main_desc']?>"><?=$ec_lang['ds_main_menu']?></a>
						<a class="dropdown-item" href="Canal-Seepage.php" title="<?=$ec_lang['cs_main_desc']?>"><?=$ec_lang['cs_main_menu']?></a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" id="dropdown-more" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<?=$ec_lang['menu_more']?>
				</a>
				<div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-more">
					<a class="dropdown-item" href="About.php"><?=$ec_lang['about_main_menu']?></a>
					<a class="dropdown-item" href="Install.php"><?=$ec_lang['install_main_menu']?></a>
					<a class="dropdown-item" href="contact.php"><?=$ec_lang['contact_main_menu']?></a>
				</div>
			</li>
		</ul>
<?php if ($show_name_field) : ?>
		<button id="ec-install-btn" type="button" class="btn btn-sm btn-outline-primary ms-3" style="display:none" onclick="EngCalcs.installPWA()">⬇ Install</button>
		<form class="d-flex align-items-center ms-3" style="gap:0.4em" onsubmit="return false;">
			<label for="ec_calc_name" class="small fw-semibold text-nowrap mb-0"><?=$ec_lang['ec_name_label'] ?? 'Label:'?></label><span title="<?=htmlspecialchars($ec_lang['ec_name_hint'] ?? '', ENT_QUOTES, 'UTF-8')?>" style="cursor:help;color:steelblue;font-size:0.9em" tabindex="0">?</span>
			<input type="text" id="ec_calc_name"
				class="form-control form-control-sm"
				style="width:14em"
				placeholder="<?=htmlspecialchars($ec_lang['ec_name_placeholder'] ?? 'Label for bookmarking/sharing', ENT_QUOTES, 'UTF-8')?>"
				title="<?=htmlspecialchars($ec_lang['ec_name_hint'] ?? 'letters, digits, spaces, – _ .', ENT_QUOTES, 'UTF-8')?>"
				value="<?=htmlspecialchars($calc_name, ENT_QUOTES, 'UTF-8')?>"
				maxlength="50"
				autocomplete="off">
		</form>
<?php endif; ?>
		<ul class="navbar-nav ms-auto">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle active" id="dropdown-lang" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					&#x1F310; <?=$language_settings['LANGNAME']?>
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
