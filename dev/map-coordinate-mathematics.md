# The map frame, as mathematics

**Companion to `dev/map-coordinate-review.md`, asked for by Tom, 2026-09-11:** *"I hoped to see a
mathematical and geometric or geographic review of our paradigm and fundamental mapping chops. We
should leverage the literature on mapping from Google Maps and the GIS world and make sure that we
are serious and technically robust."*

**What this is.** The first review said what the paradigm is and ranked what is right and wrong
about it. This one does the algebra. It does not repeat that report; where the two touch, this one
cites a section number and goes further. A report, not a build: nothing shipped was edited.

**Every claim is marked.** **MEASURED** — a probe or a harness was run and the number printed.
**DERIVED** — the algebra was done here and is shown. **CITED** — somebody else's result, with a
URL.

**The three results worth the reading time, if you read nothing else.**

1. The frame is conformal on the **sphere** and is **not** conformal on the **ellipsoid**. The
   residual anisotropy is `N/M`, and it is **largest at the equator (0.674%) and smallest at the
   pole**, which is the opposite of what everyone expects. `mercator-harness.js` §7 cannot see it,
   because it defines "the same ground distance east-west" spherically — so its `1.00000` is a
   tautology, not a measurement. **This is not a new discovery, it is EPSG's own published caveat**
   — *"errors of 0.7 percent in scale"* — and the number in the registry IS `1/(1−e²) − 1`. Nothing
   in this tree had connected the two. (§2)
2. The float32 headroom has a clean closed form that the first report only sampled: the drawing is
   placed to half a pixel until the display resolution reaches about **`span / 2²²`** — the model's
   own ground span divided by four million — **independent of latitude, scale and hemisphere**.
   That is the whole precision budget in one expression, and it is how you decide a zoom clamp. (§4)
3. **Sterbenz is not what makes the file round trip exact, and the code comment claiming it is, is
   wrong twice over.** Byte identity for an untouched number comes from the `_xsrc`/`_ysrc` source
   channel, which needs no lemma at all. The lemma's actual job is idempotence for numbers *we*
   composed — and **MEASURED**, its hypothesis fails for 48.8% of longitudes near the prime meridian
   and 49.1% of ordinates near the equator. The consequence is 1.4 × 10⁻¹⁷ degrees, reaching a fixed
   point after one save, so the design survives; the argument written down for it does not. (§1.4)

---

## 1. The transform, stated formally

### 1.1 The chain

Let a stored geographic point be `(λ, φ)` — longitude and latitude in degrees on WGS 84. Write
`κ = 180/π`.

**Projection (spherical Web Mercator of the geodetic latitude, expressed in degrees of longitude).**
`js/lpn-geom.js`:

```
    mercRadY(φ)  =  ln( tan(φ/κ) + sec(φ/κ) )          =  ln tan(π/4 + φ/(2κ))      (identical)
    Y = mercY(φ) =  κ · mercRadY(φ)
    X = λ
```

with `φ` clamped to `|φ| ≤ MERC_MAX_LAT = 85.0511287798066°`, the latitude at which
`mercRadY = π` and therefore `Y = 180`. This is Snyder's spherical Mercator (USGS PP 1395, p. 41, eqs. **(7-1)** and **(7-2)**, with the
`ln(tan φ + sec φ)` form he gives immediately after) with `R` replaced by `κ` — a pure change of
linear unit. Google's own published `project()` uses Snyder's third form, **(7-2a)**,
`log((1+sin φ)/(1−sin φ))/2`; the three are algebraically identical. **CITED / DERIVED.**

**Origin.** With `Xmin`, `Ymin` the minima over the model's own stored points and `g = 2⁻⁷ = 1/128`:

```
    oₓ = g · ⌊Xmin / g⌋            o_y = g · ⌊Ymin / g⌋
```

Both are dyadic rationals with at most 7 fractional bits, hence exactly representable in binary64
for any |value| < 2⁴⁵. `chooseGeoOrigin()` / `rebaseGeoDocument()`.

**Drawing frame** (y-down, SVG):

```
    x = X − oₓ                     y = −(Y − o_y)
```

`inwardX` / `inwardY` in `js/looped-network.js`, which compose `cartesianY(v) = −v` with the shift.

**Screen:**

```
    sx = s·x + tx                  sy = s·y + ty
    tx = W/2 − s·cx                ty = H/2 − s·cy
```

one uniform scale `s` (`state.s`, screen pixels per drawing degree) on one `<g>`. `applyView()`.

**Inverse.** `screenToWorld` then `outwardX`/`outwardY`:

```
    x = (sx − tx)/s                λ = x + oₓ
    y = (sy − ty)/s                φ = mercLat(−y + o_y),    mercLat(v) = κ · atan( sinh(v/κ) )
```

### 1.2 Is the composition the identity?

Three separable questions. Only one of them has the answer the code's comments claim.

**(a) The projection pair `mercLat ∘ mercY`. NO, and by a wide margin.**
**MEASURED** (200,000 uniform samples on |φ| ≤ 80°): `mercLat(mercY(φ)) ≠ φ` for **70.9%** of
latitudes; worst departure **1.14 × 10⁻¹³ degrees** (≈ 12 nm on the ground). This reproduces the
69.7–69.8% already recorded in `dev/geographic-projects.md` §3 and `mercator-harness.js`, and it is
unfixable: `tan`, `ln`, `sinh` and `atan` are not correctly-rounded inverses of each other in any
IEEE-754 library. The design's response — never store the projection, carry the file's own `φ` in
`_ysrc` — is the only correct one.

**(b) The origin shift `(x − oₓ) + oₓ`. Sometimes, and the code says always.** See §1.4.

**(c) The view transform.** `(s·x + tx − tx)/s` is exact when `s` is a power of two and inexact
otherwise, by at most one ulp in binary64 — ~10⁻¹³ pixels at any scale this page permits. Nothing
downstream reads a coordinate back through the view; `screenToWorld` is fed a pointer position, not
a stored one. **DERIVED**; not a risk.

### 1.3 What that means for the file

The round trip that matters is *file → memory → file*. `projectStoredGeo()` stashes `_xsrc = λ` and
`_ysrc = φ` **before** the shift; `unprojectStoredGeo()` hands the stored token back iff
`mercY(_ysrc) − o_y === pt.y` (and the analogue on x). That test **recomputes the identical
expression on the identical inputs**, so for an untouched point it holds by construction, regardless
of how inexact `mercY` or the subtraction is.

**Therefore byte identity of the user's numbers does not depend on floating-point exactness at all.**
It depends on a guard that asks "is the drawn number still the one derived from the stored one?"
That is a strictly stronger design than an exactness argument, and it is the part of this paradigm
that most deserves to be defended. **DERIVED**, and confirmed by `geo-origin-harness.js`
(bit-identical open-then-save) — which is measuring the guard, not the lemma.

### 1.4 The Sterbenz claim is wrong as stated, and wrong about its own job

`js/looped-network.js` ~line 17005:

> **THE GRID IS A POWER OF TWO AND THAT IS THE WHOLE OF WHY THIS IS ALLOWED.** ... Sterbenz gives
> it: `x - ox` is exact whenever `ox/2 <= x <= 2*ox`

**Error 1 — the inequality is false in the western hemisphere.** Sterbenz's lemma (Muller et al.,
*Handbook of Floating-Point Arithmetic*, 2nd ed., Lemma 4.1) is stated for **positive** operands: if
`y/2 ≤ x ≤ 2y` then `x − y` is exact. With `oₓ = −122.2265625`, the literal condition reads
`−61.1 ≤ x ≤ −244.5`, which is empty. The correct extension is on **magnitudes and a common sign**:

```
    sign(x) = sign(oₓ)   and   |oₓ|/2 ≤ |x| ≤ 2|oₓ|      ⟹   x − oₓ exact
```

The first report (§3.7) noted the sign slip. It did not note that the hypothesis is not merely
mis-spelled but genuinely **violated in real places**.

**Error 2 — the hypothesis fails wherever the origin is near zero.** The failing regime is exactly
"the model is far from the origin *relative to the origin*", which happens when the origin is small:
near the prime meridian in x, and near the equator in y (where `Y = mercY(φ) ≈ φ`).

**MEASURED** (200,000 random points per box, origin chosen exactly as `chooseGeoOrigin()` does):

| Site | span | `oₓ` | `(x−oₓ)+oₓ ≠ x` | `o_y` | `(y−o_y)+o_y ≠ y` |
|---|---|---|---|---|---|
| Phoenix | 0.3° | −112.2265625 | 0 / 200,000 | 35.34375 | 0 / 200,000 |
| Phoenix, mission scope | 2.7° | −113.421875 | 0 / 200,000 | 33.921875 | 0 / 200,000 |
| Novato | 0.3° | −122.7265625 | 0 / 200,000 | 41.070313 | 0 / 200,000 |
| Oslo | 0.3° | 10.59375 | 0 / 200,000 | 74.953125 | 0 / 200,000 |
| **Greenwich / London** | 0.3° | −0.1015625 | **51,695 / 200,000 (25.8%)** | 60.03125 | 0 |
| **astride the prime meridian** | 2.7° | −1.3515625 | **97,605 / 200,000 (48.8%)** | 3.648438 | 0 |
| **equatorial (Kenya, Ecuador, Singapore…)** | 0.3° | 9.84375 | 0 | −0.132813 | **98,287 / 200,000 (49.1%)** |
| **astride the equator** | 2.7° | 18.6484375 | 0 | −1.351563 | **95,162 / 200,000 (47.6%)** |

`dev/lpn-spike/geo-precision-harness.js` asserts *"shifting a coordinate to the origin and back is
EXACT, not merely close — worst departure 0"*. That assertion is true at Novato, which is the one
site it tests, and **false in Nairobi, Quito, Singapore, Kampala, Accra and London**. The harness
has generalised a property of its fixture.

**Error 3 — the grid is not doing the job the comment assigns it.** Byte identity comes from
`_xsrc`/`_ysrc` (§1.3). What the dyadic grid actually buys is **idempotence for a coordinate we
composed ourselves** — an edited or dragged node, which carries no source token and is recomposed
as `x + oₓ` on every save.

**And the magnitude is negligible even where the lemma fails. MEASURED**, 300,000 edited points
about `oₓ = −0.1015625`:

- first round trip changes the value for **0.4%** of points, worst departure **1.39 × 10⁻¹⁷ degrees**
  (1.5 picometres on the ground);
- second round trip changes it again for **0.000%** — a fixed point after one save, exactly as
  `unprojectStoredGeo()`'s own comment predicts for `view`/`backdrop`;
- and the bound is `½ ulp(span + g) ≤ (2.7 + 0.008)·2⁻⁵³ ≈ 3 × 10⁻¹⁶°`, i.e. **33 nanometres**, for
  any model inside the declared mission scope, at any longitude. **DERIVED.**

**Verdict on §1.4.** The design is safe. The written argument for it is incorrect in its inequality,
incorrect in its scope, and assigns the load-bearing role to the wrong mechanism. Fix the comment;
do not change the code. The one thing that *should* change is the harness assertion, which should
either be scoped to "at this site" or be run at a prime-meridian and an equatorial fixture and state
the picometre bound instead of zero.

---

## 2. The distortion tensor of this frame

### 2.1 Setting it up

Take the frame coordinates `u = λ`, `v = mercY(φ)`, both in degrees. A differential ground
displacement at latitude `φ` on the WGS 84 ellipsoid has

```
    ds_E = N(φ) cos φ · dλ_rad          N(φ) = a / √(1 − e² sin²φ)      (prime vertical)
    ds_N = M(φ) · dφ_rad                M(φ) = a(1 − e²) / (1 − e² sin²φ)^{3/2}   (meridional)
```

From the projection,

```
    du = dλ_deg
    dv = d(mercY)/dφ · dφ_deg  ,   and   d(mercY)/dφ  =  sec φ      exactly
```

**MEASURED** (central difference on `Geom.mercY`): `1.000000001`, `1.197823028`, `2.000000002` at
φ = 0, 33.4, 60 against `sec φ` = `1.000000000`, `1.197823033`, `2.000000000`. The derivative is the
familiar one; it is worth writing down because it is *the* reason the y unit is "a degree of
longitude": one degree of `v` is one degree of `λ` on the ground, at the same point.

So the two principal scale factors of the map (frame units per ground metre) are

```
    h_E  =  du/ds_E  =  κ⁻¹ / ( N(φ) cos φ )              along the parallel
    h_N  =  dv/ds_N  =  κ⁻¹ · sec φ / M(φ)  =  κ⁻¹ / ( M(φ) cos φ )   along the meridian
```

**DERIVED.**

### 2.2 Is the frame conformal?

The Tissot ratio is

```
    h_N / h_E  =  N(φ) / M(φ)  =  (1 − e² sin²φ) / (1 − e²)
```

**DERIVED**, and this is the whole answer.

- **On a sphere** (`e = 0`) it is exactly 1. The frame is conformal, a circle stays a circle, a right
  angle stays a right angle, and the view transform being a single uniform scale is exactly right.
  This is Snyder's `h = k = sec φ` for the spherical Mercator.
- **On the WGS 84 ellipsoid** it is **not** 1, because we project the *geodetic* latitude with the
  *spherical* formula — which is precisely what EPSG:3857 is defined to do and precisely the caveat
  the registry attaches to it.

**MEASURED / DERIVED:**

| φ | `N/M` | anisotropy | `sec φ` (the scale itself) | ground m per drawing degree, E–W | N–S |
|---|---|---|---|---|---|
| 0° | 1.0067395 | **+0.674%** | 1.0000 | 111 319.5 | 110 574.3 |
| 10° | 1.0065363 | +0.654% | 1.0154 | | |
| 20° | 1.0059511 | +0.595% | 1.0642 | | |
| 33.0° | 1.0047403 | +0.474% | 1.1924 | | |
| 33.4° | 1.0046972 | +0.470% | 1.1978 | 93 029.3 | 92 594.3 |
| 38° | 1.0041850 | +0.419% | 1.2690 | 87 832.5 | 87 466.4 |
| 45° | 1.0033697 | +0.337% | 1.4142 | | |
| 50° | 1.0027846 | +0.279% | 1.5557 | 71 695.8 | 71 496.7 |
| 60° | 1.0016849 | +0.168% | 2.0000 | 55 800.0 | 55 706.1 |
| 70° | 1.0007884 | +0.079% | 2.9238 | | |
| 85° | 1.0000512 | +0.005% | 11.4737 | | |

**This is not our discovery — it is EPSG's published caveat, and we are the ones who had not
connected it.** The registry's remark on 3857 reads *"Not a recognised geodetic system. Uses
spherical development of ellipsoidal coordinates. Relative to WGS 84 / World Mercator (CRS code
3395) gives errors of **0.7 percent in scale** and differences in northing of up to 43km in the map
(21km on the ground)."* **That 0.7 percent is the number in the table above**: `1/(1−e²) − 1 =
0.674%`, at the equator. IOGP Guidance Note 7-2 says the consequence in terms:

> "Unlike either the spherical or ellipsoidal Mercator projection methods, **this method is not
> conformal: scale factor varies as a function of azimuth, which creates angular distortion.**"

and prints a worked example with `h = 1.1034264`, `k = 1.0972914`. **MEASURED**: the latitude
recovered from `k = sec φ` is 24.3095°N, and `sec φ · N/M` at that latitude is **1.1034333** against
their published `1.1034264` — agreement to **6 ppm**, which confirms `h/k = N/M` against a source
that computed it independently.

Snyder saw it in 1987, PP 1395 p. 46: *"The spherical projection is **not conformal** with respect
to the ellipsoidal Earth, although the variation is negligible for a map with an equatorial scale of
1:15,000,000 or smaller."* Our maps are 1:2,000. NGA's own position briefing puts it as a bare
contradiction: *"Conundrum: Spherical Mercator is conformal / web-Mercator is spherical Mercator (?)
/ **web-Mercator is NOT conformal**."*

Two clarifications the literature does not make and this report can. First, **the true ellipsoidal
Mercator (EPSG:3395) IS conformal** — Snyder (7-8), `h = k = (1 − e²sin²φ)^½ / cos φ`. The
non-conformality is created purely by feeding a *geodetic* latitude to a *spherical* formula, which
is the whole definition of EPSG:3857. Second:

**Read the first column against intuition.** Everyone expects Web Mercator's sins to grow toward the
poles, and its *scale* error does — `sec φ`, unbounded. Its *shape* error does the opposite: the
ellipsoid-versus-sphere anisotropy is worst at the **equator**, at `1/(1−e²) − 1 = 0.674%`, and
vanishes at the pole where `N = M`. A site on the equator is the one where a circle on the ground is
drawn least like a circle.

**So, plainly:**

- A circle on the ground of radius `r` draws as an **ellipse** with axis ratio `N/M`: 1.0067 at the
  equator, 1.0047 at Phoenix, 1.0017 at Oslo. On a 100 px circle that is **0.67 px** of out-of-round
  at the equator and 0.47 px at Phoenix — sub-pixel, invisible, and real.
- A right angle on the ground does **not** stay a right angle. A line bearing 45° draws at
  `atan(N/M) = 45.192°` at the equator, `45.134°` at Phoenix, `45.048°` at 60°. **DERIVED** from the ratio.
- **What the uniform view scale actually buys** is not conformality. Conformality is a property of
  the *projection*; the uniform scale is a property of the *view transform*, and what it buys is
  that the projection's conformality survives to the screen. An anisotropic view transform would
  destroy a conformality the projection had already established, and would make every symbol,
  stroke width, font, hit tolerance and label box direction-dependent. That is the saving, and the
  first report's §2.2 is right about it — it is a software saving, not a cartographic one.

### 2.3 `mercator-harness.js` §7 cannot see any of this

The harness sets `dLon = dLat / cos(lat)` and calls that "the SAME ground distance east-west". On a
sphere it is. On the ellipsoid the same ground distance east-west is
`dLat · M/(N cos φ)` — smaller by the factor `M/N`. So the harness compares the projection against a
spherical ground truth, and the projection *is* spherical, so it can only ever print `1.00000`. It
is asserting an algebraic identity dressed as a measurement.

That does not make its conclusion wrong — the anisotropy it was written to kill (`sec φ`, up to
2.000 at 60°) really is gone, and 0.67% is not 100%. It makes the **0.2% tolerance a fiction**: the
quantity measured is exactly 1 by construction, and the residual the tolerance appears to be
guarding is at 0.674%, which would fail it. **MEASURED / DERIVED.** Either widen the ground-truth
definition to the ellipsoid and assert `< 0.7%`, or say in the harness that it is checking the
spherical identity and name the ellipsoidal residual separately.

---

## 3. The length and area error budget

### 3.1 What `geodesicMeters()` actually computes

```
    d = √[ ( M(φ̄)·Δφ_rad )² + ( N(φ̄)·cos φ̄ · Δλ_rad )² ]        φ̄ = (φ₁+φ₂)/2
```

This is the **polar-coordinate flat-Earth formula** with the two WGS 84 radii of curvature evaluated
at the mid-latitude. **It is not a folk formula: it is codified in US federal law.** 47 CFR
§ 73.208(c) computes broadcast station separations by exactly this construction — average the two
latitudes (c)(2), take kilometres per degree of latitude and of longitude at that mid-latitude
(c)(3)–(4), and `DIST = (NS² + EW²)^0.5` (c)(7) — with the radii supplied as trigonometric series:

```
    KPDlat = 111.13209 − 0.56605 cos(2·ML) + 0.00120 cos(4·ML)
    KPDlon = 111.41513 cos(ML) − 0.09455 cos(3·ML) + 0.00012 cos(5·ML)
```

**MEASURED**, the FCC series against our `M·π/180` and `N cos φ·π/180`: they agree to **64 ppm or
better at every latitude from 0° to 60°** (latitude series −64 to +20 ppm; longitude series +11 to
+39 ppm). We are computing the FCC's formula with exact WGS 84 radii instead of a fitted series, so
ours is marginally the better of the two.

The rule also states its own validity range, which is the closest thing to an authority on when this
construction stops being acceptable: *"**The method set forth in this paragraph is valid only for
distances not exceeding 475 km (295 miles).**"* **That is a regulatory acceptance threshold, not an
error bound**, and no published error bound for this class of approximation could be found (checked
against Karney, GeographicLib and the standard references; Wikipedia's "10 metres over thousands of
kilometres" belongs to Andoyer–Lambert, a different formula, and must not be borrowed). §3.3–3.4
below are therefore this report's own contribution rather than a citation — and they show the FCC's
475 km is conservative by a factor of 1 to 4 against a 0.1% criterion. Structurally it is a **local tangent plane whose tangent point is the leg's own
midpoint**, which is why it is much better than a fixed-tangent-point plane and why it is not
invertible (`js/lpn-georef.js` freezes the radii at the anchor precisely so its transform can be
inverted).

### 3.2 Where the error comes from, analytically

Three separate sources. **DERIVED.**

1. **The east–west leg follows the parallel, not the geodesic.** A geodesic between two points on
   the same parallel bows **poleward** and is *shorter* than the parallel arc. To leading order, for
   an east–west separation `Δλ` at latitude `φ`,
   `(parallel − geodesic) / geodesic ≈ (Δλ_rad · sin φ)² / 24 · cos²φ`-ish; the practical statement
   is that it grows as `Δλ²` and as `tan²φ`, so it is **zero at the equator and at every latitude
   grows quadratically with leg length**. This is the dominant term for anything but a pure
   north–south leg, and it is why the worst bearing in the sweep below is always near 45–60°, never 0.
2. **The meridian arc uses the midpoint rule.** `∫ M(φ)dφ ≈ M(φ̄)·Δφ` is the midpoint rule, error
   `M''(φ̄)·Δφ³/24`. `M''/M` is `O(e²)`, so this term carries a factor `e² ≈ 0.0067` and is the
   *smallest* of the three. Observed: a pure north–south leg of 1000 km is wrong by **−5.2 ppm**.
3. **Pythagoras on a curved surface.** Combining the two components with `hypot` assumes the local
   frame is flat; the spherical-excess error is `O((d/R)²)`.

All three are quadratic in leg length, so the relative error should grow as `d²`. It does — see the
1/4/16/64 progression in the bearing table.

### 3.3 Measured against Vincenty's inverse

**MEASURED.** Vincenty's direct formula generates an endpoint at an exact geodesic distance and
bearing; Vincenty's inverse is the reference. Both written out here from the published formulae, not
called out of the page. Relative error `(ours − Vincenty)/Vincenty`, in **ppm**, from 33.4°N:

| leg | brg 0° | 15° | 30° | **45°** | 60° | 75° | 90° |
|---|---|---|---|---|---|---|---|
| 100 m | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| 1 km | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| 10 km | 0.0 | 0.0 | 0.0 | **0.1** | 0.1 | 0.1 | 0.0 |
| 50 km | 0.0 | 0.4 | 1.2 | **1.8** | 1.7 | 1.3 | 1.1 |
| 100 km | −0.1 | 1.5 | 4.8 | **7.2** | 7.0 | 5.4 | 4.4 |
| 200 km | −0.3 | 6.1 | 19.7 | **29.2** | 28.3 | 21.5 | 17.8 |
| 300 km | −0.7 | 14.2 | 45.5 | **66.8** | 64.3 | 48.5 | 40.0 |
| 500 km | −1.7 | 42.2 | 133.2 | **192.3** | 181.9 | 134.9 | 111.0 |
| 1000 km | −5.2 | 200.4 | 608.9 | **841.0** | 757.3 | 541.3 | 442.2 |

The `d²` law is visible: 100 → 200 → 400 km multiplies the error by ≈ 4 each step. Worst bearing is
45–60°, best is due north. **The first report's single "206 ppm at the mission scope" is the worst
case over a bearing sweep at a higher latitude; it is not what a 300 km leg costs at Phoenix, which
is 67 ppm.**

Worst |error| over all bearings, by start latitude (ppm; worst bearing in brackets):

| leg | 0° | 15° | 30° | 45° | 60° | 75° |
|---|---|---|---|---|---|---|
| 1 km | 0 | 0 | 0 | 0 | 0 | 0 |
| 10 km | 0 | 0 | 0 | 0 | 0 | 2 (60) |
| 50 km | 1 | 1 | 2 | 3 | 9 | 41 |
| 100 km | 3 | 3 | 6 | 14 | 37 | 167 |
| 200 km | 10 | 13 | 25 | 56 | 151 | 691 |
| 300 km | 23 | 31 | 58 | 129 | 348 | 1614 |
| 500 km | 63 | 87 | 165 | 370 | 1006 | 4879 |
| 1000 km | 256 | 367 | 713 | 1611 | 4514 | 25911 |

### 3.4 The thresholds asked for

**MEASURED**, worst case over all 360 bearings, leg length in km at which the relative error first
exceeds:

| start latitude | 0.1% | 0.5% | 1% |
|---|---|---|---|
| 0° | 1 938 km | 3 982 km | > 20 000 km |
| 15° | 1 591 | 3 177 | 4 140 |
| 30° | 1 170 | 2 367 | 3 118 |
| 45° | 802 | 1 657 | 2 210 |
| 60° | 498 | 1 046 | 1 408 |

So **the formula does not reach 0.1% until a single leg is about 500 km long even at 60°N**, which
is beyond the declared 300 km *system* span for one *pipe*. The declared scope is roughly three
orders of magnitude of margin over the threshold that would first matter.

### 3.5 Versus haversine, which is the formula everybody reaches for

**MEASURED**, worst over bearing at 33.4°N, against Vincenty:

| leg | ours | haversine on R = 6 371 008.8 m |
|---|---|---|
| 1 km | 0 ppm | **2 557 ppm** |
| 10 km | 0 | 2 563 |
| 100 km | 7 | 2 629 |
| 300 km | 69 | 2 772 |
| 1000 km | 847 | 3 247 |

Haversine's error is **floor-limited, not length-limited**: on a 30 m service lateral it is still
0.26%, because the sphere is the wrong figure, not the wrong approximation. Our formula is
**exact to the printed digit below 10 km and beats haversine at every length up to 1000 km**. The
`lpn-geom.js` comment's "~0.5%, 5 m in a kilometre" is the right order and, at 33.4°N, about twice
the observed 2.6 m/km; the argument it makes is correct and, if anything, understated in our favour
at short range. **This is the single best-justified numerical decision in the geographic code.**

### 3.6 What this costs a hydraulic model, and what to tell an engineer

Head loss is linear in length in both methods the suite ships:

```
    Hazen-Williams   h_f = 10.67 · L · Q^1.852 / ( C^1.852 · D^4.87 )        ⟹  ∂h_f/h_f = ∂L/L
    Darcy-Weisbach   h_f = f · (L/D) · V²/2g                                 ⟹  ∂h_f/h_f = ∂L/L
```

**A relative length error is a relative head-loss error of the same size, one for one.** There is no
exponent to soften it and none to amplify it. **DERIVED.**

| source of length error | magnitude | head loss on a 10 ft loss |
|---|---|---|
| `geodesicMeters()` on a 1 km pipe | < 0.05 ppm | < 0.000005 ft |
| `geodesicMeters()` on a 10 km transmission main | ≤ 2 ppm | 0.00002 ft |
| `geodesicMeters()` on a pathological 300 km single leg at 60°N | 348 ppm | 0.0035 ft |
| haversine, any length | 2 560 ppm | 0.026 ft |
| **measuring off the drawing frame with `hypot`** | **`sec φ` − 1 = 19.8% at 33.4°, 100% at 60°** | **2.0 ft, 10 ft** |
| a node dragged 2 m off true on a 300 m pipe | 6 700 ppm | 0.067 ft |
| Hazen-Williams `C` known to ±10% | — | ±1.9 ft (`h ∝ C^−1.852`) |
| internal diameter after tuberculation, ±5% | — | ±1.3 ft (`h ∝ D^−4.87`) |

**The honest sentence for the interface is therefore not about geodesy.** The geodesy is three to
four orders of magnitude better than the worst input beside it, and telling a user about 348 ppm
would be noise. The sentence that *is* worth saying is the fifth row: **a distance read off the
picture is not a distance on the ground, and at 33.4°N it is 19.8% too long.** That is the one error
in this table an engineer can actually make, it is the one the page currently gives him no defence
against, and it is what §5 is about.

A second sentence is worth having in the property popup and is not there: **an automatic length is
the length of the drawn polyline, not the length of the pipe.** A pipe that dips under a creek, or
that was laid with a 3% slope down a hillside, is longer than its plan projection by
`√(1 + m²) − 1` — 0.045% at a 3% grade, 1.12% at 15%, 4.40% at 30%. That is *larger than every geodetic
term in this document* on steep ground, and it is exactly the case where `lenAuto` is most tempting.
`len` being stored and overridable (first report §2.3) is what makes it fixable; nothing tells the
user it needs fixing. **DERIVED.**

### 3.7 Area

Nothing in the suite computes a ground area today (**MEASURED by grep**: no pressure-zone area, no
service-area statistic, no buffer). Recording the budget in advance, because a frame in which area is
*not* preserved is the classic Mercator trap and somebody will one day want a pressure-zone acreage:
the areal scale of this frame is `h_E · h_N = sec²φ / (N M cos²φ) · κ⁻²`, i.e. relative to the
equator an area drawn here is inflated by **`sec²φ`** — ×1.43 at 33.4°, ×2.00 at 45°, ×4.00 at 60°.
Any area must be computed from the stored lon/lat on the ellipsoid (Karney's polygon-area algorithm
is the reference), never from the drawing frame, exactly as length already is.

---

## 4. Precision

### 4.1 The model

An SVG path coordinate reaches Skia as `SkScalar`, a 32-bit float. The composition the page asks for
is `s·x + tx` with `tx = W/2 − s·cx`. `geo-precision-harness.js` models it as

```
    p̂ = fl₃₂( fl₃₂( fl₃₂(s)·fl₃₂(x) ) + fl₃₂( W/2 − fl₃₂( fl₃₂(s)·fl₃₂(cx) ) ) )
```

and this section uses the same model, so the two are comparable.

### 4.2 The closed form the first report only sampled

Let `C = max |x|` be the largest coordinate **magnitude** a drawn point has in the local frame — for
a rebased document, at most the model span `S` plus one grid cell (1/128°).

Both `s·x` and `s·cx` have magnitude `O(sC)`. Each float32 rounding contributes at most
`½ ulp₃₂(sC) = sC·2⁻²⁴`. The final addition is a subtraction of two nearly equal quantities whose
difference is on-screen and therefore small, so by Sterbenz it is exact and contributes nothing. With
three roundings in the chain,

```
    |p̂ − p|  ≲  3 · s·C · 2⁻²⁴   ≈   s·C · 2⁻²²·(3/4)
```

Setting that to half a pixel gives the break scale

```
    s_½  ≈  2²² / C          [ screen pixels per drawing degree ]
```

**MEASURED against the model**, sweeping `s` by bisection for the first scale at which any on-screen
point deviates by half a pixel, canvas 1200 px:

| `C` (deg) | measured `s_½` | `2²²/C` | ratio |
|---|---|---|---|
| 0.005 | 1.06 × 10⁹ | 8.39 × 10⁸ | 1.27 |
| 0.05 | 2.12 × 10⁸ | 8.39 × 10⁷ | 2.53 |
| 0.5 | 8.62 × 10⁶ | 8.39 × 10⁶ | 1.03 |
| 1 | 4.31 × 10⁶ | 4.19 × 10⁶ | 1.03 |
| 2.7 | 1.56 × 10⁶ | 1.55 × 10⁶ | 1.01 |
| 5 | 1.00 × 10⁶ | 8.39 × 10⁵ | 1.19 |
| 90 | 4.74 × 10⁴ | 4.66 × 10⁴ | 1.02 |
| 112 | 5.28 × 10⁴ | 3.75 × 10⁴ | 1.41 |
| 180 | 2.69 × 10⁴ | 2.33 × 10⁴ | 1.16 |

The formula is right to within a factor of two, and the scatter is exactly one binade: `ulp₃₂` is a
step function of the binary exponent, so `C` just under a power of two gets a free doubling. **A
factor-of-two bound on a precision headroom is a usable engineering bound** and a tighter one would
be dishonest.

### 4.3 The latitude-free restatement — the useful form

Convert to ground resolution. At latitude `φ`, one drawing degree is `N cos φ · π/180` ground metres,
so the display resolution at scale `s` is `res = N cos φ · π/180 / s`. Substituting `s_½ = 2²²/C` and
writing `C_g = C · N cos φ · π/180` for the model's span **in ground metres**:

```
    res_½  =  C_g / 2²²        ≈   C_g / 4.19 × 10⁶
```

**The cosines cancel.** **DERIVED**, and **MEASURED** at 33.4°N:

| `C` | model span | measured `res_½` | `C_g / 2²²` |
|---|---|---|---|
| 0.005° | 0.5 km | 8.8 × 10⁻⁵ m/px | 1.1 × 10⁻⁴ |
| 0.05° | 4.7 km | 4.4 × 10⁻⁴ | 1.1 × 10⁻³ |
| 0.5° | 46.5 km | 1.1 × 10⁻² | 1.1 × 10⁻² |
| 2.7° | 251 km | 5.9 × 10⁻² | 6.0 × 10⁻² |
| 112° | 10 419 km (a raw longitude) | 1.76 m/px | 2.48 |

**Stated in one sentence:** *float32 gives the drawing about 22 bits of usable dynamic range across
whatever the coordinates span, so you can zoom to about one four-millionth of the span before the
rasteriser moves a symbol half a pixel.* Everything Task 354 and Task 439 found falls out of that
line. An unrebased longitude spans 10 400 km of coordinate magnitude, so 22 bits buys 2.5 m/px — and
a water network is drawn at 0.1 m/px, which is 25 times past the break. That is the 575 px failure,
predicted rather than sampled.

### 4.4 Where the page sits against that

`maxScale() = MAX_SCALE_GRID / DEG_PER_M = 500 × 111132 = 5.5566 × 10⁷` px per drawing degree. That
is **1.67 × 10⁻³ m/px at 33.4°N** — 1.7 mm per pixel — and corresponds to a slippy-map zoom of
`z = log₂(360 s / 256) = 26.2`, seven levels past the z = 19 ceiling of both tile sources.

**MEASURED**, worst on-screen deviation at `maxScale()` in the float32 model, for a viewport of
points spread across 1200 px:

| model span `C` | ground span at 33.4° | worst error at `maxScale()` |
|---|---|---|
| 0.005° | 0.5 km | 0.000 px |
| 0.05° | 4.7 km | 0.000 px |
| 0.5° | 46.5 km | 2.0 px |
| 1° | 93 km | 4.0 px |
| **2.7° (mission scope)** | **251 km** | **28 px** |
| 5° | 465 km | 34 px |

This is stronger than the first report's §3.4 (8 px), and the difference is methodological: that
table sampled the *model*, which at `maxScale()` is almost entirely off-screen, so it under-sampled
the failure. Sampling across the *viewport* is the right thing to do, because the viewport is what
gets rasterised.

So at the declared mission scope the deepest permitted zoom is **1.5 orders of magnitude past the
precision budget** (`maxScale()` = 5.56 × 10⁷ against `s_½` = 1.56 × 10⁶, a factor of 36), and a
symbol can sit 28 px from its own pipe end. Nobody zooms a 250 km model to 1.7 mm/px. But
`zoomExtent`, Go-to and a pinch can all land there, the failure looks like a rendering bug, and the
fix is arithmetic rather than judgement — see §7.

### 4.5 How the literature avoids this

Three strategies. None of them is "use doubles" — WebGL has no doubles either, and SVG reaches Skia
as `SkScalar`, which is `typedef float SkScalar;` and `SkPoint` is documented as *"two 32-bit
floating point coordinates"*. Every canvas and SVG path coordinate in Chromium is quantised to
float32; this is not an SVG-versus-WebGL distinction.

- **Tile-local INTEGER coordinates.** The Mapbox Vector Tile specification stores geometry as
  integers in a tile-local grid: *"Coordinates within a geometry MUST be integers"*, with
  `extent` defaulting to 4096, and *"A Vector Tile SHOULD NOT contain information about its bounds
  and projection."* MapLibre narrows it further to `EXTENT = 8192` and the source says exactly why:
  *"Vertex buffer store positions as signed 16 bit integers. One bit is lost for signedness… This
  leaves us with 2¹³ = 8192."* **The mainstream renderer does not use floating point for geometry at
  all.** Thirteen bits inside a tile, renewed at every zoom level by subdivision, is why the problem
  never arises there. Our local origin is the same idea with one tile for the whole document, which
  is why our headroom is fixed at `span/2²²` instead of renewing.
- **High/low split, done on the CPU.** deck.gl: *"To compensate for the lack of 64-bit floats in
  WebGL2/WebGPU, deck.gl may apply a dynamic translation to common-space positions, determined by
  the viewport, to improve the precision of projection."* The mechanism is
  `PROJECTION_MODE.WEB_MERCATOR_AUTO_OFFSET`, and its source comment is our own argument in their
  words: *"Calculate transformed projectionCenter (using 64 bit precision JS) — this is the key to
  offset mode precision (avoids doing this addition in 32 bit precision in GLSL)."* **And the origin
  is snapped with `Math.fround` before use** — `[Math.fround(viewport.longitude),
  Math.fround(viewport.latitude), 0]` — which is precisely what our 1/128° dyadic grid is for, done
  a different way. The explicit `fp64` shader emulation they used to ship was **removed in v8**:
  *"The current 32-bit projection is generally precise enough for almost all use cases."* The
  industry tried the expensive fix and abandoned it for the origin shift.
- **Recentring on the camera every frame.** That is the "dynamic" in deck.gl's sentence: the offset
  follows the *viewport*, so the magnitude the GPU sees is bounded by what is on screen rather than
  by the model. **We re-derive our origin once, at load** — which is §7 item 4, and is the one
  strategy of the three that is both available to us and not yet taken.

---

## 5. The scale bar

Tom has approved one. Here is what it has to show in this frame.

### 5.1 Ground metres per screen pixel

At latitude `φ` with view scale `s` (px per drawing degree), from §2.1:

```
    res_E(φ, s)  =  N(φ) · cos φ · (π/180) / s        metres per pixel, east–west
    res_N(φ, s)  =  M(φ) · cos φ · (π/180) / s        metres per pixel, north–south
```

Note both carry `cos φ`: the north–south one gets it from `dφ = cos φ · dv`, which is the whole
content of the Mercator ordinate. `EngCalcs.lpnGeorefMetersPerDegree(lat)` already returns exactly
`{lon: N cos φ · π/180, lat: M · π/180}`, so the implementer's two expressions are

```js
    var mpd = EngCalcs.lpnGeorefMetersPerDegree(lat);
    var resE = mpd.lon / state.s;                     //  east-west
    var resN = mpd.lat * Math.cos(lat * Math.PI / 180) / state.s;   //  north-south
```

**Do not use `DEG_PER_M`** for this. It is `1/111132`, a degree of *latitude*, and using it for a
bar in a frame whose unit is a degree of *longitude* is Task 517's defect a fourth time.

**MEASURED**:

| φ | `s` | `res_E` | `res_N` | `res_N/res_E` |
|---|---|---|---|---|
| 33.4° | 6 479 (the Net3 example) | 14.3586 m/px | 14.2915 | 0.995325 |
| 33.4° | 50 000 | 1.8606 | 1.8519 | 0.995325 |
| 60° | 6 479 | 8.6124 | 8.5980 | 0.998318 |

The ratio is `M/N` again — **0.47% at Phoenix, 0.17% at Oslo, 0.67% at the equator**. A single bar is
therefore honest in both directions to **better than 0.7% anywhere**, which is far inside the ±1 px
a 100 px bar can be read to. **One bar, drawn horizontally, is correct.** This is the same conclusion
OpenLayers states — for a conformal projection the scale is valid in all directions — reached here
with the ellipsoidal residual actually evaluated rather than assumed away.

### 5.2 Can one bar be honest across a tall viewport?

The bar is evaluated at one latitude; the viewport spans a range of them. A viewport `H` px tall at
scale `s` spans `Δv = H/s` drawing degrees, and the scale factor varies as `sec φ` across it.

**MEASURED**, `H = 900`:

| centre φ | `s` | ground height | φ at top | φ at bottom | `sec` ratio | spread |
|---|---|---|---|---|---|---|
| 0° | 6 479 | 15.5 km | 0.0695 | −0.0695 | 1.000000 | **0.000%** |
| 33.4° | 20 000 | 4.2 km | 33.4188 | 33.3812 | 1.000432 | 0.043% |
| 33.4° | 6 479 | 12.9 km | 33.4580 | 33.3420 | 1.001335 | **0.134%** |
| 60° | 6 479 | 7.8 km | 60.0347 | 59.9653 | 1.002102 | 0.210% |
| 33.4° | 100 | 837 km | 37.0742 | 29.5636 | 1.090183 | **9.0%** |
| 60° | 100 | 502 km | 62.1747 | 57.6723 | 1.145642 | **14.6%** |

**Answer: yes at any working zoom, no at a continental one.** At every scale at which a network is
drawn (say `s ≥ 1 000`, i.e. a viewport under ~80 km tall) the top-to-bottom spread is under 1% and a
single bar evaluated at the view centre is correct to better than a pixel. At the whole-continent
zooms this page reaches — and it does reach them, `minScale()` fits the entire Earth — the spread is
9–15% and **no single bar can be honest**. Both Leaflet and OpenLayers ship exactly this behaviour
and nobody regards it as a defect; a scale bar on a world map is understood to be local.

If the honesty matters, the standard remedy is to evaluate at the view centre (which both libraries
do) and to **suppress the bar entirely below some scale**. A defensible threshold falls straight out
of the table: suppress when the top-to-bottom spread exceeds ~2%, which is
`sec(φ_top)/sec(φ_bot) > 1.02`, roughly `H/s > 1.5°` at mid-latitudes — i.e. `s < 600` on a 900 px
canvas. **DERIVED.** Below that the network is a dot anyway.

### 5.3 Choosing a round length

The convention in all three mainstream libraries is: take a pixel budget, convert it to ground
distance at a chosen point, round the **ground distance** to a "nice" number, and draw the bar at
whatever pixel width that number occupies. Nobody rounds the pixels. Beyond that they differ in
three ways that matter to an implementer here, and **the libraries were read rather than
remembered**:

| | evaluated where | rounding sequence | pixel budget | distance function |
|---|---|---|---|---|
| **OpenLayers** `ScaleLine` | view **centre**; for EPSG:3857 an analytic `resolution / cosh(y/R)` | `LEADING_DIGITS = [1, 2, 5]` | `minWidth = 64`, grows upward, dpi-scaled | analytic for 3857; haversine `R = 6371008.8` otherwise |
| **Leaflet** `ScaleControl` | container `x = 0` → `x = maxWidth`, at `y = height/2` — *not* symmetric about the centre | `10, 5, 3, 2, 1` | `maxWidth = 100`, rounds down | haversine, `R = 6371000` |
| **MapLibre** `ScaleControl` | view centre **± 50 px** | `10, 5, 3, 2, 1`, **plus a sub-1 decimal branch** | `maxWidth = 100` | spherical law of cosines, `R = 6371008.8` |
| **Google Maps** | — | — | — | **not documented at all** (verified absence, not a search failure) |

**OpenLayers is the one that has solved our exact problem in closed form.** Its EPSG:3857 override is
one line —

```js
    getPointResolution: function (resolution, point) { return resolution / Math.cosh(point[1] / RADIUS); }
```

— and `cosh(y/R) = sec φ` for spherical Mercator, so **OpenLayers divides Snyder's (7-3) scale factor
out analytically at the view centre.** That is our `mpd.lon / state.s` with the constant moved to the
other side. The OGC's own WMTS annex explains why nobody can skip this step: for
`GoogleMapsCompatible`, *"Scale denominator is only accurate near the equator."*

**We can be slightly better than OpenLayers for free.** Its `RADIUS` is the sphere's `a`, so its bar
is the *spherical* ground distance; the true east–west distance uses `N(φ)`, and
`N/a = (1 − e² sin²φ)^(−½)`. **DERIVED**: OpenLayers' bar is short by **0 ppm at the equator,
1 015 ppm at 33.4°, 1 675 ppm at 45°, 2 514 ppm at 60°**. Immaterial for reading a map, and we avoid
it at zero cost because `lpnGeorefMetersPerDegree()` already returns `N cos φ · π/180` rather than
`a cos φ · π/180`.

**MEASURED**, both algorithms implemented faithfully from their sources and run against this page's
own frame at 33.4°N:

| `s` | ground m/px | OpenLayers (`minWidth` 64) | Leaflet (`maxWidth` 100) |
|---|---|---|---|
| 300 | 310.1 | 20 000 m @ 64 px | 30 000 m @ 97 px |
| 1 500 | 62.0 | 5 000 m @ 81 px | 5 000 m @ 81 px |
| 6 479 (the Net3 example) | 14.36 | 1 000 m @ 70 px | 1 000 m @ 70 px |
| 50 000 | 1.861 | 200 m @ 107 px | 100 m @ 54 px |
| 5.56 × 10⁷ (`maxScale()`) | 0.001674 | 0.2 m @ 120 px | **1 m @ 598 px** |

Swept over a decade of scales: the OpenLayers bar never exceeds **2.48 ×** its `minWidth`
(64 → at most 159 px); the Leaflet bar always fills at least **50%** of its 100 px allowance.

**Two findings from that table that decide the choice.**

1. **Leaflet's `_getRoundNum` is broken below 1 metre, and this page reaches that.** It derives the
   decade from `String(Math.floor(num)).length - 1`, so for `num < 1` it gets `pow10 = 1` and always
   returns 1. At `maxScale()` the 100 px allowance is 0.167 m, and Leaflet would print **`1 m` on a
   598 px bar** — a scale bar six times longer than its own budget and six times wrong.
   MapLibre patched exactly this with `getDecimalRoundNum`. **If the Leaflet sequence is copied, copy
   MapLibre's version of it, not Leaflet's.**
2. **Prefer OpenLayers' 1-2-5.** It is the sequence a GIS reader expects on an exhibit, it has no
   sub-1 defect, and `3 km` is a harder label to read across 27 languages and a ft/m strip than
   `2 km`. The cost is a bar that can run to 2.5 × its minimum, which is a layout question, not an
   honesty one.

**The formula an implementer can use** — `minWidth` growth, 1-2-5, evaluated at the view centre:

```js
// lat = latitude at the VERTICAL CENTRE of the viewport; state.s = px per drawing degree.
var res = EngCalcs.lpnGeorefMetersPerDegree(lat).lon / state.s;   // ground metres per pixel, E-W
var i   = 3 * Math.floor(Math.log10(MIN_BAR_PX * res));           // MIN_BAR_PX ~ 64
var len, px;
for (;;) {
    len = [1, 2, 5][((i % 3) + 3) % 3] * Math.pow(10, Math.floor(i / 3));   // ground metres
    px  = Math.round(len / res);
    if (px >= MIN_BAR_PX) { break; }
    i++;
}
```

Three notes that are not in the formula and matter as much as it does.

1. **The latitude must be the view centre's, and it must be recomputed on every pan.** A bar computed
   once at the equator overstates every distance by `sec φ`: **19.8% at Phoenix, 41.4% at 45°, 100%
   at 60°** (**DERIVED**). This is the single most likely way to ship a scale bar that is worse than
   no scale bar, and it is exactly the mistake the OGC annex above is warning about.
2. **US customary needs its own rounding, not a converted metric bar.** Round in feet or miles with
   the same 1-2-5 rule; a bar labelled `1 609 m` is nobody's idea of a scale bar and `0.62 mi` is
   worse. The unit strip follows the project's own length unit, which the document already states.
   (Note that Leaflet's imperial branch uses the rounded `3.2808399`, which `js_constant_check.php`
   would fail here — use `1 / 0.3048`.)
3. **`state.s` is in CSS pixels, which is what a reader sees, so the formula is correct as written
   on any `devicePixelRatio`.** A *printed* scale statement is a different quantity and belongs with
   the print work. OpenLayers models that case with its `dpi` option and the OGC's 0.28 mm standard
   pixel (`DEFAULT_DPI = 25.4 / 0.28`); we should not, until printing to scale is on the table.

### 5.4 The north arrow is not a cartographic question here

A geographic project is always north-up: the frame has no rotation term, `applyView()` writes only
`translate` and `scale`, and the georeferencing wizard's rotation is applied to the *model* before it
becomes geographic, never to the view. So a north arrow is a constant glyph and carries no
mathematics at all. It is worth having for the reason the first report gives — it tells a reader the
drawing *is* north-up — and for no other.

---

## 6. What a projected CRS would change

The question is not "is Web Mercator a good CRS" (it is not, and the registry says so). The question
is what this product would gain, because **the correct distance is already computed on the ellipsoid
and never read off the frame**. That removes the usual reason for a projected CRS before the
comparison starts.

### 6.1 EPSG:3857 in metres

**Changes nothing but a constant.** Multiply the frame by `a·π/180 = 111 319.49`. Identical map,
identical conformality, identical anisotropy, identical tile registration.

- **Better:** `state.s` becomes "screen px per EPSG:3857 metre", which a GIS reader can name;
  `res = state.s⁻¹ · cos φ` reads more like the rest of the world's code.
- **Worse:** coordinate magnitudes go from ~120 to ~1.3 × 10⁷, which costs **17 bits** of the float32
  budget — `res_½` would jump from `span/2²²` to the unrebased regime — so the local origin becomes
  load-bearing where today it is merely prudent. It also makes `_xsrc` mandatory rather than
  belt-and-braces, because `λ → metres → λ` is a new inexact round trip on the user's numbers.
- **Neither better nor worse cartographically**, and worth saying because it is tempting to think a
  named EPSG code buys accuracy: EPSG:3857's departure from the *true* ellipsoidal Mercator
  (EPSG:3395) is **MEASURED** at up to **42 633 m of northing in the map** (at the 85.0511° clip) and
  **21 373 m on the ground** (maximum at 45°), reproducing the registry's own "up to 43km in the map
  (21km on the ground)" to three figures. Those two maxima are at *different latitudes*, which the
  registry does not say. **None of it matters to us**, because the tile grid makes the identical
  departure — the map and the pipes agree with each other, which is the only registration that
  exists here.
- **Migration cost:** low but non-zero, and it buys nothing. **Do not do it.** If the readability of
  `state.s` is the complaint, the answer is §7 item 3, which is one line.

### 6.2 A UTM zone (or State Plane)

- **Better:** `hypot(dx, dy)` becomes a distance to within the grid scale factor; a user with
  surveyed easting/northing could type them in; export to a GIS carries a real EPSG code.
- **Worse, and decisively:** *the accuracy goes down.* **DERIVED** (Snyder's point-scale series for
  the transverse Mercator, `k₀ = 0.9996`):

| latitude | k at central meridian | at 1.5° | at 3° (zone edge) |
|---|---|---|---|
| 0° | −400 ppm | −55 | +981 |
| 33.4° | −400 | −160 | +560 |
| 45° | −400 | −228 | +287 |
| 60° | −400 | −314 | −57 |

A Pythagorean length in UTM is wrong by **400 to 980 ppm** unless the user applies a combined factor
— and the elevation half of that factor is another **235 ppm at 1 500 m, 392 ppm at 2 500 m**
(**DERIVED**, `h/R`). Against `geodesicMeters()`'s **≤ 2 ppm at 10 km**, a UTM grid distance is two
to three orders of magnitude worse. State Plane is designed to 1:10 000 = 100 ppm and does no better
in practice once elevation is included. **The suite already measures better than the CRS an engineer
would reach for**, which is the finding worth carrying out of this section.

- **Worse, secondly:** a UTM frame is not conformal-with-a-uniform-scale in the way ours is *for
  tiles*. Web Mercator raster tiles are squares in a Web Mercator frame and nothing else; drawing in
  UTM means reprojecting every tile (a per-tile affine at best, a resample at worst). That is a large
  piece of work for a picture that is currently exact.
- **Worse, thirdly:** a zone is 6° wide. The mission scope is 300 km, which is 3.3° at Phoenix. A
  system can straddle a zone boundary, and then there is no single frame at all.
- **Migration cost against CLAUDE.md's rule:** this is where it becomes prohibitive. Storing UTM
  would make the file's numbers *ours*, not the user's — a `.inp` in DEGREES could no longer round
  trip byte-identically, because `λ → E,N → λ` is a transcendental round trip with the same 70%
  failure rate `mercY`/`mercLat` has. **The rule forbids it directly.** UTM could only ever be an
  *entry and display* format layered over lon/lat storage, which is §7 item 8 and is a UI feature,
  not a CRS change.

### 6.3 A local tangent plane (ENU about a project anchor)

This is what `js/lpn-georef.js` already is, frozen at one anchor latitude.

- **Better:** genuinely Euclidean; `hypot` is a distance; exactly invertible (which is why the
  georeferencing wizard uses it, and why it freezes the radii while `geodesicMeters()` does not).
- **Worse:** the error grows with distance from the anchor as `(d/R)²/6` for the plane itself, plus
  the `N/M` shape term that `georef-carry-harness.js` **MEASURES at 0.9953 at 33.4° and 0.9966 at
  45°** — which is precisely `M/N` from §2.2, arriving from the other direction. At 300 km from the
  anchor the tangent-plane term alone is `(300/6371)²/6 = 370 ppm`, worse than the mid-latitude
  formula's 67 ppm at the same distance, because a fixed tangent point is worse than a per-leg one.
- **Verdict:** correct for what it does (a two-point placement gesture that must be invertible),
  wrong as a document frame. Keep the split exactly where it is.

### 6.4 Summary

| | distance accuracy | tiles | file rule | shape | verdict |
|---|---|---|---|---|---|
| **today** (lon/lat stored, Mercator-degree frame, ellipsoidal geodesic lengths) | ≤ 2 ppm @ 10 km | exact | satisfied | `N/M` ≤ 0.67% | **keep** |
| EPSG:3857 metres | same | exact | new inexact round trip | same | no gain |
| UTM / State Plane | 400–980 ppm if Pythagorean | needs resampling | violated | better (0.04%) | no |
| local tangent plane | 370 ppm @ 300 km | needs resampling | violated | `N/M` | keep for georeferencing only |

---

## 7. Ranked: what to change, and the mathematics that justifies it

Candidates for Tom's judgement. **Nothing was added to `dev/ROADMAP.md`.** Items 1 and 3 overlap the
first report's list and are repeated only because this one supplies the formula; the rest are new.

**1. Ship the scale bar, evaluated at the view centre's latitude, with the 1-2-5 rule.**
*Justification:* §3.6's table. Every error in it is under 350 ppm except one, and that one —
measuring off the picture — is **198 000 ppm at 33.4°N**. It is 500 times larger than the worst
geodetic term and it is the only one a user can commit unaided. *Formula:* §5.3, six lines, OpenLayers'
1-2-5 growing from a 64 px minimum, evaluated at the view centre's latitude. *Three traps, all
**MEASURED** in §5.3:* a bar computed at a fixed latitude is worse than no bar, by `sec φ` (the OGC
says the same thing about zoom-level scale denominators being *"only accurate near the equator"*);
`DEG_PER_M` is a degree of latitude and is the wrong constant; and **Leaflet's `_getRoundNum` is
broken below 1 m/100 px**, which `maxScale()` reaches — it would print `1 m` on a 598 px bar.

**2. Correct the Sterbenz comment, and fix what it says the grid is FOR.**
*Justification:* §1.4. The inequality as written is empty for every western longitude; the hypothesis
genuinely fails for ~49% of coordinates near the prime meridian and near the equator; and byte
identity comes from the `_xsrc`/`_ysrc` guard, not from the lemma. Replace with: *the source-token
guard gives byte identity for untouched numbers unconditionally; the dyadic grid gives idempotence
for numbers we composed, where `sign(x) = sign(oₓ)` and `|oₓ|/2 ≤ |x| ≤ 2|oₓ|`; where that fails the
departure is bounded by `½ ulp(span)` ≈ 3 × 10⁻¹⁶° and reaches a fixed point after one save.*
*Cost:* comment only. *Benefit:* the next reader does not build a defence for a property that is
already guaranteed a better way, and does not panic when a Nairobi file fails the harness's
assertion.

**3. Clamp `maxScale()` by the model extent, and state it in ground metres per pixel.**
*Justification:* §4.4. At the mission scope the deepest permitted zoom is 36× past the float32 budget
and a symbol sits up to **28 px** from its pipe end. The clamp is one expression:

```js
    //  res_½ = span / 2^22 ; hold the display an order of magnitude short of it.
    maxScaleGeo = min( MAX_SCALE_GRID / DEG_PER_M ,  0.1 * Math.pow(2,22) / spanDegrees )
```

and the honest bound to publish is `res ≥ span/2²²`, which is latitude-free (§4.3). Also folds in the
first report's §3.6: `500 / (1/111132)` means nothing to any reader, and is latitude-dependent in
ground terms by a factor of 2 between Quito and Oslo (**MEASURED**, §4 table: 499 px/m at the equator
against 996 at 60°N).

**4. Re-derive the geographic origin when the live document grows past it.**
*Justification:* §4.3's `res_½ = C_g/2²²` is a function of the **current** coordinate magnitude, and
`rebaseGeoDocument()` runs at load only. Draw in California, pan to Kenya, draw again: `C` goes from
0.3° to 157°, and `res_½` degrades by a factor of 500 — from 6 mm/px to 3 m/px, which is *inside* the
working zoom range. It self-heals on reload, which is the worst possible failure signature. The
machinery exists (`rebaseLiveGeoDoc()`, which already compensates `state.tx/ty`); the work is the
trigger. *A trigger falls out of the mathematics:* rebase when `max|x| > 8 × span`, i.e. when the
origin has stopped being near the model.

**5. Teach `mercator-harness.js` §7 the ellipsoid, or say what it is actually checking.**
*Justification:* §2.3. As written it compares a spherical projection against a spherical ground
truth, so its `1.00000` is an identity and its `0.2%` tolerance guards nothing — the real residual is
`N/M`, which is **0.674% at the equator** and would fail that tolerance. Either define the E–W ground
step as `dLat · M/(N cos φ)` and assert `|ratio − 1| < 0.007`, or leave the spherical check and add a
second one that prints `N/M` by latitude. Both are a few lines. *Benefit:* the repository stops
holding a measurement that cannot fail.

**6. Scope `geo-precision-harness.js`'s exactness assertion, or add the two fixtures that break it.**
*Justification:* §1.4's table. *"shifting a coordinate to the origin and back is EXACT — worst
departure 0"* is a true statement about Novato and a false one about Nairobi. Add a
prime-meridian fixture and an equatorial one and assert the picometre bound; the harness then
documents the real property instead of a coincidence of its site.

**7. Say, in the property popup, that an automatic length is a plan length.**
*Justification:* §3.6. `√(1+m²) − 1` is **0.045% at 3% grade, 1.12% at 15%, 4.40% at 30%** — larger
than every geodetic term in this document, on exactly the terrain where a user is most likely to let
`lenAuto` stand. One sentence in `lpn_link_length_tip`; the override already exists. This is the
cheapest real accuracy improvement available.

**8. Typed projected-coordinate ENTRY, never projected STORAGE.**
*Justification:* §6.2. A UTM/State Plane *frame* is forbidden by the file rule and is less accurate
than what we have. A UTM/State Plane *entry and display* field is neither — it converts on the way in
and on the way out and stores lon/lat, exactly as the unit system already does with feet. Large, and
not yet worth it; recorded so the distinction is not lost the next time somebody proposes "support
State Plane".

**9. Record the areal budget before anybody computes an area.**
*Justification:* §3.7. `sec²φ` — ×1.43 at Phoenix, ×4.00 at 60°. Nothing computes an area today,
which is the only reason this is item 9 and not item 1. The rule is the one `len` already follows:
compute it from the stored lon/lat on the ellipsoid, never from the frame.

**10. State the CRS.** Unchanged from the first report's item 7, and this report adds only that the
frame is **EPSG:3857 with a linear unit of `a·π/180` metres**, which is a sentence a GIS reader can
act on and which nothing in the tree currently says.

---

## 8. Where the code or its comments are wrong

Only findings this report establishes. The first report's §6 table also stands; two of its rows
(the basemap header and the tile `<image>`) were **corrected in the tree on 2026-09-11** and are not
repeated here.

| Where | What it says | What the mathematics says |
|---|---|---|
| `js/looped-network.js` ~17005 | *"Sterbenz gives it: `x - ox` is exact whenever `ox/2 <= x <= 2*ox`, which holds for any origin chosen near the model"* | The inequality is empty for a negative longitude, and the correct magnitude form **genuinely fails** for 48.8% of x near the prime meridian and 49.1% of y near the equator (§1.4). "Holds for any origin chosen near the model" is the error: what is needed is the model near the origin *relative to the origin's magnitude* |
| `js/looped-network.js` ~16995 | *"THE GRID IS A POWER OF TWO AND THAT IS THE WHOLE OF WHY THIS IS ALLOWED"* | It is not. Byte identity for the user's numbers comes from the `_xsrc`/`_ysrc` guard, which recomputes the same expression and needs no exactness at all (§1.3). The grid's real job is idempotence for numbers we composed, and even there the failure costs 1.4 × 10⁻¹⁷° and converges after one save |
| `dev/lpn-spike/geo-precision-harness.js` §2 | *"shifting a coordinate to the origin and back is EXACT, not merely close — worst departure 0"* | True at Novato; false at any site near the prime meridian or the equator (§1.4 table) |
| `dev/lpn-spike/mercator-harness.js` §7 | *"a square on the ground is drawn square, to 0.2% — drawn aspect 1.00000"* | It defines the ground square spherically, so the ratio is 1 by construction. The ellipsoidal residual is `N/M`, **0.674% at the equator**, which would fail the stated 0.2% (§2.3) |
| `js/looped-network.js` ~8113 | *"The multiplier is the honest conversion: metres per degree of latitude, which is what makes GEO_MIN/GEO_MAX mean the same PHYSICAL span as the grid pair does in metres"* | A drawing degree is a degree of **longitude**, so the bound is latitude-dependent: 499 screen px per ground metre at the equator against 996 at 60°N (§4.4). Still open; the first report raised it and this one supplies the replacement bound in §7 item 3 |
| `js/lpn-geom.js` ~line 38 | haversine *"is wrong by up to ~0.5%, which is 5 m in a kilometre"* | Correct in order and conservative: **MEASURED at 2 557 ppm (2.6 m/km) at 33.4°N**, and the important half is not in the comment — haversine's error is a **floor**, present on a 30 m lateral, not a penalty that grows with length (§3.5) |
| `js/lpn-geom.js` ~line 45 | geodesicMeters *"degrades over CONTINENTAL distances"* | Understated. **MEASURED**: it does not reach 0.1% until a single leg is 498 km even at 60°N, and 1 938 km at the equator (§3.4). "Degrades over continental distances" reads as a caution where the number is a licence |

---

## 9. Sources

Primary where one exists. Everything below was read, not remembered; where a document could not be
retrieved that is said. Sources already in `dev/map-coordinate-review.md` §7 are repeated only where
this report leans on a different part of them.

**Projection mathematics**

- Snyder, J. P. (1987), *Map Projections — A Working Manual*, USGS Professional Paper 1395,
  doi:10.3133/pp1395. https://pubs.usgs.gov/pp/1395/report.pdf — Ch. 7 "Mercator Projection",
  pp. 38–47. Spherical forward **(7-1)**, **(7-2)**, **(7-2a)** on p. 41; spherical scale factor
  **(7-3)** `h = k = sec φ, ω = 0` and *"The areal scale factor for conformal projections is k² or
  sec²φ"* on p. 44; spherical inverse **(7-4)**/**(7-4a)**/**(7-5)**; ellipsoidal forward **(7-6)**,
  **(7-7)** and the conformal ellipsoidal scale factor **(7-8)** `h = k = (1 − e²sin²φ)^½/cos φ`,
  also p. 44. The sentence that anticipates EPSG:3857 by nineteen years is on p. 46: *"The spherical
  projection is not conformal with respect to the ellipsoidal Earth…"*
- EPSG Registry, **EPSG:3857 WGS 84 / Pseudo-Mercator** —
  https://epsg.org/crs_3857/WGS-84-Pseudo-Mercator.html (the host rejects generic fetchers; mirrored
  at https://epsg.io/3857). Remarks: *"Not a recognised geodetic system. Uses spherical development
  of ellipsoidal coordinates. Relative to WGS 84 / World Mercator (CRS code 3395) gives errors of
  0.7 percent in scale and differences in northing of up to 43km in the map (21km on the ground)."*
  Scope: *"Web mapping and visualisation."* (*"Should not be used for spatial analysis"* is a
  paraphrase in circulation and is **not** EPSG's wording.)
- EPSG coordinate operation **method 1024, "Popular Visualisation Pseudo Mercator"** —
  https://epsg.org/coord-operation-method_1024/Popular-Visualisation-Pseudo-Mercator.html :
  *"Applies spherical formulas to the ellipsoid. As such does not have the properties of a true
  Mercator projection."*
- IOGP, *Geomatics Guidance Note 7-2* (Publication 373-7-2), §3.2.1.2 —
  https://www.iogp.org/wp-content/uploads/2019/09/373-07-02.pdf : *"this method is not conformal:
  scale factor varies as a function of azimuth, which creates angular distortion"*, with the worked
  example `h = 1.1034264`, `k = 1.0972914` used as the independent check in §2.2
- NGA Office of Geomatics (Rollins & Paniccia), *NGA's Position on "Web-Mercator"*, ESRI Users
  Conference, 22 July 2015 — https://www.sedris.org/wg8home/Documents/WG80605.pdf . **Cite this
  briefing, not the standard**: `NGA.SIG.0011_1.0_WEBMERC` (2014) is no longer retrievable at any
  NGA URL
- OGC 07-057r7, *Web Map Tile Service 1.0.0*, Annex E.4 `GoogleMapsCompatible` —
  https://docs.ogc.org/is/07-057r7/07-057r7.pdf : *"Scale denominator is only accurate near the
  equator."*
- Zinn, N. (2010), *Web Mercator: Non-Conformal, Non-Mercator*, GIS in the Rockies (**trade
  presentation, not authoritative**, cited only because it independently reproduces the northing
  table) — https://www.hydrometronics.com/downloads/Web%20Mercator%20-%20Non-Conformal,%20Non-Mercator%20(notes).pdf

**Geodesy**

- Karney, C. F. F. (2013), *Algorithms for geodesics*, J. Geodesy 87(1), 43–55,
  doi:10.1007/s00190-012-0578-z. https://arxiv.org/abs/1109.4448 ; GeographicLib,
  https://geographiclib.sourceforge.io/ . **The 15 nm accuracy figure is in §7 of the paper, not the
  abstract**; GeographicLib's docs give the comparison, *"less than 15 nanometers, compared to
  0.1 mm for Vincenty"*. Also the reference for polygon area on the ellipsoid (§3.7)
- Vincenty, T. (1975), *Direct and Inverse Solutions of Geodesics on the Ellipsoid with Application
  of Nested Equations*. https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf — both formulae were written
  out from this paper for every measurement in §3
- **FCC, 47 CFR § 73.208(c)** — the codified mid-latitude flat-Earth distance formula and its
  stated validity limit, *"valid only for distances not exceeding 475 km (295 miles)"*.
  https://www.ecfr.gov/current/title-47/chapter-I/subchapter-C/part-73/subpart-B/section-73.208 .
  **No published ERROR bound for this construction was found** in Karney, in GeographicLib or in the
  standard references; the 475 km is a regulatory acceptance threshold, which is why §3.3–3.4 are
  measured here rather than cited
- NOAA/NGS Special Publication NOS NGS 13, *The State Plane Coordinate System*.
  https://geodesy.noaa.gov/library/pdfs/SP_NOS_NGS_13.pdf

**Web mapping practice**

- Google Maps Platform, *Coordinates* —
  https://developers.google.com/maps/documentation/javascript/coordinates : *"Because the basic
  Mercator Google Maps tile is 256 x 256 pixels, the usable world coordinate space is {0-256},
  {0-256}"*, `pixelCoordinate = worldCoordinate * 2^zoomLevel`, and the ±85° cutoff *"to make the
  resulting map shape square"*. The projection itself is only in the sample,
  https://developers.google.com/maps/documentation/javascript/examples/map-coordinates , and is
  Snyder (7-2a). **Google documents no scale-control algorithm and no Mercator distortion caveat
  anywhere** — a verified absence, not a gap in the search
- OpenLayers `ScaleLine` — https://github.com/openlayers/openlayers/blob/main/src/ol/control/ScaleLine.js
  (`LEADING_DIGITS = [1, 2, 5]`, `minWidth = 64`, `DEFAULT_DPI = 25.4 / 0.28`) and the EPSG:3857
  point-resolution override `resolution / Math.cosh(point[1] / RADIUS)` in
  https://github.com/openlayers/openlayers/blob/main/src/ol/proj/epsg3857.js . Class doc: *"calculated
  for the center of the viewport. For conformal projections… the scale is valid for all directions"*
- Leaflet `ScaleControl` — https://github.com/Leaflet/Leaflet/blob/main/src/control/ScaleControl.js
  (v2 path; identical algorithm at the v1.9.4 path
  https://github.com/Leaflet/Leaflet/blob/v1.9.4/src/control/Control.Scale.js ). `_getRoundNum`'s
  10/5/3/2/1 sequence and its sub-1 degeneracy; `maxWidth = 100`; measured `[0, y]`→`[maxWidth, y]`
  at `y = height/2`; `L.CRS.Earth.distance` is haversine on `R = 6371000`
- MapLibre GL JS `ScaleControl` —
  https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/control/scale_control.ts (centre ± 50 px,
  and `getDecimalRoundNum`, the patch for Leaflet's sub-1 case)
- Mapbox Vector Tile Specification 2.1 — https://github.com/mapbox/vector-tile-spec/tree/master/2.1 :
  *"Coordinates within a geometry MUST be integers"*, `extent` default 4096, and *"A Vector Tile
  SHOULD NOT contain information about its bounds and projection."*
- MapLibre `EXTENT = 8192` and why —
  https://github.com/maplibre/maplibre-gl-js/blob/main/src/data/extent.ts : *"Vertex buffer store
  positions as signed 16 bit integers… This leaves us with 2^13 = 8192"*
- deck.gl, *Coordinate Systems* — https://deck.gl/docs/developer-guide/coordinate-systems :
  *"To compensate for the lack of 64-bit floats in WebGL2/WebGPU, deck.gl may apply a dynamic
  translation to common-space positions, determined by the viewport"*; the mechanism in
  https://github.com/visgl/deck.gl/blob/master/modules/core/src/shaderlib/project/viewport-uniforms.ts
  (`WEB_MERCATOR_AUTO_OFFSET`, origin snapped with `Math.fround`); the removal of `fp64` in v8 in
  https://github.com/visgl/deck.gl/blob/master/docs/upgrade-guide.md . (deck.gl's own quantified
  offset-accuracy page is a **dead link** and no replacement was found.)
- Mapbox GL JS, maintainer-acknowledged high-zoom precision issues (**not documentation**):
  https://github.com/mapbox/mapbox-gl-js/issues/1733 , https://github.com/mapbox/mapbox-gl-js/issues/8709

**Floating point**

- Skia, `typedef float SkScalar;` — https://github.com/google/skia/blob/main/include/core/SkScalar.h ;
  `SkPoint` is documented as *"two 32-bit floating point coordinates"*,
  https://github.com/google/skia/blob/main/include/core/SkPoint.h ; Skia is Chromium's 2D backend,
  https://www.chromium.org/developers/design-documents/graphics-and-skia/
- Muller et al., *Handbook of Floating-Point Arithmetic*, 2nd ed. (2018), Lemma 4.1 (Sterbenz);
  summary at https://en.wikipedia.org/wiki/Sterbenz_lemma
- Goldberg, D. (1991), *What Every Computer Scientist Should Know About Floating-Point Arithmetic*.
  https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html

**Data on the web**

- W3C/OGC, *Spatial Data on the Web Best Practices*, **W3C Group Draft Note, 19 September 2023**
  (OGC 15-107) — https://www.w3.org/TR/sdw-bp/ . **BP 7** *"Choose coordinate reference systems to
  suit your user's applications"*, **BP 8** *"State how coordinate values are encoded"*, **BP 14**
  *"Support requesting and returning geometries in a specific CRS"*. BP 7 carries its own Web
  Mercator caveat: *"the geodetic datum used by Web Mercator is spherical and not true to the shape
  of the earth. At high latitudes, this results in positional differences of up to 20 kilometers
  when compared with WGS 84."* **This supersedes the 2017 Working Group Note** (still live as a
  dated snapshot at https://www.w3.org/TR/2017/NOTE-sdw-bp-20170928/), which had a different
  numbering — say which version when citing a BP number

---

## 10. Probes and harnesses run for this report

Everything read-only. Nothing shipped was edited.

| Ran | Established |
|---|---|
| `dev/lpn-spike/mercator-harness.js` | Passes on HEAD; §7's aspect check is the spherical identity (§2.3) |
| `dev/lpn-spike/geo-precision-harness.js` | Passes on HEAD; its exactness assertion is site-scoped (§1.4) |
| probe — anisotropy | `N/M` by latitude; ground metres per drawing degree on both axes (§2.2) |
| probe — geodesy | Vincenty direct + inverse written from the published formulae; the bearing × length × latitude sweep, the 0.1/0.5/1% thresholds, and the haversine comparison (§3.3–3.5) |
| probe — Sterbenz | 1.6 M origin round trips across eight sites; the two failing regimes and their magnitude; the two-save fixed point (§1.4) |
| probe — float32 | Bisection for `s_½` against coordinate magnitude; the `res_½ = C_g/2²²` law; worst on-screen error at `maxScale()` (§4) |
| probe — scale bar | Metres per pixel on both axes; viewport spread at six scales; the 1-2-5 and 1-2-3-5-10 sequences on four views (§5) |
| probe — projected CRS | The UTM point-scale series from Snyder, and the elevation reduction (§6.2) |
| probe — scale-bar libraries | OpenLayers' and Leaflet's rounding implemented faithfully from their own sources and run against this page's frame; the Leaflet sub-1 defect at `maxScale()` (§5.3) |
| probe — cross-checks against the literature | IOGP GN 7-2's worked `h`, `k` reproduced to 6 ppm by `h/k = N/M`; the FCC § 73.208 series against our `M`, `N` to 64 ppm; EPSG's "43 km in the map / 21 km on the ground" reproduced at 42 633 m and 21 373 m (§2.2, §3.1, §6.1) |

The probe scripts were throwaway and were written to the session scratchpad, not to the tree; every
number above is reproducible from the algebra shown beside it.
