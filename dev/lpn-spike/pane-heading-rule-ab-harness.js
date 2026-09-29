// Part (ab) of pane-heading-rule-harness.js -- see that file's head for what is asserted and why
// it runs in three parts (run_harnesses.sh's 300 s per file). This file only chooses the part.
// It drives a real Chromium through playwright, so run_harnesses.sh runs it alone.
//
//   node dev/lpn-spike/pane-heading-rule-ab-harness.js
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
process.env.PANE_RULE_PART = 'ab';
require('./pane-heading-rule-harness.js');
