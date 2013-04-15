<?php 
require_once ("../lib/edc.lib.php");
$headerhtml='
	<meta name="Description" content="'.$ec_lang['t_irregularWeirFlowCalculator'].'" />
	<meta name="Keywords" content="wier slanted segmented sloped sloping crest multiple calculation" />
	<title>'.$ec_lang['t_irregularWeirFlowCalculator'].'</title>
';
echoHeader("EngCalcsSEO",$headerhtml);
?>
<h2><?php echo $ec_lang['t_irregularWeirFlowCalculator'] ?></h2>
<p>By Thomas Gail Haws, P.E.</p>

<form name="formweir" action="javascript:weirCalcs()"  method="post">
	<div>
	<input type="text" size="6" name="hw" /> <?=$ec_lang['d_headWaterElevation']?>, (<?php echo $ec_lang['u_ft'].' '.$ec_lang['or'].' '. 	$ec_lang['u_m'];?>)<br /><br />
	<input type="text" size="6" name="cw" /> <?=$ec_lang['d_weirCoefficient']?><br /><br />
	<table id="CalcsTable" cellspacing="0" border="1">
		<thead>
			<tr>
				<th colspan="5"><?=$ec_lang['t_weirPoints']?></th>
			</tr>
			<tr>
				<th><?=ec_title($ec_lang['station'])?></th>
				<th><?=ec_title($ec_lang['elevation'])?></th>
				<th width="100pt"><?=ec_title($ec_lang['t_pondingHeight'])?></th>
				<th width="100pt"><?=$ec_lang['t_incrementalFlow']?></th>
				<th width="100pt"><?=$ec_lang['t_cumulativeFlow']?></th>
			</tr>
		</thead>
		<tbody id="CalcsBody">
		</tbody>
	</table>
	<!-- <input type="text" size="6" name="calcname" /> Calculation name<br /><br /> -->
	<br />
	<input type="submit" name="Submit" value="<?=$ec_lang['t_saveAndCalculate']?>" /> 
	<!--<input type="submit" name="Submit" value="Load and Calculate" /> --> 
	<?=$ec_lang['or']?> 
	<a href="javascript:addStation('','')">+</a>/<a href="javascript:deleteStation()">-</a> <?=$ec_lang['d_number of rows']?>
	<br />
	</div>
</form>
<p><a href="../contact.php"><?=$ec_lang['d_feedbackRequest']?></a></p>
<h2>Notes</h2>
<dl>
<dt>Weir Equation</dt><dd>q = if (length = 0) then 0 else if (slope=0) then cw*length*d0<sup>1.5</sup> else cw/(2.5*slope) * (d0<sup>2.5</sup> - d1<sup>2.5</sup>) where d1 and d0 are always positive or zero</dd>
</dl>
<script type="text/javascript">
<!--
// Global variables
var hw, cw, numStations = 0, cookie, cookievars;
cookie=readCookie("Segmented-Weir-Flow");
if(cookie)
	{
	cookievars=cookie.split(",");
	document.formweir.hw.value=cookievars[0];
	document.formweir.cw.value=cookievars[1];

	for (var station=1;station<=cookievars.length/2-1;station++) {
		addStation(cookievars[station*2],cookievars[station*2+1]);
	}
	weirCalcs();
	}
else
	{
	addStation('','');
	addStation('','');
	}
-->
</script>
<?php
echoFooter("main");
?>