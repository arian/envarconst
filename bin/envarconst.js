#! /usr/bin/env node
"use strict";

var fs = require('fs');
var envarconst = require('../');

var args = process.argv.slice(2);
var file;
var consts = Object.create(null);

function help(){
	console.log("\n" +
		"Usage: envarconst [options] [file]\n\n" +
		"Options:\n" +
		" -v   --version:   displays current envarconst version\n" +
		" -h   --help:      displays this help\n\n" +
		" -d   --define     define constant (e.g. -d FOO=true)\n" +
		"If no filename is specified, envarconst will try to read from stdin\n");
	process.exit(0);
}

function setConst(arg){
	var parts = arg.split('=');
	if (parts.length <= 1){
		console.warn(arg + " is not a valid --define option");
		return;
	}
	consts[parts.shift()] = parts.join('=');
}

for (var i = 0; i < args.length; i++){

	if (args[i] == '--help' || args[i] == '-h'){
		help();
	} else if (args[i] == '--version' || args[i] == '-v'){
		console.log(require('../package.json').version);
		process.exit(0);
	} else if (args[i] == '--define' || args[i] == '-d'){
		setConst(args[++i]);
	} else if (!code){
		file = args[i];
	}

}

if (file){

	fs.readFile(file, "utf-8", function(err, code){
		if (err){
			console.error("could not find the file " + file);
		} else {
			console.log(envarconst(code, consts));
		}
	});

} else {

	process.stdin.resume();
	process.stdin.setEncoding("utf-8");
	var code = "";
	process.stdin.on('data', function(chunk){
		code += chunk;
	});
	process.stdin.on('end', function(){
		console.log(envarconst(code, consts));
	});

}
