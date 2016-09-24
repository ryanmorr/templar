/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import templar from '../../src/templar';

describe('attr interpolation', () => {
    it('should support interpolation', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', 'foo');
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
    });

    it('should support multiple tokens within an attribute', () => {
        const tpl = templar('<div class="foo bar {{class1}} {{class2}}"></div>');
        tpl.set('class1', 'baz');
        tpl.set('class2', 'qux');
        expect(tpl.frag.childNodes[0].className.split(/\s+/).join(' ')).to.equal('foo bar baz qux');
    });

    it('should support the removal of an attribute if none is defined', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', '');
        expect(tpl.frag.childNodes[0].hasAttribute('foo')).to.equal(false);
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div id="{{ foo }}"></div>');
        tpl.set('foo', 'bar');
        expect(tpl.frag.childNodes[0].id).to.equal('bar');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div id="{{value}}" class="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
        expect(tpl.frag.childNodes[0].className).to.equal('foo');
    });

    it('should support passing a key/value map', () => {
        const tpl = templar('<div id="{{foo}}" class="{{bar}}"></div>');
        tpl.set({foo: 123, bar: 456});
        expect(tpl.frag.childNodes[0].id).to.equal('123');
        expect(tpl.frag.childNodes[0].className).to.equal('456');
    });

    it('should ignore a null value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
        tpl.set('value', null);
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
    });

    it('should ignore an undefined value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
        tpl.set('value', void 0);
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
    });

    it('should support dot-notation interpolation', () => {
        const tpl = templar('<div id="{{object.key}}" class="{{object.data.value}}"></div>');
        tpl.set('object', {
            key: 'foo',
            data: {
                value: 'bar'
            }
        });
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
        expect(tpl.frag.childNodes[0].className).to.equal('bar');
    });

    it('should support token callback functions', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', () => 'foo');
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
    });

    it('should support default interpolation on initialization', () => {
        const tpl = templar('<div id="{{foo}}"></div>', {foo: 123});
        expect(tpl.frag.childNodes[0].id).to.equal('123');
    });

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.get('value')).to.equal('foo');
    });

    it('should schedule a frame to make dynamic updates in the DOM', (done) => {
        const tpl = templar('<div id="{{foo}}"></div>');
        const container = document.createElement('div');
        const spy = sinon.spy(window, 'requestAnimationFrame');
        // Mount the template to a parent element, which should
        // use `requestAnimationFrame` for updates
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(spy.called).to.equal(true);
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            expect(container.firstChild.id).to.equal('aaa');
            spy.restore();
            done();
        });
    });

    it('should only schedule one callback per frame per binding', (done) => {
        const tpl = templar('<div class="{{foo}} {{bar}}"></div>');
        const container = document.createElement('div');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const renderSpy = sinon.spy(tpl.bindings.foo[0], 'render');

        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(requestSpy.callCount).to.equal(1);
        // Updating a binding more than once in succession should
        // not schedule another frame
        tpl.set('bar', 'bbb');
        expect(requestSpy.callCount).to.equal(1);
        // Restore the original methods
        requestSpy.restore();
        renderSpy.restore();
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            // The actual render method should only be called once
            expect(renderSpy.callCount).to.equal(1);
            expect(container.firstChild.className).to.equal('aaa bbb');
            done();
        });
    });

    it('should only schedule one frame per cycle', (done) => {
        const tpl = templar('<div id="{{foo}}"></div><div id="{{bar}}"></div>');
        const container = document.createElement('div');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');
        // Mount the template to a parent element, which should
        // use `requestAnimationFrame` for updates
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(requestSpy.callCount).to.equal(1);
        expect(cancelSpy.callCount).to.equal(0);
        // Immediately updating one binding after another should cancel
        // the current frame and start a new one
        tpl.set('bar', 'bbb');
        expect(requestSpy.callCount).to.equal(2);
        expect(cancelSpy.callCount).to.equal(1);
        // Restore the original methods
        requestSpy.restore();
        cancelSpy.restore();
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            expect(requestSpy.callCount).to.equal(2);
            expect(cancelSpy.callCount).to.equal(1);
            expect(container.firstChild.id).to.equal('aaa');
            expect(container.lastChild.id).to.equal('bbb');
            done();
        });
    });
});
