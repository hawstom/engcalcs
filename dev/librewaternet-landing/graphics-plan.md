# Graphics for the LibreWaterNet page: a shoestring phase 1

Tom, 2026-08-23: *"I could very easily start with a lovingly crafted screen shot or series of
screenshots for a slide show if you want to describe what you find would be a good phase 1
'shoestring public unveiling' effort. I also can do videos if you describe what you find would be
most impactful for shoppers and users."*

This is that description. It assumes your own time and a screen recorder, no budget and no designer.

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

## The four stills

**Use ONE network for all four.** Four screenshots of four different networks read as a gallery of
things somebody once made; four views of one network read as one product. Elm Street Center is the
obvious candidate — it is already in the repo, already shipped, and is a real place rather than
`Net3`.

1. **The hero: the map as an exhibit.** Full window, labels on, coloured by pressure, the legend
   visible, a couple of labels dragged out on leader lines the way you would actually place them.
   This is the picture that has to carry the claim nothing else on the page can carry. Give it the
   most care.
2. **Time.** The transport bar mid-run, a tank part full, the frame clock showing something other
   than hour 0. The page claims extended-period simulation; this is the one frame that shows it is
   not a still calculator.
3. **The import report.** An `.inp` opened, with the panel listing what it could not carry. Counter-
   intuitive and worth doing: **showing the honest limits is the most credible thing on the page.**
   Everyone claims import; almost nobody shows you what theirs dropped.
4. **A language.** The same network with the interface in Arabic or Turkish, right to left where it
   applies. Twenty-seven languages is currently a list of names. One screenshot turns it into a
   fact, and it is the cheapest of the four to produce.

## Capture, in the order the mistakes happen

- **Hide the consent banner** before capturing, and check no project name, file path, tab title or
  browser profile picture is in frame. A screenshot is a screen; it publishes whatever was on it.
- **Capture at 2× device pixel ratio** and place the image at half that width, or it looks soft on
  every modern screen. In Chromium: devtools device toolbar, set DPR to 2, capture full size.
- **PNG for anything containing UI text.** Never JPEG for a screenshot — JPEG ringing around small
  type is exactly what makes a screenshot look cheap.
- **Same window size for all four**, so they stack down the page without jumping.
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

Mechanics:

- **Silent, muted, looping, `playsinline`, with the hero still as the poster frame.** No narration:
  it doubles the work, it dates fastest, and it needs 27 translations to be consistent with
  everything else on the page. A silent clip is honest in every language.
- **MP4 (H.264) and WebM, under about 2 MB each.** Above that the clip costs more in load time than
  it earns in conviction.
- **Never an animated GIF.** Ten times the bytes for worse pictures, and no way to pause.
- **Real speed, or 1.5× at most.** A sped-up clip reads as hiding how long something takes.
- **Do not autoplay more than one.** One looping clip near the top; the others behind a click.

## What phase 1 deliberately leaves out

A narrated walkthrough, a feature tour, an animated logo, a carousel, and anything with a person in
it. Each is more work than all of the above put together, and none of them answers the eight-second
question.

## The order to do it in

1. The hero still. Stop there and put it on the page; it is more than half the value.
2. The draw-and-solve clip.
3. The language still, then the import-report still, then the time still.
4. The other two clips, if the first two turn out to be worth it.

Nothing here needs step 2 before step 1 goes live, which is what makes it a shoestring plan rather
than a project.
