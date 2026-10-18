// THE BENTLEY .wtg.sqlite READER, js/lpn-wtg.js -- ROADMAP Task 749. Run with:
//
//   node dev/lpn-spike/wtg-import-harness.js
//
// TWO HALVES.
//
// 1. ALWAYS RUN: a Bentley-shaped database BUILT HERE by Python's sqlite3 (a different SQLite from
//    the one sql.js compiles), laid out as the public samples are (dev/sqlite-reader.md): soft-deleted
//    rows, a pump and a PRV that are nodes between two pipes, a design-point pump, a variable-area
//    tank, a stepwise pattern, a clock-time control, storage in feet and cubic feet per second, the
//    storage-unit codes in a schema blob, a child scenario whose child Physical alternative changes
//    one pipe, and an alternative no scenario uses. The child-scenario encoding is the patent's
//    reading, NOT OBSERVED: no public file has one.
//
// 2. RUN WHEN THE SAMPLES ARE ON DISK: the public WaterGEMS files (Zenodo 7162154, CC BY 4.0) are
//    NOT in the repository (Tom's open question on Bentley's licence). Point WTG_SAMPLES at the
//    folder that holds the extracted "WaterGems model" and "EPANET Model" folders; without it the
//    half prints NOT RUN and the harness still exits 0. With it, the EPS model is read and compared
//    with the `.inp` WaterGEMS itself exported from the same model: element counts, every attribute,
//    and an EPANET solve of both at time zero.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
require('./bootstrap.js');
const initSqlJs = require(path.join(ROOT, 'js', 'vendor', 'sql-wasm.js'));
require(path.join(ROOT, 'js', 'lpn-sqlite.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-wtg.js'));
const EC = globalThis.EngCalcs;
EC.lpnSqliteSetEngine(initSqlJs, fs.readFileSync(path.join(ROOT, 'js', 'vendor', 'sql-wasm.wasm')));

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }
function noteOf(r, code) { return r.notes.filter((n) => n.code === code)[0] || null; }
function section(inp, name) {
	const lines = inp.split(/\r?\n/), out = [];
	let on = false;
	for (const l of lines) {
		if (/^\[/.test(l)) { on = l === '[' + name + ']'; continue; }
		if (on && l.trim() && l.trim()[0] !== ';') { out.push(l.trim().split(/\s+/)); }
	}
	return out;
}

async function epanetSolve(inpText) {
	const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('h.inp', inpText);
	try { p.open('h.inp', 'h.rpt', 'h.out'); } catch (e) { throw new Error(e.message + '\n' + ws.readFile('h.rpt')); }
	p.openH(); p.initH(0); p.runH();
	const heads = {}, flows = {};
	const nn = p.getCount(0), nl = p.getCount(2);
	for (let i = 1; i <= nn; i++) { heads[p.getNodeId(i)] = p.getNodeValue(i, 10); }
	for (let i = 1; i <= nl; i++) { flows[p.getLinkId(i)] = p.getLinkValue(i, 8); }
	p.closeH(); p.close();
	return { heads, flows };
}

// ---------------------------------------------------------------------------------------------
// 1. The synthetic model
// ---------------------------------------------------------------------------------------------
const PY = String.raw`
import sqlite3, sys, struct
db = sqlite3.connect(sys.argv[1])
x = db.execute
FT = 0.3048
def pt(xm, ym): return struct.pack('<BIdd', 1, 1, xm / FT, ym / FT)
def ls(*p): return struct.pack('<BII', 1, 2, len(p)) + b''.join(struct.pack('<dd', a / FT, b / FT) for a, b in p)
def field(fid, name, cat, unit):
    s = lambda t: bytes([len(t)]) + t.encode()
    return struct.pack('<ii', fid, 2) + s(name) + s(cat) + s(name + '_Def') + s('') + struct.pack('<ii', unit, 255)
db.executescript('''
CREATE TABLE HMIModelingElement (ElementID INTEGER PRIMARY KEY, DomainDataSetID, IsDeleted, ElementType, Label TEXT);
CREATE TABLE HMIDomainElement (DomainElementID INTEGER PRIMARY KEY, DomainElementTypeID, IsDeleted, DomainDataSetID);
CREATE TABLE HMISupportElement (SupportElementID INTEGER PRIMARY KEY, SupportElementTypeID, IsDeleted);
CREATE TABLE HMIScenario (ScenarioID INTEGER PRIMARY KEY, ParentID, IsDeleted, DomainDataSetID);
CREATE TABLE HMIAlternative (AlternativeID INTEGER PRIMARY KEY, ParentID, AlternativeTypeID, IsDeleted, DomainDataSetID, Level);
CREATE TABLE HMIScenarioAlternative (ScenarioID, AlternativeTypeID, AlternativeID, IsLocal);
CREATE TABLE HMIScenarioCalculationOptions (ScenarioID, NumericalEngineTypeID, CalculationOptionsID, IsLocal);
CREATE TABLE HMIDomainDataSet (DomainDataSetID, Name, ActiveScenarioID);
CREATE TABLE HMIDomainDataSetTypeSchema (DomainDataSetTypeID, SchemaInfo BLOB);
CREATE TABLE IdahoDataSet (DomainDataSetID, HMIDataSetGeometrySpatialReference TEXT);
CREATE TABLE IdahoJunction (DomainElementID);
CREATE TABLE IdahoReservoir (DomainElementID);
CREATE TABLE IdahoTank (DomainElementID);
CREATE TABLE ConventionalTank (DomainElementID);
CREATE TABLE IdahoPipe (DomainElementID, AddedForINPConversion);
CREATE TABLE BaseValve (DomainElementID);
CREATE TABLE PRV (DomainElementID);
CREATE TABLE StandardPump (DomainElementID);
CREATE TABLE IdahoSpotElevation (DomainElementID);
CREATE TABLE BaseIdahoNode_Physical_Data (DomainElementID, AlternativeID, Physical_NodeElevation);
CREATE TABLE BaseIdahoNode_HmiDataSetGeometry_Data (DomainElementID, AlternativeID, HMIGeometry BLOB);
CREATE TABLE BaseIdahoNode_HMIActiveTopology_Data (DomainElementID, AlternativeID, HMIActiveTopologyIsActive);
CREATE TABLE BaseDirectedNode_Physical_Data (DomainElementID, AlternativeID, Physical_NodeElevation);
CREATE TABLE BaseDirectedNode_HmiDataSetGeometry_Data (DomainElementID, AlternativeID, HMIGeometry BLOB);
CREATE TABLE BaseDirectedNode_HMIDataSetTopology_Data (DomainElementID, AlternativeID, HMITopologyDownstreamLinkID);
CREATE TABLE BaseLink_HMIDataSetTopology_Data (DomainElementID, AlternativeID, HMITopologyStartNodeID, HMITopologyStopNodeID);
CREATE TABLE BaseLink_HmiDataSetGeometry_Data (DomainElementID, AlternativeID, HMIGeometry BLOB, HMIGeometryScaledLength);
CREATE TABLE BaseLink_HMIActiveTopology_Data (DomainElementID, AlternativeID, HMIActiveTopologyIsActive);
CREATE TABLE BaseLink_Physical_Data (DomainElementID, AlternativeID, Physical_IsUserDefinedLength, Physical_UserDefinedLength);
CREATE TABLE IdahoPipe_Physical_Data (DomainElementID, AlternativeID, Physical_PipeDiameter, Physical_HazenWilliamsC, Physical_DarcyWeisbachE, Physical_PipeMannings, Physical_HasCheckValve, Physical_CompositeMinorLoss, Physical_SpecifyLocalMinorLoss, Physical_CalculatedMinorLossCoefficient);
CREATE TABLE IdahoPipe_InitialSettings_Data (DomainElementID, AlternativeID, PipeStatus);
CREATE TABLE IdahoPipe_Hammer_Data (DomainElementID, AlternativeID, Hammer_WaveSpeed);
CREATE TABLE IdahoDemandNode_Demand_Data (DomainElementID, AlternativeID, CustomerDemandCollection, DemandCollectionCount, UnitDemandLoadCollectionCount);
CREATE TABLE IdahoDemandNode_Demand_DemandCollection (ItemID, DomainElementID, AlternativeID, DemandCollection_BaseFlow, DemandCollection_DemandPattern);
CREATE TABLE IdahoReservoir_Physical_Data (DomainElementID, AlternativeID, Physical_HglPattern);
CREATE TABLE ConventionalTank_Physical_Data (DomainElementID, AlternativeID, Physical_TankBaseElevation, Physical_TankMaximumElevation, Physical_TankMinimumElevation, Physical_TankMaximumLevel, Physical_TankMinimumLevel, CircularTankSectionType_TankDiameter, NonCircularTankSectionType_TankAverageArea, VariableAreaTankSectionType_TotalActiveVolume, OperatingRangeType, TankSection, DepthRatioVolumeRatioCurveCount, Physical_InactiveVolume);
CREATE TABLE ConventionalTank_InitialSettings_Data (DomainElementID, AlternativeID, InitialSettings_TankInitialElevation, InitialSettings_TankInitialLevel);
CREATE TABLE ConventionalTank_Physical_DepthRatioVolumeRatioCurve (ItemID, DomainElementID, AlternativeID, DepthRatioVolumeRatioCurve_DepthRatio, DepthRatioVolumeRatioCurve_VolumeRatio);
CREATE TABLE IdahoTank_Physical_Data (DomainElementID, AlternativeID, Physical_HasSeparateInlet);
CREATE TABLE StandardPump_Physical_Data (DomainElementID, AlternativeID, Physical_PumpDefinitionID, Physical_IsVariableSpeedPump);
CREATE TABLE BasePump_InitialSettings_Data (DomainElementID, AlternativeID, InitialSettings_RelativeSpeedFactor, PumpStatus);
CREATE TABLE IdahoPumpDefinition (SupportElementID, PumpDefinitionType, DesignDischarge, DesignHead, ShutoffHead, MaxOperatingDischarge, MaxOperatingHead, PumpEfficiencyType);
CREATE TABLE IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType (SupportElementID, ConstantEfficiencyType_PumpEfficiency);
CREATE TABLE IdahoPumpDefinition_PumpCurve (ItemID, SupportElementID, PumpCurve_Discharge, PumpCurve_Head);
CREATE TABLE BaseValve_Physical_Data (DomainElementID, AlternativeID, Physical_CompositeMinorLoss, Physical_SpecifyLocalMinorLoss, Physical_CalculatedMinorLossCoefficient, Physical_ValveDiameter);
CREATE TABLE BaseValve_InitialSettings_Data (DomainElementID, AlternativeID, ValveSetting);
CREATE TABLE PressureValve_InitialSettings_Data (DomainElementID, AlternativeID, PressureValveSetting);
CREATE TABLE PressureValve_InitialSettings_PressureValveSetting_ValvePressureType (DomainElementID, AlternativeID, ValvePressureType_ValvePressureSetting);
CREATE TABLE IdahoPattern (SupportElementID, IdahoPattern_PatternStartTime, IdahoPattern_PatternStartingMultiplier, IdahoPattern_MondayMultiplier, PatternCategory, PatternFormat, PatternCurveCount);
CREATE TABLE IdahoPattern_PatternCurve (ItemID, SupportElementID, PatternCurve_TimeFromStart, PatternCurve_Multiplier);
CREATE TABLE IdahoControl (SupportElementID, IdahoControl_Description, IdahoControl_ExpandedDescription, IdahoControl_ControlCondition, IdahoControl_ControlAction, ControlType);
CREATE TABLE IdahoControlCondition (SupportElementID, IdahoControlCondition_ExpandedDescription, ConditionType);
CREATE TABLE IdahoControlCondition_ConditionType_SimpleConditionType (SupportElementID, SimpleConditionType, CompareOperator);
CREATE TABLE IdahoControlCondition_SimpleConditionType_ClockTimeType (SupportElementID, ClockTimeType_ClockTime);
CREATE TABLE IdahoControlAction (SupportElementID, IdahoControlAction_ExpandedDescription, ControlActionType);
CREATE TABLE IdahoControlAction_ControlActionType_SimpleActionType (SupportElementID, SimpleActionType_Element, ElementType);
CREATE TABLE IdahoControlAction_ElementType_ControlActionPipeType (SupportElementID, PipeAttribute);
CREATE TABLE IdahoControlAction_PipeAttribute_ActionPipeStatusType (SupportElementID, ActionPipeStatus);
CREATE TABLE Operational_SystemData (AlternativeID, Operational_IdahoControlSetID);
CREATE TABLE EpaNetEngine (CalculationOptionsID, FrictionMethod, TimeAnalysisType, EpaNetEngine_Trials, EpaNetEngine_Accuracy, EpaNetEngine_LiquidKinematicViscosity, EpaNetEngine_LiquidSpecificGravity, EpaNetEngine_AnalysisStartTime, EpaNetEngine_CheckFrequency, EpaNetEngine_CheckCutOff, EpaNetEngine_DampingLimit, EpaNetEngine_EmitterExponent, NormalDemandAdjustmentsCollectionCount, UnitDemandAdjustmentsCollectionCount, EpaNetEngine_UsePressureDependentDemand, EpaSetWaterQualityTimeStep, EpaWaterQualityTimeStep);
CREATE TABLE EpaNetEngine_TimeAnalysisType_EpsType (CalculationOptionsID, EpsType_Duration, EpsType_HydraulicTimeStep, EpsType_ReportingTimeStep, OverrideReportingTimeStep);
''')
blob = b'\x00' * 64 + b''.join(field(i, n, c, u) for i, (n, c, u) in enumerate([
    ('Physical_NodeElevation', 'categoryPhysical', 63), ('Physical_PipeDiameter', 'categoryPhysical', 63),
    ('Physical_UserDefinedLength', 'categoryPhysical', 63), ('DemandCollection_BaseFlow', 'categoryDemand', 27),
    ('ValvePressureType_ValvePressureSetting', 'categoryInitialSettings', 231), ('Physical_HazenWilliamsC', 'categoryPhysical', 252)])) + b'\x00' * 64
x('INSERT INTO HMIDomainDataSetTypeSchema VALUES (1, ?)', (blob,))
x("INSERT INTO HMIDomainDataSet VALUES (1, 'Test', 58)")
x("INSERT INTO IdahoDataSet VALUES (1, '')")
# Scenarios: 1 deleted, 58 Base, 60 'Peak' child of Base, 61 'Peak, small main' child of Peak.
for sid, par, dele in [(1, None, 1), (58, None, 0), (60, 58, 0), (61, 60, 0)]: x('INSERT INTO HMIScenario VALUES (?,?,?,1)', (sid, par, dele))
lab = {1: 'Base', 58: 'Base', 60: 'Peak', 61: 'Peak, small main'}
# Base alternatives 30.. by type; 70 a child Physical alternative of 34; 71 a root Physical alternative nobody uses.
TYPES = {1: 30, 2: 31, 3: 32, 4: 34, 20: 35, 21: 36, 22: 37, 50: 44}
for t, a in TYPES.items(): x('INSERT INTO HMIAlternative VALUES (?,?,?,0,1,1)', (a, None, t)); lab[a] = 'Base ' + str(t)
x('INSERT INTO HMIAlternative VALUES (2,NULL,4,1,1,1)')
x('INSERT INTO HMIAlternative VALUES (70,34,4,0,1,2)'); lab[70] = 'Small main'
x('INSERT INTO HMIAlternative VALUES (71,NULL,4,0,1,1)'); lab[71] = 'Rehab'
for sid in (58, 60, 61):
    for t, a in TYPES.items():
        pick = 70 if (sid == 61 and t == 4) else a
        x('INSERT INTO HMIScenarioAlternative VALUES (?,?,?,?)', (sid, t, pick, 1 if sid == 58 or (sid == 61 and t == 4) else 0))
x('INSERT INTO HMIScenarioCalculationOptions VALUES (58, -1304441024, 48, 1)')
# Elements. 100 R1, 101 J1, 102 J2 (deleted), 103 T1, 104 J3 inactive, 105 SPOT (unsupported), 110 PMP1, 111 PRV1,
# pipes 120 R1-PMP1, 121 PMP1-J1, 122 J1-PRV1, 123 PRV1-T1, 124 J1-J3, 125 J1-J2 (deleted).
EL = [(100, 'R1', 56), (101, 'J1', 55), (102, 'J2', 55), (103, 'T1', 52), (104, 'J 3', 55), (105, 'SPOT-1', 99),
      (110, 'PMP1', 68), (111, 'PRV1', 61), (120, 'P1', 69), (121, 'P2', 69), (122, 'P3', 69), (123, 'P4', 69), (124, 'P5', 69), (125, 'P6', 69)]
for e, l, t in EL:
    x('INSERT INTO HMIDomainElement VALUES (?,?,?,1)', (e, t, 1 if e in (102, 125) else 0)); lab[e] = l
for e, cls in [(100, 'IdahoReservoir'), (101, 'IdahoJunction'), (102, 'IdahoJunction'), (104, 'IdahoJunction'), (103, 'IdahoTank'), (103, 'ConventionalTank'),
               (105, 'IdahoSpotElevation'), (110, 'StandardPump'), (111, 'BaseValve'), (111, 'PRV')]:
    x('INSERT INTO %s VALUES (?)' % cls, (e,))
for e in range(120, 126): x('INSERT INTO IdahoPipe VALUES (?, 0)', (e,))
for e, z, xm, ym in [(100, 30.0, 0, 0), (101, 10.0, 300, 0), (102, 9.0, 300, 300), (103, 40.0, 600, 0), (104, 12.5, 300, -200), (105, 1.0, 50, 50)]:
    x('INSERT INTO BaseIdahoNode_Physical_Data VALUES (?,34,?)', (e, z / FT))
    x('INSERT INTO BaseIdahoNode_HmiDataSetGeometry_Data VALUES (?,30,?)', (e, pt(xm, ym)))
    x('INSERT INTO BaseIdahoNode_HMIActiveTopology_Data VALUES (?,32,?)', (e, 0 if e == 104 else 1))
x('INSERT INTO BaseIdahoNode_Physical_Data VALUES (101,71,?)', (11.0 / FT,))
for e, z, xm, ym, down in [(110, 30.0, 100, 0, 121), (111, 20.0, 450, 0, 123)]:
    x('INSERT INTO BaseDirectedNode_Physical_Data VALUES (?,34,?)', (e, z / FT))
    x('INSERT INTO BaseDirectedNode_HmiDataSetGeometry_Data VALUES (?,30,?)', (e, pt(xm, ym)))
    x('INSERT INTO BaseDirectedNode_HMIDataSetTopology_Data VALUES (?,31,?)', (e, down))
PIPES = [(120, 100, 110, [(0, 0), (100, 0)], 10.0, 300), (121, 110, 101, [(100, 0), (200, 50), (300, 0)], 250.0, 300),
         (122, 101, 111, [(300, 0), (450, 0)], 150.0, 250), (123, 111, 103, [(450, 0), (600, 0)], None, 250),
         (124, 101, 104, [(300, 0), (300, -200)], 200.0, 150), (125, 101, 102, [(300, 0), (300, 300)], 300.0, 150)]
for e, a, b, pts, ulen, dmm in PIPES:
    x('INSERT INTO BaseLink_HMIDataSetTopology_Data VALUES (?,31,?,?)', (e, a, b))
    x('INSERT INTO BaseLink_HmiDataSetGeometry_Data VALUES (?,30,?,?)', (e, ls(*pts), 160.0 / FT))
    x('INSERT INTO BaseLink_HMIActiveTopology_Data VALUES (?,32,1)', (e,))
    x('INSERT INTO BaseLink_Physical_Data VALUES (?,34,?,?)', (e, 0 if ulen is None else 1, 0 if ulen is None else ulen / FT))
    x('INSERT INTO IdahoPipe_Physical_Data VALUES (?,34,?,130,0.0005,0.012,?,?,1,0)', (e, dmm / 304.8, 1 if e == 120 else 0, 0.5 if e == 122 else 0))
    x('INSERT INTO IdahoPipe_InitialSettings_Data VALUES (?,36,0)', (e,))
    x('INSERT INTO IdahoPipe_Hammer_Data VALUES (?,44,3000)', (e,))
# The child alternative 70 changes P2's diameter only; the root alternative 71 restates P2 and P3 with P3 different.
x('INSERT INTO IdahoPipe_Physical_Data VALUES (121,70,?,130,0.0005,0.012,0,0,1,0)', (200 / 304.8,))
x('INSERT INTO IdahoPipe_Physical_Data VALUES (121,71,?,130,0.0005,0.012,0,0,1,0)', (300 / 304.8,))
x('INSERT INTO IdahoPipe_Physical_Data VALUES (122,71,?,130,0.0005,0.012,0,0.5,1,0)', (350 / 304.8,))
x('INSERT INTO BaseLink_Physical_Data VALUES (121,71,1,?)', (250.0 / FT,))
x('INSERT INTO BaseLink_Physical_Data VALUES (122,71,1,?)', (150.0 / FT,))
# Demands: J1 two demands (2.5 L/s on PAT1, 1 L/s fixed); J3 1 L/s.
x("INSERT INTO IdahoDemandNode_Demand_Data VALUES (101,35,'',2,0)")
x("INSERT INTO IdahoDemandNode_Demand_Data VALUES (104,35,'',1,0)")
L = 0.035314667   # WaterGEMS's own ft3 per litre (measured; dev/sqlite-reader.md)
x('INSERT INTO IdahoDemandNode_Demand_DemandCollection VALUES (1,101,35,?,200)', (2.5 * L,))
x('INSERT INTO IdahoDemandNode_Demand_DemandCollection VALUES (2,101,35,?,NULL)', (1.0 * L,))
x('INSERT INTO IdahoDemandNode_Demand_DemandCollection VALUES (3,104,35,?,NULL)', (1.0 * L,))
x('INSERT INTO IdahoReservoir_Physical_Data VALUES (100,34,NULL)')
x('INSERT INTO ConventionalTank_Physical_Data VALUES (103,34,?,?,?,0,0,?,0,?,0,2,2,0)', (40 / FT, 46 / FT, 40.5 / FT, 10 / FT, 500 / (FT ** 3)))
x('INSERT INTO ConventionalTank_InitialSettings_Data VALUES (103,36,?,0)', (43 / FT,))
x('INSERT INTO ConventionalTank_Physical_DepthRatioVolumeRatioCurve VALUES (1,103,34,0,0)')
x('INSERT INTO ConventionalTank_Physical_DepthRatioVolumeRatioCurve VALUES (2,103,34,1,1)')
x('INSERT INTO IdahoTank_Physical_Data VALUES (103,34,0)')
# Pump: design point 30 L/s at 25 m, constant efficiency 70.
x('INSERT INTO HMISupportElement VALUES (300, 51, 0)'); lab[300] = 'CRV-1'
x('INSERT INTO IdahoPumpDefinition VALUES (300,1,?,?,0,0,0,0)', (30 * L, 25 / FT))
x('INSERT INTO IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType VALUES (300, 70)')
x('INSERT INTO StandardPump_Physical_Data VALUES (110,34,300,0)')
x('INSERT INTO BasePump_InitialSettings_Data VALUES (110,36,1.0,0)')
# PRV: 22 m (in psi, Bentley's own psi per metre), 250 mm, active.
x('INSERT INTO BaseValve_Physical_Data VALUES (111,34,0,1,0,?)', (250 / 304.8,))
x('INSERT INTO BaseValve_InitialSettings_Data VALUES (111,36,0)')
x('INSERT INTO PressureValve_InitialSettings_Data VALUES (111,36,0)')
x('INSERT INTO PressureValve_InitialSettings_PressureValveSetting_ValvePressureType VALUES (111,36,?)', (22 * 1.42232905111207,))
# A stepwise pattern of 1-hour steps over 4 hours: 1.0, 1.5, 0.5, 1.2 (and back to 1.0 at 4 h).
x('INSERT INTO HMISupportElement VALUES (200, 50, 0)'); lab[200] = 'PAT1'
x('INSERT INTO HMISupportElement VALUES (201, 50, 1)'); lab[201] = 'GONE'
x('INSERT INTO IdahoPattern VALUES (200, 0, 1.0, 1.0, 0, 0, 4)')
for i, (t, m) in enumerate([(3600, 1.5), (7200, 0.5), (10800, 1.2), (14400, 1.0)]): x('INSERT INTO IdahoPattern_PatternCurve VALUES (?,200,?,?)', (i + 1, t, m))
# A control: at 06:00 close P5.
for sid in (400, 401, 402): x('INSERT INTO HMISupportElement VALUES (?, 55, 0)', (sid,))
x("INSERT INTO IdahoControl VALUES (402,'c','IF Clock Time = 06:00 THEN P5 Pipe Status = Closed',400,401,1)")
x("INSERT INTO IdahoControlCondition VALUES (400,'Clock Time = 06:00',0)")
x('INSERT INTO IdahoControlCondition_ConditionType_SimpleConditionType VALUES (400,2,0)')
x('INSERT INTO IdahoControlCondition_SimpleConditionType_ClockTimeType VALUES (400,?)', (1664582400 + 6 * 3600,))
x("INSERT INTO IdahoControlAction VALUES (401,'P5 Pipe Status = Closed',0)")
x('INSERT INTO IdahoControlAction_ControlActionType_SimpleActionType VALUES (401,124,69)')
x('INSERT INTO IdahoControlAction_ElementType_ControlActionPipeType VALUES (401,0)')
x('INSERT INTO IdahoControlAction_PipeAttribute_ActionPipeStatusType VALUES (401,1)')
x('INSERT INTO Operational_SystemData VALUES (37, NULL)')
x('INSERT INTO EpaNetEngine VALUES (48,1,1,40,0.001,1.0837399580445e-05,1.0,1584489600,2,10,0,0.5,0,0,0,0,0)')
x('INSERT INTO EpaNetEngine_TimeAnalysisType_EpsType VALUES (48,86400,3600,3600,0)')
for e, l in lab.items():
    et = 2 if e in (1, 58, 60, 61) else 1 if e in (2, 30, 31, 32, 34, 35, 36, 37, 44, 70, 71) else 4 if e >= 200 else 3
    x('INSERT INTO HMIModelingElement VALUES (?,1,?,?,?)', (e, 1 if e in (1, 2, 102, 125, 201) else 0, et, l))
db.commit()
`;

async function synthetic() {
	head('1. Synthetic Bentley-shaped model (always run)');
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-wtg-'));
	const file = path.join(tmp, 'syn.wtg.sqlite');
	execFileSync('python3', ['-I', '-c', PY, file]);
	const db = await EC.lpnSqliteOpen(fs.readFileSync(file));
	ok('recognised as a WaterGEMS model', EC.lpnWtgIsWtg(db));
	const r = EC.lpnWtgRead(db, { flowUnits: 'LPS' });
	ok('read succeeds', r.ok, r.message);
	const inp = r.inp;
	if (process.env.WTG_DUMP) { fs.writeFileSync(process.env.WTG_DUMP, inp); }
	const J = section(inp, 'JUNCTIONS'), P = section(inp, 'PIPES'), PU = section(inp, 'PUMPS'), V = section(inp, 'VALVES');
	const jById = Object.fromEntries(J.map((t) => [t[0], t])), pById = Object.fromEntries(P.map((t) => [t[0], t]));
	ok('deleted junction J2 and deleted pipe P6 are not imported', !jById.J2 && !pById.P6);
	ok('a label with a space gets an EPANET ID, and the report says so', !!jById.J_3 && (noteOf(r, 'wtg-id-changed') || { ids: [] }).ids.indexOf('J 3 (J_3)') >= 0);
	ok('elevation stored in feet comes back as the metres typed: 10', jById.J1 && jById.J1[1] === '10');
	ok('first demand 2.5 L/s on PAT1 in [JUNCTIONS]', jById.J1 && jById.J1[2] === '2.5' && jById.J1[3] === 'PAT1', JSON.stringify(jById.J1));
	const dem = section(inp, 'DEMANDS');
	ok('both demands of J1 in [DEMANDS]', dem.length === 2 && dem[1][1] === '1', JSON.stringify(dem));
	ok('pump and PRV become links between -U and -D junctions at their elevations',
		!!jById['PMP1-U'] && jById['PMP1-D'][1] === '30' && !!jById['PRV1-U'] && jById['PRV1-D'][1] === '20');
	ok('pump PMP1 runs PMP1-U to PMP1-D on its curve', PU.length === 1 && PU[0].slice(0, 5).join(' ') === 'PMP1 PMP1-U PMP1-D HEAD CRV-1', JSON.stringify(PU));
	ok('the pipe upstream of the pump ends at PMP1-U, the one downstream starts at PMP1-D',
		pById.P1 && pById.P1[2] === 'PMP1-U' && pById.P2 && pById.P2[1] === 'PMP1-D');
	ok('user-defined length 250 m is the pipe length; the pipe without one takes the scaled 160 m',
		pById.P2[3] === '250' && pById.P4[3] === '160', pById.P2[3] + ' ' + pById.P4[3]);
	ok('diameter 300 mm, roughness C 130', pById.P2[4] === '300' && pById.P2[5] === '130');
	ok('check valve on P1 is status CV; minor loss 0.5 on P3', pById.P1[7] === 'CV' && pById.P3[6] === '0.5');
	ok('PRV setting 22 m from Bentley psi, diameter 250', V.length === 1 && V[0][4] === 'PRV' && V[0][5] === '22' && V[0][3] === '250', JSON.stringify(V));
	const C = section(inp, 'CURVES');
	ok('design-point pump curve 30 L/s at 25 m', C.some((t) => t.join(' ') === 'CRV-1 30 25'), JSON.stringify(C));
	ok('constant 70 % efficiency as a one-point curve', C.some((t) => t.join(' ') === 'CRV-1E 30 70'));
	ok('variable-area tank: volume curve 0.5 m to 6 m, 0 to 500 m3', C.some((t) => t.join(' ') === 'T1 0.5 0') && C.some((t) => t.join(' ') === 'T1 6 500'), JSON.stringify(C));
	const TK = section(inp, 'TANKS');
	ok('tank: base 40, initial 3, min 0.5, max 6, curve T1', TK[0] && TK[0].slice(0, 5).join(' ') === 'T1 40 3 0.5 6' && TK[0][7] === 'T1', JSON.stringify(TK));
	const PT = section(inp, 'PATTERNS');
	ok('stepwise pattern 1, 1.5, 0.5, 1.2', PT.length === 1 && PT[0].slice(1).join(' ') === '1 1.5 0.5 1.2', JSON.stringify(PT));
	ok('the deleted pattern is not written', inp.indexOf('GONE') < 0);
	ok('clock-time control on P5', /LINK P5 CLOSED AT CLOCKTIME 6:00 AM/.test(inp));
	ok('EPS times: 24 h at 1 h', /Duration\s+24:00/.test(inp) && /Hydraulic Timestep\s+1:00/.test(inp));
	ok('relative viscosity 0.985218 as WaterGEMS exports it', /Viscosity\s+0\.9852181\b/.test(inp));
	ok('spot elevation reported, not imported', (noteOf(r, 'wtg-element-unread') || { ids: [] }).ids.indexOf('SPOT-1 (IdahoSpotElevation)') >= 0);
	ok('inactive J 3 reported and listed for the page', r.inactiveIds.nodes.indexOf('J_3') >= 0);
	ok('the pump and valve split is reported', (noteOf(r, 'wtg-directed-split') || { ids: [] }).ids.join() === 'PMP1,PRV1');
	ok('transient (Hammer) data named as not read', (noteOf(r, 'wtg-tables-unread') || { ids: [] }).ids.indexOf('IdahoPipe_Hammer_Data') >= 0);
	ok('no .wtg given: the units are said to be assumed', !!noteOf(r, 'wtg-units-assumed'));
	ok('storage units from the schema blob: diameter is feet (63)', r.declaredUnits.Physical_PipeDiameter === 63);
	// Scenarios: Peak inherits everything (no overrides); Peak, small main names the child alternative.
	const peak = r.scenarios.filter((s) => s.name === 'Peak')[0], small = r.scenarios.filter((s) => s.name === 'Peak, small main')[0];
	ok('two scenarios beyond Base', r.scenarios.length === 2);
	ok('Peak overrides nothing', peak && Object.keys(peak.overrides).length === 0);
	ok('Peak, small main is a child of Peak', small && small.parentName === 'Peak');
	ok('its child Physical alternative overrides exactly P2 diameter 200', small && JSON.stringify(small.overrides) === '{"l:P2":{"diameter":200}}', JSON.stringify(small && small.overrides));
	const alt = r.alternatives.filter((a) => a.name === 'Rehab')[0];
	ok('the unused root alternative is carried as a Base of its own', alt && alt.root === true && alt.category === 'physical');
	ok('holding only the elements it has rows for, with its own P3 diameter 350 and J1 elevation 11',
		alt && alt.values['l:P3'] && alt.values['l:P3'].diameter === 350 && alt.values['n:J1'].elev === 11 && !alt.values['l:P1'],
		JSON.stringify(alt && alt.values));
	const sol = await epanetSolve(inp);
	ok('EPANET solves the written file', Object.keys(sol.heads).length === J.length + 2 && isFinite(sol.heads.J1), 'J1 head ' + sol.heads.J1);
	ok('the PRV holds 22 m downstream (head 42 at its 20 m elevation)', Math.abs(sol.heads['PRV1-D'] - 42) < 0.01 || sol.flows.PRV1 <= 1e-9, String(sol.heads['PRV1-D']));
	db.close();
	fs.rmSync(tmp, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------------------------
// 2. The public samples, when present
// ---------------------------------------------------------------------------------------------
const SAMPLES = process.env.WTG_SAMPLES || '';
const EPS = 'EPS_Badapokharan_Operation as per design_base_model';

// WaterGEMS's own export renames and adds (dev/sqlite-reader.md, "The EPS model against its .inp"):
// the pump node U1 becomes junctions 4 and 3 with pipes 3 and 4 for U1-A and U1-B, and T01's top inlet
// becomes junctions 2 and 1, PSV 1 and a 0.001-long pipe 2. This reader names them after the pump
// (U1-U, U1-D) and joins the inlet pipe to the tank, so those are the mapped and the expected extras.
const NODE_ALIAS = { 4: 'U1-U', 3: 'U1-D' };
const LINK_ALIAS = { 3: 'U1-A', 4: 'U1-B' };
const THEIRS_ONLY = { nodes: ['1', '2'], links: ['1', '2'] };

function close(a, b) { return Math.abs(a - b) <= 1e-9 + 1e-7 * Math.abs(b); }

async function samples() {
	head('2. The public WaterGEMS samples (Zenodo 7162154)');
	const dbFile = SAMPLES && path.join(SAMPLES, 'WaterGems model', EPS + '.wtg.sqlite');
	const inpFile = SAMPLES && path.join(SAMPLES, 'EPANET Model', EPS + '.inp');
	if (!SAMPLES || !fs.existsSync(dbFile) || !fs.existsSync(inpFile)) {
		console.log('  NOT RUN: set WTG_SAMPLES to the folder holding "WaterGems model" and "EPANET Model" (dev/sqlite-reader.md says where to get them).');
		return;
	}
	const bytes = fs.readFileSync(dbFile);
	const db = await EC.lpnSqliteOpen(bytes);
	const wtg = path.join(SAMPLES, 'WaterGems model', EPS + '.wtg');
	const display = fs.existsSync(wtg) ? EC.lpnWtgDisplayUnits(fs.readFileSync(wtg, 'utf8')) : null;
	const r = EC.lpnWtgRead(db, { display });
	ok('EPS model reads', r.ok);
	ok('flow units from the .wtg: LPS', r.flowUnits === 'LPS');
	const ours = EC.lpnInpParse(r.inp), theirs = EC.lpnInpParse(fs.readFileSync(inpFile, 'utf8'));
	ok('both parse', ours.ok && theirs.ok);
	const on = Object.fromEntries(ours.nodes.map((n) => [n.id, n])), ol = Object.fromEntries(ours.links.map((l) => [l.id, l]));
	const nAlias = (id) => NODE_ALIAS[id] || id, lAlias = (id) => LINK_ALIAS[id] || id;
	const tn = theirs.nodes.filter((n) => THEIRS_ONLY.nodes.indexOf(n.id) < 0), tl = theirs.links.filter((l) => THEIRS_ONLY.links.indexOf(l.id) < 0);
	const kinds = (list) => list.reduce((m, x) => { m[x.type] = (m[x.type] || 0) + 1; return m; }, {});
	console.log('       ours:   ' + JSON.stringify(kinds(ours.nodes)) + ' ' + JSON.stringify(kinds(ours.links)));
	console.log('       theirs: ' + JSON.stringify(kinds(theirs.nodes)) + ' ' + JSON.stringify(kinds(theirs.links)) + ' (4 of them the tank-inlet construction)');
	ok('same nodes once the inlet construction is set aside (20 junctions less 2, 14 reservoirs, 1 tank)',
		tn.length === ours.nodes.length && tn.every((n) => on[nAlias(n.id)]), tn.length + ' vs ' + ours.nodes.length);
	ok('same links likewise (31 pipes, 1 pump)', tl.length === ours.links.length && tl.every((l) => ol[lAlias(l.id)]), tl.length + ' vs ' + ours.links.length);
	// Every attribute.
	const diffs = [];
	const NODE_FIELDS = ['elev', 'demand', 'head', 'level', 'minLevel', 'maxLevel', 'diameter', 'minVol', 'x', 'y'];
	const LINK_FIELDS = ['length', 'diameter', 'roughness', 'k', 'status', 'setting', 'speed'];
	let compared = 0;
	tn.forEach((n) => {
		const o = on[nAlias(n.id)];
		if (!o) { return; }
		if (o.type !== n.type) { diffs.push(n.id + ' type ' + o.type + ' vs ' + n.type); }
		NODE_FIELDS.forEach((f) => {
			if (n[f] === undefined && o[f] === undefined) { return; }
			compared++;
			const a = o[f], b = n[f];
			// Coordinates: WaterGEMS's export prints two decimals; the database holds more.
			const tol = (f === 'x' || f === 'y') ? 0.006 : null;
			const same = (typeof a === 'number' && typeof b === 'number') ? (tol ? Math.abs(a - b) <= tol : close(a, b)) : a === b;
			if (!same) { diffs.push(n.id + ' ' + f + ' ' + a + ' vs ' + b); }
		});
	});
	tl.forEach((l) => {
		const o = ol[lAlias(l.id)];
		if (!o) { return; }
		if (o.type !== l.type) { diffs.push(l.id + ' type ' + o.type + ' vs ' + l.type); }
		if (nAlias(l.from) !== o.from) { diffs.push(l.id + ' from ' + o.from + ' vs ' + l.from); }
		if (nAlias(l.to) !== o.to) { diffs.push(l.id + ' to ' + o.to + ' vs ' + l.to); }
		LINK_FIELDS.forEach((f) => {
			if (l[f] === undefined && o[f] === undefined) { return; }
			compared++;
			let a = o[f], b = l[f];
			if (f === 'speed') { a = a === undefined ? 1 : a; b = b === undefined ? 1 : b; }
			const same = (typeof a === 'number' && typeof b === 'number') ? close(a, b) : String(a) === String(b);
			if (!same) { diffs.push(l.id + ' ' + f + ' ' + a + ' vs ' + b); }
		});
	});
	// The parser reads a check valve as an open pipe and reports it (this page has no check-valve
	// pipe), so the Status column is compared as written.
	const rawStatus = (text) => Object.fromEntries(section(text, 'PIPES').map((t) => [t[0], (t[7] || '').toUpperCase()]));
	const os = rawStatus(r.inp), ts = rawStatus(fs.readFileSync(inpFile, 'utf8'));
	Object.keys(ts).forEach((id) => {
		if (THEIRS_ONLY.links.indexOf(id) >= 0 || os[lAlias(id)] === undefined) { return; }
		compared++;
		if (os[lAlias(id)] !== ts[id]) { diffs.push(id + ' Status ' + os[lAlias(id)] + ' vs ' + ts[id]); }
	});
	console.log('       ' + compared + ' attribute values compared; differences:');
	diffs.forEach((d) => console.log('         ' + d));
	// The differences there are, each with its reason (dev/sqlite-reader.md):
	//   U1-B to T01: the export routes it to the inlet construction;
	//   U1-B Status CV vs Open: the database states a check valve on U1-B; the export drops it beside a pump;
	//   T01 diameter 3.048 vs 0.3048: a tank with a volume curve, where EPANET ignores the diameter; the
	//   database's circular diameter is 10 ft and the export writes 1 ft.
	//   3 and 4 x and y: where the two new junctions beside the pump are drawn is each writer's own.
	const EXPECTED = ['4 to T01 vs 2', '4 Status CV vs OPEN', 'T01 diameter 3.048 vs 0.304800000001219'];
	const unexpected = diffs.filter((d) => EXPECTED.indexOf(d) < 0 && !/^[34] [xy] /.test(d));
	ok('no difference beyond the explained ones', unexpected.length === 0, unexpected.join('; '));
	ok('the pattern-free file has the clock-time control', /LINK P1 CLOSED AT CLOCKTIME 4:00 PM/.test(r.inp));
	// The solve: both files at time zero.
	const a = await epanetSolve(r.inp), b = await epanetSolve(fs.readFileSync(inpFile, 'utf8'));
	let worstH = 0, worstQ = 0, nh = 0, nq = 0, whereH = '', whereQ = '';
	Object.keys(b.heads).forEach((id) => {
		const o = a.heads[nAlias(id)];
		if (o === undefined || THEIRS_ONLY.nodes.indexOf(id) >= 0) { return; }
		nh++;
		if (Math.abs(o - b.heads[id]) > worstH) { worstH = Math.abs(o - b.heads[id]); whereH = id; }
	});
	Object.keys(b.flows).forEach((id) => {
		const o = a.flows[lAlias(id)];
		if (o === undefined || THEIRS_ONLY.links.indexOf(id) >= 0) { return; }
		nq++;
		if (Math.abs(o - b.flows[id]) > worstQ) { worstQ = Math.abs(o - b.flows[id]); whereQ = id; }
	});
	console.log('       heads compared ' + nh + ', largest difference ' + worstH.toExponential(2) + ' m (' + whereH + '); flows ' + nq + ', largest ' + worstQ.toExponential(2) + ' L/s (' + whereQ + ')');
	ok('heads within 1 mm and flows within 0.01 L/s at time zero', worstH <= 1e-3 && worstQ <= 0.01);
	ok('the database file is unchanged', Buffer.compare(bytes, fs.readFileSync(dbFile)) === 0);
	db.close();

	// The child-scenario model.
	const wd = path.join(SAMPLES, 'WaterGems model', 'Badapokharan_MBR_withdrwal capacity curve.wtg.sqlite');
	if (fs.existsSync(wd)) {
		const db2 = await EC.lpnSqliteOpen(fs.readFileSync(wd));
		const r2 = EC.lpnWtgRead(db2, { display });
		ok('withdrawal model reads; Base plus Scenario - 1 and Scenario - 2', r2.ok && r2.scenarios.map((s) => s.name).join() === 'Scenario - 1,Scenario - 2');
		ok('neither overrides anything (the sample\'s child inherits every alternative)', r2.scenarios.every((s) => !Object.keys(s.overrides).length));
		ok('Scenario - 2 has no parent in the file, and the report says so', (noteOf(r2, 'wtg-scenario-root') || { ids: [] }).ids.join() === 'Scenario - 2');
		const a1 = r2.alternatives.filter((x) => x.name === 'Alternative 1')[0];
		ok('the unused "Alternative 1" carries its own P1 length, 902 m (Base: 882)', a1 && a1.root && a1.values['l:P1'] && a1.values['l:P1'].length === 902, JSON.stringify(a1 && a1.values['l:P1']));
		ok('R-2 head pattern carried', /R-2\s+1\s+Reservoir_Pattern_-_1/.test(r2.inp));
		db2.close();
	}
}

(async function () {
	await synthetic();
	await samples();
	console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
