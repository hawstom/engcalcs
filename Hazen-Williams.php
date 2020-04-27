<?php
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
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
		Array('name' => 'q', 'type' => 'number', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'c', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['hw_roughness']),
		Array( 'name' => 'km', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mphl_total_junction_k']),
	),
	//Results
	Array(
		Array('name' => 'a', 'units' => Array('m2','mm2','ft2','in2'), 'label' => $ec_lang['mpf_flow_area']),
		Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
		Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
		Array('name' => 'v', 'units' => Array('mps','ftps','mph'), 'label' => $ec_lang['mpf_velocity']),
		Array('name' => 'hv', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mpf_velocity_head']),
		Array('name' => 'sf', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['hw_friction_slope']),
		Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
		Array('name' => 'hf', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_friction_loss']),
		Array('name' => 'hm', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_junction_loss']),
		Array('name' => 'hl', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_total_loss']),
	)
);

?>

<div id="sketch"></div>

<?php echoFeedback(); ?>

<script type="text/javascript">
EngCalcs.pageCalculator = function(objForm) {
	this.var = {};
	this.var.khw = 0.849,
	this.var.g = 9.806;
	this.var.gammawater = 9806,
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'c', hasUnits = false);
	this.readFormInput(objForm, 'km', hasUnits = false);
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.v = this.var.q / this.var.a;
	// From 7.8828/d^4.8704 * (Q/(k*C))^1.852 at Wikipedia Hazen-Williams article.
	this.var.sf = 7.8828 / Math.pow(this.var.d, 4.8704) * Math.pow(this.var.q / (this.var.khw * this.var.c), 1.852);
	this.var.tau = this.var.gammawater * this.var.rh * this.var.sf;
	// For units selector, report heads in pascals (standard SI pressure unit).  Convert meters to pascals with * (1000 * g)
	this.var.hv = Math.pow(this.var.v,2) / (2 * this.var.g) * (1000 * this.var.g);
	this.var.hf = this.var.sf * this.var.l  * (1000 * this.var.g);
	this.var.hm = this.var.hv * this.var.km;
	this.var.hl = +this.var.hf + +this.var.hm;
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
}

<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("main");
?>
