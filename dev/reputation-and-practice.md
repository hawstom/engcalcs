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

This is the class worth spending on, and it is the class the current tooling does not touch at all.
`check_all.sh` is 80-odd checks about the CONTENTS of this repository. Not one of them asks whether
the site is up, because from inside the repository that question is unanswerable.

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
keeping. The gap is not discipline inside the repository; it is that nothing looks OUTSIDE it.

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
   reports it, but only when the suite is run. **Fix: GitHub branch protection on `master`** — a
   server-side rule no local checkout can bypass. Free, five minutes in the repository settings.
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

### Phase 1 — an uptime watch (the one that would have caught the real damage)

A script that fetches a small list of URLs and reports anything that is not 200, run by cron on a
schedule measured in minutes, not days.

- The list: `hawsedc.com/`, `hawsedc.com/engcalcs/`, `librewaternet.org/`, `librewaternet.org/app/`,
  `not-epanet.org/`, and one calculator page deep enough to exercise PHP and the language layer.
- It must check the BODY, not only the status: `librewaternet.org` returned a 500 with a page, and
  a fatal PHP error can arrive inside a 200.
- **It must be able to tell Tom.** See the dependency below.

**This is phase 1 because three of the four silent failures were a non-200 on a URL, and the fourth
was the mail path this phase depends on.**

### Phase 1a — THE DEPENDENCY NOBODY SHOULD SKIP: prove the mail path works

**Cron mail on this account was dead for YEARS and produced 800+ bounces.** A weekly report and an
outage alarm are both worthless if they are posted into that. So before either ships:

- Send one test message by the exact path the reports will use, and confirm it ARRIVES — not that
  the command exited 0.
- Note the DMARC work already in flight (`~/.claude` memory: a monitoring window opens 2026-10-04).
  Reporting mail must not be the thing that damages the domain's sending reputation.
- Prefer a channel whose delivery can be verified over one that merely does not error.

**Write this down as a rule: an alarm nobody has proven can reach a human is not an alarm.**

### Phase 2 — the Friday report

Tom: *"it would be reassuring for me to get a weekly email every Friday night or Saturday morning
reporting to me key statistics and statuses."*

Everything it should carry is ALREADY computed by a script in `dev/scripts/`; the work is
assembling and delivering, not measuring. Proposed contents, each with its existing source:

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
| Advisory checks that are grumbling | `check_all.sh` NOTE lines |

**One discipline, and it is the important one: every number must be DERIVED by a script, never
narrated by an AI.** A weekly report written in prose by the same system that made the mistakes is
not evidence; it is a second opportunity to be confidently wrong. The report should be boring,
numeric, and identical in shape every week, so a changed number is visible without reading.

### Phase 3 — close the two remaining merge gaps

- Turn on GitHub branch protection for `master` (section 4, gap 1).
- Give the two sibling repositories at least a pre-push that refuses a push when their own minimal
  checks fail. They have no suite today; even "the HTML parses and the claim-check passes" is more
  than nothing, and `public_claim_check.php` already exists here.

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
- **The uptime watch**, for any project that serves a URL. `hawsedc.com/gnu` serves
  Turning_Path_Tracker, so it belongs on the same list rather than getting its own system.
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

**The reputation damage came from four silent outages that no machine was watching, not from the
merge — and the merge is already guarded. So: prove the mail path, watch the URLs, send a derived
weekly report, and copy the roadmap discipline and the handoff file to the other projects. Nothing
else on this page is urgent.**
