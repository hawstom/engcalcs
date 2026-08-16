# Cheap filmstrip-GIF recipe for Help-menu docs

Handoff record for ROADMAP Task 178, written 2026-07-30 so a future session does not re-derive the
trial-and-error. A proof of concept (drag-a-label-and-reset; add/drag/delete-a-vertex) showed this is
genuinely cheap to produce once set up. **The fiddly part is precise SVG click targeting, not GIF
assembly.** The POC GIFs and driver script were not committed — they lived in a session scratchpad —
so this file is the deliverable, and a real Help-menu asset (e.g. the add-pipe / add-junction
workflow) is still to be built from it.

## 1. Dev server

`hawsedc.local` is Tom's own reliable local dev server — use it directly
(`http://hawsedc.local/engcalcs/<page>.php`) rather than guessing a docroot and port.

In a sandboxed agent container `hawsedc.local` may not resolve via `/etc/hosts` — it can point at a
docker gateway IP unreachable from inside the sandbox. If so, launch Chromium with
`--host-resolver-rules=MAP hawsedc.local 127.0.0.1`. (`127.0.0.1` was confirmed to reach the real
Apache vhost by Host header, via `curl -H "Host: hawsedc.local"`.) Do **not** edit `/etc/hosts` — that
needs root, which this environment does not have non-interactively.

## 2. Drive it with Playwright + headless Chromium

Not a hand-rolled CDP client. `npm install playwright`, then `npx playwright install chromium`.

**No `--with-deps`** — that needs passwordless `sudo`, which this environment does not have. The plain
chromium download works without it, and was already cached at `~/.cache/ms-playwright`.

## 3. Click targeting is the real difficulty

A bounding-box CENTER on a multi-line `<text>` or a thin polyline routinely misses the actual painted
pixels — an inter-line gap, or empty space beside a 0.5-world-unit stroke. `elementFromPoint()` then
returns some unrelated element (or the page background) and the click silently no-ops.

- **For paths (pipes, links):** use `element.getPointAtLength(totalLength * frac)` transformed through
  `getScreenCTM()`, for a point guaranteed to be on the path's own paint.
- **For a multi-line label:** `(bboxCenterX, bboxTop + smallOffset)` — the first line's own baseline —
  is far more reliable than the vertical center.
- **Verify blind.** Do not assume a `dblclick()` or a drag "worked" from the lack of a thrown error;
  re-read the actual DOM and bounding-box state after the action. That is what caught the label-reset
  click landing on the wrong element in the first POC pass.

## 4. GIF assembly, pure JS, no native dependencies

`gifencoder` and the `canvas` package need `node-gyp` plus system `cairo`, and failed to build in
this container. Use `npm install omggif pngjs quantize` instead:

- decode screenshots with `pngjs`;
- build **ONE shared color palette across all frames** with `quantize` — a per-frame palette flickers
  colors frame to frame;
- write frames with `omggif`'s `GifWriter`.

The delay unit is centiseconds: `100`–`200` for a 1–2 s/frame filmstrip, not a smooth-video rate.

## 5. Screenshot the canvas element directly

`page.locator('#lpn_canvas').screenshot()`, not the full viewport. The page's own chrome (toolbar,
unit row) pushes the SVG below the fold at a normal viewport height, and a full-page screenshot then
needs cropping anyway.
