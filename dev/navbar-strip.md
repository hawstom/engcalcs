# The navbar strip: what sits where, and why

Current state after Task 298. `lib/Menus.lib.php` `echoEngCalcsMenu()` is the only place this is
built; `css/engcalcs.css` carries `.ec-brandgroup`, `.ec-nav-libre` and the wrap rules.

## The arrangement

| Zone | Contents | Collapses under `lg`? |
|---|---|---|
| Brand group (outside `.navbar-collapse`) | `HawsEDC Calculators` + GitHub mark + `Libre Software` (`#nav-libre`) | No — always visible |
| Left list (`navbar-nav me-auto`) | Hydraulics dropdown — the calculators | Yes |
| Middle (calculator pages only) | Install button, calculation-label field, Copy link | Yes |
| Right strip (`navbar-nav ms-auto`) | Help (`#dropdown-help`), then Language (`#dropdown-lang`) | Yes |

The dividing idea: the left list is **the work** — pick a calculator. The right strip is the two
controls that are about *using the site* rather than doing a calculation, and both read as
icon-plus-word (life-ring + Help, globe + language name). Help holds About, Install and Contact.
Walkthroughs is not there and must not be re-added — it covers the one Looped Network page and
lives in that page's own Help menu (see the comment at the dropdown, and `lpn_help_walkthroughs`).

The key behind the label is still `menu_more`. Only its English *value* changed (`More` → `Help`),
which is a translation resync for the 26 other files, not a new key and not a rename.

## Where the FLOSS mark goes (Task 244)

**Recommendation: leave it where it is — welded to the brand, outside `.navbar-collapse`.** It is a
claim about what this software *is*, so it belongs beside the software's name, and it is the one
navbar item that must survive the hamburger: a visitor who never opens a menu should still see that
the source is there. Tom settled exactly this in the 2026-08-09 browser review — *"as an extension
of the HawsEDC Calculators {} Libre Software, almost as one string"* — and Task 298 was written to
be decided alongside it so the item would not be moved twice. It is not moving.

**Rejected alternative: move it into the right strip, beside Help and Language.** That strip is
where a reader looks for *controls* — things that do something when clicked — and the FLOSS mark is
a statement, not a control; it would read as a third menu. It would also disappear under the
hamburger on every phone, which is precisely the case Tom's review rejected, and it would put three
nowrap items into the 992–1150px band that already needed the `flex-wrap: wrap` fix to stop the
navbar colliding with itself.

Consequence for anything landing here next: **the right strip is now full at two items.** A third
belongs inside the Help dropdown, not beside it.
