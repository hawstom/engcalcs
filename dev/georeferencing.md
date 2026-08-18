# Putting an XY-grid project on the world map (ROADMAP Task 145)

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
| user-facing | **world map** and **XY grid** |

Tom, 2026-08-18, offered four candidate pairs and said of one: *"Flat Earth vs Round Earth (I really
like this because it's both fun and deeply meaningful and instructive)."*

**"World map" wins because it is already shipped.** `lpn_new_geo_us` has read "Blank project on a
world map" in 27 languages since Task 145 slice 1. Introducing `GeoMap` now would give one concept
two names on one page, and would cost 26 retranslations to say what is already said.

**Flat Earth / Round Earth is the right instruction and the wrong label.** A control's label has to
survive a reader who has never met the joke, and in several of our languages "flat earth" carries the
conspiracy sense with no engineering sense beside it. It is genuinely the trade's own distinction
though — plane surveying versus geodetic surveying — so it belongs where it teaches: in the synonym
channel, and in the tool's own explanation.

### Proposed `$ec_lang_syn` diff — AWAITING TOM'S APPROVAL, NOT WRITTEN

`$ec_lang_syn` is off-limits to AI without written permission in the conversation, and "these could
all be memorialized as synonyms" is a suggestion, not that permission. So the diff sits here:

```php
$ec_lang_syn['lpn_geomap']='Round Earth. A map of the real world, where a point is a longitude and a latitude on the globe (geographic, geo-referenced, world map, street map, lat/lon, WGS84, geodetic).';
$ec_lang_syn['lpn_xymap']='Flat Earth. A plain drawing grid, where a point is an X and a Y with no place on the globe (grid, local coordinates, site grid, schematic, plane survey, Cartesian, X-Y).';
```

Both pass the substitution test only loosely — they are longer than a label — so if Tom wants them
they may want trimming to the parenthesised lists alone.

## 2. What the tool does, in order

1. **File > Put this project on the world map…** A confirm states what will and will not change.
   Hidden on a project already on the map.
2. **Carry.** The project becomes geographic, OSM tiles come on, the view goes to the geographic home
   view, and the model is drawn as a dashed ghost box **pinned to the middle of the map at its true
   ground size**. The user pans and zooms the world map; the box rides along. Nothing is saved.
3. **Drop it here.** The box's position becomes the transform, every coordinate becomes a longitude
   and a latitude, and the real network is drawn with corner handles, a body, and a rotate handle
   above it.
4. **Adjust.** Drag the body to move, a corner to resize about the opposite corner, the round handle
   to turn. Or type the two numbers — "one drawing unit is ___ ft" and "turn ___ degrees
   counter-clockwise" — which act about the model's centre.
5. **Finish** (confirmed) or **Cancel** (exact).

## 3. The four decisions with a rejected alternative

- **The image-placement paradigm, not four menu commands.** Tom offered both and preferred this one.
  Insert/Move/Scale/Rotate as menu commands asks the user to name the operation before performing it,
  which is the hurdle he flagged in his own description of it.
- **The scale is READ, not asked for.** A grid project already declares that one drawing unit is one
  Length/Map unit (`lengthField()`, `dev/geographic-projects.md` §1), so the model lands at its true
  ground size on the first frame — measured at 1000.015 ft for a declared 1000 ft. Tom's sketch asked
  the user for a scale and to be reassured that approximate was fine; there was nothing to
  approximate. The box remains, as an override for a drawing that was never at 1:1.
- **Two control points is the math, not the interface.** `lpnGeorefFromTwoPoints` is exported and
  tested, and picking two survey points off a basemap is the *accurate* way to georeference. It is not
  the first-run interface because it requires the user to already know two positions on their own
  drawing; dropping the whole model and nudging it is the gesture that needs nothing. The two-point
  path is the natural home for a later "I have coordinates for these two hydrants".
- **Editing is locked while placing.** `georefActive()` gates the same seams `regMode` does. The
  transform re-derives every point from a held-aside source array by INDEX, so an element added
  mid-placement would shift every index after it. Panning still works, because looking at where you
  are putting the model is the whole activity.

## 4. The properties the harness pins

- **Cancel is exact, `===`, after a hundred adjustments.** Every preview re-derives from the source,
  so nothing compounds. Same standard as an imported file's numbers, for the same reason.
- **Nothing but the coordinates moves.** Lengths, diameters, elevations, demands and the `lenAuto`
  flag are byte-identical across a placement. A pipe's `len` is stored and never derived, so resizing
  the picture cannot redesign the network.
- **Up the drawing is north.** The document stores y DOWN; `js/lpn-georef.js` is written for the
  outward Y-UP frame. A symmetric test network would never reveal a missing flip, so the harness uses
  an L-shaped one.
- **A grid project already on the map is refused, not re-placed.**

## 5. Known limits

- **The tangent plane is frozen at the anchor's latitude**, so the scale error grows with distance
  from it: 0.015% over 5 km at latitude 38, 0.034% at latitude 60, ten times that over 50 km. The
  anchor is the model's own centre, which halves the worst case for free. Numbers and their latitude
  dependence are measured in `dev/lpn-spike/georef-harness.js`.
- **A background image is not carried.** `backdrop.tx/ty` is in the grid's frame and is left alone;
  a site plan behind a now-geographic model will be in the wrong place. `eachStoredPoint()` does visit
  the backdrop for `doc`-shaped objects, but the tool captures from the live `doc`, whose backdrop
  lives in a module variable outside it. Worth a task when somebody actually has both.
- **Finish is not undoable.** Cancel is the way back during placement; after Finish the route back is
  closing the project without saving. The confirm says so.
- **The display is still unprojected**, stretched east-west by 1/cos(latitude) — 27% at 38°. The
  tiles share the stretch, so the map and the pipes agree. That is Task 145's remaining
  projection-seam work and is unchanged by this tool.
