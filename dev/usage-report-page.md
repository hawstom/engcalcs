# The usage report page

Tom, 2026-09-17:

> Would it be a good idea to serve a usage report web page? I guess it could be password protected
> or public. I'm feeling a bit private at the moment, so password protection might be nice.
> Historical graphs might be nice.

Tom, 2026-09-24 (R-212):

> I would like a URL I can visit that gives scripted views of our logs. This is a long project
> where I will ask for clarifications over the long term. And I love graphs. But phase 1 is to
> create the URL and the script. It doesn't have to be secret, but we won't publish or link it. How
> about `engcalcs/spock.php` or `engcalcs/spock-cast.php`?

`spock.php`, at the suite root, no password, drawing the six usage logs over time.

## Where it lives, and where it used to live

Phase 1 shipped this as `usage-report/index.php`, in a directory of its own so an HTTP Basic
directive could not 500 the whole suite where the host refused `AllowOverride AuthConfig`. R-212
dropped the password ("it doesn't have to be secret"), so there is no auth directive that could
500 anything, and the page moved to the suite root as `spock.php`. That directory and its
`.htaccess` are gone; nothing redirects from the old path, since nothing outside this repository
ever linked it.

**It is a different thing from `spock/`, the sibling directory.** `spock/` holds rotated log
archives (denied outright) plus `spock/public/`, the one aggregate report Tom separately approved
publishing ("spock: Make it reachable", 2026-08-23). A request for the exact file `spock.php` does
not fall back to the `spock/` directory index under Apache; the archives stay denied by
`spock/.htaccess` regardless. See `spock/README.md`.

Open `https://hawsedc.com/engcalcs/spock.php`. Nobody publishes or links it, and it carries no
form, no menu entry and no password: the page tells nobody about itself, and only somebody who
already has the URL reaches it.

### Keeping it unindexed with no `.htaccess` to help

Since it is no longer behind HTTP Basic in a directory of its own, it carries `noindex, nofollow`
two ways: a `<meta name="robots">` tag in the page and an `X-Robots-Tag` header sent by
`header()` in `spock.php` itself, because there is no `.htaccess` beside a root-level file to add
that header the way `usage-report/.htaccess` and `spock/public/.htaccess` once did.

## What the page shows, and where each number comes from

Every heading on the page names its own log file and field number. In summary:

| Section | Log | Field |
|---|---|---|
| Confirmed-human page views per day | `log/engcalcs-human-view.log` | 1 (timestamp) |
| Pages looked at | `log/engcalcs-human-view.log` | 2 (page basename) |
| Language the page was served in | `log/engcalcs-human-view.log` | 3 |
| Device pointer | `log/engcalcs-human-view.log` | 5 |
| Confirmed calculations per day, and by calculator | `log/engcalcs-calc-usage.log` | 1, 2 |
| Naming events per day, by kind and by page | `log/engcalcs-title.log` | 1, 5, 2 |
| Language reach, how it was decided, raw tag | `log/engcalcs-lang.log` | 2, 3, 6 |
| Unit preset clicks per day, and by raw tag | `log/engcalcs-signal.log` | 1, 5 and 6, 4 |
| Behaviour signals per day, by kind and detail | `log/engcalcs-signal.log` | 1, 5, 6 |
| Contact funnel, viewed and sent per day | `log/engcalcs-human-view.log` + `log/engcalcs-contact-send.log` | 1, 2 |

Every section above draws a PEOPLE chart and a PAGE LOADS chart, each an inline SVG bar chart with
no external library and no script: an x-axis labelled with the first and last day in the window, a
y-axis labelled with 0 and the day's peak, and a title on each bar giving the exact day and count.

It reads the live `log/` directory **and every archive under `spock/`**, oldest first, which is what
makes a window older than the last rotation drawable at all. The directory table at the top says
which directories contributed rows.

`log/lang-log-stats.sh` remains the authority. It prints Wilson intervals, a window fingerprint and
the provenance of an archive; this page prints the same rows drawn over time. Every number here is
re-derivable by running that script over the same directory.

## The two buckets, which is the whole risk in this page

Every log row ends with a bucket written by `ecLogBucketSuffix()`:

* `visitor` is a visitor who agreed to being counted once rather than every time. Those rows are
  deduplicated per person per page, so **they count people**.
* `visit` is everybody else. Nothing may be stored to deduplicate against, so every page load
  writes a row, and **they count page loads**.

**The page never adds them.** Every table has a people column and a page-loads column and no total
column; every chart draws one bucket with its own scale, because a shared axis is the visual form
of the sum. `dev/scripts/usage_report_selftest.php` asserts that no table on the rendered page has
a total, sum, combined or all column, and that no row carries more than three cells.

## What it stores on a visitor's device

Nothing. No cookie, no local storage, no session, no script of any kind on the page, and it does
not even `require` `lib/config.inc.php`, whose load-time behaviour reads and can clear analytics
cookies. So `consent_body` stays true, `EC_CONSENT_VERSION` does not move, and nobody is re-asked
anything.

It is also not a suite page: no nav link, no menu row, no sitemap entry (`generate_sitemap.php`
excludes anything with no page header call, which this has), no manifest entry, no service-worker
precache (`ecSwPageExclusions()` in `lib/ServiceWorker.lib.php`), and a `noindex, nofollow` robots
meta plus an `X-Robots-Tag` header sent by the page itself.

## What the logs could not support

* **Sessions.** There is no session in this suite and has not been since Task 288, so there is no
  session count to graph. The closest honest thing is the two buckets above, which is what the page
  shows.
* **Returning visitors as a time series.** The `repeat` signal says a browser had already left work
  on a page, but it is consent-gated and stores nothing, so it cannot be turned into a cohort.
* **Unique people in the page-loads bucket.** By construction: undeduplicated is what that bucket
  means.
* **Anything about who.** No row in any of these files names anybody, and nothing here changes
  that.

## Phase 2 and beyond

R-212 is a long project Tom will keep adding to. Phase 1 is the URL and the script above; further
"scripted views" and graph requests belong in `dev/tom-review-queue.md` / `dev/ROADMAP.md` as they
come, not anticipated here.
