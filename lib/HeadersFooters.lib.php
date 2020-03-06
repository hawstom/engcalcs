<?php
function echoHeader($type="normal", $html_title = "", $html_head = "") {
  switch (strtolower($type)) {
    case "normal":
            echoHTMLHead("Normal", $html_title, $html_head);
      break;
    case "engcalcs":
            echoHTMLHead("EngCalcs", $html_title, $html_head);
            echoEngCalcsMenu($html_title);
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
function echoHTMLHead($type, $html_title, $html_head) {

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
    <meta name="Generator" content="Notepad++"  />
    <meta name="Author" content="Thomas Gail Haws" />
    <meta name="Copyright" content="Copyleft &copy; 1999-2002 by Thomas Gail Haws. Licensed under the terms of the GNU GPL 3.0 or later." />
    <?=$html_head?>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?=$html_title?></title>
<?php
if (substr($type, 0, 8) == "EngCalcs") {
?>

    <link rel="stylesheet" href="engcalcs/lib/engcalcs.css" type="text/css" />
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script type="text/javascript" src="<?=BASE_URL?>/engcalcs/lib/Cookies.lib.js?v=3"></script>
    <script type="text/javascript" src="<?=BASE_URL?>/engcalcs/lib/Calculators.lib.js?v=3"></script>
<?php
}
?>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/hawsedc.css" type="text/css" />
</head>
<body>
<h1><?=$html_title?></h1>
<p>>> Drop your fears at the door; love is spoken here. <<</p>
<?php
}
/****************************************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         Normal Footer                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/****************************************************************************************************************/
function echoFooter() {
?>
<div class="left">
<?php
echoMenu("main");
?>
<hr />
<?php if ($GLOBALS['debugmode'] == TRUE) : ?>
    <p>
        <a href="http://validator.w3.org/check/referer">
            <img
                src="<?=BASE_URL?>/valid-xhtml11.gif"
                alt="Valid XHTML 1.1!"
                width="88"
                height="31"
                style="border:0;width:88px;height:31px"
            />
        </a>
        <a href="http://jigsaw.w3.org/css-validator/validator?uri=http://www.hawsedc.com/hawsedc.css">
            <img
                src="<?=BASE_URL?>/valid-css.gif"
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
</body>
</html>
<?php
}
?>
