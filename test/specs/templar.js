import templar from '../../src/templar';

describe('templar', () => {
    it('should append a template to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const root = document.createElement('div');
        const div = tpl.getRoot().childNodes[1];

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

    it('should know whether the template has been mounted to a parent element', () => {
        const tpl = templar('<div></div>');
        const root = document.createElement('div');

        expect(tpl.isMounted()).to.equal(false);

        tpl.mount(root);
        expect(tpl.isMounted()).to.equal(true);

        tpl.unmount();
        expect(tpl.isMounted()).to.equal(false);
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

    it('should return the root element of a template', () => {
        const tpl = templar('<div>foo</div>');
        const frag = tpl.frag;
        const root = document.createElement('div');

        expect(tpl.getRoot()).to.equal(frag);

        tpl.mount(root);
        expect(tpl.getRoot()).to.equal(root);

        tpl.unmount();
        expect(tpl.getRoot()).to.equal(frag);
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

    it('should query the template for elements', () => {
        const tpl = templar('<div></div>');
        const root = document.createElement('div');

        expect(tpl.query('div')[0]).to.equal(tpl.getRoot().childNodes[1]);
        tpl.mount(root);
        expect(tpl.query('div')[0]).to.equal(tpl.getRoot().childNodes[1]);
    });

    it('should not return non-template elements when querying', () => {
        const tpl = templar('<div></div><div><div></div></div><div></div>');
        const divs = tpl.query('div');

        const root = document.createElement('div');
        root.appendChild(document.createElement('div'));
        tpl.mount(root);
        root.appendChild(document.createElement('div'));

        const elements = tpl.query('div');
        expect(elements).to.deep.equal(divs);
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
