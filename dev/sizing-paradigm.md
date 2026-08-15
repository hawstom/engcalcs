# Sizing text and symbols: the paper-units paradigm

Tom, 2026-08-14, after importing EPA's Net2 and Net3 and finding our sizing model did not survive
contact with real coordinate scales:

> I think that we may have been naive and we may need to get real about symbols and text in the
> mapping world. We are rubbing shoulders with the GIS world. And we need to follow the principle
> that has been present my entire engineering career, that **the end product of all text and symbols
> is in printed units, not real-world units**. Engineers and architects achieve precise control of
> prints by fixing the printed scale early and knowing exactly how high in real-world units the
> symbols and text are — but these heights are *calibrated to printed heights*.

This document records the paradigm, why it is better than what we have, and the one thing it makes
disappear.

## What we do today, and why it does not work

`settings.textSize` is a number in **map units**, with `textSizeUnits` offering `'map'` or
`'screen'`. Symbol size is **derived** from it: `symbolFactor() = textFactor() × symbolScale`.

Both halves fail on contact with an imported model:

- **Map units are not comparable across models.** Net1 spans 60×80 units, Net3 spans 37×31, a
  state-plane survey model spans tens of thousands. A text size of 20 is enormous on one and
  invisible on another. There is no number that is right for all three, which is why importing Net3
  produced a correct drawing nobody could see.
- **The symbol/text linkage is a workaround, not a design.** It exists because there was no absolute
  unit to express either size in, so tying one to the other at least kept them consistent with each
  other. That is the whole reason for the coupling.

## The paradigm

**Specify sizes in PRINTED units, and derive everything else.**

```
model-space height  =  printed height  ×  drawing scale factor
```

A drawing declares a **scale** (1:500, or 1″ = 40′). Text is specified as a height **on paper**
(3 mm, or 0.1″). The height in real-world units follows arithmetically. This is what AutoCAD's
annotative text does, what every dimension style's `DIMSCALE` has always done, and what QGIS calls a
*reference scale*. It is not a CAD quirk — it is how the profession has specified drawings for a
century, because **the deliverable is a sheet**.

Two properties fall out for free:

1. **Scale independence.** Import any model, declare its scale, and the text is right — because
   3 mm on paper is 3 mm on paper whether the model spans 40 feet or 40,000.
2. **Printing is correct by construction**, rather than by a separate print stylesheet that has to
   re-derive sizes and will drift. That is ROADMAP Task 175's hardest problem, solved as a side
   effect.

**We already have the missing half.** The map unit is *declared*, not guessed: `lpn_u_length`
(family `distance_site`) states that one map unit is one foot or one metre. So the conversion from
paper to model units is available today, and no new user input is needed beyond the scale itself.

## What it makes disappear

**The symbol/text independence Tom asked for is not a feature to build — it is what happens when
you stop needing the workaround.** Under paper units, text is "3 mm" and a junction is "2 mm", each
stated absolutely and independently. There is nothing to link, and `symbolScale` — a *relative*
control that exists only because neither size had a frame of its own — becomes unnecessary.

That is the test of whether a paradigm is right: it removes a control rather than adding one.

## The honest tension

**The screen is not paper, and for many of this suite's users the screen IS the deliverable.** A
phone in a field office is not going to plot anything. Three paradigms are each correct somewhere:

| paradigm | sizes are | right for |
|---|---|---|
| **map units** (today's default) | part of the drawing | a design sketch you zoom around |
| **screen units** | constant on screen | interactive web maps — what Mapbox and Leaflet do for labels |
| **paper units + scale** | calibrated to a sheet | the printed deliverable, and every engineer's mental model |

The resolution is not to pick one. It is to notice they disagree about **storage** and **rendering**,
and separate those:

- **STORE in paper units plus a scale.** That is the ground truth, it is what the deliverable needs,
  and it is the only one of the three that is meaningful across models.
- **RENDER by a display mode.** Print and PDF are exact by construction. On screen, either scale
  with zoom (paper-like, "you are looking at the sheet") or hold constant (web-like, "you are
  looking at a map"). That is a view preference, and it does not touch what is saved.

Keep the screen-pixel floor (`LPN_MIN_TEXT_PX`, `LPN_MIN_SYMBOL_PX`) either way. It is a rendering
guard, not a sizing model — it guarantees a *visible* result while the paradigm supplies a *correct*
one, and they fail in different directions.

## Open questions before building

1. **Does a scale get declared, or inferred?** Inferring one from the model extent and the viewport
   is friendlier for a first-time visitor and dishonest for a plot. Probably: infer a starting scale
   on import, show it, let it be set exactly — the same shape as the text-size heuristic already in
   `docFromInp()`.
2. **Which paper unit?** mm and inches both, following the existing units strip rather than inventing
   a preference. Points are a third possibility for text specifically, and are what a typographer
   would expect.
3. **Does the scale belong to the project or the view?** Project, almost certainly — it is
   declarative like units are (CLAUDE.md: "there are no browser units, only PROJECT units"), and a
   drawing scale is a property of the drawing.
4. **What happens to existing saved documents?** They carry a map-unit `textSize` with no scale. A
   migration can derive an equivalent paper height once a scale is chosen, but the honest default may
   be to keep old documents rendering exactly as they do now and apply the new model to new ones.
5. **Is a scale bar now obligatory?** A drawing that declares a scale should probably show one.

## Related

ROADMAP Task 325 (sizing), Task 175 (a real printable version), Task 253 (clean map for
screenshots), and the import heuristic in `docFromInp()` which is the stopgap this would replace.

---

# Label visibility, and why the paper paradigm makes it sayable

Tom, 2026-08-14, describing how GIS does it:

> For visibility and non-visibility of labels, what you do is specify a zoom threshold in terms of
> how many units wide the map is. If there are fewer than that many units side to side on the map,
> labels appear. If more, they don't. This isn't the most intuitive thing to communicate… An
> alternative could be "Show when zoomed in to a map width less than ___." Same math.

He is right that it is the standard mechanism and right that it communicates badly. **But it
communicates badly only in map units** — and that is the same defect as the text size, in a second
place. "Show labels when the map is under 4,000 units wide" requires the reader to know what a unit
is here, how wide their model is, and to do arithmetic.

**Under the paper paradigm the same control states itself**: *show labels at 1:500 and closer.* No
arithmetic, no model-specific number, and it is the sentence an engineer already says out loud. The
math is identical; the frame is what makes it speakable.

That is a second, independent argument for Task 326, and worth more than the sizing argument alone:
**a paradigm that makes an unrelated control intuitive is describing something real about the
domain.**

Related: at 97 nodes the clutter is the labels, not their size. Scale-dependent visibility and the
Labels panel are the same tool from two directions — one hides by *zoom*, the other by *field*.

---

# The one thing that stays in map units: the leader

Tom, 2026-08-14:

> I think that the vestiges of mapped units that we preserve are the leaders. They make sense only
> in terms of map units. They exist because something is close to something else in terms of map
> units. If they are not in terms of map units, then we don't need leaders.

This is the exception that makes the rule coherent, and it is worth stating precisely because it
looks like a contradiction and is not.

**Every other quantity on this map is ABSOLUTE.** A text height, a symbol size, a stroke width, a
visibility threshold — each is a property of one thing, and each is properly expressed on paper.

**A leader is not a property of anything. It is a RELATIONSHIP between two points in the model.** It
exists to say *this label belongs to that node over there*, and the "over there" is a fact about the
network's geometry, not about the sheet. So its endpoints are map coordinates by nature, while its
*thickness* is paper units like every other stroke. The leader is not an exception to the paradigm;
it is the one place where the two frames legitimately meet, and it meets them one property at a time.

## Why leaders exist at all, restated

A leader appears because a label could not sit next to its anchor. That crowding is a function of
**scale**: the paper size of the text against the paper distance between two nodes. Zoom in far
enough and any two nodes separate until no leader is needed; zoom out and everything collides. So
leaders are neither always necessary nor ever obsolete — **they are a function of the scale you are
drawing at**, which is exactly what Task 326 makes explicit.

## This answers the dragging question Tom left open

Task 328 records two candidates without choosing: label placement decided **once** and reused at
every zoom, or decided **per zoom band** until labels hide. Under the paper paradigm the answer
falls out rather than needing a preference:

**Placement belongs to a SCALE.** A drawing plotted at 1:500 has one set of callout positions, and
they are correct for that plot. A second scale is a second drawing and may want different ones —
which is precisely what AutoCAD's annotative objects do, holding a separate position per annotation
scale, and why that feature exists at all.

So: one placement per declared scale, not one per zoom level and not one forever. On screen, use the
placement for the nearest declared scale. That is simpler than a per-zoom-band rule, honest about
what a drawing is, and it has a century of practice behind it.

## The practical consequence

`lb.x` / `lb.y` today are a map-unit offset from the anchor — and under this reading that storage is
**half right**, which is why it half works. The anchor end is genuinely map-space and should stay.
The label end should be a direction plus a paper distance, so the text sits a fixed distance off the
leader on the sheet while the leader itself stretches or shortens with the geometry. Tom's own
phrasing — *"the fixed end point of the leader… possibly shortened at the same angle"* — is that
same split, arrived at from the drawing side.

## Correction, minutes later, and it is better: there is NO vestige

Tom, immediately after the above:

> Other hand, maybe they exist because of map units, but we store them only as angles. They could be
> nothing more than a hint to us from the user about the preferred direction we would do our
> conflict avoidance.

**This supersedes the section above and is a stronger answer.** Everything written there about
placement belonging to a declared scale — one set of callout positions per scale, AutoCAD's
annotative table — is more machinery than the problem needs.

The distinction it misses: **map units are the CAUSE of a leader, not something we have to STORE.**
Crowding is real and is a fact about map space. But the only thing we need to remember is *which way
the user would rather the label went* — and a direction is scale-free. Everything else (whether a
leader is needed at all, how long it is, where the text finally lands) is recomputed by collision
avoidance at the current scale, which is work the renderer already does.

So the stored quantity is **an angle**, and its meaning is a **hint, not a coordinate**:

- **Scale-free by construction.** An angle is correct at every zoom and every plot scale, so the
  per-scale placement table disappears before it is ever built.
- **Degrades honestly.** If the preferred direction is blocked at this scale, avoidance moves the
  label and the user's intent is still expressed as far as it can be. A stored coordinate has no
  such fallback — it is either honoured or overridden, and both are wrong.
- **It matches what the renderer already is.** `runLabelCollisionAvoidance()` is a placement engine;
  a preferred direction is exactly the input such an engine wants. Today we fight it by storing an
  answer; this feeds it a preference instead.

**Therefore the paradigm is total: nothing is stored in map units.** Text, symbols, strokes,
thresholds and label offsets are paper quantities; a leader's direction is an angle; the network's
own coordinates are the model. The "vestige" turned out to be a cause we were mistaking for a
measurement.

**The one thing given up, stated plainly:** exact placement. A drafter who wants a callout at
precisely that spot on a plot cannot have it from a hint. If that turns out to matter, the answer is
a per-label "pin" that stores a real position and opts out of avoidance — but it should wait for
someone to actually want it, because a hint is more robust for a drawing that re-solves and
re-labels on every edit.

---

# How to actually ship this: the GIS paradigm first, dragging last

Tom, 2026-08-14, closing the thread:

> Keep in mind here that the simple way to proceed is the way that EPANET-JS did it, which is to
> start only with the GIS paradigm. We align the labels with pipes, we assemble them the way we want
> to assemble them, and we make them disappear when we are zoomed out. No dragging. Dragging is more
> advanced.

**This is the sequencing decision, and it should be read before any of the design above is built.**
Everything earlier in this document is a good answer to a question that phase 1 may not have to ask.

## Phase 1 — the whole of it

1. **Sizes in paper units** (Task 326). Text and symbols specified for the sheet, scale declared.
2. **Labels placed by the engine.** `runLabelCollisionAvoidance()` already exists and already does
   this; it stops being handed a stored answer to argue with.
3. **Pipe labels aligned to the pipe.** Rotated along the segment axis, the way every GIS labels a
   road or a main. This is a real technique with a real payoff: an aligned label needs no leader,
   because its position already says what it belongs to.
4. **Scale-dependent visibility.** Hidden when zoomed out, shown when zoomed in — stated as a scale
   (*"show at 1:500 and closer"*), which the paper frame makes sayable.
5. **No dragging.**

## Why this is the right order, beyond "it is simpler"

**Dragging exists to fix a badly placed label. Items 2, 3 and 4 are three different ways of not
placing one badly.** So phase 1 does not defer the dragging problem — it may dissolve it, and we
will not know which until we have used it.

That is the same shape as two findings already in this document: paper units removed `symbolScale`,
and the angle-hint removed the per-scale placement table. **A paradigm worth adopting keeps deleting
controls.** If GIS-first placement deletes dragging too, that is the third instance and strong
evidence the frame is right.

## What this means for the work already recorded

- The **angle-as-hint** design (section above) is still the right answer *if dragging returns*, and
  it costs nothing to leave written down. It should not be built in phase 1.
- **Dragging ships today**, so phase 1 is not "do not build it" but "do not carry it forward
  unexamined". The honest question after phase 1 is whether anyone reaches for it any more.
- ROADMAP Task 328 drops accordingly. It is not wrong; it is premature.

## Amended within the hour: dragging is WANTED, just not first

> Want to do dragging, I think. It has been a major weakness of EPANET. We want to be able to turn
> off and on background masking. But I think we first want to test the GIS thing of aligning our pipe
> labels with pipes.  — Tom, 2026-08-14

My "phase 1 may dissolve the dragging problem" was half right, and the wrong half is the useful one.

**Automatic placement dissolves ROUTINE dragging** — the label nobody would have moved if the engine
had placed it well. That is most dragging, and removing it is a real gain.

**It does not dissolve DELIBERATE dragging** — an engineer arranging a sheet so that a particular
reader sees a particular thing. That is authorship, not correction, and no placement engine can make
the call because it depends on what the drawing is *for*. Denying it is exactly what makes EPANET
painful, so building automatic placement and stopping there would reproduce the weakness we set out
to fix.

**They share a gesture and are otherwise unrelated features.** Phase 1 removes the drudgery; Task 328
keeps the authorship. Sequencing stands — the angle-hint design can only be judged once we can see
what automatic placement leaves behind — but the destination is both, not one.

