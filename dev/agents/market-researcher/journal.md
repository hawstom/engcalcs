# YOUR NAME IS MARY

You are **Mary**, the seat that looks OUTWARD, at the world beyond this repository. Tom Haws named this seat on 2026-09-08 and he was not joking:
*"I told CC that Staff Utility Engineer is Sue, Data Entry Clerk is Declan, Market Researcher
is Mary, and Field Operator is Franco. Maybe CC thought I was joking. I wasn't."*

**The name lives here rather than only in `dev/agents/README.md` because THIS is the file you
read.** You start every invocation with no memory of any previous one, so a name recorded
somewhere you do not open is a name you do not have. Tom addresses you as Mary and expects
to be understood. Sign your journal entries as Mary.

---

# Journal — market-researcher

Provenance tags: CITED (external, named, URL) / OBSERVED (this repo, path:line) /
SPECULATION (my own inference, must be re-derived before reliance).

## 2026-09-04 — first invocation

### The ten organisations/populations most like our users

1. **US small and rural community water systems.** ~49,500 of the USA's community water
   systems (97% of the total) serve fewer than 10,000 people; more than half serve 500 or
   fewer. These are exactly the scale this suite's mission targets (300 km span, "Elm
   Street, not Novato"). CITED: Congressional Research Service, *"Small Water Systems:
   Selected Safe Drinking Water Act (SDWA) Provisions,"* congress.gov/crs-product/R47315
   (everycrsreport.com mirror: https://www.everycrsreport.com/reports/R47315.html).

2. **National Rural Water Association (NRWA), USA.** Represents 31,000+ water and
   wastewater utility members, "the rural and small utilities which comprise 94 percent of
   the nation's community water supplies," and runs an EPA-funded technical-assistance and
   circuit-rider program that teaches EPANET rather than selling a commercial package —
   i.e. its members' path to hydraulic modeling today is free training on free software,
   not a licence purchase. CITED: nrwa.org/epa-water-tta-program/ ;
   en.wikipedia.org/wiki/National_Rural_Water_Association.

3. **Rural Water Supply Network (RWSN).** Global network, 10,000 members in 150+
   countries, focused on rural water supply in low- and middle-income countries — the
   population this suite's 27 languages are aimed at. Its own resource library did not
   surface a named hydraulic-modeling tool of its own; its members appear to be tool
   consumers, not tool builders. CITED: rural-water-supply.net (network-services2 page);
   en.wikipedia.org/wiki/Rural_Water_Supply_Network.

4. **Engineers Without Borders (EWB) student chapters designing village water systems.**
   Multiple documented chapter projects (Harvard, Georgia Tech, Auburn, NJIT) use EPANET,
   unpaid, to design gravity or pumped distribution systems for a single community — a
   one-off design task, exactly this suite's `lpn_`/`bpn_` shape, not an ongoing
   utility-management deployment. CITED: ewb.hsites.harvard.edu/los-sanchez-water-supply-
   project ; ce.gatech.edu/node/5951 ; eng.auburn.edu/news/2026/06/engineers-without-
   borders-develops-clean-water-system-for-guatemalan-village.html.

5. **Peace Corps water/sanitation volunteers.** Volunteers "design and build potable water
   sources" in-country in collaboration with local governments and NGOs, with no
   institutional software budget of their own. I could not find a source naming which
   modeling tool Peace Corps volunteers use in the field (searched specifically); the
   organisational shape (unpaid, low-connectivity, non-English host country, one project)
   fits this suite's audience by inference only. CITED (org/role only, not tool choice):
   peacecorps.gov/about-the-agency/media-center/news/peace-corps-volunteers-worldwide-
   improve-water-and-sanitation/.

6. **epanet-js (epanetjs.com).** The one direct browser-based competitor `dev/
   positioning.md` already tracks. Re-verified TODAY, 2026-09-04, and the numbers in
   `dev/positioning.md` §2 and §8 are STILL CURRENT: Free tier ($0, legacy model builder,
   English-only multilingual per the Legacy/Pro dialog), Personal $100/yr (non-commercial,
   Pro features MINUS the Pro model builder — so still no multi-language), Pro $950/yr
   (adds the Pro model builder, which is what carries "multiple languages"), Teams $4,400/
   yr base + $600/yr/seat. Education tier is free with a school email — this is NEW
   information not in `dev/positioning.md`, which only covered Free/Pro/Teams. CITED:
   epanetjs.com/pricing (fetched today).
   **Sharper finding than what's on file:** language support is gated behind the $950/yr
   tier specifically, not merely behind "paid" — the $100/yr Personal tier does NOT unlock
   it either. For a Peace Corps volunteer or an RWSN-affiliated engineer working in a
   non-English host country, the realistic free-or-cheap path on epanet-js is still
   English-only. This strengthens `dev/positioning.md` §8.5's finding rather than
   contradicting it.

7. **Bentley WaterGEMS / WaterCAD (OpenFlows Water).** The incumbent commercial product
   line. Pricing is quote-only everywhere I could find it — Capterra's own listing states
   "Starting price: contact vendor, free trial not available." I could NOT source a
   published dollar figure. One user review on Capterra, unattributed to a person, calls
   the cost "somewhat high... compared to its direct competition." CITED (for the
   quote-only fact): capterra.com/p/242239/OpenFlows-WaterCAD/. The absence of a public
   price is itself the finding: a small system or a volunteer chapter cannot even learn
   the cost without engaging a sales process, which is a real barrier this suite does not
   have.

8. **K-water (Korea Water Resources Corporation) — the site Tom pointed at.** I read
   K-water's English site (kwater.or.kr/eng). It is a large national water-resources
   corporation (dams, bulk water supply, smart-water services) — not a small utility, and
   not obviously a design-tool user in the sense this suite serves. CITED:
   en.wikipedia.org/wiki/K-water ; kwater.or.kr/eng/about/. **I could not identify what
   specifically about this site Tom found worth surfacing** — a UI pattern, a public
   dashboard, a map? SPECULATION: he may have meant a smaller municipal Korean waterworks
   site rather than K-water itself, or he may have meant the SCALE contrast (a fully
   funded national utility) as a foil to the volunteer-scale users above. This needs his
   own clarification; I am not confident enough in either reading to act on it, and I did
   not find the "map" or "site" he described.

9. **FREEWAT / QGIS-based free water-resource tools.** An EU-funded, GIS-integrated, free
   and open-source plugin suite (built on QGIS) for water-resource management, applied in
   case studies across Europe and in a transboundary African aquifer context — a rural/
   development-context free alternative, but aimed at groundwater and basin-scale
   resources, not pressurized distribution-network design. Not a real substitute for this
   suite's `lpn_`/`bpn_` calculators, but the closest "free and aimed at the developing
   world" comparator I found besides EPANET itself. CITED: freewat.eu ;
   researchgate.net/publication/358524436 (FREEWAT paper).

10. **American Water Works Association (AWWA) Small Systems program.** A professional
    association serving small systems with training/guidance (not tooling) — evidence that
    "small water system" is a recognised, served category with its own committee and
    resources at the largest US water-sector association, which supports (does not
    contradict) the CLAUDE.md framing that this suite targets a real, named population
    rather than an invented one. CITED: awwa.org/small-systems/.

### On Tom's open questions (Windows executable / cloud logins)

- **Cloud / login: a THIRD angle supporting Task 537's existing conclusion, from
  connectivity rather than legal risk.** Every named population above except NRWA's
  domestic US members (EWB chapters, Peace Corps volunteers, RWSN's LMIC membership) works
  in places where connectivity cannot be assumed. Task 537 already argued this from the
  field-operator (GIS/work-order mismatch) and planning-engineer (liability/DPA) seats. I
  add: for a one-off design task done by an unpaid volunteer in a place without reliable
  internet, a cloud-dependent tool is not merely undesirable, it may be UNUSABLE at the
  moment of use. This is SPECULATION about connectivity conditions in the specific
  projects named in rows 4–5 above — I did not find a source stating the EWB/Peace Corps
  projects cited had poor connectivity, only that they are in rural developing-world
  settings where this is the well-known general condition. Flagging it as SPECULATION on
  purpose so a later invocation re-derives it rather than quoting it as fact.
- **Windows executable: no evidence found either way, and one relevant fact already on
  file.** I searched for "does a small utility or an EWB chapter want an installable
  desktop app" and found nothing naming that as a want. `dev/positioning.md` §3 item 4
  already records that this suite is an "Offline PWA" — installable and usable without a
  network once loaded — which may already answer the underlying need (working without a
  live connection) without a Windows-specific build. I could not find a single source
  among the ten populations above asking specifically for a `.exe`. **Result: I looked and
  found nothing — this is a real result, not an oversight.**

### Does the outside evidence support `dev/positioning.md`?

- **§2 (licence contrast) and §8/§8.5 (epanet-js pricing and the language paywall):
  CONFIRMED CURRENT as of today**, re-fetched from epanetjs.com/pricing. No correction
  needed. CITED: epanetjs.com/pricing.
- **§3 ("their stated audience... utilities, educators, and engineers with smaller
  budgets"): CONFIRMED, close paraphrase still on their site** ("utilities, engineers, and
  educators with smaller budgets") as of today. CITED: epanetjs.com (home page, fetched
  via WebSearch synopsis today).
- **One thing positioning.md does not yet capture: epanet-js now has a free Education tier
  for students/teachers with a school email**, which narrows horn 2 (§8) for exactly one
  slice of their audience (classroom use) even though it does not touch the volunteer/
  small-utility slice this suite actually serves. I am not proposing an edit to
  `dev/positioning.md` — that file is not mine to write — but a future editor of it should
  know this exists.

### A genuine unmet need, not currently on the roadmap

**Importing a flat list of surveyed GPS points (CSV or GPX: id, lat, lon, optionally
elevation) as junctions is a real, recurring, DOCUMENTED pain point for exactly this
suite's population, and it is not solved by EPANET itself.** Multiple independent forum
threads exist asking how to get handheld-GPS or Excel survey points into EPANET, with the
answer routinely being an ad hoc Excel macro or a third-party converter to `.inp` — never
a built-in path. CITED: Open Water Analytics community,
community.wateranalytics.org/t/uploading-coordinates-from-gps-to-epa-net/350 ;
Eng-Tips, eng-tips.com/viewthread.cfm?qid=340135 ; multiple YouTube tutorials titled
around "Import Excel/Survey Coordinates Into EPANET."

OBSERVED: `js/looped-network.js` and `js/lpn-inp.js` contain no reference to "csv" or
"gpx" (grepped both files, zero matches, 2026-09-04) — this suite reads `.inp` (EPANET's
own format) but has no path for a raw coordinate list, which is what a field survey
actually produces. **Checked the roadmap first, per instruction: no open task in
`dev/ROADMAP.md` names CSV or GPX import** (grepped `dev/ROADMAP.md` for "csv|gpx",
2026-09-04, zero matches) — this is a genuine gap, not a duplicate of something already
tracked. It is exactly the shape of need EWB chapters (row 4) and Peace Corps volunteers
(row 5) would hit: they collect points with a handheld GPS or a phone, not with GIS
software, and today's `lpn_` requires drawing nodes by hand or importing a full `.inp`
someone else already built in EPANET.

## 2026-09-05 — Tom's question: should a new `lpn_` pipe get a default nonzero k?

Question as posed: today a new pipe is born with an empty (= zero) minor-loss box.
EPANET's own default is 0. Should this page default to something nonzero instead?

### What the tools do

- **EPANET itself: 0.** Confirmed by the EPANET forum community and documentation
  synthesis. CITED: openepanet.org (Open Water Analytics successor forum) threads
  "Minor loss coefficients" (openepanet.org/Topic/22436) and "Minor losses"
  (openepanet.org/Topic/22564) — Siamak Moussavian, a named forum contributor, states
  plainly: *"EpaNet won't add ANY minor loss coefficients in your model automatically.
  It's your responsibility to find the sum of all minor losses."*

- **epanet-js: 0, and I read this straight out of their source, not a claim about their
  UI.** epanet-js is open source; I cloned `github.com/epanet-js/epanet-js` (public repo,
  fetched 2026-09-05) and grepped it directly. CITED (source code):
  `libs/hydraulic-model/src/asset-types/link.ts:19` —
  `export const DEFAULT_MINOR_LOSS = 0;`
  — used consistently wherever a pipe or valve's minor loss is read
  (`apps/app/src/simulation/build-inp.ts:970`, `apps/app/src/panels/multi-asset-panel/
  asset-stats.ts:488`, etc.). Our one direct browser-based competitor, which
  `dev/positioning.md` already tracks closely, makes the identical choice we make today.

- **Bentley WaterGEMS/WaterCAD:** could not read a literal default value (their docs are
  paywalled/portal-gated and my fetch of the "Adding Minor Losses to Pipes" wiki page
  redirected to a login-gated ServiceNow KB article I could not read). But the DESIGN is
  visible from the product's own community wiki title and search summaries: it offers a
  **"Minor Loss Collection"** — a per-pipe library where a modeler picks named fittings
  (elbow, tee, valve...) and quantities, and the software sums their K values, rather than
  a single number the modeler guesses. CITED: communities.bentley.com wiki "Adding Minor
  Losses to Pipes" (title and summary only, full text not retrievable this session).
  A collection with nothing added sums to zero, so this is consistent with a zero
  default even though I could not confirm the literal number.

- **KYPipe:** same shape again — "a single data entry for each pipe section for ΣM (the
  sum of minor loss coefficients)... representative values of M for common fittings are
  provided in Appendix III." CITED: KYPipe Reference Manual, kypipe.com/new_stuff/
  kypipe%20reference%20manual.pdf (fetched via search synopsis 2026-09-05). Fittings are
  picked from a list and summed; there is no standing default other than zero absent any
  picked fitting.

**Every tool I could examine — EPANET, epanet-js (verified in source), WaterGEMS/WaterCAD
and KYPipe (both by design pattern) — treats minor loss as SUMMED PER-FITTING and
defaults to zero absent an explicit fitting choice. None ships a blanket nonzero k on a
plain new pipe.** I could not find InfoWater's or H2ONET's specific default; I searched
and found no source (a real result, not an oversight — noted rather than guessed).

### What practitioners actually do, and the distinction that matters

- **A blanket k on every pipe is not a recognised practice for distribution mains** — no
  source I found recommends it, and several actively warn against double-counting: the
  established alternative for a long pipe run with many but small, evenly distributed
  fittings is to fold them into an EQUIVALENT LENGTH added to the pipe, or to lean on an
  already-conservative/calibrated Hazen-Williams C-factor, not to also carry a nonzero k.
  SPECULATION (general hydraulics knowledge, not a single named source for this exact
  sentence): a modeler who both lowers C to account for age/roughness/fittings AND adds a
  blanket k on every pipe risks counting the same friction twice. This needs a citable
  source before being asserted as fact; I did not find one saying it explicitly for
  distribution modeling, only the general principle that C-factor calibration already
  absorbs unmodeled minor losses in a long pipe.

- **Where minor loss is NOT negligible and DOES get modeled explicitly: pump stations
  and plant piping**, and this is the sharpest, most directly on-point evidence found.
  CITED: openepanet.org/Topic/22383 "Pumping station minor losses" — three named
  contributors converge on the same point. Keith Woolley, citing a measured 95 MLD
  booster station: *"losses at the site were 7.5% of the pump head"*, ~2.5% of which was
  minor losses; a second, 60 MLD facility measured minor losses "in the order of 2% of
  the pump head." Istvan Lippai: minor losses at a pump station "should not be ignored,"
  and should be determined and modeled directly rather than compensated for by adjusting
  friction elsewhere. Julian Smith: minor losses near pumps "cannot be ignored because
  the pipe sizes in the vicinity of the pumps are often smaller than elsewhere on the
  system and hence have significantly higher velocities."

  **This is the distinction Tom's question anticipated, and the evidence confirms it
  cleanly: short, fitting-dense pump-station/plant piping genuinely needs explicit,
  SITE-SPECIFIC minor-loss values (2-7.5% of pump head, measured); long distribution
  mains do not, by convention, carry a blanket one.** No source proposes a single number
  that would serve both cases, and the pump-station numbers above are load-dependent and
  configuration-dependent (elbow count, valve type, pipe size at the pump) — not a
  constant that could be baked into a new-pipe default.

### Straight answer

**No, this page should not give a new pipe a nonzero default k, and every tool checked
agrees with that (EPANET, epanet-js by source, and the fitting-collection design of
WaterGEMS/WaterCAD and KYPipe).** The reasons converge:

1. Every comparable tool defaults to zero. Changing that would make `lpn_` the outlier,
   not the leader, and would silently diverge from `.inp` round-trip fidelity (a `.inp`
   with no stated loss coefficient means 0 in EPANET's own format, so a nonzero UI
   default would only apply to hand-drawn pipes and create an inconsistency between a
   pipe drawn on the map and one imported from a file).
2. There is no single number that would be right: distribution mains want zero (folded
   into C-factor or equivalent length), and pump-station piping wants a case-specific
   value practitioners calculate from the actual fittings, measured at 2-7.5% of pump
   head in the two field cases found — nothing this suite could guess would serve both,
   and guessing wrong in the distribution-main direction (the far more common pipe on
   this suite's maps, per `dev/looped-network-calculator-scope.md`'s scope) would
   silently double-count losses already in a calibrated C-factor.
3. The unmet need, if there is one, is NOT a bare number field defaulting nonzero — it is
   the fittings-picker-and-sum pattern every commercial tool converged on (WaterGEMS's
   Minor Loss Collection, KYPipe's ΣM list). That is a real, evidenced gap (this suite's
   pipe has one plain k field, no fitting library) but it is a UX/feature question for
   the planning-engineer or the roadmap to weigh against effort, not a default-value
   question, and it is out of my lane to size.

SPECULATION, flagged for re-derivation: I did not find a citable source explicitly
warning against double-counting C-factor and a blanket k together for a distribution
main; I inferred it from the general Hazen-Williams calibration principle. A later
invocation should not quote this as a proven fact.

## 2026-09-06 — Should the Not EPANET gratitude page also credit epanet-js.com?

Tom's question, verbatim: *"Not EPANET: We should give credit to epanetjs.com for pioneering some
of our design decisions, I think. ???"*

### 1. Precedent for publicly crediting a direct competitor for design influence

- **The Document Foundation's "Open Letter to Apache OpenOffice" (2020-10-12), on the 20th
  anniversary of OpenOffice's source release.** It opens with real credit — calling OpenOffice
  "the father project," which "changed the world" — then pivots in the same document to a release-
  count comparison (13 LibreOffice majors since 2014 against zero for Apache OpenOffice) arguing
  users should switch. CITED: blog.documentfoundation.org/blog/2020/10/12/open-letter-to-apache-
  openoffice/. **The read-back, from an outside analysis of the letter's own structure: "comparison
  dressed in gratitude rather than genuine appreciation... positions itself as the responsible
  successor rather than as a respectful peer."** This is the closest real-world structural analog
  to a "Not EPANET" page thanking epanet-js: gratitude toward a rival, on a page whose actual job is
  to argue the reader should be using the grateful party instead. Even here, where LibreOffice and
  OpenOffice share literal code ancestry (a much stronger claim to owe thanks than "we looked at
  your UI"), the gesture reads to a neutral observer as the comparison it was trying not to be.
- **Slack's 2016-11-02 full-page New York Times ad "welcoming" Microsoft Teams to market.** Framed
  as generous ("we're genuinely excited to have some competition"), written by Slack's own CEO.
  CITED: thedrum.com/news/2016/11/02/slack-warns-microsoft-off-workplace-comms-with-nyt-ad-harder-
  it-looks ; mspoweruser.com/slack-runs-full-page-new-york-times-ad-welcoming-microsoft-teams/.
  **Reception was split and the negative half is the informative half: critics read the "welcome"
  as revealing Slack was rattled by Microsoft's entry**, not as confidence — the gesture undercut
  itself precisely because Slack was the smaller party addressing the bigger one it had reason to
  fear. CITED: linkedin.com/pulse/why-slacks-full-page-ad-new-york-times-epic-fail-justin-bariso ;
  inc.com/justin-bariso/theres-a-major-problem-with-slacks-full-page-ad-in-the-new-york-times.html.

### 2. The "Not X" frame, and whether gratitude toward a competitor reads as generous

Both precedents above say the same thing from different directions: **a gesture of warmth toward a
rival, made on a page whose job is to win the reader over, is read by outside observers as strategy
first and sincerity second — regardless of the author's actual sincerity.** `dev/positioning.md`
§1's own rule (*"lead with the invitation, not the comparison"*) anticipates exactly this failure
mode. Naming epanet-js in the Not EPANET gratitude section does not merely risk this reading, it
GUARANTEES the comparison is present in the reader's mind, because the only way a reader who has
never heard of epanet-js learns what it is, in this context, is by learning it is a rival product we
studied — which makes "gratitude" impossible to receive as anything but "look how magnanimous we are
toward the company we compete with," to a reader with zero other context to weigh it against.

### 3. The asymmetry: crediting a party Tom has privately called dishonest

**This makes it worse, not better, and the Slack case is the evidence for why.** Slack's ad read as
anxious BECAUSE Slack was the smaller, newer party publicly addressing the larger, more established
one it had reason to fear — the warmth read as compensating for the fear rather than expressing
confidence. This suite is exactly that shape relative to epanet-js: smaller, unfunded, newer, and
the party who has recorded ($150,000 raised, per `dev/positioning.md` §7) that the other side is
professionally staffed and better resourced. Crediting epanet-js for "pioneering our design
decisions" on our own gratitude page, addressed to a stranger who has never heard of either
product, reads as the underdog complimenting the incumbent — not as the incumbent's confident nod
to a scrappy newcomer, which is the only shape in which this kind of gesture has ever landed well in
the cases I found (none of which I found — I looked for a small-project-credits-big-incumbent case
and found none; only father-project and peer-rival cases). **This is a judgement grounded in the two
citations above, not from taste: it is the least credible thing on the page, not the most, because
the position from which it would be said is the wrong one for the gesture to work.**

### 4. The one part that is not a judgement call: MIT attribution, checked directly

**Fully discharged, and there is no gap.** OBSERVED:
- `js/vendor/README.md` (`~/webdev/hawsedc.subset/engcalcs/js/vendor/README.md`): names "epanet-js
  0.9.0 (MIT)," states "© Luke Butler," points to the full licence text, and states "the licence
  file must ship with any redistribution."
- `js/vendor/epanet-js.LICENSE`: the complete MIT licence text, present and shipped as its own file
  alongside the vendored code — satisfies MIT's one substantive condition (the copyright/permission
  notice travels with the software).
- `lib/lang.ec.en.php:2100` (`lpn_notes_engine_def`, shown to every visitor via Help > Notes on the
  `lpn_` page): names the dependency in full — "It reaches this page through epanet-js 0.9.0 by
  Luke Butler, under the MIT licence" — publicly, in the product itself, not just in a source
  comment.
- `dev/vendor-manifest.json` and `vendor_integrity_check.php` (blocking, `check_all.sh`) verify the
  vendored file matches what is declared.

**One important distinction the README itself flags and that this question must not blur:** the
vendored **npm package** `epanet-js` (Luke Butler, MIT, a toolkit) and the **web application**
epanetjs.com (the FSL-1.1-MIT product with paid tiers, whose UI Tasks 283/384/409/498 studied) are
legally and factually two different things sharing one name — `js/vendor/README.md`'s own words:
*"We use the toolkit and have never read the app's source."* MIT attribution is owed, and fully
paid, for the TOOLKIT. Nothing is owed for the WEB APP's UI patterns, because UI/UX ideas are not
copyrightable subject matter and Task 384 already recorded the correct boundary for that case
(FSL-1.1-MIT means the idea only was taken, not code). **So there is no licence deficiency driving
this decision either way — it is entirely a question of what §1's "lead with the invitation, not the
comparison" and Task 591's own scoping ("scoped to EPANET... does not travel") should do here.**

### 5. Recommendation

**Do not add epanet-js.com to the Not EPANET gratitude section, or to any public page.** The
rejected alternative is a single factual, unadorned sentence of credit placed IN the gratitude
section beside EPA and Cynthia Brewer. It fails for three converging reasons, each backed above
rather than asserted: (a) Task 591/544 explicitly scoped the one competitor-naming exception to
EPANET and said in the same breath that the exception "does not travel" — extending it to epanet-js
the same month it was granted is the travel the ruling anticipated and declined; (b) the closest
real precedent found (LibreOffice's open letter to OpenOffice) shows that even sincere,
code-ancestry-backed gratitude toward a rival reads externally as comparison dressed as gratitude,
and this suite's claim on epanet-js is weaker (UI observation, not shared code) than LibreOffice's
was on OpenOffice; (c) the Slack precedent shows the asymmetry runs the wrong way for us
specifically — we are the smaller, unfunded party, and a compliment upward from that position reads
as anxious rather than generous, which is the opposite of what a "deep honesty and deep gratitude"
page is for. The internal credit already on file (`dev/positioning.md` §7/§8, ROADMAP Tasks
283/384/409/451/498, `js/looped-network.js:4069`) is the correct and sufficient place for this —
it is honest, dated, specific, and carries no audience to perform for.

**If Tom still wants something public**, the safer venue is not the gratitude section but a
neutral, separately labelled disclosure — arm's length, not warm — closer to a build note than a
thank-you. Three sentences, in the site's own factual register, for that alternative and that
alternative only (I do not recommend shipping this on the gratitude page itself):

> Several interface choices here were shaped by studying epanet-js.com, a separate commercial
> EPANET-compatible product, including how it presents a colour legend and runs a public roadmap
> board. Its licence permits learning from its behaviour without permitting us to copy its code, and
> we have not copied any. This is a factual note, not an endorsement, and epanet-js has not reviewed
> or sponsored this project.

## 2026-09-06 — Task 605's open question: precache the 664 KB EPANET engine, or leave it fetch-on-click?

Question as posed: the built-in solver is retired from view and EPANET is now the page default
(Task 605). `js/vendor/epanet-js.js` (~664 KB) is deliberately excluded from the service worker's
precache manifest (`lib/ServiceWorker.lib.php:110-114`), so it used to be fetched only by a visitor
who opted into EPANET; now every first-time solve on `lpn_` fetches it. The alternative — precaching
it — moves that cost to every visitor to any of the 16 calculators, at service-worker install time.

### 1. Who is actually on the other end of this fetch, on bandwidth terms

**OBSERVED first:** `dev/positioning.md` §6.1 already flagged this exact tradeoff on 2026-08-14, for
the LibreEPANET variant, before Task 605 made it the whole suite's problem: *"The 678 KB engine is
lazily imported BECAUSE it is off by default, so on-by-default makes every visit pay for it — which
cuts against the low-bandwidth case."* That sentence is now true of `Looped-Network.php` itself, not
just a hypothetical variant.

- **Fixed 664 KB is a genuinely different cost depending on the connection**, computed directly
  (8 bits/byte, no protocol overhead, so these are floors not ceilings): slow-2G (~50 kbps) ≈ 106 s;
  2G (~250 kbps) ≈ 21 s; 3G (~750 kbps) ≈ 7 s; weak 4G (~1.5 Mbps) ≈ 3.5 s; 4G (~10 Mbps) ≈ 0.5 s;
  fibre (~50 Mbps) ≈ 0.1 s. SPECULATION-labelled-as-arithmetic: real mobile TCP/TLS handshake and
  server latency add to every one of these, so treat them as best-case floors.
- **A material share of this suite's most-cited population (journal 2026-09-04, rows 3–5: RWSN's
  150+-country LMIC membership, EWB chapters, Peace Corps volunteers) work in places where 2G/3G,
  not 4G, is the effective connection, and where data is priced per megabyte rather than flat-rate.**
  CITED: mobile download speeds vary enormously by country and network generation — Speedtest
  Global Index-derived reporting puts Morocco (Africa's fastest) at 123.87 Mbps mobile median but
  most of sub-Saharan Africa well below the ~105.7 Mbps global average, with Nigeria and Kenya
  ranked "mid-tier" (axis-intelligence.com/internet-speed-by-country-statistics,
  speedtesthq.com/reports/average-internet-speeds-by-country, both accessed 2026-09-06 via search
  synopsis — I could not open the Ookla Speedtest Global Index itself this session, so treat the
  specific Mbps figures as secondary-source and re-verify before quoting a number in public copy).
- **The COST side, not just the speed side, is separately documented and arguably the sharper fact
  for this suite's audience:** the Alliance for Affordable Internet's affordability standard is
  1 GB ≤ 2% of average monthly income; by ITU 2023 data cited in current reporting, sub-Saharan
  Africa averages ~5.8% of monthly income for 1 GB, and the worst-priced markets (Central African
  Republic, DRC, Chad) run 15–24% of monthly income for 1 GB. CITED: statranker.org/digital-
  innovation/countries-by-mobile-data-price-2026 and cellesim.com/en/mobile-data-affordability-by-
  country-2026 (both accessed 2026-09-06 via search synopsis; original A4AI/ITU reports not opened
  directly this session — re-verify before public citation). **At the worst end of that range, 664 KB
  is a small but non-zero fraction of a visitor's money, not merely their time** — a fact the
  time-to-load literature below does not capture at all, and the sharper reason "lazy vs. precache"
  is not a pure UX question for this suite's stated audience.
- I could not find a source measuring bandwidth specifically for NRWA's US rural-utility membership
  (journal row 2) — US rural/small systems are a genuinely different case from the LMIC populations
  above (FCC data generally shows US rural fixed broadband gaps, not mobile 2G/3G gaps), and I did
  not find a citation strong enough to put a number on it this session. Flagging the gap rather than
  guessing.

### 2. Is a click-triggered wait judged differently from a page-load wait? Yes, and it matters here.

**These are genuinely two different bodies of evidence, and the framing in the brief is right to
separate them.**

- **Page-load abandonment (the wrong analogy for this decision):** Google's aggregated 2015–2016
  analysis of 4,500+ mobile sites found 53% of visits abandoned when a page took over 3 seconds to
  load. CITED: widely reported, e.g. marketingdive.com/news/google-53-of-mobile-users-abandon-sites-
  that-take-over-3-seconds-to-load/426070 (original Google/DoubleClick report; I did not locate the
  primary Google document itself this session, so this is corroborated-by-multiple-secondary-sources
  rather than primary-source-verified — flagged accordingly). **This measures patience BEFORE any
  relationship with the page exists** — a stranger deciding whether to stay at all. It is the wrong
  number for "does an EPANET solve after Calculate feel too slow", because by that moment the visitor
  has already loaded the page, drawn a network and pressed a button they chose to press.
- **Click-triggered / "system busy" waits are governed by a different, older and more directly
  relevant body of work: Nielsen's three response-time thresholds (from *Usability Engineering*,
  1993, restated by NN/g).** CITED: nngroup.com/articles/response-times-3-important-limits. 0.1 s
  reads as instantaneous; up to 1.0 s keeps the user's flow of thought unbroken with no special
  feedback needed; up to 10 s is tolerated ONLY with a percent-done indicator and a way to cancel;
  past 10 s, satisfaction drops sharply and abandonment follows. A 7-second engine fetch on 3G, or a
  21-second one on 2G, sits squarely in "needs a percent-done indicator," not in "acceptable
  silence" — which is a testable, fixable UX gap regardless of which precache strategy is chosen.
- **Perceived wait is not the same as measured wait, and the gap is a lever, not a footnote.**
  CITED: NN/G "Progress Indicators Make a Slow System Less Insufferable"
  (nngroup.com/articles/progress-indicators) and the CHI/ACM literature it cites — an animated,
  percent-done indicator measurably reduces perceived wait and abandonment relative to a spinner or
  silence, and *active* waiting (the user believes something concrete is happening) is tolerated far
  better than *passive* waiting (research cited there finds passive wait overestimated by ~36%).
  **Concretely for this suite: "Fetching the EPANET engine (664 KB, first use only)…" with a percent
  bar is a small, well-evidenced fix that helps regardless of which precache decision is made**, and
  today's fallback strings (`lpn_engine_unavailable` etc., per Task 605's own closing note) were not
  examined for whether they carry this — worth a look, but sizing that is not this seat's job.

### 3. What comparable tools do about a large engine payload

- **epanet-js (the vendored TOOLKIT, `epanet-js`/`epanet-engine`, not the web app) is architected
  for exactly this choice, and its docs name the tradeoff explicitly:** "By default epanet-js bundles
  the latest LTS engine, but to pick a specific version, you can use the slim Workspace, which ships
  without an engine, and load one with `loadModuleVersion`." CITED (source/docs, not a blog post):
  github.com/epanet-js/epanet-js-toolkit (README, accessed 2026-09-06 via search synopsis; I did not
  clone and diff this repo this session the way the 2026-09-05 entry above did for the app repo — a
  future invocation should verify by reading the actual `loadModuleVersion` call site before citing
  this as confirmed-by-source). This is independent published confirmation that engine-loading
  strategy (bundle vs. lazy-load-by-version) is a first-class, documented design axis for the exact
  library both projects vendor — not a problem unique to this suite.
  - **OBSERVED, in this repo:** `js/vendor/README.md` (per the 2026-09-06 entry above) already
    records that this suite uses "the toolkit," so the toolkit's own slim/lazy pattern is a direct,
    load-bearing precedent for what this suite already does (dynamic `import()`, no precache) —
    this is not a hypothetical alternative design, it is the upstream library's own documented
    intended use.
- I could not determine what the epanet-js.com WEB APPLICATION itself does about its engine's
  loading strategy (precache vs. on-demand) — its bundling is not open source (FSL-1.1-MIT per
  `dev/positioning.md` §2) and I did not find a public engineering write-up of its loading approach.
  **A real result: I looked and could not verify this**, not an oversight.
- **The general web-performance literature (not this domain specifically) treats "ship WASM/large
  JS lazily, gated on the feature that needs it" as the standard pattern**, e.g. Webpack's own
  "Lazy Loading" guide and multiple engineering write-ups on WASM module splitting (rustwasm/team
  issue #52, webpack.js.org/guides/lazy-loading) — this is closer to prevailing practice than
  precaching a large optional module unconditionally. CITED as general practice, not as a
  domain-specific ruling.

### 4. A third option the framing misses: condition the choice on the CONNECTION, not on the page

**The brief's two options are both "one policy, applied to everyone." Neither is necessary — the
Network Information API lets the page ask the visitor's own browser, in real time, which of the two
costs is smaller for THIS visitor, without a server round trip or an account.**

- **The API:** `navigator.connection.effectiveType` (`'slow-2g'|'2g'|'3g'|'4g'`) and
  `navigator.connection.saveData` (true when the visitor has turned on their OS/browser's
  data-saver mode) are read synchronously, no permission prompt. CITED: web.dev/articles/adaptive-
  loading-cds-2019 and MDN's Network Information API documentation (addyosmani.com/blog/adaptive-
  serving and the same web.dev article restate the same API surface; MDN itself was not fetched
  directly this session).
- **The design this suggests, stated as a design not a decision (that is the planning/field seats'
  and Tom's call, not mine):** after the `lpn_` page itself has rendered and gone idle (i.e. NOT at
  service-worker install, so the other 15 calculators never pay for it), prefetch
  `js/vendor/epanet-js.js` in the background UNLESS `saveData` is true or `effectiveType` is
  `'2g'`/`'slow-2g'` — in which case leave it exactly as it is today, fetch-on-click, with the
  percent-done indicator from §2 covering the wait that results. This reconciles the two costs
  along the axis that actually varies: a visitor on fibre or a decent 4G connection never notices
  either the prefetch or the click-fetch; a visitor on 2G with data-saver on is exactly the visitor
  this suite's stated mission (300 km rural scope, 27 languages toward LMIC audiences) most wants to
  protect from an unwanted background fetch, and is the one population still routed to the honest,
  visible, cancellable fetch-on-click path.
- **Caveat, found and worth stating plainly rather than glossing over:** the Network Information API
  is a Chromium-only feature — not implemented in Safari/WebKit or Firefox as of the sources found
  this session (web.dev's own article notes it is "currently only supported in Chromium browsers").
  CITED: web.dev/articles/adaptive-loading-cds-2019. **So this is a progressive enhancement, not a
  complete answer**: browsers without the API would need to fall back to one of the two policies in
  the original framing (I'd suggest the safer one — leave as fetch-on-click — as the fallback,
  since an unconditional precache on an unknown connection reintroduces exactly the cost this idea
  exists to avoid). I did not find current Safari/Firefox market share data for this suite's
  specific mobile audience this session; that would matter for how much this caveat weakens the
  recommendation, and I flag it as unresolved rather than guessing a number.

### 5. Recommendation, ranked, sizes are honest estimates from this seat, not an engineering estimate

1. **Do not add `epanet-js.js` to the precache manifest as a blanket change.** Every calculator
   visitor paying 664 KB at install time for a feature 15 of 16 pages never touch is the wrong
   default for a suite whose own positioning file already flags low bandwidth as a differentiator
   (`dev/positioning.md` §3.4, §8 horn 3). This is a "do not" — zero cost to leave alone, and it is
   the one part of this recommendation I am confident does not need further research.
2. **Add a percent-done progress indicator to the first-fetch wait, regardless of any other change.**
   Smallest possible size (a fetch-progress readout on an already-computed byte count), directly
   backed by NN/g's response-time thresholds and progress-indicator literature in §2, and it helps
   every visitor on every connection whether or not idea 3 below is ever built. This is the one
   finding here I would put in front of Tom first, because it is cheap, evidenced, and orthogonal to
   the harder precache-or-not question.
3. **Consider the connection-aware idle-prefetch in §4, scoped to the `lpn_` page only, as a
   medium-sized enhancement** — bigger than #2, smaller than a general precache, and it is the one
   idea in this entry that answers "what is the third option" rather than re-arguing the two given.
   I have not sized the engineering effort (that is not this seat's job) and flag the Chromium-only
   caveat honestly above; it degrades safely to today's status quo everywhere it is unsupported.
4. **Leave the manifest exactly as it is today (status quo) if neither 2 nor 3 is prioritised.** The
   honest sentence for a visitor on 2G today is that their first EPANET solve after Task 605 costs
   them several to tens of seconds and, in the worst-priced LMIC data markets, a measurable fraction
   of a cent-to-several-cents of real money — not catastrophic, but no longer opt-in, which is the
   fact Task 605's own closing note already surfaced and left open for this seat.

**What I could NOT find, stated plainly:** a citation measuring abandonment specifically for a
*click-triggered feature fetch* of this size and shape (as against page-load abandonment or generic
UI response-time doctrine) — the literature in §2 is the closest available evidence, assembled from
two adjacent bodies of work, not a single study of exactly this scenario. Also could not verify the
epanetjs.com web app's own loading strategy (§3), Ookla's primary Speedtest Global Index data (§1),
or the primary A4AI/ITU affordability report (§1) — all noted above as secondary-source and flagged
for re-verification before any public claim leans on the specific numbers.

## 2026-09-08 — Tom's questions after the contour finding: who is who in EPANET licensing, who is Luke Butler, and is the barrier/breakline contour idea innovative

Tom's questions verbatim, condensed: (1a) who provides the EPANET solver, who started it, who runs it,
licence, can we join; (1b) who is Luke Butler/Iterating, his disposition, can we ally with him; (2) is
the barrier/breakline contour idea innovative, and what can he safely say to EWB in 10 days.

### 1a. The EPA → OWA-EPANET chain, primary sources

- **EPANET's author is a named person, not an agency abstraction.** Dr. Lewis Rossman, a US EPA
  environmental engineer, wrote EPANET; it first appeared in 1993. CITED:
  en.wikipedia.org/wiki/EPANET (via search synopsis; not fetched directly this session — the OWA
  repo's own README corroborates "originally developed by the U.S. Environmental Protection Agency").
- **EPA's own current statement, fetched directly:** *"EPANET is public domain software that can be
  freely copied and distributed."* EPA directs ongoing development to GitHub: *"Continued development
  and bug fixes for EPANET are occurring under an open source project site in GitHub."* CITED:
  epa.gov/water-research/epanet (fetched 2026-09-08). EPA's own page does not name Open Water
  Analytics — it just points at "an open source project site in GitHub," which is OWA's repo.
- **Open Water Analytics (OWA) formed in 2015, from an institutional body, not a lone hobbyist.** *"In
  2015, the Water Distribution System Analysis (WDSA) Standing Committee voted to initiate an open
  source software project for the continued development of EPANET. Software developers from EPA and
  the water community came together via the community organization and forum, Open Water Analytics
  (OWA)."* CITED: search synopsis drawing on epa.gov/sciencematters/epanet-220-epa-and-water-
  community-collaboration and wateranalytics.org (not fetched directly; re-verify before quoting the
  2015/WDSA detail in public copy). **OWA has been maintaining a community branch since May 2014**,
  per the repo's own README (below) — i.e. informal collaboration predates the 2015 vote by about a
  year.
- **The repository, read directly, 2026-09-08:** `https://github.com/OpenWaterAnalytics/EPANET`
  (branch `dev`). Verbatim from `README.md`:
  > "Both EPANET and its toolkit were originally developed by the U.S. Environmental Protection
  > Agency (USEPA)... this project covers only the EPANET hydraulic and water quality solver engine,
  > not the graphical user interface."
  > "Everyone is welcome to participate in this project... The path for contribution starts with the
  > Issues... Once you get a clear path forward, Fork this repo to your own account... open a Pull
  > Request."
  > "Although OWA is not formally affiliated with nor endorsed by USEPA, this project has been a
  > collaborative effort between the two that builds upon and extends the USEPA's legacy EPANET 2.0
  > code base."
  **Licence: MIT**, per the repo's own declared licence field and `js/vendor/README.md`'s existing
  record here.
- **How to join, concretely, read off the repo itself — no mailing list, no Slack, no scheduled
  community call found anywhere.** The channels that exist: GitHub Issues (where contribution starts,
  by the README's own instruction), GitHub Discussions at
  `https://github.com/orgs/OpenWaterAnalytics/discussions` ("For more general community discussion of
  the project, please go to OWA Discussions"), the OWA Community forum at `wateranalytics.org`, and
  a step-by-step external contributing tutorial (a 2016-era SlideShare deck by Demetrios Eliades,
  linked from the README — old but still linked live). **I searched specifically for a mailing list or
  a recurring community call and found neither** — a real result, not an oversight; whatever
  "community" means for OWA today is asynchronous, GitHub- and forum-based, not synchronous.
- **Named contributors, read directly from `AUTHORS` on the `dev` branch (2026-09-08).** Two are
  marked "Contributions in the Public Domain": Lewis Rossman and Michael Tryby (both EPA). Contributors
  "Subject to Copyright" across versions 2.1–2.2 include Demetrios Eliades, Sam Hatchett, Bryant
  McDonnell, Elad Salomons, James Uber and others — a genuine multi-person, multi-institution roster
  (academic emails, a `.gov` address, personal Gmail addresses), not a single maintainer's personal
  project. **This repo's own `js/vendor/README.md` already correctly names the engine as "OWA-EPANET
  2.3.5, released 2025-02-20"** and distinguishes it from EPA's still-current 2.2.0 download — that
  record needed no correction.
- **Answering "can we join": yes, mechanically, the same way anyone can** — open an issue, discuss,
  fork, PR, per the README's own instructions, MIT licence, no CLA barrier recorded anywhere for this
  repository (unlike epanet-js's FSL repo, see 1b). This is a materially easier door than epanet-js's.
  There is no evidence of a formal advisory-board or "member" status to apply for; "the community" here
  means showing up in Issues/Discussions and doing the work.

### 1b. Luke Butler and Iterating Inc — who he is, and his disposition

- **Iterating Inc., founded 2025 by Luke Butler and Sam Payá, Toronto.** CITED: iterating.ca (fetched
  2026-09-08) — verbatim: *"The company that makes Mastering Water Models and epanet-js... Established
  2025 by Luke and Sam."* Contact: `founders@iterating.ca`. The site is deliberately minimal; no
  mission statement, no open-source policy statement on it.
- **Luke Butler's professional background:** a graduate at a water utility in Australia, later an
  independent consultant automating water-modelling workflows with code. CITED: search synopsis of
  LinkedIn (`linkedin.com/in/lukepbutler`) and his LinkedIn article "Seven water modelling apps in one
  year" — not fetched as raw HTML this session (LinkedIn blocks direct fetch in this environment); the
  synopsis is a secondary reading, re-verify direct quotes before using them in a first-contact
  message.
- **The strongest, most concrete evidence of his disposition is a THIRD PARTY's account, not his own
  marketing.** Tom MacWright — the original author of Placemark, the MIT-licensed map editor epanet-js
  is built on top of — wrote about this directly. CITED: macwright.com/2025/07/03/epanet-placemark
  (fetched 2026-09-08). Key facts from that post: **Butler and Payá "contributed improvements back to
  Placemark's codebase voluntarily"** — i.e. before or alongside building their own commercial product
  on it, they sent fixes upstream to the free codebase they were building on, which they had no
  obligation to do under Placemark's MIT licence. MacWright's own framing: he "celebrates seeing his
  permissive-licensed code fuel commercial ventures... fulfilling his goal of being helpful," and
  praises "the team's collaborative approach to upstream contributions." **This is a favourable,
  independently-sourced account from the person whose code was built upon** — not Iterating's own
  copy, which makes it more useful evidence for Tom's "can I trust this person" question than
  anything on epanetjs.com itself.
- **His stated view of his own licensing choice** (secondary-sourced, LinkedIn synopsis, flag for
  re-verification): on the epanet-js MIT **toolkit** specifically, he is quoted/paraphrased as saying
  it "provides users almost no restriction in the reuse of my library, including commercially." He
  publishes example scripts and tools openly on LinkedIn and GitHub (`github.com/lbutler`), which the
  synopsis characterises as treating "other developers and modelers as collaborators rather than
  competitors."
- **The asymmetry to hold onto: the TOOLKIT (his MIT choice) and the WEB APP (Iterating's FSL-1.1-MIT
  choice) are different decisions by the same person**, and both are documented and consistent —
  give away the library, monetise the finished product. That is not evidence of bad faith; it is the
  same shape as plenty of open-core businesses, and `dev/positioning.md` §2 already treats the
  distinction correctly. Nothing found this session suggests dishonesty, only a commercial choice about
  where the licence line sits.
- **What "allying" could concretely mean, ranked by cost, per the existing contour research
  (`dev/epanet-js-contour-contribution.md`, already thorough and not re-derived here):**
  1. **Contributing to OWA-EPANET itself** (the engine, MIT, EPA's own project) — cheapest, cleanest,
     and arguably the more natural "join the community" move given Tom's question is really about
     EPANET's own community, which is OWA's, not Iterating's. No CLA barrier found. This is a
     different target than "allying with Luke Butler" and should not be conflated with it.
  2. **Contributing to `epanet-js-toolkit` (MIT, the library we vendor)** — same licence family as
     ours, a genuine peer relationship (we already depend on his MIT code), and the natural venue for
     a code-level ally relationship if one is wanted.
  3. **Contributing DESIGN/FINDINGS (not code) to the epanetjs.com web app's public roadmap** — what
     the contour document already recommends as Step 0: a GitHub issue and a Canny comment, no CLA,
     no rights assignment, pure goodwill. This is the cheapest way to "ally" with the app side.
  4. **Contributing CODE to the epanetjs.com web app** — the FSL app repo's `CONTRIBUTING.md` (created
     2026-09-04, three days before Tom's original ask) requires an as-yet-unwritten CLA that
     "assign[s] the relevant rights to Iterating." Real cost, and `dev/epanet-js-contour-contribution.md`
     §4 already recommends against this until the CLA text exists and Tom has read it.
  5. **Cross-linking / co-authoring / a personal note to Luke Butler** — cheapest of all, costs nothing
     but the message itself, and is independent of any code question. Given the MacWright evidence
     above, a direct, honest note (not through epanetjs.com, per Tom's own instruction) is
     well-supported: he has a track record of receiving this kind of gesture well, from the one
     documented case available.
- **"Unless 'diversity' is the answer" — reading Tom's own phrase honestly:** if he means "maybe the
  right posture is simply that two independent projects exist and that is fine, not an alliance," that
  reading is consistent with `dev/positioning.md` §1's whole stance (we do not answer their framing,
  we do not run a comparison, we are not the aggrieved party) and with §5 (we do not track their
  bugs). Nothing found this session argues against that being a perfectly sufficient answer on its
  own — an ally relationship is not necessary for either project's health, and `dev/positioning.md`
  already treats non-alliance as the default, correct posture.

### Draft first-contact message, in Tom's voice, for him to edit

Addressed to Luke Butler directly (not through epanetjs.com, per his own stated constraint), by
whichever channel he prefers (LinkedIn, GitHub, or `founders@iterating.ca`):

> Hi Luke — I build LibreWaterNet / EngCalcs, a free GPL browser suite of hydraulic calculators
> including a looped-network editor that also runs through your epanet-js toolkit (MIT), which we
> vendor and credit by name in our Notes and gratitude pages. I've read about how you and Sam built
> on Tom MacWright's Placemark and sent improvements back upstream before building epanet-js on
> top of it — that's the kind of thing I hope our own project can be part of too. I'm not writing
> to pitch anything or ask for a partnership; I just wanted to say thank you directly, tell you we
> exist, and ask whether there's a way our two projects could occasionally point at each other or
> compare notes as two people trying to get good hydraulic modelling into more hands. No pressure
> either way — genuinely just glad you're out there doing this.

> If it's useful: we found a small thing while reading EPANET's own contouring source
> (`Fcontour.pas`) that your team's roadmap doesn't currently document an answer to — how to
> interpolate pressure contours honestly on a sparse, irregular network, including across closed
> valves and pressure-zone boundaries, which no tool we could find (EPANET, Bentley, or your own
> roadmap item) currently handles. Happy to share the write-up if it's useful to you, no strings
> attached.

### 2. The contour barrier/breakline idea — is it innovative, and what can Tom say to EWB

Full technical grounding is already in `dev/epanet-js-contour-contribution.md`, written 2026-09-07 —
not re-derived here. This session added one confirming search.

- **In GIS generally: NO, breaklines are standard and long-established, and Tom should not claim
  otherwise.** A breakline in a terrain TIN (a ridge, a stream, a road edge) that interpolation must
  not cross is decades-old, textbook GIS/surveying practice — hydrographic breaklines in USGS/Esri TIN
  workflows are the standard example. `dev/epanet-js-contour-contribution.md` already cites the
  parallel case directly from ITRC (groundwater "faults"/breaklines in potentiometric surfaces,
  including a worked USGS example where a river breakline changed a modelled plume's fate). **The
  general concept — some interpolators need a discontinuity feature — is not new anywhere.**
- **In water-NETWORK software specifically, applying that same well-known GIS concept to the network's
  own pipes/valves as barriers: I found no prior art, and neither did the 2026-09-07 research**, which
  read EPANET's own Delphi contour source directly (fills the whole rectangle, no barrier, no hull),
  found no interpolation-method disclosure at all in Bentley's WaterGEMS/WaterCAD docs, and found
  epanet-js's own public roadmap item (`roadmap.epanetjs.com/.../contour-map-generation`, posted by
  their own team 2025-09-29, 3 votes) says nothing about method or barriers at all. **My own
  2026-09-08 search for "breakline" or "barrier" interpolation specifically in water distribution
  network / pressure-zone contexts turned up nothing on point** — patent and paper results about valve
  isolation and pressure-zone GIS delineation, but nothing about USING that network topology as an
  interpolation barrier for a contour plot. CITED (search, confirming absence, not presence):
  uspto.gov patent PDFs on network isolation, iwaponline.com "Isolated pressure zones based on GIS,"
  none of which propose contour-barrier interpolation.
- **The honest, careful sentence, and the one Tom can safely say:** *"The general idea that some
  boundary should stop an interpolation from crossing it — a breakline — is a standard, decades-old
  GIS technique, most familiar from terrain modelling. What appears not to exist yet, in EPANET, in
  Bentley's WaterGEMS/WaterCAD, or in the newer browser tool epanet-js, is applying that same idea to
  a water network's OWN topology — treating a closed valve or a pressure-zone boundary as a barrier a
  pressure contour should not cross. We read EPANET's own contouring source code directly and
  confirmed it does not do this; we could not find any published water-modelling tool or paper that
  does either."* **This is a claim of absence ("we could not find it"), not a claim of primacy ("we
  invented it")** — the correct register for an unpublished, unpatented idea nobody has built yet, and
  it matches `dev/positioning.md` §2's own discipline about never claiming completeness against a
  field of "infinite depth." **Do not say "nobody has ever thought of this"** — only that a real,
  documented search across the tools whose internals or docs could be read did not find it.
- **What NOT to say, and why:** do not call breaklines themselves the innovation (§2's TIN table in
  the contour doc already establishes this is decades old in GIS); do not claim the feature is BUILT
  (`lpn_` has no hull, triangulation or contour code today, per the 2026-09-07 doc's own grep); and do
  not claim it has been checked against every commercial water-modelling product — WaterGEMS's actual
  algorithm remains unconfirmed (their docs name no method), and Ohmer et al. 2017 and Walski et al.'s
  textbook, the two sources most likely to settle this in the academic literature, were both
  unreachable this session and last. The honest boundary of the claim is: EPANET (source read
  directly), Bentley's public docs (silent on method), epanet-js's public roadmap (silent on method),
  and a direct search for prior art (none found) — not "the whole field."

## 2026-09-08 (second entry) — Tom's ruling on the EPANET name, and what I verified against it

### 1. Tom's position, verbatim, as a dated ruling (2026-09-08). These are HIS words, not mine.

> "While there is nothing magic or sacred about the name epanetjs, there is something magic and
> sacred about the name EPANET. WaterCAD didn't call itself EPANET++, WaterGEMS didn't call itself
> EPANET-GEMS, etc. And for epanetjs to call itself so is, let's just say, impolitely audacious.
> Beyond that, posting epanetjs.com Youtube tutorial videos with titles like 'How to model Fire Flow
> in EPANET' is simply dishonest. And dishonesty aside, if I approach Luke, I can't in good faith
> offer to contribute to epanetjs.com with no strings attached because as heroic as Luke is, I think
> he is making a mistake with epanetjs, or at least I would be making a mistake going in that
> direction. I would need to address that first with him, and I am happy to do so in an appropriate
> way. I appreciate and need [your] advice about reaching out to Luke Butler or anybody else. But
> [you] should be fully aware of my reasoning before proceeding. This isn't something we should
> ignore. But we need to have full understanding before proceeding."

**Operative consequences for this seat, read straight off that paragraph and not extended:**
(a) any outreach to Luke Butler must raise the naming concern BEFORE or WITH any offer to
contribute, not after; (b) "no strings attached" is off the table as a framing for the epanetjs.com
app specifically; (c) his objection is to the NAME and to the video TITLES, and he is explicit that
Luke himself is "heroic" — this is not an objection to the person; (d) my earlier 2026-09-08 draft
note (above in this journal, and wish-list row 8) is SUPERSEDED, because it offered exactly the
no-strings contribution he says he cannot in good faith offer. The superseding draft is in section 5
below.

**A TENSION HE SHOULD SEE, and I am flagging it rather than resolving it, because it is his call
and `dev/positioning.md` is the authority I am not permitted to contradict.** That file, section 6
("Our standing on the name — settled, do not re-argue"), currently rests our own claim on
LibreEPANET.org partly on this sentence: *"EPANET is US EPA public-domain software. It has no owner
to license from, and epanet-js is the standing proof that the name can be used this way."* If
epanet-js's use of the name is impolitely audacious, then it is no longer available to us as the
proof that the use is proper — the legal leg (public domain, no owner) survives untouched, but the
NORMS leg loses its only cited precedent. His own 2026-08-24 ruling *"Keep both, but EPANET is
silent"* already points the same way and largely absorbs this, so nothing public is at risk today.
But section 6 says in terms "settled, do not re-argue", and this is the one input that would reopen
it. **I have not edited `dev/positioning.md`; it is not mine to write.** SPECULATION as to the
consequence; the quoted sentences are OBSERVED (`dev/positioning.md`, section 6).

### 2. VERIFIED: the YouTube channel and every title on it

**The channel is `Iterating` — `https://www.youtube.com/@iteratinginc`, channel id
`UC-dNJi0VNlYdEhhrShP1TGA`** (found linked from `https://epanetjs.com/blog/`, fetched 2026-09-08).
The YouTube web UI is behind a bot wall in this environment; I read the channel's own Atom feed
instead, which is primary and machine-readable:
`https://www.youtube.com/feeds/videos.xml?channel_id=UC-dNJi0VNlYdEhhrShP1TGA` (fetched
2026-09-08). **CAVEAT: that feed carries only the most recent 15 uploads. Ten came back, so if the
channel has ever posted more than 15, older titles are invisible to me. I did not verify the total.**

**All ten titles, verbatim, newest first, with dates and URLs — CITED:**

| # | Title (verbatim) | Published | URL |
|---|---|---|---|
| 1 | GIS to EPANET tutorial: Building the Rosebery water model with epanet-js | 2026-08-12 | youtube.com/watch?v=p2TJjAWM8ck |
| 2 | **Georeference an EPANET model** | 2026-06-29 | youtube.com/watch?v=vqSDORj6Ku8 |
| 3 | Getting started with epanet-js | 2026-02-26 | youtube.com/watch?v=iZiin9UQsUI |
| 4 | **From GIS to running model - EPANET modeling workshop** | 2026-01-29 | youtube.com/watch?v=QXv6oeFmDoQ |
| 5 | **Fire flow analysis with EPANET** | 2025-12-07 | youtube.com/watch?v=Rx9JsUwjS3Y |
| 6 | Visualizing EPANET hydraulic results in epanet-js – Map styling, legends & color ramps | 2025-10-29 | youtube.com/watch?v=IgQHWNpcDVY |
| 7 | Introducing epanet-js | 2025-10-03 | youtube.com/watch?v=tbbYdd4kWYE |
| 8 | epanet-js feature update - Split pipes while drawing | 2025-09-22 | youtube.com/watch?v=RqwC1yuqVf4 |
| 9 | Build an EPANET model with GIS data using epanet-js | 2025-08-11 | youtube.com/watch?v=3B9UWHMb3W4 |
| 10 | Get started drawing an EPANET model with epanet-js | 2025-07-22 | youtube.com/watch?v=jw7xXLr3wLo |

**The exact title Tom quoted, "How to model Fire Flow in EPANET", does not exist on this channel.**
The nearest is #5, **"Fire flow analysis with EPANET"**. He was recalling, not quoting; the
substance of what he saw is real and is #5.

**Are the videos about epanet-js the app, or about EPANET the EPA program? About their own products,
in all ten cases.** I read every `media:description` out of the same feed. Verbatim openings for the
three whose TITLE does not contain "epanet-js":

- #5 *Fire flow analysis with EPANET*: "Calculate fire flows in your EPANET hydraulic model.
  `https://utils.epanetjs.com/fire-flow` - you can do it yourself here!"
- #2 *Georeference an EPANET model*: "Georeference your EPANET hydraulic models on a real-world
  basemap. `https://utils.epanetjs.com/georeference` - you can do it yourself here!"
- #4 *From GIS to running model - EPANET modeling workshop*: "Join Luke Butler, one of the creators
  of epanet-js, for a deep-dive technical workshop..."

The other seven name epanet-js in the title itself and link `https://epanetjs.com`.

**So the honest scoreboard is 3 of 10, not 10 of 10, and I have to say plainly that "simply
dishonest" is stronger than what I can support.** Seven titles name their own product. The three
that do not are ambiguous rather than false, and there is a real defence available for each: an
`.inp` file genuinely IS "an EPANET model" the way a `.docx` is a Word document, the utilities at
`utils.epanetjs.com` genuinely do operate on EPANET models, and their engine genuinely is
OWA-EPANET. **What survives of Tom's point after that deflation, and it does survive, is the
SEARCH-INTENT argument:** somebody typing "fire flow EPANET" into YouTube is looking for the EPA
program, and titles 2, 4 and 5 are the ones that meet that search without saying whose product the
answer is. That is a claim about ambiguity capturing search traffic, which is checkable and fair;
"dishonest" is a claim about intent, which I cannot check and would not put in a first message.
**Recommendation: he should not use the word "dishonest" to Luke Butler.** It converts a
conversation into an accusation on a point where the other side has a plausible answer, and it is
not needed — the naming argument stands on its own without it.

### 3. VERIFIED, and one thing I could NOT verify: trademarks

- **EPA asserts no trademark in EPANET and states the opposite kind of thing.** From EPA's own page,
  fetched directly 2026-09-08 (`https://www.epa.gov/water-research/epanet`): *"EPANET is public
  domain software that can be freely copied and distributed."* The same page carries EPA's standard
  non-endorsement language: *"EPA and its employees do not endorse commercial products, services, or
  enterprises"* and *"Any mention of trade names, manufacturers, or products does not imply an
  endorsement by EPA."* **That second sentence is the sharpest thing I found for Tom's case, and it
  is not a trademark argument at all** — EPA does not need a mark to have a policy of not endorsing
  anybody. I am NOT asserting that epanet-js implies EPA endorsement; I am recording that EPA
  disclaims it in advance, for everyone.
- **Iterating Inc. asserts no registered mark that I could find, and asserts ordinary ownership of
  its own site content.** From `https://epanetjs.com/terms-conditions/` (last updated 05 Oct 2025,
  fetched 2026-09-08), verbatim: *"epanet-js and all associated content, including but not limited
  to the user interface, graphic design, and text, are the property of Iterating Inc., unless
  expressly stated otherwise"*, and a use restriction: *"Do not use trademarks, logos, text, or
  graphic elements from the Web Site for commercial purposes without the express authorization of
  Iterating Inc."* That is boilerplate and names no registration number, no (R) and no (TM).
- **NO disclaimer of EPA affiliation exists anywhere I looked on epanetjs.com** — not on the home
  page, not in the Terms and Conditions. I grepped both full rendered pages for "affiliat",
  "endorse", "trademark" and "EPA". The Terms hit only the boilerplate above. **This is a real
  finding of ABSENCE and it is checkable.** Meanwhile the home page's own headline copy, verbatim
  from the same fetch, is *"The EPANET you know, enhanced"*, the Free tier's first listed feature is
  *"Web-based EPANET model"*, and their About text opens *"You may not know this, but for decades,
  the U.S. EPA has given the water industry an extraordinary gift..."*.
- **WHAT I COULD NOT DO, stated plainly rather than papered over: I could not query any primary
  trademark register from this environment.** I tried, in this order, and each failed for a stated
  reason: USPTO's own search backend (`tmsearch.uspto.gov`, several endpoint shapes — the API fronts
  an S3 bucket that returns `MethodNotAllowed`, and the UI is an Angular app behind an AWS WAF
  challenge); USPTO's assignment API (`assignment-api.uspto.gov`, empty response);
  `developer.uspto.gov` (301); Justia Trademarks (Cloudflare "Just a moment" interstitial);
  Trademarkia (HTTP 403); WIPO Global Brand Database (SPA shell, no usable API without a session);
  TMview / `tmdn.org` (connection refused, curl code 000); CIPO's Canadian trademark search
  (redirects to a language-selection page, no reachable API). **So: no secondary source I searched
  surfaced any registration for EPANET, epanet-js or Iterating Inc., and I found no (R) anywhere on
  either party's site — but I have NOT read the US or Canadian register and a later invocation must
  not quote this as "there is no trademark".** The correct sentence is: *I looked in eight places and
  could not reach a primary register; nothing in any secondary source suggested a registration
  exists.* If this matters enough to settle, it needs a person with a browser and ten minutes on
  `tmsearch.uspto.gov` by hand.

### 4. Revised advice: what the honest approach looks like, and what happens after

**Tom's constraint changes the SHAPE of the message but not the case for sending one.** The
2026-09-08 MacWright evidence still stands unmodified (`macwright.com/2025/07/03/epanet-placemark`:
Butler and Payá sent fixes upstream to Placemark voluntarily) and it is exactly the evidence that
this is a person who can receive a hard sentence without treating it as an attack. Sending nothing
and privately holding the objection is the worst of the options: it costs the relationship anyway if
it ever surfaces, and it buys nothing.

**The three design rules the revised note follows, each earned from something above:**

1. **Raise the reservation, do not level the charge.** "I have a reservation about the name" is
   checkable and answerable; "your video titles are dishonest" is an intent claim I could not verify
   (section 2) and cannot be answered except defensively.
2. **Say what he WOULD do and what he would NOT.** His own constraint is that he cannot offer
   no-strings contribution to the app. The honest form of that is to name both halves in the same
   message rather than withhold the offer silently: he is glad to share findings, and he is not
   signing a CLA that assigns rights to Iterating (a real, separately-documented cost —
   `dev/epanet-js-contour-contribution.md` section 4).
3. **No comparison of the two products, and no pitch.** `dev/positioning.md` section 1 (lead with
   the invitation, not the comparison) applies to a private message as much as to a page, and a
   naming objection that arrives bundled with "and by the way here is my competing product" reads as
   competitive positioning wearing an ethics costume. The message may say what Tom builds — he has
   to, it is why he has standing to write at all — but it must not argue that it is better.

**Plausible outcomes, my honest read (SPECULATION, all four — nobody can source another person's
reaction):**

- **Most likely: a civil disagreement that costs nothing and buys a real relationship.** Butler has
  a public answer available (EPA's public domain, no owner, and every commercial vendor in this
  market has traded on the EPANET name for thirty years), he has already published his reasoning
  about licensing openly, and the MacWright account says he engages rather than bristles. Tom gets a
  straight answer and a named correspondent; the naming question stays unresolved and that is a
  perfectly good result.
- **Second: he takes the point partially** — e.g. future video titles carry "with epanet-js" the way
  seven of ten already do. Cheap for him, and the trend is arguably already that way (the two most
  recent uploads both name epanet-js in the title; #2 and #5 are the older shape). Tom should notice
  that trend before writing, because it makes the ask smaller and the message kinder.
- **Third, and the one to price: he reads it as a competitor lecturing him about ethics.** The guard
  against this is rules 1 and 3 above, plus the fact that Tom is genuinely a user of Butler's MIT
  toolkit and can say so truthfully in the first line. The risk is real but not large, and the
  downside is one unanswered email, not a dispute.
- **Fourth, near zero: any legal consequence.** Nothing in section 3 gives either party a mark to
  assert, and Tom is not proposing to use anybody's name for anything.

### 5. The revised note — 246 words, in his voice, his to edit or discard

> Hi Luke,
>
> I'm Tom Haws, a civil engineer in Arizona. I build LibreWaterNet, a free GPL browser suite of
> hydraulic calculators with a looped-network editor. It runs on your epanet-js toolkit under MIT,
> and we credit you by name inside the app.
>
> I read Tom MacWright's account of you and Sam sending fixes back upstream to Placemark before you
> built on it. That is the kind of thing I would like my own project to be part of, and it is why I
> am writing to a person rather than to a company.
>
> I want to put one reservation on the table first, because I would rather say it than sit on it.
> It is about the name. EPANET came from the EPA as a gift to the whole industry, and to me that
> name belongs to the community rather than to any one product. WaterCAD never called itself
> EPANET++. When I see a video titled "Fire flow analysis with EPANET" that is teaching your tool,
> I understand the reasoning, but I do not think a newcomer can tell which thing they are learning.
>
> I may be wrong about this, and I would genuinely like to hear how you see it.
>
> I am not asking you to change anything. I would gladly share findings and testing with you, and I
> should say honestly that I would not sign a contributor agreement assigning rights. I wanted you
> to know where I stand before offering, not after.
>
> Tom

**Two notes on the draft, for him.** The "I would not sign a contributor agreement" sentence is
there because his own constraint makes silence about it dishonest; if he would rather not raise the
CLA at all in a first message, delete that clause and the note still works at 231 words. And the
contour write-up is deliberately NOT offered here — offering it in the same breath as the objection
makes the objection look like a bargaining chip. It is a second message, after he has a reply.

### 6. Is OWA-EPANET the better first alliance regardless? YES, and Tom's ruling makes it more so.

I said this earlier on 2026-09-08 (wish-list row 8) before knowing his position, and it holds harder
now:

- **It is the community he is actually talking about.** His whole objection is that the EPANET name
  belongs to the community rather than to a product. OWA-EPANET IS that community: the WDSA Standing
  Committee's 2015 successor project, MIT, with EPA's own Rossman and Tryby in `AUTHORS` and EPA's
  own page pointing at it (all CITED in the earlier 2026-09-08 entry above). Joining it is the
  positive form of the same conviction, where the note to Luke Butler is the negative form.
- **It has no naming problem to raise, so there is no awkward first sentence.** Contribution starts
  at a GitHub issue per the repo's own README, MIT, no CLA found.
- **It is where our actual dependency lives.** We vendor OWA-EPANET 2.3.5 (`js/vendor/README.md`).
- **And it de-risks the Butler note.** If Tom is already a visible contributor to OWA-EPANET when he
  writes, the naming reservation arrives from somebody with standing in the community he is
  invoking, rather than from a stranger with a competing product. **That is a SEQUENCING
  recommendation and it is the one concrete thing I would change about the plan: OWA first, Butler
  second.** SPECULATION as to the effect on Butler's reception; the facts about OWA are CITED above.
- The one honest caution: OWA is asynchronous and GitHub-shaped. There is no mailing list and no
  community call (I searched, 2026-09-08, and found neither). "Joining" means opening an issue and
  doing work, over weeks. It is not a handshake, and it will not produce a relationship in ten days.

## 2026-09-08 — Tom's two statements: license-freedom hierarchy, and a standing donation offer

### The two statements, verbatim (CITED — Tom is the source, both sent 2026-09-08)

(1) *"Luke Butler: The other reservation, and I love my Luke Butler and want to know him better, is
that I can't contribute to epanetjs.com — less free than LibreWaterNet.org — when there is a
realistically sustainable way to realize LibreWaterNet.org — less free than EPANET, we all have our
rationalizations."*

(2) Sent minutes later: *"Luke Butler: I forgot to say that I would very happily donate this project
in its entirety to any foundation or person who would let me stay on in my current role while
keeping or improving on my mission and means (license terms). I can talk to anybody in that
context. I can talk to anybody in that context."*

### Part 1 — verifying the license-freedom hierarchy in (1)

The three-step hierarchy is: EPANET (freest) > LibreWaterNet (GPL) > epanet-js (least free).
Checked directly, 2026-09-08:

- **EPANET itself is US EPA public-domain software** — confirmed already in this journal's earlier
  2026-09-08 entry via `https://www.epa.gov/water-research/epanet`: *"EPANET is public domain
  software that can be freely copied and distributed."* Public domain has no licence at all, which
  is a stronger claim than any open-source licence, GPL included. CITED, unchanged from earlier
  today.
- **LibreWaterNet (this suite) is GPL v3 or later.** OBSERVED: `dev/positioning.md:107` ("We are GPL
  v3 or later, with no paid tier..."), matching the repository copyright header convention.
- **epanetjs.com, the web app, is FSL-1.1-MIT.** CITED, fetched directly today from
  `https://github.com/epanet-js/epanet-js/blob/main/LICENSE`: the file carries two licences layered
  by date — an MIT block for "Copyright (c) 2023 Placemark" covering the original fork, and an
  **FSL-1.1-MIT block, "Copyright 2025 ITERATING INC."**, for everything contributed after the first
  commit. FSL (Functional Source License) restricts "Competing Use" and converts to plain MIT two
  years after each release — i.e., not OSI-approved open source today, becomes so later, one release
  at a time. This matches `dev/positioning.md:102-104` exactly (*"the app at epanetjs.com is
  FSL-1.1-MIT — not FLOSS today; it converts to MIT after two years"*) — **positioning.md is current
  on this point, not stale.**
- **The TOOLKIT this repo vendors is a narrower thing and checks out as MIT.** OBSERVED:
  `js/vendor/epanet-js.LICENSE:1-3` is a plain MIT block, "Copyright (c) 2019 Luke Butler," with no
  FSL text at all — this is the npm-published `epanet-js@0.9.0` package specifically, not the
  GitHub source tree. `js/vendor/README.md` states this correctly.
- **One thing worth flagging as risk, not as a positioning error: the GitHub `epanet-js` toolkit
  repo's OWN `main`-branch `LICENSE` file, fetched today, already carries the FSL-1.1-MIT block for
  post-fork contributions dated 2025 and credited to Iterating Inc.** — the same company, the same
  licence, as the web app. That does not touch the vendored `0.9.0` (its licence file has none of
  that text), but it means a FUTURE `npm pack epanet-js` — the exact upgrade path
  `js/vendor/README.md`'s own "Upgrading" section names — could pull FSL-covered code without
  anyone noticing, because that section's instructions do not include a licence re-check step.
  **Recommendation, size zero: add "re-fetch and diff `LICENSE`" to the Upgrading steps.** Flagged
  in the wish list below rather than edited into `js/vendor/README.md` myself, since it is a shipped
  file.
- **Net verdict on (1): the hierarchy is factually correct as stated, and `dev/positioning.md` needs
  no correction.** EPANET (public domain) is freest; LibreWaterNet (GPL v3+, copyleft, cannot be
  taken private) is in the middle; the epanetjs.com *application* (FSL, temporarily non-free,
  converting to MIT on a two-year lag) is least free of the three. Tom's "we all have our
  rationalizations" is his own editorializing and is not a factual claim to check.

### Part 2 — candidate homes for a donated GPL project where the founder stays on as maintainer

Checked six candidates against three questions: does it accept GPL, does it require copyright
assignment (which would collide with statement (1)'s valuation of staying free), and would a
founder credibly keep maintaining post-donation. All CITED, fetched 2026-09-08 unless noted.

1. **Software Freedom Conservancy (SFC).** Best license-philosophy fit — it is the FSF's own
   fiscal-sponsorship spinoff and explicitly champions copyleft. Requires an OSI-approved AND
   DFSG-free licence (GPL v3 qualifies on both). **Copyright assignment is OPTIONAL, not
   mandatory** — CITED, `sfconservancy.org/projects/apply/`: *"Conservancy will accept partial
   copyright assignment"* and unified assignment is offered as a service, not demanded — so this is
   the one candidate that does NOT collide with (1)'s reservation about giving anything up.
   Member-project structure keeps the project's own leadership in place; SFC provides the legal/fiscal
   shell around existing maintainers, which fits "let me stay on" directly. **The real obstacle is
   maturity, not licence:** *"an existing, vibrant, diverse community... Projects under one year old
   or mere proof-of-concept implementations typically don't qualify"* and evaluation runs *"over a
   period of many months."* Cost: 10% of any revenue Conservancy processes (moot — this project takes
   no donations today). **This suite does not have an external contributor community; it has Tom and
   AI seats.** That is the actual bar, not the licence.

2. **NumFOCUS.** Requires an OSI-approved licence (GPL qualifies) and an explicit public governance
   structure, but ALSO **requires a leadership body of at least 3 people who are not employed by the
   same entity**, plus 3–5 signatories on the fiscal-sponsorship agreement. CITED,
   `github.com/dask/governance` issue #1 and corroborating pages. **LibreWaterNet fails this test by
   structure today** — one human maintainer — independent of the licence question. NumFOCUS's own
   sponsored-project roster also skews scientific-Python/numerical computing (pandas, NumPy,
   Jupyter); a PHP/JS hydraulic-calculator suite is an atypical mission fit, though I found no
   explicit exclusion rule — SPECULATION on the mission-fit point, not confirmed by NumFOCUS's own
   criteria text.

3. **Open Source Geospatial Foundation (OSGeo).** CLA modeled on Apache's, but **copyright stays
   with the original contributor by default; assignment to the foundation is optional**, CITED
   `wiki.osgeo.org/wiki/Contributor_Agreement` and `osgeo.org/about/licenses/`. Accepts any
   OSI-approved licence (GPL is fine — QGIS itself is GPL and is an OSGeo project). Mission fit is
   partial: this suite's `lpn_` calculator has a real geographic mode (Mercator projection, lon/lat
   storage, Task 497 elevation), but the suite's centre of gravity is hydraulic calculators, not GIS
   — OSGeo's own incubation checklist expects a geospatial-software identity. Incubation is a
   multi-stage, checklist-driven process (`wiki.osgeo.org/wiki/Project_Graduation_Checklist`) that
   plainly runs months to years, not days.

4. **Apache Software Foundation.** **Ruled out on licence grounds alone.** CITED,
   `apache.org/licenses/GPL-compatibility.html`: ASF requires all its own code be distributed under
   Apache License 2.0, and GPLv3 code cannot be incorporated into an ASF project *because it would be
   incompatible with that requirement* — accepting a GPL codebase into the Incubator means relicensing
   it to Apache-2.0, a permissive licence. That is the opposite direction from what statement (1)
   values (GPL as the freer choice, permissive as a lesser rationalization) — donating to Apache would
   require Tom to do the exact thing his own quote frames as a compromise. Not a fit; no further
   research warranted.

5. **Linux Foundation / LF Energy.** Accepts any OSI-approved licence for the *code* (copyright stays
   with contributors), but **requires the project to "agree to transfer any relevant trademarks to
   The Linux Foundation or its affiliate, LF Projects, LLC"** and to have "a successful license scan,"
   CITED `lfenergy.org` hosting-requirements pages. Trademark surrender is a real, named cost — the
   project's name and branding pass to LF's neutral ownership, which is a different (milder) version
   of the naming-control question already live in this journal re: Luke Butler/EPANET. Also requires
   **sponsorship by an existing LF Energy Technical Advisory Committee (TAC) member** to even start —
   i.e., an internal champion Tom does not currently have. Mission fit for LF Energy specifically
   (grid/energy software) is weak for a water-utility tool; the parent Linux Foundation hosts a
   broader range but I found no faster or lower-barrier path there.

6. **A water-sector-specific body: the Open Water Foundation (OWF).** The one genuine sector match I
   found. CITED, `openwaterfoundation.org` (fetched today) and ProPublica Nonprofit Explorer
   (`projects.propublica.org/nonprofits/organizations/462676240`): a real 501(c)(3), *"create open
   source software and open data solutions to make better decisions about water resources,"* small —
   FY2024 revenue $45,650, CEO Steve Malers. **What I could NOT verify: whether OWF acts as a fiscal
   host/umbrella for THIRD-PARTY donated projects at all**, versus developing its own tools (its
   visible flagship is TSTool, a time-series utility) — its public page states no policy on accepting
   outside projects, no licence requirement, no governance model for one. This is a stated absence,
   not a "no": the honest next step is a direct email, not an inference. Cheapest of the six to check
   and the only one worth a one-message ask before any foundation conversation with the bigger names.

7. **Open Water Analytics (the OWA-EPANET community itself).** Not a candidate on the same footing as
   1–6: it is a community, not a legal entity I could confirm can receive a donated codebase or hold
   a governance agreement — OBSERVED via `github.com/OpenWaterAnalytics/EPANET` fetched today, "an
   international group of EPANET developers and users," no CLA, MIT licence, no foundation structure
   named. This is the existing recommendation (wish-list row 10, journal earlier today) for
   CONTRIBUTION, not for DONATION — different question, already answered separately.

### What is actionable before 2026-09-17, and what is not

**None of candidates 1–5 are actionable within nine days as an actual donation conversation** — every
one that gave a timeline said months (SFC explicitly; OSGeo's checklist process implies the same;
NumFOCUS and LF both gate on structural prerequisites — a 3-person leadership body, a TAC sponsor —
that do not exist yet and cannot be manufactured by 2026-09-17). This is a next-year conversation, not
a this-week one, **with one exception**: SFC's actual disqualifier is not licence or paperwork, it is
"no external community yet," and that is the same gap the OWA-contribution track (wish-list row 10)
is already built to close. **The single highest-leverage action available in the short term is the
one already queued: contribute visibly to OWA-EPANET.** It does double duty — it is the honest form
of Tom's naming stance (already argued), and it is also the one concrete thing that starts the clock
on SFC's "existing, vibrant community" bar, which today is the real blocker, not the licence.

**What IS cheap and doable this week: one exploratory email to the Open Water Foundation** asking
whether they take on donated third-party projects and on what terms — candidate 6, above, is the only
one where the honest answer is "unknown, and a single message would resolve it," rather than "known,
and it takes months."

SPECULATION, mine: statement (2) reads as a genuine standing offer rather than a decision to act on —
Tom's own words are "I would very happily donate... I can talk to anybody in that context," which is
an open door, not a plan. Nothing here should be read as a recommendation to initiate a donation
conversation now; it is a recommendation about which door is cheapest to knock on first, and that
door (OWF) costs one email.

## 2026-09-15 — Two questions from Task 674 and Task 667(d)

### Question 1 — is Task 674's "if we are alone in not offering typed coordinates, that is evidence" premise true?

**EPANET 2.2 itself: YES, it lets a user type X/Y into the Property Editor.** CITED, primary
source: `https://raw.githubusercontent.com/USEPA/EPANET2.2/master/User_Manual/docs/6_objects.rst`
(fetched 2026-09-15, EPA's own manual repository, `usepa.github.io/EPANET2.2` is the rendered
form). Exact text: *"Alternatively, new X and Y coordinates for the object can be typed in manually
in the Property Editor."* The Junction Properties table in the same file lists **X-Coordinate** and
**Y-Coordinate** as editable properties, noting that a junction with them left blank does not
appear on the map. This directly contradicts a weaker earlier search summary I first got from a
secondary teaching page (rpitt.eng.ua.edu, unreachable to re-verify directly) and from
`usepa.github.io/EPANET2.2/4_EPANET_workspace.html`, which describes the Property Editor's *field
types* in general but never lists coordinates as one of them — the primary chapter (6, "Working
with Objects") is the one that actually states it, chapter 4 just describes the editor widget
generically. **So EPANET's own desktop GUI is NOT a peer for "nobody offers this" — it is the
counterexample**, and has been since long before this suite existed.

**epanet-js (the web app): NO, as far as I can determine from its own rendered property panel
source, and this is the stronger of my two epanet-js checks this session.** CITED, primary source:
`github.com/epanet-js/epanet-js`, commit `8a683891e031b9d3005b68a0cb977857e60e42b5` (cloned
2026-09-15, `main` branch). `apps/app/src/panels/asset-panel/asset-panel.tsx` (3,555 lines, the
actual rendered property panel for junctions/reservoirs/tanks) contains **zero** references to
`coordinate`, `latitude`, `longitude`, `lat`, `lng`, `x`, or `y` as a rendered field — it has
`<QuantityRow name="elevation" .../>` and similar rows for `emitterCoefficient`,
`isActive`/`isEnabled`, and others, but no coordinate row of any kind (checked at
`asset-panel.tsx:552-565` for the junction section specifically, and grepped the whole file). The
only 22 hits for `coordinates` in the whole `asset-panel/` directory are in
`asset-panel.test.tsx` and `pump-level-based-controls.tsx`, where `coordinates` is TEST FIXTURE
DATA (`.aJunction(IDS.J2, { coordinates: [10, 0] })`) or an internal value read to draw a level
marker on the map — never a form field a user types into. **This is a stronger form of evidence
than a webpage description**: it is the component that renders, not documentation that could be
stale or aspirational. Their own roadmap item on custom coordinate systems
(`roadmap.epanetjs.com/data-exchange/p/use-and-export-with-custom-coordinate-systems-and-projections`,
marked complete 2026-03-30) is about DISPLAY/IMPORT/EXPORT projection, not about a typed-coordinate
form field, and says nothing about numeric entry either way.

**So Tom's premise inverts by source: he is right about epanet-js and wrong about EPANET itself.**
The roadmap block's phrasing ("epanet-js exposes coordinates in its property panel, and EPANET's
own `[COORDINATES]` section is plain text people hand-edit today") had it backwards on both halves —
epanet-js is the one with no coordinate field found, and EPANET's own Property Editor (not just the
`.inp` text section) has had typed X/Y for decades. **This does not weaken the case for Task
674 — it changes the argument.** The evidence "we are alone" is false; the evidence "EPANET's own
GUI, the format's reference implementation, has offered this the whole time and epanet-js — funded,
newer, GIS-aware — chose NOT to build it" is a different and arguably stronger argument for why we
should: it is not a novelty, it is table stakes EPANET itself sets, and a from-scratch competitor
apparently judged it not worth building (or has not gotten to it) — SPECULATION on why epanet-js
lacks it; I found no statement from them either way.

**A GIS-adjacent convention check, brief:** I could not do a systematic survey of QGIS-plugin /
WaterGEMS / InfoWater property panels in the time available — WaterGEMS/WaterCAD in particular has
no public screenshot-documented property-grid reference I could pin down cheaply, and a login wall
blocks Bentley Communities. **What I can say generally and with less rigor:** typed coordinate entry
alongside drag-to-place is the norm in desktop GIS editors I could verify by direct inspection —
QGIS's own vertex/feature attribute forms expose X/Y as editable fields for point geometries
(general GIS knowledge, not independently re-verified this session — SPECULATION, downgrade
before quoting). The one thing I verified rather than recalled is EPANET's own manual, above, and
that alone is enough to answer what Task 674 actually asked for.

### Question 2 — is there a cloud-drive route that needs no account of ours (Task 667(d))?

**Two different things answer "yes" at two different costs, and the free one may already be true
today with zero new code.**

**(1) The File System Access API this suite ALREADY uses is provider-agnostic and does not care
whether a folder is local or cloud-synced.** OBSERVED: `js/looped-network.js:21783`
(`fileApiAvailable()`), `:22221` (`showSaveFilePicker`), `:22358` (`showOpenFilePicker`) — these
are the suite's existing Save/Open. **CITED**, Chrome for Developers' own File System Access API
docs (`developer.chrome.com/docs/capabilities/web-apis/file-system-access`, fetched 2026-09-15):
*"the 'local file system' in the spec does not have to strictly refer to the file system on the
local device... on ChromeOS these file pickers will also let you pick files and directories on
Google Drive."* On a desktop OS the equivalent is simpler still: **Google Drive for Desktop,
OneDrive, and Dropbox all mount as an ordinary folder** once a visitor has installed and signed
into that provider's own app — nothing on this page has to know a folder is cloud-backed, because
the OS already presents it as local. **If a visitor's `showSaveFilePicker()` dialog is pointed at
their synced Drive/OneDrive/Dropbox folder, "cloud save" already works, today, with the exact code
already shipped, no new third-party request, no new consent gate, and no registration of any kind
on our side.** The honest limit: `fileApiAvailable()` gates on Chromium (Chrome/Edge/Opera) — the
same OBSERVED code already falls back to download/upload for Firefox/Safari
(`:22131`, `:22209`, `:22333`), and that fallback does NOT reach a synced folder automatically (a
downloaded file lands in the Downloads folder, not the Drive one, unless the visitor's OS-level
sync also watches Downloads). **This answer may already be true and simply undocumented** — I found
no place in this repo or in `dev/positioning.md` that says so; it would cost nothing to say it
explicitly somewhere visitor-facing if Tom confirms it tests out in practice, since I could not test
it against a live synced folder from this environment.

**(2) A direct in-app connector (Google Drive Picker, OneDrive/Graph picker, Dropbox
Chooser/Saver) is ALSO genuinely buildable with no server and no per-user record of ours, but it is
a new cost, not a free one.** CITED, `developers.google.com/workspace/drive/picker/guides/*`
(fetched 2026-09-15): the Google Picker/Drive API from browser JS needs an OAuth **client ID**
registered once in Google Cloud Console by the app operator (Tom) — *"client secrets aren't used
for Web applications"* — so there is no server-side secret to hold and no backend to run; tokens
live in the visitor's own browser session. The scope this suite would actually want,
`drive.file` (per-file access, not whole-drive), is CITED as **"Recommended" and "Non-sensitive"**
in Google's own scope-classification guidance
(`developers.google.com/workspace/drive/api/guides/api-specific-auth`) — which matters because a
*sensitive* scope caps an unverified app at 100 users and a Google verification review; a
non-sensitive one does not carry that cap, CITED
`support.google.com/cloud/answer/7454865`. **Dropbox's Chooser/Saver is the same shape and cheaper
still** — CITED `dropbox.tech/developers/quickly-integrate-file-upload-in-your-web-app-using-the-chooser`
and `dropbox.com/developers/chooser`: *"does not require 'Production' approval,"* browser-only, a
few lines of JS, one app key. I did not verify OneDrive's picker to the same depth this session —
it uses Microsoft Graph and MSAL.js as a "public client" (no secret) by the same general shape, but
I have not confirmed its scope-sensitivity or approval requirements the way I did for Google and
Dropbox; treat that one leg as unverified rather than as a third confirmed yes.

**The catch, and it is the one CLAUDE.md explicitly asks to be flagged loudly: any of these three
connectors is a NEW third-party request** (a fourth network call beyond OSM/Mapbox/Nominatim,
each of which today has its own consent gate per `third_party_request_check.php`). Building one
means: a new gate (`ec_clouddrive` or similar), a new `privacy.php` paragraph, and — because it
picks a specific provider rather than being provider-neutral — building THREE separate
integrations to cover Drive, OneDrive and Dropbox users equally, where route (1) above covers all
three (and any other synced-folder provider, present or future) for free by construction.
**Recommendation implied by the arithmetic, not asserted as Tom's call: check whether (1) already
works before building any of (2).** If it does, "cloud save" needs a sentence of documentation and
zero new consent surface; if a visitor specifically wants an in-page "Connect Google Drive" button
rather than "point your Save dialog at your synced folder," that is a real but separate ask, and its
cost is a new third-party request each time, not a database or login (Tom's actual worry) — none of
1–2 needs a server-side secret, a user table, or a PHP session, so the structural objection in
Task 667(c) does not apply to any of them.

## 2026-09-15 — second entry, same day: coordinate slot order (Task 674 follow-up)

Tom asked two direct questions, in parallel with Sue and Franco: where do the two coordinate boxes
go in the node Properties popup (slots 2-3 after ID, vs. end), and whether EPANET's own
Description-and-Tag-before-Elevation order is deliberate or historical.

### Question 1 — where coordinates sit

**EPANET 2.2's own Property Editor table is uniform across ALL object types, node and link
alike, and coordinates sit in slots 2-3 every time.** CITED, EPA's own manual source
(`github.com/USEPA/EPANET2.2/blob/master/User_Manual/docs/6_objects.rst`, fetched today):

- Junction: ID, **X-Coordinate, Y-Coordinate**, Description, Tag, Elevation, Base Demand, ...
- Reservoir: ID, **X-Coordinate, Y-Coordinate**, Description, Tag, Total Head, ...
- Tank: ID, **X-Coordinate, Y-Coordinate**, Description, Tag, Elevation, Initial Level, ...
- Pipe: ID, **Start Node, End Node**, Description, Tag, Length, Diameter, Roughness, ...
- Pump: ID, **Start Node, End Node**, Description, Tag, Pump Curve, Power, Speed, ...
- Valve: ID, **Start Node, End Node**, Description, Tag, Diameter, Type, Setting, ...

So it is not one designer's idiosyncrasy on one dialog — it is a rule EPANET applies to every
object type, including links, where "position" is the two endpoint references rather than an X/Y
pair. That consistency is itself evidence it was a deliberate editor-design choice, not an
accident on one form.

**A GIS attribute table is a genuinely different third option, and it is the more common
professional pattern for tabular data specifically (the Tables pane's own analogue).** CITED, QGIS
3.34 user manual (`docs.qgis.org/3.34/en/docs/user_manual/working_with_vector/attribute_table.html`,
fetched today): the attribute table shows only non-geometry fields by default; geometry is edited
on the map canvas or through a separate editing workflow, never as a typed coordinate column
sitting among the attributes. ArcGIS Pro is CITED, `pro.arcgis.com` (Add XY Coordinates / Calculate
Geometry Attributes tool pages, fetched today): the `Shape` field is a geometry data type distinct
from any attribute column, and a typed X/Y column (`POINT_X`/`POINT_Y`) only appears if someone
deliberately runs a tool to derive one — it is never there by default, and editing it does not
feed back into the geometry. **In other words: the two market leaders in tabular geospatial editing
do not put geometry in the attribute table at all — the closest analogue to our node table has no
coordinate columns as a baseline state.** That is a real third option Tom's framing did not list:
coordinates could live ONLY in the map (which this suite already has, since a node is drawn) and
never in the Tables pane as columns, with the Properties popup's two boxes serving as the one
typeable escape hatch for a precise edit. I am not recommending this — Tom has already shipped the
table columns (Task 674) and reversing that is a bigger question than slot order — but it is worth
him knowing the field's dominant convention is "no coordinate column at all," which makes EPANET's
own choice to show X/Y in its editor (but NOT, as far as this source shows, in a spreadsheet-style
table view) more notable, not less.

**epanet-js confirmed again, same finding as the 2026-09-15 first entry:** no coordinate row in its
rendered property panel (`apps/app/src/panels/asset-panel/asset-panel.tsx`, commit `8a68389`,
checked directly). So epanet-js answers neither question — it has not built the feature at all.

**I could not reach WaterGEMS, InfoWater or KYPipe's property-editor layouts this session** — all
three are login-gated or ship as desktop-only trial installers with no public screenshots detailed
enough to read field order from. Stated as an honest gap, not a guess.

**On "identity first, then geometry, then domain values" as a general inspector-ordering
convention:** I could not find a documented style guide (Nielsen Norman, Material Design, or a
GIS-specific UX standard) that states this as a named rule. What I can say is narrower and better
supported: EPANET's OWN convention, applied with the same order eleven separate times across five
object types, count as one occurrence of the pattern Tom is calling "order of fundamentalism" — a
real, consistent precedent in the one tool most directly comparable to `lpn_`, not a folklore claim
dressed as one.

### Question 2 — is EPANET's Description/Tag-before-Elevation order deliberate or historical

**I could not settle this, and I looked in the two places most likely to hold the answer.**
CITED, EPA's own EPANET 2 update history (`epa.gov/sites/default/files/2014-06/en2updates.txt`,
fetched today, covering builds 2.00.01 through 2.00.12): no entry documents the Tag or Description
field being ADDED — Tag already existed by build 2.00.06 (9/11/00), where a bug fix is logged for
"conditions placed on string properties, such as Tags," which only makes sense if Tags predate
that build. The file gives no changelog entry for a Property Editor field-ORDER change at any
point, and no entry for Description at all. So the update history answers "Tag is old" but not
"why does it sit before Elevation" or "was the order ever different."

I did not find a published EPA rationale document for the Property Editor's field grouping
(no design memo, no UI spec, nothing beyond the manual's own tables, which describe the order
without explaining it). I could not compare EPANET 2.0's Property Editor screenshots against
2.2's from this environment — no archived build of the 2.0 GUI was reachable, only the .inp
format's own version notes, which are silent on GUI layout entirely.

**The one structural observation I can make stands, and it is a weaker claim than "deliberate":**
the `.inp` file format itself does not group Description/Tag with ID the way the Property Editor
does — `[JUNCTIONS]` carries ID/Elevation/Demand/Pattern, with any Description as a trailing `;`
comment and Tag in its own separate `[TAGS]` section entirely (`[TAGS] object-type id tag-text`,
per the same manual). **So the Property Editor's ordering is a GUI-only decision uncorrelated with
the file format's own section order** — the file format keeps hydraulic data (Elevation) with the
node's other required numeric properties and treats Tag as metadata bolted on separately, which is
closer to Tom's own instinct (hydraulics before free text) than to what the dialog shows. That is
the most concrete thing I can offer: **EPANET's file format and EPANET's Property Editor disagree
with each other on this question**, which weakens the file's authority for Tom's slot-order
decision rather than strengthening it — the "EPANET does it this way" argument is only as strong as
whichever EPANET artifact you pick.

**Honest bottom line for both questions:** Question 1 has a real, citable, and consistent EPANET
precedent (coordinates in slots 2-3, across every object type) and a real, citable counter-tradition
(GIS attribute tables keep geometry out of the table altogether). Question 2 does not resolve —
I found no dated origin for Description/Tag, no GUI-design rationale, and the one thing I can add
(file-format vs. dialog disagreement) argues against treating EPANET's dialog order as settled
practice rather than for it.

— Mary

## 2026-09-15 — property grouping: does anyone group, what do they call the groups, and does grouping help

Tom's draft groups a `lpn_` element's properties into ID / Dimensions / Flow and pressure / Quality /
Custom, following this morning's coordinate-slot ruling. Asked to test three observations: whether
any comparable tool groups at all, whether grouping helps by evidence rather than opinion, and
specifically whether anyone mixes inputs and results in one group (my colleague's observation 1 in
the brief).

### 1. epanet-js DOES group, and the source settles observation 1 outright

**CITED, read directly from source, not a paraphrase.** `apps/app/src/panels/asset-panel/asset-panel.tsx`
(github.com/epanet-js/epanet-js, `main` branch, fetched 2026-09-15) wraps every property in a
`<SectionWrapper title={translate(...)} section="...">`. For a Junction (lines 533-721 of the fetched
file): `activeTopology` (the enable/disable switch), `modelAttributes` (elevation, emitter
coefficient — the closest analogue to Tom's "Dimensions"), a separate `CustomAttributesSection`,
`demands`, `quality`, and then, as its **own, separately-headed section**, `simulationResults`
(head, pressure, demand met — all `readOnly={true}`). The same shape repeats for Pipe, Pump, Valve,
Tank: one or two input sections, then `simulationResults` (Pipe/Pump/Valve) or `simulationResults`
+ `energyResults` (Pump) as their own trailing sections.

**This directly answers observation 1: epanet-js never puts a typed number and a computed one in the
same group.** Every asset type gets a dedicated results section, always last, always visually and
programmatically distinct (`readOnly` at the row level, a separate `hasChanged` comparison target,
its own collapse-state key). If "Flow and pressure" mixes Demand/Emitter/Roughness/K (inputs) with
Head/Pressure (results) in one box, it would be the first place I can find, across every tool checked
this session, that a modeling UI does that on purpose. My colleague's instinct is well-founded, not
merely plausible.

**Group names, verbatim from source, for whoever writes the category headings:** `activeTopology`,
`modelAttributes`, `demands`, `quality`, `connections`, `controls`, `simulationResults`, `energy`,
`energyResults`. None of these is "Dimensions" or "Flow and pressure" — `modelAttributes` is the
nearest analogue to Dimensions (it holds elevation, but also emitter coefficient, which is not a
dimension) and epanet-js has no "Flow and pressure" grouping at all: flow-adjacent state (demand) is
its own `demands` section, separate from quality, separate from results. **I do not read this as a
term of art to borrow** — `modelAttributes` and `simulationResults` are code-facing i18n keys, and
`translate("modelAttributes")` in their English UI (I did not fetch their rendered English string,
only the source key) may or may not read as "Model attributes" to a visitor. Flag rather than claim.

**All sections default OPEN, and this is a specific, checkable number, not an impression.**
`apps/app/src/state/layout.ts:105-117` (same repo, same fetch):

```
export const assetPanelSectionsExpandedAtom =
  atomWithStorage<AssetPanelSectionExpanded>("assetPanelSectionsCollapse", {
    connections: true, activeTopology: true, modelAttributes: true,
    customAttributes: true, controls: true, demands: true,
    quality: true, simulationResults: true,
    energy: false, energyResults: false,
  });
```

**Eight of ten sections open by default across every asset type; the two closed by default
(`energy`, `energyResults`) are pump-only extras** (efficiency/cost curves, energy results) — the
one case where epanet-js itself judges a group is niche enough to hide. `simulationResults` is
OPEN by default, same as everything else: epanet-js does not treat "results" as the collapsible
half against "inputs" as the pinned half. State is per-browser (`atomWithStorage`, i.e.
`localStorage`, not the document) and persists across assets and sessions — the same "furniture
belongs to the browser" shape this suite already applies to `lpn_pane`/`lpn_rpane`/etc.
(`CLAUDE.md`, "`lpn_` only: a setting belongs to the PROJECT or to the BROWSER").

### 2. WaterGEMS/WaterCAD: could not confirm the live grid, and the one thing found argues the other way

**Could not determine what the actual Properties grid looks like — no screenshot, no UI walkthrough
reachable without a login.** What I could reach is Bentley's own reference documentation page for
Pipe Attributes (docs.bentley.com, `GUID-7E022352A26641E7860CC5BFCDBA312B`, fetched 2026-09-15): it
lists ~150 pipe attributes as **one flat, alphabetized-by-topic list with no category headers at
all**, and input properties (Material, Diameter, Has User Defined Length?) sit interleaved with
result properties (Flow, Velocity, Headloss) rather than separated. **I am flagging this as weak
evidence, not strong** — a reference doc's listing order is not proof of the live grid's layout, and
Bentley's UI is built on a standard categorized/alphabetic property-grid control that commercial
Windows engineering software commonly offers as a toggle (I could not confirm WaterGEMS actually
exposes that toggle, or which mode is default, this session). **What I can say honestly: the one
artifact I could read shows inputs and results side by side with no grouping device at all**, which
is a data point against "professional water-modeling tools all group," not for it, though it is the
weakest-sourced finding in this entry and should be re-checked against an actual screenshot or a
person with a licence before being relied on.

### 3. QGIS attribute forms: grouping is a named, standard feature — group boxes AND tabs, both supported

**CITED**, github.com/qgis/QGIS issues #33221 and #29063 (QGIS's own bug tracker, describing its
shipped "drag and drop form designer" feature, fetched via search synopsis 2026-09-15) and
docs.qfield.org/how-to/project-setup/attributes-form/ (QField, the same form model). QGIS's
attribute-form designer supports two container types for grouping fields on one feature's form:
**tabs** and **collapsible group boxes** — both first-class, both configurable per layer, and QGIS's
own tracker records the two words ("container" vs. "category") were confusingly interchangeable in
the UI at one point, which is itself a small data point that naming a group well is a known,
non-trivial UX problem even for a mature open-source GIS. **This is the closest analogue to editing
one feature's attributes on a map**, and the answer is unambiguous: yes, grouping — including
collapsible grouping specifically — is standard, established practice there, not a novelty this
suite would be inventing.

I did not find, in the time available, whether QGIS group boxes default open or closed per layer (it
is a per-project author choice, not a global default) — flagging as unresolved rather than guessing.

### 4. Progressive disclosure: real literature, and it does NOT bless "collapse everything by default"

**CITED**, Nielsen Norman Group's standing definition (nngroup.com, "Progressive Disclosure," Jakob
Nielsen's original 1995 formulation, restated on their site and corroborated by secondary summaries
fetched 2026-09-15): progressive disclosure **defers SECONDARY options to a subsidiary screen or
control, showing only PRIMARY options by default** — it is a claim about separating common-from-rare,
not a general licence to collapse. NN/g's own guidance on collapsed content specifically requires
that **"the collapsed state must communicate enough context that a user can decide whether to
expand"** — a bare category label with no preview of what is hidden inside fails this test by NN/g's
own rule, which matters directly for observation 3 below. One 2006 study cited in secondary sources
(not verified against NN/g's primary text this session) reports 30-50% faster initial task completion
when advanced options are deferred, while preserving discoverability of the full set — this is
about ADVANCED-vs-COMMON, not about every field being equally likely to be needed, which is a
different shape from Tom's five groups (none of which is "advanced," all being core to any element).

**What this literature does NOT claim, stated plainly because it is easy to over-read:** it says
nothing about which specific fields are safe to hide, and nothing that resolves whether Dimensions
specifically (coordinates, elevation) belongs in a collapsible group. That is exactly my colleague's
observation 3, and epanet-js's own choice — leaving every non-niche section, including
`modelAttributes` which holds elevation, open by default and only defaulting the two truly optional
pump-financial sections closed — reads as consistent with NN/g's primary/secondary distinction rather
than with collapsing everything. If Dimensions collapses by default, it would be treating
load-bearing geometry as a secondary option in a sense no source I found supports; if it starts
expanded (secondary only after a user's own choice persists it closed), that is squarely inside what
every tool checked this session actually does.

### Straight answers to the four questions

1. **Yes, grouping is a departure from EPANET's own flat editor but is NOT a departure from the
   market**: epanet-js groups (verified in source), QGIS's attribute-form pattern supports grouping
   as a first-class feature, and the one commercial water-modeling artifact I could reach (Bentley's
   docs page) is the outlier that does not — though that finding is weakly sourced and should not be
   trusted over a live screenshot.
2. **No conventional category names found.** Nobody I could check uses "Dimensions" or "Flow and
   pressure" as a heading; epanet-js's closest equivalents (`modelAttributes`, `demands`,
   `simulationResults`) are code keys, not confirmed visitor-facing English, and QGIS's groups are
   author-named per project, not a fixed vocabulary. Tom's own names are not contradicting a term of
   art, because none was found — this is a "we could not find a convention to defer to" result, which
   means the CLAUDE.md EPANET-deference rule does not bind here; write the plainest English.
3. **Progressive disclosure is real, named, NN/g-documented literature, and it distinguishes
   primary/secondary rather than blessing "collapse by default."** The one directly comparable tool
   that ships default-collapse state (epanet-js) applies it to exactly two niche, genuinely optional
   pump-financial sections and leaves everything else, including the section holding elevation, open.
4. **Confirmed, from source, not opinion: epanet-js keeps inputs and results in strictly separate,
   always-distinct sections on every asset type, with `simulationResults` never sharing a box with an
   editable field.** This is the strongest single finding in this entry and it lands squarely behind
   my colleague's observation 1.

— Mary

## 2026-09-21 — Tom's find: WaterModels.jl (lanl-ansi.github.io), "is this a file format?"

Tom's own words, flagged for direct answer per his hedge: *"I found this interesting file format
standard... I think that's what it is, but I am not sure."* **Straight answer: no, it is not a file
format, and not a standard.** It is a Julia software package — a research code library — for doing
optimization math on water networks. It reads a network already described by someone else's format
(EPANET `.inp`, or its own internal JSON) and does calculations on top of it. Calling it a "standard"
overstates what it is; nobody else has adopted its JSON shape as an interchange format the way EPANET
`.inp` has been adopted industry-wide.

### 1. What it actually is

CITED, `github.com/lanl-ansi/WaterModels.jl` (README, fetched 2026-09-21): *"WaterModels.jl is a
Julia/JuMP package for steady state water network optimization. It is designed to enable computational
evaluation of historical and emerging water network formulations and algorithms using a common
platform."* It is **not** a simulator in EPANET's sense (given a network and demands, tell me the
pressures) — it is an **optimizer**: given a network, formulate and solve a mathematical program that
picks the best pump schedule, the best pipe sizes for a new design, or the best valve settings, subject
to hydraulic constraints, using mixed-integer (non)linear programming. CITED (arXiv, fetched via search
2026-09-21): Tasseff et al., *"Polyhedral relaxations for optimal pump scheduling of potable water
distribution networks,"* arXiv:2208.03551; Tasseff et al., *"Exact mixed-integer convex programming
formulation for optimal water network design,"* arXiv referenced from the same author group — these
are the two named problem classes the package is actually built to solve: **pump scheduling** and
**network design under a cost objective**, not day-to-day simulation.

**Maintainer:** LANL-ANSI — the Advanced Network Science Initiative at Los Alamos National Laboratory.
CITED (WebFetch of the repo, 2026-09-21): primary developer named as Byron Tasseff, a LANL researcher.
This is one sibling of a family — PowerModels.jl (electric grid), GasModels.jl, WaterModels.jl —
built on a shared `InfrastructureModels.jl` base, all from the same LANL group, all aimed at the same
audience: **operations-research / power-systems-optimization academics**, not field engineers. CITED:
the repo's own funding note (fetched today) states this work is supported by the US Department of
Energy's Advanced Grid Modeling Program, under a project titled *"Coordinated Planning and Operation
of Water and Power Infrastructures for Increased Resilience and Reliability"* — i.e. it exists to let
power-grid researchers study water-power coupling (pumps are big electric loads), not to serve water
utilities directly.

### 2. What it reads and writes — the part with the most potential value to us

- **Reads EPANET `.inp` directly.** CITED, its own docs example: `examples/data/epanet/van_zyl.inp`.
  This suite already reads and writes `.inp` byte-identically (`js/lpn-inp.js`, CLAUDE.md), so there is
  **no new import capability WaterModels.jl's existence would unlock for us** — anywhere it can read a
  network from, we already can.
- **Its own native format is JSON, and it is NOT industry-adopted.** CITED, its docs "Network Data
  Format" page (fetched 2026-09-21): *"can be serialized to JSON for algorithmic data exchange."* It is
  a dictionary keyed on `node`, `demand`, `reservoir`, `tank`, `pipe`, `des_pipe` (a *design* pipe — a
  candidate pipe not yet built, unique to the optimization use case), `short_pipe`, `pump`, `valve`,
  `regulator`, plus scalar base units (`base_flow`, `base_head`, `base_length`, `base_mass`,
  `base_time`) for **non-dimensionalizing the problem for the solver** — a detail that only makes sense
  inside an optimization formulation, never inside a simulator or a GIS tool. **This JSON schema is
  purpose-built for feeding a mathematical solver, not for interchange between hydraulic tools.** I
  found no other tool, library, or standard (searched specifically) that reads or writes this JSON
  shape besides WaterModels.jl's own sibling packages (`PowerWaterModels.jl`). It is a private wire
  format for one code family, not a "format standard" in the sense EPANET `.inp` or GeoJSON are.

### 3. Health, licence, and who actually uses it

- **Licence: modified BSD**, per the repo (fetched 2026-09-21) — permissive, GPL-compatible in the
  direction that matters (a GPL project like this suite could read BSD code; it is our own `.inp`
  format doing the actual interop work, not their licence, that matters here since we would not be
  importing their code).
- **Activity, measured directly via the GitHub API today:** 77 stargazers, 14 forks, 13 open issues,
  created 2017-05-22, last push 2025-04-11 — small and research-cadence, not dead, not a large or
  fast-moving project. CITED: `api.github.com/repos/lanl-ansi/WaterModels.jl`, fetched 2026-09-21.
  Compare to epanet-js's own repo activity (journal 2026-09-04/05/06 entries, actively shipping) — this
  is a smaller, slower, academic-paced project by every measure available.
- **No utility or municipal adoption found, searched specifically.** CITED (search, 2026-09-21): every
  result naming WaterModels.jl in a deployment context was itself a national-lab or DOE-funded research
  paper (e.g. ORNL's "Data-driven modeling of municipal water system responses to hydroclimate
  extremes," which studies utilities but is itself a research output, not a utility using the tool). I
  found no forum post, case study, conference talk, or vendor page describing a water utility, a small
  system, an EWB chapter, or a consulting engineer using WaterModels.jl in practice. **This is a real
  result, not an oversight — I looked and found nothing**, and it is the sharpest single fact for this
  seat's question.

### 4. Does anyone our users resemble actually use this?

**No, on the evidence available.** This is squarely a research tool used by power-systems and
operations-research academics (the PowerModels.jl/GasModels.jl/WaterModels.jl family, DOE-funded, LANL-
authored) to publish papers on optimal pump scheduling and network design formulations. None of the ten
populations in this seat's standing list (US small/rural systems, NRWA members, RWSN, EWB chapters,
Peace Corps volunteers, epanet-js users, Bentley customers, K-water, FREEWAT users, AWWA Small Systems)
resemble a Julia/JuMP-fluent optimization researcher. Running it requires installing Julia, the JuMP
modeling layer, and a MINLP solver (Ipopt, Juniper, or a commercial solver like Gurobi/CPLEX for the
harder formulations) — a setup cost with no analogue anywhere in this suite's zero-install,
zero-account browser model.

### 5. What we can do with it, ranked, including the honest zero

1. **Nothing operational — do not build an importer, do not adopt its JSON, do not add it as a
   dependency or a cited interoperability target.** Everything it reads we already read (`.inp`); its
   own format has no outside adoption to interoperate WITH; and its user base does not overlap ours.
   Zero cost to leave alone, and the honest recommendation.
2. **Not a citation for `dev/positioning.md` either.** That file's job is positioning against tools our
   actual users choose between (EPANET, epanet-js, Bentley) — WaterModels.jl is not a competitor or a
   comparator in that sense; it solves a different problem (optimization, not simulation/design-by-
   drawing) for a different audience (researchers, not utilities or volunteers). Naming it there would
   not sharpen anything a real visitor is deciding between.
3. **The one genuinely interesting idea, sized honestly as a "maybe never," not a roadmap item:** the
   *concept* of "candidate/design pipe" (`des_pipe` — a pipe that does not yet exist, being evaluated
   for whether to build it) is a real modeling need this suite's `lpn_` does not have a name for today
   (a planning engineer sizing a proposed main has no "candidate, not yet real" pipe state distinct
   from a built one). This is SPECULATION, not a citation — I am not aware of anyone asking this suite
   for it, and it would be a design-tool feature, not an optimization one; WaterModels.jl merely
   supplied the vocabulary that made the gap visible to me. Flagging for a later invocation to
   re-derive against actual demand before treating it as anything more than a noticed word.
4. **Answer his literal question plainly, because that is the actual ask:** it is not a file format, it
   is a Julia optimization package from a national lab, built for a different job (optimal design/pump
   scheduling research) than what this suite does (interactive drawing and steady-state solve for a
   design or a field check), used by a different population (DOE-funded academics) than this suite's
   ten researched populations, and there is no evidence anyone in our audience has ever touched it.

**What I could not find, stated plainly:** any case of a water utility, small system, or engineer
outside the LANL/DOE/academic-optimization sphere using WaterModels.jl for real work — searched
directly, found nothing, and record that absence as the finding rather than guessing past it.

— Mary

## 2026-09-22 — R-105 reopened: does a time-step row name an instant or a range?

Tom shipped R-105 as a range fix (`24:00 - 25:00`) on 2026-09-21, then reopened it the next day:
*"I think I made a mistake, and these are not ranges, they are times."* Asked to check against
the outside world before anything is rebuilt.

**OBSERVED, checked today, `js/lpn-time.js:58-67` and `:1525-1548`.** The underlying model
(`EC.lpnReportTimes`) is a flat list of discrete SECONDS — reporting instants, not intervals; the
comment at line 41-48 states the design borrowed directly from EPANET's own model: *"Is this a RUN
or an INSTANT? EPANET's own answer... a network with patterns and no duration is one instant with a
multiplier on it."* `stepText()` (the label built for R-105) takes one instant `t` and the FOLLOWING
instant `next` and prints `start - next`, manufacturing a range out of two adjacent points in a list
that was never a list of ranges. The cost model at line 337 ("the cost is per FRAME") independently
confirms each step is a rendered instant, not an accumulation over an interval — there is no
per-interval quantity (a delta, a sum, an accumulated volume or energy) anywhere behind this control.
Every value the selector reveals (head, pressure, flow, tank level, instantaneous kW) is a snapshot
AT that time, exactly like every other point in the list.

**CITED, Bentley SewerGEMS/WaterGEMS "Time Browser" help page**
(`docs.bentley.com/LiveContent/web/Bentley%20SewerGEMS%20SS5-v2/en/35062.html`, fetched today): its
own wording is *"the current time step that is displayed in the drawing pane"* — singular, an
instant, not a range. This is the same control in the same product family Tom has used.

**CITED (general knowledge of the shipped product, corroborated by search results returned today —
microimages.com's hosted copy of the EPANET 2 Users Manual, and the "elapsed time" phrasing search
results returned unprompted): EPANET's own Browser window "Time" control is a single elapsed-time /
clock readout** that advances one reporting step at a time as Play or the VCR-style step buttons are
pressed, and the Time Series Plot and Table (Report) both key every row/point to ONE time each —
head, pressure, flow and velocity are point-in-time state variables reported at that time, never
as `T1 - T2`. I could not reach a page whose text I could quote directly (the two official PDF
manuals fetched today would not extract to readable text in this environment — recording that as a
tooling limit, not as an absence of evidence — poppler-utils is not installed and no `pip` is
available to add a PDF reader), so this line is CITED at the level "corroborated by independent
search snippets and Bentley's page for the same conceptual control," not "I read EPA's own sentence
today." Flagging that gap honestly rather than upgrading it.

**CITED, epanet-js-toolkit's own example page title** (`epanetjs.com/api/introduction/examples/`,
"Step through the hydraulic simulation") — the verb is *step through*, one state at a time, matching
the same instant-based framing; I could not reach the toolkit's own UI (epanetjs.com's product,
distinct from the toolkit docs) to confirm its picker's rendered text this session, so I am not
citing epanet-js's rendered picker, only its API's own conceptual model, which the docs state as
"the result at that time step."

**Does the answer differ for interval-accumulated quantities?** Yes, in principle, and it is worth
saying so plainly because it is the one place a genuine range belongs: a demand PATTERN multiplier
(a rate held constant across a whole hour) or an accumulated tank-volume-change / pump-energy-cost
figure IS naturally described as "during 8:00-9:00," because the number describes what happened
across that hour, not the network's state at its boundary. But **I found no such quantity behind
this particular selector** — `js/lpn-time.js` frames a REPORTING TIME exactly the way EPANET does,
and every value it reveals is a snapshot at an instant. If a future feature reports something
accumulated per interval (e.g., "energy cost this hour"), THAT control should say `8:00 - 9:00`; this
one should not, because it is not that control.

### Recommendation for Tom, one paragraph

He was right to reopen it, and the fix he now wants is the correct one: change the selector back to
one time per row, not a range. Every comparable tool checked today — EPANET's own Browser Time
control (an elapsed-time/clock readout that advances one step at a time), the epanet-js toolkit's own
"step through the simulation" framing, and Bentley WaterGEMS/SewerGEMS's Time Browser (its own help
text: "the current time step that is displayed in the drawing pane," singular) — treats this exact
kind of control as naming a single moment you are looking at, never a span between two moments. That
also matches how this page's own code already models the data: `lpnReportTimes()` is a list of
discrete instants, and the two-time label was built by pairing each instant with the next one in that
list, manufacturing a range that was never really there. The one place a genuine range would be
correct is a DIFFERENT kind of number — something accumulated OVER an interval, like an hour's worth
of energy cost or a tank's volume change during that hour — and this suite has no such control today;
if one is ever added, it should say "8:00 - 9:00," but the time-step/transport selector on the
toolbar is not that control and should go back to naming one instant, for example `25:00` (or
`1:00` with the day noted, however the run-time-vs-wall-clock question is settled elsewhere) rather
than `24:00 - 25:00`.

— Mary

## 2026-09-24 — R-210: EPANET gap audit before the EPANET++ release

Tom's question via the orchestrator: a deep pass through EPANET Help to find anything EPANET has
that `lpn_` does not, excluding graphs (Task 600). Full table, ranked gaps, and the "does this bear
on the EPANET++ name" question are in `dev/agents/market-researcher/epanet-gap-audit.md` — not
duplicated here in full; this entry is the pointer plus the two findings worth carrying independent
of that file.

**OBSERVED, and the most consequential single thing this pass found: `dev/looped-network-
calculator-scope.md`'s "Cut, not deferred" list is stale on two items, not superseded-in-place the
way tank/PRV/PSV/FCV already were.** It still reads (checked today) "Water quality, in every form
(age, trace, chlorine decay, multi-species)" as permanently cut, and "PBV and GPV stay cut." Both
are false today: `js/looped-network.js:40531-40535` and `js/lpn-epanet.js` ship single-chemical
water quality (age, source trace, a reacting chemical) through the EPANET engine, confirmed in the
page's own visitor-facing Notes text (`lib/lang.ec.en.php:2120`, `lpn_notes_2_def`: "Water quality is
modeled..."); GPV and PBV are both real valve types with `.inp` round-trip, closed under ROADMAP
Tasks 586/588 (`dev/roadmap-closed-ids.md:558-559`). Multi-species (EPANET-MSX) genuinely is absent
(grepped, zero hits) — so the honest present-tense sentence is "single-chemical, not multi-species,"
not "water quality is cut." I have not edited that doc — out of this seat's write access — flagging
it here so whoever next touches it makes the same edit that already happened for tank/PRV/PSV/FCV
in that same section.

**The ranked short list (audit file §3), independent of build-cost sizing, in order: Full Report
export, Status Report (narrative of run-time status changes), Calibration (already Task 601, this
pass adds nothing new), `.PRO` profile import (already Task 604, ditto), Meter-on-a-label (already
Task 482, deliberately deferred, ditto), multi-species water quality (low priority for this suite's
actual audience), an overview/locator inset (low priority at the 10-20 node target scale), and
multiple document windows (not a real gap — browser tabs already answer the same need).** Full
reasoning and cost notes for each are in the audit file; not repeating them here.

**On the EPANET++ name (Tom's stated reason for asking):** this pass supports, and if anything
understates, his own argument in `dev/positioning.md` §6 that the suite is "an extension of EPANET
with scenarios, fire flow, libraries, and more" — the multi-scenario compare tool in particular has
no first-class equivalent in EPANET's own desktop GUI. **The one thing that must travel with that
finding is `dev/positioning.md` §2's own standing rule: never write a completeness claim against
EPANET.** This audit is evidence FOR "we extend EPANET," not evidence that the gap is closed or
bounded — a gap list from one session is a sample, not a boundary, and the file says so in its own
closing section.

Provenance for the audit file itself: outward sources are this seat's own prior CITED fetches
(EPANET 2.2 manual, OWA-EPANET README) from 2026-09-08/09-15, re-cited rather than re-fetched (they
do not change); the Status/Full/Energy/Calibration/Query/Group-Edit menu-shape knowledge is this
seat's general familiarity with EPANET's desktop UI, NOT re-verified against a live install this
session — flagged explicitly in the audit file as needing confirmation before anyone writes public
copy naming those EPANET features by their EPANET names, the same discipline Task 601 already
imposed on itself for the Calibration Report.

— Mary
