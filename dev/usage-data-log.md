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
