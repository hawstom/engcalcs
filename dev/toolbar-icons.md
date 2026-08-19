# The icon-only `lpn_` toolbar

Tom, 2026-08-18: *"We are coming to the point in UI design where I need to admit defeat about text
toolbar buttons; they are taking up too much room, and we have to move them into tips. Your graphics
are lovely and delightful, and I think it's time to drop the words from all the toolbar row; move
them to the beginning of their tips."*

**SHIPPED 2026-08-18.** This is now the record of the change rather than the plan for it. The seam
is `EngCalcs.setIconLabel()` (`js/Calculators.lib.js`), the wiring is `wireToolbar()`
(`js/looped-network.js`), and `dev/browser-pass/specs/toolbar.js` asserts the whole of §3 against the
real strip: every `#lpn_toolbar button` has a non-empty `aria-label`, a non-empty `title` beginning
with that name, an `<svg>`, `.ec-help`, and no text node.

**Scope is the toolbar row only.** `Icons.lib.php`'s own header rule — *an icon is a PREFIX, never a
replacement* — still holds everywhere else, and that header must be amended to say so rather than
left contradicting the shipped page: menu rows, the tab strip, the Settings panel and every other
calculator keep their words. A menu row is as wide as its longest label anyway, so an icon there buys
nothing; the toolbar is the one strip where horizontal space is actually scarce.

---

## 1. The three new icons

| Name | Where it goes | Replaces |
|---|---|---|
| `profile` | View > Profile row, and the bottom pane's Profile tab | the `view` eye, which was standing in |
| `pane-bottom` | the right-edge toolbar group's pane toggle | the `view` eye, same stand-in |
| `pane-right` | the right pane's toggle — the Visibility panel, shipped the same day | nothing |

Geometry and its rationale are commented in `lib/Icons.lib.php`. `pane-right` is deliberately drawn
before the right pane exists: the two icons only work as twins, and a twin drawn six months later is
a twin drawn against a shipped sibling instead of with it.

---

## 2. Every toolbar control, its icon, and the tip it should end up with

Read `Name` as "the word that is on the button today and will not be after this change". The tip is
`Name` + separator + `Explanation`. **Nothing here invents a word:** each half names the existing
language key it comes from.

| # | Icon | Name key | Explanation key | Resulting tip |
|---|---|---|---|---|
| 1 | `save` | `lpn_file_save` | `lpn_file_save_tip` | Save — Saves to the connected file. |
| 2 | `saveas` | `lpn_file_saveas` | `lpn_file_saveas_tip` (or `lpn_file_saveas_tip_download` when the browser cannot connect to a file — the page already switches between them) | Save as… — Choose a file to save to. … |
| 3 | `junction` | `lpn_tool_add_junction` | **NEW** `lpn_tool_add_junction_tip` | Junction — … |
| 4 | `reservoir` | `lpn_tool_add_reservoir` | **NEW** `lpn_tool_add_reservoir_tip` | Reservoir — … |
| 5 | `tank` | `lpn_tool_add_tank` | **NEW** `lpn_tool_add_tank_tip` | Tank — … |
| 6 | `pipe` | `lpn_tool_add_pipe` | **NEW** `lpn_tool_add_pipe_tip` | Pipe — … |
| 7 | `pump` | `lpn_tool_add_pump` | **NEW** `lpn_tool_add_pump_tip` | Pump — … |
| 8 | `valve` | `lpn_tool_add_valve` | **NEW** `lpn_tool_add_valve_tip` | Valve — … |
| 9 | `text` | `lpn_tool_add_text` | **NEW** `lpn_tool_add_text_tip` | Text — … |
| 10 | `select` | `lpn_tool_select` | `lpn_tip_select` | Select — Use this mode to change, move, and drag things on the map. |
| 11 | `del` | `lpn_tool_delete` | **NEW** `lpn_tool_delete_tip` | Delete — … |
| 12 | `undo` | `lpn_tool_undo` | **NEW** `lpn_tool_undo_tip` | Undo — … |
| 13 | `zoom` | `lpn_tool_zoom_extent` | **NEW** `lpn_tool_zoom_extent_tip` | Zoom to fit — … |
| 14 | `camera` | `lpn_clean_map` / `lpn_clean_map_off` when pressed | `lpn_clean_map_tip` | Clean map — Hide the mode line and the coordinate readout … |
| 15 | `labels` | `lpn_tool_labels` | `lpn_tip_labels_draggable` | Labels — You can drag a label to move it. … |
| 16 | *(none — a `<select>`)* | — | `lpn_tool_color_tip` | see §4 |
| 17 | `settings` | `lpn_tool_settings` | **NEW** `lpn_tool_settings_tip` | Settings — … |
| 18 | `find` | `lpn_find_menu` | **NEW** `lpn_find_menu_tip` | Find — … |
| 19 | `pane-bottom` | `lpn_pane_toggle` | `lpn_pane_toggle_tip` | Bottom panel — Show or hide the panel below the map. It holds the profile and the junction table. |

Two things this table is not:

- **Not the View menu.** `lpn_profile_menu` / `lpn_profile_tip` keep their word; only the icon on that
  row changes from `view` to `profile`.
- **Not a licence to shorten a name.** The name is the accessible name of the control (§3) and it is
  the first thing a hovering user reads. It stays exactly the word that was on the button.

### 2a. The new keys somebody has to write — 12, plus one mechanism key

`lpn_tool_add_junction_tip`, `lpn_tool_add_reservoir_tip`, `lpn_tool_add_tank_tip`,
`lpn_tool_add_pipe_tip`, `lpn_tool_add_pump_tip`, `lpn_tool_add_valve_tip`, `lpn_tool_add_text_tip`,
`lpn_tool_delete_tip`, `lpn_tool_undo_tip`, `lpn_tool_zoom_extent_tip`, `lpn_tool_settings_tip`,
`lpn_find_menu_tip`.

Plus `lpn_tip_join` (§2b), and `lpn_pane_right_toggle` / `lpn_pane_right_toggle_tip` for the right
pane's own toggle. All written, English only, payloads regenerated.

English only, in `lib/lang.ec.en.php`, then regenerate the payloads. **A button with no explanation
key is not blocked** — it falls back to the name alone, which is a correct and complete tip. But a
tool whose icon a first-time visitor cannot read (Tank against Reservoir; Valve) is exactly where the
word did the most work, so those seven are the ones worth writing first.

### 2b. Do NOT hardcode the separator

`CLAUDE.md` bans composing a *label* from fragments at render time, and that ban exists because
gendered, word-order and RTL languages broke on it. This is a tip rather than a label, and the two
halves are whole strings rather than words, so composition is allowed here — but the separator is
still a translated decision, not a punctuation constant. Hardcoding `' — '` at nineteen call sites
would be the same mistake at one remove.

So: one key, house pattern-string style, one composition site.

```
$ec_lang['lpn_tip_join']='{name} — {tip}';
```

A language that wants a colon, a different dash, or the explanation first changes one string.

---

## 3. Accessibility — the part most likely to ship broken

A button whose only content is `<svg aria-hidden="true">` **has no accessible name at all.** It is
announced as "button", full stop. Today every toolbar button's name comes from its text node, and
that text node is what this change deletes, so the names all disappear at once unless they are moved
first.

### What carries the name

**`aria-label`, set to the NAME ALONE** — `"Zoom to fit"`, never the whole tip.

- `aria-label` beats `title` for the accessible name, and beats the (now absent) content. `title`
  survives as the *description*, which is the right role for the explanation.
- The name is read on every focus, at every tab stop, and in the screen reader's own control list. A
  name that is a two-sentence paragraph makes the toolbar unusable by exactly the users who most need
  the name to be short.
- The icon's `aria-hidden="true"` stays. `EC_ICON_OPEN_TAG` sets it, and the reason in
  `Icons.lib.php` is unchanged — the icon is not a second thing to announce.
- A pressed toggle keeps `aria-pressed`; the name must NOT flip with the state (`aria-pressed`
  already says pressed). The one exception is Clean map, whose *word itself* changes
  (`lpn_clean_map` ↔ `lpn_clean_map_off`) because it names two different commands rather than two
  states of one; the `aria-label` follows the word.

Rejected: a `<span class="visually-hidden">` carrying the word instead. It has real advantages — it
is what browser find-in-page and machine translation see — but it puts two mechanisms in `setLabel()`
where one will do, and the toolbar's own words are already exposed to translation through the
language files.

### Rule B applies

`aria-label` is plain-text-bound. `plainTextBoundKeys()` derives that from PHP source, and these
strings reach `aria-label` through `pageConfig` in JS, so **the derivation will not see them**. No tag
may appear in any of the new `*_tip` values or in any of the name keys regardless; the check that
would have caught it is blind on this path.

### Touch — and a defect that already exists

`EngCalcs.initTips()` (`js/Calculators.lib.js`) only wires `.ec-help[title]` (or a
`[title][style*="cursor:help"]`). **Today only four toolbar buttons carry `.ec-help`** — Select, Clean
map, Labels, and the pane toggle. Save and Save as set a `title` with no class and are therefore not
wired at all. That is invisible while the word is on the button; after this change it is a button
that cannot be identified by any means except hovering a mouse.

Required, in the wiring track:

1. **Every toolbar button gets `className = 'ec-help'` and a `title`.** No exceptions, including the
   ones that have no explanation key — their title is the name alone.
2. `initTips()` must be re-run after the toolbar is built. `wireToolbar()` already does this; keep it.
3. **Know what touch actually gets.** `ecTipIsControl()` returns true for a `<button>`, so the trigger
   stays `hover focus` even on a hover-less device, *and* `initTips()` then wires
   `el.addEventListener('click', tip.hide)` on that same control. On a tap, focus shows the tip and
   the click immediately hides it. **A touch-only user cannot read a toolbar tip at all**, before this
   change or after it. Do not "fix" that by dropping the click-to-hide: it exists so the tip cannot
   hang over the panel the button just opened.

   **FIXED, and the fix is PRESS-AND-HOLD.** A control on a hover-less device now gets
   `trigger: 'manual'` plus a 500 ms touch-hold that calls `tip.show()`, cancelled by a move or an
   early release. A tap still presses the button and still hides the tip, so the click-to-hide that
   keeps a tip off the panel it just opened is untouched. It is the gesture every touch platform
   already uses for "what is this", and it is the only arrangement where a tap can both operate the
   control and leave the tip readable.

   And the discovery route that is not a tooltip shipped with it: **Help > "What the toolbar icons
   mean"**, one row per button with its icon, its name and its explanation. It is DERIVED from the
   strip (`toolbarIconIndex`, filled by `setIconLabel()`), so a button added later is in the list
   already; `specs/toolbar.js` asserts the row count equals the button count. It serves the
   first-time mouse user who does not think to hover just as much as the touch user.

---

## 4. The one control that is not a button: colour by value

`#lpn_color_quick` is a `<select>`, and its options are field names — data, not chrome. It keeps its
text; there is no icon-only form of a dropdown, and shrinking it is not what this change is for.

- It already carries `title = lpn_tool_color_tip`. Give it an explicit **`aria-label`** as well: a
  select named only by its `title` has a weak, browser-dependent accessible name, and there is no
  visible label beside it now that its neighbours are icons.
- Do not add `.ec-help` to it. A tooltip that opens on focus over a dropdown the user is about to
  open is a tooltip in the way of the control.
- **It was replaced, not restyled**, the same day: `#lpn_color_quick` is gone and Task 427's node
  select and link select live in the Visibility panel. So the toolbar carries no `<select>` at all,
  which is what an icon-only strip wants.

---

## 5. The seam: `setLabel()`

`EngCalcs.setLabel(el, iconName, text)` in `js/Calculators.lib.js`, reached through the local
`setLabel()` wrapper in `js/looped-network.js`, is the ONE way a control on this page gets an icon and
a word. Its comment says so, and that is why this change has a single seam instead of nineteen.

**Do not teach `setLabel()` to drop the word.** It builds the menu bar, the menu rows and the map
symbols as well as the toolbar, and all of those keep their text. The toolbar needs its own entry
point — one function, beside `setLabel()` and sharing `iconEl()`:

```js
// icon only; the word becomes the accessible name and the head of the tip
EngCalcs.setIconLabel = function (el, iconName, name, tip) { … }
```

It should do all four things at once, so no call site can do three of them:

1. `el.textContent = ''` and append `iconEl(iconName)`;
2. `el.setAttribute('aria-label', name)`;
3. `el.title = tip ? join(name, tip) : name`;
4. `el.className` gains `ec-help`.

That is the whole accessibility specification expressed as code, which is worth more than this
document: a rule a machine enforces is worth roughly ten a human must remember. Anything that goes on
the toolbar afterwards is correct by construction, and `dev/lpn-spike/` can assert the simple
invariant — **every `#lpn_toolbar button` has a non-empty `aria-label`, a non-empty `title`, and no
text node.**

New `pageConfig` keys must be added to `Looped-Network.php`; `pageconfig_check.php` fails the build if
a key the JS reads was never supplied, which is the guard that stops a visitor seeing "undefined" as a
tooltip.
