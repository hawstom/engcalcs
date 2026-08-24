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

## 3. The rule that survives from the old scope

**Web Mercator must not become the document's coordinate system.** Georeferencing is a property of
the backdrop LAYER, not of the network. A plan sheet is State Plane, UTM or a site grid, and a
network drawn over one must keep those coordinates whatever basemap is switched on behind it.

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

## 5. Tiles over an unprojected drawing: why they still register

The display is still unprojected — longitude and latitude drawn straight — and §3 says Web Mercator
must not become the document's coordinate system. So the tiles are unprojected to meet the drawing,
rather than the drawing being projected to meet the tiles:

**Each tile is placed at its own lon/lat rectangle.** That is exact on the x axis (Mercator x is
linear in longitude) and computed by the inverse Mercator on the y axis, and the raster is then
stretched linearly inside that box (`preserveAspectRatio="none"`, so the box is 1 : cos(latitude),
not square). The only approximation left is the departure of the inverse Mercator from its own chord
**across a single tile**: `|f''|h²/8`, measured in `dev/lpn-spike/basemap-harness.js` as **0.025 px
at zoom 12 and 0.0015 px at zoom 16**, falling as `h²`. Sub-pixel at every zoom a network is drawn
at, and the same measurement is 3.1 px at zoom 5, which is why it is measured rather than asserted.

What this does NOT fix is that the whole drawing, basemap included, is stretched east-west by
`1/cos(latitude)` — 27% at 38°. The map is consistent with the pipes; it is a plate-carrée view of
both.

## 6. The projection seam, and why it was not landed with the tiles

**It was examined and judged too large for one pass.** Two things decided it, and both are facts
about the code rather than caution:

1. **The document's coordinates flow into the drawing pipeline as the node OBJECTS themselves.**
   `linkPointList()` returns `nodeById()` results; label offsets `lx`/`ly` are in document units;
   the collision pass, the leader geometry, `bbox()`, `zoomExtent()`, the drag write-back and the
   backdrop-registration wizard all measure in the same units. `js/looped-network.js` is 14.5k lines
   with **184 reads of `.x`, 172 of `.y`, 23 calls to `screenToWorld()` and 45 to `state.s`.** A
   projected shadow would have to reach nearly all of them, and every site missed is wrong **only in
   geographic mode and only away from the equator** — invisible in a diff and invisible in English.
2. **The cheap version — making the INTERNAL frame Mercator and leaving the FILE in lon/lat — is
   blocked by a shared seam, not by its own difficulty.** It would be a small change to
   `inwardX`/`inwardY`/`outwardX`/`outwardY` plus serialization, but `js/lpn-inp.js` (import) and
   the `.inp` exporter write and read `doc.nodes[].x` directly. Redefining what that field means in
   memory changes those files' meaning silently. That is a sequencing problem: it can be done, but
   not concurrently with `.inp` work.

Neither the tiles nor the geodesic length needs the seam. What the seam buys is a conformal display
— a city that looks like its own map rather than 27% wide — and it should be its own task, done
after the `.inp` round trip has settled, with a `drawPos()` write seam and a call-site count guard of
the same shape as `dev/lpn-spike/local-origin-harness.js`.

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
