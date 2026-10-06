# QGIS, Esri and the GIS-to-model gap (Mary, 2026-10-05)

Tom's question, 2026-10-05: does QGIS or Esri already have robust water-modelling plug-ins, and if so
why does he not know about them; what are the true gaps; where could we interoperate, collaborate or
merge; and what should a shapefile interface be.

Provenance: **CITED** = external source named; **OBSERVED** = this repo, `path:line`;
**SPECULATION** = my inference, re-derive before relying. All figures read 2026-10-05.
Public-facing note: `dev/positioning.md:42-45` bars naming competitors in titles, taglines and
headlines; this file is a private note and names them because the question requires it. Nothing here
is landing-page copy.

---

## 0. The answer in six sentences

1. **Yes, there are robust free ones, but only two, and neither is marketed where Tom looks.**
   QGISRed (Valencia, UPV) and Giswater (Barcelona, BGEO) are both alive, GPL, and released within the
   last seven months and the last seven days respectively. The older single-author plugins (QWater,
   QEPANET, GHydraulics) are dormant or dead.
2. **Esri itself ships no pressurised-network hydraulic solver.** Its Utility Network does tracing and
   asset inventory; hydraulics lives in paid third-party extensions that run inside ArcGIS Pro
   (InfoWater Pro, WaterGEMS, MIKE+ ArcGIS).
3. **Why Tom had not heard:** they are built in Spain, Italy, Brazil, Cyprus and Germany, announced in
   QGIS's own plugin manager and in journals rather than on the web, and the US market he knows is
   Esri-plus-Bentley/Autodesk. QGISRed is Windows-only and English-only; Giswater needs a PostgreSQL
   server. Both are barriers for exactly the people we serve.
4. **The true gap is narrower than "nobody does this".** What I could not find is a free, no-install,
   no-upload, multilingual tool that goes from a utility's GIS layer to an editable, solvable, extended-
   period model in a browser. But the import half of that is already partly occupied (gis2inp.com,
   epanet-js's model builder), and I could not establish who runs gis2inp.
5. **Merging with anyone is not on offer and not sensible** (different architectures: desktop plugin
   against browser, database against file). Bridging is: every one of these tools reads and writes
   `.inp`, which we already read character-exact, so `.inp` is already the interop channel.
6. **Shapefile advice:** import shapefile and GeoJSON first, through one shared field-mapping step;
   export GeoJSON first and shapefile second; GeoPackage third. Details in section 6.

---

## 1. What exists in QGIS (CITED unless marked)

Method: the QGIS plugin repository's own feed (`https://plugins.qgis.org/plugins/plugins.xml?qgis=3.40`,
read 2026-10-05, filtered for EPANET / water supply / water distribution / hydraulic), then each
project's own repository by the GitHub or GitLab API for last push, licence and releases. The feed's
`downloads` figure is the plugin's total; I infer that because it exceeds the "latest version" count on
the plugin's own page (SPECULATION on the semantics, CITED on the numbers). Downloads are installs-by-
attempt, not users, and QGIS has no install telemetry I could find.

| Project | Who | Last release / push | Licence | Plugin downloads | Verdict |
|---|---|---|---|---|---|
| **QGISRed** | REDHISP group, IIAMA, Universitat Politecnica de Valencia, led by Prof. Fernando Martinez Alzamora; code by WaterPi (to 2022) and Ingeniousware | v0.18, 2026-04-30; repo pushed 2026-10-03; but v0.16 was 2022-07-14 and v0.17 only 2026-02-10 | GitHub: GPL-2.0; QGIS repo page: CC BY-SA 3.0 (they disagree; I did not resolve it) | 46,432 (117 votes, 4.6) | **The robust free one.** Emulates EPANET 2.2 and extends its editing; **Windows-only (needs .NET Framework 4.8)**; its own page says English only. 58 open issues. |
| **Giswater** | BGEO OPEN GIS S.L. (Granollers/Barcelona) with the Giswater Association; also Spanish water utilities | v4.17.4, 2026-10-05; three releases in the last six days; 86 stars, 33 forks | GPL-3.0 | not in the QGIS repository (own installer) | **The utility-grade one.** PostgreSQL/PostGIS database is the model's home; drives EPANET and EPA SWMM (and HEC-RAS per BGEO). Business model is consulting and training around free software. |
| **QEPANET** | University of Bolzano and Trento (Italy); GitLab `albertodeluca/qepanet` | v2.5.6, 2024-10-10; last repo commit 2025-04-15 | not stated on GitLab | 80,852 (146 votes) | Dormant-to-slow. Peer-reviewed (Aqua, "EPANET in QGIS framework: the QEPANET plugin"). |
| **QWater** | Jorge Almerio (Brazil), derived from GHydraulics | v3.3.2, 2024-08-16; last push the same day | none shown | 78,687 | Dormant. |
| **GHydraulics** | Steffen Macke | last documented release 2.1.8, 2014-04-04 | GPL (SourceForge) | n/a | Abandoned; its own page says "not well maintained any longer". |
| **qgis-epanet** | Oslandia | last push 2018-01-11; archived | GPL-2.0 | n/a | Dead. |
| **ImportEpanetInpFiles** | KIOS Research Centre, University of Cyprus (Marios Kyriakou) | 1.6.6, 2022-10-25; repo pushed 2025-01-21 | GPL-3.0 | 40,975 | Does one job: INP to shapefiles and back. |
| **Water Network Tools** | Andres Garcia Martinez | 1.4.3, 2026-09-07 | GPL-3.0 (GitHub) | 38,557 | Alive, one author. |
| **Gusnet** (same author as "WNTR Integration", apparently its successor; not confirmed) | Angus McBride; GitHub `angusmcb/gusnet` | 3.1.1, 2026-04-18; pushed 2026-06-13 | GPL-2.0 | 4,308 | **The modern newcomer.** Built on the US EPA's WNTR; README lists translations in English, French, Spanish, Italian, Dutch, Arabic; README says "Shapefile support is limited (due to a limitation of attribute length to 254 characters)". Asks for feedback. |
| **Net2INP** | Hobby Bwanali | 1.2.2, 2026-09-25 | GPL-2.0 | 412 | Newest. Line layers (shapefile, GPKG) to `.inp`: detects junctions, splits pipes at intermediate nodes, samples a DEM. |
| **HidroModelagem** | Antonio A. Coelho Neto (Brazil) | 1.8.8, 2026-07-14 | not shown | 536 | Builds EPANET models from node and pipe layers, runs steady and extended-period, in Portuguese-market context. |
| **HydroProfile, HydroSizer** | Evanderson H. Aguiar | 2026-05 and 2026-07 | not checked | 2,212; 1,521 | Add-ons **for QGISRed** (profiles; pipe sizing), evidence of a small ecosystem forming around it. |
| **Pipeline Engineer; Pipe Network Optimiser; Demand Allocator; Ubicacion_Optima_VRP** | various | all updated 2026 | not checked | 68 to 1,163 | Niche add-ons; the plugin repository now carries about a dozen water-network plugins touched in 2026. |

Other things Tom may meet under the same search: **QWAT** (Swiss drinking-water asset data model for
QGIS/PostgreSQL, GPL-2.0, pushed 2026-09-03; asset management, not hydraulics), **TEKSI wastewater**
(GPL-3.0, pushed 2026-10-05), **WaterNetGen** (Univ. of Coimbra; an extension of EPANET's own desktop
interface for demand generation and pressure-driven analysis, **not a QGIS plugin**; I could not find a
current download source), **FREEWAT** (groundwater, already in the journal, item 9, not distribution
networks).

**A defect in my own tooling, recorded so no later reader repeats it.** The web-fetch summariser
returned Giswater's 2026 releases with 2024 dates. The GitHub API (`pushed_at`, release
`published_at`) is correct: v4.17.0 LTR was cut 2026-09-17 and v4.17.4 on 2026-10-05. Always read dates
from an API, not from a summary.

**What the evidence says about robustness.** Robust means a utility can put it in production. Giswater
has that evidence: BGEO names Aigues de Mataro, Aigues de Blanes, Aigues del Prat, Consorci d'Aigues de
Tarragona, SABEMSA, Vic and Proveiments d'Aigua as corporate users (BGEO / The Water Council profile,
via search summary; I did not verify each against the utility's own site). QGISRed has no utility list
on its pages; its evidence is the UPV group's 2018-19 EUR 18,300 Generalitat Valenciana seed grant and
the downloads above. The older plugins' evidence is papers, not production.

---

## 2. What exists in Esri's world (CITED)

- **Esri has no native pressurised-network hydraulic solver.** The Water Utility Network Foundation
  introduction (`doc.arcgis.com/en/arcgis-solutions/11.5/reference/introduction-to-water-distribution-utility-network-foundation.htm`)
  lists Water Device, Water Line, Water Junction and so on, requires ArcGIS Pro 3.3 or later, and
  describes "asset inventory," "network tracing" and "digital twin technology." I read it for
  hydraulic modelling and **found none**. Hydraulic modelling is sold by partners.
- **Autodesk InfoWater Pro** runs *inside* ArcGIS Pro as an extension; Windows 10/11 and Windows Server
  only (Autodesk system-requirements page); "not all versions work together" between InfoWater Pro and
  ArcGIS Pro. Autodesk's own blog (2023-09-11) says it shares scenario results to ArcGIS Online (the
  page returned 403 to me; I have only the search summary). Price: not found this session.
- **Bentley WaterGEMS** runs inside ArcGIS Pro "at no additional cost" with any WaterGEMS subscription
  (The Source magazine, 2021-09-23); five platforms in all (stand-alone, MicroStation, AutoCAD, ArcMap,
  ArcGIS Pro). ModelBuilder, LoadBuilder and Terrain Extractor are available in the ArcGIS Pro build;
  WaterGEMS 2024 added ModelBuilder from ArcGIS Online features and builds from a Utility Network (search
  summaries of Virtuosity blog and Bentley KB; ArcGIS Pro only).
- **DHI MIKE+** is sold in two versions, "MIKE+" and "MIKE+ ArcGIS" (which embeds ArcGIS Pro); it has a
  MIKE+ EPANET module, and its Model Manager imports "databases, shapefiles, Excel" (DHI pages).
- **Innovyze InfoWorks WS Pro** integrates with Esri's environment (search summary only).
- **Tying it to the user:** each of these needs a licence of the vendor *and* usually of ArcGIS. The
  pattern is the one in `dev/agents/market-researcher/watercad-migration.md` section 1:
  ModelBuilder reads a utility's own shapefile or geodatabase layer and builds the model from it.
- **Market weight.** A search summary credits Esri with "an estimated 90% market share of the municipal
  utilities market in the U.S." and says nearly half of its US water revenue comes from utilities under
  50,000 connections (the source is a GIM International report summary, undated, 403 to me). **Treat
  the 90% as unverified.** What is safe: the US utility GIS the people Tom serves meet is overwhelmingly
  Esri, which is why a QGIS-first world would not have reached him.

---

## 3. Why Tom had not heard (the honest list)

1. **Geography and language.** QGISRed and Giswater are Spanish; QEPANET Italian; QWater and
   HidroModelagem Brazilian; KIOS Cypriot; GHydraulics German (CITED, author affiliations above).
   The US-centred trade press and conferences Tom reads do not carry them. (SPECULATION on the media
   consequence; the origins are CITED.)
2. **Discovery happens inside QGIS** (Plugins menu) and in academic journals, not in web search for
   "water modelling software", where the vendors buy the results. (SPECULATION.)
3. **Barriers that look like "not for me".** QGISRed: Windows only, English only, .NET 4.8. Giswater:
   a PostgreSQL 9.5-18 server with PostGIS and pgRouting, Python 3.9+ (README). Both are fine for a
   utility with a GIS department and wrong for a consulting engineer on a laptop.
4. **The US utility reality is Esri, and the vendors are paid, Windows, ArcGIS-bound.** (Section 2.)
5. **Tom may have seen them and filed them as "EPANET front-ends".** Every one delegates solving to
   EPANET or WNTR. (CITED for QWater, Gusnet, QGISRed; journal line 2598 already records QWater and
   GHydraulics "delegate to EPANET".) That framing hides what they actually add, which is the GIS
   attribute table as the editor.
6. **A prior pass did not look.** The journal's 2026-09-30 entry (`journal.md:2477`) says I "did not
   reach QGIS/QWater plugin documentation directly". This is the first direct read.

---

## 4. The true gaps, and the ones that are not gaps

**Not gaps (do not claim these):**
- "Nobody reads and writes `.inp` in QGIS." Wrong; ImportEpanetInpFiles, QGISRed, QWater, Gusnet and
  HidroModelagem all do.
- "Nobody does extended-period simulation in a free GIS tool." Wrong; QGISRed claims to emulate all of
  EPANET 2.2 and HidroModelagem runs EPS (CITED, their pages).
- "Nobody goes shapefile to model in a browser." Not true as of now: **gis2inp.com** ("Turn shapefiles,
  GeoJSON and KML into solver-ready EPANET .inp, entirely in your browser"; its search-result text adds
  .shp/.dbf/.prj or zipped bundles, GPX, Excel, and a guided resolver for duplicate pipes, coincident
  nodes, orphans and disconnected sub-graphs) and **epanet-js's model builder** (Legacy and Pro; the
  Legacy path is the one Tom screenshotted, `dev/positioning.md:420-436`). I could not find who
  operates gis2inp, its licence or its source. It is a single-page app; the page itself has no
  readable owner text. **That is a lead for Tom to check, not a finding.**
- "Nobody does the reverse." **epanet-to-gis** (`modelcreate`, MIT, last push 2024-07-29, "all
  geoprocessing is done locally") writes shapefiles or GeoJSON from an `.inp` in a browser. `modelcreate`
  is the account behind epanet-js (see `dev/luke-butler.md`; I did not re-verify that today and tag it
  SPECULATION). WNTR (US EPA, `USEPA/WNTR`, v1.5.0 of 2026-07-01) converts a model to and from
  GeoDataFrame, GeoJSON and shapefile in Python.

**Gaps I can defend (each with its basis):**
1. **No free tool joins "from the utility's GIS layer" to "edit, fix topology, solve, view extended-period
   results" in one zero-install, no-upload, translated place.** The QGIS plugins need QGIS (and
   QGISRed needs Windows); gis2inp stops at writing an `.inp`; epanet-js's free Legacy import is
   English-only on that path (`dev/positioning.md:420-436`). Basis: the sources above. This is a gap in
   *combination*, not in any one capability, and a competitor could close it in a release.
2. **Language.** QGISRed's own page says "only available in English" (it adds "soon Spanish"; date
   unknown, so possibly stale). Gusnet translates. Giswater has a `translations` repository
   (CITED, GitHub org listing, pushed 2026-10-05) but I did not establish how many languages. Nobody I
   found offers a water-network editor in 27. (Weak: absence of evidence in a limited look.)
3. **The first mile is shared pain.** Net2INP's feature list ("detects junctions, splits pipes at
   intermediate nodes"), gis2inp's "guided resolver", ModelBuilder's "creating nodes at pipe endpoints
   if none are found" (`watercad-migration.md:67-72`) all exist because a GIS pipe layer is a set of
   lines, not a connected graph. A GIS layer has no node for a valve in the middle of a line, no
   demand, and no agreed units. Whoever makes this step fast and *visible* (draw it, flag it, let the
   person fix it on the map) has the real product. We already have the editor that can show the fix.
   (SPECULATION on the weight; the pattern is CITED.)
4. **Windows.** QGISRed's Windows-only status excludes Mac and Linux users, and ChromeOS. (CITED.)
5. **Sustainability.** QGISRed went 3.6 years between v0.16 and v0.17 and rests on one university
   group; QEPANET, QWater and GHydraulics have stalled. (CITED dates.) A user who built a workflow on
   them has already been burned or may be. That makes "the model is a plain `.inp` plus a plain file you
   can open anywhere" a real argument. (SPECULATION on the argument.)

**What I looked for and did not find:** any survey of what share of modelling engagements receive
shapefile versus geodatabase versus GeoPackage; any QGIS installed-base figure for water utilities; any
utility-published "how to build a model from our GIS" in QGIS terms. Search terms were: "hydraulic
modeler requests GIS data from water utility shapefile OR geodatabase", "Esri water utilities
customers percent", and the Esri community thread "Why Still Using Shapefiles?" (title only reached
me). **The claim "GIS users hand a modeller a shapefile" rests on (a) Bentley's and DHI's own import
tools listing shapefile, (b) the three browser/Python tools above all taking shapefile, (c) Esri's
own documentation treating shapefile as a standing export target, and not on a measured share.**

---

## 5. What the GIS data actually looks like (CITED)

- **Esri Local Government Information Model** (water, wastewater and stormwater feature datasets were
  moved out of it in the March 2017 ArcGIS Solutions release into per-solution geodatabases): feature
  classes such as `wControlValve`, `wSystemValve`, Hydrant with BarrelDiameter and
  MainDistributionDiameter. A **file geodatabase**, not a shapefile.
- **Water Utility Network Foundation** (the current Esri model): WaterLine has `assetgroup`, `material`,
  `lifecyclestatus` and a `diameter` field (DOUBLE) (Esri data dictionary summary; the page is
  `solutions.arcgis.com/water/help/...DataDictionary`, I read only a search summary). A utility network
  lives in a file or enterprise geodatabase and **is not a shapefile at all**; a shapefile is what
  someone exports from it.
- **None of these carry hydraulic attributes** (roughness C, demand, pump curve, tank levels) in the
  standard schema; the Esri introduction page mentions only "diameter" and "material". A model builder
  must be given them, defaulted, or looked up from a material table. That is the mapping step. (CITED
  for absence on the intro page; I did not read the full data dictionary.)
- **Shapefile limits** (Esri documentation): field names of at most 10 characters, text fields at most
  254 characters, 255 fields maximum, no nulls, poor Unicode, no time in date fields. Gusnet's README
  names the 254 limit as the reason its shapefile support is limited. Esri's own blog posts GeoPackage
  as "the new shapefile without the old limitations" (search summary; that blog 403'd to me).
- **File geodatabase can be read by open software.** GDAL's OpenFileGDB driver reads without Esri's
  SDK and writes from GDAL 3.6 on (GDAL docs); it cannot read SDC or CDF compressed data. In a browser
  that means GDAL compiled to WebAssembly (`gdal3.js`, LGPL-2.1, pushed 2026-05-13): large, and LGPL
  sits uneasily beside a GPL-3 site only in distribution terms I have not checked.
- **QGIS's native model** for a drawn network is the QGISRed one: "a relational database of SHP and DBF
  files based on the EPANET data model" which its page calls "public, with a very simple structure" and
  usable by EPANET, InfoWorks and WaterGEMS. That is the closest thing to a *de facto* GIS schema for an
  EPANET model that I found.

---

## 6. Recommendation: the shapefile and GIS interface

Repo facts first (OBSERVED): there is **no** shapefile, GeoJSON or GeoPackage code anywhere in `js/`,
`lib/` or `Looped-Network.php` (word-boundary grep, 2026-10-05); `js/vendor/proj4.js` is already
vendored, so a `.prj` can be turned into longitude/latitude today; a geographic project is stored in
lon/lat and "never store the projection" (`CLAUDE.md`, `lpn_` section); import reports every difference
and never drops silently (`CLAUDE.md`); ROADMAP Task 728 is "Import a GIS shapefile or geodatabase as a
network," priority 50, "Unsized; read with Task 723" (`dev/ROADMAP.md:894-896`); Task 720 is background
layers from a GIS server (`dev/ROADMAP.md:886-888`) and is a different thing (a map backdrop, not model
data).

**Recommendation (SPECULATION, grounded in the above).**

1. **Import first, and make it a mapping step, not a parser.** The parser is a weekend; the value is in
   (a) naming which layer is pipes, junctions, valves, hydrants, (b) mapping columns to diameter,
   roughness, material, install year, (c) asking the units (a GIS column has none; EPANET's own
   `.inp` has them by flow-unit), (d) building the graph from line endpoints with a snap tolerance,
   and (e) **drawing what it was unsure about** so the person fixes it on the map. This is ModelBuilder's
   shape and Net2INP's, and (e) is what our editor can do better than a one-shot converter. It must
   follow our own rules: verbatim carry of unrecognised columns as custom properties, import report
   of every difference, never a silent drop.
2. **Format order: shapefile and GeoJSON together for import; GeoJSON, then shapefile, for export;
   GeoPackage third.**
   - **Shapefile import** because it is what Task 728 asked for, what every comparable tool accepts,
     and what a GIS department hands over by default (basis: section 4). Accept a **.zip** or
     a multi-file selection (.shp, .dbf, .prj, .shx, .cpg). It is one geometry type per file, so
     pipes and junctions arrive as separate files: a multi-select UI is needed from day one. Readers:
     `shapefile-js` (MIT, pushed 2025-10-01) or a small purpose-built reader; the format is simple.
     Avoid GDAL-WASM at this stage.
   - **GeoJSON import and export** because it is **one file, UTF-8, unlimited field names, and
     RFC 7946 fixes the coordinate system to WGS 84 longitude/latitude**, which is exactly how this
     suite already stores a geographic project. QGIS, ArcGIS Pro and geojson.io all open it with no
     setup. It is the cheapest honest round trip.
   - **Shapefile export second** because a GIS department will ask for it, but our attribute names
     (roughness, minor loss, initial level, peak factor) overrun 10 characters, so we would have to
     publish an abbreviation table. Write it (zipped, with `.prj`) but say so on screen. `shp-write`
     (BSD-3-Clause, pushed 2026-06-24) exists.
   - **GeoPackage third.** It is technically the best (one file, no length limits, Esri's own
     recommended successor, QGIS's default) and Gusnet's README argues against shapefile for those
     reasons, but it needs SQLite in WebAssembly (`sql.js`, about 1 MB) and is the format least likely
     to arrive in a US utility's email today. **If a QGIS-using partner (section 7) says "give us
     GeoPackage", promote it; their word outranks my ranking.**
   - **File geodatabase: not now.** It is the Esri-native format and the one in which a utility
     network actually lives, but it needs GDAL-WASM. Ask the user to export a shapefile or GeoJSON from
     ArcGIS Pro (one click, "Export Features"). Say that on the import dialog. SPECULATION on the
     user effort; Esri's export tool is CITED.
3. **Export is worth building even though import gets the headlines**, because the lock-in question is
   asked in both directions, because "our model on your map" is how a consulting engineer hands
   results to a client's GIS group, and because it exercises the same attribute mapping in reverse.
   But epanet-to-gis and WNTR already do `.inp` to GIS, so **export is not a differentiator and should
   not lead any public copy**; the import-and-fix flow might.
4. **Coordinates.** A shapefile `.prj` (Well-Known Text) goes through `proj4` to longitude/latitude, then
   the project is geographic; a missing `.prj` (common in handed-over data) must offer "this is lat/lon"
   or "this is an XY grid in ft or m" and never guess. This is OBSERVED-consistent with the rule that
   a bare coordinate pair is the defect (`CLAUDE.md`, "Coordinates").
5. **Interlock with Task 723.** The roadmap line says "read with Task 723" (the WaterCAD migration
   task). The GIS importer is the WaterCAD-independent half of that story (`watercad-migration.md:67-75`);
   the two should share the report format.
6. **Do not build a plugin.** Tom asked about Windows executables and logins before; here, evidence
   points the *other* way from a plugin: QGISRed is Windows-only and English-only, and that is the gap.
   Being a web page that reads their layers is the position none of them can take.

**Cost and risk (SPECULATION; I have not sized the work).** Reader plus mapping dialog plus topology
snap plus report is a multi-session build; the 27-language string load is the largest hidden cost
(Task 459's sprint already shows the shape). The risk is **gis2inp**: if it is mature and free, our
import would be the second tool, and the differentiators are only language, the editor beside it, and
GPL. That is worth one email to its owner before committing.

---

## 7. With whom, and how to reach them

None of this is a merge. Ranked by how likely a conversation is to be productive (SPECULATION on the
ranking; contacts CITED).

1. **Angus McBride, Gusnet (`github.com/angusmcb/gusnet`, `gusnet.org`).** GPL-2.0, active in 2026,
   translated, built on WNTR, explicitly asks for feedback. *Offer:* an open question on what GeoPackage
   schema he uses so our import accepts a Gusnet layer set directly; our 27-language water glossary
   (`dev/scripts/glossary.json`) for his translations. Reach: GitHub issues, or the site's contact.
   Smallest, friendliest, and the only one built to be adjacent to a browser tool.
2. **QGISRed: Prof. Fernando Martinez Alzamora, REDHISP, UPV (`qgisred.upv.es`, contact form; issues at
   `github.com/qgisred/QGISRed`).** *Offer:* read and write a QGISRed shapefile project folder, since
   their schema is "public" and "very simple"; ours would be the only way to open it without Windows.
   *Ask:* the schema document and whether the .NET core is open. Note an unresolved discrepancy
   (GPL-2.0 on GitHub, CC BY-SA 3.0 on the plugin page) to ask about. They took EUR 18,300 in public
   money and say "worldwide dissemination," so a multilingual, platform-free viewer fits their
   stated aim. This is the most valuable relationship and the harder one.
3. **BGEO, Giswater (`info@bgeo.es`, +34 938 600 293; `github.com/giswater/plugin`).** GPL-3.0, weekly
   releases, real utility customers, a services business. *Offer:* nothing to merge (their model lives in
   PostgreSQL), but their users already export `.inp`, which we read; ask whether a browser viewer of
   an exported model has any use for their customers, and what they do for translations. A conference
   route also exists: Giswater 4 was presented at FOSS4G Europe 2025 (`talks.osgeo.org/foss4g-europe-2025`).
4. **Luke Butler and Sam Paya, Iterating Inc. (epanet-js).** Already the standing relationship
   (`dev/luke-butler.md`). The relevant fact is that epanet-js has a GIS import path, so the question
   for him is whether it reads our `.inp` extensions and what their import mapping does; he does not
   accept pull requests (his words, 2026-09-13), so a white paper is the route
   (Tom, 2026-10-01).
5. **US EPA WNTR (`github.com/USEPA/WNTR`; release 1.5.0, 2026-07-01).** Its GeoDataFrame column
   names are the nearest thing to a public, maintained, citable attribute schema for a model-as-GIS.
   Adopting its column names (after I read them: I could not retrieve the page this session) would give
   us a defensible, non-invented mapping. Reach: GitHub issues.
6. **OWA community forum (`community.wateranalytics.org`).** Where epanet-to-gis and the QGIS plugins
   were discussed; the right place to ask "who runs gis2inp" and "what do you hand-build from GIS".
7. **The owner of gis2inp.com.** Unknown. Check the domain's registration; a polite email first.
8. **Not worth contacting for interop: Esri, Autodesk, Bentley, DHI.** File-level only; their tools
   read our `.inp` already because EPANET's format is theirs too.

---

## 8. Questions Tom raised that this bears on

- **Windows executable.** Evidence against a plugin or executable: the most active free tool is a
  Windows-only plugin and its platform limit is its widest gap. No evidence in this pass for an
  executable. (SPECULATION from CITED facts.)
- **Cloud and logins (Task 537).** This pass adds nothing for the cloud argument. The GIS tools that
  matter all work on local files or the user's own database; Giswater's database is the user's own.
  The one cloud-shaped thing in this market, ArcGIS Online / Enterprise, is where the utility's data
  *already lives*; a model builder reading it directly needs the utility's credentials, which is
  a reason to read a file the user exports instead. (SPECULATION.)

---

## For the journal

Proposed entry, one provenance tag per line; paste, do not retag.

```
## 2026-10-05, QGIS / Esri / GIS-to-model gap (full report: dev/agents/market-researcher/gis-plugins.md)

- CITED (plugins.qgis.org plugins.xml feed, 2026-10-05; GitHub and GitLab APIs, same day). Robust and
  alive free QGIS water-modelling tools are two: QGISRed (UPV Valencia, v0.18 of 2026-04-30,
  Windows-only, English-only, GPL-2.0 on GitHub) and Giswater (BGEO Barcelona, v4.17.4 of 2026-10-05,
  GPL-3.0, needs PostgreSQL). QEPANET (last release 2024-10-10), QWater (2024-08-16), GHydraulics (2014),
  qgis-epanet (archived 2018) are dormant or dead. Newcomers 2026: Gusnet (Angus McBride, WNTR-based,
  translated), Net2INP, HidroModelagem.
- CITED (Esri doc.arcgis.com Water Utility Network Foundation intro). Esri ships no hydraulic solver;
  hydraulics is third-party and paid: InfoWater Pro and WaterGEMS (both run inside ArcGIS Pro), MIKE+ ArcGIS.
- CITED (gis2inp.com meta description; epanet-to-gis README; WNTR docs). Browser/Python shapefile-and-GeoJSON
  to .inp already exists: gis2inp.com (owner not found), epanet-js model builder, WNTR; reverse by
  epanet-to-gis (MIT, 2024) and WNTR. "Nobody does shapefile to model in a browser" is FALSE.
- CITED (Esri docs, GDAL docs). Shapefile: 10-character field names, 254-character text, no nulls.
  Utility Network lives in a geodatabase, not a shapefile. GDAL OpenFileGDB reads without Esri's SDK.
- OBSERVED (grep, 2026-10-05). No shapefile/GeoJSON/GeoPackage code in js/, lib/ or Looped-Network.php;
  js/vendor/proj4.js is vendored.
- SPECULATION. Recommendation: shapefile + GeoJSON import behind one field-mapping and topology-snap step;
  GeoJSON export first, shapefile export second, GeoPackage third; no file-geodatabase until a partner asks.
  Contact order: Gusnet, QGISRed (Martinez Alzamora, UPV), BGEO, Butler, WNTR, OWA forum, gis2inp owner.
- NOT FOUND. Any measured share of shapefile vs geodatabase vs GeoPackage in modeller hand-offs; QGIS
  installed base in US water utilities; gis2inp's owner or licence; WNTR's GeoDataFrame column names
  (page unreachable); QGISRed's .NET core licence. Tool defect: a web-fetch summary gave Giswater's 2026
  releases 2024 dates; read dates from APIs.
```

## For the wish list

Proposed row (rank at Tom's or Mary's discretion; suggest directly under row 0b2, which it amends):

```
## 0b2a. Before building the GIS importer: one email to gis2inp's owner and one to Angus McBride

2026-10-05. 0b2 argued a shapefile importer was a WaterCAD-independent on-ramp and unoccupied.
It is not unoccupied: gis2inp.com already turns shapefile/GeoJSON/KML into .inp in the browser, and
epanet-js's model builder does it behind a paywall split (CITED, gis2inp.com; positioning.md:420).
What is still open is the combination (edit and fix topology, solve, extended-period results, 27
languages, no upload). Ask first: who runs gis2inp, and what attribute schema does Gusnet use.
Format order if built: shapefile+GeoJSON in, GeoJSON out, shapefile out, GeoPackage last.
Full evidence: dev/agents/market-researcher/gis-plugins.md.
```
