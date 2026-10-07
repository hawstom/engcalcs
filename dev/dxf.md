# DXF export (ROADMAP Task 772)

File > Export DXF file… writes **the model's data as attributed blocks**, per Tom's DXF Interface
Manager specification (`dev/dxf-interface.md`; Tom, 2026-10-07, on the first cut, an annotated
drawing: *"No. Reshape."*). Writer: `js/lpn-dxf.js` (pure). Gatherer: `dxfModel()` in
`js/looped-network.js`. Harnesses: `dev/lpn-spike/dxf-export-harness.js` (DOM stub) and
`dev/lpn-spike/dxf-export-browser-harness.js` (real Chromium, clicks the File menu row). Prior art
and the reasons for R2000 and attributed blocks: `dev/agents/market-researcher/autocad-interop.md`.

## Rules

- **Data only.** Entities are LWPOLYLINE, INSERT, ATTRIB, SEQEND and the one MTEXT read-me, nothing else: every link a
  polyline through every bend, every element an attributed block (a link's at mid-run), a
  customer's service line a two-point polyline. No TEXT, LINE or MULTILEADER. Tom allowed
  annotation only as MLEADER; MULTILEADER is an AutoCAD 2008 entity (in the AutoCAD 2008 DXF
  Reference, not the 2000 one this file follows) and needs an MLEADERSTYLE object besides, so free
  annotation was dropped, which his note allows (*"people will mostly use this for geometry
  transfer"*). The labels a CAD user sees are the blocks' attributes.
- **Layers: `C-WATR-MODL-` + asset code + `-` + alternative**, e.g. `C-WATR-MODL-J___-BASE`.
  - The prefix is one constant, `MODEL_PREFIX` in `js/lpn-dxf.js`; `lpnDxfWrite()`'s `layerPrefix`
    replaces it (the Interface Manager's future control).
  - The asset code is the project's ID prefix for that type (Settings > ID prefixes), capitals,
    letters and digits only, padded with `_` to four: J___, R___, T___, L___ (pipe), P___, V___,
    C___ (customer) by default. If any type's prefix is empty, or two types would share a code, the
    built-in set is used for all.
  - The alternative is `BASE` on Base; on another scenario it is that scenario's name in capitals
    (page locale), letters and digits of any script kept, every other run made `_`, and the whole
    network as that scenario has it is written. A character Windows-1252 lacks goes out as
    `\U+XXXX` (ezdxf, "DXF File Encoding": the R2000-R2004 schema, which the R2000 extended symbol
    names take; AutoCAD EXTNAMES = 1 allows any character "not used by Microsoft Windows and AutoCAD
    for other purposes"). Every scenario is coded in project order, so two names that encode alike
    get `_2`, `_3`; a name with nothing left takes its scenario ID. Never `BASE` for a non-Base
    scenario. An overrides-only
    layer per alternative, as the spec's `R___-0012` describes, waits on Task 721.
  - Each element's attributes are on its block's layer (ATTDEF on layer 0, which resolves to the
    insert's layer), so freezing a layer hides an asset type with its attributes.
  - The read-me is on `C-WATR-RDME`, outside the model prefix so an import never reads it as an
    asset; ACI 7 (white), not plotted (290 = 0).
- **ALL CAPS** (Tom: *"ALL CAPS in AutoCAD."*): layer names, block names, tags, prompts and the
  read-me, upper-cased in the page's locale (Turkish DERİNLİĞİ). Attribute values are the user's data and stay as typed.
- **Tags are the property labels** in the page's language, capitals, spaces made `_` (AutoCAD
  refuses spaces and `!` in a tag): ELEVATION, BASE_DEMAND, HEAD, WATER_DEPTH, LOWEST_WATER_DEPTH,
  HIGHEST_WATER_DEPTH, TANK_DIAMETER, DIAMETER, LENGTH, ROUGHNESS, VALVE_TYPE, SETTING,
  NUMBER_OF_SERVICES, TAG, DESCRIPTION, plus ID. A clash within one block gets `_2`. The visible
  ID attribute is found by property, never by the text "ID", which a translation changes. The prompt is
  the label with its unit. No solve results (an import has no property for them).
- **Values verbatim** in the project's display units, as typed: `EngCalcs.lpnNumText()` hands back
  a number's kept token (Net3's `4530.`), as the `.inp` export does (CLAUDE.md: only the user
  touches a file's numbers). BASE_DEMAND is the sum of every demand category's base, the same
  `baseDemandTotal()` the table and label show (Tom: *"If we aren't exporting the full list of demand
  categories, we must export the aggregate base demand."*); a single category is written as typed.
  The read-me counts junctions with more than one category and says the attribute is their sum.
- **Attribute height 1, INSERT scale 1** (Tom: *"attribute height is 1 so that user can scale the
  blocks to their standards"*). Block geometry is in the same unit: a junction is 1 across, a tank
  3. The file therefore no longer depends on the map's zoom or text size.
- **The ID attribute is visible; every other is invisible** (flag 1; Tom, 2026-10-06). Every
  A pump or valve inserted at 90-270 degrees turns its attributes a half
  circle, right- and top-justified on the same point, so they read upright.
- **Read-me**: one MTEXT on `C-WATR-RDME` (Tom: *"The RDME should be MTEXT, not an attributed
  block."*; R2000 groups 100 AcDbMText, 10/20/30, 40 height 1, 71 top left, 72, 3 and 1 text in
  chunks of 250, 7 Standard), one paragraph per line: project name; the
  coordinate statement (a grid project's unit as its English name, ft or m); the layer pattern, scale-1 and ATTDISP note; and, if any, how many values
  were shortened, and how many junctions have more than one demand category. Plain ASCII quotes (Tom: *"Don't use fancy quotes in the README."*).
- **Text style Standard on `txt`** (group 3, the STYLE record's primary font file). It was blank,
  and AutoCAD showed the text in Arial while editing (Tom, 2026-10-07, TEDIT); `txt` is what
  AutoCAD writes for Standard. Only the read-me MTEXT names a style (group 7, Standard).
- **ASCII DXF R2000 (AC1015)**, every object with a handle and an owner (330), `$HANDSEED` above
  them all; structure per the Autodesk DXF Reference and ezdxf's minimal R2000 content, plus the two
  LAYOUTs and the plot-style placeholder AutoCAD 2000 writes. **No XDATA** (Tom: invisible to users).
- **One escape for every string** (`escapeParts()`/`str()`): ANSI_1252 bytes, else `\U+XXXX`, `?`
  outside the BMP; a literal caret `^ `, a control character in caret form; a backslash `\U+005C`;
  where `%%` occurs every `%` is `%%%`; 2049 characters at most, cut between whole escapes and
  ending in `...`. Table names also have `<>/\":;?*|=`` ` `` made `_`.
- **Coordinates, and the only claim the file makes about them** (the read-me):
  - grid project: its own X and Y, exactly; `$INSUNITS` from the length unit.
  - stated coordinate system: its numbers unchanged; `$INSUNITS` from that system's unit (US survey
    feet has no R2000 code and is written as feet; the system's name says which).
  - latitude and longitude: converted (proj4) to the WGS 84 UTM zone holding the network's centre,
    metres, `$INSUNITS` 6, **never degrees**; the read-me and the status line both say so. Outside
    80° S to 84° N, nothing is written and the status line says why.
  - a scenario that moves a node exports that position, as the `.inp` export does.

## Not in this cut

DXF import (the Interface Manager's other half); a layer-prefix control; overrides-only alternative
layers (Task 721); the menu move to File > Export… (`feat/geojson`'s `exportMenuRows()`, which
renames this row's key to `lpn_file_export_item_dxf` at its merge); XDATA.

## Validation

The stub harness reads the file with its own reader and asserts R2000, handles and owners, the
layer pattern, ALL CAPS, entity kinds, attribute height and scale, ATTRIB-on-insert-layer, STYLE
`txt` and no Arial, per-layer counts, vertex counts, tag names and values, exact grid and UTM
coordinates, ground lengths, a customer in each kind of project, the ID-prefix and scenario layer
names, every escape rule, the length cap and its read-me line, with mutations (caret rule, font)
that show the assertions going red. The browser harness clicks the real File menu row on Net1 and
Net3 lat/lon and asserts one download and the same rules. With `EC_EZDXF_PYTHON` set to a Python
with ezdxf, both run `ezdxf.recover` and `doc.audit()` (2026-10-07, ezdxf 1.4.4: 0 errors, 0 fixes).
Tom opened the first cut in AutoCAD on 2026-10-07 (*"it came into AutoCAD"*); this reshape has not
been opened in AutoCAD yet.

## Sources

- Autodesk, DXF Reference (AutoCAD 2000 and later): HEADER (`$INSUNITS` 0-20), TABLES, STYLE
  (group 3 primary font file name), LAYER (290 plotting flag), BLOCK_RECORD, handles and group 330,
  ATTDEF/ATTRIB, `\U+` escapes. help.autodesk.com/cloudhelp/2016/ENU/AutoCAD-DXF/ (STYLE:
  GUID-EF68AF7C-13EF-45A1-8175-ED6CE66C8FC9).
- Autodesk, AutoCAD 2008 DXF Reference (MULTILEADER), damassets.autodesk.net acad_dxf_2008.pdf.
- Autodesk, AutoCAD 2026 Help, "About Substitute Fonts" (GUID-928DF015-1E04-4CC2-AF1B-0037548DFBAE).
- ezdxf documentation: "minimal DXF content"; STYLE table (Standard written with font `txt`).
