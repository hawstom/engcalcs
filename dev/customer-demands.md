# Customers and metered demands (`lpn_`) — design, not a build plan

> **THE ACCOUNT NUMBER WAS REMOVED ON 2026-09-19 AND THIS DOCUMENT STILL ARGUES ABOUT IT
> THROUGHOUT.** Read every "account number" below as history. Tom, that day: *"Didn't I say to trash
> Account number since they can just make a Custom property for that or anything else?"* and *"Since
> Customer is a pseudo-node, what if we provide existing properties like Description and Tag instead
> of Account number? Then we aren't inventing something, and we incur no language debt."*
>
> **A customer now carries `desc` and `tag`** — the same two identity properties every node and link
> carries, with the same writers, the same conditions in Find, the same one-word rule on the tag and
> the same no-newline rule on the description. `lpn_field_account` and `lpn_field_account_tip` are
> deleted. A saved project's `account` is CARRIED into the tag on open (into the description where a
> tag is already present), because a number that came out of a file is the user's.
>
> **The `[DEMANDS]` CATEGORY slot now carries the TAG**, which answers §3's open question from the
> other side: a tag is EPANET's own join key for a node or a link, so it is a better match for that
> slot than a field we invented. The DESCRIPTION is deliberately not written there — the slot is one
> token read back as a name, and a sentence would round-trip as its first word.
>
> What is unchanged is §5's ruling, which is why it survives its own subject: **it is a LABEL, never
> a key**. Nothing is unique, nothing is looked up, nothing reaches a log row.

Scope for ROADMAP Task 247. **Slices 1, 2 and 3 shipped 2026-09-15 together** -- the drawn meter,
the account number, the count, the derived junction, the draggable attachment, the Customer table and
the `.inp` answer. Tom asked for something to test, and the field work and the drawing surface touch
no common seam, so they were built in one pass rather than in the recommended order; §6 says which
parts of each slice are in and which are not. Everything above §6 describes the shape as built unless
a line says otherwise.

Tom raised the customer-management framing on 2026-08-24 and said in the same breath that he is not
sure where it is headed, so this document's original job was to fix the shape and the rejected
alternatives rather than to commit to an implementation; that is still what it is for.

His steer, verbatim:

> "expand/envision as a Customer management model where we are adding Customer account numbers, and
> these are meters on the system. Not sure where this is headed, but let's at least think that way.
> And of course I assume that we lump the Customer demands additively at their nearest (by length)
> node. Graphically, I think you pick a point, it draws a meter rectangle, and then you pick a pipe
> and it connects perpendicularly from the meter to the pipe."

## 1. What a Customer is in the document model

**A Customer is a drawn object that carries a demand, a description and a tag, is attached to a PIPE at
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

**Store the attachment, derive the node.** As built: `customer = {id, desc, tag, demand, count, link,
t, x, y}` — where the assigned junction is computed, not stored, and `x`/`y` is an OFFSET from the
attachment point while the customer is attached and an absolute position while it is not, which is
the dual meaning a Text label's own x/y already has (`customerPoint()` is the one door, as
`textLabelPoint()` is). `pattern` is read if a document states one and no control writes one yet. The user's statement is *this service comes
off that pipe, here*; which end it lumps at is a consequence, and a consequence that is recomputed is
a consequence that cannot go stale. The precedent already in the code is `lenAuto` on a pipe length:
derived until the user types one.

**NOT BUILT: the optional explicit `atNode` pin.** It was proposed here as the `lenAuto` shape's
second half, and Tom's own 2026-08-24 ruling supersedes the need for it: the attachment point is
user-draggable along its pipe (§7), so a reader who disagrees with the derived junction moves the
service to where it really connects, which states the same thing about the network and states it
where a reader can see it. A pin would be a second way to say it and the only one invisible on the
drawing. Build it only if a real case turns up that dragging cannot express.

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
own header line in `Net1/2/3.inp` names four columns — `Junction  Demand  Pattern  Category`. **All
four are now read and written (Task 468, 2026-08-26), and the fourth is the one to know about: the
CATEGORY IS A TRAILING `;comment`, not a column** — EPANET's own writer emits it that way and its
reader reads it back out of the comment, which is why our reader saw nothing there while it was
stripping comments before splitting. Our three reference networks all have an EMPTY `[DEMANDS]`, so
the fixture that exercises it is ours: `dev/lpn-spike/reference/multi-category.inp`, cross-checked
against the vendored engine in `dev/lpn-spike/demand-category-harness.js`.

Recommended answer, in three parts:

1. **The numbers ride out, one `[DEMANDS]` row per customer** — which is the writer Task 468 already
   ships, one row per demand, so this is a field on a row and not a new section. **AS BUILT, THE
   ACCOUNT NUMBER TAKES THE CATEGORY SLOT rather than a convention of its own**, and the reasoning
   reverses the sentence that stood here: the category is the one field of a `[DEMANDS]` row that can
   hold a NAME, Task 468's own ruling is that a category names *who* the demand is, and an account
   number is exactly that kind of name. A private key convention inside the comment would be a
   format only we can read, in the one file whose whole purpose is that everybody can. The row
   re-imports as a demand category named by the account number, which is the honest sentence below
   ("the `.inp` file keeps their totals and their names") arriving at the field level. The count is
   not in the file: the row states `count x demand`, the total, which is what the model means.
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

**TASK 468 SHIPPED 2026-08-26, and this is the structure Slice 1 extends — do not invent another.**

- A junction's demands are `EngCalcs.lpnDemandRows(node, base)`: **row 0 is the junction's own
  `_demand` / `demandPattern` / `demandCategory`, and `extraDemands` is every row after it.** That
  asymmetry is EPANET's own (its property sheet shows category 1 as the junction's Base Demand) and
  it is what keeps a one-demand junction — nearly all of them — the object it always was, so an
  account number added to a row costs no format change for anybody who has no customers.
- An account number therefore belongs on a demand row beside `base`, `pattern` and `category`, and
  `EngCalcs.lpnDemandItemized()` already decides which junctions must be written as `[DEMANDS]`
  rows rather than as a demand column. Slice 3's per-customer `[DEMANDS]` rows are that writer with
  one more field, not a second writer.
- **A demand row is NOT scenario-overridable and a customer's must not be either.** An override is
  keyed by an element and a property NAME; a row has only a position, and a position moves when a
  row above it is deleted, so a scenario would silently follow whatever row later occupied the
  slot. A scenario asks its question of the junction's demand — row 0 — through `setProp()`.
- The category is a **trailing `;comment`** in `[DEMANDS]`, not a fourth column. An account number
  has the same problem and the same one place to solve it (`js/lpn-inp.js`).

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
- **REMOVED 2026-09-18: the one-click door.** A press straight onto a pipe used to attach a meter
  there and place it one default offset out on the side of the press. Tom had it taken out --
  *"I did not ask for it, it could be difficult to manage... Let's remove it. It's of questionable
  value."* It is recorded here so it is not rebuilt: he liked it for a day (2026-09-17), listed the
  two things wrong with it -- the offset would have to become a Settings row, and left-versus-right
  was decided by a fraction of a pixel with nothing on screen to say so -- and then answered his own
  question in the other direction. **The later word wins.** The tool is two presses, always.
- The stub is drawn perpendicular from the meter to its attachment point. Dragging the meter moves the
  attachment; dragging past mid-pipe flips the assigned junction, which is why the readout in §2 is
  not optional.
- **THE METER IS THE INPUT AND THE CONNECTION IS DERIVED, in every writer** (Tom, 2026-09-18: *"You
  are putting the meter at the pipe point instead of at the meter point. Put the meter where user
  clicks. Snap perpendicular to the selected link or snap to the selected node."*). The second press
  names the pipe and states no station; the station is the nearest point on that pipe to where the
  meter already is. Getting this backwards is what the gesture shipped with, and it slid the symbol
  away from the hand by the distance between the two presses measured along the main.
  **On a node the offset is kept whole rather than squared**, because a junction is where several
  mains meet and there is no one of them to be perpendicular to.

**THE JUNCTION'S OWN BOX LUMPS THEM** (Tom, 2026-09-18: *"We need to lump the meters with an
expansion to see the connected customers and their demands."*). The property box listed every meter
serving the junction, which is fine at two and pushes the elevation, the demand rows and the resolved
answer off the bottom at forty -- the density problem below, arriving in the property box rather than
on the map. One shut line now states the count and the total, which are the two numbers the list was
being read for, and the meters are behind an expander. **Which junction's list is open is BROWSER
furniture** by CLAUDE.md's project-versus-browser rule: it is remembered for the life of the page so
a rebuild does not shut it under the reader's hand, and it reaches neither `serializeProject()` nor
`localStorage`.

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
an error report, and a shared project file now carries it.

**As built:** nothing writes an account number anywhere but into the project document.
`log_bucket_check.php` lists six appending log writers in shipped PHP and this feature added none;
the one logging call the placement gesture makes is `logLpnFirstAction('element')`, which records a
literal and names no element and no field. `dev/cookie-storage-inventory.md` carries the paragraph.

## 6. Staged plan

- **Slice 0 — Task 468 (prerequisite). SHIPPED 2026-08-26** — demand rows on a junction: base
  demand, pattern, category, itemized both ways through `.inp`. See the structure note in §3.
- **Slice 1 — the smallest useful customer. SHIPPED 2026-09-15**, though not in the shape proposed
  here: the account number is a field on the CUSTOMER rather than a column on a junction's own demand
  rows, because a customer turned out to be cheap enough to build whole. A junction's total picks
  every meter up through `demandRowsOf()`, which is the one door the map labels, the colour ramp, the
  Tables column, the popup's resolved Demand and both solvers already read a demand through.
- **Slice 2 — the drawn meter. SHIPPED 2026-09-15.** The meter object, the two-click gesture (its
  one-click door was removed 2026-09-18, §4), the derived-node rule, the count, the detached state, the slide handle on the pipe
  and a Customers tab in the bottom pane. **`linkAnchor {link, t}` was NOT extracted into a shared
  function** -- a Text already stores `anchorLink`/`anchorT` and a customer stores `link`/`t`, so the
  seam Task 502 is meant to build is still two spellings of one idea and is still that task's to
  unify. **NOT BUILT: the zoom-dependent label density rule** (§4's last bullet). The account number
  is generated annotation, so it hides with the rest of it at the one threshold this page already
  has; nobody has yet drawn forty meters on one main and measured what that looks like.
- **Slice 3 — round trips. SHIPPED 2026-09-15.** Per-customer `[DEMANDS]` rows, the export
  difference report, and `dev/lpn-spike/customer-harness.js` asserting that a junction which never
  had a customer writes the same row either way.
- **Slice 4 — only if asked.** Finding a customer by account number (Task 353's element search is the
  host), totals by pressure zone, bulk entry.
- **Never, without a new decision from Tom:** billing, consumption history, meter reads, or a customer
  store that lives outside a project.

**Recommended first slice was Slice 1**, on top of Task 468, because it settles the `.inp` answer
while it is still cheap to change and spends none of the drawing-surface budget. What changed is that
Tom wanted something to test; the reasoning was right and the recommendation was overtaken.

### Added 2026-09-18 on `feat/customer-find-labels`, from Tom's own list

1. **CUSTOM PROPERTIES ARE RESPECTED**, in the Properties box and in the Customers table, plus Find
   and Replace. A design whose "Applies to" carries **M** reaches a customer. `customPropTypeKey()`
   takes an explicit GROUP for this and for nothing else, because `elGroup()` is deliberately never
   asked about a customer -- a group answer would invite exactly the `setProp()`/`effective()` path
   §1 rules out. So the read and the write are PLAIN (`customerCustomValue()`,
   `setCustomerCustomProp()`), there is no override marker, and `prop` is left off the table column
   that would otherwise carry one.
2. **CUSTOMER IN FIND.** Its own scope beside the seven, offering id, account number, connected
   asset, demand per service, count, total and the junction it lumps at. Station and offset are
   deliberately NOT offered: they are positions on the drawing, and a bulk Replace on one would
   slide four hundred meters along their mains. Account, demand, count, pattern and the custom
   properties are replaceable. **The account number replaces with NOTHING enforced**, which is the
   label-not-a-key ruling arriving where a page would most be tempted to break it. The Customers
   table's filter, which used to decline, now goes through the one evaluator.
3. **A CUSTOMER DEMAND FOLLOWS A PATTERN.** The field was already READ -- `pattern` has always been
   on the customer's demand row -- so this is the control and nothing else: a chooser in the popup,
   a typed column in the table that refuses a name nothing answers to, and `libRepointPattern()`
   grown a sixth attachment point so a rename or a delete cannot strand one.
4. **CUSTOMER LABELS, WHICH HE HAS NOT DECIDED HE WANTS.** *"I wasn't expecting that Customers are
   labeled, and it could be a huge commitment. I am not sure that we want that."* **The state before
   this was NO LABEL AT ALL**: the account number drawn beside every symbol on 2026-09-15 was
   deleted on 2026-09-17, and what makes customers LOOK labelled is the other half -- a meter's
   demand is a demand row, so its junction's own node label has always included it. Nobody ever
   decided to label a customer.
   **CONTENT IS ITS OWN, SINCE 2026-09-19** -- `labelSettings.customer` is a third section in
   Settings, which OVERRULES his earlier *"Customer labels would follow Node styles"*: a junction's
   label answers *what is the pressure here* and a service's answers *whose is this and how much
   does it draw*. **STYLE IS STILL SHARED AND THERE IS NO SEPARATE TEXT SIZE.**
   **PLACEMENT IS HIS OWN AND IS NOT THE NODE PASS**: two fixed
   locations along the service line, one justified against the link and one beyond the dot, and a
   DROP if both fail the conflict check -- *"This much simpler than general node label placement."*
   No leader, no relaxation, no shed. `Geom.serviceLabelSpots()` is the whole geometry.
   **`labelSettings.customerMaxWidth` is the widest view that attempts them, and 0 is NEVER**, which
   keeps his own fallback one number away.

### 6a. His browser pass of 2026-09-19, and the answer to the mystery

**THE SIZE WAS A REAL DEFECT AND A PREVIOUS PASS CLOSED IT BY REASONING.** He was told there was no
separate text size and that the STACKING made them look taller; both halves of that were true and
the conclusion was wrong. Measured, in the harness he can be shown
(`dev/lpn-spike/customer-label-size-harness.js`): at a 4x zoom a node label and a link label were
each **2.75 px** and a customer label **11 px**. The cause is one missing line rather than a size of
its own -- a font size on this page is a pixel size divided by the scale, so every zoom invalidates
every one of them, and `refreshFontSizes()` (the zoom path) rewrote node, link and Text labels and
not customers. From the first zoom until the next content pass a customer label carried the size of
the scale it was last composed at. All three now measure equal at every scale.

**AND IT MADE THE DRAWING LOOK MORE CROWDED THAN THE PLACER THOUGHT IT WAS.** The placement reserved
a box the size of a CORRECT label -- the measured width is banked in pixels and rescaled on read --
while the ink drawn into it was several times bigger. So some of the overlap in his screenshot was
the size defect and not the placement at all.

**THE MYSTERY, MEASURED** (`dev/lpn-spike/customer-label-cause-harness.js`, his own picture: a
reservoir, one horizontal main, eight services). Every customer tries the spot beside its service
line first and takes the one beyond the customer only when something is already standing there; the
rejecting obstacle is now recorded on the element by name (`customerSpotBlocker()`), so this is
evidence rather than a second opinion. **His reading was that the conflict is with a LINK label. It
is not.** In three views, including one deliberately putting every service on the side the pipe's
own label lies, every named blocker was **the previous customer's own label**, in document order.
A pipe carries one label near its middle; a row of services is eight boxes in a line.

**SO HIS PROPOSAL -- one standard location for all, chosen once to accommodate a link label -- is
already what happens, and forcing it would cost labels.** With room, all eight take the identical
standard position; the ones that differ are exactly the ones that could not have it. Removing the
fallback would not tidy those four, it would DROP them, because the ground they were pushed off is
occupied by a neighbour that has no reason to move either. Nothing here argues against a better
answer -- spacing a row of services' labels jointly is a real design, and it is the same global
question `dev/session-handoff.md` records for node labels -- but it is a different proposal from the
one he made, and it is not a small thing.

**Two placement changes shipped from the same pass**, both his own words. The label beyond the
customer is **centred on the service line's axis** rather than sitting above it (*"middle justified
with the meter instead of bottom"*); and the label beside the line is **moved off it** rather than
the halo being thinned, because `.lpn-lbl` is one class and thinning it would thin the halo on every
node and link label to fix a collision only these have. The gap was 0.30 of a font size and is now
0.48, stated in the source as the sum it is: a descender (0.21), the halo's outer half (0.10) and
his one to two pixels of air.

**What is NOT built, in one list:** the `atNode` pin (§2, and the ruling that supersedes it); the
zoom-dependent density rule (§4); finding a customer by account number, totals by pressure zone and
bulk entry (Slice 4, "only if asked"); a Meter row in Settings' ID-prefix list, which is absent for
the reason Text's is -- `applyIdPrefixToAll()` knows only nodes and links, and a meter's id is not
renameable from any screen; and a customer in Find, which is why the Customers table declines to
answer a filter rather than hiding every row.

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
