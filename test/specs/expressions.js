/* eslint-disable max-len */

import { expect } from 'chai';
import templar from '../../src';

describe('expressions', () => {
    it('should support dot-notation interpolation', () => {
        const tpl = templar('<div id="{{object.key}}">{{object.data.value}}</div>');
        const div = tpl.find('div');
        tpl.set('object', {
            key: 'foo',
            data: {
                value: 'bar'
            }
        });
        expect(div.id).to.equal('foo');
        expect(div.textContent).to.equal('bar');
    });

    it('should support array access', () => {
        const tpl = templar('<div id="{{array[0]}}">{{ array[2] }}</div>');
        const div = tpl.find('div');
        tpl.set('array', ['foo', 'bar', 'baz', 'qux']);
        expect(div.id).to.equal('foo');
        expect(div.textContent).to.equal('baz');
    });

    it('should support simple math expressions', () => {
        const tpl = templar('<div>{{foo + bar}}</div>');
        tpl.set('foo', 4);
        tpl.set('bar', 5);
        expect(tpl.find('div').textContent).to.equal('9');
        tpl.set('foo', 10);
        expect(tpl.find('div').textContent).to.equal('15');
        tpl.set('bar', 2);
        expect(tpl.find('div').textContent).to.equal('12');
    });

    it('should support the ternary operator', () => {
        const tpl = templar('<input type="checkbox" checked="{{ checked ? true : false }}">');
        tpl.set('checked', true);
        expect(tpl.find('input').checked).to.equal(true);
        tpl.set('checked', false);
        expect(tpl.find('input').checked).to.equal(false);
    });

    it('should support function invocations', () => {
        const tpl = templar('<div>{{foo() * bar()}}</div>');
        tpl.set('foo', () => 10);
        tpl.set('bar', () => 12);
        expect(tpl.find('div').textContent).to.equal('120');
    });

    it('should support functions that return a DOM node', () => {
        const tpl = templar('<div>{{value()}}</div>');
        tpl.set('value', () => document.createTextNode('foo'));
        expect(tpl.find('div').textContent).to.equal('foo');
    });

    it('should support passing variables to functions', () => {
        const tpl = templar('<div id="{{foo(3, 6)}}">{{foo(2, 4)}}</div>');
        const div = tpl.find('div');
        tpl.set('foo', (a, b) => a * b);
        expect(div.id).to.equal('18');
        expect(div.textContent).to.equal('8');
    });

    it('should support complex expressions', () => {
        const tpl = templar('<div>{{(foo + bar) + baz.qux + 7 + array[2]}}</div>');
        tpl.set({
            foo: 1,
            bar: 2,
            baz: {
                qux: 4
            },
            array: [1, 2, 3]
        });
        expect(tpl.find('div').textContent).to.equal('17');
    });
});
