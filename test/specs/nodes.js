import templar from '../../src/templar';

describe('nodes', () => {
    const root = document.createElement('div');

    beforeEach(() => {
        root.innerHTML = '';
    });

    it('should update text nodes', () => {
        const tpl = templar('{{foo}}', {foo: 'bar'});
        tpl.mount(root);

        expect(root.innerHTML).to.equal('bar');
        
        tpl.set('foo', 'baz');
        expect(root.innerHTML).to.equal('baz');

        tpl.set('foo', 123);
        expect(root.innerHTML).to.equal('123');
    });
    
    it('should update element nodes', () => {
        const tpl = templar('<div>{{foo}}</div>', {foo: 'bar'});
        tpl.mount(root);

        expect(root.innerHTML).to.equal('<div>bar</div>');

        tpl.set('foo', 'baz');
        expect(root.innerHTML).to.equal('<div>baz</div>');
    });

    it('should updates multiple tokens within an element', () => {
        const tpl = templar('<div>{{foo}} {{bar}}</div>');
        tpl.mount(root);

        tpl.set('foo', '123');
        tpl.set('bar', '456');
        expect(root.innerHTML).to.equal('<div>123 456</div>');

        tpl.set('bar', '789');
        expect(root.innerHTML).to.equal('<div>123 789</div>');
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div>{{ foo }}</div>');
        tpl.mount(root);

        tpl.set('foo', 'bar');
        expect(root.innerHTML).to.equal('<div>bar</div>');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div>{{foo}}</div><span>{{foo}}</span>');
        tpl.mount(root);

        tpl.set('foo', 'bar');
        expect(root.innerHTML).to.equal('<div>bar</div><span>bar</span>');
    });

    it('should support setting multiple values via a key/value map', () => {
        const tpl = templar('<div>{{foo}}</div><span>{{bar}}</span>');
        tpl.mount(root);

        tpl.set({foo: 123, bar: 456});
        expect(root.innerHTML).to.equal('<div>123</div><span>456</span>');
    });

    it('should support interpolation with a DOM node', () => {
        const tpl = templar('<div>{{foo}}</div>');
        tpl.mount(root);

        const el = document.createElement('strong');
        tpl.set('foo', el);
        expect(root.innerHTML).to.equal('<div><strong></strong></div>');
        expect(root.querySelector('strong')).to.equal(el);
    });

    it('should support interpolation with a DOM fragment', () => {
        const tpl = templar('<div>{{foo}}</div>');
        tpl.mount(root);

        const frag = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) frag.appendChild(document.createTextNode(i));
        tpl.set('foo', frag);

        expect(root.innerHTML).to.equal('<div>012</div>');
    });

    it('should parse an HTML string by default', () => {
        const tpl = templar('<div>{{foo}}</div>');
        tpl.mount(root);

        tpl.set('foo', '<strong>foo</strong>');
        expect(root.innerHTML).to.equal('<div><strong>foo</strong></div>');
    });

    it('should escape HTML characters if the token is immediately preceeded by an ampersand', () => {
        const tpl = templar('<div>{{&foo}}</div>');
        tpl.mount(root);

        tpl.set('foo', '<i id="foo" class=\'bar\'>baz</i>');
        expect(root.innerHTML).to.equal('<div>&lt;i id="foo" class=\'bar\'&gt;baz&lt;/i&gt;</div>');
    });

    it('should support nested templates', () => {
        const tpl1 = templar('<div>{{foo}}</div>');
        const tpl2 = templar('<em>{{bar}}</em>');
        const tpl3 = templar('<strong>{{baz}}</strong>');
        tpl1.mount(root);

        tpl1.set('foo', tpl2);
        tpl2.set('bar', tpl3);
        tpl3.set('baz', 'qux');
        expect(root.innerHTML).to.equal('<div><em><strong>qux</strong></em></div>');

        tpl3.set('baz', 'quxx');
        expect(root.innerHTML).to.equal('<div><em><strong>quxx</strong></em></div>');

        tpl1.set('foo', '123');
        expect(root.innerHTML).to.equal('<div>123</div>');
    });

    it('should update multiple elements between existing elements', () => {
        const tpl1 = templar('<div>123 {{foo}} 456 {{bar}} 789 {{baz}} 101112</div>');
        const tpl2 = templar('<div>{{a}}</div><div>{{b}}</div>');
        tpl1.mount(root);

        const frag = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
            const div = document.createElement('em');
            div.textContent = i;
            frag.appendChild(div);
        }

        tpl1.set('foo', tpl2);
        tpl1.set('bar', '<span>a</span><span>b</span>');
        tpl1.set('baz', frag);
        tpl2.set('a', 1);
        tpl2.set('b', 2);
        expect(root.innerHTML).to.equal('<div>123 <div>1</div><div>2</div> 456 <span>a</span><span>b</span> 789 <em>0</em><em>1</em><em>2</em> 101112</div>');

        tpl1.set('foo', 'abc');
        tpl1.set('bar', 'def');
        tpl1.set('baz', 'ghi');
        expect(root.innerHTML).to.equal('<div>123 abc 456 def 789 ghi 101112</div>');

        tpl1.set('foo', tpl2);
        tpl2.set('a', 3);
        expect(root.innerHTML).to.equal('<div>123 <div>3</div><div>2</div> 456 def 789 ghi 101112</div>');
    });

    it('should not render the token until it is defined', () => {
        const tpl = templar('<div>{{foo}}</div>');
        tpl.mount(root);

        expect(root.innerHTML).to.equal('<div></div>');

        tpl.set('foo', 'bar');
        expect(root.innerHTML).to.equal('<div>bar</div>');
    });

    it('should emit a "change" custom event when a node is updated', () => {
        const tpl = templar('<div>{{foo}}</div>');
        const div = tpl.query('div')[0];

        const onChange = sinon.spy((el) => {
            expect(el).to.equal(div);
        });

        tpl.on('change', onChange);
        tpl.set('foo', 'bar');

        expect(onChange.called).to.equal(true);
    });

    it('should ignore leading/trailing line breaks', () => {
        const tpl = templar(`
            <div>{{foo}}</div>
        `);
        tpl.mount(root);

        tpl.set('foo', 'bar');
        expect(root.innerHTML).to.equal('<div>bar</div>');
    });

    it('should support an array of children', () => {
        const tpl = templar('<div>{{foo}}</div>');
        tpl.mount(root);

        const frag = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) frag.appendChild(document.createTextNode(i));

        tpl.set('foo', [
            'foo',
            document.createElement('span'),
            document.createTextNode('bar'),
            frag,
            345,
            '<em></em>'
        ]);
        expect(root.innerHTML).to.equal('<div>foo<span></span>bar012345&lt;em&gt;&lt;/em&gt;</div>');
    });
});
