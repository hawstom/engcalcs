# Wish list — market-researcher

- **I add rows here; I never edit `dev/ROADMAP.md`.** Promoting a row is Tom's call.
- **Every row carries a citation and an honest size.** A row with no source is a guess.
- **Rank honestly, including against myself.** Something I found is not thereby important.
- **State the case once and do not campaign.**

## 1. CSV/GPX import of surveyed points as junctions

**Not on `dev/ROADMAP.md`** (checked 2026-09-04, grepped for csv/gpx, zero hits). A field
survey — the actual input method for the EWB chapters and Peace Corps volunteers who most
resemble this suite's audience (journal rows 4–5) — produces a flat list of id/lat/lon,
never an EPANET `.inp`. EPANET itself has no built-in path for this either; multiple
independent forum threads (Open Water Analytics, Eng-Tips) exist asking how, and the
answer is always an ad hoc workaround. This suite already reads `.inp` (`js/lpn-inp.js`)
and already has a geographic project mode with lon/lat storage (`dev/geographic-
projects.md`) — the hard parts (projection, origin handling) are built. What is missing
is a small importer: one column mapping step, one batch of junctions created at their
surveyed coordinates, elevation optional. Medium size — smaller than the `.inp` importer
it sits beside, and it slots into the existing "New assets > Elevation source" pattern
(Task 542) rather than inventing a new door.
**Why it ranks first:** it is the one gap I found with an actual paper trail of people
stuck on it, in the exact population this suite serves, and it is genuinely absent from
the roadmap rather than a restatement of something already queued.

## 2. Do not build a Windows executable — no evidence of demand, and the PWA likely already answers it

This is a "stop" recommendation, not a build. I searched specifically for a small utility,
an EWB chapter or a Peace Corps volunteer asking for an installable desktop build and
found nothing. `dev/positioning.md` §3 already records this suite as an installable
offline PWA — which is the actual need (works without a live connection) most often
conflated with "wants a .exe." Zero cost to leave this alone; the risk is spending effort
answering a question nobody in the researched population is asking. If Tom's own reason
for raising it (2026-09-04) is something other than offline use — e.g. distribution
through a channel that only takes native installers — that is a different question this
research does not answer, and is worth asking him directly rather than guessing.

## 3. A third, independent argument against cloud logins/saves — connectivity, not just liability

Already effectively closed at Task 537 (parked 5), argued from two angles (field-operator:
GIS/CMMS mismatch; planning-engineer: legal/DPA exposure). I did not find a citable source
proving the specific EWB/Peace Corps projects I named have poor connectivity — this is
SPECULATION drawn from the well-known general condition of rural/developing-world field
work, not a measured fact — but it is a THIRD reason pointing the same direction as the
existing two: a volunteer doing a one-off design in the field cannot depend on a cloud
account being reachable when they need it. **I am not proposing to reopen Task 537** — it
is already parked at the right conclusion — I am recording that the outside evidence, where
I could find any, keeps landing on the same side rather than the other. Size: zero, this is
a note, not a build.

## 4. Watch, do not chase: epanet-js's free Education tier

epanet-js now gives free full access to students/teachers with a school email
(epanetjs.com/pricing, fetched 2026-09-04) — new since `dev/positioning.md` was last
updated on this point. It narrows their weakest horn (§8, "free is not our
differentiator") for classroom use specifically, though it does nothing for the
volunteer/small-utility populations this suite actually serves, who are not affiliated
with a school. Not a task — a fact for whoever next edits `dev/positioning.md` §8 to know
about, so the file stays accurate rather than stale on this one point. I am not editing
that file myself; it is out of scope for this seat's write access.

## What I did NOT find, stated plainly

I could not find a single published, comparable price for Bentley WaterCAD/WaterGEMS —
every reseller and even Bentley's own pages say "contact vendor." I looked in five
distinct places (bentley.com, virtuosity.com, cadjourney.com, capterra.com, softwareworld.
co) and none carries a number. That absence is itself worth recording: a small system
cannot even learn the cost of the market leader without a sales call, which this suite's
free, no-account, no-quote model does not require of anyone.
