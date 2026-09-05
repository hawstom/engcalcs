# What this suite stores on a visitor's device, and what it collects

Written 2026-08-11 because Tom raised EU cookie compliance: *"That is looming over us. I don't know
what triggers it, but probably we are already outlaws. That's my guess."*

**This is an INVENTORY, not legal advice, and nobody here is a lawyer.** It exists because the
inventory is the thing any competent adviser will ask for first, and because half of Tom's question
— *what triggers it* — is answerable from the code without asking anybody. Whether each item below
clears the legal bar is a judgement for someone qualified; **what** each item is, and **why it
exists**, is a fact, and that is what this file pins down.

Re-run the inventory after touching any of: `lib/config.inc.php`, `lib/Language.lib.php`,
`lib/Consent.lib.php`, `js/Cookies.lib.js`, `lib/Calculators.lib.php`, `js/looped-network.js`,
`js/branched-network.js`, or any `log-*.php`.

**Sections 2 and 3 are now held by `dev/scripts/storage_inventory_check.php`** (ROADMAP Task 322),
which reads every `setcookie(`, `document.cookie =`, `localStorage.setItem(` and `indexedDB.open(`
in shipped code and fails the build on a name that is not in this file. It found two that were
not — `bpn_sketch_toggles` and the `engcalcs-lpn` handle store — which is the whole argument for a
check over a re-read. It never asks whether something *should* be stored: that is §1's exemption
test and it belongs to a person.

> **UPDATED 2026-08-12: Task 286 phase 1 has SHIPPED, and sections 2, 3, 5 and 6 below now describe
> the state after it.** Each row of the tables says whether it needs consent. The original §6 —
> "the outcome worth aiming at: no banner" — was overruled by Tom on 2026-08-11 and is preserved
> below as the argument that lost, because the reasoning that beat it is worth keeping too.

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
| Name | Set by | Lifetime | Purpose | Consent |
|---|---|---|---|---|
| `<PageName>` (e.g. `Manning-Pipe-Flow`) | `EngCalcs.createCookie`, `js/Cookies.lib.js` | **1 year** (was 36,000 days until Task 286) | Remembers the numbers the visitor typed and the units they chose, per calculator page | **Exempt** — user-input storage, written only after they typed |
| `ec_language` | `lib/Language.lib.php` | 1 year, HttpOnly | The language the visitor explicitly chose from the language menu | **Exempt** — a preference the visitor set deliberately |
| `ec_consent` | `lib/Consent.lib.php` (JS) or `consent.php` (no-JS) | 1 year, readable by JS | The consent record: `<state>.<unix-ts>.<policy-version>` | **Exempt** — it exists solely to honour the answer given |
| `ec_nolog` | `lib/config.inc.php` | 10 years | **Author/tester tool. NOT in the UI and NOT in `privacy.php`** (Tom, 2026-08-12: *"Why disclose it if it's not in the UI?"*). Stops a browser being counted at all, and is NOT redundant with `ec_consent`: refusing consent still writes an undeduplicated 'visit' row, while this writes nothing anywhere — verified 2026-08-12 against all five log writers. **It goes into `privacy.php` the day it gets a UI control**, because then the site would be offering it | **Exempt** — it only honours a choice |
| `ec_geosearch` | `js/lpn-search.js` (JS only) | 1 year, readable by JS | **A second, purpose-specific consent record** (Task 437): the visitor said yes to place-name search on the Looped-Network map, which sends what they typed to `nominatim.openstreetmap.org`. Same `<state>.<unix-ts>.<policy-version>` shape as `ec_consent`, and **`1` is the only state that exists** — a refusal writes nothing at all. Version-pinned to `EC_GEOSEARCH_VERSION` (`lib/Consent.lib.php`), which is **separate from `EC_CONSENT_VERSION` on purpose**: changing what we send, or who we send it to, must re-ask exactly the people who said yes to the old ask and must NOT re-ask everybody about analytics | **Exempt** — the answer the visitor gave in order to get a service they explicitly requested, holding no identifier, no query and no result. Removed by Settings > Erase everything (`EngCalcs.lpnSearchForget()`, called from `wipeAllStorage()`) |
| `ec_terrain` | `js/lpn-terrain.js` (JS only) | 1 year, readable by JS | **A third, purpose-specific consent record** (Task 497): the visitor said yes to reading ground elevations for the Looped-Network map, which sends the latitude and longitude of each node that needs one to `api.mapbox.com`. Same `<state>.<unix-ts>.<policy-version>` shape, and **`1` is the only state that exists** — a refusal writes nothing at all. Version-pinned to `EC_TERRAIN_VERSION` (`lib/config.inc.php`, beside `EC_MAPBOX_TOKEN`, because the token is what decides whether the feature exists at all). Separate from `ec_geosearch` because a search says *what the visitor typed* and this says *where their nodes are* — which is the model itself | **Exempt** — the answer the visitor gave in order to get a service they explicitly requested, holding no identifier, no coordinate and no result. Removed by Settings > Erase everything (`EngCalcs.lpnTerrainForget()`, called from `wipeAllStorage()`) |
| `ec_blang` | `lib/Language.lib.php` | 1 year, HttpOnly | **Analytics only.** The literal value `1`, meaning the browser-language row has been written. Was the language tag until Task 288; every use site is `isset()`, so the value was written and never once read | **Requires consent.** Not written otherwise, deleted on withdrawal |
| `ec_seen` | `ecMarkSeen()`, `lib/config.inc.php` | Session cookie, HttpOnly | **Analytics only.** One base-32 digit per page, five bits: language view, human view, calculation, title, subtitle. Plus one reserved `_v` entry for the visit's single demand row. **No identifier of any kind** | **Requires consent.** Not written otherwise, deleted on withdrawal |
| ~~`PHPSESSID`~~ | — | — | **GONE as of Task 288.** It was a 32-hex unique identifier plus a server-side session file, and everything it held was "have we already counted this" — which needs no identifier to answer | — |

`PHPSESSID` used to be the hard case: it carried `$_SESSION['CLANGUAGE']` (service) *and* the log
gates (analytics), and under a per-purpose test the analytics half tainted the whole cookie. Task
286 did not resolve that by argument — it moved the language job onto `ec_language`, which the
visitor sets deliberately, leaving the session with one purpose and one honest answer. **Task 288
then removed it entirely**, which is the stronger outcome: there is now no unique identifier stored
on a visitor's device at all, and no server-side session state anywhere in the suite.

## 3. Browser storage

| Key | Where | What it holds |
|---|---|---|
| `lpn_index` | `js/looped-network.js` | The project list: id, name, last-updated, file link state |
| `lpn_project_<id>` | same | One whole project — the network the user drew, its settings, and any backdrop image as a data URI |
| `lpn_document` | same | Legacy single-document key, migrated on read |
| `lpn_identity` | same | The initials and the opaque token this browser sends to the file-lock broker |
| `lpn_pane` | same | Whether the bottom pane is open, how tall it is, and which tab (Task 434) |
| `lpn_rpane` | same | Whether the right panel is open and how wide it is (Task 441) |
| `lpn_setbox` | same | Where the Settings box was left, how big it was made, where its two panes are split, and whether it was open (Tasks 441, 576; openness Tom, 2026-09-04) |
| `lpn_findbox` | same | Where the Find box was left, how big it was made, and whether it was open (Tom, 2026-09-04: *"I would strongly like it to persist somehow across reloads... maybe we are safe to go with page for now"*, and *"doesn't remember whether it was open. Can it do that too?"*). Same purpose and category as the three rows above it |
| `lpn_show_titles` | same | Whether the page-title row is shown |
| `bpn_sketch_toggles` | `js/branched-network.js` | Which of the five data fields (length, diameter, flow, elevation, pressure) the Branched-Network topology sketch shows. The checkboxes live outside the form, so the page's own input cookie never captures them |

The first three are **exempt** — they hold the document the user made in order to give it back to
them. So are the rest, on the second limb of the same test: `lpn_identity` is strictly necessary for
a service the visitor explicitly requested (you cannot take a lock on a shared file without saying
who is holding it), and the last four are preferences the visitor set deliberately — three panel
layouts and a page-title toggle. **A panel layout is the same purpose at a finer grain, so it rides
this declaration rather than earning a new one: no new sentence in `consent_body`, no
`EC_CONSENT_VERSION` bump, nothing re-asked.** `bpn_sketch_toggles` is the same kind of thing one
page over: five checkboxes the visitor ticked, remembered because they sit outside the form the
input cookie captures. **None of the nine is analytics, and none carries an identifier of a
person** — `lpn_identity`'s token is opaque and its initials are typed by the user, for other humans
to read in the lock notice.

**All eight `lpn_` keys are removed by Settings > Erase everything** (`wipeAllStorage()`), which is
what makes that button's own sentence — "every project, every background image, all settings, and
your unit choices" — literally true. A `lpn_` key added here that is not in that list quietly makes
it false. The same function also expires the suite unit cookie and, since Task 437, the
`ec_geosearch` consent record. `bpn_sketch_toggles` belongs to Branched-Network.php, which has no
such button and is not reached by this one.

### IndexedDB

| Store | Where | What it holds |
|---|---|---|
| `engcalcs-offline-queue` | `js/Calculators.lib.js`, `sw.php` | Beacon rows that could not be sent while offline. **Analytics, and the one piece of client-side storage here that is NOT exempt** — written only with consent, emptied by `EngCalcs.flushQueue()` on withdrawal |
| `engcalcs-lpn` | `js/looped-network.js` | Two stores: `handles`, a `FileSystemFileHandle` per open project so a reload can reconnect to the file the user chose (Task 212), and `recent`, the recent-files list (Task 258). **Exempt** — a handle is the document the user linked, kept so it can be given back; it is structured-cloneable, where `localStorage` holds strings alone, which is why this is a second store rather than more rows in `lpn_index`. The browser re-grants PERMISSION separately, so a returning visitor is asked again by the browser itself. **Cleared by `wipeAllStorage()` since 2026-08-31**, with `deleteDatabase` rather than a store-by-store clear: the confirm promises "as a brand-new visitor would see it", and a brand-new visitor has no database at all. It had been outside that button's reach — the fourth thing that function has been found not to keep its word about, and the one `storage_inventory_check.php` found by noticing this store was undocumented. Fire-and-forget, because the caller reloads immediately and a delete blocked by another tab would hang the reload behind a window we do not own |

### Place-name search stores nothing but the answer

The map's Search for a place by name (Task 437, `js/lpn-search.js`) is the one feature here that
talks to a host other than the tile server, and the ONLY thing it puts on the device is the
`ec_geosearch` yes above. **No query history, no result cache, no `localStorage`, no IndexedDB, and
nothing on a refusal.** The rate limiter's clock and the one-query repeat guard live in plain
variables and die with the page.

That is the tiles' rule from `dev/geographic-projects.md` §4 applied with more force, and the reason
it is *more* force is worth stating: a tile request says where the visitor is **looking**; a search
request says what they **typed**. Caching results would mean storing that second thing, which is
exactly what the consent question in front of it is trying to keep small.

Nominatim's usage policy does ask that results "must be cached on your side", in its bulk-geocoding
section. **We cannot meet that clause as written and say so rather than pretending**: a durable cache
means a server proxy (this suite is entirely client-side and has none) or device storage (which would
need its own answer to the exemption test above). The volume is capped at the source instead — one
request per deliberate user action, at most one a second, and an immediately repeated identical query
answered from memory. The clause-by-clause record is at the top of `js/lpn-search.js`.
The one piece of client-side storage that is NOT exempt is the offline beacon queue in IndexedDB
(`engcalcs-offline-queue`, `js/Calculators.lib.js`): it is analytics, so it is written only with
consent and emptied by `EngCalcs.flushQueue()` on withdrawal.

### Task 200's repeat-visit signal stores nothing, on purpose

The obvious build was a list of visited pages in `localStorage`. That is durable analytics storage,
so it would have needed consent — and **the consent already granted does not cover it**:
`consent_body` asks for *"a single digit per page … to prevent us from logging its visits
repeatedly."* A page-name list is not a digit, and its purpose is the opposite one. Shipping it
would have meant rewriting the banner, retranslating it into 26 languages, and bumping
`EC_CONSENT_VERSION` to re-ask everybody — for a diagnostic.

So it reads storage the visitor's own work already put there: the page's **input cookie** on a
calculator, and on Looped-Network a **saved project document** (`lpn_project_<id>`, or the legacy
`lpn_document`). Present at load ⇒ this browser has used this page before. Better signal, no new
storage, no banner change. Reading exempt storage for an analytics purpose is still an analytics
access, so the *log row* is gated on `analyticsConsented()` even though the *storage* needs no
consent — which is why the repeat-visit table in `log/lang-log-stats.sh` is a sample of consenting
visitors and never a total.

**On the map page, probe the DOCUMENT and never the index.** `lpn_index` is the tempting key and it
is wrong: init() registers the blank project a first-time visitor opens on, so the index exists
before any edit. Probing it would have marked every second page load a return and counted
*reopening* the page as *using* it — collapsing the exact shopper/user distinction the signal was
built to draw, silently, as a plausible number nobody could falsify from the report. A
`lpn_project_<id>` key is written only on a real edit. `dev/calc-spike/repeat-visit-harness.js`
asserts this and fails if the probe is widened to `lpn_`.

**The general rule this is a worked example of: when a new measurement seems to need new storage,
check whether something exempt already answers the question.** The expensive part of storing
something is never the bytes — it is the sentence in the banner it makes false.

**No third-party STORAGE, and exactly four third-party requests, all on one page and all under the
visitor's control.** No analytics vendor, no tag manager, no ad network, no CDN fonts, and no CDN
(Task 287: Bootstrap was coming from jsDelivr, which set no cookie but did tell a third party the
visitor's IP and user-agent on every page load; it is now served from this origin alongside
`js/vendor/epanet-js.js`). The four that remain all belong to the Looped-Network map:

- **`tile.openstreetmap.org`** — the street-map pictures behind a geographic project. Off by a
  View-menu row, nothing cached by us, and it only ever says *where the visitor is looking*.
  `dev/geographic-projects.md` §4.
- **`api.mapbox.com`** — the satellite pictures, the same feature with a second source (Task 452).
  Same View-menu row, same silence about the visitor, and gated on `EC_MAPBOX_TOKEN`: no token means
  the option does not exist, which is the state a fork of this suite is in.
- **`nominatim.openstreetmap.org`** — place-name search (Task 437). Sent only on an explicit search,
  only after its own separate consent, and it says *what the visitor typed*, which is why it has a
  question of its own rather than riding on the tiles' silence.
- **`api.mapbox.com` again, for terrain** — ground elevations (Task 497), and it is a fourth PURPOSE
  on a host already in this list rather than a fourth host. Sent only when the visitor presses the
  View-menu row, only after its own separate consent (`ec_terrain`), and it says *where the
  visitor's nodes are*, which is the model itself. That is why it does not ride on the satellite
  tiles' gate: those pictures say where you are looking, these coordinates say what you have built.

> **`privacy.php` NOW STATES ALL THREE** (Task 480, 2026-08-21). Its *Who else sees it* section names
> the tiles and the search separately and keeps them separate on purpose: *"We send them nothing about
> you and nothing about your network"* is true of the tiles and FALSE of the search, which sends the
> words the visitor typed. **Do not fold the search back under the tiles' sentence.** The page also
> states the rule the list rests on — nothing leaves until you switch that feature on, and each asks
> separately — so a fourth service is a new paragraph, not a contradiction. `ec_geosearch` is in its
> device-storage table. **The terrain lookup is its FOURTH paragraph and `ec_terrain` its own row**
> (Task 497) — written the same day the feature shipped, which is what the rule above anticipated.

## 4. Server-side collection (GDPR, not ePrivacy)

| Log | Fields | Personal data? |
|---|---|---|
| `LANG_LOG` | page, language, source | No IP, no session id, no identifier |
| `HUMAN_VIEW_LOG` | page, language, timestamp | Same |
| `CALC_USAGE_LOG` | page, language, timestamp | Same |
| `TITLE_LOG` | page title event | Same |
| `SIGNAL_LOG` | page, language, event, short slug (a link's host+path, a unit token, a diagnostic code, a share outcome, a one-tap grievance press) | Same. The outbound row names a page we linked to, never anything the visitor typed |
| `CONTACT_SEND_LOG` + `formmail.php` | **name, email, message** | **Yes** |
| `lpn-locks/*.json` | project id, **holder name/initials**, timestamps | **Yes, if initials identify a colleague** |

The usage logs carrying **no IP and no session id** is a deliberate design already recorded in
`lib/config.inc.php`, and it is the single strongest fact in this whole file: it is what keeps the
analytics question a *cookie* question rather than a *personal data* question. Re-verified writer by
writer 2026-08-23 across all six: no `REMOTE_ADDR`, no `HTTP_USER_AGENT`, no session id, and nothing
the visitor typed — every visitor-supplied column passes `ecBrowserLangTag()` or an explicit
allowlist first. (The `CONTACT_SEND_LOG` row above is a combined entry: the **email** carries name,
address and message; the log line itself is `ts / 'contact' / lang / browser_lang / bucket`.)

**Nothing in section 4 is served over HTTP.** Rotated copies live in `spock/<YYYY-MM-DD>/`
(`dev/scripts/archive_logs.php`), which `spock/.htaccess` denies exactly as `log/.htaccess` denies
the live set, and `dev/scripts/trim_logs.php` walks the archives so the 26-month promise in
`privacy.php` follows the rows when they move — recording each archive deletion in that archive's
own manifest, so `php dev/scripts/archive_logs.php --verify` can show the promise being kept rather
than asserting it. The one served thing is an **aggregate** report at an
unguessable path under `spock/public/` — counts, no per-event data, timestamps truncated to a date.
Publishing counts discloses nothing about any individual and so changes no promise; publishing rows
would change the deal `consent_body` states, which is a banner rewrite, 26 retranslations and an
`EC_CONSENT_VERSION` bump. **Nothing about any of this changes what is stored on a visitor's
device**, so sections 1–3 are untouched by it.

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

### Why `ec_nolog` is not in the privacy notice

It was, briefly, and removing it is the right call. The section is headed **"What we store on your
device"** — a claim about what the SITE does to a visitor. `ec_nolog` is not that: it cannot be
reached from any link, button or menu, and the only way to acquire it is to type `?ec_nolog=1` onto
an address yourself, at which point you already know exactly what it is.

Two arguments were made for keeping it and both fail on inspection. *"The table claims to be the
full list"* — answered by narrowing what the table claims, which is the better fix, since the
heading already scopes it to what we store. *"Disclosure is owed for anything on a device"* —
disclosure is owed for what we do to the reader, and for a reader who has never typed that
parameter we do nothing.

The real cost of keeping it was the one that decided it: **the mention IS the advertisement**,
however neutrally worded, and a paragraph explaining how to switch it on recruits visitors out of
the anonymous page-load count — the one number that survives a refusal, and the entire reason the
visits bucket exists. Half-promoting it was worse than either honest option.

It stays fully documented here, in the developer record, and it goes back into the notice the day
it acquires a UI control — because at that point the site is offering it rather than merely
answering to it.

## 6. What shipped, 2026-08-12 (Task 286 phase 1)

Read section 5 first: it is the diagnosis, and every item below is a treatment for one line of it.

1. **Sessions are lazy.** *(SUPERSEDED by Task 288, which removed `PHPSESSID` outright — see the
   table above. `ecSessionStart()` no longer exists, and the number of sessions this suite starts is
   ZERO, enforced by `dev/scripts/no_session_check.php`. Kept as the dated record of what phase 1
   shipped, because the reasoning below is why phase 2 was possible.)*
   `lib/base.inc.php` no longer calls `session_start()` at the top of every
   page load. `ecSessionStart()` (`lib/config.inc.php`) starts one only for a visitor who has said
   yes, and every caller — the bootstrap and all three `log-*.php` — is written to work without
   one. **This was the real work of the phase, not the banner.** A banner cannot fix a cookie that
   is already written by the time it renders.
2. **The language override moved off the session** and onto the `ec_language` cookie, which is
   exempt on its own footing. That is what un-mixed `PHPSESSID`'s two purposes; see section 2.
3. **`ec_blang` is written only with consent**, and deleted on withdrawal.
4. **The page-input cookie is one year**, down from 36,000 days. Hygiene, and independent of
   consent — nobody had to be asked anything for that number to be wrong.
5. **A consent banner** (`lib/Consent.lib.php`), on every page, meeting the §4 constraints of
   `privacy-and-terms-draft.md`: opt-in before the storage, two identically styled buttons so
   refusing is exactly as easy as accepting, no pre-ticked anything, no cookie wall, a permanent
   footer control that reopens the choice, and a stored consent record. It works with JavaScript
   off, via `consent.php` — a banner that needs JS to answer makes refusal impossible for the
   people who cannot use it.
6. **Withdrawal actually removes things.** `ecForgetAnalyticsStorage()` destroys the session and
   expires `ec_blang` server-side; `EngCalcs.flushQueue()` empties the IndexedDB beacon queue.

### The one design question Tom asked, and its answer

*"If a user opts out of being logged as a returner, do we report them in a separate bucket... I
don't think that we want to completely ignore them."*

We do not. Consent governs **storage**, and storage is what de-duplication needs — not counting.
A server-side row carrying no IP, no session id and no identifier of any kind needs no cookie to
be lawful and no cookie to be useful. So there are two buckets, reported side by side by
`log/lang-log-stats.sh` and **never added together**:

- **visitors** — consented, de-duplicated per session. Today's numbers, unchanged.
- **visits** — everybody else, one row per page load, nothing stored. Marked by a trailing `visit`
  column, and by `source=anon` in the language log.

Adding them would quietly turn every count into a mixture of people and page loads and every
percentage into a number with no meaning — a page whose non-consenting visitors reload a lot would
simply look more popular. Keeping them apart costs one column and one report section.

### Still open

- The privacy notice and terms pages themselves (drafts in `dev/privacy-and-terms-draft.md`,
  waiting on the human decisions listed in its section 1).
- Translating the banner's ten `consent_*`/`privacy_link`/`terms_link` keys into the other 26
  languages. They exist in English and are timed to ride the Task 251 sprint.

---

## 7. The argument that lost: aiming at no banner

Kept because Tom's reasoning for overruling it is better than the argument itself, and because
anyone reopening this question should read the round that already happened. See ROADMAP Task 286.

### (original section 6, as written 2026-08-11)

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
