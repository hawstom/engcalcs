# Editorial review: LibreWaterNet.org and Not-EPANET.org

**Read as:** a senior editor at a trade periodical, briefed to find anything that would embarrass
the masthead if a reader, a rival, or a reporter went looking. Two questions all the way through:
*is this true and checkable*, and *does this read as though a machine wrote it*.

**Reviewed:** the LIVE bytes, fetched 2026-09-06, not the working tree.
`https://librewaternet.org/{index,features,screenshots}.html`,
`https://not-epanet.org/{index,epanet,claims}.html`. Where the live page and the repository differ,
that difference is itself a finding (EDR-06).

## How to rule on this

Every finding ends with a line beginning `RULE EDR-nn:`. **Search this file for `RULE EDR-` to jump
between them.** Mark each one and nothing else needs writing:

```
RULE EDR-01: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:
```

`fix as amended` and `reject` are more useful to me than a silence; the reason is the part that
stops the same finding coming back next month.

## Verdict in one paragraph

The software is more professional than its shopfront. The app at `hawsedc.com` declares its
character set, its language, its viewport and its title correctly; the marketing site that sells it
does none of those things and is served to every visitor in quirks mode. On truthfulness the two
sites are unusually good, and the claims ledger is a genuinely unusual thing to publish; the
failures are the small checkable ones (EDR-07 to EDR-12), and they matter more than usual precisely
because the sites invite the reader to check. The prose is the weakest part: it is honest, and it
keeps saying so, which is the one rhetorical move that makes a reader doubt it (EDR-13). Six
findings I would hold the page for: EDR-01, EDR-02, EDR-05, EDR-07, EDR-13, EDR-18.

---

# A. Mechanics that a reader sees before a word of copy

## EDR-01 - HIGH - LibreWaterNet.org is served in quirks mode

`index.html`, `features.html` and `screenshots.html` begin at line 1 with `<meta charset="utf-8">`.
There is **no `<!doctype html>`, no `<html>`, no `<head>` and no `<body>` element in any of the
three**, verified in the bytes the server sends. A browser with no doctype renders in quirks mode:
legacy box model in places, legacy line-height and table-font rules, and a standing risk that a
future CSS change behaves differently here than in every test the author ran.

Nothing on the page looks broken today, which is why it has survived. It is still the single most
embarrassing line of a technical review: the water-modelling project's own landing page is not a
valid HTML document.

Fix: `<!doctype html>` and `<html lang="en">` as the first lines, above the charset -- and then keep
the charset within the first 1024 bytes, which is the sibling site's existing rule.

RULE EDR-01: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-02 - HIGH - No viewport meta, on the site that says it works on a phone

None of the three LibreWaterNet pages carries `<meta name="viewport" content="width=device-width,
initial-scale=1">`. The app does (`lib/HeadersFooters.lib.php:58`). A phone therefore lays the
landing page out at a nominal 980 px and shrinks it: 8 pt body text, and the reader pinches to read
the sentence *"And although you of course prefer working on your PC, it works also on a phone in
tall mode."*

That sentence was written to be scrupulously honest. It is currently being read on a page that
demonstrates the opposite. This is one line in each file.

RULE EDR-02: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-03 - MEDIUM - No `lang` attribute, on the page whose subject is 27 languages

There is no `<html lang>` because there is no `<html>` (EDR-01). The index says: *"unlike this
welcome page, which is in English, and which your browser has translated if you are reading it in
another one."* Browser translation, and every screen reader, take the source language from that
attribute. The page asks the browser to do a job and withholds the one input the browser needs.

RULE EDR-03: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-04 - MEDIUM - No meta description, no share card, and two context-free titles

not-epanet.org gets this right on all three pages: a title that stands alone and a written
description. LibreWaterNet.org has neither, anywhere, and its titles are `LibreWaterNet.org`,
`What it does`, and `Annotated Screenshots`. Pasted into Slack, LinkedIn or a mail client, the front
door of the project renders as a bare URL; in a search result, Google writes its own snippet out of
whatever it finds first.

The suite's own `CLAUDE.md` has a rule for exactly this (`$html_desc`, Task 534, `og:description`).
The marketing site never received it.

RULE EDR-04: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-05 - HIGH - Google Fonts, on the site whose pitch is per-feature consent

All three LibreWaterNet pages open with `preconnect` to `fonts.googleapis.com` and
`fonts.gstatic.com` and a stylesheet from Google. A visitor's IP address and user agent reach
Google before they have clicked anything, on the page that says, in bold:

> **We ask you, each time, per feature.** Nothing here reaches anyone else unless you turn on the
> feature that needs it, and each one asks separately.

That sentence is about the app and is true of the app. It is on a page that has already made an
uninvited third-party request. A German court has fined a site operator over precisely this
transfer, so this is not only a rhetorical problem, and the two sentences sit a screen apart.

The sibling site makes the contrast worse and it did so deliberately: *"No external request of any
kind... the sibling site uses Google Fonts; this one cannot."* And the ledger publishes the app's
own boast, verbatim: *"There is no CDN, no hosted font, and no third-party code of any kind."*

Fix: self-host the three families, or drop to a system stack as not-epanet.org did. Either is an
afternoon and removes the only thing on the site a privacy-minded reader can catch it doing.

RULE EDR-05: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-06 - MEDIUM - The two doors are only one door in public

`git` has the `Not EPANET` wordmark beside the LibreWaterNet one, pushed. **The live page does not
have it** -- the host has not pulled. So today not-epanet.org links to LibreWaterNet three times and
LibreWaterNet acknowledges not-epanet.org nowhere, which is the reverse of the safer asymmetry: the
disclaimer site is the one carrying the traffic and getting no confirmation back that the projects
are the same people.

Deploy, or (if the pairing is not yet meant to be public) note that the commit is queued and the
sequencing was intended.

RULE EDR-06: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

---

# B. Claims that do not survive a check

These matter more here than they would elsewhere. Both sites tell the reader to check them.

## EDR-07 - HIGH - "It publishes a map you can hand to somebody." It does not.

LibreWaterNet index, twice: *"It solves, it draws, and it publishes a map you can hand to
somebody"* (line 461), under a section headed **Publish** (line 476). There is no map export, no
image save, and no print of the drawing in the app's File menu -- `lpn_file_*` covers new, open,
save, save as, close, revert, import `.inp`, import geo, export `.inp`, and nothing else. The one
print path in `js/looped-network.js` prints a *table*.

The sibling site has already ruled on this exact claim and corrected it: ledger row 9.1, *"the page
said 'publish the drawing', and there is no publish, share, or image export"*. The correction was
made on the smaller site and never carried to the flagship. A reader who takes the invitation --
draw a network, then try to hand somebody the map -- finds a screenshot key.

Fix: say what is true. The labels, leader lines and haloed lettering are real and are the point;
what the reader takes away is the browser's own print or a screen capture. Either say that, or ship
an export and then say it.

RULE EDR-07: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-08 - MEDIUM - "twelve more, annotated" is eleven more

Index caption, line 416. The index shows plates `0007`, `0026`, `0028`. The screenshots page carries
fourteen plates and those three are among them. Twelve is off by one, and it is off in the
flattering direction, on a site that has made an editorial virtue of never doing that.

RULE EDR-08: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-09 - MEDIUM - "41 Brewer ramps" is wrong, on the page built for checking

`CLAIMS.md:38` (row 2.11b, published on claims.html): *"41 Brewer ramps plus
viridis/magma/inferno/plasma (CC0, BIDS) plus EPANET's rainbow plus Gray"*. Counted in
`js/lpn-ramps.js`: 35 Brewer schemes (18 sequential, 9 diverging, 8 qualitative), plus the four
CC0 ramps, plus `epanet`, plus `gray` -- **41 in total**, which is the number LibreWaterNet quotes
twice as "41 colour ramps". The ledger has taken the total and reattributed all of it to Cynthia
Brewer, in the row that credits her.

Two sites, two numbers, and the one whose whole purpose is verifiability holds the wrong one.

RULE EDR-09: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-10 - MEDIUM - Backslashes visible on the published ledger

claims.html, row 4.13, as served: `the page previously said \"all of them are vendored\" over a
list...`. The escapes are in `CLAIMS.md:70` and the generator passes them straight through. Small,
but it is on the page that argues nothing here drifts, and it is the kind of thing a reader notices
first because it looks like machine output that nobody read.

RULE EDR-10: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-11 - MEDIUM - The ledger cites a folder on one laptop

claims.html tells the reader: *"This is where you check them"*, then defines its citation key as
*"`EC` means the EngCalcs repository at `~/webdev/hawsedc.subset/engcalcs`"* and cites file paths
inside it forty-odd times. Nobody outside that machine can open any of them.

The repository is public -- `github.com/hawstom/engcalcs` returns 200 -- and not-epanet.org links to
it from nowhere. This is the one finding where the fix is a strict upgrade with no wording cost:
define `EC` as the GitHub URL and let every path in the table become a link a stranger can follow.
Until then the ledger asks to be taken on trust, which is the specific thing it exists not to do.

RULE EDR-11: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-12 - LOW - "the EPANET 2.3 engine" against 2.3.5 everywhere else

`features.html:281`. The ledger, the vendor README and the run report all say 2.3.5 (printed
2.3.05). Version numbers are the one place an engineering audience checks you for sport.

RULE EDR-12: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

---

# C. The prose: where it reads as machine-written

## EDR-13 - HIGH - The site keeps telling the reader it is honest

Headings: **Deep honesty**, **Deep gratitude**, *"What we are, said without decoration"*. Then, in
the body: *"None of them is flattering, and that is the point of putting them on the front page
rather than in a footnote"*; *"we would rather list all three than have you work one of them out for
yourself"*; *"We are not going to pretend otherwise"*; *"We are not going to dress it up"*; *"None
of that is a complaint and none of it is modesty"*. And across the road: *"Being honest about the
edges"*, *"The list is honest rather than complete"*, *"The honest test is your own network"*.

Every one of those sentences is true. Together they are the problem. An honest page is honest in
its declarative sentences; a page that narrates its own candour invites the reader to look for the
part that is being managed, and one of the two sites is at that moment quietly loading Google Fonts
(EDR-05) and telling them it publishes maps (EDR-07). The material underneath -- the dependency
list, the licence admission, the AI paragraph -- is genuinely unusual and needs no framing.

Fix, and it is subtractive: cut *Deep* from both headings (**Honesty** and **Gratitude** are
stronger and the nav already says so). Delete the sentences that comment on the sections rather than
belonging to them. Keep every fact. The page gets shorter and reads as though a person with nothing
to prove wrote it.

RULE EDR-13: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-14 - MEDIUM - Honesty item 3 is a heading with nothing under it

> **3. We are new, with all that implies**
> We are not going to dress it up.

That is the whole item, apart from a quotation that follows. The section promised *"Five things a
reasonable person would want to know"*; four of them deliver specifics and this one delivers a
posture. Either say what new means here -- how long, how many networks it has been run on, what has
already been found wrong and fixed -- or fold the quotation into item 5 and have four items.

RULE EDR-14: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-15 - MEDIUM - The tics, counted

The cadence is consistent across both sites and both are the same voice, which is the tell:

- **Negation as rhythm.** `epanet.html`: 34 negative constructions in 872 words, about one every
  26 words. *"It is not free because somebody decided to be generous with a price."* *"That is not
  a loophole; it is the deliberate design of the public domain."* *"Describing it as the most
  widely used model of its kind is not marketing language; it is simply where the field ended
  up."* Three "not X; it is Y" pivots on one short page.
- **The fragment stack.** *"Not just inspired by it. Not just compatible with it. Dependent on
  it."* *"Scenarios. Saved profile paths."*
- **"rather than"**: ten times on the not-epanet front page alone, four more on the LibreWaterNet
  index.
- **The reassurance coda**: *"and that is the point"*, *"which is worth spelling out"*, *"worth
  naming it as a gift rather than as a background condition"*.

None is wrong. All of them together are the reason a reader with any exposure to generated copy
will place this within a paragraph, which on a site about honesty costs more than it would
anywhere else. Practical remedy: one pass per page with a quota -- at most two "rather than", at
most one "not X; it is Y", no fragment stacks -- and read it aloud.

RULE EDR-15: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-16 - MEDIUM - The em dash rule stops at the property line

not-epanet.org: **0** em dashes in visitor-facing text, deliberately. LibreWaterNet.org: **28** --
3 on index, 7 on features, 18 on screenshots. The suite's own ratchet exists because the dash reads
as machine-written whatever it says, and the newer site knows the rule while the older, larger,
more-visited one has never heard of it.

This does not need a sweep. It needs the same ratchet: the number may fall and may not rise, and
the screenshots page, at 18 in 1,300 words, is where a rewrite would actually pay.

RULE EDR-16: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-17 - LOW - Three spellings against the house standard

Oxford style was adopted 2026-09-06 and takes `-ize`. Live: *"search-engine optimisation"*
(not-epanet index, line 62), *"characterisation"* and *"pressurised"* (ledger, epanet page). Also
mixed apostrophes on LibreWaterNet: curly in *"Stallman's"* and *"page's"*, straight elsewhere on
the same three pages.

RULE EDR-17: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-23 - MEDIUM - One sentence on the index that cannot be read

> Being honest about the edges: development has followed an informal path of assumed most critical
> features, and there are a lot of unknown gaps between this application and EPANET.

"an informal path of assumed most critical features" is not English. The features page says the same
thing well: *"We know what we built and we know some of what we lack; we do not know the size of the
gap."* Use that.

RULE EDR-23: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

---

# D. Judgement calls I would put to the editor, not fix myself

## EDR-18 - HIGH - The gratitude page will not name the library it is grateful to

The engine wrapper is credited as *"The browser build of the EPANET engine. MIT licensed, (c) Luke
Butler"* and is called *"the single piece of code that makes an EPANET run possible inside a web
page"* and *"the reason this project could be built by one semi-retired engineer rather than by a
team."* Its name is not printed. The published ledger, section 7, explains why: a standing ban on
naming competing products, and *"a differently-named web application by other people is easily
confused with it."*

Two problems, and the second is the serious one.

1. The ledger already concedes the first: *"thanking a piece of software without saying its name is
   thin thanks."* It is. It is the only entry on the page where the reader cannot go and look.
2. **The stated reason is competitive, and it is published.** A page whose argument is deep
   gratitude and deep honesty says, in its own appendix, that it withholds a benefactor's name
   because a rival has a similar one. That is the paragraph I would quote if I were writing about
   this site unkindly, and it would be a fair quote.

My recommendation is to name it. The ban exists to keep a competitor out of a title, a tagline, a
menu or a headline; a licence credit in a thanks list is none of those, and the confusion the ledger
worries about is *created* by the silence rather than avoided by it. If the ban stands, then the
honest move is the opposite one: drop section 7's explanation rather than publish a commercial
reason on a gratitude page.

RULE EDR-18: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-19 - LOW - "It worked on you if you arrived here from a search"

The SEO disclosure is the best passage on either site and I would not touch the substance. That one
clause needles the reader about a thing they did not do wrong, and it is a guess about how they got
here. *"That is search-engine optimisation, and it matters to us. We are not going to pretend
otherwise"* keeps everything and loses the poke.

RULE EDR-19: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-20 - LOW - "Public domain by operation of law" is a US statement

17 U.S.C. 105 denies copyright to US government works *in the United States*; the government can and
sometimes does hold rights abroad, and other jurisdictions do not automatically follow. The site
places the claim next to *"A working engineer anywhere on earth, in a country that pays no American
taxes, can model a water system tonight"*, which is the sentence a lawyer would circle. In practice
EPA distributes EPANET to the world and nobody is chasing anybody, so the fix is one clause -- "in
the United States" -- not a rewrite.

RULE EDR-20: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-21 - LOW - The public repositories publish more than the sites do

`github.com/hawstom/not-epanet.org` is public and its README names a board member -- **Mary Cabais,
P.E., in the Philippines** -- quotes your private brief, and narrates four corrections you made by
name. None of that appears on the site, which is right. But the README is a page on the open web
too, and naming a living person and her country in it is a decision that belongs to her as much as
to you. Worth one email.

RULE EDR-21: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-22 - LOW - Refusing the 2.2 date is scruple that reads as fussiness

`epanet.html` declines to date EPANET 2.2 because *"two dates in the public record disagree"*. The
two are Wikipedia (23 July 2020) and a comment in your own vendor README (December 2019). That is
not two public records disagreeing; it is one public record and one internal note. EPA's own release
material settles it. Publishing the refusal invites the reader to think the disagreement is deeper
than it is, and the section title -- *"What we could not verify"* -- is doing real work elsewhere on
this page and should be spent on things that genuinely resist checking.

RULE EDR-22: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

---

# What is right, and should not be touched while fixing the above

Stated so a later pass does not "improve" it:

- The disclaimer's position and repetition. It leads on both pages and is repeated at the top of
  `epanet.html` because a page reached from a search carries its own denial. That is correct and
  unusual.
- The dependency list. Seven specific, checkable ways, each traceable. Nobody in this field
  publishes that.
- The refusal to call EPANET's interface dated, and the sentence that follows it.
- The licence admission -- *"less free than EPANET; less trusting than EPANET"* -- in your own
  words, with the invitation to argue left in.
- The claims ledger existing at all, and sections 6, 7 and 8 in particular.
- *"a phone in tall mode"*, and the indefinite article in it.
- LibreWaterNet's stakeholder section: four named kinds of person, no donation button, and
  *"A wish list is a specification."* That is the best line on either site.
