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
