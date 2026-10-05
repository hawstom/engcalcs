# Real-world usage reviews

What people outside this project said and did when they used the looped network page. One entry per
session, newest first. Record what the tester did and said; Tom's reading of it goes in quotes and is
marked as his. The actions it produced live in `dev/tom-review-queue.md` under the R-numbers given.

## 2026-10-04 -- DDN, Italian engineer, weekend test

Reported by Tom 2026-10-05, DDN's words quoted. Tested production (9c71d54f).
- Online, with satellite tiles drawing, he saw the `lpn_time_no_engine` banner telling him to
  "Connect to the internet one time to fetch the EPANET solver": *"it's not clear why it asks me to
  connect to the internet."* Diagnosis under way the same day.
- *"After clicking on start a model now, there is a landing page with active projects, templates,
  etc. When I start a project and close it, the landing page is not shown anymore. Perhaps you can
  create 'Start' or 'Home' button."* Tom asked back whether he means the empty first project should
  close silently when he opens an example.
- *"It would be good to show map tips when hovering the mouse on a feature."* Tom asked back whether
  he means asset properties on hover.
- *"On the animation buttons, it would be good to insert a button for restart (<<). Maybe also for
  end (>>) too?"* Tom: *"Yes ... it's important. Maybe the buttons can be smaller."*

## 2026-09-25 -- IOD, senior civil engineer

Reported by Tom.
- "He said he is impressed."
- "He liked and latched onto the name EPANET++."
- "He said we need to make migration from WaterCAD easy. This means interoperability." Tom: "This
  means import WaterCAD files. This means to study the WaterCAD features and interface." (R-230;
  Mary's `dev/agents/market-researcher/watercad-migration.md`, Sue's journal of the same date.)

## 2026-09-23 -- MOD, first-use test

Reported by Tom (R-202 to R-209 in the review queue).
- Could not find fire flow analysis. Clicked the map, then the toolbar, accidentally invoked New
  project, and found it under Water.
- Suggested making the menus "a color that stands out like on a phone app ... and enlarged, icons
  too." Tom, 2026-09-25: "Every tester so far has been very slow to find the menus, not the toolbars."
- The hint above the toolbar did not help him; he suggested a coloured light bulb. Tom declined that
  and had the hint deleted.
- Testing with MOD led Tom to the Net3 Pump 10 and fire-flow-at-a-time-step defects (R-231 to R-233).
