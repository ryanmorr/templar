/* eslint-disable max-len */

import { expect } from 'chai';
import templar from '../../src';

describe('expressions', () => {
    it('should support dot-notation interpolation', () => {
        const tpl = templar('<div>{{object.key}}</div><span>{{object.data.value}}</span>');
        tpl.set('object', {
            key: 'foo',
            data: {
                value: 'bar'
            }
        });
        expect(tpl.find('div').textContent).to.equal('foo');
        expect(tpl.find('span').textContent).to.equal('bar');
    });

    it('should support array access', () => {
        const tpl = templar('<div>{{ array[2] }}</div>');
        tpl.set('array', ['foo', 'bar', 'baz', 'qux']);
        expect(tpl.find('div').textContent).to.equal('baz');
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
});
