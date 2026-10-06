# GeoJSON export (Task 728, export half)

Tom, 2026-10-06, approving Mary's order (`dev/agents/market-researcher/gis-plugins.md` section 6):
GeoJSON out first; shapefile and GeoJSON import behind one mapping step come later. Writer:
`js/lpn-geojson.js` (`EngCalcs.lpnExportGeoJson`, pure). Page: File > Export GeoJSON file…, directly
under Export EPANET file…, in `js/looped-network.js` (`exportGeoJsonFile`). Harness:
`dev/lpn-spike/geojson-export-harness.js`.

## Rules

- **One FeatureCollection, RFC 7946** (rfc-editor.org/rfc/rfc7946): positions `[longitude, latitude]`
  in WGS 84 (section 4), a pipe is a LineString of start node, vertices, end node (section 3.1.4).
  No `crs` member (RFC 7946 removed it), no Polygon, no altitude.
- **A geographic project is exported as stored.** Its numbers already are longitude and latitude, so
  nothing is converted and each unedited coordinate goes out as the exact characters the user typed
  (`-122.50` stays `-122.50`; JSON allows trailing zeros). A token that is not legal JSON (`.1`,
  `5.`, `+3`) is written as the plain rendering of the same value. The rule is the suite's raw-token
  rule, through `EngCalcs.lpnNumText`.
- **A projected project with a known CRS** (state plane etc.) is converted by the page's own
  transform (`EngCalcs.lpnCrsInverse`; proj4 with no datum shift) and `lwn.coordinates` says so.
  These are numbers of ours, not the user's. **A NAD83 system such as State Plane is treated as WGS
  84**, which agrees to under a metre in North America. The page loads the definition table before
  asking (`exportGeoJsonResult`); a code with no definition is refused as `crs` ("not known to this
  page", with Convert as…), and a position the transform cannot place as `range`.
- **A local (XY) project is refused**, never written with a non-standard `crs` member. Reasons: a
  file claiming a coordinate system it does not have puts the network somewhere false, in the
  one program (a GIS) whose whole job is to say where things are; a `crs` member is not GeoJSON
  any more, so QGIS or ArcGIS would read it as WGS 84 anyway; and the fix costs the user one
  command. The message says why and what to do: georeference first (Map, World map, Attach).
- **Values are in the project's own units, exactly as typed. Not SI, not converted to WNTR's.**
  Each feature names them in `units` (field to unit NAME: `ft`, `in`, `gpm`, `fth2o`, `psi`; the
  stored name, never a factor or a translated symbol), and `lwn.units` carries the whole set. Roughness
  has no unit under Hazen-Williams; `lwn.headloss_formula` is `H-W`, `D-W` or `C-M` (Gusnet's
  `HeadlossFormula`). Gusnet reads a layer in the units of its flow unit (EPANET's convention:
  traditional for gpm, cfs, mgd; SI for L/s and the metric flows). Mapping to that choice:
  a US project (ft, in, gpm, psi, ft/s, ft of head) matches Gusnet traditional except
  **Darcy-Weisbach roughness** (ours ft, Gusnet 0.001 ft) and **unit_headloss** (ours percent or the
  gradient unit named in `units`, Gusnet ft per 1000 ft). An SI project matches Gusnet SI (m, mm, L/s,
  m/s) except **pressure** where the project uses kPa or bar rather than m of water, **roughness**
  under Darcy-Weisbach (ours m or mm as named) and **unit_headloss** (Gusnet m per km). Always read
  `units`; this file never silently converts.
- **Patterns and curves are written in Gusnet's meaning** (`gusnet/pattern_curve.py`, read
  2026-10-06). Gusnet parses `demand_pattern`, `head_pattern`, `speed_pattern` as the multipliers,
  space separated (`"1 1.2 0.8"`), and `pump_curve`, `vol_curve`, `headloss_curve` as points
  (`"(0, 104), (2000, 92)"`, `ast.literal_eval`, x strictly increasing). So those fields carry the
  numbers, from the project's own patterns and curves, each multiplier as the exact characters typed
  (a curve point as the plain rendering of its number: the project keeps no text for one), and the
  name goes in the WNTR-style `demand_pattern_name`, `head_pattern_name`, `speed_pattern_name`,
  `pump_curve_name`, `vol_curve_name`, `headloss_curve_name`. A junction with no pattern of its own
  gets the project's default pattern, resolved, because that is what EPANET applies. Writing the
  name in the Gusnet field would be read as a one-multiplier pattern (name `3` triples the demand).
- **Tank `min_vol` is 0**, the `.inp` writer's own value; this page does not hold it. With a volume
  curve EPANET takes the minimum volume from the curve. Gusnet requires the field.
- **Results are rounded to 6 significant figures** (they are ours, with float noise in the tail;
  typed inputs are never rounded). A pump's `headloss` is as the map shows it; **EPANET and WNTR
  report a pump's headloss as negative** (a gain). `lwn.unit_note`, `headloss_sign` and
  `result_precision` say all this inside the file.
- **Results are the ones on the screen**, read through `colorNodeValue` / `colorLinkValue` (the map
  colouring's own values, in the Results strip's units). Absent when nothing is solved. Every
  feature carries `has_results`, and `lwn.results` says included or not, and for a time-stepped
  frame the time of day in seconds. A Recalculate-off snapshot is exported as it stands.
- **The scenario on screen is what is written** (as the `.inp` writer does); `lwn.scenario` names
  it. An element a scenario switched off is omitted; so is a link whose end node is.
- **Custom properties** travel under their own key as the typed text.
- **Not exported**: emitter coefficient (no display unit here), patterns, curves' points, controls,
  rules, customers, labels, backdrop. A shapefile or `.inp` is the route for those.

## Schema

Names follow **Gusnet** (QGIS; `github.com/angusmcb/gusnet`, `gusnet/elements.py`, class `Field`,
read 2026-10-06), which follows **WNTR 1.5.0** (`github.com/USEPA/WNTR`, `wntr/network/elements.py`
`_base_attributes`, and `wntr/gis/network.py`) except where Gusnet renamed. Where they differ we use
Gusnet's (that is what a QGIS user already has). Every feature has `name`, `description` (if any),
`units`, `has_results`.

| Element | Geometry | Fields (unit) |
|---|---|---|
| Junction | Point | `node_type`=Junction, `elevation` (elev/head), `base_demand` (flow; first demand row), `demand_pattern`, `demand_rows` (only if more than one) |
| Reservoir | Point | `node_type`=Reservoir, `base_head` (elev/head; ground level if blank), `head_pattern` |
| Tank | Point | `node_type`=Tank, `elevation`, `init_level`, `min_level`, `max_level` (elev/head), `tank_diameter` (LENGTH unit), `vol_curve` |
| Pipe | LineString | `link_type`=Pipe, `start_node_name`, `end_node_name`, `length` (length), `diameter` (diameter), `roughness` (roughness unit under D-W, none under H-W), `minor_loss`, `initial_status` (Open/Closed), `pipe_type` |
| Pump | LineString | `link_type`=Pump, `start_node_name`, `end_node_name`, `pump_type`=HEAD, `pump_curve`, `base_speed`, `speed_pattern`, `initial_status` |
| Valve | LineString | `link_type`=Valve, `start_node_name`, `end_node_name`, `valve_type`, `diameter`, one of `pressure_setting` (PRV, PSV, PBV; pressure) / `flow_setting` (FCV; flow) / `throttle_setting` (TCV) / `headloss_curve` (GPV), `minor_loss`, `valve_status` (Active/Closed) |
| Node results | | `head` (elev/head), `pressure` (pressure), `demand` (flow) |
| Link results | | `flowrate` (flow), `headloss` (elev/head), `unit_headloss` (gradient), `velocity` (velocity) |

Differences from the two sources: `node_type` / `link_type`, `start_node_name` and `end_node_name`
are WNTR's (Gusnet derives them from geometry); the capitalised type values are WNTR's. `tank_diameter`,
`vol_curve`, `pump_curve`, `head_pattern`, `speed_pattern`, `valve_status`, `*_setting` are Gusnet's
(WNTR: `diameter`, `vol_curve_name`, `pump_curve_name`, `head_pattern_name`, `speed_pattern_name`).
Result names are Gusnet's `ResultField`-style (`flowrate`, `unit_headloss`). A feature
collection is not a per-layer set: Gusnet and WNTR write six files, we write one, so a user
splits by `node_type` / `link_type` in QGIS.

Foreign member `lwn` (RFC 7946 section 6.1): `format`, `version`, `schema`, `project`, `scenario`,
`headloss_formula`, `units`, `coordinates`, `results`.

## Not done, and why

- **Shapefile** export needs an abbreviation table (10-character names) and a `.prj`; it is next.
- **GeoPackage**: Mary ranks it third; a QGIS partner's word outranks her ranking.
- **Import** (shapefile and GeoJSON, behind one mapping step) is the other half of Task 728.
