# Chrome takes its own browser process down on this page in a private window

**Measured 2026-09-16 on Tom's machine. NOT this suite's defect, and the evidence for that is in
here so nobody re-opens it as one.** Written because the symptom -- *"Reloading the page crashes
Google Chrome"* -- is alarming, reproducible, and was suspected of being ours for most of a session.

## The recipe

1. Chrome **153.0.8010.37**, stable channel, Windows.
2. A **private window**.
3. Open the map page.
4. **Open a project through the file picker** (File System Access). Any `.lwn`.
5. **Reload.**

The whole browser dies instantly -- not the tab.

**Both halves of step 4 and 5 are necessary.** Reloading a private window where NO file has been
opened is clean; he checked. Reloading in a NORMAL profile is clean; he checked that too, on both
versions.

## Why it is not ours

- **The crash dumps say `ptype: browser`.** Three of them, 21:00, 21:03 and 21:13, all the same.
  **A web page cannot crash the browser process.** The worst a page can do to itself is lose its own
  renderer -- the tab dies and Chrome offers to reload it -- or take down the GPU process. The
  browser process is Chrome's own, and it is where the File System Access handles, the IndexedDB
  store they are kept in, and the file picker all live.
- **Production's code crashes identically.** The decisive test: `81792180` (what production was
  running, a week old) and that night's `master` were served side by side on two local ports and
  opened in private windows. **Both crashed on reload.** So none of the 20 commits from that
  session is responsible, which is what the session had been assuming for an hour.
- Other calculator pages in the suite do not crash. They share the bootstrap, the service worker and
  the storage helpers -- but not the file picker, the handle store or the map.

## What is in the dumps

`%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Crashpad\\reports\\*.dmp`, readable with `strings`:

```
prod   Chrome
ver    153.0.8010.37
ptype  browser
       indexeddb_num_connections
       Windows.Storage.pdb
       ANGLE (Intel, Intel(R) HD Graphics 620 (0x00005916) Direct3D11 vs_5_0 ps_5_0, D3D11-30.0.100.9670)
```

The graphics stack is recorded in every Chrome dump and is **not** implicated here: turning hardware
acceleration off did not stop the crash. The two annotations that match the recipe are the IndexedDB
connection count and `Windows.Storage`.

## What we know about the mechanism, and what we do not

**KNOWN:** the trigger needs a file handle to exist. `js/looped-network.js` keeps one
`FileSystemFileHandle` per open project in IndexedDB (`engcalcs-lpn`, store `handles`, Task 212), and
`restoreHandlesOnBoot()` reads them back and calls `queryPermission()` on each load.

**NARROWED FURTHER, same evening.** It is the HANDLE and nothing about the document:
`Elm-Street-Center-no-image.lwn` is **14 KB with no image, no scenarios and no world map**, and
opening it through the picker is enough. A project CREATED in the window -- New project, two
junctions, no picker -- reloads cleanly. So neither the stored bytes nor the drawing nor the tiles
are in it.

**SETTLED, and the answer is that none of it is ours.** `?debug=nofiles` skips BOTH the read on
boot and the write when a file is opened, so with it on nothing of ours ever puts a
`FileSystemFileHandle` into IndexedDB. **It still crashes.** By then the only thing that has
happened is that the picker returned a handle to the page -- so the crash is inside Chrome's own
handling of that handle in an incognito session, and **there is nothing here to fix**.

## The vanishing mouse cursor is the same bug, and the obvious suspect was innocent

Tom's cursor disappeared in the file picker -- always the FIRST picker of a session, never the
second. It showed on the new build and not on production's, and exactly one cursor-related line had
changed all night: the `?debug=perf` overlay had stopped ignoring the mouse so the readout could be
copied. That fit the evidence and was wrong.

**It vanished again under `?debug=nofiles`, where that overlay is never created at all.** Same
browser, same picker, same private window as the crash. **A one-sided correlation is not a cause,
and "the only line that could have done it" is exactly the reasoning that makes one look like one.**
The overlay kept its new `copy` button, on its own merits.

## What to do meanwhile

- **Do not use a private window for the map page.** Nothing else is affected.
- **Report it to Chrome** with the recipe above. `chrome://crashes` carries the dumps already.
- **Do not build a workaround on an incognito DETECTION.** Chrome has deliberately made that
  unreliable, and a wrong guess in a normal window silently breaks the file link for everybody --
  which is a worse defect than the one it dodges, and it would be ours rather than Chrome's.
- **And do not re-open this as a defect of the suite.** It reproduces on code a week older, with our
  handle store switched off entirely, on a 14 KB drawing with nothing in it. The next step is
  Chrome's bug tracker, not this repository.

## The report to file with Chrome

> **Chrome 153.0.8010.37 (stable, Windows), browser process crashes on reload in an Incognito
> window after a File System Access picker has returned a handle.**
>
> 1. Open any page that calls `showOpenFilePicker()` in an **Incognito** window.
> 2. Pick a file (a 14 KB text file is enough).
> 3. Reload the page.
>
> The entire browser exits instantly -- not the tab. `ptype: browser` in all crash dumps; the
> annotations carry `indexeddb_num_connections` and `Windows.Storage`. Reloading without having
> opened a file is clean; a normal profile is clean. Reproduces with the page's own handle
> persistence disabled, so no `FileSystemFileHandle` is ever written to IndexedDB by the page.
> Turning off hardware acceleration makes no difference. GPU line in the dumps, for completeness:
> ANGLE (Intel HD Graphics 620, D3D11-30.0.100.9670).
>
> A second symptom on the same machine, same recipe: the mouse cursor is not drawn while the FIRST
> file picker of a session is open, and is normal on the second.
