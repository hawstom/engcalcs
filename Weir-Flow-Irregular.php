<?php 
require_once ("../lib/edc.lib.php");
$html_title = $ec_lang['wi_main_title'];
$html_head='
	<meta name="Description" content="'. $html_title .'" />
	<meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?php echo $ec_lang['wi_main_desc'] ?></h2>
<?php echoHelpWanted(); ?>

<form name="formweir" action="javascript:weirCalcs()"  method="post">
	<div>
		<input type="text" style="font-size: 2em; width: 98%" placeholder="Printable Title" /><br />
		<input type="text" style="font-size: 1.5em; width: 98%" placeholder="Printable Subtitle" />
	<input type="text" size="6" name="hw" /> <?=$ec_lang['wi_headWaterelevation']?>, (<?php echo $ec_lang['u_ft'].' '.$ec_lang['or'].' '. 	$ec_lang['u_m'];?>)<br /><br />
	<input type="text" size="6" name="cw" /> <?=$ec_lang['ws_weirCoefficient']?><br /><br />
	<table id="CalcsTable" cellspacing="0" border="1">
		<thead>
			<tr>
				<th colspan="5"><?=$ec_lang['wi_weirPoints']?></th>
			</tr>
			<tr>
				<th><?=$ec_lang['wi_station']?></th>
				<th><?=$ec_lang['wi_elevation']?></th>
				<th width="100pt"><?=$ec_lang['wi_pondingHeight']?></th>
				<th width="100pt"><?=$ec_lang['wi_incrementalFlow']?></th>
				<th width="100pt"><?=$ec_lang['wi_cumulativeFlow']?></th>
			</tr>
		</thead>
		<tbody id="CalcsBody">
		</tbody>
	</table>
	<!-- <input type="text" size="6" name="calcname" /> Calculation name<br /><br /> -->
	<br />
	<input type="submit" name="Submit" value="<?=$ec_lang['wi_save_and_calculate']?>" /> 
	<!--<input type="submit" name="Submit" value="Load and Calculate" /> --> 
	<?=$ec_lang['wi_or_adjust']?> 
	<a href="javascript:addWeirStation('','')">+</a>/<a href="javascript:deleteCalcRow()">-</a> <?=$ec_lang['wi_n_rows']?>
	<br />
	</div>
</form>
<?php echoFeedback(); ?>
<h2><?=$ec_lang['wi_notes']?></h2>
<dl>
<dt><?=$ec_lang['wi_notes_we_term']?></dt><dd><?=$ec_lang['wi_notes_we_def']?></dd>
</dl>
<script type="text/javascript">
// The argument f is not used here.
var weirCalcs = function (f) {
	'use strict';
	var row,
	station0,
	station1,
	elev0,
	elev1,
	d0,
	d1,
	l,
	rise,
	s,
	qi,
	qc = 0,
	cookie;
	// Get the global values and save them to a cookie
	hw = document.formweir.hw.value;
	cw = document.formweir.cw.value;
	cookie= hw+","+cw;

	for (station = 0; station < numCalcRows; station++) {
		// Save the old variables if this is not the first row
		if(station1) {
			station0=station1;
			elev0=elev1;
			d0=d1;
		}
		// Get the input, make the cookie text, and calc and output d1 even for first row
		row = document.getElementById("CalcsBody").getElementsByTagName( 'tr' )[station];
		station1 = row.getElementsByTagName( 'input' )[0].value;
		elev1 = row.getElementsByTagName( 'input' )[1].value;
		d1=Math.max(hw-elev1,0);
		row.getElementsByTagName( 'td' )[2].innerHTML = d1.toFixed(2);
		cookie+= "," + station1 + "," + elev1;
		
		// Do the calcs and output if this is not the first row
		if(station0) {
			l=station1-station0;
			rise=elev1-elev0;
			s=rise/l;
			// Two shorthand "if" statements nested/strung together
			qi = (l==0) ? 0 : (s==0) ? cw*l*Math.pow(d0,1.5) : cw/(2.5*s)*(Math.pow(d0,2.5)-Math.pow(d1,2.5));
			qc = qc + qi
			row.getElementsByTagName( 'td' )[3].innerHTML = qi.toFixed(2);
			row.getElementsByTagName( 'td' )[4].innerHTML = qc.toFixed(2);
		}
	}
	// Save a cookie for next time
	adjustInputWidth(f);
	createCookie("Weir-Flow-Irregular",cookie,36000);
};

var addWeirStation = function (station, elevation) {
	'use strict';
	var arrColumns = [
		{name: 'station',   value: station,   isInput: true},
		{name: 'elevation', value: elevation, isInput: true},
		{name: 'd',         value: null,      isInput: false},
		{name: 'qi',        value: null,      isInput: false},
		{name: 'qc',        value: null,      isInput: false},
	];
	addCalcRow(arrColumns);
};

<!--
// Global variables
var hw, cw, numCalcRows = 0, cookie, cookievars;
cookie=readCookie("Weir-Flow-Irregular");
if(cookie)
	{
	cookievars=cookie.split(",");
	document.formweir.hw.value=cookievars[0];
	document.formweir.cw.value=cookievars[1];

	for (var station=1;station<=cookievars.length/2-1;station++) {
		addWeirStation(cookievars[station*2],cookievars[station*2+1]);
	}
	weirCalcs();
	}
else
	{
	addWeirStation('','');
	addWeirStation('','');
	}
-->
</script>
<?php
echoFooter("main");
?>
