// JUDGES ONLY. BUILDERS MUST NOT READ THIS DIRECTORY (dev/label-placement-rules.md §5, Tom's Q11).
//
// **TOM'S CROSSING WEIGHTS, 0 TO 1** (his Q05 answer of 2026-09-27, dev/label-placement-rules.md
// Part B). Builders are told only the ORDER (his ruling of 2026-09-28: "Only the order, I think"),
// and the public bench counts each crossing by its rank in that order (score.js RANKS). These
// numbers lived in score.js through rounds 1 and 2, which was on the builders' reading list; they
// live here now, and judge.js reports the weighted cost beside the bench's ranked one.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

module.exports = {
	labelOnText: 1, labelOnSymbol: 1, labelOnLabel: 1, leaderOnLeader: 0.9,
	labelOnLeader: 0.7, labelOnLink: 0.3, leaderOnLink: 0.2, labelOnCustomer: 0
};
