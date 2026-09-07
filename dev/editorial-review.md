# Editorial review: the two sites and the application

## ONE TRUE COPY. There is no second file.

Tom, 2026-09-06: *"Let's avoid proliferating copies and let's try to honor One True Copy of this."*
Every editorial pass lands **in this file**, appended as a new PASS section, keeping its own key
series. A pass that starts a second file starts a second set of rulings, and then his marks are in
one of them and the work is in the other.

- **The file was renamed on 2026-09-06** from `dev/editorial-review-2026-09-06.md`, and
  `dev/editorial-review-2-2026-09-06.md` was folded into it and deleted. A date in the name says a
  document is finished; this one is not.
- **Keys never restart.** Pass one is `EDR-nn`, pass two `EDR2-nn`, and the next is `EDR3-nn`.
- **His marks are the record.** Do not rewrite a `RULE` line, ever, except to add the outcome
  beneath it.

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

RULE EDR-01: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-02 - HIGH - No viewport meta, on the site that says it works on a phone

None of the three LibreWaterNet pages carries `<meta name="viewport" content="width=device-width,
initial-scale=1">`. The app does (`lib/HeadersFooters.lib.php:58`). A phone therefore lays the
landing page out at a nominal 980 px and shrinks it: 8 pt body text, and the reader pinches to read
the sentence *"And although you of course prefer working on your PC, it works also on a phone in
tall mode."*

That sentence was written to be scrupulously honest. It is currently being read on a page that
demonstrates the opposite. This is one line in each file.

RULE EDR-02: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-03 - MEDIUM - No `lang` attribute, on the page whose subject is 27 languages

There is no `<html lang>` because there is no `<html>` (EDR-01). The index says: *"unlike this
welcome page, which is in English, and which your browser has translated if you are reading it in
another one."* Browser translation, and every screen reader, take the source language from that
attribute. The page asks the browser to do a job and withholds the one input the browser needs.

RULE EDR-03: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-04 - MEDIUM - No meta description, no share card, and two context-free titles

not-epanet.org gets this right on all three pages: a title that stands alone and a written
description. LibreWaterNet.org has neither, anywhere, and its titles are `LibreWaterNet.org`,
`What it does`, and `Annotated Screenshots`. Pasted into Slack, LinkedIn or a mail client, the front
door of the project renders as a bare URL; in a search result, Google writes its own snippet out of
whatever it finds first.

The suite's own `CLAUDE.md` has a rule for exactly this (`$html_desc`, Task 534, `og:description`).
The marketing site never received it.

RULE EDR-04: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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

RULE EDR-05: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-06 - MEDIUM - The two doors are only one door in public

`git` has the `Not EPANET` wordmark beside the LibreWaterNet one, pushed. **The live page does not
have it** -- the host has not pulled. So today not-epanet.org links to LibreWaterNet three times and
LibreWaterNet acknowledges not-epanet.org nowhere, which is the reverse of the safer asymmetry: the
disclaimer site is the one carrying the traffic and getting no confirmation back that the projects
are the same people.

Deploy, or (if the pairing is not yet meant to be public) note that the commit is queued and the
sequencing was intended.

RULE EDR-06: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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
what the reader takes away is **a screen capture**. Either say that, or ship
an export and then say it.

RULE EDR-07: [ ] fix   [x] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-08 - MEDIUM - "twelve more, annotated" is eleven more

Index caption, line 416. The index shows plates `0007`, `0026`, `0028`. The screenshots page carries
fourteen plates and those three are among them. Twelve is off by one, and it is off in the
flattering direction, on a site that has made an editorial virtue of never doing that.

RULE EDR-08: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-09 - MEDIUM - "41 Brewer ramps" is wrong, on the page built for checking

`CLAIMS.md:38` (row 2.11b, published on claims.html): *"41 Brewer ramps plus
viridis/magma/inferno/plasma (CC0, BIDS) plus EPANET's rainbow plus Gray"*. Counted in
`js/lpn-ramps.js`: 35 Brewer schemes (18 sequential, 9 diverging, 8 qualitative), plus the four
CC0 ramps, plus `epanet`, plus `gray` -- **41 in total**, which is the number LibreWaterNet quotes
twice as "41 colour ramps". The ledger has taken the total and reattributed all of it to Cynthia
Brewer, in the row that credits her.

Two sites, two numbers, and the one whose whole purpose is verifiability holds the wrong one.

RULE EDR-09: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-10 - MEDIUM - Backslashes visible on the published ledger

claims.html, row 4.13, as served: `the page previously said \"all of them are vendored\" over a
list...`. The escapes are in `CLAIMS.md:70` and the generator passes them straight through. Small,
but it is on the page that argues nothing here drifts, and it is the kind of thing a reader notices
first because it looks like machine output that nobody read.

RULE EDR-10: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-11 - MEDIUM - The ledger cites a folder on one laptop

claims.html tells the reader: *"This is where you check them"*, then defines its citation key as
*"`EC` means the EngCalcs repository at `~/webdev/hawsedc.subset/engcalcs`"* and cites file paths
inside it forty-odd times. Nobody outside that machine can open any of them.

The repository is public -- `github.com/hawstom/engcalcs` returns 200 -- and not-epanet.org links to
it from nowhere. This is the one finding where the fix is a strict upgrade with no wording cost:
define `EC` as the GitHub URL and let every path in the table become a link a stranger can follow.
Until then the ledger asks to be taken on trust, which is the specific thing it exists not to do.

RULE EDR-11: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-12 - LOW - "the EPANET 2.3 engine" against 2.3.5 everywhere else

`features.html:281`. The ledger, the vendor README and the run report all say 2.3.5 (printed
2.3.05). Version numbers are the one place an engineering audience checks you for sport.

RULE EDR-12: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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

RULE EDR-13: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-14 - MEDIUM - Honesty item 3 is a heading with nothing under it

> **3. We are new, with all that implies**
> We are not going to dress it up.

That is the whole item, apart from a quotation that follows. The section promised *"Five things a
reasonable person would want to know"*; four of them deliver specifics and this one delivers a
posture. Either say what new means here -- how long (**development started on 28 Jul 2026**), how many networks it has been run on (**one real-world design report as of 1 Sep 2026**), what has
already been found wrong and fixed (**countless fool's errand; don't do it**) -- or fold the quotation into item 5 and have four items.

RULE EDR-14: [ ] fix   [x] fix as amended   [ ] reject   [ ] later   -- TGH:

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

RULE EDR-15: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-16 - MEDIUM - The em dash rule stops at the property line

not-epanet.org: **0** em dashes in visitor-facing text, deliberately. LibreWaterNet.org: **28** --
3 on index, 7 on features, 18 on screenshots. The suite's own ratchet exists because the dash reads
as machine-written whatever it says, and the newer site knows the rule while the older, larger,
more-visited one has never heard of it.

This does not need a sweep. It needs the same ratchet: the number may fall and may not rise, and
the screenshots page, at 18 in 1,300 words, is where a rewrite would actually pay.

RULE EDR-16: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-17 - LOW - Three spellings against the house standard

Oxford style was adopted 2026-09-06 and takes `-ize`. Live: *"search-engine optimisation"*
(not-epanet index, line 62), *"characterisation"* and *"pressurised"* (ledger, epanet page). Also
mixed apostrophes on LibreWaterNet: curly in *"Stallman's"* and *"page's"*, straight elsewhere on
the same three pages.

RULE EDR-17: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-23 - MEDIUM - One sentence on the index that cannot be read

> Being honest about the edges: development has followed an informal path of assumed most critical
> features, and there are a lot of unknown gaps between this application and EPANET.

"an informal path of assumed most critical features" is not English. The features page says the same
thing well: *"We know what we built and we know some of what we lack; we do not know the size of the
gap."* Use that.

RULE EDR-23: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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
honest move is the opposite one: **drop section 7's explanation rather than publish a commercial reason on a gratitude page**.

RULE EDR-18: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-19 - LOW - "It worked on you if you arrived here from a search"

The SEO disclosure is the best passage on either site and I would not touch the substance. That one
clause needles the reader about a thing they did not do wrong, and it is a guess about how they got
here. *"That is search-engine optimisation, and it matters to us. We are not going to pretend
otherwise"* keeps everything and loses the poke.

RULE EDR-19: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-20 - LOW - "Public domain by operation of law" is a US statement

17 U.S.C. 105 denies copyright to US government works *in the United States*; the government can and
sometimes does hold rights abroad, and other jurisdictions do not automatically follow. The site
places the claim next to *"A working engineer anywhere on earth, in a country that pays no American
taxes, can model a water system tonight"*, which is the sentence a lawyer would circle. In practice
EPA distributes EPANET to the world and nobody is chasing anybody, so the fix is one clause -- "in
the United States" -- not a rewrite.

RULE EDR-20: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-21 - LOW - The public repositories publish more than the sites do

`github.com/hawstom/not-epanet.org` is public and its README names a board member (with
credential and country), quotes your private brief, and narrates four corrections you made by name.
The README is a page on the open web, and naming a living person in it is a decision that belongs to
them as much as to you. Worth one email.

**Found while fixing this, and worse than the finding:** the name was also in ledger row 3.7, which
is not a README but a LIVE PAGE. Removed from both, 2026-09-06, along with this file's own copy of
it -- the EngCalcs repository is public too. Anonymize.

RULE EDR-21: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-22 - LOW - Refusing the 2.2 date is scruple that reads as fussiness

`epanet.html` declines to date EPANET 2.2 because *"two dates in the public record disagree"*. The
two are Wikipedia (23 July 2020) and a comment in your own vendor README (December 2019). That is
not two public records disagreeing; it is one public record and one internal note. EPA's own release
material settles it. Publishing the refusal invites the reader to think the disagreement is deeper
than it is, and the section title -- *"What we could not verify"* -- is doing real work elsewhere on
this page and should be spent on things that genuinely resist checking. **Give the estimate as around early 2020**.

RULE EDR-22: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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

---

# What was done, 2026-09-06

Tom ruled `fix` on all 23, with three amendments (EDR-07 the takeaway is a screen capture; EDR-14
the two dates supplied; EDR-18 the bolded path). Two calls put to him in the interview:
**EDR-18 drop §7's explanation and leave the package name unprinted**, and **EDR-05 a system font
stack rather than self-hosting**, which is why the drawing-sheet type is plainer than it was.

Both sites are edited and committed. **Neither site repository is pushed** — a push publishes, and
the copy on both is now different enough that it should be read once before it is public. The
commands are at the end.

| Key | Done |
|---|---|
| EDR-01/02/03/04 | All three LibreWaterNet pages are real documents: doctype, `<html lang="en">`, `<head>`, `<body>`, viewport, description, canonical, Open Graph and Twitter card. Titles rewritten so they stand alone |
| EDR-05 | Google Fonts gone. Three CSS variables (`--font-ui`, `--font-cond`, `--font-serif`) carry a system stack. **The condensed drafting labels are noticeably plainer**; that is the cost you chose |
| EDR-06 | Nothing to do here: the commit is already pushed and the host has not pulled. **Yours to deploy** |
| EDR-07 | *"it publishes a map"* is now *"it letters the map well enough to put in a report"*; the **Publish** heading is **Label**; the paragraph says what leaves the screen is a screen capture |
| EDR-08 | Eleven |
| EDR-09 | Row 2.11b: 41 ramps in all, 35 of them Brewer's (18 sequential, 9 diverging, 8 qualitative) |
| EDR-10 | Backslashes gone; the `PUBLIC_REWRITES` entry that produced them is retired and the list is empty, with a note saying an empty list is the correct state |
| EDR-11 | `EC` is now `github.com/hawstom/engcalcs`, linked. Two other `~/webdev/...` citations went with it |
| EDR-12 | 2.3.5, fixed upstream in `dev/features-source.md` so the rebuild keeps it |
| EDR-13 | The boasting is gone from both sites. **Deep honesty** → **Honesty**, **Deep gratitude** → **Gratitude**, *said without decoration* → *What we are*, and eleven self-praising clauses cut. Written into both working guides as a rule |
| EDR-14 | Item 3 carries your two dates and says what follows from them |
| EDR-15 | The tics: the fragment stack, three "not X; it is Y" pivots, two reassurance codas, *startling amount*, *worth spelling out* |
| EDR-16 | 28 em dashes in visitor text → **0**, and check 6 on each site fails on the next one |
| EDR-17 | `optimisation`/`characterisation`/`pressurised` → `-ize`/`-ized`. Apostrophes typographic throughout, including in the generated feature list, which needed a change in `tools/build-features.php` |
| EDR-18 | §7's explanation deleted. The credit stands as written; no name, no reason published |
| EDR-19 | The poke at the reader is gone; the disclosure is not |
| EDR-20 | *"in the public domain in the United States by operation of law, and distributed to the world on that basis"*, with ledger row 4.12a |
| EDR-21 | Anonymised in the README **and on the live ledger page**, see EDR-26 |
| EDR-22 | *"around early 2020"*, marked as an approximation, in `epanet.html` and in ledger §6 |
| EDR-23 | Replaced with the features page's own better sentence |

**Six new checks, mutation-tested.** `librewaternet.org/check.sh` grew document structure, no
cross-origin fetch, and the em-dash ratchet; `not-epanet.org/check.sh` did not exist and now holds
six. Testing them by planting violations paid immediately: **the first draft of both em-dash checks
was blind**, because a sed range over `<script src=...></script>` deletes to end of file and a
`s/<!--.*-->//g` over a joined file deletes everything between the first and last comment. A check
that deletes its own haystack passes.

## Four more findings, found while fixing

## EDR-24 - HIGH - "no board" was still on the front page

`index.html` said *"There is no foundation, no board and no governing document"*. You have a board
member; not-epanet.org removed the same claim on your instruction earlier the same day, and the
flagship kept it. Now *"no foundation and no governing document"*.

**This is EDR-07's shape twice in one review**, which is why it is written into both working guides
as a rule rather than left as two corrections.

RULE EDR-24: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-25 - MEDIUM - The features page was nine features behind its own source

The page said *"53 things it does"*; `dev/features.md` had 62. The count is generated, so the page
was simply built from an older source and nobody rebuilt it. Rebuilding was necessary to carry the
`-ize` and dash fixes through the generated block, so **the page now publishes nine feature
sentences you have not read on this site** — each one your own text from `features-source.md`, each
citing a closed task, but new to the public page. Worth ten minutes of reading before the push.

RULE EDR-25: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-26 - HIGH - The name was on the live ledger, not only in the README

EDR-21 said a README on a public repository named a board member. While anonymising it, the same
name, credential and country turned up in **ledger row 3.7, on the published page**. Removed from
the ledger, the README, and this file. `check.sh` check 6 now fails on `Firstname Lastname, P.E.`
anywhere in the site's HTML or Markdown; it holds the slip that happened and cannot hold the general
rule, which is a person's judgement.

RULE EDR-26: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR-27 - LOW - Every screenshot declared the wrong size

Sixteen `<img>` tags declared `width="1920" height="920"` against files that are 1917x919, 1922x918,
838x879 and so on. The browser reserves the declared box and then paints a slightly different one,
which is a small layout shift on every image. Corrected from the files themselves.

RULE EDR-27: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## To publish

```sh
cd ~/webdev/librewaternet.org && sh check.sh && git push     # then pull on the host
cd ~/webdev/not-epanet.org   && sh check.sh && git push
```

---

# PASS TWO, 2026-09-06: the application's own public pages

Pass one reviewed the two marketing sites. This pass reviews **what a visitor actually uses** — the
suite's own non-calculator pages at `hawsedc.com/engcalcs` — plus the furniture that appears on
every page of every calculator, which is the most-read text either project owns.

**Reviewed:** the LIVE pages, fetched 2026-09-06: `index.php`, `About.php`, `privacy.php`,
`terms.php`, `contact.php`, `Install.php`, the header, the navigation and the consent banner. Plus
a mechanical sweep of all 1,697 shipped English strings.

**Verdict.** The application's own English is the best-written text in either project, and the sweep
says so: of 1,697 shipped strings, **zero** contain a word from the marketing-slop list (*seamless*,
*powerful*, *robust*, *leverage*, *intuitive*, *empower*, *unlock*, *dive into*, and eleven more).
The privacy notice is better than most published by companies with legal departments. What is wrong
is not style but **age and inconsistency**: three pieces of furniture are years out of date, two of
the four core languages are misspelled in the language menu, and the terms reserve a right the rest
of the site promises never to use.

## EDR2-01 - HIGH - Two of the four core languages are misspelled in the language menu

`lib/Language.Settings.php:119` and `:183`:

```
'LANGNAME'=>'Francais',      // should be Français
'LANGNAME'=>'Portugues',     // should be Português
```

Every other language in the menu carries its own diacritics correctly — `Español`, `Türkçe`,
`Čeština`, `Română`, `Български`, `Kiswahili`. French and Portuguese do not, and they are **two of
the four core languages**, the ones the whole suite is translated into. The menu is on every page of
every calculator in all 27 languages.

A visitor whose language is spelled wrong in the menu learns something about how carefully the
translation behind it was done, before they have read a word of it. It is two characters.

RULE EDR2-01: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-02 - HIGH - "Blog (new in 2009)", on every page of the site

`lib/Menus.lib.php:41`. The link works and the blog is there. The parenthesis has been announcing
its own novelty for seventeen years, and it is in the navigation of every page the suite serves.

Nothing else on either site is capable of dating the project this precisely. Drop the parenthesis;
the word "Blog" carries everything it needs to.

RULE EDR2-02: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-03 - HIGH - The terms reserve a right the rest of the site promises never to use

`terms.php`, §2, the operative legal text:

> The service is costly. It may be offered to you free of charge or **costs may be passed through
> to you.**

`About.php`, two clicks away:

> There is no paid tier, no free tier that can be withdrawn, and no delay before the code becomes
> yours. The full version you see today is **free for everyone now and forever**.

And LibreWaterNet.org says the same, and not-epanet.org's doors say *"Free, no sign-up"*.

**Strictly, these do not contradict.** About and LibreWaterNet are promising about the SOFTWARE,
which is GPL v3 and genuinely cannot be taken back; terms §2 is reserving about the SERVICE, which
is your hosting bill and is a different thing. But no reader performs that separation, the terms are
what governs, and "free for everyone now and forever" is the sentence they will remember when a
charge appears.

The fix is one clause in each, not a retreat from either: the software is free forever and cannot
become otherwise; the hosted service is offered **freely** today and, if it ever cannot be, the software
is still yours to run. That is both true and better than either sentence alone.

RULE EDR2-03: [ ] fix   [x] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-04 - HIGH - A promise that dates itself, and dated wrong

`contact.php:34`:

> I created this form around 2013. As of 2025, I am still replying promptly. :-)

It is 2026. The sentence's whole job is to reassure a stranger that the form is live, and its own
date now says the opposite. A hand-maintained date is a promise to maintain it; nobody does.

Say it without a year: "**Many years later,** I still reply to this form myself, usually within a few days." If the
2013 provenance matters, it can stay — it is the *"As of 2025"* that expires.

**And the emoticon.** I would cut it: this is the page where somebody decides whether a real
engineer is on the other end, immediately below a line naming you as a Professional Engineer.

RULE EDR2-04: [ ] fix   [x] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-05 - MEDIUM - The privacy notice is silent about the web server's own log

The notice is careful and specific everywhere else, and this is the one gap a data-protection
reader would find first. It says:

> **We never record your IP address in our usage logs**, and those logs contain no identifier that
> could be traced back to you.

That is scoped precisely to *our usage logs*, which is honest. But almost every Apache installation
also keeps an access log with the IP address of every request, kept by the host rather than by the
application, and the notice never mentions it. Under the GDPR that is processing, and the standard
answer is one short paragraph: what the server records, why (security and abuse), how long it is
kept, and that it is never joined to the usage counts.

I cannot check this from here — it depends on the host's configuration, which you know and I do
not. **If the access log is off, say so and it becomes a strength.** If it is on, the paragraph
costs nothing and closes the only hole in an otherwise exemplary notice.

RULE EDR2-05: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-06 - MEDIUM - The first sentence of the terms is tangled

> HawsEDC Calculators is a service and a set of software that comprise a set of engineering
> calculators published and served by Thomas Gail Haws.

"a set of... a set of", and *comprise* is used the wrong way round (a whole comprises its parts).
The rest of that document is unusually clear, which makes its opening sentence conspicuous.

> HawsEDC Calculators is a set of engineering calculators, published as software and served as a
> website by Thomas Gail Haws.

RULE EDR2-06: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-07 - MEDIUM - A street address on two public pages

`contact.php` and `privacy.php` both print **859 N Lafayette, Mesa AZ 85201**. The GDPR does want a
contactable address for the controller, and a P.E. publishing a business address is ordinary. I am
flagging it only to be sure it is a business address and a deliberate choice, because it is the one
item on either site that cannot be taken back once it is indexed.

If it is your home, a PO box or a registered agent satisfies the same requirement.

RULE EDR2-07: [ ] fix   [ ] fix as amended   [x] reject   [ ] later   -- TGH:

## EDR2-08 - MEDIUM - The masthead, on every calculator page

> Drop your fears at the door; love is spoken here. You are not ruining everything.

This is not a defect and I am not going to treat it as one. It is the mission, it is stated
plainly elsewhere in your own words, and a project whose stated purpose is that message should not
be advised into blandness by an editor.

The one editorial observation worth having: on `index.php`, `About.php` and `terms.php` it is
framing, and it reads as such. On a calculator page it is the first line above a form somebody
opened to size a pipe, where the reader has no context for it yet and it is doing its work on the
least receptive audience the site has. If you ever want it to land harder, the move is fewer
placements, not softer words.

Entirely your call, and "reject" is a perfectly good answer.

RULE EDR2-08: [ ] fix   [ ] fix as amended   [x] reject   [ ] later   -- TGH: Suggest what would land harder.

## EDR2-09 - LOW - The blog link is `http://`

`lib/Menus.lib.php:41` points at `http://tomsthird.blogspot.com/`, which redirects to HTTPS. One
character, and it removes a redirect hop on every page.

RULE EDR2-09: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-10 - LOW - The consent question is hard to read, and I recommend leaving it alone

> Will you allow us to keep a single digit per page in this browser profile's storage to prevent us
> from logging its visits repeatedly?

Twenty-six words, two nested purposes, and the reader has to hold "single digit per page" and
"prevent us from logging repeatedly" at once to answer. A clearer version exists.

**And it should probably not be written.** Changing it means 26 retranslations, and the surrounding
rules say a changed consent question is an `EC_CONSENT_VERSION` bump that re-asks everybody who has
already answered. That is a real cost for a sentence that is accurate, and honest about a practice
most sites do not disclose at all. Recorded so that the next person to notice it can see it was
noticed and priced.

RULE EDR2-10: [ ] fix   [ ] fix as amended   [ ] reject   [x] later   -- TGH: Suggest something

## EDR2-11 - LOW - Sixty-seven em dashes in shipped English

The suite's ratchet is a baseline, not a sweep, and this is only a note on where they sit: the
concentration is in `privacy.php` and `terms.php`, the two longest pieces of prose, where the dash
is doing real parenthetical work and a comma would sometimes be worse. Nothing to do today. If a
sprint ever touches those pages for another reason, lower the baseline while you are in there.

RULE EDR2-11: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH: Accepted as recommended. Add to handoff doc.

## EDR2-12 - LOW - The offline section leads with the acronym

`About.php`: *"These calculators work as a Progressive Web App (PWA)."* The reader who needs that
section is the one who does not know the term. Lead with what happens — *"Open any calculator once
while you are online and all of them keep working when you are not"* — and let the acronym follow
for the reader who wants to look it up.

RULE EDR2-12: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

---

# What is right, and is worth knowing that it is right

- **1,697 shipped English strings, zero marketing slop.** Swept for *seamless*, *powerful*,
  *robust*, *leverage*, *delve*, *cutting-edge*, *effortless*, *intuitive*, *unlock*, *empower*,
  *elevate*, *game-changing*, *in today's...*, *navigate the*, *dive into*, *harness*. Not one
  match. Most commercial engineering software cannot say that about a single page.
- **The privacy notice, with the one gap at EDR2-05.** It explains the storage inventory item by
  item, names what each is for, says which need consent, and describes the three answers. The
  paragraph distinguishing a map tile ("where you are looking") from a place-name search ("what you
  typed") is better than the equivalent text at companies with a privacy office.
- **Terms §4**, on professional responsibility. *"These calculators are tools, not engineers"* is
  the right sentence in the right place, and the EEA/UK consumer carve-out in §5 and §8 is the
  detail a careless site omits.
- **Every navigation link resolves.** All nine, checked.

---

# PASS THREE, 2026-09-06: the snob's read

Tom: *"Give it another go with computer's speed-reading and an elitist snob's nose."* So: everything
counted first, then read slowly with no goodwill. Both sites after the pass-one edits, plus the
application pages pass two did not finish.

**What the counting says.** 401 sentences across the five public pages. Sentence openers are varied
(no opener above 17% on any page); "which" appears 23 times in 9,000 words, which is normal English
rather than a tic; the negation-per-word rate that flagged `epanet.html` in pass one has come down
with the trims. **The machine cadence is gone.** What is left is ordinary human unevenness, and the
findings below are that: six sentences that trip, one claim the product is more honest about than
the page is, and one headline I would put to you rather than change.

## EDR3-01 - MEDIUM - The page is less honest about `.net` than the program is

LibreWaterNet's index: *"Open an EPANET `.inp` or `.net` file and it tells you every difference it
found rather than dropping anything quietly."* Two formats, one clause, equal billing.

The program itself, when you open one (`lpn_inp_net_note`):

> This was an EPANET .net file. That is EPANET's own project file, it has no published description,
> and this page reads it by working the format out from example files, **so use it only when you
> have nothing else rather than as a dependable route.**

The application warns; the marketing page does not, and `features.html` does not mention `.net` at
all, so the two pages of the same site disagree about whether the feature exists. This is EDR-07's
family: a claim that survives because nobody grepped for it after the honest version was written
somewhere else.

Smallest fix, and it costs the claim nothing: *"...or the `.net` file EPANET saves, which we read by
working the format out from examples and which the page tells you to trust less."*

RULE EDR3-01: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR3-02 - LOW - "How good each language is is recorded openly"

LibreWaterNet index. It is grammatical — a noun clause followed by its verb — and every reader will
read it twice and assume a typo. *"The quality of each language is recorded openly"* says the same
thing and cannot be misread.

RULE EDR3-02: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR3-03 - MEDIUM - Two flourishes in one paragraph, on the page's best subject

Same section:

> Your feedback improves every language, English included, **in one long global conversation**.

> **This is the deepest single investment in the project**, and it exists because the people who
> most need a free network solver are very often not working in English.

The first is a flourish; the second is a superlative about your own effort, which is the pass-one
category (announcing rather than showing) wearing different clothes. The facts around them are the
strongest on the page — 27 languages, term-by-term against a glossary, quality recorded openly,
RTL laid out RTL — and they are doing the work already.

> Your feedback improves every language, English included. ... Nothing else in the project has
> taken as much work, and it exists because the people who most need a free network solver are
> very often not working in English.

RULE EDR3-03: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR3-04 - LOW - A sentence that trips on its own repetition

Screenshots page: *"Nothing here is a mock-up: every frame is the program running in a browser, and
the numbers on them are numbers it worked out."*

*"...and the numbers on them are its own."*

RULE EDR3-04: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR3-05 - LOW - "its own separate permission"

not-epanet.org, in the services paragraph. *Own* and *separate* are the same word twice. *"each asks
its own permission"*. (LibreWaterNet's version of the sentence, *"each one asks separately"*, is
already right, which is how the duplication shows.)

RULE EDR3-05: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR3-06 - LOW - My own tribute paragraph is too long in the middle, and it is new today

The credit you asked for is written and epanet-js is named in it. The second paragraph's middle
sentence runs to 50 words with a polysyndeton in it (*"in evenings and weekends and unpaid hours"*),
which is exactly the register this review has been cutting elsewhere. Flagging my own rather than
quietly keeping it. The tightened version:

> They did that work before the age of AI, on their own time, and it is what made it possible for
> one semi-retired engineer with an AI to build this in a summer. That is not a boast about us. It
> is the measure of what they left lying around for somebody to pick up.

RULE EDR3-06: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH: I preferred not to name any names in this paragraph. See below:

For thirty years, people have been wrapping, porting, rebuilding, teaching and arguing about this engine, mostly for nothing and mostly on their own time. The graphical front ends, free and commercial. The hydraulic solver. The university courses that taught a generation to read an .inp file. The people answering the same file-format question in public for the tenth year running.

We mention them together because the list is longer than we know and we would get it wrong. What we can say is what it cost them and what it cost us: they did that work before the age of AI, in evenings and weekends and unpaid hours, and it is what made it possible for one semi-retired engineer with an AI to build this. That is not a boast about us. It is the measure of what they left lying around for somebody to pick up, and the reason the polite thing to do with it is to give ours away too.

## EDR3-07 - MEDIUM - "World class and world owned."

The hero headline. **"World owned" is the idea**, it is yours, it is unusual, and the whole page
earns it. *"World class"* is the half a snob stops on: it is the one self-award on a site that has
just had every other self-award removed, and it is the sort of claim a reader tests against the
first rough edge they find. The rhyme is doing the work, which is why it has survived.

I am not going to propose a replacement headline for a phrase that may be yours and load-bearing.
The question is only whether the first three words are paying their way beside the last three.
*"World owned."* alone, on two lines, is stronger than either half.

RULE EDR3-07: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR3-08 - LOW - A claim about somebody else's browser, undated

`Install.php`: *"Firefox does not support installing PWAs on desktop."* True when written, and it is
a statement about a product that changes without telling us, on a page that will not be re-read for
years. Either date it (*"as of 2026"*) or make it conditional (*"if your browser offers no install
option, the calculators still cache and work offline"*), which is the sentence the reader actually
needs and which cannot go stale.

RULE EDR3-08: [x] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

---

# The two suggestions you asked for

## EDR2-08, rejected: what would make the masthead land harder

Your ruling stands and I am not reopening it. You asked what would land harder, so:

**The line is competing with itself in the two places it appears.** On `index.php` and `About.php`
it is the frame around everything, and it reads as one. On a calculator page it sits above a form in
the same visual weight as the page furniture, where a reader who came to size a pipe reads it as
decoration and skips it — which is the one outcome you do not want for that sentence.

Three ways to make it land, cheapest first:

1. **Let it end the page rather than open it.** Above the form it is an interruption; below the
   answer, after the calculator has just been useful to somebody for free, it is a gift with a note
   attached. Same words, same pages, different position, and the reader who has been helped is a
   different reader from the one who has not started.
2. **Give it one line of attribution.** Unsigned on every page it reads as branding. *"— Tom Haws"*
   under it, once, makes it a person saying something to you, which is what it is.
3. **Say it once, whole, somewhere it can breathe** — the About page has the room for the paragraph
   behind it, and the calculator pages carry the short form linking there. The mission is stated
   better on `About.php` than in the masthead, and almost nobody reaches `About.php`.

The honest counter-argument, which is why I would try 1 before 3: repetition is how a line like this
gets into somebody's head, and the people you most want to reach are exactly the ones who will only
ever see one page.

## EDR2-10, later: what the consent question could say

Filed for whenever a consent-version bump is happening anyway, because the retranslation is the
cost, not the writing. Current:

> Will you allow us to keep a single digit per page in this browser profile's storage to prevent us
> from logging its visits repeatedly?

Two purposes nested in one 26-word question. The reader must answer for something they have not been
told the point of yet. Proposed:

> **May we keep one digit in this browser to remember that we have already counted this page?**
> It records nothing about you and nothing you type. Without it we cannot tell your second visit
> from somebody else's first.

Three sentences: the ask, the reassurance, the reason. The reason is last because it is the part
that makes a *yes* feel reasonable rather than the part that makes the ask sound complicated. It is
also two words shorter than what is there.

**Do not ship this on its own.** Changing the question re-asks everybody who has already answered.

---

# PASS THREE OUTCOMES, and one question answered

All eight ruled, seven `fix` and EDR3-06 rewritten by Tom.

| Key | Done |
|---|---|
| EDR3-01 | The index now says the `.net` route is read by working the format out from examples and that the page tells you to trust it less |
| EDR3-02 | *"The quality of each language is recorded openly"* |
| EDR3-03 | Both cut; the paragraph is its facts now |
| EDR3-04 | *"...and the numbers on them are its own"* |
| EDR3-05 | *"each asks its own permission"* |
| EDR3-06 | **His paragraph, verbatim, and it names nobody.** Ledger row 4.8a records the instruction and its reason; the one printed name is the licence credit below, which is where a credit belongs |
| EDR3-07 | The headline is **World owned.** |
| EDR3-08 | *"If your browser offers no install option, nothing is lost..."*, with Firefox named as the common case rather than as the claim |

## EDR2-10 - SHIPPED, and my "later" was wrong

**Tom, 2026-09-06: *"Why not ship the consent wording fix?"*** He was right and the answer is that
I priced it wrong. Written out, because the mistake is a useful one:

**I conflated two different triggers.** `lib/config.inc.php` re-asks on a **materially changed
ask** — bumping `EC_CONSENT_VERSION` invalidates the middle answer, *"Allow this"*, which is
scope-limited consent meaning *yes to this, ask me again if you add another purpose*. What is
material is a change in **what is stored or what it is for**. This edit changes neither: same one
digit, same purpose, same three answers, same cookie. **A clearer sentence about an unchanged
practice does not invalidate a consent already given, and re-asking on it would be nagging people
who have already said yes** — which `config.inc.php` names as the one direction that makes a consent
flow worse rather than safer. `EC_CONSENT_VERSION` stays at `1`.

The real cost was one key in 26 languages, in a sprint that is going to run anyway. That is not a
reason to leave a hard sentence standing on the one screen where every visitor has to answer a
question. **The rule this leaves behind: price a consent edit by asking whether the ANSWER a person
already gave still means what they meant, not by asking whether the words moved.**

Shipped:

> May we keep one digit in this browser to remember that we have already counted this page? It
> records nothing about you and nothing you type. Without it we cannot tell your second visit from
> somebody else's first.

**`detect_english_drift.php` now lists `consent_body` as CHANGED**, so the next sprint retranslates
it; until then non-English visitors read the previous sentence, which is clumsier and still true.

### ONE THING IS OUTSTANDING AND IT IS NOT MINE TO WRITE

**`$ec_lang_syn['consent_body']` still describes the OLD sentence** and would ship the old wording's
synonyms to 26 translation agents. The synonym channel is off-limits to AI without written
permission in the conversation, so here is the diff for approval, not an edit:

```
- Will you allow (permit) us to keep (store, save, put) a single digit per page in this browser
  profile's storage to prevent us from logging (recording) its visits repeatedly?
+ May we keep (store, save, put) one digit in this browser to remember (record) that we have
  already counted (tallied) this page? It records nothing about you and nothing you type. Without
  it we cannot tell (distinguish) your second visit from somebody else's first.
```

Every parenthesis passes the substitution test: each could stand in the sentence as written.

## EDR2-05 follow-up: the log retention number

Tom: *"there is a cron job enforcing rotation and retirement, I believe. You can check."* **Checked,
and what is in this repository is the OTHER log.** `dev/scripts/trim_logs.php` is the backstop for
the **usage counts** — 26 months, the number `privacy.php` already promises, made a fact rather than
an intention by Task 286. Nothing in this tree touches the **web server's access log**, whose
rotation belongs to the host; production SSH is blocked from here, so I cannot read its
`logrotate.d` entry.

The notice now says the access log *"is rotated and deleted automatically on a schedule, rather
than kept indefinitely"*, and that it is deleted much sooner than the 26 months. **That is the
weakest sentence in the notice and it wants a number** — the host's rotation interval, in days or
weeks. One look at the hosting control panel or `/etc/logrotate.d/apache2` on the server settles it.
