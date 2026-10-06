# DXF export (ROADMAP Task 772)

File > Export DXF file… writes **a dumb annotated network** (Tom, 2026-10-06) that any DWG program
opens. Writer: `js/lpn-dxf.js` (pure). Gatherer: `dxfModel()` and `dxfLettering()` in
`js/looped-network.js`. Harness: `dev/lpn-spike/dxf-export-harness.js`. Prior art and the reasons
for R2000, layers and attributed blocks: `dev/agents/market-researcher/autocad-interop.md` and
Mary's journal, 2026-10-06 section B.

## Rules

- **ASCII DXF R2000 (AC1015)**: the oldest version with LWPOLYLINE.
- **One escape for every string** (`escapeParts()`/`str()` in `js/lpn-dxf.js`: TEXT, ATTRIB,
  ATTDEF, prompts, tags, layer and block names):
  - `$DWGCODEPAGE` ANSI_1252: a character Windows-1252 holds is its byte; any other in the Basic
    Multilingual Plane is `\U+XXXX`; one outside it is `?` (`\U+` has four hex digits).
  - a literal caret is `^ `; a control character is its caret form (`^I`, `^J`), per the Reference.
  - a literal backslash is `\U+005C`, so a typed `\U+0041` or `\P` is never decoded.
  - where a string holds `%%`, every `%` is `%%%`, AutoCAD's literal percent.
  - 2049 characters at most (the Reference's limit): longer is cut between whole escapes and ends
    in `…`, and the read-me note says how many values were shortened.
  - layer and block names also have the symbol-table characters `<>/\":;?*|=`` ` `` made `_`.
- **Every object has a handle and an owner** (330); `$HANDSEED` is above them all. Structure follows
  the Autodesk DXF Reference and ezdxf's minimal R2000 content (below), plus the two LAYOUTs and the
  plot-style placeholder AutoCAD 2000 writes, so nothing is left for AutoCAD to rebuild on open.
- **No XDATA in this cut** (Tom: invisible to users). A machine key for a later sync (one registered
  APPID, the element ID and type) can be added beside the ID attribute without changing anything
  else here; it waits on an in-AutoCAD app to read it.
- **What the map shows is what lands.** Lettering is read off the map's own labels layer: every
  shown node, link, repeat and customer label row as a TEXT at the place and angle the placement
  pass gave it; Text labels; leaders as LINEs. Results appear only if the map shows them, so only
  when solved. Underlined and overlined extremes keep their mark (`%%u`, `%%o`).
- **Laid out at Zoom to fit, whatever the zoom at export.** `dxfAtFitScale()` runs the page's own
  `zoomExtent()` and label pass, holds the scale to ten significant figures, gathers, and puts the
  user's view back, all in one synchronous call (nothing is painted in between). Text height,
  symbol size and every label's place are therefore the ones the map shows at Zoom to fit; they
  still follow the map window's size and the text and symbol sizes in Settings, as Zoom to fit does.
- **Text height** = the text size at that scale × 0.716 (Arial's cap height per em, OS/2
  sCapHeight 1467/2048), because a CAD text height is a cap height and an SVG font size is an em.
  **Symbol size** = the junction symbol at that scale.
- **Text style Standard, naming no font file** (Tom, 2026-10-06: *"Neither. Use 'Standard'
  style."*, asked arial.ttf or txt.shx). The STYLE record keeps the Reference's fields with 3
  (primary font file) and 4 (big font) empty; no entity names a style (group 7 defaults to
  STANDARD), so the opening program draws Standard in its own default font.
- **Attribute height 1, INSERT scale = text height** (Tom, 2026-10-06: *"the height of every
  attribute should be 1 so that the user or we can scale the block insertion to the desired scale
  and text height"*). One block unit is one text height: every ATTDEF is 1.0 high, every INSERT is
  scaled by the text height, and the symbol outline is drawn symbol ÷ text-height block units
  across, so it still lands one map symbol wide. Each ATTRIB, stored in drawing coordinates, is the
  text height. The read-me note states the scale ("inserted at scale 1.08" for Net1).
- **Plot scale, stated in the drawing**: the read-me note gives the text height and the network's
  extent in drawing units ("text 1.17 ft high, on a network 80 ft across" for Net1 in a 1400 px
  window). Plot the network at width W and the text is W × h / w high.
- **Coordinates, and the only claim the file makes about them** (the read-me note):
  - grid project: its own X and Y, exactly (the file's number plus the origin, as the `.inp`
    export writes them); `$INSUNITS` from the length unit (ft 2, m 6). "No coordinate system is stated."
  - project with a stated coordinate system: its numbers unchanged; `$INSUNITS` from that system's
    unit (US survey feet has no R2000 code and is written as feet; the system's name says which).
  - latitude-and-longitude project: converted with `js/lpn-crs.js` (proj4) to the WGS 84 UTM zone
    holding the network's centre, metres, `$INSUNITS` 6. **Never degrees.** The read-me note and
    the status line after export both say the coordinates are that UTM zone, in meters, "not
    latitude and longitude" (Tom expected degrees on the preview, 2026-10-06). Not the page's Web Mercator frame, whose
    scale is off by 1/cos(latitude). If the conversion cannot load, nothing is written and the
    status line says so; a network centred beyond 80° S or 84° N, where UTM stops, gets its own
    message. A network straddling a zone edge or the antimeridian is drawn in the centre's zone.
  - A scenario that moves a node exports that position, as the `.inp` export does.
- **The ID attribute is visible; every other is invisible** (flag 1). Tom, 2026-10-06, asked
  whether the ID should be invisible: *"No."* `ATTDISP ON` or double-click (Enhanced Attribute
  Editor) shows and edits the rest. Values are the model's numbers, unrounded, in the project's
  display units; prompts carry the unit.
- **One layer per attribute property**, C-WATR-ATTR-xxxx (table below). Tom offered one layer per
  property or one for all; per property gives freeze and No plot property by property, and
  `C-WATR-ATTR-*` in the layer filter still takes them all at once. An ATTRIB carries its own
  group 8 (the Reference's common entity codes, which ATTRIB shares with every graphical entity),
  and AutoCAD and BricsCAD hide an attribute on a frozen layer even when the block's layer is
  thawed. The ATTDEF sits on the same layer, so ATTSYNC, which resets attributes to their
  definitions, keeps them there.
- **Layer prefix**: `lpnDxfWrite()` takes `layerPrefix`; no control offers it yet.

## Layers

AIA CAD Layer Guidelines, United States National CAD Standard v5: the edition named in the page
footers of the copy read (hosted by Duke University, facilities.duke.edu); v5 from the NIBS site was
not fetched. Discipline C, major group WATR (water supply).

- C-WATR-PIPE is in the Guidelines' Civil list as it stands.
- EQPM, VALV, TANK, LABL, TEXT and RDME are prescribed Minor Group codes, used under the rule
  "any Minor Group may be used to modify any Major Group".
- NODE is a prescribed code, but a Major Group ("Node", as in V-NODE-WATR); here it sits in the
  minor position with the same meaning.
- RSVR and CUST are user-defined, which the Guidelines permit when documented; this table is that
  document.
- Valves: the Guidelines' own layer is C-WATR-INST, "instrumentation (meters, valves, etc.)". VALV
  is used because a model's valves are control valves with settings (PRV, PSV, FCV, TCV), and INST
  would file them with meters.

ACI colours 1-9 only.

Attribute property layers (NCS Discipline-Major-Minor-Minor, four characters a field; ATTR is
user-defined, IDEN is the Guidelines' annotation code "identification tags"). ID's layer is ACI 7,
the rest ACI 9. Only the layers a file's blocks use are written.

| Tag | Layer | | Tag | Layer |
|---|---|---|---|---|
| ID | C-WATR-ATTR-IDEN (visible) | | ROUGHNESS | C-WATR-ATTR-ROUG |
| ELEV | C-WATR-ATTR-ELEV | | FLOW | C-WATR-ATTR-FLOW |
| DEMAND | C-WATR-ATTR-DMND | | VELOCITY | C-WATR-ATTR-VELO |
| HEAD | C-WATR-ATTR-HEAD | | VALVETYPE | C-WATR-ATTR-VTYP |
| LEVEL | C-WATR-ATTR-LEVL | | SETTING | C-WATR-ATTR-SETG |
| MINLEVEL | C-WATR-ATTR-LMIN | | COUNT | C-WATR-ATTR-QNTY |
| MAXLEVEL | C-WATR-ATTR-LMAX | | TAG | C-WATR-ATTR-TAGS |
| DIAMETER | C-WATR-ATTR-DIAM (tank, pipe, valve) | | DESC | C-WATR-ATTR-DESC |
| LENGTH | C-WATR-ATTR-LENG | | | |

| Layer | Holds | ACI | NCS |
|---|---|---|---|
| C-WATR-PIPE | pipes: LWPOLYLINE through every bend + WATR_PIPE block at mid-run | 5 | listed: "Water supply: piping" |
| C-WATR-EQPM | pumps: LWPOLYLINE + WATR_PUMP block at mid-run | 6 | EQPM "Equipment" |
| C-WATR-VALV | valves: LWPOLYLINE + WATR_VALVE block at mid-run | 1 | VALV "Valves" (Guidelines: INST) |
| C-WATR-NODE | junctions, WATR_JUNCTION | 4 | NODE, a prescribed Major Group code |
| C-WATR-TANK | tanks, WATR_TANK | 3 | TANK "Storage tanks" |
| C-WATR-RSVR | reservoirs, WATR_RESERVOIR | 3 | user-defined |
| C-WATR-CUST | customers, WATR_CUSTOMER + service LINE | 8 | user-defined |
| C-WATR-LABL | the map's data labels and leaders | 7 | LABL "Labels" |
| C-WATR-TEXT | the project's Text labels | 7 | TEXT "Text" |
| C-WATR-RDME | read-me note (name, coordinates, scale); not plotted | 8 | RDME "Read-me layer (not plotted)" |

## Blocks and attributes

Geometry on layer 0, ByLayer, so each insert takes its layer's colour; unit = one text height, the
INSERT scale is the text height. Shapes follow the map's silhouettes.

| Block | Attribute tags |
|---|---|
| WATR_JUNCTION | ID, ELEV, DEMAND (base demand, all categories), TAG, DESC |
| WATR_RESERVOIR | ID, HEAD (the effective water surface), TAG, DESC |
| WATR_TANK | ID, ELEV, LEVEL, MINLEVEL, MAXLEVEL, DIAMETER, TAG, DESC |
| WATR_PIPE | ID, DIAMETER, LENGTH, ROUGHNESS, FLOW, VELOCITY, TAG, DESC; FLOW and VELOCITY only when the map has results, else empty. Geometry: one POINT |
| WATR_PUMP | ID, TAG, DESC |
| WATR_VALVE | ID, VALVETYPE, DIAMETER, SETTING, TAG, DESC |
| WATR_CUSTOMER | ID, DEMAND, COUNT, TAG, DESC |

A polyline carries no attributes, so a pipe's data rides on its WATR_PIPE block, a POINT at
mid-run (snap with Node, or pick it with a crossing window). A tank's DIAMETER prompt is the tank
diameter in the length unit; a pipe's or valve's is in the diameter unit.

## Not in this cut

DXF import (Task 772's other half); a layer-prefix control; layers split by diameter (Bentley's
option); lineweights; MTEXT; a background mask behind text (the map's white halo); XDATA.

## Validation

**`dev/lpn-spike/dxf-export-browser-harness.js` clicks the real File menu row in real Chromium**
on Net1 and Net3 lat/lon and asserts one download of a valid R2000 file, the attribute rules, the
style, the scale and the UTM wording; `EC_DXF_BASE_URL=http://localhost:8115/engcalcs/` runs it
against a preview vhost. It exists because the DOM-stub harness below passed while the real page
gave no download at all (2026-10-06): the stub's labels layer `children` was an Array, a real SVG
element's is an HTMLCollection with no forEach, and on a lat/lon project the throw happened inside
the coordinate loader's promise and was swallowed. Any failure now reaches the status line.

The harness reads the file back with its own small reader and asserts R2000, handles and owners,
per-layer counts, vertex counts, attribute values (nodes and pipe blocks), exact grid coordinates,
UTM coordinates and ground lengths, a customer in each kind of project, the lettering, identical
files from three zooms with the view put back, every escape rule (with a mutation that removes the
caret rule and shows the assertion going red), the length cap and its note. With `EC_EZDXF_PYTHON` pointing at a Python that has ezdxf, it
also runs `ezdxf.recover` and `doc.audit()` (2026-10-06, ezdxf 1.4.4: 0 errors, 0 fixes on Net1 and
Net3-Novato-CA-World); without it that line prints NOT RUN. `dxf-parser` (npm) read both files with
the same counts. LibreDWG's web build (`@mlightcad/libredwg-web` 0.7.14) reads DWG only, and no
LibreDWG or ODA binary was available, so neither has read these files. **AutoCAD and BricsCAD have
not opened them yet.**

## Sources

- Autodesk, DXF Reference (AutoCAD 2000 and later): HEADER variables (`$INSUNITS` 0-20), TABLES,
  BLOCK_RECORD, handles and group 330, ATTDEF/ATTRIB, TEXT alignment (72/73 and point 11),
  `\U+` escapes in R2000-2004 text. help.autodesk.com/view/OARX/2024/ENU/ (DXF Reference).
- ezdxf documentation, "DXF File Structure: minimal DXF content" for R13 and later
  (ezdxf.readthedocs.io/en/stable/dxfinternals/filestructure.html).
- AIA CAD Layer Guidelines, US National CAD Standard v5 (Civil layer list C-WATR-*, annotation
  minor groups, rules for user-defined codes).
- New Jersey American Water, "CAD to GIS Submission and Format Conversion" (attributed blocks for
  utility features), via Mary's journal, 2026-10-06.
