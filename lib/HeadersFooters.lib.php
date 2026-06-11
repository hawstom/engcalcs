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

global $ec_lang, $clanguage;
$html_lang = isset($clanguage) ? $clanguage : 'en';
$html_dir  = ($html_lang === 'he') ? ' dir="rtl"' : '';
?>
<!DOCTYPE html>
<html lang="<?=$html_lang?>"<?=$html_dir?>>
<head>
	<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
	<meta name="Generator" content="Notepad++"  />
	<meta name="Author" content="Thomas Gail Haws" />
	<meta name="Copyright" content="Copyleft &copy; 1999-2002 by Thomas Gail Haws. Licensed under the terms of the GNU GPL 3.0 or later." />
	<?=$html_head?>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?=$html_title?></title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

<?php
if (substr($type, 0, 8) === "EngCalcs") {
?>
	<link rel="stylesheet" href="/engcalcs/lib/engcalcs.css?v=2" type="text/css" />
<?php
}
?>

	<link rel="stylesheet" href="/hawsedc.css" type="text/css">

</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

<?php if (substr($type, 0, 8) === "EngCalcs") : ?>
<script src="/engcalcs/lib/Cookies.lib.js?v=10"></script>
<script src="/engcalcs/lib/Calculators.lib.js?v=10"></script>
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
</body>
</html>
<?php
}
// Omit last closing tag is good practice.
