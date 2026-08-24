# The screenshot drop

Tom's idea, 2026-08-24: *"a folder in this project, not in git, where I can prolifically put
screenshots by the dozens."* This is that folder. **Nothing in it is tracked** — see `.gitignore`.

## How Tom uses it

Drop files in. Name them `0001.png`, `0002.png`, … and nothing else — no describing in the
filename, because describing them is AI's job and a filename that has to be thought about is a
filename that stops getting written. Ordinal only, never reused, gaps are fine.

**PNG, not JPEG,** for anything with interface text in it (JPEG ringing around small type is what
makes a screenshot look cheap). Whatever your screen grabber produces at its own resolution is
right; do not resize on the way in.

## What AI does with them

- **Reads them.** They are the cheapest way to show what the page actually looks like, and they
  carry things prose never does: where the eye goes first, what is crowded, what a real project
  name is.
- **Writes `INDEX.md`** — one line per file: what it shows, which page and feature, and whether it
  is publishable. That file IS tracked, so what we learned survives even though the pictures do not.
- **Builds contact sheets** (`sheet.html` here, untracked): every image at 200 px wide down one
  page, which is a thumbnail without any image tooling — there is no ImageMagick, no Pillow and no
  PHP GD on this machine, and a browser resizing an `<img>` costs nothing.

## Publishable is a decision, not a default

A screenshot is a screen: it publishes whatever was on it. Before any image leaves this folder for
a public page, check the frame for a real project name, a file path, a browser profile picture, a
tab title, and the consent banner. `INDEX.md` records that judgement per file so it is made once.

An image that earns a public place is **copied out** of here into the page's own directory by the
task that uses it. This folder is raw material and stays raw material.
