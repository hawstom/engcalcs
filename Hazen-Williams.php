<?php
require_once ('lib/base.inc.php');
//phpinfo();
$html_title = $ec_lang['hw_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['hw_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'default' => '1', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'default' => '1', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'default' => '1000', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'c', 'type' => 'number', 'default' => '100', 'units' => NULL, 'label' => '<a href="https://www.engineeringtoolbox.com/hazen-williams-coefficients-d_798.html">'.$ec_lang['hw_roughness'].'</a>'),
		Array( 'name' => 'km', 'type' => 'number', 'default' => '10', 'units' => NULL, 'label' => '<a href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html">'.$ec_lang['mphl_total_junction_k'].'</a>'),
		Array('name' => 'egl1', 'type' => 'number', 'default' => '0', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_egl_1']),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2','mm2','ft2','in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => Array('mps','ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'sf', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['mphl_friction_slope']),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'hf', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_friction_loss']),
		Array('name' => 'hm', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_junction_loss']),
		Array('name' => 'hl', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_total_loss']),
		Array('name' => 'hgl1', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['hw_hgl_1']),
		Array('name' => 'egl2', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_egl_2']),
		Array('name' => 'hgl2', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['hw_hgl_2']),
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
	this.var.khw = 0.849,
	this.var.g = 9.806;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'c', hasUnits = false);
	this.readFormInput(objForm, 'km', hasUnits = false);
	this.readFormInput(objForm, 'egl1', hasUnits = true);
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.v = this.var.q / this.var.a;
	// From 7.8828/d^4.8704 * (Q/(k*C))^1.852 at Wikipedia Hazen-Williams article.
	this.var.sf = 7.8828 / Math.pow(this.var.d, 4.8704) * Math.pow(this.var.q / (this.var.khw * this.var.c), 1.852);
	this.var.tau = this.var.rh * this.var.sf;
	this.var.hv = Math.pow(this.var.v,2) / (2 * this.var.g);
	this.var.hgl1 = +this.var.egl1 - +this.var.hv;
	this.var.hf = this.var.sf * this.var.l;
	this.var.hm = this.var.hv * this.var.km;
	this.var.hl = +this.var.hf + +this.var.hm;
	this.var.egl2 = +this.var.egl1 + +this.var.hl;
	this.var.hgl2 = +this.var.egl2 - +this.var.hv;
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'sf', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hf', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hm', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hl', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl1', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'egl2', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl2', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'p2', precision = 4, hasUnits = true);
}
EngCalcs.pageCalculatorInitialize = function () {
}
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice