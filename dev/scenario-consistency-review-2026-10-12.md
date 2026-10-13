# Scenario system review: consistency of logic and paradigm (Sue, 2026-10-12)

Read-only review of `/home/haws/webdev/worktrees/feat-bentley-interop/engcalcs` at a9be8bec (a build
agent was editing it at the same time, so line numbers can drift by a few lines; each finding names the
function too). I wrote nothing in that worktree.

**My vantage, said once.** I have never run WaterGEMS or WaterCAD. Every Bentley statement below comes
from a Bentley help page I fetched, and I give the URL. Where a page was silent I say "I do not know".
SPECULATION means my own reasoning, and you should re-derive it before acting on it.

**The model I tested against** (Tom, 2026-10-12): a scenario is a window onto its alternatives. Creating
a scenario creates no alternatives; it uses its parent's until an override needs a new one. That one is
named like the current scenario. In Basic mode alternatives are hidden and every new scenario is a child
of Base. With Basic mode off, alternatives can be shared.

**Overall verdict.** The core write path matches the model exactly. `ownWriteTarget()` (js:5281)
creates the scenario's own alternative on its first override, names it after the scenario, and parents
it on whatever the scenario inherited. `treeLayers()` (js:5142) resolves a scenario that names nothing
through its parent. What does not match is everything **around** that path. The delete wording, the
reparent claims, Add Base, Copy, the renaming doors, the Basic-mode tip and a stretch of the design doc
still describe the model as it was before 10-12, when a scenario held its own values and an alternative
was derived from them.

---

## Ranked findings: how badly a working modeller would be misled

### Rank 1: says something false about the data, silently

**F1. The confirm on Delete scenario promises to delete overrides that it keeps, and it counts other
scenarios' values as this one's.** OBSERVED.
- Where: `lpn_scenario_delete_confirm` (lib/lang.ec.en.php:3235), "Delete the scenario {name}, and its
  {n} overrides?". It is built in `scenarioMenuRows()` (js:6982), with `{n}` = `overrideCount()`
  (js:4801).
- Why it is false:
  - Since 10-12 an override lives in a stored alternative, and `deleteScenario()` (js:6809) leaves that
    alternative in the file. The doc says so at line 955: "kept when its scenario is deleted".
  - `overrideCount()` also counts what the scenario takes from stored alternatives it inherits or
    shares (doc decision 7, line 1004). A child scenario with no override of its own can read "and its
    12 overrides", and deleting it removes none of them.
- The second door disagrees with the first. The Scenario manager's Delete (`smActDelete()`, js:74026)
  asks nothing at all.
- Fix: one confirm for both doors, in both modes, naming what actually goes.
  - Basic mode, with today's in-flight rule: "Delete the scenario {name}? Its {n} overrides are deleted
    with it." Here `{n}` counts only the values in the alternatives that the delete removes.
  - Basic mode off: "Delete the scenario {name}? Its alternatives stay in the project: {list}."

**F2. Moving a scenario under a new parent does not change what it inherits, in every category where it
already holds an override. The doc, the code comments and the help all say that it does.** OBSERVED.
- The claims:
  - The `smMove()` comment (js:5975): "what it inherits follows the new parent".
  - `setScenarioParent()` (js:5722): "what it inherits follows the new parent, as in Bentley".
  - Doc line 918: "Reparenting ... keeps its own values; what it inherits may change".
  - The help text (`lpn_sm_help`, lang:3273): "Drag an item onto another to make it a child of that
    item."
- The code: `treeLayers()` stops at the alternative a scenario names and follows that alternative's own
  parent chain. It never returns to the scenario's parent.
  - Before 10-12, a scenario's values were implicit, so a reparent changed inheritance everywhere.
  - Since 10-12, the first override in a category stores a named alternative. So for every category a
    scenario has ever edited, the drag changes nothing.
- How a modeller trips: drag "Fire at peak" under "Peak hour", expecting Peak hour's demands. If Fire
  at peak already holds one demand override, it keeps Base demands everywhere else and gets no notice.
- Bentley: as far as I can tell this is Bentley's behaviour too. Scenario inheritance and alternative
  inheritance are separate trees (Bentley, "Base and Child Alternatives": "All data inherited from the
  base alternative are changed when the base alternative changes. Only local data specific to a child
  alternative remain unchanged."
  <https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-067F08A81CE747CDBDFB93AD301E0CFD.html>).
  So the behaviour is defensible, but the words are wrong. A Basic-mode user who has just turned Basic
  mode off has never seen two trees.
- Fix: one of the two. **(a) Make it true:** when a scenario moves, re-parent each of its own
  alternatives that nothing else uses onto the new parent's choice for that category. Its own values
  stay; the rest now follows the new parent. **(b) Say it:** the help and the comments state the
  behaviour as it is. My recommendation is (a) (question Q3).

**F3. Add Base in an alternative tree makes something that is not a Base. Base edits flow into it.**
OBSERVED (doc 976-979, decision 6 at 1002-1003; `smAdd()` js:5900; tip `lpn_sm_add_base_tip`,
lang:3262).
- What it does: a `root: true` alternative "resolves exactly as a child of Base does". Every value it
  does not hold comes from the elements, so a later Base edit changes it. The tip says "A Base has no
  parent", which is true of the tree but false of the values.
- Bentley: a Base alternative is a root, distinct from a child. "A new alternative can be a Base
  scenario or a Child scenario" (WaterCAD, "Creating Alternatives",
  <https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-630A247563F84CC1B522AF60FD842EC9.html>).
  Whether a second Bentley Base alternative holds a full set of values is my reading
  (SPECULATION), but nothing I read says it inherits from the first. The doc gives no reason for this
  departure from Bentley.
- Interop risk (SPECULATION): Task 749 imports a WaterGEMS file whose second Base physical alternative
  equals Base on most pipes. If it is stored sparse, it silently follows every later Base edit.
- Fix: rewrite the tip for alternative trees: "Add another Base to this tree. It follows the Base
  values for everything it does not override." Note in `dev/bentley-interop.md` that an imported Base
  alternative must be stored as full values. Or drop Add base from the alternative trees and keep it
  for scenarios (question Q7).

### Rank 2: the model contradicts itself where a user can see it

**F4. The Basic mode tip describes the old model, and the doc's Basic-mode invariant is about to stop
being true.** OBSERVED.
- The tip: `lpn_scenario_basic_tip` (lang:3254) says "Checked: a scenario consists only of the values
  set in it". Since 10-12, an override in Basic mode creates a stored alternative, just as it does with
  Basic mode off (doc 949-962). Basic mode changes only what is shown.
- The invariant, as written:
  - Doc line 153: "Basic mode changes no value, no solve and no stored byte".
  - Code comment (js:73597): "The mode changes no value, no solve and no stored byte".
- Today's in-flight rule ("deleting a scenario in Basic mode deletes its unshared alternatives; with
  Basic mode off it leaves them") makes one act write different bytes depending on a browser setting.
- Fix:
  - Tip: "Checked: alternatives are hidden, each scenario shows its overrides as its own, and new
    scenarios are children of Base. Cleared: the Scenario manager and the Scenarios table are shown."
  - Rewrite the invariant in both places to say exactly what Basic mode changes (question Q4).

**F5. In Basic mode, alternative names still show on screen, and they drift away from the scenario's
name.** OBSERVED.
- Where they show:
  - The table tip on an override cell, `paneScnCellTip()` (js:27894, `lpn_pane_scn_alt_tip`
    "{category} alt.: {alternative}"), names the alternative. Its lang comment (lang:1609-1610) says
    that name "in Basic mode is its scenario's".
  - The Change type report line `lpn_change_type_line_alternative` (lang:1678) also names it.
- Why the comment is false: Rename scenario (menu, js:6970) renames only the scenario. The doc
  confirms this at line 954: "renaming the scenario does not rename it".
- The result: a Basic-mode user who renames "Peak Hour" to "Max day" then reads "Demand alt.: Peak Hour"
  in the scenario Max day. The help itself says that "In Basic mode, you see this as simply an override
  in the scenario itself" (lang:3273).
- Fix: either rename carries along the scenario's own alternatives that still bear its old name and are
  used by no other scenario (question Q2), or in Basic mode the tip reads "Override in {scenario}".

**F6. Copy scenario > Make copies creates alternatives at once, under names nobody chose, as frozen
snapshots.** OBSERVED (`smCopyScenario()`, js:6140; `lpn_sm_copy_ask`, lang:3274).
- What 'own' mode does:
  - It duplicates every stored alternative the source names, before any edit.
  - The copies are siblings of the originals, not children.
  - Each is named `<alternative>_copy_for_<copy name>`.
- How that contradicts Tom's rule: "Creating a new scenario creates no alternatives ... until overrides
  are created that need new alternatives", and a new alternative is named like the current scenario.
  - A Copy of a scenario that names five alternatives adds five to the tree, including categories the
    copy will never edit.
  - Because they are siblings, a later fix to the original's alternative never reaches the copy.
- Bentley: the Scenarios Manager page lists New, Delete, Rename, Compute, Make Current, Expand,
  Collapse and Help, with no Copy
  (<https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/35002.html>). The
  Alternatives Manager has Duplicate, "Creates a copy of the currently selected alternative"
  (<https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/35003.html>). So the
  Copy question is ours (H05), not a Bentley shape we must match.
- Fix, under Tom's own rule (SPECULATION on the build, about one flag per scenario per category):
  - The copy names the same alternatives as the source.
  - "Share edits" ticked: edits go into those shared alternatives, as now.
  - Unticked: the copy's first edit in a category creates its own alternative, named like the copy, as
    a child of the shared one.
  - Nothing is created until it is needed, and the copy keeps following the original wherever it has
    not overridden. That turns the question into one tick box. Question Q1.

**F7. The two places that name a scenario disagree about duplicate names.** OBSERVED.
- The menu's New scenario (js:6958) and Rename scenario (js:6970) accept any name, including one
  another scenario already has, and including "Base".
- The manager's `smRename()` (js:5922) refuses a duplicate through `smNameTaken()` (js:5863).
- Why it matters: `smAssign()` and the Scenarios table pick by name, and Compare lists by name. Two
  "Max day" scenarios make the table and the comparison ambiguous.
- Fix: route the menu's prompt through `smNameTaken('scenarios', ...)` and give the same
  `lpn_sm_name_taken` notice.

**F8. "Shared with" counts an inheriting child scenario as a sharer.** OBSERVED (`smSharedText()`
js:6201 reads `smUsedBy()` js:6055, which counts scenarios that inherit; doc decision 4).
- Editing in Peak hour shows "Shared with: Fire at peak" whenever Fire at peak is its child. That is
  inheritance, which is the point of a child, not sharing.
- Once the copy dialog says "Share edits", the word "shared" will mean two different things in one
  feature.
- Fix: say "Also changes: {list}". Or keep "Shared with" for scenarios that name the same alternative,
  and add "and its children: {list}" for those that inherit it.

### Rank 3: stale design records that the next builder will trust

**F9. The design doc and the code headers still describe "choice A", the derived alternatives.**
OBSERVED.
- In `dev/scenario-alternatives.md`, each of these is contradicted by the 10-12 change at 949-962:
  - 23-31: "Nothing carries a parent pointer".
  - 57-58: "no two scenarios share a child alternative".
  - 129-134: "its child alternative vanishes".
  - 144-146: "A is still what every Basic-mode project is: nothing about the tree is stored until an
    explicit act".
  - 860: "Stored only on an explicit act".
- Also in the doc:
  - 914-916: "Deleting ... a scenario is refused while anything uses it". The code refuses only while
    it has child scenarios.
  - 1031-1035: "`effective()` is NOT rewired". It reads `resolvedOverrides()`.
- In the code: the header at js:4878 says "NOTHING HERE IS STORED". The functions under it
  (`alternativesOf()` js:4963, `allAlternatives()`, `alternativeById()`,
  `resolveThroughAlternatives()`, `alternativeOverrides()`) are called only by each other, by
  `dev/lpn-spike/scenario-alternatives-harness.js` and by the seam check. So that harness proves
  equivalence for a model that no longer runs.
- In the language file: the translator-facing comment at lang:3202-3205 still says "'Own values', not
  'overrides'", right above the "overrides" key.
- Fix: rewrite those doc paragraphs in place, keeping the one rejected alternative (derive on the fly)
  with its reason. Delete the derived functions, or point their harness at the stored tree. Fix the
  lang comment.

**F10. The ready-made scenarios every new project starts with are stored in the pre-10-12 shape.**
OBSERVED (`presetScenarios()`, js:3374).
- Average Day, Max Day, Peak hour and Fire plus max day hold `s.demandMultiplier` directly, as
  implicit values. So every new project opens on the "file from before" path, with derived items such
  as `max_day:calculation` (doc 958-962).
- The three flow tests copy the document's multiplier when it states one ("They seed the document's
  multiplier the way createScenario() does", js:3354). `createScenario()` stopped seeding on 10-06
  (js:6797, Perry). A seeded copy stops following Base. That is exactly the defect Perry removed from
  New scenario.
- Fix: seed nothing for the flow tests. Give the other four a stored calculation set each, named after
  the scenario, as an override would create.

**F11. "Apply Base values to all scenarios" acts on alternatives but speaks of scenarios.** OBSERVED
(`pushBaseToScenarios()`, js:7265; tip lang:3252).
- It deletes the shown-label properties from every override map, including alternatives no scenario
  uses. It leaves settings overrides alone. Its count of "Scenarios affected" is computed through
  `treeLayers()`, which is right.
- Low harm. The words could say "in every alternative" when Basic mode is off. Low.

### Rank 4: gaps against "every property is overridable"

**F12. Nothing a customer carries is overridable** (js:12550 section note; doc 95-97), while Tom's
10-12 rule says every property is.
- The workaround works: a customer on a junction that is inactive in a scenario drops out of that solve
  (js:66688, `lpn_customer_node_inactive`). So a subdivision drawn in its own scenario still behaves.
- The reason given (Task 468, a demand row has no stable key) does not apply to a customer, which has an
  id, and the code itself says so. This is the doc's one remaining exclusion that rests on a reason
  that no longer holds. Low-medium. Tom's call.

**F13. Controls and rules are not per scenario** (doc 258, "Not yet"; Bentley's Operational
alternative).
- From my seat this is the largest remaining gap for system planning. A different control set per
  scenario is routine: a new tank's fill rule, a pump station that exists only in 2035 runs.
- Today, controls on an inactive asset are dropped and said (doc 793-800). That is honest, but it is
  not a control set per scenario. Not this branch. Recorded so it is not mistaken for done.

**F14. The doc says a unit change does not convert unit-bearing values held in a scenario's settings
block** (doc 929-931). I did not verify whether that is still true. If it is, a scenario that holds
New assets: Diameter or a contour interval reads wrong after Convert as. Check it before the merge.

---

## Today's in-flight decisions, read from the utility seat

- **Copy properties copies overrides only, in a non-Base scenario: I agree,** and the reason is worth
  recording. Paste writes every value that differs (js:52030 and following). A what-you-see copy would
  therefore write the source's unrelated Base values onto every target as new overrides: its minor
  loss, status, bulk coefficient. That is the wrong outcome for the common capital-program case ("give
  pipes 2 to 9 the same upsizing as pipe 1"). The open question is what "overrides" means; see Q5.
- **Paste creates the scenario's own alternative, as any edit does:** consistent. No comment.
- **Delete in Basic mode removes its unshared alternatives:** I agree. Bentley keeps them ("The
  alternatives and data records referenced by that scenario exist until you explicitly delete them",
  35002.html above). But in Basic mode a kept alternative is invisible clutter, and it takes the name a
  re-created "Peak Hour" would want, so the new one becomes "Peak Hour_2" (`smUniqueName()`).
  - Define "unshared" as: no other scenario names it or inherits it, **and** it has no child
    alternative.
  - The cost is F4: the invariant must be rewritten.
- **"Share edits":** good words. They collide with F8 until that is fixed.
- **Text position overridable, in Presentation: I mildly disagree with the category.** A Text's words
  and its on/off are in the Text category (doc 76). Its position going to Presentation splits one Text
  across two alternatives. A node's position, by contrast, sits with the node's other physical data.
  Either keep the position in the Text category, or fold the whole Text category into Presentation.
  I prefer folding (Q6): Tom's own example, "Figure 6-1: Elm and Main contours", is then a single
  Presentation alternative holding the view, the label settings and the figure's annotation.

## Where we depart from Bentley

| Behaviour | Ours | Bentley (cited) | Reason recorded? |
|---|---|---|---|
| First edit in a scenario | creates the scenario's own alternative (`ownWriteTarget()`) | I could not confirm from a page what happens when a scenario still uses a Base alternative. SPECULATION: the edit lands in that Base alternative, which is the hazard Tom's rule removes | Yes (Tom, 10-12) |
| Delete scenario | keeps its alternatives; Basic mode will remove the unshared ones | keeps them (35002.html) | Yes, for Basic mode |
| Add Base, alternative tree | follows Base values | a base alternative has no parent (GUID-067F08A8, GUID-630A2475) | **No** (F3) |
| Copy scenario with a question | ours | no Copy on the Scenarios Manager page; Duplicate for alternatives (35002, 35003) | Yes (H05) |
| Merge alternative | refused unless the target is an ancestor or a sibling | "Moves all records from one alternative to another" (35003) | Yes (Perry: no user's value moves) |
| Delete an alternative in use | refused, naming who | I do not know; not on the pages I read | n/a |
| Calculation as a sparse set with a parent | ours | a set a scenario names | Yes (doc 644-661) |
| Presentation, position and view per scenario | ours | outside the scenario model | Yes |
| Reparent a scenario | own alternatives keep their parents | the same, I believe | Yes, but the words say otherwise (F2) |

## Scale (my standing brief)

- Per-key cache mending was measured at 2,000 and 8,000 elements: 3.6 ms and 11.1 ms for a demand on
  every junction (doc 893-898). OBSERVED. That is fine at system scale.
- I found no measurement of Show scenarios at system scale: 2,000 pipes times 10 scenarios is 20,000
  rows. I do not know how it behaves.
- The manager's trees are per category and stay small. Real capital-program scenario counts are single
  digits to a couple of dozen (journal 2026-09-30, Lawrence KS: seven plans). CITED in my journal.

## Design questions only Tom can decide, each with my recommendation

1. **Copy scenario: create the copies at once, or when first needed?** Recommendation: when first
   needed (F6). One tick box, "Share edits". Unticked, the copy's first edit in a category creates its
   own alternative, named like the copy, as a child of the shared one.
2. **Should renaming a scenario rename its own alternatives?** Recommendation: yes, but only those that
   still bear the scenario's old name and that no other scenario uses. Otherwise Basic mode shows stale
   names (F5).
3. **Should moving a scenario re-parent its own unshared alternatives onto the new parent's choices?**
   Recommendation: yes. It makes "what it inherits follows the new parent" true (F2).
4. **May Basic mode change what an act writes to the file?** Recommendation: yes, accept it. Rewrite
   the invariant to say exactly what Basic mode decides: what is shown, the parent of a new scenario,
   and what a scenario delete removes.
5. **Copy properties in a scenario: does "overrides" mean the scenario's own only, or everything that
   differs from Base as you see it?** Recommendation: everything that differs from Base. In a child
   scenario the upsizing you can see was usually inherited, and "No overrides to copy" on a visibly
   upsized pipe would mislead. The cost is that it does not match the amber ring, which marks only the
   scenario's own.
6. **Text position: Text category or Presentation?** Recommendation: fold the Text category into
   Presentation, so one figure scenario is one alternative. The second-best option is to keep a Text's
   position in Text.
7. **Add Base in an alternative tree: keep it with an honest tip, or remove it?** Recommendation: keep
   it for scenarios. For alternatives, either rewrite the tip or remove it until Task 749 needs a true,
   full-value Base.

## "What is left on this branch?" (Tom's question), from the code and the doc

1. **Today's five in-flight decisions:** Copy properties overrides only with "No overrides to copy";
   paste through the own-alternative path; delete in Basic mode; "Share edits"; Text position
   overridable.
2. **Wording that is false or stale now:** F1 (both delete doors), F4 (Basic mode tip), F5 (alternative
   tip in Basic mode), F8 ("Shared with"), and the translator comment at lang:3202-3205. Each is an
   English edit, so each owes a translation pass.
3. **Behaviour to make consistent, once Tom answers:** F2 (reparent), F3 (Add Base), F6 (Copy), F7
   (menu name uniqueness), F10 (the ready-made scenarios' storage).
4. **Record-keeping:** rewrite the stale doc paragraphs and code headers (F9). Delete the derived layer
   or repoint its harness.
5. **Gaps the doc names itself:**
   - Contour box rows are not marked when a scenario holds them (doc 511-513).
   - Unit conversion of settings blocks (F14, check it).
   - Controls and rules per scenario (F13, a later task).
   - Customers (F12, Tom's call).
6. **Questions already out to Tom** (`dev/session-handoff.md`, 10-12): delete leaving its own
   alternatives (answered in flight), and "Share them" changing the original with no note at that
   moment (the in-flight wording plus F8).
7. **Merge:** feat/match-property is already merged into this branch (a9be8bec). The handoff says the
   two merge to master together, on his typed word, with the suite run on the combined merge and a
   check that pasting an elevation inside a scenario no longer writes Base.
8. **Not this branch:** Task 749 (`.wtg.sqlite`, blocked on a sample file) and Task 752 (Sheets). Both
   are at priority 75, and the doc's stage 7 (interchange) waits on them.

Sources: Bentley WaterGEMS SS6 Scenarios Manager
<https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/35002.html>; Alternatives
Manager <https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/35003.html>; Base and
Child Alternatives
<https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-067F08A81CE747CDBDFB93AD301E0CFD.html>;
WaterCAD Creating Alternatives
<https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-630A247563F84CC1B522AF60FD842EC9.html>;
WaterGEMS Creating Scenarios
<https://docs.bentley.com/LiveContent/web/Bentley%20WaterGEMS%20SS6-v1/en/GUID-B9F73478EF5B4A5A88D3C38AF5BA95B1.html>
("By default, a new scenario comprises the Base Alternatives associated with each alternative type");
WaterCAD Base and Child Scenarios
<https://docs.bentley.com/LiveContent/web/Bentley%20WaterCAD%20CONNECT%20Edition%20Help-v1/en/GUID-0BF66DD0533B4F4AA15BE7D9AC3F8690.html>.
