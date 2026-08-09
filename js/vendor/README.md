# Vendored: epanet-js 0.9.0 (MIT)

`epanet-js.js` and `slim/index.js` are epanet-js 0.9.0, MIT licensed, © Luke Butler, wrapping
the OWA-EPANET engine (also MIT). Full licence text: `epanet-js.LICENSE`. MIT is
GPL-3-compatible, so EngCalcs remains GPL v3 or later; the licence file must ship with any
redistribution.

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
