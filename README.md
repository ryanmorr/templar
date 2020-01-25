# templar

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> A simple and versatile DOM templating engine

## Install

Download the [CJS](https://github.com/ryanmorr/templar/raw/master/dist/templar.cjs.js), [ESM](https://github.com/ryanmorr/templar/raw/master/dist/templar.esm.js), [UMD](https://github.com/ryanmorr/templar/raw/master/dist/templar.umd.js) versions or install via NPM:

``` sh
npm install @ryanmorr/templar
```

## Usage

Template syntax is similar to your standard mustache templates with double curly braces (`{{` `}}`) serving as delimiters to internal logic. The tokens found between the delimiters are the reference point for the value of its place in the template::

```javascript
import templar from '@ryanmorr/templar';

// Create a new template
const tpl = templar('<div id="{{id}}">{{content}}</div>');

// Set the id and content
tpl.set('id', 'foo');
tpl.set('content', 'bar');

// Append to the DOM
tpl.mount(document.body);
```

Internally, templar updates only the parts of the DOM that have changed and makes use of `requestAnimationFrame` to [batch DOM manipulations for increased performance](http://wilsonpage.co.uk/preventing-layout-thrashing/).

## Interpolation

Supports basic interpolation with strings and numbers:

```javascript
const tpl = templar('<div id="{{foo}}">{{bar}}</div>');

tpl.set('foo', 'aaa');
tpl.set('bar', 123);
```

DOM nodes are also supported, including text nodes, elements, document fragments, and HTML strings:

```javascript
const tpl = templar('<div>{{foo}} {{bar}} {{baz}}</div>');

tpl.set('foo', document.createElement('div'));
tpl.set('bar', document.createDocumentFragment());
tpl.set('baz', '<strong>bold</strong>');
```

Set CSS styles as a string or object:

```javascript
const tpl = templar('<div style="{{style}}"></div>');

tpl.set('style', 'width: 10px; height: 10px');
tpl.set('style', {width: '20px', height: '20px'});
```

Add and remove event listeners:

```javascript
const tpl = templar('<button onclick={{onClick}}>Click Me!</button>');

tpl.set('onClick', (e) => {
    // Handle the click event
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

tpl.set('foo', '<i>foo</i>'); //=> &lt;i&gt;foo&lt;/i&gt;
```

Setting an attribute/event to null, undefined, or false will remove it from the element:

```javascript
const tpl = templar('<div id="{{id}}"></div>');

tpl.set('id', null);
tpl.query('div')[0].hasAttribute('id'); //=> false
```

## API

### templar(tpl, [data])

Create a new template by providing a template string and optionally provide a data object to set default values:

```javascript
const tpl = templar('<div id="{{foo}}">{{bar}}</div>', {
    foo: 'abc',
    bar: 123
});
```

### templar#set(token, [value])

Set the value of a token and trigger the template to dynamically update with the new value. You can also provide an object literal to set multiple tokens at once:

```javascript
const tpl = templar('<div id="{{foo}}">{{bar}} {{baz}}</div>');

// Set a single value
tpl.set('foo', 'aaa');

// Set multiple values
tpl.set({
    bar: 'bbb',
    baz: 'ccc'
});
```

### templar#get(token)

Get the current value of a token:

```javascript
const tpl = templar('<div id="{{foo}}"></div>', {foo: 123});

tpl.get('foo'); //=> 123
```

### templar#mount(root)

Append the template to an element:

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.mount(document.body);
```

### templar#unmount()

Remove the template from its parent element:

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.mount(document.body);
tpl.unmount();
```

### templar#on(name, callback)

Subcribe a callback function to a custom event (mount, unmount, change, attributechange). Returns a function capable of removing the listener.

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.on('mount', (element) => {
    // Executed when the template is appended to an element
});

tpl.on('unmount', () => {
    // Executed when the template is removed from an element
});

tpl.on('change', (element) => {
    // Executed when the contents of an element are updated
});

const off = tpl.on('attributechange', (element, oldValue, newValue) => {
    // Executed when an attribute changes
    off(); // Remove custom event listener
});
```

### templar#getRoot()

Get the root element of the template. This is the document fragment before it has been mounted, and the parent element after:

```javascript
const tpl = templar('<div>{{foo}}</div>');
const container = document.createElement('div');

tpl.getRoot(); //=> document fragment
tpl.mount(container);
tpl.getRoot(); //=> container
```

### templar#query(selector)

Query only the template for every element matching the provided CSS selector and return an array:

```javascript
const tpl = templar('<span></span><span></span><span></span>');

tpl.query('span').forEach((el) => {
    // Do something with the span elements
});
```

### templar#isMounted()

Check if the template has been mounted to a parent element:

```javascript
const tpl = templar('<div>{{foo}}</div>');
const container = document.createElement('div');

tpl.isMounted(); //=> false
tpl.mount(container);
tpl.isMounted(); //=> true
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/templar
[version-image]: https://badge.fury.io/gh/ryanmorr%2Ftemplar.svg
[build-url]: https://travis-ci.org/ryanmorr/templar
[build-image]: https://travis-ci.org/ryanmorr/templar.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE