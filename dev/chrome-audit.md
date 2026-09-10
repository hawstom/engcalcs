# Chrome audit — the epanet-js user's complaint, measured

Ida (interface-designer), 2026-09-10. OBSERVED numbers below are from a real Chromium render of
this checkout, produced by `dev/chrome-audit/measure.js` (reusing `dev/browser-pass/lib/env.js`
for the same-server/prove-our-tree discipline the punch list uses). Screenshots and the raw
JSON are in `dev/chrome-audit/render/`. **No shipped file was changed.**

## 0. Which page, and Tom's own read

Tom identified the page from the user's own screenshot: `Looped-Network.php`, window ≈
1919×1002. His read, which this audit confirms in substance: *"I am pretty sure it's an
exaggeration."* It is — but the thing under the exaggeration is real, and one item in the
complaint (*"invitations for downloads"*) is not an exaggeration at all. See §3.

The landing page (`librewaternet.org`) is a smaller, secondary finding — §6.

## 1. The headline number

At the window size in Tom's screenshot, **1919×1002**, with the page-title row at its default
(shown):

| | px | % of viewport height |
|---|---|---|
| Top of viewport to first pixel of the map | **314 px** | **31.3%** |

**Not two-thirds to three-quarters. About one-third**, at the exact window the complaint's
screenshot shows. The claim is an exaggeration, confirmed by measurement, not by opinion.

It gets worse on a smaller monitor and better on a bigger one — this is a real, non-hand-wavy
range:

| Viewport | Map starts at (px) | % of viewport |
|---|---|---|
| 1920×1080 | 314 px | 29.1% |
| 1919×1002 (Tom's screenshot) | 314 px | 31.3% |
| 1440×900 | 400 px | 44.4% |
| 1366×768 | 400 px | **52.1%** |

The jump from 1920/1919 to 1440/1366 is not proportional dilution — it is the H1 and the H2
each **wrapping to a second line** below ~1440px, which is a second, independent finding: **the
title block's height is not fixed, it grows on the very screens where headroom is scarcest.**
At 1366×768 the map's usable area is further cut by the first-visit consent banner (§4), which
overlaps the canvas from y=588 down — so a first-time visitor on a 768-tall laptop screen sees
genuinely clear map only from y=400 to y=588, **188 px, 24.5% of the window**, before scrolling
or dismissing anything. That is close enough to the complaint's own fraction that a laptop
user meeting all three things at once (small screen, title shown, consent unanswered) would not
be exaggerating much at all.

## 2. Itemized pixel budget, at 1919×1002 (Tom's screenshot size), titles shown (the default)

Read top to bottom, each row's own height plus the gap before the next:

| Row | What it is | Height | Cumulative top |
|---|---|---:|---:|
| Suite chrome (navbar) | "HawsEDC Calculators · Libre Software · Hydraulics" + Help/English, right | 56 px | 0 |
| H1 `ec-page-title` | "Free Online Water Distribution Network Calculator with the EPANET Solver" | 48 px | 56 |
| *gap* | | 8 px | 104 |
| Tagline `ec-page-welcome` | "Drop your fears at the door...Enjoy the **free libre HawsEDC AutoCAD tools** too." | 24 px | 112 |
| *gap* | | 16 px | 136 |
| H2 `ec-page-desc` + Hide-titles link | "Water Supply Network Analysis..." + "Hide these titles" | 38 px | 152 |
| *gap* | | 9 px | 190 |
| Menu bar `lpn_menubar` | File / Edit / Map / Water / Help | 32 px | 199 |
| *gap* | | 4 px | 231 |
| Toolbar `lpn_toolbar` | draw tools, transport controls, search, keyboard shortcut | 36 px | 235 |
| *gap* | | 4 px | 271 |
| Tab strip `lpn_tabs` | + / list / Project1 / close | 33 px | 275 |
| *gap* | | 6 px | 308 |
| **Map** `lpn_canvas` | | — | **314** |

Grouped by function:

| Group | Height | Share of the 314 px |
|---|---:|---:|
| **Suite chrome** (navbar) | 56 px | 17.8% |
| **Title block** (H1 + tagline + H2 + their gaps) | 143 px | **45.5%** |
| **App functional chrome** (menu + toolbar + tabs + their gaps) | 109 px | 34.7% |
| *(final gap before canvas)* | 6 px | 1.9% |

**Confirms the read I was given: roughly half of the overhead is the title block, and the title
block is text with no function for someone who has already arrived to draw a network.** The
menu, toolbar and tab strip — the actual application — are just over a third of the total, and
that third is doing real work: every one of those rows is a control surface, not a sentence.

## 3. "Invitations for downloads" — not invented

The tagline (`ec-page-welcome`, key `template_welcome`) reads in full:

> *"Drop your fears at the door; love is spoken here. You are not ruining everything. Enjoy the
> free libre HawsEDC AutoCAD tools too."*

`free libre HawsEDC AutoCAD tools` is a link to `hawsedc.com/download.php` — **a different
product**, promoted in the 24 px directly above a drawing surface, on the page a person who
wants one tool has arrived at to do one thing. This is the single most literal match to
*"invitations for downloads"* in the whole complaint, and it is not something this suite
carries by necessity — `lib/HeadersFooters.lib.php:263` shows `template_welcome` is a **shared,
suite-wide string**, echoed on all 16 calculator pages, not written for `lpn_` and not
specific to it. On a form-and-an-answer calculator page it costs little (there is room to
spare); on the one page that is a full-window drawing surface, it costs a line's worth of the
scarcest real estate on the page, for a sentence about hospitality and a sales link to a
different HawsEDC product.

## 4. The consent banner — real, but not chrome in the same sense

At every viewport tested the first-visit consent banner (`ec-consent`, `position: fixed;
bottom: 0`) is **179.6 px tall**, and it overlaps the bottom of the map on every window size
tested (e.g., at 1919×1002 it covers y=823–1002, well inside the canvas). This is a genuine
contributor to "not enough room to work" on a first visit, and it compounds with the title
block and the wrap problem above rather than sitting outside it. **It is not counted in §1/§2's
numbers**, because it answers a different, one-time question (a consent decision, not
permanent screen furniture) and disappears the moment the visitor answers it or on a returning,
already-answered browser. Flagged here because Tom's screenshot and the complaint were plausibly
both about a first visit, where the true squeeze (title block + consent banner both up) is worse
than either number alone suggests.

## 5. Ranked recommendations, pixels recovered per unit of disruption

Each item classified: **WASTED** (fix it), **LOAD-BEARING/LOOKS WASTEFUL** (keep, but the cost
is real and worth knowing), or **LOAD-BEARING BUT CHEAPER** (keep the function, shrink the
pixels).

### 1. Drop the download-tools tagline from `lpn_` — WASTED here (load-bearing nowhere near this page)
**Recovers 40 px (24 px row + 16 px gap), zero width risk, zero translation cost** (the string
already exists and stays for the 15 other calculators — this is scoping an existing shared
string OUT of one page's render, not editing a language key). It is not part of the Hide-titles
toggle's *reason for being* — Task 289/616 is about the page title and description, not
about a cross-sell to a different product. On `lpn_` specifically this line has no SEO
function either: it is not `$html_desc`, not the H1, not indexable copy about the calculator.
**Highest pixels-recovered-per-unit-of-disruption on the list.** Cost: one line of PHP
suppressing a shared partial for one page, and a decision about whether that is a per-page
override or a genuine content judgement ("does `lpn_` want to welcome people the way a
form-and-an-answer page does") — worth a sentence from Tom, not a redesign.

### 2. Fix the DEFAULT of `lpn_show_titles`, or fix the DISCOVERABILITY of the toggle — the open question, answered directly below
See §7. **Recovers up to 142 px (45% of the current overhead) at 1919×1002**, more on a
1366-wide screen because it also removes the wrapped second line. This is the single largest
number on the table, and it already exists — the entire fix may be "change one default and
verify no downstream assumption depends on the old one," which is why I am flagging it first
after the tagline for cost even though its recovery is largest.

### 3. Cap the title block to one line each, rather than letting it wrap — LOAD-BEARING BUT CHEAPER
Below ~1440 px the H1 and H2 both wrap, adding 48 px that a fixed-height, `text-overflow`
or a smaller responsive font size would not. This does not touch content or translation — it
is a CSS sizing question. Recovers up to 48 px specifically on the two narrower viewports
tested (1440, 1366), where the complaint bites hardest. Modest cost: font-size or line-height
tuned per breakpoint, tested against the 27-language corpus for the longest translated
title/description (a translated string can be longer than the English one — check before
shipping, do not assume).

### 4. Merge menu bar + toolbar into one row on wide screens — LOAD-BEARING, MERGE IS CHEAP BUT THE WIN IS SMALL
Tom's own instinct (*"If you are talking about a single row on a wide screen, I agree"*)
is width-feasible: the menu bar's own content (File/Edit/Map/Water/Help) occupies only ~410 px
of a 1919 px row; the toolbar's buttons are the real content and the row is otherwise flex
gap, not ink. Merging recovers **roughly 36–40 px** (one row height plus one inter-row gap) on
screens wide enough that neither group wraps — likely fine at 1920/1440, marginal at 1366
where names are already under width pressure elsewhere. **This directly trades against the
`max-width: 640px` phone rule that already collapses the two into icon-only stacking — do not
build one mechanism that fights the other.** Rank it below items 1–3 because the yield is a
third of the title-block fix for comparable implementation risk, and because CLAUDE.md is
explicit that the toolbar's wrapping behavior at narrow widths is a hog to be protected against,
not inverted — a merge has to be proven not to reintroduce that at in-between widths (e.g.
1024–1365) before it ships.

### 5. Everything else on the four bars — LOAD-BEARING, LEAVE ALONE
- **Suite chrome (56 px navbar):** carries the language switcher (27 languages), the sibling
  calculator menu, and the suite identity. This is exactly the chrome CLAUDE.md says is the
  product, not decoration — a single-tool competitor's user not valuing it is not evidence it
  is waste. 56 px is also already cheap: it is one row, no wrap risk measured at any tested
  width, and it is the row Task 616's own MJH/PCW finding says is *invisible*, which is a
  separate, already-open problem (a visibility defect, not a size defect).
- **Menu bar / toolbar / tab strip (109 px total):** this is the actual application surface —
  drawing tools, file operations, project tabs. None of it wrapped or grew at any tested width.
  Nothing here matches "big font words" in the complaint; the words on these rows are single
  short labels or, since 2026-08-18, icons with an aria-label. This is the bucket the
  complaint's own tone (a competitor's partisan, annoyed at needing to learn a second tool) is
  least entitled to a vote on.

## 6. The landing page — deprioritized per instruction, one number worth keeping

`librewaternet.org/index.html` was rendered at the same three viewports (see
`dev/chrome-audit/render/landing-*.png` and `measurements.json`). One number stands out enough
to record even though the identified complaint was about the app: at 1920×1080 the first
genuine call to action, **"Start a model now,"** sits at **y=720, 66.7% of the viewport height**
— which is a near-exact match to the literal "2/3" the complaint states, on the OTHER page.
The hero headline alone ("World owned.") is 177 px tall. **This was not the page the user's
screenshot showed, so it is not this audit's finding — but if the same complaint recurs
without a screenshot next time, check the landing page's own fold before assuming it is
`lpn_` again.** Any deeper treatment of landing-page copy or hero size is out of scope here per
`~/webdev/librewaternet.org/CLAUDE.md`'s claim rules and per the coordinator's narrowing; flagging
the number is as far as this pass goes.

## 7. Answering the two questions directly

### Is `lpn_show_titles`'s DEFAULT wrong, not just its discoverability?

**My recommendation: change the default is the wrong fix; change what "default" means over
time is closer to right, and it should not be done by editing the localStorage default alone.**
Reasoning:

- **SEO is NOT the obstacle it looks like.** The naive worry — "hiding the H1/H2 by default
  will hurt search ranking" — does not hold up under how the hide actually works: it is a
  `localStorage`-gated *client-side* toggle that runs from a fresh, empty profile exactly the
  way Googlebot's crawl does. The **served HTML is unaffected either way** — the H1, the H2 and
  `$html_desc` are emitted by PHP regardless of the JS default, because the JS only ever *acts*
  on a stored preference that a crawler's fresh render will not have set either way. Full stop,
  that part of the SEO argument is close to a non-issue. **The part that is a real risk**: if the
  default flips to "hidden unless the visitor has explicitly turned it on," then Googlebot's own
  **rendered** snapshot — which does inform ranking and rich-result eligibility, separately from
  the raw HTML — would also render with the heading hidden, because its first visit is also a
  fresh profile with nothing in storage. That is a genuine, if second-order, risk and should not
  be waved off with "the HTML is still there."
- **And separately from SEO, `dev/usage-data-log.md`'s 2026-09-07 Search Console export records
  that `Looped-Network.php` is, in its own words, "indexed and invisible"** — 62 impressions
  across nine URL variants, 2 clicks, average position in the 30s, every "network" query
  returning zero clicks. **This page is not currently earning anything from its on-page H1/H2
  the way Manning-Pipe-Flow demonstrably is** (that page anchors the suite's real organic
  traffic per the same log). So the downside of experimenting with the default here is smaller
  than it would be on the pages that are actually working — but "not currently working" is not
  the same claim as "cannot start working," and flipping the default is exactly the kind of
  change that would foreclose finding out.
- **The sharper distinction, and the one worth keeping:** *what a first-time searcher needs to
  see once is not what a returning drafter needs to see every time.* `lpn_show_titles` today
  conflates "have you seen this before" with "did you ask to hide it," and those are different
  facts. A visitor who has never been to the page benefits from the confirmation (they landed on
  a water-network calculator, not a stray SVG canvas); a visitor on their fifth session does not
  need to re-read it, and currently must find a Settings row to say so — the exact defect Task
  616 is open about.
- **Recommendation, ranked:** do not touch the stored default (`null` = shown) — that is the
  visitor's first look, and where the SEO-rendering risk actually lives. Instead, **default the
  effective state on a per-browser visit-count basis**: shown the first time a browser opens
  this page (or the first N times), auto-hidden after that, still fully reversible from
  Settings. That is a small addition to the SAME furniture key's own logic, not a redesign, and
  it resolves "the control nobody finds" more directly than any highlight-timer change could —
  it removes the need to find it at all for the visitor the current default is wrong for
  (someone who has already used the page and does not need re-orienting), while leaving the
  crawler and the first-time human exactly as they are today.
- This is a recommendation, not a build — it is Tom's call whether the visit-count mechanism is
  worth the small bit of new state (which browser-slot furniture rule it falls under, per
  CLAUDE.md's PROJECT-vs-BROWSER line, is itself worth one sentence of design before it is
  written).

### Are the H1/H2 load-bearing for SEO?

**Yes, in general, for the suite; not demonstrably yet for this specific page** (see the Search
Console citation above). Do not read that as license to delete them — an unindexed page is the
page most in need of its on-page signal remaining intact while other fixes (internal linking,
content depth) are tried, not the page to strip content from on the theory that it has "nothing
to lose." The safe move is exactly what item 1 in §5 already isolates: the AutoCAD-tools
tagline is not carrying any of that SEO weight (it is not `$html_desc`, not the H1, not
indexed as this page's subject) and can go without touching the part that might be.

## Files

- `dev/chrome-audit/measure.js` — the render/measure/screenshot script (reuses
  `dev/browser-pass/lib/env.js`'s server-proof discipline; not part of `check_all.sh`).
- `dev/chrome-audit/render/measurements.json` — full per-viewport row geometry, both pages,
  titles shown and hidden.
- `dev/chrome-audit/render/lpn-*.png`, `dev/chrome-audit/render/landing-*.png` — screenshots at
  1919×1002, 1920×1080, 1440×900, 1366×768 (app, titles shown and titles-hidden; landing,
  titles not applicable).
