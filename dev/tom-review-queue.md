# Tom's review queue

**EVERY LINE HERE IS SOMETHING TOM TYPED AFTER A BROWSER PASS, AND IT STAYS UNTIL IT IS CLEARED.**
His instruction, 2026-09-19: *"Always ensure that my review comments are not lost until they are
cleared/addressed. These reviews, while they are enjoyable, nay, even fun, cost me a lot of time and
focus."*

A browser pass is the one thing in this project nothing can automate and nobody else can do. It is
also the input most easily lost: it arrives as prose in one message, gets partly acted on by one
session, and the remainder lives only in that session's context. Three of his items had already been
answered by a session that then dropped the rest. **This file is where they live instead.**

## Format

```
- [x] R-042 branch/name | his words, verbatim or near -- Task 699 added at priority 75
```

- `[ ]` OPEN -- nobody has acted on it.
- `[x]` DONE -- shipped. Append `-- <sha or branch>` so the change is findable.
- `[?]` ANSWERED-BACK -- it needs something from Tom before anybody can act. Append the question.
- `[-]` DECLINED -- with the reason, in one line. **Only Tom declines his own item**; an AI writing
  this marker without his word is the failure this file exists to stop.

**Quote him. Do not paraphrase into our vocabulary** -- the handoff's own trap list says so, and a
paraphrase is how "put station and offset in Find" becomes "improve Find". `review_queue_check.php`
reads this file, prints every OPEN row, and fails only on a malformed one; deciding an item is
judgement and does not belong to a script.

**An ID is permanent and never reused.** Next free: R-153.

---

## Round of 2026-09-19 -- his second pass over the five branches

### Workflow and standing answers

- [ ] R-004 -- | "A name given once for one purpose becomes a standing per-browser label": Confirmed. And we are adding "Not you? Change this" opportunities. -- Task 698 ruled; his answer to handoff decision 9
  - TGH testing 2026-09-18 22:01 UTC · 37f05c7e: (1) The banner message about "We asked your colleague to close the file" disappeared too fast and unrecoverable "Help! What did I miss!" We need a better messaging system. We talked about the QGIS system. Maybe open a feature branch for Error and notice messaging system.
  - TGH 2026-09-22 I hope to test later.

### Standing work he named

- [ ] R-043 -- | I still need to test (and admire) label placement, solver bar, etc.
- [x] R-044 -- | The label work is a debugging job he has forbidden papering over, and "let labels look further" is ranked third, behind the switchboard and the sector question. -- carried from the previous session; the three handoff decisions remain his

## Round of 2026-09-21 -- after two days of his own testing

- [x] R-070 -- | Site check: why am I getting this? I thought I was getting only an email at 8:00 every day. -- **ANSWERED, and the failure is spurious.** Two different cron jobs. The 8:00 one is the DAILY REPORT (22:00 CDT on the server, which is 20:00 in Phoenix). The 2:22 AM one is the PAGE CHECK (04:20 CDT = 02:20 Phoenix), and **it mails only when something is wrong** -- so receiving it at all means a failure. The failure is `https://librewaternet.org/tools/build-chrome.php HTTP 403`, and **403 is the correct and desired state**: that directory is the remote-execution exposure closed on 2026-09-18. **The server's copies of the check config are STALE.** This repository excludes the whole `/tools/` directory and asserts it unreachable in `check.mustblock`; the server's `~/check.exclude` names only `build-features.php` and its `~/check.mustblock` names neither. `host_script_parity_check.php` reports both as DIFFERS. One command from him fixes it
- [ ] R-075 feat/label-gang-search | I am never going to be happy until I can add 12345678 to the node ID prefix without moving or hiding any of the labels shown. Any such moving or hiding is a blatant bug since adding that string **however** causes no conflicts with anything all the way to Japan. May as well not dodge it, hide it, or paper over it. Find out why it's happening and fix the bad rules.
- [ ] R-076 feat/label-gang-search | Switching to the all-round search halves the vanished labels: yes, but at what performance cost? My hope is to move as much as possible of our calculation burden to a pre-calculated model that applies across zooms, so nodes have a lookup table for where they can expect an optimal place for their label at a range of zooms.
- [ ] R-077 feat/label-gang-search | The four corner positions: I assume they are relatively cheap, and that we can record the zoom at which they are no longer effective (and clear that when Symbology or Appearance is changed?).
- [ ] R-078 feat/label-gang-search | Based on the switchboard, I guess spot route is not yet programmed since it doesn't do anything. I can't get anything to work except the checkboxes; from those it looks like corners and ring combined are producing nice results.
- [ ] R-079 feat/label-gang-search | "Publishing those gaps as a ranked list instead of a single winner is a change where it's consumed, not a new model." Do that? Or we already did?

## Round of 2026-09-21b -- his list after the branch previews

### Misc, from his own browser passes

- [ ] R-105 -- | **SHIPPED on master (`faf7216b` + `a10e5894`).** A step now reads `24:00 - 25:00` and keeps climbing past a day; nothing wraps, however many days the run covers. **The clock reading did not vanish, it moved into the row's tip** -- the old label was `elapsed  ·  clock`, two readings of ONE instant, which you read as a range and were right to. | The time step selector on the toolbar (need the transport) lists time ranges. Starting at 24:00, the step end time is normalized back to clock time instead of staying at run time. So we get 24:00 - 0:00. Fix it to say 24:00 - 25:00, and fix all subsequent steps.

## Round of 2026-09-21c -- his pass over the reloaded preview panel

### Placement -- the ruling that reframes the whole label job

- [ ] R-108 feat/label-gang-search | (on being told "The spots don't move; the boxes grow into each other" / "Two labels at neighbouring spots collide exactly when their half-widths together exceed the spacing between spots" / "Narrow: spacing wins, every spot stays usable. Wide: the box wins, so a wide label occupies spots it is not standing on") **"Clearly this is a bug. But you say it without batting an eyelash. If you don't understand why it's a bug, ask me. If you do, fix it. I'm just grateful that magically this endless stack happened so that I know it's possible; We just have to find out how it's possible and empower that."** -- HE IS RIGHT AND THE EXPLANATION WAS BEING OFFERED AS A DEFENCE. A placement lattice whose spacing is blind to the size of the thing being placed is a defect, not a constraint, and the narrow case working is the existence proof that a correct layout is available on that drawing. Two halves, both with the build agent: find out how the endless stack is possible and write it down, then make the wide case use the same mechanism. His acceptance test is R-075 unchanged

### feat/tables-spreadsheet -- his fifth pass

- [ ] R-110 feat/tables-spreadsheet | Sometimes the column widths are unreasonable. For example, Pumps.Date installed, width = 1em; Pumps.Pump head curve, width = 2 em (due to selector?); Pump.Price pattern, width = 3em (due to selector?)

### feat/notice-log -- his four

- [ ] R-116 feat/notice-log | This will need some finesse before it's done.
- [ ] R-119 feat/notice-log | The i info glyph doesn't seem quite right to me. Is it what Ida recommended? How about a + expand glyph or a history glyph? Show me something creative. We need to evolve on this. -- **IT WAS NOT HERS AND SHE SAYS IT IS WRONG**: the circled-i already names five other rows on this page (Welcome, Privacy, Terms, About, Reports), every one a reference fact about the software, where this is a personal growing feed. **Her recommendation is a PLAIN CLOCK FACE, no surrounding arrow**, drawn new in `lib/Icons.lib.php` as `history`. She argues AGAINST the circular arrow (already means Revert and Restore on this page, the opposite job), against a bell (imports an unread-and-urgent category this page's two severities do not have), and against his `+` (means "create" everywhere else, and is close to this suite's own `new` glyph)

### The daily mail

- [x] R-121 -- | The "rank by shopping" table is hard to read. Can you add headings? I don't know what the numbers represent. -- ea551c6c
- [x] R-122 -- | I assume that "PAGE LOADS" includes robots. Maybe clarify that "(includes robots)" if so. -- ea551c6c. **His guess was wrong**: this table's rows already require 10+ seconds on the page before counting at all, so it already excludes nearly all robots by behaviour; the mail now says so instead of "(includes robots)"
- [x] R-123 -- | Is "PEOPLE" non-robot (long-dwell) visits? Maybe clarify that. -- ea551c6c. **Also not quite right**: PEOPLE is the consented bucket (accepted the cookie banner, counted once per person per page), unrelated to dwell time; the mail now says that plainly

## Round of 2026-09-22 -- the same pass, resent after Claude froze

### Map menu

- [ ] R-126 feat/map-menu | Keep all rows visible always. But disable what's not applicable. (1) Maybe 'World map...' should be enabled for all projects. Even an EPSG project should have the option to detach and reattach the world map, I think. But when they attach, they don't have to do the wizard. And for EPSG projects, Re-adjust and Scale should be disabled unless there's user demand to expose them. (2) I think we can retire the Hide/Show street map and satellite images rows. Detach and attach provide the same functionality. (3) Hide map readouts was a print prep command. But it isn't very useful any more. Let's remove it. -- **SUPERSEDES his R-120 question** about whether a context-sensitive menu is good: his answer is always visible, disabled when not applicable
- [ ] R-127 feat/map-menu | That got tidy. Only three rows left. Zoom to fit, Background image, and World map.
- [ ] R-128 feat/map-menu | georeference xy: I don't see this work merged to master. The map menu should have parallel Background image and attach world map rows. But I don't see that. -- **IT DID MERGE** (`feat/xy-world-map`, on his all-clear of 2026-09-21); the World map row was offered only on a plain grid project, so it was not on the map he was looking at. R-126 makes it always visible, which answers this by construction

## Round of 2026-09-22b -- his pass over the six branches

- [ ] R-135 feat/label-gang-search | I am incredulous. You made huge progress. Long strings now barely perturb the endless stacked gang of leaders. Before moving on, I want to pick at this.
- [ ] R-136 feat/label-gang-search | While the results are very good, I still want to push on why additional string length makes any difference at all. The fact that it does leads me to suspect or at least ask for a good insight into our model since, again, there is free space all the way to Japan and beyond. I notice that with 1 character added, there is no significant additional vertical spacing in the gang. But when I add a second character, a noticeable amount of additional gaps appear in the vertical stack. As I add more characters, results oscillate, but the general trend is that the gang's leader trend longer and longer, meaning that the top label of this descending gang is eventually gratuitously 20 text heights away from its node. While I am tempted to rationalize that this is an artifact of keeping the leaders near parallel, that's wrong because with no characters or 1 character, the top label is only gratuitously about 8 text heights below (south of) its node. That said, to say this is partly to quibble since our placements are quite good now, and we really should be focusing on efficiency and performance.
- [ ] R-137 feat/label-gang-search | Moving to a different test case than that notorious southwest area, let's look at the northwest area with three properties turned on and we are zoomed in closer. [his screenshot: labels for nodes 120 and 25x at A, well away from their nodes; empty ground at B, nearer them] A human would have slid the two labels at A toward B, shortening the leaders without any bad effects. Could our algorithm be smart enough not to be gratuitously distant like this?
- [ ] R-144 feat/notice-log | I like the down arrow glyph. -- the clock drawing reads to him as a down arrow / Expand glyph, and he likes it: KEEP IT, do not redraw the hands
