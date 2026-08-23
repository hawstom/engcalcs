# Positioning: how we talk about ourselves, and about the alternatives

Started 2026-08-14 at Tom's request — *"I would like to record our thoughts."* Until now this
material was scattered across ~10 `dev/ROADMAP.md` blocks, `dev/looped-network-calculator-scope.md`,
`dev/outreach-owa-post.md`, `dev/privacy-and-terms-draft.md` and `dev/cookie-storage-inventory.md`,
so the same judgements were being re-derived every time the subject came up.

**This is an internal note. It is not a source for page copy.** The whole point of the first
section is that most of what follows should never be said out loud.

---

## 1. The lead — an invitation to build, not a product pitch

**Tom, 2026-08-21, redirecting LibreWaterNet.org:** *"I would rather focus on (A) building a new
community-owned solution together. 'Looking for stakeholders, not for money.' 'Advisors, bug reports,
power users with wish lists, and non-profit directors' and (B) 'World class and world owned' 'Water
network design and management software for everybody everywhere.' More later, I hope."*

Those four quoted phrases are the copy brief, not raw material — use them as written.

- **Pillar A is the ask.** *Looking for stakeholders, not for money.* Named audience, in Tom's order:
  **advisors, bug reports, power users with wish lists, and non-profit directors.** There is no
  donation route and none is implied; an ask that reads as fundraising with the ask hidden is worse
  than no ask.
- **Pillar B is the identity.** *World class and world owned.* *Water network design and management
  software for everybody everywhere.*
- **The invitation LEADS; the product follows it.** The product must still be findable — somebody
  arriving because they want a network model has to learn it exists and works — but below the ask,
  not above it. (Superseded lead, recorded so it is not reinstated by habit: the draft opened
  *"Draw the network. Solve it. Publish the map."*)
- **Say "we have not decided that yet" out loud.** There is no foundation, no board, no governance
  document, no funding model and no dated roadmap. Inventing one is the failure mode here; the
  absence is the reason advisors are wanted, so state it as the reason.

This register was already Tom's on 2026-08-14, asked where our disposition toward epanet-js should
live: *"I'm not keen on saying a lot about comparisons with EPANET or epanetjs. I lean toward saying
little more than 'Join us in building LibreEPANET, for the community and by the community, today.'"*
It matches what `about_body_html` does with the licence — *"This is an invitation, not a price."*

Consequences, so the rule is operational rather than a sentiment:

- **No competitor appears in a title, meta description, tagline, menu item or headline.** This
  extends the existing Task 296 ruling (which banned live trademarks — WaterCAD, WaterGEMS,
  Bentley) to the *voluntary* case: we also decline to name the ones we legally could.
- **A comparison belongs only on a page where it can be substantiated**, which Task 296 already
  anticipated and nobody has written. If that page is ever wanted, it is a deliberate decision, not
  a place to spill this file into.
- **The invitation is to *build*, not to *switch*.** We are not running a migration campaign.
- **We are not the aggrieved party.** Nothing here is a grievance, and it should not read as one.

The draft front door carrying this lead is `dev/librewaternet-landing/index.html`.

## 2. The one fact worth stating plainly

Everything else in this file is judgement. This part is checkable, which is why it is the only
comparative claim licensed for public use — and even then, stated as a fact about *us*, not as an
attack on them:

- The **app** at epanetjs.com is **FSL-1.1-MIT** — not FLOSS today; it converts to MIT after two
  years.
- The **toolkit** we vendor is a different thing: `epanet-js` 0.9.0, **MIT**, © Luke Butler,
  wrapping MIT OWA-EPANET. Full detail and the name-collision warning are in `js/vendor/README.md`;
  cite it rather than restating it here, so there is one copy to keep true.
- We are **GPL v3 or later**, with no paid tier, no free tier that can be withdrawn, and no delay
  before the code is yours.

This is the substance behind Task 244's navbar term, and behind `About.php`'s *"Free Libre Open
Source License"* heading. **State our own licence; do not narrate theirs.** The contrast is
available to anyone who looks, and it lands harder unspoken.

### The honest statement about what we do not know

**Tom, 2026-08-22, on finding that EPANET's "Labels" carry a Meter feature nobody had noticed:**
*"EPANET appears to me to be of 'infinite' depth. And the only way I can cope with that vision is to
retreat to the honest statement I gave you for our lwn splash page; 'We are what we are, and it's
good and useful and usable. But we have no idea what we are not and what we don't know.'"*

**This is a positioning asset, not a disclaimer.** It is the one claim about ourselves that the next
surprise cannot falsify, and every roadmap and feature comparison we write implies the opposite —
that the boundary of the gap is visible. It is not. Say so in public, and a discovery like the Meter
becomes a confirmation of our honesty rather than a correction to it.

Practically: never write a completeness claim against EPANET, in the roadmap or on a public page.
Name what we do and what we know we lack; do not imply the second list is finished.

## 3. Where we actually differ

Their stated audience, in their own words, is *"utilities, educators, and engineers with smaller
budgets,"* positioned against commercial vendors. That is not our audience, and the difference is
from their marketing, not our guess.

What we have, **in this order** — the order matters, because the first item is the only one that is
a verifiable fact rather than a matter of taste:

1. **A licence that cannot be revoked.** GPL v3+ against FSL-1.1-MIT. See §2.
2. **26 languages.** The suite's deepest single investment and the hardest thing here to replicate.
3. **The annotated map** — see §4.
4. **Offline PWA, and no third-party STORAGE at all.** There are **three** third-party requests, all
   on the map page and all opt-in by using the feature: OpenStreetMap street tiles, Mapbox satellite
   tiles, and Nominatim place-name search, which has its own consent gate (`ec_geosearch`) because a
   tile says where you are looking and a search says what you typed. *"No third-party request of any
   kind" is false and must never be written again.* The public framing is **we ask you each time, per
   feature** — and the count is small enough to state, so state both. `dev/cookie-storage-inventory.md`
   is authoritative; a privacy claim with a footnote a reader has to go and find is not a privacy
   claim.
5. **Distribution.** Real existing reach into hands that are not shopping for a network solver.

### Phone and field use is DEMOTED, and is not touted

**Tom, 2026-08-14:** *"I think that phone is a dead end. We will keep caring and trying. But I don't
want to tout it. I could be wrong, and I should get advice."*

Task 222's original "What survives" bullet led with mobile/phone. **That ordering is superseded, not
merely reshuffled.** Mobile does not appear in a headline, a tagline, or a list of reasons to choose
us.

We keep *caring*: the `innerHeight * 0.72` cap in `effectiveMapHeight()` stays (it exists because
`#lpn_canvas` has `touch-action:none`, so a canvas taller than the viewport traps a phone user with
no scrollable page — Tom hit exactly that on 2026-07-31), and phone regressions are still bugs.

**Tom softened the stance on 2026-08-22, and the softening has a stated goal and a stated limit.**
*"the truth is that this is a PC app, just like EPANET and epanetjs, and epanetjs takes the same
stance only a little more strongly than I want to put it. For PC of course, but go ahead and try it
on your phone."* And on where we stand today: *"We are not usable on a phone today, IMO. We will be
with those four small-screen tasks done."*

The target was **"obviously never tried on a phone" → "well, maybe"**, and nothing beyond it. The
four small-screen items shipped 2026-08-22 (Task 486) and **Tom made the phone pass on 2026-08-23**,
which is the only thing that could settle it. **The sanctioned public wording is exactly "Try it. We
did." and nothing stronger** — an invitation to try, never a claim that it is good there. A public
page still may not call the map editor *usable* on a phone, and the demotion above is unchanged:
mobile stays out of a headline, a tagline, or a list of reasons to choose us. Revisit the
positioning beyond that only if outside advice says otherwise.

## 4. Design, not management — and the annotated map is the evidence

Tom's observation, 2026-08-14: epanet-js appears not to prioritise a map you can *publish*. At any
zoom useful for a report, most labels are auto-hidden, with no size control and no drag override
found. The upside is that their map always looks pretty; the cost is that a friendly annotated
exhibit is not obtainable. *"While I am sure that the big money is in management, somebody has to
design things."*

This is a differentiator that is **built, not aspirational** — `js/lpn-geom.js` (leader lines,
attachment with side-flip hysteresis), `js/lpn-collide.js` (weighted-box label relaxation),
draggable node/link labels, and backdrop images all exist because a human is arranging a map for
someone else to read.

**The mechanism ruling, so nobody builds the wrong thing:** the target is a map that
**screenshots** well for pasting into a report. It is **not** browser printing, and **not** a print
stylesheet. `Looped-Network.php`'s recorded assumption — *"nobody prints these, everybody
screenshots"* — **stands.** Tom, 2026-08-14: *"even then, copy/paste and screenshots may be the
easier way to present than trying to print from a browser."* (`@media print` currently appears zero
times in `css/engcalcs.css`, and that is fine.)

## 5. We do not track bugs in alternatives

Tom, 2026-08-14: *"epanetjs has bugs, of course. I don't suppose there is any value in tracking
them. Suffice it to say that the general maxim is true: **we aren't comparing against
perfection**."*

Recorded precisely so that nobody starts such a list later. It would be maintenance we do not owe,
it would age badly, and it would pull the whole posture toward grievance, against §1.

## 6. LibreEPANET.org

Tom bought the domain; it 302-redirects to `Looped-Network.php?lang=en` as a placeholder.

### Our standing on the name — settled, do not re-argue

**Tom, 2026-08-14:** *"we have no less technical authority to call ourselves EPANET, more moral
authority, and all the legal authority since it's all public domain."*

- **Legal: settled.** EPANET is US EPA public-domain software. It has no owner to license from, and
  epanet-js is the standing proof that the name can be used this way.
- **Moral: ours, on the GPL-vs-FSL contrast of §2.**
- **Technical: a matter of degree, and closing.** Tom, same day: *"EPANET is looking closer and
  closer… I am sometimes a bit reckless and fearless. And I have little to fear here."*

**One caution, which is not a doubt about the above:** a project *name* runs on trademark and
community norms, not copyright. "LibreEPANET" reads descriptively, the way "epanet-js" does, which
is why it is safe. A courtesy note to OpenWaterAnalytics before launch is cheap insurance — in the
register of `dev/outreach-owa-post.md` (a real question, not an announcement).

### The gate: launch waits on Task 248

Tom's ruling, 2026-08-14: the rebranded site waits until **tanks, valves and extended-period
simulation** ship (Task 248). Those three are what Task 296 relied on when it refused *"web clone of
EPANET"*, and they are the whole of the honesty case. **All three have now shipped** — tanks and
valves 2026-08-14, the run 2026-08-18 through the EPANET engine, checked against every step of EPA's
own `Net3.rpt`. What is left of Task 248 is a pattern on a reservoir head or a pump (248.02) and
rule-based `[RULES]` (248.03). **"No extended-period simulation yet" is FALSE and must not be
written again**; it stood in the landing draft until Tom caught it, three days after the run shipped.
The built-in solver has no time dimension and is not getting one, so a run is an EPANET-engine
capability and public copy must say which. **`.inp` EXPORT shipped the same day and the same draft
called that missing too**, so the rule is general: check `dev/roadmap-closed-ids.md` before writing
any "not built yet" sentence, because this page's honesty paragraph is the first thing to rot.

**The gate is about SEQUENCING, not legitimacy.** It is not a hedge about our right to the name —
see above — and it must never be cited as one.

**There is no node-count limit, and nothing here should imply one.** The scope doc's *"target scale:
~10–20 nodes"* is a statement about the typical user, not a cap: nothing in the code enforces a
ceiling, 200 nodes is carried explicitly as a headroom check (*"we must not fall over"*), and a far
larger network already runs in the UX. When stating our limits, name the three missing features and
nothing else. (Tom, 2026-08-14, correcting a draft of this file that said "caps the tool.")

The build itself, and its costed feasibility findings, are **Task 306**. The front-door copy is
**Task 307**.

## 7. Deferred: epanet-js's founding partners

Optimatics, Affinity Water and AtkinsRéalis each put $50,000 into epanet-js. Tom raised approaching
them; recorded as **deferred, not dropped**.

- **The honest angle, if it is ever taken:** not "switch to us" but a governance argument a funder
  can actually act on — they paid so that a free EPANET in the browser would *exist*, and a licence
  that cannot be revoked serves that goal more durably than one that is FSL today. That is a point
  about permanence, not about product features.
- **Why it waits:** they are sunk-cost sponsors of a competitor, so a cold approach is low-yield and
  risks reading as poaching — against §1. And we have nothing distinct to show them until the Task
  248 gate clears.
- **It ranks below Task 218's advisor and protégé lists**, which are warmer, cheaper, and already in
  motion.

Revisit when the gate clears.

## 8. Their "EPANET user's dilemma", and why we decline to answer it

epanetjs.com's front page poses three horns: classic EPANET is *"clunky and outdated"*; the big
platforms are *"overpriced and bloated with features you don't need"*; browser tools *"force your
data into the cloud."* Their tiers, read 2026-08-21, for calibration only: a free tier, Pro $950/yr,
Teams from $4,400.

**We do not answer it, and the declining is the decision.** A dilemma is a SHOPPER's device — here
are your three bad options, buy the fourth — and §1 declines the shopper frame on purpose. An
invitation that opens by ranking the alternatives has already become a pitch. So nothing on the
front door is shaped as a rebuttal to this, and nothing below belongs in public copy. It is what to
say when a person raises it with us, which they will.

- **Horn 1 is a claim we must NOT make.** *"Clunky and outdated"* is about EPA's UI, and we would be
  deriding our own engine and a public good we use for free — while §6 has us writing a courtesy
  note to OpenWaterAnalytics. We are also not a reaction to EPANET's interface: we exist because
  engineering happens in 27 languages, on machines with no software budget. Say what we built —
  draw, solve, publish, in your language — never what someone else's UI lacks.
- **Horn 2 is OURS, and it is more specific than "we are free."** Tom, 2026-08-21: *"our
  differentiator **is** no-cost scenarios and everything else."* **Scenarios are behind their Pro
  tier at $950/yr, and behind ours at nothing** — so is the advanced model builder. That makes free a
  checkable claim about a named feature a working engineer is quoted a price for, not a vague virtue.
  Say *everything is free, including the parts that are normally the paid tier.* Still no vendor
  named and still no price of ours to compare (§1) — the fact is about us.
  **Superseded, and it would be re-proposed by anyone reasoning from first principles: "free is not
  our differentiator, irrevocable is."** That is wrong on the facts. Irrevocable is the SECOND
  argument, not a replacement for the first.
- **Horn 3 is where we are strongest and quietest.** No account, no upload, no server-side model, and
  it installs and runs with the cable out. State it exactly as §3.4 requires — three opt-in
  third-party requests, named, asked per feature. Overclaiming is the one way to lose an argument we
  currently win: anyone with a network tab can check, and *"no third-party request of any kind"* is
  false.
- **The fourth horn their frame cannot contain: the TOOL can be withdrawn, not just the data.** Their
  three horns are all about where your model lives; none of them asks whether the software will
  still be yours. GPL v3+ against FSL-1.1-MIT is that question, and it is the one comparative fact §2
  licenses. **Is it a real argument or a debating point? Both, and the split matters.** It is real
  for anyone whose horizon is longer than one project: a free tier is a business decision, and the
  two-year conversion runs per released version, so the app you use today is not FLOSS today. It
  becomes a debating point the moment we imply something is being taken away or a bait-and-switch is
  planned — there is no evidence of either, and §1 says we are not the aggrieved party. State our
  licence; do not narrate theirs. (§7 is this same argument aimed at a funder rather than a user.)

**Where the frame is right, and where we lose.** Recorded so nobody has to rediscover it mid-
conversation:

- Their product is more finished and better staffed, and their free tier does real work today. What
  their free tier does NOT do is the paid part — see horn 2, which is where our answer lives.
- **"Community-owned" is an aspiration, and a serious evaluator will ask who decides.** Today the
  answer is Tom. There is no foundation, no board, no governance document and no funding model. §1
  turns that into the reason advisors are wanted, which is honest — but it is still a weakness, and
  saying "we have not decided yet" is only credible while we are also asking someone to help decide.
- They took $150,000 of founding sponsorship (§7); we have volunteer time. A funded project
  outliving an unfunded one is the ordinary case, so **do not answer longevity with a promise that
  we will last.** Answer it with the licence, which does not require us to.

## 9. The front door's hero asset — Tom's, and still to come

**Tom, 2026-08-21:** *"The biggest blocker is the graphic. I have to prepare a graphic of the real
thing, possibly a video or an animated GIF."*

The inline SVG `#net` in `dev/librewaternet-landing/index.html` is a **placeholder**, not the
design — a drafted network standing in for a real screen. The figure is a slot: an image (PNG or
animated GIF) or a video element drops into the same place with no layout change. What the
replacement has to satisfy:

- **A 760 × 430 box (1.77:1).** Anything materially wider or taller is cropped, not reflowed.
- **Both themes.** The page has a full dark palette, so a screen grab with a white surround reads as
  a bug in dark mode. Either supply a light and a dark version, or frame it so the app's own canvas
  fills the box.
- **What it must show, in the page's own order:** a real network on a real basemap; labels a human
  placed, with their leader lines; the colouring. If it moves, show the RUN — tanks filling and
  draining is the newest capability and a still cannot say it.
- **No live trademarks and no real client system without permission**, and it must stay legible at
  the 1160 px sheet width and at phone width.
- The title block under the figure (Project / Junctions / Engine / Licence) is HTML and stays; it is
  not part of the image.

---

## Related records

| Where | What it holds |
|---|---|
| `js/vendor/README.md` | The FSL/MIT split, verbatim and authoritative. Do not duplicate it. |
| `dev/looped-network-calculator-scope.md` | Scope gravity toward EPANET as the project's biggest risk; what is cut, and why. |
| `dev/outreach-owa-post.md` | The register for approaching a developer community, and a worked example. |
| `dev/cookie-storage-inventory.md` | The three opt-in third-party requests, and what `privacy.php` says publicly. |
| ROADMAP Task 222 | Original 2026-08-05 research; the EPANET-as-qualification-gate ruling. |
| ROADMAP Task 244 | The navbar term for the licence distinction. |
| ROADMAP Task 296 | Trademarks out of titles; "with the EPANET engine", never "EPANET-powered". |

## §6.1 LibreEPANET.org build costing (moved from ROADMAP Task 306, 2026-08-16)

Costed 2026-08-14. **It is a VARIANT, not a fork — do not start by copying the page.**

- **The cheapest hosting answer avoids the path refactor entirely.** There are **210** hardcoded
  `/engcalcs/` paths (measured 2026-08-21; this said 112 in 2026-08-14), plus `sw.php` scoped there.
  An `Alias /engcalcs` pointing at this directory — or a symlink, on this host — resolves every asset
  unchanged. Prefer that over an `EC_BASE` refactor; the count rising makes the refactor worse, not
  more urgent. `echoHeader()`'s `"normal"` branch already gives a chrome-free header. Full layout and
  the recommendation: `dev/hosting-layout.md`.
- **`CANONICAL_ORIGIN` is hardcoded and must NOT be derived from `HTTP_HOST`.** A second domain needs
  a host → variant WHITELIST, or it reintroduces the canonical-poisoning hole that constant exists to
  prevent.
- **Two consequences to ANSWER, not discover.** The 678 KB engine is lazily imported *because* it is
  off by default, so on-by-default makes every visit pay for it — which cuts against the
  low-bandwidth case. And `lpn_settings_engine_epanet_tip` currently argues *against* EPANET, which on
  a LibreEPANET page is the page arguing with itself; it is translated into 26 languages, so it is a
  resync, not a free edit.
- **A full-viewport map is a JS change** (`effectiveMapHeight()`; no CSS height rule exists), and its
  `innerHeight * 0.72` cap is load-bearing: `#lpn_canvas` has `touch-action:none`, so a canvas taller
  than the viewport swallows every touch. Answer that trap; do not delete the cap.
- **Treat any parent-site dependency as this task's problem by default** — a different domain is
  exactly the condition that exposes them, as `/hawsedc.css` did.
