import templar from '../../src';

describe('rendering', () => {
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

        const container = document.createElement('div');
        document.body.appendChild(container);

        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(spy.called).to.equal(true);

        requestAnimationFrame(() => {
            expect(container.querySelector('div').textContent).to.equal('aaa');
            document.body.removeChild(container);
            spy.restore();
            done();
        });
    });

    it('should only schedule one callback per frame per binding', (done) => {
        const tpl = templar('<div id="{{foo}} {{bar}}"></div>');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');
        const renderSpy = sinon.spy(tpl.bindings.foo[0], 'render');

        const container = document.createElement('div');
        document.body.appendChild(container);

        tpl.mount(container);
        tpl.set('foo', 'aaa');
        tpl.set('bar', 'bbb');
        expect(requestSpy.callCount).to.equal(1);

        tpl.set('bar', 'ccc');
        expect(requestSpy.callCount).to.equal(1);

        requestSpy.restore();
        renderSpy.restore();

        requestAnimationFrame(() => {
            expect(renderSpy.callCount).to.equal(1);
            expect(container.querySelector('div').id).to.equal('aaa ccc');

            document.body.removeChild(container);
            done();
        });
    });

    it('should only schedule one frame per cycle', (done) => {
        const tpl = templar('<div>{{foo}}</div><span>{{bar}}</span>');
        const requestSpy = sinon.spy(window, 'requestAnimationFrame');

        const container = document.createElement('div');
        document.body.appendChild(container);

        tpl.mount(container);
        tpl.set('foo', 'aaa');
        expect(requestSpy.callCount).to.equal(1);

        tpl.set('bar', 'bbb');
        expect(requestSpy.callCount).to.equal(1);

        requestAnimationFrame(() => {
            requestSpy.restore();
            expect(container.querySelector('div').textContent).to.equal('aaa');
            expect(container.querySelector('span').textContent).to.equal('bbb');

            document.body.removeChild(container);
            done();
        });
    });
});
