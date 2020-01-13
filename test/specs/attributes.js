import templar from '../../src';

describe('attributes', () => {
    const root = document.createElement('div');

    beforeEach(() => {
        root.innerHTML = '';
    });

    it('should update an attribute', () => {
        const tpl = templar('<div id="{{foo}}"></div>', {foo: 'bar'});
        tpl.mount(root);

        tpl.set('foo', 'bar');
        expect(root.innerHTML).to.equal('<div id="bar"></div>');

        tpl.set('foo', 'baz');
        expect(root.innerHTML).to.equal('<div id="baz"></div>');
    });

    it('should update multiple tokens within an attribute', () => {
        const tpl = templar('<div class="foo bar {{class1}} {{class2}}"></div>');
        tpl.mount(root);

        tpl.set({'class1': 'baz', 'class2': 'qux'});
        expect(root.innerHTML).to.equal('<div class="foo bar baz qux"></div>')
    });

    it('should remove an attribute if the value is null, undefined, or false', () => {
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
        tpl.mount(root);

        tpl.set('foo', 'bar');
        expect(root.innerHTML).to.equal('<div id="bar"></div>');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div id="{{foo}}" class="{{foo}}"></div>');
        tpl.mount(root);

        tpl.set('foo', 'bar');
        expect(root.innerHTML).to.equal('<div id="bar" class="bar"></div>');
    });

    it('should set CSS styles as a string', () => {
        const tpl = templar('<div style="{{style}}"></div>');
        tpl.mount(root);

        tpl.set('style', 'background-color: rgb(20, 20, 20); position: static;');
        expect(root.innerHTML).to.equal('<div style="background-color: rgb(20, 20, 20); position: static;"></div>');
    });

    it('should set CSS styles as a key/value map', () => {
        const tpl = templar('<div style="{{style}}"></div>');
        tpl.mount(root);

        tpl.set('style', {width: '30px', height: '42px'});
        expect(root.innerHTML).to.equal('<div style="width: 30px; height: 42px;"></div>');
    });

    it('should support CSS variables', (done) => {
        const tpl = templar('<div style="{{style}}"></div>');
        const div = tpl.query('div')[0];
        tpl.mount(root);
        document.body.appendChild(root);

        tpl.set('style', {color: 'var(--color)', '--color': 'red'});
        requestAnimationFrame(() => {
            expect(div.style.color).to.equal('var(--color)');
            expect(window.getComputedStyle(div).getPropertyValue('color')).to.equal('rgb(255, 0, 0)');
            expect(window.getComputedStyle(div).getPropertyValue('--color')).to.equal('red');

            document.body.removeChild(root);
            done();
        }); 
    });

    it('should support style templating', () => {
        const tpl = templar('<div style="width: {{width}}px; height: {{height}}px;"></div>');
        tpl.mount(root);

        tpl.set('width', 10);
        tpl.set('height', 20);
        expect(root.innerHTML).to.equal('<div style="width: 10px; height: 20px;"></div>');
    });

    it('should support boolean attributes', () => {
        const tpl = templar('<input type="checkbox" checked={{checked}} />');
        const checkbox = tpl.query('input')[0];

        tpl.set('checked', true);
        expect(checkbox.checked).to.equal(true);
        
        tpl.set('checked', false);
        expect(checkbox.checked).to.equal(false);
    });

    it('should support dynamic properties', () => {
        const tpl = templar('<input type="text" value="{{value}}" />');
        const input = tpl.query('input')[0];

        tpl.set('value', 'foo');
        expect(input.value).to.equal('foo');
    });

    it('should add an event listener', (done) => {
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

    it('should remove an event listener if the value is null', (done) => {
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
