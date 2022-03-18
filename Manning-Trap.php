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
		Array('name' => 'n_in', 'type' => 'number', 'default' => '0.03', 'units' => NULL, 'label' => $ec_lang['mpf_manningRoughness'].' <a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a>'.'<br /> <input type="radio" name="n_radio" id="n_radio_strickler" value="strickler" onchange="EngCalcs.submitForm()" /><label for="n_radio_strickler">Strickler</label> <input type="radio" name="n_radio" id="n_radio_bb" value="bb" onchange="EngCalcs.submitForm()" /><label for="n_radio_bb">B/B</label>'),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['mtc_channel_slope']),
		Array('name' => 'y', 'type' => 'number', 'default' => '1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_flow_depth']),
		Array('name' => 'beta', 'type' => 'number', 'default' => '0', 'units' => NULL, 'label' => $ec_lang['mtc_bend_angle']),
		Array('name' => 'sgrock', 'type' => 'number', 'default' => '2.65', 'units' => NULL, 'label' => $ec_lang['mtc_sgrock']),
		Array(
			'name' => 'd50_in', 
			'type' => 'number', 'default' => '0.1', 
			'units' => Array('m', 'mm', 'ft', 'in'), 
			'label' => $ec_lang['mtc_d50_in'] . '<br /> <input type="radio" name="d50_radio" id="d50_radio_isbash" value="isbash" onchange="EngCalcs.submitForm()" /><label for="d50_radio_isbash">Isbash</label> <input type="radio" name="d50_radio" id="d50_radio_maynord" value="maynord" onchange="EngCalcs.submitForm()" /><label for="d50_radio_maynord">Maynord</label> <input type="radio" name="d50_radio" id="d50_radio_searcy" value="searcy" onchange="EngCalcs.submitForm()" /><label for="d50_radio_searcy">Searcy</label><br />*' . inputHtml('d50_safety', 'number', '1.25', '')),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2', 'mm2', 'ft2', 'in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => Array('mps', 'ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'q', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'hv', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 't', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_top_width']),
		Array('name' => 'froude', 'units' => NULL, 'label' => $ec_lang['mpf_froude_number']),
		Array('name' => 'tau', 'units' => Array('npm2', 'psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'n_strickler', 'units' => NULL, 'label' => $ec_lang['mtc_n_strickler']),
		Array('name' => 'n_blodgett', 'units' => NULL, 'label' => $ec_lang['mtc_n_blodgett']),
		Array('name' => 'n_bathurst', 'units' => NULL, 'label' => $ec_lang['mtc_n_bathurst']),
		Array('name' => 'blodgett_v_bathurst', 'units' => NULL, 'label' => $ec_lang['mtc_blodgett_v_bathurst']),
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
<script src="<?=BASE_URL?>/engcalcs/lib/Manning.lib.js?v=5"></script>
<script>
EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = 9.806;
	this.var.c = 1.0;
	this.var.alpha_blodgett = 0.319;
	this.var.alpha_bathurst = 1.0;
	this.var.max_err = 0.00001;
	this.var.i = 0;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'b', hasUnits = true);
	this.readFormInput(objForm, 'y', hasUnits = true);
	this.readFormInput(objForm, 'z1', hasUnits = false);
	this.readFormInput(objForm, 'z2', hasUnits = false);
	this.readFormInput(objForm, 's0', hasUnits = true);
	this.var.n_radio = objForm.n_radio.value;
	this.readFormInput(objForm, 'n_in', hasUnits = false);
	this.readFormInput(objForm, 'beta', hasUnits = false);
	this.readFormInput(objForm, 'sgrock', hasUnits = false);
	this.readFormInput(objForm, 'd50_in', hasUnits = true);
	this.var.d50_radio = objForm.d50_radio.value;
	this.readFormInput(objForm, 'd50_safety', hasUnits = false);
	if (this.var.d50_in === 0) {
		this.var.d50_in = 0.1 * this.var.y; // Initial guess for D50
	}
	this.var.n_strickler = Math.pow(this.var.d50_in, 1 / 6) / 21.1;
	if (this.var.n_in === 0) {
		this.var.n_in = this.var.n_strickler; // Initial guess for n (Strickler)
	}
	this.var.iterate_p = true; // Always calculate once.
	while (this.var.iterate_p === true && this.var.i < 100) {
		this.var.i++;
		this.var.a = this.var.y * (this.var.b + (+this.var.z1 + +this.var.z2) * this.var.y / 2);
		this.var.pw = this.var.b + this.var.y * (Math.sqrt(1 + Math.pow(this.var.z1, 2)) + Math.sqrt(1 + Math.pow(this.var.z2, 2)));
		this.var.rh = this.var.a / this.var.pw;
		this.var.t = this.var.b + this.var.y * (+this.var.z1 + +this.var.z2);
		this.var.da = this.var.a / this.var.t;
		this.var.da_over_d50 = this.var.da / this.var.d50_in;
		this.var.v = this.var.c/this.var.n_in*Math.pow(this.var.rh,2/3)*Math.pow(this.var.s0,0.5);
		this.var.hv=Math.pow(this.var.v, 2) / (2 * this.var.g)
		this.var.q = this.var.v * this.var.a;
		this.var.froude = this.var.v * Math.sqrt(this.var.t/(this.var.g * this.var.a * Math.cos(Math.atan(this.var.s0))));
		this.var.tau = this.var.rh * this.var.s0;
		this.var.n_blodgett = this.var.alpha_blodgett * Math.pow(this.var.da, 1/6) / (2.25 + 5.23 * Math.log10(this.var.da/this.var.d50_in));
		this.var.n_bathurst = this.Manning.bathurst_n(this.var.alpha_bathurst, this.var.g, this.var.t, this.var.da, this.var.d50_in, this.var.froude);
		this.var.blodgett_v_bathurst = (this.var.da_over_d50 < 0.3) ? '----' : (this.var.da_over_d50 < 1.5) ? 'Bathurst' : (this.var.da_over_d50 <= 185) ? 'Blodgett' : '++++';
		switch(this.var.n_radio) {
			case 'bb':
				switch(this.var.blodgett_v_bathurst) {
					case 'Blodgett':
						this.var.n_in = this.var.n_blodgett;
						break;
					case 'Bathurst':
						this.var.n_in = this.var.n_bathurst; // Bathurst is circular with froude. Must include in iteration.
						break;
					default:
						this.var.n_in = this.var.n_strickler; // Fall back to Strickler.
				}
				break;
			case 'strickler':
				this.var.n_in = this.var.n_strickler;
				break;
			default:
				this.var.iterate_p = false ; // n_in is manual. No need to iterate.
		}
		this.var.d50_mra = 0.031 * Math.pow(this.var.v, 2.5) / (Math.pow(this.var.sgrock - 1, 0.25) * Math.pow(this.var.y, 0.25) * ((this.var.beta <= 30) ? 1 : 1.5));
		this.var.d50_searcy = 0.022 * Math.pow(this.var.v, 2);
		this.var.c_isbash = (this.var.beta <= 30) ? 1.2 : 0.86;
		this.var.d50_bottom = this.Manning.mc_riprap_size(this.var.y, this.var.a, this.var.v, this.var.g, 1000, this.var.s0, this.var.c_isbash, this.var.sgrock);
		this.var.d50_z1 = this.Manning.mc_riprap_size(this.var.y, this.var.a, this.var.v, this.var.g, this.var.z1, this.var.s0, this.var.c_isbash, this.var.sgrock);
		this.var.d50_z2 = this.Manning.mc_riprap_size(this.var.y, this.var.a, this.var.v, this.var.g, this.var.z2, this.var.s0, this.var.c_isbash, this.var.sgrock);
		switch(this.var.d50_radio) {
			case 'isbash':
				this.var.d50_calc = Math.max(this.var.d50_bottom, this.var.d50_z1, this.var.d50_z2);
				break;
			case 'maynord':
				this.var.d50_calc = this.var.d50_mra;
				break;
			case 'searcy':
				this.var.d50_calc = this.var.d50_searcy;
				break;
			default:
				this.var.d50_calc = this.var.d50_in;
				this.var.iterate_p = false ; // d50_in is manual. No need to iterate.
		}
		if (this.var.iterate_p === true) {
			this.var.iterate_p = (Math.abs(this.var.d50_safety * this.var.d50_calc / this.var.d50_in - 1) > this.var.max_err);
			this.var.d50_in = (this.var.d50_in + 5 * this.var.d50_safety * this.var.d50_calc) / 6; // Move d50_in 75% of the way to d50calc for a cheap way to iterate.
		} else {
			this.var.d50_in = this.var.d50_safety * this.var.d50_calc; // Move d50_in 75% of the way to d50calc for a cheap way to 
		}
	}
	if (this.var.n_radio !== '') {
		objForm.n_in.value = this.var.n_in.toFixed(4);  
	}
	if (this.var.d50_radio !== '') {
		objForm.d50_in.value = (this.var.d50_in * objForm.d50_inu.value).toFixed(4);  
	}
	this.var.froude = this.var.i;
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'q', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 't', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'froude', precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'n_strickler', precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'n_blodgett', precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'n_bathurst', precision = 4, hasUnits = false);
	document.getElementById('blodgett_v_bathurst').innerHTML = (this.var.blodgett_v_bathurst);
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
//'[id$=copy]'
$(document).ready(function() {
	$('#n_in').on('input',function() {$('[id^=n_radio_]').prop('checked', false);});
	$('#d50_in').on('input',function() {$('[id^=d50_radio_]').prop('checked', false);});
});
<?php echoCookieScript(); ?>

</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
