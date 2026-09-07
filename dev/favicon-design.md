# Favicon design study — LibreWaterNet and Not EPANET

**2026-09-07. NOTHING HERE IS DECIDED.** Six candidates were drawn, measured and published for Tom
to choose from; no file was installed, `lib/Icons.lib.php` was not edited, `manifest.json` was not
edited, and neither sister repository was touched. The choice is his.

Brief: *"Favicon: LWN and Not-EPANET need favicons. If we can come up with a water tank that we are
really happy with, that might be a good one. We probably will want to color it."*

Artifact: <https://claude.ai/code/artifact/807d59dc-fb50-4284-8f15-878b030cb032>

## What exists today

- **`librewaternet.org` has no favicon and no `manifest.json`.** No `rel="icon"` on any of its three
  pages.
- **`not-epanet.org` has no favicon either**, and by design has no assets at all beyond `style.css`.
- **The suite has `icons/icon.svg`, and it is a placeholder**: a `#1a6faf` rounded tile with the
  letters `EC` set in Georgia and a wave under them. It is reached only through `manifest.json` and
  `apple-touch-icon`; **no page in the suite emits `<link rel="icon">` at all.**
- So this is three marks that do not exist, not a redesign of anything.

## Palette, and where it came from

Nothing was invented. `librewaternet.org/index.html` and `not-epanet.org/style.css` declare an
identical token set, and the values below are taken from it unchanged.

| Hex | Token | Role in the mark |
|---|---|---|
| `#1B5FA8` | `--water`, light theme | The primary ink, and the tile fill |
| `#6FA8DC` | `--water`, dark theme | The same token under `prefers-color-scheme: dark` |
| `#B24428` | `--pencil`, light theme | Not EPANET's ink. An engineer marks up a drawing in red |
| `#FBFBF9` | `--paper` | The knockout colour inside a tile |
| `#1a6faf` | the suite's own `theme_color` | Within 3% of `--water`. **Worth reconciling to one value** — that is a separate decision and is not proposed here |

## The measurement that decides it: one blue will not do

WCAG contrast against Chrome's actual tab fills (`#F1F3F4` light, `#292A2D` dark):

| Ink | Light tab | Dark tab |
|---|---|---|
| `#1B5FA8` | 5.81 | **2.22** |
| `#6FA8DC` | **2.27** | 5.68 |
| `#3A86C8` (a split-the-difference blue) | 3.48 | 3.71 |
| `#B24428` | 5.03 | **2.56** |
| `#FFFFFF` on a `#1B5FA8` tile | 6.51 | 6.51 |

A favicon is one file and half of all readers have a dark strip, so a monochrome mark in either
site blue is washed out for half the audience. Three ways out:

1. **A compromise blue** scores about 3.5 both ways, is convincing on neither, and appears nowhere
   else on either site.
2. **An SVG favicon may carry its own `@media (prefers-color-scheme: dark)` rule**, and Chrome and
   Firefox honour it. Safari does not, and neither does the `.ico` that older paths fall back to,
   so the drawing must still be legible in one ink on both grounds. Polish, never safety.
3. **Give the mark its own ground.** A tile settles the contrast inside the file.

## The candidates and the 16 px verdict

| | Candidate | What it is | Verdict at 16 px |
|---|---|---|---|
| A | Map-Symbol Tank | The suite's own `'tank'` path, unchanged | **Fails.** A rectangle, and the same rectangle as a stopped video or a blank document |
| B | Ground Cylinder | Solid ground vessel, water level as a two-tone break | **Fails.** The level break survives, the dome does not, and what is left is A with a soft corner |
| C | Toolbar Tower | The shipped `'water'` icon exactly as drawn, recoloured | **Marginal.** Unmistakable at 32 and up; at 16 the catwalk merges into the bulb and the legs into the riser |
| D | Solid Tower | The same tower as a filled silhouette, no interior line | **Survives.** Its only problem is ink |
| E | Tower Tile | D knocked out in white on a `#1B5FA8` rounded tile | **Survives**, identically on both strips |
| F | Loop | Three junctions and a closed loop of pipes | **Reads, wrong word.** Legible and handsome; says *network*, says nothing about water, and is a shape a dozen graph tools own |
| N1 | Pencil Tile | E in `#B24428` — the Not EPANET companion | **Survives.** The pair is obvious and never confused |
| N2 | Red-Pencil Tower | The tower in red pencil on a paper tile | **Marginal.** A near-white tile disappears into a light tab strip |
| N3 | Correction Caret | The proofreader's caret, the site's own device | **Reads, says nothing.** A chevron with no relation to its sister mark beyond the colour |

## Three findings for any future attempt

- **A rectangle is not a picture of anything.** The map symbol's job is to be distinct from a
  reservoir two inches away in the same drawing; the favicon's job is to be distinct from forty tabs
  drawn by strangers. Different jobs, different marks — so consistency with the map symbol is a real
  argument, and it loses.
- **Stroke work closes up.** The `'water'` icon was measured to the set's own gap budget at 17 px in
  a menu row with white all round it. In a tab strip at 16 px the riser, legs and catwalk land within
  two pixels of each other. That file's own rule holds: a gap under about 2.5 units of a 24 box
  closes. **A favicon can afford a silhouette and no interior detail at all.**
- **The elevated tank is the only silhouette that works.** A bulb on legs over a riser belongs to no
  other category of software. Every surviving candidate is that same silhouette; what separates them
  is only delivery.

## Recommendation (proposed, not decided)

**E, the Tower Tile, paired with N1.**

- **Strongest argument for:** it is the only candidate legible on both tab strips as one file, in
  every browser, with no dark-mode rule and no compromise ink — and the silhouette inside it is the
  one already reviewed and approved for the Water menu. The pairing comes free.
- **Strongest argument against:** a rounded blue square is app-icon language and walks away from the
  drawing sheet both sites are built on. At 16 px a stranger registers *a blue square*, and a blue
  square is what a hundred other tabs also are. If that character matters more, take **D** and accept
  the SVG dark-mode rule, baking the `.ico` fallback in `#1B5FA8` for the light strip most people are
  on.

The linework is original, as everything in `lib/Icons.lib.php` is; the tower geometry is derived from
the shipped `'water'` icon, which was drawn from Tom's own sketch.
