# Visitor-device storage rulings — full record

Moved verbatim out of `CLAUDE.md` on 2026-09-23 when that file was compacted. CLAUDE.md keeps the
short rule and points here; this file keeps the reasoning, the quotes and the measurements.

## What may be stored on a visitor's device

Full inventory: `dev/cookie-storage-inventory.md`.

- **THIS SUITE STARTS NO PHP SESSION AT ALL, and the number is zero rather than "one, gated."**
  Task 288 removed `PHPSESSID` outright — everything it held was "have we already counted this",
  which needs no identifier to answer. A session writes that identifier to a visitor's device on the
  response that starts it, before any banner has asked and with no way for one to take it back from
  outside. `no_session_check.php` blocks on `session_start`, `session_id` and their siblings; it
  reads tokens, so the comments recording the removal are invisible to it.
  - *(Corrected 2026-08-28: this rule used to say "call `ecSessionStart()` (`lib/config.inc.php`)".
    **That function does not exist** — it went with Task 288 — so the rule sent a future contributor
    to a helper that is not there. Found while turning it into a check, which is the argument the
    Task 322 survey makes about prose in general.)*
  - Sessions coming back is a consent-version bump, a rewritten banner and 26 retranslations, plus a
    deliberate edit to that check. Have that conversation first.
- **The session is analytics ONLY** — it exists to de-duplicate usage logs. Do not put a
  service-related value in it; that is what makes a mixed-purpose cookie unlawful under a per-purpose
  test. A visitor preference belongs in its own deliberately-set cookie (`ec_language` is the worked
  example).
- **Before adding storage, check whether something EXEMPT already answers the question.** A
  repeat-use signal wanted a visited-page list in `localStorage`; the page's own input cookie already
  says the same thing, better ("they calculated here", not "they glanced at it"), and is exempt
  because it holds what the visitor typed. **The cost of new storage is never the bytes — it is the
  sentence in `consent_body` it makes false**, and therefore a banner rewrite, 26 retranslations and
  an `EC_CONSENT_VERSION` bump that re-asks everybody. An analytics READ of exempt storage still needs
  consent, so gate the log row; you just need not ask for anything new.
- **New storage needs the exemption test, per purpose:** is it *strictly necessary for a service the
  visitor explicitly requested*? User-input storage, an explicit preference, the consent record and
  the log opt-out all pass. Anything whose job is to make a **statistic** better fails, whatever the
  technology — `localStorage`, `sessionStorage` and IndexedDB are in scope exactly as cookies are.
  Gate a failing item on `ecAnalyticsConsented()` / `EngCalcs.analyticsConsented()`, and make
  withdrawal delete it.
- **A new log writer must call `ecLogBucketSuffix()`** and append it to the line. Consented rows are
  deduplicated and unmarked; everyone else's are marked `visit` and undeduplicated. **Never sum the
  two buckets** — one counts people, the other counts page loads.
- **Never restyle one consent button to stand out.** `.ec-consent-btn` styles both answers identically
  on purpose; a coloured Accept beside a grey Reject is the dark pattern this design avoids.
- **Cookie lifetimes are defensible out loud.** One year is the house default.

---

