import templar from '../../src';

describe('node interpolation', () => {
    it('should support interpolation', () => {
        const tpl = templar('<div>{{value}}</div>');
        const div = tpl.query('div')[0];
        const textNode = div.firstChild;
        tpl.set('value', 'foo');
        // The template engine should not use `requestAnimationFrame` if
        // the fragment hasn't been mounted to the DOM, so these
        // assertions should work synchronously
        expect(tpl.query('div')[0].textContent).to.equal('foo');
        // The div should not be removed when updating its content
        expect(tpl.query('div')[0]).to.equal(div);
        // Only the inner text node should be replaced
        expect(tpl.query('div')[0].firstChild).to.not.equal(textNode);
    });

    it('should support only text node interpolation', () => {
        const tpl = templar('{{foo}}');
        tpl.set('foo', 'bar');
        expect(tpl.getRoot().childNodes[1].data).to.equal('bar');
    });

    it('should support multiple tokens within an element', () => {
        const tpl = templar('<div>{{foo}} {{bar}}</div>');
        tpl.set('foo', 'aaa');
        tpl.set('bar', 'bbb');
        expect(tpl.query('div')[0].textContent).to.equal('aaa bbb');
    });

    it('should support leading and trailing spaces between delimiters of tokens', () => {
        const tpl = templar('<div>{{ foo }}</div>');
        tpl.set('foo', 'bar');
        expect(tpl.query('div')[0].textContent).to.equal('bar');
    });

    it('should support the same token more than once', () => {
        const tpl = templar('<div>{{value}}</div><span>{{value}}</span>');
        tpl.set('value', 'foo');
        expect(tpl.query('div')[0].textContent).to.equal('foo');
        expect(tpl.query('span')[0].textContent).to.equal('foo');
    });

    it('should support passing a key/value map', () => {
        const tpl = templar('<div>{{foo}}</div><span>{{bar}}</span>');
        tpl.set({foo: 123, bar: 456});
        expect(tpl.query('div')[0].textContent).to.equal('123');
        expect(tpl.query('span')[0].textContent).to.equal('456');
    });

    it('should support interpolation with a DOM node', () => {
        const tpl = templar('<div>{{value}}</div>');
        const el = document.createElement('strong');
        tpl.set('value', el);
        expect(tpl.query('div')[0].firstChild).to.equal(el);
    });

    it('should support interpolation with a DOM fragment', () => {
        const tpl = templar('<div>{{value}}</div>');
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
            frag.appendChild(document.createTextNode(i));
        }
        tpl.set('value', frag);
        expect(tpl.query('div')[0].textContent).to.equal('012');
    });

    it('should support parsing and interpolation of an HTML string', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', '<strong>foo</strong>');
        expect(tpl.query('div')[0].firstChild.nodeName).to.equal('STRONG');
        expect(tpl.query('div')[0].firstChild.textContent).to.equal('foo');
    });

    it('should support nested templates', () => {
        const tpl = templar('<div>{{foo}}</div>');
        const tpl2 = templar('<em>{{bar}}</em>');
        const tpl3 = templar('<strong>{{baz}}</strong>');
        const container = document.createElement('div');
        tpl.mount(container);
        tpl.set('foo', tpl2);
        tpl2.set('bar', tpl3);
        tpl3.set('baz', 'qux');
        expect(container.innerHTML).to.equal('<div><em><strong>qux</strong></em></div>');
    });

    it('should support escaping HTML characters', () => {
        const tpl = templar('<div>{{&value}}</div>');
        tpl.set('value', '<i id="foo" class=\'bar\'>bar</i>');
        expect(tpl.query('div')[0].textContent).to.equal('&lt;i id=&#39;foo&#39; class=&quot;bar&quot;&gt;bar&lt;/i&gt;');
    });

    it('should support multiple element interpolation between existing elements', () => {
        const tpl = templar('<div>123 {{foo}} 456 {{bar}} 789 {{baz}} 101112</div>');
        const tpl2 = templar('<div>{{a}}</div><div>{{b}}</div>');
        tpl2.set('a', 1);
        const frag = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
            const div = document.createElement('em');
            div.textContent = i;
            frag.appendChild(div);
        }
        tpl.set('foo', tpl2);
        tpl.set('bar', '<span>a</span><span>b</span>');
        tpl.set('baz', frag);
        tpl2.set('b', 2);
        expect(tpl.query('div')[0].innerHTML).to.equal('123 <div>1</div><div>2</div> 456 <span>a</span><span>b</span> 789 <em>0</em><em>1</em><em>2</em> 101112');
        tpl.set('foo', 'abc');
        tpl.set('bar', 'efg');
        tpl.set('baz', 'hij');
        expect(tpl.query('div')[0].innerHTML).to.equal('123 abc 456 efg 789 hij 101112');
        tpl.set('foo', tpl2);
        tpl2.set('a', 3);
        expect(tpl.query('div')[0].innerHTML).to.equal('123 <div>3</div><div>2</div> 456 efg 789 hij 101112');
    });

    it('should support default interpolation on initialization', () => {
        const tpl = templar('<div>{{foo}}</div>', {foo: 'bar'});
        expect(tpl.query('div')[0].textContent).to.equal('bar');
    });

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div>{{value}}</div>');
        tpl.set('value', 'foo');
        expect(tpl.get('value')).to.equal('foo');
    });

    it('should not render the changes until all tokens are defined', () => {
        const tpl = templar('<div>{{foo}} {{bar}}</div>');
        const spy = sinon.spy(tpl.bindings.foo[0], 'render');
        tpl.set('foo', 123);
        expect(spy.callCount).to.equal(0);
        tpl.set('bar', 456);
        expect(spy.callCount).to.equal(1);
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

    it('should not schedule a frame if the template has been mounted to a parent element but not rendered within the DOM', () => {
        const tpl = templar('<div>{{foo}}</div>');
        const spy = sinon.spy(window, 'requestAnimationFrame');
        const container = document.createElement('div');
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(spy.called).to.equal(false);
        expect(container.querySelector('div').textContent).to.equal('aaa');
        spy.restore();
    });

    it('should schedule a frame to update the template if it is rendered within the DOM', (done) => {
        const tpl = templar('<div>{{foo}}</div>');
        const spy = sinon.spy(window, 'requestAnimationFrame');
        // Append to the DOM
        const container = document.createElement('div');
        document.body.appendChild(container);
        // Mount the template to a parent element, which should
        // use `requestAnimationFrame` for updates
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(spy.called).to.equal(true);
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            expect(container.querySelector('div').textContent).to.equal('aaa');
            document.body.removeChild(container);
            spy.restore();
            done();
        });
    });

    it('should only schedule one callback per frame per binding', (done) => {
        const tpl = templar('<div>{{foo}} {{bar}}</div>');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const renderSpy = sinon.spy(tpl.bindings.foo[0], 'render');
        // Append to the DOM
        const container = document.createElement('div');
        document.body.appendChild(container);
        // Once the template has been mounted and rendered to the
        // DOM, an animation frame should be requested for updates
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        tpl.set('bar', 'bbb');
        expect(requestSpy.callCount).to.equal(1);
        // Updating a binding more than once in succession should
        // not schedule another frame
        tpl.set('bar', 'ccc');
        expect(requestSpy.callCount).to.equal(1);
        // Restore the original methods
        requestSpy.restore();
        renderSpy.restore();
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            // The actual render method should only be called once
            expect(renderSpy.callCount).to.equal(1);
            expect(container.querySelector('div').textContent).to.equal('aaa ccc');
            document.body.removeChild(container);
            done();
        });
    });

    it('should only schedule one frame per cycle', (done) => {
        const tpl = templar('<div>{{foo}}</div><span>{{bar}}</span>');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        // Append to the DOM
        const container = document.createElement('div');
        document.body.appendChild(container);
        // Once the template has been mounted and rendered to the
        // DOM, an animation frame should be requested for updates
        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(requestSpy.callCount).to.equal(1);
        // Immediately updating one binding after another should cancel
        // the current frame and start a new one
        tpl.set('bar', 'bbb');
        expect(requestSpy.callCount).to.equal(1);
        // Check the updates in the next frame
        requestAnimationFrame(() => {
            // Restore the original methods
            requestSpy.restore();
            expect(container.querySelector('div').textContent).to.equal('aaa');
            expect(container.querySelector('span').textContent).to.equal('bbb');
            document.body.removeChild(container);
            done();
        });
    });
});
