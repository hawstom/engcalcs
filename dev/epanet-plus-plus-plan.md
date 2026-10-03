# EPANET++ — deployment and claim plan for Task 697

Tom's ruling 2026-09-27 (R-336/R-344): **epanet-plus-plus.org is canonical; epanetpp.org
301-redirects to it.** That settles half of Task 697. What remains: what each domain serves, and
what the name may say.

## 1. What each domain serves

A page nominates exactly one canonical address (`<link rel=canonical>`, all 27 hreflang
alternates, `og:url`, sitemap). Two copies of `lpn_` each claiming canonical is the split that cost
hawsedc.com ranking for three months when every page nominated librewaternet.org.

**Option A — landing page only.** `epanet-plus-plus.org` is a small static site (like
`not-epanet.org`/`librewaternet.org`): hero, claim, one link to `https://librewaternet.org/app/`,
which stays canonical for itself exactly as `ecCanonicalOrigins()` already declares.
`epanetpp.org` 301s to it. **Zero risk to existing rankings** — the new domain earns only its own
small footprint and passes visitors through an ordinary outbound link. It is not a second front
door the app can rank on independently; it is a poster pointing at the existing one.

**Option B1 — a second, host-aware app entry point.** Mount a branded copy of `Looped-Network.php`
at `epanet-plus-plus.org/app/`, sharing JS/CSS by reference, nominating `epanet-plus-plus.org` as
its OWN canonical. This is genuine A/B testing — two independently-rankable front doors for one
tool — but `ecCanonicalOrigins()` currently maps page filename to ONE origin, suite-wide; giving
one page two canonical homes on two hosts needs a host-aware entry and touches all five canonical
readers (tag, hreflang, og:url, og:image, sitemap). Real engineering, not a declaration.

**Option B2 — move the app's canonical home outright.** Not A/B testing, a rebrand; retires
LibreWaterNet as the map's front door. Positioning.md's EPANET++ gate is about the NAME existing on
two domains, not about renaming the app itself. Do not do this without Tom saying so explicitly.

**Option C — full mirror of all 16 calculators.** Multiplies the per-page canonical risk across 16
pages for a domain whose whole point (per Tom's framing) is the looped network. The calculators are
hawsedc.com's per the 2026-09-17 divorce ruling; no reason yet to move them here.

### Recommendation: Option A now; B1 only if Tom wants a real second front door after seeing A

Concrete shape:
- `https://epanet-plus-plus.org/` — landing page, English only, static, outside this repo (like
  its two siblings). One outbound link to `https://librewaternet.org/app/`.
- `<link rel="canonical" href="https://epanet-plus-plus.org/">` on that one page.
  `lib/Canonical.lib.php` needs NO change — this is a separate repository serving no page from
  this one, same as `librewaternet.org` and `not-epanet.org`.
- `epanetpp.org`'s entire `.htaccess`:
  ```
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^(www\.)?epanetpp\.org$ [NC]
  RewriteRule ^(.*)$ https://epanet-plus-plus.org/$1 [R=301,L]
  ```

## 2. The name as a public claim

Positioning.md §6 already ruled on the underlying question: `LibreEPANET` failed Tom's honesty
test (not more libre than public-domain software); `EPANET++` survives it because "++" claims an
extension — scenarios, fire flow, libraries, EPANET-engine EPS checked to 0.005 ft against
`Net3.rpt` — and those are shipped, not promised. That reasoning is not re-argued here; this is
what the site built on it may and may not say.

**May say:** that it extends EPANET, naming the shipped extensions; that the engine is EPANET's
own (OWA-EPANET 2.3.5, vendored, MIT-wrapped); our own licence stated as our own fact, never
narrated against theirs (§2: "state our own licence; do not narrate theirs"); that EPANET is US
EPA public-domain software (checkable, 17 U.S.C. § 105).

**Must not say:** any completeness claim against EPANET — Task 697 itself predicts this is the
first question asked; any implication of EPA affiliation, review, sponsorship, or endorsement; any
of the four struck phrases in `public_claim_check.php` ("your phone", "PC application", "the only
third-party request", "no extended-period simulation"); any live commercial trademark; "more free
than EPANET" (the exact `LibreEPANET` trap).

**Does the name need a disclaimer?** Yes. `not-epanet.org` already has the model paragraph:

> EPANET is a program of the United States Environmental Protection Agency. This site is not
> EPA's. The software is not EPANET, is not a version of EPANET, and is not an official successor
> to EPANET. EPA has not reviewed, endorsed, approved, sponsored, or been asked about any of this.

Put it on the first screen — "++" is a bolder typographic claim than "Not EPANET" and invites the
affiliation question harder.

### Hero copy

The proposal that stood here is superseded. **The live wording is Tom's own** — read
`~/webdev/epanet-plus-plus.org/index.html`, lines ~66-72 — made exact about the engine (OWA-EPANET
2.3.5, Open Water Analytics' MIT-licensed continuation) on his instruction the same day it was
drafted (2026-09-27: "Make it exact"). Do not edit a word of it without his ruling; do not
re-propose it here.

**Rejected, on his instruction, and not to be restored:** "We are still finding out what EPANET can
do that we cannot, and we say so." — implied the suite might not yet know EPANET's gaps, when
diligent research (Mary) was already underway to find them.

## 3. Fit with the mission and the sibling sites

Positioning.md §6: "the EPANET name is important for the kind of users who have not been using
WaterCAD etc." Engineers searching for EPANET by name, not for LibreWaterNet or Not EPANET, are the
audience this domain is for. It sits beside, not above, the other two doors: LibreWaterNet leads
with the invitation, Not EPANET leads with gratitude and disclosure, EPANET++ leads with the
extension claim — three honest doors into the same tool, none contradicting the others. No
campaign needed; it is one more honestly labeled door.

## 4. Build steps, in order

1. **(AI, this repo)** This plan, committed — done by this task.
2. **(Tom)** Rule on the hero copy and on Option A vs. B1.
3. **(AI, new repo, later session)** Build `epanet-plus-plus.org` as its own small static repo,
   sibling to `librewaternet.org`/`not-epanet.org`, same `check.sh` pattern (UTF-8 declared early,
   no cross-origin fetch, no webfont, em-dash ratchet at zero, real doctype/html/head/body,
   viewport line). Not built here — this session may not create a new repo or touch sibling sites.
4. **(AI)** Build `epanetpp.org` as a bare `.htaccess`-only doc root with the 301 above.
5. **(Tom, cPanel)** Confirm the two addon domains (both seen 2026-09-17) point at the new roots.
6. **(Tom, cPanel)** Set PHP to `ea-php85` on both IF either ever serves `.php` — Option A is pure
   static + `.htaccess` and should need none; confirm before assuming so.
7. **(Whoever edits `.htaccess`)** Test `Options -Indexes` needs `AllowOverride Options` on the new
   hosts before relying on it — this has 500'd a whole suite before on a host lacking the grant.
8. **(AI)** Give the landing page its own sitemap entry if indexed (separate repo → its own
   sitemap, not this suite's `generate_sitemap.php`).
9. **(AI, this repo, later)** Update `dev/positioning.md` §6 once Tom confirms the domains are
   live, matching how `not-epanet.org` was recorded.
10. **(Tom)** Publishes the two new static repos himself, as he does for the siblings. Nothing in
    THIS repo needs pulling for this task — there is no PHP here to deploy.

## 5. Questions only Tom can answer

1. **Option A or Option B1?** Recommend: **A now**; B1 is real `Canonical.lib.php` engineering and
   should be its own task if wanted after seeing A live. [TGH: A for development. Release as B1 for A/B testing.]
2. **Does the landing page need to tell the visitor they are leaving an EPANET++-branded page for a
   LibreWaterNet-branded app?** Recommend: yes, one small line under the call to action ("opens in
   LibreWaterNet, our network editor") — an unexplained brand switch reads as a broken link. [TGH: No. Release as B1 for A/B testing.]
3. **Is the paraphrased "still finding out what EPANET can do" sentence close enough to the
   sanctioned "infinite depth" quote, or does it need his exact wording?** Recommend: use his exact
   wording verbatim — positioning.md calls it "a positioning asset, not a disclaimer," and
   paraphrase risks softening it. [TGH: The assessment is stale. See above.]
4. **Does `epanet-js` get named anywhere on this site**, as `not-epanet.org` named it once as a
   licence credit? Recommend: not on the landing page — a one-screen hand-off, not a gratitude
   page, and the page most resembling its name is the highest-risk place for that credit. [TGH: OK.]
5. **Should the site get its own claims ledger**, like `not-epanet.org`'s `CLAIMS.md`? Recommend:
   yes, built alongside the site in step 3. [TGH: OK. This is essentially identically a mirrored rebrand of LWN with EPANET comparison tweaks because we are more advanced now.]
6. **Timing.** No longer a question: Tasks 715 and 716 closed 2026-09-26 with the feat/report merge.
## 6. Option B1 as built (branch `feat/epanet-plus-plus`)

**The declaration.** `ecCanonicalHostOrigins()` in `lib/Canonical.lib.php` is a whitelist keyed by
page AND serving host: `Looped-Network.php` on `epanet-plus-plus.org` nominates
`https://epanet-plus-plus.org`; on every other host it nominates `https://librewaternet.org` as
before. The host key is `EC_CANONICAL_HOST` (`lib/config.inc.php`), which is the normalised Host
only when `$ec_canonical_origins` already lists it and `''` otherwise, so a spoofed Host can select
one of the declared answers or none. `epanet-plus-plus.org` joins `$ec_canonical_origins` answering
`https://hawsedc.com`, so a calculator reached through that host's `/engcalcs/` symlink stays
hawsedc.com's. All five readers follow it: canonical, 27 hreflang alternates and og:url (via
`ec_canonical_url()`), og:image, and the script-path 301, which on this host goes to
`epanet-plus-plus.org/app/`, never across.

**The brand.** `ecAppBrands()` names each origin the app can nominate (`LibreWaterNet.org`,
`EPANET++`) and its home page; `ecAppBrandName()`/`ecAppSiteUrl()` answer from the SAME
canonical lookup, so name and canonical cannot disagree. Visible on this host: the About box name
and its link, and Help > Welcome page, both go to `https://epanet-plus-plus.org/`. No language
string names the brand, so no placeholder and no new keys were needed. Unchanged on purpose: the
About box's Credits link (still `librewaternet.org/credits.html`, which exists), Help's screenshots
row (`librewaternet.org/screenshots.html`), the `app` marker written into a saved file (still
`https://librewaternet.org/app/`, the format's home), the page `<title>` (names no brand),
`og:site_name` and the install name (both already say HawsEDC Calculators / EngCalcs on every host).

**The sitemap.** `../sitemap.xml` is hawsedc.com's and is unchanged: it lists the map app once, at
`librewaternet.org/app/`. The 27 epanet-plus-plus.org URLs belong in that host's own sitemap, in
the landing-site repository: `php dev/scripts/generate_sitemap.php --host=epanet-plus-plus.org`
prints them.

**Guarded by** `dev/scripts/canonical_host_check.php` (renders the page per Host, including a
spoofed one) and the per-host legs added to `canonical_origin_check.php`.

### Host setup for Tom (cPanel account; docroot `~/addon_html/epanet-plus-plus.org`)

1. **PHP version first.** MultiPHP Manager → set `epanet-plus-plus.org` to **ea-php85**. A new
   domain defaults to ea-php56, on which every page 500s (`??` in `lib/config.inc.php`). cPanel
   writes its handler block into the docroot `.htaccess`; leave that block alone.
2. **The suite symlink**, exactly as librewaternet.org has it (check its target first):
   ```
   readlink ~/addon_html/librewaternet.org/engcalcs
   ln -s "$(readlink ~/addon_html/librewaternet.org/engcalcs)" ~/addon_html/epanet-plus-plus.org/engcalcs
   ```
   It relies on `SymLinksIfOwnerMatch`, so it must be owned by the same account.
3. **The rewrite**, in the docroot `.htaccess` (the landing-site repository owns that file, so it
   goes in there, above cPanel's handler block). Same as librewaternet.org's:
   ```
   RewriteEngine On
   RewriteRule ^app$ /app/ [R=301,L]
   RewriteRule ^app/?$ /engcalcs/Looped-Network.php [L]
   RedirectMatch 404 "/\.(?!well-known/)[^/]+/"
   ```
   **No `Options` line**: `Options -Indexes` needs `AllowOverride Options`, and where it is not
   granted Apache 500s every request under the path. Never add a redirect on
   `/engcalcs/Looped-Network.php` here; that loops (the PHP does it).
4. **Mapbox token**: add `epanet-plus-plus.org` to the token's allowed URLs, or satellite and
   Terrain-RGB return 403 on this host (street tiles and search are unaffected).
5. **Search Console**: add `https://epanet-plus-plus.org` as its own property, and submit the
   sitemap from step "The sitemap" above, served from that host.
6. **Landing page link**: once B1 is live, the landing page's call to action should point at
   `https://epanet-plus-plus.org/app/` (its own host), not `librewaternet.org/app/`.
7. **Verify after pulling** the commit that carries this:
   ```
   curl -sI https://epanet-plus-plus.org/app | grep -i location          # -> /app/
   curl -s  https://epanet-plus-plus.org/app/ | grep -o 'rel="canonical"[^>]*'
   curl -sI https://epanet-plus-plus.org/engcalcs/Looped-Network.php | grep -i location
                                                  # -> https://epanet-plus-plus.org/app/
   ```
