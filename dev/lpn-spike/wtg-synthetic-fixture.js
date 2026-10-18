// A Bentley-shaped WaterGEMS database, BUILT at test time by Python's sqlite3, for
// wtg-import-harness.js and wtg-import-browser-harness.js. No real model file is in the repository
// (Tom's open question on Bentley's licence); this one is made from the layout the public samples
// show (dev/sqlite-reader.md). Its child scenario, "Peak, small main", names a child Physical
// alternative that changes one pipe: the patent's reading of how an override is stored, NOT OBSERVED.
//
//   R1 -P1(CV)- [PMP1 pump] -P2- J1 -P3- [PRV1 22 m] -P4- T1 (variable-area tank)
//                                J1 -P5- J_3 (inactive), J1 -P6- J2 (both deleted), SPOT-1 (unsupported)
'use strict';
const { execFileSync } = require('child_process');

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

/** Write the database to `file` and return the path. */
function buildSyntheticWtg(file) {
	execFileSync('python3', ['-I', '-c', PY, file]);
	return file;
}
module.exports = { buildSyntheticWtg };
