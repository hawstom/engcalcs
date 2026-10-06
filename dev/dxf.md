# DXF export (ROADMAP Task 772)

File > Export DXF file… writes **a dumb annotated network** (Tom, 2026-10-06) that any DWG program
opens. Writer: `js/lpn-dxf.js` (pure). Gatherer: `dxfModel()` and `dxfLettering()` in
`js/looped-network.js`. Harness: `dev/lpn-spike/dxf-export-harness.js`. Prior art and the reasons
for R2000, layers and attributed blocks: `dev/agents/market-researcher/autocad-interop.md` and
Mary's journal, 2026-10-06 section B.

## Rules

- **ASCII DXF R2000 (AC1015)**: the oldest version with LWPOLYLINE. `$DWGCODEPAGE` ANSI_1252: a
  character Windows-1252 holds is its byte; any other is AutoCAD's `\U+XXXX`.
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
- **Text height** = the map's current text size × 0.716 (Arial's cap height per em, OS/2
  sCapHeight 1467/2048), because a CAD text height is a cap height and an SVG font size is an em.
  Style Standard uses `arial.ttf`. **Symbol size** = the map's current junction symbol. Both
  therefore follow the zoom at export, and the read-me note says so.
- **Coordinates, and the only claim the file makes about them** (the read-me note):
  - grid project: its own X and Y, exactly (the file's number plus the origin, as the `.inp`
    export writes them); `$INSUNITS` from the length unit (ft 2, m 6). "No coordinate system is stated."
  - project with a stated coordinate system: its numbers unchanged; `$INSUNITS` from that system's
    unit (US survey feet has no R2000 code and is written as feet; the system's name says which).
  - latitude-and-longitude project: converted with `js/lpn-crs.js` (proj4) to the WGS 84 UTM zone
    holding the network's centre, metres, `$INSUNITS` 6. Not the page's Web Mercator frame, whose
    scale is off by 1/cos(latitude). If the conversion cannot load, nothing is written and the
    status line says why.
  - A scenario that moves a node exports that position, as the `.inp` export does.
- **Attributes are all invisible** (flag 1). The visible annotation is the map's own lettering; a
  visible ID attribute would print every ID twice wherever the map shows IDs. `ATTDISP ON` or
  double-click (Enhanced Attribute Editor) shows and edits them. Values are the model's numbers,
  unrounded, in the project's display units; prompts carry the unit.
- **Layer prefix**: `lpnDxfWrite()` takes `layerPrefix`; no control offers it yet.

## Layers

US National CAD Standard v5, AIA CAD Layer Guidelines: discipline C, major group WATR (water
supply). PIPE, EQPM, VALV, TANK, LABL, TEXT, RDME are prescribed codes ("any Minor Group may be used
to modify any Major Group"); NODE, RSVR and CUST are user-defined, which the Guidelines permit when
documented, and this table is that document. ACI colours 1-9 only.

| Layer | Holds | ACI | NCS |
|---|---|---|---|
| C-WATR-PIPE | pipes, LWPOLYLINE through every bend | 5 | listed: "Water supply: piping" |
| C-WATR-EQPM | pumps: LWPOLYLINE + WATR_PUMP block at mid-run | 6 | EQPM "Equipment" |
| C-WATR-VALV | valves: LWPOLYLINE + WATR_VALVE block at mid-run | 1 | VALV "Valves" |
| C-WATR-NODE | junctions, WATR_JUNCTION | 4 | user-defined |
| C-WATR-TANK | tanks, WATR_TANK | 3 | TANK "Storage tanks" |
| C-WATR-RSVR | reservoirs, WATR_RESERVOIR | 3 | user-defined |
| C-WATR-CUST | customers, WATR_CUSTOMER + service LINE | 8 | user-defined |
| C-WATR-LABL | the map's data labels and leaders | 7 | LABL "Labels" |
| C-WATR-TEXT | the project's Text labels | 7 | TEXT "Text" |
| C-WATR-RDME | read-me note (name, coordinates, scale); not plotted | 8 | RDME "Read-me layer (not plotted)" |

## Blocks and attributes

Geometry on layer 0, ByLayer, so each insert takes its layer's colour; unit = one map symbol, the
INSERT scale is the symbol size. Shapes follow the map's silhouettes.

| Block | Attribute tags |
|---|---|
| WATR_JUNCTION | ID, ELEV, DEMAND (base demand, all categories), TAG, DESC |
| WATR_RESERVOIR | ID, HEAD (the effective water surface), TAG, DESC |
| WATR_TANK | ID, ELEV, LEVEL, MINLEVEL, MAXLEVEL, DIAMETER, TAG, DESC |
| WATR_PUMP | ID, TAG, DESC |
| WATR_VALVE | ID, VALVETYPE, DIAMETER, SETTING, TAG, DESC |
| WATR_CUSTOMER | ID, DEMAND, COUNT, TAG, DESC |

Pipe IDs and values are not attributes (a polyline carries none); they are in the drawing where the
map labels them.

## Not in this cut

DXF import (Task 772's other half); a layer-prefix control; layers split by diameter (Bentley's
option); lineweights; MTEXT; a background mask behind text (the map's white halo); XDATA.

## Validation

The harness reads the file back with its own small reader and asserts R2000, handles and owners,
per-layer counts, vertex counts, attribute values, exact grid coordinates, UTM coordinates and
ground lengths, and the lettering. With `EC_EZDXF_PYTHON` pointing at a Python that has ezdxf, it
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
