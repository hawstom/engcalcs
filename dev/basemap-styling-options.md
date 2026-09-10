# Can we style the OpenStreetMap basemap?

Written 2026-09-09, answering Tom's *"I wonder if there is a way to style OpenStreetMap."* Research
only; nothing here is implemented, and none of it touches `js/looped-network.js` yet.

**Short answer: yes, three ways, and they differ in price by two orders of magnitude. Start with a
CSS filter on the tiles we already fetch. Do not vendor a vector-tile engine.**

## 1. What we draw today

`LPN_TILE_SOURCES` in `js/looped-network.js` has exactly two entries:

    osm:       https://tile.openstreetmap.org/{z}/{x}/{y}.png
    satellite: https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=...

Both 256 px, both off by default, both credited, neither cached by us, and both under
`LPN_TILE_BUDGET = 192` requests per refresh so a viewport is never bulk downloading.

## 2. The rule that prices every option

A NEW third-party host is a new PURPOSE, and a purpose costs: its own consent gate cookie with its
own version constant (the shape of `ec_geosearch` and `ec_terrain`), its own `wipeAllStorage()`
hook, its own paragraph in `privacy.php`, its own row in `dev/cookie-storage-inventory.md`, and the
count "four third-party requests" becoming five in three files at once —
`third_party_request_check.php` fails the build until all three agree. **`consent_body` is NOT
touched**; each feature asks its own question.

In strings: a consent prompt, a menu row label and tip, and a sentence of explanation is roughly
**5 new English keys, so ~130 translated strings** — one Sonnet sprint batch. Small by this repo's
standards, but it is paid agent work and Tom's authorization, not a free change.

## 3. The options, cheapest first

### (a) A CSS filter on the tiles we already fetch — free

The basemap is drawn under the network as tile images. A `filter:` on that layer
(`grayscale(60%) brightness(1.05) contrast(0.9)`, or the well-worn dark-mode recipe
`invert(1) hue-rotate(180deg)`) is a display-time transform in the visitor's browser. Nothing new
is fetched, nothing is cached, nothing is redistributed, and the attribution line is separate DOM
that a filter on the tile layer beneath it does not touch — mute the map without muting the credit.

**No new host, no new gate, no `privacy.php` paragraph, no new language keys** unless it becomes a
user-facing toggle rather than a fixed style.

On the licence question I looked for an authority saying a CSS filter makes a derivative work and
**found none either way** — that is a result, not an omission. The OSMF tile usage policy's concerns
are serving, caching, bulk downloading and visible attribution; a filter changes none of them. The
likely reading is that this is fine, with the caveat that nothing says so explicitly.

**This is the option that actually answers the question as asked**, if the goal is "make the
basemap recede behind the network."

### (b) A Mapbox Studio raster style, on the token we already have — cheap

`https://api.mapbox.com/styles/v1/{user}/{style}/tiles/{size}/{z}/{x}/{y}?access_token=...` is the
**same host** we already declare for satellite and terrain, and a Mapbox basemap is itself built
from OSM data and credited as such. 6,000 requests/minute default limit; 256, 512 or 1024 px;
designing the style in Studio costs nothing beyond the account we have.

The honest reading of `third_party_request_check.php`'s own `'why'` fields is that a styled street
basemap tells Mapbox **exactly what the satellite tiles already tell it** — which tile the visitor
is looking at. So it is a peer of the existing satellite row under the existing `basemapOn` toggle,
not a fifth purpose: no new gate, no new consent cookie, no `privacy.php` paragraph. What it does
cost is a widened description of the `mapbox_satellite` purpose in three files, and ~2-3 new keys
for the menu row.

Worth doing if (a) is not enough — for instance if Tom wants the water features emphasized or the
labels toned to the suite's own palette. The style design itself is editorial work, not engineering.

### (c) A different raster host — not recommended

Every one of these is a NEW host and therefore the full §2 price, for cartography no better than
what (b) buys for less. Terms as of 2026-09-09:

| Service | Cartography | Key? | Terms |
|---|---|---|---|
| **OpenTopoMap** | topographic, contours, hillshade | none | Free, but the project has said its public server is in "survival mode" and will stop serving above z13. Not something to build a shipped feature on |
| **CyclOSM** | cycling-oriented | none | Free, OSM + "CyclOSM & OSM-FR" credit. One volunteer host, fair use, no SLA |
| **Humanitarian (HOT)** | high-contrast, OSM France | none | Same shape as CyclOSM: free, thin, fair-use only |
| **Stamen (Toner / Terrain / Watercolor)** | the distinctive ones | **yes, now** | Migrated to Stadia Maps 2023-07-31. Unauthenticated free Stamen tiles no longer exist; free tier is account-gated and non-commercial, commercial from ~$20/month |
| **CARTO (Positron / Voyager / Dark Matter)** | clean muted basemaps | **yes** | "© OpenStreetMap, © CARTO" on every map; free under a 5M tile-request/month fair-use ceiling, non-commercial framing |
| **Thunderforest** (Atlas, Outdoors, Landscape, Transport) | several named styles | **yes, every request** | Both "Thunderforest" and "OpenStreetMap contributors" required, key required even on the free Hobby tier |
| **MapTiler** | several styles, raster export | **yes** | 100k requests + 5k map sessions/month free, non-commercial framing |
| **Esri World Gray Canvas / World Imagery** | muted grayscale reference / satellite | ArcGIS licence | **Not free for the general case.** Wrong category for this suite |

The recurring problem with the keyed free tiers is not the key — it is that every one of them frames
its free tier as non-commercial and reserves the right to classify a given use. Nobody here has
asked any of them whether a free, GPL, publicly reachable engineering tool qualifies, and that
question would have to be asked and answered before shipping, not after.

### (d) Vector tiles + MapLibre GL JS — not worth it

- ~750 KB gzipped for the full API, ~210 KB trimmed to `Map` + `NavigationControl`, plus CSS. That
  is a second EPANET-engine-sized payload, for a basemap feature, in a suite whose stated
  differentiator is that it is small and works on a thin connection.
- It renders through WebGL — a new failure mode (locked-down browsers, policy-disabled WebGL) that
  raster tiles do not have.
- It is actively maintained, so vendoring it under `vendor_integrity_check.php` commits us to an
  update cadence, unlike the largely static EPANET engine.
- **The real blocker is the viewport.** `js/looped-network.js` owns pan, zoom and the Web Mercator
  projection through `js/lpn-geom.js`, and CLAUDE.md's geographic rules say there is one opinion
  about Mercator on purpose. MapLibre is a second WebGL canvas with its OWN pan/zoom/projection
  state that would have to be driven in lockstep. Today's raster tile is just a positioned image the
  editor's own transform draws over, which is why it costs nothing.

## 4. Recommendation

1. **Do (a).** A muted CSS filter on the existing OSM layer, free, no new anything. If Tom wants it
   optional rather than fixed, that is one browser-side preference and a label.
2. **Consider (b)** only if (a) is not enough. Cheap, same host, no new gate — but it needs somebody
   to actually design a style in Mapbox Studio, and it widens a purpose description in three files.
3. **Skip (c).** New host, new gate, ~130 translated strings, an unasked licensing question, for no
   cartography (b) does not already reach.
4. **Skip (d).** Said plainly: not worth it.
