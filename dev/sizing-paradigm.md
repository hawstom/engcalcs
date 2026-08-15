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
