# The automated half of the `lpn_` punch list

```
cd dev/browser-pass
npm install          # once — playwright-core; the Chromium binary is already cached
node run.js          # everything — 138 checks, about a minute
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

## What is left for Tom — one box

As of 2026-08-06, after the §H pass and the specs it produced, the honest answer is **one retest**:

- **§H4 / §10 — a file moved or renamed in Explorer.** Save it, move the file, edit, press Save.
  Expect an **amber banner**, **Choose the file again**, the asterisk still lit, and **no new file at
  the old name**. Tom reported this as a successful save twice, for two different reasons — the
  second being that moving a file does not make the write fail at all: `createWritable()` recreates
  it at the old path, so the save genuinely succeeds and you are left editing a file you did not
  choose. Both are fixed and **the runner now tests this** (OPFS turned out to behave exactly like a
  real folder, which retired the excuse for skipping it). It stays here because a real Explorer move
  on a real NTFS path is still the only proof that matters.

Everything else in `dev/lpn-file-lock-test-punchlist.md` is now `[x]` or `[auto]`, and its remaining
empty boxes are in the **Appendix**, which is history and is never to be worked.

**Worth a glance next time you are in there anyway, but nothing is waiting on them:**

- The tip wording on **Save as…** in a real Firefox (§11). The runner takes that branch by deleting
  `showSaveFilePicker` — the one property the page tests — so the behaviour is covered; the tip's
  prose in a real Firefox is not.
- The 60-second poll that clears the lock banner when the broker comes back (§9). Automating it costs
  a minute per run to prove one line, which is the wrong trade.
- **"1 minutes ago"** in the lock dialog — known, and deliberately left until the `lpn_` translation
  sprint, when three singular forms would otherwise become 78.

## Why the rest cannot be automated

- **§1 the native picker's user-activation handshake.** The training panel exists precisely because
  `showSaveFilePicker()` needs a live activation and Chrome's expires in seconds. A stub needs none,
  so the runner proves the panel appears, gates the picker, and reaches it — not that Chrome agrees.
  **Tom passed this by hand on 2026-08-06**, which is the single most valuable box in the file.
- **§6/§8 a permission that is `prompt` or `denied`.** OPFS is always `granted`, so the silent
  reconnect is covered and the dormant-grant revival on first gesture is not. **Passed by hand,
  2026-08-06**, using Chrome's Site settings → File editing → **Block**.
- **§10 a real folder.** As above.
- **§11 Firefox and Safari's own rendering.** The BRANCH is covered; the pixels are not.
- **Anything visual**: banner colours, the Save-all flicker, print layout.

## Adding a check

Specs speak in menus, banners, tabs and dialogs — never in selectors. That is not tidiness: when Task
211 renamed half these controls, every punch-list check that named one silently became a check of
something that no longer existed. One file (`lib/session.js`) knows the selectors, so the next rename
breaks the pass loudly, in one place.

Before adding a check here, ask whether it needs a browser at all — logic that can be sliced out
belongs in `dev/lpn-spike/handle-restore-harness.js`, which runs in a second.
