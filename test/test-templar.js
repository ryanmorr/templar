/* eslint-disable max-len */

import { expect } from 'chai';
import templar from '../src/templar';

describe('templar', () => {
    it('should support node interpolation with a string', () => {
        const tpl = templar('<div>{{str}}</div>');
        tpl.set('str', 'foo');
        expect(tpl.frag.childNodes[0].textContent).to.equal('foo');
    });

    it('should support node interpolation with a number', () => {
        const tpl = templar('<div>{{num}}</div>');
        tpl.set('num', 25);
        expect(tpl.frag.childNodes[0].textContent).to.equal('25');
    });

    it('should support node interpolation with a boolean', () => {
        const tpl = templar('<div>{{bool}}</div>');
        tpl.set('bool', true);
        expect(tpl.frag.childNodes[0].textContent).to.equal('true');
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div>{{ foo }}</div>');
        tpl.set('foo', 'bar');
        expect(tpl.frag.childNodes[0].textContent).to.equal('bar');
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

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.get('value')).to.equal('foo');
    });

    it('should support rendering of a template to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');
        tpl.render(container);
        expect(container.firstChild.tagName.toLowerCase()).to.equal('div');
        expect(container.firstChild.textContent).to.equal('foo');
    });

    it('should know whether the template has been appended to the DOM or not', () => {
        const tpl = templar('<div>{{value}}</div>');
        const container = document.createElement('div');
        expect(tpl.isRendered()).to.equal(false);
        tpl.render(container);
        expect(tpl.isRendered()).to.equal(true);
    });
});
