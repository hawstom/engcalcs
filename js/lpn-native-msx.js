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

	// Constants other slices need, exported so one source holds them.
	EC.lpnMsxConst = { MISSING: MISSING, TINY: TINY, VISCOS: VISCOS, LPERFT3: LPERFT3, MPERFT: MPERFT, M2PERFT2: M2PERFT2, CM2PERFT2: CM2PERFT2, LPS_PER_CFS: LPS_PER_CFS, HYD_WORDS: HYD_WORDS };
}(typeof self !== 'undefined' ? self : typeof globalThis !== 'undefined' ? globalThis : this));
