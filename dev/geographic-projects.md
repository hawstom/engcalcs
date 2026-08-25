# Geographic projects (ROADMAP Task 145)

**A project declares GRID or GEOGRAPHIC before anything is drawn, exactly as it declares units.**
Tom, 2026-08-17: *"you can see from epanetjs that a project has to declare from the start whether
it's on grid map or geographical map, just as it must declare units before drawing anything. In a
way, geo is just another unit (degrees), but it's of course much more complex than that, and the map
is no longer unitless."*

This document is the scope. The roadmap block is one paragraph pointing here.

---

## 1. Why the declaration is at creation

Every coordinate in the document means something different under the two modes. A grid project's
`x`/`y` are canvas units the user declared the meaning of (1 unit IS 1 ft or 1 m, by declaration —
see `lengthField()`); a geographic project's are a position on the Earth. A project that changed its
mind mid-drawing would have to reinterpret every node, every vertex, every text label and the
backdrop registration at once, and there is no correct answer for what a bare `x` of 120 becomes.

So: chosen at File > New, stored in the project, and shown in the units strip. Converting an existing
project is a deliberate, separate operation (a georeferencing wizard — two known points, as the
backdrop scale gesture already does), never a toggle.

## 2. "Geo is just another unit" — how far that holds

It holds for STORAGE and for the UI shape: a coordinate is a number with a declared meaning, and
degrees is one more meaning. It stops holding at three places, and these are the whole difficulty:

1. **Distance is not `√(Δx² + Δy²)`.** A degree of longitude is not a degree of latitude, and
   neither is a metre. Any length read off geographic coordinates is a geodesic computation.
2. **The drawing surface is a PROJECTION.** Tiles are Web Mercator; the model is on the ellipsoid.
   Drawing is therefore project-then-draw, and hit-testing is the inverse.
3. **Scale is not uniform.** Web Mercator's scale error is `1 / cos(latitude)`: ~15% at 40°, ~30% at
   50°, unbounded toward the poles. A pipe length measured naively off a tiled backdrop is wrong by
   more than any engineering tolerance, silently, and looks perfectly reasonable on screen.

**This is the strongest argument for the standing rule that `len` is STORED and overridable, never
derived.** A geographic project may OFFER a geodesic length; it may not quietly become the length.

## 2b. MISSION SCOPE: how large a system this page serves

**Tom, 2026-08-25, striking a code comment that said a document "may span the globe":**

> "While it's physically feasible for a technological and social society to be so cosmopolitan as to
> have a system that spans the globe, that utility would have a budget in trillions of dollars, and
> our mission is aimed at more modest ventures. We can set a mission scope of 300 km or so for a
> system/model/project span, and even that is probably highly conservative."

**The declared mission scope is a 300 km span.** It is a statement about who this page is for, not
about arithmetic — the arithmetic is comfortable well past it, which is what "highly conservative"
has to mean if it means anything.

*(Superseded, recorded only so it is not re-proposed: his first ruling the same day was "the width
of a UTM zone or half the width" — 6° or 3°. He narrowed it deliberately, and the reason was budget
and mission rather than geometry.)*

**What the bound protects, and what it costs, measured.** `geodesicMeters()` in `js/lpn-geom.js` is
NOT a geodesic: it takes the two WGS84 radii of curvature at the leg's MID-LATITUDE and treats the
leg as flat in that local frame. That is the flat-earth assumption, and it is what fills every
`lenAuto` length in a geographic project. Against Vincenty's inverse
(`dev/lpn-spike/scope-of-service-harness.js`, which writes Vincenty out from the published formula
rather than calling ours), worst case over latitudes 0–60 and all three leg directions:

| Longest single leg | Ground distance | Departure from a true geodesic |
|---|---|---|
| 0.1° | 12 km | **0.3 ppm** |
| 1° | 124 km | 28 ppm |
| **2.7° — the 300 km mission scope** | **334 km** | **206 ppm (0.021%)** |
| 6° — more than double it | 734 km | 1,052 ppm (0.105%) |

At the mission scope an automatic length is far better than the coordinates it is computed from:
nobody places a node by dragging on a map to a part in ten thousand, and no Hazen-Williams C is
known to a tenth of that. At more than double the scope it is still a tenth of a percent — which is
the measured content of "highly conservative", and the reason this is a bound with room rather than
a cliff.

**Three things the bound does NOT mean.**

- **It is not a limit the code enforces.** Nothing refuses a larger document, and nothing should
  without Tom saying so — a refusal is a user-facing behaviour, not an arithmetic one.
- **It is not about the ANTIMERIDIAN.** A system inside the scope may still straddle 180°, which is
  a wrap rather than a large span; `geodesicMeters()` handles it and the harness pins that so this
  bound is not read as permission to drop it.
- **It does not relax the origin work of Task 439.** Sterbenz exactness needs a coordinate NEAR the
  ORIGIN, and a bounded span does not give that: an origin floored onto the 1/128° grid can sit a
  whole degree from a coordinate that is itself a hair from zero. That is why both axes carry the
  file's own value.

Whether a real utility's system fits inside 300 km is a question about water utilities rather than
about arithmetic, and belongs to `utility-planning-engineer`.

## 3. The rule that survives from the old scope

**Web Mercator must not become the document's coordinate system.** Georeferencing is a property of
the backdrop LAYER, not of the network. A plan sheet is State Plane, UTM or a site grid, and a
network drawn over one must keep those coordinates whatever basemap is switched on behind it.

**This is a rule about the FILE, and §6's seam does not bend it.** The drawing frame is Mercator; the
document's coordinates are longitude and latitude, byte for byte the ones the user's file states. The
distinction is the whole design, and the measurement that forces it is in §6.

## 4. The basemap: plain OpenStreetMap raster tiles, and it is built

**Decided and shipped:** OSM raster tiles, hand-rolled, no library. No key, no billing account,
nothing to leak; the tiles are `<image>` elements in the SVG world layer that already exists.
Explicitly **not MapLibre GL** (what epanet-js runs) — a WebGL vector renderer would fight the SVG
world for little gain at our scale, and it is a runtime code dependency this suite does not want.
Aerial imagery is the one thing OSM cannot give; Esri World Imagery behind a key is the second
provider if that ever turns out to matter.

What follows from that choice, and is enforced in the code:

- **Tiles are data, not code.** The no-runtime-CDN position is about somebody else's JavaScript.
  `dev/browser-pass/specs/basemap.js` asserts the tile server is the only host the page talks to.
- **Attribution is required, on the map, and not dismissible.** The exact string is
  `© OpenStreetMap contributors`, linked to `https://www.openstreetmap.org/copyright`, in the
  bottom-right corner. It is deliberately not a language key — it is the credit the licence asks
  for, it names a project rather than describing a control, and it prints (the tiles are inside the
  SVG, so they print too).
- **The offline promise is untouched.** Tiles are not app assets and must never enter
  `sw_manifest_check.php`'s manifest. With no network a geographic project still opens, still draws
  and still solves; the basemap is the only thing missing.
- **Nothing is cached on the device by us** — no localStorage, no IndexedDB, no Cache API, only the
  browser's own HTTP cache. Caching tiles is both a tile-policy problem and a storage-consent
  problem (`dev/cookie-storage-inventory.md`), and declining costs nothing.
- **Policy compliance is a cap and a budget:** zoom 19 maximum (OSM's own), at most 192 tiles per
  refresh with the zoom stepping DOWN rather than the view being clipped, one refresh per gesture
  rather than one per wheel notch, and the browser's real `Referer`.
- **On by default in a geographic project, off by a View-menu row**, stored as `project.basemap`.
  Beside `coords`, because both are declarations about what the document is.
- **`project.basemap` is NOT `backdrop.href`, and an `.inp` exporter must skip it.** `[BACKDROP]`
  in an `.inp` names an image FILE; a tile basemap is not a file and has no href to write.

## 5. Tiles register because the DRAWING is Mercator now

**A tile box is square, at every latitude.** Since §6's seam landed, the drawing frame is Web
Mercator, so a Web Mercator tile covers a square of it — the raster stretched linearly inside the box
(`preserveAspectRatio="none"`) and the box are the same map rather than two maps agreeing at the
edges. The chord approximation this section used to measure — 0.025 px at zoom 12, 3.1 px at zoom 5 —
is **gone rather than smaller**, and `dev/lpn-spike/basemap-harness.js` still measures it, at ~1e-10
px, so a regression back to an unprojected frame shows up as a number that stops being zero.

The tile mathematics and the drawing frame go through **one** Mercator: `Geom.mercY()` /
`Geom.mercRadY()` in `js/lpn-geom.js`. A tile and the pipe drawn over it cannot disagree if there is
only one formula, and the radian form is the primitive precisely so the tile grid's own numbers did
not move by a bit when the second copy was merged away.

## 6. The projection seam: SHIPPED, and where it went

**A geographic document is DRAWN in Web Mercator and STORED in longitude and latitude.** The whole of
the boundary is `outwardY()` / `inwardY()` in `js/looped-network.js` — the same pair Task 354 built
for the origin shift, because a frame change is a frame change. `x` needs nothing: Mercator x IS
longitude. Guarded by `dev/lpn-spike/mercator-harness.js`.

Three properties make it cheap, and each is the answer to a real objection:

- **The y unit is a DEGREE OF LONGITUDE** — mercY is 0 at the equator and 180 at the cut-off — so x
  and y share one unit and the view transform stays a **uniform** scale. No anisotropic transform
  anywhere, so a junction is still a circle and a pipe's stroke is still one width, and `bbox()`,
  `zoomExtent()`, the label pass and the collision pass all keep working in drawing units with no
  change at all. §3's rule is untouched: Web Mercator is the DISPLAY, and nothing of it reaches the
  file.
- **The 184 reads of `.x` never had to be touched.** They read the drawing frame, which is what they
  always wanted; the frame's definition moved, not its consumers. That is what killed the
  `drawPos()` shadow this section used to propose — a shadow reaches every site and this reaches one.
- **`len` is still STORED and overridable, never derived.** A geographic length is a geodesic
  (`linkGeomLength()`), read through `outwardY()`, and Mercator's `1/cos(latitude)` never touches it.

**REJECTED: storing the projection.** Putting Mercator in the file would have removed the boundary
entirely, and it is forbidden: `mercLat(mercY(lat))` is a **different double for 69.8% of latitudes**
(200,000 samples, worst departure 2.4e-13°), so every open-and-save of an untouched document would
rewrite every latitude. That is a third conversion site on the user's own numbers. Instead
`projectStoredGeo()` records the file's own latitude beside the projected one and
`unprojectStoredGeo()` hands it straight back, on exactly `mergeTok()`'s invariant — the source is
believed only while `mercY(source)` still equals the number drawn, so any edit invalidates it with
nothing for a call site to remember. **Import then export is byte-identical for a DEGREES `.inp`,
measured through `applySaved()`**, which is the route `inp-export-harness.js` does not take.

Two smaller consequences, both stamped by the v9 → v10 step:

- **`view.cy` and `backdrop.ty` are OURS and are stored in the drawing frame**, so they convert once
  on open. Coordinates are lon/lat at every version and are never migrated.
- **An export now writes `[BACKDROP] UNITS DEGREES`.** Without it a geographic project re-imported as
  a grid one holding longitudes — nominal before the seam, and visibly wrong after it, because those
  numbers would then be drawn unprojected.

**CLOSED 2026-08-25: Task 439.** The drawing frame being Mercator did not save it — a longitude is
still 122 and a Mercator y still 41, so float32 came apart at **64,000 px/degree** (not the ~600,000
once recorded here), with a node landing 575 px from its own position at the deepest zoom the page
permits (`dev/lpn-spike/geo-precision-harness.js`). What this seam gave 439 was a frame to rebase
in: `doc.origin` is applied AFTER the projection for a geographic document, so an origin there is a
drawing-frame offset and moves no number in the file.

A geographic document now derives that origin at load from its own extent, floored onto a 1/128°
power-of-two grid, and never stores it — `LPN_ORIGIN_THRESHOLD`'s 1e4 is for the XY grid alone and
correctly never fires here. Guard: `dev/lpn-spike/geo-origin-harness.js`.

The origin must be snapped to a **power-of-two grid** (1/128°), not a decimal one: that makes the
origin exactly representable and, by Sterbenz, makes `x − ox` exact for any origin near the model,
so `(x − ox) + ox === x` and a shifted coordinate returns to the file as the bytes it arrived as.
The open decision is where a geographic document's origin is STORED, given that `view.cx/cy` and
`backdrop.tx/ty` are in the drawing frame — the two candidates are in Task 439.

## 7. Elevations from the land surface (Task 497)

A geographic project knows where every node is, so the one number a designer otherwise types by
hand — junction by junction, off a contour map — can be read instead. **It is a View-menu row you
press, never a sweep**, and `js/lpn-terrain.js` holds the whole of it.

- **Mapbox Terrain-RGB, because it is already paid for.** `EC_MAPBOX_TOKEN` already gates satellite;
  terrain is ordinary raster tiles on the same host through the same account, and the height decodes
  client-side from the pixel: `-10000 + ((R·65536 + G·256 + B) · 0.1)` metres. No server of ours and
  no second account. **No token, no row** — the same state a fork is in for satellite. If that gate
  is ever absent the alternatives are USGS 3DEP (US only), Copernicus GLO-30 or SRTM through
  OpenTopoData, and Open-Elevation.
- **It writes numbers into the document, so it obeys the rule that governs that.** It fills a field
  the way typing does; it never overwrites an elevation without naming the exact number it would
  replace; and the whole batch is ONE undo snapshot, so one Ctrl-Z puts all of it back.
- **The starting elevation is a SEPARATE question, and that is the one judgement call here.**
  `addNode()` seeds every node with `settings.defaults.nodeElev`, which is 0 — so a freshly drawn
  network has no blank elevations at all, only a number nobody typed. We cannot tell a seeded 0 from
  a typed 0, so those are offered only once nothing is blank, in a confirm that names the number.
  Guessing either way would be worse: filling them silently breaks the rule, refusing them makes the
  feature useless for the commonest case there is.
- **Its own consent gate, `ec_terrain`, and not the tiles'.** A tile says where you are LOOKING; a
  node coordinate says where your NETWORK IS, which is the model itself. Same argument as
  `ec_geosearch`, same shape of record, only a yes ever stored. `dev/cookie-storage-inventory.md`.
- **The accuracy is stated in the interface, three times on the path a person walks** — the menu
  tip, the confirm that runs the fill, and the notice afterwards. One sentence, written once in
  `accuracy()`. 30 m of ground resolution is a contour interval, not a survey, and a number that
  arrives by itself is trusted more than one that was typed.
- **Budget:** one request per TILE, not per node — forty nodes on a site is one or two requests. The
  zoom steps DOWN from 14 to meet a 24-tile budget rather than the extent being clipped (the
  basemap's own policy), stops at 10 so the accuracy sentence stays true, and past 200 tiles the
  command refuses in words. Nothing is cached on the device: what would be cached is a list of
  places the visitor's own network stands.
- `dev/lpn-spike/terrain-harness.js` drives the real page. Its tile stub returns BYTES encoded by
  Mapbox's own formula from an independent inverse Mercator, so the tile arithmetic, the pixel
  index and the decode are all still under test.
