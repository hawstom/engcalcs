<?php

// Alh missing text declarations wilh falh back to English.

$ec_lang['u_depthFrac']='fração';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/sec';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% incl./compr.';
$ec_lang['u_grade']='incl./compr.';
$ec_lang['u_in2']='sq. in.';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='in';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='L/s';
$ec_lang['u_m2']='m^2';
$ec_lang['u_m3ps']='m^3/s';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='IMGD';
$ec_lang['u_afd']='ac-ft/d';
$ec_lang['u_lpm']='L/min';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='m^3/d';
$ec_lang['u_mh2o']='m H2O';
$ec_lang['u_mld']='ML/d';
$ec_lang['u_m']='m';
$ec_lang['u_mm2']='mm^2';
$ec_lang['u_mmh2o']='mm H2O';
$ec_lang['u_mm']='mm';
$ec_lang['u_mps']='m/s';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='bar';
$ec_lang['u_kgfcm2']='kgf/cm^2';
$ec_lang['u_s']='segundos (seg)';
$ec_lang['u_hr']='horas (h)';
$ec_lang['u_day']='dias (d)';
$ec_lang['u_lph']='L/hr';
$ec_lang['u_gph']='gal/hr';
$ec_lang['u_mmph']='mm/hr';
$ec_lang['u_inph']='in/hr';
$ec_lang['u_acft']='ac-ft';
$ec_lang['u_ft3']='ft^3';
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
$ec_lang['menu_help']='Ajuda';
$ec_lang['menu_libre']='Software Livre';
$ec_lang['template_welcome']='Deixe seus medos na porta. O amor é falado aqui. Você não está arruinando tudo. Aproveite também <a target="_blank" href="https://hawsedc.com/download.php">as ferramentas livres HawsEDC para AutoCAD</a>.';
$ec_lang['template_feedback']='Você consegue sugerir uma redação melhor para esta página, ou qualquer outra coisa? Quer ajudar ou aprender a criar ferramentas como estas? Por favor, entre em contato comigo.';
$ec_lang['template_printable_title']='Título imprimível';
$ec_lang['template_printable_subtitle']='Subtítulo imprimível';
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
$ec_lang['consent_body']='Podemos salvar um cookie de um dígito neste navegador para lembrar que já contamos esta página? Ele não registra nada sobre você nem nada que você digite. Sem ele, não conseguimos distinguir sua segunda visita da primeira visita de outra pessoa.';
$ec_lang['consent_accept']='Aceitar desta vez';
$ec_lang['consent_accept_all']='Aceitar sempre';
$ec_lang['consent_decline']='Recusar sempre';
$ec_lang['consent_current_granted']='Você permitiu isso. Limitamos o registro de visitas para este perfil de navegador.';
$ec_lang['consent_current_denied']='Você recusou isso. Não armazenamos nada para limitar o registro de visitas para este perfil de navegador.';
$ec_lang['consent_region_label']='Sua escolha sobre limitar o registro de visitas.';
$ec_lang['consent_settings_link']='Configurações de cookies';
$ec_lang['privacy_link']='Aviso de privacidade';
$ec_lang['terms_link']='Termos de uso';
$ec_lang['index_main_title']='Calculadoras de Engenharia Gratuitas Online';
$ec_lang['index_meta_desc_plain']='Calculadoras gratuitas de engenharia hidráulica para tubulações, canais, vertedouros e irrigação. Funcionam no navegador, offline, e estão disponíveis em 27 idiomas.';
$ec_lang['calc_set_units']='Definir unidades:';
$ec_lang['calc_set_units_tip']='Define a unidade de todos os campos de uma só vez. Não destrutivo: os números que você digitou continuam exatamente como estão, e cada um passa a ser lido na nova unidade. Um 6 continua sendo 6, mas agora significa 6 polegadas em vez de 6 milímetros.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='Restaurar padrões';
$ec_lang['calc_defaults_confirm']='Restaurar calculadora aos valores padrão originais?';
$ec_lang['points_data_note']='(ou Copiar/Colar usando a área de dados)';
$ec_lang['points_data_heading']='Dados da calculadora<br />(use Copiar para ver o formato)';
$ec_lang['points_data_copy']='Copiar';
$ec_lang['points_data_paste']='Colar';
$ec_lang['calc_inputs']='Entradas';
$ec_lang['calc_results']='Resultados';
$ec_lang['view_hide_line']='Ocultar esta linha';
$ec_lang['view_printable']='Versão Imprimível (recarregar/renovar para restaurar)';
$ec_lang['ec_name_label']='Salvar este cálculo:';
$ec_lang['ec_name_placeholder']='Nome';
$ec_lang['ec_name_tip']='Salva esses valores na URL para favoritos, recuperação do histórico e compartilhamento';
$ec_lang['calc_copy_link']='Copiar link';
$ec_lang['ec_related_calcs']='Calculadoras relacionadas:';
$ec_lang['calc_copy_link_done']='Copiado!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='Perda de carga em tubulação por Darcy-Weisbach';
$ec_lang['dw_main_title']='Calculadora gratuita online de perda de carga em tubulação por Darcy-Weisbach';
$ec_lang['dw_main_desc']='Perda de carga em tubulação para diâmetro, rugosidade e vazão informados, por Darcy-Weisbach';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='Altura de rugosidade absoluta, e, da parede da tubulação. Valores típicos: aço (novo) 0,046 mm, aço (usado) 0,15 mm, HDPE 0,003 mm, PVC/uPVC 0,0015 mm, concreto 0,3–3 mm.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s para água limpa a 20°C">Viscosidade cinemática, ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='Viscosidade cinemática, ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s para água limpa a 20°C';
$ec_lang['dw_reynolds_number']='Número de Reynolds, Re';
$ec_lang['dw_flow_regime']='Regime de escoamento';
$ec_lang['dw_regime_laminar']='laminar';
$ec_lang['dw_regime_transitional']='de transição';
$ec_lang['dw_regime_turbulent']='turbulento';
$ec_lang['dw_friction_factor_method']='Método do fator de atrito';
$ec_lang['dw_friction_factor']='Fator de atrito, f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='Perda de carga em tubulação por Hazen-Williams';
$ec_lang['hw_main_title']='Calculadora gratuita online de perda de carga em tubulação por Hazen-Williams';
$ec_lang['hw_main_desc']='Perda de carga em tubulação para diâmetro, coeficiente C e vazão informados, por Hazen-Williams';
$ec_lang['hw_hgl_1']='LP a jusante';
$ec_lang['hw_hgl_2']='LP a montante';
$ec_lang['hw_elev_up']='Elevação a montante';
$ec_lang['hw_pressure_up']='Pressão a montante';
$ec_lang['hw_elev_down']='Elevação a jusante';
$ec_lang['hw_pressure_down']='Pressão a jusante';
$ec_lang['hw_pressure_check']='Verificação de pressão';
$ec_lang['hw_pressure_ok_short']='Pressão positiva';
$ec_lang['hw_pressure_neg_short']='Pressão negativa';
$ec_lang['hw_pressure_neg']='A pressão a jusante está abaixo de zero. A linha piezométrica fica abaixo da tubulação, portanto a tubulação não escoaria plena e este resultado pode não ser válido.';
$ec_lang['hw_roughness']='Coeficiente de Hazen-Williams, C';
$ec_lang['hw_note_1']='<dl><dt>Esta calculadora não modela o perfil da tubulação entre as duas extremidades.</dt><dd>Ela utiliza apenas as elevações a montante e a jusante que você informa. Se o terreno subir mais alto que qualquer uma das extremidades em algum ponto intermediário, a pressão nesse ponto alto será menor que qualquer pressão apresentada aqui. Execute a calculadora novamente para o trecho entre a extremidade a montante e o ponto alto para verificar essa condição.</dd><dd>Onde a linha piezométrica fica abaixo da tubulação, a água está sob pressão negativa. O ar sai de solução, uma tubulação de parede fina pode colapsar, e água subterrânea contaminada pode ser succionada pelas juntas. Mantenha a linha sob pressão positiva em todos os pontos e considere uma válvula de ar em cada ponto alto.</dd><dt>A pressão a montante é uma condição de contorno que você fornece.</dt><dd>Leia-a em um manômetro, no nível de água de um reservatório (a altura da água acima da tubulação), ou em uma curva da bomba. Uma bomba fornece menos pressão à medida que a vazão aumenta, portanto use o ponto da curva que corresponde à vazão informada acima.</dd><dt>Some você mesmo os coeficientes de perda de carga localizada.</dt><dd>Some os valores de K de todas as válvulas, curvas, tês, medidores e entradas na linha, e informe esse total. Siga o link desse campo para valores típicos. Em uma adutora de transmissão longa, essas perdas são pequenas em comparação ao atrito, mas em tubulações curtas de estação elevatória elas podem representar a maior parte da perda.</dd></dl>';
$ec_lang['hw_notes_epanet_term']='As constantes de Hazen-Williams agora coincidem com o EPANET (agosto de 2026)';
$ec_lang['hw_notes_epanet_def']='Em agosto de 2026, o coeficiente e o expoente de Hazen-Williams foram alterados para coincidir com o EPANET. Os resultados de perda de carga diferem dos das versões anteriores desta página em até 0,1 por cento, muito menos que a incerteza do próprio valor de C.';
// Manning Irregular
$ec_lang['mi_menu']='Canal de seção irregular de acordo com Manning';
$ec_lang['mi_main_title']='Calculadora gratuita online de canal de seção irregular de acordo com Manning';
$ec_lang['mi_main_desc']='Calculadora de escoamento uniforme de Manning para canal de seção irregular';
$ec_lang['mi_waterSurfaceElevation']='Nível da superfície d\'água';
$ec_lang['mi_q_617']='<span class="ec-help" title="A vazão composta, Q, usando um n composto para cada região de acordo com Chow 6-17, velocidades iguais">Q <span class="ec-tip">?</span></span>';
$ec_lang['mi_xSecPoints']='Pontos da seção transversal';
$ec_lang['mi_groupPoint']='Ponto';
$ec_lang['mi_groupSegment']='Segmento';
$ec_lang['mi_groupRegion']='Região';
$ec_lang['mi_station']='Est.';
$ec_lang['mi_elevation']='Alt.';
$ec_lang['mi_n']='n<br />do seg-<br />mento';
$ec_lang['mi_is_bank']='Div. de<br />regiões<br />R<sub>h</sub>, Q<br />(Margem)';
$ec_lang['mi_tau']='Cisalh. de<br />fundo, τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />comp.';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n composto';
$ec_lang['mi_notes_1_def']='Esta calculadora segue o Manual de Referência do HEC-RAS ao calcular o n composto da região usando Chow (1959), página 136, equação 6-17 (não 6-18).';
$ec_lang['mi_notes_3_term']='Errata';
$ec_lang['mi_notes_3_def']='Encontrado e corrigido em 23 de agosto de 2026. Um segmento desenhado exatamente na vertical — dois pontos na mesma estaca, um acima do outro, que é como se desenha um canal retangular, uma galeria celular ou um muro de arrimo — não somava perímetro molhado. Resultados anteriores a essa data ficam altos demais para qualquer seção com uma parede vertical: um canal com 10 de largura e 5 de profundidade recebia um perímetro molhado de 10 em vez de 20, e a vazão saía cerca de 1,6 vez maior que a correta. Uma margem inclinada, por mais íngreme que fosse, nunca foi afetada, e uma parede acima do nível da água também não. Se você usou esta página em uma seção com uma parede vertical, execute-a novamente.';
$ec_lang['mi_notes_2_term']='Revestimento de rocha';
$ec_lang['mi_notes_2_def']='Use a Calculadora de Canal Trapecial de Manning para dimensionar o revestimento de rocha. Esta calculadora é mais adequada a seções naturais.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='Vazão em tubulação por Manning';
$ec_lang['mpf_main_title']='Calculadora gratuita online da fórmula de Manning para vazão em tubulação';
$ec_lang['mpf_main_desc']='Escoamento uniforme pela Fórmula de Manning para declividade e profundidade informadas';
$ec_lang['mpf_pipe_diameter']='Diâmetro da tubulação, d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='Coeficiente de rugosidade de Manning, n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">Declividade de atrito, S<sub>f</sub></a><span class="ec-help" title="Às vezes igual à declividade da tubulação. Siga o link para a explicação (somente em inglês)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='Profundidade relativa do escoamento, y/d<sub>0</sub>';
$ec_lang['mpf_flow']='Vazão, Q';
$ec_lang['mpf_flow_tip']='Vazão e profundidade calculadas para uma tubulação infinitamente longa. Para que essa vazão realmente entre na tubulação, pode ser necessária uma profundidade de montante maior. Veja as Notas abaixo para detalhes e um vídeo tutorial.';
$ec_lang['mpf_velocity']='Velocidade, v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="Energia cinética como uma altura de coluna de água, v²/2g">Carga de velocidade, h<sub>v</sub> <span class="ec-tip">?</span></span>';
$ec_lang['mpf_flow_area']='Área do escoamento, A';
$ec_lang['mpf_pipe_area']='Área da tubulação, A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='Área relativa, A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='Perímetro molhado, P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='Raio hidráulico, R<sub>h</sub>';
$ec_lang['mpf_top_width']='Largura superior, T';
$ec_lang['mpf_froude_number']='Número de Froude, Fr';
$ec_lang['mpf_shear_stress']='Tensão de cisalhamento média, τ';
$ec_lang['mpf_full_flow']='Vazão a seção plena, Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='Razão em relação à seção plena, Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>Este é o escoamento e a profundidade no interior de uma tubulação <em>infinitamente longa</em>.</dt><dd>Fazer o escoamento entrar na tubulação pode exigir uma profundidade de água significativamente maior. Acrescente pelo menos 1,5 vezes a carga de velocidade para estimar a profundidade de água a montante, ou <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">veja meu tutorial de 2 minutos</a> sobre cálculos padrão de nível de água em bueiros usando o <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, o programa gratuito de bueiros da Administração Federal de Rodovias dos EUA (U.S. Federal Highway Administration).</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>Projetando um esgoto sanitário?</dt><dd>Veja as <a target="_blank" href="/sewslope.php">tabelas de declividade mínima de esgoto</a> para tubulações de 4 a 96 polegadas (100 a 2400 mm), dadas em m/m, mm/m e porcentagem, e o estudo de <a target="_blank" href="/peakfact.php">fatores de pico para vazões muito baixas</a>. Ambos são documentos de referência somente em inglês.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='Informe um Q alvo positivo.';
$ec_lang['mpf_solver_no_solution']='Sem solução: Q excede a capacidade da tubulação em y/d0 = 93.8% (Qmax = {qmax} nas unidades selecionadas).';
$ec_lang['mpf_solve_btn']='Calcular';
$ec_lang['mpf_solve_for_flow']='para vazão, Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='Perda de carga em tubulação por Manning';
$ec_lang['mphl_main_title']='Calculadora gratuita online de perda de carga em tubulação por Manning';
$ec_lang['mphl_main_desc']='Perda de carga pela Fórmula de Manning para vazão a seção plena informada';
$ec_lang['mphl_pipe_length']='Comprimento, L';
$ec_lang['mphl_area']='Área, A';
$ec_lang['mphl_total_junction_k']='Coeficiente de perda localizada, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='Coeficiente de perda, k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='Coeficiente de perda de carga localizada (menor), km. Essas perdas ocorrem em junções de tubulação, entradas, saídas, curvas e válvulas — o termo "menor" é convencional, mas enganoso; em uma linha curta, elas podem igualar ou superar as perdas por atrito. Valores típicos de k: entrada de aresta viva 0,5, cada curva de 45° 0,2–0,3, válvula gaveta (totalmente aberta) 0,1, válvula borboleta 0,2, saída (para reservatório ou atmosfera) 1,0. Some todas as conexões para obter o km total. O valor padrão 2,0 pressupõe uma entrada, uma saída e duas curvas de 45°.';
$ec_lang['mphl_friction_slope']='Declividade de atrito';
$ec_lang['mphl_friction_loss']='Perda de carga por atrito, h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='Perda de carga localizada, h<sub>m</sub>';
$ec_lang['mphl_total_loss']='Perda total, h<sub>L</sub>';
$ec_lang['mphl_egl_1']='LE a jusante';
$ec_lang['mphl_egl_2']='LE a montante';
$ec_lang['mphl_hgl_egl_tip']='Este resultado pode não ser válido onde a tubulação sobe acima da linha piezométrica.';
$ec_lang['mphl_note_1']='<dl><dt>Esta calculadora não modela o perfil da tubulação entre as duas extremidades.</dt><dd>Se a LP ficar abaixo do topo da tubulação em algum ponto, este cálculo pode não ser válido.</dd><dt>Para uma condição de entrada aberta (bueiro), é necessário verificar as condições de controle de entrada.</dt><dd>1. A LP a montante deve estar acima da elevação do escoamento à profundidade normal a montante (e acima da tubulação!).</dd><dd>2. O nível de água a montante de um bueiro é melhor representado pela LE a montante do que pela LP a montante.</dd><dd>3. Veja <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">meu tutorial de 2 minutos</a> para cálculos simples de nível de água em bueiros usando o <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>, o programa gratuito de bueiros da Administração Federal de Rodovias dos EUA (U.S. Federal Highway Administration).</dd><dd>4. Esta página resolve apenas o caso de controle de saída: uma tubulação escoando plena, em que as condições a jusante determinam a carga. O projeto de bueiros é a tarefa de decidir se o controle é de entrada ou de saída, portanto use o HY-8 sempre que qualquer um dos dois puder governar.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='Canal trapezoidal de acordo com Manning';
$ec_lang['mtc_main_title']='Calculadora gratuita online da fórmula de Manning para canal trapezoidal';
$ec_lang['mtc_main_desc']='Escoamento uniforme de Manning em canal trapezoidal à declividade e profundidade dadas';
$ec_lang['mtc_bottom_width']='Largura da base, b';
$ec_lang['mtc_side_slope_1']='Declividade do lado 1, z<sub>1</sub> (horiz./vert.)';
$ec_lang['mtc_side_slope_2']='Declividade do lado 2, z<sub>2</sub> (horiz./vert.)';
$ec_lang['mtc_channel_slope']='Declividade do canal, S';
$ec_lang['mtc_flow_depth']='Profundidade do escoamento, y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">Ângulo da curva, β</a><span class="ec-help" title="Para o tamanho de rocha. Siga o link para o diagrama."><span class="ec-tip">?</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="Densidade relativa à água. Tipicamente ≈ 2,65 para rocha britada">Densidade relativa da rocha, sg <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_in']='Tamanho de rocha de projeto, D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n para o tamanho de rocha de projeto (método de Strickler)';
$ec_lang['mtc_n_blodgett']='n para o tamanho de rocha de projeto (método de Blodgett)';
$ec_lang['mtc_n_bathurst']='n para o tamanho de rocha de projeto (método de Bathurst)';
$ec_lang['mtc_n_pi']='n para o tamanho de rocha de projeto (método de Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett x Bathurst';
$ec_lang['mtc_pi_range_check']='Verificação da faixa P&I';
$ec_lang['mtc_pi_ok']='d50 dentro da faixa P&I';
$ec_lang['mtc_pi_ok_tip']='0,28–0,36 ft (Phillips & Ingersoll, 1998)';
$ec_lang['mtc_pi_out_of_range']='Fora da faixa';
$ec_lang['mtc_pi_tip']='Extrapolação além da faixa de dados de 0,28–0,36 ft usada para desenvolver esta equação — considere como uma verificação aproximada, não uma base de projeto';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="Segundo Isbash (1936) e o Condado de Maricopa, Arizona, EUA.">Tamanho de rocha angular requerido no fundo, D<sub>50</sub> (Isbash e MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="Segundo Isbash (1936) e o Condado de Maricopa, Arizona, EUA.">Tamanho de rocha angular requerido no lado 1, D<sub>50</sub> (Isbash e MC) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="Segundo Isbash (1936) e o Condado de Maricopa, Arizona, EUA.">Tamanho de rocha angular requerido no lado 2, D<sub>50</sub> (Isbash e MC) <span class="ec-tip">?</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='Calcula esta rede em cada horário hidráulico, do início ao fim do período.';
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="Segundo Maynord, Ruff e Abt (1989). Em uma curva, a rocha é dimensionada para uma velocidade de curva de 4/3 da média, segundo o Departamento de Rodovias da Califórnia (1970); o valor de 1,5 do próprio Maynord aplica-se a canais naturais.">Tamanho de rocha angular requerido, D<sub>50</sub> (Maynord, Ruff e Abt 1989) <span class="ec-tip">?</span></span>';
$ec_lang['mtc_d50_searcy']='Tamanho de rocha angular requerido, D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='Velocidade razoável para as hipóteses de escoamento uniforme.';
$ec_lang['mtc_vel_low']='Velocidade baixa; risco de sedimentação.';
$ec_lang['mtc_vel_high']='A velocidade é elevada e pode não ser realista; verifique a erosão do revestimento do canal, a profundidade adicional nas curvas e a perda de energia em expansões ou obstruções.';
$ec_lang['mtc_iteration_tip']='Escolha uma opção de rugosidade (recomenda-se Blodgett–Bathurst) e uma opção de tamanho de rocha (recomenda-se Isbash) para que a calculadora itere automaticamente até um tamanho de rocha uniforme para a vazão desejada. Veja as Notas abaixo para o método completo, ou digite seu próprio valor de rugosidade (siga o link para orientação) e ignore o tamanho de rocha para pular a iteração.';
$ec_lang['mtc_note_1']='<dl><dt>Iteração automática de tamanho de rocha e rugosidade de projeto</dt><dd>Escolha uma opção de rugosidade (Blodgett–Bathurst recomendado) e uma opção de tamanho de rocha de projeto (Isbash recomendado). Ajuste a profundidade e o fator de segurança do tamanho de rocha para alcançar sua vazão-alvo com um tamanho de rocha uniforme. Cada vez que você altera uma entrada, a calculadora repete estas etapas: 1. A rugosidade é calculada a partir do tamanho de rocha de projeto. 2. O valor de rugosidade do método escolhido é copiado para a entrada de rugosidade. 3. A vazão do canal e o tamanho de rocha exigido são calculados. 4. O tamanho de rocha de projeto é ajustado. 5. Repete até que o erro no tamanho de rocha de projeto seja muito pequeno.</dd><dt>Calculadora básica (sem iteração)</dt><dd>Digite o valor de rugosidade desejado. Ignore a área de entrada do tamanho de rocha de projeto.</dd></dl>';
$ec_lang['mtc_note_2_term']='Verificação de velocidade';
$ec_lang['mtc_note_2_def']='Velocidade alta implica que houve uma grande queda de elevação, que gerou essa energia específica elevada. Essa energia pode se dissipar rapidamente em expansões, curvas ou obstruções. Verifique se isso é razoável para o local.';
$ec_lang['mtc_solver_no_solution']='Nenhuma solução encontrada para a vazão Q dada com estas entradas do canal.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='Vertedor Simples';
$ec_lang['ws_main_title']='Calculadora Gratuita Online de Vazão em Vertedor Simples de Soleira Larga';
$ec_lang['ws_main_desc']='Calculadora de Vazão em Vertedor Simples de Soleira Larga';
$ec_lang['ws_weirLength']='Comprimento do vertedor, L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="Energia por unidade de peso de água — uma altura da coluna de água, não uma pressão">Carga, h <span class="ec-tip">?</span></span>';
$ec_lang['ws_weirCoefficient']='Coeficiente do vertedor, C<sub>w</sub>';
$ec_lang['ws_notes_heading']='Notas';
$ec_lang['ws_notes_we_term']='Equação do Vertedor';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='Vertedor Irregular';
$ec_lang['wi_main_title']='Calculadora Gratuita Online de Vazão em Vertedor Irregular Segmentado de Profundidade Variável';
$ec_lang['wi_main_desc']='Calculadora de Vazão em Vertedor Irregular';
$ec_lang['wi_weirPoints']='Pontos do vertedor';
$ec_lang['wi_pondingHeight']='Altura de represamento';
$ec_lang['wi_incrementalFlow']='Vazão incremental';
$ec_lang['wi_cumulativeFlow']='Vazão acumulada';
$ec_lang['wi_notes_we_def']='q = se (comprimento = 0) então 0 senão se (declividade=0) então cw*comprimento*d<sub>0</sub><sup>1.5</sup> senão cw/(2.5*declividade) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) onde d<sub>1</sub> e d<sub>0</sub> são sempre positivos ou zero';
// Orifice Flow
$ec_lang['or_main_menu']='Vazão por Orifício';
$ec_lang['or_main_title']='Calculadora Gratuita Online de Vazão por Orifício';
$ec_lang['or_main_desc']='Vazão por Orifício — Livre ou Submersa';
$ec_lang['or_shape_circular']='Circular';
$ec_lang['or_shape_rectangular']='Retangular';
$ec_lang['or_diameter']='<span class="ec-help" title="Diâmetro para circular; altura para retangular">Diâmetro ou altura, D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="Apenas para aberturas retangulares">Largura, W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="Fundo da abertura">Cota da soleira <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='Nível d\'água a montante';
$ec_lang['or_twe']='Nível d\'água a jusante';
$ec_lang['or_cd']='Coeficiente de descarga, C<sub>d</sub>';
$ec_lang['or_centroid_elev']='Cota do centroide';
$ec_lang['or_head']='<span class="ec-help" title="Energia por unidade de peso de água — uma altura da coluna de água, não uma pressão">Carga efetiva, h <span class="ec-tip">?</span></span>';
$ec_lang['or_area']='Área da abertura, A';
$ec_lang['or_regime']='Verificação do regime de orifício';
$ec_lang['or_regime_valid']='Saída livre';
$ec_lang['or_regime_submerged']='Orifício submerso';
$ec_lang['or_regime_submerged_tip']='TWE acima do centroide — regime de orifício ainda válido';
$ec_lang['or_regime_warn']='Fora do regime de orifício';
$ec_lang['or_regime_warn_tip']='Nível a montante abaixo do topo da abertura';
$ec_lang['or_regime_twe_above_hwe']='Verifique as entradas';
$ec_lang['or_regime_twe_above_hwe_tip']='Nível de jusante (TWE) acima do nível de montante (HWE)';
$ec_lang['or_notes_1_term']='Equação do Orifício';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). Para saída livre: h = HWE − centroide. Para escoamento submerso (TWE acima da soleira): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='Regime de Orifício';
$ec_lang['or_notes_2_def']='As equações de vazão por orifício aplicam-se quando o nível a montante está acima do topo da abertura. Quando o nível a montante está abaixo do topo, utilize uma equação de vertedor.';
$ec_lang['or_notes_3_term']='Coeficiente de Descarga';
$ec_lang['or_notes_3_def']='C<sub>d</sub> varia entre 0,60 e 0,65 para orifícios de borda viva. Entradas arredondadas ou reentrantes utilizam valores diferentes. Consulte o <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> ou o Manual de Referência Hidráulica do HEC-RAS para orientação.';
$ec_lang['or_notes_4_term']='Submersão';
$ec_lang['or_notes_4_def']='Quando o TWE está acima da soleira da abertura, esta calculadora aplica automaticamente a equação de orifício submerso, usando h = HWE − TWE. Quando o TWE é igual ou inferior à soleira, assume-se saída livre e h = HWE − centroide.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='Micro-Hidroelétrica';
$ec_lang['mhp_main_title']='Calculadora Gratuita de Potência Micro-Hidroelétrica';
$ec_lang['mhp_main_desc']='Calculadora de Potência de Micro-Hidroelétrica a Fio d\'Água';
$ec_lang['mhp_gross_head']='Altura bruta, H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="Diâmetro da conduta forçada (tubulação de adução)">Diâmetro da conduta forçada, D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='Comprimento, L';
$ec_lang['mhp_efficiency']='Rendimento da instalação, η (0–1)';
$ec_lang['mhp_vel_check']='Verificação da velocidade';
$ec_lang['mhp_hl_check']='Verificação da perda de carga';
$ec_lang['mhp_hnet']='Altura líquida, H<sub>net</sub>';
$ec_lang['mhp_power']='Potência produzida, P';
$ec_lang['mhp_annual_kwh']='P como energia anual';
$ec_lang['mhp_vel_low']='Velocidade baixa — risco de sedimentação e arrastamento de ar.';
$ec_lang['mhp_vel_high']='Velocidade elevada — verificar perdas de transição, energia disponível e golpe de aríete.';
$ec_lang['mhp_vel_ok_short']='OK';
$ec_lang['mhp_vel_high_short']='Alto';
$ec_lang['mhp_vel_low_short']='Baixo';
$ec_lang['mhp_vel_ok_tip']='A velocidade está na faixa eficiente para o projeto da conduta forçada.';
$ec_lang['mhp_hl_ok_tip']='A perda de carga é menor que 10% da carga bruta. Este diâmetro de tubulação é econômico.';
$ec_lang['mhp_hl_warn_tip']='A perda de carga é maior que 10% da carga bruta. Considere uma tubulação maior.';
$ec_lang['mhp_hl_bad_tip']='A perda de carga é maior que 20% da carga bruta. Redimensione a tubulação.';
$ec_lang['mhp_notes_1_term']='Perda de carga';
$ec_lang['mhp_notes_1_def']='Perda total na conduta forçada h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>, onde h<sub>f</sub> = f(L/D)(v²/2g) é a perda por atrito de Darcy-Weisbach e h<sub>m</sub> = k<sub>m</sub>·v²/2g cobre entradas, curvas e válvulas. Altura líquida H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='Velocidade';
$ec_lang['mhp_notes_2_def']='Verifique se a velocidade é razoável para o desnível disponível e o custo da tubulação. Velocidade muito baixa pode indicar tubulação sobredimensionada; velocidade muito alta pode aumentar as perdas por atrito e o risco de golpe de aríete.';
$ec_lang['mhp_notes_3_term']='Objetivo de perda de carga';
$ec_lang['mhp_notes_3_def']='Perdas na conduta forçada (tubulação de adução) inferiores a 10% da carga bruta são geralmente econômicas. O equilíbrio ótimo entre o custo da tubulação e a potência perdida situa-se frequentemente entre 4–6% para locais com eletricidade de preço alto.';
$ec_lang['mhp_notes_6_term']='Rendimento';
$ec_lang['mhp_notes_6_def']='Rendimento típico da instalação η varia de 0,70 a 0,85 para turbinas Pelton e de fluxo cruzado comuns em micro-hidroelétricas. Use 0,75 como uma estimativa conservadora inicial.';
$ec_lang['mhp_notes_7_term']='Energia Anual';
$ec_lang['mhp_notes_7_def']='A energia anual pressupõe operação contínua a pleno escoamento (8760 horas/ano). A produção real será menor devido a variação sazonal de escoamento, tempo de paragem para manutenção e fator de carga.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='Tempo de Esvaziamento de Lagoa e Tanque';
$ec_lang['odt_main_title']='Calculadora Gratuita Online de Tempo de Esvaziamento de Lagoa, Bacia ou Tanque (Orifício)';
$ec_lang['odt_main_desc']='Tempo de Esvaziamento de Lagoa, Bacia ou Tanque — Saída por Orifício, Método do Volume Cônico';
$ec_lang['odt_h1_elev']='Cota inicial da superfície d\'água';
$ec_lang['odt_a1']='Área inicial, A<sub>1</sub>';
$ec_lang['odt_h2_elev']='Cota final da superfície d\'água';
$ec_lang['odt_a0']='Área no nível do orifício, A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="Interpolada a partir do modelo cônico na cota final">Área final, A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='Verificação da cota final';
$ec_lang['odt_h2_ok']='Cota final acima do topo do orifício';
$ec_lang['odt_h2_warn']='Cota final igual ou abaixo do topo do orifício';
$ec_lang['odt_h2_warn_tip']='Topo do orifício = centroide + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="Diâmetro (circular) ou altura (retangular)">Orifício D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="Apenas retangular">Largura do orifício, W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='Tempo de esvaziamento (s)';
$ec_lang['odt_t_min']='Tempo de esvaziamento (min)';
$ec_lang['odt_t_hr']='Tempo de esvaziamento (h)';
$ec_lang['odt_t_day']='Tempo de esvaziamento (dias)';
$ec_lang['odt_notes_1_term']='Fórmula';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) fornece o tempo de esvaziamento da carga H até o orifício. Tempo de esvaziamento = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>), onde H<sub>1</sub> = cota inicial − cota do orifício, H<sub>2</sub> = cota final − cota do orifício.';
$ec_lang['odt_notes_2_term']='Método';
$ec_lang['odt_notes_2_def']='O método do volume cônico modela a lagoa ou bacia como uma seção cônica entre a área inicial A<sub>1</sub> na superfície inicial da água e a área A<sub>0</sub> na cota do centroide do orifício. A<sub>2</sub>, a área da lagoa na cota final, é interpolada a partir de A<sub>1</sub> e A<sub>0</sub> usando o modelo de seção cônica. O tempo de esvaziamento da cota inicial até a cota final é igual ao tempo total de esvaziamento de H<sub>1</sub> até o orifício menos o tempo restante de H<sub>2</sub> até o orifício.';
$ec_lang['odt_h1']='<span class="ec-help" title="Cota inicial da superfície d\'água menos a cota do centroide do orifício">Carga inicial, H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='Vazão máxima, Q<sub>max</sub>';
$ec_lang['odt_vol']='Volume esvaziado';
$ec_lang['odt_sketch_start']='Início';
$ec_lang['odt_sketch_end']='Fim';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='Espaçamento de emissores, S<sub>e</sub>';
$ec_lang['ip_sl']='Espaçamento de laterais, S<sub>l</sub>';
$ec_lang['ip_n_e']='Emissores por lateral, n<sub>e</sub>';
$ec_lang['ip_n_l']='Laterais por setor, n<sub>l</sub>';
$ec_lang['ip_d']='Lâmina de aplicação desejada, d';
$ec_lang['ip_a_e']='Área por emissor, A<sub>e</sub>';
$ec_lang['ip_pr']='Taxa de aplicação, PR';
$ec_lang['ip_q_lat']='Vazão por lateral, Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='Vazão do setor, Q<sub>zone</sub>';
$ec_lang['ip_t_run']='Tempo de funcionamento (horas)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='Infiltração em Canal';
$ec_lang['cs_main_title']='Calculadora Gratuita Online de Perda por Infiltração e Eficiência de Condução em Canal';
$ec_lang['cs_main_desc']='Perda por Infiltração em Canal & Eficiência de Condução — Método de Entrada-Saída';
$ec_lang['cs_Q_in']='Vazão entrada, Q<sub>in</sub>';
$ec_lang['cs_Q_out']='Vazão saída, Q<sub>out</sub>';
$ec_lang['cs_L']='Comprimento do trecho, L';
$ec_lang['cs_Q_loss']='Taxa de perda por infiltração, Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='Verificação de medição';
$ec_lang['cs_pct_loss']='Fração perdida';
$ec_lang['cs_Ec']='Eficiência de condução, E<sub>c</sub>';
$ec_lang['cs_Ec_check']='Classificação de eficiência';
$ec_lang['cs_Vol_day']='Volume diário perdido';
$ec_lang['cs_Vol_year']='Volume anual perdido';
$ec_lang['cs_Q_loss_per_L']='Perda por unidade de comprimento, Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='Valor da água';
$ec_lang['cs_lining_cost']='Custo de revestimento';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="Objetivo de eficiência de condução após revestimento; fração 0–1">Objetivo de revestimento, E<sub>c,target</sub> <span class="ec-tip">?</span></span>';
$ec_lang['cs_lining_area']='Área de revestimento, L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='Valor anual perdido';
$ec_lang['cs_annual_value_recovered']='Valor anual recuperado';
$ec_lang['cs_lining_total_cost']='Custo total de revestimento';
$ec_lang['cs_payback_years']='<span class="ec-help" title="Retorno simples = custo total de revestimento ÷ valor anual recuperado">Período de retorno <span class="ec-tip">?</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — infiltração detectada';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — sem perda mensurável';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — verificar medições';
$ec_lang['cs_Ec_good']='Boa — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='Regular — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='Ruim — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='O método de entrada-saída estima a infiltração medindo a vazão na entrada e na saída de um trecho de canal: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. Eficiência de condução E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. O volume anual pressupõe operação contínua a plena vazão; a perda real é menor em canais sazonais ou com vazão parcial.';
$ec_lang['cs_notes_2_term']='Classificações de Eficiência';
$ec_lang['cs_notes_2_def']='Canais de terra sem revestimento típicos: E<sub>c</sub> = 60–80%. Canais de terra bem mantidos: 75–85%. Canais revestidos em concreto: 90–98%. Perdas por infiltração acima de 30% da vazão de entrada frequentemente justificam o investimento em revestimento. (USBR, FAO)';
$ec_lang['cs_notes_3_term']='Retorno de Investimento em Revestimento';
$ec_lang['cs_notes_3_def']='Insira o valor da água e o custo de revestimento em qualquer moeda coerente. Área de revestimento = comprimento do trecho × perímetro molhado — o perímetro molhado da seção do canal na profundidade de escoamento medida (largura de fundo mais ambos os taludes molhados). Valor anual recuperado pressupõe que o canal revestido atinge continuamente o E<sub>c</sub> alvo. O retorno real será mais longo para canais sazonais ou se o revestimento não atingir a eficiência alvo.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>, 3.ª ed. (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='Sobre';
$ec_lang['install_main_menu']='Instalar';
$ec_lang['install_main_title']='Instalar EngCalcs';
$ec_lang['install_main_desc']='Adicionar ao dispositivo para uso offline';
$ec_lang['install_intro']='O EngCalcs é um Aplicativo Web Progressivo (PWA). Depois de instalado, todas as calculadoras funcionam totalmente offline — sem necessidade de conexão com a internet.';
$ec_lang['install_android_heading']='Android (Chrome)';
$ec_lang['install_android_steps_html']='<li>Abra qualquer página de calculadora no Chrome.</li><li>Toque no botão <strong>⬇ Instalar</strong> na barra de navegação superior, ou toque no menu do navegador (⋮) e escolha <strong>Adicionar à tela inicial</strong>.</li><li>Toque em <strong>Instalar</strong> na janela que aparecer.</li><li>O EngCalcs aparece na sua tela inicial e funciona offline.</li>';
$ec_lang['install_now_btn']='⬇ Instalar Agora';
$ec_lang['install_prompt_unavailable']='Solicitação de instalação indisponível — use o menu do seu navegador.';
$ec_lang['install_ios_heading']='iOS (Safari)';
$ec_lang['install_ios_steps_html']='<li>Abra qualquer página de calculadora no Safari.</li><li>Toque no botão <strong>Compartilhar</strong> (ícone de caixa com seta para cima).</li><li>Role para baixo e toque em <strong>Adicionar à Tela de Início</strong>.</li><li>Toque em <strong>Adicionar</strong>. O EngCalcs aparece na sua tela inicial.</li>';
$ec_lang['install_ios_note']='No iOS, a instalação sempre usa o menu Compartilhar — não há solicitação automática de instalação.';
$ec_lang['install_desktop_heading']='Computador (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>Abra qualquer página de calculadora.</li><li>Clique no <strong>ícone de instalação</strong> (⊕ ou ícone de computador) na barra de endereço do navegador, ou abra o menu do navegador e escolha <strong>Instalar EngCalcs…</strong></li><li>Clique em <strong>Instalar</strong>. O EngCalcs abre como uma janela de aplicativo independente.</li>';
$ec_lang['install_firefox_heading']='Firefox / Outros Navegadores';
$ec_lang['install_firefox_body']='Se o seu navegador não oferecer uma opção de instalação, nada se perde: use as calculadoras normalmente no navegador, e depois da sua primeira visita as páginas são armazenadas em cache automaticamente para uso offline. O Firefox no computador é o caso mais comum.';
$ec_lang['install_cached_heading']='O Que Fica Armazenado em Cache';
$ec_lang['install_cached_body']='Na primeira vez que você instala o EngCalcs, todas as páginas de calculadoras e seus arquivos de suporte (scripts, estilos) são salvos automaticamente no seu dispositivo. Depois disso, tudo funciona sem conexão com a internet. Sua escolha de idioma é lembrada desde sua última visita online.';
$ec_lang['contact_main_menu']='Contato';
$ec_lang['about_main_title']='Sobre as calculadoras de engenharia HawsEDC';
$ec_lang['about_main_desc']='Missão, software livre e contribuições';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>Missão</h3><p>As Calculadoras de Engenharia HawsEDC são oferecidas gratuitamente na internet desde 2010. Elas existem para servir engenheiros e trabalhadores de campo em todo o mundo — especialmente aqueles que trabalham em regiões com escassez de água, recursos limitados ou pouco atendidas. Essas ferramentas fazem parte de uma missão humanitária mais ampla: dizer a cada ser humano, da maneira mais prática e eficaz possível, <a target="_blank" href="https://tomsthird.blogspot.com/2026/10/why-engineering-calculator-needs-to.html">que é amado e prezado para sempre, que não tem nada a temer e que não vai arruinar tudo</a>.</p><p>As calculadoras são o veículo. O destino é um mundo livre de sofrimento.</p><h3>Licença de Software Livre e de Código Aberto</h3><p>Todo o código é lançado sob a <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">Licença Pública Geral GNU v3.0 ou posterior</a> — livre como em liberdade. Você pode usar, estudar, modificar e redistribuir o código sob os mesmos termos.</p><p>O site que o hospeda é oferecido gratuitamente hoje e desde 2010; se um dia isso não for mais possível, o software continua sendo seu para executar.</p><p>Copyright © 2009–2026 Thomas Gail Haws.</p><h3>Código Fonte</h3><p>O código fonte completo está disponível publicamente no GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>Você pode navegar pelo código, registrar problemas ou fazer um fork do repositório lá.</p><h3>Como Contribuir</h3><p>Toda ajuda é bem-vinda. <a href="contact.php">Entre em contato com Tom Haws</a>.</p><ul><li><strong>Traduções:</strong> Sugira uma redação melhor. Melhore ou adicione um idioma.</li><li><strong>Relatórios de erros:</strong> Use o formulário de feedback em qualquer página de calculadora, ou registre um problema no GitHub.</li><li><strong>Novas calculadoras:</strong> Ideias para ferramentas de engenharia hidráulica que sirvam a trabalhadores de campo e profissionais de irrigação são especialmente bem-vindas.</li><li><strong>Hospedagem:</strong> Se você puder espelhar essas calculadoras para uma região com conectividade limitada, entre em contato comigo.</li></ul><h3>Uso Offline</h3><p>Abra qualquer calculadora uma vez enquanto estiver conectado e todas elas continuam funcionando quando você não estiver: seu navegador armazena a suíte inteira à medida que você a usa. O mecanismo é um <strong>Aplicativo Web Progressivo (PWA)</strong>, se quiser ler a respeito. Depois disso, todas as calculadoras funcionam offline — sem necessidade de internet.</p><p>No Android ou iOS, use a opção "Adicionar à tela inicial" do seu navegador para instalar o EngCalcs como um aplicativo no seu dispositivo. No desktop, procure o ícone de instalação na barra de endereços do seu navegador.</p><p>Você também pode salvar qualquer calculadora individualmente usando o menu "Salvar como…" do seu navegador para uso offline pontual.</p><h3>Contato</h3><p>Tom Haws, engenheiro hidráulico e fundador dessas calculadoras.<br />Use o formulário de feedback em qualquer página de calculadora, ou acesse o código fonte no <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='Envie uma mensagem para Tom Haws';
$ec_lang['contactYourName']='Seu nome:';
$ec_lang['contactYourEmail']='Seu endereço de e-mail:';
$ec_lang['contactSubject']='Assunto:';
$ec_lang['contact_message']='Mensagem:';
$ec_lang['contactSpamPrefix']='Five (cinco) plus (e) one (um) equals (são) ';
$ec_lang['contactSpamPostfix']='(Por favor, escreva em inglês com letras. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Enviar Mensagem';
$ec_lang['contact_success']='Obrigado por dedicar seu tempo para escrever.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='Projeto de Rampa em Enrocamento (Robinson)';
$ec_lang['rc_main_title']='Calculadora Gratuita de Projeto de Rampa em Enrocamento — Robinson (1998)';
$ec_lang['rc_main_desc']='Dimensionamento de Rampa em Enrocamento — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='Declividade do fundo da calha, S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="Vazão por unidade de largura na entrada da calha. Para um canal de largura de base B com vazão total Q, usar q_t = Q / B.">Vazão específica total, q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='Porosidade do enrocamento, n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="Densidade relativa à água. Granito britado ou basalto típico ≈ 2,65. Faixa válida de Robinson: 2,54 a 2,82.">Densidade relativa da rocha, sg <span class="ec-tip">?</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="Desvio padrão granulométrico. Rocha uniforme ≈ 1,25. Faixa válida Robinson: 1,15 a 1,47.">Graduação SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="O remanso (Hp > yn) é favorável — reduz erosão a montante. (USDA)">Tirante normal no canal de entrada, y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="Eq. 1 (S0 < 0,10) ou Eq. 2 (0,10–0,40). Válido: D50 15–278 mm, S0 0,02–0,40. Fora da faixa: extrapolado.">Tamanho mediano necessário da rocha, D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='Equação aplicada';
$ec_lang['rc_sg_check']='Verificação de densidade relativa';
$ec_lang['rc_SD_check']='Verificação de graduação SD';
$ec_lang['rc_sg_ok']   ='sg na faixa válida';
$ec_lang['rc_sg_ok_tip']='2,54–2,82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg abaixo da faixa Robinson';
$ec_lang['rc_sg_low_tip']='Faixa válida: 2,54–2,82';
$ec_lang['rc_sg_high'] ='sg acima da faixa Robinson';
$ec_lang['rc_sg_high_tip']='Faixa válida: 2,54–2,82';
$ec_lang['rc_SD_ok']   ='SD na faixa válida';
$ec_lang['rc_SD_ok_tip']='1,15–1,47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD abaixo da faixa Robinson';
$ec_lang['rc_SD_low_tip']='Faixa válida: 1,15–1,47';
$ec_lang['rc_SD_high'] ='SD acima da faixa Robinson';
$ec_lang['rc_SD_high_tip']='Faixa válida: 1,15–1,47';
$ec_lang['rc_layer']='Espessura da camada de rocha (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='Raio de curva na crista superior (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='Comprimento de arco na crista superior';
$ec_lang['rc_apron_length']='<span class="ec-help" title="Necessário para suporte estrutural da rocha da calha. “O tirante mínimo a jusante resultante do trecho de saída e da resistência do canal a jusante é suficiente para garantir a estabilidade do enrocamento no trecho de saída.” (Robinson)">Comprimento da laje de saída (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='Rugosidade de Manning na calha, n';
$ec_lang['rc_Vm']='<span class="ec-help" title="Fração de qt que flui pelos poros da rocha. O restante qs flui pela superfície. np padrão = 0,45 para rocha britada angular.">Velocidade através do manto de pedra, V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='Vazão específica no manto, q<sub>m</sub>';
$ec_lang['rc_qs']='Vazão específica superficial, q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='Lâmina d\'água acima da superfície do enrocamento, d';
$ec_lang['rc_Hp']='<span class="ec-help" title="O remanso (Hp > yn) é favorável — reduz erosão a montante. (USDA)">Carga no vertedor de entrada, H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='Verificação de remanso na entrada';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — remanso a montante';
$ec_lang['rc_pond_ok_tip']='O remanso a montante da entrada da calha é favorável; reduz a erosão a montante. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — sem remanso — potencial de erosão na entrada';
$ec_lang['rc_pond_warn_tip']='Sem remanso a montante da entrada da calha; pode ocorrer erosão a montante. (USDA)';
$ec_lang['rc_eq1']='Eq. 1 (S<sub>0</sub> < 0,10) — declividade suave';
$ec_lang['rc_eq2']='Eq. 2 (0,10 ≤ S<sub>0</sub> ≤ 0,40) — declividade acentuada';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0,02 — abaixo da faixa de validação Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0,40 — acima da faixa de validação Robinson';
$ec_lang['rc_notes_1_term']='Equações de dimensionamento de rocha';
$ec_lang['rc_notes_1_def']='Robinson, Rice & Kadavy (1998) desenvolveram duas equações empíricas para o tamanho mediano do revestimento de rocha D<sub>50</sub> a partir da declividade do canal e da vazão unitária. A Equação 1 se aplica a declividades suaves (S<sub>0</sub> < 0,10); a Equação 2 se aplica a declividades íngremes (0,10 ≤ S<sub>0</sub> ≤ 0,40). Ambas as equações exigem q<sub>t</sub> em m²/s e retornam D<sub>50</sub> em mm. A faixa validada é 0,02 ≤ S<sub>0</sub> ≤ 0,40.';
$ec_lang['rc_notes_2_term']='Vazão específica';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> é a vazão específica total na crista da calha (vazão total por unidade de largura). Para um canal de largura de base B com vazão total Q, q<sub>t</sub> ≈ Q / B, ou calculada a partir da condição de tirante crítico na entrada da calha.';
$ec_lang['rc_notes_3_term']='Fluxo através do manto de pedra';
$ec_lang['rc_notes_3_def']='Uma fração da vazão total flui pelos poros do enrocamento (vazão de manto q<sub>m</sub>); o restante flui pela superfície da rocha (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). A lâmina d\'água d é calculada pela equação de Manning aplicada à vazão superficial q<sub>s</sub> usando a rugosidade n da calha. A porosidade padrão n<sub>p</sub> = 0,45 é típica para rocha britada angular.';
$ec_lang['rc_notes_5_term']='Faixa válida de tamanho de rocha';
$ec_lang['rc_notes_5_def']='As equações foram desenvolvidas usando uma faixa de D<sub>50</sub> de 15 mm a 278 mm. Resultados fora desta faixa são extrapolados e devem ser usados com julgamento de engenharia adicional.';
$ec_lang['rc_notes_6_term']='Cota da superfície da laje de saída';
$ec_lang['rc_notes_6_def']='A cota do topo do enrocamento no trecho de saída deve estar na mesma cota ou abaixo da cota do fundo do canal a jusante. Se estiver mais alta, a rocha de saída será instável.';
$ec_lang['rc_notes_7_term']='Remanso na Entrada';
$ec_lang['rc_notes_7_def']='Quando o tirante normal no canal de entrada é menor que a carga no vertedor (H<sub>p</sub>) necessária para escoar q<sub>t</sub>, ocorre fluxo restringido ou remanso a montante da entrada do canal. Isso é geralmente aceitável — o remanso reduz a velocidade e previne erosão a montante. Para verificar: usar uma calculadora de vertedor para encontrar H<sub>p</sub> para o q<sub>t</sub> e largura de crista dados, e comparar com o tirante normal do canal de entrada. Se H<sub>p</sub> exceder o tirante normal, ocorrerá remanso.';
$ec_lang['rc_notes_4_term']='Referência';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., e Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. O USDA ARS também publica uma <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">planilha Excel</a> baseada no mesmo método.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'Filtro';
$ec_lang['rc_sketch_top_crest_curve'] = 'Curva de crista superior';
$ec_lang['rc_sketch_outlet_apron']    = 'Laje de saída';
$ec_lang['rc_sketch_radius']          = 'raio';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='Pressão em Irrigação';
$ec_lang['ip_main_title']='Calculadora Gratuita Online de Pressão em Irrigação e Uniformidade de Distribuição';
$ec_lang['ip_main_desc']='Pressão no Ramo de Teste e Uniformidade Estimada';
$ec_lang['ip_h_supply']='Pressão de abastecimento';
$ec_lang['ip_elev_supply']='Elevação de abastecimento, z<sub>supply</sub>';
$ec_lang['ip_q_design']='Vazão de projeto do emissor, q<sub>design</sub>';
$ec_lang['ip_h_design']='Pressão de projeto do emissor';
$ec_lang['ip_x']='<span class="ec-help" title="0,5 para emissores não compensadores padrão; próximo a 0 para emissores com compensação de pressão">Expoente de descarga do emissor, x <span class="ec-tip">?</span></span>';
$ec_lang['ip_reach_table_heading']='Caminho de teste';
$ec_lang['ip_group_reach']='Trecho';
$ec_lang['ip_group_upstream']='A montante';
$ec_lang['ip_group_downstream']='A jusante';
$ec_lang['ip_group_loss']='Perda';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="Marcado: este trecho é um segmento da lateral de teste, extraído por emissores individuais. Desmarcado: este trecho é uma principal, apenas passando fluxo para laterais não no caminho de teste.">Lat. <span class="ec-tip">?</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="Linhas laterais: emissores neste trecho apenas. Linhas principais: emissores totais em laterais OUTRAS que ramificam deste trecho. Para o trecho exatamente na própria tomada da lateral de teste, isto também inclui quaisquer laterais ainda mais abaixo na principal, ou compartilhando a mesma junção (por ex., uma lateral no lado oposto) — seu fluxo ramifica deste mesmo trecho também.">Emissores <span class="ec-tip">?</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="Elevação da extremidade a jusante deste trecho. Opcional em linhas interiores (padroniza para plano / mesma do nó acima se deixado em branco). Obrigatório na última linha: esse valor é a elevação do último emissor, que define diretamente a pressão de abastecimento necessária.">Elev. JUS <span class="ec-tip">?</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='Elevação do último emissor (última linha) foi deixada em branco e padronizou para plano — entre com ela para um resultado preciso';
$ec_lang['ip_press']='Press.';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="Perda total do trecho, h_f + h_m">h<sub>L</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_pressure_warn']='Pressão baixa/negativa — verificar condições subatmosféricas';
$ec_lang['ip_pressure_warn_short']='Baixa';
$ec_lang['ip_pressure_high']='Locais com pressão alta precisam de redução de pressão';
$ec_lang['ip_pressure_high_short']='Alta';
$ec_lang['ip_max_head']='Pressão máx. adm. tubo';
$ec_lang['ip_max_head_tip']='Trechos cuja pressão exceder este valor são sinalizados. Deixe em branco para pular a verificação de alta pressão.';
$ec_lang['ip_h_far']='Pressão do último emissor';
$ec_lang['ip_q_supply']='<span class="ec-help" title="Fluxo entrando apenas no caminho de teste modelado, não a zona/sistema inteiro — ver Q_zone no Projeto de Aplicação abaixo para o total do sistema.">Vazão de abastecimento do caminho de teste, Q<sub>supply</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_critical']='Vazão do último emissor, q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='Vazão média do emissor (lateral de teste), q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="Quanto maior (ou menor) você acredita que uma lateral típica/média funciona comparada a esta lateral de teste. A lateral de teste é deliberadamente o pior caso presumido, portanto sua própria média é uma substituição enviesada para uma média de campo — deixado em 0, a verificação de uniformidade e os números de projeto-aplicação abaixo usam a própria média da lateral de teste (provavelmente otimista) como está.">Est. ΔPressão, média vs. lateral de teste <span class="ec-tip">?</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="q_avg_lateral reavaliado em cada pressão de linha lateral mais a diferença de pressão inserida acima — uma tentativa de corrigir pela lateral de teste ser o pior caso presumido, não um representativo. Alimenta tanto a verificação de uniformidade quanto a seção de projeto-aplicação abaixo.">Est. vazão média do emissor em campo, q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="Vazão calculada do último emissor dividida pela vazão média estimada do emissor no campo — esta é uma aproximação da Uniformidade de Distribuição do quarto inferior padrão (média do grupo inferior ÷ média da população); é obtida de uma pequena amostra modelada e de uma correção estimada pelo usuário, em vez de uma amostra estatística completa de campo. Valores iguais ou superiores a 1 são possíveis e válidos: significam apenas que a pressão do último emissor está igual ou acima da média estimada de campo, de modo que algum outro emissor é o ponto de menor pressão. Isso pode ocorrer porque o último emissor está em terreno baixo ou porque a estimativa de Δpressão é pequena demais.">Verificação de uniformidade, q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_worst_case_warn']='Pressão no emissor de teste ≥ pressão de abastecimento. Este provavelmente não é o emissor de pior caso, ou as tubulações poderiam ser menores.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="Isso é diferente de nossa aproximação da medida de uniformidade padrão.">Vazão do último emissor ÷ vazão de projeto, q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">?</span></span>';
$ec_lang['ip_no_solution']='Sem solução: pressão de abastecimento necessária excede a pressão de abastecimento inserida. Aumentar pressão de abastecimento, reduzir demanda, ou usar uma tubulação maior.';
$ec_lang['ip_notes_1_def']='Adivinha a pressão no último (mais remoto) emissor, depois marcha a Linha de Grau de Energia de volta para o abastecimento, trecho por trecho, adicionando fricção e perdas menores ao longo do caminho. Elevação e carga de velocidade são retiradas de cada nó para relatar a pressão real lá. A pressão de extremidade distante adivinhada é ajustada (bisseção) até que a pressão de abastecimento necessária computada corresponda à pressão de abastecimento inserida — o mesmo problema de circuito fechado endereçado pelo solucionador de fluxo em tubulação na calculadora de Vazão Manning em Tubulações, estendido a uma rede ramificada.';
$ec_lang['ip_notes_2_term']='Trechos Principais vs. Laterais';
$ec_lang['ip_notes_2_def']='Cada linha é um trecho ao longo do caminho hidraulicamente único pior presumido (o caminho de teste) do abastecimento ao último emissor. Um trecho Principal apenas passa fluxo para laterais não no caminho de teste, portanto sua extração é uma multiplicação plana (vazão de projeto × contagem de emissores total do trecho) — sem sensibilidade de pressão local. A principal é uma tubulação de tronco compartilhada, portanto o trecho exatamente na própria tomada da lateral de teste deve incluir não apenas laterais entre seus próprios extremos mas também quaisquer laterais ainda mais abaixo na principal além dessa tomada, ou compartilhando a mesma junção (por ex., uma lateral no lado oposto) — seu fluxo viaja através desse mesmo trecho antes de se ramificar, independentemente de aparecerem em qualquer outro lugar nesta tabela. Um trecho Lateral é um segmento da própria lateral de teste: descarga do emissor é computada a partir da pressão local real via q = k·H<sup>x</sup>, e perda de fricção é reduzida pelo fator F(n) de Christiansen para contabilizar fluxo diminuindo conforme cada emissor no trecho extrai.';
$ec_lang['ip_notes_3_term']='Limitações';
$ec_lang['ip_notes_3_def']='Modela uma pressão de abastecimento fixa (sem curva de bomba), apenas um caminho de teste (não o campo completo), e uma curva de emissor de 2 parâmetros (defina o expoente próximo de 0 para aproximar um emissor com compensação de pressão). Duas razões de uniformidade diferentes são apresentadas, mantidas deliberadamente separadas: q<sub>last</sub>/q<sub>avg,field</sub> é uma aproximação da Uniformidade de Distribuição do quarto inferior padrão (média do grupo inferior ÷ média da população); porém, é obtida de uma pequena amostra modelada e de uma correção estimada pelo usuário, em vez da amostra estatística completa de campo padrão. Além disso, a lateral de teste é deliberadamente o pior caso presumido, de modo que sua média bruta, sem correção, subestimaria a verdadeira média de campo e faria a uniformidade parecer melhor do que realmente é; a entrada Δpressão existe especificamente para compensar esse viés. Valores iguais ou superiores a 1 ainda são possíveis: significam apenas que a pressão do último emissor está igual ou acima da média estimada de campo, de modo que algum outro emissor é o ponto de menor pressão. Isso pode ocorrer porque o último emissor está em terreno baixo ou porque a estimativa de Δpressão é pequena demais. q<sub>last</sub>/q<sub>design</sub> é uma verificação diferente, sem relação com uniformidade, em comparação com a vazão nominal do fabricante — útil para detectar um sistema com pressão geral acima ou abaixo do previsto, mas é uma verificação separada, a ser lida junto com o número de uniformidade, já que a vazão de projeto/nominal é independente da pressão média real de operação do sistema.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. Padrões ASAE/ASABE para projeto de microirrigação usam a mesma abordagem de perda de fricção de saída múltipla.';
$ec_lang['ip_notes_5_term']='Projeto de Aplicação';
$ec_lang['ip_notes_5_def']='Taxa de aplicação e fluxo de sistema/zona usam a vazão média estimada do emissor em campo (q<sub>avg,field</sub> — a média da própria lateral de teste, corrigida pela estimativa ΔPressão inserida), não uma taxa adivinhada: PR = q<sub>avg,field</sub> / A<sub>e</sub>, alimentada pelo valor modelado corrigido. Espaçamento e contagens de lateral/emissor do sistema amplo são entradas separadas aqui porque o caminho de teste modela apenas uma ramificação de pior caso, não cada lateral no campo.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='Rede de Tubulações Ramificada';
$ec_lang['bpn_main_title']='Calculadora Gratuita Online de Pressão em Rede de Tubulações Ramificada (Sem Malhas)';
$ec_lang['bpn_main_desc']='Vazão e Pressão em Rede de Tubulações Ramificada (Árvore)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='Carga estática de abastecimento: a carga da fonte com vazão zero. O nível d\'água de um reservatório ou tanque acima da elevação de abastecimento, ou a carga de shutoff de uma bomba (a vazão zero). Adicione os pontos de abastecimento 2 e 3 para definir uma curva de bomba ou de abastecimento variável; a ferramenta lê a carga na vazão de projeto.';
$ec_lang['bpn_elev_source']='Elevação de abastecimento';
$ec_lang['bpn_q_total']='Vazão total';
$ec_lang['bpn_q_total_tip']='Vazão total que sai da fonte (a soma de todas as demandas da rede).';
$ec_lang['bpn_p_min']='Menor pressão';
$ec_lang['bpn_p_min_tip']='A menor pressão a jusante em qualquer ponto da rede; o ponto crítico de entrega.';
$ec_lang['bpn_method']='Método de atrito';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='Trechos de tubulação';
$ec_lang['bpn_id']='ID';
$ec_lang['bpn_id_tip']='Nome deste trecho de tubulação. Outros trechos fazem referência a ele na coluna ID montante.';
$ec_lang['bpn_upstream']='ID montante';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='ID do trecho que alimenta este. Deixe em branco para seguir o trecho diretamente acima (uma tubulação simples em série). Informe um ID aqui para ramificar a partir de outro trecho.';
$ec_lang['bpn_roughness_tip']='Rugosidade da tubulação para o método de atrito selecionado: n de Manning, C de Hazen-Williams, ou altura de rugosidade e de Darcy-Weisbach (um comprimento). Tubulação plástica lisa típica: n cerca de 0,009, C cerca de 150, e cerca de 0,0015 mm.';
$ec_lang['bpn_demand']='Demanda';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='Vazão fixa entregue na extremidade a jusante deste trecho.';
$ec_lang['bpn_demand_mult']='Multiplicador de demanda';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='Multiplica todas as demandas dos trechos de uma vez, para uma simulação de horário de pico ou crescimento futuro. Use 1 para as demandas como informadas.';
$ec_lang['bpn_elev_down']='Elev. JUS';
$ec_lang['bpn_q_line']='Vazão do trecho';
$ec_lang['bpn_q_line_tip']='Vazão total conduzida por este trecho: sua própria demanda mais todas as demandas a jusante que ele alimenta.';
$ec_lang['bpn_p_down']='Press. JUS';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='Carga de pressão manométrica no nó a jusante deste trecho. Um valor negativo (sinalizado) indica pressão subatmosférica; verifique o projeto.';
$ec_lang['bpn_sketch_heading']='Diagrama da rede';
$ec_lang['bpn_source_label']='Fonte';
$ec_lang['bpn_line_problem']='Este trecho não está conectado à fonte: aponta para um ID montante desconhecido, aponta para si mesmo, repete um ID que outro trecho já usa, ou forma uma malha (loop). Trechos que não estão conectados ficam sem solução.';
$ec_lang['bpn_bad_id_short']='ID inválido';
$ec_lang['bpn_not_connected_short']='Não conectado';
$ec_lang['bpn_dup_id_short']='ID duplicado';
$ec_lang['bpn_pressure_warn']='Pressão baixa/negativa; verifique condições subatmosféricas';
$ec_lang['bpn_pressure_warn_short']='Baixa';
$ec_lang['bpn_notes_1_term']='Série por padrão, ramificação por exceção';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='Deixe o ID montante em branco e um trecho segue o que está acima dele; uma tubulação simples em série. Informe o ID de um trecho a montante para ramificar a partir dele. Ou seja: série por padrão, árvore quando necessário.';
$ec_lang['bpn_notes_2_term']='Somente redes ramificadas, sem malhas';
$ec_lang['bpn_notes_2_def']='Cada trecho tem exatamente um trecho a montante (uma árvore). Esta ferramenta não resolve redes com malhas; essas exigem métodos iterativos (EPANET ou similar). Deixar as malhas de fora é o que mantém esta ferramenta simples e exata.';
$ec_lang['bpn_notes_3_term']='Sem controles ativos de pressão';
$ec_lang['bpn_notes_3_def']='Você pode adicionar uma válvula de perda localizada fixa (um valor k), mas não válvulas redutoras ou sustentadoras de pressão (PRV/PSV). O estado aberto/fechado dessas válvulas depende da vazão e da pressão, o que exigiria iteração.';
$ec_lang['bpn_notes_epanet_term']='As constantes de Hazen-Williams agora coincidem com o EPANET (agosto de 2026)';
$ec_lang['bpn_notes_epanet_def']='Em agosto de 2026, o coeficiente e o expoente de Hazen-Williams foram alterados para coincidir com o EPANET. Os resultados de perda de carga diferem dos das versões anteriores desta página em até 0,1 por cento, muito menos que a incerteza do próprio valor de C.';
$ec_lang['bpn_supply2_q']='Vazão de abastecimento 2';
$ec_lang['bpn_supply2_h']='Carga de abastecimento 2';
$ec_lang['bpn_supply3_q']='Vazão de abastecimento 3';
$ec_lang['bpn_supply3_h']='Carga de abastecimento 3';
$ec_lang['bpn_supply_pt_tip']='Pontos opcionais 2 e 3 da curva de abastecimento. Informe uma vazão e uma carga para cada um, para modelar uma bomba ou qualquer fonte cuja carga diminui à medida que fornece mais vazão; a ferramenta lê a carga na vazão de projeto. O ponto 1 acima é a carga estática a vazão zero. Deixe 2 e 3 em branco para uma carga de reservatório constante.';
$ec_lang['bpn_h_supply']='Carga de abastecimento';
$ec_lang['bpn_h_supply_tip']='Carga da fonte na vazão de projeto, lida a partir da curva de abastecimento. É igual à carga da fonte informada quando a curva é constante (um reservatório).';
$ec_lang['bpn_supply1_h']='Carga estática de abastecimento';
$ec_lang['lpn_main_menu']='Rede de Abastecimento de Água';
$ec_lang['lpn_main_title']='Modelagem Gratuita Online de Rede de Distribuição de Água com o Solucionador EPANET';
$ec_lang['lpn_main_desc']='Análise de Rede de Abastecimento de Água: Desenhe uma Rede de Tubulações Malhada ou Importe Arquivos EPANET';
$ec_lang['lpn_title_units']='Unidades {units}';
$ec_lang['lpn_tool_select']='Selecionar';
$ec_lang['lpn_tool_add_junction']='Junção';
$ec_lang['lpn_tool_add_reservoir']='Reservatório';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='Tanque';
$ec_lang['lpn_tool_add_pipe']='Tubo';
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
$ec_lang['lpn_tool_add_meter_tip']='Clique onde o cliente está, depois clique no tubo ou no nó que o atende. A demanda que você atribui ao cliente é somada à junção na extremidade mais próxima desse tubo.';
$ec_lang['lpn_mode_add_meter']='Modo: Cliente. Clique onde o cliente está, depois clique no tubo ou no nó que o atende. Ou use Esc para cancelar.';
$ec_lang['lpn_pane_tab_customers']='Clientes';
$ec_lang['lpn_customer_heading']='Cliente {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='Demanda por serviço';
$ec_lang['lpn_field_meter_count']='Número de serviços';
$ec_lang['lpn_field_meter_total']='Demanda total';
$ec_lang['lpn_field_meter_total_tip']='A demanda por serviço multiplicada pelo número de serviços. Este é o número somado à junção indicada abaixo.';
$ec_lang['lpn_field_meter_pipe']='Elemento conectado';
$ec_lang['lpn_field_meter_pipe_suggest']='O elemento mais próximo é {id}. Digite-o aqui para atender este cliente a partir dele.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='Conectado a';
$ec_lang['lpn_field_meter_node_tip']='A junção à qual este cliente está conectado. Arraste o ponto de conexão até um tubo para atendê-lo a partir de uma posição ao longo desse tubo.';
$ec_lang['lpn_meter_pipe_unknown']='Nada neste projeto se chama {id}, então o cliente foi deixado onde estava.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_meter_pattern_unknown']='Nenhum padrão neste projeto se chama {id}, então o cliente foi deixado como estava.';
$ec_lang['lpn_meter_placed']='Cliente {id} adicionado. Sua descrição e demanda são digitadas na tabela Clientes, ou pressione-o em Selecionar para abrir sua caixa.';
$ec_lang['lpn_field_meter_pipe_tip']='O elemento ao qual este serviço se conecta. Digite outro aqui ou na tabela Clientes para alterá-lo, ou arraste o ponto de conexão até um elemento diferente.';
$ec_lang['lpn_field_meter_station']='Posição ao longo do tubo (%)';
$ec_lang['lpn_field_meter_station_tip']='A que distância ao longo do tubo o serviço se conecta, como uma porcentagem do tubo do primeiro nó ao segundo. 0 é em uma extremidade e 100 na outra. O círculo sobre o tubo faz o mesmo com o ponteiro.';
$ec_lang['lpn_field_meter_offset']='Deslocamento do tubo';
$ec_lang['lpn_field_meter_offset_tip']='Positivo é à direita do tubo olhando do primeiro nó em direção ao segundo. Digitar um valor aqui pode mover o cliente para o outro lado da rede principal, e sempre esquadra a linha de serviço em relação a ela.';
$ec_lang['lpn_field_meter_lumped']='Somado ao nó';
$ec_lang['lpn_field_meter_lumped_tip']='Nó mais próximo; as demandas deste cliente são somadas ali.';
$ec_lang['lpn_node_customers']='Demandas de clientes';
$ec_lang['lpn_node_customers_tip']='Lista de clientes adicionados a este nó (por ser o mais próximo). As demandas de clientes se somam às outras demandas listadas aqui. Um cliente é editado onde está no mapa ou na tabela Clientes.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} de {n} clientes';
$ec_lang['lpn_customer_detached']='⚠ Este cliente não está conectado a um tubo, então sua demanda não está nas respostas. Exclua-o, ou desenhe um tubo e mova o cliente para ele.';
$ec_lang['lpn_customer_fixed_head']='⚠ A extremidade mais próxima desse tubo tem uma superfície de água fixa, então esta demanda não afeta a simulação.';
$ec_lang['lpn_customer_detached_count']='{n} clientes não estão conectados a um tubo. Sua demanda não é contabilizada.';
$ec_lang['lpn_meter_pick_pipe']='Agora clique no tubo ou no nó que atende a este cliente. O cliente permanece onde você o colocou. Pressione Esc para cancelar.';
$ec_lang['lpn_inp_export_flat_customers']='Um arquivo EPANET não tem clientes. A demanda dos {n} clientes deste projeto entra no arquivo como uma linha de demanda na junção a que cada um foi somado, e cada linha recebe o nome da etiqueta do cliente. O que o arquivo não consegue guardar é o cliente: onde ele está, qual tubo o atende, em que ponto ao longo desse tubo o serviço se conecta, e quantos serviços um único cliente representa. Seu próprio arquivo de projeto guarda tudo isso.';

$ec_lang['lpn_area_hint_window_start']='Clique em um canto da janela.';
$ec_lang['lpn_area_hint_window_go']='Clique no canto oposto para concluir.';
$ec_lang['lpn_area_hint_lasso_start']='Clique para iniciar o contorno.';
$ec_lang['lpn_area_hint_lasso_go']='Mova para desenhar o contorno. Clique para concluir.';
$ec_lang['lpn_area_hint_polygon_start']='Clique para desenhar a área do polígono. Clique duas vezes para concluir.';
$ec_lang['lpn_area_hint_polygon_go']='Clique em cada canto. Clique duas vezes no último para concluir.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='Mantenha Shift pressionado ao selecionar para continuar com a seleção existente, adicionando ou removendo (alternando) o que você seleciona.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='Pressione o mapa e arraste ao redor do que deseja, depois solte.';
$ec_lang['lpn_area_hint_touch_go']='Arraste ao redor do que deseja, depois solte para concluir.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='Mostrar isto';
$ec_lang['lpn_multi_title']='{n} selecionados';
$ec_lang['lpn_multi_varies']='Vários';
$ec_lang['lpn_multi_applied']='Definido {prop} em {n}.';
$ec_lang['lpn_multi_no_fields']='Estes não têm nada que possa ser definido em conjunto aqui.';
$ec_lang['lpn_pane_pasted']='Coladas {n} células. {skipped} não foram alteradas.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='{n} linhas coladas e {created} delas adicionadas à rede.';
$ec_lang['lpn_pane_pasted_rows_skipped']='{n} linhas coladas e {created} delas adicionadas à rede. {skipped} células não foram alteradas.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='Clique aqui e cole linhas de uma planilha para adicioná-las.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='Colar como novas linhas no fim da tabela';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='Pressione Ctrl+V para adicionar as linhas copiadas no fim desta tabela. Pressione Esc para cancelar.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='Esta colagem tem {n} linhas, e {fit} delas cabem na tabela. Adicionar as outras {extra} como novas linhas no fim?';
$ec_lang['lpn_pane_paste_overflow_add']='Adicionar {extra} linhas';
$ec_lang['lpn_pane_paste_overflow_fit']='Colar somente as {fit} que cabem';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='Esta colagem tem {n} linhas, e {fit} delas cabem na tabela. As outras {extra} não podem ser adicionadas como novas linhas: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} IDs não correspondem. Colar mesmo assim?';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='Nada foi colado. {reasons}';
$ec_lang['lpn_pane_paste_more']='Linhas com problemas não mostradas aqui: {n}.';
$ec_lang['lpn_pane_paste_no_id']='Linha {row}: uma nova linha precisa de um ID.';
$ec_lang['lpn_pane_paste_bad_id']='Linha {row}: o ID {id} tem um espaço ou uma aspa.';
$ec_lang['lpn_pane_paste_id_taken']='Linha {row}: o ID {id} já está em uso.';
$ec_lang['lpn_pane_paste_id_twice']='Linha {row}: o ID {id} é usado duas vezes nesta colagem.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='Linha {row}: um novo nó precisa de {first} e {second}.';
$ec_lang['lpn_pane_paste_no_ends']='Linha {row}: um novo trecho precisa de um nó De e um nó Para.';
$ec_lang['lpn_pane_paste_no_node']='Linha {row}: o nó {id} ainda não existe. Cole seus nós primeiro, depois seus trechos.';
$ec_lang['lpn_pane_paste_same_ends']='Linha {row}: De e Para são o mesmo nó.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='Linha {row}: {text} não é um {col} válido.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).
$ec_lang['lpn_pane_paste_text_no_position']='Linha {row}: um novo Texto precisa de {first} e {second}.';
// {id} is what the Text table's own Attached to cell named.
$ec_lang['lpn_pane_paste_no_anchor']='Linha {row}: {id} ainda não é um nó nem um trecho nesta rede. Cole-o primeiro e depois este Texto.';
$ec_lang['lpn_pane_paste_customer_no_position']='Linha {row}: um novo Cliente precisa de {first} e {second}.';
$ec_lang['lpn_pane_paste_no_customer_ref']='Linha {row}: um novo Cliente precisa de um trecho ou nó conectado.';
$ec_lang['lpn_pane_paste_no_pipe']='Linha {row}: o trecho {id} ainda não existe. Cole seus trechos primeiro e depois seus clientes.';
$ec_lang['lpn_pane_paste_no_customer_node']='Linha {row}: o nó {id} ainda não existe. Cole suas junções primeiro e depois seus clientes.';
$ec_lang['lpn_pane_paste_customer_node_no_pipe']='Linha {row}: o nó {id} não tem nenhum trecho para um Cliente se conectar.';
$ec_lang['lpn_pane_filled']='{n} células preenchidas para baixo. {skipped} não foram alteradas.';
$ec_lang['lpn_pane_filldown']='Preencher para baixo';
$ec_lang['lpn_pane_fill_none']='Nada nesta seleção pode ser preenchido para baixo.';
$ec_lang['lpn_pane_ctrlenter_filled']='{n} células preenchidas. {skipped} não foram alteradas.';
$ec_lang['lpn_pane_hide_col']='Ocultar esta coluna';
$ec_lang['lpn_pane_hide_cols']='Ocultar estas colunas';
$ec_lang['lpn_pane_show_all_cols']='Mostrar todas as colunas';
$ec_lang['lpn_pane_sort_asc']='Ordenar crescente';
$ec_lang['lpn_pane_manage_cols']='Gerenciar colunas…';
$ec_lang['lpn_pane_manage_cols_title']='Gerenciar colunas';
$ec_lang['lpn_pane_manage_cols_show']='Mostrar';
$ec_lang['lpn_pane_manage_cols_up']='Mover para cima';
$ec_lang['lpn_pane_manage_cols_down']='Mover para baixo';
$ec_lang['lpn_pane_manage_cols_top']='Mover para o início';
$ec_lang['lpn_pane_manage_cols_bottom']='Mover para o fim';
$ec_lang['lpn_pane_colmenu_tip']='Ocultar ou gerenciar colunas';
$ec_lang['lpn_tool_area_window']='Selecionar uma janela';
$ec_lang['lpn_tool_area_lasso']='Selecionar um laço';
$ec_lang['lpn_tool_area_polygon']='Selecionar um polígono';
$ec_lang['lpn_tool_delete']='Excluir';
$ec_lang['lpn_tool_zoom_extent']='Ver tudo';
$ec_lang['lpn_tool_zoom_window']='Janela de zoom';
$ec_lang['lpn_zoom_in']='Aumentar zoom';
$ec_lang['lpn_zoom_out']='Diminuir zoom';
$ec_lang['lpn_new_text']='Texto';
$ec_lang['lpn_field_text_bold']='Texto em negrito';
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
$ec_lang['lpn_field_text_anchor']='Conectado a';
$ec_lang['lpn_field_text_align']='Alinhamento horizontal';
$ec_lang['lpn_field_text_align_left']='Esquerda';
$ec_lang['lpn_field_text_align_center']='Centro';
$ec_lang['lpn_field_text_align_right']='Direita';
$ec_lang['lpn_field_text_valign']='Alinhamento vertical';
$ec_lang['lpn_field_text_valign_top']='Superior';
$ec_lang['lpn_field_text_valign_middle']='Meio';
$ec_lang['lpn_field_text_valign_bottom']='Inferior';
$ec_lang['lpn_field_text_rotation']='Ângulo (graus)';
$ec_lang['lpn_field_text_match_pipe']='Girar para o ângulo do trecho mais próximo';
$ec_lang['lpn_field_text_flip']='Girar 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='Elemento anexado';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='Este texto foi colocado perto o suficiente de um elemento para segui-lo, então ele se move junto com esse elemento e tem uma linha de chamada. Um texto em uma linha de chamada usa o alinhamento horizontal e vertical do lado em que está, por isso essas duas linhas não são oferecidas enquanto ele está anexado.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='Coeficiente de emissor';
$ec_lang['lpn_field_emitter_tip']='Uma vazão extra que depende da pressão, para um aspersor, uma saída aberta ou um vazamento modelado. A vazão liberada é este coeficiente multiplicado pela pressão elevada ao expoente do emissor, definido uma única vez para toda a rede em Configurações, Cálculo, Hidráulica. Deixe em branco em uma junção comum.';
$ec_lang['lpn_field_elev']='Elevação';
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
$ec_lang['lpn_field_head_tip']='Nível da superfície da água no reservatório, medido como uma altura, não como uma pressão. Deixe em branco para colocar a superfície da água na elevação do reservatório.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='Elevação do fundo do tanque. As profundidades de água no tanque são medidas a partir daqui, para cima.';
$ec_lang['lpn_field_tank_level']='Profundidade da água';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='Profundidade da água parada no tanque, medida a partir do fundo do tanque, para cima. A superfície da água é a elevação do fundo do tanque mais esta profundidade.';
$ec_lang['lpn_field_tank_minlevel']='Profundidade mínima da água';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='Profundidade da água na qual o tanque é considerado vazio, medida a partir do fundo do tanque, para cima.';
$ec_lang['lpn_field_tank_maxlevel']='Profundidade máxima da água';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='Profundidade da água na qual o tanque está cheio, medida a partir do fundo do tanque, para cima.';
$ec_lang['lpn_field_tank_diameter']='Diâmetro do tanque';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='Largura do tanque de lado a lado. Está nas mesmas unidades da elevação, não nas unidades de diâmetro de tubo. Ela define quanta água uma dada profundidade contém.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='Elevação da superfície da água no tanque: a elevação do fundo do tanque mais a profundidade da água. Este é o nível que o solucionador usa para o tanque.';
$ec_lang['lpn_close']='Fechar';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='Propriedades';
$ec_lang['lpn_empty_hint']='Use Arquivo, Novo projeto para abrir um exemplo. Ou comece adicionando um reservatório, uma junção e um tubo pela barra de ferramentas.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='Sua rede está intacta.';
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
$ec_lang['lpn_examples_welcome']='Bem-vindo à modelagem de redes de abastecimento de água';
$ec_lang['lpn_examples_heading']='Abra sua própria cópia de um exemplo';
$ec_lang['lpn_examples_sub']='Cada um abre como sua própria cópia. Altere-o, salve-o, ou abra uma cópia nova e comece de novo.';
$ec_lang['lpn_examples_open']='Abrir';
$ec_lang['lpn_examples_menu']='Abrir exemplo…';
$ec_lang['lpn_examples_blank']='Ou comece aqui';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_size']='Nós: {nodes}, trechos: {links}';
$ec_lang['lpn_examples_failed']='Não foi possível carregar os exemplos. Use Arquivo, Novo projeto para começar um desenho.';
$ec_lang['lpn_examples_loading']='Carregando exemplos…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='Corrigir algo';
$ec_lang['lpn_help_notes']='Notas sobre esta página';
$ec_lang['lpn_help_hotkeys']='Tabelas e atalhos de teclado';
$ec_lang['lpn_hotkeys_tables_heading']='Tabelas';
$ec_lang['lpn_hotkeys_map_heading']='Mapa';
$ec_lang['lpn_hotkeys_map_term']='Atalhos de teclado do mapa';
$ec_lang['lpn_hotkeys_map_def']='<table class="lpn-notes-table"><tbody><tr><td>1 ou Esc</td><td>Selecionar.</td></tr><tr><td>2</td><td>Adicionar uma junção.</td></tr><tr><td>3</td><td>Adicionar um reservatório.</td></tr><tr><td>4</td><td>Adicionar um tanque.</td></tr><tr><td>5</td><td>Adicionar um tubo.</td></tr><tr><td>6</td><td>Adicionar uma bomba.</td></tr><tr><td>7</td><td>Adicionar uma válvula.</td></tr><tr><td>8</td><td>Adicionar um cliente.</td></tr><tr><td>9</td><td>Adicionar texto.</td></tr><tr><td>Delete</td><td>Excluir a seleção.</td></tr><tr><td>Ctrl+Z</td><td>Desfazer a última alteração.</td></tr><tr><td>+ ou =</td><td>Aumentar o zoom.</td></tr><tr><td>-</td><td>Diminuir o zoom.</td></tr></tbody></table>';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='Algo errado aqui?';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='Um clique nos avisa que algo nesta página está errado. Ele envia o nome desta página, o idioma em que você a está lendo, e a mensagem no mapa, se houver uma. Não envia nada do que você digitou, nenhum endereço, e nada do seu desenho. Ninguém pode responder, porque isto não nos diz nada sobre quem você é. Use Ajuda, Corrigir algo quando quiser dizer mais.';
$ec_lang['lpn_wrong_thanks']='Obrigado. Isso chegou até nós.';
$ec_lang['lpn_status_example_opened']='{name} aberto. É a sua cópia: salve-a com Arquivo, Salvar como.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='Esta página não conseguiu determinar o tamanho da área de desenho, então o mapa está mostrando a última visualização que conseguiu calcular. Redimensionar a janela faz com que ela tente novamente. Se isso continuar acontecendo, uma extensão do navegador que bloqueia medições de página costuma ser a causa.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='Rede básica, L/s (SI)';
$ec_lang['lpn_ex_basic_si_desc']='Comece aqui. Um reservatório, uma bomba e um pequeno anel: o menor arranjo que ainda funciona como uma rede de água. Litros por segundo, com metros e milímetros.';
$ec_lang['lpn_ex_basic_us_title']='Rede básica, gpm (EUA)';
$ec_lang['lpn_ex_basic_us_desc']='A mesma rede inicial em galões por minuto, com pés e polegadas.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1 com controles baseados em regras';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='A menor das três redes de exemplo do próprio EPANET: um reservatório, uma bomba e um único anel.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='Um sistema de distribuição ramificado com um tanque, dos exemplos do EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='O grande exemplo do EPANET: 92 junções, 3 tanques e 2 reservatórios, um deles um rio. Vale a pena abrir para ver como fica no mapa um modelo de tamanho real.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3, lat/lon';
$ec_lang['lpn_ex_net3_world_desc']='A rede EPANET Net3 convertida para latitude/longitude em Novato, CA, com o mapa mundial atrás dela.';
$ec_lang['lpn_ex_elm_street_title']='Elm Street Center';
$ec_lang['lpn_ex_elm_street_desc']='Um local comercial resolvido para vazão de incêndio somada à demanda máxima diária, em um único instante, desenhado sobre uma planta do local.';
$ec_lang['lpn_tool_undo']='Desfazer';
$ec_lang['lpn_confirm_example']='Isso adiciona o exemplo à rede que você já tem. Continuar?';
$ec_lang['lpn_field_diameter']='Diâmetro';
$ec_lang['lpn_demand_tip']='Vazões retiradas da rede neste nó. Digite um número negativo para vazão colocada na rede aqui.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='Esta unidade decide o que suas entradas significam';
$ec_lang['lpn_units_warn_lead']='{unit} é a unidade do que você digita para:';
$ec_lang['lpn_units_options_head']='Quando você muda uma unidade:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='Não destrutivo';
$ec_lang['lpn_units_nondestructive_desc']='Não destrutivo: deixa cada entrada como está e a reinterpreta na nova unidade.';
$ec_lang['lpn_units_destructive']='Destrutivo';
$ec_lang['lpn_units_destructive_desc']='Destrutivo: reescreve cada entrada com uma conversão matemática, para que a rede permaneça fisicamente quase a mesma, dentro das tolerâncias de conversão. Isso perde as entradas originais. Desfazer as traz de volta.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='{n} valores agora significam {unit}. Nada foi reescrito.';
$ec_lang['lpn_status_converted']='{n} valores foram reescritos em {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='Comprimento';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='Coordenadas do mapa';
$ec_lang['lpn_units_mapcoords_deg']='graus';
$ec_lang['lpn_units_usft']='ft de levantamento dos EUA';
$ec_lang['lpn_units_elevhead']='Elevação e carga';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='Gradiente de perda de carga';
$ec_lang['lpn_result_gradient_tip']='Perda de carga dividida pelo comprimento do tubo. Use-a para comparar tubos de comprimentos diferentes com um único limite de projeto.';
$ec_lang['lpn_result_water_age']='Idade da água';
$ec_lang['lpn_result_water_age_tip']='Há quanto tempo a água que chega a este ponto está no sistema. Onde vazões se encontram, a água que chega carrega uma mistura de idades, e o número aqui é a média delas ponderada pela vazão: uma junção alimentada principalmente por uma tubulação curta e nova mostra uma idade baixa mesmo que um trecho morto longo também a alimente. Em um tanque, é a idade média da água contida, e é por isso que um tanque que se renova lentamente costuma ter a água mais antiga de uma rede. Não há um limite regulatório para compará-la, então avalie o número em relação ao seu próprio sistema.';
$ec_lang['lpn_result_source_share']='Parcela de origem';
$ec_lang['lpn_result_source_share_tip']='Quanto da água que chega a este ponto veio do nó de rastreamento. É isso que a análise Rastreamento de origem informa.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='Idade média da água';
$ec_lang['lpn_result_avg_source_share']='Parcela média de origem';
$ec_lang['lpn_result_avg_concentration']='Concentração média';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='Fator de atrito';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='Taxa de reação';
$ec_lang['lpn_result_status']='Status';
$ec_lang['lpn_result_status_open']='Aberto';
$ec_lang['lpn_result_status_closed']='Fechado';
$ec_lang['lpn_result_head']='Carga';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='Energia da água neste nó, expressa como uma altura de coluna d\'água. É uma altura absoluta, enquanto a pressão é uma medida manométrica.';
$ec_lang['lpn_result_pressure']='Pressão';
$ec_lang['lpn_result_flow']='Vazão';
$ec_lang['lpn_result_velocity']='Velocidade';
$ec_lang['lpn_result_headloss']='Perda de carga';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='Restaura apenas as configurações deste projeto. Seu desenho e seus outros projetos não são alterados. Para reutilizar suas configurações favoritas, salve um arquivo de projeto contendo apenas as configurações.';
$ec_lang['lpn_reset_all_tip']='Exclui todos os projetos, todas as imagens de fundo, todas as configurações e suas escolhas de unidades, e então recarrega a página exatamente como um visitante de primeira vez a vê. Esta é a única redefinição que limpa tudo.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='Esta calculadora armazena as unidades e os valores de entrada do projeto exatamente como digitados, mas antes ela convertia os números para o SI antes de armazená-los. Este projeto foi salvo antes dessa mudança, então seus números estão armazenados em SI. Converter esses valores uma última vez para as unidades atuais? Para que você possa avaliar, aqui estão alguns diâmetros que seriam convertidos, com seus valores antes e depois:';
$ec_lang['lpn_v2_restore_yes']='Converter';
$ec_lang['lpn_v2_restore_never']='Não. Nunca perguntar novamente.';
$ec_lang['lpn_v2_restore_no']='Fechar para que eu possa verificar as unidades atuais primeiro';
$ec_lang['lpn_storage_too_new']='Este projeto foi salvo por uma versão mais recente da página, portanto não pode ser aberto aqui.';
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
$ec_lang['lpn_tool_file']='Arquivo';
$ec_lang['lpn_menu_edit']='Editar';
$ec_lang['lpn_menu_insert']='Inserir';
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
$ec_lang['lpn_basemap_show']='Mostrar mapa de ruas';
$ec_lang['lpn_basemap_satellite_show']='Mostrar imagens de satélite';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='georreferenciado';
$ec_lang['lpn_xymap']='local';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='Converter como…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='Cópia de {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='Converter como';
$ec_lang['lpn_convas_coordsys_tip']='O sistema de coordenadas para o qual a cópia é convertida. Quando é diferente do deste projeto, duas etapas de posicionamento acontecem em seguida. Um projeto que já sabe onde está começa com as duas etapas já respondidas, então você pode aceitá-las como estão ou fazer alterações.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='Atual: {crs}';
$ec_lang['lpn_convas_epsg']='Sistema de coordenadas EPSG';
$ec_lang['lpn_convas_epsg_tip']='Escolha um sistema de coordenadas no registro EPSG. Latitude e longitude é WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='Georreferência (local) sem nome';
$ec_lang['lpn_convas_unnamed_tip']='Coordenadas locais na unidade de comprimento, com o mapa do mundo anexado.';
$ec_lang['lpn_convas_none_tip']='Coordenadas locais na unidade de comprimento, sem mapa do mundo por enquanto.';
$ec_lang['lpn_convas_units_tip']='As unidades para as quais a cópia é convertida. O original mantém seus próprios números e unidades.';
$ec_lang['lpn_convas_round']='Arredondar valores convertidos';
$ec_lang['lpn_convas_round_tip']='Arredonda apenas os números que esta conversão reescreve, para o incremento mais próximo que você escolher. Valores cuja unidade não muda são deixados como estão.';
$ec_lang['lpn_convas_round_none']='Sem arredondamento';
$ec_lang['lpn_convas_round_flow']='Demanda e vazão';
$ec_lang['lpn_convas_label_col']='Sufixo';
$ec_lang['lpn_convas_label_tip']='Texto adicionado depois deste valor nos rótulos do mapa da cópia, como \' mm\' ou \' gpm\'. Preenchido a partir da unidade escolhida acima; apague-o para nenhum sufixo.';
$ec_lang['lpn_convas_oneway']='Converter de volta é uma segunda conversão, não um desfazer. Um número convertido e convertido de volta pode não retornar exatamente como foi digitado.';
$ec_lang['lpn_convas_ok']='Converter';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} é um dos poucos sistemas de coordenadas listados sem informação de projeção utilizável, então não é possível converter para ele nem a partir dele. Nada foi convertido.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='A cópia convertida é {name}. O projeto original não foi alterado.';
$ec_lang['lpn_convas_cancelled']='Nada foi convertido. A cópia foi fechada, e o projeto original não foi alterado.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='Copia este projeto para uma nova aba e converte a cópia para o sistema de coordenadas e as unidades que você escolher. Quando o sistema de coordenadas muda, um assistente o guia primeiro ampliando aproximadamente o mapa por trás da sua rede, depois escalando e girando sua rede sobre o mapa com mais precisão. Este projeto é deixado exatamente como está. Para georreferenciar sem converter nada, use Mapa, Mapa do mundo, Anexar.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='Este projeto já está georreferenciado, então a rede já está no mapa e nada foi movido. Verifique se está no lugar certo, depois pressione o botão Colocar o modelo aqui e o botão Manter este posicionamento.';
$ec_lang['lpn_georef_intro']='Posicionar o modelo tem duas etapas. A Etapa 1 é a rápida: o modelo fica parado e você move o mapa por baixo dele, até que seu local esteja sob o modelo, aproximadamente no tamanho certo. Ainda não há giro. A Etapa 2 é a precisa: você arrasta, redimensiona e gira o próprio modelo. Seu projeto começa sobre um mapa do mundo inteiro, então encontre seu local primeiro, depois pressione o botão Colocar o modelo aqui.';
$ec_lang['lpn_georef_adjust']='O modelo agora está sobre o terreno, então ele se move junto com o mapa. Arraste o modelo para movê-lo, arraste um canto para redimensioná-lo, arraste a alça redonda acima do modelo para girá-lo. Ou digite a distância no terreno e o ângulo de giro abaixo.';
$ec_lang['lpn_georef_step1']='Etapa 1 de 2 — rápida';
$ec_lang['lpn_georef_step2']='Etapa 2 de 2 — precisa';
$ec_lang['lpn_georef_step1_hint']='Seu projeto permanece onde está na tela. Desloque e aplique zoom no mapa por baixo dele até que o terreno atrás dele esteja aproximadamente no lugar certo e no tamanho certo, depois pressione o botão Colocar o modelo aqui.';
$ec_lang['lpn_georef_detach']='Pegá-lo de novo';
$ec_lang['lpn_georef_size_prompt']='Qual é, aproximadamente, a largura do local, ao longo de todo o projeto?';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='Atalho: pressione {key}.';
$ec_lang['lpn_tool_key_hint_two']='Atalho: pressione {key} ou {key2}.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='Clique no mapa conforme indicado para selecionar tudo dentro da forma. Pressione este botão novamente para alternar a forma entre uma janela, um laço e um polígono. Mantenha Shift pressionado ao selecionar para continuar com a seleção existente, adicionando ou removendo (alternando) o que você seleciona.';
$ec_lang['lpn_area_selected']='{n} selecionados.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='Nada encontrado nessa área.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='Adicione e remova vértices de trechos. Clique em um trecho para adicionar um vértice, clique em um vértice para removê-lo, e arraste um vértice para movê-lo. Um vértice altera o comprimento automático, mas não adiciona nem altera perdas localizadas (menores).';
$ec_lang['lpn_tool_undo_tip']='Desfazer a última alteração.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='Ajustar toda a rede na janela.';
$ec_lang['lpn_tool_zoom_window_tip']='Clique em dois cantos opostos de uma caixa, ou arraste um, no mapa para ampliar essa área. Pressione este botão novamente para Ver tudo.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='Aumentar zoom. Atalho: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='Diminuir zoom. Atalho: -';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='Encontre um elemento pelo seu ID, ou encontre todos os elementos que atendem a uma condição, e altere todos de uma vez.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='Legenda da barra de ferramentas';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='Visibilidade';
$ec_lang['lpn_color_legend_open_tip']='Clique para abrir o painel Visibilidade e alterar essas cores.';
$ec_lang['lpn_color_node_field']='Colorir nós por';
$ec_lang['lpn_color_link_field']='Colorir tubos por';
$ec_lang['lpn_color_ramp_sequential']='Sequencial';
$ec_lang['lpn_color_ramp_diverging']='Divergente';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='Número de faixas';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='Alocação de faixas';
$ec_lang['lpn_color_ranges_note']='Os limites abaixo ficam fixos depois de definidos; eles não acompanham os resultados à medida que mudam. Escolher um método de classificação de dados acima define os limites a partir do estado atual do sistema. Se você alterar qualquer valor manualmente, o método acima passa a ser Manual.';
$ec_lang['lpn_color_criterion_note']='Este método tira seus limites de um padrão de projeto, então o número de cores é fixo enquanto este método está selecionado.';
$ec_lang['lpn_color_break_number']='Um limite precisa ser um número. O mapa não foi alterado.';
$ec_lang['lpn_color_break_order']='Cada limite precisa ser maior que o anterior. O mapa não foi alterado.';
$ec_lang['lpn_color_break_count']='Deve haver um limite a menos que o número de cores. O mapa não foi alterado.';
$ec_lang['lpn_color_ramp_qualitative']='Qualitativa';
$ec_lang['lpn_color_ramp_rainbow']='Arco-íris';
$ec_lang['lpn_color_ramp_rainbow_eg']='igual ao EPANET';
$ec_lang['lpn_color_example_material']='Material';
$ec_lang['lpn_color_ramp_ylgnbu']='Amarelo a azul';
$ec_lang['lpn_color_ramp_rdylbu']='Vermelho a azul, passando por amarelo';
$ec_lang['lpn_georef_drop']='Colocar o modelo aqui';
$ec_lang['lpn_georef_finish']='Manter este posicionamento';
$ec_lang['lpn_georef_scale']='Distância no terreno por unidade de desenho';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='Até onde uma unidade do seu desenho alcança no terreno. Um desenho feito em uma malha simples geralmente não diz nada sobre isso, então defina aqui — ou deixe que Ir para… pergunte a largura do local e calcule isso para você.';
$ec_lang['lpn_georef_rotation']='Girar no sentido anti-horário (graus)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='Quanto girar todo o modelo, no sentido anti-horário, para que o seu norte aponte para o norte.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='Posicionar o modelo aqui permanentemente? Você ainda poderá arrastar elementos individuais depois, mas o desenho deixará de ser um projeto xy. Para recuperar o xy, feche este projeto sem salvar.';
$ec_lang['lpn_georef_done']='Este agora é um projeto lat/lon. Arraste qualquer elemento para movê-lo mais perto de onde ele realmente está.';
$ec_lang['lpn_georef_backdrop_unrotated']='A imagem de fundo foi movida e redimensionada junto com o modelo, mas não pôde ser girada. Use Mapa, Imagem de fundo, Mover para alinhá-la.';
$ec_lang['lpn_georef_empty']='Esse arquivo não tem uma rede, então não há nada para posicionar.';
$ec_lang['lpn_georef_unavailable']='A ferramenta de posicionamento não carregou. Recarregue a página e tente novamente.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='Conclua o posicionamento com o botão "Manter este posicionamento", ou pressione Cancelar, antes de trocar de projeto. O posicionamento pertence a este projeto e não pode acompanhá-lo até outro.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='Conclua o posicionamento com o botão "Manter este posicionamento", ou pressione Cancelar, antes de salvar. O projeto ainda está sendo posicionado, então o que está na tela ainda não é o que seria gravado no arquivo.';
$ec_lang['lpn_goto_menu']='Ir para uma latitude e longitude…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_prompt']='Latitude e longitude, nessa ordem';
$ec_lang['lpn_goto_bad']='Isso não é uma latitude e uma longitude. Tente 38 -122, com um espaço entre elas.';
$ec_lang['lpn_georef_goto']='Ir para…';
$ec_lang['lpn_georef_twopt']='Usar dois pontos conhecidos';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='Posicione o modelo com exatidão, quando você já sabe onde dois pontos do seu desenho realmente estão. Clique em um deles, digite sua latitude e longitude, depois faça o mesmo para um segundo ponto. A posição, a escala e a rotação seguem desses dois pontos. Pressione novamente para cancelar, ou pressione Esc.';
$ec_lang['lpn_georef_twopt_pick1']='Clique em um ponto do seu desenho cuja latitude e longitude você conhece.';
$ec_lang['lpn_georef_twopt_pick2']='Agora clique em um segundo ponto conhecido, o mais distante do primeiro que puder.';
$ec_lang['lpn_georef_twopt_same']='Este é o ponto que você escolheu primeiro. Escolha um diferente.';
$ec_lang['lpn_georef_twopt_done']='O modelo agora está posicionado nos dois pontos que você indicou. Verifique, depois pressione Manter este posicionamento.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='Painel inferior';
$ec_lang['lpn_pane_toggle_tip']='Mostra ou oculta o painel abaixo do mapa. Ele contém o perfil e uma tabela para cada tipo de elemento.';
$ec_lang['lpn_pane_resize']='Arraste para tornar o painel mais alto ou mais baixo';
$ec_lang['lpn_pane_tab_junctions']='Junções';
$ec_lang['lpn_pane_tab_reservoirs']='Reservatórios';
$ec_lang['lpn_pane_tab_tanks']='Tanques';
$ec_lang['lpn_pane_tab_pipes']='Tubos';
$ec_lang['lpn_pane_tab_pumps']='Bombas';
$ec_lang['lpn_pane_tab_valves']='Válvulas';
$ec_lang['lpn_pane_tab_tip']='Esta aba mostra os elementos deste tipo como uma tabela que você pode ordenar e editar. As colunas de resultados não podem ser editadas.';
$ec_lang['lpn_pane_none']='Esta rede ainda não tem nenhum destes.';
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
$ec_lang['lpn_pane_text_attached']='Anexado';
$ec_lang['lpn_pane_not_used']='Não usado';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='Filtrado por {q}. Mostrando {n} de {all}.';
$ec_lang['lpn_pane_filter_clear']='Mostrar tudo';
$ec_lang['lpn_pane_filter_stale']='Linhas que não correspondem mais: {n}.';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='Nada nesta tabela corresponde ao filtro.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='Ampliar e selecionar';
$ec_lang['lpn_goto_on_map']='Mostrar no mapa';
$ec_lang['lpn_pane_select_on_map']='Selecionar no mapa';
$ec_lang['lpn_pane_unselect_on_map']='Remover seleção no mapa';
$ec_lang['lpn_pane_print']='Imprimir tabela';

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
$ec_lang['lpn_menu_project']='Água';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='Tudo sobre a modelagem da rede de água está aqui em um só lugar, exceto os controles de reprodução da animação. Não é preciso adivinhar onde as coisas estão.';
$ec_lang['lpn_tables_menu']='Tabelas';
$ec_lang['lpn_tables_menu_tip']='Abre o painel abaixo do mapa em uma tabela das partes desta rede. Há uma tabela para cada tipo de parte, e você pode ordená-la e editá-la ali.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='Recalcula esta rede agora. Está procurando o botão Executar? Ele fica oculto enquanto a configuração Recalcular automaticamente está ligada. Para trazer o botão de volta, desligue Recalcular automaticamente em Configurações, Cálculo, Hidráulica.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='Recalcular automaticamente';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='Quando isto está ligado, este projeto recalcula pouco depois de cada mudança que você faz, e o botão Calcular sai da barra de ferramentas porque não sobra nada para ele fazer. Desligue em uma rede grande, onde esperar cada mudança recalcular atrapalha a digitação, e o botão Calcular volta para que você escolha quando executar.';
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
$ec_lang['lpn_time_run_slow']='Esta rede levou {secs} s para calcular, e está configurada para recalcular depois de cada mudança. Para interromper isso e recuperar um botão Calcular, desligue "Recalcular automaticamente" em Configurações, em Cálculo, Hidráulica.';
$ec_lang['lpn_time_no_report']='Ainda não há relatório de execução. O relatório é o próprio texto do EPANET, então ele aparece assim que esta rede for calculada com o solucionador EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='Ajuda';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='Galeria de capturas de tela';
$ec_lang['lpn_help_walkthroughs']='Tutoriais';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='Excluir rede';
$ec_lang['lpn_confirm_delete_network']='Excluir todos os nós, tubos e rótulos de texto deste projeto? A imagem de fundo, o nome do projeto e suas configurações são mantidos.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='Localizar e substituir';
$ec_lang['lpn_find_title']='Localizar e substituir';
$ec_lang['lpn_find_scope']='O que pesquisar';
$ec_lang['lpn_find_scope_all']='Tudo';
$ec_lang['lpn_find_property']='Propriedade';
$ec_lang['lpn_find_condition']='Condição';
$ec_lang['lpn_find_value']='Valor';
$ec_lang['lpn_find_btn']='Localizar';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='Filtrar na tabela atual';
$ec_lang['lpn_find_filter_tip']='Mostra apenas as partes que correspondem a esta consulta em uma das tabelas abaixo do mapa. O desenho não é alterado e nada é excluído.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} de {all}';
$ec_lang['lpn_find_filter_summary']='Filtrado por {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='Esta consulta não se aplica a nenhuma tabela.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='contém';
$ec_lang['lpn_find_op_equals']='igual a';
$ec_lang['lpn_find_op_gt']='maior que';
$ec_lang['lpn_find_op_lt']='menor que';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='vazio';
// {n} is a whole number.
$ec_lang['lpn_find_count']='{n} encontrados. Clique em um para ir até ele.';
$ec_lang['lpn_find_shift_hint']='Shift+clique para alternar: adiciona se não estiver no conjunto de seleção, ou remove se já estiver no conjunto de seleção.';
$ec_lang['lpn_find_none']='Nada correspondeu.';
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
$ec_lang['lpn_find_op_top']='{n} maiores';
$ec_lang['lpn_find_op_bottom']='{n} menores';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='Digite o que procurar.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='Conectividade';
$ec_lang['lpn_find_prop_demand_desc']='Descrição desta categoria de demanda';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='sem trechos no nó';
$ec_lang['lpn_find_op_conn_noopen']='sem trechos abertos no nó';
$ec_lang['lpn_find_op_conn_nolinksource']='sem caminho de trechos até uma origem';
$ec_lang['lpn_find_op_conn_noopensource']='sem caminho aberto até uma origem';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='Todos os nós estão conectados.';
$ec_lang['lpn_find_conn_no_fixed']='Esta rede não tem reservatório nem tanque, então não há origem a alcançar. Só é possível buscar por sem trechos no nó e sem trechos abertos no nó.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='A mesma busca, escrita em uma única linha. Alterar os controles reescreve esta linha, e digitar nesta linha atualiza os controles.';
$ec_lang['lpn_find_query_label']='Consulta';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='Combine condições com E, OU e ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='E';
$ec_lang['lpn_find_q_or']='OU';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='Os controles não conseguem expressar a consulta abaixo, então estão ocultos.';
$ec_lang['lpn_find_q_restore']='Usar os controles';
$ec_lang['lpn_replace_q_bad']='Esta consulta não pôde ser entendida, então nada será alterado. Corrija-a acima primeiro.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(no caractere {n})';
$ec_lang['lpn_find_q_err_empty']='A consulta está vazia, então nada será buscado.';
$ec_lang['lpn_find_q_err_scope']='Não há nada chamado {w} para buscar. Tente um destes: {list}';
$ec_lang['lpn_find_q_err_dot']='Coloque um ponto entre o que buscar e sua propriedade, como Junção.ID';
$ec_lang['lpn_find_q_err_prop']='Não é uma propriedade de {scope}: {w}. Tente uma destas: {list}';
$ec_lang['lpn_find_q_err_op']='Não é uma condição para {prop}: {w}. Tente uma destas: {list}';
$ec_lang['lpn_find_q_err_value']='Esta condição precisa de um valor depois dela: {op}';
$ec_lang['lpn_find_q_err_quote']='Coloque aspas em torno de um valor de texto: {w} não é um número.';
$ec_lang['lpn_find_q_err_quote_end']='Este texto entre aspas não tem aspas de fechamento.';
$ec_lang['lpn_find_q_err_close']='Este parêntese ( foi aberto e nunca fechado.';
$ec_lang['lpn_find_q_err_open']='Este parêntese ) não fecha nada.';
$ec_lang['lpn_find_q_err_end']='Nada era esperado depois disto. Junte duas buscas com {and} ou {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='Alterar o que foi encontrado';
$ec_lang['lpn_replace_prop']='Propriedade a alterar';
$ec_lang['lpn_replace_value']='Novo valor';
$ec_lang['lpn_replace_source']='Nova fonte do valor';
$ec_lang['lpn_replace_asked']='Elevações solicitadas para {n} nós. Os resultados estão a caminho.';
$ec_lang['lpn_replace_btn']='Substituir';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='Alterar {n} elementos?';
$ec_lang['lpn_replace_apply']='Alterar';
$ec_lang['lpn_replace_done']='{n} elementos alterados. Você pode desfazer isso em uma etapa.';
$ec_lang['lpn_replace_none']='Nada mudaria.';
$ec_lang['lpn_replace_no_value']='Digite o novo valor.';
$ec_lang['lpn_replace_scope']='Escolha um tipo de elemento acima para alterar valores nele.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='Perfil';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_title']='Perfil ao longo de um caminho';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='Clique no nó onde o caminho começa.';
$ec_lang['lpn_profile_draw_more']='Passe o cursor pelo mapa para ver o caminho. Clique em um nó para adicioná-lo. Clique duas vezes para terminar. Esc cancela.';
$ec_lang['lpn_profile_draw_blocked']='Não há rota de {a} até {b}. Escolha outro nó.';
$ec_lang['lpn_profile_tap_start']='Toque no nó onde o caminho começa.';
$ec_lang['lpn_profile_tap_more']='Toque em um nó para ver o caminho. Pressione e segure para adicioná-lo. Toque duas vezes para terminar. Toque em Perfil novamente para cancelar.';
$ec_lang['lpn_profile_say_idle']='Toque em Perfil novamente para escolher um novo caminho no mapa.';
$ec_lang['lpn_profile_none']='Ainda não há caminho. Toque em Perfil novamente para escolher um no mapa.';
$ec_lang['lpn_profile_choose']='Escolha um nó de início e um nó de fim.';
$ec_lang['lpn_profile_no_path']='Esses dois nós não estão conectados por nenhuma rota.';
$ec_lang['lpn_profile_no_solve']='Ainda não há resultados, então apenas a linha do terreno é desenhada.';
$ec_lang['lpn_profile_summary']='Nós: {n}, comprimento: {len} {u}';
$ec_lang['lpn_profile_axis_station']='Distância ao longo da rota ({u})';
$ec_lang['lpn_profile_axis_elev']='Elevação e carga ({u})';
$ec_lang['lpn_profile_ground']='Superfície do terreno';
$ec_lang['lpn_profile_hgl']='Linha piezométrica';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='Editar';
$ec_lang['lpn_profile_edit_tip']='Altere uma extremidade do caminho, ou remova um nó dele, sem desenhar todo o caminho de novo.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='Arraste qualquer ponto do caminho para movê-lo. Clique em um ponto que você adicionou para removê-lo.';
$ec_lang['lpn_profile_edit_tap']='Arraste qualquer ponto do caminho para movê-lo. Toque em um ponto que você adicionou para removê-lo.';
$ec_lang['lpn_profile_edit_nowhere']='Um ponto do caminho precisa ser um nó. O caminho não foi alterado.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='Caminhos salvos';
$ec_lang['lpn_profile_new']='Novo caminho salvo…';
$ec_lang['lpn_profile_new_name']='Caminho {n}';
$ec_lang['lpn_profile_rename']='Renomear caminho…';
$ec_lang['lpn_profile_delete']='Excluir caminho';
$ec_lang['lpn_profile_prompt_name']='Nome para este caminho';
$ec_lang['lpn_profile_delete_confirm']='Excluir o caminho salvo {name}? O desenho em si não é alterado.';
$ec_lang['lpn_profile_none_saved']='Nenhum caminho salvo ainda';
$ec_lang['lpn_profile_missing']='O caminho salvo {name} usa nós que não estão neste projeto: {ids}';
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
$ec_lang['lpn_ts_menu']='Séries temporais';
$ec_lang['lpn_ts_tip']='Trace o gráfico de um ou mais elementos ao longo do tempo em uma simulação de período estendido.';
$ec_lang['lpn_ts_title']='Valores ao longo do tempo';
$ec_lang['lpn_ts_group_nodes']='Nós';
$ec_lang['lpn_ts_group_links']='Trechos';
$ec_lang['lpn_ts_add']='Adicionar selecionados';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='Nada desse tipo está escolhido no mapa.';
$ec_lang['lpn_ts_clear']='Remover todos';
$ec_lang['lpn_ts_chip_tip']='Tirar {id} do gráfico';
$ec_lang['lpn_ts_none']='Nada para traçar ainda. Selecione elementos no mapa e pressione Adicionar selecionados.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='Ainda não há resultados de período estendido. Pressione Calcular para executar a simulação.';
$ec_lang['lpn_ts_summary']='Elementos: {n}, horários de relatório: {steps}';
$ec_lang['lpn_ts_axis_time']='Tempo decorrido';
$ec_lang['lpn_freq_menu']='Frequência';
$ec_lang['lpn_freq_tip']='Trace o gráfico da distribuição de frequência de uma propriedade em todas as junções ou todos os tubos no passo de tempo atual.';
$ec_lang['lpn_freq_title']='Distribuição de valores';
$ec_lang['lpn_freq_none']='Ainda não há resultados para este valor, portanto não há nada para traçar.';
$ec_lang['lpn_freq_summary']='Traçados: {n} de {total}';
$ec_lang['lpn_freq_summary_time']='Traçados: {n} de {total}, em {time}';
$ec_lang['lpn_freq_axis_percent']='Porcentagem menor que';
$ec_lang['lpn_view_units']='Unidades';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='Salvar tudo';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='Projeto{n}';
$ec_lang['lpn_project_copy_suffix']='(cópia)';
$ec_lang['lpn_project_rename']='Renomear';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='Novo projeto…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='Novo projeto';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='Sistema de coordenadas';
$ec_lang['lpn_new_coordsys_tip']='Selecione o sistema de coordenadas da sua rede. Isso é permanente; a única forma de converter uma rede para coordenadas diferentes é com "Arquivo, Abrir em novas coordenadas", e isso é aproximado.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='Local, esquemático ou personalizado';
$ec_lang['lpn_new_coordsys_local_tip']='Não georreferenciado. Anexe sua própria imagem de fundo ou nenhuma.';
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
$ec_lang['lpn_crs_view']='Filtrar pela visualização do mapa';
$ec_lang['lpn_crs_view_tip']='Oferece apenas as projeções que cobrem o lugar para onde o mapa está olhando. Desligue para ler a lista inteira.';
$ec_lang['lpn_crs_place']='Busca por nome de lugar';
$ec_lang['lpn_crs_place_tip']='Digite uma cidade, um endereço ou um ponto de referência, e a visualização do mapa se move para lá. As palavras que você digita vão para o serviço de nomes de lugares do OpenStreetMap, que pede sua permissão na primeira vez. Um novo projeto geográfico também começa no lugar que você encontrar aqui.';
$ec_lang['lpn_crs_search']='Buscar';
$ec_lang['lpn_crs_name']='Filtro de nome da projeção';
$ec_lang['lpn_crs_name_tip']='Mostra apenas as projeções cujo nome ou código EPSG contém o que você digitar. Tente um número de zona, ou UTM, ou Mercator.';
$ec_lang['lpn_crs_list_tip']='As projeções restantes depois dos dois filtros acima. Escolha uma e pressione Selecionar.';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='Nenhum lugar foi buscado ainda, então a lista inteira é oferecida. Busque um lugar acima ou aplique zoom no mapa para restringir.';
$ec_lang['lpn_crs_count']='{n} de {total} projeções listadas.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} de {total} sistemas de coordenadas cobrem esta rede.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(sem mapa)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} é um dos poucos sistemas de coordenadas listados sem informação de projeção utilizável. Isso significa que o mapa do mundo, a busca por nome de lugar e as elevações do DEM não funcionam. Suas coordenadas não são afetadas.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='sem nome';
$ec_lang['lpn_crs_none']='Não georreferenciado';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='Um projeto mantém suas próprias unidades, então esta escolha pertence apenas a este projeto e nada aqui é salvo como configuração do navegador. Para iniciar novos projetos de um jeito específico, salve um projeto vazio como seu modelo e faça uma cópia dele cada vez.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='Petaluma, Califórnia';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='Criar';
$ec_lang['lpn_file_open']='Abrir…';
$ec_lang['lpn_file_save']='Salvar';
$ec_lang['lpn_file_saveas']='Salvar como…';
$ec_lang['lpn_file_revert']='Reverter';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='Arquivos recentes';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_denied']='A permissão para abrir esse arquivo não foi concedida, então ele não foi aberto.';
$ec_lang['lpn_recent_gone']='Não foi possível abrir {file}. Ele pode ter sido movido, renomeado ou excluído, então foi removido da lista de recentes.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='Novo projeto';
$ec_lang['lpn_tab_all']='Todos os projetos';
$ec_lang['lpn_tab_menu']='Menu do projeto';
$ec_lang['lpn_tab_duplicate']='Duplicar';
$ec_lang['lpn_tab_move_left']='Mover para a esquerda';
$ec_lang['lpn_tab_move_right']='Mover para a direita';
$ec_lang['lpn_tab_unsaved']='Não salvo em um arquivo';
$ec_lang['lpn_import_bad_file']='Esse arquivo não pôde ser lido como um projeto salvo a partir desta página.';
$ec_lang['lpn_import_no_room']='Não há espaço suficiente no armazenamento do navegador para adicionar este projeto. Exclua um projeto de que não precisa mais e tente novamente.';
$ec_lang['lpn_file_import_menu']='Importar…';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='OK';
$ec_lang['lpn_file_import_inp']='Importar arquivo EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='Lê uma rede a partir de um arquivo EPANET, seja o arquivo de texto .inp ou o arquivo .net salvo pelo EPANET, e a salva neste navegador como um novo projeto.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='Exportar arquivo EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='Grava esta rede como um arquivo EPANET .inp e faz o download. Os números que você digitou são gravados exatamente como você os digitou. Tudo o que o formato .inp não consegue armazenar é listado para você em seguida.';
$ec_lang['lpn_status_inp_exported']='{file} exportado.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} itens que o formato .inp não consegue armazenar.';
$ec_lang['lpn_inp_export_refused']='Este projeto não pode ser gravado como um arquivo EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='Esse arquivo não pôde ser lido como um arquivo de rede EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='Isso parece ser um arquivo .net do EPANET, mas esta página não conseguiu lê-lo. Abra-o no EPANET e use o comando Arquivo, Exportar, Rede para salvá-lo como um arquivo .inp e, então, importe esse arquivo.';
$ec_lang['lpn_inp_report_heading']='{file} importado';
$ec_lang['lpn_inp_report_counts']='{nodes} junções, reservatórios e tanques, {links} tubulações, bombas e válvulas, em {units}.';
$ec_lang['lpn_inp_report_clean']='Tudo no arquivo foi transferido. Nada foi deixado de fora.';
$ec_lang['lpn_inp_report_label_anchor']='Os rótulos de texto são posicionados como o EPANET os posiciona, a partir do canto superior esquerdo.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='Arquivos EPANET não contêm sistema de coordenadas, então este arquivo não estará georreferenciado inicialmente. Para colocá-lo em um mapa do mundo, use Mapa, Mapa do mundo… Para converter suas coordenadas, use Arquivo, Converter como…';
$ec_lang['lpn_inp_report_lead']='Esta página não usa tudo o que o EPANET usa, mas nada no seu arquivo é descartado. Abaixo está o que seu arquivo contém que esta página mantém sem usar, e o que foi alterado quando o arquivo foi lido:';
$ec_lang['lpn_inp_drop_headloss']='Este arquivo não usa a fórmula de Hazen-Williams. Esta página calcula com Hazen-Williams, então os números de rugosidade das tubulações foram mantidos exatamente como escritos, mas as respostas aqui não corresponderão às respostas no EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='Estes tanques não têm lados retos: o arquivo dá sua forma como uma curva. A curva é mantida na caixa Bibliotecas, o tanque continua indicando-a, e uma simulação de período estendido enche e esvazia o tanque conforme a curva indica. Um único instante é o mesmo de qualquer forma, porque a superfície da água é o nível que o arquivo define. O diâmetro escrito no arquivo é mantido ao lado da curva e é o que um tanque sem curva é desenhado e resolvido como.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='Estas válvulas de estrangulamento vieram como válvulas de estrangulamento, mantendo a mesma perda que o arquivo lhes atribui. Qualquer um dos dois solucionadores consegue calculá-las.';
$ec_lang['lpn_inp_drop_valve_active']='Estas válvulas controlam pressão ou vazão, e abrem e fecham por conta própria conforme a água muda. Nada sobre elas foi perdido na importação, e esta página as resolve com o solucionador do EPANET, ativando esse solucionador automaticamente para esta rede.';
$ec_lang['lpn_inp_drop_valve']='Estas válvulas são descritas por uma curva ou por uma queda de pressão fixa, e esta página não tem esse tipo de elemento. Elas entraram como trechos abertos, então a rede continua conectada, mas nada mais controla a pressão ou a vazão ali.';
$ec_lang['lpn_inp_drop_cv']='No EPANET, estas tubulações permitem que a água passe em apenas uma direção. Elas vieram como tubulações comuns, então a água agora pode fluir em qualquer sentido por elas.';
$ec_lang['lpn_inp_drop_demands']='Estas junções tinham mais de uma demanda. As demandas foram somadas em uma única demanda que esta página mantém.';
$ec_lang['lpn_inp_drop_patterns']='Esta página não leu os padrões de demanda, porque a parte dela que executa uma simulação de período estendido não foi carregada. Cada demanda é o número escrito no arquivo.';
$ec_lang['lpn_inp_drop_demand_pattern']='Estas junções mudam sua demanda ao longo da execução. Seus padrões vieram completos, e a demanda que você vê é a do momento que o relógio está mostrando.';
$ec_lang['lpn_inp_drop_emitters']='Estas junções têm um coeficiente de emissor (aspersor ou vazamento). Ele foi mantido e está sendo resolvido, mas ainda não há como vê-lo ou alterá-lo nesta página.';
$ec_lang['lpn_inp_drop_curve_long']='Esta curva de bomba tinha mais de três pontos. Seus pontos mais baixo, médio e mais alto foram mantidos, porque esta página ajusta uma curva a no máximo três pontos.';
$ec_lang['lpn_inp_drop_curve_missing']='Esta bomba indica uma curva que não está no arquivo. A bomba entrou sem curva, então não adiciona carga.';
$ec_lang['lpn_inp_drop_pump_other']='Esta bomba é descrita pela potência que consome, em vez de por uma curva. Ela chegou sem curva, então não acrescenta carga.';
$ec_lang['lpn_inp_drop_head_pattern']='Estes reservatórios sobem e descem ao longo da execução. Seus padrões vieram completos, e o nível de água que você vê é o do momento que o relógio está mostrando.';
$ec_lang['lpn_inp_drop_pump_speed']='Estas bombas funcionam em uma velocidade diferente daquela em que sua curva foi medida, ou mudam de velocidade ao longo da execução. A velocidade e seu padrão vieram completos, e a carga que você vê é a do momento que o relógio está mostrando.';
$ec_lang['lpn_inp_drop_setting']='Estas tubulações, bombas e válvulas têm uma configuração que esta página não consegue manter. Elas entraram abertas.';
$ec_lang['lpn_inp_drop_rules']='Este arquivo tem controles baseados em regras. Esta página as lê e as usa. Execute o modelo com o motor EPANET e as regras são aplicadas, com cada nível, pressão e vazão nelas convertidos para as unidades que este projeto está mostrando. Abra Regras em Bibliotecas para ler ou alterar uma. Elas são mantidas exatamente como o arquivo as indica, e são gravadas de volta se você salvar um arquivo EPANET.';
$ec_lang['lpn_inp_drop_eps']='Este arquivo descreve uma simulação de período estendido. A parte desta página que executa uma simulação de período estendido não foi carregada, então apenas as condições iniciais foram importadas.';
$ec_lang['lpn_inp_drop_quality']='Este arquivo descreve como a qualidade da água muda ao longo do percurso: o que há na água no início, e com que rapidez essa substância reage nos trechos e nos tanques. Esta página lê esses números e os usa. Escolha um produto químico em Configurações, Cálculo, Qualidade da água, depois execute o modelo com o motor EPANET, e a concentração é calculada ao longo da rede conforme a execução avança. As linhas são mantidas, e são gravadas de volta se você salvar um arquivo EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='Este arquivo diz onde um produto químico é dosado na rede, e como a água em um tanque se mistura. Uma dose aparece no nó em que é adicionada, e um tanque indica qual modelo de mistura segue. Tanto a dose quanto o modelo de mistura são calculados apenas pelo motor EPANET.';
$ec_lang['lpn_inp_drop_energy']='Este arquivo EPANET inclui dados de modelagem de custo de bombeamento. Esta página os lê e os usa. Execute o modelo com o motor EPANET, depois abra Água, Relatórios, Energia das bombas para ver quanto tempo cada bomba funcionou, a potência que consumiu, a energia que usou e quanto isso custou. As linhas são mantidas, e são gravadas de volta se você salvar um arquivo EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='Este arquivo atribui etiquetas a algumas de suas junções, trechos ou outros elementos. Cada etiqueta veio completa, e cada uma fica nas propriedades do seu próprio elemento, onde você pode lê-la ou alterá-la.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='Este arquivo contém as configurações do próprio EPANET para como ele formata o relatório que imprime. Você pode ler o relatório do motor aqui, em Relatórios, Execução EPANET, mas ele sai no formato padrão do motor em vez do formato que estas configurações pedem. As linhas são mantidas, e são gravadas de volta se você salvar um arquivo EPANET.';
$ec_lang['lpn_inp_drop_sections']='Este arquivo tem uma seção que esta página não lê. Nada aqui a usa. Ela é mantida inteira, e é gravada de volta se você salvar um arquivo EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='Este arquivo indica opções de qualidade da água do EPANET: a opção Quality, que nomeia o tipo de análise de qualidade da água, e duas configurações associadas a um produto químico, Relative diffusivity e Quality tolerance. As três são mantidas e as três são usadas. Idade da água, rastreamento de origem e um produto químico são cada um calculados aqui, e as duas configurações do produto químico são passadas ao motor EPANET quando você executa um produto químico. Todas elas são gravadas de volta se você salvar um arquivo EPANET.';
$ec_lang['lpn_inp_drop_file_options']='Este arquivo referencia um arquivo auxiliar: Map, que contém coordenadas, ou Hydraulics, que contém a hidráulica já calculada. Esta página não pode abrir nenhum dos dois, então as linhas são mantidas como estão e gravadas de volta se você salvar um arquivo EPANET.';
$ec_lang['lpn_inp_drop_other_options']='Este arquivo define opções que esta página não lê. Nada aqui as usa. Elas são mantidas e são gravadas de volta se você salvar um arquivo EPANET.';
$ec_lang['lpn_inp_drop_net_options']='Este arquivo .net do EPANET define configurações para as quais esta página não tem controle, então seus valores são listados aqui em vez de transportados. Todo o resto foi importado. Se precisar delas, abra o arquivo no EPANET e use Arquivo, Exportar, Rede para salvá-lo como um arquivo .inp, depois importe esse.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='Este era um arquivo .net do EPANET. Esse é o próprio arquivo de projeto do EPANET, não tem uma descrição publicada, e esta página o lê deduzindo o formato a partir de arquivos de exemplo, então use-o apenas quando não tiver outra opção, e não como um caminho confiável. O arquivo .inp é o formato documentado que todo outro programa lê: no EPANET use Arquivo, Exportar, Rede para gravar um, e importe esse em vez deste sempre que puder.';
$ec_lang['lpn_inp_drop_backdrop']='Este arquivo indica uma imagem de fundo, mas não contém a própria imagem. Adicione-a você mesmo com Arquivo, Imagem de fundo, Adicionar imagem.';
$ec_lang['lpn_inp_drop_dangling']='Estas tubulações indicam uma junção que não está no arquivo, então foram deixadas de fora.';
$ec_lang['lpn_inp_drop_units']='A unidade de vazão informada neste arquivo não é uma unidade que esta página conhece, então todos os números foram lidos como galões por minuto. Verifique cada número antes de usar os resultados.';
$ec_lang['lpn_inp_drop_anchor_missing']='Este texto estava anexado a uma junção, reservatório ou tanque que não está no arquivo. Ele entrou como texto livre no lugar em que o arquivo o colocou, e agora não segue nada.';
$ec_lang['lpn_import_notes_heading']='Este projeto foi lido de um arquivo EPANET. Parte do que esse arquivo contém é mantida, mas não é usada nesta página.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='{name} foi aberto a partir de um arquivo e adicionado a este navegador como um novo projeto.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='Arquivo de projeto';
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
$ec_lang['lpn_file_upload_explain']='Este navegador não consegue se conectar a um arquivo, então abrir um arquivo aqui é na verdade um upload: o projeto é copiado para este navegador, e a única forma de salvar seu trabalho de volta no arquivo é sobrescrevê-lo com Arquivo, Salvar como.';
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
$ec_lang['lpn_file_saveas_tip_download']='Salva usando as configurações de Download do seu navegador. Este navegador não consegue se conectar a um arquivo, então Salvar está desativado e apenas Salvar como está disponível. Se você ativar a configuração do navegador "Perguntar onde salvar cada arquivo", poderá escolher o arquivo original e sobrescrevê-lo.';
$ec_lang['lpn_status_uploaded']='Arquivo de projeto enviado (upload). Nenhuma conexão com ele pode ser mantida, então a única forma de salvar de volta nele é usando Arquivo, Salvar como.';
$ec_lang['lpn_status_downloaded']='{file} baixado. Este navegador não consegue se conectar a um arquivo, então este projeto permanece marcado como não salvo em um arquivo.';
$ec_lang['lpn_status_file_opened']='{file} aberto.';
$ec_lang['lpn_status_already_open']='Esse arquivo já está aberto aqui como {name}, então isso mudou para ele em vez de abrir uma segunda cópia.';
$ec_lang['lpn_status_already_open_dirty']='Esse arquivo já está aberto aqui como {name}, com alterações que você ainda não salvou nele. Isso mudou para ele em vez de abrir uma segunda cópia. Use Arquivo, Reverter se preferir a versão no disco.';
$ec_lang['lpn_status_saved']='{file} salvo.';
$ec_lang['lpn_status_reverted']='{file} carregado novamente do disco.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='Salvar suas alterações em {name} antes de fechá-lo?';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='{name} é mantido apenas neste navegador. Se você fechá-lo sem salvá-lo em um arquivo, ele será perdido definitivamente.';
$ec_lang['lpn_close_discard']='Fechar sem salvar';
$ec_lang['lpn_cancel']='Cancelar';
$ec_lang['lpn_revert_confirm']='Descartar as alterações que você fez e carregar {file} novamente do disco?';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='Este projeto veio de {file}, mas a conexão com esse arquivo foi perdida. Escolha o arquivo novamente para se conectar a ele.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='Não foi possível gravar no arquivo. Ele pode ter sido movido ou renomeado, ou a permissão pode ter sido retirada. Seu trabalho ainda está salvo neste navegador.';
$ec_lang['lpn_file_changed_elsewhere']='Outra pessoa salvou neste arquivo desde que você o abriu, então salvar agora sobrescreveria o trabalho dela. Use Arquivo, Salvar como para manter suas alterações em um arquivo próprio, ou Arquivo, Reverter para descartar as suas e carregar as dela.';
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
$ec_lang['lpn_lock_somebody']='Outra pessoa';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} tem este arquivo aberto.';
$ec_lang['lpn_lock_open_readonly']='Abrir somente leitura';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='Quebrar o bloqueio dessa pessoa';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='Este arquivo parece estar em uso.';
$ec_lang['lpn_lock_open_care']='Para evitar perda de dados, escolha com cuidado entre as opções abaixo.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='Está em uso há {x}.';
$ec_lang['lpn_lock_age_edited']='Foi editado pela última vez há {x}.';
$ec_lang['lpn_lock_age_saved']='Foi salvo pela última vez há {x}.';
$ec_lang['lpn_lock_age_never_saved']='Nada foi salvo neste arquivo ainda.';
$ec_lang['lpn_lock_age_unknown']='Não há registro de há quanto tempo está em uso, nem de quando foi salvo ou editado pela última vez.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"Perguntar" avisa quem tem este arquivo aberto que você gostaria dele, e não muda mais nada. "Abrir somente leitura" permite que você o veja e altere o que quiser, sem poder salvar aqui. "Quebrar bloqueio" permite que você salve sobre o arquivo; o trabalho não salvo dessa pessoa não é perdido, mas ela não poderá mais salvá-lo aqui, e alguém pode precisar mesclar os dois manualmente.';
$ec_lang['lpn_lock_ask']='Perguntar';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='Quem devemos dizer que está perguntando? Suas iniciais são ideais. Elas são mantidas com o bloqueio deste arquivo em nosso servidor, para quem o tiver aberto, e são excluídas em até 30 dias.';
$ec_lang['lpn_lock_ask_sent']='Perguntamos a quem tem este arquivo aberto se pode fechá-lo. Essa pessoa verá isso em até um minuto, se sua página ainda estiver aberta. Nada mais mudou, e o arquivo ainda é dela até que o feche.';
$ec_lang['lpn_lock_ask_failed']='Sua mensagem não pôde ser entregue. Ou ninguém tem este arquivo aberto agora, ou o servidor não pôde ser contatado.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='Esse arquivo não foi aberto, e nada aqui mudou. Outra pessoa ainda o tem aberto.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='{name} gostaria de editar este arquivo. Quando estiver pronto, salve seu trabalho e use Arquivo, Fechar projeto para repassá-lo.';
$ec_lang['lpn_ago_seconds']='{n} segundos';
$ec_lang['lpn_ago_minutes']='{n} minutos';
$ec_lang['lpn_ago_hours']='{n} horas';
$ec_lang['lpn_ago_days']='{n} dias';
$ec_lang['lpn_ago_unknown']='um tempo desconhecido';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='Mensagens';
$ec_lang['lpn_msglog_heading']='Mensagens recentes';
$ec_lang['lpn_msglog_empty']='Nenhuma mensagem ainda.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='há {x}';
$ec_lang['lpn_msglog_note']='Mais recentes primeiro. Esta página mantém as últimas {n} mensagens enquanto está aberta, e nada é armazenado no seu computador.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='Somente leitura: {name} tem este arquivo aberto. Você pode alterar o que quiser aqui, mas não pode salvar. Use Arquivo, Salvar como para salvar em um arquivo diferente.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='Atenção: não foi possível contatar o servidor para verificar ou criar um bloqueio neste projeto, então nada impede que um colega edite o mesmo arquivo ao mesmo tempo. Você será avisado se o bloqueio voltar a funcionar.';
$ec_lang['lpn_lock_storage_error']='Atenção: este site não consegue salvar registros de bloqueio, então nada impede que um colega edite o mesmo arquivo ao mesmo tempo. Esta é uma falha de configuração no servidor, não algo que você possa corrigir aqui — a pasta de bloqueios não tem permissão de gravação pelo servidor web.';
$ec_lang['lpn_lock_full_error']='Atenção: este site ficou sem espaço para registrar quem tem qual projeto aberto, então nada impede que um colega edite o mesmo arquivo ao mesmo tempo. Esta é uma falha de configuração no servidor, não algo que você possa corrigir aqui.';
$ec_lang['lpn_lock_not_asked']='O bloqueio não está funcionando para este projeto, então nada impede que um colega edite o mesmo arquivo ao mesmo tempo. Este navegador ainda não tem um nome registrado para você, ou o projeto não tem um identificador — salvar o projeto em um arquivo define ambos.';
$ec_lang['lpn_lock_restored']='O bloqueio está funcionando novamente, e este arquivo agora é seu para salvar.';
$ec_lang['lpn_lock_dismiss']='Ocultar esta mensagem';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='Seu projeto será salvo em um arquivo neste computador. Ele é salvo quando você pede, e em nenhum outro momento, então nada é gravado nesse arquivo sem o seu conhecimento.';
$ec_lang['lpn_file_training_2']='Para que duas pessoas nunca editem um mesmo arquivo ao mesmo tempo, este site mantém o controle de quem o tem aberto. Se outra pessoa já o tiver aberto, você ainda pode abri-lo para olhar, ou manter uma cópia própria.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='Na primeira vez que você salvar, seu navegador perguntará se este site pode editar o arquivo. Essa pergunta vem do navegador, não de nós, e responder sim é o que permite que Salvar grave seu trabalho de volta. Geralmente é perguntado apenas uma vez por arquivo.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='Continuar';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='Escolher o arquivo novamente';
$ec_lang['lpn_file_reconnect']='Reconectar a este arquivo';
$ec_lang['lpn_file_reconnect_alert']='Este projeto veio de {file}. Seu navegador precisa da sua permissão novamente antes de poder gravar nele. Reconecte abaixo.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='Esse é o mesmo arquivo que outra pessoa tem aberto, então não é possível salvar por cima dele. Escolha um arquivo ou nome diferente.';
$ec_lang['lpn_saveas_overwrites_project']='Esse arquivo já contém um projeto diferente, {name}. Salvar aqui o substituirá completamente. Continuar?';
$ec_lang['lpn_saveas_overwrites_newer']='Esse arquivo mudou desde a última vez que você o viu, então quase certamente outra pessoa salvou nele. Salvar aqui substituirá a versão dela pela sua. Continuar?';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='Nome para este projeto';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='{closed} fechado. Agora exibindo {opened}.';
$ec_lang['lpn_status_closed_empty']='{closed} fechado. Um novo projeto vazio foi iniciado.';
$ec_lang['lpn_storage_full']='Não salvo. O armazenamento do navegador está cheio ou indisponível, então suas alterações recentes serão perdidas ao fechar esta aba.';
$ec_lang['lpn_storage_unreadable']='Não salvo. Este projeto não pôde ser lido do armazenamento do navegador. A cópia armazenada é mantida exatamente como está e não será sobrescrita, então nada nesta aba está sendo salvo. Abra um arquivo ou crie um novo projeto para continuar trabalhando.';
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
$ec_lang['lpn_help_welcome']='Página de boas-vindas';
$ec_lang['lpn_about_license']='Licenciado sob a GNU General Public License v3.0 ou posterior.';
$ec_lang['lpn_notes_1_term']='Como é calculado';
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
$ec_lang['lpn_notes_1_def']='Cada momento é calculado com o mesmo algoritmo de gradiente global que o EPANET usa. Defina uma duração total da simulação e o solucionador EPANET calcula cada horário de relatório, um a um: os tanques enchem e esvaziam, as demandas seguem seus padrões, e a barra de ferramentas reproduz o cálculo. O solucionador interno calcula um momento de cada vez e mantém cada tanque no seu nível inicial.';
$ec_lang['lpn_notes_2_term']='Não modelado';
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
$ec_lang['lpn_notes_2_def']='A química da qualidade da água não é modelada; idade da água e rastreamento de origem são. Válvulas: uma válvula de estrangulamento funciona nos dois solucionadores, e as válvulas que definem sua própria posição (PRV, PSV, FCV) são calculadas com o solucionador EPANET, que esta página liga sozinha quando sua rede tem uma dessas válvulas.';
$ec_lang['lpn_notes_3_term']='Salvando projetos';
$ec_lang['lpn_notes_3_def']='Cada projeto é uma aba, e cada aba é salva neste navegador enquanto você trabalha. Limpar os dados do seu navegador exclui todos eles, então mantenha seu trabalho em um arquivo: Arquivo, Salvar como. Um asterisco em uma aba significa que ela contém alterações que não estão em um arquivo. Nada é gravado em um arquivo a menos que você peça. Em alguns navegadores, um projeto se conecta ao arquivo em que você o salva, e Arquivo, Salvar grava de volta nesse mesmo arquivo a partir de então; em outros, nenhuma conexão é possível, então Salvar fica desativado e apenas Salvar como está disponível. Quando um arquivo de projeto é mantido em uma unidade compartilhada, esta página avisa se um colega já o tem aberto, para que duas pessoas não sobrescrevam o trabalho uma da outra.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='Curva da bomba';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='Uma bomba segue H = H₀ − aQ^b, em que H é a carga que a bomba adiciona e Q é a vazão que passa por ela. Digite um, dois ou três pontos da curva do fabricante. Três pontos, a carga a vazão zero, o ponto normal de trabalho e o ponto de vazão mais alta, ajustam H₀, a e b diretamente, e seguem uma curva publicada com a maior fidelidade. Dois pontos ajustam uma parábola (b = 2) com o pico na vazão zero. Um ponto usa uma regra comum: a carga a vazão zero é 1,33 × a carga que você digita, e a vazão mais alta é 2 × a vazão que você digita, o que também resulta em b = 2. Uma bomba sem pontos digitados não adiciona nenhuma carga. A curva não é interrompida no ponto em que a carga chega a zero, então pedir a uma bomba mais vazão do que sua curva pode fornecer resulta em uma carga negativa. A solução é uma bomba maior ou uma demanda menor, não um ajuste de curva diferente. Uma curva pode conter mais de três pontos. O solucionador interno lê três deles, o primeiro, o do meio e o último, para ajustar a equação acima; o motor EPANET lê cada ponto que você forneceu.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_6_term']='Ajuda das colunas da tabela';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>Selecionar coluna</td><td>Clique no cabeçalho</td></tr><tr><td>Adicionar ou estender a seleção de colunas</td><td>Ctrl+clique ou Shift+clique em outro cabeçalho</td></tr><tr><td>Mover (reordenar) coluna(s) selecionada(s)</td><td>Arraste ou use Gerenciar colunas… no menu de clique direito ou ⋮</td></tr><tr><td>Menu ⋮ e seta de ordenação.</td><td>Passe o mouse no canto superior de um cabeçalho, ou selecione ou use Tab até um cabeçalho</td></tr><tr><td>Ocultar, Mostrar tudo, ou Gerenciar visibilidade e ordem</td><td>Clique direito no cabeçalho ou menu ⋮ no canto superior direito do cabeçalho</td></tr><tr><td>Ordenar por coluna</td><td>Ícone de seta no canto superior direito do cabeçalho</td></tr><tr><td>Colar como novas linhas no fim da tabela</td><td>Clique direito, menu ⋮ no canto superior direito do cabeçalho, ou Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='Atalhos de teclado da tabela';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>Teclas de seta</td><td>Navegar.</td></tr><tr><td>Tab, Enter</td><td>Concluir a entrada e navegar uma célula ao lado / abaixo.</td></tr><tr><td>Shift+Tab, Shift+Enter</td><td>Navegar para trás.</td></tr><tr><td>Shift+teclas de seta</td><td>Estender a seleção.</td></tr><tr><td>Ctrl+C</td><td>Copiar a seleção.</td></tr><tr><td>Ctrl+D</td><td>Preencher a seleção para baixo a partir da sua linha superior.</td></tr><tr><td>Ctrl+Enter</td><td>Preencher a seleção com o valor da célula ativa.</td></tr><tr><td>Ctrl+A</td><td>Selecionar a tabela inteira.</td></tr><tr><td>Ctrl+Shift+V</td><td>Colar como novas linhas no fim da tabela.</td></tr><tr><td>Ctrl+Shift+PageDown, Ctrl+Shift+PageUp</td><td>Alternar para a aba seguinte ou a anterior, seja uma tabela ou um gráfico.</td></tr><tr><td>Delete</td><td>Limpar uma célula.</td></tr><tr><td>F2</td><td>Abrir uma célula para editá-la.</td></tr><tr><td>Esc</td><td>Cancelar uma edição.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='Os limites das faixas de cor permanecem os mesmos';
$ec_lang['lpn_notes_color_def']='Os limites das faixas de cor são definidos quando você escolhe um método de classificação de dados. Eles não são redefinidos a cada horário, porque isso faria as cores significarem algo novo a cada horário, o que não ajuda a visualizar seu sistema. O EPANET funciona da mesma forma. Para obter novos limites, escolha um método novamente ou digite seus próprios limites.';
$ec_lang['lpn_notes_epanet_term']='As constantes de Hazen-Williams correspondem ao EPANET';
$ec_lang['lpn_notes_epanet_def']='Em agosto de 2026, o coeficiente e o expoente de Hazen-Williams foram alterados para corresponder ao EPANET. Os resultados de perda de carga diferem das versões anteriores desta página em até 0,1 por cento, o que é muito menor do que a incerteza no próprio valor de C.';
$ec_lang['lpn_notes_engine_term']='Qual EPANET esta página executa';
$ec_lang['lpn_notes_engine_def']='O solucionador EPANET desta página é o OWA-EPANET 2.3.5, lançado em 20 de fevereiro de 2025. O EPANET é desenvolvido pela Open Water Analytics, uma comunidade que trabalha com a Agência de Proteção Ambiental dos Estados Unidos, que lançou a versão 2.2.0 em dezembro de 2019. O relatório de execução o chama de 2.3.05 porque o mecanismo escreve o último número em dois dígitos. Ele chega a esta página através do epanet-js 0.9.0, de Luke Butler, sob a licença MIT, e é executado dentro do seu navegador: sua rede nunca é enviada a lugar nenhum para ser resolvida.';
$ec_lang['lpn_id_invalid']='Digite um ID sem espaços e sem aspas.';
$ec_lang['lpn_id_taken']='Esse ID já está em uso.';
$ec_lang['lpn_diag_no_fixed_head']='Adicione um reservatório ou um tanque. A rede precisa de pelo menos um nível de água conhecido antes de poder ser resolvida.';
$ec_lang['lpn_diag_dangling_link']='Um tubo ou bomba se conecta a um nó que não existe mais:';
$ec_lang['lpn_diag_unreachable']='Estes nós não têm caminho até um reservatório:';
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
$ec_lang['lpn_engine_fetching']='Obtendo o solucionador do EPANET. Ele é baixado uma vez e depois mantido neste dispositivo, então funciona offline depois disso.';
$ec_lang['lpn_engine_ready']='O solucionador do EPANET já está neste dispositivo, e funciona offline.';
$ec_lang['lpn_engine_fetching_valve']='Obtendo o solucionador do EPANET, para que esta válvula possa ser resolvida agora e offline depois.';
$ec_lang['lpn_engine_ready_valve']='O solucionador do EPANET já está neste dispositivo. As válvulas que abrem e fecham por conta própria funcionarão offline.';
$ec_lang['lpn_engine_unavailable']='Não foi possível obter o solucionador do EPANET, que é o que resolve válvulas que abrem e fecham por conta própria. Conecte-se à internet uma vez e ele fica guardado neste dispositivo a partir de então.';
$ec_lang['lpn_engine_needed_loading']='Carregando o solucionador EPANET enquanto você constrói. Os resultados estarão disponíveis quando o carregamento for concluído.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='Progresso do carregamento do solucionador';
$ec_lang['lpn_engine_wait']='Carregando solucionador. Resultados atrasados momentaneamente. Continue trabalhando.';
$ec_lang['lpn_engine_wait_pct']='Solucionador {percent}% carregado.';
$ec_lang['lpn_engine_wait_bytes']='Solucionador com {kb} KB carregados até agora. O total não está disponível, então a porcentagem de conclusão é desconhecida.';
$ec_lang['lpn_engine_needed_failed']='O solucionador EPANET ainda não foi carregado, não pode ser carregado, e esta rede só pode ser resolvida por ele. Ele será carregado quando você estiver conectado à internet.';
$ec_lang['lpn_diag_valve_needs_epanet']='Estas válvulas abrem e fecham por conta própria, e somente o solucionador do EPANET consegue calculá-las. O solucionador do EPANET não pôde ser carregado, então estes resultados estão faltando:';
$ec_lang['lpn_diag_valve_on_fixed_head']='Estas válvulas estão ligadas diretamente a um reservatório ou a um tanque, que já define o nível de água ali, então não sobra nada para a válvula controlar. Coloque um tubo curto entre a válvula e o reservatório ou tanque:';
$ec_lang['lpn_diag_not_converged']='Nenhuma solução foi encontrada. Verifique valores que não podem ser reais, como um diâmetro igual a zero.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='A solução não convergiu. Estes números são da última tentativa, não uma resposta. Não os utilize.';
$ec_lang['lpn_diag_not_converged_trials']='Parou depois de {iterations} tentativas.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='Parou depois de {iterations} tentativas com um erro relativo de {error}, que não atingiu a configuração de Precisão de {accuracy}.';
$ec_lang['lpn_field_roughness']='Rugosidade';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='C de Hazen-Williams. Um número maior significa um tubo mais liso: cerca de 150 para plástico novo, 130 para aço ou ferro novo, e 100 para tubo antigo.';
$ec_lang['lpn_field_length']='Comprimento';
$ec_lang['lpn_field_from']='De';
$ec_lang['lpn_field_to']='Para';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='Tipo de válvula';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='O que a válvula faz. Uma válvula de estrangulamento mantém uma perda fixa. As outras três mantêm uma pressão ou uma vazão, e abrem totalmente, fecham ou fecham parcialmente conforme a água muda. Mudar o tipo coloca um novo número inicial no ajuste abaixo, porque uma pressão não é uma vazão, e nenhuma das duas é um coeficiente de perda.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='Estrangulamento (TCV)';
$ec_lang['lpn_valve_type_prv']='Redutora de pressão (PRV)';
$ec_lang['lpn_valve_type_psv']='Sustentadora de pressão (PSV)';
$ec_lang['lpn_valve_type_fcv']='Controle de vazão (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='Quebra-pressão (PBV)';
$ec_lang['lpn_valve_type_gpv']='Uso geral (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='Queda de pressão';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='A pressão que a válvula remove. Uma válvula quebra-pressão sempre remove exatamente esse tanto de pressão, qualquer que seja o sentido da água. É uma queda através da válvula, não uma pressão a manter.';
$ec_lang['lpn_inp_drop_gpv_curve']='Esta válvula indica uma curva de perda de carga que não está no arquivo. A válvula foi importada sem curva, então permanece totalmente aberta até que você forneça uma.';
$ec_lang['lpn_gpv_curve_source']='Curva de perda de carga da válvula';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='A curva na caixa Bibliotecas que indica quanta carga esta válvula perde em cada vazão. Várias válvulas podem usar a mesma curva, e editá-la ali muda todas elas. Esta válvula guarda apenas a referência; os pontos em si são lidos e editados em Bibliotecas, Curvas.';
$ec_lang['lpn_field_valve_setting_pressure']='Ajuste de pressão';
$ec_lang['lpn_field_valve_setting_pressure_tip']='A pressão que a válvula mantém. Uma válvula redutora de pressão mantém a pressão no seu lado a jusante neste valor ou abaixo dele. Uma válvula sustentadora de pressão mantém a pressão no seu lado a montante neste valor ou acima dele.';
$ec_lang['lpn_field_valve_setting_flow']='Ajuste de vazão';
$ec_lang['lpn_field_valve_setting_flow_tip']='A maior quantidade de água que a válvula deixa passar. Quando menos água do que isso quer passar, a válvula fica totalmente aberta e não acrescenta perda.';
$ec_lang['lpn_field_valve_setting']='Ajuste';
$ec_lang['lpn_field_valve_setting_loss']='Coeficiente de perda';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='Quanta carga a válvula de estrangulamento remove, contada como um múltiplo da carga de velocidade. Use 0 para uma válvula totalmente aberta. Este único número é toda a perda de uma válvula de estrangulamento.';
$ec_lang['lpn_field_valve_diameter_tip']='Largura da abertura através da válvula. A velocidade da água através da válvula é calculada a partir desta largura, e a perda decorre dessa velocidade.';
$ec_lang['lpn_field_valve_km_tip']='Perda causada pelo corpo da válvula enquanto ela está totalmente aberta, além de qualquer perda removida pelo ajuste da válvula. É contada como um múltiplo da carga de velocidade. Use 0 para ignorá-la.';
$ec_lang['lpn_field_km']='Coeficiente de perda localizada, k';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='Perda localizada, k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='Curva de carga da bomba';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='A curva na caixa Bibliotecas que indica quanta carga esta bomba adiciona em cada vazão. Várias bombas podem usar a mesma curva, e editá-la ali muda todas elas. Esta bomba guarda apenas a referência; os pontos em si são lidos e editados em Bibliotecas, Curvas.';
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
$ec_lang['lpn_field_desc']='Descrição';
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
$ec_lang['lpn_field_tag_tip']='Uma etiqueta pode ter qualquer significado que você precisar, como uma zona de pressão ou uma ordem de serviço. Nenhum cálculo aqui ou no EPANET a lê. Uma etiqueta é uma única palavra: o EPANET para de ler no primeiro espaço, então um espaço é recusado enquanto você digita. Ela é transportada de e para o arquivo EPANET.';
$ec_lang['lpn_pump_effic_curve']='Curva de eficiência da bomba';
$ec_lang['lpn_pump_effic_curve_tip']='A curva na caixa Bibliotecas que indica a eficiência desta bomba em cada vazão. Várias bombas podem usar a mesma curva, e editá-la ali muda todas elas. Esta bomba guarda apenas a referência; os pontos em si são lidos e editados em Bibliotecas, Curvas.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='Nenhuma curva selecionada';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='Curvas';
$ec_lang['lpn_curve_library_link_tip']='Abre a caixa Bibliotecas na sua seção Curvas, onde uma curva é adicionada, descrita, editada e excluída. Um elemento indica qual curva usa.';
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
$ec_lang['lpn_curve_kind_head']='Carga da bomba';
$ec_lang['lpn_curve_kind_effic']='Eficiência da bomba';
$ec_lang['lpn_curve_kind_volume']='Volume do tanque';
$ec_lang['lpn_curve_kind_headloss']='Perda de carga da válvula';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='Tipo não indicado';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='Vol.';
$ec_lang['lpn_pump_effic_col']='Eficiência';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='Esta bomba não tem curva de eficiência selecionada, então funciona na eficiência definida para toda a rede, {percent}.';
$ec_lang['lpn_pump_effic_unstated']='Esta bomba indica uma curva de eficiência chamada {name}, que nada neste projeto define, então funciona na eficiência definida para toda a rede, {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='Modo: Selecionar. Clique em um elemento ou rótulo para ver ou alterá-lo. Arraste para mover um nó, um vértice ou um rótulo. Use a ferramenta Vértices para adicionar ou remover as dobras de um trecho.';
$ec_lang['lpn_mode_delete']='Modo: Excluir. Clique em um elemento para removê-lo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='Modo: Vértices. Os vértices de cada trecho são mostrados como pequenas alças quadradas. Clique em um trecho para adicionar um vértice, clique em uma alça para removê-la, ou arraste uma alça para movê-la. Nada mais no mapa pode ser alterado neste modo.';
$ec_lang['lpn_mode_zoom_window']='Modo: Janela de zoom. Clique em dois cantos opostos de uma caixa, ou arraste um, no mapa para ampliar essa área.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='Nada está selecionado. Clique em um elemento no mapa primeiro, depois pressione Excluir.';
$ec_lang['lpn_mode_add_junction']='Modo: Adicionar Junção. Clique no mapa para posicionar uma junção. Mude para o modo Selecionar para alterar ou mover elementos e rótulos.';
$ec_lang['lpn_mode_add_reservoir']='Modo: Adicionar Reservatório. Clique no mapa para posicionar um reservatório. Mude para o modo Selecionar para alterar ou mover elementos e rótulos.';
$ec_lang['lpn_mode_add_tank']='Modo: Adicionar Tanque. Clique no mapa para posicionar um tanque. Mude para o modo Selecionar para alterar ou mover elementos e rótulos.';
$ec_lang['lpn_mode_add_pipe']='Modo: Adicionar Tubo. Clique em um nó, depois em outro nó, para conectá-los. Clique em um espaço vazio entre eles para dobrar a linha, ou pressione Esc para recomeçar. Mude para o modo Selecionar para alterar ou mover elementos e rótulos.';
$ec_lang['lpn_mode_add_pump']='Modo: Adicionar Bomba. Clique em um nó, depois em outro nó, para conectá-los. Clique em um espaço vazio entre eles para dobrar a linha, ou pressione Esc para recomeçar. Mude para o modo Selecionar para alterar ou mover elementos e rótulos.';
$ec_lang['lpn_mode_add_valve']='Modo: Adicionar Válvula. Clique em um nó, depois em outro nó, para conectá-los. Clique em um espaço vazio entre eles para dobrar a linha, ou pressione Esc para recomeçar. Mude para o modo Selecionar para alterar ou mover elementos e rótulos.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='Modo: Adicionar Texto. Clique no mapa para posicionar um Texto. Clique perto de um nó para anexar o Texto a esse nó. Mude para o modo Selecionar para alterar ou mover elementos e rótulos.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='Use este modo para alterar, mover e arrastar coisas no mapa. Este é o modo ao qual a página volta por padrão: ela retorna a ele sozinha depois de algumas ações, como abrir um projeto, e [Esc] traz você de volta a ele a partir de qualquer outro modo.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_auto']='Automático';
$ec_lang['lpn_method_switch_confirm']='Mudar o método de atrito não altera os números de rugosidade já digitados nos seus tubos, e uma rugosidade de um método não tem sentido para outro. Verifique cada tubo depois disso. Mudar mesmo assim?';
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
$ec_lang['lpn_field_closed']='Fechado';
$ec_lang['lpn_field_closed_tip']='Feche este tubo para que nenhuma água possa passar por ele. O tubo permanece no mapa e mantém todos os seus números, e você pode abri-lo novamente a qualquer momento.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='Longitude';
$ec_lang['lpn_field_lat']='Latitude';
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
$ec_lang['lpn_field_lat_abbr']='Lat';
$ec_lang['lpn_field_lon_abbr']='Long';


// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='Digite uma coordenada para posicionar este nó exatamente. Em um cenário, essa posição se aplica somente nesse cenário, assim como arrastá-lo faria; na Base, ela posiciona o nó em todos os lugares.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='Isso está fora do mapa. A latitude Pseudo-Mercator vai de -85,05 a 85,05 e a longitude vai de -180 a 180.';
$ec_lang['lpn_field_text_size']='Fator de tamanho';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='Mostrar em todos os níveis de zoom';
$ec_lang['lpn_field_text_all_zoom_tip']='Mantém este texto no desenho não importa o quanto você afaste o zoom. Desmarque e o texto se oculta com os outros rótulos assim que a visualização ficar mais larga que o limite de rotulagem definido em Mapa e página.';
$ec_lang['lpn_tool_labels']='Rótulos';
$ec_lang['lpn_labels_heading_node']='Rótulos de nó';
$ec_lang['lpn_labels_heading_link']='Rótulos de trecho';
$ec_lang['lpn_labels_mark_extrema']='Marcar os valores mais alto e mais baixo';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='Desenha uma linha acima do maior valor de cada propriedade rotulada no mapa (uma linha superior), e uma linha abaixo do menor valor dessa propriedade (uma linha inferior), para que você identifique o maior e o menor sem precisar ler os números.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='Aplicar a todos';
$ec_lang['lpn_settings_apply_to_all_tip']='Cada elemento deste tipo já desenhado recebe um ID começando com este texto. Cada um mantém seu número. Um ID que não termina em número é deixado como está.';
$ec_lang['lpn_confirm_apply_prefix']='Renomear {n} elementos para que seus IDs comecem com {prefix}? Cada um mantém seu número.';
$ec_lang['lpn_prefix_applied']='Renomeados {n} elementos. {skipped} outros foram deixados como estavam.';
$ec_lang['lpn_labels_suffix_gradient_tip']='Texto adicionado depois da inclinação da perda de carga nos rótulos do mapa. Não digite um sinal de porcentagem aqui. Ele é adicionado automaticamente quando as unidades são porcentagem.';
$ec_lang['lpn_labels_separator']='Texto entre valores';
$ec_lang['lpn_labels_separator_tip']='Texto entre uma propriedade e a próxima em um rótulo. Um espaço, por padrão.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='Prioridade';
// Edited by TGH 2026-09-07
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='A ordem em que as propriedades são dispensadas quando dois rótulos de nó se sobrepõem. A propriedade numerada 1 é dispensada primeiro, em ambos os rótulos. Quando resta uma propriedade e os dois ainda se sobrepõem, um rótulo inteiro é ocultado: o rótulo cujo valor restante vale menos a pena mostrar, ou seja, a menor demanda, a pressão mais próxima do meio da faixa, ou a elevação ou carga mais próxima da dos nós vizinhos.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='Antes';
$ec_lang['lpn_labels_col_after']='Depois';
$ec_lang['lpn_labels_col_decimals']='Decimais';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='Mostrar';
$ec_lang['lpn_labels_show_tip']='A ordem em que os valores aparecem em um rótulo. O valor numerado 1 vem primeiro: no topo de um rótulo empilhado, e no início de um rótulo em uma linha.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='Usar unidades';
$ec_lang['lpn_labels_use_units_tip']='Marque para mostrar a unidade na caixa Depois e no rótulo, e para mantê-la em sincronia quando as unidades mudam. Desmarque para digitar seu próprio texto em Depois.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='Estado inicial';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='Cores dos nós';
$ec_lang['lpn_settings_sym_link_colors']='Cores dos trechos';
$ec_lang['lpn_field_id']='ID';
$ec_lang['lpn_backdrop_menu']='Imagem de fundo...';
$ec_lang['lpn_backdrop_add']='Adicionar';
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
$ec_lang['lpn_backdrop_scale']='Escalar clicando';
$ec_lang['lpn_backdrop_scale_entry']='Escala por world file ou por tamanho de pixel no mapa';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='Escalar a partir do tamanho atual, em torno de um ponto que você escolhe';
$ec_lang['lpn_backdrop_scale_from_prompt1']='Clique no ponto da imagem de fundo que deve permanecer onde está.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='Escalar a partir do tamanho atual. 1 mantém do mesmo tamanho, 1,1 aumenta 10%, 0,9 diminui 10%.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='Digite o tamanho de um pixel no mapa, ou cole o conteúdo completo do world file da imagem';
$ec_lang['lpn_backdrop_scale_entry_bad']='Digite um número para o tamanho de um pixel no mapa, ou cole as seis linhas de um world file.';
$ec_lang['lpn_backdrop_wld_bad']='Este world file gira, espelha ou distorce a imagem de forma desigual. O mapa só pode mover uma imagem e redimensioná-la igualmente nas duas direções, então o arquivo não foi usado.';
$ec_lang['lpn_backdrop_unreadable']='O seu navegador não consegue mostrar esta imagem. Guarde-a como imagem PNG ou JPEG e adicione-a novamente.';
$ec_lang['lpn_backdrop_position']='Mover';
$ec_lang['lpn_backdrop_remove']='Remover';
$ec_lang['lpn_backdrop_remove_confirm']='Remover a imagem de fundo?';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='Mapa do mundo…';
$ec_lang['lpn_map_attach_tip']='Anexa o mapa do mundo a este projeto sem alterá-lo de nenhuma outra forma.';
$ec_lang['lpn_map_attach_add']='Anexar';
$ec_lang['lpn_map_attach_readjust']='Reajustar';
$ec_lang['lpn_map_attach_readjust_tip']='Volta para a Etapa 2 do processo de anexação do mapa.';
$ec_lang['lpn_map_attach_scale_from']='Escalar a partir do tamanho atual…';
$ec_lang['lpn_map_attach_scale_from_prompt']='Escala o mapa a partir do seu tamanho atual, em torno do meio do seu desenho. 1 mantém o mesmo, 1,1 aumenta em 10%, 0,9 diminui em 10%.';
$ec_lang['lpn_map_attach_scale_from_bad']='Digite um único número maior que zero.';
$ec_lang['lpn_map_attach_scale_from_done']='O mapa foi redimensionado, e seu desenho e cada coordenada nele estão exatamente como estavam.';
$ec_lang['lpn_map_attach_none']='Ainda não há mapa do mundo anexado a este projeto. Use Mapa, Mapa do mundo, Anexar primeiro.';
$ec_lang['lpn_map_attach_remove']='Desanexar';
$ec_lang['lpn_map_attach_remove_tip']='Remove o mapa do mundo. O desenho e suas coordenadas não são afetados de nenhuma forma.';
$ec_lang['lpn_map_attach_done']='O mapa do mundo agora está atrás do seu desenho, e seu projeto não foi alterado. Use Mapa, Mapa do mundo, Desanexar para removê-lo novamente.';
$ec_lang['lpn_map_attach_removed']='O mapa do mundo foi removido, e o desenho está exatamente como estava.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='Seu desenho está em um mapa do mundo inteiro, no oceano em latitude zero e longitude zero. Encontre seu próprio lugar primeiro: desloque e aplique zoom no mapa por trás do desenho, busque um nome de lugar, ou digite uma latitude e uma longitude. O desenho em si não se move.';
$ec_lang['lpn_mapgeo_step1']='Etapa 1 de 2: encontre seu lugar no mundo';
$ec_lang['lpn_mapgeo_step2']='Etapa 2 de 2: ajuste o mapa atrás do seu desenho';
$ec_lang['lpn_mapgeo_hint1']='Desloque e aplique zoom no mapa por trás do seu desenho, ou busque um lugar, ou digite uma latitude e uma longitude. Depois pressione Posicionar aproximadamente.';
$ec_lang['lpn_mapgeo_readjust_intro']='Seu desenho está onde você o posicionou por último. Para movê-lo para outro lugar, desloque e aplique zoom no mapa por trás do desenho, busque um nome de lugar, ou digite uma latitude e uma longitude. O desenho em si não se move.';
$ec_lang['lpn_mapgeo_hint2']='Arraste em qualquer lugar para deslizar o mapa sob seu desenho. Seu desenho e cada coordenada nele permanecem exatamente onde estão. Pressione Georreferenciar aqui quando o mapa estiver certo.';
$ec_lang['lpn_mapgeo_gestures']='O zoom move seu desenho e o mapa juntos, para que você veja o quanto eles se alinham. Arrastar move somente o mapa.';
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
$ec_lang['lpn_mapgeo_dial_turn']='Girar o mapa';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} graus';
$ec_lang['lpn_mapgeo_dial_size']='Tamanho do mapa';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} vezes';
$ec_lang['lpn_mapgeo_dial_help']='Deslize as duas barras, ou digite nas caixas acima delas, para tornar o mapa maior ou menor e para girá-lo. O meio de cada barra é o ajuste da Etapa 1; 1 e 0 significam deixar como está. As teclas de seta funcionam nas duas.';
$ec_lang['lpn_mapgeo_place']='Posicionar aproximadamente';
$ec_lang['lpn_mapgeo_finish']='Georreferenciar aqui';
$ec_lang['lpn_mapgeo_cancelled']='O mapa do mundo voltou para onde estava, e seu desenho nunca se moveu.';
$ec_lang['lpn_mapgeo_locked']='Termine com o botão Georreferenciar aqui, ou pressione Cancelar, antes de trocar de projeto ou salvar. O mapa do mundo ainda está sendo posicionado.';
$ec_lang['lpn_backdrop_scale_prompt1']='Clique em dois pontos na imagem de fundo, como as duas extremidades de uma escala gráfica. Depois digite a distância real entre eles.';
$ec_lang['lpn_backdrop_scale_prompt2']='Distância real entre os dois pontos';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='Clique no ponto base (na imagem) para o deslocamento.';
$ec_lang['lpn_backdrop_position_prompt2']='Escolha o método para o ponto de destino e depois clique em Continuar.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='Ajustando a imagem de fundo.';
$ec_lang['lpn_backdrop_target_label']='Mover para:';
$ec_lang['lpn_backdrop_target_node']='Um nó';
$ec_lang['lpn_backdrop_target_free']='Qualquer ponto do mapa';
$ec_lang['lpn_backdrop_target_coords']='Coordenadas digitadas';
$ec_lang['lpn_backdrop_coords_prompt']='Digite o X,Y para onde esse ponto deve ir';
$ec_lang['lpn_backdrop_continue']='Continuar';
$ec_lang['lpn_tool_settings']='Configurações';
$ec_lang['lpn_settings_show_titles']='Mostrar títulos das páginas';
// Edited by TGH 2026-09-07
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='Ocultar estes títulos';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='Mostrar a ajuda de seleção';
$ec_lang['lpn_settings_area_hint_tip']='Mostra o balão sobre o mapa que indica o que o seu próximo clique fará enquanto você seleciona uma área.';
$ec_lang['lpn_settings_id_prefixes']='Prefixos de ID';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='Valores de criação';
$ec_lang['lpn_settings_defaults_note']='Usado para elementos que você criar a partir de agora. Elementos existentes não são alterados.';
$ec_lang['lpn_settings_push_note']='Somente as propriedades cujos rótulos estão sendo exibidos agora são aplicadas.';
$ec_lang['lpn_settings_push_btn']='Aplicar estes valores de novos elementos a todos os elementos existentes';
$ec_lang['lpn_push_confirm']='Substituir essas propriedades em todos os elementos existentes pelos valores agora definidos para novos elementos? Os valores que você digitou serão sobrescritos. Você pode desfazer isto.';
$ec_lang['lpn_push_properties']='Propriedades:';
$ec_lang['lpn_push_assets']='Nós e tubos:';
$ec_lang['lpn_push_none_displayed']='Nenhum valor inicial está sendo exibido como rótulo agora, então não há nada para aplicar. Ative os rótulos das propriedades que você deseja no painel Rótulos e tente novamente.';
$ec_lang['lpn_push_nothing']='Nenhum elemento existente tem qualquer das propriedades sendo aplicadas.';
$ec_lang['lpn_push_no_change']='Todos os elementos já têm esses valores, então nada mudaria.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='Propriedades personalizadas';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='Propriedades que você mesmo define, para seus próprios fins. Elas são armazenadas com o projeto e os cenários como todas as outras propriedades.';
$ec_lang['lpn_cp_design']='Definição';
$ec_lang['lpn_cp_design_tip']='Uma linha por propriedade personalizada, e cada uma se abre para mostrar: Chave, Rótulo, Aplica-se a, Validar como, Permitir ou restringir, o campo de caracteres nomeado por essa escolha, Limite inferior de comprimento, Limite superior de comprimento, Limite baixo, Limite alto.';
$ec_lang['lpn_cp_add']='Adicionar propriedade personalizada';
$ec_lang['lpn_cp_add_tip']='Adiciona uma linha à tabela de design e a abre para edição.';
$ec_lang['lpn_cp_remove_tip']='Remove esta propriedade da tabela de design. Os valores já digitados nos seus elementos são mantidos no arquivo e voltam se você projetar a mesma chave novamente.';
$ec_lang['lpn_cp_none']='Nenhuma propriedade personalizada foi projetada ainda.';
$ec_lang['lpn_cp_unnamed']='Ainda não nomeada';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='Chave';
$ec_lang['lpn_cp_key_tip']='Chave: Uma propriedade é armazenada sob este nome. Espaços não são permitidos, e um prefixo é adicionado para você, para que sua chave nunca possa colidir com um campo embutido.';
$ec_lang['lpn_cp_label']='Rótulo';
$ec_lang['lpn_cp_label_tip']='Rótulo: Um leitor vê isto na caixa de propriedades, em Localizar e no topo de uma coluna de tabela.';
$ec_lang['lpn_cp_applies']='Aplica-se a';
$ec_lang['lpn_cp_applies_tip']='Aplica-se a: Lista separada por vírgulas de prefixos de ID dos elementos que usam esta propriedade, como J,L,R.';
$ec_lang['lpn_cp_validate']='Validar como';
$ec_lang['lpn_cp_validate_tip']='Validar como: Isto diz como é um valor válido. As regras de maiúsculas e minúsculas leem apenas o alfabeto inglês, o que é um limite declarado. Escolha Não validar para aceitar qualquer coisa.';
$ec_lang['lpn_cp_restrict']='Restringir estes caracteres';
$ec_lang['lpn_cp_restrict_tip']='Restringir estes caracteres: Um valor pode usar apenas os caracteres listados aqui, ou nenhum deles, onde "@" significa qualquer letra; "#" significa qualquer dígito numérico, e você deve listar separadamente "-", "." e "," se forem permitidos; e quaisquer caracteres de espaço em branco devem ficar entre outros caracteres.';
$ec_lang['lpn_cp_restrict_mode']='Permitir ou restringir';
$ec_lang['lpn_cp_restrict_mode_tip']='Permitir ou restringir: Os caracteres informados são os únicos que um valor pode usar, ou os que ele não pode usar.';
$ec_lang['lpn_cp_restrict_allow']='Permitir apenas estes caracteres';
$ec_lang['lpn_cp_minlength']='Limite inferior de comprimento';
$ec_lang['lpn_cp_minlength_tip']='Limite inferior de comprimento: Qualquer entrada mais curta é sinalizada, o que é uma forma de encontrar as entradas vazias e as digitadas pela metade.';
$ec_lang['lpn_cp_length']='Limite superior de comprimento';
$ec_lang['lpn_cp_length_tip']='Limite superior de comprimento: Qualquer entrada mais longa é sinalizada.';
$ec_lang['lpn_cp_low']='Limite baixo';
$ec_lang['lpn_cp_low_tip']='Limite baixo: Este é o menor valor que você espera. Números são comparados como números e texto em ordem alfabética.';
$ec_lang['lpn_cp_high']='Limite alto';
$ec_lang['lpn_cp_high_tip']='Limite alto: Este é o maior valor que você espera. Números são comparados como números e texto em ordem alfabética.';
$ec_lang['lpn_cp_val_none']='Não validar';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='Número .';
$ec_lang['lpn_cp_val_number_comma']='Número ,';
$ec_lang['lpn_cp_val_integer']='Número inteiro';
$ec_lang['lpn_cp_val_upper']='TUDO MAIÚSCULO';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} O valor é mantido exatamente como você o digitou.';
$ec_lang['lpn_cp_bad_number']='Este valor não é um número como exigido para esta propriedade.';
$ec_lang['lpn_cp_bad_integer']='Este valor não é um número inteiro como exigido para esta propriedade.';
$ec_lang['lpn_cp_bad_case']='Este valor não está TUDO MAIÚSCULO como exigido para esta propriedade.';
$ec_lang['lpn_cp_bad_chars']='Este valor usa um caractere que esta propriedade não permite.';
$ec_lang['lpn_cp_bad_space']='Espaço em branco é permitido apenas entre outros caracteres.';
$ec_lang['lpn_cp_bad_minlength']='Este valor é mais curto do que esta propriedade permite.';
$ec_lang['lpn_cp_bad_length']='Este valor é mais longo do que esta propriedade permite.';
$ec_lang['lpn_cp_bad_low']='Este valor está abaixo do limite baixo desta propriedade.';
$ec_lang['lpn_cp_bad_high']='Este valor está acima do limite alto desta propriedade.';
$ec_lang['lpn_cp_key_needed']='Dê a esta propriedade personalizada uma chave sem espaços.';
$ec_lang['lpn_cp_key_taken']='Outra propriedade personalizada já usa essa chave.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='Cenário';
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
$ec_lang['lpn_scenario_overrides']='Nº de valores individuais';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='O anel âmbar indica que este elemento tem um valor que pertence apenas ao cenário {name}.';
$ec_lang['lpn_scenario_overrides_tip']='Cada um desses valores está marcado no mapa com um anel âmbar. Mude para {base} para ver o desenho sem eles.';
$ec_lang['lpn_scenario_menu']='Cenários';
$ec_lang['lpn_scenario_tip']='O conjunto de valores que o desenho está mostrando e que a página está resolvendo agora. Clique para trocar de cenário, ou para adicionar, renomear ou excluir um.';
$ec_lang['lpn_scenario_new']='Novo cenário…';
$ec_lang['lpn_scenario_new_name']='Cenário {n}';
$ec_lang['lpn_scenario_prompt_name']='Nome para este cenário';
$ec_lang['lpn_scenario_rename']='Renomear cenário…';
$ec_lang['lpn_scenario_delete']='Excluir cenário';
$ec_lang['lpn_scenario_delete_confirm']='Excluir o cenário {name} e os {n} valores que pertencem somente a ele? O desenho em si não é alterado.';
$ec_lang['lpn_scenario_override']='Somente neste cenário';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='Marcado significa que este valor pertence somente a este cenário, mesmo quando é o mesmo número da Base. Desmarque a caixa para usar novamente o valor da Base.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='Cenário base: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} está fora da rede em {scenario}. Ainda está no desenho e em seus outros cenários.';
$ec_lang['lpn_scenario_push_btn']='Aplicar valores da Base a todos os cenários';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='Todo cenário volta ao valor da Base para as propriedades cujos rótulos estão sendo mostrados agora. Valores que pertencem somente a esses cenários são descartados.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='Fazer todo cenário usar os valores da Base para estas propriedades? Valores que pertencem somente a esses cenários são descartados. Você pode desfazer isso.';
$ec_lang['lpn_scenario_push_scenarios']='Cenários afetados:';
$ec_lang['lpn_scenario_push_values']='Valores descartados:';
$ec_lang['lpn_scenario_push_none']='Nenhum cenário tem um valor individual para nenhuma destas propriedades, então nada mudaria. Nada é descartado.';
$ec_lang['lpn_scenario_preset_flow_static']='1. Teste de vazão: Estático';
$ec_lang['lpn_scenario_preset_flow_static_tip']='Calibração do teste de vazão para uma rede de projeto com vazão 0. Neste cenário, defina a demanda em todas as junções como 0.';
$ec_lang['lpn_scenario_preset_flow_mid']='2. Teste de vazão: Intermediário';
$ec_lang['lpn_scenario_preset_flow_mid_tip']='Calibração do teste de vazão para uma rede de projeto na primeira vazão reportada. Neste cenário, defina a demanda na junção com vazão como a primeira vazão medida, e a demanda em todas as outras junções como 0.';
$ec_lang['lpn_scenario_preset_flow_max']='3. Teste de vazão: Máximo';
$ec_lang['lpn_scenario_preset_flow_max_tip']='Calibração do teste de vazão para uma rede de projeto na vazão máxima reportada. Neste cenário, defina a demanda na junção com vazão como a vazão máxima medida, e a demanda em todas as outras junções como 0.';
$ec_lang['lpn_scenario_preset_average_day']='4. Dia médio';
$ec_lang['lpn_scenario_preset_average_day_tip']='Multiplicador de demanda 1: toda demanda como inserida, que é tomada como a demanda do dia médio.';
$ec_lang['lpn_scenario_preset_max_day']='5. Dia máximo';
$ec_lang['lpn_scenario_preset_max_day_tip']='Multiplicador de demanda 2,0 vezes a demanda média, um valor provisório. A maioria dos sistemas fica entre 1,2 e 3,0 (National Research Council, 2006). Defina o do seu próprio sistema em Configurações, Cálculo, Hidráulica, Multiplicador de demanda.';
$ec_lang['lpn_scenario_preset_peak_hour']='6. Hora de pico';
$ec_lang['lpn_scenario_preset_peak_hour_tip']='Multiplicador de demanda 3,0 vezes a demanda média, um valor provisório. A maioria dos sistemas fica entre 3,0 e 6,0 (National Research Council, 2006). Defina o do seu próprio sistema em Configurações, Cálculo, Hidráulica, Multiplicador de demanda.';
$ec_lang['lpn_scenario_preset_fire_max_day']='7. Incêndio mais dia máximo';
$ec_lang['lpn_scenario_preset_fire_max_day_tip']='Demanda do dia máximo (multiplicador 2,0). Execute a Análise de vazão de incêndio neste cenário: ela adiciona a vazão de incêndio em cada junção sobre esta demanda.';
$ec_lang['lpn_delete_drops_overrides']='Excluir este elemento também descarta {n} valores que seus cenários guardam para ele. Continuar?';
$ec_lang['lpn_push_base_only']='Esta ação altera o desenho em si, então só pode ser feita em {base}. Mude para {base} e tente novamente.';
$ec_lang['lpn_field_active']='Parte desta rede';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='Desmarque esta caixa para deixar o elemento no desenho, mas fora da rede: ele é desenhado em cinza e o solucionador o ignora. Em um cenário, é assim que um trecho proposto é ligado e desligado.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='Expoente do emissor';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='O expoente na equação de emissor do EPANET para aspersores e vazamentos: vazão = coeficiente x pressão elevada a este expoente. Ele só altera a resposta onde um nó tem um emissor, o que por enquanto significa uma rede lida de um arquivo EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='Ler o DEM';
$ec_lang['lpn_elev_dem_sample_tip']='Lê a elevação do DEM neste nó e a mostra abaixo. Nada na caixa Elevação é alterado. A resolução horizontal do DEM é de cerca de 30 m para a maior parte da Terra, e mais fina onde existem dados melhores.';
$ec_lang['lpn_elev_dem_use']='Usar o DEM';
$ec_lang['lpn_elev_dem_use_tip']='Coloca a elevação do DEM neste nó na caixa Elevação acima, substituindo o que está lá. Ele lê o DEM primeiro, se ainda não tiver sido lido. Um Desfazer a restaura.';
$ec_lang['lpn_elev_dem_none']='O DEM não tem elevação para este nó.';
$ec_lang['lpn_elev_dem_said']='O DEM do Mapbox informa {v} {u}.';
$ec_lang['lpn_settings_elev_source']='Origem da elevação';
$ec_lang['lpn_settings_elev_source_tip']='De onde um novo nó recebe sua elevação. A superfície do terreno é lida do DEM do Mapbox, que tem cerca de 30 m de resolução na maior parte da Terra, e mais fina onde existem dados melhores.';
$ec_lang['lpn_settings_elev_source_typed']='A elevação digitada acima';
$ec_lang['lpn_settings_elev_source_dem']='DEM do Mapbox';
$ec_lang['lpn_settings_accuracy']='Precisão';
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
$ec_lang['lpn_settings_default_is']='O padrão é {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='Quão próximo o solucionador precisa chegar antes de parar, medido pela variação total na vazão de uma tentativa para a próxima, dividida pela vazão total nos trechos. Um número menor é mais exato e demora mais.';
$ec_lang['lpn_settings_specific_gravity']='Densidade relativa';
$ec_lang['lpn_settings_viscosity']='Viscosidade relativa';
$ec_lang['lpn_settings_viscosity_tip']='A viscosidade do fluido em comparação com a água a 20 graus Celsius. Isso só altera a resposta no método de Darcy-Weisbach.';
$ec_lang['lpn_settings_trials']='Máximo de tentativas';
$ec_lang['lpn_settings_trials_tip']='Quantas tentativas são permitidas antes que o solucionador desista de uma rede que não converge.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='Se não convergir';
$ec_lang['lpn_settings_unbalanced_tip']='O que fazer com uma rede que esgotou suas tentativas e ainda não convergiu. Permitir tentativas extras costuma alcançar a convergência. Parar informa a última tentativa como está, o que não é uma solução.';
$ec_lang['lpn_settings_unbalanced_continue']='Permitir tentativas extras';
$ec_lang['lpn_settings_unbalanced_stop']='Parar e informar a última tentativa';
$ec_lang['lpn_settings_unbalanced_trials']='Tentativas extras antes de informar';
$ec_lang['lpn_settings_unbalanced_trials_tip']='Quantas tentativas adicionais permitir depois que o máximo acima é esgotado, antes que a última tentativa seja informada.';
$ec_lang['lpn_settings_head_error']='Limite de erro de carga';
$ec_lang['lpn_settings_head_error_tip']='Um teste adicional que o solucionador precisa passar antes de parar: o maior erro de carga restante em qualquer trecho. Zero significa não aplicar este teste.';
$ec_lang['lpn_settings_flow_change']='Limite de variação de vazão';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='Um teste adicional que o solucionador precisa passar antes de parar: a maior variação na vazão de qualquer trecho de uma tentativa para a próxima. Zero significa não aplicar este teste.';
$ec_lang['lpn_settings_damp_limit']='Amortecimento começa em';
$ec_lang['lpn_settings_damp_limit_tip']='A precisão na qual o solucionador começa a dar passos menores, o que pode ajudar uma rede oscilante a convergir. Zero significa que o solucionador nunca amortece.';
$ec_lang['lpn_settings_option_unset']='Não informado';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='Um único fator aplicado a todas as demandas da rede de uma vez. Cada cenário pode ter o seu próprio, então dia médio, dia máximo ou hora de pico podem ser criados alterando apenas esta configuração.';
$ec_lang['lpn_settings_engine_native']='Resolver com o solucionador do EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='Executa o solucionador EPANET da EPA dos EUA, aqui no seu navegador. Numa rede deste tamanho você não notará diferença de velocidade. Os dois solucionadores concordam de perto, mas não exatamente: o EPANET arredonda o valor que usa para a gravidade, então suas perdas localizadas saem cerca de 0,08% menores que as do solucionador integrado, e com rugosidade de Manning sua perda de carga sai cerca de 0,6% menor. Na primeira vez que você marcar esta opção, cerca de 650 KB são baixados e depois mantidos neste dispositivo.';
$ec_lang['lpn_engine_loading']='Carregando o solucionador do EPANET…';
$ec_lang['lpn_engine_failed']='Não foi possível carregar o solucionador do EPANET. Mostrando o solucionador integrado em vez disso.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='Resolvido com o solucionador do EPANET, porque estas válvulas abrem e fecham por conta própria:';
$ec_lang['lpn_unit_unknown']='Este desenho indica uma unidade que esta página não oferece: {unit}. Tudo é mantido e exibido exatamente como veio, e nada foi alterado. Nada pode ser calculado até que esta página seja ensinada essa unidade, porque ela não sabe qual é o tamanho de uma unidade dessas.';
$ec_lang['lpn_engine_manning_note']='Nota: com rugosidade de Manning, o EPANET calcula a perda de carga cerca de 0,6% menor que o solucionador integrado.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='O solucionador EPANET não aceitou esta rede, então ela não foi executada.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='O solucionador EPANET disse: {message}';
$ec_lang['lpn_engine_refused_fallback']='Os números na tela vieram do solucionador integrado em vez disso.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='Os números na tela vieram do solucionador integrado em vez disso. Ele calcula um momento de cada vez, então esta é a rede apenas em {time}, com cada tanque ainda no seu nível inicial.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='Estes controles citam um elemento que não está mais neste projeto, então foram deixados de fora: {ids}';
$ec_lang['lpn_control_unreadable_note']='Estes controles não puderam ser lidos, então foram deixados de fora: {ids}';
$ec_lang['lpn_rule_dangling_note']='Estas regras indicam um elemento que não está mais neste projeto, então foram ignoradas nesta execução: {ids}';
$ec_lang['lpn_rule_unreadable_note']='Estas regras não puderam ser lidas, então foram ignoradas nesta execução: {ids}';
$ec_lang['lpn_settings_text_size']='Tamanho do texto (pixels)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='Tamanho do símbolo (pixels)';
$ec_lang['lpn_settings_link_width']='Espessura da linha do tubo (pixels)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='Setas de direção de vazão';
$ec_lang['lpn_settings_show_arrows_tip']='Desenha uma seta em cada trecho mostrando para onde a água está correndo. As setas aparecem depois de um cálculo, e desativá-las deixa os resultados inalterados. Esta configuração é salva com o projeto.';
$ec_lang['lpn_settings_align_labels']='Alinhar rótulos dos tubos com os tubos';
$ec_lang['lpn_settings_readability_bias']='Virar um rótulo de cabeça para baixo quando ele inclinar mais que este número de graus à esquerda da vertical';
$ec_lang['lpn_settings_readability_bias_tip']='Vira um rótulo para mantê-lo na posição correta quando ele inclinar mais que este número de graus à esquerda da vertical.';
$ec_lang['lpn_settings_mask_labels']='Fundo sólido atrás dos rótulos';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='Alinhar linhas de chamada a ângulos fixos';
// Edited by TGH 2026-09-07
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='Mostrar rótulos com zoom até esta largura do mapa ou menos';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='Os rótulos são desenhados somente enquanto a visualização do mapa tiver esta largura ou menos. Deixe a caixa vazia para desenhá-los em qualquer zoom. Digite 0 para nunca desenhar um rótulo, em nenhum zoom.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='Sempre mostrar';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap_sentence']='Impedir que os nós escalem maiores que {n} vezes o comprimento do {p} percentil do tubo';
$ec_lang['lpn_settings_symbol_cap_tip']='Uma junção para de crescer no terreno assim que seu diâmetro chegar a este número de vezes o comprimento do tubo neste percentil de todos os comprimentos de tubo da rede. Além desse ponto no mapa, junções, tubos e outros símbolos encolhem na tela conforme você reduz o zoom, em vez de crescer no terreno. Reservatórios e tanques são a exceção e mantêm seu tamanho na tela em qualquer zoom.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='Opacidade do símbolo (0 a 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='Opacidade da imagem de fundo (0 a 1)';
$ec_lang['lpn_settings_map_display']='Aparência do mapa';
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
$ec_lang['lpn_settings_legend_position']='Posição da legenda de rótulos';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='Nenhuma';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='Desligado';
$ec_lang['lpn_settings_legend_top_left']='Superior esquerda';
$ec_lang['lpn_settings_legend_top_right']='Superior direita';
$ec_lang['lpn_settings_legend_middle_left']='Meio esquerda';
$ec_lang['lpn_settings_legend_middle_right']='Meio direita';
$ec_lang['lpn_settings_legend_bottom_left']='Inferior esquerda';
$ec_lang['lpn_settings_legend_bottom_right']='Inferior direita';
$ec_lang['lpn_settings_color_node_field']='Cor do nó';
$ec_lang['lpn_settings_color_link_field']='Cor do tubo';
$ec_lang['lpn_settings_color_ramp']='Esquema de cores';
$ec_lang['lpn_settings_color_credits']='Créditos';
$ec_lang['lpn_color_ramp_epanet']='Azul a vermelho (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='Roxo a amarelo (mais fácil de distinguir uma cor da outra)';
$ec_lang['lpn_color_ramp_gray']='Cinza claro a escuro';
$ec_lang['lpn_settings_color_reverse']='Inverter a ordem das cores';
$ec_lang['lpn_color_none']='Sem cor';
$ec_lang['lpn_settings_color_key_position']='Posição da legenda de cores';
$ec_lang['lpn_settings_color_breaks']='Limites das faixas de cor';
$ec_lang['lpn_settings_color_equal_intervals']='Intervalos iguais';
$ec_lang['lpn_settings_color_equal_counts']='Contagens iguais';
$ec_lang['lpn_settings_color_no_values']='Ainda não há valores para usar. Resolva a rede primeiro.';
$ec_lang['lpn_confirm_restore_defaults']='Redefinir todas as configurações (prefixos de ID, valores iniciais, configurações do solucionador, aparência do mapa, posição da legenda e rótulos visíveis) para os valores originais? Sua rede não é alterada. As configurações pertencem ao projeto aberto, então seus outros projetos mantêm as próprias.';
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
$ec_lang['lpn_settings_wipe_btn']='Apagar tudo nesta página';
$ec_lang['lpn_confirm_wipe']='Excluir TUDO que foi salvo para esta página — todos os projetos, todas as imagens de fundo, todas as configurações e suas escolhas de unidades — e recarregar a página como um visitante totalmente novo veria? Isso não pode ser desfeito.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='Copie este link:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='Tempo';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='Duração total da simulação';
$ec_lang['lpn_time_hyd_step']='Passo de tempo hidráulico';
$ec_lang['lpn_time_pattern_step']='Passo de tempo do padrão';
$ec_lang['lpn_time_pattern_start']='Horário de início do padrão';
$ec_lang['lpn_time_report_step']='Passo de tempo do relatório';
$ec_lang['lpn_time_report_start']='Horário de início do relatório';
$ec_lang['lpn_time_clock_start']='Horário do relógio no início';
$ec_lang['lpn_time_clock_day']='Dia {day}, {clock}';
$ec_lang['lpn_time_format_tip']='Escreva um horário como horas e minutos, como 2:30. Um número simples significa horas, então 8 é oito horas. Meia hora é 0:30.';
$ec_lang['lpn_time_running']='Calculando a simulação de período estendido com o solucionador EPANET.';
$ec_lang['lpn_time_no_engine']='O solucionador interno calcula um momento de cada vez, então isto é a rede apenas em {time}: cada padrão é lido nesse momento, e cada tanque ainda está no seu nível inicial, em vez de encher e esvaziar. Conecte-se à internet uma vez para buscar o solucionador EPANET, que executa uma simulação de período estendido.';
$ec_lang['lpn_time_slider']='Tempo';
$ec_lang['lpn_time_no_period']='Este projeto não tem simulação de período estendido definida, então há apenas um momento para mostrar. Defina uma Duração total da simulação em Configurações, Cálculo, Tempo para executar uma simulação de período estendido.';
$ec_lang['lpn_time_first']='Ir para o início';
$ec_lang['lpn_time_prev']='Voltar um passo';
$ec_lang['lpn_time_play']='Reproduzir';
$ec_lang['lpn_time_play_tip']='Reproduzir animação';
$ec_lang['lpn_time_pause_tip']='Pausar animação';
$ec_lang['lpn_time_pause']='Pausar';
$ec_lang['lpn_time_next']='Avançar um passo';
$ec_lang['lpn_time_last']='Ir para o fim';
$ec_lang['lpn_time_tank']='Tanque';
$ec_lang['lpn_time_level']='Nível de água';
$ec_lang['lpn_time_run']='Executar';
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
$ec_lang['lpn_time_run_done']='A execução terminou. Horários de relatório: {frames}. Tempo gasto: {secs} s.';
$ec_lang['lpn_time_runbox_hide']='Não mostrar esta caixa novamente';
$ec_lang['lpn_settings_runbox']='Mostrar a caixa de progresso da execução';
$ec_lang['lpn_settings_runbox_tip']='Uma caixa que informa até onde uma execução chegou e o que encontrou. Com ela desligada, uma execução concluída diz a mesma coisa na linha de status por alguns segundos, em vez disso. Esta é uma configuração deste navegador, não do projeto.';
$ec_lang['lpn_time_run_failed']='A execução não terminou, então não há resultados para os horários posteriores.';
$ec_lang['lpn_time_run_report']='Relatório de execução do EPANET';
$ec_lang['lpn_time_run_report_copy']='Copiar';
$ec_lang['lpn_time_run_report_copied']='Copiado';
$ec_lang['lpn_time_run_report_tip']='O que o próprio solucionador EPANET informou sobre o último cálculo: se convergiu, e qualquer aviso que tenha dado. É o texto do próprio solucionador, não o nosso.';

$ec_lang['lpn_time_speed']='Velocidade de reprodução';
$ec_lang['lpn_time_speed_tip']='A velocidade com que a simulação é reproduzida.';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_tool_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='Pesquisar configurações';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='Digite uma palavra para ver apenas as configurações que a mencionam. As explicações também são pesquisadas, não apenas os nomes.';
$ec_lang['lpn_settings_no_match']='Nenhuma configuração menciona essa palavra.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='Largura da lista da seção Configurações';
$ec_lang['lpn_rpane_empty']='Nada está fixado aqui ainda. Tudo o que pertence ao projeto inteiro está em Configurações.';
$ec_lang['lpn_time_settings_open']='Configurações de tempo';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='Visualização';
$ec_lang['lpn_settings_sec_map']='Mapa e página';
$ec_lang['lpn_settings_sec_assets']='Padrões para novos elementos';
$ec_lang['lpn_settings_sec_calculation']='Cálculo';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='Cliente';
$ec_lang['lpn_labels_customer_note']='Um rótulo de cliente mostra os valores marcados aqui. Ele é desenhado no mesmo tamanho de texto que qualquer outro rótulo no mapa.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='Os rótulos de cliente são desenhados somente enquanto a visualização do mapa tiver esta largura ou menos. Deixe a caixa vazia para desenhá-los em qualquer zoom. Digite 0 para nunca desenhar um rótulo de cliente, em nenhum zoom. Isso não tem efeito se for maior que a configuração equivalente para todos os rótulos.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='Usar a visualização atual';
$ec_lang['lpn_settings_page']='Página';
$ec_lang['lpn_settings_hydraulics']='Hidráulica';
$ec_lang['lpn_settings_quality']='Qualidade da água';
$ec_lang['lpn_settings_quality_track']='Parâmetro de qualidade';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='Escolha o que a execução deve acompanhar ao longo dos trechos: há quanto tempo a água está no sistema, de onde ela veio, ou um produto químico que reage enquanto viaja. Só o produto químico precisa de coeficientes.';
$ec_lang['lpn_settings_quality_source']='Nó de rastreamento';
$ec_lang['lpn_settings_quality_source_tip']='O nó cuja água é rastreada. Todo outro nó então mostra a parcela de sua água que veio desse nó.';
$ec_lang['lpn_quality_none']='Nenhum';
$ec_lang['lpn_quality_trace']='Rastreamento de origem';
$ec_lang['lpn_quality_chemical']='Um produto químico que reage';
$ec_lang['lpn_quality_needs_run']='A qualidade da água é transportada pelos trechos conforme a água viaja, então precisa de uma simulação de período estendido: o motor EPANET e uma duração total da simulação. Defina uma Duração total da simulação em Tempo, depois pressione o botão Executar.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='Produto químico';
$ec_lang['lpn_quality_chemical_name_tip']='O produto químico que você está monitorando, por exemplo, Cloro. Deixe em branco para o rótulo padrão do próprio EPANET, Chemical. Aparece em seus relatórios, mas não é usado nos cálculos.';
$ec_lang['lpn_quality_mass_units']='Unidades de massa';
$ec_lang['lpn_quality_mass_units_tip']='A metade de unidades da entrada de qualidade, as duas próprias opções do EPANET.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='Tolerância de qualidade';
$ec_lang['lpn_quality_tolerance_tip']='O quanto duas parcelas de água vizinhas podem diferir em concentração antes que o EPANET as trate como uma só. Vazio usa o próprio padrão do EPANET de 0,01.';
$ec_lang['lpn_quality_diffusivity']='Difusividade relativa';
$ec_lang['lpn_quality_diffusivity_tip']='Com que facilidade o produto químico se espalha pela água, em relação ao cloro. Vazio usa o próprio padrão do EPANET de 1,0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='Concentração de {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='Concentração média de {chemical}';
$ec_lang['lpn_quality_initial']='Qualidade inicial';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='Quanto do produto químico este nó contém quando a execução começa. Um reservatório mantém seu próprio valor durante toda a execução, que é como o residual que sai de uma estação de tratamento costuma ser indicado. Em branco significa 0.';
$ec_lang['lpn_result_concentration']='Concentração';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='Quanto do produto químico resta neste ponto depois de ter percorrido e reagido. As unidades são as suas, como indicadas junto ao nome do produto químico em Configurações, Cálculo, Qualidade da água.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='Tipo de fonte';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='Que tipo de dosagem de fonte de produto químico é aplicada aqui com base no valor de Qualidade da fonte? Fonte de concentração usa o valor como uma concentração aplicada à vazão externa de entrada (reservatório ou demanda negativa). Reforço de massa adiciona uma vazão mássica fixa por minuto à água que entra no nó vinda de outros pontos da rede. Reforço de ponto de ajuste garante que a concentração que sai do nó não seja menor que o valor. Fonte de reforço proporcional à vazão adiciona uma concentração fixa à resultante da mistura de toda a vazão de entrada no nó vinda de outros pontos da rede';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='Nenhum';
$ec_lang['lpn_source_type_concen']='Concentração';
$ec_lang['lpn_source_type_mass']='Reforço de massa';
$ec_lang['lpn_source_type_setpoint']='Reforço de ponto de ajuste';
$ec_lang['lpn_source_type_flowpaced']='Reforço proporcional à vazão';
$ec_lang['lpn_source_quality']='Qualidade da fonte';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='Quão forte é a dose. Para todos os tipos, exceto o reforço de massa, isto é uma concentração, nas unidades indicadas junto ao produto químico em Configurações, Cálculo, Qualidade da água; para um reforço de massa é uma vazão mássica por minuto. Em branco significa nenhuma fonte de produto químico, funcionalmente equivalente a 0.';
$ec_lang['lpn_source_pattern']='Padrão da fonte';
$ec_lang['lpn_source_pattern_tip']='Um padrão de tempo que ajusta a dose ao longo da execução, para uma dose que não é constante. Nenhum padrão significa que a dose é a mesma em cada instante.';
$ec_lang['lpn_mixing_model']='Modelo de mistura';
$ec_lang['lpn_mixing_model_tip']='Como a água já presente neste tanque se mistura com a água que entra. Mistura completa agita o tanque inteiro de uma vez. Mistura em dois compartimentos preenche uma zona de entrada primeiro e passa o restante adiante. Fluxo em pistão FIFO move a água na ordem em que chegou. Fluxo em pistão LIFO a empilha, então a última água a entrar é a primeira a sair. A escolha muda a idade da água e o residual, e não muda nenhuma pressão ou vazão.';
$ec_lang['lpn_mixing_mixed']='Mistura completa';
$ec_lang['lpn_mixing_2comp']='Mistura em dois compartimentos';
$ec_lang['lpn_mixing_fifo']='Fluxo em pistão FIFO';
$ec_lang['lpn_mixing_lifo']='Fluxo em pistão LIFO';
$ec_lang['lpn_mixing_fraction']='Fração de mistura';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='A parte do volume do tanque que a zona de entrada ocupa, entre 0 e 1. Só a mistura em dois compartimentos a usa. Em branco significa que o tanque inteiro é a zona de entrada.';
$ec_lang['lpn_reaction_bulk']='Coeficiente de reação no corpo da água';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='Reação no corpo da água (veja a Ajuda do EPANET), usada em cada trecho e tanque que não tem a sua própria. Um número negativo decai o produto químico e um positivo o aumenta. Em branco significa nenhuma reação no corpo da água.';
$ec_lang['lpn_reaction_wall']='Coeficiente de reação na parede';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='Reação na parede do trecho (veja a Ajuda do EPANET), usada em cada trecho sem valor informado. Um número negativo decai o produto químico. Em branco significa nenhuma reação na parede.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='Reação no corpo da água (veja a Ajuda do EPANET). Um número negativo decai o produto químico e um positivo o aumenta. Em branco significa usar o coeficiente definido para toda a rede em Configurações, Cálculo, Qualidade da água.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='Coeficiente de reação';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='Reação na água contida neste tanque, como uma taxa em 1/dia. Um número negativo decai o produto químico e um positivo o aumenta. A água permanece em um tanque muito mais tempo do que em qualquer trecho, então é aqui que um residual costuma se perder. Em branco significa usar o coeficiente de reação no corpo da água definido para toda a rede em Configurações, Cálculo, Qualidade da água.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='Reação no corpo';
$ec_lang['lpn_reaction_wall_short']='Reação na parede';
$ec_lang['lpn_reaction_tank_short']='Reação';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/dia';
$ec_lang['lpn_reaction_day']='dia';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='Ordem de reação na massa líquida';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='O expoente ao qual a concentração é elevada para a reação no corpo d\'água. Qualquer número real é permitido. 1 é o valor padrão e é usado na maioria das modelagens de decaimento de cloro. 0 torna a taxa independente da quantidade de produto químico presente.';
$ec_lang['lpn_reaction_order_tank']='Ordem de reação no tanque';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='O expoente ao qual a concentração é elevada para a reação na água contida em um tanque, separado da ordem de reação na massa líquida para que um tanque possa reagir em uma ordem diferente da dos trechos. Qualquer número real é permitido, e 1 é o padrão. O EPANET o registra como ORDER TANK em um arquivo e não oferece uma caixa para isso na própria interface.';
$ec_lang['lpn_reaction_order_wall']='Ordem de reação na parede';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='1 significa que a reação na parede ocorre de acordo com o(s) coeficiente(s) informado(s). 0 significa que não ocorre. Isto é uma chave de ligar e desligar. O valor padrão é 1.';
$ec_lang['lpn_reaction_order_unstated']='Não indicado';
$ec_lang['lpn_reaction_order_zero']='0, ordem zero';
$ec_lang['lpn_reaction_order_first']='1, primeira ordem';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='Potencial limitante';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='Uma concentração para a qual o produto químico se move, em vez de decair até zero ou crescer sem fim. A reação desacelera à medida que a água se aproxima dela e para ali. Use unidades consistentes. Sem limite se deixado em branco.';
$ec_lang['lpn_reaction_rough_corr']='Correlação com a rugosidade';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='Correlaciona a reação na parede com a própria rugosidade de cada trecho, de modo que um trecho mais rugoso reaja mais rápido. Quando definida, um coeficiente de parede é calculado para cada trecho a partir da rugosidade desse trecho, e o coeficiente de parede único acima deixa de ser usado. Não é usada se deixada em branco.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='Este aplicativo não oferece sugestões de coeficiente de reação. Não há um teste padrão para isso, e os valores de campo publicados para o mesmo tipo de água diferem por um fator de dez. Digite um valor que você tenha medido ou possa citar, ou deixe as caixas em branco para um produto químico que não reage.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='Energia';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='Relatórios';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_epanet']='Execução EPANET';
$ec_lang['lpn_energy_title']='Relatório de energia das bombas';
$ec_lang['lpn_energy_menu']='Energia das bombas';
$ec_lang['lpn_energy_efficiency']='Eficiência da bomba (porcentagem)';
$ec_lang['lpn_energy_efficiency_tip']='A eficiência do fio à água usada em cada bomba que não tem uma curva de eficiência própria. O EPANET usa 75 por cento quando nada é indicado.';
$ec_lang['lpn_energy_price']='Preço da energia';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='Quanto custa um quilowatt-hora. Aplica-se a cada bomba que não tem um preço próprio. Em branco significa 0.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='Quanto custa um quilowatt-hora nesta bomba. Em branco significa usar o preço definido para toda a rede em Configurações, Energia.';
$ec_lang['lpn_energy_price_pattern']='Padrão de preço';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='Um padrão que multiplica o preço em cada instante do padrão, que é como uma tarifa fora de ponta é especificada. Deixe em branco para preço constante durante toda a execução.';
$ec_lang['lpn_energy_demand_charge']='Tarifa de demanda de pico';
$ec_lang['lpn_energy_demand_charge_tip']='Quanto a concessionária cobra por kW pela carga de pico exigida pelas bombas no sistema.';
$ec_lang['lpn_energy_currency']='Moeda';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='O que você escrever aqui é impresso ao lado de cada valor em dinheiro. É apenas um rótulo, mas seja consistente.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='Este aplicativo não oferece sugestões de preço. Quanto a energia custa depende da concessionária, do país, da hora e do ano.';
$ec_lang['lpn_energy_needs_run']='Energia das bombas é potência integrada ao longo da execução, então precisa de uma simulação de período estendido: o motor EPANET e uma duração total da simulação. Defina uma Duração total da simulação em Configurações, Cálculo, Tempo, pressione o botão Executar, depois abra Água, Relatórios, Energia das bombas.';
$ec_lang['lpn_energy_no_pumps']='Esta rede não tem bombas, então não há nada consumindo energia.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='Comparação de cenários';
$ec_lang['lpn_scncmp_menu_tip']='Resolve todos os cenários deste projeto e os mostra lado a lado: a menor pressão e a maior velocidade em cada um.';
$ec_lang['lpn_scncmp_running']='Resolvendo todos os cenários…';
$ec_lang['lpn_scncmp_empty']='Nada foi desenhado ainda, então não há nada para resolver.';
$ec_lang['lpn_scncmp_col_maxvelocity']='Maior velocidade';
$ec_lang['lpn_scncmp_at']='{value} em {id}';
$ec_lang['lpn_scncmp_current']='(aberto no momento)';
$ec_lang['lpn_scncmp_note']='Cada cenário é resolvido a partir de uma cópia do desenho. Nada aqui altera o projeto, e o cenário em que você está trabalhando permanece como estava.';
$ec_lang['lpn_energy_over']='Para simulação de período estendido de {time}';
$ec_lang['lpn_energy_col_pump']='Bomba';
$ec_lang['lpn_energy_col_running']='% da execução';
$ec_lang['lpn_energy_col_effic']='Efic.';
$ec_lang['lpn_energy_col_avg_kw']='kW médio';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='A potência média usada quando esta bomba estava em funcionamento. Não é uma média sobre os períodos ociosos, para que uma bomba que ficou ociosa durante boa parte da simulação de período estendido ainda reporte a potência que usou enquanto funcionou.';
$ec_lang['lpn_energy_col_peak_kw']='kW de pico';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='Custo';
$ec_lang['lpn_energy_total_kwh']='Energia usada';
$ec_lang['lpn_energy_total_energy_cost']='Custo da energia';
$ec_lang['lpn_energy_peak_kw']='Uso de potência de pico';
$ec_lang['lpn_energy_total_demand_charge']='Custo da demanda de pico';
$ec_lang['lpn_energy_total_cost']='Custo total';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='Estado';
$ec_lang['lpn_reports_status_tip']='O que mudou ao longo da última simulação de período estendido, em ordem cronológica: bombas e válvulas abrindo ou fechando, tanques enchendo, esvaziando, ficando cheios ou secando, e etapas que não convergiram totalmente.';
$ec_lang['lpn_status_title']='Relatório de estado';
$ec_lang['lpn_status_needs_run']='O relatório de estado lista o que mudou durante uma simulação de período estendido. Defina uma Duração total da simulação em Configurações, Cálculo, Tempo, pressione Calcular, depois abra Água, Relatórios, Relatório de estado.';
$ec_lang['lpn_status_empty']='Nada mudou de estado durante esta execução.';
$ec_lang['lpn_status_col_event']='Evento';
$ec_lang['lpn_status_opened']='{type} {id} agora aberto';
$ec_lang['lpn_status_closed']='{type} {id} agora fechado';
$ec_lang['lpn_status_filling']='{type} {id} agora enchendo';
$ec_lang['lpn_status_emptying']='{type} {id} agora esvaziando';
$ec_lang['lpn_status_full']='{type} {id} agora cheio';
$ec_lang['lpn_status_dry']='{type} {id} agora vazio';
$ec_lang['lpn_status_no_converge']='A solução hidráulica nesta etapa não convergiu totalmente; os números mostrados são da sua última iteração.';
$ec_lang['lpn_status_note']='Lido da mesma execução de período estendido que o painel Tabelas e o Relatório completo. Somente uma mudança é listada, não cada etapa.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='Completo';
$ec_lang['lpn_reports_full_tip']='Cada nó e cada trecho em cada horário de relatório da última execução, como uma tabela que você pode baixar ou imprimir.';
$ec_lang['lpn_full_title']='Relatório completo';
$ec_lang['lpn_full_needs_run']='O relatório completo lista cada nó e cada trecho em cada horário de relatório. Pressione Calcular, depois abra Água, Relatórios, Relatório completo.';
$ec_lang['lpn_full_note']='Uma linha por nó ou trecho por horário de relatório, nas unidades mostradas no painel Tabelas. Uma célula vazia é uma coluna que essa grandeza não tem. Baixar ou imprimir leva cada horário; a tabela abaixo mostra um de cada vez.';
$ec_lang['lpn_full_step_label']='Horário';
$ec_lang['lpn_full_download_csv']='Baixar CSV';
$ec_lang['lpn_full_print']='Imprimir relatório';
$ec_lang['lpn_full_col_time']='Tempo';
$ec_lang['lpn_full_col_type']='Tipo';
$ec_lang['lpn_full_col_id']='ID';
$ec_lang['lpn_full_row_count']='{n} linhas.';
$ec_lang['lpn_energy_no_price']='Nenhum preço de energia está indicado, então todo custo aqui é zero. Defina um em Configurações, Energia.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='Esta rede indica um preço de zero, então todo custo aqui é zero. Altere-o em Configurações, Energia.';
$ec_lang['lpn_energy_curve_note']='Estas bombas indicam uma curva de eficiência sem pontos: {ids}. Elas funcionaram na eficiência definida para toda a rede.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0,000';
$ec_lang['lpn_labels_col_rank']='Posição';
$ec_lang['lpn_labels_col_drop']='Descarte';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='Nó e trecho';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='Intervalos iguais';
$ec_lang['lpn_color_mode_quantile']='Quantil (contagem igual)';
$ec_lang['lpn_color_mode_jenks']='Quebras naturais (Jenks)';
$ec_lang['lpn_color_mode_stddev']='Desvio padrão';
$ec_lang['lpn_color_mode_pretty']='Bonito (arredondado)';
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
$ec_lang['lpn_library_patterns']='Padrões';
$ec_lang['lpn_library_patterns_tip']='Um padrão é uma lista de multiplicadores que se repete. Cada um vale para um intervalo do padrão, então 24 números em um intervalo de uma hora formam um dia que se repete. Uma demanda de 10 com um multiplicador de 1,5 é 15 naquele momento.';
$ec_lang['lpn_library_curves']='Curvas';
$ec_lang['lpn_library_curves_tip']='Uma curva é uma lista de pontos que diz como algo se comporta: quanta carga uma bomba adiciona em cada vazão, quão eficiente ela é nessa vazão, ou quanta carga uma válvula perde em cada vazão.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='Uma curva pertence a um projeto, e uma bomba ou uma válvula indica qual usa nas suas próprias propriedades. Vários elementos podem usar a mesma curva, e editá-la aqui muda todos eles. Para uma curva de carga de bomba, a execução usa uma curva ajustada pelos pontos, como mostrado; para todo outro tipo, ela conecta os pontos com linhas retas, como mostrado.';
$ec_lang['lpn_library_curve_add']='Adicionar uma curva';
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
$ec_lang['lpn_library_curve_equation']='Equação';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='A curva ajustada pelos pontos, e a linha desenhada no gráfico abaixo. Ela é calculada novamente cada vez que é mostrada e nunca é armazenada, e seus números estão nas unidades que a tabela acima mostra. O solucionador interno funciona com esta equação; o motor EPANET lê os próprios pontos.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='Selecione uma ou duas colunas em uma planilha, copie-as, e cole na primeira célula onde deseja que elas apareçam. As linhas são adicionadas conforme necessário. Você também pode colar linhas copiadas diretamente de um arquivo EPANET, incluindo o nome da curva.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='Descrição';
$ec_lang['lpn_library_curve_remove_point']='Remover este ponto';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='Copiar pontos';
$ec_lang['lpn_library_curve_copy_tip']='Copia cada ponto como duas colunas, prontas para colar em uma planilha.';
$ec_lang['lpn_library_curve_copy_manual']='Copiar estes pontos';
$ec_lang['lpn_library_curve_used_by']='Elementos que usam esta curva';
$ec_lang['lpn_library_curve_unused']='Nada usa esta curva.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='Esta curva é usada por {count} elementos: {ids}. Aponte-os para outra curva primeiro, depois exclua esta.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='Tipos de tubulação';
$ec_lang['lpn_library_pipetypes_tip']='Um tipo de tubulação é uma definição que vários trechos podem referenciar para seu diâmetro, rugosidade e coeficientes de reação. Editar a definição edita todo trecho que a usa.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='Cada projeto tem sua própria biblioteca de tipos de tubulação. Você pode deixar propriedades em branco em uma definição de tipo de tubulação. Por exemplo, um tipo de tubulação que especifica uma rugosidade e nenhum diâmetro é aceitável. Você anexa tipos de tubulação aos trechos no editor de propriedades deles. Editar uma definição aqui altera todo trecho que a referencia.';
$ec_lang['lpn_library_pipetype_add']='Adicionar um tipo de tubulação';
$ec_lang['lpn_library_pipetype_blank_tip']='Propriedades em branco em uma definição de tipo de tubulação ficam para ser inseridas individualmente em cada trecho.';
$ec_lang['lpn_library_pipetype_used_by']='Trechos que usam este tipo';
$ec_lang['lpn_library_pipetype_unused']='Nada usa este tipo de tubulação.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='Este tipo de tubulação é usado por {count} trechos: {ids}. Desanexe-o deles antes de excluí-lo.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='Tipo de tubulação';
$ec_lang['lpn_field_pipetype_tip']='O tipo de tubulação, na biblioteca do projeto, que este trecho usa. As propriedades incluídas no tipo de tubulação ficam desabilitadas para edição aqui. Desanexe o tipo de tubulação para habilitar a edição aqui.';
$ec_lang['lpn_pipetype_none']='Nenhum tipo de tubulação selecionado';
$ec_lang['lpn_pipetype_detach']='Desanexar do tipo de tubulação';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='Copia os valores que este trecho lê do seu tipo para o próprio trecho e deixa de usar o tipo. Os valores do trecho não mudam agora, e a partir de agora você pode editar esses valores aqui.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='Conexões';
$ec_lang['lpn_library_fittings_tip']='Uma lista de conexões é um conjunto de conexões e suas quantidades que vários trechos podem referenciar. Ela soma um único coeficiente de perda de carga localizada.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='Cada projeto tem sua própria biblioteca de conexões. Uma lista de conexões tem conexões com uma quantidade para cada uma, e ela soma um único coeficiente de perda de carga localizada. Tanto trechos quanto tipos de tubulação podem referenciar uma lista.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='As conexões oferecidas aqui são as treze da Tabela 3.3 do manual do usuário do EPANET 2.2. Escolher uma copia seu coeficiente para a linha, onde você pode alterá-lo. Um coeficiente depende do tamanho e do fabricante da conexão, então trate a tabela como um ponto de partida, e não como uma resposta.';
$ec_lang['lpn_library_fittings_add']='Adicionar uma lista de conexões';
$ec_lang['lpn_library_fittings_used_by']='Trechos que usam esta lista de conexões';
$ec_lang['lpn_library_fittings_unused']='Nada usa esta lista de conexões.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='Esta lista de conexões é usada por {count} trechos: {ids}. Desanexe-a deles antes de excluí-la.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='Importar bibliotecas…';
$ec_lang['lpn_library_import_tip']='Escolha outro arquivo de projeto e copie bibliotecas inteiras dele para este projeto. Qualquer nome já usado aqui é ignorado e listado, então nada que você já tem é alterado.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='Escolha o que copiar de {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='Cada biblioteca marcada é copiada por inteiro. Exclua depois o que não quiser, da mesma forma que exclui qualquer outro item.';
$ec_lang['lpn_library_import_go']='Importar';
$ec_lang['lpn_library_import_no_libraries']='Esse arquivo de projeto não tem bibliotecas para copiar.';
$ec_lang['lpn_library_import_heading']='Importado de {file}';
$ec_lang['lpn_library_import_added']='Copiado: {names}';
$ec_lang['lpn_library_import_conflict']='Ignorado, porque este projeto já tem um item com o mesmo nome: {names}. Nada aqui foi alterado. Renomeie um dos dois e importe novamente se quiser os dois.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='Esse arquivo de projeto não tem nenhum destes para copiar.';
$ec_lang['lpn_library_import_curve_shape']='Estas curvas vieram exatamente como o arquivo as escreveu, e uma execução não pode usar uma delas até que sua primeira coluna suba de um ponto ao próximo: {names}';
$ec_lang['lpn_library_import_needs_fittings']='Estes tipos de tubo se referem a uma lista de conexões que este projeto não tem: {names}. Importe a biblioteca de conexões do mesmo arquivo e eles a encontrarão.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='Aviso: unidades incompatíveis. Serão importadas como estão. Não recomendado.';
$ec_lang['lpn_library_import_units_line']='{name}: este projeto mostra {mine}, o arquivo mostra {theirs}.';
$ec_lang['lpn_fitting_qty']='Quantidade';
$ec_lang['lpn_fitting_name']='Conexão';
$ec_lang['lpn_fitting_k']='Coeficiente';
$ec_lang['lpn_fitting_add']='Adicionar uma conexão';
$ec_lang['lpn_fitting_remove']='Remover';
$ec_lang['lpn_fitting_total']='Coeficiente total de perda de carga localizada, k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='Lista de conexões';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='Uma lista de conexões da biblioteca do projeto. Suas quantidades e coeficientes são somados no coeficiente de perda de carga localizada deste trecho, e a caixa de coeficiente passa a ser somente leitura. Deixe isto não selecionado para digitar o coeficiente você mesmo.';
$ec_lang['lpn_fittings_none']='Nenhuma lista de conexões selecionada';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='Válvula globo, totalmente aberta';
$ec_lang['lpn_fitting_angle']='Válvula de ângulo, totalmente aberta';
$ec_lang['lpn_fitting_swingcheck']='Válvula de retenção de portinhola, totalmente aberta';
$ec_lang['lpn_fitting_gate']='Válvula gaveta, totalmente aberta';
$ec_lang['lpn_fitting_elbow_short']='Cotovelo de raio curto';
$ec_lang['lpn_fitting_elbow_medium']='Cotovelo de raio médio';
$ec_lang['lpn_fitting_elbow_long']='Cotovelo de raio longo';
$ec_lang['lpn_fitting_elbow_45']='Cotovelo de 45 graus';
$ec_lang['lpn_fitting_return_bend']='Curva de retorno fechada';
$ec_lang['lpn_fitting_tee_run']='Tê padrão, fluxo pela linha reta';
$ec_lang['lpn_fitting_tee_branch']='Tê padrão, fluxo pelo ramal';
$ec_lang['lpn_fitting_entrance']='Entrada em aresta viva';
$ec_lang['lpn_fitting_exit']='Saída';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='Outra conexão';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='{file} salvo';
$ec_lang['lpn_inp_export_flat_lead']='O arquivo EPANET exportado é numericamente equivalente a este projeto. Mas ele não tem lugar para o seguinte:';
$ec_lang['lpn_inp_export_flat_types']='{n} trechos aqui referenciam {t} tipos de tubulação. No arquivo, cada um desses trechos carrega sua própria cópia dos números, então as respostas são as mesmas. O que o arquivo não pode conter é o próprio tipo de tubulação, então editar uma definição e ter todo trecho a seguindo é algo que só o seu próprio arquivo de projeto registra.';
$ec_lang['lpn_inp_export_flat_coords']='Um arquivo EPANET guarda uma posição para cada nó. Este cenário posiciona {n} deles em outro lugar, e essas são as posições no arquivo. Todo outro cenário mantém suas próprias posições somente no seu arquivo de projeto.';
$ec_lang['lpn_inp_export_flat_fittings']='Um arquivo EPANET não pode conter a lista de cotovelos, válvulas e tês do seu arquivo de projeto. O coeficiente de perda de carga localizada de {n} trechos aqui é somado a partir de uma lista de conexões. O total vai para o arquivo exatamente como está, então nada muda nas respostas.';
$ec_lang['lpn_library_controls']='Controles';
$ec_lang['lpn_library_controls_tip']='Um controle é uma frase que abre ou fecha um trecho, ou lhe dá um ajuste, quando um nível de água, uma pressão ou um horário assim determina.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='Adicionar um padrão';
$ec_lang['lpn_library_pattern_values']='Multiplicadores';
$ec_lang['lpn_library_pattern_values_tip']='Os multiplicadores, separados por espaços ou vírgulas. Cole uma coluna de uma planilha, se você tiver uma. A lista se repete durante toda a execução, então não precisa cobrir a execução inteira.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} multiplicadores, com intervalo de {step}, cobrindo {span}';
$ec_lang['lpn_library_pattern_none']='Nenhum padrão';
$ec_lang['lpn_settings_default_pattern']='Padrão de demanda predefinido';
$ec_lang['lpn_settings_default_pattern_tip']='Toda junção sem padrão usa este aqui.';
$ec_lang['lpn_library_control_add']='Adicionar um controle';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='Uma frase, nas palavras que o EPANET usa. Quatro formas: LINK 9 OPEN IF NODE 2 BELOW 110, LINK 9 CLOSED IF NODE 2 ABOVE 140, LINK 10 OPEN AT TIME 1, e LINK 12 CLOSED AT CLOCKTIME 3 AM. Em vez de OPEN ou CLOSED você pode escrever um número, que é um ajuste de válvula ou uma velocidade de bomba. Deixe as palavras-chave em inglês; é o que a página lê.';
$ec_lang['lpn_library_control_ok']='✓ Entendido';
$ec_lang['lpn_library_control_bad']='⚠ Não entendido';
$ec_lang['lpn_library_control_missing']='⚠ Esta rede não tem nada chamado {id}';
$ec_lang['lpn_library_rules']='Regras';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='Uma regra é um parágrafo curto que abre ou fecha um trecho, ou lhe dá um ajuste, quando um nível de água, uma pressão, uma vazão ou um horário atinge um valor que você define. As regras podem testar mais de uma coisa ao mesmo tempo, e podem indicar o que fazer quando o teste falha.';
$ec_lang['lpn_library_rule_add']='Adicionar uma regra';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='Uma regra, nas palavras que o EPANET usa, uma cláusula por linha. Uma primeira linha a nomeia: RULE 1. Depois uma condição: IF TANK 2 LEVEL BELOW 17.1. Depois o que fazer a respeito: THEN PUMP 9 STATUS IS OPEN. Uma última linha pode classificá-la: PRIORITY 1. Adicione linhas AND ou OR para testar mais de uma coisa, e linhas ELSE para indicar o que fazer quando o teste falha. Uma condição pode ler LEVEL, HEAD, GRADE, PRESSURE ou DEMAND em um nó, FLOW, STATUS ou SETTING em um trecho, ou TIME e CLOCKTIME em SYSTEM. Escreva os números nas unidades que este projeto está mostrando; eles são convertidos para você. Deixe as palavras-chave em inglês; são o que a página e o EPANET leem.';
$ec_lang['lpn_library_rule_ok']='✓ Esta regra foi lida';
$ec_lang['lpn_library_rule_bad']='⚠ Esta regra não pôde ser lida';
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
$ec_lang['lpn_result_demand_tip']='A vazão que este nó consome no horário mostrado: cada demanda base multiplicada por seu próprio padrão, somadas. É calculada, não digitada, então muda com o relógio e não pode ser editada.';
$ec_lang['lpn_field_demand_pattern']='Padrão de demanda';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='Descrição';
$ec_lang['lpn_demand_add']='Adicionar categoria de demanda';
$ec_lang['lpn_demand_remove']='Remover esta demanda';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='Padrão de carga';
$ec_lang['lpn_field_head_pattern_tip']='Como o nível de água deste reservatório sobe e desce ao longo da execução. A carga acima é multiplicada pelo padrão.';
$ec_lang['lpn_field_pump_speed']='Velocidade relativa';
$ec_lang['lpn_field_pump_speed_tip']='1 é esta bomba girando na velocidade em que sua curva foi medida. 0,9 é a mesma bomba girando mais devagar, o que reduz a carga que ela adiciona e a vazão que ela passa. Um padrão de velocidade toma o lugar deste número enquanto a execução está ocorrendo.';
$ec_lang['lpn_field_speed_pattern']='Padrão de velocidade';
$ec_lang['lpn_field_speed_pattern_tip']='Como a velocidade desta bomba sobe e desce ao longo da execução. Cada multiplicador é a velocidade relativa para aquela parte da execução, e toma o lugar do ajuste de Velocidade em vez de o escalar, então um multiplicador de 0 para a bomba.';

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
$ec_lang['lpn_search_menu']='Buscar um lugar pelo nome…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='Encontre uma cidade, uma rua ou um ponto de referência pelo nome e mova o mapa até ele. O primeiro uso pede a sua permissão, porque as palavras que você digita vão para o serviço de nomes de lugares do OpenStreetMap.';
$ec_lang['lpn_search_bar']='Buscar pelo nome…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='A busca por nome de lugar envia as palavras que você digita para nominatim.openstreetmap.org, o serviço gratuito de nomes de lugares da OpenStreetMap Foundation.';
$ec_lang['lpn_search_consent_2']='Este é um serviço diferente das imagens do mapa de ruas atrás do seu projeto. As imagens dizem apenas para onde você está olhando. Uma busca diz o que você digitou. O serviço de nomes de lugares receberá as palavras da sua busca e o seu endereço IP. Não enviamos mais nada, e não guardamos nenhum registro das suas buscas.';
$ec_lang['lpn_search_consent_3']='Podemos enviar as suas buscas para o serviço de nomes de lugares?';
$ec_lang['lpn_search_consent_4']='Se você disser não, tudo o mais nesta página continua funcionando exatamente como agora, incluindo Ir para uma latitude e longitude. Lembramos de um sim para não precisar perguntar de novo. Um não não é armazenado de forma alguma.';
$ec_lang['lpn_search_refused']='A busca por nome de lugar está desligada, e nada foi enviado. Você ainda pode usar Ir para uma latitude e longitude.';
$ec_lang['lpn_search_prompt']='Busque um lugar pelo nome. Uma cidade, uma rua, um ponto de referência — por exemplo: Petaluma, Califórnia';
$ec_lang['lpn_search_empty']='Digite um nome de lugar para buscar.';
$ec_lang['lpn_search_working']='Buscando…';
$ec_lang['lpn_search_busy']='Uma busca já está em andamento. Aguarde a resposta.';
$ec_lang['lpn_search_choose']='Mais de um lugar corresponde. Qual deles?';
$ec_lang['lpn_search_nochoice']='Nada foi escolhido, então o mapa não se moveu.';
$ec_lang['lpn_search_badchoice']='Esse não é um dos números da lista.';
$ec_lang['lpn_search_none']='Nada encontrado para esse nome.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='O serviço de nomes de lugares está pedindo para diminuirmos o ritmo. Espere um minuto e tente novamente.';
$ec_lang['lpn_search_http']='O serviço de nomes de lugares respondeu com um erro.';
$ec_lang['lpn_search_timeout']='O serviço de nomes de lugares não respondeu a tempo. Tudo o mais nesta página funciona sem ele.';
$ec_lang['lpn_search_unreadable']='O serviço de nomes de lugares respondeu com algo que esta página não conseguiu ler.';
$ec_lang['lpn_search_offline']='Não conseguimos alcançar o serviço de nomes de lugares. Você pode estar off-line. Tudo o mais nesta página funciona sem ele, incluindo Ir para uma latitude e longitude.';
$ec_lang['lpn_search_toofast']='Uma busca por segundo — é o que o serviço de nomes de lugares permite. Tente novamente em instantes.';
$ec_lang['lpn_search_nofetch']='Este navegador não consegue alcançar o serviço de nomes de lugares.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='O Mapbox monta isto a partir de muitos conjuntos de dados públicos de elevação, então a qualidade depende inteiramente de onde você está. Onde existe um levantamento lidar nacional, como o USGS 3DEP em boa parte dos Estados Unidos e seus equivalentes em outros lugares, pode ser melhor que um metro na horizontal e algumas dezenas de centímetros na vertical. Onde só existem dados globais, é cerca de 30 m na horizontal e vários metros na vertical. O Mapbox não informa qual dos dois você recebeu. Trate isso como um mapa de curvas de nível, não um levantamento topográfico: verifique tudo de que você depende.';
$ec_lang['lpn_terrain_consent_1']='Preencher elevações envia a posição de cada nó que precisa de uma — sua latitude e longitude — para api.mapbox.com, para consultar a altura do terreno ali.';
$ec_lang['lpn_terrain_consent_2']='Esta é uma questão diferente das imagens do mapa atrás do seu projeto. As imagens dizem apenas para onde você está olhando. Estas posições são a sua rede em si. O Mapbox receberá essas coordenadas e o seu endereço IP. Não enviamos mais nada: nenhum nome, nenhum tubo, nenhum projeto. Não guardamos nenhum registro disso, e nada é armazenado neste dispositivo, exceto a sua resposta a esta pergunta.';
$ec_lang['lpn_terrain_consent_3']='Podemos enviar as posições dos seus nós para o Mapbox?';
$ec_lang['lpn_terrain_consent_4']='Se você disser não, tudo o mais nesta página continua funcionando exatamente como agora, e você pode digitar as elevações você mesmo, como antes. Lembramos de um sim para não precisar perguntar de novo. Um não não é armazenado de forma alguma.';
$ec_lang['lpn_terrain_refused']='As elevações não foram preenchidas, e nada foi enviado. Você pode digitá-las como antes.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='Preencher a elevação de {n} nó(s) a partir do DEM do Mapbox?';
$ec_lang['lpn_terrain_confirm_default_1']='Todo nó já tem uma elevação, e {n} deles ainda estão em {v}, que é a elevação com que um nó novo começa, e não uma que você digitou.';
$ec_lang['lpn_terrain_confirm_default_2']='Substituir a elevação desses {n} nós por valores do DEM do Mapbox?';
$ec_lang['lpn_terrain_keep']='{k} nó(s) já têm uma elevação e não serão tocados.';
$ec_lang['lpn_terrain_undo']='Um único Desfazer (Ctrl-Z) traz todos eles de volta.';
$ec_lang['lpn_terrain_requests']='{n} requisição(ões) para api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='As elevações já estão sendo preenchidas. Aguarde.';
$ec_lang['lpn_terrain_offmap']='Estas posições de nós não estão no mapa de terreno, então nada foi enviado.';
$ec_lang['lpn_terrain_too_wide']='Estes nós estão espalhados por uma área grande demais da Terra para ler de uma vez ({n} requisições de blocos). Nada foi enviado.';
$ec_lang['lpn_terrain_cancelled']='Nada foi alterado e nada foi enviado.';
$ec_lang['lpn_terrain_nofetch']='Este navegador não consegue alcançar o serviço de terreno.';
$ec_lang['lpn_terrain_working']='Lendo a superfície do terreno…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='O serviço de terreno recusou a solicitação ({status}), então nenhuma elevação foi alterada. O token do Mapbox usado neste site pode não permitir o endereço da web em que você está.';
$ec_lang['lpn_terrain_failed']='Não conseguimos alcançar o serviço de terreno, então nenhuma elevação foi alterada. Você pode estar off-line. Tudo o mais nesta página funciona sem ele.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='O serviço de terreno está pedindo para desacelerarmos (429), então nenhuma elevação foi alterada. Tente novamente em um minuto.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='O serviço de terreno respondeu com um erro ({status}), então nenhuma elevação foi alterada. Não há nada de errado com sua rede.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='Nenhum desses nós tem uma posição na Terra, então nada foi enviado e nenhuma elevação foi alterada. Ler a superfície do terreno exige um projeto em latitude e longitude, ou em uma projeção que esta página consiga posicionar.';
$ec_lang['lpn_terrain_done']='{n} elevação(ões) preenchida(s).';
$ec_lang['lpn_terrain_missed']='{m} não puderam ser lidas e continuam em branco.';
$ec_lang['lpn_terrain_partial']='{f} bloco(s) de terreno não responderam.';
$ec_lang['lpn_terrain_will_ids']='Estes nós vão receber uma elevação: {ids}';
$ec_lang['lpn_terrain_keep_ids']='Esses nós são: {ids}';
$ec_lang['lpn_terrain_filled_ids']='Estes nós receberam uma elevação: {ids}';
$ec_lang['lpn_terrain_blank_ids']='Estes nós ainda não têm elevação: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}, e mais {n}';

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
$ec_lang['lpn_ff_menu']='Análise de vazão de incêndio…';
$ec_lang['lpn_ff_menu_tip']='Testa as junções uma de cada vez: quanto cada uma pode fornecer mantendo a pressão residual que você define, e o desenho da vazão exigida ali tira alguma outra coisa dos limites?';
$ec_lang['lpn_ff_title']='Análise de vazão de incêndio';
$ec_lang['lpn_ff_intro']='Cada junção, por sua vez, é solicitada a fornecer uma vazão de incêndio além da demanda que já tem. Nada no seu projeto é alterado; todo o cálculo é feito em uma cópia.';
$ec_lang['lpn_ff_scope']='Junções a testar';
$ec_lang['lpn_ff_all']='Todas';
$ec_lang['lpn_ff_selected']='Selecionadas';
$ec_lang['lpn_ff_no_junctions']='Este projeto ainda não tem junções, então não há nada para testar.';
$ec_lang['lpn_ff_no_selection']='Nenhuma junção está selecionada. Selecione junções ou escolha Todas as junções.';
$ec_lang['lpn_ff_skipped']='{n} elementos selecionados não são junções, então não foram testados.';
$ec_lang['lpn_ff_required']='Vazão de incêndio exigida';
$ec_lang['lpn_ff_required_tip']='A vazão que seu código de incêndio ou sua autoridade de incêndio exige em um hidrante. Cada junção é testada contra este número, a menos que tenha sua própria vazão de incêndio exigida.';
$ec_lang['lpn_ff_required_own']='Junções com sua própria vazão de incêndio exigida são testadas contra ela. Número delas: {n}.';
$ec_lang['lpn_ff_required_node_tip']='A vazão de incêndio exigida nesta junção em particular, conforme seu código de incêndio ou sua autoridade de incêndio para o uso do solo que ela atende. Deixe em branco e a junção é testada contra o número na caixa Análise de vazão de incêndio.';
$ec_lang['lpn_ff_residual']='Pressão residual a manter';
$ec_lang['lpn_ff_residual_tip']='A pressão que a junção precisa manter enquanto fornece a vazão de incêndio. A AWWA M31 e a NFPA 291 usam 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='Verificação de projeto (efeito no sistema)';
$ec_lang['lpn_ff_design_tip']='Uma pergunta separada de saber se a junção consegue fornecer a vazão: com essa vazão sendo fornecida ali, algo mais cai abaixo de sua pressão mínima ou ultrapassa seu limite de velocidade? Escolher verificar isso não custa cálculo extra.';
$ec_lang['lpn_ff_design_no_selection']='O escopo da verificação de projeto está definido como Selecionadas, mas nenhum elemento está selecionado. Selecione elementos ou escolha a opção Todas.';


$ec_lang['lpn_ff_minpressure']='Menor pressão permitida em outros pontos';
$ec_lang['lpn_ff_minpressure_tip']='Uma junção que cai abaixo deste valor enquanto outra fornece sua vazão de incêndio é reportada como um problema de projeto.';
$ec_lang['lpn_ff_maxvelocity']='Maior velocidade permitida';
$ec_lang['lpn_ff_maxvelocity_tip']='Um trecho funcionando acima deste valor enquanto uma vazão de incêndio é fornecida é reportado como um problema de projeto.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='A vazão de incêndio é fornecida na própria junção. Este é o método usado aqui, e é o método usual. O hidrante, seu ramal e seu bocal não são modelados, então um hidrante real fornece menos que a vazão mostrada aqui.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='Isto é calculado com o solucionador interno.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='Isto é calculado com o motor EPANET.';
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
$ec_lang['lpn_ff_run_title']='Cálculo de vazão de incêndio';
$ec_lang['lpn_ff_calculate']='Executar';
$ec_lang['lpn_ff_stop']='Parar';
$ec_lang['lpn_ff_working']='Calculando: {done} de {total} junções.';
$ec_lang['lpn_ff_stopped']='Interrompido depois de {done} de {total} junções. Os resultados abaixo são os já concluídos.';
$ec_lang['lpn_ff_cost']='Este cálculo resolveu a rede inteira {solves} vezes.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='O desenho mudou, então os resultados de vazão de incêndio foram apagados. Calcule novamente.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='Limpar anéis';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} junções não tiveram nenhum problema. {fire} junções falharam na vazão de incêndio. {design} junções afetaram o resto do sistema.';
$ec_lang['lpn_ff_summary_error']='{n} junções não puderam ser respondidas.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='Todas as junções testadas';
$ec_lang['lpn_ff_col_junction']='Junção';
$ec_lang['lpn_ff_col_static']='Pressão estática';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='A pressão nesta junção antes de qualquer vazão de incêndio ser retirada, com as demandas normais do sistema ainda em funcionamento. Nada é fechado para medi-la, então esta não é uma pressão de vazão zero para o sistema; é a mesma pressão que o mapa mostra nesta junção. Tanto a AWWA M31 quanto a NFPA 291 chamam esta leitura de pressão estática, e é onde um teste de vazão de incêndio começa.';
$ec_lang['lpn_ff_col_available']='Vazão disponível';
$ec_lang['lpn_ff_col_required']='Vazão exigida';
$ec_lang['lpn_ff_col_residual']='Residual mantido';
$ec_lang['lpn_ff_col_atrequired']='Pressão na vazão exigida';
$ec_lang['lpn_ff_col_affected']='Pior efeito';
$ec_lang['lpn_ff_col_limit']='Limite de projeto';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='Não verificado';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='Estática falhou, não verificado';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='Modos de falha';
$ec_lang['lpn_ff_mode_fire']='Incêndio';
$ec_lang['lpn_ff_mode_design']='Projeto';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='Nenhum';
$ec_lang['lpn_ff_col_solves']='Cálculos';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_both']='Pressão e velocidade';
$ec_lang['lpn_ff_atleast']='mais que {flow}';
$ec_lang['lpn_ff_affect_node']='{id} cai para {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} atinge {velocity}';
$ec_lang['lpn_ff_more']='e mais {n} afetados';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} junções a mais não são mostradas.';
$ec_lang['lpn_ff_design_none']='Nada no conjunto escolhido ficou fora de seus limites enquanto qualquer junção fornecia sua vazão de incêndio.';
$ec_lang['lpn_ff_design_off_note']='O efeito no resto do sistema não foi verificado neste cálculo.';
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
$ec_lang['lpn_ff_iso']='O Insurance Services Office (ISO) credita a um único hidrante no máximo {flow}. Esse limite de crédito não foi aplicado aqui porque não sabemos quantos hidrantes um nó pode representar.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='Já abaixo do residual antes de qualquer vazão de incêndio ser fornecida';
$ec_lang['lpn_ff_err_converge']='A rede não convergiu.';
$ec_lang['lpn_ff_err_solve']='O solucionador reportou um erro e não deu resposta.';
$ec_lang['lpn_ff_err_not_junction']='Não é uma junção';
$ec_lang['lpn_ff_err_unknown']='Nenhuma resposta. O código reportado foi {code}.';

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
$ec_lang['lpn_file_import_survey']='Importar pontos levantados…';
$ec_lang['lpn_file_import_survey_tip']='Lê uma lista de pontos levantados de um arquivo de texto e cria uma junção em cada ponto, usando as configurações de novo elemento para tudo que o arquivo não informa. Nenhum tubo é desenhado, e nenhuma linha é descartada sem ser nomeada. Ele lê o sistema de coordenadas que este projeto já usa, georreferenciado ou não.';
$ec_lang['lpn_survey_read_error']='Esse arquivo não pôde ser lido do seu disco.';
$ec_lang['lpn_survey_cancelled']='Nada foi criado e nada foi alterado.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='Norte';
$ec_lang['lpn_survey_axis_east']='Este';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='Esse arquivo não tem nada nele.';
$ec_lang['lpn_survey_err_unreadable']='Esse arquivo não pôde ser lido como uma lista de pontos levantados.';
$ec_lang['lpn_survey_err_ambiguous_coord']='Mais de uma coluna nesse arquivo poderia ser o {axis} ({detail}), e esta página não vai escolher entre elas. Deixe apenas uma delas nomeada como {axis} e tente novamente.';
$ec_lang['lpn_survey_err_no_points']='Nenhuma linha desse arquivo pôde ser lida como um ponto levantado. Linhas lidas: {detail}';
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
$ec_lang['lpn_survey_format_label']='Formato do arquivo:';
$ec_lang['lpn_survey_format_internal']='especificado internamente';
$ec_lang['lpn_survey_create']='Criar nós';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='A primeira linha foi ignorada: ela não nomeia nenhuma coluna que esta página conheça.';
$ec_lang['lpn_survey_type_label']='Tipo de elemento:';
$ec_lang['lpn_survey_confirm_junction']='{n} junção(ões) encontrada(s). Continuar?';
$ec_lang['lpn_survey_confirm_reservoir']='{n} reservatório(s) encontrado(s). Continuar?';
$ec_lang['lpn_survey_confirm_tank']='{n} tanque(s) encontrado(s). Continuar?';
$ec_lang['lpn_survey_report_junction']='{n} junção(ões) importada(s), {m} com elevação.';
$ec_lang['lpn_survey_report_reservoir']='{n} reservatório(s) importado(s), {m} com elevação.';
$ec_lang['lpn_survey_report_tank']='{n} tanque(s) importado(s), {m} com elevação.';
$ec_lang['lpn_survey_report_clean']='Cada ponto do arquivo foi importado, e nada foi alterado no processo.';
$ec_lang['lpn_survey_report_notes']='Erros e notas da importação:';
$ec_lang['lpn_survey_sev_error']='erro';
$ec_lang['lpn_survey_sev_warning']='aviso';
$ec_lang['lpn_survey_note_line']='Linha {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='Poucas colunas para o formato de arquivo acima.';
$ec_lang['lpn_survey_note_coord_missing']='A célula de {axis} está vazia.';
$ec_lang['lpn_survey_note_bad_coord']='O {axis} não é lido como um número.';
$ec_lang['lpn_survey_note_coord_range']='O {axis} está fora do intervalo que este projeto permite.';
$ec_lang['lpn_survey_note_bad_elev']='Elevação não numérica. Importado sem elevação.';
$ec_lang['lpn_survey_note_ambiguous_elev']='Mais de uma coluna poderia ser a elevação, então nenhuma delas foi lida.';
$ec_lang['lpn_survey_note_blank_rows']='Linhas em branco ignoradas: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='Nome já usado antes neste arquivo, novo nome atribuído.';
$ec_lang['lpn_survey_note_id_taken']='Nome já existe no projeto, novo nome atribuído.';
$ec_lang['lpn_survey_note_id_invalid']='Nome não pode ser usado aqui, novo nome atribuído.';
$ec_lang['lpn_hotkeys_menu_heading']='Menus';
$ec_lang['lpn_hotkeys_menu_term']='Atalhos de teclado dos menus';
$ec_lang['lpn_hotkeys_menu_def']='<table class="lpn-notes-table"><tbody><tr><td>Alt+Shift+letra</td><td>Abre o menu com essa letra; depois pressione a letra de uma linha para escolhê-la. As letras aparecem enquanto você usa o teclado. No Mac, use Ctrl+Option.</td></tr><tr><td>F10</td><td>Ir para a barra de menus.</td></tr></tbody></table>';
$ec_lang['lpn_graphs_menu']='Gráficos';
$ec_lang['lpn_contour_menu']='Isolinhas';
$ec_lang['lpn_contour_tip']='Mostra um mapa de isolinhas: as cores dos nós se espalham ao longo e ao lado dos tubos, com isolinhas rotuladas. Abre uma caixa para ajustá-lo ou desativá-lo.';
$ec_lang['lpn_contour_plot']='Mapa de isolinhas';
$ec_lang['lpn_contour_fill']='Preenchimento';
$ec_lang['lpn_contour_fill_tip']='Suave mistura as cores de uma classe para a seguinte. Faixas pinta cada classe da legenda de cores com uma cor uniforme.';
$ec_lang['lpn_contour_fill_smooth']='Suave';
$ec_lang['lpn_contour_fill_bands']='Faixas';
$ec_lang['lpn_contour_opacity']='Opacidade do preenchimento';
$ec_lang['lpn_contour_lines']='Isolinhas';
$ec_lang['lpn_contour_interval']='Intervalo';
$ec_lang['lpn_contour_buffer']='Alcance';
$ec_lang['lpn_contour_buffer_unit']='× comprimento mediano dos tubos';
$ec_lang['lpn_contour_buffer_tip']='Até onde a cor alcança a partir de cada tubo, como múltiplo do comprimento mediano dos tubos. Ela se esmaece na parte externa.';
$ec_lang['lpn_contour_few']='Nós insuficientes para traçar isolinhas.';
$ec_lang['lpn_contour_support']='Mapa de isolinhas: {n} nós, interpolados ao longo de {p} tubos e até {k} vezes o comprimento mediano dos tubos ao lado deles. Sem cor através de bombas, válvulas ou trechos fechados.';
$ec_lang['lpn_contour_support_lines']='Isolinhas a cada {i} {u}.';
$ec_lang['lpn_contour_too_many']='Isolinhas demais neste intervalo; aumente-o para desenhá-las.';
$ec_lang['lpn_contour_dem']='Terreno entre os nós a partir do DEM do Mapbox';
$ec_lang['lpn_contour_dem_tip']='Entre os nós, a pressão passa a ser a carga interpolada menos a altura do terreno do DEM do Mapbox, e por isso pode cair abaixo da menor pressão dos nós em um morro onde a rede não tem nenhum nó. Trate o terreno como um mapa de curvas de nível, não como um levantamento topográfico.';
$ec_lang['lpn_contour_support_dem']='Entre os nós, a pressão é a carga interpolada menos a elevação do terreno do DEM do Mapbox, amostrada aproximadamente a cada {m} m.';
$ec_lang['lpn_contour_dem_failed']='Não foi possível ler o terreno do DEM do Mapbox, então a pressão é interpolada somente entre os nós.';
$ec_lang['lpn_contour_consent_1']='Desenhar a pressão sobre o terreno envia a área coberta pela sua rede, como números de blocos de mapa do Mapbox, para api.mapbox.com, para ler a altura do terreno ali.';
$ec_lang['lpn_contour_consent_2']='Esta é uma questão diferente das imagens do mapa atrás do seu projeto. As imagens dizem apenas para onde você está olhando. Estes blocos dizem onde está a sua rede. O Mapbox receberá esses números de blocos e o seu endereço IP. Não enviamos mais nada: nenhum nome, nenhum tubo, nenhum projeto. Não guardamos nenhum registro disso, e nada é armazenado neste dispositivo além da sua resposta a esta pergunta.';
$ec_lang['lpn_contour_consent_3']='Podemos enviar ao Mapbox os números de blocos da área da sua rede?';
$ec_lang['lpn_contour_consent_4']='Se você disser não, tudo o mais nesta página continua funcionando exatamente como agora, e o mapa de isolinhas é desenhado somente entre os nós. Lembramos de um sim para não precisar perguntar de novo. Um não não é armazenado de forma alguma.';
$ec_lang['lpn_sysflow_menu']='Balanço de vazões';
$ec_lang['lpn_sysflow_tip']='Traça a vazão total produzida e a vazão total consumida ao longo do tempo, na simulação de período estendido. Os tanques não entram em nenhum dos totais; onde as duas linhas se separam, os tanques estão enchendo ou esvaziando.';
$ec_lang['lpn_sysflow_produced']='Produzida';
$ec_lang['lpn_sysflow_produced_tip']='Vazão total que entra na rede vinda de reservatórios e de demandas negativas.';
$ec_lang['lpn_sysflow_consumed']='Consumida';
$ec_lang['lpn_sysflow_consumed_tip']='Soma de toda demanda positiva: a água retirada da rede nas junções e qualquer vazão que entre em um reservatório.';
$ec_lang['lpn_copy_title']='Marcar o arquivo como nova cópia?';
$ec_lang['lpn_copy_body']='Este arquivo diz que foi criado em {date}, e este navegador não o reconhece. Este é o arquivo Original (manter o mesmo bloqueio) ou uma Cópia (criar novo bloqueio)?';
$ec_lang['lpn_copy_body_nodate']='Este navegador não reconhece este arquivo. Este é o arquivo Original (manter o mesmo bloqueio) ou uma Cópia (criar novo bloqueio)?';
$ec_lang['lpn_copy_original']='Original; manter o mesmo bloqueio';
$ec_lang['lpn_copy_copy']='Uma cópia; criar novo bloqueio';
$ec_lang['lpn_copy_kept_link']='{name} foi aberto como o original, movido para outro local. Agora Salvar grava neste arquivo.';
$ec_lang['lpn_copy_opened']='{file} foi aberto como uma cópia, com um novo bloqueio próprio que será salvo na próxima gravação do arquivo.';
$ec_lang['lpn_scenario_basic']='Modo básico';
$ec_lang['lpn_scenario_basic_tip']='Marcado, um cenário é simplesmente os valores que você define nele. Desmarcado, este menu também oferece a tabela de prévia de Alternativas, que mostra como esses valores são agrupados por categoria e convida você a dar sua opinião.';
$ec_lang['lpn_alt_title']='Prévia de Alternativas';
$ec_lang['lpn_alt_note']='Somente leitura. A Base usa a alternativa Base de todas as categorias. Cada cenário recebe sua própria alternativa para toda categoria que seja alterada, filha da alternativa Base. O número é a quantidade de valores alterados que ela tem.';
$ec_lang['lpn_alt_cat_physical']='Físico';
$ec_lang['lpn_alt_cat_demand']='Demanda';
$ec_lang['lpn_alt_cat_topology']='Ativação de elementos';
$ec_lang['lpn_alt_cat_initial']='Configurações iniciais';
$ec_lang['lpn_alt_cat_constituent']='Constituinte';
$ec_lang['lpn_alt_cat_fireflow']='Vazão de incêndio';
$ec_lang['lpn_alt_cat_energy']='Custo de energia';
$ec_lang['lpn_alt_cat_userdata']='Propriedades personalizadas';
$ec_lang['lpn_alt_cat_text']='Texto';
$ec_lang['lpn_reports_calib']='Calibração';
$ec_lang['lpn_reports_calib_tip']='Compara dados medidos em campo, de um arquivo de calibração, com a última execução: estatísticas, um gráfico de correlação e comparações de médias.';
$ec_lang['lpn_calib_title']='Relatório de calibração';
$ec_lang['lpn_calib_param']='Parâmetro';
$ec_lang['lpn_calib_param_tip']='A grandeza que o arquivo de calibração mede. Um arquivo é mantido para cada parâmetro.';
$ec_lang['lpn_calib_load']='Carregar arquivo de calibração…';
$ec_lang['lpn_calib_load_tip']='Um arquivo de texto com um ID de local, um horário e um valor medido em cada linha. O horário é contado a partir do início da simulação, em horas decimais ou horas:minutos. Um ponto e vírgula inicia um comentário. Uma linha com apenas um horário e um valor pertence ao local acima dela.';
$ec_lang['lpn_calib_none']='Nenhum arquivo de calibração está carregado para este parâmetro.';
$ec_lang['lpn_calib_session']='Um arquivo de calibração é mantido somente nesta sessão. Ele não é salvo com o projeto nem neste dispositivo.';
$ec_lang['lpn_calib_file']='{file}: {n} medições em {m} locais.';
$ec_lang['lpn_calib_units']='Os valores do arquivo são lidos nas unidades deste projeto: {unit}.';
$ec_lang['lpn_calib_missing']='Citados no arquivo, mas ausentes desta rede: {ids}.';
$ec_lang['lpn_calib_missing_count']='Medições ignoradas porque o local não está nesta rede: {n}.';
$ec_lang['lpn_calib_bad_lines']='Linhas que não puderam ser lidas, ignoradas: {lines}';
$ec_lang['lpn_calib_outside']='Medições fora dos horários reportados por esta execução, ignoradas: {n}.';
$ec_lang['lpn_calib_no_value']='Medições sem valor calculado no seu horário, ignoradas: {n}.';
$ec_lang['lpn_calib_single']='Esta é uma execução de período único, então cada medição é comparada com o seu único resultado, qualquer que seja o horário indicado no arquivo.';
$ec_lang['lpn_calib_needs_run']='Ainda não há resultados para comparar. O relatório é preenchido depois que a rede for calculada.';
$ec_lang['lpn_calib_no_pairs']='Nenhuma medição pôde ser comparada, então não há nada para traçar.';
$ec_lang['lpn_calib_tab_stats']='Estatísticas';
$ec_lang['lpn_calib_tab_corr']='Gráfico de correlação';
$ec_lang['lpn_calib_tab_means']='Comparação de médias';
$ec_lang['lpn_calib_col_location']='Local';
$ec_lang['lpn_calib_col_n']='Nº obs.';
$ec_lang['lpn_calib_col_obs_mean']='Média observada';
$ec_lang['lpn_calib_col_sim_mean']='Média calculada';
$ec_lang['lpn_calib_col_mean_err']='Erro médio';
$ec_lang['lpn_calib_col_mean_err_tip']='A média das diferenças absolutas entre cada valor observado e o valor calculado no mesmo horário.';
$ec_lang['lpn_calib_col_rms_err']='Erro RMS';
$ec_lang['lpn_calib_col_rms_err_tip']='Raiz do erro quadrático médio: a raiz quadrada da média dos quadrados das diferenças entre os valores observados e calculados.';
$ec_lang['lpn_calib_network']='Rede';
$ec_lang['lpn_calib_corr_means']='Correlação entre as médias: {r}';
$ec_lang['lpn_calib_corr_none']='Correlação entre as médias: exige pelo menos dois locais cujas médias sejam diferentes.';
$ec_lang['lpn_calib_axis_obs']='Observado: {q}';
$ec_lang['lpn_calib_axis_sim']='Calculado: {q}';
$ec_lang['lpn_calib_observed']='Observado';
$ec_lang['lpn_calib_computed']='Calculado';
$ec_lang['lpn_calib_point']='{id}, {time}: observado {o}, calculado {s}';
$ec_lang['lpn_calib_corr_note']='Cada ponto é uma medição. Quanto mais perto da linha diagonal estiverem os pontos, mais os valores calculados coincidem com os observados.';
$ec_lang['lpn_calib_ts_point']='Medido em {id}, {time}: {v}';
$ec_lang['lpn_calib_ts_note']='Os anéis são valores medidos do arquivo de calibração.';
$ec_lang['lpn_analyze_menu']='Analisar';
$ec_lang['lpn_analyze_menu_tip']='Análises que executam a rede em uma cópia: vazão de incêndio em cada junção, a perda de cada tubo, bomba e válvula, e as demandas aumentadas ou reduzidas.';
$ec_lang['lpn_ff_design_off']='Nenhuma';
$ec_lang['lpn_ff_design_all']='Todos';
$ec_lang['lpn_ff_design_selected']='Selecionados';
$ec_lang['lpn_ff_rows_more_links']='Trechos não mostrados: {n}.';
$ec_lang['lpn_crit_menu']='Análise de criticidade…';
$ec_lang['lpn_crit_menu_tip']='Retira da rede, um de cada vez, cada tubo, bomba e válvula, e mostra o que o sistema perde.';
$ec_lang['lpn_crit_title']='Análise de criticidade';
$ec_lang['lpn_crit_intro']='Cada elemento é retirado da rede, um de cada vez, e a rede é resolvida no horário que está na tela, no cenário ativo. Nada no seu projeto é alterado; toda a execução é feita em uma cópia.';
$ec_lang['lpn_crit_scope']='Trechos a interromper';
$ec_lang['lpn_crit_scope_tip']='Todos os tubos, bombas e válvulas, ou somente os selecionados no mapa. Escolha o conjunto antes de executar.';
$ec_lang['lpn_crit_scope_all']='Todos os trechos';
$ec_lang['lpn_crit_scope_selected']='Trechos selecionados';
$ec_lang['lpn_crit_minpressure']='Menor pressão permitida';
$ec_lang['lpn_crit_minpressure_tip']='É o mesmo número de Menor pressão permitida em outros pontos na Análise de vazão de incêndio. Mudá-lo aqui o muda lá.';
$ec_lang['lpn_crit_col_asset']='Elemento';
$ec_lang['lpn_crit_col_unserved']='Demanda não atendida';
$ec_lang['lpn_crit_col_cutoff']='Junções isoladas';
$ec_lang['lpn_crit_col_below']='Junções abaixo do mínimo';
$ec_lang['lpn_crit_summary']='{n} de {total} elementos deixam demanda sem atendimento ou levam uma junção abaixo de {pressure}.';
$ec_lang['lpn_crit_baseline_below']='Junções que já estão abaixo dele sem nada interrompido: {n}. Elas não são contadas.';
$ec_lang['lpn_crit_working']='Calculando: {done} de {total} elementos.';
$ec_lang['lpn_crit_stopped']='Interrompido depois de {done} de {total} elementos. Os resultados abaixo são os já concluídos.';
$ec_lang['lpn_crit_no_selection']='Nenhum trecho está selecionado. Selecione trechos ou escolha Todos os trechos.';
$ec_lang['lpn_crit_no_links']='Este projeto ainda não tem trechos, então não há nada para interromper.';
$ec_lang['lpn_crit_busy']='Outra análise está em execução. Pare-a ou espere que termine.';
$ec_lang['lpn_crit_skipped']='{n} elementos selecionados não são trechos, então não foram interrompidos.';
$ec_lang['lpn_crit_stale']='O desenho mudou, então os resultados da criticidade foram apagados. Execute novamente.';
$ec_lang['lpn_crit_skipdead']='Ignorar pontas secas';
$ec_lang['lpn_crit_skipdead_tip']='Um trecho de ponta seca é aquele cuja remoção isola junções que só podem ser alcançadas por ele, sem reservatório nem tanque além dele. Sua perda é tudo o que está além, então ele não é resolvido. O resumo informa quantos foram ignorados.';
$ec_lang['lpn_crit_skipped_dead']='Trechos de ponta seca ignorados: {n}. Cada um isola tudo o que está além dele.';
