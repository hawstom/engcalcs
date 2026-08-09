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
