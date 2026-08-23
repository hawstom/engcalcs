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
    .archive-manifest.json     written by archive_logs.php when it seals the archive
  reports/                     aggregate reports. usage-<date>.txt plus usage-latest.txt
  public/                      the ONE web-reachable thing here (see public/.htaccess)
```

**The filenames inside an archive are the live filenames, unchanged**, and an archive's identity is
its directory name. Dropping the six files into `spock/2026-08-14/` by hand is still enough: both
the report and the retention trim pick it up on their next run with no edit to anything, which has
to keep working because deploying logging to a new location orphans the old logs and hand-moving
them must not need a code change.

## The manifest, and the question it answers

A rotation writes `.archive-manifest.json` naming the window it just sealed, the row count of each
of the six, and the archive it follows. The ending date alone can POINT a report at a window; it
cannot tell a later reader whether the hole between two archives is a quiet fortnight, a retention
trim doing its job, or logging that went somewhere else for a month. Deleted rows leave nothing
behind, so only something written at the moment of rotation can say — and `dev/scripts/trim_logs.php`
appends its own row to the manifest whenever it deletes from an archive, for the same reason.

**The directory name did not change to carry any of this, and must not.** Encoding the window in
the name — `spock/2026-07-01_2026-08-14/` — is the obvious alternative and is worse three ways: it
orphans every archive already on the server, it is a claim no code verifies, and it duplicates what
the manifest holds exactly. Format and rationale: `dev/scripts/log_archive_manifest.inc.php`.

**An archive with no manifest is a valid archive.** It reads as `derived`: the window it shows is
everything it can prove about itself, which is exactly what the old hand-moved sets could ever
prove.

## Auditing

```
php dev/scripts/archive_logs.php --verify
```

Lists every archive oldest-first with its window and provenance, and flags a hole in the record:
rows gone with no trim recorded, a manifest naming a predecessor that is not here, two archives
covering one window. A gap in TRAFFIC prints as a note; only an unrecorded gap in DATA exits 1, so
this is safe to run from cron and be mailed only when something is wrong.

## Reading an archive

```
bash log/lang-log-stats.sh --archive=spock/2026-08-14
bash log/lang-log-stats.sh --archive=2026-08-14      # same thing — an archive IS its ending date
```

Same report, different window. It prints a `SOURCE` line naming the archive, a `PROVENANCE` line
saying whether that archive registered itself, and its FINGERPRINT carries `src=archive:<name>`
where a live run carries `src=live` — so an archived run and a live run can never be pasted into
`dev/usage-data-log.md` and mistaken for each other.

## Rotating

```
php dev/scripts/archive_logs.php            # dry run: what would move
php dev/scripts/archive_logs.php --apply    # move it, recreate the live logs empty, register it
```

Refuses to run if today's archive directory already exists, and verifies every row arrived before
it truncates anything. Snapshot the aggregate first (the dry run prints the command) — the live
window is not recoverable from the archive once the report has moved on.

## Retention

`dev/scripts/trim_logs.php` walks `spock/*/` as well as `log/`. It has to: `privacy.php` promises
usage counts are kept at most 26 months, and an archive that retention never touches turns that
promise into a lie the moment the first archive is 27 months old. Every deletion it makes inside an
archive is appended to that archive's manifest, so `--verify` reads the shortened window as
retention rather than as a loss.

## Running it on a schedule

The recommended crontab — cadence, ordering and why — is in `dev/usage-data-log.md`, under
"Running this on a schedule". Nothing is enabled here.

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
