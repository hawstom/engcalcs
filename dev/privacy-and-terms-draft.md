# Privacy notice and Terms of use — DRAFTS FOR HUMAN REVIEW

Written 2026-08-11 at Tom's request, after he decided to accept a consent banner rather than
engineer around one. Companion to `dev/cookie-storage-inventory.md`, which is the factual inventory
these drafts describe; **read that first** — everything below is only as accurate as it is.

> **NOT LEGAL ADVICE, AND NOT WRITTEN BY A LAWYER.** These are drafts to react to, and the one
> clause that could actually cost money — the liability limitation in the Terms — is exactly the one
> a non-lawyer should not be trusted on. Treat this as a well-researched starting point that saves a
> reviewer the blank page, not as a document to publish unread.

---

## 0. First, a correction: there is no EU template

Tom's understanding was *"the European Union may have a boilerplate template that they expect us to
complete. At least that is what it looked like to me at epanet-js."* **There isn't one.** What
exists is:

- **GDPR Articles 13 and 14 list the required CONTENT** — 14 specific items that must be disclosed
  when you collect data from a person. That is a checklist, and it functions like a template in the
  sense that it tells you exactly what to say. Section 1 below follows it item by item.
- **The European Commission publishes its own cookie policy** as a live example of a good one, not
  as a form to fill in.
- **The GDPR never uses the words "privacy policy" or "cookie policy"** at all. It requires
  *information*, "in a concise, transparent, intelligible and easily accessible form, using clear
  and plain language".

What Tom probably saw at epanet-js is the output of a commercial generator (Termly, iubenda,
CookieYes and similar all produce a recognisably uniform document), which is why several sites look
like they filled in the same form. They did — just not one the EU published. (`epanetjs.com/privacy`
returns 404, so this could not be confirmed directly.)

**The practical consequence is good news:** there is no form to get wrong, and a short honest
document that covers the Article 13 list beats a long generated one that describes trackers this
site does not have.

Sources: [GDPR.eu privacy notice guide](https://gdpr.eu/privacy-notice/) ·
[Article 13 text](https://gdpr-text.com/read/article-13/) ·
[European Commission cookies policy](https://commission.europa.eu/cookies-policy_en) ·
[EDPB cookie policy](https://www.edpb.europa.eu/edpb-cookie-policy_en)

---

## 1. Decisions a human must make before this ships

Placeholders below are written as `[LIKE THIS]`. None of them is a detail.

| # | Decision | Note |
|---|---|---|
| 1 | **`[CONTROLLER LEGAL NAME]` and `[POSTAL ADDRESS]`** | GDPR Art 13(1)(a) requires identity and contact details. A sole trader's own name and address is normal and acceptable. There is no way to comply anonymously. |
| 2 | **`[PRIVACY CONTACT EMAIL]`** | Tom's personal Gmail is the address the repo knows. Publishing it on a privacy page invites everything a published address invites — consider a dedicated alias. |
| 3 | **Which SITE does this cover?** | The cookies are set with `path=/`, so they cover **all of hawsedc.com**, not just `/engcalcs`. `hawsedc.com` also serves `peakfact.php` and `sewslope.php` and has no privacy page. **Recommendation: one notice at the hawsedc.com level, linked from engcalcs** — matching the standing rule against duplicating parent-site content, and matching where the cookies actually apply. |
| 4 | **`[GOVERNING LAW]` for the Terms** | Arizona/US is the natural answer. Note that a governing-law clause does not remove EU consumer-protection rights from EU visitors; it decides other things. |
| 5 | **Whether a lawyer reads the liability clause** | §3.4 is the clause that matters if a design ever goes wrong. Everything else here is disclosure; that one is risk allocation. |

---

## 2. DRAFT — Privacy notice

> Structured as the Article 13 list, in the order a reader needs rather than the order the statute
> gives. Plain language is a legal requirement here, not a style preference.

### Who we are

`[CONTROLLER LEGAL NAME]` publishes hawsedc.com, including the EngCalcs engineering calculators at
hawsedc.com/engcalcs. We decide what data this site collects and why, which makes us the "data
controller" under the GDPR.

Write to us about anything on this page at `[PRIVACY CONTACT EMAIL]`, or
`[POSTAL ADDRESS]`.

### The short version

We do not sell anything, we do not advertise, and we do not use any third-party tracking service.
There is no analytics vendor, no tag manager, no advertising network, and no social media pixel on
this site. **We never record your IP address** in our usage logs, and those logs contain no
identifier that could be traced back to you.

The calculators run entirely in your browser. **The numbers you type are never sent to us.**

### What we collect, why, and on what legal basis

**1. Anonymous usage counts** — *consent*

We count how many people open each calculator page, in which language, and how many go on to use it.
The record is the page name, the language, and the time. It contains no IP address, no account, and
no identifier of any kind. We use it to decide which calculators to improve and which languages to
translate into.

To avoid counting the same visit several times, this needs a small amount of information stored in
your browser — which is why we ask permission first. If you say no, we do not store it and we do not
count you.

**2. Your settings and your work** — *necessary to provide the calculator you asked for*

- The numbers you type into a calculator, and the units you choose, are stored **in your own
  browser** so the page still has them when you come back. They are never sent to us.
- The language you pick from the language menu is remembered the same way.
- The Looped Pipe Network calculator saves the networks you draw **in your own browser**. Your
  drawings never reach our server. If you connect a project to a file on your computer, that file is
  written directly by your browser; we never see it.

**3. Messages you send us** — *necessary to answer you*

If you use the contact form, we receive your name, your email address, and your message, and we keep
them so we can reply and refer back to the conversation.

**4. Shared-file coordination in the Looped Pipe Network calculator** — *necessary to provide the
feature you asked for*

If you use the project-locking feature so colleagues do not overwrite each other's work, the name or
initials you type are stored on our server alongside the project id and a timestamp, and are shown
to anyone else who opens that file. Deleted `[RETENTION: e.g. 30 days]` after the lock is released.

### What we store on your device

The full list, what each item is for, and how long it lasts, is in the cookie table at
`[LINK TO COOKIE SECTION]`. In summary: a few small items that remember what you typed and which
language you chose, and — only if you agree — one that stops your visit being counted twice.

Nothing on this site is stored by anybody but us.

### Who else sees it

**Nobody.** We do not share, sell, or transfer any of it to third parties. We use no processor,
no analytics service, and no advertising partner.

### Where it goes

Our server is in the `[SERVER COUNTRY — United States?]`. If you are in the European Economic Area,
that means the little we collect is transferred outside it. We rely on `[TRANSFER BASIS — see note]`.

> **Reviewer note.** This is the one place a US-hosted site cannot hand-wave. The realistic options
> are (a) Art 49(1)(a) — your explicit consent, which the banner can carry for the usage counts, and
> (b) Art 49(1)(b) — necessary to perform a contract at your request, which fits the contact form.
> Standard Contractual Clauses are for transfers to *another party*, and there is no other party
> here. Worth 20 minutes of a professional's time to confirm rather than guess.

### How long we keep it

| What | How long |
|---|---|
| Usage counts | `[RETENTION]` |
| Contact form messages | `[RETENTION]` |
| Project lock records | `[RETENTION]` |
| Anything in your own browser | Until you clear it, or until the cookie expires |

### Your rights

If you are in the EEA or the UK you can ask us to show you the data we hold about you, correct it,
delete it, restrict how we use it, object to our using it, or send it to you in a portable form.
Where we rely on your consent you can **withdraw it at any time**, and it is as easy to withdraw as
it was to give — use `[LINK: the "Cookie settings" control]`, which is always available at the foot
of every page.

You can also complain to your national data protection authority. You do not have to speak to us
first.

### Automated decision-making

There is none. Nothing on this site profiles you or makes decisions about you.

### Changes

If we change this notice we will change the date below. `[Last updated: DATE]`

---

## 3. DRAFT — Terms of use

### 3.1 What this is

EngCalcs is a set of free engineering calculators published by `[CONTROLLER LEGAL NAME]`. Using them
means accepting these terms.

### 3.2 The software is free, in both senses

The calculators are licensed under the **GNU General Public License, version 3 or later**. You may
run, study, share and modify them. The source is published at
`[REPO URL — github.com/hawstom/engcalcs]`.

### 3.3 Professional responsibility — read this one

**These calculators are tools, not engineers.** They implement published methods (Manning,
Hazen-Williams, Darcy-Weisbach, EPANET's own hydraulic engine, and others), and they implement them
carefully — but a result is only as good as what you typed, and only as good as the method's fit to
your problem.

**You are responsible for every number you take from this site.** Check it. Understand the method.
Know its assumptions and its limits. Anything used in a real design must be reviewed by a qualified
engineer who takes responsibility for it — in most places, one licensed to do so. Nothing here is a
professional service, and using it creates no engineer–client relationship of any kind.

### 3.4 No warranty, and what we are not liable for

> **`[REVIEWER: this is the clause to have a lawyer read.]`** The GPL already disclaims warranty for
> the *software*; this is about the *service and its results*, which the GPL does not cover. Note
> also that EU consumer law limits how far liability can be disclaimed against a consumer, so a
> blanket exclusion may not be fully enforceable against an EU visitor whatever it says.

This site is provided "as is", without warranty of any kind, express or implied, including any
warranty of accuracy, fitness for a particular purpose, or uninterrupted availability.

To the fullest extent the law allows, `[CONTROLLER LEGAL NAME]` is not liable for any loss, damage,
cost or claim arising from your use of this site or of any result it produces — including design
errors, construction cost, delay, or professional liability. Where liability cannot lawfully be
excluded, it is limited to `[AMOUNT — commonly the greater of the fees paid (zero here) or a nominal sum]`.

Nothing in these terms excludes liability for death or personal injury caused by negligence, for
fraud, or for anything else that cannot lawfully be excluded.

### 3.5 Your work stays yours

Networks you draw and numbers you enter are yours. They are stored in your browser and we neither
receive nor claim any right in them.

### 3.6 Fair use of the site

Use it for engineering work, study, or teaching. Do not attempt to break it, overload it, or use it
to harm others. We may withdraw access from anyone who does.

### 3.7 Changes, and the governing law

We may update these terms; the date below says when we last did. These terms are governed by the law
of `[GOVERNING LAW]`. If you are a consumer in the EEA or the UK, this does not deprive you of the
protection of your own country's mandatory consumer law.

`[Last updated: DATE]`

---

## 4. What the consent banner has to actually do

Not a design; the constraints, so nobody has to rediscover them mid-build.

- **Opt-IN, before the storage happens.** Nothing non-exempt may be written until the visitor
  agrees. **This is an ordering bug today:** `lib/base.inc.php` calls `session_start()` on every
  page load, so `PHPSESSID` is set before anyone has been asked anything. Sessions have to become
  lazy — started only when something actually needs one.
- **Refusing must be exactly as easy as accepting.** One click each, same prominence, same page. A
  banner where "Accept" is a button and "Reject" is buried in a settings sub-page is the specific
  pattern EU regulators have been fining.
- **No pre-ticked boxes, and no cookie wall.** The calculators must work fully for someone who
  refuses.
- **Withdrawal must be as easy as consent** — a permanent "Cookie settings" link in the footer that
  reopens the choice. The existing `ec_nolog` opt-out is the seed of this, but it is an opt-*out*
  and cannot double as consent.
- **Record what was consented to and when**, so the choice survives and can be shown.
- **The consent record itself is exempt** — a cookie remembering "this person said no" is strictly
  necessary to honour that answer, which is why refusing does not mean asking again every page.

### The translation consequence, which decides the ORDER of work

**The banner's strings are UI and must be translated into all 26 languages** — consent that the
visitor cannot read is not consent, and this suite's whole point is being readable in 26 languages.
That is roughly 8–12 short strings.

**The notice and terms above are long-form legal text, and that is a different question.** Machine
translation of a liability clause is a bad idea; the honest options are English-authoritative with a
"the English version governs" line, or a proper human translation later. Most small sites do the
former. Note the tension: GDPR wants the information intelligible to the reader, and a site
published in 26 languages offering its notice only in English is a genuine weak spot, not a
technicality — but it is a weak spot shared with almost every small site, and it is fixable later.

**Therefore: land the banner's English strings BEFORE the Task 251 sprint, not after.** Twelve
strings that ride along with 273 others cost nothing; twelve strings that miss the sprint cost a
second 26-agent sprint of their own. This is why Tom's "compliance and then the 26-language sprint"
is not just a preference — it is the cheap order.
