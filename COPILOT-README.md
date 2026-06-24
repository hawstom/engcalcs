EngCalcs — Copilot Onboarding

Purpose
- Add GitHub Copilot to the existing Claude-driven workflow. Complement Claude for translations and large-language tasks with Copilot for in-editor code completion, small refactors, and iterative edits.

Summary of current Claude usage
- See [CLAUDE.md](CLAUDE.md). Claude is used heavily for translation sprints (one agent per language), architecture notes, and large-text generation.

Roles: Copilot vs Claude
- Copilot: in-editor coding help, short/medium completions, unit-test scaffolding, quick refactors, context-aware suggestions.
- Claude: bulk translation, multi-file text generation, policy/architecture writeups, and parallelized language tasks described in `CLAUDE.md`.

How to integrate in this repo
- Use Copilot for editing JS and PHP files under `js/` and root PHP pages. Ask Claude only for batch translations or language-key generation for `lib/lang.ec.*.php` files.
- When preparing a translation sprint, follow `CLAUDE.md` steps and keep Copilot disabled (or limited) to avoid noisy inline suggestions during multi-agent runs.

Workspace files added
- [COPILOT-README.md](COPILOT-README.md): this file.
- [.vscode/settings.json](.vscode/settings.json): workspace settings to prefer manual suggestions.
- [.vscode/extensions.json](.vscode/extensions.json): recommends the Copilot extension.

Cost-control recommendations (~$100–$200/yr)
- Prefer annual billing (lower effective monthly rate) if available — check your GitHub billing page for current plans and promos.
- Reduce automated completions: disable global inline suggestions and use manual triggers to accept completions (see `.vscode/settings.json`).
- Use Copilot only in active coding sessions: toggle the extension off when not coding (Extensions pane → Disable (Workspace)).
- Use Profiles or a dedicated workspace for heavy Claude tasks so Copilot is not active during translation sprints.
- Monitor usage on GitHub billing/dashboard and set a calendar reminder to review monthly.

Practical tips
- Disable `editor.inlineSuggest.enabled` (already set in `.vscode/settings.json`) to require manual invocation.
- Use small, focused prompts in comments to limit long completions.
- For translations or language-key generation, continue using the spawn-per-language pattern from `CLAUDE.md`.

Next steps I can do for you
- Tweak the Copilot workspace settings further (e.g., language-specific toggles).
- Add example snippet comments or templates for common calculator tasks.
- Configure a VS Code profile that disables Copilot for translation work.

If you want, I'll now create a VS Code profile and a short `profile-usage.md` with exact toggle steps.