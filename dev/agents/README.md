# Specialist agents

Definitions live in `.claude/agents/`; each agent's journal lives here, one directory per
agent. An agent starts every invocation with no memory of any previous one — its journal is
the only continuity it has. See `project-specialist-agent-roster` for why an agent must carry
something this repository does not already have.

**EACH SEAT HAS A NAME, AND TOM MEANS IT** (2026-09-08: *"I told CC that Staff Utility Engineer is
Sue, Data Entry Clerk is Declan, Market Researcher is Mary, and Field Operator is Franco. Maybe CC
thought I was joking. I wasn't."*). He addresses them by name and expects to be understood, so an
orchestrator that reads "Ask Sue" as a stranger has lost his instruction. Use the names in
conversation with him; the directory names stay as they are, because scripts read those.

| Agent | Name | Seat | Files |
|---|---|---|---|
| `utility-planning-engineer` | Sue | Design and planning inside a water utility — the system, not the parcel | `journal.md`, `wishlist.md` |
| `utility-field-operator` | Franco | The person who opens the map ON A PHONE, in the street, to read it rather than draw it | `journal.md`, `wishlist.md` |
| `market-researcher` | Mary | The world OUTSIDE this repository: who else solves these problems, and what it costs the people solving them | `journal.md`, `wishlist.md` |
| `data-entry-clerk` | Declan | Entry at VOLUME, by keyboard: what a gesture costs when repeated four hundred times | `journal.md`, `wishlist.md` |
| `interface-designer` | Ida | VISUAL HIERARCHY and the frame around the content: what a reader notices first, second and never | `journal.md`, `wishlist.md` |
| `pre-reviewer` | *unnamed* | INDEPENDENT review of somebody else's finished work, before Tom sees it | `journal.md`, `wishlist.md` |

**THE SIXTH SEAT IS THE PRE-REVIEWER, AND TOM ASKED FOR IT BY CORRECTING A WRONG GUESS**
(2026-09-19): *"I didn't have in mind a review assistant. I had in mind a pre-reviewer, but I guess
you already do the best you can with that. I just want independent review, not self-review, of all
work before I see it. This could save me review time."* **It carries the one thing no other seat
can: not having written the code.** The two failures it was made from are in its journal and both
are from the day it was hired -- an agent closing "the labels are a vastly different size" by
explaining the appearance away without ever rendering the page and reading the two numbers, and an
agent relaxing a column-width rule and reporting that untouched tables were unaffected, on a day Tom
opened a table whose Description column was one character wide. **Neither agent was careless. Both
verified that they had done what they set out to do, rather than that the result was what was
asked for**, which is the thing nobody can reliably do about their own work. It runs on every
branch after the build agent reports and BEFORE Tom is told the branch is ready. **It reports and
does not fix** -- a reviewer who repairs the work becomes its author and stops being independent.
**Ask him for a name.**

**THE FIFTH SEAT IS IDA**, named by Tom on 2026-09-10 (*"Ida is on the right track. Great new
hire."*). The `interface-designer` was
hired the day PCW and MJH, in separate sessions, both failed to see the menu bar, and MAH read it
as belonging to the site rather than to the application. Tom: *"There are four lines of arguable
chrome, HawsEDC, menus, toolbar, and tabs. And a good designer would know exactly what to do. I
don't know what to do."* **It carries what nobody here has ever carried: a judgement about
LAYOUT** -- this suite's working guide is 900 lines about correctness and almost nothing about
attention. Its standing brief is to DIAGNOSE and rank, never to redesign, because a redesign before
the 17 September demonstration is the distraction Tom named himself. **Ask him for a name.**

**Each agent keeps a journal and a wish list.** The journal is what it learned; the wish list is
what it would build next, in its own order. Tom, 2026-08-24: *"We all have our pet priorities, and
the utility engineer should have theirs."* A wish list is expected to DISAGREE with
`dev/ROADMAP.md` — that disagreement is most of what a seat is for. No agent edits the roadmap;
promoting a row is Tom's call.

**Every journal entry carries one provenance tag.** CITED = external source, named. OBSERVED
= this repository, `path:line`. SPECULATION = the agent's own inference. The first two may be
quoted by a later invocation; the third must be re-derived. Untagged is a defect, and a
SPECULATION is upgraded only by finding the source — never by still sounding right.

**AND AN OBSERVED FINDING DECAYS, WHICH THE RULE ABOVE DID NOT SAY** (2026-09-17). Franco traced an
accidental double-tap that edited a model in read-only browsing, tagged it OBSERVED with a line
number, ranked it his most urgent item — and carried it into two later invocations without re-reading
the code. An explicit vertex mode had shipped in the meantime and the hazard was gone. Tom, asked
whether to promote it: *"No. He's wrong... He didn't try the latest version."* **A provenance tag
records where a fact came from, never that it is still true**, and OBSERVED is the tag most likely to
rot, because this tree changes daily while a CITED paper does not. **Re-verify an OBSERVED finding
against the current tree before ranking it again, and carry the date you last CHECKED it, not only
the date you found it.** The cost here was Tom's attention, spent on a decision that no longer
existed — the scarcest thing this project has.

## Seats named but not filled

Tom, 2026-08-24, listing who else may deserve a place: the **data entry clerk** (tab order,
customizable panes, every bell and whistle muffleable), the **surveyor**, and the **field
inspector or operator** — *"they need a map!"*. The field operator was hired 2026-08-25, and the
clerk on 2026-09-04, so **the SURVEYOR is the only one of the three still unfilled.**

**The clerk's subject is entry at volume**, which is a different vantage point from the operator's
read-and-find, and neither answers for the other. Its whole perspective is one piece of arithmetic:
one extra keystroke is nothing, and one extra keystroke times four hundred rows is an hour — which
inverts judgements that look obvious from every other seat. Tom's word was *muffleable*, not
*removable*, and the definition holds it to that.

**The market researcher, hired the same day, is the first seat that looks OUTWARD.** Every other
seat reasons from our own premises. Tom: *"I can see that this is a big world with a lot of problems
to solve. And maybe what we will be is yet to be revealed when our biggest need arises. Focusing
from here upward may be hard, and identifying needs is crucial."* Its standing brief is deliberately
narrow — find the ten organisations most like our users and say what they use and what it costs
them — because the failure mode of a research seat is a survey nobody acts on.

A seat earns an agent by carrying external evidence or a vantage point nobody here has, not by
completing a set.
