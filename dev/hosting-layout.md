# Where this suite is served from, and what it would take to move it

Written 2026-08-21, answering Tom's two questions: should the
`constructionnotesmanager.com/hawsedc/engcalcs` route be cleaned up, and how should
LibreWaterNet.org and LibreEPANET.org be organised. ROADMAP Task 479.

## 1. What is true today, measured

| Path | Serves | Works? |
|---|---|---|
| `hawsedc.com/engcalcs/` | `~/addon_html/hawsedc.com/engcalcs` | Yes — this is the real site |
| `constructionnotesmanager.com/hawsedc/engcalcs/` | the same files | **No — no CSS, no JS** |
| `~/librewaternet.org` | librewaternet.org | empty |
| `~/libreepanet.org` | libreepanet.org | empty |

`hawsedc.com` is a subdomain of constructionnotesmanager.com whose document root is
the same directory, so both hostnames reach it by different path prefixes. Deployment is
`git pull` on the production checkout.

**The production path is `~/addon_html/hawsedc.com/engcalcs`, user `jconstru`, and PHP is
`/usr/local/bin/php` (8.3).** *(Corrected 2026-09-02 from a production shell. This table said
`~/public_html/hawsedc/engcalcs`, which does not exist there — a `cd` to it fails. The wrong path
had never been executed, only written, which is the whole argument for pasting a command instead
of citing a location.)*

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

**REWRITTEN 2026-09-13, because the symlink layout this section used to describe is gone.** It said
the repository was reachable as `~/webdev/engcalcs/hawsedc.com/engcalcs` and physically at
`/var/www/cnm/public_html/hawsedc/engcalcs`, by symlink, and that a physical move would take
`hawsedc.local` down because `/home/haws` is `drwxr-x---` and Apache cannot traverse it.

**The move happened anyway, and the traversal problem was solved rather than avoided.** The tree is:

    ~/webdev/
      hawsedc.com/            git@hawstom/hawsedc.com     DocumentRoot hawsedc.local
        engcalcs/             git@hawstom/engcalcs        nested; the parent ignores it
      librewaternet.org/      git@hawstom/librewaternet   DocumentRoot librewaternet.local
      not-epanet.org/         git@hawstom/not-epanet      DocumentRoot not-epanet.local
      worktrees/
        <branch>/engcalcs/    a worktree                  DocumentRoot worktrees/<branch>

Nothing is a symlink any more and `/var/www/cnm/public_html` is empty. Apache serves
`/home/haws/webdev/...` directly, so the permission question was answered in the vhosts, not dodged.

**`hawsedc.com/engcalcs/` still does not move.** It is the indexed address carrying the whole search
history, and that constraint outlived the layout it was written about.

**Launch Claude Code from the repository directory**, `~/webdev/hawsedc.com/engcalcs`. `CLAUDE.md`
lives in the repo and a session rooted at a parent will not find it -- and the memory directory is
keyed to the working directory's path, so launching from somewhere else silently starts with no
project memory at all.

**The remaining open question is the NESTING**, not the location: `engcalcs` sits inside the
`hawsedc.com` repository and is kept out of it by one `.gitignore` line. The three options, the
recommendation, and the reason the current asymmetry has already shipped two defects are in
`dev/git-organization-recommendation.md`. `nested_repo_boundary_check.php` holds the line meanwhile.

