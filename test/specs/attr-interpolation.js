import templar from '../../src';

describe('attribute interpolation', () => {
    it('should support interpolation', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', 'foo');
        expect(tpl.find('div').id).to.equal('foo');
    });

    it('should support multiple tokens within an attribute', () => {
        const tpl = templar('<div class="foo bar {{class1}} {{class2}}"></div>');
        tpl.set('class1', 'baz');
        tpl.set('class2', 'qux');
        expect(tpl.find('div').className.split(/\s+/).join(' ')).to.equal('foo bar baz qux');
    });

    it('should support the removal of an attribute if none is defined', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.set('id', '');
        expect(tpl.find('div').hasAttribute('foo')).to.equal(false);
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div id="{{ foo }}"></div>');
        tpl.set('foo', 'bar');
        expect(tpl.find('div').id).to.equal('bar');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div id="{{value}}" class="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.find('div').id).to.equal('foo');
        expect(tpl.find('div').className).to.equal('foo');
    });

    it('should support passing a key/value map', () => {
        const tpl = templar('<div id="{{foo}}" class="{{bar}}"></div>');
        tpl.set({foo: 123, bar: 456});
        expect(tpl.find('div').id).to.equal('123');
        expect(tpl.find('div').className).to.equal('456');
    });

    it('should ignore a null value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.find('div').id).to.equal('foo');
        tpl.set('value', null);
        expect(tpl.find('div').id).to.equal('foo');
    });

    it('should ignore an undefined value', () => {
        const tpl = templar('<div id="{{value}}"></div>');
        tpl.set('value', 'foo');
        expect(tpl.find('div').id).to.equal('foo');
        tpl.set('value', void 0);
        expect(tpl.find('div').id).to.equal('foo');
    });

    it('should support default interpolation on initialization', () => {
        const tpl = templar('<div id="{{foo}}"></div>', {foo: 123});
        expect(tpl.find('div').id).to.equal('123');
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
        expect(tpl.find('div').style.cssText).to.equal('width: 10px; height: 20px;');
    });

    it('should support the value property', () => {
        const tpl = templar('<input type="text" value="{{value}}" />');
        tpl.set('value', 'foo');
        expect(tpl.find('input').value).to.equal('foo');
    });
});
