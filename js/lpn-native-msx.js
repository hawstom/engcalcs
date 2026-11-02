// lpn-native-msx.js -- EPANET-MSX IN THE BUILT-IN SOLVER (Task 733, native-wire).
//
// A TRANSCRIPTION of the multi-species extension to EPANET, from its open source, epanet-msx
// (github.com/OpenWaterAnalytics/epanet-msx, src/), Copyright (C) 2007 Feng Shang, Lewis Rossman and
// James Uber, US EPA. That library is distributed under the GNU Lesser General Public License, version 3
// (doc/license.txt there); this file is part of a GNU General Public License v3 program and carries the
// source's notice. What is taken, and from which file:
//   mathexpr.c   the expression grammar and its evaluation (this file: compileExpr(), runExpr());
//   msxinp.c     the .msx file: sections, keywords, defaults and the errors it reports (lpnMsxParse());
//   msxchem.c    the chemistry of a segment: rate species by Euler, RK5 or ROS2, equilibrium species by
//                Newton, formula species, the hydraulic variables (the Chem part below);
//   rk5.c, ros2.c, newton.c, msxutils.c   the integrators, the algebraic solver, the LU solve;
//   msxqual.c, msxtank.c   segment transport, node mixing, sources and the four tank models (the Pass part).
// It is held to the engine itself (the vendored epanet-js build runs the same library) by
// dev/lpn-spike/native-msx-harness.js, expression by expression, solver by solver, case by case.
//
// Slice 1 (this section): the file and the expressions. No network is touched here.
(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	// ---- constants of msxtypes.h --------------------------------------------------------------------------
	var MISSING = -1e10,
		TINY = 1e-6,
		VISCOS = 1.1e-5,          // kinematic viscosity of water, ft2/s
		LPERFT3 = 28.317,         // litres per cubic foot, as EPANET and MSX both round it
		MPERFT = 0.3048,
		M2PERFT2 = 0.09290304,
		CM2PERFT2 = 929.0304,
		LPS_PER_CFS = 28.317;

	// ---- mathexpr.c --------------------------------------------------------------------------------------
	var MATH_FUNC = ['COS', 'SIN', 'TAN', 'COT', 'ABS', 'SGN', 'SQRT', 'LOG', 'EXP', 'ASIN', 'ACOS', 'ATAN', 'ACOT',
			'SINH', 'COSH', 'TANH', 'COTH', 'LOG10', 'STEP'];   // opcode = index + 10

	function isDigit(c) { return c >= '0' && c <= '9'; }
	function isLetter(c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'; }

	// The parser keeps mathexpr.c's own state variables (Err, Bc, PrevLex, CurLex, Pos) so its quirks are its own:
	// a "-" is part of a number only at the start or after "(", an exponent is a number, "3*-2" is an error.
	function compileExpr(formula, varCode) {
		var S = formula, Len = S.length, Pos = 0, Err = 0, Bc = 0, PrevLex = 0, CurLex = 0, Fvalue = 0, Ivar = -1, Token = '', tree;

		function getNumber() {
			var s = '', errflag = 0;
			while (Pos < Len && isDigit(S[Pos])) { s += S[Pos]; Pos++; }
			if (Pos < Len) {
				if (S[Pos] === '.') {
					s += '.'; Pos++;
					while (Pos < Len && isDigit(S[Pos])) { s += S[Pos]; Pos++; }
				}
				if (Pos < Len && (S[Pos] === 'e' || S[Pos] === 'E')) {
					s += 'E'; Pos++;
					if (Pos >= Len) { errflag = 1; }
					else {
						if (S[Pos] === '-' || S[Pos] === '+') { s += S[Pos]; Pos++; }
						if (Pos >= Len || !isDigit(S[Pos])) { errflag = 1; }
						else { while (Pos < Len && isDigit(S[Pos])) { s += S[Pos]; Pos++; } }
					}
				}
			}
			Pos--;
			return errflag ? 0 : parseFloat(s);
		}
		function getOperand() {
			switch (S[Pos]) {
			case '(': return 1;
			case ')': return 2;
			case '+': return 3;
			case '-':
				if (Pos < Len - 1 && isDigit(S[Pos + 1]) && (CurLex === 0 || CurLex === 1)) { Pos++; Fvalue = -getNumber(); return 7; }
				return 4;
			case '*': return 5;
			case '/': return 6;
			case '^': return 31;
			default: return 0;
			}
		}
		function getToken() {
			Token = '';
			while (Pos <= Len && Pos < Len && (isLetter(S[Pos]) || isDigit(S[Pos]))) { Token += S[Pos]; Pos++; }
			Pos--;
		}
		function getLex() {
			var n;
			while (Pos < Len && S[Pos] === ' ') { Pos++; }
			if (Pos >= Len) { return 0; }
			n = getOperand();
			if (n === 0) {
				if (isLetter(S[Pos])) {
					getToken();
					n = MATH_FUNC.indexOf(Token.toUpperCase()); n = n >= 0 ? n + 10 : 0;
					if (n === 0) { Ivar = varCode(Token); n = Ivar >= 0 ? 8 : 0; }
				} else if (isDigit(S[Pos])) { n = 7; Fvalue = getNumber(); }
			}
			Pos++;
			PrevLex = CurLex;
			CurLex = n;
			return n;
		}
		function node() { return { op: 0, iv: -1, f: 0, l: null, r: null }; }
		function getSingleOp(lexRef) {
			var left, opcode, right, nd, bracket;
			if (lexRef.v === 1) { Bc++; left = getTree(); }
			else {
				if (lexRef.v < 7 || lexRef.v === 9 || lexRef.v > 30) { Err = 1; return null; }
				opcode = lexRef.v;
				if (lexRef.v === 7 || lexRef.v === 8) {
					left = node(); left.op = opcode;
					if (lexRef.v === 7) { left.f = Fvalue; } else { left.iv = Ivar; }
				} else {
					lexRef.v = getLex();
					if (lexRef.v !== 1) { Err = 1; return null; }
					Bc++;
					left = node(); left.l = getTree(); left.op = opcode;
				}
			}
			lexRef.v = getLex();
			while (lexRef.v === 31) {
				lexRef.v = getLex();
				bracket = 0;
				if (lexRef.v === 1) { bracket = 1; lexRef.v = getLex(); }
				if (lexRef.v !== 7) { Err = 1; return null; }
				right = node(); right.op = lexRef.v; right.f = Fvalue;
				nd = node(); nd.l = left; nd.r = right; nd.op = 31;
				left = nd;
				if (bracket) { lexRef.v = getLex(); if (lexRef.v !== 2) { Err = 1; return null; } }
				lexRef.v = getLex();
			}
			return left;
		}
		function getOp(lexRef) {
			var left, right, nd, opcode, neg = 0;
			lexRef.v = getLex();
			if (PrevLex === 0 || PrevLex === 1) {
				if (lexRef.v === 4) { neg = 1; lexRef.v = getLex(); }
				else if (lexRef.v === 3) { lexRef.v = getLex(); }
			}
			left = getSingleOp(lexRef);
			while (lexRef.v === 5 || lexRef.v === 6) {
				opcode = lexRef.v;
				lexRef.v = getLex();
				right = getSingleOp(lexRef);
				nd = node();
				if (Err) { return null; }
				nd.l = left; nd.r = right; nd.op = opcode;
				left = nd;
			}
			if (neg) {
				nd = node();
				if (Err) { return null; }
				nd.l = left; nd.op = 9;
				left = nd;
			}
			return left;
		}
		function getTree() {
			var lexRef = { v: 0 }, left, right, nd, opcode;
			left = getOp(lexRef);
			for (;;) {
				if (lexRef.v === 0 || lexRef.v === 2) { if (lexRef.v === 2) { Bc--; } break; }
				if (lexRef.v !== 3 && lexRef.v !== 4) { Err = 1; break; }
				opcode = lexRef.v;
				right = getOp(lexRef);
				nd = node();
				if (Err) { break; }
				nd.l = left; nd.r = right; nd.op = opcode;
				left = nd;
			}
			return left;
		}
		function flatten(t, out) {
			if (!t) { return; }
			flatten(t.l, out); flatten(t.r, out);
			out.push(t);
		}
		tree = getTree();
		if (Bc !== 0 || Err !== 0 || !tree) { return null; }
		var nodes = [], prog;
		flatten(tree, nodes);
		prog = { op: new Int32Array(nodes.length), f: new Float64Array(nodes.length), iv: new Int32Array(nodes.length), n: nodes.length };
		nodes.forEach(function (t, i) { prog.op[i] = t.op; prog.f[i] = t.f; prog.iv[i] = t.iv; });
		return prog;
	}

	// mathexpr_eval(): a stack machine over the postfix list. `getVar(i)` answers a variable's value.
	var POOL = [], DEPTH = 0;
	function runExpr(prog, getVar) {
		var top = 0, i, op, r1, r2, n = prog.n, stack = POOL[DEPTH] || (POOL[DEPTH] = new Float64Array(64)), result;
		DEPTH++;
		stack[0] = 0;
		for (i = 0; i < n; i++) {
			op = prog.op[i];
			switch (op) {
			case 3: r1 = stack[top]; top--; stack[top] = stack[top] + r1; break;
			case 4: r1 = stack[top]; top--; stack[top] = stack[top] - r1; break;
			case 5: r1 = stack[top]; top--; stack[top] = stack[top] * r1; break;
			case 6: r1 = stack[top]; top--; stack[top] = stack[top] / r1; break;
			case 7: top++; stack[top] = prog.f[i]; break;
			case 8: r1 = getVar(prog.iv[i]); top++; stack[top] = r1; break;
			case 9: stack[top] = -stack[top]; break;
			case 10: stack[top] = Math.cos(stack[top]); break;
			case 11: stack[top] = Math.sin(stack[top]); break;
			case 12: stack[top] = Math.tan(stack[top]); break;
			case 13: stack[top] = 1.0 / Math.tan(stack[top]); break;
			case 14: stack[top] = Math.abs(stack[top]); break;
			case 15: r1 = stack[top]; stack[top] = r1 < 0 ? -1 : r1 > 0 ? 1 : 0; break;
			case 16: stack[top] = Math.sqrt(stack[top]); break;
			case 17: stack[top] = Math.log(stack[top]); break;
			case 18: stack[top] = Math.exp(stack[top]); break;
			case 19: stack[top] = Math.asin(stack[top]); break;
			case 20: stack[top] = Math.acos(stack[top]); break;
			case 21: stack[top] = Math.atan(stack[top]); break;
			case 22: stack[top] = 1.57079632679489661923 - Math.atan(stack[top]); break;
			case 23: r1 = stack[top]; stack[top] = (Math.exp(r1) - Math.exp(-r1)) / 2.0; break;
			case 24: r1 = stack[top]; stack[top] = (Math.exp(r1) + Math.exp(-r1)) / 2.0; break;
			case 25: r1 = stack[top]; stack[top] = (Math.exp(r1) - Math.exp(-r1)) / (Math.exp(r1) + Math.exp(-r1)); break;
			case 26: r1 = stack[top]; stack[top] = (Math.exp(r1) + Math.exp(-r1)) / (Math.exp(r1) - Math.exp(-r1)); break;
			case 27: stack[top] = Math.log10(stack[top]); break;
			case 28: r1 = stack[top]; stack[top] = r1 <= 0 ? 0 : 1; break;
			case 31: r1 = stack[top]; r2 = stack[top - 1]; stack[top - 1] = Math.exp(r1 * Math.log(r2)); top--; break;
			default: break;
			}
		}
		result = stack[top];
		DEPTH--;
		return result;
	}
	EC.lpnMsxCompile = compileExpr;
	EC.lpnMsxEval = runExpr;

	// ---- msxinp.c: the .msx file --------------------------------------------------------------------------
	var SECT_WORDS = ['[TITLE', '[SPECIE', '[COEFF', '[TERM', '[PIPE', '[TANK', '[SOURCE', '[QUALITY', '[PARAM', '[PATTERN', '[OPTION', '[REPORT'],
		S_TITLE = 0, S_SPECIES = 1, S_COEFF = 2, S_TERM = 3, S_PIPE = 4, S_TANK = 5, S_SOURCE = 6, S_QUALITY = 7, S_PARAM = 8, S_PATTERN = 9, S_OPTION = 10, S_REPORT = 11,
		OPTION_WORDS = ['AREA_UNITS', 'RATE_UNITS', 'SOLVER', 'COUPLING', 'TIMESTEP', 'RTOL', 'ATOL', 'COMPILER'],
		SOURCE_TYPES = ['CONC', 'MASS', 'SETPOINT', 'FLOW'],
		HYD_WORDS = ['', 'D', 'Q', 'U', 'Re', 'Us', 'Ff', 'Av', 'Kc'],
		EXPR_WORDS = ['', 'RATE', 'FORMULA', 'EQUIL'],
		ERR_TEXT = {
			401: 'too few items', 402: 'a name that is not defined', 403: 'a name that is already used', 404: 'a name that is a reserved word',
			405: 'a number that cannot be read', 406: 'a keyword that is not known', 407: 'a duplicate expression', 408: 'a math expression that cannot be read',
			410: 'a term that refers to itself'
		};
	// msxutils.c MSXutils_match(): the text starts with the keyword, upper-cased on both sides; skips leading blanks.
	function matchWord(str, word) {
		if (!word) { return false; }
		return String(str).replace(/^ +/, '').toUpperCase().indexOf(word.toUpperCase()) === 0;
	}
	function findMatch(str, words) {
		var i;
		for (i = 0; i < words.length; i++) { if (matchWord(str, words[i])) { return i; } }
		return -1;
	}
	function getTokens(line) {
		var s = line, c = s.indexOf(';'), toks = [], re = /"([^"\n]*)"?|(\S+)/g, m;
		if (c >= 0) { s = s.slice(0, c); }
		while ((m = re.exec(s)) !== null) { toks.push(m[1] !== undefined ? m[1] : m[2]); }
		return toks;
	}

	/**
	 * Read an EPANET-MSX file. `ids` says what the network holds: `node(id)`, `link(id)` and `tank(id)` (a tank, not
	 * a reservoir or a junction). Returns `{ ok, errors, spec }`; each error is `{ section, line, code, message, text }`
	 * in the file's own words (MSX reports "Error 4xx" with the line). `spec` carries what the run needs and nothing of
	 * the network: the options, the species with their expressions compiled, the terms, coefficients, patterns, the
	 * sources, the initial qualities and parameter overrides in file order.
	 */
	EC.lpnMsxParse = function (text, ids) {
		var lines = String(text || '').split(/\r?\n/), errors = [], sect = -1, spec, speciesIx = {}, termIx = {}, paramIx = {}, constIx = {}, patIx = {},
			i, toks, k, code, passes;
		ids = ids || {};
		spec = {
			title: '',
			options: { areaUnits: 'FT2', rateUnits: 'DAY', solver: 'EUL', coupling: 'NONE', qstep: null, rtol: 0.001, atol: 0.01 },
			species: [], terms: [], params: [], consts: [], patterns: [],
			sources: {},          // node id -> [{species, type, c0, pattern}], newest first as MSX keeps them
			quality: [],          // {scope: 'global'|'node'|'link', id, species, value} in file order
			paramOps: [],         // {scope: 'all'|'pipe'|'tank', id, param, value} in file order
			reported: { nodes: [], links: [] }
		};
		function err(c, line, lineNo) {
			errors.push({ section: SECT_WORDS[sect] ? SECT_WORDS[sect].slice(1) : '', line: lineNo, code: c, message: 'Error ' + c + ': ' + (ERR_TEXT[c] || 'a line that cannot be read'), text: line });
		}
		function checkId(id) {
			var j;
			for (j = 1; j < HYD_WORDS.length; j++) { if (id.toLowerCase() === HYD_WORDS[j].toLowerCase()) { return 404; } }
			if (speciesIx[id] || termIx[id] || paramIx[id] || constIx[id]) { return 403; }
			return 0;
		}
		function varCode(id) {
			var S = spec.species.length, T = spec.terms.length, P = spec.params.length, C = spec.consts.length, j;
			if (speciesIx[id]) { return speciesIx[id]; }
			if (termIx[id]) { return S + termIx[id]; }
			if (paramIx[id]) { return S + T + paramIx[id]; }
			if (constIx[id]) { return S + T + P + constIx[id]; }
			j = findMatch(id, HYD_WORDS);
			if (j >= 1) { return S + T + P + C + j; }
			return -1;
		}
		// ---- pass 1 (MSXinp_countMsxObjects): register the names, so an expression may refer ahead ----
		sect = -1;
		for (i = 0; i < lines.length; i++) {
			toks = getTokens(lines[i]);
			if (!toks.length || toks[0][0] === ';') { continue; }
			if (toks[0][0] === '[') { k = findMatch(toks[0], SECT_WORDS); sect = k; continue; }
			code = 0;
			if (sect === S_SPECIES) {
				if (toks.length < 2) { code = 401; } else if ((code = checkId(toks[1])) === 0) { spec.species.push({ id: toks[1] }); speciesIx[toks[1]] = spec.species.length; }
			} else if (sect === S_COEFF) {
				if (toks.length < 2) { code = 401; }
				else if (matchWord(toks[0], 'PARAM')) { if ((code = checkId(toks[1])) === 0) { spec.params.push({ id: toks[1], value: 0 }); paramIx[toks[1]] = spec.params.length; } }
				else if (matchWord(toks[0], 'CONST')) { if ((code = checkId(toks[1])) === 0) { spec.consts.push({ id: toks[1], value: 0 }); constIx[toks[1]] = spec.consts.length; } }
				else { code = 406; }
			} else if (sect === S_TERM) {
				if ((code = checkId(toks[0])) === 0) { spec.terms.push({ id: toks[0] }); termIx[toks[0]] = spec.terms.length; }
			} else if (sect === S_PATTERN) {
				if (!patIx[toks[0]]) { spec.patterns.push({ id: toks[0], values: [] }); patIx[toks[0]] = spec.patterns.length; }
			}
			if (code) { err(code, lines[i], i + 1); }
		}
		spec.species.forEach(function (s) { s.type = 'BULK'; s.units = ''; s.aTol = 0; s.rTol = 0; s.pipe = null; s.tank = null; });
		// ---- pass 2 (MSXinp_readMsxData) ----
		sect = -1;
		for (i = 0; i < lines.length; i++) {
			toks = getTokens(lines[i]);
			if (!toks.length || toks[0][0] === ';') { continue; }
			if (toks[0][0] === '[') { sect = findMatch(toks[0], SECT_WORDS); continue; }
			code = 0;
			switch (sect) {
			case S_TITLE: spec.title = lines[i]; break;
			case S_OPTION:
				if (toks.length < 2) { break; }
				k = findMatch(toks[0], OPTION_WORDS);
				if (k < 0) { code = 406; break; }
				if (k === 0) { j2(['FT2', 'M2', 'CM2'], 'areaUnits'); }
				else if (k === 1) { j2(['SEC', 'MIN', 'HR', 'DAY'], 'rateUnits'); }
				else if (k === 2) { j2(['EUL', 'RK5', 'ROS2'], 'solver'); }
				else if (k === 3) { j2(['NONE', 'FULL'], 'coupling'); }
				else if (k === 4) { var q = parseInt(toks[1], 10); if (!(q > 0)) { code = 405; } else { spec.options.qstep = q; } }
				else if (k === 5 || k === 6) {
					var x = Number(toks[1]);
					if (!isFinite(x) || toks[1].trim() === '') { code = 405; } else { spec.options[k === 5 ? 'rtol' : 'atol'] = x; }
				} else if (k === 7) { if (findMatch(toks[1], ['NONE', 'VC', 'GC']) < 0) { code = 406; } }
				break;
			case S_SPECIES:
				if (toks.length < 3) { code = 401; break; }
				if (!speciesIx[toks[1]]) { code = 402; break; }
				var sp = spec.species[speciesIx[toks[1]] - 1];
				if (matchWord(toks[0], 'BULK')) { sp.type = 'BULK'; } else if (matchWord(toks[0], 'WALL')) { sp.type = 'WALL'; } else { code = 406; break; }
				sp.units = toks[2];
				sp.aTol = 0; sp.rTol = 0;
				if (toks.length >= 4) { if (!isFinite(Number(toks[3]))) { code = 405; break; } sp.aTol = Number(toks[3]); }
				if (toks.length >= 5) { if (!isFinite(Number(toks[4]))) { code = 405; break; } sp.rTol = Number(toks[4]); }
				break;
			case S_COEFF:
				if (toks.length < 2) { break; }
				if (matchWord(toks[0], 'PARAM')) {
					if (!paramIx[toks[1]]) { code = 402; break; }
					if (toks.length >= 3) {
						if (!isFinite(Number(toks[2]))) { code = 405; break; }
						spec.params[paramIx[toks[1]] - 1].value = Number(toks[2]);
						spec.paramOps.push({ scope: 'all', param: paramIx[toks[1]], value: Number(toks[2]) });
					}
				} else if (matchWord(toks[0], 'CONST')) {
					if (!constIx[toks[1]]) { code = 402; break; }
					spec.consts[constIx[toks[1]] - 1].value = 0;
					if (toks.length >= 3) { if (!isFinite(Number(toks[2]))) { code = 405; break; } spec.consts[constIx[toks[1]] - 1].value = Number(toks[2]); }
				} else { code = 406; }
				break;
			case S_TERM:
				if (toks.length < 2) { break; }
				var prog = compileExpr(toks.slice(1).join(''), varCode);
				if (!prog) { code = 408; break; }
				spec.terms[termIx[toks[0]] - 1].prog = prog;
				spec.terms[termIx[toks[0]] - 1].refs = toks.slice(1).filter(function (t) { return !!termIx[t]; }).map(function (t) { return termIx[t] - 1; });
				break;
			case S_PIPE: case S_TANK:
				if (toks.length < 3) { code = 401; break; }
				k = findMatch(toks[0], EXPR_WORDS);
				if (k < 0) { code = 406; break; }
				if (!speciesIx[toks[1]]) { code = 402; break; }
				var sp2 = spec.species[speciesIx[toks[1]] - 1], which = sect === S_PIPE ? 'pipe' : 'tank';
				if (sp2[which]) { code = 407; break; }
				var pr = compileExpr(toks.slice(2).join(''), varCode);
				if (!pr) { code = 408; break; }
				sp2[which] = { kind: EXPR_WORDS[k], prog: pr };
				break;
			case S_SOURCE:
				if (toks.length < 4) { code = 401; break; }
				k = findMatch(toks[0], SOURCE_TYPES);
				if (k < 0) { code = 406; break; }
				if (ids.node && !ids.node(toks[1])) { code = 402; break; }
				if (!speciesIx[toks[2]]) { code = 402; break; }
				if (spec.species[speciesIx[toks[2]] - 1].type !== 'BULK') { break; }
				if (!isFinite(Number(toks[3]))) { code = 405; break; }
				var pat = 0;
				if (toks.length >= 5) { pat = patIx[toks[4]] || 0; if (!pat) { code = 402; break; } }
				var list = spec.sources[toks[1]] || (spec.sources[toks[1]] = []), found = null;
				list.forEach(function (s) { if (s.species === speciesIx[toks[2]]) { found = s; } });
				if (!found) { found = { species: speciesIx[toks[2]] }; list.unshift(found); }
				found.type = ['CONCEN', 'MASS', 'SETPOINT', 'FLOWPACED'][k]; found.c0 = Number(toks[3]); found.pattern = pat;
				break;
			case S_QUALITY:
				if (toks.length < 3) { code = 401; break; }
				var sc = matchWord(toks[0], 'GLOBAL') ? 'global' : matchWord(toks[0], 'NODE') ? 'node' : matchWord(toks[0], 'LINK') ? 'link' : null;
				if (!sc) { code = 406; break; }
				var si = speciesIx[sc === 'global' ? toks[1] : toks[2]];
				if (!si) { code = 402; break; }
				if (sc !== 'global' && toks.length < 4) { code = 401; break; }
				var qv = Number(sc === 'global' ? toks[2] : toks[3]);
				if (!isFinite(qv)) { code = 405; break; }
				if (sc === 'node' && ids.node && !ids.node(toks[1])) { code = 402; break; }
				if (sc === 'link' && ids.link && !ids.link(toks[1])) { code = 402; break; }
				spec.quality.push({ scope: sc, id: sc === 'global' ? null : toks[1], species: si, value: qv });
				break;
			case S_PARAM:
				if (toks.length < 4) { break; }
				var pi = paramIx[toks[2]] || 0;
				if (!isFinite(Number(toks[3]))) { code = 405; break; }
				if (matchWord(toks[0], 'PIPE')) {
					if (ids.link && !ids.link(toks[1])) { code = 402; break; }
					spec.paramOps.push({ scope: 'pipe', id: toks[1], param: pi, value: Number(toks[3]) });
				} else if (matchWord(toks[0], 'TANK')) {
					if (ids.node && !ids.node(toks[1])) { code = 402; break; }
					spec.paramOps.push({ scope: 'tank', id: toks[1], param: pi, value: Number(toks[3]) });
				} else { code = 406; }
				break;
			case S_PATTERN:
				if (toks.length < 2) { code = 401; break; }
				for (k = 1; k < toks.length; k++) {
					if (!isFinite(Number(toks[k]))) { code = 405; break; }
					spec.patterns[patIx[toks[0]] - 1].values.push(Number(toks[k]));
				}
				break;
			case S_REPORT:
				if (toks.length < 2) { break; }
				k = findMatch(toks[0], ['NODE', 'LINK', 'SPECIE', 'FILE', 'PAGESIZE']);
				if (k < 0) { code = 406; break; }
				if (k === 0 || k === 1) {
					for (var t = 1; t < toks.length; t++) {
						if (toks[t].toUpperCase() === 'ALL' || toks[t].toUpperCase() === 'NONE') { continue; }
						if (k === 0 && ids.node && !ids.node(toks[t])) { code = 402; }
						if (k === 1 && ids.link && !ids.link(toks[t])) { code = 402; }
					}
				} else if (k === 2) { if (!speciesIx[toks[1]]) { code = 402; } }
				break;
			default: break;
			}
			if (code) { err(code, lines[i], i + 1); }
		}
		function j2(words, key) {
			var j = findMatch(toks[1], words);
			if (j < 0) { code = 406; } else { spec.options[key] = words[j]; }
		}
		// a term may not refer to itself, directly or through others (msxinp.c checkCyclicTerms())
		function reaches(from, target, seen) {
			var t = spec.terms[from], j;
			if (!t || !t.refs) { return false; }
			for (j = 0; j < t.refs.length; j++) {
				if (t.refs[j] === target) { return true; }
				if (!seen[t.refs[j]]) { seen[t.refs[j]] = true; if (reaches(t.refs[j], target, seen)) { return true; } }
			}
			return false;
		}
		for (i = 0; i < spec.terms.length - 1; i++) {
			if (reaches(i, i, {})) { errors.push({ section: 'TERMS', line: 0, code: 410, message: 'Error 410: term ' + spec.terms[i].id + ' contains a cyclic reference.', text: '' }); break; }
		}
		// the default tolerances (msxproj.c convertUnits()), and a term or expression that failed to compile is an error already
		spec.species.forEach(function (s) {
			if (s.rTol === 0) { s.rTol = spec.options.rtol; }
			if (s.aTol === 0) { s.aTol = spec.options.atol; }
		});
		return { ok: errors.length === 0, errors: errors, spec: spec };
	};


	// ---- slices 2 to 5: the chemistry of a segment, and the transport (msxchem.c, rk5.c, ros2.c, newton.c, msxqual.c, msxtank.c) ----
	var HV_D = 1, HV_Q = 2, HV_U = 3, HV_RE = 4, HV_US = 5, HV_FF = 6, HV_AV = 7, HV_KC = 8, MAX_HYD_VARS = 9;

	// msxutils.c factorize() and solve(): LU with implicit scaling, 1-based.
	function factorize(a, n, w, indx) {
		var i, imax, j, k, big, dum, sum, temp;
		for (i = 1; i <= n; i++) {
			big = 0;
			for (j = 1; j <= n; j++) { temp = Math.abs(a[i][j]); if (temp > big) { big = temp; } }
			if (big === 0) { return 0; }
			w[i] = 1 / big;
		}
		for (j = 1; j <= n; j++) {
			for (i = 1; i < j; i++) {
				sum = a[i][j];
				for (k = 1; k < i; k++) { sum -= a[i][k] * a[k][j]; }
				a[i][j] = sum;
			}
			big = 0; imax = j;
			for (i = j; i <= n; i++) {
				sum = a[i][j];
				for (k = 1; k < j; k++) { sum -= a[i][k] * a[k][j]; }
				a[i][j] = sum;
				dum = w[i] * Math.abs(sum);
				if (dum >= big) { big = dum; imax = i; }
			}
			if (j !== imax) {
				for (k = 1; k <= n; k++) { dum = a[imax][k]; a[imax][k] = a[j][k]; a[j][k] = dum; }
				w[imax] = w[j];
			}
			indx[j] = imax;
			if (a[j][j] === 0) { a[j][j] = 1e-20; }   // TINY1
			if (j !== n) { dum = 1 / a[j][j]; for (i = j + 1; i <= n; i++) { a[i][j] *= dum; } }
		}
		return 1;
	}
	function luSolve(a, n, indx, b) {
		var i, ii = 0, ip, j, sum;
		for (i = 1; i <= n; i++) {
			ip = indx[i]; sum = b[ip]; b[ip] = b[i];
			if (ii) { for (j = ii; j <= i - 1; j++) { sum -= a[i][j] * b[j]; } }
			else if (sum) { ii = i; }
			b[i] = sum;
		}
		for (i = n; i >= 1; i--) {
			sum = b[i];
			for (j = i + 1; j <= n; j++) { sum -= a[i][j] * b[j]; }
			b[i] = sum / a[i][i];
		}
	}
	function matrix(n) { var m = [], i; for (i = 0; i < n; i++) { m.push(new Float64Array(n)); } return m; }
	// msxutils.c jacobian(): central differences, eps 1e-7. `f` is left holding the LAST function evaluation made at x[n] + eps
	// (not at x), exactly as the library leaves it, and Newton's first correction is computed from that vector.
	function jacobian(x, n, f, w, a, func) {
		var i, j, temp, eps = 1e-7, eps2;
		for (j = 1; j <= n; j++) {
			temp = x[j];
			x[j] = temp + eps;
			func(0, x, n, f);
			if (temp === 0) { x[j] = temp; eps2 = eps; } else { x[j] = temp - eps; eps2 = 2 * eps; }
			func(0, x, n, w);
			for (i = 1; i <= n; i++) { a[i][j] = (f[i] - w[i]) / eps2; }
			x[j] = temp;
		}
	}
	// newton.c newton_solve(): returns iterations used, -1 singular, -2 not converged.
	function newtonSolve(x, n, maxit, numsig, func, work) {
		var i, k, errx, errmax, cscal, relconvg = Math.pow(10, -numsig), F = work.F, W = work.W, J = work.J, Indx = work.Indx;
		for (k = 1; k <= maxit; k++) {
			jacobian(x, n, F, W, J, func);
			if (!factorize(J, n, W, Indx)) { return -1; }
			for (i = 1; i <= n; i++) { F[i] = -F[i]; }
			luSolve(J, n, Indx, F);
			errmax = 0;
			for (i = 1; i <= n; i++) {
				cscal = x[i];
				if (cscal < relconvg) { cscal = relconvg; }
				x[i] += F[i];
				errx = Math.abs(F[i] / cscal);
				if (errx > errmax) { errmax = errx; }
			}
			if (errmax <= relconvg) { return k; }
		}
		return -2;
	}
	// rk5.c rk5_integrate(): Dormand-Prince 5(4), adaptive with Lund stabilisation. State: htry in/out via hp.v.
	function rk5Integrate(w, y, n, t, tnext, hp, atol, rtol, func) {
		var c2 = 0.20, c3 = 0.30, c4 = 0.80, c5 = 8.0 / 9.0,
			a21 = 0.20, a31 = 3.0 / 40.0, a32 = 9.0 / 40.0, a41 = 44.0 / 45.0, a42 = -56.0 / 15.0, a43 = 32.0 / 9.0,
			a51 = 19372.0 / 6561.0, a52 = -25360.0 / 2187.0, a53 = 64448.0 / 6561.0, a54 = -212.0 / 729.0,
			a61 = 9017.0 / 3168.0, a62 = -355.0 / 33.0, a63 = 46732.0 / 5247.0, a64 = 49.0 / 176.0, a65 = -5103.0 / 18656.0,
			a71 = 35.0 / 384.0, a73 = 500.0 / 1113.0, a74 = 125.0 / 192.0, a75 = -2187.0 / 6784.0, a76 = 11.0 / 84.0,
			e1 = 71.0 / 57600.0, e3 = -71.0 / 16695.0, e4 = 71.0 / 1920.0, e5 = -17253.0 / 339200.0, e6 = 22.0 / 525.0, e7 = -1.0 / 40.0,
			K1 = w.K1, K2 = w.K2, K3 = w.K3, K4 = w.K4, K5 = w.K5, K6 = w.K6, Ynew = w.Ynew,
			tnew, h, hmax, hnew, ytol, err, sk, fac, fac11 = 1.0, i,
			UROUND = 2.3e-16, SAFE = 0.90, fac1 = 0.2, fac2 = 10.0, beta = 0.04, facold = 1e-4, expo1 = 0.2 - beta * 0.75,
			facc1 = 1.0 / fac1, facc2 = 1.0 / fac2,
			nstep = 1, nfcn = 0, naccpt = 0, reject = 0, adjust = 1, Itmax = 1000;
		func(t, y, n, K1); nfcn++;
		h = hp.v; hmax = tnext - t;
		if (h === 0) {
			adjust = 1; h = tnext - t;
			for (i = 1; i <= n; i++) { ytol = atol[i] + rtol[i] * Math.abs(y[i]); if (K1[i] !== 0) { h = Math.min(h, ytol / Math.abs(K1[i])); } }
		}
		h = Math.max(1e-8, h);
		while (t < tnext) {
			if (0.10 * Math.abs(h) <= Math.abs(t) * UROUND) { return -2; }
			if ((t + 1.01 * h - tnext) > 0.0) { h = tnext - t; }
			tnew = t + c2 * h;
			for (i = 1; i <= n; i++) { Ynew[i] = y[i] + h * a21 * K1[i]; }
			func(tnew, Ynew, n, K2);
			tnew = t + c3 * h;
			for (i = 1; i <= n; i++) { Ynew[i] = y[i] + h * (a31 * K1[i] + a32 * K2[i]); }
			func(tnew, Ynew, n, K3);
			tnew = t + c4 * h;
			for (i = 1; i <= n; i++) { Ynew[i] = y[i] + h * (a41 * K1[i] + a42 * K2[i] + a43 * K3[i]); }
			func(tnew, Ynew, n, K4);
			tnew = t + c5 * h;
			for (i = 1; i <= n; i++) { Ynew[i] = y[i] + h * (a51 * K1[i] + a52 * K2[i] + a53 * K3[i] + a54 * K4[i]); }
			func(tnew, Ynew, n, K5);
			tnew = t + h;
			for (i = 1; i <= n; i++) { Ynew[i] = y[i] + h * (a61 * K1[i] + a62 * K2[i] + a63 * K3[i] + a64 * K4[i] + a65 * K5[i]); }
			func(tnew, Ynew, n, K6);
			for (i = 1; i <= n; i++) { Ynew[i] = y[i] + h * (a71 * K1[i] + a73 * K3[i] + a74 * K4[i] + a75 * K5[i] + a76 * K6[i]); }
			func(tnew, Ynew, n, K2);
			nfcn += 6;
			err = 0; hnew = h;
			if (adjust) {
				for (i = 1; i <= n; i++) { K4[i] = (e1 * K1[i] + e3 * K3[i] + e4 * K4[i] + e5 * K5[i] + e6 * K6[i] + e7 * K2[i]) * h; }
				for (i = 1; i <= n; i++) {
					sk = atol[i] + rtol[i] * Math.max(Math.abs(y[i]), Math.abs(Ynew[i]));
					sk = K4[i] / sk;
					err = err + (sk * sk);
				}
				err = Math.sqrt(err / n);
				fac11 = Math.pow(err, expo1);
				fac = fac11 / Math.pow(facold, beta);
				fac = Math.max(facc2, Math.min(facc1, fac / SAFE));
				hnew = h / fac;
			}
			if (err <= 1.0) {
				facold = Math.max(err, 1e-4);
				naccpt++;
				for (i = 1; i <= n; i++) { K1[i] = K2[i]; y[i] = Ynew[i]; }
				t = t + h;
				if (adjust && t <= tnext) { hp.v = h; }
				if (Math.abs(hnew) > hmax) { hnew = hmax; }
				if (reject) { hnew = Math.min(Math.abs(hnew), Math.abs(h)); }
				reject = 0;
			} else {
				if (adjust) { hnew = h / Math.min(facc1, fac11 / SAFE); }
				reject = 1;
			}
			h = hnew;
			if (adjust) { hp.v = h; }
			nstep++;
			if (nstep >= Itmax) { return -1; }
		}
		return nfcn;
	}
	// ros2.c ros2_integrate(): the two-stage Rosenbrock method, adaptive.
	function ros2Integrate(w, y, n, t, tnext, hp, atol, rtol, func) {
		var UROUND = 2.3e-16, g = 1.0 + 1.0 / Math.sqrt(2.0), ghinv, ghinv1 = 0, dghinv, ytol, h, hmin = 1e-8, hmax, tplus = t, ej, err, factor, facmax,
			isReject = 0, j, nfcn = 0, adjust = 1, A = w.A, K1 = w.K1, K2 = w.K2, Ynew = w.Ynew, Jindx = w.Jindx;
		hmax = tnext - t;
		h = hp.v;
		if (h === 0) {
			func(t, y, n, K1); nfcn += 1;
			adjust = 1; h = tnext - t;
			for (j = 1; j <= n; j++) { ytol = atol[j] + rtol[j] * Math.abs(y[j]); if (K1[j] !== 0) { h = Math.min(h, ytol / Math.abs(K1[j])); } }
		}
		h = Math.max(hmin, h);
		h = Math.min(hmax, h);
		while (t < tnext) {
			if (0.10 * Math.abs(h) <= Math.abs(t) * UROUND) { return -2; }
			tplus = t + h;
			if (tplus > tnext) { h = tnext - t; tplus = tnext; }
			if (isReject === 0) { jacobian(y, n, K1, K2, A, func); nfcn += 2 * n; ghinv1 = 0; }
			ghinv = -1.0 / (g * h);
			dghinv = ghinv - ghinv1;
			for (j = 1; j <= n; j++) { A[j][j] += dghinv; }
			ghinv1 = ghinv;
			if (!factorize(A, n, K1, Jindx)) { return -1; }
			func(t, y, n, K1); nfcn += 1;
			for (j = 1; j <= n; j++) { K1[j] *= ghinv; }
			luSolve(A, n, Jindx, K1);
			for (j = 1; j <= n; j++) { Ynew[j] = y[j] + h * K1[j]; }
			func(t, Ynew, n, K2); nfcn += 1;
			for (j = 1; j <= n; j++) { K2[j] = (K2[j] - 2.0 * K1[j]) * ghinv; }
			luSolve(A, n, Jindx, K2);
			for (j = 1; j <= n; j++) { Ynew[j] = y[j] + 1.5 * h * K1[j] + 0.5 * h * K2[j]; }
			err = 0;
			if (adjust) {
				for (j = 1; j <= n; j++) {
					ytol = atol[j] + rtol[j] * Math.abs(Ynew[j]);
					ej = Math.abs(Ynew[j] - y[j] - h * K1[j]) / ytol;
					err = err + ej * ej;
				}
				err = Math.sqrt(err / n);
				err = Math.max(UROUND, err);
				factor = 0.9 / Math.sqrt(err);
				facmax = isReject ? 1.0 : 10.0;
				factor = Math.min(factor, facmax);
				factor = Math.max(factor, 1e-1);
				h = factor * h;
				h = Math.min(hmax, h);
			}
			if (err > 1.0) { isReject = 1; h = 0.5 * h; }
			else {
				isReject = 0;
				for (j = 1; j <= n; j++) { y[j] = Ynew[j]; if (y[j] <= UROUND) { y[j] = 0; } }
				if (adjust) { hp.v = h; }
				t = tplus;
			}
		}
		return nfcn;
	}

	/**
	 * The chemistry of one project: msxchem.c. `net` is the run's links and tanks (see lpnMsxPassSteps); the object answers
	 * `react(dt)` for every pipe and tank segment, `equil(zone, c)` for a node or segment, and holds the shared work vector C1.
	 */
	function makeChem(spec, st) {
		var S = spec.species.length, T = spec.terms.length, P = spec.params.length, C = spec.consts.length, m, i,
			solver = spec.options.solver, coupling = spec.options.coupling === 'FULL',
			C1 = new Float64Array(S + 1), HydVar = new Float64Array(MAX_HYD_VARS + 1),
			pipeRate = [], tankRate = [], pipeEquil = [], tankEquil = [], nPipeForm = 0, nTankForm = 0,
			Atol = new Float64Array(S + 1), Rtol = new Float64Array(S + 1), Yrate = new Float64Array(S + 1), Yequil = new Float64Array(S + 1),
			theLink = 0, theTank = 0, theSegHolder = null, LAST_TERM = S + T, LAST_PARAM = LAST_TERM + P, LAST_CONST = LAST_PARAM + C,
			work, rk, ros, nw;
		spec.species.forEach(function (sp, ix) {
			var mm = ix + 1;
			if (sp.pipe) {
				if (sp.pipe.kind === 'RATE') { pipeRate.push(mm); } else if (sp.pipe.kind === 'EQUIL') { pipeEquil.push(mm); } else { nPipeForm++; }
			}
		});
		// tanks use the pipe chemistry when the file gave none (msxchem.c setTankChemistry())
		var anyTankExpr = spec.species.some(function (sp) { return !!sp.tank; });
		spec.species.forEach(function (sp, ix) {
			var mm = ix + 1;
			if (!anyTankExpr) { sp.tankX = sp.pipe; } else { sp.tankX = sp.tank; }
			if (sp.tankX) {
				if (sp.tankX.kind === 'RATE') { tankRate.push(mm); } else if (sp.tankX.kind === 'EQUIL') { tankEquil.push(mm); } else { nTankForm++; }
			}
		});
		nw = Math.max(S, 1);
		work = { F: new Float64Array(nw + 1), W: new Float64Array(nw + 1), J: matrix(nw + 1), Indx: new Int32Array(nw + 1) };
		rk = { K1: new Float64Array(S + 1), K2: new Float64Array(S + 1), K3: new Float64Array(S + 1), K4: new Float64Array(S + 1), K5: new Float64Array(S + 1), K6: new Float64Array(S + 1), Ynew: new Float64Array(S + 1) };
		ros = { A: matrix(S + 1), K1: new Float64Array(S + 1), K2: new Float64Array(S + 1), Ynew: new Float64Array(S + 1), Jindx: new Int32Array(S + 1) };

		function varPipe(i) {
			var sp;
			if (i <= S) {
				sp = spec.species[i - 1];
				if (sp.pipe && sp.pipe.kind === 'FORMULA') { return runExpr(sp.pipe.prog, varPipe); }
				return C1[i];
			}
			if (i <= LAST_TERM) { return runExpr(spec.terms[i - S - 1].prog, varPipe); }
			if (i <= LAST_PARAM) { return st.linkParam[theLink][i - LAST_TERM]; }
			if (i <= LAST_CONST) { return spec.consts[i - LAST_PARAM - 1].value; }
			i -= LAST_CONST;
			return i < MAX_HYD_VARS ? HydVar[i] : 0;
		}
		function varTank(i) {
			var sp, tk;
			if (i <= S) {
				sp = spec.species[i - 1];
				if (sp.tankX && sp.tankX.kind === 'FORMULA') { return runExpr(sp.tankX.prog, varTank); }
				return C1[i];
			}
			if (i <= LAST_TERM) { return runExpr(spec.terms[i - S - 1].prog, varTank); }
			if (i <= LAST_PARAM) { tk = st.tankParam[theTank]; return tk ? tk[i - LAST_TERM] : 0; }
			if (i <= LAST_CONST) { return spec.consts[i - LAST_PARAM - 1].value; }
			return 0;
		}
		function equilCore(c, list, which, vf) {
			var i2, m2, code;
			for (m2 = 1; m2 <= S; m2++) { C1[m2] = c[m2]; }
			for (i2 = 1; i2 <= list.length; i2++) { Yequil[i2] = c[list[i2 - 1]]; }
			code = newtonSolve(Yequil, list.length, 20, 3, function (t, y, n, f) {
				var j, mm;
				for (j = 1; j <= n; j++) { C1[list[j - 1]] = y[j]; }
				for (j = 1; j <= n; j++) { mm = list[j - 1]; f[j] = runExpr(spec.species[mm - 1][which].prog, vf); }
			}, work);
			if (code < 0) { return 514; }
			for (i2 = 1; i2 <= list.length; i2++) { m2 = list[i2 - 1]; c[m2] = Yequil[i2]; C1[m2] = c[m2]; }
			return 0;
		}
		function formulas(c, which, vf) {
			var m2;
			for (m2 = 1; m2 <= S; m2++) { C1[m2] = c[m2]; }
			for (m2 = 1; m2 <= S; m2++) {
				if (spec.species[m2 - 1][which] && spec.species[m2 - 1][which].kind === 'FORMULA') { c[m2] = runExpr(spec.species[m2 - 1][which].prog, vf); }
			}
		}
		var chem = {
			S: S, C1: C1, HydVar: HydVar,
			equil: function (zone, c) {
				var e = 0;
				if (zone === 'link') {
					if (pipeEquil.length > 0) { e = equilCore(c, pipeEquil, 'pipe', varPipe); }
					formulas(c, 'pipe', varPipe);
				} else {
					if (tankEquil.length > 0) { e = equilCore(c, tankEquil, 'tankX', varTank); }
					formulas(c, 'tankX', varTank);
				}
				return e;
			}
		};
		function dcdt(list, which, vf, zone) {
			return function (t, y, n, deriv) {
				var j, mm;
				for (j = 1; j <= n; j++) { C1[list[j - 1]] = y[j]; }
				if (coupling) { if (chem.equil(zone, C1) > 0) { for (j = 1; j <= n; j++) { deriv[j] = 0; } return; } }
				for (j = 1; j <= n; j++) { mm = list[j - 1]; deriv[j] = runExpr(spec.species[mm - 1][which].prog, vf); }
			};
		}
		var pipeDcDt = dcdt(pipeRate, 'pipe', varPipe, 'link'), tankDcDt = dcdt(tankRate, 'tankX', varTank, 'node');
		// msxchem.c evalHydVariables()
		chem.evalHyd = function (k) {
			var L = st.links[k], Q = st.Q[k], diam = L.diam, dh, av, u;
			HydVar[HV_D] = diam * st.ucfLength;
			HydVar[HV_Q] = Math.abs(Q) * st.ucfFlow;
			u = diam === 0 ? 0 : Math.abs(Q) * 4.0 / Math.PI / (diam * diam);
			HydVar[HV_U] = u;
			HydVar[HV_RE] = u * diam / VISCOS;
			HydVar[HV_U] = u * st.ucfLength;
			if (L.len === 0) { HydVar[HV_FF] = 0; }
			else {
				dh = Math.abs(st.H[L.n1] - st.H[L.n2]);
				HydVar[HV_FF] = 39.725 * dh * Math.pow(diam, 5) / L.len / (Q * Q);
			}
			HydVar[HV_US] = HydVar[HV_U] * Math.sqrt(HydVar[HV_FF] / 8.0);
			HydVar[HV_AV] = 1.0;
			if (diam > 0) { av = 4.0 / diam; av *= st.ucfArea; av /= LPERFT3; HydVar[HV_AV] = av; }
			HydVar[HV_KC] = L.rough;
		};
		function setTolerances(list) {
			var i2;
			for (i2 = 1; i2 <= list.length; i2++) { Atol[i2] = spec.species[list[i2 - 1] - 1].aTol; Rtol[i2] = spec.species[list[i2 - 1] - 1].rTol; }
		}
		// the common reaction of one segment: `src` is the vector the rate species start from (the segment's own for a pipe, the
		// TANK's for a tank, msxchem.c evalTankReactions()), `holder` carries the integrator's remembered step.
		function reactSeg(seg, dt, list, deriv, zone, src, hstepOf, setHstep, errCode) {
			var i2, m2, tstep = dt / st.ucfRate, c, ierr = 0, hp;
			for (m2 = 1; m2 <= S; m2++) { C1[m2] = seg.c[m2]; }
			if (dt > 0) {
				for (i2 = 1; i2 <= list.length; i2++) { Yrate[i2] = src[list[i2 - 1]]; }
				if (solver === 'EUL') {
					deriv(0, Yrate, list.length, Yrate);
					for (i2 = 1; i2 <= list.length; i2++) {
						m2 = list[i2 - 1];
						c = seg.c[m2] + Yrate[i2] * tstep;
						seg.c[m2] = Math.max(c, 0.0);
					}
				} else {
					hp = { v: hstepOf() };
					if (solver === 'RK5') { ierr = rk5Integrate(rk, Yrate, list.length, 0, tstep, hp, Atol, Rtol, deriv); }
					else { ierr = ros2Integrate(ros, Yrate, list.length, 0, tstep, hp, Atol, Rtol, deriv); }
					for (m2 = 1; m2 <= S; m2++) { seg.c[m2] = C1[m2]; }
					for (i2 = 1; i2 <= list.length; i2++) { m2 = list[i2 - 1]; seg.c[m2] = Math.max(Yrate[i2], 0.0); }
					setHstep(hp.v);
				}
				if (ierr < 0) { return 513; }
			}
			return chem.equil(zone, seg.c);
		}
		// msxchem.c MSXchem_react(): every pipe, then every tank
		chem.react = function (dt) {
			var k, j, e, seg, tk;
			setTolerances(pipeRate);
			for (k = 1; k <= st.L; k++) {
				if (st.links[k].len === 0) { continue; }
				chem.evalHyd(k);
				theLink = k;
				for (seg = st.first[k]; seg; seg = seg.prev) {
					e = reactSeg(seg, dt, pipeRate, pipeDcDt, 'link', seg.c, function () { return seg.hstep; }, function (v) { seg.hstep = v; });
					if (e) { return e; }
				}
			}
			setTolerances(tankRate);
			for (j = 1; j <= st.T; j++) {
				tk = st.tanks[j];
				if (tk.a === 0) { continue; }
				theTank = j;
				for (seg = st.first[st.L + j]; seg; seg = seg.prev) {
					// the rate species start from the SEGMENT's concentration (epanet-msx's main branch starts them from the tank's, which makes every
					// segment of a FIFO, LIFO or 2COMP tank follow one curve; the engine does not)
					e = reactSeg(seg, dt, tankRate, tankDcDt, 'node', seg.c, function () { return seg.hstep; }, function (v) { seg.hstep = v; });
					if (e) { return e; }
				}
			}
			return 0;
		};
		chem.checkCounts = function () {
			var nBulk = spec.species.filter(function (sp) { return sp.type === 'BULK'; }).length, nPipeExpr = pipeRate.length + nPipeForm + pipeEquil.length,
				nTankExpr = tankRate.length + nTankForm + tankEquil.length;
			if (nPipeExpr !== S) { return 507; }
			if (nTankExpr !== nBulk) { return 508; }
			return 0;
		};
		return chem;
	}
	EC.lpnMsxChem = makeChem;
	// msxchem.c MSXchem_open(): there must be an expression for every species in a pipe, and for every bulk species in a tank
	// (a file with none for tanks reuses the pipe's). Returns the library's error code, 507 or 508, or 0.
	EC.lpnMsxCheck = function (spec) {
		var nBulk = spec.species.filter(function (sp) { return sp.type === 'BULK'; }).length,
			nPipe = spec.species.filter(function (sp) { return !!sp.pipe; }).length,
			anyTank = spec.species.some(function (sp) { return !!sp.tank; }),
			nTank = anyTank ? spec.species.filter(function (sp) { return !!sp.tank; }).length : nPipe;
		if (nPipe !== spec.species.length) { return 507; }
		if (nTank !== nBulk) { return 508; }
		return 0;
	};


	/**
	 * The multi-species quality pass (msxqual.c, msxtank.c), over the hydraulic records the run kept.
	 *
	 *   ctx.spec     the parsed file;           ctx.net      the run's nodes and links in EPANET's numbering (qualityNet())
	 *   ctx.recs     [{t, q[], closed[], d{}, h{}, dn{}}], the 4-byte hydraulics EPANET's file would hold (cfs, ft)
	 *   ctx.tanks    {id: {V0, Vmax, v1frac, mix}} in ft3, for the tanks and reservoirs    ctx.method  'hw' | 'dw' | 'manning'
	 *   ctx.dur, ctx.repStep, ctx.repStart, ctx.patStep, ctx.patStart, ctx.qstep (the project's quality step)
	 *   ctx.isReportTime(t), ctx.frames   the frames, to which `msxNodes` and `msxLinks` are added at the report times
	 *
	 * A generator, so the page can breathe: it yields `{phase: 'msx', done, of}` after each quality step and returns
	 * `{ok, species}` or `{ok: false, issues}`.
	 */
	EC.lpnMsxPassSteps = function* (ctx) {
		var spec = ctx.spec, net = ctx.net, nodes = net.nodes, links = net.links, N = nodes.length - 1, L = links.length - 1, S = spec.species.length,
			opt = spec.options, qstep = opt.qstep || ctx.qstep, dur = ctx.dur, recs = ctx.recs, st, chem, i, j, k, m, n, e,
			wall = spec.species.map(function (sp) { return sp.type === 'WALL'; }), hasWall = wall.some(function (w) { return w; }),
			ucfArea = opt.areaUnits === 'M2' ? M2PERFT2 : opt.areaUnits === 'CM2' ? CM2PERFT2 : 1,
			ucfRate = { SEC: 1, MIN: 60, HR: 3600, DAY: 86400 }[opt.rateUnits],
			node = new Array(N + 1), nodeC0 = new Array(N + 1), linkC0 = new Array(L + 1), srcOf = new Array(N + 1), flowDir = new Array(L + 1),
			newSeg = new Array(L + 1), volIn = new Float64Array(N + 1), massIn = new Array(N + 1), X = new Array(N + 1), tankOfNode = new Array(N + 1),
			Qtime = 0, Htime = 0, recIx = 0, frameAt = {}, patOf = {}, s0 = ctx.frames, result;
		for (i = 0; i < s0.length; i++) { frameAt[s0[i].t] = s0[i]; }
		spec.patterns.forEach(function (p) { patOf[p.id] = p; });
		// ---- the state ----
		st = {
			L: L, links: links, tanks: [null], first: new Array(L + ctx.tankCount + 1), last: new Array(L + ctx.tankCount + 1),
			Q: new Float64Array(L + 1), H: new Float64Array(N + 1), D: new Float64Array(N + 1),
			linkParam: new Array(L + 1), tankParam: [null], T: 0,
			ucfLength: MPERFT, ucfFlow: LPS_PER_CFS, ucfArea: ucfArea, ucfRate: ucfRate
		};
		for (n = 1; n <= N; n++) {
			node[n] = new Float64Array(S + 1); nodeC0[n] = new Float64Array(S + 1); massIn[n] = new Float64Array(S + 1); X[n] = new Float64Array(S + 1); tankOfNode[n] = 0;
		}
		for (k = 1; k <= L; k++) {
			linkC0[k] = new Float64Array(S + 1);
			st.linkParam[k] = new Float64Array(spec.params.length + 1);
			links[k].rough = ctx.method === 'dw' ? (links[k].l.roughness || 0) * 1000 : (links[k].l.roughness || 0);
			if (links[k].type !== 'pipe' && links[k].type !== 'cv') { links[k].rough = links[k].l.roughness || 0; }
			flowDir[k] = '+';
		}
		// the tanks and reservoirs, in node order (msxinp.c readNetData())
		for (n = 1; n <= N; n++) {
			if (nodes[n].type === 'reservoir' || nodes[n].type === 'tank') {
				var tinfo = ctx.tanks[nodes[n].id] || {}, mixNo = nodes[n].type === 'tank' ? (tinfo.mix || 0) : 0, vmix = (tinfo.v1frac || 0) * (tinfo.Vmax || 0);
				st.T++;
				st.tanks.push({ node: n, a: nodes[n].type === 'tank' ? 1 : 0, v0: (tinfo.V0 || 0) * (MPERFT * MPERFT * MPERFT) / 0.028317, mix: mixNo,
					vMix: vmix * (MPERFT * MPERFT * MPERFT) / 0.028317, v: 0, c: new Float64Array(S + 1), hstep: 0 });
				st.tankParam.push(new Float64Array(spec.params.length + 1));
				tankOfNode[n] = st.T;
			}
		}
		// the file's parameters and initial qualities, in file order
		spec.paramOps.forEach(function (op) {
			if (op.scope === 'all') {
				for (k = 1; k <= L; k++) { st.linkParam[k][op.param] = op.value; }
				for (j = 1; j <= st.T; j++) { st.tankParam[j][op.param] = op.value; }
			} else if (op.scope === 'pipe') {
				for (k = 1; k <= L; k++) { if (String(links[k].id) === String(op.id) && op.param > 0) { st.linkParam[k][op.param] = op.value; } }
			} else {
				n = net.ix[String(op.id)];
				if (n && tankOfNode[n] > 0 && op.param > 0) { st.tankParam[tankOfNode[n]][op.param] = op.value; }
			}
		});
		spec.quality.forEach(function (q) {
			var bulk = !wall[q.species - 1];
			if (q.scope === 'global') {
				if (bulk) { for (n = 1; n <= N; n++) { nodeC0[n][q.species] = q.value; } }
				for (k = 1; k <= L; k++) { linkC0[k][q.species] = q.value; }
			} else if (q.scope === 'node') { n = net.ix[String(q.id)]; if (bulk && n) { nodeC0[n][q.species] = q.value; } }
			else { for (k = 1; k <= L; k++) { if (String(links[k].id) === String(q.id)) { linkC0[k][q.species] = q.value; } } }
		});
		for (n = 1; n <= N; n++) { srcOf[n] = null; }
		Object.keys(spec.sources).forEach(function (id) { n = net.ix[String(id)]; if (n) { srcOf[n] = spec.sources[id]; } });
		chem = makeChem(spec, st);
		if ((e = chem.checkCounts()) !== 0) { return { ok: false, issues: [{ code: 'msx-expressions', ids: [String(e)] }] }; }

		// ---- msxqual.c helpers ----
		var C1 = chem.C1;
		function linkVol(k) { return 0.785398 * links[k].len * links[k].diam * links[k].diam; }
		function upNode(k) { return flowDir[k] === '+' ? links[k].n1 : links[k].n2; }
		function downNode(k) { return flowDir[k] === '+' ? links[k].n2 : links[k].n1; }
		function getSeg(v, c) { var sg = { v: v, c: new Float64Array(S + 1), hstep: 0, prev: null, next: null }, mm; for (mm = 1; mm <= S; mm++) { sg.c[mm] = c[mm]; } return sg; }
		function addSeg(k2, sg) {
			sg.prev = null; sg.next = null;
			if (st.first[k2] === null) { st.first[k2] = sg; }
			if (st.last[k2] !== null) { st.last[k2].prev = sg; sg.next = st.last[k2]; }
			st.last[k2] = sg;
		}
		function isSame(c1, c2) {
			var mm;
			for (mm = 1; mm <= S; mm++) { if (Math.abs(c1[mm] - c2[mm]) >= spec.species[mm - 1].aTol) { return false; } }
			return true;
		}
		function removeAllSegs(k2) { st.first[k2] = null; st.last[k2] = null; }
		function getNodeQual(j2, mm) {
			var t2;
			if (wall[mm - 1]) { return 0; }
			t2 = tankOfNode[j2];
			if (t2 > 0 && st.tanks[t2].a > 0) { return st.tanks[t2].c[mm]; }
			return node[j2][mm];
		}
		function getLinkQual(k2, mm) {
			var vsum = 0, msum = 0, sg = st.first[k2];
			while (sg) { vsum += sg.v; msum += sg.c[mm] * sg.v; sg = sg.prev; }
			if (vsum > 0) { return msum / vsum; }
			return (getNodeQual(links[k2].n1, mm) + getNodeQual(links[k2].n2, mm)) / 2.0;
		}
		for (k = 1; k <= L + st.T; k++) { st.first[k] = null; st.last[k] = null; newSeg[k] = null; }
		// msxqual.c MSXqual_init()
		for (n = 1; n <= N; n++) { for (m = 1; m <= S; m++) { node[n][m] = nodeC0[n][m]; } }
		for (j = 1; j <= st.T; j++) {
			st.tanks[j].hstep = 0; st.tanks[j].v = st.tanks[j].v0;
			for (m = 1; m <= S; m++) { st.tanks[j].c[m] = nodeC0[st.tanks[j].node][m]; }
		}

		function readRec(r) {
			var kk, nn, id;
			for (nn = 1; nn <= N; nn++) {
				id = String(nodes[nn].id);
				st.D[nn] = nodes[nn].type === 'junction' || nodes[nn].type === undefined ? (r.d[id] || 0) : (r.dn[id] || 0);
				st.H[nn] = r.h[id] || 0;
			}
			for (kk = 1; kk <= L; kk++) { st.Q[kk] = r.q[links[kk].k]; }
		}
		function initSegs() {
			var kk, jj, mm, v, nn, tk;
			for (kk = 1; kk <= L; kk++) {
				flowDir[kk] = st.Q[kk] < 0 ? '-' : '+';
				st.last[kk] = null; st.first[kk] = null; newSeg[kk] = null;
				for (mm = 1; mm <= S; mm++) { C1[mm] = linkC0[kk][mm]; }
				v = linkVol(kk);
				if (v > 0) { addSeg(kk, getSeg(v, C1)); }
			}
			for (jj = 1; jj <= st.T; jj++) {
				tk = st.tanks[jj];
				if (tk.a === 0) { continue; }
				nn = tk.node;
				for (mm = 1; mm <= S; mm++) { C1[mm] = nodeC0[nn][mm]; }
				kk = L + jj;
				st.last[kk] = null; st.first[kk] = null;
				if (tk.mix === 1) {
					v = Math.max(0, tk.v - tk.vMix);
					addSeg(kk, getSeg(v, C1));
					addSeg(kk, getSeg(tk.v - v, C1));
				} else { addSeg(kk, getSeg(tk.v, C1)); }
			}
		}
		function reorientSegs() {
			var kk, newdir, sg, pseg, nseg;
			for (kk = 1; kk <= L; kk++) {
				newdir = '+';
				if (st.Q[kk] === 0) { newdir = flowDir[kk]; } else if (st.Q[kk] < 0) { newdir = '-'; }
				if (newdir !== flowDir[kk]) {
					sg = st.first[kk]; st.first[kk] = st.last[kk]; st.last[kk] = sg;
					pseg = null;
					while (sg) { nseg = sg.prev; sg.prev = pseg; sg.next = nseg; pseg = sg; sg = nseg; }
					flowDir[kk] = newdir;
				}
			}
		}
		function getHydVars() {
			var r = recs[recIx], next;
			if (!r) { return 505; }
			recIx++;
			next = recs[recIx];
			readRec(r);
			Htime = r.t + (next ? next.t - r.t : 0);
			if (Qtime < dur) { if (Qtime === 0) { initSegs(); } else { reorientSegs(); } }
			sortLinks();
			return 0;
		}
		// ---- wall species advection ----
		function getNewSegWallQual(k2, dt, nseg) {
			var sg, mm, v = linkVol(k2), vin = Math.abs(st.Q[k2]) * dt, vsum = 0, vleft, vadded;
			if (vin > v) { vin = v; }
			sg = st.last[k2]; vleft = vin;
			for (mm = 1; mm <= S; mm++) { if (wall[mm - 1]) { nseg.c[mm] = 0; } }
			while (vleft > 0 && sg) {
				vadded = sg.v; if (vadded > vleft) { vadded = vleft; }
				vsum += vadded; vleft -= vadded;
				for (mm = 1; mm <= S; mm++) { if (wall[mm - 1]) { nseg.c[mm] += vadded * sg.c[mm]; } }
				sg = sg.next;
			}
			if (vsum > 0) { for (mm = 1; mm <= S; mm++) { if (wall[mm - 1]) { nseg.c[mm] /= vsum; } } }
		}
		function shiftSegWallQual(k2, dt) {
			var seg1, seg2, mm, v = linkVol(k2), vin = Math.abs(st.Q[k2]) * dt, vstart, vend, vcur, vsum;
			if (vin > v) { vin = v; }
			vstart = vin;
			for (seg1 = st.last[k2]; seg1; seg1 = seg1.next) {
				for (mm = 1; mm <= S; mm++) { C1[mm] = 0; }
				vend = vstart + seg1.v; if (vend > v) { vend = v; }
				vcur = vstart; vsum = 0;
				for (seg2 = st.last[k2]; seg2; seg2 = seg2.next) {
					if (seg2.v === 0) { continue; }
					vsum += seg2.v;
					if (vsum >= vstart && vsum <= vend) {
						for (mm = 1; mm <= S; mm++) { if (wall[mm - 1]) { C1[mm] += (vsum - vcur) * seg2.c[mm]; } }
						vcur = vsum;
					}
					if (vsum >= vend) { break; }
				}
				for (mm = 1; mm <= S; mm++) {
					if (!wall[mm - 1]) { continue; }
					if (seg2) { C1[mm] += (vend - vcur) * seg2.c[mm]; }
					seg1.c[mm] = C1[mm] / (vend - vstart);
					if (seg1.c[mm] < 0) { seg1.c[mm] = 0; }
				}
				vstart = vend;
				if (vstart >= v) { break; }
			}
		}
		function advectSegs(dt) {
			var kk, mm;
			for (kk = 1; kk <= L; kk++) {
				for (mm = 1; mm <= S; mm++) { C1[mm] = 0; }
				newSeg[kk] = getSeg(0, C1);
				if (links[kk].len === 0 || st.Q[kk] === 0) { continue; }
				if (hasWall) { getNewSegWallQual(kk, dt, newSeg[kk]); shiftSegWallQual(kk, dt); }
			}
		}
		function getIncidentConcen() {
			var kk, nn, mm;
			volIn.fill(0);
			for (nn = 1; nn <= N; nn++) { massIn[nn].fill(0); X[nn].fill(0); }
			for (kk = 1; kk <= L; kk++) {
				nn = downNode(kk);
				if (st.first[kk]) {
					for (mm = 1; mm <= S; mm++) { if (!wall[mm - 1]) { massIn[nn][mm] += st.first[kk].c[mm]; } }
					volIn[nn]++;
				}
				nn = upNode(kk);
				if (st.last[kk]) {
					for (mm = 1; mm <= S; mm++) { if (!wall[mm - 1]) { massIn[nn][mm] += st.last[kk].c[mm]; } }
					volIn[nn]++;
				}
			}
			for (nn = 1; nn <= N; nn++) {
				if (volIn[nn] > 0) { for (mm = 1; mm <= S; mm++) { X[nn][mm] = massIn[nn][mm] / volIn[nn]; } }
			}
		}
		// The water a link sends beyond what it holds is its upstream node's water AS THE NODE WILL HAVE IT THIS STEP: everything the
		// links into that node bring (so they are taken first, accOrder), mixed with any external inflow as updateNodes() does it, and the
		// average of the segments around it when nothing flows in. A reservoir or tank sends the concentration it has. The engine does
		// this in whatever order the links are numbered (native-msx-harness.js, the chain of short pipes below).
		var accOrder = [];
		function upConc(ii, mm, dt) {
			var vol;
			if (tankOfNode[ii] > 0) { return node[ii][mm]; }
			vol = volIn[ii] + (st.D[ii] < 0 ? -st.D[ii] * dt : 0);
			return vol > 0 ? massIn[ii][mm] / vol : X[ii][mm];
		}
		function sortLinks() {
			var kk, nn, out = [], indeg = new Int32Array(N + 1), done = new Uint8Array(L + 1), queue = [], head = 0, q0, outs = [];
			for (nn = 0; nn <= N; nn++) { outs.push([]); }
			for (kk = 1; kk <= L; kk++) {
				if (st.Q[kk] === 0) { continue; }
				indeg[downNode(kk)]++;
				outs[upNode(kk)].push(kk);
			}
			for (nn = 1; nn <= N; nn++) { if (indeg[nn] === 0) { queue.push(nn); } }
			while (head < queue.length) {
				q0 = queue[head++];
				outs[q0].forEach(function (k2) {
					done[k2] = 1; out.push(k2);
					if (--indeg[downNode(k2)] === 0) { queue.push(downNode(k2)); }
				});
			}
			for (kk = 1; kk <= L; kk++) { if (!done[kk]) { out.push(kk); } }
			accOrder = out;
		}
		function accumulate(dt) {
			var kk, ii, jj, mm, v, sg, cseg, vseg, vsegSum;
			getIncidentConcen();
			volIn.fill(0);
			for (ii = 1; ii <= N; ii++) { massIn[ii].fill(0); }
			for (var oi = 0; oi < accOrder.length; oi++) {
				kk = accOrder[oi];
				ii = upNode(kk); jj = downNode(kk);
				v = Math.abs(st.Q[kk]) * dt;
				if (linkVol(kk) <= v) {
					// More water leaves than the link holds (a link of no volume, a pump or a valve, always): all of what it holds goes,
					// and the rest of the flow volume is the upstream node's own water, as that node will mix it this step (upConc()).
					// epanet-msx's main branch sends the first segment's quality for all of it and compares with `<`; the vendored engine
					// does not (native-msx-harness.js, the chains of short pipes).
					volIn[jj] += v;
					vsegSum = 0;
					for (sg = st.first[kk]; sg; sg = sg.prev) {
						vsegSum += sg.v;
						for (mm = 1; mm <= S; mm++) { if (!wall[mm - 1]) { massIn[jj][mm] += sg.v * sg.c[mm]; } }
					}
					for (mm = 1; mm <= S; mm++) { if (!wall[mm - 1]) { massIn[jj][mm] += (v - vsegSum) * upConc(ii, mm, dt); } }
					removeAllSegs(kk);
				} else {
					while (v > 0) {
						sg = st.first[kk];
						if (!sg) { break; }
						vseg = sg.v; vseg = Math.min(vseg, v);
						if (sg === st.last[kk]) { vseg = v; }
						for (mm = 1; mm <= S; mm++) { if (!wall[mm - 1]) { massIn[jj][mm] += vseg * sg.c[mm]; } }
						volIn[jj] += vseg;
						v -= vseg;
						if (v >= 0 && vseg >= sg.v) {
							st.first[kk] = sg.prev;
							if (st.first[kk] === null) { st.last[kk] = null; }
						} else { sg.v -= vseg; }
					}
				}
			}
		}
		// ---- msxtank.c ----
		function mix1(ti, vIn, cIn) {
			var kk = L + ti, sg = st.first[kk], tk = st.tanks[ti], mm, c;
			for (mm = 1; mm <= S; mm++) {
				if (wall[mm - 1]) { continue; }
				c = sg.c[mm];
				if (tk.v > 0) { c += (cIn[mm] - c) * vIn / tk.v; } else { c = cIn[mm]; }
				c = Math.max(0, c);
				sg.c[mm] = c; tk.c[mm] = c;
			}
			if (vIn > 0) { chem.equil('node', tk.c); }
		}
		function mix2(ti, vIn, cIn, dt) {
			var tk = st.tanks[ti], nn = tk.node, qNet = st.D[nn], qIn = vIn / dt, qOut = qIn - qNet, kk = L + ti, seg1 = st.first[kk], seg2 = st.last[kk],
				tstep, tstar, mm, c, c1, c2;
			if (Math.abs(qNet) < TINY) { return; }
			else if (qNet > 0) {
				if (seg2.v <= 0) {
					tstar = Math.trunc((tk.vMix - seg1.v) / qNet);
					tstep = Math.min(dt, tstar);
					for (mm = 1; mm <= S; mm++) {
						if (wall[mm - 1]) { continue; }
						c = seg1.c[mm];
						if (seg1.v > 0) { seg1.c[mm] += qIn * tstep * (cIn[mm] - c) / seg1.v; } else { seg1.c[mm] = cIn[mm]; }
						seg1.c[mm] = Math.max(0, seg1.c[mm]);
						seg2.c[mm] = 0;
					}
					seg1.v += qNet * tstep;
					dt -= tstep;
				}
				if (dt > 1) {
					for (mm = 1; mm <= S; mm++) {
						if (wall[mm - 1]) { continue; }
						c1 = seg1.c[mm];
						seg1.c[mm] += qIn * dt * (cIn[mm] - c1) / seg1.v;
						seg1.c[mm] = Math.max(0, seg1.c[mm]);
						c2 = seg2.c[mm];
						if (seg2.v <= 0) { seg2.c[mm] = seg1.c[mm]; } else { seg2.c[mm] += qNet * dt * (seg1.c[mm] - c2) / seg2.v; }
						seg2.c[mm] = Math.max(0, seg2.c[mm]);
					}
					seg2.v += qNet * dt;
				}
				if (seg1.v > 0) { chem.equil('node', seg1.c); }
				if (seg2.v > 0) { chem.equil('node', seg2.c); }
			} else if (qNet < 0 && seg1.v > 0) {
				if (seg2.v > 0) {
					tstar = Math.trunc(seg2.v / -qNet);
					tstep = Math.min(dt, tstar);
					for (mm = 1; mm <= S; mm++) {
						if (wall[mm - 1]) { continue; }
						c1 = seg1.c[mm]; c2 = seg2.c[mm];
						seg1.c[mm] += (qIn * cIn[mm] - qNet * c2 - qOut * c1) * tstep / seg1.v;
						seg1.c[mm] = Math.max(0, seg1.c[mm]);
					}
					seg2.v += qNet * tstep;
					seg2.v = Math.max(0, seg2.v);
					dt -= tstep;
				}
				if (dt > 1) {
					for (mm = 1; mm <= S; mm++) {
						if (wall[mm - 1]) { continue; }
						c = seg1.c[mm];
						seg1.c[mm] += qIn * dt * (cIn[mm] - c) / seg1.v;
						seg1.c[mm] = Math.max(0, seg1.c[mm]);
						seg2.c[mm] = 0;
					}
					seg1.v += qNet * dt;
					seg1.v = Math.max(0, seg1.v);
				}
				if (seg1.v > 0) { chem.equil('node', seg1.c); }
			}
			for (mm = 1; mm <= S; mm++) { tk.c[mm] = seg1.c[mm]; }
		}
		function mix3(ti, vIn, cIn, dt) {
			var tk = st.tanks[ti], kk = L + ti, nn = tk.node, vNet = st.D[nn] * dt, vOut = vIn - vNet, vSum = 0, sg, vSeg, mm;
			for (mm = 1; mm <= S; mm++) { C1[mm] = 0; }
			while (vOut > 0) {
				sg = st.first[kk];
				if (!sg) { break; }
				vSeg = Math.min(sg.v, vOut);
				if (sg === st.last[kk]) { vSeg = vOut; }
				vSum += vSeg;
				for (mm = 1; mm <= S; mm++) { C1[mm] += sg.c[mm] * vSeg; }
				vOut -= vSeg;
				if (vOut >= 0 && vSeg >= sg.v) { st.first[kk] = sg.prev; if (st.first[kk] === null) { st.last[kk] = null; } }
				else { sg.v -= vSeg; }
			}
			for (mm = 1; mm <= S; mm++) { tk.c[mm] = vSum > 0 ? C1[mm] / vSum : st.first[kk].c[mm]; }
			if (vIn > 0) {
				sg = st.last[kk];
				if (sg && isSame(sg.c, cIn)) { sg.v += vIn; } else { addSeg(kk, getSeg(vIn, cIn)); }
			}
		}
		function mix4(ti, vIn, cIn, dt) {
			var tk = st.tanks[ti], kk = L + ti, nn = tk.node, vNet = st.D[nn] * dt, vSum = 0, sg, vSeg, mm;
			for (mm = 1; mm <= S; mm++) { C1[mm] = 0; }
			if (vNet > 0) {
				sg = st.last[kk];
				if (sg && isSame(sg.c, cIn)) { sg.v += vNet; } else { addSeg(kk, getSeg(vNet, cIn)); }
				for (mm = 1; mm <= S; mm++) { tk.c[mm] = cIn[mm]; }
			} else if (vNet < 0) {
				vNet = -vNet;
				while (vNet > 0) {
					sg = st.last[kk];
					if (!sg) { break; }
					vSeg = Math.min(sg.v, vNet);
					if (sg === st.first[kk]) { vSeg = vNet; }
					vSum += vSeg;
					for (mm = 1; mm <= S; mm++) { C1[mm] += sg.c[mm] * vSeg; }
					vNet -= vSeg;
					// the newest segment is gone: the one before it (`next`, the older side of the chain) is the last. epanet-msx's main
					// branch writes `seg->prev` here, which is nothing, and loses every older segment of the tank; the engine does not.
					if (vNet >= 0 && vSeg >= sg.v) { st.last[kk] = sg.next; if (st.last[kk] === null) { st.first[kk] = null; } else { st.last[kk].prev = null; } }
					else { sg.v -= vSeg; }
				}
				for (mm = 1; mm <= S; mm++) {
					vSum = vSum + vIn;
					if (vSum > 0) { tk.c[mm] = (C1[mm] + cIn[mm] * vIn) / vSum; }
				}
			}
		}
		function updateNodes(dt) {
			var ii, jj, mm, tk, c1v = new Float64Array(S + 1);
			for (ii = 1; ii <= N; ii++) {
				jj = tankOfNode[ii];
				if (jj <= 0) {
					if (st.D[ii] < 0) { volIn[ii] -= st.D[ii] * dt; }
					if (volIn[ii] > 0) { for (mm = 1; mm <= S; mm++) { node[ii][mm] = massIn[ii][mm] / volIn[ii]; } }
					else { for (mm = 1; mm <= S; mm++) { node[ii][mm] = X[ii][mm]; } }
					chem.equil('node', node[ii]);
				} else {
					tk = st.tanks[jj];
					if (tk.a === 0) {
						for (mm = 1; mm <= S; mm++) { node[ii][mm] = nodeC0[ii][mm]; }
						// the vendored engine evaluates a reservoir's formula species as well (As5Adsorb's total arsenic at its source)
						chem.equil('node', node[ii]);
					}
					else {
						if (volIn[ii] > 0) { for (mm = 1; mm <= S; mm++) { c1v[mm] = massIn[ii][mm] / volIn[ii]; } }
						else { for (mm = 1; mm <= S; mm++) { c1v[mm] = 0; } }
						if (tk.mix === 0) { mix1(jj, volIn[ii], c1v); }
						else if (tk.mix === 1) { mix2(jj, volIn[ii], c1v, dt); }
						else if (tk.mix === 2) { mix3(jj, volIn[ii], c1v, dt); }
						else { mix4(jj, volIn[ii], c1v, dt); }
						for (mm = 1; mm <= S; mm++) { node[ii][mm] = tk.c[mm]; }
						tk.v += st.D[ii] * dt;
					}
				}
			}
		}
		function sourceQual(src) {
			var c = src.c0, f = 1, p, kk;
			if (src.type === 'MASS') { c /= 60.0; }
			if (!src.pattern) { return c; }
			p = spec.patterns[src.pattern - 1];
			kk = Math.floor((Qtime + ctx.patStart) / ctx.patStep) % p.values.length;
			f = p.values[kk];
			return c * f;
		}
		function sourceInput(dt) {
			var nn, qout, volout, list, src, mm, massadded, s2, qcutoff = 10.0 * TINY, ii;
			for (nn = 1; nn <= N; nn++) {
				list = srcOf[nn];
				if (!list || !list.length) { continue; }
				volout = tankOfNode[nn] === 0 ? volIn[nn] : volIn[nn] - st.D[nn] * dt;
				qout = volout / dt;
				if (qout <= qcutoff) { continue; }
				for (ii = 0; ii < list.length; ii++) {
					src = list[ii]; mm = src.species; massadded = 0;
					if (src.c0 > 0 && !wall[mm - 1]) {
						s2 = sourceQual(src);
						if (src.type === 'CONCEN') {
							if (st.D[nn] < 0) { massadded = -s2 * st.D[nn] * dt; }
							if (tankOfNode[nn] > 0) { node[nn][mm] = 0; }
						} else if (src.type === 'MASS') { massadded = s2 * dt / LPERFT3; }
						else if (src.type === 'SETPOINT') { if (s2 > node[nn][mm]) { massadded = (s2 - node[nn][mm]) * volout; } }
						else if (src.type === 'FLOWPACED') { massadded = s2 * volout; }
						node[nn][mm] += massadded / volout;
					}
				}
				chem.equil('node', node[nn]);
			}
		}
		function release(dt) {
			var kk, nn, q, v, mm, useNew, sg;
			for (kk = 1; kk <= L; kk++) {
				if (st.Q[kk] === 0) { continue; }
				nn = upNode(kk); q = Math.abs(st.Q[kk]); v = q * dt;
				// The vendored engine never lets a pipe hold more than its own volume: the segment released into a link is capped at
				// the link's volume (epanet-msx's main branch allows more, "Flow volume is allowed to be > link volume", and a pipe
				// then carries a surplus). Measured on Net1's pipe 110, whose flow is 1.5 times its volume per step for two hours.
				if (v > linkVol(kk)) { v = linkVol(kk); }
				if (v === 0) { continue; }   // a pump or valve holds no segment: none to average at the node it feeds when it stops
				for (mm = 1; mm <= S; mm++) { if (!wall[mm - 1]) { newSeg[kk].c[mm] = node[nn][mm]; } }
				useNew = 0;
				sg = st.last[kk];
				if (!sg) { useNew = 1; } else if (!isSame(sg.c, newSeg[kk].c)) { useNew = 1; }
				if (!useNew) { sg.v += v; }
				else { newSeg[kk].v = v; addSeg(kk, newSeg[kk]); }
			}
		}
		function transport(tstep) {
			var qtime = 0, dt, err = 0;
			while (!err && qtime < tstep) {
				dt = Math.min(qstep, tstep - qtime);
				qtime += dt;
				err = chem.react(dt);
				if (err) { return err; }
				advectSegs(dt); accumulate(dt); updateNodes(dt); sourceInput(dt); release(dt);
			}
			return err;
		}
		function qualStep() {
			var dt, hstep, tstep = qstep, err = 0;
			do {
				dt = tstep;
				hstep = Htime - Qtime;
				if (hstep <= dt) {
					dt = hstep;
					if (dt > 0) { err = transport(dt); }
					Qtime += dt;
					if (Qtime === Htime) { err = err || getHydVars(); }
				} else { err = transport(dt); Qtime += dt; }
				tstep -= dt;
			} while (!err && tstep > 0);
			return err;
		}
		function readFrame(t) {
			var f = frameAt[t], nn, kk, row, mm;
			if (!f || !ctx.isReportTime(t)) { return; }
			f.msxNodes = {}; f.msxLinks = {};
			for (nn = 1; nn <= N; nn++) {
				row = [];
				for (mm = 1; mm <= S; mm++) { row.push(wall[mm - 1] ? null : getNodeQual(nn, mm)); }
				f.msxNodes[nodes[nn].id] = row;
			}
			for (kk = 1; kk <= L; kk++) {
				row = [];
				for (mm = 1; mm <= S; mm++) { row.push(getLinkQual(kk, mm)); }
				f.msxLinks[links[kk].id] = row;
			}
		}
		// ---- the walk: the results at time 0, then step after step to the end of the run ----
		readFrame(0);
		while (Qtime < dur || (dur === 0 && recIx === 0)) {
			e = qualStep();
			if (e) { return { ok: false, issues: [{ code: 'msx-run', ids: [String(e)] }] }; }
			readFrame(Qtime);
			yield { phase: 'msx', done: Qtime, of: dur };
			if (dur === 0) { break; }
		}
		result = { ok: true, species: spec.species.map(function (sp) { return { id: sp.id, wall: sp.type === 'WALL', units: sp.units, unitText: sp.units + '/' + (sp.type === 'WALL' ? (typeof EC.lpnMsxAreaUnits === 'function' && ctx.text ? EC.lpnMsxAreaUnits(ctx.text) : opt.areaUnits) : 'L') }; }) };
		return result;
	};

	// Constants other slices need, exported so one source holds them.
	EC.lpnMsxConst = { MISSING: MISSING, TINY: TINY, VISCOS: VISCOS, LPERFT3: LPERFT3, MPERFT: MPERFT, M2PERFT2: M2PERFT2, CM2PERFT2: CM2PERFT2, LPS_PER_CFS: LPS_PER_CFS, HYD_WORDS: HYD_WORDS };
}(typeof self !== 'undefined' ? self : typeof globalThis !== 'undefined' ? globalThis : this));
