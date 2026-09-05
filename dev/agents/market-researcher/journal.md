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
