# Git, repositories and web deployment: where we are and what to change

Written 2026-09-13, answering Tom's question: *"How would a senior software project manager advise
about ways to organize our git repositories, projects, and web deployment? Intuitively, I would
think (right or wrong) that we want web under repository, or in other words, the repositories fully
transcendent of web sites."*

## The headline: that intuition is right, and it is already built

**It was true that the repository sat inside an untracked web root. It stopped being true on
2026-09-13.** The tree today is four repositories, three of which ARE their own document root:

    ~/webdev/
      hawsedc.com/            git@hawstom/hawsedc.com     DocumentRoot hawsedc.local
        engcalcs/             git@hawstom/engcalcs        nested; parent ignores it
      librewaternet.org/      git@hawstom/librewaternet   DocumentRoot librewaternet.local
      not-epanet.org/         git@hawstom/not-epanet      DocumentRoot not-epanet.local
      worktrees/
        <branch>/engcalcs/    a worktree of engcalcs      DocumentRoot worktrees/<branch>

So "web under repository" is the current design, not an aspiration. Nothing needs reorganizing to
achieve it. **The question that is genuinely still open is the one nested repository.**

## The one real anomaly: `engcalcs/` inside `hawsedc.com/`

`hawsedc.com`'s `.gitignore` carries `engcalcs/` — with the trailing slash, and the comment beside
it records why: `engcalcs*` without the slash over-matched `engcalcs-parent-hooks.php`, a real file
of the parent site that no repository had ever tracked. That is a good fix and the boundary holds
today.

But it is a boundary maintained by ONE LINE in a file anybody can edit, between two repositories
that are on GitHub. That is the thing worth deciding about, and there are exactly three options.

### Option A — keep the nesting, keep the ignore (status quo)

**Cost:** the boundary is one line. Delete it and the parent repository swallows 1,452 files that
already have their own history and their own origin, and the first symptom is a very large `git
status` that somebody might `git add` past.

**Benefit:** it costs nothing today and it is what the indexed URL `hawsedc.com/engcalcs/` resolves
through, by plain filesystem nesting, with no server configuration at all.

### Option B — make `engcalcs` a submodule of `hawsedc.com`

**This is the textbook answer and I recommend against it.** A submodule pins the child at one commit
in the parent's history, which is only worth paying for when the two genuinely version together.
They do not: the suite is served at TWO domains and is deployed on its own schedule. Recording "this
version of hawsedc.com goes with that version of engcalcs" would assert a coupling that is not real.

The costs are concrete and land on Tom personally: every clone needs `--recursive`; a submodule
checks out at a detached HEAD by default, which is precisely the state that loses work; and
deployment stops being `git pull` and becomes `git pull && git submodule update --init --recursive`.
**A deploy step somebody can forget is a deploy step somebody will forget.** Reject.

### Option C — move `engcalcs` to a sibling and serve it by Alias at BOTH mounts

    ~/webdev/
      engcalcs/               its own repository, nested in nothing
      hawsedc.com/            Alias /engcalcs -> ~/webdev/engcalcs
      librewaternet.org/      Alias /engcalcs -> ~/webdev/engcalcs   (ALREADY EXISTS)

**The argument for this is not tidiness. It is that the current asymmetry has already shipped
defects, twice, and both took Tom clicking a link to find.**

`librewaternet.org` reaches the suite by `Alias` plus an `/app/` rewrite; `hawsedc.com` reaches it by
filesystem nesting. The suite is therefore served at two addresses whose *shapes differ*, and the
HTML is byte-identical at both — so no renderer in this repository can see the difference. That is
the exact root cause recorded for two blocking checks now in `check_all.sh`:

- `nav_link_absolute_check.php` — 1,275 nav links were relative, correct on the nesting mount and
  **dead at `/app/`**, because a rewrite is not a directory. A third of the navbar was broken at the
  suite's own front door from the day the rewrite shipped until 2026-09-09.
- `js_page_url_check.php` — the same defect in a second construct. The navbar was fixed on 09-09 and
  the Help menu beside it stayed broken until 09-12.

Under Option C both mounts are Aliases. "This suite is served at more than one address, and none of
them is its directory" stops being a surprise and becomes the visible shape of the tree. **That is
worth more than the checks, because a check finds a defect and a structure prevents the class.**

It also makes the worktrees honest. Today a worktree is `worktrees/<branch>/engcalcs` with the
PARENT directory standing in as a fake document root purely so `/engcalcs/…` resolves. That is a
clever hack that models production's nesting. Under Option C a worktree is just `worktrees/<branch>`,
Aliased — identical in shape to production and to the main checkout, with no stand-in directory.

**Cost, and it is the one that matters:** `hawsedc.com/engcalcs/` is the indexed address carrying the
whole search history. `dev/hosting-layout.md` says no version of any plan is worth breaking it. An
`Alias` is transparent to the URL, so the risk is a configuration error rather than a design flaw —
but it is a configuration error on the live site, and it must be made on the production host as well
as here. **`Options -Indexes` in `.htaccess` needs `AllowOverride Options`, and where that grant is
missing Apache returns 500 for every request under `/engcalcs/`** — so this change has a known way to
fail closed and take the whole suite down.

## What I actually recommend

**Destination: Option C. This week: Option A, untouched.**

Do not reorganize three days before the EWB demonstration. The benefit is structural and compounds
over months; the risk is a 500 on the live suite, and the demonstration is on 2026-09-16. Move after
it, deliberately, on a day with nothing else happening.

Two things worth doing NOW, because neither touches serving:

1. **Make the boundary a check, not a line.** Every rule in this project that became a script stopped
   being violated; every rule that stayed prose kept being violated. A four-line check asserting that
   `hawsedc.com`'s index does not contain `engcalcs/` is cheap and permanent. Prose already failed
   once here — that is what the `engcalcs*` over-match was.
2. **Correct `dev/hosting-layout.md` §5.** It still describes the symlink layout
   (`~/webdev/engcalcs/hawsedc.com -> /var/www/cnm/public_html/hawsedc`) that the 2026-09-13 move
   replaced. It is the document a future reader consults before touching hosting, and it is wrong.

## The question underneath the question: cloning an external repository

Tom blocked the Task 638 upstream contribution on this: *"This probably will require cloning another
repository, which I consider to be blocked until we resolve my Git repository organization task."*

**It is not blocked, and no reorganization is needed to unblock it.** The rule is one sentence:

> **`~/webdev/` is for things we SERVE. An external repository we read or contribute to is not one
> of those, and does not go there.**

Clone upstream work to `~/src/<project>` instead. It is not a document root, it is not on any vhost,
it cannot be served by accident, and it is not inside any repository of ours — so no `.gitignore`
line is load-bearing and there is nothing to get wrong. `epanet-js` and OWA-EPANET would live at
`~/src/epanet-js` and `~/src/EPANET`.

That distinction — **serve it, or merely read it** — is the whole of the organizing principle, and it
is the same principle that makes Option C right: `~/webdev` holds sites, and the suite is not a site.
