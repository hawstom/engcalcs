# EngCalcs

**Free, open-source hydraulic engineering calculators for field engineers, irrigation practitioners, and students — in 27 languages.**

[![License: GPL v3+](https://img.shields.io/badge/license-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)
[![Languages](https://img.shields.io/badge/languages-27-brightgreen.svg)](#-languages)
[![PWA](https://img.shields.io/badge/installable-PWA-1a6faf.svg)](#offline--installable)

🔗 **Live site:** [hawsedc.com/engcalcs](https://hawsedc.com/engcalcs/)

---

EngCalcs runs entirely client-side once loaded — PHP's job is just to render the page in your
language and hand off to JavaScript, which does every calculation in your browser. No database,
no accounts, no server round-trips for the math itself. Install it as an offline app, or just open
a calculator page and go.

## Table of Contents

- [What's Inside](#whats-inside)
- [🤖 AI-Assisted Contribution](#-ai-assisted-contribution)
- [Languages](#-languages)
- [Getting Started (Run It Locally)](#getting-started-run-it-locally)
- [Deploying Your Own Fork](#deploying-your-own-fork)
- [How It's Built](#how-its-built)
- [Contributing](#contributing)
- [Join the Community](#join-the-community)
- [Offline / Installable](#offline--installable)
- [License](#license)
- [Contact](#contact)

## What's Inside

16 calculators covering pipe flow, open channels, structures, and irrigation:

| Calculator | What it solves |
|---|---|
| [Manning Pipe Flow](Manning-Pipe-Flow.php) | Partial-full circular pipe flow/depth (Manning) |
| [Manning Pipe Head Loss](Manning-Pipe-Head-Loss.php) | Full-pipe head loss (Manning) |
| [Hazen-Williams Pipe Head Loss](Hazen-Williams.php) | Pressure pipe head loss (Hazen-Williams) |
| [Darcy-Weisbach Pipe Head Loss](Darcy-Weisbach.php) | Pressure pipe head loss (Darcy-Weisbach / Swamee-Jain) |
| [Branched Pipe Network](Branched-Network.php) | Distributary/tree pipe network solver |
| [Looped Pipe Network](Looped-Network.php) | Draw a looped network — junctions, pipes, reservoirs, pumps — on a scaled backdrop image and solve it. Global gradient algorithm, checked against EPANET's own engine |
| [Manning Trapezoidal Channel](Manning-Trap.php) | Open-channel flow, trapezoidal geometry |
| [Manning Irregular Channel](Manning-Irregular.php) | Open-channel flow, surveyed (station/elevation) cross-sections |
| [Rock Chute Design (Robinson)](Rock-Chute.php) | Steep-channel rock lining sizing |
| [Microhydropower](Micro-Hydro-Power.php) | Small-scale hydropower potential |
| [Orifice Flow](Orifice.php) | Flow through a circular or rectangular orifice |
| [Pond & Tank Drain Time](Orifice-Drain-Time.php) | Time to drain a reservoir through an orifice |
| [Weir Flow Simple](Weir-Flow-Simple.php) | Flow over a level-crest weir |
| [Weir Flow Irregular](Weir-Flow-Irregular.php) | Flow over an irregular-crest weir/notch |
| [Canal Seepage](Canal-Seepage.php) | Canal seepage loss & conveyance efficiency |
| [Irrigation Pressure](Irrigation-Pressure.php) | Pressure profile for drip/sprinkler pipe networks |

Full architecture, variable-prefix conventions, and how to add a new calculator: see
[CLAUDE.md](CLAUDE.md).

## 🤖 AI-Assisted Contribution

**New to programming? You are very welcome here — and you don't have to figure this codebase out
alone.**

This project is built and maintained with heavy use of AI coding assistants (Claude Code, Claude
Sonnet, GitHub Copilot), and we actively encourage contributors — especially junior developers,
students, and engineers who aren't professional programmers — to use the same tools to get
oriented, write code, and submit a safe first pull request. Not knowing PHP, JavaScript, or even
Git yet is not a barrier: an AI assistant can act as your translator between "I understand the
hydraulics" and "here's the working code."

**What an AI assistant can do for you here:**

- **Understand the codebase.** Point Claude Code or Copilot Chat at [CLAUDE.md](CLAUDE.md) and ask
  it to explain how a specific calculator works — e.g. *"Read Manning-Pipe-Flow.php and
  js/manning-pipe-flow.js and explain, step by step, how this calculator solves for flow depth."*
  Every calculator is one PHP file (rendering + labels) paired with one JS file (the actual math),
  so this is a small, guided read, not the whole repository at once.
- **Explain unfamiliar engineering terms.** If a term like "Manning's n" or "hydraulic radius" is
  new to you, ask your assistant to explain it in plain language before you touch the code that
  uses it.
- **Write tests.** There's no formal test framework in this repo — verification is done by writing
  a small Node.js script that loads a calculator's JS file directly and checks its output against a
  known, published worked example (see `dev/calculator-math-audit-checklist.md` for the pattern).
  Ask your assistant: *"Write a small Node script that requires js/darcy-weisbach.js and checks its
  head-loss output against this textbook example: …"*
- **Safely prepare your first pull request.** Before you ever push code, ask your assistant to
  review your own diff — see [CONTRIBUTING.md](CONTRIBUTING.md#6-use-an-ai-assistant-to-audit-your-own-change-before-you-submit-it)
  for the exact prompts to use. This step catches typos, formatting mistakes, and accidental
  changes to files you didn't mean to touch — *before* a human ever has to point them out.

Full step-by-step contributor instructions — including how to install Git, clone the repository,
and open your first pull request even if you've never used Git before — are in
**[CONTRIBUTING.md](CONTRIBUTING.md)**.

## 🌐 Languages

EngCalcs is translated into 27 languages: English, Amharic, Arabic, Bulgarian, Bengali, Czech,
German, Spanish, Farsi/Persian, French, Hebrew, Hindi, Croatian, Indonesian, Italian, Khmer,
Burmese, Pashto, Portuguese, Romanian, Russian, Serbian, Swahili, Turkish, Ukrainian, Urdu, and
Chinese. Suggesting or improving a translation is one of the easiest ways to contribute and needs
no programming background — but it's not simply "edit a file": a documented glossary tracks *why*
each term was chosen per language, so your suggestion is best told to the maintainer or an AI
assistant to record and apply correctly. See [CONTRIBUTING.md](CONTRIBUTING.md) to get started, or
[CLAUDE.md](CLAUDE.md) for the full translation workflow.

## Getting Started (Run It Locally)

**Requirements:** PHP (with a built-in web server is enough for local development). No database,
no build step, no `npm install`.

```bash
# 1. Clone the repository
git clone https://github.com/hawstom/engcalcs.git
cd engcalcs

# 2. (optional) turn on DEBUG_MODE (shows HTML validator links)
export APP_ENV=development

# 3. Serve it with PHP's built-in server
php -S localhost:8000

# 4. Open a calculator in your browser
#    http://localhost:8000/Manning-Pipe-Flow.php
```

That's it — there's no separate install step, and there's no MVC framework or build pipeline to
learn. Every page bootstraps itself the same way, with `require_once('lib/base.inc.php')`.

## Deploying Your Own Fork

EngCalcs auto-detects its own install directory (`BASE_DIRECTORY` in `lib/config.inc.php`), so it
works out of the box wherever you place it under your web root — e.g.
`http://your-server/engcalcs/Manning-Pipe-Flow.php`. Two things are still hard-coded to the live
site and worth updating if you deploy your own public fork at a different domain:

- **`CANONICAL_ORIGIN`** in `lib/config.inc.php` — the origin used to build canonical/hreflang URLs
  and the sitemap. Update it to your own domain so search engines index the right site.
- **`start_url` and `scope`** in `manifest.json` — used for installable/offline (PWA) support.
  Update these to match the path where you deployed the app.

## How It's Built

- **PHP renders the page and injects localized strings** (`$ec_lang[...]`) — it does no math.
- **JavaScript does every calculation**, client-side, in your browser.
- **No MVC framework, no database, no build pipeline.** Each calculator is one PHP page plus one
  JS file.

Read [CLAUDE.md](CLAUDE.md) for the full architecture guide: how to add a new calculator, the
variable-prefix convention, unit-family handling, and the translation-sprint workflow.

## Contributing

Contributions of all kinds are welcome:

- **Translations** — describe a suggested wording improvement rather than just editing a string; see
  [CONTRIBUTING.md](CONTRIBUTING.md) for why (the glossary/intent process that documents *why* a
  term was chosen).
- **UX feedback and roadmap ideas** — the main advisory need: confusing workflows, missing
  features, candidate new calculators, candidate languages. Use the feedback link on any calculator
  page or open an issue on GitHub. (Heaven forbid — but in the unlikely event of an actual
  formula or math mistake, report that too.)
- **New calculators** — ideas for hydraulic tools that serve field workers and irrigation
  practitioners, especially in low-resource regions, are especially welcome.
- **Code review / math audits** — see `dev/calculator-math-audit-checklist.md`.
- **Hosting** — if you can mirror EngCalcs for a region with limited connectivity, please reach out.

Start with **[CONTRIBUTING.md](CONTRIBUTING.md)** — it assumes no prior Git experience.

## Join the Community

Beyond code contributions, we're building a small community of **advisors, testers, and
mentees** around this project:

- **Advisors** — practicing hydraulic/civil engineers willing to weigh in on the *roadmap*: which
  features are worth building, design/UX decisions, candidate new calculators, and which languages
  are worth adding next — not just reviewing formulas line by line, though that's welcome too.
- **Testers** — field engineers, students, or irrigation practitioners willing to try a calculator
  on a real problem and report back what worked or didn't.
- **Mentees** — new to coding and curious how AI tools like Claude Code can take you from "I don't
  know how to program" to a merged pull request? Free, informal mentorship is available — ask via
  the [contact form](https://hawsedc.com/engcalcs/contact.php).

Use the feedback link at the bottom of any calculator page, or the
[contact form](https://hawsedc.com/engcalcs/contact.php), and say what you'd like to help with.

## Offline / Installable

EngCalcs works as a Progressive Web App. Visit any calculator page while online and it caches
itself for offline use — install it to your phone or desktop home screen for one-tap, no-connection
access in the field. Details: [Install.php](Install.php).

## License

EngCalcs is **Free/Libre Open Source Software (FLOSS)** — not "source available," not
freeware-with-strings-attached. It's released under the
[GNU General Public License v3.0 or later](https://www.gnu.org/licenses/gpl-3.0.html) (full text:
[LICENSE](LICENSE)): you may use, study, modify, and redistribute this code, for any purpose,
including commercially — with the one condition that anything you build on it and distribute stays
just as free for the next person. That copyleft condition is deliberate: it's what keeps this a
shared commons rather than a one-way donation of code into a closed product, and it's part of why
building a real contributor community (see [above](#join-the-community)) matters here, not just
accepting occasional patches.

Copyright © 2009–2026 Thomas Gail Haws.

## Contact

Tom Haws — hydraulic engineer and author of these calculators.
Use the [contact form](https://hawsedc.com/engcalcs/contact.php), or the feedback link on any
calculator page.
