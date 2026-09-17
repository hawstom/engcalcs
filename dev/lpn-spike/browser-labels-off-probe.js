// ONE PROBE FOR dev/lpn-spike/browser-drive.js: how much LABEL WORK a project switch does with the
// thematic map ON, in a real Chrome, read off the page's own ?debug=perf line.
//
//   SCRIPT=dev/lpn-spike/browser-labels-off-probe.js \
//     PAGE='http://127.0.0.1:8110/engcalcs/Looped-Network.php?debug=perf' \
//     node dev/lpn-spike/browser-drive.js
//
// Two projects are written straight into localStorage (adoptOrphans picks up a project key no index
// mentions), the big one in two copies -- one ordinary, one with settings.colorThematic set. Then
// each is switched into from Net1 and the perf line for that switch is printed. The numbers that
// matter are `label passes` and `label measurements`: a measurement is a forced synchronous layout,
// which is the cost node cannot feel and this can.
const fs = require('fs');
module.exports = async function ({ send, evaluate, logs, sleep }) {
  const URL_ = process.env.PAGE;
  const big = JSON.parse(fs.readFileSync(process.env.BIG ||
    'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8'));
  const small = fs.readFileSync(process.env.SMALL || 'dev/water-network-examples/Net1.lwn', 'utf8');
  big.project = Object.assign({}, big.project, { name: 'PlainMap' });
  const plain = JSON.stringify(big);
  big.project = Object.assign({}, big.project, { name: 'ThematicMap' });
  big.settings = Object.assign({}, big.settings, { colorThematic: true });
  const thematic = JSON.stringify(big);

  await send('Page.navigate', { url: URL_ });
  await sleep(4000);
  await evaluate(`(function(){
    localStorage.setItem('lpn_project_probePlain', ${JSON.stringify(plain)});
    localStorage.setItem('lpn_project_probeThem', ${JSON.stringify(thematic)});
    localStorage.setItem('lpn_project_probeSmall', ${JSON.stringify(small)});
    localStorage.removeItem('lpn_index'); return 'ok';
  })()`);
  await send('Page.navigate', { url: URL_ });
  await sleep(9000);

  async function switchTo(name) {
    return evaluate(`(function(){
      var t = Array.from(document.querySelectorAll('button.lpn-tab-name'))
        .find(function(e){ return e.textContent.replace('*','').trim() === ${JSON.stringify(name)}; });
      if (!t) { return 'no such tab'; }
      t.click(); return 'clicked';
    })()`);
  }
  function counts(line) {
    const p = /label passes (\d+)/.exec(line || ''), m = /label measurements (\d+)/.exec(line || '');
    return (p ? p[1] : '?') + ' passes / ' + (m ? m[1] : '?') + ' measurements';
  }
  for (const name of ['PlainMap', 'ThematicMap', 'PlainMap', 'ThematicMap']) {
    await switchTo('Net1'); await sleep(3500);
    logs.length = 0;
    const c = await switchTo(name);
    await sleep(6500);
    const line = logs.filter(l => l.indexOf('label passes') > 0).pop();
    console.log('  switch into ' + name.padEnd(13) + counts(line) + '   [' + c + ']');
    if (line) { console.log('      ' + line.replace('[lpn perf] ', '').replace(/ {2,}/g, '  ')); }
  }
};
