# What this suite stores on a visitor's device, and what it collects

Written 2026-08-11 because Tom raised EU cookie compliance: *"That is looming over us. I don't know
what triggers it, but probably we are already outlaws. That's my guess."*

**This is an INVENTORY, not legal advice, and nobody here is a lawyer.** It exists because the
inventory is the thing any competent adviser will ask for first, and because half of Tom's question
— *what triggers it* — is answerable from the code without asking anybody. Whether each item below
clears the legal bar is a judgement for someone qualified; **what** each item is, and **why it
exists**, is a fact, and that is what this file pins down.

Re-run the inventory after touching any of: `lib/config.inc.php`, `lib/Language.lib.php`,
`js/Cookies.lib.js`, `lib/Calculators.lib.php`, `js/looped-network.js`, or any `log-*.php`.

---

## 1. What actually triggers a cookie banner

Not GDPR. The consent rule for storage on a device is **ePrivacy Directive Article 5(3)** (the
"cookie law"), transposed into each member state's own law. Its shape matters, because it decides
everything below:

> Storing information, **or gaining access to information already stored**, in a user's terminal
> equipment requires the user's **consent** — UNLESS it is (a) solely to carry out a transmission,
> or (b) **strictly necessary** to provide a service **explicitly requested by the user**.

Four consequences that are easy to get wrong:

1. **It is not about cookies.** "Information stored in terminal equipment" covers `localStorage`,
   `sessionStorage`, IndexedDB and cache-based identifiers exactly as it covers cookies. `lpn_`
   stores whole projects in `localStorage`; that is in scope for the same test.
2. **The test is PER PURPOSE, not per technology.** One cookie serving two purposes is exempt for
   neither if either purpose fails the test.
3. **"Strictly necessary" means necessary for what the USER asked for, not for what the site owner
   wants.** Analytics is the textbook failing case: WP29 Opinion 04/2012 lists first-party analytics
   as **not exempt**, while recommending it be considered for a future exemption that never arrived.
4. **Consent means opt-IN, before the storage happens.** An opt-out mechanism is not consent.

**Territorial reach:** GDPR/ePrivacy apply to offering services to people in the EU regardless of
where the server is. A free calculator suite published in 26 languages, including most EU
languages, is not a plausible candidate for "we do not target the EU."

---

## 2. Cookies this suite sets

| Name | Set by | Lifetime | Purpose | Set on user's own action? |
|---|---|---|---|---|
| `<PageName>` (e.g. `Manning-Pipe-Flow`) | `EngCalcs.createCookie`, `js/Cookies.lib.js` | **36,000 days (~98 years)** | Remembers the numbers the visitor typed and the units they chose, per calculator page | Yes — written after they use the calculator |
| `ec_language` | `lib/Language.lib.php` | 1 year, HttpOnly | The language the visitor explicitly chose from the language menu | Yes |
| `ec_blang` | `lib/Language.lib.php` | 1 year, HttpOnly | **Analytics only.** Records the raw `Accept-Language` header so it is logged **once per browser** rather than once per visit | **No** |
| `ec_nolog` | `lib/config.inc.php` | 10 years | Marks a browser as opted out of every usage log | Yes — only ever set by visiting `?ec_nolog=1` |
| `PHPSESSID` | `session_start()` in `lib/base.inc.php`, `log-calc-event.php`, `log-human-view.php`, `log-title-event.php` | Session | **Two purposes at once** — carries `$_SESSION['CLANGUAGE']` (the language override, service-related) *and* `$_SESSION['CLANG_LOGGED']` plus the per-session log gates (analytics) | Mixed |

## 3. Browser storage

| Key | Where | What it holds |
|---|---|---|
| `lpn_index` | `js/looped-network.js` | The project list: id, name, last-updated, file link state |
| `lpn_project_<id>` | same | One whole project — the network the user drew, its settings, and any backdrop image as a data URI |
| `lpn_document` | same | Legacy single-document key, migrated on read |

**No third-party storage anywhere.** No analytics vendor, no tag manager, no ad network, no CDN
fonts, no embedded maps. Everything above is first-party, and `js/vendor/epanet-js.js` is served
from this origin. That is a materially better starting position than most sites face and it should
be said out loud in whatever notice gets written.

## 4. Server-side collection (GDPR, not ePrivacy)

| Log | Fields | Personal data? |
|---|---|---|
| `LANG_LOG` | page, language, source | No IP, no session id, no identifier |
| `HUMAN_VIEW_LOG` | page, language, timestamp | Same |
| `CALC_USAGE_LOG` | page, language, timestamp | Same |
| `TITLE_LOG` | page title event | Same |
| `CONTACT_SEND_LOG` + `formmail.php` | **name, email, message** | **Yes** |
| `lpn-locks/*.json` | project id, **holder name/initials**, timestamps | **Yes, if initials identify a colleague** |

The usage logs carrying **no IP and no session id** is a deliberate design already recorded in
`lib/config.inc.php`, and it is the single strongest fact in this whole file: it is what keeps the
analytics question a *cookie* question rather than a *personal data* question.

---

## 5. Where the exposure actually is

Reading section 1's test against sections 2–4, in the order a reviewer would:

- **`ec_blang` is the clearest problem.** Its only job is to make a *statistic* accurate once per
  browser. It is not requested by the user, it is not needed to serve the page, and it is set before
  anybody has consented to anything. Nothing about it is defensible as strictly necessary.
- **`PHPSESSID` is a problem because it is MIXED.** Half of what it does (remembering a language
  override) would be exempt; the other half (not double-counting a view) is analytics. Under a
  per-purpose test, the analytics half taints it.
- **The page-input cookies are the strong case, with one weak spot: `36,000 days`.** A cookie that
  remembers what the visitor typed, written only after they typed it, is close to the textbook
  "user-input / UI-customisation" example. A ~98-year lifetime is not close to anything, and it is
  indefensible as *strictly necessary* whatever the purpose. This is also just poor hygiene, and
  shortening it costs one number.
- **`lpn_`'s `localStorage` is the strongest case in the file.** It holds a document the user made,
  in order to give it back to them — the same claim a word processor's autosave makes. It is hard to
  describe a drawing editor that cannot keep your drawing as providing the service you requested.
- **`ec_nolog` should survive any test**, on the same reasoning that exempts a consent-refusal
  cookie: it exists solely to honour a choice the user made.
- **`contact.php` and `lpn-lock.php` are a separate question from cookies entirely**, and there is
  **no privacy notice on this site at all**. GDPR Art 13 wants one wherever personal data is
  collected, and a contact form collects a name and an email address.

## 6. The outcome worth aiming at: no banner

A consent banner on a free calculator whose entire pitch is "open the page and get an answer" is a
real cost, and it is paid by every visitor on every page. **The better target is to need no banner
at all**, which is reachable because the non-exempt items are small and none of them is load-bearing:

1. **Retire `ec_blang`,** and accept that the browser-language statistic is counted per session
   rather than per browser (or drop that statistic). It is one number in `dev/usage-data-log.md`.
2. **Split `PHPSESSID`'s two jobs.** The language override can live in `ec_language`, which the user
   set deliberately. What remains of the session is then either gone or purely analytics — and if
   purely analytics, it goes with the analytics.
3. **Shorten the page-input cookie** from 36,000 days to something a person could defend out loud —
   a year matches `ec_language` and nobody will notice the difference.
4. **Decide what the usage logs are worth without client-side state.** Reach/shopping/using all
   depend on de-duplication that needs *something* stored per visitor. If the answer is that they
   are worth a consent prompt, then a prompt is the honest cost; if not, coarser numbers with no
   storage at all are a legitimate choice. **This is the one real decision in this file** and it is
   Tom's, not an implementation detail. (Note the interaction with ROADMAP Task 285: adding a device
   signal to those logs makes the analytics tier *more* in need of an answer, not less.)
5. **Write a privacy/cookies page regardless.** It is cheap, it is required for the contact form
   independently of everything above, and "no third parties, no advertising, no profiling, no IP
   logging" is a genuinely good thing to be able to say plainly.

**None of this is urgent in the sense of a deadline, and all of it is cheaper now than after a
26-language sprint** — a banner and a privacy page are text, and text is the thing this project pays
26x for.
