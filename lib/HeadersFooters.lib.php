<?php
function echoHeader($type="normal", $html_title = "", $html_head = "", $show_name_field = true) {
  switch (strtolower($type)) {
    case "normal":
            echoHTMLHead("Normal", $html_title, $html_head, false);
      break;
    case "engcalcs":
            echoHTMLHead("EngCalcs", $html_title, $html_head, $show_name_field);
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
function echoHTMLHead($type, $html_title, $html_head, $show_name_field = true) {

global $ec_lang, $clanguage;
$html_lang = isset($clanguage) ? $clanguage : 'en';
$html_dir  = in_array($html_lang, ['ar', 'fa', 'he', 'ps', 'ur']) ? ' dir="rtl"' : '';
$calc_name = $show_name_field ? trim($_GET['name'] ?? '') : '';
$safe_name = htmlspecialchars($calc_name, ENT_QUOTES, 'UTF-8');
$page_title = $calc_name ? $safe_name . ' — ' . $html_title : $html_title;
?>
<!DOCTYPE html>
<html lang="<?=$html_lang?>"<?=$html_dir?>>
<head>
	<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
	<meta name="Generator" content="Notepad++"  />
	<meta name="Author" content="Thomas Gail Haws" />
	<meta name="Copyright" content="Copyright &copy; 2009&ndash;2026 Thomas Gail Haws. Licensed under the GNU GPL v3.0 or later." />
	<?=$html_head?>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?=$calc_name ? $safe_name . ' — ' . $html_title : $html_title?></title>
	<link rel="manifest" href="/engcalcs/manifest.json">
	<meta name="theme-color" content="#1a6faf">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

<?php
if (substr($type, 0, 8) === "EngCalcs") {
?>
	<link rel="stylesheet" href="/engcalcs/css/engcalcs.css?v=2" type="text/css" />
<?php
}
?>

	<link rel="stylesheet" href="/hawsedc.css" type="text/css">

</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>

<?php if (substr($type, 0, 8) === "EngCalcs") : ?>
<script src="/engcalcs/js/Cookies.lib.js?v=<?=filemtime(__DIR__.'/../js/Cookies.lib.js')?>"></script>
<script src="/engcalcs/js/Calculators.lib.js?v=<?=filemtime(__DIR__.'/../js/Calculators.lib.js')?>"></script>
<?php 
echoEngCalcsMenu($html_title);
endif;
?>
<div class="d-flex justify-content-between align-items-baseline d-print-none">
	<h1 class="mb-0"><?=$html_title?></h1>
<?php if ($show_name_field) : ?>
	<div class="text-end ms-3 flex-shrink-0">
		<label for="ec_calc_name" class="form-label mb-0 me-1 small fw-semibold"><?=$ec_lang['ec_name_label'] ?? 'Label:'?></label>
		<input type="text" id="ec_calc_name"
			class="form-control form-control-sm d-inline-block"
			style="width:16em"
			placeholder="<?=htmlspecialchars($ec_lang['ec_name_placeholder'] ?? 'Label for bookmarking/sharing', ENT_QUOTES, 'UTF-8')?>"
			value="<?=$safe_name?>"
			maxlength="50"
			autocomplete="off">
		<div id="ec_calc_name_hint" class="text-muted" style="font-size:0.75em"><?=$ec_lang['ec_name_hint'] ?? 'letters, digits, spaces, &ndash; _ .'?></div>
	</div>
<?php endif; ?>
</div>
<p class="d-print-none"><?=$ec_lang['template_welcome']?></p>
<script>EngCalcs.pageTitle = <?=json_encode($html_title)?>;</script>
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
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/engcalcs/sw.js', { scope: '/engcalcs/' });
}
</script>
</body>
</html>
<?php
}
// Omit last closing tag is good practice.
