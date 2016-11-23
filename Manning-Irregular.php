<?php 
require_once ("../lib/edc.lib.php");
$html_title = $ec_lang['mi_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?php echo $ec_lang['mi_main_desc'] ?></h2>
<p><a href="../contact.php"><?=$ec_lang['template_translation_help']?></a></p>

<?php
echoCalculatorForm(
    //Inputs
    Array(
        Array('ws', Array('m', 'mm', 'ft', 'in'), $ec_lang['mi_waterSurfaceElevation']),
        Array('s0',  Array('grade', 'gradePercent'), $ec_lang['mtc_channel_slope']),
        Array('beta', NULL, $ec_lang['mtc_bend_angle']),
        Array('sgrock', NULL, $ec_lang['mtc_sgrock'])
    ),
    //Results
    Array(
        Array('q_sum', Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), $ec_lang['mi_q_sum']),
        Array('q_617', Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), $ec_lang['mi_q_617']),
        Array('q_618', Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), $ec_lang['mi_q_618']),
    ),
    $flagFormAppend = true
);
function echoCalculatorFormAppend() {
        global $ec_units, $ec_lang;
        $indent_string = "\t\t\t\t\t";
?>
	<table id="CalcsTable">
		<thead>
			<tr>
				<th colspan="16"><?=$ec_lang['mi_xSecPoints']?></th>
			</tr>
			<tr>
				<th>
					<?=$ec_lang['mi_station']?><br />
					<?php echoUnitSelect($name = 'stationu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_elevation']?>
					<?php echoUnitSelect($name = 'elevationu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_n']?>
				</th>
				<th>
					<?=$ec_lang['mi_q']?>
					<?php echoUnitSelect($name = 'qu', $units = Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_v']?>
					<?php echoUnitSelect($name = 'vu', $units = Array('mps', 'ftps', 'mph'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_t']?>
					<?php echoUnitSelect($name = 'tu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_f']?>
				</th>
				<th>
					<?=$ec_lang['mi_d50_strickler']?>
					<?php echoUnitSelect($name = 'd50_strickleru', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_d50_mc']?>
					<?php echoUnitSelect($name = 'd50_mcu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_d50_mra']?>
					<?php echoUnitSelect($name = 'd50_mrau', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_d50_searcy']?>
					<?php echoUnitSelect($name = 'd50_searcyu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_hv']?>
					<?php echoUnitSelect($name = 'hvu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_tau']?>
					<?php echoUnitSelect($name = 'tauu', $units = Array('npm2', 'psf'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_a']?>
					<?php echoUnitSelect($name = 'au', $units = Array('m2', 'mm2', 'ft2', 'in2'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_pw']?>
					<?php echoUnitSelect($name = 'pwu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_rh']?>
					<?php echoUnitSelect($name = 'rhu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
			</tr>
		</thead>
		<tbody id="CalcsBody">
		</tbody>
	</table>
	<!-- <input type="text" size="6" name="calcname" /> Calculation name<br /><br /> -->
	<br />
	<input type="submit" name="Submit" value="<?=$ec_lang['mi_save_and_calculate']?>" /> 
	<!--<input type="submit" name="Submit" value="Load and Calculate" /> --> 
	<?=$ec_lang['mi_or_adjust']?> 
	<a href="javascript:pageAddCalcRow()">+</a>/<a href="javascript:deleteCalcRow()">-</a> <?=$ec_lang['mi_n_rows']?>
	<br />
	</div>

<?php
}
?>
<div id="sketch"></div>
<p><a href="../contact.php"><?=$ec_lang['template_feedback']?></a></p>
<h2><?=$ec_lang['mi_notes']?></h2>
<dl>
<dt><?=$ec_lang['mi_notes_1_term']?></dt><dd><?=$ec_lang['mi_notes_1_def']?></dd>
<dt><?=$ec_lang['mi_notes_2_term']?></dt><dd><?=$ec_lang['mi_notes_2_def']?></dd>
</dl>
<script type="text/javascript">
<!--
// The argument f is not used here.
var pageCalculator = function (f) {
	'use strict';
	Haws.Manning.s0 = f['s0'].value / f['s0u'].value;
	Haws.Manning.beta = f['beta'].value;
	Haws.Manning.sgrock = f['sgrock'].value;
	ws = f.ws.value;
	var
	// Use unary + to convert form values to numbers
	// so when we add z1 and z2 they don't get concatenated.
	ws = f['ws'].value / f['wsu'].value,
	d50_mc,
	d50_mra,
	row,
	station0,
	station1,
	arrStation = [],
	elev0,
	elev1,
	arrElev = [],
	arrSketchSegments = [],
	n1,
	d0,
	d1,
	dmax = 0,
	l,
	rise,
	hypotenuse,
	s, 
	tau,
	d50_mc,
	d50_mra,
	ac = 0,
	pwc = 0,
	topwidthc = 0,
	qc = 0,
	ncompterm617c = 0,
	ncompterm618c = 0;

	for (var station=0; station < numCalcRows; station++) {
		row = document.getElementById("CalcsBody").getElementsByTagName('tr')[station];
		station1 = row.getElementsByTagName( 'input' )[0].value / f['stationu'].value;
		arrStation.push(station1);
		elev1 = row.getElementsByTagName('input')[1].value / f['elevationu'].value;
		arrElev.push(elev1);
		d1=Math.max(ws-elev1,0);
		dmax = Math.max(dmax,d1);
		
		// Do the calcs and output if this is not the first row
		if(station > 0) {
			Haws.Manning.n = row.getElementsByTagName( 'input' )[2].value;
			l=station1-station0;
			rise=elev1-elev0;
			hypotenuse = Math.pow(l*l+rise*rise,0.5);
			s = (l == 0) ? 0 : rise/l;
			Haws.Manning.a = (s==0) ? (d0*l) : (d0*d0-d1*d1)/(2*s);
			ac = ac + Haws.Manning.a;
			// Three shorthand "if" statements nested/strung together
			Haws.Manning.pw = (Haws.Manning.a == 0) ? 0 : (s == 0) ? l :  Math.abs(wedgeWettedPerimeter(d0, s) - wedgeWettedPerimeter(d1, s));
			pwc = pwc + Haws.Manning.pw;
			Haws.Manning.t = l*Haws.Manning.pw/hypotenuse;
			arrSketchSegments.push({
				sectionX1: station0,
				sectionX2: station1,
				sectionY1: elev0,
				sectionY2: elev1,
				WSX1: (s >= 0) ? station0 : (station1 - Haws.Manning.t),
				WSX2: (s <= 0) ? station1 : (station0 + Haws.Manning.t)
			});
			topwidthc = topwidthc + Haws.Manning.t;
			Haws.Manning.recalc();
			qc = qc + Haws.Manning.q;
			ncompterm617c = ncompterm617c + Haws.Manning.ncompterm617;
			ncompterm618c = ncompterm618c + Haws.Manning.ncompterm618,
			tau = Haws.Manning.get_tau(dmax);
			d50_mc = Haws.Manning.get_d50_mc(dmax, Math.abs(1/s));
			d50_mra = Haws.Manning.get_d50_mra(dmax);
			row.getElementsByTagName('td')[3].innerHTML = (Haws.Manning.q * f['qu'].value).toFixed(2);
			row.getElementsByTagName('td')[4].innerHTML = (Haws.Manning.v * f['vu'].value).toFixed(2);
			row.getElementsByTagName('td')[5].innerHTML = (Haws.Manning.t * f['tu'].value).toFixed(2);
			row.getElementsByTagName('td')[6].innerHTML = Haws.Manning.f.toFixed(2);
			row.getElementsByTagName('td')[7].innerHTML = (Haws.Manning.d50_strickler * f['d50_strickleru'].value).toFixed(2);
			row.getElementsByTagName('td')[8].innerHTML = (d50_mc * f['d50_mcu'].value).toFixed(2);
			row.getElementsByTagName('td')[9].innerHTML = (d50_mra * f['d50_mrau'].value).toFixed(2);
			row.getElementsByTagName('td')[10].innerHTML = (Haws.Manning.d50_searcy * f['d50_searcyu'].value).toFixed(2);
			row.getElementsByTagName('td')[11].innerHTML = (Haws.Manning.hv * f['hvu'].value).toFixed(2);
			row.getElementsByTagName('td')[12].innerHTML = (tau * f['tauu'].value).toFixed(2);
			row.getElementsByTagName('td')[13].innerHTML = (Haws.Manning.a * f['au'].value).toFixed(2);
			row.getElementsByTagName('td')[14].innerHTML = (Haws.Manning.pw * f['pwu'].value).toFixed(2);
			row.getElementsByTagName('td')[15].innerHTML = (Haws.Manning.rh * f['rhu'].value).toFixed(2);
			// Save the old geometry variables
		}
		station0=station1;
		elev0=elev1;
		d0=d1;
	}
    document.getElementById('q_sum').innerHTML = (qc * f['q_sumu'].value).toFixed(2);
	Haws.Manning.pw = pwc;
	Haws.Manning.a = ac;
	Haws.Manning.n = Math.pow(ncompterm617c, (2/3))/Math.pow(pwc, (2/3));
	Haws.Manning.recalc();
	document.getElementById('q_617').innerHTML = (Haws.Manning.q * f['q_617u'].value).toFixed(2);
	Haws.Manning.n = Math.pow(ncompterm618c, 0.5)/Math.pow(pwc, 0.5);
	Haws.Manning.recalc();
	document.getElementById('q_618').innerHTML = (Haws.Manning.q * f['q_618u'].value).toFixed(2);
/*	document.getElementById('v').innerHTML = (v * f['vu'].value).toFixed(2);
	document.getElementById('hv').innerHTML = (hv * f['hvu'].value).toFixed(2);
	document.getElementById('a').innerHTML = (a * f['au'].value).toFixed(2);
	document.getElementById('pw').innerHTML = (pw * f['pwu'].value).toFixed(2);
	document.getElementById('rh').innerHTML = (rh * f['rhu'].value).toFixed(2);
	document.getElementById('t').innerHTML = (t * f['tu'].value).toFixed(2);
	document.getElementById('f').innerHTML = froude.toFixed(2);
	document.getElementById('tau').innerHTML = (tau * f['tauu'].value).toFixed(2);
	document.getElementById('d50_strickler').innerHTML = (d50_strickler * f['d50_strickleru'].value).toFixed(2);
	document.getElementById('d50_flattest').innerHTML = (d50_bottom * f['d50_flattestu'].value).toFixed(2);
	document.getElementById('d50_steepest').innerHTML = (d50_z1 * f['d50_steepestu'].value).toFixed(2);
	document.getElementById('d50_mra').innerHTML = (d50_mra * f['d50_mrau'].value).toFixed(2);
	document.getElementById('d50_searcy').innerHTML = (d50_searcy * f['d50_searcyu'].value).toFixed(2);
*/	
	// Sketch
	var
	i,
	htmlSketchSegments = '';
	Haws.Sketch.construct({
		maxHeight: 100,
		maxWidth: 600,
		strokeColor: 'black',
		strokeWidth: 4,
		figureTop: Math.max(...arrElev, ws),
		figureLeft: Math.min(...arrStation),
		figureHeight: Math.max(...arrElev, ws) - Math.min(...arrElev),
		figureWidth: Math.max(...arrStation) - Math.min(...arrStation)
	});
	for (i = 0; i < arrSketchSegments.length; i = i + 1) {
		Haws.Sketch.strokeColor = 'black';
		htmlSketchSegments = htmlSketchSegments.concat(
			Haws.Sketch.getLineHtml([
			 {x:arrSketchSegments[i].sectionX1, y:arrSketchSegments[i].sectionY1},
			 {x:arrSketchSegments[i].sectionX2, y:arrSketchSegments[i].sectionY2}
			])
		);
		Haws.Sketch.strokeColor = 'blue';
		htmlSketchSegments = htmlSketchSegments.concat(
			Haws.Sketch.getLineHtml([
			 {x:arrSketchSegments[i].WSX1, y:ws},
			 {x:arrSketchSegments[i].WSX2, y:ws}
			])
		);
	}

	document.getElementById('sketch').innerHTML =
		'<svg height="' + Haws.Sketch.maxHeight + '" width="' + Haws.Sketch.maxWidth + '">' 
		+ htmlSketchSegments
		+ 'Sorry, your browser does not support inline SVG.' 
		+ '</svg>';

	adjustInputWidth(f);
};
if (Haws) {
	alert('Fatal error: Object \'Haws\' already defined.');
} else {
	var Haws = {};
}
Haws.Sketch = {};

Haws.Sketch.construct = function (obj) {
	this.maxHeight = obj.maxHeight;
	this.maxWidth = obj.maxWidth;
	this.strokeColor = obj.strokeColor;
	this.strokeWidth = obj.strokeWidth;
	this.figureTop = obj.figureTop;
	this.figureLeft = obj.figureLeft;
	this.figureHeight = obj.figureHeight;
	this.figureWidth = obj.figureWidth;
	this.xScale = (this.maxWidth-this.strokeWidth) / this.figureWidth;
	this.yScale = -1 * (this.maxHeight-this.strokeWidth) / this.figureHeight;
}

// Convert point from right-handed figure coordinate system
// to left-handed sketch coordinate system
Haws.Sketch.convertPoint = function (objFigurePoint) {
	var objPoint = {};
	objPoint.x = this.strokeWidth/2 + (objFigurePoint.x - this.figureLeft) * this.xScale;
	objPoint.y = this.strokeWidth/2 + (objFigurePoint.y - this.figureTop) * this.yScale;
	return objPoint;
}

Haws.Sketch.getLineHtml = function (arrPoints) {
	return '<line '
	+ 'x1="' + this.convertPoint(arrPoints[0]).x.toString()
	+ '" y1="'  + this.convertPoint(arrPoints[0]).y.toString()
	+  '" x2="'  + this.convertPoint(arrPoints[1]).x.toString()
	+  '" y2="'  + this.convertPoint(arrPoints[1]).y.toString()
	+  '" style="stroke:' + this.strokeColor 
	+ ';stroke-width:' + this.strokeWidth + '" />';
}

Haws.Manning = {};

Haws.Manning.c = 1.0;
Haws.Manning.g = 9.806;
Haws.Manning.gammawater = 9806;

Haws.Manning.recalc = function () {
	this.s0root = Math.pow(this.s0, 0.5);
	this.rh = this.a/this.pw;
	this.v = this.c/this.n*Math.pow(this.rh,2/3)*this.s0root;
	this.q = this.v * this.a;
	this.hv = this.v * this.v / (2 * this.g);
	this.f = this.v * Math.sqrt(this.t/(this.g * this.a * Math.cos(Math.atan(this.s0))));
	this.ncompterm617 = this.pw*Math.pow(this.n,1.5);
	this.ncompterm618 = this.pw*Math.pow(this.n,2);
	this.c_isbash = (this.beta <= 30) ? 1.2 : 0.86;
	this.d50_strickler = Math.pow(this.n * 21.1, 6); // n = 1/21.1 D ^ (1/6)
	this.d50_searcy = 0.022 * this.v * this.v;
};

// Shear stress depends on y, so we report it for a point and don't store it with the section.
Haws.Manning.get_tau = function (y) {
	return this.gammawater * y * this.s0;
};

Haws.Manning.get_d50_mra = function (y) {
		d50 = 0.031 * Math.pow(this.v, 2.5) / (Math.pow(this.sgrock - 1, 0.25) * Math.pow(y, 0.25) * ((this.beta <= 30) ? 1 : 1.5));
		return d50;
};

Haws.Manning.get_d50_mc = function(y, z) {
	var
	d50,
	hvmax = this.v * this.v * 1.33 * 1.33 / (2 * this.g);
	if (this.s0 < 0.02) {
		// Isbash
		d50 = hvmax / (this.c_isbash * this.c_isbash * Math.cos(Math.atan(1 / z)) * (this.sgrock - 1));
	} else if (this.s0 < 0.1) {
		// Robinson unit q = v * y corrected 2015-10-17
		d50 = 1.413 * Math.pow(this.v * y, 0.529) * Math.pow(this.s0, 0.794);
	} else if (s0 < 0.4) {
		// Robinson
		d50 = 0.4623 * Math.pow(this.v * y, 0.529) * Math.pow(this.s0, 0.307);
	} else {
		d50 = '-';
	}
	return d50;
};

var wedgeWettedPerimeter = function (depth, slope) {
	return Math.pow(depth*depth+(depth/slope)*(depth/slope), 0.5);
};

var addManningIrregularStation = function (station, elevation, n) {
	'use strict';
	var arrColumns = [
		{name: 'station',      value: station,   isInput: true},
		{name: 'elevation',    value: elevation, isInput: true},
		{name: 'n',            value: n,         isInput: (n !== false)},
		{name: 'q',            value: null,      isInput: false},
		{name: 'v',            value: null,      isInput: false},
		{name: 't',            value: null,      isInput: false},
		{name: 'f',            value: null,      isInput: false},
		{name: 'd50_strickler',value: null,      isInput: false},
		{name: 'd50_mc',       value: null,      isInput: false},
		{name: 'd50_mra',      value: null,      isInput: false},
		{name: 'd50_searcy',   value: null,      isInput: false},
		{name: 'hv',           value: null,      isInput: false},
		{name: 'tau',          value: null,      isInput: false},
		{name: 'a',            value: null,      isInput: false},
		{name: 'pw',           value: null,      isInput: false},
		{name: 'rh',           value: null,      isInput: false},
	];
	addCalcRow(arrColumns);
};

var pageAddCalcRow = function () {
	var n;
    if (numCalcRows === 0) {
		n = false;
	} else {
		n = 0.030;
	}
	addManningIrregularStation(0,0,n);
};


<!--
// Global variables
var numCalcRows = 0;
<?php
echoCookieScript ();
?>
-->
</script>
<?php
echoFooter("main");
?>
