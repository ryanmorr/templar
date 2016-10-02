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
});
