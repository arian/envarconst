"use strict";

var assert = require("assert");
var fs = require("fs");
var envarconst = require("../");

var files = ["simple"];
var finished = 0;

files.forEach(function(file){

	fs.readFile(__dirname + "/" + file + ".js", "utf-8", function(err, code){
		assert.ifError(err);
		code = envarconst(code, {
			FOO: "false",
			DEV: '"hellooo"',
			ES5: "true"
		});
		fs.readFile(__dirname + "/" + file + ".result.js", "utf-8", function(err, result){
			assert.ifError(err);
			assert.equal(code, result);
			done();
		});
	});

});

function done(){
	if (++finished == files.length){
		console.log("✓ tests passed");
	}
}
