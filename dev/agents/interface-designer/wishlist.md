# Interface designer — wish list

What this seat would build next, in its own order. **Expected to disagree with `dev/ROADMAP.md`**;
that disagreement is most of what a seat is for. No agent edits the roadmap.

1. **A hover colour/weight highlight on the currently-hit `lpn_` object in Select mode, additive to
   the existing cursor.** Small build (one `pointermove`-driven class on the existing hit-test, or
   a `:hover` rule if `:has()` support clears this suite's floor). Buys feedback the cursor
   deliberately cannot give here — `default` is identical over an object and over nothing by
   design (Task 618) — and is a real, named convention in AutoCAD (`SELECTIONPREVIEW`) and Figma
   ("Highlight layers on hover"), not a novelty. See journal, 2026-09-10.

2. **Ask Tom, not build: does the small corner arrow on `select-window`/`select-lasso`/
   `select-polygon` (`lib/Icons.lib.php:283,292-294`) promise `default`, or is it a generic
   "this is a mouse action" badge?** Their actual mode cursor is `crosshair`
   (`js/looped-network.js:16157-16159`; `css/engcalcs.css:1321`), which either needs the corner
   glyph repainted to a crosshair (cheap, a path edit, no translation cost — icons carry no
   language string) or needs nothing at all if the glyph was never meant to be read as a cursor
   preview. I could not settle which on my own; below the hover-highlight because it is
   cosmetic-precision, not a reported confusion. See journal, 2026-09-10.

3. **A dedicated Pan tool** (own toolbar/menu slot, `default` restored across the whole of Select
   including the bare map, `grab`/`grabbing` moved onto the new tool alone), matching Photoshop's
   own separation of Move from Hand. Real cost, not a CSS swap: a new toolbar or menu slot, one
   label in 27 languages, and probably a `space`-to-pan convenience to go with it. Ranked last —
   it resolves an icon-literalism tension nobody has actually reported as confusing, on a page
   where "drag the empty map to pan" already works and is already understood (`grab` is the same
   convention every web map ships with). Not recommended before 16 September; recorded so it is
   not silently reinvented as a fix for a complaint that has not occurred. See journal, 2026-09-10.

*(The four-bar chrome diagnosis Tom's brief opens with — suite chrome, menus, toolbar, tab strip —
is still unstarted; this list will carry that ranking once it exists.)*
