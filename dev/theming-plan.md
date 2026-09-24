# Theming — a phased plan (R-211)

Ida (interface-designer), 2026-09-24. Written for Tom's 2026-09-24 request: *"Ask Ida to prepare
a phased plan for our roadmap to implement/offer theming choices in Settings... I think that
preparing for this and implementing it will force us into some important code discipline."* He is
right about the discipline; the plan below is built to deliver that discipline FIRST and treat the
Settings toggle as a late, cheap phase that falls out of it — not the other way round.

**No shipped file touched by this document.** Every OBSERVED number below is from this checkout,
2026-09-24.

## Inventory — what exists today

**No design tokens.** OBSERVED: zero `:root { --x: ... }` declarations in `css/engcalcs.css`
(30,6499 bytes, one file, no `css/vendor` contribution beyond a third-party asset). The nine
`--lpn-*` custom properties that do exist (`css/engcalcs.css:385,497,2987,2992,3002,3003,3007`)
are **layout tokens** (a width, an opacity, one map-ink colour used for a specific overlay) — none
is a colour SYSTEM, and none is consumed by more than the one rule that declares it. `grep -c
"var(--"` = 55 uses total, all local.

**Hard-coded colours, counted:** `css/engcalcs.css` alone carries **303** literal hex colours.
Across `js/*.js`, **1,114** hex-colour string literals — but that total is misleading read flat:
**1,025 of them are in `js/lpn-ramps.js` alone**, which is colour-ramp DATA (ColorBrewer-style
palettes for value-driven map colouring, CLAUDE.md's own `refreshValueColors()` note that "an
inline style is what the stylesheet's own black loses to"). That is thematic MAP content, not UI
chrome, and it is explicitly OUT OF SCOPE for this plan — a ramp is a drawn result, like a pipe's
own black ink, not a button's paint. The chrome-relevant remainder is small and countable:
`js/looped-network.js` 53, `js/branched-network.js` 11, `js/micro-hydro-power.js` 14,
`js/rock-chute.js` 11 — under 90 UI-chrome hex literals suite-wide, mostly inline `style=` writes
for notices, flashes and legends.

**Dark mode: exactly one media query, two rules.** OBSERVED, `css/engcalcs.css:1961-1965`:
```
@media (prefers-color-scheme: dark) {
	.lpn-example-card { background: rgba(38, 38, 38, .94); color: #eee; }
	.lpn-examples-blank { color: #8ab4e8; }
}
```
with the deliberate exclusion recorded in the same block: *"The thumbnail keeps its white paper
and its dark ink — deliberately NOT themed."* This is the ONLY themed surface in the whole suite.
Every other pixel — menu bar, toolbar, tab strip, Settings box, Properties box, the map canvas
itself — is fixed-light regardless of OS preference. A visitor who has set their OS or browser to
dark mode today gets dark example cards floating in an otherwise fully light application, which is
itself evidence the current approach (bolt one `@media` block onto one component when it is
noticed) does not scale and was never meant to.

**Component-style count** (candidate kinds a theme would have to reach, one canonical style per
kind is the phase-1 goal): distinct "boxed panel" styles found by name —
`.lpn-setbox`, `.lpn-propbox`, `.lpn-findbox`, `.lpn-runbox`, `.lpn-libbox`, `.lpn-ffbox`,
`.lpn-msglog-panel`, `.lpn-color-legend`, `.lpn-dragpanel`, plus the ad hoc offscreen-notice card
(R-227, below) — **at least nine independently-declared "box" treatments**, each with its own
background/border/radius/padding written out by hand rather than composed from a shared rule. Two
notice/warning colours exist and are at least reused correctly: `#fffbe6` background / `#a80`
border for a warning-level notice (`#lpn_map_notice`, `#lpn_status`, `.lpn-msglog-panel-warn`, all
OBSERVED) — the ONE piece of colour discipline already present, and worth explicitly preserving as
"the warning token" once tokens exist, rather than rediscovering it.

**Conclusion:** there is no infrastructure to hang a theme choice on. Phase 1 has to build it.

## The Settings-storage question, decided now so later phases don't re-argue it

**A theme choice is a BROWSER setting, never a project setting**, under CLAUDE.md's own rule
(`lpn_` settings belong to the project or the browser, never both — modelling data rides in
`serializeProject()`, window furniture is `localStorage` only). A theme is a fact about the
READER's screen and eyes, not about the network being modelled — the same category as
`lpn_pane`/`lpn_setbox` sizing, not the same category as units or friction method. **It follows
`localStorage`, keyed like the other furniture items, and a colleague opening your file inherits
none of it** — exactly the same reasoning CLAUDE.md already gives for pane sizes.

**Storage/consent:** no new consent language needed. `dev/storage-rulings.md`'s exemption test —
"is it strictly necessary for a service the visitor explicitly requested" — is already satisfied by
an explicit preference (the rule's own worked example is `ec_language`; window-furniture
`localStorage` keys already ride with no consent gate at all). `consent_body` (`lib/lang.ec.en.php:100`)
covers only the one-digit analytics cookie today and does not need a new sentence for a theme key,
for the same reason it needed none for `lpn_pane` or `ec_language`.

## Phased plan

### Phase 1 — the discipline itself (no visible change, no Settings row yet)

**Size: medium, one to two weeks of steady work, no translation cost, no visual change on ship.**

1. **Declare a token sheet.** A `:root` block in `css/engcalcs.css` (or a small new
   `css/engcalcs-tokens.css` loaded first) naming the SEMANTIC roles a colour plays, not the hues
   themselves yet: `--ec-ink`, `--ec-bg`, `--ec-panel-bg`, `--ec-panel-border`, `--ec-border`,
   `--ec-accent`, `--ec-warn-bg`, `--ec-warn-border`, `--ec-hover-bg`, `--ec-hover-border`. Values
   at first are exactly today's literals (`--ec-warn-bg: #fffbe6;` etc.) — phase 1 is a rename, not
   a redesign, so nothing visibly changes and there is nothing for Tom to review beyond "does it
   still look identical."
2. **Consolidate the box styles.** Rewrite the nine-plus independent "box" rules to compose from
   one shared `.ec-panel` (or extend it) using the new tokens, so a colour change in one place
   moves every panel. This is where the promised discipline actually lands: today changing "the
   warning colour" means finding and editing three or four independent hex literals by hand
   (`#lpn_map_notice`, `#lpn_status`, `.lpn-msglog-panel-warn` each declare their own copy); after
   phase 1 it is one token.
3. **One button style, one notice style.** Fold the toolbar/menu-bar button paint
   (`css/engcalcs.css:1260`'s `.lpn-menubar-item`/`#lpn_toolbar button` pair, already unified per
   `dev/app-chrome-postdivorce-recommendations.md` §F) and the warning-notice paint into token-based
   rules. **This is also where R-227's offscreen-notice card should land** — see below, it does not
   wait for phase 2.
4. **A check that refuses a new hard-coded chrome colour**, feasibility confirmed: a script over
   `css/engcalcs.css` and the non-`lpn-ramps.js` UI files, flagging any new `#[0-9a-fA-F]{3,6}` or
   `rgb(`/`rgba(` literal outside an explicit allow-list (the token file itself, and
   `js/lpn-ramps.js`'s data palette, named as the one deliberate exemption). Modelled on
   `dev/scripts/lang_syntax_validate.php`'s own shape (flag, don't auto-fix, explain why in the
   failure text). **Done-test:** the check passes today (after the phase-1 rewrite) and fails on a
   deliberately reintroduced literal in a throwaway branch.
5. **Done-test for the whole phase:** `check_all.sh` still green, a full-page pixel screenshot at
   1920×1080 and 390×844 is byte-for-byte unchanged from before phase 1 (a regression here means the
   token rewrite silently changed something, which is the one failure mode phase 1 must not have),
   and the new hard-coded-colour check exists and passes.
6. **What it unblocks:** phases 2 and 3 below, the dark-mode-everywhere fix implied by the
   inventory's own finding (currently one component out of nine-plus is themed), and any future
   colour-by-value work (Task 384/327) gets a real boundary between "data colour" (never tokenised,
   `lpn-ramps.js` stays literal) and "chrome colour" (always tokenised) instead of the two being
   mixed by convention only.

### Phase 2 — a real dark theme, still no Settings row

**Size: small, once phase 1 exists** — this is the payoff of phase 1 being real rather than
decorative. Add a second token set under `@media (prefers-color-scheme: dark)` (or a `[data-theme]`
attribute selector, decided in phase 3) that overrides the phase-1 custom properties. Because
every chrome colour by now comes from a token, this phase is "write the dark values once," not
"find every place a colour is written." **Done-test:** the map canvas's own ink (black
built/blue water, per the suite's sketch convention) stays UNTHEMED on purpose — same exclusion
`css/engcalcs.css:1961-1965`'s comment already states for the example thumbnail, generalised: a
network's own drawing is data, like a printed sheet, and a themed drawing would make a screenshot
shared between two people look like two different networks. Chrome themes; the drawing does not.

### Phase 3 — the Settings choice

**Size: small.** One Settings row (System / Light / Dark), three values, written to `localStorage`
under a new key (e.g. `lpn_theme`, alongside `lpn_pane` and friends) — the browser-setting category
already argued above. "System" (the default) means "no override, follow
`prefers-color-scheme`" — phase 2's media query already does this for free; the row's only new job
is letting a reader PIN Light or Dark regardless of their OS setting, which needs the `[data-theme]`
attribute selector on `<html>` as the mechanism (an attribute the media query and an explicit
override can both target, one cascade). **Done-test:** switching the row repaints every themed
surface with no reload; reloading in a fresh tab restores the last choice; a colleague opening a
shared project file sees their OWN setting, never the author's — provable by the storage-question
section above and confirmed by grep (the key is not present anywhere `serializeProject()` writes).
**What it unblocks:** nothing downstream is gated on this phase; it is the visible payoff Tom asked
for, not a dependency for anything else on the roadmap.

### What this plan deliberately excludes

- **Colour-by-value ramps** (`js/lpn-ramps.js`) stay hard-coded, by design (see inventory) — a
  theme changes how the CHROME reads to the eye, never how a value is encoded on the drawing.
- **A user-authored custom theme / colour picker.** Not asked for, and CLAUDE.md's own
  "never a 'save current settings as default' button" instinct argues against inventing a save
  surface for something nobody has requested. Three fixed choices (System/Light/Dark) is the whole
  ask.
- **Per-project theming.** Explicitly ruled out by the storage-question section — a theme is the
  reader's choice, not the file's.
