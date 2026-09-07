# What the logs tell us, as of 2026-09-06

A statement of what this project's usage instrumentation actually knows today, and what it does
not. Written from `lib/config.inc.php`, the six log writers, `dev/usage-data-log.md`, the local
`log/` directory, `log/lang-log-stats.sh`, and the retention scripts. Every number below names the
file it came from.

This file is a READING, not a snapshot. The snapshots live in `dev/usage-data-log.md` and are never
edited; this one may be rewritten whenever the reading changes.

---

## 1. What we measure

Six logs, all tab-separated, all beginning with an ISO-8601 UTC timestamp, all defined in
`lib/config.inc.php` and all written with `FILE_APPEND | LOCK_EX`.

| Tier | Log | Written by | An entry means |
|---|---|---|---|
| **reach** | `engcalcs-lang.log` | `logLanguageSelection()`, `lib/Language.lib.php` | A page load. **Includes crawlers.** High reach with near-zero shopping is a bot signature, not an audience. |
| **shopping** | `engcalcs-human-view.log` | `log-human-view.php`, beacon from `EngCalcs.maybeLogHumanView()` | A confirmed-human view. Fires once the *session* (not the page) is at least 10 s old, whether or not anybody calculates. Window shopping. |
| **using** | `engcalcs-calc-usage.log` | `log-calc-event.php`, beacon from `EngCalcs.maybeLogCalcUsage()` | A confirmed calculation: a **user-triggered recalculation at least 10 s after page load**. It means "typed their own numbers", never "looked at the default answer". |
| **naming** | `engcalcs-title.log` | `log-title-event.php` | A Printable Title or Subtitle was typed. The visitor intends to put the result in front of another person. The text itself is never sent and never stored. |
| **sends** | `engcalcs-contact-send.log` | `formmail.php`, server-side in its `mail()` success branch | A message was actually mailed. Server-side deliberately: a beacon from the submit handler races the navigation and could only count attempts. |
| **signals** | `engcalcs-signal.log` | `log-signal-event.php`, from `EngCalcs.logSignal()` | One of six diagnostics in an event column: `outbound`, `touch`, `units`, `repeat`, `lpn`, `share`. |

What a row does **not** contain, checked writer by writer: no `REMOTE_ADDR`, no `HTTP_USER_AGENT`,
no `HTTP_REFERER`, no session id, and nothing the visitor typed. `formmail.php` reads the referer,
but only to check a same-site claim; it does not log it. A row is a timestamp, a page, a language,
sometimes an event, and a bucket.

### The two buckets, and the standing warning

`ecLogBucketSuffix()` (`lib/config.inc.php:560`) appends one of two tokens as the **last** field of
every row:

| Bucket | Who | Unit |
|---|---|---|
| `visitor` | Agreed to being counted once instead of every time. De-duplicated per (visit, page) against the five bits of the `ec_seen` cookie. | **One row is one person.** |
| `visit` | Refused, or has not answered the banner. Nothing is stored on their device, so nothing tells a second load from a first. | **One row is one page load.** |

**THE TWO BUCKETS ARE NEVER SUMMED AND NEVER APPEAR IN THE SAME TABLE.** They are different units;
adding them yields a number with no meaning, and a page whose non-consenting visitors reload a lot
would simply look more popular. `log/lang-log-stats.sh` prints them as separate tables with the
unit in every column heading and carries no total row anywhere, on purpose.

Three further mechanics that bound every number here:

- **De-duplication differs between tiers.** Views, calculations and titles dedupe per *visit* using
  one base-32 digit per page in `ec_seen`. The six signal events dedupe per *page load*, in the
  page's own memory, because a sixth bit would make the consent banner's "a single digit per page"
  untrue. So a signal count and a people-bucket view count are different units, and the report only
  states signal *rates* in the page-load bucket, where both sides are page loads.
- **The `repeat` signal is consenting visitors only**, by necessity: reading exempt storage for an
  analytics purpose is still an analytics access. It is a sample, never a total.
- **`?ec_nolog=1` suppresses a browser at write time** in every writer (`ecLoggingOptedOut()`).
  It is per-device and must be set in each browser used for hand-testing.

### Retention and where the record goes

`dev/scripts/archive_logs.php --apply` rotates the six live logs into `spock/<YYYY-MM-DD>/`, named
by the **ending** date, and seals a `.archive-manifest.json`. `dev/scripts/trim_logs.php` deletes
rows older than **26 months**, across the live logs *and* every archive, which is what
`privacy.php` promises. `--verify` audits the chain and exits 1 only on a hole nobody accounted
for. Per `dev/usage-data-log.md` (2026-09-03) the chain on production then read **2026-07-28 ..
2026-09-03 across three archives, 260,044 rows, contiguous**, with 2026-09-03 the first archive
that is `rotated` rather than `derived`.

---

## 2. What we know

Every finding below carries the date and the source it came from. Counts and ratios move with the
window and with the consent share; **rank is the statistic that survives a window change**, which
is why the trend tables here are rank tables.

### 2a. The audience is extremely concentrated, and has been at every reading

Source: `dev/usage-data-log.md`, 2026-07-27 snapshot (supplied by Tom).

| page | reach | human | used | %human of reach | %used of human |
|---|---:|---:|---:|---:|---:|
| Manning-Pipe-Flow | 5772 | 2721 | 1829 | 47% | 67% |
| Hazen-Williams | 3243 | 580 | 63 | 18% | 11% |
| Manning-Trap | 3347 | 414 | 254 | 12% | 61% |
| Manning-Irregular | 1572 | 86 | 44 | 5% | 51% |
| Darcy-Weisbach | 1764 | 67 | 25 | 4% | 37% |
| Manning-Pipe-Head-Loss | 1633 | 43 | 25 | 3% | 58% |
| Irrigation-Pressure | 3935 | 46 | 2 | 1% | 4% |
| Weir-Flow-Simple | 1530 | 18 | 10 | 1% | 56% |
| Weir-Flow-Irregular | 1584 | 17 | 10 | 1% | 59% |
| Orifice | 1805 | 15 | 2 | 1% | 13% |
| Rock-Chute | 1921 | 15 | 2 | 1% | 13% |
| Micro-Hydro-Power | 1879 | 6 | 1 | 0% | 17% |
| Orifice-Drain-Time | 1652 | 6 | 0 | 0% | 0% |
| Canal-Seepage | 1746 | 6 | 0 | 0% | 0% |
| Branched-Network | 473 | 2 | 2 | 0% | 100% |

Total human views about 4,042. **Manning-Pipe-Flow alone is 67% of it; MPF plus Hazen-Williams
plus Manning-Trap is 92%.** A UX change on any page outside the top three is seen by a rounding
error. That concentration has held at every later reading.

### 2b. There is a stable conversion band, and the outliers are the signal

At the 2026-07-27 reading six pages sat tightly at **51–67% used-of-human** (MPF, MTC, MI, MPHL,
WFS, WFI). The outliers were Hazen-Williams 11%, Irrigation-Pressure 4%, Orifice 13%, Rock-Chute
13%, Orifice-Drain-Time 0%, Canal-Seepage 0%.

**Hazen-Williams remains the biggest single leak on record**: 580 humans converting at 11%, roughly
517 humans per period arriving and never calculating, which is about five times more lost humans
than exist on every page below Manning-Trap combined. Its cause is undiagnosed. The leading
hypothesis on file is that HW is a single-line calculator and these visitors arrive with a
*network*. **That figure is stated in metrics no current report uses** — the 2026-08-21 rebuild
measures %use-of-shopping, not %used-of-human — so Task 144 must be re-derived on current
definitions before anything is spent on it.

**High reach plus near-zero human is crawlers.** Irrigation-Pressure had the highest reach in the
suite (3,935) and 46 humans. Reach was not a discriminator at the 2026-08-09 reading either: 14 of
16 pages sat between 1,446 and 2,606 regardless of downstream performance.

### 2c. Rank over time, which is the only comparison the record permits

Sources: `dev/usage-data-log.md` entries of 2026-08-09, 2026-08-11, 2026-08-21 and 2026-09-03.
`Looped-Network` shipped 2026-07-30.

| reading | window stated? | lpn rank by shopping | lpn shopping | lpn using |
|---|---|---|---:|---:|
| 2026-08-09 | no | 6 of 16 | 51 | 7 |
| 2026-08-11 | no | 6 of 16 | 58 | 10 |
| 2026-08-21 | 2026-08-14 .. 2026-08-22 (8.5 d) | 3 of 17 (people bucket) | 20 | 12 |
| 2026-09-03 | 2026-08-23 .. 2026-09-03 (10.5 d) | 4 of 16 | 23 | 8 |

**The counts in that table may not be compared across rows and the rank may.** The reason is
recorded twice in `dev/usage-data-log.md` and is settled: the 2026-08-09 and 2026-08-11 readings
counted every row in the log because the bucket column did not exist yet; the consent banner and
`ecLogBucketSuffix()` shipped in `bd4aeebc` on 2026-08-11, and from then on every funnel section of
the report read the consented copy only. Reach then fell by the same factor on all sixteen pages at
once — MPF 2.5%, MTC 2.4%, lpn 2.8%, HW 2.3%, MI 2.8%, DW 2.5%, CS 2.5% of their 08-09 values.
**A uniform 40x across sixteen pages simultaneously is a change to the denominator, not to the
audience.** No behavioural story moves sixteen pages in lockstep.

The consequence is a rule the report now enforces in arithmetic rather than in prose: it prints its
WINDOW, DURATION and FINGERPRINT at the top and the bottom of every run, stores the previous run's
fingerprint in `log/.last-report-window`, and refuses to compare two runs whose fingerprints differ.

**What is defensible about lpn across these readings**: it is 3rd or 4th of 16 by shopping, up from
6th, on a page shipped 2026-07-30 competing with pages years older; and at the 2026-08-21 reading
its use-of-shopping interval [44%, 86%] **overlaps Manning-Pipe-Flow's [70%, 83%] and
Manning-Trap's [64%, 86%]**, which it did not on 2026-08-09. A map editor statistically
indistinguishable from a three-field form is the result.

### 2d. The 2026-08-21 window in full, people bucket

Source: `dev/usage-data-log.md`, report of `win=2026-08-14T11:57:21Z..2026-08-22T23:24:13Z days=8.5
rows=60363/2511/1587/87/4302/1`. **Consent share of reach rows: 2.5%** — a rate of rows, not of
humans, and the number that makes the scale break obvious on sight.

| page | reach | shopping | using | %shopping 95% CI | %using 95% CI |
|---|---:|---:|---:|---|---|
| Manning-Pipe-Flow | 177 | 164 | 124 | 93% [88-96] | 76% [69-82] |
| Manning-Trap | 96 | 52 | 40 | 54% [44-64] | 77% [64-86] |
| Looped-Network | 67 | 20 | 12 | 30% [20-42] | 60% [39-78] |
| Manning-Irregular | 71 | 19 | 14 | 27% [18-38] | 74% [51-88] |
| Hazen-Williams | 63 | 12 | 7 | 19% [11-30] | 58% [32-81] |
| Darcy-Weisbach | 58 | 9 | 5 | 16% [8-27] | 56% [27-81] |
| Manning-Pipe-Head-Loss | 66 | 8 | 2 | 12% [6-22] | 25% [7-59] |
| Weir-Flow-Simple | 67 | 7 | 3 | 10% [5-20] | 43% [16-75] |
| Branched-Network | 57 | 5 | 1 | 9% [4-19] | 20% [4-62] |

**Manning-Pipe-Head-Loss at 2 of 8 against its sibling Manning-Pipe-Flow at 76% is a watch item,
not a finding** — n is 8 and the interval runs to 59% — but it is the one place in the suite where
two near-identical pages can be diffed, and the low one is the *simple* one, so complexity does not
excuse it.

### 2e. Languages: the translations are used, and the served/asked gap is the finding

Source: 2026-08-03 snapshot, the first non-English confirmed-human reading. **290 non-English
humans shopping, 170 using, 59% conversion** — the same band as the suite overall. This was not the
expected result; the section had been written expecting an empty table.

| lang | shopping | using | rate |
|---|---:|---:|---:|
| es | 186 | 116 | 62% |
| pt | 30 | 15 | 50% |
| fr | 23 | 14 | 61% |
| tr | 17 | 11 | 65% |
| zh | 12 | 2 | **17%** |
| he | 10 | 6 | 60% |

**`zh` is the one real anomaly** — 17% against a 50–65% band, on Manning-Pipe-Flow, its only page.
The cheap explanations were eliminated: no missing keys, identity strings correct, unit tokens
translated, `EC_DEFAULT_UNIT_SET` correct, and Tom read and back-translated the page and found
nothing. The bot hypothesis was refuted by the arrival pattern: 13 views over 6 days, maximum one
view in any minute, which is *more* human-shaped than `es`. A **pre-registered test** was recorded
so the next look costs nothing statistically: at n = 30 views, `using` at or below 13 is real and at
or above 16 is noise. Do not spend on `zh` before then.

At the 2026-08-21 reading the served-versus-asked split was:

| bucket | confirmed-human views | served non-en | browser asked non-en |
|---|---:|---:|---:|
| people | 307 | 72 (23% [19-29]) | 90 (29% [25-35]) |
| page loads | 2204 | 285 (13% [12-14]) | 307 (14% [13-15]) |

**The gap between those two columns is the finding**: people who wanted a translation and did not
get one. That is a detection or discovery defect, not a translation-quality one, and a completely
different fix. In the same window nine languages had confirmed non-English human shopping on at
least one calculator, and `es` was the only one spread across more than three pages.

Per-language human reach measured 2026-07-21 (en about 83%, es about 10%, then a tail at or below
1%) still drives the reach-weighted QA section of `dev/translation-process.md`. The anchor set
moved to `es, pt, fr, tr` on this evidence, because `ru` has **1 measured human** and `ar` has
**0**, and an anchor nobody can observe is a weak reference point. The standing rule holds
unchanged: **zero reach is a discovery gap, not low value.**

### 2f. Behaviour: what people did after they arrived

Source: 2026-08-21 report, page-load bucket for rates.

| signal | people | page loads |
|---|---:|---:|
| units | 340 | 1795 |
| touch | 276 | 1452 |
| repeat | 147 | 0 (consenting only, by necessity) |
| outbound | 61 | 199 |
| lpn | 23 | 7 |
| share | 0 | 2 |

**Touched anything, page-load bucket**: Manning-Pipe-Flow 70% [68-72], Manning-Trap 67% [60-73],
Hazen-Williams 49% [37-62], **Looped-Network 4% [1-14]**, Manning-Irregular 37%, Darcy-Weisbach
31%. The lpn figure separates "could not understand it" from "did not want it" and points hard at
the former; by the 2026-09-03 reading it was 15% of page loads.

**Reference lookups are the largest behavioural signal in the suite.** In the 2026-08-21 window,
154 clicks to Engineering ToolBox's Manning roughness table against 47 to
`hawsedc.com/frictionslope.php`; by the 2026-09-03 window, **210 against 70**. Reference clicks by
served language in the 2026-08-21 window: en 224, es 23, fr 10, it 2, pt 1 — and a non-English
visitor opening an English-only roughness table is a complete signal in itself (Task 216 feeding
Task 217).

**Unit presets, 2026-08-21 window**: 240 `preset:si` against 119 `preset:us`; within English, 215
SI against 112 US. Individual selections lead with `slope:gradePercent` 378,
`fraction:depthPercent` 228, `flow_channel:lps` 178, `distance_small:mm` 129. **Read this to
reorder options, never to delete one**: an unused option costs a user essentially nothing, and a
missing one costs them the calculator.

**Repeat use — somebody left work behind and came back**, 2026-08-21, people bucket only:
Manning-Pipe-Flow 94 of 164 (57%), Manning-Trap 25 of 52 (48%), Manning-Irregular 17 of 19 (89%),
Looped-Network 4 of 20 (20%), Hazen-Williams 4 of 12 (33%). At the 2026-09-03 reading lpn was
**8 of 23 shoppers returning to a saved project**, third behind the two Manning pages. Whatever
that page fails to do, holding the people who commit to it is not it.

### 2g. Looped-Network's own two readings, side by side

Source: 2026-08-21 and 2026-09-03 entries. **Different populations; no trend may be read across
them.** They are placed together because each is a statement about its own window and the pair
ruled out a design placement.

| | 2026-08-21 window | 2026-09-03 window |
|---|---|---|
| opening moves | 9 example, 3 import, 3 element, 1 backdrop | **17 example, 3 element, 0 import** |
| diagnostics met | 9 unreachable, 3 not-converged, 2 no-fixed-head | **2 no-fixed-head, 1 unreachable** |
| page loads doing nothing | 43 of 48 | 13 of 26 |

- **`first:import` was zero in the later window.** The earlier "one visitor in five arrives with an
  EPANET model" was 3 of 16 and did not repeat. Do not build for that population on this evidence.
- **17 of 20 opening moves were the example network**, the first evidence bearing on the
  empty-canvas decision closed 2026-07-29 with none. It vindicates it.
- **The diagnostic box was met three times in ten and a half days.** A grievance link living only
  there would be offered to about one person a week, which is what ruled that placement out.

### 2h. Naming, and the contact funnel

Named calculations, 2026-08-21, people bucket: 15 titles and 17 subtitles across the whole window.
Per confirmed calculation: Manning-Pipe-Flow 6 of 124 (5% [2-10]), Manning-Trap 3 of 40 (8%
[3-20]), Manning-Irregular 4 of 14 (29% [12-55]), **Looped-Network 0 of 12**. The lpn zero is not a
behavioural finding: **that page has no naming instrument at all**, because a tab rename, a project
save and a Text object are unlogged. At 2026-09-03 the report printed `n/a — no title field`
against 8 lpn calculations.

Contact funnel, 2026-08-21: **3 invitation clicks (people), 2 (page loads), 1 message sent.** At
these counts neither cause of a contact drought is established, and the two call for opposite
fixes — few clicks means the invitation is invisible, many clicks and few sends means the form is
the barrier. Read the pair of raw numbers, never a ratio. Both LibreWaterNet landing-page calls to
action point at `contact.php`, which is why so small a number is worth watching at all.

### 2i. Search demand, from outside the logs

Source: Search Console export, 2026-07-27 — 999 queries, 5,621 impressions, 565 clicks
(`dev/Queries.csv`, not committed; these numbers are the durable record).

| cluster | queries | impressions | clicks | CTR |
|---|---:|---:|---:|---:|
| Manning | 196 | 1468 | 366 | **25%** |
| Sewer / drainage | 188 | 1007 | 11 | **1.1%** |
| Slope / grade / fall | 169 | 946 | 5 | **0.5%** |
| Hazen-Williams | 54 | 305 | 16 | 5% |
| Channel / trapezoid | 51 | 377 | 18 | 5% |
| Darcy / friction factor | 41 | 128 | 1 | 0.8% |

**Manning is won and needs nothing** at position 1 and 25% CTR. The sewer-slope cluster is
comparable in size and converts at 1%. Also on file: 55 queries are LLM-retrieval-shaped (`… source`,
`… pdf`), all circling one question — is Manning valid for full or pressurised pipe, and is
R = D/4 — for 118 impressions and zero clicks.

---

## 3. What we do NOT know

Each of these is derived from the instrumentation, not guessed. They are blind spots by
construction, not gaps somebody forgot to fill.

- **What device, screen or pointer anybody uses.** `log-human-view.php` and `log-calc-event.php`
  record page and language and nothing else; no writer touches `HTTP_USER_AGENT`. **There is no
  device signal anywhere in this project.** ROADMAP Task 285 states it plainly, and Tom, 2026-08-11:
  *"we don't know whether anybody uses this on a phone."* Every touch-target, breakpoint and
  two-pane-layout argument ever made here rests on a guess. It is not a small guess:
  "touch-friendly" is load-bearing in the suite's own conventions.
- **Whether the lpn page is used by anyone but Tom.** Nothing in a row distinguishes one visitor
  from another. `?ec_nolog=1` is the only exclusion and it is per-browser, so a browser he has not
  marked is counted like anybody else's. The 2026-09-03 lpn repeat-use figure of 8 of 23 is the
  closest thing to evidence of outside commitment, and it still cannot name a person.
- **New versus returning, for most of the audience.** Only the consented bucket carries any
  de-duplication at all; for everybody else nothing is stored, so a second load is
  indistinguishable from a first. The `repeat` signal is consenting visitors only for the same
  reason. Consent share of reach rows in the 2026-08-21 window was **2.5%**.
- **Session depth and the path through the suite.** There is no session and no identifier by
  design (Task 288). De-duplication is five bits per page in `ec_seen`, which answers "have we
  counted this" and nothing else. No row can be joined to another row, so "they tried MPF then
  Hazen-Williams" is unanswerable.
- **Where visitors come from.** No referrer is logged. Search Console is a separate instrument and
  the only export on file is 2026-07-27; nothing in the logs says whether a visit came from search,
  a link, or a bookmark.
- **Which language most of the audience was actually served.** `engcalcs-lang.log`'s language
  column means two different things by row source: `get`, `cookie` and `view` rows carry the
  language we **served**, while `browser` and `anon` rows carry the raw Accept-Language tag. Since
  Task 286 the `anon` rows are the majority, so **for most of the audience the reach log does not
  record which language we served at all.** The fix is one line in `logLanguageSelection()`.
- **Whether a shared link was ever opened.** The `share` signal says the control was used, `copy`
  or `manual`. An opened link arrives as an ordinary page view and nothing distinguishes it.
- **Whether anybody names an lpn calculation.** No instrument exists on that page, per 2h.
- **Why Hazen-Williams leaks**, per 2b, and why Manning-Pipe-Head-Loss underperforms its sibling.
  Both are undiagnosed and the HW figure is stated in retired metrics.
- **Whether a quiet page is quiet because nobody wants it or because nobody can find it.** The
  report lists the quiet pages once per run and states explicitly that this is not an argument for
  cutting them. Zero reach is a discovery gap.
- **`zh`, still**, until the pre-registered n = 30 arrives.

---

## 4. What the local `log/` files are

**They are a developer machine's own traffic, and they are not an audience.** Nothing in this
directory should ever be quoted as usage. Measured on 2026-09-06 with `awk -F'\t'`, `sort` and
`uniq -c` over the three files present:

| file | rows | first row | last row |
|---|---:|---|---|
| `engcalcs-lang.log` | **1057** | 2026-06-22T07:55:14Z | 2026-08-17T20:57:04Z |
| `engcalcs-human-view.log` | **7** | 2026-07-29T21:23:18Z | 2026-07-31T07:49:07Z |
| `engcalcs-contact-send.log` | **0** (empty file, 0 bytes) | — | — |

`engcalcs-calc-usage.log`, `engcalcs-title.log` and `engcalcs-signal.log` **do not exist here at
all**, so three of the six tiers are simply absent.

Six things mark the lang log as a development machine rather than a site:

1. **837 of its 1,057 rows fall on one day**, 2026-08-08, and 201 of them land in a single minute
   (07:09Z), with another 201 in the next.
2. **122 rows name the page `Standard input code`**, which is what `php://stdin` produces — a CLI
   render, not a request.
3. **427 rows are `source=get`**, an explicit `?lang=XX` selection, against only **20 `anon`** rows.
   A real audience is mostly `anon`; a language-switching test loop is mostly `get`.
4. **The language column holds `*` 188 times, `xx` 55 times and the empty string 63 times**, none of
   which is a browser preference.
5. **Every one of the 26 translated languages appears 10 to 15 times**, which is the shape of a
   sweep and not of demand.
6. **The human-view log is 7 rows, all `Looped-Network`**, six of them inside ten minutes on
   2026-07-31.

The two report artifacts in this checkout are dry runs over exactly these files, not production
output: `spock/reports/usage-2026-08-23.txt` and `usage-latest.txt` both carry
`FINGERPRINT src=live win=2026-06-22T07:55:14Z..2026-08-17T20:57:04Z days=56.5 rows=1057/7/0/0/0/0`,
and `spock/public/usage-6189c17caf18ab3682420140e466af5d.html` is the same run with timestamps
truncated to their dates. `log/.last-report-window` holds that same fingerprint.

**Staleness**: the newest row in this directory is 2026-08-17, which is before the 2026-08-21
report rebuild and before the 2026-08-23 archiving change. Production has rotated twice since.
Every real number in section 2 came from `dev/usage-data-log.md`, which is where snapshots of
production live; the honest way to read current production is
`sh dev/scripts/publish_usage_report.sh` on the server, or its published URL, which has been live
since it first ran there on 2026-09-03.

---

## 5. What would be cheapest to learn next

Ranked by cost against the decision each would change. Task 285's own reasoning governs the first
one and generalises to the rest: **decide what the answer would change before collecting it, and
keep the signal coarse.**

**1. A coarse pointer or viewport bucket on the existing beacon.** *(ROADMAP Task 285, priority 50.)*
Cost: one extra field on `log-human-view.php` and `log-calc-event.php`, `pointer: coarse|fine` from
a media query or a viewport-width band. It stores nothing on the device, so `consent_body` stays
true, `EC_CONSENT_VERSION` does not move, and no retranslation is bought. A full user-agent string
is fingerprinting-grade on a suite that offers an opt-out and means it; do not collect one.
Decision it changes: **"almost nobody" means we stop paying for phone-shaped compromises on `lpn_`
specifically, which is a design freedom rather than a disappointment; "a third of them" makes
several open tasks much more urgent.** Add the reading to `dev/usage-data-log.md` as its own tier,
never folded into reach, shopping or using.

**2. Split the overloaded language column in `logLanguageSelection()`.** Cost: one line in
`lib/Language.lib.php`, writing the served language and the browser tag as two columns instead of
one. It recovers the served language for the `anon` rows, which are the majority of the audience.
Decision it changes: the served-versus-asked gap of section 2e is currently measurable only from
the two confirmed-human logs, so the discovery defect it names is sized from 307 people rather than
from all reach.

**3. Nothing at all — read the next monthly archive.** Cost: zero. The cron is installed on
production as of 2026-09-03; the rotation is monthly because a month is the shortest window that
regularly clears the report's own small-n floor of 40. Decision it changes: **the `zh`
pre-registered test needs n = 30 views and nothing else**, and Task 144 needs Hazen-Williams
re-derived on current definitions before a single hour is spent on it. Both are waiting on time,
not on instrumentation.

**4. A naming instrument for `Looped-Network`.** Cost: one `log-title-event.php` call at a project
save, a tab rename, or a Text object, plus a decision about which of those actually means "I mean
to show this to somebody". Decision it changes: lpn is the only page whose top funnel stage is
unmeasurable, so its 0-of-12 naming figure is currently uninterpretable, and the suite's own stated
reason for existing is the thing it cannot see there.

**5. A second Search Console export.** Cost: one download and a paste into
`dev/usage-data-log.md`. The only one on file is 2026-07-27, taken before `Looped-Network` had been
indexed at all. Decision it changes: whether the sewer-slope cluster — 188 queries, 1,007
impressions, 1.1% CTR — is still the largest unconverted demand in the record, which is the
strongest discoverability argument the project has.

**6. Nothing about the contact funnel yet.** Cost of acting: real. Cost of waiting: nothing. At 3
clicks and 1 send there is no signal, and the two possible causes call for opposite fixes. Wait for
a window with a two-digit numerator before touching either the invitation or the form.
