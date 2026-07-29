# Phase 0 canvas spike — acceptance criteria (written before testing)

Per ROADMAP Task 146. `canvas-spike.html` is a standalone SVG DOM spike (`createElementNS`, no
`innerHTML` rebuild), throwaway, no PHP/lang keys/solver/persistence.

## Pass conditions

1. Drag is visually smooth at ~20 nodes **on a real mid-range phone**. *(Needs an actual device —
   not verifiable from this environment. Open the file on a phone browser and drag a node while
   watching the fps counter; target is a steady number close to the display refresh rate, no visible
   stutter.)*
2. The 200-node grid (toggle button) degrades gracefully rather than freezing the tab.
3. Pinch zoom works on iOS Safari and Android Chrome without fighting page scroll. *(`touch-action:
   none` is set on `#canvas`; needs on-device confirmation.)*
4. A 2 px link is finger-tappable. *(Links use `stroke-width:2` in world units at the built scale —
   confirm the rendered stroke is comfortably tappable on a real touchscreen, not just clickable with
   a mouse.)*
5. Arabic and Amharic labels shape and order correctly; neither label mirrors the network geometry.
6. Print preview is crisp vector output (SVG stays SVG through `window.print()`, not rasterized).
7. ≤300 LOC.

## What this build demonstrates (desktop-verified, Chromium)

- Pan (drag on empty canvas), wheel zoom about the cursor, zoom-extent button.
- Node drag with incident links (straight and vertex-bent) following live.
- One link vertex handle, draggable independently of its endpoints.
- Click-to-popup on a node with an Elevation field that writes back and re-renders the node label.
- A draggable label with a leader line, independent of its anchor node — one in Arabic
  ("خزان (reservoir)"), one in Amharic ("መስቀለኛ መንገድ (junction)").
- A registered backdrop image: file input, two-point click registration, typed real distance sets
  image scale — the bar-scale-screenshot workflow from the scope doc's Backdrop section.
- A 200-node grid behind a toggle, kept in its own hidden `<g>` so it costs nothing until shown.
- An fps counter (rAF-based, counts real pointermove frames) for the on-device check in #1.

## What still needs a real device before Phase 0 can be called closed

Items 1, 3, 4 above are UI/perf claims a desktop browser can't validate. Test on: one iOS Safari
device, one mid-range Android Chrome device. If any of the four device-dependent criteria fail,
the ROADMAP entry's fallback applies: spike the identical scenarios on Leaflet + `CRS.Simple` and
compare artifacts before committing to a canvas technology.

## LOC count

`wc -l canvas-spike.html` — see file; body script is the number that matters for the ≤300 gate
(markup/CSS scaffolding is not the risky part).
