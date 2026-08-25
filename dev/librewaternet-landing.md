# The LibreWaterNet landing page moved out of this repository

**2026-08-24.** `dev/librewaternet-landing/` — the draft `index.html` and `graphics-plan.md` — is
now its own repository, because the site and the software are different things and a page that
lived here would have been deployed from a checkout of the calculator suite.

    ~/webdev/librewaternet.org/          index.html, docs/graphics-plan.md, its own CLAUDE.md

**Nothing was copied; it was moved.** Two homes for one page is the drift this repository has
opinions about everywhere else, so there is no second copy to keep in step. The history of the
draft up to the move is in this repository's log:

    git log --follow -- dev/librewaternet-landing/index.html

## What stays here, and why

- **`dev/positioning.md` remains the authority for every public claim.** It governs the landing
  page and this suite alike, and the new repository's own `CLAUDE.md` points back at it rather than
  restating it. One record, not two.
- **`dev/screenshots/`** stays here too — the captures are of this software, `INDEX.md` carries the
  per-image publishable judgement, and the graphics plan reaches across to it. That is a deliberate
  cross-repository pointer, not an oversight: the pictures belong with the thing they are pictures
  of.
- **Task 479** is still the open task. The hosting decision is unchanged by the move.
