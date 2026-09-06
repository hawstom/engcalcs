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

