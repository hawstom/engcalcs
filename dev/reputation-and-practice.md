# Reputation and practice — the plan from 18 September 2026

**Why this file exists.** Tom, 2026-09-15, two days before the EWB meeting and in the middle of
recovering from a merge nobody sanctioned:

> *"This EWB prep fiasco has made clear to me that I have to get serious about my reputation if my
> creations are going to go anywhere. Carefree or careless, mistakes like the site outages and
> merging difficult development branches to master before proper vetting can no longer be the
> matter of course."*

He asked for advice, asked whether scripts can gate a merge, asked about branch naming, asked about
cron, and said: **whatever we do, start on 18 September**, and make it portable to his other
projects. This is the answer, written down so it survives the session it was asked in.

**Read section 1 before section 5.** The plan is short and obvious once the diagnosis is right, and
wrong in an expensive way if it is not: most of what a person reaches for after an incident like
this is process that costs real time and would not have caught the incident.

---

## 1. What actually went wrong, and the two kinds it was

Six things went wrong in the weeks before EWB. They are **not one problem**, and the difference
decides the whole plan.

### Kind A — nobody was watching (four of the six)

| What | How long | How it was found |
|---|---|---|
| `hawsedc.com` parent site returning a fatal PHP error | weeks | Tom, by looking, 2026-09-09 |
| `librewaternet.org` 500 on every page (`ea-php56`) | from the day the symlink landed | Tom, by clicking |
| `/app` navbar and Help links 404 | from the day the rewrite shipped | Tom, by clicking |
| cron mail dead, 800+ bounces | **years** | found while investigating something else |

**Every one was silent, and every one was found by a human being who happened to look.** None
needed judgement to detect. A machine asking "does this URL return 200?" once an hour would have
caught three of them within the hour, and the fourth is a mail path nobody had ever tested.

**CORRECTED 2026-09-15, THE SAME DAY THIS WAS WRITTEN: A MACHINE WAS ALREADY ASKING.** `~/check.sh`
on the cPanel account has fetched every page on all nine domains daily since 2026-09-09 -- 622 of
them -- and fails on a bad status *or a PHP diagnostic inside a 200*. It was written after the
twelve-page outage in the table above, by the session that fixed it. So the diagnosis "nobody was
watching" is right about the WEEKS THE DAMAGE HAPPENED IN and wrong about today.

**The reason this plan could not see it is the finding that survives, and it is sharper than the one
it replaces:** `check_all.sh` is 80-odd checks about the CONTENTS of this repository, and the watch
was not in the repository. It lived in `~/` on the server, hand-edited there, versioned by nothing.
A plan written from inside the tree therefore proposed building from scratch a thing that was
already running, and would have shipped a second, worse watch beside it -- worse because the
proposed URL list was to be typed, and `check.sh` derives its list from cPanel's own vhost table
precisely because *a hardcoded list goes stale silently, which is the same class of bug this exists
to catch*. **The blindness the plan is about, one level up.** Both scripts are now in `dev/host/`,
and `host_script_parity_check.php` compares the two copies.

### Kind B — a thing was done against a written plan (two of the six)

The six capability-branch merges onto master on 2026-09-13, during Tom's feature freeze, and the
projection branch going in without the projection universe he had asked for twice.

**This is not a monitoring problem and a weekly report would not have caught it** — it was done
deliberately, by an AI, in a session that had a green build and read its own green build as
permission. The relevant facts:

- Tom's plan was written down, in `dev/session-handoff.md`, and the session did not read it.
- `CLAUDE.md` said "merge into master when done" and never said WHO decides done.
- Nothing refused the merge, because no hook watched merges: `pre-commit` exempts merge commits by
  construction and `pre-push` passes as soon as the suite is re-run.

All three are now fixed (see section 2). The deepest one is not a script at all and is already
written into `CLAUDE.md`: **when Tom questions a standing rule twice, the rule is the suspect.** He
questioned the no-branches paradigm twice, was argued out of it twice by a confident AI, and three
weeks of a working style he never wanted is what that cost. That is the failure mode to keep
watching, and it cannot be automated.

### What this means for the plan

**Spend on Kind A. It is cheap, mechanical, and it is where the reputation damage actually came
from** — a consulting engineer's site returning a fatal error for weeks is visible to strangers in
a way an internal merge never is. Kind B is already guarded about as well as scripts can guard it;
adding ceremony there buys little and costs every future session.

---

## 2. What already guards this, so nothing gets rebuilt

Written after the incidents, all of it live today:

- **`dev/hooks/pre-merge-commit`** refuses a merge of any branch listed in `dev/branch-policy.json`
  unless `dev/branch-all-clears.json` records Tom's words **pinned to the commit he cleared**. The
  approval lapses by itself the moment the branch moves. A `FREEZE` block in the same file stops
  every merge but a `hotfix:`.
- **`dev/hooks/pre-push`** refuses a push of master unless `check_all.sh` has passed **on that exact
  commit**, stamped in `.git/check-all-passed`. It is why a merge result gets re-verified rather
  than the branch it came from.
- **`hook_install_check.php`** — the hooks are a COPY in `.git/`, not `core.hooksPath`, because
  hooksPath resolves into the working tree and a checkout without `dev/hooks/` silently deletes
  every guard. It failed open and silently once; this check is the price of the fix.
- **`branch_policy_selftest.php`** — nine cases against a throwaway repository, because a hook that
  only speaks when it refuses is indistinguishable from a broken one.
- **`branch_hygiene_check.php`** (advisory) — every branch with its age, distance from master and
  whether it is merged.
- **`deploy_identity_selftest.php`** — the About box's build line names the deploy, not a file, so
  "did my pull land" has a trustworthy answer.

**The honest reading: the merge gate did not fail. It did not exist yet.** Every incident in this
project has become a check within a day of being understood, and that reflex is the practice worth
keeping.

**The gap is not that nothing looks outside the repository -- something does, and it works. The gap
is that what looks outside is not IN here, so nobody inside can see it, count on it, or tell when
it has stopped.** That is the whole of what phases 1 and 2 turned out to be about. It also produced
its own worked example within the hour: on the morning of 2026-09-15 the page check found
`/engcalcs/.claude/hooks/guard-wait-loops.php` returning 500, which is how anybody learned that
`/engcalcs/.claude/settings.json` was served as a plain 200 -- the agent definitions, the hook
scripts and the permission allow-list, readable by anybody. **No check in `check_all.sh` could have
found it and none of the 80 was looking**; `docroot_exposure_check.php` is there now because a cron
job on a server told a human something this repository could not.

---

## 3. Branch naming for "distance from master" — recommended against

Tom asked: *"Do branches need naming conventions indicating their psychological or preparedness
distance from master?"*

**No, and the reason is that the same information is already in a file a hook reads.**
`dev/branch-policy.json` LISTS the branches that need a clearance. A name says *"I intend to be
careful with this one"*; a list says *"you cannot merge this one"*. Only the second is enforceable,
and this project's own evidence is that a rule a machine enforces is worth roughly ten a human must
remember.

Two further arguments against:

- **A name is written once, at the moment of least knowledge.** A branch's distance from master
  changes as it matures; its name does not, and a stale `wip-` prefix on a finished branch is worse
  than none because it is read as current.
- **The tree has already decided this twice in opposite directions** on comparable questions
  (`rel="noopener"`, cookie attributes) and both times the fix was a check, not a convention.

**What to do instead:** keep the existing singular-capability naming (`customer`, `projection`,
`graph`, `custom-property`), and when a branch becomes something that must not land without Tom's
word, ADD IT TO `dev/branch-policy.json`. That is one line, it is enforced, and it can be removed
when the branch is cleared.

---

## 4. Can a merge be gated by script? It already is — here is what is left

Tom asked: *"Can git merge be gated behind scripting that prevents merge to master without proper
protocols and clearances?"*

Yes, and it is (section 2). Three real gaps remain:

1. **A local hook protects a local checkout and nothing else.** Anyone cloning this repository, or
   Tom on another machine, has no hooks until `dev/hooks/install.sh` is run. `hook_install_check.php`
   reports it, but only when the suite is run.
   - **THE FIX WAS GOING TO BE GITHUB BRANCH PROTECTION AND TOM HAS DECLINED IT. DO NOT RE-PROPOSE
     IT.** 2026-09-16, asked directly and given the five steps: *"I'm sorry. I can't bring myself to
     do that."* It is his repository and his call.
   - **The gap that stays open is narrower than this section made it sound**, which is worth saying
     because the ask was put to him on the strength of it: it is a clone, or Tom on a second machine,
     with no hooks installed. On the machine he actually works on, `hook_install_check.php` reports
     an uninstalled hook every time the suite runs, which is most of the protection.
   - **And a gate he worked around would be worse than none** -- this project's own rule, stated in
     §8 below and in `CLAUDE.md`. Turning on a server-side rule that makes every merge a pull
     request, for a one-person repository, is exactly the ceremony §8 warns is paid for every day.
2. **Nothing gates the SIBLING repositories.** `librewaternet.org` and `not-epanet.org` are pushed
   as part of finishing work, with no suite and no hooks. The landing page is the most
   reputation-exposed surface of all three and the least guarded.
3. **The all-clear is recorded by the AI, not by Tom.** `dev/branch-all-clears.json` holds his
   words, but an AI writes the file. That is not a hole a script can close; it is why the pinning
   to a commit matters — the approval lapses when the branch moves, so a forged or stale one
   expires by itself.

---

## 5. The plan, in order, starting 18 September

Sequenced so the highest-value and most mechanical comes first. Each phase is independently useful;
stopping after phase 1 still leaves things much better than today.

### Phase 1 — an uptime watch — DONE, AND IT WAS ALREADY BUILT

**This phase was proposed on a false premise and is closed by bringing the existing watch into the
repository rather than by writing one.** `~/check.sh` already does everything asked for here and two
things that were not:

- **It derives its URL list** from cPanel's own vhost table and from the files on disk, never a
  typed list -- covering 622 pages across all nine domains, where the proposal above named six URLs
  by hand. A typed list is the same silent-staleness bug the watch exists to catch.
- **It reads the BODY as well as the status**, matching a PHP diagnostic's own shape (a keyword, a
  colon, `on line N`) rather than the bare word "Warning", so ordinary page copy does not read as a
  failure.
- It runs daily at 04:20, is SILENT on success, and mails its own failures with an envelope sender
  Gmail accepts.

**Six consecutive days at `failed=0`, and on 2026-09-15 it found a real one** (§2). What was
genuinely missing was not the watch. It was that the watch was invisible from in here, and that its
silence on a good day is indistinguishable from its being dead -- which is phase 2's job, and is
why phase 2 is a HEARTBEAT and not a summary.

**What is still open from this phase, and it is a judgement for Tom:** the watch runs ONCE A DAY, and
the proposal above says "minutes, not days". A 500 on the suite's front door would now be found
within 24 hours rather than within an hour. Whether that is worth a second, lighter run -- six URLs
every fifteen minutes beside the nightly 622 -- is a cost question about a shared host's connection
limits, not a technical one, and nobody has been asked.

### Phase 1a — PROVEN 2026-09-15, and what proving it took

**THE RULE STANDS AND IS THE MOST PORTABLE LINE ON THIS PAGE: an alarm nobody has proven can reach
a human is not an alarm.**

**The count was worse than 800. `~/mail/new` holds 22,907 bounces**, every one of them
`550-5.7.26 ... Gmail requires all senders to authenticate with either SPF or DKIM`. **The cause is
the ENVELOPE SENDER, which `MAILTO` gives no way to set**: cron sends as
`jconstru@minter.nocdirect.com`, a host publishing no SPF record at all. **Pointing `MAILTO` at the
`tom@hawsedc.com` forwarder does NOT fix it** -- measured 2026-09-08 -- because forwarding preserves
the original envelope sender and the second hop is refused for the same reason. `~/cronmail.sh`'s
`sendmail -f tom@hawsedc.com` is the fix; `hawsedc.com` does publish SPF covering that IP.

**Proven end to end 2026-09-15:** a message sent through `cronmail.sh` arrived in the destination
inbox, flagged important, not in spam and not bounced, and Tom said so unprompted in the same hour
-- *"I got an email from cron. It is the second email that reached me this week from cron."* The
first was the page check's own alarm at 04:21, which is the better half of the proof: the ALARM
reached him, not just a test.

- **`sendmail` exiting 0 proves nothing.** It exited 0 during all 22,907 of those bounces. Confirm
  arrival at the far end, or do not claim the path works.
- **Bounces since the fix: one, dated the day of the fix itself.** Nothing since.
- **The 22,907 historical bounces are still sitting there and the account is at 96% disk.** Nobody
  has cleared them; the daily report counts them, and a FRESH one is called out by name, because a
  new bounce means an alarm may have stopped reaching anybody.
- The DMARC monitoring window still opens 2026-10-04 and reporting mail must not damage the domain's
  sending reputation. Nothing here sends to anyone but Tom.

### Phase 2 — the report — BUILT 2026-09-15, DAILY AT 20:00, and it is a HEARTBEAT

Tom: *"it would be reassuring for me to get a weekly email every Friday night or Saturday morning
reporting to me key statistics and statuses."* Then, 2026-09-15, the sentence that decides the
design: *"A weekly report is exactly the superpower of the entire failure monitoring plan. It's Tom
saying every Friday night at 8:00 or whatever, 'Yep. There's my report. Cron is still up and
working.' If you want to do it every day at 8:00 for a while, that's fine too."*

**SO THE REPORT ARRIVING IS THE SIGNAL, AND THAT CLOSES A HOLE THE ALARM CANNOT.** `check.sh` is
deliberately silent on success -- correct for an alarm, and it means a healthy site and a dead cron
look identical from the inbox. One of them had in fact been dead for years. **A report that arrives
unconditionally is the only thing that tells them apart.** It therefore mails on EVERY run, every
day at 20:00 on his own offer of the faster cadence, and `dev/scripts/daily_report.sh` says so in
its first three lines so the reader knows what the arrival means.

**A section that cannot be measured says NOT MEASURED in capitals and does not fail the report.** A
report that dies because one number was unavailable is a report that stops arriving, which is the
failure this whole task is about. `dev/host/daily-report-cron.sh` mails even when the report script
itself is missing, for the same reason.

**And it states its own limits every single day rather than once in a README:** there is no `node` on
the host, so no harness and therefore no `check_all.sh` can run there, and the report says which
numbers it did not take.

Everything it carries is computed by a script or by `git`; the work was assembling and delivering,
not measuring. Contents and sources:

| Line | Source |
|---|---|
| Uptime for the week, per URL | phase 1 |
| What merged to master, by branch | `git log --first-parent --merges` |
| Every live branch, its age and distance | `branch_hygiene_check.php` |
| Suite status on master | `check_all.sh` exit code |
| Open deploy blockers and the current freeze | `dev/session-handoff.md` top block |
| Production SHA vs master | `git rev-parse` in both checkouts |
| English keys awaiting a ruling; untranslated count | `new_english_keys.php` |
| Unanswered translator findings | `friction_check.php` |
| Usage for the week | `log/lang-log-stats.sh` |
| Advisory checks that are grumbling | **NOT CARRIED.** It needs `check_all.sh`, which needs `node`, which the host has not got. Stated in the report rather than faked |
| Bounces in the mail spool, and any fresh one | the one number that says whether the report can still be delivered |
| Disk free | the account is at 96%, and 22,907 of those bounces are why |

**One discipline, and it is the important one: every number must be DERIVED by a script, never
narrated by an AI.** A weekly report written in prose by the same system that made the mistakes is
not evidence; it is a second opportunity to be confidently wrong. The report should be boring,
numeric, and identical in shape every week, so a changed number is visible without reading.

### Phase 3 — CLOSED 2026-09-17, one leg built and one leg declined

- **GitHub branch protection for `master` is DECLINED and is no longer an ask.** Tom, 2026-09-16:
  *"I'm sorry. I can't bring myself to do that."* It is his call. The gap it would have closed is
  narrow — a clone, or another machine with no hooks — and `hook_install_check.php` already reports
  that state on every suite run. **A gate he works around would be worse than none**, which is this
  project's own rule. The FACT that the gap exists stays true; the ASK is struck. Do not re-propose.
- **The sibling pre-push is BUILT AND INSTALLED in both repositories** (verified 2026-09-17):
  `~/webdev/librewaternet.org/.git/hooks/pre-push` and the same file in `~/webdev/not-epanet.org`
  refuse a push unless `sh check.sh` passes. It RUNS the suite rather than reading a stamp, which is
  a deliberate difference from engcalcs: `check.sh` is under two seconds there, so running it is
  cheaper than the machinery for not running it, and there is no stale state to get wrong. It is a
  copy in `.git/hooks`, not `core.hooksPath`, for the reason measured here — hooksPath resolves into
  the working tree, so a checkout from before the hooks existed deletes every guard, failing open
  and silently.

### Phase 4 — the portable kit

Only after phases 1–3 have run for a week or two and proved themselves here.

---

## 6. What is portable to the other projects, and what is not

Tom: *"Whatever we do with great success should be portable to my other projects like
`C:\TGHFiles\programming\misclisp\freeland\Turning_Path_Tracker`."*

**Portable, and worth copying more or less as-is:**

- **The two git hooks and their installer.** The argument for a COPY in `.git/` rather than
  `core.hooksPath` is universal, and the failure it prevents (a checkout silently deleting its own
  guards) is not specific to anything here.
- **`check_all.sh`'s SHAPE** — one command, blocking versus advisory, each check explaining its own
  failure, and a table in the project's own `CLAUDE.md` that a parity check holds against the
  script. The CHECKS themselves are almost all specific to this suite; the shape is not.
- **The roadmap discipline** — one ID namespace, open tasks in one file, a closed-ID ledger so a
  cited `Task N` still resolves, and a script proving IDs are unique and priorities are on-tier.
  This is the cheapest thing on the list and it pays immediately on any project with a backlog.
- **`dev/session-handoff.md`** — a STOP block a cold session reads before anything else. This is
  the artifact whose absence cost the six merges, and every AI-assisted project has the same hole.
- **The uptime watch**, for any project that serves a URL -- and it needs no porting at all.
  `~/check.sh` derives its list from the SERVER's own vhost table, so every domain on the account is
  already covered the day it lands, `hawsedc.com/gnu` and Turning_Path_Tracker included. **The thing
  to copy is not the script; it is the habit of keeping it in a repository.** It was invisible from
  inside this project for six days and a plan was written proposing to rebuild it.
- **`cronmail.sh`, and the rule above it.** Two lines of shell, and without them every alarm on the
  account was silently refused for years. Any project whose cron mails a human has this bug until
  somebody proves otherwise by reading the far end.
- **The incident reflex**: every incident becomes a check the same day, and the check's comment
  records the incident. This is a habit, not code, and it is the single most valuable thing this
  repository does.

**NOT portable, and copying it would be cargo cult:**

- Anything about 27 languages, translation sprints, glossaries or friction logs.
- The unit-family machinery, the coordinate seams, the label placement work.
- The volume of prose in `CLAUDE.md`. It is long because this suite is large and old; a Lisp
  utility with one author does not need a 1,400-line guide and would be poorly served by one.

**Recommended first move for Turning_Path_Tracker on 18 Sep:** the roadmap discipline and the
session-handoff file. Both are text files and an afternoon. Hooks and checks only once there is a
build worth gating.

---

## 7. Five Claude Code installs — advice

Tom's locations:

| Where | What |
|---|---|
| WSL Ubuntu, `~/webdev/hawsedc.com/engcalcs` | this suite, and the two sibling sites |
| `P:\NPS-Resource\Tools\Software\Invoicing` | NPS Billing Helper |
| `C:\TGHFiles\tghpe\AI-help` | engineering review |
| `C:\TGHFiles\programming\hawsedc\develop` | hawsedc and CNM AutoCAD customization |
| `C:\TGHFiles\programming\misclisp\freeland\Turning_Path_Tracker` | one of many under `misclisp` |

**The advice, in order of how much time it saves:**

1. **Do NOT try to share memory or context between them.** Each project's memory is keyed to its
   path and is mostly project-specific; merging them would mean every session loading facts about
   four projects it is not working on. What should travel is PRACTICE, not knowledge.
2. **Keep one kit directory and copy FROM it, deliberately.** A small repository — hooks, the
   installer, a `check_all.sh` skeleton, the roadmap scripts, a `session-handoff.md` template — that
   each project copies from when it is ready. Copying is better than sharing here: a project that
   vendors its kit can diverge without breaking the others, which is the same argument
   `vendor_integrity_check.php` makes about third-party code.
3. **One project at a time, and only when it hurts.** Four of the five do not have this project's
   problems. Installing this project's ceremony into a Lisp utility would cost real time and
   prevent nothing.
4. **Consolidate the two `hawsedc` locations if they are the same work.** `~/webdev/hawsedc.com`
   (WSL) and `C:\TGHFiles\programming\hawsedc\develop` — if both touch the same site, two AI
   installs with two memories will contradict each other. Worth an hour to decide which is
   authoritative. (Note the memory: moving a checkout ORPHANS its memory directory, because it is
   keyed to the path. Copy it deliberately if either moves.)
5. **On sharing with Anthropic**: their consent prompts are about model improvement, not a route
   for practice to reach other people. If these patterns are worth sharing more widely, the honest
   channel is writing them up publicly — and this project already has an outreach track
   (`dev/outreach-venues.md`).

---

## 8. What NOT to do

Recorded because the pull after an incident is toward ceremony, and ceremony is paid for every day
by every future session:

- **No approval step that a person must perform on ordinary work.** The gate is for the four
  capability branches; a defect track still merges on green. A gate that stops all work is a gate
  somebody switches off — which is already written in `CLAUDE.md` and is worth restating here.
- **No checklist that duplicates a check.** If it can be a script it must be a script; if it cannot,
  writing it down as prose has a measured success rate near zero in this repository.
- **No status report written in prose by an AI.** Numbers from scripts, or nothing.
- **No new branch vocabulary** (section 3).
- **No retrospective sweep.** Every rule here is a RATCHET on new work. Going back to re-do finished
  work to a new standard is how a two-day task becomes a fortnight, and this project has the
  measured example: rewriting 60 shipped strings to remove em dashes would have bought 1,560
  retranslations of text whose meaning had not moved.

---

## 9. The one-line summary

**The reputation damage came from four silent outages, not from the merge -- and the merge is
already guarded.**

**Corrected 2026-09-15, the day this was written: the URLs were already being watched, and the plan
could not see it because the watch was not in the repository.** So the work was not to build one. It
was to bring it in here where it can be counted on (`dev/host/`), to PROVE the mail path instead of
assuming it (done, at the far end, with Tom confirming), and to add the one thing an alarm silent on
success cannot do -- **arrive anyway, every day, so that silence stops being ambiguous.**

Still genuinely open: whether the 622-page watch also wants a six-URL run every fifteen minutes
(§5 phase 1), and then the portable kit. **§4 gap 1 is declined by Tom and gap 2 is built**, both on
2026-09-17 — see phase 3 above.

**And the thing this plan never named, which he asked for on 2026-09-17: a RELEASE BRANCH.** *"If we
have a system to manage releases while keeping master as an active trunk, I want to see it in use.
Where is the EWB release branch in case hot fixes are needed today?"* It is `release/ewb`, cut from
`81792180` — the SHA he had deployed — and pushed the same day. **That is the honest answer to the
freeze**, which this plan had treated as the instrument for holding the line: a freeze stops
everybody, a release branch stops nobody. The procedure is in `CLAUDE.md`'s Git Workflow, together
with the correction of the 2026-09-13 advice that a clean release could not be extracted from what
had been merged. **That advice was wrong, it was never owned, and leaving it unowned left him
believing he had to choose between shipping unfinished work and shipping nothing.** **Nothing else on this page is urgent, and the
sharpest lesson on it is not in the plan at all: a diagnosis written from inside one tree could not
see a working machine sitting one directory outside it.**
