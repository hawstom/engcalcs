// Runs an EPANET .inp through the real EPANET engine (WASM) and dumps the
// steady-state (t=0) hydraulic solution as JSON. This is the reference oracle.
const fs = require('fs');
const path = require('path');
const { Project, Workspace, NodeProperty, LinkProperty, NodeType, LinkType, CountType } = require('epanet-js');

const inpPath = process.argv[2];
const outPath = process.argv[3];

main().catch((e) => { console.error(e); process.exit(1); });

async function main() {

const ws = new Workspace();
await ws.loadModule();
const p = new Project(ws);

ws.writeFile('in.inp', fs.readFileSync(inpPath, 'utf8'));
p.open('in.inp', 'out.rpt', 'out.bin');

// EPANET's default ACCURACY is 0.001 relative flow change, which leaves a visible
// residual on low-flow links -- enough that a near-dead-end pipe can be reported
// with a flow that is off by more than the number itself. Tighten it, so the
// reference is a converged solution rather than a stopped one, and so that any
// disagreement with our solver is attributable to us.
const { Option } = require('epanet-js');
p.setOption(Option.Accuracy, 1e-8);
p.setOption(Option.Trials, 200);

p.openH();
p.initH(0);
p.runH(); // t = 0 steady state

const nodeCount = p.getCount(CountType.NodeCount);
const linkCount = p.getCount(CountType.LinkCount);

const nodes = [];
for (let i = 1; i <= nodeCount; i++) {
  nodes.push({
    id: p.getNodeId(i),
    type: NodeType[p.getNodeType(i)],
    elevation: p.getNodeValue(i, NodeProperty.Elevation),
    demand: p.getNodeValue(i, NodeProperty.Demand),
    head: p.getNodeValue(i, NodeProperty.Head),
    pressure: p.getNodeValue(i, NodeProperty.Pressure),
  });
}

const links = [];
for (let i = 1; i <= linkCount; i++) {
  const { node1: n1, node2: n2 } = p.getLinkNodes(i);
  links.push({
    id: p.getLinkId(i),
    type: LinkType[p.getLinkType(i)],
    from: p.getNodeId(n1),
    to: p.getNodeId(n2),
    length: p.getLinkValue(i, LinkProperty.Length),
    diameter: p.getLinkValue(i, LinkProperty.Diameter),
    roughness: p.getLinkValue(i, LinkProperty.Roughness),
    minorLoss: p.getLinkValue(i, LinkProperty.MinorLoss),
    // Status at t=0 is boundary data for this instant's hydraulic problem, exactly
    // like demands and tank heads: it is set by [STATUS] and by controls, and
    // evaluating controls is not the solver's job (see the scope doc's cut list).
    status: p.getLinkValue(i, LinkProperty.Status) === 0 ? 'closed' : 'open',
    flow: p.getLinkValue(i, LinkProperty.Flow),
    velocity: p.getLinkValue(i, LinkProperty.Velocity),
    headloss: p.getLinkValue(i, LinkProperty.Headloss),
  });
}

p.closeH();
p.close();

const out = { source: path.basename(inpPath), nodes, links };
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`${path.basename(inpPath)}: ${nodes.length} nodes, ${links.length} links -> ${outPath}`);

}
