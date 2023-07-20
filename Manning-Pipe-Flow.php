<?php
require_once ('lib/base.inc.php');
//phpinfo();
$html_title = $ec_lang['mpf_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['mpf_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'd0', 'type' => 'number', 'default' => '1', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'n', 'type' => 'number', 'default' => '0.01', 'units' => NULL, 'label' => '<a href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">'.$ec_lang['mpf_manningRoughness'].'</a>'),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['mpf_friction_slope']),
		Array('name' => 'dd0', 'type' => 'number', 'default' => '0.5', 'units' => Array('depthFrac','depthPercent'), 'label' => $ec_lang['mpf_depth_ratio']),
	),
	//Results
	Array(
		Array('name' => 'q', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'v', 'units' => Array('mps','ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'a', 'units' => Array('m2', 'mm2', 'ft2', 'in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'y', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mtc_flow_depth']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 't', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_top_width']),
		Array('name' => 'f', 'units' => NULL, 'label' => '<a href="https://www.engineeringtoolbox.com/froude-number-d_578.html">'.$ec_lang['mpf_froude_number'].'</a>'),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
	)
);
?>

<div id="sketch"></div>

<?php echo $ec_lang['mpf_note_1']; ?>

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
	// Theta here is half the included angle of the wetted perimeter.
	this.var.y = this.var.dd0 * this.var.d0;
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
	this.writeFormResult(objForm, 'y', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 't', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'f', precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);

	// Sketch
	this.var.gcr = 50; // Pipe circle radius
	this.var.gh = 3 * this.var.gcr; // SVG height
	this.var.gw = 3 * this.var.gcr; // SVG width
	this.var.gcx = 1.5 * this.var.gcr; // Pipe center x
	this.var.gcy = 1.5 * this.var.gcr; // Pipe center y
	this.var.gcb = this.var.gcy + this.var.gcr; // Pipe bottom
	this.var.glx1 = this.var.gcx - this.var.t/this.var.d0 * this.var.gcr;
	this.var.glx2 = this.var.gcx + this.var.t/this.var.d0 * this.var.gcr;
	this.var.gly = this.var.gcy + (1/2 - this.var.dd0) * 2 * this.var.gcr;
	this.var.gty = this.var.gly - this.var.gcr/4;
	this.var.gtx1 = this.var.gcx - this.var.gcr/8;
	this.var.gtx2 = this.var.gcx + this.var.gcr/8


	document.getElementById('sketch').innerHTML =
		'<svg height="' + this.var.gh + '" width="' + this.var.gw + '">' +
			'<circle cx="' + this.var.gcx + '" cy="' + this.var.gcy + '" r="' + this.var.gcr + '" stroke="black" stroke-width="' + this.var.gcr/25 + '" fill="white" />' +
			'<line x1="' + this.var.glx1 + '" y1="' + this.var.gly + '" x2="' + this.var.glx2 + '" y2="' + this.var.gly + '" style="stroke:rgb(0,0,255);stroke-width:' + this.var.gcr/25 + '" />' +
			'<line x1="' + this.var.gcx + '" y1="' + this.var.gcb + '" x2="' + this.var.gcx + '" y2="' + this.var.gly + '" style="stroke:rgb(0,0,255);stroke-width:' + this.var.gcr/3 + '" />' +
			'<polygon points="' +
			this.var.gcx + ',' + this.var.gly + ' ' +
			this.var.gtx1 + ',' + this.var.gty + ' ' +
			this.var.gtx2 + ',' + this.var.gty + '" ' +
			'style="fill:white;stroke:black;stroke-width:' + this.var.gcr/50 + '" />' +
			'Sorry, your browser does not support inline SVG.' +
		'</svg>';
}

EngCalcs.pageCalculatorInitialize = function (objForm) {
}

<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
