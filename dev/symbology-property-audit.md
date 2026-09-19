# What you can label and colour by, and what you cannot

**An audit, written 2026-09-18 at Tom's instruction** (ROADMAP Task 247): *"I suppose we should
give some attention to adding all missing properties to Settings Node and Link symbologies and
'Color Nodes/Links by' selectors. Do an audit of properties that should be added."*

**His word is ALL**, so the sweep below goes element type by element type rather than stopping at
the obvious two, and every property a popup or a table offers is accounted for -- either as a gap
with a recommendation, or as a deliberate absence with the reason.

**NOTHING IN THIS DOCUMENT IS BUILT.** It is a list, a reason per row, and a ranked
recommendation. Promoting a row is Tom's call.

---

## 1. Where the two lists live, and why they are not one list

Two structures decide what the Settings box offers:

| What | Where | Read by |
|---|---|---|
| Which properties get a map LABEL | `defaultLabelSettings().node` / `.link` in `js/looped-network.js` | the Labels checkboxes, the legend, both pushes, the audit halos |
| Which properties a map may be COLOURED by | `COLOR_NODE_FIELDS` / `COLOR_LINK_FIELDS`, ordered by `COLOR_FIELD_ORDER` | the two "Color ... by" selectors, the ramp, the colour legend |

They are deliberately not the same list. A label prints a value; a ramp needs one that can be
ORDERED, so a status (a word) is colourable by category and an ID is neither.

`findPropDefs()` reads `COLOR_NODE_FIELDS`/`COLOR_LINK_FIELDS` as its own "fields with a readable
value" test, which is why a gap here is also a gap in Find unless the property is listed there by
name. Three already are: the required fire flow, the two reaction coefficients, and length and k
through `FIND_EXTRA_LINK_FIELDS`.

## 2. The state today, measured

**NODE labels and NODE colour agree exactly.** Labels offer `id, elev, demand, demandActual, head,
pressure, quality, initQuality`; colour offers the same seven minus `id`, which is correct because
an ID is a name.

**LINK labels and LINK colour disagree by two.** Labels offer `id, diameter, length, roughness, km,
flow, velocity, headloss, gradient, friction, status, quality, rate`. Colour offers all of those
except `id` (correct), **`length`** and **`km`**.

## 3. The gaps, by element, with a reason each

### 3a. The two that are simply missing, and nothing argues against them

| Property | Labelled | Colourable | Note |
|---|---|---|---|
| Pipe **length** | yes | **no** | An ordered numeric quantity in a unit the page already owns. Colouring a network by length is how somebody sees at a glance which runs are long. There is no argument on the other side that this audit could find. |
| Pipe **minor (local) loss, k** | yes | **no** | Same shape: a number, ordered, already labelled, already in Find. Colouring by it answers *where are the fittings in this model*. |

These two are the cheapest rows in this document: both are already in `labelSettings.link`, both
already have a decimals entry, both are already read by `colorLinkValue()`'s neighbours, and
neither needs a new language key, because the label strings exist.

### 3b. The one an extended-period run is actually about

| Property | Labelled | Colourable | Note |
|---|---|---|---|
| Tank **water level** | no | no | A tank's level rising and falling IS the story of an EPS run (`js/lpn-time.js`), and the only place a reader can see it today is the graph or the property box. A map that coloured tanks by how full they are would answer *which tank is in trouble at hour 14* without leaving the drawing. |
| Tank **percent full** | no | no | The same number normalised, which is what makes tanks of different sizes comparable on one ramp. |

**The catch, and it is why this is not in 3a:** a tank level is a RESULT that changes with the
clock, and it exists on tanks alone. Every node field today exists on every node kind or is blank
there (`colorNodeValue()` returns `undefined` and the element is left black). So this is
mechanically fine, and the real question is whether a ramp over three tanks in a twenty-node model
reads as anything. Measure before building.

### 3c. Pumps, which carry four numbers nothing on the map shows

| Property | Labelled | Colourable | Note |
|---|---|---|---|
| Pump **speed** | no | no | An input the user typed, and the one a scenario most often changes. |
| Pump **head added** | no | no | Reported as a negative head loss today (Tom, 2026-07-30), so it is already IN the head-loss label and the head-loss ramp, wearing the wrong sign for a reader. A row of its own would be clearer and would also be a second reading of one number, which is the argument against. |
| Pump **power (kW)** | no | no | `dev/pump-energy.md` computes it. It is the number a utility spends money on. |
| Pump **efficiency (percent)** | no | no | Derived from the efficiency curve at the solved point. |

### 3d. Valves

| Property | Labelled | Colourable | Note |
|---|---|---|---|
| Valve **setting** | no | no | **Already declined once, with a reason, and the reason still holds**: the setting's MEANING changes with the valve type (a pressure for a PRV, a flow for an FCV, a k for a TCV), so a bare number beside a pipe's k would be read as the same quantity when it is not. Any build here owes a per-type unit in the legend, which is why it is not cheap. |

### 3e. Junctions

| Property | Labelled | Colourable | Note |
|---|---|---|---|
| **Required fire flow** | no | no | Searchable and replaceable already (Task 530), and deliberately outside the label list: a junction is given a fire flow because of what STANDS on it, so it is not a starting value and not a push. Colouring by it is a different question from labelling by it and is arguably the more useful half. |
| **Available fire flow** (the result) | no | no | If the fire-flow analysis reports one, this is the map answer people actually want. Worth checking what `lpn_ff_*` already computes before pricing it. |
| **Emitter coefficient** | no | no | An input on a junction, ordered, numeric. Rare enough that it has never been asked for. |
| **Demand pattern** (the NAME) | no | no | Categorical, not ordered, so it belongs to the colour ramp's category path rather than to a numeric one. *Which junctions follow the industrial pattern* is a real question with no answer on the map today. |
| **Demand category** (the NAME) | no | no | Same shape, and since Task 247 a customer's account number arrives in the same field on export. |

### 3f. Pipes, the two reaction coefficients

Searchable and replaceable (Task 566), deliberately not labelled and not colourable: they are
inputs to an analysis the document may not be running, and two permanently blank columns on every
pipe is clutter. **The gate already exists** (`reactionFieldsShown()`), so offering them under that
gate would cost nothing new. Low value, low cost.

### 3g. The identity band: tag and description

Neither is labelled nor colourable. A **tag** is the join key to somebody else's inventory
(Task 579) and a **description** is a sentence about where the asset is (Task 674). A description
is too long for a map label; a TAG is not, and *print the utility's own name for this pipe beside
it* is a genuinely useful sheet. Colouring by either is categorical.

### 3h. CUSTOM PROPERTIES, which is the largest single gap

**A property the user invented can be searched, replaced, typed in the popup and typed in the
tables, and it cannot be printed on the map or coloured by.** Task 636 wired it into
`findPropDefs()`, `pushSpecList()`, `paneCustomCols()` and the popup, and stopped at symbology.

That is the gap most likely to be met by a real user, because a custom property is by definition
the thing THIS reader cares about that we did not think of. It is also the hardest row here, and
the reason is structural rather than fiddly:

* `labelSettings.node`/`.link` are BOOLEAN MAPS MERGED KEY BY KEY out of a saved project. A custom
  key is fine in such a map, but a design DELETED from the table leaves its checkbox behind.
* `labelSettings.decimals` is the one place that says which fields are numeric. A custom property's
  numeric-ness is the DESIGN's answer (`customPropIsNumeric()`), which can change under a saved
  document.
* `COLOR_NODE_FIELDS` maps a field to a UNIT ID. A custom property has no unit family at all, which
  is the same hole `roughness`, `friction` and `rate` already sit in, and they solve it by
  declaring `''`. So the colour side is the easier half.
* A non-numeric custom property is categorical, and the ramp's category path already exists for
  `status`.

## 4. The ranked recommendation

1. **Pipe length and minor loss k in the two colour selectors.** Two lines, no new strings, no new
   concepts, and they close a disagreement between two lists that are supposed to match.
2. **Custom properties in both.** The largest gap and the one with a real user behind it. Colour
   first (it is the easier half and needs no decimals or affix decisions), labels second.
3. **Tank level, and percent full beside it.** The one gap an extended-period run is actually
   about. Measure whether a ramp over three tanks reads as anything before building.
4. **The tag, as a map label.** One categorical row, and the only way to print the utility's own
   name for an asset on a sheet.
5. **Pump power and efficiency.** Real numbers a utility spends money on, and `dev/pump-energy.md`
   already computes both.
6. **The required fire flow, on the colour side only.** Labelling it was declined for a stated
   reason; colouring by it was never asked.
7. **The two reaction coefficients, under the gate that already exists.** Cheap, low value.
8. **The valve setting.** Declined once with a reason that still holds. Do not build it without
   answering the per-type unit question first.

---

## 5. The account number: Tom now says we should NOT own it

**THIS IS A REVERSAL OF SHIPPED CODE AND IT IS WRITTEN UP RATHER THAN DONE.** His words,
2026-09-18: *"A property (of Customer) is Account number. I don't think that we want to own this
new property. Users can add custom properties, and this could be one such instead of our adding a
property and lang keys."*

The account number shipped to master as an OWNED field, `c.account`, with its own language keys.
This section is what removing it would cost, what would be lost, and a recommendation. **Nothing
was removed.**

The standing ruling holds either way: **the account number is a LABEL on a demand, never a KEY.**
No registry, no validation, no uniqueness, no lookup.

### 5a. What owning it costs today, exactly

Four language keys, all English-only so far in this round's terms but long since translated:

| Key | What it says |
|---|---|
| `lpn_field_account` | the label, "Account number" |
| `lpn_field_account_tip` | the tip, which is where the label-not-a-key ruling is said out loud to the reader |
| `lpn_meter_placed` | names it in the sentence that follows placing a meter |
| `lpn_inp_export_flat_customers` | names it in the export difference report |

Plus: one popup row, one Customers-table column, one row in the Find property list, one Replace
spec, and one branch in `EngCalcs.lpnCustomerRowsByNode()`.

### 5b. Can a custom property actually carry it? Yes, as of this round

Item (1) of his same message is built, so a design whose "Applies to" includes **M** now reaches a
customer's Properties box, the Customers table, Find and Replace, and rides in the project file.
That was the missing half. What a custom property still does NOT have:

* **No `.inp` destination.** This is the one real dependency, and it is in the EXPORT rather than
  the import. A customer's demand row states its account in the `[DEMANDS]` CATEGORY slot, which is
  the one field of that row EPANET lets hold a name, and Task 468's own ruling is that a category
  names *who* the demand is. A custom property has no such mapping. So removal means one of:
  1. the exporter names a CONVENTION -- "the design keyed `account`, if there is one, goes in the
     category" -- which is a private agreement inside the one file format whose whole point is that
     everybody can read it;
  2. the exporter offers the user a choice of which design fills the category, which is a new
     control for a rare question;
  3. the category goes out empty for customers, which LOSES the round trip: the numbers still ride
     out, and the names stop doing so.
* **No translated label.** A custom property's label is whatever the reader typed. That is right for
  their own design and it means the field that names a customer is untranslated, per project, and
  absent until somebody invents it.
* **No zero-configuration first run.** A meter placed with two presses has nowhere to put an account
  number until the reader has been to Settings and designed one.

### 5c. What happens to a project already carrying one

Files exist with `account` on customers -- at minimum every project made on `feat/customer-demands`
since 2026-09-15, and anything Tom made testing it. A removal owes them an answer, and there are
only two honest ones:

* **Read it once on open into a design the page creates**, which means the page inventing a custom
  property row on somebody's behalf; or
* **Leave the bytes on the object, unread.** The value stays in the file, nothing shows it, and it
  reappears only if a reader later designs a property with that key. Lossless on disk, invisible in
  the interface, and it will read as data loss to whoever typed it.

### 5d. Recommendation

**Do not remove it yet, and do not build anything toward removal until the `.inp` question is
answered** -- because that answer decides whether removal is a deletion or a redesign.

Ranked:

1. **Ask Tom the `.inp` question directly**, in one sentence: *when a customer is a custom property
   instead of an owned field, should its account number still ride out in the `[DEMANDS]` category?*
   If YES, removal needs a convention or a control and is not a one-line deletion. If NO, removal
   is genuinely cheap and the round trip was a nicety.
2. **If it goes, it goes with a read-once migration**, not a silent orphan. A project that carries
   an account number should keep showing it.
3. **The direction of the asymmetry argues for deciding soon rather than quickly.** Owned to custom
   is a migration of every saved project plus an exporter change. Custom to owned is cheaper: a
   built-in field can read a legacy custom key once on open. So the cost of leaving it owned for
   another round is small, and the cost of removing it wrongly is not.

### 5e. The case he is making, stated fairly

It is a good one and this document does not argue against it. The account number is the only
management-shaped field in the suite, and `dev/customer-demands.md` §5 draws the line exactly
there. A field we do not own cannot accrete a registry, a uniqueness rule or a lookup, because
there is nothing for them to hang on. It is also the one piece of personal-adjacent data here -- an
account number plus a map position -- and a user-designed field is opt-in by construction: a
project that designs none carries none, and there is no built-in column inviting anybody to fill
it. And utilities do not agree on the word: account number, service number, meter number, premise
ID, APN, street address. A custom property lets each use its own, validated its own way.
