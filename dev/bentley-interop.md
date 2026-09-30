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
- **SPECULATION:** a model of a few thousand elements is a few MB of SQLite; sql.js loads the whole
  file into memory, which is fine at that size. wa-sqlite (for large files, streamed) is not
  needed.
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

## What is unknown

- The real table layout, and whether it matches the patent.
- Which storage unit each field uses.
- How coordinates, demands, patterns, curves and controls are stored.
- Whether the schema differs across WaterCAD/WaterGEMS versions (V8i, CONNECT, 2023, 2024).
- What WaterCAD's EPANET export drops or renames.
- The licence questions above.
