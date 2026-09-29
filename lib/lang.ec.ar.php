<?php

// All missing text declarations will fall back to English.

$ec_lang['u_depthFrac']='كسر';
$ec_lang['u_depthPercent']='%';
$ec_lang['u_ft2']='ft^2';
$ec_lang['u_ft3ps']='cfs';
$ec_lang['u_ft']='ft';
$ec_lang['u_fth2o']='ft H2O';
$ec_lang['u_ftps']='ft/ث';
$ec_lang['u_gpm']='gpm';
$ec_lang['u_gradePercent']='% ارتفاع/امتداد';
$ec_lang['u_grade']='ارتفاع/امتداد';
$ec_lang['u_in2']='بوصة مربعة';
$ec_lang['u_inh2o']='in H2O';
$ec_lang['u_in']='بوصة';
$ec_lang['u_knpcm2']='kN/cm^2';
$ec_lang['u_knpm2']='kN/m^2';
$ec_lang['u_kpa']='kPa';
$ec_lang['u_lps']='ل/ث';
$ec_lang['u_m2']='م^2';
$ec_lang['u_m3ps']='م^3/ث';
$ec_lang['u_mgd']='MGD';
$ec_lang['u_imgd']='IMGD (إمبراطوري)';
$ec_lang['u_afd']='ac-ft/يوم';
$ec_lang['u_lpm']='ل/د';
$ec_lang['u_cmh']='m^3/h';
$ec_lang['u_cmd']='م^3/يوم';
$ec_lang['u_mh2o']='م ماء';
$ec_lang['u_mld']='ML/يوم';
$ec_lang['u_m']='م';
$ec_lang['u_mm2']='مم^2';
$ec_lang['u_mmh2o']='مم ماء';
$ec_lang['u_mm']='مم';
$ec_lang['u_mps']='م/ث';
$ec_lang['u_npm2']='N/m^2';
$ec_lang['u_pa']='Pa';
$ec_lang['u_psf']='psf';
$ec_lang['u_psi']='psi';
$ec_lang['u_bar']='بار';
$ec_lang['u_kgfcm2']='كجم قوة/سم²';
$ec_lang['u_s']='ث';
$ec_lang['u_hr']='س';
$ec_lang['u_day']='يوم';
$ec_lang['u_lph']='ل/س';
$ec_lang['u_gph']='غال/س';
$ec_lang['u_mmph']='مم/س';
$ec_lang['u_inph']='بوصة/س';
$ec_lang['u_acft']='أكر-قدم';
$ec_lang['u_ft3']='ft^3';
$ec_lang['u_m3']='م^3';
$ec_lang['u_kw']='kW';
$ec_lang['u_mw']='MW';
$ec_lang['u_kwh_yr']='kWh/سنة';
$ec_lang['u_mwh_yr']='MWh/سنة';
$ec_lang['u_hp']='hp';
$ec_lang['u_m2ps']='م^2/ث';
$ec_lang['u_ft2ps']='cfs/ft';

// Page text
// In page order for easiest maintenance.
// Menu and General
$ec_lang['menu_brand']='حاسبات HawsEDC';
$ec_lang['menu_main_hydraulics']='الهيدروليكا';
$ec_lang['menu_help']='مساعدة';
$ec_lang['menu_libre']='برمجيات حرة';
$ec_lang['template_welcome']='اتركوا مخاوفكم عند الباب؛ هنا نتحدث بالمحبة. أنتم لا تدمرون كل شيء. استمتعوا أيضاً بـ<a target="_blank" href="https://hawsedc.com/download.php">أدوات HawsEDC المجانية لـ AutoCAD.</a>';
$ec_lang['template_feedback']='هل يمكنكم اقتراح صياغة أفضل لهذه الصفحة أو أي شيء آخر؟ هل ترغبون في المساعدة أو في تعلّم إنشاء أدوات مثل هذه؟ يرجى التواصل معي.';
$ec_lang['template_printable_title']='عنوان للطباعة';
$ec_lang['template_printable_subtitle']='عنوان فرعي للطباعة';
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
$ec_lang['consent_body']='هل تسمح لنا بالاحتفاظ برقم واحد لكل صفحة في تخزين ملف تعريف هذا المتصفح لمنع تسجيل زياراته بشكل متكرر؟';
$ec_lang['consent_accept']='الموافقة هذه المرة';
$ec_lang['consent_accept_all']='الموافقة دائماً';
$ec_lang['consent_decline']='رفض دائماً';
$ec_lang['consent_current_granted']='لقد وافقت على هذا. نحن نحدّ من التسجيل لملف تعريف هذا المتصفح.';
$ec_lang['consent_current_denied']='لقد رفضت هذا. لا نخزّن شيئاً للحد من التسجيل لملف تعريف هذا المتصفح.';
$ec_lang['consent_region_label']='اختيارك بشأن الحد من التسجيل.';
$ec_lang['consent_settings_link']='إعدادات ملفات تعريف الارتباط';
$ec_lang['privacy_link']='إشعار الخصوصية';
$ec_lang['terms_link']='شروط الاستخدام';
$ec_lang['index_main_title']='حاسبات هندسية مجانية عبر الإنترنت';
$ec_lang['index_meta_desc_plain']='حاسبات هندسة هيدروليكية مجانية للأنابيب والقنوات والسدود والري. تعمل في متصفحك، دون اتصال بالإنترنت، وهي متاحة بـ27 لغة.';
$ec_lang['calc_set_units']='تحديد الوحدات:';
$ec_lang['calc_set_units_tip']='يضبط وحدة كل حقل دفعة واحدة. غير إتلافي: الأرقام التي كتبتها تبقى كما هي تماماً، وكل رقم يُقرأ الآن بالوحدة الجديدة. الرقم 6 يبقى 6، لكنه يعني الآن 6 إنش بدلاً من 6 ملم.';
$ec_lang['calc_units_us']='US';
$ec_lang['calc_units_si']='SI';
$ec_lang['calc_defaults']='استعادة الافتراضي';
$ec_lang['calc_defaults_confirm']='إعادة تعيين الحاسبة إلى القيم الافتراضية؟';
$ec_lang['points_data_note']='(أو نسخ/لصق باستخدام منطقة البيانات)';
$ec_lang['points_data_heading']='بيانات النقاط<br />(مفصولة بفاصلة أو مسافة جدولة)';
$ec_lang['points_data_copy']='نسخ';
$ec_lang['points_data_paste']='لصق';
$ec_lang['calc_inputs']='المدخلات';
$ec_lang['calc_results']='النتائج';
$ec_lang['view_hide_line']='إخفاء هذا السطر';
$ec_lang['view_printable']='نسخة قابلة للطباعة (أعد التحميل للاستعادة)';
$ec_lang['ec_name_label']='احفظ هذا الحساب:';
$ec_lang['ec_name_placeholder']='الاسم';
$ec_lang['ec_name_tip']='يحفظ المدخلات في عنوان URL للإشارات المرجعية واسترجاع السجل والمشاركة';
$ec_lang['calc_copy_link']='نسخ الرابط';
$ec_lang['ec_related_calcs']='حاسبات ذات صلة:';
$ec_lang['calc_copy_link_done']='تم النسخ!';
// Darcy-Weisbach. See mphl_ for missing text.
$ec_lang['dw_main_menu']='فاقد الضغط في الأنابيب — داركي-وايسباخ';
$ec_lang['dw_main_title']='حاسبة فاقد الضغط في الأنابيب داركي-وايسباخ المجانية عبر الإنترنت';
$ec_lang['dw_main_desc']='فاقد الضغط في الأنابيب بداركي-وايسباخ عند قطر وخشونة وتدفق معلومة';
$ec_lang['dw_roughness']='e';
$ec_lang['dw_roughness_tip']='ارتفاع الخشونة المطلقة، e، لجدار الأنبوب. قيم نموذجية: الفولاذ (جديد) 0.046 مم، الفولاذ (مستعمل) 0.15 مم، HDPE 0.003 مم، PVC/uPVC 0.0015 مم، الخرسانة 0.3–3 مم.';
$ec_lang['dw_kinematic_viscosity']='<span class="ec-help" title="1×10⁻⁶ m²/s للماء النظيف عند 20°C">اللزوجة الحركية، ν <span class="ec-tip">?</span></span>';
$ec_lang['dw_kinematic_viscosity_short']='اللزوجة الحركية، ν';
$ec_lang['dw_kinematic_viscosity_tip']='1×10⁻⁶ m²/s للماء النظيف عند 20°C';
$ec_lang['dw_reynolds_number']='رقم رينولدز، Re';
$ec_lang['dw_flow_regime']='نظام الجريان';
$ec_lang['dw_regime_laminar']='صفحي';
$ec_lang['dw_regime_transitional']='انتقالي';
$ec_lang['dw_regime_turbulent']='مضطرب';
$ec_lang['dw_friction_factor_method']='طريقة معامل الاحتكاك';
$ec_lang['dw_friction_factor']='معامل الاحتكاك، f';
// Hazen-Williams. See mphl_ for missing text.
$ec_lang['hw_main_menu']='فاقد الضغط في الأنابيب — هيزن-وليامز';
$ec_lang['hw_main_title']='حاسبة فاقد الضغط في الأنابيب هيزن-وليامز المجانية عبر الإنترنت';
$ec_lang['hw_main_desc']='فاقد الضغط في الأنابيب بهيزن-وليامز عند قطر وخشونة وتدفق معلومة';
$ec_lang['hw_hgl_1']='خط المتدرج الهيدروليكي المصبّ';
$ec_lang['hw_hgl_2']='خط المتدرج الهيدروليكي المنبع';
$ec_lang['hw_elev_up']='منسوب المنبع';
$ec_lang['hw_pressure_up']='ضغط المنبع';
$ec_lang['hw_elev_down']='منسوب المصب';
$ec_lang['hw_pressure_down']='ضغط المصب';
$ec_lang['hw_pressure_check']='فحص الضغط';
$ec_lang['hw_pressure_ok_short']='ضغط موجب';
$ec_lang['hw_pressure_neg_short']='ضغط سالب';
$ec_lang['hw_pressure_neg']='ضغط المصب أقل من الصفر. ينخفض خط المتدرج الهيدروليكي عن مستوى الأنبوب، لذا لن يجري الأنبوب ممتلئاً، وقد لا تكون هذه النتيجة صالحة.';
$ec_lang['hw_roughness']='معامل هيزن-وليامز، C';
$ec_lang['hw_note_1']='<dl><dt>لا تُمثِّل هذه الحاسبة مسار الأنبوب (البروفايل) بين الطرفين.</dt><dd>تستخدم فقط منسوبَي المنبع والمصب اللذين تُدخلهما. إذا ارتفع سطح الأرض عن أي من الطرفين في نقطة ما بينهما، فإن الضغط عند تلك النقطة المرتفعة يكون أقل من أي ضغط مذكور هنا. أعد تشغيل الحاسبة لطول القطعة من طرف المنبع حتى تلك النقطة المرتفعة للتحقق منها.</dd><dd>حيثما ينخفض خط المتدرج الهيدروليكي عن مستوى الأنبوب، يكون الماء تحت ضغط سالب. يخرج الهواء من المحلول، ويمكن أن ينهار الأنبوب رقيق الجدار، وقد تتسرب مياه جوفية ملوثة عبر الوصلات. حافظ على أن يبقى الخط تحت ضغط موجب في كل مكان، وفكّر في تركيب صمام هواء عند كل نقطة مرتفعة.</dd><dt>ضغط المنبع هو شرط حدّي (Boundary Condition) تُدخله أنت.</dt><dd>اقرأه من مقياس ضغط، أو من منسوب الماء في خزان (ارتفاع الماء فوق الأنبوب)، أو من منحنى المضخة. تُعطي المضخة ضغطاً أقل كلما ارتفع التدفق، لذا استخدم النقطة على المنحنى التي تطابق التدفق المُدخل أعلاه.</dd><dt>اجمع معاملات الفواقد الموضعية (Minor Losses) بنفسك.</dt><dd>اجمع قيم K لكل صمام وانحناء ووصلة تفرع (Tee) وعداد ومدخل على الخط، وأدخل المجموع. اتبع الرابط عند هذا الحقل للحصول على القيم النموذجية. في خط النقل الرئيسي الطويل تكون هذه الفواقد صغيرة مقارنة بفاقد الاحتكاك، لكن في أنابيب المحطة القصيرة قد تشكل معظم الفاقد.</dd></dl>';


// Manning Irregular
$ec_lang['mi_menu']='قناة غير منتظمة المقطع — مانينغ';
$ec_lang['mi_main_title']='الحاسبة المجانية عبر الإنترنت لقناة مانينغ غير المنتظمة المقطع';
$ec_lang['mi_main_desc']='حاسبة الجريان المنتظم بمعادلة مانينغ في قناة غير منتظمة المقطع';
$ec_lang['mi_waterSurfaceElevation']='منسوب سطح الماء';
$ec_lang['mi_q_617']='<span class="ec-help" title="التدفق المركّب Q، باستخدام معامل خشونة مانينغ المركّب n لكل منطقة وفق معادلة تشاو 6-17، بافتراض تساوي السرعات">Q <span class="ec-tip">؟</span></span>';
$ec_lang['mi_xSecPoints']='نقاط المقطع العرضي';
$ec_lang['mi_groupPoint']='نقطة';
$ec_lang['mi_groupSegment']='قطعة';
$ec_lang['mi_groupRegion']='منطقة';
$ec_lang['mi_station']='مسافة';
$ec_lang['mi_elevation']='منسوب';
$ec_lang['mi_n']='n';
$ec_lang['mi_is_bank']='حد منطقة R<sub>h</sub>، Q (ضفة)';
$ec_lang['mi_tau']='إجهاد القص القاعي τ';
$ec_lang['mi_t']='T';
$ec_lang['mi_pw']='P<sub>w</sub>';
$ec_lang['mi_a']='A';
$ec_lang['mi_rh']='R<sub>h</sub>';
$ec_lang['mi_n617']='n<br />مركّب';
$ec_lang['mi_v617']='v';
$ec_lang['mi_fr617']='Fr';
$ec_lang['mi_hv617']='h<sub>v</sub>';
$ec_lang['mi_q617']='Q';
$ec_lang['mi_notes_1_term']='n المركّب';
$ec_lang['mi_notes_1_def']='تتبع هذه الحاسبة الدليل المرجعي لبرنامج HEC-RAS في حساب معامل الخشونة المركّب n للمنطقة، باستخدام تشاو (Chow) 1959، الصفحة 136، المعادلة 6-17 (وليست 6-18).';


$ec_lang['mi_notes_2_term']='تبطين الصخور';
$ec_lang['mi_notes_2_def']='استخدم حاسبة قناة مانينغ شبه المنحرفة لتصميم تبطين الصخور. هذه الحاسبة أنسب للمقاطع الطبيعية.';
// Manning Pipe Flow
$ec_lang['mpf_main_menu']='جريان في الأنابيب — مانينغ';
$ec_lang['mpf_main_title']='حاسبة جريان الأنابيب بمانينغ المجانية عبر الإنترنت';
$ec_lang['mpf_main_desc']='جريان منتظم في الأنابيب بمعادلة مانينغ عند ميل وعمق معلومَين';
$ec_lang['mpf_pipe_diameter']='قطر الأنبوب، d<sub>0</sub>';
$ec_lang['mpf_manningRoughness']='معامل خشونة مانينغ، n';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../frictionslope.php">ميل الاحتكاك، S<sub>f</sub></a><span class="ec-help" title="يساوي أحياناً ميل الأنبوب. اتبع الرابط للحصول على شرح (باللغة الإنجليزية فقط)."><span class="ec-tip">?</span></span>';
$ec_lang['mpf_depth_ratio']='نسبة عمق الجريان، y/d<sub>0</sub>';
$ec_lang['mpf_flow']='التدفق، Q';
$ec_lang['mpf_flow_tip']='يُحسب التدفق والعمق بافتراض أنبوب لانهائي الطول. للحصول على هذا التدفق داخل الأنبوب فعلياً، قد يلزم عمق مياه أعلى عند المدخل. راجع الملاحظات أدناه للتفاصيل ومقطع فيديو تعليمي.';
$ec_lang['mpf_velocity']='السرعة، v';
$ec_lang['mpf_velocity_head']='<span class="ec-help" title="طاقة حركية معبَّر عنها كارتفاع لعمود الماء، v²/2g">الرأس الحركي، h<sub>v</sub> <span class="ec-tip">؟</span></span>';
$ec_lang['mpf_flow_area']='مساحة الجريان، A';
$ec_lang['mpf_pipe_area']='مساحة الأنبوب، A<sub>0</sub>';
$ec_lang['mpf_area_ratio']='المساحة النسبية، A/A<sub>0</sub>';
$ec_lang['mpf_wetted_perimeter']='المحيط المبلل، P<sub>w</sub>';
$ec_lang['mpf_hydraulic_radius']='نصف القطر الهيدروليكي، R<sub>h</sub>';
$ec_lang['mpf_top_width']='العرض العلوي، T';
$ec_lang['mpf_froude_number']='رقم فرود، Fr';
$ec_lang['mpf_shear_stress']='متوسط إجهاد القص، τ';
$ec_lang['mpf_full_flow']='الجريان الكامل، Q<sub>0</sub>';
$ec_lang['mpf_full_flow_ratio']='النسبة إلى الجريان الكامل، Q/Q<sub>0</sub>';
$ec_lang['mpf_note_1']='<dl><dt>هذا هو الجريان والعمق داخل أنبوب <em>لانهائي الطول</em>.</dt><dd>قد يتطلب إدخال الجريان إلى الأنبوب منسوب مياه مرتفعاً بشكل كبير. أضف ما لا يقل عن 1.5 ضعف الرأس الحركي للحصول على منسوب المياه، أو <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">راجع درسي القصير مدته دقيقتان</a> لحسابات منسوب مياه الداخل للعبارات القياسية باستخدام <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>، البرنامج المجاني لتصميم العبّارات من إدارة الطرق السريعة الفيدرالية الأمريكية.</dd>';
$ec_lang['mpf_sewer_ref']='<dl><dt>هل تُصمِّم شبكة صرف صحي؟</dt><dd>راجع <a target="_blank" href="/sewslope.php">جداول الحد الأدنى لانحدار مجاري الصرف الصحي</a> لأنابيب من 4 إلى 96 إنش (100 إلى 2400 مم)، معطاة بوحدات م/م ومم/م والنسبة المئوية، ودراسة <a target="_blank" href="/peakfact.php">معاملات الذروة للتدفقات المنخفضة جداً</a>. كلا المرجعين متاحان باللغة الإنجليزية فقط.</dd></dl>';
$ec_lang['mpf_solver_enter_positive_q']='أدخل قيمة موجبة لـ Q المستهدف.';
$ec_lang['mpf_solver_no_solution']='لا يوجد حل: تتجاوز Q سعة الأنبوب عند y/d0 = 93.8% (Qmax = {qmax} بالوحدات المختارة).';
$ec_lang['mpf_solve_btn']='احسب';
$ec_lang['mpf_solve_for_flow']='للتدفق، Q =';
// Manning Pipe Head Loss. See mpf_ for missing text.
$ec_lang['mphl_main_menu']='فاقد الضغط في الأنابيب — مانينغ';
$ec_lang['mphl_main_title']='حاسبة فاقد الضغط في الأنابيب بمانينغ المجانية عبر الإنترنت';
$ec_lang['mphl_main_desc']='فاقد الضغط بمعادلة مانينغ عند جريان كامل معلوم';
$ec_lang['mphl_pipe_length']='طول الأنبوب، L';
$ec_lang['mphl_area']='المساحة، A';
$ec_lang['mphl_total_junction_k']='معامل الفاقد الموضعي، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_short']='معامل الفاقد، k<sub>m</sub>';
$ec_lang['mphl_total_junction_k_tip']='معامل الفواقد الموضعية، km. تحدث هذه الفواقد عند نقاط التقاء الأنابيب، والمداخل، والمخارج، والانحناءات، والصمامات — ويوصف هذا النوع من الفواقد اصطلاحاً بأنه "ثانوي"، وهو وصف مضلل؛ ففي الخط القصير قد تساوي هذه الفواقد فواقد الاحتكاك أو تتجاوزها. القيم النموذجية لمعامل k: مدخل حاد 0.5، كل انحناء بزاوية 45° 0.2–0.3، صمام بوابة (مفتوح بالكامل) 0.1، صمام فراشة 0.2، المخرج (إلى خزان أو إلى الجو) 1.0. اجمع معاملات جميع التجهيزات للحصول على مجموع km. القيمة الافتراضية 2.0 تفترض مدخلاً واحداً، ومخرجاً واحداً، وانحناءين بزاوية 45°.';
$ec_lang['mphl_friction_slope']='ميل الاحتكاك';
$ec_lang['mphl_friction_loss']='فاقد الاحتكاك، h<sub>f</sub>';
$ec_lang['mphl_junction_loss']='الفاقد الموضعي، h<sub>m</sub>';
$ec_lang['mphl_total_loss']='الفاقد الإجمالي، h<sub>L</sub>';
$ec_lang['mphl_egl_1']='خط الطاقة المصبّ';
$ec_lang['mphl_egl_2']='خط الطاقة المنبع';
$ec_lang['mphl_hgl_egl_tip']='قد لا تكون هذه النتيجة صحيحة حيث يرتفع الأنبوب فوق خط المتدرج الهيدروليكي.';
$ec_lang['mphl_note_1']='<dl><dt>لا تُمثِّل هذه الحاسبة مسار الأنبوب (البروفايل) بين الطرفين.</dt><dd>إذا انخفض خط المتدرج الهيدروليكي عن قمة الأنبوب في أي نقطة، فقد لا يكون هذا الحساب صالحاً.</dd><dt>عند وجود مدخل مفتوح (عبّارة)، يجب التحقق من حالات التحكم عند المدخل.</dt><dd>1. لا يمكن أن يكون خط المتدرج الهيدروليكي المنبع أدنى من ارتفاع الجريان الطبيعي المنبع (ولا أدنى من الأنبوب!).</dd><dd>2. منسوب مياه الداخل للعبارة يُمثَّل بشكل أفضل بخط الطاقة المنبع بدلاً من خط المتدرج الهيدروليكي المنبع.</dd><dd>3. انظر <a target="_blank" href="https://www.youtube.com/watch?v=0O1Ezk8SVxU">درسي القصير مدته دقيقتان</a> لحسابات منسوب مياه الداخل البسيطة للعبارات القياسية باستخدام <a target="_blank" href="https://www.fhwa.dot.gov/engineering/hydraulics/software/hy8/">HY-8</a>، البرنامج المجاني لتصميم العبّارات من إدارة الطرق السريعة الفيدرالية الأمريكية.</dd><dd>4. تحل هذه الصفحة حالة التحكم عند المصب (المخرج) فقط: أنبوب يجري ممتلئاً بالكامل، حيث تُحدِّد ظروف المصب منسوب المياه. يتطلب تصميم العبّارات تحديد ما إذا كان التحكم يحدث عند المدخل أو عند المخرج، لذا استخدم HY-8 كلما احتمل أن يكون أي منهما هو الحاكم.</dd></dl>';
// Manning Trapezoid. See mpf_ for missing text.
$ec_lang['mtc_menu']='قناة شبه منحرفة — مانينغ';
$ec_lang['mtc_main_title']='الحاسبة المجانية عبر الإنترنت للقناة شبه المنحرفة بمعادلة مانينغ';
$ec_lang['mtc_main_desc']='الجريان المنتظم بمعادلة مانينغ في قناة شبه منحرفة عند انحدار وعمق معلومين';
$ec_lang['mtc_bottom_width']='عرض القاع، b';
$ec_lang['mtc_side_slope_1']='الميل الجانبي 1، z<sub>1</sub> (أفقي/رأسي)';
$ec_lang['mtc_side_slope_2']='الميل الجانبي 2، z<sub>2</sub> (أفقي/رأسي)';
$ec_lang['mtc_channel_slope']='انحدار القناة، S';
$ec_lang['mtc_flow_depth']='عمق الجريان، y';
$ec_lang['mtc_bend_angle']='<a target="_blank" href="riprap-bend-angle.png">زاوية الانحناء، β</a><span class="ec-help" title="لتحديد حجم الصخور. اتبع الرابط لعرض المخطط."><span class="ec-tip">؟</span></span>';
$ec_lang['mtc_sgrock']='<span class="ec-help" title="الكثافة النسبية إلى الماء. القيمة النموذجية ≈ 2.65 للصخور المكسّرة.">الكثافة النسبية للصخور، sg <span class="ec-tip">؟</span></span>';
$ec_lang['mtc_d50_in']='حجم الصخور التصميمي، D<sub>50</sub>';
$ec_lang['mtc_n_strickler']='n من حجم الصخور التصميمي (طريقة Strickler)';
$ec_lang['mtc_n_blodgett']='n من حجم الصخور التصميمي (طريقة Blodgett)';
$ec_lang['mtc_n_bathurst']='n من حجم الصخور التصميمي (طريقة Bathurst)';
$ec_lang['mtc_n_pi']='n من حجم الصخور التصميمي (طريقة Phillips & Ingersoll)';
$ec_lang['mtc_blodgett_v_bathurst']='Blodgett مقابل Bathurst';
$ec_lang['mtc_pi_range_check']='فحص نطاق P&I';
$ec_lang['mtc_pi_ok']='D50 ضمن نطاق P&I';
$ec_lang['mtc_pi_ok_tip']='0.28–0.36 قدم (Phillips & Ingersoll، 1998)';
$ec_lang['mtc_pi_out_of_range']='خارج النطاق';
$ec_lang['mtc_pi_tip']='تجاوز نطاق بيانات 0.28–0.36 قدم الذي اشتُقت منه هذه المعادلة — يُعتمد كفحص تقريبي فقط، وليس كأساس للتصميم';
$ec_lang['mtc_d50_bottom']='<span class="ec-help" title="وفق Isbash (1936) ومقاطعة ماريكوبا (Maricopa County)، أريزونا، الولايات المتحدة.">حجم الصخور الزاوية المطلوب للقاع، D<sub>50</sub> (Isbash وMC) <span class="ec-tip">؟</span></span>';
$ec_lang['mtc_d50_z1']='<span class="ec-help" title="وفق Isbash (1936) ومقاطعة ماريكوبا (Maricopa County)، أريزونا، الولايات المتحدة.">حجم الصخور الزاوية المطلوب للميل الجانبي 1، D<sub>50</sub> (Isbash وMC) <span class="ec-tip">؟</span></span>';
$ec_lang['mtc_d50_z2']='<span class="ec-help" title="وفق Isbash (1936) ومقاطعة ماريكوبا (Maricopa County)، أريزونا، الولايات المتحدة.">حجم الصخور الزاوية المطلوب للميل الجانبي 2، D<sub>50</sub> (Isbash وMC) <span class="ec-tip">؟</span></span>';
// Edited by TGH 2026-09-07
$ec_lang['mtc_d50_mra']='<span class="ec-help" title="وفق Maynord وRuff وAbt (1989). عند المنعطف تُحدَّد أبعاد الصخور بسرعة انحناء تعادل 4/3 من المتوسط، وفق California Division of Highways (1970)؛ أما نسبة Maynord الأصلية 1.5 فتُطبَّق على القنوات الطبيعية.">حجم الصخور الزاوية المطلوب، D<sub>50</sub> (Maynord وRuff وAbt 1989) <span class="ec-tip">؟</span></span>';
$ec_lang['mtc_d50_searcy']='حجم الصخور الزاوية المطلوب، D<sub>50</sub> (Searcy 1967)';
$ec_lang['mtc_vel_ok']='السرعة معقولة بالنسبة إلى افتراضات الجريان المنتظم.';
$ec_lang['mtc_vel_low']='السرعة منخفضة؛ خطر الترسّب.';
$ec_lang['mtc_vel_high']='السرعة مرتفعة وقد لا تكون واقعية؛ تحقق من تآكل تبطين القناة، والعمق الإضافي عند الانحناءات، وفقد الطاقة عند التوسعات أو العوائق.';
$ec_lang['mtc_iteration_tip']='اختر خيار خشونة (يُوصى بطريقة Blodgett–Bathurst) وخيار حجم صخور تصميمي (يُوصى بطريقة Isbash) للتكرار التلقائي نحو حجم صخور موحّد يحقق التدفق المستهدف. راجع الملاحظات أدناه للاطلاع على الطريقة الكاملة، أو أدخل قيمة الخشونة الخاصة بك (اتبع الرابط للإرشاد) وتجاهل حجم الصخور لتخطي التكرار.';
$ec_lang['mtc_note_1']='<dl><dt>التكرار التلقائي لتصميم حجم الصخور والخشونة</dt><dd>اختر خيار خشونة (يُوصى بـ Blodgett–Bathurst) وخيار حجم صخر تصميمي (يُوصى بـ Isbash). اضبط العمق ومعامل أمان حجم الصخر للوصول إلى تدفقك المستهدف بحجم صخر موحّد. في كل مرة تغيّر فيها مُدخلاً، تكرر الآلة الحاسبة هذه الخطوات: 1. تُحسب الخشونة من حجم الصخر التصميمي. 2. تُنسخ قيمة الخشونة من الطريقة التي اخترتها إلى مُدخل الخشونة. 3. يُحسب تدفق القناة وحجم الصخر المطلوب. 4. يُعدَّل حجم الصخر التصميمي. 5. يتكرر ذلك حتى يصبح الخطأ في حجم الصخر التصميمي صغيراً جداً.</dd><dt>الآلة الحاسبة الأساسية (بلا تكرار)</dt><dd>أدخل قيمة الخشونة التي تريدها. تجاهل منطقة إدخال حجم الصخر التصميمي.</dd></dl>';
$ec_lang['mtc_note_2_term']='فحص السرعة';
$ec_lang['mtc_note_2_def']='السرعة العالية تعني وجود هبوط كبير في المنسوب أدى إلى طاقة نوعية مرتفعة بهذا القدر. يمكن أن تُفقد هذه الطاقة بسرعة عند التوسعات أو الانحناءات أو العوائق. تحقق من أن ذلك معقول لموقع المشروع.';
$ec_lang['mtc_solver_no_solution']='لم يتم العثور على حل للتدفق Q المعطى بهذه المدخلات الخاصة بالقناة.';
// Weir Flow Simple
$ec_lang['ws_main_menu']='جريان العتبة — البسيطة';
$ec_lang['ws_main_title']='حاسبة جريان العتبة عريضة العرف البسيطة المجانية عبر الإنترنت';
$ec_lang['ws_main_desc']='حاسبة جريان العتبة عريضة العرف البسيطة';
$ec_lang['ws_weirLength']='طول العتبة، L';
$ec_lang['ws_headWaterHeight']='<span class="ec-help" title="طاقة لكل وحدة وزن من الماء — ارتفاع لعمود الماء، وليس ضغطاً">الرأس، h <span class="ec-tip">؟</span></span>';
$ec_lang['ws_weirCoefficient']='معامل العتبة، C<sub>w</sub>';
$ec_lang['ws_notes_heading']='ملاحظات';
$ec_lang['ws_notes_we_term']='معادلة العتبة';
// Weir Flow Irregular. See ws_ for missing text.
$ec_lang['wi_menu']='جريان العتبة — غير المنتظمة';
$ec_lang['wi_main_title']='حاسبة جريان العتبة غير المنتظمة، المجزأة ومتغيرة العمق، المجانية عبر الإنترنت';
$ec_lang['wi_main_desc']='حاسبة جريان العتبة غير المنتظمة';
$ec_lang['wi_weirPoints']='نقاط العتبة';
$ec_lang['wi_pondingHeight']='ارتفاع التجميع';
$ec_lang['wi_incrementalFlow']='التدفق التدريجي';
$ec_lang['wi_cumulativeFlow']='التدفق التراكمي';
$ec_lang['wi_notes_we_def']='q = إذا (الطول = 0) إذن 0؛ وإلا إذا (الميل=0) إذن cw*length*d<sub>0</sub><sup>1.5</sup>؛ وإلا cw/(2.5*slope) * (d<sub>0</sub><sup>2.5</sup> - d<sub>1</sub><sup>2.5</sup>) حيث d<sub>1</sub> وd<sub>0</sub> دائماً موجبتان أو صفر';
// Orifice Flow
$ec_lang['or_main_menu']='جريان الفتحة';
$ec_lang['or_main_title']='حاسبة جريان الفتحة المجانية عبر الإنترنت';
$ec_lang['or_main_desc']='جريان الفتحة — حر أو مغمور';
$ec_lang['or_shape_circular']='دائري';
$ec_lang['or_shape_rectangular']='مستطيل';
$ec_lang['or_diameter']='<span class="ec-help" title="القطر للفتحة الدائرية؛ الارتفاع للفتحة المستطيلة">القطر أو الارتفاع، D <span class="ec-tip">?</span></span>';
$ec_lang['or_width']='<span class="ec-help" title="للفتحات المستطيلة فقط">العرض، W <span class="ec-tip">?</span></span>';
$ec_lang['or_invert']='<span class="ec-help" title="أسفل الفتحة">منسوب القاع <span class="ec-tip">?</span></span>';
$ec_lang['or_hwe']='منسوب المياه العلوية';
$ec_lang['or_twe']='منسوب المياه السفلية';
$ec_lang['or_cd']='معامل التصريف، C<sub>d</sub>';
$ec_lang['or_centroid_elev']='منسوب المركز الهندسي';
$ec_lang['or_head']='<span class="ec-help" title="طاقة لكل وحدة وزن من الماء — ارتفاع لعمود الماء، وليس ضغطاً">الرأس الفعّال، h <span class="ec-tip">؟</span></span>';
$ec_lang['or_area']='مساحة الفتحة، A';
$ec_lang['or_regime']='فحص نظام الفتحة';
$ec_lang['or_regime_valid']='تصريف حر';
$ec_lang['or_regime_submerged']='فتحة مغمورة';
$ec_lang['or_regime_submerged_tip']='TWE فوق المركز الهندسي — نظام الفتحة لا يزال صالحاً';
$ec_lang['or_regime_warn']='خارج نظام الفتحة';
$ec_lang['or_regime_warn_tip']='المياه العلوية أدنى من تاج الفتحة';
$ec_lang['or_regime_twe_above_hwe']='تحقق من المدخلات';
$ec_lang['or_regime_twe_above_hwe_tip']='المياه السفلية (TWE) فوق المياه العلوية (HWE)';
$ec_lang['or_notes_1_term']='معادلة الفتحة';
$ec_lang['or_notes_1_def']='Q = C<sub>d</sub> × A × √(2gh). للتصريف الحر: h = HWE − المركز الهندسي. للجريان المغمور (TWE فوق قاع الفتحة): h = HWE − TWE.';
$ec_lang['or_notes_2_term']='نظام الفتحة';
$ec_lang['or_notes_2_def']='تُطبَّق معادلات جريان الفتحة عندما يكون منسوب المياه العلوية فوق تاج (قمة) الفتحة. عندما تكون المياه العلوية أدنى من التاج، استخدم معادلة عتبة بدلاً من ذلك.';
$ec_lang['or_notes_3_term']='معامل التصريف';
$ec_lang['or_notes_3_def']='يتراوح C<sub>d</sub> من حوالي 0.60 إلى 0.65 للفتحات ذات الحافة الحادة. تستخدم المداخل المستديرة أو المعكوسة قيماً مختلفة. انظر <a target="_blank" href="https://www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html">Engineering Toolbox</a> أو دليل مرجعية هيدروليكا HEC-RAS للإرشاد.';
$ec_lang['or_notes_4_term']='الغمر';
$ec_lang['or_notes_4_def']='عندما يكون TWE فوق قاع الفتحة، تُطبّق الحاسبة تلقائياً معادلة الفتحة المغمورة باستخدام h = HWE − TWE. عندما يكون TWE عند قاع الفتحة أو أدنى منه، يُفترض التصريف الحر وh = HWE − المركز الهندسي.';
// Micro-Hydro Power
$ec_lang['mhp_main_menu']='الطاقة الكهرومائية الصغيرة';
$ec_lang['mhp_main_title']='حاسبة الطاقة الكهرومائية الصغيرة المجانية عبر الإنترنت';
$ec_lang['mhp_main_desc']='حاسبة إنتاج الطاقة الكهرومائية الصغيرة بنظام مجرى النهر';
$ec_lang['mhp_gross_head']='الارتفاع الإجمالي، H<sub>gross</sub>';
$ec_lang['mhp_diameter']='<span class="ec-help" title="قطر أنبوب الضغط (أنبوب التغذية)">قطر أنبوب الضغط، D <span class="ec-tip">?</span></span>';
$ec_lang['mhp_length']='الطول، L';
$ec_lang['mhp_efficiency']='كفاءة المحطة، η (0–1)';
$ec_lang['mhp_vel_check']='فحص السرعة';
$ec_lang['mhp_hl_check']='فحص فقد الضغط';
$ec_lang['mhp_hnet']='الارتفاع الصافي، H<sub>net</sub>';
$ec_lang['mhp_power']='القدرة المنتجة، P';
$ec_lang['mhp_annual_kwh']='P كطاقة سنوية';
$ec_lang['mhp_vel_low']='السرعة منخفضة؛ خطر الترسيب واحتباس الهواء.';
$ec_lang['mhp_vel_high']='السرعة مرتفعة؛ تحقق من فقد الانتقال، والطاقة المتاحة، والمطرقة المائية.';
$ec_lang['mhp_vel_ok_short']='جيد';
$ec_lang['mhp_vel_high_short']='مرتفع';
$ec_lang['mhp_vel_low_short']='منخفض';
$ec_lang['mhp_vel_ok_tip']='السرعة ضمن النطاق الفعّال لتصميم أنبوب الضغط.';
$ec_lang['mhp_hl_ok_tip']='فقدان الضغط أقل من 10% من العلو الإجمالي. حجم هذا الأنبوب اقتصادي.';
$ec_lang['mhp_hl_warn_tip']='فقدان الضغط أكثر من 10% من العلو الإجمالي. ضع في اعتبارك أنبوباً أكبر.';
$ec_lang['mhp_hl_bad_tip']='فقدان الضغط أكثر من 20% من العلو الإجمالي. غيّر حجم الأنبوب.';
$ec_lang['mhp_notes_1_term']='فقد الضغط';
$ec_lang['mhp_notes_1_def']='إجمالي فقد أنبوب الضغط h<sub>L</sub> = h<sub>f</sub> + h<sub>m</sub>، حيث h<sub>f</sub> = f(L/D)(v²/2g) هو فقد الاحتكاك وفق داركي-وايسباخ، وh<sub>m</sub> = k<sub>m</sub>·v²/2g يشمل المدخل والانحناءات والصمامات. الارتفاع الصافي H<sub>net</sub> = H<sub>gross</sub> − h<sub>L</sub>.';
$ec_lang['mhp_notes_2_term']='السرعة';
$ec_lang['mhp_notes_2_def']='تحقق من أن السرعة معقولة بالنسبة للانخفاض المتاح وتكلفة الأنبوب. السرعة المنخفضة جداً قد تدل على مبالغة في حجم الأنبوب؛ والسرعة المرتفعة جداً قد تزيد فقد الاحتكاك وخطر المطرقة المائية.';
$ec_lang['mhp_notes_3_term']='هدف فقد الضغط';
$ec_lang['mhp_notes_3_def']='تُعدّ فواقد أنبوب الضغط (أنبوب التغذية) التي تقل عن 10% من العلو الإجمالي اقتصادية بوجه عام. غالباً ما يقع التوازن الأمثل بين تكلفة الأنبوب والقدرة المفقودة عند 4–6% حين يكون سعر الكهرباء في الطرف الأعلى.';
$ec_lang['mhp_notes_6_term']='الكفاءة';
$ec_lang['mhp_notes_6_def']='تتراوح كفاءة المحطة النموذجية η من 0.70 إلى 0.85 لتوربينات Pelton والتوربينات العرضية الشائعة في محطات الطاقة المائية الصغيرة. استخدم 0.75 كتقدير أولي متحفظ.';
$ec_lang['mhp_notes_7_term']='الطاقة السنوية';
$ec_lang['mhp_notes_7_def']='تفترض الطاقة السنوية تشغيلاً متواصلاً بالتدفق الكامل (8760 ساعة/سنة). الإنتاج الفعلي سيكون أقل بسبب التباين الموسمي في التدفق وتوقف الصيانة ومعامل الحمل.';

// Orifice Drain Time
$ec_lang['odt_main_menu']='وقت تصريف البركة والخزان';
$ec_lang['odt_main_title']='حاسبة وقت تصريف البركة أو الحوض أو الخزان مجانًا عبر الإنترنت (بفتحة)';
$ec_lang['odt_main_desc']='وقت تصريف البركة أو الحوض أو الخزان — مخرج بفتحة، طريقة الحجم المخروطي';
$ec_lang['odt_h1_elev']='منسوب سطح الماء الابتدائي';
$ec_lang['odt_a1']='المساحة الابتدائية، A<sub>1</sub>';
$ec_lang['odt_h2_elev']='منسوب سطح الماء النهائي';
$ec_lang['odt_a0']='المساحة عند منسوب الفتحة، A<sub>0</sub>';
$ec_lang['odt_a_ending']='<span class="ec-help" title="مُستوفاة من النموذج المخروطي عند المنسوب النهائي">المساحة النهائية، A<sub>2</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_h2_check']='فحص المنسوب النهائي';
$ec_lang['odt_h2_ok']='المنسوب النهائي فوق قمة الفتحة';
$ec_lang['odt_h2_warn']='المنسوب النهائي عند قمة الفتحة أو أدناه';
$ec_lang['odt_h2_warn_tip']='قمة الفتحة = المركز الهندسي + D/2';
$ec_lang['odt_d']='<span class="ec-help" title="القطر (دائري) أو الارتفاع (مستطيل)">فتحة D <span class="ec-tip">?</span></span>';
$ec_lang['odt_w']='<span class="ec-help" title="للفتحات المستطيلة فقط">عرض الفتحة، W <span class="ec-tip">?</span></span>';
$ec_lang['odt_t_sec']='وقت التصريف (ثوانٍ)';
$ec_lang['odt_t_min']='وقت التصريف (دقائق)';
$ec_lang['odt_t_hr']='وقت التصريف (ساعات)';
$ec_lang['odt_t_day']='وقت التصريف (أيام)';
$ec_lang['odt_notes_1_term']='الصيغة';
$ec_lang['odt_notes_1_def']='t = √H<sub>1</sub> / (C<sub>d</sub> A<sub>or</sub> √(2g)) × (2A<sub>x</sub>/5 + 8√(A<sub>x</sub>A<sub>0</sub>)/15 + 16A<sub>0</sub>/15) يعطي وقت التصريف من الرأس H إلى الفتحة. وقت التصريف = t(H<sub>1</sub>,A<sub>1</sub>,A<sub>0</sub>) − t(H<sub>2</sub>,A<sub>2</sub>,A<sub>0</sub>)، حيث H<sub>1</sub> = المنسوب الابتدائي − منسوب الفتحة، H<sub>2</sub> = المنسوب النهائي − منسوب الفتحة.';
$ec_lang['odt_notes_2_term']='الطريقة';
$ec_lang['odt_notes_2_def']='تُنمذج طريقة الحجم المخروطي البركة أو الحوض كمقطع مخروطي بين المساحة الابتدائية A<sub>1</sub> عند منسوب المياه الابتدائي والمساحة A<sub>0</sub> عند منسوب المركز الهندسي للفتحة. يُحسب A<sub>2</sub>، مساحة البركة عند المنسوب النهائي، بالاستيفاء من A<sub>1</sub> وA<sub>0</sub> باستخدام نموذج المقطع المخروطي. وقت التصريف من المنسوب الابتدائي إلى النهائي يساوي إجمالي وقت التصريف من H<sub>1</sub> إلى الفتحة ناقص وقت التصريف المتبقي من H<sub>2</sub> إلى الفتحة.';
$ec_lang['odt_h1']='<span class="ec-help" title="منسوب سطح الماء الابتدائي ناقص منسوب المركز الهندسي للفتحة">الرأس الابتدائي، H<sub>1</sub> <span class="ec-tip">?</span></span>';
$ec_lang['odt_q_max']='الحد الأقصى للتدفق، Q<sub>max</sub>';
$ec_lang['odt_vol']='الحجم المُصرَّف';
$ec_lang['odt_sketch_start']='البداية';
$ec_lang['odt_sketch_end']='النهاية';
// Contact us.

// Irrigation
// Drip / Sprinkler Application Rate
$ec_lang['ip_se']='تباعد القطارات، S<sub>e</sub>';
$ec_lang['ip_sl']='تباعد الخطوط الجانبية، S<sub>l</sub>';
$ec_lang['ip_n_e']='عدد القطارات في الخط الجانبي، n<sub>e</sub>';
$ec_lang['ip_n_l']='عدد الخطوط الجانبية في المنطقة، n<sub>l</sub>';
$ec_lang['ip_d']='عمق التطبيق المستهدف، d';
$ec_lang['ip_a_e']='المساحة لكل قطارة، A<sub>e</sub>';
$ec_lang['ip_pr']='معدل التطبيق، PR';
$ec_lang['ip_q_lat']='التدفق لكل خط جانبي، Q<sub>lat</sub>';
$ec_lang['ip_q_sys']='تدفق المنطقة، Q<sub>zone</sub>';
$ec_lang['ip_t_run']='وقت التشغيل (ساعات)';
// Canal Seepage / Conveyance Efficiency. Prefix cs_.
$ec_lang['cs_main_menu']='تسرب القنوات';
$ec_lang['cs_main_title']='حاسبة فقد تسرب القنوات وكفاءة النقل المجانية عبر الإنترنت';
$ec_lang['cs_main_desc']='فقد تسرب القناة وكفاءة النقل — طريقة التدفق الوارد والصادر';
$ec_lang['cs_Q_in']='التدفق الوارد، Q<sub>in</sub>';
$ec_lang['cs_Q_out']='التدفق الصادر، Q<sub>out</sub>';
$ec_lang['cs_L']='طول القطاع، L';
$ec_lang['cs_Q_loss']='معدل فقد التسرب، Q<sub>loss</sub>';
$ec_lang['cs_loss_check']='فحص القياس';
$ec_lang['cs_pct_loss']='الكسر المفقود';
$ec_lang['cs_Ec']='كفاءة النقل، E<sub>c</sub>';
$ec_lang['cs_Ec_check']='تقييم الكفاءة';
$ec_lang['cs_Vol_day']='الحجم اليومي المفقود';
$ec_lang['cs_Vol_year']='الحجم السنوي المفقود';
$ec_lang['cs_Q_loss_per_L']='الفقد لكل وحدة طول، Q<sub>loss</sub>/L';
$ec_lang['cs_water_value']='قيمة المياه';
$ec_lang['cs_lining_cost']='تكلفة التبطين';
$ec_lang['cs_Ec_target']='<span class="ec-help" title="كفاءة النقل المستهدفة بعد التبطين؛ كسر بين 0 و1">هدف التبطين، E<sub>c,target</sub> <span class="ec-tip">؟</span></span>';
$ec_lang['cs_lining_area']='مساحة التبطين، L × P<sub>w</sub>';
$ec_lang['cs_annual_value_lost']='القيمة السنوية المفقودة';
$ec_lang['cs_annual_value_recovered']='القيمة السنوية المستردة';
$ec_lang['cs_lining_total_cost']='إجمالي تكلفة التبطين';
$ec_lang['cs_payback_years']='<span class="ec-help" title="الاسترداد البسيط = إجمالي تكلفة التبطين ÷ القيمة السنوية المستردة">فترة الاسترداد <span class="ec-tip">؟</span></span>';
$ec_lang['cs_loss_positive']='Q<sub>in</sub> > Q<sub>out</sub> — تسرب مكتشف';
$ec_lang['cs_loss_zero']='Q<sub>in</sub> = Q<sub>out</sub> — لا فقد قابل للقياس';
$ec_lang['cs_loss_negative']='Q<sub>out</sub> > Q<sub>in</sub> — تحقق من القياسات';
$ec_lang['cs_Ec_good']='جيد — E<sub>c</sub> ≥ 80%';
$ec_lang['cs_Ec_fair']='مقبول — E<sub>c</sub> 60–80%';
$ec_lang['cs_Ec_poor']='ضعيف — E<sub>c</sub> < 60%';
$ec_lang['cs_notes_1_def']='يُقدِّر أسلوب التدفق الوارد والصادر التسرب بقياس التدفق عند رأس قطاع القناة وذيله: Q<sub>loss</sub> = Q<sub>in</sub> − Q<sub>out</sub>. كفاءة النقل E<sub>c</sub> = Q<sub>out</sub> / Q<sub>in</sub>. يفترض الحجم السنوي تشغيلاً مستمراً بالتدفق الكامل؛ والفقد الفعلي أقل في القنوات الموسمية أو ذات التدفق الجزئي.';
$ec_lang['cs_notes_2_term']='تقييمات الكفاءة';
$ec_lang['cs_notes_2_def']='القنوات الترابية غير المبطنة النموذجية: E<sub>c</sub> = 60–80%. القنوات الترابية جيدة الصيانة: 75–85%. القنوات المبطنة بالخرسانة: 90–98%. غالباً ما يبرر فقد التسرب الذي يتجاوز 30% من التدفق الوارد استثمار التبطين. (USBR، FAO)';
$ec_lang['cs_notes_3_term']='استرداد تكلفة التبطين';
$ec_lang['cs_notes_3_def']='أدخل قيمة المياه وتكلفة التبطين بأي عملة متسقة. مساحة التبطين = طول القطاع × المحيط المبلل — وهو المحيط المبلل لمقطع القناة العرضي عند عمق الجريان المقاس (عرض القاع مضافاً إليه الجانبان المبللان). تفترض القيمة السنوية المستردة أن القناة المبطنة تحقق E<sub>c</sub> المستهدفة باستمرار. سيكون الاسترداد الفعلي أطول للقنوات الموسمية أو إذا لم يبلغ التبطين الكفاءة المستهدفة.';
$ec_lang['cs_notes_4_def']='USBR <em>Water Measurement Manual</em>، الطبعة الثالثة (2001). FAO Irrigation and Drainage Paper 57 (1999).';
// About
$ec_lang['about_main_menu']='حول';
$ec_lang['install_main_menu']='تثبيت';
$ec_lang['install_main_title']='تثبيت EngCalcs';
$ec_lang['install_main_desc']='أضفه إلى جهازك للاستخدام دون اتصال';
$ec_lang['install_intro']='‏EngCalcs هو تطبيق ويب تقدمي (PWA). بعد تثبيته، تعمل جميع الحاسبات دون اتصال بالإنترنت بشكل كامل — لا حاجة لأي اتصال بالشبكة.';
$ec_lang['install_android_heading']='أندرويد (Chrome)';
$ec_lang['install_android_steps_html']='<li>افتح أي صفحة حاسبة في متصفح Chrome.</li><li>اضغط على زر <strong>⬇ تثبيت</strong> في شريط التنقل العلوي، أو اضغط على قائمة المتصفح (⋮) واختر <strong>إضافة إلى الشاشة الرئيسية</strong>.</li><li>اضغط على <strong>تثبيت</strong> في الرسالة التي تظهر.</li><li>يظهر EngCalcs على شاشتك الرئيسية ويعمل دون اتصال بالإنترنت.</li>';
$ec_lang['install_now_btn']='⬇ تثبيت الآن';
$ec_lang['install_prompt_unavailable']='رسالة التثبيت غير متاحة — استخدم قائمة المتصفح بدلاً من ذلك.';
$ec_lang['install_ios_heading']='آيفون (Safari)';
$ec_lang['install_ios_steps_html']='<li>افتح أي صفحة حاسبة في متصفح Safari.</li><li>اضغط على زر <strong>المشاركة</strong> (المربع الذي يحتوي على سهم يشير لأعلى).</li><li>مرّر لأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية</strong>.</li><li>اضغط على <strong>إضافة</strong>. يظهر EngCalcs على شاشتك الرئيسية.</li>';
$ec_lang['install_ios_note']='على أجهزة آيفون، يتم التثبيت دائماً عبر قائمة المشاركة — لا توجد رسالة تثبيت تلقائية.';
$ec_lang['install_desktop_heading']='سطح المكتب (Chrome / Edge)';
// Edited by TGH 2026-09-07
$ec_lang['install_desktop_steps_html']='<li>افتح أي صفحة حاسبة.</li><li>انقر على <strong>أيقونة التثبيت</strong> (⊕ أو أيقونة الحاسوب) في شريط عنوان المتصفح، أو افتح قائمة المتصفح واختر <strong>تثبيت EngCalcs…</strong></li><li>انقر على <strong>تثبيت</strong>. يفتح EngCalcs في نافذة تطبيق مستقلة.</li>';
$ec_lang['install_firefox_heading']='فَيَرفُكس ومتصفحات أخرى';
$ec_lang['install_firefox_body']='لا يدعم Firefox تثبيت تطبيقات الويب التقدمية على سطح المكتب. يمكنك مع ذلك استخدام جميع الحاسبات بشكل طبيعي في المتصفح — بعد زيارتك الأولى، يتم حفظ الصفحات تلقائياً في الذاكرة المؤقتة لاستخدامها دون اتصال بالإنترنت.';
$ec_lang['install_cached_heading']='ما الذي يتم حفظه';
$ec_lang['install_cached_body']='في المرة الأولى التي تثبّت فيها EngCalcs، يتم حفظ جميع صفحات الحاسبات وملفاتها المساعدة (البرمجيات النصية وأنماط التنسيق) تلقائياً على جهازك. بعد ذلك، يعمل كل شيء دون الحاجة لاتصال بالإنترنت. يتم تذكّر اختيارك للغة من آخر زيارة لك وأنت متصل بالإنترنت.';
$ec_lang['contact_main_menu']='تواصل';
$ec_lang['about_main_title']='حول حاسبات HawsEDC الهندسية';
$ec_lang['about_main_desc']='الرسالة، والبرمجيات الحرة، والمساهمة';
// Edited by TGH 2026-09-07
$ec_lang['about_body_html']='<h3>الرسالة</h3><p>وُجدت حاسبات HawsEDC الهندسية لخدمة المهندسين والعاملين الميدانيين حول العالم — ولا سيما أولئك الذين يعملون في المناطق الشحيحة المياه أو المحدودة الموارد أو المحرومة. هذه الأدوات جزء من رسالة إنسانية أشمل: إخبار كل إنسان بأكثر الطرق عملية وفاعلية أنه محبوب وعزيز إلى الأبد، وأنه لا يخشى شيئاً، وأنه لن يدمّر كل شيء.</p><p>الحاسبات هي الوسيلة، والهدف عالم خالٍ من المعاناة.</p><h3>ترخيص البرمجيات الحرة ومفتوحة المصدر</h3><p>يُصدَر الكود بالكامل تحت <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html">رخصة GNU العامة الشاملة الإصدار 3.0 أو أحدث</a> — حرة كما هي الحرية. يمكنك استخدام الكود ودراسته وتعديله وإعادة توزيعه وفق الشروط ذاتها.</p><p>هذه دعوة، لا سعر. لا توجد نسخة مدفوعة، ولا نسخة مجانية يمكن سحبها لاحقاً، ولا تأخير قبل أن يصبح الكود ملكك. النسخة الكاملة التي تراها اليوم متاحة مجاناً للجميع الآن وإلى الأبد للاستخدام والتعديل.</p><p>حقوق النشر © 2009–2026 Thomas Gail Haws.</p><h3>الكود المصدري</h3><p>الكود المصدري الكامل متاح للعموم على GitHub:</p><p><a target="_blank" href="https://github.com/hawstom/engcalcs">github.com/hawstom/engcalcs</a></p><p>يمكنك تصفح الكود وتسجيل المشكلات أو تفريع المستودع هناك.</p><h3>المساهمة</h3><p>كل مساعدة مرحَّب بها. <a href="contact.php">تواصل مع Tom Haws</a>.</p><ul><li><strong>الترجمة:</strong> اقترح صياغة أفضل. حسِّن لغة أو أضف لغة جديدة.</li><li><strong>تقارير الأخطاء:</strong> استخدم نموذج الملاحظات في أي صفحة حاسبة، أو سجّل مشكلة على GitHub.</li><li><strong>حاسبات جديدة:</strong> أفكار لأدوات هندسة هيدروليكية تخدم العاملين الميدانيين وممارسي الري مرحَّب بها بشكل خاص.</li><li><strong>الاستضافة:</strong> إن كنت تستطيع استضافة نسخة مطابقة من هذه الحاسبات لمنطقة ذات اتصال محدود، يُرجى التواصل معي.</li></ul><h3>الاستخدام دون اتصال</h3><p>تعمل هذه الحاسبات كـ<strong>تطبيق ويب تقدمي (PWA)</strong>. قم بزيارة أي صفحة حاسبة أثناء اتصالك بالإنترنت، وسيقوم متصفحك بتخزين جميع الحاسبات تلقائياً في ذاكرة التخزين المؤقت. بعد ذلك، تعمل جميع الحاسبات دون اتصال — لا حاجة للإنترنت.</p><p>على Android أو iOS، استخدم خيار "إضافة إلى الشاشة الرئيسية" في متصفحك لتثبيت EngCalcs كتطبيق على جهازك. على سطح المكتب، ابحث عن أيقونة التثبيت في شريط عنوان متصفحك.</p><p>يمكنك أيضاً حفظ أي حاسبة منفردة باستخدام قائمة "حفظ باسم…" في متصفحك للاستخدام غير المتصل لمرة واحدة.</p><h3>التواصل</h3><p>Tom Haws، مهندس هيدروليكي ومؤسس هذه الحاسبات.<br />استخدم نموذج الملاحظات في أي صفحة حاسبة، أو تصفح الكود المصدري على <a target="_blank" href="https://github.com/hawstom/engcalcs">GitHub</a>.</p>';
$ec_lang['contactSendMessage']='أرسل رسالة إلى Tom Haws';
$ec_lang['contactYourName']='اسمك:';
$ec_lang['contactYourEmail']='عنوان بريدك الإلكتروني:';
$ec_lang['contactSubject']='الموضوع:';
$ec_lang['contact_message']='الرسالة:';
$ec_lang['contactSpamPrefix']='خمسة زائد واحد يساوي';
$ec_lang['contactSpamPostfix']='(يرجى كتابتها بالحروف. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='إرسال الرسالة';
$ec_lang['contact_success']='شكراً لك على تخصيص الوقت للكتابة.';
// Rock Chute Design (Robinson, Rice & Kadavy 1998). Prefix rc_.
$ec_lang['rc_main_menu']='تصميم المزلق الصخري (Robinson)';
$ec_lang['rc_main_title']='حاسبة تصميم المزلق الصخري المجانية عبر الإنترنت — Robinson (1998)';
$ec_lang['rc_main_desc']='تحديد حجم الحجارة في المزلق الصخري — Robinson, Rice & Kadavy (1998)';
$ec_lang['rc_S0']='انحدار قاع المزلق، S<sub>0</sub>';
$ec_lang['rc_qt']='<span class="ec-help" title="التدفق لكل وحدة عرض عند مدخل المزلق. لقناة بعرض قاع B وتدفق إجمالي Q، استخدم q_t = Q / B.">التصريف الوحدوي الإجمالي، q<sub>t</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_np']='مسامية الحجارة، n<sub>p</sub>';
$ec_lang['rc_sg']='<span class="ec-help" title="الكثافة النسبية إلى الماء. القيمة النموذجية للجرانيت أو البازلت المكسور ≈ 2.65. نطاق Robinson الصحيح: 2.54 إلى 2.82.">الكثافة النسبية للصخر، sg <span class="ec-tip">؟</span></span>';
$ec_lang['rc_SD']='<span class="ec-help" title="الانحراف المعياري للتدرج. الصخر المنتظم ≈ 1.25. نطاق Robinson الصحيح: 1.15 إلى 1.47.">انحراف التدرج SD = D<sub>84.1</sub>/D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_yn']='<span class="ec-help" title="تجمّع المياه (Hp > yn) جيد — يقلل التآكل في أعلى المجرى. (USDA)">العمق الطبيعي في قناة المدخل، y<sub>n</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_D50']='<span class="ec-help" title="المعادلة 1 (S0 < 0.10) أو المعادلة 2 (0.10-0.40). الصحيح: D50 من 15 إلى 278 مم، S0 من 0.02 إلى 0.40. خارج النطاق: قيم خارج المعايرة.">حجم الصخر الوسيط المطلوب، D<sub>50</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_eq_used']='المعادلة المطبّقة';
$ec_lang['rc_sg_check']='فحص الكثافة النسبية';
$ec_lang['rc_SD_check']='فحص انحراف التدرج SD';
$ec_lang['rc_sg_ok']   ='sg ضمن النطاق الصحيح';
$ec_lang['rc_sg_ok_tip']='2.54–2.82 (Robinson)';
$ec_lang['rc_sg_low']  ='sg أقل من نطاق Robinson';
$ec_lang['rc_sg_low_tip']='النطاق الصحيح: 2.54–2.82';
$ec_lang['rc_sg_high'] ='sg أعلى من نطاق Robinson';
$ec_lang['rc_sg_high_tip']='النطاق الصحيح: 2.54–2.82';
$ec_lang['rc_SD_ok']   ='SD ضمن النطاق الصحيح';
$ec_lang['rc_SD_ok_tip']='1.15–1.47 (Robinson)';
$ec_lang['rc_SD_low']  ='SD أقل من نطاق Robinson';
$ec_lang['rc_SD_low_tip']='النطاق الصحيح: 1.15–1.47';
$ec_lang['rc_SD_high'] ='SD أعلى من نطاق Robinson';
$ec_lang['rc_SD_high_tip']='النطاق الصحيح: 1.15–1.47';
$ec_lang['rc_layer']='سماكة طبقة الحجارة (2 × D<sub>50</sub>)';
$ec_lang['rc_crest_radius']='نصف قطر منحنى التاج العلوي (40 × D<sub>50</sub>)';
$ec_lang['rc_crest_length']='طول قوس منحنى التاج العلوي';
$ec_lang['rc_apron_length']='<span class="ec-help" title="مطلوب للدعم الإنشائي لحجارة المزلق. “الحد الأدنى لعمق مياه الذيل الناتج عن قطاع المخرج ومقاومة قناة أسفل المجرى كافٍ لضمان استقرار حجارة الحماية في قطاع المخرج.” (Robinson)">طول مصطبة المخرج (15 × D<sub>50</sub>) <span class="ec-tip">?</span></span>';
$ec_lang['rc_n_chute']='معامل خشونة Manning في المزلق، n';
$ec_lang['rc_Vm']='<span class="ec-help" title="نسبة من qt تتدفق عبر مسام الحجارة. الباقي qs يتدفق على السطح. الافتراضي np = 0.45 للصخر المكسور الزاوي.">السرعة عبر غطاء الصخر، V<sub>m</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_qm']='التدفق الوحدوي عبر الغطاء، q<sub>m</sub>';
$ec_lang['rc_qs']='التدفق الوحدوي السطحي، q<sub>s</sub> (q<sub>t</sub> − q<sub>m</sub>)';
$ec_lang['rc_d']='عمق التدفق فوق سطح الحجارة، d';
$ec_lang['rc_Hp']='<span class="ec-help" title="تجمّع المياه (Hp > yn) جيد — يقلل التآكل في أعلى المجرى. (USDA)">علو المياه فوق الهدار عند المدخل، H<sub>p</sub> <span class="ec-tip">?</span></span>';
$ec_lang['rc_ponding_check']='فحص تجمّع المياه عند المدخل';
$ec_lang['rc_pond_ok']  ='H<sub>p</sub> > y<sub>n</sub> — تجمّع مياه في أعلى المجرى';
$ec_lang['rc_pond_ok_tip']='تجمّع المياه في أعلى مدخل المزلق أمر جيد؛ فهو يقلل التآكل في أعلى المجرى. (USDA)';
$ec_lang['rc_pond_warn']='H<sub>p</sub> ≤ y<sub>n</sub> — لا يوجد تجمّع للمياه — احتمال تآكل عند المدخل';
$ec_lang['rc_pond_warn_tip']='لا يوجد تجمّع للمياه في أعلى مدخل المزلق؛ قد يحدث تآكل في أعلى المجرى. (USDA)';
$ec_lang['rc_eq1']='المعادلة 1 (S<sub>0</sub> < 0.10) — انحدار لطيف';
$ec_lang['rc_eq2']='المعادلة 2 (0.10 ≤ S<sub>0</sub> ≤ 0.40) — انحدار حاد';
$ec_lang['rc_eq_warn_low']='S<sub>0</sub> < 0.02 — أقل من نطاق التحقق لدى Robinson';
$ec_lang['rc_eq_warn_high']='S<sub>0</sub> > 0.40 — أعلى من نطاق التحقق لدى Robinson';
$ec_lang['rc_notes_1_term']='معادلات تحديد حجم الصخر';
$ec_lang['rc_notes_1_def']='طوّر Robinson وRice وKadavy (1998) معادلتين تجريبيتين لحجم تبطين الصخور الوسيط D<sub>50</sub> من انحدار القناة والتصريف الوحدوي. تُطبَّق المعادلة 1 على الانحدارات اللطيفة (S<sub>0</sub> < 0.10)؛ وتُطبَّق المعادلة 2 على الانحدارات الشديدة (0.10 ≤ S<sub>0</sub> ≤ 0.40). تتطلب كلتا المعادلتين q<sub>t</sub> بوحدة m²/s وتُرجعان D<sub>50</sub> بوحدة mm. النطاق المتحقق منه هو 0.02 ≤ S<sub>0</sub> ≤ 0.40.';
$ec_lang['rc_notes_2_term']='التصريف الوحدوي';
$ec_lang['rc_notes_2_def']='q<sub>t</sub> هو التصريف الوحدوي الإجمالي عند تاج المزلق (إجمالي التدفق لكل وحدة عرض). لقناة بعرض قاع B تحمل تدفقاً إجمالياً Q، يُقدَّر q<sub>t</sub> ≈ Q / B، أو يُحسب من شرط العمق الحرج عند مدخل المزلق.';
$ec_lang['rc_notes_3_term']='التدفق عبر غطاء الصخر';
$ec_lang['rc_notes_3_def']='جزء من التدفق الكلي يمر عبر مسام الحجارة (تدفق الغطاء q<sub>m</sub>)؛ والباقي يتدفق فوق سطح الصخر (q<sub>s</sub> = q<sub>t</sub> − q<sub>m</sub>). يُحسب عمق التدفق d بتطبيق معادلة Manning على التدفق السطحي q<sub>s</sub> باستخدام خشونة المزلق n. المسامية الافتراضية n<sub>p</sub> = 0.45 نموذجية للصخر المكسور الزاوي.';
$ec_lang['rc_notes_5_term']='نطاق حجم الصخر الصحيح';
$ec_lang['rc_notes_5_def']='طُوِّرت المعادلات باستخدام نطاق D<sub>50</sub> من 15 مم إلى 278 مم. النتائج خارج هذا النطاق تُعدّ استقراءً وينبغي استخدامها بحكم هندسي إضافي.';
$ec_lang['rc_notes_6_term']='منسوب مصطبة المخرج';
$ec_lang['rc_notes_6_def']='ينبغي أن يكون منسوب أعلى حجارة الحماية في قطاع المخرج مساوياً لمنسوب قاع القناة في أسفل المجرى أو أقل منه. إذا كان أعلى، فستكون حجارة المخرج غير مستقرة.';

$ec_lang['rc_notes_7_def']='عندما يكون العمق الطبيعي في قناة المدخل أقل من علو المياه فوق الهدار (H<sub>p</sub>) اللازم لتمرير q<sub>t</sub>، يحدث تدفق مقيّد أو تجمّع للمياه في أعلى مدخل المزلق. هذا مقبول عموماً — فتجمّع المياه يقلل السرعة ويمنع التآكل في أعلى المجرى. للتحقق: استخدم حاسبة تدفق الهدار لإيجاد H<sub>p</sub> لقيمة q<sub>t</sub> وعرض التاج المعطيين، وقارِن الناتج بالعمق الطبيعي لقناة المدخل. إذا تجاوز H<sub>p</sub> العمق الطبيعي، سيحدث تجمّع للمياه.';
$ec_lang['rc_notes_4_term']='المرجع';
$ec_lang['rc_notes_4_def']='Robinson, K.M., Rice, C.E., and Kadavy, K.C. (1998). "<a target="_blank" href="https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf">Design of rock chutes</a>." <em>Transactions of the ASAE</em>, 41(3), 621–626. تنشر وزارة الزراعة الأمريكية (USDA ARS) أيضاً <a target="_blank" href="https://data.nal.usda.gov/dataset/rock-chute-design">جدول Excel</a> يعتمد على نفس الطريقة.';
// Sketch labels
$ec_lang['rc_sketch_filter']          = 'مرشح';
$ec_lang['rc_sketch_top_crest_curve'] = 'منحنى القمة';
$ec_lang['rc_sketch_outlet_apron']    = 'مصطبة المخرج';
$ec_lang['rc_sketch_radius']          = 'نصف القطر';
// Irrigation Pressure Calculator (branch pipe-network pressure/DU estimate). Prefix ip_.
$ec_lang['ip_main_menu']='ضغط الري';
$ec_lang['ip_main_title']='حاسبة ضغط الري وانتظام التوزيع المجانية عبر الإنترنت';
$ec_lang['ip_main_desc']='اختبار ضغط الفرع وتقدير انتظام التوزيع';
$ec_lang['ip_h_supply']='ضغط الإمداد';
$ec_lang['ip_elev_supply']='منسوب الإمداد، z<sub>supply</sub>';
$ec_lang['ip_q_design']='تدفق القطارة التصميمي، q<sub>design</sub>';
$ec_lang['ip_h_design']='ضغط القطارة التصميمي';
$ec_lang['ip_x']='<span class="ec-help" title="0.5 للقطارات القياسية غير المعوَّضة؛ قريب من 0 للقطارات المعوَّضة بالضغط">أس تصريف القطارة، x <span class="ec-tip">؟</span></span>';
$ec_lang['ip_reach_table_heading']='مسار الاختبار';
$ec_lang['ip_group_reach']='قطاع';
$ec_lang['ip_group_upstream']='المنبع';
$ec_lang['ip_group_downstream']='المصب';
$ec_lang['ip_group_loss']='الفاقد';
$ec_lang['ip_is_lateral']='<span class="ec-help" title="مفعّل: هذا القطاع جزء من الخط الجانبي للاختبار الذي تسحب منه القطارات الفردية الماء. معطّل: هذا القطاع خط رئيسي يمرر التدفق فقط إلى خطوط جانبية أخرى لا تقع على مسار الاختبار.">جانبي <span class="ec-tip">؟</span></span>';
$ec_lang['ip_count']='<span class="ec-help" title="صفوف الخطوط الجانبية: القطارات في هذا القطاع فقط. صفوف الخط الرئيسي: إجمالي القطارات في الخطوط الجانبية الأخرى غير هذا الخط، والمتفرعة من هذا القطاع. أما قطاع الخط الرئيسي المنتهي عند الخط الجانبي للاختبار، فيشمل أيضاً أي خطوط جانبية أبعد على طول الخط الرئيسي بعد تلك النقطة، أو التي تشارك الوصلة نفسها (كخط جانبي على الجانب المقابل) — إذ يتفرع تدفقها من هذا القطاع نفسه أيضاً.">قطارات <span class="ec-tip">؟</span></span>';
$ec_lang['ip_length']='L';
$ec_lang['ip_diameter']='D';
$ec_lang['ip_roughness']='e';
$ec_lang['ip_elev_ds']='<span class="ec-help" title="منسوب نهاية هذا القطاع من جهة المصب. اختياري في الصفوف الداخلية (الافتراضي: مستوٍ / نفس منسوب العقدة السابقة إذا تُرك فارغاً). مطلوب في الصف الأخير: هذه القيمة هي منسوب آخر قطارة، وهي التي تحدد ضغط الإمداد المطلوب مباشرة.">منسوب المصب <span class="ec-tip">؟</span></span>';
$ec_lang['ip_elev_ds_missing_warn']='منسوب آخر قطارة (الصف الأخير) تُرك فارغاً وافتُرض مستوياً — أدخله للحصول على نتيجة دقيقة';
$ec_lang['ip_flow']='التدفق';
$ec_lang['ip_press']='ضغط';
$ec_lang['ip_hf']='h<sub>f</sub>';
$ec_lang['ip_hm']='h<sub>m</sub>';
$ec_lang['ip_hl']='<span class="ec-help" title="إجمالي فاقد القطاع، h_f + h_m">h<sub>L</sub> <span class="ec-tip">؟</span></span>';
$ec_lang['ip_pressure_warn']='ضغط منخفض/سالب — تحقق من احتمال وجود حالات دون الضغط الجوي';
$ec_lang['ip_pressure_warn_short']='منخفض';
$ec_lang['ip_pressure_high']='مواقع الضغط المرتفع تحتاج إلى تخفيض الضغط';
$ec_lang['ip_pressure_high_short']='مرتفع';
$ec_lang['ip_max_head']='أقصى ضغط مسموح للأنبوب';
$ec_lang['ip_max_head_tip']='يتم تمييز الخطوط التي يتجاوز ضغطها هذه القيمة. اتركه فارغاً لتخطي فحص الضغط المرتفع.';
$ec_lang['ip_h_far']='ضغط آخر قطارة';
$ec_lang['ip_q_supply']='<span class="ec-help" title="التدفق الداخل إلى مسار الاختبار المنمذج فقط — للمنطقة/النظام كاملاً، انظر Q_zone في تصميم التطبيق أدناه.">تدفق إمداد مسار الاختبار، Q<sub>supply</sub> <span class="ec-tip">؟</span></span>';
$ec_lang['ip_q_critical']='تدفق آخر قطارة، q<sub>last</sub>';
$ec_lang['ip_q_avg_lateral']='متوسط تدفق القطارة (الخط الجانبي للاختبار)، q<sub>avg</sub>';
$ec_lang['ip_dp_avg']='<span class="ec-help" title="مقدار ارتفاع (أو انخفاض) ضغط تشغيل الخط الجانبي المتوسط النموذجي مقارنةً بهذا الخط الجانبي للاختبار، حسب تقديرك. الخط الجانبي للاختبار مفترض عمداً ليكون أسوأ الحالات، لذا فإن متوسطه الخاص يقلل من تقدير متوسط الحقل الفعلي — إذا تُرك عند 0، فإن فحص الانتظام وأرقام تصميم التطبيق أدناه تستخدم متوسط الخط الجانبي للاختبار نفسه (وهو على الأرجح متفائل) كما هو.">فرق الضغط المقدَّر، المتوسط مقابل الخط الجانبي للاختبار <span class="ec-tip">؟</span></span>';
$ec_lang['ip_q_avg_field']='<span class="ec-help" title="يُعاد تقييم q_avg_lateral عند ضغط كل صف من الخطوط الجانبية مضافاً إليه فرق الضغط المُدخل أعلاه — في محاولة لتصحيح كون الخط الجانبي للاختبار هو الحالة الأسوأ المفترضة وليس الممثل الفعلي. يُغذّي كلاً من فحص الانتظام وقسم تصميم التطبيق أدناه.">تدفق القطارة المتوسط الحقلي المقدَّر، q<sub>avg,field</sub> <span class="ec-tip">؟</span></span>';
$ec_lang['ip_du_estimate']='<span class="ec-help" title="تدفق آخر قطارة المحسوب مقسوماً على تدفق القطارة المتوسط الحقلي المقدَّر — هذا تقريب لانتظام التوزيع القياسي للربع الأدنى (متوسط المجموعة الدنيا ÷ متوسط المجتمع)؛ لكنه مأخوذ من عينة نموذجية صغيرة وتصحيح مقدَّر من المستخدم بدلاً من عينة إحصائية ميدانية كاملة. القيم المساوية لـ 1 أو أعلى ممكنة وصحيحة: فهي تعني فقط أن ضغط آخر قطارة يساوي أو يفوق متوسط الحقل المقدَّر، بحيث تكون قطارة أخرى هي نقطة الضغط الأدنى. قد يكون ذلك لأن آخر قطارة تقع في أرض منخفضة أو لأن تقدير فرق الضغط أصغر من اللازم.">فحص الانتظام، q<sub>last</sub>/q<sub>avg,field</sub> <span class="ec-tip">؟</span></span>';
$ec_lang['ip_worst_case_warn']='ضغط القطارة المختبرة أكبر من أو يساوي ضغط الإمداد. من المرجح أن هذه ليست قطارة أسوأ الحالات، أو يمكن استخدام أنابيب أصغر.';
$ec_lang['ip_q_ratio']='<span class="ec-help" title="هذا مختلف عن تقريبنا لمقياس الانتظام القياسي.">تدفق آخر قطارة ÷ التدفق التصميمي، q<sub>last</sub>/q<sub>design</sub> <span class="ec-tip">؟</span></span>';
$ec_lang['ip_no_solution']='لا يوجد حل: ضغط الإمداد المطلوب يتجاوز ضغط الإمداد المُدخل. زِد ضغط الإمداد، أو قلِّل الطلب، أو استخدم أنبوباً أكبر.';
$ec_lang['ip_notes_1_def']='يُخمِّن الضغط عند آخر قطارة (الأبعد)، ثم يتراجع بخط تدرج الطاقة نحو الإمداد، قطاعاً تلو الآخر، مضيفاً فاقد الاحتكاك والفاقد الثانوي في الطريق. يُطرح الارتفاع ورأس السرعة عند كل عقدة للإبلاغ عن الضغط الفعلي هناك. يُعدَّل الضغط المخمَّن عند الطرف البعيد (بطريقة التنصيف) حتى يطابق ضغط الإمداد المطلوب المحسوب ضغط الإمداد المُدخل — وهي نفس مسألة الحلقة المغلقة التي يعالجها محلل تدفق الأنابيب في حاسبة جريان الأنابيب بمعادلة مانينغ، لكن ممتدة إلى شبكة متفرعة.';
$ec_lang['ip_notes_2_term']='قطاعات الخط الرئيسي مقابل الخط الجانبي';
$ec_lang['ip_notes_2_def']='كل صف هو قطاع واحد على طول المسار الهيدروليكي الأسوأ الوحيد (مسار الاختبار) من الإمداد إلى آخر قطارة. قطاع الخط الرئيسي يمرر التدفق فقط إلى الخطوط الجانبية التي لا تقع على مسار الاختبار، لذا فإن سحبه هو ضرب بسيط (التدفق التصميمي × إجمالي عدد القطارات في القطاع) — دون أي حساسية للضغط المحلي. الخط الرئيسي أنبوب جذعي مشترك، لذا يجب أن يشمل قطاع الخط الرئيسي المنتهي عند الخط الجانبي للاختبار ليس فقط الخطوط الجانبية الواقعة بين طرفيه، بل أيضاً أي خطوط جانبية أبعد على طول الخط الرئيسي بعد تلك النقطة، أو تشارك الوصلة نفسها (كخط جانبي على الجانب المقابل) — إذ يمر تدفقها عبر هذا القطاع نفسه قبل أن يتفرع، سواء ظهرت في مكان آخر بهذا الجدول أم لا. أما قطاع الخط الجانبي فهو جزء من الخط الجانبي للاختبار نفسه: يُحسب تصريف القطارة من الضغط المحلي الفعلي عبر المعادلة q = k·H<sup>x</sup>، ويُخفَّض فاقد الاحتكاك بعامل Christiansen F(n) لمراعاة انخفاض التدفق مع سحب كل قطارة في القطاع للماء.';
$ec_lang['ip_notes_3_term']='القيود';
$ec_lang['ip_notes_3_def']='يُنمذج ضغط إمداد ثابتاً واحداً (بلا منحنى مضخة)، ومسار اختبار واحداً فقط (وليس الحقل بأكمله)، ومنحنى قطارة بمعاملين (اضبط الأس قريباً من 0 لتقريب قطارة معوَّضة بالضغط). يُبلَّغ عن نسبتي انتظام مختلفتين، أُبقيتا منفصلتين عمداً: q<sub>last</sub>/q<sub>avg,field</sub> تقريب لانتظام التوزيع القياسي للربع الأدنى (متوسط المجموعة الدنيا ÷ متوسط المجتمع)؛ لكنها مأخوذة من عينة نموذجية صغيرة وتصحيح مقدَّر من المستخدم بدلاً من العينة الإحصائية الميدانية الكاملة القياسية. كذلك، الخط الجانبي للاختبار مفترض عمداً ليكون أسوأ الحالات، لذا فإن متوسطه الخام غير المصحَّح كان سيقلل من تقدير متوسط الحقل الحقيقي ويجعل الانتظام يبدو أفضل مما هو عليه؛ وقد وُضع مُدخل فرق الضغط خصيصاً لموازنة هذا التحيز. تبقى القيم المساوية لـ 1 أو أعلى ممكنة: فهي تعني فقط أن ضغط آخر قطارة يساوي أو يفوق متوسط الحقل المقدَّر، بحيث تكون قطارة أخرى هي نقطة الضغط الأدنى. قد يكون ذلك لأن آخر قطارة تقع في أرض منخفضة أو لأن تقدير فرق الضغط أصغر من اللازم. أما q<sub>last</sub>/q<sub>design</sub> فهو فحص مختلف، غير متعلق بالانتظام، مقابل التدفق المقنَّن من المصنّع — مفيد لكشف نظام مرتفع أو منخفض الضغط عموماً، لكنه فحص منفصل يُقرأ إلى جانب رقم الانتظام، لأن التدفق التصميمي/المقنَّن مستقل عن متوسط ضغط تشغيل النظام الفعلي.';
$ec_lang['ip_notes_4_def']='Christiansen, J.E. (1942). “Irrigation by sprinkling.” California Agricultural Experiment Station Bulletin 670. تستخدم معايير ASAE/ASABE لتصميم الري الدقيق نفس أسلوب حساب فاقد الاحتكاك متعدد المخارج.';
$ec_lang['ip_notes_5_term']='تصميم التطبيق';
$ec_lang['ip_notes_5_def']='يستخدم معدل التطبيق وتدفق النظام/المنطقة تدفق القطارة المتوسط الحقلي المقدَّر (q<sub>avg,field</sub> — متوسط الخط الجانبي للاختبار نفسه، مصحَّحاً بتقدير فرق الضغط المُدخل)، وليس معدلاً مخمَّناً: PR = q<sub>avg,field</sub> / A<sub>e</sub>، مُغذّى بالقيمة النموذجية المصحَّحة. التباعد وأعداد الخطوط الجانبية/القطارات على مستوى النظام مُدخلات منفصلة هنا لأن مسار الاختبار ينمذج فرعاً واحداً فقط هو أسوأ الحالات، وليس كل خط جانبي في الحقل.';



// --- Branched Pipe Network (bpn_) --- English source ---
$ec_lang['bpn_main_menu']='شبكة الأنابيب المتفرعة';
$ec_lang['bpn_main_title']='حاسبة ضغط شبكة الأنابيب المتفرعة المجانية عبر الإنترنت (بدون حلقات)';
$ec_lang['bpn_main_desc']='تدفق وضغط شبكة الأنابيب المتفرعة (الشجرية)';
// Edited by TGH 2026-09-07
$ec_lang['bpn_h_source_tip']='العلو الساكن للإمداد: علو المصدر عند تدفق صفري. مستوى الماء في خزان أو صهريج أعلى من منسوب الإمداد، أو علو الإغلاق لمضخة. أضف نقطتي الإمداد 2 و3 لتحديد منحنى مضخة أو إمداد متغير؛ تقرأ الأداة العلو عند التدفق التصميمي.';
$ec_lang['bpn_elev_source']='منسوب الإمداد';
$ec_lang['bpn_q_total']='إجمالي التدفق';
$ec_lang['bpn_q_total_tip']='إجمالي التدفق الخارج من المصدر (مجموع جميع الطلبات في الشبكة).';
$ec_lang['bpn_p_min']='أدنى ضغط';
$ec_lang['bpn_p_min_tip']='أدنى ضغط مصب في أي مكان بالشبكة؛ وهي نقطة التسليم الحرجة.';
$ec_lang['bpn_method']='طريقة الاحتكاك';
$ec_lang['bpn_method_hw']='Hazen-Williams';
$ec_lang['bpn_method_dw']='Darcy-Weisbach';
$ec_lang['bpn_method_manning']='Manning';
$ec_lang['bpn_line_table_heading']='خطوط الأنابيب';
$ec_lang['bpn_id']='المعرّف';
$ec_lang['bpn_id_tip']='اسم خط الأنبوب هذا. تشير إليه الخطوط الأخرى في عمود المنبع.';
$ec_lang['bpn_upstream']='معرّف المنبع';
// Edited by TGH 2026-09-07
$ec_lang['bpn_upstream_tip']='معرّف الخط الذي يغذي هذا الخط. اتركه فارغاً لمتابعة الخط الذي يعلوه مباشرة (خط أنابيب متسلسل بسيط). أدخل معرّفاً هنا للتفرع من خط آخر.';
$ec_lang['bpn_roughness_tip']='خشونة الأنبوب لطريقة الاحتكاك المختارة: معامل مانينغ n، أو معامل هيزن-وليامز C، أو ارتفاع خشونة دارسي-وايسباخ e (طول). الأنبوب البلاستيكي الأملس النموذجي: n نحو 0.009، وC نحو 150، وe نحو 0.0015 مم.';
$ec_lang['bpn_demand']='الطلب';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_tip']='تدفق ثابت يُسلَّم عند طرف مصب هذا الخط. اتركه فارغاً لخط يكتفي بنقل التدفق إلى ما بعده.';
$ec_lang['bpn_demand_mult']='مضاعف الطلب';
// Edited by TGH 2026-09-07
$ec_lang['bpn_demand_mult_tip']='يُضاعف طلب جميع الخطوط دفعة واحدة، لتشغيل ذروة الساعة أو نمو مستقبلي. استخدم القيمة 1 للطلبات كما أُدخلت.';
$ec_lang['bpn_elev_down']='منسوب المصب';
$ec_lang['bpn_q_line']='تدفق الخط';
$ec_lang['bpn_q_line_tip']='إجمالي التدفق الذي يحمله هذا الخط: طلبه الخاص مضافاً إليه كل طلب مصبّي يغذّيه.';
$ec_lang['bpn_p_down']='ضغط المصب';
// Edited by TGH 2026-09-07
$ec_lang['bpn_p_down_tip']='علو الضغط المقيسي عند عقدة مصب هذا الخط. القيمة السالبة (المميَّزة) تعني ضغطاً دون الضغط الجوي؛ راجع التصميم.';
$ec_lang['bpn_sketch_heading']='مخطط الشبكة';
$ec_lang['bpn_show_length']='الطول';
$ec_lang['bpn_show_diameter']='القطر';
$ec_lang['bpn_show_q']='التدفق';
$ec_lang['bpn_show_p']='الضغط';
$ec_lang['bpn_source_label']='المصدر';
$ec_lang['bpn_line_problem']='هذا الخط غير متصل بالمصدر: فهو يشير إلى معرّف منبع غير معروف، أو يشير إلى نفسه، أو يكرر معرّفاً يستخدمه خط آخر بالفعل، أو يكوّن حلقة. تُترك الخطوط غير المتصلة دون حل.';
$ec_lang['bpn_bad_id_short']='معرّف غير صالح';


$ec_lang['bpn_pressure_warn']='ضغط منخفض/سالب؛ تحقق من احتمال وجود حالات دون الضغط الجوي';
$ec_lang['bpn_pressure_warn_short']='منخفض';
$ec_lang['bpn_notes_1_term']='التسلسل هو الافتراضي، والتفرع هو الاستثناء';
// Edited by TGH 2026-09-07
$ec_lang['bpn_notes_1_def']='اترك معرّف المنبع فارغاً ليتبع الخط الذي يعلوه؛ أي خط أنابيب متسلسل بسيط. أدخل معرّف خط علوي للتفرع منه. إذاً: تسلسل بشكل افتراضي، وشجرة متفرعة عند الحاجة إليها.';
$ec_lang['bpn_notes_2_term']='شبكات متفرعة فقط، بلا حلقات';
$ec_lang['bpn_notes_2_def']='لكل خط خط منبع واحد فقط بالضبط (شجرة). لا تحل هذه الأداة الشبكات الحلقية؛ فتلك تحتاج إلى طرائق تكرارية (مثل EPANET أو ما شابهها). استبعاد الحلقات هو ما يجعل الحل بسيطاً ودقيقاً.';
$ec_lang['bpn_notes_3_term']='بلا عناصر تحكم فعّالة بالضغط';
$ec_lang['bpn_notes_3_def']='يمكنك إضافة صمام ذي فاقد موضعي ثابت (قيمة k)، ولكن ليس صمامات تخفيض الضغط أو مواصلة الضغط (PRV/PSV). فحالة فتحها أو إغلاقها تعتمد على التدفق والضغط، مما يفرض الحل التكراري.';


$ec_lang['bpn_supply2_q']='تدفق الإمداد 2';
$ec_lang['bpn_supply2_h']='علو الإمداد 2';
$ec_lang['bpn_supply3_q']='تدفق الإمداد 3';
$ec_lang['bpn_supply3_h']='علو الإمداد 3';
$ec_lang['bpn_supply_pt_tip']='نقطتا منحنى الإمداد 2 و3 اختياريتان. أدخل تدفقاً وعلواً لكل منهما لتمثيل مضخة، أو أي مصدر ينخفض علوه كلما زاد ما يسلّمه؛ تقرأ الأداة العلو عند التدفق التصميمي. النقطة 1 أعلاه هي العلو الساكن عند تدفق صفري. اترك 2 و3 فارغتين لعلو خزان ثابت.';
$ec_lang['bpn_h_supply']='علو الإمداد';
$ec_lang['bpn_h_supply_tip']='علو المصدر عند التدفق التصميمي، مقروءاً من منحنى الإمداد. يساوي علو المصدر المُدخل عندما يكون المنحنى مستوياً (خزان).';
$ec_lang['bpn_show_elevation']='المنسوب';
$ec_lang['bpn_supply1_h']='العلو الساكن للإمداد';
$ec_lang['lpn_main_menu']='شبكة إمداد المياه';
$ec_lang['lpn_main_title']='حاسبة مجانية عبر الإنترنت لشبكات توزيع المياه بحلّال EPANET';
$ec_lang['lpn_main_desc']='تحليل شبكة إمداد المياه: ارسم شبكة أنابيب حلقية أو استورد ملفات EPANET';
$ec_lang['lpn_title_units']='وحدات {units}';
$ec_lang['lpn_tool_select']='تحديد';
$ec_lang['lpn_tool_add_junction']='ملتقى';
$ec_lang['lpn_tool_add_reservoir']='خزان';
// A TANK is a separate asset from a reservoir (ROADMAP Task 248, 2026-08-14), not a
// reservoir with a level typed into it. A reservoir never runs down; a tank does. A
// steady-state solve cannot tell them apart, which is exactly why the two need different
// names on screen -- the difference is in what happens next, not in this instant.
$ec_lang['lpn_tool_add_tank']='صهريج';
$ec_lang['lpn_tool_add_pipe']='أنبوب';
$ec_lang['lpn_tool_add_pump']='مضخة';
// A VALVE is a LINK, like a pipe and a pump -- it sits in the line between two nodes, not on a
// node (ROADMAP Task 248 phase 2, 2026-08-14). Four types are offered and the page names each one
// by what it does as well as by the abbreviation an engineer already knows, because the letters
// alone teach nobody and the words alone are longer than a modeller wants to read every time.
$ec_lang['lpn_tool_add_valve']='صمام';
$ec_lang['lpn_tool_add_text']='نص';
$ec_lang['lpn_tool_vertices']='نقاط الانعطاف';
// ---- CUSTOMERS: metered demands, lumped at the nearest node (ROADMAP Task 247) ----
// **THE FEATURE IS CALLED CUSTOMER AND NOTHING A PERSON READS SAYS METER** (Tom, 2026-09-18:
// *"This feature's name is Customer"*, and *"we are changing 'Meter' to 'Customer' all over in
// the interface"*). The key names still say meter and that is deliberate: renaming 26 translated
// files buys nothing a reader can see. A Customer is OURS -- EPANET has no such object, so there
// is no industry term to defer to. Everything hydraulic in these strings is EPANET's own word all
// the same -- demand, junction, pipe -- because inventing language an engineer does not recognise
// has been struck here three times. "Station along the pipe" is the survey word for a distance
// measured along a route, which is what it is.
$ec_lang['lpn_tool_add_meter']='مشترك';
$ec_lang['lpn_tool_add_meter_tip']='انقر حيث يقع المشترك، ثم انقر الأنبوب أو العقدة التي تخدمه. يُضاف الطلب الذي تعطيه للمشترك إلى الملتقى عند الطرف الأقرب لذلك الأنبوب.';
$ec_lang['lpn_mode_add_meter']='الوضع: مشترك. انقر حيث يقع المشترك، ثم انقر الأنبوب أو العقدة التي تخدمه. أو استخدم Esc للإلغاء.';
$ec_lang['lpn_pane_tab_customers']='المشتركون';
$ec_lang['lpn_customer_heading']='المشترك {id}';
// ROADMAP Task 247. lpn_field_account and lpn_field_account_tip were DELETED 2026-09-19 (Tom:
// "Didn't I say to trash Account number since they can just make a Custom property for that or
// anything else?" and "Since Customer is a pseudo-node, what if we provide existing properties like
// Description and Tag instead of Account number? Then we aren't inventing something, and we incur no
// language debt."). A customer now carries lpn_field_desc and lpn_field_tag, the two identity
// strings every node and link already uses. Do not re-add an account key: a utility that wants a
// field of its own name makes a custom property.
$ec_lang['lpn_field_meter_demand']='الطلب لكل توصيلة';
$ec_lang['lpn_field_meter_demand_tip']='ما تحتاجه كل توصيلة عند هذا المشترك. يمكن لبحث واستبدال الاستفادة من الفرق بين الفراغ والصفر.';
$ec_lang['lpn_field_meter_count']='عدد التوصيلات';
$ec_lang['lpn_field_meter_count_tip']='عدد التوصيلات المتطابقة التي يمثّلها هذا المشترك الواحد، بحيث يمكن أن تكون اثنتان وأربعون وصلة سكنية منفردة على طول خط رئيسي واحد رمزاً واحداً في مكان واحد. الإجمالي أدناه هو الطلب أعلاه مضروباً بهذا العدد.';
$ec_lang['lpn_field_meter_total']='إجمالي الطلب';
$ec_lang['lpn_field_meter_total_tip']='الطلب لكل توصيلة مضروباً بعدد التوصيلات. هذا هو الرقم المضاف إلى الملتقى المسمّى أدناه.';
$ec_lang['lpn_field_meter_pipe']='العنصر المتصل';
$ec_lang['lpn_field_meter_pipe_suggest']='أقرب عنصر هو {id}. اكتبه هنا لتغذية هذا المشترك منه.';
// Task 247, Tom, 2026-09-25: a service connected exactly to a node reads as a node, never as a
// pipe at station 0 or 100. Shown in place of lpn_field_meter_pipe/station/offset, never beside
// them (renderCustomerFields()).
$ec_lang['lpn_field_meter_node']='متصل بـ';
$ec_lang['lpn_field_meter_node_tip']='الملتقى الذي يتصل به هذا المشترك. اسحب نقطة الاتصال إلى أنبوب لتغذيته بدلاً من ذلك من موضع على طول ذلك الأنبوب.';
$ec_lang['lpn_meter_pipe_unknown']='لا شيء في هذا المشروع اسمه {id}، فتُرك المشترك في مكانه.';
// ROADMAP Task 247. A customer's demand follows a pattern exactly as a junction's does, so the
// heading is the junction's own whole label reused and only the tip is new: what it says that the
// junction's does not is that the number the pattern multiplies is the TOTAL, count included.
$ec_lang['lpn_field_meter_pattern_tip']='كيف يرتفع طلب هذا المشترك وينخفض خلال التشغيل. يُضرب في إجمالي الطلب، فيؤثر في كل توصيلة يمثّلها هذا المشترك. اتركه عند لا يوجد نمط ليتبع نمط الطلب الافتراضي للمشروع.';
$ec_lang['lpn_meter_pattern_unknown']='لا يوجد في هذا المشروع نمط اسمه {id}، فتُرك المشترك كما كان.';
$ec_lang['lpn_meter_placed']='أُضيف المشترك {id}. يُكتب وصفه وطلبه في جدول المشتركين، أو اضغط عليه في وضع التحديد لفتح مربعه.';
$ec_lang['lpn_field_meter_pipe_tip']='العنصر الذي تتصل به هذه التوصيلة. اكتب عنصراً آخر هنا أو في جدول المشتركين لتغييره، أو اسحب نقطة الاتصال إلى عنصر مختلف.';
$ec_lang['lpn_field_meter_station']='الموضع على طول الأنبوب (%)';
$ec_lang['lpn_field_meter_station_tip']='إلى أي مدى على طول الأنبوب تتصل التوصيلة، كنسبة مئوية من الأنبوب من عقدته الأولى إلى الثانية. 0 عند أحد الطرفين و100 عند الآخر. تفعل الدائرة على الأنبوب الشيء نفسه بالمؤشر.';
$ec_lang['lpn_field_meter_offset']='الإزاحة عن الأنبوب';
$ec_lang['lpn_field_meter_offset_tip']='الموجب إلى يمين الأنبوب عند النظر من عقدته الأولى نحو الثانية. كتابة قيمة هنا قد تنقل المشترك إلى الجانب الآخر من الخط الرئيسي، وهي دائماً تجعل خط التوصيلة عمودياً على الخط الرئيسي.';
$ec_lang['lpn_field_meter_lumped']='أُضيف إلى العقدة';
$ec_lang['lpn_field_meter_lumped_tip']='أقرب عقدة؛ تُضاف طلبات هذا المشترك إليها.';
$ec_lang['lpn_node_customers']='طلبات المشتركين';
$ec_lang['lpn_node_customers_tip']='قائمة المشتركين المضافين عند هذه العقدة (لأنها كانت الأقرب). طلبات المشتركين إضافة إلى الطلبات الأخرى المدرجة هنا. يُحرَّر المشترك حيث يقع على الخريطة أو في جدول المشتركين.';
$ec_lang['lpn_node_customers_sum']='{total} {unit} من {n} مشترك';
$ec_lang['lpn_customer_detached']='⚠ هذا المشترك غير متصل بأنبوب، فطلبه غير مدرَج في الإجابات. احذفه، أو ارسم أنبوباً وانقل المشترك إليه.';
$ec_lang['lpn_customer_fixed_head']='⚠ الطرف الأقرب لذلك الأنبوب يحمل سطح ماء ثابتاً، فلا يؤثر هذا الطلب في المحاكاة.';
$ec_lang['lpn_customer_detached_count']='{n} مشتركين غير متصلين بأنبوب. طلبهم غير محتسَب.';
$ec_lang['lpn_meter_pick_pipe']='الآن انقر الأنبوب أو العقدة التي تخدم هذا المشترك. يبقى المشترك حيث وضعته. اضغط Escape للإلغاء.';
$ec_lang['lpn_inp_export_flat_customers']='لا تحتوي ملفات EPANET على مشتركين. يدخل طلب {n} مشتركين في هذا المشروع إلى الملف كصف طلب على الملتقى الذي أُضيف كل منهم إليه، ويُسمّى كل صف بوسم المشترك. ما لا يستطيع الملف الاحتفاظ به هو المشترك نفسه: أين يقع، وأي أنبوب يخدمه، وأين على طول ذلك الأنبوب تتصل التوصيلة، وكم توصيلة يمثّلها مشترك واحد. يحتفظ ملف مشروعك الخاص بكل ذلك.';

$ec_lang['lpn_area_hint_window_start']='انقر زاوية واحدة من النافذة.';
$ec_lang['lpn_area_hint_window_go']='انقر الزاوية المقابلة للإنهاء.';
$ec_lang['lpn_area_hint_lasso_start']='انقر لبدء الخط الحدودي.';
$ec_lang['lpn_area_hint_lasso_go']='حرّك المؤشر لرسم الخط الحدودي. انقر للإنهاء.';
$ec_lang['lpn_area_hint_polygon_start']='انقر لرسم المضلع. انقر نقراً مزدوجاً للإنهاء.';
$ec_lang['lpn_area_hint_polygon_go']='انقر كل زاوية. انقر نقراً مزدوجاً على الزاوية الأخيرة للإنهاء.';
// Tom, 2026-09-08, his own sentence: *"Hold Shift during selection to preserve the existing
// selection set and toggle (add/remove) affected assets."* Reworded so "toggle" needs no gloss.
$ec_lang['lpn_area_hint_shift']='اضغط مع الاستمرار على Shift أثناء التحديد لتتابع التحديد الحالي، فتضيف إليه أو تزيل منه (تبديل) ما تحدده.';
// On a finger a window or a lasso is press, drag, lift (Tom, 2026-09-08); the polygon keeps its
// taps and its own two sentences above.
$ec_lang['lpn_area_hint_touch_start']='اضغط على الخريطة واسحب حول ما تريده، ثم ارفع إصبعك.';
$ec_lang['lpn_area_hint_touch_go']='اسحب حول ما تريده، ثم ارفع إصبعك للإنهاء.';
// The bubble's own dismissal (Tom, 2026-09-08: *"we better make the area help bubble
// dismissable with a 'Show this' checkbox"*). His words, unchanged. The way back is the
// Settings row below, because a checkbox that hides the box it sits in cannot undo itself.
$ec_lang['lpn_area_hint_show']='إظهار هذا';
$ec_lang['lpn_multi_title']='{n} محدد';
$ec_lang['lpn_multi_varies']='متفاوتة';
$ec_lang['lpn_multi_applied']='ضبط {prop} على {n}.';
$ec_lang['lpn_multi_no_fields']='ليس لدى هذه العناصر ما يمكن ضبطه معاً هنا.';
$ec_lang['lpn_pane_pasted']='جرى لصق {n} خلية. لم يتغيّر {skipped}.';
// PASTE THAT ADDS ROWS (Task 610). A block pasted into a table past its last row adds new
// junctions, pipes and so on. {n} is how many rows were pasted, {created} how many of them are new,
// {skipped} how many cells were left as they were.
$ec_lang['lpn_pane_pasted_rows']='لُصق {n} صفاً وأُضيف {created} منها إلى الشبكة.';
$ec_lang['lpn_pane_pasted_rows_skipped']='لُصق {n} صفاً وأُضيف {created} منها إلى الشبكة. لم تتغيّر {skipped} خلية.';
// Added after "This network has none of these yet." on an empty table, which is where a paste lands.
$ec_lang['lpn_pane_paste_here']='انقر هنا والصق صفوفاً من جدول بيانات لإضافتها.';
// The menu action that adds the clipboard's rows as new elements below the last row (an ordinary
// paste only ever writes cells). Its shortcut, Ctrl+Shift+V, is shown beside it in the menu. Tom's
// wording, R-309: "Paste as new rows" was "not quite descriptive of 'Paste append'."
$ec_lang['lpn_pane_paste_append']='لصق كصفوف جديدة في نهاية الجدول';
// Shown after choosing Paste as new rows at end of table from a menu: the page waits for the paste
// keystroke.
$ec_lang['lpn_pane_paste_armed']='اضغط Ctrl+V لإضافة الصفوف المنسوخة في أسفل هذا الجدول. اضغط Esc للإلغاء.';
// Asked when an ordinary paste runs past the last row of a table. {n} is how many rows were
// pasted, {fit} how many land on rows that exist, {extra} how many are left over.
$ec_lang['lpn_pane_paste_overflow']='يحتوي هذا اللصق على {n} صفاً، ويتسع الجدول لـ{fit} منها. هل تريد إضافة الـ{extra} الأخرى كصفوف جديدة في الأسفل؟';
$ec_lang['lpn_pane_paste_overflow_add']='إضافة {extra} صفاً';
$ec_lang['lpn_pane_paste_overflow_fit']='لصق {fit} فقط التي تتسع';
// The same question when the left-over rows could not be added; {reasons} names the rows and why.
$ec_lang['lpn_pane_paste_overflow_bad']='يحتوي هذا اللصق على {n} صفاً، ويتسع الجدول لـ{fit} منها. لا يمكن إضافة الـ{extra} الأخرى كصفوف جديدة: {reasons}';
// Tom's own wording (2026-09-26). Asked when an ordinary paste would change the ID of {n} rows
// that already exist; the buttons are Paste and Cancel.
$ec_lang['lpn_pane_paste_ids_differ']='{n} معرّفاً لا يتطابق. هل تريد اللصق رغم ذلك؟';
// A paste that would add rows is refused whole when any row fails. {reasons} is one or more of the
// Row sentences below, each naming the row of the pasted block, counted from 1.
$ec_lang['lpn_pane_paste_refused']='لم يُلصَق شيء. {reasons}';
$ec_lang['lpn_pane_paste_more']='صفوف بها مشكلات ولم تُعرض هنا: {n}.';
$ec_lang['lpn_pane_paste_no_id']='الصف {row}: يحتاج الصف الجديد إلى معرّف.';
$ec_lang['lpn_pane_paste_bad_id']='الصف {row}: يحتوي المعرّف {id} على مسافة أو علامة اقتباس.';
$ec_lang['lpn_pane_paste_id_taken']='الصف {row}: المعرّف {id} مستخدَم بالفعل.';
$ec_lang['lpn_pane_paste_id_twice']='الصف {row}: استُخدم المعرّف {id} مرتين في هذا اللصق.';
// {first} and {second} are the project's two coordinate names, such as Latitude and Longitude.
$ec_lang['lpn_pane_paste_no_position']='الصف {row}: تحتاج العقدة الجديدة إلى كل من {first} و{second}.';
$ec_lang['lpn_pane_paste_no_ends']='الصف {row}: يحتاج الرابط الجديد إلى عقدة من وعقدة إلى.';
$ec_lang['lpn_pane_paste_no_node']='الصف {row}: العقدة {id} غير موجودة بعد. الصق عُقَدك أولاً، ثم روابطك.';
$ec_lang['lpn_pane_paste_same_ends']='الصف {row}: العقدتان من وإلى هما العقدة نفسها.';
// {text} is what was pasted and {col} is the column heading, with its unit, such as Diameter (in).
$ec_lang['lpn_pane_paste_bad_cell']='الصف {row}: {text} ليست {col} صالحة.';
// A new Text's position, the same rule paste-creates-rows gives a new node ({first}/{second} are
// the project's two coordinate names).

// {id} is what the Text table's own Attached to cell named.






$ec_lang['lpn_pane_filled']='عُبّئت إلى الأسفل {n} خلية. لم تتغيّر {skipped}.';
$ec_lang['lpn_pane_filldown']='تعبئة إلى الأسفل';
$ec_lang['lpn_pane_fill_none']='لا شيء في هذا التحديد يمكن تعبئته إلى الأسفل.';
$ec_lang['lpn_pane_ctrlenter_filled']='عُبّئت {n} خلية. لم تتغيّر {skipped}.';
$ec_lang['lpn_pane_hide_col']='إخفاء هذا العمود';
$ec_lang['lpn_pane_hide_cols']='إخفاء هذه الأعمدة';
$ec_lang['lpn_pane_show_all_cols']='إظهار كل الأعمدة';
$ec_lang['lpn_pane_sort_asc']='الفرز تصاعدياً';
$ec_lang['lpn_pane_manage_cols']='إدارة الأعمدة…';
$ec_lang['lpn_pane_manage_cols_title']='إدارة الأعمدة';
$ec_lang['lpn_pane_manage_cols_show']='إظهار';
$ec_lang['lpn_pane_manage_cols_up']='نقل لأعلى';
$ec_lang['lpn_pane_manage_cols_down']='نقل لأسفل';
$ec_lang['lpn_pane_manage_cols_top']='نقل إلى البداية';
$ec_lang['lpn_pane_manage_cols_bottom']='نقل إلى النهاية';
$ec_lang['lpn_pane_colmenu_tip']='إخفاء الأعمدة أو إدارتها';
$ec_lang['lpn_pane_sortarrow_tip']='عكس الفرز';
$ec_lang['lpn_tool_area_window']='تحديد بنافذة';
$ec_lang['lpn_tool_area_lasso']='تحديد حر';
$ec_lang['lpn_tool_area_polygon']='تحديد بمضلع';
$ec_lang['lpn_tool_delete']='حذف';
$ec_lang['lpn_tool_zoom_extent']='إظهار الكل';
$ec_lang['lpn_tool_zoom_window']='تكبير منطقة';
$ec_lang['lpn_zoom_in']='تكبير';
$ec_lang['lpn_zoom_out']='تصغير';
$ec_lang['lpn_new_text']='نص';
$ec_lang['lpn_field_text_bold']='نص عريض';
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

$ec_lang['lpn_field_text_align']='المحاذاة الأفقية';
$ec_lang['lpn_field_text_align_left']='يسار';
$ec_lang['lpn_field_text_align_center']='وسط';
$ec_lang['lpn_field_text_align_right']='يمين';
$ec_lang['lpn_field_text_valign']='المحاذاة الرأسية';
$ec_lang['lpn_field_text_valign_top']='أعلى';
$ec_lang['lpn_field_text_valign_middle']='وسط';
$ec_lang['lpn_field_text_valign_bottom']='أسفل';
$ec_lang['lpn_field_text_rotation']='الزاوية (بالدرجات)';
$ec_lang['lpn_field_text_match_pipe']='الدوران إلى زاوية أقرب وصلة';
$ec_lang['lpn_field_text_flip']='قلب 180°';
// A Text object may follow a junction, reservoir or tank, or a station along a pipe, pump or
// valve (Task 502). This row names what it is following. OUR VOCABULARY: the element is a Text.
$ec_lang['lpn_field_text_attached']='العنصر المرفق';
// **THE TIP CARRIES THE MISSING ROWS** (Tom, 2026-09-08: *"in its properties, there are no
// alignment selectors. An old text does have alignment selectors."*). A Text placed near a node or
// a pipe follows it, and an attached Text is not offered the two alignment rows (his own 2026-08-18
// ruling: the leader decides). Nothing said so, so two Texts that look alike offered different
// controls; this row already states the attachment, so it is where the consequence belongs.
$ec_lang['lpn_field_text_attached_tip']='وُضع هذا النص قريباً بما يكفي من عنصر ليتبعه، فهو يتحرك مع ذلك العنصر وله خط قائد. يأخذ النص الموجود على خط قائد محاذاته الأفقية والرأسية من الجانب الذي يقع عليه، ولهذا لا يُعرض هذان الصفان أثناء ارتباطه.';
// **A JUNCTION'S OWN EMITTER, THE ROW THAT WAS MISSING** (Task 191; Tom, 2026-09-08: *"emitter
// coeff. ... should be under Node properties."*). EPANET states the coefficient per junction and
// the exponent once for the whole model, which is why only the second had a control.
// runtime: units appended -- the page writes the flow and pressure unit tokens after the label, so
// the value names no unit itself.
$ec_lang['lpn_field_emitter']='معامل القطارة';
$ec_lang['lpn_field_emitter_tip']='تدفق خارجي إضافي يعتمد على الضغط، لرشاش أو مخرج مفتوح أو تسرّب يُحاكى. التدفق الذي يطلقه هو هذا المعامل مضروباً بالضغط مرفوعاً إلى أُس القطارة، الذي يُحدَّد مرة واحدة للشبكة كلها ضمن الإعدادات، الحساب، الهيدروليكا. اتركه فارغاً في ملتقى عادي.';
$ec_lang['lpn_field_elev']='المنسوب';
// Task 193 trap-term tips. Every one of these is a DEFINITION the user can read, which is also
// what anchors the concept for the 26 translators in sprint 146.06 -- per CLAUDE.md's polysemy
// protocol, a visible tip is the preferred home for a definition, in place of an $ec_lang_syn
// entry carrying translatable payload nobody on the page can see.
$ec_lang['lpn_field_elev_tip']='منسوب الأرض أو الأنبوب عند هذه العقدة. قسه من أي نقطة صفر تختارها، طالما استخدمت جميع العقد النقطة نفسها.';
// A reservoir carries an elevation AND a head. Leaving the head blank means "the water surface is
// at the reservoir's own elevation"; the placeholder string is what shows in that empty box.
// This USED to read "so it doubles as a tank" (Tom, 2026-07-30), which was true only while there
// was no tank. Since Task 248 there is one, and the two are different assets: a reservoir's level
// never moves, a tank's does. Raising a reservoir's head is still a legitimate thing to do -- it is
// just not how you model storage any more.
$ec_lang['lpn_field_head']='العلو';
// 'head' is a documented trap term in glossary.json (anatomical head; pressure). The tip says
// outright that it is a height and not a pressure, which is the exact confusion the glossary's
// avoid list guards against.
$ec_lang['lpn_field_head_tip']='منسوب سطح الماء في الخزان، ويُقاس كارتفاع لا كضغط. اتركه فارغاً لجعل سطح الماء عند منسوب الخزان.';
// ---- Tank fields (Task 248) ----
// EVERY ONE OF THESE IS A HEIGHT IN THE ELEVATION/HEAD UNIT, the tank diameter included, and each
// tip says so in words a reader can act on. The diameter is the one that catches people: it is a
// distance across the ground of the same order as the elevations beside it, so reading it in the
// pipe-diameter unit would put a 15 m tank on screen as 15000. Same reason the three levels say
// "measured up from the tank bottom" rather than leaving the datum to be guessed -- EPANET measures
// a tank level from the vessel floor, not from the same zero the elevations use.
$ec_lang['lpn_tank_elev_tip']='منسوب قاع الصهريج. تُقاس أعماق الماء في الصهريج ارتفاعاً من هذه النقطة.';
$ec_lang['lpn_field_tank_level']='عمق الماء';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_level_tip']='عمق الماء الراكد في الصهريج، ويُقاس ارتفاعاً من قاع الصهريج. سطح الماء هو منسوب قاع الصهريج زائداً هذا العمق.';
$ec_lang['lpn_field_tank_minlevel']='أدنى عمق للماء';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_minlevel_tip']='عمق الماء الذي يُعامل عنده الصهريج كفارغ، ويُقاس ارتفاعاً من قاع الصهريج.';
$ec_lang['lpn_field_tank_maxlevel']='أقصى عمق للماء';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_maxlevel_tip']='عمق الماء الذي يكون عنده الصهريج ممتلئاً، ويُقاس ارتفاعاً من قاع الصهريج.';
$ec_lang['lpn_field_tank_diameter']='قطر الصهريج';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tank_diameter_tip']='عرض الصهريج من جانب إلى آخر. يُقاس بنفس وحدات المنسوب، لا بوحدات قطر الأنبوب. يحدد كمية الماء التي يحملها عمق معين.';
// 'head' is a documented trap term in glossary.json. This tip names it as a level, which is the
// same guard lpn_field_head_tip carries for the reservoir.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tank_head_tip']='منسوب سطح الماء في الصهريج: منسوب قاع الصهريج زائداً عمق الماء. هذا هو المنسوب الذي يستخدمه الحلّال للصهريج.';
$ec_lang['lpn_close']='إغلاق';
// The property popup's own name, in its drag bar (Tom, 2026-09-08: *"maybe the right title is
// 'Properties'"*). It names the BOX, not the element in it: lpn_popup_title below the bar carries
// the element's id and its rename box, and the two are read one under the other.
$ec_lang['lpn_popup_boxtitle']='الخصائص';
$ec_lang['lpn_empty_hint']='استخدم ملف، مشروع جديد لفتح مثال. أو ابدأ بإضافة خزان وملتقى وأنبوب من شريط الأدوات.';
// ROADMAP Task 647, Tom 2026-09-13: a project with elements, none of which the current view can
// see, reads exactly like a lost project unless something says otherwise. Shown in a centred
// overlay on the map (see #lpn_offscreen_notice in Looped-Network.php), paired with a "Zoom to
// fit" button that reuses lpn_tool_zoom_extent rather than a second copy of that string.
$ec_lang['lpn_offscreen_intact']='شبكتك سليمة.';
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
$ec_lang['lpn_examples_welcome']='مرحباً بك في نمذجة شبكات إمداد المياه، بحلّال EPANET';
$ec_lang['lpn_examples_heading']='فتح مثال';
$ec_lang['lpn_examples_sub']='يُفتح كل مثال كنسخة خاصة بك. عدّلها واحفظها، أو افتح نسخة جديدة وابدأ من جديد.';
$ec_lang['lpn_examples_open']='فتح';
$ec_lang['lpn_examples_menu']='فتح مثال…';
$ec_lang['lpn_examples_blank']='أو ابدأ بخريطة فارغة';
// The SAME exit, worded for the other way in. Opened from File the user already has work on
// screen, so "start with a blank map" reads as "discard it" and they do not dare press the
// only button that leaves (Tom, 2026-08-17: "I can't back out of the gallery... I am forced to
// open an example"). Closing never touches a project either way.
$ec_lang['lpn_examples_close']='إغلاق';
$ec_lang['lpn_examples_size']='العقد: {nodes}، الوصلات: {links}';
$ec_lang['lpn_examples_failed']='تعذّر تحميل الأمثلة. استخدم ملف، مشروع جديد لبدء رسم جديد.';
$ec_lang['lpn_examples_loading']='جارٍ تحميل الأمثلة…';
// Two new Help rows (Tom, 2026-08-14). "Fix something" is a VERB, which is the point: it invites
// the small correction people actually send -- a wrong word, a bad number -- rather than sounding
// like a request for money or code, which is what "Contribute" reads as to most visitors. It opens
// contact.php, the same place the old page-bottom invitation went.
$ec_lang['lpn_help_fix']='إصلاح شيء ما';
$ec_lang['lpn_help_notes']='ملاحظات حول هذه الصفحة';
// ---- The one-tap grievance link (ROADMAP Task 207, Rung 0) ----
// The floor of the cost ladder in dev/dilettante-path.md: a visitor says something is wrong here
// with one tap and nothing typed. Two sites, one behaviour -- a standing cell in the map's bottom
// strip, and the same control inside the solver's diagnostic box when one is on screen.
// THE TIP SAYS EXACTLY WHAT THE TAP SENDS, because a control that posts on one press and does not
// say what it posts is asking for trust it has not earned. It also says no reply is coming, which
// is the honesty boundary that document draws: a thank-you must never imply an answer.
$ec_lang['lpn_wrong_btn']='هل هناك خطأ هنا؟';
// Edited by TGH 2026-09-07
$ec_lang['lpn_wrong_tip']='ضغطة واحدة تخبرنا أن شيئاً في هذه الصفحة خاطئ. تُرسل اسم هذه الصفحة، واللغة التي تقرؤها بها، ورسالة الخريطة إن وُجدت. لا تُرسل شيئاً كتبته، ولا عنواناً، ولا أي شيء من رسمك. لا يمكن لأحد أن يرد عليك، لأن هذا لا يخبرنا شيئاً عن هويتك. استخدم المساعدة، إصلاح شيء ما حين تريد أن تقول المزيد.';
$ec_lang['lpn_wrong_thanks']='شكراً لك. وصلتنا رسالتك.';
$ec_lang['lpn_status_example_opened']='تم فتح {name}. هذه نسختك الخاصة: احفظها باستخدام ملف، حفظ باسم.';
// Stands while the fault stands, rather than expiring like every other notice on the map: it
// reports a page that cannot lay itself out, which is true until a measurement recovers.
$ec_lang['lpn_map_unmeasurable']='تعذّر على هذه الصفحة تحديد حجم منطقة الرسم، فالخريطة تعرض آخر منظر تمكّنت من حسابه. تغيير حجم النافذة يجعلها تحاول مجدداً. إذا استمر حدوث ذلك، فالسبب المعتاد هو إضافة متصفح تمنع قياسات الصفحة.';
// Each example's own card text. These live here, and NOT in the examples folder's own JSON, for one
// reason: a string that is not in a lang file is a string no translator will ever see. The manifest
// carries the English as a fallback for an example that has no keys yet, so a new example still
// shows up in English the moment its file is dropped in.
// FLOW UNIT FIRST in each description (Tom, 2026-08-14: "list flow units first for two reasons:
// EPANET and clarity"). EPANET identifies a whole unit system by its flow unit -- its [OPTIONS]
// setting is literally GPM or LPS, never "US" or "SI" -- so a water engineer reads the flow unit as
// the name of the system, and the length units as detail that follows from it.
$ec_lang['lpn_ex_basic_si_title']='شبكة أساسية، ل/ث (متري)';
$ec_lang['lpn_ex_basic_si_desc']='ابدأ من هنا. خزان ومضخة وحلقة صغيرة: أصغر ترتيب لا يزال يعمل كشبكة مياه. باللتر في الثانية، وبالمتر والمليمتر.';
$ec_lang['lpn_ex_basic_us_title']='شبكة أساسية، gpm (أمريكي)';
$ec_lang['lpn_ex_basic_us_desc']='الشبكة نفسها بالغالون في الدقيقة، وبالقدم والبوصة.';
// **NOT PLAIN EPA Net1 ANY MORE, AND THE TITLE SAYS SO** (Tom, 2026-09-08: *"Net1 plus rule-based
// controls: OK"*). Two `[RULES]` were added to the shipped file so the rule editor can be exercised
// from the gallery; the rules stay, and the name stops claiming to be the sample as EPA ships it.
$ec_lang['lpn_ex_net1_title']='EPANET Net1';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net1_desc']='أصغر شبكات EPANET النموذجية الثلاث: خزان واحد، ومضخة، وحلقة واحدة.';
$ec_lang['lpn_ex_net2_title']='EPANET Net2';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net2_desc']='شبكة توزيع متفرعة تحتوي على صهريج، من أمثلة EPANET.';
$ec_lang['lpn_ex_net3_title']='EPANET Net3';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ex_net3_desc']='أكبر أمثلة EPANET: 92 ملتقى، و3 صهاريج، وخزانان أحدهما نهر. تستحق الفتح لرؤية شكل نموذج بحجم حقيقي على الخريطة.';
$ec_lang['lpn_ex_net3_world_title']='EPANET Net3، خط العرض وخط الطول';
$ec_lang['lpn_ex_net3_world_desc']='نفس شبكة EPANET Net3، مثبَّتة في موضع عشوائي على الكرة الأرضية: إحداثياتها خط عرض وخط طول، وتُرسم خريطة شوارع خلفها.';
$ec_lang['lpn_ex_elm_street_title']='مركز شارع إلم';
$ec_lang['lpn_ex_elm_street_desc']='موقع تجاري تم حله لتدفق الحريق فوق أقصى طلب يومي، في لحظة زمنية واحدة، مرسوم فوق مخطط الموقع.';
$ec_lang['lpn_tool_undo']='تراجع';
$ec_lang['lpn_confirm_example']='سيؤدي هذا إلى إضافة المثال إلى الشبكة الموجودة لديك بالفعل. هل تريد المتابعة؟';
$ec_lang['lpn_field_diameter']='القطر';
$ec_lang['lpn_demand_tip']='التدفق المسحوب من الشبكة عند هذه العقدة. أدخل رقماً سالباً للتدفق المضاف إلى الشبكة هنا.';
// **THE UNITS STRIP IS TWO GROUPS** (Task 422). The first decides what the numbers in the document
// MEAN, so changing one is a model change and the page asks first; the second is how results are
// read, and changes with no fanfare. Three quantities appear in both because they serve both sides.
// The question an INPUT unit change asks, in Tom's own wording (2026-08-18, Task 425) rather than a
// paraphrase of it: name the quantity, list the fields it decides ONE PER LINE, then name the two
// answers by what they do to the numbers already typed. {unit} is a unit name; the field names are
// built by the page and are no longer a placeholder inside a sentence, which is why the lead is a
// NEW key rather than an edit of `lpn_units_warn_body`. Editing that one in place would have left
// 26 translations carrying a {list} the page no longer fills, and a literal "{list}" on the map.
$ec_lang['lpn_units_warn_title']='هذه الوحدة تحدد معنى مدخلاتك';
$ec_lang['lpn_units_warn_lead']='{unit} هي وحدة ما تُدخله في:';
$ec_lang['lpn_units_options_head']='عند تغيير الوحدة:';
// Each option's sentence opens with the word on its own button, so the button and the explanation
// say the same word. Non-destructive is the suite's standing behaviour and the first button;
// Destructive is the opt-in, and says out loud both what it costs and that Undo undoes it.
$ec_lang['lpn_units_nondestructive']='غير إتلافي';
$ec_lang['lpn_units_nondestructive_desc']='غير إتلافي: يترك كل مُدخل كما هو ويعيد تفسيره بالوحدة الجديدة.';
$ec_lang['lpn_units_destructive']='إتلافي';
$ec_lang['lpn_units_destructive_desc']='إتلافي: يعيد كتابة كل مُدخل بتحويل رياضي، بحيث تبقى الشبكة قريبة فيزيائياً من حالتها، ضمن هوامش التحويل. يفقد هذا الخيار المُدخلات الأصلية. التراجع يعيدها.';
// {n} is a whole number.
$ec_lang['lpn_status_reinterpreted']='أصبحت {n} قيمة تعني الآن {unit}. لم يُعَد كتابة أي شيء.';
$ec_lang['lpn_status_converted']='أُعيدت كتابة {n} قيمة بوحدة {unit}.';
// The toolbar's one-control colour-by-value (Task 327). No label of its own: the select's own
// options say what it does, and the toolbar is where space is scarcest.
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_color_tip']='لوّن الشبكة حسب كمية واحدة، بحيث تُقرأ خريطة كبيرة بنظرة واحدة. الضغط والسرعة هما ما يهم عادة.';
// **LENGTH ONLY** (Task 693, folded into 696; Tom 2026-09-18: *"when the map unit is lat/lon, this
// unit label is a lie"*). What the coordinates are in is a separate, derived, read-only line below.
$ec_lang['lpn_units_length']='الطول وإحداثيات الخريطة';
// The derived line: degrees for lat/lon, the coordinate system's own unit for an EPSG plane, and
// the length unit for a local grid. A display of what the coordinate system says, never an input.
$ec_lang['lpn_units_mapcoords']='إحداثيات الخريطة';
$ec_lang['lpn_units_mapcoords_deg']='درجات';
$ec_lang['lpn_units_usft']='قدم المساحة الأمريكي';
$ec_lang['lpn_units_elevhead']='المنسوب والعلو';
$ec_lang['lpn_units_pressure']='الضغط';
$ec_lang['lpn_units_flow']='التدفق';
$ec_lang['lpn_units_velocity']='السرعة';
// Head loss GRADIENT (headloss/length, dimensionless -- grade or gradePercent, same options as
// mpf_/mphl_'s 'slope' family but lpn_'s own 'gradient' family so it can default to gradePercent)
// alongside the existing total head loss (ROADMAP Task 177, Tom agreed 2026-07-30) -- matches
// mpf_/mphl_'s own friction-slope convention rather than inventing a per-1000-length form.
$ec_lang['lpn_result_gradient']='تدرج فقدان الضغط';
$ec_lang['lpn_result_gradient_tip']='فقدان الضغط مقسوماً على طول الأنبوب. استخدمه لمقارنة الأنابيب ذات الأطوال المختلفة بحد تصميم واحد.';
$ec_lang['lpn_result_water_age']='عمر الماء';
$ec_lang['lpn_result_water_age_tip']='المدة التي قضاها الماء الواصل إلى هذه النقطة داخل الشبكة. حيث تلتقي التدفقات، يحمل الماء الوارد مزيجاً من الأعمار، والرقم هنا هو متوسطها مرجَّحاً بالتدفق: فالملتقى الذي يغذيه في الغالب خط رئيسي قصير وحديث يُظهر عمراً منخفضاً حتى لو غذّاه أيضاً طرف ميت طويل. في الصهريج هو متوسط عمر الماء المحفوظ فيه، ولهذا يكون الصهريج البطيء التبدّل عادة أقدم ماء في الشبكة. لا يوجد حدّ تنظيمي تقارن به هذا الرقم، فاحكم عليه وفق شبكتك أنت.';
$ec_lang['lpn_result_source_share']='حصة المصدر';
$ec_lang['lpn_result_source_share_tip']='مقدار الماء الواصل إلى هذه النقطة الذي جاء من عقدة التتبع. هذا ما يبلّغه تحليل تتبع المصدر.';
// **THE LINK HALF OF THE THREE QUALITY ANSWERS** (ROADMAP Task 638). EPANET reports a node's own
// value and a LINK's AVERAGE over the water standing in it, so the two are different quantities and
// take different words. Three whole names rather than one name built from a word and a heading: a
// label composed at render time breaks in a gendered, a word-order and a right-to-left language,
// which is the rule in CLAUDE.md under Concept-level label reuse.
$ec_lang['lpn_result_avg_water_age']='متوسط عمر الماء';
$ec_lang['lpn_result_avg_source_share']='متوسط حصة المصدر';
$ec_lang['lpn_result_avg_concentration']='متوسط التركيز';
// EPANET's own two link report columns, in EPANET's own words. A friction factor is the
// dimensionless Darcy-Weisbach f the head loss along this link works out to, whichever friction
// method produced the loss, so it has no unit and never crosses one.
$ec_lang['lpn_result_friction_factor']='معامل الاحتكاك';
// **EPANET'S OWN COLUMN NAME, AND THE FIFTH OF ITS LINK REPORT COLUMNS** (ROADMAP Task 652). Not a
// plainer synonym: reaction rate is the term of art an engineer reads on a report, and the number
// shown IS EPANET's own, read off the binary output file it prints that report from. One key and
// no tip beside it, because a link result has no popup row to hang one on -- the two facts a
// reader needs (that it is a MAGNITUDE, and that its unit is the stated concentration per day) are
// carried by the unit mark the legend prints and by dev/water-quality.md until there is a row.
$ec_lang['lpn_result_reaction_rate']='معدل التفاعل';
$ec_lang['lpn_result_status']='الحالة';
$ec_lang['lpn_result_status_open']='مفتوح';
$ec_lang['lpn_result_status_closed']='مغلق';
$ec_lang['lpn_result_head']='العلو';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_head_tip']='طاقة الماء عند هذه العقدة، معبَّراً عنها كارتفاع عمود ماء. هي ارتفاع لا ضغط.';
$ec_lang['lpn_result_pressure']='الضغط';
$ec_lang['lpn_result_flow']='التدفق';
$ec_lang['lpn_result_velocity']='السرعة';
$ec_lang['lpn_result_headloss']='فقدان الضغط';
// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all projects
// (Settings panel) -- get THREE tips, not one shared one. The shared version claimed they had to be
// "used together" to reach a first-time-visitor state; that is false (Tom caught it 2026-07-31).
// Settings live INSIDE each project document, so deleting every project deletes every setting too:
// Delete all projects alone is the full reset, exactly as init()'s own comment says. Each tip now
// states only its own scope, so none of them can be wrong about the others -- and no tip quotes
// another button's label, which is the cross-key dependency lpn_empty_hint was fixed for.
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_restore_tip']='يعيد ضبط إعدادات هذا المشروع فقط. لا يتغيّر رسمك ولا مشاريعك الأخرى. لحفظ إعداداتك المفضّلة لإعادة استخدامها، احفظ ملف مشروع لا يحتوي إلا على الإعدادات.';
$ec_lang['lpn_reset_all_tip']='يحذف كل مشروع، وكل صورة خلفية، وكل إعداد، واختياراتك للوحدات، ثم يعيد تحميل الصفحة تماماً كما يراها زائر لأول مرة. هذا هو إعادة الضبط الوحيدة التي تمسح كل شيء.';
// `lpn_tool_clear`, `lpn_tool_clear_tip` and `lpn_confirm_clear` were REMOVED by Task 211 with the
// "Clear project" command itself -- see lpn_edit_delete_network for what replaced it and why.
// Task 263's one-time migration offer. Shown ONCE, on opening a project saved before inputs
// stopped being converted, and never again whatever the answer. Plain text only -- it is built with
// textContent into the dialog body.
$ec_lang['lpn_v2_restore_confirm']='تخزّن هذه الحاسبة وحدات المشروع ومدخلاته كما أُدخلت، لكنها كانت سابقاً تحوّل الأرقام إلى النظام الدولي للوحدات (SI) عند التخزين. حُفظ هذا المشروع قبل ذلك التغيير، لذا كانت أرقامه مخزَّنة بالنظام الدولي. هل تريد تحويلها مرة أخيرة إلى الوحدات الحالية؟ لتتمكّن من الحكم، إليك بعض الأقطار التي ستُحوَّل، بقيمها قبل التحويل وبعده:';
$ec_lang['lpn_v2_restore_yes']='تحويل';
$ec_lang['lpn_v2_restore_never']='لا. لا تسألني مرة أخرى.';
$ec_lang['lpn_v2_restore_no']='إغلاق لأتحقق أولاً من الوحدات الحالية';
$ec_lang['lpn_storage_too_new']='حُفظ هذا المشروع بإصدار أحدث من الصفحة، لذا لا يمكن فتحه هنا.';
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
$ec_lang['lpn_tool_file']='ملف';
$ec_lang['lpn_menu_edit']='تحرير';
$ec_lang['lpn_menu_insert']='إدراج';
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
$ec_lang['lpn_menu_map']='الخريطة';
// The street map behind a geographic project (ROADMAP Task 145). "Street map" rather than
// "basemap": a person who has never used GIS knows what a street map is.
//
// **THE MENU'S OWN HIDE/SHOW ROWS RETIRED 2026-09-22** (Tom: "I think we can retire the Hide/Show
// street map and satellite images rows. Detach and attach provide the same functionality."). Map,
// World map, Attach/Detach is now the on/off switch for every project kind. These two SHOW keys
// stay because the corner teaser (refreshBasemapTeaser()) still uses them for its street/satellite
// swap; lpn_basemap_hide, lpn_basemap_satellite_hide, lpn_basemap_tip and lpn_basemap_satellite_tip
// were deleted with the rows -- nothing else read them.
$ec_lang['lpn_basemap_show']='إظهار خريطة الشوارع';
$ec_lang['lpn_basemap_satellite_show']='إظهار الصور الفضائية';
// **THE PAIR OF NOUNS IS 'local' and 'georeferenced', LOWER CASE** (Tom's own edit of this block,
// 2026-09-16, dev/tom-coordinate-vocabulary-2026-09-16.md: *"The terms we need to use are
// 'Georeferenced' vs. 'Local or Arbitrary'"*). They replaced 'lat/lon' and 'xy'. Nothing renders
// these two: they are the ONE rendering of each project kind that every other string naming it must
// agree with, inside each language, and dev/scripts/mode_name_check.php reads them for exactly that.
$ec_lang['lpn_geomap']='مُسند جغرافياً';
$ec_lang['lpn_xymap']='محلي';
// **ONE ROW FOR UNITS AND COORDINATES** (Task 696, Tom 2026-09-23: *"Combine: 693 and 688 with 696
// as a single wizard"*). The placement steps follow only when the coordinate system changes.
$ec_lang['lpn_file_convert_as']='تحويل باسم…';
// **HIS OWN NAME FOR THE COPY** (Tom, 2026-09-18): the command belongs to the Save as family,
// so its result is a second version of this project and is named the way a second version is.
$ec_lang['lpn_copy_of']='نسخة من {name}';
// ---- THE CONVERT AS BOX (Task 696) ------------------------------------------------------------
// The three coordinate cases are Tom's own (R-155, 2026-09-22): "EPSG, unnamed (local) georeference,
// and not georeferenced". lat/lon is one EPSG system (EPSG:3857 on this page), not a fourth case.
$ec_lang['lpn_convas_title']='تحويل باسم';
$ec_lang['lpn_convas_coordsys_tip']='نظام الإحداثيات الذي تُحوَّل إليه النسخة. عندما يختلف عن نظام هذا المشروع، تتبعه خطوتا وضع. يفتح المشروع الذي يعرف موقعه بالفعل كلتا الخطوتين مُجابتين مسبقاً، فيمكنك قبولهما كما هما أو إجراء تغييرات.';
// {crs} is the name the map status strip shows for this project's coordinate system.
$ec_lang['lpn_convas_from']='الحالي: {crs}';
$ec_lang['lpn_convas_epsg']='نظام إحداثيات EPSG';
$ec_lang['lpn_convas_epsg_tip']='اختر نظام إحداثيات من سجل EPSG. خط العرض وخط الطول هو WGS 84 (EPSG:4326).';
$ec_lang['lpn_convas_unnamed']='إسناد جغرافي محلي بلا اسم';
$ec_lang['lpn_convas_unnamed_tip']='إحداثيات محلية بوحدة الطول، مع إرفاق خريطة العالم.';
$ec_lang['lpn_convas_none_tip']='إحداثيات محلية بوحدة الطول، دون خريطة عالم حالياً.';
$ec_lang['lpn_convas_units_tip']='الوحدات التي تُحوَّل إليها النسخة. تحتفظ الأصلية بأرقامها ووحداتها الخاصة.';
$ec_lang['lpn_convas_round']='تقريب القيم المحوَّلة';
$ec_lang['lpn_convas_round_tip']='يقرّب فقط الأرقام التي تعيد هذه العملية كتابتها، إلى أقرب خطوة تختارها. تُترك القيم التي لا تتغيّر وحدتها كما هي.';
$ec_lang['lpn_convas_round_none']='بلا تقريب';
$ec_lang['lpn_convas_round_flow']='الطلب والتدفق';
$ec_lang['lpn_convas_label_col']='اللاحقة';
$ec_lang['lpn_convas_label_tip']='نص يُضاف بعد هذه القيمة في تسميات خريطة النسخة، مثل \' mm\' أو \' gpm\'. مُعبَّأ مسبقاً من الوحدة المختارة أعلاه؛ امسحه لعدم وجود لاحقة.';
$ec_lang['lpn_convas_oneway']='التحويل إلى الوراء تحويل ثانٍ، وليس تراجعاً. قد لا يعود الرقم المحوَّل ثم المُعاد تحويله كما كُتب تماماً.';
$ec_lang['lpn_convas_ok']='تحويل';
// {crs} is the coordinate system's own name, or its code if this build does not know it (Tom,
// 2026-09-25: "What, specifically, is 'that coordinate system'?").
$ec_lang['lpn_convas_no_transform']='{crs} من بين الأنظمة القليلة المدرَجة التي لا تملك معلومات إسقاط قابلة للاستخدام، فلا يمكن التحويل إليه أو منه. لم يُحوَّل شيء.';
// {name} is the new project's name.
$ec_lang['lpn_convas_done']='النسخة المحوَّلة هي {name}. المشروع الأصلي لم يتغيّر.';
$ec_lang['lpn_convas_cancelled']='لم يُحوَّل شيء. أُغلقت النسخة، والمشروع الأصلي لم يتغيّر.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_convert_as_tip']='ينسخ هذا المشروع إلى تبويب جديد ويحوّل النسخة إلى نظام الإحداثيات والوحدات التي تختارها. عند تغيّر نظام الإحداثيات، يرشدك معالج خلال تقريب الخريطة خلف شبكتك تقريباً، ثم تغيير حجم شبكتك وتدويرها على الخريطة بدقة أكبر. يبقى هذا المشروع تماماً كما هو. للإسناد الجغرافي دون تحويل أي شيء، استخدم الخريطة، خريطة العالم، إرفاق بدلاً من ذلك.';
// Task 696: a project that already knows where it is (lat/lon, an EPSG coordinate system, or an
// attached world map) opens the placement steps already answered. Tom's own sentence for this case
// from his 2026-09-16 edits, with the step 1 button added because the wizard opens at step 1.
$ec_lang['lpn_georef_answered']='هذا المشروع مُسند جغرافياً بالفعل، فالشبكة موجودة على الخريطة بالفعل ولم يتحرك شيء. تحقق من أنها في المكان الصحيح، ثم اضغط زر ضع النموذج هنا وزر احتفظ بهذا الوضع.';
$ec_lang['lpn_georef_intro']='يتطلّب وضع النموذج خطوتين. الخطوة 1 هي السريعة: يبقى النموذج ثابتاً وتحرّك الخريطة خلفه، حتى يصبح موقعك تحت النموذج بالحجم التقريبي الصحيح. لا يوجد دوران بعد. الخطوة 2 هي الدقيقة: تسحب النموذج نفسه وتغيّر حجمه وتدوّره. يكون مشروعك في البداية على خريطة العالم كله، فابحث عن موقعك أولاً، ثم اضغط زر ضع النموذج هنا.';
$ec_lang['lpn_georef_adjust']='النموذج الآن على الأرض، فهو يتحرك مع الخريطة. اسحب النموذج لتحريكه، واسحب زاوية لتغيير حجمه، واسحب المقبض الدائري فوق النموذج لتدويره. أو اكتب المسافة الأرضية وزاوية الدوران أدناه.';
$ec_lang['lpn_georef_step1']='الخطوة 1 من 2 — سريعة';
$ec_lang['lpn_georef_step2']='الخطوة 2 من 2 — دقيقة';
$ec_lang['lpn_georef_step1_hint']='يبقى مشروعك في مكانه على الشاشة. حرّك وقرّب الخريطة تحته حتى تصبح الأرض خلفه في المكان الصحيح تقريباً وبالحجم الصحيح تقريباً، ثم اضغط زر ضع النموذج هنا.';
$ec_lang['lpn_georef_detach']='التقطه مرة أخرى';
$ec_lang['lpn_georef_size_prompt']='ما هو عرض الموقع تقريباً، عبر المشروع كله؟';
// ---- The icon-only toolbar (dev/toolbar-icons.md) ----
// One separator string, one composition site: a language that wants a colon, another dash, or the
// explanation first changes this and nothing else.
$ec_lang['lpn_tip_join']='{name} — {tip}';
// **ONE STRING FOR EIGHT BUTTONS** (Task 595). The digit is substituted at render time from
// LPN_TOOL_KEYS, so the mapping has a single home and no translator has to keep a number in step
// with a keyboard handler. It is appended to each tool's own tip rather than written into it.
$ec_lang['lpn_tool_key_hint']='اختصار: اضغط {key}.';
$ec_lang['lpn_tool_key_hint_two']='اختصار: اضغط {key} أو {key2}.';
$ec_lang['lpn_tool_add_junction_tip']='انقر على الخريطة لإضافة ملتقى: نقطة تلتقي عندها الأنابيب أو يُستخدم عندها الماء.';
$ec_lang['lpn_tool_add_reservoir_tip']='انقر على الخريطة لإضافة خزان: مصدر لا نهائي بمنسوب مياه ثابت.';
$ec_lang['lpn_tool_add_tank_tip']='انقر على الخريطة لإضافة صهريج: تخزين يرتفع منسوب مائه وينخفض مع امتلائه وتفريغه.';
$ec_lang['lpn_tool_add_pipe_tip']='انقر عقدة ثم عقدة أخرى لرسم أنبوب بينهما.';
$ec_lang['lpn_tool_add_pump_tip']='انقر عقدة ثم عقدة أخرى لوضع مضخة بينهما.';
$ec_lang['lpn_tool_add_valve_tip']='انقر عقدة ثم عقدة أخرى لوضع صمام بينهما.';
$ec_lang['lpn_tool_add_text_tip']='انقر على الخريطة لكتابة ملاحظة على الرسم.';
// Edited by TGH 2026-09-07; the Shift sentence rewritten 2026-09-08 on his ruling that Shift keeps
// the selection and toggles what the shape catches (it used to say "add").
$ec_lang['lpn_tool_area_tip']='انقر على الخريطة كما هو موضح لتحديد كل ما يقع داخل الشكل. اضغط هذا الزر مرة أخرى لتغيير الشكل بين نافذة وتحديد حر ومضلع. اضغط مع الاستمرار على Shift أثناء التحديد لتتابع التحديد الحالي، فتضيف إليه أو تزيل منه (تبديل) ما تحدده.';
$ec_lang['lpn_area_selected']='{n} محدد.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_area_none']='لم يُعثر على شيء في تلك المنطقة.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_vertices_tip']='إضافة نقاط الانعطاف التي تحدّد شكل الأنبوب على الخريطة وإزالتها. انقر على الأنبوب لإضافة نقطة انعطاف، وانقر على نقطة انعطاف لإزالتها، واسحب نقطة الانعطاف لتحريكها. نقطة الانعطاف تغيّر مسار الرسم فقط، لا الحسابات الهيدروليكية.';
$ec_lang['lpn_tool_delete_tip']='انقر أي شيء على الخريطة لإزالته.';
$ec_lang['lpn_tool_undo_tip']='تراجع عن آخر تغيير.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tool_zoom_extent_tip']='إظهار الشبكة كلها داخل النافذة.';
$ec_lang['lpn_tool_zoom_window_tip']='انقر زاويتين متقابلتين لمربع، أو اسحب واحداً، على الخريطة للتكبير عليه. اضغط هذا الزر مرة أخرى لإظهار الكل.';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_in_tip']='تكبير. الاختصار: +';
// Tom's wording, 2026-09-25.
$ec_lang['lpn_zoom_out_tip']='تصغير. الاختصار: -';
$ec_lang['lpn_tool_settings_tip']='فتح إعدادات هذا المشروع.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_find_menu_tip']='ابحث عن عنصر بمعرّفه، أو ابحث عن كل عنصر يحقق شرطاً، وغيّرها كلها دفعة واحدة.';
// **"Toolbar key", NOT "Toolbar"** (Tom's own name, 2026-09-10; Ida ranked the rename first).
// The row is not a second toolbar and not a repeat of one -- it is the LEGEND for an icon-only
// strip, derived from toolbarIconIndex, and on a touch screen it is the only way to read the
// strip at all without a deliberate press-and-hold. Tom: *"Is Help, Toolbar really useful when
// it's just a repeat of the toolbar? ... Would it be more purposeful if it were called Toolbar
// key?"* The row earns its place; only the label was lying about what it is.
$ec_lang['lpn_help_icons']='ماذا تعني أيقونات شريط الأدوات';
// ---- The right panel: Visibility ----
$ec_lang['lpn_pane_right_toggle']='الظهور';
$ec_lang['lpn_pane_right_toggle_tip']='إظهار أو إخفاء اللوحة الموجودة يمين الخريطة. تحتوي على خيارات التسميات والألوان.';
$ec_lang['lpn_color_legend_open_tip']='انقر لفتح لوحة "الظهور" وتغيير هذه الألوان.';
$ec_lang['lpn_color_node_field']='تلوين العقد حسب';
$ec_lang['lpn_color_link_field']='تلوين الأنابيب حسب';
$ec_lang['lpn_color_ramp_sequential']='تسلسلي';
$ec_lang['lpn_color_ramp_diverging']='تباعدي';
// The ramp picker (ROADMAP Tasks 427 and 429). The RAMPS themselves carry no names on screen --
// the picker is pictures -- so the only strings here are the family headings, the controls beside
// them, and the three ways a typed range limit can be refused.
$ec_lang['lpn_settings_color_classes']='عدد النطاقات';
// "Data classification method", the trade's own term -- ArcGIS Pro's help page is titled
// "Data classification methods" and QGIS calls the act "Classify"; quantile, natural breaks
// (Jenks) and equal interval are all named there. "Range allocation" was our own coinage and
// appears in none of the reference tools. Tom, 2026-08-19: "Don't drop the 'method'. That's the
// point of this control." -- the dropdown holds METHODS, and the noun alone would name the result.
$ec_lang['lpn_color_mode']='توزيع النطاقات';
$ec_lang['lpn_color_ranges_note']='تُثبَّت الحدود أدناه بمجرد ضبطها؛ فهي لا تتبع النتائج مع تغيّرها. يؤدي اختيار طريقة تصنيف بيانات أعلاه إلى ضبط الحدود من حالة النظام الحالية. إذا غيّرت أي قيمة يدوياً، تصبح الطريقة أعلاه يدوي.';
$ec_lang['lpn_color_criterion_note']='تأخذ هذه الطريقة حدودها من معيار تصميم، لذا يكون عدد الألوان ثابتاً ما دامت هذه الطريقة مختارة.';
$ec_lang['lpn_color_break_number']='يجب أن يكون الحد رقماً. لم تتغيّر الخريطة.';
$ec_lang['lpn_color_break_order']='يجب أن يكون كل حد أكبر من الذي قبله. لم تتغيّر الخريطة.';
$ec_lang['lpn_color_break_count']='يجب أن يكون عدد الحدود أقل بواحد من عدد الألوان. لم تتغيّر الخريطة.';
$ec_lang['lpn_color_ramp_qualitative']='نوعي';
$ec_lang['lpn_color_ramp_rainbow']='قوس قزح';
$ec_lang['lpn_color_ramp_rainbow_eg']='يطابق EPANET';
$ec_lang['lpn_color_example_status']='الحالة';
$ec_lang['lpn_color_example_material']='المادة';
$ec_lang['lpn_color_ramp_ylgnbu']='من الأصفر إلى الأزرق';
$ec_lang['lpn_color_ramp_rdylbu']='من الأحمر إلى الأزرق، عبر الأصفر';
$ec_lang['lpn_georef_drop']='ضع النموذج هنا';
$ec_lang['lpn_georef_finish']='احتفظ بهذا الوضع';
$ec_lang['lpn_georef_cancel']='إلغاء';
$ec_lang['lpn_georef_scale']='المسافة الأرضية لكل وحدة رسم';
// Edited by TGH 2026-09-07
// R-219 (Tom, 2026-09-24, answering R-190): the sentence that replaces the retired "These are
// already lat/lon" button -- typing 1 here reaches the same result the button used to, for a file
// whose own numbers should be used unchanged.
$ec_lang['lpn_georef_scale_tip']='إلى أي مدى تمتد وحدة واحدة من رسمك على الأرض. الرسم على شبكة عادية عادة لا يذكر شيئاً عن هذا، فاضبطه هنا — أو دع "الانتقال إلى…" يسألك عن عرض الموقع ويحسبه.';
$ec_lang['lpn_georef_rotation']='الدوران عكس عقارب الساعة (بالدرجات)';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_rotation_tip']='مقدار دوران النموذج كله، عكس عقارب الساعة، بحيث يشير شماله إلى الشمال.';
// Tom's own wording for these two, from his 2026-09-16 edits (dev/tom-coordinate-vocabulary-2026-09-16.md):
// the wizard now ends on whichever coordinate system File, Convert as chose, not always lat/lon.
$ec_lang['lpn_georef_confirm']='هل تريد وضع النموذج هنا بشكل دائم؟ ما زال بإمكانك سحب عناصر منفردة بعد ذلك، لكن الرسم يتوقف عن كونه مشروع xy. لاستعادة xy، أغلق هذا المشروع دون حفظ.';
$ec_lang['lpn_georef_done']='هذا الآن مشروع على خط العرض وخط الطول. اسحب أي عنصر لتقريبه من موقعه الحقيقي.';
$ec_lang['lpn_georef_backdrop_unrotated']='تحرّكت الصورة الخلفية وتغيّر حجمها مع النموذج، لكن تعذّر تدويرها. استخدم الخريطة، صورة خلفية، نقل لمحاذاتها.';
$ec_lang['lpn_georef_empty']='لا يحتوي هذا الملف على شبكة، فلا يوجد ما يمكن وضعه.';
$ec_lang['lpn_georef_unavailable']='لم تُحمَّل أداة الوضع. أعد تحميل الصفحة وحاول مرة أخرى.';
// Switching projects while a model is being placed corrupted BOTH of them (Tom, 2026-09-08),
// so the strip refuses and says which two commands end the wizard.
$ec_lang['lpn_georef_tab_locked']='أنهِ عملية الوضع بزر "احتفظ بهذا الوضع"، أو اضغط إلغاء، قبل التبديل بين المشاريع. فالوضع يخص هذا المشروع ولا يمكن أن ينتقل معك إلى مشروع آخر.';
// Saving during the wizard writes a document whose coordinates are half moved, so Save takes the
// same refusal (Tom, 2026-09-08: *"Maybe the Save button should be disabled for consistency."*).
// Its own sentence rather than the one above: the two commands that end the wizard are the same,
// and "before you switch projects" is not true of a save.
$ec_lang['lpn_georef_save_locked']='أنهِ عملية الوضع بزر "احتفظ بهذا الوضع"، أو اضغط إلغاء، قبل الحفظ. لا يزال المشروع قيد الوضع، فما تراه على الشاشة ليس بعد ما سيُكتب في الملف.';
$ec_lang['lpn_goto_menu']='الانتقال إلى خط عرض وخط طول…';
// Edited by TGH 2026-09-07
// **TOM'S OWN TWO SENTENCES, 2026-09-08**, replacing a longer pair and an explanation he struck:
// *"The tip clarification is pointless IMO because nobody thinks that a single number is a
// lat/lon."* The parser accepts `38,122` and `38.122` as a pair on his ruling of the same day; the
// examples in lpn_goto_bad show all three shapes, which is where somebody whose last attempt failed
// is actually reading.
$ec_lang['lpn_goto_tip']='انقل الخريطة إلى مكان لديك إحداثياته بالفعل. خط العرض أولاً، ثم خط الطول، كما تُعطى في الخريطة، مع مسافة بينهما: 38 -122';
$ec_lang['lpn_goto_prompt']='خط العرض وخط الطول، بهذا الترتيب';
$ec_lang['lpn_goto_bad']='هذا ليس خط عرض وخط طول واحداً. جرّب 38 -122، مع مسافة بينهما.';
$ec_lang['lpn_georef_goto']='الانتقال إلى…';
$ec_lang['lpn_georef_twopt']='استخدام نقطتين معروفتين';
// Edited by TGH 2026-09-07
$ec_lang['lpn_georef_twopt_tip']='ضع النموذج بدقة عندما تعرف مسبقاً أين يقع فعلياً نقطتان على رسمك. انقر إحداهما، واكتب خط عرضها وخط طولها، ثم افعل الشيء نفسه لنقطة ثانية. يُشتق الموضع والمقياس والدوران كلها من هاتين النقطتين. اضغط هذا الزر مرة أخرى لإيقاف الاختيار.';
$ec_lang['lpn_georef_twopt_pick1']='انقر نقطة على رسمك تعرف خط عرضها وخط طولها.';
$ec_lang['lpn_georef_twopt_pick2']='الآن انقر نقطة معروفة ثانية، بأبعد ما يمكن عن الأولى.';
$ec_lang['lpn_georef_twopt_same']='هذه هي النقطة التي اخترتها أولاً. اختر نقطة مختلفة.';
$ec_lang['lpn_georef_twopt_done']='أصبح النموذج الآن قائماً على النقطتين اللتين أدخلتهما. تحقّق منه، ثم اضغط زر احتفظ بهذا الوضع.';

// ---- The bottom pane (ROADMAP Task 434) ----
// One panel below the map, holding a tab for each thing that is read while the map is edited: the
// profile first, tables later. The toggle is on the toolbar because it is the strip a reader
// scans for "what else can this page show me".
$ec_lang['lpn_pane_toggle']='اللوحة السفلية';
$ec_lang['lpn_pane_toggle_tip']='أظهر أو أخفِ اللوحة أسفل الخريطة. تحمل المقطع الطولي وجدولاً لكل نوع من الأجزاء.';
$ec_lang['lpn_pane_resize']='اسحب لجعل اللوحة أطول أو أقصر';
$ec_lang['lpn_pane_tab_junctions']='الملتقيات';
$ec_lang['lpn_pane_tab_reservoirs']='الخزانات';
$ec_lang['lpn_pane_tab_tanks']='الصهاريج';
$ec_lang['lpn_pane_tab_pipes']='الأنابيب';
$ec_lang['lpn_pane_tab_pumps']='المضخات';
$ec_lang['lpn_pane_tab_valves']='الصمامات';
$ec_lang['lpn_pane_tab_tip']='يعرض هذا التبويب عناصر هذا النوع كجدول يمكنك فرزه وتحريره. لا يمكن تحرير أعمدة النتائج.';
$ec_lang['lpn_pane_none']='لا تحتوي هذه الشبكة على أي منها بعد.';
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
$ec_lang['lpn_pane_text_attached']='مرفق';
$ec_lang['lpn_pane_not_used']='غير مستخدَم';
// What a filtered table says above its rows, so hidden rows always have a visible cause. {q} is the
// query line, {n} how many rows are showing and {all} how many the table holds unfiltered.
$ec_lang['lpn_pane_filter_note']='تمت التصفية حسب {q}. عرض {n} من {all}.';
$ec_lang['lpn_pane_filter_clear']='إظهار الكل';
// Not lpn_pane_none: the network may be full of pipes and none of them match the filter, which is a
// different fact and the one the reader needs.
$ec_lang['lpn_pane_filter_none']='لا شيء في هذا الجدول يطابق عامل التصفية.';
// The pin beside the ID in the first column. The ID itself was this control until 2026-09-19,
// underlined and turning link blue; the ID is an ordinary editable cell now and this is the way
// back to the map. It is the button's ONLY name, the button having no text, so it is both the tip
// and what a screen reader says, with the ID read after it.
$ec_lang['lpn_pane_goto_tip']='تكبير وتحديد';



$ec_lang['lpn_pane_print']='طباعة الجدول';
$ec_lang['lpn_pane_print_tip']='يطبع الجدول الذي تنظر إليه، مع اسم المشروع واسم الجدول والوحدات في العناوين. تُطبع الصفوف بالترتيب الذي فرزتها إليه.';

// **HIDE MAP READOUTS IS RETIRED, 2026-09-22** (Tom: "Hide map readouts was a print prep command.
// But it isn't very useful any more. Let's remove it."). lpn_clean_map, lpn_clean_map_off and
// lpn_clean_map_tip were deleted with the row; nothing else read them.
// THE PROJECT MENU (ROADMAP Task 467). Tom, 2026-08-20: "Maybe we can have a Project menu with
// Settings, Library, and Report under it?" Its rows borrow the names they already have --
// lpn_menu_settings, lpn_library_menu, lpn_time_run_report -- so a door cannot drift from the thing
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
$ec_lang['lpn_menu_project']='المياه';
// THE ONE MENU-BAR ITEM WITH A TIP (Task 499.02). The other five are the words every application
// uses; this one is ours, and the tip says what a person gains by opening it. **The value is TOM'S
// OWN FINAL WORDING, 2026-08-24, and it is set verbatim** -- an earlier draft added "under the map"
// to his sentence, which was both an edit he did not make and factually wrong: the transport sits in
// the TOOLBAR, above the map. Do not qualify this sentence again. The rule it states is in
// dev/looped-network-calculator-scope.md: every command lives in the menu bar, the transport is the
// one exception, and it is exempt because it is a position in a run rather than a command.
$ec_lang['lpn_menu_project_tip']='كل ما يخص نمذجة شبكة المياه موجود هنا في مكان واحد، ما عدا أزرار تشغيل الرسوم المتحركة. لا حاجة لتخمين مكان أي شيء.';
$ec_lang['lpn_tables_menu']='الجداول';
$ec_lang['lpn_tables_menu_tip']='يفتح اللوحة أسفل الخريطة على جدول لعناصر هذه الشبكة. يوجد جدول واحد لكل نوع من العناصر، ويمكنك فرزه وتعديله هناك.';
// The Run row's own tip, NOT lpn_time_run_tip: this row exists partly to answer "where is my Run
// button?" for somebody whose project recalculates by itself, and that sentence is not true of the
// toolbar button, which is the one that goes away.
// Edited by TGH 2026-09-07
$ec_lang['lpn_run_menu_tip']='أعد حساب هذه الشبكة الآن. تبحث عن زر احسب؟ إنه مخفي بينما إعداد إعادة الحساب تلقائياً مفعّل. لإعادة الزر، أوقف إعادة الحساب تلقائياً في الإعدادات، الحساب، الهيدروليكا.';
// ---- automatic recalculation (Task 467) ----
// "Simulation" rather than "network" or "results": it is the word EPANET uses for working a network
// out over time, and this switch is about the run, not about the drawing.
$ec_lang['lpn_settings_auto_run']='إعادة الحساب تلقائياً';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_auto_run_tip']='عند تفعيل هذا، يُعاد حساب المشروع بعد وقت قصير من كل تغيير تُجريه، ويُزال زر احسب من شريط الأدوات لأنه لم يعد له عمل. أوقف تفعيله في شبكة كبيرة حيث يعطّل انتظار إعادة الحساب بعد كل تغيير الكتابة، فيعود زر احسب لتختار متى تُشغّله.';
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
$ec_lang['lpn_time_run_slow']='استغرقت هذه الشبكة {secs} ث لحسابها، وهي مضبوطة لإعادة الحساب بعد كل تغيير. لإيقاف ذلك واستعادة زر احسب، أوقف تفعيل "إعادة الحساب تلقائياً" في الإعدادات، تحت الحساب، الهيدروليكا.';
$ec_lang['lpn_time_no_report']='لا يوجد تقرير تشغيل بعد. التقرير هو نص EPANET نفسه، فيظهر بعد حساب هذه الشبكة باستخدام حلّال EPANET.';
// "Settings" rather than Tools -> Options (Windows) or Preferences (Mac): nobody has ever settled
// this one, and of the three, Settings is the word a person is most likely to look for first.
$ec_lang['lpn_menu_settings']='الإعدادات';
// Moved out of the suite-wide More menu, 2026-08-13 (Tom: "the walkthrough is a little
// incongruous... Should it go in the lpn menu instead?"). It should, for two reasons the More menu
// could not satisfy. The post is entirely about THIS calculator, so beside About/Install/Contact
// the plural read as "guides to the calculators" and overstated it; here it needs no qualifier.
// And every other menu-bar item acts on the project, while this one leaves the site -- unremarkable
// as a row inside Help, out of place as a sixth document verb.
$ec_lang['lpn_menu_help']='مساعدة';
// PLURAL is literally true and is not aspirational (Tom, 2026-08-13): the single post contains
// three use-case walkthroughs of this calculator. So the row links straight to the post; no blog
// label page is needed to make the plural honest.
//
// The post is in English and the label does NOT say so (Tom, 2026-08-13): "I am inclined to take my
// chances with automatic browser translators and not flag it as English." Browser translation is
// good enough on a blog page, and a permanent "(in English)" cost more, constantly, than the
// occasional reader who meets it untranslated.
$ec_lang['lpn_help_screenshots']='معرض لقطات الشاشة';
$ec_lang['lpn_help_walkthroughs']='جولات إرشادية';
// Replaces "Clear project" (Task 211). Tom, 2026-08-04: that command was a vestige of the days when
// this page held ONE project -- with tabs, emptying a project is not a thing anyone needs, because
// starting a new tab and closing the old one is the same act in fewer ideas. What is genuinely still
// wanted is emptying the DRAWING while keeping the project: duplicate a project, delete its network,
// keep its settings and its background image.
$ec_lang['lpn_edit_delete_network']='حذف الشبكة';
$ec_lang['lpn_confirm_delete_network']='هل تريد حذف كل عقدة وأنبوب وتسمية نصية في هذا المشروع؟ تبقى الصورة الخلفية واسم المشروع وإعداداتك دون تغيير. لا يمكن التراجع عن هذا.';
// Find and replace (Tasks 420, 353 and 389). One panel does all three jobs: an exact ID lookup,
// which is what EPANET's Map Finder does; a condition on a value, which nothing else offers; and a
// write to everything the condition matched. **It is called by the standard name** -- Tom,
// 2026-08-24: "call it the standard 'Find and replace'. Do that under Edit. Very conventional,
// though deceptively understated for such a powerful thing, as always." The understatement is the
// point: a conventional name is what makes a powerful command findable by somebody who has never
// read a word about this page.
$ec_lang['lpn_find_menu']='بحث واستبدال';
$ec_lang['lpn_find_title']='البحث والاستبدال';
$ec_lang['lpn_find_scope']='ما الذي تبحث فيه';
$ec_lang['lpn_find_scope_all']='كل شيء';
$ec_lang['lpn_find_property']='الخاصية';
$ec_lang['lpn_find_condition']='الشرط';
$ec_lang['lpn_find_value']='القيمة';
$ec_lang['lpn_find_btn']='بحث';
// THE TABLE FILTER (Task 597). {q} is the query line as the reader wrote it, {n} and {all} are
// whole numbers. Tom, 2026-09-06: "Maybe Find could have next to the Find button a Filter in tables
// button ... with a selector for which table." Task 708, 2026-09-23: the button sits on the
// same line as Find. R-197 (2026-09-25), after the selector was cut and Tom reported "We lost the
// selector now": "I think what is simplest and closest to what we have is a simple 'Filter in
// table' button ... I think it implies that we filter all tables insofar as we can if 'Everything'
// is selected." One button, no selector; which table(s) it fills follows the scope in
// buildFilterRow()/applyTableFilter(), never a control of its own.
$ec_lang['lpn_find_filter_btn']='تصفية في الجدول الحالي';
$ec_lang['lpn_find_filter_tip']='إظهار الأجزاء المطابقة لهذا الاستعلام فقط في أحد الجداول أسفل الخريطة. لا يتغيّر الرسم ولا يُحذف شيء.';
// The multi-table receipt, printed when "Everything" (or a typed compound query) filters more than
// one table at once: one {table}: {n} of {all} row per table the query could be asked of, joined
// into {rows} of the summary line below. Every number is a count already shown on the table's own
// banner; this line only says which tables got one.
$ec_lang['lpn_find_filter_row']='{table}: {n} من {all}';
$ec_lang['lpn_find_filter_summary']='مُصفّى حسب {q}. {rows}.';
// The one case a typed query can reach with no table left to fill: every property it names is one
// no table on this page carries (Everything.Connectivity, filtering junctions and reservoirs and
// tanks, does not reach this line; it is here for a future property that names nothing at all).
$ec_lang['lpn_find_filter_none']='لا ينطبق هذا الاستعلام على أي جدول.';
// The conditions read as the middle of a sentence: "ID contains 12", "Pressure below 20".
// Keep them lowercase, so the three pull-downs read left to right, and keep them COPULA-FREE
// (Task 438 Wave 0): a finite verb has to agree with the property noun chosen in the select above
// it, and no one fixed fragment can agree with Diameter, Elevation and Status at once.
// **THE COMPARISON WORDS ARE EPANET'S** (Tom, 2026-09-06: "EPANET uses Below, Equal to, and Above
// for filter comparisons. I like this."). They were "greater than" and "less than" until the table
// filter shipped (Task 597), and one vocabulary across the two boxes is the whole point: a filter
// and a search that teach different words for one idea are two things to learn. The old spellings
// are still ACCEPTED by the query parser, so a line written down before the change still reads.
$ec_lang['lpn_find_op_contains']='يحتوي على';
$ec_lang['lpn_find_op_equals']='يساوي';
$ec_lang['lpn_find_op_gt']='أكبر من';
$ec_lang['lpn_find_op_lt']='أصغر من';
// A condition that takes no value: it asks whether the asset states this property at all.
$ec_lang['lpn_find_op_empty']='فارغ';
// {n} is a whole number.
$ec_lang['lpn_find_count']='تم العثور على {n}. انقر على واحد للانتقال إليه.';

$ec_lang['lpn_find_none']='لم يُطابق شيء.';
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
$ec_lang['lpn_find_op_top']='أعلى {n}';
$ec_lang['lpn_find_op_bottom']='أدنى {n}';
// EPANET's Map Finder calls this "Adjacent Links". Said plainly here: the pipes, pumps and valves
// that meet at the node you found.
$ec_lang['lpn_find_no_value']='اكتب ما تريد البحث عنه.';
// Task 540: the disconnected-node report. "Disconnected" is three different faults and each is
// said as a CONDITION on one property, so the report is the Find panel with a different condition
// rather than a second tool. Each op completes the sentence "Junction.Connection ___".
$ec_lang['lpn_find_prop_connection']='الاتصال';
$ec_lang['lpn_find_prop_demand_desc']='وصف فئة الطلب هذه';
// **ALL FOUR ARE TOM'S OWN WORDS, 2026-08-26**, and so is the ORDER. His frame: *"I see two
// points, sources and this node. And I see either no connection (missing link) or no open
// connection."* Two points x two kinds of break, plus his original local question, is this menu.
// They NEST -- each row is the one above plus one more way to be cut off -- which is what a
// searcher wants: pick how wide to cast. Earlier wordings ("is cut off for any reason", "is
// behind closed links", "reaches no source") presented four mutually exclusive cases he did not
// recognise, and "is behind closed links" never said behind them RELATIVE TO WHAT. Do not restore.
$ec_lang['lpn_find_op_conn_unlinked']='لا روابط عند العقدة';
$ec_lang['lpn_find_op_conn_noopen']='لا روابط مفتوحة عند العقدة';
$ec_lang['lpn_find_op_conn_nolinksource']='لا مسار روابط إلى مصدر';
$ec_lang['lpn_find_op_conn_noopensource']='لا مسار مفتوح إلى مصدر';
// What a result row prints beside the node id: the fault it has, in three words.
// What a result row prints beside the id: the NARROWEST condition true of that node, because "no
// links" says more than "no open path to a source" and both are true of the same node.
$ec_lang['lpn_find_conn_unlinked']='لا روابط عند العقدة';
$ec_lang['lpn_find_conn_noopen']='لا روابط مفتوحة عند العقدة';
$ec_lang['lpn_find_conn_nolinksource']='لا مسار روابط إلى مصدر';
$ec_lang['lpn_find_conn_noopensource']='لا مسار مفتوح إلى مصدر';
// "None" is the good news a report is run for, so it is said out loud rather than left as a blank
// box.
$ec_lang['lpn_find_conn_none']='كل عقدة متصلة.';
$ec_lang['lpn_find_conn_no_fixed']='لا تملك هذه الشبكة خزاناً ولا صهريجاً، فلا يوجد مصدر يمكن الوصول إليه. يمكن البحث فقط عن لا روابط عند العقدة و لا روابط مفتوحة عند العقدة.';
// Task 540: the query written as one line, above the Find button -- and typed into. The controls
// write it and it writes the controls, so it teaches the shape of a search by being operated from
// either end.
$ec_lang['lpn_find_query_tip']='البحث نفسه، مكتوباً في سطر واحد. تغيير عناصر التحكم يعيد كتابة هذا السطر، والكتابة في هذا السطر يحدّث عناصر التحكم.';
$ec_lang['lpn_find_query_label']='الاستعلام';
// Tom's own line, 2026-08-26, and "expandable" is his word: it says the grammar will grow.
$ec_lang['lpn_find_query_hint']='اجمع الشروط بواسطة و، أو، و ()';
// The two joining words. They are TRANSLATED, like every other word in the query line -- but the
// English spellings are accepted in every language as well, so a query pasted from a colleague or
// from our documentation still runs.
$ec_lang['lpn_find_q_and']='و';
$ec_lang['lpn_find_q_or']='أو';
// When the typed query says more than three pull-downs can say, the pull-downs LEAVE rather than
// stand there describing a search that is not the one about to run.
$ec_lang['lpn_find_q_aside']='لا يمكن لعناصر التحكم التعبير عن الاستعلام أدناه، لذا فهي مخفية.';
$ec_lang['lpn_find_q_restore']='استخدام عناصر التحكم بدلاً من ذلك';
$ec_lang['lpn_replace_q_bad']='تعذّر فهم هذا الاستعلام، فلا يمكن تغيير أي شيء. أصلحه أعلاه أولاً.';
// The parse errors. Each says what could not be understood and where, and NONE of them is followed
// by a search: a query that cannot be read searches nothing.
// {n} is a whole number; {w} is the word the reader typed; {list} is a comma-separated list of the
// words that would have worked.
$ec_lang['lpn_find_q_err_pos']='(عند الحرف {n})';
$ec_lang['lpn_find_q_err_empty']='الاستعلام فارغ، فلن يُبحث عن شيء.';
$ec_lang['lpn_find_q_err_scope']='لا يوجد شيء اسمه {w} للبحث فيه. جرّب أحد هذه: {list}';
$ec_lang['lpn_find_q_err_dot']='ضع نقطة بين ما تبحث عنه وخاصيته، مثل ملتقى.المعرّف';
$ec_lang['lpn_find_q_err_prop']='ليست خاصية من خصائص {scope}: {w}. جرّب أحد هذه: {list}';
$ec_lang['lpn_find_q_err_op']='ليس شرطاً لـ {prop}: {w}. جرّب أحد هذه: {list}';
$ec_lang['lpn_find_q_err_value']='يحتاج هذا الشرط إلى قيمة بعده: {op}';
$ec_lang['lpn_find_q_err_quote']='ضع علامتي اقتباس حول القيمة النصية: {w} ليست رقماً.';
$ec_lang['lpn_find_q_err_quote_end']='هذا النص المقتبس بلا علامة اقتباس ختامية.';
$ec_lang['lpn_find_q_err_close']='هذا القوس ( فُتح ولم يُغلق أبداً.';
$ec_lang['lpn_find_q_err_open']='هذا القوس ) لا يغلق شيئاً.';
$ec_lang['lpn_find_q_err_end']='لم يكن متوقَّعاً شيء بعد هذا. اربط بحثين بـ {and} أو {or}.';
// Replace (Task 389): the same search, plus a write. It sits inside the Find panel, so the heading
// says what the section does to the list above it rather than naming a second tool. "Assets" is the
// word this page already uses for its nodes and pipes.
$ec_lang['lpn_replace_title']='تغيير ما تم العثور عليه';
$ec_lang['lpn_replace_prop']='الخاصية المراد تغييرها';
$ec_lang['lpn_replace_value']='القيمة الجديدة';
$ec_lang['lpn_replace_source']='مصدر القيمة الجديدة';
$ec_lang['lpn_replace_asked']='طُلبت مناسيب {n} عقدة. النتائج في طريقها.';
$ec_lang['lpn_replace_btn']='استبدال';
// The count IS the confirmation: a bulk write reaches assets spread over a map the user is not
// looking at, so it is shown, and answered, before anything is written. {n} is a whole number.
$ec_lang['lpn_replace_preview']='تغيير {n} عنصراً؟';
$ec_lang['lpn_replace_apply']='تغييرها';
$ec_lang['lpn_replace_done']='{n} عنصراً تم تغييره. يمكنك التراجع عن هذا بخطوة واحدة.';
$ec_lang['lpn_replace_none']='لن يتغيّر شيء.';
$ec_lang['lpn_replace_no_value']='اكتب القيمة الجديدة.';
$ec_lang['lpn_replace_scope']='اختر نوعاً واحداً من العناصر أعلاه لتغيير قيمه.';
// ---- the profile view (ROADMAP Task 409) ------------------------------------------------------
// A drawing of the ground and the hydraulic grade line along one chosen route through the network.
// {u} is a unit name, {n} a count and {len} a length; they are substituted, not concatenated, so a
// language that puts the unit somewhere else can.
$ec_lang['lpn_profile_menu']='المقطع الطولي';
// **THE SYNONYMS ARE IN THE SYNONYM CHANNEL, WHICH IS WHERE THEY WERE ALWAYS MEANT TO BE.** They
// shipped as `lpn_profile_tip_syn` / `lpn_profile_title_syn` -- ordinary $ec_lang keys with no call
// site, which nothing rendered and which a sprint would have translated into 26 languages for
// nobody to read. Sprint 459's Wave 0 found them; Tom ruled the move on 2026-08-24 ("these _syns
// are really needed. Are they simply keyed wrong? I guess 1. My mistake."), which is the written
// permission $ec_lang_syn requires. Same text, correct array.
$ec_lang['lpn_profile_tip']='ارسم خط الأرض وخط المتدرج الهيدروليكي على طول مسار عبر الشبكة.';
$ec_lang['lpn_profile_title']='المقطع الطولي على طول مسار';
// Task 433 -- the path chooser. The gesture is Google Directions': click the start node, move over
// the map to see the path, click to add a stop, double-click to finish.
$ec_lang['lpn_profile_draw_start']='انقر العقدة التي يبدأ منها المسار.';
$ec_lang['lpn_profile_draw_more']='حرّك المؤشر فوق الخريطة لرؤية المسار. انقر عقدة لإضافتها. انقر نقراً مزدوجاً للإنهاء. يلغي Esc العملية.';
$ec_lang['lpn_profile_draw_blocked']='لا يوجد مسار من {a} إلى {b}. اختر عقدة أخرى.';
$ec_lang['lpn_profile_tap_start']='اضغط العقدة التي يبدأ منها المسار.';
$ec_lang['lpn_profile_tap_more']='اضغط عقدة لرؤية المسار. اضغط مطوّلاً لإضافتها. اضغط ضغطاً مزدوجاً للإنهاء. اضغط المقطع الطولي مرة أخرى للإلغاء.';
$ec_lang['lpn_profile_say_idle']='اضغط المقطع الطولي مرة أخرى لاختيار مسار جديد على الخريطة.';
$ec_lang['lpn_profile_none']='لا يوجد مسار بعد. اضغط المقطع الطولي مرة أخرى لاختيار واحد على الخريطة.';
$ec_lang['lpn_profile_choose']='اختر عقدة بداية وعقدة نهاية.';
$ec_lang['lpn_profile_no_path']='هاتان العقدتان غير متصلتين بأي مسار.';
$ec_lang['lpn_profile_no_solve']='لا نتائج بعد، لذا يُرسم خط الأرض فقط.';
$ec_lang['lpn_profile_summary']='العقد: {n}، الطول: {len} {u}';
$ec_lang['lpn_profile_axis_station']='المسافة على طول المسار ({u})';
$ec_lang['lpn_profile_axis_elev']='المنسوب والعلو ({u})';
$ec_lang['lpn_profile_ground']='سطح الأرض';
$ec_lang['lpn_profile_hgl']='خط المتدرج الهيدروليكي';
// ---- Task 509: the two operations the control column took with it ----------------------------
// Task 506 removed the From/To pull-downs and the waypoint chips, and with them the only way to
// change ONE end of a path or take ONE node off it. They come back in an overlay box over the map,
// reached by this button, so the panel stays one line and the map keeps its full width. The four
// keys above (`_from`, `_to`, `_through`, `_clear`) are the box's own labels again.
$ec_lang['lpn_profile_edit']='تحرير';
$ec_lang['lpn_profile_edit_tip']='غيّر أحد طرفي المسار، أو أزل عقدة منه، دون رسم المسار كاملاً من جديد.';
// **A POINTER/TOUCH PAIR, and the suffix is the VERB each one uses.** `_click` was `_say` until
// Tom read it (2026-08-27: *"What is '_say' supposed to mean? Don't you mean '_click'?"*). He is
// right: its twin is `_tap`, so the only thing the two names can honestly differ by is the word
// inside them, and `_say` named nothing at all.
$ec_lang['lpn_profile_edit_click']='اسحب أي نقطة على المسار لتحريكها. انقر نقطة أضفتها لإزالتها منه.';
$ec_lang['lpn_profile_edit_tap']='اسحب أي نقطة على المسار لتحريكها. اضغط نقطة أضفتها لإزالتها منه.';
$ec_lang['lpn_profile_edit_nowhere']='يجب أن تكون أي نقطة على المسار عقدة. المسار لم يتغيّر.';
// ---- Task 510: paths kept in the project, by name ---------------------------------------------
// A client report carries the same three or four profiles every time, so a path is worth keeping.
// {n} is a count, {name} a name the user typed and {ids} a list of node names; all substituted.
$ec_lang['lpn_profile_saved']='المسارات المحفوظة';
$ec_lang['lpn_profile_new']='مسار محفوظ جديد…';
$ec_lang['lpn_profile_new_name']='مسار {n}';
$ec_lang['lpn_profile_rename']='إعادة تسمية المسار…';
$ec_lang['lpn_profile_delete']='حذف المسار';
$ec_lang['lpn_profile_prompt_name']='اسم هذا المسار';
$ec_lang['lpn_profile_delete_confirm']='هل تريد حذف المسار المحفوظ {name}؟ لا يتغيّر الرسم نفسه.';
$ec_lang['lpn_profile_none_saved']='لا مسارات محفوظة بعد';
$ec_lang['lpn_profile_missing']='يستخدم المسار المحفوظ {name} عُقداً غير موجودة في هذا المشروع: {ids}';
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
$ec_lang['lpn_ts_menu']='السلاسل الزمنية';
$ec_lang['lpn_ts_tip']='ارسم عنصراً واحداً أو أكثر مقابل الزمن عبر محاكاة ممتدة الفترة.';
$ec_lang['lpn_ts_title']='القيم مقابل الزمن';
$ec_lang['lpn_ts_group_tip']='ما إذا كان الرسم يعرض عُقَداً أو روابط.';
$ec_lang['lpn_ts_group_nodes']='العُقَد';
$ec_lang['lpn_ts_group_links']='الروابط';
$ec_lang['lpn_ts_quantity_tip']='أي قيمة تُرسم مقابل الزمن.';
$ec_lang['lpn_ts_add']='إضافة المحدَّد';
$ec_lang['lpn_ts_add_tip']='ضع كل ما هو محدَّد الآن على الخريطة في الرسم.';
// Said out loud rather than ignored: a button that does nothing cannot be told from a broken one.
$ec_lang['lpn_ts_add_none']='لا شيء من هذا النوع محدَّد على الخريطة.';
$ec_lang['lpn_ts_clear']='إزالة الكل';
$ec_lang['lpn_ts_chip_tip']='إزالة {id} من الرسم';
$ec_lang['lpn_ts_none']='لا شيء لرسمه بعد. اختر عناصر على الخريطة واضغط إضافة المحدَّد.';
// The run belongs to EPANET alone, so this is also what a page whose engine is unreachable lands
// on; the status bar says why in that case, and lpn_time_no_period covers the project that has set
// no run time at all.
$ec_lang['lpn_ts_no_frames']='لا توجد نتائج ممتدة الفترة بعد. اضغط احسب لتشغيل المحاكاة.';
$ec_lang['lpn_ts_summary']='العناصر: {n}، أوقات التقرير: {steps}';
$ec_lang['lpn_ts_axis_time']='الزمن المنقضي';
$ec_lang['lpn_view_units']='الوحدات';
// Offered only when more than one file has unsaved changes, which is the only time it beats Save.
$ec_lang['lpn_file_saveall']='حفظ الكل';
// {n} is a whole number. Assigned at creation as a real, renameable name -- and it is the LOWEST
// number not currently in use, so closing Project 2 makes the next new project Project 2 again. A
// counter that only ever went up would reach "Project 47" in an afternoon and read as a fault.
$ec_lang['lpn_project_numbered']='مشروع{n}';
$ec_lang['lpn_project_copy_suffix']='(نسخة)';
$ec_lang['lpn_project_rename']='إعادة تسمية';
// The File menu. "New" is the same act as the + tab, deliberately: one function, two doors.
$ec_lang['lpn_file_new']='مشروع جديد…';
// ---- THE NEW-PROJECT BOX (Task 477) ----------------------------------------------------------
// It replaced a four-row fly-out whose rows were the cross of two questions -- xy or lat/lon, US or
// SI -- and which had nowhere to put the two questions that matter just as much: which units
// exactly, and which head-loss formula. Those four keys (lpn_new_blank_us/si, lpn_new_geo_us/si)
// were deleted with the fly-out; they are in git if the wording is ever wanted again.
//
// **EVERY CONTROL IN THE BOX OPENS ON A WORKING ANSWER**, so nothing here has to be read by
// somebody who just wants a blank sheet.
$ec_lang['lpn_new_title']='مشروع جديد';
// ---- THE COORDINATE SYSTEM QUESTION, AS TOM SPECIFIED IT (Task 641 phase 2, 2026-09-13) ------
// **TWO ANSWERS, NOT THREE**: an EPSG coordinate system (lat/lon, WGS 84 EPSG:4326, is one of
// them), or local and not georeferenced. The keys of the older three-radio box (lpn_new_coords and
// its five siblings) are gone; Tom called the last of them obsolete on 2026-09-16.
$ec_lang['lpn_new_coordsys']='نظام الإحداثيات';
$ec_lang['lpn_new_coordsys_tip']='اختر نظام إحداثيات شبكتك. هذا الاختيار دائم؛ الطريقة الوحيدة لتحويل الشبكة إلى إحداثيات مختلفة هي "ملف، فتح بإحداثيات جديدة"، وهي تقريبية.';
// **DELETED 2026-09-25: lpn_new_coordsys_geo / lpn_new_coordsys_geo_tip.** Don't expose the word
// "projection" (dev/session-handoff.md RULINGS); once reworded, both were the identical string
// lpn_convas_epsg / lpn_convas_epsg_tip already carries, so the radio reuses those keys rather than
// keeping a second copy that could drift from Convert as's own wording of the same thing.
$ec_lang['lpn_new_coordsys_local']='محلي أو تخطيطي أو مخصص';
$ec_lang['lpn_new_coordsys_local_tip']='غير مُسند جغرافياً. أرفق صورة خلفية خاصة بك أو لا شيء.';
// ---- THE COORDINATE SYSTEM BOX -----------------------------------------------------------------
// Tom's summary: it "uses the map view as a UX element to filter the universe of projections to the
// ones applicable to the project (view). Lets the user filter by name and select a projection at
// any time." (His own words, kept verbatim; "projection" in visitor strings became "coordinate
// system" on 2026-09-25 -- don't expose the word "projection".) Two filters over one catalogue, and
// the catalogue itself is not keyed: a coordinate system's NAME is the EPSG register's own, exactly
// as the OpenStreetMap credit is, and a GIS reader in any language looks for those characters.
$ec_lang['lpn_new_crs']='إسقاط الخريطة';
// **THE SUB-BOX'S OWN TITLE** (Tom, 2026-09-25). Shared by the New project box and Convert as, so
// it names the box's own subject rather than either caller's radio label.
$ec_lang['lpn_crsbox_title']='نظام الإحداثيات';
// The spatial filter. A zoned system covers a strip of the Earth and nothing outside it, so a place
// answers most of the question by itself: searching a town in Arizona leaves two UTM zones standing
// out of a hundred and twenty.
$ec_lang['lpn_crs_view']='التصفية حسب منظور الخريطة';
$ec_lang['lpn_crs_view_tip']='يعرض فقط الإسقاطات التي تغطي المكان الذي تنظر إليه الخريطة. أوقفه لقراءة القائمة كاملة.';
$ec_lang['lpn_crs_place']='البحث باسم المكان';
$ec_lang['lpn_crs_place_tip']='اكتب اسم بلدة أو عنواناً أو معلماً، وينتقل منظور الخريطة إلى هناك. تُرسَل الكلمات التي تكتبها إلى خدمة أسماء الأماكن في OpenStreetMap، التي تطلب إذنك في المرة الأولى. يبدأ المشروع الجغرافي الجديد أيضاً من المكان الذي تجده هنا.';
$ec_lang['lpn_crs_search']='بحث';
$ec_lang['lpn_crs_name']='تصفية باسم الإسقاط';
$ec_lang['lpn_crs_name_tip']='يعرض فقط الإسقاطات التي يحتوي اسمها أو رمز EPSG الخاص بها على ما تكتبه. جرّب رقم منطقة، أو UTM، أو Mercator.';
$ec_lang['lpn_crs_list']='الإسقاط';
$ec_lang['lpn_crs_list_tip']='الإسقاطات المتبقية بعد عاملي التصفية أعلاه. اختر واحداً واضغط تحديد.';
$ec_lang['lpn_crs_choose']='تحديد';
// Said rather than left blank: a filter that is on and filtering nothing looks broken.
$ec_lang['lpn_crs_noview']='لم يُبحث عن أي مكان بعد، لذا تُعرض القائمة كاملة. ابحث عن مكان أعلاه أو قرّب الخريطة لتضييقها.';
$ec_lang['lpn_crs_count']='{n} من {total} إسقاطاً مدرَجاً.';
// The same count when the list is filtered by the whole network's extent (File, Convert as, Tom
// 2026-09-26: "should automatically filter EPSG CRSes for the displayed area or network extents"),
// so the reader knows why the list is short. The Filter by map view box above still shows them all.
$ec_lang['lpn_crs_count_network']='{n} من {total} نظام إحداثيات يغطي هذه الشبكة.';
// Shown beside a coordinate system in the chooser, and beside the chosen one in the New project box,
// when this page has no transform for it. Short on purpose: it sits at the end of a register name
// that can already run to 50 characters.
$ec_lang['lpn_crs_unplaceable_mark']='(بلا خريطة)';
// The same fact in a sentence: when such a project is created, and when Go to or place name search
// is used on one. File, Convert as says it in its own words (lpn_convas_no_transform).
$ec_lang['lpn_crs_unplaceable']='{crs} من بين الأنظمة القليلة المدرَجة التي لا تملك معلومات إسقاط قابلة للاستخدام. هذا يعني أن خريطة العالم، والبحث باسم المكان، ومناسيب DEM لا تعمل. إحداثياتك غير متأثرة.';
// What the status strip says when a project has no projection at all. The local grid is a plane the
// user declared the meaning of, and it sits nowhere on the Earth.
// **AND WHAT IT SAYS WHEN THE WORLD MAP IS ATTACHED BUT NAMES NO COORDINATE SYSTEM** (Tom,
// 2026-09-17). The custom georeference wizard defines a coordinate system of its own -- an anchor
// point, a scale and a turn -- and no register has a name or a number for it, so the strip says
// that it has one and that it is nobody's. Lower case: it is not a proper name.
$ec_lang['lpn_crs_unnamed']='بلا اسم';
$ec_lang['lpn_crs_none']='غير مُسند جغرافياً';
// **THE ONE PLACE THIS PAGE NAMES A lat/lon PROJECT'S COORDINATE SYSTEM** (R-218/2026-09-25: Tom
// asked for WGS 84 (EPSG:4326) as an ordinary catalogue entry, so this now reads that entry
// (`crsDisplayName()` in js/looped-network.js) instead of carrying its own wording -- the register's
// own name for 4326 already says what R-218 needed said, and a second string that could drift from
// the catalogue's is one this page no longer needs.
// Edited by TGH 2026-09-07
// Task 584: the page-wide rule stated where it is decided. A new project gets the hard-coded
// defaults; a preference is a template FILE rather than an invisible saved setting.
// Edited by TGH 2026-09-07
$ec_lang['lpn_new_units_tip']='يحتفظ المشروع بوحداته الخاصة، فهذا الاختيار يخص هذا المشروع وحده ولا يُحفظ هنا شيء كإعداد للمتصفح. لبدء مشاريع جديدة بطريقة معينة، احفظ مشروعاً فارغاً كقالب لك وانسخه في كل مرة.';
// A worked example rather than an instruction, in the placeholder where an instruction would be
// read as the answer. Petaluma is the example js/lpn-search.js already uses.
$ec_lang['lpn_new_place_hint']='بترالوما، كاليفورنيا';
// The button that does the thing. "Create", not "OK": a dialog's OK says nothing about what is
// about to happen, and this one makes a project.
$ec_lang['lpn_new_create']='إنشاء';
$ec_lang['lpn_file_open']='فتح…';
$ec_lang['lpn_file_save']='حفظ';
$ec_lang['lpn_file_saveas']='حفظ باسم…';
$ec_lang['lpn_file_revert']='استرجاع';
$ec_lang['lpn_file_close']='إغلاق';
// Recent files (Task 258). "Files", not "projects": a project you closed was discarded, but the file
// it was saved to is still on the disk, and that is what this list reopens.
$ec_lang['lpn_file_recent']='الملفات الأخيرة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_recent_tip']='أعد فتح {file} دون الحاجة إلى البحث عنه في جهازك.';
$ec_lang['lpn_recent_denied']='لم يُمنح الإذن لفتح ذلك الملف، لذا لم يُفتح.';
$ec_lang['lpn_recent_gone']='تعذّر فتح {file}. ربما نُقل أو أُعيدت تسميته أو حُذف، لذا أُزيل من القائمة الأخيرة.';
// The tab strip. These are titles on small controls, so each has to stand alone with no sentence
// around it.
$ec_lang['lpn_tab_new']='مشروع جديد';
$ec_lang['lpn_tab_all']='كل المشاريع';
$ec_lang['lpn_tab_menu']='قائمة المشروع';
$ec_lang['lpn_tab_duplicate']='نسخ';
$ec_lang['lpn_tab_move_left']='نقل إلى اليسار';
$ec_lang['lpn_tab_move_right']='نقل إلى اليمين';
$ec_lang['lpn_tab_unsaved']='غير محفوظ في ملف';
$ec_lang['lpn_import_bad_file']='تعذّرت قراءة ذلك الملف كمشروع محفوظ من هذه الصفحة.';
$ec_lang['lpn_import_no_room']='لا توجد مساحة تخزين كافية في المتصفح لإضافة هذا المشروع. احذف مشروعاً لم تعد بحاجة إليه وحاول مرة أخرى.';
// ---- EPANET .inp import (ROADMAP Task 196) ----
// The import REPORTS every difference between the file and what this page can hold, so each
// lpn_inp_drop_* key is one whole sentence naming one thing that changed and why. They are joined
// to a list of asset IDs at render time and to nothing else -- no key here is a fragment of
// another sentence, and none may become one.
// {file} is a file name; {nodes}, {links} and {units} are numbers and a unit name. Word order is
// the translator's to choose.
$ec_lang['lpn_dialog_ok']='موافق';
$ec_lang['lpn_file_import_inp']='استيراد ملف EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_import_inp_tip']='اقرأ شبكة من ملف EPANET، سواء ملف .inp النصي أو ملف .net الذي يحفظه EPANET، واحفظها في هذا المتصفح كمشروع جديد.';
// The other direction (Task 281). A DOWNLOAD, so the word is Export rather than Save: this page
// keeps no handle on an `.inp` and never writes back to one.
$ec_lang['lpn_file_export_inp']='تصدير ملف EPANET…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_export_inp_tip']='اكتب هذه الشبكة كملف EPANET بصيغة .inp وحمّله. تُكتب الأرقام التي أدخلتها تماماً كما كتبتها. يُسرد لاحقاً كل ما لا تستطيع صيغة .inp تخزينه.';
$ec_lang['lpn_status_inp_exported']='تم تصدير {file}.';
// {n} is a whole number. Said plainly rather than hidden: a file that quietly loses a pump curve is
// the failure this whole feature exists to prevent.
$ec_lang['lpn_inp_export_differences']='{n} أشياء لا تستطيع صيغة .inp تخزينها.';
$ec_lang['lpn_inp_export_refused']='لا يمكن كتابة هذا المشروع كملف EPANET: {detail}';
$ec_lang['lpn_inp_bad_file']='تعذّرت قراءة ذلك الملف كملف شبكة EPANET.';
// EPANET has two file formats. This one is about the BINARY .net that its Windows program saves;
// the way out named here always works, so keep the instruction in the message rather than leaving
// the reader to guess.
$ec_lang['lpn_net_bad_file']='يبدو هذا ملف .net من EPANET، لكن هذه الصفحة تعذّر عليها قراءته. افتحه في EPANET واستخدم أمر ملف، تصدير، شبكة هناك لحفظه كملف .inp، ثم استورد ذلك الملف.';
$ec_lang['lpn_inp_report_heading']='تم استيراد {file}';
$ec_lang['lpn_inp_report_counts']='{nodes} من الملتقيات والخزانات والصهاريج، و{links} من الأنابيب والمضخات والصمامات، بوحدات {units}.';
$ec_lang['lpn_inp_report_clean']='انتقل كل شيء في الملف بنجاح. لم يُستبعد شيء.';
$ec_lang['lpn_inp_report_label_anchor']='توضع التسميات النصية كما يضعها EPANET، من زاويتها العلوية اليسرى.';
// **R-219; Tom, 2026-09-24, answering R-190**: dropping the "These are already lat/lon" button in
// favor of typing 1 for Step 2's Ground distance field means both Import and Convert as have to say
// that door still exists. Shown for any file that lands as a plain XY drawing -- Feet, Meters, None
// or no [BACKDROP] line at all, never only "None" -- because none of those states a real coordinate
// system either. See showInpReport() in js/looped-network.js.
$ec_lang['lpn_inp_report_no_crs']='لا تحتوي ملفات EPANET على نظام إحداثيات، فلن يكون هذا الملف مُسنداً جغرافياً في البداية. لوضعه على خريطة العالم، استخدم الخريطة، خريطة العالم… ولتحويل إحداثياته، استخدم ملف، تحويل باسم…';
$ec_lang['lpn_inp_report_lead']='لا تستخدم هذه الصفحة كل ما يستخدمه EPANET، لكن لا شيء في ملفك يُطرح. فيما يلي ما يحمله ملفك وتحتفظ به هذه الصفحة دون استخدامه، وما تغيّر عند قراءة الملف:';
$ec_lang['lpn_inp_drop_headloss']='لا يستخدم هذا الملف معادلة هيزن-وليامز. تحسب هذه الصفحة هيزن-وليامز، لذا أُبقيت أرقام خشونة الأنابيب كما كُتبت تماماً، لكن النتائج هنا لن تطابق نتائج EPANET.';
$ec_lang['lpn_inp_drop_tank_curve']='هذه الصهاريج ليست مستقيمة الجوانب: يعطي الملف شكلها كمنحنى. يُحفظ المنحنى في المكتبات، ولا يزال الصهريج يشير إليه، وتملأ محاكاة ممتدة الفترة الصهريج وتفرغه وفق الجدول الذي يعطيه ذلك المنحنى. اللحظة الواحدة هي نفسها في الحالتين، لأن سطح الماء هو المنسوب الذي يحدده الملف. يُحفظ القطر المكتوب في الملف بجانب المنحنى، وهو ما يُرسم به الصهريج الذي لا منحنى له ويُحل على أساسه.';
// Three outcomes a valve in a file can meet, one string each (Task 248 phase 2). Only the last is
// a loss; the first two are reported because the reader deserves to know what became of a valve
// their file states, not because anything was thrown away.
$ec_lang['lpn_inp_drop_tcv']='دخلت صمامات التخنيق هذه كصمامات تخنيق، تحمل الفاقد نفسه الذي يحدده الملف. يستطيع أي من الحلّالين حسابها.';
$ec_lang['lpn_inp_drop_valve_active']='تتحكم هذه الصمامات في الضغط أو التدفق، وتفتح وتغلق من تلقاء نفسها مع تغيّر الماء. لم يُفقد شيء منها أثناء الاستيراد، وتحل هذه الصفحة لها بحلّال EPANET، فيُشغَّل هذا الحلّال تلقائياً لهذه الشبكة.';
$ec_lang['lpn_inp_drop_valve']='تُوصف هذه الصمامات بمنحنى أو بانخفاض ضغط ثابت، ولا تملك هذه الصفحة عنصراً كهذا. وصلت كأنابيب مفتوحة، فتبقى الشبكة متصلة، لكن لم يعد شيء يتحكم بالضغط أو التدفق هناك.';
$ec_lang['lpn_inp_drop_cv']='في EPANET، تسمح هذه الأنابيب بمرور الماء في اتجاه واحد فقط. دخلت كأنابيب عادية، فقد يتدفق الماء الآن في أي من الاتجاهين خلالها.';
$ec_lang['lpn_inp_drop_demands']='كان لهذه الملتقيات أكثر من طلب واحد. جُمعت الطلبات معاً في الطلب الواحد الذي تحمله هذه الصفحة.';
$ec_lang['lpn_inp_drop_patterns']='لم تقرأ هذه الصفحة أنماط الطلب، لأن جزء هذه الصفحة الذي يشغّل محاكاة ممتدة الفترة لم يُحمَّل. كل طلب هو الرقم المكتوب في الملف.';
$ec_lang['lpn_inp_drop_demand_pattern']='تُغيّر هذه الملتقيات طلبها خلال التشغيل. وردت أنماطها كاملة، والطلب الذي تراه هو طلب اللحظة التي تُظهرها الساعة.';
$ec_lang['lpn_inp_drop_emitters']='لهذه الملتقيات معامل رشاش أو تسرّب. أُبقي عليه ويُحسب ضمن الحل، لكن لا يوجد بعد مكان في هذه الصفحة لعرضه أو تغييره.';
$ec_lang['lpn_inp_drop_curve_long']='كان لمنحنى هذه المضخة أكثر من ثلاث نقاط. أُبقي على أدنى نقطة وأوسطها وأعلاها، لأن هذه الصفحة توائم منحنى بثلاث نقاط على الأكثر.';
$ec_lang['lpn_inp_drop_curve_missing']='تشير هذه المضخة إلى منحنى غير موجود في الملف. دخلت المضخة دون منحنى، فهي لا تضيف أي علو.';
$ec_lang['lpn_inp_drop_pump_other']='تُوصف هذه المضخة بالقدرة التي تسحبها، لا بمنحنى. وصلت بلا منحنى، فهي لا تضيف أي علو.';
$ec_lang['lpn_inp_drop_head_pattern']='ترتفع هذه الخزانات وتنخفض خلال التشغيل. وردت أنماطها كاملة، ومنسوب الماء الذي تراه هو منسوب اللحظة التي تُظهرها الساعة.';
$ec_lang['lpn_inp_drop_pump_speed']='تعمل هذه المضخات بسرعة تختلف عن السرعة التي قيست عندها منحنياتها، أو تتغيّر سرعتها خلال التشغيل. وردت السرعة ونمطها كاملين، والعلو الذي تراه هو علو اللحظة التي تُظهرها الساعة.';
$ec_lang['lpn_inp_drop_setting']='تحمل هذه الأنابيب والمضخات والصمامات إعداداً لا يمكن لهذه الصفحة الاحتفاظ به. دخلت مفتوحة.';
$ec_lang['lpn_inp_drop_rules']='يحتوي هذا الملف على عناصر تحكم قائمة على قواعد. تقرأ هذه الصفحة هذه القواعد وتستخدمها. شغّل النموذج بمحرك EPANET فتُطبَّق القواعد، مع تحويل كل منسوب وضغط وتدفق فيها إلى الوحدات التي يعرضها هذا المشروع. افتح القواعد تحت المكتبات لقراءة إحداها أو تغييرها. تُحفظ كما ذكرها الملف تماماً، وتُكتب مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_eps']='يصف هذا الملف محاكاة ممتدة الفترة. لم يُحمَّل جزء هذه الصفحة الذي يشغّل محاكاة ممتدة الفترة، فدخلت الظروف الابتدائية فقط.';
$ec_lang['lpn_inp_drop_quality']='يصف هذا الملف كيف تتغيّر جودة المياه أثناء انتقالها: ما الموجود في الماء ابتداءً، وبأي سرعة تتفاعل تلك المادة في الأنابيب وفي الصهاريج. تقرأ هذه الصفحة هذه الأرقام وتستخدمها. اختر مادة كيميائية تحت الإعدادات، الحساب، جودة المياه، ثم شغّل النموذج بمحرك EPANET، فيُحسب التركيز على طول الشبكة مع تقدّم التشغيل. تُحفظ هذه السطور، وتُكتب مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_sources_mixing']='يذكر هذا الملف أين تُضاف مادة كيميائية إلى الشبكة، وكيف يختلط الماء في الصهريج. تظهر الجرعة عند العقدة التي أُضيفت عندها، ويحدد الصهريج نموذج الاختلاط الذي يتبعه. تُحسب الجرعة ونموذج الاختلاط كلاهما بمحرك EPANET فقط.';
$ec_lang['lpn_inp_drop_energy']='يتضمن ملف EPANET هذا بيانات نمذجة تكلفة الضخ. تقرأ هذه الصفحة تلك البيانات وتستخدمها. شغّل النموذج بمحرك EPANET، ثم افتح المياه، التقارير، طاقة المضخة لترى مدة تشغيل كل مضخة، والقدرة التي استمدتها، والطاقة التي استخدمتها، وما تكلفه ذلك. تُحفظ هذه السطور، وتُكتب مرة أخرى إذا حفظت ملف EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_tags']='يمنح هذا الملف وسوماً لبعض ملتقياته أو أنابيبه أو عناصره الأخرى. دخل كل وسم كاملاً، ويقع كل منها ضمن خصائص عنصره الخاص، حيث يمكنك قراءته أو تغييره.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_inp_drop_report']='يحمل هذا الملف إعدادات EPANET الخاصة بتنسيق التقرير الذي يطبعه. يمكنك قراءة تقرير المحرك هنا، تحت التقارير، تشغيل EPANET، لكنه يظهر بالتنسيق القياسي للمحرك بدلاً من التنسيق الذي تطلبه هذه الإعدادات. تُحفظ السطور، وتُكتب مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_sections']='يحمل هذا الملف قسماً لا تقرأه هذه الصفحة إطلاقاً. لا يُستخدم شيء هنا منه. يُحفظ كاملاً، ويُكتب مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_quality_options']='يذكر هذا الملف خيارات جودة مياه EPANET: خيار Quality، الذي يسمّي نوع تحليل جودة المياه، وإعدادين يخصان مادة كيميائية، هما الانتشارية النسبية وسماحية الجودة. تُحفظ الخيارات الثلاثة كلها وتُستخدم. يُحسب هنا عمر الماء وتتبع المصدر ومادة كيميائية كل على حدة، ويُسلَّم الإعدادان الكيميائيان إلى محرك EPANET عند تشغيل مادة كيميائية. تُكتب جميعها مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_file_options']='يشير هذا الملف إلى ملف مساعد: Map، الذي يحمل الإحداثيات، أو Hydraulics، الذي يحمل حسابات هيدروليكية جاهزة. لا يمكن لهذه الصفحة فتح أيّ منهما، فتُحفظ السطور كما هي وتُكتب مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_demand_model']='يطلب هذا الملف تحليلاً مدفوعاً بالضغط (PDA)، حيث يستقبل الملتقى أقل من طلبه عندما يكون الضغط هناك منخفضاً. تحل هذه الصفحة بطريقة مدفوعة بالطلب، فيستقبل كل ملتقى هنا الطلب الذي يذكره الملف، مهما كان الضغط الناتج. يُحفظ السطر ويُكتب مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_other_options']='يذكر هذا الملف خيارات لا تقرأها هذه الصفحة. لا يُستخدم شيء هنا منها. تُحفظ وتُكتب مرة أخرى إذا حفظت ملف EPANET.';
$ec_lang['lpn_inp_drop_net_options']='يذكر ملف EPANET ‎.net هذا إعدادات لا تملك هذه الصفحة عنصر تحكم لها، فتُعرض قيمها هنا بدلاً من نقلها. جاء كل شيء آخر. إذا احتجتها، افتح الملف في EPANET واستخدم File، Export، Network لحفظه كملف ‎.inp، ثم استورد ذلك الملف.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_net_emergency']='كان هذا ملف EPANET ‎.net. هذا هو ملف مشروع EPANET الخاص به، وليس له وصف منشور، وتقرأ هذه الصفحة تنسيقه باستنتاجه من ملفات أمثلة، فاستخدمه فقط حين لا تملك غيره لا كطريق يُعتمد عليه. أما ملف ‎.inp فهو التنسيق الموثَّق الذي تقرؤه كل البرامج الأخرى: في EPANET استخدم File، Export، Network لكتابة واحد، واستورد ذلك بدلاً منه كلما استطعت.';
$ec_lang['lpn_inp_drop_backdrop']='يشير هذا الملف إلى صورة خلفية لكنه لا يحتوي على الصورة نفسها. أضفها بنفسك عبر ملف، صورة خلفية، إضافة صورة.';
$ec_lang['lpn_inp_drop_dangling']='تشير هذه الأنابيب إلى ملتقى غير موجود في الملف، لذا استُبعدت.';
$ec_lang['lpn_inp_drop_units']='وحدة التدفق المذكورة في هذا الملف ليست معروفة لدى هذه الصفحة، لذا قُرئ كل رقم على أنه بالغالون في الدقيقة. تحقق من كل رقم قبل استخدام النتائج.';
$ec_lang['lpn_inp_drop_anchor_missing']='كان هذا النص مرتبطاً بملتقى أو خزان أو صهريج غير موجود في الملف. وصل كنص حر في المكان الذي وضعه الملف فيه، ولم يعد مرتبطاً بشيء.';
$ec_lang['lpn_import_notes_heading']='قُرئ هذا المشروع من ملف EPANET. بعض ما يحمله ذلك الملف محفوظ لكنه غير مستخدَم في هذه الصفحة.';
// {name} is a project name; word order is the translator's to choose. Says where the user landed,
// the same way lpn_status_deleted_opened does -- an opened file becomes a NEW project here, and
// that is the part a user cannot see for themselves.
$ec_lang['lpn_status_imported']='فُتح {name} من ملف، وأُضيف إلى هذا المتصفح كمشروع جديد.';
// Live file link (Task 195 Phase 2). Only reachable where the browser has the File System Access
// API -- Chromium today, not Firefox or Safari -- so a translator will not find these on every
// browser they test in. That is expected, not a bug.
// {file} is a file name and {name} a project name; word order is the translator's to choose.
$ec_lang['lpn_file_type_desc']='ملف مشروع';
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
$ec_lang['lpn_file_upload_explain']='لا يستطيع هذا المتصفح الاتصال بملف، فإن فتح ملف هنا هو في الواقع رفع: يُنسخ المشروع إلى هذا المتصفح، والطريقة الوحيدة لحفظ عملك في الملف مرة أخرى هي الكتابة فوقه عبر ملف، حفظ باسم.';
// The tip on the Open button, which reached the toolbar with Task 246. It exists because that
// button is icon-only: on a menu row the word carries the whole meaning, and on the strip the tip
// is where the rest of it lives.
$ec_lang['lpn_file_open_tip']='فتح ملف مشروع محفوظ من هذه الصفحة.';
// Tips on the two Save rows. They differ by what the browser can do, which is the one thing a user
// cannot see for themselves, and "connect" is the word that carries it (Tom, 2026-08-04).
$ec_lang['lpn_file_save_tip']='يحفظ في الملف المتصل.';
$ec_lang['lpn_file_saveas_tip']='اختر ملفاً لتحفظ فيه. يتصل هذا المشروع بذلك الملف، ويكتب أمر الحفظ فيه من الآن فصاعداً.';
// The one thing a user can actually DO about the proliferation of files (Tom, 2026-08-04: "I hate to
// cause the proliferation of files"). We cannot make a browser ask where to put a download -- there
// is no API for it, and the download attribute cannot override the setting -- but the user can turn
// that setting on themselves, and then Save as really does let them overwrite the file they started
// from. It belongs in this tip rather than in a dialog: it answers a question asked at the moment
// the user is choosing where their work goes.
// Edited by TGH 2026-09-07
$ec_lang['lpn_file_saveas_tip_download']='يحفظ باستخدام إعدادات التنزيل في متصفحك. لا يستطيع هذا المتصفح الاتصال بملف، لذا فإن الحفظ معطّل ولا يتوفر إلا حفظ باسم. إذا فعّلت إعداد المتصفح “السؤال عن مكان حفظ كل ملف”، يمكنك اختيار الملف الأصلي والكتابة فوقه.';
$ec_lang['lpn_status_uploaded']='تم رفع ملف المشروع. لا يمكن الحفاظ على اتصال به، فالطريقة الوحيدة للحفظ فيه مرة أخرى هي استخدام ملف، حفظ باسم.';
$ec_lang['lpn_status_downloaded']='تم تنزيل {file}. لا يستطيع هذا المتصفح الاتصال بملف، لذا يبقى هذا المشروع معلَّماً بأنه غير محفوظ في ملف.';
$ec_lang['lpn_status_file_opened']='تم فتح {file}.';
$ec_lang['lpn_status_already_open']='ذلك الملف مفتوح هنا بالفعل باسم {name}، لذا تم التحويل إليه بدلاً من فتح نسخة ثانية.';
$ec_lang['lpn_status_already_open_dirty']='ذلك الملف مفتوح هنا بالفعل باسم {name}، وفيه تغييرات لم تُحفظ. تم التحويل إليه بدلاً من فتح نسخة ثانية. استخدم ملف، استرجاع إذا أردت النسخة الموجودة على القرص بدلاً من ذلك.';
$ec_lang['lpn_status_saved']='تم حفظ {file}.';
$ec_lang['lpn_status_reverted']='أُعيد تحميل {file} من القرص.';
// Nothing is written to a file except when the user asks (Task 211). Autosave to the file is gone on
// purpose: a program that writes your file behind your back takes away your right to walk away from
// a session. So these three carry the whole close/discard/revert conversation.
// {name} is a project name and {file} a file name; word order is the translator\'s to choose.
$ec_lang['lpn_close_save_confirm']='هل تريد حفظ تغييراتك في {name} قبل إغلاقه؟';
// A browser project is in no file at all, so closing it really is the end of it. Said plainly rather
// than softened -- this is the one destructive act left on the page.
$ec_lang['lpn_close_browser_confirm']='يُحفظ {name} في هذا المتصفح فقط. إذا أغلقته دون حفظه في ملف، فسيضيع نهائياً.';
$ec_lang['lpn_close_discard']='إغلاق دون حفظ';
$ec_lang['lpn_cancel']='إلغاء';
$ec_lang['lpn_revert_confirm']='هل تريد التخلص من التغييرات التي أجريتها وإعادة تحميل {file} من القرص؟';
// A file project whose page has been reloaded. Browsers do not stay connected to a file across a
// page load, so the link is gone even though we still know the name. Says what to do, not just what
// happened.
$ec_lang['lpn_file_needs_reopen']='جاء هذا المشروع من {file}، لكن الاتصال بذلك الملف انقطع. اختر الملف مرة أخرى للاتصال به.';
// Says what is still safe before it says what failed: the reassurance is the part a worried user
// needs, and it is true -- the browser copy is written on every edit regardless.
$ec_lang['lpn_file_write_failed']='تعذّرت الكتابة في الملف. ربما نُقل أو أُعيدت تسميته، أو سُحب الإذن. لا يزال عملك محفوظاً في هذا المتصفح.';
$ec_lang['lpn_file_changed_elsewhere']='حفظ شخص آخر في هذا الملف منذ أن فتحته، فالحفظ الآن سيكتب فوق عمله. استخدم ملف، حفظ باسم للاحتفاظ بتغييراتك في ملف خاص بك، أو ملف، استرجاع للتخلص من تغييراتك وتحميل تغييراته.';
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
$ec_lang['lpn_lock_somebody']='شخص آخر';
// Opening a file somebody else has open is a CHOICE, not a surprise (Task 211). One question at the
// moment of opening, with both real answers on it -- the way every drawing and document program has
// always done it.
$ec_lang['lpn_lock_open_heading']='{name} فتح هذا الملف.';
$ec_lang['lpn_lock_open_readonly']='فتح للقراءة فقط';
// "Create a copy", not "my own copy" (Tom, 2026-08-04): two projects cannot share one name, and
// "my own copy" quietly promises a personal one of everything -- the proliferation this page keeps
// trying not to encourage. "Create a copy" says what happens and claims nothing.
$ec_lang['lpn_lock_break']='كسر قفلهم';
// **TASK 667(b): NOBODY IS ASKED FOR A NAME UNTIL A COLLEAGUE ACTUALLY WANTS THE FILE** (Tom,
// 2026-09-17). The page used to ask the FIRST user for initials the first time they saved, for a
// name nobody would ever read unless a colleague happened to collide with them -- and on a site
// with no login and no account, that reads as a registration. So the lock is taken anonymously and
// the four sentences below are what a second user gets instead: the ages, then the answers.
// **He conceded the trade rather than denying it** -- *"Of course saving initials with the lock is
// better. But asking user A for their initials the first time they save a file is a bit startling,
// not to mention easily confused with a login or account registration."* Asking up front is the
// REJECTED ALTERNATIVE, not an improvement waiting to be proposed.
$ec_lang['lpn_lock_open_inuse']='يبدو أن هذا الملف قيد الاستخدام.';
$ec_lang['lpn_lock_open_care']='لتجنب فقدان البيانات، اختر بعناية من الخيارات أدناه.';
// THREE AGES, EACH ITS OWN SENTENCE, AND EACH SAID ONLY WHERE IT IS KNOWN. A dialog that decides
// whether somebody interrupts a colleague must never carry a number it had to invent: an age the
// server has no record of is simply not stated. `lpn_lock_age_inuse` is the server's own clock;
// the other two are the holder's, reported with every heartbeat.
$ec_lang['lpn_lock_age_inuse']='وهو قيد الاستخدام منذ {x}.';
$ec_lang['lpn_lock_age_edited']='آخر تحرير له كان قبل {x}.';
$ec_lang['lpn_lock_age_saved']='آخر حفظ له كان قبل {x}.';
$ec_lang['lpn_lock_age_never_saved']='لم يُحفَظ شيء في هذا الملف بعد.';
$ec_lang['lpn_lock_age_unknown']='لا يوجد سجل لمدة استخدامه، أو لآخر مرة حُفظ أو حُرِّر فيها.';
// Four answers now, in Tom's own order, so the prose and the button row read the same way.
// **IN THE BUTTON ROW'S OWN ORDER** (2026-09-17): Ask, Open read-only, Break lock. The prose and
// the row have to read the same way down the page, or the sentence a person is reading is about
// a different button from the one their eye has landed on. Cancel is not described, because a
// Cancel that needed a sentence would not be a Cancel.
$ec_lang['lpn_lock_open_choices_ask']='"اسأل" يُخبر من فتح هذا الملف بأنك تريده، ولا يغيّر شيئاً آخر. "فتح للقراءة فقط" يتيح لك النظر إليه وتغيير أي شيء تريده، دون القدرة على الحفظ هنا. "كسر القفل" يتيح لك الحفظ فوق الملف؛ لا يُفقد عملهم غير المحفوظ، لكنهم لن يستطيعوا بعد الآن الحفظ هنا، وقد يضطر أحد إلى دمج الاثنين يدوياً.';
$ec_lang['lpn_lock_ask']='اسأل';
// Asked at the one moment the name is useful, and SENT rather than stored: nothing new is written to
// this computer for it, which is the whole point of moving the question here.
$ec_lang['lpn_lock_ask_prompt']='من نقول إنه يسأل؟ الأحرف الأولى من اسمك مثالية. تُرسَل إلى من فتح الملف، وتُخزَّن فقط في هذا المتصفح.';
$ec_lang['lpn_lock_ask_sent']='طلبنا ممن فتح هذا الملف إغلاقه. سيرونه خلال دقيقة، إذا كانت صفحتهم لا تزال مفتوحة. لم يتغيّر شيء آخر، والملف لا يزال لهم حتى يغلقوه.';
$ec_lang['lpn_lock_ask_failed']='تعذّر تسليم رسالتك. إما أنه لا أحد يفتح هذا الملف الآن، أو تعذّر الوصول إلى الخادم.';
// **A CANCEL THAT LEAVES NO RESIDUE IS THE DEFECT** (ROADMAP Task 704, Ida's diagnosis). Backing
// out of the locked-file dialog used to say nothing at all, so a reader who pressed Cancel by
// reflex had no way to learn what had just been offered. It says what did not happen, and why.
$ec_lang['lpn_lock_open_cancelled']='لم يُفتح ذلك الملف، ولم يتغيّر شيء هنا. لا يزال شخص آخر يفتحه.';
// The other end of the back channel, shown to the holder.
$ec_lang['lpn_lock_requested']='يريد {name} تحرير هذا الملف. عندما تكون جاهزاً، احفظ عملك واستخدم ملف، إغلاق المشروع لتسليمه.';
$ec_lang['lpn_ago_seconds']='{n} ثانية';
$ec_lang['lpn_ago_minutes']='{n} دقيقة';
$ec_lang['lpn_ago_hours']='{n} ساعة';
$ec_lang['lpn_ago_days']='{n} يوم';
$ec_lang['lpn_ago_unknown']='وقت غير معروف';
// ---- The message log (ROADMAP Task 704) ----
// A notice is on screen for eight seconds and is then gone; these name the place it went. Kept in
// memory only, for as long as the page is open.
$ec_lang['lpn_msglog_name']='الرسائل';
$ec_lang['lpn_msglog_heading']='الرسائل الأخيرة';
$ec_lang['lpn_msglog_empty']='لا توجد رسائل بعد.';
// The wrapper around lpn_ago_seconds and its siblings, so a language can put the word for "ago"
// wherever its own grammar wants it.
$ec_lang['lpn_msglog_ago']='قبل {x}';
$ec_lang['lpn_msglog_note']='الأحدث أولاً. تحتفظ هذه الصفحة بآخر {n} رسالة أثناء فتحها، ولا يُخزَّن شيء على جهازك.';
// Read-only means read-only: it never turns itself back into an editable file while you are looking
// at it, and it never offers to save over the other person\'s file. It cannot -- their file has moved
// on since you opened it, so writing yours over it would destroy their work. What you CAN do is
// everything else, including changing the network and keeping it as a file of your own.
$ec_lang['lpn_lock_readonly_banner']='للقراءة فقط: {name} فتح هذا الملف. يمكنك تغيير أي شيء تريده هنا، لكن لا يمكنك الحفظ. استخدم ملف، حفظ باسم للحفظ في ملف آخر.';
// Opening a file we could not lock is the moment of danger (Tom, 2026-08-03): from then on nothing
// stops a colleague editing the same file. Editing still works -- an unreachable server must never
// take the calculator away -- so this warns rather than blocks, and promises the follow-up that
// lpn_lock_restored keeps.
$ec_lang['lpn_lock_unavailable']='تنبيه: تعذّر الوصول إلى الخادم للتحقق من قفل هذا المشروع أو إنشائه، فلا شيء يمنع زميلاً من تعديل الملف نفسه في الوقت نفسه. ستُبلَّغ إذا عاد القفل للعمل.';
$ec_lang['lpn_lock_storage_error']='تنبيه: لا يستطيع هذا الموقع حفظ سجلات القفل، فلا شيء يمنع زميلاً من تعديل الملف نفسه في الوقت نفسه. هذا خلل في إعداد الخادم، وليس شيئاً يمكنك إصلاحه هنا — مجلد القفل غير قابل للكتابة من قبل خادم الويب.';
$ec_lang['lpn_lock_full_error']='تنبيه: نفدت مساحة هذا الموقع لتسجيل من فتح أي مشروع، فلا شيء يمنع زميلاً من تعديل الملف نفسه في الوقت نفسه. هذا خلل في إعداد الخادم، وليس شيئاً يمكنك إصلاحه هنا.';
$ec_lang['lpn_lock_not_asked']='لا يعمل القفل لهذا المشروع، فلا شيء يمنع زميلاً من تعديل الملف نفسه في الوقت نفسه. لم يُسجَّل بعد اسم لك في هذا المتصفح، أو ليس للمشروع معرّف — يحدّد حفظ المشروع في ملف كليهما.';
$ec_lang['lpn_lock_restored']='عاد القفل للعمل، وأصبح هذا الملف الآن لك لتحفظ فيه.';
$ec_lang['lpn_lock_dismiss']='إخفاء هذه الرسالة';
// Shown once per browser, before the first file picker opens. Three short paragraphs on purpose:
// this is the one place the whole file-and-lock idea is explained, and it has to survive translation
// into 26 languages, so it says one thing per sentence and avoids every word of jargon it can.
$ec_lang['lpn_file_training_1']='سيُحفظ مشروعك في ملف على هذا الجهاز. يُحفظ عندما تطلب ذلك، ولا يُحفظ في أي وقت آخر، فلا يُكتب في ذلك الملف شيء دون علمك.';
$ec_lang['lpn_file_training_2']='لكي لا يعدّل شخصان ملفاً واحداً في الوقت نفسه، يتتبّع هذا الموقع من فتحه. إذا كان شخص ما قد فتحه بالفعل، لا يزال بإمكانك فتحه ومشاهدته، أو الاحتفاظ بنسخة خاصة بك.';
// Said BEFORE it happens, because it is alarming and unexplained when it happens (Tom, 2026-08-04:
// "hawsedc.com will be able to edit ... is a canned browser warning whose confusing meaning we
// cannot fix"). He is right that we cannot fix it -- it is the browser asking, in the browser\'s
// own words, and there is no way to reword it, suppress it, or pre-approve it. What we CAN do is
// warn that it is coming and say it is normal, which is what this line is for.
$ec_lang['lpn_file_training_permission']='في أول مرة تحفظ فيها، سيسألك متصفحك عمّا إذا كان يجوز لهذا الموقع تعديل الملف. هذا السؤال يأتي من المتصفح لا منّا، والموافقة عليه هي ما يسمح لأمر الحفظ بكتابة عملك مرة أخرى في الملف. عادةً ما يُسأل مرة واحدة فقط لكل ملف.';
// Corrected 2026-08-04: the old wording said anyone you SEND THE FILE TO can see this name, which is
// false -- the name is never written into the project file. It is held in this browser and on this
// site, and it is shown to whoever opens the SAME file. That is still public enough to be worth
// saying, so the warning stays and only the claim changes.
$ec_lang['lpn_file_training_continue']='متابعة';
// Recovery when the linked file has moved, been renamed, or been deleted. The button does the
// finding; the message never tells someone to go hunting through a menu.
$ec_lang['lpn_file_relink']='اختيار الملف مرة أخرى';
$ec_lang['lpn_file_reconnect']='إعادة الاتصال بهذا الملف';
$ec_lang['lpn_file_reconnect_alert']='جاء هذا المشروع من {file}. يحتاج متصفحك إلى إذنك مرة أخرى قبل أن يتمكن من الكتابة فيه. أعد الاتصال أدناه.';
// Read-only means read-only, so Save as from a read-only project refuses the file it came from --
// the one file it must never write. handle.isSameEntry() is what makes this checkable at all.
$ec_lang['lpn_saveas_same_file']='هذا هو الملف نفسه الذي فتحه شخص آخر، فلا يمكن الكتابة فوقه. اختر ملفاً آخر أو اسماً آخر.';
$ec_lang['lpn_saveas_overwrites_project']='يحتوي ذلك الملف بالفعل على مشروع مختلف، {name}. سيؤدي الحفظ هنا إلى استبداله بالكامل. هل تريد المتابعة؟';
$ec_lang['lpn_saveas_overwrites_newer']='تغيّر ذلك الملف منذ آخر مرة رأيته فيها، فمن شبه المؤكد أن شخصاً آخر حفظ فيه. سيؤدي الحفظ هنا إلى استبدال نسخته بنسختك. هل تريد المتابعة؟';
// The "Save to file every N seconds" setting and its 60-180 second range are GONE (Task 211). One
// number was doing three jobs -- the write interval, the lock heartbeat, and the how-long-until-a
// -colleague-may-take-over threshold -- so the range was protecting a coupling rather than the user.
// Nothing is written to a file on a timer any more, so there is no interval to set.
$ec_lang['lpn_prompt_project_name']='اسم لهذا المشروع';
// Closing the CURRENT project opens the most recently updated survivor, so a network the user did
// not ask for appears. Tom, 2026-07-31: do NOT warn beforehand -- say afterwards where you landed.
// (Task 211 renamed the act from Delete to Close: closing IS the removal, and there is no longer a
// separate Delete for it to be confused with.)
// {closed} and {opened} are project names; word order is the translator's to choose.
$ec_lang['lpn_status_closed_opened']='تم إغلاق {closed}. يُعرض الآن {opened}.';
$ec_lang['lpn_status_closed_empty']='تم إغلاق {closed}. بدأ مشروع فارغ جديد.';
$ec_lang['lpn_storage_full']='لم يُحفظ. تخزين المتصفح ممتلئ أو غير متاح، لذا ستُفقد تغييراتك الأخيرة عند إغلاق هذا التبويب.';
$ec_lang['lpn_storage_unreadable']='لم يُحفظ. تعذّرت قراءة هذا المشروع من تخزين المتصفح. تُترك نسخته المخزَّنة كما هي تماماً ولن تُستبدل، فلا شيء في هذا التبويب يُحفظ الآن. افتح ملفاً أو أنشئ مشروعاً جديداً لمواصلة العمل.';
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
$ec_lang['lpn_about_credits']='شكر وتقدير';
$ec_lang['lpn_help_welcome']='صفحة الترحيب';
$ec_lang['lpn_about_license']='مرخّص بموجب رخصة GNU العمومية العامة الإصدار 3.0 أو أحدث.';
$ec_lang['lpn_notes_1_term']='كيف تُحل';
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
$ec_lang['lpn_notes_1_def']='تُحل كل لحظة بخوارزمية التدرج الشامل نفسها التي يستخدمها EPANET. اضبط مدة تشغيل كلية ليحسب حلّال EPANET كل خطوة إبلاغ بالتتابع: تمتلئ الصهاريج وتُفرَّغ، وتتبع الطلبات أنماطها، ويعيد شريط الأدوات تشغيل التسلسل. يحسب الحلّال المدمج لحظة واحدة في كل مرة ويُبقي كل صهريج عند منسوبه الابتدائي.';
$ec_lang['lpn_notes_2_term']='غير مُحاكى';
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
$ec_lang['lpn_notes_2_def']='لا تُنمذَج كيمياء جودة المياه؛ أما عمر الماء وتتبع المصدر فيُنمذجان. الصمامات: يعمل صمام التحكم في كلا الحلّالين، أما الصمامات التي تضبط وضعها بنفسها (PRV، PSV، FCV) فتُحل بحلّال EPANET، الذي تُفعّله هذه الصفحة تلقائياً عندما تحمل شبكتك أحد تلك الصمامات.';
$ec_lang['lpn_notes_3_term']='حفظ المشاريع';
$ec_lang['lpn_notes_3_def']='كل مشروع هو تبويب، وكل تبويب يُحفظ في هذا المتصفح أثناء عملك. يؤدي مسح بيانات متصفحك إلى حذفها جميعاً، فاحتفظ بعملك في ملف: ملف، حفظ باسم. تعني علامة النجمة على تبويب أنه يحمل تغييرات غير موجودة في ملف. لا يُكتب شيء في ملف أبداً ما لم تطلب ذلك. في بعض المتصفحات يتصل المشروع بالملف الذي تحفظه فيه، ويكتب أمر ملف، حفظ في ذلك الملف نفسه من حينها؛ وفي متصفحات أخرى لا يمكن الاتصال، فيكون الحفظ معطّلاً ولا يتوفر إلا حفظ باسم. عندما يُحفظ ملف مشروع على قرص مشترك، تخبرك هذه الصفحة إذا كان زميل قد فتحه بالفعل، حتى لا يكتب شخصان فوق عمل بعضهما.';
// Pump curve documentation (Tom, 2026-07-30: "How should we document the curve equations?").
// It lives in the Notes list, not in the pump popup: the popup is a small floating panel that has
// to stay readable on a phone, while the Notes section is already this page's documentation home,
// prints with the page, and is translated with everything else. **The popup no longer carries even
// a pointer to here** (Tom, 2026-09-06): it holds a curve REFERENCE and nothing else, and the
// Library's Curves section is where a curve is read and edited.
// H and Q are symbols -- keep them as they are in every language.
$ec_lang['lpn_notes_5_term']='منحنى المضخة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_notes_5_def']='تتبع المضخة العلاقة H = H₀ − aQ^b، حيث H هو العلو الذي تضيفه المضخة وQ هو التدفق خلالها. أدخل نقطة واحدة أو نقطتين أو ثلاث نقاط من منحنى الشركة المصنعة. النقاط الثلاث، وهي العلو عند تدفق صفري ونقطة التشغيل العادية ونقطة أعلى تدفق، توائم H₀ وa وb مباشرة، وتتبع المنحنى المنشور عن كثب. توائم النقطتان قطعاً مكافئاً (b = 2) قمته عند تدفق صفري. تستخدم النقطة الواحدة قاعدة شائعة: العلو عند تدفق صفري يساوي 1.33 × العلو الذي تُدخله، وأعلى تدفق يساوي 2 × التدفق الذي تُدخله، مما يعطي أيضاً b = 2. المضخة التي لا تُدخل لها أي نقاط لا تضيف أي علو على الإطلاق. لا يُقطع المنحنى عند وصول العلو إلى الصفر، لذا فإن طلب تدفق من المضخة أكبر مما يستطيع منحناها تقديمه يعطي علواً سالباً. الحل هو مضخة أكبر أو طلب أصغر، لا موائمة منحنى مختلفة. يمكن للمنحنى أن يحمل أكثر من ثلاث نقاط. يقرأ الحلّال المدمج ثلاثاً منها، الأولى والوسطى والأخيرة، لموائمة المعادلة أعلاه؛ أما محرك EPANET فيقرأ كل نقطة أدخلتها.';
// WAS "Planned additions", NAMING THREE THINGS THAT NOW SHIP (scenarios, result tables, .inp
// export). A planned-additions list is stale the moment it is right, and it tells a returning
// user the tool is less capable than it is, so this slot now points at what is here instead.
// The invitation it used to carry lives in Help > Fix something.
$ec_lang['lpn_notes_4_term']='أيضاً في هذه الصفحة';
$ec_lang['lpn_notes_4_def']='يمكن أن يقوم المشروع على أرض حقيقية بخريطة شوارع خلفه. يمكن قراءة ملفات EPANET .inp وكتابتها. تُرسم اللوحة السفلية مقطعاً طولياً على طول مسار وتسرد الملتقيات. يمكن تلوين العناصر حسب نتائجها، ويحدد البحث كل عنصر يطابق شرطاً تضبطه.';
$ec_lang['lpn_notes_6_term']='مساعدة أعمدة الجدول';
// R-312, Tom's own row, verbatim: "Paste as new rows at end of table | Right-click, ⋮ menu in
// heading top right corner, or Ctrl+Shift+V". It rides on this table rather than the shortcuts one
// because its own wording pairs a command with a GESTURE, on the same "action, then gesture" shape
// every row here already has -- the Hide/Show row beside it names the identical menu.
$ec_lang['lpn_notes_6_def']='<table class="lpn-notes-table"><tbody><tr><td>تحديد عمود</td><td>انقر العنوان</td></tr><tr><td>إضافة عمود إلى التحديد أو توسيعه</td><td>Ctrl+click أو Shift+click على عنوان آخر</td></tr><tr><td>نقل (إعادة ترتيب) العمود أو الأعمدة المحدَّدة</td><td>اسحب أو استخدم إدارة الأعمدة… في قائمة النقر بالزر الأيمن أو قائمة ⋮</td></tr><tr><td>قائمة ⋮ وسهم الفرز.</td><td>مرّر فوق الزاوية العلوية لعنوان، أو حدده أو انتقل إليه بمفتاح Tab</td></tr><tr><td>إخفاء، أو إظهار الكل، أو إدارة الظهور والترتيب</td><td>انقر العنوان بالزر الأيمن أو قائمة ⋮ في الزاوية العلوية اليمنى للعنوان</td></tr><tr><td>الفرز حسب العمود</td><td>أيقونة السهم في الزاوية العلوية اليمنى للعنوان</td></tr><tr><td>لصق كصفوف جديدة في نهاية الجدول</td><td>النقر بالزر الأيمن، قائمة ⋮ في الزاوية العلوية اليمنى للعنوان، أو Ctrl+Shift+V</td></tr></tbody></table>';
$ec_lang['lpn_notes_7_term']='اختصارات لوحة المفاتيح للجدول';
// R-311, his own row: "Ctrl+Shift+V | Paste as new rows at end of table".
$ec_lang['lpn_notes_7_def']='<table class="lpn-notes-table"><tbody><tr><td>مفاتيح الأسهم</td><td>التنقل.</td></tr><tr><td>Tab، Enter</td><td>إنهاء الإدخال والتنقل عبر / أسفل خلية واحدة.</td></tr><tr><td>Shift+Tab، Shift+Enter</td><td>التنقل للخلف.</td></tr><tr><td>Shift+مفاتيح الأسهم</td><td>توسيع التحديد.</td></tr><tr><td>Ctrl+C</td><td>نسخ التحديد.</td></tr><tr><td>Ctrl+D</td><td>تعبئة التحديد إلى الأسفل من صفه العلوي.</td></tr><tr><td>Ctrl+Enter</td><td>تعبئة التحديد بقيمة الخلية النشطة.</td></tr><tr><td>Ctrl+A</td><td>تحديد الجدول كله.</td></tr><tr><td>Ctrl+Shift+V</td><td>لصق كصفوف جديدة في نهاية الجدول.</td></tr><tr><td>Delete</td><td>مسح خلية.</td></tr><tr><td>F2</td><td>فتح خلية لتحريرها.</td></tr><tr><td>Esc</td><td>إلغاء تحرير.</td></tr></tbody></table>';
// COLOR BAND LIMITS ARE FROZEN, NOT LIVE (Task 448). Tom, 2026-08-19: *"colors are subconsciously
// expected to be stable through an animation... recomputing at each time step gives a wrong
// impression of the system. In this we are ratifying EPANET."* The mechanism is
// settings.colorFrozenBreaks in js/looped-network.js.
$ec_lang['lpn_notes_color_term']='تبقى حدود نطاقات الألوان كما هي';
$ec_lang['lpn_notes_color_def']='تُضبط حدود نطاقات الألوان عندما تختار طريقة تصنيف بيانات. لا تُضبط مرة أخرى في كل خطوة زمنية، لأن ذلك سيجعل الألوان تعني شيئاً جديداً في كل خطوة، وهذا غير مفيد لتصوّر نظامك. يعمل EPANET بالطريقة نفسها. للحصول على حدود جديدة، اختر طريقة مرة أخرى أو اكتب حدودك الخاصة.';
$ec_lang['lpn_notes_epanet_term']='ثوابت هيزن-وليامز تطابق EPANET';
$ec_lang['lpn_notes_epanet_def']='في أغسطس 2026 غُيِّر معامل هيزن-وليامز وأسّه ليطابقا EPANET. تختلف نتائج فقدان الضغط عن الإصدارات السابقة من هذه الصفحة بنسبة تصل إلى 0.1 بالمئة، وهو أصغر بكثير من عدم اليقين في قيمة C نفسها.';
$ec_lang['lpn_notes_engine_term']='إصدار EPANET الذي تُشغّله هذه الصفحة';
$ec_lang['lpn_notes_engine_def']='حلّال EPANET في هذه الصفحة هو OWA-EPANET 2.3.5، الصادر في 20 فبراير 2025. طوّرته Open Water Analytics، وهو مجتمع يعمل مع وكالة حماية البيئة الأمريكية، التي أصدرت الإصدار 2.2.0 في ديسمبر 2019. يسمّيه تقرير التشغيل 2.3.05 لأن المحرّك يكتب الرقم الأخير برقمين. يصل إلى هذه الصفحة عبر epanet-js 0.9.0 من تأليف Luke Butler، بترخيص MIT، ويعمل داخل متصفحك: شبكتك لا تُرسل أبداً إلى أي مكان لحلّها.';
$ec_lang['lpn_id_invalid']='أدخل معرّفاً بلا مسافات وبلا علامات اقتباس.';
$ec_lang['lpn_id_taken']='ذلك المعرّف قيد الاستخدام بالفعل.';
$ec_lang['lpn_diag_no_fixed_head']='أضف خزاناً أو صهريجاً. تحتاج الشبكة إلى منسوب مائي معروف واحد على الأقل قبل أن يمكن حلها.';
$ec_lang['lpn_diag_dangling_link']='يتصل أنبوب أو مضخة بعقدة لم تعد موجودة:';
$ec_lang['lpn_diag_unreachable']='لا يوجد مسار من هذه العقد إلى أي خزان:';
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
$ec_lang['lpn_engine_fetching']='جارٍ تحميل حلّال EPANET. يُنزَّل مرة واحدة ثم يُحفظ على هذا الجهاز، ليعمل لاحقاً دون اتصال بالإنترنت.';
$ec_lang['lpn_engine_ready']='حلّال EPANET موجود الآن على هذا الجهاز، ويعمل دون اتصال بالإنترنت.';
$ec_lang['lpn_engine_fetching_valve']='جارٍ تحميل حلّال EPANET، ليتم حل هذا الصمام الآن ودون اتصال بالإنترنت لاحقاً.';
$ec_lang['lpn_engine_ready_valve']='حلّال EPANET موجود الآن على هذا الجهاز. الصمامات التي تفتح وتغلق من تلقاء نفسها ستعمل دون اتصال بالإنترنت.';
$ec_lang['lpn_engine_unavailable']='تعذّر تحميل حلّال EPANET، وهو ما يحل الصمامات التي تفتح وتغلق من تلقاء نفسها. اتصل بالإنترنت مرة واحدة ليُحفظ على هذا الجهاز بعد ذلك.';
$ec_lang['lpn_engine_needed_loading']='يجري تحميل حلّال EPANET أثناء بنائك للشبكة. ستتوفر النتائج عند اكتمال التحميل.';
// **THE WAIT, SAID OUT LOUD, WITH A NUMBER ON IT** (ROADMAP Task 608). The first sentence is Tom's
// own, 2026-09-08, and "Continue working" is the half that matters: it says the page is not frozen.
// The other two are the progress readout, which is a whole sentence of its own so a language can
// put the number where it belongs. There is no invented percentage: where the transfer does not
// state a total, the kilobytes are reported instead and the reader is told why.
// The bar under that sentence is named for a screen reader, which cannot see it fill.
$ec_lang['lpn_engine_bar_label']='تقدّم تحميل الحلّال';
$ec_lang['lpn_engine_wait']='جارٍ تحميل الحلّال. تتأخر النتائج للحظة. تابع العمل.';
$ec_lang['lpn_engine_wait_pct']='تم تحميل الحلّال بنسبة {percent}%.';
$ec_lang['lpn_engine_wait_bytes']='تم تحميل {kb} كيلوبايت من الحلّال حتى الآن. الإجمالي غير متاح، فنسبة الاكتمال غير معروفة.';
$ec_lang['lpn_engine_needed_failed']='لم يُحمَّل حلّال EPANET بعد، ولا يمكن تحميله الآن، وهذه الشبكة لا يمكن حلّها إلا به. سيُحمَّل عندما تكون متصلاً بالإنترنت.';
$ec_lang['lpn_diag_valve_needs_epanet']='تفتح هذه الصمامات وتغلق من تلقاء نفسها، ولا يمكن حسابها إلا بحلّال EPANET. تعذّر تحميل حلّال EPANET، لذا هذه النتائج مفقودة:';
$ec_lang['lpn_diag_valve_on_fixed_head']='هذه الصمامات موصولة مباشرة بخزان أو صهريج يحدد منسوب الماء هناك أصلاً، فلا يبقى للصمام ما يتحكم به. ضع أنبوباً قصيراً بين الصمام والخزان أو الصهريج:';
$ec_lang['lpn_diag_not_converged']='لم يُعثر على حل. تحقق من وجود قيم مستحيلة في الواقع، مثل قطر يساوي صفراً.';
// **THE NUMBERS ARE DRAWN AND MARKED, NOT THROWN AWAY** (ROADMAP Task 565). A solve that did not
// converge still produced the last iterate, and that is every number this page has -- refusing to
// draw it leaves nothing on screen and tells the user less, not more. So it is drawn and the status
// bar leads with this. `lpn_diag_not_converged` above is still the message for a solve that gave us
// nothing at all; these are for one that gave us something we do not vouch for.
// "Converge" is the profession's word and EPANET's own, and is deliberately not simplified.
$ec_lang['lpn_diag_not_converged_drawn']='لم يُعثر على حل متقارب. هذه الأرقام هي التكرار الأخير، وليست إجابة. لا تستخدمها.';
$ec_lang['lpn_diag_not_converged_trials']='توقف بعد {iterations} تكراراً.';
// Both numbers are EPANET's own, read back from the engine after the run. The accuracy is the one
// the engine actually used, which is not always the one the project asked for.
$ec_lang['lpn_diag_not_converged_error']='توقف بعد {iterations} تكراراً عند خطأ نسبي قدره {error}، وهو لم يصل إلى إعداد الدقة البالغ {accuracy}.';
$ec_lang['lpn_field_roughness']='الخشونة';
// Which coefficient this is was invisible: assembleModel() hardcodes Hazen-Williams, so a user
// typing a Manning n of 0.013 into it got nonsense with no warning. Revisit when a friction-method
// selector lands (see numberFieldPlain()'s own note).
$ec_lang['lpn_field_roughness_tip']='معامل هيزن-وليامز C. كلما زاد الرقم كان الأنبوب أملس: نحو 150 للبلاستيك الجديد، و130 للفولاذ أو الحديد الجديد، و100 للأنبوب القديم.';
$ec_lang['lpn_field_length']='الطول';
$ec_lang['lpn_field_from']='من';
$ec_lang['lpn_field_to']='إلى';
$ec_lang['lpn_field_length_tip']='طول الأنبوب. عند تفعيل تلقائي، يُقاس الطول مما رسمته. أوقف تلقائي لكتابة طول مختلف عن الرسم.';
// Plain-text wording of the concept mphl_total_junction_k/mphl_junction_loss already own (their
// values carry k<sub>m</sub> markup, incompatible with this popup's textContent-only fields) --
// Tom, 2026-07-30, "default to 2" matches mphl_total_junction_k_tip's own stated default exactly.
// ---- Valve fields (Task 248 phase 2) ----
// THE SETTING IS A DIFFERENT QUANTITY FOR EACH TYPE, which is why there are three labels here and
// not one "Setting". A pressure, a flow and a bare loss coefficient are not the same number in
// different units, and one shared label would have to be vague enough to cover all three.
$ec_lang['lpn_field_valve_type']='نوع الصمام';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_type_tip']='وظيفة الصمام. يحافظ صمام التخنيق على فاقد ثابت. أما الأنواع الثلاثة الأخرى فتحافظ على ضغط أو تدفق، وتفتح بالكامل أو تغلق أو تنغلق جزئياً مع تغيّر الماء. يضع تغيير النوع رقماً بدئياً جديداً في الإعداد أدناه، لأن الضغط ليس تدفقاً، ولا أيّ منهما معامل فاقد.';
// THE ENGLISH IS ELLIPTICAL ON PURPOSE -- the noun "valve" is dropped because the dropdown above
// already says "Valve type" -- so a translator meets a bare modifier with no head noun, and
// "throttle" alone pulls hard toward a car accelerator. Each _syn supplies the noun plus alternates
// (Wave 0, sprint 316; wording approved by Tom 2026-08-14, who rejected "pressure holding" for PSV).
$ec_lang['lpn_valve_type_tcv']='تخنيق (TCV)';
$ec_lang['lpn_valve_type_prv']='تخفيض الضغط (PRV)';
$ec_lang['lpn_valve_type_psv']='مواصلة الضغط (PSV)';
$ec_lang['lpn_valve_type_fcv']='التحكم بالتدفق (FCV)';
// The two EPANET valve types this page used to substitute with an open pipe (Task 248, 2026-08-17).
// Both keep EPANET's own name and initials, for the same reason the four above do: an engineer who
// knows the model knows these letters, and a name of our own invention would make them look up ours.
$ec_lang['lpn_valve_type_pbv']='كاسر الضغط (PBV)';
$ec_lang['lpn_valve_type_gpv']='للأغراض العامة (GPV)';
$ec_lang['lpn_field_valve_setting_drop']='انخفاض الضغط';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_drop_tip']='الضغط الذي يزيله الصمام. يزيل صمام كاسر الضغط دائماً هذا المقدار بالضبط من الضغط، أياً كان اتجاه سريان الماء. إنه انخفاض عبر الصمام، لا ضغط يُحافظ عليه.';
$ec_lang['lpn_inp_drop_gpv_curve']='يشير هذا الصمام إلى منحنى فقدان ضغط غير موجود في الملف. دخل الصمام دون منحنى، فيبقى مفتوحاً بالكامل حتى تمنحه واحداً.';
$ec_lang['lpn_gpv_curve_source']='منحنى فقدان ضغط الصمام';
// Edited by TGH 2026-09-07
$ec_lang['lpn_gpv_curve_source_tip']='المنحنى في مربع المكتبات الذي يحدد كم علواً يفقده هذا الصمام عند كل تدفق. يمكن لعدة صمامات أن تستخدم المنحنى نفسه، وتعديله هناك يغيّرها كلها. لا يحمل هذا الصمام سوى الإشارة إليه؛ أما النقاط نفسها فتُقرأ وتُعدَّل تحت المكتبات، المنحنيات.';
$ec_lang['lpn_field_valve_setting_pressure']='إعداد الضغط';
$ec_lang['lpn_field_valve_setting_pressure_tip']='الضغط الذي يحافظ عليه الصمام. يحافظ صمام تخفيض الضغط على ضغط الجانب المصبّي عند هذه القيمة أو أقل منها. ويحافظ صمام مواصلة الضغط على ضغط الجانب المنبعي عند هذه القيمة أو أكثر منها.';
$ec_lang['lpn_field_valve_setting_flow']='إعداد التدفق';
$ec_lang['lpn_field_valve_setting_flow_tip']='أقصى كمية ماء يسمح الصمام بمرورها. عندما يكون التدفق المطلوب أقل من هذا، يبقى الصمام مفتوحاً بالكامل ولا يضيف أي فاقد.';
$ec_lang['lpn_field_valve_setting']='الإعداد';
$ec_lang['lpn_field_valve_setting_loss']='معامل الفاقد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_valve_setting_loss_tip']='مقدار العلو الذي يزيله صمام التخنيق، ويُحتسب كمضاعف لعلو السرعة. استخدم 0 لصمام مفتوح بالكامل. هذا الرقم وحده هو كامل فاقد صمام التخنيق.';
$ec_lang['lpn_field_valve_diameter_tip']='عرض الفتحة داخل الصمام. تُحسب سرعة الماء خلال الصمام من هذا العرض، ويُشتق الفاقد من تلك السرعة.';
$ec_lang['lpn_field_valve_km_tip']='الفاقد من جسم الصمام عندما يكون مفتوحاً بالكامل، إضافة إلى ما يزيله إعداد الصمام. يُحتسب كمضاعف لعلو السرعة. استخدم 0 لتجاهله.';
$ec_lang['lpn_field_km']='معامل الفاقد الموضعي، k';
$ec_lang['lpn_field_km_tip']='الفاقد من الانحناءات والصمامات والوصلات على هذا الأنبوب، ويُحتسب كمضاعف لعلو السرعة. استخدم 0 لأنبوب مستقيم بسيط.';
// Short form of the same concept, for the two NARROW uses: the Labels checkbox list and the on-map
// legend beside it. Per CLAUDE.md's rule that a shared label must fit its narrowest use, these get
// their own key rather than being asked to carry the full popup-field wording -- an on-map legend
// entry reading "Minor (local) loss coefficient, km" would set the width of the whole legend box.
$ec_lang['lpn_field_km_short']='الفاقد الموضعي، k';
// **A PUMP NAMES A CURVE IN THE LIBRARY** (Task 586, Tom: *"move all pump curve data to the Library
// under curves and leave only curve references in the pump properties"*). `lpn_pump_curve_own` and
// `lpn_pump_curve_ref_note` went with the change: they were the two halves of `curveRef`, which
// named ANOTHER PUMP to copy points from because there was nothing else to point at. Two pumps on
// one curve name the same curve now, so there is no borrow to describe.
$ec_lang['lpn_pump_curve_source']='منحنى علو المضخة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pump_curve_source_tip']='المنحنى في مربع المكتبات الذي يحدد كم علواً تضيفه هذه المضخة عند كل تدفق. يمكن لعدة مضخات أن تستخدم المنحنى نفسه، وتعديله هناك يغيّرها كلها. لا تحمل هذه المضخة سوى الإشارة إليه؛ أما النقاط نفسها فتُقرأ وتُعدَّل تحت المكتبات، المنحنيات.';
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
$ec_lang['lpn_field_desc']='الوصف';
// THE THREE THINGS SOMEBODY HAS TO KNOW, and the third is the one nothing else on the page says: a
// description is free text, so the tag's one-word rule does NOT apply to it, but a line break cannot
// be written as a trailing comment and is turned into a space. The tip says what the field is for
// first, because that is what a reader of a blank box wants.
$ec_lang['lpn_field_desc_tip']='لاستخدامك الخاص، مثل زاوية شارع أو مما صُنع الأنبوب. يُنقَل إلى ملف EPANET ومنه، حيث يقع في نهاية صف الجزء الخاص به. لا تقرؤه أي عملية حساب. يصبح فاصل السطر مسافة، لأن الملف ليس له مكان يضعه فيه.';
// **THE ELEMENT'S TAG** (Task 579, EPANET's `[TAGS]`). Deliberately not called a "label": on this
// page a Label is our own annotation and a Text is EPANET's label, and a third word in that
// neighbourhood is the collision CLAUDE.md's vocabulary rule exists to stop. Tag is EPANET's own
// word for this and a hydraulic engineer already knows it.
$ec_lang['lpn_field_tag']='الوسم';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_tag_tip']='يمكن أن يحمل الوسم أي معنى تحتاجه، مثل منطقة ضغط أو أمر عمل. لا يقرؤه أي حساب هنا ولا في EPANET. الوسم كلمة واحدة: يتوقف EPANET عن القراءة عند أول مسافة، لذا تُرفض المسافة أثناء كتابتها. يُنقل إلى ملف EPANET ومنه.';
$ec_lang['lpn_pump_effic_curve']='منحنى كفاءة المضخة';
$ec_lang['lpn_pump_effic_curve_tip']='المنحنى في مربع المكتبات الذي يحدد كفاءة هذه المضخة عند كل تدفق. يمكن لعدة مضخات أن تستخدم المنحنى نفسه، وتعديله هناك يغيّرها كلها. لا تحمل هذه المضخة سوى الإشارة إليه؛ أما النقاط نفسها فتُقرأ وتُعدَّل تحت المكتبات، المنحنيات.';
// **THE STRINGS EVERY CURVE CONTROL SHARES** (Task 586). One chooser serves a pump's head curve, a
// pump's efficiency curve and a valve's head-loss curve, so its fixed entries are keyed once.
$ec_lang['lpn_curve_none']='لم يُحدَّد منحنى';
// **THE CHOOSER OFFERS NO WAY TO MAKE A CURVE** (Tom, 2026-09-05: *"Pump properties has no 'New
// curve...' button. And it shouldn't unless that's a link to the Curves library."*). It offered
// one, and it made curve DATA from inside a pump's properties. This is the link that replaced it,
// and it opens the box rather than describing where it is.
$ec_lang['lpn_curve_library_link']='المنحنيات';
$ec_lang['lpn_curve_library_link_tip']='يفتح مربع المكتبات عند قسم المنحنيات، حيث يُضاف المنحنى ويُوصف ويُعدَّل ويُحذف. يذكر كل عنصر أي منحنى يستخدمه.';
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
$ec_lang['lpn_curve_kind_head']='علو المضخة';
$ec_lang['lpn_curve_kind_effic']='كفاءة المضخة';
$ec_lang['lpn_curve_kind_volume']='حجم الصهريج';
$ec_lang['lpn_curve_kind_headloss']='فقدان ضغط الصمام';
// **NOT A FIFTH KIND.** A curve whose file states no type comment and which nothing references, so
// there is nothing to state. It is never offered as a choice; it is only shown, already selected,
// on a curve in that state, so it can be seen and changed.
$ec_lang['lpn_curve_kind_generic']='النوع غير مذكور';
// A volume curve's second column. It has no unit family on this page and is carried as the file's
// own number, so the heading names the quantity and no unit.
$ec_lang['lpn_curve_volume_col']='الحجم';
$ec_lang['lpn_pump_effic_col']='الكفاءة';
// The pump's own efficiency curve, editable since Task 585. Growable where the head curve's table
// is three fixed rows, because this page FITS a head curve from at most three points while EPANET
// reads an efficiency curve directly: truncating an imported five-point curve would be rewriting
// numbers that are the user's.
$ec_lang['lpn_pump_effic_global']='لم يُحدَّد لهذه المضخة منحنى كفاءة، فهي تعمل بالكفاءة المحددة للشبكة كلها، {percent}.';
$ec_lang['lpn_pump_effic_unstated']='تشير هذه المضخة إلى منحنى كفاءة باسم {name}، لا يعرّفه شيء في هذا المشروع، فهي تعمل بالكفاءة المحددة للشبكة كلها، {percent}.';
// Persistent mode-hint line (Task 146.01 follow-up, 2026-07-30): whole sentences, not composed
// from a "Mode:" prefix + the tool's own label, per CLAUDE.md's concept-level label reuse rule --
// word order/grammar around a mode name varies by language, so each mode gets its own full string.
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_select']='الوضع: تحديد. انقر عنصراً أو تسمية لعرضه أو تغييره. اسحب لتحريك عقدة أو نقطة انعطاف أو تسمية. استخدم أداة نقاط الانعطاف لإضافة انحناءات الأنبوب أو إزالتها.';
$ec_lang['lpn_mode_delete']='الوضع: حذف. انقر عنصراً لإزالته.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mode_vertices']='الوضع: نقاط الانعطاف. تظهر نقاط انعطاف كل أنبوب كمقابض مربعة صغيرة. انقر على أنبوب لإضافة نقطة انعطاف، أو انقر على مقبض لإزالتها، أو اسحب مقبضاً لتحريكه. لا يتغيّر أي شيء آخر على الخريطة في هذا الوضع.';
$ec_lang['lpn_mode_zoom_window']='الوضع: تكبير منطقة. انقر زاويتين متقابلتين لمربع، أو اسحب واحداً، على الخريطة للتكبير عليه.';
// One-shot notice when the Delete key is pressed with nothing picked (Task 415). It has to name the
// gesture, because the whole point of the change is that the order is now subject, then verb.
$ec_lang['lpn_select_first']='لا شيء محدد. انقر عنصراً على الخريطة أولاً، ثم اضغط حذف.';
$ec_lang['lpn_mode_add_junction']='الوضع: إضافة ملتقى. انقر على الخريطة لوضع ملتقى. انتقل إلى وضع التحديد لتغيير العناصر والتسميات أو تحريكها.';
$ec_lang['lpn_mode_add_reservoir']='الوضع: إضافة خزان. انقر على الخريطة لوضع خزان. انتقل إلى وضع التحديد لتغيير العناصر والتسميات أو تحريكها.';
$ec_lang['lpn_mode_add_tank']='الوضع: إضافة صهريج. انقر على الخريطة لوضع صهريج. انتقل إلى وضع التحديد لتغيير العناصر والتسميات أو تحريكها.';
$ec_lang['lpn_mode_add_pipe']='الوضع: إضافة أنبوب. انقر عقدة، ثم عقدة أخرى، لتوصيلهما. انقر مساحة فارغة بينهما لثني الخط، أو اضغط Escape للبدء من جديد. انتقل إلى وضع التحديد لتغيير العناصر والتسميات أو تحريكها.';
$ec_lang['lpn_mode_add_pump']='الوضع: إضافة مضخة. انقر عقدة، ثم عقدة أخرى، لتوصيلهما. انقر مساحة فارغة بينهما لثني الخط، أو اضغط Escape للبدء من جديد. انتقل إلى وضع التحديد لتغيير العناصر والتسميات أو تحريكها.';
$ec_lang['lpn_mode_add_valve']='الوضع: إضافة صمام. انقر عقدة، ثم عقدة أخرى، لتوصيلهما. انقر مساحة فارغة بينهما لثني الخط، أو اضغط Escape للبدء من جديد. انتقل إلى وضع التحديد لتغيير العناصر والتسميات أو تحريكها.';
// Text was wrong (Tom, 2026-07-30): "click a node first to anchor it there" implied a two-click
// sequence (click node, THEN click to place), but placing near a node anchors it in that ONE click.
$ec_lang['lpn_mode_add_text']='الوضع: إضافة نص. انقر على الخريطة لوضع نص. انقر بالقرب من عقدة لإلحاق النص بتلك العقدة. انتقل إلى وضع التحديد لتغيير العناصر والتسميات أو تحريكها.';
// Toolbar button tips (Tom, 2026-07-30): hover/tap explanations on the two buttons a new user is
// most likely to miss the point of -- that Select is what you use to edit/move things, and that a
// label itself can be dragged. Both economize on translation for later, per CLAUDE.md's tip-only
// whole-label-wrap convention -- the button itself is already the click target (no separate "?"
// glyph needed), so the tip goes straight on the button as a title, matched to the .ec-help class.
$ec_lang['lpn_tip_select']='استخدم هذا الوضع لتغيير الأشياء على الخريطة وتحريكها وسحبها. هذا هو الوضع الذي تعود إليه الصفحة تلقائياً: فهي تعود إليه من تلقاء نفسها بعد بعض الإجراءات، مثل فتح مشروع، ويعيدك [Esc] إليه من أي وضع آخر.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_tip_labels_draggable']='يمكنك سحب تسمية لتحريكها. انقر نقراً مزدوجاً على تسمية لإعادتها إلى موضعها التلقائي.';
$ec_lang['lpn_field_auto']='تلقائي';
$ec_lang['lpn_method_switch_confirm']='لا يغيّر تغيير طريقة الاحتكاك أرقام الخشونة المكتوبة أصلاً على أنابيبك، وخشونة طريقة ما لا معنى لها في طريقة أخرى. تحقّق من كل أنبوب بعد هذا. أتريد تغييرها رغم ذلك؟';
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
$ec_lang['lpn_field_closed']='مغلق';
$ec_lang['lpn_field_closed_tip']='أغلق هذا الأنبوب بحيث لا يمر منه أي ماء. يبقى الأنبوب على الخريطة ويحتفظ بجميع أرقامه، ويمكنك فتحه مرة أخرى في أي وقت.';
$ec_lang['lpn_field_x']='X';
$ec_lang['lpn_field_y']='Y';
// A geographic project's coordinates (Task 145). The SAME two rows as X and Y, in the vocabulary
// that project uses -- longitude is the x one and latitude the y one, which is the opposite order
// from the "lat, long" a person says out loud.
$ec_lang['lpn_field_lon']='خط الطول';
$ec_lang['lpn_field_lat']='خط العرض';
// The two axes of a projected coordinate system, named as a surveyor names them. Read in PUBLIC
// order, northing first, which is the same order the latitude above is read in.
$ec_lang['lpn_field_northing']='الإحداثي الشمالي';
$ec_lang['lpn_field_easting']='الإحداثي الشرقي';
// layout: status strip. The one-line readout at the bottom of the map, where the full words
// spend most of the line. A surveyor reads these off a single letter; use your language's own.
$ec_lang['lpn_field_northing_abbr']='N';
$ec_lang['lpn_field_easting_abbr']='E';
// layout: table heading, the Vertices column's order hint "(Lat/Lon|Lat/Lon|...)" (Tom, 2026-09-28).
// The short forms of Latitude and Longitude above, in a narrow column heading; use your language's
// own customary abbreviation.


// Task 674: the coordinate rows on a node are typeable, so the six axis names above now label an
// INPUT as well as a readout. One tip for both boxes, because one sentence is true of both, and it
// states the thing a reader cannot see: a position is shared by every scenario, exactly as it is
// when the node is dragged.
$ec_lang['lpn_field_coord_tip']='اكتب موقع إحداثي لوضع هذه العقدة بدقة. في سيناريو، ينطبق هذا الموقع في ذلك السيناريو وحده، تماماً كسحبها؛ وفي الأساس، يضع العقدة في كل مكان.';
// Refused, and it says what the range is. Only a geographic project has one: Web Mercator has no
// finite y at the poles, so a latitude past the cut-off would put the node nowhere at all.
$ec_lang['lpn_coord_off_world']='هذا خارج الخريطة. يتراوح خط العرض في إسقاط مركاتور الزائف من -85.05 إلى 85.05 ويتراوح خط الطول من -180 إلى 180.';
$ec_lang['lpn_field_text_size']='مضاعف الحجم';
// **SHOW AT ALL ZOOM LEVELS** (Task 705). A Text object is authored content, so it ships exempt
// from the labeling threshold and this switch is how a note is made to fade out with the generated
// labels instead. Unticking it is the only way a Text object has ever hidden because of the zoom.
$ec_lang['lpn_field_text_all_zoom']='إظهار عند كل مستويات التكبير';
$ec_lang['lpn_field_text_all_zoom_tip']='أبقِ هذا النص على الرسم مهما صغّرت. ألغِ التحديد ليختفي النص مع التسميات الأخرى بمجرد أن يصبح المنظور أوسع من عتبة التسمية المضبوطة تحت الخريطة والصفحة.';
$ec_lang['lpn_tool_labels']='التسميات';
$ec_lang['lpn_labels_heading_node']='تسميات العقد';
$ec_lang['lpn_labels_heading_link']='تسميات الوصلات';
$ec_lang['lpn_labels_decimals_tip']='عدد الخانات العشرية المعروضة لهذه التسمية';
$ec_lang['lpn_labels_mark_extrema']='تمييز أعلى القيم وأدناها';
// THE TIP NAMES OVERLINE AND UNDERLINE ON PURPOSE (ROADMAP Task 457). Tom asked 2026-08-19 that this
// row be findable by those two words; a Wave 0 pass then rewrote the tip to "a line above / a line
// below", which reads better and made both words unfindable. The Settings box searches tips, so a
// word not on the page is a word the search cannot reach -- and $ec_lang_syn, the other place the
// terms could have gone, is invisible to it. Plain English leads and the term is the gloss, which is
// the same shape as "Minor (local) loss".
$ec_lang['lpn_labels_mark_extrema_tip']='يرسم خطاً فوق أعلى قيمة لكل خاصية مُسمّاة على الخريطة (خط علوي)، وخطاً تحت أدنى قيمة لتلك الخاصية (خط سفلي)، بحيث تستطيع تمييز الأعلى والأدنى دون قراءة الأرقام.';
// "Apply to all" beside each ID prefix (ROADMAP Task 345): an ID prefix normally governs only the assets
// you draw from now on, and this is the way to say "I meant the ones already here". {n} and
// {skipped} are whole numbers; {prefix} is the text the user typed.
$ec_lang['lpn_settings_apply_to_all']='تطبيق على الكل';
$ec_lang['lpn_settings_apply_to_all_tip']='يحصل كل عنصر من هذا النوع مرسوم بالفعل على معرّف يبدأ بهذا النص. يحتفظ كل عنصر برقمه. يُترك المعرّف الذي لا ينتهي برقم كما هو.';
$ec_lang['lpn_confirm_apply_prefix']='هل تريد إعادة تسمية {n} عنصراً لتبدأ معرّفاتها بـ {prefix}؟ يحتفظ كل عنصر برقمه.';
$ec_lang['lpn_prefix_applied']='أُعيدت تسمية {n} عنصراً. تُرك {skipped} غيرها كما هي.';
$ec_lang['lpn_labels_prefix_tip']='نص يُضاف قبل هذه الخاصية في تسميات الخريطة';
$ec_lang['lpn_labels_suffix_tip']='نص يُضاف بعد هذه الخاصية في تسميات الخريطة';
$ec_lang['lpn_labels_suffix_gradient_tip']='نص يُضاف بعد تدرّج فقدان الضغط في تسميات الخريطة. لا تكتب علامة النسبة المئوية هنا؛ تُضاف لك عندما تكون الوحدات نسبة مئوية.';
$ec_lang['lpn_labels_separator']='نص بين القيم';
$ec_lang['lpn_labels_separator_tip']='نص بين خاصية والتي تليها في التسمية. مسافة بشكل افتراضي.';
// The Drop column in the Labels box (ROADMAP Task 397; inverted by Task 445). Both tips say "1 is
// dropped first", because that one sentence is what the two columns share; what differs is WHAT the
// number orders, and each tip says which. Kept plain and short: these sit on a small box in a
// crowded row. 'lpn_labels_priority' is the term of art and is used only inside the two tips now --
// the column itself is headed by the word below.
$ec_lang['lpn_labels_priority']='الأولوية';
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_link_tip']='الترتيب الذي تُحذف به القيم عندما لا تتسع التسمية. تبقى القيمة ذات الأولوية 1 لأطول مدة.';
// NAMES ALL THREE RULES, because they are not settable and so the tip is the only place a user can
// learn them (Tom, 2026-08-16). His own draft of this sentence said "lowest flow"; a flow is a link
// value and this box is on a node row, so it reads as demand here.
// Edited by TGH 2026-09-07
$ec_lang['lpn_labels_priority_node_tip']='الترتيب الذي تُترك فيه الخصائص عندما تتداخل تسميتا عقدتين. تُترك الخاصية المرقّمة 1 أولاً، في كلا التسميتين. عندما تبقى خاصية واحدة ولا يزال هناك تداخل، تُخفى تسمية كاملة: أياً كانت التسمية التي تكون قيمتها المتبقية الأقل جدارة بالعرض، أي أدنى طلب، أو الضغط الأقرب إلى منتصف المدى، أو المنسوب أو العلو الأقرب إلى العقد المجاورة.';
// Column headings for the Labels box rows. Short because they sit over boxes 3.5 to 4.5 em wide, and
// the row's own field name is the wide column beside them.
$ec_lang['lpn_labels_col_before']='قبل';
$ec_lang['lpn_labels_col_after']='بعد';
$ec_lang['lpn_labels_col_decimals']='الخانات العشرية';
// ---- R-326..R-334 (2026-09-26): Show order, Use units, the customer Drop column, the new rows ----
// "Show" heads the Show order column beside Drop (Tom, R-329: "I don't like that ID needs to
// display first, but also may need to drop first."). As short as "Drop" and for the same reason:
// it heads a box about three characters wide, and its tip carries the whole meaning.
$ec_lang['lpn_labels_col_show']='إظهار';
$ec_lang['lpn_labels_show_tip']='الترتيب الذي تظهر فيه القيم على تسمية. تأتي القيمة المرقّمة 1 أولاً: في أعلى تسمية مكدَّسة، وفي بداية تسمية على سطر واحد.';
$ec_lang['lpn_labels_priority_customer_tip']='الترتيب الذي تُحذَف فيه القيم من تسمية مشترك. تُحذَف القيمة المرقّمة 1 أولاً.';
// Tom's own words for the control (R-331: "a code or a toggle to 'Use units' for the After string").
// It heads a narrow column and names each row's tick box.
$ec_lang['lpn_labels_use_units']='استخدام الوحدات';
$ec_lang['lpn_labels_use_units_tip']='حدّد لإظهار الوحدة في مربع بعد وعلى التسمية، ولإبقائها متوافقة عند تغيّر الوحدات. ألغِ التحديد لكتابة نص بعد خاص بك.';
// EPANET's own name for a link's starting state, beside the Status row, which is the run's answer.
$ec_lang['lpn_labels_init_status']='الحالة الابتدائية';
// The Symbology index, reworked (Tom, R-333: "Node labels, Node colors, Link labels, Link colors,
// Customer"). The two label entries reuse lpn_labels_heading_node/_link.
$ec_lang['lpn_settings_sym_node_colors']='ألوان العُقَد';
$ec_lang['lpn_settings_sym_link_colors']='ألوان الروابط';
$ec_lang['lpn_field_id']='المعرّف';
$ec_lang['lpn_backdrop_menu']='صورة خلفية…';
$ec_lang['lpn_backdrop_add']='إضافة';
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
$ec_lang['lpn_backdrop_scale']='معايرة بالنقر';
$ec_lang['lpn_backdrop_scale_entry']='معايرة بملف الإسناد الجغرافي أو بحجم البكسل الواحد على الخريطة';
// Scale FROM CURRENT, about a picked point (Tom, 2026-08-16). The relative sibling of the two
// absolute scale commands above: it changes the size by a factor and holds one point still, which
// is what the last stage of fitting an aerial photograph actually needs.
$ec_lang['lpn_backdrop_scale_from']='تحجيم من الحجم الحالي، حول نقطة تختارها';
$ec_lang['lpn_backdrop_scale_from_prompt1']='انقر النقطة على الصورة الخلفية التي يجب أن تبقى في مكانها.';
$ec_lang['lpn_backdrop_scale_from_prompt2']='التحجيم من حجمها الحالي. 1 يبقيها كما هي، 1.1 يكبّرها 10٪، 0.9 يصغّرها 10٪.';
$ec_lang['lpn_backdrop_scale_entry_prompt']='أدخل حجم البكسل الواحد على الخريطة، أو الصق المحتوى الكامل لملف الإسناد الجغرافي الخاص بالصورة';
$ec_lang['lpn_backdrop_scale_entry_bad']='اكتب رقماً واحداً لحجم البكسل الواحد على الخريطة، أو الصق كل الأسطر الستة لملف الإسناد الجغرافي.';
$ec_lang['lpn_backdrop_wld_bad']='يقوم ملف الإسناد الجغرافي هذا بتدوير الصورة أو عكسها أو تمديدها بشكل غير متساوٍ. يمكن للخريطة فقط تحريك الصورة وتغيير حجمها بنفس المقدار في كلا الاتجاهين، لذلك لم يُستخدم الملف.';
$ec_lang['lpn_backdrop_unreadable']='لا يستطيع متصفحك عرض هذه الصورة. احفظها بصيغة PNG أو JPEG ثم أضفها من جديد.';
$ec_lang['lpn_backdrop_position']='نقل';
$ec_lang['lpn_backdrop_remove']='إزالة';
$ec_lang['lpn_backdrop_remove_confirm']='هل تريد إزالة الصورة الخلفية؟';
// **THE WORLD MAP BEHIND A GRID DRAWING** (Task 646). Tom's own sentence is the tip, because the
// point of these rows is that the project's own numbers are untouched, which is the whole of what
// separates this from the placement wizard that converts a project.
// **ONE ROW WITH A SUBMENU, BUILT TO MATCH Background image** (Tom, 2026-09-18: *"Change Map,
// Custom georeference to Map, World map... (to be parallel with Background image). And can it have
// a submenu with Attach (at top), Move, Scale by picking, Scale from the current size..., Detach,
// similar to the Background map submenu."*). The two rows this replaces named the WIZARD and named
// the UNDOING of it, which is a pair of commands rather than a thing; a picture behind the drawing
// and a map behind the drawing are the same kind of thing to a reader, so they read the same way.
$ec_lang['lpn_map_attach_menu']='خريطة العالم…';
$ec_lang['lpn_map_attach_tip']='أرفق خريطة العالم بهذا المشروع دون تغييره بأي طريقة أخرى.';
$ec_lang['lpn_map_attach_add']='إرفاق';
$ec_lang['lpn_map_attach_readjust']='إعادة الضبط';
$ec_lang['lpn_map_attach_readjust_tip']='العودة إلى الخطوة 2 من عملية إرفاق الخريطة.';
$ec_lang['lpn_map_attach_scale_from']='تغيير الحجم من الحجم الحالي…';
$ec_lang['lpn_map_attach_scale_from_prompt']='غيّر حجم الخريطة من حجمها الحالي، حول منتصف رسمك. 1 يبقيها كما هي، و1.1 تجعلها أكبر بنسبة 10%، و0.9 تجعلها أصغر بنسبة 10%.';
$ec_lang['lpn_map_attach_scale_from_bad']='اكتب رقماً واحداً أكبر من الصفر.';
$ec_lang['lpn_map_attach_scale_from_done']='أُعيد تحديد حجم الخريطة، ورسمك وكل إحداثي فيه بقي تماماً كما كان.';
$ec_lang['lpn_map_attach_none']='لا توجد خريطة عالم مرفقة بهذا المشروع بعد. استخدم الخريطة، خريطة العالم، إرفاق أولاً.';
$ec_lang['lpn_map_attach_remove']='فصل';
$ec_lang['lpn_map_attach_remove_tip']='أزل خريطة العالم. يبقى الرسم وإحداثياته دون تغيير في الحالتين.';
$ec_lang['lpn_map_attach_done']='أصبحت خريطة العالم الآن خلف رسمك، ومشروعك لم يتغيّر. استخدم الخريطة، خريطة العالم، فصل لإزالتها مرة أخرى.';
$ec_lang['lpn_map_attach_removed']='زالت خريطة العالم، والرسم تماماً كما كان.';
// **THE CUSTOM GEOREFERENCE WIZARD, IN TOM'S OWN THREE STEPS** (2026-09-18, and
// dev/tom-coordinate-vocabulary-2026-09-16.md). Georeferencing here means attaching the world map,
// never converting a coordinate, so every sentence below says what stays still as well as what
// moves: the drawing does not move, the ground does.
$ec_lang['lpn_mapgeo_intro']='رسمك على خريطة العالم كله، في المحيط عند خط عرض صفر وخط طول صفر. جِد موقعك أولاً: حرّك وقرّب الخريطة خلف الرسم، أو ابحث باسم مكان، أو اكتب خط عرض وخط طول. الرسم نفسه لا يتحرك.';
$ec_lang['lpn_mapgeo_step1']='الخطوة 1 من 2: جِد موقعك في العالم';
$ec_lang['lpn_mapgeo_step2']='الخطوة 2 من 2: لائم الخريطة خلف رسمك';
$ec_lang['lpn_mapgeo_hint1']='حرّك وقرّب الخريطة خلف رسمك، أو ابحث عن مكان، أو اكتب خط عرض وخط طول. ثم اضغط ضع تقريباً.';
$ec_lang['lpn_mapgeo_readjust_intro']='رسمك حيث وضعته آخر مرة. لنقله إلى مكان آخر، حرّك وقرّب الخريطة خلف الرسم، أو ابحث باسم مكان، أو اكتب خط عرض وخط طول. الرسم نفسه لا يتحرك.';
$ec_lang['lpn_mapgeo_hint2']='اسحب في أي مكان لتحريك الخريطة تحت رسمك. يبقى رسمك وكل إحداثي فيه في مكانه تماماً. اضغط إسناد جغرافي هنا عندما تكون الخريطة صحيحة.';
$ec_lang['lpn_mapgeo_gestures']='التكبير يحرّك رسمك والخريطة معاً، حتى ترى مدى تطابقهما. السحب يحرّك الخريطة فقط.';
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
$ec_lang['lpn_mapgeo_dial_turn']='تدوير الخريطة';
$ec_lang['lpn_mapgeo_dial_turn_read']='{d} درجة';
$ec_lang['lpn_mapgeo_dial_size']='حجم الخريطة';
$ec_lang['lpn_mapgeo_dial_size_read']='{f} ضعف';
$ec_lang['lpn_mapgeo_dial_help']='حرّك الشريطين، أو اكتب في المربعين أعلاهما، لجعل الخريطة أكبر أو أصغر ولتدويرها. منتصف كل شريط هو خطوة الملاءمة 1 المتروكة، فـ1 و0 تعنيان تركها كما هي. تعمل مفاتيح الأسهم على كليهما.';
$ec_lang['lpn_mapgeo_place']='ضع تقريباً';
$ec_lang['lpn_mapgeo_finish']='إسناد جغرافي هنا';
$ec_lang['lpn_mapgeo_cancelled']='عادت خريطة العالم إلى مكانها، ولم يتحرك رسمك أبداً.';
$ec_lang['lpn_mapgeo_locked']='أنهِ بزر إسناد جغرافي هنا، أو اضغط إلغاء، قبل تبديل المشاريع أو الحفظ. لا تزال خريطة العالم قيد الوضع.';
$ec_lang['lpn_backdrop_scale_prompt1']='انقر نقطتين على الصورة الخلفية، مثل طرفي مقياس رسم. ثم اكتب المسافة الحقيقية بينهما.';
$ec_lang['lpn_backdrop_scale_prompt2']='المسافة الحقيقية بين النقطتين';
// Tom's own wording, 2026-08-16. "Base point" is the drafting term and it is what the second step
// then has a destination FOR; "any point on the background image" did not say that the two steps are
// one move. The second names the panel it is about to show, so the alert and the panel read as one
// step rather than two.
$ec_lang['lpn_backdrop_position_prompt1']='انقر نقطة الأساس (على الصورة) لعملية النقل.';
$ec_lang['lpn_backdrop_position_prompt2']='اختر طريقة تحديد نقطة الوجهة، ثم انقر متابعة.';
// The standing "you are in the middle of something" bar, shown while a background-image scale or
// move is waiting for a click. It carries the only visible way out of that state.
$ec_lang['lpn_backdrop_busy']='جارٍ تعديل الصورة الخلفية.';
$ec_lang['lpn_backdrop_target_label']='حرّك تلك النقطة إلى:';
$ec_lang['lpn_backdrop_target_node']='عقدة';
$ec_lang['lpn_backdrop_target_free']='أي نقطة على الخريطة';
$ec_lang['lpn_backdrop_target_coords']='إحداثيات تكتبها';
$ec_lang['lpn_backdrop_coords_prompt']='اكتب الإحداثيات X,Y التي يجب أن تنتقل إليها تلك النقطة';
$ec_lang['lpn_backdrop_continue']='متابعة';
$ec_lang['lpn_tool_settings']='الإعدادات';
$ec_lang['lpn_settings_show_titles']='إظهار عناوين الصفحة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_show_titles_tip']='يخفي عنوان الصفحة وسطر الترحيب فوق الرسم، لتحصل الخريطة على مساحة أكبر. لا تتغيّر عملية الطباعة.';
// The link that rides on the headings themselves (Tom's 2026-09-08 worklist). It throws the switch AND opens the
// box at the row that holds it, so the way back is learned in the same gesture.
$ec_lang['lpn_hide_titles']='إخفاء هذه العناوين';
// The Settings row that turns the selection bubble back on. Its sibling checkbox lives in the
// bubble and reads 'Show this'; this one has to name what it is talking about.
$ec_lang['lpn_settings_area_hint']='إظهار مساعدة التحديد';
$ec_lang['lpn_settings_area_hint_tip']='يُظهر الفقاعة فوق الخريطة التي تبيّن ما ستفعله نقرتك التالية أثناء تحديد منطقة.';
$ec_lang['lpn_settings_id_prefixes']='بادئات المعرّفات';
// NEVER "Starting values" (Tom, 2026-08-19: "The problem is that it's misleading"). These are what
// a NEW asset is created with; "starting" reads as the initial condition of a run, which on a
// page that now has a duration and a clock is a different thing entirely -- and a tank really does
// have one. The heading is the bare word because it sits inside the "New assets" section; the
// three push strings below it stopped saying "starting values" in sprint 438's Wave 0, which found
// them still carrying the rejected wording.
$ec_lang['lpn_settings_defaults']='قيم الإنشاء';
$ec_lang['lpn_settings_defaults_note']='تُستخدم للعناصر التي تنشئها من الآن فصاعداً. لا تتغيّر العناصر الموجودة.';
$ec_lang['lpn_settings_push_note']='تُطبَّق فقط الخصائص التي تظهر تسمياتها الآن.';
$ec_lang['lpn_settings_push_btn']='تطبيق قيم العناصر الجديدة هذه على جميع العناصر الموجودة';
$ec_lang['lpn_push_confirm']='هل تريد استبدال هذه الخصائص في كل عنصر موجود بالقيم المضبوطة الآن للعناصر الجديدة؟ ستُستبدل القيم التي كتبتها. يمكنك التراجع عن هذا.';
$ec_lang['lpn_push_properties']='الخصائص:';
$ec_lang['lpn_push_assets']='العقد والأنابيب:';
$ec_lang['lpn_push_none_displayed']='لا تظهر أي قيمة ابتدائية كتسمية الآن، فلا يوجد ما يُطبَّق. فعّل تسميات الخصائص التي تريدها في لوحة التسميات، ثم حاول مرة أخرى.';
$ec_lang['lpn_push_nothing']='لا يملك أي عنصر موجود أياً من الخصائص التي يجري تطبيقها.';
$ec_lang['lpn_push_no_change']='يملك كل عنصر هذه القيم بالفعل، فلن يتغيّر شيء.';
// ---- Custom properties (ROADMAP Task 636) ----
// A field the user invents, designed one row at a time in Settings > Assets, and then carried by
// every asset kind the row applies to. The key a document stores is ALWAYS namespaced, so a custom
// property can never collide with a built-in field; the visible key is what the reader types and
// the prefix is added for them.
$ec_lang['lpn_settings_custom_props']='خصائص مخصصة';
// **THE HEADING'S OWN TIP, AND IT IS TOM'S SENTENCE** (2026-09-13, revision 1 of eleven): it says
// what a custom property is FOR and that it behaves like every other property, which is the whole
// of what a reader needs before opening the design table.
$ec_lang['lpn_settings_custom_props_note']='خصائص تحدّدها بنفسك لأغراضك الخاصة. تُخزَّن مع المشروع والسيناريوهات كسائر الخصائص الأخرى.';
$ec_lang['lpn_cp_design']='تصميم';
$ec_lang['lpn_cp_design_tip']='صف واحد لكل خاصية مخصصة، ويُفتح كل صف ليعرض: المفتاح، التسمية، ينطبق على، التحقق كـ، سماح أو تقييد، حقل الأحرف الذي يسميه ذلك الاختيار، الحد الأدنى للطول، الحد الأقصى للطول، الحد الأدنى، الحد الأقصى.';
$ec_lang['lpn_cp_add']='إضافة خاصية مخصصة';
$ec_lang['lpn_cp_add_tip']='يضيف صفاً إلى جدول التصميم ويفتحه للتحرير.';
$ec_lang['lpn_cp_remove']='إزالة';
$ec_lang['lpn_cp_remove_tip']='يزيل هذه الخاصية من جدول التصميم. تبقى القيم المكتوبة بالفعل في عناصرك محفوظة في الملف وتعود إذا صممت المفتاح نفسه مرة أخرى.';
$ec_lang['lpn_cp_none']='لم تُصمَّم أي خاصية مخصصة بعد.';
$ec_lang['lpn_cp_unnamed']='غير مسمّاة بعد';
// **EVERY COLUMN TIP LEADS WITH THE NAME OF ITS COLUMN** (Tom, 2026-09-13, revision 4). The heading
// above it is truncated to keep twenty rows readable at once, so the tip is the only place the
// full name of the column is ever written out.
$ec_lang['lpn_cp_key']='المفتاح';
$ec_lang['lpn_cp_key_tip']='المفتاح: تُخزَّن الخاصية تحت هذا الاسم. لا يُسمح بالمسافات، وتُضاف بادئة تلقائياً حتى لا يتعارض مفتاحك أبداً مع حقل مدمج.';
$ec_lang['lpn_cp_label']='التسمية';
$ec_lang['lpn_cp_label_tip']='التسمية: يرى القارئ هذا في صندوق الخصائص، وفي البحث، وفي رأس عمود الجدول.';
$ec_lang['lpn_cp_applies']='ينطبق على';
$ec_lang['lpn_cp_applies_tip']='ينطبق على: قائمة بادئات معرّفات مفصولة بفواصل للعناصر التي تستخدم هذه الخاصية، مثل J,L,R.';
$ec_lang['lpn_cp_validate']='التحقق كـ';
$ec_lang['lpn_cp_validate_tip']='التحقق كـ: يحدد هذا شكل القيمة الصحيحة. تقرأ قواعد حالة الأحرف الأبجدية الإنجليزية فقط، وهذا قيد معلن. اختر عدم التحقق لقبول أي شيء.';
$ec_lang['lpn_cp_restrict']='تقييد هذه الأحرف';
$ec_lang['lpn_cp_restrict_tip']='تقييد هذه الأحرف: يجوز أن تستخدم القيمة الأحرف المدرَجة هنا فقط، أو ألا تستخدم أياً منها، حيث يعني "@" أي حرف؛ ويعني "#" أي رقم، ويجب إدراج "-" و"." و"," كلاً على حدة إذا كانت مسموحة؛ ويجب أن تقع أي أحرف مسافة بيضاء بين أحرف أخرى.';
$ec_lang['lpn_cp_restrict_mode']='سماح أو تقييد';
$ec_lang['lpn_cp_restrict_mode_tip']='سماح أو تقييد: الأحرف المعطاة إما أن تكون الوحيدة التي يجوز أن تستخدمها القيمة أو تلك التي لا يجوز أن تستخدمها.';
$ec_lang['lpn_cp_restrict_allow']='السماح بهذه الأحرف فقط';
$ec_lang['lpn_cp_restrict_deny']='تقييد هذه الأحرف';
$ec_lang['lpn_cp_minlength']='الحد الأدنى للطول';
$ec_lang['lpn_cp_minlength_tip']='الحد الأدنى للطول: يُعلَّم أي إدخال أقصر من ذلك، وهذه طريقتك لإيجاد الإدخالات الفارغة والمكتوبة جزئياً.';
$ec_lang['lpn_cp_length']='الحد الأقصى للطول';
$ec_lang['lpn_cp_length_tip']='الحد الأقصى للطول: يُعلَّم أي إدخال أطول من ذلك.';
$ec_lang['lpn_cp_low']='الحد الأدنى';
$ec_lang['lpn_cp_low_tip']='الحد الأدنى: هذه أصغر قيمة تتوقعها. تُقارَن الأرقام كأرقام والنص بالترتيب الأبجدي.';
$ec_lang['lpn_cp_high']='الحد الأقصى';
$ec_lang['lpn_cp_high_tip']='الحد الأقصى: هذه أكبر قيمة تتوقعها. تُقارَن الأرقام كأرقام والنص بالترتيب الأبجدي.';
$ec_lang['lpn_cp_val_none']='عدم التحقق';
// **TWO NUMERIC TYPES, TOLD APART BY THE DECIMAL MARK** (Tom, 2026-09-13, revision 11: *"make
// Number into 'Number .', and add also a 'Number ,'"*). The separator is shown rather than named,
// so the option reads the same in every language this suite ships in.
$ec_lang['lpn_cp_val_number']='رقم .';
$ec_lang['lpn_cp_val_number_comma']='رقم ,';
$ec_lang['lpn_cp_val_integer']='عدد صحيح';
$ec_lang['lpn_cp_val_upper']='أحرف كبيرة بالكامل';
$ec_lang['lpn_cp_val_camel']='camelCase';
$ec_lang['lpn_cp_val_pascal']='PascalCase';
$ec_lang['lpn_cp_val_snake']='snake_case';
$ec_lang['lpn_cp_val_hyphen']='hyphen-case';
// **A VALUE THAT BREAKS ITS OWN DESIGN IS FLAGGED AND KEPT** (Tom, 2026-09-13). Tightening a limit
// is a way of asking a question about the data, so nothing is ever cleared or refused: the value
// stays exactly as it was typed and says what is wrong with it.
$ec_lang['lpn_cp_flag']='{label}: {reason} تُحفَظ القيمة تماماً كما كتبتها.';
$ec_lang['lpn_cp_bad_number']='هذه القيمة ليست رقماً كما تتطلب هذه الخاصية.';
$ec_lang['lpn_cp_bad_integer']='هذه القيمة ليست عدداً صحيحاً كما تتطلب هذه الخاصية.';
$ec_lang['lpn_cp_bad_case']='هذه القيمة ليست بأحرف كبيرة بالكامل كما تتطلب هذه الخاصية.';
$ec_lang['lpn_cp_bad_chars']='تستخدم هذه القيمة حرفاً لا تسمح به هذه الخاصية.';
$ec_lang['lpn_cp_bad_space']='يُسمح بالمسافة البيضاء بين أحرف أخرى فقط.';
$ec_lang['lpn_cp_bad_minlength']='هذه القيمة أقصر مما تسمح به هذه الخاصية.';
$ec_lang['lpn_cp_bad_length']='هذه القيمة أطول مما تسمح به هذه الخاصية.';
$ec_lang['lpn_cp_bad_low']='هذه القيمة أقل من الحد الأدنى لهذه الخاصية.';
$ec_lang['lpn_cp_bad_high']='هذه القيمة أعلى من الحد الأقصى لهذه الخاصية.';
$ec_lang['lpn_cp_key_needed']='أعطِ هذه الخاصية المخصصة مفتاحاً بلا مسافات.';
$ec_lang['lpn_cp_key_taken']='خاصية مخصصة أخرى تستخدم هذا المفتاح بالفعل.';
// ---- Scenarios (ROADMAP Task 184) ----
// A project holds one drawing and a list of scenarios. Base is the drawing itself; every other
// scenario is nothing but a set of values of its own, laid over Base.
// "Own values", not "overrides": the readout sits in an 11px status strip beside the units, and the
// question it answers is how much of this scenario is its own rather than inherited.
$ec_lang['lpn_scenario_label']='سيناريو';
$ec_lang['lpn_scenario_base']='الأساس';
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
$ec_lang['lpn_scenario_overrides']='عدد القيم المخصصة';
// ROADMAP Task 512. The amber ring was designed, correct, and silent: two independent users read it
// as a stuck highlight they could not turn off. These two strings are the ring's own explanation and
// the readout's, so neither requires clicking the element to find out what is going on.
// {name} is the active scenario's display name -- the ring is a fact about WHICH SCENARIO is
// showing, not a state of the element, and naming the scenario is what makes that recoverable.
$ec_lang['lpn_scenario_mark_tip']='تعني الحلقة الكهرمانية أن هذا العنصر يحمل قيمة تخص السيناريو {name} وحده.';
$ec_lang['lpn_scenario_overrides_tip']='كل قيمة من تلك القيم مُعلَّمة على الخريطة بحلقة كهرمانية. انتقل إلى {base} لرؤية الرسم بدونها.';
$ec_lang['lpn_scenario_menu']='السيناريوهات';
$ec_lang['lpn_scenario_tip']='مجموعة القيم التي يعرضها الرسم وتحلّها الصفحة الآن. انقر للتبديل بين السيناريوهات، أو لإضافة سيناريو أو إعادة تسميته أو حذفه.';
$ec_lang['lpn_scenario_new']='سيناريو جديد…';
$ec_lang['lpn_scenario_new_name']='سيناريو {n}';
$ec_lang['lpn_scenario_prompt_name']='اسم هذا السيناريو';
$ec_lang['lpn_scenario_rename']='إعادة تسمية السيناريو…';
$ec_lang['lpn_scenario_delete']='حذف السيناريو';
$ec_lang['lpn_scenario_delete_confirm']='هل تريد حذف السيناريو {name}، والقيم البالغ عددها {n} التي تخصه وحده؟ لن يتغيّر الرسم نفسه.';
$ec_lang['lpn_scenario_override']='في هذا السيناريو فقط';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_override_tip']='التحديد يعني أن هذه القيمة تخص هذا السيناريو وحده، حتى لو كانت نفس رقم الأساس. أزل التحديد لاستخدام قيمة الأساس مرة أخرى.';
// "Base scenario", not bare "Base" -- an ENGLISH fix, so this needs no _syn either. This is the one
// place the polysemy genuinely bites: here the word sits beside a NUMBER, in a field popup with no
// scenario dropdown nearby to frame it, which is exactly the reading that invites "base amount".
// The dropdown keeps the short name (lpn_scenario_base); only the exposed use is disambiguated.
// Same label-versus-sentence distinction that decided the eigenvalue fixes in sprint 316.
$ec_lang['lpn_scenario_base_value']='سيناريو الأساس: {value}';
$ec_lang['lpn_scenario_deactivated']='{id} خارج الشبكة في {scenario}. لا يزال في الرسم، وفي سيناريوهاتك الأخرى.';
$ec_lang['lpn_scenario_push_btn']='تطبيق قيم الأساس على جميع السيناريوهات';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_tip']='تعود جميع السيناريوهات إلى قيمة الأساس للخصائص التي تظهر تسمياتها الآن. تُلغى القيم التي تخص تلك السيناريوهات وحدها.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_scenario_push_confirm']='هل تريد جعل جميع السيناريوهات تستخدم قيم الأساس لهذه الخصائص؟ تُلغى القيم التي تخص تلك السيناريوهات وحدها. يمكنك التراجع عن هذا.';
$ec_lang['lpn_scenario_push_scenarios']='السيناريوهات المتأثرة:';
$ec_lang['lpn_scenario_push_values']='القيم الملغاة:';
$ec_lang['lpn_scenario_push_none']='لا يملك أي سيناريو قيمة خاصة به لأي من هذه الخصائص، فلن يتغيّر شيء. لن تُلغى أي قيمة.';
$ec_lang['lpn_delete_drops_overrides']='يؤدي حذف هذا العنصر أيضاً إلى إلغاء {n} قيمة تحملها سيناريوهاتك له. هل تريد المتابعة؟';
$ec_lang['lpn_push_base_only']='يغيّر هذا الإجراء الرسم نفسه، لذا لا يمكن تنفيذه إلا في {base}. انتقل إلى {base} وحاول مرة أخرى.';
$ec_lang['lpn_field_active']='جزء من هذه الشبكة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_active_tip']='أزل التحديد لترك العنصر على الرسم لكن خارج الشبكة: يُرسم باللون الرمادي ويتجاهله الحلّال. في السيناريو، هذه هي طريقة تشغيل أنبوب مقترح أو إيقافه.';
// ---- Task 412: a Base-wide property SAYS it is Base-wide ----
// Shown only inside a scenario, on the rows that have no "Only in this scenario" box, so the two
// states are read the same way. Before this, a Base-wide row was announced by an ABSENCE, and an
// absence cannot be told from an oversight (Tom, 2026-08-17: "How do they know, other than trial
// and error, that position applies to all?"). Static text, never a permanently-unticked box.
// Carries the sentence Task 338 owes: the drawing belongs to the network, not to the scenario.
// A scenario is a set of water values; two scenarios of one network must look the same, or you
// cannot compare them.
$ec_lang['lpn_settings_emitter_exponent']='أسّ الرشاش';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_emitter_exponent_tip']='الأس في معادلة الرشاش في EPANET للرشاشات والتسربات: التدفق = المعامل × الضغط مرفوعاً لهذا الأس. لا يغيّر الإجابة إلا حيث تحمل عقدة رشاشاً، وهو الآن يعني شبكة مقروءة من ملف EPANET.';
// The Settings panel's Computation section (Tom, 2026-08-10). "Computation", not "Solver": what the
// two rows under it decide is the arithmetic the user gets, and "solver" names the internals.
$ec_lang['lpn_elev_dem_sample']='قراءة نموذج الارتفاع الرقمي';
$ec_lang['lpn_elev_dem_sample_tip']='يقرأ منسوب نموذج الارتفاع الرقمي عند هذه العقدة ويعرضه أدناه. لا يتغيّر شيء في مربع المنسوب. الدقة الأفقية لنموذج الارتفاع الرقمي نحو 30 م لمعظم الأرض، وأدق حيث تتوفر بيانات أفضل.';
$ec_lang['lpn_elev_dem_use']='استخدام نموذج الارتفاع الرقمي';
$ec_lang['lpn_elev_dem_use_tip']='يضع منسوب نموذج الارتفاع الرقمي عند هذه العقدة في مربع المنسوب أعلاه، محلاً محل ما فيه. يقرأ نموذج الارتفاع الرقمي أولاً إن لم يكن قد قُرئ بعد. يعيده تراجع واحد إلى ما كان عليه.';
$ec_lang['lpn_elev_dem_none']='لا يملك نموذج الارتفاع الرقمي منسوباً لهذه العقدة.';
$ec_lang['lpn_elev_dem_said']='يقول Mapbox DEM إن القيمة {v} {u}.';
$ec_lang['lpn_settings_elev_source']='مصدر المنسوب';
$ec_lang['lpn_settings_elev_source_tip']='من أين تحصل العقدة الجديدة على منسوبها. يُقرأ سطح الأرض من Mapbox DEM، الذي يبلغ عرضه نحو 30 م لمعظم الأرض، وأدق حيث تتوفر بيانات أفضل.';
$ec_lang['lpn_settings_elev_source_typed']='المنسوب المكتوب أعلاه';
$ec_lang['lpn_settings_elev_source_dem']='نموذج Mapbox الرقمي (DEM)';
$ec_lang['lpn_settings_accuracy']='الدقة';
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
$ec_lang['lpn_settings_default_is']='الافتراضي هو {n}.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_accuracy_tip']='مدى القرب الذي يجب أن يصل إليه الحلّال قبل أن يتوقف، مقاساً بمقدار التغيّر الذي لا تزال عليه التدفقات من محاولة إلى التالية. الرقم الأصغر أدق ويستغرق وقتاً أطول. يقرأ كلا الحلّالين هذا المربع نفسه، ويقيس كل منهما ذلك التغيّر مقابل مجموع مختلف: الحلّال المدمج مقابل مجموع الطلبات، وEPANET مقابل مجموع تدفقات الروابط. إن تُرك فارغاً، تستخدم هذه الصفحة دقة أشد صرامة من افتراضي EPANET نفسه.';
$ec_lang['lpn_settings_specific_gravity']='الكثافة النوعية';
$ec_lang['lpn_settings_specific_gravity_tip']='وزن السائل مقارنة بالماء. يغيّر الضغوط التي يقرؤها مقياس الضغط، لا التدفقات.';
$ec_lang['lpn_settings_viscosity']='اللزوجة النسبية';
$ec_lang['lpn_settings_viscosity_tip']='لزوجة السائل مقارنة بالماء عند 20 درجة مئوية. لا تغيّر الإجابة إلا في طريقة دارسي-فايسباخ.';
$ec_lang['lpn_settings_trials']='أقصى عدد للمحاولات';
$ec_lang['lpn_settings_trials_tip']='عدد المحاولات المسموح بها قبل أن يتخلى الحلّال عن شبكة لن تتقارب.';
// **THE REST OF EPANET'S HYDRAULIC OPTIONS GET A ROW EACH** (Tom, 2026-08-29: *"every setting from
// EPANET must be added and implemented unless research says otherwise"*). Written in OUR words and
// not EPANET's -- there is no "Unbalanced" or "DampLimit" on the page, because a name only a person
// who already reads .inp files can parse teaches nobody anything.
//
// **EACH TIP SAYS WHICH SOLVER READS THE BOX, AND THAT IS THE LOAD-BEARING SENTENCE.** These five
// act inside EPANET's iteration and the built-in solver has no equivalent term, so a user who does
// not know which engine is answering cannot tell a control that did nothing from a setting that had
// no effect. Saying it in the tip is cheaper than a second Settings section, and honest.
$ec_lang['lpn_settings_unbalanced']='إذا لم تتقارب';
$ec_lang['lpn_settings_unbalanced_tip']='ماذا تفعل بشبكة استنفدت محاولاتها ولم تتقارب بعد. غالباً ما يؤدي السماح بمحاولات إضافية إلى الوصول إلى التقارب. أما التوقف فيُبلّغ عن المحاولة الأخيرة كما هي، وهذا ليس حلاً. يقرأ هذا المربع حلّال EPANET فقط. يتوقف الحلّال المدمج دائماً ويعلّم الإجابة بأنها غير متقاربة.';
$ec_lang['lpn_settings_unbalanced_continue']='السماح بمحاولات إضافية';
$ec_lang['lpn_settings_unbalanced_stop']='التوقف والإبلاغ عن المحاولة الأخيرة';
$ec_lang['lpn_settings_unbalanced_trials']='محاولات إضافية قبل الإبلاغ';
$ec_lang['lpn_settings_unbalanced_trials_tip']='عدد المحاولات الإضافية المسموح بها بعد استنفاد الحد الأقصى أعلاه، قبل الإبلاغ عن المحاولة الأخيرة. يقرأ هذا المربع حلّال EPANET فقط.';
$ec_lang['lpn_settings_head_error']='حدّ خطأ العلو';
$ec_lang['lpn_settings_head_error_tip']='اختبار إضافي يجب أن يجتازه الحلّال قبل أن يتوقف: أكبر خطأ في العلو متبقٍّ في أي أنبوب واحد. الصفر يعني عدم تطبيق هذا الاختبار. يقرأ هذا المربع حلّال EPANET فقط.';
$ec_lang['lpn_settings_flow_change']='حدّ تغيّر التدفق';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_flow_change_tip']='اختبار إضافي يجب أن يجتازه الحلّال قبل أن يتوقف: أكبر تغيّر في تدفق أي أنبوب واحد من محاولة إلى التالية. الصفر يعني عدم تطبيق هذا الاختبار. يقرأ هذا المربع حلّال EPANET فقط.';
$ec_lang['lpn_settings_damp_limit']='يبدأ التخميد عند';
$ec_lang['lpn_settings_damp_limit_tip']='الدقة التي يبدأ عندها الحلّال باتخاذ خطوات أصغر، وهو ما قد يساعد شبكة متذبذبة على التقارب. الصفر يعني أن الحلّال لا يخمّد أبداً. يقرأ هذا المربع حلّال EPANET فقط.';
$ec_lang['lpn_settings_option_unset']='غير مذكور';
$ec_lang['lpn_settings_demand_multiplier']='مضاعِف الطلب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_demand_multiplier_tip']='معامل واحد يُطبَّق على كل طلب في الشبكة دفعة واحدة. استخدمه لمعرفة ما يفعله النظام عند استخدام أكثر أو أقل من استخدام اليوم الحالي. لا يغيّر الأرقام التي كتبتها. يمكن أن يحمل كل سيناريو معامله الخاص، بحيث يكون متوسط اليوم وأقصى يوم وذروة الساعة كل واحد منها رقماً واحداً؛ اتركه فارغاً في سيناريو لاستخدام معامل المشروع.';
$ec_lang['lpn_settings_engine_native']='الحل بحلّال EPANET';
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
$ec_lang['lpn_settings_engine_native_tip']='يشغّل حلّال EPANET من وكالة حماية البيئة الأمريكية، هنا في متصفحك. على شبكة بهذا الحجم لن تلاحظ فرقاً في السرعة. يتفق الحلّالان عن قرب، لكن ليس تماماً: يقرّب EPANET القيمة التي يستخدمها للجاذبية، لذا تخرج فواقده الموضعية أقل بنحو 0.08٪ من الحلّال المدمج، ومع خشونة مانينج يخرج فقدان الضغط لديه أقل بنحو 0.6٪. أول مرة تُفعّل هذا الخيار، يُنزَّل نحو 650 كيلوبايت ثم يُحفظ على هذا الجهاز.';
$ec_lang['lpn_engine_loading']='جارٍ تحميل حلّال EPANET…';
$ec_lang['lpn_engine_failed']='تعذّر تحميل حلّال EPANET. يُعرض الحلّال المدمج بدلاً منه.';
// Said out loud, never silently: the user picked the built-in solver and this network was sent to
// the EPANET solver anyway, because it holds a valve the built-in solver does not calculate. The
// setting is not changed, so removing the valve puts the page straight back on the chosen engine.
$ec_lang['lpn_engine_valve_route']='حُلَّت بحلّال EPANET، لأن هذه الصمامات تفتح وتغلق من تلقاء نفسها:';
$ec_lang['lpn_unit_unknown']='يذكر هذا الرسم وحدة لا تقدّمها هذه الصفحة: {unit}. كل شيء محفوظ ومعروض تماماً كما ورد، ولم يتغيّر شيء. لا يمكن حساب أي شيء حتى تتعرّف هذه الصفحة على تلك الوحدة، لأنها لا تعرف مقدار الوحدة.';
$ec_lang['lpn_engine_manning_note']='ملاحظة: مع خشونة مانينج، يحسب EPANET فقدان الضغط أقل بنحو 0.6٪ من الحلّال المدمج.';
// ---- EPANET said no (ROADMAP Task 471) -------------------------------------------------------
// Three sentences for three different facts, on the model of lpn_unit_unknown: what would not
// happen, what the solver itself objected to, and where the numbers on screen actually came from.
// A user told only the first goes looking for a broken pipe; a user told none of them -- which is
// what shipped until now -- reads our own solver's answer as EPANET's.
$ec_lang['lpn_engine_refused']='لم يقبل حلّال EPANET هذه الشبكة، فلم يُشغَّل.';
// {message} is EPANET's own text and is NOT translated: it names what the solver choked on, which
// is the only part a user can act on, and nothing of ours could reconstruct it.
$ec_lang['lpn_engine_refused_why']='قال حلّال EPANET: {message}';
$ec_lang['lpn_engine_refused_fallback']='جاءت الأرقام المعروضة على الشاشة من الحلّال المدمج بدلاً من ذلك.';
// The run's own version of that last sentence: a period run has a moment and a tank level to name,
// and a one-moment solve does not, which is where the shared label stops.
$ec_lang['lpn_time_run_fell_back']='جاءت الأرقام المعروضة على الشاشة من الحلّال المدمج بدلاً من ذلك. يحسب لحظة واحدة في كل مرة، فهذه هي الشبكة في {time} فقط، وكل صهريج لا يزال عند منسوبه الابتدائي.';
// ---- controls we could not use (ROADMAP Task 466) ---------------------------------------------
// A control naming an element that is no longer drawn has to be left out -- EPANET rejects the
// whole network over one of them -- and {ids} names which, because "a control was ignored" with
// nothing to point at leaves the user reading every sentence they ever wrote.
// Edited by TGH 2026-09-07
$ec_lang['lpn_control_dangling_note']='تُسمّي هذه القواعد عنصراً لم يعد موجوداً في هذا المشروع، فاستُبعدت: {ids}';
$ec_lang['lpn_control_unreadable_note']='تعذّرت قراءة هذه القواعد، فاستُبعدت: {ids}';
$ec_lang['lpn_rule_dangling_note']='تشير هذه القواعد إلى عنصر لم يعد موجوداً في هذا المشروع، فجرى تجاهلها في هذا التشغيل: {ids}';
$ec_lang['lpn_rule_unreadable_note']='تعذّرت قراءة هذه القواعد، فجرى تجاهلها في هذا التشغيل: {ids}';
$ec_lang['lpn_settings_text_size']='حجم النص (بكسلات)';
// Symbols (node circles, pipe width, flow arrows, vertex handles) are sized as a MULTIPLE of the
// text size rather than in their own units (Tom, 2026-07-30), so one number changes how big
// everything on the map is and symbols follow the text into map-vs-screen units automatically.
$ec_lang['lpn_settings_symbol_size']='حجم الرمز (بكسلات)';
$ec_lang['lpn_settings_link_width']='سُمك خط الأنبوب (بكسلات)';
// Task 549: turning the flow arrows off. "Flow direction" is the profession's own phrase and
// EPANET's own display option, so it is named rather than explained; the tip carries the two things
// the label cannot say, which are that the arrows only appear once there are results and that the
// setting travels with the project.
$ec_lang['lpn_settings_show_arrows']='أسهم اتجاه التدفق';
$ec_lang['lpn_settings_show_arrows_tip']='ارسم سهماً على كل أنبوب يبيّن الاتجاه الذي يجري فيه الماء. تظهر الأسهم بعد التشغيل، وإيقافها لا يغيّر النتائج. يُحفظ هذا الإعداد مع المشروع.';
$ec_lang['lpn_settings_align_labels']='محاذاة تسميات الأنابيب مع الأنابيب';
$ec_lang['lpn_settings_readability_bias']='اقلب التسمية رأساً على عقب عندما تميل أكثر من هذا العدد من الدرجات إلى يسار الخط العمودي';
$ec_lang['lpn_settings_readability_bias_tip']='يقلب التسمية ليبقيها معتدلة عندما تميل أكثر من هذا العدد من الدرجات إلى يسار الخط الرأسي.';
$ec_lang['lpn_settings_mask_labels']='خلفية معتمة خلف التسميات';
// Task 408: dragging a label away from its node draws a leader line, and this pulls that line onto
// a round angle when the drag comes close to one. The values are numbers and the degree sign, which
// need no translation; "Off" borrows lpn_settings_legend_off, the same word for the same idea.
// **NOT "snap to grid"** -- nothing here snaps to a grid of positions, and a reader who has used a
// drawing program would expect exactly that from those words.
$ec_lang['lpn_settings_leader_snap']='التقاط خطوط الربط عند زوايا محددة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_leader_snap_tip']='عندما تسحب تسمية بعيداً عمّا تسمّيه، يُسحب الخط الراجع إليها إلى أقرب زاوية من الزوايا المحددة إن سحبت قريباً منها. استمر بالسحب فيُفلت الالتقاط، بحيث تبقى أي زاوية متاحة. الإيقاف يسمح بالسحب بحرية، وهذا ما فعلته هذه الصفحة دائماً.';
// **THE LABELING THRESHOLD** (Tasks 669 and 705). The row's name is Tom's own wording from the
// Task 705 restorations. Its capture button reuses lpn_settings_label_use_view, the customer
// row's key, because it is the same button doing the same thing. The placeholder is the only place
// on screen that says what a blank box means. The length unit is shown beside the box at run time.
$ec_lang['lpn_settings_label_max_width']='إظهار التسميات عند التكبير إلى عرض الخريطة هذا أو أقل';
// **NO LONGER SAYS ANYTHING ABOUT SYMBOL SIZE** (Task 705, Tom, 2026-09-22: *"I'd prefer not to have
// two rules"*, removing the "piggyback" where a blank box here also decided where symbols stopped
// growing). That rule now lives entirely in lpn_settings_symbol_cap_tip below.
// **0 IS NEVER, IN THE CUSTOMER TIP'S OWN WORDING** (2026-09-23, replacing "Thematic map
// (colors only)"). See lpn_labels_customer_width_tip above for the pattern this follows.
// **LAST SENTENCE REMOVED** (Tom, 2026-09-23 (c): "similar to the all labels tip, but with the
// last sentence removed since it's misleading") -- "Text you placed yourself stays, and your label
// choices are kept either way" implied this row decides what survives, which it does not.
$ec_lang['lpn_settings_label_max_width_tip']='تُرسم التسميات فقط عندما يكون منظور الخريطة بهذا العرض أو أضيق. اترك المربع فارغاً لرسمها عند كل تكبير. اكتب 0 لعدم رسم تسمية أبداً، عند أي تكبير.';
// **"ALWAYS SHOW", NOT "ALWAYS SHOW LABELS"** (Tom, 2026-09-23 (a)) -- shared as the placeholder
// for both the all-labels row above and the customer row (lpn_labels_customer_width_tip's row),
// so a word this generic does not need "labels" or "customer labels" to say what a blank box means.
$ec_lang['lpn_settings_label_always']='إظهار دائماً';
// **THE ONE MAXIMUM-SYMBOL-SIZE RULE** (Task 705, his own wording, 2026-09-22: *"Prevent nodes from
// scaling larger than __ times the length of the __ percentile pipe"*). Split across three keys
// because the row holds two number boxes; the row label is the leading fragment, `_mid` sits
// between the boxes and `_post` follows the second one (which is shown as a percentage, so "20"
// reads as "20% percentile pipe").
$ec_lang['lpn_settings_symbol_cap']='منع العُقَد من التكبّر أكثر من';
$ec_lang['lpn_settings_symbol_cap_mid']='ضعف طول';
$ec_lang['lpn_settings_symbol_cap_post']='الأنبوب عند المئين';
$ec_lang['lpn_settings_symbol_cap_tip']='يتوقف الملتقى عن التكبّر على الأرض بمجرد أن يصبح قطره بهذا العدد من الأضعاف لطول الأنبوب عند هذا المئين من كل أطوال الأنابيب في الشبكة. بعد تلك النقطة على الخريطة، تتقلص الملتقيات والأنابيب والرموز الأخرى على الشاشة عند التصغير بدلاً من التكبّر على الأرض. الخزانات والصهاريج استثناء، وتحتفظ بحجمها على الشاشة عند كل تكبير.';
// Fading the symbols (not the labels) is a LAYOUT aid: it lets a backdrop aerial or plan show
// through the network while you place nodes on top of it (Tom, 2026-07-30).
$ec_lang['lpn_settings_symbol_opacity']='عتامة الرمز (0 إلى 1)';
// The counterpart control: fade the backdrop image so a busy or dark one stops swallowing the
// network drawn over it (Tom, 2026-07-30).
$ec_lang['lpn_settings_backdrop_opacity']='عتامة الصورة الخلفية (0 إلى 1)';
$ec_lang['lpn_settings_map_display']='مظهر الخريطة';
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
$ec_lang['lpn_settings_legend_position']='موضع مفتاح التسميات';
// ROADMAP Task 529. Tom, 2026-08-25, after a phone session: *"one of the legend placement options
// must be 'Off'... Especially the labels legend. With all the control we have given the user, the
// legend is of less value now compared to when we were distinguishing coloured numbers."*
// It sits in the placement dropdown, not beside it as a checkbox, because where the box goes and
// whether it goes anywhere are one decision.
$ec_lang['lpn_settings_legend_off']='بلا';
// Split from `lpn_settings_legend_off` 2026-09-02 (Task 573 Wave 0). One key served a legend
// POSITION list and a leader-snap ANGLE list; English 'Off' covers both and Spanish does not
// (Ninguno for a position, Desactivado for a switch), so one of the two selects was going to be
// wrong in most of the 26.
$ec_lang['lpn_settings_snap_off']='إيقاف';
$ec_lang['lpn_settings_legend_top_left']='أعلى اليسار';
$ec_lang['lpn_settings_legend_top_right']='أعلى اليمين';
$ec_lang['lpn_settings_legend_middle_left']='منتصف اليسار';
$ec_lang['lpn_settings_legend_middle_right']='منتصف اليمين';
$ec_lang['lpn_settings_legend_bottom_left']='أسفل اليسار';
$ec_lang['lpn_settings_legend_bottom_right']='أسفل اليمين';
$ec_lang['lpn_settings_color_node_field']='لون العقدة';
$ec_lang['lpn_settings_color_link_field']='لون الأنبوب';
$ec_lang['lpn_settings_color_ramp']='مخطط الألوان';
$ec_lang['lpn_settings_color_credits']='حقوق النسبة';
$ec_lang['lpn_color_ramp_epanet']='من الأزرق إلى الأحمر (EPANET)';
$ec_lang['lpn_color_ramp_viridis']='من البنفسجي إلى الأصفر (أسهل في التمييز بين لون وآخر)';
$ec_lang['lpn_color_ramp_gray']='من الرمادي الفاتح إلى الداكن';
$ec_lang['lpn_settings_color_reverse']='عكس ترتيب الألوان';
$ec_lang['lpn_color_none']='بلا لون';
$ec_lang['lpn_settings_color_key_position']='موضع مفتاح الألوان';
$ec_lang['lpn_settings_color_breaks']='حدود نطاقات الألوان';
$ec_lang['lpn_settings_color_equal_intervals']='فواصل متساوية';
$ec_lang['lpn_settings_color_equal_counts']='أعداد متساوية';
$ec_lang['lpn_settings_color_no_values']='لا توجد قيم للعمل عليها بعد. احلّ الشبكة أولاً.';
$ec_lang['lpn_confirm_restore_defaults']='هل تريد إعادة ضبط كل الإعدادات (بادئات المعرّفات، والقيم الابتدائية، وإعدادات الحلّال، ومظهر الخريطة، وموضع مفتاح الرموز، والتسميات الظاهرة) إلى قيمها الأصلية؟ لا تتغيّر شبكتك. الإعدادات تخص المشروع المفتوح، فتحتفظ مشاريعك الأخرى بإعداداتها الخاصة.';
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
$ec_lang['lpn_settings_wipe_btn']='محو كل شيء في هذه الصفحة';
$ec_lang['lpn_confirm_wipe']='هل تريد حذف كل شيء محفوظ لهذه الصفحة — كل مشروع، وكل صورة خلفية، وكل الإعدادات، واختياراتك للوحدات — وإعادة تحميل الصفحة كما يراها زائر جديد تماماً؟ لا يمكن التراجع عن هذا.';

// Share this calculation (ROADMAP Task 228). template_share_link and template_share_copied were
// RETIRED in Task 438 Wave 0: the duplicate control under the Printable Title is gone, the
// navbar's calc_copy_link is the only way to copy a link, and two labels for one behaviour would
// have invited 26 translators to invent a distinction the code does not have. This one survives
// because lib/Menus.lib.php still reads it for the manual-copy box.
$ec_lang['template_share_manual']='انسخ هذا الرابط:';

// Extended-period simulation: the clock, the run, and the control that steps through it
// (ROADMAP Task 248 and its 248.01 child). The seven settings keep EPANET's own names, because a
// reader who has used EPANET recognises them and a reader who has not is no worse off for a plain
// two-word phrase. Times are written the way EPANET writes them, so the tip has to say that a
// plain number means hours.
$ec_lang['lpn_time_menu']='الوقت';
// lpn_time_menu_tip was DELETED on 2026-09-08 (Tom: "Time menu tip: Delete."). It named the bottom
// pane's Time tab, that tab is gone, and it had been supplied to pageConfig and read by nothing
// since. Removed from all 27 language files and from the pageConfig supply in the same pass.
$ec_lang['lpn_time_duration']='مدة التشغيل الكلية';
$ec_lang['lpn_time_hyd_step']='خطوة الزمن الهيدروليكية';
$ec_lang['lpn_time_pattern_step']='خطوة زمن النمط';
$ec_lang['lpn_time_pattern_start']='وقت بدء النمط';
$ec_lang['lpn_time_report_step']='خطوة زمن التقرير';
$ec_lang['lpn_time_report_start']='وقت بدء التقرير';
$ec_lang['lpn_time_clock_start']='وقت الساعة عند البداية';
$ec_lang['lpn_time_clock_day']='اليوم {day}، {clock}';
$ec_lang['lpn_time_format_tip']='اكتب الوقت بالساعات والدقائق، مثل 2:30. الرقم المجرد يعني ساعات، فمثلاً 8 يعني ثماني ساعات. نصف الساعة هو 0:30.';
$ec_lang['lpn_time_running']='يجري حساب محاكاة ممتدة الفترة بحلّال EPANET.';
$ec_lang['lpn_time_no_engine']='يحسب الحلّال المدمج لحظة واحدة في كل مرة، لذا هذه هي الشبكة عند {time} فقط: تُقرأ كل الأنماط عند تلك اللحظة، ولا يزال كل صهريج عند منسوبه الابتدائي بدلاً من الامتلاء والتفريغ. اتصل بالإنترنت مرة واحدة لجلب حلّال EPANET، الذي يشغّل محاكاة ممتدة الفترة.';
$ec_lang['lpn_time_slider']='الوقت';
$ec_lang['lpn_time_no_period']='لا يضبط هذا المشروع محاكاة ممتدة الفترة، لذا توجد لحظة واحدة فقط لعرضها. اضبط مدة التشغيل الكلية في الإعدادات، الحساب، الوقت لتشغيل محاكاة ممتدة الفترة.';
$ec_lang['lpn_time_first']='الانتقال إلى البداية';
$ec_lang['lpn_time_prev']='خطوة للخلف';
$ec_lang['lpn_time_play']='تشغيل';
$ec_lang['lpn_time_play_tip']='تشغيل الرسم المتحرك';
$ec_lang['lpn_time_pause_tip']='إيقاف الرسم المتحرك مؤقتاً';
$ec_lang['lpn_time_pause']='إيقاف مؤقت';
$ec_lang['lpn_time_next']='خطوة للأمام';
$ec_lang['lpn_time_last']='الانتقال إلى النهاية';
$ec_lang['lpn_time_tank']='الصهريج';
$ec_lang['lpn_time_level']='منسوب الماء';
$ec_lang['lpn_time_run']='احسب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_time_run_tip']='حلّ هذه الشبكة عند كل خطوة زمنية هيدروليكية، من بداية التشغيل إلى نهايته.';
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
$ec_lang['lpn_time_run_done']='انتهى التشغيل. أوقات الإبلاغ: {frames}. الوقت المستغرق: {secs} ث.';
$ec_lang['lpn_time_runbox_hide']='عدم إظهار هذا الصندوق مرة أخرى';
$ec_lang['lpn_settings_runbox']='إظهار صندوق تقدم التشغيل';
$ec_lang['lpn_settings_runbox_tip']='صندوق يبلّغ عن مدى تقدم التشغيل وما وجده. عند إيقافه، يذكر التشغيل المنتهي الشيء نفسه في شريط الحالة لبضع ثوانٍ بدلاً من ذلك. هذا إعداد لهذا المتصفح، وليس للمشروع.';
$ec_lang['lpn_time_run_failed']='لم يكتمل التشغيل، فلا توجد نتائج للأوقات اللاحقة.';
$ec_lang['lpn_time_run_report']='تقرير تشغيل EPANET';
$ec_lang['lpn_time_run_report_copy']='نسخ';
$ec_lang['lpn_time_run_report_copied']='نُسخ';
$ec_lang['lpn_time_run_report_tip']='ما طبعه حلّال EPANET نفسه عن التشغيل الأخير: هل تقارب، وأي شيء حذّر منه. هذا نص الحلّال نفسه، لا نصنا.';

$ec_lang['lpn_time_speed']='السرعة';
$ec_lang['lpn_time_speed_tip']='مدى سرعة تشغيل العرض.';

// ---- The Settings box (ROADMAP Task 441) ----------------------------------------------------
// One box for everything that belongs to the whole project: Labels, Settings, Time and Coloring,
// with an index down the left and a search across the top. The section titles are not new keys --
// each borrows the name it already had (lpn_tool_labels, lpn_menu_settings, lpn_time_menu,
// lpn_settings_colors), so the box cannot drift from the doors that open it.
$ec_lang['lpn_settings_search']='البحث في الإعدادات';
// **AND-OF-WORDS, STATED AS SUCH** (Tom, 2026-09-23 (g): "can Settings filter work as an AND word
// search? I think it currently works as an entire string search."). It did -- filterSetboxContainer()
// tested the whole typed string as one substring. It now splits on whitespace and requires every
// word somewhere in a row's own searchable text (setboxUnitText()'s name+tip+aria-label+placeholder
// join), so "zoom label" finds a row without either word next to the other. His own sentence is the
// tip, verbatim.
$ec_lang['lpn_settings_search_tip']='اكتب كلمة لرؤية الإعدادات التي تذكرها فقط. تُشمل الشروحات في البحث أيضاً، لا الأسماء فقط.';
$ec_lang['lpn_settings_no_match']='لا يوجد إعداد يذكر تلك الكلمة.';
// The grab strip between the two panes (ROADMAP Task 576). An aria-label, so it is a NAME rather
// than an instruction: what the control adjusts, not how to operate it.
$ec_lang['lpn_setbox_divider']='عرض قائمة أقسام الإعدادات';
$ec_lang['lpn_rpane_empty']='لا شيء مثبَّت هنا بعد. كل ما يخص المشروع كله موجود في الإعدادات.';
$ec_lang['lpn_time_settings_open']='إعدادات الوقت';

// ---- The Settings box's four categories (ROADMAP Task 441, restructured) ---------------------
// Tom, 2026-08-18, using the box for the first time: the four sections it opened with were the
// four panels it had absorbed, which is a history rather than a structure. These are his own
// groupings. THERE IS NO SECTION CALLED "SETTINGS": the box is Settings, so nothing inside it
// repeats the word.
// "Symbology" is the standard word -- QGIS, ArcGIS and Bentley all use it -- and covers both the
// colour a value is drawn in and the label printed beside it.
// "Hydraulics" is EPANET's own name for the friction-method/accuracy/engine group, which also
// leaves room for its siblings (Quality, Reactions) as they arrive.
$ec_lang['lpn_settings_sec_symbology']='التصور المرئي';
$ec_lang['lpn_settings_sec_map']='الخريطة والصفحة';
$ec_lang['lpn_settings_sec_assets']='افتراضيات العناصر الجديدة';
$ec_lang['lpn_settings_sec_calculation']='الحساب';
// ROADMAP Task 247. A customer label's CONTENT is the node rows above it (Tom: "Customer labels
// would follow Node styles"), so this section has one control and no checkboxes: how close the
// view has to be before a service is worth lettering.
$ec_lang['lpn_settings_sym_customer']='مشترك';
$ec_lang['lpn_labels_customer_note']='تعرض تسمية المشترك القيم المحدَّدة هنا. تُرسم بحجم النص نفسه لكل تسمية أخرى على الخريطة.';
// **THE ROW NAME IS lpn_settings_label_max_width NOW, NOT A KEY OF ITS OWN** (Tom, 2026-09-23:
// "Make the Customer labels and All labels zoom limits settings interfaces identical... Both to
// say 'Show labels when zoomed to this map width or less'"). KEY DELETED: lpn_labels_customer_width
// -- nothing renders it and nothing checks it; it was untranslated in every other language, so
// deleting it costs no translation. The tip stays its own key, since its WORDS differ from the
// all-labels tip (this row's own gate, plus the (e) qualifier that the all-labels limit wins).
$ec_lang['lpn_labels_customer_width_tip']='تُرسم تسميات المشتركين فقط عندما يكون منظور الخريطة بهذا العرض أو أضيق. اترك المربع فارغاً لرسمها عند كل تكبير. اكتب 0 لعدم رسم تسمية مشترك أبداً، عند أي تكبير. ليس لهذا أثر إذا كان أكبر من الإعداد المماثل لكل التسميات.';
// ROADMAP Task 247. The capture button beside the width above (Tom, 2026-09-19: "Widest view: Add a
// 'Use current view' button like the other one we restored in a different branch."). The SAME key
// name and the same words as that control, deliberately: it is one idea and a reader who has met it
// once must not have to learn a second wording for it.
$ec_lang['lpn_settings_label_use_view']='استخدام المنظور الحالي';
$ec_lang['lpn_settings_page']='الصفحة';
$ec_lang['lpn_settings_page_note']='محفوظ في هذه الحاسبة، لا في المشروع.';
$ec_lang['lpn_settings_hydraulics']='الهيدروليكا';
$ec_lang['lpn_settings_quality']='جودة المياه';
$ec_lang['lpn_settings_quality_track']='نوع تحليل الجودة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_settings_quality_track_tip']='اختر ما يجب أن يتتبعه التشغيل عبر الأنابيب: مدة بقاء الماء في الشبكة، أو من أين جاء، أو مادة كيميائية تتفاعل أثناء انتقالها. المادة الكيميائية وحدها تحتاج إلى معاملات.';
$ec_lang['lpn_settings_quality_source']='عقدة التتبع';
$ec_lang['lpn_settings_quality_source_tip']='العقدة التي يُتتبَّع ماؤها. تُظهر كل عقدة أخرى عندئذ حصة مائها التي جاءت من تلك العقدة.';
$ec_lang['lpn_quality_none']='بلا شيء';
$ec_lang['lpn_quality_age']='عمر الماء';
$ec_lang['lpn_quality_trace']='تتبع المصدر';
$ec_lang['lpn_quality_chemical']='مادة كيميائية تتفاعل';
$ec_lang['lpn_quality_needs_run']='تُنقل جودة المياه عبر الأنابيب مع سريان الماء، لذا تحتاج إلى محاكاة ممتدة الفترة: محرك EPANET ومدة تشغيل كلية. اضبط مدة التشغيل الكلية تحت الوقت، ثم اضغط زر احسب.';
// **THE CHEMICAL / REACTION MODE** (ROADMAP Task 566, dev/water-quality.md). EPANET's own words
// throughout: bulk and wall reaction coefficient, initial quality, concentration. The unit of a
// concentration is TEXT the document states beside the chemical name and is never converted, which
// is why there is no unit family and no unit key here.
// R-323: "Our interface is very clear that these don't matter to the calculations. But
// explanation aside, our interface is arguably less friendly than EPANET because they have a
// dropdown for Mass Units ... and they don't 'require' the chemical name." Split into a name (this
// key) and a Mass units dropdown (lpn_quality_mass_units) below, matching EPANET's own Parameter
// and Mass Units fields; the name is optional, exactly as EPANET's own is.
$ec_lang['lpn_quality_chemical_name']='المادة الكيميائية ووحداتها';
$ec_lang['lpn_quality_chemical_name_tip']='اسم المادة الكيميائية ووحدات تراكيزها: مثلاً، اكتب Chlorine mg/L كإدخال واحد. هذه تسمية فقط. لا يحوّل EPANET أي تركيز، لذا يجب أن يكون كل تركيز وكل معامل في المشروع مكتوباً بهذه الوحدات أصلاً.';
$ec_lang['lpn_quality_mass_units']='وحدات الكتلة';
$ec_lang['lpn_quality_mass_units_tip']='شق الوحدات من إدخال الجودة، خياري EPANET نفسه.';
$ec_lang['lpn_quality_unit_ug']='µg/L';
// R-322: "Quality tolerance: I don't see this in our interface. Is it missing?" "Relative
// diffusivity: I don't see this in our interface. Is it missing?" Both were carried in the file
// and handed to the engine with no box to read or change them from; EPANET's own names and its own
// defaults (0.01 and 1.0), shown only for a chemical, which is all either one means anything to.
$ec_lang['lpn_quality_tolerance']='سماحية الجودة';
$ec_lang['lpn_quality_tolerance_tip']='مقدار الاختلاف المسموح به في التركيز بين طردين متجاورين من الماء قبل أن يعاملهما EPANET كطرد واحد. الفراغ يستخدم القيمة الافتراضية لـEPANET نفسه وهي 0.01.';
$ec_lang['lpn_quality_diffusivity']='الانتشارية النسبية';
$ec_lang['lpn_quality_diffusivity_tip']='مدى سهولة انتشار المادة الكيميائية خلال الماء، نسبةً إلى الكلور. الفراغ يستخدم القيمة الافتراضية لـEPANET نفسه وهي 1.0.';
// R-323: "We could put it in Properties, Find, and Tables as '{chemical} concentration', and that
// would be very cool." One template, read by qualityLabel() everywhere a concentration is named.
$ec_lang['lpn_quality_named_concentration']='تركيز {chemical}';
// R-349, the link half of R-323: linkQualityLabel()'s named-chemical case. A whole template
// ("Average" is never glued to lpn_quality_named_concentration's own string at render time).
$ec_lang['lpn_quality_named_avg_concentration']='متوسط تركيز {chemical}';
$ec_lang['lpn_quality_initial']='الجودة الابتدائية';
// Edited by TGH 2026-09-07
$ec_lang['lpn_quality_initial_tip']='كمية المادة الكيميائية التي تحملها هذه العقدة عند بدء التشغيل. يحتفظ الخزان بقيمته الخاصة طوال التشغيل، وهذه هي الطريقة المعتادة لبيان المتبقي الخارج من محطة معالجة. اتركها فارغة لتبدأ العقدة بلا شيء من المادة الكيميائية.';
$ec_lang['lpn_result_concentration']='التركيز';
// Edited by TGH 2026-09-07
$ec_lang['lpn_result_concentration_tip']='كمية المادة الكيميائية المتبقية عند هذه النقطة بعد انتقالها وتفاعلها. الوحدات هي التي سُمِّيت بجانب المادة الكيميائية تحت الإعدادات، جودة المياه.';
// **THE BOOSTER DOSE AND THE TANK MIXING MODEL** (ROADMAP Task 579), EPANET's `[SOURCES]` and
// `[MIXING]`. EPANET's own words throughout, and its own four source types and four mixing models,
// because an engineer choosing between them is choosing between real pieces of equipment and real
// tank behaviour. A source strength has no unit family for the same reason an initial quality has
// none: it is written in the units named beside the chemical, and nobody converts it.
$ec_lang['lpn_source_type']='نوع المصدر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_type_tip']='نوع الجرعة التي تطبقها هذه العقدة على الماء المارّ بها. التركيز يعامل الماء الداخل إلى الشبكة هنا كأنه يصل بقيمة جودة المصدر. معزِّز الكتلة يضيف كتلة من المادة الكيميائية كل دقيقة، أياً كان التدفق. معزِّز نقطة الضبط يرفع تركيز الماء الخارج من هذه العقدة إلى قيمة جودة المصدر ولا يتجاوزها. معزِّز متناسب مع التدفق يضيف قيمة جودة المصدر إلى ما هو موجود بالفعل في الماء.';
// R-350: "Source type should default to none... it's ignored if Source Quality is blank." The
// disabled state's own word, shown only while the box beside it carries no quality.
$ec_lang['lpn_source_type_none']='بلا';
$ec_lang['lpn_source_type_concen']='التركيز';
$ec_lang['lpn_source_type_mass']='معزِّز الكتلة';
$ec_lang['lpn_source_type_setpoint']='معزِّز نقطة الضبط';
$ec_lang['lpn_source_type_flowpaced']='معزِّز متناسب مع التدفق';
$ec_lang['lpn_source_quality']='جودة المصدر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_source_quality_tip']='قوة الجرعة. في كل الأنواع باستثناء معزِّز الكتلة هذه تركيز، بالوحدات المسمّاة بجانب المادة الكيميائية تحت الإعدادات، جودة المياه؛ أما في معزِّز الكتلة فهي كتلة من المادة الكيميائية في الدقيقة. اتركها فارغة فلا يُضاف هنا شيء، وهذا ليس كالصفر: فالصفر تغذية تعمل ولا تضيف شيئاً.';
$ec_lang['lpn_source_pattern']='نمط المصدر';
$ec_lang['lpn_source_pattern_tip']='نمط زمني يُضرَب في الجرعة طوال التشغيل، لتغذية غير ثابتة. لا نمط يعني أن الجرعة واحدة في كل خطوة.';
$ec_lang['lpn_mixing_model']='نموذج الاختلاط';
$ec_lang['lpn_mixing_model_tip']='كيف يختلط الماء الموجود بالفعل في هذا الصهريج بالماء الوارد. الاختلاط الكامل يحرّك الصهريج كله دفعة واحدة. اختلاط الحجرتين يملأ منطقة المدخل أولاً ثم يمرر الباقي. التدفق الانسيابي FIFO يحرّك الماء بترتيب وصوله. التدفق الانسيابي LIFO يكدّسه، فآخر ماء يدخل هو أول ماء يخرج. يغيّر هذا الاختيار عمر الماء والمتبقي، ولا يغيّر أي ضغط أو تدفق.';
$ec_lang['lpn_mixing_mixed']='الاختلاط الكامل';
$ec_lang['lpn_mixing_2comp']='اختلاط الحجرتين';
$ec_lang['lpn_mixing_fifo']='تدفق انسيابي FIFO';
$ec_lang['lpn_mixing_lifo']='تدفق انسيابي LIFO';
$ec_lang['lpn_mixing_fraction']='نسبة الاختلاط';
// Edited by TGH 2026-09-07
$ec_lang['lpn_mixing_fraction_tip']='حصة حجم الصهريج التي تشغلها منطقة المدخل، بين 0 و1. يستخدمها اختلاط الحجرتين فقط. اتركها فارغة ليكون الصهريج كله منطقة مدخل، وهذا ما يفترضه EPANET.';
$ec_lang['lpn_reaction_bulk']='معامل تفاعل الكتلة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_bulk_tip']='التفاعل في متن الماء، يُستخدم لكل أنبوب لا يحمل معامله الخاص. الرقم السالب يُحلِّل المادة الكيميائية والرقم الموجب يزيدها. التفاعل من الرتبة الأولى ما لم يذكر ملف EPANET مستورَد رتبة أخرى، فالمعامل معدّل بوحدة 1/يوم. المربع الفارغ يعني عدم وجود تفاعل كتلة.';
$ec_lang['lpn_reaction_wall']='معامل تفاعل الجدار';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_wall_tip']='التفاعل عند جدار الأنبوب، يُستخدم لكل أنبوب لا يحمل معامله الخاص. الرقم السالب يُحلِّل المادة الكيميائية. التفاعل من الرتبة الأولى ما لم يذكر ملف EPANET مستورَد رتبة أخرى، فالمعامل طول في اليوم، مكتوب بوحدة طول المشروع. المربع الفارغ يعني عدم وجود تفاعل جدار.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_pipe_tip']='هذا الأنبوب وحده. اتركه فارغاً ليستخدم الأنبوب المعامل المحدد للشبكة كلها تحت الإعدادات، جودة المياه.';
// The tank's own coefficient. EPANET's Tank properties call it exactly this, and the popup it
// stands in is a tank's, so the word "tank" would only be said twice.
$ec_lang['lpn_reaction_tank']='معامل التفاعل';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_tank_tip']='التفاعل في الماء المحفوظ في هذا الصهريج، بمعدّل بوحدة 1/يوم. الرقم السالب يُحلِّل المادة الكيميائية والرقم الموجب يزيدها. يبقى الماء في الصهريج أطول بكثير مما يبقى في أي أنبوب، فهذا غالباً حيث يُفقد المتبقي. اتركه فارغاً ليستخدم الصهريج معامل تفاعل الكتلة المحدد للشبكة كلها تحت الإعدادات، جودة المياه.';
// Three column headings, in tables whose tab already says what the parts are. Column width is king,
// so each drops the word "coefficient" that the popup label carries in full.
$ec_lang['lpn_reaction_bulk_short']='تفاعل الكتلة';
$ec_lang['lpn_reaction_wall_short']='تفاعل الجدار';
$ec_lang['lpn_reaction_tank_short']='التفاعل';
// The two unit words the coefficient labels are built from. Translatable, because the abbreviation
// for a day is not the same word everywhere.
$ec_lang['lpn_reaction_per_day']='1/يوم';
$ec_lang['lpn_reaction_day']='يوم';
// **THE FIVE A FILE COULD STATE AND NOTHING COULD SHOW** (Task 593). Net2 and Net3 both state all
// five; they parsed, round-tripped and reached the engine all along, and only the reader was
// missing. **Each tip says what the number DOES to the coefficients rather than restating the
// label**, because every one of these changes what a coefficient MEANS rather than scaling it --
// which is the whole reason the roadmap called a bare row worse than no row.
$ec_lang['lpn_reaction_order_bulk']='رتبة تفاعل المتن';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_order_bulk_tip']='الأس الذي يُرفع إليه التركيز في التفاعل داخل متن الماء. يُسمح بأي عدد حقيقي. القيمة الافتراضية 1، وتُستخدم في معظم نماذج تحلل الكلور. القيمة 0 تجعل المعدل مستقلاً عن كمية المادة الكيميائية الموجودة.';
$ec_lang['lpn_reaction_order_tank']='رتبة تفاعل الصهريج';
// **TANK REACTION ORDER EXISTS, AND THE TIP NOW SAYS WHERE** (Tom, 2026-09-07:
// "I am not finding that there is such a thing as tank reaction order. Please investigate."). It is
// EPANET's own `ORDER TANK` line in `[REACTIONS]`, and `EN_TANKORDER` in the toolkit; what it is
// missing is a box in EPANET's own interface, which is why looking for it there finds nothing. The
// tip carried a byte-identical copy of the BULK order tip until 2026-09-08, so it also never said
// what makes a tank order a separate number from a bulk one.
//
// The EPANET mention earns its place under the 2026-09-06 rule: a reader standing on this row who
// went looking for it in EPANET and did not find it is experiencing exactly that right now.
$ec_lang['lpn_reaction_order_tank_tip']='الأس الذي يُرفع إليه التركيز للتفاعل في الماء المحفوظ داخل صهريج، منفصل عن رتبة تفاعل المتن ليتفاعل الصهريج برتبة مختلفة عن الأنابيب. يُسمح بأي عدد حقيقي، والقيمة الافتراضية 1. يذكرها EPANET في الملف باسم ORDER TANK، ولا يوفر له صندوقاً في واجهته الخاصة.';
$ec_lang['lpn_reaction_order_wall']='رتبة تفاعل الجدار';
// Edited by TGH 2026-09-07
// R-324: "Our Wall reaction order tip is wrong. We need to say '1 means that the wall reaction is
// dependent on the concentration in the bulk flow. 0 means it is not.'" His exact words.
$ec_lang['lpn_reaction_order_wall_tip']='القيمة 1 تعني أن تفاعل الجدار يحدث وفق المعامل (المعاملات) المحددة. والقيمة 0 تعني أنه لا يحدث. هذا مفتاح تشغيل وإيقاف. القيمة الافتراضية 1.';
$ec_lang['lpn_reaction_order_unstated']='غير مذكورة';
$ec_lang['lpn_reaction_order_zero']='0، رتبة صفرية';
$ec_lang['lpn_reaction_order_first']='1، رتبة أولى';
// **EPANET'S OWN HELP SAYS "Limiting Concentration"** (Tom, 2026-09-08, having checked it:
// *"Purge 'potential' from this subject."*). Three translators independently rendered the old
// English as a concentration, against the words in front of them, which is what sent him to the
// help. `Limiting Potential` is still the KEYWORD in an EPANET file's [REACTIONS] section and is
// still written and read verbatim there; this is the label a person reads.
$ec_lang['lpn_reaction_limiting']='التركيز الحدّي';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_limiting_tip']='تركيز تتجه إليه المادة الكيميائية بدلاً من أن تتحلل إلى لا شيء أو تنمو بلا نهاية. يتباطأ التفاعل مع اقتراب الماء منه ويتوقف عنده. استخدم وحدات متسقة. لا حد إذا تُرك فارغاً.';
$ec_lang['lpn_reaction_rough_corr']='ارتباط الخشونة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_rough_corr_tip']='يربط تفاعل الجدار بخشونة كل أنبوب على حدة، فيتفاعل الأنبوب الأخشن أسرع. عند ضبطه، يُحسب معامل جدار لكل أنبوب من خشونته، ولا يُستخدم عندئذ معامل الجدار الواحد أعلاه. لا يُستخدم إذا تُرك فارغاً.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reaction_note']='لا تقدّم هذه الصفحة معامل تفاعل خاصاً بها. لا يوجد اختبار قياسي لمعامل كهذا، وتختلف القيم الميدانية المنشورة لنفس نوع الماء بمقدار عشرة أضعاف، فأي رقم يُقدَّم هنا سيُقرأ على أنه توصية. أدخل رقماً قِسته أو رقماً يمكنك الاستشهاد به، أو اترك المربعات فارغة لمادة كيميائية لا تتفاعل.';
// **PUMP ENERGY AND COST** (ROADMAP Task 566, dev/pump-energy.md). EPANET's own words: efficiency,
// price, demand charge, energy pattern. The one section of this page whose answer is money, so the
// wording has to be careful in two places: there is no default price and the note says why, and the
// currency is a LABEL the user types, never a unit this page converts.
$ec_lang['lpn_settings_energy']='الطاقة';
// The Reports fly-out (Tom, 2026-09-04). The parent says "report" once, so no row under it has to;
// the BOX titles still name the objects themselves, which is why lpn_energy_title and
// lpn_time_run_report keep the word and lpn_energy_menu and lpn_reports_epanet do not.
$ec_lang['lpn_reports_menu']='التقارير';
// Edited by TGH 2026-09-07
$ec_lang['lpn_reports_menu_tip']='الإجابات النهائية التي تنتجها هذه الصفحة بعد حساب الشبكة: ما الذي تكلفه المضخات، وكيف تُقارَن السيناريوهات، وما طبعه حلّال EPANET نفسه.';
$ec_lang['lpn_reports_epanet']='تشغيل EPANET';
$ec_lang['lpn_energy_title']='تقرير طاقة المضخة';
$ec_lang['lpn_energy_menu']='طاقة المضخة';
$ec_lang['lpn_energy_menu_tip']='أي حصة من التشغيل كانت كل مضخة تعمل فيها، وما القدرة التي استمدتها، وما الذي كلّفه ذلك خلال آخر محاكاة ممتدة الفترة.';
$ec_lang['lpn_energy_efficiency']='كفاءة المضخة (بالمئة)';
$ec_lang['lpn_energy_efficiency_tip']='الكفاءة الكهرومائية المستخدمة لكل مضخة لا تحمل منحنى كفاءة خاصاً بها. يستخدم EPANET 75 بالمئة إن لم يُذكر شيء.';
$ec_lang['lpn_energy_price']='سعر الطاقة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_tip']='تكلفة كيلوواط ساعة واحد. ينطبق على كل مضخة لا تحمل سعراً خاصاً بها. اتركه فارغاً لتكون كل تكلفة في التقرير صفراً.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_pump_price_tip']='تكلفة كيلوواط ساعة واحد عند هذه المضخة. اتركه فارغاً لتدفع المضخة السعر المحدد للشبكة كلها تحت الإعدادات، الطاقة.';
$ec_lang['lpn_energy_price_pattern']='نمط السعر';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_pattern_tip']='نمط يُضرَب في السعر عند كل خطوة، وبهذا يُحدَّد سعر خارج أوقات الذروة. اتركه فارغاً ليبقى سعر واحد طوال التشغيل.';
$ec_lang['lpn_energy_demand_charge']='رسم ذروة الطلب';
$ec_lang['lpn_energy_demand_charge_tip']='ما تفرضه شركة المياه لكل كيلوواط من ذروة الحمل الذي تطلبه المضخات في النظام.';
$ec_lang['lpn_energy_currency']='العملة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_currency_tip']='أي شيء تكتبه هنا يُطبع بجانب كل رقم مالي. هذه تسمية فقط. لا تُحوَّل الأسعار والتكاليف أبداً، فاكتب الأسعار بالعملة التي كتبتها هنا.';
$ec_lang['lpn_energy_kwh']='kWh';
$ec_lang['lpn_energy_kw']='kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_price_note']='لا تقدّم هذه الصفحة سعراً خاصاً بها. تعتمد تكلفة الطاقة على شركة المياه والبلد والساعة والسنة، فأي رقم يُقدَّم هنا سيُقرأ على أنه توصية. أدخل السعر من تعرفتك الخاصة.';
$ec_lang['lpn_energy_needs_run']='طاقة المضخة هي القدرة متكاملة عبر التشغيل، لذا تحتاج إلى محاكاة ممتدة الفترة: محرك EPANET ومدة تشغيل كلية. اضبط مدة التشغيل الكلية في الإعدادات، الحساب، الوقت، ثم اضغط زر احسب، ثم افتح المياه، التقارير، طاقة المضخة.';
$ec_lang['lpn_energy_no_pumps']='لا تحتوي هذه الشبكة على مضخات، فلا شيء يستمد قدرة.';

// ---- The scenario comparison (the planning engineer's wish-list row 2) ------------------------
// One row per scenario, solved from a copy. The two column headings this borrows rather than
// re-keying are lpn_scenario_label and lpn_scenario_overrides, which already name the same two
// things in the scenario menu.
$ec_lang['lpn_scncmp_title']='مقارنة السيناريوهات';
$ec_lang['lpn_scncmp_menu_tip']='حلّ كل سيناريو في هذا المشروع واقرأها جنباً إلى جنب: أدنى ضغط وأعلى سرعة في كل منها.';
$ec_lang['lpn_scncmp_running']='جارٍ حل كل سيناريو…';
$ec_lang['lpn_scncmp_empty']='لم يُرسم شيء بعد، فلا شيء ليُحل.';
$ec_lang['lpn_scncmp_col_minpressure']='أدنى ضغط';
$ec_lang['lpn_scncmp_col_maxvelocity']='أعلى سرعة';
$ec_lang['lpn_scncmp_at']='{value} عند {id}';
$ec_lang['lpn_scncmp_current']='(مفتوح حالياً)';
$ec_lang['lpn_scncmp_note']='يُحل كل سيناريو من نسخة من الرسم. لا شيء هنا يغيّر المشروع، ويبقى السيناريو الذي تعمل فيه كما كان.';
$ec_lang['lpn_energy_over']='لمحاكاة ممتدة الفترة مدتها {time}';
$ec_lang['lpn_energy_col_pump']='المضخة';
$ec_lang['lpn_energy_col_running']='% من التشغيل';
$ec_lang['lpn_energy_col_effic']='الكفاءة';
$ec_lang['lpn_energy_col_avg_kw']='متوسط kW';
// Edited by TGH 2026-09-07
$ec_lang['lpn_energy_col_avg_kw_tip']='متوسط القدرة المستخدمة أثناء عمل هذه المضخة. لا يُحسب المتوسط على فترات التوقف، فالمضخة التي توقفت معظم محاكاة الفترة الممتدة لا تزال تُبلِّغ عن القدرة التي استخدمتها أثناء عملها.';
$ec_lang['lpn_energy_col_peak_kw']='ذروة kW';
$ec_lang['lpn_energy_col_kwh']='kWh';
$ec_lang['lpn_energy_col_cost']='التكلفة';
$ec_lang['lpn_energy_total_kwh']='الطاقة المستخدمة';
$ec_lang['lpn_energy_total_energy_cost']='تكلفة الطاقة';
$ec_lang['lpn_energy_peak_kw']='ذروة استخدام القدرة';
$ec_lang['lpn_energy_total_demand_charge']='تكلفة ذروة الطلب';
$ec_lang['lpn_energy_total_cost']='التكلفة الإجمالية';

// ---- The Status report (ROADMAP Task 716) and the Full report (ROADMAP Task 715) --------------
// EPANET's own Report menu, Status and Full: Status lists what changed over an extended period
// simulation, in time order; Full lists every node and every link at every reporting time step.
// Both read the run's own frames (js/lpn-time.js), so neither is a second computation.
// **THE ROW SAYS "Status", NOT "Status report"** -- the Reports fly-out carries the word so no row
// has to (js/looped-network.js:4630's own rule, already followed by "EPANET run"). The box title,
// lpn_status_title, keeps the full name.
$ec_lang['lpn_reports_status']='الحالة';
$ec_lang['lpn_reports_status_tip']='ما الذي تغيّر خلال آخر محاكاة ممتدة الفترة، بترتيب زمني: فتح المضخات والصمامات أو إغلاقها، وامتلاء الصهاريج أو تفريغها أو امتلاؤها كلياً أو نفادها، والخطوات التي لم تتقارب تماماً.';
$ec_lang['lpn_status_title']='تقرير الحالة';
$ec_lang['lpn_status_needs_run']='يسرد تقرير الحالة ما تغيّر خلال محاكاة ممتدة الفترة. اضبط إجمالي زمن التشغيل في الإعدادات، الحساب، الزمن، ثم اضغط احسب، ثم افتح الماء، التقارير، تقرير الحالة.';
$ec_lang['lpn_status_empty']='لم تتغيّر حالة أي شيء خلال هذا التشغيل.';
$ec_lang['lpn_status_col_time']='الزمن';
$ec_lang['lpn_status_col_event']='الحدث';
$ec_lang['lpn_status_opened']='فُتح {type} {id}';
$ec_lang['lpn_status_closed']='أُغلق {type} {id}';
$ec_lang['lpn_status_filling']='{type} {id} يمتلئ';
$ec_lang['lpn_status_emptying']='{type} {id} يُفرَّغ';
$ec_lang['lpn_status_full']='{type} {id} ممتلئ';
$ec_lang['lpn_status_dry']='{type} {id} فارغ';
$ec_lang['lpn_status_no_converge']='لم يتقارب الحل الهيدروليكي عند هذه الخطوة تماماً؛ الأرقام المعروضة هي آخر تكرار له.';
$ec_lang['lpn_status_note']='مقروء من التشغيل الممتد الفترة نفسه الذي تقرأ منه لوحة الجداول والتقرير الكامل. يُدرَج التغيير فقط، وليس كل خطوة.';

// Same rule as Status above: the row says "Full", the box says "Full report".
$ec_lang['lpn_reports_full']='الكامل';
$ec_lang['lpn_reports_full_tip']='كل عقدة وكل رابط عند كل خطوة زمن تقرير في آخر تشغيل، كجدول واحد يمكنك تنزيله أو طباعته.';
$ec_lang['lpn_full_title']='التقرير الكامل';
$ec_lang['lpn_full_needs_run']='يسرد التقرير الكامل كل عقدة وكل رابط عند كل خطوة زمن تقرير. اضغط احسب، ثم افتح الماء، التقارير، التقرير الكامل.';
$ec_lang['lpn_full_note']='صف واحد لكل عقدة أو رابط لكل خطوة زمن تقرير، بالوحدات المعروضة في لوحة الجداول. الخلية الفارغة عمود لا تملكه تلك الكمية. يحمل التنزيل أو الطباعة كل خطوة زمنية؛ يعرض الجدول أدناه خطوة واحدة في كل مرة.';
$ec_lang['lpn_full_step_label']='خطوة الزمن';
$ec_lang['lpn_full_download_csv']='تنزيل CSV';
$ec_lang['lpn_full_print']='طباعة التقرير';
$ec_lang['lpn_full_col_time']='الزمن';
$ec_lang['lpn_full_col_type']='النوع';
$ec_lang['lpn_full_col_id']='المعرّف';
$ec_lang['lpn_full_row_count']='{n} صف.';
$ec_lang['lpn_energy_no_price']='لم يُذكر سعر للطاقة، فكل تكلفة هنا صفر. اضبط سعراً تحت الإعدادات، الطاقة.';
// The sibling of the line above, and the difference between them is the whole of Task 581: a file
// that states a price of zero is not a file that states no price, and the report must not say the
// second when the document says the first. All three EPA reference networks state zero.
$ec_lang['lpn_energy_price_zero']='تذكر هذه الشبكة سعراً قدره صفر، فكل تكلفة هنا صفر. غيّره تحت الإعدادات، الطاقة.';
$ec_lang['lpn_energy_curve_note']='تستدعي هذه المضخات منحنى كفاءة بلا نقاط: {ids}. عملت بالكفاءة المحددة للشبكة كلها.';
// The Labels lists' two narrowest column headings, which are a column three characters wide each.
// The decimals column is headed by an EXAMPLE of what it does -- and the example is translatable
// because the DECIMAL SEPARATOR is a locale fact (Tom, 2026-08-18: "We could translate to '0,000'
// where needed"), not punctuation to copy. Write your own locale's separator; keep three decimals.
// "Drop" heads the priority column (Task 445): the number says the order values and labels are
// given up in, and the term of art, Priority, lives in the heading's own tip. It replaced an icon,
// so it must stay about as short as one -- a heading that needs a wider box is the wrong word.
// 'lpn_labels_col_rank' is what it replaced, kept unrendered because "Rank" is the OLD sense.
$ec_lang['lpn_labels_col_decimals_example']='0.000';
$ec_lang['lpn_labels_col_rank']='الترتيب';
$ec_lang['lpn_labels_col_drop']='حذف';

// ---- Task 441 follow-up: the two symbology groups each carry a colour scheme -----------------
// A third sub-heading over the two controls that are about a node label and a link label alike.
// "Node and link" rather than "Both": it names the two things, which survives translation into a
// language with no single word for the pair.
$ec_lang['lpn_settings_sym_all']='العقد والوصلات';
// THE RANGE ALLOCATION MODES, which decide where one colour stops and the next begins. Named for
// what they DO to the numbers, in the vocabulary QGIS, ArcGIS and every GIS textbook already use --
// a translator should reach for their own discipline's standard term rather than a literal
// rendering. Two carry the method's own proper name in brackets (Jenks is a person); keep it.
// "Pressure" is not an algorithm at all: it is a set of thresholds out of a design standard, and it
// is offered only while pressure is the quantity being coloured.
$ec_lang['lpn_color_mode_equal']='فترات متساوية';
$ec_lang['lpn_color_mode_quantile']='الشرائح الكمية (عدد متساوٍ)';
$ec_lang['lpn_color_mode_jenks']='الفواصل الطبيعية (جينكس)';
$ec_lang['lpn_color_mode_stddev']='الانحراف المعياري';
$ec_lang['lpn_color_mode_pretty']='مقرّبة (أرقام لطيفة)';
$ec_lang['lpn_color_mode_log']='لوغاريتمي';
$ec_lang['lpn_color_mode_pressure']='الضغط';
$ec_lang['lpn_color_mode_manual']='يدوي';

// ---- LIBRARIES (ROADMAP Tasks 462 and 460) ---------------------------------------------------
// The document has carried patterns, curves and controls since Task 423; nothing on the page could
// see one. This is that interface. Tom, 2026-08-20: "for Water Networks, I think we also need the
// following in a group: Libraries (Patterns, Curves, Controls, Pumps, Pipes, Custom), Settings,
// Simulate, Transport, Time selectors."
//
// ONE NAME, THREE DOORS: the toolbar button, the Edit menu row and the box's own title all read
// this key, exactly as lpn_menu_settings serves the Settings box's three.
// Plural, because it is a shelf of them: a user opens Libraries to reach the patterns, not to reach
// "the library".
$ec_lang['lpn_library_menu']='المكتبات';
$ec_lang['lpn_library_menu_tip']='إدارة أنماط الطلب ومنحنيات المضخات وقواعد التحكم لهذا المشروع.';
// The three section names. Each is the word EPANET's own input file uses for the section, because
// that is the word every water-network user and every tutorial already has -- see the note in
// dev/scripts/glossary.json about deferring to a discipline's standard term.
$ec_lang['lpn_library_patterns']='الأنماط';
$ec_lang['lpn_library_patterns_tip']='النمط قائمة مضاعِفات تتكرر. يُطبَّق كل مضاعِف لخطوة زمنية واحدة من النمط، فتصنع 24 رقماً بخطوة ساعة واحدة يوماً يتكرر. الطلب 10 بمضاعِف 1.5 يصبح 15 في تلك اللحظة.';
$ec_lang['lpn_library_curves']='المنحنيات';
$ec_lang['lpn_library_curves_tip']='المنحنى قائمة من النقاط تصف كيف يؤدي شيء ما: كم علواً تضيفه المضخة عند كل تدفق، أو ما كفاءتها عند ذلك التدفق، أو كم علواً يفقده الصمام عند كل تدفق.';
// **CURVES IS AN EDITOR** (Task 586). It was a read-only report about pumps until the curves became
// document objects of their own, and the note said so; it now says what the box does and where a
// curve is pointed at an element from.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curves_note']='المنحنى ملك للمشروع، وتشير المضخة أو الصمام إلى المنحنى الذي تستخدمه ضمن خصائصها الخاصة. يمكن لعدة عناصر أن تستخدم المنحنى نفسه، وتغييره هنا يغيّرها كلها. بالنسبة لمنحنى علو المضخة، يستخدم التشغيل منحنى موائَماً عبر النقاط كما هو معروض؛ وبالنسبة لكل نوع آخر، يصل بين النقاط بخطوط مستقيمة كما هو معروض.';
$ec_lang['lpn_library_curve_add']='إضافة منحنى';
$ec_lang['lpn_library_curve_type_tip']='ما الذي يصفه هذا المنحنى';
// **THE HEADER READS LIKE EPANET'S OWN CURVE EDITOR** (Tom, 2026-09-05: *"Just to be parallel with
// EPANET, put pump ID (with new ID label above it) and Description on row/line 1 and Type selector
// and Equation (for pump head) on row/line 2."*). EPANET calls the control "Curve Type", so that is
// what it is called here; `lpn_library_curve_type_tip` above stays as its tip, where the longer sentence
// belongs.
$ec_lang['lpn_library_curve_type']='نوع المنحنى';
// **THE FIT, WRITTEN OUT, AND IT IS DERIVED AND STORED NOWHERE.** EPANET's curve editor prints the
// fitted equation under the type; this one prints the same thing for a pump head curve and nothing
// at all for a kind that has no equation, because a placeholder there would be a promise of an
// answer that does not exist.
$ec_lang['lpn_library_curve_equation']='المعادلة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_curve_equation_tip']='المنحنى الموائَم عبر النقاط، والخط المرسوم في الرسم البياني أدناه. يُحسب من النقاط في كل مرة يُعرض فيها ولا يُحفظ أبداً، وأرقامه بالوحدات التي يعرضها الجدول أعلاه. يعمل الحلّال المدمج على هذه المعادلة؛ أما محرك EPANET فيقرأ النقاط نفسها.';
// **NOW A GRID, SO THIS SENTENCE IS ABOUT PASTING INTO ONE** (Tom, 2026-09-05: *"The line given is
// worse than EPANET, and it really can't take a spreadsheet paste."*). Shown once under the section
// heading rather than once per curve, so it is a note and no longer a tip.
$ec_lang['lpn_library_curve_values_tip']='حدد عموداً واحداً أو عمودين في جدول بيانات، وانسخهما، والصقهما في أول خلية تريد أن يستقرا فيها. تُضاف الصفوف كلما احتيج إليها. يمكنك أيضاً لصق أسطر منسوخة مباشرة من ملف EPANET، بما في ذلك اسم المنحنى.';
// EPANET states a curve's description in the comment above its rows, and this page has read it and
// written it back since Task 586 without showing it to anybody.
$ec_lang['lpn_library_curve_note_label']='الوصف';
$ec_lang['lpn_library_curve_note_tip']='ما هو هذا المنحنى، بكلماتك الخاصة. يُكتب فوق المنحنى في ملف EPANET ويُقرأ منه مرة أخرى.';
$ec_lang['lpn_library_curve_remove_point']='إزالة هذه النقطة';
// The OUT direction of ROADMAP Task 186: two columns, tab separated, ready to paste into a
// spreadsheet. The prompt is what a browser that refuses the clipboard gets instead.
$ec_lang['lpn_library_curve_copy']='نسخ النقاط';
$ec_lang['lpn_library_curve_copy_tip']='ينسخ كل نقطة كعمودين، جاهزين للصق في جدول بيانات.';
$ec_lang['lpn_library_curve_copy_manual']='نسخ هذه النقاط';
$ec_lang['lpn_library_curve_used_by']='العناصر التي تستخدم هذا المنحنى';
$ec_lang['lpn_library_curve_unused']='لا شيء يستخدم هذا المنحنى.';
// **A CURVE IN USE IS NOT DELETED.** A junction with no pattern still has a steady demand, so
// clearing a pattern reference is harmless; a pump with no curve is a lossless connection, so the
// same gesture would quietly turn a pumped system into an open one. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_curve_in_use']='يُستخدم هذا المنحنى في {count} عناصر: {ids}. وجّهها إلى منحنى آخر أولاً، ثم احذف هذا.';
// The two column headings for a curve this page does not compute with -- a tank volume curve, or one
// a file stated that nothing here reads. Naming a quantity would be inventing one.
$ec_lang['lpn_library_curve_x']='X';
$ec_lang['lpn_library_curve_y']='Y';
// ---- THE PIPE TYPE LIBRARY (Task 465) --------------------------------------------------------
// A definition several pipes refer to for their physical properties. Bound by ID and never by name:
// a library that matches its items by LABEL re-points every reference the moment two labels collide
// (dev/pipe-library-design.md §4), so the picker shows the name and the document stores the id.
$ec_lang['lpn_library_pipetypes']='أنواع الأنابيب';
$ec_lang['lpn_library_pipetypes_tip']='نوع الأنبوب تعريف يمكن أن تستند إليه عدة أنابيب لقطرها وخشونتها ومعاملات تفاعلها. تعديل التعريف يعدّل كل أنبوب يستخدمه.';
// **WHAT A DEFINITION CONTAINS IS THE USER\'S CHOICE**, and the note has to say so: a type that
// states a roughness and no diameter is the way a real approved-materials table handles two ages of
// the same material, and it is the half of Tom\'s shape that makes the feature work.
$ec_lang['lpn_library_pipetypes_note']='لكل مشروع مكتبة أنواع أنابيب خاصة به. يمكنك ترك خصائص فارغة في تعريف نوع الأنبوب. فمثلاً، نوع أنبوب يحدد الخشونة دون القطر أمر مقبول. تُلحق أنواع الأنابيب بالأنابيب من محرر خصائصها. تعديل تعريف هنا يغيّر كل أنبوب يستند إليه.';
$ec_lang['lpn_library_pipetype_add']='إضافة نوع أنبوب';
$ec_lang['lpn_library_pipetype_blank_tip']='الخصائص الفارغة في تعريف نوع الأنبوب تُترك لتُدخَل لكل أنبوب على حدة.';
$ec_lang['lpn_library_pipetype_used_by']='الأنابيب التي تستخدم هذا النوع';
$ec_lang['lpn_library_pipetype_unused']='لا شيء يستخدم نوع الأنبوب هذا.';
// A TYPE IN USE IS NOT DELETED, for the reason the curve above is not: deleting it would change the
// diameter and the roughness of every pipe that stated it, in silence. {count} and {ids} are
// placeholders, not concatenation (Task 193).
$ec_lang['lpn_library_pipetype_in_use']='نوع الأنبوب هذا مستخدَم في {count} أنابيب: {ids}. افصله عنها قبل حذفه.';
// The pipe popup\'s own selector and the two controls beside it.
$ec_lang['lpn_field_pipetype']='نوع الأنبوب';
$ec_lang['lpn_field_pipetype_tip']='نوع الأنبوب من مكتبة المشروع الذي يستخدمه هذا الأنبوب. الخصائص المضمَّنة في نوع الأنبوب معطَّلة للتعديل هنا. افصل نوع الأنبوب لتفعيل التعديل هنا.';
$ec_lang['lpn_pipetype_none']='لم يُحدَّد نوع أنبوب';
$ec_lang['lpn_pipetype_detach']='فصل عن نوع الأنبوب';
// Edited by TGH 2026-09-07
$ec_lang['lpn_pipetype_detach_tip']='ينسخ القيم التي يقرؤها هذا الأنبوب من نوعه إلى الأنبوب نفسه ويتوقف عن استخدام النوع. لا تتغيّر قيم الأنبوب الآن، ومن الآن فصاعداً يمكنك تعديل هذه القيم هنا.';
// ---- THE FITTINGS LIBRARY (ROADMAP Task 590, dev/pipe-library-design.md §3) ----
// A pipe's minor loss is a SUM of named fittings and quantities -- Crane Technical Paper 410's
// additive-K method, which is what Bentley's Minor Loss Collection and KYPipe's SigmaM both offer.
// Bound by id like the pipe types above it, and for the same Bentley finding.
$ec_lang['lpn_library_fittings']='التجهيزات';
$ec_lang['lpn_library_fittings_tip']='قائمة التجهيزات مجموعة من التجهيزات وكمياتها يمكن أن تستند إليها عدة أنابيب. تُجمع في معامل فقد موضعي واحد.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_fittings_note']='لكل مشروع مكتبة تجهيزات خاصة به. تحتوي قائمة التجهيزات على تجهيزات لكل منها كمية، وتُجمع في معامل فقد موضعي واحد. يمكن للأنابيب وأنواع الأنابيب أن تستند إلى قائمة.';
// **WHERE THE OFFERED NUMBERS CAME FROM, STATED TO THE READER RATHER THAN ONLY IN THE SOURCE.** An
// unsourced coefficient is worse than none, because it looks authoritative; and a coefficient is a
// starting point, since the real one depends on the size and the make of the fitting. This names
// EPANET because the reader is looking at its numbers right now, which is the test that mention has
// to pass (dev/language-strings.md).
$ec_lang['lpn_library_fittings_source']='التجهيزات المعروضة هنا هي الثلاثة عشر الواردة في الجدول 3.3 من دليل مستخدم EPANET 2.2. اختيار واحد منها ينسخ معامله إلى الصف، حيث يمكنك تغييره. يعتمد المعامل على حجم التجهيزة وصانعها، فعامل الجدول نقطة بداية لا إجابة نهائية.';
$ec_lang['lpn_library_fittings_add']='إضافة قائمة تجهيزات';
$ec_lang['lpn_library_fittings_used_by']='الأنابيب التي تستخدم قائمة التجهيزات هذه';
$ec_lang['lpn_library_fittings_unused']='لا شيء يستخدم قائمة التجهيزات هذه.';
// A LIST IN USE IS NOT DELETED, for the reason a pipe type in use is not: it would change the minor
// loss of every pipe that referred to it, in silence. {count} and {ids} are placeholders (Task 193).
$ec_lang['lpn_library_fittings_in_use']='قائمة التجهيزات هذه مستخدَمة في {count} أنابيب: {ids}. افصلها عنها قبل حذفها.';
// Importing libraries out of another project file (ROADMAP Task 611). ONE WIZARD, ONE DOOR: the
// Import libraries row under File, and nothing in the Libraries box (Tom, 2026-09-18: 'Remove
// buttons except at the File menu.'). The label and its tip name no particular library, because
// the FILE decides what is on offer rather than whatever section anybody was looking at.
$ec_lang['lpn_library_import']='استيراد المكتبات…';
$ec_lang['lpn_library_import_tip']='اختر ملف مشروع آخر وانسخ مكتبات كاملة منه إلى هذا المشروع. يُتخطى ويُدرَج كل ما اسمه مستخدَم هنا بالفعل، فلا يتغيّر شيء لديك بالفعل.';
// The chooser, which is step 2 of the wizard: what the chosen file turned out to hold. The count
// beside each name is the only thing on that screen that says what the file actually has in it.
$ec_lang['lpn_library_import_choose']='اختر ما تريد نسخه من {file}';
$ec_lang['lpn_library_import_count']='{name} ({count})';
$ec_lang['lpn_library_import_note']='تُنسخ كل مكتبة تحدّدها بكاملها. احذف ما لا تريده بعد ذلك، بالطريقة نفسها التي تحذف بها أي إدخال آخر.';
$ec_lang['lpn_library_import_go']='استيراد';
$ec_lang['lpn_library_import_no_libraries']='لا يملك ملف المشروع ذلك أي مكتبات لنسخها.';
$ec_lang['lpn_library_import_heading']='مستورَد من {file}';
$ec_lang['lpn_library_import_added']='نُسخ: {names}';
$ec_lang['lpn_library_import_conflict']='تُخُطِّي، لأن هذا المشروع يملك بالفعل واحداً بالاسم نفسه: {names}. لم يتغيّر شيء هنا. أعد تسمية أحدهما واستورد مرة أخرى إذا أردت كليهما.';
// Said under ONE library's heading in the receipt, where 'these' is that library. The whole-file
// case is lpn_library_import_no_libraries above, which has no heading over it to lean on.
$ec_lang['lpn_library_import_none']='لا يملك ملف المشروع ذلك شيئاً من هذه لنسخه.';
$ec_lang['lpn_library_import_curve_shape']='وصلت هذه المنحنيات تماماً كما كتبها الملف، ولا يمكن للتشغيل استخدام أي منها حتى يرتفع عمودها الأول من كل نقطة إلى التالية: {names}';
$ec_lang['lpn_library_import_needs_fittings']='تشير أنواع الأنابيب هذه إلى قائمة تجهيزات لا يملكها هذا المشروع: {names}. استورد مكتبة التجهيزات من الملف نفسه وستجدها.';
// Said in the CHOOSER, above the Import button, and never in the receipt: it is a fact to weigh
// before importing, not a note about what has already been done. A DISCLOSURE and not an offer to
// convert, because changing a unit on this page reinterprets a typed number rather than converting
// it, and a number that came from a file is the user's. {name} is the quantity, {mine} and {theirs}
// the two unit labels, each read off this project's own unit selector.
// WORDED BY TOM, 2026-09-18, after using it: 'This is too wordy and confusing. Have mercy on the
// humans.' It opens with the word Warning and says Not recommended because he wants the
// discouragement explicit; the per-quantity lines below carry the whole of the detail. Do not
// restore the longer explanation, and do not add a convert button it would read as offering.
$ec_lang['lpn_library_import_units']='تحذير: عدم تطابق الوحدات. سيُستورد كما هو. غير مُوصى به.';
$ec_lang['lpn_library_import_units_line']='{name}: يعرض هذا المشروع {mine}، ويعرض الملف {theirs}.';
$ec_lang['lpn_fitting_qty']='الكمية';
$ec_lang['lpn_fitting_name']='التجهيزة';
$ec_lang['lpn_fitting_k']='المعامل';
$ec_lang['lpn_fitting_add']='إضافة تجهيزة';
$ec_lang['lpn_fitting_remove']='إزالة';
$ec_lang['lpn_fitting_total']='إجمالي معامل الفقد الموضعي (المحلي)، k';
// The pipe popup\'s own selector.
$ec_lang['lpn_field_fittings']='قائمة التجهيزات';
// Edited by TGH 2026-09-07
$ec_lang['lpn_field_fittings_tip']='قائمة تجهيزات من مكتبة المشروع. تُجمع كمياتها ومعاملاتها في معامل الفقد الموضعي لهذا الأنبوب، ويصبح صندوق المعامل عندئذ للقراءة فقط. اترك هذا دون تحديد لتكتب المعامل بنفسك.';
$ec_lang['lpn_fittings_none']='لم تُحدَّد قائمة تجهيزات';
// EPANET 2.2 user manual, Table 3.3, Minor Loss Coefficients for Selected Fittings. THE MANUAL\'S
// OWN THIRTEEN NAMES, in its own order. CLAUDE.md: default to the EPANET terminology, since a
// hydraulic engineer has to recognise every one of these.
$ec_lang['lpn_fitting_globe']='صمام كروي، مفتوح بالكامل';
$ec_lang['lpn_fitting_angle']='صمام زاوي، مفتوح بالكامل';
$ec_lang['lpn_fitting_swingcheck']='صمام فحص أرجوحي، مفتوح بالكامل';
$ec_lang['lpn_fitting_gate']='صمام بوابي، مفتوح بالكامل';
$ec_lang['lpn_fitting_elbow_short']='كوع قصير نصف القطر';
$ec_lang['lpn_fitting_elbow_medium']='كوع متوسط نصف القطر';
$ec_lang['lpn_fitting_elbow_long']='كوع طويل نصف القطر';
$ec_lang['lpn_fitting_elbow_45']='كوع بزاوية 45 درجة';
$ec_lang['lpn_fitting_return_bend']='منحنى رجوع مغلق';
$ec_lang['lpn_fitting_tee_run']='وصلة تي قياسية، التدفق عبر المسار المستقيم';
$ec_lang['lpn_fitting_tee_branch']='وصلة تي قياسية، التدفق عبر الفرع';
$ec_lang['lpn_fitting_entrance']='مدخل مربّع';
$ec_lang['lpn_fitting_exit']='مخرج';
// THE ONE ROW THAT IS NOT THE MANUAL\'S: a fitting the table does not carry, whose coefficient the
// user states. Without it the picker would quietly refuse every fitting nobody could source.
$ec_lang['lpn_fitting_other']='تجهيزة أخرى';
// ---- THE EXPORT ALERT (ROADMAP Task 465 slice 5) ----
// The same discipline js/lpn-inp.js applies on IMPORT, pointed the other way: report the
// difference, never drop it silently. **TWO THINGS FLATTEN AND THEY DO NOT SHARE A MESSAGE** -- a
// pipe type loses its INDIRECTION while every number still goes out byte for byte, and a fittings
// list loses its ITEMISATION while the total goes out exactly as it stood. It names EPANET because
// the reader has just asked for an EPANET file, which is the test a mention has to pass.
$ec_lang['lpn_inp_export_flat_heading']='حُفظ {file}';
$ec_lang['lpn_inp_export_flat_lead']='ملف EPANET المُصدَّر معادل رقمياً لهذا المشروع. لكن لا مكان فيه للأمور التالية:';
$ec_lang['lpn_inp_export_flat_types']='يستند {n} أنابيب هنا إلى {t} أنواع أنابيب. في الملف يحمل كل من هذه الأنابيب نسخته الخاصة من الأرقام، فالإجابات نفسها. ما لا يستطيع الملف الاحتفاظ به هو نوع الأنبوب نفسه، فتعديل تعريف واحد وجعل كل أنبوب يتبعه أمر يسجله ملف مشروعك وحده.';
$ec_lang['lpn_inp_export_flat_coords']='يحمل ملف EPANET موضعاً واحداً لكل عقدة. يضع هذا السيناريو {n} منها في مكان آخر، وتلك هي المواضع في الملف. يحتفظ كل سيناريو آخر بمواضعه الخاصة في ملف مشروعك وحده.';
$ec_lang['lpn_inp_export_flat_fittings']='لا يمكن لملف EPANET أن يحتفظ بقائمة الأكواع والصمامات ووصلات التي في ملف مشروعك. معامل الفقد الموضعي لـ{n} أنابيب هنا مجموع من قائمة تجهيزات. يدخل الإجمالي في الملف كما هو تماماً، فلا يتغيّر شيء في الإجابات.';
$ec_lang['lpn_library_controls']='القواعد';
$ec_lang['lpn_library_controls_tip']='القاعدة جملة واحدة تفتح رابطاً أو تغلقه، أو تعطيه إعداداً، عندما يقول منسوب ماء أو ضغط أو وقت بذلك.';
// A verb and its object, not a bare "Add": a bare imperative is the hardest kind of string to
// translate well, and there are two of these buttons a few centimetres apart.
$ec_lang['lpn_library_pattern_add']='إضافة نمط';
$ec_lang['lpn_library_pattern_values']='المضاعِفات';
$ec_lang['lpn_library_pattern_values_tip']='المضاعِفات، مفصولة بمسافات أو فواصل. الصق عموداً من جدول بيانات إن توفّر لديك. تتكرر القائمة طوال مدة التشغيل، فلا حاجة لأن تغطي التشغيل كله.';
// {n} values, {step} apart, covering {span}. Placeholders rather than three joined fragments
// (Task 193): the order of the three differs by language and a sandwich cannot express that.
$ec_lang['lpn_library_pattern_span']='{n} مضاعِفاً، تفصل بينها {step}، تغطي {span}';
$ec_lang['lpn_library_pattern_none']='لا يوجد نمط';
$ec_lang['lpn_settings_default_pattern']='نمط الطلب الافتراضي';
$ec_lang['lpn_settings_default_pattern_tip']='كل ملتقى بلا نمط يستخدم هذا النمط.';
$ec_lang['lpn_library_control_add']='إضافة قاعدة';
// THE KEYWORDS IN THE EXAMPLES ARE NOT TRANSLATED and must be left exactly as they are: LINK,
// OPEN, CLOSED, IF, NODE, ABOVE, BELOW, AT, TIME and CLOCKTIME are what the reader types into the
// box, and the page reads back only those words. Translate the sentence around them.
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_control_tip']='جملة واحدة، بالكلمات التي يستخدمها EPANET. أربعة أشكال: LINK 9 OPEN IF NODE 2 BELOW 110، وLINK 9 CLOSED IF NODE 2 ABOVE 140، وLINK 10 OPEN AT TIME 1، وLINK 12 CLOSED AT CLOCKTIME 3 AM. بدلاً من OPEN أو CLOSED يمكنك كتابة رقم، وهو إعداد صمام أو سرعة مضخة. اترك الكلمات المفتاحية بالإنجليزية؛ فهي ما تقرؤه الصفحة.';
$ec_lang['lpn_library_control_ok']='✓ مفهومة';
$ec_lang['lpn_library_control_bad']='⚠ غير مفهومة';
$ec_lang['lpn_library_control_missing']='⚠ لا يوجد في هذه الشبكة أي شيء اسمه {id}';
$ec_lang['lpn_library_rules']='القواعد';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rules_tip']='القاعدة فقرة قصيرة تفتح رابطاً أو تغلقه، أو تعطيه إعداداً، عندما يصل منسوب ماء أو ضغط أو تدفق أو وقت إلى قيمة تحددها. يمكن للقواعد أن تختبر أكثر من شيء في آن واحد، وأن تقول ما يجب فعله عند فشل الاختبار.';
$ec_lang['lpn_library_rule_add']='إضافة قاعدة';
// Edited by TGH 2026-09-07
$ec_lang['lpn_library_rule_tip']='قاعدة واحدة، بالكلمات التي يستخدمها EPANET، جملة واحدة في كل سطر. يسمّيها سطر أول: RULE 1. ثم شرط: IF TANK 2 LEVEL BELOW 17.1. ثم ما يجب فعله حياله: THEN PUMP 9 STATUS IS OPEN. قد يرتّبها سطر أخير: PRIORITY 1. أضف أسطر AND أو OR لاختبار أكثر من شيء، وأسطر ELSE لبيان ما يُفعل عند فشل الاختبار. يمكن للشرط أن يقرأ LEVEL أو HEAD أو GRADE أو PRESSURE أو DEMAND عند عقدة، أو FLOW أو STATUS أو SETTING عند وصلة، أو TIME وCLOCKTIME عند SYSTEM. اكتب الأرقام بالوحدات التي يعرضها هذا المشروع؛ فهي تُحوَّل لك. اترك الكلمات المفتاحية بالإنجليزية؛ فهي ما تقرؤه الصفحة وEPANET.';
$ec_lang['lpn_library_rule_ok']='✓ قُرئت هذه القاعدة';
$ec_lang['lpn_library_rule_bad']='⚠ تعذّرت قراءة هذه القاعدة';
$ec_lang['lpn_library_rule_missing']='⚠ لا يوجد في هذه الشبكة شيء يُسمى {id}';
// PER JUNCTION, so it is in the property popup and not in this box -- the Settings rule ("if it is
// for the entire project it is in Settings") drawn on its other side. Without it a pattern you
// author can only be used by making it the default one, which is not what a library is for.
// TWO DIFFERENT QUANTITIES, and the page shows both (Tom, 2026-08-25). The BASE demand is the
// number the user typed or the file stated; the DEMAND is that number with its pattern applied at
// the moment on the clock, which is what the pipes around the node actually carry. Reading Net3's
// junctions as "Demand" while the pipes carried 1.34 times as much made a labelling defect look
// like a solver defect. 'Demand' itself stays bpn_demand -- the concept-level label reuse this page
// already makes for it.
$ec_lang['lpn_field_base_demand']='الطلب الأساسي';
// **REWORDED BY TOM, 2026-08-27**, for demand categories (Task 468): a junction's base demand is a
// LIST now, so "the base demand multiplied by its pattern" was true only of a one-category
// junction. The first sentence is his wording verbatim; the second is the one that was already
// there and is untouched, because it says the other thing this tip exists for -- that the number
// is a RESULT and not a field. The key has never been translated, so the reword cost nothing.
$ec_lang['lpn_result_demand_tip']='التدفق الذي تسحبه هذه العقدة عند الخطوة الزمنية المعروضة: كل طلب أساسي مضروباً في نمطه الخاص، مجموعة معاً. إنه محسوب لا مكتوب، فيتغيّر مع الساعة ولا يمكن تحريره.';
$ec_lang['lpn_field_demand_pattern']='نمط الطلب';
$ec_lang['lpn_field_demand_pattern_tip']='كيف يرتفع طلب هذا الملتقى وينخفض خلال التشغيل. اتركه عند لا يوجد نمط ليتبع الملتقى نمط الطلب الافتراضي للمشروع بدلاً منه.';
// A JUNCTION’S DEMAND IS A LIST (Task 468). The PATTERN says what KIND of user this is
// (“residential”); the CATEGORY says WHO it is (“Elm Acres”). Nothing validates a category and there
// is no list to choose one from, which is why the tip describes it rather than instructing.
$ec_lang['lpn_field_demand_category']='الوصف';
$ec_lang['lpn_field_demand_category_tip']='اسم أو وصف فئة الطلب هذه.';
$ec_lang['lpn_demand_add']='إضافة فئة طلب';
$ec_lang['lpn_demand_add_tip']='أضف فئة طلب أخرى عند هذا الملتقى، بطلبها الأساسي ونمطها ووصفها الخاص. تُجمع الفئات معاً.';
$ec_lang['lpn_demand_remove']='إزالة هذا الطلب';
// A RESERVOIR AND A PUMP TAKE A PATTERN TOO, on the same rule: whole-project settings live in the
// Libraries box, one asset’s own choice lives in its property popup.
$ec_lang['lpn_field_head_pattern']='نمط المنسوب';
$ec_lang['lpn_field_head_pattern_tip']='كيف يرتفع منسوب ماء هذا الخزان وينخفض خلال التشغيل. يُضرب المنسوب أعلاه في النمط.';
$ec_lang['lpn_field_pump_speed']='السرعة النسبية';
$ec_lang['lpn_field_pump_speed_tip']='1 تعني أن هذه المضخة تدور بالسرعة التي قيس عندها منحناها. 0.9 تعني أن المضخة نفسها تدور أبطأ، مما يخفّض المنسوب الذي تضيفه والتدفق الذي تمرّره. يحلّ نمط السرعة محل هذا الرقم أثناء سير التشغيل.';
$ec_lang['lpn_field_speed_pattern']='نمط السرعة';
$ec_lang['lpn_field_speed_pattern_tip']='كيف ترتفع سرعة هذه المضخة وتنخفض خلال التشغيل. كل مضاعِف هو السرعة النسبية لذلك الجزء من التشغيل، ويحلّ محل إعداد السرعة بدلاً من أن يُطبَّق عليه، فالمضاعِف صفر يوقف المضخة.';

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
$ec_lang['lpn_search_menu']='البحث عن مكان بالاسم…';
// Edited by TGH 2026-09-07
$ec_lang['lpn_search_tip']='ابحث عن بلدة أو شارع أو معلَم بالاسم وانقل الخريطة إليه. يطلب أول استخدام إذنك، لأن الكلمات التي تكتبها تُرسل إلى خدمة أسماء الأماكن التابعة لـOpenStreetMap.';
$ec_lang['lpn_search_bar']='البحث بالاسم…';
// The four paragraphs of the ask: what is sent and to whom; why this is a separate question from
// the map pictures; the question itself; and what a no costs (nothing).
$ec_lang['lpn_search_consent_1']='البحث باسم المكان يرسل الكلمات التي تكتبها إلى nominatim.openstreetmap.org، خدمة أسماء الأماكن المجانية التابعة لمؤسسة OpenStreetMap.';
$ec_lang['lpn_search_consent_2']='هذه خدمة مختلفة عن صور خريطة الشوارع خلف مشروعك. الصور تقول فقط أين تنظر. البحث يقول ماذا كتبت. ستتلقى خدمة أسماء الأماكن كلمات بحثك وعنوان IP الخاص بك. لا نرسل شيئاً آخر، ولا نحتفظ بأي سجل لعمليات بحثك.';
$ec_lang['lpn_search_consent_3']='هل تسمح لنا بإرسال عمليات بحثك إلى خدمة أسماء الأماكن؟';
$ec_lang['lpn_search_consent_4']='إذا قلت لا، يستمر كل شيء آخر في هذه الصفحة في العمل تماماً كما هو الآن، بما في ذلك الانتقال إلى خط عرض وخط طول. نتذكّر إجابة نعم حتى لا نحتاج إلى السؤال مرة أخرى. أما لا فلا تُخزَّن على الإطلاق.';
$ec_lang['lpn_search_refused']='البحث بأسماء الأماكن معطّل، ولم يُرسل شيء. لا يزال بإمكانك استخدام الانتقال إلى خط عرض وخط طول.';
$ec_lang['lpn_search_prompt']='ابحث عن مكان بالاسم. بلدة أو شارع أو معلَم — على سبيل المثال: Petaluma, California';
$ec_lang['lpn_search_empty']='اكتب اسم مكان للبحث عنه.';
$ec_lang['lpn_search_working']='جارٍ البحث…';
$ec_lang['lpn_search_busy']='يوجد بحث قيد التشغيل بالفعل. انتظر حتى يُجيب.';
$ec_lang['lpn_search_choose']='هناك أكثر من مكان مطابق. أيهم؟';
$ec_lang['lpn_search_nochoice']='لم يُختر شيء، فلم تتحرك الخريطة.';
$ec_lang['lpn_search_badchoice']='هذا ليس أحد الأرقام في القائمة.';
$ec_lang['lpn_search_none']='لم يُعثر على شيء بهذا الاسم.';
// Five different failures, five different next actions. Keep them distinct in translation too --
// "search failed" for all five is exactly what this set exists to avoid.
$ec_lang['lpn_search_rate']='تطلب خدمة أسماء الأماكن منا أن نبطئ. انتظر دقيقة وحاول مرة أخرى.';
$ec_lang['lpn_search_http']='أجابت خدمة أسماء الأماكن بخطأ.';
$ec_lang['lpn_search_timeout']='لم تُجب خدمة أسماء الأماكن في الوقت المحدد. كل شيء آخر في هذه الصفحة يعمل بدونها.';
$ec_lang['lpn_search_unreadable']='أجابت خدمة أسماء الأماكن بشيء تعذّر على هذه الصفحة قراءته.';
$ec_lang['lpn_search_offline']='تعذّر الوصول إلى خدمة أسماء الأماكن. قد تكون غير متصل بالإنترنت. كل شيء آخر في هذه الصفحة يعمل بدونها، بما في ذلك الانتقال إلى خط عرض وخط طول.';
$ec_lang['lpn_search_toofast']='بحث واحد في الثانية — هذا ما تسمح به خدمة أسماء الأماكن. حاول مرة أخرى بعد لحظة.';
$ec_lang['lpn_search_nofetch']='لا يستطيع هذا المتصفح الوصول إلى خدمة أسماء الأماكن.';
// Shown three times -- the menu tip, the confirm and the result notice -- so that the three cannot
// drift into three different claims about the same data. One sentence, translated once.
$ec_lang['lpn_terrain_accuracy']='يجمع Mapbox هذا من مجموعات بيانات ارتفاع عامة كثيرة، لذا تعتمد جودته كلياً على مكانك. حيث يوجد مسح ليدار وطني، مثل USGS 3DEP في معظم الولايات المتحدة ونظائره في أماكن أخرى، يمكن أن يكون أدق من متر أفقياً وبضعة أعشار من المتر رأسياً. حيث لا توجد إلا بيانات عالمية، فهو نحو 30 م أفقياً وعدة أمتار رأسياً. لا يخبرنا Mapbox أياً منهما حصلت عليه. تعامل معه كخريطة كنتورية، لا كمسح ميداني: تحقّق من أي شيء تعتمد عليه.';
$ec_lang['lpn_terrain_consent_1']='ملء المناسيب يرسل موضع كل عقدة تحتاج منسوباً — خط عرضها وخط طولها — إلى api.mapbox.com، للاستعلام عن ارتفاع الأرض هناك.';
$ec_lang['lpn_terrain_consent_2']='هذا سؤال مختلف عن صور الخريطة خلف مشروعك. الصور تقول فقط أين تنظر. هذه المواضع هي شبكتك نفسها. ستتلقى Mapbox هذه الإحداثيات وعنوان IP الخاص بك. لا نرسل شيئاً آخر: لا اسماً ولا أنابيب ولا مشروعاً. لا نحتفظ بأي سجل لذلك، ولا يُخزَّن شيء على هذا الجهاز سوى إجابتك عن هذا السؤال.';
$ec_lang['lpn_terrain_consent_3']='هل تسمح لنا بإرسال مواضع عقدك إلى Mapbox؟';
$ec_lang['lpn_terrain_consent_4']='إذا قلت لا، يستمر كل شيء آخر في هذه الصفحة في العمل تماماً كما هو الآن، ويمكنك كتابة المناسيب بنفسك كما كنت تفعل. نتذكّر إجابة نعم حتى لا نحتاج إلى السؤال مرة أخرى. أما لا فلا تُخزَّن على الإطلاق.';
$ec_lang['lpn_terrain_refused']='لم تُملأ المناسيب، ولم يُرسل شيء. يمكنك كتابتها كما كنت تفعل.';
// {n} is a whole number, {k} a whole number, {v} an elevation with its unit, {m} and {f} whole
// numbers. Substituted, never concatenated.
$ec_lang['lpn_terrain_confirm']='هل تريد ملء منسوب {n} عقدة (عقد) من Mapbox DEM؟';
$ec_lang['lpn_terrain_confirm_default_1']='تملك كل عقدة منسوباً بالفعل، ولا يزال {n} منها عند {v}، وهو المنسوب الذي تبدأ به العقدة الجديدة وليس منسوباً كتبته أنت.';
$ec_lang['lpn_terrain_confirm_default_2']='هل تريد استبدال منسوب تلك الـ{n} عقدة بقيم من Mapbox DEM؟';
$ec_lang['lpn_terrain_keep']='{k} عقدة (عقد) تملك منسوباً بالفعل ولن تُمس.';
$ec_lang['lpn_terrain_undo']='تراجع واحد (Ctrl-Z) يعيدها جميعاً كما كانت.';
$ec_lang['lpn_terrain_requests']='{n} طلب (طلبات) إلى api.mapbox.com.';
$ec_lang['lpn_terrain_busy']='يجري ملء المناسيب بالفعل. انتظرها.';
$ec_lang['lpn_terrain_offmap']='مواضع هذه العقد ليست على خريطة التضاريس، فلم يُرسل شيء.';
$ec_lang['lpn_terrain_too_wide']='تنتشر هذه العقد على مساحة واسعة جداً من الأرض لقراءتها دفعة واحدة ({n} طلب بلاطة). لم يُرسل شيء.';
$ec_lang['lpn_terrain_cancelled']='لم يتغيّر شيء ولم يُرسل شيء.';
$ec_lang['lpn_terrain_nofetch']='لا يستطيع هذا المتصفح الوصول إلى خدمة التضاريس.';
$ec_lang['lpn_terrain_working']='جارٍ قراءة سطح الأرض…';
// {status} is a number the service sent back, such as 403.
$ec_lang['lpn_terrain_denied']='رفضت خدمة التضاريس الطلب ({status})، فلم يتغيّر أي منسوب. قد لا يسمح رمز Mapbox الذي يستخدمه هذا الموقع بعنوان الويب الذي أنت عليه.';
$ec_lang['lpn_terrain_failed']='تعذّر الوصول إلى خدمة التضاريس، فلم يتغيّر أي منسوب. قد تكون غير متصل بالإنترنت. كل شيء آخر في هذه الصفحة يعمل بدونها.';
// A 429 is the service asking us to slow down. It is not a refusal and not a lost network, so it
// gets its own sentence: the same request works in a minute.
$ec_lang['lpn_terrain_rate_limited']='تطلب خدمة التضاريس منا أن نبطئ (429)، فلم يتغيّر أي منسوب. حاول مرة أخرى خلال دقيقة.';
// Any other status the service sent back. {status} is that number.
$ec_lang['lpn_terrain_http']='أجابت خدمة التضاريس بخطأ ({status})، فلم يتغيّر أي منسوب. لا شيء خاطئ في شبكتك.';
// Said when the nodes asked about have no position on the Earth at all, which is what a projected
// project reports when this page has no transform for its coordinate system.
$ec_lang['lpn_terrain_no_place']='لا تملك أي من تلك العُقَد موضعاً على الأرض، فلم يُرسَل شيء ولم يتغيّر أي منسوب. تحتاج قراءة سطح الأرض إلى مشروع بخط عرض وخط طول، أو مشروع على إسقاط يمكن لهذه الصفحة وضعه.';
$ec_lang['lpn_terrain_done']='{n} منسوباً (مناسيب) تم ملؤها.';
$ec_lang['lpn_terrain_missed']='تعذّرت قراءة {m}، ولا تزال فارغة.';
$ec_lang['lpn_terrain_partial']='{f} بلاطة تضاريس (بلاطات) لم تُجب.';
$ec_lang['lpn_terrain_will_ids']='ستحصل هذه العقد على منسوب: {ids}';
$ec_lang['lpn_terrain_keep_ids']='تلك العقد هي: {ids}';
$ec_lang['lpn_terrain_filled_ids']='حصلت هذه العقد على منسوب: {ids}';
$ec_lang['lpn_terrain_blank_ids']='لا تزال هذه العقد بلا منسوب: {ids}';
$ec_lang['lpn_terrain_ids_more']='{ids}، و{n} أخرى';

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
$ec_lang['lpn_ff_menu']='تحليل تدفق الحريق…';
$ec_lang['lpn_ff_menu_tip']='اختبر الملتقيات واحداً تلو الآخر: كم يستطيع كل منها أن يوصّل مع الحفاظ على الضغط المتبقي الذي حددته، وهل يؤدي سحب التدفق المطلوب هناك إلى دفع أي شيء آخر خارج حدوده؟';
$ec_lang['lpn_ff_title']='تحليل تدفق الحريق';
$ec_lang['lpn_ff_intro']='يُطلب من كل ملتقى بالتناوب سحب تدفق حريق إضافة إلى الطلب الذي يحمله بالفعل. لا يتغيّر أي شيء في مشروعك؛ يُجرى التشغيل بأكمله على نسخة.';
$ec_lang['lpn_ff_scope']='الملتقيات المراد اختبارها';
$ec_lang['lpn_ff_scope_tip']='اختر المجموعة قبل التشغيل. اختبار كل ملتقى في نظام كبير قد يستغرق دقائق.';
$ec_lang['lpn_ff_scope_all']='كل ملتقى';
$ec_lang['lpn_ff_scope_selected']='الملتقى المحدد فقط';
$ec_lang['lpn_ff_no_junctions']='لا يحتوي هذا المشروع على ملتقيات بعد، فلا يوجد ما يُختبر.';
$ec_lang['lpn_ff_no_selection']='لا يوجد ملتقى محدد. اختر واحداً على الخريطة، أو اختبر كل ملتقى.';
$ec_lang['lpn_ff_skipped']='{n} عنصراً محدَّداً ليست ملتقيات، فلم تُختبر.';
$ec_lang['lpn_ff_required']='تدفق الحريق المطلوب';
$ec_lang['lpn_ff_required_tip']='التدفق الذي يشترطه كود الحريق لديك أو جهة الإطفاء عند الحنفية. يُختبر كل ملتقى مقابل هذا الرقم ما لم يحمل تدفق حريق مطلوباً خاصاً به.';
$ec_lang['lpn_ff_required_own']='تُختبر الملتقيات التي تحمل تدفق حريق مطلوباً خاصاً بها مقابل ذلك التدفق بدلاً منه. عددها: {n}.';
$ec_lang['lpn_ff_required_node_tip']='تدفق الحريق المطلوب عند هذا الملتقى تحديداً لاستخدام الأرض الذي يخدمه، حسب كود الحريق لديك أو جهة الإطفاء. اتركه فارغاً ليُختبر الملتقى مقابل الرقم في مربع تحليل تدفق الحريق.';
$ec_lang['lpn_ff_residual']='الضغط المتبقي الواجب الحفاظ عليه';
$ec_lang['lpn_ff_residual_tip']='الضغط الذي يجب أن يحافظ عليه الملتقى أثناء توصيل تدفق الحريق. يستخدم كل من AWWA M31 و NFPA 291 قيمة 20 psi (140 kPa).';
$ec_lang['lpn_ff_design']='فحص التصميم (الأثر على النظام)';
$ec_lang['lpn_ff_design_tip']='سؤال منفصل عن قدرة الملتقى على توصيل التدفق: مع سحب ذلك التدفق هناك، هل ينخفض أي شيء آخر دون حده الأدنى للضغط أو يتجاوز حد سرعته؟ اختيار فحص هذا لا يكلّف حساباً إضافياً.';
$ec_lang['lpn_ff_design_off']='عدم الفحص';
$ec_lang['lpn_ff_design_all']='كل الملتقيات الأخرى وكل الأنابيب';


$ec_lang['lpn_ff_minpressure']='أدنى ضغط مسموح به في أي مكان آخر';
$ec_lang['lpn_ff_minpressure_tip']='يُبلَّغ عن أي ملتقى ينخفض دون هذا الحد بينما يسحب ملتقى آخر تدفق حريقه على أنه مشكلة تصميم.';
$ec_lang['lpn_ff_maxvelocity']='أقصى سرعة مسموح بها';
$ec_lang['lpn_ff_maxvelocity_tip']='يُبلَّغ عن أي أنبوب يعمل فوق هذا الحد أثناء سحب تدفق حريق على أنه مشكلة تصميم.';
// HOW HYDRANT LOSSES ARE ACCOUNTED FOR, STATED IN THE INTERFACE rather than left to be assumed
// (Tom, 2026-08-25: "I want to be very explicit and transparent... about how we account if at all
// for hydrant losses beyond the node."). IT LEADS WITH THE METHOD, NOT WITH THE ABSENCE: Tom read
// the first wording as "no losses are accounted for at the raw node", which is a hole in the tool
// rather than the deliberate and standard choice it actually is.
$ec_lang['lpn_ff_accounting']='يُسحب تدفق الحريق عند الملتقى نفسه. هذه هي الطريقة المستخدمة هنا، وهي الطريقة المعتادة. لا تُنمذَج الحنفية ولا أنبوبها الجانبي ولا فوهتها، فتوصّل الحنفية الحقيقية أقل من التدفق المعروض هنا.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_native']='يُحسب هذا بالحلّال المدمج.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_epanet']='يُحسب هذا بمحرك EPANET.';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_engine_cost']='التدفق المتاح للحريق عملية بحث، فتُحل الشبكة بأكملها نحو ست عشرة مرة لكل ملتقى يُختبر. يستغرق نظام كبير دقائق. يمكنك إيقافه في أي وقت والاحتفاظ بما حُسب بالفعل.';
// The one-condition sentence. Shown only where this project has a run clock, because that is the
// only place a reader could reasonably expect a fire flow to follow it.
//
// IT ENDS AT "maximum day demand". The old tail, "and read as a single steady condition", said the
// first sentence over again in other words -- Tom: "I don't know what this means. Are we just
// repeating what we said above?" It was. What the practice half carries that the first sentence
// does not is the DEMAND the fire flow is added to, and that survives.
$ec_lang['lpn_ff_steady']='تُختبر فقط الخطوة الزمنية المعروضة الآن على الشاشة. يُختبر تدفق الحريق عادة إضافة إلى طلب أقصى يوم، لذا اضبط الشبكة على تلك الحالة قبل التشغيل.';
// THE RUN HAS A DIALOG OF ITS OWN (Tom, 2026-08-30: "The run progress bar is so important that all
// applications put it in a new dialog with nothing but the progress, a stop button, and maybe some
// other progress stats."). It says how far along it is and never how long is left: per-solve cost
// RISES through a run, so a time left over would be optimistic and get worse as the run went on.
$ec_lang['lpn_ff_run_title']='تشغيل تدفق الحريق';
$ec_lang['lpn_ff_calculate']='تشغيل';
$ec_lang['lpn_ff_stop']='إيقاف';
$ec_lang['lpn_ff_working']='جارٍ العمل: {done} من {total} ملتقى.';
$ec_lang['lpn_ff_stopped']='توقف بعد {done} من {total} ملتقى. النتائج أدناه هي التي انتهت بالفعل.';
$ec_lang['lpn_ff_cost']='حلّ هذا التشغيل الشبكة بأكملها {solves} مرة.';
// The results are about the network as it stood when the run finished. Opening a different network
// still clears them; an edit to THIS one no longer does (Tom, 2026-09-21) -- the user decides when
// to look at fresh rings, with the Clear button below for whenever they want to do it themselves.
$ec_lang['lpn_ff_stale']='تغيّر الرسم، فمُسحت نتائج تدفق الحريق. شغّله مرة أخرى.';
// Clears the rings on purpose -- the reader's own decision, not news the page has to break to them.
$ec_lang['lpn_ff_clear']='مسح الحلقات';
// **COUNTED THE SAME WAY THE ROWS ARE READ, or the summary contradicts the table above it.** The
// two failure modes are independent -- a junction can miss its fire flow AND pull its neighbours
// down -- so these three do not add up to the number of junctions, and that is correct rather than
// a rounding slip. Said as three separate facts for that reason.
$ec_lang['lpn_ff_summary']='{clean} ملتقى لم يكن فيه خلل. {fire} ملتقى فشل في تدفق الحريق. {design} ملتقى أثّر في بقية النظام.';
$ec_lang['lpn_ff_summary_error']='تعذّرت الإجابة عن {n} ملتقى.';
// ONE WIDE TABLE, NOT TWO REPORTS (Tom, 2026-08-30, with a competitor's own table in front of him:
// "Normally they are kind of wide and they include the information from both tables in one table.")
// One run has always produced one result set holding both answers per junction, so two headings
// were this page showing its own architecture rather than the answer.
//
// THE HEADINGS ARE OURS, NOT THE COMPETITOR'S. Every column below is the MEANING of one of theirs
// written in this page's own words, and each is kept as narrow as the meaning allows: column width
// is king, and mid-word wrap is cheaper than a wide column.
$ec_lang['lpn_ff_report_all']='كل ملتقى اختُبر';
$ec_lang['lpn_ff_col_junction']='الملتقى';
$ec_lang['lpn_ff_col_static']='الضغط الساكن';
// Edited by TGH 2026-09-07
$ec_lang['lpn_ff_col_static_tip']='الضغط عند هذا الملتقى قبل سحب أي تدفق حريق، مع استمرار طلبات النظام الاعتيادية. لا يُغلق شيء لقياسه، فهذا ليس ضغطاً عند تدفق صفري للنظام؛ إنه الضغط نفسه الذي تظهره الخريطة عند هذا الملتقى. يسمّي كل من AWWA M31 وNFPA 291 هذه القراءة الضغط الساكن، وهي حيث يبدأ اختبار تدفق الحريق.';
$ec_lang['lpn_ff_col_available']='التدفق المتاح';
$ec_lang['lpn_ff_col_required']='التدفق المطلوب';
$ec_lang['lpn_ff_col_residual']='المتبقي المحفوظ';
$ec_lang['lpn_ff_col_atrequired']='الضغط عند المطلوب';
$ec_lang['lpn_ff_col_affected']='أسوأ أثر';
$ec_lang['lpn_ff_col_limit']='حد التصميم';
// **THE CELL THAT SAYS THE QUESTION WAS NEVER ASKED.** A junction that cannot deliver the required
// flow is never checked for what it would pull down, because the design question is not asked at a
// flow that cannot be drawn (js/lpn-fireflow.js). That cell used to print the same dash a PASSING
// junction prints, where the dash means "checked, and nothing was pulled down" -- good news drawn
// as no news.
$ec_lang['lpn_ff_not_checked']='لم يُفحص';
// **THE CELL FOR A JUNCTION THAT FAILED BEFORE THE TEST BEGAN.** If the residual is already unmet
// with nothing drawn, no fire flow test is run at all -- there is no available flow, no residual at
// it and no pressure at the required flow, because none of those was ever measured. A dash said
// that in a way nobody could read. Tom, 2026-09-02: *"I agree that a word or two is better."*
$ec_lang['lpn_ff_static_failed']='فشل الضغط الساكن، فلم يُفحص';
// **THE LAST COLUMN NAMES WHAT WENT WRONG RATHER THAN GRADING THE JUNCTION** (Tom, 2026-09-02:
// *"What if we call it Failure modes and it can have two words, Fire and Design?"*). The two are
// independent: a junction can fail to deliver its fire flow AND pull its neighbours down, and the
// old single verdict could only name one of them.
$ec_lang['lpn_ff_col_modes']='أنماط الفشل';
$ec_lang['lpn_ff_mode_fire']='الحريق';
$ec_lang['lpn_ff_mode_design']='التصميم';
// Nothing went wrong. A word, not a blank: a blank in this column would read as "not tested".
$ec_lang['lpn_ff_mode_none']='بلا';
$ec_lang['lpn_ff_col_solves']='الحلول';
// Which criterion the junction broke while drawing the required flow. A junction that broke nothing
// shows a dash, never one of these words.
$ec_lang['lpn_ff_limit_pressure']='الضغط';
$ec_lang['lpn_ff_limit_velocity']='السرعة';
$ec_lang['lpn_ff_limit_both']='الضغط والسرعة';
$ec_lang['lpn_ff_atleast']='أكثر من {flow}';
$ec_lang['lpn_ff_affect_node']='{id} ينخفض إلى {pressure}';
$ec_lang['lpn_ff_affect_link']='{id} يصل إلى {velocity}';
$ec_lang['lpn_ff_more']='و{n} أخرى متأثرة';
// Split from `lpn_ff_more` 2026-09-02 (Task 573 Wave 0). One string counted affected assets in
// the Worst effect cell and undisplayed junctions under the table; a gendered language must
// agree with one noun and would have been wrong at the other call site.
$ec_lang['lpn_ff_rows_more']='{n} ملتقى إضافي غير معروض.';
$ec_lang['lpn_ff_design_none']='لم يتجاوز أي شيء في المجموعة المختارة حدوده أثناء سحب أي ملتقى تدفق حريقه.';
$ec_lang['lpn_ff_design_off_note']='لم يُفحص الأثر على بقية النظام في هذا التشغيل.';
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
$ec_lang['lpn_ff_iso']='يمنح مكتب خدمات التأمين (ISO) الحنفية الواحدة حداً أقصى قدره {flow}. لم يُطبَّق حد الاعتماد هذا هنا لأننا لا نعرف كم حنفية قد تمثّلها العقدة.';
// Every way a junction can fail to produce a number is named. None of them is ever shown as a flow
// of zero: "there is no available fire flow" and "the available fire flow is zero" are different
// facts, and only the first one is ever true.
$ec_lang['lpn_ff_err_at_rest']='دون الضغط المتبقي بالفعل قبل سحب أي تدفق حريق';
$ec_lang['lpn_ff_err_converge']='لم تتقارب الشبكة.';
$ec_lang['lpn_ff_err_solve']='أبلغ الحلّال عن خطأ ولم يقدّم إجابة.';
$ec_lang['lpn_ff_err_not_junction']='ليس ملتقى';
$ec_lang['lpn_ff_err_unknown']='لا إجابة. الرمز المبلَّغ عنه هو {code}.';

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
$ec_lang['lpn_file_import_survey']='استيراد نقاط مساحية…';
$ec_lang['lpn_file_import_survey_tip']='اقرأ قائمة نقاط مساحية من ملف نصي واصنع ملتقى واحداً عند كل نقطة، آخذاً إعدادات العنصر الجديد لكل ما لا يذكره الملف. لا تُرسم أنابيب، ولا يُسقَط أي صف أبداً دون تسميته. يقرأ نظام الإحداثيات الذي يستخدمه هذا المشروع بالفعل، مُسنداً جغرافياً أو لا.';
$ec_lang['lpn_survey_read_error']='تعذّرت قراءة ذلك الملف من قرصك.';
$ec_lang['lpn_survey_cancelled']='لم يُنشَأ شيء ولم يتغيّر شيء.';
// What the project calls its two axes, for a sentence js/lpn-survey.js writes about a column. The
// page's own axisNames() answers this for a project that is open; these two are the fallback for a
// reading done before there is one, and they are the surveyor's own words rather than the map's.
$ec_lang['lpn_survey_axis_north']='الإحداثي الشمالي';
$ec_lang['lpn_survey_axis_east']='الإحداثي الشرقي';
// A column in a file that states no names of its own. Counted from 1, the way a spreadsheet does.
$ec_lang['lpn_survey_err_empty']='لا يحتوي ذلك الملف على شيء.';
$ec_lang['lpn_survey_err_unreadable']='تعذّرت قراءة ذلك الملف كقائمة نقاط مساحية.';
$ec_lang['lpn_survey_err_ambiguous_coord']='قد يكون أكثر من عمود في ذلك الملف هو {axis} ({detail})، ولن تختار هذه الصفحة بينها. اترك واحداً منها مسمّى باسم {axis} وحاول مرة أخرى.';
$ec_lang['lpn_survey_err_no_points']='لم يُقرَأ ولا صف واحد من ذلك الملف كنقطة مساحية. الصفوف المقروءة: {detail}';
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
$ec_lang['lpn_survey_format_label']='تنسيق الملف:';
$ec_lang['lpn_survey_format_internal']='محدَّد داخلياً';
$ec_lang['lpn_survey_create']='إنشاء عُقَد';
// Which of the two answered for THIS file, said out loud, so the reader can see that a header beat
// the chooser rather than taking it on trust.
$ec_lang['lpn_survey_note_header_unread']='تُخُطِّي السطر الأول: فهو لا يسمّي أي أعمدة تعرفها هذه الصفحة.';
$ec_lang['lpn_survey_type_label']='نوع العنصر:';
$ec_lang['lpn_survey_confirm_junction']='وُجد {n} ملتقى (ملتقيات). هل تريد المتابعة؟';
$ec_lang['lpn_survey_confirm_reservoir']='وُجد {n} خزان (خزانات). هل تريد المتابعة؟';
$ec_lang['lpn_survey_confirm_tank']='وُجد {n} صهريج (صهاريج). هل تريد المتابعة؟';
$ec_lang['lpn_survey_report_junction']='استُورد {n} ملتقى (ملتقيات)، منها {m} بمنسوب.';
$ec_lang['lpn_survey_report_reservoir']='استُورد {n} خزان (خزانات)، منها {m} بمنسوب.';
$ec_lang['lpn_survey_report_tank']='استُورد {n} صهريج (صهاريج)، منها {m} بمنسوب.';
$ec_lang['lpn_survey_report_clean']='وصلت كل نقطة في الملف، ولم يتغيّر شيء أثناء الاستيراد.';
$ec_lang['lpn_survey_report_notes']='أخطاء الاستيراد وملاحظاته:';
$ec_lang['lpn_survey_sev_error']='خطأ';
$ec_lang['lpn_survey_sev_warning']='تحذير';
$ec_lang['lpn_survey_note_line']='السطر {line}: {sev}: {code}: {text}';
$ec_lang['lpn_survey_note_row_short']='أعمدة أقل مما يلزم لتنسيق الملف أعلاه.';
$ec_lang['lpn_survey_note_coord_missing']='خلية {axis} فارغة.';
$ec_lang['lpn_survey_note_bad_coord']='لا يُقرَأ {axis} كرقم.';
$ec_lang['lpn_survey_note_coord_range']='{axis} خارج النطاق الذي يسمح به هذا المشروع.';
$ec_lang['lpn_survey_note_bad_elev']='منسوب غير رقمي. استُورد بلا منسوب.';
$ec_lang['lpn_survey_note_ambiguous_elev']='قد يكون أكثر من عمود هو المنسوب، فلم يُقرَأ أي منها.';
$ec_lang['lpn_survey_note_blank_rows']='سطور فارغة جرى تخطّيها: {detail}.';
$ec_lang['lpn_survey_note_id_duplicate']='الاسم مستخدَم بالفعل سابقاً في هذا الملف، عُيِّن اسم جديد.';
$ec_lang['lpn_survey_note_id_taken']='الاسم موجود بالفعل في المشروع، عُيِّن اسم جديد.';
$ec_lang['lpn_survey_note_id_invalid']='لا يمكن استخدام هذا الاسم هنا، عُيِّن اسم جديد.';
