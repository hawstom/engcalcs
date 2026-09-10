# Should `/app` move to `app.librewaternet.org`?

Written 2026-09-09, answering Tom's question. **The recommendation is NO, and the reason is not
taste: a subdomain is a different ORIGIN, and every saved project this suite holds is per-origin.**
Nothing here is implemented. It is a costing, so that if the answer ever changes it changes on the
facts.

## 1. The decisive fact: what a visitor would lose

Web storage is keyed on the ORIGIN — scheme + host + port. `app.librewaternet.org` and
`librewaternet.org` are two origins, so **none of the following travels with the move.** Full detail
per row is in `dev/cookie-storage-inventory.md`; this is that file read for one question.

| What | Where it lives | Survives the move? |
|---|---|---|
| **Every saved network** (`lpn_index`, `lpn_project_<id>`, `lpn_document`) | `localStorage` | **No.** The visitor opens the app and their project list is empty |
| **Open-file reconnection and the recent-files list** (`engcalcs-lpn`: `handles`, `recent`) | IndexedDB | **No** |
| The identity/token this browser sends to the file-lock broker (`lpn_identity`) | `localStorage` | No |
| All window furniture: `lpn_pane`, `lpn_rpane`, `lpn_setbox`, `lpn_findbox`, `lpn_libbox`, `lpn_ffbox`, `lpn_energybox`, `lpn_cmpbox`, `lpn_reportbox`, `lpn_show_titles`, `lpn_areahint` | `localStorage` | No |
| `bpn_sketch_toggles` | `localStorage` | No |
| Every calculator's typed inputs and unit choices (`<PageName>` cookies) | cookie, host-only | No |
| `ec_language` | cookie, HttpOnly, host-only | No — the visitor's chosen language reverts to negotiation |
| `ec_consent`, and the two purpose gates `ec_geosearch` and `ec_terrain` | cookie, host-only | **No — everybody is re-asked all three** |
| `ec_nolog` | cookie, host-only | No (it is already per-host and the inventory says so) |
| `engcalcs-offline-queue` | IndexedDB | No |
| The INSTALLED app, its registration and its offline caches | service worker, per-origin | **No.** Someone who installed from `librewaternet.org/app/` keeps an installed app pointed at the OLD origin, and installing from the new one is a second app, not an update |

**There is no OPFS store.** `navigator.storage.getDirectory()` appears nowhere in the tree: a saved
project is `localStorage` (`lpn_project_<id>`, indexed by `lpn_index`) plus the `engcalcs-lpn`
IndexedDB `handles` store that reconnects it to the file the user picked. Both per-origin, and a
`FileSystemFileHandle` is origin-bound besides — it cannot be handed to another origin even if the
rest were copied.

**A project stored in `localStorage` and not also written out to a file would be unreachable.** It is
not deleted — it is still sitting under the old origin — but there is no in-app route to it from the
new one, and a visitor has no reason to believe anything but "it lost my work". There is a second-order cost too: Task 200's repeat-visit signal probes the page's own input cookie
and `lpn_project_<id>` to decide whether a browser has used this page before, so on a new origin
**every returning visitor reads as new** until the storage rebuilds. `ec_blang` and `ec_seen` go the
same way, so the browser-language and repeat-use statistics take a one-time discontinuity that
nobody re-deriving the report later would know about.

A cookie could be
widened to `Domain=.librewaternet.org`; `localStorage` and IndexedDB have no such mechanism, and no
API lets one origin read another's.

**Any move would therefore need a migration page served at the OLD origin** that reads the old
storage, hands it across (postMessage from an iframe, or a download/upload round trip), and a way to
tell a returning visitor that it exists. That is a real feature with its own defects, not a
redirect.

## 2. What it would cost besides that

- **The canonical address moves again, and it only just settled.** Task 479.01 (closed 2026-09-06)
  made `https://librewaternet.org/app/` the address every door on both hosts nominates, after a live
  defect in which every page and all 545 sitemap URLs pointed at an address that 301-redirected.
  `lib/Canonical.lib.php` is the one declaration. Moving means new canonical, 27 new hreflang
  alternates per page (27 languages plus `x-default`, all emitted from `ec_canonical_url()` in
  `lib/HeadersFooters.lib.php`), new `og:url`, and a regenerated **545-URL** sitemap — which
  `../sitemap.xml` is not tracked by git, so it is a manual upload (CLAUDE.md, "Deploying"). It would
  also need a THIRD verified Search Console property, since a sitemap listing another host's URLs is
  cross-submission and is honoured only when both properties are verified by the same owner.

- **`canonical_origin_check.php` cannot express a split.** Rule 4 requires
  `CANONICAL_ORIGIN_DEFAULT` to be one of the whitelisted values and rule 5 requires
  `generate_sitemap.php`'s `$origin` to agree with it. There is exactly ONE default origin and one
  sitemap origin for the whole suite. Putting the map editor on one origin and the other 17
  calculators on another is not a line in the whitelist; it is a redesign of that constant.
- **A second consolidation inside a month.** `lib/config.inc.php`'s comment on
  `$ec_canonical_origins` already accepts one slow, imperfectly reversible transfer of hawsedc.com's
  history onto librewaternet.org. Doing it again spends the same coin a second time, and the second
  spend is worse because the first has not finished settling.
- **`CANONICAL_ORIGIN` is a whitelist and would need the new host added** — deliberately never
  derived from `HTTP_HOST` (`canonical_origin_check.php` is blocking).
- **The service worker.** `ecSwMounts()` declares `/engcalcs/` and `/app/`; `ecSwScope()` DERIVES the
  scope from them and `sw.php` sends `Service-Worker-Allowed` accordingly. A worker's scope cannot
  cross an origin, so `app.librewaternet.org` needs its own registration, its own scope and its own
  cache — and the installed PWA on the old origin keeps controlling the old address until it is
  unregistered. `sw_scope_check.php` and `canonical_path_check.php` both read that mount list in
  both directions.
- **The web app manifest.** `start_url` must be inside `scope`; an installed app pointing at the old
  origin does not follow a redirect into a new one as the same app — it is a second installation.
- **The 210 absolute `/engcalcs/…` paths** (`dev/hosting-layout.md` §3) do not care about the host,
  so a subdomain sharing the same docroot is fine here — this is the one cost that is zero.

## 3. Can the host even do it?

- **TLS: already covered.** The live certificate on librewaternet.org carries
  `DNS:*.librewaternet.org` (Let's Encrypt, read from the live socket 2026-09-09), so a subdomain
  would be served over https without a new issuance.
- **DNS: not covered.** `app.librewaternet.org` has no A record today; there is no wildcard A. It
  would have to be created.
- **Docroot: easy.** cPanel serves a subdomain from any directory under the account, so it could
  point at the same checkout the symlink already reaches, exactly as `/app/` does now.
- **AND THE TRAP CLAUDE.md WARNS ABOUT IS REAL AND WOULD BITE.** New domains on this account default
  to `ea-php56`. When librewaternet.org was created that took the whole suite down with
  `PHP Parse error: syntax error, unexpected '?'` on the null coalescing operator, on the same files
  that parse fine on the other host. A new subdomain must be set to `ea-php83` (MultiPHP Manager, or
  `LangPHP::php_set_vhost_versions`) as part of creating it, not after somebody notices.
- Related, measured on this account 2026-09-06 and worth knowing before automating any of it: several
  cPanel API calls report success while doing nothing (`Mime::add_redirect` ignores `type=temporary`,
  `Mime::delete_redirect` silently does nothing, `DNS::mass_edit_zone` rejects batched edits).

## 4. What it would buy

Honestly: **very little that we do not already have.**

- **Cookie isolation** — the usual reason for an app subdomain. It does not apply here. The suite
  sets no third-party cookies, starts no session (`no_session_check.php` holds that at zero), and
  every cookie it does set is host-only already. There is nothing to isolate from.
- **Independent deploys** — does not apply. Both sites are one `git pull` on one host, and the
  landing site is already its own repository with its own cadence.
- **A cleaner name** — `app.librewaternet.org` reads slightly better than `librewaternet.org/app`,
  and it is the shape epanet-js uses. `dev/hosting-layout.md` §4 already answered exactly this: the
  epanet-js shape (`epanetjs.com` -> `app.epanetjs.com`) is named there as the model, and the note
  records that it was reached here **without** a subdomain, deliberately. That judgement has not been
  falsified. A subdomain is not on the closed-ledger's not-to-be-re-proposed list, so the question is
  genuinely open on the record; what is not open is the cost.
- **One genuine future reason, and it is not here yet:** if the app ever needed a different security
  posture from the landing page — a stricter CSP, `Cross-Origin-Opener-Policy`, an origin-isolated
  worker — a separate origin is the clean way to get it. Nothing on the roadmap asks for that.

## 5. Recommendation

**Keep `librewaternet.org/app/`.** The aesthetic gain is small, the SEO cost is a second
consolidation on top of one that has not finished, and the storage cost is that every existing user
loses their saved networks unless a migration feature is built first.

**If it is ever revisited, the order is fixed by the storage fact:** build the migration path first,
prove it on a real project, and only then move the address. Doing it in the other order is
unrecoverable for anyone who had not exported to a file.
