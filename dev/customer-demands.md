# Customers and metered demands (`lpn_`) — design, not a build plan

Scope for ROADMAP Task 247. **Nothing here is built.** Tom raised the customer-management framing on
2026-08-24 and said in the same breath that he is not sure where it is headed, so this document's job
is to fix the shape and the rejected alternatives, not to commit to an implementation.

His steer, verbatim:

> "expand/envision as a Customer management model where we are adding Customer account numbers, and
> these are meters on the system. Not sure where this is headed, but let's at least think that way.
> And of course I assume that we lump the Customer demands additively at their nearest (by length)
> node. Graphically, I think you pick a point, it draws a meter rectangle, and then you pick a pipe
> and it connects perpendicularly from the meter to the pipe."

## 1. What a Customer is in the document model

**A Customer is a drawn object that carries a demand and an account number, is attached to a PIPE at
a position along it, and is NOT a node in the hydraulic model.** It lives in its own document
collection (`doc.customers`), sits beside `doc.labels` in every respect that matters, and its demand
is summed into a junction at solve time.

Tom's own lumping rule is what settles this: *lump the Customer demands additively at their nearest
node*. That sentence says a customer is not a node. It has a place on the map and a number, and the
network never sees it as anything but arithmetic on a junction it already had.

Two rejected options, and why:

- **REJECTED: a customer is a real node with a service lateral link.** Physically the truest model,
  and the one a utility's GIS uses. It is wrong here. A 20-node design network with 200 services
  becomes a 220-node, 200-link model — past the scale this calculator is deliberately built for
  (`dev/looped-network-calculator-scope.md`: ~10–20 nodes, *"our strength is the map interface, not
  capacity"*). Worse, exporting it invents pipes and nodes the user never drew, with lengths and
  diameters we made up, which is exactly the faking that CLAUDE.md forbids in the `.inp` path.
- **REJECTED: a customer is only a row in the junction's demand table, with no geometry at all.**
  This is nearly Task 468 and is genuinely cheaper, but it has already made the decision the drawing
  is supposed to make. If the user types the customer onto a junction, there is no *nearest node by
  length* question, no meter, no perpendicular service — the whole of Tom's gesture is gone. It is
  the right FIRST SLICE (§6) and the wrong end state.

### What the middle option actually costs

Do not let "it isn't a node" read as "it isn't an element type". Structurally it is one, and the bill
is real:

| Touchpoint | Work |
|---|---|
| `serializeProject()` / open / `docSignature()` | A fourth collection, plus a document version bump and a legacy-open path |
| Scenario seam | A fourth `ovKey` kind beside node/link/label; `purgeOverrides`, `overrideCountForElement`, and the popup's `setProp` rows. `dev/scripts/scenario_seam_check.php` is blocking, so a direct `_demand` write fails the build — good |
| Delete / rename / id minting | `deleteNode`/`deleteLink` must re-derive or detach customers (§2), never silently delete one |
| Hit-testing and drag | A new pick layer; a new drag target; the two-click placement gesture (§4) |
| Labels and collision | The meter box and its account number are two more boxes in `js/lpn-collide.js`, at a density the map has never had |
| `.inp` import/export | §3 — the hard one |
| Language | ~15–25 new `lpn_` keys, in scope in all 26 languages because `lpn_` is a core calculator |
| Small screen | The `max-width: 640px` layout and a two-click gesture on touch |
| Harnesses | `dev/lpn-spike/customer-harness.js`, plus the geometry in `js/lpn-geom.js` where it is pure and cheap to test |

That is a large feature. It is not a weekend.

## 2. "Nearest node by length"

State it precisely, because the meter attaches to a pipe and not to a node:

1. The attachment is a point **along the pipe's polyline** — a link plus a fraction `t ∈ [0,1]` of
   arc length. Pipes here are polylines (two end nodes plus user vertices), so the perpendicular foot
   is the nearest point on the polyline, which on a bent pipe may be a vertex and not a true
   perpendicular to any one segment. Say "the nearest point on the pipe", not "the perpendicular
   foot", anywhere the distinction can bite.
2. The assigned node is the pipe's `from` or `to` end, whichever is nearer **measured along the pipe**
   — not straight-line to the two node symbols. On a bent pipe those two rules disagree, and arc
   length is the one that means something: it is the pipe the water actually comes through.
3. A tie is broken deterministically toward `from`. Never randomly, and never by splitting the demand
   between both ends.

**Store the attachment, derive the node.** `customer = {id, account, demand, pattern, link, t, mx, my}`
— where the assigned junction is computed, not stored. The user's statement is *this service comes
off that pipe, here*; which end it lumps at is a consequence, and a consequence that is recomputed is
a consequence that cannot go stale. The precedent already in the code is `lenAuto` on a pipe length:
derived until the user types one. Same shape here — an optional explicit `atNode` pin, set from the
popup, which then wins and is shown as pinned.

Because the assignment is derived, the popup and the status bar must **show which junction this
customer currently lumps at**. Dragging a meter past the midpoint of a pipe silently moves flow from
one node to another otherwise.

Edge cases, each of which is a decision:

- **The nearer end is a reservoir or a tank.** A demand on a fixed-head node changes nothing in the
  solve (`EngCalcs.lpnIsFixedHead`). The rule still applies — do not quietly reroute to the second
  nearest junction — but the customer gets a `⚠` verdict saying the demand has no effect there.
  Report, do not be clever.
- **The pipe is deleted.** The customer is **detached, not deleted.** A Text label is deleted with its
  pipe because it is an annotation of that pipe; a customer is a service that exists whether or not
  anyone has drawn a main to it yet. It keeps its account number, demand and drawn position, is drawn
  unattached, and a status readout counts them: *N customers are not connected; their demand is not
  in the solve.* Silently dropping demand changes the answer without saying so.
- **The pipe is re-routed, a vertex is added or dragged, or an end node moves.** Re-derive. `t` is a
  fraction of arc length, so it survives a reshape approximately and the assignment may legitimately
  flip; that is visible via the readout above.
- **The pipe is split.** There is no split gesture today (double-click adds a vertex, which is not a
  split). If one ever ships, remapping every attached customer's `t` onto the correct half is part of
  that feature, and this line is the constraint on it.

The rule itself — nearest point on a polyline, arc length to each end — is pure geometry with no DOM,
so it belongs in `js/lpn-geom.js` beside `pointToPolylineDistance()` and is directly testable.

## 3. The `.inp` problem

EPANET has no customer object. Demands lump at junctions, and that is the whole of its model. So the
customer breakdown is ours, and CLAUDE.md is emphatic that we neither fake nor silently drop.

What is actually available in the format: `[DEMANDS]` takes multiple rows per junction, and EPANET's
own header line in `Net1/2/3.inp` names four columns — `Junction  Demand  Pattern  Category`. Our
importer reads the first three, sums them and reports `demand-categories`; it never sees the fourth,
because `js/lpn-inp.js` strips `;` comments before splitting a line and the category token is written
as a comment. **Our three reference networks all have an empty `[DEMANDS]`, so we have no sample of a
populated one — check the EPANET writer before relying on the comment convention.**

Recommended answer, in three parts:

1. **The numbers ride out, one `[DEMANDS]` row per customer**, with the account number in the
   Category position. A file we write then re-imports with the same total, and the breakdown survives
   as far as the format allows.
2. **The geometry does not.** The meter position, the pipe attachment and the perpendicular service
   have nowhere to go in an `.inp`. Say so, per customer, in the export report. Task 483 shipped the
   symmetric mechanism on the import side — a `{code, detail}` note filed on the element and composed
   into English at display time — and the export side wants the same discipline: a machine-readable
   loss record, not a hand-written sentence.
3. **Byte identity is not endangered, provided the rule is narrow.** Splitting a junction's demand
   into per-customer rows changes that junction's tokens, so it may happen **only for a junction the
   user actually gave customers to**. An imported junction nobody touched keeps its stored token
   verbatim, which is what `dev/lpn-spike/inp-export-harness.js` already asserts.

**REFUSED: fabricating service nodes and laterals on export so EPANET "has" the customers.** It would
round-trip beautifully and it would be a lie about the network, with invented lengths and diameters.

The honest sentence for the user: *the project file keeps your customers; the `.inp` file keeps their
totals and their names.*

### Task 468 and Task 247: two tasks, one data structure

They are **not one task**, and they are **not independent**.

- Task 468 is the junction-side breakdown: a list of demand rows, each with a base demand, a pattern
  (the type of user) and a category (who). Its vocabulary was settled 2026-08-21.
- Task 247 is a customer: a demand row that additionally has an account number, a place on the map,
  and an attachment to a pipe.

Build 468 first and let a Customer BE one of its rows, extended. If 247 goes first it invents a second
demand-breakdown structure, and then two flattening paths reach the importer, the exporter and the
solver. **468 is a prerequisite of 247, not a sibling.**

## 4. The gesture, and what it does to the drawing

The nearest existing precedent is a Text anchored to a node: `anchorNode` plus an `(x, y)` offset plus
a leader, with the leader side chosen by geometry. A customer needs the same thing anchored to a
**link at a position along it** — which is precisely the machinery Task 502 was extracted to build.
**247 and 502 share that seam; whichever ships first builds `linkAnchor {link, t}` once, for both.**

The gesture:

- Click empty canvas → the meter rectangle appears there and a rubber band follows the pointer:
  *pick the pipe that serves it.* Hovering a pipe highlights it and previews the perpendicular stub
  and the junction it would lump at. Click attaches. Escape or a click on nothing cancels and removes
  the meter — never leave a half-made object on the drawing.
- **Click directly on a pipe → one click is enough:** attach there and place the meter one default
  offset out on the open side. A row of twelve houses along one main is the common case, and it should
  not cost twenty-four clicks.
- The stub is drawn perpendicular from the meter to its attachment point. Dragging the meter moves the
  attachment; dragging past mid-pipe flips the assigned junction, which is why the readout in §2 is
  not optional.

Hit-testing and drawing:

- The meter rectangle is a real sized target and joins the pick list ahead of label boxes. The service
  stub is **not** pickable — like a leader, clicking it picks the meter. Pointer slop, not a 44 px
  touch minimum (CLAUDE.md).
- Draw the meter as a **screen-space glyph anchored at a world point**, like every other symbol here.
  A meter box is a symbol, not a footprint; a world-space rectangle would vanish at network zoom and
  swallow the map at street zoom.
- **Density is the genuine new problem.** Nothing on this map has ever had forty symbols along one
  pipe. The meter box and its account number are two more weighted boxes for `js/lpn-collide.js`, and
  they need a zoom-dependent rule — account numbers hidden, then meters drawn as dots — decided by
  measurement in the harness, not by taste. Price this as part of the feature; it is not a polish
  item to defer.

## 5. Design or management? Mostly design, with one line to hold

The suite is a design tool: you specify the performance you want and size to it. A named demand at a
place is squarely design — Task 468 already settled that a demand category names *who*, and *14
connections on this lateral* is how a small system's design demand is actually assembled. The rural
and irrigation audience Tom named is the case where the customer list simply **is** the demand model.

The account number is the first management-shaped thing in the suite, and the line is simple:

> **The account number is a LABEL on a demand, never a key into anything.**

That is the ruling Task 468 already records for its Category — the roadmap's phrasing is *"it is a
name, not a key"* — applied unchanged. No registry, no validation, no uniqueness enforcement, no
lookup. We cross into management only when we start doing things *with* the number: billing, meter
reads, consumption history, per-customer reporting over time, or a customer list edited outside a
network project. Those are out of scope, and the way to keep them out is to keep customers **inside
the project document** — the same argument that gave this page project units instead of browser units.

**One privacy note that is easy to miss.** An account number plus a map position is
personal-adjacent data in a way nothing else in this suite is. It stays in the user's own project like
everything else and we never transmit it — but it must never appear in a log row, a usage statistic or
an error report, and a shared project file now carries it. Anyone building this owes
`dev/cookie-storage-inventory.md` a paragraph.

## 6. Staged plan

- **Slice 0 — Task 468 (prerequisite).** Demand rows on a junction: base demand, pattern, category.
  Useful on its own and already scoped.
- **Slice 1 — the smallest useful customer.** An account-number column on those rows, plus a
  per-junction total. No geometry, no meter, no gesture. It ships the vocabulary and the export story
  (§3) and is testable before a single pixel is drawn — and it is the version that works on a phone.
- **Slice 2 — the drawn meter.** `linkAnchor {link, t}` shared with Task 502; the meter object, the
  two-click gesture, the derived-node rule, the detached state and the status readout.
- **Slice 3 — round trips.** Per-customer `[DEMANDS]` rows, the export loss report, and a harness
  asserting that an untouched imported junction is still byte-identical.
- **Slice 4 — only if asked.** Finding a customer by account number (Task 353's element search is the
  host), totals by pressure zone, bulk entry.
- **Never, without a new decision from Tom:** billing, consumption history, meter reads, or a customer
  store that lives outside a project.

**Recommended first slice: Slice 1**, on top of Task 468. It delivers the part of the vision that is
unambiguously design work, it settles the `.inp` answer while it is still cheap to change, and it does
not spend the drawing-surface budget before we know where this is headed.

---

## 7. Tom's rulings, 2026-08-24 — read these before building any of the above

He answered the open questions in this document. Where a ruling contradicts an earlier section, **the
ruling wins and the earlier text is what to change on the next edit.**

**Additive, and nothing is deducted.** *"468 is a sum of all the 247 plus any additionals at the
node (additive)."* And explicitly: *"For data entry, I think we don't do any fancy footwork like
deducting flows at the node as meters are placed."* So placing a meter never edits the junction's
own demand rows. A junction's total is what its own rows say plus what its customers say — one
direction, no reconciliation pass, and nothing the user typed is ever rewritten by a gesture
somewhere else (which is the suite's standing rule about the user's numbers, arriving here from a
different door).

**A meter may be a Type and a Count, not one object per service.** Tom's question — *"should we make
meter only a Type and Count object?"* — is the cheap answer to the density problem §4 prices, and it
is how a designer actually works: *forty-two single-family residential* is one line, one symbol, one
place on the pipe. **Recommendation: build the Count field from the start and let it default to 1.**
A customer with an account number is then the Count-of-1 case rather than a different kind of thing,
and no migration is needed the day somebody wants both. The account number and a count above 1 are
mutually exclusive in practice, and saying so in the interface is one sentence.

**Go by our own wits.** *"I am inclined on this to go blind by the best of our wits in case we
stumble on something better than the industry is doing."* So no more surveying of how epanet-js or
WaterCAD does it. What has already been measured about epanet-js stays recorded because it is a
fact, not a model to copy.

**Symbol sizes, from him, as a starting point to measure against:** meter a **2–4 px dot**, service
connector a **0.5–1 px stroke**. Real-world sizes of about **2 m across for the dot and 0.2 m for the
connector** — *"and meter and connector (service line) can keep size instead of scaling when map
extent gets bigger than 1000 m."* That is a **hybrid rule and it is the interesting part**: the
symbols scale with the world while the site is smaller than a kilometre across, then stop and hold at
their screen size beyond it. It is a different rule from every other symbol here, which are screen-
space always, and it is right for the same reason a survey plan draws a meter to scale and a system
map draws it as a dot. Measure it in the harness before treating the numbers as final.

**`[DEMANDS]` is itemized.** *"Maybe itemized is the right way to go. 100 Demands on a node may be
manageable, especially if we somehow lump/collapse them for presentation."* So the exporter writes
one `[DEMANDS]` row per demand row, which is legal EPANET and loses nothing — the alternative was
summing on the way out, which throws away the breakdown the whole feature exists to keep. **The
lumping is a PRESENTATION decision on our side**, in the pane table and the popup, and it must never
change what is written to the file.

**There is a Customer table, and he wants it.** *"First slice is good thinking. Customers on a
shoestring! And we can add a Customer table! Yes!"* The bottom pane already generates one tab per
asset kind from a list (Task 455), so a Customer table is a row in that list rather than a new
mechanism. **This also confirms the recommended first slice**: an account number on a 468 demand row
with no geometry at all, which is enough to fill a table, settle the `.inp` answer while it is cheap,
and spend none of the drawing-surface budget.

**An override for where the service attaches.** Raised under Task 247: *"we probably also need to
let there be an override for attachment point or, since you are suggesting saving it anyway, link
arc distance internally. I guess if they click on a meter it can create a temporary draggable circle
that slides along the pipe."* That is the `linkAnchor {link, t}` seam §4 already names, made
directly editable: selecting a meter shows a handle on its pipe that slides along it and is
constrained to it. **`t` is stored either way**, so this is a gesture on data we are already keeping,
not a new field — and it is the same handle Task 502 needs, which is the second reason those two
tasks must not build it twice.
