---
name: add-calculator
description: Checklist for adding a new calculator page to the EngCalcs suite (prefix, language keys, units, menu, meta description, JS cache-busting, worked example, payload prefix). Use when creating a new calculator.
---

# How to Add a New Calculator

1. Copy an existing calculator (e.g. `Manning-Pipe-Flow.php`).
2. Choose a short prefix and add it to the Variable Prefix Convention table in `CLAUDE.md`.
3. Define `$arrayInputs` and `$arrayResults` referencing `$ec_lang['prefix_key']`. Declare each
   field's units as a **family name** (`'units' => 'distance_small'`), never an inline array.
4. **Add language keys to `lib/lang.ec.en.php` ONLY.** An absent key falls back to English; a key
   byte-identical to English in another file blocks the build. Then regenerate the payloads.
5. Write `EngCalcs.pageCalculator = function(objForm) { ... }` in the page's `<script>` block.
6. Call `echoHeader`, `echoCalculatorForm`, `echoFeedback`, `echoFooter`.
7. Add it to `lib/Menus.lib.php`.
8. Set `$html_desc = $ec_lang['<prefix>_main_desc'];` before `echoHeader()`. Reuse `_main_desc`;
   never add a meta-description key, and never point `$html_desc` at a title. It also feeds
   `og:description`.
9. Include the JS with `filemtime()` cache-busting, never a hardcoded `?v=N`:
   `<script src="/engcalcs/js/my-calc.js?v=<?=filemtime(__DIR__.'/js/my-calc.js')?>"></script>`
10. **Add a worked example to `dev/calc-spike/`** anchored against the source method
    (`mpf-harness.js` is the model; recipe in `dev/calc-spike/README.md`).
11. **Add the prefix to `prefixToTermNames()` in `dev/scripts/generate_translation_payloads.php`.**
    A missing prefix silently falls back to three default terms; verify by reading
    `glossary_terms_by_prefix.<prefix>` out of a generated payload.

