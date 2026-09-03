# Usage Data Log

Dated snapshots of real usage, kept so later readings can be **compared against a baseline** rather
than re-interpreted from scratch. Append a new dated section; never edit an old one (a snapshot is a
historical fact, not live state).

## The three tiers

Three counters, each a strictly narrower funnel stage. See `lib/config.inc.php` and
`js/Calculators.lib.js` for the instrumentation.

| Tier | Source | What it means |
|------|--------|---------------|
| **reach** | `LANG_LOG` | Raw page views. **Includes crawlers** — a high reach with ~0% human is a bot signature, not an audience. |
| **human** | `log-human-view.php` | Confirmed-human view ("window shopping"). Fires after the *session* is 10s old. |
| **used** | `log-calc-event.php` | Confirmed calculator use. Requires a **user-triggered recalculation ≥10s after load** — so it means "typed their own numbers," not "looked at the default results." |

Instrumentation lives in the shared `js/Calculators.lib.js` (`maybeLogHumanView` /
`maybeLogCalcUsage`) and fires identically on every calculator page, so **cross-page comparisons are
valid** — a conversion difference between two pages is real behavior, not a measurement artifact.

Tom's working interpretation (2026-07-27): **`human` = window shopping; `used` = the sale** — the
visitor concluded "this is the calculator I want."

---

## 2026-07-27 — first per-calculator snapshot

Given by Tom. Sorted by `human` (the column that actually reflects audience size).

| page | reach | human | used | %human (of reach) | %used (of human) |
|------|------:|------:|-----:|------:|------:|
| Manning-Pipe-Flow      | 5772 | 2721 | 1829 | 47% |  67% |
| Hazen-Williams         | 3243 |  580 |   63 | 18% |  11% |
| Manning-Trap           | 3347 |  414 |  254 | 12% |  61% |
| Manning-Irregular      | 1572 |   86 |   44 |  5% |  51% |
| Darcy-Weisbach         | 1764 |   67 |   25 |  4% |  37% |
| Manning-Pipe-Head-Loss | 1633 |   43 |   25 |  3% |  58% |
| Irrigation-Pressure    | 3935 |   46 |    2 |  1% |   4% |
| Weir-Flow-Simple       | 1530 |   18 |   10 |  1% |  56% |
| Weir-Flow-Irregular    | 1584 |   17 |   10 |  1% |  59% |
| Orifice                | 1805 |   15 |    2 |  1% |  13% |
| Rock-Chute             | 1921 |   15 |    2 |  1% |  13% |
| Micro-Hydro-Power      | 1879 |    6 |    1 |  0% |  17% |
| Orifice-Drain-Time     | 1652 |    6 |    0 |  0% |   0% |
| Canal-Seepage          | 1746 |    6 |    0 |  0% |   0% |
| Branched-Network       |  473 |    2 |    2 |  0% | 100% |

### Readings

**Audience is extremely concentrated.** Total human views ≈ 4,042. **Manning-Pipe-Flow alone is 67%
of it; MPF + Hazen-Williams + Manning-Trap is 92%.** Everything from Manning-Irregular down is ≤86
humans, and the bottom six pages are 6–17 humans each. Any UX change on a page outside the top three
is seen by a rounding error — this is the reach-weighting that killed the reciprocity idea in Task
138.

**There is a stable conversion band.** Six pages sit tightly at 51–67% used-of-human (MPF, MTC, MI,
MPHL, WFS, WFI). Treat that as the normal "found what I wanted" rate. **The outliers are the
signal**, not the band: HW 11%, IP 4%, Orifice 13%, Rock-Chute 13%, ODT 0%, CS 0%.

**Hazen-Williams is the biggest single leak.** 580 humans at 11% conversion — roughly 517 humans per
period arrive and never calculate, which is ~5× more lost humans than exist on every page below
Manning-Trap *combined*. Its 18% human-of-reach (vs Darcy-Weisbach's 4%) makes it the suite's second
genuine front door. Cause per Tom: **English users dominate the audience and they search "Hazen
Williams" by name** — so the traffic is real and well-targeted, which makes the low conversion more
interesting, not less. Not yet diagnosed. Tom's leading hypothesis: HW is a **single-line** calculator
and these visitors arrive with a *network*, hoping for `bpn_` or a looped/Hardy Cross solver — i.e.
the page is not enough for their needs, sending them back to EPANET/WATERCAD. (ROADMAP Task 144.)

**High reach + ~0% human = crawlers, not shoppers.** Irrigation-Pressure has the *highest reach in
the suite* (3935) and 46 humans. Do not read a big reach number as demand.

**Irrigation-Pressure's 4% is un-diagnosed — do not assume a cause.** A tempting explanation was the
broken paste in its copy/paste data area (Task 139), but Tom tested it 2026-07-27: Copy works, Paste
does not, and **only a rare, experienced user touches that area at all** — far too few people to
explain 44 of 46 visitors not calculating. The honest status is unknown.

**Branched-Network (2/2) is the only page where everyone who arrived converted.** Micro sample, but
it is what a page with no SEO surface and therefore no wrong-arrivals looks like. Worth re-reading
once bpn_ has real reach.

### Related-link graph at this snapshot

Only 4 of 15 calculator pages carried a "Related calculators" line, and **no link was reciprocated** —
all 11 link targets were dead ends. Downstream of MPF's four outbound links (MPHL, BPN, IP, MHP) sat
97 human views combined, i.e. **≤3.6% of MPF's 2,721** — and that is an upper bound, since some of
those visitors arrived by search rather than by clicking. So the related line, as built, moves very
few people; expected yield from re-curating it is small. This is why Task 138 was deliberately scoped
to a handful of links on hub pages instead of a full graph build-out.

### Companion data

Per-**language** human reach was captured 2026-07-21 (en 83%, es 10%, then a ≤1% tail; ten languages
at zero measured reach). It drives the REACH-WEIGHTED QA section of `dev/translation-process.md`.
Note the standing caveat there: **zero current reach ≠ low value** — for a big language it is a
discovery/SEO gap, not a quality signal.

---

## 2026-08-03 — first NON-ENGLISH HUMAN snapshot (language × calculator)

The first run of the "Non-English HUMANS by calculator" section added to `log/lang-log-stats.sh`
that day. Unlike the 2026-07-21 per-language capture, this is the **confirmed-human** tier (both
beacons; bots essentially never reach it), crossed with the page — so every row is a real person.

**Totals: 290 non-English humans shopping, 170 using — 59% conversion**, essentially the same band
as the suite overall. **This was not the expected result.** The section had been written with an
empty table treated as the likely outcome, and CC explicitly advised bracing for "26 translated
languages with no confirmed non-English human use." That was wrong, and it is worth recording as
wrong: the translation program is reaching real engineers who complete real calculations.

| lang | shopping | using | rate | pages seen on |
|------|---------:|------:|-----:|---------------|
| es | 186 | 116 | 62% | MPF, MTC, HW, DW, MPHL |
| pt | 30 | 15 | 50% | MPF, HW, MTC |
| fr | 23 | 14 | 61% | MPF, MTC, HW |
| tr | 17 | 11 | 65% | MTC, MPF, HW |
| zh | 12 | 2 | **17%** | MPF |
| he | 10 | 6 | 60% | MPF |
| de | 4 | 3 | — | MPF |
| bg, hr, ro, it | 2 each | 2/1/0/0 | — | (n too small) |

### Findings

**1. `zh` is the one real anomaly — 17% against a 50–65% band.** Every other language with ≥10
humans shopping lands between 50% and 65%. Chinese sits at 17% on Manning-Pipe-Flow, its only page.
n=12 is small and this is not yet conclusive, but it is the widest gap in the table by a long way,
and `zh` carries QUALITY 0.85 — the AI-translated-and-back-translation-checked tier — so nothing
currently flags it. **This is the single most actionable line in the snapshot.** Next step is a
targeted read of `zh` on Manning-Pipe-Flow for something that blocks *completion* rather than
comprehension: a number/unit token that renders wrong, a required field whose label misleads, or a
mistranslated result heading that makes a correct answer look like an error. Confirm or clear it
before spending on any new `zh` translation work.

**2. Two of the four anchor languages have zero confirmed human use.** CLAUDE.md names es, fr, ru
and ar as glossary anchors. `es` and `fr` are validated here — 1st and 3rd. **`ru` and `ar` do not
appear at all**, while `pt` (30), `tr` (17), `zh` (12) and `he` (10) do and are not anchors. Per the
standing rule that **zero reach ≠ low value**, this is NOT an argument to deprioritise Russian or
Arabic translation quality. It IS an argument about anchor *selection*: an anchor is supposed to be
a reference other languages are checked against, and anchoring on languages we cannot observe is
weaker than anchoring on ones we can. Worth revisiting when the glossary is next touched.

**3. Fifteen of 26 non-English languages appear nowhere**: am, ar, bn, cs, fa, hi, id, km, my, ps,
ru, sr, sw, uk, ur. Same caveat — a discovery/SEO gap for the big ones, not a quality signal.

**4. Five of sixteen calculators carry all non-English use** — MPF, MTC, HW, DW, MPHL. This extends
the existing "MPF+HW+MTC = 92% of humans" finding to the non-English population specifically, and
`es` is the only language spread across more than three pages.

**5. It supports the current priority order.** `lpn_` appears nowhere, being English-only — but the
lesson is that a translation sprint's value depends on the page first earning traffic. That is an
argument for Task 195 (persistence, and the gate on dropping the PREVIEW banner) ahead of Task
146.06 (the `lpn_` sprint), which is how they are currently ranked (90 vs 5).

### What this does NOT say

Non-English share of MPF is roughly 199/1576 ≈ 13% of humans on that page, consistent with the
2026-07-21 capture (en 83%, es 10%). The two tables may cover different windows, so treat that ratio
as approximate. Nothing here justifies translating fewer languages: the suite's parity model keeps
every key in all 27 files, and this data sequences **QA and spot-check effort**, not shipping.

---

## 2026-08-03 (later the same day) — arrival pattern, and two corrections to the snapshot above

Run of the new "Arrival pattern for non-English humans (bot-dwell check)" section.

| lang | views | days | burst | | lang | views | days | burst |
|------|------:|-----:|------:|-|------|------:|-----:|------:|
| es | 188 | 8 | 2 | | de | 5 | 4 | 1 |
| pt | 31 | 7 | 2 | | it | 3 | 3 | 1 |
| fr | 25 | 5 | 2 | | ro, hr | 2 | 2 | 1 |
| tr | 19 | 5 | 2 | | bg | 2 | 1 | 1 |
| zh | 13 | 6 | 1 | | uk, sw, ru, id, cs, bn | 1 | 1 | 1 |
| he | 10 | 5 | 1 | | | | | |

**The bot hypothesis is REFUTED, and it was CC's, not Tom's — Tom raised it as a question and CC
argued it was the more likely explanation.** `zh` is 13 views spread over 6 days with a maximum of
one view in any minute. That is *more* human-shaped than `es` (8 days, burst 2). A rendering crawler
does not visit once a day for a week. These are real people.

### Two corrections to the 2026-08-03 snapshot above

1. **"Fifteen of 26 languages appear nowhere" was wrong — it is nine**: am, ar, fa, hi, km, my, ps,
   sr, ur. The earlier cross-tab paste was truncated at 2-view rows, hiding uk, sw, ru, id, cs and
   bn at one view each. A truncated paste read as a zero.
2. **"Two of four anchor languages have zero confirmed human use" was overstated.** `ar` is zero;
   `ru` has one view. The directional point survives — es 188, fr 25, ru 1, ar 0, against pt 31 and
   tr 19 which are not anchors — but it is "one anchor at zero and one at one", not "two at zero".

### Where `zh` stands after eliminating the cheap explanations

Checked and clean: **no missing keys** (`lang_parity_check --lang=zh` shows 159 missing, all of them
`lpn_`, which is English-only by design; every `mpf_` key is present); identity strings correct and
clearly promise a calculator (`mpf_main_title` = 免费在线曼宁管流计算器); unit tokens translated;
`EC_DEFAULT_UNIT_SET` correctly gives a `zh` visitor SI. Tom read the page and back-translated it and
found nothing. It is not bots, not missing strings, and not a wrong promise in search results.

**So it is either small-sample noise or something not visible remotely — and the honest move is to
wait rather than spend.** The log accrues for free.

**PRE-REGISTERED TEST, so the next look costs nothing statistically.** The weakness of the original
finding was the look-elsewhere effect: `zh` was picked as the worst of 11 languages, so its raw
p-value overstated the case. Naming it in advance now removes that penalty entirely. Against the
peer rate p = 0.60:

| at n views | REAL if using ≤ | NOISE if using ≥ |
|-----------:|----------------:|-----------------:|
| 20 | 7 | 10 |
| 25 | 10 | 13 |
| 30 | 13 | 16 |

If `zh` is truly ~60% like its peers, expected using at n=30 is 18. If it is truly ~15%, it is 4–5.
Those do not overlap, so n=30 decides it. **Do not spend on `zh` before then, and do not re-score its
QUALITY either way.**


---

## 2026-08-09 — per-calculator reach / shopping / using

Supplied by Tom, with his own reading: *"lpn has risen fast… these complicated calculators (lpn, ip,
bpn, and even mi and wi to a lesser extent) will never have the same used/shopping as the easy
calculators (mpf and mtc), and yet lpn is already outperforming ip and bpn on that measure."*

| page | reach | shopping | using | %shop of reach | %use of shop |
|---|---:|---:|---:|---:|---:|
| Manning-Pipe-Flow | 6963 | 2831 | 1979 | 41% | 70% |
| Manning-Trap | 3803 | 421 | 276 | 11% | 66% |
| Hazen-Williams | 2606 | 111 | 64 | 4% | 58% |
| Manning-Irregular | 2282 | 85 | 49 | 4% | 58% |
| Manning-Pipe-Head-Loss | 2058 | 78 | 36 | 4% | 46% |
| **Looped-Network** | **2172** | **51** | **7** | **2%** | **14%** |
| Darcy-Weisbach | 2134 | 32 | 14 | 1% | 44% |
| Micro-Hydro-Power | 2140 | 25 | 8 | 1% | 32% |
| Branched-Network | 1446 | 19 | 2 | 1% | 11% |
| Weir-Flow-Simple | 2004 | 17 | 7 | 1% | 41% |
| Orifice | 2010 | 15 | 8 | 1% | 53% |
| Rock-Chute | 2045 | 14 | 6 | 1% | 43% |
| Weir-Flow-Irregular | 1950 | 11 | 4 | 1% | 36% |
| Orifice-Drain-Time | 2015 | 10 | 6 | 0% | 60% |
| Irrigation-Pressure | 2228 | 9 | 2 | 0% | 22% |
| Canal-Seepage | 2075 | 5 | 1 | 0% | 20% |

**TOM'S READ IS CORRECT, AND CC'S FIRST ANALYSIS OF THIS TABLE WAS WRONG — corrected 2026-08-09
in the same session, at Tom's push.** Recorded rather than quietly edited, because the mistake is
one this log exists to prevent and is easy to repeat.

**What the numbers actually support.** Ranked by shopping, lpn is **6th of 16** — ahead of
Darcy-Weisbach, Micro-Hydro, Branched-Network, Weir-Flow-Simple, Orifice, Rock-Chute,
Weir-Flow-Irregular, Orifice-Drain-Time, Irrigation-Pressure and Canal-Seepage. Against its true
peer group, the complicated calculators, it leads ip and bpn on shopping (51 vs 9 and 19) and on
absolute using (7 vs 2 and 2), on a page shipped 2026-07-30 against pages years older. That is
exactly the claim Tom made and it holds on every defensible reading.

**CC's error, stated plainly: it quoted Tom's rule and then broke it one sentence later.** Tom:
*"these complicated calculators will never have the same used/shopping as the easy calculators."*
CC quoted that, then benchmarked lpn's 14% conversion against "58–70% for the Manning family" and
called lpn "worst-converting". Comparing a map editor's conversion to a three-field form's is
comparing different tasks: "using" fires after a keystroke on mpf and after drawing a network on
lpn. The ratio is not portable across complexity, which is the whole content of Tom's sentence.

**Second error: the comparison had no statistical basis at these counts.** lpn 7/51, ip 2/9,
bpn 2/19 — Wilson 95% intervals are roughly 7–26%, 6–55% and 3–31%. They overlap almost
completely. Nothing distinguishes these three, in either direction. This log already carries a
worked example of the right discipline (the `zh` pre-registered test above); CC did not apply it.

**REACH IS STILL NOT A DISCRIMINATOR** — 14 of 16 pages sit in 1446–2606 regardless of downstream
performance, so it measures menu traffic and crawlers. That part stands, and it was never what Tom
was referring to; his "that measure" meant used/shopping among the complex calculators.

**Standing rules this table establishes:**
- Rank complex calculators against each other (lpn, ip, bpn, mi, wi), never against mpf/mtc.
- Conversion ratios are not comparable across complexity classes, and not comparable at all at
  n of a few dozen shoppers.
- Do not turn a small-n ratio into a verdict about a page's worth.


---

## 2026-08-11 — `lpn` only, a two-day re-read

Supplied by Tom in passing, for `Looped-Network` alone: **shopping 58, using 10, still 6th of 16 by
shopping.** His own framing: *"I know that's not as useful without any context. But I thought I
would throw it at you anyway."* Logged as a partial snapshot rather than folded into the 2026-08-09
table, which stays as it was read.

| page | shopping | using | %use of shop | vs 2026-08-09 |
|---|---:|---:|---:|---|
| Looped-Network | 58 | 10 | 17% | +7 shopping, +3 using, rank unchanged at 6th |

**What this does and does not say**, under this log's own standing rules.

- **The conversion did not move.** 7/51 and 10/58 have Wilson 95% intervals of roughly 7–26% and
  10–28%. They overlap almost entirely. 14% → 17% is not a change; it is the same reading twice.
- **The growth RATE is flat, not rising.** `lpn_` shipped 2026-07-30, so 51 shoppers by 08-09 is
  about 5 a day; 7 more over the two days to 08-11 is about 3.5 a day. That is in line with, not
  above, the launch average — and two days is far too short to say even that much. **Resist the
  "rising fast" story on this data**; the 2026-08-09 entry earned that phrase over ten days, this
  one does not extend it.
- **What IS solid is the rank**: 6th of 16 by shopping, unchanged, on a page ten days old competing
  with pages years older. That was the defensible claim on 08-09 and it is still the defensible
  claim now.
- **These counters cannot tell us what DEVICE anyone used** — see ROADMAP Task 285. `log-human-view.php`
  records page and language and nothing else, so every statement anywhere in this project about
  phone or tablet use of `lpn_` is an assumption, not a measurement.

## Search Console query export, 2026-07-27 — the evidence base for ROADMAP's Discoverability section

Moved here from `dev/ROADMAP.md` 2026-08-16. Source: `dev/Queries.csv` — 999 queries, 5,621
impressions, 565 clicks. That file was temporary and is not committed; the numbers below are the
durable record.

| Cluster | Queries | Impressions | Clicks | CTR |
|---|---|---|---|---|
| Manning | 196 | 1,468 | 366 | **25%** |
| Sewer / drainage | 188 | 1,007 | 11 | **1.1%** |
| Slope / grade / fall | 169 | 946 | 5 | **0.5%** |
| Hazen-Williams | 54 | 305 | 16 | 5% |
| Channel / trapezoid | 51 | 377 | 18 | 5% |
| Darcy / friction factor | 41 | 128 | 1 | 0.8% |
| Weir | 19 | 91 | 6 | 7% |
| Culvert | 11 | 66 | 2 | 3% |
| Peaking factor / Harmon | 11 | 62 | 1 | 1.6% |
| Orifice | 11 | 21 | 0 | 0% |

**The headline: Manning is won and needs nothing** — position 1, 25% CTR. The sewer-slope cluster is
comparable in size and converts at 1%.

Two smaller findings worth keeping:

- **55 queries are LLM-retrieval-shaped** (`… source`, `… authoritative source`, `… engineering
  reference`, `… pdf`), all circling one question — *is Manning valid for full/pressurized pipe, and
  is R = D/4?* — for 118 impressions and **zero clicks**.
- One query was `"kikokotoo" -site:reddit.com …`, the Swahili word taken straight from
  `lib/lang.ec.sw.php` — i.e. an agent searching our own translated string.

---

## 2026-08-21 — per-calculator reach / shopping / using, and a METRIC BREAK

Supplied by Tom, with his own reading: *"Ahem. LPN has jumped to position 3 with 40 humans using."*

| page | reach | shopping | using | %shop of reach | %use of shop |
|---|---:|---:|---:|---:|---:|
| contact | 3 | 3 | 0 | 100% | 0% |
| Manning-Pipe-Flow | 172 | 156 | 121 | 91% | 78% |
| Manning-Trap | 93 | 52 | 40 | 56% | 77% |
| **Looped-Network** | **61** | **16** | **11** | **26%** | **69%** |
| Manning-Irregular | 65 | 17 | 12 | 26% | 71% |
| Hazen-Williams | 60 | 12 | 7 | 20% | 58% |
| Darcy-Weisbach | 54 | 9 | 5 | 17% | 56% |
| Manning-Pipe-Head-Loss | 63 | 8 | 2 | 13% | 25% |
| Branched-Network | 53 | 5 | 1 | 9% | 20% |
| Weir-Flow-Simple | 62 | 5 | 3 | 8% | 60% |
| Weir-Flow-Irregular | 60 | 3 | 1 | 5% | 33% |
| Irrigation-Pressure | 53 | 2 | 0 | 4% | 0% |
| Rock-Chute | 58 | 2 | 0 | 3% | 0% |
| Orifice | 59 | 1 | 0 | 2% | 0% |
| Orifice-Drain-Time | 57 | 0 | 1 | 0% | n/a |
| index | 108 | 0 | 0 | 0% | n/a |
| privacy / terms / About / Install / Micro-Hydro-Power / Canal-Seepage | 51–57 | 0 | 0 | 0% | n/a |
| sdnet / formmailsuccess | 2 / 1 | 0 | 0 | 0% | n/a |

### Two corrections to the read, before anything else

- **"Position 3" is right**, on this report's own sort (%shopping of reach), once `contact` is set
  aside at n = 3. By shopping alone lpn is 4th (16 against Manning-Irregular's 17 — a tie at this n);
  by using alone, 4th. Every reading puts it 3rd or 4th, up from **6th** on 2026-08-09.
- **"40 humans using" is Manning-Trap's row**, one line above. **Lpn's using is 11.**

### THIS TABLE IS NOT COMPARABLE TO 2026-08-09 OR 2026-08-11

Reach fell by the same factor on every page at once — MPF 2.5%, MTC 2.4%, lpn 2.8%, HW 2.3%,
MI 2.8%, DW 2.5%, CS 2.5% of their 08-09 values. **A uniform 40x on sixteen pages simultaneously is a
change to the denominator, not to the audience**, and %shop-of-reach rising 2–10x on every page at
the same time confirms it: no behavioural story moves sixteen pages together in lockstep.

Two candidate causes, both cheap for Tom to settle and neither yet established:

1. **A shorter window.** The earlier tables may be cumulative-to-date and this one a few days.
2. **The consent buckets.** `ecLogBucketSuffix()` deduplicates consented rows and leaves everyone
   else's marked `visit` and undeduplicated. **CLAUDE.md forbids summing them — one counts people,
   the other counts page loads.** A reach of ~2,000 behaves like page loads and a reach of ~55 like
   people, so a report that changed which bucket it reads would produce exactly this.

**So: no cross-time claim may be made from this table** — not "lpn's conversion rose from 14% to
69%", not "reach collapsed". What survives across time is **rank**, which is what the 2026-08-09
entry already established as the robust statistic here.

### Within the table, comparisons ARE valid, and lpn's news is real

The instrumentation is the shared `js/Calculators.lib.js` and fires identically on every page, so a
difference between two rows of one table is behaviour. Wilson 95% intervals on use-of-shopping:

| page | use/shop | point | Wilson 95% |
|---|---:|---:|---|
| Manning-Pipe-Flow | 121/156 | 78% | [70%, 83%] |
| Manning-Trap | 40/52 | 77% | [64%, 86%] |
| Manning-Irregular | 12/17 | 71% | [47%, 87%] |
| **Looped-Network** | **11/16** | **69%** | **[44%, 86%]** |
| Hazen-Williams | 7/12 | 58% | [32%, 81%] |
| Weir-Flow-Simple | 3/5 | 60% | [23%, 88%] |
| Darcy-Weisbach | 5/9 | 56% | [27%, 81%] |
| Manning-Pipe-Head-Loss | 2/8 | 25% | [7%, 59%] |
| Branched-Network | 1/5 | 20% | [4%, 62%] |

**The defensible claim, and it is a strong one: lpn's interval now OVERLAPS Manning-Pipe-Flow's and
Manning-Trap's.** On 2026-08-09 it did not — 7/51 was [7%, 26%] against a Manning band of 58–70%,
which is what made "worst-converting" tempting and wrong for a different reason. A map editor that is
statistically indistinguishable from a three-field form is the result, and it does not depend on the
broken cross-time comparison.

Against its true peer group (the standing rule: rank complex calculators against each other), lpn
leads Branched-Network 16/11 to 5/1, Irrigation-Pressure to 2/0 and Weir-Flow-Irregular to 3/1, and
ties Manning-Irregular at 17/12. **First or second among the complicated calculators, on a page
shipped 2026-07-30.**

### One confound, checked in code rather than left as a worry

`maybeLogCalcUsage()` fires at the first `runSolve()` **more than 10 s after page load**, once per
page load. **The boot path is safe**: a reopened project calls `scheduleSolve()` at init
(`js/looped-network.js:13697`), which lands ~300 ms in, and the 10 s gate returns *before* setting
the dedupe flag, so a boot solve neither logs nor consumes the slot. A zoom never schedules a solve.

**But automatic recalculation became a setting, default ON, on 2026-08-20 (Task 467) — inside this
window.** It replaced `EC.LPN_TIME_AUTO`'s measured heuristic, which allowed an automatic run only
where the last one stayed under 400 ms. So more user edits now reach `runSolve()` than before on
exactly the networks that used to be excluded. Nobody is being counted who did not edit — but **the
event got easier to trigger on this page during the period being measured**, which is one more reason
the cross-time comparison is unavailable rather than merely noisy.

### The rows worth a second look

- **Manning-Pipe-Head-Loss, 2/8 = 25%, against its sibling Manning-Pipe-Flow's 78%.** Two Manning
  pipe calculators, one audience, and the low one is *simple*, so complexity does not excuse it. n = 8
  and the interval is [7%, 59%], so this is a **watch item, not a finding** — but it is the same shape
  as Task 144 and it is the one place in the suite where two near-identical pages can be diffed.
- **Task 144 (the Hazen-Williams leak) is stated in metrics this table does not use.** Its "580
  confirmed humans, 18% human-of-reach, 11% calculate" is not comparable to this table's 12 shopping
  and 58% use-of-shopping. **Re-derive Task 144 on current definitions before spending anything on
  it**; at priority 25 it is not urgent, and acting on a stale denominator would be.
- **Six calculators returned 5 shoppers and 1 user between them** — Irrigation-Pressure, Rock-Chute,
  Orifice, Micro-Hydro-Power, Canal-Seepage, Orifice-Drain-Time. **This is not a case for cutting
  them** (zero reach ≠ low value, and it never has been here); it is the honest price of the suite's
  breadth, and it is worth stating once so the choice to carry it stays deliberate rather than
  unnoticed.
- **`contact` converted 0 of 3.** n = 3 is nothing. It is logged only because **both of the
  LibreWaterNet landing page's calls to action point at `contact.php`**, so it is the one funnel where
  a small number is worth watching before a launch rather than after.

---

## 2026-08-21 (later) — the 40x scale break EXPLAINED, and the report rebuilt to enforce its own rules

### The bucket question, answered from the code

**The 2026-08-21 table was read from the CONSENTED bucket only. The 2026-08-09 and 2026-08-11
tables were read from every row in the log, because the bucket did not exist yet.** That is the
40x, and it is candidate 2 of the two the entry above offered.

The consent banner and `ecLogBucketSuffix()` shipped in `bd4aeebc`, **2026-08-11**, between the
`lpn` re-read and the 08-21 snapshot. From that commit onward a visitor who has not answered the
banner is logged `source=anon` with a trailing `visit` marker, and **every funnel section of
`log/lang-log-stats.sh` read the filtered visitor copy** — so the whole non-consenting majority,
which is most of the audience, silently left the denominator on every page at once. Nothing
behavioural is needed to explain the uniformity: the filter applies to all sixteen pages equally.

A hand trim of the logs (`dev/scripts/trim_logs.php`, or Tom deleting by hand, which he does) may
have shortened the window as well, and candidate 1 cannot be ruled out after the fact — **because
no report ever printed its window.** That is now fixed rather than argued about.

### What the rebuilt report does about it

`log/lang-log-stats.sh` was rewritten so that the standing rules of this file are arithmetic the
reader cannot skip rather than prose the reader must remember.

- **WINDOW, DURATION and FINGERPRINT print at the top and again at the bottom of every run.** The
  fingerprint is `win=<start>..<end> days=<n> rows=<six counts>`. The script stores the previous
  run's fingerprint in `log/.last-report-window` and **prints it beside this one, with an explicit
  refusal to compare when they differ.** `--days=N` cuts every log to the same window.
- **The two buckets are separate tables with the UNIT in every column heading** — `people` and
  `page loads`. There is **no total row anywhere in the file**, on purpose. The consent share of
  rows is printed once, labelled a rate of ROWS and not of humans, and it is the number that would
  have made the 08-21 break obvious on sight.
- **Every ratio carries a Wilson 95% interval, computed.** A denominator under 40 marks the point
  estimate `~`; under 5 suppresses it entirely and prints only the interval. The legend states the
  test: two rows differ only if their intervals do not overlap.
- **Rank leads the report**, in its own section and nowhere else. **The funnel tables have no rank
  column at all** — a row's position there moves with the sort, and both 08-21 read errors (a
  position read as a rank, a number read off the adjacent row) were position errors.
- **A language section**, in two halves that must not be confused: SERVED (the page was rendered
  in that language) and ASKED FOR (the browser's Accept-Language). The gap between them is a
  discovery defect, not a translation-quality one.
- **A quiet-pages list**, seeded from the reach log so a page with traffic and no shoppers appears,
  and stated once per run as a deliberate cost rather than a case for cutting anything.

### Repeat use: already free, nothing new proposed

The `repeat` signal (Task 200) already answers it and stores nothing new — it reads the page's own
input cookie, or a saved `lpn` project document, both exempt storage that exists anyway. It is
consenting-visitors-only by necessity (an analytics READ is still an analytics access), so it is a
sample and never a total. It now has its own section with a rate against people-bucket shopping.
**No new storage was added or proposed; `consent_body` is untouched and `EC_CONSENT_VERSION` did
not move.**

### FORMAT CHANGE — start a fresh round of logging

`ecLogBucketSuffix()` now writes the bucket column **always, last, and as one of two tokens**:
`visitor` or `visit`. It used to emit the column only for `visit` rows, so a visitor row was
inferred from being SHORT — and the report carried a per-log table of which column index to test
(5, 5, 5, 6, 7), one edit away from silently mixing the buckets, and ambiguous outright on the
signal log whose `detail` column can legitimately be empty. Every reader now tests the LAST field.

Mixed-vintage logs still report correctly (a last field holding neither token is read as a legacy
`visitor` row), so a fresh round is a clean baseline rather than a repair. `trim_logs.php` also
gained `SIGNAL_LOG`, which the retention backstop had never touched.

### Not fixed, and the next task

**`engcalcs-lang.log`'s language column means two different things depending on the row's source.**
`get`/`cookie`/`view` rows carry the language we SERVED; `browser`/`anon` rows carry the raw
Accept-Language tag instead. Since Task 286 the `anon` rows are the majority, so **for most of the
audience the reach log does not record which language we served at all** — the language section can
only answer that question from the two confirmed-human logs. The fix is one line in
`logLanguageSelection()` (`lib/Language.lib.php`): write the served language and the browser tag as
two columns instead of overloading one. It was left alone here only because that file belonged to
another agent's territory during this work.

Also outstanding: **`formmail.php` does not call `ecLogBucketSuffix()`**, so the contact-send log is
the one log with no bucket column. The report handles it explicitly rather than guessing, but a
send row cannot currently be matched to the bucket its click came from.

## 2026-08-21 — Full report immediately after deploying reporting change

===============================================================================
 ENGCALCS USAGE REPORT
===============================================================================
 WINDOW        2026-08-14T11:57:21Z  ..  2026-08-22T23:24:13Z
 DURATION      8.5 days
 FINGERPRINT   win=2026-08-14T11:57:21Z..2026-08-22T23:24:13Z days=8.5 rows=60363/2511/1587/87/4302/1
 PREVIOUS RUN  (none recorded — this is the first run against this log directory)

 Paste the WINDOW and FINGERPRINT lines with any number taken from this report. Two
 snapshots whose fingerprints differ describe different populations: dev/usage-data-log.md
 records a 40x scale break that happened because the window was never stated.

-------------------------------------------------------------------------------
 DEFINITIONS — the four tiers, narrowest last
-------------------------------------------------------------------------------
   reach     a page load recorded in engcalcs-lang.log. INCLUDES CRAWLERS. High reach with
             ~0% shopping is a bot signature, not an audience.
   shopping  a confirmed-human page view: the beacon fires once this browser has been
             around >=10s, whether or not anybody calculates. Window shopping.
   using     a confirmed calculation: a user-triggered recalculation >=10s after load. It
             means 'typed their own numbers', not 'looked at the default answer'.
   naming    a Printable Title or Subtitle was typed — they mean to show it to somebody.

   %shopping = shopping/reach. A LOWER BOUND on human reach, never an estimate of it.
   %using    = using/shopping.
   ~         the denominator is under 40. The number is printed, but it is not a verdict.
   -         the denominator is under 5. No ratio is printed at all.
   [lo-hi]%  Wilson 95% interval. TWO ROWS DIFFER ONLY IF THEIR INTERVALS DO NOT OVERLAP.

-------------------------------------------------------------------------------
 THE TWO BUCKETS — never summed, never in the same table
-------------------------------------------------------------------------------
   people      rows from visitors who agreed to being counted once instead of every time.
               De-duplicated per (visit, page). ONE ROW IS ONE PERSON.
   page loads  rows from everybody else — refused, or has not answered the banner. Nothing
               is stored on their device, so nothing tells their second load from their
               first. ONE ROW IS ONE PAGE LOAD.

   These are different UNITS. Adding them produces a number with no meaning, and a page
   whose non-consenting visitors reload a lot would simply look more popular. There is no
   total row anywhere in this report, on purpose.

   log                                        people   page loads
   engcalcs-lang.log                            1494        58869
   engcalcs-human-view.log                       307         2204
   engcalcs-calc-usage.log                       210         1377
   engcalcs-title.log                             32           55
   engcalcs-signal.log                           847         3455
   engcalcs-contact-send.log                       1 (server-side)

   Consent share of reach rows: 2.5%
   THIS IS A RATE OF ROWS, NOT OF HUMANS, and it is the only bridge between the two
   buckets. Rows written before the consent banner shipped (2026-08-11) are all people
   rows by definition, so the share is understated while any of them remain in the
   window. IF THIS SHARE IS SMALL, the people-bucket tables below describe a small
   minority of the audience — that is the whole of the 2026-08-21 scale break.

===============================================================================
 RANK BY SHOPPING — the statistic that survives a window change
===============================================================================
   dev/usage-data-log.md establishes rank as the robust number here: counts move with the
   window and the consent share, ratios move with n, rank moves with the audience. Read
   this table first, and read the ratio tables below only for within-window comparisons.

   STANDING RULE: rank the complicated calculators against EACH OTHER — Looped-Network,
   Irrigation-Pressure, Branched-Network, Manning-Irregular, Weir-Flow-Irregular — never
   against Manning-Pipe-Flow or Manning-Trap. 'Using' fires after one keystroke on a
   three-field form and after drawing a network on the map, so the ratio is not portable
   across complexity classes.

   rank   page                                 people       page loads
   1      Manning-Pipe-Flow                       164             1741
   2      Manning-Trap                             52              213
   3      Looped-Network                           20               48
   4      Manning-Irregular                        19               38
   5      Hazen-Williams                           12               59
   6      Darcy-Weisbach                            9               16
   7      Manning-Pipe-Head-Loss                    8               34
   8      Weir-Flow-Simple                          7               14
   9      Branched-Network                          5                4
   10     Weir-Flow-Irregular                       3               14
   11     contact                                   3                2
   12     Rock-Chute                                2                4
   13     Irrigation-Pressure                       2                0
   14     Orifice                                   1                9
   15     Orifice-Drain-Time                        0                5
   16     Canal-Seepage                             0                2
   17     Micro-Hydro-Power                         0                1

   Rank is by the people bucket, with the page-load bucket printed beside it so a
   disagreement between the two is visible. They are different units; the ranks are
   comparable, the counts are not.

===============================================================================
 FUNNEL BY PAGE — PEOPLE (consented, de-duplicated: one row = one person)
===============================================================================
   page                           reach  shopping     using  %shopping 95% CI         %using 95% CI
   Manning-Pipe-Flow                177       164       124        93% [88-96]%          76% [69-82]%
   Manning-Trap                      96        52        40        54% [44-64]%          77% [64-86]%
   Looped-Network                    67        20        12        30% [20-42]%         60%~ [39-78]%
   Manning-Irregular                 71        19        14        27% [18-38]%         74%~ [51-88]%
   Hazen-Williams                    63        12         7        19% [11-30]%         58%~ [32-81]%
   Darcy-Weisbach                    58         9         5        16% [8-27]%          56%~ [27-81]%
   Manning-Pipe-Head-Loss            66         8         2        12% [6-22]%          25%~ [7-59]%
   Weir-Flow-Simple                  67         7         3        10% [5-20]%          43%~ [16-75]%
   Branched-Network                  57         5         1         9% [4-19]%          20%~ [4-62]%
   Weir-Flow-Irregular               64         3         1         5% [2-13]%             - [6-79]%
   contact                            3         3         0          - [44-100]%           - [0-56]%
   Rock-Chute                        61         2         0         3% [1-11]%             - [0-66]%
   Irrigation-Pressure               56         2         0         4% [1-12]%             - [0-66]%
   Orifice                           63         1         0         2% [0-8]%              - [0-79]%
   Orifice-Drain-Time                60         0         1         0% [0-6]%            n/a
   index                            117         0         0         0% [0-3]%            n/a
   privacy                           61         0         0         0% [0-6]%            n/a
   Micro-Hydro-Power                 58         0         0         0% [0-6]%            n/a
   terms                             58         0         0         0% [0-6]%            n/a
   About                             57         0         0         0% [0-6]%            n/a
   Install                           56         0         0         0% [0-6]%            n/a
   Canal-Seepage                     55         0         0         0% [0-7]%            n/a
   sdnet                              2         0         0          - [0-66]%           n/a
   formmailsuccess                    1         0         0          - [0-79]%           n/a

   Units: every count in this table is PEOPLE.

===============================================================================
 FUNNEL BY PAGE — PAGE LOADS (everybody else: one row = one page load)
===============================================================================
   Not a smaller or larger version of the table above. A different unit, and for most
   windows the larger population. Do not divide one table by the other.

   page                           reach  shopping     using  %shopping 95% CI         %using 95% CI
   Manning-Pipe-Flow               5504      1741      1144        32% [30-33]%          66% [63-68]%
   Manning-Trap                    3280       213       139         6% [6-7]%            65% [59-71]%
   Hazen-Williams                  3600        59        28         2% [1-2]%            47% [35-60]%
   Looped-Network                  3143        48         5         2% [1-2]%            10% [5-22]%
   Manning-Irregular               2511        38        13         2% [1-2]%           34%~ [21-50]%
   Manning-Pipe-Head-Loss          2513        34        19         1% [1-2]%           56%~ [39-71]%
   Darcy-Weisbach                  2432        16         5         1% [0-1]%           31%~ [14-56]%
   Weir-Flow-Irregular             2388        14         7         1% [0-1]%           50%~ [27-73]%
   Weir-Flow-Simple                2348        14         7         1% [0-1]%           50%~ [27-73]%
   Orifice                         2376         9         5         0% [0-1]%           56%~ [27-81]%
   Orifice-Drain-Time              2353         5         2         0% [0-0]%           40%~ [12-77]%
   Rock-Chute                      2339         4         2         0% [0-0]%              - [15-85]%
   Branched-Network                2241         4         1         0% [0-0]%              - [5-70]%
   Canal-Seepage                   2357         2         0         0% [0-0]%              - [0-66]%
   contact                          199         2         0         1% [0-4]%              - [0-66]%
   Micro-Hydro-Power               2427         1         0         0% [0-0]%              - [0-79]%
   index                           4541         0         0         0% [0-0]%            n/a
   Irrigation-Pressure             2417         0         0         0% [0-0]%            n/a
   About                           2390         0         0         0% [0-0]%            n/a
   privacy                         2354         0         0         0% [0-0]%            n/a
   terms                           2331         0         0         0% [0-0]%            n/a
   Install                         2236         0         0         0% [0-0]%            n/a
   turn                             179         0         0         0% [0-2]%            n/a
   Orifice-Drain-Time-Ref           145         0         0         0% [0-3]%            n/a
   gradlbl                           56         0         0         0% [0-6]%            n/a
   pointsin                          43         0         0         0% [0-8]%            n/a
   fselect                           38         0         0        0%~ [0-9]%            n/a
   proflbl                           34         0         0        0%~ [0-10]%           n/a
   gdd                               26         0         0        0%~ [0-13]%           n/a
   endtick                           15         0         0        0%~ [0-20]%           n/a
   sdnet                             15         0         0        0%~ [0-20]%           n/a
   tip                               15         0         0        0%~ [0-20]%           n/a
   turntheo                          15         0         0        0%~ [0-20]%           n/a
   ddmsw                              8         0         0        0%~ [0-32]%           n/a

   Units: every count in this table is PAGE LOADS.

   NEITHER FUNNEL TABLE CARRIES A RANK COLUMN. Rank is stated once, in its own section
   above. A row's position here moves with the sort, and a position read as a rank — or a
   number read off the row above the one meant — is the mistake dev/usage-data-log.md
   records for 2026-08-21.

===============================================================================
 THE QUIET PAGES — a cost the project carries deliberately
===============================================================================
   Pages that returned almost nothing in this window, both buckets pooled purely to decide
   membership of this list (no count is printed, because a pooled count would be a sum).

   THIS IS NOT AN ARGUMENT FOR CUTTING THEM. Zero reach is a discovery/SEO gap, not a
   value signal, and it never has been one here. It is stated once per run so that the
   choice to carry the suite's breadth stays deliberate rather than unnoticed.

   About
   Canal-Seepage
   ddmsw
   endtick
   formmailsuccess
   fselect
   gdd
   gradlbl
   index
   Install
   Irrigation-Pressure
   Micro-Hydro-Power
   Orifice-Drain-Time-Ref
   pointsin
   privacy
   proflbl
   sdnet
   terms
   tip
   turn
   turntheo

   The page list comes from the REACH log, so a page with traffic and no shoppers appears
   here. A page absent from every log in this window does not — it has no rows to be
   counted by. Cross-check against the calculator list before concluding anything about a
   page you cannot see.

===============================================================================
 LANGUAGE — does anybody use the 26 translations?
===============================================================================
   The suite's deepest recurring spend, and the number that should sequence a translation
   sprint. Two different questions live here and they must not be confused:
     SERVED    which language the page was actually rendered in (column 3 of the human
               logs). This is 'somebody used a translation'.
     ASKED FOR the browser's first Accept-Language tag (column 4). This is 'somebody
               wanted one', and it is true even of visitors who were served English.

   PEOPLE — confirmed-human page views: 307
     served a language other than en                    72  23% [19-29]%
     browser asked for a language other than en         90  29% [25-35]%

   PAGE LOADS — confirmed-human page views: 2204
     served a language other than en                   285  13% [12-14]%
     browser asked for a language other than en        307  14% [13-15]%

   THE GAP BETWEEN THOSE TWO LINES IS THE FINDING. 'Asked for' well above 'served' means
   people who wanted a translation did not get one — a detection or discovery defect, not
   a translation-quality one, and a completely different fix.

--- Language x calculator, confirmed humans, non-English served (PEOPLE) ---
    Every row is a real person: bots essentially never reach either beacon. This is the
    sprint-sequencing view — is anyone showing up on a calculator in a language we
    translated, and do they get as far as computing?

    lang     calculator                   shopping      using    %using 95% CI
    es       Manning-Pipe-Flow                  30         13      43%~ [27-61]%
    es       Manning-Trap                       11          8      73%~ [43-90]%
awk: cmd. line:6: (FILENAME=- FNR=3) warning: sqrt: called with negative argument -0.009584
    es       Hazen-Williams                      5          6     120%~ [-nan-100]%
    es       Manning-Irregular                   3          2         - [21-94]%
    es       Darcy-Weisbach                      3          2         - [21-94]%
    he       Manning-Pipe-Flow                   2          2         - [34-100]%
    fr       Manning-Pipe-Flow                   2          2         - [34-100]%
    fr       Darcy-Weisbach                      2          2         - [34-100]%
    es       Manning-Pipe-Head-Loss              2          0         - [0-66]%
    es       Looped-Network                      2          0         - [0-66]%
awk: cmd. line:6: (FILENAME=- FNR=11) warning: sqrt: called with negative argument -1.0396
    pt       Manning-Trap                        1          2         - [-nan-100]%
awk: cmd. line:6: (FILENAME=- FNR=12) warning: sqrt: called with negative argument -1.0396
    pt       Manning-Pipe-Flow                   1          2         - [-nan-100]%
    zh       Manning-Pipe-Flow                   1          1         - [21-100]%
    pt       Manning-Pipe-Head-Loss              1          1         - [21-100]%
    id       Manning-Trap                        1          0         - [0-79]%
    es       Weir-Flow-Simple                    1          0         - [0-79]%
    es       Rock-Chute                          1          0         - [0-79]%
    es       contact                             1          0         - [0-79]%
    bg       Manning-Pipe-Head-Loss              1          0         - [0-79]%
    ar       Manning-Irregular                   1          0         - [0-79]%
    cs       Orifice-Drain-Time                  0          1       n/a

--- Language demand from the reach log (both buckets, kept apart) ---
    'get' rows are an explicit ?lang=XX choice; 'browser'/'anon' rows carry the raw
    Accept-Language tag; 'cookie' rows are a returning visitor on a saved preference.
    'view' rows are excluded from demand — they would double-count the visit's language.

    language       people   page loads
    en                278        37545
    es                116         3572
    fr                  4          995
    pt                  4          894
    bg                  4          328
    de                  3          401
    cs                  3          341
    ar                  2          392
    zh                  1          925
    he                  1          546
    ro                  1          221
    pl                  1          167
    tr                  0          404
    it                  0          390
    id                  0          341
    ru                  0          338
    km                  0          290
    sw                  0          289
    fa                  0          288
    bn                  0          265
    ur                  0          259
    sr                  0          248
    ps                  0          240
    hi                  0          239
    my                  0          234
    hr                  0          230
    uk                  0          230
    am                  0          223
    sv                  0           93
    fi                  0           68
    ca                  0           67
    nn                  0           67
    el                  0           51
    nl                  0           46
    hu                  0           24
    lt                  0           23
    is                  0           22
    nb                  0           22
    sl                  0           22
    xx                  0            5
    ja                  0            2
    th                  0            2

--- Arrival pattern for non-English humans (bot-dwell check) ---
    A crawler that dwells >=10s trips the shopping beacon and never calculates, which is
    exactly the signature of a language with high shopping and near-zero using. Humans
    spread out. 12 views on 1 day with a burst of 8 is a crawler; 12 over 9 days, burst 1,
    is 12 people.

    lang            views       days      burst
    es                227          9          2
    pt                 34          8          3
    fr                 32          6          2
    he                 19          6          3
    zh                  8          6          1
    it                  5          2          1
    de                  5          2          1
    bg                  5          4          1
    id                  4          2          2
    tr                  3          2          1
    cs                  3          2          1
    hr                  2          1          1
    fa                  2          2          1
    ar                  2          1          1
    ur                  1          1          1
    sw                  1          1          1
    sr                  1          1          1
    ru                  1          1          1
    ro                  1          1          1
    bn                  1          1          1

===============================================================================
 REPEAT USE — the strongest value signal here, and it cost no new storage
===============================================================================
   A row means this browser had already left WORK behind on this page: its own input
   cookie on a calculator, a saved project DOCUMENT on Looped-Network. Both are EXEMPT
   storage that exists anyway, so measuring this stored nothing new and left
   consent_body true. It means USED, not opened — the Looped-Network project index will
   not do, because a first visit writes one before the visitor touches anything.

   ONE STRUCTURAL UNDERCOUNT, not a defect: CONSENTING VISITORS ONLY. Reading exempt
   storage for an analytics purpose is still an analytics access. Treat it as a sample,
   never as a total, and never divide it by a count that includes the page-load bucket.

   page                          people shop   returned   %repeat 95% CI
   Manning-Pipe-Flow                     164         94       57% [50-65]%
   Manning-Trap                           52         25       48% [35-61]%
   Looped-Network                         20          4      20%~ [8-42]%
   Manning-Irregular                      19         17      89%~ [69-97]%
   Hazen-Williams                         12          4      33%~ [14-61]%
   Darcy-Weisbach                          9          1      11%~ [2-44]%
   Weir-Flow-Simple                        7          2      29%~ [8-64]%

===============================================================================
 NAMED CALCULATIONS — they meant to show it to another person
===============================================================================
   The closest instrument this suite has to its own reason for existing. A view says they
   looked, a calculation says they got an answer, a typed title says they intend to put
   the result in front of somebody else. The text typed is never sent and never stored.

   PEOPLE       titles     15   subtitles     17
   PAGE LOADS   titles     32   subtitles     23

--- Named per confirmed calculation, by page (PEOPLE) ---
   page                              calcs      named    %named 95% CI
   Manning-Pipe-Flow                   124          6        5% [2-10]%
   Manning-Trap                         40          3        8% [3-20]%
   Manning-Irregular                    14          4      29%~ [12-55]%
   Looped-Network                       12          0       0%~ [0-24]%
   Hazen-Williams                        7          0       0%~ [0-35]%
   Darcy-Weisbach                        5          0       0%~ [0-43]%
   Weir-Flow-Simple                      3          0         - [0-56]%
   Manning-Pipe-Head-Loss                2          1         - [9-91]%
   Weir-Flow-Irregular                   1          1         - [21-100]%
   Orifice-Drain-Time                    1          0         - [0-79]%
   Branched-Network                      1          0         - [0-79]%

===============================================================================
 CONTACT FUNNEL — invitation clicks -> messages actually sent
===============================================================================
   clicks = confirmed-human views of contact.php. sends = messages formmail.php actually
   mailed, logged server-side in its success branch and NOT de-duplicated, because one
   person writing twice is two messages. The send log has no bucket column, so clicks are
   shown for both buckets and the reader picks the honest denominator.

   invitation clicks (people)              3
   invitation clicks (page loads)          2
   messages sent                           1

   The two causes of a contact drought call for OPPOSITE fixes: few clicks means the
   invitation is invisible (wording and placement are the lever); many clicks and few
   sends means the invitation works and the FORM is the barrier. At these counts neither
   is established — read the pair of raw numbers, not a ratio.

===============================================================================
 WHAT PEOPLE DID NEXT (Tasks 216 and 200)
===============================================================================
   Everything above counts how many. This counts what they then did, and it is never
   divided by anything but a view count.

   ONE CAUTION FOR THE WHOLE SECTION: these rows de-duplicate per PAGE LOAD, in the
   page's own memory, while views and calculations de-duplicate per VISIT against the
   ec_seen cookie — whose five bits are full, and whose sixth would make the consent
   banner's 'a single digit per page' untrue. So a signal count and a people-bucket view
   count are different units. The only place a rate is honest is the PAGE-LOAD bucket,
   where nothing is stored and therefore both sides are page loads. That is why the
   rates below come from that bucket and the people bucket shows raw counts.

--- Signal rows by event ---
    event            people   page loads
    units               340         1795
    touch               276         1452
    repeat              147            0
    outbound             61          199
    lpn                  23            7
    share                 0            2

=== Reference lookups (Task 216) ===
    A click OUT of /engcalcs/. THE ROW THAT MATTERS IS ANY ROW NOT 'en': everything we
    link to is English, so a visitor reading in Spanish who opens an English-only
    roughness table has told us everything a survey would. Feeds Task 217.

    154 www.engineeringtoolbox.com/mannings-roughness-d_799.html
     47 hawsedc.com/frictionslope.php
     10 www.engineeringtoolbox.com/minor-loss-coefficients-pipes-d_626.html
      8 epg.modot.org/files/b/bc/749_Broad-Crested_Weir_Coefficients.pdf
      7 www.engineeringtoolbox.com/froude-number-d_578.html
      7 hawsedc.com/sewslope.php
      6 hawsedc.com/download.php
      5 github.com/hawstom/engcalcs/blob/master/README.md
      4 www.engineeringtoolbox.com/hazen-williams-coefficients-d_798.html
      3 www.engineeringtoolbox.com/orifice-nozzle-venturi-d_590.html
      2 www.youtube.com/watch
      2 hawsedc.com/peakfact.php
      1 www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Ch
      1 www.fhwa.dot.gov/engineering/hydraulics/software/hy8
      1 hawsedc.com/support.php
      1 hawsedc.com/famtree.php
      1 en.wikipedia.org/wiki/Darcy_friction_factor_formulae

--- Reference clicks by served language ---
    224 en
     23 es
     10 fr
      2 it
      1 pt

=== Did they touch anything? (Task 200) ===
    A view with no calculation splits two ways and the two call for opposite fixes:
    somebody who never touched an input could not understand the page; somebody who
    touched it and left tried it and did not want it. Rate from the page-load bucket.

    page                        page loads    touched  %touched 95% CI
    Manning-Pipe-Flow                 1741       1218       70% [68-72]%
    Manning-Trap                       213        142       67% [60-73]%
    Hazen-Williams                      59         29       49% [37-62]%
    Looped-Network                      48          2        4% [1-14]%
    Manning-Irregular                   38         14      37%~ [23-53]%
    Manning-Pipe-Head-Loss              34         18      53%~ [37-69]%
    Darcy-Weisbach                      16          5      31%~ [14-56]%
    Weir-Flow-Simple                    14          7      50%~ [27-73]%
    Weir-Flow-Irregular                 14          7      50%~ [27-73]%
    Orifice                              9          5      56%~ [27-81]%
    Orifice-Drain-Time                   5          2      40%~ [12-77]%
    Rock-Chute                           4          2         - [15-85]%
    Branched-Network                     4          1         - [5-70]%
    contact                              2          0         - [0-66]%
    Canal-Seepage                        2          0         - [0-66]%
    Micro-Hydro-Power                    1          0         - [0-79]%

=== Units actually chosen (Task 200) ===
    Validates EC_DEFAULT_UNIT_SET-by-language and the per-family defaults of Task 162.
    READ THIS TO REORDER OPTIONS, NEVER TO DELETE ONE. An unused option costs a user
    essentially nothing; a missing one costs them the whole calculator.

--- Preset button clicks ---
    240 preset:si
    119 preset:us

--- Preset clicks by served language (a language always clicking US is one this gets wrong) ---
    215 en      preset:si
    112 en      preset:us
     18 es      preset:si
      4 es      preset:us
      2 pt      preset:si
      2 he      preset:si
      1 id      preset:us
      1 id      preset:si
      1 he      preset:us
      1 fa      preset:us
      1 fa      preset:si
      1 bg      preset:si

--- Individual unit selections, by family ---
    378 slope:gradePercent
    228 fraction:depthPercent
    178 flow_channel:lps
    129 distance_small:mm
    119 flow_channel:gpm
     92 distance_small:m
     88 slope:grade
     77 flow_channel:m3ps
     67 fraction:depthFrac
     59 flow_channel:mgd
     50 velocity:mps
     41 flow_area:m2
     37 distance_small:ft
     33 distance_medium:m
     27 stress:npm2
     25 flow_channel:ft3ps
     24 distance_small:in
     22 velocity_head:mh2o
     11 distance_medium:mm
     10 flow_area:mm2
      8 distance_medium:in
      7 partial_head:fth2o
      6 partial_head:bar
      6 flow_pipe:m3ps
      5 partial_head:mh2o
      5 distance_medium:ft
      4 velocity:ftps
      4 flow_pipe:lps
      3 velocity_head:mmh2o
      3 stress:psf
      3 flow_pipe:gpm
      3 flow_channel:mld
      3 flow_area:in2
      3 flow_area:ft2
      2 velocity_head:psi
      2 velocity_head:fth2o
      2 velocity_head:bar
      2 partial_head:psi
      2 flow_pipe:ft3ps
      1 total_head:mh2o

=== Looped-Network: where the map interface loses people (Task 200) ===
    first:  which of the four ways INTO a network the visitor reached for first. This is
            the first evidence bearing on the empty-canvas decision closed 2026-07-29
            with no data: a large first:example share vindicates it, a large 'nothing'
            share overturns it.
    diag:   which pre-solve complaint is actually met. The biggest one names the next
            thing to fix on that page.

      9 first:example
      3 first:import
      3 first:element
      1 first:backdrop

    page loads (page-load bucket)        48
      of those, did something             5
      of those, did NOTHING              43
    'Nothing' is a residual, not a logged event, so it also absorbs anyone who left
    before the page finished loading.

--- Diagnostics met ---
      9 diag:unreachable
      3 diag:not-converged
      2 diag:no-fixed-head

=== Sharing a calculation (Task 228) ===
    'copy' means the clipboard took the link; 'manual' means the browser had none here
    and the link was shown to be copied by hand. A large manual share is a
    browser-support fact, not a failure. NOT MEASURED and not measurable from here:
    whether anybody ever OPENED a shared link — it arrives as an ordinary page view.

      2 copy

===============================================================================
 COVERAGE — each tier began logging on a DIFFERENT date
===============================================================================
   If the calculation log started after the page-view log, %using is understated for
   every row above: some counted shoppers arrived before a calculation could be recorded
   at all. Check these dates before treating any conversion rate as real.

   log                                  rows  first in window       last in window
   engcalcs-lang.log                   60363  2026-08-14T11:57:40Z  2026-08-22T23:24:13Z
   engcalcs-human-view.log              2511  2026-08-14T11:57:50Z  2026-08-22T22:59:28Z
   engcalcs-calc-usage.log              1587  2026-08-14T11:57:21Z  2026-08-22T22:37:09Z
   engcalcs-contact-send.log               1  2026-08-21T14:48:58Z  2026-08-21T14:48:58Z
   engcalcs-title.log                     87  2026-08-14T14:27:01Z  2026-08-22T00:07:27Z
   engcalcs-signal.log                  4302  2026-08-14T11:58:25Z  2026-08-22T22:37:37Z

 WINDOW        2026-08-14T11:57:21Z  ..  2026-08-22T23:24:13Z   (8.5 days)
 FINGERPRINT   win=2026-08-14T11:57:21Z..2026-08-22T23:24:13Z days=8.5 rows=60363/2511/1587/87/4302/1

 Snapshotting into dev/usage-data-log.md: paste the WINDOW and FINGERPRINT lines with
 whatever table you keep. A table pasted without them cannot be compared to anything.

---

## 2026-08-23 — the logs get archived, and exactly one aggregate gets published

Not a snapshot. A change to where these numbers live, recorded here because every future snapshot
in this file is affected by it.

### Where the logs go now

Rotation is `php dev/scripts/archive_logs.php --apply` (dry run by default, like `trim_logs.php`).
It moves the six live logs into **`spock/<YYYY-MM-DD>/`** — *the date is the ENDING date*, the day
they were archived — recreates them empty, verifies the row count before it reports success, and
refuses outright if that directory already exists. `spock` is Tom's name for the directory; the
derivation is in `spock/README.md` and is not a typo.

**A rotation registers itself; a hand-moved archive still works.** `archive_logs.php --apply`
writes `.archive-manifest.json` into the archive it seals — the window, each log's row count, and
the archive it follows — and `trim_logs.php` appends a row to that manifest every time it deletes
from an archive. That is what lets `php dev/scripts/archive_logs.php --verify` say whether a hole in
the record is a quiet stretch, retention doing its job, or something nobody wrote down; it exits 1
only on the last. Hand-moving six files into `spock/2026-08-14/` remains enough to report them —
that has to keep working, because deploying logging to a new location orphans the old set — and such
an archive reads as `derived`: what it shows is all it can prove. **The directory name did not
change and must not**; encoding the window in it orphans everything already on the server and is a
claim no code verifies.

Read one back with `bash log/lang-log-stats.sh --archive=spock/2026-08-14`, or by its ending date
alone, `--archive=2026-08-14`. The report grew a **SOURCE** line naming the archive, printed on the
header and again in the footer, a **PROVENANCE** line saying whether that archive is registered, and its
FINGERPRINT now leads with `src=live` or `src=archive:<name>`. **A fingerprint pasted into this
file without an `src=` prefix predates 2026-08-23 and is a live run by definition.** Each archive
keeps its own `.last-report-window`, so PREVIOUS RUN never compares an archive against the live
logs — the exact shape of the 40x scale break above.

`dev/scripts/trim_logs.php` now walks `spock/*/` as well. **It did not before**, so before this
change an archived log was data the 26-month promise in `privacy.php` never reached. Moving a file
does not change what the page told the visitor about it.

### What is published, and what is not

Tom offered to publish everything, raw logs included, and deferred the judgement. **The raw logs
stay private; one aggregate report is served.**

The content is close to harmless, verified writer by writer rather than assumed: none of the six
records `REMOTE_ADDR`, `HTTP_USER_AGENT`, a session id, or anything a visitor typed. A row is a
timestamp, a page, a language, a source and a bucket, and every visitor-supplied column goes
through `ecBrowserLangTag()` or an explicit allowlist first.

**But publishing is a promise question, not a content question.** `privacy.php` does not say
"published on the web", so publishing per-event rows changes the deal even though each row is
benign — and CLAUDE.md prices that change: a `consent_body` rewrite, 26 retranslations, and an
`EC_CONSENT_VERSION` bump that re-asks everybody. It is also irreversible once indexed. An
aggregate report changes no promise, so that is what gets served.

`sh dev/scripts/publish_usage_report.sh` writes `spock/reports/usage-<date>.txt` plus a stable
`usage-latest.txt` (both denied over HTTP) and one served copy under `spock/public/` at an
unguessable filename. The served copy truncates **every timestamp to its date** and tags its
fingerprint `redacted=date`, so a published copy and a private one can never be pasted here as the
same run. It is not in `robots.txt` — a `Disallow` line publishes the very name it protects — and
carries `<meta name="robots" content="noindex">` instead.

### Running this on a schedule

**Nothing here is enabled.** Tom asked on 2026-08-23 whether reporting could run on a server cron;
this is the recipe, not a switch that has been thrown. The repo contains no cron entry and this
section does not create one.

The whole point of a schedule is that the ROTATION is the part a human forgets, and a forgotten
rotation is the exact mechanism behind the 40x scale break recorded above — one ever-growing window
with nothing to compare it to.

```cron
# EngCalcs usage logs. Times are the server's local time; the archive is named in UTC.
# Adjust the two paths to the real checkout.
MAILTO=your-address@example.com
ENGCALCS=/home/USER/public_html/engcalcs

# Weekly: refresh the aggregate report. THIS IS WHAT PUBLISHES: the grant in
# spock/public/.htaccess has been ON since 2026-08-23, so each run replaces what the
# published URL serves. Until it runs on production that URL is a 404 with the door open.
10 0 * * 1  cd $ENGCALCS && sh dev/scripts/publish_usage_report.sh >/dev/null

# Monthly: snapshot the window that is about to close, THEN rotate. In this order, or the
# live window's own report is lost the moment the logs move.
5 0 1 * *   cd $ENGCALCS && sh dev/scripts/publish_usage_report.sh >/dev/null && php dev/scripts/archive_logs.php --apply

# Monthly, the day after: the 26-month retention backstop, across the live logs and every archive.
5 1 2 * *   cd $ENGCALCS && php dev/scripts/trim_logs.php --apply

# Daily: audit the chain. stdout is discarded, so cron mails only when --verify finds a hole in
# the record that nothing accounted for -- that is the whole design of its exit code.
0 6 * * *   cd $ENGCALCS && php dev/scripts/archive_logs.php --verify >/dev/null
```

**Why monthly for the rotation.** A month is the shortest window that regularly clears the report's
own small-n floor of 40, so each archive is a window worth comparing on its own. Weekly would give
52 directories a year of mostly unreadable ratios; quarterly would starve the comparison the
rotation exists to enable and leave a lost quarter costing three months instead of one.

**Why the audit is daily and everything else is not.** Reading is free and finding a hole late is
not. The three writing entries change data and are deliberately infrequent.

Two cautions before pasting. The host may not offer cron at all on a shared plan — check
`crontab -l` first. And `archive_logs.php` refuses a second rotation on the same UTC date, so a
manual rotation on the 1st makes that night's cron entry exit 1 and mail its refusal; that is the
guard working, not a fault.

---

## 2026-09-03 — the first PUBLISHED run, and it moves the Rung 0 placement

```
WINDOW        2026-08-23  ..  2026-09-03            (10.5 days)
FINGERPRINT   src=live win=2026-08-23..2026-09-03 days=10.5
              rows=82730/3680/2401/155/7079/1 redacted=date
```

**How this one was obtained, which is new.** `publish_usage_report.sh` ran on production for the
first time on 2026-09-03 — the script shipped 2026-08-23 with its grant already on, and nobody had
ever run it there, so the URL had been a 404 with the door open for eleven days. It is now readable
from a session, which is the point: no snapshot has to be pasted by hand again.

**Two housekeeping facts found in the same pass.** Production is
`~/addon_html/hawsedc.com/engcalcs` (`dev/hosting-layout.md` said `~/public_html/hawsedc/engcalcs`,
which does not exist there and is now corrected). And the two archives were sitting in
`log/<date>/` rather than `spock/<date>/`, where `trim_logs.php` — the only thing enforcing
`privacy.php`'s 26-month promise — cannot see them. Moved; `--verify` now says every archive is
accounted for.

### Looped-Network, and the correction it forces

| | 2026-08-21 reading | this window |
|---|---|---|
| opening moves | 9 example, 3 import, 3 element, 1 backdrop | **17 example, 3 element, 0 import** |
| diagnostics met | 9 unreachable, 3 not-converged, 2 no-fixed-head | **2 no-fixed-head, 1 unreachable** |
| page loads doing nothing | 43 of 48 | **13 of 26** |

**The two windows are different populations and no trend may be read across them.** What survives
is a statement about THIS window, and it is enough to overturn a placement decision: **the
diagnostic box was met three times in ten and a half days.** A grievance link that lives only there
would be offered to about one person a week.

- **`first:import` was ZERO.** The August reading's "one visitor in five arrives with an EPANET
  model" was 3 of 16 in a small window and did not repeat. Do not build for that population on this
  evidence.
- **17 of 20 opening moves are the example network**, which is the first evidence for the
  empty-canvas decision closed 2026-07-29 with none. It vindicates it.
- **The strongest lpn number in the report is repeat use: 8 of 23 shoppers came back to a saved
  project.** That is third behind Manning-Trap's 59% and Manning-Pipe-Flow's 48%, in the one
  statistic that means somebody left work behind and returned to it. Whatever this page is failing
  to do, holding the people who commit to it is not it.
- Rank 4 of 16 by shopping (23 people); 8 of 23 used it; 15% of page loads touched anything.
- **Still no naming instrument.** 8 confirmed lpn calculations and `n/a — no title field`, because
  a tab rename, a project save and a Text object are unlogged. The report says so itself and cannot
  infer it away.

**Where a grievance link goes, given all that: not gated on an error.** The logs did their job by
RULING A PLACEMENT OUT rather than by picking one — three diagnostics cannot rank anything. The
surface every lpn visitor actually meets is the map itself, opened on the example network. Design
record: `dev/dilettante-path.md`.

**One number outside lpn, because it is the largest behavioural signal in the report:** 210 outbound
clicks to Engineering ToolBox's Manning roughness table, against 70 to `hawsedc.com/frictionslope.php`.
That is Task 216's instrument answering Task 217's question at a volume nothing else here reaches.
