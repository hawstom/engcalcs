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

## 3. Serving it at a second domain — the cheap way, already costed

`dev/positioning.md` §6.1 costed this on 2026-08-14 and its ruling stands: **serve the
suite at `<newdomain>/engcalcs/` and change no code.** A symlink is enough on this host —

```
ln -s ~/public_html/hawsedc/engcalcs ~/librewaternet.org/engcalcs
```

— and `~/librewaternet.org/index.html` becomes the landing page. Every absolute
`/engcalcs/…` path resolves, the service worker keeps its scope, and there is one
checkout to `git pull`. An `Alias` in a vhost does the same thing more cleanly if cPanel
exposes one; the symlink needs `Options +FollowSymLinks`, which is normally on but is
worth testing before relying on it — see `.htaccess`'s warning about `Options -Indexes`
for how loudly this host fails an ungranted `Options`.

**The tempting alternative — deriving the prefix from `dirname($_SERVER['SCRIPT_NAME'])`
so the suite runs anywhere — is REJECTED.** It buys a prettier URL for a real refactor,
and the URL is not worth it while one symlink does the job.

**Correction to `dev/positioning.md` §6.1, measured 2026-08-21:** it says 112 hardcoded
`/engcalcs/` paths. There are now **210**, across the 18 calculator pages, `sw.php`,
`js/lpn-epanet.js` and `js/lpn-search.js`. The refactor got more expensive, not less,
which strengthens the ruling above rather than weakening it.

### The one code change — SHIPPED 2026-08-23

`CANONICAL_ORIGIN` was the hard-coded string `https://hawsedc.com`, which would have made
librewaternet.org invisible by construction: every page there asking Google to index
hawsedc.com instead. It is now the **host → variant whitelist** §6.1 named — never a value
derived from `HTTP_HOST`, because that constant exists precisely to stop a spoofed `Host`
header poisoning the canonical.

`$ec_canonical_origins` in `lib/config.inc.php` maps a bare hostname (lowercased, port
stripped, one leading `www.` removed) to its origin. **A spoofed Host can only ever select
an origin we already own and listed**; anything unrecognised falls through to
`CANONICAL_ORIGIN_DEFAULT`, which is the indexed address. Verified per host:

| `Host:` | `CANONICAL_ORIGIN` |
|---|---|
| `hawsedc.com`, `www.hawsedc.com`, absent | `https://hawsedc.com` |
| `librewaternet.org`, `WWW.LibreWaterNet.org:443` | `https://librewaternet.org` |
| `constructionnotesmanager.com` | `https://hawsedc.com` |
| `evil.example.com` | `https://hawsedc.com` |

`dev/scripts/canonical_origin_check.php` is blocking and keeps it a whitelist: it fails on a
computed value, on a non-https or path-bearing origin, on a default that is not itself
whitelisted, and on `generate_sitemap.php`'s own `$origin` drifting from that default (the
sitemap runs outside a web request, so it carries its own copy). Mutation-tested against all
three. **No code change is left. What remains for LibreWaterNet.org is server work only:**
the symlink, the landing page, and testing `Options +FollowSymLinks`.

## 4. Recommendation

1. **Now, five minutes, no code:** add the 301 in §2 to `~/public_html/.htaccess`. The
   egg is gone.
2. **Before LibreWaterNet.org serves anything:** the `CANONICAL_ORIGIN` whitelist (§3),
   with a check guarding it. This is the gate.
3. **Then:** landing page at `~/librewaternet.org/index.html`, in **its own repository** —
   a marketing page and an engineering suite have different release cadences and should
   not share one. Symlink `engcalcs` beside it. This is epanet-js's shape
   (epanetjs.com → app.epanetjs.com), reached without a subdomain.
4. **LibreEPANET.org stays parked** until Task 248 lands — sequencing, not legitimacy
   (`dev/positioning.md` §6). Point it at the LibreWaterNet landing page meanwhile so the
   name is not dark.

**`hawsedc.com/engcalcs/` keeps working throughout and does not move.** It is the indexed
address and carries the whole search history; no version of this plan is worth breaking it.

## 5. The local working directory

Tom's idea (B1) is to make the CC project a parent folder holding `hawsedc/`,
`hawsedc/engcalcs/` (this repo), `librewaternet.org/` and `libreepanet.org/` as
siblings.

**DONE 2026-08-24, and it moved NOTHING** — which is why it cost nothing. The tree is:

    ~/webdev/
      engcalcs/
        hawsedc.com -> /var/www/cnm/public_html/hawsedc     (symlink)
      librewaternet.org/                                    (its own git repo, empty)

So the repository is reachable as `~/webdev/engcalcs/hawsedc.com/engcalcs` and is still
physically at `/var/www/cnm/public_html/hawsedc/engcalcs`, with `.git` beside its own
working tree exactly as before (Tom, 2026-08-24). No path assumption moved, `CLAUDE.md`
did not re-root, and `dev/scripts/*.php` still resolves `__DIR__ . '/../../lib'`.

**A PHYSICAL MOVE INTO `~/webdev` WOULD TAKE `hawsedc.local` DOWN, and that is the reason
the links point the way they do.** `/home/haws` is `drwxr-x---`, so Apache's `www-data`
cannot traverse it at all; serving the suite from there needs `chmod o+x` on the home
directory *and* a new `<Directory>` block. `hawsedc.local`'s vhost inherits
`Options Indexes FollowSymLinks` from `<Directory /var/www/>`, so a symlink is followed
happily — in this direction. Verified after the change: `/engcalcs/` returns 200 on
both :80 and :443.

**Launch Claude Code from the repository directory, not from `~/webdev/engcalcs`.**
`CLAUDE.md` lives in the repo, and a session rooted at the parent would not find it.
The `~/webdev` tree is for a person navigating projects, not for the agent's root.

Renaming production's `~/public_html/hawsedc` to `~/hawsedc.com` to match the other
domains is cosmetic and is the one change that can break the live site for a `git pull`
deploy. It is not worth doing on its own; fold it into step 3 if the host makes it easy,
and leave it alone otherwise.
