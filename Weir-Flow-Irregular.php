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
<p>By Thomas Gail Haws, P.E.</p>

<form name="formweir" action="javascript:weirCalcs()"  method="post">
	<div>
	<input type="text" size="6" name="hw" /> <?=$ec_lang['wi_headWaterelevation']?>, (<?php echo $ec_lang['u_ft'].' '.$ec_lang['or'].' '. 	$ec_lang['u_m'];?>)<br /><br />
	<input type="text" size="6" name="cw" /> <?=$ec_lang['ws_weirCoefficient']?><br /><br />
	<table id="CalcsTable" cellspacing="0" border="1">
		<thead>
			<tr>
				<th colspan="5"><?=$ec_lang['wi_weirPoints']?></th>
			</tr>
			<tr>
				<th><?=$ec_lang['wi_station']?></th>
				<th><?=$ec_lang['elevation']?></th>
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
	<a href="javascript:addStation('','')">+</a>/<a href="javascript:deleteStation()">-</a> <?=$ec_lang['wi_n_rows']?>
	<br />
	</div>
</form>
<p><a href="../contact.php"><?=$ec_lang['template_feedback']?></a></p>
<h2><?=$ec_lang['wi_or_adjust']?></h2>
<dl>
<dt><?=$ec_lang['wi_or_adjust']?></dt><dd>q = if (length = 0) then 0 else if (slope=0) then cw*length*d0<sup>1.5</sup> else cw/(2.5*slope) * (d0<sup>2.5</sup> - d1<sup>2.5</sup>) where d1 and d0 are always positive or zero</dd>
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