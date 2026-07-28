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