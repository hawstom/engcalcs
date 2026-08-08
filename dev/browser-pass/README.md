# The automated half of the `lpn_` punch list

```
cd dev/browser-pass
npm install          # once — playwright-core; the Chromium binary is already cached
node run.js          # everything
node run.js locking  # one section
```

Exit code 0 means every check passed. `--` lines are checks this environment **cannot** answer and
that stay on Tom's list; they are never counted as passes.

## Why this exists

Tom, 2026-08-06: *"I am very tired and feeble-minded right now. Is there any way that we can proceed
without my working through the test punch list?"*

Mostly, yes. `dev/lpn-file-lock-test-punchlist.md` is 78 checks over two browser profiles, and it has
been run by hand three times in three days. Everything below drives **the real page** in a real
Chromium against **the real `lpn-lock.php`** on a real PHP server, and re-runs in about twenty
seconds.

It found four defects in its first hour, three of which no human pass would ever have found:

1. `pageCalculatorInitialize` was missing, so **every first-time visitor's** page half-initialised.
   Tom's browser has had the cookie for weeks.
2. A listener for a "View printable" button that is not on that page — throwing on every load.
3. `Accept-Language: *` — one header, no q-value — **500'd every page in the suite** on PHP 8.
4. Arriving and reloading before touching anything left the tab strip **empty**, with edits saving
   under an id no index entry knew about.

## How the one lie works

`showSaveFilePicker()` and `showOpenFilePicker()` open native OS dialogs that nothing can drive. This
runner replaces **those two functions and nothing else** (`lib/pickers.js`), returning handles to
files in the **origin private file system**.

That is what makes it honest: an OPFS handle is a real `FileSystemFileHandle` — same class, real
`getFile()` / `createWritable()` / `isSameEntry()`, structured-cloneable so IndexedDB genuinely keeps
it across a reload (Task 212's whole mechanism), and `queryPermission()` genuinely answers `granted`.
Every line below the picker is production code. The lie stops at the dialog.

The stub is injected with `addInitScript`, so **no test-only code ships in the page** — no flag, no
seam, no build step. The page does not know it is being tested.

## Two profiles, one file

`Session` is a browser **context** — its own `localStorage`, its own identity token, so a lock really
does read as somebody else's. Two tabs of one context would share the token and see no contention at
all, which is the trap the punch list warns about in §0.

OPFS is per-profile, so the runner plays the network share: `share.from(A)` then `share.to(B)` is
literally *"A saved it, B opened it"*. It writes only what actually differs — pushing identical bytes
would advance the file's modified time and trip the very freshness check these checks are about.

## What stays on the human list

**It is written out as steps, not as section numbers**, at the top of
`dev/lpn-file-lock-test-punchlist.md` — see **§H, "THE HUMAN LIST"**: fifteen boxes, one browser,
about twenty minutes, in value order so it can be stopped anywhere. What follows here is why each
one cannot be automated.

- **§1 the native picker's user-activation handshake.** The training panel exists precisely because
  `showSaveFilePicker()` needs a live activation and Chrome's expires in seconds. A stub needs none.
  The pass proves the panel appears, gates the picker, and reaches it — not that Chrome agrees.
- **§6/§8 a permission that is `prompt` or `denied`.** OPFS is always `granted`, so the silent
  reconnect is covered and the dormant-grant revival on first gesture is not.
- **§10 a file that has gone missing.** OPFS recreates a deleted file through its old handle, so the
  failure this tests cannot occur here. A real folder throws, which is the branch that warns. *(The
  page's answer to a write that goes nowhere IS covered — by handing it a handle whose writes are
  discarded. What is not covered is which of those two things a real Explorer rename produces.)*
- **§11 Firefox and Safari's own rendering.** The BRANCH is covered: the page decides on
  `typeof window.showSaveFilePicker`, so a Chromium with that one property removed takes exactly the
  same path, and the spec drives it.
- **Anything visual**: banner colours, the Save-all flicker, the stray scrollbar, print layout.

## Adding a check

Specs speak in menus, banners, tabs and dialogs — never in selectors. That is not tidiness: when Task
211 renamed half these controls, every punch-list check that named one silently became a check of
something that no longer existed. One file (`lib/session.js`) knows the selectors, so the next rename
breaks the pass loudly, in one place.

Before adding a check here, ask whether it needs a browser at all — logic that can be sliced out
belongs in `dev/lpn-spike/handle-restore-harness.js`, which runs in a second.
