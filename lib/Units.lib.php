<?php
/**
 *
 * Unit sets let users set all units to defaults for set with one click.
 *
 */
$ec_unit_sets['m'] = Array($ec_lang['u_m'],$ec_lang['u_mps'], $ec_lang['u_m3ps'], $ec_lang['u_m2'], $ec_lang['u_kpa'], $ec_lang['u_npm2'], $ec_lang['u_mh2o']);
$ec_unit_sets['mm'] = Array($ec_lang['u_mm'], $ec_lang['u_mps'], $ec_lang['u_lps'], $ec_lang['u_mm2'], $ec_lang['u_pa'], $ec_lang['u_npm2'], $ec_lang['u_mmh2o']);
$ec_unit_sets['ft'] = Array($ec_lang['u_ft'], $ec_lang['u_ftps'], $ec_lang['u_ft3ps'], $ec_lang['u_ft2'], $ec_lang['u_psf'], $ec_lang['u_fth2o']);
$ec_unit_sets['in'] = Array($ec_lang['u_in'], $ec_lang['u_ftps'], $ec_lang['u_gpm'], $ec_lang['u_in2'], $ec_lang['u_psi'], $ec_lang['u_inh2o']);
/**
 *
 * The value of each unit is the number of that unit
 * in the standard SI unit for that quantity.
 *
 */
$ec_units['m']=1;
$ec_units['mm']=1000;
$ec_units['ft']=3.2808;
$ec_units['in']=39.37;

$ec_units['mps']=1;
$ec_units['ftps']=3.2808;
$ec_units['mph']=2.237;

$ec_units['m3ps']=1;
$ec_units['m3ph']=3600;
$ec_units['lps']=1000;
$ec_units['ft3ps']=35.313;
$ec_units['gpm']=15849;
$ec_units['mgd']=22.822;
$ec_units['mld']=86.4;

$ec_units['m2']=1;
$ec_units['mm2']=1000000;
$ec_units['ft2']=10.764;
$ec_units['in2']=1550;

$ec_units['mh2o']=1;
$ec_units['mmh2o']=1000;
$ec_units['fth2o']=3.2808;
$ec_units['inh2o']=39.37;
$ec_units['pa']=9806;
$ec_units['kpa']=9.806;
$ec_units['npm2']=9806;
$ec_units['knpm2']=9.806;
$ec_units['knpcm2']=98060;
$ec_units['bar']=0.0981;
$ec_units['psf']=204.82;
$ec_units['psi']=1.4223;
$ec_units['atm']=0.0968;

$ec_units['grade']=1;
$ec_units['gradePercent']=100;

$ec_units['depthFrac']=1;
$ec_units['depthPercent']=100;
?>
