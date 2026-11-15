# "Asset", "element", "component", "feature": how the industry uses them (Mary, 2026-11-14)

## 1. What the page says to visitors now (OBSERVED, lib/lang.ec.en.php, this worktree)

- "asset(s)": 239 occurrences in 165 lines (comments included); in visitor-string lines only, 199 occurrences in 128 lines.
- "element(s)": 38 occurrences in 32 lines; visitor-string lines only, 21 occurrences in 17 lines.
- For scale, "node(s)" 217 and "link(s)" 127 occurrences in visitor strings.
- "asset" is the generic word for any node or link ("Select an asset on the map", "Connected asset", "Several assets selected", "Results by asset"). "element" survives in about seventeen strings (curve "used by elements", "{n} selected elements are not junctions", dangling controls and rules, DXF import notes, duplicate IDs) and in dev/terms.md ("ID (element identifier)").
- Mixed use is already visible: "{n} selected elements are not junctions" sits beside "Select an asset on the map".

## 2. How the industry uses the words

- **EPANET manual** (the vocabulary the project says it defers to): "physical components" (Section 3.1: "a collection of links connected to nodes"), "non-physical components" (3.2: "three types of informational objects - curves, patterns, and controls"), and "objects" (chapter 6 "Working with Objects": physical objects on the map vs non-physical objects). It does not use "asset" or "element" in those passages. CITED https://epanet-manual.readthedocs.io/en/latest/3_network_model.html
- **WaterGEMS / WaterCAD / SewerGEMS**: "element" is the word. Every model object, node or link, is an element. CITED https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-18AEF6FB09C64852B4F9DC4CB853C4BE.html
- **Qatium** (a newer water-model product): "element" throughout ("Element Identifier (ID)", "Properties common to all elements"); "Asset" appears only as a table column header, and split pieces are "part of the original pipe". CITED https://help.qatium.com/en_US/Properties-common-to-all-elements/element-identifier-id
- **ArcGIS Utility Network**: "asset" is a classification, "asset group" (major) and "asset type" (minor), and "network features" is "the term ... to refer generally to assets represented in the utility network data model." Feature classes are Device, Line, Junction, Assembly; an Assembly is "a container for other network features such as devices and junctions." CITED https://pro.arcgis.com/en/pro-app/3.4/help/data/utility-network/utility-network-vocabulary.htm . So Esri uses "feature" for the generic thing and "asset" for what a feature represents. Esri also has a feature class called Junction that is a physical connectivity point.
- **ISO 55000** (and AWWA asset-management practice that follows it): an asset is an "item, thing or entity that has potential or actual value to an organization"; the IAM glossary adds that a grouping of assets (an asset system) can itself be an asset. Same wording in the 2014 and 2024 editions. CITED https://theiam.org/knowledge-library/glossary/ and https://www.directives.doe.gov/terms_definitions/asset (secondary quotation; I did not read the standard).
- **InfoWater Pro** vocabulary: not confirmed this session (help pages 403); journal 2026-10-10 found only "Merge Node, Switch Node, Change ID."

## 3. How modelling software links model objects to asset records (this answers Tom's brainstorm directly)

- WaterGEMS has a **GIS-IDs property on every element, and it is a collection**. Quotes: "GIS-IDs are managed as a collection property (capable of holding any number of GIS identifiers)"; "If the GIS-IDs collection is empty, there is no association between the GIS and this element"; "If there are multiple entries, this element is associated with multiple records in the GIS"; "More than one element in the model can have the same GIS-IDs." CITED https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-18AEF6FB09C64852B4F9DC4CB853C4BE.html
- Skeletonization: merging pipes keeps the GIS-IDs of every source pipe on the merged element; one model pipe can stand for several GIS pipes, and a split model pipe can point back to one GIS pipe. Risk Bentley names: a later GIS change to one merged pipe cannot keep the model hydraulically equivalent; they advise one-way flow, GIS into the model. CITED (search summary of) https://communities.bentley.com/products/hydraulics___hydrology/w/hydraulics_and_hydrology__wiki/36709/keeping-a-hydraulic-model-in-sync-with-a-gis (page would not load).
- Morph, split, merge and delete carry the GIS-IDs (same source family).
- AWWA/EPA asset-management guidance on the model-to-register link: NOT FOUND. Practitioner sources say the weak point is that GIS, CMMS and field tools share no common asset ID (Fulcrum, https://www.fulcrumapp.com/blog/water-asset-management-starts-with-connecting-hydrant-valve-and-meter-records/). I found no source describing pipe-segment-to-asset-ID mapping itself.

## 4. What this means for Tom's three ideas (SPECULATION, re-derive before use)

- "A junction is not an asset": industry-consistent. EPANET calls it a modelling component. Esri has a Junction feature but classes it as connectivity, and Esri puts the physical stuff in Device and Assembly.
- "A junction may hold a collection of assets, possibly empty": this is WaterGEMS's shipped design, a list of external IDs that may be empty, one-to-many, and shared. It is not a new idea; it is the known idiom. The market's word for the list's entries is "GIS-ID" (a record identifier), not "asset".
- "All elements may hold such a collection, for asset management only, not modelling": also matches WaterGEMS (every element has it) and keeps it out of the solve.
- The word: the modelling vendors (EPANET "component/object", Bentley and Qatium "element") do not call the generic thing an asset. Esri and ISO 55000 do, but mean the physical item whose life is managed. The page's generic use of "asset" for a node or link is closer to Esri's "network feature" than to ISO's asset, and a pipe-and-junction model object is not an ISO asset by itself. Reverting the generic word to "element" would follow Bentley and Qatium; no EPANET-manual word is generic. Whichever is picked, "asset" survives as the name of the linked record.
