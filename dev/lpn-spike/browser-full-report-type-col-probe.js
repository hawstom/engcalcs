// THE FULL REPORT'S TYPE COLUMN MUST BE WIDE ENOUGH FOR ITS WORD, in a real Chrome (layout is work
// the node stub does not do). Tom, 2026-10-03: *"Peripheral, Report, Full, Junction column is too
// narrow for the word 'Junction'."* `overflow-wrap: anywhere` on .lpn-ff-table td let auto layout
// squeeze the column to one letter, so the noun broke mid-word.
//
//   SCRIPT=dev/lpn-spike/browser-full-report-type-col-probe.js \
//     PAGE=http://127.0.0.1:8431/engcalcs/Looped-Network.php node dev/lpn-spike/browser-drive.js
// (SCRIPT is resolved from browser-drive.js's folder, so give it as an absolute path.)
//
// Per language, with the Full report box made narrow (the case that squeezes): every Type cell must
// show its whole word on ONE line -- no wrapped line (cell height equals the single-line height of
// its ID cell) and no overflow (scrollWidth <= clientWidth). Exits non-zero on any failure.
const fs = require('fs');
module.exports = async function ({ send, evaluate, sleep }) {
  const URL_ = process.env.PAGE;
  const PROJ = process.env.PROJ || 'dev/water-network-examples/Net3.lwn';
  const LANGS = (process.env.LANGS || 'en,de,ru,am,ar,hi,my,km,es,fr,pt,tr,zh,sw,he,fa,ur,bn,bg,cs,hr,id,it,ps,ro,sr,uk').split(',');
  let failures = 0;
  for (const lang of LANGS) {
    await send('Page.navigate', { url: URL_ + (URL_.includes('?') ? '&' : '?') + 'lang=' + lang });
    await sleep(3500);
    await evaluate(`(function(){
      localStorage.setItem('lpn_project_typeCol', ${JSON.stringify(fs.readFileSync(PROJ, 'utf8'))});
      localStorage.removeItem('lpn_index'); localStorage.removeItem('lpn_fullbox'); return 'ok';
    })()`);
    await send('Page.navigate', { url: URL_ + (URL_.includes('?') ? '&' : '?') + 'lang=' + lang });
    await sleep(7000);
    await evaluate(`(function(){
      var t = Array.from(document.querySelectorAll('button.lpn-tab-name'))
        .filter(function (e) { return e.textContent.replace('*', '').trim() !== 'Project1'; })[0];
      if (t) { t.click(); } return 'ok';
    })()`);
    await sleep(6000);
    const r = JSON.parse(await evaluate(`(function(){
      EngCalcs.lpnOpenFullReportBox();
      var box = document.getElementById('lpn_full_box');
      box.style.width = '320px';
      var cells = Array.from(document.querySelectorAll('#lpn_full_report tbody tr td:first-child'));
      var bad = [], seen = {};
      cells.forEach(function (td) {
        var id = td.nextElementSibling, w = td.textContent;
        var cs = getComputedStyle(td), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
        var rg = document.createRange(); rg.selectNodeContents(td); var textH = rg.getBoundingClientRect().height;
        seen[w] = 1;
        if (td.scrollWidth > td.clientWidth || textH > lh * 1.5) { bad.push(w + ' sw=' + td.scrollWidth + ' cw=' + td.clientWidth + ' h=' + textH); }
      });
      return JSON.stringify({ n: cells.length, words: Object.keys(seen), bad: bad.slice(0, 5), nbad: bad.length });
    })()`));
    const ok = r.n > 0 && r.nbad === 0;
    console.log((ok ? '  ok   ' : '  FAIL ') + lang + ': ' + r.n + ' type cells; ' + r.words.join('/') + (r.nbad ? '; overflowing: ' + r.bad.join(' | ') : ''));
    if (!ok) { failures++; }
  }
  if (failures) { console.log(failures + ' language(s) FAILED'); try { require('./browser-drive.js').chrome.kill(); } catch (e) {} process.exit(1); }
  console.log('all languages ok');
};
