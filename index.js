"use strict";

var esprima = require('esprima');

function envarconst(code, consts){

	var ast = esprima.parse(code, {
		range: true
	});

	return walk(ast, consts, code);
}

function walk(ast, consts, code){

	var offset = 0;

	var _walk = function(ast){
		if (ast && ast.type == "VariableDeclaration" && ast.kind == "const"){
			var result = replace(ast, consts, code, offset);
			code = result.code;
			offset = result.offset;
		}

		if (Array.isArray(ast)) for (var i = 0; i < ast.length; i++){
			_walk(ast[i]);
		} else if (typeof ast == 'object') for (var k in ast){
			_walk(ast[k]);
		}
	};

	_walk(ast);

	return code;
}

function replace(ast, consts, code, offset){

	for (var i = 0; i < ast.declarations.length; i++){

		var declaration = ast.declarations[i];
		var name = declaration.id.name;

		if (!(name in consts)) continue;

		var range = declaration.init.range;

		code = code.slice(0, range[0] + offset) +
			consts[name] +
			code.slice(range[1] + offset);

		offset += consts[name].length + range[0] - range[1];

	}

	return {code: code, offset: offset};
}

module.exports = envarconst;
