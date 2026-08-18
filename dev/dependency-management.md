# Dependency management

Policy for third-party code in EngCalcs. ROADMAP Task 413.

**ADOPTED 2026-08-17** (Tom: *"I am 100% on-board"*). Shipped: `package.json` (private, no `scripts`
key at all), a committed `package-lock.json`, `dev/vendor-manifest.json`, and
`dev/scripts/vendor_integrity_check.php` wired into `check_all.sh` as blocking. Both Bootstrap
digests were confirmed against the sha384 SRI hashes Bootstrap publishes for 5.3.2, so the vendored
copies are provably the upstream release.

Two JavaScript packages are vendored and shipped; no PHP dependency exists. Adopt `npm` as a
**development-time acquisition and integrity tool whose committed output is a file in
`js/vendor/`** — never a runtime resolver, never a bundler. Composer is out of scope. Neither a PHP
framework nor a change of language is a serious proposition for this codebase. Bootstrap earns its
place.

---

## Current state (measured 2026-08-17)

| Shipped file | Bytes | Gzipped | Package | Licence | Loaded by |
|---|---:|---:|---|---|---|
| `css/vendor/bootstrap.min.css` | 232,948 | 31,081 | bootstrap 5.3.2 | MIT | `HeadersFooters.lib.php`, every page |
| `js/vendor/bootstrap.bundle.min.js` | 80,663 | 23,747 | bootstrap 5.3.2 | MIT | `HeadersFooters.lib.php`, every page |
| `js/vendor/epanet-js.js` | 678,695 | — | epanet-js 0.9.0 | MIT | `js/lpn-epanet.js`, opt-in, runtime-cached |
| `js/vendor/slim/index.js` | 1,339 | — | epanet-js 0.9.0 | MIT | imported by the above |

- **Nothing is fetched from a third-party host at runtime.** A grep for
  `jsdelivr|cdnjs|unpkg|googleapis|cdn\.` across all shipped PHP/JS/CSS returns nothing.
  `privacy.php` asserts this and the offline service worker depends on it.
- **No PHP dependency of any kind.** No `composer.json`, no PHP `vendor/`, no autoloader, no
  `require`/`include` outside `lib/`.
- **Manifest and lockfile now exist; still no CI.** Root `package.json` + committed
  `package-lock.json` record what is vendored; `dev/browser-pass/package.json` (playwright-core) is
  a separate, dev-only tool whose lockfile stays gitignored — it installs a tool, the root one
  records what ships. `dev/lpn-spike/` deliberately runs with no `node_modules` at all.
- Provenance is prose in `js/vendor/README.md` **and is now enforced** by
  `dev/scripts/vendor_integrity_check.php` against `dev/vendor-manifest.json`.

## The three constraints, verified

1. **No build step, and it reaches further than "we do not run webpack."** Deployment is `git pull`
   on production. Cache-busting is `filemtime()`, correct only because **the served file is the
   source file**. `sw.php` generates the service worker at request time for the same reason —
   `git pull` does not preserve mtimes — and `dev/scripts/sw_manifest_check.php` renders real pages
   and diffs their asset URLs against the worker's. All three assume source-is-served.
2. **Inbound-licence compatibility with our OUTBOUND choice, which is a separate question.** Both
   packages are MIT, which is compatible with anything. Stated carelessly this constraint reads as
   "GPL is the goal"; Tom, 2026-08-17, pushed back — *"an argument could be made that GPL is more
   restrictive and thus less free than public domain or possibly other licenses."* That is correct
   and it is why the constraint is phrased inbound-only. The practical shape:
   - **Permissive inbound (MIT / BSD-2/3 / Apache-2.0 / public domain / CC0) is safe under any
     outbound licence we might ever pick**, so in practice this constraint costs us nothing and
     forecloses nothing. It is nearly vacuous, deliberately.
   - **What it actually excludes is inbound copyleft STRICTER than ours** — AGPL above all, which
     would reach the whole site. Also GPLv2-only, which is incompatible with GPLv3 in both
     directions.
   - **Our own outbound licence is revisable and is Tom's alone.** Nothing here depends on staying
     GPL v3; relicensing is a separate decision, and vendoring permissive code keeps it open.
   `epanet-js.LICENSE` ships with the code, as MIT requires of a redistribution.

   **Why GPL and not public domain — Tom's own reasoning, 2026-08-17, and it settles the question:**
   *"If 'you have nothing to fear', then GPL becomes Public Domain. The reason GPL exists is that we
   are afraid that the powerful can steal our ideas, and we are trying to establish our own slice of
   heaven."* GPL is **defensive**, not restrictive for its own sake, and the fear is well founded —
   public domain lets a well-resourced party take this work, close it, outrank it and leave the
   original unfindable. So GPL v3 stays.

   **The refinement he proposed, and it is worth doing:** publish that *more lenient terms are
   available on request*. This is standard practice (dual licensing / a stated exception policy) and
   costs nothing:
   - It is **available only to a sole copyright holder**, which he is — `Copyright 2009 Thomas Gail
     Haws` throughout. Before advertising it, confirm no third-party copyleft has been vendored and
     that no outside contributor holds copyright in the tree; AI-assisted commits are authored by
     Tom and do not cloud that.
   - It keeps the default defensive while letting the mission win the cases that matter — an NGO, a
     ministry or a university that cannot use copyleft gets a yes instead of a silence.
   - One sentence on `privacy.php`/`terms.php` or the footer, plus an address to ask at. **Do not
     write the sentence without Tom** — it is a legal offer in his name, not repo prose.
3. **Nothing third-party at runtime.** Confirmed above.

---

## npm: yes, at development time only

A root `package.json` plus a committed `package-lock.json`; `private: true`; `node_modules/`
gitignored; **no `build` script and no `scripts` entry that produces a shipped file**. Vendored
packages go under `devDependencies` — the site never consumes `node_modules`, so that is what they
are by the only definition that matters here.

**What it buys:**

- **`npm ci` reproduces the exact upstream tarball**, verified against the lockfile's sha512
  `integrity`. This is the thing the current recipe cannot give a *future* upgrade: today's
  Bootstrap copies were checked against the sha384 SRI hashes the old CDN tags carried, and those
  tags are gone.
- **One machine-readable place for name, exact version and licence**, which the check below can
  compare against the vendor manifest.

**What it does not buy:** anything at runtime, any bundling or minification, and any assurance that
what sits in `js/vendor/` matches what was installed. That last one is the check's job, not npm's.

**SRI is the wrong tool here and must not be re-proposed.** Subresource integrity protects a page
from a host you do not control serving different bytes. These files are same-origin; a host that
can serve different bytes can serve a different hash. The integrity that matters is at
*acquisition* (the lockfile's sha512) and at *rest* (a digest of the committed file, checked
locally). `lib/HeadersFooters.lib.php` correctly carries no `integrity` attribute.

### What breaks if someone later adds a bundler

This looks like an obvious improvement and is not:

- `filemtime()` cache-busting stops being true — a forgotten rebuild ships stale bytes under a
  fresh mtime, silently.
- `git pull` stops being a deploy: production serves whatever was last built *and committed*, with
  no symptom distinguishing that from a correct one.
- `sw_manifest_check.php` keeps passing while being wrong. It derives from the filesystem, so it
  would verify stale bundles against stale pages.
- `epanet-js.js` is a WASM-embedded ES module deliberately renamed from `.mjs` to dodge shared-host
  MIME configuration. A bundler re-opens that, and the single import-specifier edit recorded in
  `js/vendor/README.md`.

A bundler is therefore **banned**, not merely unnecessary — enforced by the absence of a `build`
script and by the check refusing a `js/vendor/` file it cannot match to an upstream package.

## Composer: out of scope

There is no PHP dependency to manage. **Do not create a `composer.json` for symmetry** — an empty
manifest is a maintenance object with nothing behind it, and it invites the à-la-carte habit named
below. Revisit when a PHP dependency is actually adopted.

## A PHP framework: no

CodeIgniter, Cake, Symfony and Laminas all bring routing, an ORM, templating, auth, CSRF,
validation, migrations, DI, a test harness and a hiring pool. Against this codebase:

- **Routing** — the 16 `.php` pages already *are* the routes, and their filenames are public URLs in
  search indexes and a sitemap.
- **ORM / migrations** — no database.
- **Auth / CSRF / sessions** — no accounts. The only session is analytics, consent-gated through
  `ecSessionStart()`; a framework's default session start is precisely what that rule forbids.
- **Validation** — all input handling and computation is client-side.
- **Templating** — the one honest win. `HeadersFooters.lib.php` and `Menus.lib.php` are a
  hand-rolled layout system and Twig would be better at it.
- **i18n** — the other apparent win, and a trap. The value here is not the 27 arrays; it is
  `lang_syntax_validate.php`, `lang_tag_parity_check.php`, `coverage_selftest.php`,
  `gloss_ref_check.php`, `detect_english_drift.php`, the payload generator and the coverage cross.
  All bespoke, all rewritten against a catalogue format, for nothing a visitor sees.

**The cost lands on the deploy.** A framework replaces `git pull` with a Composer install, a cache
warm-up, a writable `var/`, a front controller and mod_rewrite — on a shared host whose `.htaccess`
already carries an `Options` directive that returns 500 for *every* request under `/engcalcs/`
where the grant is missing. It also replaces `filemtime()` with an asset pipeline, i.e. a build
step, i.e. constraint 1.

It fails on its own terms: a single grand environment is worth adopting when it brings endless
solutions to problems you have. This suite's real problems are translation integrity, unit
correctness and offline delivery. No PHP framework addresses any of the three.

**The one rejected alternative worth recording:** Symfony or Laminas *components* à la carte
through Composer, without the framework. That is the dozen-libraries-for-one-off-tasks shape, and
it buys a Composer install step in a `git pull` deploy for nothing visible.

**When this answer changes:** the suite gains a database, user accounts, or server-side state. Any
one of those makes a framework the right call, and this section gets rewritten, not appended to.

### A different LANGUAGE: no, and not close

Tom also meant *language*, not only framework, and asked to keep it short. The case for a rewrite is
real — one language instead of two, since all computation is already JavaScript. What kills it is
that PHP's advantage here is not the language: **shared hosting runs `.php` with no process to
supervise, no port, no restart, and a `git pull` deploy.** Every alternative needs a long-running
process. Revisit only if hosting changes for some other reason.

---

## Adding a dependency

The burden runs both ways. "Roll your own" is not a virtue unless it makes its case — and neither
is a library. A proposal names:

1. What it replaces, and what our own version would cost in lines.
2. Bytes shipped, gzipped, and **on which pages** — every page is a different decision from one.
3. Licence, GPL-3-compatible (MIT, BSD-2/3, Apache-2.0 — note Apache-2.0 is compatible with GPLv3
   and not GPLv2). Anything else is Tom's decision, not an AI's.
4. Upstream activity, and what happens if it stops. A library is a maintenance commitment.
5. Confirmation it needs no build step and makes no runtime third-party request.

Recording it means three things in one commit: the `package.json` entry, the `js/vendor/README.md`
section (what, licence, provenance, every deliberate modification, upgrade recipe), and the vendor
manifest entry.

**Dev-only dependencies are a different class with a lower bar** — they never ship, so bytes and
GPL compatibility are not at stake. `dev/browser-pass/package.json` is the precedent and stays
where it is, lockfile gitignored. The root lockfile is the opposite: it is the provenance record,
and it is committed.

## The check to build (follow-up work, not built here)

Prose about verifying a vendored copy is worth about a tenth of a script that verifies it. Propose
`dev/scripts/vendor_integrity_check.php`, **blocking**, in `dev/scripts/check_all.sh` beside the
other structural checks.

It reads `dev/vendor-manifest.json` — one entry per vendored file: package name, exact version, the
path inside the upstream tarball, a sha384 digest of the file **as committed**, the SPDX licence
id, and a `modifications` array giving the exact substitutions applied after extraction (epanet-js
has two, already documented in `js/vendor/README.md`).

It compares five things:

1. Recomputed digest of each file on disk against the recorded digest — catches a hand-edit, a
   half-finished upgrade, a corrupted copy.
2. Every file under `js/vendor/` and `css/vendor/` has an entry — a newly vendored file nobody
   recorded fails.
3. Every entry names a file that still exists — same shape as `ecSwAssetExclusions()` in
   `lib/ServiceWorker.lib.php`.
4. Each entry's version matches the version pinned in `package.json`, so manifest and lockfile
   cannot drift apart silently.
5. Each entry's licence is on a GPL-3-compatible allow list.

On failure it prints the file, expected vs actual digest, and the one command that fixes it —
re-sync from `npm ci`, or `--record` when the change was deliberate — and exits non-zero.

**It must not touch the network.** `check_all.sh` is free, offline and seconds long, which is why
people run it. "Is there a newer upstream version?" is a separate advisory script, run on demand.

---

## Bootstrap

**It earns its place. Keep it.** 313,611 bytes uncompressed, ~54 KB gzipped, on every page.

What depends on it:

- **Collapse** — 65 `data-bs-toggle="collapse"` sites across 11 files: the show/hide row links in
  `lib/Calculators.lib.php`, the related-calculators line, the navbar toggler.
- **Dropdown** — 15 `data-bs-toggle="dropdown"` sites: the calculator, "more" and language menus in
  `lib/Menus.lib.php`.
- **Tooltip** — `js/Calculators.lib.js:39` and `js/looped-network.js:12610`: the `.ec-help`
  tap-triggered tooltip mechanism the whole labels-and-tips convention is built on, touch
  accessibility included.
- CSS: navbar, grid and the print utilities, across all 16 pages and the map editor.

Dropping it is therefore not a size optimisation; it is a UI rewrite of the menu bar, the collapse
links and the tooltip system, with an accessibility rule riding on the last. It is also the suite's
*only* client-side framework — the single-grand-environment case, not the dozen-one-off-libraries
case.

**Two things that look like improvements and are not:**

- *Trimming the CSS to a subset.* Bootstrap's customisation story is a Sass build — constraint 1.
  There is no middle position that respects "no build step": keep it whole, or drop it entirely.
- *Switching `bootstrap.bundle.min.js` to `bootstrap.min.js`.* The bundle includes Popper, which
  both Tooltip and Dropdown require. The non-bundle file is smaller and breaks both.

If Bootstrap is ever reconsidered, the honest framing is a whole-suite UI decision with a
measurable payoff (~54 KB gzipped per page), not a dependency-hygiene one — and it needs Tom, not
a check.
