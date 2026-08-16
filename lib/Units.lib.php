<?php
/**
 *
 * UNIT FAMILIES AND PRESETS (ROADMAP Task 162, phase 1)
 * -----------------------------------------------------
 *
 * A page field names a FAMILY instead of listing units inline:
 *
 *     'units' => 'distance_small'      // was Array('m','mm','ft','in')
 *
 * A family carries two things: the option list a user may pick from, and the
 * identity a preset keys on. Presets ($ec_unit_sets) then map family => unit.
 *
 * WHY THIS REPLACED FLAT UNIT SETS. The old sets named one unit per quantity and
 * were applied by matching TRANSLATED LABEL TEXT across every <select> at once.
 * That produced two defects: later entries overwrote earlier ones (the 'in' set
 * selected psi, then inH2O overwrote it on every head field), and every length
 * field got the same unit, so a 1,000 ft main rendered as 12,000 in.
 *
 * WHEN TO SPLIT A FAMILY. Split when two fields need different DEFAULTS, or when
 * they need different OPTION LISTS. distance_small and distance_medium offer the
 * identical four units and exist purely to carry different defaults -- merging
 * them would re-create the 12,000-inch defect, because one family can only name
 * one default. Where two families share a list, share the PHP variable below
 * rather than duplicating it.
 *
 * Full design record and the per-field rationale: dev/unit-families.md
 */

// Shared option lists. A family below either names one of these or spells out its own.
$u_distance      = Array('m', 'mm', 'ft', 'in');
$u_head_pressure = Array('mh2o', 'mmh2o', 'kpa', 'bar', 'kgfcm2', 'fth2o', 'inh2o', 'psi');
$u_water_column  = Array('mh2o', 'mmh2o', 'fth2o', 'inh2o');
$u_flow          = Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd');
$u_fraction      = Array('depthFrac', 'depthPercent');

$ec_unit_families = Array(
    // --- Distance. Three families, by the scale of the thing being measured. ---
    'distance_small'   => $u_distance,                          // pipe diameter, roughness, rock size
    'distance_medium'  => $u_distance,                          // pipe/channel length, depths, elevations
    'distance_site'    => Array('m', 'ft'),                      // canal & penstock length, gross head
    // Absolute roughness height is conventionally quoted in FEET in US practice
    // (0.0005 ft commercial steel), not inches -- hence its own family rather than
    // distance_small. Same option list; different default. That is the rule at work.
    'roughness'        => $u_distance,

    // --- Head and pressure. ---
    // total_head deliberately offers water-column units ONLY: an EGL or HGL is an
    // elevation, and psi there is close to meaningless (Tom, 2026-07-28).
    'total_head'       => $u_water_column,                      // EGL, HGL
    'partial_head'     => $u_head_pressure,                     // h_f, h_m, h_L, and required/supply pressures
    // Velocity head is an energy height, read in feet even where the losses beside
    // it are read in psi -- so it shares partial_head's full option list and differs
    // only in its default. Splitting on the default, not the options (Tom, 2026-07-28).
    'velocity_head'    => $u_head_pressure,                     // h_v

    // --- Flow. Split by what the calculator is for, because US practice differs:
    // waterlines are quoted in gpm, storm drains and channels in cfs. ---
    'flow_pipe'        => $u_flow,                              // pressure waterline
    'flow_channel'     => $u_flow,                              // storm drain, culvert, open channel, structures
    'flow_canal'       => Array('m3ps', 'lps', 'ft3ps'),
    'flow_turbine'     => Array('lps', 'm3ps', 'ft3ps', 'gpm'),
    'flow_emitter'     => Array('lph', 'gph'),
    'flow_supply'      => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd', 'lph', 'gph'),
    'flow_node'        => Array('lps', 'm3ps', 'gpm', 'ft3ps', 'lph', 'gph'),
    'flow_total'       => Array('lps', 'm3ps', 'gpm', 'ft3ps', 'mld', 'mgd', 'lph', 'gph'),

    // --- Everything else. ---
    'flow_area'        => Array('m2', 'mm2', 'ft2', 'in2'),
    'land_area'        => Array('m2', 'ft2'),
    'velocity'         => Array('mps', 'ftps'),
    'slope'            => Array('grade', 'gradePercent'),
    // Same two options as 'slope', different DEFAULT (ROADMAP Task 177, lpn_'s head loss
    // gradient) -- per CLAUDE.md's unit-family rule, a family splits on a differing DEFAULT, not
    // differing options. mpf_/mphl_'s friction slope defaults to raw grade (ft/ft) and formats it
    // to 4 decimals in its own JS; lpn_'s generic 2-decimal-everywhere label formatter would show
    // a typical small pipe gradient (e.g. 0.0036) as "0.00" at that precision, so it needs
    // gradePercent (0.36) as its default instead, without changing mpf_/mphl_'s own default.
    'gradient'         => Array('grade', 'gradePercent'),
    'stress'           => Array('npm2', 'psf'),
    'volume'           => Array('m3', 'ft3', 'acft'),
    'unit_discharge'   => Array('m2ps', 'ft2ps'),
    'application_rate' => Array('mmph', 'inph'),
    'power'            => Array('kw', 'mw', 'hp'),
    'energy'           => Array('kwh_yr', 'mwh_yr'),
    'fraction'         => $u_fraction,                          // shown as a ratio by default (y/d0)
    'percentage'       => $u_fraction,                          // shown as a percent by default (% loss, efficiency)
);

/**
 * Presets: family => unit. Every family must appear in every preset; a missing
 * entry means that preset silently leaves the field alone, which is the class of
 * bug this design exists to remove. echoUnitSelect() checks this at render time.
 */
$ec_unit_sets = Array();

$ec_unit_sets['us'] = Array(
    'distance_small'   => 'in',
    'distance_medium'  => 'ft',
    'distance_site'    => 'ft',
    'roughness'        => 'ft',
    'total_head'       => 'fth2o',
    'partial_head'     => 'psi',
    'velocity_head'    => 'fth2o',
    'flow_pipe'        => 'gpm',
    'flow_channel'     => 'ft3ps',
    'flow_canal'       => 'ft3ps',
    'flow_turbine'     => 'gpm',
    'flow_emitter'     => 'gph',
    'flow_supply'      => 'gpm',
    'flow_node'        => 'gpm',
    'flow_total'       => 'gpm',
    'flow_area'        => 'ft2',
    'land_area'        => 'ft2',
    'velocity'         => 'ftps',
    'slope'            => 'grade',
    'gradient'         => 'gradePercent',
    'stress'           => 'psf',
    'volume'           => 'ft3',
    'unit_discharge'   => 'ft2ps',
    'application_rate' => 'inph',
    'power'            => 'kw',
    'energy'           => 'kwh_yr',
    'fraction'         => 'depthFrac',
    'percentage'       => 'depthPercent',
);

$ec_unit_sets['si'] = Array(
    'distance_small'   => 'mm',
    'distance_medium'  => 'm',
    'distance_site'    => 'm',
    'roughness'        => 'mm',
    'total_head'       => 'mh2o',
    'partial_head'     => 'mh2o',
    'velocity_head'    => 'mh2o',
    'flow_pipe'        => 'lps',
    'flow_channel'     => 'm3ps',
    'flow_canal'       => 'm3ps',
    'flow_turbine'     => 'lps',
    'flow_emitter'     => 'lph',
    'flow_supply'      => 'lps',
    'flow_node'        => 'lps',
    'flow_total'       => 'lps',
    'flow_area'        => 'm2',
    'land_area'        => 'm2',
    'velocity'         => 'mps',
    'slope'            => 'grade',
    'gradient'         => 'gradePercent',
    'stress'           => 'npm2',
    'volume'           => 'm3',
    'unit_discharge'   => 'm2ps',
    'application_rate' => 'mmph',
    'power'            => 'kw',
    'energy'           => 'kwh_yr',
    'fraction'         => 'depthFrac',
    'percentage'       => 'depthPercent',
);

/**
 * Which preset a first-time visitor sees, chosen by their language (ROADMAP Task 165,
 * Tom 2026-07-28).
 *
 * English gets US customary; every other language gets SI. Rationale: measured
 * per-language human reach is en 83%, es 10%, then a <=1% tail, and the English
 * audience is dominated by US municipal/storm-drain work that is quoted in inches,
 * feet, cfs, gpm and psi -- while essentially every other language in the suite is
 * spoken where SI is the working system. A single global default had to be wrong for
 * one of those two groups.
 *
 * KNOWN LIMITATION: "English" is not "United States". A visitor in the UK, Australia,
 * India, Ireland, New Zealand, Nigeria or South Africa works in SI but reads English,
 * and lands on US units. Refining this would mean reading the region subtag from
 * Accept-Language (en-GB vs en-US) rather than the app's normalised two-letter code;
 * deliberately not done here, because the two-letter code is what the whole language
 * system is built on and one exception to that is worse than one imperfect default.
 * Such visitors get a correct page, one click from right.
 *
 * Returning visitors are unaffected either way: the cookie stores each select's option
 * VALUE (the conversion factor), not its index or its label.
 */
define('EC_DEFAULT_UNIT_SET', (isset($clanguage) && $clanguage === 'en') ? 'us' : 'si');

/**
 * CONVERSION FACTORS
 *
 * The value of each unit is the number of that unit in the standard SI unit for
 * that quantity. Multiply an SI value by it to DISPLAY; divide to STORE.
 *
 * EVERY FACTOR BELOW IS DERIVED FROM THE EXACT DEFINITIONS, AT FULL DOUBLE
 * PRECISION -- never from a rounded intermediate. dev/scripts/unit_factor_check.php
 * re-derives all of them from these same definitions and fails the build on any
 * disagreement, so this comment is checked rather than merely asserted.
 *
 * WHICH FOOT, AND WHY IT IS NOT THE SURVEY FOOT (Tom, 2026-08-16). The INTERNATIONAL
 * foot, 0.3048 m exactly since 1959, is the right one and the choice is deliberate.
 * The US SURVEY foot is 1200/3937 m = 0.30480060960122 m, 2 ppm larger, and NIST/NGS
 * retired it for new work at the end of 2022. It survives only in state plane
 * coordinates and land surveying -- i.e. in COORDINATES, never in a pipe diameter, a
 * flow or a pressure head, which are international feet everywhere including EPANET's
 * own MperFT = 0.3048. It cannot arise here at all, because lpn_ has no georeferencing:
 * dev/looped-network-calculator-scope.md rules out coordinate reference systems,
 * reprojection and datum handling outright. If georeferenced import is ever built, this
 * is the paragraph to come back to -- it is the one place the survey foot could enter.
 *
 * WE DO NOT COPY EPANET'S CONSTANTS, and it is worth saying why, because "follow
 * EPANET" is otherwise the obvious instinct. EPANET is not more precise than we were --
 * its types.h carries 5-significant-figure constants of its own (GPMperCFS 448.831
 * against an exact 448.83116883, PSIperFT 0.4333 against 0.4335275), so adopting them
 * would import their rounding AND re-break internal coherence, since their gpm and
 * their ft imply different feet. Exact is also independent of which EPANET version we
 * happen to vendor. This costs us nothing at the interop seam: an .inp round trip is
 * made lossless by passing the file's own number through when the display unit already
 * matches, not by any choice of constant -- exact factors do NOT round-trip in doubles
 * (150 * 0.3048 * (1/0.3048) === 149.99999999999997).
 *
 * The exact definitions used:
 *     1 ft   = 0.3048 m                (exact, international foot)
 *     1 in   = 0.0254 m                (exact)
 *     1 gal  = 3.785411784 L           (exact, US liquid gallon)
 *     1 lbf  = 4.4482216152605 N       (exact)
 *     1 acre = 43560 ft^2              (exact)
 *     1 hp   = 745.6998715822702 W     (mechanical horsepower, 550 ft.lbf/s)
 *     1 m H2O = 1000 * EngCalcs.G Pa   (see the pressure note below)
 *
 * WHY FULL PRECISION MATTERS, since a round trip in ONE unit hides the problem.
 * 1000 gpm stored and redisplayed is 1000 gpm whatever the factor is. The damage
 * is cross-unit: a length in ft, an area in ft^2 and a velocity in ft/s computed
 * from independently-rounded factors stop tying out in the 5th digit; acft at 3
 * significant figures was wrong by 354 ppm, which shows in the 4th DISPLAYED digit;
 * and EPANET uses exact factors, so our .inp import/export and the
 * validate_epanet.js engine comparison drifted against it -- a spurious mismatch,
 * or worse a real one masked. The suite previously contained FOUR different feet
 * (ft 3.2808, ft3ps 3.280788, ft3 3.280841, ft2 3.280854); ft3 and ft3ps are the
 * same conversion and were 47 ppm apart.
 *
 * PRESSURE USES THE SUITE'S OWN g, NOT 9.80665. A metre of water column is
 * converted with EngCalcs.G = 9.806 (js/Calculators.lib.js -- the single definition
 * of standard gravity for the whole suite, deliberately 9.806). So pa, kpa, npm2,
 * bar, psf and psi are ALL derived from 1 m H2O = 1000 * 9.806 = 9806 Pa and agree
 * with one another exactly. Do not "correct" these to 9.80665 in isolation: that
 * would put the PHP display factors and the JS physics on two different gravities,
 * which is worse than either constant on its own.
 */
$ec_units['m']=1;
$ec_units['mm']=1000;
$ec_units['ft']=3.280839895013123;              // 1/0.3048
$ec_units['in']=39.370078740157480;             // 1/0.0254

$ec_units['mps']=1;
$ec_units['ftps']=3.280839895013123;            // 1/0.3048

$ec_units['m3ps']=1;
$ec_units['lps']=1000;
$ec_units['ft3ps']=35.314666721488585;          // 1/0.3048^3
$ec_units['gpm']=15850.323141488905;            // 60/0.003785411784
$ec_units['mgd']=22.824465323744022;            // 86400/(1e6*0.003785411784)
$ec_units['mld']=86.4;                          // 86400/1000 -- exact

$ec_units['m2']=1;
$ec_units['mm2']=1000000;
$ec_units['ft2']=10.763910416709722;            // 1/0.3048^2
$ec_units['in2']=1550.0031000062002;            // 1/0.0254^2

$ec_units['m3']=1;
$ec_units['ft3']=35.314666721488585;            // 1/0.3048^3 -- same conversion as ft3ps
$ec_units['acft']=0.00081071319378991241;       // 1/(43560*0.3048^3)

$ec_units['mh2o']=1;
$ec_units['mmh2o']=1000;
$ec_units['fth2o']=3.280839895013123;           // 1/0.3048
$ec_units['inh2o']=39.370078740157480;          // 1/0.0254
// The six below all come from 1 m H2O = 1000 * 9.806 Pa = 9806 Pa exactly.
$ec_units['pa']=9806;                           // 1000*9.806
$ec_units['kpa']=9.806;                         // 9806/1000
$ec_units['npm2']=9806;                         // N/m^2 is Pa
$ec_units['bar']=0.09806;                       // 9806/1e5
$ec_units['psf']=204.80256809027017;            // 9806/(4.4482216152605/0.3048^2)
$ec_units['psi']=1.4222400561824318;            // 9806/(4.4482216152605/0.0254^2)
// DELIBERATE EXCEPTION, not a rounding slip (Task 134). Exactly, 1 kgf/cm2 =
// 98066.5 Pa = 10.00068 m H2O against our g, so the exact factor would be
// 0.099993372. The unit exists ONLY as the Asian field convention "1 kgf/cm2 =
// 10 m of water", and a user reading a 10 m head expects 1.00 -- so the round
// number IS the unit as it is used. Cost: 66 ppm against the exact definition,
// invisible at every digit the suite displays. Named in unit_factor_check.php's
// exception list with this reason; never widen a tolerance to swallow it.
$ec_units['kgfcm2']=0.1;

$ec_units['grade']=1;
$ec_units['gradePercent']=100;

$ec_units['depthFrac']=1;
$ec_units['depthPercent']=100;

$ec_units['kw']=0.001;
$ec_units['mw']=0.000001;
$ec_units['hp']=0.0013410220895950279;          // 1/745.6998715822702

$ec_units['kwh_yr']=1.0;
$ec_units['mwh_yr']=0.001;

$ec_units['lph']=3600000;                       // L/hr per m3/s -- exact
$ec_units['gph']=951019.38848933426;            // 3600/0.003785411784
$ec_units['mmph']=3600000;                      // mm/hr per m/s -- exact
$ec_units['inph']=141732.28346456692;           // 3600/0.0254

$ec_units['m2ps']=1;                            // m2/s (unit discharge, SI base)
$ec_units['ft2ps']=10.763910416709722;          // 1/0.3048^2 -- same conversion as ft2