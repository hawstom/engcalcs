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
| Tank | Point | `node_type`=Tank, `elevation` (the ground), `base_elevation` (the tank bottom, EPANET's tank Elevation), `init_level`, `min_level`, `max_level` (elev/head), `tank_diameter` (LENGTH unit), `vol_curve` |
| Pipe | LineString | `link_type`=Pipe, `start_node_name`, `end_node_name`, `length` (length), `diameter` (diameter), `roughness` (roughness unit under D-W, none under H-W), `minor_loss`, `initial_status` (Open/Closed), `pipe_type` |
| Pump | LineString | `link_type`=Pump, `start_node_name`, `end_node_name`, `pump_type`=HEAD, `pump_curve`, `base_speed`, `speed_pattern`, `initial_status` |
| Valve | LineString | `link_type`=Valve, `start_node_name`, `end_node_name`, `valve_type`, `diameter`, one of `pressure_setting` (PRV, PSV, PBV; pressure) / `flow_setting` (FCV; flow) / `throttle_setting` (TCV) / `headloss_curve` (GPV), `minor_loss`, `valve_status` (Active/Closed) |
| Node results | | `head` (elev/head), `pressure` (pressure), `demand` (flow) |
| Link results | | `flowrate` (flow), `headloss` (elev/head), `unit_headloss` (gradient), `velocity` (velocity) |

Differences from the two sources: `node_type` / `link_type`, `start_node_name` and `end_node_name`
are WNTR's (Gusnet derives them from geometry); the capitalised type values are WNTR's. `tank_diameter`,
`vol_curve`, `pump_curve`, `head_pattern`, `speed_pattern`, `valve_status`, `*_setting` are Gusnet's
(WNTR: `diameter`, `vol_curve_name`, `pump_curve_name`, `head_pattern_name`, `speed_pattern_name`).
Result names are Gusnet's `ResultField`-style (`flowrate`, `unit_headloss`). A tank's `elevation`
is its GROUND, as at every node and as the DXF's ELEVATION; WNTR's tank `elevation` is the base,
which we write as `base_elevation` (Tom, 2026-10-11: a tank has two elevations). **The network
import below reads this schema back, so a field added or renamed here is a field the import must
read** (`GJ_OURS_NODE` / `GJ_OURS_LINK` in `js/lpn-geojson.js`). A feature
collection is not a per-layer set: Gusnet and WNTR write six files, we write one, so a user
splits by `node_type` / `link_type` in QGIS.

Foreign member `lwn` (RFC 7946 section 6.1): `format`, `version`, `schema`, `project`, `scenario`,
`headloss_formula`, `units`, `coordinates`, `results`.

## Not done, and why

- **Shapefile** export needs an abbreviation table (10-character names) and a `.prj`; it is next.
- **GeoPackage**: Mary ranks it third; a QGIS partner's word outranks her ranking.
- **Shapefile network import** (below).

## Import: File > Import > GeoJSON network (Task 728, import half)

Tom, 2026-10-06: shapefile and GeoJSON import behind one mapping step. Reader and builder:
`EngCalcs.lpnGeoJsonNetScan` / `lpnGeoJsonNetGuess` / `lpnGeoJsonNetBuild` in `js/lpn-geojson.js`
(pure). Page: `landGeoJsonNetText()` and its neighbours in `js/looped-network.js`, under the
`.inp` import, which it lands exactly as: a new browser project named after the file, units strip
moved to the file's units first, arriving saved, a report of every difference, settings cloned from
the open project (R-342: a new-asset default typed in a unit the import changed falls back to the
built-in one). Harnesses: `dev/lpn-spike/geojson-import-harness.js` (node) and
`geojson-import-browser-harness.js` (Chromium); fixture `fixtures/geojson-utility-layer.geojson`.

- **A file of ours (`lwn.format`) is read by its own schema and asks nothing.** Written out again
  it is the same file byte for byte (proved on Net1 placed on the Earth, Net3 US and SI, and Net2,
  whose positions were converted from State Plane); in the page, the same features apart from
  results. The report always names what a GeoJSON file does not hold (controls, rules, times,
  labels, EPANET options, the pipe type, fittings and efficiency curve libraries), any results
  (computed again), extra demand rows, and a pipe type whose definition is absent.
- **Any other file goes through one dialog.** One table per kind (points, lines): each attribute
  field, an example, the property it fills, and the unit of a number. Guesses by name (`ELEV_FT`
  is the elevation in ft); every other field is kept as a custom property (key `custom_<field>`,
  labelled with the field name, value as typed). One field per property. A number property is
  offered for a field holding any number and guessed only for a field of numbers. Hazen-Williams C
  has no unit. The chosen unit per family becomes the project unit; nothing is converted.
- **Topology from geometry.** A line end within the stated tolerance (default 0.5 m, typed in the
  dialog) of a point joins it, else of another line end, else a junction is added there. Interior
  positions are bends. A multipart line whose parts meet end to start is one pipe; otherwise one
  pipe per part. A line end lying along another pipe's middle is named, not joined (no split).
- **Every change is named**: features not imported (not a point or line, bad position, both ends on
  one node), IDs assigned (blank, invalid, duplicate within a kind), junctions added, ends moved
  (largest distance), a value that is not a number, a default used (per element, or one line when
  no field was chosen), fields left out or kept as custom properties, a third coordinate ignored.
  A pipe with no length is Auto (slope distance along the line).
- **Coordinates.** RFC 7946: WGS 84 longitude and latitude; stored as typed, characters in `tok`.
  A legacy `crs` naming CRS84 or EPSG:4326 is read and named; any other is refused with its name
  and the instruction to export in EPSG:4326. Never guessed, never converted.
- **Shapefile, still to build**: a `.shp`/`.shx`/`.dbf`/`.prj` (or `.zip`) reader already exists
  for Shapes (`js/lpn-gisread.js`); the network import would add reading two layers (points and
  lines are separate files), the `.prj` through proj4 to longitude and latitude (refusing a missing
  one rather than guessing), the dBASE field types and 10-character names into the same mapping
  dialog, and the `.cpg` code page. `lpnGeoJsonNetBuild` takes features, so the shapefile half
  is a reader that hands it the same tree.
