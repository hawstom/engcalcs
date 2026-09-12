# Help, masterminded — and the way back to LibreWaterNet.org

Ida (interface-designer), 2026-09-10. Answers the brief given by name: Help is "the biggest
remaining embarrassment on the page," and a new thing — the return trip to LibreWaterNet.org —
needs a conventional design. **Diagnosis and rank, not a build.** No shipped file touched.

Read before this: `dev/agents/interface-designer/journal.md`, `dev/chrome-audit.md`,
`dev/app-chrome-postdivorce-recommendations.md`, ROADMAP Tasks 625/615, `dev/toolbar-icons.md`,
`openHelpMenu()` (`js/looped-network.js:22116-22185`), `~/webdev/librewaternet.org/CLAUDE.md` and
its three pages.

---

## 0. What Help actually is today, read off the code, not guessed

OBSERVED, `js/looped-network.js:22119-22184`. Eleven rows, four separators, in Tom's own
2026-09-06 ordering:

```
Walkthroughs
Notes on this page
Toolbar                      ← fly-out, derived from the toolbar itself
────────────
Fix something
────────────
Privacy notice
Terms of use
Cookie settings
────────────
Install
Screenshot gallery
Not EPANET
────────────
About
```

**It is not out of control in row COUNT.** Eleven items in four visually separated bands is a
normal-sized Help menu — Word's, Figma's and VS Code's are all in this range. What is out of
control is that **two specific rows are wrong on the merits**, not merely numerous, and Tom named
both correctly. Fix those two and the "embarrassment" claim resolves without touching the other
nine.

---

## 1. `lpn_notes_1_term`/`lpn_notes_2_term` — obsolete, and what replaces them

OBSERVED, `lib/lang.ec.en.php:1846-1858`, `Looped-Network.php:1117-1132`. The Notes popup is a
`<dl>` of eight term/definition pairs, and the first two are:

- **"How it is solved"** — the global-gradient algorithm, EPS stepping, tanks filling and
  draining.
- **"Not modeled"** — water quality chemistry is out; age and source trace are in; every valve
  type is "solved."

**Diagnosis: these are not factually stale — they are the wrong SHAPE of content for this popup,
and that is what makes them obsolete as entries here rather than as facts.** Every other row in
the same `<dl>` is a working note tied to something the reader is doing right now: *Saving
projects* (what happens if you clear your browser), *Pump curve* (what the three points mean when
you're typing them), *Color band boundaries* (why the legend didn't move when you scrubbed time),
*Which EPANET this page runs* (provenance, for the reader checking a number against the report).
"How it is solved" and "Not modeled" are the opposite genre: a product-level scope statement —
*what is this calculator, and where are its edges* — which is exactly the question an **About**
page exists to answer, not a page-notes popup a reader opens mid-task.

**The evidence that this is the right diagnosis, not just a preference:** Task 625's own still-open
item is that `About.php`'s body (`lib/lang.ec.en.php:543`, OBSERVED) is entirely suite-wide —
mission, GPL, GitHub, contributing, offline/PWA, contact — and needs the app's own words once the
suite navbar is gone. "How it is solved" and "not modeled" are precisely the two sentences a
rewritten, app-specific About page would need to open with. They are not homeless; they are
mis-homed.

**Recommendation:** retire `lpn_notes_1_term`/`_def` and `lpn_notes_2_term`/`_def` from the Notes
popup, and fold their substance into the About rewrite Tom already owes (About's content, not its
chrome — his call per the standing ROADMAP note). This is a two-row shrink of the Notes popup
(eight pairs to six) and a content contribution to a rewrite that has to happen anyway, not two
separate pieces of work. **Flag, do not act on: "Which EPANET this page runs"** is the same genre
(provenance, not task-context) and is a candidate for the same move — I'm not recommending it now
because Tom only named the first two, and a reader checking a run report against an engine version
is closer to "notes on this page" than the other two are. Worth one sentence from him later, not a
unilateral third move now.

---

## 2. LibreWaterNet.org as About, or About pointing at LibreWaterNet.org — no to both

Read `~/webdev/librewaternet.org/index.html` (738 lines), `features.html`, `screenshots.html`, and
the site's own `CLAUDE.md` before answering, as instructed.

**They are not the same register, and that is not a style note — it's the reason the answer is
no.** LibreWaterNet.org is a *recruiting and mission* page: OBSERVED, `index.html:421` ("World
owned."), `:457` ("Four kinds of person we are looking for"), `:563` ("The people who need it most
cannot buy it"). Its `CLAUDE.md` states its own job in so many words: *"Lead with the invitation,
not the comparison"* and *"DO NOT ANNOUNCE THE SITE'S OWN VIRTUES"* — it is written to convert a
stranger into a believer over several screens. **About exists to answer a different question from
a reader in a different state**: someone already inside the tool, mid-task, who clicked Help
because they want to know what this thing is, who made it, what it does and doesn't do, and
whether it's legitimate — in seconds, not screens. Handing that reader "World owned." is a genre
mismatch in both directions: too much conviction for someone who just wants a fact, and none of
the facts (licence, GitHub, what's modeled) that About actually needs to state and that
LibreWaterNet.org's pages do not carry at all.

**Reworking LibreWaterNet.org into an About page is worse, not just unhelpful** — it would take
the site literally created to widen the audience (a mission front door for people who have never
heard of this project) and narrow it into product documentation, which is what `About.php` and
`Not EPANET` and the walkthroughs already do, on the other domain, for the audience that already
arrived. `~/webdev/librewaternet.org/CLAUDE.md`'s own EPANET-is-silent rule and its ratchet against
self-congratulatory language are both evidence of a page tuned for outside readers; repurposing it
loses that tuning for no reader's benefit.

**Recommendation:** keep both pages, each in its own register. Finish the open item — rewrite
`About.php`'s body to describe this calculator, using the content freed up by §1 — and add exactly
**one** outbound sentence near the top or bottom of About's own body, in About's own words, for the
reader who wants the mission story: *"Read more about the mission at LibreWaterNet.org"* as a plain
link. That is the cheap version of Tom's idea that keeps the two pages doing their own jobs: About
answers "what is this", LibreWaterNet answers "why does this exist and why should I care", and one
sentence bridges a reader who wants the second question after getting the first.

---

## 3. Help > Toolbar — not redundant, but mislabeled; Tom's own rename is right

**Is it useful, or just "something to put in Help"?** OBSERVED, `dev/toolbar-icons.md` §3 and
`js/looped-network.js:22105-22114` (`iconGuideRows()`, derived from `toolbarIconIndex`): this row
exists for a load-bearing reason, not a padding one. The toolbar shipped icon-only on 2026-08-18
(Tom: *"it's time to drop the words from all the toolbar row"*), and the tip that carries the word
back is hover-only on a pointer and press-and-hold on touch — **neither is a way to scan the whole
strip at once**, and a first-time mouse user who doesn't think to hover has no route to the words
at all except this menu row. It is not a repeat of the toolbar; it's the toolbar's missing legend,
and it's the one place the icon, the name and the explanation appear together in one list, derived
automatically so a new button is never missing from it.

**So the content is right and the purpose is real. The name is the actual defect**, and it's the
one Tom already diagnosed by asking the question: "Toolbar" reads as a control *for* the toolbar
(show it, hide it, configure it), not as a legend explaining it — a reasonable reader has no way
to know, from the word alone, that clicking it produces a translated icon key rather than doing
something to the strip itself. **His own suggestion is the fix: rename it "Toolbar key."** "Key" is
the conventional word for exactly this artifact (a map's key, a diagram's legend) and it costs one
string (`lpn_help_icons`, currently `'Toolbar'`, `lib/lang.ec.en.php:1157`) — no restructuring, no
new mechanism, and it is honest about what the row does in a way "Toolbar" alone is not.

**Recommendation: rename, don't remove or restructure.** Highest confidence, lowest cost item in
this whole document.

---

## 4. Search help — right direction, not now, and here is what it would displace

Answering only whether this belongs in the menu, not how to build it, per instruction.

**Yes, in principle, it is the right shape of idea for a menu that has been growing one row per
feature since 2026-08-14** (OBSERVED, `git log` on this file's own history: "Notes and the
invitation move into the LPN Help menu," "The Notes say which EPANET runs here," etc. — a menu that
accretes a row every time something needs a home is a menu that will keep growing). A search over
the current language's own strings, surfaced in context, is the pattern that lets a menu STOP
growing rows instead of adding an twelfth, a thirteenth: instead of a new top-level item for every
new fact, the fact becomes findable through one search box that already exists.

**What it would displace, if built:** most directly, **Toolbar key** (§3) — a search box that can
find "pump" and show its tip is a superset of a static icon list, and would let that content live
as data rather than as a maintained flyout. Partially, **Notes on this page**, for the same reason.
**Walkthroughs stays separate** — it links to worked, guided material, not a fact lookup, and search
does not replace a tutorial.

**Recommendation: not for 16 September, and not scoped here.** It is a real feature (an index to
build, a results UI to place, a decision about whether it searches labels, tips, both) — exactly
the class of work the brief asks me not to start. Record it as the long-run answer to "Help keeps
growing a row per feature," rank it below every item in this document, and pick it up as its own
task once the demo has passed.

---

## 5. The way back to LibreWaterNet.org — the new thing, designed conventionally

Tom's own question, and his own tension: *"No way to get back to LibreWaterNet.org from the map...
Should it be an icon (colored?) at the page upper right before the menus?"*

### What convention actually is

**A product mark that returns the reader home sits at the top LEFT, not the right, and this is
about as close to a universal web convention as exists.** Every browser tab bar, every bank, every
SaaS app with a menu bar (Google Docs, Figma, VS Code, Sketch) puts its own mark at the far left —
often literally to the left of File — because left is where reading starts and "click the mark to
leave/go home" is the oldest learned behavior on the web. **The upper right is not neutral
territory; it is already claimed, by this exact convention, for something else: account, settings,
help, language — the utility zone, not the identity zone.** This page's own menu bar already
follows that split without having named it: Help sits at the right edge today, and §5's own §B
recommendation (already shipped per Task 625) put Language even further right, past Help. Tom's
own instinct to put a NEW icon at upper right, before the menus, would put a "go home" mark inside
the zone this page has already been quietly building as "things that are not about the current
document" — which is the opposite of where "go home" belongs, and would sit oddly next to Help and
Language, which answer "help me here" and "show me this in another language," not "take me
somewhere else."

**So: his placement fights the convention. Left is correct, and it is correct for a reason beyond
"that's where it usually goes"** — this page trains a left-to-right scan starting at File, and
putting the LibreWaterNet mark to the immediate left of File extends that same scan by one glyph
rather than asking the eye to jump to the opposite end of a row it may not even be looking at (the
chrome-audit and postdivorce documents both found that the menu bar itself already loses the
attention contest to the toolbar below it — asking a NEW mark to win attention at the far right,
away from where any scanning already happens, stacks a second discoverability problem on top of
the first one this whole project exists to fix).

### Should it be a Help row instead?

**No, rank it below the menu-bar mark, not above it.** A Help row costs literally nothing in width
(§0's count doesn't even need to grow — see below) but inherits Help's own proven discoverability
ceiling: two of three test subjects never found the menu bar the row would live inside, and a row
at position 12 of a flyout is a worse "way back" than a mark that's visible at rest, every time,
with the map open and nothing clicked. The whole point of a "way back" is that it should not
require the reader to already know to look for it.

### Colored or mono?

**Mono, matching the engraved-tower treatment already shipped for the Water menu icon** (Task 615,
OBSERVED, ROADMAP: *"the engraved mono tower as the lpn_ Water menu icon"*), not the full-color
favicon. The favicon's color is doing marketing work — CITED, it is the glyph Tom called *"my one
true love"* precisely in a context (a browser tab, a share card, an app icon) where standing out
IS the job. Here the job is the opposite: quiet, permanent availability without competing for
attention against File/Edit/Map/Water/Help, which are the controls actually needed on every visit.
A colored mark at rest, every session, would be the loudest thing on the row — exactly the
salience-imbalance problem §F of `dev/app-chrome-postdivorce-recommendations.md` already diagnosed
between the menu bar and the toolbar, recreated a second time between the menu bar and its own new
leftmost item.

### Cost, measured against the existing budget

`dev/app-chrome-postdivorce-recommendations.md` §A measured the menu bar's own ink at **401px** of
content against **1,364–1,918px** of available row at this project's three reference viewports. A
single icon-only glyph (roughly the size of one existing menu item's icon, ~24–32px plus padding)
adds on the order of 40–50px including its own hit-area padding and a visual separator from File —
comfortably inside the same margin that already holds Language at the opposite end. It does not
threaten the 1440/1366 fit that a full menu-bar/toolbar merge already can't make (§A of the same
document); it is roughly a tenth of that risk, at the opposite corner of the row where nothing else
competes for the space.

**One new string, not zero**, unlike a pure decorative icon: it needs an `aria-label` /
`title`/tip naming its destination (something like "LibreWaterNet.org — the mission behind this
calculator"), because an icon-only link with no accessible name is exactly the defect
`icon_name_check.php`'s sibling rules exist to catch elsewhere on this page. Cheap — one key,
English only, in scope for the freeze the same way Install's reused key was.

### Recommendation, ranked

1. **A single mono icon-only link, far left of the menu bar, left of File, opening
   `librewaternet.org` in a new tab** (matching the pattern every other outbound Help row already
   uses — `ext()`, `noopener`). This is the conventional placement, the cheapest visually
   competitive option, and the only one of the three candidates that doesn't inherit a proven
   discoverability ceiling.
2. **If Tom still prefers the right edge for a reason not covered here** (e.g., deliberately NOT
   wanting it to compete with File for the first-scan position, which is a legitimate but
   different goal than "conventional"), the fallback is the far right, past Language — never
   between Help and Language, and never colored, for the same salience reasoning above.
3. **A Help row is the fallback of last resort, not a real candidate** — it is free in pixels and
   expensive in the one thing that matters here, being found at all.

---

## Ranked plan, all five items together

| # | Item | Cost | What it fixes |
|---|---|---|---|
| 1 | Rename `lpn_help_icons` "Toolbar" → "Toolbar key" | one string | mislabeling, Tom's own diagnosis confirmed |
| 2 | Retire `lpn_notes_1/2_term/def` from the Notes popup; fold into the About rewrite | content move, no new mechanism | wrong-genre content in a task-context popup |
| 3 | Add one outbound sentence from About to LibreWaterNet.org; do not repoint or merge the two pages | one string, one link | answers "could LWN be About" without a register mismatch |
| 4 | Add the way-back mark: mono icon-only link, far left of the menu bar, before File | ~40-50px width, one string | the actual new thing asked for; only candidate without Help's discoverability ceiling |
| 5 | Search help: defer past 16 September, note what it would eventually displace (Toolbar key, partly Notes) | none now | keeps Help from becoming a menu that grows a row per feature, without building it under demo pressure |

**If only one could be done: #4, the way-back mark.** It is the one genuinely NEW thing asked for,
it is the only item that both answers a real gap (there is currently no route back at all) and
does not inherit a discoverability problem this project has already measured twice. Items 1–3 are
real but are precision fixes to existing rows, not new capability; #5 is explicitly out of scope
for now.

## Files

This document. No shipped file changed. Journal and wishlist entries filed at
`dev/agents/interface-designer/journal.md` and `dev/agents/interface-designer/wishlist.md`.

---

## 6. Follow-on, 2026-09-11 — the merge question and the "Front page" question

Two things changed since §0–5 above and both bear on what follows. **OBSERVED**,
`js/looped-network.js:22490-22520`: the way-back mark shipped exactly as ranked — far left,
before File, mono (`currentColor`), a plain `<a href="...">` (`EngCalcs.lwnSiteUrl`), **same tab**
on a plain click ("Same tab on a plain click, so Back is the way back," per the code's own
comment). And Tom is now building an **About popup** as an in-page box (site name, a personal
line, GPL v3, his copyright, deploy date and commit SHA) — mechanically identical to how *Notes on
this page* and *Cookie settings* already behave, and no longer an `ext('About.php')` outbound
link. That second fact is what makes both questions answerable cleanly: About stops being "one of
the three outbound informational rows" and becomes "an in-page fact box," the same genre as two
rows already in the menu.

### Q1 — merge Privacy/Terms/Cookie settings with About?

**Yes, merge, and yes it reads better — not merely no-worse.** OBSERVED, `:22142-22183`: today's
legal band and About sit in different bands for a reason that no longer holds — the code comment
at `:22182` says "About last, where every other Help menu in the world puts it," which was already
gesturing at the same genre (self-referential software facts) without acting on it, because About
used to leave the page (`ext('About.php')`) while Cookie settings stayed in it
(`window.ecReopenConsent`) — different mechanics, so keeping them apart was defensible. Once About
is also an in-page reveal, all four rows share both properties that matter: **subject** (facts
*about this software*, not a task and not somewhere else) and, for three of the four, **mechanic**
(Cookie settings and About both toggle a box in place; Privacy and Terms still navigate out, which
Fix something and Not EPANET already do too, so a band mixing "stays" and "leaves" items is not a
new pattern here — the current legal band already mixes them).

**Does it weaken findability (Task 286)?** No — Task 286 requires the notice be reachable and
withdrawal as easy as consent; it says nothing about which band. Position in the flyout barely
moves: Privacy notice/Terms of use/Cookie settings currently sit third of four bands; merged, they
sit fourth of four (the *last* band, where About already conventionally sits) — one click into
Help either way, no new nesting, no accordion. If anything this is a slightly *more* conventional
home: "legal + about" living together at the bottom of a Help menu is the shape of Slack's,
Discord's and most Electron apps' own About/Legal grouping — CITED as an observed convention, not
sourced to one document.

**Exact resulting order** (band 3 and band 4 merge into one; nothing else in §0's order moves):

```
Walkthroughs
Notes on this page
Toolbar key
──────────────
Fix something
──────────────
Install
Screenshot gallery
Not EPANET
──────────────
Privacy notice
Terms of use
Cookie settings
About
```

Four bands become three separators (was four) — a small reduction in visual segmentation for the
same eleven-to-twelve rows (row count settled below, §8).

### Q2 — should a "Front page" row exist near Not EPANET, now that the mark exists?

**Judge the redundancy question on what the mark actually does, not on the fact that it exists.**
My own §5 rejected a Help row *as the way back* because it inherits Help's proven discoverability
ceiling (two of three test subjects never found the menu bar the mark now lives on) — that
argument is still correct and is not reopened here. But "is a Help row redundant with the mark"
is a different question from "is a Help row useless," and the mark's own shipped behavior answers
it: **the mark is same-tab.** `:22506`, restated in the code's own comment: "Same tab on a plain
click, so Back is the way back." That is the right choice for the mark — an anchor that behaves
like every other product mark, middle-click and copy-link-address included — but it means clicking
it **leaves the open project**, recoverable only by however reliably the browser's back-forward
cache restores a canvas-and-state-heavy page, which this repository has no measurement of and
should not assume.

**So the mark and a Help row are not the same offer.** The mark says *I am done, take me home*.
Every other outbound Help row (Screenshot gallery, Not EPANET, Walkthroughs) says *let me look at
that without losing what I have open* — each already uses `ext()`, a new tab with `noopener`,
specifically so a reader mid-task can check something and come back to a live document. A row
pointing at LibreWaterNet.org in that same `ext()` pattern is not a second route to an identical
action; it is the ONLY route that lets a reader with unsaved work see the mission page without
gambling on bfcache. **Recommendation: add it, in the `ext()` band with Screenshot gallery and Not
EPANET, not because of discoverability (the mark still wins that argument for the reader who is
genuinely leaving) but because it is the one thing the mark structurally cannot offer: a look
without a risk.**

**Not "Front page."** Two reasons. First, it invites confusion with the row now sitting one band
below it in the merged menu (§1): "About" already answers "what is this software," and "Front
page" reads like a synonym for the same question, not for "why does this exist" — the two pages
this project has already ruled are different registers (§2 above). Second, "front page" is a
newspaper metaphor this suite does not otherwise reach for, where every neighboring row instead
states either an action (*Install*, *Fix something*) or a destination-and-payoff (*Screenshot
gallery*, *Not EPANET*). **Recommend the label be the site name itself: `LibreWaterNet.org`** — a
proper noun needs no translation, which is the exact reasoning the mark's own tip already uses
("the name is the domain, which needs no translation," `:22509`), and stating the destination
plainly is what a reader scanning the band actually needs, more than a metaphor would tell them.
Icon: reuse `water`, the same glyph as the mark and the Project/Water menu — the one place in this
menu where repeating an icon is a feature, not a collision, because it visually ties the row to
the mark it is standing in for.

### Exact resulting order, Q1 and Q2 together

```
Walkthroughs
Notes on this page
Toolbar key
──────────────
Fix something
──────────────
Install
Screenshot gallery
Not EPANET
LibreWaterNet.org
──────────────
Privacy notice
Terms of use
Cookie settings
About
```

### 7. Unprompted — is the menu now shorter or longer than it should be?

**Longer by one row (eleven to twelve), and still the right size.** About's move from an outbound
link to an in-page box does not shrink the menu — it was always going to cost exactly one row
either way, the same as Notes on this page and Cookie settings already do; only its *mechanic*
changed, not its presence. The mark did not remove a row either, because §5 never put the way-back
capability IN Help to begin with — it was ranked as the menu-bar item precisely so Help would not
have to carry it. The one net addition is `LibreWaterNet.org` itself (§Q2), for the reason above:
it is not a duplicate of the mark, it is the no-risk variant of the same trip. §0's own yardstick
still holds at twelve: Word, Figma and VS Code's own Help menus commonly run to twelve to fifteen
rows across three to five bands, so this is still "normal for the genre," and the band merge (four
separators down to three) actually reduces the menu's visual segmentation while the row count ticks
up by one — the two numbers are moving in opposite directions, which is itself mild evidence nothing
here is spiraling.

**Ranked cost of this follow-on, same table shape as §0's:**

| # | Item | Cost | What it fixes / buys |
|---|---|---|---|
| 1 | Merge legal band into the About band (Q1) | zero — reorders existing rows, no new string | one fewer separator; genre-consistent band now that About is in-page |
| 2 | Add `LibreWaterNet.org` row, `ext()`, in the Install/Screenshot/Not EPANET band (Q2) | one string, one row | the no-risk look at the mission page the same-tab mark cannot offer |

Both are cheap; neither is urgent against 16 September, but neither risks anything either — the
merge is a pure reorder and the new row is one key in the pattern already used twenty times over
in this same menu.

## Files

This document, appended. No shipped file touched. Journal and wishlist entries filed at
`dev/agents/interface-designer/journal.md` and `dev/agents/interface-designer/wishlist.md`.

## 8. Course correction, 2026-09-11 — the mark becomes a menu, and Help un-merges

Tom, reading the shipped mark: *"The trade mark at the upper left now evokes Mac paradigm, and as
such it carries expectations. Work with Ida to fulfill those expectations."* He is right and §5-6
above are wrong on this one point — worth stating plainly rather than defending: I recommended
far-left placement by CITING VS Code and Figma (`js/looped-network.js:22508`, comment: "VS Code,
Figma, Docs"), and then built the LINK affordance of the third name in that list (Docs) at the
POSITION of the first two. **OBSERVED, the three precedents do not agree with each other**: Figma's
top-left mark opens a menu (Community files, Recent, Drafts, Import); VS Code's opens a menu (About,
Settings, Check for Updates, the way to close the window); Google Docs' is a plain link back to
Drive. Placing a mark at the Apple-menu corner — the leftmost slot of a command ROW that already
reads left-to-right as File/Edit/Map/Water/Help — invokes the two-out-of-three convention, not the
one-out-of-three. Docs gets away with a link because its mark sits OUTSIDE its own menu bar,
above it, in a document-chrome band with the title and the star — a different row, reading as
branding rather than as a peer of File. Ours does not have that second row; the mark sits IN the
same row as the other four menu buttons, same size class, same baseline. **Structural position
inside the row is what invited the expectation, not corner position alone** — SPECULATION, but the
only reading that explains why two of three cited precedents disagree with what shipped.

### A — ruling: yes, the mark becomes a menu

Convert `lpn_menu_home` from an `<a href>` to a `<button>` opening a flyout via `openMenu()`,
exactly the mechanism File/Edit/Map/Water/Help already use — same element shape, same click
target, same keyboard behavior, so nothing about the bar's existing interaction model grows a
special case. Icon and position are UNCHANGED (mono `water` glyph, far left, before File) — those
were never the problem; only the affordance was.

### B — contents of the mark's menu, in order

Apple-menu shape: identity first, application-global facts and actions in the middle, the way out
last and visually separated, same discipline the code's own comment already applies to the
outbound band in Help ("everything that leaves for another site, in one place").

```
About                                    -> toggleAboutPopup(), in-page box, unchanged
Learn more at LibreWaterNet.org          -> ext(), new tab, noopener
──────────────
Install                                  -> installPWA() / Install.php, unchanged fn
Privacy notice                           -> ext('privacy.php')
Terms of use                             -> ext('terms.php')
Cookie settings                          -> ecReopenConsent(), in-page, unchanged
──────────────
Leave for LibreWaterNet.org              -> same-tab href navigate (what the mark itself did)
```

Two LibreWaterNet.org rows are DELIBERATE, not a duplicate, and need two different labels for the
reason §6 already argued for the Help-menu version: a same-tab jump and a new-tab look are
different offers to a reader with an open, possibly-unsaved project. "Learn more at
LibreWaterNet.org" sits beside About because it answers the same question at more length,
immediately, one click deep; "Leave for LibreWaterNet.org" sits in its own final band because
leaving is the consequential action, same as Apple's own Restart/Shut Down/Log Out cluster sitting
apart from Recent Items and System Settings — SPECULATION dressed as a citation would overstate the
parallel, so: this project has no evidence macOS's own band-ordering rule is "consequential actions
last" beyond common observation of the menu, so treat that placement as this project's own
judgement, not a borrowed law. **Install moves here from Help** — it is an application-identity
action ("make this app part of your own environment"), a peer of About and Cookie settings, not a
piece of task learning like Walkthroughs or Screenshot gallery. Privacy/Terms/Cookie settings move
here too, for the exact reasoning §6-Q1 already gave for merging them with About — that reasoning
does not change, only WHICH menu they merge into does.

### C — resulting Help menu, and yes, partly undo what shipped this session

§6's Help changes (the legal-and-About merge, the `Install` row, the `LibreWaterNet.org` ext row)
are SUPERSEDED by §8, not layered on top of it — all four of those rows are moving to the mark's
menu, so leaving copies behind in Help would put Install and LibreWaterNet.org in two menus for no
reason, and would leave About's legal siblings answering to two different top-level owners at
once. Undo them.

```
Walkthroughs
Notes on this page
Toolbar key
──────────────
Fix something
──────────────
Screenshot gallery
Not EPANET
```

Seven rows, two separators, three bands — down from twelve rows and three separators. What is
LEFT is a genuinely different, narrower menu than what §0 started with: task learning (band 1),
one action (band 2), positioning/scope (band 3, "how does this relate to EPANET and what does it
look like elsewhere"). Nothing here answers "what is this software" or "where do its legal facts
live" any more — that question now has exactly one door, the mark, which is the whole point of
giving the mark a menu instead of a link. **This is the corrected read of Tom's scope-creep
complaint**: it was not that Help grew too many rows, it was that two DIFFERENT QUESTIONS ("how do
I use this page" and "what is this software") had drifted into one menu, and the mark's conversion
from link to menu is what finally gives the second question a home of its own.

### D — the phone

No change from what already shipped. The mark was already "icon-only at every width... the
small-screen rule that hides `.lpn-menubar-word` has nothing to do here" (`:22516`), and becoming a
`<button>` with a flyout costs it nothing there — it now behaves exactly like File/Edit/Map/Water/
Help already do under the 640px breakpoint, which already collapse to icon-only and already open a
flyout on tap. This is a SIMPLIFICATION at the CSS level, not a new case: the mark used to need its
own comment explaining why the icon-only rule didn't apply to it (because it was never a `button.
lpn-menubar-item` to begin with); once it is one, that carve-out goes away and it is governed by
the same rule as its five siblings, stated once.

### E — still a way back, same tab, Back works

Yes, one click deeper than before: open the mark's menu, then "Leave for LibreWaterNet.org," a
plain same-tab navigation exactly like the mark's own click used to be. The label states what
happens (leaving) rather than repeating the bare domain name a second time in the same flyout,
which is the ambiguity two identical row labels would have created. The genuinely new cost of this
whole change is real and worth saying plainly: the way back used to be ONE click from anywhere on
the page; it is now two. That is the price of matching the convention Tom named, and it is the
right trade — a single click that violates a learned expectation is worse than two clicks that
meet it, which is the entire argument this section makes.

### Ranked, this follow-on only

| # | Item | Cost | What it fixes |
|---|---|---|---|
| 1 | Convert the mark from `<a>` to a menu button (A) | reuses `openMenu()`, no new mechanism | the actual complaint — a link at the Apple-menu position |
| 2 | Populate its menu: About, Learn more, Install, Privacy/Terms/Cookie settings, Leave (B) | zero new strings — every row reuses an existing key/handler | gives "what is this software" one home instead of two |
| 3 | Shrink Help back down, undoing §6's merge (C) | zero — pure removal, rows move rather than duplicate | restores Help to task-learning only, which is what actually reads as scope creep resolved |

**If only one: #1.** The affordance is the defect Tom named; #2 and #3 are what #1 obligates, not
independent value on their own — a menu button that opens nothing new (just re-labels the old
link's destination as row 1) still fixes the expectation mismatch, and the content reshuffle can
follow after the demo if it must.

## Files

This document, appended (§8). No shipped file touched. Journal and wishlist updated at
`dev/agents/interface-designer/journal.md` and `dev/agents/interface-designer/wishlist.md`.

## 9. Tom calls a halt — "chasing our tail." Judged, not patched.

Tom: *"we are chasing our tail. Is the answer to scrap the Mac paradigm notion and throw its
items back under Help? Press Ida on this circular shoving match."* He is right about the shape
of the last five hours, and step 2 above is where it starts — I cited three precedents for
far-left PLACEMENT, then argued myself, twice more the same day, into fixing affordance
mismatches those same precedents predicted. Undoing three of my own rulings in one sitting is
the right outcome here, not a face-saving one, and it is worth saying so before the answer
rather than after it.

### Verdict: NO — scrap the Mac-paradigm menu. Keep the mark; make it a link again.

### The four questions

**1. "Is the upper left menu really anything anybody will know what to do with or care about?"
No.** Two independent reasons, one measured in this repo and one CITED from outside it.
Measured (§0 of this document, and `dev/session-handoff.md`): two of three test subjects in one
afternoon never saw the LABELED, WORD-BEARING menu bar at all. An icon-only item at the front of
that same unseen bar does not buy discoverability back — it adds one more unlabeled thing to the
same blind spot, now carrying MORE weight (identity, legal, the exit) than a menu row ever did.
CITED: even on the platform that invented this convention, the distinction it depends on is
non-obvious enough that consumer help sites still have to explain it in beginner language —
[iBoysoft's "Apple Menu on Mac"](https://iboysoft.com/wiki/apple-menu-on-mac.html) and
[MakeUseOf's "Beginner's Guide to the macOS Menu Bar"](https://www.makeuseof.com/mac-menu-bar-beginners-guide/)
both exist specifically to teach it to Mac owners. If native Mac users need a tutorial for the
left corner of their own system bar, a Windows-majority audience meeting it once, on a web page,
gets nothing from it.

**2. "Is the upper left menu what a Mac would call 'LWN'?" No — and we built neither slot
faithfully; we merged both into one.** CITED, [Apple's own Human Interface
Guidelines, "The menu bar"](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar)
and the supporting descriptions in
[iBoysoft](https://iboysoft.com/wiki/apple-menu-on-mac.html) and
[O'Reilly's "Using the Apple and Application Menus"](https://www.oreilly.com/library/view/mac-kung-fu/9781941222799/f_0013.html):
macOS has **two separate leftmost items**, not one. The Apple-logo menu is fixed by the system,
identical in every app, and holds machine-global things (About This Mac, System Settings, Sleep,
Restart, Log Out) — it is never about the app in front of you. Immediately to its right, a
SECOND menu, in **bold text naming the app**, holds the app-specific identity commands: About
This App, Preferences, Services, Hide, Quit. Ours conflated the two into one glyph: it sits at
the Apple-menu's fixed system position (leftmost, no label, icon only, same size class as its
five neighbors) but its CONTENTS are the second menu's job (About, Install≈Preferences, Leave≈
Quit). It is drawn like the first slot and behaves like the second, which is exactly the
"upper-left icon menu is now our Water menu's twin" problem restated one level up — two things
sharing one shape. **A CITED fact that settles it further: even cross-platform apps that run ON
macOS do not put this content in one shared slot outside Mac.** VS Code's own documentation:
*"On Windows and Linux: choose Help > About. On macOS: use Code > About Visual Studio Code."*
(Microsoft Learn / code.visualstudio.com's getting-started docs.) The bold-app-name-menu-with-
About pattern is Mac-ONLY even for software written to run everywhere; everyone else's About
lives in Help. We are a web page running mostly on Windows machines, and we had put About
somewhere no cross-platform precedent puts it outside macOS itself.

**3. "Should the link to the root be labeled 'Welcome page' or something like that?" Yes, name
it in words, not only in the bare domain.** CITED: [NN/g, "Homepage Links Remain a
Necessity"](https://www.nngroup.com/articles/homepage-links/) — clicking a logo to reach the
homepage is a well-learned convention but NOT understood by every visitor, and NN/g's own
recommendation is to carry **both** an implicit link (the logo/mark) **and** an explicit,
worded one, rather than relying on the icon alone. Recommend the tip/aria-label read something
like **"Welcome page — LibreWaterNet.org"**: it states what the click DOES (go to the site's
front door) ahead of merely repeating a domain string the reader may not parse as "home" at all.
This is cheap — one existing string edited, still a proper noun for half of it, nothing new
translated beyond what the tip already carries.

**4. "The Water menu ... 'Water' is far more descriptive [than 'Project'] ... and it no longer
matches the icon." Keep the name "Water." Keep the icon at "plan" for now; do not chase a third
icon before the demo.** Tom is not asking to rename the menu back — he is flagging that the
*icon* I put there under §8 (a rolled blueprint, "plan") reads as generic-project rather than as
water-network-specific, and a name/icon mismatch by itself was the original complaint (step 5).
**Judgement: this mismatch is real but tolerable, and is a different KIND of mismatch than
step 5's.** Step 5's defect was two menus sharing ONE identical glyph — a genuine collision, a
reader cannot tell the rows apart by shape. The current defect is an abstract icon (a plan)
standing for a concrete-sounding label ("Water") — but every other menu-bar icon in this bar is
already abstract relative to its label (a page corner for "File," a pencil for "Edit," a
push-pin for "Map," a question mark for "Help") and none of those are read as broken; a menu
icon's job is to be a stable, quickly-recognized SHAPE next to its neighbors, not a literal
illustration of the word. Recommend leaving `plan` in place through 16 September, and filing a
water-specific icon (a small pipe-and-junction glyph, distinct from `pipe` which already names an
asset type two levels down) as post-demo wishlist work, not urgent.

### Can one item be both the product's identity and a command menu? No.

Apple's own answer, cited above, is that it CANNOT — that is why the system built two adjacent
slots rather than one. We do not need to rebuild that second slot, because a native app has no
substitute for "which app is this" and needs a menu to say so; **a web page already has that for
free, in the browser's own tab title and address bar** — the identity job the bold app-name menu
exists to do on Mac is already done here by chrome we did not build and do not draw. Recreating
a second leftmost slot to hold it would be solving a problem this page does not have.

**So the mark gives up being a menu and goes back to being a link, and Help takes its rows
back — Tom's own proposed resolution, confirmed rather than second-guessed.**

### Final menu-bar shape

```
[mark: mono tower icon, link, same-tab, tip "Welcome page — LibreWaterNet.org"]
File | Edit | Map | Water (icon: plan) | Help | [language picker]
```

`lpn_menu_home` reverts from `<button open: openMarkMenu>` to a plain `<a href>` — undoing only
the Task 625 conversion (§8 above), not the icon or position, both of which were correct from the
start. `EngCalcs.lpnMarkMenuRows`/`openMarkMenu()` and its five rows are deleted rather than kept
unused, per this repo's own "a correction substitutes, it does not append" rule.

### What Help ends up holding

Everything §8 pulled OUT of Help, minus the two rows that were never Help's problem to begin
with (Install and Leave, which read as pure identity/exit actions with no natural Help-menu
home), returns:

```
Walkthroughs
Notes on this page
Toolbar key
──────────────
Fix something
──────────────
Install
Screenshot gallery
Not EPANET
──────────────
Privacy notice
Terms of use
Cookie settings
About
```

Twelve rows, three separators, four bands — exactly §6's shape, which was itself measured
against Word/Figma/VS Code's own Help menus (12-15 rows, "normal for the genre"). This is not a
regression to be apologized for: it is the shape that was correct before the mark was ever asked
to carry more than a click.

### Ranked, decisive

| # | Move | Cost | What it buys |
|---|---|---|---|
| 1 | Revert `lpn_menu_home` from menu button to plain same-tab link | delete `openMarkMenu()` and its five rows; no new strings | removes the conflation entirely — one glyph, one job, matching neither Mac slot and needing to match neither |
| 2 | Move About/Install/Privacy/Terms/Cookie settings back into Help | pure move, zero new strings | Help returns to being the one predictable place for "what is this software," which is what a Windows-majority, non-Mac audience already expects of a Help menu |
| 3 | Reword the mark's tip to name the destination in words | one string edit | meets NN/g's own logo-plus-words recommendation cheaply |
| 4 | Leave the Water menu's `plan` icon as-is; defer a water-specific icon | zero now | stops a fourth icon-chase before the demo; the mismatch left standing is cosmetic, not a collision |

**If only one: #1.** It is the one move that makes #2 correct rather than merely convenient, and
it is the one Tom named himself.

## Files

This document, appended (§9). No shipped file touched. Journal and wishlist updated at
`dev/agents/interface-designer/journal.md` and `dev/agents/interface-designer/wishlist.md`.
