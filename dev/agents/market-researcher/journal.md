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
