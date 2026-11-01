# The built-in `.wtg` export template

`wtg-template.wtg.sqlite.gz` and `wtg-template.wtg.gz` are the project that File > Export > Network >
`.wtg.sqlite file…` writes the open network into. The page fetches them from this site, once, when an
export runs (never at page load, never precached) and unpacks them in the browser.

## Attribution (CC BY 4.0)

Derived from **"WaterGEMS models for flow starved water transmission network"**, Abhishek Kumar
Sinha, Anujkumar Ghorpade, Om Damani, and Pradip Kalbar, Indian Institute of Technology Bombay,
Zenodo, 2022-07-29, https://doi.org/10.5281/zenodo.7162154, licensed **Creative Commons Attribution
4.0 International** (https://creativecommons.org/licenses/by/4.0/). The export's receipt carries the
same credit (`lpn_wtg_export_credit`).

**What was changed** (the licence requires saying so), by `dev/scripts/build_wtg_template.js`: every
element of the authors' model was removed except one junction, reservoir, tank, pipe, and pump, the
pump definition, and one pattern; the edit log (a user name and each edit), the selection sets, the
graph, and the project name and notes were removed; the tank was made circular; a one-minute water
quality and report step was set to the defaults; six valve kinds and a valve headloss curve were
added as rows holding the schema's own column defaults; the `.wtg` display units were set to US
customary. Nothing else was altered; the database layout (schema 1.0.44.0) and every default row
are the sample's.

## Rebuild

Download the record's file (`Supplementry information-2.rar`, md5 769380840daf14dd0e4f358394503554),
extract the `EPS_Badapokharan_Operation as per design_base_model` `.wtg` and `.wtg.sqlite` and the
`Badapokharan_MBR_withdrwal capacity curve.wtg.sqlite` (the pattern), as data (nothing is run), then:

    node dev/scripts/build_wtg_template.js --eps <EPS .wtg.sqlite> --eps-wtg <EPS .wtg> \
         --patterns <withdrwal capacity curve .wtg.sqlite>

Bump `TEMPLATE_VERSION` in `js/lpn-wtg-export.js` when the files change, and regenerate the golden
(`WTG_WRITE_GOLDEN=1 node dev/lpn-spike/wtg-page-export-harness.js`). Record: `dev/wtg-export.md`.
Whether shipping a sample-derived template is acceptable to Bentley is for Tom's letter to Bentley,
before any public release.
