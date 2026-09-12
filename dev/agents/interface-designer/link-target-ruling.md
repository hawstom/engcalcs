# Ruling: when a link opens in a new tab

Asked 2026-09-12. Scope: `/app/` (`Looped-Network.php` + `js/looped-network.js`) and
`~/webdev/librewaternet.org`'s reading pages. No shipped file touched — this is a ruling, pending
Tom's word, same status as every other entry in this journal.

## The rule

**A link opens in a new tab exactly when the reader is on an ERRAND — a short trip to consult
something, meant to be followed by an immediate return to the exact place they left — and the tab
they are on holds something that trip would otherwise cost them: unsaved work, or values already
typed into a form. Every other link is a DESTINATION and takes the same tab, because the Back
button is the way back and a forced new tab breaks it.** Two tests, and either one alone decides
it:

1. Would leaving the current tab **discard something the reader made** (a drawing, typed numbers)
   that cannot be recovered by pressing Back? → new tab.
2. Is the reader **choosing to go somewhere** — another page, another product, another site they
   asked for by name — rather than glancing at a reference mid-task? → same tab, and Back is the
   only affordance they need.

This is not a new invention. It is the rule this repository had already reached, case by case,
without ever writing it down — I found it stated almost verbatim at `lib/config.inc.php:117-119`
("This suite reserves a new tab for genuine side-trips... and the app is the destination, not a
side-trip") and again at `lib/Calculators.lib.php:105-107` ("navigating away would discard the
numbers the visitor has typed"). My contribution is naming it as one rule and checking the whole
tree against it, not inventing a new policy.

**CITED.** Nielsen Norman Group's standing guidance (nngroup.com/articles/new-browser-windows-and-
tabs/) is that links should open in the same tab "for the most part," and that new tabs are
disorienting, break the Back button, and confuse less technical users managing multiple
tabs/windows — with the one recognized exception being when "the user needs additional
information to complete a task" (a reference lookup mid-task), which is test 1 above stated the
other way round. GOV.UK's Design System (design-system.service.gov.uk/styles/links/) states the
same default — "avoid opening links in a new tab... it can be disorienting" — and gives the
identical exception: to stop the user losing information they have typed into a form. Both
sources are read-page guidance for ordinary sites; nothing I found argues for new-tab-by-default
anywhere, which is why the split I'm ruling on is by CASE, not by property of the link (internal
vs. external, same-site vs. off-site).

**A separate accessibility point that this rule does not itself satisfy: WCAG 3.2.5 Change on
Request (Level AAA) treats an unannounced new tab as a context change the reader did not
initiate**, and GOV.UK's own implementation note pairs every forced-new-tab link with visible or
programmatic text — "(opens in new tab)" — so a screen-reader user or someone who does not see the
new tab open is not left searching a page that has silently changed under them. **This suite has
none of that text anywhere**, on any of the ~25 new-tab links I found. 3.2.5 is AAA, not the level
this suite targets, and the fix costs a new translated string wherever it is visible text rather
than a screen-reader-only span — but the gap is real and I am naming it rather than folding it
into silence. I am not ruling that it must be fixed; that is a translation-cost decision for Tom,
and it is filed to the wishlist rather than mandated here.

## Categories, sorted

**New tab — the errand-with-something-to-lose case, and every instance I found already does
this correctly:**

- **The whole of `/app/`.** Every outbound row in the Help menu (Walkthroughs, Toolbar key,
  Welcome page, Fix something, Install, Screenshot gallery, Privacy notice, Terms of use, Cookie
  settings — `js/looped-network.js:22157-22218`), the About box's LibreWaterNet.org and Credits
  links (`Looped-Network.php:1208,1214`), the map attribution row — OSM, Mapbox, Maxar, "Improve
  this map" (`Looped-Network.php:485`) — and the ColorBrewer credit link in Settings
  (`js/looped-network.js:13541`). **All of it is justified by ONE fact, stated once at
  `js/looped-network.js:22111` and correct**: the drawing surface holds unsaved work behind a
  `beforeunload` guard, so navigating the tab anywhere — even to an internal, same-app page like
  `privacy.php` — meets a browser "Leave site?" dialog mid-edit. That collapses the usual
  internal/external distinction: from inside `/app/`, EVERY outbound link is an errand, because
  the tab itself is the thing at risk, not just the destination.
  - Also `setFieldLabel()`'s `href` parameter (`js/looped-network.js:30815-30840`, 26 call sites in
    element-property popups) — same reasoning, and it is where a reader is mid-editing a specific
    element's fields.
- **`ecLinkTipLabel()`** (`lib/Calculators.lib.php:109-114`), used by every ordinary calculator's
  reference links (roughness tables, HY-8, the friction-slope explainer, a YouTube tutorial).
  Justified by test 1 directly: these pages have no save button and no undo — a value typed into a
  field and then navigated away from is gone, unrecoverable even by Back (the form resets).
- **`lib/Menus.lib.php:120`, the "Libre Software" / GitHub license link in the suite navbar.** Same
  reasoning as the line above — it sits on every calculator page, over a form that may hold typed
  values.

**Same tab — the destination case, and every instance I found already does this correctly:**

- **`EC_LWN_APP_URL`**, wherever it is used: the "LibreWaterNet.org" row in the suite's own
  dropdown menu (`lib/Menus.lib.php:149`), and the "LibreWaterNet.org" link in every calculator's
  related-calculators footer row (`Manning-Pipe-Flow.php`, `Hazen-Williams.php`, etc.). Stated
  correctly already at `lib/config.inc.php:117-119`: the app is a destination a reader is choosing
  to go to, not a reference they'll bounce back from — Back is the way back if they change their
  mind, and a forced new tab would give them a second app instance sitting in a tab they don't
  need.
- **Every marketing-site link on `librewaternet.org`** — internal nav (Front page / Feature list /
  Credits / Disclosures / Citations), the "Open the app" / "Start a model now" buttons to
  `/app/`, and every external citation in `citations.html`, `credits.html` and `epanet.html`
  (epa.gov, Wikipedia, GitHub, uscode.house.gov, osti.gov, colorbrewer2.org, fsf.org,
  psu.edu). None of these pages hold anything a reader typed, so test 1 never fires, and I am
  ratifying the current all-same-tab state rather than proposing anything new.

## The one genuine judgment call, not a ruling

`citations.html` is a table of ~30 rows, each linking one claim to its external source. A reader
checking several rows in sequence is doing something closer to NN/g's "reference lookup mid-task"
exception than an ordinary marketing-page click — except the "task" is reading, not filling a
form, so nothing is lost by test 1, only PLACE in a long page is lost by test 2's Back-button
answer (scroll position, which Back does restore in every current browser). **I am not
overruling the current same-tab state here.** NN/g's own advice is not to decide this by the type
of link but by observing actual readers; if usage ever shows people leaving `citations.html` and
not returning after a source click, that is the evidence to flip this one page's citation links —
and only this page — to new tab, with the "(opens in new tab)" text alongside it per GOV.UK's
implementation. Nothing to do until then.

## Overrides of the tree's existing state

**None.** Every link I read in both properties already matches the rule above. I looked for a
violation specifically — a reference link inside `/app/` opening in the same tab and risking the
drawing, or a "destination" link opening in a new tab and stranding an extra tab behind it — and
found none. The 13-vs-12 split `blank_target_check.php` measured (ROADMAP Task 322) was about the
SECURITY attribute (`rel="noopener"`), never about this policy question; by the time I read the
tree, every `target="_blank"` site already carries it, and every same-tab site is correctly
same-tab.

## Does the app answer differently from the reading pages?

Not by a different rule — by the same rule meeting a different fact. `/app/` holds a document a
reader is actively changing and has not necessarily saved; a marketing page holds nothing but
words the reader is looking at. Test 1 is satisfied everywhere inside `/app/` (the whole page is
the "form," in effect) and nowhere on `librewaternet.org` (there is no form to lose). That is why
`/app/`'s Help menu can look like it never leaves the tab and the marketing site can look like it
always does — same rule, opposite answer, because the thing at risk is present in one and absent
in the other.
