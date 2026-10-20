// THE 600-JUNCTION NETWORK'S HALF OF label-form-wheel-browser-harness.js (ROADMAP Tasks 734 and
// 812), split off so each half finishes inside run_harnesses.sh's 300 s. Run with:
//   node dev/lpn-spike/label-form-n600-browser-harness.js
// Every check, scene setting and reference is the wheel harness's own; this file only names the
// scene.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

process.env.LABEL_FORM_SCENES = 'n600';
require('./label-form-wheel-browser-harness.js');
