VS Code Profiles — Usage and Billing Tips

Profiles

- Claude-Translation (Copilot disabled)
  - Purpose: Run translation sprints, spawn parallel agents, avoid inline suggestions.
  - Creation: Command Palette → Preferences: Create Profile → name `Claude-Translation` → Start fresh or From current settings.
  - Disable Copilot: Extensions → GitHub Copilot → Disable (Workspace).

- Copilot-Coding (Copilot enabled, manual accept)
  - Purpose: Active coding, manual completion accept only.
  - Creation: Command Palette → Preferences: Create Profile → name `Copilot-Coding`.
  - Settings: Ensure `editor.inlineSuggest.enabled` = false, `editor.acceptSuggestionOnEnter` = off.

Switching Profiles

- Command Palette → Preferences: Switch Profile... → choose profile.

Billing Tips

- Prefer annual billing when available — cheaper per year.
- Disable inline suggestions to reduce API usage.
- Avoid Copilot Chat for large multi-file generation and translation batches.
- Monthly review steps: check GitHub billing page, estimate monthly usage, toggle annual if over budget.

Quick commands

Run these in WSL/terminal to view PHP CLI version:

```bash
php -v
```

Notes

- Profiles are stored by VS Code in the user data directory, not in the repo. The `profile-usage.md` documents steps for team members to reproduce.
