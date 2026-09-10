# Interface designer — journal

**You are IDA.** Tom named you on 2026-09-10 -- *"Ida is on the right track. Great new hire."* --
and he means it: the other four seats are Sue, Declan, Mary and Franco, and he addresses them by
name and expects to be understood. The directory name stays `interface-designer` because scripts
read it.

An invocation starts with no memory of any previous one. This file is the only continuity there
is. Every entry carries one provenance tag: CITED, OBSERVED or SPECULATION.

---

## 2026-09-09 — the seat was created and has not yet worked

OBSERVED (`dev/ROADMAP.md` Task 616, `dev/session-handoff.md`): hired the day two real users in a
row failed to see the menu bar, and a third read it as belonging to the site rather than to the
application. Nothing has been diagnosed yet. The standing brief is in `.claude/agents/interface-designer.md`
and the first task is a reading of the four bars of chrome, not a redesign.

---

## 2026-09-10 — the Select-mode cursor question (first work done, not the chrome brief)

Tom named me directly and asked one narrower question before the chrome diagnosis: what cursor
should `lpn_` show in Select mode. He posed four candidates himself and half-argued each. This
entry answers that question only; the four-bar chrome diagnosis is still unstarted.

**WHAT IS ALREADY SHIPPED, so the four candidates are read against the real thing, not a blank
page.** OBSERVED `css/engcalcs.css:359` (bare canvas `cursor: grab`), `:378` (`.lpn-panning` →
`grabbing`), `:555` `.lpn-link { cursor: default }`, `:597` `.lpn-vhandle { cursor: default }`,
`:1043` `.lpn-draglbl { cursor: default }` (Tom, 2026-09-09, quoted at `:642-643`: *"I prefer
default over pointer at the labels and assets. It's more precise."*), `:1321`
`.lpn-placemode * { cursor: crosshair }`, `:615/618` vertices-mode grip bands `crosshair`. So the
shipped state is already a hybrid: **`grab` on bare map, `default` on every selectable object,
`crosshair` on every placement/edit tool.** None of his four candidates is being weighed against a
blank slate — three of the four ask to move OFF a position Tom himself dictated one day earlier,
for a stated reason (precision), on the record.

### Finding: his "matches the menus" premise is false, checked against the file

He offered `default`-everywhere as agreeing with the menu bar. It does not. OBSERVED
`css/engcalcs.css:1241` `.lpn-menubar-item { cursor: pointer }`, `:1263`/`:1265` tab buttons
`cursor: pointer`, `:1124` toolbar buttons `cursor: pointer`, `:1157` transport buttons
`cursor: pointer`, `:1286` `.lpn-menu-row { cursor: pointer }`. **Every piece of app chrome on this
page already uses the hand-pointer, not the arrow.** So "default agrees with the menu" is not a
fact about this codebase — the only place `default` is used at all is the three canvas-object
rules he personally ordered in on 2026-09-09, precisely because chrome buttons are big and forgiving
(no aiming problem) while a 7 px junction disc is not (an aiming problem `pointer`'s glyph makes
worse). The two contexts want different cursors for the same reason they want different tap
targets, and that is a correct inconsistency, not an accidental one. Worth saying to him directly:
his own three-way choice already reflects this, and "matches the menu" is the one argument among
his four that does not survive a `grep`.

### Cited: what Mapbox GL / MapLibre GL, epanetjs.com, AutoCAD and Figma actually do

CITED (`unpkg.com/mapbox-gl@3.4.0/dist/mapbox-gl.css`, fetched 2026-09-10): the vendor's OWN
default CSS, the one nearly every interactive web map on the internet inherits unless overridden,
is `.mapboxgl-canvas-container.mapboxgl-interactive { cursor: grab }`,
`:active { cursor: grabbing }`, `.mapboxgl-track-pointer { cursor: pointer }`. **`grab`-at-rest,
`grabbing`-while-down is not this suite's invention; it is the library-level convention this whole
class of software ships with**, which is what `css/engcalcs.css:365-366`'s own comment already
half-says ("the open hand every map on the web uses") without having verified it against the
vendor source.

CITED (`github.com/epanet-js/epanet-js`, cloned and read 2026-09-10 — this IS epanetjs.com's own
source, public): `apps/app/src/map/mode-handlers/none/index.ts:127`
`setCursor(hasClickableElement ? "pointer" : "")`, and `apps/app/src/map/map-canvas.tsx:391`
routes the empty string to `placemark-cursor-default`. **epanetjs deliberately OVERRIDES its own
map library's `grab` default down to a plain arrow at rest, and switches to `pointer` (not
`default`) over a clickable asset.** So Tom's own read of epanetjs.com — "default away, pointer
over artifacts" — is exactly right, and it is a considered override of the vendor default, not an
accident. epanetjs's canvas has no separate placement-mode crosshair state visible in this file
(drawing modes route through `cursor-crosshair` at `map-canvas.tsx:392`, matching what this page
already does with `.lpn-placemode`).

CITED (Autodesk, "Previewing an object while hovering over it" / the `SELECTIONPREVIEW` system
variable, and the Autodesk KB article "Disable object highlighting on hover in AutoCAD Products";
Figma Help Center, "Highlight layers on hover" preference and the forum thread confirming it
outlines the hovered shape in the canvas independent of layer-panel hover): **a hover colour/outline
highlight, decoupled from the cursor glyph, is a real, named, still-shipping convention in both a
CAD-class editor and a design-class editor**, not a novelty. In both products the cursor over a
generic select/move tool stays constant (AutoCAD: crosshair; Figma: arrow) while a highlight
(dashed preselect glow in AutoCAD, blue outline in Figma) does the "what is under me" job that a
cursor swap does in a map product like epanetjs or Google Maps. **These are two different, both
legitimate, hover-affordance traditions** — map-style software swaps the cursor glyph; drawing/CAD
software swaps a colour and holds the cursor still — and `lpn_` is architecturally closer to the
second family (it has tool MODES the cursor already encodes — crosshair means "placing/measuring"
suite-wide) than to the first (a basemap of clickable POIs).

SPECULATION: EPANET desktop's own Select-mode cursor is unverified independently — I have no copy
to run and found no public source describing it. Tom's quote (*"this is what EPANET did, and it's
very 'serious'"*) is the only evidence for it, and I treat it as true but unconfirmed by me. It is
also not a fully comparable precedent regardless of whether it is true: EPANET's own canvas is a
bounded MDI window panned by scrollbars, not a full-window surface panned by click-drag, so its
Select mode never had to answer "how do you signal that a drag here pans the map" at all — the
question this page's `grab` exists to answer. Citing EPANET settles the "should Select-on-an-object
be `default`" question (already settled, 2026-09-09) and says nothing about the bare-map case.

### The ranked recommendation

**1st — do nothing further to the cursor; the shipped hybrid already IS the correct answer, and it
is closer to epanetjs's own considered design than any of the four candidates as literally stated.**
`grab` at rest on the 84.5%-of-canvas bare map (OBSERVED, `dev/session-handoff.md:281` measurement)
answers "you may drag here" the same way Mapbox's own vendor default and Google Maps both do,
costs nothing because there is no small target being obscured over open water — and `default`,
not `pointer`, over an object matches his 2026-09-09 precision ruling and is what epanetjs also
lands on for the same reason once you swap its `pointer` for our `default` (his own call, already
made, for the same stated reason: an arrow tapers to nothing at its hot spot and a hand does not).
The only real daylight between us and epanetjs is `pointer` vs `default` over an object — and Tom
already tried `pointer` there and rejected it in favor of `default`, in writing, one day earlier,
for a measured reason (the glyph itself, ~20 px, obscures a 7 px target). Reopening that is relitigating
a ruling with no new evidence. **If forced to pick one candidate to build from his list of four,
this is it: candidate 3, current shipped, unchanged.**

**2nd — ADD a hover colour highlight on the object, alongside the existing cursor, never
instead of it.** This is his fourth idea and the one he said he could not evaluate himself, and
the citations above say yes, it is conventional — AutoCAD and Figma both ship it as a *second*
channel next to (not a replacement for) whatever the cursor is doing. It answers a question the
cursor cannot: on THIS page, `default` over an object is deliberately identical to `default` over
nothing (Task 618's own three-cursor design), so at every zoom level short of the fit-to-network
one, a reader gets no feedback at all about which of two adjacent pipes their pointer currently
favours until they press. A 1–2 px stroke-weight or colour bump on the hit-tested element, keyed
off the SAME hit test the cursor swap already runs, would answer that without spending a cursor
glyph. **Cost is not zero** — SPECULATION, architecture read from `css/engcalcs.css:612-673` and
`js/looped-network.js`: there is no existing hover-tracking on the canvas (only on menu rows and
one data-table), so this needs either a `pointermove` listener writing one class to the
currently-hit element (cheap, a few lines, mirrors the existing hit-band machinery) or `:hover`
CSS on the hit band restyling a DIFFERENT sibling via `:has()`, whose browser support is worth
checking against this suite's floor before relying on it. **Worth doing, not urgent, and not a
cursor decision** — it is additive to whichever cursor answer he keeps.

**3rd — the crosshair, and it IS the strange one, but not for the reason "equally precise, just
odd."** SPECULATION/OBSERVED-combination: a crosshair already has a settled, different meaning
ON THIS EXACT PAGE — `.lpn-placemode` and vertices-mode both use it to say "a press here creates
or edits a point at the exact intersection of these two lines" (`css/engcalcs.css:1321`, `:615`).
Reusing it for ordinary selection would make the same glyph mean two different things in two
different modes of one page — "I am about to place something here" and "I am about to select
whatever is here" are not the same promise, and this is exactly the kind of collision CLAUDE.md's
icon and vocabulary rules exist to prevent elsewhere in this suite (one name doing two jobs). It
would cost nothing to build (a CSS value) and everything to have been the wrong choice once a
reader has learned crosshair-means-place from using Draw mode first. Not recommended, and not
"equally precise" in the sense he meant it either — precision (a 1 px aim point) is real, but a
crosshair is conventionally a *paint/eyedropper/place-a-point* glyph everywhere (Photoshop, GIMP,
this page's own other modes), never a generic-selection glyph in any product I found evidence for.

**4th — worst of the four: `default` everywhere, dropping `grab` from the bare map.** This is the
one Tom named as most precise and most "serious," and it is the one I would refuse. It removes the
only ambient affordance the page has on the 84.5% of the canvas that is empty water — a full-window
drag-to-pan surface would then tell a first-time visitor nothing about the one gesture that IS
always available there, on a page where the drawing has already been measured to be mostly empty
at a fit zoom. EPANET's own precedent (unverified, see above) does not transfer: its canvas never
needed to advertise drag-to-pan because it did not have click-drag panning to advertise. This
candidate buys "reads serious, matches a desktop precedent" and spends the one piece of free,
already-vendor-conventional wayfinding the page has.

### Touch

Untouched by any of this — a cursor is invisible on a touch device by construction, so nothing
above is load-bearing there and none of it should become so. `dev/session-handoff.md` already
records the touch story as grab-bands and tap targets, not cursors; that stays true whichever of
the above Tom picks.

### What I would want from Tom to go further

Nothing blocking — the recommendation above (do not touch the cursor rules) needs no further
input. If he wants the hover-highlight explored as a real build, that is a small, separate task
(new hover state, one class, a CSS rule) worth its own invocation rather than folding into this
one, per the brief's "diagnose, do not build."

---

## 2026-09-10 — A CORRECTION TOM MADE TO MY OWN FIRST FINDING

**I read "default agrees with the menu" as a claim about the MENU BAR'S cursor, and it is not.**
Tom, immediately after reading my ranking: *"Default is what the Select menu icon depicts."*

OBSERVED (`lib/Icons.lib.php`, the `select` entry): the Select tool's icon is
`M6 3v14.5l3.8-3.6 2.9 6.3 2.6-1.2-2.8-6.1 4.5-.5z` plus a small arc — **the classic slanted arrow
cursor with a tail.** The icon that turns Select mode ON is a PICTURE OF THE DEFAULT CURSOR.

**So his argument was an icon-to-cursor consistency argument and I answered a different one.** My
observation that all app chrome is `cursor: pointer` and that `default` otherwise appears only on
`:disabled` states remains true and is worth keeping, but **it was never his point and does not
answer it.** Recorded here rather than edited away: the superseded reasoning is mine, not his, and
the useful part of this entry is the shape of the mistake — I checked what the menus DO and never
looked at what the tool icon SAYS, on a page where the tool icons are drawings of cursors.

**Which way it cuts.** It strengthens the shipped behaviour rather than changing it: `default` over
a selectable object in Select mode is exactly what the Select icon promises. It also puts a real
argument behind his Rank-4 candidate (`default` everywhere in Select mode, dropping `grab` from the
bare map) that I had ranked worst on the strength of the pan affordance alone. **That tension is now
a genuine two-sided question and not a settled one:** the tool icon argues the whole MODE is an
arrow; the map argues the bare canvas is a thing you drag. Both are true, and nobody has measured
which the reader actually needs.

### 2026-09-10, same day — resolving the tension: does it move the ranking?

**No. Rank 1 (leave the shipped hybrid alone) still stands, but the SUPPORT under it changed, and
that repair is worth stating plainly rather than leaving the tension open.**

CITED (Adobe Community threads on Illustrator's Selection tool, read 2026-09-10 — "the cursor
changes from the black arrow to the black arrow with a bounding box icon" when hovering a
selection, while the toolbar BUTTON itself never changes): **a tool's toolbar icon is read
industry-wide as a LABEL for the tool, not a literal, invariant promise about the on-canvas
cursor at every location.** Illustrator's own Selection icon — the direct ancestor of this
suite's arrow-with-tail glyph — already tolerates its live cursor differing from its toolbar
picture depending on what is under it. If the icon fully governed the cursor, Illustrator would
be violating its own convention constantly; it is not, because nobody reads it that way.

CITED (Adobe, "Pan across the canvas with the Hand tool," helpx.adobe.com, read 2026-09-10):
**Photoshop does not ask its Move tool's own icon/cursor to cover panning at all — panning is a
SEPARATE, named tool (Hand), with its own icon, reached by its own key or a held spacebar.** That
is the clean way to keep a tool's icon honest: give the second job its own tool rather than
overload one icon with two meanings.

**`lpn_` has not done that, and that is the load-bearing fact.** OBSERVED: there is no Pan tool, no
spacebar-to-pan, in `js/looped-network.js` — click-drag on the bare canvas under Select IS the pan
gesture, with no separate affordance anywhere on the page. So the Select icon was never going to be
able to keep its promise everywhere no matter which cursor is chosen: `default` keeps the promise
where a target exists (already true, already shipped, unaffected by this) and breaks it on the
84.5%-of-canvas bare map where the actual behaviour (pan) lives and has no other signal at all;
`grab` does the reverse, and only on the part of the canvas that has nothing to aim at, i.e. nowhere
the imprecision his own complaint was about (a 20 px hand hiding a 7 px target) can bite. Given the
icon cannot be kept fully honest either way — this page overloaded one tool with two jobs and gave
it one icon — the imprecision should fall where nothing is being aimed at, not on top of the thing
the reader is trying to click. **The corrected reasoning still points at Rank 1.** The Illustrator
citation says the industry doesn't expect an icon to be a literal cursor contract in the first
place; the Photoshop citation says the honest fix for "one icon, two jobs" is a second tool, which
is a real fifth candidate — costed below, not recommended for now — rather than picking whichever
cursor loses less.

**A genuinely new, cheap option this correction surfaces and Tom did not ask about:** a dedicated
Pan tool (its own toolbar/menu entry, `default` restored to the whole of Select including the bare
map, `grab`/`grabbing` moved to the new tool alone) would resolve the tension outright and matches
Photoshop's own answer exactly. Cost is real, not zero, unlike a CSS-value swap: one new toolbar or
menu slot, one new translated label in 27 languages, and a `space`-to-pan convenience most users of
this genre expect alongside it if the dedicated tool exists at all — plus training a return visitor
who has already learned "drag the empty map to pan" that the gesture now lives one tool over. Not
worth it for a 16 September demonstration; noted in the wish list, ranked below the hover-highlight,
for the same reason Rank 1 above stands: the shipped state already answers the actual complaint
(imprecision aimed at small targets) and this would only be buying icon literalism nobody has
reported missing.

### Does "icon depicts cursor" generalize to a suite-wide rule, checked across every `lpn_` tool

OBSERVED, `lib/Icons.lib.php`: two families of tool icon exist on this page and they are NOT held
to the same promise.

- **Asset/action icons depict the THING, never a cursor** — `junction` is a solid dot (what a
  junction looks like on the map), `reservoir`/`tank`/`pump`/`valve` are the asset's own symbol,
  `text` is a T, `del` (the Delete tool) is a trash can, `vertices` is a zigzag with two grip
  squares (what a bend looks like once you can grab it). **None of these is a picture of a
  pointer, so none of them makes the promise Tom's correction is about**, and their mode cursors
  (`crosshair` while placing, `default`/`crosshair` split across grip and band in vertices mode)
  are free to be whatever the aiming problem calls for without contradicting the icon. This is the
  larger and older set, and it is not in question.
- **The select FAMILY — and only this family — depicts a cursor**: `select` is a slanted
  arrow-with-tail; `select-window`, `select-lasso`, `select-polygon` (`lib/Icons.lib.php:283,
  292-294`) each pair the SAME small arrow-cursor glyph in a corner with a dashed shape (rect,
  lasso, polygon). By the principle Tom named, all four owe the reader `default`.
  - **`select` keeps that promise on an object** (2026-09-09 ruling, unaffected).
  - **`select-window`/`select-lasso`/`select-polygon` do NOT.** OBSERVED,
    `js/looped-network.js:16157-16159`: all three area-select tools set `mode = 'select-area'`,
    which flips `.lpn-placemode` on, and `css/engcalcs.css:1321` makes that whole mode
    `cursor: crosshair` — the same rule and the same reasoning ("aiming at a coordinate, 1 px
    hitbox") that governs the add-* placement tools. **Their icon promises an arrow and their
    mode delivers a crosshair, and this is a real inconsistency nobody had found before this
    correction, independent of the bare-canvas question.**

**Is that a rule to hold or a coincidence not to read into?** I read it as a real finding but do
NOT read the small corner arrow as unambiguously a "cursor promise" the way the bare `select`
icon is — the code comment on it (`lib/Icons.lib.php:291-292`, "the little pointer in the corner
of each says the ring is something you draw") reads as using the pointer glyph to mark the icon as
an ACTION you perform with the mouse (as opposed to a static shape), which is a plausible, different
job from "this is what your cursor will look like." I cannot verify which reading Tom intended
without asking him, and a wrong guess here is cheap to get wrong in either direction (repaint one
icon corner, or leave it), so I am not resolving it — it is a genuine open question, named rather
than silently decided, and belongs to him. **What I CAN say without his input: the principle is
real and narrow.** It binds the four select-family icons to each other and to their own cursors; it
says nothing about, and should not be extended to, the asset/action icons, which correctly depict
the thing rather than the pointer and would be actively wrong if forced to match a cursor instead.
