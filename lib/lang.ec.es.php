<?php

// mail('tom.haws@gmail.com', 'HawsEDC calculators spanish file was accessed', 'HawsEDC calculators spanish file was accessed by '.$_SERVER['REQUEST_URI']);

/**
    * All language is givein in its most complicated case, namely as in a standard sentence.
    * Title case is calculated by the ec-title() function
    * See also these php functions:
    * ucwords() - Uppercase the first character of each word in a string
    * strtoupper() - Make a string uppercase
    * strtolower() - Make a string lowercase
    * ucfirst() - Make a string's first character uppercase
    * mb_convert_case() - Perform case folding on a string
    *
    * Abbreviations:
    * d_ description
    * h_ heading
    * s_ symbol
    * t_ title
    */
// Base words
// Note 2013-09-14 This section was a bad idea.  Too complicated.  Not translateable.  Nightmare.  Phasing out.
$ec_lang['and']="y";
$ec_lang['area']="&aacute;rea";
$ec_lang['bottom']="la base";
$ec_lang['calculate']="calcular";
$ec_lang['calculator']="calculadora";
$ec_lang['calculators']="$ec_lang[calculator]s";
$ec_lang['channel']="canal";
$ec_lang['coefficient']="factor";
$ec_lang['contents']="contenido";
$ec_lang['crest']="cima";
$ec_lang['cumulative']="total";
$ec_lang['depth']="profundidad";
$ec_lang['diameter']="di&aacute;metro";
$ec_lang['engineering']="ingenieria";
$ec_lang['engineers']="ingenieros";
$ec_lang['flow']="gasto";
$ec_lang['formula']="f&oacute;rmula";
$ec_lang['freeOnline']="gratis en l&iacute;nea";
$ec_lang['given']="dado";
$ec_lang['head']="altura de presi&oacute;n";
$ec_lang['headwater']="cabecera";
$ec_lang['height']="altura";
$ec_lang['horizontal']="horizontal";
$ec_lang['hydraulic']="hidr&aacute;ulic";
$ec_lang['hydraulics']="hidr&aacute;ulica";
$ec_lang['incremental']="adicional";
$ec_lang['irregular']="irregular";
$ec_lang['length']="largo";
$ec_lang['loss']="p&eacute;rdida";
$ec_lang['manning']="Manning";
$ec_lang['measurement']="medidas";
$ec_lang['of']="de";
$ec_lang['or']="o";
$ec_lang['pipe']="tuber&iacute;a";
$ec_lang['ponding']="inundaci&oacute;n";
$ec_lang['points']="puntos";
$ec_lang['pressure']="presi&oacute;n";
$ec_lang['radius']="radio";
$ec_lang['ratio']="raz&oacute;n";
$ec_lang['results']="resultados";
$ec_lang['roughness']="rugosidad";
$ec_lang['save']="guardar";
$ec_lang['side']="lado";
$ec_lang['slope']="pendiente";
$ec_lang['system']="sistema";
$ec_lang['to']="a";
$ec_lang['trapezoidal']="trapecial";
$ec_lang['uniform']="uniforme";
$ec_lang['variable']="variable";
$ec_lang['velocity']="velocidad";
$ec_lang['vertical']="vertical";
$ec_lang['weir']="vertedero hidr&aacute;ulico";
$ec_lang['wettedperimeter']="per&iacute;metro mojado";
$ec_lang['width']="anchura";

// Units
// Necessary for calculator units selectors
$ec_lang['u_ft']="pies";
$ec_lang['u_ft2']="pies^2";
$ec_lang['u_fps']="pies/seg.";
$ec_lang['u_ft3ps']="pies^3/seg";
$ec_lang['u_gpm']="galones/minuto";
$ec_lang['u_in']="pulgadas";
$ec_lang['u_in2']="$ec_lang[u_in]^2";
$ec_lang['u_lps']="l/s";
$ec_lang['u_meters']="m";
$ec_lang['u_m2']="m^2";
$ec_lang['u_mgd']="millones de galones por d&iacute;a";
$ec_lang['u_mps']="m/s";
$ec_lang['u_m3ph']="m^3/hr";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mm']="mm";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mph']="millas/hora";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_mh2o']="m H2O";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_psf']="libras/pie^2";
$ec_lang['u_psi']="libra/$ec_lang[u_in2]";
$ec_lang['u_fth2o']="pies H2O";
$ec_lang['u_inh2o']="$ec_lang[u_in] H2O";
$ec_lang['u_s']="seg";
$ec_lang['u_grade']="vert./horiz.";
$ec_lang['u_gradePercent']="% $ec_lang[u_grade]";
$ec_lang['u_depthFrac']="fracci&oacute;n";
$ec_lang['u_depthPercent']="%";

// Symbols
$ec_lang['s_d']="d";
$ec_lang['s_d0']="$ec_lang[s_d]<sub>0</sub>";
$ec_lang['s_hv']="h<sub>v</sub>";
$ec_lang['s_n']="n";
$ec_lang['s_q']="q";
$ec_lang['s_v']="v";

// Combined words
// Not the best idea.  I suggest moving away from them and typing entire phrases.
$ec_lang['bottomWidth']="$ec_lang[width] $ec_lang[of] $ec_lang[bottom]";
$ec_lang['channelSlope']="$ec_lang[slope] $ec_lang[of] $ec_lang[channel] ($ec_lang[vertical] / $ec_lang[horizontal])";
$ec_lang['flowCalculator']="$ec_lang[calculator] $ec_lang[of] $ec_lang[flow]";
$ec_lang['flowDepth']="$ec_lang[depth] $ec_lang[of] $ec_lang[flow]";
$ec_lang['frictionLoss']="Pérdidas por fricción";
$ec_lang['junctionLoss']="Pérdidas en las juntas";
$ec_lang['manningFormula']="la $ec_lang[formula] $ec_lang[of] $ec_lang[manning]";
$ec_lang['sideSlope1']="$ec_lang[slope] $ec_lang[of] $ec_lang[side] 1 ($ec_lang[horizontal] / $ec_lang[vertical])";
$ec_lang['sideSlope2']="$ec_lang[slope] $ec_lang[of] $ec_lang[side] 2 ($ec_lang[horizontal] / $ec_lang[vertical])";

// Page text
// Note: In the process of rearranging the language variables into page order for easier maintenance.
$ec_lang['menu_main_list']=ucfirst("lista de $ec_lang[calculators]");
$ec_lang['menu_main_hydraulics']=ucfirst("$ec_lang[hydraulics]");
$ec_lang['menu_main_language']=ucfirst("lengua");
$ec_lang['menu_sub1_manning']=ucfirst("la $ec_lang[formula] $ec_lang[of] $ec_lang[manning]");
$ec_lang['template_translation_help']="&iquest;Me puede ayudar a traducir esta calculadora a su idioma?  &iquest;Quisiera Ud. poner esta calculadora en su propio sitio web?";
$ec_lang['template_feedback']="Tenga la amabilidad de enviarnos sus comentarios. &iquest;Le fu&eacute; &uacute;til esta calculadora?";
$ec_lang['index_title']=ucfirst("$ec_lang[calculators] $ec_lang[freeOnline] para $ec_lang[engineers]");
$ec_lang['mpf_main_menu']=ucfirst("$ec_lang[flow] $ec_lang[manning] en $ec_lang[pipe]s");
$ec_lang['mpf_main_title']=ucfirst("$ec_lang[calculator] $ec_lang[freeOnline] de $ec_lang[manningFormula] para $ec_lang[flow] en $ec_lang[pipe]s");
$ec_lang['mpf_main_desc']=ucfirst("c&aacute;lculo por $ec_lang[manning] de caudal y $ec_lang[velocity] de $ec_lang[flow] en $ec_lang[pipe]s a $ec_lang[slope] y secci&oacute;n $ec_lang[given]");
$ec_lang['calc_set_units']='Set units:';
$ec_lang['calc_results']=ucfirst("$ec_lang[results]:");
$ec_lang['mpf_pipe_diameter']=ucfirst("$ec_lang[diameter] $ec_lang[of] la $ec_lang[pipe], $ec_lang[s_d0]");
$ec_lang['mpf_manningRoughness']=ucfirst("$ec_lang[roughness] seg&uacute;n $ec_lang[manning], $ec_lang[s_n]");
$ec_lang['mpf_friction_slope']='Pendiente hidraulica (o quiz&aacute;s <a target="_blank" href="/pressureslope.php">?</a> de la tuber&iacute;a), S<sub>0</sub>';
$ec_lang['mpf_depth_ratio']=ucfirst("% llenado de la $ec_lang[pipe] (llena=100% o fracci&oacute;n 1)");
$ec_lang['mpf_flow']=ucfirst("caudal, $ec_lang[s_q]");
$ec_lang['mpf_velocity']=ucfirst("$ec_lang[velocity], $ec_lang[s_v]");
$ec_lang['mpf_velocity_head']=ucfirst("presi&oacute;n (en M.C.As) por velocidad de flujo, $ec_lang[s_hv]");
$ec_lang['mpf_flow_area']=ucfirst("&Aacute;rea del $ec_lang[flow]");
$ec_lang['mpf_wetted_perimeter']=ucfirst("$ec_lang[wettedperimeter]");
$ec_lang['mpf_hydraulic_radius']=ucfirst("$ec_lang[radius] $ec_lang[hydraulic]o");
$ec_lang['mpf_top_width']=ucfirst("ancho de l&aacute;mina libre, T");
$ec_lang['mpf_froude_number']=ucfirst("n&uacute;mero de Froude, F");
$ec_lang['mpf_shear_stress']=ucfirst("tensi&oacute;n tangencial (fuerza de tracci&oacute;n), tau");
$ec_lang['mphl_main_menu']="Pérdida de altura de presión en una tubería según Manning";
$ec_lang['mphl_main_title']=ucfirst("$ec_lang[calculator] $ec_lang[freeOnline] de la $ec_lang[loss] de $ec_lang[head] en una $ec_lang[pipe] seg&uacute;n $ec_lang[manning]");
$ec_lang['mphl_main_desc']='La pérdida de presión en una tubería llena a dado gasto';
$ec_lang['mphl_pipe_length']=ucfirst("$ec_lang[length] $ec_lang[of] la tuber&iacute;a, l");
$ec_lang['mphl_total_junction_k']="Coeficiente total de $ec_lang[loss] en las juntas, k";
$ec_lang['mphl_friction_loss']=ucfirst("$ec_lang[frictionLoss]");
$ec_lang['mphl_junction_loss']=ucfirst("$ec_lang[junctionLoss]");
$ec_lang['mphl_total_loss']='Pérdida total';
$ec_lang['mtc_menu']=ucfirst("$ec_lang[channel] $ec_lang[trapezoidal] seg&uacute;n  $ec_lang[manning]");
$ec_lang['mtc_main_title']=ucfirst("$ec_lang[calculator] $ec_lang[freeOnline] de $ec_lang[manningFormula] para $ec_lang[channel] $ec_lang[trapezoidal]");
$ec_lang['mtc_main_desc']=ucfirst("$ec_lang[flow] $ec_lang[uniform] $ec_lang[manning] en un $ec_lang[channel] $ec_lang[trapezoidal] a $ec_lang[given] $ec_lang[slope] $ec_lang[and] $ec_lang[depth]");
$ec_lang['mtc_bottom_width']=ucfirst("$ec_lang[bottomWidth]");
$ec_lang['mtc_side_slope_1']=ucfirst("$ec_lang[sideSlope1]");
$ec_lang['mtc_side_slope_2']=ucfirst("$ec_lang[sideSlope2]");
$ec_lang['mtc_channel_slope']=ucfirst("$ec_lang[channelSlope]");
$ec_lang['mtc_flow_depth']=ucfirst("$ec_lang[flowDepth]");
$ec_lang['mtc_d50_bottom']='<span title="seg&uacute;n Isbash (1936), Robinson, y Maricopa County, Arizona, US">Tama&ntilde;o de roca requerido en el fondo, D50, Maricopa County</span>';
$ec_lang['mtc_d50_mra']='Tama&ntilde;o de roca requerido, D50, seg&uacute;n Maynord, Ruff, y Abt (1989)';
$ec_lang['mtc_d50_searcy']='Tama&ntilde;o de roca requerido, D50, seg&uacute;n Searcy (1967)';
$ec_lang['mtc_d50_strickler']='Tama&ntilde;o de roca del dise&ntilde;o <a target="_blank" href="javascript:alert(\'La f&oacute;rmula Strickler relata n con D50 por un canal recto y limpio. Ajuste el valor n para que este tama&ntilde;o de roca del dise&ntilde;o sea m&aacute;s grande que el tama&ntilde;o de roca requerido en las siguientes lineas. Luego use tal roca en su dise&ntilde;o.\')">?</a> basado en la dada rugosidad Manning';
$ec_lang['mtc_d50_z1']='<span title="seg&uacute;n Isbash (1936), Robinson, y Maricopa County, Arizona, US">Tama&ntilde;o de roca requerido en el lado 1, D50, Maricopa County</span>';
$ec_lang['mtc_d50_z2']='<span title="seg&uacute;n Isbash (1936), Robinson, y Maricopa County, Arizona, US">Tama&ntilde;o de roca requerido en el lado 2, D50, Maricopa County</span>';
$ec_lang['rrc_main_menu']="Robinson Rock Chute Design";
$ec_lang['rrc_main_desc']="Robinson Rock Chute Design Spreadsheet";
$ec_lang['ws_main_menu']=ucfirst("$ec_lang[weir] sencillo");
$ec_lang['ws_main_title']=ucfirst("$ec_lang[flowCalculator] en un $ec_lang[weir] sencillo de cima ancho");
$ec_lang['ws_main_desc']=ucfirst("$ec_lang[flowCalculator] en un $ec_lang[weir] sencillo de cima ancho");
$ec_lang['ws_weirLength']=ucfirst("$ec_lang[length] $ec_lang[of] $ec_lang[weir], l");
$ec_lang['ws_headWaterHeight']=ucfirst("$ec_lang[height] $ec_lang[of] $ec_lang[headwater], h");
$ec_lang['ws_weirCoefficient']=ucfirst("$ec_lang[coefficient] para el $ec_lang[weir], Cw (Depende del $ec_lang[weir] . Para un $ec_lang[weir] de $ec_lang[crest] ancho, varia desde 2.3 hasta 3.3 para medidas usando pies dependiendo de la anchura del $ec_lang[crest], $ec_lang[depth], y forma de la cara arriba.)");
$ec_lang['ws_notes_heading']='Notes';
$ec_lang['ws_notes_we_term']='Weir Equation';
$ec_lang['wi_menu']=ucfirst("$ec_lang[weir] $ec_lang[irregular]");
$ec_lang['wi_main_title']=ucfirst("$ec_lang[calculator] $ec_lang[freeOnline] para $ec_lang[weir] $ec_lang[irregular], de $ec_lang[depth] $ec_lang[variable] de cima ancho");
$ec_lang['wi_main_desc']=ucfirst("$ec_lang[flowCalculator] para un vertedero irregular de profundidad variable de cima ancho");
$ec_lang['wi_headWaterelevation']=ucfirst("Nivel $ec_lang[of] $ec_lang[headwater]");
$ec_lang['wi_weirPoints']=ucfirst("$ec_lang[points] $ec_lang[of]l $ec_lang[weir]");
$ec_lang['wi_station']="Distancia";
$ec_lang['wi_elevation']="Nivel";
$ec_lang['wi_pondingHeight']=ucfirst("$ec_lang[height] $ec_lang[of] $ec_lang[ponding]");
$ec_lang['wi_incrementalFlow']=ucfirst("$ec_lang[flow] $ec_lang[incremental]");
$ec_lang['wi_cumulativeFlow']=ucfirst("$ec_lang[flow] $ec_lang[cumulative]");
$ec_lang['wi_save_and_calculate']=ucfirst("$ec_lang[save] $ec_lang[and] $ec_lang[calculate]");
$ec_lang['wi_or_adjust']="o";
$ec_lang['wi_n_rows']="el n&uacute;mero de filas";
$ec_lang['wi_notes_we_term']='Weir Equation';
$ec_lang['wi_notes_we_def']='q = si (distancia = 0) entonces 0 o si (slope=0) entoces cw*distancia*d0<sup>1.5</sup> o cw/(2.5*pendiente) * (d0<sup>2.5</sup> - d1<sup>2.5</sup>) donde d1 y d0 son siempre positivos o cero';
$ec_lang['mic_main_desc']=ucfirst("$ec_lang[flowCalculator] $ec_lang[manning] para una secci&#243;n $ec_lang[irregular]");
$ec_lang['contact_title']="Contacto con HawsEDC";
$ec_lang['contactSendMessage']='Env&iacute;e un mensaje a Tom Haws';
$ec_lang['contactYourName']='Su nombre:';
$ec_lang['contactYourEmail']='Su direcci&oacute; de correo electr&oacute;nico:';
$ec_lang['contactSubject']='Asunto:';
$ec_lang['contact_message']='Mensaje:';
$ec_lang['contactSpamPrefix']='Five (cinco) plus (y) one (uno) equals (son) ';
$ec_lang['contactSpamPostfix']='(Favor de escribirla en ingl&eacute;s con letras. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Enviar Mensaje';
?>
