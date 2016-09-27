/* eslint-disable max-len */

import { expect } from 'chai';
import templar from '../../src/templar';

describe('attribute interpolation', () => {
    it('should support interpolation', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', 'foo');
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
    });

    it('should support multiple tokens within an attribute', () => {
        const tpl = templar('<div class="foo bar {{class1}} {{class2}}"></div>');
        tpl.set('class1', 'baz');
        tpl.set('class2', 'qux');
        expect(tpl.getRoot().childNodes[0].className.split(/\s+/).join(' ')).to.equal('foo bar baz qux');
    });

    it('should support the removal of an attribute if none is defined', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', '');
        expect(tpl.getRoot().childNodes[0].hasAttribute('foo')).to.equal(false);
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div id="{{ foo }}"></div>');
        tpl.set('foo', 'bar');
        expect(tpl.getRoot().childNodes[0].id).to.equal('bar');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div id="{{value}}" class="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
        expect(tpl.getRoot().childNodes[0].className).to.equal('foo');
    });

    it('should support passing a key/value map', () => {
        const tpl = templar('<div id="{{foo}}" class="{{bar}}"></div>');
        tpl.set({foo: 123, bar: 456});
        expect(tpl.getRoot().childNodes[0].id).to.equal('123');
        expect(tpl.getRoot().childNodes[0].className).to.equal('456');
    });

    it('should ignore a null value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
        tpl.set('value', null);
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
    });

    it('should ignore an undefined value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
        tpl.set('value', void 0);
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
    });

    it('should support dot-notation interpolation', () => {
        const tpl = templar('<div id="{{object.key}}" class="{{object.data.value}}"></div>');
        tpl.set('object', {
            key: 'foo',
            data: {
                value: 'bar'
            }
        });
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
        expect(tpl.getRoot().childNodes[0].className).to.equal('bar');
    });

    it('should support token callback functions', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', () => 'foo');
        expect(tpl.getRoot().childNodes[0].id).to.equal('foo');
    });

    it('should support passing the data object to token callback functions', () => {
        const tpl = templar('<div id="{{foo}}" class="{{bar}}"></div>');
        tpl.set('foo', 5);
        tpl.set('bar', (data) => {
            return data.foo * 2;
        });
        expect(tpl.getRoot().childNodes[0].id).to.equal('5');
        expect(tpl.getRoot().childNodes[0].className).to.equal('10');
    });

    it('should support default interpolation on initialization', () => {
        const tpl = templar('<div id="{{foo}}"></div>', {foo: 123});
        expect(tpl.getRoot().childNodes[0].id).to.equal('123');
    });

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.get('value')).to.equal('foo');
    });
});
