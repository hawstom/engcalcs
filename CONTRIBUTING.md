# Contributing to EngCalcs

Thank you for considering a contribution! This guide assumes **you may be completely new to
programming, and may have never used Git before.** That's fine — everything below is written for
that starting point. If you get stuck at any step, use the [contact form](https://hawsedc.com/engcalcs/contact.php)
and ask; you won't be the first person to need help here.

If you'd rather have an AI assistant walk you through these same steps interactively, that's
encouraged too — see [Section 6](#6-use-an-ai-assistant-to-audit-your-own-change-before-you-submit-it)
and the [AI-Assisted Contribution](README.md#-ai-assisted-contribution) section of the README.

## Think Like a CEO, Not a Coder

AI coding agents (Claude Code, Claude Sonnet, GitHub Copilot, and others) are now good enough, and
getting better every year, that your job as a new contributor is not to personally type every line
of code — it's to direct an agent the way a CEO directs a skilled report. State the goal clearly,
give it the context it needs, review what it produces, ask questions when something is unclear,
push back when something looks wrong, and make the final call before anything ships. This isn't a
temporary workaround for not knowing how to code yet — it's increasingly just how software gets
built, and it only becomes more true as agents improve.

Concretely, on this project:

- **You bring the judgment:** what should change, why it matters, whether the result actually
  solves the real-world hydraulic-engineering problem, whether it fits how field engineers will
  actually use it.
- **The agent brings the mechanics:** reading the relevant files, drafting the diff, running
  checks, explaining what it did.
- **You are always the one who reviews and approves before anything is submitted** — that's exactly
  what [Section 6](#6-use-an-ai-assistant-to-audit-your-own-change-before-you-submit-it) below walks
  through.

This doesn't mean rubber-stamping whatever an agent produces — a CEO who approves things blindly is
a bad CEO, and an unreviewed AI-written pull request is not a safe one. It means you don't need
years of programming experience before your first contribution here. You need curiosity, the
ability to describe clearly what you want, and the discipline to check the agent's work before you
call it done — not a computer science degree.

## Table of Contents

- [Think Like a CEO, Not a Coder](#think-like-a-ceo-not-a-coder)
1. [What You'll Need](#1-what-youll-need)
2. [Two Ways to Contribute Without Writing Code](#2-two-ways-to-contribute-without-writing-code)
3. [Get the Code (Fork & Clone)](#3-get-the-code-fork--clone)
4. [Make Your Change](#4-make-your-change)
5. [Test Your Change](#5-test-your-change)
6. [Use an AI Assistant to Audit Your Own Change Before You Submit It](#6-use-an-ai-assistant-to-audit-your-own-change-before-you-submit-it)
7. [Submit a Clean Pull Request](#7-submit-a-clean-pull-request)
8. [What Happens Next](#8-what-happens-next)
9. [Project Conventions Cheat Sheet](#9-project-conventions-cheat-sheet)

## 1. What You'll Need

- **A free [GitHub](https://github.com) account.** GitHub is a website that hosts this
  project's source code and lets people propose changes ("pull requests") without ever touching the
  original copy directly.
- **Git**, a tool that tracks changes to code over time. If you don't have it, install it from
  [git-scm.com](https://git-scm.com/downloads) (Windows/Mac/Linux installers available).
- **A text editor.** [VS Code](https://code.visualstudio.com/) (free) is a good choice, especially
  because it has good support for AI coding assistants.
- **PHP**, to run the calculators locally so you can see your change in a browser before submitting
  it. See the README's [Getting Started](README.md#getting-started-run-it-locally) section.
- **An AI coding assistant** — [Claude Code](https://claude.com/product/claude-code), GitHub
  Copilot, or similar. Given the "CEO, not coder" approach above, this is the closest thing to a
  real requirement on this list for a first-time contributor, not an optional extra. You do not
  need a paid subscription to get real value here; even a free tier or a browser-based chat with
  Claude/ChatGPT can read a file, explain it, and draft a change for your review.

You do **not** need to know what Git or a pull request is before you start — that's covered below.
You also do not need to already know PHP or JavaScript — directing an assistant well matters far
more than typing syntax from memory.

## 2. Two Ways to Contribute Without Writing Code

Not every contribution requires programming:

- **Translations.** All visible text lives in 27 `lib/lang.ec.??.php` files, backed by a glossary
  (`dev/scripts/glossary.json`) that exists specifically to document *why* a term was chosen in
  each language — the dominant standard translation, terms to avoid, and the human reasoning
  behind it. Because of that, translating well here is not really "go edit one file" — it's telling
  someone about a suggested improvement so it gets documented and applied correctly, not just
  dropped into a string. If you're fluent in a language other than English and something reads
  wrong or could be better, the most valuable contribution is usually to describe the suggested
  wording and *why* (regional convention, an established engineering term, a mistranslation) via
  the [contact form](https://hawsedc.com/engcalcs/contact.php) — or, if you're working with an AI
  assistant, tell it your suggestion and ask it to record and apply it following the glossary/intent
  process in [CLAUDE.md](CLAUDE.md)'s "Language Keys" section, rather than just changing the text.
- **UX feedback and roadmap ideas.** This is the main advisory need on this project: tell us what's
  confusing, what's missing, or what you wish a calculator did, workflow or design improvements, or 
  candidates for calculator or language additions or retirements. Use the feedback link on any 
  calculator page or the [contact form](https://hawsedc.com/engcalcs/contact.php). No coding required. 
  (And, heaven forbid — in the unlikely event you spot an actual formula or math mistake — report that 
  the same way.)

Everything from here on is for contributions that do touch code.

## 3. Get the Code (Fork & Clone)

**"Forking"** makes your own personal copy of this repository on GitHub, which you can freely
edit. **"Cloning"** downloads that copy onto your computer so you can work on it.

1. Go to [github.com/hawstom/engcalcs](https://github.com/hawstom/engcalcs) and sign in.
2. Click **Fork** (usually near the top of the repository page) to create your own copy, e.g.
   `github.com/your-username/engcalcs`.
3. On your fork's page, click the green **Code** button and copy the HTTPS URL it gives you. The clone command will look like:

   ```bash
   git clone https://github.com/your-username/engcalcs.git
   cd engcalcs
   ```

4. Run those two lines in a terminal (macOS/Linux: Terminal app; Windows: Git Bash, installed
   alongside Git). This downloads the code to a new `engcalcs` folder on your computer.

You now have your own local, editable copy of the entire project.

## 4. Make Your Change

This is where the "direct the agent" approach from the top of this document applies most directly.
A CEO doesn't sit down and personally draft the memo — they describe the outcome they want and let
a capable report produce a first draft to react to. Do the same here:

1. **Create a branch** — a separate, named line of work so your change doesn't get mixed up with
   anything else:

   ```bash
   git checkout -b my-first-change
   ```

   (Pick a short, descriptive name instead of `my-first-change` if you know what your change will
   be, e.g. `fix-mpf-typo` or `add-swahili-orifice-keys`. Your AI assistant can suggest one from a
   plain-language description of what you're doing.)

2. **Describe the goal to your assistant in plain language, then let it read before it writes.** For
   example: *"I want to fix a typo in the Manning Pipe Flow tooltip that says 'depht' instead of
   'depth'. Read Manning-Pipe-Flow.php, find it, and tell me what you plan to change before you
   change anything."* This project's own convention (see [CLAUDE.md](CLAUDE.md)) is to read the
   full file before editing and never assume its prior state — ask your assistant to do exactly
   that, and to state its plan back to you before it edits anything, so you can approve it first,
   the same way a CEO signs off on a plan before work starts, not just the finished result.
3. **Review the plan, then let it make the edit.** Keep it focused — a pull request that changes
   one thing is far easier for a human to review (and for an AI assistant to audit later) than one
   that changes many unrelated things at once. If your assistant's plan drifts into unrelated files
   or a bigger change than you asked for, say so and redirect it, the same way you'd redirect a
   report whose draft went off-brief.
4. **Check the architecture guide.** [CLAUDE.md](CLAUDE.md) documents conventions specific to this
   project (how calculators are structured, the variable-prefix convention, unit handling,
   translation rules). Ask your assistant to check its own draft change against this file before you
   move on — it should be able to tell you whether it followed the conventions, not just whether the
   code runs.

## 5. Test Your Change

There's no formal automated test suite in this repository yet, so "testing" means:

- **Open the page in your browser** (see the README's [Getting Started](README.md#getting-started-run-it-locally)
  steps) and confirm the calculator still works and looks right after your change.
- **For a calculator math change:** write a small Node.js script that loads the calculator's JS
  file directly and checks its output against a known, published worked example. For instance:

  ```js
  // quick-check.js — run with: node quick-check.js
  const dw = require('./js/darcy-weisbach.js');
  // ...call the relevant function with known inputs and log the result...
  ```

  This is the same verification pattern used in this project's own math audits — see
  `dev/calculator-math-audit-checklist.md` for the full pattern (worked-example verification,
  boundary-input checks, etc.). Ask your AI assistant to help you write this script if you're not
  sure how — see Section 6.
- **For a translation change:** if you're comfortable running PHP scripts, `dev/scripts/lang_syntax_validate.php`
  checks your edited language file for common mistakes (unbalanced tags, HTML entities that should
  be literal characters, etc.). If that's more than you want to take on, just make the edit as
  cleanly as you can — a reviewer can run this for you.

## 6. Use an AI Assistant to Audit Your Own Change Before You Submit It

This is the "review and approve" step from the top of this document, made concrete — the point
where you act as the CEO signing off on a report's work, not just its author. This is also the step
that lets a newcomer submit a genuinely clean, low-friction pull request on the first try. **Before
you push anything**, ask an AI assistant (Claude Code, Copilot Chat, or similar, opened in this
project's folder) to review your work. Copy-paste-ready prompts:

1. **Review the diff for correctness and scope:**

   > Run `git diff` in this repository and review it. Does the change do what it claims to do?
   > Is anything changed that looks unintentional or unrelated to the stated goal? Point out
   > anything that looks like a mistake, a leftover debug statement, or an accidental formatting
   > change.

2. **Check it against project conventions:**

   > Read CLAUDE.md, then check my `git diff` against its conventions — especially variable naming,
   > unit handling, and (if I touched a `lib/lang.ec.*.php` file) the language-string rules in the
   > "Language Keys" section. Flag anything that doesn't match.

3. **Confirm no collateral damage:**

   > Run `git diff --stat` and confirm the list of changed files matches only what I intended to
   > change. If anything else was modified, tell me what and why it might have changed.

4. **Have it draft your pull request description:**

   > Summarize my `git diff` into a short pull request description: what changed, why, and how I
   > tested it.

Fix anything the assistant flags, then re-run these checks once more before moving on. This step
is not about handing off responsibility to the AI — it's a second pair of eyes that catches
mistakes before a human reviewer has to, which makes your first contribution faster and less
stressful for everyone, including you.

## 7. Submit a Clean Pull Request

1. **Commit your change** with a clear, short message describing *what* changed:

   ```bash
   git add -A
   git commit -m "Fix typo in Manning Pipe Flow tooltip"
   ```

2. **Push your branch to your fork:**

   ```bash
   git push origin my-first-change
   ```

3. **Open a pull request.** On GitHub, go to your fork's page — it will usually show a banner
   offering to **Create pull request** for the branch you just pushed. Click it, and:
   - Set the destination to `hawstom/engcalcs` (the original repository), branch `master`.
   - Write a short description: what you changed and why. (If you did Section 6 above, you already
     have this written.)
   - Submit it.

That's the whole process — you don't need to know any more Git than the commands above to make a
clean, reviewable contribution.

## 8. What Happens Next

Tom (or another maintainer) will review your pull request, usually leaving comments directly on the
change. It's completely normal to be asked for a small revision — that's a routine part of how
every contribution, including experienced maintainers' own changes, gets merged. Once it looks
good, it will be merged in.

If you'd like feedback, mentorship, or just to talk through what to work on next, see the
[Join the Community](README.md#join-the-community) section of the README — advisorship, testing,
and mentorship in using AI tools to contribute here are all open invitations, not just one-off pull
requests.

## 9. Project Conventions Cheat Sheet

For anything not covered above, the authoritative references are:

- **[CLAUDE.md](CLAUDE.md)** — architecture, how to add a calculator, variable-prefix convention,
  unit families, language-key rules, translation-sprint mechanics.
- **`dev/calculator-math-audit-checklist.md`** — how this project verifies calculator math.
- **`dev/cross-platform-planning.md`** — how human and AI contributors coordinate on this project.

A few rules worth knowing before your first edit, pulled from those documents:

- **Read the full file before editing it** — don't assume you know its current state.
- **Match existing formatting exactly** (indentation, quote style, heading levels).
- **`$ec_lang` strings are single-quoted PHP**, e.g. `$ec_lang['key']='value';` — never double-quoted.
- **Never edit an `$ec_lang_intent` entry.** That array is reserved for the maintainer's own
  translation-guidance notes; AI assistants and contributors should not add, change, or remove its
  values without the maintainer's explicit, written go-ahead in the pull request discussion.
