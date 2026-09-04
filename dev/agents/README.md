# Specialist agents

Definitions live in `.claude/agents/`; each agent's journal lives here, one directory per
agent. An agent starts every invocation with no memory of any previous one — its journal is
the only continuity it has. See `project-specialist-agent-roster` for why an agent must carry
something this repository does not already have.

| Agent | Seat | Files |
|---|---|---|
| `utility-planning-engineer` | Design and planning inside a water utility — the system, not the parcel | `journal.md`, `wishlist.md` |
| `utility-field-operator` | The person who opens the map ON A PHONE, in the street, to read it rather than draw it | `journal.md`, `wishlist.md` |
| `market-researcher` | The world OUTSIDE this repository: who else solves these problems, and what it costs the people solving them | `journal.md`, `wishlist.md` |
| `data-entry-clerk` | Entry at VOLUME, by keyboard: what a gesture costs when repeated four hundred times | `journal.md`, `wishlist.md` |

**Each agent keeps a journal and a wish list.** The journal is what it learned; the wish list is
what it would build next, in its own order. Tom, 2026-08-24: *"We all have our pet priorities, and
the utility engineer should have theirs."* A wish list is expected to DISAGREE with
`dev/ROADMAP.md` — that disagreement is most of what a seat is for. No agent edits the roadmap;
promoting a row is Tom's call.

**Every journal entry carries one provenance tag.** CITED = external source, named. OBSERVED
= this repository, `path:line`. SPECULATION = the agent's own inference. The first two may be
quoted by a later invocation; the third must be re-derived. Untagged is a defect, and a
SPECULATION is upgraded only by finding the source — never by still sounding right.

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
