# Map sketch coordinate system: a deep review against the literature

**Asked for by Tom, 2026-09-11:** *"Do a deep review of our map sketch coordinate system paradigm
with reference to the best appropriate literature for web geographic and xy mapping. Write a deeply
honest and practical report to inform roadmap tasks if and as necessary."*

**What this is.** A review, not a build. Nothing shipped was edited to write it. Every number below
is labeled **MEASURED** (a harness was run, or arithmetic was run against the page's own constants)
or **ARGUED** (reasoning from the code and the literature).

**The one framing that decides most of the verdicts.** We are not a map viewer. We are a *drawing
surface with a hydraulic model on it*, which is a different product from Leaflet, MapLibre, or
ArcGIS Online, and it is also different from EPANET, whose coordinates are decoration. Several
places where we are non-standard are non-standard for that reason and are defensible. Several
others are not.

---

## 1. What the paradigm IS

Stated plainly, so a future reader need not reverse-engineer it.

### 1.1 Two project kinds, declared before anything is drawn

`project.coords` is `xy` or `geo`, chosen at File > New and never toggled
(`dev/geographic-projects.md` §1). An XY project's coordinates are canvas units whose meaning the
user declares (1 unit is 1 ft or 1 m). A geographic project's are longitude and latitude on WGS 84.

### 1.2 Three frames, and four functions between them

| Frame | Y direction | What lives there |
|---|---|---|
| **File / world** | Y **up** (Cartesian, since v4) | What a `.lpn` and a `.inp` store. Geographic: absolute lon/lat degrees |
| **Drawing** | Y **down** (SVG) | Every coordinate in memory, every `bbox()`, the label pass, the collision pass, hit testing, the tiles |
| **Screen** | Y down | `translate(tx,ty) scale(s)` on one `<g>`, a **uniform** scale |

The whole boundary between file and drawing is four functions in `js/looped-network.js`
(lines 4085-4097):

```js
function outwardX(x) { return x + docOrigin().x; }
function outwardY(y) { var c = cartesianY(y) + docOrigin().y;
                       return isGeoProject() ? Geom.mercLat(c) : c; }
function inwardX(x)  { return x - docOrigin().x; }
function inwardY(y)  { return cartesianY((isGeoProject() ? Geom.mercY(y) : y) - docOrigin().y); }
```

`dev/lpn-spike/local-origin-harness.js` **counts the call sites** (20/20/17/18 today) so a fifth
boundary added later cannot slip in. That census has already caught two real defects: a first draft
of the Task 439 rebase and a first draft of the Task 629 view guard both called `cartesianY()`
directly.

### 1.3 The drawing frame for a geographic project: Mercator y, longitude-degree units

`x` is longitude, unchanged. `y` is `Geom.mercY(lat)`, the **spherical** Web Mercator ordinate
expressed in degrees rather than radians or meters, so that y runs 0 at the equator to ±180 at the
cutoff latitude 85.0511287798066°.

The unit of both axes is therefore *a degree of longitude*. Both axes are scaled identically, so
**the view transform stays a uniform scale**: a junction is a circle, a pipe stroke is one width,
and no anisotropic transform exists anywhere in the page.

This is Web Mercator (EPSG:3857) with a different linear unit. EPSG:3857 puts the same projection
in meters on a sphere of radius 6378137; we put it in degrees. The map is the same map — only the
scale constant differs (× 6378137·π/180 gets you to 3857 meters).

### 1.4 The file is never projected

`mercLat(mercY(lat))` returns a different double for **69.7% of latitudes** (200,000 samples,
worst departure 2.4e-13°, MEASURED in `dev/lpn-spike/mercator-harness.js`). Storing the projection
would make every open-and-save a third conversion on the user's own numbers, which CLAUDE.md
forbids. So `projectStoredGeo()` stashes the file's own lat and lon beside the drawn values
(`_ysrc`, `_xsrc`) and `unprojectStoredGeo()` hands them straight back, believed only while the
drawn number is still the one derived from them.

**MEASURED:** `geo-origin-harness.js` — open then save is *bit-identical*, and a second round trip
is a fixed point.

### 1.5 The local origin

A geographic document is rebased at load onto an origin floored to a **1/128° power-of-two grid**
(`LPN_GEO_ORIGIN_GRID`), derived from the model extent and **never stored** (the file states
`origin: {0, 0}`, so the format did not move — no v11, no migration). An XY document gets an origin
only past `LPN_ORIGIN_THRESHOLD` = 1e4, rounded to 1e-3.

### 1.6 Distance

`Geom.geodesicMeters()` takes the WGS 84 meridional radius M and prime-vertical radius N at the
leg's **mid-latitude** and treats the leg as flat in that local frame — a local tangent plane with a
per-leg tangent point. Longitude wraps at the antimeridian; latitude does not. A polyline is summed
leg by leg. Never haversine (a sphere is wrong by ~0.5%, 5 m/km).

`len` is **STORED and overridable**, never derived. `lenAuto` is only what the Auto checkbox fills
it with.

### 1.7 Basemap tiles

Hand-rolled OSM/Mapbox raster `<image>` elements in the SVG world layer. Because the drawing frame
is Mercator, **a tile box is an exact square in the drawing frame** and the raster stretches
linearly into it. Tile math and the drawing frame go through one `mercRadY()`.

### 1.8 Scale bounds

```js
MIN_SCALE_GRID = 0.05, MAX_SCALE_GRID = 500, DEG_PER_M = 1 / 111132;
minScale() = geo ? max(0.05, canvasWidth / 360) : 0.05
maxScale() = geo ? 500 / DEG_PER_M = 5.5566e7 : 500     // pixels per drawing degree
```

### 1.9 Georeferencing an XY drawing

File > Import XY to lat/lon runs a wizard that applies a **rigid similarity** — translate, rotate,
one uniform scale — in ground meters at a frozen anchor latitude. There is no CRS-aware transform,
no datum, no projection parameters. Two-point placement by eye and by drag.

---

## 2. What is RIGHT, and why

### 2.1 Keeping lon/lat in the file rather than projected coordinates — RIGHT, and standard

This is precisely what the W3C/OGC *Spatial Data on the Web Best Practices* asks for. BP 7
("Choose coordinate reference systems to suit your user's applications") and BP 8 ("State how
coordinate values are encoded") live in §13.2.2, which tells publishers to state the CRS explicitly
rather than let it be inferred (https://www.w3.org/TR/sdw-bp/). We store WGS 84 geographic
coordinates, we state DEGREES in `[BACKDROP] UNITS` on export, and the projection never touches the
file. Storing the display projection is the mistake, and `dev/geographic-projects.md` §3 forbids it
by name.

The registry itself supports the position. EPSG:3857 is recorded as **"Not a recognised geodetic
system. Uses spherical development of ellipsoidal coordinates"**, with scope **"Web mapping and
visualisation"**, and notes errors relative to EPSG:3395 of 0.7% in scale
(https://epsg.io/3857). It is a display CRS. Treating it as one is right.

### 2.2 The Mercator-y drawing frame with a shared longitude-degree unit — RIGHT, and clever

The three properties that make it cheap are real:

- The view transform stays a **uniform** scale, so symbols stay circular and strokes stay one width.
- The 184 reads of `.x` never had to change; the frame's definition moved, not its consumers.
- Tiles register exactly because a tile is now a square in the frame.

**MEASURED**, `mercator-harness.js` §7: a square on the ground is now drawn square to better than
0.2% at latitudes 0, 33.4, 38, 50, and 60, where the unprojected frame drew aspect ratios of
1.000, 1.198, 1.269, 1.556, and 2.000. The anisotropy is gone, not reduced.

Choosing degrees over EPSG:3857 meters is a *unit* choice, not a projection choice, and it is
harmless. Mapbox GL and MapLibre make the analogous choice in the other direction: their
`MercatorCoordinate` runs 0-1 across the world
(https://docs.mapbox.com/mapbox-gl-js/api/geography/,
https://maplibre.org/maplibre-gl-js/docs/API/classes/MercatorCoordinate/). Nobody uses EPSG:3857's
own meters internally either.

### 2.3 `len` stored and never derived — RIGHT, and the single most important decision here

Esri's own documentation is blunt: the Web Mercator Auxiliary Sphere **"heavily distorts both area
and length measurements"**
(https://developers.arcgis.com/documentation/spatial-analysis-services/geometry-analysis/length-and-area/).
NGA's 2014 position paper went further for its own domain, assessing Web Mercator errors **up to
40,000 m** and calling it an unacceptable risk for navigation
(https://www.sedris.org/wg8home/Documents/WG80605.pdf; readable coverage at
https://www.gpsworld.com/nga-issues-advisory-notice-on-web-mercator-for-mission-critical-operations/).

A pipe length feeds head loss linearly. Hazen-Williams h_f ∝ L. If we derived length from the
drawing frame, every length would be 1/cos(latitude) too long — 19% at 33°N, 30% at 40°N, 56% at
50°N — silently, on a picture that looks perfectly reasonable. We do not. `linkGeomLength()` routes
through `outwardX/outwardY` and `geodesicPolylineMeters()`, and the length lands in the document as
a number the user can overwrite.

This is the design's best decision and it should be defended against every future convenience.

### 2.4 The local origin and the power-of-two grid — RIGHT, and better than the alternative

The rasterizer argument is sound and empirically corroborated. SVG path coordinates reach Skia as
`SkScalar`, which is a 32-bit float; Task 354's browser-side symptom was a `<circle>` rasterized at
x = -41,548,184. The composition the page asks for is `s*x + tx` where both terms are enormous and
nearly equal — catastrophic cancellation, which float32 cannot do.

**MEASURED** (`geo-precision-harness.js`, which models the arithmetic with `Math.fround` and
validates against a float64 reference first): on a raw longitude the drawing loses half a pixel at
**64,000 px/degree**, and at the deepest permitted zoom a node lands **575 px** from where it was
asked for. Rebased, the same drawing is placed to **0.011 px**.

The same class of defect is acknowledged by the maintainers of the mainstream WebGL renderer —
mapbox-gl-js issues #1733 ("Point geometry is unstable at high zoom levels") and #8709 ("Working
with 64-bit float resolution in custom layers") are the same cancellation in a GPU pipeline. We are
not inventing a problem.

**The power-of-two grid is the correct remedy for the exactness requirement**, and here the standard
remedy is *not* available to us. The usual advice — project to a metric CRS and use doubles — does
not help, because our constraint is not accuracy, it is *byte identity of the user's own numbers on
an open-and-save round trip* (CLAUDE.md, "ONLY THE USER TOUCHES A FILE'S NUMBERS"). Only an exactly
representable origin gives that. Sterbenz's lemma — if y/2 ≤ x ≤ 2y then x − y is exact
(https://en.wikipedia.org/wiki/Sterbenz_lemma; Goldberg 1991,
https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html; Muller et al., *Handbook of
Floating-Point Arithmetic*, 2nd ed., Lemma 4.1) — plus a dyadic origin gives `(x − ox) + ox === x`
exactly.

And the team already found the hole in its own argument: Sterbenz needs *nearness to the origin*,
not a small model, so `_xsrc`/`_ysrc` carry the file's value on both axes where it fails. That is
the right belt-and-braces.

### 2.5 `geodesicMeters()` — RIGHT for the mission, and correctly measured

**MEASURED** (`scope-of-service-harness.js`, which writes Vincenty out from the published formula
rather than calling ours; worst case over latitudes 0-60 and all leg directions):

| Leg | Ground | Departure from a true geodesic |
|---|---|---|
| 0.1° | 12 km | 0.0 ppm |
| 0.5° | 62 km | 7 ppm |
| 1° | 124 km | 28 ppm |
| 2.7° (mission scope) | 334 km | **206 ppm (0.021%)** |
| 6° | 734 km | 1,052 ppm (0.105%) |

**Does a hydraulic model care?** No, and the arithmetic says so rather than hand-waving. h_f ∝ L
in Darcy-Weisbach and ∝ L in Hazen-Williams, so 206 ppm of length is 206 ppm of head loss — about
0.002 ft on a 10 ft loss. Against that: a Hazen-Williams C is known to maybe ±10%, an internal
diameter after 40 years of tuberculation to ±5%, and a node dragged onto a basemap to perhaps ±2 m
in 300 m, which is 6,600 ppm. **The geodesy is three orders of magnitude better than the worst input
it sits beside.** It is also better than the coordinate it is computed from.

The error budget is stated correctly in `dev/geographic-projects.md` §2b and the table above
reproduces. One caveat worth recording: the 206 ppm is for a *single leg* 334 km long. Real pipes
are meters to kilometers, and the harness's own row for an 11 km leg is **0.28 ppm**. The mission
scope number is the bound on a pathological single link, not on a realistic one — which makes the
design *more* conservative than the table reads.

For reference, the authoritative alternatives are Karney's algorithm (*Algorithms for geodesics*,
J. Geodesy 87(1), 43-55, https://arxiv.org/abs/1109.4448, implemented in GeographicLib
https://geographiclib.sourceforge.io/geod.html) and Vincenty 1975
(https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf). Karney is nanometer-accurate and always converges;
Vincenty fails on near-antipodal pairs. Neither is worth importing for a 206 ppm gain on a leg
nobody draws.

### 2.6 The single-formula discipline — RIGHT, and unusually well guarded

One Mercator logarithm in the suite, asserted by a harness. One `geodesicMeters()`. One set of frame
converters, with a call-site census. Four converters instead of one clever one. This is better
discipline than most GIS-adjacent code, and it is the reason the Task 517 family of bugs (three
sites carrying a pre-Mercator `mpd.lat` assumption) was findable at all.

### 2.7 Hit testing — RIGHT, and the question in the brief has a simple answer

Item 6 of the brief worries about hit testing in a frame where a pixel is not a constant ground
distance. It is a non-issue, for a reason worth stating: **every tolerance on this page is published
in screen pixels divided by `state.s`**, so `--lpn-hit`, `--lpn-nhit`, `--lpn-hair`, and the symbol
factor are a constant number of *screen* pixels at every zoom and every latitude. A pointer aims at
what it can see. Nothing hit-tests in ground units, so ground distance never enters.

The residual — that a screen pixel is a different ground distance at the top of the view than at the
bottom — is tiny inside one viewport. **MEASURED** (arithmetic on the page's own `mercY`): on a
900 px-tall canvas at the Net3 example's 6,479 px/degree, the Mercator scale factor varies **0.134%
from top to bottom at 33.4°N** and 0.210% at 60°N. At a zoomed-way-out 100 px/degree it reaches
9.0%, but at that zoom nothing is being clicked precisely anyway.

### 2.8 XY projects — RIGHT, and standard practice

An XY project is a flat Cartesian drawing with a declared unit. Leaflet's `L.CRS.Simple` exists for
exactly this case — *"a simple Cartesian coordinate system... one horizontal map unit is mapped to
one horizontal pixel"* (https://leafletjs.com/examples/crs-simple/crs-simple.html). We are doing
what the mainstream library does for non-geographic drawings, and EPANET itself does nothing more:
the EPANET 2.2 manual says node coordinates **"represent the distance from the node to an arbitrary
origin at the lower left of the map. Any convenient units of measure for this distance can be
used"**, and **"their locations need not be to actual scale"**
(https://usepa.github.io/EPANET2.2/back_matter.html). EPANET coordinates are unitless decoration
that never reaches the solver. We are already strictly more honest than the reference
implementation, because our XY unit is declared and our geographic lengths are real.

---

## 3. What is WRONG or risky, ranked by what it could cost a user

### 3.1 HIGHEST — There is no scale bar, and the map's scale varies with latitude

**MEASURED by grep:** the strings `scale bar`, `scalebar`, and `North arrow` appear nowhere in
`js/`, `lib/`, or `lib/lang.ec.en.php`. The only mention in the tree is
`dev/sizing-paradigm.md` line 105, an open question: *"Is a scale bar now obligatory? A drawing that
declares a scale should probably show one."*

This is the one place where our own design record already convicts us. `dev/geographic-projects.md`
§2 states the danger in its own words:

> **Scale is not uniform.** Web Mercator's scale error is `1 / cos(latitude)`... A pipe length
> measured naively off a tiled backdrop is wrong by more than any engineering tolerance, silently,
> and looks perfectly reasonable on screen.

We wrote that down, built the correct geodesic length, and then shipped a map with **no way to read
a distance off it at all**. A user who wants to know how far it is from the tank to the booster
station has exactly two options: draw a pipe and read `lenAuto`, or eyeball it against a basemap
that is stretched 19% at Phoenix and 30% at Denver. The second is the natural thing to do and it is
wrong.

**What the literature does.** Both mainstream libraries ship a scale bar and both compute it at the
*current center latitude* rather than at the equator. OpenLayers' `ScaleLine` documents the
principle directly: *"For conformal projections (e.g. EPSG:3857...), the scale is valid for all
directions"* (https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine.html), and it
derives the bar from `getPointResolution()` at the view center. Leaflet's `L.Control.Scale` does the
same through the map's own `distance()`
(https://github.com/Leaflet/Leaflet/blob/main/src/control/Control.Scale.js). Neither writes
`× cos(lat)` literally; both evaluate the local resolution at a point, which is the same thing done
properly.

**We have the primitive already.** `EngCalcs.lpnGeorefMetersPerDegree(lat)` returns `.lon` and
`.lat`, and `state.s` is px per drawing degree. Ground meters per pixel east-west is
`mpd.lon / state.s`. That is one line. The bar itself is a rounded number and a rule in the corner.

Cost of not having it: a user makes a distance judgment off a stretched picture, on a page whose
entire purpose is distance-sensitive hydraulics. **It is also the single cheapest thing on this
list.**

### 3.2 HIGH — The drawing cannot be printed to scale, and there is no north arrow

`window.print()` exists (line 15015) and prints the pane. There is no drawing scale, no scale bar,
no north arrow, no title block scale statement. A geographic drawing is always north-up (rotation
is not offered outside the georeferencing wizard's own frame), so a north arrow is a one-glyph
decoration — but its absence is conspicuous to anyone who has produced a civil exhibit, and its
presence is what tells a reader the drawing *is* north-up rather than arbitrary.

Printing to scale is genuinely harder and `dev/sizing-paradigm.md` already scopes it. The honest
statement today is: **this page produces a picture, not a drawing**, and a hydraulic engineer's
deliverable is a drawing.

### 3.3 HIGH — Two shipped code comments are factually false about the frame

Both in `js/looped-network.js`, both post-dating the projection seam, both stating the opposite of
what the code now does.

**Line 7375 onward**, in the basemap header:

> **THE DISPLAY IS STILL UNPROJECTED, AND THE TILES ARE PLACED SO THAT THIS IS NOT A LIE.** ...
> What it does NOT fix is that the whole drawing, basemap included, is stretched east-west by
> 1/cos(latitude) -- the standing limitation of an unprojected display. The honest fix is a
> projection seam at every point where a coordinate becomes a drawn position, which is its own
> piece of work

Every sentence of that is now wrong. The display *is* projected, the projection seam *was* built
(Task 145, closed 2026-08-24), it lives at four functions rather than "every point", and the stretch
is **MEASURED at zero** by `mercator-harness.js` §7. It also still describes the chord approximation
as the placement's residual, which `dev/geographic-projects.md` §5 records as having gone from
0.025 px to ~1e-10 px.

**Line 7615**, at the tile `<image>`:

> The tile box is NOT square in this unprojected frame -- it is 1 : cos(latitude) -- so the raster
> must stretch to fill it rather than be letterboxed.

The tile box **is** square: `pw = lonR - lonL` and `ph = inwardY(latB) - inwardY(latT)` are both
360/2^z drawing degrees, exactly. `preserveAspectRatio="none"` is still correct (a square raster in
a square box is a no-op), but the stated reason is false.

Cost: this is not a user-facing defect, it is a *contributor-facing* one, and this repository's own
CLAUDE.md argues at length that a false claim in prose is how the next person builds the wrong
thing. Someone reading line 7384 would conclude the projection seam is unbuilt and might build it
again, or might reject a correct bug report because "the drawing is stretched anyway."

### 3.4 MEDIUM — The origin rebase's headroom shrinks with model span, and nothing says so

`geo-precision-harness.js` proves the fix on a **440 m site** (`SPAN_DEG = 0.005`). That is an
honest test of the reported defect and an incomplete test of the design, because the residual error
is proportional to the model's span in degrees.

**MEASURED** (the same `s*x + tx` float32 composition, on the page's own `maxScale()` = 5.5566e7
px/degree, counting only points that land on a 1200 px canvas):

| Model span | Ground at 33°N | Worst on-screen error at maxScale | Half a pixel lost at |
|---|---|---|---|
| 0.005° | 0.44 km | 0.04 px | 4.8e8 px/deg (out of reach) |
| 0.05° | 5 km | 0.12 px | 7.8e7 px/deg (out of reach) |
| 0.5° | 47 km | 1.0 px | 1.1e7 px/deg |
| **2.7° (mission scope)** | **251 km** | **8 px** | **1.7e6 px/deg** |

So at the declared 300 km mission scope, the rebased drawing starts losing half a pixel at about
1/33 of the deepest permitted zoom, and at the deepest zoom a node sits up to 8 px from its own pipe
end. That is 70x better than the 575 px Task 439 fixed and it is not zero. It has never been
measured before today, and `dev/geographic-projects.md` §2b explicitly says the scope bound "does
not relax the origin work of Task 439" without noting that the *converse* also holds: the origin
work's margin is a function of the span.

Practically: nobody zooms a 250 km model to 1.7 mm per pixel. But the page permits it, `zoomExtent`
and Go-to can land you deep, and the failure looks like a rendering bug rather than a precision
limit. A cheap mitigation exists — clamp `maxScale()` for a geographic project by the model extent,
or re-derive the origin around the viewport rather than around the model.

### 3.5 MEDIUM — The origin is derived at load only, so a long session can drift out of it

**MEASURED by grep:** `rebaseGeoDocument()` is called from exactly one place (`applySaved()`, line
17820) and `rebaseLiveGeoDoc()` from one (`georefFinish()`, line 9409). Nothing re-derives the
origin as a document grows.

So: open a California project (origin ≈ -122.57), pan to Kenya, draw a second cluster. The new nodes
carry local x ≈ 157 degrees, and the float32 composition at deep zoom degrades accordingly. It is
self-healing — save and reopen and the origin moves — and it is a strange thing to do. But the "dear
file" practice means long-lived projects exist, and "it fixes itself when you reload" is exactly the
class of report that arrives as *"the map was broken and then it wasn't"*, which is what Task 624
has been chasing for two days.

### 3.6 LOW — `maxScale()` is latitude-dependent in ground terms, and stated in a unit nobody can reason about

`maxScale() = 500 / DEG_PER_M = 5.5566e7` **pixels per drawing degree**. The comment says the
multiplier makes the geographic pair "mean the same PHYSICAL span as the grid pair does in metres."
It nearly does, at the equator, and it drifts with latitude because a drawing degree is a degree of
*longitude*.

**MEASURED** (arithmetic on WGS 84 radii at the page's constants):

| Latitude | Screen px per ground meter, east-west, at `maxScale()` | Ground m/px at `minScale()`, 1200 px canvas |
|---|---|---|
| 0° | 499 | 33,396 |
| 33.4° | 597 | 27,909 |
| 50° | 775 | 21,509 |
| 60° | 996 | 16,740 |

So a user in Oslo can zoom twice as far in, in ground terms, as a user in Quito. Nothing breaks —
both are absurdly deep — but the bound does not mean what the comment says it means, and `500 /
(1/111132)` is not a number any reader can picture. A bound expressed as *ground meters per pixel*
would be readable, latitude-correct, and would fold in the 3.4 mitigation for free.

`minScale()` being `canvasWidth / 360` is correct and well-reasoned (the whole Earth and no
further, because past that the map repeats), but note it makes the *permitted view set* depend on
window width, which is the kind of coupling that produced Task 629.

### 3.7 LOW — A prose precision error in the Sterbenz argument

`js/looped-network.js` line ~16999:

> Sterbenz gives it: `x - ox` is exact whenever ox/2 <= x <= 2*ox

For a US longitude this reads false on its face: with ox = -122.5703125, `ox/2 = -61.3` and
`x = -122.57`, so `ox/2 <= x` fails. The lemma's published form assumes positive operands
(https://en.wikipedia.org/wiki/Sterbenz_lemma) and extends to negatives by symmetry on magnitudes,
which is what actually applies here and what makes the code correct. The conclusion is right; the
stated condition is sign-careless in the one hemisphere the harness uses.

---

## 4. What is merely NON-STANDARD, but defensible

### 4.1 Drawing in "degrees of longitude" rather than EPSG:3857 meters

Non-standard in its unit only. Every consequence that matters — conformality, square tiles, uniform
view scale — is identical. A GIS person reading `state.s = 6479` will not know what it means without
being told; an EPSG:3857 meter scale would be equally opaque. Keep it, and consider naming it in one
comment as "EPSG:3857 with a degree linear unit," which is what it is.

### 4.2 No projected CRS anywhere in the product

Standard engineering practice for a site is a projected CRS — State Plane or UTM — in which
`hypot(dx, dy)` is a distance to within the grid scale factor. QGIS and Esri both teach this
(https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/coordinate_reference_systems.html,
https://learn.arcgis.com/en/projects/choose-the-right-projection/).

We deliberately do not, and the reason is good: **the correct distance is computed anyway**. A
projected CRS buys you the ability to measure with Pythagoras; we measure with the ellipsoid
instead, which is more accurate than State Plane (State Plane's own grid scale factor runs to
1 part in 10,000 by design, and a surveyor's combined factor including elevation can exceed that —
see NOAA/NGS Special Publication NOS NGS 13, *The State Plane Coordinate System*,
https://geodesy.noaa.gov/library/pdfs/SP_NOS_NGS_13.pdf, and the grid-versus-ground discussion at
https://www.xyht.com/surveying/grid-ground-project/). Our 206 ppm at 300 km is *better* than State
Plane's own 100 ppm-scale distortion is at the zone edge, for the quantity that matters.

What a projected CRS would buy that we lack is **interoperability**, not accuracy. See 4.3.

### 4.3 No CRS is ever named, on import or on export

We read and write EPANET's `[BACKDROP] UNITS` — FEET, METERS, DEGREES, NONE — which is the file's
own statement about its coordinates, and it is all EPANET offers. We never name a datum, a
projection, or an EPSG code, anywhere.

This is defensible *as EPANET compatibility* and indefensible *as a data product*. W3C/OGC BP 8 asks
publishers to state how coordinates are encoded (https://www.w3.org/TR/sdw-bp/), and a `.lpn` file
saying `coords: "geo"` with bare degrees implies WGS 84 without saying so. In practice every
consumer will assume WGS 84 and be right. The cost is zero today and nonzero the day somebody hands
us a file in NAD 27 (a ~100 m shift in the western US) or asks to export to GeoJSON, which
RFC 7946 pins to WGS 84 and which would then be correct by accident.

### 4.4 Georeferencing by eye, with a similarity transform

A rigid similarity — translate, rotate, uniform scale — cannot represent the relationship between
State Plane coordinates and lon/lat. It is a *local approximation* of it, frozen at one anchor
latitude, and the code says so honestly: the residual is M/N, the ratio of the meridional to the
prime-vertical radius, **MEASURED at 0.9953 at 33.4°N and 0.9966 at 45°N** — about 0.4%,
north-south only, and `dev/lpn-spike/georef-carry-harness.js` measures it rather than asserting it
is small.

0.4% on a north-south dimension is 4 m in a kilometer. For a drag-it-onto-the-aerial gesture where
the placement itself is good to a few meters at best, that is below the noise. For a survey-grade
import it is not. The design does not claim to be survey grade, and the wizard's whole idiom — drag,
resize, rotate, "Keep this placement" — advertises that it is not.

What is missing is the *other* door: a user with real State Plane or UTM coordinates has no way to
say so and get an exact transform. See 5.4.

### 4.5 One frame for everything — labels, collision, bbox, hit test

Non-standard against a GIS renderer, which typically works in screen space for layout. Defensible
here, and better: because the frame is conformal, angles and shapes are correct, so a label
collision box computed in drawing units is a label collision box on screen. The only thing a
drawing unit is *not* is a distance on the ground, and nothing in the layout pass wants one.

### 4.6 SVG rather than WebGL

`dev/geographic-projects.md` §4 rejects MapLibre GL explicitly. It is the right call for this
product — an SVG world layer gives us printing, DOM hit testing, and CSS theming for free, and the
precision problem we hit (§2.4) is one MapLibre's own users file issues about too. The cost is a
ceiling on element count, which is a different review.

---

## 5. Candidate roadmap tasks

One line of cost and benefit each. Ranked as the sections above rank them. **These are candidates
for Tom's judgment, not entries — nothing was added to `dev/ROADMAP.md`.**

1. **A scale bar on a geographic project.** *Cost:* small — `mpd.lon / state.s` is ground meters per
   pixel, plus a rounded bar and a label in the corner; the hard part is picking the round number and
   the unit strip's ft/m. *Benefit:* the highest on this list. It closes the one gap where our own
   design record says the danger is real and silent, and it is what every mainstream map ships.
2. **Correct the two false comments in `js/looped-network.js`** (lines ~7375-7387 and ~7615).
   *Cost:* trivial, comment-only, no behavior. *Benefit:* stops a contributor rebuilding a seam that
   exists or dismissing a real bug report; this repository's own doctrine says a false claim in prose
   is how the next defect gets built.
3. **A north arrow, and a scale statement on print.** *Cost:* the arrow is a glyph and one setting;
   printing to scale is real work already scoped in `dev/sizing-paradigm.md`. *Benefit:* turns a
   picture into something a civil engineer can put in a submittal. Probably split: the arrow now, the
   print scale with Task 325.
4. **Express `maxScale()` in ground meters per pixel, and clamp it by the model extent.** *Cost:*
   small and localized to `minScale`/`maxScale`. *Benefit:* a bound anybody can reason about, plus it
   folds in §3.4's 8 px residual at the mission scope for free.
5. **Re-derive the geographic origin when the live document grows past it.** *Cost:* small — the
   machinery exists (`rebaseLiveGeoDoc()`); the work is picking the trigger and compensating
   `state.tx/ty` as `georefFinish()` already does. *Benefit:* removes a self-healing-on-reload class
   of report, which is the hardest kind to diagnose.
6. **Extend `geo-precision-harness.js` to a mission-scope span.** *Cost:* a few lines — a second
   `SPAN_DEG`. *Benefit:* the design's margin becomes a measured number that a future change cannot
   silently spend. (The table in §3.4 is that measurement; making it a harness makes it a ratchet.)
7. **Name a CRS on export, at least in a comment.** *Cost:* one line in the `.inp` writer, a field in
   the `.lpn`. *Benefit:* satisfies W3C/OGC BP 8 and costs nothing; buys the ability to refuse a
   NAD 27 file rather than shift it 100 m.
8. **Typed coordinate entry for a projected CRS (UTM / State Plane).** *Cost:* large — a projection
   library or a hand-rolled Transverse Mercator, a zone picker, and a whole UI. *Benefit:* real, for
   the user who has surveyed coordinates and today must drag them onto an aerial. **Probably not
   worth it yet**, and the honest interim is to say plainly in the georeferencing wizard that
   placement is by eye. Related: ROADMAP line 535 already contemplates surveyed-coordinate import.
9. **Fix the Sterbenz inequality's sign in the comment.** *Cost:* one line. *Benefit:* the argument
   currently reads false in the hemisphere the harness runs in.

---

## 6. Where our own prose is stale or wrong — the list

| Where | What it says | What is true |
|---|---|---|
| `js/looped-network.js` ~7375 | *"THE DISPLAY IS STILL UNPROJECTED"*, *"the whole drawing, basemap included, is stretched east-west by 1/cos(latitude) -- the standing limitation of an unprojected display"*, *"The honest fix is a projection seam... which is its own piece of work"* | The display is Web Mercator. The seam shipped as Task 145 on 2026-08-24, at four functions. The stretch is MEASURED at zero |
| `js/looped-network.js` ~7615 | *"The tile box is NOT square in this unprojected frame -- it is 1 : cos(latitude)"* | The tile box is exactly square: both `pw` and `ph` are 360/2^z drawing degrees. `preserveAspectRatio="none"` stays correct for a different reason |
| `js/looped-network.js` ~16999 | *"`x - ox` is exact whenever ox/2 <= x <= 2*ox"* | True for positive operands; false as written for a western-hemisphere longitude. Correct by symmetry on magnitudes, which is what the code relies on |
| `js/looped-network.js` ~8113 | *"The multiplier is the honest conversion: metres per degree of latitude, which is what makes GEO_MIN/GEO_MAX mean the same PHYSICAL span as the grid pair does"* | A drawing degree is a degree of *longitude*, so the bound is latitude-dependent in ground terms — 499 px/m at the equator against 996 at 60°N. This is the same class as the three sites Task 517 already corrected |
| `dev/geographic-projects.md` §2b | *"It does not relax the origin work of Task 439"* | Correct, and one-sided: the converse is also true and is not stated — the origin work's own margin shrinks with the model's span (§3.4) |
| `dev/geographic-projects.md` §2b table | The 206 ppm row reads as the mission-scope error | It is the error on a *single 334 km leg*. A real link is 0.28 ppm. The design is more conservative than the table reads |

`dev/geographic-projects.md` §3, §5, and §6 are accurate and current, and §5's claim that the chord
approximation is "gone rather than smaller" is MEASURED at ~1e-10 px by `basemap-harness.js`. The
`js/lpn-geom.js` Mercator header is accurate: it calls the 1/cos(latitude) figures a *scale error*,
which they are, and never claims an anisotropy.

---

## 7. Sources

- EPSG:3857 registry entry and caveats — https://epsg.io/3857 (carrier for the IOGP/EPSG parameter
  dataset; the canonical epsg.org requires an interactive search and IOGP Guidance Note 7-2 is
  registration-gated)
- W3C/OGC, *Spatial Data on the Web Best Practices*, BP 7 and BP 8, §13.2.2 —
  https://www.w3.org/TR/sdw-bp/
- NGA, *NGA's Position on "Web-Mercator"* (2014) — https://www.sedris.org/wg8home/Documents/WG80605.pdf;
  readable coverage at
  https://www.gpsworld.com/nga-issues-advisory-notice-on-web-mercator-for-mission-critical-operations/
- Esri, length and area measurement and Web Mercator distortion —
  https://developers.arcgis.com/documentation/spatial-analysis-services/geometry-analysis/length-and-area/
- Esri, *Choose the right projection* — https://learn.arcgis.com/en/projects/choose-the-right-projection/
- QGIS, coordinate reference systems — https://docs.qgis.org/3.44/en/docs/gentle_gis_introduction/coordinate_reference_systems.html
  (general "match projection to purpose"; QGIS does **not** carry a Web-Mercator-specific warning,
  so it is not cited for one)
- Leaflet, `CRS.Simple` for non-geographic drawings — https://leafletjs.com/examples/crs-simple/crs-simple.html
- Leaflet, `L.CRS.EPSG3857` as the default — https://leafletjs.com/reference.html#crs-epsg3857
- Leaflet, `Control.Scale` source — https://github.com/Leaflet/Leaflet/blob/main/src/control/Control.Scale.js
- OpenLayers, `ScaleLine` — https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine.html
- Mapbox GL JS, `MercatorCoordinate` — https://docs.mapbox.com/mapbox-gl-js/api/geography/
- MapLibre GL JS, `MercatorCoordinate` — https://maplibre.org/maplibre-gl-js/docs/API/classes/MercatorCoordinate/
- Mapbox GL JS maintainer-acknowledged precision defects (**not documentation**) —
  https://github.com/mapbox/mapbox-gl-js/issues/1733 and https://github.com/mapbox/mapbox-gl-js/issues/8709
- USEPA, *EPANET 2.2 User Manual*, `[COORDINATES]` — https://usepa.github.io/EPANET2.2/back_matter.html
- Sterbenz lemma — https://en.wikipedia.org/wiki/Sterbenz_lemma, citing Muller et al., *Handbook of
  Floating-Point Arithmetic*, 2nd ed. (2018), Lemma 4.1
- Goldberg, *What Every Computer Scientist Should Know About Floating-Point Arithmetic*, ACM
  Computing Surveys (1991) — https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
- Karney, *Algorithms for geodesics*, J. Geodesy 87(1), 43-55 (2013) — https://arxiv.org/abs/1109.4448;
  GeographicLib — https://geographiclib.sourceforge.io/geod.html
- Vincenty (1975), *Direct and Inverse Solutions of Geodesics on the Ellipsoid* —
  https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf
- NOAA/NGS Special Publication NOS NGS 13, *The State Plane Coordinate System* —
  https://geodesy.noaa.gov/library/pdfs/SP_NOS_NGS_13.pdf
- Grid versus ground (**non-authoritative**, trade press) — https://www.xyht.com/surveying/grid-ground-project/

## 8. Harnesses run for this review

All read-only, all passing on HEAD as of 2026-09-11.

| Harness | What it established here |
|---|---|
| `dev/lpn-spike/scope-of-service-harness.js` | The 206 ppm mission-scope geodesy budget, and 0.28 ppm on an ordinary leg |
| `dev/lpn-spike/geo-precision-harness.js` | The 64,000 px/degree float32 break, the 575 px failure, and the 0.011 px fix, on a 440 m site |
| `dev/lpn-spike/local-origin-harness.js` | The four-converter census: 20/20/17/18 call sites, `cartesianY()` called by nothing else |
| `dev/lpn-spike/mercator-harness.js` | The anisotropy is gone — drawn aspect 1.00000 at every latitude tested, against 2.000 unprojected at 60° |
| `dev/lpn-spike/geo-origin-harness.js` | Open-then-save is bit-identical, and a second round trip is a fixed point |

Two numbers in this report were computed here rather than read out of an existing harness, against
the page's own constants: the latitude table in §3.6 and the span/precision table in §3.4.
