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

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">    <link rel="stylesheet" href="<?=BASE_URL?>/engcalcs/lib/engcalcs.css" type="text/css" />
<?php
}
?>
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
function echoFooter($type) {
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
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<?php if ($type === 'engcalcs') : ?>
<script type="text/javascript" src="<?=BASE_URL?>/engcalcs/lib/Cookies.lib.js?v=3"></script>
<script type="text/javascript" src="<?=BASE_URL?>/engcalcs/lib/Calculators.lib.js?v=3"></script>
<?php endif; ?>
</body>
</html>
<?php
}
?>
