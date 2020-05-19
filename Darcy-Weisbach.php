<?php
require_once ('lib/base.inc.php');
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
		Array('name' => 'q', 'type' => 'number', 'default' => '1', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
		Array('name' => 'd', 'type' => 'number', 'default' => '1', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
		Array('name' => 'l', 'type' => 'number', 'default' => '1000', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_pipe_length']),
		Array('name' => 'e', 'type' => 'number', 'default' => '0.001', 'units' => Array('m','mm','ft','in'), 'label' => '<a href="https://nepis.epa.gov/Exe/ZyNET.exe/P1007WWU.txt?ZyActionD=ZyDocument&Client=EPA&Index=2000%20Thru%202005&SearchMethod=1&TocRestrict=n&&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5CZYFILES%5CINDEX%20DATA%5C00THRU05%5CTXT%5C00000024%5CP1007WWU.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=31">'.$ec_lang['dw_roughness'].'</a>'),
		Array('name' => 'v', 'type' => 'number', 'default' => '1e-6', 'units' => NULL, 'label' => '<a href="https://www.engineersedge.com/fluid_flow/kinematic-viscosity-table.htm">'.$ec_lang['dw_kinematic_viscosity'].'</a>'),
		Array( 'name' => 'km', 'type' => 'number', 'default' => '10', 'units' => NULL, 'label' => '<a href="https://www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html">'.$ec_lang['mphl_total_junction_k'].'</a>'),
		Array('name' => 'z1', 'type' => 'number', 'default' => '0', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_elevation_1']),
		Array('name' => 'p1', 'type' => 'number', 'default' => '10', 'units' => Array('mh2o','mmh2o','kpa','fth2o','inh2o','psi'), 'label' => $ec_lang['mphl_pressure_head_1']),
		Array('name' => 'z2', 'type' => 'number', 'default' => '0', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mphl_elevation_2']),
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
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'e', hasUnits = true);
	this.readFormInput(objForm, 'v', hasUnits = false);
	this.readFormInput(objForm, 'km', hasUnits = false);
	this.readFormInput(objForm, 'z1', hasUnits = false);
	this.readFormInput(objForm, 'p1', hasUnits = false);
	this.readFormInput(objForm, 'z2', hasUnits = false);
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.u = this.var.q / this.var.a;
	this.var.re = this.var.u * this.var.d / this.var.v;
	if (this.var.re < 2000) {
		this.var.regime = 0;
		this.var.regime_label = '<?=$ec_lang['dw_regime_laminar']?>';
		this.var.f_method = '<a href="https://en.wikipedia.org/wiki/Darcy%E2%80%93Weisbach_equation#Laminar_regime">Hagen-Pouseuille</a>';
		this.var.f = 64 / this.var.re;
	} else if (this.var.re < 4000) {
		this.var.regime = 1;
		this.var.regime_label = '<?=$ec_lang['dw_regime_transitional']?>';
		this.var.f_method = 'Moody Dunlop EPANET';
		this.var.r = this.var.re/2000;
		this.var.y2 = this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(this.var.re, 0.9);
		this.var.y3 = -0.86859 * Math.log(this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(4000,0.9));
		this.var.fa = Math.pow(this.var.y3,-2);
		this.var.fb =  this.var.fa * (2 - 0.00514215 / (this.var.y2 * this.var.y3));
		this.var.x1 =  7 * this.var.fa - this.var.fb;
		this.var.x2 =  0.128 - 17 * this.var.fa + 2.5 * this.var.fb;
		this.var.x3 =  -0.128 + 13 * this.var.fa - 2 * this.var.fb;
		this.var.x4 =  this.var.r * (0.032 * this.var.fa + 0.5 * this.var.fb);
		this.var.f =  this.var.x1 + this.var.r * (this.var.x2 + this.var.r * (this.var.x3 + this.var.x4));
	} else {
		this.var.regime = 2;
		this.var.regime_label = '<?=$ec_lang['dw_regime_turbulent']?>';
		this.var.f_method = '<a href="https://en.wikipedia.org/wiki/Darcy_friction_factor_formulae#Swamee%E2%80%93Jain_equation">Swamee Jain</a>';
		this.var.f = 0.25 / Math.pow(Math.log(this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(this.var.re, 0.9)), 2);
	}
	this.var.sf = this.var.f * Math.pow(this.var.u, 2) / (2 * this.var.d * this.var.g);
	this.var.tau = this.var.rh * this.var.sf;
	this.var.hv = Math.pow(this.var.u,2) / (2 * this.var.g);
	this.var.hf = this.var.sf * this.var.l;
	this.var.hm = this.var.hv * this.var.km;
	this.var.hl = +this.var.hf + +this.var.hm;
	this.var.hgl1 = +this.var.z1 + +this.var.p1;
	this.var.hgl2 = +this.var.hgl1 - +this.var.hl;
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
EngCalcs.pageCalculatorInitialize = function () {
}
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice