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
