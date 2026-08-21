# Draft: the third-party paragraph in `privacy.php` (Task 480)

Live legal text. **Nothing here ships until Tom says yes.** English-authoritative and hard-coded, so
this is one edit and no translation sprint.

## The ruling this draft implements

Tom, 2026-08-21: *"Is it adequate to say that we prompt you individually for every exception?"*

**As the RULE, yes — and it is the better rule, because it does not go stale when a fourth service
ships.** As the WHOLE disclosure, no. Three reasons, and the third is the one that decides it:

1. Transparency is about who receives the data, and a reader deciding today cannot decide on "we
   will tell you later". GDPR Art. 13 expects the recipients named.
2. The consent prompt has to name the recipient anyway, so naming them on this page costs nothing.
3. A privacy page that says "there may be exceptions, we will tell you at the time" is exactly the
   footnote-you-have-to-find that this page's own tone rejects.

So: **state the promise as the rule AND name the three.** The promise is what makes the list safe to
be incomplete; the list is what makes the promise checkable.

## The correction that is easy to miss

The paragraph currently ends *"We send them nothing about you and nothing about your network — not
its name, not its shape, not one number in it."* **That is true of the tiles and FALSE of the
search**, which sends the words you typed. Folding the geocoder in under the existing sentence would
turn a true claim into a false one. The sentence must be scoped to the tiles, and the search given
its own.

## Draft replacement for the paragraph at `privacy.php:170`

> **Three features on one page reach outside this site, and every one of them asks you first.** The
> rule is simpler than the list: nothing goes to anybody else until you switch that particular
> feature on, and each asks separately, because they do not tell the same thing about you.
>
> All three are on the Looped Pipe Network calculator. The **street map** behind your network fetches
> picture tiles from OpenStreetMap; the **satellite images** fetch theirs from Mapbox. Those requests
> carry your IP address and which part of the world you are looking at. We send them nothing about you
> and nothing about your network — not its name, not its shape, not one number in it — and we store
> none of those images on your device ourselves.
>
> **Searching for a place by name is the sensitive one, and it has its own separate question.** A map
> tile says where you are looking; a search says what you typed. The words you type in that box go to
> OpenStreetMap's Nominatim geocoder to be turned into a location, along with your IP address. That is
> why it asks you on its own rather than riding on the answer you gave about the map.
>
> Each of the three is governed by that company's own privacy policy — OpenStreetMap's for the street
> map and the search, Mapbox's for the satellite images. Turn a feature off and its requests stop.
> Every other page in the suite makes none of them.

Links to preserve from the current markup: openstreetmap.org/copyright, mapbox.com,
osmfoundation.org/wiki/Privacy_Policy, mapbox.com/legal/privacy. Add nominatim.org's usage policy
beside the search sentence.
