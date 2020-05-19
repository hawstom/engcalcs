<?php
require_once ('lib/base.inc.php');
//phpinfo();
$html_title = $ec_lang['mpf_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>xu
<h2><?=$ec_lang['mpf_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'd0', 'type' => 'number', 'default' => '1', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'n', 'type' => 'number', 'default' => '0.01', 'units' => NULL, 'label' => '<a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">'.$ec_lang['mpf_manningRoughness'].'</a>'),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['mpf_friction_slope']),
		Array('name' => 'dd0', 'type' => 'number', 'default' => '0.6', 'units' => Array('depthFrac','depthPercent'), 'label' => $ec_lang['mpf_depth_ratio']),
	),
	//Results
	Array(
		Array('name' => 'q', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'v', 'units' => Array('mps','ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'a', 'units' => Array('m2','mm2','ft2','in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 't', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_top_width']),
		Array('name' => 'f', 'units' => NULL, 'label' => $ec_lang['mpf_froude_number']),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
	)
);
?>

<div id="sketch"></div>

<?php echoFeedback(); ?>

<script>
EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.c = 1.0;
	this.var.g = 9.806;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'd0', hasUnits = true);
	this.readFormInput(objForm, 's0', hasUnits = true);
	this.readFormInput(objForm, 'n', hasUnits = false);
	this.readFormInput(objForm, 'dd0', hasUnits = true);
	this.var.y = dd0 * d0;
	// Theta here is half the included angle of the wetted perimeter.
	this.var.theta = Math.acos(1 - 2 * this.var.dd0);
	this.var.a = (this.var.theta - Math.sin(2 * this.var.theta) / 2) * Math.pow(this.var.d0, 2) / 4;
	this.var.pw = this.var.theta * this.var.d0;
	this.var.rh = this.var.d0 / (4 * this.var.theta) * (this.var.theta - Math.sin(this.var.theta) * Math.cos(this.var.theta));
	this.var.t = this.var.d0 * Math.sin(this.var.theta);
	this.var.v = this.var.c / this.var.n*Math.pow(this.var.rh,2/3)*Math.pow(this.var.s0,0.5);
	this.var.hv = this.var.v * this.var.v / (2 * this.var.g);
	this.var.q = this.var.v * this.var.a;
	this.var.f = this.var.v * Math.sqrt(this.var.t/(this.var.g * this.var.a * Math.cos(Math.atan(this.var.s0))));
	this.var.tau = this.var.rh * this.var.s0;

	this.writeFormResult(objForm, 'q', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 't', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'f', precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);

	// Sketch
	gcr = 50; // Pipe circle radius
	gh = 3 * gcr; // SVG height
	gw = 3 * gcr; // SVG width
	gcx = 1.5 * gcr; // Pipe center x
	gcy = 1.5 * gcr; // Pipe center y
	gcb = gcy + gcr; // Pipe bottom
	glx1 = gcx - this.var.t/this.var.d0 * gcr;
	glx2 = gcx + this.var.t/this.var.d0 * gcr;
	gly = gcy + (1/2 - this.var.dd0) * 2 * gcr;
	gty = gly - gcr/4;
	gtx1 = gcx - gcr/8;
	gtx2 = gcx + gcr/8


	document.getElementById('sketch').innerHTML =
		'<svg height="' + gh + '" width="' + gw + '">' +
			'<circle cx="' + gcx + '" cy="' + gcy + '" r="' + gcr + '" stroke="black" stroke-width="' + gcr/25 + '" fill="white" />' +
			'<line x1="' + glx1 + '" y1="' + gly + '" x2="' + glx2 + '" y2="' + gly + '" style="stroke:rgb(0,0,255);stroke-width:' + gcr/25 + '" />' +
			'<line x1="' + gcx + '" y1="' + gcb + '" x2="' + gcx + '" y2="' + gly + '" style="stroke:rgb(0,0,255);stroke-width:' + gcr/3 + '" />' +
			'<polygon points="' +
			gcx + ',' + gly + ' ' +
			gtx1 + ',' + gty + ' ' +
			gtx2 + ',' + gty + '" ' +
			'style="fill:white;stroke:black;stroke-width:' + gcr/50 + '" />' +
			'Sorry, your browser does not support inline SVG.' +
		'</svg>';
}

EngCalcs.pageCalculatorInitialize = function () {
}

<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice