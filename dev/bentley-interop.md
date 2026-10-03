# Bentley interop: reading and writing WaterGEMS/WaterCAD models

Feasibility spike, 2026-09-30, branch `feat/bentley-interop`. Tom, 2026-09-30: *"We can see how far
we get reading and writing the Bentley .sqlite file also. We should open a branch for
bentley-interop."*

Provenance tags: **CITED** (URL), **OBSERVED** (something run or measured here, with the path),
**SPECULATION** (inference not yet checked against a real file).

## Verdict

- **Reading `.wtg.sqlite` directly: no-go for now, not never.** The container is plain SQLite, which
  a browser can open. What is inside is undocumented, we have no file to look at, and the one
  public description of the storage design says values are stored per alternative and inherited,
  with a storage unit per field. A reader written without a real file would be guesswork.
- **Writing `.wtg.sqlite`: no-go.** Producing a database WaterGEMS opens without complaint means
  reproducing an undocumented, versioned schema and its internal invariants exactly. A model that
  opens but is subtly wrong is worse than a refusal, and we could not tell the two apart.
- **The door that already works is EPANET `.inp`.** WaterGEMS and WaterCAD both import and export
  EPANET files (File > Import/Export > EPANET), and we read and write `.inp` character-exactly on
  Net1/2/3. The useful interop work is measuring what a Bentley-exported `.inp` contains and what our
  importer reports about it.

## What was found

### The file set

- **CITED.** A model is a `.wtg.sqlite` (the model itself: "essentially all of the information
  needed to run the model"), a `.wtg` (display settings: colour coding, annotation), and for the
  stand-alone platform a `.dwh` drawing file. Bentley says the `.wtg.sqlite` "can be zipped to
  dramatically reduce its size".
  <https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20Help%20SS6-v1/en/GUID-CB3405E601854FB78228AA76DA221380.html>,
  <https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-CB3405E601854FB78228AA76DA221380.html>
- **CITED.** Bentley's API opens either the `.wtg` or the `.wtg.sqlite`: pyofw stub for
  `OpenFlows.IWater.Open`, *"Can be the project (wtg) file or the sqlite database."*
  <https://github.com/worthapenny/pyofw> (`src/pyofw/typings/pyofw/OpenFlows/IWater.pyi`, line 86).

### The schema

- **CITED: Bentley does not publish the table layout.** Every search of Bentley's help, the
  Bentley Communities forum and GitHub found no table-level description. The supported route is the
  WaterObjects.NET / OpenFlows Water API, which runs only alongside an installed, licensed Bentley
  product. Example: `IdahoDataSource` opened with `ConnectionType.Sqlite` and
  `EnableSchemaUpdate = false`,
  <https://github.com/worthapenny/WO-Open-WaterGEMS-WaterCAD-Database>. pyofw's own README: *"will
  not add any value without Bentley's OpenFlows application"*, <https://pypi.org/project/pyofw/>.
- **CITED: Bentley's support articles leak some names.** An MDB-era query Bentley published reads
  `HMIModelingElement` (columns `ElementID`, `Label`, `IsDeleted`) joined to `HMISelectionSet`, and
  says that for SQLite-era models *"you'll need to use a different application that can work with
  SQLITE databases"* (KB0058225). A CONNECT Edition error names the SQLite columns
  `DomainElementID, AlternativeID` and the method `MakeRecordLocalBasic` in
  `SqliteAlternativeRecordDataBrokerBase` (KB0058121). Articles are read through the public API
  `https://bentleysystems.service-now.com/api/sn_km_api/knowledge/articles/<KB number>`; the
  community pages themselves render only in a browser.
- **CITED: the storage design, from Bentley's patent** US10311051B1, "Storing modeling alternatives
  with unitized data", assignee Bentley Systems, naming WaterGEMS V8i and WaterCAD V8i:
  an Element table (ID, type), a Scenario table (one alternative ID per facet), an Alternative table
  (ID, type, parent ID, level), and a "unitized alternative data" table holding parameter values
  keyed by alternative and element. *"Inherited alternatives may reference only parameter values
  that differ from those of a parent alternative."* <https://patents.google.com/patent/US10311051>
- **SPECULATION.** If the shipping file follows the patent, reading one element's diameter in one
  scenario means: scenario → the alternative for that facet → walk the parent chain until a value is
  found → convert from that field's storage unit. That is a resolver, not a `SELECT`. Getting the
  base scenario only is easier, but still needs the chain.
- **CITED: units are per field, not "SI throughout".** The API describes each field's
  `StorageUnit` ("If unitized, the storage unit the value is stored in") and a `JustLikeField` from
  which a field borrows its storage unit. pyofw stub
  `src/pyofw/typings/pyofw/OpenFlows/Domain/ModelingElements/ISupport.pyi`, lines 93 and 377.
  **SPECULATION:** the storage units are probably SI-like and fixed per field, but which unit each
  field uses would have to be read from the file or learned from a known model.
- **Unknown:** whether coordinates are stored as columns or as geometry blobs; how demands (several
  per node, each with a pattern), patterns, curves, controls and the Customer element are stored;
  whether the schema changes between releases (the `EnableSchemaUpdate` flag suggests the API
  upgrades older files in place); whether any column is encrypted or compressed.

### Sample files

- **Not found.** Bentley ships samples in the install folder (`...\Bentley\WaterGEMS\Samples\`,
  e.g. `Example5.wtg`), covered by the product licence, not published for download. The GitHub
  repositories mentioning WaterGEMS or WaterCAD (searched through the GitHub API: `watergems`,
  `watercad`, `openflows-water`, `pyofw`, `haestad`) hold code only; none contains a `.wtg.sqlite`.
  **OBSERVED:** tree listings of the worthapenny repos, `ceoacademy/WATERCAD` and
  `leovante/autocad-watercad-table-profile-script` show no model files.
- **The clean source is Tom's own model.** Tom used WaterCAD on 2026-09-25 (`dev/ROADMAP.md`,
  Tasks 718 and 723). A small network he builds himself and saves, both as `.wtg.sqlite` and as an
  EPANET `.inp` export of the same model, is his data, and the pair is a Rosetta stone: every value
  in the `.inp` can be searched for in the database. This spike did not go looking through his
  Windows files for one.

### The licence

Reported, not interpreted. Bentley EULA version 2023-10-16,
<https://www.bentley.com/legal/eula/> (PDF: <https://connect.bentley.com/eula/eula_en.pdf>):

- **§1.7, Limitations on reverse engineering (CITED):** *"You may not decode, reverse engineer,
  reverse assemble, reverse compile, or otherwise translate the Software except only to the extent
  that such activity is expressly permitted by applicable law notwithstanding this limitation."*
  The clause also asks for 30 days' written notice before exercising a right the law grants.
- **§1.18 (CITED):** *"You may develop your own applications that interoperate or integrate with
  the Software."*
- **Open questions for a person, not a script:** whether the clause, which names "the Software",
  reaches a user's own data file that the software wrote; whether §1.18 covers reading that file
  without going through Bentley's API; whether the answer differs for someone who has never
  accepted the EULA (a visitor reading a file a colleague sent). Nothing here is a legal
  conclusion. If phase 2 goes ahead, Tom decides with this in front of him.

## Reading in a browser: the engineering cost

- **OBSERVED, 2026-09-30:** sql.js 1.14.2 (MIT) from jsDelivr: `sql-wasm.js` 46,535 bytes
  (16,642 gzipped), `sql-wasm.wasm` 658,410 bytes (322,099 gzipped). About the size of the
  vendored `js/vendor/epanet-js.js` (678,695 bytes), and like it would load only when someone
  chooses to import a Bentley file. It would be vendored beside epanet-js with its licence, not
  fetched from a CDN at run time, so it adds no third-party request.
- **sql.js loads the whole file into memory, and some real files are huge.** Bentley reports a
  6 GB `.sqlite` for a 7,000-pipe model, bloated by change-tracking rows (KB0015674). A browser
  cannot hold that. A small, compacted model is fine; a working utility model may not be, and
  wa-sqlite (which reads a file in pages) would be the fallback.
- The browser part is the easy part. The cost is the resolver: scenarios and alternatives,
  inherited values, per-field storage units, and the mapping of Bentley element types (Hydrant,
  Customer, Isolation Valve, Pump Station, Variable Speed Pump Battery...) onto ours, each mismatch
  reported by the same import report `.inp` uses.

## Writing back

- **No-go, stated plainly.** Even with a perfect reader, a writer has to create rows WaterGEMS
  accepts: IDs, alternative chains, per-field units, whatever indexes, triggers or version
  stamps the application relies on, and the `.wtg` beside it. We could test only by opening the
  result in WaterGEMS, a licensed Windows product, and a file that opens is not proof the model
  inside is the one we meant. The rule that "only the user touches a file's numbers" also argues
  against editing a database we do not understand.
- **The round trip that already exists:** our `.inp` export, then WaterGEMS File > Import >
  EPANET. Bentley's own help says EPANET carries fewer features than a Bentley model, so "some data
  are lost" (<https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-B17CEA08-E720-42D5-A340-0BDE4521951C.html>);
  what is lost is worth measuring rather than assuming.

## Recommendation for phase 2

1. **Now, and cheap: the `.inp` path.** Ask Tom for one WaterCAD model he built, exported to
   EPANET `.inp`. Import it, keep the import report, and record what WaterCAD writes that Net1/2/3
   do not (section order, `[TAGS]`, `[COORDINATES]` precision, curve and pattern naming, element
   types flattened to junctions). Then export ours and have him import it into WaterCAD and say
   what it lost. This serves every WaterCAD user today and needs no licence question answered.
2. **Only if Tom wants direct reading after that:** the same model saved as `.wtg.sqlite`, placed
   in `/home/haws/bentley-samples/` (outside the repo, never committed). Dump its schema with
   python3's `sqlite3` module (there is no `sqlite3` CLI on this machine), find the `.inp`'s numbers
   in it, and write a read-only dev script that lists nodes and links with coordinates for the base
   scenario only. Go further only if that script works on a second model he did not build for the
   purpose.
3. **Never:** a writer, until a reader has survived several real models from different WaterGEMS
   versions, and then only after asking again.

## The .sqlite and the .wtg: what Gemini said, checked

Tom, 2026-09-30, after a chat with Google's Gemini: *"I think that Gemini either oversells or
missells the value of the gap between the .sqlite and the .wtg. I would want a better rundown of
the gap before I felt the least daunted. I need a better steel-man case against hoping the .sqlite
may be a significant achievement toward interoperability."*

Sources below are Bentley's own knowledge-base articles, read through
`https://bentleysystems.service-now.com/api/sn_km_api/knowledge/articles/<KB number>` (the
article pages load only in a browser), plus the Bentley help pages already cited above.

### Each claim, checked

| Gemini said | Verdict | Evidence |
|---|---|---|
| Modern WaterGEMS/WaterCAD split a project into two files. | **True.** | The starter file (`.wtg`) and the database (`.wtg.sqlite`); the database was Microsoft Access (`.wtg.mdb`) up to version 08.11.03 and SQLite from 08.11.04 (V8i SELECTseries 4, 2013). KB0057541, KB0059191, KB0014745. |
| WaterCAD and WaterGEMS use the same files. | **True.** | KB0014745 lists `.WTG` and `.WTG.SQLITE` for WaterCAD, WaterGEMS and HAMMER alike. |
| The `.wtg` holds "the primary scenario trees". | **Contradicted.** | Bentley's recovery for a broken `.wtg` is to import the database alone into a new project: *"The database file contains all of the physical data in the model. The only thing that is lost during this process are data in the element symbology and graphs."* KB0013701. The alternative records are in the SQLite file (KB0058121). |
| The `.wtg` holds "binary presentation properties". | **Contradicted.** | Bentley tells users to open the `.wtg` in Notepad and search it; it is XML (`<GraphElement ...>`, `<NamedViewElement ...>`). KB0058225, KB0015270. |
| The `.wtg` is "a compressed XML document". | **XML: true. Compressed: contradicted.** | Same articles: readable in a text editor. |
| The `.wtg` holds symbology, labeling, colour coding and annotation. | **True.** | *"...the .STSW file, which stores presentation settings like graphs, annotations and color coding"* (KB0057843, the sewer twin of `.wtg`); KB0059145. Graphs and named views too (KB0058225). |
| The `.wtg` holds background layers. | **Contradicted as stated.** | Bentley names the `.dwh` as *"the file that stores the background files for the model"* (KB0057554). The images themselves are separate files the user reattaches. |
| Pipe diameters, demands, coordinates and elevations live in the `.sqlite`. | **True for the physical data; coordinates by inference.** | KB0013701 above; KB0059145: *"The database file contains almost all of the modeling data."* Coordinates are not named, but a database-only import produces a drawing, so the geometry must be there. |
| "A model is completely blind without its partner .wtg file"; the `.sqlite` is "only half of a Bentley model". | **Contradicted. This is the mis-sell.** | Bentley's own support treats losing the `.wtg` as a routine, acceptable recovery (KB0013701, KB0059145, KB0057843). What is lost is how the model looks, not what it is. |
| Reading only the `.sqlite` loses "custom labels". | **Partly wrong.** | Element labels (names) are in the database (`HMIModelingElement.Label`, KB0058225). Annotation *formats* are in the `.wtg`. |
| Scenarios map to lists of alternatives; a reader must follow parent-child inheritance. | **True.** | The patent (above); KB0058121 names the per-alternative records and their "make local" step. |
| Controls are stored in the database as conditions and actions with IDs. | **Unverified.** | They are model data, and nothing but symbology and graphs is lost without the `.wtg`, so they are in the database. Their table shape is unknown. |
| HAMMER, Darwin and other non-EPANET features need handling. | **True, but not a `.sqlite` problem.** | That gap exists for any route into an EPANET engine, including Bentley's own EPANET export, which Bentley says loses data. |
| SQLite is public, so no reverse engineering is needed, and you may "safely extract, update, or read" the model "without breaching the EULA". | **Half true, and the rest is a legal conclusion.** | The container is public. The meaning of its tables is not. Bentley's support itself sends users to "a different application that can work with SQLITE databases" to read labels (KB0058225); no Bentley source says updating the database outside the program is safe or supported. |
| Ask the user to pick the active scenario in WaterGEMS first, then flatten. | **Self-defeating.** | A user sitting in WaterGEMS can already choose File > Export > EPANET. |

**Tom's four follow-ups to Gemini, which it did not answer:**

1. *Inheritance ("I can do this")*: yes, and it is the real work. See below.
2. *"Can you confirm that the .sqlite doesn't include any annotation objects?"* Annotation and colour
   coding settings are in the `.wtg` (Bentley, above). Whether the database carries any
   annotation-related rows is unverified; selection sets were in the database in the MDB era
   (KB0058225).
3. *Controls, "`.wtg` or `.sqlite`?"*: the `.sqlite`, by Bentley's statement that only symbology and
   graphs are lost without the `.wtg`. The shape is unknown.
4. *Engine extensions, "the settings are in the .sqlite? All I have to do is handle them?"*: they are
   in the `.sqlite` for the same reason. "Handle" means deciding, per feature, what to do with
   something our engines cannot compute, and reporting it. That is the same list our `.inp`
   importer already has to face.

**Where Gemini went wrong:** it put the difficulty in the wrong file. The gap between `.sqlite` and
`.wtg` is small and cosmetic. The daunting part is inside the `.sqlite`.

### The case against (a steel man)

1. **The file Bentley calls "the model" is also the file whose inside is undocumented.** We know
   perhaps five table and column names, all from error messages and one old Access-era query.
   Everything else would be learned by staring at files, and each thing learned is true of the
   files we stared at, not of the format.
2. **The format moves.** Models open only in the same or a newer version; *"a model cannot be saved
   'down' and most versions are not forward compatible"*, and models are "schema compatible" only
   when the first four digits of the version match (KB0057554). The field has Access-format files
   (up to 2013) and SQLite files from 08.11.04, 08.11.05, 08.11.06, 10.00 through 10.04, 2023,
   2024... Bentley's own program has tripped over its own upgrades (KB0058121: a unique-key
   violation on upgraded models). A reader built from one sample is a reader for one release, and,
   SPECULATION, the files people most want to rescue are likely the old ones.
3. **Reading one number is a small program, not a lookup.** A pipe's diameter in a given scenario
   means: which alternative that scenario uses for physical data, then that alternative's record
   for the pipe, or its parent's, or its grandparent's; then which storage unit that field uses;
   then skip the pipe altogether if it is marked deleted but not purged (`IsDeleted`, KB0058225;
   KB0057778 describes deleted elements left in the file). Get any step wrong and the model imports
   cleanly with the wrong numbers, which is the worst outcome and the one nobody notices.
4. **Scenarios are the thing EPANET cannot hold.** A Bentley model's value is often its scenario
   tree. We can import one flattened scenario, which is exactly what Bentley's EPANET export
   already gives, or we can build a scenario structure the rest of the page does not have. The
   first is duplication; the second is a new product.
5. **Real files can be too big for a browser.** 6 GB for 7,000 pipes when change tracking is on
   (KB0015674). The user would have to compact or archive in WaterGEMS first, and then they are
   in WaterGEMS.
6. **The obvious user already has the easy door.** Whoever holds a live WaterCAD licence can export
   EPANET in three clicks. The `.sqlite` route helps only someone holding a model file with no
   Bentley licence to open it: a recipient, or an archive from a lapsed licence. That person is
   real, but rare, and we have never met one.
7. **Portability people ask for usually means "hand it back".** A consultant must return the model
   in the client's format. Reading does not do that; writing is the no-go above, and the one
   Bentley-made door back in (File > Import > EPANET) already takes our `.inp`.
8. **We have no file to test against, and no way to confirm a result** without a Windows machine
   and a Bentley licence. Every claim of success would rest on Tom opening files by hand.
9. **The licence question is not ours to settle** (§1.7 and §1.18, above). Bentley's support
   telling users to read the database with other tools makes reading look ordinary; it is not a
   licence term.

### The case for (briefly)

- The `.sqlite` really is the model: Bentley says losing the `.wtg` costs only looks. Gemini's
  "half a model" is wrong in our favour.
- It keeps what an EPANET export throws away: every scenario and alternative, element types
  (hydrants, customer meters, isolation valves), labels, selection sets, and values in their
  stored units rather than rounded into text.
- It needs no Bentley software at all, which is the only route that serves someone without it: the
  escape hatch from lock-in, which fits the project's reason for existing.
- The container is solved (sql.js, MIT, about 320 KB compressed), and it is read-only work, which
  never puts anyone's model at risk.

### Verdict, and the one experiment that would change it

**Not a significant step yet; a possible one.** The `.wtg` is not the obstacle Gemini made it. The
obstacle is an undocumented, versioned schema with inheritance and per-field units, which we
cannot see, for a user who mostly already has the EPANET door. Worth one cheap experiment, not a
build.

**The experiment:** Tom builds a small model in WaterCAD (about Net1's size) with one child
scenario that changes a pipe diameter and a junction demand, one deleted pipe, one control, and
one pump curve. He saves it and also exports it to EPANET. We dump the `.sqlite` and try to
reproduce the `.inp` (nodes, links, coordinates, both scenarios) from the database alone.

- **If the tables are readable and the child scenario resolves in about a day's work**, the case
  turns to "go" for a base-scenario importer, and a second file saved in a different WaterCAD
  version then tells us how badly the schema drifts.
- **If values sit in opaque blobs, or the child scenario's numbers cannot be found**, stop, and
  record why.

## What is unknown

- The real table layout, and whether it matches the patent.
- Which storage unit each field uses.
- How coordinates, demands, patterns, curves and controls are stored.
- Whether the schema differs across WaterCAD/WaterGEMS versions (V8i, CONNECT, 2023, 2024).
- What WaterCAD's EPANET export drops or renames.
- The licence questions above.

## Where the difficulty really is (Tom, 2026-09-30)

Both Gemini and this document put the difficulty in a file. Tom put it in the model: *"The difficulty
is in providing/forcing inheritance and alternatives on the user. As I mention in the chat, it's a huge
burden on the user unless we succeed in hiding it from 'basic mode' users."* Our scenarios are flat
(each overrides Base); Bentley's are a tree, with alternatives as a layer beneath. Reading a
`.wtg.sqlite` faithfully means holding that tree and those alternatives; flattening them on import
loses exactly what a Bentley user built. So the decision that gates this task is not a parser, it is
whether the suite takes on Bentley's scenario model at all, and how a basic mode would hide it (Task 721).
