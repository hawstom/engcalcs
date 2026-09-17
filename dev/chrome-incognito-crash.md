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

**NOT KNOWN:** whether the crash is our READ on boot or Chrome's own restoration of an in-memory
incognito database holding a serialized handle. `?debug=nofiles` -- which skips our read entirely --
did not stop it in one test, but that test is not clean: the handle had already been WRITTEN by the
file picker in the same session. **The test that separates them is `?debug=nofiles`, private window,
open a file, reload.** If it survives, the read is ours to guard; if it dies, the write is, and the
guard has to be not storing a handle we cannot keep.

## What to do meanwhile

- **Do not use a private window for the map page.** Nothing else is affected.
- **Report it to Chrome** with the recipe above. `chrome://crashes` carries the dumps already.
- **Do not build a workaround on an incognito DETECTION.** Chrome has deliberately made that
  unreliable, and a wrong guess in a normal window silently breaks the file link for everybody --
  which is a worse defect than the one it dodges, and it would be ours rather than Chrome's.
