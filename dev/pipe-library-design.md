# Library pipes and fittings: one indirection, two ends

**Roadmap: Tasks 465 and 590, both at priority 100 and deliberately linked.** Tom, 2026-09-06: *"a
fittings picker and a library pipe are the same indirection seen from two ends. A pipe TYPE that
states roughness may as well state a fittings set, and the `effective()` resolution layer 465 has
to build is the one a picked fitting list would resolve through. Design them together or the second
one re-litigates the first."*

This file is the design record. The roadmap holds the one-line task; the reasoning is here.

---

## 1. The decision that is already made

**The type system is BUILT, not parked.** `utility-planning-engineer` researched Task 465 on
2026-08-25 and recommended parking it; Tom then specified a shape that answers both of its
objections and raised it to 100. That ruling is the human decision and it is not reopened. His
shape, in his own words (2026-09-05):

> *"Pipe library: I foresee very soon that we will add the ability to refer to a library pipe for
> roughness, reaction coefficients, and maybe diameter (depending on what user chooses to include in
> the library pipe definition). The Library pipe selector can be immediately after ID, and any
> properties defined in the Library are disabled or removed in the pipe properties box. Very cool
> and open to user needs."*

Two things in that sentence are load-bearing and are the reason the engineer's objections dissolve:

- **The CONTENTS of a definition are the user's choice.** A library pipe that states roughness and
  not diameter is legal. So the aging wrinkle — roughness is a function of material AND age — is the
  user's to resolve by defining two library pipes, not ours to model with a per-element qualifier.
- **A property the library defines is DISABLED in the properties box.** That is the visible
  inherited-versus-detached state, arrived at from the other direction.

## 2. What a real utility's standard actually looks like

CITED by `utility-planning-engineer`, 2026-09-06, from published design-standards manuals
(Harrisonburg VA, Rockford IL, El Paso Water, Virginia Beach; the STRUCTURE is the reliable part,
the specific numbers are aggregator-sourced and are not to be published as ours):

**A utility's approved-materials table is keyed by MATERIAL AND PRESSURE CLASS first**, with
diameter and a design C-factor as columns under each row — "8-inch C900 PVC", "12-inch
cement-lined ductile iron". **It carries no age field.** The aging is already inside the number: a
*design* C for metallic pipe is discounted well below the new-pipe value, because design means a
pipe fifteen or twenty years into service. Rockford's own manual designs on C = 100 suite-wide.

**That is the evidence that Tom's ruling matches the world**: the real tables are organised by
material and class, not by material, class and age, and the way a real standard handles two ages is
two rows. It is not a workaround we are asking users to accept.

### What belongs in a definition, and what never does

| In the type | Never in the type |
|---|---|
| Label (material and class — this is how the real table is keyed) | Length |
| Diameter | The two node references |
| Design roughness | Status (open/closed is operational, not a material property) |
| Optionally a fittings-set reference — this is where 465 and 590 meet | |

**Order: label, diameter, roughness, fittings set.** Identity then physical properties, which is
also the order Tom put the selector in on the popup — "immediately after ID".

## 3. Fittings: the market's own model, not a guess

CITED: **Crane Technical Paper 410**, the K-method the whole market rests on. K = n·f_T per fitting
type and pipe size, and the Ks of fittings in series **sum directly**. The spread is the argument
for the feature: a 90° elbow is roughly 0.3 to 0.8 where a globe valve is about 6 and a gate valve
about 0.15, all at the same size — which a single bare `k` field on a pipe cannot honestly carry.

CITED: **Bentley's own Minor Loss Collection dialog** (`docs.bentley.com`, WaterGEMS/StormCAD) is
exactly the shape Task 590 already proposes — three columns, Quantity, a picker into a library, and
a read-only coefficient — and its own words are *"the number of minor losses of the same type to be
added to the composite minor loss for the pipe"*. So: **`k = sum(quantity_i x k_i)`**, additive in
series. KYPipe's SigmaM is the same shape. There is no alternative in active commercial use.

**The default stays ZERO** and that half is already asked and answered (Task 590): EPANET 0,
epanet-js 0 (`DEFAULT_MINOR_LOSS = 0` in their source), WaterGEMS and KYPipe both zero absent a
pick.

## 4. THE ONE THING THAT GOES WRONG, AND IT IS BINDING BY NAME

CITED, and this is the finding worth the whole research pass. Bentley's own Engineering Libraries
documentation: *"Items are synchronized based on their label. If the label is the same, then the
item's values will be made the same."* And on the same page, no confirmation step before a library
edit propagates: *"the changes automatically affect all hydraulic models using that entry."*

**A definition identified by its NAME re-points every reference the moment two names collide** — a
second project's "8-inch PVC" merged into this one, or a rename onto an existing label — silently,
because from the software's side nothing changed: a label still matches a label.

**Task 586 already solved this for curves and the requirement is simply not to regress.**
`doc.curves` holds `{id, kind, points, src, tok}`; an element states a curve BY ID; a rename carries
every reference; deleting one in use is refused by name. The picker's displayed text is the name.
**The stored reference is the id.** Do not let a dropdown-of-names UI talk anybody out of that.

## 5. Resolution, and the piece the shape is missing

`effective()` is the expensive part and the reason this is Task 390-sized: a third resolution
layer — **override -> element -> type default** — under the one seam the solver, renderer, labels,
popups and six pane tables all read through.

- **A scalar shows its inherited value inline in a DISABLED control.** That is right at this grain,
  and it differs from the curve pattern on purpose: a curve is a multi-row table, so Task 586 gives
  it a chooser and a click-through to the Library; a roughness is one number and a designer must be
  able to read the effective value at a glance for a hand check or a report, without a click.
- **No "what it would be if detached" preview.** Once delete-in-use is refused by name there is no
  scenario in which a type disappears from under an element, so the hypothetical has no audience.
- **BUT THERE MUST BE A DETACH ACTION, and this is a real gap in the shape as stated.** Every real
  network eventually has one element that must deviate without splitting the type: a single service
  tap refitted, one pipe relined after a break. Tom's answer to the aging objection — define two
  library pipes — does not cover a true one-off. **Detach copies the current effective values into
  the element as ordinary local values and drops the reference**, turning the disabled field back
  into an editable one. Without it the only way to make one exception is to fork the whole entry,
  which is the propagation problem in reverse: two "8-inch PVC" types differing by one pipe's worth
  of reality, and nothing saying which is which.
- **Every write still goes through `setProp()`.** A resolution layer is not a licence to write
  around the one scenario seam (`scenario_seam_check.php`).

## 6. The export alert, and the way to make it noise

Tom, 2026-09-06, ruling that a library pipe MAY be something a `.inp` round trip loses: *"Yes. And
we have to start showing an export alert."* It is the same discipline `js/lpn-inp.js` already
applies on IMPORT, pointed the other way: report the difference, never drop it silently.

**TWO DIFFERENT THINGS FLATTEN AND THEY MUST NOT SHARE ONE MESSAGE:**

- **A library-pipe reference loses its INDIRECTION.** Every number still exports byte-identically;
  what does not survive is that 400 pipes were one definition. Say that, and say how many elements
  it affects, the way find-and-replace states its count before writing.
- **A fittings list loses its ITEMISATION.** The summed `k` was already exportable before the
  feature existed, so nothing about the export is worse than it was — only the list of what made
  the number is gone.

**And the alert fires only where `k` is fitting-list-derived, never on a nonzero hand-typed `k`.** A
warning that fires on every export teaches people to dismiss it, and a network that never touched
the feature must never see one. Curves escaped all of this because EPANET has curves.

## 7. Slices, smallest first

1. `doc.pipeTypes` as a document object, id-keyed, with the Library section that creates, renames,
   edits and refuses to delete what is in use — the Task 586 pattern, second time.
2. `effective()` and the disabled-control rendering on the pipe popup, selector immediately after
   ID. **This is the expensive slice and everything else waits on it.**
3. Detach.
4. The fittings set: named fittings with quantities, summed into `k`, resolving through the same
   layer. A fittings set is stated by a type or by an element, and it is one more reference.
5. The export alert, scoped as in §6.

**SLICES 1 TO 5 ALL SHIPPED 2026-09-06.** `doc.fittingSets` is the fourth id-keyed document object,
`js/lpn-fittings.js` holds the arithmetic and the catalogue, `fittingsId` is the fifth entry in
`LPN_TYPE_PROPS` (which is how a type states one), and `pipeK()` is the single seam every reader of a
pipe's minor loss goes through. The export alert is `showInpExportFlattening()`, raised from the two
new difference codes `pipe-type-flattened` and `fittings-flattened`, and it is silent where neither
happened. `dev/lpn-spike/fittings-harness.js` is the contract; `dev/lpn-spike/pipe-library-harness.js`
remains the contract for 1 to 3.

**THE SEEDED COEFFICIENTS ARE EPANET 2.2 USER MANUAL TABLE 3.3 AND NOTHING ELSE** -- thirteen rows,
verbatim, in the manual's order and with the manual's names. Public domain, citable, and already the
reference in front of the person modelling here. A fourteenth row, "Other fitting", carries no number
at all and hands the coefficient box to the user, which is what makes leaving an unsourceable fitting
OUT of the table affordable. **Every coefficient is a starting point rather than an answer** -- Crane's
K is n x f_T, so the real one depends on the size and the make -- and the Library says so on screen,
not only at the code.
