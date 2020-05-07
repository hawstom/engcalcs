<?php
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mtc_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="wier vetedero calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['mtc_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'b', 'type' => 'number', 'default' => '1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_bottom_width']),
		Array('name' => 'z1', 'type' => 'number', 'default' => '4', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_1']),
		Array('name' => 'z2', 'type' => 'number', 'default' => '4', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_2']),
		Array('name' => 'n', 'type' => 'number', 'default' => '0.03', 'units' => NULL, 'label' => $ec_lang['mpf_manningRoughness'].' <a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a>'),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['mtc_channel_slope']),
		Array('name' => 'y', 'type' => 'number', 'default' => '1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_flow_depth']),
		Array('name' => 'beta', 'type' => 'number', 'default' => '0', 'units' => NULL, 'label' => $ec_lang['mtc_bend_angle']),
		Array('name' => 'sgrock', 'type' => 'number', 'default' => '2.65', 'units' => NULL, 'label' => $ec_lang['mtc_sgrock'])
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2', 'mm2', 'ft2', 'in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => Array('mps', 'ftps', 'mph'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'q', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'hv', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 't', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_top_width']),
		Array('name' => 'froude', 'units' => NULL, 'label' => $ec_lang['mpf_froude_number']),
		Array('name' => 'tau', 'units' => Array('npm2', 'psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'd50_strickler', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_strickler']),
		Array('name' => 'd50_bottom', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_bottom']),
		Array('name' => 'd50_z1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_z1']),
		Array('name' => 'd50_z2', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_z2']),
		Array('name' => 'd50_mra', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_mra']),
		Array('name' => 'd50_searcy', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_searcy']),
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
	this.var.gammawater = 9806;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'b', hasUnits = true);
	this.readFormInput(objForm, 'y', hasUnits = true);
	this.readFormInput(objForm, 'z1', hasUnits = false);
	this.readFormInput(objForm, 'z2', hasUnits = false);
	this.readFormInput(objForm, 's0', hasUnits = true);
	this.readFormInput(objForm, 'n', hasUnits = false);
	this.readFormInput(objForm, 'beta', hasUnits = false);
	this.readFormInput(objForm, 'sgrock', hasUnits = false);
	this.var.a = this.var.y * (this.var.b + (+this.var.z1 + +this.var.z2) * this.var.y / 2);
	this.var.pw = this.var.b + this.var.y * (Math.sqrt(1 + Math.pow(this.var.z1, 2)) + Math.sqrt(1 + Math.pow(this.var.z2, 2)));
	this.var.rh = this.var.a / this.var.pw;
	this.var.t = this.var.b + this.var.y * (+this.var.z1 + +this.var.z2);
	this.var.v = this.var.c/this.var.n*Math.pow(this.var.rh,2/3)*Math.pow(this.var.s0,0.5);
	this.var.hv=Math.pow(this.var.v, 2) / (2 * this.var.g)
	this.var.q = this.var.v * this.var.a;
	this.var.froude = this.var.v * Math.sqrt(this.var.t/(this.var.g * this.var.a * Math.cos(Math.atan(this.var.s0))));
	this.var.tau = this.var.gammawater * this.var.rh * this.var.s0;
	this.var.c_isbash = (this.var.beta <= 30) ? 1.2 : 0.86;
	this.var.d50_strickler = Math.pow(this.var.n * 21.1, 6); // n = 1/21.1 D ^ (1/6)
	this.var.d50_mra = 0.031 * Math.pow(this.var.v, 2.5) / (Math.pow(this.var.sgrock - 1, 0.25) * Math.pow(this.var.y, 0.25) * ((this.var.beta <= 30) ? 1 : 1.5));
	this.var.d50_searcy = 0.022 * Math.pow(this.var.v, 2);
	this.var.d50_bottom = mc_riprap_size(this.var.y, this.var.a, this.var.v, this.var.g, 1000, this.var.s0, this.var.c_isbash, this.var.sgrock);
	this.var.d50_z1 = mc_riprap_size(this.var.y, this.var.a, this.var.v, this.var.g, this.var.z1, this.var.s0, this.var.c_isbash, this.var.sgrock);
	this.var.d50_z2 = mc_riprap_size(this.var.y, this.var.a, this.var.v, this.var.g, this.var.z2, this.var.s0, this.var.c_isbash, this.var.sgrock);
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'q', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 't', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'froude', precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_strickler', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_bottom', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_z1', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_z2', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_mra', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_searcy', precision = 4, hasUnits = true);

	// Sketch
	this.var.gymax = 100; // Max graphic flow depth
	this.var.garmax = 6; // Max graphic aspect ratio
	this.var.gar = this.var.t / this.var.y; // Flow aspect ratio
	this.var.gt = Math.min(this.var.garmax, this.var.gar) * this.var.gymax; // Graphic flow width
	this.var.gs = this.var.gt/ this.var.t; // Graphic scale
	this.var.gy = this.var.gs * this.var.y;
	this.var.gh = this.var.gy + this.var.gymax/2; // SVG height
	this.var.gyb = this.var.gy + this.var.gymax/4 // Bottom of flow
	this.var.gyt = this.var.gymax/4 // Top of flow
	this.var.gw = this.var.gt; // SVG width
	this.var.gxb1 = this.var.z1 * this.var.y * this.var.gs;
	this.var.gxb2 = this.var.gxb1 + this.var.b * this.var.gs;
	this.var.gxm = this.var.gw/2;
	this.var.gtx1 = this.var.gxm - this.var.gymax/16;
	this.var.gtx2 = this.var.gxm + this.var.gymax/16;
	this.var.gty = this.var.gyt - this.var.gymax/8;
	document.getElementById('sketch').innerHTML =
		'<svg height="' + this.var.gh + '" width="' + this.var.gw + '">' +
			'<polyline points="' +
			'0,' + this.var.gyt  + ' ' +
			this.var.gxb1 + ',' + this.var.gyb + ' ' +
			this.var.gxb2 + ',' + this.var.gyb + ' ' +
			this.var.gt + ',' + this.var.gyt + '" ' +
			'style="fill:none;stroke:black;stroke-width:' + this.var.gymax/25 + '" />' +
			'<line x1="0" y1="' + this.var.gyt  + '" x2="' + this.var.gt + '" y2="' + this.var.gyt  + '" style="stroke:rgb(0,0,255);stroke-width:' + this.var.gymax/25 + '" />' +
			'<polygon points="' +
			this.var.gxm + ',' + this.var.gyt + ' ' +
			this.var.gtx1 + ',' + this.var.gty + ' ' +
			this.var.gtx2 + ',' + this.var.gty + '" ' +
			'style="fill:white;stroke:black;stroke-width:' + this.var.gymax/50 + '" />' +
			'Sorry, your browser does not support inline SVG.' +
		'</svg>';
};
EngCalcs.pageCalculatorInitialize = function () {
}
var mc_riprap_size = function(y, a, v, g, z, s0, c, sgrock) {
	var
	d50,
	hvmax = v * v * 1.33 * 1.33 / (2 * g) ;
	if (s0 < 0.02) {
		// Isbash
		d50 = hvmax / (c * c * Math.cos(Math.atan(1 / z)) * (sgrock - 1));
	} else if (s0 < 0.1) {
		// Robinson unit q = v * y corrected 2015-10-17
		d50 = 1.413 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.794);
	} else if (s0 < 0.4) {
		// Robinson
		d50 = 0.4623 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.307);
	} else {
		d50 = '-';
	}
	return d50;
};
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice