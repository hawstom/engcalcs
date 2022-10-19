<?php 
require_once ('lib/base.inc.php');
$html_title = $ec_lang['mi_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?php echo $ec_lang['mi_main_desc'] ?></h2>

<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
	//Inputs
	Array(
		Array('name' => 'ws', 'type' => 'number', 'default' => '1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mi_waterSurfaceElevation']),
		Array('name' => 's0', 'type' => 'number', 'default' => '0.001', 'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['mtc_channel_slope']),
	),
	//Results
	Array(
		Array('name' => 'q_617', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mi_q_617']),
	),
	$flagFormAppend = true
);
function echoCalculatorFormAppend() {
		global $ec_units, $ec_lang;
		$indent_string = "\t\t\t\t\t";
?>
	<table id="CalcsTable" style='float: left;'>
		<thead>
			<tr>
				<th colspan="17">
					<?=$ec_lang['mi_xSecPoints']?>
					<a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a> <?=$ec_lang['points_data_help']?>
				</th>
			</tr>
			<tr>
				<th colspan="5"><?=$ec_lang['mi_groupPoint']?></th>
				<th colspan="3"><?=$ec_lang['mi_groupSegment']?></th>
				<th colspan="6"><?=$ec_lang['mi_groupRegion']?></th>
			</tr>
			<tr>
				<th>
					<?=$ec_lang['mi_station']?><br />
					<br />
					<?php echoUnitSelect($name = 'stationu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_elevation']?>
					<br />
					<?php echoUnitSelect($name = 'elevationu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_n']?>
				</th>
				<th>
					<?=$ec_lang['mi_is_bank']?>
				</th>
				<th>
					<?=$ec_lang['mi_tau']?>
					<br />
					<?php echoUnitSelect($name = 'tauu', $units = Array('npm2', 'psf'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_t']?>
					<br />
					<?php echoUnitSelect($name = 'tu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_pw']?>
					<br />
					<?php echoUnitSelect($name = 'pwu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_a']?>
					<br />
					<?php echoUnitSelect($name = 'au', $units = Array('m2', 'mm2', 'ft2', 'in2'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_rh']?>
					<br />
					<?php echoUnitSelect($name = 'rhu', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_n617']?>
				</th>
				<th>
					<?=$ec_lang['mi_v617']?>
					<br />
					<?php echoUnitSelect($name = 'v617u', $units = Array('mps', 'ftps', 'mph'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_hv617']?>
					<br />
					<?php echoUnitSelect($name = 'hv617u', $units = Array('m', 'mm', 'ft', 'in'), $indent_string); ?>
				</th>
				<th>
					<?=$ec_lang['mi_fr617']?>
				</th>
				<th>
					<?=$ec_lang['mi_q617']?>
					<br />
					<?php echoUnitSelect($name = 'q617u', $units = Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), $indent_string); ?>
				</th>
			</tr>
		</thead>
		<tbody id="CalcsBody">
		</tbody>
	</table>
	<div style='float:left;'>
		<p><?=$ec_lang['points_data_title']?></p>
		<p>
			<button type="button" id="points_data_copy"><?=$ec_lang['points_data_copy']?></button>
			<button type="button" id="points_data_paste"><?=$ec_lang['points_data_paste']?></button>
		</p>
		<textarea id='points_data'></textarea>
	</div>
	<div style='clear: both;'></div>

<?php
}
?>
<div id="sketch"></div>
<?php echoFeedback(); ?>
<h2><?=$ec_lang['mi_notes']?></h2>
<dl>
<dt><?=$ec_lang['mi_notes_1_term']?></dt><dd><?=$ec_lang['mi_notes_1_def']?></dd>
<dt><?=$ec_lang['mi_notes_2_term']?></dt><dd><?=$ec_lang['mi_notes_2_def']?></dd>
</dl>
<script src="<?=BASE_URL?>/engcalcs/lib/Manning.lib.js?v=4"></script>
<script>
<!--
EngCalcs.pageCalculator = function (objForm) {
	'use strict';
	this.Manning.s0 = objForm['s0'].value / objForm['s0u'].value;
	ws = objForm.ws.value;
	var
	hasUnits, precision,
	// Use unary + to convert form values to numbers
	// so when we add z1 and z2 they don't get concatenated.
	ws = objForm['ws'].value / objForm['wsu'].value,
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
	l,
	rise,
	hypotenuse,
	s, 
	tau,
	d50_mc,
	d50_mra;
	this.Manning.ac = 0;
	this.Manning.pwc = 0;
	this.Manning.ncompterm617c = 0;
	this.Manning.ncompterm618c = 0;
	this.Manning.qc = 0;
	this.Manning.q617c = 0;
	this.Manning.q618c = 0;

	for (var iStation=0; iStation < this.numCalcRows; iStation++) {
		row = document.getElementById("CalcsBody").getElementsByTagName('tr')[iStation];
		station1 = row.getElementsByTagName( 'input' )[0].value / objForm['stationu'].value;
		arrStation.push(station1);
		elev1 = row.getElementsByTagName('input')[1].value / objForm['elevationu'].value;
		arrElev.push(elev1);
		d1=Math.max(ws-elev1,0);
		// Output
		// Point
		// Bottom shear stress depends on y, so we report it for a point and don't store it with the section.
		tau = d1 * this.Manning.s0;
		document.getElementsByName('tau')[iStation].innerHTML = (tau * objForm['tauu'].value).toFixed(2);
		// Do the calcs and output if this is not the first row
		if(iStation > 0) {
			this.Manning.n = document.getElementsByName('n')[iStation].value;
			l=station1-station0;
			rise=elev1-elev0;
			hypotenuse = Math.pow(l*l+rise*rise,0.5);
			s = (l == 0) ? 0 : rise/l;
			this.Manning.a = (s==0) ? (d0*l) : (d0*d0-d1*d1)/(2*s);
			this.Manning.ac = this.Manning.ac + this.Manning.a;
			// Three shorthand "if" statements nested/strung together
			this.Manning.pw = (this.Manning.a == 0) ? 0 : (s == 0) ? l :  Math.abs(this.wedgeWettedPerimeter(d0, s) - this.wedgeWettedPerimeter(d1, s));
			this.Manning.pwc = this.Manning.pwc + this.Manning.pw;
			this.Manning.t = l*this.Manning.pw/hypotenuse;
			this.Manning.da = this.Manning.a / this.Manning.t;
			this.Manning.isBank = document.getElementsByName('is_bank')[iStation].checked;
			arrSketchSegments.push({
				sectionX1: station0,
				sectionX2: station1,
				sectionY1: elev0,
				sectionY2: elev1,
				WSX1: (s >= 0) ? station0 : (station1 - this.Manning.t),
				WSX2: (s <= 0) ? station1 : (station0 + this.Manning.t),
				isBank: this.Manning.isBank,
				n: this.Manning.n
			});
			this.Manning.recalc();
			this.Manning.qc = this.Manning.qc + this.Manning.q;
			this.Manning.ncompterm617c = this.Manning.ncompterm617c + this.Manning.ncompterm617;
			this.Manning.ncompterm618c = this.Manning.ncompterm618c + this.Manning.ncompterm618;
			if (iStation === this.numCalcRows - 1) {
				document.getElementsByName('is_bank')[iStation].checked = true;
				document.getElementsByName('is_bank')[iStation].disabled = true;
			} else {
				document.getElementsByName('is_bank')[iStation].disabled = false;               
			}
			// Output
			// Segment
			document.getElementsByName('t')[iStation].innerHTML = (this.Manning.t * objForm['tu'].value).toFixed(2);
			document.getElementsByName('pw')[iStation].innerHTML = (this.Manning.pw * objForm['pwu'].value).toFixed(2);
			document.getElementsByName('a')[iStation].innerHTML = (this.Manning.a * objForm['au'].value).toFixed(2);
			// Region
			if (this.Manning.isBank) {
				this.Manning.closeRegion();
				document.getElementsByName('rh')[iStation].innerHTML = (this.Manning.rh * objForm['rhu'].value).toFixed(2);
				document.getElementsByName('n617')[iStation].innerHTML = this.Manning.n617.toFixed(2);
				document.getElementsByName('v617')[iStation].innerHTML = (this.Manning.v617 * objForm['v617u'].value).toFixed(2);
				document.getElementsByName('hv617')[iStation].innerHTML = (this.Manning.hv617 * objForm['hv617u'].value).toFixed(2);
				document.getElementsByName('fr617')[iStation].innerHTML = this.Manning.fr617.toFixed(2);
				document.getElementsByName('q617')[iStation].innerHTML = (this.Manning.q617 * objForm['q617u'].value).toFixed(2);
			} else {
				document.getElementsByName('rh')[iStation].innerHTML = '';
				document.getElementsByName('n617')[iStation].innerHTML = '';
				document.getElementsByName('v617')[iStation].innerHTML = '';
				document.getElementsByName('hv617')[iStation].innerHTML = '';
				document.getElementsByName('fr617')[iStation].innerHTML = '';
				document.getElementsByName('q617')[iStation].innerHTML = '';
			}
		}
		// Save the old geometry variables
		station0=station1;
		elev0=elev1;
		d0=d1;
	}
	document.getElementById('q_617').innerHTML = (this.Manning.q617c * objForm['q_617u'].value).toFixed(2);

	// Sketch
	var
	i,
	htmlSketchSegments = '';
	this.Sketch.construct({
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
		this.Sketch.strokeColor = 'black';
		htmlSketchSegments = htmlSketchSegments.concat(
			this.Sketch.getLineHtml([
			 {x:arrSketchSegments[i].sectionX1, y:arrSketchSegments[i].sectionY1},
			 {x:arrSketchSegments[i].sectionX2, y:arrSketchSegments[i].sectionY2}
			])
		);
		this.Sketch.strokeColor = 'blue';
		htmlSketchSegments = htmlSketchSegments.concat(
			this.Sketch.getLineHtml([
			 {x:arrSketchSegments[i].WSX1, y:ws},
			 {x:arrSketchSegments[i].WSX2, y:ws}
			])
		);
		if (arrSketchSegments[i].isBank && i < arrSketchSegments.length - 1) {
			this.Sketch.strokeColor = 'red';
			htmlSketchSegments = htmlSketchSegments.concat(
				this.Sketch.getLineHtml([
				 {x:arrSketchSegments[i].sectionX2, y:this.Sketch.figureTop},
				 {x:arrSketchSegments[i].sectionX2, y:(this.Sketch.figureTop - this.Sketch.figureHeight)}
				])
			);
		}
		htmlSketchSegments = htmlSketchSegments.concat(
			this.Sketch.getMiddleTextHtml({
				point: {x:(arrSketchSegments[i].sectionX1 + arrSketchSegments[i].sectionX2) / 2, y:this.Sketch.figureTop-this.Sketch.figureHeight/2},
				text: arrSketchSegments[i].n,
				height: 14,
				rotation: -90
			})
		);
	}

	document.getElementById('sketch').innerHTML =
		'<svg height="' + this.Sketch.maxHeight + '" width="' + this.Sketch.maxWidth + '">' 
		+ htmlSketchSegments
		+ 'Sorry, your browser does not support inline SVG.' 
		+ '</svg>';

};

EngCalcs.pageCalculatorInitialize = function () {
	this.pageAddCalcRow();
	this.pageAddCalcRow();
	this.pageAddCalcRow();
	this.pageAddCalcRow();
}

EngCalcs.Sketch = {};

EngCalcs.Sketch.construct = function (obj) {
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
EngCalcs.Sketch.convertPoint = function (objFigurePoint) {
	var objPoint = {};
	objPoint.x = this.strokeWidth/2 + (objFigurePoint.x - this.figureLeft) * this.xScale;
	objPoint.y = this.strokeWidth/2 + (objFigurePoint.y - this.figureTop) * this.yScale;
	return objPoint;
}

EngCalcs.Sketch.getLineHtml = function (arrPoints) {
	return '<line '
	+ 'x1="' + this.convertPoint(arrPoints[0]).x.toString()
	+ '" y1="'  + this.convertPoint(arrPoints[0]).y.toString()
	+ '" x2="'  + this.convertPoint(arrPoints[1]).x.toString()
	+ '" y2="'  + this.convertPoint(arrPoints[1]).y.toString()
	+ '" style="stroke:' + this.strokeColor 
	+ ';stroke-width:' + this.strokeWidth + '" />';
}

EngCalcs.Sketch.getMiddleTextHtml = function (obj) {
	return '<text '
	+ 'x="' + this.convertPoint(obj.point).x.toString()
	+ '" y="'  + this.convertPoint(obj.point).y.toString()
	+ '" transform="rotate(' + obj.rotation.toString() 
	+ ' ' + this.convertPoint(obj.point).x.toString()
	+ ',' + (this.convertPoint(obj.point).y-obj.height/2).toString() + ')"'
	+ '" style="font-size: ' + obj.height + 'px;"' 
	+ ' fill="green" text-anchor = "middle"'
	+ '>' + obj.text + '</text>';
}

EngCalcs.Manning.recalc = function () {
	this.s0root = Math.pow(this.s0, 0.5);
		this.rh = this.a/this.pw;
		this.v = this.c/this.n*Math.pow(this.rh,2/3)*this.s0root;
	if (this.a == 0) {
		this.q = 0;
	} else {
		this.q = this.v * this.a;
	}
	this.hv = this.v * this.v / (2 * this.g);
	this.fr = this.v * Math.sqrt(this.t/(this.g * this.a * Math.cos(Math.atan(this.s0))));
	this.ncompterm617 = this.pw*Math.pow(this.n,1.5);
	this.ncompterm618 = this.pw*Math.pow(this.n,2);
};

EngCalcs.Manning.closeRegion = function () {
	this.pw = this.pwc;
	this.a = this.ac;
	this.n = Math.pow(this.ncompterm617c, (2/3))/Math.pow(this.pwc, (2/3));
	this.recalc();
	this.n617 = this.n;
	this.v617 = this.v;
	this.hv617 = this.hv;
	this.fr617 = this.fr;
	this.q617 = this.q;
	this.q617c = this.q617c + this.q;
	this.n = Math.pow(this.ncompterm618c, 0.5)/Math.pow(this.pwc, 0.5);
	this.recalc();
	this.n618 = this.n;
	this.v618 = this.v;
	this.fr618 = this.fr;
	this.q618 = this.q;
	this.q618c = this.q618c + this.q;
	this.pwc = 0;
	this.ac = 0;
	this.ncompterm617c = 0;
	this.ncompterm618c = 0;
};

EngCalcs.wedgeWettedPerimeter = function (depth, slope) {
	return Math.pow(depth*depth+(depth/slope)*(depth/slope), 0.5);
};

EngCalcs.addManningIrregularStation = function (station, elevation, d50in, n, isBank) {
	'use strict';
	var arrColumns = [
		// Point
		{name: 'station',            value: station,   inputType: 'number'},
		{name: 'elevation',          value: elevation, inputType: 'number'},
		{name: 'n',                  value: n,         inputType: ((n === null) ? null : 'number')},
		{name: 'is_bank',            value: isBank,    inputType: ((isBank === null) ? null : 'checkbox')},
		{name: 'tau',                value: null,      inputType: null},
		// Segment
		{name: 't',                  value: null,      inputType: null},
		{name: 'pw',                 value: null,      inputType: null},
		{name: 'a',                  value: null,      inputType: null},
		// Region
		{name: 'rh',                 value: null,      inputType: null},
		{name: 'n617',               value: null,      inputType: null},
		{name: 'v617',               value: null,      inputType: null},
		{name: 'hv617',              value: null,      inputType: null},
		{name: 'fr617',              value: null,      inputType: null},
		{name: 'q617',               value: null,      inputType: null},
	];
	this.addCalcRow(arrColumns);
};

EngCalcs.pageAddCalcRow = function () {
	var n,
	isBank,
	station,
	elevation;
	if (this.numCalcRows === 0) {
		d50in = null;
		n = null;
		// If first row, don't show bank checkbox.
		isBank = null;
		station = 0
		elevation = 0
	} else {
		d50in = 1;
		n = 1;
		isBank = false;
		station = +document.getElementsByName('station')[this.numCalcRows - 1].value + +1;
		elevation = +document.getElementsByName('elevation')[this.numCalcRows - 1].value;
	}
	this.addManningIrregularStation(station, elevation, d50in, n, isBank);
};

EngCalcs.dataSingletonsCount = 4;
EngCalcs.dataColumnsFirstRowCount = 2;
EngCalcs.dataColumnsOtherRowsCount = 4;

<?php
echoCookieScript ();
?>
-->
</script>
<?php
echoFooter("EngCalcs");
// Omit last closing tag is good practice
