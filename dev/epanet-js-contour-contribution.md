# Contour plots, and whether we contribute them to epanet-js

**Written 2026-09-07**, answering Tom's ask of the same day: *"Contours: I knew EPANET had them. I
drew some on Net3 in it today. You answered whether epanet-js offers them to us. Maybe we can
contribute to epanet-js. Contours don't seem all that hard to me, and I bet that we could contribute.
Maybe you could look into that and how to approach them."*

Scope: four questions and nothing else — can we contribute mechanically, how would a contour actually
be computed, what would the contribution be, and should we. `dev/positioning.md` governs everything
said here about epanet-js. The feature background is not re-derived: it is in
`dev/agents/utility-planning-engineer/journal.md` (2026-09-06 entries) and ROADMAP Task 600.

**Everything below carries a URL or is marked unverified.** All GitHub API figures were fetched on
2026-09-07 and will drift.

---

## 1. Can we contribute, mechanically?

### The short answer

Yes, mechanically — the repository is public, issues are open, `CONTRIBUTING.md` says outside
contributions are welcome, and three outside pull requests have been merged. **The licence is the
catch, not the process:** the code is FSL-1.1-MIT, not FLOSS, and contributing means assigning
rights to a company.

### Where the source lives

- **`https://github.com/epanet-js/epanet-js`** — the web application. Public, not a fork, not
  archived. Created 2024-10-16; last push 2026-09-04; 225 stars, 48 forks. Default branch `main`.
  100 commits in the five weeks before this was written, so it is actively developed.
- **`https://github.com/epanet-js/epanet-js-toolkit`** — a different thing, and the one we vendor.
  MIT. `js/vendor/README.md` is this repository's authority on that split; it is not restated here.
- A **name collision** exists with `https://github.com/cdzuwa/epanet-js` and
  `https://github.com/sdteffen/epanet.js`, which are unrelated. Check the org before citing a URL.

### Licence

`https://github.com/epanet-js/epanet-js/blob/main/LICENSE`, quoted verbatim:

> This repository contains code under two different licenses:
> 1. **Placemark clone (MIT License)**: All code from the first commit
>    (`0fa095f5c60ba944fa4e25b8a7e749e52c2beefb`) is licensed under the MIT License.
> 2. **Modifications and Future Contributions (FSL-1.1-MIT)**: Any changes or contributions made
>    after the first commit ... onwards are licensed under the FSL-1.1-MIT License.

The FSL notice reads `Copyright 2025 ITERATING INC.` GitHub's own API reports the licence as
`NOASSERTION` (`spdx_id: NOASSERTION`), which is what a dual, non-SPDX-standard LICENSE file looks
like to a machine. **Anything we contributed would be FSL-1.1-MIT**, converting to MIT two years
after the release that carries it — a per-version clock, not a project-wide one.

### Does it accept outside pull requests?

Yes, and the evidence is thin but real. Every pull request the repository has ever had, from the
API:

| # | Author | Title | Merged |
|---|---|---|---|
| 17 | NilsJacobsen | Legit branch support (2026-01-19) | no |
| 16 | NilsJacobsen | Legit branch support (2026-01-19) | no |
| 10 | marcoscalatayud | Increase junctions contrast relative to the map (2025-07-14) | **yes** |
| 8 | marcoscalatayud | Update Spanish i18n file (2025-07-11) | **yes** |
| 6 | leroykorterink | Support Dutch (nl-NL) translations (2025-07-08) | **yes** |

Five pull requests in the repository's whole life, three merged. **All three merged ones are
translations or a colour tweak** — there is no precedent for an outside contribution that adds a
feature. That is a fact about sample size, not a refusal.

### `CONTRIBUTING.md` — and its date matters

`https://github.com/epanet-js/epanet-js/blob/main/CONTRIBUTING.md` was **created on 2026-09-04**,
three days before Tom asked this question (commit by `iteratingDesign`, "Create CONTRIBUTING.md").
The door was opened immediately before we knocked. Operative text, verbatim:

> Thanks for your interest in improving epanet-js. We're a small team building this in the open, and
> we welcome outside contributions — whether that's a bug report, a fix, or a suggestion.

> **Open an issue first.** Before writing code, open an issue to describe the problem or change you
> have in mind. This gives us a chance to discuss whether it fits the direction of the project and
> avoids wasted effort on both sides.

> Once aligned, open a pull request referencing the issue. We review all contributions, but accepted
> PRs are closed here and handled manually by the Iterating team in our development repository.

> **License**: epanet-js is under the Functional Source License (FSL-1.1-MIT). It's not a standard
> open source license — commercial and competing uses are restricted. Make sure you've read it before
> contributing, especially if you're doing so on behalf of a company.

> You'll need a GitHub account with two-factor authentication enabled.

**The public repository is a mirror.** "Accepted PRs are closed here and handled manually by the
Iterating team in our development repository" means our patch would be re-applied by them rather
than merged; there would be no public review thread and no commit with our name on it in the branch
that ships. Budget for that, and do not read a closed PR as a rejection.

### CLA / DCO

There is **no DCO** and **no CLA process yet**, and the file says so, verbatim:

> ## Contributor License Agreement
> We plan to introduce a formal CLA process. Until then, by submitting a pull request you confirm
> that you have the right to contribute the code, that it may be distributed under the project's
> FSL-1.1-MIT license, and that **you assign the relevant rights to Iterating**. We'll ask you to
> sign a CLA before merging once that process is in place.

**That sentence is the whole decision in §4.** It is an unwritten CLA, agreed by the act of opening
a pull request, assigning rights to a private company whose licence forbids competing use. Read it
before writing code, not after.

### Code of conduct, templates, security

- **No `CODE_OF_CONDUCT.md`**, and no `.github/` directory at all (the API returns 404 for
  `contents/.github`). Root tree is `.gitignore`, `.npmrc`,
  `CONTRIBUTING.md`, `LICENSE`, `README.md`, `SECURITY.md`, `package.json`, `pnpm-workspace.yaml`,
  `apps/`, `libs/`.
- **No issue or PR templates**, for the same reason.
- `SECURITY.md` exists and routes vulnerabilities through GitHub Security Advisories.

### Language and build stack

From `package.json`, `pnpm-workspace.yaml` and the API's language breakdown:

- **TypeScript**, 7.70 MB of it against 40 KB of JavaScript and 26 KB of CSS.
- **pnpm 9.15.9 workspace monorepo driven by Turborepo 2.x**; Node 20.x or 21.x.
- `apps/app` is a **Next.js 14** application; `libs/` holds 18 workspace packages, including
  `hydraulic-model`, `simulation`, `map`, `symbology` (inside `map`), `quantity`, `projections`,
  `elevations`, `gis-importers` and `i18n`.
- Tests are **vitest**; lint is eslint + prettier; there are pre-commit hooks.
- Auth is Clerk, errors go to Sentry, storage is Google Cloud Storage — so it is not a static app.

### How map rendering is structured — **correct the assumption**

**It is not MapLibre.** `libs/map/package.json` declares `mapbox-gl` `^3.4.0` as a peer dependency,
and `libs/map/src/map-engine.ts` opens with `import mapboxgl, { Style } from "mapbox-gl";`. Mapbox
GL JS v2 and later ship under Mapbox's own terms, not an open-source licence — a fact about their
stack, and one worth knowing before assuming a patch is portable anywhere.

On top of that:

- **deck.gl 9.1** (`@deck.gl/core`, `@deck.gl/layers`, `@deck.gl/extensions`, `@deck.gl/mapbox`),
  attached as a `MapboxOverlay`. The network itself is drawn by deck.gl layers, not by Mapbox style
  layers.
- **chroma-js 3.1** for colour ramps, in `libs/map`.
- The app already depends on **19 `@turf/*` packages** (mixed 6.5.0 and 7.x — `area`, `bbox`,
  `buffer`, `boolean-point-in-polygon`, `tesselate`, `line-split`, and more), on
  `@placemarkio/turf-jsts`, and on `d3-array`, `d3-color`, `d3-geo`. **This matters in §2**: the
  entire contour pipeline exists inside dependency families they already carry.

### Is there an existing contour issue?

**On GitHub, no.** The repository has had **15 issues in its whole life and all 15 are closed**;
`open_issues_count` is 0. There is nothing about contours among them. So a GitHub issue would be
opened cold — which is exactly what `CONTRIBUTING.md` asks for.

**On their public roadmap, yes**, and it is theirs, not ours to propose:

- **`https://roadmap.epanetjs.com/results-visualization/p/contour-map-generation`** — a Canny board
  (`roadmap.epanetjs.com`, "Powered by Canny"), posted by the **epanet-js team on 2025-09-29**,
  **3 votes**, **no comments**, and no status label (it is not in Planned, In Progress or Complete).
  Full text, verbatim:

  > To provide a system-wide view of simulation results, the application will be able to generate
  > contour maps (isopleths) for any nodal output variable. This is most commonly used to create
  > pressure contours, which help to visualize pressure gradients and identify high or low-pressure
  > zones across the entire service area.

  **It says nothing about how.** No interpolation rule, no boundary, no disclosure — which is the
  gap §2 is about, and the reason a contribution here can be a design one.

Five other items sit on the same board, including `system-flow-balance-chart` and
`pump-system-curve-plotting` — the same list Tom read off EPANET's own plot menu.

---

## 2. How would contours actually be computed?

A water network is a **graph of point values, not a field**. Every contour invents values between
nodes. So the question is not "which algorithm" but "which invention, and how honestly is it
labelled".

### First, what EPANET actually does — read from its own source, not its manual

The planning engineer's journal establishes that EPANET's manual documents the feature and **never
states the interpolation rule**. It does not have to: the rule is in the GUI's Delphi source, which
EPA publishes.

**`https://github.com/USEPA/EPANET2.2/blob/master/Delphi_GUI/epanet2w/Fcontour.pas`** (unit
`Fcontour.pas`, version 2.2, dated 6/24/19, author L. Rossman). Verbatim from the source:

> `procedure GridData(...)`
> `//---------------------------------------------------`
> `// Applies inverse distance weighting to interpolate`
> `// z-values on a uniform x-y grid.`
> `//---------------------------------------------------`

And its constants, verbatim:

> `DEFNdx = 20;      {# x-grid divisions}`
> `DEFNdy = 20;      {# y-grid divisions}`
> `DEFNnear = 6;     {# nearest nodes for gridding}`
> `MAXPTS = 200;     {Max. nodes used for gridding}`
> `MAXGRID = 50;     {Max. # of grid divisions}`
> `MSG_TOO_FEW_NODES = 'Too few nodes to contour.';`

So, stated plainly, and every clause is from the code:

1. **The method is IDW with power 2 over the 6 nearest nodes.** The inner loop computes
   `t := 1.0/NearestDist[m]; t := t*t;` and accumulates `s1/s2` — inverse squared distance, six
   neighbours, renormalised. If a grid point coincides with a node it takes that node's value
   exactly.
2. **The grid is a fixed 20 × 20**, spanning `Cmap.Dimensions` — the whole map rectangle, not the
   nodes' extent. `Ndx`, `Ndy` and `Nnear` are set once in `FormCreate` from the `DEF*` constants
   and the Contour Options dialog does not change them; it sets colours and levels.
3. **It extrapolates everywhere.** `DrawContours` clears the entire map rectangle and then fills
   every one of the 19 × 19 grid cells, split into two triangles each, with `FillTriangle` slicing
   each triangle by contour level. There is no hull, no mask, and no "no data" state. A contour
   drawn over a river, a mountain or an undeveloped parcel is drawn with the same confidence as one
   drawn between two adjacent junctions.
4. **It silently throws away most of a large network.** `LoadData` samples **at most 200 junctions**
   by stride: `m := (nj div MAXPTS) + 1;` then `Inc(i,m)` — every *m*-th junction in list order,
   which is insertion order and has nothing to do with geography. On a 2,000-junction model, EPANET
   contours from roughly 200 of them and never says so.
5. **Under 7 junctions it refuses:** `if nj <= Nnear then Exit;`, and the form shows
   `'Too few nodes to contour.'`

**That finding is itself worth contributing**, and it costs nothing to give away: epanet-js's
roadmap item does not say what rule to use, and the reference implementation's rule is sitting in a
public Delphi file that nobody has quoted at them. Anyone building this feature in any tool needs it.

### The interpolation, option by option

| Method | What it does | Cost | Failure mode on sparse irregular nodes |
|---|---|---|---|
| **IDW, power p, k nearest** | Weighted average of the k nearest values, weight `1/dᵖ` | `O(G·N)` naive; `O(N·c)` if scattered | **Bull's-eyes**, and it is named in the guidance as the wrong choice for smooth potential fields |
| **Linear over a Delaunay triangulation (TIN)** | Plane through the three vertices of the containing triangle | `O(N log N)` build, `O(1)`-ish per query | Faceted, C⁰ only; sliver triangles at the hull; **undefined outside the hull, which is a feature** |
| **Natural neighbour** | Voronoi area-stealing (Sibson) | `O(N log N)` build plus a local insert per query | Poor just inside the edges; also cannot extrapolate past the hull |
| **Thin-plate spline** | Minimum-curvature surface through all points | Dense solve, ~`O(N³)`, `O(N²)` memory | Overshoot; SciPy calls > 1,000 points impractical |
| **Ordinary kriging** | Weighted average with weights from a fitted variogram | Dense solve | **The variogram cannot be fitted from few points** |

Sources for each row, all fetched 2026-09-07:

- **IDW.** Esri: *"This method assumes that the variable being mapped decreases in influence with
  distance from its sampled location."*
  (`https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-analyst/how-idw-works.html`)
  De Smith, Goodchild and Longley, *Geospatial Analysis*: IDW *"Tends to generate bull's eye
  patterns. Simple and effective with dense data. No extrapolation. All interpolated values between
  data points lie within the range of the data point values"*
  (`https://www.spatialanalysisonline.com/HTML/gridding_and_interpolation_met.htm`).
- **Natural neighbour.** Esri: it *"finds the closest subset of input samples to a query point and
  applies weights to them based on proportionate areas"*; *"Interpolated heights are guaranteed to be
  within the range of the samples used"*; and it *"adapts locally to the structure of the input data,
  requiring no input from the user pertaining to search radius, sample count, or shape"*
  (`https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-analyst/how-natural-neighbor-works.html`).
- **TIN.** QGIS: *"With the TIN method you can create a surface formed by triangles of nearest
  neighbor points… The resulting surfaces are not smooth."*
  (`https://docs.qgis.org/latest/en/docs/user_manual/processing_algs/qgis/interpolation.html`)
- **Thin-plate spline.** SciPy, on the cost: *"The memory required to solve for the RBF interpolation
  coefficients increases quadratically with the number of data points, which can become impractical
  when interpolating more than about a thousand data points."*
  (`https://docs.scipy.org/doc/scipy/reference/generated/scipy.interpolate.RBFInterpolator.html`)
- **Kriging.** PNNL/EPA's Visual Sample Plan on the minimum data: *"At least 30-50 data points are
  recommended, and some authors have suggested that the minimum number of data needed is as much as
  100"* (`https://vsp.pnnl.gov/help/vsample/Kriging_Data.htm`). The often-quoted `O(n³)` could not be
  confirmed from a primary source and is marked unverified in the appendix.

### The finding that changes the recommendation

**ITRC — the Interstate Technology and Regulatory Council, in *Geospatial Analysis for Optimization
at Environmental Sites* — names our exact case as IDW's failure case**, verbatim:

> *"IDW does not produce good results when used to contour smaller data sets, especially those
> representing smoothly transitioning properties such as **groundwater elevations**."*

> *"IDW often produces contours with bull's-eyes representing mounds or depressions in the surface
> that have no conceptual explanation. This result is due to a scarcity of samples around a data
> point that differs appreciably from neighboring samples."*

> *"IDW is best suited as an interpolation method for **large data sets collected at a high (spatial)
> density**."*

— `https://gro-1.itrcweb.org/simple-geospatial-methods/`

A hydraulic grade line at sparse junctions is the same object as a groundwater elevation surface:
a smoothly transitioning potential field sampled at scattered points. **EPANET's IDW is the method
this guidance names as unsuitable, at the density this guidance names as unsuitable.** And Esri's own
Spline page names the same phenomenon on the other side: *"This method is best for generating gently
varying surfaces such as elevation, **water table heights**, or pollution concentrations."*
(`https://doc.esri.com/en/arcgis-pro/latest/tool-reference/spatial-analyst/how-spline-works.html`)

**USGS, publishing a potentiometric surface in 2025, uses neither IDW nor kriging and then edits the
result by hand.** New Jersey Coastal Plain confined aquifers, SIR 2025-5080
(`https://pubs.usgs.gov/publication/sir20255080/full`):

> *"The ArcGIS Pro geoprocessing tool 'Topo to Raster' was used to create a series of raster
> surfaces… **Contours were then manually readjusted within ArcGIS Pro to ensure they represented
> hydrologically realistic surfaces for confined aquifers**, because this interpolation method
> affects the reliability of individual isolines and their portrayal of slope, peaks, and
> depressions, especially for groundwater applications."*

**No automated method was trusted to ship unedited.** That is the strongest single argument in this
document for the disclosure rule below: the profession's own published practice treats an
interpolated contour as a draft.

**Revised recommendation: contour the triangulation directly, not a grid.** Linear interpolation over
the Delaunay triangulation of the nodes, with the convex hull as the boundary *by construction*.
Reasons, in order:

1. **It never invents a value.** A TIN value is a weighted blend of exactly the three enclosing
   measured values, so no bull's-eye, no overshoot, and nothing outside the data range. IDW's
   bull's-eyes at sparse density are the documented artefact above; TIN's facets are an *honest*
   artefact — they show the reader where the triangles are, which is where the data is.
2. **The honest boundary is free rather than bolted on.** De Smith et al.: *"Two of the interpolation
   methods (natural neighbor and triangulation plus linear interpolation) limit their extent to the
   convex hull of the input point set"*, and *"many GIS packages take one or other of these
   boundaries as the limit for procedures such as interpolation, generation of contour lines or the
   creation of triangulated irregular networks"*
   (`https://www.spatialanalysisonline.com/HTML/boundaries_and_zone_membership.htm`). The boundary
   §2's honesty section argues for is what the method already does.
3. **It deletes the entire performance problem** — no grid, so no resolution decision, no `O(G·N)`
   loop, and no coordinate transform (see Performance below).
4. **A maintained JS library already does it** (see below), so the patch is small.

**Keep IDW(2, 6-nearest) as a named compatibility mode**, not as the default. It has one real virtue
and it is not accuracy: it reproduces EPANET's picture, so a user drawing the same contour in both
tools can see they agree. That is worth an option and a sentence. It is not worth being the default,
given what the guidance above says about it.

**And one engineering point worth raising with them, marked as a hypothesis:** pressure is
`HGL − ground elevation`. HGL is the smooth field; ground is rough. **Contouring pressure directly
interpolates a field that is not smooth**, while contouring HGL and subtracting a DEM per cell
interpolates the field that actually is. The trade press states the underlying distinction
(`https://ecologixsystems.com/articles/hydraulic-grade-line-energy-grade-line-water-distribution`),
but **no authoritative source recommending an HGL-first contouring workflow was found**. Treat it as
a spike, not a citation — and note that `lpn_` already has a Mapbox Terrain-RGB elevation path
(`js/lpn-terrain.js`), so we are unusually well placed to test it.

### The extraction

| Package | Licence | Weekly downloads | Latest | Unpacked | Input | Output |
|---|---|---:|---|---:|---|---|
| **`d3-tricontour`** | **ISC** | **482,599** | 1.1.0, 2025-10-05 | **28,414 B** | **scattered `[x, y, z]`** | GeoJSON MultiPolygon, `.isobands()` built in |
| `d3-geo-voronoi` (`geoContour`) | ISC | 385,668 | 2.1.0, 2024-05-17 | 61,178 B | scattered `[lon, lat, z]` on the sphere | GeoJSON MultiPolygon, `.isobands()` |
| `d3-contour` | ISC | 18,165,546 | 4.0.2, 2023-01-11 | 49,313 B | **regular grid** | MultiPolygon **in grid-index coordinates** |
| `@turf/isobands` | MIT | 988,002 | 7.4.0, 2026-08-03 | 131,226 B | gridded point FeatureCollection | MultiPolygon, real coordinates |
| `@turf/isolines` | MIT | 1,280,709 | 7.4.0, 2026-08-03 | 84,219 B | gridded point FeatureCollection | MultiLineString |
| `delaunator` | ISC | — | 5.1.0, 2026-03-23 | — | flat coordinate array | triangle indices only, **no contouring** |
| `marchingsquares` | **AGPL-3.0** | 152,560 | 1.3.3, **2019-04-28** | 1,765,497 B | raster | raw arrays |
| `conrec` | **none declared** | **8** | 1.0.2, 2026-03-06 | 21,313 B | 2D array | own structures, lines only |

npm figures re-verified against `registry.npmjs.org` and `api.npmjs.org` on 2026-09-07, download
window 2026-08-31 to 2026-09-06.

**`d3-tricontour` is the JS `tricontourf`**, and it is the piece that makes this whole feature small.
Its own words (`https://github.com/Fil/d3-tricontour`):

> *"This library computes contour polygons by applying **meandering triangles** to an array of points
> with **arbitrary 2D coordinates** (x, y) holding numeric values z. To compute contours on gridded
> coordinates, see d3-contour instead."*

> *"The contours are **MultiPolygons in GeoJSON format**… The value is indicated as geometry.value."*

> *"tricontour.isobands(data) — Returns an iterable over the isobands: contours between pairs of
> consecutive threshold values v0 (inclusive) and v1 (exclusive)."*

Meandering triangles is the triangular-mesh analogue of marching squares — the algorithm matplotlib's
`tricontourf` uses. ISC, 28 KB unpacked, ~483 k weekly downloads, repository last pushed 2026-09-03,
zero open issues. **It is smaller than any grid-based option and it removes four steps.**
`d3-geo-voronoi`'s `geoContour` does the same on the sphere in `[lon, lat, value]` — this repository's
own system order — but triangulates on the sphere rather than in a Mercator frame, and **its accuracy
at sub-degree extents is undocumented**; a spike, not a default.

**Licence traps, both confirmed:**

- **`marchingsquares` is AGPL-3.0** with a narrow carve-out: third parties may link *unmodified*
  versions without becoming subject to the AGPL, but *"Any modifications to MarchingSquaresJS,
  however, must be shared with the public"*
  (`https://raw.githubusercontent.com/RaumZeit/MarchingSquares.js/master/LICENSE.md`). Compatible in
  direction for GPL `lpn_`; **unusable in an FSL-1.1-MIT codebase**, and last published 2019.
- **`conrec` declares no licence at all** — no `license` field on npm, `license: null` from the
  GitHub API, `LICENSE` 404s; only a BSD-3 header comment inside `conrec.js`. Eight weekly downloads.
- `marching-squares` (the TS rewrite) has **contradictory licence metadata** — npm says AGPL-3.0, the
  repository's LICENSE file is MIT, `package.json` declares nothing. Unresolved; do not adopt.

**If a grid route is taken anyway**, the turf pipeline is the natural one for epanet-js because they
already carry 19 `@turf/*` packages: `@turf/point-grid` → `@turf/interpolate` → `@turf/isobands`.
**Two caveats, verified by reading `turf-interpolate/index.ts` on `Turfjs/turf` master:** it uses
**all N points, not k nearest** — a naive `O(G·N)` double loop — and its default `weight` is **1, not
2**, so it does not reproduce EPANET's rule out of the box; and it calls `@turf/distance` (haversine)
per pair, which is needless expense in an already-planar drawing frame. Both are arguments for
`d3-tricontour` instead.

### Rendering in their stack

deck.gl's **`ContourLayer`** (`@deck.gl/aggregation-layers`) looks like the free answer and **is the
wrong tool**. Its own documentation
(`https://deck.gl/docs/api-reference/aggregation-layers/contour-layer`) says it "aggregates data into
iso-lines or iso-bands for a given threshold and cell size", binning points into `cellSize` cells and
combining them with `SUM`, `MEAN`, `MIN`, `MAX` or `COUNT`. **That is aggregation, not
interpolation.** A cell with no junction in it gets no value, so on a sparse network — which is every
water network — it draws a blocky mosaic of occupied cells surrounded by nothing. It is built for
dense point clouds. Say so early in any conversation with them, because it is the first thing anyone
will suggest. `@deck.gl/aggregation-layers` is **not currently a dependency**, so nothing is lost.

The correct route is to compute GeoJSON and hand it to a **`GeoJsonLayer`** (deck.gl, which already
draws their network) or to a Mapbox `fill` layer with a `["step", ["get", "pressure"], …]`
data-driven colour expression.

**Two gotchas from the GL style spec** — read from MapLibre's machine-readable reference
(`https://raw.githubusercontent.com/maplibre/maplibre-style-spec/main/src/reference/v8.json`), which
shares its lineage with Mapbox GL's, **so treat them as leads for their stack rather than as verified
facts about `mapbox-gl` 3.4**:

- **GeoJSON sources apply Douglas-Peucker simplification at `tolerance` 0.375 by default.** Smooth
  isolines are exactly the geometry that shows it. If contours look faceted, *lower* it — the
  opposite of the usual performance advice.
- **`fill-antialias` is not data-driven** (`property-type: "data-constant"`). With semi-transparent
  abutting isobands, antialiasing draws visible seams where band edges coincide. Either turn it off
  on the band layer, or draw isolines as a separate `line` layer over opaque fills.

Polygon *count* is not a risk here — a contour set is fifteen to twenty MultiPolygons, not thousands
of marks. Path *length* and re-`setData` frequency are: MapLibre issue #4364, *"Performance issue on
large FeatureCollection GeoJSON source updates"*, was closed as an enhancement with no fix
(`https://github.com/maplibre/maplibre-gl-js/issues/4364`). Recompute contours on a solve, not on a
pan.

### The honesty problem — the part worth contributing

EPANET fills the whole map rectangle (§2, point 3). Bentley's help page markets reading past the
model as a feature: *"Enhanced pressure contours can help the modeler to understand the behavior of
the system even in areas that have not been included directly in the model."*
(`https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-836151E941BF4727B06446957EBA1BF8.html`)
epanet-js's roadmap text says nothing at all. **All three are silent or wrong on the one question a
reader of the map cannot answer by looking at it: how much real data is this colour standing on?**

The planning engineer's rule is: never fill past the convex hull of the nodes carrying the plotted
value, and draw those nodes on top of the fill with no toggle to hide them. **Evaluating it:**

**The nodes-on-top half is right, is not negotiable, and is the cheaper half.** One layer, no
decision. It is the only thing on the screen that distinguishes a contour supported by forty
junctions from one supported by six, and every existing implementation omits it. Draw the plotted
nodes **in the same colour ramp**, so a dot that disagrees with the fill under it is visible — which
is what a bull's-eye, or EPANET's 200-junction decimation, looks like from the outside.

**The convex hull half is right, and better justified than I expected — but it is a floor, not a
ceiling.** Three candidates:

- **Convex hull.** Not a house rule: it is what the field already does. De Smith et al. say *"many
  GIS packages take one or other of these boundaries as the limit for procedures such as
  interpolation, generation of contour lines or the creation of TINs"*, and ITRC states it as a
  property of natural neighbour — *"This method does not extrapolate contours beyond the convex hull,
  or boundaries, of data locations"* (`https://gro-1.itrcweb.org/simple-geospatial-methods/`).
  **matplotlib's `tricontourf` default boundary is the Delaunay hull**, read from the source
  (`_tricontour.py`, `_triangulation.py` on `matplotlib/matplotlib` main). Taking the TIN route makes
  this the boundary automatically. **Its weakness is real**: a system wrapped around a bay, or two
  zones joined by one transmission main, gets confident fill over ground the model says nothing
  about. And ITRC adds a second caution the hull does not fix: *"Results are poor when areas of
  interest are around the edges of the surface."*
- **Alpha shape, and it is nearly free on the TIN route.** matplotlib tightens a `tricontourf` only
  by masking triangles (`mask` — *"Which triangles are masked out"*), which is exactly how an alpha
  shape is constructed. `d3-tricontour` accepts a custom triangulator
  (*"tricontour.triangulate([triangulate])"*), so **dropping triangles with an edge longer than some
  length gives an alpha shape with no clipping pass at all**. The objection to α — a hidden knob with
  no physical meaning — largely dissolves here, because the knob is *a maximum edge length in metres*,
  which is a quantity an engineer already reads off a map. That is a much better parameter than α.
- **A buffer around the pipes** (`@turf/buffer`, already their dependency). Also stateable in metres,
  but it disagrees with what the surface is supported by: the values sit on **junctions**, so a long
  transmission main with no junction on it would get a coloured corridor drawn from two distant
  values. **Demoted** — the max-edge mask above expresses the same intent using the actual support.

**Revised recommendation on the boundary: the Delaunay hull by construction, tightened by masking
triangles whose longest edge exceeds a user-visible distance.** One method, one parameter, both in
metres, and both defensible out loud.

**And there is a fourth thing, which nobody in this field appears to have built and which is the most
interesting contribution available here.** ITRC:

> *"Barriers to flow or data correlation can be modeled as linear features across which the
> interpolation model does not exchange information. Surfer terms this line a fault, and data on one
> side of the fault are not directly used in the interpolation of data on the other side."*

> *"A common mistake when creating potentiometric maps of unconfined aquifers is to let a computer
> program ignore the presence of surface water features, which typically leads to erroneous results."*

— `https://gro-1.itrcweb.org/characteristics-of-interpolation-methods/`

ITRC's worked example: an IDW surface with no river breakline showed a pump-and-treat well capturing
a plume; a kriged surface *with* the breakline showed the plume bypassing the well. Same data,
opposite engineering conclusion. **A water network has exactly this structure and it is not a
judgement call — it is in the model.** A closed valve, a PRV, a check valve or a pressure-zone
boundary is a hydraulic discontinuity: two junctions fifty metres apart on opposite sides of a closed
valve can differ by sixty psi, and **any interpolator that does not know about the barrier will draw
a smooth ramp across it that does not exist.** Unlike a groundwater breakline, which a hydrogeologist
has to draw by hand, ours is derivable — the network's own connectivity says which nodes are
hydraulically adjacent.

**That is the design contribution.** It is water-specific, it is not in EPANET, it is not in Bentley's
documented options, it is not in epanet-js's roadmap text, and it is the difference between a contour
that illustrates and a contour that misleads. The cheap first version is not a full fault model: it
is *mask any triangle whose vertices are not connected through open pipes*, which reuses the same
triangle-masking lever as the boundary rule above.

**Finally, state the support in words.** One line under the legend — *"interpolated from 47
junctions; linear over a triangulation; no fill across closed valves"* — does more for a reader than
any geometry, and would have exposed EPANET's silent decimation instantly.

### Performance

**On the TIN route there is barely a performance question**, which is the fourth reason to take it.
Delaunator's own published benchmarks (`https://github.com/mapbox/delaunator`, "Performance", Node
v10 on a 2017 MacBook Pro) give **82 ms for 100,000 uniform points** and 1.07 s for a million; the C++
port is only ~10% faster (`https://github.com/delfrrr/delaunator-cpp`), so JS is at native speed here.
Scaling that: **200 nodes sub-millisecond, 5,000 ≈ 4 ms, 50,000 ≈ 30–40 ms** — estimates from the
cited figure, not measurements. Meandering triangles over the triangles is `O(T · thresholds)` with
`T ≈ 2N`, so it is the same order. **Real-time at every scale either project cares about, with no
tuning and no resolution parameter.**

**The grid route is where the cost lives**, and it is worth stating so the trade-off is visible.
Naive IDW is `O(G·N)`. At 5 ns per (cell, node) pair — an estimate anchored on Delaunator's measured
throughput, not a measurement:

| grid | cells | N = 200 | N = 5,000 | N = 50,000 |
|---|---:|---:|---:|---:|
| 256 × 256 | 65,536 | 66 ms | 1.6 s | 16.4 s |
| 512 × 512 | 262,144 | 262 ms | 6.6 s | 65.5 s |
| 1024 × 1024 | 1,048,576 | 1.05 s | 26.2 s | 262 s |

Only the top-left corner is interactive. **And the obvious fix does not work**: doing a k-nearest
lookup per cell costs `G` index queries, and Flatbush's own measured figures
(`https://github.com/mourner/flatbush`, M1 Pro, Node v24) are 3.0 µs for a 1-neighbour query and
12.7 µs for 100 — so 512² one-nearest queries alone is 0.79 s. The index amortises over `N`, and `G`
is the bigger number. **The fix that does work is to invert the loop**: scatter from each node into
the cells within a cutoff radius, making the grid its own index, `O(N·c) + O(G)`. That is also what
Esri ships — its IDW defaults are **power 2 and 12 nearest points**, a local neighbourhood, not a
global one.

**Grid resolution, if it ever matters:** Esri's default cell size is *"the width or height (whichever
is shorter) of the extent of the feature dataset, divided by 250"*
(`https://doc.esri.com/en/arcgis-pro/latest/tool-reference/environment-settings/cell-size.html`), so
**256 × 256 is almost exactly the industry default** and there is no need to go finer to be
defensible. ITRC states the reason: *"generating many cells within a few known data points does not
provide information that is any more accurate or representative than if fewer, larger cells are
used."*

### So is Tom's instinct right?

**Yes on the maths, and more so than he claimed — and the interesting half is not the maths.**

The extraction is not hard: `d3-tricontour` is 28 KB of ISC-licensed code that takes scattered
`[x, y, value]` and returns GeoJSON isobands, clipped to the hull, with the alpha-shape lever
built in. The interpolation is not hard either. **But it is a choice rather than a difficulty, and
the evidence says the obvious choice is the wrong one**: EPANET uses IDW, and ITRC names IDW as
unsuitable for exactly this kind of surface at exactly this density. Matching the reference
implementation would have been the comfortable answer and it is not the best one.

**The hard part is neither the maths nor the extraction. It is the boundary, the barriers and the
disclosure** — the part with no precedent in any of the three tools whose documentation we could
read, and with a real cost, because a ragged-edged fill that stops at a closed valve looks less
finished than a full rectangle. That is precisely why every existing implementation draws the
rectangle, and precisely why doing it properly is worth contributing.

---

## 3. What would the contribution be, and in what order?

### Step 0 — the finding, before any code. Free, and useful whether or not we ever write a line.

Post four things nobody has put in front of them, each independently useful:

1. **EPANET's actual rule**, from `Fcontour.pas` with file and constant names — IDW power 2, six
   nearest, a fixed 20 × 20 grid over the whole map rectangle, at most 200 junctions sampled by
   stride, refuses under seven nodes. Their roadmap item does not say what rule to use; this is the
   reference implementation's, and it took an afternoon to find.
2. **That deck.gl's `ContourLayer` is aggregation, not interpolation**, and will draw a blocky
   mosaic on any real network. It is the first thing anyone will suggest, and it is a dead end.
3. **That `d3-tricontour` exists** (ISC, 28 KB, scattered points in, GeoJSON isobands out, hull
   clipping by construction) — which makes the whole feature far smaller than a grid pipeline.
4. **The honesty question**, and the barrier question under it: a closed valve is a hydraulic
   discontinuity and no interpolator knows about it unless it is told.

Two places: a comment on
`https://roadmap.epanetjs.com/results-visualization/p/contour-map-generation`, and a GitHub issue,
because `CONTRIBUTING.md` says open an issue first and there is currently no contour issue there.

**This is the whole contribution that carries no licence question at all.** Facts about EPA's
public-domain source are not ours to assign to anyone, and a comment is not a pull request. It is
also the highest-value hour in this document: it saves whoever builds it a day of source reading and
it opens the conversation on the design question rather than on our code.

### Step 1 — the minimal reviewable patch, if it goes further

**A pure function library, no UI.** In their layout, a new directory under `libs/map/src` (or a small
new `libs/contour`), exporting roughly:

```ts
contourBands(nodes, thresholds, {maxEdge?, barrier?}) → FeatureCollection<Polygon>
```

— scattered `{x, y, value}` in, GeoJSON isobands out, hull-clipped by construction, with `maxEdge`
masking long triangles and `barrier` masking triangles whose vertices are not hydraulically connected.

- **Size:** on the order of **150–300 lines of TypeScript plus vitest tests** — smaller than my first
  estimate, because `d3-tricontour` supplies the contouring and the hull. The custom triangulator
  that applies the two masks is a few dozen lines; the rest is types, thresholds and tests.
- **What it touches:** one new directory, one dependency line, and nothing else. **No UI, no
  symbology, no menu, no state.** Deliberate: it is the half where the maths lives, the half a
  reviewer can check against numbers, and it does not require them to accept any design decision in
  order to merge it.
- **Deliverable proof, and it is two tests, not one.** (a) An EPANET-compatibility test: an
  IDW(2, 6-nearest) mode reproducing EPANET's own Net3 contour to a stated tolerance, since Tom has
  now drawn exactly that plot. (b) A barrier test: two junctions fifty metres apart across a closed
  valve, showing the default TIN drawing a smooth ramp between them and the masked version refusing
  to. The second one is the argument, made in a test rather than in a paragraph.

### Step 2 — theirs, not ours

The threshold control, the legend, the colour ramp (they use chroma-js), where the control lives in
their UI, and **the boundary and disclosure rules**. These are product decisions in someone else's
product. We can argue for them; we do not get to ship them.

### What must be agreed with the maintainers before any code is written

1. **The interpolation rule** — TIN-linear as the default with IDW(2, 6-nearest) as an
   EPANET-compatibility mode, or the reverse. Their project, their call, and the answer changes the
   patch. Bring the ITRC quotation; it is the whole argument.
2. **The honesty boundary** — hull by construction, plus a max-edge mask, or none. **If their answer
   is "fill the rectangle, like EPANET", the design contribution has failed and the code
   contribution is not worth making.** Better to learn that in an issue thread than after writing it.
3. **Whether barrier masking is in scope at all.** It is the most interesting part and the most
   likely to be deferred; it also changes the function signature, so it is worth settling before the
   first line rather than bolting on later.
4. **Whether nodes-on-top is mandatory or a toggle.** A toggle defeats it. Ask explicitly.
5. **New dependencies** — `d3-tricontour` (ISC), or hand-written. Their monorepo, their bundle. Note
   for them that `marchingsquares` is AGPL-3.0 and `conrec` has no licence at all, so the obvious
   search results are not options for an FSL codebase.
6. **Where it lives** — `libs/map`, or a new workspace package.
7. **The CLA.** They say a formal process is coming. **Do not open a code PR before it exists and
   Tom has read it** (§4).

---

## 4. Should we?

### Against `dev/positioning.md`, honestly

`dev/positioning.md` §1 says lead with the invitation, not with a comparison; §5 says we do not track
their bugs; §2 says state our own licence and do not narrate theirs. **A contribution violates none
of those.** It is not a comparison, not a grievance and not a migration campaign. It is the most
literal available expression of *"world class and world owned"*, and it sits naturally beside the
2026-09-06 decision to name epanet-js in the not-epanet.org gratitude list — the generous direction
rather than the silent one.

**But it is contributing to a project this one is positioned against, and the asymmetry is real and
runs one way.** Their FSL forbids building "a competing product that offers the same functionality".
On their own framing we are plausibly that. So:

- **Code must flow out and never in.** Nothing from `epanet-js/epanet-js` may be read into GPL `lpn_`
  — not a snippet, not a structure copied from a file we opened. That is a discipline, and it gets
  harder the more time we spend in their tree. **The safest version of this whole exercise never
  clones their repository at all.**
- **Contributing our own original work is fine on the copyright** — Tom owns what he writes and may
  license the same work under GPL here and FSL there. **But the CLA sentence assigns rights to
  Iterating**, and rights assigned do not come back. *This is not legal advice.* If the contribution
  goes past Step 0, the CLA is the one document to read closely, and it does not exist yet.

### Does the work transfer back to `lpn_` (Task 600)?

**The design transfers completely. The code transfers not at all.** Their side is TypeScript in a
pnpm/turbo/Next monorepo with deck.gl and mapbox-gl; `lpn_` is plain JavaScript in one 35,000-line
file with no bundler, no npm, no build step, and a `vendor_integrity_check.php` that makes every
vendored file a declared decision. Nothing lifts across. What lifts across for free is the part that
matters: the interpolation rule, the boundary rule, the barrier rule, the disclosure line, and the
Net3 test case. And `js/looped-network.js` has **no hull, triangulation or contour code today** —
grepped; both projects start from zero. `d3-tricontour` is ISC and 28 KB, so it is a candidate for
`js/vendor/` here as well as a dependency there — a declared decision under
`vendor_integrity_check.php`, not a free one, and licence-compatible with GPL v3+ either way.

### Is a contribution the fastest route to it existing at all?

**No.** The roadmap item has 3 votes and no status; `CONTRIBUTING.md` requires an issue first and is
three days old; accepted PRs are re-applied by hand in a private repository on no committed timeline
("we can't commit to specific timelines"). Every gate on that path is theirs. Building it in `lpn_`
is a path we control end to end, and `dev/agents/utility-planning-engineer/wishlist.md` already ranks
contour last of the three Task 600 plots — so the honest reading is that **neither project is in a
hurry**, and the thing with the shortest path to existing is the finding, not the feature.

### What it costs and what it buys

**Costs:** the CLA and its rights assignment; time in a stack we otherwise never touch; the
contamination discipline above; and Tom's attention, which CLAUDE.md already names as the scarcest
resource here. **Buys:** genuine goodwill in the one direction `dev/positioning.md` wants to move —
gratitude, not comparison; review from people who do this full time, though in private; and reach
into a user base larger than ours.

### Recommendation

**Build it here first, and publish the finding now.** In order:

1. **Do Step 0 this month** — the `Fcontour.pas` analysis, as a comment on their Canny item and a
   GitHub issue. It is true, it is useful to them, it costs an hour, it carries no licence question,
   and it is the move that is unambiguously right whatever else we decide.
2. **Build contour in `lpn_` under Task 600**: TIN-linear over the Delaunay triangulation, the hull
   by construction, a max-edge mask in metres, no fill across closed valves, mandatory node dots, and
   the support sentence under the legend. Not because we are racing them, but because **the honesty argument is only persuasive once somebody has shipped it**
   — an argument in an issue thread that a ragged edge is better than a full rectangle loses to a
   screenshot, and a screenshot is a thing we can make.
3. **Offer the design to epanet-js once it works**, pointing at a running page rather than a
   proposal. At that point the conversation is about a demonstrated result, we have leverage we do
   not have today, and if they want the code, the CLA question can be answered on its own merits
   with something concrete on the table.

**Do not open a code pull request before the CLA exists and Tom has read it.** Everything valuable
in Step 0 and Step 3 happens without one.

---

## Appendix: what remains unverified

- **No GIS or water-industry source naming an interpolation method for pressure contours was found**
  (EPANET's manual, Bentley's WaterGEMS help and epanet-js's roadmap are all silent, per the planning
  engineer's two research passes; Esri's own comparison page offers no recommendation either). The
  `Fcontour.pas` reading above is the first primary answer this project has for *any* of them, and it
  answers only EPANET.
- **The ITRC pages 403 on direct fetch from this host and were retrieved by `curl` instead.** The
  quotations are verbatim from that retrieval; re-check them in a browser before quoting in public.
- **Every performance figure except Delaunator's own benchmark table is an ESTIMATE**, shown as
  arithmetic so it can be checked. The per-operation anchor (2–10 ns) is inferred from Delaunator's
  measured throughput, not measured. **No published JS benchmark for IDW or for marching squares was
  found at all.** Measure before quoting.
- **Kriging's `O(n³)` could not be confirmed** from a primary source that was actually fetched.
- **Ohmer et al. (2017), "On the optimal selection of interpolation methods for groundwater
  contouring"** (*Advances in Water Resources* 109) reportedly found inter-aquifer exchange rates
  varying by a factor greater than ten with the method chosen. **ScienceDirect and ADS both refused
  the fetch**; that figure is from search summaries and must not be quoted without the abstract.
- **Bentley's contouring algorithm is still unknown.** Its help documents the options in detail
  (`https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/9030.html`) and names no
  method. The one hint — *"accurate, straight-line contours"* smoothed only *"for presentation
  purposes"* — reads as TIN-linear, but **that is an inference, not their statement**.
- **`d3.geoContour`'s behaviour and accuracy at sub-degree extents is undocumented.** It triangulates
  on the sphere; our drawing frame is Mercator. Spike before adopting.
- **No source recommending contouring HGL rather than pressure was found.** The HGL-first idea in §2
  is a hypothesis.
- **Walski et al., *Advanced Water Distribution Modeling and Management*** could not be obtained; it
  is the most likely place a water-industry recommendation would exist.
- **No numerical-parity claim between `d3-tricontour` and matplotlib's `tricontourf` should be
  made.** They use the same family of algorithm; nobody has published a comparison.
- **The three merged outside PRs are translations and a colour tweak** — there is no precedent for an
  outside *feature* contribution to this repository, so "they accept outside PRs" is true and
  untested at the size we would be proposing.
