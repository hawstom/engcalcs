# Git workflow — full record

Moved verbatim out of `CLAUDE.md` on 2026-09-23 when that file was compacted. CLAUDE.md keeps the
short rule and points here; this file keeps the reasoning, the quotes and the measurements.

## Git Workflow

**Commit and push by default, without asking, at the end of every piece of work.** This overrides the
general assistant default. The only exception is Tom explicitly saying to leave something
uncommitted; silence means commit and push.

- **`master` IS THE PRODUCTION LINE AND NOBODY WORKS ON IT** (Tom, 2026-09-12, retooling the
  paradigm: *"Master as sacred production line lets us work more happily merging all the while into
  and from master at will... I am eager for the freedom of branches."*). **Every change starts on a
  branch, however small, and reaches master only by a merge somebody decided to make.** Branches are
  cheap; that is what they are for.
  - **A RELEASE BRANCH IS HOW THE LINE IS HELD, AND A FREEZE IS NOT** (2026-09-17, on Tom's own
    question: *"Where is the EWB release branch in case hot fixes are needed today?"*). Trunk-based
    development cuts `release/<name>` from the SHA production is actually running; that branch takes
    **only** fixes, while master goes on taking whatever is finished. He deploys by `git pull`, so
    he already has most of this for free -- the thing a freeze was protecting against is that **you
    cannot pull half of master**, and a release branch is a half of master you CAN pull.
    - **`release/ewb` EXISTS AND IS CUT FROM `81792180`**, the SHA he had deployed. A hotfix during
      a held window is: branch off `release/ewb`, fix, `check_all`, merge to `release/ewb`, push,
      and he pulls THAT. The same fix is then merged to master separately. Nothing on master needs
      to stop, and nothing unfinished rides along.
    - **AND THE 2026-09-13 ADVICE THAT A CLEAN RELEASE COULD NOT BE EXTRACTED WAS WRONG.** Tom
      complained the day `projection` reached master and was told extricating a clean release from
      what had been done was impossible; he was later told cherry-picking a release branch off
      master is a matter of course. **Both cannot be true and the second one is right.** The first
      projection merge is `06a1deab`; every commit before it is projection-free, so a release could
      have been cut from any of them and the fixes he wanted cherry-picked on. **That was never
      owned, and it is owned here**: the bad merge was one mistake and the advice that it could not
      be undone was a second, larger one, because it left him believing he had to choose between
      shipping unfinished work and shipping nothing.
  - **SACRED MEANS ONE TESTABLE THING: master is pullable at any moment.** `sh dev/scripts/check_all.sh`
    passes on the MERGE RESULT before the merge is pushed -- not on the branch beforehand, which is a
    different tree. A red master is a production outage waiting for whenever Tom next pulls.
  - **THIS SUPERSEDES "work directly on master, no feature branches", and WHO ARGUED WHICH SIDE is
    the part to keep.** The original rule was inferred from an observation -- Tom worked on master,
    therefore branching practice did not apply here -- and that inference was AI's, not his
    instruction. **He then questioned it twice and was talked out of it twice**, on a STALE REFS
    argument and a CONCURRENCY argument, neither of which answers the release one. His own account,
    2026-09-12: *"I knew better, but I am not very assertive. Why fight CC when it's moving
    forward."* What finally decided it: **you cannot pull half of master.** With features landing on master, a fix during a frozen window ships every
    unfinished thing beside it, so the whole team stops. With master sacred, a fix is a two-commit
    branch and everyone else keeps working -- Tom: *"most of the company doesn't care about EWB,
    because they are still working hard on projection at projection-custom-property."*
  - **THE STALE-REF FAILURE IS REAL AND IS NOW A CHECK, not a promise.** `branch_hygiene_check.php`
    lists every branch with its age, its distance from master and whether it is merged. It is
    ADVISORY -- when a branch should die is judgement -- but it means an abandoned branch is
    reported rather than discovered a year later. **Merged or killed, never left to rot.**
  - **A BRANCH NAMES ITS CAPABILITY, IN THE SINGULAR, in the database tradition** (Tom, 2026-09-12):
    `customer`, `projection`, `graph`, `custom-property`. He renamed all four the day they were
    made, and the reason outlives the convention: three were plural because plural is what gut feel
    produces, and when the fourth came out singular the others were left alone on the argument that
    a projection list "is not a database entity" -- gut feel wearing a reason's clothes. *"It's not
    a reasoned exception. If we are plural here, we should be plural everywhere. Gut feel is not a
    good reason."* A UI label naming a real collection is a separate question decided on its own:
    the Water menu's **Graphs** submenu holds five different graphs and stays plural, which Tom
    allowed in the same breath -- *"Public-facing menu is plural and natural and gut feely."*
  - **AND THE GENERAL LESSON, which is not about git: WHEN TOM QUESTIONS A STANDING RULE TWICE,
    THE RULE IS THE SUSPECT -- not the question.** He is not very assertive and will not fight a
    session that is moving confidently forward; an AI that keeps producing a reasoned-sounding
    defence will therefore win every time, including the times it is wrong. Three weeks of a
    paradigm he never wanted is what that cost here. **A repeated question is evidence. Re-argue the
    rule from scratch, out loud, and say plainly which parts of the original reasoning do not
    address what is being asked** -- as the concurrency argument did not address release safety.
  - **MERGE FROM MASTER OFTEN. INTO MASTER ONLY WHEN TOM SAYS A CAPABILITY BRANCH IS DONE.** A
    long-lived branch that never takes master back is a merge conflict being saved up, so the first
    half is unchanged. **The second half used to read "into master when done" and that sentence cost
    six unasked merges in one session on 2026-09-13** -- it never said WHO decides done, and the AI
    read its own green build as the answer. Tom: *"Really you should never merge a major branch to
    master without my all-clear on completion."*
    - **GREEN IS NOT DONE, and this is the distinction the old wording lost.** `check_all.sh` says
      the code works. It cannot say whether the FEATURE is finished. Every one of those six merges
      was green; `projection` went in without the projection universe he had asked for TWICE, and
      `custom-property` with a validator that does not validate and that he never asked for. No
      suite can see either.
    - **A DEFECT TRACK STILL MERGES ON THE OLD RULE** -- green on the merge result, and push. The
      gate is only for a branch listed in `dev/branch-policy.json`, because a gate that stops all
      work is a gate somebody switches off.
    - **AND SINCE 2026-09-15 THERE ARE TWO LOCKS, BECAUSE TOM'S APPROVAL IS NOT THE ONLY ONE.** He
      asked: *"Remember that we are in a feature freeze. I will test. But even if I were to approve
      a merge, the scripts must block it until the freeze is removed. Right?"* **As built the answer
      was NO** -- an all-clear was the only lock, so his approval and the freeze were one key turned
      twice. `feature_freeze.active` in `dev/branch-policy.json` is the second: it refuses a merge of
      a `protected` branch **even with a correctly pinned all-clear on file**, and his approval keeps
      standing until the freeze lifts. **Only he lifts it.**
      - **IT IS NOT `freeze.active`, AND THE DIFFERENCE IS THE WHOLE POINT.** That one is an
        EMERGENCY STOP refusing every merge but a `hotfix:`, and switching it on cost a full day of
        bug fixes he was waiting for. `feature_freeze` refuses only what `protected` already names,
        so **a defect or tooling track merges untouched** -- `branch_policy_selftest.php` case 8c
        asserts exactly that, and it is the case that matters most.
    - **IT IS A CHECK NOW, NOT THIS PARAGRAPH.** `dev/hooks/pre-merge-commit` refuses the merge;
      `dev/branch-all-clears.json` records his exact words pinned to the commit he cleared, so the
      approval LAPSES BY ITSELF when the branch moves, exactly as a ruling in
      `dev/english-key-rulings.json` lapses when the English changes. A FREEZE in
      `dev/branch-policy.json` stops every merge but a `hotfix:`, which is how development continues
      while the production line holds still.
    - The four capability branches are large, speculative and abandonable, which is what a branch is
      genuinely for -- and is exactly why finishing one is a judgement about the product rather than
      about the build.
  - **THEY SHARE SEAMS, so read the worktree rule below before running two of them at once.**
    `graph` and `custom-property` both write the bottom pane's tab strip; `custom-property` and
    `customer` both add fields to the Properties box and to Find; `projection` and `customer` both
    place things by coordinate. Two in flight together is the five-defect shape
    `scenario_seam_check.php` exists because of -- name the seam in both briefs, or sequence them.
  - **CONCURRENT SESSIONS NOW REQUIRE A WORKTREE, and this is the change that bites.** Under the old
    paradigm two sessions shared one checkout and both sat on master, needing only explicit staging.
    **One checkout can only be on one branch**, so a second session that checks out a different
    branch rewrites the files under the first one. A branch does not isolate concurrent sessions --
    it never did, which is what the old rejection got right -- so the worktree rule below stops being
    a subagent convenience and becomes how two sessions coexist at all.
- **Stage explicit paths. Never `git add -A`** — Tom runs concurrent sessions in the same working
  directory, and a broad add commits their in-progress work under your message.
- **Report the push state unabridged and unprompted:** the commit SHA, and that
  `git log --oneline origin/master..master` is empty. Never tell Tom to `git pull` before verifying
  the push landed.

### Every AI commit is authored "Claude Code for Tom Haws" (Tom, 2026-09-08)

**`git commit --author="Claude Code for Tom Haws <tom.haws@gmail.com>"` on every commit an AI
makes**, in a worktree or on `master`. Tom: *"I would like some way to distinguish my own commits
from those done by Claude Code."* The committer stays Tom, so nothing about push rights or
attribution to the account changes; `git log --author="Claude Code"` and `git blame` tell the two
apart. The trailer line is not enough because `blame` does not read trailers.

### Commit messages: subject only by default (Tom, 2026-08-16)

**Write a subject line of ≤72 characters and NO body.** Add a body only when a future reader would
genuinely act differently without it; when one is warranted, ≤40 words.

Measured in this repo: Tom's own oldest 300 commits had no body 68% of the time and a median of 84
total words. The AI era wrote a body on 99 of the last 100 commits at a median of 297 words. Normal
human OSS practice is a 50–72 char subject with no body about half the time. The bloat is entirely
in bodies, and it is expensive because it makes `git log` unreadable.

The reasoning, the rejected alternatives and the quotes belong in the code comment or the roadmap
block, where people actually look for them. End with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

### Worktrees: how two workers coexist in one checkout

- **A worktree is justified by CONCURRENCY, never by caution.** One worker alone needs only a
  branch; a second worker at the same time needs a worktree, because one checkout holds one branch.
- **The orchestrator merges promptly and deletes the branch** as each track lands. A worktree branch
  outliving its agent is the stale-ref problem by another door.
- **Give concurrent agents disjoint file territory, and say so in the brief.** Two tracks that both
  need `js/looped-network.js` are sequential work in a parallel costume.
- **Disjoint files are not enough — tracks also share SEAMS.** Two tracks with perfectly disjoint
  files once produced five user-reachable defects because both wrote element properties and only one
  knew about `setProp()`, the single write seam. **When two tracks share a CONCEPT — a write seam, a
  resolver, a single source of truth — either sequence them, or name that seam in BOTH briefs and
  require each to say how it goes through it.** `dev/scripts/scenario_seam_check.php` guards that
  particular one.
- **Subagents commit inside their worktree and never push.** Pushing is the orchestrator's, after
  the merge and after `check_all.sh` passes on the merged tree.
- **A SUBAGENT NEVER REGENERATES `dev/translation_payloads/`. The orchestrator does, once, before
  the commit** (Tom, 2026-08-25: *"Regenerate only at the orchestrator sounds like the right
  answer to me."*). The generator rewrites all 27 files, so two tracks that each add one language
  key produce a 27-file conflict on every merge — measured on 2026-08-25, twice in one session, and
  it resolves only by regenerating anyway. **A subagent that adds a key says so in its report and
  leaves the payloads alone**; if its own `check_all.sh` then reports `payload freshness`, that
  failure is EXPECTED and is not its to fix.

---

