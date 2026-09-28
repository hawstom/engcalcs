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

### Draft hero copy — PROPOSAL for Tom's ruling, not final

**Headline:** EPANET++: scenarios, world map, fire flow, customers, custom properties, and asset libraries, given to the world on the same engine EPA gave the world.

**Lede:** EPANET++ is a free libre open-source water network editor built on the EPANET engine itself,
the same solver the U.S. Environmental Protection Agency wrote and gave away, extended with
scenarios, world map, fire flow, customers, custom properties, and asset libraries you can import across projects. It
is not EPANET, and it is not affiliated with or endorsed by the EPA; it is one of many tools built
on public-domain software EPA released to everyone. [TGH: We (Mary) are doing dilligent research to find any gaps. I don't think it's most honest at this point to imply that we are not or that we don't know EPANET. If needed, let's keep asking Mary to double-check. I say we remove the net sentence.] We are still finding out what EPANET can do
that we cannot, and we say so.

**Call to action:** Open the network editor. (links to `https://librewaternet.org/app/`)

Flags for Tom: the last lede sentence paraphrases the "infinite depth" honesty asset rather than
quoting it verbatim — see Question 3 below. No phone/PC/third-party claims belong on a one-screen
hand-off page, so none appear here.

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
6. **(Tom, cPanel)** Set PHP to `ea-php83` on both IF either ever serves `.php` — Option A is pure
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