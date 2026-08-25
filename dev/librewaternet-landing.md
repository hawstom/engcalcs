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

## The feature list lives on that site too (2026-08-25)

Tom ruled Task 504's generated features list onto the landing page rather than into Help: its
audience is somebody deciding whether to try the software, which is that page's job.

- **The SOURCE stays here.** `dev/features-source.md` is hand-written, `dev/scripts/generate_features.php`
  merges it with the closed ledger into `dev/features.md`, and `check_all.sh` keeps that fresh.
- **The PAGE is over there**: `librewaternet.org/features.html`, built by
  `librewaternet.org/tools/build-features.php`, which reads `dev/features.md` out of this checkout
  and rewrites only what sits between its `BEGIN/END GENERATED` sentinels. The page's own design and
  framing prose are outside them.
- **So editing a feature sentence means editing `dev/features-source.md` HERE, regenerating, and
  re-running that build over there.** Nothing propagates on its own, and no check spans the two
  repositories — `check.sh` cannot see this one.
- **The build script carries an OVERRIDE MAP, and it is debt, not design.** It exists for a source
  line that could not go on the page as written; the honest repair for each is here, in
  `dev/features-source.md`, and the map should shrink to nothing. The first entry — a colour bullet
  claiming "four breaks... three ramps" against the real 3–7 classes, eight break modes and 41 ramps
  — was fixed here on 2026-08-25 and its override can go.
