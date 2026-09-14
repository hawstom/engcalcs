# The projection catalogue: what "the full universe" costs (ROADMAP Task 641 phase 3)

**Tom, 2026-09-13, and it is a release blocker in his own words:** *"When are we going to add the
full universe of projections? We can't release without it, and I would like to test with it."*

This file is the answer, with numbers. `dev/geographic-projects.md` §8 remains the scope of the
feature itself; this is the growth question alone.

---

## 1. The answer in one paragraph

**The full universe is shippable as DATA, without proj4js and without any transform at all** — and
that is not a loophole, it is what a projected project already IS. Phase 1 decided that a projected
project holds the user's own eastings and northings and converts nothing, so what the catalogue
gives a user is the right NAME for coordinates they already have, plus a filter that finds that
name from a place. Both are lon/lat comparisons. Nothing in the growth path needs a projection
library. **What it does need is a decision about vendoring a DATA FILE**, because 121 rows can be
generated from a formula and seven thousand cannot be, and the register is somebody else's dataset.

---

## 2. What is data and what needs a transform

| Thing | Needs | Shippable today? |
|---|---|---|
| The name of a projection in the chooser | The register's own name string | Yes, data |
| The map-view filter (does this projection cover where I am looking) | The area of use, a lon/lat box | Yes, data |
| The name filter | The name string | Yes, data |
| Storing `project.crs` and writing it to a file | A code | Yes, already shipped |
| The status strip naming the coordinate system | A name | Yes, already shipped |
| Axis names, northing before easting | Nothing beyond the kind | Yes, already shipped |
| **A basemap behind a projected project** | Forward and inverse transform | **No** |
| **Terrain elevations on a projected project** | Inverse transform | **No** |
| **Converting a network between coordinate systems** | Forward and inverse transform | **No** |
| **The initial view of a projected project** (the 2026-09-13 defect) | Forward transform | **No** |
| **The point scale factor** (ruling P7) | The projection's own mathematics | **No** |

The line is sharp and it is worth stating the way a user would: **the catalogue tells you what your
coordinates are called; a transform would tell you where they are.** Everything above the rule in
that table is the first sentence, everything below it is the second.

---

## 3. The four tiers of growth, and what each costs

### Tier 0 — the 121 rows phase 2 shipped, generated

WGS 84 UTM, 60 zones in each hemisphere, plus EPSG:3857. `crsCatalogue()` and `crsExtent()` now
read one declarative family table (`LPN_CRS_FAMILIES`), so a family is a ROW and the name and the
area of use cannot disagree about which projection they describe. Cost of a new family in this
shape: one line, no new function, no new test scaffolding.

### Tier 1 — SHIPPED 2026-09-13: the regional UTM families and four national grids, 183 rows

Most of the world's engineering outside the United States is done on a UTM grid on a LOCAL datum
rather than on WGS 84: the numbers differ by a datum shift of a few metres, the zone geometry does
not. These are `base + zone` exactly as WGS 84 UTM is, so they are rows in the same table and carry
no new risk of a typo per entry. Four national grids that are a zone of nothing are typed out
beside them, with the register's own area of use. The list is in §4.

### Tier 2 — State Plane, and why it is NOT hand-listed

This is where the project's OWN users live: a United States civil engineer working for a city works
in State Plane feet far more often than in UTM. But it is not a formula — the codes are assigned
per zone, the names are per state, the foot ranges are not contiguous and two of §4's three traps
live inside it — so ~300 rows would each be typed and each be verified by hand. **That is the wrong
shape, and it is what makes Tier 3 the recommendation rather than a stretch goal**: the same
generator that produces 5,346 rows produces these 300 for free and correct.

### Tier 3 — the whole register

Thousands of projected CRS. Not typeable and not generatable from a numbering: it is a DATASET, so
it arrives as a generated data file plus the generator that made it, under
`dev/vendor-manifest.json` and `vendor_integrity_check.php`. **That is Tom's decision in the same
way proj4js is**, for a different reason: not licence or code risk, but that the repository would
start carrying somebody else's data and owing it an update path.

### Tier 4 — proj4js

Everything in §2 below the rule. Tom's decision. §6.

---

## 4. What the register actually is, measured

Counted 2026-09-13 by querying the real `proj.db` that PROJ 9.8.1 ships (EPSG v12.029, dated
2025-10-02), not from memory. **The live register is v13.103, released 2026-09-11**
(https://epsg.org/whatsnew.html), so expect these counts to have grown by a few hundred rather than
to have changed shape.

| Object | Total | Deprecated | Live |
|---|---:|---:|---:|
| **Projected CRS** | 5,708 | 362 | **5,346** |
| Geographic 2D | 689 | 78 | 611 |
| All CRS, EPSG authority | 7,709 | 525 | 7,184 |

**AND THE NUMBER THAT DECIDES THIS IS 79 KB.** Built from that database: every live projected CRS
as `[code, name, west, south, east, north]`, names averaging 29.4 characters, bounding boxes at
three decimals:

| Form | Raw | Gzipped |
|---|---:|---:|
| **All 5,346 projected CRS, array of arrays** | **336 KB** (64.2 bytes a row) | **79 KB** |
| Same, as objects | 457 KB | 84 KB |
| A curated engineering set, 1,446 codes, with proj4 strings as well | 284 KB | 39 KB |

The "EPSG is enormous" impression comes from `proj.db` itself, which is **9.73 MB** — but that file
carries transformations, datums, grid shift files and three other authorities besides EPSG. **Codes,
names and areas of use for every projected coordinate system on Earth is 79 KB over the wire**,
which is a third of the Bootstrap stylesheet this suite already ships.

**Licensing: redistributable, and the cost is one attribution line.** The EPSG Terms of Use
(https://epsg.org/terms-of-use.html) forbid selling the dataset and require that IOGP's ownership
*"be acknowledged in any publication or transmission (by whatever means) thereof"*, and permit
inclusion otherwise. They are not an OSI licence and sit BESIDE our GPL v3 as third-party data
terms, exactly as PROJ handles them: PROJ is MIT and ships the EPSG dataset inside every QGIS,
GDAL, PostGIS and pyproj install. Nothing here threatens the outbound licence, which
`dev/dependency-management.md` §2 is careful to keep a separate and revisable question.

**State Plane, since it is where this project's own users work.** SPCS83 is **124 zones** — 108 in
the contiguous states, 10 Alaska, 5 Hawaii, 1 Puerto Rico and the Virgin Islands, 1 Guam. On NAD83
in metres that is 123 live codes across **26929-26998 and 32100-32161**; the US survey foot versions
are 93 more and are **not contiguous** (2225-2289, 2965-2966, 3417-3455, 3734-3759, 26847-26854 and
others), and NAD83(2011) adds 176 metre and 99 foot zones interleaved inside 6393-6627. Three
projection families cover them: Lambert Conformal Conic 2SP for the east-west states (147),
Transverse Mercator for the north-south ones (97), and Hotine Oblique Mercator for Alaska zone 1
(EPSG:26931). **Any interface must key off the code and never off a range test.**

### The three traps, and they are the reason this is not a formula

Every one of these would have been minted by an arithmetic family and stored, permanently, in
somebody's engineering file, looking exactly like a real declaration.

1. **`26900 + zone` stops at 23.** NAD83 UTM zones 59N and 60N are EPSG 3372 and 3373, not 26959 and
   26960. 26924 is a 404.
2. **A live-looking code can be DEPRECATED.** ETRS89 / UTM zone 38N (25838) is deprecated, as are
   NAD83 / Kentucky North (26979, superseded by 2205) and NAD83 / Indiana East and West (2244, 2245).
   A deprecated code is worse than an unknown one: every GIS still reads it and nothing complains.
3. **`(Meters)` is not an EPSG string.** Zero of 2,173 NAD83-family names contain the word. The
   register writes `NAD83 / Alabama East` bare, and `(ftUS)` or `(ft)` for the foot versions;
   `(Meters)` is an ESRI convention. Writing it would put an ESRI name in a field claiming to be
   EPSG.

### What shipped today, and why these rows

183 rows: the 121 that were there, plus 58 regional UTM zones on four datums and four national
grids. Chosen on coverage per unit of risk — every one is either a `base + zone` family (so one
line and no per-row typo is possible) or a single grid whose four numbers were verified against the
register. Every code, name and bound was checked on 2026-09-13.

| Family | Codes | Rows | Covers |
|---|---|---:|---|
| WGS 84 / UTM | 32601-32660, 32701-32760 | 120 | Worldwide, the default |
| WGS 84 / Pseudo-Mercator | 3857 | 1 | The lat/lon project itself |
| NAD83 / UTM zone 1N-23N | 26901-26923 | 23 | North America |
| ETRS89 / UTM zone 28N-37N | 25828-25837 | 10 | Europe |
| GDA2020 / MGA zone 46-59 | 7846-7859 | 14 | Australia, current datum |
| GDA94 / MGA zone 48-58 | 28348-28358 | 11 | Australia, previous datum |
| Four national grids | 27700, 2157, 28992, 2193 | 4 | Britain, Ireland, Netherlands, New Zealand |

**State Plane is deliberately NOT in this pass**, and that is the honest partial: 124 zones in three
unit variants across two realizations is ~300 hand-typed rows with two of the three traps above
living in them, and hand-typing it is the wrong shape anyway. It belongs to §5.

---

## 5. Recommendation

**Ship the register as a GENERATED DATA FILE, not as more hand-typed rows, and do not make it wait
on proj4js.**

1. **A generator plus a committed JSON, the way `dev/features.md` and `examples/` already work** —
   `generate_projection_catalogue.php` reads a PROJ `proj.db` (or the IOGP download) and writes
   `js/data/epsg-projected.json`, with a `--check` leg in `check_all.sh` so the served file cannot
   drift from its source. The generator runs on a developer's machine; production stays a `git pull`
   of files that are their own source, which is `dev/dependency-management.md`'s first constraint.
2. **Fetched when the projection box first opens, never at page load.** 336 KB is a third of
   Bootstrap but it is dead weight on every visitor who never opens the chooser, and this box is
   opened once per project. One request, cached by the browser. It does NOT go in the service
   worker's precache for the same reason.
3. **The built-in 183 rows stay** as the answer when that fetch fails, so the chooser is never
   empty and a fork with no network still has UTM. This is the same shape the EPANET engine already
   has: a rich path and a working one.
4. **One attribution line, naming IOGP**, beside the OpenStreetMap credit and under the same rule —
   it is the credit a licence asks for, so it is not a language key.
5. **Then, and only then, decide proj4js.** The release Tom named does not need it: he asked for the
   full universe of projections, and the full universe of projections is data.

Estimated size of the work: the generator and the check are a session; the fetch, the fallback and
the attribution are a second. What it is NOT is a translation cost — a projection's name is not a
language key, so 5,346 rows cost zero strings in 26 languages.

**The one thing to decide before starting**: whether 5,346 rows or the ~1,446 of the curated
engineering set. The filter makes length nearly free — searching a town leaves a handful of rows
standing whichever number is behind it — so this is a question about honesty rather than about
usability, and "the full universe" is what was asked for. Take all of them.

---

## 6. What vendoring proj4js would mean

**NOT DONE, AND NOT OURS TO DO.** Written so the decision can be made on numbers rather than
re-researched. Measured from the npm tarball, 2026-09-13.

| | |
|---|---|
| Package | `proj4`, version 2.22.0, published 2026-08-31 |
| Licence | **MIT** (© Mike Adair, Richard Greenwood, Didier Richard, Stephen Irons, Olivier Terral, Calvin Metcalf) |
| Shipped size | `dist/proj4.js` **126.7 KB minified, 41.1 KB gzipped** |
| Definitions bundled | **Almost none.** EPSG:4326, 4269, 3857, the 120 WGS 84 UTM zones, UPS, and aliases. Every other CRS needs its proj4 or WKT string supplied |
| Definition strings | Another **284 KB raw / 39 KB gzipped** for a curated 1,446-code engineering set |
| Algorithms bundled | Generous: tmerc, etmerc, utm, lcc, omerc, somerc, sterea, stere, krovak, cass, laea, aea, poly, nzmg, eqdc, qsc, geos, tpers, eqearth |

**Licence fit is clean.** MIT is what both existing vendored packages are, is GPL-3 compatible in
the inbound direction `dev/dependency-management.md` cares about, and forecloses nothing about our
own outbound choice.

**What it would unlock**, and this is the whole of §2 below the rule: a basemap and terrain
elevations behind a projected project, converting a network between coordinate systems, the initial
view a projected project opens on, and the point scale factor of ruling P7.

**What it would oblige us to maintain.** A third vendored package in `dev/vendor-manifest.json` and
`js/vendor/README.md`, with a digest verified on every upgrade. A second coordinate pipeline beside
the Mercator one — `outwardY()`/`inwardY()` is currently the WHOLE boundary between the drawing
frame and the world, and a second projection means a second boundary with the same discipline or a
frame mismatch nobody can see. Per-TILE reprojection rather than per-view, which Task 641's own
research already measured at 2,338 m of error across the mission scope if pinned once. And a
standing temptation this file should name: **a transform makes "convert my network" askable, and
converting a network REWRITES every number the user typed**, which is the rule this whole page is
built around.

**The order that follows from all of it:** data first, because it is what was asked for and it is
free of every one of those obligations; proj4js afterwards, on its own merits, as its own task.

---

## 7. The one thing that does NOT get better with more rows

**A bigger catalogue does not make a projected project more useful; it makes it CORRECTLY NAMED.**
Worth saying out loud before anybody reads the row count as progress: a user who picks their State
Plane zone still gets no basemap, no place-name search, no terrain elevations and no initial view on
their site, because all four are gated on `isGeoProject()` and none of them can be had without a
transform. The catalogue is necessary for the release and is not sufficient for the feature.
