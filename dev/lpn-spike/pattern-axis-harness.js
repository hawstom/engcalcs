// The Library pattern graph's axes: lpnPatternAxis() ticks, and the labels' presence in the page.
// Run with: node dev/lpn-spike/pattern-axis-harness.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
const EC = globalThis.EngCalcs;
let fails = 0;
function ok(name, cond, extra) { if (!cond) { fails++; console.log('  FAIL ' + name + (extra === undefined ? '' : ' -- ' + extra)); } }

// A 24-value, 1-hour-step pattern: six ticks, every fourth period, clock time (period-1) x 1 h.
const day = []; for (let i = 0; i < 24; i++) { day.push(0.5 + i / 24); }
const a = EC.lpnPatternAxis(day, 3600);
ok('six ticks', a.ticks.length === 6, a.ticks.length);
ok('periods 1,5,9,13,17,21', a.ticks.map(t => t.period).join() === '1,5,9,13,17,21', a.ticks.map(t => t.period).join());
ok('times 0:00..20:00', a.ticks.map(t => t.time).join() === '0:00,4:00,8:00,12:00,16:00,20:00', a.ticks.map(t => t.time).join());
ok('fractions', Math.abs(a.ticks[1].frac - 4 / 24) < 1e-12 && a.ticks[0].frac === 0);
ok('range is min..max', a.lo === 0.5 && Math.abs(a.hi - (0.5 + 23 / 24)) < 1e-12);

// A short pattern shows every period; a 30-minute step shows half hours.
const s = EC.lpnPatternAxis([1, 2, 3], 1800);
ok('short pattern every period', s.ticks.map(t => t.period).join() === '1,2,3');
ok('half-hour times', s.ticks.map(t => t.time).join() === '0:00,0:30,1:00', s.ticks.map(t => t.time).join());
// Flat pattern: the band the drawing gives it, never lo == hi.
const f = EC.lpnPatternAxis([1, 1, 1], 3600);
ok('flat band', f.lo === 0.5 && f.hi === 1.5);
ok('empty', EC.lpnPatternAxis([], 3600).ticks.length === 0);
ok('bad step falls back to 1 h', EC.lpnPatternAxis([1, 1], 0).ticks[1].time === '1:00');

// Labels are wired: the drawing code, its page key, and the English string exist.
const js = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const php = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
const en = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
ok('plot used in the library', /spark = libPatternPlot\(/.test(js) && /querySelector\('\.lpn-lib-plot'\)/.test(js));
ok('Multiplier label reused', /libPatternPlot[\s\S]{0,1500}lpn_library_pattern_values/.test(js));
ok('Time label reused', /libPatternPlot[\s\S]{0,2500}lpn_time_menu/.test(js));
ok('Period label key', /libPatternPlot[\s\S]{0,2500}lpn_library_pattern_axis_period/.test(js));
ok('Period key on the page', /lpn_library_pattern_axis_period: <\?=json_encode/.test(php));
ok('Period English', /lpn_library_pattern_axis_period'\]='Period';/.test(en));

console.log(fails ? fails + ' FAILED' : 'pattern-axis-harness: all passed');
process.exit(fails ? 1 : 0);
