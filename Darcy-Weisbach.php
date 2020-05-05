<?php
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
//phpinfo();
$html_title = $ec_lang['dw_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="Darcy-Weisbach sizing pipie pipes rate tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['dw_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'q', 'type' => 'number', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'e', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['dw_roughness']),
		Array('name' => 'v', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['dw_kinematic_viscosity']),
		Array( 'name' => 'km', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mphl_total_junction_k']),
		Array('name' => 'z1', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_elevation_1']),
		Array('name' => 'p1', 'type' => 'number', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_pressure_head_1']),
		Array('name' => 'z2', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_elevation_2']),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2','mm2','ft2','in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'u', 'units' => Array('mps','ftps'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 're', 'units' => NULL, 'label' => $ec_lang['dw_reynolds_number']),
		Array('name' => 'regime_label', 'units' => NULL, 'label' => $ec_lang['dw_flow_regime']),
		Array('name' => 'f_method', 'units' => NULL, 'label' => $ec_lang['dw_friction_factor_method']),
		Array('name' => 'f', 'units' => NULL, 'label' => $ec_lang['dw_friction_factor']),
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

<div id="sketch"></div>

<?php echoFeedback(); ?>

<script>
EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = 9.806;
	this.var.gammawater = 9806,
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'e', hasUnits = true);
	this.readFormInput(objForm, 'v', hasUnits = false);
	this.readFormInput(objForm, 'km', hasUnits = false);
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	// We are calling nu v, so velocity is u. I didn't make this up myself.
	this.var.u = this.var.q / this.var.a;
	this.var.hv = Math.pow(this.var.u,2) / (2 * this.var.g);
	this.var.hm = this.var.hv * this.var.km;
	this.var.re = this.var.u * this.var.d / this.var.v;
	if (this.var.re < 2000) {
		this.var.regime = 0;
		this.var.regime_label = '<?=$ec_lang['dw_regime_laminar']?>';
		this.var.f_method = 'Hagen-Pouseuille';	
		this.var.f = 64 / this.var.re;
	} else if (this.var.re < 4000) {
		this.var.regime = 1;
		this.var.regime_label = '<?=$ec_lang['dw_regime_transitional']?>';
		this.var.f_method = 'Moody Dunlop EPANET';	
		this.var.f = 'N/A'; // To do
	} else {
		this.var.regime = 2;
		this.var.regime_label = '<?=$ec_lang['dw_regime_turbulent']?>';
		this.var.f_method = 'Swamee Jain';
		this.var.f = 0.25 / Math.pow(Math.log(this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(this.var.re, 0.9)), 2);
	}
	this.var.sf = this.var.f * Math.pow(this.var.u, 2) / (2 * this.var.d * this.var.g);
	this.var.tau = this.var.gammawater * this.var.rh * this.var.sf;
	this.var.hf = this.var.sf * this.var.l;
	this.var.hl = +this.var.hf + +this.var.hm;
	this.var.hgl1 = +this.var.z1 + +this.var.hv;
	this.var.hgl2 = +this.var.hgl1 - +this.var.hf;
	this.var.p2 = +this.var.hgl2 - +this.var.z2;
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'u', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 're', precision = 0, hasUnits = false);
	document.getElementById('regime_label').innerHTML = this.var['regime_label'];
	document.getElementById('f_method').innerHTML = this.var['f_method'];
	this.writeFormResult(objForm, 'f', precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'sf', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hf', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hm', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hl', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl1', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl2', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'p2', precision = 4, hasUnits = true);
}

<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
?>
