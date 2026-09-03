# The dilettante path: make replying cost one tap, not five steps

Design record for **ROADMAP Task 207**, extracted from the roadmap 2026-08-16 under Task 388 — it
was a 112-line block in a file whose own rule is that anything past ~15 lines becomes a `dev/`
document. Scoped with Tom 2026-08-03, after Task 205 optimized the invitation's wording and
placement twice and neither addressed the actual constraint. Tom's framing: *"Cost and fun of
reaching out; harnessing dilettantism, the Wikipedia secret."*

**The problem, stated as arithmetic.** ~4,042 confirmed-human views in the 2026-07-27 snapshot;
a few dozen contacts in 15 years — order 0.01%, which is *normal* for an unsolicited "contact us"
link (the band is roughly 1-in-1,000 to 1-in-10,000). Nothing is broken. That is the point: the
current rate is what a link-to-a-form *structurally* produces, so no amount of rewording moves it.
Today's path is click → new page → form → compose → send, and each step sheds most of who is left.
"I think that word is wrong in Khmer" does not survive five steps. **The lever is the cost of
replying, not the visibility of the request.**

**The Wikipedia lesson, precisely.** Wikipedia is not written by committed experts; it is written
by uncommitted passers-by who fixed one thing. Three mechanisms make that work, and all three are
portable here:
1. **The action is available at the point of noticing.** The `edit` link sits beside the sentence
   you are reading — the gap between "that's wrong" and "I can fix it" is zero. Our invitation sits
   at the page bottom; the noticing happens at a *specific label*.
2. **The unit of contribution is tiny and bounded.** One word. "Feedback" is unbounded and demands
   that the visitor compose an opinion; "Is this word right in your language?" is answerable in one
   tap by someone with no engineering background at all.
3. **No gate.** No account, no credentials, no proof you are qualified. Dilettantism is *harnessed*
   rather than filtered — which is the whole idea, because the person best placed to catch a bad
   Khmer label is a Khmer speaker who is not necessarily an engineer.

**Design: a cost ladder, where every rung is optional and the first rung is free.**
- **Rung 0 — one tap, no text.** A small marker on a label ("this reads wrong") that posts only
  context: page, language, key name, unit set. Zero composition. This is the true floor and the
  rung most people will ever use. Even at Rung 0 the signal is real: three taps on the same key in
  the same language is a defect report, and it is *machine-aggregatable* in a way prose never is.
- **Rung 1 — one line, inline.** A single textarea plus optional email, submitted without leaving
  the page. Pre-fill the context server-side so the human writes only the delta.
- **Rung 2 — the existing `contact.php` form**, unchanged, for anyone with more to say.
Nobody is ever asked to climb; each rung offers the next.

**Why this is the highest-value ask we have.** Our single largest standing quality risk is
translation defects in languages nobody on this project speaks. `lib/Language.Settings.php` already
encodes our own honest confidence per language (0.65 for the low-resource tier, 0.85 AI-checked,
0.95 native-reviewed). Rung 0 is the *only realistic mechanism that has ever been proposed* for
moving a language from 0.65 to 0.95, because it is the only one whose cost is low enough for a
passer-by to pay. Per the standing rule, native review is real only when feedback actually lands —
this is the instrument that could make it land. Consider asking slightly more insistently on
low-QUALITY languages; that targeting is honest, because it is precisely where we are least sure.

**The honesty boundary — non-negotiable, and it is also what works.** Tom asked for "deep psyops
guidance! For love!", and the two halves of that are compatible only in one direction. Legitimate:
reducing cost, removing gates, asking at the point of noticing, thanking warmly and instantly,
showing that a suggestion actually changed the page. Off the table: manufactured urgency, guilt,
fake counters ("14 people helped this week" if untrue), obstruction, anything that must be
dismissed to proceed, or a thank-you that implies a reply that will not come. Beyond being
incompatible with the mission, manipulation fails on the merits here: this audience is small,
expert, and returning, and a person who feels handled does not come back. **Warmth and low cost are
the entire technique.** See also Task 205's rejection of the dismiss affordance for the same reason.

**Reinforcement is the half everyone forgets.** Wikipedia's edit appears *instantly* — the
contributor sees their effect. We cannot do that, but we can do the two things that matter:
(a) an immediate, specific thank-you **in the contributor's own language** (not a generic success
page — `formmailsuccess.php` today is neither specific nor translated); and (b) a public,
dated changelog crediting anonymous suggestions ("a reader in Bengali corrected this label"). "Your
suggestion changed this page" is the strongest possible reinforcement and costs one markdown file.

**Spam, honestly.** A zero-cost form invites bots — and note what the 15-year record actually
shows: the old challenge test kept the form spam-free *completely*, which is evidence it worked,
and therefore evidence it was also taxing humans. Now that it is removed, **spam should be expected
to start arriving; watch for it, because either outcome is informative** (spam ⇒ the filter was
doing real work; continued silence ⇒ the form was simply invisible to bots and the filter was never
the constraint). The replacement must put the cost on bots, never on humans: an invisible honeypot
field, a minimum time-on-page, per-IP rate limiting, and — importantly — **do not send mail on
submit.** Append to a log file in the `log-human-view.php` beacon pattern and let review be a poll,
which makes a spam flood a file to ignore rather than an inbox to clean.

**Implementation notes specific to this codebase.**
- Reuse the existing beacon pattern (`log-human-view.php`, `navigator.sendBeacon`, POST, sanitized
  fields, no database). Rung 0 is nearly that file with two more fields.
- **Keep the new string count tiny — 3 or 4 — because every string costs ×26.** This is a real
  design constraint and it argues *for* Rung 0 over prose: a tap target needs almost no words.
- Attach Rung 0 to the existing `.ec-help`/`.ec-tip` label infrastructure rather than inventing a
  parallel one; those wrappers already mark exactly the labels worth commenting on.
- **The suite is an offline PWA (`sw.js`).** A submission made offline must queue and send later
  (service-worker background sync) or it is silently lost — and field users in low-resource regions,
  the people this most needs to hear from, are the likeliest to be offline.
- Collect the minimum: no IP stored beyond transient rate limiting, email optional and only for a
  reply. Say plainly what is collected; a form that asks for trust must deserve it.

**Idea seeds for the "warm and welcoming" surface (Tom, 2026-08-03), not yet designed:**
- **Polls.** A one-tap question is Rung 0's mechanics pointed at something we actually want to
  know ("Which calculator should exist next?", "Do you work in metric or US units?", "Is this word
  right in your language?"). Cheapest possible connection: it costs the reader one tap, it gives us
  a real number, and — the part that matters — it is an *invitation to have an opinion*, which
  reads as being asked rather than being solicited. Publishing the running result closes the loop
  and makes the next tap more likely.
- **Intentional mistakes — REJECTED, decided 2026-08-03, do not re-propose.** The known growth
  trick of planting a visible error to bait corrections ("someone is wrong on the internet" is the
  most reliable engagement engine there is) is off the table here, permanently, and Tom ruled it
  out himself in the same breath as raising it. Two independent reasons: (1) it is deception, and a
  project whose stated purpose is to tell people they are loved cannot get there by tricking them;
  (2) unlike a wiki article, these outputs size real infrastructure — a planted wrong number can
  reach a channel, a pipe, or a chute that someone builds and someone else stands in. There is no
  version of this that is safe here. Recorded so it is not rediscovered as a clever idea later.
- **Other warm surfaces worth designing later:** a visible "what changed because a reader wrote in"
  log (see reinforcement above); an honest, dated "who uses this" note; a first-visit greeting in
  the reader's own language that asks for nothing at all (`template_welcome` already does this and
  is the tonal model for everything in this task).

**Was gated on Task 206, which shipped 2026-08-07 — the gate is now a waiting period, not a build
step.** Do not build this blind. Without contact-funnel logging there was no way to tell whether
Rung 0 worked, and this task's entire premise — that cost, not visibility, is the constraint — is
a hypothesis that deserves a measurement rather than another two rounds of rewording. The
instrument exists and starts at zero on 2026-08-07: read the "Contact funnel" section of
`log/lang-log-stats.sh` once both counts are out of single digits, and let the clicks-vs-sends
split pick which lever this task pulls.

---

## Rung 0 lands on the map page first — authorized 2026-09-02

Tom, 2026-09-02: *"I would like that! Use our logs to know where to put a low-cost grievance link."*
That is the authorization to build Rung 0, and it names the method: **placement is decided from the
usage report, not from taste.**

**Why `lpn_` rather than the busiest page.** `Looped-Network.php:859` records that it is the ONLY
calculator that does not call `echoFeedback()` — its invitation is Help > Fix something, which opens
`contact.php` in a new tab. So the page whose users have the most to say has the longest path to
saying it, and it is also the page with a genuine standing message surface to hang a link on.
Manning-Pipe-Flow has 8x the audience but the visitors there succeed; nobody writes in about a form
that worked.

**Where the log points, as of the 2026-08-21 reading** (16 opening moves, 14 diagnostics — small,
and small is fine, because this decides WHERE A LINK GOES rather than establishing a rate):

- `#lpn_status`, the amber diagnostic box, is the point of noticing. It appears exactly when
  somebody is stuck and at no other time, and `diag:unreachable` — *"These nodes have no path to a
  reservoir"*, which is really *a pipe drawn near a junction and not snapped to it* — was 9 of the
  14 complaints met. A grievance link belongs on that box before anywhere else.
- The `.inp` import difference report is second, and it reaches the most qualified population on the
  page: `first:import` was 3 of 16 opening moves, so **one visitor in five arrives carrying a real
  EPANET model.** They can judge the answer, which nobody else on the page can.
- **What the log also says, and it bounds the whole idea: 43 of 48 page loads did NOTHING.** The
  status box cannot reach a person who left before drawing anything, so Rung 0 is an instrument for
  the people who tried, not a fix for the people who did not. Do not let it be sold as the latter.

**What one tap sends:** page, served language, the diagnostic code, and nothing else — no typed
text, no email, no element data, and never anything out of the user's document. Reuse the
`log-human-view.php` beacon shape, append `ecLogBucketSuffix()` like every other writer, and queue
it when offline or the field users this most needs to hear from lose their reports silently.

**No new storage on the visitor's device, therefore no `consent_body` rewrite and no
`EC_CONSENT_VERSION` bump.** That is the whole reason this shape was chosen over anything that
remembers who tapped.

**Open, and Tom's alone: the wording.** Three or four English strings at most (every string costs
x26). They go in `lib/lang.ec.en.php` only and reach him through `dev/new-english-keys.md`.

