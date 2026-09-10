# Interface designer — wish list

What this seat would build next, in its own order. **Expected to disagree with `dev/ROADMAP.md`**;
that disagreement is most of what a seat is for. No agent edits the roadmap.

1. **A hover colour/weight highlight on the currently-hit `lpn_` object in Select mode, additive to
   the existing cursor.** Small build (one `pointermove`-driven class on the existing hit-test, or
   a `:hover` rule if `:has()` support clears this suite's floor). Buys feedback the cursor
   deliberately cannot give here — `default` is identical over an object and over nothing by
   design (Task 618) — and is a real, named convention in AutoCAD (`SELECTIONPREVIEW`) and Figma
   ("Highlight layers on hover"), not a novelty. See journal, 2026-09-10.

2. **DONE 2026-09-10 -- Tom reversed his first answer once he saw what Ida had actually found.**
   *"Nice catch, Ida. Nice fit and finish."* The three marks are crosshairs now
   (`lib/Icons.lib.php`). His NO was to the general principle, not to this instance:
   *"vertex and everything else is not a place for depicting a cursor"* -- and these three are
   select-family, the one family whose subject IS a cursor. **The framing correction is his and it
   is the reusable part:** *"it's not the corners Ida noticed. It's a tiny cursor depiction."* What
   made it wrong was never where the mark sat; it was that a drawing of a cursor is a PROMISE about
   what the pointer will look like. Superseded text follows for the record.

   ~~CLOSED 2026-09-10 by Tom, answered NO.~~ **Ask Tom, not build: does the small corner arrow on `select-window`/`select-lasso`/
   `select-polygon` (`lib/Icons.lib.php:283,292-294`) promise `default`, or is it a generic
   "this is a mouse action" badge?** Their actual mode cursor is `crosshair`
   (`js/looped-network.js:16157-16159`; `css/engcalcs.css:1321`), which either needs the corner
   glyph repainted to a crosshair (cheap, a path edit, no translation cost — icons carry no
   language string) or needs nothing at all if the glyph was never meant to be read as a cursor
   preview. I could not settle which on my own; below the hover-highlight because it is
   cosmetic-precision, not a reported confusion. See journal, 2026-09-10.

3. **REJECTED 2026-09-10 BY TOM, and it is not to be re-proposed.** *"Pan tool: Strongly opposed.
   Simply unnecessary and wasted prime real estate. And not 2026-like."* Three separate objections
   and each one stands on its own: it is not NEEDED (dragging the empty map already pans, and that
   is the convention every web map ships with), it COSTS the scarcest thing the page has (a toolbar
   slot on a strip whose wrapping is already the reason it hides on a phone), and it is DATED --
   a modal Pan tool is a 1990s desktop idiom that direct manipulation replaced.
   - **Kept here rather than deleted, because it was reasoned to twice and would be reached again.**
     It arrived as the clean resolution of an icon-literalism tension: `select`'s icon depicts an
     arrow while Select mode also owns the pan gesture, so splitting the gesture onto its own tool
     would make the icon literally true. Photoshop's own Move/Hand separation is the precedent.
     **That reasoning is sound and the conclusion is still wrong**, because the tension it resolves
     is one nobody has reported as confusing and the cure costs more than the disease.
   - What Tom settled instead: the Select icon is a LABEL for the tool, not a pixel-exact promise
     about every cursor state, and `grab` on the bare map is correct because that is where nothing
     is being aimed at. See journal, 2026-09-10.

4. **Task 617 -- a basemap-style `<select>` in Settings > Map appearance, not a new on-canvas
   control.** Two options to start (`Full color` / `Muted`), same widget family as the legend-
   position rows already there, wired to a `filter:` on `.lpn-basemap`
   (`dev/basemap-styling-options.md`'s own free recipe). Zero canvas cost, zero risk to the
   non-dismissible OSM/Mapbox credit (separate DOM, checked directly). **Costed against Tom's own
   sketch of a lower-left expando, which I do not recommend as a first move**: `#lpn_map_footer`
   is already the busiest overlay on the page -- five widgets, already wraps on a narrow window,
   and the one strip `zoomExtent()` reserves canvas against -- so a sixth item there is a real tax
   on the drawing surface for a decision that is closer in kind to "where the legend sits" than to
   "click to pan." If a corner affordance is wanted later, extend the EXISTING satellite-teaser
   tile with a caret rather than adding a new independent widget next to it. See journal,
   2026-09-10.

*(The four-bar chrome diagnosis Tom's brief opens with — suite chrome, menus, toolbar, tab strip —
is still unstarted; this list will carry that ranking once it exists.)*
