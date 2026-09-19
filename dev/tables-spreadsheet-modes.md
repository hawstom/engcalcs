# The modes of the bottom-pane tables, and what the industry calls them

Written 2026-09-19 to answer one question Tom asked in his browser pass of `feat/tables-spreadsheet`:

> I think that there is a fourth mode: Navigation, the part of what I called Entry when no
> characters are being typed. Check the literature. I will refer to this, but set me straight so we
> aren't inventing things we shouldn't invent.

**Short answer: the fourth state is real, it is not an invention, and Excel has shown its name in
the status bar since the 1990s. It is called Ready.** What we do not have is a name of our own for
it — we called it Select, and that name is doing two jobs at once, which is where the confusion he
is describing comes from.

---

## What the four products actually call these states

**Microsoft Excel names four CELL MODES and prints the current one at the left end of the status
bar:**

| Excel's name | What it means |
|---|---|
| **Ready** | A cell is current, nothing is being typed. Arrows move from cell to cell. The default. |
| **Enter** | You started typing over the cell. The first character replaced what was there. Arrows still move from cell to cell. |
| **Edit** | You pressed F2 or double-clicked. There is a caret in the value and the arrows move it. |
| **Point** | You are part-way through a formula and clicking cells to build a reference. |

**Google Sheets** publishes no such indicator and no four-name vocabulary. Its help and the
community use one term, **edit mode**, for the caret-in-the-cell state that F2 opens, and treat
everything else as simply having a cell or range *selected*.

**LibreOffice Calc** likewise names only one: **Cell Edit Mode** (`SetInputMode`, F2). Its status
bar reports *insert* against *overwrite*, which is a different axis entirely and one we do not have.

**The W3C's ARIA Authoring Practices grid pattern** names the distinction we care about without
naming the states as products do. It says a composite grid has a **navigation mode**, where the
arrow keys move focus from cell to cell, and that an author "SHOULD provide a mechanism for changing
to an interaction or **edit mode**" when a cell holds a widget that itself wants the arrow keys.
Enter or F2 in, Escape or Enter out, is the pattern it describes.

So: **two industry vocabularies, and Tom's "Navigation" is the ARIA one's word for exactly the state
he identified.** Excel's word for the same state is Ready.

## What we call them, and the one name that is wrong

Ours today, in `js/looped-network.js` (`paneCellMode()`):

| Ours | Excel's | Fits? |
|---|---|---|
| `select` | **Ready** | The state is identical. The NAME is the problem — see below. |
| `entry` | **Enter** | Exact match, including the rule that the arrows still move a cell. |
| `edit` | **Edit** | Exact match, including F2 and the double-click as its two doors. |
| — | Point | We have no formulas, so there is nothing to point at. Correctly absent. |

**`select` is one word doing two jobs, and that is the whole of what he tripped over.** It names a
MODE (a cell is current and nothing is being typed) and it also names a THING (a range of cells
somebody has selected). Excel keeps those apart without trying: a selected range lives in **Ready**
mode like everything else, because selecting is not a mode at all — it is something the document
has, the way it has a current cell. So when he wrote *"in Select mode they should be shaded blue"*
he meant the range, and when he wrote *"keyboard navigation should be in Entry mode"* he meant the
state — and both sentences are about the same `select` in our code.

## What SHIPPED on 2026-09-19, and what did not

**The pictures moved and the names did not.** His ruling was about appearance, and it is built:

* a single current cell wears a **double-wide inward blue border** and no wash, whether or not
  anything is being typed into it (`.lpn-pane-cur`);
* a **wash** (`.lpn-pane-sel`) now means one thing only: a range somebody selected;
* inside such a range the border sits on the cell the selection **started** from, and a plain arrow
  key moves from there;
* the current cell carries the modern spreadsheet's **autofill dot** at its lower-right corner. It
  is pure CSS on a pseudo-element, it has no handler, and **dragging it does nothing** — fill-down
  is still open under ROADMAP Task 690.

**No mode was renamed, because renaming is his call and he asked to be set straight first.**

## The three options, and the recommendation

1. **Leave it.** `select` / `entry` / `edit`, with the double meaning explained wherever it bites.
   Costs nothing today; every future reader meets the same collision he did.
2. **Add a fourth name.** `select` / `navigate` / `entry` / `edit`. This is what his message
   proposes, and it is the option to be careful about: it would give us four modes where Excel has
   four, but a DIFFERENT four — ours would split Ready into two, and there is no state underneath
   the split, because nothing about the page behaves differently when a range happens to be more
   than one cell.
3. **Rename `select` to `ready`, and keep "selection" for the range.** Three modes — **Ready,
   Entry, Edit** — which is Excel's list minus the formula one we have no use for, and stop using
   "Select" as a mode word at all.

**Recommended: option 3.** It is the smallest change that ends the collision, it puts us on the
vocabulary an EPANET user already has in their fingers from Excel, and it agrees with ARIA, whose
"navigation mode" is the same state under a different word. It costs an internal rename
(`paneCellMode()` and its callers) and **no visitor-facing English at all** — none of the three mode
names is shown to anybody today, so there is nothing to translate into 26 languages.

**The one thing to avoid is inventing a fourth state.** The page has three behaviours and Excel has
four names only because it has formulas. A name with no behaviour under it is a name somebody later
has to work out the meaning of.
