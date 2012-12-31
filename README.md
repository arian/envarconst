envarconst
==========

Make JavaScript `const` variable.

[![Build Status](https://secure.travis-ci.org/arian/envarconst.png)](https://travis-ci.org/arian/envarconst)

The Idea
--------

UglifyJS and probably other minifiers remove dead code, when a `const` has a
value, which is used in an `if` statement elsewhere. For example:

```js
const ES5 = true;
if (ES5){
	console.log("I have ES5 features");
} else {
	console.log("I'm an old browser");
}
```

minifies to simply:

```js
console.log("I have ES5 features");
```

Now we can use this, to make, say, an mobile version, with mobile specific code,
or special code for development, with `DEV` code.

However, eventually, you want to deploy to production, or to another environment
target, so the `const` values have to change, from `const DEV = true`, to
`const DEV = false`, so all `if (DEV){ ... }` code is removed.

```
cat es5.js | envarconst -d ES5=false | uglifyjs -m -c
```

results in:

```js
console.log("I'm an old browser");
```

**envarconst** helps you to do this quickly!

How To Use It
-------------

### installation

```
npm install envarconst -g
```

### cli

envarconst comes with an cli tool which you can use.
It either reads from an file, or from stdin. When using stdin you can use Unix
pipes in your build process.

```
envarconst -d DEV=false -d MOBILE=true ./file.js
```

Using Unix pipes with wrapup and UglifyJS:

```
wrup -r ./mymodule | envarconst -d DEV=false | uglifyjs -m -c -o mymodule.min.js
```

### JavaScript

The JS API is very simple, simply require the module, and call the function
with the JS code and the new constants.

```js
var envarconst = require('envarconst');
envarconst("const FOO = false", {
	FOO: "true"
}); // "const FOO = true"
```

Why Not UglifyJS `--define`
---------------------------

UglifyJS doesn't replace variables or constants. So those variables defined
by `--define` are only later specified. This causes problems when you just want
to use `if (DEV){ ... }`, instead you have to do an extra
`typeof DEV != 'undefined'` check, which is ugly and too verbose.

But older browsers (IE) don't support `const`
---------------------------------------------

If you use [wrapup](https://github.com/mootools/wrapup) first, use AMD, or some
other pattern where your code is always in some
`(function(){ ... code here ... })();` function scope, UglifyJS will remove
all `const` declarations!

```
echo "(function(){ const FOO = true; console.log(FOO ? 'hey' : 'boo'); })();" | uglifyjs -m -c
```

results in:

```js
(function(){console.log("hey")})();
```

which is totally safe!

License
-------

MIT
