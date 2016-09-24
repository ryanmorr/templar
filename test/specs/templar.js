/* eslint-disable max-len */

import { expect } from 'chai';
import templar from '../../src/templar';

describe('templar', () => {
    it('should implicitly parse the HTML template string to a DOM fragment on initialization', () => {
        const tpl = templar('<section><div>{{foo}}</div><span>{{bar}}</span></section>');
        const el = tpl.getRoot().childNodes[0];
        const children = el.childNodes;
        expect(el.tagName.toLowerCase()).to.equal('section');
        expect(children).to.have.length(2);
        expect(children[0].tagName.toLowerCase()).to.equal('div');
        expect(children[0].textContent).to.equal('{{foo}}');
        expect(children[1].tagName.toLowerCase()).to.equal('span');
        expect(children[1].textContent).to.equal('{{bar}}');
    });

    it('should support appending a template to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');
        const div = tpl.getRoot().childNodes[0];
        tpl.mount(container);
        expect(container.contains(div)).to.equal(true);
    });

    it('should support removing the template from the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');
        const frag = tpl.frag;
        const div = frag.childNodes[0];
        tpl.mount(container);
        tpl.unmount();
        expect(container.contains(div)).to.equal(false);
        expect(frag.contains(div)).to.equal(true);
        expect(frag.childNodes.length).to.equal(1);
    });

    it('should know whether the template has been mounted to a parent element', () => {
        const tpl = templar('<div>{{value}}</div>');
        const container = document.createElement('div');
        expect(tpl.isMounted()).to.equal(false);
        tpl.mount(container);
        expect(tpl.isMounted()).to.equal(true);
        tpl.unmount();
        expect(tpl.isMounted()).to.equal(false);
    });

    it('should know whether the template has been rendered to the DOM', () => {
        const tpl = templar('<div>{{value}}</div>');
        const container = document.createElement('div');
        expect(tpl.isMounted()).to.equal(false);
        expect(tpl.isRendered()).to.equal(false);
        tpl.mount(container);
        expect(tpl.isMounted()).to.equal(true);
        expect(tpl.isRendered()).to.equal(false);
        document.body.appendChild(container);
        expect(tpl.isMounted()).to.equal(true);
        expect(tpl.isRendered()).to.equal(true);
        tpl.unmount();
        expect(tpl.isMounted()).to.equal(false);
        expect(tpl.isRendered()).to.equal(false);
        document.body.removeChild(container);
    });

    it('should support getting the template\'s root element', () => {
        const tpl = templar('<div>foo</div>');
        const frag = tpl.frag;
        const container = document.createElement('div');
        expect(tpl.getRoot()).to.equal(frag);
        tpl.mount(container);
        expect(tpl.getRoot()).to.equal(container);
        tpl.unmount();
        expect(tpl.getRoot()).to.equal(frag);
    });

    it('should return null for the value of a non-existent token', () => {
        const tpl = templar('<div></div>');
        expect(tpl.get('value')).to.equal(null);
    });

    it('should support querying the template for a single element', () => {
        const tpl = templar('<div></div>');
        const container = document.createElement('div');
        expect(tpl.find('div')).to.equal(tpl.getRoot().childNodes[0]);
        tpl.mount(container);
        expect(tpl.find('div')).to.equal(tpl.getRoot().childNodes[0]);
    });

    it('should support querying the template for a single element before it has been mounted to the DOM', () => {
        const tpl = templar('<div></div>');
        const el = tpl.find('div');
        expect(el.nodeType).to.equal(1);
        expect(el).to.equal(tpl.getRoot().childNodes[0]);
    });

    it('should support querying the template for a single element after it has been mounted to the DOM', () => {
        const tpl = templar('<div></div>');
        const container = document.createElement('div');
        tpl.mount(container);
        const el = tpl.find('div');
        expect(el.nodeType).to.equal(1);
        expect(el).to.equal(tpl.getRoot().childNodes[0]);
    });

    it('should support querying the template for an array of elements before it has been mounted to the DOM', () => {
        const tpl = templar('<div></div>');
        const els = tpl.query('div');
        expect(els).to.be.an('array');
        expect(els).to.deep.equal([].slice.call(tpl.getRoot().querySelectorAll('div')));
    });

    it('should support querying the template for an array of elements after it has been mounted to the DOM', () => {
        const tpl = templar('<div></div>');
        const container = document.createElement('div');
        tpl.mount(container);
        const els = tpl.query('div');
        expect(els).to.be.an('array');
        expect(els).to.deep.equal([].slice.call(container.querySelectorAll('div')));
    });
});
