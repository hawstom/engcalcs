# `dev/host/` — the scripts that run on the server, not in the suite

**These files are not part of the web application and nothing on a page loads them.** They run
under cron on the `jconstru` cPanel account, they cover **all nine domains** on it rather than only
this suite, and they are kept here because this repository is the only versioned place either of
them has ever had.

**The copy in here is canonical. The copy in `~/` on the host is a deployment.** They can drift, and
nothing inside a cold checkout can tell; `dev/scripts/host_script_parity_check.php` is the advisory
that compares them when it can reach the host and says it checked nothing when it cannot.

| File | Installs as | What it does |
|---|---|---|
| `check.sh` | `~/check.sh` | Fetches every page on the account and fails on a bad status **or a PHP diagnostic inside a 200**. Silent on success. |
| `check.exclude` | `~/check.exclude` | Declared non-pages, each line carrying its reason. |
| `check.mustblock` | `~/check.mustblock` | The INVERSE list: URLs that must NOT be reachable. A 200 there is a failure. |
| `cronmail.sh` | `~/cronmail.sh` | Mails a job's output with an envelope sender that Gmail accepts. Sends nothing on empty input. |
| `daily-report-cron.sh` | `~/daily-report-cron.sh` | The nightly wrapper: refresh the mirror, run `dev/scripts/daily_report.sh` out of a current checkout, mail it unconditionally. |

Install with `sh dev/host/install.sh` from a checkout on the host, or copy by hand.

---

## The thing to know before touching any of this: PHASE 1 ALREADY EXISTED

`dev/reputation-and-practice.md` was written on 2026-09-15 and its §5 proposes an uptime watch as
phase 1, on the finding that *"`check_all.sh` is 80-odd checks about the CONTENTS of this repository
and not one of them can ask whether the site is up."* **The first half of that sentence is true and
the conclusion drawn from it was wrong: a watch existed, on the host, and had been running daily
since 2026-09-09.** It is better than what that plan proposed — it derives its URL list from
cPanel's own vhost table rather than from a list somebody typed, because *a hardcoded list goes
stale silently, which is the same class of bug this exists to catch*, and it reads the BODY as well
as the status because PHP can emit a fatal error after the 200 header has gone.

**The plan could not see it because it was looking in the repository.** That is the same blindness
the plan is about, one level up, and it is why these files are now in here.

**It works, and it has the receipts.** 622 pages checked on 2026-09-15; six consecutive days at
`failed=0` before it; and on the morning of 15 September it found
`/engcalcs/.claude/hooks/guard-wait-loops.php` answering HTTP 500 — which is how anybody learned
that `/engcalcs/.claude/settings.json` was being served as a plain 200, exposing the agent
definitions, the hook scripts and the permission allow-list. Nothing in `check_all.sh` could have
found that; `docroot_exposure_check.php` exists now because this did.

## PHASE 1a IS PROVEN, and what proving it took

**The rule, and it is the one worth carrying to any other project: an alarm nobody has proven can
reach a human is not an alarm.**

Cron mail on this account was dead for years and accumulated over 22,000 bounces, every one of them
`550-5.7.26 ... Gmail requires all senders to authenticate with either SPF or DKIM`. The cause is
the ENVELOPE SENDER, which `MAILTO` gives no way to set: cron sends as
`jconstru@minter.nocdirect.com`, a host that publishes no SPF record. **Pointing `MAILTO` at the
`tom@hawsedc.com` forwarder does NOT fix it** — measured 2026-09-08 — because forwarding preserves
the original envelope sender and the second hop is refused for the same reason. `cronmail.sh`'s
`sendmail -f tom@hawsedc.com` is the fix, and `hawsedc.com` does publish SPF covering this IP.

Proven end to end on 2026-09-15: a message sent through `cronmail.sh` arrived in the destination
inbox, unread and flagged important, **not in spam and not bounced**, and Tom confirmed receiving it
unprompted in the same hour. **Exit status 0 from `sendmail` was already true during all 22,000
bounces and proves nothing.** Confirm arrival at the far end or do not claim the path works.

- **Bounces since the fix landed: one, dated the day of the fix itself.** Nothing has bounced since.
- **`~/mail/new` still holds 22,907 historical bounces and the account is at 96% disk.** Clearing
  them is housekeeping nobody has done; the daily report counts them so the number is visible.

## What the host cannot do, stated so nobody builds on it

- **There is no `node` on the host**, so every harness under `dev/lpn-spike/` and
  `dev/calc-spike/` — and therefore `check_all.sh` as a whole — cannot run there. The daily report
  runs the PHP-only checks and says plainly which it did not run.
- **The CLI `php` on `PATH` is 5.6.40.** Repository scripts need
  `/opt/cpanel/ea-php83/root/usr/bin/php`. A cron line using the bare `php` is running PHP 5.6 and
  will parse-error on any script using `??`. The existing log-rotation jobs happen to parse under
  5.6; do not assume the next one will.
- **NOTHING HERE MAY `git fetch` OR `git pull` IN THE PRODUCTION CHECKOUT.** Two reasons and both
  are load-bearing. Tom deploys by hand and a silent pull empties the loop he uses to do it. And
  `ecDeployIdentity()` dates the About box's build line from `filemtime()` on the ref that HEAD
  resolves through, `packed-refs` included — **a fetch can rewrite `packed-refs`, which would
  advance the displayed build date without anything having been deployed.** That is exactly the
  stale-date defect `deploy_identity_selftest.php` was written for, arriving from the other
  direction. The report reads production with `git rev-parse HEAD` and nothing else, and gets every
  comparison from a SEPARATE MIRROR clone outside the document root.

## The clock, because two timezones are involved and one of them has no DST

Cron runs at **22:00 server time, which is US Central and observes DST. Tom reads it in Phoenix,
which does not.** So it arrives at 20:00 his time now and at 21:00 from 1 November until March. The
offset is written into the crontab as a plain number rather than left to `CRON_TZ`, because whether
this cron honours that variable cannot be established without waiting an hour to find out it did
not. One digit fixes it if the winter hour matters.

The page check is at 04:20 server time and was there first; the two are deliberately far apart on a
shared host.

## The inverse leg, and why the first fix made the alarm worse

`check.sh` asks *"does this page answer?"*. **Nothing asked *"does this path refuse?"*, and that gap
was opened by fixing an exposure rather than by ignoring one.**

The 2026-09-15 run found `/engcalcs/.claude/hooks/guard-wait-loops.php` at HTTP 500, which is how
anybody learned `/engcalcs/.claude/settings.json` was served as a plain 200. Once blocked, those
paths answer **403** -- which this script also counts as a failure -- so a working fix would have
mailed a failure every morning for ever. The walk therefore skips dot-directories as a class, which
is right, and which also means **the walk can no longer see that class of exposure at all, whether
or not the fix has been deployed.** A guard that goes quiet while the thing it guards is still
broken is worse than no guard.

`check.mustblock` is the half that can see it. A pass is 401, 403 or 404; a 200 names the URL. It is
a short TYPED list with a reason per line, deliberately: the derived-list argument that governs the
rest of this script does not apply, because no rule a machine can read says which URLs *ought* to be
unreachable. That is a judgement, and a judgement belongs in a declaration beside its reason.

**It closes the deploy gap by construction.** An `.htaccess` does nothing until the file is on the
server, so this stays red from the moment a fix is written until somebody pulls it. Measured
2026-09-15: two paths reachable, four refusing, with the fix committed to master for hours.

**What it taught about the root `.htaccess`, which is worth knowing:** `.github/` and `dev/` refuse
a `.md` because the root file blocks that EXTENSION. `.github` was never protected by a rule about
directories -- it was protected by extension luck. `.vscode/settings.json` and
`.claude/settings.json` were exposed for the same reason in reverse: `.json` is not blocked, and
`<FilesMatch "^\.">` matches FILENAMES, not the directories they sit in.
