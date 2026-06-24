# EngCalcs — Copilot Instructions

This file instructs Copilot (and supports Claude) on how to work on the EngCalcs project.

## Primary Reference

**All project conventions, workflow guidance, and collaboration rules are documented in `.claude/` folder and files.**

**For Copilot: Check `/home/haws/.claude/projects/-var-www-cnm-public-html-hawsedc-engcalcs/memory/MEMORY.md` for accumulated project context before starting any task.**

**For Claude Code: `CLAUDE.md` is the essential reference for this project's architecture, conventions, and workflow.**

Before starting any task:
1. Read and follow the conventions in `.claude/` and project-level docs.
2. Reference the architecture guide (`CLAUDE.md` in project root) for calculator structure, language keys, and unit sets.
3. Consult `cross-platform-planning.md` for role assignments and handoff procedures.
4. Follow the edit checklist before making file changes (read full file, confirm scope, match formatting exactly, show diff, verify no collateral damage).

## Key Files to Know

- `CLAUDE.md` — Architecture, how to add calculators, variable prefix convention, translation sprints, language files, unit sets.
- `cross-platform-planning.md` — Role assignments, responsibilities (IDs 1–16), handoff artifacts and locations.
- `translation-process.md` — Project-specific translation workflow.
- `.claude/` — Platform-specific guidance, settings, and reference materials.

## Coordination Protocol

- See the coordination responsibilities assignments in cross-platform-planning.md

## Critical Practices

- **Read full file before editing** — don't assume prior state.
- **Respect section boundaries** — preserve headings, numbering, and structure outside authorized scope.
- **Match formatting exactly** — whitespace, indentation, markdown levels.
- **Show the diff** — state oldString and newString before applying changes.
- **Ask if ambiguous** — don't infer scope or assumptions.

---

Keep this file short. Grow detailed guidance in `.claude/` and link to it here.
