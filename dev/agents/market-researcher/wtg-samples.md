# Task 749: hunt for a real WaterCAD/WaterGEMS `.wtg.sqlite` sample (2026-10-17, Arizona)

## Bottom line

**Found. Three public, no-login sample sets exist, and one of them has a child scenario and the same model as an EPANET `.inp`.** The earlier search missed them because Bentley files are binary and GitHub's own code search does not index them (and needs a login). Sourcegraph's path search and the Zenodo API found them in minutes.

Best lead: **Zenodo record 7162154**, "WaterGEMS models for flow starved water transmission network", Sinha, Ghorpade, Damani, Kalbar (IIT Bombay), published 2022-07-29, **CC BY 4.0, open access, no login**, DOI 10.5281/zenodo.7162154. One 795 KB `.rar`.

I downloaded and inspected (read-only, `sqlite3` module via `python3 -I`, nothing executed) into `/tmp/claude-1000/-home-haws-webdev-hawsedc-com-engcalcs/ed416eba-df76-4fb3-affc-2f4a618ced1e/scratchpad/samples/`. Nothing is in the repository. Redistribution: CC BY 4.0 allows it with attribution; MIT allows it with the copyright notice. Neither file set has Bentley terms attached to it that I could see. Whether Bentley's EULA (reverse-engineering clause, see `dev/bentley-interop.md`) reaches a third party's published data file is still Tom's question, unchanged.

## FOUND (cited / observed)

### A. Zenodo 7162154 (best)
- URL: https://zenodo.org/records/7162154 ; file `Supplementry information-2.rar` (sic), 794,555 bytes; direct: https://zenodo.org/api/records/7162154/files/Supplementry%20information-2/content (use the URL-encoded file name from the record page).
- Licence: CC BY 4.0, access_right "open". Download: anonymous, worked with plain `curl`.
- Contents (listed from the RAR headers, then extracted with the `node-unrar-js` npm package into its own directory):
  - `WaterGems model/` three models, each `.wtg` (XML, presentation) + `.wtg.dwh` + **`.wtg.sqlite` (7,102,464 bytes each)** + result files `_1_58.out/.rpc`; one has `.wtg.scm`, and the EPS model has `.01.bak` backups.
    - `EPS_Badapokharan_Operation as per design_base_model` (extended-period)
    - `Badapokharan_MBR_withdrwal capacity curve` **(has child scenario)**
    - `Badapokharan_MBR_Pumped network inflow`
  - `EPANET Model/EPS_Badapokharan_Operation as per design_base_model.inp` (10,843 bytes, 237 lines, Units LPS, Headloss H-W, 20 junctions, ~17 reservoirs, 33 pipes) **= the same model as the EPS `.wtg.sqlite`**. Also a `.net` (EPANET 2 GUI binary-ish file) for a "Two reservoirs network".
- **Scenarios, OBSERVED in `Badapokharan_MBR_withdrwal capacity curve.wtg.sqlite`:** `HMIScenario` rows: 1 (deleted), 58 "Base" (root), **136 "Scenario - 1" with ParentID 58 (child)**, 137 "Scenario - 2" (root, no parent). In `HMIScenarioAlternative`, scenario 136 has all 18 rows with `IsLocal = 0`; 58 and 137 have `IsLocal = 1`. So: **a child scenario exists and the inheritance flag is visible.** Weakness: the child inherits every alternative, so **no value differs from Base**; I found no row where a child overrides anything. Alternatives 138 to 141 (type 4, Physical) exist, 140 and 141 not deleted, but no scenario points at them. So it demonstrates the scenario tree and `IsLocal`, not a real override. The other two models have only Base.
- **Rosetta stone, OBSERVED (EPS model, `.inp` vs `.wtg.sqlite`):** pipe P13 diameter `.inp` 200 (mm) vs database `Physical_PipeDiameter` 0.65617 = 200 mm in **feet**; P12 150 vs 0.49213 (150 mm in ft). Node J57 elevation `.inp` 13.1 (m) vs database `Physical_NodeElevation` 42.979 (= 13.1 m in ft). Hazen-Williams C 140 equals 140. Pipe length is not a straight match: P13 `.inp` 290 vs `HMIGeometryScaledLength` 1160.7 (ft), 353.8 m; the `.inp` probably carries the user-defined length and the database holds both. Not resolved.
  - Inference from that one model (SPECULATION until a second metric model agrees): **the database stores lengths in feet whatever the display units**. The task's "storage unit per field" wording in `dev/bentley-interop.md` may reduce to "fixed internal units". Check Tnet0 below, which stores 3.937 for a 100 mm pipe (inches?) next to 8.25 and 0.6667 (ft) elsewhere, so it is not that simple.
- Schema, OBSERVED (384 tables in each file): `HMISchemaVersionInfo` core schema 1.0.38.0 (2015-07-14 born); `.wtg` header `ProductVersionCreated="10.1.1.4"`.

### B. GitHub glorialulu/TSNet (MIT)
- URL: https://github.com/glorialulu/TSNet ; MIT, copyright 2019 Lu Xing; repo 89,903 KB, last pushed 2023-09-21.
- `examples/networks/tnet0_hammer/Tnet0.wtg.sqlite` (6,881,280 bytes) and `examples/networks/tnet3_hammer/tnet3.wtg.sqlite` (7,086,080 bytes), plus `.wtg`, `.wtg.dwh` and HAMMER outputs. Public, no login.
- Companion `.inp`: `examples/networks/Tnet0.inp`, `Tnet3.inp`. **Not the same model**: Tnet3.inp has 169 pipes (GPM); the sqlite has 172 live pipes (3 more, pumps modelled as pipes named `PUMP-172-A`), so the sqlite was evidently imported from the `.inp` and then edited for HAMMER (transient) work. Tnet0.inp has 2 pipes, the sqlite 4. `.wtg` header: `ProductVersionCreated="8.11.6.113"` (V8i SS6 era, older than A).
- Scenarios: **Base only** in both (`HMIScenario` 58 root; no child). Useful for the older schema revision, and for HAMMER tables (`Hammer_*`), not for scenarios.
- Geometry, OBSERVED: `HMIGeometry` is a 21-byte blob `01 01 00 00 00` + two little-endian doubles = a **standard WKB Point** (byte order 1, type 1, x, y). Readable without any Bentley code.

### C. Bentley "Water Fundamentals" and "Water Advanced" workshop datasets (login required: do not use)
- Pages: https://bentleysystems.service-now.com/community?id=community_document&sys_id=988804aa47394610e3378d53636d4393 (Fundamentals, US, zip 29,377,911 bytes), `...f62a00ee47394610e3378d53636d4357` (Fundamentals, SI, 17,665,719), `...2e88086e1b714610dc6db99f034bcbe9` (Advanced, US, 23,961,454), `...cea03e431b2bea14c864a683604bcb7a` (Advanced, SI, 31,428,815). Listed in Bentley KB0057090 "Learning Resource Guide for new users of WaterGEMS and WaterCAD".
- The page says "You must sign-in first, then you will see the download button"; the attachment URL returned 403 and the `sys_attachment.do` URL redirected to login. I did not go further. A free Bentley account (the one Tom is getting with the EWB licence) would very likely unlock them. The course (YouTube playlist PLLCOESNdmKSJAaqcqkfZJqw4eIEpB-NAC) has workshops built for WaterCAD CONNECT; whether one saves a child scenario is NOT CONFIRMED (the Fundamentals course does teach scenarios, but I did not see the workbook).
- Terms: not read (behind login). Treat as not redistributable until read.

### D. Samples inside the Bentley install (not downloadable)
- `...\Bentley\OpenFlows Water\Samples\` (KB0040598) and the "Lessons" folder (KB0057090); named examples `Example4.wtg` (DMAs), `Example5.wtg` (hydrant-flow calibration). Covered by the product licence. Tom's EWB licence would put these on his disk.

### E. Other places searched, found nothing usable
- GitHub repo-name search: `watergems`, `watercad`, `openflows`, `haestad`, `wtg sqlite`, `wtg.mdb`, `watercad inp` etc. hold only code (worthapenny/* toolkits, `virajsheth123/AI_WebSocket` has only Visual Studio indexes, `jd-sjwd/watercade` is a game). GitHub code search needs a login; **Sourcegraph path search** (`file:\.wtg\.sqlite$`, with forks and archived) returned exactly the two TSNet files. `.wtg.mdb` and `.stsw`: no hits. The `.wtg` extension is swamped by Warcraft III triggers (ignore).
- Zenodo API: "WaterGEMS" 10 hits, "WaterCAD" 2 hits. Besides 7162154: 23010723 and 23270307 (CC BY 4.0 reproducibility packages for irrigation-network papers; contain 90 EPANET `.inp` and WaterGEMS cross-check results, not `.wtg.sqlite` by file listing of 23010723: one zip, contents not unpacked). Figshare: only figures (PLOS Bibile water supply, calibration models shown as images). Mendeley, OSF, Kaggle, HydroShare: not searched effectively (no usable API call made); say "not checked", not "nothing there".
- The Zenodo "DiTEC-WDN" dataset (arXiv 2503.17167) is EPANET scenarios, not Bentley files. Not examined further.
- Piracy mirrors of WaterCAD installers and Scribd/CourseHero/Studocu tutorials appeared; not used, not linked.

## Schema documentation (no sample needed)

- No public document of the table layout turned up. The schema is now **read from real files** (above) and is much more regular than the patent text suggests. OBSERVED facts (all from A and B, treat as "seen in 5 files, versions 8.11.6 and 10.1.1"):
  - **Scenario tree:** `HMIScenario(ScenarioID, ParentID, IsDeleted, DomainDataSetID)`; scenario name is in `HMIModelingElement.Label` (ElementID = ScenarioID, `ElementType = 2`). `HMIDomainDataSet.ActiveScenarioID` names the active scenario.
  - **Scenario to alternative:** `HMIScenarioAlternative(ScenarioID, AlternativeTypeID, AlternativeID, IsLocal)`: 18 alternative types per scenario (1 Geometry, 2 Topology, 3 Active Topology, 4 Physical, 14 SCADA?, 20-31 Demand/Initial Settings/Operational/Age/Constituent/Trace/Fire Flow/Energy Cost/PDD/..., 50 Transient, 51 Failure History, 100 User Data Extensions; names from `HMIModelingElement.Label` such as "Base Physical").
  - **Alternative tree:** `HMIAlternative(AlternativeID, ParentID, AlternativeTypeID, IsDeleted, DomainDataSetID, Level)`. **Soft delete is everywhere** (`IsDeleted`): a fresh file carries the deleted default rows (ScenarioID 1, Alternatives 2 to 19, Elements 1 to 29) beside the live ones, so every query must filter `IsDeleted = 0` or it reads ghosts.
  - **Values per alternative:** one `<Class>_<Group>_Data` table per element class and topic, keyed `(DomainElementID, AlternativeID)`: `IdahoPipe_Physical_Data` (diameter, material, Hazen-Williams C, Manning n, Darcy e, minor-loss fields, check valve), `BaseIdahoNode_Physical_Data` (elevation), `BaseIdahoNode_HmiDataSetGeometry_Data` (WKB point), `BaseLink_HMIDataSetTopology_Data` (`HMITopologyStartNodeID`, `HMITopologyStopNodeID`), `IdahoDemandNode_Demand_DemandCollection` (several demands per node: ItemID, BaseFlow, DemandPattern), `IdahoPipe_InitialSettings_Data`, `IdahoReservoir_Physical_Data` (`Physical_HglPattern`), plus `Hammer_*` tables. Element identity: `HMIDomainElement` (type, IsDeleted) joined to `HMIModelingElement` (Label, ElementType: 1 alternative, 2 scenario, 3 network element, 4 pattern/curve-like support, 5 calculation options).
  - **Calculation options** per scenario: `HMIScenarioCalculationOptions` -> `EpaNetEngine` (42 columns, the EPANET-engine settings).
  - **Geometry:** WKB, SRS in `IdahoDataSet.HMIDataSetGeometrySpatialReference`.
- **Not verified:** that the child-override encoding is "child alternative row replaces base row for that `(element, alternative type)`". That needs a model where a child actually overrides a value (none found yet).
- Prior art on Bentley-published pieces (already in `dev/bentley-interop.md`): KB0058225 (HMIModelingElement), KB0058121 (`DomainElementID, AlternativeID`), KB0015674 (6 GB files). New API note: KB0058158 says a new simpler "WaterObjects API" exists with .NET and Python for BDN members (April 2026), not downloadable yet.

## INFERRED (not sourced)

- SPECULATION: the cause of the earlier null result is that binary files do not surface in text search. A Sourcegraph path search is the right tool for the next such hunt.
- SPECULATION: more public models exist in authors' university or city project folders that no index reaches; the Zenodo "WaterGEMS" keyword may under-count because many authors write "Bentley" or "water supply network".
- SPECULATION: Bentley's own workshop `.wtg.sqlite` files (C) probably contain a model with a child scenario.
- SPECULATION: the database stores lengths in feet and elevations in feet whatever the display unit (from one model). Tnet0 contradicts a simple rule (see A).

## Suggested next steps (for the orchestrator; I changed no repo file)

1. Use Zenodo 7162154 as the first fixture: decode the EPS model against its `.inp` (33 pipes, 20 junctions, ~17 reservoirs is small enough to verify by hand), then the "withdrwal capacity curve" model for the `ParentID`/`IsLocal` structure.
2. Still missing: **a model where a child scenario actually overrides something**, ideally with its `.inp`. Tom's EWB-licence model fills it: copy the 2 files, add a child scenario, change one pipe diameter and one demand in the child, export `.inp` for Base and for the child.
3. Keep the fixtures out of the repository unless Tom accepts CC BY attribution text (a one-line credit); the cleanest option is a pointer in `dev/` and a download step, as for the Kentucky networks.
4. The EULA question (does it reach a third party's published data file) is not answered by any of this.

## Plain words for Tom

Yes, we found real samples. The best one is a free, public research download (CC BY 4.0, from IIT Bombay) with three WaterGEMS models and an EPANET version of one of them, so we can line up what is in Bentley's file against what EPANET says. One of the three models has a child scenario ("Scenario - 1" under Base), but the child just inherits everything from Base; nothing in it is changed. A second source on GitHub (MIT licence) has two older Bentley models for pipe-surge work, with base scenario only. The Bentley training datasets, which very probably do show scenarios properly, need a free Bentley sign-in, so I did not touch them; once your EWB licence gives you an account, those are the next thing to grab. What is still missing: a model where the child scenario really changes a number (a pipe diameter, a demand), saved with its matching `.inp`. If you make one with your licence (Base plus one child that changes one pipe and one demand, exported both ways) that last gap closes.

