# The automated half of the `lpn_` punch list

```
cd dev/browser-pass
npm install          # once — playwright-core; the Chromium binary is already cached
node run.js          # everything — about four minutes
node run.js locking  # one section
```

Exit code 0 means every check passed. `--` lines are checks this environment **cannot** answer and
that stay on Tom's list; they are never counted as passes.

## §39 `cursorflicker` — and the rule that came out of it

It walks outward from a junction one pixel at a time on eight bearings and reads the cursor the
browser actually computes, which is how Task 569 was diagnosed: the "flicker at 12 px" was never a
ring, it was the strip of bare canvas between a node (`pointer`) and its own label (`move`), showing
`default`. The canvas now says `grab` and the section asserts it.

**It REPORTED rather than asserted for two commits, and the reason is worth keeping.** The property
was decidable, so asserting it was tempting — but it did not hold, the fix was a pending human
decision, and a spec that can never go green makes `node run.js` exit 1 for ever. This file's own
promise further up is that **exit 0 means every check passed**; a permanent red spends that promise
on something already written in the roadmap and turns the one signal that catches a real regression
into noise.

**The rule: a spec ASSERTS a property the tree is expected to hold, and REPORTS one it is known to
violate.** Open work belongs in `dev/ROADMAP.md`, read by someone deciding what to do next; a test
suite is read by someone asking whether anything broke. When the fix lands, the report becomes an
assertion — which is what happened here.

## §41's island hunt, and a report it could not reproduce

Tom, 2026-09-10, on an invisible 1 px border he had traced by hand: *"You have no idea how
painstaking it is to find an invisible line 1px wide even once, much less many times."* §41 now
reproduces his settings -- the Basic example, symbol size 100 px, link line thickness 30 px,
Thematic map on -- and walks outward from a junction, a reservoir and a pump one pixel at a time on
eight bearings, at three zooms, with the wheel anchored on each object in turn so it stays under the
pointer. It fails on a PHANTOM (an invisible hit band that is the whole of a run of two pixels or
fewer) and on a SLIT (a hairline run whose two neighbours are the same element).

**It found nothing, and the search that says so is worth recording so nobody repeats it.** 1.4
million samples over the whole canvas at 1 px on the XY Basic example, the XY Net3 and the
geographic Net3, at four zooms, in Chromium and in Playwright's Firefox; a 1.6-million-sample
sub-pixel raster at 0.25 px over a 400 x 400 window round one junction at 2.66x; and radial walks at
0.2 px steps out to 700 px. Every hit shape's width in SCREEN pixels is constant across zooms on
both an XY and a geographic drawing -- `.lpn-node-hit` 0, `.lpn-link-symbol-hit` 4,
`.lpn-link-hit` 30 -- so the stale-scale explanation ("a multiplication of pixels and map units") is
measured and refuted here rather than argued about. What is left unexplained is a real user
observation, and the honest reading is that something about his environment -- device pixel ratio,
browser, or a zoom the wheel cannot reach -- is not in this runner.

Because that section now passes by finding nothing, which is the shape that has already died of
success in this suite once, it ends by PLANTING one: a transparent circle round a junction,
`visibleStroke` with a one-screen-pixel stroke, so its interior answers nothing and its outline
answers as an invisible ring the drawing does not show. The walk must name it, and must stop naming
it when it is removed.

## The device pixel ratio sweep, and the variable it ruled out

Tom bisected his own environment, which is the one thing this runner could not do for him: *"I don't
get the flicker on another laptop I have."*, Chrome 152 on Windows, *"Windows scale 125%. Issue goes
away when I change to 100%. Distances change if I go to 150%."* **125% is device pixel ratio 1.25 and
is the out-of-the-box setting on a great many laptops**, so if it reached the cursor it would reach a
large share of real visitors rather than one developer. `Session.open()` therefore takes a third
argument that reaches `browser.newContext()`, and §41 ends by running the island hunt at **1, 1.25,
1.5 and 2**, walking **one DEVICE pixel at a time** -- 0.8 CSS px at 1.25, which are the only
positions a real pointer can occupy there and which a walk at 1 px samples none of.

**The prediction was that islands appear at the fractional ratios and not at the integer ones. It did
not hold, and the negative is sharp rather than vague.** The runs are the same at all four: the same
elements, in the same order, at the same distances to within the sampling step, no phantom and no
slit at any of them on the Basic example under Tom's own settings (symbol 100 px, link 30 px,
Thematic map on), and the geographic Net3's own findings are identical at every ratio including 1.
`document.elementFromPoint` is what the cursor is
resolved from, and Blink computes it in LayoutUnits, which are CSS-relative -- the ratio is not in
that arithmetic at all.

Three measurements from the same sitting, kept so nobody repeats them:

- **A hidden label's grab shape does not leak a hit at a fractional ratio.** `.lpn-lbl-hit` is
  `visibility: hidden` plus `pointer-events: visibleFill` in Thematic map, and it answered **0 of
  108,009** probes over its own box at 1.25, and zero at 1, 1.5 and 2. Relying on `visibility` to
  make a shape unhittable is sound here, measured rather than argued.
- **There is no uniform halo.** A walk compared against a REAL screenshot (`lib/png.js` reads the
  pixels) puts the ink FURTHER out than the hit answer on the median bearing at every ratio and
  every zoom, from a junction, a reservoir and a pump alike.
- **The geographic Net3 at those settings does produce one- and two-pixel runs of
  `.lpn-link-symbol-hit`, and they are the DECLARED 2 px slop** (`BAND_SLOP_PX`, Tom's own ruling of
  2026-09-10), identical at every ratio including 1. That is why the sweep asserts on the Basic
  example and reports the rest.

**What is left, said plainly: the OS input path, and it is not reachable from here.** The sweep
emulates the ratio the way a page sees it -- `window.devicePixelRatio` really is 1.25 -- but drives
the mouse through CDP in CSS pixels. A Windows mouse delivers a position in physical device pixels
and Chrome divides it by the scale factor before anything on the page sees it. **If the artefact
lives there it is not ours**, and no headless run can reach it. Saying so is a result; a speculative
patch would not be.

## Gecko is reachable now, and §42 is why it was needed

`node run.js` drives Chromium and only Chromium. On 2026-09-09 a user report named LibreWolf
(`dev/browser-pass/specs/areadrag.js` carries it), so **Playwright's own Firefox 153 was installed**
-- `npx playwright-core install firefox`, about 108 MB, cached in `~/.cache/ms-playwright` beside
the Chromium this runner already uses. It is the engine LibreWolf is, and a spec can be driven
through it in a few lines: `playwright.firefox.launch({ executablePath: <that binary> })` in place
of `env.launchBrowser()`, with everything else in `lib/` unchanged -- the PHP server, the sentinel,
`Session`, the pickers. LibreWolf's own hardening is `firefoxUserPrefs`:
`privacy.resistFingerprinting`, its `letterboxing`, `privacy.trackingprotection.enabled`,
`network.cookie.cookieBehavior: 5`.

**It answered the question it was installed for, in the negative, and that was worth the download.**
The whole select-area gesture matrix behaves identically in Gecko and in Blink, hardened and plain,
before the fix and after it -- so the report's own attribution to a browser was wrong, and two
engine-independent defects were what a user was actually meeting. `run.js` is deliberately NOT
made dual-engine on the strength of one investigation: that doubles a thirteen-minute pass to buy
a difference nothing has yet measured. Reach for Firefox when a report names one, the way this did.

**One thing Gecko did find that Chromium cannot**, with site data blocked
(`dom.storage.enabled: false`): the service-worker registration in `lib/HeadersFooters.lib.php`
raised an UNCAUGHT `SecurityError` on every page load, because the wide-scope `register()` had a
`.catch()` and the narrow-scope fallback inside it did not. **Fixed 2026-09-09**: both promises are
caught, and the whole block sits in a `try`, since where site data is blocked the property access
itself can throw before any method is reached. An offline suite is not available in that browser
either way; the page works, and it must not shout about it.

## §25's two timing bounds fail on a slow machine, and that is not a regression

**Measured 2026-09-06 in this WSL2 checkout, with other work running beside it:** the 736-element
grid took **53,193 ms** to open against the 2,081 ms the spec's own header records, a wheel notch
680.8 ms against a 250 ms bound, and the Close 23,758 ms against an 18,000 ms one. Two reds, no
change to any product file, and every counted check in the same section green — including the two
that answer Task 436's question, because a COUNT does not care how fast the machine is.

**Read the open time first.** It is reported and never asserted precisely so it can be used this
way: if it is an order of magnitude off the number in the header, the two bounds below it are
measuring the machine and mean nothing. Do not loosen them to make this box pass — the bounds exist
to catch a quadratic coming back, which is an order of magnitude, and a bound loose enough for a
loaded WSL2 would not catch one.

## A third of this pass was dead for two days, and the foot of the report said so

**2026-08-29.** Twelve of the thirty-eight sections threw at their first line and never ran. The
cause was one method: `Session._newFromTemplate()` drove `File ▸ New project… ▸ <template>`, a
FLY-OUT that Task 477 replaced with the New-project BOX on 2026-08-27. `menuClickSub()` then waited
thirty seconds for a popup that no longer opens and threw — so every spec that begins by making a
project died before its first assertion. Three more stale references were found in the same sweep:
`#lpn_menu_insert` (the Insert menu, deleted by Task 543), `#lpn_menu_view` (renamed to Map by the
same task), and `New project…` still being expected to carry a fly-out arrow.

**The signal was there and nobody read it.** Every run ended with

```
26/38 sections completed  <-- SHORT RUN: the rest threw and did not finish.
```

which is honest, and useless as an alarm: it says how many sections finished, not which ones or why,
and it sits under a cheerful `849/864 checks passed`. **A pass that reports a high percentage of a
shrinking denominator is worse than one that fails**, because the number goes UP as coverage falls.

Two things follow, and neither is "read the last line more carefully":

- **The count of sections is part of the contract.** `run.js` knows how many specs it was asked for.
  A short run should be as loud as a failure, and it should NAME the sections that threw.
- **A helper that drives a menu is a shared seam and belongs in `lib/session.js`,** which
  `TEMPLATES` already got right for its labels and got wrong for its mechanism. When the UI moves,
  one file should have to change.

## Why this exists

Tom, 2026-08-06: *"I am very tired and feeble-minded right now. Is there any way that we can proceed
without my working through the test punch list?"*

Mostly, yes. `dev/lpn-file-lock-test-punchlist.md` is 78 checks over two browser profiles, and it has
been run by hand three times in three days. Everything below drives **the real page** in a real
Chromium against **the real `lpn-lock.php`** on a real PHP server, and re-runs in a few minutes.

It found four defects in its first hour, three of which no human pass would ever have found:

1. `pageCalculatorInitialize` was missing, so **every first-time visitor's** page half-initialised.
   Tom's browser has had the cookie for weeks.
2. A listener for a "View printable" button that is not on that page — throwing on every load.
3. `Accept-Language: *` — one header, no q-value — **500'd every page in the suite** on PHP 8.
4. Arriving and reloading before touching anything left the tab strip **empty**, with edits saving
   under an id no index entry knew about.

## How the one lie works

`showSaveFilePicker()` and `showOpenFilePicker()` open native OS dialogs that nothing can drive. This
runner replaces **those two functions and nothing else** (`lib/pickers.js`), returning handles to
files in the **origin private file system**.

That is what makes it honest: an OPFS handle is a real `FileSystemFileHandle` — same class, real
`getFile()` / `createWritable()` / `isSameEntry()`, structured-cloneable so IndexedDB genuinely keeps
it across a reload (Task 212's whole mechanism), and `queryPermission()` genuinely answers `granted`.
Every line below the picker is production code. The lie stops at the dialog.

The stub is injected with `addInitScript`, so **no test-only code ships in the page** — no flag, no
seam, no build step. The page does not know it is being tested.

## Two profiles, one file

`Session` is a browser **context** — its own `localStorage`, its own identity token, so a lock really
does read as somebody else's. Two tabs of one context would share the token and see no contention at
all, which is the trap the punch list warns about in §0.

OPFS is per-profile, so the runner plays the network share: `share.from(A)` then `share.to(B)` is
literally *"A saved it, B opened it"*. It writes only what actually differs — pushing identical bytes
would advance the file's modified time and trip the very freshness check these checks are about.

## The other runner in here: `mi-defaults.js` (ROADMAP Task 233)

```
node dev/browser-pass/mi-defaults.js      # 10 checks, a few seconds
```

Nothing to do with `lpn_`. It lives here because it needs the one thing `dev/calc-spike/` does not
have — a real browser. **Manning-Irregular writes no result at all until its seed cookie has built
its station rows**, so the calc-spike smoke harness runs the page and then says so rather than
asserting, and Task 233's two defects (an English page opening in metric, and a ⚠ Low velocity on
arrival in *both* presets) sat behind exactly that gap. It opens the page on a fresh context in
`en` and in `es` and asserts every unit select matches the preset the page rendered in, and that
the verdict cell is not a caution.

It uses `lib/env.js` like everything else in here. It once carried its own server because `env.js`
bound a constant port 8899 under the repository's *parent* as docroot — which contains no
`engcalcs/` when the checkout is a git worktree, and which let a server another session had left on
8899 answer the readiness probe while our own `php -S` failed to bind in silence. Both faults let a
whole pass run green against somebody else's files, and one of them did.

**That is fixed in `lib/env.js` and the rule now holds for every runner in here** (ROADMAP Task
387): the port is asked of the OS, the docroot is a temp directory symlinked to the repo root as
`git rev-parse --show-toplevel` reports it, and a random per-run **sentinel** written into that temp
docroot is fetched back and compared before the browser is launched. Only our own server can serve
it. A mismatch throws, naming the port, the docroot and what answered instead — the failure that
used to be silent is now the loudest thing in the run.

## The fourth runner in here: `measure-probe.js` (MJH, 2026-09-09)

```
node dev/browser-pass/measure-probe.js            # every scenario, in Gecko
node dev/browser-pass/measure-probe.js baseline   # one of them
node dev/browser-pass/measure-probe.js --chromium
```

Not part of `run.js`, and it asserts nothing. It opens the lat/lon Net3 example under a series of
DEGRADED measurement APIs -- `getScreenCTM()` returning null and returning the identity, a zero
`getBoundingClientRect()`, zero `clientWidth`/`clientHeight`, a throwing `getBBox()`, a zero
`getComputedTextLength()`, a `ResizeObserver` that never fires, and blocked site data in each of its
three shapes -- and prints the canvas box, the world transform, the four scale-derived custom
properties, the tile zooms, a 5x5 grid of hit tests, whether an edit lands, and the dominant colours
of a real screenshot. **`lib/png.js` is what makes the last one possible**: this tree has no image
library at all, so a claim about pixels was previously unanswerable here.

It exists because a user report is a claim about an ENVIRONMENT, and the only honest way to accept
or reject one is to build the environment. Its own header carries what it found, what it ruled out,
and the thirty-second console snippet to send to a user who can reproduce something we cannot.

## The third runner in here: `fieldgrid-layout.js` (ROADMAP Task 478)

`node fieldgrid-layout.js [--ref=HEAD] [--langs=de,bg,ar] [--width=1400]`

Not part of `run.js`, and not about `lpn_`. It answers one question about a REFACTOR: **did anything
move?** It serves the suite twice — once from `git archive <ref>`, once from the working tree — opens
every calculator page in both, and compares the box of every control against the form's own origin.
That is the only honest way to check "this rewrite changes no pixel", which is a claim reading markup
cannot support and which no other check in the suite can see.

Two things it taught the change it was written for, neither of which anyone would have found by
inspection: a 2px+2px cell padding substituted for one space narrowed **every** calculator by 1.1px
and dragged the results column with it; and where a language's unit names make a dropdown very wide,
the old table used to wrap it under its input, which two grid columns cannot do. Use it for any
future change to `echoCalculatorForm()` — and note that it is only meaningful BEFORE the change is
committed, since after that `HEAD` is the change. Pass `--ref` to compare with something older.

## Reading a line that says DEFECT

A handful of checks are worded as **DEFECT**, and they pass. They pin what the page does TODAY where
that is known to be wrong, so that fixing it breaks the line and whoever fixes it reads the note at
the top of that spec. The alternative — leaving the check red — makes `node run.js`'s exit code
useless and trains a reader to skim past failures, which is the one thing this runner cannot afford.
A DEFECT line always names its task and its cause. As of 2026-08-18 there are four, over two faults:
the examples gallery forgetting it was dismissed (`specs/gallery.js`, Task 431) and the map page's
document still being taller than its window (`specs/noscroll.js`, Task 432).

## What is left for Tom — one box

As of 2026-08-06, after the §H pass and the specs it produced, the honest answer is **one retest**:

- **§H4 / §10 — a file moved or renamed in Explorer.** Save it, move the file, edit, press Save.
  Expect an **amber banner**, **Choose the file again**, the asterisk still lit, and **no new file at
  the old name**. Tom reported this as a successful save twice, for two different reasons — the
  second being that moving a file does not make the write fail at all: `createWritable()` recreates
  it at the old path, so the save genuinely succeeds and you are left editing a file you did not
  choose. Both are fixed and **the runner now tests this** (OPFS turned out to behave exactly like a
  real folder, which retired the excuse for skipping it). It stays here because a real Explorer move
  on a real NTFS path is still the only proof that matters.

Everything else in `dev/lpn-file-lock-test-punchlist.md` is now `[x]` or `[auto]`, and its remaining
empty boxes are in the **Appendix**, which is history and is never to be worked.

**Worth a glance next time you are in there anyway, but nothing is waiting on them:**

- The tip wording on **Save as…** in a real Firefox (§11). The runner takes that branch by deleting
  `showSaveFilePicker` — the one property the page tests — so the behaviour is covered; the tip's
  prose in a real Firefox is not.
- The 60-second poll that clears the lock banner when the broker comes back (§9). Automating it costs
  a minute per run to prove one line, which is the wrong trade.
- **"1 minutes ago"** in the lock dialog — known, and deliberately left until the `lpn_` translation
  sprint, when three singular forms would otherwise become 78.

## Why the rest cannot be automated

- **§1 the native picker's user-activation handshake.** The training panel exists precisely because
  `showSaveFilePicker()` needs a live activation and Chrome's expires in seconds. A stub needs none,
  so the runner proves the panel appears, gates the picker, and reaches it — not that Chrome agrees.
  **Tom passed this by hand on 2026-08-06**, which is the single most valuable box in the file.
- **§6/§8 a permission that is `prompt` or `denied`.** OPFS is always `granted`, so the silent
  reconnect is covered and the dormant-grant revival on first gesture is not. **Passed by hand,
  2026-08-06**, using Chrome's Site settings → File editing → **Block**.
- **§10 a real folder.** As above.
- **§11 Firefox and Safari's own rendering.** The BRANCH is covered; the pixels are not.
- **Anything visual**: banner colours, the Save-all flicker, print layout.

## Adding a check

Specs speak in menus, banners, tabs and dialogs — never in selectors. That is not tidiness: when Task
211 renamed half these controls, every punch-list check that named one silently became a check of
something that no longer existed. One file (`lib/session.js`) knows the selectors, so the next rename
breaks the pass loudly, in one place.

Before adding a check here, ask whether it needs a browser at all — logic that can be sliced out
belongs in `dev/lpn-spike/handle-restore-harness.js`, which runs in a second.

**And that is exactly how it failed anyway** (ROADMAP Task 414). The vocabulary held; what went stale
was one sentence's MEANING. `Session.drawExample()` clicked a toolbar button that Task 264 retired,
so the suite stopped at 15 of its checks and stayed there — the other 124 were neither passing nor
failing, they were unrun, and nobody noticed because nobody ran it. Two lessons, both cheap:

- **A setup helper must verify that its setup happened.** `Session.makeEdit()` — the substitute, one
  ordinary junction placed on the map, chosen because it is what the retired button really was: *an
  edit made, no file written, this tab dirty* — counts the nodes before and after and throws when the
  click lands on nothing. Neither of the flows examples moved to is that sentence: `Open example…`
  lands a SAVED project in a NEW tab, and `New project…` an empty clean one (that is
  `Session.newProject()`).
- **A check that cannot fail is worse than one that does.** Two specs asserted the tab was dirty after
  an edit, on a first-visit project that arrives dirty before any edit — see the note at the top of
  `specs/boot.js`, which is a live page defect. They now assert which asterisk it wears, which is a
  fact that can be wrong.
