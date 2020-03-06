<?php 
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
$html_title = $ec_lang['mi_main_title'];
$html_head='
    <meta name="Description" content="'. $html_title .'" />
    <meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2><?php echo $ec_lang['mi_main_desc'] ?></h2>

<p>CAUTION! This calculator is in beta state.  Cookies may be unstable.  Next time you visit, your entries may be lost.</p>

<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
    //Inputs
    Array(
        Array('name' => 'ws', 'type' => 'number', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mi_waterSurfaceElevation']),
        Array('name' => 's0', 'type' => 'number', 'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['mtc_channel_slope']),
        Array('name' => 'beta', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mtc_bend_angle']),
        Array('name' => 'sgrock', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mtc_sgrock'])
    ),
    //Results
    Array(
        Array('name' => 'q_sum', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mi_q_sum']),
        Array('name' => 'q_617', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mi_q_617']),
        Array('name' => 'q_618', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mi_q_618']),
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
                <th colspan="17"><?=$ec_lang['mi_xSecPoints']?>
                <a href="javascript:EngCalcs.addSingleCalcRow()">+</a>/<a href="javascript:EngCalcs.deleteSingleCalcRow()">-</a></th>
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
                    <?=$ec_lang['mi_is_bank']?>
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
	<!--<input type="submit" name="Submit" value="Load and Calculate" /> --> 
    <input type="submit" name="Submit" value="<?=$ec_lang['mi_save_and_calculate']?>" />
    </div>

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
<script type="text/javascript">
<!--
EngCalcs.pageCalculator = function (f) {
    'use strict';
    this.Manning.s0 = f['s0'].value / f['s0u'].value;
    this.Manning.beta = f['beta'].value;
    this.Manning.sgrock = f['sgrock'].value;
    ws = f.ws.value;
    var
    // Use unary + to convert form values to numbers
    // so when we add z1 and z2 they don't get concatenated.
    ws = f['ws'].value / f['wsu'].value,
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
    d50_mra;
    this.Manning.ac = 0;
    this.Manning.pwc = 0
    this.Manning.ncompterm617c = 0;
    this.Manning.ncompterm618c = 0;
    this.Manning.qc = 0;
    this.Manning.q617c = 0;
    this.Manning.q618c = 0;

    for (var iStation=0; iStation < this.numCalcRows; iStation++) {
        row = document.getElementById("CalcsBody").getElementsByTagName('tr')[iStation];
        station1 = row.getElementsByTagName( 'input' )[0].value / f['stationu'].value;
        arrStation.push(station1);
        elev1 = row.getElementsByTagName('input')[1].value / f['elevationu'].value;
        arrElev.push(elev1);
        d1=Math.max(ws-elev1,0);
        dmax = Math.max(dmax,d1);
        
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
            this.Manning.ncompterm618c = this.Manning.ncompterm618c + this.Manning.ncompterm618,
            tau = this.Manning.get_tau(dmax);
            d50_mc = this.Manning.get_d50_mc(dmax, Math.abs(1/s));
            d50_mra = this.Manning.get_d50_mra(dmax);
            if (iStation === this.numCalcRows - 1) {
                document.getElementsByName('is_bank')[iStation].checked = true;
                document.getElementsByName('is_bank')[iStation].disabled = true;
            } else {
                document.getElementsByName('is_bank')[iStation].disabled = false;               
            }
            document.getElementsByName('q')[iStation].innerHTML = (this.Manning.q * f['qu'].value).toFixed(2);
            document.getElementsByName('v')[iStation].innerHTML = (this.Manning.v * f['vu'].value).toFixed(2);
            document.getElementsByName('t')[iStation].innerHTML = (this.Manning.t * f['tu'].value).toFixed(2);
            document.getElementsByName('f')[iStation].innerHTML = this.Manning.f.toFixed(2);
            document.getElementsByName('d50_strickler')[iStation].innerHTML = (this.Manning.d50_strickler * f['d50_strickleru'].value).toFixed(2);
            document.getElementsByName('d50_mc')[iStation].innerHTML = (d50_mc * f['d50_mcu'].value).toFixed(2);
            document.getElementsByName('d50_mra')[iStation].innerHTML = (d50_mra * f['d50_mrau'].value).toFixed(2);
            document.getElementsByName('d50_searcy')[iStation].innerHTML = (this.Manning.d50_searcy * f['d50_searcyu'].value).toFixed(2);
            document.getElementsByName('hv')[iStation].innerHTML = (this.Manning.hv * f['hvu'].value).toFixed(2);
            document.getElementsByName('tau')[iStation].innerHTML = (tau * f['tauu'].value).toFixed(2);
            document.getElementsByName('a')[iStation].innerHTML = (this.Manning.a * f['au'].value).toFixed(2);
            document.getElementsByName('pw')[iStation].innerHTML = (this.Manning.pw * f['pwu'].value).toFixed(2);
            document.getElementsByName('rh')[iStation].innerHTML = (this.Manning.rh * f['rhu'].value).toFixed(2);
            if (this.Manning.isBank) {
                this.Manning.closeRegion();
            }
        }
        // Save the old geometry variables
        station0=station1;
        elev0=elev1;
        d0=d1;
    }
    document.getElementById('q_sum').innerHTML = (this.Manning.qc * f['q_sumu'].value).toFixed(2);
    document.getElementById('q_617').innerHTML = (this.Manning.q617c * f['q_617u'].value).toFixed(2);
    document.getElementById('q_618').innerHTML = (this.Manning.q618c * f['q_618u'].value).toFixed(2);
/*  document.getElementById('v').innerHTML = (v * f['vu'].value).toFixed(2);
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

    this.adjustInputWidth(f);
};

var EngCalcs = EngCalcs || {};

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

EngCalcs.Manning = {};

EngCalcs.Manning.c = 1.0;
EngCalcs.Manning.g = 9.806;
EngCalcs.Manning.gammawater = 9806;

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
    this.f = this.v * Math.sqrt(this.t/(this.g * this.a * Math.cos(Math.atan(this.s0))));
    this.ncompterm617 = this.pw*Math.pow(this.n,1.5);
    this.ncompterm618 = this.pw*Math.pow(this.n,2);
    this.c_isbash = (this.beta <= 30) ? 1.2 : 0.86;
    this.d50_strickler = Math.pow(this.n * 21.1, 6); // n = 1/21.1 D ^ (1/6)
    this.d50_searcy = 0.022 * this.v * this.v;
};

EngCalcs.Manning.closeRegion = function () {
    this.pw = this.pwc;
    this.a = this.ac;
    this.n = Math.pow(this.ncompterm617c, (2/3))/Math.pow(this.pwc, (2/3));
    this.recalc();
    this.q617c = this.q617c + this.q;
    this.n = Math.pow(this.ncompterm618c, 0.5)/Math.pow(this.pwc, 0.5);
    this.recalc();
    this.q618c = this.q618c + this.q;
    this.pwc = 0;
    this.ac = 0;
    this.ncompterm617c = 0;
    this.ncompterm618c = 0;
};

// Shear stress depends on y, so we report it for a point and don't store it with the section.
EngCalcs.Manning.get_tau = function (y) {
    return this.gammawater * y * this.s0;
};

EngCalcs.Manning.get_d50_mra = function (y) {
        d50 = 0.031 * Math.pow(this.v, 2.5) / (Math.pow(this.sgrock - 1, 0.25) * Math.pow(y, 0.25) * ((this.beta <= 30) ? 1 : 1.5));
        return d50;
};

EngCalcs.Manning.get_d50_mc = function(y, z) {
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

EngCalcs.wedgeWettedPerimeter = function (depth, slope) {
    return Math.pow(depth*depth+(depth/slope)*(depth/slope), 0.5);
};

EngCalcs.addManningIrregularStation = function (station, elevation, n, isBank) {
    'use strict';
    var arrColumns = [
        {name: 'station',      value: station,   inputType: 'number'},
        {name: 'elevation',    value: elevation, inputType: 'number'},
        {name: 'n',            value: n,         inputType: ((n === null) ? null : 'number')},
        {name: 'is_bank',      value: isBank,    inputType: ((isBank === null) ? null : 'checkbox')},
        {name: 'q',            value: null,      inputType: null},
        {name: 'v',            value: null,      inputType: null},
        {name: 't',            value: null,      inputType: null},
        {name: 'f',            value: null,      inputType: null},
        {name: 'd50_strickler',value: null,      inputType: null},
        {name: 'd50_mc',       value: null,      inputType: null},
        {name: 'd50_mra',      value: null,      inputType: null},
        {name: 'd50_searcy',   value: null,      inputType: null},
        {name: 'hv',           value: null,      inputType: null},
        {name: 'tau',          value: null,      inputType: null},
        {name: 'a',            value: null,      inputType: null},
        {name: 'pw',           value: null,      inputType: null},
        {name: 'rh',           value: null,      inputType: null},
    ];
    this.addCalcRow(arrColumns);
};

EngCalcs.pageAddCalcRow = function () {
    var n,
    isBank;
    if (this.numCalcRows === 0) {
        n = null;
    } else {
        n = 0.030;
    }
    // If first row, don't show bank checkbox.
    if (this.numCalcRows === 0) {
        isBank = null;
    } else {
        isBank = false;
    }
    this.addManningIrregularStation(0, 0, n, isBank);
};

<?php
echoCookieScript ();
?>
-->
</script>
<?php
echoFooter("main");
?>
