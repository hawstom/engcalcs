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
