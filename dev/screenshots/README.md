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

## Redacting one thing inside a capture

There is no ImageMagick, no Pillow, no PHP GD and no sharp here, but a PNG is zlib plus five row
filters and node ships zlib, so `dev/scripts/png_redact.js` does the two jobs that come up:

    node dev/scripts/png_redact.js crop   in.PNG out.png X Y W H      # cut a piece out to look at
    node dev/scripts/png_redact.js redact in.PNG out.png X,Y,W,H ...  # black a rectangle out

**Crop first, always.** The way to find a rectangle is to cut the region out, look at it, and read
the coordinates off what you see — guessing at a redaction and checking afterwards is how a
black box lands next to the thing it was meant to cover. Verify by cropping the OUTPUT.

It refuses to overwrite its input or any existing file, because painting over pixels is one-way
and the only undo is still having the original. It handles 8-bit RGB and RGBA and refuses anything
else by name rather than mangling it.

Used 2026-08-24 on 0014 and 0021, to black out a bookmark folder named after a real person at
Tom's request. Those two frames are still unpublishable for the rest of their browser chrome.

## Publishable is a decision, not a default

A screenshot is a screen: it publishes whatever was on it. Before any image leaves this folder for
a public page, check the frame for a real project name, a file path, a browser profile picture, a
tab title, and the consent banner. `INDEX.md` records that judgement per file so it is made once.

An image that earns a public place is **copied out** of here into the page's own directory by the
task that uses it. This folder is raw material and stays raw material.

## How the first 33 went, and the one thing to change

Written 2026-08-24, after indexing 0001 through 0033. Tom asked whether he needs a course
correction. **He needs one habit changed and nothing else.**

**Capture the PAGE, not the WINDOW.** Six of the 33 are unpublishable and every one of them fails
for that single reason: the frame includes the browser chrome, so it includes a bookmarks bar with
folders named after real people, the profile avatar, and in one case a Save-as dialog showing a
real folder listing. Nothing on the page itself disqualified a single image. Crop to the page, or
capture the page region rather than the window, and 32 of 33 are publishable.

**Everything else about the drop is working, including the parts that look like mistakes.**

- **Near-duplicates cost nothing.** Two captures a nudge apart are two chances to get the framing
  right, and the index says so rather than pretending to see a difference.
- **A capture that shows a defect is worth MORE than a clean one**, and several here earned their
  place that way: mid-word wrapping in the Settings category index, a colour key covering the label
  legend, English strings standing inside a Romanian interface. Keep shooting the broken frame.
- **Annotating a capture by hand is a good idea and needs one rule.** 0032 carries a highlighter
  ring drawn on after the fact, which says what to look at better than any caption. Give an
  annotated version its own ordinal and keep the clean one — an annotation cannot be undone, and
  the clean frame is the one a public page wants.

## The gap, which is not a correction

**Thirty-two of 33 are EVIDENCE; one is a picture.** Every desktop capture but 0028 has two, three
or four panels open at once, because that is what using the page looks like. It is not what a first
picture of it looks like: a shopper reads overlapping panels as clutter. That is a note about which
captures get published, not about which get taken.

**What the drop has none of is a SEQUENCE** — the same network at four stages of one job, shot
deliberately in order. Every frame here is a moment. A narrated page, a blog post and a features
list all want a sequence, and no amount of moments adds up to one. That is the new avenue if there
is one.
