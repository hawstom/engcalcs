# The map's coordinate systems: what we serve, what it costs, and what Tom proposes

Written 2026-09-11, out of a long exchange with Tom while he tested at high latitude. ROADMAP Task
630 is the one-line pointer here. The two measurement reports are `dev/map-coordinate-review.md`
(the audit) and `dev/map-coordinate-mathematics.md` (the derivations); **this file is the
DECISION record, and where they disagree with it they are the arithmetic and this is the intent.**

## What we serve today

Two coordinate systems, and it is worth naming them the way a GIS person would:

- **WGS 84 / Pseudo-Mercator** for a geographic project. The document stores longitude and
  latitude; the drawing frame is x = longitude and y = `mercY(lat)` expressed in degrees of
  longitude, so the view transform stays a uniform scale.
- **Arbitrary XY** for a grid project. Unitless, exactly as EPANET's own coordinates are.

## The problem, in Tom's words, and he is right

> *"lat and lon do not project or scale 1:1 to xy at the north pole and the south pole ... the
> earth is flat for most purposes, but it's not really flat. And lat/lon is neither flat nor even
> approximately rectangular except very near the equator."*

> *"We don't treat them as xy for length calculations. But we show them as xy. And that's a
> problem."*

That second sentence is the whole diagnosis and it is exact. `geodesicMeters()` does the right
thing with latitude when it computes a length. The DISPLAY does not: meridians are drawn parallel
when on the ground they converge, so a screen rectangle with vertical sides is not a ground
rectangle, and a true ground square at latitude draws as what he called **a donut segment** -- an
annular sector, wider at its northern edge.

**TWO DISTINCT EFFECTS WERE BEING CONFLATED IN THAT CONVERSATION, AND BOTH ARE REAL.**

| | what it is | size |
|---|---|---|
| **The graticule** (Tom's) | 1 degree of longitude shrinks as `cos φ`; meridians converge. A lat/lon square is a ground square only near the equator. | `sec φ - 1`: **19.8% at Phoenix, 100% at 60N** |
| **The ellipsoid** (the mathematics report's) | EPSG:3857 treats geodetic latitude as spherical. `N/M = 1/(1-e²)` at the equator, exactly 1 at the pole. | **0.674%, worst at the equator** |

The first is about **150 times** the second. The report's "worst at the equator" finding is true
and was answering a question Tom had not asked; quoting it at him read as a contradiction. **Do
not answer one of these with the other.**

**AND THE MERCATOR CUT-OFF IS NOT A DEFENCE.** Tom, on 89.99 degrees: *"It doesn't matter. The
problem still exists within the limit. The limit only exists because the distortion becomes
laughable at the limit, and thus we know an enormous Greenland."*

## What a scale bar does and does not fix

**It is a mitigation, not the fix, and I got this wrong in conversation before he corrected it.**
I argued that computing the bar at the view's own latitude was the case FOR one. It is not:

> *"that doesn't solve the problem because the view (a 'WGS 84 / Pseudo-Mercator' rectangle) is
> less and less a ground rectangle at larger latitudes."*

A bar makes ONE number honest at ONE latitude while the scale varies continuously down a tall
view. On an engineering drawing that implies a precision the projection cannot deliver. Build one
if it earns its place, but rank it BELOW projections, not above. Formula: mathematics section 5.3.

## Tom's proposal, which is the right architecture

> *"How projections really work is that our map is once again XY or NE, and we only need to know
> the projection when we talk to OSM/Mapbox."*

> *"I am not proposing that we change anybody's data. I am proposing that we offer the standard
> public GIS projections offered by QGIS so that everybody has a non-distorted map. Or we
> reimagine ourselves as a QGIS plug-in, or we use QGIS-ish libraries."*

- A document holds **easting and northing in metres in a STATED CRS** -- a UTM zone, a state plane
  zone, whatever is offered.
- **The drawing frame IS that plane.** A rectangle is a rectangle, a square is a square, a length
  is a length, and `sec φ` disappears from the display as it has already disappeared from the
  arithmetic.
- **The projection is needed at exactly two seams**: fetching tiles, and geocoding. Nowhere else.
- Meridian convergence stops being the reader's problem and becomes the projection's, which is its
  job.

**IT SITS BETTER WITH "ONLY THE USER TOUCHES A FILE'S NUMBERS" THAN A DISPLAY-ONLY CRS WOULD.** A
file written in UTM stays in UTM; nothing is reprojected on open and save. Three coordinate
systems then coexist -- Pseudo-Mercator, a projected CRS, and arbitrary XY -- and an existing file
keeps whichever it already has.

### The contradiction Declan found, and its resolution

**`dev/map-coordinate-mathematics.md` §6.2/§6.4 concludes the opposite of the section above**, and
he caught it: it says storing a projected CRS as the document's frame violates "only the user
touches a file's numbers", because `E,N <-> lon/lat` is a lossy round trip, and that it is LESS
accurate than what `geodesicMeters()` already delivers. Its recommendation is **entry and display
only**. The section above wants the drawing frame to BE the projected plane. Both were written the
same day, by me, from different halves of the problem.

**THEY ARE RECONCILED BY ASKING WHOSE NUMBERS THEY ARE.** The rule is not "never hold eastings";
it is that we never rewrite what the user supplied.

- **A document AUTHORED in State Plane and STORED in State Plane round-trips nothing.** The user
  typed eastings, the file holds eastings, the drawing frame is that plane. There is no
  conversion, so there is no loss, and the mathematics report's objection does not reach it.
- **CONVERTING an existing lon/lat document into a projected CRS is what it forbids**, and it is
  right. That rewrites every coordinate the user has. **Do not offer it as a Settings switch.**
- **The drawing frame is DERIVED from whatever the document already stores**, never chosen
  independently of it. A lon/lat document keeps drawing in Web Mercator exactly as today.

So the document gains a **CRS it declares**, not a CRS it is converted into, and the three
coordinate systems coexist because a file keeps the one it was born with.

### The one thing to settle before anybody builds it

**SETTLED: proj4js, not hand-rolled UTM** (Declan, `dev/coordinate-entry-clerk-review.md`,
2026-09-11), and the reason is decisive and technical rather than a matter of scope:

> **State Plane is not a parameter change on UTM's formula.** It is different PROJECTION FAMILIES
> zone by zone -- Lambert Conformal Conic in some states, Transverse Mercator in others. Building
> UTM first spends the design cost twice rather than saving it.

That is exactly the trap Tom feared (*"I don't know a clean way to move incrementally from
UTM-only to the whole library"*) and it confirms his instinct not to ship UTM alone. proj4js is
EPSG-keyed and already the extensible thing.

**THE SCALE OF THE ZONE PROBLEM, measured rather than assumed**: 124 State Plane zones today,
**953 under SPCS2022**; NAD27 and NAD83 both still in live use, and NATRF2022 in public beta,
shifting NAD83(2011) by 3.5 to 4 ft in Texas alone. **A wrong-zone pick is almost always SILENT**,
because adjacent zones are deliberately similar in magnitude -- so is a missing false-easting,
which shifts a whole batch by one constant and stays internally consistent.

### AND IT IS NOT THE NEXT THING TO BUILD

**There is no typed-coordinate entry surface at all today.** `addNode(type, x, y)` has one caller,
the canvas pointer, and the property popup's coordinate fields are read-only spans. A CRS picker
would be built on a feature that does not exist. Declan ranks Task 610/186's open half -- typed
X/Y and row creation by paste -- and the CSV/GPX survey import ahead of it for anybody working at
volume, and Tom has already said there is no urgency.

## His test case, which is the acceptance test

1. Go as far north as the world map extends, draw a rectangular network, compare the auto length of
   the north east-west pipe against the south one. **The north one is shorter.** He accepts this as
   correct for Mercator and it is: it is meridian convergence showing through.
2. Go to 89.99 degrees. *"longitude lines are still parallel and latitude lines are straight as
   reported by the coordinates tracker, which cannot work."* The readout is lying, and nothing on
   screen names the projection in force.

**What is defensible is the arithmetic. What is not is the picture and the readout.**


## Tom's rulings, 2026-09-13

All nine questions of the projection brief, answered. **These are decisions, not notes.**

- **P1 STORE WHAT THE USER SUPPLIED, and state which.** Not easting/northing, not lon/lat --
  whichever they typed. His reasoning is that the real world offers three shapes and we cannot
  privilege one: `N E`, `E N` (XY), and lat/lon (*"WGS84 / Pseudo-Mercator is the only one in the
  real world today"*). We translate to WGS84 lat/lon only to talk to OSM. This is the option that
  honours "only the user touches a file's numbers" exactly, and it costs two code paths forever.
- **P2 NO DOOR changes a project's CRS.** Save to a file and reopen through **Open and convert
  coordinates**, on a COPY. Two refinements of his own: **refuse to save under the same file name**,
  and the wording may need to be **"Convert coordinates to new file"** to make the break cleaner.
- **P3 proj4js.** Settled; State Plane and the national grids are why.
- **P4 GROUND DISTANCE (grid / k), AND DO NOT ADVERTISE IT YET.** His condition, and it is the
  interesting half: grid-to-ground is *"straining at a gnat while we are swallowing the camel of
  slope distance, pipe dips, pipe depth."* So compute ground length because it is nearly free -- the
  scale factor is stored per node and averaged per pipe, and it varies far less than it matters --
  but **claim nothing about length accuracy in public until slope distance and a length adjustment
  exist too.** That is Task 643.
- **P5 DRAW IN THE PROJECTION; FIT THE TILES TO IT.** *"What you type is what you see. What you
  paste from a spreadsheet is what you get."* Project the view's centre coordinate to WGS84 and use
  that point's scale factor and **convergence angle** to place the OSM request -- a rotation and a
  uniform scale, never a stretch. **CHECKED AGAINST THE LITERATURE AND HE IS RIGHT, with one
  refinement below.**
- **P6 THE FULL EPSG REGISTER, SEARCHABLE, BUT LOCATION FIRST.** The wizard asks WHERE before it
  asks WHICH -- zoom, Go to, or a place-name search -- because knowing the region collapses
  thousands of candidates to a handful. *"The other option is to require them to know. But that's
  less kind."* Copy to carry: UTM is the dominant world standard, a region may have its own
  unyielding customs, ask a Land Surveyor if unsure.
- **P7 SCALE AT THE VIEW CENTRE**, and account for the CRS scale factor there.
- **P8 `;CRS` comment** in the `.inp`, matching the custom-property answer so there is one
  convention.
- **P9 ASK EVERY TIME.** The new-project wizard already asks and that is right. Open question he
  raised: can it be **non-modal**, allowing zoom and search to narrow the projection list, while
  refusing data entry until the project is initialized?

### The one refinement to P5: pin per TILE, not per VIEW

Both projections are conformal -- Web Mercator, Transverse Mercator and Lambert Conformal Conic all
are -- so the mapping between them IS locally a rotation plus a uniform scale, which is exactly what
he describes. The error is second-order and grows with the span the single pin has to cover. Web
Mercator's point scale runs as `sec(phi)` while a projected CRS's is near constant, so the spread
across a view is about `tan(phi) x dphi`. Computed at latitude 33.5 degrees:

| view extent | scale spread | edge misalignment |
|---|---|---|
| 1 km | 0.0104% | 0.03 m |
| 3 km | 0.0312% | 0.23 m |
| 10 km | 0.1039% | 2.60 m |
| 100 km | 1.0389% | 260 m |
| 300 km | 3.1167% | 2,338 m |

So a single centre pin is exact enough for drawing and visibly wrong at overview zoom -- and 300 km
is this suite's own stated mission scope, where it is off by more than two kilometres.

**The fix is his own method applied per tile rather than per view.** A tile covers a small span at
every zoom level, so a per-tile rotation-and-scale keeps the residual bounded by TILE size instead
of VIEW size, and it never needs a threshold or a subdivision pass. This is what OpenLayers' raster
reprojection does in its general form (it triangulates and subdivides until the residual is under
about half a pixel); per-tile is the same idea with the subdivision already chosen for us by the
tile grid. Grid convergence at 100 km from a central meridian at this latitude is 0.496 degrees,
which is the rotation he is calling for and is large enough to see.
