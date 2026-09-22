# How to spend real money on a deep code review

**Tom asked for this, 2026-09-19**, after feeling a small delay while typing down a column:
*"this worries me very deeply because it is a sign of pervasive bad coding. I want your advice about
how I can spend some significant resources to do a deep code review to ensure we don't have a code
base full of AI techno-slop."*

This is the advice. It is written to be argued with.

---

## 1. THE FIRST MOVE IS FREE, AND IT DECIDES WHAT TO BUY

**Do not buy a review on a hypothesis.** The delay he felt is a measurable fact, and measuring it
costs an agent-hour. The measurement answers a question that changes everything downstream:

- **If one keystroke costs one full table rebuild, or one full re-layout, or one solve** -- that is a
  DEFECT in one place. It is found by a profile, fixed in an afternoon, and buys nothing to review
  45,000 lines over.
- **If one keystroke costs a little in twenty places** -- that is the pervasive thing he fears, and
  it is worth real money.

Those two feel identical from a chair. They are opposite findings. **Measure first.** This is the
repository's own standing rule in another costume: DO NOT GUESS A CAUSE, MEASURE IT -- written into
`dev/session-handoff.md` after a defect was mis-diagnosed four times.

## 2. THE HONEST NUMBERS, BECAUSE HE ASKED FOR ADVICE AND NOT COMFORT

Measured 2026-09-19 by `dev/scripts/size_budget_check.php`, which is already in the suite and
already advisory:

| | |
|---|---|
| `js/looped-network.js` | **45,239 lines**, about 1,900 functions |
| its comment share | **47%** -- roughly 21,500 lines of prose inside the source |
| files over 1,500 lines | 6 |
| functions over 80 lines | **57** |
| the longest, as the check reports it | `openHelpMenu()` at 17,232 lines -- **verify this before citing it**; a number that large is at least as likely to be the checker's brace-counting failing on a construct as it is to be one real function, and either answer is worth knowing |

**Some of that is genuinely the shape he is worried about.** One file holding an entire map editor
is not a design anybody chose; it is what grows when every session adds to the file that is already
open. And 47% comments is the documented consequence of a habit this project has already named and
banned -- `CLAUDE.md`'s own "Writing things down" section says a correction SUBSTITUTES the
superseded reasoning and never appends to it, and names this file as one of the three that became
"transcripts of revision rather than statements of current state".

**And some of it is not slop at all**, which matters because a review aimed at the wrong thing wastes
the money. This codebase has ~145 automated checks, most of them written after a specific measured
defect, many mutation-tested. That is not the signature of a codebase nobody was thinking about. The
weakness is concentrated: it is SIZE and COUPLING in one file, not correctness everywhere.

## 3. WHAT THE FREE TIER ALREADY CANNOT SEE

Stated in `CLAUDE.md` and worth repeating here because it is exactly the gap he is asking about:
**nothing in `check_all.sh` reads code for design, duplication, or a subtle logic error.** It checks
that names resolve, that strings reach screens, that units are exact, that guards are installed. It
has no opinion about whether a function should exist.

So the gap is real and his instinct about it is right. The question is only how to buy coverage of
it without buying a report nobody reads.

## 4. THREE THINGS WORTH BUYING, IN ORDER, AND WHAT EACH BUYS

### (a) A profile of the keystroke -- FREE, do it first

What one keypress in a table actually costs, function by function, on his own machine if possible.
Output is a number and a named culprit, or an honest "it is spread thin", which is the finding that
justifies (c).

### (b) `/code-review` on a SLICE, billed, and he is the only one who can start it

**Not on 45,000 lines.** A review of everything produces a 400-finding report, and a report nobody
can act on is money converted into guilt. Point it at a path tied to a decision he is about to make:
the keystroke path, or the redraw path, or one branch's diff before it merges. `CLAUDE.md` already
names the natural moments -- before a 26-agent translation sprint, and before anything that changes
what is stored on a visitor's device.

**What it is good at is exactly his worry**: duplication, a function that should be three, a subtle
logic error no test covers.

### (c) STRUCTURAL MEASUREMENT, which we can build ourselves and which is the best value of the three

This repository's own doctrine: *a rule a machine enforces is worth roughly ten a human must
remember.* A one-off review decays the day it is delivered; a check holds forever. What can be
measured mechanically and is not today:

- **duplicate blocks** -- the real signature of generated code, and the one thing a human reviewer is
  worst at spotting across 45,000 lines;
- **function length and nesting depth**, with a RATCHET rather than a sweep, so the number may fall
  and may not rise (the pattern `em_dash_ratchet_check.php` already uses here);
- **fan-in and fan-out per function** -- what a "seam" looks like when it is working, and what a
  tangle looks like;
- **dead code beyond the language-key walk we already have.**

`size_budget_check.php` is the beginning of this and is advisory. Making it a ratchet is cheap and
would have stopped the growth that produced the numbers in section 2.

## 5. WHAT NOT TO DO, because the pull after a scare is toward ceremony

`dev/reputation-and-practice.md` already records this lesson from a different incident and it applies
unchanged.

- **Do not commission a rewrite of `looped-network.js`.** Splitting a 45,000-line file that works,
  under a suite that does not test most of it by unit, trades a slow keystroke for a month of
  regressions a browser pass finds one at a time.
- **Do not buy a whole-codebase review as a reassurance purchase.** The output is not reassurance; it
  is a list, and the list is long by construction.
- **Do not let a finding count stand in for progress.** The question is whether anything got faster
  or simpler, not how many rows were produced.

## 6. THE RECOMMENDATION IN ONE PARAGRAPH

**Measure the keystroke first, free, and let the result choose.** If it names one culprit, fix it and
buy nothing. If it is spread thin, spend `/code-review` on that one path -- not the file -- and in
the same week turn the structural measurements in 4(c) into ratcheting checks, because those keep
paying after the review is filed. Reserve the big spend for the moment there is a decision it would
change.
