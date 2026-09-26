# lpn_ rulings — full record

Moved verbatim out of `CLAUDE.md` on 2026-09-23 when that file was compacted. CLAUDE.md keeps the
short rule and points here; this file keeps the reasoning, the quotes and the measurements.

### `lpn_` in particular

A canvas/map-centric looped network solved by the global gradient algorithm (`js/lpn-solver.js`) with
a map editor over it (`js/looped-network.js`). **A core calculator, in scope in all 26 languages.**
Never call it "preview". Scope: `dev/looped-network-calculator-scope.md`; ROADMAP Task 146 and its
`146.nn` children.

- **RECALCULATE OFF MEANS A SNAPSHOT, NEVER HIDE OR DELETE** (Tom: *"Off means Off, but it doesn't
  mean Hide or Delete. It means Snapshot in time."* And: *"The reason I am saying Yes to everything
  is that if we clear these things prematurely, it robs the user of an important point of
  reference. It's important to leave some value in the model when we have it."*). With the switch
  off, an edit runs no solve — but every stale answer already on screen stays exactly where it is:
  `lastSolveResult`, the Tables pane's result columns, the Properties box, the status bar, the
  energy/run report, and the fire flow rings all keep showing what they showed, until the user
  presses Calculate or a deliberate control (fire flow's own Clear button) says otherwise. **Only a
  genuinely different network — opening another project or tab — clears a result set**; an edit to
  the one on screen never does. **AND AN EDIT STILL HAS TO SHOW UP EVERYWHERE THE INPUT IS SHOWN,
  IMMEDIATELY** (Tom: *"Any input we edit must be reflected wherever it shows, Table, Properties,
  and map labels... we can have tunnel vision on only the label we change."*) — `afterPropertyEdit()`
  and `updateNode(id, true)` keep the Tables pane and the map label of the ELEMENT JUST EDITED
  current, through `refreshOneLabelInPlace()`, which rewrites only that one label's text and
  position. **Tunnel vision is the point and not a shortcut**: a full network-wide content-and-
  collision pass (`refreshLabelTextPass()` + `relayoutLabels()`) is exactly the delay the switch
  exists to avoid, so a plain edit must never trigger one. `dev/lpn-spike/stale-snapshot-harness.js`
  asserts all of this, mutation-tested.
- **Element types:** junction, reservoir, tank, pipe, pump, valve, text. **Our vocabulary is NOT
  EPANET's and stays that way** (Tom, 2026-08-21, ROADMAP Task 482): what we call a **Label**
  EPANET calls Notation/Annotation, and what EPANET calls a **Label** is our **Text** object.
  For THOSE TWO OBJECTS there is no industry standard to defer to, so write new strings in our
  vocabulary — every one written in EPANET's adds to a rename we have already declined.
  - **THAT RULE IS ABOUT ONE COLLISION AND NOTHING ELSE.** It was read far more widely and produced
    strings a hydraulic engineer does not recognise — `Rest pressure` for static pressure, `Pulled
    down` for drawdown, `settle` for converge, `Solves` for runs. Tom, twice in one reading: *"why
    are we inventing language that engineers will not recognize?"* and *"we should default... to the
    EPANET terminology."*
  - **THERE IS NO HOUSE STYLE FOR ENGLISH STRINGS ANY MORE, and that is deliberate** (Tom,
    2026-09-01: *"Anywhere you find anything addressing the need for a certain kind of English or
    language, just strike it. Let's trust our synonyms, glossary, scripts, and feedback
    procedures."*). `dev/language-strings.md` used to carry a "Simple English" rule; it licensed
    exactly the inventions above three times, survived two written corrections, and is gone rather
    than qualified a fourth time. **Do not write a new one.** The mechanisms that carry it are
    `$ec_lang_syn`, `glossary.json`, `plain_english_swap_check.php`, and Tom reading
    `dev/new-english-keys.md` — each evidence about a specific string, where a house style is a
    prediction about every future one. **One advisory survived the purge and only one: avoid the em
    dash in visitor-facing English, until further notice.** It survives because it is not a claim
    about good English — the dash is fine, the reader is not, and a page that leans on it reads as
    AI-written whatever it says. A ratchet on new and edited strings, not a sweep: 60 shipped
    strings carry 69 of them and rewriting those would buy 1,560 retranslations of text whose
    meaning did not move. `dev/language-strings.md` has the scope and Tom's wording.
  - **AND THE ONE THING THAT IS NOW SETTLED IS MECHANICS, WHICH IS NOT A VOICE** (Tom, 2026-09-08:
    *"After doing some research, I see that we need to follow APA, not Oxford. Please make the
    change and teach me as we go."* This supersedes his 2026-09-06 choice of Oxford). **The APA
    Publication Manual, 7th edition, is this project's reference for spelling, punctuation, numbers
    and the serial comma**, in `dev/*.md`, in code comments, in commit messages and in
    visitor-facing English alike. In practice: Merriam-Webster American spelling (*color*, *center*,
    *meter*, *modeling*, *-ize*), the serial comma, numerals from 10 up and for anything with a unit.
    A ratchet on new and edited strings, never a sweep. The full list of what it settles, with
    examples, is in `dev/language-strings.md`. This does NOT reinstate the rule struck above and
    must not be read as licence to: it decides whether a list takes a comma before "and", not
    whether a sentence is allowed to say *drawdown*. **The one place it is deliberately overruled is
    the em dash**, which APA is happy with and this project is not, for the reason above. He is
    willing to state the choice in public, so it may appear on a page; nothing has been written yet.
  - **AND WHEN ONE NAME IS DOING TWO JOBS, SPLIT IT RATHER THAN CHOOSE** (Tom, 2026-09-01: *"Source
    trace mystifies me if it's intended to mean Share from source"*). It did: `lpn_quality_trace`
    named the ANALYSIS and `lpn_result_source_share` named the NUMBER, and both said "Source
    share". The analysis is EPANET's **Source trace** on EPANET's **Trace node**; the number it
    reports is a **Source share**, a percentage. Two things, two words, and the tip ties them.
- **EXTENDED-PERIOD SIMULATION SHIPPED 2026-08-18, THROUGH THE EPANET ENGINE ONLY** (`js/lpn-time.js`).
  Tanks fill and drain, demands follow patterns, the TOOLBAR's transport scrubs the frames (it
  mounts into `lpn_toolbar_run`, not a bottom pane -- this line said bottom pane until 2026-09-10
  and sent a design brief off on the wrong control); checked against
  all 25 steps of EPA's own `Net3.rpt` to 0.005 ft over 2,425 head comparisons
  (`dev/lpn-spike/eps-net3-harness.js`). **The built-in solver has no time dimension and is not
  getting one** — with EPANET unreachable the page solves one instant and says so. Patterns on a
  reservoir head and on a pump speed shipped 2026-08-24 (248.02), and rule-based `[RULES]` closed
  2026-09-05 (248.03): `js/lpn-rules.js` is EPANET's own grammar, parsing a rule so that every number
  in it can be converted per clause into the engine's units. **EPANET checks its rule base BETWEEN
  time steps, so a rule changes nothing on a single-instant solve** — the engine's behaviour, copied. **EPANET's pump speed pattern REPLACES the SPEED setting rather than
  scaling it** — measured against the engine, and the exporter writes SPEED or PATTERN, never both.
  **"No extended-period simulation yet" is FALSE.** It stood in this file and on the LibreWaterNet
  landing draft until 2026-08-21, three days after the run shipped, and Tom caught it, not a check.
  Do not restore it.
- **Valves are the one place the two engines deliberately differ.** A throttle valve (TCV) is a minor
  loss on a zero-length link and solves in either engine. PRV/PSV/FCV switch their own state inside
  the iteration and solve through **EPANET only** — a second implementation was not written.
  *(Corrected 2026-08-30: this used to say EPANET is "measured ~9x faster than our own solver".
  It is not, any more. Task 322's solver work replaced a dense Cholesky with an envelope one and
  a re-run puts native at 3.93 ms against EPANET's 3.31 ms at 201 nodes — ratio 0.8x, ours
  marginally faster. **Speed is no longer a reason to prefer either engine**; the reason valves
  route to EPANET is that it implements their state switching and we do not.)* A network holding one is routed to EPANET automatically and
  the status bar says so, **without rewriting the user's stored `engine` setting** (the setting is a
  preference; the routing is a fact about this network). The native solver refuses such a network by
  name if the engine is unreachable. `EngCalcs.lpnValveIsNative` is the one place that line is drawn;
  `EngCalcs.lpnLinkK` is the one place a TCV's loss is read from its SETTING rather than its `k`.
- **A CURVE IS A DOCUMENT OBJECT AND AN ELEMENT HOLDS ONLY A REFERENCE** (Task 586, Tom
  2026-09-05: *"move all pump curve data to the Library under curves and leave only curve
  references in the pump properties"*). `doc.curves` holds `{id, kind, points, src, tok}`; a pump,
  a GPV and a pump's efficiency STATE one by id, and the Library's Curves section is where one is
  created, renamed, edited and deleted. **The element popup edits no points at all, and that was
  finished 2026-09-06** (Tom, asked whether it still should: *"No. Remove that UI."*): a pump, a
  GPV and an efficiency reference each show a chooser and a link to the Curves library, and the
  point tables, `mintCurveFor()` and `curveForEdit()` went with them. Two editors of one definition
  were two chances to disagree about what editing it meant. Deleted with the UI, and named here so
  they are not re-added: `lpn_pump_effic_note`, `lpn_pump_curve_note`, `lpn_pump_point1/2/3`,
  `lpn_curve_long_note`, `lpn_curve_shared_note`, `lpn_gpv_curve_note`, `lpn_pump_effic_remove`.
  **And a reference is STATED, never "named"** (Tom, 2026-09-06, on the transitive verb: *"I am not
  liking the word 'name' ... Alert that in some contexts 'name' may mean 'use'."*). Use *state*,
  *indicate*, *refer to*, *select* or *call* in a visitor-facing string; his own edit of
  `lpn_library_curves_note` uses *indicates*. Per-element `curvePoints`/`efficPoints` and the `curveRef`
  borrow are GONE, and were an accident of chronology rather than a design — the pump curve was
  written in the first two days of this page, before there was a Library. **The REFERENCE is
  scenario-overridable (his ruling: *"Scenario pump reference: Yes."*) and the POINTS are not** —
  a curve is shared, so a scenario editing its points would move every other scenario's answer.
  **The three-point FIT is DERIVED and stored nowhere**, which is what lets a curve keep every
  point the file stated: a >3-point pump curve used to be sampled to three on import and
  re-sampled off our fit for the engine, so a manufacturer's curve was rewritten twice.
  Deleting a curve elements use is REFUSED by name; renaming one carries every reference.
  **EPANET HAS EXACTLY FOUR KINDS and states each in a `;PUMP:`-style COMMENT** above the curve's
  own rows: PUMP, EFFICIENCY, VOLUME, HEADLOSS (Tom, 2026-09-05). Read it, keep it, write it back —
  it is the only thing that can type a curve nothing references, which is what the Library's own
  Add button makes. `generic` is not a fifth kind, it is EPANET's `G_CURVE`, and no control offers
  it. **A VOLUME curve is USED, and only by a run** (Task 587, closed 2026-09-05): a tank states
  which curve it uses, `EngCalcs.lpnTankVolumeAttach()` hangs the converted points on the model
  beside the clock, and `js/lpn-epanet.js` writes the eighth `[TANKS]` column so the engine
  integrates the real shape. We have no level-to-volume arithmetic of our own and grew none — the
  whole defect was delivery. **`EngCalcs.lpnIsFixedHead` is untouched and stays so:** a water
  surface is the level the document states whatever the vessel's shape, so a single instant is
  identical either way and only `dLevel/dt = Q / (dVolume/dLevel)` sees a curve. A curve EPANET
  would refuse (under two points, x not strictly increasing, y not rising) is LEFT OFF rather than
  repaired. Abscissa is level in the elevation unit; ordinate is that unit CUBED, because EPANET
  pairs volume with length and this page has no volume selector at all.
  `dev/lpn-spike/tank-volume-curve-harness.js` anchors it on 216 m³ into one tank: 3.7502 m as a
  10 m cylinder against 6.1200 m on a stepped curve, both hand-computed.
  `dev/lpn-spike/curve-library-harness.js`; `dev/pump-energy.md` for the efficiency side.
- **A tank is a fixed head at its water surface** — what EPANET itself solves at t=0.
  `EngCalcs.lpnIsFixedHead` is the one place that equivalence is declared. A tank diameter is in the
  LENGTH unit while a pipe diameter is in millimetres; only `dev/lpn-spike/tank-harness.js` asserts
  that, because no solve ever reads it.
- **A geographic project draws raster tiles behind it, and can read ELEVATIONS from the same
  account** (Task 497, `js/lpn-terrain.js`) — OpenStreetMap for the street map, Mapbox for satellite
  and for Terrain-RGB (all gated on `EC_MAPBOX_TOKEN`; absent means neither option exists). The
  tiles are never cached by us, never in the service worker's manifest, attribution required on the
  map and one credit set per source. It is `project.basemap`, never `backdrop.href`, and an `.inp`
  exporter must skip it. **The elevation fill is TWO ORDINARY CONTROLS and NOT a menu row** (Task
  542, and the row it names was deleted twice over — the menu became Map, not View, under Task 543):
  `Settings > New assets > Elevation source`, where a node is born reading its own ground and nothing
  existing is touched, and `From Mapbox DEM` as the New-value source in Find and replace, where the
  user has already chosen the set. **Do not add a third door** — a menu row that filled the whole
  drawing in one press is what Tom called *"a cool new button that I found"*, and it is the defect
  542 exists to have removed. It TYPES numbers into the document, so it never overwrites an
  elevation the user has without their having asked for exactly that, it is one undo snapshot, and
  it states its ~30 m accuracy in the interface, not in a comment. A burst of drawing is one batch
  of requests, never one per node.
- **THE SUITE MAKES FOUR THIRD-PARTY REQUESTS, ALL ON THIS PAGE, ALL OPT-IN:** OSM tiles, Mapbox
  satellite tiles, Nominatim place-name search (`js/lpn-search.js`), and Mapbox Terrain-RGB elevation
  lookup (`js/lpn-terrain.js`, Task 497). **The last two are the sensitive ones and each has its own
  consent gate** — `ec_geosearch` and `ec_terrain`, separate from the analytics one and from each
  other, because a tile says where you are LOOKING, a search says what you TYPED, and a node
  coordinate says where your NETWORK IS. Do not write "the only third-party request" anywhere; it has
  been false since the geocoder shipped. **Adding one does NOT touch `consent_body`** — that banner
  asks about one analytics digit and says nothing about third-party requests; each feature asks its
  own question, so a fifth service is a new paragraph in `privacy.php`, not a version bump.
  A geographic project is **drawn in Web Mercator and stored in longitude and latitude** —
  `outwardY()`/`inwardY()` is the whole boundary, x needs nothing because Mercator x IS longitude, and
  a tile box is square because the drawing frame is the tiles' own. **Storing the projection is
  forbidden:** `mercLat(mercY(lat))` differs in the last bits for 69.8% of latitudes, so it would
  rewrite every latitude on every open-and-save.
  **THE MISSION SCOPE IS A 300 km SYSTEM SPAN** (Tom, 2026-08-25), and it is a statement about who
  this page is for rather than about arithmetic — a globe-spanning utility has a budget in trillions.
  Nothing enforces it and nothing should without his word. What it protects is `geodesicMeters()`,
  which is NOT a geodesic: it treats a leg as flat in the frame of its mid-latitude, and that is what
  fills every `lenAuto` length. Measured against Vincenty in
  `dev/lpn-spike/scope-of-service-harness.js`: **206 ppm at the 300 km scope, still 0.1% at double
  it** — so "highly conservative" is his phrase and the number agrees. Full record, and the three
  things the bound does NOT mean: `dev/geographic-projects.md` (§2b, and the rest of that file for
  everything else geographic).
- **Reads AND WRITES EPANET `.inp` files** (`js/lpn-inp.js` — one file, so one opinion about the
  format). Import takes the supported subset and reports every difference, never rejecting and never
  dropping silently; export shipped 2026-08-18 and returns 1,280 numeric tokens across Net1/2/3
  character-for-character. Five round trips are genuinely impossible and are REPORTED rather than
  faked (see the closed Task 281 entry for the list). **"Does not write one yet" is FALSE.**
- **Design this page for a pointer; then make a phone survivable.** It is a full-window drawing
  surface with a menu bar, toolbar, tab strip and property popup, so the desktop layout is the
  authoritative one and no design argument starts from a phone. Say "pointer slop" when you mean
  hand-and-mouse tolerance; a 44px touch target is not an argument here.
  **BUT NEVER CALL IT A PC APPLICATION IN PUBLIC — Tom, 2026-08-24: *"It is not a PC application; it
  is a web application."*** That is a ruling about IDENTITY, and it does not touch the design rule
  above: pointer-first is still how it is built, and "it runs everywhere a browser runs" is still
  what it is. The two are only in tension if you let a design priority leak into a positioning
  claim, which is exactly what happened — the sentence *"And it is a PC application, the way EPANET
  is"* stood on the LibreWaterNet draft and he struck it. Do not restore it, and do not reach for
  epanet-js's harder version of the same stance either. Tom ruled it **not usable on a
  phone** on 2026-08-22; the four small-screen items he named — hide page titles, collapse the
  navbar, keep only the transport controls, drop menu text to icons — shipped the same day at one
  `max-width: 640px` breakpoint (closed Task 486, guarded by `dev/lpn-spike/small-screen-harness.js`),
  and on 2026-08-23 he passed it: *"For today's standards, we are gold."* On 2026-08-24, after using
  it: *"phone usability is super solid now. I am a bit surprised."* **The sanctioned public claim is
  his own, and it is the LANDING PAGE'S current sentence, not a paraphrase:** *"And although you of
  course prefer working on your PC, it works also on a phone in tall mode."* The indefinite article is load-bearing
  and he chose it deliberately (*"to be scrupulously honest"*) — **"a phone" is a claim about the
  software; "your phone" is a promise about a device we have never seen.** Never write the second.
  **"In tall mode" joined it 2026-08-24 and is a narrowing of the same kind** — Tom uses the phone
  upright and says that is best, so the claim names the orientation actually observed. It is also
  what closed Task 442: the toolbar does NOT become a side menu, on any screen.
  (Superseded, recorded so it is not reinstated by habit: "Try it. We did.") The other calculators
  are a form and an answer and are fine as they are.

---

