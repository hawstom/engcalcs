# Saved views: reproducing a figure (Task 765)

Tom, 2026-10-05: *"I am less interested in this Report Builder than I am in making it easy to
reproduce screenshots."* The workflow he describes is the ordinary one: the map is captured into a
word processor, and the figure has to be captured again, identically, after every design revision.

## What the Bentley exchange established, and what it did not

Read with Gemini on 2026-10-05. Kept: WaterGEMS has **Named Views** (window extent only) and
**Symbology Definitions** (colour coding and annotation), separately, and a **Custom Report** that
stacks blocks (map view, table, graph, text, page break) in one linear list under a root holding
page size, margins, header, footer and logo. A report is print-only. Restoring a view and a
symbology together in the working window is two actions. These are SPECULATION-grade until checked
against Bentley's own documentation; Gemini supplied them and also supplied invented detail (a
Ctrl+S binding, Bentley's motives, a JSON schema with field names nobody uses).

Discarded as decoration: "brilliant", "profound", "time machine", "the speed of human thought", and
the claim that the industry has failed for decades. None of it carries a fact.

**Rejected: storing map text in a scenario.** Gemini endorsed it because it was asked to. Against:
a scenario is a statement about the network and how it is operated, and Compare scenarios would
start reporting figure titles as differences; two figures of one scenario with different titles
would need two scenarios with identical hydraulics and two runs; and a child scenario that
"inherits the hydraulics and overrides only the cosmetic block" is Bentley's tree over
alternatives, which this project has declined (`bentley-is-not-ours`). **A view may REFERENCE a
scenario** -- which scenario and which time step the figure shows is part of what makes its
numbers reproducible -- **but it never stores anything in one.**

## The proposal

One object, a **saved view**, restored in one action, holding references and settings only:

1. **Window**: centre, scale and rotation (the same record a project already keeps for its own view).
2. **Appearance**: colour-by fields and their ranges, label fields, legend, basemap and its style,
   layer visibility (Task 639). Copied into the view, so changing the live settings later does not
   alter a saved figure.
3. **What is shown**: the scenario and the time step (or statistic, Task 735), by reference.
4. **Which Text is shown.** This is Tom's "hole": a title or call-out that belongs to one figure.
   Answer it with **Text layers** under Task 639: a Text belongs to a layer (default: the general
   one), and a view records which layers are on. A figure's title lives on its own layer and
   appears only in the views that switch that layer on. No scenario involved, nothing duplicated.

Basic use is one name and one click, "Save view as..."; there are no separately named halves until
somebody asks for them. Views ride in `serializeProject()` (modelling data, not window furniture).

**Then, and separately: Copy image.** Render the current view at a chosen pixel size (2x or 3x the
screen) to the clipboard or a PNG, so the figure is sharper than a screen grab. A thumbnail gallery
of views is a later nicety, not part of the first build.

**Not proposed:** a report builder. Tom ruled the word processor is where the report is written.

## Open for Tom

- The name: "View" (his objection: too generous for a window), "Figure" (says what it is for), or
  "Snapshot" (suggests a picture, which it is not).
- Whether a view also restores which panes and boxes are open (window furniture, so probably not).
