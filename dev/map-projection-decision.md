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

### The one thing to settle before anybody builds it

**proj4js, or UTM alone?** UTM alone is a few hundred lines and covers most engineering work.
proj4js is thousands of CRSs, is what the browser GIS world actually uses, and is a real runtime
dependency on a page that vendors only the EPANET engine today. The mathematics report costs the
CRS options; it does not cost this choice, and this choice is the one that decides the size of the
work.

## His test case, which is the acceptance test

1. Go as far north as the world map extends, draw a rectangular network, compare the auto length of
   the north east-west pipe against the south one. **The north one is shorter.** He accepts this as
   correct for Mercator and it is: it is meridian convergence showing through.
2. Go to 89.99 degrees. *"longitude lines are still parallel and latitude lines are straight as
   reported by the coordinates tracker, which cannot work."* The readout is lying, and nothing on
   screen names the projection in force.

**What is defensible is the arithmetic. What is not is the picture and the readout.**
