# Where this suite is served from, and what it would take to move it

Written 2026-08-21, answering Tom's two questions: should the
`constructionnotesmanager.com/hawsedc/engcalcs` route be cleaned up, and how should
LibreWaterNet.org and LibreEPANET.org be organised. ROADMAP Task 479.

## 1. What is true today, measured

| Path | Serves | Works? |
|---|---|---|
| `hawsedc.com/engcalcs/` | `~/public_html/hawsedc/engcalcs` | Yes — this is the real site |
| `constructionnotesmanager.com/hawsedc/engcalcs/` | the same files | **No — no CSS, no JS** |
| `~/librewaternet.org` | librewaternet.org | empty |
| `~/libreepanet.org` | libreepanet.org | empty |

`hawsedc.com` is a subdomain of constructionnotesmanager.com whose document root is
`~/public_html/hawsedc`, so both hostnames reach the same directory by different path
prefixes. Deployment is `git pull` on the production checkout.

**The second row is not a configuration bug.** The suite emits **210 absolute
`/engcalcs/…` URLs** across its pages, `js/lpn-epanet.js`, `js/lpn-search.js` and
`sw.php`. Those resolve against the HOST root, so under
`constructionnotesmanager.com/hawsedc/engcalcs/` every one of them asks for
`constructionnotesmanager.com/engcalcs/…`, which does not exist. The suite is correct
at `<host>/engcalcs/` and nowhere else.

## 2. The egg costs less than it looks

`CANONICAL_ORIGIN` in `lib/config.inc.php` is the hard-coded string
`https://hawsedc.com`, deliberately not derived from the client-supplied `Host` header.
So a page served on the broken route still emits
`<link rel="canonical" href="https://hawsedc.com/engcalcs/…">`. **Search engines are
already consolidated on the right hostname**; this is not a duplicate-content problem
and it is not costing traffic. It is an unstyled page for a human who stumbles onto it.

**Fix it with a redirect, not a reorganisation.** One `mod_alias` line — the same
override level `.htaccess` already relies on, so it is known to be permitted here —
sends the whole broken prefix to the real site and keeps any inbound link working:

```apache
RedirectMatch 301 "^/hawsedc/engcalcs(/.*)?$" "https://hawsedc.com/engcalcs$1"
```

That goes in `~/public_html/.htaccess`, which is the parent site and **not in this
repo** — so it is a manual edit on the server, not a `git pull`. Do not *block* the
route; a 403 throws away links that a 301 keeps.

## 3. What actually blocks serving this suite at a different address

Three things, in increasing cost:

1. **`CANONICAL_ORIGIN` is one hard-coded origin.** A second deployment would announce
   hawsedc.com as its canonical and ask Google to de-index itself.
2. **210 absolute `/engcalcs/` paths.** They are mechanical to fix — derive the prefix
   once from `dirname($_SERVER['SCRIPT_NAME'])` and the suite becomes
   location-independent everywhere at once, including the broken route above. A check
   script can then forbid a new hard-coded one, the way `unit_factor_check.php`
   forbids a typed conversion factor.
3. **The service worker's scope is its own path.** `sw.php` sits in the suite root and
   caps its scope there; its precache manifest is generated at request time and
   `sw_manifest_check.php` diffs it against what pages really request. Both follow the
   prefix automatically once (2) is done — but the check has to be re-run against a
   deployment at a different prefix before believing it.

Nothing here is hard. It is one focused pass, and it is worth doing **once**, before
there are two deployments to keep in step rather than after.

## 4. Recommendation

**Do these, in this order:**

1. **Now, five minutes:** add the 301 above to `~/public_html/.htaccess`. The egg is
   gone and nothing else has to change.
2. **Before LibreWaterNet.org serves anything:** make the path prefix and the canonical
   origin derived rather than typed (§3.1 and §3.2), with a check guarding both. This
   is the gate — skip it and the second site ships asking to be de-indexed.
3. **Then adopt epanet-js's shape**, which is the right one: `librewaternet.org` is a
   small static landing page in **its own repository**, and `app.librewaternet.org` is
   this suite. They are different things with different release cadences and should not
   share a repo. `~/librewaternet.org` already exists as a document root; the app
   subdomain needs one more.
4. **LibreEPANET.org stays parked** until Task 248 lands — that gate is sequencing, not
   legitimacy (`dev/positioning.md`). Point it at the LibreWaterNet landing page in the
   meantime so the name is not dark.

**`hawsedc.com/engcalcs/` keeps working throughout and does not move.** It is the
indexed address, it carries the whole search history, and there is no version of this
plan where breaking it is worth anything.

## 5. The local working directory

Tom's idea (B1) is to make the CC project a parent folder holding `hawsedc/`,
`hawsedc/engcalcs/` (this repo), `librewaternet.org/` and `libreepanet.org/` as
siblings.

**Right shape, wrong moment.** It buys nothing until there is a second repository to
hold, and it costs a changed primary working directory, a re-rooted CLAUDE.md, and
every `dev/scripts/*.php` path assumption (`__DIR__ . '/../../lib'`). **Do it in the
same pass that creates the landing-page repo** — one move, one set of path fixes — and
not before.

Renaming production's `~/public_html/hawsedc` to `~/hawsedc.com` to match the other
domains is cosmetic and is the one change that can break the live site for a `git pull`
deploy. It is not worth doing on its own; fold it into step 3 if the host makes it easy,
and leave it alone otherwise.
