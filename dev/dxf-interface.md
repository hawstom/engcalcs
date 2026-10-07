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
- **The export on `feat/dxf` is not yet this spec.** It writes annotation (labels, a read-me note)
  and puts attributes on C-WATR-ATTR-* layers per property; this spec is data only, with the asset
  and alternative in the layer name after a prefix such as C-WATR-MODL-. Reconcile before either
  side grows: the Interface Manager's export should write exactly what its import reads, and the
  round trip (export, import, byte-identical model) is the first harness. Whether today's
  annotated export stays as a separate "drawing" export beside a "model data" one is his call. Alternatives in a layer name meet
  Task 721 (`feat/bentley-interop`), which owns the alternatives model.
- "Values verbatim in the project units" is CLAUDE.md's rule that only the user touches a file's
  numbers.
