# Wish list — data-entry-clerk

- **I add rows here; I never edit `dev/ROADMAP.md`.** Promoting a row is Tom's call.
- **Every row carries a citation and an honest size.** A row with no source is a guess.
- **Rank honestly, including against myself.** Something I found is not thereby important.
- **State the case once and do not campaign.**

## 1. Widen Task 186 to say what my seat needs it to say: paste-IN must be able to CREATE elements, not just edit them, and From/To + X/Y must become real columns

**Already on the roadmap** — `dev/ROADMAP.md` Task 186, priority 50, "Make the Tables pane
spreadsheet-interoperable." I am not proposing a new task; I am flagging that the task as worded
does not cover the case my seat exists to name, and I want the gap on record before it is built the
narrower way.

Task 186's own text scopes paste-IN as "paste parsing, per-column unit handling, undo integration,
and validation of every pasted cell" against rows the pane "already builds" — which are, by
`paneTableElements()` (journal, this session), one row per EXISTING `doc.nodes`/`doc.links` entry.
Built exactly that way, Task 186 lets a clerk overwrite the elevation and demand of 400 junctions
that already exist. It does not let a clerk CREATE those 400 junctions from a pasted spreadsheet,
because there is no "this ID is new, make it" branch anywhere in the pane today, and it does not let
a clerk type a pipe's From/To or a node's X/Y at all, because those columns are plain text
(`paneColEnds()`) or absent entirely (no X/Y column exists in any of the six specs).

That is the actual shape of "400 pipes from a marked-up plan set": an ID, two endpoints, a
diameter, a length, a roughness — six values, four hundred rows, and two of the six (the endpoints)
are exactly the thing this page treats as un-typeable identity. A paste-in that only touches scalar
columns saves real time but does not touch the workflow I was hired to look at.

**Size, honestly:** large, and larger than Task 186 as scoped. Row creation needs an ID-collision
story (does a pasted row with an unknown ID create, and with a known one edit — EPANET's own
`.inp` files answer this by section, which is worth reading before designing it), and a
From/To column needs a decision about what happens when a pasted node ID does not exist yet in
either direction — build both ends, or refuse the row and report it, the same as the `.inp`
importer already does for a dangling reference. I would sequence it AFTER Task 186's own two-phase
plan (OUT first, then IN on existing cells) rather than instead of it — the existing plan is not
wrong, it is just not the whole of what I would ask for. Say so explicitly if 186 is picked up: the
scalar-only version is real progress and should ship; it is not the finish line for volume entry.

## 2. A "New junction" action that does not require a canvas click first — EPANET's Data-Browser-Add-button shape

**Not found on the roadmap** under this framing (searched for "keyboard", "tab order", "surveyor",
"coordinate import" — nothing). Closest existing precedent in THIS repo is the pattern-editor's
one-field-instead-of-24 decision (`js/looped-network.js:23656-23661`), which is the same argument
one level down: fewer required pointer/tab round trips per typed value.

**CITED**: EPANET's Data Browser Add button creates a new junction/pipe/etc. from the object list
directly, opening its editor dialog without a map click first (see journal for the exact quote and
source). `lpn_` has exactly one door to a new node — the canvas pointer click — confirmed by reading
every call site of `addNode()`.

I am ranking this BELOW Task 186's widening because it only saves the "click to place" step for one
element at a time; it does not remove the 400-round-trips problem the way a working paste-in would.
It is also a genuinely harder DESIGN question than it looks, and I want to be honest about that
rather than undersell it: this page is positional by nature (a map, a geographic project stores
real longitude/latitude), so a node "added" with no click has no honest place to be born. EPANET's
own map is not geographic in the same sense ours can be, so its Add-button answer ("appears at some
default, then you move it") may not transfer cleanly to a geographic `lpn_` project. I would want
that question answered by the `utility-planning-engineer` or the geographic-projects document,
not invented here.

**Size:** medium engineering, genuinely open design question underneath it. I would not build this
before Task 186's widening (item 1) is at least decided, because a working paste-in solves the same
underlying complaint for the volume case this seat actually cares about, and may make this item
unnecessary for anyone entering more than a handful of elements by hand.

## 3. Arrow-key (Up/Down) navigation between property-popup fields, matching EPANET

**CITED**, same EPANET source as above: Up/Down arrow keys move between properties in EPANET's own
Property Editor, in addition to Tab. `lpn_`'s popup has Tab only (confirmed: no keydown handler
touches Up/Down inside `wirePopup()` or the field builders).

This is a small, honestly small, want. It would save nothing structural — Tab already reaches every
field in the right order — it would only match a muscle memory EPANET users already have, and it is
trivially muffleable (nobody who does not press an arrow key ever notices it exists). I am ranking
it low on purpose: it is the kind of thing my seat notices because it is cheap to notice, not
because it is where the real friction is. The real friction is items 1 and 2, and the gesture counts
in my journal say so by two orders of magnitude.

## 4. Say out loud, somewhere a new user finds it, that the Tables pane is the fast way to type numbers into many elements

**OBSERVED**, my own finding this session, not cited from outside: the Tables pane's tab order
already happens to be correct (see journal), so once elements are placed, typing their properties
through the Tables pane costs roughly a quarter of the pointer actions that the property-popup path
costs per element. Nothing on the page says so — no tooltip on the Tables toolbar button, nothing in
the walkthroughs URL I did not fetch this session. This is a documentation/discoverability want,
not a code want, and it costs one sentence in a tip or a walkthrough, not a feature. I am ranking it
above item 3 because it is nearly free and could be shipped correct on the first try, but below
items 1 and 2 because it does not remove the topology/position ceiling that Tables editing hits no
matter how well it is signposted.

## Disagreement with the roadmap's own framing, stated once

Task 186 is written from the OUT-first argument — "a model that already exists in a spreadsheet is
the case Tom named" — which is a reporting/submittal framing (the network is already built here;
get numbers OUT to a deliverable). My seat's case is the mirror image: the network does NOT exist
here yet, and the plan set is the spreadsheet. Both are real, and OUT is probably still right to
build first since it "cannot corrupt anything" (186's own words) — I am not asking to reorder that.
I am asking that IN, when it is scoped, be scoped against MY case (create, not just edit) and not
quietly narrowed to the safer half of the same problem.
