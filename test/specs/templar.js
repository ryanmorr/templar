import templar from '../../src/templar';

describe('templar', () => {
    it('should append a template to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const root = document.createElement('div');
        const div = tpl.frag.childNodes[1];

        tpl.mount(root);

        expect(root.contains(div)).to.equal(true);
    });

    it('should remove a template from the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const root = document.createElement('div');
        const frag = tpl.frag;
        const div = frag.childNodes[1];

        tpl.mount(root);
        tpl.unmount();

        expect(root.contains(div)).to.equal(false);
        expect(frag.contains(div)).to.equal(true);
        expect(frag.childNodes.length).to.equal(3);
    });

    it('should support extracting a template between multiple elements', () => {
        const root = document.createElement('div');
        for (let i = 0; i < 3; i++) {
            root.appendChild(document.createElement('div'));
        }

        const tpl = templar('<div>foo</div><div>bar</div><div>baz</div>');
        const nodes = Array.from(tpl.frag.childNodes);
        tpl.mount(root);

        for (let i = 0; i < 3; i++) {
            root.appendChild(document.createElement('div'));
        }

        tpl.unmount();

        expect(Array.from(tpl.frag.childNodes)).to.deep.equal(nodes);
        expect(root.childNodes.length).to.equal(6);
    });

    it('should return the current value of a token', () => {
        const tpl = templar('<div>{{foo}}</div>', {foo: 'bar'});

        expect(tpl.get('foo')).to.equal('bar');

        tpl.set('foo', 'baz');
        expect(tpl.get('foo')).to.equal('baz');
    });

    it('should return null for the value of a non-existent token', () => {
        const tpl = templar('<div></div>');
        expect(tpl.get('value')).to.equal(null);
    });

    it('should dispatch the "mount" custom event when a template is appended to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const root = document.createElement('div');

        const onMount = sinon.spy((root) => expect(root).to.equal(root));

        tpl.on('mount', onMount);
        tpl.mount(root);

        expect(onMount.called).to.equal(true);
    });

    it('should dispatch the "unmount" custom event when a template is removed from the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const root = document.createElement('div');

        const onUnmount = sinon.spy();

        tpl.on('unmount', onUnmount);
        tpl.mount(root);
        tpl.unmount();

        expect(onUnmount.called).to.equal(true);
    });

    it('should remove a listener for a custom event', () => {
        const tpl = templar('<div>foo</div>');
        const root = document.createElement('div');

        const onMount = sinon.spy();

        const off = tpl.on('mount', onMount);
        tpl.mount(root);

        expect(onMount.callCount).to.equal(1);

        off();
        tpl.unmount();
        tpl.mount(root);

        expect(onMount.callCount).to.equal(1);
    });
});
