envarconst
==========

Make JavaScript `const` variable.

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

License
-------

MIT
