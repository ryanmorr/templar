# templar

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> A simple and versatile DOM templating engine

## Install

Download the [CJS](https://github.com/ryanmorr/templar/raw/master/dist/cjs/templar.js), [ESM](https://github.com/ryanmorr/templar/raw/master/dist/esm/templar.js), [UMD](https://github.com/ryanmorr/templar/raw/master/dist/umd/templar.js) versions or install via NPM:

``` sh
npm install @ryanmorr/templar
```

## Usage

Template syntax is similar to your standard mustache templates with double curly braces (`{{` `}}`) serving as delimiters to internal logic. The tokens found between the delimiters are the reference point for the value of its place in the template:

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

## API

### `templar(tpl, data?)`

Create a new template by providing a template string and optionally provide a data object to set default values:

```javascript
const tpl = templar('<div id="{{foo}}">{{bar}}</div>', {
    foo: 'abc',
    bar: 123
});
```

------

### `set(token, value?)`

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

------

### `get(token)`

Get the current value of a token:

```javascript
const tpl = templar('<div id="{{foo}}"></div>', {foo: 123});

tpl.get('foo'); //=> 123
```

------

### `mount(parent)`

Append the template to an element:

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.mount(document.body);
```

------

### `unmount()`

Remove the template from its parent element:

```javascript
const tpl = templar('<div>{{foo}}</div>');

tpl.mount(document.body);
tpl.unmount();
```

------

### `on(name, callback)`

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

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/templar
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/templar?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/templar/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/templar/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/templar?color=blue&style=flat-square
[license-url]: UNLICENSE