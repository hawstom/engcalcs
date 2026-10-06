# Coded survey points: how others turn a Description into linework, and how a branch meets a node

2026-10-05, Mary (market-researcher), answering Tom's question 2. Tags: CITED, OBSERVED, SPECULATION. Primary pages read are named; "search summary" means I saw only a search digest.

## 1. What exists in this repo

- **OBSERVED.** `js/lpn-survey.js` reads a point list with a named column order chooser (PNEZD and its permutations) and makes junctions only. Header comment, lines 9-11: *"JUNCTIONS ONLY, AND NO PIPES... Which of them are connected, and in what order, is a decision the surveyor did not write down and we must not invent."*
- **OBSERVED.** The trailing D of PNEZD is already read and carried onto the junction as its description (`js/lpn-survey.js:81-85`, `DESC_NAMES`, and the role map at `:108`). The page chooses the asset type once for the whole file (`lpn_survey_type`, `js/looped-network.js:35757`). A row that cannot be honoured is reported, never dropped or guessed (`js/lpn-survey.js:15-18`).
- **OBSERVED.** So Tom's proposal needs no new column. It needs a reader for the text already in Description.

## 2. The finding: a convention exists, and it is Carlson's and Civil 3D's, and it answers the tee question

### 2.1 Two ways the industry joins points into lines

CITED, Carlson "Special Codes" (Carlson Software, 2021, web.carlsonsw.com knowledgebase PDF, text extracted and read; also files.carlsonsw.com/mirror/manuals/CSI_Mobile_2/SpecialCodes.html):

1. **Same code, sequential points.** "One method creates line work by connecting points with the same code." Distinct lines of one code get a **group number after the code**: all `RP1` points are one line, all `RP2` another, both using the definition of `RP`. A code defined as `#CODE` takes the number as a prefix instead (`10CODE`, `20CODE`).
2. **PointCAD format, begin and end markers.** Same code plus a space and a start or end special code: "`RP +0, RP, RP, RP -0`" (start, middle points, end); `+7/-7` uses the line type the code is defined with, `+5` starts a 3D polyline, `+4` a curved 2D polyline.

CITED, thatcadgirl.com "Picks and Clicks: Understanding Field to Finish": other products use fixed begin/end letters, "B" and "E", and the whole thing depends on the crews entering consistent descriptions.

CITED, Autodesk Civil 3D Help "Linework code sets" (via search summaries of help.autodesk.com GUID-8E383908... and GUID-59F46AEC...; I could not fetch the help text itself): special codes Begin, Continue, End, Close (defaults `B`, `C`, `E`, `CLS`; the NRCS North Dakota Civil 3D set uses `BEG`, `END`, `CLO`); Curve codes `BC`, `EC`, `PC`/`PT`; offsets `H` and `V` (Horizontal and Vertical). CITED (Autodesk Civil 3D Help, "Line segment codes", via search summary): the code is written after the description, separated by a space, a field delimiter that is configurable.

CITED, Trimble Business Center and Trimble Access help (help.fieldsystems.trimble.com, "Controlling feature geometry using control codes"): control codes are Start join sequence and End join sequence; "Points that have the same line or polygon feature code assigned to them are joined by lines". Multiple codes can be put on one point with a multi-code button. The page I read does **not** show a join-to-point-id control code. A search summary said one exists in TBC ("Join To Point"); unverified.

NOT SEARCHED beyond a first look: TopoDOT and MicroSurvey code sets. They are LiDAR extraction and a Carlson-like field-to-finish; I make no claim about them.

### 2.2 Connecting a branch to a node: the answer

Two documented idioms, both reusing point ids or codes the surveyor already has:

- **Join to a named point.** CITED, Carlson Special Codes 3.28: "JPN (Join to Point Name)... joins to the point named immediately after the code. For example, 'JPN73' causes a line to be drawn from the current point to the point '73'." Example in the table above: `EP1 JPN205`. CITED, Civil 3D (search summaries of Autodesk Help and an Autodesk Community thread): **CPN**, "connect to point number", "creates a new figure... with a single line segment from the current point to the specified point ID"; example `EP1 B CPN101`; and **RPN**, recall point, when ending. The two are the same idea under different spellings.
- **Several lines meeting at one shot.** CITED, Carlson Field to Finish manual (files.carlsonsw.com/.../Field_to_Finish.htm, read): Eagle Point style dot syntax: `.TC.EP.FL` "results in three lines coming together"; `TC1.TC2.TC3` likewise, all defined by the one code TC; and **`WV.W1` "places a node as specified by the code WV in the field code library and then begins a line as specified by code W"**. A water valve and the start of a water line at one point, in one description. This is the closest published precedent to Tom's tee.

**So there is no custom specification to invent.** A tee is one of: (a) the branch's first point coded `JPN<point name of the tee>` (or Civil 3D's `CPN`), or (b) the tee shot carrying two group-numbered line codes in dot syntax. There is no single standard across vendors: each product spells it differently, and the DOT code lists below say nothing about it (see 3).

### 2.3 What the codes do NOT give a hydraulic model

SPECULATION, from the sources above. All of these codes draw **lines between surveyed points**. None says which line is a pipe of what diameter, which point is a junction, a tank or a valve, or that a line crossing another is not a connection. Carlson draws a 3D polyline across a road crossing another with no node. So even a perfect field-to-finish file needs the asset-type decision made by us, and a crossing-versus-connection rule.

## 3. Published utility feature-code lists (what a code should look like)

CITED, PennDOT "Survey Feature - Codes" (pa.gov PDF, text extracted and read). Legend: (A) attribute, (L) linear feature, (P) point feature, (T) included in terrain. Domestic Water section:

| Code | Description | Flags |
|---|---|---|
| WL | WATER LINE | (A)(L) |
| WLE | WATER LINE | (A)(L)(T) |
| WLM | WATER LINE MARKER | (P) |
| WV | WATER VALVE | (A)(P) |
| WVCS | WATER VALVE CURB STOP | (P) |
| WVE | WATER VALVE | (P)(T) |
| FH | FIRE HYDRANT | (P) |
| FHE | FIRE HYDRANT | (P)(T) |
| WM | WATER METER | (P) |
| WELL, CIST | well, cistern | (P) |

The same list ships a **Gas Line GL / Gas Valve GV / Gas Meter GMR** triple, i.e. the same shape per utility. Letter E on the end means "included in terrain", a convention specific to roadway work, not a hydraulic one.
CITED (search results, not read): FHWA Federal Lands "ORD feature code list" (highways.fhwa.dot.gov, 403 to my fetcher), FDOT Survey Feature Codes (Scribd), NH DOT "OpenRoads Survey Feature Codes". So a **WV, FH, WM, WL** vocabulary exists in at least PennDOT's published list; I did not confirm that FHWA, FDOT or NH use the same letters.
NOT FOUND: any published code list from a water utility itself (as opposed to a state DOT) in the time I spent. NOT FOUND: any standard for expressing a tee in these lists. NOT SEARCHED: APWA uniform colour code (it is a paint colour code for locators, not a point code).

## 4. Recommendation (SPECULATION: re-derive before Tom relies on it)

Reuse; do not invent. Smallest set, all attested above.

1. **Description is a space-separated list of tokens**, the first the feature code, matching the delimiter every product above uses. Unknown tokens are reported with the row's own text underneath, using the existing note format; none dropped silently.
2. **Feature code decides the asset type, from a short default table** attested in PennDOT: `WV` valve, `FH` hydrant (a junction with a demand), `WM` meter (junction), `WL` pipe line, `WELL`/`CIST` source/storage (reservoir or tank). The table is visible, and a user can override it for a file. SPECULATION: the table is the only new thing, and PennDOT's entries are its source. The file-wide asset-type chooser stays as the fallback for an uncoded row, so today's workflow is unchanged.
3. **Linework by Carlson method 1**: points with the same line code join in file order, `WL1` and `WL2` give separate lines. Accept also `+0 / -0` begin and end (PointCAD), and `CLO` close if a ring main is coded. Everything else Carlson and Civil 3D define (curves, offsets, rectangles, `JOG`) is **refused and reported**, not interpreted: it needs geometry nobody asked for and is exactly the "guess" the module forbids.
4. **A tee is `JPN<point name>`** on the branch's first point: Carlson spells it JPN, Civil 3D CPN. Accept both spellings; write only JPN in help. Also accept `WV.W1`-style dot syntax: one shot, a node code plus a line start. SPECULATION: dots are second priority, JPN first, because it relies only on the point name the surveyor already wrote in column one and that we already read.
5. **Pipes created from linework carry no diameter** until the user gives one; the survey does not know it. This is consistent with the module's own rule (nothing is invented).
6. **A crossing is not a connection.** Report any two pipes whose vertices cross with no shared node, rather than splitting; offer nothing silently.
7. **A batch preview before commit**, one undo snapshot (as Task 592 already asserts), and the same line-numbered report.

Why not a bespoke code: the conventions above are what a crew's data collector already outputs. A crew that codes in Carlson or Civil 3D syntax has little to relearn; a crew on neither would learn two tokens (`WL`, `JPN`) that match what they will meet when they do. Tom's stated condition (do not specify a custom syntax without market research) is met by this list: **JPN, PointCAD +0/-0, group number, dot syntax and the PennDOT water codes are all published.**

## 5. Gaps and honest limits

- I could not fetch Autodesk's own linework-code help text or the Civil 3D point-number syntax from the primary page; Civil 3D claims are search summaries and the NRCS ND PDF (listed but its text did not extract). Re-verify `CPN`/`RPN` spelling and defaults before quoting them in help.
- I did not open Trimble's "Work with Line Control Codes" page, TopoDOT or MicroSurvey.
- I do not know how often utility crews actually code water assets this way: all these sources are surveyors and DOTs. NOT FOUND: a utility's own field-survey code list, or any report of use by small water systems. The population most likely to benefit (an operator with a data collector) is the one I have least evidence for. The ask came from Tom, not a user (see `dev/real-world-reviews.md`; Task 592 recorded that neither Declan nor Sue asked for more than points).

## Proposed journal entry

2026-10-05 -- Mary: coded survey points. Report in dev/agents/market-researcher/survey-codes.md.
- CITED. Carlson Special Codes (2021 PDF): same-code joins, group numbers (RP1, RP2), PointCAD +0/-0, JPN<point> joins to a named point; Field to Finish manual: `.TC.EP.FL` three lines at one point, `WV.W1` valve node plus line start.
- CITED (search summaries). Civil 3D linework code sets: Begin/Continue/End/Close, CPN connect to point number, RPN. Trimble Access: Start/End join sequence (no join-to-point on the page read).
- CITED. PennDOT Survey Feature Codes: WL water line (A)(L), WV water valve (A)(P), FH fire hydrant (P), WM water meter (P).
- OBSERVED. js/lpn-survey.js already reads Description (:81-85) and makes junctions only (:9-11).
- SPECULATION. Recommend reusing JPN/CPN for tees, group numbers for lines, a PennDOT-based default code table.
- NOT FOUND. A utility-authored code list; any cross-vendor tee standard.

## Proposed wish-list rows

1. **Ask Declan (data-entry clerk) or any real surveyor how a crew would code a tee**, before building. One conversation, zero engineering; our evidence is all DOT and software-vendor, none from a water utility.
2. **Fetch Civil 3D's linework-code help from a licensed install** (or Tom's own Civil 3D: he has it) to confirm CPN/RPN and defaults. Ten minutes for Tom, since he owns AutoCAD.
