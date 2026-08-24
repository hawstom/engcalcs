# Converting an XY project to a lat/lon one (ROADMAP Task 145)

`dev/geographic-projects.md` §1 already said this had to exist: *"Converting an existing project is a
deliberate, separate operation (a georeferencing wizard — two known points, as the backdrop scale
gesture already does), never a toggle."* This document is that operation. The two-known-points
gesture is still available in the math (`lpnGeorefFromTwoPoints`) and is deliberately not the
interface — see §3.

Code: `js/lpn-georef.js` (pure math), the `georef*` section of `js/looped-network.js` (the tool),
`#lpn_georef_bar` in `Looped-Network.php`. Harnesses: `dev/lpn-spike/georef-harness.js` (arithmetic),
`dev/lpn-spike/georef-place-harness.js` (the flow).

---

## 1. The two words

| | |
|---|---|
| internally | `project.coords` is `'geo'`, or **absent**, which is the XY grid |
| user-facing | **XY** and **lat/lon** |

Tom offered four candidate pairs on 2026-08-18 and marked one "(user-facing)": **lat/lon vs XY**.
That is what the menus say. Of Flat Earth / Round Earth he said *"I really like this because it's
both fun and deeply meaningful and instructive"* — and it is exactly the distinction the trade draws
between a plane survey and a geodetic one. It goes in the **tips and the synonyms**, not on a control,
because the menu is staid and professional.

*(An earlier pass here argued for "world map / XY grid" on the grounds that `lpn_new_geo_us` had
already shipped "world map" in 27 languages, and dressed that up as a worry that Flat Earth would be
misread. Tom: "The joke is thousands of years old. Who hasn't heard of it?" He was right, the
argument was invented, and the four affected keys were re-worded instead.)*

### `$ec_lang_syn` — the diff, awaiting Tom's approval

```php
$ec_lang_syn['lpn_geomap']='Round Earth. A map of the real world, where a point is a longitude and a latitude on the globe (geographic, geo-referenced, world map, street map, lat/lon, WGS84, geodetic survey).';
$ec_lang_syn['lpn_xymap']='Flat Earth. A plain drawing grid, where a point is an X and a Y with no place on the globe (grid, local coordinates, site grid, schematic, plane survey, Cartesian).';
```

Both are longer than a label, so they pass the substitution test only loosely; the parenthesised
lists alone would also do. AI must not write these without written permission in the conversation.

## 2. What the tool does, in order

1. **File > Convert to lat/lon…**, beside Import EPANET file, because both are conversions. A
   confirm states what will and will not change. **Disabled, never hidden,** on a project already on
   the map — it was hidden once and Tom could not find the command at all.
2. **Step 1, detached.** The project becomes geographic, OSM tiles come on, **the view goes to the
   whole Earth**, and the model itself is drawn, centred, at 40% of the canvas. It then stays exactly
   where it is ON THE SCREEN: the user pans and zooms the map underneath it, and nothing they do to
   the map moves the model. **No handles in this step** — there is no gesture that could move it.
   Zooming the map in shrinks the ground under the model, which is how its SCALE is found.
   **Go to…** takes a pasted `lat, lon` and then asks roughly how wide the site is; that one answer
   sets the scale outright.
3. **Drop it here.** Step 2, attached: the model is on the ground, travels with the map, and grows
   corner handles, a body and a rotate handle. **Pick it up again** returns to step 1.
4. **Adjust.** Drag the body to move (by the pointer's own delta from wherever it was grabbed), a
   corner to resize about the opposite corner, the round handle to turn. Or type the two numbers —
   "one drawing unit is ___ ft" and "turn ___ degrees counter-clockwise" — which act about the
   model's centre.
5. **Finish** (confirmed) or **Cancel** (exact).

Labels and the solver are **off** for the whole of it, and come back on Finish or Cancel.

## 3. The decisions with a rejected alternative

- **The image-placement paradigm, not four menu commands.** Tom offered both and preferred this one.
  Insert/Move/Scale/Rotate as menu commands asks the user to name the operation before performing it,
  which is the hurdle he flagged in his own description of it.
- **THE SCALE IS ASKED FOR, NOT READ.** Tom, 2026-08-18: *"Your grid does not already say how big one
  drawing unit is; these EPANET examples and many old systems are drawn on arbitrary 'schematic'
  canvases. We must find both location and scale."* The build before this one read `lengthField()`
  and asserted that one drawing unit was one Length/Map unit; on a schematic that lands a whole
  system inside a few metres of pavement. Three ways in, all the user's: the zoom of the map behind a
  detached model, Go to…'s width question (default 3000 ft / 1000 m), and the scale box in step 2.
- **The two steps are NAMED and switchable.** *"there is an uncomfortable gray area between the
  described modes… I need the map either to come along or to stay behind when I pan. And I need to be
  able to control that."* The bar says "Step 1 of 2 — detached" / "Step 2 of 2 — attached" and
  carries the button that swaps them.
- **Detached costs one attribute per frame.** The drawing has its own group (`modelLayer`), so
  holding it still while the view moves is the inverse of the view's own change — no coordinates
  re-derived, no DOM rebuilt, no labels laid out. The document is re-derived from `georef.src` ONCE,
  when the gesture settles (180 ms), which is also the only moment the tangent plane picks up a new
  latitude.
- **Handles are CLAMPED into the visible canvas, and a gesture is measured from the POINTER.**
  *"When I zoom in close to check a spot on the model, I lose the rectangular controls off the edge
  of the map… I am locked out."* Clamping was chosen over an all-numeric transform panel because it
  keeps the one gesture the paradigm is made of; the numbers stay as the second way in. The clamp
  respects the window, the placement bar and the coordinate readout, because a handle underneath a
  piece of furniture is just as unreachable. It works only because a corner drag measures its scale
  from where the pointer started rather than from the corner it belongs to — which is the same fix as
  *"When I click the project to move it, it jumps (to bring its center to my mouse?)"*.
- **Two control points is the math, not the interface.** `lpnGeorefFromTwoPoints` is exported and
  tested, and picking two survey points off a basemap is the *accurate* way to georeference. It is not
  the first-run interface because it requires the user to already know two positions on their own
  drawing. It is the natural home for a later "I have coordinates for these two hydrants".
- **Editing is locked while placing.** `georefActive()` gates the same seams `regMode` does. The
  transform re-derives every point from a held-aside source array by INDEX, so an element added
  mid-placement would shift every index after it. Panning still works, because looking at where you
  are putting the model is the whole activity.

## 4. The properties the harnesses pin

`dev/lpn-spike/georef-place-harness.js` (arithmetic through the page) and
`dev/browser-pass/specs/place.js` (the gestures, in a real browser).

- **Cancel is exact, `===`, after two steps and a hundred adjustments.** Every preview re-derives from
  the source, so nothing compounds. Same standard as an imported file's numbers, for the same reason.
- **Nothing but the coordinates moves.** Lengths, diameters, elevations, demands and the `lenAuto`
  flag are byte-identical across a placement. A pipe's `len` is stored and never derived, so resizing
  the picture cannot redesign the network.
- **The model does not move on the screen in step 1** — not by a pixel of its centre, not by a pixel
  of its height — while the map pans and zooms under it. Its width follows the map's own east-west
  stretch when the placement travels in latitude, and by exactly that ratio: see §5.
- **The width the user gives Go to… is the width the model has on the ground**, measured with the
  real geodesic rather than with the transform's own arithmetic.
- **Up the drawing is north.** The document stores y DOWN; `js/lpn-georef.js` is written for the
  outward Y-UP frame. A symmetric test network would never reveal a missing flip, so the harness uses
  an L-shaped one.
- **A project already on the map is refused, not re-placed.**

## 5. Known limits

- **The tangent plane is frozen at the anchor's latitude**, so the scale error grows with distance
  from it: 0.015% over 5 km at latitude 38, 0.034% at latitude 60, ten times that over 50 km. The
  anchor is the model's own centre, which halves the worst case for free. Numbers and their latitude
  dependence are measured in `dev/lpn-spike/georef-harness.js`.
- **A background image is not carried.** `backdrop.tx/ty` is in the grid's frame and is left alone;
  a site plan behind a now-geographic model will be in the wrong place. `eachStoredPoint()` does visit
  the backdrop for `doc`-shaped objects, but the tool captures from the live `doc`, whose backdrop
  lives in a module variable outside it. Worth a task when somebody actually has both.
- **There is no place-name search** — Task 437. It needs a geocoder, which is a SECOND third-party
  host on a page whose privacy claim is that the tile server is the only one. Tom's call.
- **Finish is not undoable.** Cancel is the way back during placement; after Finish the route back is
  closing the project without saving. The confirm says so.
- **The display is CONFORMAL since Task 145's projection seam shipped** — the drawing frame is Web
  Mercator, so a square on the ground is drawn square and the east-west stretch this list used to
  name (27% at 38°) is gone. That also retired the limit beside it: a detached model no longer
  changes WIDTH as the placement travels in latitude, because Mercator holds a shape's aspect. It
  changes SIZE with latitude instead, which is Mercator's own scale factor and is what the basemap
  under it does too. `dev/geographic-projects.md` §6.
- **The tangent plane is still isotropic and `js/lpn-georef.js` still refuses an anisotropic
  transform.** That is unrelated and unchanged: the transform maps a drawing onto the GROUND in
  metres, and the projection maps the ground onto a SCREEN. Do not let the second talk the first
  into a per-axis scale.
- **The conversion mutates the OPEN project.** Cancel is the only way back during placement, and
  after Finish the route back is closing without saving — which puts the user's own XY file one
  Save away from being overwritten by a lat/lon one. Tom asked on 2026-08-18 whether the conversion
  should instead import into a NEW lat/lon project; the recommendation is yes, and it is his call
  and not a change this tool has made. An `.inp` import already lands in a new tab, so the shape
  exists (`importProject()`), and `saveProjectAs()` already duplicates a whole project.
