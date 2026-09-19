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

---

## 2026-09-10 — TOM RULED, AND THREE OF MY OPEN QUESTIONS ARE CLOSED

**The cursor question is SETTLED and the shipped state stands.** His own summary, and it is the
sentence to quote rather than paraphrase: *"I am feeling really good about the conventionality of
where we are headed: menus are pointer, map is grab, select menu depicts a default, and select is
default, which is precise, serious, and consummately functional."* So: Rank 1 confirmed, and the
hybrid is now a DECISION rather than an accumulation.

**On my own first finding, which he neither accepted nor dismissed but reframed:** *"Pointer is
perfect for the menus. Very real-world based for finger and button."* The chrome/canvas split I
reported as an inconsistency is his intent -- a menu row is a button and a finger presses buttons;
a junction disc is a target and an arrow aims at targets. **Two cursors, two kinds of thing.** My
observation was correct and my reading of it as tension was not.

**Question 2 was answered NO and then REVERSED the same day, and both halves matter.** Tom's first
answer was to the general principle; on seeing what I had actually found he wrote *"Nice catch, Ida.
Nice fit and finish."* and the three marks were repainted to crosshairs. **His framing correction is
the reusable part:** *"it's not the corners Ida noticed. It's a tiny cursor depiction."* What made
them wrong was never where the mark sat -- it was that a drawing of a cursor is a PROMISE about what
the pointer will look like, and three of the four select icons were making the wrong one. The
general answer below still stands and is why this did NOT become a sweep.

**The general principle is answered NO, and the answer is better than the question.** I asked whether the three
area-select icons' arrow corner should be repainted to a crosshair. Tom: *"vertex and everything
else is not a place for depicting a cursor. So your question kind of falls on a deaf suite."*
**The icon-depicts-its-cursor idea is not a suite-wide rule and must not become one.** TWO tools
depict a cursor, not one -- Tom, correcting me: *"No. We just said that the area select has a tiny
cursor. So there are two. And we are in the process of aligning the area select button with its
cursor as crosshair-crosshair."* `select` is arrow-and-arrow; `select-area` is now
crosshair-and-crosshair; that pair is the whole population. **The rule binds an icon that CHOOSES to
draw a cursor and nothing else** -- draw one and you have promised it, draw the thing instead and
you have promised nothing. Every other
icon depicts the THING (a junction, a valve, a vertex), which is a different and correct taxonomy.
Do not re-open this as a consistency sweep.

- **He would extend the alignment if a case existed, and none does:** *"If there were any other
  opportunities, I would strongly support making them aligned as is select."* So the principle is
  real and its population is one.
- CITED-adjacent, from him: *"at epanet-js icon and cursor are not aligned."* Worth knowing that
  we are ahead of the comparator on this one point rather than behind it.

**The Pan tool I costed is REJECTED OUTRIGHT, not merely unrecommended** (Tom, 2026-09-10:
*"Strongly opposed. Simply unnecessary and wasted prime real estate. And not 2026-like."*). Three
objections, each sufficient alone: not needed, costs the scarcest real estate on the page, and is a
dated idiom. **My reasoning to it was sound and my conclusion was wrong**, which is worth keeping:
I reached a real 1990s modal-tool answer to a 2026 direct-manipulation question, and the tell was
that the tension it resolved was one nobody had reported. Ask whether a complaint exists before
costing a cure for it.

**One correction to a number I used.** I described the link band as 12 px throughout. Tom: *"Note
that 12px here is just an example. The band may be as small as 3px lower limit (yet to be
programmed?). It follows its graphics (already live)."* The band tracks the DRAWN width, and the
3 px floor is Task 618 item 2 and is not built yet. Any future argument of mine that leans on
"12 px of invisible band" is leaning on a stale figure.

**Touch is explicitly out of scope and he gave the reason.** *"A finger is not a mouse! Leave touch
alone, and I may test that. But on a phone, zoom in is the answer. You can't see through your
finger."* **Zooming is the phone's precision instrument, not a bigger hit target** -- that is a
design position worth holding on to, and it means a coarse pointer keeps its generous targets and
nothing on a phone should ever depend on a cursor.

---

## 2026-09-10 — Task 617: where does a basemap-style control go

Tom's sketch: *"put some expando choices at lower left with an arrow to replace the simple
'switch to the other one' UI"* — a disclosure widget (a small arrow/caret that opens a short
list of choices, the same family as a `<select>` but drawn as a popover rather than a native
control) at the corner where the current basemap toggle lives. Routed to me because it is a
chrome-PLACEMENT question, not a CSS-filter question — `dev/basemap-styling-options.md` already
settles the cheaper-of-three-routes question (start with a CSS `filter:`, free, no new host, no
consent gate, `dev/basemap-styling-options.md:36-46`) and Task 617 is now about where the
control that picks the filter lives.

### Vocabulary, taught as asked

- **Disclosure control / caret / expando** — a small arrow that, on press, reveals a short
  list without navigating away; the thing Tom sketched. Distinct from a **popover** (the
  revealed panel itself) and from a native **`<select>`** (same job, browser-drawn, no
  disclosure animation to design).
  **A `<select>` IS already this page's convention for "pick one of a short enumerated list
  of display choices."** OBSERVED, `js/looped-network.js:25310` `legendPositionOptions()` — a
  seven-item list (`off`, four corners plus two middles) feeding one `<select>` in Settings,
  reused for BOTH legends. A basemap-style picker with 2-4 options is the same shape of
  decision the suite already solved once; it does not need a new widget invented for it.
- **Corner** vs. **strip** vs. **band**: this page's own code comments already distinguish
  them, and I use their words. A *corner* is a fixed point (bottom-right, owned outright by
  `#lpn_basemap_credit`). A *strip*/*band* is `#lpn_map_footer` — left-packed, flex-wrapping,
  currently five items wide, and the thing `zoomExtent()` **reserves canvas against**
  (`overlayReserve('lpn_map_footer')`, OBSERVED `Looped-Network.php:399`) — so growing it by
  one control is not free the way it looks; it is a literal tax on drawing area, machine-
  measured by the page's own reservation call.

### OBSERVED: what is actually parked in that corner today, checked before recommending anything

`#lpn_map_footer` (`Looped-Network.php:402`), bottom-left, already holds, left to right: the
40×40 satellite-teaser tile (`lpn_basemap_teaser`, the CURRENT "switch to the other one" UI
Tom wants to replace), the scenario-status button, the units/mode readout, the coordinate
readout, and the one-tap grievance link (`lpn_wrong_btn`). Five widgets in one row that
**"already wraps on a narrow window" by the comment's own words** (`Looped-Network.php:423`,
`css/engcalcs.css:2657 area comment`). This is not an empty corner waiting for a sixth
control — it is the single busiest overlay on the page, and it is already the one the small-
screen breakpoint has to reckon with.

`#lpn_basemap_credit` (`Looped-Network.php:471`) owns bottom-right outright and is **not
dismissible** — required by the OSM tile usage policy and Mapbox's licence terms whenever a
tile is on screen. It is a separate corner, separate DOM, and CANNOT move to make room for
anything else.

The two legends (`#lpn_labels_legend`, `.lpn-color-legend`) are USER-REPOSITIONABLE to any of
six spots including `bottom-left` and `middle-left` (OBSERVED, `js/looped-network.js:25310-25318`).
So bottom-left is not merely crowded by default furniture — a reader who has moved a legend
there can collide a SEVENTH thing into the same 40px-tall band. The corner is already
contested, not spare.

**Settings > Map (`#lpn_set_sec_map`, `Looped-Network.php:795`) already has a "Map appearance"
subsection** holding exactly this category of decision — the two legend positions and the
colour-thematic mode live there today, at zero canvas cost, as ordinary `<select>` rows. This
is the free room 617's own costing document implies but does not name: the corner costs
reserved canvas on every window size; the Settings row costs nothing and is already open to
this exact kind of choice.

### Attribution risk, checked directly

The filter lands on `.lpn-basemap` (`css/engcalcs.css:389`, the tile-image wrapper), and
`#lpn_basemap_credit` is separately positioned DOM, `bottom:4px;right:...`, outside that
element and outside `#lpn_map_footer` (`Looped-Network.php:471`). **A style picker in EITHER
location — Settings or a corner control — cannot touch the credit**, because neither proposal
under discussion restyles anything but the tile layer itself. This was already the finding in
`dev/basemap-styling-options.md` ("attribution is separate DOM that a filter on the tile layer
beneath it does not touch"); checking the actual markup confirms it rather than merely citing
the prior doc. No design below endangers the credit.

### The ranked design

**Rank 1 — Settings > Map > Map appearance gets one more row: a basemap-style `<select>`,
same widget as the legend-position rows beside it.** Minimum viable option set: `Full color`
(default) / `Muted`. Wired to one CSS custom property or class on `.lpn-basemap`
(`filter: grayscale(60%) contrast(.9)`, per `dev/basemap-styling-options.md`'s own recipe) —
no new corner, no new bar, no canvas reserved, nothing for `zoomExtent()` to learn about. It
sits beside the legend-position controls it already resembles, so a reader who has found one
finds the other by the same habit. **This is the cheapest version, and it is also the RIGHT
version for a display preference the reader sets once and rarely revisits — not every
setting deserves a standing on-canvas control, and this one is closer in kind to "legend goes
top-right" than to "click to pan," which is exactly the test that already sorts this page's
existing controls between Settings and the canvas.** New strings: the section already exists,
so this is ~1 label + N option words, not a new subsystem.

**Rank 2 — if a corner affordance is still wanted, extend the EXISTING teaser rather than
adding a new independent widget.** The teaser tile is already the "switch to the other one"
UI Tom named; a small caret badge on its own corner (a few px, not a new flex child) opening a
tiny popover of 2-3 basemap-style swatches keeps the row's footprint growing by a corner
mark rather than a sixth full control. This is real canvas cost, just smaller than a new
item, and it needs its own interaction pass (press-and-hold vs. a visible caret vs. a
long-press) that is design work, not a settings row — worth an hour, not urgent, and NOT the
thing to build before 16 September.

**Rank 3, and my verdict on his own sketch — do not build a THIRD, separate expando at
lower-left.** As literally sketched (an independent new control, distinct from the teaser,
with its own disclosure arrow, parked in the same corner) it becomes a sixth item in a strip
that already wraps at narrow widths and that the page's own zoom-to-fit math already treats
as a canvas cost. It also duplicates a job the teaser already halfway does (a basemap-style
switcher living next to a basemap-style switcher) rather than extending it — two controls for
one decision is the exact shape `js/looped-network.js:25303-25306`'s own comment warns against
for the legend dropdown ("A checkbox beside the dropdown would be two controls for one
choice"). **His instinct about WHICH corner (the teaser's own neighborhood) is right if a
corner control is built at all — his instinct that it should be a NEW, separate widget rather
than a caret on the thing already there is the part to correct.**

### Menu vs. toggle — the option count that changes the answer

At **2 options** (full color / muted) this is a **toggle**, not a menu, and a disclosure arrow
overstates it — the picture-swaps-on-press convention the teaser tile already uses (pressed
state shows the OTHER option, `css/engcalcs.css:2675`) is the right shape, not a caret. A
disclosure arrow earns its keep at **3+ options** (e.g., normal / muted / a future dark-map
variant), where "press to see a short list" genuinely differs from "press to flip." Given 617
opens with exactly one new option (muted), **start as a toggle-shaped `<select>` with two
values, not a menu with an arrow** — the arrow is a cost to pay only once a third option is
real, and paying it now would be building UI for a menu that has one item in it.

### Phone

Nothing in the 640px block hides `#lpn_map_footer` or `#lpn_basemap_credit`
(`css/engcalcs.css:3119-3121` names only page titles, navbar, toolbar-minus-transport, and
menu-bar words as what goes — the footer strip is untouched and therefore still present, still
reserved-against, at the size where reserved canvas is scarcest). A corner control costs MORE
exactly where the surface is smallest, which is the strongest argument yet for Rank 1: the
Settings box already collapses into the existing responsive side-index at this width
(`css/engcalcs.css:3175` the `.lpn-setbox-index` phone rule) and adding one row there costs
nothing extra on a phone that a new on-canvas control would not also cost on desktop, and then
some.

### If this turns out to depend on the four-bar chrome diagnosis

It does not. This question is answered entirely by where FREE room already exists
(Settings) versus where canvas is already reserved and contested (`#lpn_map_footer`), which is
settled without touching the suite-chrome/menu/toolbar/tab-strip question my standing brief
opens with. Noted per the scope instruction and not started.

**Cheapest version I would accept if only the cheapest could ship before 16 September: Rank 1
alone** — one `<select>` row in Settings > Map appearance, two options, the CSS filter from
`dev/basemap-styling-options.md`. No new corner, no new strings beyond a label and two option
words, no risk to attribution, and it is discoverable exactly as well as the legend-position
control sitting next to it already is.

---

## 2026-09-10 — Task 625: the three bars after the divorce

Tom asked for me by name on two items inside the divorce (suite navbar/titles gone; menu bar,
toolbar, tab strip remain) and posed four questions plus asked which one thing I'd do first. Full
answer, with the MEASURED width numbers behind it, is `dev/app-chrome-postdivorce-recommendations.md`;
this entry is the compressed version for future-me.

**A — merge menu bar and toolbar into one row?** MEASURED (real Chromium render via
`dev/browser-pass/lib/env.js`, not estimated): menu bar ink 401px, toolbar ink 1,260px (its own
`contentWidth` looked identical to the row width at first pass — that's `.lpn-toolbar-end`'s
`margin-left: auto`, `css/engcalcs.css:1257`, pushing the last group to the edge, not real content;
had to sum group widths + gaps directly to get the true 1,260). Combined ≈1,660px against
1,364–1,918px of row at the three viewports this project already treats as reference points. **A
literal merge is provably unsafe below ~1750px** — most laptops. Tom's own qualifier ("if you're
talking about a single row on a wide screen, I agree") is right as far as it goes, but "wide screen"
excludes 1440 and 1366 by measurement, not by hedge. Recommended instead: unify the two rows'
PAINT (same background, no gap, hairline divider) with zero DOM change and zero width risk — this
is also my answer to E (the one thing first) because it is the actual fix for "the eye stops at the
toolbar and doesn't continue up," which is the real content of the original PCW/MJH finding, without
betting a width-gated merge before 16 September.

**B — Language on the menu bar.** Last position, right of Help — matches the suite navbar's own
existing order ("Help sits ahead of the language picker," `lib/Menus.lib.php:192`). Same 27-row
widget the navbar already has (`all_language_settings`, native-script names, no new component). Said
plainly that this is a secondary win, not a discoverability fix by itself: it forces people who
already want to switch languages through the menu bar, but does not put new eyes on the row for
people who weren't looking for it.

**C — Transport on the menu bar, to "drive people to the menu bar."** Corrected the brief's own
premise first: transport already left the bottom pane and lives on the TOOLBAR
(`js/looped-network.js:23270+`, mounted via `EngCalcs.lpnTimeMountToolbar`), not where the task
description said. Recommended against moving it to the menu bar — it's a persistent, stateful
control (play/pause/scrub) and the menu bar is a fire-once command surface; hosting Play there means
either the menu has to stay open while it runs (new interaction pattern, nothing else on the page
does this) or pressing Play closes the menu mid-action. Said plainly: relocating transport is the
wrong lever for the stated goal; the goal is served by A's paint-unify instead.

**D — Help menu revamp.** Kept the top-level label exactly "Help" — `dev/session-handoff.md:246`,
"Help wording is 'use Help'," which only holds with one menu owning that name. About and Contact are
already absorbed (`Help > Fix something` already replaces a separate Contact row on purpose, per the
existing comment at `js/looped-network.js:22098`). Proposed adding one row, `Install app` (opens
`Install.php`), grouped with Screenshot gallery / Not EPANET rather than near the top — same "about
the software, not about finishing the task" logic the existing separators already draw. Flagged that
About's CONTENT still needs to stop describing EngCalcs once the navbar is gone — a writing decision,
Tom's, not chrome.

**Method note for next time:** `dev/chrome-audit.md`'s own toolbar/menu numbers were row HEIGHTS,
not content widths — fine for the earlier stacking question, not enough for "does one row fit." A
quick throwaway Playwright probe (not committed, scratchpad only) answered the width question in
about five minutes; worth reaching for again rather than estimating from button counts.

---

## 2026-09-10 — Task 625, correction: the paint was already unified and I missed it

Tom agreed with items 2 (Language), 3 (transport routing — "I strongly agree about re-routing"),
4 (Help menu) and 5's wording, but challenged item 1, the one I'd ranked first: *"Do you mean just
pushing them closer together? There is no line. They already look like a set."* He was right, and
checking the CSS directly proved it rather than merely settling it by authority.

**What I got wrong.** I diagnosed "the eye stops at the toolbar and never looks up" and reached for
a paint fix (unify background, add a hairline) without first checking whether the paint was already
unified. It was: `css/engcalcs.css:1337-1338` (menu-bar item) and `:1218-1225` (toolbar button)
share the identical at-rest style (`background: none; border: 1px solid transparent`) and identical
hover colors, and the comment sitting directly above the menu-bar rule (`css/engcalcs.css:1260`)
states the intent in so many words: *"Flat text buttons, because a menu bar that looks like a row
of push-buttons reads as a second toolbar."* My "add a hairline" idea would have built the exact
thing that comment says not to build. **Lesson to keep: when a diagnosis implies "these two things
don't match," check the stylesheet before proposing the fix — the mismatch may already be a
deliberate absence, in which case the fix is aimed at the wrong layer.**

**Re-diagnosis, done properly this time — read the actual numbers before naming a cause.** Ruled
out two candidates by checking them directly rather than assuming: at-rest invisibility is shared by
both rows equally (not a menu-bar-specific defect), and the menu bar is NOT text-only — it already
carries an icon per item at desktop widths (`setLabel(b, m.icon, '')`,
`js/looped-network.js:22440`), only losing the word below 640px. What held up under measurement:
menu-bar icons are 1.05em against the toolbar's 1.35em (`css/engcalcs.css:249` vs `:1225`); 5 items
against 22; 401px of ink against 1,260px (same render pass as the earlier width probe). And a
genre argument I would not have reached without a real tester's own words: the toolbar is
icon-ONLY at every width by explicit ruling (`css/engcalcs.css:1206-1213`, quoting Tom, 2026-08-20,
"toolbars have icons, not buttons"), which is the visual grammar of an application's tool palette;
the menu bar keeps icon+word, which is the visual grammar of a website's nav list — and MAH
independently described the menu bar as belonging to "the site," which is exactly that genre
confusion, named by a real reader before I had a theory for it.

**Revised answer, if only one change:** not a menu-bar paint or size change at all. Meeting the
eye where the measured behavior shows it already lands — a first-visit cue anchored AT the
toolbar, pointing up — rather than trying to make the menu bar win an attention contest it
structurally cannot win against a row with 4x the icons and 3x the ink. Explicitly informed by the
one instrument this project already tried and watched fail for a related reason: the Hide-titles
highlight, which marked a row nobody was looking at and stayed missed even at 120 seconds. Full
detail: `dev/app-chrome-postdivorce-recommendations.md` §F (appended, correction kept rather than
overwritten — §A/§E marked superseded in place, not deleted, per the project's own convention that
a correction substitutes the reasoning and keeps the rejected alternative visible).

---

## The "clouds read like arms" complaint on the shipped `water` menu glyph, 2026-09-10

Tom, on the shipped menu icon (`lib/Icons.lib.php`'s `water` entry, the two flank-stroke clouds
added in the same-day addendum recorded in `dev/icon-preview/ship-notes.md`): *"I think that the
clouds don't work so great on the menu icon. The solution could be to remove them or make them less
like arms by making more of it (area vs line)."*

**A. Diagnosis — placement/gestalt, not stroke-weight, and not primarily a value problem.**
OBSERVED (`dev/icon-preview/render/arms-review/arms-review.png`, rendered from the exact path data
copied verbatim out of `lib/Icons.lib.php`'s `water` entry at 16/17/24/32px, light and dark, blown
up 12x nearest-neighbor): the two cloud strokes sit at x 1-5.6 (left) and 18.4-23 (right), y 5.5 and
9 — flanking the tank at roughly shoulder height, one per side, near-mirrored. That is exactly the
visual grammar of a body silhouette with two things sticking out from its sides at the top: roof =
head, wall = torso, legs = legs, and a mark on each flank at shoulder height completes as arms
whether or not it individually looks cloud-like. It is a SILHOUETTE-COMPLETION problem, not a
rendering-quality one. Compounding it: at 0.6 stroke-width the mark is also near the antialiasing
floor at 16-17px (OBSERVED in the same render: both flank marks are a faint gray smudge, not a
legible "cloud" shape at all at real menu size), so the reading has nothing clearly cloud-shaped to
compete against the shoulder-height/mirrored-position cue, and the ambiguous cue wins.

**B. His two proposals, judged.** (1) Remove the clouds — the geometry to revert to already exists
and was already tested clean: `dev/icon-preview/ship-water-menu.svg`, the file shipped one step
before the addendum. Zero-cost, reversible, one-line edit (delete the two trailing `<path>` calls
in the `water` entry). (2) Area not line — tested directly
(`dev/icon-preview/render/arms-review/arms-review.png`, "PROPOSAL 2" row: same footprint, drawn as
a filled lens instead of a stroked wave). **It does not fix the complaint** — it is still two
mirrored marks at shoulder height, and filling them gives the mass MORE presence, if anything
reading closer to short solid stubs than the fainter line version did. Area vs line is a VALUE
question; "arms" is a POSITION/orientation question, and changing value without moving position
does not touch the cause. **A third option was tried and only partly helps**: moving both marks up
to the same height above the roof/shoulder line, off the torso axis (`arms-review.png`, "OPTION 3"
row) — reads a little more like a hat brim or wings than arms, but is still faint and marginal at
16-17px and sits close to the exact headroom `ship-notes.md` already measured as unusable (2.2
units above the cone apex) for a different attempt. Not a clean win.

**C. Differs by size, and differs by icon.** The clouds get slightly more legible from 24-32px up
(more pixels to separate the wave shape from noise) but the shoulder-height/mirrored-flank
positioning is unchanged at every size, so the "arms" reading does not go away with size the way a
pure legibility problem would. **The favicon's clouds do not have this problem for a structural
reason, not a size one**: they are filled ellipses sitting BEHIND/BELOW the tank as sky fill, not
flanking marks beside a bare silhouette — an entirely different composition that a stroke-only,
no-fill-behind menu glyph (`EC_ICON_OPEN_TAG`: `fill="none"`, no ground) cannot reproduce. The "nod"
Tom asked for when he reopened this (*"the same clouds as the favicon would be amazing"*) cannot
actually be the same clouds, because the favicon's version is a background fill and the menu glyph
has no background to fill. **Recommendation: let the menu icon diverge from the favicon on this one
point** — drop the clouds at menu size (Proposal 1), keep them on the favicon, which he has already
ruled settled (*"my one true love"*). The menu icon's job is one-glance recognition in a strip of
other one-ink glyphs; the favicon's job is a bigger, standalone mark with room for atmosphere. They
were never obligated to carry the identical decoration for that reason alone.

**D. What was shown, not described.** Two real render sheets, both real Chromium rasters of the
exact path data (SHIPPED copied verbatim, not re-derived), never an invented mockup:
`dev/icon-preview/render/arms-review/arms-review.png` (16/17/24/32px, light+dark, 12x nearest-
neighbor blow-up, 4 rows: shipped / no-clouds / area-clouds / raised-clouds) and
`dev/icon-preview/render/arms-review/arms-incontext.png` (the same four candidates at native 1x
inside a mock `.lpn-menu-row`, 14px text, 1.05em icon, light and dark bar) — so the diagnostic view
and the "what you'll actually see in the app" view are both on the table rather than one standing
in for the other. Generators: `gen-arms-review.js`, `gen-arms-incontext.js`, same directory,
reusing the Chromium/playwright-core pipeline `gen-ship-clouds.js` already established. Nothing
shipped; `lib/Icons.lib.php` untouched.

---

## 2026-09-10 — Help, masterminded, and the LibreWaterNet way-back designed

Tom asked for me by name to mastermind Help ("It's a bit out of control, and maybe Ida needs to
mastermind it") and to design the new thing: a way back to LibreWaterNet.org from the app.
Full answer: `dev/help-menu-mastermind.md`. Summary, so a cold session does not have to re-read
the whole thing:

- **Help is not out of control in ROW COUNT** (11 rows, 4 bands, normal for the genre) — it is
  out of control in two specific rows being wrong on the merits, both of which Tom named
  correctly himself.
- **`lpn_notes_1/2_term`** ("How it is solved" / "Not modeled") are OBSOLETE as Notes-popup
  entries not because the facts are wrong but because they are the wrong GENRE for that popup —
  product-scope statements sitting among task-context notes (pump curve, saving, color bands).
  They belong in the About rewrite Task 625 already owes (About's body,
  `lib/lang.ec.en.php:543`, is still entirely suite-wide). Retire from Notes, fold into About.
- **LibreWaterNet.org should NOT become About, and About should NOT point there instead of
  itself** — read the actual site (`~/webdev/librewaternet.org/index.html` etc.): it's a mission/
  recruiting page ("World owned.", "Four kinds of person we are looking for"), tuned by its own
  CLAUDE.md to invite strangers, not answer "what is this software" to someone already mid-task.
  Register mismatch in both directions. Cheap bridge instead: one outbound sentence from About's
  own rewritten body.
- **Help > Toolbar: not redundant, genuinely load-bearing** (it's the icon-only toolbar's missing
  legend, per `dev/toolbar-icons.md` — the one place icon+name+tip appear together for a user who
  won't hover or can't). The defect is the LABEL, not the row: "Toolbar" reads as a control over
  the toolbar, not a legend. Tom's own proposed rename, "Toolbar key," is exactly right and costs
  one string.
- **Search help: right idea, wrong time.** Would eventually displace Toolbar key and partly
  Notes, but is real feature work — deferred past 16 September, not scoped here as instructed.
- **The way-back mark: recommended mono icon-only link at the FAR LEFT of the menu bar, before
  File** — not upper right as Tom proposed. Convention (VS Code, Figma, Docs) puts the product
  mark at far left because that's where the read starts and where "go home" is learned; upper
  right on THIS page is already the utility zone (Help, Language) his own recent work built,
  which is the wrong neighborhood for "leave the document." Mono, not colored — color is for
  contexts where standing out is the job (the favicon, "my one true love," in a tab or share
  card); here it would just re-create the salience-imbalance problem already diagnosed between
  menu bar and toolbar, a second time, against the mark's own neighbors. Costs ~40-50px against a
  measured 401px/1,364-1,918px menu-bar budget — comfortable. A Help row is the fallback of last
  resort: free in pixels, but inherits Help's own proven discoverability ceiling (two of three
  test subjects never found the menu bar at all), which is the one thing a "way back" cannot
  afford to inherit.
- **If only one: the way-back mark.** It's the only genuinely new capability asked for, and the
  only candidate that doesn't inherit a discoverability problem this project has already measured
  twice.

All CITED/OBSERVED/SPECULATION tags are in the full document. No shipped file touched.

---

## 2026-09-11 — Help menu follow-on: merge legal band with About, and name the mission row

Two questions from Tom, both answered in `dev/help-menu-mastermind.md` §6-7. OBSERVED first: the
way-back mark shipped exactly as ranked (`js/looped-network.js:22490-22520`) and is a **same-tab**
plain anchor — "Same tab on a plain click, so Back is the way back" is the code's own words. About
is being rebuilt as an in-page box (site name, personal line, GPL, copyright, deploy SHA), which
stops it being `ext('About.php')` and makes it mechanically identical to Notes/Cookie settings.

- **Q1, merge Privacy/Terms/Cookie settings with About: yes.** Once About is in-page, all four
  share the genre "facts about this software," and the legal band's own comment already half-said
  this ("About last, where every other Help menu... puts it"). Task 286 asks for findable and
  easy-to-withdraw, not for a particular band — position barely moves (band 3 of 4 to band 4 of
  4), and "legal + about" together at the bottom is a genuinely common shape (Slack, Discord,
  most Electron apps), not a novelty.
- **Q2, a row near Not EPANET pointing at LibreWaterNet.org: yes, but not because of
  discoverability.** My own §5 argument against a Help row for the WAY BACK still holds — Help
  inherits the proven ceiling (2/3 testers never found the menu bar). But the mark is same-tab,
  and every other outbound Help row is `ext()` (new tab, noopener) specifically so a reader
  mid-task can look without losing an open, unsaved project. Those are different offers: the mark
  says "I'm leaving," a Help row would say "let me check without the risk." That's the actual
  argument for adding it — not "redundant route, do it anyway," but "the one thing the mark
  structurally cannot offer." Named it `LibreWaterNet.org` (the site name, no translation needed,
  same reasoning the mark's own tip already uses) rather than Tom's "Front page," which risks
  reading as a synonym for the About row now sitting one band below it.
- **Net effect on menu length: eleven rows to twelve, still normal for the genre** (Word/Figma/
  VS Code all run 12-15). Bands go from four to three separators (the merge), which is a real
  simplification even though the row count ticks up by one.

Full reasoning, exact row orders and the two-item ranked table: `dev/help-menu-mastermind.md` §6-7.
No shipped file touched.

## 2026-09-11 — Correction: the way-back mark must be a menu, not a link

Tom, on the shipped mark: *"The trade mark at the upper left now evokes Mac paradigm, and as such
it carries expectations. Work with Ida to fulfill those expectations."* He is right, and it is my
own error, worth naming rather than smoothing over: I cited VS Code, Figma and Docs together for
far-left PLACEMENT (`js/looped-network.js:22508`), then shipped Docs' AFFORDANCE (a plain link) at
the position two of those three precedents use for a menu. **OBSERVED**: Figma's and VS Code's
top-left marks both open menus; Docs' is a link, but its mark sits in a title band above its own
menu bar, not inside the command row. Ours sits IN the row, as a peer of File/Edit/Map/Water/Help —
that structural position is what invites the Apple-menu expectation, not the corner alone.

**Ruling: convert `lpn_menu_home` to a `<button>` opening a flyout via `openMenu()`** — same
mechanism, same interaction model as its five siblings. Icon and position (mono `water` glyph, far
left, before File) are unchanged; only the affordance changes.

**Contents, Apple-menu shape** (identity first, app-global middle, the way out last, separated):
About → Learn more at LibreWaterNet.org (ext) // Install → Privacy notice → Terms of use → Cookie
settings // Leave for LibreWaterNet.org (same-tab href, what the mark itself used to do). All six
rows reuse existing keys and handlers — zero new strings.

**Help un-merges — my 2026-09-11 earlier entry (the legal+About merge, Install, the ext
LibreWaterNet.org row) is SUPERSEDED, not layered on.** Those four rows move OUT of Help into the
mark's new menu; leaving copies in both places would put Install and the site link in two menus
for no reason. Resulting Help: Walkthroughs, Notes on this page, Toolbar key // Fix something //
Screenshot gallery, Not EPANET — seven rows, two separators, down from twelve and three. **This is
the actual fix to Tom's scope-creep complaint**: it was never row count, it was two different
questions ("how do I use this page" vs. "what is this software") sharing one menu. Giving the mark
a menu is what finally gives the second question its own door.

**Phone: no change.** The mark was already icon-only at every width with its own carve-out comment
explaining why the small-screen word-hiding rule didn't apply to it (it wasn't a
`button.lpn-menubar-item`). Once it is one, the carve-out is unnecessary — it inherits the same
640px behavior as File/Edit/Map/Water/Help, which is a simplification, not a new case.

**Cost worth stating plainly: the way back goes from one click to two** (open the mark's menu,
then Leave for LibreWaterNet.org). That is the price of the convention Tom is pointing at, and it
is the right trade — a one-click affordance that breaks a learned expectation is worse than a
two-click one that meets it.

Full reasoning, the exact row orders and the ranked table: `dev/help-menu-mastermind.md` §8. No
shipped file touched.

## Task 625 fallout: the mark and the Water menu now draw the same tower

Tom named it directly: *"We introduced an embarrassment. Our Mac-style app icon is now the same
as our Map menu."* He means the Water menu — **OBSERVED** (`js/looped-network.js:22574,22599`):
`lpn_menu_home` (the mark, far left, icon `water`) and `lpn_menu_project` (labelled "Water", Task
523) both render icon `water`. Two identical tower glyphs, five items apart, in a seven-item bar.

**A. The principle.** On macOS the Apple mark is the ONE glyph in a bar of words — it never has to
be told apart from a command menu by SHAPE, because it is the only shape there. We cannot copy
that (icon-only collapse at 640px is absolute — CLAUDE.md, and rightly: this bar is durable where
the toolbar is the hog). So the shape has to do alone what position-plus-uniqueness does on Mac:
**the mark is a different KIND of thing (identity) and every command menu is the same kind of
thing (function), and no two glyphs standing for different kinds may be visually identical.**
Uniqueness-by-shape, not uniqueness-by-position, is the only version of the Apple convention this
bar can actually hold.

**B. Which one changes: the Water menu, not the mark.** Tom's own words are on record for the
tower (*"Favicon as it stands is my one true love"*) and the mark is the newer, correctly-argued
convention (my own entry above, this file). The Water menu's tower was never really about the
brand — it was picked because the LABEL is "Water" (Task 523 renamed Project → Water) and the
icon followed the word, not the menu's actual job. Read what the menu holds
(`js/looped-network.js:22433-22530`): Insert, Settings, Libraries, Profile, Tables, Calculate,
Scenarios — "everything unique about this application... except the animation play controls," in
Tom's own words for what he wanted there. That is the PROJECT, not literally water. The tower
belongs to the mark; the Water menu was always borrowing it.

**C. Which glyph — 'plan', already drawn, unused, and it is this menu's own retired icon.**
`lib/Icons.lib.php:669-698` (**OBSERVED**): `'plan'` is commented *"the rolled plan set that was
the Project menu's icon until that menu became Water... Tom, on losing it: 'We really came out
victorious with our Plan icon. But it looks like now we need to change it.'"* It is fully drawn,
six rounds of work, generated by its own script (`dev/scripts/icon_project_geom.php`), and nothing
draws it today. This is not a new icon — it is putting the menu's own history back under it. No
other existing icon fits as well: `settings`/`library` already appear as ROWS inside this same
menu, so reusing either at the bar level repeats the original defect one level down; `pipe` is an
asset type inside Insert two levels down, a milder collision but still a specific object standing
in for the whole project. `plan` collides with nothing currently drawn anywhere in this bar.

**D. Differentiation-in-kind (same tower, solid vs. stroke) — rejected, and the render shows why.**
At the bar's own 17px (`lib/Icons.lib.php:72` and repeated throughout) a fill/stroke distinction on
the SAME silhouette does not survive: both are still "the tower" the instant either is glanced at,
and at the 640px icon-only collapse — where the word that would disambiguate is gone by design —
two towers differing only in weight are the worst case, not a fix. Shape has to differ, not
weight.

**E. Rendered**, both full-bar states and the 640px icon-only collapse, light and dark, native
16px body (~17px icon, matching Icons.lib.php's own measurement point):
`dev/icon-preview/gen-water-menu-collision.js` →
`dev/icon-preview/render/menubar-collision/water-menu-collision.png`. The mark keeps its tower
throughout; the Water menu's rolled-plan icon reads as a distinct object at every size checked,
including icon-only at 640px, where it does not read as a diminished tower — it reads as its own
thing, which is the only test that matters at that width.

**Ruling: `lpn_menu_project`'s icon changes from `'water'` to `'plan'`. Nothing else in the bar
moves.** Zero new strings, zero new icon geometry — `plan` is deleted from nothing (Icons.lib.php
kept it exactly for a day like this), and the one call site (`js/looped-network.js:22599`) is a
one-word edit. No shipped file touched by me; this is advice pending Tom's word.

## 2026-09-11 — Halt called: the Mac-paradigm mark is scrapped, not patched

Tom: *"we are chasing our tail. Is the answer to scrap the Mac paradigm notion and throw its
items back under Help?"* Yes. Traced the circle to its own start: step 2 (my ruling, far-left
mark) cited VS Code/Figma/Docs for PLACEMENT; step 3 shipped Docs' link affordance at the other
two's menu position; Tom caught the mismatch; step 4 converted the mark to a menu, which then
collided icons with the Water menu; step 5 patched the icon. Each step was locally reasonable and
the whole sequence was still wrong, because it never asked the prior question: can a web page's
top-left slot do the job Mac's Apple-menu-plus-app-menu pair does. It cannot, and does not need
to — a browser tab already carries the app's identity for free, which is the one thing a native
app's bold app-name menu exists to supply.

**CITED, not remembered, per Tom's explicit ask**: Apple's own HIG
(https://developer.apple.com/design/human-interface-guidelines/the-menu-bar) and consumer
explainers (iBoysoft, MakeUseOf) confirm Mac has TWO leftmost slots, not one — system Apple menu,
then a bold app-name menu, and the distinction is unobvious enough that beginner guides exist to
teach it to Mac owners themselves. VS Code's own docs (code.visualstudio.com) confirm the
About-lives-in-the-app-menu pattern is Mac-ONLY: "On Windows and Linux: Help > About. On macOS:
Code > About Visual Studio Code" — the same cross-platform software puts it in Help everywhere
else. NN/g (nngroup.com/articles/homepage-links) recommends a logo carry BOTH an icon link and
worded text, never the icon alone, which answers Tom's "Welcome page" question directly: yes,
word it.

**Ruling: `lpn_menu_home` reverts from `<button>`/`openMenu()` back to a plain same-tab `<a>`** —
undoing my own Task 625 conversion, keeping the icon and far-left position from step 2 (never in
question). Help gets back everything the mark's menu had absorbed: About, Install, Privacy,
Terms of use, Cookie settings — twelve rows, three separators, the exact shape §6 already
measured against Word/Figma/VS Code. The Water menu's `plan` icon (step 5) stays — it solves a
different, independent problem (two identical tower glyphs on one bar) and is not part of what
gets undone. Full four-question answer and the ranked table: `dev/help-menu-mastermind.md` §9.

No shipped file touched. This is advice pending Tom's word, same as every prior entry in this
file — but stated as plainly as the ask required: three of my own rulings from earlier the same
day are wrong and the fourth (the Water menu icon) stands on its own.

## 2026-09-12 — New-tab ruling: the tree had already converged, just never wrote it down

Asked to rule when a link opens in a new tab vs. the same one, across `/app/` and
`librewaternet.org`. Read every outbound link in both properties (~50 sites) looking for a
violation and found none — this repo had independently reached, by individual comment at each
site, the same rule twice over: `lib/config.inc.php:117-119` on `EC_LWN_APP_URL` and
`lib/Calculators.lib.php:105-107` on `ecLinkTipLabel()` both state it without naming it as a
general policy.

**Ruling: new tab is for an ERRAND that would cost the reader something if the tab navigated away
(unsaved work, typed form values) and that they mean to return from immediately; same tab is for
a DESTINATION, where Back is the only way back anybody needs.** `/app/` satisfies the errand test
everywhere, because the whole page is effectively a form behind a `beforeunload` guard — so its
uniform "every outbound row is a new tab" is not overreach, it is the one rule applied to a page
where the risk is total. `librewaternet.org` satisfies it nowhere, so its uniform "every link is
the same tab" — including external citations to epa.gov and Wikipedia — is the same rule,
correctly answering the other way.

**CITED**: NN/g (nngroup.com/articles/new-browser-windows-and-tabs/) — same tab by default,
new tab only when the reader needs outside information mid-task. GOV.UK Design System
(design-system.service.gov.uk/styles/links/) — identical default and identical exception, worded
around not losing form input. Both are silent on "external vs. internal" as the deciding
property, which is the axis this repo does NOT split on and I am not introducing.

**One gap named, not fixed**: WCAG 3.2.5 (AAA) and GOV.UK both pair a forced new tab with visible
text — "(opens in new tab)" — so the change of context is reader-initiated rather than sprung on
them. Nothing in this suite carries that text anywhere, on any of the ~25 new-tab links. AAA is
above this suite's target level, and the fix costs a translated string per visible instance, so
this is a wishlist item, not a ruling.

**One open call, not decided**: `citations.html`'s ~30-row source table is the closest thing to
NN/g's "reference lookup mid-task" exception on the reading side, but nothing is actually LOST by
following a citation same-tab (Back restores scroll position), so I did not overrule its current
same-tab state — flagged for behavioural evidence (do readers come back?) rather than a guess.

Full report: `dev/agents/interface-designer/link-target-ruling.md`. No shipped file touched.

## 2026-09-12 — LibreWaterNet's invite buttons: the one-line fix is right; four more things ranked

Tom's own screenshot: the WRITE TO US / OPEN AN ISSUE ON GITHUB pair at the bottom of
`#stakeholders`, dark mode, pencil-on-water at **1.22:1** (`style.css:507`, OBSERVED). He is
fixing it himself with `background: transparent`; I was asked only to read the surrounding file
and rank what else is wrong, not to touch it. No shipped file touched, in either repo.

**Ranked findings**, computed by hand from the declared hex tokens (WCAG relative-luminance
formula), OBSERVED against `style.css`:

1. **His fix is correct and sufficient for the acute defect.** Resting state becomes pencil
   `#E0745A` on paper `#10151A` at 5.88:1 (his own number); hover (`.invite .btn:hover`, unchanged)
   is paper text on pencil fill, which I computed at **5.96:1** — both clear AA (4.5:1), neither
   AAA (7:1), and the hover state needed no additional check because nobody had verified it before.

2. **The deeper discomfort is glare, not contrast, and is a separate, smaller finding.**
   `.btn`/`.btn-go`/`.btn-primary` fill with `var(--water)`, and dark mode's `--water` is a LIGHT
   tint (`#6FA8DC`) because that same token also has to work as body-text-on-dark for links and
   headings. I computed the resulting light-blue-plate-with-dark-text contrast at **7.27:1** —
   that pairing is not a contrast defect, it exceeds AAA. The discomfort, if any, is a bright
   saturated rectangle sitting in a near-black field (CITED: Material Design's dark-theme
   guidance desaturates a brand accent used as a large fill and reserves the vivid tint for text —
   the two jobs want different colors, and this file gives them one token doing both). Minimal
   fix if Tom wants it: a second token, `--water-fill`, that STAYS the light-mode blue
   (`#1B5FA8`) in dark mode too, used only for solid button backgrounds; `--water` itself stays
   untouched for text/links/headings, which is already correct. One new token, three background
   declarations changed, zero string cost. Ranked below the invite fix because nobody circled
   these two buttons and the math says they are not broken, only bright.

3. **Five button classes for what is functionally two.** `.btn-primary` is byte-identical to
   `.btn` (both `background: var(--water); color: var(--paper)`) — dead duplication. `.btn-go` is
   a size variant wearing its own color declarations it does not need. Recommend collapsing to
   `.btn` (solid) and `.btn-ghost` (outline/transparent) as the only two WEIGHTS, with `.btn-go`
   kept only as a combinable size modifier (`class="btn btn-go"`) and `.btn-primary` deleted in
   favor of plain `.btn` at its two call sites. **The invite pair should be ghost, not solid**:
   they are a matched, equal-weight ask (write to us / open an issue), and the page already has
   true primary CTAs elsewhere ("Start a model now", "Open the app") — a solid pencil button here
   would compete with those for attention it does not need. Concretely, drop the bespoke
   `.invite .btn` override and instead apply the existing `.btn-ghost` class at both markup
   sites, narrowing to just the accent color: `.invite .btn-ghost{color:var(--pencil)}` /
   `.invite .btn-ghost:hover{background:var(--pencil);color:var(--paper);border-color:var(--pencil)}`.

4. **Pencil is overused past "sparing accent."** The file's own header comment (line 25-26) says
   pencil appears "only on the disclaimer rule and on a correction mark" — it is currently doing
   at least eight jobs: `.invite` border + label, `.disclaimer` border + label, the wordmark's
   "not", every plain-link `:hover` (`a:hover{color:var(--pencil)}`), the feature-list drafting
   ticks, `.count a` and `.level a` (ordinary navigation, not caution), and now (before his fix)
   two buttons. Recommend narrowing back to genuinely cautionary content — `.disclaimer` is the
   clear keep; `.invite`'s border/label is arguable, since asking for volunteers is not a warning,
   and freeing it there would let pencil mean one thing again. `a:hover` and `.count a`/`.level a`
   should probably be `--water`, matching the plain `a{color:var(--water)}` rule they are
   currently exceptions to.

5. **Found in passing, not asked for: `--ink-soft` is referenced once and defined nowhere.**
   `style.css:396`, `.actions-note{color:var(--ink-soft)}` — sits directly under the two hero
   buttons ("Start a model now" / "See who we need"), in the same visual neighborhood as the
   screenshot. No `--ink-soft` token exists in either the light or dark `:root` block; on an
   inherited property like `color`, an undefined custom property falls back to the inherited
   value rather than erroring, so the line reads full-strength `--ink` rather than the muted
   secondary tone its own name promises — free one-line fix, `var(--ink-2)`, the token used
   everywhere else on the site for this exact job. `--water-2` is the mirror defect (defined,
   never consumed) — harmless, since nothing reads it, but worth naming since it is declared
   as though something does.

No shipped file touched in `librewaternet.org` or `engcalcs`. Full ranked answer given directly
to Tom in conversation; not duplicated into a `dev/*.md` file here since the subject file lives in
the sibling repository and this journal is the record of judgment, not of the target prose.

## 2026-09-13 — Task 616: the proposed fix repeats the diagnosis that hired me

Asked to rule on "a prompt history in the banner area." **The instrument is wrong before the
placement question is even asked**, and the task's own evidence says so if you read it as a
pattern rather than as two separate misses.

**What actually happened, OBSERVED, is not a duration failure.** `STATUS_NOTICE_MS = 8000`
(`js/looped-network.js:34857`) governs the ordinary case; the Hide-titles highlight was already
raised to 120 s and MJH still missed it (ROADMAP Task 616 block); KDH missed a DEM-disconnect
notice Tom himself saw on the same screen. Two different readers, two different messages, two
different durations, one result. **CITED**: this is inattentional blindness, not banner blindness
— Mack & Rock's "invisible gorilla" finding (Simons & Chabris, 1999; summarized
en.wikipedia.org/wiki/Inattentional_blindness) is that attention narrowed onto a task makes an
unexpected, unrelated-looking stimulus invisible **regardless of how long it is on screen**,
because the viewer never samples that region of the display at all. Banner blindness (NN/g,
nngroup.com/videos/banner-blindness) is the narrower, ad-shaped version of the same thing and is
also live here — `#lpn_map_notice` (`Looped-Network.php:334`) is a small bordered box in a
fixed screen corner, which is exactly the visual signature banner blindness trains people to
skip. **Raising the timer a second time treats a sampling problem as a legibility problem**, and
the evidence already falsified that once.

**1. Is a banner-area history the right shape?** No, on two independent grounds.
   - It adds a FIFTH thing to a page whose diagnosed defect is that readers do not see the four
     it already has (this seat's whole brief). A history band is new, permanent, page-level
     chrome — worse than the transient notice it is meant to fix, because it is always there to
     be filtered out, not just there for eight seconds.
   - **The two lost messages were never "on the map" in the reader's sense** — OBSERVED,
     `#lpn_map_notice` sits at `top:4px; left:4px`, and the reader was not looking at the top-left
     corner, they were looking at whatever they were drawing or reading. A history in a
     page-level banner moves the message even further from where the eyes already were not.
   - What the evidence actually asks for is **recoverability, not a second display surface**: a
     reader who missed something wants to find out what they missed after the fact, on demand,
     not to have it re-shown to them in a place they will filter the same way. That is a LOG
     behind a control, not a second live band — closer to a browser's own notification tray
     (bell icon, badge count, click to open a static list) than to a banner. Zero standing
     screen real estate; the reader's own noticing that "something happened and I don't know
     what" (a common report, per Tom's transcripts) is answered by a place to go look, not by a
     wider stage for the same performance.

**2. Where should a notice appear so someone looking at the MAP sees it?** Two honest answers,
   because the underlying problem (inattentional blindness) has no single fix in the corner-box
   family this page already tried:
   - **Anchor it to the thing it is about, not to a fixed screen corner.** `#lpn_map_notice`
     already does half of this right — it is drawn on the canvas, not in a page-top banner,
     which is correct given the full-window-drawing-surface rule. But top-left is a fixed
     address, not a following one; a message about a save or an import has no location on the
     map at all, so "anchor to content" only helps the subset of notices that ARE about a
     specific node/pipe/tank. For those (a scenario deactivation, a prefix-rename count, a
     multi-edit result), a marker or brief highlight AT the affected geometry — this seat's own
     wishlist item 1 (hover highlight) is the adjacent, already-approved precedent for
     "draw attention at the object, not at a corner readout" — would put the message where a
     reader's eyes are more likely to already be, because they just interacted there.
   - **For notices about the SYSTEM rather than the model** (DEM server disconnected, engine
     unreachable, locking unavailable), OBSERVED: this codebase already has the right pattern and
     simply does not apply it consistently. `noteMapUnmeasurable()` (`js/looped-network.js:34869`)
     and `#lpn_lock_banner` (`Looped-Network.php:170`, `role="status"`) both STAND until the
     condition clears rather than expiring on a clock — the correct shape for "the DEM server is
     unreachable," which is a state, not an event. KDH's miss is this seam's own bug: a
     connectivity failure is being said through `setNotice()` (the 8 s/120 s transient), when the
     precedent for "this is true until it stops being true" already exists two functions away.
     **Fixing that misclassification is a smaller, cheaper, more targeted move than building a
     history band, and it is not a new instrument — it is using the one the page already owns
     correctly.**

**3. Should duration vary by severity, and by what classes?** Yes, and the research answer is
   sharper than "vary it" — CITED, Material Design's own snackbar spec
   (m2.material.io/design/components/snackbars.html): 4–10 s is the entire sanctioned range for
   ANY auto-dismissing toast, and a persistent one is only ever paired with an explicit close
   control, never a longer timer — Material never ships a 120 s auto-dismiss, which is what this
   page's engine-difference note already is (`LPN_ENGINE_NOTE_MS = 120000`,
   `js/looped-network.js:34971`). CITED, accessibility.build's notification guide (fetched
   2026-09-13): "a notification that carries an action or essential information must not
   auto-dismiss" at all — not "gets a longer timer," never expires until the reader (or the
   condition) dismisses it. That reframes the question: **the axis is not "how long" but
   "does this expire on a clock, or on the condition changing / the reader acting."**
   - **Class A — routine confirmation** ("Saved X.", "Renamed {n} assets.", "Imported X."): true
     for a moment, carries no action, safe to lose. Keep `setNotice()`'s short expiry —
     Material's 4-10 s band; this suite's 8 s is already inside it and needs no change.
   - **Class B — a fact the reader should be able to act on but is not urgent** (Hide-titles
     confirmation, "titles hidden, use Settings to restore," the engine-difference notes): carries
     an instruction, so **do not auto-dismiss on a timer at all** — dismiss on the NEXT relevant
     action (the reader touches Settings, or does the thing again), or give it its own small close
     control. This is where Task 616's 120 s sat and where it will keep failing, because
     inattentional blindness does not respect any timer.
   - **Class C — a standing system state** (DEM/EPANET/locking unreachable): use the pattern this
     page already has for exactly this (`noteMapUnmeasurable`, `#lpn_lock_banner`) — persists
     until the condition clears, re-shown if it recurs, never a countdown. `role="alert"` (CITED,
     WCAG 4.1.3 guidance, properaccess.nl/dockaccess.org: assertive is for messages that "cannot
     wait") is defensible here where it is not for A or B, since a broken connection changes what
     the reader should trust about every subsequent answer on screen.
   - A reader does something different in each: A, nothing (it is a receipt); B, decide whether to
     act now or later, so it must still be legible later, which argues for the log/history from
     Q1 as the RECOVERY mechanism rather than the display mechanism; C, stop trusting elevation
     data or DEM fills until it clears.

**4. Can a notice carry an action?** Yes for Class B and C, and it is the right fix for "Use
   Settings..." specifically — but the two failure modes are independent and fixing one does not
   fix the other. A sentence that says "Use Settings..." and a link that says "Open Settings" cost
   the same attention to a reader who never looked at the box; the action turns a missed
   opportunity into a smaller missed opportunity, not a seen one. Making it a link is worth doing
   on its own terms (fewer steps for the reader who DOES see it, one fewer full-sentence
   round-trip through 27 languages if the link text reuses an existing menu-item string) but
   ranks behind fixing what shows the box in the first place, and should not be sold as solving
   discoverability.

**5. Ranking.** Against the chrome brief I was hired for, and against doing nothing:
   - **Do not build the banner-area history before 16 September, or arguably at all in this
     shape.** It is new permanent chrome, on a page whose demonstrated problem is chrome nobody
     sees, proposed as the fix for a problem chrome placement did not cause.
   - **If one thing ships from this task, it is the Class C reclassification** (route
     DEM/engine/locking disconnect notices through the existing `noteMapUnmeasurable`/
     `#lpn_lock_banner` persist-until-cleared pattern instead of `setNotice()`'s expiring one).
     It is the cheapest true fix on the list — no new UI, no new strings, reuses a pattern the
     page already ships and reader-tested — and it is the one case in the evidence (KDH/DEM)
     where the missed message was actually consequential rather than a nice-to-have receipt.
   - **Below that: a small, closed recovery log** (a bell/count on the toolbar or status area,
     opening a short static list of the session's last several Class A/B notices) answers the
     recoverability half of MJH's suggestion without adding a live band. This is a real build,
     not a one-line fix, so it ranks below the reclassification and belongs on a branch of its
     own, not folded into whatever ships before the demonstration.
   - **The action-link conversion (Q4) is a one-string polish**, worth doing whenever Class B
     strings are next touched, not urgent on its own.
   - **All of this ranks below the four-bar chrome diagnosis itself** (wishlist items 5-8, 13-18):
     that work is about the SAME cognitive failure (inattentional blindness / banner blindness)
     applied to permanent chrome instead of transient notices, is already scoped, already has
     rulings from Tom, and is nearer done. Spending demonstration-prep time on a new banner
     instrument would be adding a fifth attention competitor to a page still working out how to
     get readers to see the first four.

**What I answered myself vs. what needs Tom's judgement:** the instrument critique (Q1), the
placement diagnosis (Q2) and the severity/duration classification (Q3) are read off evidence
already in this repository plus external research — no new information from Tom is needed to
settle them. **Two things are his call, not mine**: whether a recovery log is worth building at
all before the demonstration (a scope/priority decision, not a hierarchy one), and whether
`role="alert"` for Class C is too aggressive for readers using assistive technology on this page
today, which is a judgement about HOW MUCH interruption a "the ground is shifting under you" fact
deserves — that is a values call, not a design-hierarchy one.

No shipped file touched. `dev/agents/interface-designer/wishlist.md` carries the ranked build
items from this entry.

## 2026-09-13 — Task 636 (custom-property design table) and the "all boxes draggable" proposal

Two independent layout questions, both today.

### Q1 — does the custom-property design table belong in the Settings box?

**Settings is defined by one membership rule, and the property clearly passes it.** OBSERVED
(`js/looped-network.js:28994-29000`), Tom, 2026-08-18: *"If it's for the entire project, it's in
Settings."* A custom property's DESIGN (its schema — key, label, applies-to, validate-as, the
length/value limits) is applied across every asset of a kind, project-wide; only its per-element
VALUE lives on a node or link, and that already lives outside Settings, in the property popup. So
the home is right. **What is not settled by that rule is which WIDGET inside Settings hosts it,
and the shipped widget is the one place in the box that abandoned the box's own convention rather
than reusing it.**

OBSERVED: every other multi-field row in Settings is `.lpn-set-row`
(`css/engcalcs.css:2575-2609`), and it already has a phone answer built in — a container query
collapses its two-column grid to one column and stacks under 24rem
(`css/engcalcs.css:2620-2625`). The custom-property summary instead ships a raw `<table>`
(`.lpn-cp-table`, `css/engcalcs.css:2470-2489`) with nine of eleven columns truncated to
`max-width: 4.5em` and left to the content pane's own `overflow: auto`
(`css/engcalcs.css:2352`) for anything wider than the pane. That is a second, novel answer to
"too many fields, not enough width" introduced in the one box that had already solved that
problem a different way.

**Measured, not estimated, at 375px (a common phone width):** `.lpn-setbox` is
`width: min(34rem, 94vw)` (`css/engcalcs.css:2239`) → 352px; minus 16px padding, a 72px index
pane (`4.5rem`, phone value, `css/engcalcs.css:2344-2347`) and a 10px gap leaves **≈254px** of
content-pane width. The nine truncated columns alone demand `9 × 4.5em` at the table's own
`font-size: .85em` (≈13.6px) — **≈551px**. The key column carries no cap at all, so it pushes
everything after it further right still. Net: **a reader can see roughly four of eleven columns
at once, and scrolling right to read Low limit or High limit scrolls the key — the one column the
design deliberately left unabbreviated because "the key is the identity" — off the screen.** The
one column built to always be legible is the one a phone reader loses first. This is not a
hypothetical: it follows arithmetically from the box's own declared widths.

One thing the shipped table gets right and is worth keeping regardless of what else changes:
OBSERVED, the truncation is CSS `text-overflow: ellipsis` on the visible span, not a `slice()` in
JS (`css/engcalcs.css:2471-2475`, comment states the reasoning) — a screen reader reads the full,
untruncated `textContent`. The failure above is a SIGHTED-phone-reader failure, not an
accessibility-tree failure.

**His third alternative — key on line 1, an expander revealing every other field on its own line
below — is not merely "also workable," it is the better fit for this codebase specifically, and
I did not expect that going in.** Two findings drove the reversal:

1. **The shipped popup already reuses `.lpn-set-row` internally** — `openCustomPropDesign()`'s
   `row()` helper sets `line.className = 'lpn-set-row'`
   (`js/looped-network.js:27889-27896`). So the popup and a hypothetical expander would render
   IDENTICAL stacked single-column fields on a phone; the only difference is whether that stack
   sits inside a THIRD overlay layer (map → Settings box → modal) or inline, one level down,
   inside the summary the reader is already looking at. On a page whose diagnosed defect is
   attention lost to competing chrome, the extra overlay is a cost with no matching benefit — the
   layout work it buys already happens for free inside the box.
2. **The popup is the only control in the entire Settings box that leaves the box to be edited.**
   Every other section — colors, labels, id prefixes, defaults, units, hydraulics — commits
   in-place through a `.lpn-set-row`. An inline expander is consistent with that; the modal is the
   one exception, introduced the same day as the table it is meant to fix.

Compared honestly rather than by default:
- **On a pointer:** no clear winner in isolation, but the expander has the edge for the actual use
  case Tom described when he specified the summary table at all — scanning several property
  designs to compare them. A modal replaces the list with one property at a time; an inline
  expander lets two or three stay open beside each other.
- **On a phone:** the expander wins outright. It needs no new width arithmetic (reuses
  `.lpn-set-row`'s existing collapse), adds no overlay depth, and never separates the key from the
  fields it identifies — the key is the row it belongs to, not a column that can scroll away from
  it.
- **CITED**, on the general shape of the choice: NN/g, "Modal & Nonmodal Dialogs: When (& When
  Not) to Use Them" (nngroup.com/articles/modal-nonmodal-dialog) — modal is for a task that
  genuinely needs the user's full attention pulled off everything else; a nonmodal / inline
  affordance is preferred when the task is not that urgent and the surrounding context (here, the
  other property designs) still matters to the work. Ten fields committed one at a time with no
  OK/Cancel is an editor, not a decision — it does not need the interruption a modal buys.
- **CITED**, on the mechanism: the WAI-ARIA APG Disclosure (Show/Hide) pattern
  (w3.org/WAI/ARIA/apg/patterns/disclosure/) is exactly this shape — a button plus a
  collapsed/expanded region, `aria-expanded` doing the state, no focus trap, no backdrop, keyboard
  support for free — and native `<details>/<summary>` implements it with no JS state at all
  (MDN). Either gets full assistive-tech support cheaper than the modal, which had to
  hand-implement `aria-modal`, a backdrop and first-button focus itself
  (`js/looped-network.js:24265-24292`, correctly, but that correctness is a cost the disclosure
  pattern does not incur).
- **CITED**, on the general family the table half of this replaces: the "collapse a wide table to
  stacked field/value pairs under a narrow viewport" pattern is standard, older responsive-design
  advice (documented repeatedly on Smashing Magazine and CSS-Tricks, and catalogued among Brad
  Frost's responsive patterns) — it is not a novel proposal, it is this page declining to use a
  technique it otherwise already knows.

**A fourth shape, named for completeness and not recommended:** a master-detail layout — one
`<select>` choosing which custom property to edit, one vertical form below it for the chosen one,
no table and no per-row expander at all. SPECULATION: this avoids width arithmetic entirely, but
it hides every OTHER property while one is open, which is worse than either shipped shape for the
review/compare use Tom's own summary table was built to serve, and it makes "how many custom
properties exist and what are they" require opening the dropdown rather than reading a list. Not
recommended; named so the option space is not artificially narrowed to the two Tom already named.

**Recommendation, ranked:** the shipped popup is not "fine as is" — the phone failure above is
real and specific, not a stylistic quibble — but it is also not urgent before 2026-09-16: this is
a Settings sub-feature reached only after opening Settings > Assets, not one of the four bars a
first-time viewer's eye ever crosses, and a live demonstration is far more likely to run on a
laptop than a phone. Replace the popup with the inline expander when there is time to do it
properly (reusing `.lpn-set-row` per revealed field, `<details>/<summary>` or an
`aria-expanded` button for the disclosure itself, and folding `openCustomPropDesign()`'s field
list into the expanded body rather than a second dialog). This is a real, if modest, rebuild —
not a one-line fix — and belongs on its own branch, not folded into demo prep.

### Q2 — should every box be draggable and resizable, as a house standard?

**Yes, conditionally, and the condition is already the one distinction this codebase draws
everywhere else in this file: STANDING PANEL versus MODAL DECISION.**

OBSERVED: the infrastructure for the "yes" half is already built, shared and cheap.
`makePanelDraggable()` and `addPanelResizeGrip()` (`js/looped-network.js:32480-32630`) are one
call each; the panel z-stack (`raisePanel()`/`renormalisePanelStack()`) is generic; the furniture
rule (CLAUDE.md, Task 584) already routes remembered position/size through `localStorage`,
never `serializeProject()`, and already refuses to write a remembered CORNER from a phone while
still giving a phone a touch-draggable resize grip (`css/engcalcs.css:3236-3260`,
`js/looped-network.js:32465-32478`). Settings, Libraries and, since 2026-09-08, all four report
boxes already do this (`js/looped-network.js:29849-29855`). Making a new STANDING box do the same
is now four things — a `LPN_<X>BOX_KEY` constant, a load/save pair copied from the Library box's
template, one `makePanelDraggable()` call and one `addPanelResizeGrip()` call — not a redesign.
`lpn_furniture_check.php` already derives the furniture-key list from the write sites, so a new
key cannot go undocumented by omission.

OBSERVED, the "no" half: `openDialog()`'s modal (`js/looped-network.js:24265-24292`) is
deliberately different — `aria-modal="true"` backed by a real backdrop (Tom, 2026-08-05: *"I
still can change tabs/projects, and this can confuse my feeble human mind"*), fixed and centered,
its body scrolling rather than the box resizing (`#lpn_dialog_body { max-height: 60vh;
overflow-y: auto }`, `css/engcalcs.css:1323-1338`, fixed after Tom's 2026-09-02 "runs off the
screen" report). It is used for Save/Discard/Cancel prompts, alerts and single-purpose import
reports — things that must be answered before anything else can happen. Dragging or resizing a
box whose entire job is to be read once and dismissed buys nothing; it would only add a furniture
key for a box nobody leaves open.

**Stated as a rule someone could apply without asking me:** a box gets drag + resize together,
using `makePanelDraggable()` + `addPanelResizeGrip()` + a furniture key, if and only if it is a
STANDING panel — one a reader may reasonably want open beside the map while doing something else,
for more than a few seconds, and may want positioned or sized to fit what they are doing. A box
gets neither if it is a MODAL DECISION — its content is answered and dismissed, the page is
inert while it is open, and its own scroll (not its own resize) is how long content is handled.
Decide both properties by the SAME test, not separately — draggable-but-fixed-size or
resizable-but-immovable are not real cases here, because a box worth moving is a box worth sizing
and vice versa; the codebase's own comment agrees (`js/looped-network.js:32603`, "resizable gives
up nothing, and one made resizable later needs no second edit here").

**Why this does not reopen the chrome-attention argument I was hired on:** the four-bar
diagnosis is about ALWAYS-VISIBLE, first-glance chrome that a reader's eye has to find before
they have done anything. A box's own drag grip and resize corner are discovered by someone who
has ALREADY opened that box and is already engaged with it — the inattentional-blindness finding
(Task 616 entry, above) does not transfer, because the failure mode there was never sampling the
region at all, and here the reader is looking directly at the thing. Extending drag/resize to
more standing boxes adds no new first-glance competitor.

**One genuine edge case, and it is Tom's to call, not mine:** the custom-property design surface
sits exactly on the seam between the two categories as currently built — ten fields, each
committing individually, no OK/Cancel — which is editor-shaped, not decision-shaped, even though
it is currently built on `openDialog()`. If Q1's recommendation (fold it into an inline expander
inside the already-draggable/resizable Settings box) is taken, this edge case disappears — there
is no longer a separate box to classify. If the popup is kept instead, Tom should decide whether
it is a modal decision (stays as is) or a standing mini-editor that should be pulled out of
`openDialog()` into the standing-panel family — that is a judgment about what KIND of task
editing a custom property is, not a hierarchy question I can settle from the code alone.

**What is mine versus his:** the Settings-vs-widget diagnosis (Q1), the phone measurement, and
the draggable/resizable rule (Q2) are read off evidence already in this repository plus cited
external convention — no new information from Tom is needed to settle those. His alone: whether
to spend a post-demo cycle rebuilding the custom-property editor as an expander at all (a
priority call), and the one edge-case classification above.

No shipped file touched. Ranked build items added to `dev/agents/interface-designer/wishlist.md`.

---

## 2026-09-15 — Consult: Tom's five-group popup-collapse brainstorm, and Sue's coordinate-slot conflict

Asked by the orchestrator, alongside Declan, Sue and Mary, whether Tom's draft grouping (ID /
Dimensions / Flow and pressure / Quality / Custom) is the right set of cuts for the element
property popup, whether anything should be collapsed by default, how many bands the popup can
carry, what precedent this most resembles, and whether a default-collapsed Dimensions group
re-hides the coordinate-transposition risk Sue argued into slot 2/3.

### What the popup actually is today, checked rather than assumed

OBSERVED (`js/looped-network.js:35063-35267` `renderNodeFields()`, `:35912-36010`
`renderLinkFields()`): **there is no grouping of any kind in the popup today.** It is one flat,
ungrouped, always-fully-visible column of rows, built by sequential function calls with no section
`<div>`, no heading, no `<details>`. The only structural comment describing an ORDER (not a
grouping) is at `:11879-11884`, inside `findPropertyOffer()` — a different feature (the Find and
colour-by property picker) — with four informal bands: identity, what-you-typed, what-the-model-
worked-out, questions-about-the-drawing. That is close in spirit to Tom's five groups but is not
wired to the popup at all; nobody has yet connected the two.

OBSERVED, counting `renderNodeFields()`'s calls for an ordinary junction with a chemical run
active: id, elevation, elevation-demand row, demand-category table (1+ rows), resolved demand,
fire flow, emitter coefficient, head, pressure, initial quality, source fields, quality result,
tag, custom properties (0+), active/shut, push-here, coordinates (2 fields), import notes — **16
to 20+ rows for one element**, more for a tank (5 dedicated fields plus reaction, mixing, head) or
a pipe with fittings and reaction coefficients shown. This is a genuinely long, ungrouped list, so
Tom's brainstorm is answering a real problem and not inventing one.

OBSERVED, popup CSS (`grep` for `max-height`/`overflow-y` scoped to `#lpn_popup`): **none found.**
The box has no scroll clamp — it grows to fit its content and is dragged/repositioned by the
reader, unlike the Settings box, which has a fixed frame, a search box and a side index
(`lpn_setbox_index`, `js/looped-network.js:30160-30196`). The popup has neither. So today's
failure mode for a 20-row popup is not "the wrong thing is hidden" — nothing is hidden — it is
"the box is now taller than the window and the reader scrolls past what they want," which is a
different defect from the one collapsing is usually reached for.

### Existing precedent ON THIS PAGE for default-open vs. default-closed disclosure

OBSERVED (`js/looped-network.js:36241-36268` `multiSection()`, the MULTI-selection popup's own
grouped `<details>` sections): **`box.open = true`, unconditionally, with Tom's own reasoning
quoted in the comment**: *"OPEN, ALL OF THEM. Tom's own words are that a mixed selection shows
both and NEITHER IS HIDDEN, so collapsing is something the reader does, never the default."* This
is the one place on this exact page that already answers "does a property group start open or
closed," for a popup in the same family (property display for a selection) as the one this
brainstorm targets, and the answer is unambiguous: **default open, always.**

A second, narrower precedent cuts the other way in intent but not in mechanism:
`customPropBox()` (`:29025-29078`) uses one `<details>` per CUSTOM PROPERTY (not per group), and
each one **remembers its own open state** via `cpOpenKeys[def.key]` (`:29078`) rather than
defaulting open — but that is a list of N independent, same-shaped items the reader is scanning
for one KEY by name, a different job from a group of dissimilar fields the reader needs to read
together (e.g., Diameter beside Length). It is not evidence for collapsing property GROUPS by
default; it is evidence that per-ITEM remembered state is this page's answer to a long list of
interchangeable things, which the five-group brainstorm is not.

### Answering the five questions

**1 — is the five-group cut in the right places?** Broadly yes, with one real seam problem Tom
already flagged himself (Custom appearing twice) and one the orchestrator's own observation 1
names correctly: **"Flow and pressure" mixes typed inputs (Demand, Emitter, Roughness, K) with
solved results (Head, Pressure)**, and OBSERVED (`:11898-11929`, `BAND_NODE` vs. `RESULT_NODE`,
and `:35232-35236` where Head/Pressure are drawn inside an `if (lastSolveResult...)` guard that
the input rows are not) — **the popup's own existing code already separates these two
populations structurally.** A group that reunites them would be the first place on this page a
typed number and a computed one sit inside one visual container, which is a real regression
against a pattern CLAUDE.md itself states as a suite-wide rule ("a number the user supplied and a
number we computed are different kinds of thing and must never sit in one field" — the field-level
version of the same principle observation 1 is naming at group level). **Split it**: "Flow and
pressure" (inputs) and a computed tail (Head, Pressure, and for a link, Flow/Velocity/Head
loss/Gradient) — which is exactly the same INPUT/RESULT seam `BAND_NODE`/`RESULT_NODE` already
draws, so the fix costs no new judgement, only reading the split that is already coded.

Observation 2 (Shut/Included as state, not flow) I'd resolve the same direction Tom's own ID
group implicitly argues: these decide whether the element PARTICIPATES, which is closer to "what
the element is" than to "what it does hydraulically." I would fold them into ID rather than give
them a sixth group — a group of two toggles is a thin group, and `activeField`/`closedField`
already render immediately beside `tagField`/`pushHereButton` (`:35260-35263`,
`:35991-35993`), i.e. they are already adjacent to identity-band fields in the code's own order,
not to the flow fields.

**2 — what collapses by default, and does anything?** Nothing should, and this popup already has
a same-page, Tom-authored ruling that says so for the sibling popup one function away. CITED
internally (the `multiSection()` comment, above). SPECULATION, but a narrow one: the reasoning
that made him rule that way — a reader opening a MULTI-selection box wants to see everything a
mixed group shares before deciding what to change — applies with equal or greater force to a
SINGLE element's own full property set, where nothing is being compared across elements and the
box's whole job is "tell me everything about this one thing." Two testers already look past the
menu bar (OBSERVED, `dev/ROADMAP.md` Task 616) — a **default-collapsed heading is a second
instance of exactly the failure this seat was hired over**: a bold word with a caret is easy to
mistake for a static section label rather than a button, especially the FIRST time a reader meets
it, which is precisely when they most need to see what's under it. Open by default, every group,
matching the sibling popup, is the low-risk answer. Where collapsing earns its keep is the
opposite of "first glance": a RETURNING reader who has learned the shape of the popup and wants to
suppress a group they never touch (Quality, on a network running no chemical run) — that is a
real, later win, and it is exactly the shape `multiSection()`'s per-key remembered state already
models for custom properties. **Ship open-by-default now; consider a remembered-per-group-collapse
preference later, once real dwell-time or scroll-depth evidence says a specific group is
consistently skipped** — not before, because guessing which group a reader wants closed is the
same mistake as guessing which four-second highlight they'll see.

**3 — how many bands can this popup carry?** Five is not obviously too many in the abstract —
CITED, AutoCAD's Properties palette runs 5-9 categories (General, 3D Visualization, Geometry,
Misc, and 2-4 more depending on object type) and Figma's right rail runs 6-8 (Position, Layout,
Appearance, Fill, Stroke, Effects, Export, plus per-object extras) — but **the honest cost here is
not "five headings," it is "five headings ADDED to a page that already has four lines of chrome
Tom himself could not resolve, on the one surface (`lpn_`) CLAUDE.md itself calls a full-window
drawing surface where chrome competes with the drawing.**  A property popup is not suite chrome by
the taxonomy Tom drew (it is content, opened on demand, not a standing bar) — so it does not
directly add to the four-bar count — but it IS a fifth attention surface competing for the same
finite reading budget the moment it is open, and CLAUDE.md's `chore/seat-consult-collapse` brief
should weigh that the popup's OWN reader has already selected an element and is task-engaged
(closer to Settings-box attention than to first-glance chrome attention, per my own 2026-09-13
entry distinguishing an "already opened and engaged" surface from a "never sampled" one). On that
distinction, five groups on an ENGAGED surface is a much smaller risk than five bars on a
NEVER-SAMPLED one — this is a genuine gain if it turns a 20-row scroll into five scannable
labelled chunks, not a loss, PROVIDED nothing defaults closed (see Q2).

**4 — known pattern to defer to?** CITED: this is a **property inspector with labelled sections**,
the same family as AutoCAD's Properties palette, Figma's right rail, Blender's Properties editor
tabs, and a browser DevTools Elements/Styles pane. The closest match in SHAPE (grouped, always-
visible-on-scroll headings inside one scrolling panel, not a tabbed switcher) is AutoCAD's
Properties palette and Figma's right rail, both of which keep every section visible and let the
reader collapse a section only as a personal, remembered choice — never a shipped default-closed
state on first view. Blender's tabbed Properties editor is the WRONG precedent to reach for: tabs
hide all-but-one category at a time, which this popup does not do and should not start doing (it
would turn "five groups" into "five clicks to see everything," the opposite of what a full
property readout is for). **Defer to AutoCAD/Figma's shape: sections, not tabs; open by default;
collapse as a remembered reader choice, not a shipped default.**

**5 — the coordinate-slot conflict (observation 3): is it real?** **Real, and it is the sharpest
finding in this brief.** OBSERVED, `dev/agents/interface-designer` reading of the brief itself:
Tom's own reason for X/Y at popup slots 2-3 was *"one rule, no special case to remember"* — a
GLOBAL positional promise across the popup AND every node table. A "Dimensions" group starting
collapsed would put X/Y at slot 1-of-group-3-when-opened rather than slot 2-of-the-popup, which is
a second special case being reintroduced by the same brainstorm that is supposed to be tidying the
popup, and it is the worse kind: **it fails exactly the case Sue named — a transposed X/Y balances
hydraulically and is invisible to the solver, so the popup is the LAST honest place to catch it
before a GIS overlay or as-built check does, and that is only true if the popup shows it without
a click.** This is not merely "my Q2 answer (don't default-collapse) happens to cover it" — even
under my own Q2 recommendation (nothing collapses by default), the coordinate fields would STILL
be buried one section-heading-and-scroll below Demand/Fire flow/Emitter if "Dimensions" is treated
as an ordinary mid-list group, because Tom's own five-group order puts Dimensions second, but
coordinates are currently NOT grouped with elevation/diameter/length at all — OBSERVED,
`coordFields()` is called at `:35264`/`:36117`, dead last in the function, after `tagField`,
`customPropFields`, `activeField`, and `pushHereButton`. **The brainstorm's own "Dimensions" group
(Horiz, Elevation, Length, Diameter) would be the first time X/Y and the rest of the popup's
geometry sit together at all** — today they are not neighbours. So there are two separable
questions being asked at once and they want different answers: (a) should coordinates be grouped
WITH other dimensional fields — yes, that is a legitimate, overdue tidy; (b) should that group,
wherever it sits, ever be allowed to start closed, or sit lower than slot 2 — no, because that
directly reopens the exact risk his own coordinate-slot ruling exists to close. **Recommendation:
keep X/Y visually first inside "Dimensions," and never allow "Dimensions" to be the group a
remembered-collapse preference (if built per Q2's later phase) is allowed to apply to** — carve
coordinates out as an exception the way `customPropFields`' per-key remembering already carves out
Credits-style exceptions elsewhere on this page (`data-set-nofilter`, `:30284`). This is a real,
citable conflict, not over-reading.

### Where I expect the others to weigh in

**Sue** owns the coordinate-slot argument outright and should have the last word on whether
"Dimensions" is even the right HOME for X/Y at all, versus keeping coordinates structurally
separate from Elevation/Length/Diameter the way they are structurally separate from everything
else today — I am reading her prior ruling, not extending it past what she said. **Declan** should
be asked directly whether a collapsed-by-default group (if Tom still wants one later) costs a
keyboard stop per group per element the way slot 2-3 already cost him 800 stray keystrokes over
400 junctions — a `<details>` element is itself a tab stop, so five sections is five NEW stops
added to every popup visit regardless of open/closed state, which is a data-entry-volume question
this seat cannot weigh well. **Mary** has no obvious stake here; this is entirely internal
convention, not a market comparison question, though the AutoCAD/Figma citations above are exactly
her kind of evidence if she wants to independently verify them.

No shipped file touched.

---

## 2026-09-16 — Tom's audacious rebuild: options, not objections

He rejected the input/result-mixing argument (correctly — everything is already one ungrouped
list, OBSERVED `js/looped-network.js:35150-35270` node popup, `:35908-35998` link popup, both
interleave typed and computed rows today) and built five groups himself: Description and state /
Dry properties / Water properties / Custom / Results and quick graph. He asked for counter-
proposals on the one open problem (Results falls to 2 rows on a reservoir/tank) and two standing
questions (disclosure vs. plain heading; order within group). Answered in full to the orchestrator;
recorded here for continuity.

**The row-count problem dissolves once the INSTRUMENT changes, and that is my headline finding.**
His "fewer than three rows under a heading is bad" rule is a real cost judgement, but the cost it is
pricing is a `<details>`/`<summary>` disclosure's: a caret that promises interactivity, and — OBSERVED,
`js/looped-network.js:16669`-family and my own 2026-09-15 wishlist item 28 — a genuine keyboard tab
stop, one per group per popup visit. **A plain, non-interactive heading (`<h4>` or a rule+label) is
not a tab stop and promises nothing**, so the "underfilled disclosure looks broken" complaint a
2-row group raises under `<details>` does not exist under a plain heading — there is nothing for the
reader to feel cheated by. Given his own standing ruling that nothing in this popup collapses by
default (`js/looped-network.js:36248`, and now confirmed narrowed to Settings specifically, not
Properties, by his own words: *"Settings is infinitely long and deep... Properties is not"*), a
`<details>` element that is ALWAYS open and NEVER meant to close buys exactly nothing today except
the caret glyph and the tab stop. **Recommend: all five groups render as plain headings, not
`<details>`, in the single-element Properties popup** (the already-shipped `multiSection()` at
`:36241`, used for the DIFFERENT multi-select edit box, is untouched by this — that box's per-type
sections over a variable-length selection are a different judgement and out of scope here). This is
also my answer to his Q2, and it is the thing that makes Q1 stop being a live problem rather than a
tradeoff.

**Order-within-group: found one real mismatch between Tom's own written list and the shipped code,
worth a named counter-proposal rather than a shrug.** OBSERVED `js/looped-network.js:36550/35752/
36660` (link popup): `closedField()` (Shut) renders BEFORE `tagField()` (Tag), which is Shut-then-
Tag; his own list order is `ID, Description, Tag, Shut, Enabled/active`, Tag-before-Shut. Proposed:
swap the two calls in `renderLinkFields()` so the shipped order matches his own sketch exactly — a
two-line, zero-string-cost change, the actual meaning of "grouped as it stands" at the row level and
not just the block level. Separately (OBSERVED `:35931-35998` vs. his list's `Length, Diameter,
Roughness, K`): code renders Diameter first via the pipe-type chooser's own adjacency
(`pipeTypeChooser` immediately after ID is Task 465's own ruling, already settled), Length last. Did
**not** propose moving Length ahead of Diameter — that would silently overturn a named, dated ruling
on the strength of an illustrative bullet list that was never claimed to be pixel-precise. Flagged
the tension and recommended keeping Diameter anchored to the type chooser.

**Named but did not resolve: ID and Description don't obviously exist as two separate rows today.**
`idField()` renders in the popup TITLE, outside `fields[]` entirely; the only free-text identity
field in the code is `tagField()` (Tag). His count table gives "Description and state" 5 rows on
every type, which only works if "Description" names a row nothing in the codebase currently builds.
Did not guess at this — it is a content question (does a Description field get built, or does
"Description" mean something already named differently) and named it rather than silently deciding
it. SPECULATION, worth someone confirming before a five-row group is built expecting a row that
does not exist.

**Phone: grouping helps at least as much as desktop, and the disclosure-vs-heading choice matters
MORE there, not less.** OBSERVED `Looped-Network.php:635`, `css/engcalcs.css:1543`
(`.lpn-propbox { min-width: min(17rem, 94vw) }`): the property popup is a narrow, draggable,
resizable floating box capped to viewport width on any screen, and its fields have always been a
single vertical column, one property per line (`js/looped-network.js` comment at the `multiRow`
site, quoting Tom 2026-09-08: *"One property per line, as every other popup on this page"*). A
plain heading costs one line of vertical space regardless of viewport — phone has more of that
dimension to spend than width, via scroll — so grouping is not fighting the phone the way a wide
table would; there is no second dimension being asked for. If anything the case for plain-over-
`<details>` strengthens on touch: a `<summary>` genuinely toggles on tap, and a thumb landing on one
while scrolling a small draggable box is a more plausible accident than a mouse click landing on a
menu row by mistake — an accidental collapse mid-scroll is a cost a plain heading cannot incur at
all. SPECULATION on the accidental-tap risk specifically (no measured incident), but the geometry
argument (OBSERVED numbers above) does not depend on it.

No shipped file touched.

---

## 2026-09-17 — Zoom: snapping, wheel increment, and the no-wheel/keyboard gap (Tom's four points)

Tom raised four things about `lpn_` zoom. Point 4 (fade labels past a zoom threshold) is Task 669,
already designed, and out of scope here. The other three, ranked by what a reader actually suffers.

### Ranked answer

**1st — the no-wheel/no-touch path is a real, total gap, the same shape as Task 674.**
OBSERVED: the ONLY non-gesture zoom control on this whole page is one button/menu row, "Zoom to
fit" (`js/looped-network.js:25343` in `mapMenuRows()`; `:26520-26527` the toolbar button;
`fn: zoomExtent`). It is an absolute RESET to the network's extent, not an increment — pressing it
twice does nothing the second time. There is no Zoom In row, no Zoom Out row, no keyboard binding.
OBSERVED: `js/looped-network.js:37430-37474` is the page's only two `keydown` listeners outside text
fields — Ctrl/Cmd+Z (undo) and the digit-keys-pick-a-tool binding (Task 595, epanet-js's own 1-9
scheme). Neither touches zoom, and I found no third handler anywhere in the file binding `+`, `-`,
`PageUp/Down`, or arrow keys to `zoomAbout`. OBSERVED: `zoomAbout()` (`:9917`) is called from exactly
two places — the wheel listener (`:26697-26700`) and the two-pointer pinch drag (`:27387-27393`).
That is the complete set of doors into changing scale by any amount other than "reset to fit."
**A person with a mouse that has no wheel, a trackpad the browser does not recognize as a pinch
surface, or a keyboard-only path through the page (assistive tech, or simply no pointing device)
can get to "fit" and can get to NOTHING ELSE — not zoomed in one notch further, not zoomed out from
wherever a drag left them.** That is not a taste question; it is the same class of defect as
Task 674 (a coordinate enterable only by dragging) — one gesture is the only door.
CITED: EPANET's own desktop UI, which this suite's own comments name as the reference vocabulary
(`CLAUDE.md`'s `lpn_` section), ships exactly the control this page is missing — two ordinary
toolbar buttons and two View-menu rows, "Zoom In" and "Zoom Out" (https://usepa.github.io/EPANET2.2/7_map.html,
fetched 2026-09-17: *"Select View >> Zoom In or click [icon] on the Map Toolbar"* / *"View >> Zoom
Out"*). EPANET documents no wheel and no keyboard shortcut for either — its answer to "no gesture"
is two ordinary buttons, nothing fancier. CITED: Figma, a comparable web canvas app, binds
Cmd/Ctrl+`+`/`-` to zoom in/out and Shift+1 to "zoom to fit" (https://help.figma.com/hc/en-us/articles/360041065034-Adjust-your-zoom-and-view-options,
fetched 2026-09-17) — this page already has the "zoom to fit" half of that pair and is missing the
increment half entirely.
**This is the one I would build first if only one could ship before the 16 September window** — no,
correction, we are past that date now (today is 2026-09-17) but it is still the one I would build
first of the three, because it is not a preference, it is an access path with zero doors for one
class of user, exactly the shape CLAUDE.md's own rule about `lpn_` says to treat seriously
("Design this page for a pointer; then make a phone survivable" does not say "or nothing at all
for no pointer"). Cheapest form: two toolbar buttons or two Map-menu rows calling `zoomAbout()`
with a fixed screen-centre point and the same 1.1/0.909 factor the wheel already uses — zero new
interaction pattern, reuses the one function every other zoom path already goes through.

**2nd — the wheel increment is on the small side of the comparison set, and Tom's instinct is
better supported than not, though it is not indefensible taste-wise.**
OBSERVED: `js/looped-network.js:26699` — `zoomAbout(e.clientX, e.clientY, e.deltaY < 0 ? 1.1 : 1/1.1)`.
That is a **10% change in scale per wheel notch**, continuous (no snapping — see below), clamped
between `minScale()`/`maxScale()` (`:9888-9899`). CITED: AutoCAD's `ZOOMFACTOR` defaults to 60 (a
60% change per notch), range 3-100, and multiple Autodesk/community sources recommend LOWERING it
to 15-20 for finer control on a modern high-resolution wheel
(https://help.autodesk.com/view/ACDLT/2024/ENU/?guid=GUID-6A77AD55-6035-42FF-8FB1-FB0D8EFE1278;
community reports at https://forums.autodesk.com/t5/autocad-forum/mouse-wheel-zoom-rates/td-p/9287210,
fetched 2026-09-17). CITED: QGIS's own default zoom factor is 200% per zoom-in click of the
Zoom tool (Settings > Options > Map Tools > Zooming), lower-bounded at 100% by the UI
(https://www.cadlinecommunity.co.uk/hc/en-us/articles/360013651537-QGIS-Changing-the-Zoom-Factor,
fetched 2026-09-17) — note this is QGIS's discrete zoom-TOOL click, and I could not find an
authoritative primary source pinning its separate mouse-WHEEL factor to a specific number in the
time I spent; flag this as the weaker half of the QGIS citation. **Our number, 10%, sits below every
sourced default in this set, including the CAD tool whose users complain the factory default (60%)
is too coarse and turn it down toward numbers closer to ours.** That is not proof 10% is wrong — a
map-and-drawing hybrid page reasonably wants finer control than a pure CAD canvas, and nobody has
filed a friction report about it (unlike Task 674, which came from an observed defect). But it is
evidence Tom's instinct is pointed the right direction rather than groundless: the comparison set
clusters between 20% and 200% per step, and this page is at 10%, alone below all of it. SPECULATION:
a factor in the 1.15-1.2 range (15-20% per notch) would land inside the "fine CAD control" zone
Autodesk's own community recommends without leaving the map-tool cluster far behind — I did not
build or test this, it is a plausible number, not a measured one.

**3rd, but only because it costs nothing new to answer — zoom-level snapping is the wrong idiom
for this specific page, and Tom's own "anti-idiomatic" worry is correct.**
This page draws slippy-map tiles (OBSERVED: OSM/Mapbox basemap layer, `js/lpn-terrain.js` /
`js/looped-network.js` basemap functions cited elsewhere in this repo's own CLAUDE.md `lpn_`
section) UNDER a vector drawing placed by hand at arbitrary scale — it is neither a pure slippy map
(which snaps because its TILES are baked at integer zoom levels and a non-integer zoom must
resample or blend) nor a pure CAD canvas (which never snaps because nothing behind the drawing is
raster). OBSERVED: `zoomAbout()`/`minScale()`/`maxScale()` (`:9888-9925`) carry no notion of a
discrete level at all — scale is a plain float, and the pinch handler (`:27387-27393`) sets it from
a continuous finger-distance ratio, not from a level index. **Snapping would cost the vector half of
this page something real (a hand-drawn node can no longer be placed to read cleanly at exactly the
zoom the person wants) to buy the raster half something it does not need** — our basemap tiles
already render at whatever fractional zoom the browser asks a slippy-tile CDN for; that resampling
is the tile provider's problem, already solved, and invisible to a user who has never used this page
as a pure tile viewer. SPECULATION, but low-risk: I did not find, and would not expect to find, any
report in this repository of blurry or mismatched tiles at a non-integer zoom, because that is
normal behavior for every web slippy map at every intermediate scroll position between clicks, not
a defect. His own phrasing — "even on a phone, though that might be anti-idiomatic" — reads to me as
him already half-answering himself correctly; I would not spend a build here. Ranked last because
it is a "don't build this" answer, not a gap.

### Where I did not look
I did not test in a real browser (no `dev/browser-pass` render this session) — every wheel-factor
and range number above is read from source, not measured on screen; a `dev/browser-pass` screenshot
would confirm the ranges feel right but is unlikely to change the code-level finding (no wheel path,
no keyboard path). I did not check `js/lpn-terrain.js` or the basemap-tile code path for whether it
ever independently discretizes zoom for a TILE REQUEST (a plausible, unrelated reason a raster
subsystem might quantize internally without exposing it to `zoomAbout()`) — that would not change
the finding above (the STATE the user controls is continuous either way) but I have not read that
file this session. I did not check `dev/browser-pass/` for any existing zoom-behavior test. I did
not survey mobile-specific double-tap-to-zoom conventions beyond noting `touch-action: none` is
already set (`:8362` comment) to suppress the browser's own double-tap — checked afterward whether this page offers its own double-tap zoom as a partial answer to
phone's lack of a wheel: OBSERVED, it does not, and could not without a collision — `svg`'s
`dblclick` listener (`:26969`) is already spoken for, bending a pipe or deleting a bend
(comment at `:8358`), so a double-tap-to-zoom convention would need to fight an existing gesture
on the exact same element, not add one for free.

No shipped file touched.

---

## 2026-09-17 — Two direct questions: the lock-dialog button order, and the shape of a zoom control

Per the standing rule written today ("re-read the code before ranking anything from an earlier
sitting"), everything below is read fresh from `feat/lock-initials-later`
(`/home/haws/webdev/worktrees/feat-lock-initials-later/engcalcs`, checked 2026-09-17) and from
`master`'s own `js/looped-network.js` / `Looped-Network.php` for the map-corner survey. Nothing
here is carried forward unchecked from an earlier entry, though wishlist item 32 (zoom in/out
gap) is the same finding, re-verified rather than assumed.

### Question 1 — the four-button lock dialog

OBSERVED (`js/looped-network.js:23072-23095` in the worktree, `presentOpenChoice()`): the shipped
dialog is generic `openDialog()` machinery — every button is a plain `<button>`, identical style,
`marginLeft: 6px` and nothing else (`:25861-25868`); there is no CSS class distinguishing one
button from another anywhere in `css/engcalcs.css` (grepped for `lpn_dialog`/`lpn-dialog`, found
only the backdrop/body/max-height rules at `:1326-1358`). **The only asymmetry the code already
gives one button over the others is keyboard focus**: `openDialog()` calls `.focus()` on
`bar.querySelector('button')` — literally the FIRST button in the array (`:25877-25878`). Whichever
label is listed first is what a bare Enter-press, or a fast double-click before the eyes have
read the text, activates.

**A live sibling in this same file is worth reading before ranking anything, because it is this
codebase's own answer to the identical genre of question.** OBSERVED (`:25822-25846`,
`closeTab()`'s Save/Discard/Cancel dialog — Apple's own "Do you want to save changes?" shape):
order is **Save (safe, default-focused) → Close without saving (destructive) → Cancel (safe)**.
Two things to take from it: (1) this codebase already puts the safe, wanted-most-often action
first and gives it the default focus, which both of Tom's two lock-dialog orders already do (Ask
first in both); (2) it puts its ONE destructive option immediately next to Cancel, which is
exactly the adjacency that every external guideline below warns against — a real, live
counter-example inside this file, not a hypothetical. I did not touch it and am not asked to; it
is a 3-button dialog with no second safe option to buffer with, so it had nowhere else to put
Discard. The 4-button lock dialog does not have that excuse — it has TWO safe non-Ask options
(Open read-only, Cancel), which is room the Close-tab dialog never had.

**CITED** (Apple, Human Interface Guidelines, Alerts —
developer.apple.com/design/human-interface-guidelines/alerts, and the buttons page under
Menus and actions, fetched 2026-09-17): *"Don't assign the primary role to a button that performs
a destructive action, even if that action is the most likely choice,"* and Apple's own worked
example for "Do you want to save changes?" is **Don't Save / Cancel / Save** — the destructive
option is neither the default (rightmost, blue) nor adjacent to nothing; Apple's guidance
elsewhere on the same family of dialogs is to add visible SPACE around a destructive button so it
cannot be reached by the same rote sequence of clicks or tabs that reaches the safe ones, and to
mark it with the system's own destructive (red) styling so it reads as different in KIND, not
just in position.

**CITED** (Nielsen Norman Group, "Confirmation Dialogs Can Prevent User Errors,"
nngroup.com/articles/confirmation-dialog, fetched 2026-09-17): confirmation dialogs work when they
are rare and specific; used too often, or worded generically, they train a reader to click through
without reading — "cry wolf too many times… the confirmation dialog will lose its power." Read
studies cited there put the miss rate on unread confirmations above half. **This argues against a
second, extra "are you sure you want to break the lock?" confirmation step layered on top of the
dialog that is already open** — the three-age readout (`lockReadoutLines()`,
`:23025-23057`) already states the consequence in specific, non-generic words before any button is
reachable; a second modal on top of it adds friction without adding information, which is exactly
the shape NN/g's own research says teaches a reader to stop reading rather than to read more
carefully.

**Is `.ec-consent-btn`'s "never restyle one to stand out" rule the same case? No, and the reason is
what each dialog is FOR.** The consent banner styles Accept and Reject identically because the two
answers are equally legitimate expressions of one visitor's own preference — restyling either
would be steering someone toward the answer that serves this suite rather than them, which is the
dark pattern the rule exists to forbid. **The lock dialog's four options are not four equally
weighted answers to a preference question; they carry objectively different, stated risk** — three
change nothing recoverable and one can force a colleague's file into an unmergeable state. Marking
that difference is not persuasion toward an answer this suite wants; it is honest disclosure of a
fact already written out in the paragraph above the buttons, the same job the suite's own verdict
glyph already does elsewhere (CLAUDE.md's "Verdict / check-string convention": a leading `✓`/`⚠`
glyph, decorative, RTL-safe, no translated marker word, used precisely so a reader can tell a safe
result from a caution one before reading the sentence). Extending that existing, already-approved
convention to one button label is a smaller and more consistent move than either leaving all four
buttons identical (which every external source above treats as the mistake, not the neutral
choice) or inventing a new red-button CSS component for one dialog.

**The frightening option being sometimes correct is the argument for keeping it fully visible and
legibly labelled, not for hiding or burying it** — nothing recommended here removes it from the
row, shrinks it, or requires an extra click to reach. The only things changed are (a) which
position it sits in relative to the two safe non-Ask options, (b) a small amount of extra spacing
before it, and (c) a leading `⚠`. A reader who has decided their colleague has gone home for the
weekend can still read all four labels in the same glance and press the one they mean; what the
change defends against is a Tab-Tab-Enter or a startled double-click landing there BY ACCIDENT,
which is a different harm than a deliberate, informed choice.

**Recommendation — a third order, not either of Tom's two:**

> **Ask · Open read-only · Cancel** [gap] **⚠ Break lock**

Reasoning for each move: Ask stays first, unchanged from both of Tom's orders and matching the
codebase's own standing default-focus convention (Save/Ask, whichever is safest, always leads).
Open read-only moves next to Ask because both are "look, don't touch" answers and reads as a
natural pair to someone scanning left to right. Cancel moves to third, ahead of Break lock, so a
reader tabbing forward from the default focus meets only safe options before ever reaching the
destructive one — this is the opposite of the Close-tab dialog's own adjacency and is possible
here specifically because this dialog has two safe non-Ask buttons to spend on the buffer, which
the 3-button sibling did not. Break lock sits last, set apart by a visible gap (CSS: extra
`margin-left`, no other change) and its label carries a leading `⚠` reusing the suite's own
existing glyph convention (`pc.lpn_lock_break` becomes `⚠ ' + (pc.lpn_lock_break || 'Break lock')`,
or the glyph baked into the English string itself the way a verdict string already carries it) —
zero new translated words, one glyph.

**What I would NOT do:** repaint Break lock as a solid red/coloured button. This suite has no
existing coloured-button component anywhere I found (`grep` for a `.lpn-*-danger`/`.btn-danger`-
style class in `css/engcalcs.css` turned up nothing), and building one costs a new visual idiom for
a single dialog rather than reusing the ✓/⚠ language the reader already meets in results tables
and status readouts elsewhere on this exact page. A colour would also do the SAME job the glyph
does, just with a bespoke component instead of a five-minute reuse — no reason to pay for both.

No shipped file touched (I read the worktree; I did not edit it, per the brief).

### Question 2 — the shape and home of an on-map zoom control

**The map's corners are NOT free, and I was wrong to assume otherwise before checking — worth
recording the correction rather than silently fixing it, since the same mistake is exactly the
kind the 2026-09-17 "re-read before ranking" rule was written to catch.** OBSERVED
(`Looped-Network.php:264-322`, `#lpn_map_overlay_tl`), checked 2026-09-17: top-left already carries
a live, growing flex column — the mode hint (which itself wraps to two lines in several
languages, by its own comment), the select-area instruction bubble, the solver's standing
diagnostic with its own grievance button, and the EPANET engine-wait banner, PLUS a separate
absolutely-positioned one-shot notice box (`#lpn_map_notice`, `:334`) that deliberately COVERS this
same corner when a transient message fires. This is not a quiet corner; it is dynamic,
multi-line, and already the seam this suite's own comments say a wrongly-placed second thing
already pushed "an inch down the map" once (`:268-271`, the fix Tom ordered in 2026-08-27).
Bottom-left (`#lpn_map_footer`, `:416-474`) is the busiest of the four by cell count — seven
widgets today (satellite teaser, scenario button, status readout, coordinates, CRS name, scale
bar, one-tap grievance link) and already wraps on a narrow window by its own comment. Bottom-right
(`#lpn_basemap_credit`, `:498`) is the one corner that CANNOT move or share casually — required
OSM/Mapbox attribution, non-dismissible — and is also the DEFAULT parking spot for the colour
legend (`colorLegendPosition: … 'bottom-right'`, `:4924`), which already has to dodge the credit
via `placeLegends()`/`overlayOccupants()` (`:29116-29135`). **Top-right is the calmest of the four**
— OBSERVED, its only default occupant is the labels legend (`legendPosition: … 'top-right'`,
`:4877`), a single box that is frequently set to Off by design (Tom, 2026-08-25: *"the legend is of
less value now"*) and is not growing or multi-line the way the other three corners' content is.

**CITED** (Mapbox, `Map#addControl` API reference, docs.mapbox.com/mapbox-gl-js/api/map, fetched
2026-09-17): the default position for any control, including `NavigationControl` (the vendor's own
+/− zoom stack), when no position is given, is **`'top-right'`**. This is the one mapping vendor
already integrated on this page (satellite tiles, terrain), so it is not an arbitrary citation —
it is the convention of the library whose OWN tiles this page already draws. CITED (Leaflet's own
`zoomControl` option defaults to `'topleft'`, per Leaflet's documented API) as the other half of a
genuinely split convention in this space — OpenLayers and Leaflet both default top-left,
Mapbox GL defaults top-right, and Google Maps' own consumer product stacks its zoom control
directly above its attribution strip at bottom-right. **There is no single universal answer across
the industry; the deciding fact here is which corner is actually free on THIS page, and that is
top-right, which happens to also match the one vendor convention this suite already inherited.**

**Recommendation: a small vertical two-button stack, `+` over `−`, fixed at top-right, styled as
one more chip in the same visual language every other map-corner control already uses** — the
`rgba(255,255,255,.85)` translucent background, thin border, the same font-size class as the
legends and the footer readouts (`css/engcalcs.css`'s existing chip rules, not a new component).
No third button (no on-stack "reset to fit" — that lives on the toolbar per Tom's own settled
half of this task, and a third instrument for the same function on the same page would be the
exact redundancy the four-bar brief exists to catch). Not draggable, not resizable — every zoom
control I found in every cited product is fixed, and this page's own draggable/resizable
convention (wishlist item 23) is reserved for STANDING PANELS a reader leaves open, not a
two-button chip pressed and released. **Register it as a new occupant in the existing
`overlayOccupants()` function** (`:29116-29131`) — a four-line addition matching the pattern
already there for `#lpn_basemap_credit` — so a labels legend a user has moved to top-right dodges
around the new chip exactly as legends already dodge the mode-hint column and the footer strip.
This is not new infrastructure; it is one more line in a dodge system that already exists for
this exact purpose.

**Is this a fifth line of chrome, on top of the four Tom named?** No, and the distinction is the
same one I drew on 2026-09-13 about panel drag handles: the four-bar diagnosis is about
ALWAYS-VISIBLE, FIRST-GLANCE surfaces a reader's eye has to find before they have done anything —
suite chrome, menus, toolbar, tab strip. A map-corner zoom chip is discovered by someone who has
already opened the map and is already looking at it to navigate it, the same category as the
scale bar, the coordinate readout and the two legends already living there without complaint —
it adds one more chip to an existing population of roughly a dozen, not a new competitor for the
first-glance budget the four bars already spend. The real cost is smaller and different: corner
crowding, which the survey above says is genuine (every corner already has content) but
manageable at top-right specifically, and mitigated by reusing the existing visual idiom rather
than inventing a new one.

**Phone: hide it below the existing 640px breakpoint, and the reason is a ruling Tom already
made, not a new one.** Tom, 2026-08-22, cited in my own 2026-09-10 entry: *"on a phone, zoom in is
the answer. You can't see through your finger… A finger is not a mouse!"* — pinch-to-zoom is
already the phone's native, always-available answer to "how do I change scale," which is exactly
why the whole justification for an on-map +/- chip (no wheel, no keyboard, no pinch surface) does
not apply on a touchscreen. Hiding it at the breakpoint that already collapses the toolbar's
non-transport groups (CLAUDE.md, `css/engcalcs.css` `max-width: 640px` block) also sidesteps the
one real collision I found: `legendPosition` defaults to `'top-left'` on a small screen
(`:4877`/`:4924`, `smallScreen()` branch), not top-right — so the corner this control would want on
a phone is a different corner than on desktop, and the cheapest correct answer is to not need one
there at all.

**Is this worth building at all, given the toolbar half of Tom's own design (Zoom to Fit /
Zoom Window double duty) is already settled?** Yes, and it is not redundant with it: the toolbar
pair gives a RESET (fit) and a DRAG-A-RECTANGLE zoom-in (Window) — both still gestures, and neither
gives a plain, one-click zoom OUT from wherever the reader already is. The on-map chip is the only
one of the three instruments that answers "zoom out one step, right now, with one click, no drag."
Rank it below the toolbar half (already decided) and roughly level with wishlist item 32's
Map-menu Zoom In/Out rows — the menu rows are the more keyboard/screen-reader-reachable route
(an ordinary focusable menu item, not a bespoke SVG button needing its own accessible markup)
and cost nothing in map-corner space; the on-map chip is the more DISCOVERABLE route for the
ordinary pointer user who will never open the Map menu looking for it. Building both is not
double work — the menu rows and the on-map chip and the existing wheel/pinch handlers all call the
same `zoomAbout()` function, so it is a third and fourth door onto a function that already has two.

### The cheaper question: is the conventional keyboard binding worth adding, and what has to be
true of the drawing surface

**Yes, worth adding, and cheaply — but bind the BARE `+`/`-` keys, not `Ctrl`/`Cmd` + `+`/`-`.**
OBSERVED (`js/looped-network.js:37430-37474`), checked 2026-09-17: this page's only two `keydown`
listeners outside a text field are both on `document`, unscoped to any focused element — Ctrl/Cmd+Z
for undo and a bare-digit-key tool picker (Task 595). **Both are guarded by the same function,
`isTextEntry(e.target)`** (`:37469-37474`, checking `input`/`textarea`/`select`/
`contentEditable`), which is the answer to "what has to be true of the drawing surface for a key
press to reach it at all": nothing about focus — the listener is global and does not need the
canvas to hold focus — but the handler MUST check that the reader is not currently typing into a
field, or a bare `-` would zoom the map out every time somebody typed a negative elevation, and a
bare `+` every time somebody typed into a field that happens to accept one. This guard already
exists in this file for exactly this reason and a zoom binding should reuse it rather than write a
second copy.

**CITED** (Figma, "Adjust your zoom and view options," help.figma.com, fetched 2026-09-17): Figma
binds `Cmd/Ctrl` + `+`/`-` to zoom, which means it deliberately overrides the browser's OWN
reserved page-zoom shortcut inside its canvas. **That is a bigger claim on the keyboard than this
page has made anywhere else** — Ctrl+Z and the digit keys are not shortcuts a browser reserves for
itself, so intercepting `Ctrl`/`Cmd` + `+`/`-` would be a new kind of commitment (every browser
binds that combination to its own text/page zoom, and a user who has learned that expectation
gets a different, undocumented behaviour the moment focus is on this page). Recommend the bare
keys instead — `+` (and `=`, since `+` is the shifted form of `=` on a US layout and QGIS-style
tools bind both) and `-`, no modifier — which is closer to what a CAD-style tool (not a
browser-embedded design tool like Figma) does, avoids the browser-reserved collision entirely, and
matches the SHAPE of the existing digit-key binding (bare key, guarded by `isTextEntry`) rather
than inventing a new pattern.

### Where I did not look
I did not render either dialog or the map corners in a real browser this session — every finding
above is read from source (`js/looped-network.js`, `Looped-Network.php`, `css/engcalcs.css`), not
measured on screen. I did not check whether `overlayOccupants()`'s four-line addition is
mechanically trivial beyond reading the function once; I did not attempt the edit. I did not check
Google Maps' or Bing Maps' own source for their zoom-control default position — both citations
above rest on the public-facing product behaviour and Mapbox's own documented default, not on
reading either company's source.

No shipped file touched.

---

## 2026-09-18 — Two direct questions: the File menu order/Revert, and step 2 of the georeference wizard

### Question 1 — File menu order, Import submenu, Revert

OBSERVED (`js/looped-network.js:26344-26512`, `master`, checked 2026-09-18): the shipped File menu
today reads New project…, Open…, Open example…, Open xy file on map…, Import surveyed points…,
Import EPANET file…, Export EPANET file…, Import libraries…, [separator], Save, Save as…, Save
all, Revert, [separator], Close, then Recent files at the very bottom. Import EPANET and Export
EPANET are adjacent ON PURPOSE, and recently — a comment at `:26429-26438` records Tom finding this
exact problem on 2026-09-17 at an EWB demonstration: *"I couldn't find Export EPANET file. Let's
move Import EPANET file to just above it."* That is the load-bearing fact for the ordering
question below.

**Is his proposed order (New, Open, Import, Save, Save As, Save all, Convert…, Export) "the
convention"? Partly, and the part that matters most argues against exactly one piece of it.**
CITED (GIMP's own File menu, docs.gimp.org, fetched 2026-09-18 — the closest real analogue to this
page's shape, a native-format app that also has one distinct FOREIGN format it must explicitly
Import/Export rather than silently Open/Save): the order is **Save, Save As, Save a Copy, Revert,
[separator], Export…, Export As…, Overwrite…** — Import has no separate row at all (GIMP folds
foreign-format reading into Open's own file picker), but where GIMP does have a distinct
non-native-format doorway (Export), it sits with Revert, AFTER the whole Save family, not before
it. CITED (Blender's File menu, from its own documented UI, general knowledge rather than a fetched
page this session — flagged as the weaker half of this citation): New, Open, Open Recent, Revert,
[separator], Save, Save As, Save Copy, [separator], **Import ▸, Export ▸** as sibling submenus,
also placed with the Save family, not between Open and Save. **Neither of the two closest real
precedents puts Import between Open and Save the way Tom proposes** — both put Import and Export
together, near Revert, after the Save family. That is a real disagreement with his instinct, not
just a stylistic quibble, and I would flag it rather than silently agree.

**But the more important fact is this suite's own, one day old.** Whatever abstract convention is
followed, Tom's own dated finding is that EXPORT GOT LOST when it was not adjacent to IMPORT
(2026-09-17 quote above). **His new proposal — Import between Open and Save, Export at the very
end after Save all and two future Convert rows — separates them again, by roughly eight rows.**
That risks reproducing the exact failure he ordered fixed one day earlier. This is the one place I
would push back hard regardless of which abstract convention wins: **keep Import and Export
adjacent, wherever that pair sits.**

**Is a three-item Import submenu (EPANET, libraries, surveyed points) right at this count?**
Yes, and it is a different shape from the submenu this same menu already tried and reverted.
OBSERVED (`:26380-26382`, Task 264 comment): a "New project" fly-out was undone because its four
rows were "the cross of two questions" that a single box answers better — that is a submenu that
tried to hide a DECISION TREE. Import EPANET / Import libraries / Import surveyed points are not a
decision tree; they are three parallel nouns (three foreign formats), which is exactly the shape
Blender's own Import ▸ / Export ▸ submenus hold (CITED above, weaker citation). A submenu is the
right container for THIS list. **Do not put Export inside it** — Export is not an import, and
folding it in would recreate the very separation-from-Import problem stated above by another route
(a reader scanning for "Export" would now have to open "Import ▸" to realize Export is not there).
Keep Export EPANET as its own row directly beside the Import submenu's trigger row, so the two are
still adjacent by eye even though one is now a fly-out.

**Recommended shape**, reconciling both findings — not a redesign, a reordering of rows already
built: New project…, Open…, Open example…, [separator], Save, Save as…, Save all, [Convert
coordinates as…, Convert units as… — see below], [separator], **Import ▸** (EPANET file,
libraries, surveyed points), Export EPANET file…, [separator], Revert, Close. This keeps Import and
Export adjacent (his own 2026-09-17 fix), matches GIMP's placement of the foreign-format pair
after the Save family rather than before it, and only differs from his literal proposal in where
the whole Import/Export block sits relative to Save. **If he still prefers the block up near Open**
that is a coherent, different mental model (group by ACT: acquire vs. persist), not a wrong one —
the one part of his order I would not accept without discussion is separating Import from Export.

**Is he right that Revert is ill-considered?** Checked what it actually does before answering
(rule: never take the diagnosis on faith). OBSERVED (`:24255-24280`, `revertCurrent()`): it
requires `entry && handle` — a live File System Access handle to a linked file on disk — and is
menu-disabled unless `linked && entry && entry.dirty` (`:26508`). **His first case (an unsaved
project reverting "to blank") cannot happen: the row is already refused before he ever gets there,
because an unsaved project has no handle to revert to.** His premise for removing it on that
ground does not describe the shipped behavior.

**His second case (a saved, dirty project) is directionally right but understates what the command
already does.** `revertCurrent()` re-reads the SAME file from disk, replaces the document,
clears undo, clears the dirty flag, re-stamps the file handle and clears the "changed elsewhere"
flag — an outcome close to close-without-saving-then-reopen, yes. But it is not a redundant
synonym for that pair of commands: OBSERVED, two OTHER flows in this file already name Revert BY
NAME as the sanctioned path and would need rewriting if it went away — the "somebody else has
saved to this file" warning (`:23781`: *"Use File, Save as to keep your changes in a file of your
own, or File, Revert to throw yours away and load theirs"*) and the "that file is already open
here" collision message (`:24489`: *"Use File, Revert if you want the version on disk instead"*).
The second of those is the sharper point: **while the file is open in this tab, using Open on the
same file does NOT behave like a fresh reopen — it detects the collision and defers you back to
Revert** (`:24476-24489`). So "close then reopen" is not actually a free substitute available
today without an extra step (closing the tab first); Revert is the one-step path to the exact
scenario the app is already built to expect people to reach for.

CITED (Apple, macOS document architecture — flaviocopes.com/macos-revert-file-version and
osxdaily.com/2012/10/04/revert-file-last-saved-version-mac-os-x, both fetched 2026-09-18): **every
native macOS document app ships `File > Revert To > Last Saved` as a system-provided command** —
this is not a bespoke feature somebody invented, it is close to the single most standard "throw
away my unsaved edits" convention in desktop software, and GIMP's own placement above (Revert
directly beside Save/Save As/Save a Copy) is the same idea in a cross-platform app. **Revert is not
ill-considered — recommend keeping it**, correcting only the premise about the unsaved case (moot,
already refused) and noting the saved case is a genuine, already-load-bearing shortcut rather than
a redundant synonym.

**Where do "Convert coordinates as…" and "Convert units as…" belong?** OBSERVED
(`:11908-11924`, worktree `feat-xy-world-map`, checked 2026-09-18): **"Convert coordinates as…" is
not a new feature to design — it is `georefStart()`, the OLDER of two georeference wizards, and the
comment at `:11922-11924` says so directly: *"georefStart(), the wizard beside this one, is the
opposite and rewrites every coordinate -- which is why that one is now the exception path reached
from File, Convert coordinates as."*** That sentence is Tom's own plan, already written into the
source, one day before he asked me the question. It confirms his placement logic: this command
takes the CURRENT project and produces a rewritten one, the same family as Save As rather than
Open/Import (which bring in something new) or Export (which hands a copy to someone else). His
instinct to group it with the Save-as family, ahead of Export, is right and already anchored in
code comments, not just in his message. "Convert units as…" (future, unbuilt) is the same shape by
extension — a transform that produces a new project state — and belongs beside it for the same
reason.

### Where I did not look
I did not fetch a live Blender documentation page this session (general knowledge, flagged above as
the weaker of the two File-menu citations). I did not check Adobe Illustrator's current menu from a
fetched source — my Illustrator recollection agreed with the GIMP/Blender pattern (Revert and
Place/Export both live near the end, not between Open and Save) but I dropped it from the final
citation list rather than assert an unfetched specific. I did not render either menu in a browser
this session; the row order and the Revert `disabled` logic are read from source, not screenshotted.

### Question 2 — the georeference wizard's step 2

**Two different step-2 wizards exist in this file, and Tom's complaint is almost certainly about
the OLDER one, not the one the brief pointed me at.** OBSERVED (`feat/xy-world-map` worktree,
checked 2026-09-18): `georefStart()`/`GEOREF_STEP_ATTACHED` (`:11563` on, hint at `:10939`: *"drag
the model to move it, drag a corner to resize it, drag the round handle... to rotate it"*) is the
OLDER wizard for placing a brand-new xy file on the map for the first time, and its own comment
block admits it literally does what Tom describes: *"the DRAWING is fixed -- it is the frame -- so
a drag would have to move the map"* (`:11906-11908`) is written about the OTHER, newer wizard by
contrast — meaning the older one's drag genuinely does act on the model. **`mapgeo` /
`MAPGEO_STEP_FINE` (`:11944` on) is a SEPARATE, newer system, dated the same day as Tom's own
question (comment header `"THE CUSTOM GEOREFERENCE WIZARD (Tom, 2026-09-18)"`, `:11913`), built
from his own written spec quoted verbatim in the source: *"(2) We show a drag, scale rotate
rectangle/square that controls THE WORLD MAP, NOT THEIR PROJECT."*** The brief's description of
step 2 ("drag the body to slide the map, a corner to resize it, the round handle to turn it") is
`mapgeo`'s own hint text near word for word (`:12161`), so this is almost certainly the feature he
tested.

**Is the affordance reading backwards, or does the control actually do the wrong thing? Checked,
and it is the READING, not the behavior — which is also what Tom's own sentence already says.**
Traced the math: `mapgeoTranslated`/`mapgeoScaled`/`mapgeoTurned` (`:11969-11988`) only ever write
`project.georef` (the transform), never `doc.nodes`; `mapgeoDrawFrame()`'s rectangle is captured
ONCE in latitude/longitude (`mapgeoCaptureRect()`, `:12163-12175`, called "nailed to the ground,"
comment at `:12150-12152`) and re-derived every frame by converting those FIXED lon/lat corners
back through the CURRENT (changing) transform — so as you drag, the rectangle's real-world position
never moves and its on-screen position follows the ground; `paintBasemapTiles()`
(`:9508-9576`) recomputes which tiles to fetch and where to place them from the SAME live
transform on every call, so the basemap genuinely repaints under the still drawing. The DRAWING
itself (`doc.nodes`) is rendered through no georef path at all and is provably untouched
(comment at `:11890-11891`: *"THE PROJECT DOES NOT MOVE, AND THAT IS THE WHOLE FEATURE"*). **So the
control already does what Tom wants it to do — his own complaint even says so in his own words:
"it has a weakness of APPEARING to apply to the project when it needs to apply to the map," not
"it applies to the project."** This is his diagnosis stated correctly by himself; I am only
confirming it against the code rather than taking it on faith, per the standing "verify before
ranking" rule.

**Why it reads backward anyway, which is squarely this seat's question.** The rectangle's REST
STATE is drawn exactly coincident with the drawing's own bounding box (`mapgeoExtent()` — the
DRAWING's extent, `:12163-12164` — captured as the rectangle's ground footprint at the moment step
2 opens). Its stroke, corner handles and round rotate handle (`:12191-12220`) are the identical
visual grammar every direct-manipulation tool uses for "select and transform THIS shape" — Adobe's
own Free Transform box, PowerPoint/Keynote's object resize handles, Figma's selection bounding box
(CITED: general, unfetched knowledge of a construct near-universal in graphics software; not
sourced to one page this session, flagged as weaker). A box that starts life drawn exactly on top
of the thing a reader already thinks of as "mine" borrows a convention that means "grab this
object" everywhere else it appears, regardless of what it is mathematically anchored to underneath.
That is a first-glance/rest-state problem, not a during-the-gesture one — Gestalt "common fate"
(elements that move together read as one thing) would actually start CORRECTING the misreading
the moment a drag begins, since the rectangle visibly separates from the still drawing; the
vulnerable moment is BEFORE any drag, when the two are indistinguishable.

**Recommend fixing the affordance of the existing rectangle rather than building his slider, and
say why the calculus changed once the code read confirmed the behavior is already correct.** Four
cheap, additive changes, ranked:
1. **Draw the rectangle visibly larger than the drawing's own bounds at rest** (pad
   `mapgeoExtent()`'s box by roughly 15-20% before first draw) — the single cheapest fix, because a
   frame that visibly extends past its contents reads as a viewport/window rather than a selection
   of the content it contains. One number, no new geometry.
2. **Swap the "shape transform" idiom for a distinguishable one** — corner brackets (viewfinder-
   style, open corners) rather than solid squares, and a stroke colour not already used for a
   selected network element on this page, so it cannot be read as this page's OWN selection
   highlight repurposed.
3. **A persistent label ON the frame** ("World map" or similar), not only in the dismissible
   status-bar hint text — this suite's own evidence elsewhere argues for this: the Hide-titles
   notice went from 4 s to 120 s and MJH still never saw it (wishlist item 21's citation), so a
   transient toast is the wrong instrument for a standing fact about what a control is.
4. Lower priority: a distinct cursor on the handles.

**Do not lead with the slider.** I considered it seriously (and would have recommended a hybrid —
keep direct-drag for Move, replace Scale/Rotate with a bounded slider and dial — before finding
`paintBasemapTiles()` and confirming the transform-only write). Once the underlying behavior is
confirmed correct, the case for discarding direct manipulation weakens a lot: the slider's real
virtue is that it CANNOT be misread (there is no object drawn on the drawing at all), which is the
strongest possible fix, but it costs the one thing direct manipulation gives for free here — live,
eyes-on alignment of the drawing against real streets and imagery in the basemap while dragging,
which a person fine-tuning a placement wants. A slider still shows that live feedback (the
rectangle/drawing preview updates as it moves), so the visual feedback loss is smaller than it
first appears, but it is still a bigger rebuild for a problem four cheap changes to the existing
control can likely solve. **If the restyled rectangle is tried with a real person and still reads
backward, the slider is the right fallback — his proposed range (1 in the middle, a band narrowed
toward 0.75-1.5) is sound and matches the "Pick it up again" escape hatch he named**: OBSERVED,
that escape hatch already exists and is not speculative — `mapgeoAdjust('scale')` /
`mapgeoAdjust('move')` (`:12085-12112`, wired as Map > World map > "Move" / "Scale by picking",
`:12061-12070`) reopens step 2 on the transform already on file, so a bounded or even wrong first
attempt is always correctable without starting over. That is a legitimate reason to keep any
future range narrow, independent of which affordance ships.

**One thing I could not verify and flag rather than assume:** whether `paintBasemapTiles()`'s tile
refetch during a live drag is visually smooth (already-loaded tiles repositioned instantly, new
ones filled in async — the standard slippy-map pattern) or whether there is a perceptible lag/jump
per frame that would ALSO make the map look inert while only the rectangle appears to move,
reinforcing the wrong reading through actual behavior rather than pure affordance. I read the
function that decides WHICH tiles and WHERE, not the paint/DOM-update path that decides HOW FAST
the visible image catches up, and did not render this in a real browser. If a live pass shows a
perceptible lag, that finding would raise this from a pure affordance question back toward "what
the control does," and is worth a `dev/browser-pass` check by whoever builds the fix.

### Where I did not look
I did not open `dev/browser-pass` this session for either question — every finding above is a
source read, not a screenshot or a measured render. I did not verify the older `georefStart()`
wizard is in fact what Tom tested versus `mapgeo` — that is an inference from the brief's wording
matching `mapgeo`'s hint text and from the comment explicitly naming `georefStart()` as the
"exception path," not a transcript quote confirming which one he opened. I did not check whether a
selection-highlight colour used elsewhere on this page collides with the current `#05a` stroke
used for the frame (`:12200` etc.) — recommendation 2 above assumes it might and should be checked
before building, not asserted as already true.

No shipped file touched; the worktree was read only, per the brief.
## 2026-09-18 — Escape and non-modal boxes; and a second opinion on remembered initials

Checked master at `fb9bdc24` and branch `feat/lock-initials-later` at `37f05c7e`, both 2026-09-18.

### Question 1 — Escape closing Properties/Settings when they are not in focus

**What is actually shipped, and why Tom's complaint is correct as stated.** OBSERVED
`js/looped-network.js:25258-25305` (checked 2026-09-18): one `document`-level `keydown` listener,
not scoped to focus at all, runs `closeMenu(); closeViewPopovers(); closePopup(); closeSettingsBox();
closeLibraryBox();` on every Escape press anywhere on the page, THEN falls through to "leave the
armed tool" and "clear the selection" if nothing was open. So today a Properties or Settings box
open in the corner of the screen, that the reader has not touched in the current gesture, is closed
by an Escape meant for something else entirely — exactly the shape of his complaint. This is a
FOCUS bug, not a "should Escape ever close these" bug: the handler doesn't ask `document.activeElement`
anything.

**The real close routes are ordinary buttons, not Escape-only.** OBSERVED `Looped-Network.php:664`
(`#lpn_popup`, the Properties box), `:682` (`<button type="button" id="lpn_popup_close" ... aria-label="Close">×</button>`),
`:743` (`#lpn_setbox_close`, same shape for Settings), `:997` (`#lpn_libbox_close`, Libraries). All
three are real `<button>` elements with `aria-label`/`title` = "Close" (`lpn_close`), so they are
in the normal Tab order and fire on Enter or Space like any button. **A keyboard-only visitor with
no pointer at all is NOT stranded if Escape stops closing these boxes** — Tab to the × and press
Enter still works, it is just more keystrokes than one Escape. That directly answers the brief's
accessibility question: Escape is not the only keyboard route here, unlike the zoom control I found
had no keyboard route at all (Task 682, journal 2026-09-17) — this is a different, milder case.

**Convention.** CITED (Sarah Higley, "Escaping 101," sarahmhigley.com, fetched 2026-09-18): real
platforms disagree on Escape's exact scope and the article's own conclusion is that there is no
universal rule — but the piece's organizing distinction is FOCUS: "combobox menus and tooltips
never take focus, so no active focus handling needs to occur when they are dismissed," while a
component that DOES take focus (a dialog, a slide-pane, certain menus) should hand focus back to
whoever opened it when Escape closes it. That is a convention that Escape is legitimate wherever
the thing being dismissed currently HOLDS the interaction — never that it reaches into a panel
sitting unfocused in the background. CITED (WAI-ARIA Authoring Practices Guide, w3.org, general
knowledge of the disclosure/dialog patterns, cross-checked via search 2026-09-18): Escape is
documented per-widget, on the widget that has focus, not as a page-wide "close everything open" key.
SPECULATION, from ordinary use of desktop tools rather than a citation I can point at: docked
panels in image/CAD editors (a Photoshop-style Layers palette, an Illustrator-style Properties
panel) are not closed by Escape at all — Escape in those tools cancels the current operation or
deselects, and a panel is closed by its own control. That is the same shape Tom is naming with
"non-hog boxes," and it lines up with his Vision 1 rather than contradicting it. I could not verify
this against a written spec in the time budgeted; treat it as informed guesswork, not a citation.

**Which rule I would ship.** Not his blunt version and not a no-op — a **focus-scoped** version:
Escape closes Properties/Settings/Libraries only when the keypress lands while focus is *inside*
that box (`document.activeElement` under `#lpn_popup` / `#lpn_setbox` / `#lpn_libbox`); an Escape
pressed anywhere else on the page — the canvas, the toolbar, a field, empty space — leaves an
unfocused box exactly where it was and falls through to the tool/selection behavior it already has.
This is the smaller change the brief asked me to weigh against the blunt one, and I think it is
also the *better* one on the merits, not merely the cheaper one: it keeps a genuine keyboard exit
for the one visitor who tabbed INTO the box and wants out without walking back to the × — a real
person, not a hypothetical, since the box's own fields are all reachable by Tab and a reader
already inside a Settings box that wants to leave it is the case Higley's rule protects. Tom's
blunter Vision 1 (Escape can NEVER close these, click only) is defensible and is not an
accessibility regression either, given the real × buttons — but it throws away a working keyboard
exit for no reader-visible benefit over the focus-scoped fix, which already stops the exact
complaint he filed (a box he was not touching disappearing). I would ship focus-scoped first,
and treat "never" as the fallback if testing shows even the scoped version still feels wrong in
practice — that is a testable difference, not a hunch either way needs to resolve on paper.

One implementation note for whoever builds this, not a design opinion: `closeMenu()` and
`closeViewPopovers()` (menu pull-downs and view popovers) are a DIFFERENT class of thing from
these two boxes — a pull-down is the disclosure-menu pattern Tom's own 2026-08-13 ruling already
names ("these are menus, not boxes") and Higley's non-focus-taking case applies to it cleanly.
Nothing above touches that part of the handler; only the `closePopup()` / `closeSettingsBox()` /
`closeLibraryBox()` three lines want the focus guard.

### Question 2 — remembering initials across roles: is it good thinking, mostly, with one flag

**This proposal collides with a decision made on `feat/lock-initials-later`, not yet on master,
and the code comment calls it "the whole point."** OBSERVED `feat/lock-initials-later`
`js/looped-network.js:23261-23291` (checked 2026-09-18, branch head `37f05c7e`): identity is now
minted SILENTLY with an empty name (`identity = { holder: randomToken(24), name: '', trained: false };`)
— nobody is asked anything to acquire a lock — and the name a colleague types into the new "Ask"
dialog is, in the comment's own words, **"SENT, never stored — that is the whole point of Task
667(b)."** That is the design ROADMAP Task 667(b) (`dev/ROADMAP.md:569-588`) already shipped on
this branch, and it is a closer read of what Tom rejected than "asking is startling": he rejected
asking AND he rejected the software remembering a name outside the one moment it is volunteered
for one purpose (telling the current holder who wants in). Tom's new proposal is a second, explicit
reversal of the "never stored" half, on the same day the branch that just built it is sitting
unmerged.

**Is it good thinking anyway? Mostly yes, on the part that matters, but say so as a reversal, not
a refinement.** The two halves are not equally strong:
- **"Ask once per browser"** is close to free and does not reopen the registration worry: it is
  the SAME event (pressing Ask) that already gets a name today, just remembered so the SAME person
  is not asked a second time in a later session. Nothing about the trigger changes — nobody is
  solicited for a name at Save, ever, on this design. I see no real cost here.
- **"Use it to name the holder in role A"** is the part that reopens the reversed decision. It
  means: once a browser has ever answered an Ask, every lock THAT browser holds from then on is
  labeled with that name automatically, with no fresh prompt — so a name given once for one purpose
  (telling a specific colleague who wants a specific file) becomes a standing label the software
  attaches to that browser everywhere, indefinitely. That is a small, real account, acquired by
  accident of having once pressed Ask rather than by anyone choosing to register one. It is milder
  than what Tom rejected (nobody is asked up front, ever), but it is the same shape at a smaller
  scale, and it is worth him hearing that framing before it ships, given how recently and how
  deliberately the "never stored" line was drawn.

**Storage: I read this as passing the existing exemption test, by the same reasoning already
applied to the identity token, not by a new argument.** OBSERVED `CLAUDE.md`, "What may be stored
on a visitor's device": the test is "strictly necessary for a service the visitor explicitly
requested." The per-browser identity holder token is already stored today, unconsented, on master
AND on the branch (`LPN_IDENTITY_KEY`/`lpn_identity` in `localStorage`, both versions) — that
storage already shipped under the user-input-storage exemption Tom's own file names: he typed it
into a box to use a feature (locking on master; Ask on the branch). Remembering the NAME half
alongside the token it is already stored beside is the same category of thing, not a new one — I
would not gate it behind a new consent question, and I think doing so would be over-cautious given
the precedent already standing in this file. I did not find a rule in `dev/cookie-storage-inventory.md`
that treats a name differently from an opaque token for this purpose; if Tom or a later reader
disagrees with that reading, that is the file to correct it in, not a new banner.

**What happens when the name is wrong — real, but not a NEW risk, an existing one this proposal
widens.** A stale or borrowed name on a shared machine is already possible today: master's own
shipped identity (`js/looped-network.js:24222-24227`, OBSERVED, checked 2026-09-18) asks ONE person
for initials at first save and reuses them forever after for every lock that browser takes, with no
per-session re-check — so "confidently wrong on a data-loss-adjacent dialog" is a live property of
the CURRENT shipped design, not something this proposal introduces. What it does is widen the
window: today the name is set at the first deliberate save (a moment the person is paying
attention), Tom's proposal sets it via Ask, which can be answered quickly and less carefully by
someone reaching for a dialog that showed up unexpectedly, on someone else's project. I would not
block the idea on this, but I would want an easy, visible way to correct a wrong stored name — a
"not you?" affordance beside wherever the initials are used to label a lock — since the cost of a
confidently wrong name on a break-lock decision is exactly the shape CLAUDE.md worries about
elsewhere (a share card reading "undefined" is a defect only strangers see; a wrong name on a
lock is a defect only the person NOT holding the lock ever notices).

### Where I did not look
I did not render either box in a real browser this session — everything above is read from
`js/looped-network.js` and `Looped-Network.php` source, not measured on screen or in a headless
harness. I did not check `dev/lpn-spike/` or `dev/browser-pass/` for an existing Escape or identity
test that a focus-scoped fix would need to keep passing. I did not read `lpn-lock.php` (the
server side of the lock broker) at all — everything about "name" above is the client's own storage
and transmission of it, not how the server persists or exposes it. I did not check whether the
branch's Ask dialog has its own separate close-on-Escape wiring beyond the shared handler discussed
above; the "Escaping 101" citation is general convention, not a reading of that dialog's code.

No shipped file touched.

## 2026-09-19 — Sort-heading affordance: blue links, and the ID column's stray highlight

Tom's question, reviewing `feat/tables-spreadsheet`: *"Ask Ida how most apps do clicking on
headings to change sorting; we have blue text links."* Checked worktree
`feat-tables-spreadsheet` at `f688970a` (checked 2026-09-19).

### The convention, with sources

**A sortable heading is a real, focusable control — most commonly a `<button>` wrapping the
label text — carrying `aria-sort` on the `<th>` itself, never styled as a hyperlink.** CITED
(WAI-ARIA Authoring Practices Guide, "Table Pattern," w3.org, fetched 2026-09-19): "the header
text of sortable columns is wrapped in a button element," and `aria-sort` (`ascending` /
`descending`) is set on the currently-sorted header only — removed entirely from an unsorted one,
never left at a default `none`. CITED (MDN, "aria-sort," developer.mozilla.org, fetched
2026-09-19): same reading, one `aria-sort` live at a time. CITED (Adrian Roselli, "Sortable Table
Columns," adrianroselli.com, 2021, fetched 2026-09-19): his worked example uses native `<button>`s
throughout; the direction indicator is a small chevron placed to the right of the label, drawn
**always** (not hover-only), and the sorted state is shown by a SHAPE change (hollow chevron →
filled) rather than by color, explicitly to avoid relying on color alone (WCAG 1.4.1, "Use of
Color").

**Desktop precedent agrees on the shape even where I could not pin a single citable source for
each product's own style guide.** SPECULATION, from ordinary use and general knowledge rather
than a spec I can cite: Excel's own column headers (not the AutoFilter dropdown, which is a
separate, later-added control) and Google Sheets' plain grid headers are neutral gray/black text
with no underline and no color change; macOS Finder's List View and Windows Explorer's Details
view both put a small triangle at the trailing edge of the ACTIVE sort column only, in the
header's own ink color, with every other heading left as plain unmarked label text. None of these
color the heading text itself, and none underline it. The pattern is consistent enough across
every example I could find, cited or not, that I am confident in it as the convention: **a
sortable heading looks like a heading that also happens to be clickable — bold or plain text plus
a small directional glyph on the active column — never like a hyperlink to another page.**

**Why "never a link" is more than a style preference: the semantics are wrong.** A `<a href>`
promises navigation — leaving the current view for a different resource, with the back button as
the undo. Clicking a sort heading does the opposite: it stays on the same view and reorders what
is already there in place. Blue-and-underlined is the one visual vocabulary the web has spent
thirty years training every reader to read as "this leaves." Borrowing it for an action that does
not leave is a false promise, independent of whether it also happens to look nice.

### Our own table, read before recommending

OBSERVED `js/looped-network.js:18538-18576` (checked 2026-09-19): **the sort control is already
the right ELEMENT** — a real `<button type="button" class="lpn-pane-sort">` wrapping the heading
text, with `aria-sort` set correctly on the `<th>` only for the sorted column (`:18575`), and the
direction glyph (`▲`/`▼`) appended to the button's own text content on the active column only
(`:18548-18549`) — trailing edge, always visible when sorted, exactly the convention above. This
part needs no design correction; it is worth telling Tom so nothing here gets un-fixed by accident
while the real problem is chased.

**The "blue text links" he is seeing is styling laid on top of that correct element, not the
element itself.** OBSERVED `css/engcalcs.css:2371-2377` (checked 2026-09-19):

```
.lpn-pane-sort, .lpn-pane-goto {
	background: none; border: 0; font: inherit; padding: 0; cursor: pointer; color: inherit;
	text-align: inherit;
}
.lpn-pane-sort { font-weight: bold; }
.lpn-pane-goto { text-decoration: underline; }
.lpn-pane-sort:hover, .lpn-pane-goto:hover { color: #0645ad; }
```

At REST the sort button is `color: inherit` (correctly neutral) and bold — fine, matches
convention. But **on hover it turns `#0645ad`**, which is not an arbitrary blue: it is the
long-standing browser default color for a *visited* hyperlink, the single most recognized "this is
a link" signal on the web after the default unvisited blue. And `.lpn-pane-goto` — the button in
the ID cell, `:18617-18626`, which selects the part on the map and pans to it — is underlined **at
rest, permanently**, and shares the identical hover blue. Underline-at-rest plus link-blue-on-hover
is not a heading that happens to be clickable; it is, pixel for pixel, an ordinary inline hyperlink.
That is almost certainly what Tom is naming, even though no `<a>` tag is anywhere in this code —
the classic case of markup being correct and paint being wrong, which this suite's own automated
checks (`link_title_check.php` et al.) cannot see, because there is no `<a>` to inspect.

**What that costs at a row of ten headings, which is the question only this seat can answer.** A
reader scans a heading row once, fast, to answer "what can I do here and what am I looking at."
Blue-and-underlined text is a category the eye has a single, automatic reading for, learned from
every other page on the web: *leaving*. A row of ten such headings does not read as "ten sortable
columns" — it reads as ten hyperlinks sitting where a table normally has none, which is a
genuinely startling first impression on a page whose whole point is that you stay and work in
place. Worse, it COMPETES with the one control in this same table that legitimately IS a
navigation-flavored action: `.lpn-pane-goto` really does move the reader's attention to a different
place (the map), the nearest thing this table has to "leaving." Giving the sort headings the exact
same visual language as that button erases the one distinction a reader could have used to tell
"this reorders what I'm already looking at" from "this takes me somewhere else" — the two
controls currently look alike because they share a stylesheet rule, not because they mean the same
thing.

**Recommendation, ranked:**
1. **Drop `.lpn-pane-sort:hover { color: #0645ad }` and give it a neutral hover treatment instead**
   — a background tint or a slightly heavier weight, not a color already carrying a specific,
   different meaning elsewhere on this exact page (see below). Cheapest fix, one line, zero new
   strings, zero translation cost.
2. **Drop the permanent underline on `.lpn-pane-goto`.** If the ID cell should still read as
   "special," a hover-only background tint or a small icon (a pin/crosshair reading "go to this on
   the map") does the job without borrowing hyperlink vocabulary for an in-page action. This one
   costs slightly more (an icon decision), so it is second.
3. **Reserve `#0645ad` for exactly one meaning in this table, and it already has one:** OBSERVED
   `css/engcalcs.css:2229-2246` (checked 2026-09-19) — that same blue is the "current cell" outline
   and its autofill-dot, freshly designed and named by Tom himself on 2026-09-19 in the same
   session ("a blue border highlight... should indicate the current cell"). Two unrelated meanings
   sharing one color in one table is a hierarchy collision on its own, independent of the
   link-reading problem above — a reader who has learned "blue means current cell" then sees the
   identical blue flash under their pointer while merely hovering a heading, for a reason that has
   nothing to do with the cursor's position.

### A second, separate finding: the "strange highlighting around the ID" is likely this same seam

Tom's other, separate report — *"at column A there is a strange highlighting around the ID"* — is
very likely produced by the collision named in point 3 above, not a new bug needing new code.
OBSERVED `css/engcalcs.css:2229-2233` (checked 2026-09-19):

```
.lpn-pane-table tbody td.lpn-pane-cur,
.lpn-pane-table tbody td:focus, .lpn-pane-table tbody td:focus-within {
	outline: 2px solid #0645ad; outline-offset: -2px;
}
```

`:focus-within` fires on the `<td>` the moment its child `.lpn-pane-goto` button receives focus —
which happens on every ordinary click, since a `<button>` takes focus on click in most browsers.
Nothing in `paneTableRow()` needs to mark that cell "current" for this rule to paint the identical
2px inset blue box `js/looped-network.js` was just given as the deliberate, meaningful signal for
"this is the current cell in Entry/Navigate mode" (`:18617-18626` builds the button; the outline
rule is generic to any focused `<td>`, not gated on the spreadsheet-mode logic that owns
`.lpn-pane-cur`). So clicking an ID to jump to the map leaves that cell wearing the SAME visual
mark the new spreadsheet-mode design just invented for a different, specific idea — and it will
sit there, focus rarely being cleared automatically, until something else steals focus. **This
reads as the same root cause as the "blue text links" question: one color pressed into two jobs.**
Whoever fixes the sort-heading colors should check this outline rule at the same time — either
exclude `.lpn-pane-goto`'s own focus from painting the cell (`:focus-within:not(:has(.lpn-pane-goto:focus))`,
or simpler, give the goto button its own `:focus` ring instead of relying on the generic
`td:focus-within` rule) — rather than treating it as a second, unrelated defect.

### Where I did not look

I did not render the table in a real browser this session (no `dev/browser-pass` screenshot) —
everything above is read from source, not measured on screen. I could not find a single citable
style-guide document for Excel's or Google Sheets' or Finder's or Explorer's own header
conventions (all four are proprietary, undocumented visual conventions); that part of the finding
is SPECULATION from ordinary use, flagged as such above, not a citation I can point at. I did not
check whether `#0645ad` appears anywhere else on this page outside the bottom pane (e.g., the
map's own selection highlight) — if it does, the collision named above is wider than this one
table.

No shipped file touched.
