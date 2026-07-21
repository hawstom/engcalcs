<?php
/**
 *
 * Unit sets let users set all units to defaults for set with one click.
 *
 */
$ec_unit_sets['m'] = Array($ec_lang['u_m'],$ec_lang['u_mps'], $ec_lang['u_m3ps'], $ec_lang['u_m2'], $ec_lang['u_kpa'], $ec_lang['u_npm2'], $ec_lang['u_mh2o'], $ec_lang['u_m3'], $ec_lang['u_kw']);
$ec_unit_sets['mm'] = Array($ec_lang['u_mm'], $ec_lang['u_mps'], $ec_lang['u_lps'], $ec_lang['u_mm2'], $ec_lang['u_pa'], $ec_lang['u_npm2'], $ec_lang['u_mmh2o'], $ec_lang['u_m3'], $ec_lang['u_kw']);
$ec_unit_sets['ft'] = Array($ec_lang['u_ft'], $ec_lang['u_ftps'], $ec_lang['u_ft3ps'], $ec_lang['u_ft2'], $ec_lang['u_psf'], $ec_lang['u_fth2o'], $ec_lang['u_ft3'], $ec_lang['u_kw']);
$ec_unit_sets['in'] = Array($ec_lang['u_in'], $ec_lang['u_ftps'], $ec_lang['u_gpm'], $ec_lang['u_in2'], $ec_lang['u_psi'], $ec_lang['u_inh2o'], $ec_lang['u_ft3'], $ec_lang['u_kw']);
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

$ec_units['m3ps']=1;
$ec_units['lps']=1000;
$ec_units['ft3ps']=35.313;
$ec_units['gpm']=15849;
$ec_units['mgd']=22.822;
$ec_units['mld']=86.4;

$ec_units['m2']=1;
$ec_units['mm2']=1000000;
$ec_units['ft2']=10.764;
$ec_units['in2']=1550;

$ec_units['m3']=1;
$ec_units['ft3']=35.3147;
$ec_units['acft']=0.000811;

$ec_units['mh2o']=1;
$ec_units['mmh2o']=1000;
$ec_units['fth2o']=3.2808;
$ec_units['inh2o']=39.37;
$ec_units['pa']=9806;
$ec_units['kpa']=9.806;
$ec_units['npm2']=9806;
$ec_units['bar']=0.09806;      // 1 m H2O = 0.09806 bar
$ec_units['kgfcm2']=0.1;       // 1 kgf/cm2 = 10 m H2O (Asia pressure norm; Task 134)
$ec_units['psf']=204.82;
$ec_units['psi']=1.4223;

$ec_units['grade']=1;
$ec_units['gradePercent']=100;

$ec_units['depthFrac']=1;
$ec_units['depthPercent']=100;

$ec_units['kw']=0.001;
$ec_units['mw']=0.000001;
$ec_units['hp']=0.001341;

$ec_units['kwh_yr']=1.0;
$ec_units['mwh_yr']=0.001;

$ec_units['lph']=3600000;    // L/hr per m³/s
$ec_units['gph']=951019;     // US gal/hr per m³/s
$ec_units['mmph']=3600000;   // mm/hr per m/s (precipitation rate)
$ec_units['inph']=141732;    // in/hr per m/s

$ec_units['m2ps']=1;         // m²/s (unit discharge, SI base)
$ec_units['ft2ps']=10.7639;  // cfs/ft = ft²/s per m²/s (1 m²/s = 3.28084² ft²/s)