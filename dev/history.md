# Where EngCalcs came from

Tom, 2026-08-24: *"I am interested in understanding and documenting the history of engcalcs. I
looked at commit 93235812 and found a note in Manning-Trap.php Tom's design notes 2010-07-15. This
indicates to me that engcalcs was running as early as 2010. Judging by the logs, languages were
running by 2013."*

Both halves of that are worth revising. It was running earlier than 2010, and languages were running
three years before 2013.

**The evidence is unusual and worth naming, because it will not exist twice.** The first git commit
(93235812, 14 April 2013) accidentally included `error_log` — 7,425 lines of PHP warnings stretching
back to **19 October 2009**, each stamped with a date and a full server path. The repository was
started in 2013; the *record* goes back to 2009 because a log file was committed by mistake and then
deliberately removed six weeks later (e88ba8ce, "Removed log files from the repository"). Every date
below that predates 2013 comes from that file. It is still in git history and is the only surviving
primary source for the first three and a half years.

---

## The dated timeline

| Date | What the record shows |
|---|---|
| **19 Oct 2009** | `hawsedc/lib/Session.lib.php` throwing parse errors — the shared library exists |
| **20 Oct 2009** | `hawsedc/engcalcs/index.php` calling `echoHeader()` with the wrong argument count. **EngCalcs exists and is being debugged.** This is the earliest hard date for the application itself, and it is why every file in the suite carries `Copyright 2009 Thomas Gail Haws` |
| **19 Jan 2010** | `lib/lang.ec.en.php` — **the language files are three months old, not three years away** |
| **20 Jan 2010** | `lib/Language.lib.php`, and an error on `lib/lang.ec..php` — a language file with an *empty* code, which is the language-detection routine being written that same week and getting it wrong |
| **16 Feb 2010** | `lib/lang.ec.english.php` — an earlier naming scheme, full names, before two-letter codes settled |
| **11 Jun 2010** | `lib/lang.ec.es.php` — **Spanish is the first translation, June 2010** |
| **15 Jul 2010** | Tom's design notes in `Manning-Trap.php`: *"After reading some best practices articles, I think -Use `<tables>` to lay out form -Use `<label for="">"* |
| **17 Jul 2010** | `lib/base.inc.php` and `lib/Calculators.lib.php` both appear. **This is the architecture the suite still runs on** — one bootstrap include, one `echoCalculatorForm()` taking an array of inputs and an array of results |
| 17–19 Jul 2010 | Manning Pipe Flow, Manning Pipe Head Loss, Manning Trap: three calculators in three days |
| **14 Apr 2013** | First git commit, seven calculators, inside the `constructionnotesmanager.com` Bitbucket repository |
| 13 Aug 2013 | Iuval's two commits — the only other person to touch the code until 2020 |
| 5 Sep 2013 | *"Reworked lang variables to be easier to translate"* — the `$ec_lang['prefix_description']` convention |
| 7 Sep 2013 | Turkish |
| 10 Dec 2016 | `README.txt`, a four-line to-do list |
| 1 May 2020 | Plamen's one commit, adding his own localhost |
| 5 Mar 2020 | Sixteen more language files land in one commit |
| 19–22 Jun 2026 | Ten more languages, reaching 27 |
| 9 Aug 2026 | Origin moves from Bitbucket to GitHub |

## Five things the record says that are not obvious

**1. The 2010-07-15 design note is not the beginning. It is a rewrite.** EngCalcs had already been
running for nine months when Tom wrote it, and `base.inc.php` + `Calculators.lib.php` appear two days
after it. So that week is when the suite got the shape it still has — the note is the moment a
working thing was rebuilt properly, not the moment it started.

**2. Multilinguality is nearly original equipment.** English strings were extracted in January 2010,
three months in; Spanish shipped that June. It was never retrofitted. That is why it goes all the way
down — the strings are not wrapped around an English program, and never were.

**3. The suite was born inside another product.** The first commit is a merge from
`bitbucket.org/hawstom/constructionnotesmanager.com`, and the 2009 error paths read
`/home/jconstru/public_html/hawsedc/engcalcs/`. Seventeen years later the working copy is
`/var/www/cnm/public_html/hawsedc/engcalcs` — *cnm* for Construction Notes Manager. **The directory
structure has outlived the product it was a subdirectory of.**

**4. It is a one-person project by an overwhelming margin.** 1,537 commits by Tom Haws, two by Iuval
(August 2013), one by Plamen (May 2020). Every translation, every calculator, every fix.

**5. The years are wildly uneven, and the shape is the story.** 2013: 18 commits. 2014: 7. 2015: 2.
2016: 9. 2017: 16. **2018 and 2019: none at all.** 2020: 64. 2021: 26. 2022: 44. 2023: 13. 2024 and
2025: none. **2026: 1,341** — 87% of every commit in the project's history, in one year. The suite
sat working and largely untouched for a decade, which is its own kind of evidence about the 2010
architecture.

## What the 2016 to-do list asked for

```
-Put AddPageRow function on weir calculator
-Put the standard cookie on the weir calculator
-Put all Javascript into the Haws object.
-Make calculators into a modular project
```

All four are done. The third became the `EngCalcs` namespace object that every JS file in the suite
now hangs off.

## How to extend this document

The 2009–2013 record is finite: `git show 93235812:error_log` is all of it, and nothing will add to
it. Anything earlier would have to come from outside git — a hosting invoice, an old backup, a
mailing-list post, or Tom's own memory, which is the one source that can say *why*. The dates above
say what happened and when; they say almost nothing about why any of it was built.
