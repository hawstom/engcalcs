# What would people ask an AI agent to do with EPANET++? (Mary, 2026-10-20)


## What the evidence shows

- Use of today's EPANET connectors is tiny. The four I read in source have 0 to 9 GitHub stars each. CITED: github.com/KWR-Water/epanet-mcp-server, github.com/Applied-Artificial-Intelligence-Eurecat/epanet-mcp-server, github.com/hjlrosales/EPAnet-MCP.
- A utility did publish a working case. SA Water's agent takes "add a 20 L/s demand near this node," runs base and future cases, flags 12 nodes with too much pressure drop, and suggests upsizing about 196 m of DN100 to DN150. CITED: Do, Marchi, Hayde, Cambridge Prisms: Water 2026, doi 10.1017/wat.2025.10012.

- Accuracy of AI on EPANET questions falls from over 90% (simple) to 56% (complex), so people want to check. CITED: arxiv.org/abs/2503.16191.

- NOT FOUND: what working engineers type to ChatGPT or Claude (forums, LinkedIn, AWWA/ASCE). Use cases below are SPECULATION built from the sources above.

## Use cases

1. **"Run this .inp and tell me where pressure is below 20 psi."** Back: a short list plus a link that opens the network with those nodes marked. Needs: open file, solve, query. **Easy.** Commodity; others do it, but without the link.
2. **"What flow can the hydrant at J-45 give at 20 psi residual?"** Back: available flow, residual, link with J-45 selected. Needs: the fire flow engine (exists; OBSERVED dev/ROADMAP.md:239). **Easy to moderate.** Nobody else I read has it. CITED: tool lists in the repos above.
3. **"Add 20 L/s at node J-12 and see what breaks."** The SA Water case. Back: before/after table, failing nodes, link. Needs: demand edit, scenarios (exist). **Easy.**
4. **"If pipe P-88 breaks, who loses service?"** Then "rank all pipes." Back: ranked list. Needs: loop closing each pipe, plus a stated rule for "loses service" (a minimum pressure). **Moderate.** The rule is the hard part, not the loop. Nobody has it.
5. **"Why won't this model run?"** Back: the refusal named, e.g. a forbidden valve pair (OBSERVED CLAUDE.md, lpnDiagnose). Needs: diagnostics. **Easy.** It suits the weakness of the models: a named cause can be checked.
6. **"Build a model from the C-WATR-MODL-* layers of this drawing."** Your example. Judged below.

### Your drawing-file example, honestly

- What exists: DXF export writes exactly that layer scheme (OBSERVED dev/dxf-interface.md:31, js/lpn-dxf.js). DXF import exists only for shapes, meaning figures drawn on the map, not pipes and junctions (OBSERVED dev/roadmap-closed-ids.md:714). Survey-point import exists (OBSERVED js/lpn-survey.js).
- What is missing: DXF import into real network elements. Your own spec says it is "what remains" (OBSERVED dev/ROADMAP.md:346). It needs layer-name parsing, line-ends-to-junction topology, and an editable table for the property mapping.
- Verdict: **not possible soon through an agent, and not an MCP job.** Build the import in the app first. The agent can then call it. A realistic drawing is also a size problem: an agent cannot be handed a 40 MB DXF in a chat, so it needs a file path or upload, which is exactly the privacy cost below.

## What are we buying or selling?

**Nobody pays money. We are not selling a product.** The exchange:

- **User gains** (SPECULATION): a question answered in a sentence instead of ten clicks, then checked by eye in the app. The check is the real offer; other servers return numbers only.
- **Project gains** (SPECULATION): reach among engineers who never search for a modelling tool but do talk to an agent; real questions showing what people need (Tom's "identifying needs is crucial"); a line the landing page can use, "Connect your AI agent to EPANET++." It serves the mission of spreading the message, not a revenue line. Tone must respect dev/positioning.md ("an invitation, not a price"; "looking for stakeholders, not for money").
- **It costs us:**
  - Hosting: on Cloudflare's free tier, 100k requests a day and 10 ms of compute per request (CITED developers.cloudflare.com plans, via cloudflare.com/plans.md). A hydraulic solve probably exceeds 10 ms, so a hosted solver likely needs the $5-a-month tier or a small server. SPECULATION.
  - Privacy: today nothing a user draws reaches our server (OBSERVED dev/privacy-and-terms-draft.md:101). A hosted address that receives a file ends that sentence, so it needs a new paragraph in privacy.php. The local program keeps the sentence true.
  - Utility IT: city and utility AI policies bar confidential data from AI systems the owner does not control (CITED Arlington TX generative AI security policy, arlingtontx.gov; Central Tablelands Water draft AI policy, ctw.nsw.gov.au; WaterISAC AI policy, waterisac.org/ai-policy). Network layouts are critical-infrastructure data. NOT FOUND: a policy naming .inp files specifically. SA Water kept all computation inside its own systems. So the utility users most likely to want this may be forbidden to send us files; the local program answers that, the hosted one does not.
  - Wrong answers: the agent may misread or misreport our numbers, and the user will blame EPANET++. Mitigation is the link back to the screen.
- **Who pays:** you, in time (SPECULATION), and the hosting bill if the hosted address succeeds. GPL covers the code.

## Recommendation

Smallest first version, local program only, no hosted address yet: three tools, open an .inp, fire flow at a node, and break a pipe and report who loses service, each answer ending with a link that opens the project in the app. Publish it with one README showing use cases 2 and 4 as copyable sentences, and watch for one thing: do unrelated engineers use it, or file a question about it, within a few months? The local program tests demand without touching the privacy sentence or paying for hosting. The hosted address and the drawing-file import wait for evidence and for WaterGEMS interop to finish. SPECULATION throughout.
