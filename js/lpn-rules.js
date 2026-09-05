// lpn-rules.js -- EPANET's rule-based controls ([RULES]): the grammar, and what each number MEANS.
//
// ROADMAP Task 248.03. The text has been carried verbatim on `doc.rules` since the first phase; what
// was missing was the LANGUAGE, and the reason the language is not optional is UNITS.
//
// **A RULE'S NUMBERS ARE IN THE UNITS OF THE FILE THE USER OPENED, AND THE ENGINE BRIDGE WRITES LPS
// AND METRES ALWAYS.** `IF TANK T1 LEVEL ABOVE 20` means twenty FEET in a GPM file and arrives beside
// a tank whose level the bridge has already restated as 4.572, so the rule never fires -- and one
// that DID fire would fire at the wrong threshold, with every number on screen looking reasonable.
// That is the shape of the two worst defects this project has recorded, which is why the text was
// deliberately NOT handed to the engine until this file existed.
//
// **YOU CANNOT SCALE A RULE'S NUMBERS WITHOUT PARSING IT.** `20` in a rule is a level, a pressure, a
// flow, a valve setting, a pump speed, a roughness or a bare count of hours depending on the two
// words in front of it and, for SETTING, on what kind of link the id names. So the unit answer and
// the grammar are the same piece of work.
//
// **THIS IS EPANET'S LANGUAGE, NOT A DIALECT OF OURS** (Tom, 2026-09-05: *"implementing 'all of
// EPANET' seems to be the only sensible thing to do right now"*). Every keyword, every attribute and
// every relation below is EPANET's own, spelled as EPANET spells it, so a hydraulic engineer
// recognises the whole vocabulary and an existing rule can be pasted in unchanged. CLAUDE.md's
// "our vocabulary is not EPANET's" rule covers exactly two OBJECTS, Label and Text, and nothing here.
//
// PURE, like js/lpn-geom.js and js/lpn-collide.js: strings and numbers in, strings and numbers out.
// No DOM, no `doc`, no settings, no language strings, no engine. It knows nothing about which units
// a project is in -- the caller hands over a `convert(value, kind)` and this file says what KIND
// each number is, which is the only half of the question a grammar can answer.
//
// THE FOUR ENTRY POINTS, and why there are four rather than one:
//
//   lpnRuleSplit(lines)      Partition the [RULES] text into one chunk per RULE, LOSING NOTHING --
//                            blank lines and comments included, so joining the chunks back together
//                            reproduces the input line for line. That is what lets the editor
//                            rewrite one rule and leave every other line of the user's file exactly
//                            as it came in.
//   lpnRuleParse(lines)      The grammar. One record per rule, one clause per line, each numeric
//                            clause tagged with its quantity kind.
//   lpnRuleConvert(block, …) A COPY of a parsed rule with its numbers moved into another unit
//                            system. Never in place: the document's rule is the user's.
//   lpnRuleWrite(blocks, …)  Engine text, composed from the records and never copied from `raw` --
//                            the same rule js/lpn-epanet.js already states for a [CONTROLS] line.

var EngCalcs = EngCalcs || {};

(function () {
	'use strict';

	// ---------------------------------------------------------------------------
	// THE VOCABULARY -- EPANET's, exactly
	// ---------------------------------------------------------------------------

	// An object keyword is followed by its id. SYSTEM is the one that has none, which is the single
	// piece of grammar `EngCalcs.lpnRuleBlocks()` in js/lpn-inp.js leans on to read ids out of a rule
	// it does not understand. That function answers "which elements does this rule NAME"; this file
	// answers "what does this rule MEAN". Two questions, two functions, deliberately not merged.
	var NODE_OBJECTS = { NODE: 1, JUNCTION: 1, RESERVOIR: 1, TANK: 1 };
	var LINK_OBJECTS = { LINK: 1, PIPE: 1, PUMP: 1, VALVE: 1 };

	// **THE KIND IS THE WHOLE POINT OF THE FILE.** `head` is a length (a water level, a grade, a
	// head), `pressure` is a pressure, `flow` is a flow, `roughness` is a length or a bare number
	// depending on the friction formula, and `none` is a quantity no unit can touch: a status
	// keyword, a pump speed, a throttle valve's loss coefficient, a priority, a count of hours.
	//
	// LEVEL, HEAD and GRADE are one kind and not three. EPANET measures LEVEL from the tank bottom
	// and GRADE from the datum, so they are different NUMBERS about the same tank -- but they are the
	// same DIMENSION, and a dimension is all a unit factor can ever be told about.
	var NODE_ATTRS = {
		DEMAND: 'flow', HEAD: 'head', GRADE: 'head', LEVEL: 'head', PRESSURE: 'pressure',
		// EPANET 2.2 tank attributes, both in HOURS whatever the flow units say, so neither moves.
		FILLTIME: 'none', DRAINTIME: 'none'
	};
	var LINK_ATTRS = {
		FLOW: 'flow', STATUS: 'none',
		// **SETTING IS THE ONE THAT CANNOT BE ANSWERED HERE**, because it means whatever the link is:
		// a pressure on a PRV, PSV or PBV, a flow on an FCV, a speed on a pump, a loss coefficient on
		// a TCV, a roughness on a pipe. The caller resolves it -- see lpnRuleConvert's third argument
		// -- and until it does the clause carries the kind `setting`, which converts as `none`.
		SETTING: 'setting'
	};
	var SYSTEM_ATTRS = { DEMAND: 'flow', TIME: 'none', CLOCKTIME: 'none' };

	// EPANET's relations, all ten of them, in both spellings it accepts.
	var RELATIONS = {
		'=': 1, '<>': 1, '<': 1, '>': 1, '<=': 1, '>=': 1,
		IS: 1, NOT: 1, BELOW: 1, ABOVE: 1
	};

	// The words that open a clause. AND appears in both halves of a rule and is told apart by which
	// half it is in, which is why the parser carries a section rather than a per-word table.
	var CONDITION_JOINS = { IF: 1, AND: 1, OR: 1 };
	var ACTION_JOINS = { THEN: 1, ELSE: 1, AND: 1 };

	function up(t) { return String(t === undefined || t === null ? '' : t).toUpperCase(); }

	// A line's words, with an EPANET comment (`;` to end of line) removed. The RAW line is kept
	// beside them everywhere, because it is the user's text.
	function words(line) {
		return String(line === undefined || line === null ? '' : line)
			.replace(/;.*$/, '').trim().split(/\s+/).filter(Boolean);
	}

	// ---------------------------------------------------------------------------
	// 1. SPLIT -- one chunk per rule, losing nothing
	// ---------------------------------------------------------------------------
	/**
	 * Partition `lines` into chunks, one per `RULE` keyword, preserving every line.
	 *
	 * **THE CONCATENATION OF THE CHUNKS IS THE INPUT, LINE FOR LINE.** That is the property the
	 * editor is built on: a user editing rule two must leave rules one and three, and the blank lines
	 * and comments between them, byte-identical. A splitter that quietly dropped a blank line would
	 * rewrite the user's file the first time they touched any rule in it, which is the rule CLAUDE.md
	 * states as "only the user touches a file's numbers" seen from the text side.
	 *
	 * A line before the first `RULE` is impossible in a valid file, so it cannot be dropped: it goes
	 * into a leading chunk with no name, which the editor shows and the engine bridge skips.
	 */
	function ruleSplit(lines) {
		var out = [], cur = null, i, w;
		for (i = 0; i < (lines || []).length; i++) {
			w = words(lines[i]);
			if (w.length && up(w[0]) === 'RULE') {
				cur = { name: w[1] || '', lines: [], trailing: 0 };
				out.push(cur);
			} else if (!cur) {
				cur = { name: '', lines: [], trailing: 0 };
				out.push(cur);
			}
			cur.lines.push(String(lines[i]));
			// **HOW MANY LINES AT THE END OF THIS CHUNK SAY NOTHING**, which is what lets the editor
			// rewrite a rule without eating the blank line and the comment that introduce the NEXT
			// one. They belong to this chunk for the lossless-concatenation property above; they
			// belong to the next one for a reader, and both are true at once only if the count is
			// carried. The editor shows `lines` without them and puts them back afterwards.
			cur.trailing = w.length ? 0 : cur.trailing + 1;
		}
		return out;
	}

	// ---------------------------------------------------------------------------
	// 2. PARSE -- the grammar
	// ---------------------------------------------------------------------------

	// One clause. `ok` false means this file could not read the line, which is never fatal: the line
	// is kept with its raw text and the rule it belongs to simply does not reach the engine.
	function unreadable(raw) {
		return { part: 'unreadable', ok: false, raw: String(raw), kind: 'none' };
	}

	/**
	 * One clause out of the words after its joining keyword.
	 *
	 * `section` is 'cond' or 'act'. The two halves have the same shape -- object, id, attribute,
	 * relation, value -- and EPANET's own manual writes them that way, so they are one parser with a
	 * different set of legal attributes rather than two.
	 */
	function parseClause(join, rest, section, raw) {
		var obj = up(rest[0]), id = null, attr, rel, valueWords, kind, table, num;
		if (obj === 'SYSTEM') {
			table = SYSTEM_ATTRS;
			attr = up(rest[1]); rel = up(rest[2]); valueWords = rest.slice(3);
		} else if (NODE_OBJECTS[obj] || LINK_OBJECTS[obj]) {
			table = NODE_OBJECTS[obj] ? NODE_ATTRS : LINK_ATTRS;
			id = rest[1]; attr = up(rest[2]); rel = up(rest[3]); valueWords = rest.slice(4);
			if (id === undefined) { return unreadable(raw); }
		} else {
			return unreadable(raw);
		}
		kind = table[attr];
		if (kind === undefined || !RELATIONS[rel] || !valueWords.length) { return unreadable(raw); }
		// **AN ACTION IS ONLY EVER ABOUT A LINK, AND ONLY EVER STATUS OR SETTING.** EPANET accepts
		// nothing else after THEN or ELSE, so accepting more here would build an input the engine
		// rejects -- and one rejected rule takes the WHOLE input down, not just itself.
		if (section === 'act' && (!LINK_OBJECTS[obj] || (attr !== 'STATUS' && attr !== 'SETTING'))) {
			return unreadable(raw);
		}
		num = valueWords.length === 1 ? parseFloat(valueWords[0]) : NaN;
		// A dimensioned value must be ONE token and must be a number. A `none` value may be a
		// keyword (OPEN, CLOSED, ACTIVE), a clock time (`3 PM`, `12:30`) or a bare number, and is
		// carried as the text it was written as -- nothing converts it, so nothing may reformat it.
		if (kind !== 'none' && !isFinite(num)) { return unreadable(raw); }
		return {
			part: section, ok: true, raw: String(raw), join: up(join),
			object: obj, id: id === null ? null : String(id), attr: attr, rel: rel,
			kind: kind, value: isFinite(num) ? num : null, valueText: valueWords.join(' ')
		};
	}

	/**
	 * The grammar, applied to a whole `[RULES]` text.
	 *
	 * Returns one record per rule: `{ name, lines, clauses, ok, nodes, links }`. `ok` is true only
	 * when every line of the rule was read AND the rule has both a condition and an action, which is
	 * EPANET's own minimum for a rule that does anything.
	 *
	 * **A RULE THAT IS NOT `ok` IS NOT AN ERROR AND IS NEVER DISCARDED.** It is a rule this page
	 * cannot restate in another unit system, so it is kept, marked in the editor, written back to the
	 * file verbatim, and left out of the engine input -- which is the same treatment a control
	 * sentence the parser cannot read has had since simple controls shipped.
	 */
	function ruleParse(lines) {
		return ruleSplit(lines).map(function (chunk) {
			var block = { name: chunk.name, lines: chunk.lines, clauses: [], ok: true,
					nodes: [], links: [], hasCond: false, hasAct: false },
				section = 'cond';
			chunk.lines.forEach(function (line) {
				var w = words(line), join, clause;
				if (!w.length) { return; }                       // blank, or a whole-line comment
				join = up(w[0]);
				if (join === 'RULE') { return; }                 // the header, already read
				if (join === 'PRIORITY') {
					clause = { part: 'priority', ok: isFinite(parseFloat(w[1])), raw: String(line),
						join: 'PRIORITY', kind: 'none', value: parseFloat(w[1]),
						valueText: w.slice(1).join(' ') };
				} else if (join === 'THEN' || join === 'ELSE') {
					section = 'act';
					clause = parseClause(join, w.slice(1), 'act', line);
				} else if (section === 'act' && ACTION_JOINS[join]) {
					clause = parseClause(join, w.slice(1), 'act', line);
				} else if (CONDITION_JOINS[join]) {
					clause = parseClause(join, w.slice(1), 'cond', line);
				} else {
					clause = unreadable(line);
				}
				if (clause.ok && clause.part === 'cond') { block.hasCond = true; }
				if (clause.ok && clause.part === 'act') { block.hasAct = true; }
				if (clause.ok && clause.id) {
					(NODE_OBJECTS[clause.object] ? block.nodes : block.links).push(clause.id);
				}
				if (!clause.ok) { block.ok = false; }
				block.clauses.push(clause);
			});
			// A chunk with no RULE header is the text before the first rule. It is carried, never
			// sent: naming it `ok` would offer the engine a rule with no name.
			if (!block.name || !block.hasCond || !block.hasAct) { block.ok = false; }
			return block;
		});
	}

	// ---------------------------------------------------------------------------
	// 3. CONVERT -- the same number in another unit system
	// ---------------------------------------------------------------------------
	/**
	 * A COPY of `block` whose dimensioned values have been through `convert(value, kind)`.
	 *
	 * **NEVER IN PLACE.** The parsed block's numbers came out of the user's own file and the file is
	 * canonical; this page displays them, solves from a copy, and writes back what came in. A
	 * converter that mutated the block would put the engine's metres into the document, which is
	 * exactly the defect CLAUDE.md's "only the user touches a file's numbers" section exists for.
	 *
	 * `settingKindOf(clause)` resolves the one kind a grammar cannot: what a link's SETTING is. It is
	 * handed in because the answer is "what type is the link called `clause.id`", which is a fact
	 * about the document, not about the language. Omitted, a SETTING is left alone -- the honest
	 * answer when nobody can say what it measures.
	 */
	function ruleConvert(block, convert, settingKindOf) {
		var out = { name: block.name, lines: block.lines, ok: block.ok, clauses: [],
			nodes: block.nodes.slice(), links: block.links.slice() };
		out.clauses = block.clauses.map(function (c) {
			var copy = {}, kind = c.kind, k;
			for (k in c) { if (Object.prototype.hasOwnProperty.call(c, k)) { copy[k] = c[k]; } }
			if (kind === 'setting') {
				kind = (settingKindOf ? settingKindOf(c) : 'none') || 'none';
				copy.kind = kind;
			}
			if (kind !== 'none' && typeof copy.value === 'number' && isFinite(copy.value)) {
				copy.value = convert(copy.value, kind);
			}
			return copy;
		});
		return out;
	}

	// ---------------------------------------------------------------------------
	// 4. WRITE -- the engine's own text
	// ---------------------------------------------------------------------------
	/**
	 * `[RULES]` lines for an engine input, composed from the records.
	 *
	 * **COMPOSED, NEVER COPIED FROM `raw`.** The raw line states its numbers in the document's units
	 * and this text is for an input in another set of them; copying the characters through is the
	 * whole defect this file was written to close. It is the identical rule js/lpn-epanet.js already
	 * states one section higher for a [CONTROLS] line.
	 *
	 * `scale` is the last leg of the unit journey and belongs to the WRITER, not to this file: the
	 * caller's values are SI, and LPS is metric but not our metric. `{ flow: 1000 }` turns m3/s into
	 * L/s, `{ roughness: 1000 }` turns metres into the millimetres a Darcy-Weisbach input states.
	 */
	function ruleWrite(blocks, scale) {
		var s = scale || {}, out = [];
		(blocks || []).forEach(function (b) {
			if (!b || !b.ok) { return; }
			out.push('RULE ' + b.name);
			b.clauses.forEach(function (c) {
				var v;
				if (c.part === 'priority') { out.push('PRIORITY ' + c.valueText); return; }
				if (!c.ok) { return; }
				v = (c.kind !== 'none' && typeof c.value === 'number' && isFinite(c.value))
					? String(c.value * (s[c.kind] || 1))
					: c.valueText;
				out.push(c.join + ' ' + c.object + (c.id ? ' ' + c.id : '') +
					' ' + c.attr + ' ' + c.rel + ' ' + v);
			});
		});
		return out;
	}

	EngCalcs.lpnRuleSplit = ruleSplit;
	EngCalcs.lpnRuleParse = ruleParse;
	EngCalcs.lpnRuleConvert = ruleConvert;
	EngCalcs.lpnRuleWrite = ruleWrite;
	// The tables, exported so a harness can assert the vocabulary is EPANET's rather than restating
	// it, and so nothing outside this file has to keep a second copy of them.
	EngCalcs.lpnRuleAttrKinds = { node: NODE_ATTRS, link: LINK_ATTRS, system: SYSTEM_ATTRS };
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
