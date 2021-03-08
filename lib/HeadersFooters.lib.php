<?php
function echoHeader($type="normal", $html_title = "", $html_head = "") {
  switch (strtolower($type)) {
    case "normal":
            echoHTMLHead("Normal", $html_title, $html_head);
      break;
    case "engcalcs":
            echoHTMLHead("EngCalcs", $html_title, $html_head);
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

global $ec_lang;
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
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

<?php
if (substr($type, 0, 8) === "EngCalcs") {
?>
	<link rel="stylesheet" href="<?=BASE_URL?>/engcalcs/lib/engcalcs.css" type="text/css" />
<?php
}
?>

	<link rel="stylesheet" href="<?=BASE_URL?>/hawsedc.css" type="text/css">

</head>
<body>
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>

<?php if (substr($type, 0, 8) === "EngCalcs") : ?>
<script src="<?=BASE_URL?>/engcalcs/lib/Cookies.lib.js?v=4"></script>
<script src="<?=BASE_URL?>/engcalcs/lib/Calculators.lib.js?v=4"></script>
<?php 
echoEngCalcsMenu($html_title);
endif; 
?>
<h1 class="d-print-none"><?=$html_title?></h1>
<p class="d-print-none"><?=$ec_lang['template_welcome']?></p>
<?php
}
/****************************************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         Normal Footer                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/****************************************************************************************************************/
function echoFooter($type) {
?>
<div class="left d-print-none">
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
<?php if ($type === 'EngCalcs') : ?>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
<?php endif; ?>
</body>
</html>
<?php
}
// Omit last closing tag is good practice.