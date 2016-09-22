/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import templar from '../src/templar';

// Polyfill `requestAnimationFrame` and 'cancelAnimationFrame'
// for PhantomJS
window.requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || function requestAnimationFrame(cb) { return window.setTimeout(cb, 1000 / 60); };

window.cancelAnimationFrame = window.cancelAnimationFrame
    || function cancelAnimationFrame(id) { window.clearTimeout(id); };

describe('templar', () => {
    it('should support node content interpolation', () => {
        const tpl = templar('<div>{{value}}</div>');
        const div = tpl.frag.childNodes[0];
        const textNode = div.firstChild;
        tpl.set('value', 'foo');
        // The template engine should not use `requestAnimationFrame` if
        // the fragment hasn't been mounted to the DOM, so these
        // assertions should work synchronously
        expect(tpl.frag.childNodes[0].textContent).to.equal('foo');
        // The div should not be removed when updating its content
        expect(tpl.frag.childNodes[0]).to.equal(div);
        // Only the inner text node should be different
        expect(tpl.frag.childNodes[0].firstChild).to.not.equal(textNode);
    });

    it('should support attribute interpolation', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', 'foo');
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
    });

    it('should support multiple attribute interpolation', () => {
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
        const tpl = templar('<div>{{ foo }}</div>');
        tpl.set('foo', 'bar');
        expect(tpl.frag.childNodes[0].textContent).to.equal('bar');
    });

    it('should support multiple token interpolation', () => {
        const tpl = templar('<div id="{{value}}">{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.frag.childNodes[0].id).to.equal('foo');
        expect(tpl.frag.childNodes[0].textContent).to.equal('foo');
    });

    it('should support multiple interpolation via key/value map', () => {
        const tpl = templar('<div id="{{foo}}">{{bar}}</div>');
        tpl.set({
            foo: 123,
            bar: 456
        });
        expect(tpl.frag.childNodes[0].id).to.equal('123');
        expect(tpl.frag.childNodes[0].textContent).to.equal('456');
    });

    it('should not interpolate a null value', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.frag.childNodes[0].textContent).to.equal('foo');
        tpl.set('value', null);
        expect(tpl.frag.childNodes[0].textContent).to.equal('foo');
    });

    it('should not interpolate an undefined value', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.frag.childNodes[0].textContent).to.equal('foo');
        tpl.set('value', void 0);
        expect(tpl.frag.childNodes[0].textContent).to.equal('foo');
    });

    it('should support dynamic updates', (done) => {
        const tpl = templar('<div>{{foo}} {{bar}}</div>');
        const container = document.createElement('div');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');
        const renderSpy = sinon.spy(tpl.bindings.foo[0], 'render');
        // Mount the template to a parent element, which should
        // use `requestAnimationFrame` for updates
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(requestSpy.callCount).to.equal(1);
        expect(cancelSpy.callCount).to.equal(0);
        expect(renderSpy.callCount).to.equal(0);
        // Immediately updating one binding after another should cancel
        // the current frame and start a new one
        tpl.set('bar', 'bbb');
        expect(requestSpy.callCount).to.equal(2);
        expect(cancelSpy.callCount).to.equal(1);
        expect(renderSpy.callCount).to.equal(0);
        // Restore the original methods
        requestSpy.restore();
        cancelSpy.restore();
        renderSpy.restore();
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            expect(renderSpy.callCount).to.equal(2);
            expect(requestSpy.callCount).to.equal(2);
            expect(cancelSpy.callCount).to.equal(1);
            expect(container.firstChild.textContent).to.equal('aaa bbb');
            done();
        });
    });

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.get('value')).to.equal('foo');
    });

    it('should return null if trying to retrieve a non-existent token', () => {
        const tpl = templar('<div></div>');
        expect(tpl.get('value')).to.equal(null);
    });

    it('should support appending a template to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');
        tpl.mount(container);
        expect(container.firstChild.tagName.toLowerCase()).to.equal('div');
        expect(container.firstChild.textContent).to.equal('foo');
    });

    it('should know whether the template has been appended to the DOM or not', () => {
        const tpl = templar('<div>{{value}}</div>');
        const container = document.createElement('div');
        expect(tpl.isMounted()).to.equal(false);
        tpl.mount(container);
        expect(tpl.isMounted()).to.equal(true);
    });
});
