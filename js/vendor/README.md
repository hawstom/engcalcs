# Vendored third-party code

Everything this site loads comes from this site. There is no CDN, no hosted font, and no
third-party **code** of any kind (ROADMAP Tasks 286 and 287). Adding a `<script src="https://…">`
anywhere would make privacy.php false.

**One exception exists, and it is DATA rather than code:** the Looped Pipe Network calculator
fetches map tiles from OpenStreetMap and, for satellite imagery, from Mapbox (Task 452) — but only
on a lat/lon project and only while the user has the basemap switched on. Tiles are pictures
fetched at run time, which is a different risk from executing somebody else's JavaScript, and
privacy.php now says so in its own section rather than claiming there is no third-party request at
all. **That sentence used to claim exactly that, and had been false since the basemap shipped.**
If you add another remote fetch of any kind, that section is what you must update.

## bootstrap 5.3.2 (MIT)

`../../css/vendor/bootstrap.min.css` and `bootstrap.bundle.min.js`, © 2011-2023 The Bootstrap
Authors, MIT — GPL-3-compatible, and the licence header is preserved inside both minified files.

Vendored 2026-08-12 from jsDelivr, and **verified rather than trusted**: the sha384 digest of each
file matches the SRI hash the old `<link>`/`<script>` tags carried, so these are byte-identical to
what visitors were already being served. Re-verify the same way on any upgrade:

    openssl dgst -sha384 -binary css/vendor/bootstrap.min.css | openssl base64 -A

Upgrading also means bumping `CACHE_VERSION` in `sw.js`, or returning visitors keep the old copy.

## epanet-js 0.9.0 (MIT)

`epanet-js.js` and `slim/index.js` are epanet-js 0.9.0, MIT licensed, © Luke Butler, wrapping
the OWA-EPANET engine (also MIT). Full licence text: `epanet-js.LICENSE`. MIT is
GPL-3-compatible, so EngCalcs remains GPL v3 or later; the licence file must ship with any
redistribution.

### Which EPANET that is (ROADMAP Task 451)

**The engine inside the wrapper is OWA-EPANET 2.3.5, released 2025-02-20.** The run report prints
it as `2.3.05` — the engine encodes its version as major.minor.patch with a two-digit patch — and
that number reads like a fabrication beside EPA's own download page, which still offers 2.2.0.
It is not one: EPANET development moved to **Open Water Analytics**, a community and EPA
collaboration, after EPA's 2.2.0 of December 2019; OWA released 2.3 in July 2024 and 2.3.5 on
2025-02-20. The user-facing half of this is a Notes entry on the page itself
(`lpn_notes_engine_term` / `_def`), because it is the provenance question anyone comparing us
against EPANET asks first.

**Name collision, because it caused real confusion when this was scoped:** the *web app* at
epanetjs.com is FSL-1.1-MIT — not FLOSS today, MIT after two years. This is the separate MIT
**toolkit**. We use the toolkit and have never read the app's source.

## Two deliberate changes from the published package

1. **`.mjs` → `.js`.** Browsers decide a file is a module from the `import` statement and the
   `type="module"` context, never from the extension — but a *server* has to send a JavaScript
   MIME type, and plenty of shared hosts (this one included, historically) do not know `.mjs`
   and send `text/plain`, which browsers hard-refuse. Renaming removes the dependency on server
   config entirely. This is the same reasoning that chose the WASM-embedded build over one with
   a separate `.wasm`: no MIME configuration, nothing to get wrong at deploy time.
2. **One import specifier** inside `epanet-js.js`, `"./slim/index.mjs"` → `"./slim/index.js"`,
   which is forced by (1). Nothing else in the vendored code is modified.

## Upgrading

`npm pack epanet-js`, then copy `dist/index.mjs` → `epanet-js.js` and `dist/slim/index.mjs` →
`slim/index.js`, redo the one specifier edit above, and run
`node dev/lpn-spike/validate_epanet.js` — it must stay 8/8. Do **not** take `dist/engines/`:
the default build already embeds the engine, which is what keeps this to two files.
