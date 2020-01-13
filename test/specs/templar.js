import templar from '../../src';

describe('templar', () => {
    it('should support appending a template to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');
        const div = tpl.getRoot().childNodes[1];

        tpl.mount(container);

        expect(container.contains(div)).to.equal(true);
    });

    it('should support removing the template from the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');
        const frag = tpl.frag;
        const div = frag.childNodes[1];

        tpl.mount(container);
        tpl.unmount();

        expect(container.contains(div)).to.equal(false);
        expect(frag.contains(div)).to.equal(true);
        expect(frag.childNodes.length).to.equal(3);
    });

    it('should know whether the template has been mounted to a parent element', () => {
        const tpl = templar('<div></div>');
        const container = document.createElement('div');

        expect(tpl.isMounted()).to.equal(false);

        tpl.mount(container);
        expect(tpl.isMounted()).to.equal(true);

        tpl.unmount();
        expect(tpl.isMounted()).to.equal(false);
    });

    it('should support appending and removing a template between multiple elements', () => {
        const container = document.createElement('div');
        for (let i = 0; i < 3; i++) {
            container.appendChild(document.createElement('div'));
        }

        const tpl = templar('<div>foo</div><div>bar</div><div>baz</div>');
        const nodes = Array.from(tpl.frag.childNodes);
        tpl.mount(container);

        for (let i = 0; i < 3; i++) {
            container.appendChild(document.createElement('div'));
        }

        tpl.unmount();

        expect(Array.from(tpl.frag.childNodes)).to.deep.equal(nodes);
        expect(container.childNodes.length).to.equal(6);
    });

    it('should support getting the template\'s root element', () => {
        const tpl = templar('<div>foo</div>');
        const frag = tpl.frag;
        const container = document.createElement('div');

        expect(tpl.getRoot()).to.equal(frag);

        tpl.mount(container);
        expect(tpl.getRoot()).to.equal(container);

        tpl.unmount();
        expect(tpl.getRoot()).to.equal(frag);
    });

    it('should support the retrieval of the current value of a token', () => {
        const tpl = templar('<div>{{foo}}</div>', {foo: 'bar'});

        expect(tpl.get('foo')).to.equal('bar');

        tpl.set('foo', 'baz');
        expect(tpl.get('foo')).to.equal('baz');
    });

    it('should return null for the value of a non-existent token', () => {
        const tpl = templar('<div></div>');
        expect(tpl.get('value')).to.equal(null);
    });

    it('should support querying the template for elements', () => {
        const tpl = templar('<div></div>');
        const container = document.createElement('div');

        expect(tpl.query('div')[0]).to.equal(tpl.getRoot().childNodes[1]);
        tpl.mount(container);
        expect(tpl.query('div')[0]).to.equal(tpl.getRoot().childNodes[1]);
    });

    it('should support querying the template for an array of elements before it has been mounted to the DOM', () => {
        const tpl = templar('<div></div>');
        const els = tpl.query('div');

        expect(els).to.be.an('array');
        expect(els).to.deep.equal(Array.from(tpl.getRoot().querySelectorAll('div')));
    });

    it('should support querying the template for an array of elements after it has been mounted to the DOM', () => {
        const tpl = templar('<div></div>');
        const container = document.createElement('div');

        tpl.mount(container);
        const els = tpl.query('div');

        expect(els).to.be.an('array');
        expect(els).to.deep.equal(Array.from(container.querySelectorAll('div')));
    });

    it('should support method chaining', () => {
        const tpl = templar('<div></div>');
        const container = document.createElement('div');

        expect(tpl.mount(container)).to.equal(tpl);
        expect(tpl.unmount()).to.equal(tpl);
        expect(tpl.set('foo', 'foo')).to.equal(tpl);
    });

    it('should dispatch the "mount" custom event when a template is mounted to the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');

        const onMount = sinon.spy((root) => expect(root).to.equal(container));

        tpl.on('mount', onMount);
        tpl.mount(container);

        expect(onMount.called).to.equal(true);
    });

    it('should dispatch the "unmount" custom event when a template is unmounted from the DOM', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');

        const onUnmount = sinon.spy();

        tpl.on('unmount', onUnmount);
        tpl.mount(container);
        tpl.unmount();

        expect(onUnmount.called).to.equal(true);
    });

    it('should remove a listener for a custom event', () => {
        const tpl = templar('<div>foo</div>');
        const container = document.createElement('div');

        const onMount = sinon.spy();

        const off = tpl.on('mount', onMount);
        tpl.mount(container);

        expect(onMount.callCount).to.equal(1);

        off();
        tpl.unmount();
        tpl.mount(container);

        expect(onMount.callCount).to.equal(1);
    });
});
