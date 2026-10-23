<?php

// ñáéíóú All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='fracción';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='pies^2';
$ec_lang['u_ft3ps']='pies^3/seg';
$ec_lang['u_ft']='pies';
$ec_lang['u_fth2o']='pies ca';
$ec_lang['u_ftps']='pies/seg.';
$ec_lang['u_gpm']='gal/min';
$ec_lang['u_gradePercent']='% v/h';
$ec_lang['u_grade']='v/h';
$ec_lang['u_in2']='pulg.^2';
$ec_lang['u_inh2o']='pulg. ca';
$ec_lang['u_in']='pulg.';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='Mgal/día';
$ec_lang['u_imgd']='Mgal imp/día';
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/d';
$ec_lang['u_mh2o']='mca';
$ec_lang['u_mld']='ML/d';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mmca';
$ec_lang['u_mm']='mm';
$ec_lang['u_mps']='m/s';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='lb/pie^2';
$ec_lang['u_psi']='lb/pulg^2';
$ec_lang['u_bar']='bar';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='seg';
$ec_lang['u_hr']='hr';
$ec_lang['u_day']='día';
$ec_lang['u_lph']='L/hr';
$ec_lang['u_gph']='gal/hr';
$ec_lang['u_mmph']='mm/hr';
$ec_lang['u_inph']='pulg./hr';
$ec_lang['u_acft']='ac-ft';
$ec_lang['u_ft3']='pies^3';
$ec_lang['u_m3']='m^3';
$ec_lang['u_kw']='kW';
$ec_lang['u_mw']='MW';
$ec_lang['u_kwh_yr']='kWh/yr';
$ec_lang['u_mwh_yr']='MWh/yr';
$ec_lang['u_hp']='hp';
$ec_lang['u_m2ps']='m^2/s';
$ec_lang['u_ft2ps']='cfs/ft';

// Page text
// In page order for easiest maintenance.
// Menu and General
$ec_lang['menu_brand']='Calculadoras HawsEDC';
$ec_lang['menu_main_hydraulics']='Hidráulica';
$ec_lang['menu_help']='Ayuda';
$ec_lang['menu_libre']='Software libre';
$ec_lang['template_welcome']='Dejad vuestros miedos en la puerta; el amor se habla aquí. No estáis arruinando todo. Disfrutad también <a target="_blank" href="https://hawsedc.com/download.php">las herramientas libres HawsEDC para AutoCAD.</a>';
$ec_lang['template_feedback']='¿Puede sugerir una mejor redacción para este texto, o algo más? ¿Quiere ayudar, o aprender a crear herramientas como estas? Por favor, contácteme.';
$ec_lang['template_printable_title']='Título Imprimible';
$ec_lang['template_printable_subtitle']='Subtítulo Imprimible';
// Consent banner and the two site documents behind it (ROADMAP Task 286). These are UI, not legal
// prose, and they are translated into all 26 languages for one reason: consent that the visitor
// cannot read is not consent. The long-form privacy notice and terms are a separate question --
// English-authoritative, and translated by a human later if at all.
// Edited by TGH 2026-09-07; the word "cookie" approved by TGH 2026-09-09.
// **REWRITTEN 2026-10-08 (Tom, call F01: "Go (random code, new consent text)")**, his draft used
// exactly. The yes now also covers a random browser code (EC_CODE_COOKIE in lib/config.inc.php), so
// "a one-digit cookie" was no longer the whole of what is asked for. The code is what the sentence
// names because it is what the yes newly buys: counting browsers, not only page loads.
//
// EC_CONSENT_VERSION WENT FROM 1 TO 2 WITH IT, because what is stored changed. Everybody who chose
// "Allow this" is asked again; "Allow all" and "Refuse all" are not. The other 26 languages keep
// their old sentence until the next translation sprint, under the same version.
$ec_lang['consent_body']='¿Podemos guardar un código aleatorio en este navegador para contar cuántos navegadores usan cada parte de este sitio? El código se genera en el momento, no dice nada sobre usted ni sobre su dispositivo, y no registra nada de lo que usted escriba. Sin él, no podemos distinguir su segunda visita de la primera visita de otra persona.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Calcula esta red en cada paso de tiempo hidráulico.';
$ec_lang['consent_accept']='Aceptar';
$ec_lang['consent_accept_all']='Aceptar siempre';
$ec_lang['consent_decline']='Rechazar siempre';
$ec_lang['consent_current_granted']='Usted permitió esto. Este navegador conserva un código aleatorio para que podamos contarlo.';
$ec_lang['consent_current_denied']='Usted rechazó esto. No guardamos nada para limitar el registro de este perfil de navegador.';
$ec_lang['consent_region_label']='Su elección sobre el código de conteo.';
$ec_lang['consent_settings_link']='Configuración de cookies';
$ec_lang['privacy_link']='Aviso de privacidad';
$ec_lang['terms_link']='Términos de uso';
$ec_lang['index_main_title']='Calculadoras para ingenieros gratis en línea';
$ec_lang['index_meta_desc_plain']='Calculadoras hidráulicas gratuitas para tuberías, canales, vertederos y riego. Funcionan en su navegador, sin conexión a internet, y están disponibles en 27 idiomas.';
$ec_lang['calc_set_units']='Cambiar sistema de medidas:';
$ec_lang['calc_set_units_tip']='Cambia la unidad de todos los campos a la vez. No destructivo: los números que escribió permanecen exactamente igual, y cada uno ahora se lee en la nueva unidad. Un 6 sigue siendo un 6, pero ahora significa 6 pulgadas en vez de 6 milímetros.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Restaurar valores predeterminados';
$ec_lang['calc_defaults_confirm']='¿Restablecer la calculadora a los valores predeterminados originales?';
$ec_lang['points_data_note']='(o bien Copiar/Pegar usando el área de datos)';
$ec_lang['points_data_heading']='Datos de la calculadora<br />(use Copiar para ver el formato)';
$ec_lang['points_data_points_heading']='Datos de puntos<br />(use Copiar para ver el formato)';
$ec_lang['points_data_copy']='Copiar';
$ec_lang['points_data_paste']='Pegar';
$ec_lang['points_data_msg_line']='No se pegó nada. La línea {n} no se pudo leer como una estación y una elevación.';
$ec_lang['points_data_msg_none']='No se pegó nada. No se encontraron pares de estación y elevación.';
$ec_lang['calc_inputs']='Datos de entrada';
$ec_lang['calc_results']='Resultados:';
$ec_lang['view_hide_line']='Ocultar esta línea';
$ec_lang['view_printable']='Versión Imprimible (recargar/renover para restaurar)';
$ec_lang['ec_name_label']='Guardar este cálculo:';
$ec_lang['ec_name_placeholder']='Nombre';
$ec_lang['ec_name_tip']='Guarda los datos de entrada en la URL para marcapáginas, recuperar del historial y compartir';
$ec_lang['calc_copy_link']='Copiar enlace';
$ec_lang['ec_related_calcs']='Calculadoras relacionadas:';
$ec_lang['calc_copy_link_done']='¡Copiado!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Pérdida de carga en tuberías de Darcy-Weisbach';
$ec_lang['dw_main_title']='Calculadora gratuita en línea de pérdida de carga en tuberías de Darcy-Weisbach';
$ec_lang['dw_main_desc']='Pérdida de carga en tubería a partir del diámetro, la rugosidad y el caudal, según Darcy-Weisbach';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Altura de rugosidad absoluta, e, de la pared de la tubería. Valores típicos: acero (nuevo) 0,046 mm, acero (usado) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, concreto 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s para agua limpia a 20°C">Viscosidad cinemática, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Viscosidad cinemática, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s para agua limpia a 20°C';
$ec_lang['dw_reynolds_number']='Número de Reynolds, Re';
$ec_lang['dw_flow_regime']='Régimen de flujo';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='de transición';
$ec_lang['dw_regime_turbulent']='turbulento';
$ec_lang['dw_friction_factor_method']='Método del factor de fricción';
$ec_lang['dw_friction_factor']='Factor de fricción, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Pérdida de carga en tubería según Hazen-Williams';
$ec_lang['hw_main_title']='Calculadora gratis en línea de pérdida de carga en tubería según Hazen-Williams';
$ec_lang['hw_main_desc']='Pérdida de carga en tubería a partir del diámetro, el coeficiente C de Hazen-Williams y el caudal';
$ec_lang['hw_hgl_1']='LP aguas abajo';
$ec_lang['hw_hgl_2']='LP aguas arriba';
$ec_lang['hw_elev_up']='Cota aguas arriba';
$ec_lang['hw_pressure_up']='Presión aguas arriba';
$ec_lang['hw_elev_down']='Cota aguas abajo';
$ec_lang['hw_pressure_down']='Presión aguas abajo';
$ec_lang['hw_pressure_check']='Verificación de presión';
$ec_lang['hw_pressure_ok_short']='Presión positiva';
$ec_lang['hw_pressure_neg_short']='Presión negativa';
$ec_lang['hw_pressure_neg']='La presión aguas abajo es menor que cero. El HGL queda por debajo de la tubería, por lo que la tubería no fluiría llena y este resultado puede no ser válido.';
$ec_lang['hw_roughness']='Coeficiente de Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Esta calculadora no representa el perfil de la tubería entre los dos extremos.</dt><dd>Usa solo las elevaciones aguas arriba y aguas abajo que usted ingresa. Si el terreno se eleva por encima de cualquiera de los dos extremos en algún punto intermedio, la presión en ese punto alto es menor que cualquier presión indicada aquí. Vuelva a ejecutar la calculadora para el tramo desde el extremo aguas arriba hasta el punto alto para verificarlo.</dd><dd>Donde el HGL queda por debajo de la tubería, el agua está bajo presión negativa. El aire sale de la solución, una tubería de paredes delgadas puede colapsar, y puede ingresar agua subterránea contaminada a través de las juntas. Mantenga la línea bajo presión positiva en todo su recorrido, y considere una válvula de aire en cada punto alto.</dd><dt>La presión aguas arriba es una condición de frontera que usted proporciona.</dt><dd>Léala en un manómetro, en el nivel de agua de un tanque (la altura de agua sobre la tubería), o en la curva de un bombeo. Un bombeo entrega menos presión a medida que aumenta el caudal, así que use el punto de la curva que corresponda al caudal ingresado arriba.</dd><dt>Sume usted mismo los coeficientes de pérdida localizada.</dt><dd>Sume los valores de K de cada válvula, codo, tee, medidor y entrada en la línea, e ingrese ese total. Siga el enlace de ese campo para ver valores típicos. En una línea de conducción larga estas pérdidas son pequeñas frente a la fricción, pero en tuberías cortas dentro de una estación pueden ser la mayor parte de la pérdida.</dd></dl>';
// Manning Irregular
$ec_lang['mi_menu']='Canal irregular de Manning';
$ec_lang['mi_main_title']='Calculadora gratuita en línea de canal irregular de Manning';
$ec_lang['mi_main_desc']='Calculadora de flujo uniforme según Manning para canal de sección irregular';
$ec_lang['mi_waterSurfaceElevation']='Altura de la lámina libre';
$ec_lang['mi_q_617']='<span class="ec-help" title="El caudal compuesto, Q, usando una n compuesta para cada región según Chow 6-17, velocidades iguales">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Puntos de la sección transversal';
$ec_lang['mi_groupPoint']='Punto';
$ec_lang['mi_groupSegment']='Segmento';
$ec_lang['mi_groupRegion']='Región';
$ec_lang['mi_station']='Est.';
$ec_lang['mi_elevation']='Elev.';
$ec_lang['mi_n']='n<br />del seg-<br />mento';
$ec_lang['mi_is_bank']='Div. de<br />regiones<br />R<sub>h</sub> y Q<br />(margen)';
$ec_lang['mi_tau']='Cortante<br />de fondo<br />τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />compuesta';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n compuesta';
$ec_lang['mi_notes_1_def']='Esta calculadora sigue el Manual de Referencia de HEC-RAS para calcular la n compuesta de la región usando Chow 1959, página 136, ecuación 6-17 (no 6-18).';
$ec_lang['mi_notes_3_term']='Errata';
$ec_lang['mi_notes_3_def']='Encontrado y corregido el 23 de agosto de 2026. Un segmento dibujado exactamente vertical — dos puntos en la misma estación, uno encima del otro, que es como se dibuja un canal rectangular, una alcantarilla tipo cajón o un muro de contención — no sumaba perímetro mojado. Los resultados de antes de esa fecha son demasiado altos para cualquier sección con un muro vertical: a un canal de 10 de ancho y 5 de profundidad se le daba un perímetro mojado de 10 en vez de 20, y un caudal de casi 1,6 veces el valor correcto. Un talud inclinado, por pronunciado que fuera, nunca se vio afectado, y tampoco un muro que quedara por encima del agua. Si usó esta página en una sección con un muro vertical, vuelva a ejecutarla.';
$ec_lang['mi_notes_2_term']='Revestimiento de roca';
$ec_lang['mi_notes_2_def']='Use la Calculadora de canal trapecial según Manning para diseñar el revestimiento de roca. Esta calculadora es más adecuada para secciones naturales.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Flujo según Manning en tuberías';
$ec_lang['mpf_main_title']='Calculadora gratis en línea de la fórmula de Manning para flujo uniforme en tuberías';
$ec_lang['mpf_main_desc']='Caudal y velocidad de flujo uniforme en tuberías según Manning, a partir de la pendiente y el calado';
$ec_lang['mpf_pipe_diameter']='Diámetro de la tubería, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Coeficiente de rugosidad de Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Pendiente de fricción, S<sub>f</sub></a><span class="ec-help" title="A veces igual a la pendiente de la tubería. Siga el enlace para la explicación (solo en inglés)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Relación de calados, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Caudal, Q';
$ec_lang['mpf_flow_tip']='El caudal y la profundidad se calculan para una tubería de longitud infinita. Para lograr que este caudal entre en la tubería puede necesitarse una mayor profundidad de agua de entrada. Vea las Notas más abajo para más detalles y un video tutorial.';
$ec_lang['mpf_velocity']='Velocidad, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Energía cinética expresada como altura de columna de agua, v²/2g">Carga de velocidad, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Área de flujo, A';
$ec_lang['mpf_pipe_area']='Área de la tubería, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Relación de áreas, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Perímetro mojado, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Radio hidráulico, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Ancho de lámina libre, T';
$ec_lang['mpf_froude_number']='Número de Froude, Fr';
$ec_lang['mpf_shear_stress']='Esfuerzo cortante medio, τ';
$ec_lang['mpf_full_flow']='Caudal lleno, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Relación de caudales, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Este es el caudal (y la profundidad) dentro de una tubería <em>de longitud infinita</em>.</dt><dd>Lograr que el caudal entre en la tubería puede requerir una profundidad de agua de entrada (cabezal) bastante mayor. Agregue por lo menos 1,5 veces la carga de velocidad para estimar la profundidad de agua de entrada, o <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">vea mi tutorial de 2 minutos</a> sobre los cálculos estándar de cabezal de entrada en alcantarillas usando <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, el programa gratuito de alcantarillas de la Administración Federal de Carreteras de los Estados Unidos.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>¿Está diseñando un alcantarillado sanitario?</dt><dd>Vea las <a target="_blank" href="/sewslope.php">tablas de pendiente mínima de alcantarillado</a> para tuberías de 4 a 96 pulgadas (100 a 2400 mm), expresadas en m/m, mm/m y porcentaje, y el estudio de <a target="_blank" href="/peakfact.php">factores pico para caudales muy bajos</a>. Ambos son documentos de referencia solo en inglés.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Ingrese un Q objetivo positivo.';
$ec_lang['mpf_solver_no_solution']='Sin solución: Q excede la capacidad de la tubería en y/d0 = 93.8% (Qmax = {qmax} en las unidades elegidas).';
$ec_lang['mpf_solve_btn']='Calcular';
$ec_lang['mpf_solve_for_flow']='para caudal, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Pérdida de carga en tubería según Manning';
$ec_lang['mphl_main_title']='Calculadora gratis en línea de pérdida de carga en tubería según Manning';
$ec_lang['mphl_main_desc']='Pérdida de carga en tubería llena a partir del caudal, según la fórmula de Manning';
$ec_lang['mphl_pipe_length']='Longitud, L';
$ec_lang['mphl_area']='Área, A';
$ec_lang['mphl_total_junction_k']='Coeficiente de pérdida localizada (menor), k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Coeficiente de pérdida, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Coeficiente de pérdida localizada (menor), km. Estas pérdidas ocurren en uniones de tubería, entradas, salidas, codos y válvulas — el término "menor" es convencional pero engañoso; en un tramo corto pueden igualar o superar las pérdidas por fricción. Valores típicos de k: entrada de borde vivo 0.5, cada codo de 45° 0.2–0.3, válvula de compuerta (totalmente abierta) 0.1, válvula mariposa 0.2, salida (a un depósito o a la atmósfera) 1.0. Sume todos los accesorios para obtener el km total. El valor predeterminado 2.0 supone una entrada, una salida y dos codos de 45°.';
$ec_lang['mphl_friction_slope']='Pendiente de fricción';
$ec_lang['mphl_friction_loss']='Pérdida por fricción, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Pérdida menor (local), h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Pérdida total, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='LE aguas abajo';
$ec_lang['mphl_egl_2']='LE aguas arriba';
$ec_lang['mphl_hgl_egl_tip']='Este resultado puede no ser válido donde la tubería se eleva por encima de la línea piezométrica.';
$ec_lang['mphl_note_1']='<dl><dt>Esta calculadora no representa el perfil de la tubería entre los dos extremos.</dt><dd>Si el HGL desciende por debajo de la parte superior de la tubería en algún punto, este cálculo puede no ser válido.</dd><dt>Para una entrada abierta (alcantarilla), es necesario verificar las condiciones de control de entrada.</dt><dd>1. El HGL aguas arriba debe estar por encima de la cota de flujo a profundidad normal aguas arriba (¡y por encima de la tubería!).</dd><dd>2. El cabezal de una alcantarilla se representa mejor con el EGL aguas arriba que con el HGL aguas arriba.</dd><dd>3. Véase <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">mi tutorial de 2 minutos</a> para cálculos estándar sencillos de cabezal en alcantarillas usando <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, el programa gratuito de alcantarillas de la Administración Federal de Carreteras de los Estados Unidos.</dd><dd>4. Esta página resuelve solo el caso de control de salida: una tubería que fluye llena, donde las condiciones aguas abajo determinan el cabezal. El diseño de alcantarillas consiste en decidir si predomina el control de entrada o el control de salida, así que use HY-8 siempre que cualquiera de los dos pueda predominar.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Canal trapecial según Manning';
$ec_lang['mtc_main_title']='Calculadora gratis en línea de la fórmula de Manning para canal trapecial';
$ec_lang['mtc_main_desc']='Flujo uniforme Manning en un canal trapecial a partir de pendiente y profundidad';
$ec_lang['mtc_bottom_width']='Anchura de la base, b';
$ec_lang['mtc_side_slope_1']='Pendiente de lado 1, z<sub>1</sub> (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Pendiente de lado 2, z<sub>2</sub> (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Pendiente del canal, S';
$ec_lang['mtc_flow_depth']='Profundidad del flujo, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Ángulo de la curva, β</a><span class="ec-help" title="Para el tamaño de roca. Siga el enlace para ver el diagrama."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Densidad relativa al agua. Valor típico ≈ 2,65 para roca triturada.">Densidad relativa de la roca, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Tamaño de roca de diseño, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n para el tamaño de roca de diseño según Strickler';
// Edited by TGH 2026-09-07
$ec_lang['mtc_n_blodgett']='n para el tamaño de roca de diseño según Blodgett';
$ec_lang['mtc_n_bathurst']='n para el tamaño de roca de diseño según Bathurst';
$ec_lang['mtc_n_pi']='n para el tamaño de roca de diseño (P&I, método de Phillips e Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett frente a Bathurst';
$ec_lang['mtc_pi_range_check']='Verificación de rango P&I';
$ec_lang['mtc_pi_ok']='d50 en rango P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_not_applicable']='N/A';
$ec_lang['mtc_pi_out_of_range']='Fuera de rango';
$ec_lang['mtc_pi_tip']='Extrapolación fuera del rango de datos de 0,28–0,36 ft con el que se desarrolló esta ecuación — trátese como una verificación aproximada, no como base de diseño';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Según Isbash (1936) y el condado de Maricopa, Arizona, EE. UU.">Tamaño de roca angular requerido en el fondo, D<sub>50</sub> (Isbash y MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Según Isbash (1936) y el condado de Maricopa, Arizona, EE. UU.">Tamaño de roca angular requerido en el lado 1, D<sub>50</sub> (Isbash y MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Según Isbash (1936) y el condado de Maricopa, Arizona, EE. UU.">Tamaño de roca angular requerido en el lado 2, D<sub>50</sub> (Isbash y MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Según Maynord, Ruff, y Abt (1989). En una curva, la roca se dimensiona para una velocidad de curva de 4/3 de la media, según el Departamento de Carreteras de California (1970); el valor propio de Maynord de 1.5 se aplica a canales naturales.">Tamaño de roca angular requerido, D<sub>50</sub> (Maynord, Ruff, y Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Tamaño de roca angular requerido, D<sub>50</sub>, según Searcy (1967)';
$ec_lang['mtc_vel_ok']='Velocidad razonable para supuestos de flujo uniforme.';
$ec_lang['mtc_vel_low']='Velocidad baja — riesgo de sedimentación.';
$ec_lang['mtc_vel_high']='La velocidad es elevada y puede no ser realista; verifique la erosión del revestimiento del canal, el tirante adicional en las curvas y la pérdida de energía en expansiones u obstrucciones.';
$ec_lang['mtc_iteration_tip']='Elija una opción de rugosidad (se recomienda B/B, Blodgett–Bathurst) y una opción de tamaño de roca (se recomienda Isbash) para iterar automáticamente hacia un tamaño de roca uniforme para su caudal objetivo. Vea las Notas más abajo para el método completo. Para omitir la iteración, ingrese su propio valor de rugosidad (siga el enlace para más orientación) e ignore el tamaño de roca.';
$ec_lang['mtc_note_1']='<dl><dt>Iteración automática del diseño del tamaño de roca y la rugosidad</dt><dd>Elija una opción de rugosidad (se recomienda B/B, Blodgett–Bathurst) y una opción de tamaño de roca de diseño (se recomienda Isbash). Ajuste la profundidad y el factor de seguridad del tamaño de roca para alcanzar su caudal objetivo con un tamaño de roca uniforme. Cada vez que cambie un valor de entrada, la calculadora repite estos pasos: 1. Se calcula la rugosidad a partir del tamaño de roca de diseño. 2. El valor de rugosidad del método que eligió se copia al campo de entrada de rugosidad. 3. Se calculan el caudal del canal y el tamaño de roca requerido. 4. Se ajusta el tamaño de roca de diseño. 5. Se repiten los pasos hasta que el error en el tamaño de roca de diseño sea muy pequeño.</dd><dt>Calculadora básica (sin iteración)</dt><dd>Ingrese el valor de rugosidad deseado. Ignore el área de entrada del tamaño de roca de diseño.</dd></dl>';
$ec_lang['mtc_note_2_term']='Verificación de velocidad';
$ec_lang['mtc_note_2_def']='La velocidad elevada implica que hubo una caída de elevación considerable que generó una energía específica tan alta. Esa energía puede disiparse rápidamente en expansiones, curvas u obstrucciones. Verifique que esto sea razonable para el sitio.';
$ec_lang['mtc_solver_no_solution']='No se encontró solución para el Q dado con estos datos del canal.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Flujo en Vertedero Simple';
$ec_lang['ws_main_title']='Calculadora gratuita en línea de flujo en vertedero simple de cresta ancha';
$ec_lang['ws_main_desc']='Calculadora de flujo en vertedero simple de cresta ancha';
$ec_lang['ws_weirLength']='Longitud del vertedero, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energía por unidad de peso del agua: una altura de columna de agua, no una presión">Carga, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Coeficiente del vertedero, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Notas';
$ec_lang['ws_notes_we_term']='Ecuación del vertedero';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Flujo en Vertedero Irregular';
$ec_lang['wi_main_title']='Calculadora gratuita en línea de flujo en vertedero irregular, segmentado, de profundidad variable';
$ec_lang['wi_main_desc']='Calculadora de flujo en vertedero irregular';
$ec_lang['wi_weirPoints']='Puntos del vertedero';
$ec_lang['wi_pondingHeight']='Altura de remanso';
$ec_lang['wi_incrementalFlow']='Caudal incremental';
$ec_lang['wi_cumulativeFlow']='Caudal acumulado';
$ec_lang['wi_notes_we_def']='q = si (length = 0) entonces 0 si no si (slope=0) entonces cw*length*d<sub>0</sub><sup>1.5</sup> si no cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) donde d<sub>1</sub> y d<sub>0</sub> son siempre positivos o cero';
// Orifice Flow
$ec_lang['or_main_menu']='Flujo por Orificio';
$ec_lang['or_main_title']='Calculadora gratuita en línea de flujo por orificio';
$ec_lang['or_main_desc']='Flujo por orificio — libre o sumergido';
$ec_lang['or_shape_circular']='Circular';
$ec_lang['or_shape_rectangular']='Rectangular';
$ec_lang['or_diameter']='<span class="ec-help" title="Diámetro para circular; altura para rectangular">Diámetro o altura, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Solo aperturas rectangulares">Ancho, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Fondo de la apertura">Cota de la solera <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Nivel de agua aguas arriba';
$ec_lang['or_twe']='Nivel de agua aguas abajo';
$ec_lang['or_cd']='Coeficiente de descarga, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Elevación del centroide';
$ec_lang['or_head']='<span class="ec-help" title="Energía por unidad de peso del agua: una altura de columna de agua, no una presión">Carga efectiva, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Área de la apertura, A';
$ec_lang['or_regime']='Verificación del régimen de orificio';
$ec_lang['or_regime_valid']='Salida libre';
$ec_lang['or_regime_submerged']='Orificio sumergido';
$ec_lang['or_regime_submerged_tip']='TWE sobre el centroide — el régimen de orificio sigue siendo válido';
$ec_lang['or_regime_warn']='Fuera del régimen de orificio';
$ec_lang['or_regime_warn_tip']='Nivel de agua aguas arriba por debajo de la clave (parte superior) de la apertura';
$ec_lang['or_regime_twe_above_hwe']='Revise los datos';
$ec_lang['or_regime_twe_above_hwe_tip']='Nivel aguas abajo (TWE) sobre el nivel aguas arriba (HWE)';
$ec_lang['or_notes_1_term']='Ecuación de orificio';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Para salida libre: h = HWE − centroide. Para flujo sumergido (TWE sobre la solera): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Régimen de orificio';
$ec_lang['or_notes_2_def']='Las ecuaciones de flujo por orificio se aplican cuando la lámina de agua aguas arriba está sobre la clave (parte superior) de la apertura. Cuando está bajo la clave, use en su lugar una ecuación de vertedero.';
$ec_lang['or_notes_3_term']='Coeficiente de descarga';
$ec_lang['or_notes_3_def']='C<sub>d</sub> varía entre aproximadamente 0,60–0,65 para orificios de borde agudo. Las entradas redondeadas o reentrantes usan valores diferentes. Consulte <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> o el Manual de Referencia Hidráulica de HEC-RAS para orientación.';
$ec_lang['or_notes_4_term']='Sumersión';
$ec_lang['or_notes_4_def']='Cuando TWE está sobre la solera de la apertura, esta calculadora aplica automáticamente la ecuación de orificio sumergido usando h = HWE − TWE. Cuando TWE está en o por debajo de la solera, se asume salida libre y h = HWE − centroide.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Micro-Hidroeléctrica';
$ec_lang['mhp_main_title']='Calculadora Gratuita de Potencia Micro-Hidroeléctrica';
$ec_lang['mhp_main_desc']='Calculadora de potencia de microcentral hidroeléctrica de pasada';
$ec_lang['mhp_gross_head']='Carga bruta, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Diámetro de la tubería de presión (tubería de suministro)">Diámetro de la tubería de presión, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Longitud, L';
$ec_lang['mhp_efficiency']='Eficiencia de la central, η (0–1)';
$ec_lang['mhp_vel_check']='Verificación de velocidad';
$ec_lang['mhp_hl_check']='Verificación de pérdida de carga';
$ec_lang['mhp_hnet']='Carga neta, H<sub>net</sub>';
$ec_lang['mhp_power']='Potencia producida, P';
$ec_lang['mhp_annual_kwh']='P como energía anual';
$ec_lang['mhp_vel_low']='Velocidad baja — riesgo de sedimentación y entrada de aire.';
$ec_lang['mhp_vel_high']='Velocidad elevada — verificar pérdidas de transición, energía disponible y golpe de ariete.';
$ec_lang['mhp_vel_ok_short']='Bien';
$ec_lang['mhp_vel_high_short']='Alto';
$ec_lang['mhp_vel_low_short']='Bajo';
$ec_lang['mhp_vel_ok_tip']='La velocidad está en el rango eficiente para el diseño de la tubería de presión.';
$ec_lang['mhp_hl_ok_tip']='La pérdida de carga es menor al 10% de la carga bruta. Este tamaño de tubería es económico.';
$ec_lang['mhp_hl_warn_tip']='La pérdida de carga supera el 10% de la carga bruta. Considere una tubería más grande.';
$ec_lang['mhp_hl_bad_tip']='La pérdida de carga supera el 20% de la carga bruta. Cambie el tamaño de la tubería.';
$ec_lang['mhp_notes_1_term']='Pérdida de carga';
$ec_lang['mhp_notes_1_def']='La pérdida total en la tubería de presión h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, donde h<sub>f</sub> = f(L/D)(v²/2g) es la pérdida por fricción de Darcy-Weisbach y h<sub>m</sub> = k<sub>m</sub>·v²/2g cubre entradas, codos y válvulas. Carga neta H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Velocidad';
$ec_lang['mhp_notes_2_def']='Verifique que la velocidad sea razonable para el desnivel disponible y el costo de la tubería. Una velocidad muy baja puede indicar sobredimensionamiento; una velocidad muy alta puede aumentar las pérdidas por fricción y el riesgo de golpe de ariete.';
$ec_lang['mhp_notes_3_term']='Objetivo de pérdida de carga';
$ec_lang['mhp_notes_3_def']='Las pérdidas en la tubería de presión (penstock) inferiores al 10% de la carga bruta son generalmente económicas. El equilibrio óptimo entre el costo de la tubería y la potencia perdida suele situarse alrededor del 4–6% cuando el precio de la electricidad está en el extremo alto.';
$ec_lang['mhp_notes_6_term']='Rendimiento';
$ec_lang['mhp_notes_6_def']='El rendimiento típico de la instalación η varía de 0,70 a 0,85 para turbinas Pelton y de flujo cruzado, comunes en microhidroeléctrica. Use 0,75 como estimación inicial conservadora.';
$ec_lang['mhp_notes_7_term']='Energía anual';
$ec_lang['mhp_notes_7_def']='La energía anual supone operación continua a caudal completo (8760 horas/año). La producción real será menor debido a la variación estacional del caudal, paradas por mantenimiento y factor de carga.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Tiempo de vaciado de estanque y tanque';
$ec_lang['odt_main_title']='Calculadora gratuita en línea de tiempo de vaciado de estanque, cuenca y tanque (orificio)';
$ec_lang['odt_main_desc']='Tiempo de vaciado de estanque, cuenca o tanque — salida por orificio, método del volumen cónico';
$ec_lang['odt_h1_elev']='Elevación inicial de la superficie del agua';
$ec_lang['odt_a1']='Área inicial, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Elevación final de la superficie del agua';
$ec_lang['odt_a0']='Área al nivel del orificio, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolada del modelo cónico en la elevación final">Área final, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Verificación de la elevación final';
$ec_lang['odt_h2_ok']='Elevación final sobre la cima del orificio';
$ec_lang['odt_h2_warn']='Elevación final en o por debajo de la cima del orificio';
$ec_lang['odt_h2_warn_tip']='Cima del orificio = centroide + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Diámetro (circular) o altura (rectangular)">Orificio D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Solo rectangular">Ancho del orificio, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Tiempo de vaciado (s)';
$ec_lang['odt_t_min']='Tiempo de vaciado (min)';
$ec_lang['odt_t_hr']='Tiempo de vaciado (hr)';
$ec_lang['odt_t_day']='Tiempo de vaciado (días)';
$ec_lang['odt_notes_1_term']='Fórmula';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) da el tiempo de vaciado desde la carga H hasta el orificio. Tiempo de vaciado = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), donde H<sub>1</sub> = elevación inicial − elevación del orificio, H<sub>2</sub> = elevación final − elevación del orificio.';
$ec_lang['odt_notes_2_term']='Método';
$ec_lang['odt_notes_2_def']='El método del volumen cónico modela el estanque o laguna como una sección cónica entre el área inicial A<sub>1</sub> en la superficie de agua inicial y el área A<sub>0</sub> en la elevación del centroide del orificio. A<sub>2</sub>, el área del estanque en la elevación final, se interpola de A<sub>1</sub> y A<sub>0</sub> usando el modelo de sección cónica. El tiempo de vaciado desde la elevación inicial hasta la final es igual al tiempo total de vaciado desde H<sub>1</sub> hasta el orificio menos el tiempo de vaciado restante desde H<sub>2</sub> hasta el orificio.';
$ec_lang['odt_h1']='<span class="ec-help" title="Elevación inicial de la superficie del agua menos la elevación del centroide del orificio">Carga inicial, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Caudal máximo, Q<sub>max</sub>';
$ec_lang['odt_vol']='Volumen vaciado';
$ec_lang['odt_sketch_start']='Inicio';
$ec_lang['odt_sketch_end']='Fin';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Espaciado de emisores, S<sub>e</sub>';
$ec_lang['ip_sl']='Espaciado de laterales, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emisores por lateral, n<sub>e</sub>';
$ec_lang['ip_n_l']='Laterales por zona, n<sub>l</sub>';
$ec_lang['ip_d']='Lámina de riego objetivo, d';
$ec_lang['ip_a_e']='Área por emisor, A<sub>e</sub>';
$ec_lang['ip_pr']='Tasa de aplicación, PR';
$ec_lang['ip_q_lat']='Caudal por lateral, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Caudal de la zona, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Tiempo de riego (horas)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Pérdida por Infiltración en Canales';
$ec_lang['cs_main_title']='Calculadora gratuita en línea de pérdida por infiltración y eficiencia de conducción en canales';
$ec_lang['cs_main_desc']='Pérdida por Infiltración y Eficiencia de Conducción — Método de Entrada-Salida';
$ec_lang['cs_Q_in']='Caudal de entrada, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Caudal de salida, Q<sub>out</sub>';
$ec_lang['cs_L']='Longitud del tramo, L';
$ec_lang['cs_Q_loss']='Tasa de pérdida por infiltración, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Verificación de medición';
$ec_lang['cs_pct_loss']='Fracción perdida';
$ec_lang['cs_Ec']='Eficiencia de conducción, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Clasificación de eficiencia';
$ec_lang['cs_Vol_day']='Volumen perdido diario';
$ec_lang['cs_Vol_year']='Volumen perdido anual';
$ec_lang['cs_Q_loss_per_L']='Pérdida por unidad de longitud, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Valor del agua';
$ec_lang['cs_lining_cost']='Costo del revestimiento';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Meta de eficiencia de conducción después del revestimiento; fracción 0–1">Objetivo de revestimiento, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Área de revestimiento, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Valor anual perdido';
$ec_lang['cs_annual_value_recovered']='Valor anual recuperado';
$ec_lang['cs_lining_total_cost']='Costo total del revestimiento';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Recuperación simple = costo total del revestimiento ÷ valor anual recuperado">Período de recuperación <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — infiltración detectada';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — sin pérdida medible';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — verifique las mediciones';
$ec_lang['cs_Ec_good']='Buena — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Regular — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Deficiente — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='El método de entrada-salida estima la infiltración midiendo el caudal en la cabecera y la cola de un tramo de canal: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. La eficiencia de conducción E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. El volumen anual supone una operación continua a caudal pleno; la pérdida real es menor en canales de operación estacional o parcial.';
$ec_lang['cs_notes_2_term']='Clasificaciones de Eficiencia';
$ec_lang['cs_notes_2_def']='Canales de tierra sin revestir típicos: E<sub>c</sub> = 60–80%. Canales de tierra bien mantenidos: 75–85%. Canales revestidos de concreto: 90–98%. Las pérdidas por infiltración superiores al 30% del caudal de entrada suelen justificar una inversión en revestimiento. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Recuperación por Revestimiento';
$ec_lang['cs_notes_3_def']='Ingrese el valor del agua y el costo del revestimiento en cualquier moneda consistente. Área de revestimiento = longitud del tramo × perímetro mojado — el perímetro mojado de la sección transversal del canal a la profundidad de flujo medida (ancho de la base más ambos taludes mojados). El valor anual recuperado supone que el canal revestido alcanza la E<sub>c</sub> objetivo de forma continua. La recuperación real será mayor en canales de uso estacional o si el revestimiento no alcanza la eficiencia objetivo.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3.ª ed. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Acerca de';
$ec_lang['install_main_menu']='Instalar';
$ec_lang['install_main_title']='Instalar EngCalcs';
$ec_lang['install_main_desc']='Agregar al dispositivo para uso sin conexión';
$ec_lang['install_intro']='EngCalcs es una aplicación web progresiva (PWA). Una vez instalada, todas las calculadoras funcionan completamente sin conexión a internet.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Abra cualquier página de calculadora en Chrome.</li><li>Toque el botón <strong>⬇ Instalar</strong> en la barra de navegación superior, o toque el menú del navegador (⋮) y elija <strong>Añadir a pantalla de inicio</strong>.</li><li>Toque <strong>Instalar</strong> en el cuadro que aparece.</li><li>EngCalcs aparecerá en su pantalla de inicio y funcionará sin conexión.</li>';
$ec_lang['install_now_btn']='⬇ Instalar ahora';
$ec_lang['install_prompt_unavailable']='El cuadro de instalación no está disponible; use el menú de su navegador.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Abra cualquier página de calculadora en Safari.</li><li>Toque el botón <strong>Compartir</strong> (el cuadro con la flecha hacia arriba).</li><li>Desplácese hacia abajo y toque <strong>Añadir a pantalla de inicio</strong>.</li><li>Toque <strong>Añadir</strong>. EngCalcs aparecerá en su pantalla de inicio.</li>';
$ec_lang['install_ios_note']='En iOS, la instalación siempre se realiza desde el menú Compartir; no existe un cuadro de instalación automático.';
$ec_lang['install_desktop_heading']='Escritorio (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Abra cualquier página de calculadora.</li><li>Haga clic en el <strong>icono de instalación</strong> (⊕ o un icono de equipo) en la barra de direcciones del navegador, o abra el menú del navegador y elija <strong>Instalar EngCalcs…</strong></li><li>Haga clic en <strong>Instalar</strong>. EngCalcs se abrirá como una aplicación independiente.</li>';
$ec_lang['install_firefox_heading']='Firefox / Otros navegadores';
$ec_lang['install_firefox_body']='Si el navegador no ofrece la opción de instalar, use las calculadoras en el navegador como de costumbre. Después de la primera visita, las páginas se guardan en caché automáticamente para uso sin conexión. Firefox en el escritorio es el caso común.';
$ec_lang['install_cached_heading']='Qué se guarda en caché';
$ec_lang['install_cached_body']='La primera vez que instala EngCalcs, todas las páginas de las calculadoras y sus archivos de apoyo (scripts, estilos) se guardan automáticamente en su dispositivo. Después de eso, todo funciona sin conexión a internet. Se recuerda el idioma elegido desde su última visita en línea.';
$ec_lang['contact_main_menu']='Contacto';
$ec_lang['about_main_title']='Acerca de las calculadoras de ingeniería HawsEDC';
$ec_lang['about_main_desc']='Misión, software libre y contribuciones';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Misión</h3><p>Las Calculadoras de Ingeniería HawsEDC se ofrecen gratuitamente en línea desde 2010. Existen para servir a ingenieros y trabajadores de campo en todo el mundo — especialmente a quienes trabajan en regiones con escasez de agua, recursos limitados o poco atendidas. Estas herramientas forman parte de una misión humanitaria más amplia: decirle a cada ser humano de la manera más práctica y efectiva posible <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">que es amado y apreciado para siempre, que no tiene nada que temer y que no va a arruinarlo todo</a>.</p><p>Las calculadoras son el vehículo. El destino es un mundo libre de sufrimiento.</p><h3>Licencia libre y de código abierto</h3><p>Todo el código se publica bajo la <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">Licencia Pública General de GNU v3.0 o posterior</a> — libre como en libertad. Puede usar, estudiar, modificar y redistribuir el código bajo los mismos términos.</p><p>El sitio web que lo sirve se ofrece gratuitamente hoy y desde 2010; si algún día ya no pudiera ser así, el software seguirá siendo suyo para ejecutarlo.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Código Fuente</h3><p>El código fuente completo está disponible públicamente en GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Puede explorar el código, registrar problemas o bifurcar el repositorio allí.</p><h3>Contribuir</h3><p>Toda ayuda es bienvenida. <a href="contact.php">Comuníquese con Tom Haws</a>.</p><ul><li><strong>Traducciones:</strong> Sugiera una mejor redacción. Mejore o agregue un idioma.</li><li><strong>Informes de errores:</strong> Use el formulario de comentarios en cualquier página de calculadora, o registre un problema en GitHub.</li><li><strong>Nuevas calculadoras:</strong> Las ideas para herramientas de ingeniería hidráulica que sirvan a trabajadores de campo y profesionales del riego son especialmente bienvenidas.</li><li><strong>Alojamiento:</strong> Si puede alojar una réplica de estas calculadoras para una región con conectividad limitada, por favor comuníquese conmigo.</li></ul><h3>Uso sin conexión</h3><p>Abra cualquier calculadora una vez mientras tiene conexión y todas seguirán funcionando cuando no la tenga: su navegador almacena todo el conjunto a medida que avanza. El mecanismo es una <strong>Aplicación Web Progresiva (PWA)</strong>. Después de eso, todas las calculadoras funcionan sin conexión — no se requiere internet.</p><p>En Android o iOS, use la opción "Agregar a pantalla de inicio" de su navegador para instalar EngCalcs como una aplicación en su dispositivo. En el escritorio, busque el ícono de instalación en la barra de direcciones de su navegador.</p><p>También puede guardar cualquier calculadora individual usando el menú "Guardar como…" de su navegador para uso sin conexión puntual.</p><h3>Contacto</h3><p>Tom Haws, ingeniero hidráulico y fundador de estas calculadoras.<br />Use el formulario de comentarios en cualquier página de calculadora, o acceda al código fuente en <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Envíe un mensaje a Tom Haws';
$ec_lang['contactYourName']='Su nombre:';
$ec_lang['contactYourEmail']='Su dirección de correo electrónico:';
$ec_lang['contactSubject']='Asunto:';
$ec_lang['contact_message']='Mensaje:';
$ec_lang['contactSpamPrefix']='Five (cinco) plus (y) one (uno) equals (son) ';
$ec_lang['contactSpamPostfix']='(Favor de escribirla en inglés con letras. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Enviar Mensaje';
$ec_lang['contact_success']='Gracias por tomarse el tiempo para escribir.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Diseño de Bajante de Escollera (Robinson)';
$ec_lang['rc_main_title']='Calculadora Gratuita de Diseño de Bajante de Escollera — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimensionamiento de Escollera para Bajante — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Pendiente del fondo del canal, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Caudal por unidad de ancho en la entrada del canal. Para un canal de ancho de plantilla B con caudal total Q, usar q_t = Q / B.">Caudal unitario total, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Porosidad de la escollera, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Densidad relativa al agua. Valor típico para granito triturado o basalto ≈ 2,65. Rango válido de Robinson: 2,54 a 2,82.">Densidad relativa de la roca, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Desviación estándar de gradación. Roca uniforme ≈ 1,25. Rango válido Robinson: 1,15 a 1,47.">Gradación SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="El remanso (Hp > yn) es conveniente porque reduce la erosión aguas arriba. (USDA)">Tirante normal en el canal de entrada, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Ec. 1 (S0 < 0,10) o Ec. 2 (0,10-0,40). Válido: D50 15-278 mm, S0 0,02-0,40. Fuera del rango: extrapolado.">Tamaño mediano de roca requerido, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Ecuación aplicada';
$ec_lang['rc_sg_check']='Verificación de gravedad específica';
$ec_lang['rc_SD_check']='Verificación de gradación SD';
$ec_lang['rc_sg_ok']   ='sg en rango válido';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg por debajo del rango Robinson';
$ec_lang['rc_sg_low_tip']='Rango válido: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg por encima del rango Robinson';
$ec_lang['rc_sg_high_tip']='Rango válido: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD en rango válido';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD por debajo del rango Robinson';
$ec_lang['rc_SD_low_tip']='Rango válido: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD por encima del rango Robinson';
$ec_lang['rc_SD_high_tip']='Rango válido: 1,15–1,47';
$ec_lang['rc_layer']='Espesor de la capa de roca (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Radio de curva en cresta superior (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Longitud de arco en cresta superior';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Requerido para el soporte estructural de la roca del canal. “El tirante mínimo aguas abajo que resulta del tramo de salida y la resistencia del canal aguas abajo es suficiente para garantizar la estabilidad de la escollera en el tramo de salida.” (Robinson)">Longitud del zampeado de salida (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Rugosidad de Manning en el canal, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Fracción de qt que fluye por los poros de la roca. El resto qs fluye por la superficie. np por defecto = 0,45 para roca triturada angular.">Velocidad a través del manto de roca, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Caudal unitario a través del manto, q<sub>m</sub>';
$ec_lang['rc_qs']='Caudal unitario superficial, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Tirante sobre la superficie de escollera, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="El remanso (Hp > yn) es conveniente porque reduce la erosión aguas arriba. (USDA)">Carga en el vertedor de entrada, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Verificación de remanso en entrada';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — remanso aguas arriba';
$ec_lang['rc_pond_ok_tip']='El remanso aguas arriba de la entrada del canal empinado es conveniente; reduce la erosión aguas arriba. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — sin remanso — riesgo de erosión en la entrada';
$ec_lang['rc_pond_warn_tip']='No hay remanso aguas arriba de la entrada del canal; podría producirse erosión aguas arriba. (USDA)';
$ec_lang['rc_eq1']='Ec. 1 (S<sub>0</sub> < 0,10) — pendiente suave';
$ec_lang['rc_eq2']='Ec. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — pendiente pronunciada';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — por debajo del rango de validación Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — por encima del rango de validación Robinson';
$ec_lang['rc_notes_1_term']='Ecuaciones de dimensionamiento de roca';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) desarrollaron dos ecuaciones empíricas para el tamaño mediano de escollera D<sub>50</sub> en función de la pendiente del canal y el caudal unitario. La ecuación 1 se aplica a pendientes suaves (S<sub>0</sub> < 0,10); la ecuación 2 a pendientes pronunciadas (0,10 ≤ S<sub>0</sub> ≤ 0,40). Ambas ecuaciones requieren q<sub>t</sub> en m²/s y devuelven D<sub>50</sub> en mm. El rango validado es 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Caudal unitario';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> es el caudal unitario total en la cresta del canal (caudal total por unidad de ancho). Para un canal de ancho de plantilla B con caudal total Q, q<sub>t</sub> ≈ Q / B, o se calcula a partir de la condición de tirante crítico en la entrada del canal.';
$ec_lang['rc_notes_3_term']='Flujo a través del manto de roca';
$ec_lang['rc_notes_3_def']='Una fracción del caudal total fluye por los poros de la escollera (caudal de manto q<sub>m</sub>); el resto fluye por la superficie de la roca (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). El tirante d se calcula con la ecuación de Manning aplicada al caudal superficial q<sub>s</sub> usando la rugosidad n del canal. La porosidad por defecto n<sub>p</sub> = 0,45 es típica para roca triturada angular.';
$ec_lang['rc_notes_5_term']='Rango válido de tamaño de roca';
$ec_lang['rc_notes_5_def']='Las ecuaciones fueron desarrolladas usando un rango de D<sub>50</sub> de 15 mm a 278 mm. Los resultados fuera de este rango son extrapolados y deben usarse con juicio de ingeniería adicional.';
$ec_lang['rc_notes_6_term']='Cota del zampeado de salida';
$ec_lang['rc_notes_6_def']='La cota de la parte superior de la escollera en el tramo de salida debe estar a la misma cota o por debajo de la plantilla del canal aguas abajo. Si es más alta, la roca de salida será inestable.';
$ec_lang['rc_notes_7_term']='Remanso en la entrada';
$ec_lang['rc_notes_7_def']='Cuando el tirante normal en el canal de entrada es menor que la carga en el vertedor (H<sub>p</sub>) requerida para pasar q<sub>t</sub>, ocurre flujo restringido o remanso aguas arriba de la entrada del canal. Esto es generalmente aceptable — el remanso reduce la velocidad y evita la erosión aguas arriba. Para verificarlo: use una calculadora de flujo de vertedor para hallar H<sub>p</sub> para el q<sub>t</sub> y ancho de cresta dados, y compárelo con el tirante normal del canal de entrada. Si H<sub>p</sub> supera el tirante normal, se producirá remanso.';
$ec_lang['rc_notes_4_term']='Referencia';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., y Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. El USDA ARS también publica una <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">hoja de cálculo Excel</a> basada en el mismo método.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtro';
$ec_lang['rc_sketch_top_crest_curve'] = 'Curva de cresta';
$ec_lang['rc_sketch_outlet_apron']    = 'Zampeado de salida';
$ec_lang['rc_sketch_radius']          = 'radio';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Presión en Riego';
$ec_lang['ip_main_title']='Calculadora Gratuita en Línea de Presión en Riego y Uniformidad de Distribución';
$ec_lang['ip_main_desc']='Presión de Rama de Prueba y Estimación de Uniformidad';
$ec_lang['ip_h_supply']='Presión de suministro';
$ec_lang['ip_elev_supply']='Elevación de suministro, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Caudal de diseño del emisor, q<sub>design</sub>';
$ec_lang['ip_h_design']='Presión de diseño del emisor';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 para emisores estándar sin compensación; cercano a 0 para emisores con compensación de presión">Exponente de descarga del emisor, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Ruta de prueba';
$ec_lang['ip_group_reach']='Tramo';
$ec_lang['ip_group_upstream']='Aguas arriba';
$ec_lang['ip_group_downstream']='Aguas abajo';
$ec_lang['ip_group_loss']='Pérdida';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Marcada: este tramo es un segmento de la lateral de prueba, de la cual extraen agua los emisores individuales. Sin marcar: este tramo es una tubería principal, que solo hace pasar caudal a laterales que no están en la ruta de prueba.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Filas de laterales: emisores en este tramo solo. Filas de tubería principal: total de emisores en laterales OTROS que este que se ramifican desde este tramo. Para el tramo justo en el punto de extracción de la lateral de prueba, esto también incluye cualquier lateral más abajo en la tubería principal más allá de ese punto, o compartiendo la misma unión (p. ej., una lateral del lado opuesto) — su caudal se ramifica desde este mismo tramo también.">Emisores <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Elevación aguas abajo del tramo. Opcional en filas interiores (por defecto plano / igual que el nodo anterior si se deja en blanco). Requerido en la última fila: ese valor es la elevación del último emisor, que directamente establece la presión de suministro requerida.">Elev. abajo <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Elevación del último emisor (última fila) se dejó en blanco y se asumió como plana — ingrese su valor para un resultado preciso';
$ec_lang['ip_press']='Pres.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Pérdida total del tramo, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Presión baja/negativa — verificar condiciones subatmosféricas';
$ec_lang['ip_pressure_warn_short']='Baja';
$ec_lang['ip_pressure_high']='Los puntos de presión alta necesitan reducción de presión';
$ec_lang['ip_pressure_high_short']='Alta';
$ec_lang['ip_max_head']='Presión máx. adm. tubería';
$ec_lang['ip_max_head_tip']='Se marcan los tramos cuya presión supere este valor. Déjelo en blanco para omitir la verificación de alta presión.';
$ec_lang['ip_h_far']='Presión del último emisor';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Caudal que ingresa a la ruta de prueba modelada solo, no a toda la zona/sistema — ver Q_zone en Diseño de Aplicación abajo para el total del sistema.">Caudal de suministro de ruta de prueba, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Caudal del último emisor, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Caudal promedio del emisor (lateral de prueba), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Cuánto más alto (o más bajo) cree que funciona una lateral típica/promedio en comparación con esta lateral de prueba. La lateral de prueba es deliberadamente el caso presumido peor, por lo que su promedio es un sustituto sesgado a la baja para un promedio de campo — dejado en 0, la verificación de uniformidad y los números de diseño de aplicación abajo usan el de la lateral de prueba propio (probablemente optimista) tal cual.">Est. Diferencia de presión, prom. vs. lateral de prueba <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral reevaluado a la presión de cada fila lateral más la diferencia de presión ingresada arriba — un intento de corregir el hecho de que la lateral de prueba sea el caso presumido peor, no uno representativo. Alimenta tanto la verificación de uniformidad como la sección de diseño de aplicación abajo.">Caudal promedio de emisor estimado de campo, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Caudal calculado del último emisor dividido entre el caudal promedio estimado de emisor de campo — esto es una aproximación de la Uniformidad de Distribución del cuarto inferior estándar (promedio del grupo inferior ÷ media poblacional); proviene de una muestra pequeña modelada y una corrección estimada por el usuario, en lugar de una muestra estadística de campo completo. Los valores en o por encima de 1 son posibles y válidos: solo significan que la presión del último emisor está en o por encima del promedio de campo estimado, por lo que algún otro emisor es el punto de menor presión. Esto podría deberse a que el último emisor está en terreno bajo o a que la estimación de Δpresión es demasiado pequeña.">Verificación de uniformidad, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Presión en el emisor de prueba ≥ presión de suministro. Es probable que este no sea el emisor de peor caso, o que las tuberías podrían ser de menor tamaño.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Esto es diferente de nuestra aproximación de la medida de uniformidad estándar.">Caudal del último emisor ÷ caudal de diseño, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Sin solución: la presión de suministro requerida excede la presión de suministro ingresada. Aumente la presión de suministro, reduzca la demanda, o use una tubería más grande.';
$ec_lang['ip_notes_1_def']='Adivina la presión en el último emisor (más remoto), luego recorre la Línea de Grado de Energía hacia el suministro, tramo a tramo, agregando pérdidas por fricción y pérdidas menores en el camino. La elevación y energía cinética se retiran en cada nodo para reportar la presión real ahí. La presión adivinada en el extremo lejano se ajusta (bisección) hasta que la presión de suministro requerida computada coincida con la presión de suministro ingresada — el mismo problema de lazo cerrado que soluciona el resolvedor de flujo de tuberías en la calculadora Manning Pipe Flow, extendido a una red ramificada.';
$ec_lang['ip_notes_2_term']='Tramos de Tubería Principal vs. Lateral';
$ec_lang['ip_notes_2_def']='Cada fila es un tramo en la única ruta hidráulicamente peor (la ruta de prueba) desde el suministro hasta el último emisor. Un tramo de tubería principal solo pasa caudal a laterales no en la ruta de prueba, por lo que su extracción es una multiplicación plana (caudal de diseño × el número total de emisores del tramo) — sin sensibilidad local de presión. La tubería principal es una tubería troncal compartida, por lo que el tramo justo en el punto de extracción de la propia lateral de prueba debe incluir no solo laterales entre sus propios puntos finales sino también cualquier lateral aún más abajo en la tubería principal más allá de ese punto, o compartiendo la misma unión (p. ej., una lateral del lado opuesto) — su caudal viaja a través de ese mismo tramo antes de dividirse, esté o no apareciendo en otro lugar en esta tabla. Un tramo de Lateral es un segmento de la propia lateral de prueba: la descarga del emisor se calcula a partir de la presión local real vía q = k·H<sup>x</sup>, y la pérdida por fricción se reduce por el factor F(n) de Christiansen para contabilizar el caudal disminuyendo conforme cada emisor en el tramo lo extrae.';
$ec_lang['ip_notes_3_term']='Limitaciones';
$ec_lang['ip_notes_3_def']='Modela una presión de suministro fija (sin curva de bomba), una sola ruta de prueba (no el campo completo), y una curva de emisor de 2 parámetros (establezca el exponente cerca de 0 para aproximar un emisor con compensación de presión). Se reportan dos ratios de uniformidad diferentes, mantenidos deliberadamente separados: q<sub>last</sub>/q<sub>avg,field</sub> es una aproximación de la Uniformidad de Distribución del cuarto inferior estándar (promedio del grupo inferior ÷ media poblacional); pero esto proviene de una muestra pequeña modelada y una corrección estimada por el usuario, en lugar de la muestra estadística de campo completo estándar. Además, la lateral de prueba es deliberadamente el caso peor presumido, por lo que su promedio crudo, sin corregir, subestimaría el verdadero promedio de campo y haría que la uniformidad pareciera mejor de lo que es; la entrada de Δpresión existe específicamente para contrarrestar ese sesgo. Los valores de uniformidad en o por encima de 1 aún son posibles: solo significan que la presión del último emisor está en o por encima del promedio de campo estimado, por lo que algún otro emisor es el punto de menor presión. Esto podría deberse a que el último emisor está en terreno bajo o a que la estimación de Δpresión es demasiado pequeña. q<sub>last</sub>/q<sub>design</sub> es una verificación diferente, no de uniformidad, contra el caudal nominal del fabricante — útil para detectar un sistema sobre- o subpresurizado en general, pero es una verificación separada que debe leerse junto con el número de uniformidad, ya que el caudal de diseño/nominal es independiente de la presión operativa media real del sistema.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). "Irrigation by sprinkling." California Agricultural Experiment Station Bulletin 670. Los estándares ASAE/ASABE para diseño de microrriego usan el mismo enfoque de pérdida de fricción multi-salida.';
$ec_lang['ip_notes_5_term']='Diseño de Aplicación';
$ec_lang['ip_notes_5_def']='Tasa de aplicación y caudal de sistema/zona usan el caudal promedio de emisor estimado de campo (q<sub>avg,field</sub> — el promedio de la propia lateral de prueba, corregido por la estimación de diferencia de presión ingresada), no un caudal adivinado: PR = q<sub>avg,field</sub> / A<sub>e</sub>, alimentado por el valor modelado corregido. El espaciado y los números de lateral/emisor de todo el sistema son entradas separadas aquí porque la ruta de prueba solo modela una rama peor caso, no cada lateral en el campo.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Red de tuberías ramificada';
$ec_lang['bpn_main_title']='Calculadora gratuita en línea de presión para redes de tuberías ramificadas (sin bucles)';
$ec_lang['bpn_main_desc']='Caudal y presión en red de tuberías ramificada (en árbol)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Carga estática de suministro: la carga de la fuente con caudal cero. El nivel de agua de un embalse o tanque por encima de la elevación de suministro, o la carga a válvula cerrada de una bomba. Agregue los puntos de suministro 2 y 3 para definir una bomba o una curva de suministro variable; la herramienta lee la carga en el caudal de diseño.';
$ec_lang['bpn_elev_source']='Elevación de suministro';
$ec_lang['bpn_q_total']='Caudal total';
$ec_lang['bpn_q_total_tip']='Caudal total que sale de la fuente (la suma de todas las demandas de la red).';
$ec_lang['bpn_p_min']='Presión mínima';
$ec_lang['bpn_p_min_tip']='La presión aguas abajo más baja en cualquier punto de la red; el punto crítico de entrega.';
$ec_lang['bpn_method']='Método de fricción';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Tramos de tubería';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Nombre de este tramo de tubería. Otros tramos lo referencian en la columna Aguas arriba.';
$ec_lang['bpn_upstream']='ID aguas arriba';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID del tramo que alimenta a este. Déjelo en blanco para seguir el tramo directamente anterior (una tubería en serie simple). Ingrese un ID aquí para ramificarse desde otro tramo.';
$ec_lang['bpn_roughness_tip']='Rugosidad de la tubería para el método de fricción elegido: n de Manning, C de Hazen-Williams, o altura de rugosidad e de Darcy-Weisbach (una longitud). Tubería de plástico lisa típica: n alrededor de 0,009, C alrededor de 150, e alrededor de 0,0015 mm.';
$ec_lang['bpn_demand']='Demanda';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Caudal fijo entregado en el extremo aguas abajo de este tramo.';
$ec_lang['bpn_demand_mult']='Multiplicador de demanda';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Escala todas las demandas de los tramos a la vez, para un caso de hora pico o de crecimiento futuro. Use 1 para las demandas tal como se ingresaron.';
$ec_lang['bpn_elev_down']='Elev. AA';
// Edited by TGH 2026-09-07
$ec_lang['bpn_q_line']='Caudal del tramo';
$ec_lang['bpn_q_line_tip']='Caudal total transportado por este tramo: su propia demanda más toda demanda aguas abajo que alimenta.';
$ec_lang['bpn_p_down']='Pres. AA';
// Edited by TGH 2026-09-07
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Carga de presión manométrica en el nodo aguas abajo de este tramo. Un valor negativo (marcado) indica presión subatmosférica; revise el diseño.';
$ec_lang['bpn_sketch_heading']='Diagrama de la red';
$ec_lang['bpn_source_label']='Fuente';
$ec_lang['bpn_line_problem']='Esta línea no está conectada a la fuente: apunta a un ID de aguas arriba desconocido, se apunta a sí misma, repite un ID que ya usa otra línea, o forma un bucle. Las líneas que no están conectadas quedan sin resolver.';
$ec_lang['bpn_bad_id_short']='ID incorrecto';
$ec_lang['bpn_not_connected_short']='No conectado';
$ec_lang['bpn_dup_id_short']='ID duplicado';
$ec_lang['bpn_pressure_warn']='Presión baja o negativa; revise si hay condiciones subatmosféricas';
$ec_lang['bpn_pressure_warn_short']='Baja';
$ec_lang['bpn_notes_1_term']='En serie por defecto, ramificada por excepción';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Si el ID aguas arriba se deja en blanco, el tramo sigue al tramo anterior como una tubería en serie. Ingrese el ID de un tramo aguas arriba para ramificarse desde él. El valor predeterminado es una tubería en serie; solo se forma un árbol donde se ingresa una ramificación.';
$ec_lang['bpn_notes_2_term']='Solo redes ramificadas, sin bucles';
$ec_lang['bpn_notes_2_def']='Cada tramo tiene exactamente un tramo aguas arriba (un árbol). Esta herramienta no resuelve redes con bucles, que requieren métodos iterativos (EPANET o similar). Como la red no tiene bucles, la solución es directa y exacta.';
$ec_lang['bpn_notes_3_term']='Sin controles de presión activos';
$ec_lang['bpn_notes_3_def']='Puede agregar una válvula de pérdida localizada fija (un valor k), pero no válvulas reductoras o sostenedoras de presión (PRV/PSV). Su estado abierto/cerrado depende del caudal y la presión, lo que forzaría la iteración.';
$ec_lang['bpn_supply2_q']='Caudal de suministro 2';
$ec_lang['bpn_supply2_h']='Carga de suministro 2';
$ec_lang['bpn_supply3_q']='Caudal de suministro 3';
$ec_lang['bpn_supply3_h']='Carga de suministro 3';
$ec_lang['bpn_supply_pt_tip']='Puntos opcionales 2 y 3 de la curva de suministro. Ingrese un caudal y una carga para cada uno para modelar una bomba, o cualquier fuente cuya carga disminuya al entregar más caudal; la herramienta lee la carga en el caudal de diseño. El punto 1 arriba es la carga estática con caudal cero. Deje 2 y 3 en blanco para una carga de embalse constante.';
$ec_lang['bpn_h_supply']='Carga de suministro';
$ec_lang['bpn_h_supply_tip']='Carga de la fuente en el caudal de diseño, leída de la curva de suministro. Es igual a la carga de fuente ingresada cuando la curva es plana (un embalse).';
$ec_lang['bpn_supply1_h']='Carga estática de suministro';
$ec_lang['lpn_main_menu']='Red de Abastecimiento de Agua';
$ec_lang['lpn_main_title']='Modelado gratuito en línea de redes de distribución de agua con el solucionador EPANET';
$ec_lang['lpn_main_desc']='Análisis de redes de abastecimiento de agua: dibuje una red de tuberías mallada o importe archivos de EPANET';
$ec_lang['lpn_title_units']='Unidades {units}';
$ec_lang['lpn_tool_select']='Seleccionar';
$ec_lang['lpn_tool_add_junction']='Nudo';
$ec_lang['lpn_tool_add_reservoir']='Embalse';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Depósito';
$ec_lang['lpn_tool_add_pipe']='Tubería';
$ec_lang['lpn_tool_add_pump']='Bomba';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='Válvula';
$ec_lang['lpn_tool_add_text']='Texto';
// Junction and Pipe (Task 719): Tom's WaterCAD command, a junction, a pipe, a junction, a pipe, until Escape.
$ec_lang['lpn_tool_add_chain']='Cadena de nudos y tuberías';
$ec_lang['lpn_tool_vertices']='Vértices';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='Cliente';
$ec_lang['lpn_tool_add_meter_tip']='Especifique el punto del cliente y luego su conexión: una línea o un nodo. La demanda asignada al cliente se suma al nodo del extremo más cercano de esa línea.';
$ec_lang['lpn_mode_add_meter']='Cliente: especifique dónde está el cliente y luego seleccione la tubería o el nudo que lo abastece. O use Esc para cancelar.';
$ec_lang['lpn_pane_tab_customers']='Clientes';
// The Shape table (Task 779). Closed is a polygon's closure, not a pipe's or valve's status, so it
// is a key of its own and not lpn_field_closed: many languages use different words for the two.
// Points is the column of the Shape's points, "Shape S1, point 2" in lpn_snap_shape_point.
$ec_lang['lpn_pane_tab_shapes']='Figuras';
$ec_lang['lpn_pane_shape_closed']='Cerrada';
$ec_lang['lpn_pane_shape_points']='Puntos';
$ec_lang['lpn_customer_heading']='Cliente {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Demanda por servicio';
$ec_lang['lpn_field_meter_count']='Número de servicios';
$ec_lang['lpn_field_meter_total']='Demanda total';
$ec_lang['lpn_field_meter_total_tip']='Total sumado al nudo indicado abajo.';
$ec_lang['lpn_field_meter_pipe']='Elemento conectado';
$ec_lang['lpn_field_meter_pipe_suggest']='El elemento más cercano es {id}. Escríbalo aquí para abastecer a este cliente desde él.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Conectado a';
$ec_lang['lpn_field_meter_node_tip']='El nudo al que está conectado este cliente. Arrastre el punto de conexión sobre una tubería para abastecerlo en cambio desde una estación a lo largo de esa tubería.';
$ec_lang['lpn_meter_pipe_unknown']='Nada en este proyecto se llama {id}, así que el cliente se dejó donde estaba.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='Ningún patrón de este proyecto se llama {id}, así que el cliente se dejó como estaba.';
$ec_lang['lpn_meter_placed']='Se agregó el cliente {id}. Ingrese su descripción y su demanda en la tabla Clientes, o selecciónelo en el modo Selección para abrir su cuadro de propiedades.';
$ec_lang['lpn_field_meter_pipe_tip']='El elemento al que se conecta este servicio. Escriba otro aquí o en la tabla Clientes para cambiarlo, o arrastre el punto de conexión a otro elemento.';
$ec_lang['lpn_field_meter_station']='Estación a lo largo de la tubería (%)';
$ec_lang['lpn_field_meter_station_tip']='A qué distancia a lo largo de la tubería se conecta el servicio, como porcentaje de la tubería desde su primer nudo hasta el segundo. 0 está en un extremo y 100 en el otro. El círculo sobre la tubería hace lo mismo con el puntero.';
$ec_lang['lpn_field_meter_offset']='Desplazamiento desde la tubería';
$ec_lang['lpn_field_meter_offset_tip']='Positivo es a la derecha de la tubería mirando desde su primer nudo hacia el segundo. Escribir un valor aquí puede mover el cliente al otro lado de la tubería principal, y siempre traza la línea de servicio en ángulo recto con la principal.';
$ec_lang['lpn_field_meter_lumped']='Agregado al nudo';
$ec_lang['lpn_field_meter_lumped_tip']='Nudo más cercano; las demandas de este cliente se suman allí.';
$ec_lang['lpn_node_customers']='Demandas de clientes';
$ec_lang['lpn_node_customers_tip']='Lista de clientes agregados aquí porque este era su nodo más cercano. Las demandas de los clientes se suman a las demás demandas indicadas aquí. Un cliente se edita donde está en el mapa o en la tabla Clientes.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} de Clientes ({n})';
$ec_lang['lpn_customer_detached']='⚠ Este cliente no está conectado a una tubería, así que su demanda no está en los resultados. Elimínelo, o dibuje una tubería y mueva el cliente sobre ella.';
$ec_lang['lpn_customer_fixed_head']='⚠ El extremo cercano de esa tubería tiene una superficie de agua fija, así que esta demanda no afecta la simulación.';
$ec_lang['lpn_customer_node_inactive']='Este cliente está asignado a un nudo que está inactivo en este escenario, por lo que su demanda no forma parte de la solución.';
$ec_lang['lpn_customer_detached_count']='Clientes no conectados a una tubería ({n}). Su demanda no se contabiliza.';
$ec_lang['lpn_meter_pick_pipe']='Ahora seleccione la tubería o el nudo que abastece a este cliente. El cliente permanece donde lo colocó. Presione Escape para cancelar.';
$ec_lang['lpn_inp_export_flat_customers']='Un archivo de EPANET no tiene clientes. La demanda de los clientes de este proyecto ({n}) se escribe como una fila de demanda en el nudo al que está asignado cada cliente, nombrada con el marcador del cliente. El archivo no registra el cliente en sí: su ubicación, la tubería que lo abastece, el punto de esa tubería donde se conecta el servicio, ni cuántos servicios representa. Esa información permanece en el proyecto; guarde el archivo de proyecto para conservarla.';

$ec_lang['lpn_area_hint_window_start']='Especifique una esquina de la ventana.';
$ec_lang['lpn_area_hint_window_go']='Especifique la esquina opuesta para terminar.';
$ec_lang['lpn_area_hint_lasso_start']='Especifique un punto para empezar el contorno.';
$ec_lang['lpn_area_hint_lasso_go']='Mueva el puntero para dibujar el contorno. Especifique el último punto para terminar.';
$ec_lang['lpn_area_hint_polygon_start']='Especifique la primera esquina del área poligonal. Haga doble clic para terminar.';
$ec_lang['lpn_area_hint_polygon_go']='Especifique cada esquina. Haga doble clic en la última para terminar.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Mantenga presionada la tecla Mayús mientras selecciona para continuar con la selección existente, agregando o quitando (alternando) lo que selecciona.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Presione sobre el mapa y arrastre alrededor de lo que desea, luego levante el dedo.';
$ec_lang['lpn_area_hint_touch_go']='Arrastre alrededor de lo que desea, luego levante el dedo para terminar.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Mostrar esto';
$ec_lang['lpn_multi_title']='{n} seleccionados';
$ec_lang['lpn_multi_varies']='Varía';
$ec_lang['lpn_multi_applied']='Se estableció {prop} en {n}.';
$ec_lang['lpn_multi_no_fields']='Estos no tienen nada que se pueda establecer en conjunto aquí.';
$ec_lang['lpn_pane_pasted']='Celdas pegadas ({n}). Celdas sin modificar ({skipped}).';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Filas pegadas ({n}). Filas agregadas a la red ({created}).';
$ec_lang['lpn_pane_pasted_rows_skipped']='Filas pegadas ({n}). Filas agregadas a la red ({created}). Celdas sin modificar ({skipped}).';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Seleccione esta área y pegue filas de una hoja de cálculo para agregarlas.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Pegar como filas nuevas al final de la tabla';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Presione Ctrl+V para agregar las filas copiadas al final de esta tabla. Presione Esc para cancelar.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Filas de este pegado ({n}). Filas que caben en la tabla ({fit}). ¿Agregar las otras filas ({extra}) como filas nuevas al final?';
$ec_lang['lpn_pane_paste_overflow_add']='Agregar filas ({extra})';
$ec_lang['lpn_pane_paste_overflow_fit']='Pegar solo las filas que caben ({fit})';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Filas de este pegado ({n}). Filas que caben en la tabla ({fit}). Las otras filas ({extra}) no se pueden agregar como filas nuevas: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='ID que no coinciden ({n}). ¿Pegar de todos modos?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='No se pegó nada. {reasons}';
$ec_lang['lpn_pane_paste_more']='Filas con problemas no mostradas aquí: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Fila {row}: una fila nueva necesita un ID.';
$ec_lang['lpn_pane_paste_bad_id']='Fila {row}: el ID {id} tiene un espacio o una comilla.';
$ec_lang['lpn_pane_paste_id_taken']='Fila {row}: el ID {id} ya está en uso.';
$ec_lang['lpn_pane_paste_id_twice']='Fila {row}: el ID {id} se usa dos veces en este pegado.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Fila {row}: un nudo nuevo necesita tanto {first} como {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Fila {row}: una línea nueva necesita un nudo Desde y un nudo Hasta.';
$ec_lang['lpn_pane_paste_no_node']='Fila {row}: el nudo {id} todavía no existe. Pegue primero sus nudos y luego sus líneas.';
$ec_lang['lpn_pane_paste_same_ends']='Fila {row}: Desde y Hasta son el mismo nudo.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Fila {row}: {text} no es un {col} válido.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Fila {row}: un Texto nuevo necesita tanto {first} como {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Fila {row}: {id} no es un nudo ni una tubería de esta red todavía. Pegue eso primero, y luego este Texto.';
$ec_lang['lpn_pane_paste_customer_no_position']='Fila {row}: un Cliente nuevo necesita tanto {first} como {second}.';
$ec_lang['lpn_pane_paste_shape_no_points']='Fila {row}: una Figura nueva necesita sus Puntos.';
// {pair} is the Points heading's own pair in this project's axis words: X/Y, N/E or Lat/Lon.
$ec_lang['lpn_pane_paste_shape_bad_points']='Fila {row}: {text} no es una lista de puntos. Escriba cada punto como {pair}, con un punto (.) como separador decimal, y separe los puntos con |.';
$ec_lang['lpn_pane_paste_shape_closed_few']='Fila {row}: una Figura cerrada necesita al menos tres puntos.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Fila {row}: un Cliente nuevo necesita una tubería o un nudo conectado.';
$ec_lang['lpn_pane_paste_no_pipe']='Fila {row}: la tubería {id} todavía no existe. Pegue primero sus tuberías, y luego sus clientes.';
$ec_lang['lpn_pane_paste_no_customer_node']='Fila {row}: el nudo {id} todavía no existe. Pegue primero sus nudos, y luego sus clientes.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Fila {row}: el nudo {id} no tiene ninguna tubería a la que un Cliente pueda conectarse.';
$ec_lang['lpn_pane_filled']='Celdas rellenadas hacia abajo ({n}). Celdas sin modificar ({skipped}).';
$ec_lang['lpn_pane_filldown']='Rellenar hacia abajo';
$ec_lang['lpn_pane_delete_element']='Eliminar elemento';
$ec_lang['lpn_pane_delete_elements']='Eliminar elementos';
$ec_lang['lpn_pane_fill_none']='Nada en esta selección se puede rellenar hacia abajo.';
$ec_lang['lpn_pane_ctrlenter_filled']='Celdas rellenadas ({n}). Celdas sin modificar ({skipped}).';
$ec_lang['lpn_pane_hide_col']='Ocultar esta columna';
$ec_lang['lpn_pane_hide_cols']='Ocultar estas columnas';
$ec_lang['lpn_pane_show_all_cols']='Mostrar todas las columnas';
$ec_lang['lpn_pane_sort_asc']='Ordenar ascendente';
$ec_lang['lpn_pane_sort_desc']='Ordenar de forma descendente';
$ec_lang['lpn_pane_manage_cols']='Administrar columnas…';
$ec_lang['lpn_pane_manage_cols_title']='Administrar columnas';
$ec_lang['lpn_pane_manage_cols_show']='Mostrar';
$ec_lang['lpn_pane_manage_cols_up']='Subir';
$ec_lang['lpn_pane_manage_cols_down']='Bajar';
$ec_lang['lpn_pane_manage_cols_top']='Mover al principio';
$ec_lang['lpn_pane_manage_cols_bottom']='Mover al final';
$ec_lang['lpn_pane_manage_cols_width']='Ancho (em)';
$ec_lang['lpn_pane_width_tip']='Los anchos de columna se guardan en este navegador, no en el proyecto. Haga doble clic en el divisor de una columna para restaurar el ancho predeterminado.';
$ec_lang['lpn_pane_colmenu_tip']='Ocultar o administrar columnas';
$ec_lang['lpn_tool_area_window']='Seleccionar una ventana';
$ec_lang['lpn_tool_area_lasso']='Seleccionar un lazo';
$ec_lang['lpn_tool_area_polygon']='Seleccionar un polígono';
$ec_lang['lpn_tool_delete']='Eliminar';
$ec_lang['lpn_tool_zoom_extent']='Ver todo';
$ec_lang['lpn_tool_zoom_selection']='Zoom a la selección';
$ec_lang['lpn_tool_zoom_window']='Ventana de zoom';
$ec_lang['lpn_zoom_in']='Acercar';
$ec_lang['lpn_zoom_out']='Alejar';
$ec_lang['lpn_new_text']='Texto';
$ec_lang['lpn_field_text_bold']='Texto en negrita';
// Justification for a Text object (Task 342). **The standard terms, and nothing invented** (Tom,
// 2026-08-17: "standard English usage would be better... Horizontal justification and Vertical
// justification; you don't even have to mention the anchor point").
//
// **NO SYNONYM ENTRY, and the reason is a rule rather than an omission** (Tom, 2026-08-18: "no syn.
// It's a technical term. We can only give a definition, which is not our job."). A plain sentence
// (dev/plain-sentences.md, then $ec_lang_syn) holds phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
// alternatives, and what a first draft put there was a definition wearing a synonym's clothes.
// The Text table's own column naming what a Text is attached to (a node or a link ID), read-only:
// attaching and detaching are map gestures, never a typed rename.
$ec_lang['lpn_field_text_anchor']='Vinculado a';
$ec_lang['lpn_field_text_align']='Alineación horizontal';
$ec_lang['lpn_field_text_align_left']='Izquierda';
$ec_lang['lpn_field_text_align_center']='Centro';
$ec_lang['lpn_field_text_align_right']='Derecha';
$ec_lang['lpn_field_text_valign']='Alineación vertical';
$ec_lang['lpn_field_text_valign_top']='Arriba';
$ec_lang['lpn_field_text_valign_middle']='Medio';
$ec_lang['lpn_field_text_valign_bottom']='Abajo';
$ec_lang['lpn_field_text_rotation']='Ángulo (grados)';
$ec_lang['lpn_field_text_match_pipe']='Gire hasta el ángulo de la línea más cercana';
$ec_lang['lpn_field_text_flip']='Girar 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Elemento adjunto';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Este texto se colocó lo bastante cerca de un elemento como para seguirlo, así que se mueve con ese elemento y tiene una línea guía. Un texto con línea guía toma su alineación horizontal y vertical del lado en el que se apoya, por lo que esas dos filas no se ofrecen mientras está adjunto.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Coeficiente de emisor';
$ec_lang['lpn_field_emitter_tip']='Un caudal adicional que depende de la presión, para un aspersor, una salida abierta o una fuga modelada. El caudal que libera es este coeficiente multiplicado por la presión elevada al exponente del emisor, que se establece una sola vez para toda la red en Configuración, Cálculo, Hidráulica. Déjelo en blanco en un nudo ordinario.';
$ec_lang['lpn_field_elev']='Elevación';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of a plain-sentence
// entry carrying translatable payload nobody on the page can see.
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='Carga';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='Nivel de la superficie del agua en el embalse, medido como una altura, no como una presión. Déjelo en blanco para colocar la superficie del agua en la elevación del embalse.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
// A tank has two elevations (Tom, 2026-10-11): Elevation is the ground, the pressure datum as at a
// junction; Base elevation is the tank bottom, EPANET's [TANKS] Elevation, from which depth and
// volume are measured.
$ec_lang['lpn_field_tank_base_elev']='Elevación del fondo';
$ec_lang['lpn_field_tank_base_elev_tip']='Elevación del fondo del depósito, desde la cual se miden la profundidad de agua y el volumen. Si se deja en blanco, el fondo está a la elevación del terreno.';
$ec_lang['lpn_tank_ground_elev_tip']='Elevación del terreno en el depósito. La presión en el depósito se mide desde aquí, como en un nudo.';
$ec_lang['lpn_field_tank_level']='Profundidad de agua';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Profundidad del agua que hay en el depósito, medida hacia arriba desde el fondo del depósito. La superficie del agua es la elevación del fondo del depósito más esta profundidad.';
$ec_lang['lpn_field_tank_minlevel']='Profundidad de agua mínima';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Profundidad de agua a la que el depósito se trata como vacío, medida hacia arriba desde el fondo del depósito.';
$ec_lang['lpn_field_tank_maxlevel']='Profundidad de agua máxima';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Profundidad de agua a la que el depósito se considera lleno, medida hacia arriba desde el fondo del depósito.';
$ec_lang['lpn_field_tank_diameter']='Diámetro del depósito';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Ancho del depósito de lado a lado. Está en las mismas unidades que la elevación, no en las unidades de diámetro de tubería. Determina cuánta agua contiene una profundidad dada.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Elevación de la superficie del agua en el depósito: la elevación del fondo más la profundidad de agua.';
$ec_lang['lpn_close']='Cerrar';
// The corner buttons beside every standing box's X (Task 441). Each is an icon-only button, so the
// value is its name: the hover tip and the screen reader's label at once. Auto-hide is a toggle and
// says its state through aria-pressed, so one wording serves both states (AutoCAD's own word).
$ec_lang['lpn_dock_left']='Acoplar a la izquierda del mapa';
$ec_lang['lpn_dock_right']='Acoplar a la derecha del mapa';
$ec_lang['lpn_dock_float']='Flotante';
$ec_lang['lpn_dock_autohide']='Ocultar automáticamente';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Propiedades';
// What a docked Properties box says while nothing is selected: it stays in its dock (Tom, 2026-10-07).
$ec_lang['lpn_popup_none']='No hay nada seleccionado. Seleccione un elemento del mapa para ver sus propiedades.';
$ec_lang['lpn_empty_hint']='Use Archivo, Nuevo proyecto para abrir un ejemplo. O comience agregando un embalse, un nudo y una tubería desde la barra de herramientas.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Su red está intacta.';
// The examples gallery (ROADMAP Task 314). lpn_empty_hint above is no longer rendered by the page
// -- the empty canvas shows the gallery instead -- but the key is KEPT rather than deleted while
// the gallery is new: it is the fallback sentence if the manifest cannot be fetched, and deleting
// a key translated into 26 languages to get it back a week later is the expensive direction.
// **THE ENGINE CLAUSE IS GONE FROM THIS BANNER** (Task 605, Tom 2026-09-06: *"No more banner about
// the EPANET solver."*). It read "with the EPANET solver" and was, under Task 222, the one place
// this page said what engine it runs. EPANET is now simply what solves, so a banner announcing it
// advertises a choice the visitor is no longer being asked to make. The gallery keeps its welcome;
// lpn_main_title still names EPANET, which is where a search engine reads it, and that claim is
// true and stays.
$ec_lang['lpn_examples_welcome']='Bienvenido al modelado de redes de abastecimiento de agua';
$ec_lang['lpn_examples_heading']='Abra una copia de un ejemplo';
$ec_lang['lpn_examples_sub']='Cada ejemplo se abre como una copia. Edítela y guárdela, o abra una copia nueva para empezar de nuevo.';
$ec_lang['lpn_examples_open']='Abrir';
$ec_lang['lpn_examples_menu']='Abrir ejemplo…';
$ec_lang['lpn_examples_blank']='O empiece aquí';
// The SAME exit, worded for the other way in, is lpn_close (Task 699 merged its own 'Close' key
// into it). Opened from File the user already has work on screen, so "start with a blank map"
// reads as "discard it" and they do not dare press the only button that leaves (Tom, 2026-08-17:
// "I can't back out of the gallery... I am forced to open an example"). Closing never touches a
// project either way.
$ec_lang['lpn_examples_size']='Nodos: {nodes}, líneas: {links}';
$ec_lang['lpn_examples_failed']='No se pudieron cargar los ejemplos. Use Archivo, Nuevo proyecto para empezar un dibujo.';
$ec_lang['lpn_examples_loading']='Cargando ejemplos…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Corregir algo';
$ec_lang['lpn_help_notes']='Notas sobre esta página';
$ec_lang['lpn_guide_about_heading']='Acerca de esta calculadora';
$ec_lang['lpn_guide_group_from']='Desde {menu}';
$ec_lang['lpn_guide_menu_named']='Menú {menu}';
// **THE NEW BOX, TASK 745** (Tom, 2026-09-29: reorganize Help into three groups, with a new
// "Tables and Hotkeys" box gathering all table help and all keyboard shortcuts). One key names
// both the Help row and the box's own title bar, the same pattern lpn_help_notes already carries
// for the Notes box.
$ec_lang['lpn_help_hotkeys']='Tablas y atajos de teclado';
// **THE USER GUIDE** (Tom, 2026-10-06: "Maybe items 2 and 3 combined into a simple User Manual or
// whatever the 2026 thing is?"; Ida's design). Names both the Help row and the box's title bar. It
// replaces lpn_help_hotkeys and the Help > Toolbar fly-out (lpn_help_icons, which still heads the
// box's Toolbar section).
$ec_lang['lpn_help_manual']='Manual del usuario';
// The Guide's contents rail, its search, its Boxes section and the "?" in every box's title bar.
$ec_lang['lpn_guide_contents']='Contenido';
$ec_lang['lpn_guide_rail_hide']='Ocultar contenido';
$ec_lang['lpn_guide_rail_show']='Mostrar contenido';
$ec_lang['lpn_guide_search']='Buscar en el manual del usuario';
$ec_lang['lpn_guide_boxes_heading']='Cuadros';
$ec_lang['lpn_guide_boxes_intro']='Cada cuadro se puede mover, cambiar de tamaño, acoplar a la izquierda o a la derecha del mapa, o cerrar. El ? en la barra de título de un cuadro abre su ayuda.';
// Tom's own wording, 2026-10-07 (his typo "to not" corrected). Below lpn_guide_boxes_intro.
$ec_lang['lpn_guide_boxes_autohide']='Cuando el puntero sale, un cuadro sin foco se oculta tras una breve demora. Un cuadro con foco se oculta cuando se hace clic fuera de él, se presiona Esc, o se sale de él con Tab mientras el puntero está en otra parte.';
$ec_lang['lpn_guide_box_help']='Ayuda de este cuadro';
// A Boxes entry whose box shares its name with a section of the Guide ("Screenshot"), in the Guide
// only, so its Contents list does not show one word twice. Keep {box} as it is.
$ec_lang['lpn_guide_box_named']='Cuadro {box}';
// Above the Toolbar rows, shown only while some are dimmed (on a phone, or Calculate while
// Recalculate automatically is on): a grey name otherwise reads as a disabled button.
$ec_lang['lpn_guide_dimmed']='Un nombre atenuado es un botón que está oculto por ahora en la barra de herramientas.';
// One entry in the Guide's Boxes section for each box, shown by the "?" in its title bar. Fire flow,
// Critical assets, and Demand scaling carry theirs in lpn_ff_intro and the keys that follow it.
$ec_lang['lpn_guide_text_popup']='Muestra las propiedades del elemento seleccionado, del texto o del cliente, o de varios elementos seleccionados. El cuadro se abre junto a la selección o donde se movió por última vez. Un valor editado cambia la red de inmediato, y la etiqueta del elemento en el mapa y el panel Tablas se actualizan. Los resultados calculados se muestran en filas de solo lectura y no se pueden editar.';
$ec_lang['lpn_guide_text_find_popup']='Encuentra los elementos que cumplen una condición, como todas las tuberías menores de 8 in o todos los nudos por debajo de 40 psi, y puede cambiar una propiedad en todos ellos en una sola operación. Úselo para revisar un modelo antes de resolverlo (una elevación faltante, un diámetro ingresado en la unidad equivocada), para enumerar los puntos problemáticos después de resolverlo (presión baja, velocidad alta) y para hacer una misma corrección en muchos elementos.\n\nLas listas Qué buscar, Propiedad, Condición y Valor construyen una condición y la escriben como una línea de texto en el cuadro Consulta. La línea también se puede editar directamente, y las listas la siguen. Una consulta que las listas no pueden expresar, como dos condiciones unidas con O, oculta las listas hasta que se presiona el botón Usar los controles en su lugar. Para buscar, presione Enter en el cuadro Consulta o presione el botón Buscar.';
$ec_lang['lpn_guide_text_settings_box']='Contiene la configuración del proyecto abierto y de este navegador, organizada en secciones. Elija Agua, Configuración para abrirlo. Dos botones, Restaurar valores predeterminados y Empezar de nuevo, la restablecen. El cuadro permite buscar: escriba una o más palabras en Buscar en la configuración para enumerar solo las opciones que mencionan todas ellas. La posición y el tamaño de este cuadro se conservan solo en este navegador.';
$ec_lang['lpn_guide_text_library_box']='Contiene los patrones, curvas, tipos de tubería, listas de accesorios, controles y reglas del proyecto, una sección para cada uno. Elija Agua, Bibliotecas para abrirlo. Un elemento hace referencia a un patrón, curva, tipo de tubería o lista de accesorios por el ID de ese ítem, y el ítem se crea, edita y elimina aquí. Todo se guarda con el proyecto, y Deshacer revierte una edición hecha aquí. La posición y el tamaño del cuadro se conservan solo en este navegador.';
$ec_lang['lpn_guide_text_energy_box']='Informa el consumo de energía, la potencia máxima y el costo de cada bomba durante la última simulación de período extendido, usando la eficiencia de cada bomba y el precio de la energía fijado en Configuración, Energía. Requiere un Tiempo total de simulación en Configuración y una red resuelta. No cambia la red.';
$ec_lang['lpn_guide_text_contour_box']='Controla el gráfico de contornos dibujado en el mapa a partir del valor de nudo elegido en Colorear nodos por: el esquema de colores, el relleno y su opacidad, el intervalo de las curvas de nivel y sus etiquetas, y hasta dónde llega el color desde cada tubería. Desactivarlo oculta el gráfico y deja los colores de los nodos. Cambia solo la visualización, no la red.';
$ec_lang['lpn_guide_text_scncmp_box']='Resuelve cada escenario marcado en el Administrador de escenarios, todos ellos salvo que se hayan desmarcado, a partir de una copia del dibujo, y tabula para cada uno el número de valores específicos, el multiplicador de demanda, el tiempo total de simulación, el paso de tiempo hidráulico, la presión mínima y la velocidad máxima. Elija Agua, Informes, Comparación de escenarios para abrirlo. La comparación comienza al abrirse y vuelve a comenzar después de cada edición mientras sigue abierta.\n\nNo cambia el proyecto, y el escenario que está abierto se deja como estaba.';
$ec_lang['lpn_guide_text_rptbox']='Muestra el informe de texto escrito por el motor de EPANET para la última simulación de período extendido, con sus advertencias y el resumen de la red. Cada simulación de período extendido lo reemplaza; una solución en un solo instante no lo reemplaza, y una edición deja en su lugar el informe anterior.';
$ec_lang['lpn_guide_text_status_box']='Enumera, en orden cronológico, cada cambio durante la última simulación de período extendido: la apertura o el cierre de una bomba, válvula o tubería, un depósito que empieza a llenarse o vaciarse o que se llena o se vacía por completo, y cualquier paso de tiempo que no convergió totalmente. Solo se enumeran los cambios, no cada paso de tiempo.';
$ec_lang['lpn_guide_text_full_box']='Enumera cada nodo y cada línea en cada paso de tiempo del informe, en las unidades que muestra el panel Tablas. Sin una simulación de período extendido, muestra la solución actual en un solo instante. Descargar o imprimir incluye todos los pasos de tiempo, y la tabla muestra uno a la vez.';
$ec_lang['lpn_guide_text_calib_box']='Compara un archivo de mediciones de campo con los resultados calculados en las mismas ubicaciones y momentos, un archivo para cada parámetro. El archivo se conserva solo durante la sesión actual y no se guarda con el proyecto.';
$ec_lang['lpn_guide_text_hotkeys_popup']='El manual del usuario. Sus secciones son Cómo usar el manual del usuario, Barra de herramientas, Menús, Mapa, Captura de pantalla, Tablas, Cuadros, Acerca de esta calculadora y Notas sobre esta página. Barra de herramientas y Menús enumeran cada botón de la barra de herramientas y cada fila de menú con su atajo de teclado, Cuadros tiene una entrada para cada cuadro, y las demás secciones indican qué hace la página. Al elegir una fila se muestra dónde está ese control; nunca lo ejecuta. Presione Ctrl+K para buscar, o presione / mientras el manual del usuario tiene el foco. Ctrl+K no busca mientras hay una pregunta abierta.';
// The Find and replace chapter beyond its opening paragraphs, in the Guide's Boxes section
// (Tom, 2026-10-07). Each _def is HTML: keep the tags. A query inside <code> runs as written in
// English on a page in any language; translate it with the words the Find box shows in your
// language, or leave it in English. Asset IDs (60, 247, 330) and the numbers are measured on Net1
// and Net3 by dev/lpn-spike/user-guide-find-harness.js: never change them in translation.
$ec_lang['lpn_guide_find_query_term']='El lenguaje de consulta';
$ec_lang['lpn_guide_find_query_def']='<table class="lpn-notes-table"><tbody><tr><td><code>Scope.Property condition value</code></td><td>Una condición. El alcance es Todo, Nudo, Embalse, Depósito, Tubería, Bomba, Válvula, Texto, Cliente o Fuente. La propiedad es cualquier entrada de la lista Propiedad para ese alcance.</td></tr><tr><td>Condiciones</td><td>igual a, mayor que, menor que, contiene, n más altos, n más bajos y vacío. Contiene se aplica solo a texto. En n más altos y n más bajos, n es una cantidad, como en 5 más altos. Con la letra n misma, como en <code>Pipe.Velocity n highest</code>, o con el cuadro Valor vacío, se enumeran 10 elementos. Vacío encuentra los elementos que no tienen valor para la propiedad. Conectividad tiene cuatro condiciones y no admite valor.</td></tr><tr><td>Valores</td><td>Un número se ingresa sin su unidad, en la unidad que se muestra en Propiedades y en el panel Tablas: 40, no 40 psi. El texto, incluido un ID, se encierra entre comillas simples o dobles: <code>\'60\'</code>.</td></tr><tr><td>Y, O y paréntesis</td><td>Y se evalúa antes que O, y los paréntesis agrupan condiciones. NO no está disponible.</td></tr><tr><td>Ortografía</td><td>Las palabras no distinguen mayúsculas de minúsculas. Las palabras en inglés se aceptan en todos los idiomas, así que una consulta copiada de este manual del usuario se ejecuta en una página en cualquier idioma.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_examples_term']='Ejemplos en Net3';
$ec_lang['lpn_guide_find_examples_def']='<p>Abra el ejemplo Net3 para seguirlos. La presión está en psi y la velocidad en ft/s.</p><table class="lpn-notes-table"><tbody><tr><td><code>Everything.ID equal to \'60\'</code></td><td>El nudo 60 y la tubería 60. Un nudo y una tubería pueden tener el mismo ID, así que una búsqueda de ID en Todo puede devolver más de un elemento.</td></tr><tr><td><code>Junction.Pressure below 40</code></td><td>Los nudos 10, 40, 50, 20 y 153, con la presión más baja primero. El nudo 10 está a -0.6 psi, una presión negativa que requiere revisión.</td></tr><tr><td><code>Pipe.Velocity 5 highest</code></td><td>Las tuberías 60, 125, 329, 123 y 149, con la velocidad más alta primero. La tubería 60 conduce 9.3 ft/s.</td></tr><tr><td><code>Junction.Pressure below 20 OR Pipe.Velocity above 5</code></td><td>Los nudos 10, 20, 40 y 50, y las tuberías 60, 125 y 329: presiones bajas y velocidades altas en una sola lista.</td></tr><tr><td><code>Junction.Pressure below 40 AND Junction.Elevation above 100</code></td><td>Los nudos 10, 20, 40 y 50, las presiones bajas en terreno alto. Ambas condiciones deben nombrar el mismo tipo de elemento: <code>Junction.Pressure below 40 AND Pipe.Velocity above 3</code> no coincide con nada, porque ningún elemento es a la vez un nudo y una tubería.</td></tr><tr><td><code>Pipe.Closed equal to \'closed\'</code></td><td>La tubería 330, la única tubería cerrada en el archivo Net3.</td></tr><tr><td><code>Junction.Connectivity no open path to a source</code></td><td>Ninguno, tal como se distribuye el archivo. Con la tubería 247 cerrada (vea Reemplazar y Deshacer), los nudos 215, 217, 219 y 225: los nudos que una rotura en la tubería 247 dejaría sin suministro. Repetir esto para cada tubería es un análisis de criticidad.</td></tr></tbody></table>';
$ec_lang['lpn_guide_find_results_term']='Resultados, la selección y Tablas';
$ec_lang['lpn_guide_find_results_def']='<p>Los elementos que coinciden se enumeran debajo del botón Buscar. Mayor que y n más altos enumeran primero el valor más alto, menor que y n más bajos primero el valor más bajo, y las demás condiciones enumeran por el valor encontrado y luego por ID. Una consulta con Y u O enumera los nodos y luego las líneas, cada grupo por ID. Una sola coincidencia se muestra de inmediato en el mapa. Seleccione una fila para centrar el mapa en ese elemento. Si no hay nada seleccionado, el elemento también queda seleccionado; si hay algo seleccionado, el elemento se resalta y la selección no cambia. Shift+clic o Ctrl+clic en una fila la agrega a la selección o la quita. Buscar no selecciona por sí solo todas las coincidencias.</p><p>El botón Filtrar en la tabla actual aplica la misma consulta al panel Tablas. Cada tabla a la que se aplica la consulta muestra solo las filas que coinciden, con la consulta y el número de filas encima. Para seleccionar en el mapa todas las coincidencias, seleccione esas filas y elija Seleccionar en el mapa en el menú del botón derecho. Un filtro de tabla no se guarda con el proyecto y termina al recargar la página. Una fila editada de modo que ya no coincida permanece en la tabla, atenuada y marcada con un signo de advertencia, hasta que se vuelva a presionar el botón Filtrar en la tabla actual.</p>';
$ec_lang['lpn_guide_find_replace_term']='Reemplazar y Deshacer';
$ec_lang['lpn_guide_find_replace_def']='<p>La parte Cambiar lo encontrado del cuadro escribe una propiedad en todos los elementos que encontró la consulta. Elija la propiedad en la lista Propiedad para cambiar, ingrese el nuevo valor en el cuadro Nuevo valor en la unidad mostrada, y presione el botón Reemplazar. El cuadro indica entonces cuántos elementos cambiarían, sin contar los que ya tienen el nuevo valor. Presione el botón Cambiarlos para aplicar el cambio, o Cancelar. Un solo Deshacer revierte todo el reemplazo.</p><p>Ejemplo en Net1: <code>Pipe.Diameter below 10</code> encuentra las tuberías 31, 122, 113 y 121. Elija Diámetro, ingrese 10 y presione Reemplazar; el cuadro muestra "¿Cambiar 4 elementos?". Presione Cambiarlos para fijar las cuatro tuberías en 10 in. Un solo Deshacer las devuelve a 6 y 8 in.</p><p>Ejemplo en Net3: <code>Pipe.ID equal to \'247\'</code> encuentra la tubería 247. Elija Cerrada, elija Cerrada de nuevo en la lista Nuevo valor y presione Reemplazar y luego Cambiarlos, para cerrar la tubería en el ejemplo de conectividad anterior. Deshacer la abre de nuevo.</p><p>Reemplazar requiere un solo tipo de elemento, así que en Todo, primero elija un tipo de elemento en la lista Qué buscar. En un escenario distinto de Base, el reemplazo se almacena en ese escenario, como lo haría la misma edición en Propiedades. Donde hay elevaciones de Mapbox disponibles, Elevación se puede reemplazar desde el DEM de Mapbox en lugar de un valor escrito.</p>';
$ec_lang['lpn_guide_find_notes_term']='Puntos a tener en cuenta';
$ec_lang['lpn_guide_find_notes_def']='<ul><li>Los valores se comparan con precisión completa y se enumeran con cuatro decimales. Igual a rara vez coincide con un resultado calculado; use mayor que y menor que.</li><li>La presión, la carga, el caudal, la velocidad y los demás resultados son los del último cálculo. Con la opción Recalcular automáticamente desactivada, describen la red tal como estaba en el último Calcular.</li><li>Mayor que y menor que sobre texto usan el orden alfabético, con los números en orden numérico: en Net1, <code>Junction.ID above \'20\'</code> encuentra los nudos 21, 22, 23, 31 y 32.</li><li>En Todo, solo se ofrecen ID, Descripción, Marcador y Conectividad. Elija un tipo de elemento en la lista Qué buscar para ver su lista completa de propiedades.</li><li>Un elemento Texto no tiene ID. Se busca por sus palabras, como en <code>Text.Text contains \'pump\'</code>.</li><li>Las cuatro condiciones de Conectividad para un nodo son sin líneas en el nodo, sin líneas abiertas en el nodo, sin ruta de líneas hasta un origen y sin ruta abierta hasta un origen. Un origen es un embalse o un depósito.</li></ul>';
// The Scenarios chapter, in the entry for the Scenario manager box (Task 785). Written from the code of
// feat/bentley-interop and held by dev/lpn-spike/user-guide-scenarios-harness.js. The box's own help
// (lpn_sm_help, Tom's wording of 2026-10-16) comes first in the entry; nothing here restates or
// contradicts it. Terms follow the Find and replace chapter's pattern.
$ec_lang['lpn_guide_scn_use_term']='Para qué sirve un escenario';
$ec_lang['lpn_guide_scn_use_def']='<p>Los escenarios guardan muchos diseños, vistas o situaciones en el mismo proyecto, como día promedio, día máximo, hora pico, una figura para presentar en un informe, una tubería principal fuera de servicio o una sustitución propuesta. La red se dibuja una sola vez, en el escenario Base. Cada uno de los demás escenarios contiene solo sus valores específicos, es decir, los valores que difieren del escenario del que hereda, y lee todo lo demás de ese escenario. Por lo tanto, una edición en Base llega a todos los escenarios que no han reemplazado ese valor.</p><p>Un proyecto nuevo comienza con seis escenarios listos para usar: 1. Prueba de flujo: Estática, 2. Prueba de flujo: Intermedia, 3. Prueba de flujo: Máxima, 4. Día promedio, 5. Día máximo y 6. Hora pico. Son escenarios comunes que se pueden renombrar, editar y eliminar. Cada uno comienza con un solo valor específico, su multiplicador de demanda: 1 para las pruebas de flujo y el Día promedio, 2 para el Día máximo y 3 para la Hora pico. Los multiplicadores son valores provisionales que se deben reemplazar por los del sistema que se modela. Un proyecto abierto desde un archivo, incluido cada ejemplo, o importado desde un archivo de EPANET tiene solo Base.</p><p>El caudal contra incendios se verifica con el Análisis de caudal contra incendios, que prueba todos los nudos o los nudos seleccionados. El Día máximo es el escenario que normalmente está abierto al ejecutarlo.</p>';
$ec_lang['lpn_guide_scn_open_term']='El escenario abierto';
$ec_lang['lpn_guide_scn_open_def']='<p>El botón Escenario de la franja de estado debajo del mapa nombra el escenario abierto y cuenta sus valores específicos, como en Escenario: Base | N.º de valores específicos: 0. Haga clic en él, o elija Agua, Escenarios, para cambiar de escenario o para agregar, copiar, renombrar o eliminar uno. Cada escenario de la lista muestra su número de valores específicos entre paréntesis, y una marca de verificación señala el que está abierto. La fila Administrador de escenarios abre el árbol de escenarios y alternativas. Aparece atenuada mientras el Modo básico está marcado.</p><p>El dibujo, las etiquetas, las Propiedades, las Tablas y los resultados pertenecen todos al escenario abierto, y la página resuelve solo el escenario abierto. La Comparación de escenarios, descrita en su propia entrada, resuelve los demás a partir de copias. El escenario abierto se guarda con el proyecto.</p>';
$ec_lang['lpn_guide_scn_marks_term']='Dónde se muestran los valores específicos';
$ec_lang['lpn_guide_scn_marks_def']='<p>En el mapa, un elemento que tiene un valor específico en el escenario abierto se rodea con un anillo ámbar, y un elemento que hereda un valor específico de un escenario o una alternativa superior se rodea con un anillo de línea gris discontinua. Para la demanda, el diámetro, la rugosidad, el coeficiente de pérdida localizada y la longitud, el anillo aparece solo mientras Configuración, Visualización, Etiquetas de nodo o Etiquetas de línea muestra ese valor en el mapa; un valor específico de cualquier otra propiedad siempre tiene su anillo. En Tablas, una celda que contiene un valor fijado por el escenario abierto es ámbar, y su sugerencia nombra la alternativa que lo contiene, como en Físico, alternativa: Tubería principal mayor. Mostrar escenarios, en el menú de celda de una tabla, enumera cada elemento una vez por cada escenario.</p><p>Cada fila de Propiedades que un escenario puede reemplazar tiene una marca a su izquierda. Un punto sólido significa que el escenario abierto reemplaza el valor; haga clic en él para borrar el valor específico. Un punto hueco significa que el valor es heredado; haga clic en él para que el valor mostrado pase a ser un valor específico. Un triángulo significa que los escenarios inferiores a este reemplazan el valor; haga clic en él para borrar sus valores específicos, después de una confirmación. Debajo de una fila reemplazada aparece el valor heredado al que sustituye, como en Escenario base: 18. El cuadro Configuración tiene solo el punto sólido y el triángulo, porque escribir un valor allí es lo que crea un valor específico.</p><p>Para ocultar los anillos, desmarque Mostrar marcadores de valores específicos en el mapa en Configuración, Mapa y página, Página, o elija Mapa, Limpiar mapa. Ambas opciones se conservan en este navegador, no en el proyecto. Tablas marca los valores específicos de todos modos.</p>';
$ec_lang['lpn_guide_scn_make_term']='Crear y borrar valores específicos';
$ec_lang['lpn_guide_scn_make_def']='<p>Con un escenario distinto de Base abierto, una edición de un valor que los escenarios pueden reemplazar se guarda como valor específico en el escenario abierto, sea cual sea la forma de hacerla: escribir en Propiedades, editar una celda en Tablas, Reemplazar en Buscar y reemplazar, arrastrar un nodo o ingresar sus coordenadas, Cambiar tipo (el tipo nuevo es el valor específico) o Pegar propiedades en la selección. Un ajuste escrito en el cuadro Configuración se guarda como valor específico cuando los escenarios pueden reemplazar ese ajuste. Base no cambia. En Base, las mismas ediciones cambian la propia red y llegan a todos los escenarios que no han reemplazado el valor.</p><p>Eliminar actúa de otra manera. En un escenario, Eliminar no quita un elemento que existe en Base. Lo deja inactivo en el escenario abierto, y en el caso de un nodo también sus tuberías, y un mensaje lo indica. El elemento sigue en el dibujo y en los demás escenarios. Un elemento dibujado mientras hay un escenario abierto está inactivo en Base y activo en ese escenario, y Eliminar en ese escenario lo quita. Eliminar un elemento en Base también elimina sus valores específicos en todos los escenarios, después de una pregunta que los cuenta. Los clientes y las figuras no pertenecen a ningún escenario y se eliminan por completo.</p><p>La fila Administrador de valores específicos de la lista Escenarios abre una lista de todos los valores específicos del escenario abierto por categoría, cada uno junto al valor heredado al que sustituye. Un gráfico de series de tiempo en el mapa que el escenario abrió, movió o cambió es una fila aparte. Marque filas y haga clic en Borrar valores específicos seleccionados, haga clic en Borrar valor específico en una fila, o haga clic en Borrar todos los valores específicos. Cada valor vuelve entonces al valor heredado, y Deshacer lo revierte. Seleccione un ID en la lista para ir al elemento en el mapa. El punto en Propiedades y la fila Borrar valor específico del menú de celda de Tablas borran un valor específico a la vez.</p>';
$ec_lang['lpn_guide_scn_scope_term']='Qué puede y qué no puede reemplazar un escenario';
$ec_lang['lpn_guide_scn_scope_def']='<table class="lpn-notes-table"><tbody><tr><td>Propiedades</td><td>Toda propiedad de un nodo o una línea, salvo las que se indican más abajo, incluidas su posición, si está activo y su tipo (Cambiar tipo). Un texto puede reemplazar sus palabras, posición, tamaño, alineación, negrita, ángulo y si se muestra. Una propiedad personalizada siempre se puede reemplazar. Las propiedades se agrupan en las categorías Físico, Demanda, Topología activa, Configuración inicial, Constituyente, Caudal contra incendios, Costo de energía, Propiedades personalizadas, Texto, Presentación y Cálculo.</td></tr><tr><td>Configuración</td><td>Los ajustes guardados con el proyecto, salvo los que se indican más abajo: las opciones de cálculo (por ejemplo el multiplicador de demanda, el tiempo total de simulación, el paso de tiempo hidráulico y el método de fricción), el patrón de demanda predeterminado, los valores asignados a los elementos nuevos y los ajustes de presentación (tamaños, colores, etiquetas, isolíneas, la vista del mapa y los gráficos de series de tiempo en el mapa).</td></tr><tr><td>Igual en todos los escenarios</td><td>El ID, la descripción y el marcador de un elemento; los nodos extremos y los quiebres de una línea; los clientes y las figuras; las unidades y el sistema de coordenadas; y el contenido de las Bibliotecas (patrones, curvas, tipos de tubería, listas de accesorios, controles y reglas). Una edición de cualquiera de ellos cambia todos los escenarios. Un escenario puede hacer que un elemento apunte a otra curva, tipo de tubería, lista de accesorios o patrón, pero no puede cambiar lo que contienen.</td></tr></tbody></table>';
$ec_lang['lpn_guide_scn_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_scn_example_def']='<p>Abra el ejemplo Net1. Elija Agua, Escenarios, Escenario nuevo…, escriba Tubería principal mayor y haga clic en Aceptar. Seleccione la Tubería 10 en el mapa e ingrese 24 como Diámetro en Propiedades; Base tiene 18 pulg., que se muestra debajo del campo como Escenario base: 18. Elija Base en la lista Escenarios, elija de nuevo Escenario nuevo…, escriba Día máximo e ingrese 1.8 como Multiplicador de demanda en Configuración, Cálculo, Hidráulica. Luego elija Agua, Informes, Comparación de escenarios.</p><table class="lpn-notes-table"><tbody><tr><td>Escenario</td><td>N.º de valores específicos</td><td>Multiplicador de demanda</td><td>Presión mínima</td><td>Velocidad máxima</td></tr><tr><td>Base</td><td>0</td><td>1</td><td>108 psi en N32, 14:00</td><td>2.76 ft/sec en L11, 16:00</td></tr><tr><td>Tubería principal mayor</td><td>1</td><td>1</td><td>109 psi en N32, 14:00</td><td>2.87 ft/sec en L11, 16:00</td></tr><tr><td>Día máximo</td><td>1</td><td>1.8</td><td>15.78 psi en N32, 9:00</td><td>3.49 ft/sec en L10, 9:00</td></tr></tbody></table><p>El tiempo total de simulación es 24:00 en los tres, de modo que cada presión mínima y cada velocidad máxima es el extremo a lo largo del día, a la hora indicada. La tubería principal mayor eleva la presión mínima en aproximadamente 1 psi. Un multiplicador de 1.8 la reduce a 15.78 psi a las 9:00, y la velocidad máxima pasa a la Tubería 10. Cada escenario contiene un valor específico, y Base conserva sus valores.</p>';
$ec_lang['lpn_guide_scn_notes_term']='Puntos a tener en cuenta';
$ec_lang['lpn_guide_scn_notes_def']='<ul><li>Un valor específico igual al valor heredado sigue siendo un valor específico. Se cuenta, y el Administrador de valores específicos lo marca (igual).</li><li>El Modo básico es un ajuste de este navegador, no del proyecto. Está deshabilitado para un proyecto cuyos escenarios y alternativas no puede mostrar. Las alternativas y el Administrador de escenarios se describen en la ayuda al comienzo de esta entrada.</li><li>Deshacer conserva 20 pasos. Cada paso restaura los escenarios y el escenario abierto junto con el dibujo, de modo que se puede deshacer agregar, renombrar y eliminar un escenario.</li><li>Al exportar un archivo de EPANET se escribe solo el escenario abierto, con los valores y las posiciones de nodos que ese escenario lee. Los escenarios propiamente dichos se registran solo en el archivo del proyecto.</li></ul>';
// The Scenario comparison chapter beyond its opening paragraphs (lpn_guide_text_scncmp_box), copied into
// the box's entry by renderGuideBoxes() from <template id="lpn_guide_more_lpn_scncmp_box">. Task 785.
$ec_lang['lpn_guide_cmp_cols_term']='Qué contiene la tabla';
$ec_lang['lpn_guide_cmp_cols_def']='<table class="lpn-notes-table"><tbody><tr><td>Escenario</td><td>El nombre del escenario. El escenario abierto se marca (abierto actualmente).</td></tr><tr><td>N.º de valores específicos</td><td>Los valores específicos del propio escenario, contados como en la lista Escenarios. Una opción de cálculo como el multiplicador de demanda cuenta como uno, y un valor específico igual al valor heredado también cuenta.</td></tr><tr><td>Multiplicador de demanda, Tiempo total de simulación, Paso de tiempo hidráulico</td><td>Los valores con los que se resolvió el escenario, los propios o los del proyecto. Un escenario en estado estacionario muestra un guion en el paso de tiempo.</td></tr><tr><td>Presión mínima</td><td>La presión más baja en un nudo, con su ID y la hora en que ocurre. Los embalses y los depósitos se excluyen porque cada uno tiene una carga fija.</td></tr><tr><td>Velocidad máxima</td><td>La velocidad más alta en una tubería o válvula, con su ID y la hora en que ocurre. Las bombas se excluyen.</td></tr></tbody></table>';
$ec_lang['lpn_guide_cmp_run_term']='Escenarios en estado estacionario y de período extendido';
$ec_lang['lpn_guide_cmp_run_def']='<p>Un escenario con un Tiempo total de simulación mayor que 0 se ejecuta durante todo el período con el motor de EPANET. Su presión mínima y su velocidad máxima son los extremos de todos los pasos de tiempo, cada uno con su hora. Un escenario con un Tiempo total de simulación de 0 se resuelve en un solo instante. El tiempo total de simulación es una de las opciones que un escenario puede reemplazar, de modo que una misma tabla puede contener ambos tipos.</p>';
$ec_lang['lpn_guide_cmp_notes_term']='Puntos a tener en cuenta';
$ec_lang['lpn_guide_cmp_notes_def']='<ul><li>Un escenario que no se puede resolver muestra el motivo en lugar de sus dos resultados, por ejemplo que un nudo no tiene camino hasta una fuente después de dejar inactiva una tubería. Los demás escenarios se resuelven igualmente. Un escenario que no convergió muestra sus últimos resultados y un mensaje.</li><li>El bloque sobre la tabla, Igual en todos los escenarios, indica el método de fricción, las unidades, la precisión y el máximo de intentos. Un ajuste que difiere entre escenarios se omite del bloque.</li><li>No hay un umbral de aprobación o rechazo. Lea los números según los criterios de diseño del sistema que se modela.</li><li>El ejemplo de la entrada del Administrador de escenarios compara tres escenarios en Net1.</li></ul>';
// The Libraries chapter, in the entry for the Libraries box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_library_box">. Written from the code and held by
// dev/lpn-spike/user-guide-library-harness.js.
$ec_lang['lpn_guide_lib_kinds_term']='Qué contiene cada sección';
$ec_lang['lpn_guide_lib_kinds_def']='<table class="lpn-notes-table"><tbody><tr><td>Patrones</td><td>Una lista de multiplicadores que se repite mientras dure una ejecución, un multiplicador por cada paso de tiempo del patrón. Un patrón nuevo son 24 multiplicadores de 1. Al pegar una columna de una hoja de cálculo se llena el cuadro Multiplicadores. El patrón de demanda predeterminado se marca (predeterminado) y se elige en Configuración, Cálculo, Hidráulica.</td></tr><tr><td>Curvas</td><td>Cuatro tipos, que se eligen como Tipo de curva: Carga de la bomba, Eficiencia de la bomba, Volumen del depósito y Pérdida de carga de la válvula. Los puntos se ingresan en una cuadrícula que acepta una columna pegada de una hoja de cálculo o líneas copiadas de un archivo de EPANET. Una curva de carga de bomba se ajusta a sus puntos y la línea Ecuación muestra el ajuste; un punto se lee como el punto de diseño, con una carga a caudal cero de 1.33334 veces su carga y un caudal máximo de 2 veces su caudal, tal como lo lee EPANET. Los demás tipos unen sus puntos con líneas rectas. Una bomba o una válvula indica su curva en Propiedades, donde el enlace Curvas abre esta sección.</td></tr><tr><td>Tipos de tubería</td><td>Una definición de diámetro, rugosidad y coeficientes de reacción a la que hacen referencia varias tuberías. Una propiedad puede dejarse en blanco en la definición y luego ingresarse para cada tubería. En Propiedades, los valores que indica un tipo de tubería aparecen deshabilitados, y Separar del tipo de tubería los copia en la tubería y deja de usar el tipo.</td></tr><tr><td>Accesorios</td><td>Listas de accesorios con una cantidad para cada uno, sumadas en un coeficiente de pérdida localizada, k, para una tubería o un tipo de tubería. Los accesorios ofrecidos son los trece de la Tabla 3.3 del manual del usuario de EPANET 2.2 y Otro accesorio. Al elegir uno se copia su coeficiente en la fila, donde se puede cambiar.</td></tr><tr><td>Controles</td><td>Una instrucción cada uno, en la sintaxis de EPANET, como en <code>LINK id OPEN IF NODE id BELOW value</code>. Debajo de cada uno, el cuadro indica si se entendió.</td></tr><tr><td>Reglas</td><td>Varias líneas cada una, en la sintaxis de EPANET: RULE, IF, AND, OR, THEN, ELSE y PRIORITY. Debajo de cada una, el cuadro indica si se leyó.</td></tr></tbody></table>';
$ec_lang['lpn_guide_lib_refs_term']='Renombrar, eliminar y qué hace referencia a un ítem';
$ec_lang['lpn_guide_lib_refs_def']='<p>Un ID se cambia en su sección. No se acepta un ID en blanco ni un ID que ya se use en la misma sección. Renombrar un ítem traslada todas las referencias a él, en Base y en todos los escenarios. Para un patrón, las referencias son el patrón de demanda de un nudo y el patrón de cada una de sus categorías de demanda, el patrón de demanda de un cliente, el patrón de carga de un embalse, el patrón de velocidad de una bomba y el patrón de demanda predeterminado.</p><p>Un patrón que está en uso se puede eliminar, y se borra cada referencia a él. Si era el patrón de demanda predeterminado, un aviso indica qué usan ahora los nudos sin patrón. Una curva, un tipo de tubería o una lista de accesorios que está en uso no se elimina. El mensaje nombra los elementos que lo usan, y a cada uno hay que asignarle antes otra curva, o separarlo del tipo o de la lista.</p>';
$ec_lang['lpn_guide_lib_scn_term']='Bibliotecas y escenarios';
$ec_lang['lpn_guide_lib_scn_def']='<p>Las Bibliotecas son las mismas en todos los escenarios. Un escenario puede hacer que un elemento apunte a otra curva, tipo de tubería, lista de accesorios o patrón, lo cual es un valor específico de ese elemento, pero el contenido de un ítem no se reemplaza. Una edición de un patrón, una curva, un tipo de tubería, una lista de accesorios, un control o una regla lo cambia para todos los escenarios, sea cual sea el escenario abierto. El patrón de demanda predeterminado es un ajuste y no un ítem, y un escenario puede tener el suyo.</p><p>Un control o una regla que nombra un elemento inactivo en el escenario abierto se ignora en la ejecución de ese escenario, y el cuadro Bibliotecas lo enumera. Uno que nombra un elemento que el proyecto no tiene también se ignora, con una advertencia.</p>';
$ec_lang['lpn_guide_lib_ctl_term']='Controles y reglas en una ejecución';
$ec_lang['lpn_guide_lib_ctl_def']='<p>Un control es una instrucción. Una regla es un conjunto de líneas que comienza con RULE. Las palabras clave se escriben en inglés sea cual sea el idioma de la página, y los números están en las unidades del proyecto. Agregar un control parte de una instrucción construida a partir de la red, que luego se edita hasta dejarla como se desea.</p><p>Los controles y las reglas cambian un resultado solo en una simulación de período extendido, es decir, cuando el Tiempo total de simulación es mayor que 0. Una solución en estado estacionario no cambia con ninguno de los dos. Las reglas las aplica únicamente el motor de EPANET. Ambos se guardan con el proyecto y se escriben en un archivo de EPANET.</p>';
$ec_lang['lpn_guide_lib_import_term']='Importar bibliotecas de otro proyecto';
$ec_lang['lpn_guide_lib_import_def']='<p>Archivo, Importar…, Importar bibliotecas… abre otro archivo de proyecto y copia en este proyecto bibliotecas completas del archivo. Un ítem cuyo nombre ya se usa aquí se omite y se enumera, de modo que no se cambia nada de lo que ya hay. Se muestra una advertencia cuando el archivo y el proyecto expresan una magnitud en unidades distintas, y los ítems se importan tal como están escritos. Se enumeran los tipos de tubería que hacen referencia a una lista de accesorios que este proyecto no tiene; importe la biblioteca de accesorios del mismo archivo para resolverlos.</p>';
$ec_lang['lpn_guide_lib_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_lib_example_def']='<p>Abra el ejemplo Net1 y elija Agua, Bibliotecas. Patrones contiene el patrón 1, Demand Pattern, con 12 multiplicadores separados 2:00, que cubren 24:00, marcado (predeterminado). Curvas contiene la curva 1, Pump Curve for Pump 9, una curva de carga de bomba con un punto, 1500 gpm a 250 ft. Controles contiene dos instrucciones: la primera abre la Línea 9 cuando el Nodo 2 baja de 110, y la segunda la cierra cuando el Nodo 2 sube de 140. Reglas contiene dos reglas que comprueban la hora del reloj y el nivel del Depósito 2.</p><p>Elija Agua, Calcular, y luego Agua, Informes, Cambios de estado. La Bomba L9 ahora está cerrada a las 10:00, ahora abierta a las 15:00 y ahora cerrada a las 21:00, y el Depósito N2 ahora se está vaciando a las 22:00. En Controles, cambie 140 por 135 en el segundo control y elija de nuevo Agua, Calcular. El último cierre pasa a las 20:00, y el Depósito N2 ahora se está vaciando a las 21:00.</p>';
$ec_lang['lpn_guide_lib_notes_term']='Puntos a tener en cuenta';
$ec_lang['lpn_guide_lib_notes_def']='<ul><li>Un patrón se repite mientras dure una ejecución, de modo que no necesita cubrir toda la ejecución.</li><li>Un archivo de EPANET no tiene lugar para un tipo de tubería ni para una lista de accesorios. El archivo lleva los números que lee cada tubería, y la exportación indica qué tuberías se aplanaron.</li><li>La posición y el tamaño del cuadro Bibliotecas se conservan en este navegador. Los ítems se guardan con el proyecto.</li></ul>';
// The Properties chapter, in the entry for the Properties box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_popup">. Held by dev/lpn-spike/user-guide-properties-harness.js.
$ec_lang['lpn_guide_prop_open_term']='Abrir Propiedades';
$ec_lang['lpn_guide_prop_open_def']='<p>En el modo Seleccionar, haga clic en un nodo, una línea, un texto o un cliente para abrir Propiedades junto a él, o donde el cuadro se movió por última vez. Con Mayús presionada, haga clic en otro elemento para agregarlo a la selección. Con más de un elemento seleccionado, el cuadro enumera lo que se puede definir en todos a la vez (vea Varios elementos seleccionados, más abajo). Una figura no tiene cuadro de Propiedades, porque sus puntos se editan en el mapa.</p><p>El menú del clic derecho de un nodo o una línea tiene Copiar propiedades, Pegar propiedades en la selección y Gráfico de series de tiempo. En una pantalla táctil, mantenga presionado el elemento para ver el mismo menú. El gráfico de series de tiempo necesita los resultados de una simulación de período extendido.</p>';
$ec_lang['lpn_guide_prop_edit_term']='Editar un valor';
$ec_lang['lpn_guide_prop_edit_def']='<p>Un valor surte efecto cuando se confirma el campo, al salir de él o al presionar Intro. Se lee en la unidad que nombra su etiqueta, sin conversión, y la etiqueta del mapa, Tablas y los resultados lo siguen. Los valores calculados son filas de solo lectura sin cuadro donde escribir. En una línea siguen a sus datos de entrada, y en un nodo están entre ellos. Son los resultados del último cálculo, a la hora indicada, y con Recalcular automáticamente desmarcado son los del último Calcular.</p><p>Una tubería que usa un tipo de tubería muestra como deshabilitados los valores que indica el tipo. Haga clic en Separar del tipo de tubería para copiar esos valores en la tubería y editarlos allí.</p>';
$ec_lang['lpn_guide_prop_id_term']='El ID';
$ec_lang['lpn_guide_prop_id_def']='<p>El ID se edita en la barra de título. No puede contener un espacio ni comillas, y el ID de un nodo no puede ser el de otro nodo, ni el de una línea el de otra línea. Un nodo y una línea pueden tener el mismo ID. Un ID rechazado deja el anterior en su lugar y muestra un mensaje. Renombrar un elemento traslada con él sus valores específicos de escenario.</p>';
$ec_lang['lpn_guide_prop_scn_term']='En un escenario';
$ec_lang['lpn_guide_prop_scn_def']='<p>En un escenario distinto de Base, una edición de un valor que los escenarios pueden reemplazar se guarda como valor específico del escenario abierto, y la fila se marca a su izquierda. La entrada del Administrador de escenarios describe las marcas y enumera lo que es igual en todos los escenarios: el ID, la descripción y el marcador lo son. Un cliente no tiene valores de escenario. Al cambiar de escenario, Propiedades sigue abierto sobre el mismo elemento y muestra los valores del escenario que ahora está abierto.</p>';
$ec_lang['lpn_guide_prop_multi_term']='Varios elementos seleccionados';
$ec_lang['lpn_guide_prop_multi_def']='<p>El título dice, por ejemplo, 2 seleccionados. El cuadro tiene una sección para cada tipo de elemento de la selección, encabezada por el nombre del tipo y el número de elementos de ese tipo, como en Tuberías (2), y cada sección se puede contraer. Una sección enumera las propiedades que Tablas tiene como columnas y que se pueden definir en todos los elementos de ella. No se enumeran los resultados ni los valores que indica un tipo de tubería. Una fila muestra el valor que comparten los elementos, o Varía donde difieren.</p><p>Al escribir un valor en una fila, se define en todos los elementos de ese tipo de la selección. Una fila que no se toca no escribe nada. Un aviso indica el número, como en Se definió Diámetro (pulg.) en 2., y un solo Deshacer revierte toda la fila. En un escenario distinto de Base, los valores se guardan como valores específicos.</p>';
$ec_lang['lpn_guide_prop_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_prop_example_def']='<p>Abra el ejemplo Net1 y haga clic en la Tubería 10. Propiedades enumera sus datos de entrada, desde Descripción hasta ¿Activo?, y luego sus resultados a la hora indicada: Caudal 1866.2 gpm, Velocidad 2.4 ft/sec y Pérdida de carga 19.12 ft H2O.</p><p>Haga clic en la Tubería 113 y, con Mayús presionada, en la Tubería 31. El título dice 2 seleccionados, la única sección es Tuberías (2), y Diámetro muestra Varía, porque la Tubería 31 es de 6 pulg. y la Tubería 113 es de 8 pulg. Ingrese 10 como Diámetro. El aviso dice Se definió Diámetro (pulg.) en 2., ambas tuberías son de 10 pulg., y un solo Deshacer las devuelve a 6 y 8 pulg.</p>';
// The Settings chapter, in the entry for the Settings box (Task 785), copied in by renderGuideBoxes() from
// <template id="lpn_guide_more_lpn_settings_box">. Held by dev/lpn-spike/user-guide-settings-harness.js.
$ec_lang['lpn_guide_set_where_term']='Secciones y dónde se guardan los ajustes';
$ec_lang['lpn_guide_set_where_def']='<p>La lista a la izquierda del cuadro salta a una sección o a un subtítulo. Las secciones son Visualización (Etiquetas de nodo, Colores de nudos, Etiquetas de línea, Colores de línea, Cliente y Todo), Mapa y página (Apariencia y Página), Elementos (Prefijos de ID, Valores de creación y Propiedades personalizadas), Cálculo (Unidades, Tiempo, Hidráulica, Energía y Calidad) y Créditos. Cada subtítulo indica si sus ajustes están marcados como Guardado con el proyecto o Guardado en este navegador. Todo se guarda con el proyecto, excepto los ajustes de Página y una fila de Hidráulica, Mostrar el cuadro de progreso de la ejecución, que indica por sí misma Guardado en este navegador.</p><p>La pestaña Configuración de Tablas enumera los mismos ajustes como filas, con su Categoría y su Valor, de modo que un ajuste también se puede encontrar y revisar allí.</p>';
$ec_lang['lpn_guide_set_search_term']='Búsqueda';
$ec_lang['lpn_guide_set_search_def']='<p>Escriba una o más palabras en Buscar en la configuración para enumerar solo los ajustes que mencionan todas ellas, en el nombre o en la sugerencia. Una palabra que coincide con un encabezado muestra todos los ajustes de ese encabezado. Por ejemplo, opacidad enumera Opacidad del símbolo (0 a 1) y Opacidad de la imagen de fondo (0 a 1); opacidad símbolos enumera solo la primera; y aspersores enumera Exponente del emisor, cuya sugerencia menciona los aspersores y cuyo nombre no. La búsqueda no cambia ningún ajuste.</p>';
$ec_lang['lpn_guide_set_scn_term']='Ajustes en un escenario';
$ec_lang['lpn_guide_set_scn_def']='<p>En un escenario distinto de Base, un valor escrito para un ajuste que los escenarios pueden reemplazar se guarda como valor específico, y la fila se marca con un punto sólido. Un triángulo marca un ajuste que reemplazan los escenarios inferiores al abierto. La entrada del Administrador de escenarios enumera qué ajustes se pueden reemplazar. Las unidades son las mismas en todos los escenarios. Restaurar valores predeterminados aparece atenuado fuera de Base, y Aplicar estos valores de elementos nuevos a todos los elementos existentes se rechaza allí, porque cambia el propio dibujo.</p>';
$ec_lang['lpn_guide_set_units_term']='Cambiar una unidad';
$ec_lang['lpn_guide_set_units_def']='<p>Cada magnitud tiene su propia unidad en Unidades. Cuando los valores del proyecto se ingresaron en esa unidad, cambiarla hace antes una pregunta. No destructivo conserva cada número tal como se escribió y lo lee en la unidad nueva. Destructivo reescribe los números por conversión, de modo que la red sigue siendo físicamente la misma, y los números originales se pierden salvo que se use Deshacer; un solo Deshacer restaura los números y la unidad. Cancelar deja todo como estaba.</p><p>Ejemplo en Net1: elija mm para Diámetro en Unidades. Destructivo reescribe 13 valores, y la Tubería 10 dice 457.2 mm. No destructivo deja los 13 valores como están, y la Tubería 10 dice 18 mm.</p>';
$ec_lang['lpn_guide_set_assets_term']='Elementos nuevos y cómo aplicar valores a los existentes';
$ec_lang['lpn_guide_set_assets_def']='<p>Los prefijos de ID y los Valores de creación son para los elementos que se dibujen de ahora en adelante. No cambian los elementos ya dibujados. Aplicar a todos, junto a un prefijo de ID, da a cada elemento existente de ese tipo un ID que comienza con el prefijo; cada uno conserva su número, y un ID que no termina en un número no se cambia. Aplicar estos valores de elementos nuevos a todos los elementos existentes reemplaza esas propiedades en cada elemento existente, después de una pregunta, pero solo para las propiedades cuyas etiquetas se muestran en el mapa. Deshacer lo revierte.</p>';
$ec_lang['lpn_guide_set_reset_term']='Restaurar valores predeterminados y Empezar de nuevo';
$ec_lang['lpn_guide_set_reset_def']='<p>Restaurar valores predeterminados pregunta primero, y luego devuelve a sus valores originales los prefijos de ID, los valores de elementos nuevos, los ajustes del solucionador, la apariencia del mapa, la posición de la leyenda y las etiquetas visibles del proyecto abierto. La red no cambia, los demás proyectos no se ven afectados, y un solo Deshacer devuelve los ajustes.</p><p>Empezar de nuevo pregunta primero, y luego elimina todos los proyectos, todas las imágenes de fondo, todos los ajustes y las unidades elegidas que están guardados en este navegador, y vuelve a cargar la página como la vería un visitante nuevo. No se puede deshacer.</p>';
// The Toolbar chapter (Task 785), terms in the Toolbar section above its rows. Held by
// dev/lpn-spike/user-guide-toolbar-harness.js.
$ec_lang['lpn_guide_tb_row_term']='Cómo leer una fila';
$ec_lang['lpn_guide_tb_row_def']='<p>Cada fila es un botón de la barra de herramientas, en el orden de la franja, con una línea divisoria entre grupos. Una fila muestra el icono, el nombre y la sugerencia del botón, y luego sus teclas. Cuando una fila de menú hace lo mismo, la fila muestra además la ruta del menú después de las palabras También en. Al hacer clic en una fila se señala el botón en la barra de herramientas. Nunca ejecuta el botón. Cuando el botón no está en pantalla, la fila abre la fila de menú que hace lo mismo.</p>';
$ec_lang['lpn_guide_tb_dim_term']='Nombres atenuados';
$ec_lang['lpn_guide_tb_dim_def']='<p>Un nombre atenuado pertenece a un botón que ahora no está en pantalla. Un botón que está en pantalla no se atenúa, pueda o no actuar en ese momento. Calcular aparece atenuado mientras Recalcular automáticamente está marcado, porque el botón aparece solo cuando ese ajuste está desmarcado.</p><p>En un teléfono en modo vertical, solo los cinco controles de ejecución permanecen en la barra de herramientas. Todos los demás nombres aparecen atenuados, y al hacer clic en uno se abre la fila de menú que hace lo mismo. El botón Panel inferior no tiene fila de menú, de modo que su fila solo puede decir que el control no está en pantalla.</p>';
$ec_lang['lpn_guide_tb_two_term']='Botones con un triángulo en la esquina';
$ec_lang['lpn_guide_tb_two_def']='<p>Ver todo y Seleccionar una ventana tienen un triángulo pequeño en la esquina inferior derecha. Al presionar el botón por segunda vez, sin presionar nada entre medio, cambia: Ver todo pasa a ser Ventana de zoom, y Seleccionar una ventana recorre las formas de ventana, lazo y polígono. Al hacer clic en la esquina de Ver todo se entra de inmediato en Ventana de zoom, sin ajustar la vista.</p>';
// The Menus chapter (Task 785), two terms after the ruled keys table. Held by dev/lpn-spike/user-guide-menus-harness.js.
$ec_lang['lpn_guide_mn_list_term']='Cómo leer la lista de menús';
$ec_lang['lpn_guide_mn_list_def']='<p>La lista se arma a partir de los propios menús: Archivo, Editar, Mapa, Agua y Ayuda, cada uno bajo su propio encabezado, con las filas de un submenú sangradas bajo la fila que lo abre y una línea divisoria entre grupos. Omite las filas que ahora están ocultas, los encabezados dentro de un menú y las filas con nombre tomado del proyecto o del navegador, como los nombres de los escenarios. Llega a un submenú de profundidad y no tiene entrada para el menú Idioma. Una fila que ahora está deshabilitada igualmente aparece en la lista, sin ninguna marca que indique que está deshabilitada. Al hacer clic en una fila se abre el menú y el submenú con esa fila señalada. Nunca ejecuta la fila.</p>';
$ec_lang['lpn_guide_mn_kbd_term']='Menús desde el teclado';
$ec_lang['lpn_guide_mn_kbd_def']='<p>Las letras después de Alt+Mayús son teclas en posiciones fijas, F para Archivo, E para Editar, M para Mapa, W para Agua, H para Ayuda y L para Idioma, en cualquier distribución de teclado y en cualquier idioma. Después de F10, la letra de un menú por sí sola lo abre, y Esc en la barra de menús devuelve el foco a donde estaba.</p><p>Las filas que solo se pueden usar con un puntero no tienen letra, y las teclas de flecha las omiten. Entre ellas están Vértices, las tres selecciones de área, las herramientas de Insertar, Ventana de zoom y Captura de pantalla.</p>';
// The Map chapter (Task 785): terms after the ruled keys table. Held by dev/lpn-spike/user-guide-map-harness.js.
$ec_lang['lpn_guide_map_undo_term']='Deshacer y Rehacer';
$ec_lang['lpn_guide_map_undo_def']='<p>Ctrl+Z deshace el último cambio, y Ctrl+Y o Ctrl+Mayús+Z lo rehace. En una celda de Tablas, las teclas pertenecen al proyecto mientras la celda solo está seleccionada, y al texto de la celda una vez que se empezó a escribir. La página conserva los últimos 20 pasos, solo en la memoria, y al cambiar de proyecto se borran. Un paso restaura los escenarios, el escenario abierto y las unidades junto con el dibujo.</p>';
$ec_lang['lpn_guide_map_del_term']='Eliminar';
$ec_lang['lpn_guide_map_del_def']='<p>Supr o Retroceso elimina la selección, salvo mientras se escribe en un campo, donde la tecla pertenece al campo. Sin nada seleccionado, Supr lo dice y Retroceso no hace nada. Un solo Deshacer revierte la eliminación de varios elementos. En un escenario distinto de Base, Eliminar no quita un elemento que existe en Base; la entrada del Administrador de escenarios describe qué hace.</p>';
$ec_lang['lpn_guide_map_esc_term']='Esc';
$ec_lang['lpn_guide_map_esc_def']='<p>Un Esc que cierra un menú, una lista desplegable o un cuadro no hace nada más. Los cuadros Propiedades, Configuración y Bibliotecas se cierran solo cuando el foco está en el cuadro y el puntero está sobre él. Si no hay ninguno de ellos abierto, Esc devuelve la herramienta activa a Seleccionar, y en Seleccionar borra la selección. Una tubería a medio dibujar necesita un Esc para abandonarla y un segundo para volver a Seleccionar. En un campo, Esc pertenece al campo.</p>';
$ec_lang['lpn_guide_map_letters_term']='Letras, dígitos y teclas de zoom';
$ec_lang['lpn_guide_map_letters_def']='<p>W inicia Ventana de zoom, A inicia la selección de un área (al presionar A de nuevo se recorren la ventana, el lazo y el polígono) y F dibuja una figura. La tecla más o igual acerca, y la tecla menos aleja, un paso de la rueda. Estas teclas y los dígitos del 0 al 9 no hacen nada en el mapa cuando otra tecla las convierte en un atajo, como Ctrl+C, no hacen nada mientras se escribe en un campo y dejan las letras de un menú abierto a sus filas. Un dígito escrito en una celda seleccionada de Tablas sobrescribe la celda en lugar de elegir una herramienta.</p>';
// The Tables chapter (Task 785): terms after the two ruled key tables. Held by dev/lpn-spike/user-guide-tables-harness.js.
$ec_lang['lpn_guide_tbl_tabs_term']='Las pestañas';
$ec_lang['lpn_guide_tbl_tabs_def']='<p>Para abrir el panel, haga clic en el botón Panel inferior o elija Agua, Tablas. Sus pestañas, de izquierda a derecha, son Nudos, Embalses, Depósitos, Tuberías, Bombas, Válvulas, Texto, Clientes, Figuras, Configuración, Escenarios, Series de tiempo, Perfil, Frecuencia y Balance de caudales. La pestaña Escenarios se muestra cuando el Modo básico está desmarcado. El ancho, el orden y la visibilidad de las columnas se conservan en este navegador, no en el proyecto.</p>';
$ec_lang['lpn_guide_tbl_cell_term']='Seleccionar, ingresar y editar una celda';
$ec_lang['lpn_guide_tbl_cell_def']='<p>Una celda está en uno de tres estados. Mientras solo está seleccionada, las teclas de flecha pasan de una celda a otra, y Ctrl+Z es el Deshacer del proyecto. Al escribir un carácter sobre una celda seleccionada se inicia una entrada: el texto escrito reemplaza el valor, y una tecla de flecha lo confirma y pasa a la celda siguiente. F2 o un doble clic abre la celda para editarla: el cursor está en el valor, y las teclas de flecha mueven el cursor. En una entrada y en una edición, Ctrl+Z deshace lo escrito. Esc cancela la entrada o la edición y deja la celda seleccionada.</p>';
$ec_lang['lpn_guide_tbl_fill_term']='Rellenar, filtros y escenarios';
$ec_lang['lpn_guide_tbl_fill_def']='<p>Ctrl+D rellena hacia abajo un rango seleccionado desde su fila superior, y Ctrl+Intro lo rellena con el valor de la celda activa. Ambos dejan intactas la columna ID y las celdas de solo lectura, y un aviso indica cuántas celdas se rellenaron y cuántas no cambiaron. Ctrl+Mayús+L muestra solo los elementos seleccionados en el mapa. Con un filtro activado, Ctrl+A y Ctrl+D actúan solo sobre las filas que se muestran, y una fila editada de modo que ya no coincide permanece hasta que se vuelve a aplicar el filtro.</p><p>En un escenario distinto de Base, la edición de una celda, Ctrl+D, Ctrl+Intro y un pegado se guardan como valores específicos del escenario abierto.</p>';
// The Boxes chapter (Task 785): terms after Tom's two paragraphs. Held by dev/lpn-spike/user-guide-boxes-harness.js.
$ec_lang['lpn_guide_bx_dock_term']='Acoplar y pestañas';
$ec_lang['lpn_guide_bx_dock_def']='<p>La esquina de la barra de título de un cuadro tiene Acoplar a la izquierda del mapa, Acoplar a la derecha del mapa y Flotante, y, una vez acoplado el cuadro, Ocultar automáticamente. Un cuadro acoplado es una columna junto al mapa. Con Ocultar automáticamente, es una pestaña en una franja delgada en el borde del mapa. La pestaña abre el cuadro al pasar el puntero, tras 150 ms con un mouse o un lápiz, o con un clic o un toque, y el cuadro vuelve a guardarse en su pestaña como se describió antes. Un cuadro guardado en su pestaña sigue abierto. Una fila de menú o un botón de la barra de herramientas que lo abre lo saca de su pestaña.</p><p>Arrastrar un cuadro acoplado por su barra de título lo hace flotar y desactiva Ocultar automáticamente. Los cuadros acoplados en un lado comparten un mismo ancho, y el mapa conserva al menos 320 px. Las pestañas se reordenan arrastrándolas o presionando Alt+Arriba o Alt+Abajo en una pestaña con foco.</p>';
$ec_lang['lpn_guide_bx_keep_term']='Qué recuerda un cuadro';
$ec_lang['lpn_guide_bx_keep_def']='<p>Cada cuadro conserva en este navegador dónde flota, su tamaño, si está abierto, su lado de acoplamiento, si se oculta automáticamente, su ancho acoplado y el lugar de su pestaña. Propiedades, Criticidad: análisis, Demanda: escalado y Calibración: informe conservan solo su lado de acoplamiento, el ocultamiento automático, el lugar de la pestaña y si están abiertos; dónde flotan dura una carga de página. Un navegador sin disposición guardada comienza con algunos cuadros acoplados como pestañas, y no se guarda nada hasta que se cambia un cuadro.</p>';
$ec_lang['lpn_guide_bx_phone_term']='En un teléfono';
$ec_lang['lpn_guide_bx_phone_def']='<p>Con 640 px o menos de ancho, ningún cuadro se acopla y cada cuadro ocupa toda la ventana. No se ofrecen los botones de acoplamiento. La disposición acoplada se conserva y vuelve en una ventana más ancha.</p>';
// The Fire flow analysis chapter (Task 785), in the entry for its box. Held by dev/lpn-spike/user-guide-fireflow-harness.js.
$ec_lang['lpn_guide_ff_asks_term']='Qué se pide de cada nudo';
$ec_lang['lpn_guide_ff_asks_def']='<p>Cada nudo probado se somete a dos pruebas, sobre una copia de la red en el paso de tiempo que está en pantalla y en el escenario abierto. La primera pregunta cuánto caudal puede entregar el nudo mientras mantiene la presión residual. Se extrae un caudal en el nudo, y cálculos repetidos lo van acotando, hasta un tope igual a 10000 gpm. Un nudo que aún mantiene la presión residual en el tope se informa como que entrega más que el tope. La segunda prueba, la verificación de diseño, extrae el caudal requerido en el nudo y pregunta si algún otro nudo de su alcance cae por debajo de la Presión mínima permitida en el resto, o si alguna tubería de su alcance supera la Velocidad máxima permitida. La verificación de diseño no se hace cuando su alcance es Ninguno.</p><p>Un nudo con su propia propiedad Caudal contra incendios requerido se prueba con ese valor, y todos los demás nudos con el valor del cuadro.</p>';
$ec_lang['lpn_guide_ff_result_term']='Cómo leer los resultados';
$ec_lang['lpn_guide_ff_result_def']='<p>El resumen cuenta los nudos que pasaron todas las verificaciones, los nudos que no cumplieron el caudal contra incendios y los nudos que afectaron al resto del sistema. La tabla enumera, para cada nudo probado, la Presión estática antes de extraer cualquier caudal contra incendios, el Caudal requerido, la Presión al caudal requerido, el Caudal disponible, la Residual mantenida, el Peor efecto y el Límite de diseño de la verificación de diseño, el número de Cálculos, que es el número de resoluciones de toda la red, y los Modos de falla. Una celda sin número muestra un guion, nunca un cero. Un nudo que no se pudo resolver muestra su motivo en lugar de números. La tabla imprime como máximo 200 nudos e indica cuántos no imprimió.</p>';
$ec_lang['lpn_guide_ff_marks_term']='Anillos, Detener y un análisis a la vez';
$ec_lang['lpn_guide_ff_marks_def']='<p>Después de un cálculo, el círculo de cada nudo probado se delinea en el mapa según su resultado, y los contornos difieren en el patrón de trazos además del color. Elija Nudos seleccionados para probar solo los nudos seleccionados en el mapa; todo lo demás que esté seleccionado se cuenta y no se prueba. Detener termina un cálculo y conserva los nudos ya terminados. Solo uno de los análisis de caudal contra incendios, criticidad y escalado de demanda se ejecuta a la vez.</p>';
$ec_lang['lpn_guide_ff_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_ff_example_def']='<p>Abra el ejemplo Net1, elija Agua, Analizar, Caudal contra incendios… y haga clic en Ejecutar con el cuadro tal como se abre. El paso de tiempo es 0:00, y la ejecución resuelve toda la red 135 veces. Ocho de los nueve nudos pasan todas las verificaciones. El nudo N32 no cumple el caudal contra incendios: su presión estática es de 111 psi, queda solo 1.19 psi con los 1000 gpm requeridos, y su caudal disponible es de 892 gpm. El nudo N31 puede entregar 1339 gpm, y el nudo N12 más de 10000 gpm.</p>';
// The Criticality analysis chapter (Task 785). Held by dev/lpn-spike/user-guide-criticality-harness.js.
$ec_lang['lpn_guide_cr_case_term']='Qué hace cada caso';
$ec_lang['lpn_guide_cr_case_def']='<p>Para cada línea del alcance, la línea se deja inactiva en una copia de la red, y la copia se resuelve en el paso de tiempo que está en pantalla en el escenario abierto. Una ejecución es una resolución por cada línea y una más sin nada roto. Un nudo que queda sin un camino abierto hasta un embalse o depósito queda aislado: se quita antes de resolver, y su demanda se cuenta como Demanda no atendida. De los nudos que siguen conectados, Nudos bajo el mínimo enumera aquellos cuya presión cae por debajo de la Presión mínima permitida. Un nudo que ya está por debajo de ella sin nada roto no se cuenta contra ninguna línea, y el resumen indica cuántos hay. Presión mínima permitida es el mismo ajuste que el cuadro Presión mínima permitida en el resto del análisis de Caudal contra incendios.</p>';
$ec_lang['lpn_guide_cr_dead_term']='Extremos muertos y la lista';
$ec_lang['lpn_guide_cr_dead_def']='<p>Una línea de extremo muerto es aquella cuya eliminación aísla nudos a los que solo se puede llegar a través de ella. Todo lo que está más allá es su pérdida, de modo que con Omitir extremos muertos marcado la línea no se resuelve, y el resumen indica cuántas se omitieron. La lista muestra, para cada línea, la Demanda no atendida, los Nudos aislados y los Nudos bajo el mínimo, cada uno con el número y los primeros cinco ID, y un clic en un ID lleva a él en el mapa. Las líneas que le cuestan algo al sistema se enumeran primero hasta que se hace clic en un encabezado de columna para ordenar, y el resumen las cuenta frente al número de líneas probadas. Elija Líneas seleccionadas para romper solo las líneas seleccionadas en el mapa.</p>';
$ec_lang['lpn_guide_cr_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_cr_example_def']='<p>Abra el ejemplo Net1, elija Agua, Analizar, Análisis de criticidad…, ingrese 116 como Presión mínima permitida y haga clic en Ejecutar. El paso de tiempo es 0:00, y la ejecución resuelve toda la red 14 veces. Cuatro de las 13 líneas hacen caer un nudo por debajo de 116 psi cuando están fuera de servicio: L9 (N10, N11 y N21), L10 (N11 y N21), L111 (N21 y N22) y L112 (N21 y N22). Dos nudos ya están por debajo de 116 psi sin nada roto y no se cuentan. Como Net1 es mallada, perder una línea nunca deja un nudo sin suministro.</p>';
// The Demand scaling chapter (Task 785). Held by dev/lpn-spike/user-guide-demandscale-harness.js.
$ec_lang['lpn_guide_ds_run_term']='Ejecutar';
$ec_lang['lpn_guide_ds_run_def']='<p>Ejecutar multiplica las demandas de los nudos elegidos por la Escala de demanda, sobre una copia de la red en el paso de tiempo que está en pantalla y en el escenario abierto. Hace dos resoluciones, una con las demandas tal como están y otra escalada. El resultado enumera las Presiones más bajas y las Velocidades más altas, cada una con el valor Escalado junto al valor Sin escalar, que es el que muestra el mapa. Cada lista contiene diez filas, y el cuadro indica cuántas líneas no muestra. La Escala de demanda se aplica además del multiplicador de demanda del escenario abierto, y nunca se guarda en el proyecto.</p>';
$ec_lang['lpn_guide_ds_find_term']='Buscar';
$ec_lang['lpn_guide_ds_find_def']='<p>Buscar explora escalas de demanda de 0 a 20, con una aproximación de 0.01, para hallar la mayor con la que todos los nudos elegidos mantienen al menos la Presión mínima permitida. Informa la escala y la presión más baja que se tiene allí, y lo mismo para el paso siguiente hacia arriba, donde la presión cae por primera vez por debajo del límite. Si las demandas tal como se ingresaron ya dejan un nudo por debajo del límite, la respuesta se marca con un signo de advertencia. Si todos los nudos mantienen el límite en 20, la respuesta lo dice. Detener termina una búsqueda sin respuesta. Presión mínima permitida es el mismo ajuste que el cuadro Presión mínima permitida en el resto del análisis de Caudal contra incendios.</p>';
$ec_lang['lpn_guide_ds_scope_term']='Nudos y el paso de tiempo';
$ec_lang['lpn_guide_ds_scope_def']='<p>Con Nudos seleccionados, solo se escalan y se verifican los nudos seleccionados en el mapa. Los demás nudos se dejan como están, y los que caen por debajo del límite se enumeran sin limitar la respuesta. Solo se escala el paso de tiempo que está en pantalla, y de él se toman los niveles y los estados. Para probar el pico, mueva el reloj a la demanda pico antes de ejecutar.</p>';
$ec_lang['lpn_guide_ds_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_ds_example_def']='<p>Abra el ejemplo Net1 y elija Agua, Analizar, Escalado de demanda…. En el paso de tiempo 0:00, haga clic en Buscar con el cuadro tal como se abre. Todos los nudos mantienen al menos 20 psi hasta una escala de demanda de 5.76, con la que la presión más baja es de 20.11 psi en el nudo N32. Con 5.77 es de 19.8 psi, y la búsqueda necesitó 13 resoluciones. Ingrese 3 como Escala de demanda y haga clic en Ejecutar: el nudo N32 baja de 111 psi, sin escalar, a 85.99 psi, y la línea L112 sube de 0.535 ft/sec a 3.13 ft/sec.</p>';
// The Pump energy chapter (Task 785). Held by dev/lpn-spike/user-guide-energy-harness.js.
$ec_lang['lpn_guide_en_read_term']='Cómo leer el informe';
$ec_lang['lpn_guide_en_read_def']='<p>Elija Agua, Informes, Energía de las bombas. El informe integra la potencia de cada bomba a lo largo de la última simulación de período extendido, de modo que necesita un Tiempo total de simulación mayor que 0 y un cálculo. Para cada bomba enumera el % de la ejecución, la Efic., los kW prom., los kW pico, los kWh y el Costo. Los kW prom. son el promedio mientras la bomba estuvo encendida, no durante los períodos inactivos. Debajo de la tabla están la Energía usada, el Costo de la energía, el Uso de potencia pico, el Costo de la demanda máxima y el Costo total. Una red sin bombas no tiene nada que informar.</p>';
$ec_lang['lpn_guide_en_set_term']='Qué determina los números';
$ec_lang['lpn_guide_en_set_def']='<p>Configuración, Energía contiene la Eficiencia de la bomba (por ciento), que se usa para toda bomba que no tenga curva de eficiencia, el Precio de la energía de un kilovatio-hora, un Patrón de precio que multiplica el precio en cada paso del patrón, el Cargo por demanda máxima por kW y un texto de Moneda que se imprime junto a los costos y no los convierte. Una bomba puede tener su propio precio, patrón de precio y curva de eficiencia en Propiedades. Los precios, el patrón, el cargo por demanda máxima, la Eficiencia de la bomba (por ciento) y los valores propios de una bomba están en la categoría Costo de energía, de modo que un escenario puede reemplazarlos. Cuando no se indica ningún precio, o el precio es cero, todo costo es cero y el informe lo dice. La aplicación no sugiere ningún precio.</p>';
$ec_lang['lpn_guide_en_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_en_example_def']='<p>Abra el ejemplo Net1, que tiene un tiempo total de simulación de 24:00, y calcule. Elija Agua, Informes, Energía de las bombas. La bomba L9 funciona durante el 65.71% de la ejecución con una eficiencia del 75%, y usa 96.22 kW en promedio, 96.71 kW en el pico y 1518 kWh. No se indica ningún precio, de modo que el costo es 0 y el informe lo dice. Ingrese 0.12 como Precio de la energía en Configuración, Energía, y calcule de nuevo: el costo de L9 es 182, el Costo total.</p>';
// The Contour plot chapter (Task 785). Held by dev/lpn-spike/user-guide-contour-harness.js.
$ec_lang['lpn_guide_ct_what_term']='Qué es el gráfico';
$ec_lang['lpn_guide_ct_what_def']='<p>Elija Agua, Gráficos, Isolíneas. La fila activa el gráfico en el escenario abierto, como un relleno suave con líneas rotuladas, usando la presión si los nodos aún no están coloreados, y abre el cuadro. El gráfico extiende los colores de los nodos a lo largo de las tuberías y hasta un múltiplo definido de la longitud mediana de las tuberías a su lado, desvaneciéndose en la parte exterior. No colorea a través de bombas, válvulas ni líneas cerradas. La línea bajo la clave de colores indica cuántos nodos y tuberías usa el gráfico, el alcance junto a las tuberías y el intervalo de las líneas. Con muy pocos nodos, lo dice.</p>';
$ec_lang['lpn_guide_ct_box_term']='El cuadro';
$ec_lang['lpn_guide_ct_box_def']='<p>Mostrar isolíneas, cuando está desmarcado, oculta el relleno y las líneas y conserva los colores de los nodos. El cuadro también contiene Colorear nodos por y Esquema de color, que son los mismos dos ajustes que en Configuración, Visualización, Colores de nudos, el Relleno (Ninguno, Suave o Bandas, que pinta cada clase de un solo color), la Opacidad del relleno, las Líneas de isolíneas con su Intervalo y sus Etiquetas, y el Margen en múltiplos de la longitud mediana de las tuberías. En un proyecto ubicado sobre la Tierra, el cuadro también puede tomar el terreno entre nodos de Mapbox DEM, después de que el visitante acepte enviar los números de los mosaicos del área de la red. Estos ajustes se guardan con el proyecto y un escenario puede reemplazarlos. El gráfico cambia solo la visualización, no la red.</p>';
$ec_lang['lpn_guide_ct_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_ct_example_def']='<p>Abra el ejemplo Net1 y elija Agua, Gráficos, Isolíneas. Los nodos se colorean por presión, y la línea bajo la clave de colores indica 9 nodos, 11 tuberías, un alcance de 2.5 veces la longitud mediana de las tuberías a su lado y líneas cada 5 psi. La bomba, la Línea 9, no es una de las 11 tuberías. Cuando Mostrar isolíneas está desmarcado, los nodos siguen coloreados por presión.</p>';
// The Run report, Status changes, and Full report chapters (Task 785). Held by dev/lpn-spike/user-guide-reports-harness.js.
$ec_lang['lpn_guide_rr_what_term']='Qué contiene el informe';
$ec_lang['lpn_guide_rr_what_def']='<p>Elija Agua, Informes, Ejecución. El informe es el texto que el motor de EPANET escribió para la última simulación de período extendido, en páginas. Comienza con el encabezado y el nombre de la red, luego cuenta los nudos, embalses, depósitos, tuberías, bombas y válvulas, luego indica las opciones de análisis y luego enumera el estado hidráulico de la ejecución con sus advertencias. El botón Copiar copia el texto.</p>';
$ec_lang['lpn_guide_rr_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_rr_example_def']='<p>Abra el ejemplo Net1, que ya fue calculado, y elija Agua, Informes, Ejecución. El resumen cuenta 9 nudos, 1 embalse, 1 depósito, 12 tuberías, 1 bomba y 0 válvulas. La fórmula de pérdida de carga es Hazen-Williams, el paso de tiempo hidráulico es de 1.00 h y la duración total es de 24.00 h.</p>';
$ec_lang['lpn_guide_st_what_term']='Qué se enumera';
$ec_lang['lpn_guide_st_what_def']='<p>Elija Agua, Informes, Cambios de estado. Cada fila da la hora de un cambio y el cambio: una bomba, válvula o tubería que ahora está abierta o ahora cerrada, o un depósito que ahora se está llenando, vaciando, lleno o vacío. También se enumera un paso de tiempo que no convergió por completo. La lista está en orden cronológico y contiene solo cambios, no todos los pasos. Se lee de la misma ejecución de período extendido que el panel Tablas y el Informe completo.</p>';
$ec_lang['lpn_guide_st_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_st_example_def']='<p>Abra el ejemplo Net1 y elija Agua, Informes, Cambios de estado. El depósito N2 se está llenando a la 1:00, vaciando a las 11:00, llenando a las 16:00 y vaciando a las 22:00. La bomba L9 está ahora cerrada a las 10:00, ahora abierta a las 15:00 y ahora cerrada a las 21:00.</p>';
$ec_lang['lpn_guide_fr_what_term']='Qué contiene la tabla';
$ec_lang['lpn_guide_fr_what_def']='<p>Elija Agua, Informes, Completo. La tabla tiene una fila por cada nodo y cada línea en cada paso de tiempo de informe, en las unidades del panel Tablas. Sus columnas son Tipo, ID, Demanda, Carga, Presión, Concentración de cloro, Caudal, Velocidad, Pérdida de carga, Carga de la bomba y Estado, y una celda queda en blanco donde el elemento no tiene esa magnitud. La lista Paso de tiempo elige el paso que se muestra, y Descargar CSV e Imprimir informe incluyen todos los pasos. Sin una simulación de período extendido, la tabla muestra la solución actual en un solo instante.</p>';
$ec_lang['lpn_guide_fr_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_fr_example_def']='<p>Abra el ejemplo Net1 y elija Agua, Informes, Completo. Los 24 elementos se enumeran en 25 pasos de informe, de 0:00 a 24:00, lo que da 600 filas. A las 0:00, el nudo 11 tiene una demanda de 150 gpm, una carga de 985.23 ft H2O y una presión de 119.26 psi.</p>';
// The Calibration chapter (Task 785). Held by dev/lpn-spike/user-guide-calibration-harness.js.
$ec_lang['lpn_guide_cal_what_term']='Qué compara el informe';
$ec_lang['lpn_guide_cal_what_def']='<p>Elija Agua, Informes, Calibración. La lista Parámetro elige lo que mide el archivo: Demanda, Carga, Presión, Concentración de cloro, Caudal o Velocidad. Se conserva un archivo para cada parámetro, y el botón Cargar archivo de calibración… abre un selector de archivos. El informe tiene tres páginas. Estadísticas da, para cada ubicación, el número de observaciones, la media observada, la media calculada, el error medio y el error RMS, y luego una fila Red para todas las ubicaciones juntas y la correlación entre las medias. El Gráfico de correlación ubica cada medición en su valor observado en horizontal y su valor calculado en vertical, con una línea diagonal donde ambos coinciden. Comparación de medias dibuja las medias observada y calculada como un par de barras para cada ubicación.</p><p>El valor calculado se lee de la ejecución de período extendido, y una medición entre dos pasos de informe se compara con el valor interpolado entre ellos. Una medición fuera de los tiempos que informó la ejecución se omite y se cuenta. Con una solución de un solo instante, cada medición se compara con ese único resultado, sea cual sea la hora que indique el archivo. El informe se completa después de calcular la red.</p>';
$ec_lang['lpn_guide_cal_file_term']='El archivo de calibración';
$ec_lang['lpn_guide_cal_file_def']='<p>Un archivo de texto con un ID de ubicación, una hora y un valor medido en cada línea. La hora se mide desde el inicio de la simulación, en horas decimales o en horas:minutos. Un punto y coma inicia un comentario. Una línea con solo una hora y un valor pertenece a la ubicación de la línea anterior. Los valores se leen en las unidades del proyecto, y el informe indica qué unidad. Una ubicación que no está en la red se enumera y sus mediciones se cuentan como omitidas, una línea que no se puede leer se enumera por su número de línea, y el resto del archivo se usa. Un archivo se conserva en la memoria solo para el proyecto abierto y esta carga de página. No se guarda con el proyecto ni en este dispositivo. Cuando el gráfico de Series de tiempo muestra la misma magnitud, los valores medidos se dibujan en él como anillos.</p>';
$ec_lang['lpn_guide_cal_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_cal_example_def']='<p>Abra el ejemplo Net1, calcúlelo y elija Agua, Informes, Calibración. Con Presión elegida, cargue un archivo que da el nudo 11 como 118.5 psi a las 0:00 y 121.0 psi a las 12:00, el nudo 31 como 110.2 psi a las 6:00 y 108.7 psi a las 18:00, y el nudo 99 como 50 psi a las 0:00, seguido de una línea que no es un dato. El informe dice que el archivo tiene 5 mediciones en 3 ubicaciones, nombra al nudo 99 como ausente de la red con 1 medición omitida, y enumera la línea ilegible. Estadísticas muestra el nudo 11 con 2 observaciones, una media observada de 119.75 psi, una media calculada de 116.53 psi, un error medio de 3.98 y un error RMS de 5.12. El nudo 31 tiene 109.45, 118.71, 9.26 y 9.79. La fila Red tiene 4 observaciones, un error medio de 6.62 y un error RMS de 7.81.</p>';
// Where the Guide lists its own keys, so that a search for one finds it.
$ec_lang['lpn_guide_using_heading']='Uso del manual del usuario';
$ec_lang['lpn_guide_keys_term']='Atajos de teclado del manual del usuario';
$ec_lang['lpn_guide_keys_def']='<table class="lpn-notes-table"><tbody><tr><td>?</td><td>Abrir el manual del usuario en el botón de la barra de herramientas o la fila de menú que está bajo el puntero o que tiene el foco. En cualquier otro lugar, lo abre con el campo de búsqueda seleccionado. La tecla no lo abre mientras se escribe en un campo ni mientras hay una pregunta abierta.</td></tr><tr><td>F1</td><td>Abrir el manual del usuario en la entrada del cuadro que tiene el foco.</td></tr><tr><td>Ctrl+K</td><td>Abrir el manual del usuario con el campo de búsqueda seleccionado y con cualquier texto seleccionado, hasta 80 caracteres, en él. Reemplaza el Ctrl+K propio del navegador, salvo mientras hay una pregunta abierta, cuando el manual del usuario no se abre.</td></tr><tr><td>/</td><td>Seleccionar el campo de búsqueda mientras el manual del usuario tiene el foco.</td></tr><tr><td>Esc</td><td>Mientras el manual del usuario tiene el foco, cerrarlo y volver al punto donde estaba.</td></tr></tbody></table>';
$ec_lang['lpn_guide_use_term']='Búsqueda, enlaces y qué se recuerda';
$ec_lang['lpn_guide_use_def']='<p>La búsqueda ignora las mayúsculas y los acentos y enumera las filas y entradas que contienen el texto escrito. Al elegir una fila se muestra dónde está ese control. Nunca ejecuta el control. En un teléfono, donde la barra de herramientas está plegada, una fila de la barra de herramientas abre la fila de menú que hace lo mismo.</p><p>La dirección de la página sigue a la entrada que se lee, como en <code>Looped-Network.php#guide</code>, de modo que se puede copiar como un enlace a esa entrada. Al cerrar el manual del usuario se borra. El manual del usuario recuerda en este navegador si estaba abierto, su posición y su tamaño, y si su lista de contenido está oculta. En un teléfono la lista de contenido comienza oculta.</p>';
// Under a toolbar button in the User guide, naming the menu row that does the same thing.
// {menu} becomes a path such as "Edit > Delete", drawn with chevrons; keep {menu} as it is.
$ec_lang['lpn_guide_also']='También en {menu}';
$ec_lang['lpn_guide_how_popup']='Propiedades se abre al seleccionar un elemento o texto.';
$ec_lang['lpn_guide_not_shown']='Este control no está en pantalla por ahora.';
// The box's two context headings. "Tables" holds the two table-help entries that used to sit only
// in the Notes list (lpn_notes_6/7, moved rather than duplicated); "Map" is new -- the digit tool
// keys, Undo and the zoom keys had never been gathered anywhere before.
$ec_lang['lpn_hotkeys_tables_heading']='Tablas';
$ec_lang['lpn_hotkeys_map_heading']='Mapa';
$ec_lang['lpn_hotkeys_map_term']='Atajos de teclado del mapa';
// Same shape as lpn_notes_7_def: one table, one row per key. The ten digits are LPN_TOOL_KEYS in
// js/looped-network.js; Select also answers to Esc and Delete to the Delete key
// (LPN_TOOL_ALT_KEYS); Ctrl+Z is undo(); +/- and = are keyZoom() (ROADMAP Task 682).
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>0 o Esc</td><td>Seleccionar.</td></tr><tr><td>2</td><td>Agregar un nudo.</td></tr><tr><td>3</td><td>Agregar un embalse.</td></tr><tr><td>4</td><td>Agregar un depósito.</td></tr><tr><td>5</td><td>Agregar una tubería.</td></tr><tr><td>6</td><td>Agregar una bomba.</td></tr><tr><td>7</td><td>Agregar una válvula.</td></tr><tr><td>8</td><td>Agregar un cliente.</td></tr><tr><td>9</td><td>Agregar texto.</td></tr><tr><td>Delete</td><td>Eliminar la selección.</td></tr><tr><td>Ctrl+Z</td><td>Deshacer el último cambio.</td></tr><tr><td>+ o =</td><td>Acercar.</td></tr><tr><td>-</td><td>Alejar.</td></tr></tbody></table>';
// The W row of the Map table. Its own key, spliced into the table by Looped-Network.php, because a new row in
// lpn_hotkeys_map_def is new markup that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_zoomwin_def']='Ventana de zoom: arrastre un rectángulo en el mapa para acercar a esa área.';
// The menu chords (Task 748): Alt+Shift+letter on Windows and Linux, Ctrl+Option on a Mac, and F10.
// Exactly two rows (Tom, 2026-10-03: "show only the Alt+Shift and the F10"); the letters themselves
// are assigned per language by menuMnemonics() and shown on the menus, never listed here.
// A separate block rather than rows in lpn_hotkeys_map_def, because a new row there is new markup
// that 'lang markup matches English' refuses until all 26 languages carry it.
$ec_lang['lpn_hotkeys_menu_heading']='Menús';
$ec_lang['lpn_hotkeys_menu_term']='Atajos de teclado de los menús';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Mayús+letra</td><td>Abre el menú con esa letra; luego presione la letra de una fila para elegirla. Las letras se muestran mientras usa el teclado. En un Mac, use Ctrl+Opción.</td></tr><tr><td>F10</td><td>Ir a la barra de menús.</td></tr></tbody></table>';
// The Screenshot keys. A separate block, for the reason given above the menu block.
$ec_lang['lpn_hotkeys_snip_heading']='Captura de pantalla';
$ec_lang['lpn_hotkeys_snip_term']='Atajos de teclado de la captura de pantalla';
$ec_lang['lpn_hotkeys_snip_def']='<table class="lpn-notes-table"><tbody><tr><td>S</td><td>Recortar, mientras Captura de pantalla está abierta.</td></tr><tr><td>E</td><td>Borrador, en la vista de marcado.</td></tr><tr><td>Ctrl+Z, Ctrl+Y</td><td>Deshacer y rehacer, en la vista de marcado.</td></tr><tr><td>Esc</td><td>Cancelar un recorte, o salir del borrador. En la vista de marcado, ciérrela cuando no haya nada dibujado.</td></tr></tbody></table>';
// ---- "Something wrong here?" (ROADMAP Tasks 207 and 768) ----
// Two sites, one behaviour -- a standing cell in the map's bottom strip, and the same control inside
// the solver's diagnostic box when one is on screen. The first click opens a box; Send is the second.
// The thank-you must never imply an answer: a reply comes only to somebody who left an address.
$ec_lang['lpn_wrong_btn']='¿Algo está mal aquí?';
// The standing message's own Hide control. A hidden message leaves the map and waits as the top row of the
// message history (the down-arrow glyph), marked by lpn_msglog_hidden, with lpn_msglog_unhide to bring it back.
$ec_lang['lpn_status_dismiss']='Ocultar este mensaje';
$ec_lang['lpn_msglog_hidden']='Oculto';
$ec_lang['lpn_msglog_unhide']='Mostrar';
$ec_lang['lpn_status_hidden_tip']='Mostrar de nuevo en el mapa el mensaje oculto.';
// Rewritten for the two-click box (Task 768); TGH's 2026-09-07 wording described one press.
$ec_lang['lpn_wrong_tip']='Informar un error en esta página. Se abre un cuadro para elegir el problema, agregar un comentario e ingresar una dirección de correo electrónico si se desea una respuesta. Todos los campos son opcionales, y no se envía nada hasta que presione Enviar.';
$ec_lang['lpn_wrong_thanks']='Gracias. Se recibió su informe.';
// The box "Something wrong here?" opens (ROADMAP Task 768). Every field is optional; Send with
// nothing in it posts only the anonymous tally the button always posted. The four picks are canned
// phrases a visitor may toggle in any combination. lpn_fb_sends must stay true to send-feedback.php
// and to the "Messages you send us" row of privacy.php.
$ec_lang['lpn_fb_intro']='Mensajes predefinidos (opcional). No se envía nada hasta que presione Enviar.';
$ec_lang['lpn_fb_pick_numbers']='Los números parecen incorrectos';
$ec_lang['lpn_fb_pick_broken']='Algo no funcionó';
$ec_lang['lpn_fb_pick_wording']='La redacción o la traducción es incorrecta';
$ec_lang['lpn_fb_pick_confusing']='Esto resulta confuso';
$ec_lang['lpn_fb_comment']='Comentarios (opcional)';
$ec_lang['lpn_fb_email']='Correo electrónico (opcional, solo si desea una respuesta)';
$ec_lang['lpn_fb_sends']='Qué se envía: el nombre de esta página, su idioma, la versión del sitio, el código del mensaje del mapa si hay uno, y lo que usted eligió o escribió. Nunca su dibujo ni su red. Su dirección de correo electrónico se usa solo para responderle.';
$ec_lang['lpn_fb_send']='Enviar';
$ec_lang['lpn_fb_sending']='Enviando…';
$ec_lang['lpn_fb_failed']='El mensaje no nos llegó. Lo que escribió sigue aquí, así que puede intentarlo de nuevo.';
$ec_lang['lpn_fb_bad_email']='Esa dirección de correo electrónico no parece correcta. Corríjala o déjela vacía.';
$ec_lang['lpn_fb_busy']='Han llegado demasiados mensajes en los últimos minutos. Lo que escribió sigue aquí, así que puede intentarlo más tarde.';
$ec_lang['lpn_status_example_opened']='Se abrió {name} como copia. Guárdela con Archivo, Guardar como.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Esta página no pudo calcular el tamaño del área de dibujo, así que el mapa muestra la última vista que pudo calcular. Cambiar el tamaño de la ventana hace que lo intente de nuevo. Si esto sigue ocurriendo, la causa habitual es una extensión del navegador que bloquea las mediciones de la página.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Red básica, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Dos embalses, una bomba y un pequeño lazo. Litros por segundo, con metros y milímetros.';
$ec_lang['lpn_ex_basic_us_title']='Red básica, gpm (EE. UU.)';
$ec_lang['lpn_ex_basic_us_desc']='Dos embalses, una bomba y un pequeño lazo. Galones por minuto, con pies y pulgadas.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 con controles basados en reglas';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='Un ejemplo ficticio de EPANET con cloro, 1 embalse y 1 depósito.';
$ec_lang['lpn_ex_net1_si_title']='EPANET Net1 con controles basados en reglas, L/s (SI)';
$ec_lang['lpn_ex_net1_si_desc']='Litros por segundo, con metros y milímetros. Un ejemplo ficticio de EPANET convertido de galones por minuto, pies y pulgadas, con cloro, 1 embalse, 1 depósito, 1 bomba y dos controles basados en reglas.';
$ec_lang['lpn_ex_net2_si_title']='EPANET Net2, L/s (SI)';
$ec_lang['lpn_ex_net2_si_desc']='Litros por segundo, con metros y milímetros. Un ejemplo de EPANET en Branford, Connecticut, convertido de galones por minuto, pies y pulgadas: 35 nudos y 1 depósito, sin embalse, sin bomba y sin válvulas, de unos 2 km por 4 km. El fluoruro, una sustancia no reactiva, entra por una fuente.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Galones por minuto, con pies y pulgadas. Un ejemplo de EPANET en Branford, Connecticut: 35 nudos y 1 depósito, sin embalse, sin bomba y sin válvulas, de aproximadamente 1 milla por 2 millas. El fluoruro, una sustancia no reactiva, entra por una fuente.';
$ec_lang['lpn_ex_net3_si_title']='EPANET Net3, L/s (SI)';
$ec_lang['lpn_ex_net3_si_desc']='Litros por segundo, con metros y milímetros. Un ejemplo de EPANET en Novato, California, convertido de galones por minuto, pies y pulgadas, con el mapa mundial detrás: 92 nudos, 3 depósitos y 2 embalses, sin válvulas, de unos 8 km por lado. Una simulación de período extendido de 24 horas, con un rastreo de origen desde el embalse Lake.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3, gpm (US)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='Galones por minuto, con pies y pulgadas. Un ejemplo de EPANET en Novato, California, con el mapa mundial detrás: 92 nudos, 3 depósitos y 2 embalses, sin válvulas, de unas 5 millas por lado. Una simulación de período extendido de 24 horas, con un rastreo de origen desde el embalse Lake.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center, gpm (US)';
$ec_lang['lpn_ex_elm_street_desc']='Galones por minuto, con pies y pulgadas. Prescott Valley, Arizona: 17 nudos, 1 embalse y 1 bomba. Un sitio comercial resuelto para caudal contra incendios sumado a la demanda máxima diaria, en un solo momento, dibujado sobre un plano del sitio.';
$ec_lang['lpn_tool_undo']='Deshacer';
$ec_lang['lpn_confirm_example']='Esto agrega el ejemplo a la red que ya tiene. ¿Continuar?';
$ec_lang['lpn_field_diameter']='Diámetro';
$ec_lang['lpn_demand_tip']='Caudal extraído de la red en este nodo. Ingrese un número negativo para el caudal que se introduce en la red aquí.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Esta unidad define cómo se leen los datos de entrada';
$ec_lang['lpn_units_warn_lead']='{unit} es la unidad de lo que escribe para:';
$ec_lang['lpn_units_options_head']='Al cambiar una unidad:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='No destructivo';
$ec_lang['lpn_units_nondestructive_desc']='No destructivo: deja cada valor tal como está y lo reinterpreta en la nueva unidad.';
$ec_lang['lpn_units_destructive']='Destructivo';
$ec_lang['lpn_units_destructive_desc']='Destructivo: reescribe cada valor con una conversión matemática, de modo que la red se mantenga físicamente casi igual, dentro de la tolerancia de la conversión. Se pierden los valores originales. Deshacer los restablece.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='Valores ({n}) que ahora significan {unit}. No se reescribió nada.';
$ec_lang['lpn_status_converted']='Valores ({n}) reescritos a {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **THE NATURAL ENGLISH GOES ON THE CONTROL; the ultra-simple rendering goes to the translator**
// (Tom, 2026-08-18: *"'Input units' and 'Results units'... both more natural than the ultra simple
// English you used. While I like that you are thinking simple for translators, this should go in
// _syn and the more natural in English."*). That is the routing rule stated on a real case: simple
// English is for when an English reader would stumble, and here one would not.
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Longitud';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Coordenadas del mapa';
$ec_lang['lpn_units_mapcoords_deg']='grados';
$ec_lang['lpn_units_usft']='Pie topográfico de EE. UU.';
$ec_lang['lpn_units_elevhead']='Elevación y carga';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradiente de pérdida de carga';
$ec_lang['lpn_result_gradient_tip']='Pérdida de carga dividida entre la longitud de la tubería. Úselo para comparar tuberías de diferente longitud contra un mismo límite de diseño.';
$ec_lang['lpn_result_water_age']='Edad del agua';
$ec_lang['lpn_result_water_age_tip']='Tiempo que ha pasado en el sistema el agua que llega a este punto. Donde se juntan caudales, el número es el promedio de las edades que llegan, ponderado por caudal. En un depósito es la edad promedio del agua que contiene, por lo que un depósito que se renueva lentamente suele tener el agua más vieja de una red. No hay un límite normativo con el cual compararlo, así que evalúelo con respecto a las condiciones del sistema que se modela.';
$ec_lang['lpn_result_source_share']='Aporte de fuente';
$ec_lang['lpn_result_source_share_tip']='Parte del agua que llega a este punto y que provino del nodo de rastreo. Esto es lo que reporta el análisis Rastreo de fuente.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Edad promedio del agua';
$ec_lang['lpn_result_avg_source_share']='Aporte promedio de fuente';
$ec_lang['lpn_result_avg_concentration']='Concentración promedio';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Factor de fricción';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Tasa de reacción';
$ec_lang['lpn_result_status']='Estado';
$ec_lang['lpn_result_status_open']='Abierto';
$ec_lang['lpn_result_status_closed']='Cerrado';
$ec_lang['lpn_result_head']='Carga';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Energía potencial del agua en este nodo, expresada como una altura de columna de agua. Es una altura absoluta, mientras que la presión es una medición manométrica.';
// A tank's depth and usable volume (Task 783). Depth is head minus the tank bottom, which is our
// Elevation. Volume is zero at the Lowest water depth, so it is NOT EPANET's tank volume, which also
// counts the water below the lowest water depth (that water is in the mixing volume, it just cannot be drawn down).
$ec_lang['lpn_result_depth']='Profundidad';
$ec_lang['lpn_result_depth_tip']='Profundidad del agua en el depósito en el momento mostrado, medida hacia arriba desde el fondo del depósito: la carga menos la elevación del depósito.';
$ec_lang['lpn_result_tank_volume']='Volumen disponible';
$ec_lang['lpn_result_tank_volume_tip']='Volumen de agua por encima de la profundidad de agua mínima, por lo que es cero a esa profundidad. El volumen de depósito de EPANET incluye también el agua por debajo de la profundidad de agua mínima, que sigue contando para la mezcla y la edad del agua, de modo que la elevación del depósito permanece en el fondo del depósito.';
$ec_lang['lpn_result_pressure']='Presión';
$ec_lang['lpn_result_flow']='Caudal';
$ec_lang['lpn_result_velocity']='Velocidad';
$ec_lang['lpn_result_headloss']='Pérdida de carga';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Restablece solo la configuración de este proyecto. El dibujo y los demás proyectos no cambian. Para reutilizar un conjunto de ajustes, guarde un archivo de proyecto que contenga solo configuración.';
$ec_lang['lpn_reset_all_tip']='Elimina todos los proyectos, todas las imágenes de fondo, toda la configuración y sus unidades elegidas, y luego recarga la página exactamente como la ve un visitante por primera vez. Este es el único restablecimiento que borra todo.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Esta calculadora guarda las unidades del proyecto y los datos de entrada tal como se ingresaron, pero antes convertía los números a SI para guardarlos. Este proyecto se guardó antes de ese cambio, así que sus números se guardaron en SI. ¿Convertirlos una última vez a las unidades actuales? Para ayudar a decidir, aquí hay algunos diámetros que se convertirían, con sus valores antes y después:';
$ec_lang['lpn_v2_restore_yes']='Convertir';
$ec_lang['lpn_v2_restore_never']='No. No preguntar de nuevo.';
$ec_lang['lpn_v2_restore_no']='Cerrar para revisar primero las unidades actuales';
$ec_lang['lpn_storage_too_new']='Este proyecto fue guardado por una versión más reciente de la página, por lo que no se puede abrir aquí.';
// ---- Projects as tabs, files as files (ROADMAP Task 211) ----
// The whole surface below follows one rule: THE ASTERISK DECIDES. A tab wearing an asterisk has
// something that is not in a file, so closing it asks first; a tab without one closes silently. A
// browser project always wears one (it is in no file at all); a file project wears one only while it
// has unsaved changes. Nothing here needs the words "browser project" or "file project" -- those are
// our words for talking about the code, and the user sees only a name, an asterisk, and a file
// extension.
// The menu bar. The MENU holds everything; the TOOLBAR is the high-use subset of it, which is the
// conventional relationship and the reason the duplication between them is correct rather than
// sloppy. Names are the ones every desktop application has used for thirty years -- this is a
// paradigm we are ADOPTING, not inventing, and the point of adopting one is that nobody has to be
// taught it (Tom, 2026-08-04).
$ec_lang['lpn_tool_file']='Archivo';
$ec_lang['lpn_menu_edit']='Editar';
$ec_lang['lpn_menu_insert']='Insertar';
// **VIEW BECAME MAP** (Tom, 2026-08-27). He had found the terrain-elevation row filed under View
// and said what it cost: *"our menu system is getting confusing and complicated with this under
// View when it really has something to do with mapping, but nothing to do with view."* The menu now
// holds the drawing's frame, the pictures behind it, where on Earth it is, and the elevations read
// off that ground -- and only the first of those is a "view". EPANET files its own Dimensions and
// Backdrop under View and nobody finds that strange, so this is a choice rather than a correction;
// Map is simply more literal, and it is the word Tom picked.
//
// The 26 translations of this key were DELETED with the rename, not carried across: every one of
// them was the word "View" in its own language, and a translated "View" under a key drawn as Map
// would be the one kind of wrong a reader cannot see. Absent is the correct untranslated state.
$ec_lang['lpn_menu_map']='Mapa';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='Mostrar mapa de calles';
$ec_lang['lpn_basemap_satellite_show']='Mostrar imágenes satelitales';
$ec_lang['lpn_basemap_topo_show']='Mostrar mapa topográfico';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='georreferenciado';
$ec_lang['lpn_xymap']='local';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Convertir como…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Copia de {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:4326), not a fourth case; EPSG:3857 is a
// projected system in meters since Task 775.
$ec_lang['lpn_convas_title']='Convertir como';
$ec_lang['lpn_convas_coordsys_tip']='El sistema de coordenadas al que se convierte la copia. Cuando difiere del de este proyecto, siguen dos pasos de colocación. En un proyecto ya georreferenciado, ambos pasos se abren completados, listos para aceptarse o cambiarse.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Actual: {crs}';
$ec_lang['lpn_convas_epsg']='Sistema de coordenadas EPSG';
$ec_lang['lpn_convas_epsg_tip']='Elija un sistema de coordenadas del registro EPSG. WGS 84 (EPSG:4326), latitud y longitud, es la opción sugerida. WGS 84 / Pseudo-Mercator (EPSG:3857), comúnmente llamado Web Mercator, da x e y en metros, y sus distancias en el mapa exceden las distancias sobre el terreno al alejarse del ecuador. Las longitudes de tubería se calculan como distancias sobre el terreno en cualquiera de los dos sistemas.';
$ec_lang['lpn_convas_unnamed']='Georreferencia sin nombre (local)';
$ec_lang['lpn_convas_unnamed_tip']='Coordenadas locales en la unidad de longitud, con el mapa mundial adjunto.';
$ec_lang['lpn_convas_none_tip']='Coordenadas locales en la unidad de longitud, sin mapa mundial por ahora.';
$ec_lang['lpn_convas_units_tip']='Las unidades a las que se convierte la copia.';
$ec_lang['lpn_convas_round']='Redondear los valores convertidos';
$ec_lang['lpn_convas_round_tip']='El paso al que se redondea, aplicado solo a los números que reescribe esta conversión. Los valores cuya unidad no cambia se dejan tal cual.';
$ec_lang['lpn_convas_round_none']='Sin redondeo';
$ec_lang['lpn_convas_round_flow']='Demanda y caudal';
$ec_lang['lpn_convas_label_col']='Sufijo';
$ec_lang['lpn_convas_label_tip']='Texto agregado después de este valor en las etiquetas del mapa de la copia, como \' mm\' o \' gpm\'. Se rellena previamente con la unidad elegida arriba; bórrelo para no tener sufijo.';
$ec_lang['lpn_convas_oneway']='Convertir de regreso es una segunda conversión, no deshacer. Un número convertido y vuelto a convertir puede no regresar exactamente como se escribió.';
$ec_lang['lpn_convas_ok']='Convertir';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} es uno de los pocos sistemas de coordenadas de la lista sin información de proyección utilizable, así que no se puede convertir hacia él ni desde él. No se convirtió nada.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='La copia convertida es {name}. El proyecto original no cambió.';
$ec_lang['lpn_convas_cancelled']='No se convirtió nada. La copia se cerró, y el proyecto original no cambió.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Copia este proyecto a una pestaña nueva y convierte la copia al sistema de coordenadas y las unidades que elija. Cuando el sistema de coordenadas cambia, un asistente lo guía para acercar el mapa detrás de su red de forma aproximada, y luego escalar y girar su red sobre el mapa con más precisión. Este proyecto se deja exactamente como está. Para georreferenciar sin convertir nada, use en cambio Mapa, Mapa mundial, Adjuntar.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Este proyecto ya está georreferenciado, así que la red ya está en el mapa y no se ha movido nada. Compruebe que esté en el lugar correcto, y luego presione el botón Colocar el modelo aquí y el botón Mantener esta ubicación.';
$ec_lang['lpn_georef_intro']='Colocar el modelo lleva dos pasos. El paso 1 es aproximado: el modelo permanece fijo en la pantalla mientras usted desplaza y acerca el mapa detrás de él, hasta que el sitio quede bajo el modelo con aproximadamente la escala correcta. Este paso no tiene giro. El paso 2 es preciso: arrastre, cambie el tamaño y gire el modelo mismo. El proyecto empieza sobre un mapa del mundo entero, así que primero encuentre la ubicación, y luego presione el botón Colocar el modelo aquí.';
$ec_lang['lpn_georef_adjust']='El modelo ya está adjunto al mapa, así que se mueve con el mapa. Arrastre el modelo para moverlo, arrastre una esquina para cambiar su tamaño, o arrastre el tirador redondo encima del modelo para girarlo. O ingrese abajo la distancia sobre el terreno y el ángulo de giro.';
$ec_lang['lpn_georef_step1']='Paso 1 de 2 — rápido';
$ec_lang['lpn_georef_step2']='Paso 2 de 2 — preciso';
$ec_lang['lpn_georef_step1_hint']='El proyecto permanece fijo en la pantalla. Desplace y acerque el mapa que está debajo hasta que muestre aproximadamente la ubicación correcta a aproximadamente la escala correcta, y luego presione el botón Colocar el modelo aquí.';
$ec_lang['lpn_georef_detach']='Volver a levantarlo';
$ec_lang['lpn_georef_size_prompt']='¿Aproximadamente cuán ancho es el sitio, a lo largo de todo el proyecto?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name}: {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Atajo: presione {key}.';
$ec_lang['lpn_tool_key_hint_two']='Atajo: presione {key} o {key2}.';
$ec_lang['lpn_tool_add_chain_tip']='Encadene nudos y tuberías: especifique un punto del mapa para agregar un nudo, luego especifique cada punto siguiente para agregar una tubería y un nudo. Especifique un nodo existente para continuar desde él. Presione Esc para terminar la cadena.';
// The Shape tool (Task 779). The word is Tom's: "we call it a 'Shape'".
$ec_lang['lpn_tool_add_shape']='Figura';
$ec_lang['lpn_tool_add_shape_tip']='Dibujar un punto, una polilínea o un polígono en el mapa. Una Figura es una anotación y no forma parte de la red. Especifique cada punto y luego especifique de nuevo el último punto, presione Enter o haga clic con el botón derecho para terminar. Especifique de nuevo el primer punto para cerrar la Figura como un polígono.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Seleccionar por área: ventana, lazo o polígono.';
$ec_lang['lpn_area_selected']='{n} seleccionados.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='No se encontró nada en esa área.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Agregue y quite vértices de tubería. Especifique un punto en una tubería para agregar un vértice, seleccione un vértice para quitarlo y arrastre un vértice para moverlo. Un vértice cambia la longitud automática, pero no agrega ni cambia pérdidas menores (localizadas).';
$ec_lang['lpn_tool_undo_tip']='Longitud del historial de deshacer = 20 acciones';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Ajustar toda la red a la ventana del mapa. Para acercar a un rectángulo que usted arrastre, presione W o seleccione el triángulo pequeño en la esquina del botón Ver todo de la barra de herramientas. Vea también los controles de zoom en la parte superior derecha del mapa.';
$ec_lang['lpn_tool_zoom_selection_tip']='Ajustar los elementos seleccionados a la ventana del mapa. Primero seleccione uno o más elementos.';
$ec_lang['lpn_tool_zoom_window_tip']='Especifique esquinas o arrastre un rectángulo. Presione de nuevo para Ver todo.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Acercar. Atajo: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Alejar. Atajo: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Buscar y reemplazar, simple o complejo';
// **"Toolbar"** (Tom renamed it from "Toolbar key" to "Toolbar" on 2026-09-30).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. The row earns its place.
$ec_lang['lpn_help_icons']='Barra de herramientas';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Visibilidad';
$ec_lang['lpn_color_legend_open_tip']='Presione para abrir la configuración de colores y cambiar estos colores.';
$ec_lang['lpn_color_node_field']='Colorear nodos por';
$ec_lang['lpn_color_link_field']='Colorear tuberías por';
$ec_lang['lpn_color_ramp_sequential']='Secuencial';
$ec_lang['lpn_color_ramp_diverging']='Divergente';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Número de rangos';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Asignación de rangos';
$ec_lang['lpn_color_ranges_note']='Los límites de abajo quedan fijos una vez establecidos; no siguen los resultados a medida que cambian. Elegir un método de Asignación de rangos arriba establece los límites a partir del estado actual del sistema. Si cambia cualquier valor a mano, el método de arriba pasa a ser Manual.';
$ec_lang['lpn_color_criterion_note']='Este método toma sus límites de una norma de diseño, así que el número de colores queda fijo mientras esté elegido este método.';
$ec_lang['lpn_color_break_number']='Un límite debe ser un número. El mapa no se modificó.';
$ec_lang['lpn_color_break_order']='Cada límite debe ser mayor que el anterior. El mapa no se modificó.';
$ec_lang['lpn_color_break_count']='Debe haber un límite menos que el número de colores. El mapa no se modificó.';
$ec_lang['lpn_color_ramp_qualitative']='Cualitativo';
$ec_lang['lpn_color_ramp_rainbow']='Arcoíris';
$ec_lang['lpn_color_ramp_rainbow_eg']='coincide con EPANET';
$ec_lang['lpn_color_example_material']='Material';
$ec_lang['lpn_color_ramp_ylgnbu']='Amarillo a azul';
$ec_lang['lpn_color_ramp_rdylbu']='Rojo a azul, pasando por amarillo';
$ec_lang['lpn_georef_drop']='Colocar el modelo aquí';
$ec_lang['lpn_georef_finish']='Mantener esta ubicación';
$ec_lang['lpn_georef_scale']='Distancia real por unidad de dibujo';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Se calcula automáticamente. Edítelo para cambiarlo. Ingrese 1 para usar las coordenadas del archivo sin cambios como distancia sobre el terreno, por ejemplo en un archivo sin sistema de coordenadas.';
$ec_lang['lpn_georef_rotation']='Rotación antihoraria (grados)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Giro antihorario de todo el modelo, para alinearlo con el nuevo sistema de coordenadas.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='¿Colocar el modelo aquí de forma permanente? Aún podrá arrastrar elementos individuales después, pero continuar ahora convierte todas las coordenadas a la vez. Para recuperar las coordenadas anteriores, vuelva al proyecto original y cierre este sin guardar.';
$ec_lang['lpn_georef_done']='Este proyecto ahora está en el nuevo sistema de coordenadas. Puede seguir arrastrando cualquier elemento que necesite un ajuste adicional.';
$ec_lang['lpn_georef_backdrop_unrotated']='La imagen de fondo se movió y cambió de tamaño junto con el modelo, pero no se pudo rotar. Use Mapa, Imagen de fondo, Mover para alinearla.';
$ec_lang['lpn_georef_empty']='Ese archivo no tiene ninguna red, así que no hay nada que colocar.';
$ec_lang['lpn_georef_unavailable']='La herramienta de colocación no se cargó. Recargue la página e inténtelo de nuevo.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Termine la conversión con el botón "Mantener esta ubicación", o presione Cancelar, antes de cambiar de proyecto. La colocación se aplica solo a este proyecto.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Termine la colocación con el botón "Conservar esta colocación", o presione Cancelar, antes de guardar. El proyecto todavía se está colocando, así que lo que se ve en la pantalla aún no es lo que se escribiría en el archivo.';
$ec_lang['lpn_goto_menu']='Ir a una latitud y longitud…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Latitud y longitud, en ese orden, separadas por una coma o un espacio';
$ec_lang['lpn_goto_bad']='No se pueden leer las coordenadas. Inténtelo de nuevo. Ejemplos: 38,-122 o 38.122 o 38 -122';
$ec_lang['lpn_georef_goto']='Ir a…';
$ec_lang['lpn_georef_twopt']='Usar dos puntos conocidos';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Coloque el modelo con exactitud cuando se conocen la latitud y la longitud verdaderas de dos puntos del dibujo. Especifique uno de ellos, ingrese su latitud y su longitud, y luego haga lo mismo con un segundo punto. La posición, la escala y el giro se calculan a partir de esos dos puntos. Presione de nuevo para cancelar, o presione Esc.';
$ec_lang['lpn_georef_twopt_pick1']='Especifique un punto de su dibujo cuya latitud y longitud conozca.';
$ec_lang['lpn_georef_twopt_pick2']='Ahora especifique un segundo punto conocido, lo más alejado posible del primero.';
$ec_lang['lpn_georef_twopt_same']='Ese es el punto que eligió primero. Elija uno diferente.';
$ec_lang['lpn_georef_twopt_done']='El modelo ahora está colocado sobre los dos puntos que indicó. Compruébelo y luego presione el botón Mantener esta ubicación.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Panel inferior';
$ec_lang['lpn_pane_toggle_tip']='Mostrar u ocultar el panel debajo del mapa. Contiene gráficos y una tabla para cada tipo de elemento.';
$ec_lang['lpn_pane_resize']='Arrastre para hacer el panel más alto o más bajo';
$ec_lang['lpn_pane_tab_junctions']='Nudos';
$ec_lang['lpn_pane_tab_reservoirs']='Embalses';
$ec_lang['lpn_pane_tab_tanks']='Depósitos';
$ec_lang['lpn_pane_tab_pipes']='Tuberías';
$ec_lang['lpn_pane_tab_pumps']='Bombas';
$ec_lang['lpn_pane_tab_valves']='Válvulas';
$ec_lang['lpn_pane_tab_tip']='Edite los elementos como una tabla tipo hoja de cálculo. Las columnas de resultados no se pueden editar. Vea Ayuda, Notas para los atajos de teclado.';
$ec_lang['lpn_pane_popout']='Abrir en un cuadro';
$ec_lang['lpn_pane_none']='Esta red todavía no tiene ninguno de estos.';
// **A PERSISTENT NOTE, NOT A HOVER TIP** (Tom, 2026-09-08, asking for wording "to the effect that
// 'This table is intended to be ready for asset entry and creation by pasting from a spreadsheet'").
// His own sentence would be FALSE today: panePasteAt() fills rows that already exist and cannot
// create one, so the shipped sentence says what the table does. It also gets its own key rather than
// joining lpn_pane_none, which six Library sections share and which create rows by an Add button.
// **It names Help and no row under it** (Tom, 2026-09-08, ruling on the shipped wording): there
// are two Help buttons, so "Help, Fix something" reads as a path a reader cannot follow from where
// they are standing. Naming the menu alone is the part that is true from both of them.
// What the two alignment cells say for a Text that is attached to an asset. It is a STATE, not a
// value: an attached text takes its alignment from the side of the leader it sits on, so the stored
// centre/middle is not the answer and showing it read as a control that had stopped working. The
// cell carries lpn_field_text_attached_tip, which is the property popup's own sentence for the same
// rule.
$ec_lang['lpn_pane_text_attached']='Adjunto';
$ec_lang['lpn_pane_not_used']='No usado';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtrado por {q}. Mostrando {n} de {all}.';
$ec_lang['lpn_pane_filter_clear']='Mostrar todo';
// Added to the filtered table's line (Task 738): rows edited since Filter in table was pressed stay
// in the table even when they no longer match, dimmed and marked, until it is pressed again. {n} is
// how many. Worded as a label and a count so no plural form is needed.
$ec_lang['lpn_pane_filter_stale']='Filas que ya no coinciden: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Nada en esta tabla coincide con el filtro.';
// Selection only (Task 757): the Tables pane filtered to what is selected on the map. Parallel to
// lpn_pane_filter_note. The line names the Find filter too when both are on.
$ec_lang['lpn_pane_filter_sel_note']='Solo la selección. Se muestran {n} de {all}.';
$ec_lang['lpn_pane_filter_sel_and']='Filtrado por {q} y solo la selección. Se muestran {n} de {all}.';
$ec_lang['lpn_pane_filter_sel_none']='Ninguno de los elementos seleccionados está en esta tabla.';
$ec_lang['lpn_pane_sel_only']='Solo la selección';
$ec_lang['lpn_pane_sel_only_none']='No hay elementos seleccionados. Primero seleccione elementos en el mapa.';
// Show scenarios (Tom, 2026-10-05): the table's cell menu switch that lists every asset once per
// scenario, with a Scenario column after ID.
$ec_lang['lpn_pane_scn_show']='Mostrar escenarios';
// Two switches on the cell menu while Show scenarios is on (Tom, 2026-10-07): keep only the rows whose
// scenario holds a value of its own in this table, and keep only the open scenario's rows.
$ec_lang['lpn_pane_scn_ov_only']='Solo valores específicos';
$ec_lang['lpn_pane_scn_cur_only']='Solo el escenario actual';
$ec_lang['lpn_pane_inactive_show']='Incluir topología inactiva';
// The line above a table while either switch is on, beside the filter's own Show all. {filters} is one
// or both of the two switch names, joined by a comma; {n} the rows showing, {all} the rows without them.
$ec_lang['lpn_pane_scn_filter_note']='{filters}. Se muestran {n} de {all}.';
// The cell menu's item that removes the selected cells' scenario overrides, so each reads what its
// scenario inherits (Tom, 2026-10-06). Greyed when no selected cell holds one.
$ec_lang['lpn_ovm_child_ask']='¿Borrar los valores específicos de los escenarios secundarios ({n} en total)?';
$ec_lang['lpn_ovm_child_tip']='Los escenarios secundarios reemplazan este valor ({n} en total). Haga clic para borrar sus valores específicos.';
$ec_lang['lpn_ovm_dot_clear']='Haga clic para borrarlo.';
$ec_lang['lpn_ovm_dot_set']='Heredado. Haga clic para convertirlo en un valor específico de este escenario, con el valor que se muestra.';
$ec_lang['lpn_pane_clear_override']='Borrar valor del escenario';
// The tip on a table cell holding a value set in its row's scenario (Tom, 2026-10-06: "Demand alt.:
// Max day"). {category} is an lpn_alt_cat_* name; {alternative} is the alternative's name, which
// in Basic mode is its scenario's.
$ec_lang['lpn_pane_scn_alt_tip']='{category}, alternativa: {alternative}';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Acercar y seleccionar';
$ec_lang['lpn_goto_on_map']='Mostrar en el mapa';
$ec_lang['lpn_pane_select_on_map']='Seleccionar en el mapa';
$ec_lang['lpn_pane_unselect_on_map']='Anular selección en el mapa';
$ec_lang['lpn_pane_print']='Imprimir tabla';
// Tom, 2026-10-06. Copy with headings puts the heading line, unit included, above the selected cells; plain
// Copy never does. The two Export rows download the whole table as shown.
$ec_lang['lpn_pane_copy_heads']='Copiar con encabezados de columna';
// Tom, 2026-10-07. File, Export to, ODS/XLSX/CSV file: a box asking which tables and which scenarios.
// {format} is ODS, XLSX or CSV, the file format's own name, never translated.
$ec_lang['lpn_export_table_title']='Exportar a {format}';
$ec_lang['lpn_export_table_current']='Actual';
$ec_lang['lpn_export_table_all']='Todas';
$ec_lang['lpn_export_table_go']='Exportar';
$ec_lang['lpn_export_table_scn_note']='Los resultados se exportan solo para el escenario calculado por última vez.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them. lpn_clean_map and
// lpn_clean_map_tip are back since Task 805 for a DIFFERENT command (it hides controls, not readouts).
// THE PROJECT MENU (ROADMAP Task 467). Tom, 2026-08-20: "Maybe we can have a Project menu with
// Settings, Library, and Report under it?" Its rows borrow the names they already have --
// lpn_tool_settings, lpn_library_menu, lpn_time_run_report -- so a door cannot drift from the thing
// it opens. EPANET and epanet-js both say "project" for a network and its settings; "model" was the
// alternative and Tom kept Project.
// ROADMAP Task 523, Tom 2026-08-24. **The KEY is still lpn_menu_project and that is deliberate** --
// renaming it would drag the DOM id, two browser-pass specs and 27 lang files along for no
// user-visible gain, and `lpn_menu_project` is still what the menu bar's own element is called.
//
// "Water", not "Project": Project is a hair's breadth from File, and this menu is not about the
// document at all -- it is the business logic, and the business is water. It is also the one entry
// on the bar this page invents (File / Edit / Insert / View / Help are conventions that only pay
// while they are the conventions everyone knows), so it is the only one a rename costs nothing in
// familiarity. And it keeps EPANET's vocabulary off our surfaces, which is a standing rule here.
//
// NOT to be confused with `lpn_tab_menu` ('Project menu'), which really IS about the document and
// correctly keeps the word. Those two wearing one label was half the problem.
$ec_lang['lpn_menu_project']='Agua';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Todo lo específico del modelado de redes de agua (excepto los controles de reproducción de la animación)';
$ec_lang['lpn_tables_menu']='Tablas';
// Water > Morph (Task 781; Tom, 2026-10-14: *"I like the term 'Morph' (Transform) for this feature"*;
// first built as Change type, Tom, 2026-10-05: *"It would be nice to provide a tool under Water or Tables
// to Change node type for any asset, where if it has information that can't be ported to the new
// type, we alert and ask."*). The fly-out reuses lpn_tool_add_junction/_reservoir/_tank. The box it
// asks in lists one line per value lost: {id} is the asset's ID, {property} a field label the
// popup already uses, {value} the number or name with its unit, {scenario} a scenario's name.
// dev/asset-type.md.
$ec_lang['lpn_morph_menu']='Cambiar tipo';
$ec_lang['lpn_morph_tip']='Cambie los nodos seleccionados a nudos, embalses o depósitos, o las líneas seleccionadas a tuberías, bombas o válvulas. Cada uno conserva su ID, su posición, sus conexiones y todo valor que el nuevo tipo también tenga. Si se fuera a perder algo, se le pregunta antes.';
$ec_lang['lpn_morph_ok']='Cambiar';
// {ids} lists the selected assets of the other kind (nodes when a link type was chosen, and links
// when a node type was chosen), separated by commas.
$ec_lang['lpn_morph_other_kind']='Un nodo solo puede cambiar a otro tipo de nodo, y una línea solo a otro tipo de línea. No se cambió el tipo de: {ids}';
// The Properties row shown where a scenario morphs the asset (Task 781): the type it is in this
// scenario, beside the override marker.
$ec_lang['lpn_field_type']='Tipo';
$ec_lang['lpn_field_type_tip']='El tipo de este elemento en este escenario, definido con Cambiar tipo. Borre el valor específico para usar el tipo del escenario superior.';
$ec_lang['lpn_change_type_lost']='Se perderán estos valores:';
// The key to the lines under it (Tom, 2026-10-06: *"Provide a key for the loss report. 'ID: Lost entry'."*).
$ec_lang['lpn_change_type_key']='Cada línea: ID: la propiedad y el valor que se perderían';
$ec_lang['lpn_change_type_line']='{id}: {property} {value}';
$ec_lang['lpn_change_type_line_scenario']='{id}: {property} {value}, en el escenario {scenario}';
$ec_lang['lpn_change_type_line_alternative']='{id}: {property} {value}, en la alternativa {alternative}';
$ec_lang['lpn_change_type_more']='Y {n} más.';
// Heads the lines a tank-to-reservoir or reservoir-to-tank change states rather than loses: the
// water surface is carried, so the new head or water depth is listed with its value.
$ec_lang['lpn_change_type_surface']='Estos conservan la superficie del agua donde estaba. La carga de un embalse es la elevación del depósito más su profundidad de agua, y la profundidad de agua de un depósito es la carga del embalse menos su elevación:';
$ec_lang['lpn_change_type_meaning']='Estos controles y reglas evalúan un nodo que se está cambiando, y lo leerán de otra forma: un nudo se evalúa por su presión, y un depósito o embalse por su nivel de agua.';
// The link half (Tom, 2026-10-06: "Proceed."). Each heads a list of "ID: entry" lines.
$ec_lang['lpn_change_type_born']='Estos valores son nuevos, fijados como en un elemento recién dibujado:';
$ec_lang['lpn_change_type_no_curve']='{id}: sin curva de carga de la bomba, así que la bomba no agrega carga hasta que se elija una, y una exportación .inp la escribe como una tubería';
$ec_lang['lpn_change_type_becomes']='{id}: {property} {value}, en el escenario {scenario}, pasa a {new}';
$ec_lang['lpn_change_type_customers']='Solo una tubería atiende clientes, así que estos clientes se conectan en su lugar al nodo que se muestra entre paréntesis, donde su demanda ya está aplicada. Permanecen donde están dibujados, y su demanda no cambia:';
$ec_lang['lpn_change_type_setting']='Estos controles y reglas asignan o evalúan el ajuste de una línea que se está cambiando. Un ajuste es una magnitud distinta en una tubería, una bomba y una válvula, así que lo leerán de otra forma:';
$ec_lang['lpn_change_type_rules']='Estas líneas de reglas nombran una línea por su clase, y pasarán a nombrar su nueva clase:';
$ec_lang['lpn_tables_menu_tip']='Ver y editar los elementos en tablas en el panel inferior.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Ejecutar la simulación. Innecesario cuando "Recalcular automáticamente" está activado en Configuración, Cálculo, Hidráulica. Cuando Recalcular está desactivado, aparece un botón Calcular en la barra de herramientas.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Recalcular automáticamente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Desactívelo si el recálculo es demasiado lento. Mientras esté activado, el botón Calcular está oculto.';
// **AN EDIT SAYS NOTHING AT ALL WHEN THE SWITCH IS OFF** (Tom, 2026-09-19: *"Recalc off Old
// values: Leave in place stale. Don't clear. Trust the user."*). `lpn_manual_results_cleared`
// stood here for part of one day and is DELETED, English-only, never translated: it announced a
// clearing that no longer happens. With the box unticked an edit leaves the last answers exactly
// where they are and says nothing about them, because whether they are still worth reading is
// the user's judgement and not this page's. Do not write a replacement -- a grey-out or a
// "stale" marker is the same decision in quieter clothes.
// Says what it MEASURED and where the switch is, in that order. The number first, because a person
// who has just waited a second already knows something is slow and wants it confirmed, not
// explained. {secs} is one decimal.
$ec_lang['lpn_time_run_slow']='Esta red tardó {secs} s en calcularse, y está configurada para recalcularse después de cada cambio. Para detener eso y recuperar el botón Calcular, desactive «Recalcular automáticamente» en Configuración, bajo Cálculo, Hidráulica.';
$ec_lang['lpn_time_no_report']='Todavía no hay informe de ejecución. El informe es el informe de texto de EPANET, así que aparece una vez que se haya calculado esta red.';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Ayuda';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galería de capturas de pantalla';
$ec_lang['lpn_help_walkthroughs']='Tutoriales';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Eliminar red';
$ec_lang['lpn_confirm_delete_network']='¿Eliminar todos los nodos, tuberías y etiquetas de texto de este proyecto? La imagen de fondo, el nombre del proyecto y su configuración se conservan.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Buscar y reemplazar';
// Copy and Paste properties (Task 782; Tom, 2026-10-12: a clipboard, no confirmation). Identity and
// placement are never pasted.
$ec_lang['lpn_copy_props_menu']='Copiar propiedades';
$ec_lang['lpn_copy_props_done']='Se copiaron las propiedades de {id}.';
$ec_lang['lpn_copy_props_no_overrides']='No hay valores específicos para copiar.';
$ec_lang['lpn_copy_props_done_ov']='Se copiaron los valores específicos de {id} en este escenario.';
$ec_lang['lpn_paste_alt_created']='Se creó la alternativa {name} ({category}) para este escenario.';
$ec_lang['lpn_paste_props_menu']='Pegar propiedades en la selección';
$ec_lang['lpn_paste_props_off_none']='No se ha copiado nada. Haga clic con el botón derecho en un elemento, o manténgalo presionado, y elija Copiar propiedades.';
$ec_lang['lpn_paste_props_off_select']='Seleccione los elementos en los que pegar y luego elija Pegar propiedades en la selección.';
$ec_lang['lpn_paste_props_off_kind']='Ningún elemento seleccionado puede recibir las propiedades copiadas.';
$ec_lang['lpn_tsb_menu']='Gráfico de series de tiempo';
// The map's right-click (and long press) menu on a Text and on a dragged label (2026-10-14). Edit text
// opens the in-place editor; Reset position sends a dragged label or an attached Text home.
$ec_lang['lpn_ctx_edit_text']='Editar texto';
$ec_lang['lpn_ctx_reset_position']='Restablecer posición';
$ec_lang['lpn_ctx_reset_position_off_tip']='Solo se puede restablecer una etiqueta, o un texto adjunto, que se haya arrastrado desde su propia posición.';
$ec_lang['lpn_tsb_off_tip']='Necesita resultados de período extendido. Defina un Tiempo total de simulación en Configuración, Cálculo, Tiempo, y calcule.';
$ec_lang['lpn_tsb_close']='Cerrar gráfico';
$ec_lang['lpn_tsb_resize']='Arrastrar para cambiar el tamaño';
$ec_lang['lpn_tsb_quantity']='Magnitud para graficar';
$ec_lang['lpn_tsb_max']='Cierre un gráfico antes de abrir otro. Se mantienen abiertos hasta {n}.';
$ec_lang['lpn_paste_done_one']='Se pegaron las propiedades de {id} en {to}. Valores cambiados: {n}.';
$ec_lang['lpn_paste_done_many']='Se pegaron las propiedades de {id} en {m} elementos. Valores cambiados: {n}.';
$ec_lang['lpn_paste_skip_breakdown']='No se pegaron: {n} (la demanda es una lista de categorías).';
$ec_lang['lpn_paste_skip_valve']='No se pegaron: {n} (los tipos de válvula difieren).';
$ec_lang['lpn_find_title']='Buscar y reemplazar';
$ec_lang['lpn_find_scope']='Qué buscar';
$ec_lang['lpn_find_scope_all']='Todo';
$ec_lang['lpn_find_scope_source']='Fuente';
$ec_lang['lpn_find_source_no_chemical']='No se está rastreando ningún producto químico, así que ningún nodo tiene una fuente.';
$ec_lang['lpn_find_property']='Propiedad';
$ec_lang['lpn_find_condition']='Condición';
$ec_lang['lpn_find_value']='Valor';
$ec_lang['lpn_find_btn']='Buscar';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filtrar en la tabla actual';
$ec_lang['lpn_find_filter_tip']='Muestra solo las filas que coinciden con "Qué buscar" de arriba, en cada tabla buscada.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} de {all}';
$ec_lang['lpn_find_filter_summary']='Filtrado por {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Esta consulta no se aplica a ninguna tabla.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='contiene';
$ec_lang['lpn_find_op_equals']='igual a';
$ec_lang['lpn_find_op_gt']='mayor que';
$ec_lang['lpn_find_op_lt']='menor que';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='vacío';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} encontrados. Seleccione uno para ir a él.';
$ec_lang['lpn_find_shift_hint']='Mayús+clic para alternar: agrega si no está en el conjunto de selección, o quita si ya está en él.';
$ec_lang['lpn_find_none']='No hubo coincidencias.';
// The two extremes, as conditions on the same footing as "above" -- the Value box holds how
// many. "Top"/"Bottom" were changed to "Highest"/"Lowest" in Task 438 Wave 0, because on a MAP the
// top is an edge, and lowercased with the count moved in FRONT on 2026-08-26 -- both Tom's ("'n
// highest' and 'n lowest' will be better"). Every other operator is lowercase so the three
// pull-downs read as one sentence left to right, and "{n} highest" is the English for what the box
// holds where "highest {n}" asks the reader to work out that the number is a count and not a rank.
//
// **{n} IS A REAL PLACEHOLDER, AND THIS ONE STRING SERVES BOTH THE PULL-DOWN AND THE QUERY LINE**
// (Tom, 2026-08-27: *"What needs to match are the selector and the string, both per the lang
// file."*). The pull-down prints the letter n in the slot, because the number is not chosen yet;
// the query line above the Find button prints the count the search will actually use, so it reads
// "Pipe.Velocity 10 highest". Keep the placeholder: the query PARSER is built from this same value
// and reads a number wherever {n} stands, so a translation that dropped it would take the count
// off the line as well.
$ec_lang['lpn_find_op_top']='{n} más altos';
$ec_lang['lpn_find_op_bottom']='{n} más bajos';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Ingrese qué buscar.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Conectividad';
$ec_lang['lpn_find_prop_demand_desc']='Descripción de esta categoría de demanda';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='sin líneas en el nodo';
$ec_lang['lpn_find_op_conn_noopen']='sin líneas abiertas en el nodo';
$ec_lang['lpn_find_op_conn_nolinksource']='sin ruta de líneas hasta una fuente';
$ec_lang['lpn_find_op_conn_noopensource']='sin ruta abierta hasta una fuente';
// A result row prints the NARROWEST condition true of that node beside its id, because "no links"
// says more than "no open path to a source" and both are true of the same node. It prints the
// SAME four keys above with the first letter capitalized in code (findConnLabel()), not a second
// capitalized copy of each (Task 699, Tom 2026-09-30: "do the Find redesign").
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Todos los nodos están conectados.';
$ec_lang['lpn_find_conn_no_fixed']='Esta red no tiene ningún embalse ni depósito, así que no hay ninguna fuente a la que llegar. Solo se puede buscar sin líneas en el nodo y sin líneas abiertas en el nodo.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='La búsqueda dada como consulta de texto. Cambiar la consulta actualiza los controles de arriba.';
$ec_lang['lpn_find_query_label']='Consulta';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Combine condiciones con Y, O y ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='Y';
$ec_lang['lpn_find_q_or']='O';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Los controles no pueden expresar la consulta de abajo, así que están ocultos.';
$ec_lang['lpn_find_q_restore']='Usar los controles en su lugar';
$ec_lang['lpn_replace_q_bad']='Esta consulta no se puede entender, así que no se puede cambiar nada. Corríjala arriba primero.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(en el carácter {n})';
$ec_lang['lpn_find_q_err_empty']='La consulta está vacía, así que no se buscará nada.';
$ec_lang['lpn_find_q_err_scope']='No hay nada llamado {w} para buscar. Pruebe con uno de estos: {list}';
$ec_lang['lpn_find_q_err_dot']='Ponga un punto entre lo que va a buscar y su propiedad, como Nudo.ID';
$ec_lang['lpn_find_q_err_prop']='No es una propiedad de {scope}: {w}. Pruebe con una de estas: {list}';
$ec_lang['lpn_find_q_err_op']='No es una condición para {prop}: {w}. Pruebe con una de estas: {list}';
$ec_lang['lpn_find_q_err_value']='Esta condición necesita un valor después: {op}';
$ec_lang['lpn_find_q_err_quote']='Ponga comillas alrededor de un valor de texto: {w} no es un número.';
$ec_lang['lpn_find_q_err_quote_end']='Este texto entre comillas no tiene comilla de cierre.';
$ec_lang['lpn_find_q_err_close']='Este paréntesis ( se abrió y nunca se cerró.';
$ec_lang['lpn_find_q_err_open']='Este paréntesis ) no cierra nada.';
$ec_lang['lpn_find_q_err_end']='No se esperaba nada después de esto. Combine dos búsquedas con {and} o {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Cambiar lo encontrado';
$ec_lang['lpn_replace_prop']='Propiedad para cambiar';
$ec_lang['lpn_replace_value']='Nuevo valor';
$ec_lang['lpn_replace_source']='Origen del valor nuevo';
$ec_lang['lpn_replace_asked']='Elevaciones solicitadas para nodos ({n}). Los resultados aparecen cuando se reciben.';
$ec_lang['lpn_replace_btn']='Reemplazar';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='¿Cambiar elementos ({n})?';
$ec_lang['lpn_replace_apply']='Cambiarlos';
$ec_lang['lpn_replace_done']='Elementos cambiados: {n}. Esto se puede deshacer en un solo paso.';
$ec_lang['lpn_replace_none']='Nada cambiaría.';
$ec_lang['lpn_replace_no_value']='Ingrese el nuevo valor.';
$ec_lang['lpn_replace_scope']='Elija arriba un tipo de elemento para cambiar sus valores.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Perfil';
$ec_lang['lpn_graphs_menu']='Gráficos';
// **THE SYNONYMS ARE IN dev/plain-sentences.md, THE CHANNEL MEANT FOR THEM.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission a plain sentence requires. Same text, correct channel.
$ec_lang['lpn_profile_title']='Perfil a lo largo de una ruta';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Seleccione el nodo donde empieza el trazado.';
$ec_lang['lpn_profile_draw_more']='Mueva el cursor sobre el mapa para ver el trazado. Haga clic en un nodo para agregarlo. Haga doble clic para terminar. Esc cancela.';
$ec_lang['lpn_profile_draw_blocked']='No hay ruta de {a} a {b}. Seleccione otro nodo de inicio o final.';
$ec_lang['lpn_profile_tap_start']='Seleccione el nodo donde empieza el trazado.';
$ec_lang['lpn_profile_tap_more']='Seleccione un nodo para ver el trazado. Mantenga presionado para agregarlo. Toque dos veces para terminar. Presione Perfil de nuevo para cancelar.';
$ec_lang['lpn_profile_say_idle']='Presione Perfil de nuevo para seleccionar una nueva trayectoria en el mapa.';
$ec_lang['lpn_profile_none']='Todavía no hay trayectoria. Presione Perfil de nuevo para seleccionar una en el mapa.';
$ec_lang['lpn_profile_choose']='Seleccione un nodo de inicio y un nodo final.';
$ec_lang['lpn_profile_no_path']='Estos dos nodos no están conectados por ninguna ruta.';
$ec_lang['lpn_profile_no_solve']='Todavía no hay resultados, así que solo se dibuja la línea del terreno.';
$ec_lang['lpn_profile_summary']='Nodos: {n}, longitud: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Distancia a lo largo de la ruta ({u})';
$ec_lang['lpn_profile_axis_elev']='Elevación y carga ({u})';
$ec_lang['lpn_profile_ground']='Superficie del terreno';
$ec_lang['lpn_profile_hgl']='Línea piezométrica (HGL)';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Editar';
$ec_lang['lpn_profile_edit_tip']='Cambie un extremo de la ruta, o quite un nodo de ella, sin tener que dibujar toda la ruta de nuevo.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Arrastre cualquier punto de la ruta para moverlo. Seleccione un punto agregado para quitarlo.';
$ec_lang['lpn_profile_edit_tap']='Arrastre cualquier punto de la ruta para moverlo. Seleccione un punto agregado para quitarlo.';
$ec_lang['lpn_profile_edit_nowhere']='Un punto de la ruta tiene que ser un nodo. La ruta no cambia.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Rutas guardadas';
$ec_lang['lpn_profile_new']='Ruta guardada nueva…';
$ec_lang['lpn_profile_new_name']='Ruta {n}';
$ec_lang['lpn_profile_rename']='Renombrar ruta…';
$ec_lang['lpn_profile_delete']='Eliminar ruta';
$ec_lang['lpn_profile_open']='Abrir archivo de perfil de EPANET…';
$ec_lang['lpn_profile_file_done']='Perfil leído del archivo: se encontraron {used} de {total} nodos en esta red.';
$ec_lang['lpn_profile_file_missing']='Nombrados en el archivo pero no en esta red: {ids}.';
$ec_lang['lpn_profile_file_short']='El archivo nombra menos de dos nodos de esta red, así que no hay perfil que dibujar.';
$ec_lang['lpn_profile_prompt_name']='Nombre para esta ruta';
$ec_lang['lpn_profile_delete_confirm']='¿Eliminar la ruta guardada {name}? El dibujo en sí no cambia.';
$ec_lang['lpn_profile_none_saved']='Todavía no hay rutas guardadas';
$ec_lang['lpn_profile_missing']='La ruta guardada {name} usa nodos que no están en este proyecto: {ids}';
// ---- the time-series chart (ROADMAP Task 599) -------------------------------------------------
// One or more assets' chosen value against time across an extended period simulation. {id} is an
// asset name the user gave, {n} a count and {steps} a count of reporting times; all substituted,
// never concatenated, so a language that puts them somewhere else can.
//
// **THE Y AXIS HAS NO KEY OF ITS OWN, AND THAT IS DELIBERATE.** Its title is the quantity's own
// whole label with the project's unit in parentheses, built by the same expression the map's color
// key already uses -- so the chart and the key name one quantity the same way and there is no
// second place a wording could drift. The quantity labels themselves are the Labels popover's, in
// every language it already has them in.
$ec_lang['lpn_ts_menu']='Series de tiempo';
$ec_lang['lpn_ts_tip']='Grafica uno o más elementos a lo largo de una simulación de período extendido.';
$ec_lang['lpn_ts_title']='Valores contra el tiempo';
$ec_lang['lpn_ts_group_nodes']='Nudos';
$ec_lang['lpn_ts_group_links']='Líneas';
$ec_lang['lpn_pgraph_none']='Este elemento no tiene resultados en la ejecución actual.';
// The Properties graph's own selector entry for a source share (Tom, 2026-09-30: "In selector, use
// 'Source share from {trace node}'"). Distinct from the shared lpn_result_source_share, which still
// labels the bare quantity everywhere else -- the Tables column, Find's property list, the Labels
// popover and the colour legend -- where naming the trace node in every heading would be clutter.
$ec_lang['lpn_pgraph_source_share_from']='Aporte de fuente desde {node}';
$ec_lang['lpn_result_pump_head']='Carga';
$ec_lang['lpn_result_pump_head_tip']='La carga que la bomba agrega de la succión a la descarga, mostrada como número positivo. El solucionador y los archivos de EPANET la manejan como una pérdida de carga negativa.';
// The Full report puts every node and link in one table, where a node's Head column already sits, so a
// pump's column there says whose head it is. Elsewhere the pump's own row or tab says so, and lpn_result_pump_head is enough.
$ec_lang['lpn_report_pump_head']='Carga de la bomba';
$ec_lang['lpn_ts_add']='Agregar los seleccionados';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='No se encontró nada que agregar.';
$ec_lang['lpn_ts_clear']='Quitar todo';
$ec_lang['lpn_ts_chip_tip']='Quitar {id} del gráfico';
$ec_lang['lpn_ts_none']='Todavía no hay nada que graficar. Seleccione elementos en el mapa y presione Agregar los seleccionados.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Todavía no hay resultados de período extendido. Presione Calcular para ejecutar la simulación.';
$ec_lang['lpn_ts_summary']='Elementos: {n}, tiempos de informe: {steps}';
$ec_lang['lpn_ts_axis_time']='Tiempo transcurrido';
// EPANET's Frequency Plot (Task 600): one value over every junction or every pipe, at the time the
// map shows, against the percent of them less than it. "Percent less than" is EPANET's own axis
// title. {n} and {total} are counts, {time} an elapsed time; all substituted, never concatenated.
// The Junctions/Pipes choice reuses lpn_pane_tab_junctions and lpn_pane_tab_pipes.
$ec_lang['lpn_freq_menu']='Frecuencia';
$ec_lang['lpn_freq_tip']='Distribución de frecuencia de una propiedad';
$ec_lang['lpn_freq_title']='Distribución de valores';
$ec_lang['lpn_freq_none']='Todavía no hay resultados para este valor, así que no hay nada que graficar.';
$ec_lang['lpn_freq_summary']='Graficados: {n} de {total}';
$ec_lang['lpn_freq_summary_time']='Graficados: {n} de {total}, en {time}';
$ec_lang['lpn_freq_axis_percent']='Porcentaje menor que';
// EPANET's Contour Plot (Task 600), drawn as a layer under the map rather than in a window of its
// own, from the pipes outward. {n} and {p} are counts, {k} and {i} numbers, {u} a unit symbol, {m} a
// distance in metres; all substituted. lpn_contour_buffer_unit follows the Buffer number box.
// lpn_contour_consent_1..4 are the terrain question's four paragraphs, reworded for what the contour
// plot sends: tile numbers for the network's area, not each node's latitude and longitude.
$ec_lang['lpn_contour_menu']='Isolíneas';
$ec_lang['lpn_contour_tip']='Muestra un mapa de isolíneas: los colores de los nodos se extienden a lo largo y a los lados de las tuberías, con isolíneas rotuladas. Abre un cuadro para ajustarlo o desactivarlo.';
$ec_lang['lpn_contour_plot']='Isolíneas: mapa';
$ec_lang['lpn_contour_show']='Mostrar isolíneas';
$ec_lang['lpn_contour_show_tip']='Desmarque para ocultar el relleno y las isolíneas; marque para recuperarlos como estaban. Los colores de los nodos se mantienen.';
$ec_lang['lpn_contour_fill']='Relleno';
$ec_lang['lpn_contour_fill_tip']='Suave mezcla los colores de una clase a la siguiente. Bandas pinta cada clase de la clave de colores de forma uniforme.';
$ec_lang['lpn_contour_fill_smooth']='Suave';
$ec_lang['lpn_contour_fill_bands']='Bandas';
$ec_lang['lpn_contour_opacity']='Opacidad del relleno';
$ec_lang['lpn_contour_lines']='Isolíneas';
$ec_lang['lpn_contour_interval']='Intervalo';
$ec_lang['lpn_contour_buffer']='Margen';
$ec_lang['lpn_contour_buffer_unit']='× longitud mediana de tubería';
$ec_lang['lpn_contour_buffer_tip']='Hasta dónde llega el color desde cada tubería, como múltiplo de la longitud mediana de tubería. Se desvanece en la parte exterior.';
$ec_lang['lpn_contour_few']='Hay muy pocos nodos para trazar isolíneas.';
$ec_lang['lpn_contour_support']='Mapa de isolíneas: {n} nodos, interpolados a lo largo de {p} tuberías y hasta {k} veces la longitud mediana de tubería a sus lados. Sin color a través de bombas, válvulas o líneas cerradas.';
$ec_lang['lpn_contour_support_lines']='Isolíneas cada {i} {u}.';
$ec_lang['lpn_contour_too_many']='Hay demasiadas isolíneas con este intervalo; amplíelo para dibujarlas.';
$ec_lang['lpn_contour_dem']='Terreno entre nodos a partir de Mapbox DEM';
$ec_lang['lpn_contour_dem_tip']='Entre nodos, la presión pasa a ser la carga interpolada menos la altura del terreno de Mapbox DEM, así que puede caer por debajo de la presión del nodo más bajo en una colina donde la red no tiene ningún nodo. Trate el terreno como un mapa de curvas de nivel, no como un levantamiento.';
$ec_lang['lpn_contour_support_dem']='Entre nodos, la presión es la carga interpolada menos la elevación del terreno de Mapbox DEM, muestreada aproximadamente cada {m} m.';
$ec_lang['lpn_contour_dem_failed']='No se pudo leer el terreno de Mapbox DEM, así que la presión se interpola solo entre nodos.';
$ec_lang['lpn_contour_consent_1']='Dibujar la presión sobre el terreno envía el área que cubre su red, como números de mosaico de mapa de Mapbox, a api.mapbox.com, para leer la altura del terreno allí.';
$ec_lang['lpn_contour_consent_2']='Esta es una cuestión distinta de las imágenes del mapa detrás de su proyecto. Las imágenes solo dicen adónde está mirando. Estos mosaicos dicen dónde está su red. Mapbox recibirá esos números de mosaico y su dirección IP. No enviamos nada más: ni nombre, ni tuberías, ni proyecto. No guardamos ningún registro de esto, y nada se almacena en este dispositivo salvo su respuesta a esta pregunta.';
$ec_lang['lpn_contour_consent_3']='¿Podemos enviar a Mapbox los números de mosaico del área de su red?';
$ec_lang['lpn_contour_consent_4']='Si dice que no, todo lo demás en esta página sigue funcionando exactamente como ahora, y el mapa de isolíneas se dibuja solo entre nodos. Recordamos un sí para no tener que volver a preguntar. Un no no se guarda en absoluto.';
// EPANET's System Flow plot (Task 600). "System flow" is its Graph Selection name, "System flow
// balance" its window title, "Produced" and "Consumed" its series. The definition is its own code
// (Fgraph.pas GetSysFlow): junction and reservoir demands only, split by sign; tanks in neither.
// The axis reuses lpn_result_flow and lpn_ts_axis_time.
$ec_lang['lpn_sysflow_menu']='Balance de caudales';
$ec_lang['lpn_sysflow_tip']='Grafica el caudal total producido y el caudal total consumido contra el tiempo, a lo largo de la simulación de período extendido. Los depósitos no están en ningún total, así que donde las dos líneas se separan, los depósitos se están llenando o vaciando.';
$ec_lang['lpn_sysflow_title']='Balance de caudales';
$ec_lang['lpn_sysflow_produced']='Producido';
$ec_lang['lpn_sysflow_produced_tip']='Caudal total que entra a la red desde embalses y desde demandas negativas.';
$ec_lang['lpn_sysflow_consumed']='Consumido';
$ec_lang['lpn_sysflow_consumed_tip']='Total de todas las demandas positivas: el agua que se extrae de la red en los nudos, y cualquier caudal que entra a un embalse.';
$ec_lang['lpn_view_units']='Unidades';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Guardar todo';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Proyecto{n}';
$ec_lang['lpn_project_copy_suffix']='(copia)';
$ec_lang['lpn_project_rename']='Cambiar nombre';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Nuevo proyecto…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Proyecto nuevo';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Sistema de coordenadas';
$ec_lang['lpn_new_coordsys_tip']='Elija el sistema de coordenadas de la red. La única forma de cambiar esta elección es con «Archivo, Convertir como…» a un proyecto nuevo, y esa conversión es aproximada.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Local, esquemática o personalizada';
$ec_lang['lpn_new_coordsys_local_tip']='Sin georreferenciar. Adjunte su propia imagen de fondo, o ninguna.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25) is lpn_new_coordsys, as are its list label and
// the New project box's chooser button (Task 699): it names the box's own subject rather than
// either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Filtrar por la vista del mapa';
$ec_lang['lpn_crs_view_tip']='Ofrece solo los sistemas de coordenadas que cubren el lugar que el mapa está mostrando. Desactívelo para ver la lista completa.';
$ec_lang['lpn_crs_place']='Búsqueda de nombre de lugar';
$ec_lang['lpn_crs_place_tip']='Las búsquedas se envían al servicio de nombres de lugares de OpenStreetMap, y se solicita permiso la primera vez. Un proyecto geográfico nuevo también comienza en el lugar que se encuentre aquí.';
$ec_lang['lpn_crs_search']='Buscar';
$ec_lang['lpn_crs_name']='Filtro por nombre de proyección';
$ec_lang['lpn_crs_name_tip']='Texto que filtra la lista: solo se muestran los sistemas de coordenadas cuyo nombre o código EPSG lo contiene.';
$ec_lang['lpn_crs_list_tip']='Los sistemas de coordenadas que pasan los filtros anteriores. Elija uno y luego presione Aceptar.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Todavía no se ha buscado ningún lugar, así que se ofrece la lista completa. Busque un lugar arriba o acerque el mapa para acortarla.';
$ec_lang['lpn_crs_count']='{n} de {total} proyecciones en la lista.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} de {total} sistemas de coordenadas cubren esta red.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(sin mapa)';
// Shown beside WGS 84 (EPSG:4326) in the chooser only (Task 775), never on the status strip.
$ec_lang['lpn_crs_suggested_mark']='(sugerido)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} es uno de los pocos sistemas de coordenadas de la lista sin información de proyección utilizable. Esto significa que el mapa mundial, la búsqueda por nombre de lugar y las elevaciones DEM no funcionan. Sus coordenadas no se ven afectadas.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='sin nombre';
$ec_lang['lpn_crs_none']='Sin georreferenciar';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Las unidades y otros ajustes se guardan con cada proyecto, así que esta elección se aplica solo a este proyecto y no se guarda como ajuste del navegador. Para reutilizar preferencias, guarde un proyecto vacío como plantilla e inicie cada proyecto nuevo a partir de él.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, California, EE. UU.';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Crear';
$ec_lang['lpn_file_open']='Abrir…';
$ec_lang['lpn_file_save']='Guardar';
$ec_lang['lpn_file_saveas']='Guardar como…';
$ec_lang['lpn_file_revert']='Revertir';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Archivos recientes';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='No se concedió permiso para abrir ese archivo, así que no se abrió.';
$ec_lang['lpn_recent_gone']='No se pudo abrir {file}. Puede que se haya movido, renombrado o eliminado, así que se quitó de la lista de archivos recientes.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Nuevo proyecto';
$ec_lang['lpn_tab_all']='Todos los proyectos';
$ec_lang['lpn_tab_menu']='Menú del proyecto';
$ec_lang['lpn_tab_duplicate']='Duplicar';
$ec_lang['lpn_tab_move_left']='Mover a la izquierda';
$ec_lang['lpn_tab_move_right']='Mover a la derecha';
$ec_lang['lpn_tab_unsaved']='No guardado en un archivo';
$ec_lang['lpn_import_bad_file']='Ese archivo no pudo leerse como un proyecto guardado desde esta página.';
$ec_lang['lpn_import_no_room']='No queda suficiente almacenamiento del navegador para agregar este proyecto. Elimine un proyecto que ya no necesite e inténtelo de nuevo.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='Aceptar';
// **TASK 718** (Tom, 2026-09-25: *"We have three import items. It's probably time for an Import
// sub-menu."*). The three rows -- surveyed points, an EPANET file, and libraries -- now open as a
// fly-out off one row, the same submenu idiom Help > Toolbar already uses. Each row keeps its
// own existing key and tip; only this one row is new.
$ec_lang['lpn_file_import_menu']='Importar…';
$ec_lang['lpn_file_import_inp']='Importar archivo de EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Cree un proyecto nuevo a partir de un archivo de EPANET, ya sea el formato de exportación .inp (preferido) o el formato nativo .net (último recurso).';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
// File > Export is a submenu (Tom, 2026-10-06), so its rows drop the verb the heading carries. The
// two keys above are what the rows were called before it.
$ec_lang['lpn_file_export_menu']='Exportar…';
$ec_lang['lpn_file_export_item_inp']='Archivo de EPANET…';
$ec_lang['lpn_file_export_item_geojson']='Archivo GeoJSON…';
$ec_lang['lpn_file_export_item_ods']='Archivo ODS…';
$ec_lang['lpn_file_export_item_xlsx']='Archivo XLSX…';
$ec_lang['lpn_file_export_item_csv']='Archivo CSV…';
$ec_lang['lpn_file_export_tables_tip']='Descargue las tablas como las muestra el panel Tablas, en un libro con una hoja para cada tabla (y para cada escenario que elija), más una hoja para cada biblioteca a la que se refieren sus ID: patrones, curvas, tipos de tubería y accesorios. Los resultados se incluyen solo para el escenario calculado por última vez.';
$ec_lang['lpn_file_export_csv_tip']='Descargue una tabla como la muestra el panel Tablas. Una tabla se obtiene como un solo archivo CSV sin bibliotecas. Varias tablas o escenarios se obtienen como un archivo zip de archivos CSV, con un archivo para cada biblioteca a la que se refieren sus ID. Los resultados se incluyen solo para el escenario calculado por última vez.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Descargue esta red como archivo .inp de EPANET (en un archivo zip con su imagen, si corresponde). Todo lo que el formato .inp no pueda contener se enumera después.';
$ec_lang['lpn_status_inp_exported']='Se exportó {file}.';
$ec_lang['lpn_status_inp_exported_picture']='Se exportó {zip}, que contiene el archivo de EPANET {file}, su imagen de fondo {picture} y el archivo de mundo {world}. Extraiga los tres a una misma carpeta y luego abra allí el .inp en EPANET; la imagen se carga con él.';
$ec_lang['lpn_status_inp_exported_no_picture']='Se exportó {file}. No se pudo guardar la imagen de fondo, así que el .inp no nombra ninguna; en EPANET, agréguela con Ver > Fondo > Cargar.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_flat_customers_inactive']='{n} de estos clientes están asignados a un nudo que está inactivo en este escenario, por lo que su demanda no está en el archivo.';
$ec_lang['lpn_inp_export_flat_inactive_controls']='Estos controles y reglas hacen referencia a un elemento que está inactivo en este escenario, por lo que no están en el archivo: {ids}';
$ec_lang['lpn_inp_export_differences']='{n} elementos que el formato .inp no puede contener.';
$ec_lang['lpn_inp_export_difference_one']='Un elemento que el formato .inp no puede contener.';
$ec_lang['lpn_inp_export_refused']='Este proyecto no se puede escribir como un archivo EPANET: {detail}';
// Task 772: File > Export DXF file. The model's data for AutoCAD and other CAD programs.
$ec_lang['lpn_file_export_item_dxf']='Archivo DXF…';
$ec_lang['lpn_file_export_dxf_tip']='Descargue esta red para AutoCAD y otros programas CAD: los nodos como bloques de símbolos, las tuberías, bombas y válvulas como polilíneas, y cada elemento como un bloque cuyos atributos llevan su ID y los valores de sus propiedades en las unidades del proyecto.';
$ec_lang['lpn_dxf_export_no_utm']='No se escribió el archivo DXF: esta red está fuera de las latitudes que cubre UTM (80° S a 84° N), y un dibujo necesita una cuadrícula plana donde dibujarse.';
$ec_lang['lpn_dxf_export_refused']='No se escribió el archivo DXF: no se cargó la conversión de coordenadas que necesita. Revise la conexión e inténtelo de nuevo.';
$ec_lang['lpn_dxf_export_failed']='No se escribió el archivo DXF: un error en esta página lo detuvo ({error}).';
// The read-me written into the file as a block of attributes, on a layer that does not plot; the
// file writes it in capital letters. Each says what
// the coordinates are and claims no coordinate system the file does not have. {unit} is a length
// unit as written in English (ft, m), not translated; {crs} is a coordinate system name with its EPSG code.
$ec_lang['lpn_dxf_note_grid']='Coordenadas: la X y la Y de este proyecto, en {unit}. No se indica ningún sistema de coordenadas.';
$ec_lang['lpn_dxf_note_crs']='Coordenadas: {crs}, exactamente como las indica este proyecto.';
$ec_lang['lpn_dxf_note_geo']='Coordenadas: {crs}, en metros, no latitud y longitud. Las latitudes y longitudes del proyecto se convirtieron a esa cuadrícula.';
$ec_lang['lpn_dxf_exported_geo']='Se exportó {file}. Sus coordenadas son {crs}, en metros, no latitud y longitud.';
// {prefix} is the layer-name prefix, C-WATR-MODL-; {example} is a whole layer name such as
// C-WATR-MODL-NODE-BASE.
$ec_lang['lpn_dxf_note_blocks']='Las capas se nombran con {prefix}, el código del elemento, un guion y la alternativa, como en {example}. Cada elemento es un bloque insertado a escala 1 con atributos de 1 unidad de alto; ajuste la escala de los bloques para fijar la altura del texto. Todos los atributos son visibles; los atributos de un elemento se apilan en una columna junto a su símbolo.';
// {n} is a whole number; {max} is 2049. Each shortened value ends in three periods (...).
$ec_lang['lpn_dxf_note_shortened']='Valores más largos de lo que permite un archivo DXF ({max} caracteres): {n}. Cada uno se acortó y termina en tres puntos.';
// {n} is a whole number; {tag} is an attribute tag in capitals, BASE_DEMAND in English.
$ec_lang['lpn_dxf_note_categories']='Nudos con más de una categoría de demanda: {n}. Su atributo {tag} contiene la suma de las demandas base de todas las categorías.';
// GeoJSON export (Task 728). The command is worded like Export EPANET file. Positions in a GeoJSON
// file are always longitude and latitude (RFC 7946), so a project with no place on the Earth is
// refused and told how to get one, never written with an invented coordinate system.
$ec_lang['lpn_file_export_geojson_tip']='Descargue esta red como archivo GeoJSON para QGIS, ArcGIS Pro y otros programas SIG. Los nudos, depósitos y embalses son puntos, y las tuberías, bombas y válvulas son líneas que siguen sus vértices. Las posiciones son latitud y longitud. Los resultados se incluyen solo cuando la red se ha resuelto.';
// Workspace export and import (Tom, 2026-10-07). {file}, {n}, {r}, {u} and {version} are filled in by the page.
$ec_lang['lpn_file_export_item_workspace']='Espacio de trabajo…';
$ec_lang['lpn_file_export_workspace_tip']='Descargue un archivo pequeño que contiene dónde están sus cuadros, sus tamaños, cuáles están abiertos o acoplados, y los tamaños de sus paneles y columnas, además de las opciones de visualización de esta página, como cuáles burbujas de ayuda y la tarjeta al pasar el puntero se muestran. Sus proyectos, la configuración de los proyectos y las cookies (idioma, consentimiento, unidades) no están incluidos. Cárguelo en otra pantalla u otro navegador con Archivo, Importar, Espacio de trabajo.';
$ec_lang['lpn_file_import_workspace']='Espacio de trabajo…';
$ec_lang['lpn_file_import_workspace_tip']='Aplique un archivo de espacio de trabajo guardado con Archivo, Exportar, Espacio de trabajo: posiciones y tamaños de los cuadros, acoplamiento, tamaños de los paneles y las opciones de visualización de esta página, como cuáles burbujas de ayuda y la tarjeta al pasar el puntero se muestran. Sus proyectos y cookies no se modifican.';
$ec_lang['lpn_workspace_exported']='Espacio de trabajo guardado en {file}: {n} ajustes.';
$ec_lang['lpn_workspace_imported']='Espacio de trabajo aplicado desde {file}. Ajustes aplicados: {n}. Restablecidos a sus valores predeterminados: {r}.';
$ec_lang['lpn_workspace_ignored']='Entradas omitidas por no reconocerse: {u}.';
$ec_lang['lpn_workspace_refused_unreadable']='Este archivo no se pudo leer como espacio de trabajo, así que no se cambió nada.';
$ec_lang['lpn_workspace_refused_format']='Este no es un archivo de espacio de trabajo guardado por esta página, así que no se cambió nada.';
$ec_lang['lpn_workspace_refused_newer']='Este archivo de espacio de trabajo lo guardó una versión más reciente de esta página (formato {version}), así que no se cambió nada.';
$ec_lang['lpn_workspace_confirm']='¿Reemplazar la disposición del espacio de trabajo de este navegador por la del archivo?';
$ec_lang['lpn_workspace_refused_storage']='El almacenamiento del navegador está lleno o no está disponible, así que no se aplicó el espacio de trabajo.';
$ec_lang['lpn_geojson_refused_local']='Un archivo GeoJSON contiene solo latitud y longitud, y este proyecto está dibujado en una cuadrícula local sin ubicación en la Tierra. Primero georreferencie el proyecto con Mapa, Mapa mundial, Adjuntar, y luego exporte de nuevo.';
$ec_lang['lpn_geojson_refused_range']='Estas posiciones no son latitudes y longitudes válidas: {detail}';
$ec_lang['lpn_geojson_refused_crs']='Esta página no reconoce el sistema de coordenadas de este proyecto ({detail}), así que sus posiciones no se pueden convertir a latitud y longitud. Use Convertir como… para copiar el proyecto a un sistema que esta página reconozca, y luego exporte de nuevo.';
$ec_lang['lpn_geojson_refused_empty']='Todavía no hay nada que exportar. Primero dibuje o abra una red.';
$ec_lang['lpn_geojson_results_in']='Se incluyen los resultados que se muestran en pantalla.';
$ec_lang['lpn_geojson_results_out']='No se incluyen resultados, porque la red no está resuelta.';
$ec_lang['lpn_inp_bad_file']='Ese archivo no se pudo leer como un archivo de red de EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Esto parece un archivo .net de EPANET, pero esta página no pudo leerlo. Ábralo en EPANET y use allí el comando Archivo, Exportar, Red para guardarlo como un archivo .inp, y luego importe ese archivo.';
$ec_lang['lpn_inp_report_heading']='Se importó {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} nudos, embalses y depósitos, {links} tuberías, bombas y válvulas, en {units}.';
$ec_lang['lpn_inp_report_clean']='Todos los datos del archivo se importaron. No se omitió nada.';
$ec_lang['lpn_inp_report_label_anchor']='Las etiquetas de texto se colocan como las coloca EPANET, desde su esquina superior izquierda.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Los archivos EPANET no contienen sistema de coordenadas, así que este archivo no estará georreferenciado inicialmente. Para colocarlo en un mapa mundial, use Mapa, Mapa mundial… Para convertir sus coordenadas, use Archivo, Convertir como…';
$ec_lang['lpn_inp_backdrop_attach']='Adjuntar {file}…';
$ec_lang['lpn_inp_backdrop_attach_tip']='Una página web no puede abrir la imagen por su nombre. Elíjala en su dispositivo y se coloca donde el archivo indica que va.';
$ec_lang['lpn_inp_backdrop_attached']='Se adjuntó {file}. Se colocó donde el archivo indica que va.';
$ec_lang['lpn_inp_backdrop_attached_other']='Se adjuntó {picked}. Se colocó donde el archivo indica que va. El archivo nombra {file}, que es un nombre distinto.';
$ec_lang['lpn_inp_report_lead']='Esta página no usa todas las funciones de EPANET, pero no se descarta ningún dato del archivo. La lista siguiente muestra los datos del archivo que se conservan pero no se usan, y los cambios hechos durante la importación:';
$ec_lang['lpn_inp_drop_headloss']='Este archivo no usa la fórmula de Hazen-Williams. Esta página calcula con Hazen-Williams, así que los valores de rugosidad de la tubería se conservaron exactamente como estaban escritos, pero los resultados aquí no coincidirán con los de EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Estos depósitos no tienen paredes rectas: el archivo da su forma como una curva de volumen. La curva se conserva en el cuadro Bibliotecas, el depósito sigue haciendo referencia a ella, y una simulación de período extendido la usa para calcular el nivel a medida que el depósito se llena y se vacía. Un análisis de un solo período no se ve afectado, porque la superficie del agua está en el nivel indicado en el archivo. El diámetro del archivo se conserva junto a la curva y se usa para dibujar y resolver un depósito sin curva.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Estas válvulas de estrangulamiento se importaron como válvulas de estrangulamiento, con la pérdida indicada en el archivo.';
$ec_lang['lpn_inp_drop_valve_active']='Estas válvulas controlan la presión o el caudal, y su estado cambia con las condiciones hidráulicas. Se importaron sin pérdida de datos, y esta página las resuelve.';
$ec_lang['lpn_inp_drop_valve']='Estas válvulas se describen mediante una curva o una caída de presión fija, y esta página no tiene un elemento así. Se importaron como tuberías abiertas, así que la red sigue conectada, pero la presión y el caudal ya no se controlan en esos puntos.';
$ec_lang['lpn_inp_drop_cv']='En EPANET estas tuberías permiten el flujo en un solo sentido (válvulas de retención). Se importaron como tuberías comunes, así que ahora el flujo puede pasar en cualquier sentido.';
$ec_lang['lpn_inp_drop_demands']='Estos nudos tenían más de una demanda. Las demandas se sumaron en la única demanda que maneja esta página.';
$ec_lang['lpn_inp_drop_patterns']='Esta página no leyó los patrones de demanda, porque el módulo de simulación de período extendido no se cargó. Cada demanda es el valor indicado en el archivo.';
$ec_lang['lpn_inp_drop_demand_pattern']='Estos nudos tienen demandas que varían a lo largo de la ejecución. Sus patrones se importaron completos, y la demanda que se muestra es el valor a la hora del reloj.';
$ec_lang['lpn_inp_drop_emitters']='Estos nudos tienen un coeficiente de aspersor o de fuga. Se conservó, se está resolviendo, y cada uno lo muestra en el cuadro Coeficiente de emisor en sus propiedades.';
$ec_lang['lpn_inp_drop_curve_long']='Esta curva de bomba tenía más de tres puntos. Se conservaron su punto más bajo, el medio y el más alto, porque esta página ajusta una curva a un máximo de tres puntos.';
$ec_lang['lpn_inp_drop_curve_missing']='Esta bomba hace referencia a una curva que no está en el archivo. La bomba se importó sin curva, así que no agrega carga.';
$ec_lang['lpn_inp_drop_pump_other']='Esta bomba se describe por la potencia que consume, en vez de por una curva. Se importó sin curva, así que no agrega carga.';
$ec_lang['lpn_inp_drop_head_pattern']='Estos embalses tienen una carga que varía a lo largo de la ejecución. Sus patrones se importaron completos, y el nivel de agua que se muestra es el valor a la hora del reloj.';
$ec_lang['lpn_inp_drop_pump_speed']='Estas bombas funcionan a una velocidad distinta de aquella con la que se midió su curva, o cambian de velocidad a lo largo de la ejecución. La velocidad y su patrón se importaron completos, y la carga que se muestra es el valor a la hora del reloj.';
$ec_lang['lpn_inp_drop_setting']='Estas tuberías, bombas y válvulas tienen un ajuste que esta página no puede contener. Se importaron como abiertas.';
$ec_lang['lpn_inp_drop_rules']='Este archivo tiene controles basados en reglas. Esta página los lee y los aplica. Cuando se ejecuta el modelo, se aplican las reglas, con cada nivel, presión y caudal convertidos a las unidades que muestra este proyecto. Abra Reglas en Bibliotecas para ver o editar una regla. Las reglas se conservan exactamente como se indican en el archivo y se vuelven a escribir si guarda un archivo de EPANET.';
$ec_lang['lpn_inp_drop_eps']='Este archivo describe una simulación de período extendido. El módulo de simulación de período extendido de esta página no se cargó, así que solo se importaron las condiciones iniciales.';
$ec_lang['lpn_inp_drop_quality']='Este archivo describe la calidad del agua: concentraciones iniciales y tasas de reacción en tuberías y depósitos. Esta página lee y usa esos valores. Elija un producto químico en Configuración, Cálculo, Calidad, y luego ejecute el modelo para calcular las concentraciones en toda la red a lo largo de la ejecución. Las líneas se conservan y se vuelven a escribir si guarda un archivo de EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Este archivo indica dónde se inyecta un producto químico en la red y cómo se mezcla el agua en cada depósito. Cada fuente se muestra en el nudo donde se aplica, y cada depósito muestra su modelo de mezcla. Ambos se usan cuando la red se ejecuta durante un tiempo total de simulación.';
$ec_lang['lpn_inp_drop_energy']='Este archivo EPANET incluye datos para modelar el costo de bombeo. Esta página los lee y los usa. Ejecute el modelo con el solucionador de EPANET, y luego abra Agua, Informes, Energía de las bombas para ver cuánto tiempo funcionó cada bomba, la potencia que consumió, la energía que usó y lo que costó. Las líneas se conservan, y se vuelven a escribir si guarda un archivo EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Este archivo asigna marcadores a algunos nudos, tuberías u otros elementos. Cada marcador se importó y aparece en las propiedades de su elemento, donde se puede ver o editar.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Este archivo contiene ajustes de formato de informe de EPANET. El informe de ejecución está disponible en Informes, Ejecución, pero usa el formato estándar de EPANET y no el que especifican estos ajustes. Las líneas se conservan y se vuelven a escribir si guarda un archivo de EPANET.';
$ec_lang['lpn_inp_drop_sections']='Este archivo contiene una sección que esta página no lee en absoluto. Nada aquí la usa. Se conserva completa, y se vuelve a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_comments']='Estas líneas de comentario en los patrones o en los controles simples de este archivo no se importaron, porque esta página no tiene dónde conservarlas (por ejemplo, entre las filas de un mismo patrón). Todos los patrones y controles se importaron completos.';
$ec_lang['lpn_inp_drop_quality_options']='Este archivo indica opciones de calidad del agua de EPANET: la opción Quality, que nombra el tipo de análisis de calidad del agua, y dos ajustes que acompañan a un producto químico, Relative diffusivity y Quality tolerance. Las tres se conservan y se usan. Aquí se calculan la edad del agua, el rastreo de fuente y un producto químico, y los dos ajustes del producto químico se usan cuando se ejecuta un producto químico. Todas se vuelven a escribir si guarda un archivo de EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Este archivo hace referencia a un archivo auxiliar: Map, que contiene coordenadas, o Hydraulics, que contiene resultados hidráulicos ya calculados. Esta página no puede abrir ninguno de los dos, así que esas líneas se conservan tal como están y se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Este archivo indica opciones que esta página no lee. Nada aquí las usa. Se conservan y se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Este archivo .net de EPANET indica ajustes para los que esta página no tiene control, así que sus valores se muestran aquí en lugar de incorporarse. Todo lo demás se incorporó. Si los necesita, abra el archivo en EPANET y use Archivo, Exportar, Network para guardarlo como archivo .inp, luego importe ese.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Este era un archivo .net de EPANET, el formato de proyecto nativo de EPANET. El formato no tiene especificación publicada; esta página lo lee usando un formato deducido de archivos de ejemplo, así que úselo solo cuando no haya un archivo .inp disponible. El archivo .inp es el formato documentado que leen otros programas: en EPANET use Archivo, Exportar, Network para escribir uno, e importe ese archivo en su lugar siempre que sea posible.';
$ec_lang['lpn_inp_drop_backdrop']='Este archivo nombra una imagen de fondo pero no contiene la imagen en sí. Agréguela usted mismo con Archivo, Imagen de fondo, Agregar imagen.';
$ec_lang['lpn_inp_drop_dangling']='Estas tuberías nombran un nudo que no está en el archivo, así que se dejaron fuera.';
$ec_lang['lpn_inp_drop_units']='La unidad de caudal indicada en este archivo no es una que esta página reconozca, así que todos los números se leyeron como galones por minuto. Revise cada valor antes de usar los resultados.';
$ec_lang['lpn_inp_drop_anchor_missing']='Este texto estaba adjunto a un nudo, embalse o depósito que no está en el archivo. Se importó como texto libre en la ubicación indicada en el archivo y no está adjunto a ningún elemento.';
$ec_lang['lpn_import_notes_heading']='Este proyecto se leyó de un archivo de EPANET. Parte de lo que contiene ese archivo se conserva pero no se usa en esta página.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='Se abrió {name} desde un archivo y se agregó a este navegador como un nuevo proyecto.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Archivo de proyecto';
// Where there is no File System Access API -- Firefox, Safari, or any page not served over https --
// a save cannot connect to a file, so every press really is another copy in the downloads folder.
// The label says which of the two you are getting rather than leaving the duplicate looking like a
// bug.
// **The MENU still says Save and Save as… there** (Tom, 2026-08-04: *"'Download a copy' is a mistake,
// and the menu item we want is 'Save as...'"*). A paradigm we are adopting has two names for writing
// a file, and this page already spends the word "copy" on Duplicate; a third word for a third thing
// is the invention we are trying to stop doing. The caveat lives in a tip on those rows, and in a
// notice after the act -- at the moment the question arises -- rather than in a label forever.
// `lpn_file_download_tip` was removed 2026-08-04 with the fallback Save row itself: where no
// connection is possible, Save is disabled and only Save as remains, so the caveat belongs on Save
// as (lpn_file_saveas_tip_download) and nowhere else. A tip on a disabled row would never be seen
// anyway -- a disabled button fires no mouse events.
// Opening a file where there is no File System Access API is an UPLOAD, not an open: the browser
// hands over the contents and nothing else -- no way to write back, no way to lock it, no way even
// to recognise it next time. A user who is not told will reasonably expect Save to go back where the
// file came from. Explained once per browser by lpn_file_upload_explain, then said every time by
// lpn_status_uploaded.
$ec_lang['lpn_file_upload_explain']='Este navegador no puede conectarse a un archivo, así que abrir un archivo aquí es una carga: el proyecto se copia en este navegador, y la única forma de guardar los cambios en el archivo es sobrescribirlo con Archivo, Guardar como.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='Guarde usando la configuración de Descargas de su navegador. Este navegador no puede conectarse a un archivo, así que Guardar está deshabilitado y solo está disponible Guardar como. Si la opción de su navegador "Preguntar dónde guardar cada archivo" está activada, se puede elegir el archivo original y sobrescribirlo.';
$ec_lang['lpn_status_uploaded']='Archivo de proyecto cargado. No se puede mantener una conexión con él, así que la única forma de guardar de vuelta es usando Archivo, Guardar como.';
$ec_lang['lpn_status_downloaded']='Se descargó {file}. Este navegador no puede conectarse a un archivo, así que este proyecto permanece marcado como no guardado en un archivo.';
$ec_lang['lpn_status_file_opened']='Se abrió {file}.';
$ec_lang['lpn_status_already_open']='Ese archivo ya está abierto aquí como {name}, así que se cambió a él en lugar de abrir una segunda copia.';
$ec_lang['lpn_status_already_open_dirty']='Ese archivo ya está abierto aquí como {name}, con cambios que no ha guardado en él. Se cambió a él en lugar de abrir una segunda copia. Use Archivo, Revertir si prefiere la versión del disco.';
$ec_lang['lpn_status_saved']='Se guardó {file}.';
$ec_lang['lpn_status_reverted']='Se volvió a cargar {file} desde el disco.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='¿Guardar los cambios de {name} antes de cerrarlo?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} se conserva solo en este navegador. Si lo cierra sin guardarlo en un archivo, se perderá para siempre.';
$ec_lang['lpn_close_discard']='Cerrar sin guardar';
$ec_lang['lpn_cancel']='Cancelar';
$ec_lang['lpn_revert_confirm']='¿Descartar los cambios realizados y volver a cargar {file} desde el disco?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Este proyecto proviene de {file}, pero se perdió la conexión con ese archivo. Elija el archivo de nuevo para conectarse a él.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='No se pudo escribir en el archivo. Puede que se haya movido o renombrado, o que se haya retirado el permiso. Su trabajo sigue guardado en este navegador.';
$ec_lang['lpn_file_changed_elsewhere']='Otro usuario guardó en este archivo desde que usted lo abrió, así que guardar ahora sobrescribiría ese trabajo. Use Archivo, Guardar como para guardar sus cambios en un archivo aparte, o Archivo, Revertir para descartar sus cambios y cargar la versión guardada.';
// Project locks (Task 195 Phase 2) -- who is editing a shared project file right now. {name} is a
// person as they chose to be known ("Dave T."), never a login; word order is the translator's to
// choose. A lock never expires on its own, so none of these may suggest waiting will free it.
// Initials, and said to be public: whoever opens the same file sees this name, including outside the
// office (Tom, 2026-08-03 -- "your friendly name may need to be a cryptic name"). Asking for initials
// rather than a name makes the safe answer the obvious one.
// Corrected 2026-08-05 to match lpn_file_training_3, which Task 211 fixed and this string missed: the
// name is never written into the project file, so "anyone you send the file to" was false here too.
// The stand-in when someone locked a project before giving a name. Reads in place of {name}
// everywhere above, so it has to work mid-sentence.
$ec_lang['lpn_lock_somebody']='Otra persona';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} tiene este archivo abierto.';
$ec_lang['lpn_lock_open_readonly']='Abrir solo lectura';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Romper bloqueo';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Este archivo parece estar en uso.';
$ec_lang['lpn_lock_open_care']='Para evitar la pérdida de datos, elija con cuidado entre las opciones de abajo.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Ha estado en uso durante {x}.';
$ec_lang['lpn_lock_age_edited']='Se editó por última vez hace {x}.';
$ec_lang['lpn_lock_age_saved']='Se guardó por última vez hace {x}.';
$ec_lang['lpn_lock_age_never_saved']='Todavía no se ha guardado nada en este archivo.';
$ec_lang['lpn_lock_age_unknown']='No hay registro de cuánto tiempo lleva en uso, ni de cuándo se guardó o editó por última vez.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"Preguntar" le indica a quien tenga este archivo abierto que a usted le gustaría usarlo, y no cambia nada más. "Abrir solo lectura" le permite verlo y cambiar lo que quiera, sin poder guardar aquí. "Romper su bloqueo" le permite guardar sobre el archivo; el trabajo no guardado de esa persona no se pierde, pero ya no podrá guardarlo aquí, y alguien quizá tenga que combinar los dos a mano.';
$ec_lang['lpn_lock_ask']='Preguntar';
// Asked at the one moment the name is useful. Nothing is written to this computer for it; the lock
// broker keeps it in that file's lock record for the holder to read (Tom, 2026-09-29, correcting a
// prompt that said "stored only in this browser").
$ec_lang['lpn_lock_ask_prompt']='¿A quién se debe indicar como solicitante? Ingrese sus iniciales, por ejemplo. Se guardan con el bloqueo de este archivo en nuestro servidor, para quien lo tenga abierto, y se eliminan en un plazo de 30 días.';
$ec_lang['lpn_lock_ask_sent']='Le pedimos a quien tenga este archivo abierto que lo cierre. Lo verá dentro de un minuto, si su página sigue abierta. Nada más ha cambiado, y el archivo sigue siendo suyo hasta que lo cierre.';
$ec_lang['lpn_lock_ask_failed']='Su mensaje no se pudo entregar. O nadie tiene este archivo abierto ahora, o no se pudo contactar al servidor.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Ese archivo no se abrió, y nada aquí cambió. Otra persona todavía lo tiene abierto.';
// Task 747: a file copied outside this page keeps its original's document ID, and so its lock. Asked
// whenever this browser cannot guarantee it already knows the file (Tom, 2026-09-30). {date} is when
// the ID was minted, in the visitor's own regional date-time format.
$ec_lang['lpn_copy_title']='¿Marcar el archivo como copia nueva?';
$ec_lang['lpn_copy_body']='Este archivo dice que se creó el {date}, y este navegador no lo reconoce. ¿Es el archivo Original (conservar el mismo bloqueo) o una Copia (crear un bloqueo nuevo)?';
$ec_lang['lpn_copy_body_nodate']='Este navegador no reconoce este archivo. ¿Es el archivo Original (conservar el mismo bloqueo) o una Copia (crear un bloqueo nuevo)?';
$ec_lang['lpn_copy_original']='Original; conservar el mismo bloqueo';
$ec_lang['lpn_copy_copy']='Una copia; crear un bloqueo nuevo';
// What "Original" does when the file's id is already open in a tab here with a different file:
// switch to the tab, without changing the tab's file.
$ec_lang['lpn_copy_kept_link']='Se abrió {name} como el original, movido a otro lugar. Guardar ahora escribe en este archivo.';
// Tom, 2026-10-05: the copy is saved the moment it is chosen, so nobody has to remember to.
$ec_lang['lpn_copy_opened']='Se abrió {file} como copia y se guardó, con un bloqueo nuevo.';
// Said only when that save did not happen (permission refused, file gone); the tab stays unsaved.
$ec_lang['lpn_copy_opened_unsaved']='Se abrió {file} como copia, con un bloqueo nuevo que se guardará con el próximo guardado del archivo.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} desea editar este archivo. Cuando esté listo, guarde su trabajo y use Archivo, Cerrar para entregarlo.';
$ec_lang['lpn_ago_seconds']='{n} segundos';
$ec_lang['lpn_ago_minutes']='{n} minutos';
$ec_lang['lpn_ago_hours']='{n} horas';
$ec_lang['lpn_ago_days']='{n} días';
$ec_lang['lpn_ago_unknown']='un tiempo desconocido';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Mensajes';
$ec_lang['lpn_msglog_heading']='Mensajes recientes';
$ec_lang['lpn_msglog_empty']='Todavía no hay mensajes.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='hace {x}';
$ec_lang['lpn_msglog_note']='Los más recientes primero. Esta página conserva los últimos {n} mensajes mientras está abierta y no los almacena en su computadora.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Solo lectura: {name} tiene este archivo abierto. Se puede cambiar cualquier cosa aquí, pero no guardarla. Use Archivo, Guardar como para guardar en un archivo diferente.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Advertencia: no se pudo conectar con el servidor para verificar o crear un bloqueo en este proyecto, así que otro usuario puede editar el mismo archivo al mismo tiempo. Aparece un mensaje si el bloqueo se reanuda.';
$ec_lang['lpn_lock_storage_error']='Advertencia: este sitio no puede guardar los registros de bloqueo, así que otro usuario puede editar el mismo archivo al mismo tiempo. Es una falla de configuración del servidor que no se puede corregir desde esta página: el servidor web no puede escribir en la carpeta de bloqueo.';
$ec_lang['lpn_lock_full_error']='Advertencia: este sitio no tiene espacio de almacenamiento para registros de bloqueo, así que otro usuario puede editar el mismo archivo al mismo tiempo. Es una falla de configuración del servidor que no se puede corregir desde esta página.';
$ec_lang['lpn_lock_not_asked']='El bloqueo no está activo para este proyecto, así que otro usuario puede editar el mismo archivo al mismo tiempo. Este proyecto aún no tiene un identificador; al guardarlo en un archivo se le asigna uno.';
$ec_lang['lpn_lock_restored']='El bloqueo se restableció, y este archivo ya se puede guardar.';
$ec_lang['lpn_lock_dismiss']='Ocultar este mensaje';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='El proyecto se guardará en un archivo en esta computadora. Se guarda solo cuando usted lo guarda, y en ningún otro momento.';
$ec_lang['lpn_file_training_2']='Para que dos personas nunca editen un mismo archivo al mismo tiempo, este sitio registra quién lo tiene abierto. Si alguien ya lo tiene, aún se puede abrir para verlo o copiar para conservarlo.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='La primera vez que guarde, el navegador pregunta si este sitio puede editar el archivo. La solicitud proviene del navegador, no de este sitio, y el permiso es necesario para que Guardar escriba en el archivo. Normalmente se solicita solo una vez por archivo.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Continuar';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Elegir el archivo de nuevo';
$ec_lang['lpn_file_reconnect']='Reconectar a este archivo';
$ec_lang['lpn_file_reconnect_alert']='Este proyecto proviene de {file}. Su navegador necesita su permiso de nuevo antes de poder escribir en él. Reconecte abajo.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Ese es el mismo archivo que otra persona tiene abierto, así que no se puede sobrescribir. Elija un archivo o un nombre diferente.';
$ec_lang['lpn_saveas_overwrites_project']='Ese archivo ya contiene un proyecto diferente, {name}. Guardar aquí lo reemplaza por completo. ¿Continuar?';
$ec_lang['lpn_saveas_overwrites_newer']='Ese archivo ha cambiado desde la última vez que lo vio, así que casi con seguridad alguien más ha guardado en él. Guardar aquí reemplaza su versión con la suya. ¿Continuar?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Nombre para este proyecto';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='Se cerró {closed}. Ahora se muestra {opened}.';
$ec_lang['lpn_status_closed_empty']='Se cerró {closed}. Se inició un nuevo proyecto vacío.';
$ec_lang['lpn_storage_full']='No guardado. El almacenamiento del navegador está lleno o no disponible, así que sus cambios recientes se perderán al cerrar esta pestaña.';
$ec_lang['lpn_storage_unreadable']='No guardado. Este proyecto no se pudo leer del almacenamiento del navegador. Su copia guardada se deja exactamente como está y no se sobrescribirá, así que nada se está guardando en esta pestaña. Abra un archivo o cree un proyecto nuevo para seguir trabajando.';
// The About box's one translatable sentence (Task 625). The LICENCE NAME itself is deliberately
// inside it in English: the FSF asks that "GNU General Public License" not be translated, and a
// translated licence name is a different licence as far as a reader checking it is concerned.
// The one-time cue that points from the toolbar up to the menu bar (Task 625). Says where the
// menus ARE rather than what they contain: a reader who has not noticed the row does not need a
// list of it, they need to look up once.
// **THE WAY HOME IS A HELP ROW NOW** (Tom, 2026-09-11). This was `lpn_menu_home_tip`, the tip on
// a product mark at the far left of the menu bar; the mark is gone and the row replaced it, on
// his instruction: *"Help menu to include Welcome Page ... as last item in top group."* The key
// was never translated, having lived for less than a day, so renaming it costs nothing.
//
// The DOMAIN is not in the label: a Help row sits among other rows that name what they do, and
// "Welcome page" is what this one does. The address belongs in the browser's status bar, where a
// link's destination is already shown.
// The About box's second link (MAH, browsing on 2026-09-11, relayed by Tom: *"I noticed that
// About often has a 'Credits' link."* He is right, and this one has somewhere real to point --
// librewaternet.org/credits.html, which is the About-EPANET page that survived not-epanet.org).
$ec_lang['lpn_about_credits']='Créditos';
$ec_lang['lpn_help_welcome']='Página de bienvenida';
$ec_lang['lpn_about_license']='Con licencia bajo la Licencia Pública General de GNU (GNU General Public License) v3.0 o posterior.';
$ec_lang['lpn_notes_1_term']='Cómo se resuelve';
// **IT NAMED THE WRONG SOLVER** (Tom, 2026-09-10: *"Wrong facts."*). It said every moment "is
// solved with the global gradient algorithm", which describes the BUILT-IN solver -- and Task 605
// retired that one from view: EPANET is the default and the built-in one answers only when EPANET
// cannot be fetched. dev/lpn-spike/eps-net3-harness.js reproduces EPA's own published 24-hour
// Net3 report at all 25 reporting steps.
// **THE FALLBACK SENTENCE LEFT THIS NOTE 2026-09-11** (Tom: *"I am not sure that mentioning the
// EPANET solver being unavailable for download makes sense ... the case for the note is
// vanishingly small."*). His premise is not quite right -- the app IS offline-capable, so a
// returning visitor with the page cached and the engine not cached is a real state, and Task 608
// shrank it further by fetching the engine before anybody is waiting. But the conclusion holds on
// a better reason: **the reader is already told, at the moment it happens, by
// lpn_time_no_engine and lpn_engine_unavailable.** A note everybody reads should not carry a
// failure explanation that the failure itself delivers. Task 605's rule is untouched -- every
// sentence a reader meets only when something has gone wrong SURVIVES, and those two are it.
$ec_lang['lpn_notes_1_def']='De forma predeterminada, el solucionador de EPANET resuelve la red. Cuando se fija un tiempo total de simulación, cada paso de tiempo de informe se calcula en secuencia: los depósitos se llenan y se vacían, las demandas siguen sus patrones y la barra de herramientas reproduce la simulación. Con Usar el solucionador incorporado cuando sea posible marcado, el solucionador incorporado puede resolver una solución de un solo instante, pero una simulación de período extendido o una red con una válvula rompedora de presión o una válvula de propósito general (PBV, GPV) la resuelve siempre el solucionador de EPANET.';
$ec_lang['lpn_notes_2_term']='Lo que no hace';
// **"Water quality chemistry is not modeled" WAS FLATLY FALSE** (Tom, 2026-09-10: *"Wrong
// facts."*). A reacting chemical, bulk and wall reaction coefficients and a limiting
// concentration all ship -- see lpn_quality_chemical and the lpn_reaction_* keys below. The note
// had not been read since the water-quality work landed, and it was telling every visitor in 27
// languages that a feature they can see on the screen does not exist.
//
// **THE TERM IS NOW "What it does not do", AND WHAT GOES IN IT IS TOM'S CALL.** Naming an
// omission is a public claim about scope, and this file's history says those go wrong in the
// confident direction; the one omission stated here is the one nothing in this tree implements
// or claims to. Do not lengthen the list without him.
$ec_lang['lpn_notes_2_def']='No se modelan las sobrepresiones transitorias ni el golpe de ariete: todos los resultados corresponden a flujo permanente o de variación lenta, no a la onda de presión transitoria causada por un cierre rápido de una válvula.';
$ec_lang['lpn_notes_3_term']='Guardado de proyectos';
$ec_lang['lpn_notes_3_def']='Cada proyecto es una pestaña, y cada pestaña se guarda en este navegador mientras usted trabaja. Borrar los datos del navegador las elimina todas, así que el trabajo debe guardarse en un archivo: Archivo, Guardar como. Un asterisco en una pestaña indica que contiene cambios que no están en un archivo, y al cerrar esa pestaña se pregunta antes. Nada se escribe nunca en un archivo salvo que se elija Guardar o Guardar como. En algunos navegadores, un proyecto se conecta al archivo en el que se guarda, y Archivo, Guardar escribe de vuelta en ese mismo archivo de ahí en adelante; en otros no es posible ninguna conexión, así que Guardar está deshabilitado y solo está disponible Guardar como. Este sitio lleva el registro de quién tiene abierto un archivo de proyecto, para que dos personas no escriban una sobre la otra. Al abrir un archivo que un colega ya tiene abierto se ofrecen Preguntar, Abrir solo lectura y Romper bloqueo. Si no se puede conectar con el servidor, una advertencia indica que otro usuario puede editar el mismo archivo al mismo tiempo.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Curva de la bomba';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Una bomba sigue H = H₀ − aQ^b, donde H es la carga que agrega la bomba y Q es el caudal que pasa por ella. Los puntos de la curva se ingresan en Agua, Bibliotecas, como una curva de carga de la bomba, y la bomba indica esa curva en Propiedades. Tres puntos, la carga a caudal cero, el punto normal de trabajo y el punto de caudal más alto, ajustan H₀, a y b directamente, y siguen más de cerca una curva publicada. Dos puntos ajustan una parábola (b = 2) con su máximo en caudal cero. Un punto usa la regla de EPANET: la carga a caudal cero es 1.33334 veces la carga ingresada, y el caudal más alto es 2 veces el caudal ingresado, lo que de nuevo da b = 2. Una bomba sin curva indicada no agrega carga. La curva no se trunca donde la carga llega a cero, así que un caudal mayor que el que la curva puede entregar produce una carga negativa. La solución es una bomba más grande o una demanda menor, no un ajuste de curva diferente. Una curva puede tener más de tres puntos. El solucionador de EPANET recibe todos y interpola entre ellos, mientras que la línea Ecuación y el solucionador incorporado usan los puntos más bajo, medio y más alto.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Ayuda de columnas de tabla';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE -- the Hide/Show row beside it names the
// identical menu. **GESTURE FIRST, THEN ACTION, SINCE 2026-10-06** (Ida, User guide): the cells were
// swapped in all 27 files, by script and unchanged, so this table reads in the same order as the
// key-then-action tables beside it (lpn_notes_7_def, lpn_hotkeys_map_def).
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Haga clic en el encabezado</td><td>Seleccionar columna</td></tr><tr><td>Ctrl+clic o Shift+clic en otro encabezado</td><td>Agregar o extender la selección de columnas</td></tr><tr><td>Arrastre o use Administrar columnas… en el menú de clic derecho o ⋮</td><td>Mover (reordenar) las columnas seleccionadas</td></tr><tr><td>Pase el puntero por la esquina superior de un encabezado, o selecciónelo o llegue a él con Tab</td><td>Menú ⋮ y flecha de orden.</td></tr><tr><td>Clic derecho en el encabezado o menú ⋮ en la esquina superior derecha del encabezado</td><td>Ocultar, Mostrar todas, o Administrar visibilidad y orden</td></tr><tr><td>Icono de flecha en la esquina superior derecha del encabezado</td><td>Ordenar por columna</td></tr><tr><td>Clic derecho, menú ⋮ en la esquina superior derecha del encabezado, o Ctrl+Shift+V</td><td>Pegar como filas nuevas al final de la tabla</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Atajos de teclado de la tabla';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Teclas de flecha</td><td>Desplazarse.</td></tr><tr><td>Tab, Enter</td><td>Terminar la entrada y avanzar una celda hacia la derecha (Tab) o hacia abajo (Enter).</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Retroceder una celda hacia la izquierda (Shift+Tab) o hacia arriba (Shift+Enter).</td></tr><tr><td>Shift+teclas de flecha</td><td>Ampliar la selección.</td></tr><tr><td>Ctrl+C</td><td>Copiar la selección.</td></tr><tr><td>Ctrl+D</td><td>Rellenar la selección hacia abajo desde su fila superior.</td></tr><tr><td>Ctrl+Enter</td><td>Rellenar la selección con el valor de la celda activa.</td></tr><tr><td>Ctrl+A</td><td>Seleccionar toda la tabla.</td></tr><tr><td>Ctrl+Shift+V</td><td>Pegar como filas nuevas al final de la tabla.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Cambiar a la pestaña siguiente o anterior, sea una tabla o un gráfico.</td></tr><tr><td>Delete</td><td>Borrar la celda activa. Para borrar un rango seleccionado, haga clic con el botón derecho y elija Eliminar.</td></tr><tr><td>F2</td><td>Abrir una celda para editarla.</td></tr><tr><td>Esc</td><td>Cancelar una edición.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Los límites de las bandas de color permanecen iguales';
$ec_lang['lpn_notes_color_def']='Los límites de las bandas de color se fijan cuando se elige un método de Asignación de rangos. No se vuelven a fijar en cada paso de tiempo, porque eso haría que los colores significaran algo nuevo en cada paso, y eso no ayuda a visualizar un sistema. Un escenario muestra los límites de Base. EPANET funciona de la misma manera. Para obtener límites nuevos, elija un método de nuevo o ingrese los límites.';
$ec_lang['lpn_notes_engine_term']='Qué versión de EPANET usa esta página';
$ec_lang['lpn_notes_engine_def']='El solucionador de EPANET de esta página es OWA-EPANET 2.3.5, publicado el 20 de febrero de 2025. EPANET lo desarrolla Open Water Analytics, una comunidad que trabaja con la Agencia de Protección Ambiental de los Estados Unidos, que publicó la versión 2.2.0 en diciembre de 2019. El informe de ejecución lo llama 2.3.05 porque el motor escribe el último número con dos dígitos. Llega a esta página a través de epanet-js 0.9.0 de Luke Butler, bajo licencia MIT, y funciona dentro de su navegador: su red nunca se envía a ningún lado para resolverse.';
// The Notes example (Task 785). Held by dev/lpn-spike/user-guide-notes-harness.js.
$ec_lang['lpn_guide_nt_example_term']='Ejemplo en Net1: una bomba más allá de su curva';
$ec_lang['lpn_guide_nt_example_def']='Abra el ejemplo Net1 y elija Agua, Bibliotecas. La curva 1, Pump Curve for Pump 9, tiene un punto, 1500 gpm a 250 ft. La carga a caudal cero es de 333.3 ft y el caudal más alto es de 3000 gpm. A 3500 gpm, que está más allá del extremo de la curva, la curva da una carga de −120.4 ft. El solucionador de EPANET informa esa misma carga, una pérdida de 120.4 ft a través de la bomba, y advierte que las bombas no pueden entregar suficiente caudal o carga.';
// The user manual's own entry (Task 785). Held by dev/lpn-spike/user-guide-own-harness.js.
$ec_lang['lpn_guide_own_example_term']='Ejemplo en Net1';
$ec_lang['lpn_guide_own_example_def']='<p>Abra el ejemplo Net1, presione Ctrl+K y escriba criticidad. Menús muestra la fila Análisis de criticidad… en Agua, Analizar. Cuadros muestra las entradas que la mencionan, entre ellas Buscar y reemplazar, Caudal contra incendios y Criticidad: análisis, y esta entrada. Al elegir la fila se muestra dónde está Análisis de criticidad… en el menú Analizar, y no se ejecuta.</p>';
$ec_lang['lpn_id_invalid']='Ingrese un ID sin espacios y sin comillas.';
$ec_lang['lpn_id_taken']='Ese ID ya está en uso.';
$ec_lang['lpn_diag_no_fixed_head']='Agregue un embalse o un depósito. La red necesita al menos un nivel de agua conocido antes de poder resolverse.';
$ec_lang['lpn_diag_dangling_link']='Una tubería o bomba se conecta a un nodo que ya no existe:';
$ec_lang['lpn_diag_unreachable']='Estos nodos no tienen ruta hacia un embalse ni un depósito:';
// Tom, 2026-10-09: a node nothing connects to a source is left out of the run, not refused. The
// ids stand in the status bar until the network changes. Said in EPANET's own terms (junction,
// reservoir, tank) and never as an error, because the run happened.
$ec_lang['lpn_omitted_note']='Se omitieron de esta ejecución porque ninguna ruta lleva desde ellos a un embalse o depósito: {ids}';
// BOTH OF THESE NAME THE VALVES. The page ends each one with a list of IDs, which is the reason
// this calculator writes its own messages instead of showing EPANET\'s numbered errors: a person
// looking at a drawing can act on \'V3\' and can do nothing at all with \'error 110\'.
// ---- Warming the EPANET solver (Tom, 2026-08-14) ----
// The 664 KB solver is fetched the moment a network first needs it -- when an active valve type is
// chosen, when the solver is switched on, or when a project arrives already holding one -- because
// that is the moment the user is still online. These three say what is happening in plain terms,
// and the point of all three is the SECOND half of each sentence: the fetch happens once and then
// the network works offline. A message that only said "downloading" would explain the wait without
// explaining why it is worth it.
// TWO PAIRS, because the same fetch has two reasons and one message cannot be true of both.
// Tom turned the solver ON and was told about VALVES he had not created (2026-08-14). The valve
// pair is right when a valve triggered the fetch; the plain pair is right when the user simply
// chose the solver.
$ec_lang['lpn_engine_fetching']='Descargando el solucionador de EPANET. Se descarga una vez y luego se guarda en este dispositivo, así que después funciona sin conexión.';
$ec_lang['lpn_engine_ready']='El solucionador de EPANET ya está en este dispositivo, y funciona sin conexión.';
$ec_lang['lpn_engine_unavailable']='No se pudo descargar el solucionador de EPANET, necesario para resolver las válvulas rompedoras de presión y de propósito general (PBV, GPV). Después de una conexión a internet, el solucionador queda guardado en este dispositivo.';
// The cause-specific sibling: {reason} is lpn_time_engine_fetch_failed (only a download can reach this notice).
// Offline keeps the sentence above. {wrong} in lpn_time_engine_run_failed is filled with lpn_wrong_btn.
$ec_lang['lpn_engine_unavailable_why']='Las válvulas rompedoras de presión y de propósito general (PBV, GPV) no se pueden resolver sin el solucionador de EPANET. {reason}';
$ec_lang['lpn_engine_needed_loading']='Cargando el solucionador de EPANET mientras usted construye. Los resultados estarán disponibles cuando termine de cargarse.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Progreso de carga del solucionador';
$ec_lang['lpn_engine_wait']='Cargando el solucionador. Los resultados se retrasarán un momento. Continúe trabajando.';
$ec_lang['lpn_engine_wait_pct']='Solucionador cargado al {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='Solucionador: {kb} KB cargados hasta ahora. El total no está disponible, así que se desconoce el porcentaje completado.';
$ec_lang['lpn_engine_needed_failed']='El solucionador de EPANET aún no se cargó, no se puede cargar, y esta red solo se puede resolver con él. Se cargará cuando esté conectado a internet.';
$ec_lang['lpn_engine_needed_failed_why']='Esta red solo se puede resolver con el solucionador de EPANET. {reason}';
$ec_lang['lpn_diag_valve_on_fixed_head']='Estas válvulas se conectan directamente a un embalse o a un depósito, que fija el gradiente hidráulico en ese nodo, así que la válvula no tiene nada que controlar. Inserte una tubería corta entre la válvula y el embalse o el depósito:';
$ec_lang['lpn_diag_not_converged']='No se encontró una solución. Revise si hay valores físicamente imposibles, como un diámetro de cero.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='La resolución no convergió. Estos números son los de la última iteración, no una respuesta. No los use.';
$ec_lang['lpn_diag_not_converged_trials']='Se detuvo después de {iterations} iteraciones.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Se detuvo después de {iterations} iteraciones con un error relativo de {error}, que no alcanzó el valor de Precisión de {accuracy}.';
$ec_lang['lpn_field_roughness']='Rugosidad';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='C de Hazen-Williams. Un número más alto significa una tubería más lisa: alrededor de 150 para plástico nuevo, 130 para acero o hierro nuevo, y 100 para tubería vieja.';
$ec_lang['lpn_field_length']='Longitud';
// Task 643 (Tom, 2026-10-14): an Auto length is the slope distance. No claim about accuracy (Task 641).
$ec_lang['lpn_field_length_slope_tip']='Longitud de la tubería. Cuando Auto está marcado, la longitud se mide a lo largo de la pendiente: la longitud dibujada combinada con la diferencia de elevación entre los dos nodos extremos.';
$ec_lang['lpn_field_from']='Desde';
$ec_lang['lpn_field_to']='Hasta';
// Tom, 2026-10-09: From and To are editable text. Said in the box a refused ID is said in.
$ec_lang['lpn_link_end_unknown']='Ningún nodo tiene el ID {id}.';
$ec_lang['lpn_link_end_same']='Desde y Hasta deben ser nodos distintos.';
// Tom, 2026-10-09: "Break link for node?", adapted to name the pipe. The two answers are Yes and No
// because No is not a cancel: it places the node where it was pressed, joined to nothing.
$ec_lang['lpn_split_pipe_ask']='¿Dividir la tubería {id} en este nodo?';
$ec_lang['lpn_split_yes']='Sí';
$ec_lang['lpn_split_no']='No';
// Object snap (Task 782). The tip beside the snap glyph on a pipe vertex: "Pipe 10, vertex 2". A node
// or a pipe is named by its type word and ID alone.
$ec_lang['lpn_snap_vertex']='{link}, vértice {n}';
// A tank, reservoir or junction snapped onto a node of another type is placed at exactly that
// position. Two nodes at one point are legal in EPANET, and the map cannot show that they are separate.
$ec_lang['lpn_snap_node_on_node']='{new} se colocó en la ubicación de {target}. Los dos nodos no están conectados.';
// The same, for a node DRAGGED onto another node.
$ec_lang['lpn_snap_moved_on_node']='{moved} se movió a la ubicación de {target}. Los dos nodos no están conectados.';
// The Shape (Task 779): map annotation, a point, a polyline or a polygon. Tom, 2026-10-06: "Either
// way, we call it a 'Shape'". The tip beside the snap glyph on a Shape point: "Shape S1, point 2".
$ec_lang['lpn_snap_shape_point']='{shape}, punto {n}';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Tipo de válvula';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Tipo de válvula. Una válvula de estrangulamiento (TCV) aplica una pérdida fija. PRV, PSV y FCV mantienen una presión o un caudal, y se abren totalmente, se cierran o se cierran parcialmente a medida que cambian las condiciones hidráulicas. Una PBV quita una presión fija, y una GPV sigue una curva de pérdida de carga. Los tipos controlan propiedades hidráulicas distintas, así que se pueden perder ajustes al cambiar el tipo.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Estrangulamiento (TCV)';
$ec_lang['lpn_valve_type_prv']='Reductora de presión (PRV)';
$ec_lang['lpn_valve_type_psv']='Sostenedora de presión (PSV)';
$ec_lang['lpn_valve_type_fcv']='Control de caudal (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Rompepresión (PBV)';
$ec_lang['lpn_valve_type_gpv']='Uso general (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Caída de presión';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='La presión que la válvula elimina. Una válvula rompepresión siempre quita exactamente esta cantidad de presión, sin importar hacia dónde vaya el agua. Es una caída a través de la válvula, no una presión que se mantiene.';
$ec_lang['lpn_inp_drop_gpv_curve']='Esta válvula hace referencia a una curva de pérdida de carga que no está en el archivo. La válvula se importó sin curva, así que permanece totalmente abierta hasta que se elija una curva.';
$ec_lang['lpn_gpv_curve_source']='Curva de pérdida de carga de la válvula';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='La curva del cuadro Bibliotecas que da la pérdida de carga a través de esta válvula para cada caudal. Varias válvulas pueden usar la misma curva, y editarla allí cambia todas ellas.';
$ec_lang['lpn_field_valve_setting_pressure']='Ajuste de presión';
$ec_lang['lpn_field_valve_setting_pressure_tip']='Una válvula reductora de presión mantiene la presión en su lado aguas abajo en este valor o por debajo. Una válvula sostenedora de presión mantiene la presión en su lado aguas arriba en este valor o por encima.';
$ec_lang['lpn_field_valve_setting_flow']='Ajuste de caudal';
$ec_lang['lpn_field_valve_setting_flow_tip']='Caudal máximo a través de la válvula. Cuando el caudal es menor que este valor, la válvula está totalmente abierta y no agrega pérdida.';
$ec_lang['lpn_field_valve_setting']='Ajuste';
$ec_lang['lpn_field_valve_setting_loss']='Coeficiente de pérdida';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Carga que quita la válvula de estrangulamiento, como múltiplo de la carga de velocidad. Use 0 para una válvula totalmente abierta. Este único valor es toda la pérdida de una válvula de estrangulamiento.';
$ec_lang['lpn_field_valve_diameter_tip']='Diámetro de la abertura de la válvula. La velocidad a través de la válvula se calcula a partir de este diámetro, y la pérdida a partir de esa velocidad.';
$ec_lang['lpn_field_valve_km_tip']='Pérdida a través del cuerpo de la válvula cuando está totalmente abierta, además de cualquier pérdida debida al ajuste de la válvula. Se expresa como múltiplo de la carga de velocidad. Use 0 para ignorarla.';
$ec_lang['lpn_field_km']='Coeficiente de pérdida localizada (menor), k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Pérdida localizada, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Curva de carga de la bomba';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='La curva del cuadro Bibliotecas que da la carga que agrega esta bomba para cada caudal. Varias bombas pueden usar la misma curva, y editarla allí cambia todas ellas.';
// **"THE NOTES BELOW" DO NOT EXIST ON THIS PAGE** (Tom, 2026-09-05: *"There are no notes below.
// It's in Help, Notes on this page."*). Every other calculator in this suite is a form with its
// notes printed under it, and this sentence was written in that habit; the map page is a full-window
// drawing surface and its notes are a Help row. The sentence now names the row the way the menu
// does. Reworded in English only, so the 26 translations are stale until the next sprint resyncs
// them -- `detect_english_drift.php` is what carries that.
// **THE PUMP'S OWN EFFICIENCY, ON THE PUMP** (Tom, 2026-09-05: *"The pump has no efficiency of its
// own, and I don't see an interface for that."*). Three states and three sentences, because "this
// pump has no curve" and "this pump names a curve the file never stated" reach the same arithmetic
// by different roads and only one of them is a problem the reader can act on.
//
// {name} and {percent} are placeholders and not concatenation (Task 193): a language that puts the
// curve name first, or wraps a percentage in its own punctuation, cannot express a prefix sandwich.
// **THE ELEMENT'S DESCRIPTION** (Task 674). EPANET's own word, and EPANET's own Property Editor row:
// the terminology rule decides it, and there is no vocabulary collision here of the kind Label and
// Text have. EPANET carries it as the trailing comment on the element's own row in the file, which is
// where this page now reads and writes it; until Task 674 it was read nowhere and every imported
// description was discarded in silence.
$ec_lang['lpn_field_desc']='Descripción';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='Marcador';
// Tom, 2026-09-06, in dev/new-english-keys.md, answering Wave 0's finding that a bare 'Tag'
// reads as markup or as a price tag in most languages: Add _syn 'Tag or user defined field
// possibly for grouping assets possibly in pressure zones'. His sentence is the commentary,
// verbatim and right of the pipe; the substitutable half is left of it, because the generator
// strips commentary by POSITION and a whole sentence on the left ships to 26 agents as a
// synonym list.
// Edited by TGH 2026-09-07
// ROADMAP Task 247. Tom's own words, given verbatim on 2026-09-19 when he shortened the label from
// "Services at this customer" to "Number of services": the short label loses the "at this customer"
// that told a translator WHOSE services are being counted, and this is where that goes back.
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Un marcador puede tener el significado que usted necesite, como una zona de presión o una orden de trabajo. Ningún cálculo aquí ni en EPANET lo lee. Un marcador es una sola palabra: EPANET deja de leer en el primer espacio, así que un espacio se rechaza al escribirlo. Se conserva al importar y al exportar el archivo de EPANET.';
$ec_lang['lpn_pump_effic_curve']='Curva de eficiencia de la bomba';
$ec_lang['lpn_pump_effic_curve_tip']='La curva del cuadro Bibliotecas que indica qué tan eficiente es esta bomba en cada caudal. Varias bombas pueden usar la misma curva, y editarla allí cambia todas ellas. Esta bomba solo guarda la referencia; los puntos mismos se leen y se editan en Bibliotecas, Curvas.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Ninguna curva elegida';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Curvas';
$ec_lang['lpn_curve_library_link_tip']='Abre el cuadro Bibliotecas en su sección Curvas, donde una curva se agrega, se describe, se edita y se elimina. Un elemento indica cuál curva usa.';
// {name} and {ids} are placeholders and not concatenation (Task 193). Said only when a second
// element is really on the curve: a table on one element's popup reads as that element's own, and
// the moment it is not is exactly the moment an edit here moves somebody else's answer.
// A curve of more than three points is READ-ONLY on the popup: this table offers three rows because
// the page fits a head curve from at most three points, and shrinking a manufacturer's curve to fit
// a widget is what the curve library exists to have stopped.
// **WHAT A CURVE DESCRIBES, AND EPANET HAS EXACTLY FOUR** (Tom, 2026-09-05: *"there will be four
// kinds of curve, Pump (head), (Pump) Efficiency, (Tank) Volume, and Headloss. Right?"*). The kind
// decides the two column headings and their units. EPANET states it in a `;PUMP:`-style comment
// above the curve's own rows, which this page reads and writes back, so a curve nothing references
// still knows what it is.
$ec_lang['lpn_curve_kind_head']='Carga de la bomba';
$ec_lang['lpn_curve_kind_effic']='Eficiencia de la bomba';
$ec_lang['lpn_curve_kind_volume']='Volumen del depósito';
$ec_lang['lpn_curve_kind_headloss']='Pérdida de carga de la válvula';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Tipo no indicado';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Volumen';
$ec_lang['lpn_pump_effic_col']='Eficiencia';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Esta bomba no tiene curva de eficiencia elegida, así que funciona a la eficiencia fijada para toda la red, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Esta bomba indica una curva de eficiencia llamada {name}, que nada en este proyecto define, así que funciona a la eficiencia fijada para toda la red, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Modo: Selección. Seleccione un elemento, una etiqueta o un Texto para verlo o cambiarlo. Arrastre para mover un nodo, una etiqueta o un Texto. Use la herramienta Vértices para agregar o quitar las curvas de una tubería.';
$ec_lang['lpn_mode_delete']='Modo: Eliminar. Seleccione un elemento para quitarlo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Modo: Vértices. Los vértices de cada tubería se muestran como pequeños tiradores cuadrados. Especifique un punto en una tubería para agregar un vértice, seleccione un tirador para quitarlo, o arrastre un tirador para moverlo. En este modo no se puede cambiar nada más en el mapa.';
$ec_lang['lpn_mode_zoom_window']='Modo: Ventana de zoom. Especifique dos esquinas opuestas de un recuadro, o arrastre uno, en el mapa para acercarse a él.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='No hay nada seleccionado. Primero seleccione un elemento en el mapa y luego presione Eliminar.';
$ec_lang['lpn_mode_add_junction']='Modo: Agregar nudo. Especifique una ubicación en el mapa para colocar un nudo. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
$ec_lang['lpn_mode_add_reservoir']='Modo: Agregar embalse. Especifique una ubicación en el mapa para colocar un embalse. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
$ec_lang['lpn_mode_add_tank']='Modo: Agregar depósito. Especifique una ubicación en el mapa para colocar un depósito. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
$ec_lang['lpn_mode_add_pipe']='Modo: Agregar tubería. Seleccione un nodo inicial y luego un nodo final para conectarlos. Especifique puntos en espacio abierto entre ellos para curvar la línea, o presione Escape para empezar de nuevo. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
$ec_lang['lpn_mode_add_pump']='Modo: Agregar bomba. Seleccione un nodo inicial y luego un nodo final para conectarlos. Especifique puntos en espacio abierto entre ellos para curvar la línea, o presione Escape para empezar de nuevo. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
$ec_lang['lpn_mode_add_valve']='Modo: Agregar válvula. Seleccione un nodo inicial y luego un nodo final para conectarlos. Especifique puntos en espacio abierto entre ellos para curvar la línea, o presione Escape para empezar de nuevo. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Modo: Agregar texto. Especifique una ubicación en el mapa para colocar un Texto. Especifique una ubicación cerca de un nodo para adjuntar el Texto a ese nodo. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
$ec_lang['lpn_mode_add_chain']='Modo: Cadena de nudos y tuberías. Especifique un punto del mapa para agregar un nudo, luego especifique cada punto siguiente para agregar una tubería y un nudo. Especifique un nodo existente para continuar desde él. Presione Esc para terminar la cadena. Cambie al modo Selección para cambiar o mover elementos, etiquetas y Textos.';
$ec_lang['lpn_mode_add_shape']='Modo: Agregar figura. Especifique cada punto. Especifique de nuevo el último punto o presione Enter para terminar; especifique el primer punto para cerrar un polígono.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Use este modo para cambiar, mover y arrastrar elementos y texto en el mapa, o para desplazar el mapa. Es el modo predeterminado del mapa. Presionar Esc una segunda vez borra la selección.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Auto';
$ec_lang['lpn_method_switch_confirm']='Cambiar el método de fricción no cambia los números de rugosidad ya ingresados en las tuberías, y una rugosidad para un método no tiene sentido para otro. Revise cada tubería después. ¿Cambiarlo de todos modos?';
// "Closed", not "Shut" (R-224, Tom, 2026-09-24: "we are using different words Shut and Closed.
// What are the translators supposed to do? EPANET says Closed. So we purge Shut."). "Shut" had been
// chosen (2026-08-14) because "closed" is a live polysemy INSIDE hydraulics -- a CLOSED CONDUIT is
// a full, pressurised pipe as opposed to an open channel, and every pipe on this page is one, so
// the wrong reading was not obviously wrong to a translator. Tom's ruling overrides that: EPANET's
// own word wins, translators already had EPANET's dictionary for it (every language here that had
// translated this key had independently landed on its own word for "closed", not "shut"), and one
// polysemy risk does not outweigh the suite running two words for one state. This is unrelated to
// Active, which is a different question -- whether the scenario contains the link at all
// (paneColClosed() in js/looped-network.js) -- and stays "Active".
$ec_lang['lpn_field_closed']='Cerrada';
$ec_lang['lpn_field_closed_tip']='Cierre esta tubería para que no pueda pasar agua por ella. La tubería permanece en el mapa y conserva todos sus valores, y puede abrirla de nuevo en cualquier momento.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Longitud';
$ec_lang['lpn_field_lat']='Latitud';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='Norte';
$ec_lang['lpn_field_easting']='Este';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.
$ec_lang['lpn_field_lat_abbr']='Lat.';
$ec_lang['lpn_field_lon_abbr']='Long';
// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Ingrese una ubicación de coordenadas para colocar este nudo con exactitud. En un escenario esta ubicación se aplica solo en ese escenario, igual que al arrastrar; en Base coloca el nudo en todos los escenarios.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Eso está fuera del mapa. La latitud de Pseudo Mercator va de -85.05 a 85.05 y la longitud va de -180 a 180.';
$ec_lang['lpn_field_text_size']='Multiplicador de tamaño';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Mostrar en todos los niveles de zoom';
$ec_lang['lpn_field_text_all_zoom_tip']='Mantiene este texto en el dibujo sin importar cuánto aleje el zoom. Desmárquelo y el texto se oculta junto con las demás etiquetas cuando la vista sea más ancha que el umbral de etiquetado establecido en Mapa y página.';
$ec_lang['lpn_tool_labels']='Etiquetas';
$ec_lang['lpn_labels_heading_node']='Etiquetas de nodo';
$ec_lang['lpn_labels_heading_link']='Etiquetas de línea';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Aplicar a todos';
$ec_lang['lpn_settings_apply_to_all_tip']='Cada elemento de este tipo que ya está dibujado recibe un ID que empieza con este texto. Cada uno conserva su número. Un ID que no termina en un número no se cambia.';
$ec_lang['lpn_confirm_apply_prefix']='¿Renombrar elementos ({n}) para que sus ID empiecen con {prefix}? Cada uno conserva su número.';
$ec_lang['lpn_prefix_applied']='Elementos renombrados: {n}. Elementos sin cambios: {skipped}.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Texto que se agrega después del gradiente de pérdida de carga en las etiquetas del mapa. No escriba aquí un signo de porcentaje. Se agrega automáticamente cuando las unidades son porcentaje.';
$ec_lang['lpn_labels_separator']='Texto entre valores';
$ec_lang['lpn_labels_separator_tip']='Texto entre una propiedad y la siguiente en una etiqueta. Un espacio de forma predeterminada.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Prioridad';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='El orden en que se descartan los valores cuando una etiqueta no cabe. El valor numerado 1 se descarta primero. Cuando queda un solo valor y dos etiquetas siguen superponiéndose, se oculta una de ellas: la que tenga la demanda más baja, la presión más cercana a la mitad del rango, o la elevación o carga numéricamente más cercana a la de los nudos vecinos.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Ant.';
$ec_lang['lpn_labels_col_after']='Desp.';
$ec_lang['lpn_labels_col_decimals']='Decimales';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Mostrar';
$ec_lang['lpn_labels_show_tip']='El orden en que aparecen los valores en una etiqueta. El valor numerado 1 va primero: en la parte superior de una etiqueta apilada, y al principio de una etiqueta en una sola línea.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Usar unidades';
$ec_lang['lpn_labels_use_units_tip']='Marque para mostrar la unidad en el cuadro Después y en la etiqueta, y para actualizarla cuando cambien las unidades. Desmarque para ingresar un texto personalizado en Después.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Estado inicial';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Colores de nudos';
$ec_lang['lpn_settings_sym_link_colors']='Colores de líneas';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Imagen de fondo...';
$ec_lang['lpn_backdrop_add']='Agregar';
// BARE VERBS, and they are only correct because BOTH doors now print a "Background image" heading
// over them (backdropRows() in js/looped-network.js). The 2026-08-04 ruling that made these
// "Scale image"/"Position image" was right about the defect -- a bare verb orphans in the Insert
// menu, where nothing above it says what is being scaled -- and wrong about the cheapest fix: the
// object belongs in ONE heading, not repeated in five labels. Never restore a bare verb here
// without checking the heading is still rendered.
// Two ways to set the same number, so both say which one they are (Task 276). Picking is the coarse
// step -- Tom, 2026-08-10: "mouse (and hand!!!) picking is never precise" -- and the other is the
// correction. The second label NAMES the World File rather than saying "by typing", because the
// World File was "hidden and hard to discover" (Tom, 2026-08-13) and a menu is where it gets found.
// "The size of one pixel ON THE MAP", in all three, and NOT "pixel size" (Task 297 Wave 0). "Pixel
// size" reads just as easily as the image's pixel DIMENSIONS -- a property of the file -- as it does
// the distance one pixel covers, which is the only thing the code wants. Tom, 2026-08-13, chose the
// qualifier: "'map' is better than real world or real" -- the reader is looking at a map, so the
// frame they are being asked about is the one already in front of them.
// The longer label costs nothing since Task 276 made this control a menu button rather than a
// <select>, so a row label no longer sets the collapsed width.
// "world file" stays LOWERCASE. Title Case reads as a brand and invites a translator to leave it in
// English; the concept carries its own glossary.json entry instead.
//
// There are NO lpn_backdrop_wld_ask/_none/_choose keys (Tom, 2026-08-13): "We don't ask for world
// file... We ask for a paste of World File contents." The dialog that opened a second file picker is
// gone; the two doors that remain both take the CONTENTS -- the multi-select picker and the textarea
// behind lpn_backdrop_scale_entry. Do not re-add an ask.
$ec_lang['lpn_backdrop_scale']='Escalar por selección';
$ec_lang['lpn_backdrop_scale_entry']='Escalar por archivo de georreferenciación o por el tamaño de un píxel en el mapa';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Escalar desde el tamaño actual, alrededor de un punto que usted elija';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Especifique el punto de la imagen de fondo que debe quedarse donde está.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Escale desde su tamaño actual. 1 la deja igual, 1.1 la hace 10% más grande, 0.9 la hace 10% más pequeña.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Ingrese el tamaño de un píxel en el mapa, o pegue el contenido completo del archivo de georreferenciación de la imagen';
$ec_lang['lpn_backdrop_scale_entry_bad']='Escriba un solo número para el tamaño de un píxel en el mapa, o pegue las seis líneas completas de un archivo de georreferenciación.';
$ec_lang['lpn_backdrop_wld_bad']='Este archivo de georreferenciación rota, refleja o estira la imagen de forma desigual. El mapa solo puede mover una imagen y cambiar su tamaño en la misma proporción en ambas direcciones, por lo que el archivo no se utilizó.';
$ec_lang['lpn_backdrop_unreadable']='Su navegador web no puede mostrar esta imagen. Guárdela como imagen PNG o JPEG y añádala de nuevo.';
$ec_lang['lpn_backdrop_position']='Mover';
$ec_lang['lpn_backdrop_remove']='Quitar';
$ec_lang['lpn_backdrop_remove_confirm']='¿Quitar la imagen de fondo?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Mapa mundial…';
$ec_lang['lpn_map_attach_tip']='Adjunta el mapa mundial a este proyecto sin cambiarlo de ninguna otra manera.';
$ec_lang['lpn_map_attach_add']='Adjuntar';
$ec_lang['lpn_map_attach_readjust']='Reajustar';
$ec_lang['lpn_map_attach_readjust_tip']='Vuelve al paso 2 del proceso de adjuntar el mapa.';
$ec_lang['lpn_map_attach_scale_from']='Escalar desde el tamaño actual…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Escale el mapa desde su tamaño actual, respecto al centro de su dibujo. 1 lo deja igual, 1.1 lo hace 10% más grande, 0.9 lo hace 10% más pequeño.';
$ec_lang['lpn_map_attach_scale_from_bad']='Escriba un solo número mayor que cero.';
$ec_lang['lpn_map_attach_scale_from_done']='El mapa se redimensionó, y su dibujo y cada coordenada en él están exactamente como estaban.';
$ec_lang['lpn_map_attach_none']='Todavía no hay ningún mapa mundial adjunto a este proyecto. Use primero Mapa, Mapa mundial, Adjuntar.';
$ec_lang['lpn_map_attach_remove']='Separar';
$ec_lang['lpn_map_attach_remove_tip']='Separa el mapa mundial. No afecta la red.';
$ec_lang['lpn_map_attach_done']='El mapa mundial ahora se muestra detrás del dibujo, y el proyecto no cambió. Use Mapa, Mapa mundial, Separar para quitarlo.';
// Edited by TGH 2026-10-07
$ec_lang['lpn_map_attach_removed']='El mapa mundial está separado, y la red no se ve afectada.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='El dibujo está sobre un mapa del mundo entero, en el océano a latitud cero y longitud cero. Primero encuentre la ubicación del proyecto: desplace y acerque el mapa detrás del dibujo, busque un nombre de lugar, o ingrese una latitud y una longitud. El dibujo en sí no se mueve.';
$ec_lang['lpn_mapgeo_step1']='Paso 1 de 2: encuentre la ubicación del proyecto';
$ec_lang['lpn_mapgeo_step2']='Paso 2 de 2: ajuste el mapa detrás de su dibujo';
$ec_lang['lpn_mapgeo_hint1']='Desplace y acerque el mapa detrás del dibujo, o busque un lugar, o ingrese una latitud y una longitud. Luego presione Colocar aproximadamente.';
$ec_lang['lpn_mapgeo_readjust_intro']='El dibujo está donde lo colocó por última vez. Para moverlo a otro lugar, desplace y acerque el mapa detrás del dibujo, busque un nombre de lugar, o ingrese una latitud y una longitud. El dibujo en sí no se mueve.';
$ec_lang['lpn_mapgeo_hint2']='Arrastre en cualquier lugar para deslizar el mapa bajo su dibujo. Su dibujo y cada coordenada en él permanecen exactamente donde están. Presione Georreferenciar aquí cuando el mapa esté bien.';
$ec_lang['lpn_mapgeo_gestures']='El zoom mueve el dibujo y el mapa juntos, para mostrar qué tan bien coinciden. Arrastrar mueve solo el mapa.';
// ---- THE SIZE AND TURN DIAL (Tom, 2026-09-18) -------------------------------------------------
//
// **A SLIDER, BECAUSE THERE IS NO DIRECT MANIPULATION HERE TO GIVE UP.** His own refutation of the
// objection: *"The map is practically infinite. There is no way to visually enlarge it or reduce
// it. The rectangle is a poor metaphor (and isn't working anyway). And the scroll wheel is
// discrete, not continuous."* A corner handle is a grip on a bounded object and the ground has no
// bounds, so the rectangle was never a picture of the thing it was resizing.
//
// **AND THE MIDDLE IS WHERE STEP 1 LEFT IT.** He asked for *"a slider for scale with 1 (from step
// 1) in the middle"*, so the readout is a factor and not a distance: it says how much bigger or
// smaller the ground is than the fit already agreed, which is the only quantity a person can judge
// by looking. The band is narrow on purpose and a wider move is the rectangle's job, or Map, World
// map, Move, which is the pick-it-up-again door.
$ec_lang['lpn_mapgeo_dial_turn']='Girar el mapa';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} grados';
$ec_lang['lpn_mapgeo_dial_size']='Tamaño del mapa';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} veces';
$ec_lang['lpn_mapgeo_dial_help']='Deslice las dos barras, o ingrese números en los cuadros que están sobre ellas, para agrandar o reducir el mapa y para girarlo. El centro de cada barra conserva el ajuste del paso 1, así que un tamaño de 1 y un giro de 0 significan sin cambio. Las teclas de flecha funcionan en ambas.';
$ec_lang['lpn_mapgeo_place']='Colocar aproximadamente';
$ec_lang['lpn_mapgeo_finish']='Georreferenciar aquí';
$ec_lang['lpn_mapgeo_cancelled']='El mapa mundial se restauró a su posición anterior, y el dibujo no se movió.';
$ec_lang['lpn_mapgeo_locked']='Termine con el botón Georreferenciar aquí, o presione Cancelar, antes de cambiar de proyecto o guardar. El mapa mundial todavía se está colocando.';
$ec_lang['lpn_backdrop_scale_prompt1']='Especifique dos puntos de la imagen de fondo, como los dos extremos de una escala gráfica. Luego ingrese la distancia real entre ellos.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distancia real entre los dos puntos';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Especifique el punto base (en la imagen) para el movimiento.';
$ec_lang['lpn_backdrop_position_prompt2']='Elija el método para el punto de destino y luego presione Continuar.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Ajustando la imagen de fondo.';
$ec_lang['lpn_backdrop_target_label']='Moverlo a:';
$ec_lang['lpn_backdrop_target_node']='Un nodo';
$ec_lang['lpn_backdrop_target_free']='Cualquier punto del mapa';
$ec_lang['lpn_backdrop_target_coords']='Coordenadas que usted escribe';
$ec_lang['lpn_backdrop_coords_prompt']='Escriba las coordenadas X,Y a las que debe moverse ese punto';
$ec_lang['lpn_backdrop_continue']='Continuar';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// One key for the toolbar button, the Project menu row and the Settings box's own title (Task 699).
$ec_lang['lpn_tool_settings']='Configuración';
$ec_lang['lpn_settings_show_titles']='Mostrar títulos de página';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Ocultar estos títulos';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Mostrar la ayuda de selección';
$ec_lang['lpn_settings_area_hint_tip']='Muestra sobre el mapa el mensaje que indica el paso siguiente mientras se selecciona un área.';
$ec_lang['lpn_settings_hover_card']='Mostrar todas las propiedades al pasar el puntero';
$ec_lang['lpn_settings_hover_card_tip']='Mantenga el puntero sobre un nodo, una línea o un cliente para ver todas sus propiedades con el formato indicado en Configuración, a cualquier escala, quepa o no la etiqueta en el mapa. Es un ajuste de este navegador, no del proyecto.';
// Task 805 (Tom, 2026-10-15, R-396: "It would be good to be able to hide the amber override
// indicators from the map. Maybe a Map, Clean map button is a good idea after all"). The rings'
// own switch, in Settings, Map and page, Page; and the Map menu row that hides them with the
// controls over the drawing. Both are browser settings.
$ec_lang['lpn_settings_override_marks']='Mostrar marcadores de valores específicos en el mapa';
$ec_lang['lpn_settings_override_marks_tip']='Muestra el anillo ámbar en un elemento con un valor específico en el escenario abierto, y el anillo gris discontinuo en un elemento que hereda uno. El panel Tablas marca los valores específicos de todos modos. Mapa, Limpiar mapa oculta los anillos mientras está marcado. Es un ajuste de este navegador, no del proyecto.';
$ec_lang['lpn_clean_map']='Limpiar mapa';
$ec_lang['lpn_clean_map_tip']='Marcado: se ocultan los botones de zoom, el botón de mapa de calles e imágenes satelitales, el botón Mensajes y los avisos, la ayuda de selección, el botón de comentarios y los anillos de valores específicos. Desmarcado: se muestran. Los errores se siguen mostrando en el mapa, y todos los avisos se siguen conservando en Mensajes. Es un ajuste de este navegador, no del proyecto.';
$ec_lang['lpn_settings_theme']='Tema';
$ec_lang['lpn_settings_theme_tip']='Elija colores claros u oscuros para la página. Sistema sigue el ajuste de su dispositivo. El dibujo del mapa se ve igual en todos los temas. Es un ajuste de este navegador, no del proyecto.';
$ec_lang['lpn_theme_system']='Sistema';
$ec_lang['lpn_theme_light']='Claro';
$ec_lang['lpn_theme_dark']='Oscuro';
$ec_lang['lpn_settings_id_prefixes']='Prefijos de ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Valores de creación';
$ec_lang['lpn_settings_defaults_note']='Se usan para los elementos que cree de ahora en adelante. Los elementos existentes no cambian.';
$ec_lang['lpn_settings_push_note']='Solo se aplican las propiedades cuyas etiquetas están visibles en este momento.';
$ec_lang['lpn_settings_push_btn']='Aplicar estos valores de elementos nuevos a todos los elementos existentes';
$ec_lang['lpn_push_confirm']='¿Reemplazar estas propiedades en todos los elementos existentes con los valores que ahora están fijados para los elementos nuevos? Los valores ingresados se sobrescribirán. Esto se puede deshacer.';
$ec_lang['lpn_push_properties']='Propiedades:';
$ec_lang['lpn_push_assets']='Nodos y tuberías:';
$ec_lang['lpn_push_none_displayed']='Ningún valor inicial se muestra como etiqueta en este momento, así que no hay nada que aplicar. Active las etiquetas de las propiedades que desee en el panel Etiquetas, y luego intente de nuevo.';
$ec_lang['lpn_push_nothing']='Ningún elemento existente tiene ninguna de las propiedades que se están aplicando.';
$ec_lang['lpn_push_no_change']='Todos los elementos ya tienen estos valores, así que nada cambiaría.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Propiedades personalizadas';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Propiedades definidas por el usuario. Se guardan con el proyecto y los escenarios como todas las demás propiedades.';
$ec_lang['lpn_cp_design']='Diseño';
$ec_lang['lpn_cp_design_tip']='Una fila por cada propiedad personalizada, y cada una se abre para mostrar: Clave, Etiqueta, Aplica a, Validar como, Permitir o restringir, el campo de caracteres nombrado por esa elección, Límite inferior de longitud, Límite superior de longitud, Límite inferior, Límite superior.';
$ec_lang['lpn_cp_add']='Agregar propiedad personalizada';
$ec_lang['lpn_cp_add_tip']='Agrega una fila a la tabla de diseño y la abre para editarla.';
$ec_lang['lpn_cp_remove_tip']='Quita esta propiedad de la tabla de diseño. Los valores ya escritos en los elementos se conservan en el archivo y se restauran si se define de nuevo una propiedad con la misma clave.';
$ec_lang['lpn_cp_none']='Todavía no se ha diseñado ninguna propiedad personalizada.';
$ec_lang['lpn_cp_unnamed']='Todavía sin nombre';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Clave';
$ec_lang['lpn_cp_key_tip']='Clave: una propiedad se guarda bajo este nombre. No se permiten espacios, y se le agrega un prefijo automáticamente para que su clave nunca choque con un campo integrado.';
$ec_lang['lpn_cp_label']='Etiqueta';
$ec_lang['lpn_cp_label_tip']='Etiqueta: aparece en el cuadro de propiedades, en Buscar y en el encabezado de una columna de tabla.';
$ec_lang['lpn_cp_applies']='Aplica a';
$ec_lang['lpn_cp_applies_tip']='Aplica a: lista de prefijos de ID, separados por comas, de los elementos que usan esta propiedad, como J,L,R.';
$ec_lang['lpn_cp_validate']='Validar como';
$ec_lang['lpn_cp_validate_tip']='Validar como: el formato que debe tener un valor válido. Las reglas de mayúsculas y minúsculas se aplican solo al alfabeto inglés. Elija No validar para aceptar cualquier valor.';
$ec_lang['lpn_cp_restrict']='Restringir estos caracteres';
$ec_lang['lpn_cp_restrict_tip']='Prohibir estos caracteres:';
$ec_lang['lpn_cp_allow_tip']='Permitir solo estos caracteres:';
$ec_lang['lpn_cp_characters_tip']='"@" significa cualquier letra; "#" significa cualquier dígito numérico, y debe enumerar por separado "-", "." y "," si se permiten; y cualquier carácter de espacio en blanco debe estar entre otros caracteres.';
$ec_lang['lpn_cp_restrict_mode']='Permitir o restringir';
$ec_lang['lpn_cp_restrict_mode_tip']='Permitir o restringir: los caracteres indicados son, o bien los únicos que un valor puede usar, o bien los que no puede usar.';
$ec_lang['lpn_cp_restrict_allow']='Permitir solo estos caracteres';
$ec_lang['lpn_cp_minlength']='Límite inferior de longitud';
$ec_lang['lpn_cp_minlength_tip']='Límite inferior de longitud: toda entrada más corta se marca. Úselo para encontrar entradas vacías e incompletas.';
$ec_lang['lpn_cp_length']='Límite superior de longitud';
$ec_lang['lpn_cp_length_tip']='Límite superior de longitud: cualquier entrada más larga se marca.';
$ec_lang['lpn_cp_low']='Límite inferior';
$ec_lang['lpn_cp_low_tip']='Límite inferior: este es el valor más pequeño que espera. Los números se comparan como números y el texto en orden alfabético.';
$ec_lang['lpn_cp_high']='Límite superior';
$ec_lang['lpn_cp_high_tip']='Límite superior: este es el valor más grande que espera. Los números se comparan como números y el texto en orden alfabético.';
$ec_lang['lpn_cp_val_none']='No validar';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Número .';
$ec_lang['lpn_cp_val_number_comma']='Número ,';
$ec_lang['lpn_cp_val_integer']='Entero';
$ec_lang['lpn_cp_val_upper']='MAYÚSCULAS';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} El valor se conserva exactamente como usted lo escribió.';
$ec_lang['lpn_valwarn_diameter']='El diámetro de una tubería o válvula normalmente está entre {min} y {max} {unit}. Revise el número y la unidad de diámetro.';
$ec_lang['lpn_valwarn_hw']='La C de Hazen-Williams normalmente está entre {min} y {max}. Un número fuera de ese intervalo suele ser una rugosidad pensada para otro método de fricción.';
$ec_lang['lpn_valwarn_manning']='La n de Manning normalmente está entre {min} y {max}. Un número fuera de ese intervalo suele ser una rugosidad pensada para otro método de fricción.';
$ec_lang['lpn_valwarn_dw']='La rugosidad de Darcy-Weisbach normalmente es mayor que 0 y como máximo {max} {unit}. Un número mayor suele ser una C de Hazen-Williams o una n de Manning.';
$ec_lang['lpn_valwarn_positive']='EPANET no acepta cero ni un número negativo aquí.';
$ec_lang['lpn_valwarn_negative']='EPANET no acepta un número negativo aquí.';
$ec_lang['lpn_valwarn_tank_levels']='EPANET no acepta este depósito. La profundidad de agua mínima no debe exceder la profundidad de agua, y la profundidad de agua no debe exceder la profundidad de agua máxima.';
$ec_lang['lpn_cp_bad_number']='Este valor no es un número, como requiere esta propiedad.';
$ec_lang['lpn_cp_bad_integer']='Este valor no es un número entero, como requiere esta propiedad.';
$ec_lang['lpn_cp_bad_case']='Este valor no está en MAYÚSCULAS, como requiere esta propiedad.';
$ec_lang['lpn_cp_bad_chars']='Este valor usa un carácter que esta propiedad no permite.';
$ec_lang['lpn_cp_bad_space']='Los espacios en blanco solo se permiten entre otros caracteres.';
$ec_lang['lpn_cp_bad_minlength']='Este valor es más corto de lo que esta propiedad permite.';
$ec_lang['lpn_cp_bad_length']='Este valor es más largo de lo que esta propiedad permite.';
$ec_lang['lpn_cp_bad_low']='Este valor está por debajo del límite inferior de esta propiedad.';
$ec_lang['lpn_cp_bad_high']='Este valor está por encima del límite superior de esta propiedad.';
$ec_lang['lpn_cp_key_needed']='Asigne a esta propiedad personalizada una clave sin espacios.';
$ec_lang['lpn_cp_key_taken']='Otra propiedad personalizada ya usa esa clave.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Escenario';
$ec_lang['lpn_scenario_base']='Base';
// "Base" is four letters carrying six English senses, standing alone as a proper name in a dropdown.
// KEPT, because Tom is right that it is solid where it sits (2026-08-14) and it is what WaterGEMS and
// InfoWater scenario managers call it -- so the fix belongs here, not in the English. Word list is
// his; "Original" was struck at his instruction.
// "Overrides" (Tom, 2026-10-04: *"I believe that the technical term may be 'Enter the scenario's
// override'"*; Mary found it is Bentley WaterGEMS's word, "Overriding Inheritance"). It replaced
// "custom values" (2026-08-14). The rejected alternative stays rejected for a TRANSLATION reason:
// "own values" calques onto the standard term for EIGENVALUES in most of Europe (es valores propios,
// de Eigenwerte, ru sobstvennye), and "changed values" is FALSE, because an override may equal
// Base's number (lpn_scenario_override_tip; dev/lpn-spike/scenario-harness.js). "Override" has no
// mathematical calque and says the scenario's value stands in for the parent's.
$ec_lang['lpn_scenario_overrides']='N.º de valores específicos';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='El anillo ámbar indica que este elemento tiene un valor que pertenece solo al escenario {name}.';
$ec_lang['lpn_scenario_mark_inh_tip']='El anillo gris discontinuo indica que el escenario {name} hereda un valor específico de este elemento de su escenario o alternativa superior.';
$ec_lang['lpn_scenario_overrides_tip']='Cada valor propio se marca en el mapa con un anillo ámbar. Cambie a {base} u otro escenario padre para ver el dibujo sin ellos.';
$ec_lang['lpn_scenario_menu']='Escenarios';
$ec_lang['lpn_scenario_tip']='El conjunto de valores que el dibujo está mostrando y que la página está resolviendo ahora mismo. Haga clic para cambiar de escenario, o para agregar, renombrar o eliminar uno.';
$ec_lang['lpn_scenario_new']='Escenario nuevo…';
$ec_lang['lpn_scenario_new_name']='Escenario {n}';
$ec_lang['lpn_scenario_prompt_name']='Nombre para este escenario';
$ec_lang['lpn_scenario_rename']='Renombrar escenario…';
$ec_lang['lpn_scenario_delete']='Eliminar escenario';
$ec_lang['lpn_scenario_delete_ask']='¿Eliminar el escenario {name}? El dibujo en sí no se modifica.';
$ec_lang['lpn_scenario_delete_goes']='Sus valores específicos ({n}) se eliminan con él.';
$ec_lang['lpn_scenario_delete_stays']='Estas alternativas que usa permanecen en el proyecto: {list}.';
$ec_lang['lpn_scenario_delete_has_children']='El escenario {name} no se puede eliminar porque tiene escenarios secundarios: {list}. Elimínelos primero, o muévalos a otro escenario superior.';
// Edited by TGH 2026-09-07
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Escenario base: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} está excluido de la red en {scenario}. Permanece en el dibujo y en los demás escenarios.';
$ec_lang['lpn_scenario_delete_in_base']='Para quitarlo del dibujo, elimínelo en el escenario {base}.';
$ec_lang['lpn_scenario_only_deleted']='{id} se eliminó. Formaba parte solo de {scenario}.';
$ec_lang['lpn_scenario_delete_blocked']='{id} no se eliminó, porque la línea {link} termina en él, y esa línea también existe fuera de {scenario}. Para eliminar ambos, elimínelos en el escenario {base}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_basic']='Modo básico';
$ec_lang['lpn_scenario_basic_tip']='Marcado: las alternativas están ocultas y son automáticas, cada escenario muestra sus valores específicos como propios y todos los escenarios nuevos son secundarios del escenario Base; el Administrador de escenarios y la tabla Escenarios no se muestran. Desmarcado: se muestran el Administrador de escenarios y la tabla Escenarios, y las alternativas se pueden compartir entre escenarios. El Administrador de escenarios está deshabilitado cuando el Modo básico está marcado. El Modo básico está deshabilitado cuando un proyecto tiene relaciones entre escenarios y alternativas que el Modo básico no puede mostrar.';
$ec_lang['lpn_scenario_basic_misfit']='Este proyecto tiene relaciones entre escenarios y alternativas que no son compatibles con el Modo básico de escenarios, por lo que el Modo básico está deshabilitado.';
$ec_lang['lpn_scenario_basic_misfit_base']='El escenario Base usa una alternativa distinta de Base.';
$ec_lang['lpn_scenario_copy']='Copiar escenario';
$ec_lang['lpn_scenario_copy_tip']='Copia el escenario abierto y sus valores específicos, y abre la copia.';
$ec_lang['lpn_scenario_copy_off']='Copiar escenario funciona en el Modo básico. Con el Modo básico desmarcado, agregue un escenario y elija sus alternativas en la tabla Escenarios.';
$ec_lang['lpn_sm_title']='Administrador de escenarios';
$ec_lang['lpn_sm_menu']='Administrador de escenarios…';
$ec_lang['lpn_sm_basic_on']='El Administrador de escenarios está deshabilitado cuando el Modo básico está marcado.';
$ec_lang['lpn_pane_tab_scenarios']='Escenarios';
$ec_lang['lpn_sm_col_parent']='Superior';
$ec_lang['lpn_sm_add_child']='Agregar secundario';
$ec_lang['lpn_sm_add_base']='Agregar base';
$ec_lang['lpn_sm_add_base_tip']='Agrega otro escenario Base. Comienza como una copia de Base, con sus propias alternativas, y las ediciones posteriores de Base no lo cambian.';
$ec_lang['lpn_sm_add_base_alt_tip']='Agrega otra alternativa Base. Comienza como una copia de los valores de Base en esta categoría, y las ediciones posteriores de Base no la cambian.';
$ec_lang['lpn_sm_delete']='Eliminar el elemento seleccionado. Un elemento en uso no se elimina.';
$ec_lang['lpn_sm_base_kept']='La Base de un árbol no se elimina. Otra Base agregada con Agregar base se elimina cuando nada la usa.';
$ec_lang['lpn_sm_rename']='Renombrar';
$ec_lang['lpn_sm_rename_alts_ask']='¿Renombrar las alternativas que tienen el mismo nombre?';
$ec_lang['lpn_sm_make_current']='Establecer como actual';
// Tips on greyed Scenario manager commands, saying why they are greyed (Perry, 2026-10-11).
$ec_lang['lpn_sm_current_already']='Este escenario ya es el escenario actual.';
$ec_lang['lpn_sm_none_selected']='Primero seleccione un elemento del árbol.';
$ec_lang['lpn_sm_base_named']='La Base de un árbol no se renombra.';
$ec_lang['lpn_sm_copy']='Copiar';
$ec_lang['lpn_sm_merge_up']='Combinar hacia arriba';
$ec_lang['lpn_sm_merge_up_tip']='Mueve los valores específicos de la alternativa seleccionada a una alternativa superior del árbol. La alternativa seleccionada hereda entonces esos valores.';
$ec_lang['lpn_sm_merge_up_root']='Una alternativa Base no tiene nada por encima en lo que combinarse.';
$ec_lang['lpn_sm_merge_none']='La alternativa {name} no tiene valores específicos que combinar.';
$ec_lang['lpn_sm_merge_pick']='¿En qué alternativa se combinan los valores específicos de {name}? Su alternativa superior aparece primero.';
$ec_lang['lpn_sm_merge_ask']='¿Mover hacia arriba los valores específicos ({n}) de {name} a {target}? Después, los hereda en lugar de reemplazarlos. Puede deshacerlo.';
$ec_lang['lpn_sm_merge_skipped']='{between} también reemplaza estos valores. Se omite y no se cambia, así que {name} los leerá de {between}, no de {target}:';
$ec_lang['lpn_sm_merge_line']='{asset}: {property}';
$ec_lang['lpn_sm_copy_up']='Copiar hacia arriba';
$ec_lang['lpn_sm_copy_up_tip']='Copia los valores específicos de la alternativa seleccionada en una alternativa superior del árbol. La alternativa seleccionada conserva sus valores específicos.';
$ec_lang['lpn_sm_copy_up_root']='Una alternativa Base no tiene nada por encima en lo que copiar.';
$ec_lang['lpn_sm_copy_none']='La alternativa {name} no tiene valores específicos que copiar.';
$ec_lang['lpn_sm_copy_pick']='¿En qué alternativa se copian los valores específicos de {name}? Su alternativa superior aparece primero.';
$ec_lang['lpn_sm_copy_ask']='¿Copiar hacia arriba los valores específicos ({n}) de {name} en {target}? {name} los conserva como valores específicos propios. Puede deshacerlo.';
$ec_lang['lpn_sm_copy_skipped']='{between} también reemplaza estos valores. Se omite y no se cambia, así que conserva sus propios valores para ellos:';
$ec_lang['lpn_sm_list_overrides']='Administrador de valores específicos…';
$ec_lang['lpn_sm_list_overrides_tip']='Enumera los valores específicos del escenario por categoría, cada uno con el valor heredado al que sustituye, y permite borrar cualquiera de ellos.';
$ec_lang['lpn_sm_list_overrides_none']='Este escenario no tiene valores específicos.';
$ec_lang['lpn_ovl_title']='Administrador de valores específicos: {name}';
$ec_lang['lpn_ovl_note']='Estos son los valores que este escenario define por sí mismo en las alternativas que usa, cada uno con el valor al que sustituye. Los valores que hereda no se enumeran ni se cuentan. Borre un valor específico para restablecer el valor heredado; Deshacer lo revierte. Seleccione un ID para ir al elemento en el mapa.';
$ec_lang['lpn_ovl_clear_selected']='Borrar valores específicos seleccionados';
$ec_lang['lpn_ovl_clear_all']='Borrar todos los valores específicos';
$ec_lang['lpn_ovl_clear_all_ask']='¿Borrar todos los valores específicos ({n}) de {name}? Cada valor vuelve al valor heredado. Deshacer lo revierte.';
$ec_lang['lpn_ovl_pick_tip']='Seleccione este valor específico para el botón Borrar valores específicos seleccionados.';
$ec_lang['lpn_ovl_bubble_off']='No está en el mapa';
$ec_lang['lpn_ovl_bubble_moved']='{quantity}, movido o con el tamaño cambiado';
$ec_lang['lpn_ovl_group']='{category}: {alternative}';
$ec_lang['lpn_ovl_col_override']='Valor específico';
$ec_lang['lpn_ovl_col_inherited']='Valor heredado';
$ec_lang['lpn_ovl_col_inherited_tip']='El valor que este escenario lee sin el valor específico: el valor del superior de la alternativa, o el valor de Base.';
$ec_lang['lpn_ovl_same']='(igual)';
$ec_lang['lpn_ovl_same_tip']='Igual al valor heredado. Sigue siendo un valor específico, y se cuenta.';
$ec_lang['lpn_sm_help']='Cómo funcionan los escenarios y las alternativas:\n\nEn el Modo básico, las alternativas están ocultas y son automáticas, y todos los escenarios nuevos son secundarios del escenario Base.\n\nCon el Modo básico desmarcado, hay disponible un árbol de herencia complejo, y las alternativas se pueden compartir entre escenarios. Pero el comportamiento predeterminado de las ediciones cuando se necesita una asociación de alternativa nueva (en ausencia de una administración proactiva por parte del usuario) es crear una alternativa con el mismo nombre que el escenario actual, lo que da a cada escenario su propio conjunto de alternativas.\n\nLas propiedades y los ajustes pertenecen a categorías de alternativas que aparecen como columnas de la tabla de escenarios y alternativas y como opciones de administración en el Administrador de escenarios.\n\nLos valores específicos se crean en los escenarios, pero en realidad pertenecen a las alternativas respectivas asociadas con el escenario; por eso un escenario es como una ventana hacia sus alternativas. Las asociaciones de alternativas con escenarios se administran en el panel derecho del Administrador de escenarios o en la tabla Escenarios del panel inferior. Crear un escenario nuevo no crea alternativas; el escenario nuevo usa las alternativas de su escenario superior hasta que se crean valores específicos que necesiten alternativas nuevas. Cuando se crean valores específicos en un escenario, se guardan en su alternativa respectiva para el escenario; si el escenario no tiene esa alternativa, se crea una nueva con el nombre del escenario.\n\nEjemplo: usted crea un escenario "Figura: ID de nodos y líneas" y edita un texto para que diga "ID de nodos y líneas." Al crear el escenario no se crea ninguna alternativa. Pero en el momento en que guarda el texto, se crea una alternativa de Texto llamada "Figura: ID de nodos y líneas" con el valor específico del valor del texto. En el Modo básico, esto se ve simplemente como un valor específico en el propio escenario.\n\nCopiar propiedades copia solo los valores específicos. En cualquier escenario distinto de Base, copia solo los valores específicos que el elemento tiene en ese escenario.\n\nCómo administrar los escenarios:\n\n- Elija Escenarios o una categoría de alternativas en la lista de arriba para mostrar su árbol.\n\n- Cree un elemento secundario del elemento seleccionado con Agregar secundario. Agregar base agrega otra Base, que comienza como una copia de Base tal como está ahora; las ediciones posteriores de Base no la cambian. Un elemento secundario nuevo lleva el nombre de su elemento superior; escriba un nombre para renombrarlo. Copiar copia la alternativa seleccionada. Combinar hacia arriba mueve los valores específicos de la alternativa seleccionada a una alternativa superior, elegida por nombre, y la alternativa seleccionada pasa a heredarlos; antes nombra cualquier valor que también reemplace una alternativa que se omite, el cual no se cambia. Para copiar un escenario, use Copiar escenario en el menú Escenarios, en el Modo básico; copia los valores específicos del escenario, con las alternativas que los contienen. Agregar base y Copiar escenario crean cada uno alternativas: Agregar base crea una alternativa Base para la nueva Base en cada categoría que contiene valores, y Copiar escenario crea una alternativa nueva, con el nombre de la copia, por cada alternativa que contiene los valores específicos del escenario.\n\n- Arrastre un elemento sobre otro para hacerlo secundario de ese elemento. Un escenario movido a un nuevo elemento superior hereda de él todo lo que no ha reemplazado; lo que ha reemplazado no cambia. Arrastre un elemento entre otros dos para reordenarlos.\n\n- Haga clic en un elemento para seleccionarlo. Presione F2 o elija Renombrar para renombrar el elemento seleccionado. Al renombrar un escenario se pregunta si se deben renombrar las alternativas que llevan su nombre; en el Modo básico se renombran con él, sin preguntar. Haga doble clic en un escenario o presione Intro para establecerlo como actual. Haga clic en la flecha junto a un elemento o presione Izquierda o Derecha para contraerlo o expandirlo. Haga clic con el botón derecho en un elemento para ver los mismos comandos que los botones.\n\n- Presione Supr o haga clic en el botón menos para eliminar el elemento seleccionado. Un elemento en uso no se elimina, y el mensaje nombra lo que lo usa. Eliminar un escenario con el Modo básico desmarcado conserva las alternativas que usa. Eliminar un escenario con el Modo básico marcado también elimina cada una de sus alternativas que ningún otro escenario usa.\n\n- Para hacer que un escenario use otra alternativa, incluida Base, elíjala en la fila del escenario en el panel derecho del Administrador de escenarios o en la tabla Escenarios. Un valor específico creado en una alternativa compartida cambia todos los escenarios que la usan.';
$ec_lang['lpn_sm_delete_alt_ask']='¿Eliminar la alternativa {name}?';
$ec_lang['lpn_sm_in_use']='{item}\nno se puede eliminar mientras lo use\n{list}';
$ec_lang['lpn_sm_alt_delete_has_children']='La alternativa {name} no se puede eliminar porque tiene alternativas secundarias: {list}. Elimínelas primero, o muévalas a otra alternativa superior.';
$ec_lang['lpn_sm_item_scenario']='Escenario {name}';
$ec_lang['lpn_sm_item_alternative']='Alternativa {name}';
$ec_lang['lpn_sm_name_taken']='El nombre {name} ya se usa en este árbol.';
$ec_lang['lpn_sm_cycle']='{name} no se puede mover debajo de uno de sus propios elementos secundarios.';
$ec_lang['lpn_sm_used_by']='Usado por escenarios: {n}';
$ec_lang['lpn_sm_used_by_tip']='Usado por: {list}';
$ec_lang['lpn_sm_used_by_none']='No lo usa ningún escenario';
$ec_lang['lpn_sm_tree_all']='Todos';
$ec_lang['lpn_sm_tree_unused']='Todos los no usados';
$ec_lang['lpn_sm_unused_none']='Ninguno';
$ec_lang['lpn_sm_all_row_tip']='Haga doble clic para abrirlo en su árbol de categoría.';
$ec_lang['lpn_sm_compare_tip']='Incluir en la Comparación de escenarios';
$ec_lang['lpn_sm_inherited']='heredado';
$ec_lang['lpn_sm_shared_note']='Compartido con: {list}';
$ec_lang['lpn_scncmp_none_checked']='Ningún escenario está marcado para la comparación. Marque escenarios en el Administrador de escenarios.';
$ec_lang['lpn_time_scn_overrides']='Valores propios del escenario:';
$ec_lang['lpn_settings_table_major']='Encabezado principal';
$ec_lang['lpn_settings_table_minor']='Subencabezado';
$ec_lang['lpn_settings_table_category']='Categoría';
// The Settings table's third heading level, between Minor heading and Setting: the label field, coloured
// field, asset or custom property a group of settings belongs to (Tom, 2026-10-07: "We could call it
// 'Owner'.").
$ec_lang['lpn_settings_table_owner']='Propietario';
$ec_lang['lpn_settings_table_setting']='Ajuste';
$ec_lang['lpn_settings_table_yes']='Sí';
$ec_lang['lpn_settings_table_no']='No';
$ec_lang['lpn_settings_row_of']='{setting}, {member}';
$ec_lang['lpn_settings_row_labels_field']='{labels}: {field}';
$ec_lang['lpn_settings_row_labels_part']='{labels}: {field}, {part}';
$ec_lang['lpn_settings_row_labels_customer']='Etiquetas de clientes';
$ec_lang['lpn_settings_row_label_before']='Texto antes';
$ec_lang['lpn_settings_row_label_after']='Texto después';
// A label field's settings, named in the Setting column with the field itself in the Owner column
// (Tom, 2026-10-07: "Symbology.Node labels.ID.Is Active", "Show order", "Drop order"). Whether the
// value appears on the label at all; where it sits on the label (1 first); which value is given up
// first when labels crowd (1 first).
$ec_lang['lpn_settings_row_label_on']='Activo';
$ec_lang['lpn_settings_row_label_show']='Orden de aparición';
$ec_lang['lpn_settings_row_label_drop']='Orden de descarte';
// The Setting column of an ID prefix row; the asset it applies to is in the Owner column.
$ec_lang['lpn_settings_row_id_prefix']='Prefijo de ID';
$ec_lang['lpn_settings_row_symbol_cap_multiple']='Símbolo más grande, como múltiplo de la longitud típica de una tubería';
$ec_lang['lpn_settings_row_symbol_cap_percentile']='Longitud típica de una tubería, como percentil de todas las longitudes de tubería';
$ec_lang['lpn_settings_row_contour_labels']='Etiquetas de isolíneas';
$ec_lang['lpn_settings_row_check_freq']='Frecuencia de verificación de estado';
$ec_lang['lpn_settings_row_max_check']='Máximo de verificaciones de estado';
$ec_lang['lpn_settings_row_status_report']='Informe de estado';
$ec_lang['lpn_settings_row_pda_src']='Opciones impulsadas por la presión indicadas en el archivo';
$ec_lang['lpn_settings_row_quality_option']='Opción de calidad tal como la indica el archivo';
$ec_lang['lpn_settings_row_tolerance']='Precisión (proyectos antiguos)';
$ec_lang['lpn_settings_row_emitter_exponent_old']='Exponente del emisor (proyectos antiguos)';
$ec_lang['lpn_settings_row_elev_source_old']='Origen de la elevación (proyectos antiguos)';
$ec_lang['lpn_settings_row_basemap']='Mapa base';
$ec_lang['lpn_settings_row_basemap_last']='Mapa base al que volver';
$ec_lang['lpn_settings_row_customer_max_width']='Mostrar las etiquetas de clientes cuando el ancho del mapa visible sea este o menor';
$ec_lang['lpn_settings_row_quality_step']='Paso de tiempo de calidad';
$ec_lang['lpn_settings_row_view']='Vista del mapa (centro y escala)';
$ec_lang['lpn_settings_row_bubbles']='Gráficos de series de tiempo en el mapa';
$ec_lang['lpn_settings_row_contour_fill']='Relleno de isolíneas';
$ec_lang['lpn_settings_row_contour_opacity']='Opacidad del relleno de isolíneas';
$ec_lang['lpn_settings_row_contour_interval']='Intervalo de isolíneas';
$ec_lang['lpn_settings_row_contour_buffer']='Margen de isolíneas';
$ec_lang['lpn_settings_row_contour_terrain']='Terreno entre nodos para las isolíneas, de Mapbox DEM';
$ec_lang['lpn_settings_row_new_asset']='Elementos nuevos: {setting}';
$ec_lang['lpn_settings_row_default']='{value} (predeterminado)';
$ec_lang['lpn_settings_row_view_value']='Centro {x}, {y}; escala {s}';
$ec_lang['lpn_settings_held_in']='Valor específico en {scenario}.';
$ec_lang['lpn_settings_held_base']='{base}: {value}';
$ec_lang['lpn_settings_view_center']='Centro del mapa';
$ec_lang['lpn_settings_view_scale']='Escala del mapa';
$ec_lang['lpn_settings_view_scale_tip']='La escala en el centro del mapa, como 1:N. Escriba 1:2000, o solo 2000, para acercar a esa escala.';
$ec_lang['lpn_settings_view_top_left']='Esquina superior izquierda';
$ec_lang['lpn_settings_view_bottom_right']='Esquina inferior derecha';
$ec_lang['lpn_settings_view_save']='Guardar esta vista en este escenario';
$ec_lang['lpn_settings_view_save_tip']='Guarda este centro y esta escala del mapa en el escenario abierto, de modo que al abrir ese escenario el mapa se mueve aquí. Mover el mapa después no cambia nada hasta que presione esto de nuevo. Borre el valor específico para volver a seguir la vista de {base}.';
$ec_lang['lpn_settings_row_basemap_osm']='Mapa de calles';
$ec_lang['lpn_settings_row_basemap_satellite']='Imágenes satelitales';
$ec_lang['lpn_settings_row_basemap_topo']='Mapa topográfico';
$ec_lang['lpn_settings_units_one_project']='Las unidades son las mismas en todos los escenarios.';
$ec_lang['lpn_settings_restore_base_only']='Cambie a Base para restaurar los valores predeterminados.';
$ec_lang['lpn_alt_cat_physical']='Físico';
$ec_lang['lpn_alt_cat_demand']='Demanda';
$ec_lang['lpn_alt_cat_topology']='Topología activa';
$ec_lang['lpn_alt_cat_topology_tip']='Activación de elementos';
$ec_lang['lpn_alt_cat_initial']='Configuración inicial';
$ec_lang['lpn_alt_cat_constituent']='Constituyente';
$ec_lang['lpn_alt_cat_fireflow']='Caudal contra incendios';
$ec_lang['lpn_alt_cat_energy']='Costo de energía';
$ec_lang['lpn_alt_cat_userdata']='Propiedades personalizadas';
$ec_lang['lpn_alt_cat_text']='Texto';
$ec_lang['lpn_alt_cat_presentation']='Presentación';
$ec_lang['lpn_alt_cat_calculation']='Cálculo';
// Edited by TGH 2026-09-07
// Task 721: the scenarios every new project starts with. Keep the leading number: the list sorts
// by name, and the numbers hold Tom's order in every language.
$ec_lang['lpn_scenario_preset_flow_static']='1. Prueba de flujo: Estática';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Calibración con prueba de flujo para una red de diseño con caudal 0. En este escenario, fije la demanda en todos los nudos en 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Prueba de flujo: Intermedia';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Calibración con prueba de flujo para una red de diseño con el primer caudal reportado. En este escenario, fije la demanda en el nudo por el que fluye en el primer caudal medido, y la demanda en todos los demás nudos en 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Prueba de flujo: Máxima';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Calibración con prueba de flujo para una red de diseño con el caudal máximo reportado. En este escenario, fije la demanda en el nudo por el que fluye en el caudal máximo medido, y la demanda en todos los demás nudos en 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Día promedio';
$ec_lang['lpn_scenario_preset_average_day_tip']='Multiplicador de demanda 1: cada demanda tal como se ingresó, que se toma como la demanda del día promedio.';
$ec_lang['lpn_scenario_preset_max_day']='5. Día máximo';
$ec_lang['lpn_scenario_preset_mult_tip']='Multiplicador de demanda de {mult} veces el día promedio, un valor provisional. La mayoría de los sistemas se ubica entre {lo} y {hi} (National Research Council, 2006). Fije el valor para el sistema que se modela en Configuración, Cálculo, Hidráulica, Multiplicador de demanda.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Hora pico';
$ec_lang['lpn_delete_drops_overrides']='Eliminar este elemento también elimina sus valores propios del escenario ({n}). ¿Continuar?';
$ec_lang['lpn_push_base_only']='Esta acción cambia el dibujo en sí, así que solo se puede hacer en {base}. Cambie a {base} e inténtelo de nuevo.';
$ec_lang['lpn_field_active']='¿Activo?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Desmarque esta casilla para dejar el elemento en el dibujo pero fuera de la red: se dibuja en gris y el solucionador lo ignora. En un escenario, así se activa y desactiva una tubería.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Exponente del emisor';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='El exponente de la ecuación de emisor de EPANET para aspersores y fugas: caudal = coeficiente x presión elevada a este exponente. Afecta los resultados solo en nodos con un coeficiente de emisor.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Leer DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Lee la elevación del DEM en este nodo y la muestra abajo. No se cambia nada en el cuadro Elevación. La resolución horizontal del DEM es de aproximadamente 30 m en la mayor parte de la Tierra, y más fina donde hay mejores datos.';
$ec_lang['lpn_elev_dem_use']='Usar DEM';
$ec_lang['lpn_elev_dem_use_tip']='Coloca la elevación del DEM en este nodo en el cuadro Elevación de arriba, reemplazando lo que había. Primero lee el DEM si todavía no se ha leído. Un solo Deshacer lo restablece.';
$ec_lang['lpn_elev_dem_none']='El DEM no tiene elevación para este nodo.';
$ec_lang['lpn_elev_dem_said']='Elevación del DEM de Mapbox: {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Origen de la elevación';
$ec_lang['lpn_settings_elev_source_tip']='Precisión del DEM de Mapbox en 2026, horizontal y luego vertical: 1–10 m y menos de 1 m en EE. UU., 2–10 m y 1–3 m en Europa y Japón, 30 m y 10–16 m en el mundo, y 90 m y más de 16 m en los polos.';
$ec_lang['lpn_settings_elev_source_typed']='Arriba';
$ec_lang['lpn_settings_elev_source_dem']='DEM Mapbox';
$ec_lang['lpn_settings_accuracy']='Precisión';
// **APPENDED TO EVERY HYDRAULICS TIP, because the box no longer shows the default** (Tom,
// 2026-09-01: *"There's no value, and the tip states the default."*). A whole sentence with a
// number in it, joined to the tip's own sentences -- not a fragment composed into a label, which is
// the thing dev/language-strings.md forbids. It is true of every row it is appended to, which is
// the test a shared sentence has to pass.
//
// **IT SAID "The usual value is {n}." FOR ONE REVIEW AND TOM STRUCK IT:** *"'Usual' is not a
// synonym of 'default'. You are calling it default in our conversation, and yet you put 'usual'."*
// **Default IS the standard term** -- EPANET's own, every engineering interface's own -- and
// replacing it with a plain-English near-miss makes the string HARDER to translate, not easier,
// because the translator has no term to look up. See the correction added to
// dev/language-strings.md and guarded by dev/scripts/plain_english_swap_check.php.
$ec_lang['lpn_settings_default_is']='El valor predeterminado es {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Límite de convergencia que el solucionador debe alcanzar antes de detenerse, medido como el cambio total en el caudal de una prueba a la siguiente, dividido por el caudal total en las líneas. Un número menor es más exacto y tarda más.';
$ec_lang['lpn_settings_specific_gravity']='Gravedad específica';
$ec_lang['lpn_settings_viscosity']='Viscosidad relativa';
// **THE PASHTO COLLISION THIS ANSWERS IS REAL AND IS INSIDE PASHTO** (sprint 584-wave1). ps renders
// this key with the word غلظت, which carries BOTH viscosity/thickness AND concentration -- so it
// collided with the word the same sprint used for lpn_result_concentration, on the same screen.
// Tom approved a synonym on 2026-09-06. **HIS FIRST WORDING WAS 'Relative rate of diffusion' and it
// is NOT what shipped**: that is diffusivity, and this key is viscosity. He was given a friction
// entry that quoted a translator's mistaken description of the key without anyone checking it
// against this file -- so the note below says what the number IS and what it is NOT, because two
// separate readers have now reached for a transport coefficient on a fluid property.
$ec_lang['lpn_settings_viscosity_tip']='La viscosidad del fluido en comparación con el agua a 20 grados Celsius. Solo cambia el resultado con el método de Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Máximo de pruebas';
$ec_lang['lpn_settings_trials_tip']='Número máximo de pruebas antes de que el solucionador se detenga en una red que no converge.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Si no converge';
$ec_lang['lpn_settings_unbalanced_tip']='Acción para una red que agotó sus pruebas y todavía no converge. Permitir pruebas adicionales a menudo logra la convergencia. Detenerse reporta la última prueba tal como está, lo cual no es una solución.';
$ec_lang['lpn_settings_unbalanced_continue']='Permitir pruebas adicionales';
$ec_lang['lpn_settings_unbalanced_stop']='Detenerse y reportar la última prueba';
$ec_lang['lpn_settings_unbalanced_trials']='Pruebas adicionales antes de reportar';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Número de pruebas adicionales permitidas después de agotar el máximo de arriba, antes de reportar la última prueba.';
$ec_lang['lpn_settings_head_error']='Límite de error de carga';
$ec_lang['lpn_settings_head_error_tip']='Una prueba adicional que el solucionador debe superar antes de detenerse: el mayor error de carga que queda en cualquier tubería. Cero significa no aplicar esta prueba. Solo el solucionador de EPANET lee este cuadro.';
$ec_lang['lpn_settings_flow_change']='Límite de cambio de caudal';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Una prueba adicional que el solucionador debe superar antes de detenerse: el mayor cambio en el caudal de cualquier tubería de una prueba a la siguiente. Cero significa no aplicar esta prueba. Solo el solucionador de EPANET lee este cuadro.';
$ec_lang['lpn_settings_damp_limit']='El amortiguamiento empieza en';
$ec_lang['lpn_settings_damp_limit_tip']='La precisión en la que el solucionador empieza a dar pasos más pequeños, lo cual puede ayudar a que una red oscilante converja. Cero significa que el solucionador nunca amortigua. Solo el solucionador de EPANET lee este cuadro.';
$ec_lang['lpn_settings_option_unset']='No indicado';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Un solo factor aplicado a todas las demandas de la red a la vez. Cada escenario puede tener un valor propio, de modo que el día promedio, el día máximo o la hora pico se pueden crear cambiando solo este ajuste.';
$ec_lang['lpn_settings_engine_native']='Usar el solucionador incorporado cuando sea posible';
// **THIS TIP NO LONGER ARGUES THE TWO SOLVERS AGAINST EACH OTHER** (Task 605, Tom 2026-09-06:
// *"We scrub our tips and alerts for any undue weight on the existence of two solvers."*). It
// spent three sentences on speed and on the two measured disagreements -- minor losses 0.08%
// (EPANET rounds g to 32.2 ft/s^2) and Manning 0.6% -- addressed to a reader who is no longer
// being asked to choose an engine. Both are still announced in the status line when a network
// actually holds the thing, which is where they are a fact about the number on screen rather
// than a comparison offered in advance.
//
// What the tip keeps is the two things a person ticking this box does need: which paths go to
// EPANET whatever the box says, and the one-time download, which is the cost a visitor on a slow
// connection actually pays.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_engine_native_tip']='Active esta opción para usar el solucionador incorporado donde sea posible. De lo contrario, siempre se usa el solucionador de EPANET de la EPA de EE. UU. El solucionador incorporado no se usa en simulaciones de período extendido ni con válvulas rompedoras de presión o de propósito general (PBV, GPV). La primera vez que se usa el solucionador de EPANET, se descargan cerca de 650 KB, que luego se guardan en este dispositivo. Donde una tubería tiene una pérdida localizada, los dos solucionadores difieren en los últimos dígitos: EPANET usa un valor redondeado de la aceleración de la gravedad, así que sus pérdidas localizadas resultan levemente menores que la forma exacta.';
$ec_lang['lpn_engine_loading']='Cargando el solucionador de EPANET…';
$ec_lang['lpn_engine_failed']='No se pudo cargar el solucionador de EPANET. Se muestra el solucionador incorporado en su lugar.';
$ec_lang['lpn_engine_failed_why']='{reason} Se muestra el solucionador incorporado en su lugar.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_unit_unknown']='Este dibujo indica una unidad que esta página no admite: {unit}. Todos los valores se conservan y se muestran exactamente como se importaron, y no se cambió nada. No se puede calcular nada hasta que se admita la unidad, porque su factor de conversión se desconoce.';
$ec_lang['lpn_engine_manning_note']='Nota: con rugosidad de Manning, EPANET redondea la constante en la ecuación de Manning, así que la pérdida de carga resulta aproximadamente 0,6% menor que la forma exacta.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='El solucionador de EPANET rechazó esta red, así que la ejecución no se inició.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='Mensaje del solucionador de EPANET: {message}';
$ec_lang['lpn_engine_refused_fallback']='Los números en pantalla provienen en cambio del solucionador incorporado.';
// A run EPANET started and could not finish, for example when a tank empties and the junctions it
// fed have no other source (Error 110). {time} is the run time it stopped at, H:MM.
$ec_lang['lpn_time_run_stopped']='La ejecución de EPANET se detuvo en {time}, así que no tiene resultados. Su informe de ejecución explica el motivo.';
$ec_lang['lpn_time_stat_stopped']='{statistic} no se muestra: la ejecución se detuvo antes del final del período.';
$ec_lang['lpn_time_stopped_no_quality']='No se calcularon resultados de calidad del agua, porque el análisis de calidad comienza después de que termina la ejecución hidráulica.';
$ec_lang['lpn_energy_stopped']='La ejecución de EPANET se detuvo antes del final del período, así que no se calcularon resultados de energía de las bombas.';
$ec_lang['lpn_time_run_stopped_kept']='La ejecución de EPANET se detuvo en {time}. Los resultados llegan hasta {solved}, el último período que resolvió, y no se muestra ninguno después. Su informe de ejecución explica el motivo.';
// Why a stopped run stopped, read from EPANET's own run report (R-402). {link} is the link EPANET
// had just closed, {tank} the tank at one end of it, {nodes} the ids of the nodes EPANET then could
// not solve for, comma-separated. Follows lpn_time_run_stopped or lpn_time_run_stopped_kept.
$ec_lang['lpn_time_run_cut_off']='EPANET había cerrado {link} y luego no pudo resolver {nodes}.';
$ec_lang['lpn_time_run_cut_off_full']='El depósito {tank} estaba lleno, así que EPANET había cerrado {link} para impedir que le entrara agua, y luego no pudo resolver {nodes}. Esto puede ocurrir cuando un depósito lleno no tiene salida de agua, como cuando todas las demandas son cero. Una demanda ligeramente mayor que cero, o un nivel del depósito ligeramente por debajo de su máximo, lo evita.';
$ec_lang['lpn_time_run_cut_off_empty']='El depósito {tank} estaba vacío, así que EPANET había cerrado {link} para impedir que se vaciara más, y luego no pudo resolver {nodes}.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Los números en pantalla provienen en cambio del solucionador incorporado. Este resuelve un instante a la vez, así que esto es la red solo en {time}, con cada depósito en su nivel inicial.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Estos controles nombran un elemento que ya no está en este proyecto, así que se dejaron fuera: {ids}';
$ec_lang['lpn_control_unreadable_note']='Estos controles no se pudieron leer, así que se dejaron fuera: {ids}';
$ec_lang['lpn_control_inactive_note']='Estos controles hacen referencia a un elemento que está inactivo en este escenario, por lo que se ignoran en su ejecución: {ids}';
$ec_lang['lpn_rule_inactive_note']='Estas reglas hacen referencia a un elemento que está inactivo en este escenario, por lo que se ignoran en su ejecución: {ids}';
$ec_lang['lpn_rule_dangling_note']='Estas reglas se refieren a un elemento que ya no está en este proyecto, así que se ignoraron en esta ejecución: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Estas reglas no se pudieron leer, así que se ignoraron en esta ejecución: {ids}';
$ec_lang['lpn_settings_text_size']='Tamaño del texto (píxeles)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Tamaño del símbolo (píxeles)';
$ec_lang['lpn_settings_link_width']='Grosor de la línea de tubería (píxeles)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Flechas de dirección del caudal';
$ec_lang['lpn_settings_show_arrows_tip']='Dibuja una flecha en cada tubería que muestra en qué sentido corre el agua. Las flechas aparecen después de una ejecución, y desactivarlas no cambia los resultados.';
$ec_lang['lpn_settings_align_labels']='Alinear las etiquetas de tubería con las tuberías';
$ec_lang['lpn_settings_readability_bias']='Voltear una etiqueta boca abajo cuando se inclina más de esta cantidad de grados a la izquierda de la vertical';
$ec_lang['lpn_settings_readability_bias_tip']='Voltea una etiqueta para mantenerla derecha cuando se inclina más de esta cantidad de grados a la izquierda de la vertical.';
$ec_lang['lpn_settings_mask_labels']='Fondo sólido detrás de las etiquetas';
$ec_lang['lpn_settings_text_halo']='Ancho del halo del texto (porcentaje del tamaño del texto)';
$ec_lang['lpn_settings_text_halo_tip']='Ancho del contorno sólido detrás del texto del mapa, como porcentaje del tamaño del texto. Se aplica cuando está activado Fondo sólido detrás de las etiquetas.';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Ajustar las líneas guía a ángulos fijos';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Mostrar etiquetas cuando el zoom llegue a este ancho de mapa o menos';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Las etiquetas se dibujan solo mientras la vista del mapa tenga este ancho o menos. Deje el cuadro en blanco para dibujarlas en cualquier zoom. Escriba 0 para no dibujar nunca una etiqueta, en ningún zoom.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Mostrar siempre';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Evitar que los nudos escalen más grandes que {n} veces la longitud de la {p} tubería del percentil';
$ec_lang['lpn_settings_symbol_cap_tip']='Los nudos dejan de mantener su tamaño en pantalla cuando su diámetro en el mapa llegaría a ser tantas veces la longitud de la tubería en este percentil de todas las longitudes de tubería de la red. Pasado ese punto en el mapa, los nudos, las tuberías y otros símbolos se encogen en la pantalla al alejar el zoom. Los embalses y depósitos son la excepción y mantienen su tamaño en pantalla en cualquier zoom.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacidad del símbolo (0 a 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacidad de la imagen de fondo (0 a 1)';
// Task 617: a display-time filter on the street or satellite tiles only; the drawing and the credit are untouched.
$ec_lang['lpn_settings_basemap_style']='Estilo del mapa base';
$ec_lang['lpn_basemap_style_normal']='Normal';
$ec_lang['lpn_basemap_style_muted']='Atenuado';
$ec_lang['lpn_basemap_style_faded']='Desvanecido';
$ec_lang['lpn_basemap_style_grayscale']='Escala de grises';
// PARKED 2026-08-14, not deleted. The "Map height" settings row was removed when the map learned
// to fill the window by itself (Tom: "So Map height is now obsolete. Right?" -- yes; see
// LPN_MAP_MIN in js/looped-network.js). Nothing renders these two keys now, so key_hygiene_check
// will list them; that is expected and they are kept on purpose, because restoring a settings row
// is cheap and recovering 27 translations is not.
//
// **IF THE ROW EVER COMES BACK, REWRITE THE TIP FIRST -- it is now FALSE in all 27 languages.** It
// promises "part of the page is always left to scroll", which is the exact behaviour the fit-the-
// window change removed. Reusing it as-is would ship a confident wrong explanation everywhere at
// once, which is worse than having no tip at all.
// The cap in applyMapHeight() makes this field look ignored on a phone (ROADMAP Task 146.08's
// own note). It is a render cap, not a stored value -- say so instead of leaving the user to guess.
$ec_lang['lpn_settings_legend_position']='Posición de la leyenda de etiquetas';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Ninguno';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Desactivado';
$ec_lang['lpn_settings_legend_top_left']='Superior izquierda';
$ec_lang['lpn_settings_legend_top_right']='Superior derecha';
$ec_lang['lpn_settings_legend_middle_left']='Media izquierda';
$ec_lang['lpn_settings_legend_middle_right']='Media derecha';
$ec_lang['lpn_settings_legend_bottom_left']='Inferior izquierda';
$ec_lang['lpn_settings_legend_bottom_right']='Inferior derecha';
$ec_lang['lpn_settings_color_node_field']='Color de nudo';
$ec_lang['lpn_settings_color_link_field']='Color de tubería';
$ec_lang['lpn_settings_color_ramp']='Esquema de color';
$ec_lang['lpn_settings_color_credits']='Créditos';
$ec_lang['lpn_color_ramp_epanet']='Azul a rojo (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Morado a amarillo (más fácil distinguir un color del siguiente)';
$ec_lang['lpn_color_ramp_gray']='Gris claro a oscuro';
$ec_lang['lpn_settings_color_reverse']='Invertir el orden de los colores';
$ec_lang['lpn_color_none']='Sin color';
$ec_lang['lpn_settings_color_key_position']='Posición de la leyenda de color';
$ec_lang['lpn_settings_color_breaks']='Límites de las bandas de color';
$ec_lang['lpn_settings_color_equal_intervals']='Intervalos iguales';
$ec_lang['lpn_settings_color_equal_counts']='Cantidades iguales';
$ec_lang['lpn_settings_color_no_values']='Todavía no hay valores con los cuales trabajar. Resuelva la red primero.';
$ec_lang['lpn_confirm_restore_defaults']='¿Restablecer toda la configuración (prefijos de ID, valores iniciales, configuración del solucionador, apariencia del mapa, posición de la leyenda y etiquetas visibles) a sus valores originales? Su red no cambia. La configuración pertenece al proyecto abierto, así que sus otros proyectos conservan la suya.';
// **"Start fresh", the nuclear option named as one** (Tom, 2026-09-09, after weighing "Restart app",
// "Clear cache", "Clear app" and "Flush cache": *"We want something that sounds like the nuclear
// option. And we give fair warning after clicking, so a long name isn't necessary."*).
// **"Clear cache" was the tempting one and it is the one to refuse**: it is the most familiar phrase
// of the set and it is a lie here. This deletes the visitor's SAVED PROJECTS, and everybody who has
// ever cleared a browser cache has done so expecting to lose nothing. A word that reads as safe on a
// control that is not safe is how somebody's work gets destroyed. "Restart app" fails more mildly in
// the same direction: a restart is something you recover FROM, not something that takes your files.
// The name is short because lpn_confirm_wipe below does the explaining, which is also why it does
// not have to say "on this page".
$ec_lang['lpn_settings_wipe_btn']='Empezar de nuevo';
$ec_lang['lpn_confirm_wipe']='¿Empezar de nuevo y eliminar TODO lo guardado para esta página: cada proyecto, cada imagen de fondo, toda la configuración y sus unidades elegidas? La página se recarga exactamente como la vería un visitante completamente nuevo. Esto no se puede deshacer.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Copie este enlace:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Tiempo';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Tiempo total de simulación';
$ec_lang['lpn_time_hyd_step']='Paso de tiempo hidráulico';
$ec_lang['lpn_time_pattern_step']='Paso de tiempo del patrón';
$ec_lang['lpn_time_pattern_start']='Hora de inicio del patrón';
$ec_lang['lpn_time_report_step']='Paso de tiempo de informe';
$ec_lang['lpn_time_report_start']='Hora de inicio del informe';
$ec_lang['lpn_time_clock_start']='Hora del reloj al inicio';
$ec_lang['lpn_time_statistic']='Estadístico';
$ec_lang['lpn_time_stat_none']='Ninguno';
$ec_lang['lpn_time_stat_averaged']='Prom.';
$ec_lang['lpn_time_stat_minimum']='Mín.';
$ec_lang['lpn_time_stat_maximum']='Máx.';
$ec_lang['lpn_time_stat_range']='Rango';
$ec_lang['lpn_time_clock_day']='Día {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Escriba una hora como horas y minutos, por ejemplo 2:30. Un número simple significa horas, así que 8 son ocho horas. Media hora es 0:30.';
$ec_lang['lpn_time_running']='Ejecutando la simulación de período extendido.';
$ec_lang['lpn_time_no_engine']='El solucionador incorporado resuelve un instante a la vez, así que esto es la red solo en {time}: cada patrón se lee en ese instante, y cada depósito permanece en su nivel inicial en lugar de llenarse y vaciarse. Conéctese a internet una vez para descargar el solucionador de EPANET, que ejecuta una simulación de período extendido.';
// lpn_time_no_engine says "connect to the internet", which is true only offline. For the other causes
// of a failed extended period run the same note ends in {reason}, one of the three sentences below.
$ec_lang['lpn_time_no_engine_why']='El solucionador incorporado resuelve un instante a la vez, así que esto es la red solo en {time}: cada patrón se lee en ese instante, y cada depósito permanece en su nivel inicial en lugar de llenarse y vaciarse. {reason}';
$ec_lang['lpn_time_engine_fetch_failed']='Falló la descarga del solucionador de EPANET. Recargue la página para intentarlo de nuevo; un cortafuegos, un proxy o una extensión del navegador podría estar bloqueándola.';
$ec_lang['lpn_time_engine_start_failed']='El navegador rechazó iniciar el solucionador de EPANET. Es posible que WebAssembly esté desactivado por una configuración de seguridad o una extensión.';
$ec_lang['lpn_time_engine_run_failed']='Falló la ejecución de EPANET. Eso es un defecto de esta página; use el enlace {wrong} para informarlo.';
$ec_lang['lpn_time_slider']='Tiempo transcurrido de la simulación';
$ec_lang['lpn_time_no_period']='Este proyecto no tiene una simulación de período extendido configurada, así que hay un solo momento para mostrar. Configure un Tiempo total de simulación en Configuración, Cálculo, Tiempo para ejecutar una simulación de período extendido.';
$ec_lang['lpn_time_first']='Ir al inicio';
$ec_lang['lpn_time_prev']='Retroceder un paso';
$ec_lang['lpn_time_play']='Reproducir';
$ec_lang['lpn_time_play_tip']='Reproducir la animación';
$ec_lang['lpn_time_pause_tip']='Pausar la animación';
$ec_lang['lpn_time_pause']='Pausar';
$ec_lang['lpn_time_next']='Avanzar un paso';
$ec_lang['lpn_time_last']='Ir al final';
$ec_lang['lpn_time_tank']='Depósito';
$ec_lang['lpn_time_level']='Nivel de agua';
$ec_lang['lpn_time_run']='Calcular';
// Edited by TGH 2026-09-07
// **THE NOTE THAT USED TO STAND HERE IS GONE, AND SO IS THE STATE IT DESCRIBED** (2026-09-19).
// `lpn_time_run_note` told the reader they were seeing the first reporting time and that only the
// LATER times were going stale. That was true while "Recalculate automatically" suppressed nothing
// but the later time steps, and Tom read it as the defect it was: *"when Recalculate is off, the
// first time step is still calculated. This is bad. Off means off."* Off now means off -- an edit
// with the box unticked solves nothing at all -- so there is no such state left to describe, and
// nothing replaced it: the last answers simply stay on screen until the reader presses Calculate.
// The measurement and the new gate: scheduleSolve() in js/looped-network.js.
// ---- The run box (ROADMAP Task 450) ----------------------------------------------------------
// Three keys, and no more: 'lpn_time_running' is already the sentence for a run in progress and
// 'lpn_close' is already the word on every other dismiss control on this page, so both are
// borrowed rather than re-keyed.
$ec_lang['lpn_time_run_done']='La ejecución terminó. Momentos de informe: {frames}. Tiempo empleado: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='No volver a mostrar este cuadro';
$ec_lang['lpn_settings_runbox']='Mostrar el cuadro de progreso de la ejecución';
$ec_lang['lpn_settings_runbox_tip']='Un cuadro que informa el avance y el resultado de una ejecución. Si está desactivado, una ejecución terminada indica lo mismo en la línea de estado durante unos segundos. Este es un ajuste de este navegador, no del proyecto.';
$ec_lang['lpn_time_run_failed']='La ejecución no terminó, así que no hay resultados para los momentos posteriores.';
$ec_lang['lpn_time_run_report']='Ejecución: informe';
$ec_lang['lpn_time_run_report_copy']='Copiar';
$ec_lang['lpn_time_run_report_copied']='Copiado';
$ec_lang['lpn_time_run_report_tip']='El informe que EPANET escribió para la última ejecución, textual: si convergió, y cualquier advertencia. El texto lo produce el solucionador de EPANET, no esta página.';

$ec_lang['lpn_time_speed']='Velocidad';
$ec_lang['lpn_time_speed_tip']='Velocidad de reproducción';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Buscar en la configuración';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Escriba una palabra o varias palabras para ver las opciones de configuración que las mencionen todas.';
$ec_lang['lpn_settings_no_match']='Ninguna opción de configuración menciona esa palabra.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Ancho de la lista de la sección Configuración';
$ec_lang['lpn_rpane_empty']='Todavía no hay nada anclado aquí. Todo lo que pertenece al proyecto completo está en Configuración.';
$ec_lang['lpn_time_settings_open']='Configuración de tiempo';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Visualización';
$ec_lang['lpn_settings_sec_assets']='Elementos';
$ec_lang['lpn_settings_sec_calculation']='Cálculo';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Cliente';
$ec_lang['lpn_labels_customer_note']='Una etiqueta de cliente muestra los valores elegidos aquí. Se dibuja al mismo tamaño de texto que cualquier otra etiqueta del mapa.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Las etiquetas de cliente se dibujan solo mientras la vista del mapa tenga este ancho o menos. Deje el cuadro en blanco para dibujarlas en cualquier zoom. Escriba 0 para no dibujar nunca una etiqueta de cliente, en ningún zoom. Esto no tiene efecto si es mayor que el ajuste similar para todas las etiquetas.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Usar la vista actual';
$ec_lang['lpn_settings_page']='Página';
$ec_lang['lpn_saved_project']='Guardado con el proyecto';
$ec_lang['lpn_saved_browser']='Guardado en este navegador';
$ec_lang['lpn_saved_session']='No guardado';
$ec_lang['lpn_settings_hydraulics']='Hidráulica';
$ec_lang['lpn_settings_quality']='Calidad';
$ec_lang['lpn_settings_quality_track']='Parámetro de calidad';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Elija qué debe rastrear la ejecución a través de la red: cuánto tiempo lleva el agua en el sistema, de dónde proviene, o un producto químico que reacciona mientras viaja. Solo el producto químico necesita coeficientes.';
$ec_lang['lpn_settings_quality_source']='Nodo de rastreo';
$ec_lang['lpn_settings_quality_source_tip']='El nodo cuya agua se rastrea. Cada uno de los demás nodos muestra entonces el aporte de su agua que proviene de ese nodo.';
$ec_lang['lpn_quality_none']='Nada';
$ec_lang['lpn_quality_trace']='Rastreo de fuente';
$ec_lang['lpn_quality_chemical']='Un producto químico reactivo';
$ec_lang['lpn_quality_needs_run']='La calidad del agua se transporta por las tuberías mientras el agua viaja, así que necesita una simulación de período extendido: el solucionador de EPANET y un tiempo total de simulación. Configure un Tiempo total de simulación en Tiempo, y luego presione el botón Calcular.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Producto químico';
$ec_lang['lpn_quality_chemical_name_tip']='El producto químico que se rastrea, por ejemplo Cloro. Déjelo en blanco para usar la etiqueta predeterminada de EPANET, Chemical. Se muestra en los informes, pero no se usa en los cálculos.';
$ec_lang['lpn_quality_mass_units']='Unidades de masa';
$ec_lang['lpn_quality_mass_units_tip']='La parte de unidades de la entrada de calidad, de las dos opciones de EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Tolerancia de calidad';
$ec_lang['lpn_quality_tolerance_tip']='Diferencia de concentración por debajo de la cual EPANET trata dos parcelas de agua contiguas como una sola. En blanco usa el valor predeterminado de EPANET de 0,01.';
$ec_lang['lpn_quality_diffusivity']='Difusividad relativa';
$ec_lang['lpn_quality_diffusivity_tip']='Difusividad del producto químico en agua, relativa al cloro. En blanco usa el valor predeterminado de EPANET de 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Concentración de {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Concentración promedio de {chemical}';
$ec_lang['lpn_quality_initial']='Calidad inicial';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Cantidad del producto químico en este nudo cuando comienza la ejecución. Un embalse conserva este valor durante toda la ejecución, que es como suele indicarse el residual que sale de una planta de tratamiento. En blanco significa 0.';
$ec_lang['lpn_result_concentration']='Concentración';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Cantidad del producto químico que queda en este punto después del transporte y la reacción. Las unidades son las ingresadas junto con el nombre del producto químico en Configuración, Cálculo, Calidad.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Tipo de fuente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='¿Qué tipo de dosificación de fuente de producto químico se aplica aquí según el valor de Calidad de la fuente? La fuente de concentración usa el valor como una concentración aplicada al caudal externo entrante (embalse o demanda negativa). El inyector de masa agrega un flujo de masa fijo por minuto al que entra al nudo desde otros puntos de la red. El inyector de punto de consigna asegura que la concentración que sale del nudo no sea menor que el valor. La fuente de inyector proporcional al caudal agrega una concentración fija a la que resulta de mezclar todo el caudal entrante al nudo desde otros puntos de la red.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Ninguno';
$ec_lang['lpn_source_type_concen']='Concentración';
$ec_lang['lpn_source_type_mass']='Inyector de masa';
$ec_lang['lpn_source_type_setpoint']='Inyector de punto de consigna';
$ec_lang['lpn_source_type_flowpaced']='Inyector proporcional al caudal';
$ec_lang['lpn_source_quality']='Calidad de la fuente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Intensidad de la dosis. Para todos los tipos salvo el inyector de masa, esto es una concentración, en las unidades indicadas junto al producto químico en Configuración, Cálculo, Calidad; para un inyector de masa es un flujo de masa por minuto. En blanco significa que no hay fuente de producto químico, funcionalmente equivalente a 0.';
$ec_lang['lpn_source_pattern']='Patrón de la fuente';
$ec_lang['lpn_source_pattern_tip']='Un patrón de tiempo que escala la dosis a lo largo de la ejecución, para una fuente que no es constante. Ningún patrón significa que la dosis es la misma en cada paso.';
$ec_lang['lpn_mixing_model']='Modelo de mezcla';
$ec_lang['lpn_mixing_model_tip']='Modelo de cómo se mezcla el agua que ya está en este depósito con el flujo de entrada. La mezcla completa mezcla instantáneamente todo el flujo de entrada con el volumen entero del depósito. La mezcla en dos compartimentos llena primero una zona de entrada y pasa el exceso a la zona principal. El flujo pistón FIFO descarga el agua en el orden en que llegó. El flujo pistón LIFO la apila, así que la última agua en entrar es la primera en salir. La elección afecta la edad del agua y el residual, no la presión ni el caudal.';
$ec_lang['lpn_mixing_mixed']='Mezcla completa';
$ec_lang['lpn_mixing_2comp']='Mezcla en dos compartimentos';
$ec_lang['lpn_mixing_fifo']='Flujo pistón FIFO';
$ec_lang['lpn_mixing_lifo']='Flujo pistón LIFO';
$ec_lang['lpn_mixing_fraction']='Fracción de mezcla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='La parte del volumen del depósito que ocupa la zona de entrada, entre 0 y 1. Solo la usa la mezcla en dos compartimentos. En blanco significa que todo el depósito es la zona de entrada.';
$ec_lang['lpn_reaction_bulk']='Coeficiente de reacción en el seno del agua';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reacción en el seno del agua (vea la Ayuda de EPANET), usada en cada tubería y depósito que no tenga un coeficiente individual. Un número negativo hace decaer el producto químico y uno positivo lo aumenta. En blanco significa que no hay reacción en el seno del agua.';
$ec_lang['lpn_reaction_wall']='Coeficiente de reacción en la pared';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reacción en la pared de la tubería (vea la Ayuda de EPANET), usada en cada tubería sin valor propio. Un número negativo hace decaer el producto químico. En blanco significa que no hay reacción en la pared.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Reacción en el seno del agua (vea la Ayuda de EPANET). Un número negativo hace decaer el producto químico y uno positivo lo aumenta. En blanco significa usar el coeficiente fijado para toda la red en Configuración, Cálculo, Calidad.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Coeficiente de reacción';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reacción en el agua contenida en este depósito, como tasa en 1/día. Un número negativo hace decaer el producto químico y uno positivo lo aumenta. El agua permanece en un depósito mucho más tiempo que en cualquier tubería, así que aquí suele perderse un residual. En blanco significa usar el coeficiente de reacción en el seno del agua fijado para toda la red en Configuración, Cálculo, Calidad.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Reacción en el seno';
$ec_lang['lpn_reaction_wall_short']='Reacción en la pared';
$ec_lang['lpn_reaction_tank_short']='Reacción';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/día';
$ec_lang['lpn_reaction_day']='día';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Orden de reacción en el volumen';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='El exponente al que se eleva la concentración para la reacción en el cuerpo del agua. Se permite cualquier número real. 1 es el valor predeterminado y se usa en la mayoría de los modelos de decaimiento del cloro. 0 hace que la tasa sea independiente de cuánto producto químico haya.';
$ec_lang['lpn_reaction_order_tank']='Orden de reacción en el depósito';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='El exponente al que se eleva la concentración para la reacción en el agua contenida en un depósito, independiente del orden de reacción en el seno del agua para que un depósito pueda reaccionar con un orden distinto al de las tuberías. Se permite cualquier número real, y 1 es el valor predeterminado. EPANET lo indica como ORDER TANK en un archivo y no tiene un campo para esto en la interfaz de EPANET.';
$ec_lang['lpn_reaction_order_wall']='Orden de reacción en la pared';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 significa que la reacción en la pared ocurre según el o los coeficientes indicados. 0 significa que no ocurre. Esto es un interruptor de encendido y apagado. El valor predeterminado es 1.';
$ec_lang['lpn_reaction_order_unstated']='No indicado';
$ec_lang['lpn_reaction_order_zero']='0, orden cero';
$ec_lang['lpn_reaction_order_first']='1, primer orden';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Potencial límite';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Una concentración hacia la cual se mueve el producto químico en lugar de decaer hasta nada o crecer sin fin. La reacción se hace más lenta a medida que el agua se acerca a ella y se detiene allí. Use unidades consistentes. Sin límite si se deja en blanco.';
$ec_lang['lpn_reaction_rough_corr']='Correlación con la rugosidad';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Factor que correlaciona el coeficiente de reacción en la pared con la rugosidad de cada tubería, de modo que una tubería más rugosa reaccione más rápido. Cuando se fija, se calcula un coeficiente de pared para cada tubería a partir de su rugosidad, y el coeficiente de pared único de arriba no se usa. Si se deja en blanco, no se usa.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Esta aplicación no ofrece sugerencias de coeficiente de reacción. No hay un ensayo estándar para obtener uno, y los valores de campo publicados para el mismo tipo de agua difieren por un factor de diez. Ingrese uno que haya medido o uno que pueda citar, o deje los cuadros vacíos para un producto químico que no reacciona.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energía';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Informes';
// Edited by TGH 2026-09-07
// Row label only (the box title is lpn_time_run_report). Tom, 2026-10-07: no row carries '(EPANET)';
// the tips say where a report comes from. Run is EPANET's verbatim report.
$ec_lang['lpn_reports_epanet']='Ejecución';
$ec_lang['lpn_energy_title']='Bombas: informe de energía';
$ec_lang['lpn_energy_menu']='Energía de las bombas';
$ec_lang['lpn_energy_efficiency']='Eficiencia de la bomba (por ciento)';
$ec_lang['lpn_energy_efficiency_tip']='La eficiencia de motor a agua usada en cada bomba que no tenga curva de eficiencia. EPANET usa 75 por ciento cuando no se indica ningún valor.';
$ec_lang['lpn_energy_price']='Precio de la energía';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Costo de un kilovatio-hora. Se aplica a cada bomba que no tenga un precio individual. En blanco significa 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Costo de un kilovatio-hora en esta bomba. En blanco significa usar el precio fijado para toda la red en Configuración, Energía.';
$ec_lang['lpn_energy_price_pattern']='Patrón de precio';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Un patrón que multiplica el precio en cada paso del patrón, que es como se indica una tarifa fuera de horas pico. Déjelo vacío para un precio constante durante toda la ejecución.';
$ec_lang['lpn_energy_demand_charge']='Cargo por demanda máxima';
$ec_lang['lpn_energy_demand_charge_tip']='Por kW, para la carga máxima demandada por las bombas';
$ec_lang['lpn_energy_currency']='Moneda';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Texto impreso junto a cada valor de costo. Es solo una etiqueta; use una misma moneda en todo.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Esta aplicación no ofrece sugerencias de precio. Lo que cuesta la energía depende de la empresa de servicios, el país, la hora y el año.';
$ec_lang['lpn_energy_needs_run']='La energía de las bombas es potencia integrada a lo largo de la ejecución, así que necesita una simulación de período extendido: el solucionador de EPANET y un tiempo total de simulación. Configure un Tiempo total de simulación en Configuración, Cálculo, Tiempo, presione el botón Calcular, y luego abra Agua, Informes, Energía de las bombas.';
$ec_lang['lpn_energy_no_pumps']='Esta red no tiene bombas, así que no hay nada que consuma potencia.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Comparación de escenarios';
$ec_lang['lpn_scncmp_menu_tip']='Tabla de escenarios con el número de valores específicos, la presión más baja y la velocidad más alta';
$ec_lang['lpn_scncmp_running']='Resolviendo todos los escenarios…';
$ec_lang['lpn_scncmp_empty']='Todavía no se ha dibujado nada, así que no hay nada que resolver.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Velocidad más alta';
$ec_lang['lpn_scncmp_at']='{value} en {id}';
$ec_lang['lpn_scncmp_at_time']='{value} en {id}, {time}';
$ec_lang['lpn_scncmp_same']='Igual en todos los escenarios';
$ec_lang['lpn_scncmp_period_note']='Cuando un escenario tiene un tiempo total de simulación, su presión más baja y su velocidad más alta son los extremos de toda la red, en el momento mostrado.';
$ec_lang['lpn_scncmp_current']='(abierto actualmente)';
$ec_lang['lpn_scncmp_note']='Cada escenario se resuelve a partir de una copia del dibujo. Nada de esto cambia el proyecto, y el escenario en el que está trabajando queda como estaba.';
$ec_lang['lpn_energy_over']='Para una simulación de período extendido de {time}';
$ec_lang['lpn_energy_col_pump']='Bomba';
$ec_lang['lpn_energy_col_running']='% de la ejecución';
$ec_lang['lpn_energy_col_effic']='Efic.';
$ec_lang['lpn_energy_col_avg_kw']='kW prom.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='La potencia promedio usada mientras esta bomba estuvo encendida. No se promedia sobre los períodos de inactividad, de modo que una bomba que estuvo apagada durante gran parte de la simulación de período extendido igual reporta la potencia que usó mientras funcionó.';
$ec_lang['lpn_energy_col_peak_kw']='kW pico';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Costo';
$ec_lang['lpn_energy_total_kwh']='Energía usada';
$ec_lang['lpn_energy_total_energy_cost']='Costo de la energía';
$ec_lang['lpn_energy_peak_kw']='Uso de potencia pico';
$ec_lang['lpn_energy_total_demand_charge']='Costo de la demanda máxima';
$ec_lang['lpn_energy_total_cost']='Costo total';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW AND THE BOX TITLE BOTH SAY "Status changes"** (Tom, 2026-10-07), so menu and box agree.
$ec_lang['lpn_reports_status']='Cambios de estado';
$ec_lang['lpn_reports_status_tip']='Tabla cronológica de los cambios de estado leídos de los pasos de tiempo de EPANET de la última simulación de período extendido: bombas y válvulas que abren o cierran, depósitos que se llenan, se vacían, se llenan por completo o se secan, y pasos que no convergieron por completo.';
$ec_lang['lpn_status_title']='Estado: cambios';
$ec_lang['lpn_status_needs_run']='El informe de estado enumera lo que cambió durante una simulación de período extendido. Fije un Tiempo total de simulación en Configuración, Cálculo, Tiempo, presione Calcular, y luego abra Agua, Informes, Cambios de estado.';
$ec_lang['lpn_status_empty']='Nada cambió de estado durante esta simulación.';
$ec_lang['lpn_status_col_event']='Evento';
$ec_lang['lpn_status_opened']='{type} {id} ahora en estado abierto';
$ec_lang['lpn_status_closed']='{type} {id} ahora en estado cerrado';
$ec_lang['lpn_status_filling']='{type} {id} ahora se está llenando';
$ec_lang['lpn_status_emptying']='{type} {id} ahora se está vaciando';
$ec_lang['lpn_status_full']='{type} {id} ahora está lleno';
$ec_lang['lpn_status_dry']='{type} {id} ahora está vacío';
$ec_lang['lpn_status_no_converge']='La solución hidráulica en este paso no convergió por completo; los números mostrados son su última iteración.';
$ec_lang['lpn_status_note']='Se lee de la misma simulación de período extendido que el panel de Tablas y el Informe completo. Solo se enumera un cambio, no cada paso.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Completo';
$ec_lang['lpn_reports_full_tip']='Tabla de todos los nodos y líneas en cada paso de tiempo de informe de la última ejecución';
$ec_lang['lpn_full_title']='Informe completo';
$ec_lang['lpn_full_needs_run']='El informe completo enumera cada nudo y cada línea en cada paso de tiempo de informe. Presione Calcular, y luego abra Agua, Informes, Informe completo.';
$ec_lang['lpn_full_note']='Una fila por nudo o línea por paso de tiempo de informe, en las unidades mostradas en el panel de Tablas. Una celda en blanco es una columna que esa cantidad no tiene. Descargar o imprimir incluye cada paso de tiempo; la tabla de abajo muestra uno a la vez.';
$ec_lang['lpn_full_step_label']='Paso de tiempo';
$ec_lang['lpn_full_download_csv']='Descargar CSV';
$ec_lang['lpn_full_print']='Imprimir informe';
$ec_lang['lpn_full_col_time']='Tiempo';
$ec_lang['lpn_full_col_type']='Tipo';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='Filas ({n}).';

// ---- The Calibration report (ROADMAP Task 601) -------------------------------------------------
// EPANET's Report > Calibration and its three tabbed pages, with EPANET's own column names (EPANET
// 2.2 manual, section 9.6). Mean error is EPANET's term for the mean ABSOLUTE difference. "Num obs"
// is EPANET's own column heading, kept short because results columns are narrow.
// lpn_calib_missing: keep in step with feat/profile-file's lpn_profile_file_missing (Task 604), the same sentence.
$ec_lang['lpn_reports_calib']='Calibración';
$ec_lang['lpn_reports_calib_tip']='Compara los datos de campo medidos de un archivo de calibración con la última ejecución: estadísticas, un gráfico de correlación y comparaciones de medias.';
$ec_lang['lpn_calib_title']='Calibración: informe';
$ec_lang['lpn_calib_param']='Parámetro';
$ec_lang['lpn_calib_param_tip']='La magnitud que mide el archivo de calibración. Se conserva un archivo por parámetro.';
$ec_lang['lpn_calib_load']='Cargar archivo de calibración…';
$ec_lang['lpn_calib_load_tip']='Un archivo de texto con un ID de ubicación, un tiempo y un valor medido en cada línea. El tiempo se mide desde el inicio de la simulación, en horas decimales o horas:minutos. Un punto y coma inicia un comentario. Una línea con solo un tiempo y un valor pertenece a la ubicación de arriba.';
$ec_lang['lpn_calib_none']='No hay ningún archivo de calibración cargado para este parámetro.';
$ec_lang['lpn_calib_session']='Un archivo de calibración se conserva solo durante esta sesión. No se guarda con el proyecto ni en este dispositivo.';
$ec_lang['lpn_calib_file']='{file}: mediciones ({n}) en ubicaciones ({m}).';
$ec_lang['lpn_calib_units']='Los valores del archivo se leen en las unidades de este proyecto: {unit}.';
$ec_lang['lpn_calib_missing']='Nombradas en el archivo pero no en esta red: {ids}.';
$ec_lang['lpn_calib_missing_count']='Mediciones omitidas porque su ubicación no está en esta red: {n}.';
$ec_lang['lpn_calib_bad_lines']='Líneas que no se pudieron leer, omitidas: {lines}';
$ec_lang['lpn_calib_outside']='Mediciones fuera de los tiempos que reportó esta ejecución, omitidas: {n}.';
$ec_lang['lpn_calib_no_value']='Mediciones sin valor calculado en su tiempo, omitidas: {n}.';
$ec_lang['lpn_calib_single']='Esta es una ejecución de un solo período, así que cada medición se compara con su único resultado, sea cual sea el tiempo que dé el archivo.';
$ec_lang['lpn_calib_needs_run']='Todavía no hay resultados con qué comparar. El informe se completa cuando se ha calculado la red.';
$ec_lang['lpn_calib_no_pairs']='No se pudo comparar ninguna medición, así que no hay nada que graficar.';
$ec_lang['lpn_calib_tab_stats']='Estadísticas';
$ec_lang['lpn_calib_tab_corr']='Gráfico de correlación';
$ec_lang['lpn_calib_tab_means']='Comparación de medias';
$ec_lang['lpn_calib_col_location']='Ubicación';
$ec_lang['lpn_calib_col_n']='N.º obs.';
$ec_lang['lpn_calib_col_obs_mean']='Media observada';
$ec_lang['lpn_calib_col_sim_mean']='Media calculada';
$ec_lang['lpn_calib_col_mean_err']='Error medio';
$ec_lang['lpn_calib_col_mean_err_tip']='La media de las diferencias absolutas entre cada valor observado y el valor calculado en el mismo tiempo.';
$ec_lang['lpn_calib_col_rms_err']='Error RMS';
$ec_lang['lpn_calib_col_rms_err_tip']='Error cuadrático medio: la raíz cuadrada de la media de los cuadrados de las diferencias entre los valores observados y calculados.';
$ec_lang['lpn_calib_network']='Red';
$ec_lang['lpn_calib_corr_means']='Correlación entre medias: {r}';
$ec_lang['lpn_calib_corr_none']='Correlación entre medias: necesita al menos dos ubicaciones cuyas medias difieran.';
$ec_lang['lpn_calib_axis_obs']='Observado: {q}';
$ec_lang['lpn_calib_axis_sim']='Calculado: {q}';
$ec_lang['lpn_calib_observed']='Observado';
$ec_lang['lpn_calib_computed']='Calculado';
$ec_lang['lpn_calib_point']='{id}, {time}: observado {o}, calculado {s}';
$ec_lang['lpn_calib_corr_note']='Cada punto es una medición. Cuanto más cerca de la línea diagonal estén los puntos, más se parecen los valores calculados a los observados.';
$ec_lang['lpn_calib_ts_point']='Medido en {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Los anillos son valores medidos del archivo de calibración.';
$ec_lang['lpn_energy_no_price']='No se indica un precio de la energía, así que todo costo aquí es cero. Configure uno en Configuración, Energía.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Esta red indica un precio de cero, así que todo costo aquí es cero. Cámbielo en Configuración, Energía.';
$ec_lang['lpn_energy_curve_note']='Estas bombas indican una curva de eficiencia sin puntos: {ids}. Funcionaron a la eficiencia fijada para toda la red.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_drop']='Descarte';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Nodo y línea';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Intervalo igual';
$ec_lang['lpn_color_mode_quantile']='Cuantil (igual número)';
$ec_lang['lpn_color_mode_jenks']='Rupturas naturales (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Desviación estándar';
$ec_lang['lpn_color_mode_pretty']='Bonito (redondeado)';
$ec_lang['lpn_color_mode_log']='Logarítmico';
$ec_lang['lpn_color_mode_manual']='Manual';

// ---- LIBRARIES (ROADMAP Tasks 462 and 460) ---------------------------------------------------
// The document has carried patterns, curves and controls since Task 423; nothing on the page could
// see one. This is that interface. Tom, 2026-08-20: "for Water Networks, I think we also need the
// following in a group: Libraries (Patterns, Curves, Controls, Pumps, Pipes, Custom), Settings,
// Simulate, Transport, Time selectors."
//
// ONE NAME, THREE DOORS: the toolbar button, the Edit menu row and the box's own title all read
// this key, exactly as lpn_tool_settings serves the Settings box's three.
// Plural, because it is a shelf of them: a user opens Libraries to reach the patterns, not to reach
// "the library".
$ec_lang['lpn_library_menu']='Bibliotecas';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='Patrones';
// **THE SYNONYMS ARE TOM'S OWN, GIVEN 2026-08-24**, which is the written permission this array
// requires. "Pattern" is the discipline's standard term and stays the label; the payload exists so
// a translator who cannot recover the concept from that one word has the shape of it.
//
// "Run" was on his list and he struck it the same day, on the collision: this page's Run is the
// button that plays an extended-period simulation back, so a translator reaching for their word for
// a program run would have named the wrong thing. Tom: *"Yes. It's not the best term."*
$ec_lang['lpn_library_patterns_tip']='Un patrón es una lista de multiplicadores que se repite. Cada uno se aplica durante un paso de tiempo del patrón, así que 24 números con un paso de una hora forman un día que se repite. Una demanda de 10 con un multiplicador de 1,5 es 15 en ese momento.';
$ec_lang['lpn_library_curves']='Curvas';
$ec_lang['lpn_library_curves_tip']='Carga o eficiencia de la bomba frente al caudal, pérdida de la válvula frente al caudal, o volumen del depósito frente a la profundidad';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Una curva pertenece a un proyecto, y una bomba o una válvula indica en sus propias propiedades cuál usa. Varios elementos pueden usar la misma curva, y editarla aquí cambia todos ellos. Para una curva de carga de bomba, la ejecución usa una curva ajustada a los puntos como se muestra; para los demás tipos, conecta los puntos con líneas rectas como se muestra.';
$ec_lang['lpn_library_curve_add']='Agregar una curva';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='Tipo de curva';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='Ecuación';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='La curva ajustada a los puntos dados y usada para el modelo de la bomba.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Seleccione una o dos columnas de una hoja de cálculo, cópielas y péguelas en la primera celda de destino. Las filas se agregan según se necesiten. También se pueden pegar líneas copiadas directamente de un archivo de EPANET, incluido el nombre de la curva.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Descripción';
$ec_lang['lpn_library_curve_remove_point']='Eliminar este punto';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Copiar puntos';
$ec_lang['lpn_library_curve_copy_tip']='Copia cada punto en dos columnas, listas para pegar en una hoja de cálculo.';
$ec_lang['lpn_library_curve_copy_manual']='Copiar estos puntos';
$ec_lang['lpn_library_curve_used_by']='Elementos que usan esta curva';
$ec_lang['lpn_library_curve_unused']='Nada usa esta curva.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Esta curva la usan elementos ({count}): {ids}. Primero asígneles otra curva y después elimine esta.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Tipos de tubería';
$ec_lang['lpn_library_pipetypes_tip']='Un tipo de tubería es una definición que varias tuberías pueden referenciar para su diámetro, rugosidad y coeficientes de reacción. Editar la definición edita cada tubería que la usa.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Cada proyecto tiene una biblioteca de tipos de tubería independiente. Las propiedades pueden dejarse en blanco en la definición de un tipo de tubería; por ejemplo, un tipo de tubería puede especificar una rugosidad y ningún diámetro. Los tipos de tubería se asignan a las tuberías en las propiedades de la tubería. Editar una definición aquí cambia todas las tuberías que hacen referencia a ella.';
$ec_lang['lpn_library_pipetype_add']='Agregar un tipo de tubería';
$ec_lang['lpn_library_pipetype_blank_tip']='Las propiedades en blanco en una definición de tipo de tubería se dejan para ingresarse individualmente en cada tubería.';
$ec_lang['lpn_library_pipetype_used_by']='Tuberías que usan este tipo';
$ec_lang['lpn_library_pipetype_unused']='Nada usa este tipo de tubería.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Este tipo de tubería lo usan tuberías ({count}): {ids}. Sepárelo de ellas antes de eliminarlo.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Tipo de tubería';
$ec_lang['lpn_field_pipetype_tip']='El tipo de tubería de la biblioteca del proyecto que usa esta tubería. Las propiedades incluidas en el tipo de tubería quedan deshabilitadas para editar aquí. Separe el tipo de tubería para habilitar la edición aquí.';
$ec_lang['lpn_pipetype_none']='Ningún tipo de tubería elegido';
$ec_lang['lpn_pipetype_detach']='Separar del tipo de tubería';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Copia en la tubería los valores que esta lee de su tipo y deja de usar el tipo. Los valores de la tubería no cambian ahora, y de ahora en adelante estos valores se editan aquí.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Accesorios';
$ec_lang['lpn_library_fittings_tip']='Accesorios con coeficientes de pérdida localizada agrupados en listas';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Cada proyecto tiene una biblioteca de accesorios independiente. Una lista de accesorios tiene accesorios con una cantidad para cada uno, y suma un solo coeficiente de pérdida localizada. Tanto las tuberías como los tipos de tubería pueden hacer referencia a una lista.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Los accesorios que se ofrecen aquí son los trece de la tabla 3.3 del manual de usuario de EPANET 2.2. Elegir uno copia su coeficiente en la fila, donde se puede cambiar. Un coeficiente depende del tamaño y del fabricante del accesorio, así que considere la tabla un punto de partida y no valores finales.';
$ec_lang['lpn_library_fittings_add']='Agregar una lista de accesorios';
$ec_lang['lpn_library_fittings_used_by']='Tuberías que usan esta lista de accesorios';
$ec_lang['lpn_library_fittings_unused']='Nada usa esta lista de accesorios.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Esta lista de accesorios la usan tuberías ({count}): {ids}. Sepárela de ellas antes de eliminarla.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Importar bibliotecas…';
$ec_lang['lpn_library_import_tip']='Elija otro archivo de proyecto y copie bibliotecas completas de él a este proyecto. Todo cuyo nombre ya esté en uso aquí se omite y se enumera, así que nada de lo que ya tiene cambia.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Elija qué copiar de {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Cada biblioteca que marque se copia por completo. Elimine después lo que no quiera, de la misma manera que elimina cualquier otra entrada.';
$ec_lang['lpn_library_import_go']='Importar';
$ec_lang['lpn_library_import_no_libraries']='Ese archivo de proyecto no tiene bibliotecas para copiar.';
$ec_lang['lpn_library_import_heading']='Importado de {file}';
$ec_lang['lpn_library_import_added']='Copiado: {names}';
$ec_lang['lpn_library_import_conflict']='Omitido, porque este proyecto ya tiene uno con el mismo nombre: {names}. Nada aquí cambió. Cambie el nombre de uno de los dos e importe de nuevo si quiere tener ambos.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Ese archivo de proyecto no tiene ninguno de estos para copiar.';
$ec_lang['lpn_library_import_curve_shape']='Estas curvas se importaron exactamente como están escritas en el archivo, y una ejecución no puede usar una hasta que su primera columna aumente de cada punto al siguiente: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Estos tipos de tubería hacen referencia a una lista de accesorios que este proyecto no tiene: {names}. Importe la biblioteca de accesorios del mismo archivo para resolver estas referencias.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Advertencia: las unidades no coinciden. Se importará tal cual. No se recomienda.';
$ec_lang['lpn_library_import_units_line']='{name}: este proyecto muestra {mine}, el archivo muestra {theirs}.';
$ec_lang['lpn_fitting_qty']='Cantidad';
$ec_lang['lpn_fitting_name']='Accesorio';
$ec_lang['lpn_fitting_k']='Coeficiente';
$ec_lang['lpn_fitting_add']='Agregar un accesorio';
$ec_lang['lpn_fitting_remove']='Quitar';
$ec_lang['lpn_fitting_total']='Coeficiente total de pérdida localizada, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Lista de accesorios';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Una lista de accesorios de la biblioteca del proyecto. Sus cantidades y coeficientes se suman en el coeficiente de pérdida localizada de esta tubería, y el cuadro del coeficiente queda entonces de solo lectura. Si no se elige ninguna lista, el coeficiente se ingresa directamente.';
$ec_lang['lpn_fittings_none']='Ninguna lista de accesorios elegida';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Válvula de globo, totalmente abierta';
$ec_lang['lpn_fitting_angle']='Válvula angular, totalmente abierta';
$ec_lang['lpn_fitting_swingcheck']='Válvula de retención de columpio, totalmente abierta';
$ec_lang['lpn_fitting_gate']='Válvula de compuerta, totalmente abierta';
$ec_lang['lpn_fitting_elbow_short']='Codo de radio corto';
$ec_lang['lpn_fitting_elbow_medium']='Codo de radio medio';
$ec_lang['lpn_fitting_elbow_long']='Codo de radio largo';
$ec_lang['lpn_fitting_elbow_45']='Codo de 45 grados';
$ec_lang['lpn_fitting_return_bend']='Codo de retorno cerrado';
$ec_lang['lpn_fitting_tee_run']='Té estándar, flujo por el tramo recto';
$ec_lang['lpn_fitting_tee_branch']='Té estándar, flujo por la derivación';
$ec_lang['lpn_fitting_entrance']='Entrada cuadrada';
// Tom, 2026-09-30, ruling sprint 2026-09-30-golf item 1: _syn = "All junctions" / "Selected junctions".
$ec_lang['lpn_fitting_exit']='Salida';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Otro accesorio';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_lead']='El archivo EPANET exportado es numéricamente equivalente a este proyecto. Pero no tiene lugar para lo siguiente:';
$ec_lang['lpn_inp_export_flat_types']='Tuberías de aquí ({n}) hacen referencia a tipos de tubería ({t}). En el archivo, cada una de esas tuberías lleva su propia copia de los números, así que los resultados son los mismos. Lo que el archivo no puede contener es el tipo de tubería en sí, así que el vínculo entre una definición y cada tubería que la usa se registra solo en el archivo de proyecto.';
$ec_lang['lpn_inp_export_flat_coords']='Un archivo de EPANET contiene una posición para cada nodo. Este escenario coloca {n} de ellos en otro lugar, y esas son las posiciones del archivo. Cualquier otro escenario conserva sus posiciones solo en el archivo del proyecto.';
$ec_lang['lpn_inp_export_flat_fittings']='Un archivo EPANET no puede contener la lista de codos, válvulas y tés de su archivo de proyecto. El coeficiente de pérdida localizada de las tuberías de aquí ({n}) se suma a partir de una lista de accesorios. El total pasa al archivo tal como está, así que nada cambia en las respuestas.';
$ec_lang['lpn_library_controls']='Controles';
$ec_lang['lpn_library_controls_tip']='Un control es una sola instrucción que abre o cierra una línea, o cambia su ajuste, según el nivel de agua de un depósito, la presión de un nodo o la hora.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Agregar un patrón';
$ec_lang['lpn_library_pattern_values']='Multiplicadores';
$ec_lang['lpn_library_pattern_values_tip']='Los multiplicadores, separados por espacios o comas. Pegue una columna de una hoja de cálculo si tiene una. La lista se repite mientras dure la ejecución, así que no hace falta que cubra toda la ejecución.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='Multiplicadores: {n}, separados por {step}, que cubren {span}';
// Under the pattern graph, beside the clock-time row: the ordinal of each time period (1, 2, 3).
$ec_lang['lpn_library_pattern_axis_step']='Paso';
$ec_lang['lpn_library_pattern_none']='Sin patrón';
// The blank first option of a selector whose blank follows a project-wide default (a junction's or
// customer's demand pattern, a pump's price pattern and efficiency curve). Tom, 2026-10-04.
$ec_lang['lpn_choice_default']='Predeterminado';
$ec_lang['lpn_settings_default_pattern']='Patrón de demanda predeterminado';
$ec_lang['lpn_settings_default_pattern_tip']='Todo nudo sin patrón usa este.';
$ec_lang['lpn_junction_pattern_unknown']='Ningún patrón de este proyecto tiene el ID {id}, así que el nudo se dejó como estaba.';
$ec_lang['lpn_settings_default_pattern_none']='Ninguno (constante)';
$ec_lang['lpn_demand_pattern_default']='(predeterminado: {id})';
$ec_lang['lpn_demand_pattern_constant']='(constante)';
$ec_lang['lpn_library_pattern_default_mark']='(predeterminado)';
$ec_lang['lpn_library_pattern_default_tip']='El patrón de demanda predeterminado. Cámbielo en Configuración, Patrón de demanda predeterminado.';
$ec_lang['lpn_library_pattern_default_deleted_to']='El patrón {id} era el patrón de demanda predeterminado. Los nudos sin patrón usan ahora el patrón {now}.';
$ec_lang['lpn_library_pattern_default_deleted_none']='El patrón {id} era el patrón de demanda predeterminado. Los nudos sin patrón usan ahora una demanda constante.';
$ec_lang['lpn_library_pattern_default_deleted_also']='Escenarios que también lo usaban como su patrón predeterminado: {list}.';
$ec_lang['lpn_library_pattern_default_deleted_in']='El patrón {id} era el patrón de demanda predeterminado en estos escenarios: {list}.';
$ec_lang['lpn_library_control_add']='Agregar un control';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Una sola frase, con las palabras que usa EPANET. Cuatro formas: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, y LINK 12 CLOSED AT CLOCKTIME 3 AM. En vez de OPEN o CLOSED puede escribir un número, que es un ajuste de válvula o una velocidad de bomba. Deje las palabras clave en inglés; son las que lee la página.';
$ec_lang['lpn_library_control_ok']='✓ Entendido';
$ec_lang['lpn_library_control_bad']='⚠ No se entendió';
$ec_lang['lpn_library_control_missing']='⚠ Esta red no tiene nada llamado {id}';
$ec_lang['lpn_library_rules']='Reglas';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Una regla abre o cierra una línea, o cambia su ajuste, cuando un nivel de agua, una presión, un caudal o la hora alcanza un valor fijado. Una regla puede evaluar más de una condición y puede especificar la acción que se toma cuando la condición es falsa.';
$ec_lang['lpn_library_rule_add']='Agregar una regla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Una cláusula por línea. A continuación se describen las líneas, con ejemplos en "MAYÚSCULAS". Línea 1: nombre de la regla, "RULE 1". Línea 2: una condición, "IF TANK 2 LEVEL BELOW 17.1". Línea 3: una acción, "THEN PUMP 9 STATUS IS OPEN". Línea 4: una prioridad, "PRIORITY 1". Agregue líneas "AND" u "OR" para evaluar más de una condición, y líneas "ELSE" para especificar la acción cuando la condición es falsa. Una condición puede leer LEVEL, HEAD, GRADE, PRESSURE o DEMAND en un nodo, FLOW, STATUS o SETTING en una línea, o TIME y CLOCKTIME en SYSTEM. Use unidades coherentes con el proyecto. Las palabras clave deben estar en inglés.';
$ec_lang['lpn_library_rule_ok']='✓ Esta regla se leyó';
$ec_lang['lpn_library_rule_bad']='⚠ Esta regla no se pudo leer';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='Demanda base';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='El caudal que este nodo extrae en el paso de tiempo mostrado: cada demanda base multiplicada por su propio patrón, sumadas. Es un resultado, no un dato de entrada.';
$ec_lang['lpn_field_demand_pattern']='Patrón de demanda';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Descripción';
$ec_lang['lpn_demand_add']='Agregar categoría de demanda';
$ec_lang['lpn_demand_remove']='Quitar esta demanda';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Patrón de carga';
$ec_lang['lpn_field_head_pattern_tip']='Patrón del nivel de agua de este embalse a lo largo de la ejecución. La carga de arriba se multiplica por el patrón.';
$ec_lang['lpn_field_pump_speed']='Velocidad relativa';
$ec_lang['lpn_field_pump_speed_tip']='Relativa a la velocidad de rotación usada para generar su curva de rendimiento publicada. Se ignora (no se escala) si hay un patrón de velocidad.';
$ec_lang['lpn_field_speed_pattern']='Patrón de velocidad';
$ec_lang['lpn_field_speed_pattern_tip']='Cada entrada del patrón da la velocidad relativa para esa parte de la ejecución, en lugar de escalar un valor base.';

// ---- place-name search and terrain elevations (Task 507) ---------------------------------------
// Both features ask an outside service for something, and each asks its own permission question
// first. The dialog is the feature, so it is translated like anything else: it shipped as English
// literals inside js/lpn-search.js and js/lpn-terrain.js, which meant a permission dialog nobody
// could read in 26 of the 27 languages. The literals stay in those files as the fallback; these
// keys are what the visitor actually sees.
//
// THE CONSENT TEXT IS ONE KEY PER PARAGRAPH, joined with a blank line in JS. A lang value is one
// line by construction here -- nothing in these files has ever held a newline -- and splitting is
// better than inventing a line-break placeholder: a translator sees four short questions instead of
// one wall, and the order of the paragraphs stays ours rather than the translation's.
$ec_lang['lpn_search_menu']='Buscar un lugar por nombre…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Se solicita permiso en el primer uso, porque las búsquedas se envían al servicio de nombres de lugares de OpenStreetMap.';
$ec_lang['lpn_search_bar']='Buscar por nombre…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='La búsqueda por nombre de lugar envía las palabras ingresadas a nominatim.openstreetmap.org, el servicio gratuito de nombres de lugares de la Fundación OpenStreetMap.';
$ec_lang['lpn_search_consent_2']='Este es un servicio distinto de las imágenes del mapa de calles detrás de su proyecto. Las imágenes solo indican dónde está mirando. Una búsqueda indica lo que ingresó. El servicio de nombres de lugares recibirá sus palabras de búsqueda y su dirección IP. No enviamos nada más, y no conservamos ningún registro de sus búsquedas.';
$ec_lang['lpn_search_consent_3']='¿Podemos enviar sus búsquedas al servicio de nombres de lugares?';
$ec_lang['lpn_search_consent_4']='Si dice que no, todo lo demás en esta página sigue funcionando exactamente como ahora, incluido Ir a una latitud y longitud. Recordamos un sí para no tener que volver a preguntar. Un no no se guarda en absoluto.';
$ec_lang['lpn_search_refused']='La búsqueda por nombre de lugar está desactivada, y no se envió nada. El comando Ir a una latitud y longitud sigue funcionando.';
$ec_lang['lpn_search_prompt']='Busque un lugar por nombre. Una ciudad, una calle, un punto de referencia — por ejemplo: Petaluma, California';
$ec_lang['lpn_search_empty']='Ingrese un nombre de lugar para buscar.';
$ec_lang['lpn_search_working']='Buscando…';
$ec_lang['lpn_search_busy']='Ya hay una búsqueda en curso. Espere a que termine.';
$ec_lang['lpn_search_choose']='Coinciden varios lugares. ¿Cuál?';
$ec_lang['lpn_search_nochoice']='No se eligió nada, así que el mapa no se movió.';
$ec_lang['lpn_search_badchoice']='Ese no es uno de los números de la lista.';
$ec_lang['lpn_search_none']='No se encontró nada para ese nombre.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='El servicio de nombres de lugares ha limitado la frecuencia de solicitudes. Espere un minuto y vuelva a intentarlo.';
$ec_lang['lpn_search_http']='El servicio de nombres de lugares devolvió un error.';
$ec_lang['lpn_search_timeout']='El servicio de nombres de lugares no respondió a tiempo. Todo lo demás en esta página funciona sin él.';
$ec_lang['lpn_search_unreadable']='El servicio de nombres de lugares devolvió una respuesta que esta página no pudo leer.';
$ec_lang['lpn_search_offline']='No pudimos comunicarnos con el servicio de nombres de lugares. Puede que esté sin conexión. Todo lo demás en esta página funciona sin él, incluido Ir a una latitud y longitud.';
$ec_lang['lpn_search_toofast']='El servicio de nombres de lugares permite una búsqueda por segundo. Vuelva a intentarlo en un momento.';
$ec_lang['lpn_search_nofetch']='Este navegador no puede comunicarse con el servicio de nombres de lugares.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox compone esto a partir de muchos conjuntos de datos de elevación públicos, así que su precisión depende de la ubicación. Donde existe un levantamiento lidar nacional, como USGS 3DEP en gran parte de Estados Unidos y sus equivalentes en otros países, puede ser mejor que 1 m en horizontal y unas pocas décimas de metro en vertical. Donde solo existen datos globales, es de unos 30 m en horizontal y varios metros en vertical. Mapbox no indica qué fuente corresponde. Trátelo como un mapa de curvas de nivel, no como un levantamiento, y verifique todo valor del que dependa el diseño.';
$ec_lang['lpn_terrain_consent_1']='Rellenar elevaciones envía la posición de cada nodo que necesita una — su latitud y longitud — a api.mapbox.com, para consultar la altura del terreno allí.';
$ec_lang['lpn_terrain_consent_2']='Esta es una cuestión distinta de las imágenes del mapa detrás de su proyecto. Las imágenes solo dicen adónde está mirando. Estas posiciones son su red misma. Mapbox recibirá esas coordenadas y su dirección IP. No enviamos nada más: ni nombre, ni tuberías, ni proyecto. No guardamos ningún registro de esto, y nada se almacena en este dispositivo salvo su respuesta a esta pregunta.';
$ec_lang['lpn_terrain_consent_3']='¿Podemos enviar las posiciones de sus nodos a Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Si dice que no, todo lo demás en esta página sigue funcionando exactamente como ahora, y las elevaciones se pueden ingresar a mano como antes. Recordamos un sí para no tener que preguntar de nuevo. Un no no se guarda en absoluto.';
$ec_lang['lpn_terrain_refused']='No se rellenaron las elevaciones, y no se envió nada. Se pueden ingresar a mano como antes.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='¿Rellenar la elevación de {n} nodo(s) a partir de Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='Todos los nodos ya tienen una elevación, y {n} de ellos siguen en {v}, que es la elevación con la que empieza un nodo nuevo y no una ingresada.';
$ec_lang['lpn_terrain_confirm_default_2']='¿Reemplazar la elevación de esos nodos ({n}) con valores de Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} nodo(s) ya tienen una elevación y no se cambiarán.';
$ec_lang['lpn_terrain_undo']='Un solo Deshacer (Ctrl-Z) los restablece a todos.';
$ec_lang['lpn_terrain_requests']='{n} solicitud(es) a api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Ya se están rellenando las elevaciones. Espere a que terminen.';
$ec_lang['lpn_terrain_offmap']='Estas posiciones de nodo no están en el mapa de terreno, así que no se envió nada.';
$ec_lang['lpn_terrain_too_wide']='Estos nodos abarcan demasiada superficie de la Tierra para leerlos en una sola operación ({n} solicitudes de mosaico). No se envió nada.';
$ec_lang['lpn_terrain_cancelled']='No se cambió nada y no se envió nada.';
$ec_lang['lpn_terrain_nofetch']='Este navegador no puede comunicarse con el servicio de terreno.';
$ec_lang['lpn_terrain_working']='Leyendo la superficie del terreno…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='El servicio de terreno rechazó la solicitud ({status}), así que no se cambió ninguna elevación. Puede que el token de Mapbox que usa este sitio no permita la dirección web en la que se encuentra.';
$ec_lang['lpn_terrain_failed']='No pudimos comunicarnos con el servicio de terreno, así que no se cambió ninguna elevación. Puede que esté sin conexión. Todo lo demás en esta página funciona sin él.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='El servicio de terreno ha limitado la frecuencia de solicitudes (429), así que no se cambió ninguna elevación. Vuelva a intentarlo en un minuto.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='El servicio de terreno respondió con un error ({status}), así que no se cambió ninguna elevación. No hay nada mal con su red.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Ninguno de esos nudos tiene una posición sobre la Tierra, así que no se envió nada y no se cambió ninguna elevación. Leer la superficie del terreno necesita un proyecto en latitud y longitud, o uno en una proyección que esta página pueda colocar.';
$ec_lang['lpn_terrain_done']='{n} elevación(es) rellenada(s).';
$ec_lang['lpn_terrain_missed']='{m} no se pudieron leer y siguen en blanco.';
$ec_lang['lpn_terrain_partial']='{f} mosaico(s) de terreno no respondieron.';
$ec_lang['lpn_terrain_will_ids']='Estos nodos recibirán una elevación: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Esos nodos son: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Estos nodos recibieron una elevación: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Estos nodos todavía no tienen elevación: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, y {n} más';

// ---- Fire flow: the whole-system sweep (ROADMAP Task 530) ---------------------------------------
// Tom's question, 2026-08-27: which junctions can provide the fire flow their code asks for, and
// which of them break something else in the system while doing it. So there is ONE run and TWO
// reports, and every junction comes back Passing, Failing, or with a Design issue.
//
// THE DEMAND GOES ON THE JUNCTION ITSELF and no hydrant is modelled. That is what both inspectable
// tools do, and it is why lpn_ff_accounting exists: how hydrant losses are accounted for has to be
// said out loud rather than assumed by the reader.
//
// {flow} and {velocity} are quantities with their units, {pressure} a pressure with its unit,
// {id} a junction or pipe name, and {done}, {total}, {n}, {pass}, {fail}, {design} and {solves}
// are whole numbers. Every one is substituted, never concatenated.
$ec_lang['lpn_analyze_menu']='Analizar';
$ec_lang['lpn_analyze_menu_tip']='Análisis que ejecutan la red en una copia: caudal contra incendios en cada nudo, la pérdida de cada tubería, bomba y válvula, y las demandas escaladas hacia arriba o hacia abajo.';
$ec_lang['lpn_ff_menu']='Caudal contra incendios…';
$ec_lang['lpn_ff_menu_tip']='Pruebe cada nudo seleccionado para caudal contra incendios, y verifique el efecto sobre el resto del sistema';
$ec_lang['lpn_ff_title']='Caudal contra incendios';
$ec_lang['lpn_ff_intro']='Cada nudo, por turno, extrae un caudal contra incendios además de su demanda existente. La ejecución usa una copia de la red en el paso de tiempo que se muestra en pantalla, así que no se cambia nada en el proyecto.\n\nEl caudal contra incendios normalmente se prueba con la demanda del día máximo, así que primero ajuste la red a esa condición.\n\nCada nudo probado requiere unas 16 soluciones de toda la red, así que un sistema grande tarda minutos: elija los nudos antes de ejecutar, y deténgase en cualquier momento para conservar los resultados parciales.';
$ec_lang['lpn_ff_scope']='Nudos a probar';
$ec_lang['lpn_ff_all']='Todos los nudos';
$ec_lang['lpn_ff_selected']='Nudos seleccionados';
$ec_lang['lpn_ff_no_junctions']='Este proyecto todavía no tiene nudos, así que no hay nada que probar.';
$ec_lang['lpn_ff_no_selection']='No hay ningún nudo seleccionado. Seleccione nudos o elija Todos los nudos.';
$ec_lang['lpn_ff_skipped']='{n} elementos seleccionados no son nudos, así que no se probaron.';
$ec_lang['lpn_ff_required']='Caudal contra incendios requerido';
$ec_lang['lpn_ff_required_tip']='El caudal requerido en un hidrante por el código de incendios aplicable o la autoridad de bomberos. Cada nudo se prueba contra este valor, a menos que se ingrese un caudal contra incendios requerido para ese nudo.';
$ec_lang['lpn_ff_required_own']='Los nudos con un caudal contra incendios requerido individual se prueban contra ese valor en su lugar. Cantidad de ellos: {n}.';
$ec_lang['lpn_ff_required_node_tip']='El caudal contra incendios requerido en este nudo para el uso del suelo que atiende, según el código de incendios aplicable o la autoridad de bomberos. Déjelo en blanco para probar el nudo contra el valor del cuadro Caudal contra incendios.';
$ec_lang['lpn_ff_residual']='Presión residual a mantener';
$ec_lang['lpn_ff_residual_tip']='La presión que el nudo debe seguir manteniendo mientras entrega el caudal contra incendios. AWWA M31 y NFPA 291 usan 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Verificación de diseño (efecto en el sistema)';
$ec_lang['lpn_ff_design_tip']='Una pregunta aparte de si el nudo puede entregar el caudal: con ese caudal extraído allí, ¿algún otro nudo cae por debajo de su presión mínima o alguna tubería excede su límite de velocidad? Esta verificación no requiere cálculo adicional.';
$ec_lang['lpn_ff_design_off']='Ninguna';
$ec_lang['lpn_ff_design_all']='Todos';
$ec_lang['lpn_ff_design_selected']='Seleccionados';
$ec_lang['lpn_ff_design_no_selection']='El alcance de la verificación de diseño está fijado en Seleccionados, pero no hay elementos seleccionados. Seleccione elementos en el mapa o elija Todos.';
$ec_lang['lpn_ff_minpressure']='Presión mínima permitida en el resto';
$ec_lang['lpn_ff_minpressure_tip']='Un nudo que cae por debajo de esto mientras otro extrae su caudal contra incendios se reporta como un problema de diseño.';
$ec_lang['lpn_ff_maxvelocity']='Velocidad máxima permitida';
$ec_lang['lpn_ff_maxvelocity_tip']='Una tubería que funciona por encima de esto mientras se extrae un caudal contra incendios se reporta como un problema de diseño.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='La presión se modela en el nudo mismo, el método habitual. El hidrante, su lateral y su boquilla no se modelan, y la presión en la boquilla es menor que en el nodo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Esto se calcula con el solucionador incorporado.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Esto se calcula con el solucionador de EPANET.';
// Edited by TGH 2026-09-07
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='Cálculo de caudal contra incendios';
$ec_lang['lpn_ff_calculate']='Ejecutar';
$ec_lang['lpn_ff_stop']='Detener';
$ec_lang['lpn_ff_working']='Calculando: {done} de {total} nudos.';
$ec_lang['lpn_ff_stopped']='Detenido después de {done} de {total} nudos. Los resultados de abajo son los que ya se terminaron.';
$ec_lang['lpn_ff_cost']='Este cálculo resolvió toda la red {solves} veces.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='El dibujo cambió, así que se borraron los resultados del caudal contra incendios. Ejecútelo de nuevo.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Borrar anillos';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} nudos pasaron todas las verificaciones. {fire} nudos no cumplieron el caudal contra incendios. {design} nudos afectaron al resto del sistema.';
$ec_lang['lpn_ff_summary_error']='Nudos que no se pudieron resolver ({n}).';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Todos los nudos probados';
$ec_lang['lpn_ff_col_junction']='Nudo';
$ec_lang['lpn_ff_col_static']='Presión estática';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='La presión en este nudo antes de solicitar cualquier caudal contra incendios, con las demandas normales del sistema aún activas. No se cierra nada para medirla, así que esta no es una presión a caudal cero para el sistema; es la misma presión que muestra el mapa en este nudo. Tanto AWWA M31 como NFPA 291 llaman a esta lectura la presión estática, y es donde comienza una prueba de caudal contra incendios.';
$ec_lang['lpn_ff_col_available']='Caudal disponible';
$ec_lang['lpn_ff_col_required']='Caudal requerido';
$ec_lang['lpn_ff_col_residual']='Residual mantenida';
$ec_lang['lpn_ff_col_atrequired']='Presión al caudal requerido';
$ec_lang['lpn_ff_col_affected']='Peor efecto';
$ec_lang['lpn_ff_col_limit']='Límite de diseño';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='No verificado';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Falló en estático, así que no se verificó';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Modos de falla';
$ec_lang['lpn_ff_mode_fire']='Incendio';
$ec_lang['lpn_ff_mode_design']='Diseño';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Ninguno';
$ec_lang['lpn_ff_col_solves']='Cálculos';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Presión y velocidad';
$ec_lang['lpn_ff_atleast']='más de {flow}';
$ec_lang['lpn_ff_affect_node']='{id} cae a {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} alcanza {velocity}';
$ec_lang['lpn_ff_more']='y {n} más afectados';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='Nudos no mostrados: {n}.';
$ec_lang['lpn_ff_rows_more_links']='Líneas no mostradas: {n}.';
$ec_lang['lpn_ff_design_none']='Con el caudal contra incendios de cada nudo probado extraído por turno, nada dentro del alcance de la verificación de diseño falló sus límites.';
$ec_lang['lpn_ff_design_off_note']='El efecto en el resto del sistema no se verificó en este cálculo.';
// **WHY IT IS SAID AND NEVER APPLIED, in Tom's words (2026-09-02), and the reason is the MODEL, not
// the arithmetic:** *"These models are not always fine-grained. They don't represent every pipe,
// junction, or fire hydrant. Many things may be ganged at a node including categories and fire
// hydrants. That is why we don't enforce the credit limit."* A node is not a hydrant. It may stand
// for one, or for a block of them, and nothing in the file says which -- so a per-hydrant cap
// cannot be applied to a per-node number without knowing a thing the model does not carry.
//
// **"Credit" is ISO's own word and is a RATING term, not a hydraulic one** -- what a hydrant is
// allowed to count for when a fire-suppression rating is computed, which is why it can sit beside a
// hydraulic answer without contradicting it.
//
// ISO credits a single hydrant with at most 1,500 gpm whatever the hydraulics say. Said beside the
// numbers and never applied to them: a number quietly cut down to a credit limit is a lie with a
// tidy face.
$ec_lang['lpn_ff_iso']='La Insurance Services Office (ISO) acredita a un solo hidrante como máximo {flow}. Ese límite no se aplica aquí, porque un nudo puede representar más de un hidrante.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Ya está por debajo de la residual antes de extraer cualquier caudal contra incendios';
$ec_lang['lpn_ff_err_converge']='La red no convergió.';
$ec_lang['lpn_ff_err_solve']='El solucionador reportó un error y no dio ninguna respuesta.';
$ec_lang['lpn_ff_err_not_junction']='No es un nudo';
$ec_lang['lpn_ff_err_unknown']='Sin resultado. Código de error: {code}';

// ---- Water > Criticality analysis (Tom, 2026-09-30) -------------------------------------------
//
// Break each asset in turn, on a copy, and report what the system loses. "Criticality analysis" is
// the industry's term (WaterGEMS, InfoWater); EPANET has no such tool and no word for it. The run
// dialog, Run, Stop, the engine sentence and the cost line are fire flow's own keys.
//
// {n}, {done} and {total} are whole numbers; {pressure} is a pressure with its unit.
$ec_lang['lpn_crit_menu']='Análisis de criticidad…';
$ec_lang['lpn_crit_menu_tip']='Quite de la red, uno por uno, cada tubería, bomba y válvula, e informe el efecto sobre el sistema.';
$ec_lang['lpn_crit_title']='Criticidad: análisis';
$ec_lang['lpn_crit_intro']='Cada elemento se retira de la red por turno, y la red se resuelve en el paso de tiempo que se muestra en pantalla, en el escenario activo. No se cambia nada en el proyecto; toda la ejecución se hace en una copia.';
$ec_lang['lpn_crit_scope']='Líneas a interrumpir';
$ec_lang['lpn_crit_scope_tip']='Todas las tuberías, bombas y válvulas, o solo las seleccionadas en el mapa. Elija el conjunto antes de ejecutar.';
$ec_lang['lpn_crit_scope_all']='Todas las líneas';
$ec_lang['lpn_crit_scope_selected']='Líneas seleccionadas';
$ec_lang['lpn_crit_minpressure']='Presión mínima permitida';
$ec_lang['lpn_crit_minpressure_tip']='Es el mismo número que Presión mínima permitida en otras partes del análisis de Caudal contra incendios. Cambiarlo aquí lo cambia allá.';
$ec_lang['lpn_crit_col_asset']='Elemento';
$ec_lang['lpn_crit_col_unserved']='Demanda no atendida';
$ec_lang['lpn_crit_col_cutoff']='Nudos aislados';
$ec_lang['lpn_crit_col_below']='Nudos bajo el mínimo';
$ec_lang['lpn_crit_summary']='Elementos que dejan demanda sin atender o hacen caer un nudo por debajo de {pressure} ({n} de {total}).';
$ec_lang['lpn_crit_baseline_below']='Nudos que ya están por debajo con nada roto: {n}. No se cuentan.';
$ec_lang['lpn_crit_working']='Trabajando: {done} de {total} elementos.';
$ec_lang['lpn_crit_stopped']='Se detuvo después de {done} de {total} elementos. Los resultados de abajo son los ya terminados.';
$ec_lang['lpn_crit_no_selection']='No hay ninguna línea seleccionada. Seleccione líneas o elija Todas las líneas.';
$ec_lang['lpn_crit_no_links']='Este proyecto aún no tiene líneas, así que no hay nada que interrumpir.';
$ec_lang['lpn_crit_busy']='Otro análisis se está ejecutando. Deténgalo o espere a que termine.';
$ec_lang['lpn_crit_skipped']='{n} elementos seleccionados no son líneas, así que no se interrumpieron.';
$ec_lang['lpn_crit_stale']='El dibujo cambió, así que se borraron los resultados de criticidad. Vuelva a ejecutarlo.';
$ec_lang['lpn_crit_skipdead']='Omitir extremos muertos';
$ec_lang['lpn_crit_skipdead_tip']='Una línea de extremo muerto es aquella cuya eliminación aísla nudos a los que solo se llega a través de ella, sin embalse ni depósito más allá. Su pérdida es todo lo que hay después, así que no se resuelve. El resumen dice cuántas se omitieron.';
$ec_lang['lpn_crit_skipped_dead']='Líneas de extremo muerto omitidas: {n}. Cada una aísla todo lo que hay después.';

// ---- Water > Analyze > Demand scaling (ROADMAP Task 754) ----------------------------------------
//
// Tom, 2026-09-30 and 2026-10-01: the demands multiplied on a copy, like Fire flow, and "What demand
// scale can the system handle with this pressure limit?" The run dialog's Stop, the engine sentence,
// the cost line, the Junction heading and the solver's reasons are fire flow's own keys.
//
// {m} and {max} are demand scales printed as numbers (1.37); {step} is the search's tolerance
// (0.01); {n} is a whole number, always after a colon so no plural has to agree with it; {time} and
// {now} are elapsed times (6:00); {pressure} is a pressure with its unit; {id} becomes a link to the
// junction on the map; {reason} is a whole sentence saying why the solver gave no answer.
$ec_lang['lpn_ds_menu']='Escalado de demanda…';
$ec_lang['lpn_ds_menu_tip']='Multiplique las demandas en una copia de la red y vea las presiones y velocidades, o encuentre la mayor escala de demanda que el sistema puede soportar.';
$ec_lang['lpn_ds_title']='Demanda: escalado';
$ec_lang['lpn_ds_intro']='Presione el botón Ejecutar para multiplicar las demandas en los nudos seleccionados por la escala de demanda y ver las presiones y velocidades.\n\nPresione el botón Buscar para encontrar la mayor escala de demanda, con aproximación de {step}, con la que todos estos nudos mantienen al menos la presión mínima permitida; la búsqueda va de 0 a {max}.\n\nAmbos trabajan sobre una copia de la red, resuelta en el paso de tiempo que se muestra en pantalla en el escenario activo, así que no se cambia nada en el proyecto. Solo se escala ese paso de tiempo, y los niveles y estados se toman de él; para probar el punto máximo, mueva el reloj a la demanda máxima antes de ejecutar.';
$ec_lang['lpn_ds_scope']='Nudos a escalar';
$ec_lang['lpn_ds_scope_all']='Todos los nudos';
$ec_lang['lpn_ds_scope_selected']='Nudos seleccionados';
$ec_lang['lpn_ds_minpressure']='Presión mínima permitida';
$ec_lang['lpn_ds_minpressure_tip']='Es el mismo número que Presión mínima permitida en el resto de Caudal contra incendios. Al cambiarlo aquí, cambia allá.';
$ec_lang['lpn_ds_head_scale']='Escalar las demandas';
$ec_lang['lpn_ds_multiplier']='Escala de demanda';
$ec_lang['lpn_ds_multiplier_tip']='El factor por el que se multiplica cada demanda; 1,5 es un aumento de 50%. Se aplica además del multiplicador de demanda del escenario activo, que ya está en las demandas, y nunca se guarda en el proyecto.';
$ec_lang['lpn_ds_run']='Ejecutar';
$ec_lang['lpn_ds_head_search']='¿Qué escala de demanda puede soportar el sistema?';
$ec_lang['lpn_ds_head_search_selected']='¿Qué escala de demanda pueden soportar estos nudos?';
$ec_lang['lpn_ds_outside_below']='Con una escala de demanda de {m}, nudos no seleccionados por debajo de {pressure}: {n} ({ids}). No limitan este resultado.';
$ec_lang['lpn_ds_holds_max']='✓ Todos los nudos mantienen {pressure} hasta una escala de demanda de {max}, el límite superior de la búsqueda.';
$ec_lang['lpn_ds_below_zero']='⚠ Al menos un nudo está por debajo de {pressure} aun con las demandas escaladas en cero.';
$ec_lang['lpn_ds_found']='✓ Todos los nudos revisados mantienen al menos {pressure} hasta una escala de demanda de {m}.';
$ec_lang['lpn_ds_found_below']='⚠ Las demandas tal como se ingresaron (una escala de demanda de 1) dejan al menos un nudo por debajo de {pressure}. La mayor escala de demanda que mantiene todos los nudos en {pressure} o más es {m}.';
$ec_lang['lpn_ds_search_stopped']='La búsqueda se detuvo antes de encontrar un resultado.';
$ec_lang['lpn_ds_lowest_at']='Con una escala de demanda de {m}, la presión más baja es {pressure}, en el nudo {id}.';
$ec_lang['lpn_ds_nosolve_at']='Con una escala de demanda de {m}, la red no produjo resultado. {reason}';
$ec_lang['lpn_ds_scale_ok']='✓ Con una escala de demanda de {m}, todos los nudos mantienen {pressure}.';
$ec_lang['lpn_ds_scale_below']='⚠ Con una escala de demanda de {m}, nudos por debajo de {pressure}: {n}.';
$ec_lang['lpn_ds_scaled_selected']='Nudos escalados y revisados: {n}.';
$ec_lang['lpn_ds_head_lowest']='Presiones más bajas';
$ec_lang['lpn_ds_head_velocity']='Velocidades más altas';
$ec_lang['lpn_ds_col_link']='Línea';
$ec_lang['lpn_ds_col_scaled']='Escalado';
$ec_lang['lpn_ds_col_scaled_tip']='Con las demandas multiplicadas por la escala de demanda.';
$ec_lang['lpn_ds_col_unscaled']='Sin escalar';
$ec_lang['lpn_ds_col_unscaled_tip']='Con las demandas tal como están en el escenario activo en este paso de tiempo, el mismo valor que muestra el mapa.';
$ec_lang['lpn_ds_no_junctions']='Este proyecto todavía no tiene nudos, así que no hay demandas que escalar.';
$ec_lang['lpn_ds_no_selection']='No hay nudos seleccionados. Seleccione nudos o elija Todos los nudos.';
$ec_lang['lpn_ds_skipped']='Elementos seleccionados que no son nudos, dejados como están: {n}.';
$ec_lang['lpn_ds_bad_multiplier']='Ingrese una escala de demanda de cero o más, como 1,5.';
$ec_lang['lpn_ds_stale']='El dibujo cambió, así que se borraron los resultados del escalado de demanda. Vuelva a ejecutarlo.';
$ec_lang['lpn_analyze_at_time']='Paso de tiempo: {time}.';
$ec_lang['lpn_analyze_time_moved']='⚠ Esto se calculó en {time}, y el reloj está ahora en {now}. Vuelva a ejecutarlo para el paso de tiempo que se muestra en pantalla.';

// ---- Settings > New assets > Import surveyed points: CSV and GPX (ROADMAP Task 592) -----------
//
// A field survey produces a flat list of a name, a latitude and a longitude -- never an EPANET
// `.inp` -- and EPANET has no path for one either. js/lpn-survey.js reads the file; these are the
// sentences it and js/looped-network.js say about what came across.
//
// **EVERY ONE OF THESE EXISTS BECAUSE A ROW THAT CANNOT BE HONOURED IS REPORTED, never dropped and
// never guessed at.** That is the rule the `.inp` importer already answered this question with, and
// a note per case is what makes it true rather than claimed: the reader is told which row, what its
// own number said, and what was done instead.
//
// The two refusals that matter most are about GUESSING. A latitude outside its range is very
// probably a longitude in the wrong column, and this page says so and changes nothing, because it
// cannot tell a mistake from a place; a file of eastings and northings is refused by name, because
// a plane coordinate read as a degree is silent and puts a network in the Gulf of Guinea.
$ec_lang['lpn_file_import_survey']='Importar puntos topográficos…';
$ec_lang['lpn_file_import_survey_tip']='Lee una lista de puntos topográficos de un archivo de texto y crea un nudo en cada punto, tomando los ajustes de elemento nuevo para todo lo que el archivo no indique. No se dibuja ninguna tubería a menos que marque Leer la descripción como códigos de campo, y ninguna fila se descarta sin ser nombrada. Lee el sistema de coordenadas que este proyecto ya usa, esté georreferenciado o no.';
// GeoJSON import of Shapes (Task 779). Only points, lines and polygons come in, as Shapes; the
// network is imported from an EPANET file. Every feature not imported is named in the report.
$ec_lang['lpn_file_import_shapes']='Importar figuras GeoJSON…';
$ec_lang['lpn_file_import_shapes_tip']='Leer los puntos, las líneas y los polígonos de un archivo GeoJSON en este proyecto como Figuras. Los elementos de red del archivo no se importan; importe la red desde un archivo de EPANET o con Importar red GeoJSON. El proyecto debe estar georreferenciado o indicar un sistema de coordenadas.';
$ec_lang['lpn_file_import_gjnet']='Importar red GeoJSON…';
$ec_lang['lpn_file_import_gjnet_tip']='Abrir un archivo GeoJSON como proyecto nuevo. Los puntos se importan como nudos, embalses o depósitos, y las líneas como tuberías. Un archivo exportado desde esta página se lee tal como se escribió; en cualquier otro archivo, un paso asigna sus campos a propiedades y unidades.';
$ec_lang['lpn_gjnet_refuse_crs']='{file} indica el sistema de coordenadas {crs}. Las posiciones de GeoJSON son latitud y longitud WGS 84 (RFC 7946), y esta página no convierte un archivo GeoJSON de otro sistema. Exporte la capa desde el SIG en EPSG:4326 (WGS 84) y luego importe ese archivo.';
$ec_lang['lpn_gjnet_refuse_empty']='{file} no contiene puntos ni líneas.';
$ec_lang['lpn_gjnet_target_node_type']='Tipo de nodo';
$ec_lang['lpn_gjnet_target_custom']='Propiedad personalizada';
$ec_lang['lpn_gjnet_target_skip']='No importar';
$ec_lang['lpn_gjnet_points_heading']='Campos de puntos (nudos, embalses y depósitos)';
$ec_lang['lpn_gjnet_lines_heading']='Campos de líneas (tuberías)';
$ec_lang['lpn_gjnet_no_fields']='Estas entidades no tienen campos de atributos.';
$ec_lang['lpn_gjnet_col_field']='Campo';
$ec_lang['lpn_gjnet_col_example']='Ejemplo';
$ec_lang['lpn_gjnet_col_fills']='Llena';
$ec_lang['lpn_gjnet_col_unit']='Unidad';
$ec_lang['lpn_gjnet_beta']='Beta: se piden comentarios';
$ec_lang['lpn_gjnet_beta_tip']='Esta importación se ha probado con pocos archivos de programas SIG. Para informar un problema o sugerir un cambio, presione {button} en la página y describa el archivo.';
$ec_lang['lpn_gjnet_intro']='Se encontraron {points} puntos y {lines} líneas. Los puntos se importan como nudos, embalses o depósitos, y las líneas como tuberías. Elija la propiedad que llena cada campo y la unidad de cada número.';
$ec_lang['lpn_gjnet_other']='{n} entidades no son ni puntos ni líneas y no se importarán; el informe las enumera.';
$ec_lang['lpn_gjnet_tolerance']='Tolerancia de unión (m)';
$ec_lang['lpn_gjnet_tolerance_tip']='El extremo de una línea que esté a esta distancia de un punto, o del extremo de otra línea, se une a él. El extremo de una línea que esté más lejos que esto de todos los puntos recibe un nudo nuevo.';
$ec_lang['lpn_gjnet_working']='Importando {file}…';
$ec_lang['lpn_gjnet_title']='Importar red GeoJSON: {file}';
$ec_lang['lpn_gjnet_report_lead']='Cada cambio hecho durante la importación, y cada entidad no importada, se enumera a continuación con su motivo:';
$ec_lang['lpn_gjnet_and_more']='y {n} más';
$ec_lang['lpn_gjnet_note_crs']='El archivo indica el sistema de coordenadas {crs}, que es latitud y longitud WGS 84, el sistema que exige RFC 7946. Las posiciones se leyeron tal como se indican.';
$ec_lang['lpn_gjnet_note_crs_nad83']='El archivo indica NAD83 (EPSG:4269). Sus posiciones se leyeron como WGS 84, lo que las ubica a unos 1 a 2 m de donde las ubica NAD83.';
$ec_lang['lpn_gjnet_note_skip_geometry']='No importado: la entidad no es un punto ni una línea.';
$ec_lang['lpn_gjnet_note_skip_kind']='No importado: la entidad no indica node_type ni link_type.';
$ec_lang['lpn_gjnet_note_skip_position']='No importado: una posición no es una latitud y longitud válidas.';
$ec_lang['lpn_gjnet_note_skip_id']='No importado: el nombre no es un ID válido, o ya lo tiene otro elemento del mismo tipo.';
$ec_lang['lpn_gjnet_note_skip_no_node']='No importado: el nodo inicial o final nombrado no está en el archivo.';
$ec_lang['lpn_gjnet_note_skip_loop']='No importado: ambos extremos de la línea se unen al mismo nodo.';
$ec_lang['lpn_gjnet_note_id_new']='Estas entidades no indican un ID válido y se les asignó el ID que aparece entre paréntesis.';
$ec_lang['lpn_gjnet_note_id_dup']='Estos ID los indica más de una entidad del mismo tipo. A cada entidad posterior se le asignó el ID que aparece entre paréntesis.';
$ec_lang['lpn_gjnet_note_unmapped_id_point']='No se eligió ningún campo para el ID de punto, así que a cada nodo importado de un punto se le asignó un ID.';
$ec_lang['lpn_gjnet_note_unmapped_id_line']='No se eligió ningún campo para el ID de línea, así que a cada tubería se le asignó un ID.';
$ec_lang['lpn_gjnet_note_skip_short']='No importado: una línea necesita al menos dos posiciones.';
$ec_lang['lpn_gjnet_note_elev_taken']='Estos nodos no indican elevación. A cada uno se le dio la elevación del nodo que aparece entre paréntesis: para un nudo agregado en el extremo de una línea, el nodo del otro extremo de su tubería; en los demás casos, el nodo más cercano que indique una.';
$ec_lang['lpn_gjnet_note_default_elev_added']='Estos nudos se agregaron en extremos de línea y tienen la elevación predeterminada, {value}, porque ningún nodo del archivo indica una elevación.';
$ec_lang['lpn_gjnet_note_demand_kept']='Un embalse o un depósito no tiene demanda, así que la demanda indicada en estos nodos se conservó como la propiedad personalizada {key}.';
$ec_lang['lpn_gjnet_note_parts']='Estas líneas de varias partes tienen partes que no están conectadas y se importaron como una tubería por cada parte.';
$ec_lang['lpn_gjnet_note_parts_points']='Estas entidades de varios puntos se importaron como un nodo por cada punto.';
$ec_lang['lpn_gjnet_note_junction_added']='Estos nudos se agregaron donde el extremo de una línea no está a menos de {tol} de un punto. Cada uno tiene la demanda base predeterminada.';
$ec_lang['lpn_gjnet_note_end_moved']='Estas tuberías tienen un extremo a menos de {tol} de un punto o del extremo de otra línea, pero no sobre él. El extremo se unió a él; la mayor distancia es {dist}.';
$ec_lang['lpn_gjnet_note_end_on_pipe']='Estos extremos de línea están sobre la tubería que aparece entre paréntesis, pero no en su extremo, y no están conectados a ella.';
$ec_lang['lpn_gjnet_note_z']='Estos puntos indican una tercera coordenada, que no se importó.';
$ec_lang['lpn_gjnet_note_default_elev']='Estos nodos no indican elevación y tienen la elevación predeterminada, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_elev']='No se eligió ningún campo para la elevación, así que todos los nodos tienen la elevación predeterminada, {value}, y las longitudes automáticas no incluyen diferencia de elevación.';
$ec_lang['lpn_gjnet_note_default_demand']='Estos nudos no indican demanda base y tienen la demanda base predeterminada, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_demand']='No se eligió ningún campo para la demanda base, así que todos los nudos tienen la demanda base predeterminada, {value}.';
$ec_lang['lpn_gjnet_note_default_diameter']='Estas tuberías no indican diámetro y tienen el diámetro predeterminado, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_diameter']='No se eligió ningún campo para el diámetro, así que todas las tuberías tienen el diámetro predeterminado, {value}.';
$ec_lang['lpn_gjnet_note_default_roughness']='Estas tuberías no indican rugosidad y tienen la rugosidad predeterminada, {value}.';
$ec_lang['lpn_gjnet_note_unmapped_roughness']='No se eligió ningún campo para la rugosidad, así que todas las tuberías tienen la rugosidad predeterminada, {value}.';
$ec_lang['lpn_gjnet_note_default_k']='Estas tuberías no indican coeficiente de pérdida localizada, así que cada una tiene 0, como en un archivo de EPANET que no indica ninguno.';
$ec_lang['lpn_gjnet_note_unmapped_k']='No se eligió ningún campo para el coeficiente de pérdida localizada, así que todas las tuberías tienen 0, como en un archivo de EPANET que no indica ninguno.';
$ec_lang['lpn_gjnet_note_default_tank']='Estos depósitos tienen las profundidades de agua y el diámetro de depósito predeterminados.';
$ec_lang['lpn_gjnet_note_length_auto']='Estas tuberías no indican longitud. Cada longitud se calcula a partir de la línea (Auto).';
$ec_lang['lpn_gjnet_note_unmapped_length']='No se eligió ningún campo para la longitud, así que la longitud de cada tubería se calcula a partir de la línea (Auto).';
$ec_lang['lpn_gjnet_note_value_unread']='Estos valores no son números o no se reconocen, y no se usaron.';
$ec_lang['lpn_gjnet_note_field_skipped']='Estos campos no se importaron, según lo elegido.';
$ec_lang['lpn_gjnet_note_field_custom']='Estos campos se importaron como propiedades personalizadas.';
$ec_lang['lpn_gjnet_note_results']='Los resultados del archivo no se importaron. Calcular los calcula de nuevo.';
$ec_lang['lpn_gjnet_note_demand_rows']='Estos nudos tenían más de una fila de demanda. Un archivo GeoJSON contiene solo la primera, que fue la que se importó.';
$ec_lang['lpn_gjnet_note_pipe_type']='Estas tuberías indican el tipo de tubería que aparece entre paréntesis, cuya definición un archivo GeoJSON no contiene. El tipo de tubería no se importó; el diámetro y la rugosidad indicados en el archivo sí.';
$ec_lang['lpn_gjnet_note_pattern_conflict']='Estos patrones se indican con multiplicadores distintos en distintas entidades. Se usó el primero.';
$ec_lang['lpn_gjnet_note_end_off_node']='La línea de cada una de estas líneas de red no empieza ni termina en su nodo. Se usó la posición del nodo.';
$ec_lang['lpn_gjnet_note_not_held']='Un archivo GeoJSON no contiene controles, reglas, ajustes de tiempo, textos, opciones de EPANET ni las bibliotecas de tipos de tubería, accesorios y curvas de eficiencia, así que no se importó ninguno de estos elementos.';
$ec_lang['lpn_geojson_import_done']='{n} Figuras importadas de {file}.';
$ec_lang['lpn_geojson_import_done_one']='Una Figura importada de {file}.';
$ec_lang['lpn_geojson_import_renamed']='{n} nombres de entidad no se pueden usar como ID de Figura. A cada Figura se le dio otro ID y conserva su nombre de entidad: {list}.';
$ec_lang['lpn_geojson_import_renamed_one']='Un nombre de entidad no se puede usar como ID de Figura. A la Figura se le dio otro ID y conserva su nombre de entidad: {list}.';
$ec_lang['lpn_geojson_import_skipped']='{n} entidades no importadas: {list}.';
$ec_lang['lpn_geojson_import_skipped_one']='Una entidad no importada: {list}.';
$ec_lang['lpn_geojson_import_why_network']='elemento de red';
$ec_lang['lpn_geojson_import_why_geometry']='no es un punto, una línea ni un polígono';
$ec_lang['lpn_geojson_import_why_position']='posición que no es una latitud y longitud válidas';
$ec_lang['lpn_geojson_import_holes']='{n} huecos de polígono no importados. Una Figura tiene un solo contorno.';
$ec_lang['lpn_geojson_import_holes_one']='Un hueco de polígono no importado. Una Figura tiene un solo contorno.';
$ec_lang['lpn_geojson_import_parts']='{n} entidades multiparte importadas como una Figura por cada parte.';
$ec_lang['lpn_geojson_import_parts_one']='Una entidad multiparte importada como una Figura por cada parte.';
$ec_lang['lpn_geojson_import_local']='Las posiciones de GeoJSON son latitud y longitud, y este proyecto no tiene ubicación sobre la Tierra a la que se puedan convertir. Primero georreferéncielo con Mapa, Mapa mundial, Adjuntar, y luego importe de nuevo.';
$ec_lang['lpn_geojson_import_unreadable']='{file} no es un archivo GeoJSON: {detail}';
$ec_lang['lpn_file_import_dxf']='Importar figuras DXF…';
$ec_lang['lpn_file_import_dxf_tip']='Leer los puntos, las líneas y las polilíneas de un archivo DXF ASCII en este proyecto como Figuras, conservando el nombre de cada capa como propiedad. Las demás entidades se cuentan y se enumeran, no se importan. Las coordenadas se leen como la X y la Y de este proyecto, sin conversión.';
$ec_lang['lpn_file_import_shp']='Importar figuras de shapefile…';
$ec_lang['lpn_file_import_shp_tip']='Leer los puntos, las líneas y los polígonos de un shapefile de ESRI en este proyecto como Figuras, conservando las columnas de atributos como propiedades. Seleccione el .zip, o bien el .shp junto con sus archivos .shx, .dbf y .prj (mantenga presionada la tecla Ctrl o Mayús para seleccionar varios). Las coordenadas de un sistema de coordenadas distinto del del proyecto se convierten, y el aviso lo indica.';
$ec_lang['lpn_dxf_import_skipped']='{n} entidades no importadas: {list}.';
$ec_lang['lpn_dxf_import_skipped_one']='Una entidad no importada: {list}.';
$ec_lang['lpn_dxf_import_inblocks']='en definiciones de bloque';
$ec_lang['lpn_dxf_import_bulge']='{n} polilíneas tienen segmentos de arco, que se importaron como segmentos rectos entre sus vértices.';
$ec_lang['lpn_dxf_import_bulge_one']='Una polilínea tiene segmentos de arco, que se importaron como segmentos rectos entre sus vértices.';
$ec_lang['lpn_dxf_import_units']='El dibujo indica sus unidades como {theirs} y este proyecto usa {ours}. Los números no se cambiaron.';
$ec_lang['lpn_dxf_import_refuse_geo']='Un dibujo DXF es plano, y este proyecto está en latitud y longitud, así que las coordenadas de {file} no tienen lugar en él. Use Convertir como… para copiar el proyecto a un sistema de coordenadas, y luego importe de nuevo.';
$ec_lang['lpn_dxf_import_unreadable']='{file} no es un archivo DXF ASCII.';
$ec_lang['lpn_dxf_import_binary']='{file} es un DXF binario. Guárdelo desde su programa CAD como DXF ASCII y luego importe de nuevo.';
$ec_lang['lpn_shapes_import_frame']='Las coordenadas se leyeron como {frame}, sin conversión.';
$ec_lang['lpn_shapes_frame_xy']='la X y la Y de este proyecto';
$ec_lang['lpn_shapes_frame_latlon']='latitud y longitud';
$ec_lang['lpn_shp_import_skipped']='{n} registros no importados, porque su tipo de figura no se lee: {list}.';
$ec_lang['lpn_shp_import_skipped_one']='Un registro no importado, porque su tipo de figura no se lee: {list}.';
$ec_lang['lpn_shp_import_attrs']='Columnas de atributos conservadas como propiedades de cada Figura: {list}.';
$ec_lang['lpn_shp_import_noprj']='No hay un archivo .prj, así que las coordenadas se leyeron como {frame}, sin conversión.';
$ec_lang['lpn_shp_import_prj_same']='El .prj indica {crs}, el sistema de coordenadas de este proyecto, así que las coordenadas no se cambiaron.';
$ec_lang['lpn_shp_import_converted']='Las coordenadas son latitud y longitud. Se convirtieron a {crs} con la transformación que usa el mapa.';
$ec_lang['lpn_shp_import_prj_other']='El .prj indica {theirs}. Este proyecto no indica ningún sistema de coordenadas, así que las coordenadas se leyeron como {frame}, sin conversión.';
$ec_lang['lpn_shp_import_refuse_local']='{file} está en latitud y longitud, y este proyecto no tiene ubicación sobre la Tierra a la que se puedan convertir. Primero georreferéncielo con Mapa, Mapa mundial, Adjuntar, y luego importe de nuevo.';
$ec_lang['lpn_shp_import_refuse_crs']='{file} indica {theirs}, y este proyecto está en {ours}. No se importó nada y no se convirtió nada.';
$ec_lang['lpn_shp_import_refuse_range']='{file} no tiene un archivo .prj, y sus coordenadas no son latitudes y longitudes, así que no se pueden colocar en este proyecto.';
$ec_lang['lpn_shp_import_noshp']='{file} no contiene ningún archivo .shp. Seleccione el .zip de un shapefile, o bien el .shp junto con sus archivos .shx, .dbf y .prj (mantenga presionada la tecla Ctrl o Mayús para seleccionar varios).';
$ec_lang['lpn_shp_import_manyshp']='{file} contiene más de un shapefile. Importe uno a la vez.';
$ec_lang['lpn_shp_import_unreadable']='{file} no es un shapefile que esta página pueda leer: {detail}';
$ec_lang['lpn_shp_import_pick_hint']='Un shapefile consta de varios archivos. Seleccione el .shp junto con sus archivos .shx, .dbf y .prj (mantenga presionada la tecla Ctrl o Mayús para seleccionar varios), o seleccione el .zip.';
$ec_lang['lpn_shp_import_webmerc_ask']='{file} no tiene un archivo .prj, y sus números no son latitudes y longitudes, pero concuerdan con metros Web Mercator (EPSG:3857), el sistema que usan QGIS y los mapas web. ¿Importarlos como EPSG:3857 y convertirlos a este proyecto?';
$ec_lang['lpn_shp_import_webmerc_ok']='Importar como EPSG:3857';
$ec_lang['lpn_shp_import_webmerc_far_ask']='{file} indica {theirs}, y leídas en ese sistema sus coordenadas caen a {km} km de este proyecto. Leídas como metros Web Mercator (EPSG:3857), el sistema que usan QGIS y los mapas web, caen donde está este proyecto. ¿Importarlas como EPSG:3857 y convertirlas a este proyecto?';
$ec_lang['lpn_shp_import_reprojected']='Las coordenadas se convirtieron de {theirs} a {ours}.';
$ec_lang['lpn_shp_import_unplaced']='{n} registros tienen coordenadas que este proyecto no puede ubicar, como una latitud más allá del límite del mapa. Números de registro: {list}.';
$ec_lang['lpn_shp_import_unplaced_one']='Un registro tiene coordenadas que este proyecto no puede ubicar, como una latitud más allá del límite del mapa. Número de registro: {list}.';
$ec_lang['lpn_shapes_import_none']='No se importó nada de {file}.';
$ec_lang['lpn_shp_import_convert_hint']='Use Convertir como… para copiar el proyecto a {theirs}, y luego importe de nuevo.';
$ec_lang['lpn_shp_import_damaged']='{file} está dañado o truncado, así que no se importó nada.';
$ec_lang['lpn_shp_import_deleted']='{n} registros marcados como eliminados en el .dbf no se importaron.';
$ec_lang['lpn_shp_import_deleted_one']='Un registro marcado como eliminado en el .dbf no se importó.';
$ec_lang['lpn_dxf_import_paperspace']='en el espacio papel';
$ec_lang['lpn_shapes_import_more']='y {n} más';
$ec_lang['lpn_survey_read_error']='Ese archivo no se pudo leer de su disco.';
$ec_lang['lpn_survey_cancelled']='No se creó nada y no se cambió nada.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Norte';
$ec_lang['lpn_survey_axis_east']='Este';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Ese archivo no tiene nada.';
$ec_lang['lpn_survey_err_unreadable']='Ese archivo no se pudo leer como una lista de puntos topográficos.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Más de una columna de ese archivo podría ser el {axis} ({detail}), y esta página no elige entre ellas. Deje solo una de ellas nombrada como el {axis} e inténtelo de nuevo.';
$ec_lang['lpn_survey_err_no_points']='Ni una sola fila de ese archivo se pudo leer como un punto topográfico. Filas leídas: {detail}';
// THE FILE FORMAT CHOOSER (Tom, 2026-09-17: "We will need to include a file format chooser
// (PNEZD, PENZD, or whatever format is useful for Declan."). PNEZD and PENZD are the same five
// columns and differ only in which coordinate comes first, and the trade has at least eight named
// orderings between them. The QUESTION is asked in plain words and the trade name only identifies
// the answer, because the person holding the file knows what is in each column and may well not
// know which acronym puts the northing first.
//
// A file whose first line names its own columns is read from those names and the chooser is left
// alone. Nothing is ever worked out from the size of the numbers: that is right on the file it was
// tried against and wrong on the next one.
$ec_lang['lpn_survey_format_label']='Formato de archivo:';
$ec_lang['lpn_survey_format_internal']='especificado internamente';
$ec_lang['lpn_survey_create']='Crear nudos';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='Se omitió la primera línea: no nombra ninguna columna que esta página reconozca.';
$ec_lang['lpn_survey_type_label']='Tipo de elemento:';
$ec_lang['lpn_survey_confirm_junction']='Se encontraron {n} nudo(s). ¿Continuar?';
$ec_lang['lpn_survey_confirm_reservoir']='Se encontraron {n} embalse(s). ¿Continuar?';
$ec_lang['lpn_survey_confirm_tank']='Se encontraron {n} depósito(s). ¿Continuar?';
$ec_lang['lpn_survey_report_junction']='{n} nudo(s) importado(s), {m} con elevación.';
$ec_lang['lpn_survey_report_reservoir']='{n} embalse(s) importado(s), {m} con elevación.';
$ec_lang['lpn_survey_report_tank']='{n} depósito(s) importado(s), {m} con elevación.';
$ec_lang['lpn_survey_report_clean']='Todos los puntos del archivo se importaron sin cambios.';
$ec_lang['lpn_survey_report_notes']='Errores y notas de importación:';
$ec_lang['lpn_survey_sev_error']='error';
$ec_lang['lpn_survey_sev_warning']='advertencia';
$ec_lang['lpn_survey_note_line']='Línea {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Muy pocas columnas para el formato de archivo indicado arriba.';
$ec_lang['lpn_survey_note_coord_missing']='La celda {axis} está vacía.';
$ec_lang['lpn_survey_note_bad_coord']='El {axis} no se lee como un número.';
$ec_lang['lpn_survey_note_coord_range']='El {axis} está fuera del rango que permite este proyecto.';
$ec_lang['lpn_survey_note_bad_elev']='Elevación no numérica. Importado sin elevación.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Más de una columna podría ser la elevación, así que ninguna se leyó.';
$ec_lang['lpn_survey_note_blank_rows']='Líneas en blanco omitidas: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Nombre ya usado antes en este archivo, se asignó un nombre nuevo.';
$ec_lang['lpn_survey_note_id_taken']='Nombre ya existente en el proyecto, se asignó un nombre nuevo.';
$ec_lang['lpn_survey_note_id_invalid']='Nombre no se puede usar aquí, se asignó un nombre nuevo.';
// Field codes (Task 771): the Description read as Carlson-style codes. See dev/survey-codes.md.
$ec_lang['lpn_survey_codes_toggle']='Leer la descripción como códigos de campo';
$ec_lang['lpn_survey_codes_tip']='Lea la primera palabra de cada descripción como un código de la tabla. Los puntos con el mismo código de línea se unen en una tubería, en el orden del archivo, y WL1 y WL2 son líneas distintas. +0 inicia una línea, -0 la termina y CLO la cierra. JPN seguido del nombre de un punto se une a ese punto (Carlson), y Civil 3D lo escribe CPN.';
$ec_lang['lpn_survey_codes_col_code']='Código';
$ec_lang['lpn_survey_codes_col_type']='Tipo de elemento';
$ec_lang['lpn_survey_codes_add']='Agregar código';
$ec_lang['lpn_survey_codes_remove']='Quitar código';
$ec_lang['lpn_survey_confirm_coded']='Se encontraron {j} nudo(s), {r} embalse(s), {t} depósito(s) y {p} tubería(s). ¿Continuar?';
$ec_lang['lpn_survey_report_coded']='Se importaron {j} nudo(s), {r} embalse(s), {t} depósito(s) y {p} tubería(s), {m} de los nodos con elevación.';
$ec_lang['lpn_survey_note_code_unknown']='Código que no está en la tabla de códigos, importado como el tipo de elemento elegido arriba.';
$ec_lang['lpn_survey_note_code_two_nodes']='Hay más de un código de nodo, se usó el primero.';
$ec_lang['lpn_survey_note_code_unread']='No todas las palabras son códigos que esta página lee, se conservaron en la descripción.';
$ec_lang['lpn_survey_note_vertex_text']='No todas las palabras son códigos que esta página lee, y un vértice no conserva descripción.';
$ec_lang['lpn_survey_note_join_missing']='JPN o CPN nombra un punto que no está en este archivo ni en el proyecto, no se dibujó tubería para él.';
$ec_lang['lpn_survey_note_join_no_line']='JPN o CPN en un punto sin código de línea, no se dibujó tubería para él.';
$ec_lang['lpn_survey_note_pipe_one_node']='Esta línea vuelve al mismo nodo sin otro nodo en medio, no se dibujó tubería para ella.';
$ec_lang['lpn_survey_note_line_one_point']='Único punto de su línea, no se dibujó tubería desde él.';
$ec_lang['lpn_survey_note_vertices']='Puntos que pasaron a ser vértices de tubería: {detail}. Un vértice no conserva nombre, elevación ni descripción.';
$ec_lang['lpn_survey_note_no_desc']='Los códigos de campo están activados, pero este archivo no tiene columna de descripción, así que no se leyó ningún código.';
$ec_lang['lpn_survey_note_ring_junction']='Este punto pasó a ser un nudo para que el anillo pudiera cerrarse.';
$ec_lang['lpn_survey_note_pipe_zero_length']='Este punto está en el mismo lugar que el nodo anterior, así que la tubería entre ellos no tiene longitud.';
$ec_lang['lpn_survey_note_node_on_pipe']='Este punto está exactamente sobre una tubería a la que no está unido. Si están conectados, agregue JPN para indicarlo.';
$ec_lang['lpn_settings_demand_model']='Modelo de demanda';
$ec_lang['lpn_settings_demand_model_tip']='Elija cómo reciben caudal los nudos. En el modelo impulsado por la demanda (DDA), cada demanda se entrega completa, sea cual sea la presión. En el modelo impulsado por la presión (PDA), se entrega menos que la demanda donde la presión es inferior a la presión requerida, y solo el solucionador de EPANET lo calcula.';
$ec_lang['lpn_settings_demand_model_dda']='Impulsado por la demanda';
$ec_lang['lpn_settings_demand_model_pda']='Impulsado por la presión';
$ec_lang['lpn_settings_min_pressure']='Presión mínima';
$ec_lang['lpn_settings_min_pressure_tip']='Ingrese la presión igual o inferior a la cual un nudo no recibe caudal. Use la unidad de presión de este proyecto.';
$ec_lang['lpn_settings_req_pressure']='Presión requerida';
$ec_lang['lpn_settings_req_pressure_tip']='Ingrese la presión igual o superior a la cual un nudo recibe su demanda completa. Debe ser mayor que la presión mínima. Use la unidad de presión de este proyecto. Déjela en blanco para usar el valor predeterminado de EPANET, que está en psi para unidades de caudal de EE. UU. y en metros en los demás casos.';
$ec_lang['lpn_settings_pressure_exponent']='Exponente de presión';
$ec_lang['lpn_settings_pressure_exponent_tip']='Ingrese el exponente de la curva que sube desde caudal nulo a la presión mínima hasta la demanda completa a la presión requerida.';
$ec_lang['lpn_engine_pda_route']='Resuelto con el solucionador de EPANET, porque el modelo de demanda es impulsado por la presión.';
$ec_lang['lpn_diag_pda_needs_epanet']='El modelo de demanda es impulsado por la presión, y solo el solucionador de EPANET puede calcularlo. No se pudo cargar el solucionador de EPANET, así que faltan estos resultados.';
$ec_lang['lpn_result_delivered_demand']='Demanda entregada';
$ec_lang['lpn_result_delivered_demand_tip']='El caudal que este nudo recibe realmente con el modelo de demanda impulsado por la presión. Es menor que la demanda cuando la presión es inferior a la presión requerida.';
$ec_lang['lpn_result_demand_deficit']='Déficit de demanda';
$ec_lang['lpn_result_demand_deficit_tip']='La parte de la demanda de este nudo que no se entrega, porque la presión es inferior a la presión requerida.';
$ec_lang['lpn_pda_deficit_note']='Nudos que reciben menos que su demanda: {n}.';
$ec_lang['lpn_diag_pda_pressures']='La presión requerida debe ser mayor que la presión mínima. Cambie una de ellas en Configuración.';
$ec_lang['lpn_inp_drop_pressure_unit']='Este archivo indica una unidad de presión distinta de la que esta página lee para su unidad de caudal, que es psi para unidades de EE. UU. y metros en los demás casos. Toda presión del archivo se lee así, por lo que debe revisar los ajustes de válvulas, los emisores y los límites del modelo impulsado por la presión que contiene. La línea se conserva y se vuelve a escribir.';

// Map > Screenshot (Tom, 2026-10-05): a snipping tool that re-draws the dragged map area larger than its screen size (3x unless the Screenshot box says otherwise).
$ec_lang['lpn_screenshot_menu']='Captura de pantalla';
$ec_lang['lpn_screenshot_tip']='Tome una imagen del área del mapa que arrastre, con mayor resolución que la pantalla. Anótela y luego cópiela a un informe con el botón Copiar. Haga clic sin arrastrar para tomar el mapa completo.';
$ec_lang['lpn_screenshot_hint']='Arrastre un rectángulo sobre el mapa, o haga clic para tomar el mapa completo. Esc cancela.';
$ec_lang['lpn_screenshot_copied']='Captura de pantalla copiada.';
$ec_lang['lpn_screenshot_saved']='El portapapeles no está disponible aquí, así que la captura de pantalla se descargó como archivo PNG.';
$ec_lang['lpn_screenshot_no_basemap']='No se pudo incluir el mapa de calles ni la imagen satelital.';
$ec_lang['lpn_screenshot_failed']='No se pudo hacer la captura de pantalla.';
$ec_lang['lpn_snip_hint_free']='Arrastre alrededor del área que desea recortar, o haga clic para tomar el mapa completo. Esc cancela.';
$ec_lang['lpn_snip_tip_rect']='Recortar un rectángulo (S)';
$ec_lang['lpn_snip_tip_free']='Recortar una forma libre (S)';
$ec_lang['lpn_snip_tip_mode']='Forma del recorte';
$ec_lang['lpn_snip_tip_map']='Captura de pantalla del mapa completo';
$ec_lang['lpn_snip_tip_pen']='Lápiz';
$ec_lang['lpn_snip_tip_eraser']='Borrador: haga clic en un trazo para quitarlo (E)';
$ec_lang['lpn_snip_tip_undo']='Deshacer (Ctrl+Z)';
$ec_lang['lpn_snip_tip_redo']='Rehacer (Ctrl+Y)';
$ec_lang['lpn_snip_tip_copy']='Copiar (Ctrl+C)';
$ec_lang['lpn_screenshot_scale_tip']='El tamaño de la imagen como múltiplo del área en pantalla. Una escala mayor es más nítida y produce un archivo más grande.';
