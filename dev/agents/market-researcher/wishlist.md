# Wish list — market-researcher

- **I add rows here; I never edit `dev/ROADMAP.md`.** Promoting a row is Tom's call.
- **Every row carries a citation and an honest size.** A row with no source is a guess.
- **Rank honestly, including against myself.** Something I found is not thereby important.
- **State the case once and do not campaign.**

## 0. Add a licence re-check step to the epanet-js upgrade instructions

2026-09-08: checking Tom's EPANET-freedom-hierarchy statement, I found that `epanet-js`'s own
GitHub `LICENSE` file (`github.com/epanet-js/epanet-js/blob/main/LICENSE`, fetched today) now
carries a mixed MIT + FSL-1.1-MIT structure — plain MIT for the original Placemark-era commit,
FSL-1.1-MIT (Iterating Inc., 2025) for everything contributed since. The vendored `0.9.0` package
(`js/vendor/epanet-js.LICENSE`) is still pure MIT with none of that text, so nothing shipped today
is affected. But `js/vendor/README.md`'s own "Upgrading" section says `npm pack epanet-js`,
re-copy two files, redo one import-specifier edit, run the validator — **no step re-checks the
licence**, so a future upgrade past 0.9.0 could silently pull FSL-covered code. Cheap, one line
added to that section. Not something this seat can edit itself (shipped file); recording it here
for whoever next touches that README. Ranked at 0 because it costs nothing and prevents a real
mistake, not because it is urgent — nobody is upgrading that dependency today.

## 0b. One exploratory email to the Open Water Foundation

2026-09-08, prompted by Tom's standing donate-the-project offer: of six candidate foundation homes
checked (Software Freedom Conservancy, NumFOCUS, OSGeo, Apache, Linux Foundation/LF Energy, Open
Water Foundation), five have a known, months-long process and structural prerequisites this project
does not meet today (SFC wants "an existing, vibrant, diverse community"; NumFOCUS wants a 3-person
leadership body from different employers; Apache would force a GPL-to-permissive relicense, which
runs against the freedom-hierarchy Tom himself stated the same day). **The Open Water Foundation
(openwaterfoundation.org, a small water-sector 501(c)(3), CEO Steve Malers) is the only one where I
could not find a public answer either way to "do you take on donated third-party projects,"** and it
is the closest sector match of the six. A single email would resolve that unknown for near-zero
cost. Full comparison: journal, 2026-09-08 entry, Part 2. This is a fact-finding suggestion, not a
donation recommendation — see that entry's closing note on what statement (2) actually is (a
standing offer, not a decision to act).

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

## 7. Progress indicator on the first EPANET-engine fetch, and a connection-aware idle-prefetch as the missed third option

Task 605 (2026-09-06) made EPANET the page default, which means every first-time `lpn_` visitor now
pays the 664 KB engine fetch on click rather than by opt-in. Two findings, ranked:

**(a) Add a percent-done progress indicator to that fetch, regardless of anything else.** Cheapest
possible size, directly backed by Nielsen's response-time thresholds (nngroup.com/articles/response-
times-3-important-limits: past ~1s needs feedback, past 10s needs a percent-done indicator or
abandonment follows) and NN/g's progress-indicator literature (perceived wait falls measurably with
an animated percent bar vs. silence or a spinner). Helps every visitor on every connection and is
independent of the precache decision.

**(b) A connection-aware idle-prefetch, scoped to the `lpn_` page only, as the third option the
original framing (precache-for-everyone vs. fetch-on-click) missed.** `navigator.connection
.effectiveType`/`.saveData` let the page itself decide, per visitor, which cost is smaller — prefetch
in the background once the page is idle UNLESS the visitor is on 2G/slow-2G or has data-saver on, in
which case leave today's fetch-on-click path (with indicator (a)) exactly as is. This protects the
exact population (RWSN/EWB/Peace Corps LMIC users, journal 2026-09-04) this suite's own mission
targets, without taxing the other 15 calculators' visitors the way a blanket precache would. Caveat
found and stated plainly: the Network Information API is Chromium-only (web.dev/articles/adaptive-
loading-cds-2019) — Safari/Firefox visitors get no signal and should fall back to the safer default
(fetch-on-click), not to an unconditional prefetch.

Full citations, the bandwidth/cost numbers for the affected populations, and what I could not verify
(Ookla primary data, the A4AI/ITU primary report, epanetjs.com's own loading strategy): journal
2026-09-06. Ranked below the CSV/GPX importer (already promoted to Task 592) because that one has a
documented population stuck on it; this one is my own inference from response-time literature plus
one architectural idea, not a user asking for it by name.

## 8. A direct, personal note to Luke Butler — cheap, well-supported by evidence, and independent of any code question

2026-09-08: Tom asked about allying with Luke Butler (Iterating/epanet-js). The one piece of evidence
that actually answers "can this person be trusted with a friendly overture" is Tom MacWright's own
account (macwright.com/2025/07/03/epanet-placemark) of Butler and Payá voluntarily sending fixes
upstream to Placemark, the MIT codebase epanet-js is built on, before/alongside commercialising their
own product on top of it. That is independently-sourced evidence of good-faith open-source behaviour,
not Iterating's own marketing. **Recommendation: a short, honest, no-ask message from Tom to Luke
Butler directly** (not through epanetjs.com, per Tom's own stated constraint) — draft in the journal
entry above. Cost: one message. This is a "send it" row, not a "build" row, and it is entirely
Tom's call whether and when. Ranked here rather than higher because it is a relationship gesture, not
a product finding, and this seat's job is findings.

**Separately, and more load-bearing for the "can we join" question: the cheaper and more natural
door is OWA-EPANET (the engine's own MIT community), not Iterating.** No CLA found, contribution
starts at GitHub Issues, per the project's own README. If Tom wants to "join the EPANET community" in
the sense of the engine itself, that is a different and easier target than an alliance with Luke
Butler specifically, and the two should not be conflated in any outreach he sends.

## 9. The EWB contour sentence — a claim of absence, not of primacy, and exactly what it can and cannot cover

2026-09-08, ahead of Tom's EWB presentation in ~10 days: the safe sentence is in the journal entry
above verbatim. The one thing worth surfacing here because it is actionable before the talk: **do not
let the sentence expand past its evidenced boundary** — EPANET (source read directly), Bentley's
public docs (silent), epanet-js's public roadmap (silent), and one direct prior-art search (nothing
found). It has NOT been checked against WaterGEMS's actual algorithm (undocumented), InfoWater, QGIS/
GRASS plugins purpose-built for water networks (not searched this session), or the academic literature
(Ohmer et al. 2017 and Walski et al.'s textbook both unreachable). If there are ten days before the
talk, the single highest-value follow-up this seat could do is try again to reach Walski et al.,
*Advanced Water Distribution Modeling and Management* (via a library, not the open web) and the
Ohmer et al. 2017 abstract on ScienceDirect through an institutional proxy — both blocked this session
and last, and both are the most likely places a competing claim could already exist. Flagging as the
next action rather than doing it now, since it needs an access route this environment does not have.

## 10. SUPERSEDES ROW 8 — OWA-EPANET first, Luke Butler second, and the note raises the naming concern

2026-09-08, after Tom's ruling on the EPANET name (journal, second entry of that date, section 1,
his words verbatim). **Row 8 above is superseded and must not be sent as drafted**: it offered
no-strings contribution to epanetjs.com, which is precisely what he says he cannot offer in good
faith. It is left in place as the record of what this seat recommended before knowing his position.

**What changed and what did not.** The evidence for writing to Luke Butler at all is untouched
(MacWright, `macwright.com/2025/07/03/epanet-placemark`). What changed is the shape: the note now
raises the naming reservation up front and states plainly what Tom would and would not do. Revised
draft, 246 words, is in the journal entry, section 5.

**Two things I verified that should reach him before he sends anything.** (a) The channel is
`youtube.com/@iteratinginc`; **7 of the 10 titles in its feed name epanet-js, and only 3 do not** —
"Fire flow analysis with EPANET", "Georeference an EPANET model", "From GIS to running model -
EPANET modeling workshop". The title he recalled does not exist verbatim. The fair charge is
search-intent ambiguity, not dishonesty, and I recommend he not use that word in a first message.
(b) **I could not reach any primary trademark register from this environment** — eight routes
tried, all blocked, each named in the journal. Nothing secondary suggests a registration exists for
EPANET, epanet-js or Iterating, and EPA's own page says EPANET is public domain and that EPA
endorses nobody. Do not upgrade that to "there is no trademark" without a person checking
`tmsearch.uspto.gov` by hand.

**The ranked recommendation: OWA-EPANET first, and it is now a sequencing argument, not just a
cheaper door.** Tom's objection is that the EPANET name belongs to the community; OWA-EPANET IS
that community. Contributing there is the positive form of the same conviction, has no awkward
first sentence, is where our actual dependency lives, and gives him standing in the community he is
invoking when the note to Butler goes out. Honest caution: OWA is asynchronous and GitHub-shaped,
so it produces a contribution over weeks, not a handshake in ten days.

**One thing for Tom, not for me: `dev/positioning.md` section 6 currently cites epanet-js as "the
standing proof that the name can be used this way" and says the question is settled.** His ruling
removes that precedent. The legal leg is untouched; the norms leg loses its only citation. I have
not edited that file and will not — flagging it so he decides.
