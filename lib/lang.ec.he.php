<?php

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
$ec_lang['and']="and";
$ec_lang['area']="area";
$ec_lang['bottom']="bottom";
$ec_lang['calculate']="calculate";
$ec_lang['calculator']="calculator";
$ec_lang['calculators']="$ec_lang[calculator]s";
$ec_lang['channel']="channel";
$ec_lang['coefficient']="coefficient";
$ec_lang['contents']="contents";
$ec_lang['crest']="crest";
$ec_lang['cumulative']="cumulative";
$ec_lang['depth']="depth";
$ec_lang['diameter']="diameter";
$ec_lang['engineering']="engineering";
$ec_lang['engineers']="engineers";
$ec_lang['feet']="feet";
$ec_lang['flow']="flow";
$ec_lang['formula']="formula";
$ec_lang['full']="full";
$ec_lang['freeOnline']="free online";
$ec_lang['given']="given";
$ec_lang['head']="head";
$ec_lang['headwater']="headwater";
$ec_lang['height']="height";
$ec_lang['horizontal']="horizontal";
$ec_lang['hydraulic']="hydraulic";
$ec_lang['hydraulics']="hydraulics";
$ec_lang['incremental']="incremental";
$ec_lang['irregular']="irregular";
$ec_lang['length']="length";
$ec_lang['loss']="loss";
$ec_lang['manning']="Manning";
$ec_lang['measurement']="measurements";
$ec_lang['of']="of";
$ec_lang['or']="or";
$ec_lang['pipe']="pipe";
$ec_lang['points']="points";
$ec_lang['ponding']="ponding";
$ec_lang['pressure']="pressure";
$ec_lang['radius']="radius";
$ec_lang['ratio']="ratio";
$ec_lang['results']="results";
$ec_lang['roughness']="roughness";
$ec_lang['save']="save";
$ec_lang['side']="side";
$ec_lang['slope']="slope";
$ec_lang['system']="system";
$ec_lang['to']="to";
$ec_lang['trapezoidal']="trapezoidal";
$ec_lang['uniform']="uniform";
$ec_lang['variable']="variable";
$ec_lang['velocity']="velocity";
$ec_lang['vertical']="vertical";
$ec_lang['weir']="weir";
$ec_lang['wettedperimeter']="wetted perimeter";
$ec_lang['width']="width";

// Units
// Necessary for calculator units selectors
$ec_lang['u_ft']="ft";
$ec_lang['u_ft2']="ft^2";
$ec_lang['u_ftps']="ft/sec";
$ec_lang['u_ft3ps']="cfs";
$ec_lang['u_gpm']="gpm";
$ec_lang['u_in']="inches";
$ec_lang['u_in2']="sq. in.";
$ec_lang['u_lps']="l/s";
$ec_lang['u_m']="m";
$ec_lang['u_m2']="m^2";
$ec_lang['u_mgd']="MGD";
$ec_lang['u_mps']="m/s";
$ec_lang['u_m3ph']="m^3/hr";
$ec_lang['u_m3ps']="m^3/s";
$ec_lang['u_mm']="mm";
$ec_lang['u_mm2']="mm^2";
$ec_lang['u_mph']="miles/hr";
$ec_lang['u_npm2']="N/m^2";
$ec_lang['u_pa']="Pa";
$ec_lang['u_kpa']="kPa";
$ec_lang['u_mh2o']="m H2O";
$ec_lang['u_mmh2o']="mm H2O";
$ec_lang['u_psf']="psf";
$ec_lang['u_psi']="psi";
$ec_lang['u_fth2o']="ft H2O";
$ec_lang['u_inh2o']="in H2O";
$ec_lang['u_s']="sec";
$ec_lang['u_grade']="rise/run";
$ec_lang['u_gradePercent']='% rise/run';
$ec_lang['u_depthFrac']="fraction";
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
$ec_lang['bottomWidth']="$ec_lang[bottom] $ec_lang[width]";
$ec_lang['channelSlope']="$ec_lang[channel] $ec_lang[slope]";
$ec_lang['flowCalculator']="$ec_lang[flow] $ec_lang[calculator]";
$ec_lang['flowDepth']="$ec_lang[flow] $ec_lang[depth]";
$ec_lang['frictionLoss']="Friction loss";
$ec_lang['junctionLoss']="Junction loss";
$ec_lang['totalLoss']="totalLoss";
$ec_lang['manningFormula']="$ec_lang[manning] $ec_lang[formula]";
$ec_lang['sideSlope1']="$ec_lang[side] $ec_lang[slope] 1 (horiz./vert.)";
$ec_lang['sideSlope2']="$ec_lang[side] $ec_lang[slope] 2 (horiz./vert.)";

// Page text
// Note: In the process of rearranging the language variables into page order for easier maintenance.
$ec_lang['menu_main_list']=ec_title("List of $ec_lang[calculators]");
$ec_lang['menu_main_hydraulics']=ucfirst("$ec_lang[hydraulics]");
$ec_lang['menu_main_language']=ucfirst("language");
$ec_lang['menu_sub1_manning']=ec_title("$ec_lang[manning] $ec_lang[formula]");
$ec_lang['template_translation_help']="האם אתה יכול לעזור לי לתרגם את המחשבון לשפה שלך או להטמיע את המחשבון באתר שלך?  ";
$ec_lang['template_feedback']="בבקשה תן לנו את חוות דעתך. האם המחשבון החינמי עלה על כל ציפיותיך?";
$ec_lang['template_printable_title']='אזור כותרת להדפסה';
$ec_lang['template_printable_subtitle']='אזור כותרת משנה להדפסה';
$ec_lang['index_title']=ec_title("$ec_lang[freeOnline] $ec_lang[engineering] $ec_lang[calculators]");
$ec_lang['mpf_main_menu']=ec_title("$ec_lang[manning] $ec_lang[pipe] $ec_lang[flow]");
$ec_lang['mpf_main_title']=ec_title("$ec_lang[freeOnline] $ec_lang[mpf_main_menu] $ec_lang[calculator]");
$ec_lang['mpf_main_desc']=ec_title("$ec_lang[manningFormula] $ec_lang[uniform] $ec_lang[pipe] $ec_lang[flow] at $ec_lang[given] $ec_lang[slope] $ec_lang[and] $ec_lang[depth]");
$ec_lang['calc_set_units']='הגדרת יחידות';
$ec_lang['calc_results']='תוצאות:';
$ec_lang['mpf_pipe_diameter']='קוטר הצינור';
$ec_lang['mpf_manningRoughness']='מקדם מאנינג';
$ec_lang['mpf_friction_slope']='<a target="_blank" href="../pressureslope.php">שיפוע התעלה (יתכן כי שווה לשיפוע הצינור)</a>';
$ec_lang['mpf_depth_ratio']='אחוז של (או היחס) עומק מלא (100% או 1 אם זרימה מלאה)';
$ec_lang['mpf_flow']='ספיקה';
$ec_lang['mpf_velocity']='מהירות';
$ec_lang['mpf_velocity_head']='עומד הידראולי';
$ec_lang['mpf_flow_area']='חתך הזרימה';
$ec_lang['mpf_wetted_perimeter']='ההיקף הרטוב';
$ec_lang['mpf_hydraulic_radius']='רדיוס הידראולי';
$ec_lang['mpf_top_width']='רוחב פני הנוזל';
$ec_lang['mpf_froude_number']='מספר פראוד';
$ec_lang['mpf_shear_stress']='מאמץ גזירה (כושר דחיפה)';
$ec_lang['mphl_main_menu']=ec_title("$ec_lang[manning] $ec_lang[pipe] $ec_lang[head] $ec_lang[loss]");
$ec_lang['mphl_main_title']=ec_title("$ec_lang[freeOnline] $ec_lang[manning] $ec_lang[pipe] $ec_lang[head] $ec_lang[loss] $ec_lang[calculator]");
$ec_lang['mphl_main_desc']=ec_title("$ec_lang[manningFormula] $ec_lang[head] $ec_lang[loss] at $ec_lang[given] $ec_lang[full] $ec_lang[flow]");
$ec_lang['mphl_pipe_length']="אורך הצינור,l";
$ec_lang['mphl_total_junction_k']="חישוב סך כל מקדמי ההפסדים בצומת, k";
$ec_lang['mphl_friction_loss']="הפסד חיכוך";
$ec_lang['mphl_junction_loss']="הפסד בצומת";
$ec_lang['mphl_total_loss'] = 'סהכ הפסד';
$ec_lang['mtc_menu']=ec_title("$ec_lang[manningFormula] $ec_lang[trapezoidal] $ec_lang[channel]");
$ec_lang['mtc_main_title']=ec_title("$ec_lang[freeOnline] $ec_lang[mtc_menu] $ec_lang[calculator]");
$ec_lang['mtc_main_desc']=ec_title("$ec_lang[manningFormula] $ec_lang[uniform] $ec_lang[trapezoidal] $ec_lang[channel] $ec_lang[flow] at $ec_lang[given] $ec_lang[slope] $ec_lang[and] $ec_lang[depth]");
$ec_lang['mtc_bottom_width']=ucfirst("$ec_lang[bottomWidth]");
$ec_lang['mtc_side_slope_1']="צד השיפוע 1 (אופקי\אנכי)";
$ec_lang['mtc_side_slope_2']= "צד השיפוע 2 (אופקי\אנכי)";
$ec_lang['mtc_channel_slope']="שיפוע התעלה";
$ec_lang['mtc_flow_depth']="עומק הספיקה";
$ec_lang['mtc_d50_bottom']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required bottom angular riprap size, D50, Maricopa County</span>';
$ec_lang['mtc_d50_mra']='Required angular riprap size, D50, per Maynord, Ruff, and Abt (1989)';
$ec_lang['mtc_d50_searcy']='Required angular riprap size, D50, per Searcy (1967)';
$ec_lang['mtc_d50_strickler']='<span title="per Strickler (Adjust n so this equals your design lining size)">Implied riprap size based on n</span>';
$ec_lang['mtc_d50_z1']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 1 angular riprap size, D50, Maricopa County</span>';
$ec_lang['mtc_d50_z2']='<span title="per Isbash (1936), Robinson, and Maricopa County, Arizona, US">Required side slope 2 angular riprap size, D50, Maricopa County</span>';
$ec_lang['rrc_main_menu']="Robinson Rock Chute";
$ec_lang['rrc_main_desc']="Robinson Rock Chute Design Spreadsheet";
$ec_lang['ws_main_menu']='Weir Flow Simple';
$ec_lang['ws_main_title']='Simple Broad-crested Weir Flow Calculator';
$ec_lang['ws_main_desc']='Simple Broad-crested Weir Flow Calculator';
$ec_lang['ws_weirLength']='Weir length, l';
$ec_lang['ws_headWaterHeight']='Headwater height, h';
$ec_lang['ws_weirCoefficient']='Weir coefficient, Cw';
$ec_lang['ws_notes_heading']='Notes';
$ec_lang['ws_notes_we_term']='Weir Equation';
$ec_lang['wi_menu']='Weir Flow Irregular';
$ec_lang['wi_main_title']='Free Online Segmented, Variable Depth, Irregular Broad-crested Weir Flow Calculator';
$ec_lang['wi_main_desc']='Irregular Broad-crested Weir Flow Calculator';
$ec_lang['wi_headWaterelevation']='Headwater elevation';
$ec_lang['wi_weirPoints']='Weir points';
$ec_lang['wi_station']='Station';
$ec_lang['wi_elevation']='Elevation';
$ec_lang['wi_pondingHeight']='Ponding Height';
$ec_lang['wi_incrementalFlow']='Incremental Flow';
$ec_lang['wi_cumulativeFlow']='Cumulative Flow';
$ec_lang['wi_save_and_calculate']='Save and Calculate';
$ec_lang['wi_or_adjust']="or";
$ec_lang['wi_n_rows']="the number of rows";
$ec_lang['wi_notes']='Notes';
$ec_lang['wi_notes_we_term']='Weir Equation';
$ec_lang['wi_notes_we_def']='q = if (length = 0) then 0 else if (slope=0) then cw*length*d0<sup>1.5</sup> else cw/(2.5*slope) * (d0<sup>2.5</sup> - d1<sup>2.5</sup>) where d1 and d0 are always positive or zero';
$ec_lang['contact_title']="HawsEDC Contact";
$ec_lang['contactSendMessage']='Send Tom Haws a message';
$ec_lang['contactYourName']='Your name:';
$ec_lang['contactYourEmail']='Your e-mail address:';
$ec_lang['contactSubject']='Subject:';
$ec_lang['contact_message']='Message:';
$ec_lang['contactSpamPrefix']='Five plus one equals';
$ec_lang['contactSpamPostfix']='(Please spell it out. 1=one 2=two 3=three 4=four 5=five 6=six 7=seven +=plus 5+1=6)';
$ec_lang['contactSubmitButton']='Submit Message';
?>
