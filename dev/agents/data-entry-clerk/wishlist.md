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

## RE-RANKED 2026-09-04, second invocation: item 2 drops below the market-researcher's CSV-import row

Tom asked whether there is an industry standard for a keyboard door to new assets. There is one —
EPANET's own Add button, cited below — but researching it wider surfaced something more important
than the answer to that literal question: **every commercial tool I could source (Bentley
WaterGEMS's ModelBuilder, importing Excel/Access/shapefile; QGIS's delimited-text-layer path)
answers "I have hundreds of elements to enter" with a mapped FILE IMPORT, not a per-element keyboard
door.** EPANET's Add button is real, but it reads as EPANET's answer to adding ONE object without
reaching for the mouse, not as the industry's answer to volume. Full citations: journal, this
session.

That lines up with `dev/agents/market-researcher/wishlist.md` #1 (CSV/GPX import of surveyed
points), which I did not know about when I first ranked item 2 and which was reached from a
completely different angle (what a field survey actually produces, not what a keyboard seat wants).
**I am moving that row above my own item 2 in my own ranking** — a mapped import of an
id/x/y(/elevation) file is closer to what "400 pipes from a marked-up plan set" actually needs than
a keyboard-only Add button would be, because it removes the per-row round trip entirely rather than
shortening it by one click. I still think item 2 (below) is worth having eventually — a one-off
added junction with no click is a genuine convenience — but it is now THIRD in my own order, behind
both Task 186's widening (item 1) and the market-researcher's import row, and I am saying so against
my own earlier ranking rather than defending it.

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

## 5. Task 595's build proposal: the seven bindings (this seat's own answer, not yet Tom's)

Full research and the collision table are in the journal, third invocation, 2026-09-06. Summary of
the finding before the table: **no comparable tool binds a bare letter to tool selection.** EPANET,
QGIS and ArcGIS Pro document none; epanet-js binds exactly one letter (`Y`, scenario toggle, not a
tool) and its one asset-creation shortcut is a modifier held during an active drag, not an idle-state
key; AutoCAD's alias culture is real but lives inside a dedicated always-focused command line, a
mechanism `lpn_` does not have. **So this is not "join a convention" — it is "invent one," honestly,
and the proposal below is mine, not an industry standard's.**

Given that, I would still build it — a one-off Add without a mouse trip is a real, if small,
convenience — but I would pick letters by MNEMONIC clarity over any borrowed scheme, since there is
no scheme to borrow faithfully:

| Element | Key | Why this letter |
|---|---|---|
| Junction | `J` | Unambiguous initial, and the element a clerk places most |
| Reservoir | `R` | Unambiguous initial, no collision with anything |
| Tank | `T` | Unambiguous initial, no collision with anything |
| Pipe | `P` | Unambiguous initial, and the second most common placement |
| Pump | `U` | `P` is taken by Pipe; `U` is the second letter and reads as "pUmp" once shown on the tool's own tooltip — no perfect letter exists once Pipe has first claim, and this is the honest trade-off, not a discovery |
| Valve | `V` | Unambiguous initial, no collision with anything |
| Text | `X` | `T` is taken by Tank; `X` is arbitrary but is the character already used suite-wide for "close/remove," which risks the opposite mnemonic (Tom, if reviewing, may prefer a different arbitrary pick — I have no strong case for `X` over any other free letter here) |

**The gate, restated as one line of code, not a new design:** every one of the seven listens through
the SAME check the file already uses twice (`isTextEntry()` at `js/looped-network.js:29055`-ish,
`keyboardIsTyping()` at `:8330`) — `if (isTextEntry(e.target)) { return; }` before the bare-letter
branch fires. No new predicate is needed; reuse the existing one so the guard cannot drift from what
Delete and Ctrl+Z already enforce.

**Muffle:** the key calls the SAME `setMode('add-junction')` etc. the toolbar buttons already call
(`js/looped-network.js:19074`-`19080`), so a person who never learns the key sees nothing new on the
page. Discoverability costs one `title` attribute per existing toolbar button (`"Junction (J)"`-
shaped) — no new UI surface, no tooltip nobody asked for, no dialog.

**My ranking, restated once more:** third, behind item 1 (Task 186 widened to CREATE rows, not just
edit them) and the market-researcher's CSV/GPX import (Task 592, now raised to priority 75 by Tom).
The arithmetic: a tool-select key saves one click per TOOL SWITCH, not per element placed — for 400
junctions placed with one tool held the whole session, this saves at most a handful of clicks total,
while 186-widened and 592 each remove a per-ELEMENT round trip, 400 times. I would build 592, then
186-widened, then this — in that order — and I said so before Task 595 existed and am saying it
again now that it does.

## CORRECTION to item 5 (2026-09-06): the keys are DIGITS, not initials

My seven-letter proposal (`J R T P U V X`) is withdrawn. Tom read the bindings out of epanet-js
itself: `1` Select, `2` Junction, `3` Reservoir, `4` Tank, `5` Pipe, `6` Pump, `7` Valve,
`8` Customer, `M` multi-select, `Ctrl+K` search. Matching that where our objects match costs nothing
and buys an EPANET user's existing muscle memory; my letters bought a mnemonic and paid for it with
two collisions in seven. See my journal for what I got wrong in the research and the rule I have
written for myself about documentation-only answers.


## UPDATE 2026-09-06 to item 1: Task 186 raised to priority 100 and I was asked to design the selection model — full spec in journal, ranking within it stated here

Task 186 (spreadsheet-interoperable Tables pane) went to priority 100 and its roadmap text now
names this seat directly, asking for the selection model before it is built. I answered in full in
the journal, fourth invocation, 2026-09-06 (later) — anchor+focus selection matching Excel/Sheets,
key-by-key behaviour at the edges, what lands on copy, and the one behaviour (native browser
selection cannot span multiple `<input>` cells at all, so range-copy MUST be built on application
state and a `copy` event listener, never on native drag-select) that breaks the whole feature for a
spreadsheet-literate visitor if it is missed.

**My shipping order, restated here because it is a ranking and this file is where my rankings
live:** (1) range copy via Ctrl+C/drag/Shift+arrows, whole-table copy with headers and units — the
one piece with no safe partial version; (2) single-cell and range arrow-key navigation within one
table, including the `type="number"`→`type="text"` migration every cell needs first, because it is
the highest-volume keystroke in the whole spec; (3) Home/End/Ctrl+Home/Ctrl+End, real but
per-session rather than per-row; (4) paste-IN of a multi-cell block onto EXISTING rows, which is
real work with its own open questions (ID-collision, validation) and not a slice of 1-3; (5)
Ctrl+Shift+PageUp/PageDn to switch tables, which Tom's own words already rank "lower priority, but
very cool" and I agree with him.

**This does not change my item-1 ranking above** (paste-IN must be able to CREATE elements, not
just edit them) — that remains a request about SCOPE (what Task 186's "in" direction should
eventually cover) and is now item 4 of the shipping order for THIS piece of it, still after the
copy/navigation work that has no design questions left to answer. I am recording both because they
answer different questions: this entry is "in what order should the approved spec ship," the
original item 1 is "the approved spec's IN direction is narrower than my seat needs, widen it
before it is called done."

## UPDATE 2026-09-08 to item 1: paste-onto-EXISTING-rows has shipped; the remaining gap is narrower

**OBSERVED** (journal, fifth invocation): `panePasteAt()` (`js/looped-network.js:13677-13711`) now
tiles a copied spreadsheet block onto the Tables pane's current selection, with validation, undo
and a notice reporting what was refused or dropped. This closes the "no Add row control... no path
by which typing could ever set a pipe's endpoints" complaint for SCALAR properties of elements that
already exist — that part of my original item 1 is done.

**What is still missing, unchanged from the original ask:** row CREATION by paste. The function's
own comment says so directly: *"IT CANNOT GROW THE TABLE... Anything past the last row or the last
column is dropped and COUNTED."* From/To and X/Y are still not typeable at all (unverified again
this session whether that half changed; not re-checked). **Ranking unchanged** — still item 1,
still behind nothing I found reason to move it behind — but the size of the remaining gap is
smaller than when I wrote the original entry, and a future invocation should re-verify the
From/To and X/Y claim before repeating it, since the paste mechanism clearly moved since 2026-09-04.

## UPDATE 2026-09-09 to item 1: Task 610 split out, gated on this seat's own cell-format spec — delivered

Task 186 was split; the row-CREATION half is now Task 610, and Tom read this wishlist and wrote
*"I am sympathetic,"* then set three conditions, one naming this seat directly: pipe-vertex cells
need a stated format before anything is built. **Delivered in full**:
`dev/agents/data-entry-clerk/task-610-vertex-cell-spec.md` — the cell format (single `/`
separator, flat list, lat/lon or x/y per project type per CLAUDE.md's coordinate-order rule, why
a WKT-shaped nested format would be shredded by `libPasteCells()`'s own whitespace fallback on a
vertex-only paste), my endorsement of the Junction-coordinate-columns condition (no reservation —
it is the oldest gap I found, first invocation), and my recommendation on the ID/endpoint refusal
condition: validate the whole pasted block before writing anything, refuse the whole paste on any
row's failure, never a partial commit — the row-340-of-400 question the task asked me to answer.
Journal, sixth invocation, has the short version and the reasoning.
