# Tips follow-up: hover tips vs glyph tips, and help for menu items

Ida, 2026-10-03, answering Tom's two open questions from the tips interview (Q4, Q7).
Companion to `dev/tip-and-selection-audit.md`. Nothing shipped was changed. Tags: CITED (outside
source, URL), OBSERVED (this repo), MEASURED, SPECULATION. "Search excerpt" means I read the
search engine's quotation of the page and could not fetch the page itself; treat as one step weaker.

---

## The answers

**Q4. Yes, I distinguish them, and I was wrong to leave the line implicit.** A *hover tip* says
what a control is or does, in a few words, and needs no glyph. A *glyph tip* (the `?`) explains,
and holds more than a few words. The audit's own list of five affordances blurred the line; it
should be drawn by **content length and weight, not by which element carries it.** The documented
justification for two tiers exists, in four independent places (below). The one thing the evidence
does **not** justify is the page's present hybrid, where long explanations ride on hover.

**Q7. Keep hover tips on menu items. Do not build a status-line explainer.** Of the vendors Tom
named, none ships a persistent menu-help line today. Autodesk had one and dropped it; Apple's
guidelines say nothing about help text on menu items; Adobe's design system offers a description
line *inside* the menu item as an option; Bentley puts a prompt in the status bar, but for the
tool you are running, not for menus. Microsoft is one vendor of five, and it is not the deciding
vote (Tom is right about that). The deciding fact is that the others converge without it.

---

## Q4. Hover tips versus glyph tips

### What the vendors document

| Source | Tier 1: hover/focus | Tier 2: a click or tap on a glyph |
|---|---|---|
| **Apple HIG**, "Offering help" (tooltips, called help tags) | "briefly describes how to use a component"; "Describe only the control that people indicate interest in"; start with a verb; "avoid repeating a control's name"; "limit tooltip content to a maximum of 60 to 75 characters" | Help is a separate **help button** that opens a help book. Not a tip |
| **Adobe Spectrum**, Tooltip and Contextual help | Tooltip: "a few words or a short sentence, such as showing the label for an icon-only button" | Contextual help: a popover opened from an `info` or `help` icon button, "more space to give more information"; info icon is "brief, specific, contextual guidance", help icon is "more detailed, in-depth guidance" that "may include an image, video, or link" |
| **IBM Carbon**, Tooltip usage | "exposed on hover or focus when you need to disclose brief, supplemental information that is not interactive"; for icon-only buttons "a concise one- or two-word description of the button's function" | **Toggletip**: "used on click or enter when you must expose interactive elements" |
| **Nielsen Norman Group**, Tooltip Guidelines | Tooltips explain "unfamiliar form fields" and describe "unlabeled icons"; do not hold "directly actionable information"; do not repeat "visible labels" | On touch, "popup tips appear on touch/click events, typically paired with '?' or 'i' icons". Core rule: "tooltips shouldn't be essential for the tasks users need to accomplish" |

URLs, all fetched 2026-10-03 unless noted:
- Apple: https://developer.apple.com/design/human-interface-guidelines/offering-help (JSON body read at
  `developer.apple.com/tutorials/data/design/human-interface-guidelines/offering-help.json`).
- Spectrum: https://spectrum.adobe.com/page/contextual-help/ (**search excerpt only**; the page and
  the `/page/tooltip/` page returned 404 to my fetcher).
- Carbon: https://carbondesignsystem.com/components/tooltip/usage/
- NN/g: https://www.nngroup.com/articles/tooltip-guidelines/

CITED, from the same four: **the split is by content and trigger, and every system that has a
second tier gives it a visible glyph and a click.** Material 3 also has plain versus rich tooltips
(https://m3.material.io/components/tooltips/guidelines); **I could not read that page**, so I do
not rely on it.

### Why they divide (the justification Tom asked for)

1. **Hover cannot carry weight.** A hover tip vanishes when the pointer moves and does not exist on
   touch. Carbon's reason for a toggletip is exactly that: content that is long or interactive needs
   a click so it can be read, kept, and reached by keyboard. CITED (Carbon).
2. **A tip nobody knows exists is not help.** The glyph is the announcement. Spectrum and NN/g both
   pair the click tier with an icon for this reason. OBSERVED here: one `?` visible at 1400 px against
   28 tip-bearing elements (audit 4.1), so on this page most tips are invisible until hovered.
3. **Brevity is a different job.** Apple's 60 to 75 characters is a size for naming what a control
   does. OBSERVED against our strings (`dev/tip-review.csv`, 272): only **54 (20%)** fit in 75
   characters; the median is 133. Four in five of our tips are not help tags by Apple's measure. They
   are tier 2 content wearing a tier 1 delivery.

### What this means for the page (recommendation)

**One model, two tiers, drawn by content, not by element:**

- **Tier 1, hover or focus tip:** names or says what the control does, at most about 75 characters,
  no glyph. Icon-only buttons, toolbar, menu items. May hang on a label too.
- **Tier 2, `?` glyph tip:** everything longer, or that carries a source, a limit or a consequence.
  Opens on click or tap (and, as today, hover over the label or the glyph, see below).

The labeled rows with a title and **no** glyph (Fire flow, Criticality, Demand scaling) are the
residue: if the text is over 75 characters it is a tier 2 tip without its glyph, and that is the
defect, not the hover. Their text is mostly 16 to 39 words.

**One departure from the vendors, volunteered.** Our `?` also opens on hover (CLAUDE.md: label and
glyph both). Carbon's toggletip is click only. I know of no documented justification for hover on
the glyph; I am **not** proposing to remove it, because removing a working convenience on a pointer
page needs a reason I do not have, but it is the one place this page does not follow the pattern it
borrowed. SPECULATION: hover-on-glyph is harmless provided the click also works.

**Not verified:** no reader was tested on either tier; the 75-character threshold is Apple's, applied
to English, and Apple itself warns localization changes length (27 languages here).

---

## Q7. What each vendor does for help on a menu item

| Vendor / product | What a menu item gets | Source |
|---|---|---|
| **Microsoft** (Windows) | No status-bar help: "Don't use the status bar to explain menu bar items. This help pattern isn't discoverable" | Learn, Win32 "Status Bars (Design basics)", read earlier today (audit section 3) |
| **Apple** (macOS HIG) | **Nothing specified.** The Menus page has no help text, subtitle, description or tooltip guidance (read 2026-10-03). A menu item can carry a tooltip in code (`NSMenuItem.toolTip` exists; page title confirmed, body not readable by my fetcher). Help lives in the Help menu's search | developer.apple.com/design/human-interface-guidelines/menus; developer.apple.com/documentation/appkit/nsmenuitem/tooltip |
| **Adobe** | Spectrum's Menu supports a **description line inside the item**, in a `slot="description"`: "Icons and descriptions can be added to the children of Item" | https://react-spectrum.adobe.com/react-spectrum/Menu.html (read). **Photoshop and Illustrator menus: I could not verify** (from memory they show no description; not cited) |
| **Autodesk** (AutoCAD) | **Hover tooltip** (basic, then an extended tooltip after a further delay, set under Options, Display) on buttons "in toolbars, the Application menu, the ribbon, and dialog boxes". F1 over a tool opens its Help topic. The old **status-bar line for menu items** (from `HELPSTRING`) existed through 2014, and a user reports it gone from 2016 | Autodesk Display tab help (search excerpt): https://help.autodesk.com/cloudhelp/2019/ENU/AutoCAD-Core/files/GUID-F464608C-15BC-48E8-9484-D311053D9B73.htm ; extended tooltips: https://help.autodesk.com/cloudhelp/2017/ENU/AutoCAD-LT/files/GUID-685FC42D-8125-4A3C-B13B-55B346F012F8.htm (read); the 2014 to 2016 drop is a **user's forum post I could not open**: https://forums.autodesk.com/t5/autocad-forum/display-popup-menu-helpstrings-in-the-status-bar/td-p/6797594. Vendor confirmation of the removal: **not found** |
| **Bentley** (MicroStation / OpenRoads) | Ribbon items show an enhanced tooltip, "item name along with a short description". The status bar has a **prompt field** for "the next step" of the **selected tool**; it is not menu help. WaterGEMS menu bars: **not verified** | docs.bentley.com MicroStation help (search excerpts): https://docs.bentley.com/LiveContent/web/MicroStation%20Help-v20/en/GUID-83B179A1-CFE0-4715-98F3-C71ED3753AC8.html ; https://docs.bentley.com/livecontent/web/microstation%20help-v19/en/StatusBar.html (page body would not load, excerpt only) |

### Reading it

- The status-line-for-menus pattern was **real and was Tom's AutoCAD habit**; the vendor that
  kept it longest appears to have stopped (one user report, unconfirmed by Autodesk). Microsoft
  actively discourages it. Nobody else documents it.
- The three live patterns are: **hover tooltip on the item** (Autodesk, Bentley ribbon, Apple in
  code); **a description line in the item** (Adobe Spectrum); **nothing** (Apple's guidance).
- Where a status bar survives (Bentley, AutoCAD's command line) it tells you **what to do next in
  the tool you are in**, which is the job of the page's mode hint, not of menu help.

### Recommendation

1. **Keep what the page does:** a hover tip on a menu item, tier 1 (about 75 characters, one
   sentence). This is the Autodesk and Bentley pattern and it needs no new surface.
2. **Do not build the bottom strip.** Four of five vendors agree, and our own session evidence (PCW
   and MJH missed the menu bar and a 120 s highlight) says a strip at the window edge is read by
   nobody who matters here. This holds even if Microsoft is discounted.
3. **I withdraw one thing from the audit.** I wrote that a description line inside the open menu
   was what survives of Tom's instinct. Adobe supports it, but only Adobe does, and it costs a
   second line per item in 27 languages and five right-to-left ones. I no longer recommend it;
   **a tooltip on the item is the cheaper answer and has more precedent.**
4. **Menu tips over 75 characters are tier 2 content** (for example `lpn_tables_menu_tip`,
   `lpn_run_menu_tip`, `lpn_reports_menu_tip`): move them to a `?` in the dialog the item opens, or
   shorten them. A menu has no room for a glyph, so shorten.

SPECULATION, not upgraded: that a reader of these menus prefers a tooltip to nothing. No one was
shown either.

---

## Q8, for the record

Tom's answers stand: a real searchable help manual is the right home for the 32 over-long tips, and
`dev/tip-review.csv` is the artifact he asked for. Column `ida_category` is one reader's pass over
the strings; `where` is **derived from key names and the code, not clicked through in a browser**,
so a few locations are approximate. The `tom` column is empty for his verdict.
