# modulejs

[![license][license-img]][github] [![github][github-img]][github] [![npm][npm-img]][npm]  

A lightweight JavaScript module system (only ~2kB minified). It is not a module loader, it triggers no file system lookups or HTTP requests. It simply helps organizing code in small, maintainable and easy to use modules. Modules respect and resolve dependencies, the syntax is very similar to that of [RequireJS](https://requirejs.org).


## Usage

Define a module without dependencies.
```js
modulejs.define('a', function () {
    // do and return whatever you like
    // ...
    return {val: 1};
});
```

Define a module with dependencies.
```js
modulejs.define('b', ['a'], function (a) {
    // ...
    return [a.val, a.val + 1];
});
```

Define another module.
```js
modulejs.define('main', ['jquery', 'b'], function ($, b) {
    // ...
    return {
        start: function () {
            console.log(b);
        }
    };
});
```

It's easy to register 3rd party objects.
```js
modulejs.define('modernizr', Modernizr);
```

But you need to be careful with 'objects' that actually are functions, wrap them in functions.
```js
modulejs.define('jquery', function () {
    return jQuery;
});
```

Finally require one of the defined modules and run some code (for example after all DOM content is loaded).
```js
document.addEventListener('DOMContentLoaded', function () {
    var main = modulejs.require('main');
    main.start();
});
```


## API

### define

Defines a module through a constructor function. This function will only be called once when module is first required. The return value will be stored and returned whenever this module will be required.
```js
// id: string, fn: function  ->  undefined
modulejs.define(id, fn)
```

Same as above but with dependencies that get resolved first and will be passed in as arguments to the constructor.
```js
// id: string, deps: array of strings, fn: function  ->  undefined
modulejs.define(id, deps, fn)
```

Defines a module through an already existing object that gets returned whenever the module is required.
```js
// id: string, obj: object  ->  undefined
modulejs.define(id, obj)
```

Same as above but with dependencies that get resolved first.
```js
// id: string, deps: array of strings, obj: object  ->  undefined
modulejs.define(id, deps, obj)
```

### require

Returns an already defined module. Creates it if necessary.
```js
// id: string  ->  object
modulejs.require(id)
```

For testing purposes it's possible to provide mock instances for selected modules to override original module definitions.
```js
// id: string, mocks: object  ->  object
modulejs.require(id, mocks)
```

for example:
```js
modulejs.require('b', {a: 'testing'})
```

will resolve a dependency `a` with the string `testing` instead of the real module.

### state

Returns an object that represents the current state of all modules.
```js
//  ->  object
modulejs.state()
```

returns an object of the form:
```js
{
    // ...
    main: {
        deps: ['jquery', 'b']
        init: true
        reqd: []
        reqs: ['jquery', 'a', 'b']
    }
    // ...
}
```

### log

Returns a string representing module dependencies in a easy to read format. If `inv` is `true` it shows dependents for each module.
```js
// inv: boolean  ->  string
modulejs.log(inv)
```

The result will show all dependencies (transitiv):
```
* a -> [  ]
* b -> [ a ]
* main -> [ jquery, a, b ]
  modernizr -> [  ]
* jquery -> [  ]
```

and if `inv` is `true` it will show all dependents (transitiv):
```
* a -> [ b, main ]
* b -> [ main ]
* main -> [  ]
  modernizr -> [  ]
* jquery -> [ main ]
```

a `*` indicates whether a module was already instantiated.

### create

Returns a fresh, private instances of `modulejs` with no definitions or instances.
```js
//  ->  modulejs
modulejs.create()
```


## License
The MIT License (MIT)

Copyright (c) 2024 Lars Jung (https://larsjung.de)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


[github]: https://github.com/lrsjng/modulejs
[npm]: https://www.npmjs.org/package/modulejs

[license-img]: https://img.shields.io/badge/license-MIT-a0a060.svg?style=flat-square
[github-img]: https://img.shields.io/badge/github-lrsjng/modulejs-a0a060.svg?style=flat-square
[npm-img]: https://img.shields.io/badge/npm-modulejs-a0a060.svg?style=flat-square
