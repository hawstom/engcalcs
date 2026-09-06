# Wish list — market-researcher

- **I add rows here; I never edit `dev/ROADMAP.md`.** Promoting a row is Tom's call.
- **Every row carries a citation and an honest size.** A row with no source is a guess.
- **Rank honestly, including against myself.** Something I found is not thereby important.
- **State the case once and do not campaign.**

## 1. CSV/GPX import of surveyed points as junctions

**PROMOTED 2026-09-06 — it is now `dev/ROADMAP.md` Task 592, priority 50.** Placed at 50 rather than
75 because nothing is waiting on it and Tom has not asked for it; the case for moving it up is this
row's, and it is made below. Left here in full, because a wish list records what this seat wanted
and why, not only what is still unbuilt.

**Was not on `dev/ROADMAP.md`** (checked 2026-09-04, grepped for csv/gpx, zero hits). A field
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

## 5. Do not default `k` to a nonzero value — but a fittings picker is a real, evidenced gap

Tom asked 2026-09-04 whether a new `lpn_` pipe should be born with a nonzero minor-loss
coefficient instead of the current empty (=0) box. Every tool I could examine agrees
with the status quo: EPANET's own default is 0 (openepanet.org forum, corroborating
EPANET docs); epanet-js's is 0, verified directly in their open-source repo
(`libs/hydraulic-model/src/asset-types/link.ts:19`,
`export const DEFAULT_MINOR_LOSS = 0;`); WaterGEMS/WaterCAD and KYPipe both use a
per-pipe fittings list summed to a total (Bentley's "Minor Loss Collection", KYPipe's
"ΣM"), which is zero absent any picked fitting. No source anywhere recommends a blanket
nonzero k on a plain pipe; the closest thing to a real practice is entering a
site-specific value at a PUMP STATION, where three independent named practitioners on
the EPANET forum (openepanet.org/Topic/22383) describe measured minor losses of 2-7.5%
of pump head — a number that is load- and configuration-dependent, not a constant.
**Recommendation: leave the default at zero. Do not build a nonzero default.**

**What IS a real, differently-shaped gap:** every commercial tool I found (WaterGEMS,
KYPipe) gives the modeler a fittings picker (name a fitting, pick a quantity, the tool
sums the K) rather than one bare number to guess. This suite's pipe has one plain k
field and nothing else. That is a genuine feature gap relative to the market, but it is
a UX/effort question for the planning-engineer seat or the roadmap to size — not
something this seat can price, and not the same question as "what should the default
be." I am recording it here so it is not lost, ranked below my existing CSV/GPX finding
because I have no evidence anyone in this suite's actual population (small/rural
utilities, EWB, Peace Corps — journal 2026-09-04) has ever hit this as a blocker, versus
CSV/GPX import which has a documented forum trail of people stuck on it.

## 6. Do not credit epanet-js.com on the Not EPANET gratitude page — keep the internal record

Tom asked 2026-09-06 whether the Not EPANET gratitude section should also thank epanet-js.com for
"pioneering some of our design decisions." Two outside precedents converge against it: The
Document Foundation's 2020 open letter to Apache OpenOffice, which read externally as "comparison
dressed in gratitude" even with real shared code ancestry behind it (blog.documentfoundation.org),
and Slack's 2016 NYT ad "welcoming" Microsoft Teams, which critics read as revealing anxiety rather
than confidence because Slack was the smaller party addressing the one it feared
(linkedin.com/pulse/why-slacks-full-page-ad-new-york-times-epic-fail-justin-bariso). This suite is
in Slack's position relative to epanet-js (smaller, unfunded, newer), which is the wrong position
for the gesture to land as generous. Task 591/544 already scoped the one competitor-naming
exception to EPANET alone and said explicitly it "does not travel" — this is that travel. Recorded
as a **stop**, not a build: keep crediting epanet-js internally (already done, positioning.md
§7/§8, ROADMAP 283/384/409/451/498), and do not put it on a public page. Zero cost to leave alone.
Separately, checked and clean: MIT attribution for the vendored `epanet-js` npm toolkit (Luke
Butler) is fully discharged today — `js/vendor/README.md`, `js/vendor/epanet-js.LICENSE`, and the
on-page Notes entry (`lpn_notes_engine_def`) all name it. No licence gap exists on this question
either way.
