<?php
require_once('lib/base.inc.php');
$html_title = $ec_lang['irr_main_title'];
$html_head = '
	<meta name="Description" content="' . htmlspecialchars($html_title, ENT_QUOTES, 'UTF-8') . '" />
	<meta name="Keywords" content="irrigation flow measurement weir orifice headgate turnout diversion dam" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?=$ec_lang['irr_main_desc']?></h2>
<?php echoHelpWanted(); ?>
<p>Weirs and orifices are the standard field tools for measuring water flow in irrigation systems.
   Select the calculator that matches your structure:</p>

<div class="row row-cols-1 row-cols-md-2 g-4 mb-4">

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold">Weir — Broad-Crested (Uniform Width)</div>
			<div class="card-body">
				<p class="card-text">Measure flow over a diversion dam crest, check structure, or weir board.
				   Enter weir length and headwater depth above the crest.</p>
				<a href="Weir-Flow-Simple.php" class="btn btn-primary"><?=$ec_lang['ws_main_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold">Weir — Irregular Profile</div>
			<div class="card-body">
				<p class="card-text">Use when the weir crest is not a single uniform elevation — natural spillways,
				   drop structures with varying width, or multi-section control structures.</p>
				<a href="Weir-Flow-Irregular.php" class="btn btn-primary"><?=$ec_lang['wi_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold">Orifice — Headgate or Pipe Turnout</div>
			<div class="card-body">
				<p class="card-text">Measure flow through a sluice gate, pipe turnout, or culvert opening.
				   Handles both free outfall and submerged (tailwater) conditions automatically.</p>
				<a href="Orifice.php" class="btn btn-primary"><?=$ec_lang['or_main_menu']?></a>
			</div>
		</div>
	</div>

	<div class="col">
		<div class="card h-100">
			<div class="card-header fw-bold">Canal Design &amp; Analysis</div>
			<div class="card-body">
				<p class="card-text">Design or check an irrigation canal using Manning's formula.
				   Use the Trapezoidal calculator for new channels; the Irregular calculator for
				   existing natural or constructed sections.</p>
				<a href="Manning-Trap.php" class="btn btn-primary me-1"><?=$ec_lang['mtc_menu']?></a>
				<a href="Manning-Irregular.php" class="btn btn-primary"><?=$ec_lang['mi_menu']?></a>
			</div>
		</div>
	</div>

</div>

<h3>Quick Reference</h3>
<dl>
<dt>Diversion dam or check structure</dt>
<dd>Measure headwater depth above the weir crest.
    Use <a href="Weir-Flow-Simple.php">Weir Flow Simple</a> for a uniform crest, or
    <a href="Weir-Flow-Irregular.php">Weir Flow Irregular</a> for a profiled or stepped crest.</dd>

<dt>Headgate or pipe turnout</dt>
<dd>Measure headwater elevation and tailwater elevation (or invert if freely discharging).
    Use <a href="Orifice.php">Orifice Flow</a>.
    For a circular pipe, D&nbsp;= pipe diameter; for a rectangular gate, enter width W and height D.</dd>

<dt>Reservoir or pond drain time</dt>
<dd>Use <a href="Orifice-Drain-Time.php">Orifice Drain Time</a> to estimate how long it takes
    to lower a pond or reservoir through a bottom orifice — useful for irrigation storage planning.</dd>

<dt>Field standards</dt>
<dd>Weir and orifice flow equations used here match USBR
    <em>Water Measurement Manual</em> (3rd&nbsp;ed.) procedures commonly required by
    water masters and irrigation districts.</dd>
</dl>
<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
