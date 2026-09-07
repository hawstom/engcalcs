# Editorial review, second pass: the application's own public pages

**Read as:** the same senior editor, a second time, on the surface pass one did not touch. Pass one
reviewed the two marketing sites. This one reviews **what a visitor actually uses** — the suite's
own non-calculator pages at `hawsedc.com/engcalcs` — plus the site furniture that appears on every
page of every calculator, which is the most-read text either project owns.

**Reviewed:** the LIVE pages, fetched 2026-09-06: `index.php`, `About.php`, `privacy.php`,
`terms.php`, `contact.php`, `Install.php`, and the header, navigation and consent banner that ride
on all of them. Plus a mechanical sweep of all 1,697 shipped English strings.

## How to rule on this

Same as before. **Search for `RULE EDR2-`.**

```
RULE EDR2-01: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:
```

## Verdict in one paragraph

The application's own English is the best-written text in either project, and the sweep says so: of
1,697 shipped strings, **zero** contain a word from the marketing-slop list (*seamless*, *powerful*,
*robust*, *leverage*, *intuitive*, *empower*, *unlock*, *dive into*, and eleven more). The privacy
notice is better than most published by companies with legal departments. What is wrong here is not
style but **age and inconsistency**: three pieces of furniture are years out of date, two of the
four core languages are misspelled in the language menu, and the terms reserve a right the rest of
the site promises never to use. Four findings I would hold the page for: EDR2-01, EDR2-02, EDR2-03,
EDR2-04 — and all four are minutes of work.

---

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

RULE EDR2-01: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-02 - HIGH - "Blog (new in 2009)", on every page of the site

`lib/Menus.lib.php:41`. The link works and the blog is there. The parenthesis has been announcing
its own novelty for seventeen years, and it is in the navigation of every page the suite serves.

Nothing else on either site is capable of dating the project this precisely. Drop the parenthesis;
the word "Blog" carries everything it needs to.

RULE EDR2-02: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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
become otherwise; the hosted service is offered free today and, if it ever cannot be, the software
is still yours to run. That is both true and better than either sentence alone.

RULE EDR2-03: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-04 - HIGH - A promise that dates itself, and dated wrong

`contact.php:34`:

> I created this form around 2013. As of 2025, I am still replying promptly. :-)

It is 2026. The sentence's whole job is to reassure a stranger that the form is live, and its own
date now says the opposite. A hand-maintained date is a promise to maintain it; nobody does.

Say it without a year: *"I still reply to this form myself, usually within a few days."* If the
2013 provenance matters, it can stay — it is the *"As of 2025"* that expires.

**And the emoticon.** I would cut it: this is the page where somebody decides whether a real
engineer is on the other end, immediately below a line naming you as a Professional Engineer.

RULE EDR2-04: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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

RULE EDR2-05: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-06 - MEDIUM - The first sentence of the terms is tangled

> HawsEDC Calculators is a service and a set of software that comprise a set of engineering
> calculators published and served by Thomas Gail Haws.

"a set of... a set of", and *comprise* is used the wrong way round (a whole comprises its parts).
The rest of that document is unusually clear, which makes its opening sentence conspicuous.

> HawsEDC Calculators is a set of engineering calculators, published as software and served as a
> website by Thomas Gail Haws.

RULE EDR2-06: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-07 - MEDIUM - A street address on two public pages

`contact.php` and `privacy.php` both print **859 N Lafayette, Mesa AZ 85201**. The GDPR does want a
contactable address for the controller, and a P.E. publishing a business address is ordinary. I am
flagging it only to be sure it is a business address and a deliberate choice, because it is the one
item on either site that cannot be taken back once it is indexed.

If it is your home, a PO box or a registered agent satisfies the same requirement.

RULE EDR2-07: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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

RULE EDR2-08: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-09 - LOW - The blog link is `http://`

`lib/Menus.lib.php:41` points at `http://tomsthird.blogspot.com/`, which redirects to HTTPS. One
character, and it removes a redirect hop on every page.

RULE EDR2-09: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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

RULE EDR2-10: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-11 - LOW - Sixty-seven em dashes in shipped English

The suite's ratchet is a baseline, not a sweep, and this is only a note on where they sit: the
concentration is in `privacy.php` and `terms.php`, the two longest pieces of prose, where the dash
is doing real parenthetical work and a comma would sometimes be worse. Nothing to do today. If a
sprint ever touches those pages for another reason, lower the baseline while you are in there.

RULE EDR2-11: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

## EDR2-12 - LOW - The offline section leads with the acronym

`About.php`: *"These calculators work as a Progressive Web App (PWA)."* The reader who needs that
section is the one who does not know the term. Lead with what happens — *"Open any calculator once
while you are online and all of them keep working when you are not"* — and let the acronym follow
for the reader who wants to look it up.

RULE EDR2-12: [ ] fix   [ ] fix as amended   [ ] reject   [ ] later   -- TGH:

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
