# WaterCAD migration — what it actually consists of, and what we could offer

Mary, answering Tom's 2026-09-25 note (relayed via the orchestrator) after IOD, a senior civil
engineer, tested `lpn_` and said we need to make migration from WaterCAD easy. Public sources only.
Provenance tagged per entry. I did not buy, demo, or watch a video of WaterCAD — see §5 for what
that cost me.

**One governing fact before the six questions: `dev/positioning.md:88` already states "We are not
running a migration campaign," and line 85-87 reserves any WaterCAD-vs-us comparison page as "a
deliberate decision, not a place to spill this file into," not yet written.** Everything below is
research toward answering IOD's technical question — it is not a green light to publish migration
marketing copy. That is Tom's call, and it would need its own decision, separate from this note.
Also standing: Task 296 bans the live trademark **WaterCAD** from any title, meta description,
tagline, menu item or headline (`dev/positioning.md:43-45`) — that applies to anything public built
from this research, not just the landing page.

---

## 1. What "migration from WaterCAD" concretely consists of

**File types, CITED, Bentley's own "Working with WaterCAD Files" help page**
(`docs.bentley.com/.../GUID-CB3405E601854FB78228AA76DA221380.html`, fetched 2026-09-25):

- **`.wtg.sqlite`** — "the model is contained in a file with the `wtg.sqlite` ... extension, which
  contains essentially all of the information needed to run the model" — physical network, demands,
  operational controls, pump curves, scenarios, alternatives.
- **`.wtg`** — display settings (color coding, annotation) plus a pointer to the sqlite file.
- **A drawing file** (`.dwh`, `.dgn`, or `.dwg`) — the CAD/GIS canvas the model is drawn on, separate
  again.
- Results files are regenerable and not needed for archival — a migrator does not need to bring
  those.

**What WaterCAD already exports, CITED, Bentley's own "Importing and Exporting EPANET Files" help
page** (`docs.bentley.com/.../GUID-B17CEA08-E720-42D5-A340-0BDE4521951C.html`): File > Export >
EPANET writes an `.inp`; File > Import > EPANET reads one. This has existed since at least the
Haestad-Methods era (pre-2004 acquisition) and is still current in CONNECT Edition.

**Known fidelity losses on that export, CITED, three sources:**
1. Bentley's own troubleshooting KB (`KB0057434`, "What are the limitations of importing/exporting
   EPANET files?") exists and is titled exactly on point, but its body is served by a JS-rendered
   ServiceNow portal this environment could not fetch as text — **recording the gap honestly rather
   than guessing at its content.**
2. The OpenEPANET (Haestad-era, pre-Bentley) user forum, three threads, all from **2001-2003** — old
   enough that I flag the date on every claim below rather than let it read as current:
   - *"You will lose any additional information that EPANET 2 doesn't support like variable speed
     pumping, calibration field data, or other model data contained in scenarios (and alternatives)
     other than the one being exported"* — Wayne Hartell, `openepanet.org/Topic/22043` (2003-01-29).
   - *"Be sure none of your labels (nodes, pipes, tanks, etc) have spaces in them ... because they
     will not load right in EPANET,"* *"the tank dimensions usually don't export correctly,"* and
     *"none of the controls on the pumps will export either ... you will have some cleanup to do,
     because it doesn't export perfectly"* — `openepanet.org/Topic/21968` (2002-07-24).
   - *"Bends (vertices) in pipes"* are lost — same thread family, `openepanet.org/Topic/22043`.
   These are 20+ years old and describe pre-CONNECT-Edition WaterCAD; I could not confirm whether
   the tank-dimension and pump-control losses still hold in the current product (see §5).
3. A live, dated Bentley community question titled **"export watercad 2023 to epanet 2.2 units
   problem"** exists (`bentleysystems.service-now.com`, community question, undated body I could not
   read past the header) — its mere existence, on a **2023** version, is evidence the export is
   still imperfect today, even though I could not read what the specific units problem was.

**What is NOT in scope of a bare `.inp` export at all, by definition of the EPANET file format
itself** (a WaterCAD/EPANET fact, not something either vendor needs to document): scenario/alternative
management, fire-flow study settings, Darwin Designer/Calibrator studies, criticality studies,
selection sets, color-coding rules, annotation/label placement styling, and report templates are all
WaterCAD-side constructs with no EPANET `.inp` section to hold them. Exporting one scenario's active
values is not exporting the scenario manager.

**GIS as the other, possibly more important, on-ramp: ModelBuilder.** CITED, Bentley's own
"Preparing to Use ModelBuilder" and "Specifying Network Connectivity in ModelBuilder" pages
(`docs.bentley.com`, WaterCAD CONNECT Edition Help and WaterGEMS SS6 Help, fetched 2026-09-25):
WaterCAD models are frequently *built from* an agency's own GIS layer (shapefile, geodatabase,
Bentley Map, Access/Excel/Oracle/SQL Server tables), not authored by hand — ModelBuilder "connect[s]
pipe ends to nodes, creating nodes at pipe endpoints if none are found," from ordinary spatial
geometry, and a data source "needs to contain a Key/Label field." **This means the utility's asset
GIS — a shapefile of pipes and valves — is frequently a second, WaterCAD-independent path into a
model**, and it is a format this suite's ordinary web/GIS tooling could plausibly read without
touching WaterCAD's file formats at all. This is worth more attention than the `.wtg.sqlite` route
(§2 below), because it does not require reverse-engineering anything proprietary.

---

## 2. Is `.wtg.sqlite` documented, reverse-engineerable, and legally readable?

**Format: yes, plain SQLite, CITED as above** — Bentley's own help text confirms the file "with the
`wtg.sqlite` ... extension" and the file-extension registries corroborate it (`filext.com`,
`filetypeadvisor.com`, both fetched 2026-09-25, both describing it as an SQLite database). **Schema:
NOT documented anywhere I could find.** No published table/column reference, no data dictionary. I
searched specifically for an open-source reader (`github.com` search for "wtg.sqlite," "watercad
parser") and found **none** — no repository, gist, or blog post publishing a schema map or a reader
script. This is a real result, not an oversight: three separate searches, zero hits.

**Legal: reading it is explicitly against the licence you would be under if you held WaterCAD,
which changes the honest advice.** CITED, Bentley's EULA (`bentley.com/wp-content/uploads/eula.pdf`,
2023-10-16 version, fetched via search 2026-09-25): *"you may not decode, reverse engineer, reverse
assemble, reverse compile, or otherwise translate the Software ... except only to the extent that
such activity is expressly permitted by applicable law,"* with a required *"thirty (30) days prior
written notice"* to Bentley before exercising any such legally-permitted exception. This clause
governs *the software*; whether it also purports to govern *a data file the software wrote, which the
licensee owns*, is a genuinely separate legal question US courts have split on for interoperability
reverse-engineering (17 U.S.C. §1201(f) carves out a narrow interoperability exception to the DMCA's
anti-circumvention rule specifically, though that is about circumventing technical protection
measures, and a plain unencrypted SQLite file has none to circumvent). **I am not a lawyer and this
is not legal advice** — the honest, low-risk framing is: reading a schema-less SQLite file that a
*customer* exported from their own paid licence, for that customer's own data, to help that customer
move their own data, is a materially different and lower-risk act than reverse-engineering and
redistributing a general-purpose `.wtg.sqlite` reader as a public tool. The second is the one that
would actually trip the EULA language quoted above; the first is closer to "a customer opening their
own file," a use pattern most reverse-engineering case law (Sega v. Accolade and its descendants, on
interoperability) treats far more sympathetically than commercial redistribution does. **Recommend
against building and publishing a general `.wtg.sqlite` reader; the `.inp` export path and the GIS
path (§1) both avoid this question entirely and should be preferred on that basis alone.**

---

## 3. What a migrator would miss first — WaterCAD features vs. `lpn_` today

Cross-referenced against `dev/agents/market-researcher/epanet-gap-audit.md` (this seat's own
2026-09-24 pass) and `dev/looped-network-calculator-scope.md`, both OBSERVED, current as of that
read; and against the WaterCAD-side feature names, CITED from Bentley's own help pages fetched
today plus general product knowledge of the WaterCAD/WaterGEMS suite (flagged per-row where I could
not fetch a live confirming page).

| WaterCAD feature | Tag | `lpn_` today |
|---|---|---|
| Scenario/Alternative manager (layered overrides: physical, demand, operational, ...) | CITED (Bentley help pages found in search, titles only fetched) | **HAVE, and arguably ahead** — `js/looped-network.js:4642` `scenarioMenuRows()`; EPANET's own desktop GUI has no first-class equivalent either (gap-audit §2). WaterCAD's is *layered* (several alternative types combine); ours is flat per-property overrides on one base network — a real difference in power, not just naming, that a WaterCAD migrator would notice. |
| Fire flow analysis, automated to a target residual pressure | CITED (search result, "WaterCAD supports automated fire flow analysis to maintain both a desired residual pressure at the fire flow node and adequate pressures elsewhere") | **HAVE** — `js/lpn-fireflow.js`, 572 lines (gap-audit). Depth/automation parity not independently verified this session. |
| Pressure-dependent demand (PDD) | CITED (US patent filings on Bentley's PDD algorithm, and Bentley help page titles found in search) | **MISSING.** Confirmed from inside this repo: `js/lpn-inp.js`'s own import-report string says so plainly — `lib/lang.ec.en.php:1863` (`lpn_inp_drop_demand_model`): *"This file asks for a pressure-driven analysis (PDA)... This page solves demand-driven, so every junction here receives the demand the file states, no matter what pressure results."* This is the single gap a WaterCAD migrator doing fire-flow or low-pressure work would hit fastest and the one this suite already tells them about honestly, on import, today. |
| Darwin Designer (least-cost pipe-sizing optimization) | CITED (Bentley help page title, "Advanced Darwin Designer Tips") | **MISSING**, and not close to anything in `lpn_` (no optimization solver in this suite at all). |
| Darwin Calibrator (genetic-algorithm auto-calibration against field data) | CITED (Bentley help page title; a 2013 patent, US8639483, on the underlying criticality/PDD method, confirms Bentley owns patented IP in this space) | **MISSING.** Adjacent to gap-audit's #3 (Calibration data + Report, ROADMAP Task 601) but WaterCAD's version is a full automated genetic-algorithm search over roughness/demand, a materially bigger thing than a calibration *report*. Worth noting so Task 601's scope stays honest about the gap it is NOT closing. |
| Criticality analysis (automated pipe-outage sweep, ranked by impact) | CITED (Bentley help page + patent US8639483 titled exactly "Computer modeling software for analysis of the criticality of elements in a water distribution system") | **MISSING**, no equivalent found in gap-audit or the codebase. |
| ModelBuilder (GIS/Access/Excel/Oracle import to build or update a model) | CITED §1 above | **PARTIAL, different shape.** `lpn_` reads `.inp` character-exact (`js/lpn-inp.js`) but has no GIS-source (shapefile/geodatabase) importer of its own. This is the more promising gap to close (§1, §4) since it does not touch WaterCAD's proprietary formats at all. |
| Color-coded thematic map | CITED (Bentley help page, "Color Coding Your Model") | **HAVE** — gap-audit confirms (`js/looped-network.js:19077-19496`). |
| Annotation / labels | general product knowledge, not independently re-verified this session | **HAVE, and arguably ahead** — multi-property draggable labels (gap-audit's note on Task 482/`dev/positioning.md` §4). |
| Selection sets (named, reusable element groups) | CITED (Bentley help page mentioning "a previously defined selection set") | **PARTIAL** — `lpn_`'s Find-and-replace / query string (gap-audit) answers the same job ad hoc but has no *named, saved* selection-set object to my knowledge; not independently re-checked this session. |
| Reports (Full Report, Status Report, Energy Report as formatted output documents) | general knowledge of WaterCAD's Report Manager, not independently re-verified this session | **MISSING/PARTIAL** — same finding as gap-audit ranked items #1-2 (Full Report, Status Report), both MISSING there. |

**Bottom line for this question:** the fastest thing a WaterCAD migrator notices missing is
**pressure-dependent demand** (fire-flow and low-pressure work depends on it), followed by
**Darwin Designer/Calibrator and Criticality** (three distinct optimization/automation tools this
suite has no analogue of at all — not a gap in degree, a gap in kind). The scenario manager and fire
flow tool, by contrast, are close enough that a migrator would likely feel at home quickly.

---

## 4. Is "export `.inp`, open it here, report every difference" a credible story today?

**More credible than it looks, on the import side — this repo already does most of the honest
half.** OBSERVED, `lib/lang.ec.en.php:1830-1871`: `js/lpn-inp.js` has a purpose-built family of
`lpn_inp_drop_*` strings — one whole sentence per thing that changed and why, covering headloss
formula mismatch, tank curves, TCV/PRV/PSV/FCV/GPV handling, demand patterns, pump curve fitting
(3-point max), rule-based controls, water quality, energy cost data, tags, EPANET's own report
formatting options, and — directly on point for §3 — the **pressure-driven-analysis flag itself**
(`lpn_inp_drop_demand_model`, quoted above). **"We report every difference, never drop silently" is
already true of this importer for standard `.inp` content**, per CLAUDE.md's own standing rule
(`lpn_` section: "Import reports every difference, never rejects, never drops silently").

**What is not yet true, and would need doing before this is a *WaterCAD* migration story
specifically, not just an EPANET one:**
1. **Nobody here has confirmed WaterCAD's exported `.inp` dialect against this importer.** The
   forum-reported quirks (labels with spaces failing, tank dimensions not exporting correctly, pump
   controls dropped, bends/vertices lost) are 20+ years old and about a different product version; a
   current sample file is the only way to know which of those still apply (§5).
2. **Nothing upstream of `.inp` — scenarios, fire-flow study setup, Darwin studies, criticality
   studies, selection sets, annotation styling — is touched by this path at all**, by definition
   (§1). The honest story is "bring your base network and its physical/demand data," not "bring your
   WaterCAD project."
3. **The GIS path (ModelBuilder's own data sources: shapefile, geodatabase) is a second and possibly
   stronger story** — "your utility's own GIS asset layer, the same one WaterCAD itself was built
   from, imports here too" — that sidesteps WaterCAD's file formats and the trademark-naming
   question in `dev/positioning.md` almost entirely, since the claim would be about GIS
   interoperability, not about WaterCAD by name. This is speculative sizing on my part (SPECULATION —
   no GIS/shapefile importer exists in `lpn_` today per the gap-audit's own `.inp`-only import line),
   but it is the lower-friction, lower-legal-risk half of "migration" and deserves separate sizing
   from the WaterCAD-specific half.

**What would make the WaterCAD-specific claim credible:** one real WaterCAD-exported `.inp` file,
run through `js/lpn-inp.js`, with the resulting `lpn_inp_drop_*` messages read against what a
WaterCAD user would expect to have kept. That is a half-day of engineering work *given* the file —
the importer and its message family already exist; the missing input is the file itself (§5).

---

## 5. Can this be done without buying WaterCAD, a demo, or watching a video?

**Yes for the "does the capability exist" question — I answered that from documentation alone,
above. No for the "does our importer actually handle what WaterCAD's export actually writes"
question — that answer requires a sample file, and there is no substitute for one.**

What I could NOT verify from public documentation alone, stated plainly:
- The exact current-version (CONNECT Edition, 2023+) `.inp` dialect quirks — whether the 2002-2003
  forum complaints (spaces in labels, tank dimensions, pump controls, pipe vertices) still hold.
  Bentley's own KB0057434 ("limitations of importing/exporting EPANET files") is almost certainly
  the authoritative current answer and I could not read its body (ServiceNow portal, JS-rendered,
  returned only header/navigation to this tool twice).
- Whether WaterCAD's exported coordinates carry a real-world CRS/projection or an arbitrary drawing
  origin — search results were suggestive but not a directly quotable sentence (`ArcGIS Pro works
  best when the map has a spatial projection assigned` — a third party's advice about a *different*
  conversion path, not a WaterCAD-`.inp` fact).
- Whether current tank/pump/control export losses match the old forum reports.

**What a single sample file would unlock, ranked:**
1. **A WaterCAD-exported `.inp` from a friendly utility or IOD himself** — the cheapest, most direct
   unlock. Run it through `js/lpn-inp.js` today, read the drop messages, done in an afternoon. No
   WaterCAD purchase needed by us; the file already exists on IOD's or the utility's machine.
2. **A single `.wtg.sqlite` file**, only if #1 turns up gaps that look like they originate upstream
   of the `.inp` export (e.g., a scenario/alternative structure a migrator wants preserved that the
   flat `.inp` export necessarily flattens). Given §2's schema-not-documented and legal-caution
   findings, this is a "maybe later, if #1 shows a real need," not a first move.
3. **A sample GIS shapefile/geodatabase export of a utility's own asset layer** — independently
   useful (§1, §4-3) regardless of the WaterCAD question, and the lowest-friction of the three to ask
   a utility for, since GIS layers are routinely shared for entirely unrelated reasons (asset
   management, capital planning) with no software-licence question attached at all.

**Honest bottom line: no purchase, demo, or video is needed to know what to build or to read the
`.inp` output once obtained; a purchase, demo, or video also would not answer the one question that
actually blocks progress (does today's exported `.inp` dialect still have the old quirks) — only a
current sample file does, and that is cheaper and more direct than any of the three ways of buying
access to the software.**

---

## 6. Who — a dedicated WaterCAD-expert seat, or Mary's research plus Sue's vantage point?

**Recommend: no new seat. This is Mary's research (this document) plus whichever engineer among
Tom's contacts (IOD himself, or "Sue" if she is in fact a WaterCAD migrator per Tom's own question)
can supply exactly one artifact: a real exported `.inp` file.** Reasoning:

- The gap between "what WaterCAD does" and "what `lpn_` does" is answerable from public
  documentation, as §1-4 show, and does not require a licence-holder's daily-use fluency to map —
  it requires reading Bentley's own help pages and this repo's own code, both public/OBSERVED.
- The one question that genuinely needs a licence-holder is narrow and factual (§5: "does the
  current export still drop tank dimensions and pump controls"), not a standing expertise a seat
  would exercise repeatedly — a single conversation with IOD, or a single forwarded sample file,
  answers it once. A dedicated seat implies recurring need; nothing found here shows that yet.
- **I could not determine from public sources whether "Sue" is in fact a former WaterCAD user or
  migrator** — Tom's own question ("Or is Sue a migrator from WaterCAD?") is something only Tom or
  Sue can answer; it is not discoverable externally, and I am not inventing an answer to it.
- If Tom does get a WaterCAD-exported `.inp` (or, better, several from different eras/versions), the
  right next step is an engineering pass through `js/lpn-inp.js`'s existing `lpn_inp_drop_*` output
  against it — implementation work, not new research, and squarely inside the existing team's
  competence once the input exists.

---

## Sources

- CITED: Bentley "Working with WaterCAD Files," `docs.bentley.com/LiveContent/web/Bentley%20
  WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-CB3405E601854FB78228AA76DA221380.html`, fetched
  2026-09-25.
- CITED: Bentley "Importing and Exporting EPANET Files,"
  `docs.bentley.com/.../GUID-B17CEA08-E720-42D5-A340-0BDE4521951C.html`, fetched 2026-09-25.
- CITED: OpenEPANET forum, three threads — `openepanet.org/Topic/22043` (2003-01-29),
  `openepanet.org/Topic/21968` (2002-07-24), `openepanet.org/Topic/21784` (2001-07-24) — dates
  confirmed on-page, fetched 2026-09-25.
- CITED: Bentley EULA, `bentley.com/wp-content/uploads/eula.pdf`, version 2023-10-16, quoted via
  search snippet 2026-09-25 (not independently re-fetched as a full PDF this session).
- CITED: Bentley ModelBuilder help pages, "Preparing to Use ModelBuilder," "Specifying Network
  Connectivity in ModelBuilder," both `docs.bentley.com`, fetched/found 2026-09-25.
- CITED: file-extension registries `filext.com/file-extension/WTG`,
  `filetypeadvisor.com/extension/wtg`, fetched 2026-09-25, corroborating SQLite format.
- CITED (title/snippet only, body not readable): Bentley Community KB0057434 ("What are the
  limitations of importing/exporting EPANET files?"), KB0059139 (export-with-labels-then-reimport),
  and a 2023-version community question on units in EPANET export — all ServiceNow-hosted,
  JS-rendered, returned only page chrome to this tool.
- CITED: US Patents 8639483 ("Computer modeling software for analysis of the criticality of
  elements...") and 8635051 (pressure-dependent demand for leak detection), both assigned to
  Bentley/Haestad lineage per `image-ppubs.uspto.gov`, found via search 2026-09-25 — used only to
  confirm Bentley's own naming and ownership of Criticality and PDD as distinct, patented
  capabilities, not read in full.
- OBSERVED: `dev/agents/market-researcher/epanet-gap-audit.md` (this seat, 2026-09-24).
- OBSERVED: `dev/looped-network-calculator-scope.md`, `dev/positioning.md:43-45,85-88,290-314`,
  `lib/lang.ec.en.php:1803-1871,2238`, `js/lpn-inp.js`, `js/lpn-fireflow.js` — all read 2026-09-25.
- **What I could not find, stated plainly:** no published `.wtg.sqlite` schema, no open-source
  reader for it (three searches, zero hits); Bentley's own current-version export-limitations KB
  article could not be read (tooling limit, JS-rendered portal); no PDF text extraction available in
  this environment (no `pdftotext`/`pdftoppm`/`PyPDF2`) to read the one PDF found
  (Autodesk's WaterGEMS/WaterCAD-to-InfoWater-Pro conversion procedure), which likely contains
  exactly the fidelity detail this note is missing from a competing vendor's own migration guide —
  flagging it as the single most promising unread source for a future invocation with PDF tooling.
