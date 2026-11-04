# The built-in `.wtg` export template

`wtg-template.wtg.sqlite.gz` and `wtg-template.wtg.gz` are the project that File > Export > Network >
`.wtg.sqlite file…` writes the open network into. The page fetches them from this site, once, when an
export runs (never at page load, never precached) and unpacks them in the browser.

## Where it comes from

A project the owner saved in his own WaterGEMS (26.0.0.532, schema 1.0.54.0) that holds one of every
element kind, emptied by `dev/scripts/build_wtg_template.js`: every element was removed except one
junction, reservoir, tank, pipe, pump, the six valve kinds (PRV, PSV, PBV, FCV, TCV, GPV), the pump
definition, one pattern and the valve headloss curve, each as the program saved it. The edit log,
the selection sets, the graph, the project name and the notes were removed, and the project is named
"Network". The `.wtg` is the program's own save, in US customary display units. No author name, company, path or machine
name is in either file.

## Rebuild

The source project is kept outside the repository (`~/webdev/fixtures/wtg-tgh-1/`). Then:

    node dev/scripts/build_wtg_template.js --src <project.wtg.sqlite> --src-wtg <project.wtg>

Bump `TEMPLATE_VERSION` in `js/lpn-wtg-export.js` when the files change, and regenerate the golden
(`WTG_WRITE_GOLDEN=1 node dev/lpn-spike/wtg-page-export-harness.js`). Record: `dev/wtg-export.md`.
The template is a WaterGEMS-saved layout shipped as is; no letter to Bentley precedes release (Tom, 2026-11-03).
