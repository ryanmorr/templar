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
        const tpl = templar('<div class="item block {{class}} {{class2}}"></div>');
        tpl.set('class', 'foo');
        tpl.set('class2', 'bar');
        expect(tpl.frag.childNodes[0].className.split(/\s+/).join(' ')).to.equal('item block foo bar');
    });

    it('should support rendering of a template to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');
        tpl.render(container);
        expect(container.firstChild.tagName.toLowerCase()).to.equal('div');
        expect(container.firstChild.textContent).to.equal('foo');
    });
});
