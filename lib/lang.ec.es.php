<?php

// All missing text declarations will fall back to English.

// Units
// Necessary for calculator units selectors
$ec_lang['u_ft']="pies";
$ec_lang['u_ft2']="pies^2";
$ec_lang['u_fps']="pies/seg.";
$ec_lang['u_ft3ps']="pies^3/seg";
$ec_lang['u_gpm']="galones/minuto";
$ec_lang['u_in']="pulg.";
$ec_lang['u_in2']="$ec_lang[u_in]^2";
$ec_lang['u_lps']="l/s";
$ec_lang['u_meters']="m";
$ec_lang['u_m2']="m^2";
$ec_lang['u_mgd']="Mgal/d&iacute;a";
$ec_lang['u_mps']="m/s";
$ec_lang['u_m3ph']="m^3/hr";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mm']="mm";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mph']="millas/hora";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_mh2o']="mca";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_psf']="libras/pie^2";
$ec_lang['u_psi']="lb/$ec_lang[u_in2]";
$ec_lang['u_fth2o']="pies H2O";
$ec_lang['u_inh2o']="$ec_lang[u_in] H2O";
$ec_lang['u_s']="seg";
$ec_lang['u_grade']="vert./horiz.";
$ec_lang['u_gradePercent']="% $ec_lang[u_grade]";
$ec_lang['u_depthFrac']="fracci&oacute;n";
$ec_lang['u_depthPercent']="%";

// Page text
// Note: In the process of rearranging the language variables into page order for easier maintenance.

$ec_lang['menu_brand']='Calculadoras HawsEDC';
$ec_lang['menu_main_list']='Lista de calculadoras';
$ec_lang['menu_main_hydraulics']='Hydraulica';
$ec_lang['menu_main_language']='Idioma';
$ec_lang['menu_sub1_manning']='Manning';
$ec_lang['template_translation_help']="&iquest;Me puede ayudar a traducir esta calculadora a su idioma?  &iquest;Quisiera Ud. poner esta calculadora en su propio sitio web?  ";
$ec_lang['template_feedback']="Tenga la amabilidad de enviarnos sus comentarios. &iquest;Le fu&eacute; &uacute;til esta calculadora?";
$ec_lang['template_printable_title']="T&iacute;tulo Imprimible";
$ec_lang['template_printable_subtitle']="Subt&iacute;tulo Imprimible";
$ec_lang['index_title']='Calculadoras para ingenieros gratis en línea';
$ec_lang['calc_set_units']='Cambiar sistema de medidas:';
$ec_lang['calc_results']='Resultados: ';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Darcy-Weisbach Head Loss';
$ec_lang['dw_main_title']='Free Online Darcy-Weisbach Head Loss Calculator';
$ec_lang['dw_main_desc']='Darcy-Weisbach Head Loss at Given Diameter, Roughness, and Flow';
$ec_lang['dw_roughness']='Darcy-Weisbach absolute roughness, e';
$ec_lang['dw_kinematic_viscosity']='Kinematic viscosity, v, in m<sup>2</sup>/sec (1E-6 for clean water at room temperature)';
$ec_lang['dw_reynolds_number']='Número de Reynolds, Re';
$ec_lang['dw_flow_regime']='Régimen del flujo';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='transitional';
$ec_lang['dw_regime_turbulent']='turbulent';
$ec_lang['dw_friction_factor_method']='Método del factor de fricción';
$ec_lang['dw_friction_factor']='Factor de fricción, f';
$ec_lang['dw_friction_slope']='Pendiente de fricción, s<sub>f</sub>';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Gasto Manning en tuberías';
$ec_lang['mpf_main_title']='Calculadora gratis en línea de la fórmula de Manning para gasto en tuberías';
$ec_lang['mpf_main_desc']='Cálculo por Manning de caudal y velocidad de gasto en tuberías a pendiente y sección dado';
$ec_lang['mpf_pipe_diameter']='Diámetro de la tubería, d0';
$ec_lang['mpf_manningRoughness']='Rugosidad según Manning, n';
$ec_lang['mpf_friction_slope']='Pendiente hidraulica (o quiz&aacute;s <a target="_blank" href="/pressureslope.php">?</a> de la tuber&iacute;a), S<sub>0</sub>';
$ec_lang['mpf_depth_ratio']='% llenado de la tubería (llena=100% o fracción 1)';
$ec_lang['mpf_flow']='Caudal, q';
$ec_lang['mpf_velocity']='Velocidad, v';
$ec_lang['mpf_velocity_head']='Presión (en M.C.As) por velocidad de flujo, hv';
$ec_lang['mpf_flow_area']='Sección del tubo';
$ec_lang['mpf_wetted_perimeter']='Perímetro mojado';
$ec_lang['mpf_hydraulic_radius']='Radio hidráulico';
$ec_lang['mpf_top_width']='Ancho de lámina libre, T';
$ec_lang['mpf_froude_number']='Número de Froude, F';
$ec_lang['mpf_shear_stress']='Tensión tangencial (fuerza de tracción), tau';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Pérdida de altura de presión en una tubería según Manning';
$ec_lang['mphl_main_title']='Calculadora gratis en línea de la pérdida de altura de presión en una tubería según Manning';
$ec_lang['mphl_main_desc']='La pérdida de presión en una tubería llena a dado gasto';
$ec_lang['mphl_pipe_length']='Largo de la tubería, l';
$ec_lang['mphl_total_junction_k']='Coeficiente total de pérdida en las juntas, k';
$ec_lang['mphl_friction_loss']='Pérdidas por fricción';
$ec_lang['mphl_junction_loss']='Pérdidas en las juntas';
$ec_lang['mphl_total_loss']='Pérdida total';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Canal trapecial seg&uacute;n  Manning';
$ec_lang['mtc_main_title']='Calculadora gratis en línea de la fórmula de Manning para canal trapecial';
$ec_lang['mtc_main_desc']='Gasto uniforme Manning en un canal trapecial a dado pendiente y profundidad';
$ec_lang['mtc_bottom_width']='Anchura de la base';
$ec_lang['mtc_side_slope_1']='Pendiente de lado 1 (horizontal / vertical)';
$ec_lang['mtc_side_slope_2']='Pendiente de lado 2 (horizontal / vertical)';
$ec_lang['mtc_channel_slope']='Pendiente de canal (vertical / horizontal)';
$ec_lang['mtc_flow_depth']='Profundidad de gasto';
$ec_lang['mtc_d50_bottom']='<span title="seg&uacute;n Isbash (1936), Robinson, y Maricopa County, Arizona, US">Tama&ntilde;o de roca requerido en el fondo, D50, Maricopa County</span>';
$ec_lang['mtc_d50_mra']='Tama&ntilde;o de roca requerido, D50, seg&uacute;n Maynord, Ruff, y Abt (1989)';
$ec_lang['mtc_d50_searcy']='Tama&ntilde;o de roca requerido, D50, seg&uacute;n Searcy (1967)';
$ec_lang['mtc_d50_strickler']='Tama&ntilde;o de roca del dise&ntilde;o <a target="_blank" href="javascript:alert(\'La f&oacute;rmula Strickler relata n con D50 por un canal recto y limpio. Ajuste el valor n para que este tama&ntilde;o de roca del dise&ntilde;o sea m&aacute;s grande que el tama&ntilde;o de roca requerido en las siguientes lineas. Luego use tal roca en su dise&ntilde;o.\')">?</a> basado en la dada rugosidad Manning';
$ec_lang['mtc_d50_z1']='<span title="seg&uacute;n Isbash (1936), Robinson, y Maricopa County, Arizona, US">Tama&ntilde;o de roca requerido en el lado 1, D50, Maricopa County</span>';
$ec_lang['mtc_d50_z2']='<span title="seg&uacute;n Isbash (1936), Robinson, y Maricopa County, Arizona, US">Tama&ntilde;o de roca requerido en el lado 2, D50, Maricopa County</span>';
// Robinson Rock Chute
$ec_lang['rrc_main_menu']='Robinson Rock Chute Design';
$ec_lang['rrc_main_desc']='Robinson Rock Chute Design Spreadsheet';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Vertedero hidráulico sencillo';
$ec_lang['ws_main_title']='Calculadora de gasto en un vertedero hidráulico sencillo de cima ancho';
$ec_lang['ws_main_desc']='Calculadora de gasto en un vertedero hidráulico sencillo de cima ancho';
$ec_lang['ws_weirLength']='Largo de vertedero hidráulico, l';
$ec_lang['ws_headWaterHeight']='Altura de cabecera, h';
$ec_lang['ws_weirCoefficient']='Factor para el vertedero hidráulico, Cw (Depende del vertedero hidráulico . Para un vertedero hidráulico de cima ancho, varia desde 2.3 hasta 3.3 para medidas usando pies dependiendo de la anchura del cima, profundidad, y forma de la cara arriba.)';
$ec_lang['ws_notes_heading']='Notas';
$ec_lang['ws_notes_we_term']='F&oacute;rmula de un vertedero';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Vertedero hidráulico irregular';
$ec_lang['wi_main_title']='Calculadora gratis en línea para vertedero hidráulico irregular, de profundidad variable de cima ancho';
$ec_lang['wi_main_desc']='Calculadora de gasto para un vertedero irregular de profundidad variable de cima ancho';
$ec_lang['wi_headWaterelevation']='Nivel de cabecera';
$ec_lang['wi_weirPoints']='Puntos del vertedero hidráulico';
$ec_lang['wi_station']='Distancia';
$ec_lang['wi_elevation']='Nivel';
$ec_lang['wi_pondingHeight']='Altura de inundación';
$ec_lang['wi_incrementalFlow']='Gasto adicional';
$ec_lang['wi_cumulativeFlow']='Gasto total';
$ec_lang['wi_save_and_calculate']='Grabar y calcular';
$ec_lang['wi_or_adjust']="o";
$ec_lang['wi_n_rows']="el n&uacute;mero de filas";
$ec_lang['wi_notes_we_term']='Weir Equation';
$ec_lang['wi_notes_we_def']='q = si (distancia = 0) entonces 0 o si (slope=0) entoces cw*distancia*d0<sup>1.5</sup> o cw/(2.5*pendiente) * (d0<sup>2.5</sup> - d1<sup>2.5</sup>) donde d1 y d0 son siempre positivos o cero';
// Contact us.
$ec_lang['contact_title']="Contacto con HawsEDC";
$ec_lang['contactSendMessage']='Env&iacute;e un mensaje a Tom Haws';
$ec_lang['contactYourName']='Su nombre:';
$ec_lang['contactYourEmail']='Su direcci&oacute; de correo electr&oacute;nico:';
$ec_lang['contactSubject']='Asunto:';
$ec_lang['contact_message']='Mensaje:';
$ec_lang['contactSpamPrefix']='Five (cinco) plus (y) one (uno) equals (son) ';
$ec_lang['contactSpamPostfix']='(Favor de escribirla en ingl&eacute;s con letras. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Enviar Mensaje';