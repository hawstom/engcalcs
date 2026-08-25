# Specialist agents

Definitions live in `.claude/agents/`; each agent's journal lives here, one directory per
agent. An agent starts every invocation with no memory of any previous one — its journal is
the only continuity it has. See `project-specialist-agent-roster` for why an agent must carry
something this repository does not already have.

| Agent | Seat | Files |
|---|---|---|
| `utility-planning-engineer` | Design and planning inside a water utility — the system, not the parcel | `journal.md`, `wishlist.md` |
| `utility-field-operator` | The person who opens the map ON A PHONE, in the street, to read it rather than draw it | `journal.md`, `wishlist.md` |

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
inspector or operator** — *"they need a map!"*. **The field operator was hired 2026-08-25** and is
in the table above; the clerk and the surveyor are still unfilled.

**The DATA ENTRY CLERK is the next one Tom wants.** 2026-08-25, drawing the line between them:
*"they aren't a data entry clerk, who would be very interesting to hire."* Their subject is entry
at volume — tab order, customizable panes, every bell and whistle muffleable — which is a different
vantage point from the operator's read-and-find, and neither should answer for the other. A seat earns an agent
by carrying external evidence or a vantage point nobody here has, not by completing a set.
