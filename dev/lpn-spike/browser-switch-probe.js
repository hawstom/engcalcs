// ONE PROBE FOR dev/lpn-spike/browser-drive.js: switch back and forth between two projects in a
// REAL Chrome and print the page's own ?debug=perf line for each switch.
//
// It writes the two documents straight into `localStorage` under `lpn_project_<id>` keys and clears
// `lpn_index`: the page ADOPTS a project key that no index mentions (adoptOrphans), so this needs
// no file picker and no import path. Then it clicks the TAB BUTTON -- `button.lpn-tab-name`, which
// is where renderTabs() puts the handler; a synthetic mouse event on the surrounding `.lpn-tab`
// span does nothing at all, which cost an hour the day this was written.
//
// DEVTOOLS=1 switches on the DOM and CSS domains before measuring, which is what an open Elements
// panel does to a page. Worth 2-3x on the numbers here, and the reason to ask a human to CLOSE
// DevTools before sending a readout.

const fs = require('fs');
module.exports = async function ({ send, evaluate, logs, sleep }) {
  const URL_ = process.env.PAGE;
  await send('Page.navigate', { url: URL_ });
  await sleep(4000);
  await evaluate(`(function(){
    localStorage.setItem('lpn_project_probeBig', ${JSON.stringify(fs.readFileSync(process.env.BIG, 'utf8'))});
    localStorage.setItem('lpn_project_probeSmall', ${JSON.stringify(fs.readFileSync(process.env.SMALL, 'utf8'))});
    localStorage.removeItem('lpn_index'); return 'ok';
  })()`);
  await send('Page.navigate', { url: URL_ });
  await sleep(9000);
  // **WHAT DEVTOOLS DOES TO A PAGE.** Opening the Elements panel turns on the DOM and CSS domains,
  // and from then on every mutation is reported to the frontend. That is the one thing his browser
  // is doing that this one is not, and it lands exactly where his time goes: writes, not reads.
  if (process.env.DEVTOOLS === '1') {
    await send('DOM.enable');
    await send('CSS.enable');
    await send('DOM.getDocument', { depth: -1 });
    console.log('  (DOM/CSS domains enabled -- the page is now being watched like DevTools does)');
  }
  const current = () => evaluate(`(document.querySelector('.lpn-tab-current .lpn-tab-name')||{}).textContent`);
  async function switchTo(name) {
    // The whole tab, not its name: a click on the CURRENT tab's name starts an inline rename.
    // The NAME is the button that carries the handler (renderTabs); the span around it carries none.
    return evaluate(`(function(){
      var t = Array.from(document.querySelectorAll('button.lpn-tab-name'))
        .find(function(e){ return e.textContent.replace('*','').trim() === ${JSON.stringify(name)}; });
      if (!t) { return 'no such tab'; }
      t.click();
      return 'clicked';
    })()`);
  }
  for (let i = 1; i <= 4; i++) {
    const c1 = await switchTo('Net1'); await sleep(3500);
    const onNet1 = await current();
    logs.length = 0;
    const c2 = await switchTo('Net3-Novato-CA-World');
    await sleep(6500);
    const onNet3 = await current();
    const line = logs.filter(l => l.indexOf('SWITCH') > 0).pop();
    console.log('  round ' + i + ' (' + String(onNet1).trim() + ' -> ' + String(onNet3).trim() + '): '
      + (line ? line.replace('[lpn perf] ', '').replace(/ {2,}/g, '  ') : 'NO LINE  [' + c1 + '/' + c2 + ']'));
  }
};
