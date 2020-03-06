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
    echo '<div>';
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

<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#"><?=$ec_lang['menu_brand']?></a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?=$ec_lang['menu_main_hydraulics']?> <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="Manning-Pipe-Flow.php" title="<?=$ec_lang['mpf_main_desc']?>"><?=$ec_lang['mpf_main_menu']?></a></li>
            <li><a href="Manning-Pipe-Head-Loss.php" title="<?=$ec_lang['mphl_main_desc']?>"><?=$ec_lang['mphl_main_menu']?></a></li>
            <li><a href="Manning-Trap.php" title="<?=$ec_lang['mtc_main_desc']?>"><?=$ec_lang['mtc_menu']?></a></li>
            <li><a href="Manning-Irregular.php" title="<?=$ec_lang['mi_main_desc']?>"><?=$ec_lang['mi_menu']?></a></li>
            <li><a href="Weir-Flow-Simple.php" title="<?=$ec_lang['ws_main_desc']?>"><?=$ec_lang['ws_main_menu']?></a></li>
            <li><a href="Weir-Flow-Irregular.php" title="<?=$ec_lang['wi_main_desc']?>"><?=$ec_lang['wi_menu']?></a></li>
            <li><a href="https://docs.google.com/spreadsheets/d/1XRaQtrd8G9GnhXJK9zHBL7TXd0Rj2qex8siopZEPMsA/edit?usp=sharing" title="<?=$ec_lang['rrc_main_desc']?>"><?=$ec_lang['rrc_main_menu']?></a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?=$ec_lang['menu_main_language']?> <span class="caret"></span></a>
          <ul class="dropdown-menu">
<?php foreach ($GLOBALS['all_language_settings'] as $key => $lang) : ?>
            <li>
                <a href="<?=$_SERVER['PHP_SELF']?>?lang=<?=$key?>" title="<?=$lang['LANGNAME']?>"><?=$lang['LANGNAME']?></a>
            </li>
<?php endforeach; ?>
          </ul>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<?php
                                                            }
?>
