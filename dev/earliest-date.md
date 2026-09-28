# The earliest known date of EngCalcs

**EngCalcs was running on the live server by 20 October 2009.** That is the earliest dated evidence
found, and it is why the copyright line reads 2009.

Tom asked, 2026-09-28: *"How did you know that EC started in 2009. I found it at the Internet Wayback
machine in 2010, but I couldn't do better. Can we document the earliest known date? Is it inside
some file?"*

## The evidence

The repository's first commit, `93235812` (2013-04-14, "Started repository"), included the web
server's `error_log`. Its first lines are PHP messages from Tom's hosting account:

```
[19-Oct-2009 21:35:17] PHP Parse error:  syntax error, unexpected ',' in /home/jconstru/public_html/hawsedc/lib/Session.lib.php on line 85
[20-Oct-2009 19:52:20] PHP Warning:  Missing argument 3 for echoHeader(), called in /home/jconstru/public_html/hawsedc/engcalcs/index.php on line 3 ...
```

- **19 October 2009:** the site's shared libraries (`lib/Session.lib.php`) were being edited live.
- **20 October 2009:** `hawsedc/engcalcs/index.php` was being served and calling the header library.
  This is the first line that names EngCalcs itself.

Read it yourself: `git show 93235812:error_log | head -5`. The log is not in the current tree; it
lives only in that first commit.

## What it does not show

- It does not show when EngCalcs was first **public** or first **found**. A log line means a page
  ran, possibly for Tom alone. Tom's earliest Internet Archive capture is from 2010.
- Nothing older has been found. The parent folder holds older files (`convert.zip`, dated
  2008-09-08, and `drainage-20090121.pdf`), but neither is EngCalcs.
- Git history starts on 2013-04-14, so it cannot answer anything earlier than that on its own.

## Where the date appears

- `lib/HeadersFooters.lib.php`: "Copyright &copy; 2009&ndash;2026 Thomas Gail Haws."
- `CLAUDE.md`: "Copyright 2009 Thomas Gail Haws."
- The EPANET++ Advisors card uses Tom's own dates: calculators served to the world since 2010.
  That is the public date, and it agrees with this record.
