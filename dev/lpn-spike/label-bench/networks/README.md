# Published benchmark networks for the label bench

Utility-scale networks from outside this project, so the bench is not "all Net3" (Tom, 2026-09-28,
Task 741). Each file is the publisher's own, byte for byte; `extract.js --gen '{"bench":"<NAME>",...}'`
reads it with the app's own `.inp` importer. **These files keep their own licences, not this
repository's GPL.**

| File | Size | Source | Licence | Attribution |
|---|---|---|---|---|
| `L-TOWN.inp` | 782 junctions, 905 pipes | BattLeDIM 2020, Zenodo record 4017659 (doi:10.5281/zenodo.4017659), sha256 `a7551b86…` | **CC BY 4.0**, stated on the Zenodo record | Vrachimis, S. G., Eliades, D. G., Taormina, R., Ostfeld, A., Kapelan, Z., Liu, S., Kyriakou, M. S., Pavlou, P., Qiu, M., and Polycarpou, M. M. (2020). *Dataset of BattLeDIM: Battle of the Leakage Detection and Isolation Methods*. Zenodo. KIOS Research and Innovation Center of Excellence. |
| `C-TOWN.inp` | 388 junctions, 429 pipes | BATADAL, https://www.batadal.net/data/CTOWN.INP, sha256 `9198b0bb…` | **CC BY 4.0**, stated on https://www.batadal.net/data.html ("This work is licensed under a Creative Commons Attribution 4.0 International License") | Taormina, R., et al. (2018). The Battle of the Attack Detection Algorithms. *J. Water Resour. Plann. Manage.* 144(8). C-Town originates in Ostfeld et al. (2012), the Battle of the Water Calibration Networks. |

Downloaded 2026-09-30. Changes made: none.

## Considered and not added

- **Anytown, KY1-KY17, Modena, Balerma, Fossolo, the other UKnowledge (ASCE Task Committee)
  networks**: licensed **CC BY-NC 4.0** on their UKnowledge pages. That is a clear licence but not an
  open one (no commercial use), so they are not committed to this repository.
- **BWSN networks 1 and 2, Hanoi, E-Town (BIWS), Richmond, D-Town, Micropolis, KL, Jilin, the
  Exeter CWS benchmarks**: no licence found at their source. Copies in other repositories carry
  that repository's licence, which is not the network author's grant.
- **WNTR's Net6**: shipped in a BSD-licensed repository, but the network is from Watson, Murray and
  Hart (2009) and no grant for the network itself was found.
- **CY-DBP** (KIOS, BSD 3-Clause, confirmed): licence fine, but 273 junctions and a 2.2 MB file of
  quality patterns, so it adds little a label bench can use; not added.
- **ky-all** (listed CC BY 4.0 by the WaterBenchmarkHub catalogue): hosted on a personal file share
  and built from the CC BY-NC Kentucky set; the grant could not be confirmed at a source.
