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
$ec_lang['u_gradePercent']='% vert./horiz.';
$ec_lang['u_grade']='vert./horiz.';
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
// **IT SAYS "COOKIE" BECAUSE THAT IS THE WORD PEOPLE KNOW** (Tom, 2026-09-09, watching a
// first-time reader: *"We should use the word 'cookie'. 'May we save a one-digit cookie...?' That
// is the word people know."*). "One digit in this browser" was accurate and taught nobody what was
// being asked; a reader who has met a hundred cookie banners knows instantly what this one is
// about, and can then notice that this one is asking for far less than the others did.
//
// **AND IT IS STILL LITERALLY TRUE, which is the only reason the word is allowed here.** What is
// stored IS a cookie, and it holds one base-32 digit per page visited -- five bits, maximum 31.
// The arithmetic is in lib/config.inc.php beside the bits themselves. If that ever stops being one
// digit, this sentence is the thing that has to change first.
//
// NO EC_CONSENT_VERSION BUMP. Nothing about what is stored, who reads it or how long it lives has
// moved; the sentence became more accurate, not different. Bumping would re-ask every visitor who
// has already answered, for no change they could act on.
$ec_lang['consent_body']='¿Podemos guardar una cookie de un solo dígito en este navegador para recordar que ya contamos esta página? No registra nada sobre usted ni nada de lo que escriba. Sin ella, no podemos distinguir su segunda visita de la primera visita de otra persona.';
$ec_lang['consent_accept']='Aceptar';
$ec_lang['consent_accept_all']='Aceptar siempre';
$ec_lang['consent_decline']='Rechazar siempre';
$ec_lang['consent_current_granted']='Usted permitió esto. Limitamos el registro para este perfil de navegador.';
$ec_lang['consent_current_denied']='Usted rechazó esto. No guardamos nada para limitar el registro de este perfil de navegador.';
$ec_lang['consent_region_label']='Su elección sobre limitar el registro.';
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
$ec_lang['points_data_copy']='Copiar';
$ec_lang['points_data_paste']='Pegar';
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
$ec_lang['dw_main_menu']='Pérdida de carga en tubería según Darcy-Weisbach';
$ec_lang['dw_main_title']='Calculadora gratis en línea de pérdida de carga en tubería según Darcy-Weisbach';
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
$ec_lang['hw_hgl_1']='HGL aguas abajo';
$ec_lang['hw_hgl_2']='HGL aguas arriba';
$ec_lang['hw_elev_up']='Elevación aguas arriba';
$ec_lang['hw_pressure_up']='Presión aguas arriba';
$ec_lang['hw_elev_down']='Elevación aguas abajo';
$ec_lang['hw_pressure_down']='Presión aguas abajo';
$ec_lang['hw_pressure_check']='Verificación de presión';
$ec_lang['hw_pressure_ok_short']='Presión positiva';
$ec_lang['hw_pressure_neg_short']='Presión negativa';
$ec_lang['hw_pressure_neg']='La presión aguas abajo es menor que cero. El HGL queda por debajo de la tubería, por lo que la tubería no fluiría llena y este resultado puede no ser válido.';
$ec_lang['hw_roughness']='Coeficiente de Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Esta calculadora no representa el perfil de la tubería entre los dos extremos.</dt><dd>Usa solo las elevaciones aguas arriba y aguas abajo que usted ingresa. Si el terreno se eleva por encima de cualquiera de los dos extremos en algún punto intermedio, la presión en ese punto alto es menor que cualquier presión indicada aquí. Vuelva a ejecutar la calculadora para el tramo desde el extremo aguas arriba hasta el punto alto para verificarlo.</dd><dd>Donde el HGL queda por debajo de la tubería, el agua está bajo presión negativa. El aire sale de la solución, una tubería de paredes delgadas puede colapsar, y puede ingresar agua subterránea contaminada a través de las juntas. Mantenga la línea bajo presión positiva en todo su recorrido, y considere una válvula de aire en cada punto alto.</dd><dt>La presión aguas arriba es una condición de frontera que usted proporciona.</dt><dd>Léala en un manómetro, en el nivel de agua de un tanque (la altura de agua sobre la tubería), o en la curva de un bombeo. Un bombeo entrega menos presión a medida que aumenta el caudal, así que use el punto de la curva que corresponda al caudal ingresado arriba.</dd><dt>Sume usted mismo los coeficientes de pérdida localizada.</dt><dd>Sume los valores de K de cada válvula, codo, tee, medidor y entrada en la línea, e ingrese ese total. Siga el enlace de ese campo para ver valores típicos. En una línea de conducción larga estas pérdidas son pequeñas frente a la fricción, pero en tuberías cortas dentro de una estación pueden ser la mayor parte de la pérdida.</dd></dl>';
$ec_lang['hw_notes_epanet_term']='Las constantes de Hazen-Williams ahora coinciden con EPANET (agosto de 2026)';
$ec_lang['hw_notes_epanet_def']='En agosto de 2026 se cambiaron el coeficiente y el exponente de Hazen-Williams para coincidir con EPANET. Los resultados de pérdida de carga difieren de los de las versiones anteriores de esta página hasta en un 0,1 por ciento, mucho menos que la incertidumbre del propio valor de C.';
// Manning Irregular
$ec_lang['mi_menu']='Canal de sección irregular según Manning';
$ec_lang['mi_main_title']='Calculadora gratis en línea de Manning para canal de sección irregular';
$ec_lang['mi_main_desc']='Calculadora de flujo uniforme según Manning para canal de sección irregular';
$ec_lang['mi_waterSurfaceElevation']='Altura de la lámina libre';
$ec_lang['mi_q_617']='<span class="ec-help" title="El caudal compuesto, Q, usando una n compuesta para cada región según Chow 6-17, velocidades iguales">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Puntos de la sección transversal';
$ec_lang['mi_groupPoint']='Punto';
$ec_lang['mi_groupSegment']='Segmento';
$ec_lang['mi_groupRegion']='Región';
$ec_lang['mi_station']='Est.';
$ec_lang['mi_elevation']='Alt.';
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
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Energía cinética expresada como una altura de columna de agua, v²/2g">Carga de velocidad, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Área de flujo, A';
$ec_lang['mpf_pipe_area']='Área de la tubería, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Relación de áreas, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Perímetro mojado, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Radio hidráulico, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Ancho de lámina libre, T';
$ec_lang['mpf_froude_number']='Número de Froude, Fr';
$ec_lang['mpf_shear_stress']='Tensión tangencial promedio, τ';
$ec_lang['mpf_full_flow']='Caudal lleno, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Relación de caudales, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Este es el caudal (y la profundidad) dentro de una tubería <em>de longitud infinita</em>.</dt><dd>Lograr que el caudal entre en la tubería puede requerir una profundidad de agua de entrada (cabezal) bastante mayor. Agregue por lo menos 1,5 veces la carga de velocidad para estimar la profundidad de agua de entrada, o <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">vea mi tutorial de 2 minutos</a> sobre los cálculos estándar de cabezal de entrada en alcantarillas usando <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, el programa gratuito de alcantarillas de la Administración Federal de Carreteras de los Estados Unidos.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>¿Está diseñando un alcantarillado sanitario?</dt><dd>Vea las <a target="_blank" href="/sewslope.php">tablas de pendiente mínima de alcantarillado</a> para tuberías de 4 a 96 pulgadas (100 a 2400 mm), expresadas en m/m, mm/m y porcentaje, y el estudio de <a target="_blank" href="/peakfact.php">factores pico para caudales muy bajos</a>. Ambos son documentos de referencia solo en inglés.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Ingrese un Q objetivo positivo.';
$ec_lang['mpf_solver_no_solution']='Sin solución: Q excede la capacidad de la tubería en y/d0 = 93.8% (Qmax = {qmax} en las unidades seleccionadas).';
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
$ec_lang['mphl_junction_loss']='Pérdida localizada (menor), h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Pérdida total, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='EGL aguas abajo';
$ec_lang['mphl_egl_2']='EGL aguas arriba';
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
$ec_lang['mtc_flow_depth']='Calado de la lámina de agua, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Ángulo de la curva, β</a><span class="ec-help" title="Para el tamaño de roca. Siga el enlace para ver el diagrama."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Densidad relativa al agua. Valor típico ≈ 2,65 para roca triturada">Gravedad específica de la roca, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Tamaño de roca de diseño, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n para el tamaño de roca de diseño según Strickler';
$ec_lang['mtc_n_blodgett']='n para el tamaño de roca de diseño según Blodgett';
$ec_lang['mtc_n_bathurst']='n para el tamaño de roca de diseño según Bathurst';
$ec_lang['mtc_n_pi']='n para el tamaño de roca de diseño según Phillips & Ingersoll';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett frente a Bathurst';
$ec_lang['mtc_pi_range_check']='Verificación de rango P&I';
$ec_lang['mtc_pi_ok']='d50 en rango P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Fuera de rango';
$ec_lang['mtc_pi_tip']='Extrapolación fuera del rango de datos de 0,28–0,36 ft con el que se desarrolló esta ecuación — trátese como una verificación aproximada, no como base de diseño';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Según Isbash (1936) y el condado de Maricopa, Arizona, EE. UU.">Tamaño de roca angular requerido en el fondo, D<sub>50</sub> (Isbash y MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Según Isbash (1936) y el condado de Maricopa, Arizona, EE. UU.">Tamaño de roca angular requerido en el lado 1, D<sub>50</sub> (Isbash y MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Según Isbash (1936) y el condado de Maricopa, Arizona, EE. UU.">Tamaño de roca angular requerido en el lado 2, D<sub>50</sub> (Isbash y MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Calcula esta red en cada paso de tiempo hidráulico.';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Según Maynord, Ruff, y Abt (1989). En una curva, la roca se dimensiona para una velocidad de curva de 4/3 de la media, según el Departamento de Carreteras de California (1970); el valor propio de Maynord de 1.5 se aplica a canales naturales.">Tamaño de roca angular requerido, D<sub>50</sub> (Maynord, Ruff, y Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Tamaño de roca angular requerido, D<sub>50</sub>, según Searcy (1967)';
$ec_lang['mtc_vel_ok']='Velocidad razonable para supuestos de flujo uniforme.';
$ec_lang['mtc_vel_low']='Velocidad baja — riesgo de sedimentación.';
$ec_lang['mtc_vel_high']='La velocidad es elevada y puede no ser realista; verifique la erosión del revestimiento del canal, el tirante adicional en las curvas y la pérdida de energía en expansiones u obstrucciones.';
$ec_lang['mtc_iteration_tip']='Elija una opción de rugosidad (se recomienda Blodgett–Bathurst) y una opción de tamaño de roca (se recomienda Isbash) para iterar automáticamente hacia un tamaño de roca uniforme para su caudal objetivo. Vea las Notas más abajo para el método completo, o ingrese su propio valor de rugosidad (siga el enlace para más orientación) e ignore el tamaño de roca para omitir la iteración.';
$ec_lang['mtc_note_1']='<dl><dt>Iteración automática para diseño de tamaño y rugosidad de roca</dt><dd>Elija una opción de rugosidad (se recomienda Blodgett–Bathurst) y una opción de tamaño de roca de diseño (se recomienda Isbash). Ajuste la profundidad y el factor de seguridad del tamaño de roca para alcanzar su caudal objetivo con un tamaño de roca uniforme. Cada vez que cambie un valor de entrada, la calculadora repite estos pasos: 1. Se calcula la rugosidad a partir del tamaño de roca de diseño. 2. El valor de rugosidad del método que eligió se copia al campo de entrada de rugosidad. 3. Se calculan el caudal del canal y el tamaño de roca requerido. 4. Se ajusta el tamaño de roca de diseño. 5. Se repite hasta que el error en el tamaño de roca de diseño sea muy pequeño.</dd><dt>Calculadora básica (sin iteración)</dt><dd>Ingrese el valor de rugosidad deseado. Ignore el área de entrada del tamaño de roca de diseño.</dd></dl>';
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
$ec_lang['mhp_main_desc']='Calculadora de Potencia de Micro-Hidroeléctrica de Pasada';
$ec_lang['mhp_gross_head']='Carga bruta, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Diámetro de la tubería de presión (tubería de suministro)">Diámetro de la tubería de presión, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Longitud, L';
$ec_lang['mhp_efficiency']='Rendimiento de la instalación, η (0–1)';
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
$ec_lang['install_firefox_body']='Si su navegador no ofrece la opción de instalar, no se pierde nada: use las calculadoras normalmente en el navegador, y después de su primera visita las páginas se guardan en caché automáticamente para uso sin conexión. Firefox en el escritorio es el caso común.';
$ec_lang['install_cached_heading']='Qué se guarda en caché';
$ec_lang['install_cached_body']='La primera vez que instala EngCalcs, todas las páginas de las calculadoras y sus archivos de apoyo (scripts, estilos) se guardan automáticamente en su dispositivo. Después de eso, todo funciona sin conexión a internet. Se recuerda el idioma elegido desde su última visita en línea.';
$ec_lang['contact_main_menu']='Contacto';
$ec_lang['about_main_title']='Acerca de las calculadoras de ingeniería HawsEDC';
$ec_lang['about_main_desc']='Misión, software libre y contribuciones';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Misión</h3><p>Las Calculadoras de Ingeniería HawsEDC se ofrecen gratuitamente en línea desde 2010. Existen para servir a ingenieros y trabajadores de campo en todo el mundo — especialmente a quienes trabajan en regiones con escasez de agua, recursos limitados o poco atendidas. Estas herramientas forman parte de una misión humanitaria más amplia: decirle a cada ser humano de la manera más práctica y efectiva posible <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">que es amado y apreciado para siempre, que no tiene nada que temer y que no va a arruinarlo todo</a>.</p><p>Las calculadoras son el vehículo. El destino es un mundo libre de sufrimiento.</p><h3>Licencia libre y de código abierto</h3><p>Todo el código se publica bajo la <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">Licencia Pública General de GNU v3.0 o posterior</a> — libre como en libertad. Puede usar, estudiar, modificar y redistribuir el código bajo los mismos términos.</p><p>El sitio web que lo sirve se ofrece gratuitamente hoy y desde 2010; si algún día ya no pudiera ser así, el software seguirá siendo suyo para ejecutarlo.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Código Fuente</h3><p>El código fuente completo está disponible públicamente en GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Puede explorar el código, registrar problemas o bifurcar el repositorio allí.</p><h3>Contribuir</h3><p>Toda ayuda es bienvenida. <a href="contact.php">Comuníquese con Tom Haws</a>.</p><ul><li><strong>Traducciones:</strong> Sugiera una mejor redacción. Mejore o agregue un idioma.</li><li><strong>Informes de errores:</strong> Use el formulario de comentarios en cualquier página de calculadora, o registre un problema en GitHub.</li><li><strong>Nuevas calculadoras:</strong> Las ideas para herramientas de ingeniería hidráulica que sirvan a trabajadores de campo y profesionales del riego son especialmente bienvenidas.</li><li><strong>Alojamiento:</strong> Si puede alojar una réplica de estas calculadoras para una región con conectividad limitada, por favor comuníquese conmigo.</li></ul><h3>Uso sin conexión</h3><p>Abra cualquier calculadora una vez mientras tiene conexión y todas seguirán funcionando cuando no la tenga: su navegador almacena todo el conjunto a medida que avanza. El mecanismo es una <strong>Aplicación Web Progresiva (PWA)</strong>, si quiere leer sobre ello. Después de eso, todas las calculadoras funcionan sin conexión — no se requiere internet.</p><p>En Android o iOS, use la opción "Agregar a pantalla de inicio" de su navegador para instalar EngCalcs como una aplicación en su dispositivo. En el escritorio, busque el ícono de instalación en la barra de direcciones de su navegador.</p><p>También puede guardar cualquier calculadora individual usando el menú "Guardar como…" de su navegador para uso sin conexión puntual.</p><h3>Contacto</h3><p>Tom Haws, ingeniero hidráulico y fundador de estas calculadoras.<br />Use el formulario de comentarios en cualquier página de calculadora, o acceda al código fuente en <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
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
$ec_lang['rc_sg']='<span class="ec-help" title="Densidad relativa al agua. Típico para granito o basalto triturado ≈ 2,65. Rango válido según Robinson: 2,54 a 2,82.">Gravedad específica de la roca, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Desviación estándar de gradación. Roca uniforme ≈ 1,25. Rango válido Robinson: 1,15 a 1,47.">Gradación SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="El remanso (Hp > yn) es favorable — reduce la erosión aguas arriba. (USDA)">Tirante normal en el canal de entrada, y<sub>n</sub> <span class="ec-tip">?</span></span>';
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
$ec_lang['rc_Hp']='<span class="ec-help" title="El remanso (Hp > yn) es favorable — reduce la erosión aguas arriba. (USDA)">Carga en el vertedor de entrada, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Verificación de remanso en entrada';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — remanso aguas arriba';
$ec_lang['rc_pond_ok_tip']='El remanso aguas arriba de la entrada del canal es favorable; reduce la erosión aguas arriba. (USDA)';
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
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Marcada: este tramo es un segmento de la lateral de prueba, extraído por emisores individuales. Sin marcar: este tramo es una tubería principal, solo pasando caudal a laterales no en la ruta de prueba.">Lat. <span class="ec-tip">?</span></span>';
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
$ec_lang['bpn_roughness_tip']='Rugosidad de la tubería para el método de fricción seleccionado: n de Manning, C de Hazen-Williams, o altura de rugosidad e de Darcy-Weisbach (una longitud). Tubería de plástico lisa típica: n alrededor de 0,009, C alrededor de 150, e alrededor de 0,0015 mm.';
$ec_lang['bpn_demand']='Demanda';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Caudal fijo entregado en el extremo aguas abajo de este tramo.';
$ec_lang['bpn_demand_mult']='Multiplicador de demanda';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Escala todas las demandas de los tramos a la vez, para un caso de hora pico o de crecimiento futuro. Use 1 para las demandas tal como se ingresaron.';
$ec_lang['bpn_elev_down']='Elev. AA';
$ec_lang['bpn_q_line']='Caudal del tramo';
$ec_lang['bpn_q_line_tip']='Caudal total transportado por este tramo: su propia demanda más toda demanda aguas abajo que alimenta.';
$ec_lang['bpn_p_down']='Pres. AA';
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
$ec_lang['bpn_notes_1_def']='Deje el ID aguas arriba en blanco y un tramo sigue al de arriba; una tubería en serie simple. Ingrese el ID de un tramo aguas arriba para ramificarse desde él. Así: en serie por defecto, un árbol cuando lo necesite.';
$ec_lang['bpn_notes_2_term']='Solo redes ramificadas, sin bucles';
$ec_lang['bpn_notes_2_def']='Cada tramo tiene exactamente un tramo aguas arriba (un árbol). Esta herramienta no resuelve redes con bucles; esas necesitan métodos iterativos (EPANET o similar). Excluir los bucles es lo que la mantiene simple y exacta.';
$ec_lang['bpn_notes_3_term']='Sin controles de presión activos';
$ec_lang['bpn_notes_3_def']='Puede agregar una válvula de pérdida localizada fija (un valor k), pero no válvulas reductoras o sostenedoras de presión (PRV/PSV). Su estado abierto/cerrado depende del caudal y la presión, lo que forzaría la iteración.';
$ec_lang['bpn_notes_epanet_term']='Las constantes de Hazen-Williams ahora coinciden con EPANET (agosto de 2026)';
$ec_lang['bpn_notes_epanet_def']='En agosto de 2026 se cambiaron el coeficiente y el exponente de Hazen-Williams para coincidir con EPANET. Los resultados de pérdida de carga difieren de los de las versiones anteriores de esta página hasta en un 0,1 por ciento, mucho menos que la incertidumbre del propio valor de C.';
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
$ec_lang['lpn_tool_add_meter_tip']='Haga clic donde está el cliente y luego en la tubería o el nudo que lo abastece. La demanda que asigne al cliente se suma al nudo del extremo más cercano de esa tubería.';
$ec_lang['lpn_mode_add_meter']='Cliente: haga clic donde está el cliente y luego en la tubería o el nudo que lo abastece. O use Esc para cancelar.';
$ec_lang['lpn_pane_tab_customers']='Clientes';
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
$ec_lang['lpn_field_meter_total_tip']='La demanda por servicio multiplicada por el número de servicios. Este es el número que se suma al nudo indicado abajo.';
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
$ec_lang['lpn_meter_placed']='Se agregó el cliente {id}. Su descripción y demanda se escriben en la tabla Clientes, o presiónelo en Seleccionar para abrir su cuadro.';
$ec_lang['lpn_field_meter_pipe_tip']='El elemento al que se conecta este servicio. Escriba otro aquí o en la tabla Clientes para cambiarlo, o arrastre el punto de conexión a otro elemento.';
$ec_lang['lpn_field_meter_station']='Estación a lo largo de la tubería (%)';
$ec_lang['lpn_field_meter_station_tip']='A qué distancia a lo largo de la tubería se conecta el servicio, como porcentaje de la tubería desde su primer nudo hasta el segundo. 0 está en un extremo y 100 en el otro. El círculo sobre la tubería hace lo mismo con el puntero.';
$ec_lang['lpn_field_meter_offset']='Desplazamiento desde la tubería';
$ec_lang['lpn_field_meter_offset_tip']='Positivo es a la derecha de la tubería mirando desde su primer nudo hacia el segundo. Escribir un valor aquí puede mover el cliente al otro lado de la tubería principal, y siempre traza la línea de servicio en ángulo recto con la principal.';
$ec_lang['lpn_field_meter_lumped']='Agregado al nudo';
$ec_lang['lpn_field_meter_lumped_tip']='Nudo más cercano; las demandas de este cliente se suman allí.';
$ec_lang['lpn_node_customers']='Demandas de clientes';
$ec_lang['lpn_node_customers_tip']='Lista de clientes agregados en este nudo (por ser el más cercano). Las demandas de clientes se suman a las demás demandas indicadas aquí. Un cliente se edita donde está en el mapa o en la tabla Clientes.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} de {n} clientes';
$ec_lang['lpn_customer_detached']='⚠ Este cliente no está conectado a una tubería, así que su demanda no está en los resultados. Elimínelo, o dibuje una tubería y mueva el cliente sobre ella.';
$ec_lang['lpn_customer_fixed_head']='⚠ El extremo cercano de esa tubería tiene una superficie de agua fija, así que esta demanda no afecta la simulación.';
$ec_lang['lpn_customer_detached_count']='{n} clientes no están conectados a una tubería. Su demanda no se contabiliza.';
$ec_lang['lpn_meter_pick_pipe']='Ahora haga clic en la tubería o el nudo que abastece a este cliente. El cliente permanece donde lo colocó. Presione Escape para cancelar.';
$ec_lang['lpn_inp_export_flat_customers']='Un archivo EPANET no tiene clientes. La demanda de los {n} clientes de este proyecto pasa al archivo como una fila de demanda en el nudo al que se agregó cada uno, y cada fila se nombra con la etiqueta del cliente. Lo que el archivo no puede conservar es el cliente: dónde está, qué tubería lo abastece, en qué punto de esa tubería se conecta el servicio, y cuántos servicios representa un cliente. Su propio archivo de proyecto conserva todo eso.';

$ec_lang['lpn_area_hint_window_start']='Haga clic en una esquina de la ventana.';
$ec_lang['lpn_area_hint_window_go']='Haga clic en la esquina opuesta para terminar.';
$ec_lang['lpn_area_hint_lasso_start']='Haga clic para empezar el contorno.';
$ec_lang['lpn_area_hint_lasso_go']='Mueva el puntero para dibujar el contorno. Haga clic para terminar.';
$ec_lang['lpn_area_hint_polygon_start']='Haga clic para dibujar el área del polígono. Haga doble clic para terminar.';
$ec_lang['lpn_area_hint_polygon_go']='Haga clic en cada esquina. Haga doble clic en la última para terminar.';
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
$ec_lang['lpn_pane_pasted']='Se pegaron {n} celdas. {skipped} no se modificaron.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='Se pegaron {n} filas y se agregaron {created} de ellas a la red.';
$ec_lang['lpn_pane_pasted_rows_skipped']='Se pegaron {n} filas y se agregaron {created} de ellas a la red. {skipped} celdas no se modificaron.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Haga clic aquí y pegue filas de una hoja de cálculo para agregarlas.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Pegar como filas nuevas al final de la tabla';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Presione Ctrl+V para agregar las filas copiadas al final de esta tabla. Presione Esc para cancelar.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Este pegado tiene {n} filas, y {fit} de ellas caben en la tabla. ¿Agregar las otras {extra} como filas nuevas al final?';
$ec_lang['lpn_pane_paste_overflow_add']='Agregar {extra} filas';
$ec_lang['lpn_pane_paste_overflow_fit']='Pegar solo las {fit} que caben';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Este pegado tiene {n} filas, y {fit} de ellas caben en la tabla. Las otras {extra} no se pueden agregar como filas nuevas: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} ID no coinciden. ¿Pegar de todos modos?';
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
$ec_lang['lpn_pane_paste_no_customer_ref']='Fila {row}: un Cliente nuevo necesita una tubería o un nudo conectado.';
$ec_lang['lpn_pane_paste_no_pipe']='Fila {row}: la tubería {id} todavía no existe. Pegue primero sus tuberías, y luego sus clientes.';
$ec_lang['lpn_pane_paste_no_customer_node']='Fila {row}: el nudo {id} todavía no existe. Pegue primero sus nudos, y luego sus clientes.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Fila {row}: el nudo {id} no tiene ninguna tubería a la que un Cliente pueda conectarse.';


$ec_lang['lpn_pane_filled']='Se rellenaron hacia abajo {n} celdas. {skipped} no se modificaron.';
$ec_lang['lpn_pane_filldown']='Rellenar hacia abajo';
$ec_lang['lpn_pane_fill_none']='Nada en esta selección se puede rellenar hacia abajo.';
$ec_lang['lpn_pane_ctrlenter_filled']='Se rellenaron {n} celdas. {skipped} no se modificaron.';
$ec_lang['lpn_pane_hide_col']='Ocultar esta columna';
$ec_lang['lpn_pane_hide_cols']='Ocultar estas columnas';
$ec_lang['lpn_pane_show_all_cols']='Mostrar todas las columnas';
$ec_lang['lpn_pane_sort_asc']='Ordenar ascendente';
$ec_lang['lpn_pane_manage_cols']='Administrar columnas…';
$ec_lang['lpn_pane_manage_cols_title']='Administrar columnas';
$ec_lang['lpn_pane_manage_cols_show']='Mostrar';
$ec_lang['lpn_pane_manage_cols_up']='Subir';
$ec_lang['lpn_pane_manage_cols_down']='Bajar';
$ec_lang['lpn_pane_manage_cols_top']='Mover al principio';
$ec_lang['lpn_pane_manage_cols_bottom']='Mover al final';
$ec_lang['lpn_pane_colmenu_tip']='Ocultar o administrar columnas';
$ec_lang['lpn_tool_area_window']='Seleccionar una ventana';
$ec_lang['lpn_tool_area_lasso']='Seleccionar un lazo';
$ec_lang['lpn_tool_area_polygon']='Seleccionar un polígono';
$ec_lang['lpn_tool_delete']='Eliminar';
$ec_lang['lpn_tool_zoom_extent']='Ver todo';
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
// It's a technical term. We can only give a definition, which is not our job."). $ec_lang_syn holds
// phrases that could STAND ON THE CONTROL in place of the label; a technical term has no such
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
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
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
$ec_lang['lpn_tank_elev_tip']='Elevación del fondo del depósito. Las profundidades de agua en el depósito se miden hacia arriba desde aquí.';
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
$ec_lang['lpn_tank_head_tip']='Elevación de la superficie del agua en el depósito: la elevación del fondo del depósito más la profundidad de agua. Este es el nivel que usa el solucionador para el depósito.';
$ec_lang['lpn_close']='Cerrar';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Propiedades';
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
$ec_lang['lpn_examples_heading']='Abra su propia copia de un ejemplo';
$ec_lang['lpn_examples_sub']='Cada uno se abre como su propia copia. Cámbielo, guárdelo, o abra una copia nueva y empiece de nuevo.';
$ec_lang['lpn_examples_open']='Abrir';
$ec_lang['lpn_examples_menu']='Abrir ejemplo…';
$ec_lang['lpn_examples_blank']='O empiece aquí';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Nodos: {nodes}, líneas: {links}';
$ec_lang['lpn_examples_failed']='No se pudieron cargar los ejemplos. Use Archivo, Nuevo proyecto para empezar un dibujo.';
$ec_lang['lpn_examples_loading']='Cargando ejemplos…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Corregir algo';
$ec_lang['lpn_help_notes']='Notas sobre esta página';
$ec_lang['lpn_help_hotkeys']='Tablas y atajos de teclado';
$ec_lang['lpn_hotkeys_tables_heading']='Tablas';
$ec_lang['lpn_hotkeys_map_heading']='Mapa';
$ec_lang['lpn_hotkeys_map_term']='Atajos de teclado del mapa';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 o Esc</td><td>Seleccionar.</td></tr><tr><td>2</td><td>Agregar un nudo.</td></tr><tr><td>3</td><td>Agregar un embalse.</td></tr><tr><td>4</td><td>Agregar un depósito.</td></tr><tr><td>5</td><td>Agregar una tubería.</td></tr><tr><td>6</td><td>Agregar una bomba.</td></tr><tr><td>7</td><td>Agregar una válvula.</td></tr><tr><td>8</td><td>Agregar un cliente.</td></tr><tr><td>9</td><td>Agregar texto.</td></tr><tr><td>Delete</td><td>Eliminar la selección.</td></tr><tr><td>Ctrl+Z</td><td>Deshacer el último cambio.</td></tr><tr><td>+ o =</td><td>Acercar.</td></tr><tr><td>-</td><td>Alejar.</td></tr></tbody></table>';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Mayús+letra</td><td>Abre el menú con esa letra; luego presione la letra de una fila para elegirla. Las letras se muestran mientras usa el teclado. En un Mac, use Ctrl+Opción.</td></tr><tr><td>F10</td><td>Ir a la barra de menús.</td></tr></tbody></table>';
$ec_lang['lpn_hotkeys_menu_term']='Atajos de teclado de los menús';
$ec_lang['lpn_hotkeys_menu_heading']='Menús';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='¿Algo está mal aquí?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Un solo clic nos indica que algo en esta página está mal. Se envía el nombre de esta página, el idioma en que la está leyendo y el mensaje del mapa, si lo hay. No se envía nada de lo que haya escrito, ninguna dirección, ni nada de su dibujo. Nadie puede responderle, porque esto no nos dice nada sobre quién es usted. Use Ayuda, Corregir algo cuando quiera contarnos más.';
$ec_lang['lpn_wrong_thanks']='Gracias. Eso nos llegó.';
$ec_lang['lpn_status_example_opened']='Se abrió {name}. Es su copia: guárdela con Archivo, Guardar como.';
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
$ec_lang['lpn_ex_basic_si_desc']='Empiece aquí. Un embalse, una bomba y un pequeño lazo: el arreglo más pequeño que aún funciona como una red de agua. Litros por segundo, con metros y milímetros.';
$ec_lang['lpn_ex_basic_us_title']='Red básica, gpm (EE. UU.)';
$ec_lang['lpn_ex_basic_us_desc']='La misma red inicial en galones por minuto, con pies y pulgadas.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 con controles basados en reglas';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='La más pequeña de las tres redes de ejemplo propias de EPANET: un embalse, una bomba y un solo lazo.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Un sistema de distribución ramificado con un depósito, de los ejemplos de EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='El ejemplo grande de EPANET: 92 nudos, 3 depósitos y 2 embalses, uno de ellos un río. Vale la pena abrirlo para ver cómo se ve en el mapa un modelo de tamaño real.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='La misma red que EPANET Net3, convertida a coordenadas lat/lon en Novato, California, con el mapa mundial detrás de ella.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Un sitio comercial resuelto para caudal contra incendios sumado a la demanda máxima diaria, en un solo momento, dibujado sobre un plano del sitio.';
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
$ec_lang['lpn_units_warn_title']='Esta unidad decide qué significan sus números';
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
$ec_lang['lpn_status_reinterpreted']='{n} valores ahora significan {unit}. No se reescribió nada.';
$ec_lang['lpn_status_converted']='Se reescribieron {n} valores a {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
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
$ec_lang['lpn_result_water_age_tip']='Cuánto tiempo lleva en el sistema el agua que llega a este punto. Donde se juntan caudales, el agua que llega trae una mezcla de edades, y el número aquí es su promedio ponderado por caudal: un nudo alimentado sobre todo por un tramo nuevo y corto muestra una edad baja aunque también lo alimente un ramal muerto largo. En un depósito es la edad promedio del agua que contiene, por lo que un depósito que se renueva lentamente suele tener el agua más vieja de la red. No hay un límite normativo con el cual compararlo, así que juzgue el número con base en su propio sistema.';
$ec_lang['lpn_result_source_share']='Aporte de origen';
$ec_lang['lpn_result_source_share_tip']='Cuánta parte del agua que llega a este punto proviene del nodo de rastreo. Esto es lo que reporta el análisis Rastreo de origen.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Edad promedio del agua';
$ec_lang['lpn_result_avg_source_share']='Aporte promedio de origen';
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
$ec_lang['lpn_result_head_tip']='Energía del agua en este nodo, expresada como una altura de columna de agua. Es una altura absoluta, mientras que la presión es una medición manométrica.';
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
$ec_lang['lpn_settings_restore_tip']='Restablece solo la configuración de este proyecto. Su dibujo y sus otros proyectos no cambian. Para guardar su configuración favorita y reutilizarla, guarde un archivo de proyecto que solo contenga la configuración.';
$ec_lang['lpn_reset_all_tip']='Elimina todos los proyectos, todas las imágenes de fondo, toda la configuración y sus unidades elegidas, y luego recarga la página exactamente como la ve un visitante por primera vez. Este es el único restablecimiento que borra todo.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Esta calculadora guarda las unidades del proyecto y los valores tal como se ingresaron, pero antes convertía los números a unidades SI para guardarlos. Este proyecto se guardó antes de ese cambio, así que sus números quedaron guardados en SI. ¿Convertirlos una última vez a las unidades actuales? Para que usted pueda juzgar, aquí hay algunos diámetros que se convertirían, con sus valores antes y después:';
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
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Convertir como';
$ec_lang['lpn_convas_coordsys_tip']='El sistema de coordenadas al que se convierte la copia. Cuando difiere del de este proyecto, siguen dos pasos de colocación. Un proyecto que ya sabe dónde está abre ambos pasos ya respondidos, así que puede aceptarlos tal cual o hacer cambios.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Actual: {crs}';
$ec_lang['lpn_convas_epsg']='Sistema de coordenadas EPSG';
$ec_lang['lpn_convas_epsg_tip']='Elija un sistema de coordenadas del registro EPSG. Latitud y longitud es WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Georreferencia sin nombre (local)';
$ec_lang['lpn_convas_unnamed_tip']='Coordenadas locales en la unidad de longitud, con el mapa mundial adjunto.';
$ec_lang['lpn_convas_none_tip']='Coordenadas locales en la unidad de longitud, sin mapa mundial por ahora.';
$ec_lang['lpn_convas_units_tip']='Las unidades a las que se convierte la copia. El original conserva sus propios números y unidades.';
$ec_lang['lpn_convas_round']='Redondear los valores convertidos';
$ec_lang['lpn_convas_round_tip']='Redondea solo los números que reescribe esta conversión, al paso más cercano que elija. Los valores cuya unidad no cambia se dejan tal cual.';
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
$ec_lang['lpn_georef_intro']='Colocar el modelo lleva dos pasos. El paso 1 es el rápido: el modelo se queda quieto y usted mueve el mapa detrás de él, hasta que su sitio quede bajo el modelo con aproximadamente el tamaño correcto. Todavía no hay giro. El paso 2 es el preciso: usted arrastra, cambia el tamaño y gira el modelo mismo. Su proyecto empieza sobre un mapa del mundo entero, así que primero encuentre su ubicación, y luego presione el botón Colocar el modelo aquí.';
$ec_lang['lpn_georef_adjust']='El modelo ya está sobre el terreno, así que se mueve junto con el mapa. Arrastre el modelo para moverlo, arrastre una esquina para cambiar su tamaño, arrastre el tirador redondo encima del modelo para girarlo. O escriba la distancia real y el ángulo de giro abajo.';
$ec_lang['lpn_georef_step1']='Paso 1 de 2 — rápido';
$ec_lang['lpn_georef_step2']='Paso 2 de 2 — preciso';
$ec_lang['lpn_georef_step1_hint']='Su proyecto permanece donde está en la pantalla. Desplace y acerque el mapa debajo de él hasta que el terreno detrás quede aproximadamente en el lugar correcto y con el tamaño correcto, y luego presione el botón Colocar el modelo aquí.';
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
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Haga clic en el mapa según se indique para seleccionar todo lo que está dentro de la forma. Presione este botón otra vez para cambiar la forma entre ventana, lazo y polígono. Mantenga presionada la tecla Mayús mientras selecciona para continuar con la selección existente, agregando o quitando (alternando) lo que selecciona.';
$ec_lang['lpn_area_selected']='{n} seleccionados.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='No se encontró nada en esa área.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Agregue y quite los vértices que dan forma a una tubería en el mapa. Haga clic en una tubería para agregar un vértice, haga clic en un vértice para quitarlo, y arrastre un vértice para moverlo. Un vértice cambia solo el trazado dibujado, no la hidráulica.';
$ec_lang['lpn_tool_undo_tip']='Deshacer el último cambio.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Ajustar toda la red en la ventana.';
$ec_lang['lpn_tool_zoom_window_tip']='Haga clic en dos esquinas opuestas de un recuadro, o arrastre uno, en el mapa para acercarse a él. Presione este botón de nuevo para Ver todo.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Acercar. Atajo: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Alejar. Atajo: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Busque un elemento por su ID, o busque todos los elementos que cumplan una condición, y cámbielos todos a la vez.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Barra de herramientas';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Visibilidad';
$ec_lang['lpn_color_legend_open_tip']='Haga clic para abrir el panel Visibilidad y cambiar estos colores.';
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
$ec_lang['lpn_color_criterion_note']='Este método toma sus límites de una norma de diseño, así que el número de colores queda fijo mientras se elija este método.';
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
$ec_lang['lpn_georef_scale_tip']='Se calcula automáticamente. Edítelo para cambiarlo. Escriba 1 para usar los números propios del archivo sin cambios como distancia real, por ejemplo uno sin sistema de coordenadas propio.';
$ec_lang['lpn_georef_rotation']='Rotación antihoraria (grados)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Cuánto rotar todo el modelo en sentido antihorario para alinearlo con el nuevo sistema de coordenadas.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='¿Colocar el modelo aquí de forma permanente? Aún podrá arrastrar elementos individuales después, pero continuar ahora convierte todas las coordenadas a la vez. Para recuperar las coordenadas anteriores, vuelva al proyecto original y cierre este sin guardar.';
$ec_lang['lpn_georef_done']='Este proyecto ahora está en el nuevo sistema de coordenadas. Puede seguir arrastrando cualquier elemento que necesite un ajuste adicional.';
$ec_lang['lpn_georef_backdrop_unrotated']='La imagen de fondo se movió y cambió de tamaño junto con el modelo, pero no se pudo rotar. Use Mapa, Imagen de fondo, Mover para alinearla.';
$ec_lang['lpn_georef_empty']='Ese archivo no tiene ninguna red, así que no hay nada que colocar.';
$ec_lang['lpn_georef_unavailable']='La herramienta de colocación no se cargó. Recargue la página e inténtelo de nuevo.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Termine la colocación con el botón "Conservar esta colocación", o presione Cancelar, antes de cambiar de proyecto. La colocación pertenece a este proyecto y no puede seguirlo a otro.';
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
$ec_lang['lpn_georef_twopt_tip']='Coloque el modelo con exactitud, cuando ya sepa dónde están realmente dos puntos de su dibujo. Haga clic en uno de ellos, escriba su latitud y su longitud, y luego haga lo mismo con un segundo punto. La posición, la escala y el giro se calculan a partir de esos dos puntos. Presione este botón de nuevo para dejar de elegir puntos.';
$ec_lang['lpn_georef_twopt_pick1']='Haga clic en un punto de su dibujo cuya latitud y longitud usted conozca.';
$ec_lang['lpn_georef_twopt_pick2']='Ahora haga clic en un segundo punto conocido, lo más alejado posible del primero.';
$ec_lang['lpn_georef_twopt_same']='Ese es el punto que eligió primero. Elija uno diferente.';
$ec_lang['lpn_georef_twopt_done']='El modelo ahora está colocado sobre los dos puntos que indicó. Compruébelo y luego presione el botón Mantener esta ubicación.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Panel inferior';
$ec_lang['lpn_pane_toggle_tip']='Mostrar u ocultar el panel debajo del mapa. Contiene el perfil y una tabla para cada tipo de elemento.';
$ec_lang['lpn_pane_resize']='Arrastre para hacer el panel más alto o más bajo';
$ec_lang['lpn_pane_tab_junctions']='Nudos';
$ec_lang['lpn_pane_tab_reservoirs']='Embalses';
$ec_lang['lpn_pane_tab_tanks']='Depósitos';
$ec_lang['lpn_pane_tab_pipes']='Tuberías';
$ec_lang['lpn_pane_tab_pumps']='Bombas';
$ec_lang['lpn_pane_tab_valves']='Válvulas';
$ec_lang['lpn_pane_tab_tip']='Esta pestaña muestra los elementos de este tipo como una tabla tipo hoja de cálculo. Las columnas de resultados no se pueden editar. Vea Ayuda, Notas para los atajos de teclado.';
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
$ec_lang['lpn_pane_filter_stale']='Filas que ya no coinciden: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Nada en esta tabla coincide con el filtro.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Acercar y seleccionar';
$ec_lang['lpn_goto_on_map']='Mostrar en el mapa';
$ec_lang['lpn_pane_select_on_map']='Seleccionar en el mapa';
$ec_lang['lpn_pane_unselect_on_map']='Anular selección en el mapa';
$ec_lang['lpn_pane_print']='Imprimir tabla';
$ec_lang['lpn_pane_print_tip']='Imprime la tabla que está viendo, con el nombre del proyecto, el nombre de la tabla y las unidades en los encabezados. Las filas se imprimen en el orden en que las ordenó.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them.
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
$ec_lang['lpn_menu_project_tip']='Todo lo relacionado con el modelado de redes de agua está aquí en un solo lugar, excepto los controles de reproducción de la animación. No hace falta adivinar dónde está cada cosa.';
$ec_lang['lpn_tables_menu']='Tablas';
$ec_lang['lpn_tables_menu_tip']='Abre, en el panel debajo del mapa, una tabla con las partes de esta red. Hay una tabla para cada tipo de parte, y allí puede ordenarla y editarla.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Vuelve a calcular esta red ahora. ¿Busca el botón Calcular? Está oculto mientras el ajuste Recalcular automáticamente está activado. Para que el botón vuelva a aparecer, desactive Recalcular automáticamente en Configuración, Cálculo, Hidráulica.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Recalcular automáticamente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Cuando esto está activado, este proyecto se recalcula poco después de cada cambio que hace, y el botón Calcular se quita de la barra de herramientas porque ya no tiene nada que hacer. Desactívelo en una red grande donde esperar a que se recalcule cada cambio estorbe al escribir, y el botón Calcular vuelve para que usted elija cuándo ejecutar.';
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
$ec_lang['lpn_time_no_report']='Todavía no hay informe de ejecución. El informe es el propio texto de EPANET, así que aparece una vez que esta red se haya calculado con el solucionador de EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
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
$ec_lang['lpn_confirm_delete_network']='¿Eliminar todos los nodos, tuberías y etiquetas de texto de este proyecto? La imagen de fondo, el nombre del proyecto y su configuración se conservan. Esto no se puede deshacer.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Buscar y reemplazar';
$ec_lang['lpn_find_title']='Buscar y reemplazar';
$ec_lang['lpn_find_scope']='Qué buscar';
$ec_lang['lpn_find_scope_all']='Todo';
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
$ec_lang['lpn_find_filter_tip']='Muestra solo las partes que coinciden con esta consulta en una de las tablas debajo del mapa. El dibujo no se modifica y no se elimina nada.';
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
$ec_lang['lpn_find_count']='{n} encontrados. Haga clic en uno para ir a él.';
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
$ec_lang['lpn_find_no_value']='Escriba qué buscar.';
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
$ec_lang['lpn_find_op_conn_nolinksource']='sin ruta de líneas hasta un embalse';
$ec_lang['lpn_find_op_conn_noopensource']='sin ruta abierta hasta un embalse';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Todos los nodos están conectados.';
$ec_lang['lpn_find_conn_no_fixed']='Esta red no tiene ningún embalse ni depósito, así que no hay ningún origen al que llegar. Solo se puede buscar sin líneas en el nodo y sin líneas abiertas en el nodo.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='La misma búsqueda, escrita en una sola línea. Cambiar los controles reescribe esta línea, y escribir en esta línea actualiza los controles.';
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
$ec_lang['lpn_replace_asked']='Se solicitaron elevaciones para {n} nodos. Los resultados están en camino.';
$ec_lang['lpn_replace_btn']='Reemplazar';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='¿Cambiar {n} elementos?';
$ec_lang['lpn_replace_apply']='Cambiarlos';
$ec_lang['lpn_replace_done']='{n} elementos cambiados. Puede deshacer esto en un paso.';
$ec_lang['lpn_replace_none']='Nada cambiaría.';
$ec_lang['lpn_replace_no_value']='Escriba el nuevo valor.';
$ec_lang['lpn_replace_scope']='Elija arriba un tipo de elemento para cambiar sus valores.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Perfil';
$ec_lang['lpn_graphs_menu']='Gráficos';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_title']='Perfil a lo largo de una ruta';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Haga clic en el nodo donde empieza el trazado.';
$ec_lang['lpn_profile_draw_more']='Mueva el cursor sobre el mapa para ver el trazado. Haga clic en un nodo para agregarlo. Haga doble clic para terminar. Esc cancela.';
$ec_lang['lpn_profile_draw_blocked']='No hay ruta de {a} a {b}. Elija otro nodo.';
$ec_lang['lpn_profile_tap_start']='Toque el nodo donde empieza el trazado.';
$ec_lang['lpn_profile_tap_more']='Toque un nodo para ver el trazado. Mantenga presionado para agregarlo. Toque dos veces para terminar. Presione Perfil de nuevo para cancelar.';
$ec_lang['lpn_profile_say_idle']='Presione Perfil de nuevo para elegir un nuevo trazado en el mapa.';
$ec_lang['lpn_profile_none']='Todavía no hay trazado. Presione Perfil de nuevo para elegir uno en el mapa.';
$ec_lang['lpn_profile_choose']='Elija un nodo de inicio y un nodo final.';
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
$ec_lang['lpn_profile_edit_click']='Arrastre cualquier punto de la ruta para moverlo. Haga clic en un punto que usted agregó para quitarlo.';
$ec_lang['lpn_profile_edit_tap']='Arrastre cualquier punto de la ruta para moverlo. Toque un punto que usted agregó para quitarlo.';
$ec_lang['lpn_profile_edit_nowhere']='Un punto de la ruta tiene que ser un nodo. La ruta no cambia.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Rutas guardadas';
$ec_lang['lpn_profile_new']='Ruta guardada nueva…';
$ec_lang['lpn_profile_new_name']='Ruta {n}';
$ec_lang['lpn_profile_rename']='Renombrar ruta…';
$ec_lang['lpn_profile_delete']='Eliminar ruta';
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
$ec_lang['lpn_ts_tip']='Grafica uno o más elementos contra el tiempo a lo largo de una simulación de período extendido.';
$ec_lang['lpn_ts_title']='Valores contra el tiempo';
$ec_lang['lpn_ts_group_nodes']='Nudos';
$ec_lang['lpn_ts_group_links']='Líneas';
$ec_lang['lpn_ts_add']='Agregar los seleccionados';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='No hay nada de ese tipo elegido en el mapa.';
$ec_lang['lpn_ts_clear']='Quitar todo';
$ec_lang['lpn_ts_chip_tip']='Quitar {id} del gráfico';
$ec_lang['lpn_ts_none']='Todavía no hay nada que graficar. Seleccione elementos en el mapa y presione Agregar los seleccionados.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Todavía no hay resultados de período extendido. Presione Calcular para ejecutar la simulación.';
$ec_lang['lpn_ts_summary']='Elementos: {n}, tiempos de informe: {steps}';
$ec_lang['lpn_ts_axis_time']='Tiempo transcurrido';
$ec_lang['lpn_freq_menu']='Frecuencia';
$ec_lang['lpn_freq_tip']='Graficar la distribución de frecuencia de una propiedad en todos los nudos o todas las tuberías, en el paso de tiempo actual.';
$ec_lang['lpn_freq_title']='Distribución de valores';
$ec_lang['lpn_freq_none']='Todavía no hay resultados para este valor, así que no hay nada que graficar.';
$ec_lang['lpn_freq_summary']='Graficados: {n} de {total}';
$ec_lang['lpn_freq_summary_time']='Graficados: {n} de {total}, en {time}';
$ec_lang['lpn_freq_axis_percent']='Porcentaje menor que';
$ec_lang['lpn_sysflow_consumed_tip']='Total de todas las demandas positivas: el agua que se extrae de la red en los nudos, y cualquier caudal que entra a un embalse.';
$ec_lang['lpn_sysflow_consumed']='Consumido';
$ec_lang['lpn_sysflow_produced_tip']='Caudal total que entra a la red desde embalses y desde demandas negativas.';
$ec_lang['lpn_sysflow_produced']='Producido';
$ec_lang['lpn_sysflow_tip']='Grafica el caudal total producido y el caudal total consumido contra el tiempo, a lo largo de la simulación de período extendido. Los depósitos no están en ningún total, así que donde las dos líneas se separan, los depósitos se están llenando o vaciando.';
$ec_lang['lpn_sysflow_menu']='Balance de caudales';
$ec_lang['lpn_contour_consent_4']='Si dice que no, todo lo demás en esta página sigue funcionando exactamente como ahora, y el mapa de isolíneas se dibuja solo entre nodos. Recordamos un sí para no tener que volver a preguntar. Un no no se guarda en absoluto.';
$ec_lang['lpn_contour_consent_3']='¿Podemos enviar a Mapbox los números de mosaico del área de su red?';
$ec_lang['lpn_contour_consent_2']='Esta es una cuestión distinta de las imágenes del mapa detrás de su proyecto. Las imágenes solo dicen adónde está mirando. Estos mosaicos dicen dónde está su red. Mapbox recibirá esos números de mosaico y su dirección IP. No enviamos nada más: ni nombre, ni tuberías, ni proyecto. No guardamos ningún registro de esto, y nada se almacena en este dispositivo salvo su respuesta a esta pregunta.';
$ec_lang['lpn_contour_consent_1']='Dibujar la presión sobre el terreno envía el área que cubre su red, como números de mosaico de mapa de Mapbox, a api.mapbox.com, para leer la altura del terreno allí.';
$ec_lang['lpn_contour_dem_failed']='No se pudo leer el terreno de Mapbox DEM, así que la presión se interpola solo entre nodos.';
$ec_lang['lpn_contour_support_dem']='Entre nodos, la presión es la carga interpolada menos la elevación del terreno de Mapbox DEM, muestreada aproximadamente cada {m} m.';
$ec_lang['lpn_contour_dem_tip']='Entre nodos, la presión pasa a ser la carga interpolada menos la altura del terreno de Mapbox DEM, así que puede caer por debajo de la presión del nodo más bajo en una colina donde la red no tiene ningún nodo. Trate el terreno como un mapa de curvas de nivel, no como un levantamiento.';
$ec_lang['lpn_contour_dem']='Terreno entre nodos a partir de Mapbox DEM';
$ec_lang['lpn_contour_too_many']='Hay demasiadas isolíneas con este intervalo; amplíelo para dibujarlas.';
$ec_lang['lpn_contour_support_lines']='Isolíneas cada {i} {u}.';
$ec_lang['lpn_contour_support']='Mapa de isolíneas: {n} nodos, interpolados a lo largo de {p} tuberías y hasta {k} veces la longitud mediana de tubería a sus lados. Sin color a través de bombas, válvulas o líneas cerradas.';
$ec_lang['lpn_contour_few']='Hay muy pocos nodos para trazar isolíneas.';
$ec_lang['lpn_contour_buffer_tip']='Hasta dónde llega el color desde cada tubería, como múltiplo de la longitud mediana de tubería. Se desvanece en la parte exterior.';
$ec_lang['lpn_contour_buffer_unit']='× longitud mediana de tubería';
$ec_lang['lpn_contour_buffer']='Margen';
$ec_lang['lpn_contour_interval']='Intervalo';
$ec_lang['lpn_contour_lines']='Isolíneas';
$ec_lang['lpn_contour_opacity']='Opacidad del relleno';
$ec_lang['lpn_contour_fill_bands']='Bandas';
$ec_lang['lpn_contour_fill_smooth']='Suave';
$ec_lang['lpn_contour_fill_tip']='Suave mezcla los colores de una clase a la siguiente. Bandas pinta cada clase de la clave de colores de forma uniforme.';
$ec_lang['lpn_contour_fill']='Relleno';
$ec_lang['lpn_contour_plot']='Mapa de isolíneas';
$ec_lang['lpn_contour_tip']='Muestra un mapa de isolíneas: los colores de los nodos se extienden a lo largo y a los lados de las tuberías, con isolíneas rotuladas. Abre un cuadro para ajustarlo o desactivarlo.';
$ec_lang['lpn_contour_menu']='Isolíneas';
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
$ec_lang['lpn_new_coordsys_tip']='Seleccione el sistema de coordenadas de su red. Esto es permanente; la única forma de convertir una red a otras coordenadas es con «Archivo, Abrir con nuevas coordenadas», y es aproximada.';
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
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='Filtrar por la vista del mapa';
$ec_lang['lpn_crs_view_tip']='Ofrece solo las proyecciones que cubren el lugar que el mapa está mostrando. Desactívelo para ver la lista completa.';
$ec_lang['lpn_crs_place']='Búsqueda de nombre de lugar';
$ec_lang['lpn_crs_place_tip']='Escriba una ciudad, una dirección o un punto de referencia, y la vista del mapa se desplazará allí. Lo que escriba se envía al servicio de nombres de lugares de OpenStreetMap, que le pedirá permiso la primera vez. Un proyecto geográfico nuevo también comienza en el lugar que encuentre aquí.';
$ec_lang['lpn_crs_search']='Buscar';
$ec_lang['lpn_crs_name']='Filtro por nombre de proyección';
$ec_lang['lpn_crs_name_tip']='Muestra solo las proyecciones cuyo nombre o código EPSG contiene lo que escriba. Pruebe con un número de zona, UTM o Mercator.';
$ec_lang['lpn_crs_list_tip']='Las proyecciones que quedan tras los dos filtros anteriores. Elija una y presione Seleccionar.';
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
$ec_lang['lpn_new_units_tip']='Un proyecto conserva sus propias unidades, así que esta elección pertenece solo a este proyecto y no se guarda como ajuste del navegador. Para iniciar proyectos nuevos de una manera particular, guarde un proyecto vacío como su plantilla y haga una copia de él cada vez.';
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
$ec_lang['lpn_file_import_menu']='Importar…';
$ec_lang['lpn_file_import_inp']='Importar archivo de EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Cree un proyecto nuevo a partir de un archivo de EPANET, ya sea el formato de exportación .inp (preferido) o el formato nativo .net (último recurso).';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Exportar archivo EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Descargue esta red como un archivo .inp de EPANET. Todo lo que el formato .inp no pueda contener se le indica después.';
$ec_lang['lpn_status_inp_exported']='Se exportó {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} elementos que el formato .inp no puede contener.';
$ec_lang['lpn_inp_export_refused']='Este proyecto no se puede escribir como un archivo EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Ese archivo no se pudo leer como un archivo de red de EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Esto parece un archivo .net de EPANET, pero esta página no pudo leerlo. Ábralo en EPANET y use allí el comando Archivo, Exportar, Red para guardarlo como un archivo .inp, y luego importe ese archivo.';
$ec_lang['lpn_inp_report_heading']='Se importó {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} nudos, embalses y depósitos, {links} tuberías, bombas y válvulas, en {units}.';
$ec_lang['lpn_inp_report_clean']='Todo el contenido del archivo se incorporó. No se dejó nada fuera.';
$ec_lang['lpn_inp_report_label_anchor']='Las etiquetas de texto se colocan como las coloca EPANET, desde su esquina superior izquierda.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Los archivos EPANET no contienen sistema de coordenadas, así que este archivo no estará georreferenciado inicialmente. Para colocarlo en un mapa mundial, use Mapa, Mapa mundial… Para convertir sus coordenadas, use Archivo, Convertir como…';
$ec_lang['lpn_inp_report_lead']='Esta página no usa todo lo que usa EPANET, pero nada de su archivo se descarta. Abajo está lo que su archivo contiene que esta página conserva sin usar, y lo que se cambió al leer el archivo:';
$ec_lang['lpn_inp_drop_headloss']='Este archivo no usa la fórmula de Hazen-Williams. Esta página calcula con Hazen-Williams, así que los valores de rugosidad de la tubería se conservaron exactamente como estaban escritos, pero los resultados aquí no coincidirán con los de EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Estos depósitos no tienen paredes rectas: el archivo da su forma como una curva. La curva se conserva en el cuadro Bibliotecas, el depósito sigue indicándola, y una simulación de período extendido llena y vacía el depósito según el programa que da esa curva. Un solo instante es igual de cualquier manera, porque la superficie del agua es el nivel que fija el archivo. El diámetro escrito en el archivo se conserva junto a la curva y es con el que se dibuja y se resuelve un depósito sin curva.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Estas válvulas de estrangulamiento se incorporaron como válvulas de estrangulamiento, conservando la misma pérdida que indica el archivo.';
$ec_lang['lpn_inp_drop_valve_active']='Estas válvulas controlan la presión o el caudal, y se abren y cierran por sí solas a medida que cambia el agua. No se perdió nada de ellas al incorporarlas, y esta página las resuelve con el solucionador de EPANET, activando ese solucionador por sí sola para esta red.';
$ec_lang['lpn_inp_drop_valve']='Estas válvulas se describen mediante una curva o una caída de presión fija, y esta página no tiene un elemento así. Se incorporaron como tuberías abiertas, así que la red sigue conectada, pero ya nada controla la presión ni el caudal allí.';
$ec_lang['lpn_inp_drop_cv']='En EPANET estas tuberías dejan pasar el agua en un solo sentido. Se incorporaron como tuberías comunes, así que ahora el agua puede fluir en cualquier sentido por ellas.';
$ec_lang['lpn_inp_drop_demands']='Estos nudos tenían más de una demanda. Las demandas se sumaron en la única demanda que maneja esta página.';
$ec_lang['lpn_inp_drop_patterns']='Esta página no leyó los patrones de demanda, porque la parte de ella que ejecuta una simulación de período extendido no se cargó. Cada demanda es el número escrito en el archivo.';
$ec_lang['lpn_inp_drop_demand_pattern']='Estos nudos cambian su demanda a lo largo de la ejecución. Sus patrones se incorporaron completos, y la demanda que se ve es la correspondiente al momento que muestra el reloj.';
$ec_lang['lpn_inp_drop_emitters']='Estos nudos tienen un coeficiente de aspersor o de fuga. Se conservó, se está resolviendo, y cada uno lo muestra en el cuadro Coeficiente de emisor en sus propiedades.';
$ec_lang['lpn_inp_drop_curve_long']='Esta curva de bomba tenía más de tres puntos. Se conservaron su punto más bajo, el medio y el más alto, porque esta página ajusta una curva a un máximo de tres puntos.';
$ec_lang['lpn_inp_drop_curve_missing']='Esta bomba indica una curva que no está en el archivo. La bomba se incorporó sin curva, así que no agrega carga.';
$ec_lang['lpn_inp_drop_pump_other']='Esta bomba se describe por la potencia que consume, en vez de por una curva. Se incorporó sin curva, así que no agrega carga.';
$ec_lang['lpn_inp_drop_head_pattern']='Estos embalses suben y bajan a lo largo de la ejecución. Sus patrones se incorporaron completos, y el nivel de agua que se ve es el correspondiente al momento que muestra el reloj.';
$ec_lang['lpn_inp_drop_pump_speed']='Estas bombas funcionan a una velocidad distinta de aquella con la que se midió su curva, o cambian de velocidad a lo largo de la ejecución. La velocidad y su patrón se incorporaron completos, y la carga que se ve es la correspondiente al momento que muestra el reloj.';
$ec_lang['lpn_inp_drop_setting']='Estas tuberías, bombas y válvulas llevan un ajuste que esta página no puede guardar. Se incorporaron abiertas.';
$ec_lang['lpn_inp_drop_rules']='Este archivo tiene controles basados en reglas. Esta página las lee y las usa. Ejecute el modelo con el solucionador de EPANET y las reglas se aplican, con cada nivel, presión y caudal convertidos a las unidades que muestra este proyecto. Abra Reglas en Bibliotecas para leer una o cambiarla. Se conservan exactamente como las indica el archivo, y se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_eps']='Este archivo describe una simulación de período extendido. La parte de esta página que ejecuta una simulación de período extendido no se cargó, así que solo se incorporaron las condiciones iniciales.';
$ec_lang['lpn_inp_drop_quality']='Este archivo describe cómo cambia la calidad del agua mientras viaja: qué hay en el agua al principio, y qué tan rápido reacciona esa sustancia en las tuberías y en los depósitos. Esta página lee esos números y los usa. Elija un producto químico en Configuración, Cálculo, Calidad, luego ejecute el modelo, y la concentración se calcula a lo largo de la red conforme avanza la ejecución. Las líneas se conservan, y se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Este archivo indica dónde se dosifica un producto químico en la red, y cómo se mezcla el agua en un depósito. Una dosis aparece en el nudo donde se agrega, y un depósito indica qué modelo de mezcla sigue. Tanto la dosis como el modelo de mezcla se calculan solo con el solucionador de EPANET.';
$ec_lang['lpn_inp_drop_energy']='Este archivo EPANET incluye datos para modelar el costo de bombeo. Esta página los lee y los usa. Ejecute el modelo con el solucionador de EPANET, y luego abra Agua, Informes, Energía de las bombas para ver cuánto tiempo funcionó cada bomba, la potencia que consumió, la energía que usó y lo que costó. Las líneas se conservan, y se vuelven a escribir si guarda un archivo EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Este archivo asigna etiquetas a algunos de sus nudos, tuberías u otros elementos. Cada etiqueta se incorporó completa, y cada una está en las propiedades de su propio elemento, donde puede leerla o cambiarla.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Este archivo contiene la configuración propia de EPANET para el formato del informe que imprime. Puede leer el informe del solucionador aquí, en Informes, Ejecución de EPANET, pero sale en el formato estándar del solucionador y no en el que piden estos ajustes. Las líneas se conservan, y se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_sections']='Este archivo contiene una sección que esta página no lee en absoluto. Nada aquí la usa. Se conserva completa, y se vuelve a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Este archivo indica las opciones de calidad del agua de EPANET: la opción Quality, que nombra el tipo de análisis de calidad del agua, y dos ajustes que van con un producto químico, Relative diffusivity y Quality tolerance. Las tres se conservan y las tres se usan. Aquí se calculan la edad del agua, el rastreo de origen y un producto químico, y los dos ajustes del producto químico se entregan al solucionador de EPANET cuando ejecuta uno. Todas se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Este archivo hace referencia a un archivo auxiliar: Map, que contiene coordenadas, o Hydraulics, que contiene resultados hidráulicos ya calculados. Esta página no puede abrir ninguno de los dos, así que esas líneas se conservan tal como están y se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='Este archivo solicita un análisis dirigido por presión (PDA), en el cual un nudo recibe menos que su demanda cuando la presión allí es baja. Esta página resuelve por demanda fija, así que cada nudo aquí recibe la demanda que indica el archivo, sin importar qué presión resulte. Esa línea se conserva y se vuelve a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Este archivo indica opciones que esta página no lee. Nada aquí las usa. Se conservan y se vuelven a escribir si guarda un archivo EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Este archivo .net de EPANET indica ajustes para los que esta página no tiene control, así que sus valores se muestran aquí en lugar de incorporarse. Todo lo demás se incorporó. Si los necesita, abra el archivo en EPANET y use Archivo, Exportar, Network para guardarlo como archivo .inp, luego importe ese.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Este era un archivo .net de EPANET. Ese es el propio archivo de proyecto de EPANET, no tiene una descripción publicada, y esta página lo lee deduciendo el formato a partir de archivos de ejemplo, así que úselo solo cuando no tenga otra opción y no como una vía confiable. El archivo .inp es el formato documentado que todo otro programa lee: en EPANET use Archivo, Exportar, Network para escribir uno, e importe ese en su lugar siempre que pueda.';
$ec_lang['lpn_inp_drop_backdrop']='Este archivo nombra una imagen de fondo pero no contiene la imagen en sí. Agréguela usted mismo con Archivo, Imagen de fondo, Agregar imagen.';
$ec_lang['lpn_inp_drop_dangling']='Estas tuberías nombran un nudo que no está en el archivo, así que se dejaron fuera.';
$ec_lang['lpn_inp_drop_units']='No se reconocieron las unidades de caudal de este archivo, así que se supusieron galones por minuto. Revise cada número antes de usar los resultados.';
$ec_lang['lpn_inp_drop_anchor_missing']='Este texto estaba adjunto a un nudo, embalse o depósito que no está en el archivo. Se incorporó como texto libre en el lugar que indicaba el archivo, y ahora no sigue a nada.';
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
$ec_lang['lpn_file_upload_explain']='Este navegador no puede conectarse a un archivo, así que abrir un archivo aquí es en realidad una carga: el proyecto se copia en este navegador, y la única forma de guardar su trabajo de vuelta al archivo es sobrescribirlo con Archivo, Guardar como.';
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
$ec_lang['lpn_file_saveas_tip_download']='Guarda usando la configuración de Descargas de su navegador. Este navegador no puede conectarse a un archivo, así que Guardar está deshabilitado y solo está disponible Guardar como. Si activa la opción de su navegador "Preguntar dónde guardar cada archivo", puede elegir el archivo original y sobrescribirlo.';
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
$ec_lang['lpn_revert_confirm']='¿Descartar los cambios que ha hecho y volver a cargar {file} desde el disco?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Este proyecto proviene de {file}, pero se perdió la conexión con ese archivo. Elija el archivo de nuevo para conectarse a él.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='No se pudo escribir en el archivo. Puede que se haya movido o renombrado, o que se haya retirado el permiso. Su trabajo sigue guardado en este navegador.';
$ec_lang['lpn_file_changed_elsewhere']='Otra persona guardó en este archivo desde que usted lo abrió, así que guardar ahora sobrescribiría su trabajo. Use Archivo, Guardar como para conservar sus cambios en un archivo propio, o Archivo, Revertir para descartar los suyos y cargar los de ellos.';
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
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='¿A quién decimos que está preguntando? Sus iniciales son ideales. Se guardan junto con el bloqueo de este archivo en nuestro servidor, para quien lo tenga abierto, y se eliminan dentro de 30 días.';
$ec_lang['lpn_lock_ask_sent']='Le pedimos a quien tenga este archivo abierto que lo cierre. Lo verá dentro de un minuto, si su página sigue abierta. Nada más ha cambiado, y el archivo sigue siendo suyo hasta que lo cierre.';
$ec_lang['lpn_lock_ask_failed']='Su mensaje no se pudo entregar. O nadie tiene este archivo abierto ahora, o no se pudo contactar al servidor.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Ese archivo no se abrió, y nada aquí cambió. Otra persona todavía lo tiene abierto.';
$ec_lang['lpn_copy_opened']='Se abrió {file} como una copia, con un bloqueo nuevo propio que se guardará con el próximo guardado del archivo.';
$ec_lang['lpn_copy_kept_link']='Se abrió {name} como el original, movido a otro lugar. Guardar ahora escribe en este archivo.';
$ec_lang['lpn_copy_copy']='Una copia; crear un bloqueo nuevo';
$ec_lang['lpn_copy_original']='Original; conservar el mismo bloqueo';
$ec_lang['lpn_copy_body_nodate']='Este navegador no reconoce este archivo. ¿Es el archivo Original (conservar el mismo bloqueo) o una Copia (crear un bloqueo nuevo)?';
$ec_lang['lpn_copy_body']='Este archivo dice que se creó el {date}, y este navegador no lo reconoce. ¿Es el archivo Original (conservar el mismo bloqueo) o una Copia (crear un bloqueo nuevo)?';
$ec_lang['lpn_copy_title']='¿Marcar el archivo como copia nueva?';
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
$ec_lang['lpn_msglog_note']='Los más recientes primero. Esta página conserva los últimos {n} mensajes mientras está abierta, y nada se guarda en su computadora.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Solo lectura: {name} tiene este archivo abierto. Puede cambiar lo que quiera aquí, pero no puede guardar. Use Archivo, Guardar como para guardar en un archivo diferente.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Atención: no se pudo contactar al servidor para verificar o crear un bloqueo en este proyecto, así que nada impide que un colega edite el mismo archivo al mismo tiempo. Se le avisará si el bloqueo vuelve a funcionar.';
$ec_lang['lpn_lock_storage_error']='Atención: este sitio no puede guardar los registros de bloqueo, así que nada impide que un colega edite el mismo archivo al mismo tiempo. Esto es una falla de configuración del servidor, no algo que usted pueda corregir aquí — la carpeta de bloqueo no tiene permiso de escritura para el servidor web.';
$ec_lang['lpn_lock_full_error']='Atención: este sitio se quedó sin espacio para registrar quién tiene abierto cada proyecto, así que nada impide que un colega edite el mismo archivo al mismo tiempo. Esto es una falla de configuración del servidor, no algo que usted pueda corregir aquí.';
$ec_lang['lpn_lock_not_asked']='El bloqueo no está activo para este proyecto, así que nada impide que un colega edite el mismo archivo al mismo tiempo. Este proyecto aún no tiene un identificador, y guardarlo en un archivo le asigna uno.';
$ec_lang['lpn_lock_restored']='El bloqueo volvió a funcionar, y este archivo ahora es suyo para guardar.';
$ec_lang['lpn_lock_dismiss']='Ocultar este mensaje';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Su proyecto se guardará en un archivo en esta computadora. Se guarda cuando usted lo pide, y en ningún otro momento, así que nada se escribe en ese archivo sin su conocimiento.';
$ec_lang['lpn_file_training_2']='Para que dos personas nunca editen un mismo archivo al mismo tiempo, este sitio lleva registro de quién lo tiene abierto. Si alguien ya lo tiene, usted igual puede abrirlo y mirarlo, o quedarse con una copia propia.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='La primera vez que guarde, su navegador le preguntará si este sitio puede editar el archivo. Esa pregunta viene del navegador, no de nosotros, y decir que sí es lo que permite que Guardar escriba su trabajo de vuelta. Normalmente se pregunta solo una vez por archivo.';
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
$ec_lang['lpn_notes_1_def']='El solucionador de EPANET resuelve esta red. Configure un tiempo total de simulación y cada paso de informe se calcula por turno: los depósitos se llenan y se vacían, las demandas siguen sus patrones, y la barra de herramientas reproduce la simulación.';
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
$ec_lang['lpn_notes_2_def']='Se modela la calidad del agua: la edad del agua, el rastreo de origen, y un producto químico que reacciona en las paredes de la tubería y en el seno del agua. No se modelan el golpe de ariete ni las sobrepresiones transitorias: toda respuesta aquí es para agua que ya fluye de manera estable, no para la onda de presión cuando una válvula se cierra de golpe.';
$ec_lang['lpn_notes_3_term']='Guardado de proyectos';
$ec_lang['lpn_notes_3_def']='Cada proyecto es una pestaña, y cada pestaña se guarda en este navegador mientras usted trabaja. Borrar los datos de su navegador los elimina todos, así que guarde su trabajo en un archivo: Archivo, Guardar como. Un asterisco en una pestaña indica que contiene cambios que no están en un archivo. Nada se escribe nunca en un archivo a menos que usted lo pida. En algunos navegadores, un proyecto se conecta al archivo en el que lo guarda, y Archivo, Guardar escribe de vuelta a ese mismo archivo de ahí en adelante; en otros no es posible ninguna conexión, así que Guardar está deshabilitado y solo está disponible Guardar como. Cuando un archivo de proyecto se mantiene en una unidad compartida, esta página le indica si un colega ya lo tiene abierto, para que dos personas no escriban una sobre la otra.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Curva de la bomba';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Una bomba sigue H = H₀ − aQ^b, donde H es la carga que agrega la bomba y Q es el caudal que pasa por ella. Ingrese uno, dos o tres puntos de la curva del fabricante. Tres puntos, la carga a caudal cero, el punto normal de trabajo y el punto de caudal más alto, ajustan H₀, a y b directamente, y siguen más de cerca una curva publicada. Dos puntos ajustan una parábola (b = 2) con su pico en caudal cero. Un punto usa una regla común: la carga a caudal cero es 1,33 × la carga que ingresa, y el caudal más alto es 2 × el caudal que ingresa, lo que de nuevo da b = 2. Una bomba sin puntos ingresados no agrega carga alguna. La curva no se corta donde la carga llega a cero, así que pedirle a una bomba más caudal del que su curva puede entregar da una carga negativa. La solución es una bomba más grande o una demanda menor, no un ajuste de curva diferente. Una curva puede tener más de tres puntos, y se lee cada punto que usted dio.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='También en esta página';
$ec_lang['lpn_notes_4_def']='Un proyecto puede ubicarse sobre el terreno real con un mapa de calles detrás. Los archivos .inp de EPANET se pueden leer y escribir. El panel inferior dibuja un perfil a lo largo de una ruta y enumera los nudos. Los elementos se pueden colorear según sus resultados, y Buscar encuentra todos los elementos que cumplan una condición que usted defina.';
$ec_lang['lpn_notes_6_term']='Ayuda de columnas de tabla';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Seleccionar columna</td><td>Haga clic en el encabezado</td></tr><tr><td>Agregar o extender la selección de columnas</td><td>Ctrl+clic o Shift+clic en otro encabezado</td></tr><tr><td>Mover (reordenar) las columnas seleccionadas</td><td>Arrastre o use Administrar columnas… en el menú de clic derecho o ⋮</td></tr><tr><td>Menú ⋮ y flecha de orden.</td><td>Pase el puntero por la esquina superior de un encabezado, o selecciónelo o llegue a él con Tab</td></tr><tr><td>Ocultar, Mostrar todas, o Administrar visibilidad y orden</td><td>Clic derecho en el encabezado o menú ⋮ en la esquina superior derecha del encabezado</td></tr><tr><td>Ordenar por columna</td><td>Icono de flecha en la esquina superior derecha del encabezado</td></tr><tr><td>Pegar como filas nuevas al final de la tabla</td><td>Clic derecho, menú ⋮ en la esquina superior derecha del encabezado, o Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Atajos de teclado de la tabla';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Arrow keys</td><td>Recorrer.</td></tr><tr><td>Tab, Enter</td><td>Termina la entrada y avanza una celda a la derecha / hacia abajo.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Retrocede.</td></tr><tr><td>Shift+arrow keys</td><td>Extiende la selección.</td></tr><tr><td>Ctrl+C</td><td>Copia la selección.</td></tr><tr><td>Ctrl+D</td><td>Rellena la selección hacia abajo desde su fila superior.</td></tr><tr><td>Ctrl+Enter</td><td>Rellena la selección con el valor de la celda activa.</td></tr><tr><td>Ctrl+A</td><td>Selecciona toda la tabla.</td></tr><tr><td>Ctrl+Shift+V</td><td>Pega como filas nuevas al final de la tabla.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Cambia a la pestaña siguiente o anterior, sea una tabla o un gráfico.</td></tr><tr><td>Delete</td><td>Borra una celda.</td></tr><tr><td>F2</td><td>Abre una celda para editarla.</td></tr><tr><td>Esc</td><td>Cancela una edición.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Los límites de las bandas de color permanecen iguales';
$ec_lang['lpn_notes_color_def']='Los límites de las bandas de color se fijan cuando elige un método de Asignación de rangos. No se vuelven a fijar en cada paso de tiempo, porque eso haría que los colores significaran algo distinto en cada paso, y eso no ayuda a visualizar su sistema. EPANET funciona de la misma manera. Para obtener nuevos límites, elija un método de nuevo o escriba los suyos.';
$ec_lang['lpn_notes_epanet_term']='Las constantes de Hazen-Williams coinciden con EPANET';
$ec_lang['lpn_notes_epanet_def']='En agosto de 2026 se cambiaron el coeficiente y el exponente de Hazen-Williams para coincidir con EPANET. Los resultados de pérdida de carga difieren de los de las versiones anteriores de esta página hasta en un 0,1 por ciento, mucho menos que la incertidumbre del propio valor de C.';
$ec_lang['lpn_notes_engine_term']='Qué versión de EPANET usa esta página';
$ec_lang['lpn_notes_engine_def']='El solucionador de EPANET de esta página es OWA-EPANET 2.3.5, publicado el 20 de febrero de 2025. EPANET lo desarrolla Open Water Analytics, una comunidad que trabaja con la Agencia de Protección Ambiental de los Estados Unidos, que publicó la versión 2.2.0 en diciembre de 2019. El informe de ejecución lo llama 2.3.05 porque el motor escribe el último número con dos dígitos. Llega a esta página a través de epanet-js 0.9.0 de Luke Butler, bajo licencia MIT, y funciona dentro de su navegador: su red nunca se envía a ningún lado para resolverse.';
$ec_lang['lpn_id_invalid']='Ingrese un ID sin espacios y sin comillas.';
$ec_lang['lpn_id_taken']='Ese ID ya está en uso.';
$ec_lang['lpn_diag_no_fixed_head']='Agregue un embalse o un depósito. La red necesita al menos un nivel de agua conocido antes de poder resolverse.';
$ec_lang['lpn_diag_dangling_link']='Una tubería o bomba se conecta a un nodo que ya no existe:';
$ec_lang['lpn_diag_unreachable']='Estos nodos no tienen ruta hacia un embalse:';
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
$ec_lang['lpn_engine_fetching']='Obteniendo el solucionador de EPANET. Se descarga una vez y luego se guarda en este dispositivo, así que después funciona sin conexión.';
$ec_lang['lpn_engine_ready']='El solucionador de EPANET ya está en este dispositivo, y funciona sin conexión.';
$ec_lang['lpn_engine_fetching_valve']='Obteniendo el solucionador de EPANET, para que esta válvula se pueda resolver ahora y sin conexión más adelante.';
$ec_lang['lpn_engine_ready_valve']='El solucionador de EPANET ya está en este dispositivo. Las válvulas que se abren y cierran por sí solas funcionarán sin conexión.';
$ec_lang['lpn_engine_unavailable']='No se pudo obtener el solucionador de EPANET, que es lo que resuelve las válvulas que se abren y cierran por sí solas. Conéctese a internet una vez y quedará guardado en este dispositivo de ahí en adelante.';
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
$ec_lang['lpn_diag_valve_needs_epanet']='Estas válvulas se abren y cierran por sí solas, y solo el solucionador de EPANET puede calcularlas. No se pudo cargar el solucionador de EPANET, así que faltan estos resultados:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Estas válvulas están conectadas directamente a un embalse o a un depósito, que ya fija el nivel de agua allí, así que no queda nada que la válvula pueda controlar. Coloque una tubería corta entre la válvula y el embalse o el depósito:';
$ec_lang['lpn_diag_not_converged']='No se encontró una solución. Revise si hay valores que no pueden ser reales, como un diámetro de cero.';
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
$ec_lang['lpn_field_from']='Desde';
$ec_lang['lpn_field_to']='Hasta';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Tipo de válvula';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='Qué hace la válvula. Una válvula de estrangulamiento mantiene una pérdida fija. Las otras tres mantienen una presión o un caudal, y se abren totalmente, se cierran o se cierran parcialmente a medida que cambia el agua. Cambiar el tipo coloca un número inicial nuevo en el ajuste de abajo, porque una presión no es un caudal y ninguno de los dos es un coeficiente de pérdida.';
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
$ec_lang['lpn_inp_drop_gpv_curve']='Esta válvula indica una curva de pérdida de carga que no está en el archivo. La válvula se incorporó sin curva, así que permanece totalmente abierta hasta que le asigne una.';
$ec_lang['lpn_gpv_curve_source']='Curva de pérdida de carga de la válvula';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='La curva del cuadro Bibliotecas que indica cuánta carga pierde esta válvula en cada caudal. Varias válvulas pueden usar la misma curva, y editarla allí cambia todas ellas. Esta válvula solo guarda la referencia; los puntos mismos se leen y se editan en Bibliotecas, Curvas.';
$ec_lang['lpn_field_valve_setting_pressure']='Ajuste de presión';
$ec_lang['lpn_field_valve_setting_pressure_tip']='La presión que mantiene la válvula. Una válvula reductora de presión mantiene la presión en su lado aguas abajo en este valor o por debajo. Una válvula sostenedora de presión mantiene la presión en su lado aguas arriba en este valor o por encima.';
$ec_lang['lpn_field_valve_setting_flow']='Ajuste de caudal';
$ec_lang['lpn_field_valve_setting_flow_tip']='La mayor cantidad de agua que deja pasar la válvula. Cuando quiere pasar menos agua que esto, la válvula queda totalmente abierta y no añade pérdida.';
$ec_lang['lpn_field_valve_setting']='Ajuste';
$ec_lang['lpn_field_valve_setting_loss']='Coeficiente de pérdida';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Cuánta carga quita la válvula de estrangulamiento, contada como un múltiplo de la carga de velocidad. Use 0 para una válvula totalmente abierta. Este único número es toda la pérdida de una válvula de estrangulamiento.';
$ec_lang['lpn_field_valve_diameter_tip']='Ancho de la abertura a través de la válvula. La velocidad del agua a través de la válvula se calcula a partir de este ancho, y la pérdida se deriva de esa velocidad.';
$ec_lang['lpn_field_valve_km_tip']='Pérdida del cuerpo de la válvula mientras la válvula está totalmente abierta, además de lo que quita el ajuste de la válvula. Se cuenta como un múltiplo de la carga de velocidad. Use 0 para ignorarla.';
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
$ec_lang['lpn_pump_curve_source_tip']='La curva del cuadro Bibliotecas que indica cuánta carga agrega esta bomba en cada caudal. Varias bombas pueden usar la misma curva, y editarla allí cambia todas ellas. Esta bomba solo guarda la referencia; los puntos mismos se leen y se editan en Bibliotecas, Curvas.';
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
$ec_lang['lpn_field_tag']='Etiqueta';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='Una etiqueta puede tener el significado que usted necesite, como una zona de presión o una orden de trabajo. Ningún cálculo aquí ni en EPANET la lee. Una etiqueta es una sola palabra: EPANET deja de leer en el primer espacio, así que un espacio se rechaza al escribirlo. Se conserva al importar y al exportar el archivo de EPANET.';
$ec_lang['lpn_pump_effic_curve']='Curva de eficiencia de la bomba';
$ec_lang['lpn_pump_effic_curve_tip']='La curva del cuadro Bibliotecas que indica qué tan eficiente es esta bomba en cada caudal. Varias bombas pueden usar la misma curva, y editarla allí cambia todas ellas. Esta bomba solo guarda la referencia; los puntos mismos se leen y se editan en Bibliotecas, Curvas.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Ninguna curva seleccionada';
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
$ec_lang['lpn_pump_effic_global']='Esta bomba no tiene curva de eficiencia seleccionada, así que funciona a la eficiencia fijada para toda la red, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Esta bomba indica una curva de eficiencia llamada {name}, que nada en este proyecto define, así que funciona a la eficiencia fijada para toda la red, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Modo: Selección. Haga clic en un elemento o una etiqueta para verlo o cambiarlo. Arrastre para mover un nodo o una etiqueta. Use la herramienta Vértices para agregar o quitar las curvas de una tubería.';
$ec_lang['lpn_mode_delete']='Modo: Eliminar. Haga clic en un elemento para quitarlo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Modo: Vértices. Los vértices de cada tubería se muestran como pequeños tiradores cuadrados. Haga clic en una tubería para agregar un vértice, haga clic en un tirador para quitarlo, o arrastre un tirador para moverlo. En este modo no se cambia nada más en el mapa.';
$ec_lang['lpn_mode_zoom_window']='Modo: Ventana de zoom. Haga clic en dos esquinas opuestas de un recuadro, o arrastre uno, en el mapa para acercarse a él.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='No hay nada seleccionado. Haga clic primero en un elemento del mapa y luego presione Eliminar.';
$ec_lang['lpn_mode_add_junction']='Modo: Agregar nudo. Haga clic en el mapa para colocar un nudo. Cambie al modo Selección para cambiar o mover elementos y etiquetas.';
$ec_lang['lpn_mode_add_reservoir']='Modo: Agregar embalse. Haga clic en el mapa para colocar un embalse. Cambie al modo Selección para cambiar o mover elementos y etiquetas.';
$ec_lang['lpn_mode_add_tank']='Modo: Agregar depósito. Haga clic en el mapa para colocar un depósito. Cambie al modo Selección para cambiar o mover elementos y etiquetas.';
$ec_lang['lpn_mode_add_pipe']='Modo: Agregar tubería. Haga clic en un nodo, y luego en otro nodo, para conectarlos. Haga clic en un espacio vacío entre ellos para curvar la línea, o presione Escape para empezar de nuevo. Cambie al modo Selección para cambiar o mover elementos y etiquetas.';
$ec_lang['lpn_mode_add_pump']='Modo: Agregar bomba. Haga clic en un nodo, y luego en otro nodo, para conectarlos. Haga clic en un espacio vacío entre ellos para curvar la línea, o presione Escape para empezar de nuevo. Cambie al modo Selección para cambiar o mover elementos y etiquetas.';
$ec_lang['lpn_mode_add_valve']='Modo: Agregar válvula. Haga clic en un nodo, y luego en otro nodo, para conectarlos. Haga clic en un espacio vacío entre ellos para curvar la línea, o presione Escape para empezar de nuevo. Cambie al modo Selección para cambiar o mover elementos y etiquetas.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Modo: Agregar texto. Haga clic en el mapa para colocar un Texto. Haga clic cerca de un nodo para adjuntar el Texto a ese nodo. Cambie al modo Selección para cambiar o mover elementos y etiquetas.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Use este modo para cambiar, mover y arrastrar cosas en el mapa. Este es el modo al que la página vuelve de manera predeterminada: regresa aquí por sí sola después de algunas acciones, como abrir un proyecto. Presionar Esc una segunda vez deselecciona lo que esté seleccionado.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Auto';
$ec_lang['lpn_method_switch_confirm']='Cambiar el método de fricción no cambia los números de rugosidad ya escritos en sus tuberías, y una rugosidad para un método no tiene sentido para otro. Revise cada tubería después de esto. ¿Cambiarlo de todos modos?';
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
$ec_lang['lpn_field_coord_tip']='Escriba una ubicación de coordenadas para colocar este nudo con exactitud. En un escenario esta ubicación se aplica solo en ese escenario, igual que arrastrarlo; en Base coloca el nudo en todas partes.';
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
$ec_lang['lpn_labels_mark_extrema']='Marcar los valores más alto y más bajo';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Marca el valor más alto de cada propiedad etiquetada en el mapa con una línea encima (una raya superior), y el más bajo con una línea debajo (una raya inferior).';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Aplicar a todos';
$ec_lang['lpn_settings_apply_to_all_tip']='Cada elemento de este tipo que ya está dibujado recibe un ID que empieza con este texto. Cada uno conserva su número. Un ID que no termina en un número se deja como está.';
$ec_lang['lpn_confirm_apply_prefix']='¿Renombrar {n} elementos para que sus ID empiecen con {prefix}? Cada uno conserva su número.';
$ec_lang['lpn_prefix_applied']='Se renombraron {n} elementos. Otros {skipped} se dejaron como estaban.';
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
$ec_lang['lpn_labels_priority_node_tip']='El orden en que se descartan los valores cuando dos etiquetas de nudo se superpondrían. El valor numerado 1 se descarta primero. Cuando queda un solo valor y las etiquetas siguen superponiéndose, se oculta una etiqueta entera: la que tenga la demanda más baja, la presión más cercana a la mitad del rango, o la elevación o carga más parecida a la de los nudos vecinos.';
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
$ec_lang['lpn_labels_use_units_tip']='Marque para mostrar la unidad en el cuadro Después y en la etiqueta, y para mantenerla al día cuando cambien las unidades. Desmarque para escribir su propio texto Después.';
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
$ec_lang['lpn_backdrop_scale_from_prompt1']='Haga clic en el punto de la imagen de fondo que debe quedarse donde está.';
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
$ec_lang['lpn_map_attach_remove_tip']='Quita el mapa mundial. El dibujo y sus coordenadas quedan intactos de cualquier manera.';
$ec_lang['lpn_map_attach_done']='El mapa mundial ahora está detrás de su dibujo, y su proyecto no cambió. Use Mapa, Mapa mundial, Separar para quitarlo de nuevo.';
$ec_lang['lpn_map_attach_removed']='El mapa mundial desapareció, y el dibujo está exactamente como estaba.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Su dibujo está sobre un mapa del mundo entero, en el océano en latitud cero y longitud cero. Primero encuentre su propio lugar: desplace y acerque el mapa detrás del dibujo, busque un nombre de lugar, o escriba una latitud y una longitud. El dibujo en sí no se mueve.';
$ec_lang['lpn_mapgeo_step1']='Paso 1 de 2: encuentre su lugar en el mundo';
$ec_lang['lpn_mapgeo_step2']='Paso 2 de 2: ajuste el mapa detrás de su dibujo';
$ec_lang['lpn_mapgeo_hint1']='Desplace y acerque el mapa detrás de su dibujo, o busque un lugar, o escriba una latitud y una longitud. Luego presione Colocar aproximadamente.';
$ec_lang['lpn_mapgeo_readjust_intro']='Su dibujo está donde lo colocó por última vez. Para moverlo a otro lugar, desplace y acerque el mapa detrás del dibujo, busque un nombre de lugar, o escriba una latitud y una longitud. El dibujo en sí no se mueve.';
$ec_lang['lpn_mapgeo_hint2']='Arrastre en cualquier lugar para deslizar el mapa bajo su dibujo. Su dibujo y cada coordenada en él permanecen exactamente donde están. Presione Georreferenciar aquí cuando el mapa esté bien.';
$ec_lang['lpn_mapgeo_gestures']='El zoom mueve su dibujo y el mapa juntos, para que pueda ver qué tan bien coinciden. Arrastrar mueve solo el mapa.';
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
$ec_lang['lpn_mapgeo_dial_help']='Deslice las dos barras, o escriba en los cuadros sobre ellas, para hacer el mapa más grande o más pequeño y para girarlo. El centro de cada barra es lo que dejó el paso 1, así que 1 y 0 significan dejarlo como está. Las teclas de flecha funcionan en ambas.';
$ec_lang['lpn_mapgeo_place']='Colocar aproximadamente';
$ec_lang['lpn_mapgeo_finish']='Georreferenciar aquí';
$ec_lang['lpn_mapgeo_cancelled']='El mapa mundial volvió a donde estaba, y su dibujo nunca se movió.';
$ec_lang['lpn_mapgeo_locked']='Termine con el botón Georreferenciar aquí, o presione Cancelar, antes de cambiar de proyecto o guardar. El mapa mundial todavía se está colocando.';
$ec_lang['lpn_backdrop_scale_prompt1']='Haga clic en dos puntos de la imagen de fondo, como los dos extremos de una escala gráfica. Luego escriba la distancia real entre ellos.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distancia real entre los dos puntos';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Haga clic en el punto base (en la imagen) para el movimiento.';
$ec_lang['lpn_backdrop_position_prompt2']='Elija el método para el punto de destino, y luego haga clic en Continuar.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Ajustando la imagen de fondo.';
$ec_lang['lpn_backdrop_target_label']='Moverlo a:';
$ec_lang['lpn_backdrop_target_node']='Un nodo';
$ec_lang['lpn_backdrop_target_free']='Cualquier punto del mapa';
$ec_lang['lpn_backdrop_target_coords']='Coordenadas que usted escribe';
$ec_lang['lpn_backdrop_coords_prompt']='Escriba las coordenadas X,Y a las que debe moverse ese punto';
$ec_lang['lpn_backdrop_continue']='Continuar';
$ec_lang['lpn_tool_settings']='Configuración';
$ec_lang['lpn_settings_show_titles']='Mostrar títulos de página';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Ocultar estos títulos';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Mostrar la ayuda de selección';
$ec_lang['lpn_settings_area_hint_tip']='Muestra la burbuja sobre el mapa que indica qué hará su próximo clic mientras selecciona un área.';
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
$ec_lang['lpn_push_confirm']='¿Reemplazar estas propiedades en todos los elementos existentes con los valores que ahora están fijados para los elementos nuevos? Los valores que haya escrito se sobrescribirán. Puede deshacer esto.';
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
$ec_lang['lpn_settings_custom_props_note']='Propiedades que usted mismo define para sus propios fines. Se guardan con el proyecto y los escenarios como todas las demás propiedades.';
$ec_lang['lpn_cp_design']='Diseño';
$ec_lang['lpn_cp_design_tip']='Una fila por cada propiedad personalizada, y cada una se abre para mostrar: Clave, Etiqueta, Aplica a, Validar como, Permitir o restringir, el campo de caracteres nombrado por esa elección, Límite inferior de longitud, Límite superior de longitud, Límite inferior, Límite superior.';
$ec_lang['lpn_cp_add']='Agregar propiedad personalizada';
$ec_lang['lpn_cp_add_tip']='Agrega una fila a la tabla de diseño y la abre para editarla.';
$ec_lang['lpn_cp_remove_tip']='Quita esta propiedad de la tabla de diseño. Los valores ya escritos en sus elementos se conservan en el archivo y vuelven a aparecer si diseña de nuevo la misma clave.';
$ec_lang['lpn_cp_none']='Todavía no se ha diseñado ninguna propiedad personalizada.';
$ec_lang['lpn_cp_unnamed']='Todavía sin nombre';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Clave';
$ec_lang['lpn_cp_key_tip']='Clave: una propiedad se guarda bajo este nombre. No se permiten espacios, y se le agrega un prefijo automáticamente para que su clave nunca choque con un campo integrado.';
$ec_lang['lpn_cp_label']='Etiqueta';
$ec_lang['lpn_cp_label_tip']='Etiqueta: esto es lo que ve un lector en el cuadro de propiedades, en Buscar y en el encabezado de una columna de tabla.';
$ec_lang['lpn_cp_applies']='Aplica a';
$ec_lang['lpn_cp_applies_tip']='Aplica a: lista de prefijos de ID, separados por comas, de los elementos que usan esta propiedad, como J,L,R.';
$ec_lang['lpn_cp_validate']='Validar como';
$ec_lang['lpn_cp_validate_tip']='Validar como: esto indica cómo debe verse un valor válido. Las reglas de mayúsculas y minúsculas solo reconocen el alfabeto inglés, una limitación declarada. Elija No validar para aceptar cualquier cosa.';
$ec_lang['lpn_cp_restrict']='Restringir estos caracteres';
$ec_lang['lpn_cp_restrict_tip']='Restringir estos caracteres: un valor puede usar únicamente los caracteres indicados aquí, o ninguno de ellos, donde "@" significa cualquier letra; "#" significa cualquier dígito numérico, y debe indicar por separado "-", "." y "," si están permitidos; y cualquier espacio en blanco debe ir entre otros caracteres.';
$ec_lang['lpn_cp_restrict_mode']='Permitir o restringir';
$ec_lang['lpn_cp_restrict_mode_tip']='Permitir o restringir: los caracteres indicados son, o bien los únicos que un valor puede usar, o bien los que no puede usar.';
$ec_lang['lpn_cp_restrict_allow']='Permitir solo estos caracteres';
$ec_lang['lpn_cp_minlength']='Límite inferior de longitud';
$ec_lang['lpn_cp_minlength_tip']='Límite inferior de longitud: cualquier entrada más corta se marca, que es la forma de encontrar las entradas vacías y las escritas a medias.';
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
// "Custom", not "Own" (Tom, 2026-08-14: *"I love 'custom'. 'Changed' is a little dangerous."*),
// and the reason is a TRANSLATION reason rather than an English one -- which is why it is worth
// a comment. "Own values" calques directly onto the standard term for EIGENVALUES in most of
// Europe: es valores propios, pt valores proprios, de Eigenwerte, cs vlastni hodnota, hr vlastita
// vrijednost, bg/ru/sr sobstveni. Ten languages in sprint 316 had to detect and route around that
// independently, and three of them, forced off the calque, landed on "CHANGED values" -- which is
// FALSE here, because a scenario's custom value may be identical to Base's (see
// lpn_scenario_override_tip, and the assertion in dev/lpn-spike/scenario-harness.js).
// "Custom" has no calque path into mathematics in any of them, so the trap does not exist to be
// routed around, and it says ownership without implying difference. Seven languages had already
// chosen exactly this family unprompted (fr personnalisees, it personalizzati, es exclusivos,
// pt individuais, ar mukhassasa, fa ekhtesasi, ro specifice).
$ec_lang['lpn_scenario_overrides']='N.º de valores exclusivos';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='El anillo ámbar indica que este elemento tiene un valor que pertenece solo al escenario {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Cada uno de esos valores se marca en el mapa con un anillo ámbar. Cambie a {base} para ver el dibujo sin ellos.';
$ec_lang['lpn_scenario_menu']='Escenarios';
$ec_lang['lpn_scenario_tip']='El conjunto de valores que el dibujo está mostrando y que la página está resolviendo ahora mismo. Haga clic para cambiar de escenario, o para agregar, renombrar o eliminar uno.';
$ec_lang['lpn_scenario_new']='Escenario nuevo…';
$ec_lang['lpn_scenario_new_name']='Escenario {n}';
$ec_lang['lpn_scenario_prompt_name']='Nombre para este escenario';
$ec_lang['lpn_scenario_rename']='Renombrar escenario…';
$ec_lang['lpn_scenario_delete']='Eliminar escenario';
$ec_lang['lpn_scenario_delete_confirm']='¿Eliminar el escenario {name}, y los {n} valores que le pertenecen solo a él? El dibujo en sí no cambia.';
$ec_lang['lpn_scenario_override']='Solo en este escenario';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Marcado significa que este valor pertenece solo a este escenario, incluso cuando es el mismo número que Base. Desmarque la casilla para volver a usar el valor de Base.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Escenario base: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} está fuera de la red en {scenario}. Sigue estando en el dibujo, y en sus otros escenarios.';
$ec_lang['lpn_scenario_push_btn']='Aplicar los valores de Base a todos los escenarios';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Todos los escenarios vuelven al valor de Base para las propiedades cuyas etiquetas se muestran ahora mismo. Se descartan los valores que pertenecen solo a esos escenarios.';
$ec_lang['lpn_alt_cat_text']='Texto';
$ec_lang['lpn_alt_cat_userdata']='Propiedades personalizadas';
$ec_lang['lpn_alt_cat_energy']='Costo de energía';
$ec_lang['lpn_alt_cat_fireflow']='Caudal contra incendios';
$ec_lang['lpn_alt_cat_constituent']='Constituyente';
$ec_lang['lpn_alt_cat_initial']='Configuración inicial';
$ec_lang['lpn_alt_cat_topology']='Activación de elementos';
$ec_lang['lpn_alt_cat_demand']='Demanda';
$ec_lang['lpn_alt_cat_physical']='Físico';
$ec_lang['lpn_alt_note']='Solo lectura. Base usa la alternativa Base de cada categoría. Cada escenario recibe su propia alternativa para toda categoría que se cambia, hija de la alternativa Base. El número es cuántos valores cambiados tiene.';
$ec_lang['lpn_alt_title']='Vista previa de alternativas';
$ec_lang['lpn_scenario_basic_tip']='Marcado, un escenario es simplemente los valores que usted fija en él. Sin marcar, este menú ofrece además la tabla de vista previa de Alternativas, que muestra cómo esos valores se agrupan por categoría e invita a sus comentarios.';
$ec_lang['lpn_scenario_basic']='Modo básico';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='¿Hacer que todos los escenarios usen los valores de Base para estas propiedades? Se descartan los valores que pertenecen solo a esos escenarios. Puede deshacer esto.';
$ec_lang['lpn_scenario_push_scenarios']='Escenarios afectados:';
$ec_lang['lpn_scenario_push_values']='Valores descartados:';
$ec_lang['lpn_scenario_push_none']='Ningún escenario tiene un valor exclusivo para ninguna de estas propiedades, así que nada cambiaría. No se descarta nada.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Prueba de flujo: Estática';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Calibración con prueba de flujo para una red de diseño con caudal 0. En este escenario, fije la demanda en todos los nudos en 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Prueba de flujo: Intermedia';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Calibración con prueba de flujo para una red de diseño con el primer caudal reportado. En este escenario, fije la demanda en el nudo por el que fluye en el primer caudal medido, y la demanda en todos los demás nudos en 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Prueba de flujo: Máxima';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Calibración con prueba de flujo para una red de diseño con el caudal máximo reportado. En este escenario, fije la demanda en el nudo por el que fluye en el caudal máximo medido, y la demanda en todos los demás nudos en 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Día promedio';
$ec_lang['lpn_scenario_preset_average_day_tip']='Multiplicador de demanda 1: cada demanda tal como se ingresó, que se toma como la demanda del día promedio.';
$ec_lang['lpn_scenario_preset_max_day']='5. Día máximo';
$ec_lang['lpn_scenario_preset_max_day_tip']='Multiplicador de demanda de 2,0 veces el día promedio, un valor provisional. La mayoría de los sistemas están entre 1,2 y 3,0 (National Research Council, 2006). Fije el de su propio sistema en Configuración, Cálculo, Hidráulica, Multiplicador de demanda.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Hora pico';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Multiplicador de demanda de 3,0 veces el día promedio, un valor provisional. La mayoría de los sistemas están entre 3,0 y 6,0 (National Research Council, 2006). Fije el de su propio sistema en Configuración, Cálculo, Hidráulica, Multiplicador de demanda.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Incendio más día máximo';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Demanda del día máximo (multiplicador 2,0). Ejecute Caudal contra incendios en este escenario: suma el caudal contra incendios en cada nudo a esta demanda.';
$ec_lang['lpn_delete_drops_overrides']='Eliminar este elemento también descarta {n} valores que sus escenarios tienen para él. ¿Continuar?';
$ec_lang['lpn_push_base_only']='Esta acción cambia el dibujo en sí, así que solo se puede hacer en {base}. Cambie a {base} e inténtelo de nuevo.';
$ec_lang['lpn_field_active']='Parte de esta red';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Desmarque esta casilla para dejar el elemento en el dibujo pero fuera de la red: se dibuja en gris y el solucionador lo ignora. En un escenario, así es como se activa y desactiva una tubería propuesta.';
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
$ec_lang['lpn_settings_emitter_exponent_tip']='El exponente de la ecuación de emisor de EPANET para aspersores y fugas: caudal = coeficiente x presión elevada a este exponente. Solo cambia el resultado donde un nodo tiene un emisor, lo cual por ahora significa una red leída de un archivo EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Leer DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Lee la elevación del DEM en este nodo y la muestra abajo. No se cambia nada en el cuadro Elevación. La resolución horizontal del DEM es de aproximadamente 30 m en la mayor parte de la Tierra, y más fina donde hay mejores datos.';
$ec_lang['lpn_elev_dem_use']='Usar DEM';
$ec_lang['lpn_elev_dem_use_tip']='Coloca la elevación del DEM en este nodo en el cuadro Elevación de arriba, reemplazando lo que había. Primero lee el DEM si todavía no se ha leído. Un solo Deshacer lo restablece.';
$ec_lang['lpn_elev_dem_none']='El DEM no tiene elevación para este nodo.';
$ec_lang['lpn_elev_dem_said']='Mapbox DEM indica {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Origen de la elevación';
$ec_lang['lpn_settings_elev_source_tip']='De dónde obtiene su elevación un nodo nuevo. La superficie del terreno se lee de Mapbox DEM, que tiene aproximadamente 30 m de resolución en la mayor parte de la Tierra, y más fina donde hay mejores datos.';
$ec_lang['lpn_settings_elev_source_typed']='La elevación escrita arriba';
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
$ec_lang['lpn_settings_accuracy_tip']='Qué tan cerca debe llegar el solucionador antes de detenerse, medido como la cantidad en que los caudales todavía cambian de una prueba a la siguiente. Un número más pequeño es más exacto y tarda más. Ambos solucionadores leen este mismo cuadro, y cada uno mide ese cambio contra un total distinto: el solucionador incorporado contra la suma de las demandas, EPANET contra la suma de los caudales de las líneas. Si se deja vacío, esta página usa una precisión más estricta que el valor predeterminado propio de EPANET.';
$ec_lang['lpn_settings_specific_gravity']='Gravedad específica';
$ec_lang['lpn_settings_viscosity']='Viscosidad relativa';
$ec_lang['lpn_settings_viscosity_tip']='La viscosidad del fluido en comparación con el agua a 20 grados Celsius. Solo cambia el resultado con el método de Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Máximo de pruebas';
$ec_lang['lpn_settings_trials_tip']='Cuántas pruebas se permiten antes de que el solucionador se dé por vencido con una red que no converge.';
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
$ec_lang['lpn_settings_unbalanced_tip']='Qué hacer con una red que ya agotó sus pruebas y todavía no converge. Permitir pruebas adicionales a menudo logra la convergencia. Detenerse reporta la última prueba tal como está, lo cual no es una solución. Solo el solucionador de EPANET lee este cuadro. El solucionador incorporado siempre se detiene y marca la respuesta como no convergida.';
$ec_lang['lpn_settings_unbalanced_continue']='Permitir pruebas adicionales';
$ec_lang['lpn_settings_unbalanced_stop']='Detenerse y reportar la última prueba';
$ec_lang['lpn_settings_unbalanced_trials']='Pruebas adicionales antes de reportar';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Cuántas pruebas adicionales permitir después de agotar el máximo de arriba, antes de reportar la última prueba. Solo el solucionador de EPANET lee este cuadro.';
$ec_lang['lpn_settings_head_error']='Límite de error de carga';
$ec_lang['lpn_settings_head_error_tip']='Una prueba adicional que el solucionador debe superar antes de detenerse: el mayor error de carga que queda en cualquier tubería. Cero significa no aplicar esta prueba. Solo el solucionador de EPANET lee este cuadro.';
$ec_lang['lpn_settings_flow_change']='Límite de cambio de caudal';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Una prueba adicional que el solucionador debe superar antes de detenerse: el mayor cambio en el caudal de cualquier tubería de una prueba a la siguiente. Cero significa no aplicar esta prueba. Solo el solucionador de EPANET lee este cuadro.';
$ec_lang['lpn_settings_damp_limit']='El amortiguamiento empieza en';
$ec_lang['lpn_settings_damp_limit_tip']='La precisión en la que el solucionador empieza a dar pasos más pequeños, lo cual puede ayudar a que una red oscilante converja. Cero significa que el solucionador nunca amortigua. Solo el solucionador de EPANET lee este cuadro.';
$ec_lang['lpn_settings_option_unset']='No indicado';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Un solo factor aplicado a la vez a todas las demandas de la red. Úselo para preguntar qué hace el sistema con un uso mayor o menor que el actual. No cambia los números que usted escribió. Un escenario puede tener el suyo propio, de modo que el día promedio, el día máximo y la hora pico son cada uno un número; déjelo en blanco en un escenario para usar el del proyecto.';
$ec_lang['lpn_settings_engine_native']='Resolver con el solucionador de EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Active esta opción para usar el solucionador incorporado donde sea posible. De lo contrario, siempre se usa el solucionador EPANET de la EPA de EE. UU. El solucionador incorporado no se usa en simulaciones de período extendido ni con una PRV, PSV o FCV activa. La primera vez que se usa el solucionador de EPANET, se descargan cerca de 650 KB, que luego se guardan en este dispositivo. Donde una tubería tiene una pérdida menor (localizada), los dos solucionadores difieren en los últimos dígitos: EPANET redondea el valor que usa para la gravedad, así que sus pérdidas menores resultan levemente menores que la forma exacta.';
$ec_lang['lpn_engine_loading']='Cargando el solucionador de EPANET…';
$ec_lang['lpn_engine_failed']='No se pudo cargar el solucionador de EPANET. Se muestra el solucionador incorporado en su lugar.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Resuelto con el solucionador de EPANET, porque estas válvulas se abren y cierran por sí solas:';
$ec_lang['lpn_unit_unknown']='Este dibujo indica una unidad que esta página no ofrece: {unit}. Todo se conserva y se muestra exactamente como llegó, y no se cambió nada. No se pueden dar resultados hasta que esta página conozca esa unidad, porque no sabe qué tan grande es una de ellas.';
$ec_lang['lpn_engine_manning_note']='Nota: con rugosidad de Manning, EPANET redondea la constante en la ecuación de Manning, así que la pérdida de carga resulta aproximadamente 0,6% menor que la forma exacta.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='El solucionador de EPANET no aceptó esta red, así que no se ejecutó.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='El solucionador de EPANET indicó: {message}';
$ec_lang['lpn_engine_refused_fallback']='Los números en pantalla provienen en cambio del solucionador incorporado.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Los números en pantalla provienen en cambio del solucionador incorporado. Este calcula un momento a la vez, así que esta es la red solo en {time}, con cada depósito todavía en su nivel inicial.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Estos controles nombran un elemento que ya no está en este proyecto, así que se dejaron fuera: {ids}';
$ec_lang['lpn_control_unreadable_note']='Estos controles no se pudieron leer, así que se dejaron fuera: {ids}';
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
$ec_lang['lpn_settings_show_arrows_tip']='Dibuja una flecha en cada tubería que muestra hacia dónde corre el agua. Las flechas aparecen después de un cálculo, y desactivarlas no cambia los resultados. Este ajuste se guarda con el proyecto.';
$ec_lang['lpn_settings_align_labels']='Alinear las etiquetas de tubería con las tuberías';
$ec_lang['lpn_settings_readability_bias']='Voltear una etiqueta boca abajo cuando se inclina más de esta cantidad de grados a la izquierda de la vertical';
$ec_lang['lpn_settings_readability_bias_tip']='Voltea una etiqueta para mantenerla derecha cuando se inclina más de esta cantidad de grados a la izquierda de la vertical.';
$ec_lang['lpn_settings_mask_labels']='Fondo sólido detrás de las etiquetas';
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
$ec_lang['lpn_settings_symbol_cap']='Evitar que los nudos escalen más grandes que';
$ec_lang['lpn_settings_symbol_cap_mid']='veces la longitud de la';
$ec_lang['lpn_settings_symbol_cap_post']='tubería del percentil';
$ec_lang['lpn_settings_symbol_cap_tip']='Un nudo deja de crecer sobre el terreno cuando su diámetro llegaría a ser tantas veces la longitud de la tubería en este percentil de todas las longitudes de tubería de la red. Más allá de ese punto en el mapa, los nudos, tuberías y otros símbolos se encogen en la pantalla al alejar el zoom en lugar de crecer sobre el terreno. Los embalses y depósitos son la excepción y mantienen su tamaño en pantalla en cualquier zoom.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacidad del símbolo (0 a 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacidad de la imagen de fondo (0 a 1)';
$ec_lang['lpn_settings_map_display']='Apariencia';
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
$ec_lang['lpn_time_clock_day']='Día {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Escriba una hora como horas y minutos, por ejemplo 2:30. Un número simple significa horas, así que 8 son ocho horas. Media hora es 0:30.';
$ec_lang['lpn_time_running']='Calculando la simulación de período extendido con el solucionador de EPANET.';
$ec_lang['lpn_time_no_engine']='El solucionador incorporado calcula un momento a la vez, así que esta es la red solo en {time}: cada patrón se lee en ese momento, y cada depósito permanece en su nivel inicial en lugar de llenarse y vaciarse. Conéctese a internet una vez para obtener el solucionador de EPANET, que ejecuta una simulación de período extendido.';
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
$ec_lang['lpn_settings_runbox_tip']='Un cuadro que informa cuánto ha avanzado una ejecución y qué encontró. Si está desactivado, una ejecución terminada dice lo mismo en la línea de estado durante unos segundos en su lugar. Este es un ajuste para este navegador, no para el proyecto.';
$ec_lang['lpn_time_run_failed']='La ejecución no terminó, así que no hay resultados para los momentos posteriores.';
$ec_lang['lpn_time_run_report']='Informe de ejecución de EPANET';
$ec_lang['lpn_time_run_report_copy']='Copiar';
$ec_lang['lpn_time_run_report_copied']='Copiado';
$ec_lang['lpn_time_run_report_tip']='Lo que el propio solucionador de EPANET imprimió sobre la última ejecución: si convergió, y cualquier advertencia que haya dado. Es el texto propio del solucionador, no el nuestro.';

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
$ec_lang['lpn_settings_sec_map']='Mapa y página';
$ec_lang['lpn_settings_sec_assets']='Elementos';
$ec_lang['lpn_settings_sec_calculation']='Cálculo';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Cliente';
$ec_lang['lpn_labels_customer_note']='Una etiqueta de cliente muestra los valores marcados aquí. Se dibuja al mismo tamaño de texto que cualquier otra etiqueta del mapa.';
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
$ec_lang['lpn_settings_page_note']='Se guarda en esta calculadora, no en el proyecto.';
$ec_lang['lpn_settings_hydraulics']='Hidráulica';
$ec_lang['lpn_settings_quality']='Calidad';
$ec_lang['lpn_settings_quality_track']='Parámetro de calidad';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Elija qué debe rastrear la ejecución a través de la red: cuánto tiempo lleva el agua en el sistema, de dónde proviene, o un producto químico que reacciona mientras viaja. Solo el producto químico necesita coeficientes.';
$ec_lang['lpn_settings_quality_source']='Nodo de rastreo';
$ec_lang['lpn_settings_quality_source_tip']='El nodo cuya agua se rastrea. Cada uno de los demás nodos muestra entonces el aporte de su agua que proviene de ese nodo.';
$ec_lang['lpn_quality_none']='Nada';
$ec_lang['lpn_quality_trace']='Rastreo de origen';
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
$ec_lang['lpn_quality_chemical_name_tip']='El producto químico que está rastreando, por ejemplo Cloro. Déjelo en blanco para la etiqueta predeterminada de EPANET, Chemical. Se muestra en sus informes, pero no se usa en los cálculos.';
$ec_lang['lpn_quality_mass_units']='Unidades de masa';
$ec_lang['lpn_quality_mass_units_tip']='La mitad de unidades de la entrada de calidad, las dos opciones propias de EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Tolerancia de calidad';
$ec_lang['lpn_quality_tolerance_tip']='Cuánto pueden diferir en concentración dos parcelas de agua contiguas antes de que EPANET las trate como una sola. En blanco usa el valor predeterminado propio de EPANET de 0.01.';
$ec_lang['lpn_quality_diffusivity']='Difusividad relativa';
$ec_lang['lpn_quality_diffusivity_tip']='Con qué facilidad se dispersa el producto químico en el agua, en relación con el cloro. En blanco usa el valor predeterminado propio de EPANET de 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Concentración de {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Concentración promedio de {chemical}';
$ec_lang['lpn_quality_initial']='Calidad inicial';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Cuánto producto químico tiene este nudo cuando comienza la ejecución. Un embalse conserva su propio valor durante toda la ejecución, que es como suele indicarse el residual que sale de una planta de tratamiento. En blanco significa 0.';
$ec_lang['lpn_result_concentration']='Concentración';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Cuánto producto químico queda en este punto después de haber viajado y reaccionado. Las unidades son las que usted indicó junto con el nombre del producto químico en Configuración, Cálculo, Calidad.';
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
$ec_lang['lpn_source_quality_tip']='Qué tan fuerte es la dosis. Para todos los tipos salvo el inyector de masa esto es una concentración, en las unidades indicadas junto al producto químico en Configuración, Cálculo, Calidad; para un inyector de masa es un flujo de masa por minuto. En blanco significa que no hay fuente de producto químico, funcionalmente equivalente a 0.';
$ec_lang['lpn_source_pattern']='Patrón de la fuente';
$ec_lang['lpn_source_pattern_tip']='Un patrón de tiempo que escala la dosis a lo largo de la ejecución, para una fuente que no es constante. Ningún patrón significa que la dosis es la misma en cada paso.';
$ec_lang['lpn_mixing_model']='Modelo de mezcla';
$ec_lang['lpn_mixing_model_tip']='Cómo se mezcla el agua ya presente en este depósito con el agua que entra. La mezcla completa agita todo el depósito a la vez. La mezcla en dos compartimentos llena primero una zona de entrada y pasa el resto. El flujo pistón FIFO mueve el agua en el orden en que llegó. El flujo pistón LIFO la apila, así que la última agua en entrar es la primera en salir. La elección cambia la edad del agua y el residual, y no cambia ninguna presión ni caudal.';
$ec_lang['lpn_mixing_mixed']='Mezcla completa';
$ec_lang['lpn_mixing_2comp']='Mezcla en dos compartimentos';
$ec_lang['lpn_mixing_fifo']='Flujo pistón FIFO';
$ec_lang['lpn_mixing_lifo']='Flujo pistón LIFO';
$ec_lang['lpn_mixing_fraction']='Fracción de mezcla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='La parte del volumen del depósito que ocupa la zona de entrada, entre 0 y 1. Solo la usa la mezcla en dos compartimentos. En blanco significa que todo el depósito es la zona de entrada.';
$ec_lang['lpn_reaction_bulk']='Coeficiente de reacción en el seno del agua';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reacción en el seno del agua (vea la Ayuda de EPANET), usada en cada tubería y depósito que no tenga la suya propia. Un número negativo hace decaer el producto químico y uno positivo lo aumenta. En blanco significa que no hay reacción en el seno del agua.';
$ec_lang['lpn_reaction_wall']='Coeficiente de reacción en la pared';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reacción en la pared de la tubería (vea la Ayuda de EPANET), usada en cada tubería sin valor propio. Un número negativo hace decaer el producto químico. En blanco significa que no hay reacción en la pared.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Reacción en el seno del agua (vea la Ayuda de EPANET). Un número negativo hace decaer el producto químico y uno positivo lo aumenta. En blanco significa usar el coeficiente fijado para toda la red en Configuración, Cálculo, Calidad.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Coeficiente de reacción';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reacción en el agua que contiene este depósito, como tasa en 1/día. Un número negativo hace decaer el producto químico y uno positivo lo hace crecer. El agua permanece en un depósito mucho más tiempo del que permanece en cualquier tubería, así que aquí suele perderse un residual. En blanco significa usar el coeficiente de reacción en el seno del agua fijado para toda la red en Configuración, Cálculo, Calidad.';
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
$ec_lang['lpn_reaction_order_tank_tip']='El exponente al que se eleva la concentración para la reacción en el agua contenida en un depósito, independiente del orden de reacción en el volumen para que un depósito pueda reaccionar con un orden distinto al de las tuberías. Se permite cualquier número real, y 1 es el valor predeterminado. EPANET lo indica como ORDER TANK en un archivo y no ofrece un cuadro para esto en su propia interfaz.';
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
$ec_lang['lpn_reaction_rough_corr_tip']='Correlaciona la reacción en la pared con la rugosidad propia de cada tubería, de modo que una tubería más rugosa reaccione más rápido. Cuando está activada, se calcula un coeficiente de pared para cada tubería a partir de la rugosidad de esa tubería, y el coeficiente de pared único de arriba deja de usarse. No se usa si se deja en blanco.';
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
$ec_lang['lpn_reports_epanet']='Ejecución de EPANET';
$ec_lang['lpn_energy_title']='Informe de energía de las bombas';
$ec_lang['lpn_energy_menu']='Energía de las bombas';
$ec_lang['lpn_energy_efficiency']='Eficiencia de la bomba (por ciento)';
$ec_lang['lpn_energy_efficiency_tip']='La eficiencia de motor a agua usada en cada bomba que no tenga su propia curva de eficiencia. EPANET usa 75 por ciento cuando no se indica nada.';
$ec_lang['lpn_energy_price']='Precio de la energía';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Cuánto cuesta un kilovatio-hora. Se aplica a cada bomba que no tenga su propio precio. En blanco significa 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Cuánto cuesta un kilovatio-hora en esta bomba. En blanco significa usar el precio fijado para toda la red en Configuración, Energía.';
$ec_lang['lpn_energy_price_pattern']='Patrón de precio';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Un patrón que multiplica el precio en cada paso del patrón, que es como se indica una tarifa fuera de horas pico. Déjelo vacío para un precio constante durante toda la ejecución.';
$ec_lang['lpn_energy_demand_charge']='Cargo por demanda máxima';
$ec_lang['lpn_energy_demand_charge_tip']='Lo que cobra la empresa de servicios por kW de la carga máxima demandada por las bombas del sistema.';
$ec_lang['lpn_energy_currency']='Moneda';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='Lo que escriba aquí se imprime junto a cada cifra de dinero. Es solo una etiqueta, pero sea consistente.';
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
$ec_lang['lpn_scncmp_menu_tip']='Resuelve todos los escenarios de este proyecto y compárelos lado a lado: la presión más baja y la velocidad más alta de cada uno.';
$ec_lang['lpn_scncmp_running']='Resolviendo todos los escenarios…';
$ec_lang['lpn_scncmp_empty']='Todavía no se ha dibujado nada, así que no hay nada que resolver.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Velocidad más alta';
$ec_lang['lpn_scncmp_at']='{value} en {id}';
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
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Estado';
$ec_lang['lpn_reports_status_tip']='Qué cambió durante la última simulación de período extendido, en orden de tiempo: bombas y válvulas que abren o cierran, depósitos que se llenan, se vacían, se llenan por completo o se secan, y pasos que no convergieron por completo.';
$ec_lang['lpn_status_title']='Informe de estado';
$ec_lang['lpn_status_needs_run']='El informe de estado indica qué cambió durante una simulación de período extendido. Configure un Tiempo total de simulación en Configuración, Cálculo, Tiempo, presione Calcular, y luego abra Agua, Informes, Informe de estado.';
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
$ec_lang['lpn_reports_full_tip']='Cada nudo y cada línea en cada paso de tiempo de informe de la última simulación, como una tabla que puede descargar o imprimir.';
$ec_lang['lpn_full_title']='Informe completo';
$ec_lang['lpn_full_needs_run']='El informe completo enumera cada nudo y cada línea en cada paso de tiempo de informe. Presione Calcular, y luego abra Agua, Informes, Informe completo.';
$ec_lang['lpn_full_note']='Una fila por nudo o línea por paso de tiempo de informe, en las unidades mostradas en el panel de Tablas. Una celda en blanco es una columna que esa cantidad no tiene. Descargar o imprimir incluye cada paso de tiempo; la tabla de abajo muestra uno a la vez.';
$ec_lang['lpn_full_step_label']='Paso de tiempo';
$ec_lang['lpn_full_download_csv']='Descargar CSV';
$ec_lang['lpn_full_print']='Imprimir informe';
$ec_lang['lpn_full_col_time']='Tiempo';
$ec_lang['lpn_full_col_type']='Tipo';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} filas.';
$ec_lang['lpn_calib_ts_note']='Los anillos son valores medidos del archivo de calibración.';
$ec_lang['lpn_calib_ts_point']='Medido en {id}, {time}: {v}';
$ec_lang['lpn_calib_corr_note']='Cada punto es una medición. Cuanto más cerca de la línea diagonal estén los puntos, más se parecen los valores calculados a los observados.';
$ec_lang['lpn_calib_point']='{id}, {time}: observado {o}, calculado {s}';
$ec_lang['lpn_calib_computed']='Calculado';
$ec_lang['lpn_calib_observed']='Observado';
$ec_lang['lpn_calib_axis_sim']='Calculado: {q}';
$ec_lang['lpn_calib_axis_obs']='Observado: {q}';
$ec_lang['lpn_calib_corr_none']='Correlación entre medias: necesita al menos dos ubicaciones cuyas medias difieran.';
$ec_lang['lpn_calib_corr_means']='Correlación entre medias: {r}';
$ec_lang['lpn_calib_network']='Red';
$ec_lang['lpn_calib_col_rms_err_tip']='Error cuadrático medio: la raíz cuadrada de la media de los cuadrados de las diferencias entre los valores observados y calculados.';
$ec_lang['lpn_calib_col_rms_err']='Error RMS';
$ec_lang['lpn_calib_col_mean_err_tip']='La media de las diferencias absolutas entre cada valor observado y el valor calculado en el mismo tiempo.';
$ec_lang['lpn_calib_col_mean_err']='Error medio';
$ec_lang['lpn_calib_col_sim_mean']='Media calculada';
$ec_lang['lpn_calib_col_obs_mean']='Media observada';
$ec_lang['lpn_calib_col_n']='N.º obs.';
$ec_lang['lpn_calib_col_location']='Ubicación';
$ec_lang['lpn_calib_tab_means']='Comparación de medias';
$ec_lang['lpn_calib_tab_corr']='Gráfico de correlación';
$ec_lang['lpn_calib_tab_stats']='Estadísticas';
$ec_lang['lpn_calib_no_pairs']='No se pudo comparar ninguna medición, así que no hay nada que graficar.';
$ec_lang['lpn_calib_needs_run']='Todavía no hay resultados con qué comparar. El informe se completa cuando se ha calculado la red.';
$ec_lang['lpn_calib_single']='Esta es una ejecución de un solo período, así que cada medición se compara con su único resultado, sea cual sea el tiempo que dé el archivo.';
$ec_lang['lpn_calib_no_value']='Mediciones sin valor calculado en su tiempo, omitidas: {n}.';
$ec_lang['lpn_calib_outside']='Mediciones fuera de los tiempos que reportó esta ejecución, omitidas: {n}.';
$ec_lang['lpn_calib_bad_lines']='Líneas que no se pudieron leer, omitidas: {lines}';
$ec_lang['lpn_calib_missing_count']='Mediciones omitidas porque su ubicación no está en esta red: {n}.';
$ec_lang['lpn_calib_missing']='Nombradas en el archivo pero no en esta red: {ids}.';
$ec_lang['lpn_calib_units']='Los valores del archivo se leen en las unidades de este proyecto: {unit}.';
$ec_lang['lpn_calib_file']='{file}: {n} mediciones en {m} ubicaciones.';
$ec_lang['lpn_calib_session']='Un archivo de calibración se conserva solo durante esta sesión. No se guarda con el proyecto ni en este dispositivo.';
$ec_lang['lpn_calib_none']='No hay ningún archivo de calibración cargado para este parámetro.';
$ec_lang['lpn_calib_load_tip']='Un archivo de texto con un ID de ubicación, un tiempo y un valor medido en cada línea. El tiempo se mide desde el inicio de la simulación, en horas decimales o horas:minutos. Un punto y coma inicia un comentario. Una línea con solo un tiempo y un valor pertenece a la ubicación de arriba.';
$ec_lang['lpn_calib_load']='Cargar archivo de calibración…';
$ec_lang['lpn_calib_param_tip']='La magnitud que mide el archivo de calibración. Se conserva un archivo por parámetro.';
$ec_lang['lpn_calib_param']='Parámetro';
$ec_lang['lpn_calib_title']='Informe de calibración';
$ec_lang['lpn_reports_calib_tip']='Compara los datos de campo medidos de un archivo de calibración con la última ejecución: estadísticas, un gráfico de correlación y comparaciones de medias.';
$ec_lang['lpn_reports_calib']='Calibración';
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
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Orden';
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
$ec_lang['lpn_library_patterns_tip']='Un patrón es una lista de multiplicadores que se repite. Cada uno se aplica durante un paso de tiempo del patrón, así que 24 números con un paso de una hora forman un día que se repite. Una demanda de 10 con un multiplicador de 1,5 es 15 en ese momento.';
$ec_lang['lpn_library_curves']='Curvas';
$ec_lang['lpn_library_curves_tip']='Una curva es una lista de puntos que indica cómo funciona algo: cuánta carga agrega una bomba en cada caudal, qué tan eficiente es en ese caudal, o cuánta carga pierde una válvula en cada caudal.';
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
$ec_lang['lpn_library_curve_values_tip']='Seleccione una o dos columnas de una hoja de cálculo, cópielas y péguelas en la primera celda donde quiera que caigan. Las filas se agregan a medida que se necesitan. También puede pegar líneas copiadas directamente de un archivo de EPANET, incluido el nombre de la curva.';
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
$ec_lang['lpn_library_curve_in_use']='Esta curva la usan {count} elementos: {ids}. Primero apúntelos a otra curva, y después elimine esta.';
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
$ec_lang['lpn_library_pipetypes_note']='Cada proyecto tiene su propia biblioteca de tipos de tubería. Puede dejar propiedades en blanco en una definición de tipo de tubería. Por ejemplo, un tipo de tubería que especifica una rugosidad y ningún diámetro está bien. Los tipos de tubería se asignan a las tuberías en su editor de propiedades. Editar una definición aquí cambia cada tubería que la referencia.';
$ec_lang['lpn_library_pipetype_add']='Agregar un tipo de tubería';
$ec_lang['lpn_library_pipetype_blank_tip']='Las propiedades en blanco en una definición de tipo de tubería se dejan para ingresarse individualmente en cada tubería.';
$ec_lang['lpn_library_pipetype_used_by']='Tuberías que usan este tipo';
$ec_lang['lpn_library_pipetype_unused']='Nada usa este tipo de tubería.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Este tipo de tubería lo usan {count} tuberías: {ids}. Sepárelo de ellas antes de eliminarlo.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Tipo de tubería';
$ec_lang['lpn_field_pipetype_tip']='El tipo de tubería de la biblioteca del proyecto que usa esta tubería. Las propiedades incluidas en el tipo de tubería quedan deshabilitadas para editar aquí. Separe el tipo de tubería para habilitar la edición aquí.';
$ec_lang['lpn_pipetype_none']='Ningún tipo de tubería seleccionado';
$ec_lang['lpn_pipetype_detach']='Separar del tipo de tubería';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Copia en la propia tubería los valores que esta lee de su tipo y deja de usar el tipo. Los valores de la tubería no cambian ahora, y de ahora en adelante puede editar estos valores aquí.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Accesorios';
$ec_lang['lpn_library_fittings_tip']='Una lista de accesorios es un conjunto de accesorios y sus cantidades que varias tuberías pueden referenciar. Suma un solo coeficiente de pérdida localizada.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Cada proyecto tiene su propia biblioteca de accesorios. Una lista de accesorios tiene accesorios con una cantidad para cada uno, y suma en un solo coeficiente de pérdida localizada. Tanto las tuberías como los tipos de tubería pueden referenciar una lista.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='Los accesorios que se ofrecen aquí son los trece de la tabla 3.3 del manual de usuario de EPANET 2.2. Elegir uno copia su coeficiente en la fila, donde puede cambiarlo. Un coeficiente depende del tamaño y la marca del accesorio, así que trate la tabla como un punto de partida y no como una respuesta.';
$ec_lang['lpn_library_fittings_add']='Agregar una lista de accesorios';
$ec_lang['lpn_library_fittings_used_by']='Tuberías que usan esta lista de accesorios';
$ec_lang['lpn_library_fittings_unused']='Nada usa esta lista de accesorios.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Esta lista de accesorios la usan {count} tuberías: {ids}. Sepárela de ellas antes de eliminarla.';
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
$ec_lang['lpn_library_import_curve_shape']='Estas curvas se trasladaron exactamente como las escribió el archivo, y una simulación no puede usar una hasta que su primera columna aumente de cada punto al siguiente: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Estos tipos de tubería hacen referencia a una lista de accesorios que este proyecto no tiene: {names}. Importe la biblioteca de accesorios del mismo archivo y la encontrarán.';
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
$ec_lang['lpn_field_fittings_tip']='Una lista de accesorios de la biblioteca del proyecto. Sus cantidades y coeficientes se suman en el coeficiente de pérdida localizada de esta tubería, y el cuadro del coeficiente queda entonces de solo lectura. Deje esto sin seleccionar para escribir usted mismo el coeficiente.';
$ec_lang['lpn_fittings_none']='Ninguna lista de accesorios seleccionada';
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
$ec_lang['lpn_inp_export_flat_heading']='Se guardó {file}';
$ec_lang['lpn_inp_export_flat_lead']='El archivo EPANET exportado es numéricamente equivalente a este proyecto. Pero no tiene lugar para lo siguiente:';
$ec_lang['lpn_inp_export_flat_types']='{n} tuberías aquí referencian {t} tipos de tubería. En el archivo, cada una de esas tuberías lleva su propia copia de los números, así que las respuestas son las mismas. Lo que el archivo no puede contener es el tipo de tubería en sí, así que editar una definición y que cada tubería la siga es algo que solo registra su propio archivo de proyecto.';
$ec_lang['lpn_inp_export_flat_coords']='Un archivo EPANET conserva una posición para cada nudo. Este escenario coloca {n} de ellos en otro lugar, y esas son las posiciones en el archivo. Cualquier otro escenario conserva sus propias posiciones solo en su archivo de proyecto.';
$ec_lang['lpn_inp_export_flat_fittings']='Un archivo EPANET no puede contener la lista de codos, válvulas y tés de su archivo de proyecto. El coeficiente de pérdida localizada de {n} tuberías aquí se suma a partir de una lista de accesorios. El total pasa al archivo tal como está, así que nada cambia en las respuestas.';
$ec_lang['lpn_library_controls']='Controles';
$ec_lang['lpn_library_controls_tip']='Un control es una sola frase que abre o cierra una línea, o le da un ajuste, cuando un nivel de agua, una presión o una hora lo indican.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Agregar un patrón';
$ec_lang['lpn_library_pattern_values']='Multiplicadores';
$ec_lang['lpn_library_pattern_values_tip']='Los multiplicadores, separados por espacios o comas. Pegue una columna de una hoja de cálculo si tiene una. La lista se repite mientras dure la ejecución, así que no hace falta que cubra toda la ejecución.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} multiplicadores, separados por {step}, que cubren {span}';
$ec_lang['lpn_library_pattern_none']='Sin patrón';
$ec_lang['lpn_settings_default_pattern']='Patrón de demanda predeterminado';
$ec_lang['lpn_settings_default_pattern_tip']='Todo nudo sin patrón usa este.';
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
$ec_lang['lpn_library_rules_tip']='Una regla es un párrafo breve que abre o cierra una línea, o le da un ajuste, cuando un nivel de agua, una presión, un caudal o una hora alcanza un valor que usted fija. Las reglas pueden probar más de una cosa a la vez, y pueden indicar qué hacer cuando la prueba falla.';
$ec_lang['lpn_library_rule_add']='Agregar una regla';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Una regla, en las palabras que usa EPANET, una cláusula por línea. Una primera línea la nombra: RULE 1. Luego una condición: IF TANK 2 LEVEL BELOW 17.1. Luego qué hacer al respecto: THEN PUMP 9 STATUS IS OPEN. Una última línea puede darle prioridad: PRIORITY 1. Agregue líneas AND u OR para probar más de una cosa, y líneas ELSE para indicar qué hacer cuando la prueba falla. Una condición puede leer LEVEL, HEAD, GRADE, PRESSURE o DEMAND en un nudo, FLOW, STATUS o SETTING en una línea, o TIME y CLOCKTIME en SYSTEM. Escriba los números en las unidades que muestra este proyecto; se convierten por usted. Deje las palabras clave en inglés; son lo que lee esta página y lo que lee EPANET.';
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
$ec_lang['lpn_result_demand_tip']='El caudal que este nodo extrae en el paso de tiempo mostrado: cada demanda base multiplicada por su propio patrón, sumadas entre sí. Se calcula, no se escribe, así que cambia con el reloj y no se puede editar.';
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
$ec_lang['lpn_field_head_pattern_tip']='Cómo sube y baja el nivel de agua de este embalse durante la ejecución. La carga de arriba se multiplica por el patrón.';
$ec_lang['lpn_field_pump_speed']='Velocidad relativa';
$ec_lang['lpn_field_pump_speed_tip']='1 es esta bomba girando a la velocidad con la que se midió su curva. 0,9 es la misma bomba girando más lento, lo que reduce la carga que agrega y el caudal que deja pasar. Un patrón de velocidad ocupa el lugar de este número mientras dura la ejecución.';
$ec_lang['lpn_field_speed_pattern']='Patrón de velocidad';
$ec_lang['lpn_field_speed_pattern_tip']='Cómo sube y baja la velocidad de esta bomba durante la ejecución. Cada multiplicador es la velocidad relativa para esa parte de la ejecución, y sustituye el ajuste Velocidad en lugar de escalarlo, así que un multiplicador de 0 detiene la bomba.';

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
$ec_lang['lpn_search_tip']='Busca una ciudad, una calle o un punto de referencia por nombre y mueve el mapa hasta allí. El primer uso pide su permiso, porque las palabras que escribe van al servicio de nombres de lugares de OpenStreetMap.';
$ec_lang['lpn_search_bar']='Buscar por nombre…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='Buscar por nombre de lugar envía las palabras que escribe a nominatim.openstreetmap.org, el servicio gratuito de nombres de lugares de la Fundación OpenStreetMap.';
$ec_lang['lpn_search_consent_2']='Este es un servicio distinto de las imágenes del mapa de calles detrás de su proyecto. Las imágenes solo dicen adónde está mirando. Una búsqueda dice lo que escribió. El servicio de nombres de lugares recibirá sus palabras de búsqueda y su dirección IP. No enviamos nada más, y no guardamos ningún registro de sus búsquedas.';
$ec_lang['lpn_search_consent_3']='¿Podemos enviar sus búsquedas al servicio de nombres de lugares?';
$ec_lang['lpn_search_consent_4']='Si dice que no, todo lo demás en esta página sigue funcionando exactamente como ahora, incluido Ir a una latitud y longitud. Recordamos un sí para no tener que volver a preguntar. Un no no se guarda en absoluto.';
$ec_lang['lpn_search_refused']='La búsqueda por nombre de lugar está desactivada, y no se envió nada. Aún puede usar Ir a una latitud y longitud.';
$ec_lang['lpn_search_prompt']='Busque un lugar por nombre. Una ciudad, una calle, un punto de referencia — por ejemplo: Petaluma, California';
$ec_lang['lpn_search_empty']='Escriba un nombre de lugar para buscar.';
$ec_lang['lpn_search_working']='Buscando…';
$ec_lang['lpn_search_busy']='Ya hay una búsqueda en curso. Espere su respuesta.';
$ec_lang['lpn_search_choose']='Coinciden varios lugares. ¿Cuál?';
$ec_lang['lpn_search_nochoice']='No se eligió nada, así que el mapa no se movió.';
$ec_lang['lpn_search_badchoice']='Ese no es uno de los números de la lista.';
$ec_lang['lpn_search_none']='No se encontró nada para ese nombre.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='El servicio de nombres de lugares nos pide reducir la velocidad. Espere un minuto y vuelva a intentarlo.';
$ec_lang['lpn_search_http']='El servicio de nombres de lugares respondió con un error.';
$ec_lang['lpn_search_timeout']='El servicio de nombres de lugares no respondió a tiempo. Todo lo demás en esta página funciona sin él.';
$ec_lang['lpn_search_unreadable']='El servicio de nombres de lugares respondió con algo que esta página no pudo leer.';
$ec_lang['lpn_search_offline']='No pudimos comunicarnos con el servicio de nombres de lugares. Puede que esté sin conexión. Todo lo demás en esta página funciona sin él, incluido Ir a una latitud y longitud.';
$ec_lang['lpn_search_toofast']='Una búsqueda por segundo — eso es lo que permite el servicio de nombres de lugares. Vuelva a intentarlo en un momento.';
$ec_lang['lpn_search_nofetch']='Este navegador no puede comunicarse con el servicio de nombres de lugares.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='Mapbox arma esto a partir de muchos conjuntos de datos de elevación públicos, así que su calidad depende por completo de dónde se encuentre. Donde existe un levantamiento lidar nacional, como USGS 3DEP en gran parte de Estados Unidos y sus equivalentes en otros países, puede ser mejor que un metro en horizontal y unas pocas décimas de metro en vertical. Donde solo existen datos globales, es de unos 30 m en horizontal y varios metros en vertical. Mapbox no nos dice cuál de los dos obtuvo usted. Trátelo como un mapa de curvas de nivel, no como un levantamiento: verifique todo aquello en lo que se apoye.';
$ec_lang['lpn_terrain_consent_1']='Rellenar elevaciones envía la posición de cada nodo que necesita una — su latitud y longitud — a api.mapbox.com, para consultar la altura del terreno allí.';
$ec_lang['lpn_terrain_consent_2']='Esta es una cuestión distinta de las imágenes del mapa detrás de su proyecto. Las imágenes solo dicen adónde está mirando. Estas posiciones son su red misma. Mapbox recibirá esas coordenadas y su dirección IP. No enviamos nada más: ni nombre, ni tuberías, ni proyecto. No guardamos ningún registro de esto, y nada se almacena en este dispositivo salvo su respuesta a esta pregunta.';
$ec_lang['lpn_terrain_consent_3']='¿Podemos enviar las posiciones de sus nodos a Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Si dice que no, todo lo demás en esta página sigue funcionando exactamente como ahora, y puede escribir las elevaciones usted mismo como antes. Recordamos un sí para no tener que volver a preguntar. Un no no se guarda en absoluto.';
$ec_lang['lpn_terrain_refused']='No se rellenaron las elevaciones, y no se envió nada. Puede escribirlas usted mismo como antes.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='¿Rellenar la elevación de {n} nodo(s) a partir de Mapbox DEM?';
$ec_lang['lpn_terrain_confirm_default_1']='Todos los nodos ya tienen una elevación, y {n} de ellos siguen en {v}, que es la elevación con la que empieza un nodo nuevo y no una que usted haya escrito.';
$ec_lang['lpn_terrain_confirm_default_2']='¿Reemplazar la elevación de esos {n} nodos con valores de Mapbox DEM?';
$ec_lang['lpn_terrain_keep']='{k} nodo(s) ya tienen una elevación y no se tocarán.';
$ec_lang['lpn_terrain_undo']='Un solo Deshacer (Ctrl-Z) los restablece a todos.';
$ec_lang['lpn_terrain_requests']='{n} solicitud(es) a api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='Ya se están rellenando las elevaciones. Espere a que terminen.';
$ec_lang['lpn_terrain_offmap']='Estas posiciones de nodo no están en el mapa de terreno, así que no se envió nada.';
$ec_lang['lpn_terrain_too_wide']='Estos nodos están repartidos en demasiada superficie de la Tierra para leerlos de una vez ({n} solicitudes de mosaico). No se envió nada.';
$ec_lang['lpn_terrain_cancelled']='No se cambió nada y no se envió nada.';
$ec_lang['lpn_terrain_nofetch']='Este navegador no puede comunicarse con el servicio de terreno.';
$ec_lang['lpn_terrain_working']='Leyendo la superficie del terreno…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='El servicio de terreno rechazó la solicitud ({status}), así que no se cambió ninguna elevación. Puede que el token de Mapbox que usa este sitio no permita la dirección web en la que se encuentra.';
$ec_lang['lpn_terrain_failed']='No pudimos comunicarnos con el servicio de terreno, así que no se cambió ninguna elevación. Puede que esté sin conexión. Todo lo demás en esta página funciona sin él.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='El servicio de terreno nos pide reducir la velocidad (429), así que no se cambió ninguna elevación. Vuelva a intentarlo en un minuto.';
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
$ec_lang['lpn_analyze_menu_tip']='Análisis que ejecutan la red en una copia: caudal contra incendios en cada nudo, la pérdida de cada tubería, bomba y válvula, y las demandas escaladas hacia arriba o hacia abajo.';
$ec_lang['lpn_analyze_menu']='Analizar';

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
$ec_lang['lpn_ff_menu']='Caudal contra incendios…';
$ec_lang['lpn_ff_menu_tip']='Pruebe los nudos uno por uno: cuánto puede entregar cada uno sin dejar de mantener la presión residual que usted fijó, y si extraer allí el caudal requerido saca algo más de sus límites.';
$ec_lang['lpn_ff_title']='Caudal contra incendios';
$ec_lang['lpn_ff_intro']='A cada nudo, por turno, se le pide que extraiga un caudal contra incendios además de la demanda que ya tiene. Nada en su proyecto se cambia; todo el cálculo se hace sobre una copia.';
$ec_lang['lpn_ff_scope']='Nudos a probar';
$ec_lang['lpn_ff_scope_tip']='Elija el conjunto antes de ejecutar. Probar todos los nudos en un sistema grande puede tardar varios minutos.';
$ec_lang['lpn_ff_all']='Todos';
$ec_lang['lpn_ff_selected']='Seleccionados';
$ec_lang['lpn_ff_no_junctions']='Este proyecto todavía no tiene nudos, así que no hay nada que probar.';
$ec_lang['lpn_ff_no_selection']='No hay ningún nudo seleccionado. Seleccione nudos o elija Todos los nudos.';
$ec_lang['lpn_ff_skipped']='{n} elementos seleccionados no son nudos, así que no se probaron.';
$ec_lang['lpn_ff_required']='Caudal contra incendios requerido';
$ec_lang['lpn_ff_required_tip']='El caudal que su código de incendios o su autoridad de bomberos exige en un hidrante. Cada nudo se prueba contra este número, a menos que tenga su propio caudal contra incendios requerido.';
$ec_lang['lpn_ff_required_own']='Los nudos que tienen su propio caudal contra incendios requerido se prueban contra ese en su lugar. Cantidad de ellos: {n}.';
$ec_lang['lpn_ff_required_node_tip']='El caudal contra incendios requerido en este nudo en particular, según el uso del suelo que atiende, tomado de su código de incendios o de su autoridad de bomberos. Déjelo en blanco y el nudo se prueba contra el número del cuadro Caudal contra incendios.';
$ec_lang['lpn_ff_residual']='Presión residual a mantener';
$ec_lang['lpn_ff_residual_tip']='La presión que el nudo debe seguir manteniendo mientras entrega el caudal contra incendios. AWWA M31 y NFPA 291 usan 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Verificación de diseño (efecto en el sistema)';
$ec_lang['lpn_ff_design_tip']='Una pregunta aparte de si el nudo puede entregar el caudal: con ese caudal extraído allí, ¿algo más cae por debajo de su presión mínima o supera su límite de velocidad? Elegir verificarlo no cuesta cálculo adicional.';
$ec_lang['lpn_ff_design_selected']='Seleccionados';
$ec_lang['lpn_ff_design_all']='Todos';
$ec_lang['lpn_ff_design_off']='Ninguna';
$ec_lang['lpn_ff_design_no_selection']='La verificación de diseño está configurada para los elementos seleccionados, y no hay ninguno seleccionado. Seleccione elementos o seleccione la opción Todos.';
$ec_lang['lpn_ff_minpressure']='Presión mínima permitida en el resto';
$ec_lang['lpn_ff_minpressure_tip']='Un nudo que cae por debajo de esto mientras otro extrae su caudal contra incendios se reporta como un problema de diseño.';
$ec_lang['lpn_ff_maxvelocity']='Velocidad máxima permitida';
$ec_lang['lpn_ff_maxvelocity_tip']='Una tubería que funciona por encima de esto mientras se extrae un caudal contra incendios se reporta como un problema de diseño.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='El caudal contra incendios se extrae en el nudo mismo. Ese es el método usado aquí, y es el habitual. El hidrante, su tubería lateral y su boquilla no se modelan, así que un hidrante real entrega menos que el caudal mostrado aquí.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Esto se calcula con el solucionador incorporado.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Esto se calcula con el solucionador de EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='El caudal contra incendios disponible es una búsqueda, así que toda la red se resuelve unas dieciséis veces por cada nudo probado. Un sistema grande tarda varios minutos. Puede detenerlo en cualquier momento y conservar lo que ya se calculó.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='Solo se prueba el paso de tiempo que está en pantalla ahora. El caudal contra incendios normalmente se prueba sumado a la demanda máxima diaria, así que configure la red en esa condición antes de ejecutar.';
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
$ec_lang['lpn_ff_summary']='{clean} nudos no tuvieron ningún problema. {fire} nudos fallaron el caudal contra incendios. {design} nudos afectaron al resto del sistema.';
$ec_lang['lpn_ff_summary_error']='{n} nudos no se pudieron resolver.';
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
$ec_lang['lpn_ff_design_none']='Nada en el conjunto elegido salió de sus límites mientras cualquier nudo extraía su caudal contra incendios.';
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
$ec_lang['lpn_ff_iso']='La Insurance Services Office (ISO) acredita a un solo hidrante como máximo {flow}. Ese límite de crédito no se aplicó aquí porque no sabemos a cuántos hidrantes puede representar un nodo.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Ya está por debajo de la residual antes de extraer cualquier caudal contra incendios';
$ec_lang['lpn_ff_err_converge']='La red no convergió.';
$ec_lang['lpn_ff_err_solve']='El solucionador reportó un error y no dio ninguna respuesta.';
$ec_lang['lpn_ff_err_not_junction']='No es un nudo';
$ec_lang['lpn_ff_err_unknown']='Sin respuesta. El código reportado fue {code}.';
$ec_lang['lpn_crit_skipped_dead']='Líneas de extremo muerto omitidas: {n}. Cada una aísla todo lo que hay después.';
$ec_lang['lpn_crit_skipdead_tip']='Una línea de extremo muerto es aquella cuya eliminación aísla nudos a los que solo se llega a través de ella, sin embalse ni depósito más allá. Su pérdida es todo lo que hay después, así que no se resuelve. El resumen dice cuántas se omitieron.';
$ec_lang['lpn_crit_skipdead']='Omitir extremos muertos';
$ec_lang['lpn_crit_stale']='El dibujo cambió, así que se borraron los resultados de criticidad. Vuelva a ejecutarlo.';
$ec_lang['lpn_crit_skipped']='{n} elementos seleccionados no son líneas, así que no se interrumpieron.';
$ec_lang['lpn_crit_busy']='Otro análisis se está ejecutando. Deténgalo o espere a que termine.';
$ec_lang['lpn_crit_no_links']='Este proyecto aún no tiene líneas, así que no hay nada que interrumpir.';
$ec_lang['lpn_crit_no_selection']='No hay ninguna línea seleccionada. Seleccione líneas o elija Todas las líneas.';
$ec_lang['lpn_crit_stopped']='Se detuvo después de {done} de {total} elementos. Los resultados de abajo son los ya terminados.';
$ec_lang['lpn_crit_working']='Trabajando: {done} de {total} elementos.';
$ec_lang['lpn_crit_baseline_below']='Nudos que ya están por debajo con nada roto: {n}. No se cuentan.';
$ec_lang['lpn_crit_summary']='{n} de {total} elementos dejan demanda sin atender o hacen caer un nudo por debajo de {pressure}.';
$ec_lang['lpn_crit_col_below']='Nudos bajo el mínimo';
$ec_lang['lpn_crit_col_cutoff']='Nudos aislados';
$ec_lang['lpn_crit_col_unserved']='Demanda no atendida';
$ec_lang['lpn_crit_col_asset']='Elemento';
$ec_lang['lpn_crit_minpressure_tip']='Es el mismo número que Presión mínima permitida en otras partes del análisis de Caudal contra incendios. Cambiarlo aquí lo cambia allá.';
$ec_lang['lpn_crit_minpressure']='Presión mínima permitida';
$ec_lang['lpn_crit_scope_selected']='Líneas seleccionadas';
$ec_lang['lpn_crit_scope_all']='Todas las líneas';
$ec_lang['lpn_crit_scope_tip']='Todas las tuberías, bombas y válvulas, o solo las seleccionadas en el mapa. Elija el conjunto antes de ejecutar.';
$ec_lang['lpn_crit_scope']='Líneas a interrumpir';
$ec_lang['lpn_crit_intro']='Cada elemento se saca de la red por turno, y la red se resuelve en el paso de tiempo que se ve en pantalla, en el escenario activo. No se cambia nada en su proyecto; toda la ejecución se hace en una copia.';
$ec_lang['lpn_crit_title']='Análisis de criticidad';
$ec_lang['lpn_crit_menu_tip']='Saque de la red, uno por uno, cada tubería, bomba y válvula, y vea qué pierde el sistema.';
$ec_lang['lpn_crit_menu']='Análisis de criticidad…';

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
$ec_lang['lpn_file_import_survey_tip']='Lee una lista de puntos topográficos de un archivo de texto y crea un nudo en cada punto, tomando los ajustes de elemento nuevo para todo lo que el archivo no indique. No se dibuja ninguna tubería, y ninguna fila se descarta jamás sin nombrarla. Lee el sistema de coordenadas que este proyecto ya usa, esté georreferenciado o no.';
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
$ec_lang['lpn_survey_err_ambiguous_coord']='Más de una columna de ese archivo podría ser el {axis} ({detail}), y esta página no elegirá entre ellas. Deje una de ellas nombrada como el {axis} e inténtelo de nuevo.';
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
$ec_lang['lpn_survey_report_clean']='Todos los puntos del archivo se importaron, y nada se cambió al hacerlo.';
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
