/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import templar from '../../src/templar';

describe('node interpolation', () => {
    it('should support interpolation', () => {
        const tpl = templar('<div>{{value}}</div>');
        const div = tpl.getRoot().childNodes[0];
        const textNode = div.firstChild;
        tpl.set('value', 'foo');
        // The template engine should not use `requestAnimationFrame` if
        // the fragment hasn't been mounted to the DOM, so these
        // assertions should work synchronously
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
        // The div should not be removed when updating its content
        expect(tpl.getRoot().childNodes[0]).to.equal(div);
        // Only the inner text node should be replaced
        expect(tpl.getRoot().childNodes[0].firstChild).to.not.equal(textNode);
    });

    it('should support multiple tokens within an element', () => {
        const tpl = templar('<div>{{foo}} {{bar}}</div>');
        tpl.set('foo', 'aaa');
        tpl.set('bar', 'bbb');
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('aaa bbb');
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div>{{ foo }}</div>');
        tpl.set('foo', 'bar');
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('bar');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div>{{value}}</div><div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
        expect(tpl.getRoot().childNodes[1].textContent).to.equal('foo');
    });

    it('should support passing a key/value map', () => {
        const tpl = templar('<div>{{foo}}</div><div>{{bar}}</div>');
        tpl.set({foo: 123, bar: 456});
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('123');
        expect(tpl.getRoot().childNodes[1].textContent).to.equal('456');
    });

    it('should ignore a null value', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
        tpl.set('value', null);
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
    });

    it('should ignore an undefined value', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
        tpl.set('value', void 0);
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
    });

    it('should support dot-notation interpolation', () => {
        const tpl = templar('<div>{{object.key}}</div><div>{{object.data.value}}</div>');
        tpl.set('object', {
            key: 'foo',
            data: {
                value: 'bar'
            }
        });
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
        expect(tpl.getRoot().childNodes[1].textContent).to.equal('bar');
    });

    it('should support token callback functions', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', () => 'foo');
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo');
    });

    it('should escape HTML characters by default', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo <i id="foo" class=\'bar\'>bar</i>');
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('foo &lt;i id=&#39;foo&#39; class=&quot;bar&quot;&gt;bar&lt;/i&gt;');
    });

    it('should support default interpolation on initialization', () => {
        const tpl = templar('<div>{{foo}}</div>', {foo: 'bar'});
        expect(tpl.getRoot().childNodes[0].textContent).to.equal('bar');
    });

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.get('value')).to.equal('foo');
    });

    it('should not schedule a frame if the template has been mounted to a parent element but not rendered within the DOM', () => {
        const tpl = templar('<div>{{foo}}</div>');
        const spy = sinon.spy(window, 'requestAnimationFrame');
        const container = document.createElement('div');
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(spy.called).to.equal(false);
        expect(container.firstChild.textContent).to.equal('aaa');
        spy.restore();
    });

    it('should schedule a frame to update the template if it is rendered within the DOM', (done) => {
        const tpl = templar('<div>{{foo}}</div>');
        const spy = sinon.spy(window, 'requestAnimationFrame');
        // Append to the DOM
        const container = document.createElement('div');
        document.body.appendChild(container);
        // Mount the template to a parent element, which should
        // use `requestAnimationFrame` for updates
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(spy.called).to.equal(true);
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            expect(container.firstChild.textContent).to.equal('aaa');
            document.body.removeChild(container);
            spy.restore();
            done();
        });
    });

    it('should only schedule one callback per frame per binding', (done) => {
        const tpl = templar('<div>{{foo}} {{bar}}</div>');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const renderSpy = sinon.spy(tpl.bindings.foo[0], 'render');
        // Append to the DOM
        const container = document.createElement('div');
        document.body.appendChild(container);
        // Once the template has been mounted and rendered to the
        // DOM, an animation frame should be requested for updates
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
            expect(container.firstChild.textContent).to.equal('aaa bbb');
            document.body.removeChild(container);
            done();
        });
    });

    it('should only schedule one frame per cycle', (done) => {
        const tpl = templar('<div>{{foo}}</div><div>{{bar}}</div>');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const cancelSpy = sinon.spy(window, 'cancelAnimationFrame');
        // Append to the DOM
        const container = document.createElement('div');
        document.body.appendChild(container);
        // Once the template has been mounted and rendered to the
        // DOM, an animation frame should be requested for updates
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
            expect(container.firstChild.textContent).to.equal('aaa');
            expect(container.lastChild.textContent).to.equal('bbb');
            document.body.removeChild(container);
            done();
        });
    });
});
