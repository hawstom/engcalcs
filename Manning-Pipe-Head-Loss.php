<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mphl_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?php echo $ec_lang['mphl_main_desc']; ?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'default' => '1', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'default' => '1', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'default' => '1000', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'n', 'type' => 'number', 'default' => '0.01', 'units' => NULL, 'label' => $ec_lang['mpf_manningRoughness'].' <a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a>'),
		Array( 'name' => 'k', 'type' => 'number', 'default' => '10', 'units' => NULL, 'label' => $ec_lang['mphl_total_junction_k']),
		Array('name' => 'z1', 'type' => 'number', 'default' => '0', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_elevation_1']),
		Array('name' => 'p1', 'type' => 'number', 'default' => '10', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_pressure_head_1']),
		Array('name' => 'z2', 'type' => 'number', 'default' => '0', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_elevation_2']),
),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2','mm2','ft2', 'in2'), 'label' => $ec_lang['mphl_area']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => Array('mps','ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'sf', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['mphl_friction_slope']),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'hf', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_friction_loss']),
		Array('name' => 'hm', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_junction_loss']),
		Array('name' => 'hl', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_total_loss']),
		Array('name' => 'hgl1', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_hgl_1']),
		Array('name' => 'hgl2', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_hgl_2']),
		Array('name' => 'p2', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_pressure_head_2']),
	)
);
?>
<?php echoFeedback(); ?>
<script>
EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'n', hasUnits = false);
	this.readFormInput(objForm, 'k', hasUnits = false);
	this.readFormInput(objForm, 'z1', hasUnits = false);
	this.readFormInput(objForm, 'p1', hasUnits = false);
	this.readFormInput(objForm, 'z2', hasUnits = false);
	this.var.c = 1.0;
	this.var.g = 9.806;
	this.var.gammawater = 9806,
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.v = this.var.q / this.var.a;
	this.var.hv = Math.pow(this.var.v,2) / (2 * this.var.g);
	this.var.hm = this.var.k * this.var.hv;
	this.var.sf = Math.pow(this.var.v,2) * Math.pow(this.var.n,2) * 6.3496 / (Math.pow(this.var.c,2) * Math.pow(this.var.d,4/3));
	this.var.tau = this.var.gammawater * this.var.rh * this.var.sf;
	this.var.hf = this.var.l * this.var.sf;
	this.var.hl = +this.var.hf + +this.var.hm;
	this.var.hgl1 = +this.var.z1 + +this.var.p1;
	this.var.hgl2 = +this.var.hgl1 - +this.var.hl;
	this.var.p2 = +this.var.hgl2 - +this.var.z2;
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