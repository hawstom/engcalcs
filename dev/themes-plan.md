# Themes: a gallery, the axes, the selector, and "the same, but better"

Ida (interface-designer), 2026-10-17, on branch `feat/theme`. Written for Tom's 2026-10-17 request for
"fun and useful themes" (high contrast, Mac, retro eras and devices, monochrome amber and green, rounded
corners, icons, fonts, colours), a fun theme selector, and "an eventual upgrade of our default aesthetics".
It builds on `dev/theming-plan.md` (Task 714, closed: tokens, the dark set, System/Light/Dark).
**No shipped file is touched by this document.** Provenance tags: OBSERVED (this checkout, 2026-10-17),
CITED (external, named), SPECULATION (mine, not yet sourced).

## What I looked at, and the one finding that shapes everything

I rendered `Looped-Network.php` and `Manning-Pipe-Flow.php` in the harness Chromium (1300 to 1400 wide) and
then PROTOTYPED the themes below by injecting derived token values onto `<html>` at run time, so what
follows is not a guess at what tokens can do.

- OBSERVED: **the existing tokens carry the application's chrome completely.** Under the amber, platinum,
  blueprint and handheld seeds below, the menu bar, toolbar, transport, tab strip, legend, notices, map
  controls and the whole calculator form re-coloured with no CSS edit. Task 714 did its job.
- OBSERVED: **what does not follow, and a builder must be told**: (a) on the calculator pages, the
  Bootstrap navbar (`lib/Menus.lib.php:97`, `navbar-light bg-light`) stays white and the page links stay
  Bootstrap blue; (b) the calculator tables' blue lattice (`--ec-debug-grid: blue`, `css/engcalcs.css:58,401`)
  is a pure `blue` that no theme set tames; (c) value-coloured map symbology (`js/lpn-ramps.js`) is a fixed
  ramp: on a dark paper its darkest class (viridis purple, "< 0.4 m/s") nearly vanishes, which is the best
  argument I have for deciding the MAP question deliberately (below).
- OBSERVED (`css/engcalcs.css:12-137`): **the token block is 130 names, and about 60 are named by VALUE**
  (`--ec-gray-eee`, `--ec-hue-1976d2`). The dark set therefore hand-writes 130 values, twice (explicit and
  `prefers-color-scheme`). Nine more themes written that way is 2,600 hand-chosen values, none of them
  checkable by a person. **That is the real cost of this project, and the plan's first move is to remove it
  (next section).**

## The architecture that makes a gallery cheap: a theme is about 25 seeds

**A theme declares SEEDS; everything else derives from them with `color-mix`.** `color-mix(in srgb, ...)` is
already used in this stylesheet (`css/engcalcs.css:869`), so no new browser floor.

The grey ladder is derivable EXACTLY. Every `--ec-gray-xxx` is the light set's grey at some distance between
paper white and ink `#333`; `t = (255 - v) / 204`, so `--ec-gray-eee: color-mix(in srgb, var(--ec-bg), var(--ec-ink) 8.3%)`
reproduces `#eee` byte for byte in the light theme (OBSERVED arithmetic: `#fff` to `#333` is linear in sRGB
space, which is what `in srgb` mixes). Verified for every grey by `dev/scripts`-style arithmetic in my
prototype; the pixel-diff proof (`dev/browser-pass/pixel-shots.js`) is the builder's done-test, as in Task 714.

| Derived token | Formula from the seeds | Light result vs today |
|---|---|---|
| `--ec-gray-NNN` (all 20) | `mix(bg, ink, (255-0xNNN)/204)` | exact |
| `--ec-ink-strong` | `mix(ink, ink-black, 35%)` | #212121 vs #222 |
| `--ec-ink-muted` / `-subtle` | `mix(ink, bg, 16% / 25%)` | #54 / #666 exact |
| `--ec-border` | `mix(bg, ink, 16.7%)` | #ddd exact |
| `--ec-accent-hover-bg` / `-open-bg` | `mix(bg, accent, 8% / 16%)` | #ebf0f8 vs #eaf1fc |
| `--ec-hover-bg` / `-pressed-bg` | `mix(bg, accent, 14% / 24%)` | near |
| `--ec-hover-border` / `-pressed-border` | `mix(bg, accent, 45% / 60%)` | near |
| `--ec-select-bg` / `-strong` | `mix(bg, accent, 9% / 18%)` | near |
| `--ec-held-bg` | `mix(bg, held, 20%)` | near |
| `--ec-form-bg` | `mix(bg, accent, 3%)` | #f7f9ff exact-ish |
| `--ec-hue-*` (40) | **assign each a ROLE first** (Phase 0), then derive from that role's seed | n/a |
| translucent `--ec-a-255-255-255-NN` and `--ec-map-overlay-bg` | `color-mix(in srgb, var(--ec-bg) NN%, transparent)` | exact |

**Phase 0, before any theme (and it is the "code discipline" Tom wanted from Task 714, finished):** give the 40
`--ec-hue-*` and the 20 `--ec-gray-*` roles instead of values. `grep` where each is used; most are a tint of
accent, a tint of the warning, or a grey step. Rename with `dev/scripts/rename_lang_key.php`'s spirit but for
CSS (a one-off script). The light theme must not move a pixel (`pixel-shots.js diff`). The dark block then
shrinks from 130 lines to its seeds, and two selectors no longer carry 130 duplicated lines each (today
`theme_contrast_check.js` exists only to police that duplication).

**One more structural fact.** CSS custom properties re-evaluate where they are USED, so the derived tokens
live once on `:root` and a theme block overrides only seeds:

```css
:root { --ec-bg:#fff; --ec-ink:#333; /* ...25 seeds... */
  --ec-gray-eee: color-mix(in srgb, var(--ec-bg), var(--ec-ink) 8.3%); /* ...derived, once... */ }
:root[data-theme="amber"], .ec-theme-card[data-theme="amber"] { --ec-bg:#140c00; --ec-ink:#ffb000; /* ... */ }
```

**The second selector, `.ec-theme-card[data-theme=...]`, is what makes the selector fun** (see Selector): a
gallery card is a live miniature painted by the theme's own tokens, so it can never drift from the real thing.

## New tokens (named, justified)

| New token | Why | Light default (no visible change) |
|---|---|---|
| `--ec-chrome-bg` | Menu bar, toolbar, tab strip need a surface of their own. Today they are transparent over white, the same colour as the map paper, separated by 1 px. Platinum needs it; "the same but better" #1 uses it. | `var(--ec-bg)` |
| `--ec-map-paper`, `--ec-map-ink` | The map's paper and neutral ink as tokens, so a theme MAY paint the map (decision below). They feed `--lpn-map-bg` (`css/engcalcs.css:799`). | `#fff`, `#000` |
| `--ec-radius-s` / `-m` / `-l` | 44 literal `border-radius` sites in 5 distinct sizes (3, 4, 5, 6 px and the tab's `4px 4px 0 0`). Three tiers: input and small control; button, tab, card; box and dialog. Subsumes `--ec-btn-radius`. | 3px / 5px / 6px |
| `--ec-font-ui`, `--ec-font-mono` | `body { font-family: sans-serif }` (`css/engcalcs.css:393`) and four hand-written mono stacks (`:614, :2297, :2902, :2019`). | see "better" #1 |
| `--ec-icon-stroke`, `--ec-icon-cap` | Icons are strokes (`lib/Icons.lib.php:46`, one `stroke-width="2"` on the `<svg>`). A CSS `stroke-width` on `.ec-icon` overrides that presentation attribute, and a path that sets its own width or `butt` cap (`:241, :360-362`) keeps it. **A whole theme changes the icon set's weight with two lines and no redraw.** | 2 / round |
| `--ec-shadow` | 45 ad hoc `box-shadow` sites; retro themes want a hard offset shadow or none; the default wants one soft one. Used by floating boxes only. | `0 2px 6px var(--ec-a-0-0-0-3)` |
| `--ec-tile-filter` | A CSS `filter` for the street-map tiles so a monochrome theme does not sit on a pastel OSM map. No extra tile request; attribution untouched. SPECULATION until the builder confirms the tile element accepts a filter. | `none` |
| `--ec-bevel` | Optional inset highlight/shadow pair for Platinum's buttons. Only Platinum uses it in branch 1. | `none` |

No new colour literal outside the token block: `chrome_colour_check.php` keeps its meaning. Radii and fonts
are not colours, so that check does not police them; a sibling "no literal radius in a chrome rule" check
is cheap and belongs with the radius sweep, not before.

## The gallery

Seeds, hex, per theme. **Measured** contrast (WCAG relative luminance, computed by my script from these exact
hex values; see journal) is under the table. `light` and `dark` are today's values re-stated as seeds;
the light column is today's, including its flaws (see "better" #2).

| seed | light | dark | high-contrast (light) | high-contrast (dark) | amber | green | platinum | blueprint | handheld | paper |
|---|---|---|---|---|---|---|---|---|---|---|
| bg | #ffffff | #1e1f22 | #ffffff | #000000 | #140c00 | #031003 | #ffffff | #0b2f5b | #9bbc0f | #f6efdc |
| chrome-bg (new) | #ffffff | #1e1f22 | #ffffff | #000000 | #1d1100 | #061a06 | #dddddd | #0e3a70 | #8bac0f | #efe6cd |
| ink | #333333 | #d5d8dc | #000000 | #ffffff | #ffb000 | #33ff66 | #000000 | #e6f0ff | #0f380f | #3a2e1c |
| ink-black | #000000 | #ffffff | #000000 | #ffffff | #ffd37a | #a6ffbd | #000000 | #ffffff | #0f380f | #1c1408 |
| accent | #0645ad | #8ab4f8 | #0000b3 | #7fd4ff | #ffd37a | #a6ffbd | #2a2a9a | #ffe27a | #0f380f | #7a3410 |
| accent-hover | #1f58b5 | #aecbfa | #000080 | #b3e6ff | #ffe3a8 | #d2ffdf | #1a1a7a | #fff0b0 | #0f380f | #5e2708 |
| accent-open | #05378a | #aecbfa | #000066 | #ffffff | #ffffff | #ffffff | #101060 | #ffffff | #0f380f | #451c05 |
| point | #c2185b | #ff6fa3 | #b0004a | #ff7ab8 | #ffe3a8 | #d2ffdf | #c2185b | #ff9ec7 | #0f380f | #b0235a |
| brand | #1a6faf | #62b0ea | #00399e | #7fd4ff | #ffb000 | #33ff66 | #2a2a9a | #8fc4ff | #0f380f | #8a4a14 |
| brand-hover | #14588c | #8cc4f2 | #002a75 | #b3e6ff | #ffd37a | #a6ffbd | #1a1a7a | #bddcff | #0f380f | #6e3a0e |
| warn-bg | #fffbe6 | #3a3318 | #ffffcc | #2e2a00 | #3a2400 | #0d2e0d | #ffffcc | #4a3a00 | #0f380f | #fff1c2 |
| warn-border | #aa8800 | #b8960f | #000000 | #ffff00 | #ffb000 | #33ff66 | #666666 | #ffe27a | #0f380f | #9a6f00 |
| warn-ink | #cc6600 | #f0a04b | #5c2e00 | #ffff66 | #ffd37a | #a6ffbd | #663300 | #ffe27a | #9bbc0f | #8a4a00 |
| ok-ink | #267326 | #6fcf7f | #005a1e | #66ff8c | #ffb000 | #33ff66 | #1a6b1a | #8dffb0 | #0f380f | #2f6a2a |
| bad-ink | #cc0000 | #ff7b72 | #a30000 | #ff9090 | #ffb000 | #33ff66 | #b00000 | #ffa099 | #0f380f | #a8210f |
| error-ink | #aa0000 | #ff8a80 | #8a0000 | #ff9a9a | #140c00 | #031003 | #a00000 | #ffb3ad | #9bbc0f | #8f1a0a |
| error-bg | #fdecea | #3d1f1e | #ffe5e5 | #330000 | #ffb000 | #33ff66 | #ffe0e0 | #5a1a1a | #0f380f | #f9dcd2 |
| held | #e8a33d | #e8a33d | #8a5a00 | #ffcc33 | #ffb000 | #33ff66 | #cc8800 | #ffcf5a | #306230 | #c98512 |
| held-ink | #8a5a00 | #f0b84a | #5c3b00 | #ffd966 | #ffd37a | #a6ffbd | #6b4400 | #ffe08a | #0f380f | #7a4b00 |
| tip-bg | #000000 | #2b2d33 | #000000 | #ffffff | #ffb000 | #33ff66 | #ffffcc | #e6f0ff | #0f380f | #3a2e1c |
| tip-ink | #ffffff | #e6e8eb | #ffffff | #000000 | #140c00 | #031003 | #000000 | #0b2f5b | #9bbc0f | #f6efdc |
| tip-edge | #000000 | #8a9099 | #ffffff | #ffffff | #ffb000 | #33ff66 | #000000 | #e6f0ff | #0f380f | #3a2e1c |
| help-ink | #4682b4 | #7fb2e0 | #00399e | #7fd4ff | #ffb000 | #33ff66 | #2a2a9a | #8fc4ff | #0f380f | #8a4a14 |
| map-paper (new) | #ffffff | #ffffff | #ffffff | #000000 | #140c00 | #031003 | #ffffff | #0b2f5b | #9bbc0f | #ffffff |
| map-ink (new) | #000000 | #000000 | #000000 | #ffffff | #ffb000 | #33ff66 | #000000 | #e6f0ff | #0f380f | #000000 |
| border-strong | #cccccc | #6b7078 | #000000 | #ffffff | #9a6600 | #1f9a3e | #666666 | #6f9ad0 | #0f380f | #8f7f5c |

**Measured** (OBSERVED: my script, 2026-10-17; "text min" is the weakest of 15 listed text pairs: ink, muted,
subtle, accent, warn, error, ok, bad, tip, held, help, selection and hover rows; "border" is the control
border against the page and chrome surfaces):

| Theme | ink on page | text min | control border | map paper/ink |
|---|---|---|---|---|
| light (today) | 12.63 | **3.69 FAILS** (warn-ink on warn-bg) | 1.61 (fails 3:1, see below) | 21.0 |
| dark (today) | 11.52 | 5.90 | 3.31 | 21.0 (white map) |
| high contrast, light | 21.0 | **7.57** | 21.0 | 21.0 |
| high contrast, dark | 21.0 | **9.06** | 21.0 | 21.0 |
| amber | 10.59 | 6.29 | 3.77 | 10.59 |
| green | 14.49 | 8.34 | 4.96 | 14.49 |
| platinum | 21.0 | 6.64 | 4.23 | 21.0 |
| blueprint | 11.62 | 6.61 | 3.88 | 11.62 |
| handheld | 6.02 | 4.56 | 5.03 | 6.02 |
| paper | 11.53 | 5.39 | 3.15 | 21.0 |

Every new theme meets **WCAG 2.x AA text (4.5:1) and non-text (3:1) on every pair measured** (CITED: W3C WCAG
2.2, SC 1.4.3 and 1.4.11). **High contrast meets AAA text (7:1, SC 1.4.6) on every pair, 7.57 at the weakest,
and its borders are 21:1.** `theme_contrast_check.js` must be extended to run these same pairs over every theme block (it
checks dark only today); that is the gate that lets Tom trust a theme he has not read.

**A finding about today's DEFAULT, not a theme.** OBSERVED arithmetic: the light set's `--ec-warn-ink #c60` on
`--ec-warn-bg #fffbe6` is 3.69:1 and `--ec-help-ink steelblue` on white is 4.11:1; both are below 4.5 for
the small text they colour. And light control borders are 1.61:1 (Bootstrap's input border is `#dee2e6`,
about 1.3:1). The 1.4.11 3:1 floor applies to the boundary that identifies a control. This is "the same, but
better" work with a measurable payoff (#2 below).

### The nine themes (ten palettes), one paragraph each

1. **Light** (default). Today's, improved by section "the same, but better".
2. **Dark.** Today's, re-expressed as seeds. Map paper stays white (see map decision).
3. **High contrast.** One row in the gallery, two palettes: black on white, or white on black when the
   operating system asks for dark (`prefers-color-scheme`). Pure ink on pure paper, control borders
   black, notices bordered black rather than relying on a pale fill, **2.5 icon strokes**, radius 2/3/4
   (corners stay; a visitor who needs this also benefits from knowing where a button ends), no shadows, a
   3 px focus ring. It is also what **System** should select when the OS reports `prefers-contrast: more`
   (CITED: Media Queries Level 5; widely implemented). Windows "forced colors" is a separate matter:
   `@media (forced-colors: active)` hands the page the visitor's own palette and the theme should step out of
   the way except for the map; test it once and add a three-line block. Font: unchanged (a contrast theme must
   not change glyph widths).
4. **Amber monochrome.** P3-style amber phosphor (`#ffb000` on near-black `#140c00`; the amber CRT colour
   is conventionally about 1,600 K, no hex is canonical, so this is my choice and measures 10.59:1). One hue, steps of brightness:
   `ink-black` and `accent` are the BRIGHT amber `#ffd37a`, links and focus read by brightness and
   underline, not hue. Status that colour used to carry now reads by the glyph the verdict strings already
   lead with (`✓`, `⚠`, CLAUDE.md "Verdict strings") and by the override shape marker (Task 790), so WCAG 1.4.1
   (colour is not the only cue) is met. Errors are an inverted block (`error-bg` amber, ink the paper colour),
   which is what a terminal does. Font: mono (`--ec-font-ui: var(--ec-font-mono)`), size unchanged. Radius 0/0/0,
   icon stroke 2.5 with square caps, shadow none, 1 px hard borders. Tile filter: grayscale-invert-sepia (below).
5. **Green monochrome.** Same construction on P1-style green (`#33ff66` on `#031003`, 14.49:1). Differs from
   amber by hue only, so it is nearly free once amber exists; the two ship together or not at all.
6. **Platinum** (the Mac theme). **My call: classic Mac OS 8/9 "Platinum", not Aqua.** Reasons: (a) Aqua is
   gradients, glass, a pinstripe and a glossy pill button, none of which is a token; it would need new rule
   types, i.e. a new theming mechanism. Platinum is flat greys, 1 px black lines and a small bevel, so it is
   100% tokens. (b) The modern macOS look is what the default Light is already converging on (system font, a
   light grey chrome band, 6 px radius); a second "Mac" theme that resembled it would not be fun. (c) It gives
   the gallery a calm retro that is not a terminal. Palette: window grey `#dddddd` for chrome, white content,
   black ink, navy `#2a2a9a` links (the classic web link colour family), pale yellow tips (`#ffffcc`, the
   Help balloon). Radius 0 on boxes, 2 on controls; `--ec-bevel: inset 1px 0 #fff, inset -1px -1px #888`
   on buttons. Font stack `"Charcoal","Geneva","Lucida Grande","Lucida Sans Unicode",system-ui,sans-serif`:
   **Chicago/Charcoal exist only on a Mac, so the look degrades to system-ui off one, honestly, and nothing is
   vendored** (suite rule). Icon stroke 1.75, square joins. SPECULATION: the exact Platinum highlight and
   chrome greys are from memory of the era; I did not fetch Apple's HIG archive, so none of this claims to
   be Apple's palette, only an evocation. No Apple logo, name or trademark appears in the product text.
7. **Blueprint.** Cyanotype: ivory-white ink on a deep blueprint blue (`#0b2f5b`, 11.62:1), annotation yellow
   `#ffe27a` for the accent (links, selection), radius 0, icon stroke 1.5 with miter joins (drafting
   linework), stack `"Bahnschrift","DIN Alternate","Roboto Condensed",system-ui,sans-serif` (a DIN-like
   lettering where the OS has one; SPECULATION on which OS ships which, hence the fallback chain). **This is
   the theme that fits the subject: it is how engineers' own drawings looked, and the drawing paper becomes a
   blueprint with white pipes, which a hydraulic engineer will smile at.** Tile filter: invert + hue-rotate so
   streets read as white lines on blue.
8. **Handheld (pea-green LCD).** The four-shade green of an early handheld game console's screen
   (`#0f380f #306230 #8bac0f #9bbc0f`, which are the widely reproduced values; the device's own name is a
   trademark, so the theme is called **Handheld** and the Settings text never says the brand). Only TWO tones carry text: ink
   `#0f380f` on `#9bbc0f` is 6.02:1, and the mid tone `#306230` is only 3.29:1 on that paper, so it is used for
   held-override fills and rules, never for text. **Override: `ink-muted` and `ink-subtle` equal `ink`**
   (hierarchy there is weight and size, not tone); that is honest and measures. Notices are inverted blocks.
   Radius 0, icon stroke 2.5 with butt/square caps, mono font. My prototype showed the notice text vanishing
   in this theme because one rule takes its ink from a token other than `warn-ink`; the builder must find it
   (a two-tone theme is the strictest test of whether every rule uses a role).
9. **Paper.** Warm sepia (`#f6efdc`, ink `#3a2e1c`, 11.53:1), brown accent, slightly softer rules, radius
   3/5/8, a text serif stack (`"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif`; non-Latin scripts
   fall back to the system face, which is the right behaviour). **This is the useful quiet one**: low glare
   without dark mode's inverted map, and the theme most likely to be someone's all-day choice. Its map paper
   stays white (document theme).

**Left out, deliberately, with reasons.** *Windows 9x* (teal desktop, `#c0c0c0` bevel): needs a real 3D
bevel on every control, which is `--ec-bevel` plus a pass over the 45 shadow sites; a good SECOND wave once
the bevel token exists. *Solarized and other editor palettes*: a palette with no point of view about this
suite. *Terminal white-on-black*: that is Dark. *Colour-blind palettes*: the ramps, not the chrome, are
where it matters, and that is the colour-by-value task.

## The MAP: recolour it, or leave it?

**Decision: split themes into two kinds, and the theme decides; no switch in the first branch.**

- **Display themes** (amber, green, blueprint, handheld, high-contrast dark) paint the map's PAPER and its
  NEUTRAL INK (`--ec-map-paper`, `--ec-map-ink`, which feed `--lpn-map-bg` and the labels/outline strokes that
  today are black).
- **Document themes** (light, dark, high-contrast light, platinum, paper) leave white paper and black ink,
  which is today's rule and today's `chrome_colour_allow.json` reasoning.

**Why not leave the map in a monochrome theme.** OBSERVED in the prototype: with amber chrome around a white
rectangle, the page reads as a white page with a coloured frame; the map is about 80% of the window at
1300 by 760 (chrome measured from my screenshot at about 150 px: menu 33, toolbar 38, transport row 36 when an extended-period example is open, tabs 36). A
theme that does not reach the largest surface is not a theme. And a dark paper fixes what dark mode could
not: today a dark theme gives the eye a white sheet, which is the glare dark mode exists to remove.

**Why the original exemption still stands for what it was about.** The reason recorded for exempting the
map (`dev/theming-plan.md` Phase 2) was that a drawing is data and a shared screenshot must show the same
network. That is kept where it matters: **everything that LEAVES the page (print, PNG and SVG export, the
example thumbnails, the Full Report) is rendered with paper and ink from the literals, never from the
theme.** (`@media print` is already exempt in `chrome_colour_allow.json`.) The screen is the visitor's own;
the file is everyone's.

**What a display theme must NOT touch: data colour.** Value-driven colouring (`js/lpn-ramps.js`, legends,
status red/blue) is a measurement. A monochrome theme does not recolour it; it makes the paper behave.
**Defect the builder must handle (OBSERVED in the amber and blueprint prototypes):** the darkest ramp class
(viridis `#440154`) is invisible on a dark paper. The existing link halo (`.lpn-link-halo`) is the tool: on
a paper whose luminance is below about 0.2, draw the halo in the ink colour at low opacity, or lift the
ramp's first stop. Without it an amber theme makes a velocity map lie by omission. This is a build task with
its own check (a ramp-stop-versus-paper contrast table, 3:1 against every theme paper).

**Basemap tiles.** OSM tiles are a light pastel map and would sit under the paper on a display theme.
`--ec-tile-filter` carries the CSS `filter` for each (amber: `grayscale(1) invert(1) sepia(1) saturate(4) hue-rotate(-10deg) brightness(.7)`
and so on; builder tunes by eye). Satellite and terrain-RGB stay unfiltered (they are imagery, and
terrain-RGB is decoded data, never filtered). Attribution stays as required.

**If Tom wants the choice anyway** ("amber chrome, white map"), it is one checkbox under Theme, one more
`localStorage` key (`lpn_thememap`, '0' to keep white), and a tip. I would not ship it until somebody asks
(the setting budget, below).

## The axes: bundled, not independent

Tom listed corners, icons, fonts and colours. **Decision: they are properties of a theme, not switches.**

1. **The combinatorics.** Four axes with 3 to 9 values each is hundreds of combinations; every one a visitor
   can reach is one I must have measured and made look right. Bundled, I author 9 wholes and measure 9.
2. **An artist does not offer a font picker, she offers a look.** Tom's own words: "the work of an artist
   applying their eye". Corners, stroke weight and typeface are exactly what makes Platinum feel like Platinum
   and amber feel like amber; separating them makes each theme worse.
3. **Settings are a cost.** The Settings box is already long; each switch is a row, a tip, 27 translations and
   a state to explain. The visitor faces ONE choice, "Theme".
4. **Contrast is not independent of the axes.** A mono font is wider; a thinner icon stroke is lower contrast;
   a gate that checks closed themes is possible, a gate that checks a cube is not.

**But the axes exist inside**, as tokens, and that is where the decision is reversible: radius, font, icon
stroke and cap, shadow, bevel, tile filter. A later "Customise" could expose them without a rewrite. I do
NOT propose building that: CLAUDE.md's instinct ("never a 'save current settings as default' button") argues
the same way, and a custom palette is the user-authored theme `dev/theming-plan.md` already excluded.

**The one thing that stays independent of theme: System.** "System" means follow the OS (`prefers-color-scheme`,
and `prefers-contrast: more` selecting High contrast). It is the default and is the only row that is not a look.

**Width risk, named once.** A mono font is wider than the proportional face the menu bar and toolbar were
sized for, and the app has 27 languages, five right-to-left. The mono themes must be measured with the
menu-bar-overflow and phone-width harnesses in `dev/lpn-spike/` (`menu-*-harness.js`) in the widest languages
before they ship, and the mono stack set at `0.93em` if needed. Blueprint's condensed face is narrower, which
is safe. This is the one real risk in the gallery; it is a measurement, not a reason to drop the theme.

## The selector

**Where it lives.** Settings > Page > Theme stays the canonical home on the app page (it is window
furniture; Task 714). Do not add a second door there (my Task 625 lesson). On calculator pages: one small
icon button beside the language picker in the Bootstrap navbar (`lib/Menus.lib.php:97`), title `Theme`
(the existing `lpn_settings_theme` string, no new words), opening the same gallery.

**Suite-wide: yes**, and cheaper than it looks. The head script is gated `$type === 'EngCalcsApp'`
(`lib/HeadersFooters.lib.php:82`); widen that to every `EngCalcs*` type. Needed so a theme is not a lie
on 15 pages: (a) the navbar: Bootstrap 5.3.2 supports `data-bs-theme` (the head script already writes it) but
the navbar is hard-coded `navbar-light bg-light`; change it to Bootstrap's `bg-body-tertiary` and drop
`navbar-light`, so the existing attribute re-colours it with no custom CSS; (b) links: one `a { color: var(--ec-accent) }`
rule in `engcalcs.css` for the non-app pages; (c) the lattice colour (`--ec-debug-grid`) re-derived per theme
(`mix(bg, accent, 55%)`); (d) **the parent site's `/hawsedc.css`**, which "hard-codes form and table colours,
loads last" (`lib/HeadersFooters.lib.php:283-286`). That file is not in this repo. A calculator page is only
as themeable as the parent stylesheet lets it, so calculators ship after the app page, behind a check on the
production host, not a preview. **Until then a calculator page stays light under every theme (today's rule),
and the gallery says nothing about it.**

**How a visitor previews a theme: the cards ARE the preview, and hovering applies it.**
- The control in Settings is a button that shows the current theme as a miniature and its name (`Amber`), not
  a `<select>`; it opens a popover **gallery of cards**.
- Each card is an `.ec-theme-card[data-theme="amber"]`: a 132 by 80 px miniature built from real elements
  (a mini menu bar of three pills, a toolbar strip, a patch of map with two dots and a line) painted by that
  theme's own tokens through the shared selector above. No images, no per-theme markup, and a theme added to
  the CSS appears in the gallery with no further work.
- **Hover or arrow-key focus on a card applies the theme to the real page, live** (`ecTheme.preview(name)`:
  sets `data-theme`/`data-bs-theme`, writes no storage). Leaving the popover or Esc restores the committed
  choice; click or Enter commits (`ecTheme.set(name)`). This is the "try it, then keep it" pattern of
  Windows's display-settings revert and every phone's wallpaper picker; I know of no published source for a
  standard name, so the claim is only that it is familiar.
- Touch has no hover: tap previews, and a visible **Keep** and the card re-tap commits; closing reverts. The
  Keep word is the one new string and reuses nothing existing (a possible `lpn_btn_keep` costs 27 languages;
  the card re-tap needs no word, so it is optional).
- **Fun, with no new words.** The miniature grid is the fun. Optional and cheap: the cards animate in with a
  60 ms stagger (respecting `prefers-reduced-motion`, which `css/engcalcs.css:636` already honours elsewhere).
  A visitor who clicks a CRT theme sees the whole page turn amber under their cursor: that is the delight, and
  the page costs nothing to build once the tokens are seeds.
- **A rescue.** `?theme=system` in the URL clears the stored choice and applies it; Tom can send it to any
  visitor who picked something and cannot read it. (Every theme is gated at AA, so this is insurance, not
  expected use.)

**Storage: no new key; the values just widen.** `lpn_theme` holds `light`, `dark`, `hc`, `amber`, `green`,
`platinum`, `blueprint`, `handheld` or `paper`; absent means System (today's behaviour exactly). The reader in
the head script must **whitelist the value** (today it accepts only `light`/`dark`; an unknown or stale value
falls to System), so a theme later retired cannot strand anyone. It is `localStorage` only, a preference the
visitor set, in the same exemption as today (`dev/cookie-storage-inventory.md`); **no consent change and no
`serializeProject()` change** (the key stays out of project files, as `dev/theming-plan.md` decided). The name
`lpn_theme` is now shared by calculator pages; renaming a key is a migration, so I would keep it.
(Tell Tom: nothing new is stored. Only the set of values widens.)

## Strings (the price, stated)

New visitor strings: seven theme names (High contrast, Amber, Green, Platinum, Blueprint, Handheld, Paper;
Light, Dark, System exist: `lib/lang.ec.en.php:3178-3180`), and optionally "Keep". 7 to 8 keys by 27 languages.
Names should be translated as plain colour or object words where the language has one; "Platinum",
"Blueprint" and "Handheld" need one `dev/plain-sentences.md` line each for translators (Tom's file, not mine).
"Green"/"Amber" would be better as "Amber terminal" in some languages: translators decide. No tip text per
theme: the card is its own explanation.

## "The same, but better": changes to the DEFAULT theme

Ranked by how much a visitor would feel per unit of risk. Each is small and each can ship alone. Evidence
is the 2026-10-17 renders (OBSERVED unless tagged). The test for each: would a visitor say "it looks the
same, but nicer"?

1. **The chrome gets its own quiet surface.** Today menu bar, toolbar and tab strip are transparent over
   white, and the map paper is white, so chrome and drawing differ only by a 1 px rule (OBSERVED: the
   screenshots). Hierarchy fix, not decoration: the chrome should RECEDE so the drawing is first.
   *Before:* `--ec-chrome-bg: var(--ec-bg)` (#fff). *After:* `--ec-chrome-bg: #f6f7f9;` and
   `#lpn_toolbar, .lpn-tabstrip, .lpn-menubar { background: var(--ec-chrome-bg) }`. Cost: three rules, one
   token; also the single change that Platinum, amber and blueprint all need, so it is built once. Risk: it
   changes the page's most prominent pixels; screenshot at 1400 and 390 widths. **Keep the menu-bar items'
   blue outline exactly as is** (Task 616: the outline is why two people eventually saw the menus).
2. **Quiet the arithmetic of contrast.** `--ec-warn-ink #c60 -> #9a4400` (3.69 to 6.31:1 on `#fffbe6`),
   `--ec-help-ink steelblue -> #3a77a8` (4.11 to 4.79:1), control border `--ec-border-strong #ccc -> #8f8f8f`
   for INPUT and SELECT borders only (1.61 to about 3.2:1; WCAG 1.4.11). Visually: warnings read as a deeper
   orange-brown instead of a washed one; inputs become crisp. Cost: three token edits and one rule. Do the
   borders last and look: it is the one that changes the density of the calculator pages.
3. **Breathing room on the calculator pages.** OBSERVED: `Manning-Pipe-Flow.php` text starts at x = 0; the
   title, subtitle and the form's left edge touch the window. *Before:* `body { margin: 0 }` (Bootstrap
   reboot) with no page padding. *After:* `body:not(.lpn-app) { padding-inline: clamp(8px, 2vw, 20px) }`
   (RTL-safe: logical property; `.lpn-app` is a placeholder, the builder finds the app page's real body marker, and the same goes for the chrome class names in #1). The app page stays edge to edge (full-window drawing surface). Biggest
   single "nicer" per line of CSS on the calculators.
4. **Type that leads the eye to the form.** OBSERVED (computed styles): `h1` 40 px / weight 500 and `h2`
   32 px put the form's top at y = 238 of 900, 26% of a laptop window gone before the first input. A
   title is not the tool. *After:* `h1 { font-size: clamp(1.5rem, 2.2vw + .8rem, 2rem) }`,
   `h2 { font-size: 1.15rem; font-weight: 600; color: var(--ec-ink-muted) }`, margin-bottom .5rem. The form
   rises about 90 px; the page still reads as the same page, with calmer headings.
5. **Figures line up.** `font-variant-numeric: tabular-nums` exists only on the editor panes
   (`css/engcalcs.css:3134`). Apply to the calculators' result and input cells
   (`.ec-fieldgrid, table.bare td, input[type=text]`). *Before:* proportional digits, so a column of results
   (`0.8836 / 1.7671 / 28.2743`) wavers. *After:* the columns align. This is what a typographer would do
   first. Zero layout risk beyond a pixel or two in width: check `pane-col-width-harness.js`.
6. **A modern font stack.** OBSERVED: `body { font-family: sans-serif }` resolves to whatever the OS calls
   `sans-serif` (Liberation/DejaVu in my renders, Arial elsewhere), the one decision that makes the product
   feel "default". *After:* `--ec-font-ui: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`
   (the app already uses this stack at `css/engcalcs.css:2672`). **Highest visual reward, highest risk**: glyph
   widths change in all 27 languages, so every width-sensitive control (toolbar, menu bar, Results columns,
   "width is king") moves. Ship it alone, behind the width harnesses, and last of the typography items.
7. **The blue lattice, softened.** `--ec-debug-grid: blue` (`css/engcalcs.css:58`) draws pure `#00f` 1 px
   rules around every calculator cell (OBSERVED, `table, th, tr, td` rule at :399 and the field grid at
   :456). The token name admits what it is, a debug grid that became the design. *After:*
   `--ec-debug-grid: color-mix(in srgb, var(--ec-bg), #0645ad 38%)` (computed `#9ab6e0`-ish), so the grid
   remains blue and remains a grid but stops shouting; hierarchy then belongs to the numbers. **A question for
   Tom first**: his comments (":457 `1px blue rules, collapsed`") suggest the lattice may be deliberate. Show
   it before and after rather than assume.
8. **One shadow, one radius family.** 45 box-shadows and five radii are the "assembled by hand" feel. After
   the radius and shadow tokens above: `--ec-radius-s/m/l: 4px / 6px / 8px`, `--ec-shadow: 0 1px 2px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.14)`
   on floating boxes (Settings, Properties, Find, dialogs, popovers), none on inline ones. Native `<select>`
   (OBSERVED: UA grey `#efefef`, radius 0 beside radius-4 inputs, in the calculator forms) gets the input's
   border, background and radius. Result: every control and box has the same corner.
9. **A themed focus ring on every control, not only the toolbar.** `:focus-visible` is styled for the
   menu bar and toolbar only (`css/engcalcs.css:1879,1884`). *After:* `:focus-visible { outline: 2px solid var(--ec-accent); outline-offset: 2px; border-radius: inherit }`.
   Keyboard users see where they are on the calculators and Settings; it is also the first thing High contrast
   enlarges.
10. **The cookie banner is 20% of a first screen.** OBSERVED: the banner is three full-width buttons and a
    three-line paragraph, 190 px of 900 on a first visit (it is in every one of my screenshots). I may not
    restyle one button to stand out (rule), but I may make all three equally smaller: text 14.5 px, buttons
    auto width in a row, 150 px total. A first impression is worth that. Lower rank because consent copy and
    layout are Tom's and legal-adjacent; shown here so he can say no.

**If only one: #1.** It is the cheapest change that moves the whole application's first impression, it
corrects a real hierarchy flaw (chrome and drawing the same white), and it builds the `chrome-bg` token that
five of the gallery's themes cannot exist without.

## Order of building

**Branch 1 (`feat/theme`, "the selector and four palettes"):**
1. Phase 0: assign roles to the 40 hue and 20 grey tokens; add `chrome-bg`, `map-paper/ink`; derive greys and
   tints by `color-mix`; collapse dark to seeds. Done-test: `pixel-shots.js diff` is empty on Light; the dark
   screenshots are within tolerance of today's (dark's hand-picked greys differ by a few units; Tom approves
   them once, or the dark seeds keep a handful of overrides).
2. `ecTheme` gains `preview`; whitelist; widen the head script to every `EngCalcs*` page type (the page stays
   light until its navbar is fixed, so this step may wait).
3. The gallery popover (cards, hover preview, commit, revert, `?theme=`) in Settings > Page.
4. Four palettes: **High contrast (both), Amber, Green, Platinum** (Platinum is the only one that needs
   `--ec-bevel`; if the bevel slips, ship **Blueprint** in its place, which needs nothing new).
5. `theme_contrast_check.js` extended to every theme block (this is the gate).
6. "Same but better" #1 (chrome surface) and #2 (contrast fixes), because the former is a token the themes
   share and the latter is measurable.

**Branch 2:** Blueprint, Handheld, Paper; map paper and ink for display themes; ramp halo for dark paper;
tile filter; the radius, shadow, icon-stroke and font tokens and their sweep (the 44 radius and 45 shadow
sites); width harness runs in the widest languages. **Branch 3:** calculator pages (navbar, links, lattice, parent
stylesheet coordination), the calculators' selector button; "better" #3 to #9 as small independent commits.
**Waits:** Windows 9x and Aqua-class themes (bevel and gradient mechanisms), a "Map follows theme" switch,
any custom palette, "better" #10 (Tom's call).

## Branch 1 as built (build agent, 2026-10-17), and where it departs from the plan above

Built on `feat/theme`: the seeds and derivation, the gallery, High contrast (both palettes), Amber, Green,
Platinum, the extended contrast check, and "better" #1 and #2. Held by `dev/scripts/theme_contrast_check.js`
(static, every theme) and four Chromium harnesses in `dev/lpn-spike/`: `light-tokens-browser-harness.js`,
`theme-contrast-browser-harness.js`, `theme-gallery-browser-harness.js`, `theme-browser-harness.js`.
Departures, each with its reason:

1. **Light is derived, then pinned.** The first rule (`:root, .ec-theme-card`) holds 26 seeds and every
   other token as `color-mix(in srgb, ...)` of them. The grey ladder, ink steps, accent translucents and
   white translucents land on today's light values exactly. 38 hand-chosen tints (hover, pressed, select,
   the forms' wash, most value-named hues) do not land on any formula, so a light-only rule
   (`:root:not([data-theme]), [data-theme="light"]`) states them. Every light token is identical to the
   pinned base SHA except the two "better" #2 inks (`light-tokens-browser-harness.js`). One visible-to-code
   side effect: a derived token computes as `color(srgb ...)`, not `rgb(...)`; the pixels are the same,
   and the harnesses that compared strings now read numbers.
2. **Dark keeps its hand-chosen values.** Collapsing it to seeds moves its greys by a few units, which is a
   visible change for Tom to approve, not a refactor. Dark changes only where a defect was found: the
   override marker's ink was never stated for dark (light's `#8a5a00` on the dark page, 2.78:1), now
   `#f0b84a`; Bootstrap's field edges take `--ec-control-border`.
3. **The value-named tokens keep their names.** Each now derives from the role it plays (the comment beside
   it says which); renaming 60 names across the CSS and JS is churn with no visible effect, left for later.
4. **`<html data-theme>` carries the resolved theme**, not the choice: System becomes light, dark or `hc`
   (`prefers-contrast: more`), and High contrast becomes `hc` or `hc-dark` by the colour scheme. So no
   theme block is written twice (the old dark block was duplicated under a media query), and a gallery card
   is painted by the same selector. `window.ecTheme.get()` is the choice.
5. **"Better" #1: `#eef1f5`, not `#f6f7f9`.** The chrome sat on the calculator form's `#f7f9ff`, not on white,
   so the planned value would have been invisible. The 4 px gaps between the three rows are painted by a
   blur-free shadow, so no layout moved.
6. **"Better" #2, the control border: Bootstrap's fields only.** Measured: the browser's own inputs and
   drop-downs are already `#767676` (4.54:1). The failing edges are Bootstrap's `.form-select` and
   `.form-control` (`#dee2e6`, 1.3:1): the transport's two drop-downs and the navbar's fields. They take the
   new `--ec-control-border` (`#8f8f8f`, 3.2:1); `--ec-border-strong` is a panel rule and stays `#ccc`.
7. **Amber and Green do not invert errors.** Error ink also sits on the page's ordinary surfaces, where an
   inverted ink would be 1:1; errors are the bright step on a dim amber (green) wash instead. The map stays
   white in every theme. (Their mono face, glow, scan lines and square icon ends came in round 2, below.)
8. **Platinum's bevel shipped** (`--ec-bevel`, `--ec-bevel-in`), on the menu-bar items and toolbar buttons.
9. **High contrast**: every text pair at 7:1 needed a handful of overrides (the dim greys become the muted
   ink, ok and bad inks deepened). Its 3 px focus ring and heavier icon stroke came in round 2.
   `forced-colors` is untested.
10. **Bootstrap is handed the tokens in the four new themes** (body text, link colour, its borders), or the
    Settings box would be written in Bootstrap's grey and the links in its blue. Light and Dark keep
    Bootstrap's own, as before.
11. **Touch: a tap keeps the theme**, so no "Keep" string. `?theme=` accepts any listed name; `system`
    clears the choice, which is the rescue.
12. **Print is Light, in every theme** (pre-review fix). The theme blocks, and the rule that derives what
    Light pins, are `@media screen` only, so on paper every token is its Light literal; Bootstrap's dark
    switch is undone under `@media print`. This also fixes Dark, which printed its ink before this branch.
13. **The hover card is opaque in every theme**, Light included (Bootstrap drew it at 90%, and in Green the
    Properties box read through it).
14. **Strings**: four names (`lpn_theme_hc`, `_amber`, `_green`, `_platinum`) and a reworded
    `lpn_settings_theme_tip` (it said "light or dark colors"; now it names shapes and type too, and no pointing).

## Round 2 as built (build agent, 2026-10-17): design themes

Tom's pass of round 1: *"Nice start. These appear to be pure color themes."* So a theme now carries the
non-colour half of its look as tokens in the same first rule (`css/engcalcs.css`), each Light's old literal
by default, so Light is pixel-identical (a 1300 px screenshot of Net1 with Settings open compares byte for
byte with the one taken before the change):

- **Type**: `--ec-font-ui` (the page's face), `--ec-font-title` (box titles), `--ec-font-mono` (the four
  hand-written mono stacks now share it), `--ec-font-size` (the body's size). **System faces only**: no web
  font is fetched, so no fifth third-party request and no `privacy.php` change; a face the visitor lacks falls
  through its list (on Windows: Times New Roman, Consolas, Verdana, Trebuchet MS, Segoe UI, Bahnschrift).
- **The menu bar's words and the box titles**: weight, capitals, letter spacing, small capitals, title colour.
- **Corners**: every literal `border-radius` of the chrome (43 sites) became one of six tiers, each its Light
  size times `--ec-radius-scale` (0 squares the page, 2 doubles it); boxes take `--ec-box-radius` (0 in Light).
- **Frames**: `--ec-box-border` and `--ec-box-shadow` on all 27 floating boxes (their inline styles now name
  the tokens), `--ec-tabs-rule` under the tab strip, `--ec-focus-w` on every focus ring.
- **Pictures**: `--ec-chrome-image` behind the menu bar, toolbar and tab strip (scan lines, stars, a row of
  dots), `--ec-titlebar-image` and `--ec-title-halo` on box titles (Platinum's ridged title bar, with a ring of
  window grey round each letter so the ridges stop short of the word), `--ec-text-glow` (phosphor).
- **Icons**: `--ec-icon-stroke`, `--ec-icon-cap`, `--ec-icon-join` on `.ec-icon` (Light: 2, round, round, as
  the `<svg>` states them; a path that states its own keeps it). No icon is redrawn.

**The map is pinned**: `#lpn_canvas` keeps `sans-serif` at 1rem and never glows, because label width drives
label placement and export. The design harness proves a label measures the same in every theme.

Themes, in gallery order (System, Light, Dark, High contrast first, as before):

| Theme | What it changes beyond colour |
|---|---|
| High contrast | Heavier icon lines (2.5), a 3 px focus ring, 2 px box frames and tab rule, no shadow. Same face and sizes (a contrast theme must not change word widths). |
| **Rounded** (new) | Light's colours, the computer's own UI face, pill-shaped menu and tool buttons, corners twice Light's, 14 px box corners with a hairline frame and a soft deep shadow, lighter icon lines. The candidate for "the same, but better". |
| Platinum | The classic desktop's faces where present (Charcoal, Chicago, Geneva, then Verdana) at 14 px, bold menu titles, half-size corners, a hard drop shadow, a ridged title bar on every box, square-ended icon lines. |
| **Newspaper** (new) | Newsprint and black ink, Times New Roman, small capitals on the menu bar, capital box titles, double rules round every box and under the tab strip, no corner and no shadow, oxblood links, fine engraved icon lines. Evokes a broadsheet of record; names none. |
| Amber, Green | A fixed-width face at 15 px, square corners, a faint phosphor glow, scan lines across the chrome, capital box titles, square icon ends, a glow round every box. |
| **Arcade** (new) | Evokes a 1980s maze game: black screen, maze-blue double walls with round corners round every box and under the tab strip, a row of dots along the chrome, yellow links and titles, the four chasers' colours for status, a heavy rounded face in capitals on the menu bar. No game's name, logo or characters. |
| **Space** (new) | Evokes a science-fiction film: a starfield behind the chrome, pale ink, gold links and titles, a geometric face in widely spaced capitals, fine corners, a thin gold frame and deep shadow round every box, blue selection. No film's name, logo or lettering. |

Held by `theme-design-browser-harness.js` (every theme: each design property read from the real element
equals its block; Light is the old page; each theme but Dark differs from Light in at least three design
properties; box text, title and menu word at 4.5:1, 7:1 in High contrast; map lettering unchanged; print is
Light's design; at 390 px no sideways scroll and the menu bar one row), and the round-1 checks extended to
the four new palettes (`theme_contrast_check.js`, `theme-contrast-browser-harness.js`,
`theme-gallery-browser-harness.js`). Strings: `lpn_theme_rounded`, `_newspaper`, `_arcade`, `_space`, English
only, as round 1's were. Storage: no new key; `lpn_theme` may now also hold `rounded`, `newspaper`, `arcade`
or `space`.

**Still open, for Tom**: the map stays white in every theme (the display-theme map decision above was not
built); the calculator pages are still not themed.

## Proposed ROADMAP row (Tom promotes; I do not edit the roadmap)

`75|NEW| Themes: seed-derived tokens, a hover-preview gallery selector in Settings > Page (values widen in lpn_theme, no new storage), High contrast, Amber, Green, Platinum first; "the same, but better" default upgrades. dev/themes-plan.md`
