# The usage report page

Tom, 2026-09-17:

> Would it be a good idea to serve a usage report web page? I guess it could be password protected
> or public. I'm feeling a bit private at the moment, so password protection might be nice.
> Historical graphs might be nice.

`usage-report/index.php`, behind HTTP Basic, drawing the six usage logs over time.

## Turning the password on

Three commands on the server, in order. Nothing here is a script; paste them one at a time.

```
ssh jconstru
htpasswd -c ~/.htpasswd-engcalcs tom
chmod 600 ~/.htpasswd-engcalcs
```

`htpasswd -c` asks for the password twice and creates the file. **The `-c` creates it from
scratch, so use it once.** To change the password later, or to add a second name, leave `-c` off:

```
htpasswd ~/.htpasswd-engcalcs tom
```

To check what the file holds (it shows names and hashes, never passwords):

```
cat ~/.htpasswd-engcalcs
```

Then open `https://hawsedc.com/engcalcs/usage-report/` and the browser asks for the name and
password. Log out by quitting the browser: HTTP Basic has no other sign-out, and that is the price
of a scheme that stores nothing of ours.

### If the page answers 500 instead of asking for a password

Two causes, both fail-closed by design and neither of them touching any other page:

1. **The password file is not there yet**, or Apache cannot read it. Run the three commands above.
2. **The host does not grant `AllowOverride AuthConfig`** for this directory. That is a separate
   grant from the `FileInfo`/`Limit` the rest of the suite's `.htaccess` files rely on, and it is
   the same trap the root `.htaccess` records about `Options -Indexes`. Ask the host to add
   `AuthConfig`, or move the whole directory behind cPanel's own Directory Privacy, which writes
   the same directives from the control panel.

The page lives in a directory of its own for exactly this reason: an auth directive Apache refuses
500s the directory that holds it, so the blast radius is this one page rather than all 28.

### If the path is not `/home/jconstru`

`AuthUserFile` in `usage-report/.htaccess` is an absolute server path and is currently
`/home/jconstru/.htpasswd-engcalcs`. Confirm with `echo $HOME` after `ssh jconstru`, and edit that
one line if it differs. It must stay outside the document root.

## What the page shows, and where each number comes from

Every heading on the page names its own log file and field number. In summary:

| Section | Log | Field |
|---|---|---|
| Confirmed-human page views per day | `log/engcalcs-human-view.log` | 1 (timestamp) |
| Pages looked at | `log/engcalcs-human-view.log` | 2 (page basename) |
| Language the page was served in | `log/engcalcs-human-view.log` | 3 |
| Device pointer | `log/engcalcs-human-view.log` | 5 |
| Confirmed calculations per day, and by calculator | `log/engcalcs-calc-usage.log` | 1, 2 |
| Naming events by kind and by page | `log/engcalcs-title.log` | 5, 2 |
| Language reach, how it was decided, raw tag | `log/engcalcs-lang.log` | 2, 3, 6 |
| Unit preset clicks, and by raw tag | `log/engcalcs-signal.log` | 5 and 6, 4 |
| Behaviour signals | `log/engcalcs-signal.log` | 5, 6 |
| Contact funnel | `log/engcalcs-human-view.log` + `log/engcalcs-contact-send.log` | 2 |

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
cookies. The credential is HTTP Basic, which the browser holds. So `consent_body` stays true,
`EC_CONSENT_VERSION` does not move, and nobody is re-asked anything.

It is also not a suite page: no nav link, no menu row, no sitemap entry (`generate_sitemap.php`
excludes anything with no page header call, which this has), no manifest entry, no service-worker
precache, and a `noindex, nofollow` robots meta plus an `X-Robots-Tag` header beside it.

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
