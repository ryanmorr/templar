import templar from '../../src';

describe('attribute interpolation', () => {
    const root = document.createElement('div');

    beforeEach(() => {
        root.innerHTML = '';
    });

    it('should update an attribute', () => {
        const tpl = templar('<div id="{{id}}"></div>');
        tpl.mount(root);

        tpl.set('id', 'foo');
        expect(root.innerHTML).to.equal('<div id="foo"></div>');
    });

    it('should update multiple tokens within an attribute', () => {
        const tpl = templar('<div class="foo bar {{class1}} {{class2}}"></div>');

        tpl.set('class1', 'baz');
        tpl.set('class2', 'qux');

        expect(tpl.query('div')[0].className.split(/\s+/).join(' ')).to.equal('foo bar baz qux');
    });

    it('should support the removal of an attribute if the value is null, undefined, or false', () => {
        const tpl = templar('<div disabled="{{disabled}}"></div>');
        const div = tpl.query('div')[0];

        tpl.set('disabled', true);
        expect(div.hasAttribute('disabled')).to.equal(true);

        tpl.set('disabled', false);
        expect(div.hasAttribute('disabled')).to.equal(false);

        tpl.set('disabled', true);
        expect(div.hasAttribute('disabled')).to.equal(true);

        tpl.set('disabled', null);
        expect(div.hasAttribute('disabled')).to.equal(false);

        tpl.set('disabled', true);
        expect(div.hasAttribute('disabled')).to.equal(true);

        tpl.set('disabled', void 0);
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

    it('should add an event', (done) => {
        const tpl = templar('<div onclick="{{click}}"></div>');
        const div = tpl.query('div')[0];
        const evt = new MouseEvent('click');

        const onClick = sinon.spy((e) => {
            expect(e).to.equal(evt);
            done();
        });

        tpl.set('click', onClick);

        div.dispatchEvent(evt);
    });

    it('should remove an event if the value is null', (done) => {
        const tpl = templar('<div onclick="{{click}}"></div>');
        const div = tpl.query('div')[0];
        const removeEventSpy = sinon.spy(div, 'removeEventListener');
        const evt = new MouseEvent('click');

        const onClick = sinon.spy(() => {
            tpl.set('click', null);
            expect(removeEventSpy.called).to.equal(true);
            expect(removeEventSpy.calledWith('click', onClick)).to.equal(true);
            removeEventSpy.restore();
            done();
        });

        tpl.set('click', onClick);

        div.dispatchEvent(evt);
    });

    it('should emit a "attributechange" custom event when a node attribute is updated', () => {
        const tpl = templar('<div id="{{foo}}"></div>', {foo: 'foo'});
        const div = tpl.query('div')[0];

        const onChange = sinon.spy((el, oldValue, value) => {
            expect(el).to.equal(div);
            expect(oldValue).to.equal('foo');
            expect(value).to.equal('bar');
        });

        tpl.on('attributechange', onChange);
        tpl.set('foo', 'bar');

        expect(onChange.called).to.equal(true);
    });
});