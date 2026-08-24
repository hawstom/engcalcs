# Graphics for the LibreWaterNet page: a shoestring phase 1

Tom, 2026-08-23: *"I could very easily start with a lovingly crafted screen shot or series of
screenshots for a slide show if you want to describe what you find would be a good phase 1
'shoestring public unveiling' effort. I also can do videos if you describe what you find would be
most impactful for shoppers and users."*

This is that description. It assumes your own time and a screen recorder, no budget and no designer.
**Revised 2026-08-24 with Tom's corrections and his questions answered in place**, so what is below
is the current plan and not a conversation about one.

---

## The one thing to get right first

**A shopper decides whether this is real software in about eight seconds, and they decide it from a
picture, not a sentence.** Every claim on that page is currently a sentence. The page says the
labels are an exhibit somebody else can read; a reader has no way to believe that until they see
one.

So phase 1 is not "add graphics to the page". It is **one image that makes the central claim
visible**, and three that make the three supporting claims visible. Four stills and one short clip
is the whole of it.

## Why not a slideshow

You offered a series for a slide show. **A slideshow is the weaker form here and it is worth saying
why plainly:** a shopper who gives the page eight seconds sees slide 1 and nothing else, so
everything after it is work that was never seen. It also needs JavaScript, controls, and a decision
about autoplay, all of which is effort spent on the container rather than the contents.

The same images laid out **down the page, each beside the paragraph it proves**, are seen by
everybody who scrolls, need no code, and survive with images turned off. If you want a sequence
later, that is what a Help page is for.

## Two networks, and the split is the story

The first draft said use ONE network for all four stills, and named Elm Street Center as "a real
place rather than Net3". **Both halves of that were wrong, and Tom's correction makes the plan
better rather than harder:** Net3 IS a real place — Novato, California — and Elm Street Center is
the fictitious one. Only Net3 has a time run, and only Elm Street has had personal attention paid to
its presentation. They are also different in scale.

So use **two**, and name the reason out loud on the page:

- **Elm Street Center — DESIGN.** A subdivision being laid out. Small, cared for, every label placed
  by hand. This is what a designer's screen looks like.
- **Novato / Net3 — MANAGEMENT.** A real city system, imported, run through a day. This is what an
  operator's screen looks like.

Four screenshots of four unrelated networks read as a gallery of things somebody once made. Two
networks with a stated job each read as one product that does two jobs — which is a claim worth
making and is true.

## The four stills

1. **The hero: the map as an exhibit.** *Elm Street Center.* Full window, labels on, coloured by
   pressure, the legend visible, a couple of labels dragged out on leader lines the way you would
   actually place them. This is the picture that has to carry the claim nothing else on the page
   can carry. Give it the most care.
2. **Time.** *Novato / Net3, which is the only one that has a run.* The transport bar mid-run, a
   tank part full, the frame clock showing something other than hour 0. The page claims
   extended-period simulation; this is the one frame that shows it is not a still calculator.
   **Do not build a time run onto Elm Street just to keep the stills matching** — the two-network
   split is what makes that unnecessary.
3. **The import report.** *Novato / Net3 again,* an `.inp` opened, with the panel listing what it
   could not carry. Counter-intuitive and worth doing: **showing the honest limits is the most
   credible thing on the page.** Everyone claims import; almost nobody shows you what theirs
   dropped.
4. **A language.** *Elm Street Center again,* the interface in Arabic or Turkish, right to left
   where it applies. Twenty-seven languages is currently a list of names. One screenshot turns it
   into a fact, and it is the cheapest of the four to produce.

## Capture, in the order the mistakes happen

- **Hide the consent banner** before capturing, and check no project name, file path, tab title or
  browser profile picture is in frame. A screenshot is a screen; it publishes whatever was on it.
- **Capture at twice the size you will display it. That is the whole of it.** If the picture sits in
  a 900 px-wide column on the page, the file wants to be about 1800 px wide. Anything less looks
  soft on a phone and on any recent laptop, because those screens draw two or three real dots for
  every one the page asks for. Two ways to get there, easiest first:
  - **Just capture your whole screen or window as it is** (it is probably already 2560 or 3840 px
    wide) and let the page display it at half. Nothing to set up. This is the one to use.
  - Or, in Chrome: F12, the little phone/tablet icon, then in that bar set the zoom/DPR control to
    2 and capture. Only worth it if you want a specific window size.
- **PNG for anything containing UI text.** Never JPEG for a screenshot — JPEG ringing around small
  type is exactly what makes a screenshot look cheap.
- **Yes, clip freely — cropping is better than fussing with the window.** The earlier "same window
  size for all four" was asking for the wrong thing. What actually matters is that the four images
  end up the **same width and roughly the same shape** so they do not jump as the reader scrolls;
  how you get there is your business, and cropping in any image viewer is the cheap way. Crop to
  content: cut the browser chrome, cut empty canvas, keep the menu bar and toolbar because they are
  part of what the picture is claiming.
- **Alt text on every one.** This page argues that the software is reachable by everybody; an
  unlabelled image on it is an own goal.
- **Self-host every file.** The suite's own rule is no runtime CDN, and the landing page is not an
  exception.

## The video, and what it should be

**Most impactful, by a distance: that the map is DIRECT.** The thing prose cannot convey is that you
draw on it and it answers. Not a tour, not a tutorial — a demonstration that the loop between
drawing and result is short.

In order of value:

1. **Draw and solve, ~25 seconds.** Place two junctions and a reservoir, draw pipes between them,
   press solve, colour by pressure. Nothing else. This is the one to make first, and if you only
   make one, this is it.
2. **A label being placed, ~10 seconds.** Drag a label out, the leader follows, drop it. Short
   because the point lands immediately. This proves the differentiator, so it earns its place even
   though it is the least dramatic.
3. **Scrubbing the run, ~15 seconds.** Drag the transport and watch a tank draw down. Only worth
   making after the first two.

**Three short separate clips, never one three-minute film.** A shopper will start a 25-second clip
and will not start a three-minute one; a long clip also has to be re-recorded in full the first time
any part of the UI changes, and three short ones do not.

### Self-hosted, not YouTube

**Self-host it, and this is not a close call for us.** A YouTube embed is a third-party request that
sets cookies and profiles the reader before they have decided anything — on the page whose whole
argument is that this software asks permission for each of its four outside services. It would also
put a Related Videos wall over the end of our own clip.

The cost of self-hosting is that you have to keep the file small, which is the next section, and the
benefit is a silent looping clip with no logo, no controls you did not choose, and no watching eyes.

If a clip ever needs to be findable by search — a tutorial, later — YouTube is the right home for
*that*, linked and not embedded.

### Specs, so nothing has to be guessed

The target is **under about 2 MB**, which at 25 seconds is comfortable for what these clips show
(mostly still map, a moving cursor). Above that the clip costs more in load time than it earns.

- **Record** at your screen's own size, then scale down: **1280 px wide is plenty** for a clip and
  is a quarter the pixels of 2560. **30 fps. No audio track at all** — not a silent one, none.
- **MP4 (H.264)** is the one file to make. WebM is a nice-to-have second source, not a requirement.
- If you have `ffmpeg`, this is the whole recipe — the first line makes the MP4, the second reports
  the size:

  ```
  ffmpeg -i raw.mov -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart draw-and-solve.mp4
  ls -lh draw-and-solve.mp4
  ```

  `-an` drops audio. `-crf` is the quality dial: **lower is better and bigger.** 28 is the starting
  point; if it looks mushy try 24, if the file is over 2 MB try 30. `+faststart` lets it begin
  playing before it has finished downloading, which on a slow connection is the difference between
  a clip that plays and one nobody sees. If you do not have `ffmpeg`, say so and we will find the
  no-tools path — but it is one install and it is the tool for this.
- **On the page:** `muted loop playsinline autoplay` with the hero still as the `poster`, and no
  narration. Narration doubles the work, dates fastest, and would need 27 translations to be
  consistent with everything else on the page. A silent clip is honest in every language.
- **Never an animated GIF.** Ten times the bytes for worse pictures, and no way to pause.
- **Real speed, or 1.5× at most.** A sped-up clip reads as hiding how long something takes.
- **Do not autoplay more than one.** One looping clip near the top; the others behind a click.

## What phase 1 deliberately leaves out

A narrated walkthrough, a feature tour, an animated logo, a carousel, and anything with a person in
it. Each is more work than all of the above put together, and none of them answers the eight-second
question.

## The order to do it in

1. **The hero still.** Stop there and put it on the page; it is more than half the value. Tom:
   *"This is easy, and anything worth doing is worth doing poorly."* Exactly right — a mediocre
   hero on the page beats a lovingly crafted one that is still being crafted. The specs above are
   the floor, not a standard to meet.
2. The draw-and-solve clip.
3. The language still, then the import-report still, then the time still.
4. The other two clips, if the first two turn out to be worth it.

Nothing here needs step 2 before step 1 goes live, which is what makes it a shoestring plan rather
than a project.

**Drop the raw captures in `dev/screenshots/` (Task 508) rather than sending them one at a time.**
That folder is untracked, ordinal-numbered, and AI indexes what is in it — so a picture that turns
out to be the hero can be found again, and one that shows a file path can be marked unpublishable
once instead of every time.
