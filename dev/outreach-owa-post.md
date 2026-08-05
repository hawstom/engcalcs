# Outreach: Open Water Analytics post — **SENT by Tom, 2026-08-05**

Prepared 2026-08-05 for ROADMAP Task 218. **Aimed at ADVISORS, not proteges** — per Task 218, those
are two different lists and this venue serves only the first.

**STATUS: POSTED 2026-08-05.** Tom sent it the same day it was drafted. This file is now a record of
what was said and a place to note what came back, not a draft awaiting action.

**What happens next, per the expectations set below: probably nothing, for a while.** Org Discussions
is a quiet room. Do not read silence as a failed post, and do not let it hold up Task 213 — if the
answer is needed, the EPANET source is public and readable.

**Reply log** — append here, dated. Empty is the expected state for some weeks.

- *(none yet)*

---

## Where to post

**https://github.com/orgs/OpenWaterAnalytics/discussions** → category **Q&A**.

Sign in with a GitHub account, press **New discussion**, choose **Q&A**, paste the title and body
below.

### Venue facts, all verified 2026-08-05

| Check | Result |
|---|---|
| `OpenWaterAnalytics/EPANET` last push | **2026-07-23** — active |
| Open issues | 46 |
| Stars / forks | 405 / 249 |
| Repo-level Discussions | **disabled** (`has_discussions: false`) — do not look for them there |
| Org-level Discussions | **live**, categories: Announcements, General, Ideas, Polls, Q&A, Show and tell |
| Old Discourse forum `community.wateranalytics.org` | **dead** — connection times out entirely |

### The one thing to know before spending the effort: it is a QUIET room

Org Discussions holds roughly **eight threads in total**. The codebase is genuinely active and the
maintainers are real, but the discussion surface is not busy. Consequences, stated plainly so the
outcome is not a disappointment:

- A reply may take weeks, or may not come. **That is the expected case, not a failure.**
- The activity is in **Issues** (46 open), but this question is not a bug report and does not belong
  there. Q&A is the correct venue even though it is the slower one.
- **Do not treat this as the only shot.** It costs one evening and it is worth having, but Task 218's
  other venues are not made redundant by it.
- **Do not let it block Task 213.** If the answer matters and no reply comes, the EPANET source is
  public and readable — that was option (b) and it remains available at any time.

---

## Title

```
Is the Hazen-Williams resistance constant 4.727 exact as implemented, or a rounded published value?
```

## Body — paste as-is

I maintain a small suite of free web-based hydraulic calculators (https://hawsedc.com/engcalcs/ —
GPL, twelve calculators, twenty-seven languages), including a looped-network page that solves by the
global gradient method. I am currently aligning its Hazen-Williams head loss with EPANET's so that
the two agree, and I would rather get the constant right than approximately right.

My pages have been using the SI form:

    Sf = 7.8828 / d^4.8704 * (Q / (0.849 * C))^1.852

EPANET's documented US form is:

    hL = 4.727 * L * Q^1.852 / (C^1.852 * d^4.871)

Converted to SI these differ by up to about 0.1% over a 50 mm to 2 m diameter range. The diameter
exponents also differ (4.8704 against 4.871), so the discrepancy is diameter-dependent rather than a
constant offset — it changes sign near 300 mm.

Two questions for anyone who knows the source well:

1. Is `4.727` the exact value used in the code, or a rounded form of something derived at higher
   precision?
2. Since EPANET converts SI input to US units internally, is there any accumulated conversion
   difference I should expect between a network entered in SI and the same network entered in US
   units?

I am planning to adopt EPANET's constants outright rather than carry both sets, on the grounds that
EPANET is what my users will check me against. Happy to be told that is the wrong call.

Thomas Gail Haws
Mesa, Arizona

---

## Why it is shaped this way

- **It leads with a real question, not an introduction.** In a developer community "hello, I made a
  thing" reads as promotion and gets ignored. A specific answerable question does not.
- **The arithmetic is shown.** It demonstrates the work was done before asking, which is most of what
  earns a reply from a stranger.
- **The project mention is load-bearing.** It explains *why* the question is being asked. It is not an
  advertisement, and it should not be expanded into one.
- **The last line invites correction.** This is the single most reliable way to get expert strangers
  to engage — people who will not write a paragraph unprompted will happily tell you that you are
  wrong.

## If a reply comes

- **Answer quickly, and thank them by name.** The whole point is the second conversation, not this one.
- **Feed any terminology or constant decision back into the repo** — Task 213 for the constants,
  `glossary.json` for anything about wording. A confirmed answer from a maintainer is exactly the kind
  of decision the glossary exists to memorialize.
- **Do not immediately pitch anything.** An advisor relationship is earned across several exchanges.
  The ask, if there ever is one, comes much later and is small.
