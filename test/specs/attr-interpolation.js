import templar from '../../src';

describe('attribute interpolation', () => {
    it('should support interpolation', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', 'foo');
        expect(tpl.query('div')[0].id).to.equal('foo');
    });

    it('should support multiple tokens within an attribute', () => {
        const tpl = templar('<div class="foo bar {{class1}} {{class2}}"></div>');
        tpl.set('class1', 'baz');
        tpl.set('class2', 'qux');
        expect(tpl.query('div')[0].className.split(/\s+/).join(' ')).to.equal('foo bar baz qux');
    });

    it('should support the removal of an attribute if the value is an empty string or false', () => {
        const tpl = templar('<div id="{{id}}" disabled="{{disabled}}"></div>');
        tpl.set('id', '');
        tpl.set('disabled', false);
        const div = tpl.query('div')[0];
        expect(div.hasAttribute('foo')).to.equal(false);
        expect(div.hasAttribute('disabled')).to.equal(false);
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div id="{{ foo }}"></div>');
        tpl.set('foo', 'bar');
        expect(tpl.query('div')[0].id).to.equal('bar');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div id="{{value}}" class="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.query('div')[0].id).to.equal('foo');
        expect(tpl.query('div')[0].className).to.equal('foo');
    });

    it('should support passing a key/value map', () => {
        const tpl = templar('<div id="{{foo}}" class="{{bar}}"></div>');
        tpl.set({foo: 123, bar: 456});
        expect(tpl.query('div')[0].id).to.equal('123');
        expect(tpl.query('div')[0].className).to.equal('456');
    });

    it('should ignore a null value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.query('div')[0].id).to.equal('foo');
        tpl.set('value', null);
        expect(tpl.query('div')[0].id).to.equal('foo');
    });

    it('should ignore an undefined value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.query('div')[0].id).to.equal('foo');
        tpl.set('value', void 0);
        expect(tpl.query('div')[0].id).to.equal('foo');
    });

    it('should support default interpolation on initialization', () => {
        const tpl = templar('<div id="{{foo}}"></div>', {foo: 123});
        expect(tpl.query('div')[0].id).to.equal('123');
    });

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.get('value')).to.equal('foo');
    });

    it('should support the style attribute', () => {
        const tpl = templar('<div style="width: {{width}}px; height: {{height}}px;"></div>');
        tpl.set('width', 10);
        tpl.set('height', 20);
        expect(tpl.query('div')[0].style.cssText).to.equal('width: 10px; height: 20px;');
    });

    it('should support the value property', () => {
        const tpl = templar('<input type="text" value="{{value}}" />');
        tpl.set('value', 'foo');
        expect(tpl.query('input')[0].value).to.equal('foo');
    });
});
