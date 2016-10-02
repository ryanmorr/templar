# templar

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![Dependencies][dependencies-image]][project-url]
[![License][license-image]][license-url]
[![File Size][file-size-image]][project-url]

> A simple, yet intuitive DOM templating engine

## Usage

Template syntax is much like your standard mustache/handlbars templates with double curly braces (`{{` `}}`) serving as delimiters to indicate internal logic. The tokens found between the delimiters are the reference point for the value of its place in the template, Take for instance the following:

```javascript
import templar from 'templar';

// Create a new template
const tpl = templar('<div id="{{id}}">{{content}}</div>');

// Set the id and content
tpl.set('id', 'foo');
tpl.set('content', 'bar');

// Append to the DOM
tpl.mount(document.body);
```

Outputs:

```html
<div id="foo">bar</div>
```

Internally, templar updates only the parts of the DOM that have changed and makes use of `requestAnimationFrame` to [batch DOM manipulations for increased performance](http://wilsonpage.co.uk/preventing-layout-thrashing/).

## API

### templar(tpl[, data])

Create a new template by providing a template string and optionally provide a data object to set default values:

```javascript
const tpl = templar('<div id="{{foo}}">{{bar}}</div>', {
    foo: 'abc',
    bar: 123
});
```

### templar#set(token, value)

Set the value of a token and trigger the template to dynamically update with the new value. You can also provide an object literal to set multiple tokens at once.

Simple interpolation with primitive values (strings, numbers, and booleans):

```javascript
const tpl = templar('<div id="{{foo}}">{{bar}} {{baz}}</div>');

tpl.set('foo', 'aaa');
tpl.set('bar', 123);
tpl.set('baz', true);
```

DOM nodes are also supported, including elements, text nodes, document fragments, and HTML strings:

```javascript
const tpl = templar('<div>{{foo}} {{bar}} {{baz}}</div>');

tpl.set({
    foo: document.createElement('div'),
    bar: document.createDocumentFragment(),
    baz: '<strong>bold</strong>'
});
```

Use simple expressions, such as basic arithmetics, the ternary operator, array access, dot-notation, and function invocations:

```javascript
const tpl = templar('<div>{{foo ? foo + bar() + array[1] + obj.baz.qux : 0}}</div>');

tpl.set('foo', 2);
tpl.set('bar', () => 4);
tpl.set('array', [10, 20, 30]);
tpl.set('obj', {
    baz: {
        qux: 8
    }
});
```

You can even nest templates within templates:

```javascript
const div = templar('<div>{{content}}</div>');
const em = templar('<em>{{text}}</em>');
div.set('foo', em);
em.set('text', 'some text');
```

By default, HTML strings are automatically parsed into DOM nodes. To prevent this and escape HTML characters instead, prefix a token with an ampersand (&):

```javascript
const tpl = templar('<div>{{&foo}}</div>');

tpl.set('foo', '<i>foo</i>'); // &lt;i&gt;foo&lt;/i&gt;
```

Setting an attribute to an empty string will effectively remove the attribute from the element:

```javascript
const tpl = templar('<div id="{{id}}"></div>');

tpl.set('id', '');
tpl.find('div').hasAttribute('id'); // false
```

### templar#get(token)

Get the current value of a token:

```javascript
const tpl = templar('<div id="{{foo}}"></div>', {foo: 123});

tpl.get('foo'); // 123
```

### templar#mount(root)

Append the template to an element:

```javascript
const tpl = templar('<div>{{foo}}</div>');
const container = document.createElement('div');

tpl.mount(container);
```

### templar#unmount()

Remove the template from its parent element:

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.mount(document.body);
tpl.unmount();
```

### templar#getRoot()

Get the root element of the template. This is the document fragment before it has been mounted, and the parent element after:

```javascript
const tpl = templar('<div>{{foo}}</div>');
const container = document.createElement('div');

tpl.getRoot(); // document fragment
tpl.mount(container);
tpl.getRoot(); // container
```

### templar#isMounted()

Check if the template has been mounted to a parent element:

```javascript
const tpl = templar('<div>{{foo}}</div>');
const container = document.createElement('div');

tpl.isMounted(); // false
tpl.mount(container);
tpl.isMounted(); // true
```

### templar#isRendered()

Check if the template actually exists within the DOM:

```javascript
const tpl = templar('<div>{{foo}}</div>');
const container = document.createElement('div');

tpl.mount(container);
tpl.isRendered(); // false

document.body.appendChild(container);
tpl.isRendered(); // true
```

### templar#find(selector)

Query the template for the first element matching the provided CSS selector string:

```javascript
const tpl = templar('<button>{{foo}}</button>');

tpl.find('button').addEventListener('click', (e) => {
    // handle event
})
```

### templar#query(selector)

Query the template for all the elements matching the provided CSS selector string:

```javascript
const tpl = templar('<span></span><span></span><span></span>');

tpl.query('span').forEach((el) => {
    // do something
});
```

### templar#destroy()

Destroy the `templar` instance. This will remove the template from the DOM and nullify internal properties. This cannot be undone:

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.destroy();
```

### templar#isDestroyed()

Check if the `templar` instance has been destroyed:

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.isDestroyed(); // false
tpl.destroy();
tpl.isDestroyed(); // true
```

## Installation

templar is [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible with no dependencies. You can download the [development](http://github.com/ryanmorr/templar/raw/master/dist/templar.js) or [minified](http://github.com/ryanmorr/templar/raw/master/dist/templar.min.js) version, or install it in one of the following ways:

``` sh
npm install ryanmorr/templar

bower install ryanmorr/templar
```

## Tests

Open `test/runner.html` in your browser or test with PhantomJS by issuing the following commands:

``` sh
npm install
npm install -g gulp
gulp test
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/templar
[version-image]: https://badge.fury.io/gh/ryanmorr%2Ftemplar.svg
[build-url]: https://travis-ci.org/ryanmorr/templar
[build-image]: https://travis-ci.org/ryanmorr/templar.svg
[dependencies-image]: https://david-dm.org/ryanmorr/templar.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE
[file-size-image]: https://badge-size.herokuapp.com/ryanmorr/templar/master/dist/templar.min.js.svg?color=blue&label=file%20size