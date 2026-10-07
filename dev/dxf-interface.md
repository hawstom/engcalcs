# The DXF Interface Manager: import AND export (Task 772)

**One interface for both directions** (Tom, 2026-10-07: *"To be clear, this DXF idea is for import
and export, not one or the other."*). Not built. Tom's own first specification, 2026-10-07, verbatim. He called it "one simplistic thought"
and a "possible mostly thorough specification". Read it as his starting point, not as settled
rulings: ask him before building any part of it that departs from it.

## Possible mostly thorough specification

Here's one simplistic thought:
- Scope: data only, no annotation
- AutoCAD objects: polylines, points (nodes), and attributed block inserts only.
- EPANET objects: every link is a polyline (3D is flattened; only 2D is used); every node is a point (node) or a block insert
- Data association: if a block insert is a node or is approximately near the middle of a link or at a node, it is assumed to describe the link or node
- Data format: attributes have tags that match EPANET++ property labels or standard letters for the current language (like "Base demand", "Initial quality", "C", "k", "Diameter", "Demand pattern", "Head curve", "Efficiency curve"); spaces can be replaced with underscores or hyphens; these can be customized in the EPANET++ DXF Interface Manager if EPANET++ interprets them wrong.
- Values format: values match the current project units and are imported verbatim.
- Layers, assets, scenarios and alternatives: EPANET++ imports all legal objects on layers with a specified prefix like C-WATR-MODL-. Everything after this prefix is used to specify asset and alternative according to the asset prefixes in the destination project like J___-BASE for a junction on (geometry) alternative Base or R___-0012 for a block insertion that supplies reservoir property overrides for alternative(s) 0012 that can be mapped or renamed at import to a name that matches alternative(s) in EPANET.

## Rudimentary work flow

Tell people to use a points import/export LSP routine and EPANET++ Import survey points just to get things added in the right location.

## Notes for whoever builds it

- "EPANET++" is Tom's working name for the lpn_ page; the visitor-facing name is whatever the page
  says today. Do not put "EPANET++" into a visitor string without asking him.
- **The export on `feat/dxf` was reshaped toward this spec** (Tom, 2026-10-07, asked whether it
  should merge as an annotated drawing export or reshape: *"No. Reshape."*). It now writes data
  only, on C-WATR-MODL-<asset>-<alternative> layers; what it writes is in `dev/dxf.md`. The import
  half is not built: the Interface Manager's import should read exactly what this export writes,
  and the round trip (export, import, byte-identical model) is its first harness.
- **Labeling is a consequence, not a feature** (Tom, 2026-10-07: *"Labels and readme are okay. I just
  don't want to get wrapped around the axle about them. I would like labeling to be a mere
  consequence of the decision to transfer data by attributed blocks."*). So the drawing's labels
  are the blocks' own attributes, shown or hidden by layer, and no further effort goes into
  laying out separate label text in the DXF. Alternatives in a layer name meet
  Task 721 (`feat/bentley-interop`), which owns the alternatives model.
- **Two of his calls on the export (2026-10-07):** the read-me is one MTEXT, the only entity that is
  not a polyline or an attributed block insert; and BASE_DEMAND is the aggregate (sum) of a junction's
  demand categories, since the file does not carry the full list.
- "Values verbatim in the project units" is CLAUDE.md's rule that only the user touches a file's
  numbers.
