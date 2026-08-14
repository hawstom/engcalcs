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

## Handing this off to a cold session

**A wave boundary is a safe seam; mid-wave is not.** Everything a fresh session needs is on disk:
this file, `dev/translation-agent-brief.md`, the friction JSON, the glossary, the exempt list, and
the payload deltas (which already reflect partial work — km and my read 189, not 289). What does
NOT survive a `/clear` is the **in-flight agent reports**, which arrive as notifications to the
session that launched them and carry the terminology judgements that must be written back to the
glossary. So: clear between waves, never while agents are running.

`/clear` is close to neutral on session limits, which is the thing actually worth managing. It
lowers the orchestrator's per-turn context cost, but the orchestrator is not where the money goes —
a five-agent wave is ~610k tokens against well under 150k for the whole wave boundary. Clear for
hygiene, not as a limit strategy.

### The defect checklist — run these by hand every wave, the tools do not catch them

Four defect classes have now shipped past agents who explicitly claimed the file was clean. The
disk check is not optional and neither is this list:

1. **`lpn_field_auto` — the "Auto" false friend.** German *Auto* is a car; Romanian *auto* is
   automotive. Both shipped, both had to be fixed by hand, and the ro agent had just declared it
   left "no false cognate standing". Ask of every language: is *Auto* a real word here, and does it
   mean something else? Keep it only with evidence (es/fr/it/sw), and scope the exemption.
2. **`consent_accept` vs `consent_accept_all` — the amount/time trap.** These differ in TIME
   (this ask vs. never ask again), never in amount. Pashto wrote *accept all* — one miss in 22.
   Read the pair in every language and confirm the second one says *always*, not *everything*.
3. **Latin script stranded in a non-Latin file.** Hindi shipped a bare Latin "Auto" in Devanagari;
   Serbian had correctly written Аутоматски. EPANET, `ID`, symbols (Q, v, H, D, h_f) and unit
   tokens are the deliberate exceptions.
4. **A half-translated sibling set.** Indonesian shipped File/Edit in English beside Sisipkan/
   Tampilan/Pengaturan. Read menu and toolbar sets as a group, not key by key.

Then: exempt anything genuinely identical-to-English **with per-language scoping and a stated
reason**, never globally to quiet a warning; and write terminology back to `glossary.json`
**harvested from the shipped strings**, not from the agent's prose about what it did.

## Waves

| Wave | Languages | Keys | Outcome |
|------|-----------|------|---------|
| **1 of 4** | am, ar, bg, bn, cs | 1,445 | Done. |
| **2 of 4** | de, hi, id, km, my | 1,445 | de, hi, id done. **km and my died on a session limit at 100 of 289 each.** |
| **3 of 4** | ps, ro, ru, sw, uk | 1,445 | Done, all five, no losses. |
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

## Landed so far (22 of 26 complete)

Before this plan: es, fr\*, pt\*, fa, he, tr, sr, it, hr.
Wave 1: am, ar, bg, bn, cs\*. Wave 2: de, hi, id. Wave 3: ps, ro, ru, sw, uk.
Partial: km (100/289), my (100/289).
\* fr and pt still owe three Task 296 identity keys each, cs owes one; all listed in wave 4.

**21 of 22 on the consent-button trap.** Twenty-one languages rendered the two Accept answers
*temporally* — this ask vs. never ask again — rather than as the conventional "accept all
categories": de *Diesmal/Immer*, hi *अभी/हमेशा*, id *kali ini/Selalu*, ro *acum/mereu*,
uk *цей запит/завжди*, sw *hili/siku zote*, ru *Принять/Всегда принимать*.

**Pashto is the one miss**, and it is worth keeping visible rather than quietly fixing: the ps
agent wrote `ټول ومنئ` — *accept all* — the exact amount reading the design rejects. Corrected to
`تل يې ومنئ` (*accept always*). One failure in twenty-two says the `$ec_lang_syn` guidance is
working but is not self-enforcing, so **check this pair by hand in every remaining language**; it
is the single most reliable place a translator reverts to the industry cliché instead of reading
the guidance.
