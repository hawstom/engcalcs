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

## 4. The basemap is the open decision, and it gates the build

Not the idea — the provider. Four things have to be answered together, because they trade against
each other:

| Question | Why it decides the build |
|---|---|
| Which tiles | Google needs a key, a billing account and ToS review; OSM needs neither but has a usage policy and no aerial imagery; Esri/Mapbox sit between |
| Key management | A key in a static page is a key anybody can spend. A proxy is a server, and this suite has none |
| Terms of service | Some providers forbid caching tiles at all, which collides directly with the PWA |
| Offline | The suite's offline promise is real and tested (`sw_manifest_check.php`). A geographic project that is blank without a network is a different product on a field laptop |

**The aborting condition still applies:** the core solve never depends on any of this, so the feature
can be dropped at zero cost if the terms turn hostile. That constraint matters more here, not less.

## 5. What a first slice looks like

Deliberately not the tiles. The tiles are the part that is gated; everything below is not, and it is
most of the work:

1. **The declaration itself** — stored on the project, chosen at New, visible in the units strip,
   and carried through save/open and the `.inp` round trip.
2. **Coordinates that know what they are** — the readout, the property popup and the coordinate
   entry all in degrees (and a sensible DMS/decimal choice), with `outwardX`/`outwardY`'s existing
   boundary as the one place it happens.
3. **Geodesic length as an OFFER** — a button on a pipe, never an automatic write, per §2.
4. **Then** a tile layer as one more backdrop type, pre-registered rather than scale-gestured.

Steps 1–3 are testable headlessly and are worth having even if step 4 never ships.
