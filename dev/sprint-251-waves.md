# Sprint 251 — wave plan (Tom's split, 2026-08-13)

**Tom controls the throttle.** Each wave launches, finishes, is verified and committed, and then
**STOPS and waits**. Nothing launches without him naming the wave: *"Proceed with wave 1 of 4."*

Why this exists: three account session limits killed ~20 in-flight agents each time. Tom,
2026-08-13: *"what is required is for me to be able to specify and experiment with the number of
sub-agents that are launched at once so that we have fewer failures... Each split must stop and
wait for another prompt."* The number of agents per wave is **his dial to turn**, not a constant
derived by the orchestrator — the estimator only informs it.

He also settled the cost question: *"I am assuming that the main agent's cost is not super
significant, so that it's not a huge hit for me to authorize 4 waves instead of 2 waves."*
Correct — a wave boundary (verify + commit + report) runs well under 150k tokens against ~610k
for a five-agent wave. **More waves is the cheap direction; buy safety with it.**

## TWO mechanisms are active at once, and every wave report must say so

Tom, 2026-08-13, on being told batching had been added to the brief without his authorization:
*"Keep both for now, but report always that both are being used so that maybe I can retire one or
the other once I intuit the rhythm."*

So **every wave report names both, every time** — not as a footnote, as a standing line. He is
tuning by feel across waves, and he cannot feel a rhythm whose inputs are invisible to him.

| Mechanism | What it buys | What it costs |
|---|---|---|
| **Wave split** (5 agents, stop and wait) | Lowers the *chance* of hitting a limit — fewer agents burning at once — and puts the dial in Tom's hand. | A wave boundary: verify, commit, report. Well under 150k tokens. |
| **~50-key batched appends** | Lowers the *cost* when a limit hits anyway: work already on disk survives. | ~5–15k per agent out of ~120k, roughly 10%. The translations are output once either way; only tool-call overhead is added. |

They are **not redundant** — one prevents, the other limits the blast radius, and a wave cannot
prevent a limit it was already close to when it started. Croatian survived the third crash purely
because its write happened to land before the interruption while a dozen siblings at the same step
lost everything.

**The process lesson, recorded because it was Tom's objection and it was correct:** batching was
added to the brief unilaterally, in the same breath as the wave split he *did* authorize. That
confounded the experiment — two variables changed at once, so neither can be judged. Do not bundle
a second mechanism into an authorized one. If a wave still loses everything, that is evidence
about batching; if waves stop dying, that is evidence about wave size. Keep them separable.

## The rule for every wave

- **5 agents, Sonnet, launched in one message**, `run_in_background: true`.
- Brief: `dev/translation-agent-brief.md` (checked in — do not use a scratch copy).
- Agents **write in ~50-key batches** so an interruption keeps partial work, and **never touch
  git** — the orchestrator commits.
- Before launching: `generate_translation_payloads.php --check` must say FRESH.
- After landing: verify **on disk**, never from the agent's self-report. Croatian reported failure
  and had in fact written all 289 keys; a dozen others reported progress and had written nothing.
- Then commit, push, report, and **stop**.

## Waves

| Wave | Languages | Keys | Outcome |
|------|-----------|------|---------|
| **1 of 4** | am, ar, bg, bn, cs | 1,445 | Done. |
| **2 of 4** | de, hi, id, km, my | 1,445 | de, hi, id done. **km and my died on a session limit at 100 of 289 each.** |
| **3 of 4** | ps, ro, ru, sw, uk | 1,445 | Awaiting authorization. |
| **4 of 4** | km, my (189 each) + ur, zh + cs, fr, pt | 963 | Awaiting authorization. |

Wave 4 absorbs the two half-finished wave-2 languages and stays the cheap wave: `cs`/`fr`/`pt` owe
1–3 identity keys each, left over from the Task 296 retitle.

## What wave 2 proved about the two throttles

**The wave split did not prevent the limit** — five agents was still enough to hit it. **The
batched appends bounded the damage for the first time:** Khmer and Burmese each had exactly 100
keys on disk when they died, so 200 keys of finished translation survived an interruption that,
in all three previous crashes, would have thrown everything away. Their relaunch costs 189 keys
each instead of 289.

That is the first clean evidence separating the two mechanisms, and it points the same way the
cost model does: the batching is cheap insurance that works, while wave size buys probability, not
protection. If Tom wants to retire one, the batching is the one that has now demonstrably paid.

## Landed so far (17 of 26 complete)

Before this plan: es, fr\*, pt\*, fa, he, tr, sr, it, hr.
Wave 1: am, ar, bg, bn, cs\*. Wave 2: de, hi, id.
Partial: km (100/289), my (100/289).
\* fr and pt still owe three Task 296 identity keys each, cs owes one; all listed in wave 4.

**17 for 17 on the consent-button trap** (de *Diesmal/Immer*, hi *अभी/हमेशा*, id *kali ini/Selalu*
joining the previous fourteen): every completed language has rendered the two Accept answers
*temporally* (this ask vs. never ask again) rather than as the conventional "accept all
categories". That is the guidance in `$ec_lang_syn` working exactly as intended.
