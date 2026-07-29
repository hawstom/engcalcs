<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['lpn_main_title'];
$html_desc = $ec_lang['lpn_main_desc'];
echoHeader("EngCalcs", $html_title, "");
?>
<h2><?=$ec_lang['lpn_main_desc']?></h2>

<script>
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('btn-printable').addEventListener('click', function() {
		document.querySelectorAll('.d-print-none').forEach(function(el) { el.style.display = 'none'; });
	});
});
</script>
<form id="formInput" action="javascript:EngCalcs.submitForm()" method="post">
	<?php echoUnitsRow(); ?>
	<div class="d-print-none" id="lpn_toolbar"></div>
	<div style="overflow-x:auto">
		<svg id="lpn_canvas" dir="ltr" width="100%" height="500" style="border:1px solid #ccc;background:#f7f7f2"></svg>
	</div>
</form>

<?php echoFeedback(); ?>

<script>
EngCalcs.pageConfig = {
};
</script>
<script src="/engcalcs/js/looped-network.js?v=<?=filemtime(__DIR__.'/js/looped-network.js')?>"></script>
<script>
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
