# `spock/` — archived usage logs, and the one published report

## Why "spock"

Tom, 2026-08-22:

> I derived spock because Jesus said not to worry about the speck in your sibling's eye when there
> is a **log** in your own eye, and speck reminded me of spock.

Written down because an unexplained directory name gets "cleaned up" by a future reader. It is not
a typo, it is not Star Trek, and it is not to be renamed.

## Layout

```
spock/
  <YYYY-MM-DD>/                one archive: the six live logs as they stood when they were rotated
    engcalcs-lang.log            THE DATE IS THE ARCHIVE'S ENDING DATE (the day it was archived),
    engcalcs-human-view.log      never its starting date.
    engcalcs-calc-usage.log
    engcalcs-title.log
    engcalcs-signal.log
    engcalcs-contact-send.log
    .last-report-window        written by lang-log-stats.sh when it reports against this archive
  reports/                     aggregate reports. usage-<date>.txt plus usage-latest.txt
  public/                      the ONE web-reachable thing here (see public/.htaccess)
```

**The filenames inside an archive are the live filenames, unchanged.** Nothing registers an
archive anywhere: dropping the six files into `spock/2026-08-14/` by hand is the whole procedure,
and both the report and the retention trim pick it up on their next run with no edit to anything.
That matters because deploying logging to a new location orphans the old logs, and hand-moving
them must not need a code change.

## Reading an archive

```
bash log/lang-log-stats.sh --archive=spock/2026-08-14
```

Same report, different window. It prints a `SOURCE` line naming the archive, and its FINGERPRINT
carries `src=archive:<name>` where a live run carries `src=live`, so an archived run and a live run
can never be pasted into `dev/usage-data-log.md` and mistaken for each other.

## Rotating

```
php dev/scripts/archive_logs.php            # dry run: what would move
php dev/scripts/archive_logs.php --apply    # move it, and recreate the live logs empty
```

Refuses to run if today's archive directory already exists, and verifies every row arrived before
it truncates anything.

## Retention

`dev/scripts/trim_logs.php` walks `spock/*/` as well as `log/`. It has to: `privacy.php` promises
usage counts are kept at most 26 months, and an archive that retention never touches turns that
promise into a lie the moment the first archive is 27 months old.

## What is tracked in git

This file, `.htaccess`, and `public/.htaccess`. **No log and no report** — same arrangement `log/`
has always had.

## Why the raw logs are not published

Tom offered to publish everything. The content is close to harmless — verified writer by writer:
no `REMOTE_ADDR`, no `HTTP_USER_AGENT`, no session id, nothing the visitor typed. But publishing is
a promise question, not a content question. `privacy.php` does not say "published on the web", and
changing that deal costs a `consent_body` rewrite, 26 retranslations and an `EC_CONSENT_VERSION`
bump that re-asks everybody. It is also irreversible once a crawler indexes it. An aggregate report
carries none of that, so the aggregate is what gets served.
