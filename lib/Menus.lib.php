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
        array(BASE_URL.'/index.php','Home'),
        array(BASE_URL.'/support.php','Support'),
        array(BASE_URL.'/gnu/index.php','FreeSoftware'),
        array(BASE_URL.'/engserv.php','Engineering Services'),
        array(BASE_URL.'/engcalcs/index.php','Engineering Calculators'),
        array(BASE_URL.'/techdocs.php','Technical Documents'),
        array('http://tomsthird.blogspot.com/','Blog (new in 2009)'),
        array(BASE_URL.'/thomas','Personal essays'),
        array(BASE_URL.'/famtree.php','Collaborative Family Trees'),
        array(BASE_URL.'/contact.php','Contact')
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
      echo '<a href="http://'.$_SERVER['SERVER_NAME'].rtrim($menuarr[$i][0]).'">'.rtrim($menuarr[$i][1]).'</a>';
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
function echoEngCalcsMenu () {
    global $ec_lang;
?>

<nav class="navbar navbar-expand-lg navbar-light bg-light d-print-none">
	<a class="navbar-brand" href="index.php"><?=$ec_lang['menu_brand']?></a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>

	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<?=$ec_lang['menu_main_hydraulics']?>
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdown">
					<a class="dropdown-item" href="Manning-Pipe-Flow.php" title="<?=$ec_lang['mpf_main_desc']?>"><?=$ec_lang['mpf_main_menu']?></a>
					<a class="dropdown-item" href="Manning-Pipe-Head-Loss.php" title="<?=$ec_lang['mphl_main_desc']?>"><?=$ec_lang['mphl_main_menu']?></a>
					<a class="dropdown-item" href="Hazen-Williams.php" title="<?=$ec_lang['hw_main_desc']?>"><?=$ec_lang['hw_main_menu']?></a>
					<a class="dropdown-item" href="Darcy-Weisbach.php" title="<?=$ec_lang['dw_main_desc']?>"><?=$ec_lang['dw_main_menu']?></a>
					<a class="dropdown-item" href="Plamen-test.php" title="Plamen's test calculator">Plamen's test calculator</a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Manning-Trap.php" title="<?=$ec_lang['mtc_main_desc']?>"><?=$ec_lang['mtc_menu']?></a>
					<a class="dropdown-item" href="Manning-Irregular.php" title="<?=$ec_lang['mi_main_desc']?>"><?=$ec_lang['mi_menu']?></a>
					<a class="dropdown-item" href="https://docs.google.com/spreadsheets/d/1XRaQtrd8G9GnhXJK9zHBL7TXd0Rj2qex8siopZEPMsA/edit?usp=sharing" title="<?=$ec_lang['rrc_main_desc']?>"><?=$ec_lang['rrc_main_menu']?></a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="Weir-Flow-Simple.php" title="<?=$ec_lang['ws_main_desc']?>"><?=$ec_lang['ws_main_menu']?></a>
					<a class="dropdown-item" href="Weir-Flow-Irregular.php" title="<?=$ec_lang['wi_main_desc']?>"><?=$ec_lang['wi_menu']?></a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<?=$ec_lang['menu_main_language']?>
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdown">
<?php foreach ($GLOBALS['all_language_settings'] as $key => $lang) : ?>
					<a class="dropdown-item" href="<?=$_SERVER['PHP_SELF']?>?lang=<?=$key?>" title="<?=$lang['LANGNAME']?>"><?=$lang['LANGNAME']?></a>
<?php endforeach; ?>
				</div>
			</li>
		</ul>
	</div>
</nav>
<?php
}