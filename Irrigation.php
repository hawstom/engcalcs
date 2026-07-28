<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['irr_main_title'];
$html_desc = $ec_lang['irr_main_desc'];
echoHeader("EngCalcs", $html_title, "", false);
?>
<h2><?=$ec_lang['irr_main_desc']?></h2>
<?php echoHelpWanted(); ?>
<?=$ec_lang['irr_intro_html']?>

<div class="row row-cols-1 row-cols-md-2 g-4 mb-4">

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold"><?=$ec_lang['irr_card_weir_uniform_head']?></div>
			<div class="card-body">
				<p class="card-text"><?=$ec_lang['irr_card_weir_uniform_desc']?></p>
				<a href="Weir-Flow-Simple.php" class="btn btn-primary"><?=$ec_lang['ws_main_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold"><?=$ec_lang['irr_card_weir_irregular_head']?></div>
			<div class="card-body">
				<p class="card-text"><?=$ec_lang['irr_card_weir_irregular_desc']?></p>
				<a href="Weir-Flow-Irregular.php" class="btn btn-primary"><?=$ec_lang['wi_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold"><?=$ec_lang['irr_card_orifice_head']?></div>
			<div class="card-body">
				<p class="card-text"><?=$ec_lang['irr_card_orifice_desc']?></p>
				<a href="Orifice.php" class="btn btn-primary"><?=$ec_lang['or_main_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold"><?=$ec_lang['irr_card_canal_head']?></div>
			<div class="card-body">
				<p class="card-text"><?=$ec_lang['irr_card_canal_desc']?></p>
				<a href="Manning-Trap.php" class="btn btn-primary me-1"><?=$ec_lang['mtc_menu']?></a>
				<a href="Manning-Irregular.php" class="btn btn-primary"><?=$ec_lang['mi_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold"><?=$ec_lang['irr_card_seepage_head']?></div>
			<div class="card-body">
				<p class="card-text"><?=$ec_lang['irr_card_seepage_desc']?></p>
				<a href="Canal-Seepage.php" class="btn btn-primary"><?=$ec_lang['cs_main_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold"><?=$ec_lang['irr_card_pressure_head']?></div>
			<div class="card-body">
				<p class="card-text"><?=$ec_lang['irr_card_pressure_desc']?></p>
				<a href="Irrigation-Pressure.php" class="btn btn-primary"><?=$ec_lang['ip_main_menu']?></a>
			</div>
		</div>
	</div>

</div>

<?=$ec_lang['irr_quickref_html']?>
<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
